import React from "react";
import { Link } from "components/Link";
import { useEffect, useState } from "react";
import { MasonryGrid as Masonry } from "components/MasonryGrid/Masonry";
import { DateTime } from "luxon";
import { useAuthContext } from "components/auth/useAuthContext";
import { Spinner } from "components/Spinner";
import { Content } from "components/DashboardContent";
import { Card, CardOption, CardStatus } from "components/Card";
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
    return () => {
      offersUnsubscribe();
      bookingsUnsubcribe();
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
      <div key={offer.id}>
        <Card $animationOrder={offers.indexOf(offer)}>
          <Card.Header
            value1={offer.departurePoint}
            value2={offer.arrivalPoint}
            Icon={<img src={AirplaneIcon} alt="" />}
          />
          <Card.Body>
            <Card.Row name={"number of kilos"} value={offer.numberOfKilos} />
            <Card.Row
              name={"price"}
              value={`${offer.price} ${offer.currency}/Kg`}
            />
            <Card.List name={"goods accepted"} values={offer.goods} />
            <Card.Row
              name={"departure date"}
              value={DateTime.fromISO(offer.departureDate).toLocaleString(
                DateTime.DATE_MED
              )}
            />
            <Card.Row
              name={"arrival date"}
              value={DateTime.fromISO(offer.arrivalDate).toLocaleString(
                DateTime.DATE_MED
              )}
            />
            <Card.Links>
              <Link to={`/edit/offer/${offer.id}`}>edit</Link>
              <Link to={`/delete/offer/${offer.id}`}>delete</Link>
              <div>
                <Link to={`/offers/${offer.id}/bookings`}>bookings</Link>
                {offer.bookings.length > 0 && (
                  <Counter>{offer.bookings.length}</Counter>
                )}
              </div>
            </Card.Links>
          </Card.Body>
        </Card>
      </div>
    );
  });

  const BookingsCards = bookings.map((booking) => {
    return (
      <>
        <Card
          key={booking.id}
          $secondary
          $animationOrder={bookings.indexOf(booking)}
        >
          <Card.Header
            $secondary
            value1={booking.departurePoint}
            value2={booking.arrivalPoint}
            Icon={<img src={AirplaneIcon} alt="" />}
          />
          <Card.Body $secondary>
            <Card.Row name={"number of kilos"} value={booking.numberOfKilos} />
            <Card.Row
              name={"price"}
              value={`${booking.price} ${booking.currency}/Kg`}
            />
            <Card.List name={"goods to send"} values={booking.goods} />
            <Card.Text title={"details"} text={booking.bookingDetails} />
            <Card.Row
              name={"departure date"}
              value={DateTime.fromISO(booking.departureDate).toLocaleString(
                DateTime.DATE_MED
              )}
            />
            <Card.Row
              name={"arrival date"}
              value={DateTime.fromISO(booking.arrivalDate).toLocaleString(
                DateTime.DATE_MED
              )}
            />
          </Card.Body>
        </Card>
        <CardOption>
          {booking.status === "pending" ? (
            <CardStatus status={"pending..."} />
          ) : (
            <Link to={`/pay/booking/${booking.id}`}>prepay now</Link>
          )}
        </CardOption>
      </>
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
