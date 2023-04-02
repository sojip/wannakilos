import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { db } from "../../components/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import InputAdornment from "@mui/material/InputAdornment";
import "./BookOffer.css";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { TextField } from "@mui/material";
import { DateTime } from "luxon";
import { FormControlLabel, Checkbox } from "@mui/material";
import useAuthContext from "../../components/auth/useAuthContext";

const BookOffer = (props) => {
  const user = useAuthContext();
  const uid = user?.id;
  const [offer, setOffer] = useState({
    departureDate: "",
    departurePoint: "",
    arrivalPoint: "",
    arrivalDate: "",
    numberOfKilos: "",
    price: "",
    goods: "",
  });
  const [datas, setdatas] = useState({});
  const [goodsToSend, setgoodstosend] = useState([]);
  const [isSubmitting, setissubmiting] = useState(false);
  let { offerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getOfferDetails() {
      const docRef = doc(db, "offers", offerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }

    getOfferDetails().then((response) => {
      setOffer(response);
      setgoodstosend(
        response.goods.map((good) => {
          return { name: good, checked: false };
        })
      );
    });
    return () => {};
  }, []);

  async function handleSubmit(e) {
    console.log(e);
    e.preventDefault();
    if (!datas.bookingDetails || !datas.numberOfKilos) return;
    let goods = goodsToSend.filter((good) => good.checked === true);
    if (!goods.length) return;
    setissubmiting(true);
    try {
      //add booking to database
      const docRef = await addDoc(collection(db, "bookings"), {
        offerId,
        offerUserId: offer.uid,
        departurePoint: offer.departurePoint.toLowerCase(),
        departureDate: offer.departureDate,
        arrivalPoint: offer.arrivalPoint.toLowerCase(),
        arrivalDate: offer.arrivalDate,
        uid,
        goods: goods.map((good) => good.name),
        numberOfKilos: datas.numberOfKilos,
        bookingDetails: datas.bookingDetails,
        price: offer.price,
        currency: offer.currency,
        status: "pending",
        timestamp: serverTimestamp(),
      });
      //update offer bookings in database
      const offerRef = doc(db, "offers", offerId);
      await updateDoc(offerRef, {
        bookings: arrayUnion(docRef.id),
      });
    } catch (e) {
      alert(e);
      setissubmiting(false);
      return;
    }
    //reset booking part
    document.querySelector("#weight").value = "";
    document.querySelector("#details").value = "";
    setgoodstosend(
      goodsToSend.map((good) => {
        return { name: good.name, checked: false };
      })
    );
    setissubmiting(false);
    navigate("/mykilos");
  }

  function handleInputChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setdatas({ ...datas, [name]: value });
  }
  function handleGoodSelection(e) {
    let name = e.target.name;
    let checked = e.target.checked;
    let goods = goodsToSend.map((good) => {
      if (good.name === name) return { name: good.name, checked: checked };
      return good;
    });
    setgoodstosend(goods);
  }

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
              {goodsToSend.length &&
                goodsToSend.map((good) => {
                  return (
                    <li key={goodsToSend.indexOf(good)}>
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
