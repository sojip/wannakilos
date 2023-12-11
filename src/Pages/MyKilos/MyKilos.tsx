import React from "react";
import { Link } from "components/Link";
import { useEffect, useState } from "react";
import { MasonryGrid as Masonry } from "components/MasonryGrid/Masonry";
import { DateTime } from "luxon";
import { useAuthContext } from "components/auth/useAuthContext";
import { Spinner } from "components/Spinner";
import { Content } from "components/DashboardContent";
import { Card } from "components/Card";
import { Offer, Booking } from "./type";
import { bookingsListener, offersListener } from "./utils";
import { Infos } from "Pages/SendPackage/SendPackage";
import styled from "styled-components";
import AirplaneIcon from "../../img/airplane-takeoff.png";

export const Counter = styled.div`
  position: relative;
  bottom: 12px;
  color: var(--blue);
  font-weight: bold;
  font-size: 0.7rem;
`;

const Wrapper = styled.div`
  position: relative;
  min-height: 100px;
`;

const MyKilos: React.FC = (): JSX.Element => {
  const { user } = useAuthContext();
  const uid = user?.id;
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [acceptedBookings, setAcceptedBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState({
    offers: true,
    bookings: true,
  });
  useEffect(() => {
    const offersUnsubscribe = offersListener(
      uid as string,
      setOffers,
      setIsLoading
    );
    const bookingsUnsubcribe = bookingsListener(
      uid as string,
      setBookings,
      setIsLoading
    );
    // const [pendingUnsubscribe, acceptedUnsubscribe] = bookingsListener(
    //   uid as string,
    //   setPendingBookings,
    //   setAcceptedBookings,
    //   setIsLoading
    // );
    return () => {
      offersUnsubscribe();
      bookingsUnsubcribe();
      // pendingUnsubscribe();
      // acceptedUnsubscribe();
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
        header={[offer.departurePoint, offer.arrivalPoint, AirplaneIcon]}
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
        key={bookings.indexOf(booking)}
        $secondary
        $animationOrder={bookings.indexOf(booking)}
        header={[booking.departurePoint, booking.arrivalPoint, AirplaneIcon]}
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
      <Wrapper>
        {isLoading.offers === true ? (
          <Spinner />
        ) : offers.length > 0 ? (
          <Masonry>{OffersCards}</Masonry>
        ) : (
          <Infos>No Offers Yet ...</Infos>
        )}
      </Wrapper>

      <h2>My Bookings</h2>
      <Wrapper>
        {isLoading.bookings === true ? (
          <Spinner />
        ) : bookings.length > 0 ? (
          <Masonry>{BookingsCards}</Masonry>
        ) : (
          <Infos>No Bookings Yet ...</Infos>
        )}
      </Wrapper>
    </Content>
  );
};

export default MyKilos;
