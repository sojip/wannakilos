import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { QuerySnapshot } from "@firebase/firestore-types";
import { db } from "components/utils/firebase";
import { Booking, Offer } from "./types";

export const getOffer = async (id: string): Promise<Offer | null> => {
  const docRef = doc(db, "offers", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      departurePoint: data.departurePoint,
      arrivalPoint: data.arrivalPoint,
      departureDate: data.departureDate,
      arrivalDate: data.arrivalDate,
      numberOfKilos: data.numberOfKilos,
      price: data.price,
      currency: data.currency,
      goods: [...data.goods],
    };
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return null;
  }
};

export const getBookings = (
  id: string,
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  const q = query(
    collection(db, "bookings"),
    where("offerId", "==", id),
    orderBy("timestamp", "desc")
  );
  const unsubscribe = onSnapshot(
    q,
    { includeMetadataChanges: true },
    (QuerySnapshot: QuerySnapshot) => {
      let bookings: Booking[] = [];
      QuerySnapshot.forEach((doc) => {
        if (doc.metadata.hasPendingWrites === true) return;
        const data = doc.data();
        bookings.push({
          id: doc.id,
          uid: data.uid,
          numberOfKilos: data.numberOfKilos,
          price: data.price,
          currency: data.currency,
          goods: [...data.goods],
          status: data.status,
          bookingDetails: data.bookingDetails,
        });
      });
      setBookings(bookings);
    }
  );
  return unsubscribe;
};

export const getUserInfos = async (booking: Booking): Promise<Booking> => {
  const docRef = doc(db, "users", booking.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      ...booking,
      uPhoto: data.photo,
      uFirstName: data.firstName,
      uLastName: data.lastName,
    };
  }
  return { ...booking };
};
