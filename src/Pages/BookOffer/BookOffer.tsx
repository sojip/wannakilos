import React from "react";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { db } from "../../components/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import InputAdornment from "@mui/material/InputAdornment";
import "./BookOffer.css";
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
//   updateDoc,
//   arrayUnion,
// } from "firebase/firestore";
import { TextField } from "@mui/material";
import { DateTime } from "luxon";
import { FormControlLabel, Checkbox } from "@mui/material";
import { useAuthContext } from "components/auth/useAuthContext";
import { Offer, Good, BookingFormDatas } from "./type";
import { createBooking } from "./utils";

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

    // try {
    //   //add booking to database
    //   const docRef = await addDoc(collection(db, "bookings"), {
    //     uid,
    //     offerId,
    //     offerUserId: offer.uid,
    //     departurePoint: offer.departurePoint,
    //     departureDate: offer.departureDate,
    //     arrivalPoint: offer.arrivalPoint,
    //     arrivalDate: offer.arrivalDate,
    //     goods: datas.goods
    //       .filter((good) => good.checked === true)
    //       .map((good) => good.name),
    //     numberOfKilos: Number(datas.numberOfKilos),
    //     bookingDetails: datas.bookingDetails,
    //     price: offer.price,
    //     currency: offer.currency,
    //     status: "pending",
    //     timestamp: serverTimestamp(),
    //   });
    //   //update offer bookings in database
    //   const offerRef = doc(db, "offers", offerId as string);
    //   await updateDoc(offerRef, {
    //     bookings: arrayUnion(docRef.id),
    //   });
    // } catch (e) {
    //   alert(e);
    //   setissubmiting(false);
    //   return;
    // }
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

  useEffect(() => {
    console.log(datas);
  }, [datas]);

  return (
    <div className="container">
      <div className="book-offer formWrapper">
        <h2 style={{ textAlign: "center" }}>Book an offer</h2>
        <form id="bookOfferForm" onSubmit={handleSubmit}>
          <TextField
            id="departurePoint"
            label="Departure Point"
            fullWidth
            name="departurePoint"
            margin="normal"
            variant="standard"
            value={offer?.departurePoint}
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
            value={DateTime.fromISO(offer?.departureDate).toLocaleString(
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
            value={offer?.arrivalPoint}
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
            value={DateTime.fromISO(offer?.arrivalDate).toLocaleString(
              DateTime.DATE_MED
            )}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <div className="grid-wrapper">
            <TextField
              id="numberOfKilos"
              label="Weight"
              type="text"
              name="numberOfKilos"
              variant="standard"
              value={offer?.numberOfKilos}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">Kg</InputAdornment>
                ),
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
              value={`${offer?.price} ${offer?.currency}`}
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
          </div>
          <p>Goods Accepted :</p>
          <ul className="goodsAccepted">
            {offer.goods.length &&
              offer.goods.map((good) => {
                return (
                  <li key={offer.goods.indexOf(good)}>
                    <FormControlLabel
                      control={<Checkbox checked={true} />}
                      label={good}
                    />
                  </li>
                );
              })}
          </ul>
          <fieldset>
            <legend>To Be Completed</legend>
            <p>Goods to send *</p>
            <ul className="goodsToSend">
              {datas.goods.length > 0 &&
                datas.goods.map((good) => {
                  return (
                    <li key={datas.goods.indexOf(good)}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            className="goodToSend"
                            checked={good.checked}
                          />
                        }
                        label={good.name}
                        onChange={handleGoodSelection}
                        id={good.name}
                        name={good.name}
                      />
                    </li>
                  );
                })}
            </ul>
            <div className="bookingDetails-wrapper">
              <TextField
                id="weight"
                label="Weight"
                type="text"
                name="numberOfKilos"
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Kg</InputAdornment>
                  ),
                }}
                onChange={handleInputChange}
                required
                value={datas.numberOfKilos}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
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
              />
            </div>
          </fieldset>
          {isSubmitting ? (
            <div className="lds-dual-ring"></div>
          ) : (
            <input type="submit" value="Send Booking" />
          )}
        </form>
      </div>
    </div>
  );
};

export default BookOffer;

/* utils */

async function getOffer(id: string): Promise<Offer | undefined> {
  const docRef = doc(db, "offers", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const doc = docSnap.data();
    console.log(doc);
    return {
      id,
      uid: doc.uid,
      departureDate: doc.departureDate,
      departurePoint: doc.departurePoint,
      arrivalPoint: doc.arrivalPoint,
      arrivalDate: doc.arrivalDate,
      currency: doc.currency,
      numberOfKilos: doc.numberOfKilos,
      price: doc.price,
      goods: doc.goods,
    };
  } else {
    // doc.data() will be undefined in this case
    return undefined;
  }
}
