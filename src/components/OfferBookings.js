import { useParams } from "react-router";
import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import "../styles/OfferBookings.css";
import { db } from "./utils/firebase";
import Masonry from "react-masonry-css";

const OfferBookings = (props) => {
  const { offerId } = useParams();
  const [offer, setoffer] = useState({});
  const [bookings, setbookings] = useState([]);
  const [dbBookings, setdbBookings] = useState([]);
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  let goods;
  let domBookings;

  useEffect(() => {
    async function getOfferDetails() {
      const docRef = doc(db, "offers", offerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // setoffer(docSnap.data());
        return docSnap.data();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return;
      }
    }

    async function getBookings() {
      const q = query(
        collection(db, "bookings"),
        where("offerId", "==", offerId),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(
        q,
        { includeMetadataChanges: true },
        (QuerySnapshot) => {
          let bookings = [];
          QuerySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === true) return;
            bookings.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setdbBookings(bookings);
        }
      );
      return unsubscribe;
    }

    let bookingsunsubscribe;
    Promise.all([getOfferDetails(), getBookings()]).then((response) => {
      const [offer, unsubscribe] = response;
      setoffer(offer);
      bookingsunsubscribe = unsubscribe;
    });
    return () => {
      bookingsunsubscribe();
    };
  }, []);

  useEffect(() => {
    async function getUsersDetails(bookings) {
      return Promise.all(bookings.map((booking) => getUserDetail(booking)));
    }

    async function getUserDetail(booking) {
      const docRef = doc(db, "users", booking.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userDetail = docSnap.data();
        return {
          ...booking,
          userPhoto: userDetail.photo,
          userfirstName: userDetail.firstName,
          userlastName: userDetail.lastName,
        };
      }
    }

    if (dbBookings.length > 0) {
      getUsersDetails(dbBookings).then((bookings) => setbookings(bookings));
    }
  }, [dbBookings]);

  const handleAcceptBooking = async (e) => {
    let target = e.target;
    target.textContent = "Waiting ...";
    let bid = e.target.dataset.bookingid;
    let docRef = doc(db, "bookings", bid);
    try {
      await updateDoc(docRef, { status: "accepted" });
    } catch (e) {
      alert(e);
    }
  };

  if (offer.goods) {
    goods = offer.goods.map((good) => {
      return <li key={offer.goods.indexOf(good)}>{good}</li>;
    });
  }

  if (bookings.length > 0) {
    domBookings = bookings.map((booking) => {
      let domGoods = booking.goods.map((good) => {
        return <li key={booking.goods.indexOf(good)}>{good}</li>;
      });
      return (
        <div id={booking.id} className="booking" key={booking.id}>
          {booking.status === "accepted" ? (
            <div className="bookingStatus">Waiting for Prepayment</div>
          ) : (
            <div className="bookingStatus">{booking.status}</div>
          )}
          <div className="user">
            <img src={booking.userPhoto} alt="" />
            <div>
              <div>{booking.userfirstName}</div>
              <div>{booking.userlastName}</div>
            </div>
          </div>
          <p className="bookingTitle">Goods</p>
          <ul style={{ listStyleType: "square" }}>{domGoods}</ul>
          <div className="grid-wrapper">
            <div className="bookingTitle">Number of Kilos</div>
            <div>{booking.numberOfKilos}</div>
            <div className="bookingTitle">Price/Kg</div>
            <div>
              {booking.price} {booking.currency}
            </div>
          </div>
          <p className="bookingTitle">Details</p>
          <p className="bookingDetails">{booking.bookingDetails}</p>
          <div className="grid-wrapper">
            <div className="bookingTitle">Total</div>
            <div>
              {booking.price * booking.numberOfKilos} {booking.currency}
            </div>
          </div>
          {booking.status === "pending" && (
            <button
              data-bookingid={booking.id}
              onClick={handleAcceptBooking}
              className="action"
            >
              accept
            </button>
          )}
        </div>
      );
    });
  }

  return (
    <div className="container showBookingsContainer">
      <div className="offer" id={offerId}>
        <div className="offerInfos">
          <div className="label">Departure</div>
          <div className="infos">{offer.departurePoint}</div>
        </div>
        <div className="offerInfos">
          <div className="label">Arrival</div>
          <div className="infos">{offer.arrivalPoint}</div>
        </div>
        <div className="offerInfos">
          <div className="label">Departure date</div>
          <div className="infos">{offer.departureDate}</div>
        </div>
        <div className="offerInfos">
          <div className="label">Arrival date</div>
          <div className="infos">{offer.arrivalDate}</div>
        </div>
        <div className="offerInfos">
          <div className="label">Number of kilos</div>
          <div className="infos">{offer.numberOfKilos}</div>
        </div>
        <div className="offerInfos">
          <div className="label">Price/Kg</div>
          <div className="infos">
            {offer.price} {offer.currency}
          </div>
        </div>
        <div className="offerInfos infosGoods">
          <div className="label" style={{ textAlign: "left" }}>
            Goods accepted
          </div>
          <div>
            <ul style={{ display: "flex", gap: "15px" }}>{goods}</ul>
          </div>
        </div>
      </div>
      <h2 style={{ paddingLeft: "2vw" }}>Bookings</h2>
      {domBookings ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {domBookings}
        </Masonry>
      ) : (
        <div className="infos">No Bookings Yet ...</div>
      )}
    </div>
  );
};

export default OfferBookings;
