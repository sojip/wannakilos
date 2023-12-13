import React from "react";
import { db } from "../../components/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { query, where, orderBy } from "firebase/firestore";
import TextField from "@mui/material/TextField";
import { Checkbox, FormControlLabel, FormLabel } from "@mui/material";
import { useAuthContext } from "components/auth/useAuthContext";
import { OfferCard } from "./Offer";
import { QuerySnapshot } from "@firebase/firestore-types";
import { MasonryGrid as Masonry } from "components/MasonryGrid/Masonry";
import { Content } from "components/DashboardContent";
import { Form } from "components/DashboardForm";
import { Button } from "components/Button";
import styled from "styled-components";

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

type searchStatus = "idle" | "searching" | "found" | "not found";

export const Infos = styled.p`
  font-style: italic;
  text-transform: capitalize;
  text-align: center;
  font-weight: bold;
`;

const SendPackage = () => {
  const [goods, setgoods] = useState<good[]>([
    { name: "A", checked: false },
    { name: "B", checked: false },
    { name: "C", checked: false },
    { name: "D", checked: false },
  ]);
  const [datas, setdatas] = useState<FormDatas>({} as FormDatas);
  const [offers, setoffers] = useState<Offer[]>([]);
  const [status, setstatus] = useState<searchStatus>("idle");
  const { user } = useAuthContext();

  async function handleSearch(datas: FormDatas): Promise<Offer[] | null> {
    let _offers: Offer[] = [];
    const offersRef = collection(db, "offers");
    const q = query(
      offersRef,
      where("departurePoint", "==", datas.departurePoint.toLowerCase()),
      where("arrivalPoint", "==", datas.arrivalPoint.toLowerCase()),
      where("goods", "array-contains-any", datas.goods),
      where("uid", "!=", user?.id),
      orderBy("uid")
    );
    const querySnapshot: QuerySnapshot = await getDocs(q);
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
    return _offers.length > 0 ? _offers : null;
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

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    const _goods = goods
      .filter((good) => good.checked === true)
      .map((good) => good.name);
    if (!_goods.length) {
      alert("Select Good Please");
      return;
    }
    setoffers([]);
    setstatus("searching");
    const _offers = await handleSearch({ ...datas, goods: [..._goods] });
    if (_offers === null) {
      setstatus("not found");
      return;
    }
    setstatus("found");
    setoffers(
      _offers.sort(function (x, y) {
        return y.timestamp - x.timestamp;
      })
    );
    return;
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
            checked={good.checked}
          />
        }
        label={good.name}
      />
    );
  });

  return (
    <Content>
      <Form onSubmit={handleSubmit}>
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
        <FormLabel sx={{ mt: 2 }} component="legend">
          Type of package *
        </FormLabel>
        {goodsCheckbox}
        {status === "searching" ? (
          <div className="lds-dual-ring"></div>
        ) : (
          <Button type="submit" value="Find" />
        )}
      </Form>
      <br />
      {status === "not found" && <Infos>No Offers Found</Infos>}
      {status === "found" && (
        <Masonry>
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              {...offer}
              animationOrder={offers.indexOf(offer)}
            />
          ))}
        </Masonry>
      )}
    </Content>
  );
};

export default SendPackage;
