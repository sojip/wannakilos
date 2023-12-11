import React from "react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { SelectChangeEvent, TextField } from "@mui/material";
import {
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import "./EditOffer.css";
import { useNavigate } from "react-router";
import { DateTime } from "luxon";

type Offer = {
  departureDate: DateTime | null;
  departurePoint: string;
  arrivalDate: DateTime | null;
  arrivalPoint: string;
  numberOfKilos: number;
  price: number;
  currency: string;
};
type Good = {
  name: string;
  checked: boolean;
};

type EditFormDatas = Offer & {
  goods: Good[];
};

const EditOffer: React.FC = (): JSX.Element => {
  let { offerId } = useParams();
  let navigate = useNavigate();
  const goods: Good[] = [
    { name: "A", checked: false },
    { name: "B", checked: false },
    { name: "C", checked: false },
    { name: "D", checked: false },
  ];
  const currencies = ["$ (Dollars)", "€ (Euros)", "F (Fcfa)"];

  const [offer, setOffer] = useState<EditFormDatas>({
    departurePoint: "",
    arrivalPoint: "",
    departureDate: null,
    arrivalDate: null,
    numberOfKilos: 0,
    price: 0,
    currency: "",
    goods: [],
  });
  const [isUpdating, setisUpdating] = useState(false);

  useEffect(() => {
    async function getOfferDetails(id: string) {
      const docRef = doc(db, "offers", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOffer({
          departurePoint: data.departurePoint,
          arrivalPoint: data.arrivalPoint,
          departureDate: DateTime.fromISO(data.departureDate),
          arrivalDate: DateTime.fromISO(data.arrivalDate),
          numberOfKilos: data.numberOfKilos,
          price: data.price,
          currency: data.currency,
          goods: goods.map((good) => {
            if (data.goods.includes(good.name)) good.checked = true;
            return good;
          }),
        });
        // setOffer(docSnap.data());
        // let goods_ = goods.map((good) => {
        //   if (docSnap.data().goods.includes(good.name)) good.checked = true;
        //   return good;
        // });
        // setgoods(goods_);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }

    getOfferDetails(offerId as string);
  }, []);

  useEffect(() => {
    console.log(offer);
  }, [offer]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setisUpdating(true);
    e.preventDefault();
    // add goods accepted to datas
    // let acceptedGoods = goods.filter((good) => good.checked === true);
    // let goods_ = acceptedGoods.map((good) => good.name);
    // update offer in database
    const offerRef = doc(db, "offers", offerId as string);
    // Set the "capital" field of the city 'DC'
    await updateDoc(offerRef, {
      departurePoint: offer.departurePoint.toLowerCase(),
      arrivalPoint: offer.arrivalPoint.toLowerCase(),
      departureDate: offer.departureDate?.toISODate(),
      arrivalDate: offer.arrivalDate?.toISODate(),
      numberOfKilos: Number(offer.numberOfKilos),
      price: Number(offer.price),
      currency: offer.currency,
      goods: offer.goods
        .filter((good) => good.checked === true)
        .map((good) => good.name),
      // goods: goods_,
      updatedOn: serverTimestamp(),
    });
    // e.target.reset();
    setisUpdating(false);
    navigate("/mykilos");

    return;
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;
    let name = e.target.name;
    setOffer({ ...offer, [name]: value });
    return;
  }

  function handleSelectChange(e: SelectChangeEvent<HTMLInputElement>) {
    let value = e.target.value;
    let name = e.target.name;
    setOffer({ ...offer, [name]: value });
    return;
  }

  function handleGoodSelection(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    let name = e.target.name;
    setOffer({
      ...offer,
      goods: offer.goods.map((good) => {
        if (good.name === name) good.checked = !good.checked;
        return good;
      }),
    });
    // let checked = e.target.checked;
    // setgoods(
    //   goods.map((good) => {
    //     if (good.name === name) good.checked = checked;
    //     return good;
    //   })
    // );
  }

  // let goodsCheckbox = goods.map((good) => {
  //   return (
  //     <li key={goods.indexOf(good)}>
  //       <FormControlLabel
  //         control={
  //           <Checkbox
  //             onChange={handleGoodSelection}
  //             id={good.name}
  //             name={good.name}
  //             checked={good.checked}
  //           />
  //         }
  //         label={good.name}
  //       />
  //     </li>
  //   );
  // });

  return (
    <div className="container">
      <div className="editOffer formWrapper">
        <h2 style={{ textAlign: "center" }}>Edit an offer </h2>
        <form id="editOfferForm" onSubmit={handleSubmit}>
          <TextField
            id="departurePoint"
            label="Departure Point"
            required
            onChange={handleInputChange}
            value={offer.departurePoint}
            fullWidth
            type="text"
            name="departurePoint"
            margin="normal"
            variant="standard"
            InputLabelProps={{ shrink: true }}
          />
          {/* <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DatePicker
              label="Departure Date"
              value={offer.departureDate}
              onChange={(newValue) => {
                setOffer({
                  ...offer,
                  departureDate: newValue.toISODate(),
                });
              }}
              renderInput={(params) => (
                <TextField
                  margin="normal"
                  variant="standard"
                  fullWidth
                  {...params}
                  helperText={"mm/dd/yyyy"}
                  required
                />
              )}
            />
          </LocalizationProvider> */}
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DatePicker
              label="Departure Date"
              value={offer.departureDate}
              onChange={(newValue) => {
                setOffer({
                  ...offer,
                  departureDate: newValue,
                });
              }}
              renderInput={(params) => (
                <TextField
                  margin="normal"
                  variant="standard"
                  fullWidth
                  {...params}
                  helperText={"mm/dd/yyyy"}
                  required
                />
              )}
            />
          </LocalizationProvider>
          <TextField
            id="arrivalPoint"
            label="Arrival Point"
            required
            onChange={handleInputChange}
            value={offer.arrivalPoint}
            fullWidth
            type="text"
            name="arrivalPoint"
            variant="standard"
            InputLabelProps={{ shrink: true }}
          />
          {/* <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DatePicker
              label="Arrival Date"
              value={offer.arrivalDate}
              onChange={(newValue) => {
                setOffer({ ...offer, arrivalDate: newValue.toISODate() });
              }}
              renderInput={(params) => (
                <TextField
                  margin="normal"
                  variant="standard"
                  fullWidth
                  {...params}
                  helperText={"mm/dd/yyyy"}
                  required
                />
              )}
            />
          </LocalizationProvider> */}
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DatePicker
              label="Arrival Date"
              value={offer.arrivalDate}
              onChange={(newValue) => {
                setOffer({ ...offer, arrivalDate: newValue });
              }}
              renderInput={(params) => (
                <TextField
                  margin="normal"
                  variant="standard"
                  fullWidth
                  {...params}
                  helperText={"mm/dd/yyyy"}
                  required
                />
              )}
            />
          </LocalizationProvider>

          <TextField
            id="numberOfKilos"
            label="Weight"
            required
            onChange={handleInputChange}
            value={offer.numberOfKilos}
            type="text"
            name="numberOfKilos"
            variant="standard"
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
            }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <div className="grid-wrapper">
            <TextField
              id="price"
              label="Price / Kg"
              required
              onChange={handleInputChange}
              value={offer.price}
              type="text"
              name="price"
              variant="standard"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl>
              <InputLabel id="currency-label">Currency</InputLabel>
              <Select
                labelId="currency-label"
                name="currency"
                id="currency"
                label="Currency"
                value={offer.currency as ""}
                onChange={handleSelectChange}
                required
                variant="standard"
              >
                {currencies.map((currency) => {
                  return (
                    <MenuItem
                      key={currencies.indexOf(currency)}
                      value={currency}
                    >
                      {currency}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>

          <fieldset style={{ margin: "15px 0" }}>
            <legend>Goods accepted :</legend>
            <ul id="goods">
              {offer.goods.map((good) => {
                return (
                  <li key={offer.goods.indexOf(good)}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleGoodSelection}
                          id={good.name}
                          name={good.name}
                          checked={good.checked}
                        />
                      }
                      label={good.name}
                    />
                  </li>
                );
              })}
            </ul>
          </fieldset>
          {isUpdating ? (
            <div className="lds-dual-ring"></div>
          ) : (
            <input type="submit" value="Update" />
          )}
        </form>
      </div>
    </div>
  );
};

export default EditOffer;
