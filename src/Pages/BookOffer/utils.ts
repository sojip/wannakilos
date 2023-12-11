import {
  doc,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import { Offer, Booking } from "./type";

export async function createBooking(
  uid: string,
  offer: Offer,
  booking: Booking
): Promise<boolean> {
  try {
    //add booking to database
    const docRef = await addDoc(collection(db, "bookings"), {
      uid,
      offerId: offer.id,
      offerUserId: offer.uid,
      departurePoint: offer.departurePoint,
      departureDate: offer.departureDate,
      arrivalPoint: offer.arrivalPoint,
      arrivalDate: offer.arrivalDate,
      goods: booking.goods,
      numberOfKilos: Number(booking.numberOfKilos),
      bookingDetails: booking.bookingDetails,
      price: offer.price,
      currency: offer.currency,
      status: "pending",
      timestamp: serverTimestamp(),
    });
    //update offer bookings in database
    const offerRef = doc(db, "offers", offer.id);
    await updateDoc(offerRef, {
      bookings: arrayUnion(docRef.id),
    });
    return true;
  } catch (e) {
    alert(e);
    return false;
  }
}

export async function getOffer(id: string): Promise<Offer | undefined> {
  const docRef = doc(db, "offers", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const doc = docSnap.data();
    return {
      id,
      uid: doc.uid,
      departureDate: doc.departureDate,
      departurePoint: doc.departurePoint,
      arrivalPoint: doc.arrivalPoint,
      arrivalDate: doc.arrivalDate,
      currency: doc.currency,
      numberOfKilos: doc.numberOfKilos,
      price: doc.price,
      goods: doc.goods,
    };
  } else {
    // doc.data() will be undefined in this case
    return undefined;
  }
}
