import "../styles/ProposeKilos.css";
import { useState, useEffect } from "react";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";

const ProposeKilos = (props) => {
  const [goods, setgoods] = useState([
    { name: "A", checked: false },
    { name: "B", checked: false },
    { name: "C", checked: false },
    { name: "D", checked: false },
  ]);
  const [datas, setdatas] = useState({});

  useEffect(() => {
    console.log(datas);
  }, [datas]);
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
  function handleSubmit() {
    return;
  }
  function handleInputChange(e) {
    console.log(e.target.value.getFullYear());
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
    <div className="container">
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
          <input
            type="text"
            name="departurePoint"
            onChange={handleInputChange}
            required
          />
          <label htmlFor="arrivalPoint">Arrival point :</label>
          <input
            type="text"
            name="arrivalPoint"
            onChange={handleInputChange}
            required
          />
          <label htmlFor="price">Price/Kg :</label>
          <input
            type="number"
            name="price"
            onChange={handleInputChange}
            required
          />
          <label htmlFor="numberOfKilos">Amount of kilos :</label>
          <input
            type="number"
            name="numberOfKilos"
            onChange={handleInputChange}
            required
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
