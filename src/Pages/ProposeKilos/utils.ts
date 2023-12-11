import { Offer } from "./type";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "components/utils/firebase";

export const createOffer = async (offer: Offer): Promise<boolean | Error> => {
  try {
    await addDoc(collection(db, "offers"), {
      uid: offer.uid,
      departurePoint: offer.departurePoint.toLowerCase(),
      departureDate: offer.departureDate?.toISODate(),
      arrivalPoint: offer.arrivalPoint.toLowerCase(),
      arrivalDate: offer.arrivalDate?.toISODate(),
      numberOfKilos: Number(offer.numberOfKilos),
      bookings: [],
      price: Number(offer.price),
      currency: offer.currency,
      goods: offer.goods
        .filter((good) => good.checked === true)
        .map((good) => good.name),
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (e) {
    return e;
  }
};
