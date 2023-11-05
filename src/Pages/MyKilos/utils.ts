import { Offer, Booking } from "./type";
import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { QuerySnapshot } from "@firebase/firestore-types";
import { db } from "components/utils/firebase";

export const offersListener = (
  uid: string,
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>
) => {
  const q = query(
    collection(db, "offers"),
    where("uid", "==", uid),
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
      setOffers(offers);
    }
  );
  return unsubscribe;
};

export const bookingsListener = (
  uid: string,
  setPendingBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  setAcceptepBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  const pendingQuery = query(
    collection(db, "bookings"),
    where("uid", "==", uid),
    where("status", "==", "pending"),
    orderBy("timestamp", "desc")
  );
  const acceptedQuery = query(
    collection(db, "bookings"),
    where("uid", "==", uid),
    where("status", "==", "accepted"),
    orderBy("timestamp", "desc")
  );
  //listen to real time changes
  const pendingUnsubscribe = onSnapshot(
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
      setPendingBookings(bookings);
    }
  );

  const acceptedUnsubscribe = onSnapshot(
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
      setAcceptepBookings(bookings);
    }
  );
  return [pendingUnsubscribe, acceptedUnsubscribe];
};
