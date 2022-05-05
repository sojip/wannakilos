import "../styles/MyKilos.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../components/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

const MyKilos = (props) => {
  const [userid, setuserid] = useState("");
  const [offers, setoffers] = useState([]);
  let domoffers;

  useEffect(() => {
    function getoffers() {
      const q = query(
        collection(db, "offers"),
        where("uid", "==", userid),
        orderBy("timestamp", "desc")
      );
      //listen to real time changes
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let offers_ = [];
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === false)
            offers_.push({ ...doc.data(), id: doc.id });
        });
        setoffers(offers_);
      });
    }

    if (userid !== "") {
      getoffers();
    }
    return () => {
      setuserid("");
      setoffers([]);
    };
  }, [userid]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setuserid(uid);
    } else {
      setuserid("");
      setoffers([]);
    }
  });

  function handleDelete() {}

  // const linkStyle = {
  //   textDecoration: "none",
  //   color: "black",
  //   display: "block",
  //   width: "130px",
  //   height: "120px",
  //   backgroundColor: "white",
  //   textAlign: "center",
  //   paddingTop: "10px",
  //   borderRadius: "5px",
  //   boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
  //   margin: "0 2vw",
  // };
  if (offers.length > 0) {
    domoffers = offers.map((offer) => {
      return (
        <div
          className="userOffer"
          data-oid={offer.id}
          key={offers.indexOf(offer)}
        >
          <div className="road">
            <div className="offerDepature">{offer.departurePoint}</div>
            <img
              src="https://img.icons8.com/external-flatart-icons-solid-flatarticons/50/ffffff/external-right-arrow-arrow-flatart-icons-solid-flatarticons-2.png"
              alt=""
            />
            <div className="offerArrival">{offer.arrivalPoint}</div>
          </div>
          <div className="offerNumOfkilos">
            <div>Number of Kilos</div>
            <div>{offer.numberOfKilos}</div>
          </div>
          <div className="offerPrice">
            <div>Price/Kg</div>
            <div>
              {offer.price} {offer.currency}
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
            <div>{offer.departureDate}</div>
            <div> Arrival date</div>
            <div>{offer.arrivalDate}</div>
          </div>
          <div className="actions">
            <Link to={`/edit-${offer.id}`} id="editOffer">
              Edit
            </Link>
            <div id="deleteOffer" onClick={handleDelete}>
              Delete
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Link to={`/show-bookings-${offer.id}`} id="bookings">
                Bookings
              </Link>
              {offer.bookings.length > 0 && (
                <div
                  id="bookingsCounter"
                  style={{
                    position: "relative",
                    bottom: "7px",
                    backgroundColor: "white",
                    textAlign: "center",
                    padding: "5px",
                    borderRadius: "50%",
                    // padding: "1px 5px",
                    fontSize: "15px",
                  }}
                >
                  {offer.bookings.length}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="container MyKilosContainer">
      <div className="userOffers">{domoffers}</div>
    </div>
  );
};

export default MyKilos;
