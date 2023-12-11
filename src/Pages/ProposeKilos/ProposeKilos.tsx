import React from "react";
import { useState } from "react";
import { FormLabel, TextField } from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Checkbox, FormControlLabel } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { useAuthContext } from "components/auth/useAuthContext";
import { ToastContainer, toast } from "react-toastify";
import { DateTime } from "luxon";
import { Content } from "components/DashboardContent";
import { Form } from "components/DashboardForm";
import { Offer } from "./type";
import { Grid } from "./style";
import { Button } from "components/Button";
import { createOffer } from "./utils";

const ProposeKilos: React.FC = (): JSX.Element => {
  const { user } = useAuthContext();
  const uid = user?.id;
  const [isLoading, setisLoading] = useState(false);
  const [datas, setdatas] = useState<Offer>({
    uid: uid as string,
    departurePoint: "",
    departureDate: null,
    arrivalPoint: "",
    arrivalDate: null,
    numberOfKilos: 0,
    price: 0,
    currency: "F (Fcfa)",
    goods: [
      { name: "A", checked: false },
      { name: "B", checked: false },
      { name: "C", checked: false },
      { name: "D", checked: false },
    ],
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setisLoading(true);
    //cancel submit if the form is empty to do
    const res = await createOffer({ ...datas });
    if (res instanceof Error) {
      toast.error(res.message);
      setisLoading(false);
      return;
    }
    setdatas({
      departurePoint: "",
      departureDate: null,
      arrivalPoint: "",
      arrivalDate: null,
      numberOfKilos: 0,
      price: 0,
      uid: uid as string,
      currency: "F (Fcfa)",
      goods: [
        { name: "A", checked: false },
        { name: "B", checked: false },
        { name: "C", checked: false },
        { name: "D", checked: false },
      ],
    });
    setisLoading(false);
    toast.success("Offer Published Successfully");
    return;
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;
    let name = e.target.name;
    setdatas({ ...datas, [name]: value });
    return;
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
      <ToastContainer />
      <Form onSubmit={handleSubmit}>
        <TextField
          id="departurePoint"
          label="Departure Point"
          required
          value={datas.departurePoint}
          onChange={handleInputChange}
          fullWidth
          type="text"
          name="departurePoint"
          margin="normal"
          variant="standard"
        />
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DatePicker
            label="Departure Date"
            value={datas.departureDate}
            onChange={(newValue) => {
              setdatas({
                ...datas,
                departureDate: newValue,
              });
            }}
            minDate={DateTime.fromJSDate(new Date())}
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
          value={datas.arrivalPoint}
          onChange={handleInputChange}
          fullWidth
          type="text"
          name="arrivalPoint"
          variant="standard"
        />
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DatePicker
            label="Arrival Date"
            value={datas.arrivalDate}
            onChange={(newValue) => {
              setdatas({ ...datas, arrivalDate: newValue });
            }}
            minDate={datas.departureDate}
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
        <FormLabel sx={{ mt: 2 }} component={"legend"}>
          Goods accepted
        </FormLabel>
        {datas.goods.map((good) => {
          return (
            <FormControlLabel
              key={datas.goods.indexOf(good)}
              control={
                <Checkbox
                  onChange={handleGoodSelection}
                  name={good.name}
                  checked={good.checked}
                />
              }
              label={good.name}
            />
          );
        })}
        <Grid>
          <TextField
            id="numberOfKilos"
            label="Weight"
            required
            onChange={handleInputChange}
            value={datas.numberOfKilos}
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
            fullWidth
            margin="normal"
          />
          <TextField
            id="price"
            label="Price / Kg"
            required
            value={datas.price}
            onChange={handleInputChange}
            type="text"
            name="price"
            variant="standard"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            margin="normal"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{datas.currency}</InputAdornment>
              ),
            }}
          />
        </Grid>
        {isLoading ? (
          <div className="lds-dual-ring"></div>
        ) : (
          <Button type="submit" value="Publish Offer" />
        )}
      </Form>
    </Content>
  );
};

export default ProposeKilos;
