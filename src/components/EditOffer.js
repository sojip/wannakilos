import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { NumericTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./utils/firebase";

const EditOffer = (props) => {
  const [goods, setgoods] = useState([
    { name: "A", checked: false },
    { name: "B", checked: false },
    { name: "C", checked: false },
    { name: "D", checked: false },
  ]);
  const [offer, setOffer] = useState({});
  const [datas, setdatas] = useState({});

  let { offerId } = useParams();
  const currencies = ["$ (Dollars)", "€ (Euros)", "F (Fcfa)"];

  useEffect(() => {
    async function getOfferDetails() {
      const docRef = doc(db, "offers", offerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setOffer(docSnap.data());
        let goods_ = goods.map((good) => {
          if (docSnap.data().goods.includes(good.name)) good.checked = true;
          return good;
        });
        setgoods(goods_);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }

    getOfferDetails();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    // add goods accepted to datas
    let acceptedGoods = goods.filter((good) => good.checked === true);
    let goods_ = acceptedGoods.map((good) => good.name);
    // update offer in database
    const offerRef = doc(db, "offers", offerId);
    // Set the "capital" field of the city 'DC'
    await updateDoc(offerRef, {
      ...datas,
      goods: goods_,
      // timestamp: serverTimestamp(),
    });
    e.target.reset();
    return;
  }

  function handleDatePicker(e) {
    let value = e.target.value;
    if (!value) return;
    let name = e.target.name;
    let year = value.getFullYear();
    let month = (value.getMonth() + 1).toString().padStart(2, "0");
    let day = value.getDate().toString().padStart(2, "0");
    let date = `${year}-${month}-${day}`;
    setdatas({ ...datas, [name]: date });
  }

  function handleInputChange(e) {
    let value = e.target.value;
    let name = e.target.name;
    setdatas({ ...datas, [name]: value });
    return;
  }

  function handleGoodSelection(e) {
    let name = e.target.name;
    setgoods(
      goods.map((good) => {
        if (good.name === name) good.checked = !good.checked;
        return good;
      })
    );
  }

  let goodsCheckbox = goods.map((good) => {
    return (
      <div key={goods.indexOf(good)}>
        <input
          type="checkbox"
          id={good.name}
          name={good.name}
          checked={good.checked}
          onChange={handleGoodSelection}
        />
        <label htmlFor={good.name}>{good.name}</label>
      </div>
    );
  });

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
        <h2 style={{ textAlign: "center" }}>Edit an offer </h2>
        <form id="editOfferForm" onSubmit={handleSubmit}>
          <label htmlFor="departureDate">Departure date :</label>
          <br />
          <DatePickerComponent
            id="departureDate"
            name="departureDate"
            onChange={handleDatePicker}
            strictMode={true}
            start="Year"
            format="yyyy-MM-dd"
            placeholder="yyyy-mm-dd"
            value={offer.departureDate}
          />
          <label htmlFor="arrivalDate">Arrival date :</label>
          <br />
          <DatePickerComponent
            id="arrivalDate"
            name="arrivalDate"
            onChange={handleDatePicker}
            strictMode={true}
            start="Year"
            format="yyyy-MM-dd"
            placeholder="yyyy-mm-dd"
            value={offer.arrivalDate}
          />
          <label htmlFor="departurePoint">Departure point :</label>
          <TextBoxComponent
            id="departurePoint"
            name="departurePoint"
            onChange={handleInputChange}
            value={offer.departurePoint}
          />
          <label htmlFor="arrivalPoint">Arrival point :</label>
          <TextBoxComponent
            id="arrivalPoint"
            name="arrivalPoint"
            onChange={handleInputChange}
            value={offer.arrivalPoint}
          />
          <label htmlFor="price">Price/Kg :</label>
          <NumericTextBoxComponent
            min={0}
            name="price"
            onChange={handleInputChange}
            strictMode={true}
            format="#"
            id="price"
            value={offer.price}
          />
          <DropDownListComponent
            name="currency"
            id="currency"
            dataSource={currencies}
            placeholder="Select a currency please"
            onChange={handleInputChange}
            value={offer.currency}
          />
          <label htmlFor="numberOfKilos">Amount of kilos :</label>
          <NumericTextBoxComponent
            min={0}
            name="numberOfKilos"
            onChange={handleInputChange}
            strictMode={true}
            format="#"
            id="numberOfKilos"
            value={offer.numberOfKilos}
          />
          <p>Goods accepted :</p>
          <div id="goods">{goodsCheckbox}</div>
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
            value="Update"
          />
        </form>
      </div>
    </div>
  );
};

export default EditOffer;
