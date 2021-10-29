import "../styles/ProposeKilos.css";
import { useState, useEffect } from "react";

const ProposeKilos = (props) => {
  const [goods, setgoods] = useState([
    { name: "A", checked: false },
    { name: "B", checked: false },
    { name: "C", checked: false },
    { name: "D", checked: false },
  ]);
  useEffect(() => {
    console.log(goods);
  }, [goods]);
  let goodsCheckbox = goods.map((good) => {
    return (
      <div>
        <input
          type="checkbox"
          id={good.name}
          name={good.name}
          onChange={handleGoodSelection}
        />
        <label for={good.name}>{good.name}</label>
      </div>
    );
  });
  function handleSubmit() {
    return;
  }
  function handleInputChange() {
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
  return (
    <div className="container">
      <div className="formWrapper">
        <form id="proposeKilosForm" onSubmit={handleSubmit}>
          <label htmlFor="departureDate">Departure date :</label>
          <input
            type="date"
            name="departureDate"
            onChange={handleInputChange}
            required
          />
          <label htmlFor="arrivalDate">Arrival date :</label>
          <input
            type="date"
            name="arrivalDate"
            onChange={handleInputChange}
            required
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
          <div id="goodsaccepted">{goodsCheckbox}</div>

          <input type="submit" value="Publish" />
        </form>
      </div>
    </div>
  );
};

export default ProposeKilos;
