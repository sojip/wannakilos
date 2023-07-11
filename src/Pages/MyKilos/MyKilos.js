import "./MyKilos.css";
import Airplane from "../../img/airplane-takeoff.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import Masonry from "react-masonry-css";
import { DateTime } from "luxon";
import { useAuthContext } from "../../components/auth/Auth";
import Spinner from "../../components/Spinner";

const MyKilos = (props) => {
  const user = useAuthContext();
  const uid = user?.id;
  const [offers, setoffers] = useState([]);
  const [bookings, setbookings] = useState([]);
  const [pendingBookings, setpendingBookings] = useState([]);
  const [acceptedBookings, setacceptedBookings] = useState([]);
  const [isLoading, setisLoading] = useState(true);

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
      const unsubscribe = onSnapshot(
        q,
        { includeMetadataChanges: true },
        (querySnapshot) => {
          let offers = [];
          querySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === false)
              offers.push({ ...doc.data(), id: doc.id });
          });
          setoffers(offers);
        }
      );
      return unsubscribe;
    }

    function getbookings(userid) {
      const pendingQuery = query(
        collection(db, "bookings"),
        where("uid", "==", userid),
        where("status", "==", "pending"),
        orderBy("timestamp", "desc")
      );
      const acceptedQuery = query(
        collection(db, "bookings"),
        where("uid", "==", userid),
        where("status", "==", "accepted"),
        orderBy("timestamp", "desc")
      );
      //listen to real time changes
      const pendingunsubscribe = onSnapshot(
        pendingQuery,
        {
          includeMetadataChanges: true,
        },
        (querySnapshot) => {
          let bookings = [];
          querySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === false)
              bookings.push({
                ...doc.data(),
                id: doc.id,
                timestamp: doc.data().timestamp.valueOf(),
              });
          });
          setpendingBookings(bookings);
        }
      );

      const acceptedunsubscribe = onSnapshot(
        acceptedQuery,
        {
          includeMetadataChanges: true,
        },
        (querySnapshot) => {
          let bookings = [];
          querySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === false)
              bookings.push({
                ...doc.data(),
                id: doc.id,
                timestamp: doc.data().timestamp.valueOf(),
              });
          });
          setacceptedBookings(bookings);
        }
      );
      return [pendingunsubscribe, acceptedunsubscribe];
    }

    const offersunsubscribe = getoffers(uid);
    const [pendingbookingsunsubscribe, acceptedbookingsunsubscribe] =
      getbookings(uid);

    return () => {
      offersunsubscribe();
      pendingbookingsunsubscribe();
      acceptedbookingsunsubscribe();
    };
  }, []);

  useEffect(() => {
    setbookings(
      [...pendingBookings, ...acceptedBookings].sort(function (x, y) {
        return y.timestamp - x.timestamp;
      })
    );
  }, [pendingBookings, acceptedBookings]);

  function handleDelete() {}

  const OffersCards = offers?.map((offer) => {
    return (
      <div
        className="userOffer"
        data-oid={offer.id}
        key={offers.indexOf(offer)}
        style={{ "--animationOrder": offers.indexOf(offer) }}
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
              {offer?.bookings?.length > 0 && (
                <div className="bookingsCounter" style={{}}>
                  {offer.bookings.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });

  const BookingsCards = bookings?.map((booking) => {
    return (
      <div
        className="userBooking"
        data-oid={booking.id}
        key={bookings.indexOf(booking)}
        style={{ "--animationOrder": bookings.indexOf(booking) }}
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

  return (
    <div className="container MyKilosContainer">
      <h2>My Offers</h2>
      {offers.length ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {OffersCards}
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
          {BookingsCards}
        </Masonry>
      ) : (
        <div className="infos">No Bookings Yet ...</div>
      )}
    </div>
  );
};

export default MyKilos;
