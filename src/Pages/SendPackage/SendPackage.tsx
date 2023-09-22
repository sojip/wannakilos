import React from "react";
import "./SendPackage.css";
import { db } from "../../components/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { query, where, orderBy } from "firebase/firestore";
import TextField from "@mui/material/TextField";
import { Checkbox, FormControlLabel } from "@mui/material";
import Masonry from "react-masonry-css";
import { useAuthContext } from "components/auth/useAuthContext";
import { OfferSmall } from "./Offer";

export interface Offer {
  id: string;
  departurePoint: string;
  arrivalPoint: string;
  numberOfKilos: number;
  price: number;
  currency: string;
  goods: string[];
  departureDate: string;
  arrivalDate: string;
  timestamp: number;
}

interface FormDatas {
  departurePoint: string;
  arrivalPoint: string;
  goods: string[];
}

interface good {
  name: string;
  checked: boolean;
}

type searchStatus = "idle" | "found" | "not found";

const SendPackage = () => {
  const [goods, setgoods] = useState<good[]>([
    { name: "A", checked: false },
    { name: "B", checked: false },
    { name: "C", checked: false },
    { name: "D", checked: false },
  ]);
  const [datas, setdatas] = useState<FormDatas>({} as FormDatas);
  const [offers, setoffers] = useState<Offer[]>([]);
  const [isSearching, setissearching] = useState<boolean>(false);
  const [status, setstatus] = useState<searchStatus>("idle");
  const { user } = useAuthContext();

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  async function handleSearch(datas: FormDatas) {
    setissearching(true);
    setstatus("idle");
    setoffers([]);
    let _offers: Offer[] = [];
    // find offers in database
    const offersRef = collection(db, "offers");
    const q = query(
      offersRef,
      where("departurePoint", "==", datas.departurePoint.toLowerCase()),
      where("arrivalPoint", "==", datas.arrivalPoint.toLowerCase()),
      where("goods", "array-contains-any", datas.goods),
      where("uid", "!=", user?.id),
      orderBy("uid")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let _offer = doc.data();
      _offers.push({
        id: doc.id,
        departurePoint: _offer.departurePoint,
        arrivalPoint: _offer.arrivalPoint,
        numberOfKilos: _offer.numberOfKilos,
        price: _offer.price,
        currency: _offer.currency,
        goods: _offer.goods,
        departureDate: _offer.departureDate,
        arrivalDate: _offer.arrivalDate,
        timestamp: _offer.timestamp.valueOf(),
      });
    });
    _offers.length ? setstatus("found") : setstatus("not found");
    setissearching(false);
    setoffers(
      _offers.sort(function (x, y) {
        return y.timestamp - x.timestamp;
      })
    );
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;
    let name = e.target.name;
    setdatas({ ...datas, [name]: value });
    return;
  }

  function handleGoodSelection(e: React.ChangeEvent<HTMLInputElement>) {
    let name = e.target.name;
    setgoods(
      goods.map((good) => {
        if (good.name === name) good.checked = !good.checked;
        return good;
      })
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let _goods = goods
      .filter((good) => good.checked === true)
      .map((good) => good.name);
    if (!_goods.length) {
      alert("Select Good Please");
      return;
    }
    handleSearch({ ...datas, goods: [..._goods] });
  }

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
      {status === "not found" ? (
        <div className="noOffersFoundMessage">No Offers Found</div>
      ) : null}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {offers.length > 0
          ? offers.map((offer) => <OfferSmall key={offer.id} {...offer} />)
          : null}
      </Masonry>
    </div>
  );
};

export default SendPackage;
