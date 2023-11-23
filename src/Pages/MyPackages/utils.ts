import { db } from "../../components/utils/firebase";
import {
  query,
  collection,
  where,
  orderBy,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { QuerySnapshot } from "@firebase/firestore-types";
import { Package } from "./type";
import { FirestoreError } from "@firebase/firestore";

export function getSentPackages(
  uid: string,
  setPackages: React.Dispatch<React.SetStateAction<Package[]>>,
  setIsLoading: React.Dispatch<
    React.SetStateAction<{
      sent: boolean;
      transported: boolean;
    }>
  >
) {
  const bookingsRef = collection(db, "bookings");
  //user bookings
  const bookingsQuery = query(
    bookingsRef,
    where("uid", "==", uid),
    where("status", "in", ["prepaid", "delivered"]),
    orderBy("timestamp", "desc")
  );
  //get real time changes of both queries
  let unsubscribe = onSnapshot(
    bookingsQuery,
    { includeMetadataChanges: true },
    (QuerySnapshot: QuerySnapshot) => {
      const packages: Package[] = [];
      QuerySnapshot.forEach((doc) => {
        if (doc.metadata.hasPendingWrites === true) return;
        const data = doc.data();
        packages.push({
          id: doc.id,
          type: "sent",
          uid: data.uid,
          departurePoint: data.departurePoint,
          arrivalPoint: data.arrivalPoint,
          departureDate: data.departureDate,
          arrivalDate: data.arrivalDate,
          bookingDetails: data.bookingDetails,
          numberOfKilos: data.numberOfKilos,
          price: data.price,
          currency: data.currency,
          status: data.status,
          timestamp: data.timestamp,
          deliveryOtp: data.deliveryotp,
          paid: data.paid,
        });
      });
      setPackages(packages);
      setIsLoading((prev) => {
        return { ...prev, sent: false };
      });
    },
    (e: FirestoreError) => {
      alert(e);
    }
  );
  return unsubscribe;
}

export function getTransportedPackages(
  uid: string,
  setPackages: React.Dispatch<React.SetStateAction<Package[]>>,
  setIsLoading: React.Dispatch<
    React.SetStateAction<{
      sent: boolean;
      transported: boolean;
    }>
  >
) {
  const bookingsRef = collection(db, "bookings");
  //user offers bookings
  const bookingsQuery = query(
    bookingsRef,
    where("offerUserId", "==", uid),
    where("status", "in", ["prepaid", "delivered"]),
    orderBy("timestamp", "desc")
  );
  //listen to real time changes
  let unsubscribe = onSnapshot(
    bookingsQuery,
    { includeMetadataChanges: true },
    (QuerySnapshot: QuerySnapshot) => {
      const packages: Package[] = [];
      QuerySnapshot.forEach((doc) => {
        if (doc.metadata.hasPendingWrites === true) return;
        const data = doc.data();
        packages.push({
          id: doc.id,
          type: "transported",
          uid: data.uid,
          departurePoint: data.departurePoint,
          arrivalPoint: data.arrivalPoint,
          departureDate: data.departureDate,
          arrivalDate: data.arrivalDate,
          bookingDetails: data.bookingDetails,
          numberOfKilos: data.numberOfKilos,
          price: data.price,
          currency: data.currency,
          status: data.status,
          timestamp: data.timestamp,
          deliveryOtp: data.deliveryotp,
          paid: data.paid,
        });
      });
      setPackages(packages);
      setIsLoading((prev) => {
        return { ...prev, transported: false };
      });
    },
    (e: FirestoreError) => {
      alert(e);
    }
  );
  return unsubscribe;
}

export async function handleRefundRequest(pid: string, reason: string) {
  if (reason === "") throw new Error("Please specify a reason");
  console.log(pid, reason);
  return;
}

export async function confirmDelivery(pid: string) {
  try {
    await updateStatusToDelivered(pid);
    await handleUserPayment(pid);
    return;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

const handleUserPayment = async (pid: string) => {
  const bookingRef = doc(db, "bookings", pid);
  try {
    await updateDoc(bookingRef, {
      paid: true,
    });
    return;
  } catch (e) {
    throw new Error("Payment Not Done");
  }
};

async function updateStatusToDelivered(pid: string) {
  const docRef = doc(db, "bookings", pid);
  try {
    await updateDoc(docRef, {
      status: "delivered",
    });
    return;
  } catch (e) {
    throw new Error("Can Not Confirm Delivery");
  }
}
