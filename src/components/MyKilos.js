import "../styles/MyKilos.css";
import Airplane from "../img/airplane-takeoff.png";
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
  let user = props.user;
  const [offers, setoffers] = useState([]);
  const [bookings, setbookings] = useState([]);
  const [completeBookings, setcompleteBookings] = useState([]);
  let domoffers;
  let dombookings;

  useEffect(() => {
    function getoffers(userid) {
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
      return unsubscribe;
    }

    function getbookings(userid) {
      const q = query(
        collection(db, "bookings"),
        where("uid", "==", userid),
        orderBy("timestamp", "desc")
      );
      //listen to real time changes
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let bookings_ = [];
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === false)
            bookings_.push({ ...doc.data(), id: doc.id });
        });
        console.log(bookings_);

        setbookings(bookings_);
      });
      return unsubscribe;
    }

    let offersunsubscribe;
    let bookingsunsubscribe;

    if (user !== undefined) {
      offersunsubscribe = getoffers(user.uid);
      bookingsunsubscribe = getbookings(user.uid);
    }
    return () => {
      offersunsubscribe();
      bookingsunsubscribe();
    };
  }, []);

  useEffect(() => {
    async function getOfferBooked(id) {
      let datas;
      const q = query(
        collection(db, "offers"),
        where("bookings", "array-contains", id)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        datas = doc.data();
      });
      return datas;
    }

    let offersBooked = bookings.map((booking) => {
      return getOfferBooked(booking.id);
    });

    Promise.all(offersBooked).then((results) => {
      setcompleteBookings(
        results.map((result) => {
          return { offerDetails: result, ...bookings[results.indexOf(result)] };
        })
      );
    });

    console.log(completeBookings);
  }, [bookings]);

  function handleDelete() {}

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
            <img src={Airplane} alt="" />
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

  if (completeBookings.length > 0) {
    dombookings = completeBookings.map((booking) => {
      return (
        <div
          className="userOffer"
          data-oid={booking.id}
          key={completeBookings.indexOf(booking)}
        >
          <div className="road">
            <div className="offerDepature">
              {booking.offerDetails.departurePoint}
            </div>
            <img src={Airplane} alt="" />
            <div className="offerArrival">
              {booking.offerDetails.arrivalPoint}
            </div>
          </div>
          <div className="offerNumOfkilos">
            <div>Number of Kilos</div>
            <div>{booking.numberOfKilos}</div>
          </div>
          <div className="offerPrice">
            <div>Price/Kg</div>
            <div>
              {booking.offerDetails.price} {booking.offerDetails.currency}
            </div>
          </div>
          <div className="offerGoods">
            <div className="goodsTitle">Goods to send</div>
            <ul style={{ listStyleType: "square" }}>
              {booking.goods.map((good) => (
                <li key={booking.goods.indexOf(good)}>{good}</li>
              ))}
            </ul>
          </div>
          <div className="dates">
            <div> Departure date</div>
            <div>{booking.offerDetails.departureDate}</div>
            <div> Arrival date</div>
            <div>{booking.offerDetails.arrivalDate}</div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="container MyKilosContainer">
      <h2>My Offers</h2>
      {offers.length ? (
        <div className="userOffers">{domoffers}</div>
      ) : (
        <div className="infos">No Offers Yet ...</div>
      )}

      <h2>My Bookings</h2>
      {bookings.length ? (
        <div className="userBookings">{dombookings}</div>
      ) : (
        <div className="infos">No Bookings Yet ...</div>
      )}
    </div>
  );
};

export default MyKilos;
