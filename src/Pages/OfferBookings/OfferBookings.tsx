import React from "react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import { MasonryGrid as Masonry } from "components/MasonryGrid/Masonry";
import { getOffer, getBookings, getUserInfos } from "./utils";
import { Offer, Booking } from "./types";
import { BookingCard } from "./Booking";
import { Button } from "components/Button";
import { Content } from "components/DashboardContent";
import { OfferCard } from "./Offer";
import { Infos } from "Pages/SendPackage/SendPackage";

const OfferBookings = () => {
  const { offerId } = useParams();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dbBookings, setdbBookings] = useState<Booking[]>([]);

  useEffect(() => {
    (async () => {
      const offer = await getOffer(offerId as string);
      setOffer(offer);
    })();
    const bookingsListener = getBookings(offerId as string, setdbBookings);
    return () => {
      bookingsListener();
    };
  }, []);

  useEffect(() => {
    async function getUsersDetails(bookings: Booking[]) {
      return Promise.all(bookings.map((booking) => getUserInfos(booking)));
    }
    if (dbBookings.length > 0) {
      (async () => {
        const bookings = await getUsersDetails(dbBookings);
        setBookings(bookings);
      })();
    }
  }, [dbBookings]);

  const handleAcceptBooking = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    let target = e.target as HTMLButtonElement;
    target.textContent = "waiting...";
    target.style.color = "black";
    let docRef = doc(db, "bookings", id);
    try {
      await updateDoc(docRef, { status: "accepted" });
    } catch (e) {
      alert(e);
    }
  };

  const BookingCards = bookings?.map((booking) => {
    return (
      <BookingCard
        key={bookings.indexOf(booking)}
        $animationOrder={bookings.indexOf(booking)}
        header={[
          booking.uPhoto as string,
          [booking.uFirstName as string, booking.uLastName as string],
        ]}
        rows={[
          ["goods", [...booking.goods]],
          ["number of kilos", String(booking.numberOfKilos)],
          ["details", booking.bookingDetails],
          [
            "total",
            `${booking.price * booking.numberOfKilos} ${booking.currency}`,
          ],
        ]}
        option={
          booking.status === "pending" ? (
            <Button
              onClick={(e) => {
                handleAcceptBooking(e, booking.id);
              }}
              value="accept"
            />
          ) : booking.status === "accepted" ? (
            "waiting for prepayment"
          ) : booking.status === "prepaid" ? (
            "waiting for delivery"
          ) : undefined
        }
      />
    );
  });

  return (
    <Content>
      {offer !== null && <OfferCard offer={offer} />}
      <h2>Bookings</h2>
      {bookings.length > 0 ? (
        <Masonry>{BookingCards}</Masonry>
      ) : (
        <Infos>No Bookings Yet ...</Infos>
      )}
    </Content>
  );
};

export default OfferBookings;
