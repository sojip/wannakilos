import { useState, useEffect } from "react";
import "./Announcements.css";
import AirplaneImage from "../../img/airplane-takeoff_black.png";
import { db } from "../../components/utils/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
} from "firebase/firestore";
import AirplaneLanding from "../../img/airplane-landing.png";
import { DateTime } from "luxon";

const Annoucements = (props) => {
  const [announceCount, setannounceCount] = useState(0);
  const [offers, setoffers] = useState([]);

  useEffect(() => {
    let controller = new AbortController();
    const signal = controller.signal;
    async function getOffers() {
      let datas = [];
      const q = query(collection(db, "offers"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        datas.push({ ...doc.data(), id: doc.id });
      });
      console.log(datas);
      return datas;
    }
    getOffers(signal).then((datas) => {
      setoffers(datas);
      setannounceCount(datas.length);
    });
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div id="announcementsWrapper">
      <div className="videoplayer">Video Container</div>
      <div className="announcements">
        <div className="filter">
          <div>Annoucement : {announceCount}</div>
          <form id="filterform">
            <label htmlFor="filters">Sort by : </label>
            <select name="filters" id="filters" form="filterform">
              <option value="distance">Distance</option>
              <option value="date">Date</option>
              <option value="price">Price</option>
            </select>
          </form>
        </div>
        <div className="offers">
          {offers.length > 0 &&
            offers.map((offer) => {
              return (
                <div className="homeOffer" key={offer.id}>
                  <div className="offerInfos">
                    <div>{offer.departurePoint} </div>
                    <i className="fa-solid fa-right-long"></i>
                    <div>{offer.arrivalPoint}</div>
                  </div>
                  <div className="offerInfos dates">
                    <div>
                      <i className="fa-solid fa-plane-departure"></i>
                      {/* <img src={AirplaneImage} alt="" /> */}
                      {DateTime.fromISO(offer.departureDate).toLocaleString(
                        DateTime.DATE_MED
                      )}
                    </div>
                    <div>
                      {/* <img src={AirplaneLanding} alt="" /> */}
                      {DateTime.fromISO(offer.arrivalDate).toLocaleString(
                        DateTime.DATE_MED
                      )}
                      <i className="fa-solid fa-plane-arrival"></i>
                    </div>
                  </div>
                  <div className="offerInfos">
                    <div>{offer.numberOfKilos} Kg</div>
                    <div>{`${offer.price}${offer.currency}/Kg`}</div>
                  </div>

                  <div className="offerInfos infosGoods">
                    <div className="label" style={{ textAlign: "left" }}>
                      Accepted :
                    </div>
                    <div>
                      <ul style={{ display: "flex", gap: "15px" }}>
                        {offer.goods.map((good) => (
                          <li key={offer.goods.indexOf(good)}>{good}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Annoucements;
