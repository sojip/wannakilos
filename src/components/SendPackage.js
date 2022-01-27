import "../styles/SendPackage.css";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars";
import { NumericTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { auth, db } from "./utils/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { query, where, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import { cloneDeep } from "lodash";

const SendPackage = (props) => {
  const [goods, setgoods] = useState([
    { name: "A", checked: false },
    { name: "B", checked: false },
    { name: "C", checked: false },
    { name: "D", checked: false },
  ]);
  const [datas, setdatas] = useState({});
  const [uid, setuid] = useState("");
  const [offers, setoffers] = useState([]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      //user is signed in
      setuid(user.uid);
    }
  });

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

  let domoffers = offers.map((offer) => {
    return (
      <div
        className="userOffer"
        data-oid={offer.id}
        key={offers.indexOf(offer)}
      >
        <div className="road">
          <div className="offerDepature">{offer.departurePoint}</div>
          {/* <img
            src="https://img.icons8.com/metro/26/000000/long-arrow-right.png"
            alt="arrow"
          /> */}
          <img
            src="https://img.icons8.com/external-flatart-icons-solid-flatarticons/50/ffffff/external-right-arrow-arrow-flatart-icons-solid-flatarticons-10.png"
            alt="arrow"
          />
          <div className="offerArrival">{offer.arrivalPoint}</div>
        </div>
        <div className="offerNumOfkilos">
          Nomber of Kilos - {offer.numberOfKilos}
        </div>
        <div className="offerPrice">
          Price/Kg - {offer.price} {offer.currency}
        </div>
        <div className="offerGoods">
          <div className="goodsTitle">Goods accepted</div>
          <ul>
            {offer.goods.map((good) => (
              <li key={offer.goods.indexOf(good)}>{good}</li>
            ))}
          </ul>
        </div>
        <div className="dates">
          <div> Departure date - {offer.departureDate}</div>
          <div> Arrival date - {offer.arrivalDate}</div>
        </div>
        <div className="actions">
          <Link to={`/book-${offer.id}`} id="bookOffer">
            Book this offer
          </Link>
        </div>
      </div>
    );
  });
  function handleDelete() {}

  function bookOffer() {}

  async function handleSubmit(e) {
    let offers_ = [];
    e.preventDefault();
    // add goods accepted to datas
    let acceptedGoods = goods.filter((good) => good.checked === true);
    let goods_ = acceptedGoods.map((good) => good.name);
    // find offers in database
    const offersRef = collection(db, "offers");
    const q = query(
      offersRef,
      where("departurePoint", "==", datas.departurePoint),
      where("arrivalPoint", "==", datas.arrivalPoint),
      where("goods", "array-contains-any", goods_),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let departureDate = doc.data().departureDate;

      let departureYear = parseInt(departureDate.split("-")[0]);
      let departureMonth = parseInt(departureDate.split("-")[1]) - 1;
      let departureDay = parseInt(departureDate.split("-")[2]);
      let date = new Date(departureYear, departureMonth, departureDay);

      if (date > datas.startdate && date < datas.enddate) {
        let offer_ = cloneDeep(doc.data());
        offer_.id = doc.id;
        offers_.push(offer_);
      } else if (
        date.valueOf() === datas.startdate.valueOf() ||
        date.valueOf() === datas.enddate.valueOf()
      ) {
        // console.log(doc.id);
        // offers_.push(doc.data());
        let offer_ = cloneDeep(doc.data());
        offer_.id = doc.id;
        offers_.push(offer_);
      }

      // console.log(doc.data());

      // setoffers([...offers, doc.data()]);

      // console.log(doc.id, " => ", doc.data());
      // e.target.reset();
    });

    setoffers([...offers_]);

    // getDocs(q).then((response) => {
    //   console.log(response);
    //   e.target.reset();
    // });
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
    let startdate = value[0];
    let enddate = value[1];
    setdatas({ ...datas, startdate, enddate });
  }

  function handleBooking() {}

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
    console.log(datas);
    console.log(offers);
  });
  return (
    <div className="container sendPackageContainer">
      <div className="formWrapper">
        <form id="sendPackageForm" onSubmit={handleSubmit}>
          <TextBoxComponent
            id="departurePoint"
            name="departurePoint"
            onChange={handleInputChange}
            placeholder="Departure point"
            floatLabelType="Auto"
          />
          <TextBoxComponent
            id="arrivalPoint"
            name="arrivalPoint"
            onChange={handleInputChange}
            placeholder="Arrival point"
            floatLabelType="Auto"
          />
          <DateRangePickerComponent
            id="daterangepicker"
            placeholder="Select a range for departure date"
            format="yyyy-MM-dd"
            floatLabelType="Auto"
            onChange={handleDatePicker}
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
          <p>Type of package :</p>
          <div id="goods">{goodsCheckbox}</div>
          {/* <TextBoxComponent
            name="packageDetails"
            multiline={true}
            placeholder="Package details"
            floatLabelType="Auto"
            cssClass="sample"
          /> */}
          <input type="submit" value="Find" />
        </form>
      </div>
      <div className="userOffers">{domoffers}</div>
    </div>
  );
};

export default SendPackage;
