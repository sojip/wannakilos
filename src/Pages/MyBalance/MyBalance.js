import "./MyBalance.css";
import { useEffect, useState } from "react";
import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import useAuthContext from "../../components/auth/useAuthContext";

export default function MyBalance() {
  const [transportedPackages, settransportedPackages] = useState([]);
  const [sentPackages, setsentPackages] = useState([]);
  let user = useAuthContext();

  useEffect(() => {
    const transportedQuery = query(
      collection(db, "bookings"),
      where("offerUserId", "==", user.id),
      where("usergotpaid", "==", true),
      orderBy("timestamp", "desc")
    );

    const sentQuery = query(
      collection(db, "bookings"),
      where("uid", "==", user.id),
      where("status", "not-in", ["pending", "accepted"]),
      orderBy("status"),
      orderBy("timestamp", "desc")
    );
    const transportedunsubscribe = onSnapshot(
      transportedQuery,
      { includeMetadataChanges: true },
      (QuerySnapshot) => {
        const packages = [];
        QuerySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === true) return;
          packages.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        settransportedPackages(packages);
      },
      (error) => {
        alert(error.message);
      }
    );

    const sentunsubscribe = onSnapshot(
      sentQuery,
      { includeMetadataChanges: true },
      (QuerySnapshot) => {
        const packages = [];
        QuerySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === true) return;
          packages.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setsentPackages(packages);
      },
      (error) => {
        alert(error.message);
      }
    );

    return () => {
      transportedunsubscribe();
      sentunsubscribe();
    };
  }, []);
  return (
    <div className="container">
      <h2>Incomes</h2>
      {transportedPackages.length > 0 ? (
        <>
          <div>Total : {}</div>
          {transportedPackages.map((package_) => {
            return (
              <div key={package_.id}>
                <div>{package_.uid}</div>
                <div>{package_.goods}</div>
                <div>{package_.numberOfKilos}</div>
                <div>
                  {package_.price * Number(package_.numberOfKilos)}
                  {package_.currency}
                </div>
                <div>Withdraw</div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="nodatasinfos">No Transaction Completed Yet</div>
      )}
    </div>
  );
}
