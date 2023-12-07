import React from "react";
import { useEffect, useState } from "react";
import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import { useAuthContext } from "components/auth/useAuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Timestamp,
  QuerySnapshot,
  FirestoreError,
} from "@firebase/firestore-types";
import { Content } from "components/DashboardContent";
import { Transaction } from "./Transaction";

export type Package = {
  id: string;
  departurePoint: string;
  arrivalPoint: string;
  departureDate: string;
  arrivalDate: string;
  numberOfKilos: number;
  price: number;
  currency: string;
  goods: string[];
  timestamp: Timestamp;
  status: string;
  bookingDetails: string;
  paid?: boolean;
  retrieved?: boolean;
};

export const MyBalance: React.FC = (): JSX.Element => {
  let { user } = useAuthContext();
  const [transportedPackages, settransportedPackages] = useState<Package[]>([]);
  const [sentPackages, setsentPackages] = useState<Package[]>([]);
  const [expanded, setexpanded] = useState<string | false>(false);

  useEffect(() => {
    const transportedQuery = query(
      collection(db, "bookings"),
      where("offerUserId", "==", user?.id),
      where("paid", "==", true),
      orderBy("timestamp", "desc")
    );

    const sentQuery = query(
      collection(db, "bookings"),
      where("uid", "==", user?.id),
      where("status", "not-in", ["pending", "accepted"]),
      orderBy("status"),
      orderBy("timestamp", "desc")
    );
    const transportedunsubscribe = onSnapshot(
      transportedQuery,
      { includeMetadataChanges: true },
      (QuerySnapshot: QuerySnapshot) => {
        const packages: Package[] = [];
        QuerySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === true) return;
          const data = doc.data();
          packages.push({
            id: doc.id,
            departurePoint: data.departurePoint,
            departureDate: data.departureDate,
            arrivalPoint: data.arrivalPoint,
            arrivalDate: data.arrivalDate,
            numberOfKilos: data.numberOfKilos,
            price: data.price,
            currency: data.currency,
            goods: data.goods,
            status: data.status,
            bookingDetails: data.bookingDetails,
            paid: data.paid,
            retrieved: data.retrieved,
            timestamp: data.timestamp,
          });
        });
        settransportedPackages(packages);
      },
      (error: FirestoreError) => {
        console.log(error.message);
      }
    );

    const sentunsubscribe = onSnapshot(
      sentQuery,
      { includeMetadataChanges: true },
      (QuerySnapshot: QuerySnapshot) => {
        const packages: Package[] = [];
        QuerySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === true) return;
          const data = doc.data();
          packages.push({
            id: doc.id,
            departurePoint: data.departurePoint,
            departureDate: data.departureDate,
            arrivalPoint: data.arrivalPoint,
            arrivalDate: data.arrivalDate,
            numberOfKilos: data.numberOfKilos,
            price: data.price,
            currency: data.currency,
            goods: data.goods,
            status: data.status,
            bookingDetails: data.bookingDetails,
            paid: data.paid,
            timestamp: data.timestamp,
          });
        });
        setsentPackages(packages);
      },
      (error: FirestoreError) => {
        alert(error.message);
      }
    );

    return () => {
      transportedunsubscribe();
      sentunsubscribe();
    };
  }, []);

  return (
    <Content>
      <ToastContainer />
      <h2>Incomes</h2>
      {transportedPackages.length > 0 ? (
        <>
          <h3>
            Total{" "}
            {transportedPackages.reduce((total, package_) => {
              return (
                total + Number(package_.numberOfKilos) * Number(package_.price)
              );
            }, 0)}
            {" F (Fcfa)"}
          </h3>
          {transportedPackages.map((package_) => {
            return (
              <Transaction
                key={package_.id}
                package_={package_}
                expanded={expanded === package_.id}
                setexpanded={setexpanded}
                $animationOrder={transportedPackages.indexOf(package_)}
              />
            );
          })}
        </>
      ) : (
        <div className="nodatasinfos">No Transaction Completed Yet</div>
      )}
    </Content>
  );
};
