import React from "react";
import { Link } from "components/Link";
import { useEffect, useState } from "react";
import { MasonryGrid as Masonry } from "../../components/MasonryGrid/Masonry";
import { DateTime } from "luxon";
import { useAuthContext } from "components/auth/useAuthContext";
import Spinner from "../../components/Spinner";
import { Content } from "components/DashboardContent";
import { Card, Counter } from "components/Card";
import { Offer, Booking } from "./type";
import { bookingsListener, offersListener } from "./utils";
import { Infos } from "Pages/SendPackage/SendPackage";

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
        $animationOrder={offers.indexOf(offer)}
        header={[offer.departurePoint, offer.arrivalPoint]}
        rows={[
          ["number of kilos", String(offer.numberOfKilos)],
          ["price/kg", `${offer.price}${offer.currency}`],
          ["goods accepted", [...offer.goods]],
          [
            "departure date",
            DateTime.fromISO(offer.departureDate).toLocaleString(
              DateTime.DATE_MED
            ),
          ],
          [
            "arrival date",
            DateTime.fromISO(offer.arrivalDate).toLocaleString(
              DateTime.DATE_MED
            ),
          ],
        ]}
        links={[
          <Link to={`/edit/offer/${offer.id}`}>edit</Link>,
          <Link to={`/delete/offer/${offer.id}`}>delete</Link>,
          <>
            <Link to={`/offers/${offer.id}/bookings`}>bookings</Link>
            {offer.bookings.length > 0 && (
              <Counter>{offer.bookings.length}</Counter>
            )}
          </>,
        ]}
      />
    );
  });

  const BookingsCards = bookings.map((booking) => {
    return (
      <Card
        $secondary
        key={bookings.indexOf(booking)}
        $animationOrder={bookings.indexOf(booking)}
        header={[booking.departurePoint, booking.arrivalPoint]}
        rows={[
          ["number of kilos", String(booking.numberOfKilos)],
          ["price/Kg", `${booking.price}${booking.currency}`],
          ["goods to send", [...booking.goods]],
          ["details", booking.bookingDetails],
          [
            "departure date",
            DateTime.fromISO(booking.departureDate).toLocaleString(
              DateTime.DATE_MED
            ),
          ],
          [
            "arrival date",
            DateTime.fromISO(booking.arrivalDate).toLocaleString(
              DateTime.DATE_MED
            ),
          ],
          [
            "total",
            `${booking.price * booking.numberOfKilos} ${booking.currency}`,
          ],
        ]}
        option={
          booking.status === "pending" ? (
            "pending"
          ) : (
            <Link to={`/pay/booking/${booking.id}`}>prepay now</Link>
          )
        }
      />
    );
  });

  return (
    <Content>
      <h2>My Offers</h2>
      {offers.length > 0 ? (
        <Masonry>{OffersCards}</Masonry>
      ) : (
        <Infos>No Offers Yet ...</Infos>
      )}

      <h2>My Bookings</h2>
      {bookings.length > 0 ? (
        <Masonry>{BookingsCards}</Masonry>
      ) : (
        <Infos>No Bookings Yet ...</Infos>
      )}
    </Content>
  );
};

export default MyKilos;
