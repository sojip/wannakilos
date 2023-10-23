import React from "react";
import "./ProposeKilos.css";
import { useState } from "react";
import { db } from "../../components/utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { TextField } from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { useAuthContext } from "components/auth/useAuthContext";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { DateTime } from "luxon";

type Good = {
  name: string;
  checked: boolean;
};
type OfferDatas = {
  uid: string;
  departurePoint: string;
  departureDate: DateTime | null;
  arrivalPoint: string;
  arrivalDate: DateTime | null;
  numberOfKilos: number;
  price: number;
  currency: string;
  goods: Good[];
};
const ProposeKilos: React.FC = (): JSX.Element => {
  const { user } = useAuthContext();
  const uid = user?.id;
  // const [goods, setgoods] = useState([
  //   { name: "A", checked: false },
  //   { name: "B", checked: false },
  //   { name: "C", checked: false },
  //   { name: "D", checked: false },
  // ]);
  const [isLoading, setisLoading] = useState(false);
  const [datas, setdatas] = useState<OfferDatas>({
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
  const currencies = ["$ (Dollars)", "€ (Euros)", "F (Fcfa)"];

  // const uid = user?.id;

  // let goodsCheckbox = goods.map((good) => {
  //   return (
  //     <li key={goods.indexOf(good)}>
  //       <FormControlLabel
  //         control={
  //           <Checkbox
  //             onChange={handleGoodSelection}
  //             name={good.name}
  //             checked={good.checked}
  //           />
  //         }
  //         label={good.name}
  //       />
  //     </li>
  //   );
  // });
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setisLoading(true);
    //cancel submit if the form is empty to do

    // add goods accepted to datas
    // let acceptedGoods = goods.filter((good) => good.checked === true);
    // let goods_ = acceptedGoods.map((good) => good.name);
    // console.log(datas);

    // store offer in database
    try {
      await addDoc(collection(db, "offers"), {
        departurePoint: datas.departurePoint.toLowerCase(),
        departureDate: datas.departureDate?.toISODate(),
        arrivalPoint: datas.arrivalPoint.toLowerCase(),
        arrivalDate: datas.arrivalDate?.toISODate(),
        numberOfKilos: Number(datas.numberOfKilos),
        bookings: [],
        price: Number(datas.price),
        currency: datas.currency,
        uid: uid,
        goods: datas.goods
          .filter((good) => good.checked === true)
          .map((good) => good.name),
        // goods: goods_,
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      toast.error(e.message);
      setisLoading(false);
      return;
    }
    //reset goods and form
    // setgoods([
    //   { name: "A", checked: false },
    //   { name: "B", checked: false },
    //   { name: "C", checked: false },
    //   { name: "D", checked: false },
    // ]);
    // e.target.reset();
    // setdatas({ currency: "F (Fcfa)" });
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
    toast.success("Offfer Publiched Successfully");
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
    // let checked = e.target.checked;
    // setgoods(
    //   goods.map((good) => {
    //     if (good.name === name) good.checked = checked;
    //     return good;
    //   })
    // );
  }

  useEffect(() => {
    console.log(datas);
  }, [datas]);

  return (
    <div className="container proposeKilosContainer">
      <ToastContainer />
      <div className="formWrapper">
        <form id="proposeKilosForm" onSubmit={handleSubmit}>
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
          <fieldset style={{ margin: "15px 0" }}>
            <legend>Goods accepted :</legend>
            <ul id="goods">
              {datas.goods.map((good) => {
                return (
                  <li key={datas.goods.indexOf(good)}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleGoodSelection}
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
            {/* <ul id="goods">{goodsCheckbox}</ul> */}
          </fieldset>
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
          <div className="grid-wrapper">
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
            />
            <FormControl>
              <InputLabel id="currency-label">Currency</InputLabel>
              <Select
                labelId="currency-label"
                name="currency"
                id="currency"
                label="Currency"
                value={datas.currency}
                onChange={handleInputChange}
                required
                variant="standard"
                readOnly={true}
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
          {isLoading ? (
            <div className="lds-dual-ring"></div>
          ) : (
            <input type="submit" value="Publish" />
          )}
        </form>
      </div>
    </div>
  );
};

export default ProposeKilos;
