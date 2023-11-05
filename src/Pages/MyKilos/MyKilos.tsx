import React from "react";
// import "./MyKilos.css";
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
import { Card } from "components/Card";
import { Offer, Booking } from "./type";
import { bookingsListener, offersListener } from "./utils";

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

const MyKilos: React.FC = (): JSX.Element => {
  const { user } = useAuthContext();
  const uid = user?.id;
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [acceptedBookings, setAcceptedBookings] = useState<Booking[]>([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const offersUnsubscribe = offersListener(uid as string, setOffers);
    const [pendingUnsubscribe, acceptedUnsubscribe] = bookingsListener(
      uid as string,
      setPendingBookings,
      setAcceptedBookings
    );
    return () => {
      offersUnsubscribe();
      pendingUnsubscribe();
      acceptedUnsubscribe();
    };
  }, []);

  useEffect(() => {
    setBookings(
      [...pendingBookings, ...acceptedBookings].sort(function (x, y) {
        return y.timestamp.toMillis() - x.timestamp.toMillis();
      })
    );
  }, [pendingBookings, acceptedBookings]);

  function handleDelete() {}

  const OffersCards = offers?.map((offer) => {
    return (
      <Card
        key={offers.indexOf(offer)}
        animationOrder={offers.indexOf(offer)}
        header={[offer.departurePoint, offer.arrivalPoint]}
        links={[
          {
            to: `/edit/offer/${offer.id}`,
            value: "edit",
          },
          {
            to: `/delete/offer/${offer.id}`,
            value: "delete",
          },
          {
            to: `/offers/${offer.id}/bookings`,
            value: `bookings`,
            count: offer.bookings.length,
          },
        ]}
        rows={[
          {
            name: "number of kilos",
            value: String(offer.numberOfKilos),
          },
          {
            name: "price/Kg",
            value: `${offer.price}${offer.currency}`,
          },
          {
            name: "goods accepted",
            value: [...offer.goods],
            $fullWidth: true,
          },
          {
            name: "departure date",
            value: DateTime.fromISO(offer.departureDate).toLocaleString(
              DateTime.DATE_MED
            ),
          },
          {
            name: "arrival date",
            value: DateTime.fromISO(offer.arrivalDate).toLocaleString(
              DateTime.DATE_MED
            ),
          },
        ]}
      />
    );
  });

  const BookingsCards = bookings.map((booking) => {
    return (
      <Card
        $secondary
        key={bookings.indexOf(booking)}
        animationOrder={bookings.indexOf(booking)}
        header={[booking.departurePoint, booking.arrivalPoint]}
        rows={[
          {
            name: "number of kilos",
            value: String(booking.numberOfKilos),
          },
          {
            name: "price/Kg",
            value: `${booking.price}${booking.currency}`,
          },
          {
            name: "goods to send",
            value: [...booking.goods],
            $fullWidth: true,
          },
          {
            name: "details",
            value: booking.bookingDetails,
          },
          {
            name: "departure date",
            value: DateTime.fromISO(booking.departureDate).toLocaleString(
              DateTime.DATE_MED
            ),
          },
          {
            name: "arrival date",
            value: DateTime.fromISO(booking.arrivalDate).toLocaleString(
              DateTime.DATE_MED
            ),
          },
          {
            name: "total",
            value: `${booking.price * booking.numberOfKilos} ${
              booking.currency
            }`,
          },
        ]}
        option={
          booking.status === "pending"
            ? "pending"
            : { to: `/pay/booking/${booking.id}`, value: "prepay now" }
        }
      />
    );
  });

  // const BookingsCards = bookings?.map((booking) => {
  //   return (
  //     <BookingCard
  //       className="userBooking"
  //       data-oid={booking.id}
  //       key={bookings.indexOf(booking)}
  //       $order={bookings.indexOf(booking)}
  //     >
  //       <div className="booking-status">{booking.status}</div>
  //       <div className="booking-wrapper">
  //         <div className="road">
  //           <div className="offerDepature">{booking.departurePoint}</div>
  //           <img src={Airplane} alt="" />
  //           <div className="offerArrival">{booking.arrivalPoint}</div>
  //         </div>
  //         <div className="booking-wrapper-white">
  //           <div className="offerNumOfkilos">
  //             <div>Number of Kilos</div>
  //             <div>{booking.numberOfKilos}</div>
  //           </div>
  //           <div className="offerPrice">
  //             <div>Price/Kg</div>
  //             <div>
  //               {booking.price} {booking.currency}
  //             </div>
  //           </div>
  //           <div className="offerTotalPrice">
  //             <div>Total Price</div>
  //             <div>
  //               {booking.price * booking.numberOfKilos} {booking.currency}
  //             </div>
  //           </div>
  //           <div className="offerGoods">
  //             <div className="goodsTitle">Goods to send</div>
  //             <ul style={{ listStyleType: "square" }}>
  //               {booking.goods.map((good) => (
  //                 <li key={booking.goods.indexOf(good)}>{good}</li>
  //               ))}
  //             </ul>
  //           </div>
  //           <div className="booking-details">
  //             <div>Details</div>
  //             <div>{booking.bookingDetails}</div>
  //           </div>
  //           <div className="dates">
  //             <div> Departure date</div>
  //             <div>
  //               {DateTime.fromISO(booking.departureDate).toLocaleString(
  //                 DateTime.DATE_MED
  //               )}
  //             </div>
  //             <div> arrival date</div>
  //             <div>
  //               {DateTime.fromISO(booking.arrivalDate).toLocaleString(
  //                 DateTime.DATE_MED
  //               )}
  //             </div>
  //           </div>

  //           {booking.status === "accepted" && (
  //             <Link to={`/pay/booking/${booking.id}`} className="payBooking">
  //               Prepay now
  //             </Link>
  //           )}
  //         </div>
  //       </div>
  //     </BookingCard>
  //   );
  // });

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
