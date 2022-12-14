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
import { db } from "../components/utils/firebase";
import Masonry from "react-masonry-css";
import { DateTime } from "luxon";
import useAuthContext from "./auth/useAuthContext";
import { doc, getDoc } from "firebase/firestore";

const MyKilos = (props) => {
  const user = useAuthContext();
  const uid = user?.id;
  const [offers, setoffers] = useState([]);
  const [bookings, setbookings] = useState([]);
  const [completeBookings, setcompleteBookings] = useState([]);
  let domoffers;
  let dombookings;
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  useEffect(() => {
    function getoffers(userid) {
      const q = query(
        collection(db, "offers"),
        where("uid", "==", userid),
        orderBy("timestamp", "desc")
      );
      //listen to real time changes
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let offers = [];
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === false)
            offers.push({ ...doc.data(), id: doc.id });
        });
        setoffers(offers);
      });
      return unsubscribe;
    }

    function getbookings(userid) {
      const q = query(
        collection(db, "bookings"),
        where("uid", "==", userid),
        where("status", "!=", "prepaid"),
        orderBy("status")
      );
      //listen to real time changes
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let bookings = [];
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === false)
            bookings.push({
              ...doc.data(),
              id: doc.id,
              timestamp: doc.data().timestamp.valueOf(),
            });
        });
        setbookings(
          bookings.sort(function (x, y) {
            return y.timestamp - x.timestamp;
          })
        );
      });
      return unsubscribe;
    }

    const offersunsubscribe = getoffers(uid);
    const bookingsunsubscribe = getbookings(uid);

    return () => {
      offersunsubscribe();
      bookingsunsubscribe();
    };
  }, []);

  useEffect(() => {
    async function getOffersDetails(bookings) {
      return Promise.all(bookings.map((booking) => getOfferDetail(booking)));
    }

    async function getOfferDetail(booking) {
      const docRef = doc(db, "offers", booking.offerId);
      const docSnap = await getDoc(docRef);
      const datas = docSnap.data();
      return {
        ...booking,
        departurePoint: datas.departurePoint,
        departureDate: datas.departureDate,
        arrivalPoint: datas.arrivalPoint,
        arrivalDate: datas.arrivalDate,
      };
    }
    if (bookings.length) {
      getOffersDetails(bookings).then((response) =>
        setcompleteBookings(response)
      );
    }
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
          <div className="offer-wrapper">
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
              <div>
                {DateTime.fromISO(offer.departureDate).toLocaleString(
                  DateTime.DATE_MED
                )}
              </div>
              <div> Arrival date</div>
              <div>
                {DateTime.fromISO(offer.arrivalDate).toLocaleString(
                  DateTime.DATE_MED
                )}
              </div>
            </div>
            <div className="actions">
              <Link to={`/edit/offer/${offer.id}`} id="editOffer">
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
                <Link to={`/offers/${offer.id}/bookings`} id="bookings">
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
        </div>
      );
    });
  }

  if (completeBookings.length > 0) {
    dombookings = completeBookings.map((booking) => {
      return (
        <div
          className="userBooking"
          data-oid={booking.id}
          key={completeBookings.indexOf(booking)}
        >
          <div className="booking-status">{booking.status}</div>
          <div className="booking-wrapper">
            <div className="road">
              <div className="offerDepature">{booking.departurePoint}</div>
              <img src={Airplane} alt="" />
              <div className="offerArrival">{booking.arrivalPoint}</div>
            </div>
            <div className="booking-wrapper-white">
              <div className="offerNumOfkilos">
                <div>Number of Kilos</div>
                <div>{booking.numberOfKilos}</div>
              </div>
              <div className="offerPrice">
                <div>Price/Kg</div>
                <div>
                  {booking.price} {booking.currency}
                </div>
              </div>
              <div className="offerTotalPrice">
                <div>Total Price</div>
                <div>
                  {booking.price * booking.numberOfKilos} {booking.currency}
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
              <div className="booking-details">
                <div>Details</div>
                <div>{booking.bookingDetails}</div>
              </div>
              <div className="dates">
                <div> Departure date</div>
                <div>
                  {DateTime.fromISO(booking.departureDate).toLocaleString(
                    DateTime.DATE_MED
                  )}
                </div>
                <div> arrival date</div>
                <div>
                  {DateTime.fromISO(booking.arrivalDate).toLocaleString(
                    DateTime.DATE_MED
                  )}
                </div>
              </div>

              {booking.status === "accepted" && (
                <Link to={`/pay/booking/${booking.id}`} className="payBooking">
                  Prepay now
                </Link>
              )}
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="container MyKilosContainer">
      <h2>My Offers</h2>
      {offers.length ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {domoffers}
        </Masonry>
      ) : (
        <div className="infos">No Offers Yet ...</div>
      )}

      <h2>My Bookings</h2>
      {bookings.length ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {dombookings}
        </Masonry>
      ) : (
        <div className="infos">No Bookings Yet ...</div>
      )}
    </div>
  );
};

export default MyKilos;
