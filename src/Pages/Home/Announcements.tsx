import { useState, useEffect } from "react";
import "./Announcements.css";
import { db } from "../../components/utils/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import React from "react";
import { OfferLarge } from "./OfferLarge";
import { QuerySnapshot } from "@firebase/firestore-types";

export interface Offer {
  id: string;
  arrivalDate: string;
  arrivalPoint: string;
  departureDate: string;
  departurePoint: string;
  numberOfKilos: number;
  price: number;
  uid: string;
  goods: string[];
  bookings: string[];
  currency: string;
}

const Annoucements = () => {
  const [announceCount, setannounceCount] = useState(0);
  const [offers, setoffers] = useState<Offer[]>([]);

  useEffect(() => {
    async function getOffers() {
      let datas: Offer[] = [];
      const q = query(collection(db, "offers"), orderBy("timestamp", "desc"));
      const querySnapshot: QuerySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let _doc = doc.data();
        datas.push({
          id: doc.id,
          arrivalDate: _doc.arrivalDate,
          arrivalPoint: _doc.arrivalPoint,
          departureDate: _doc.departureDate,
          departurePoint: _doc.departurePoint,
          goods: _doc.goods,
          bookings: _doc.bookings,
          currency: _doc.currency,
          price: _doc.price,
          numberOfKilos: _doc.numberOfKilos,
          uid: _doc.uid,
        });
      });
      return datas;
    }
    getOffers().then((offers) => {
      setoffers([...offers]);
      setannounceCount(offers.length);
    });
    return;
  }, []);

  return (
    <div id="announcementsWrapper">
      <div className="videoplayer">Video Container</div>
      <div className="announcements">
        <div>Annoucements : {announceCount}</div>
        <div className="offers">
          {offers.length > 0 &&
            offers.map((offer) => <OfferLarge key={offer.id} {...offer} />)}
        </div>
      </div>
    </div>
  );
};

export default Annoucements;
