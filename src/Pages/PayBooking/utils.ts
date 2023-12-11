import { QuerySnapshot } from "@firebase/firestore-types";
import { Booking, Offer, Card, Paypal } from "./type";
import { db } from "components/utils/firebase";
import {
  doc,
  serverTimestamp,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  query,
  collection,
  where,
} from "firebase/firestore";

export async function getBooking(id: string): Promise<Booking | null> {
  const docRef = doc(db, "bookings", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      offerId: data.offerId,
      numberOfKilos: data.numberOfKilos,
      price: data.price,
      currency: data.currency,
      goods: data.goods,
      bookingDetails: data.bookingDetails,
    };
  }
  return null;
}

export async function getOffer(id: string): Promise<Offer | null> {
  const docRef = doc(db, "offers", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      uid: data.uid,
      departureDate: data.departureDate,
      arrivalDate: data.arrivalDate,
      departurePoint: data.departurePoint,
      arrivalPoint: data.arrivalPoint,
    };
  }
  return null;
}

function generateOTP() {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

async function updateBooking(id: string) {
  const bookingRef = doc(db, "bookings", id);
  try {
    await updateDoc(bookingRef, {
      status: "prepaid",
      deliveryotp: generateOTP(),
    });
    return;
  } catch (e) {
    throw new Error(e.message);
  }
}

async function unlockChartroom(uid1: string, uid2: string) {
  let alreadyExist = false;
  try {
    // check if chATROOM of both users already exist
    const chatquery = query(
      collection(db, "chatrooms"),
      where("users", "array-contains", uid1)
    );
    const chatquerySnapshot: QuerySnapshot = await getDocs(chatquery);
    chatquerySnapshot.forEach((doc) => {
      if (doc.data().users.includes(uid2)) {
        alreadyExist = true;
        return;
      }
    });
    if (alreadyExist) return;

    await addDoc(collection(db, "chatrooms"), {
      users: [uid1, uid2],
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    throw new Error(e.message);
  }
  return;
}

export const updateDatabase = async (
  bid: string,
  uid1: string,
  uid2: string
) => {
  try {
    await Promise.all([updateBooking(bid), unlockChartroom(uid1, uid2)]);
  } catch (e) {
    throw new Error(e.message);
  }
};

async function debitCard(card: Card, amount: number) {
  setTimeout(() => {}, 5000);
  return {
    done: true,
    error: undefined,
  };
}

const debitPaypal = async (paypal: Paypal, amount: number) => {
  setTimeout(() => {}, 5000);
  return {
    done: true,
    error: undefined,
  };
};

const debitMobileMoney = async (phoneNumber: string, amount: number) => {
  setTimeout(() => {}, 5000);
  return {
    done: true,
    error: undefined,
  };
};

export const submitCard = async (card: Card, amount: number) => {
  const { done, error } = await debitCard(card, amount);
  console.log(amount);
  if (error !== undefined) throw new Error(error);
};

export const submitPaypal = async (paypal: Paypal, amount: number) => {
  const { done, error } = await debitPaypal(paypal, amount);
  if (error !== undefined) throw new Error(error);
};

export const submitMobileMoney = async (
  phoneNumber: string,
  amount: number
) => {
  const { done, error } = await debitMobileMoney(phoneNumber, amount);
  if (error !== undefined) throw new Error(error);
};
