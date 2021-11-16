import "../styles/ProposeKilos.css";
import { useState, useEffect } from "react";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { NumericTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { auth, db } from "./utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ProposeKilos = (props) => {
  const [goods, setgoods] = useState([
    { name: "A", checked: false },
    { name: "B", checked: false },
    { name: "C", checked: false },
    { name: "D", checked: false },
  ]);
  const [datas, setdatas] = useState({});
  const [uid, setuid] = useState("");

  const currencies = ["$ (Dollars)", "€ (Euros)", "F (Fcfa)"];
  onAuthStateChanged(auth, (user) => {
    if (user) {
      //user is signed in
      setuid(user.uid);
    }
  });

  useEffect(() => {
    console.log(goods);
  }, [goods]);

  let goodsCheckbox = goods.map((good) => {
    return (
      <div key={goods.indexOf(good)}>
        <input
          type="checkbox"
          id={good.name}
          name={good.name}
          onChange={handleGoodSelection}
        />
        <label htmlFor={good.name}>{good.name}</label>
      </div>
    );
  });
  async function handleSubmit(e) {
    e.preventDefault();
    // add goods accepted to datas
    let acceptedGoods = goods.filter((good) => good.checked === true);
    let goods_ = acceptedGoods.map((good) => good.name);
    // store offer in database
    const docRef = await addDoc(collection(db, "offers"), {
      ...datas,
      uid: uid,
      goods: goods_,
    });
    e.target.reset();
    return;
  }
  function handleInputChange(e) {
    let value = e.target.value;
    let name = e.target.name;
    setdatas({ ...datas, [name]: value });
    return;
  }

  function handleDatePicker(e) {
    let value = e.target.value;
    if (!value) return;
    let name = e.target.name;
    let year = value.getFullYear();
    let month = value.getMonth() + 1;
    let day = value.getDate();
    let date = `${year}-${month}-${day}`;
    setdatas({ ...datas, [name]: date });
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

  return (
    <div className="container proposeKilosContainer">
      <div className="formWrapper">
        <form id="proposeKilosForm" onSubmit={handleSubmit}>
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
          />
          <label htmlFor="departurePoint">Departure point :</label>
          <TextBoxComponent
            id="departurePoint"
            name="departurePoint"
            onChange={handleInputChange}
          />

          <label htmlFor="arrivalPoint">Arrival point :</label>
          <TextBoxComponent
            id="arrivalPoint"
            name="arrivalPoint"
            onChange={handleInputChange}
          />
          <label htmlFor="price">Price/Kg :</label>
          <NumericTextBoxComponent
            value={0}
            min={0}
            name="price"
            onChange={handleInputChange}
            strictMode={true}
            format="#"
            id="price"
          />
          <DropDownListComponent
            name="currency"
            id="currency"
            dataSource={currencies}
            placeholder="Select a currency please"
            onChange={handleInputChange}
          />
          <label htmlFor="numberOfKilos">Amount of kilos :</label>
          <NumericTextBoxComponent
            value={0}
            min={0}
            name="numberOfKilos"
            onChange={handleInputChange}
            strictMode={true}
            format="#"
            id="numberOfKilos"
          />
          <p>Goods accepted :</p>
          <div id="goods">{goodsCheckbox}</div>
          <input type="submit" value="Publish" />
        </form>
      </div>
    </div>
  );
};

export default ProposeKilos;
