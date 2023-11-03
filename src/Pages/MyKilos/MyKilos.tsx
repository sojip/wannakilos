import React from "react";
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
import { MasonryGrid as Masonry } from "../../components/MasonryGrid/Masonry";
import { DateTime } from "luxon";
import { useAuthContext } from "components/auth/useAuthContext";
import Spinner from "../../components/Spinner";
import styled, { keyframes } from "styled-components";
import { Timestamp, QuerySnapshot } from "@firebase/firestore-types";
import { Content } from "components/DashboardContent";

const OfferCard = styled.div<{ $order?: number }>`
  border-radius: 15px;
  padding: 10px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  position: relative;
  animation: fadeIn 350ms ease-in both;
  animation-delay: calc(${(props) => props.$order} * 100ms);
`;

const BookingCard = styled(OfferCard)<{ $order?: number }>``;

type Offer = {
  id: string;
  departurePoint: string;
  arrivalPoint: string;
  departureDate: string;
  arrivalDate: string;
  numberOfKilos: number;
  price: number;
  currency: string;
  goods: string[];
  bookings?: string[];
  timestamp: Timestamp;
};

type Booking = Offer & {
  id: string;
  status: string;
  bookingDetails: string;
};

const MyKilos: React.FC = (): JSX.Element => {
  const { user } = useAuthContext();
  const uid = user?.id;
  const [offers, setoffers] = useState<Offer[]>([]);
  const [bookings, setbookings] = useState<Booking[]>([]);
  const [pendingBookings, setpendingBookings] = useState<Booking[]>([]);
  const [acceptedBookings, setacceptedBookings] = useState<Booking[]>([]);
  const [isLoading, setisLoading] = useState(true);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  useEffect(() => {
    function getoffers(userid: string) {
      const q = query(
        collection(db, "offers"),
        where("uid", "==", userid),
        orderBy("timestamp", "desc")
      );
      //listen to real time changes
      const unsubscribe = onSnapshot(
        q,
        { includeMetadataChanges: true },
        (querySnapshot: QuerySnapshot) => {
          let offers: Offer[] = [];
          querySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === false) {
              const data = doc.data();
              offers.push({
                id: doc.id,
                departureDate: data.departureDate,
                departurePoint: data.departurePoint,
                arrivalPoint: data.arrivalPoint,
                arrivalDate: data.arrivalDate,
                numberOfKilos: data.numberOfKilos,
                price: data.price,
                currency: data.currency,
                goods: data.goods,
                bookings: data.bookings,
                timestamp: data.timestamp,
              });
            }
          });
          setoffers(offers);
        }
      );
      return unsubscribe;
    }

    function getbookings(userid: string) {
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
        (querySnapshot: QuerySnapshot) => {
          let bookings: Booking[] = [];
          querySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === false) {
              const data = doc.data();
              bookings.push({
                // ...doc.data(),
                id: doc.id,
                status: data.status,
                bookingDetails: data.bookingDetails,
                departurePoint: data.departurePoint,
                departureDate: data.departureDate,
                arrivalPoint: data.arrivalPoint,
                arrivalDate: data.arrivalDate,
                numberOfKilos: data.numberOfKilos,
                price: data.price,
                currency: data.currency,
                goods: data.goods,
                timestamp: doc.data().timestamp,
              });
            }
          });
          setpendingBookings(bookings);
        }
      );

      const acceptedunsubscribe = onSnapshot(
        acceptedQuery,
        {
          includeMetadataChanges: true,
        },
        (querySnapshot: QuerySnapshot) => {
          let bookings: Booking[] = [];
          querySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === false) {
              const data = doc.data();
              bookings.push({
                id: doc.id,
                status: data.status,
                bookingDetails: data.bookingDetails,
                departurePoint: data.departurePoint,
                departureDate: data.departureDate,
                arrivalPoint: data.arrivalPoint,
                arrivalDate: data.arrivalDate,
                numberOfKilos: data.numberOfKilos,
                price: data.price,
                currency: data.currency,
                goods: data.goods,
                timestamp: doc.data().timestamp,
              });
            }
          });
          setacceptedBookings(bookings);
        }
      );
      return [pendingunsubscribe, acceptedunsubscribe];
    }

    const offersunsubscribe = getoffers(uid as string);
    const [pendingbookingsunsubscribe, acceptedbookingsunsubscribe] =
      getbookings(uid as string);

    return () => {
      offersunsubscribe();
      pendingbookingsunsubscribe();
      acceptedbookingsunsubscribe();
    };
  }, []);

  useEffect(() => {
    setbookings(
      [...pendingBookings, ...acceptedBookings].sort(function (x, y) {
        // return y.timestamp.valueOf() - x.timestamp.valueOf();
        return y.timestamp.toMillis() - x.timestamp.toMillis();
      })
    );
  }, [pendingBookings, acceptedBookings]);

  function handleDelete() {}

  const OffersCards = offers?.map((offer) => {
    return (
      <OfferCard
        className="userOffer"
        data-oid={offer.id}
        key={offers.indexOf(offer)}
        $order={offers.indexOf(offer)}
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
              {(offer?.bookings?.length as number) > 0 && (
                <div className="bookingsCounter" style={{}}>
                  {offer?.bookings?.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </OfferCard>
    );
  });

  const BookingsCards = bookings?.map((booking) => {
    return (
      <BookingCard
        className="userBooking"
        data-oid={booking.id}
        key={bookings.indexOf(booking)}
        $order={bookings.indexOf(booking)}
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
      </BookingCard>
    );
  });

  return (
    <Content>
      <h2>My Offers</h2>
      {offers.length > 0 ? (
        <Masonry>{OffersCards}</Masonry>
      ) : (
        <div className="infos">No Offers Yet ...</div>
      )}

      <h2>My Bookings</h2>
      {bookings.length > 0 ? (
        <Masonry>{BookingsCards}</Masonry>
      ) : (
        <div className="infos">No Bookings Yet ...</div>
      )}
    </Content>
  );
};

export default MyKilos;
