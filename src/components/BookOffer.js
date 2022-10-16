import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { db } from "./utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { NumericTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import "../styles/BookOffer.css";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const BookOffer = (props) => {
  const [uid, setuid] = useState("");
  const [offer, setOffer] = useState({});
  const [datas, setdatas] = useState({});
  let { offerId } = useParams();
  const currencies = ["$ (Dollars)", "€ (Euros)", "F (Fcfa)"];

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setuid(uid);
    } else {
      setuid("");
    }
  });

  useEffect(() => {
    async function getOfferDetails() {
      const docRef = doc(db, "offers", offerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setOffer(docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }

    getOfferDetails();
    console.log(datas);
  }, [datas]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!datas.bookingDetails || !datas.numberOfKilos) return;
    let goods_ = datas.goods.filter((good) => good.checked === true);
    //add booking to database
    const docRef = await addDoc(collection(db, "bookings"), {
      offerId,
      uid,
      goods: goods_.map((good) => good.name),
      numberOfKilos: datas.numberOfKilos,
      bookingDetails: datas.bookingDetails,
      status: "pending",
      timestamp: serverTimestamp(),
    });
    //update offer bookings in database
    const offerRef = doc(db, "offers", offerId);
    await updateDoc(offerRef, {
      bookings: arrayUnion(docRef.id),
    });

    //update user bookings in database
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      bookings: arrayUnion(docRef.id),
    });

    //reset booking part
    document.querySelector("#numberOfKilos").value = "";
    document.querySelector("#bookingDetails").value = "";
    document.querySelector("textarea[name='bookingDetails']").value = "";
    document
      .querySelectorAll(".goodsToSend")
      .forEach((good) => (good.checked = false));
  }

  function handleInputChange(e) {
    let name = e.target.name;
    console.log(`name${name}`);
    let value = e.target.value;
    setdatas({ ...datas, [name]: value });
  }
  function handleDatePicker() {}
  function handleGoodSelection(e) {
    let goods_ = offer.goods.map((good) => {
      let checked_ = document.querySelector(`input[name=${good}]`).checked;
      return { name: good, checked: checked_ };
    });
    setdatas({ ...datas, goods: goods_ });
  }
  let goodsaccepted;
  let goodsCheckbox;
  if (offer.goods) {
    goodsaccepted = offer.goods.map((good) => {
      return (
        <div key={offer.goods.indexOf(good)}>
          <input type="checkbox" checked={true} disabled />
          <label>{good}</label>
        </div>
      );
    });
    goodsCheckbox = offer.goods.map((good) => {
      return (
        <div key={offer.goods.indexOf(good)}>
          <input
            type="checkbox"
            onChange={handleGoodSelection}
            className="goodsToSend"
            id={good}
            name={good}
          />
          <label htmlFor={good}>{good}</label>
        </div>
      );
    });
  }

  return (
    <div className="container">
      <div
        className="formWrapper"
        style={{
          margin: "auto",
          backgroundColor: "white",
          borderRadius: "25px",
          padding: "25px",
          // border: "solid 1px red",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Book an offer</h2>
        <form id="bookOfferForm" onSubmit={handleSubmit}>
          <label htmlFor="departureDate">Departure date :</label>
          <br />
          <DatePickerComponent
            id="departureDate"
            name="departureDate"
            strictMode={true}
            start="Year"
            format="yyyy-MM-dd"
            placeholder="yyyy-mm-dd"
            value={offer.departureDate}
            disabled={true}
          />
          <label htmlFor="arrivalDate">Arrival date :</label>
          <br />
          <DatePickerComponent
            id="arrivalDate"
            name="arrivalDate"
            strictMode={true}
            start="Year"
            format="yyyy-MM-dd"
            placeholder="yyyy-mm-dd"
            value={offer.arrivalDate}
            disabled={true}
          />
          <label htmlFor="departurePoint">Departure point :</label>
          <TextBoxComponent
            id="departurePoint"
            name="departurePoint"
            value={offer.departurePoint}
            disabled={true}
          />
          <label htmlFor="arrivalPoint">Arrival point :</label>
          <TextBoxComponent
            id="arrivalPoint"
            name="arrivalPoint"
            value={offer.arrivalPoint}
            disabled={true}
          />
          <label htmlFor="price">Price/Kg :</label>
          <NumericTextBoxComponent
            min={0}
            name="price"
            strictMode={true}
            format="#"
            id="price"
            value={offer.price}
            disabled={true}
          />
          <DropDownListComponent
            name="currency"
            id="currency"
            dataSource={currencies}
            placeholder="Select a currency please"
            value={offer.currency}
            enabled={false}
          />
          <label htmlFor="numberOfKilos">Amount of kilos :</label>
          <NumericTextBoxComponent
            min={0}
            strictMode={true}
            format="#"
            value={offer.numberOfKilos}
            disabled={true}
          />
          <p>Goods accepted :</p>
          <div id="goods">{goodsaccepted}</div>
          <fieldset>
            <legend>To Be Completed</legend>
            <div className="bookingInfos">
              <p>Goods to send *</p>
              <div
                id="goodsToSend"
                style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
              >
                {goodsCheckbox}
              </div>
              <label htmlFor="numberOfKilos">Amount of kilos * </label>
              <NumericTextBoxComponent
                min={0}
                max={offer.numberOfKilos}
                name="numberOfKilos"
                strictMode={true}
                format="#"
                id="numberOfKilos"
                onChange={handleInputChange}
                required={true}
              />
              <label htmlFor="bookingDetails">More details</label>

              <TextBoxComponent
                multiline={true}
                name="bookingDetails"
                id="bookingDetails"
                onChange={handleInputChange}
              />
            </div>
          </fieldset>
          <input
            style={{
              width: "100%",
              borderRadius: "25px",
              border: "none",
              padding: "8px 0",
              marginTop: "25px",
              cursor: "pointer",
              backgroundColor: "black",
              color: "white",
              fontFamily: "var(--textFont)",
            }}
            type="submit"
            value="Send Booking"
          />
        </form>
      </div>
    </div>
  );
};

export default BookOffer;
