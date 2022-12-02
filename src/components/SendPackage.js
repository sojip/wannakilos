import "../styles/SendPackage.css";
import Airplane from "../img/airplane-takeoff.png";
import { db } from "./utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { query, where, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Checkbox, FormControlLabel } from "@mui/material";
import Masonry from "react-masonry-css";
import { DateTime } from "luxon";
const SendPackage = (props) => {
  const [goods, setgoods] = useState([
    { name: "A", checked: false },
    { name: "B", checked: false },
    { name: "C", checked: false },
    { name: "D", checked: false },
  ]);
  const [datas, setdatas] = useState({});
  const [offers, setoffers] = useState([]);
  const [isSearching, setissearching] = useState(false);
  let domoffers;

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  let goodsCheckbox = goods.map((good) => {
    return (
      <FormControlLabel
        key={goods.indexOf(good)}
        control={
          <Checkbox
            key={goods.indexOf(good)}
            onChange={handleGoodSelection}
            name={good.name}
          />
        }
        label={good.name}
      />
    );
  });

  if (offers.length) {
    domoffers = offers.map((offer) => {
      return (
        <div
          className="userOffer"
          data-oid={offer.id}
          key={offers.indexOf(offer)}
        >
          <div className="road">
            <div className="offerDepature">{offer.departurePoint}</div>
            <img src={Airplane} alt="" />
            <div className="offerArrival">{offer.arrivalPoint}</div>
          </div>
          <div className="offer-wrapper">
            <div className="offerNumOfkilos">
              <div>Number of Kilos</div>
              <div>{offer.numberOfKilos}</div>
            </div>
            <div className="offerPrice">
              <div>Price</div>
              <div>
                {offer.price} {offer.currency}/Kg
              </div>
            </div>
            <div className="offerGoods">
              <div className="goodsTitle">Goods accepted</div>
              <ul style={{ listStyleType: "square" }}>
                {offer.goods.map((good) => (
                  <li key={offer.goods.indexOf(good)}>{good}</li>
                ))}
              </ul>
            </div>
            <div className="dates">
              <div> Departure date</div>
              <div>
                {DateTime.fromISO(offer.departureDate).toLocaleString(
                  DateTime.DATE_MED
                )}
              </div>
              {/* <div>{offer.departuredate}</div> */}
              <div> arrival date</div>
              <div>
                {DateTime.fromISO(offer.arrivalDate).toLocaleString(
                  DateTime.DATE_MED
                )}
              </div>
              {/* <div>{offer.arrivalDate}</div> */}
            </div>
            <div className="actions">
              <Link to={`/book-offer/${offer.id}`} id="bookOffer">
                Book this offer
              </Link>
            </div>
          </div>
        </div>
      );
    });
  }

  async function handleSubmit(e) {
    let noOfferFound = document.querySelector(".noOffersFoundMessage");
    noOfferFound.textContent = "";
    let offers = [];
    e.preventDefault();
    // add goods accepted to datas
    let acceptedGoods = goods.filter((good) => good.checked === true);
    let goods_ = acceptedGoods.map((good) => good.name);
    if (!goods_.length) {
      alert("select a type of package please");
      return;
    }
    // find offers in database
    setissearching(true);
    const offersRef = collection(db, "offers");
    const q = query(
      offersRef,
      where("departurePoint", "==", datas.departurePoint.toLowerCase()),
      where("arrivalPoint", "==", datas.arrivalPoint.toLowerCase()),
      where("goods", "array-contains-any", goods_),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      let offer = doc.data();
      offers.push({ ...offer, id: doc.id });
    });
    if (!offers.length)
      noOfferFound.textContent = "No offers yet corresponding...";
    setissearching(false);
    setoffers([...offers]);
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

  useEffect(() => {
    console.log(goods);
  }, [goods]);
  return (
    <div className="container sendPackageContainer">
      <div className="formWrapper">
        <form id="sendPackageForm" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="departurePoint"
            name="departurePoint"
            onChange={handleInputChange}
            label="Departure Point"
            variant="standard"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            id="arrivalPoint"
            name="arrivalPoint"
            onChange={handleInputChange}
            label="Arrival Point"
            variant="standard"
            margin="normal"
            required
          />
          <p>Type of package :</p>
          <div id="goods">{goodsCheckbox}</div>
          {isSearching ? (
            <div className="lds-dual-ring"></div>
          ) : (
            <input type="submit" value="Find" />
          )}
        </form>
      </div>
      <div className="noOffersFoundMessage"></div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {domoffers}
      </Masonry>
    </div>
  );
};

export default SendPackage;
