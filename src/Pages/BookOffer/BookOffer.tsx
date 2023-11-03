import React from "react";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { TextField, FormLabel } from "@mui/material";
import { DateTime } from "luxon";
import { FormControlLabel, Checkbox } from "@mui/material";
import { useAuthContext } from "components/auth/useAuthContext";
import { Offer, BookingFormDatas } from "./type";
import { createBooking, getOffer } from "./utils";
import { Content } from "components/DashboardContent";
import { Form } from "components/DashboardForm";
import { Line, Separator } from "Pages/SignIn/SignIn";
import { Flex, Title } from "./style";
import { Button } from "components/Button";

const BookOffer: React.FC = (): JSX.Element => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const uid = user?.id;
  const [offer, setOffer] = useState<Offer>({
    id: offerId as string,
    uid: "",
    departureDate: "",
    departurePoint: "",
    arrivalPoint: "",
    arrivalDate: "",
    currency: "",
    numberOfKilos: 0,
    price: 0,
    goods: [],
  });
  const [datas, setdatas] = useState<BookingFormDatas>({
    numberOfKilos: "",
    bookingDetails: "",
    goods: [],
  });
  const [isSubmitting, setissubmiting] = useState(false);

  useEffect(() => {
    (async () => {
      const _offer = await getOffer(offerId as string);
      if (_offer === undefined) {
        alert("No Such Document");
        throw Error("No Document");
      }
      setOffer({ ..._offer });
      setdatas({
        ...datas,
        goods: _offer.goods.map((good) => {
          return { name: good, checked: false };
        }),
      });
    })();
    return () => {};
  }, []);

  function validate() {
    if (datas.goods.filter((good) => good.checked === true).length === 0)
      return false;
    if (datas.bookingDetails === "") return false;
    if (datas.numberOfKilos === "") return false;
    return true;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const isDataValid = validate();
    if (!isDataValid) return;
    setissubmiting(true);
    const booking = {
      ...datas,
      goods: datas.goods
        .filter((good) => good.checked === true)
        .map((good) => good.name),
    };
    const isCreated = await createBooking(uid as string, offer, booking);
    if (isCreated === false) {
      alert("Error Creating Booking");
      setissubmiting(false);
      return;
    }
    setdatas({
      numberOfKilos: "",
      bookingDetails: "",
      goods: [],
    });
    setissubmiting(false);
    navigate("/mykilos");
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    let name = e.target.name;
    let value = e.target.value;
    setdatas({ ...datas, [name]: value });
  }

  function handleGoodSelection(e: React.ChangeEvent<HTMLInputElement>) {
    let name = e.target.name;
    setdatas({
      ...datas,
      goods: datas.goods.map((good) => {
        if (good.name === name) good.checked = !good.checked;
        return good;
      }),
    });
  }

  return (
    <Content>
      <Form onSubmit={handleSubmit}>
        <Title>Book an offer</Title>
        <TextField
          id="departurePoint"
          label="Departure Point"
          fullWidth
          name="departurePoint"
          margin="normal"
          variant="standard"
          value={offer.departurePoint}
          InputProps={{
            readOnly: true,
          }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          id="departureDate"
          label="Departure Date"
          fullWidth
          type="text"
          name="departureDate"
          variant="standard"
          value={DateTime.fromISO(offer.departureDate).toLocaleString(
            DateTime.DATE_MED
          )}
          InputProps={{
            readOnly: true,
          }}
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
        <TextField
          id="arrivalPoint"
          label="Arrival Point"
          fullWidth
          type="text"
          name="arrivalPoint"
          variant="standard"
          value={offer.arrivalPoint}
          InputProps={{
            readOnly: true,
          }}
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
        <TextField
          id="arrivalDate"
          label="Arrival Date"
          fullWidth
          type="text"
          name="arrivalDate"
          variant="standard"
          value={DateTime.fromISO(offer.arrivalDate).toLocaleString(
            DateTime.DATE_MED
          )}
          InputProps={{
            readOnly: true,
          }}
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
        <Flex>
          <TextField
            id="numberOfKilos"
            label="Weight"
            type="text"
            name="numberOfKilos"
            variant="standard"
            value={offer.numberOfKilos}
            InputProps={{
              endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            id="price"
            label="Price"
            type="text"
            name="price"
            variant="standard"
            value={`${offer.price} ${offer.currency}`}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">/ Kg</InputAdornment>
              ),
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
        </Flex>
        <FormLabel sx={{ mt: 2 }} component="legend">
          Goods Accepted
        </FormLabel>
        {offer.goods.length &&
          offer.goods.map((good) => {
            return (
              <FormControlLabel
                key={offer.goods.indexOf(good)}
                control={<Checkbox checked={true} />}
                label={good}
              />
            );
          })}
        <Separator>
          <Line />
          <p style={{ fontWeight: "bold" }}>To Be Completed</p>
          <Line />
        </Separator>
        <FormLabel component="legend">Goods to send *</FormLabel>
        {datas.goods.length > 0 &&
          datas.goods.map((good) => {
            return (
              <FormControlLabel
                label={good.name}
                onChange={handleGoodSelection}
                name={good.name}
                key={datas.goods.indexOf(good)}
                control={
                  <Checkbox className="goodToSend" checked={good.checked} />
                }
              />
            );
          })}
        <Flex>
          <TextField
            id="weight"
            label="Weight"
            type="text"
            name="numberOfKilos"
            variant="standard"
            InputProps={{
              endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
            }}
            onChange={handleInputChange}
            required
            value={datas.numberOfKilos}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            margin="normal"
          />
          <TextField
            id="details"
            label="More Details"
            multiline
            rows={2}
            onChange={handleInputChange}
            fullWidth
            name="bookingDetails"
            value={datas.bookingDetails}
            inputProps={{
              maxLength: 70,
            }}
            margin="normal"
          />
        </Flex>
        {isSubmitting ? (
          <div className="lds-dual-ring"></div>
        ) : (
          <Button type="submit" value="Send Booking" />
        )}
      </Form>
    </Content>
  );
};

export default BookOffer;
