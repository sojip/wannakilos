import { useEffect, useState } from "react";
import "./MyPackages.css";
import {
  query,
  collection,
  where,
  orderBy,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import { DateTime } from "luxon";
import useAuthContext from "../../components/auth/useAuthContext";

const MyPackages = (props) => {
  const user = useAuthContext();
  const [packages, setpackages] = useState([]);

  useEffect(() => {
    const getUserBookings = (uid) => {
      const bookingsRef = collection(db, "bookings");
      //Prepaid user bookings
      const prepaidQuery = query(
        bookingsRef,
        where("uid", "==", uid),
        where("status", "==", "prepaid"),
        orderBy("timestamp", "desc")
      );
      // delivered user bookings
      const deliveredQuery = query(
        bookingsRef,
        where("uid", "==", uid),
        where("status", "==", "delivered"),
        orderBy("timestamp", "desc")
      );

      const prepaidUnsubscribe = onSnapshot(prepaidQuery, (querySnapshot) => {
        let prepaidUserBookings = [];
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === false)
            prepaidUserBookings.push({
              ...doc.data(),
              id: doc.id,
              timestamp: doc.data().timestamp.valueOf(),
            });
        });
        setpackages((prevPackages) =>
          [...prevPackages, ...prepaidUserBookings].sort(function (x, y) {
            return y.timestamp - x.timestamp;
          })
        );
      });

      const deliveredUnsubscribe = onSnapshot(
        deliveredQuery,
        (querySnapshot) => {
          let deliveredUserBookings = [];
          querySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === false)
              deliveredUserBookings.push({
                ...doc.data(),
                id: doc.id,
                timestamp: doc.data().timestamp.valueOf(),
              });
          });
          setpackages((prevPackages) =>
            [...prevPackages, ...deliveredUserBookings].sort(function (x, y) {
              return y.timestamp - x.timestamp;
            })
          );
        }
      );
      return [prepaidUnsubscribe, deliveredUnsubscribe];
    };

    const getUserOffersBookings = (uid) => {
      const bookingsRef = collection(db, "bookings");
      //offers prepaid bookings
      const prepaidQuery = query(
        bookingsRef,
        where("offerUserId", "==", uid),
        where("status", "==", "prepaid"),
        orderBy("timestamp", "desc")
      );
      //offers delivered bookings
      const deliveredQuery = query(
        bookingsRef,
        where("offerUserId", "==", uid),
        where("status", "==", "delivered"),
        orderBy("timestamp", "desc")
      );
      const prepaidUnsubscribe = onSnapshot(prepaidQuery, (querySnapshot) => {
        let prepaidUserOffersBookings = [];
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === false)
            prepaidUserOffersBookings.push({
              ...doc.data(),
              id: doc.id,
              timestamp: doc.data().timestamp.valueOf(),
            });
        });
        setpackages((prevPackages) =>
          [...prevPackages, ...prepaidUserOffersBookings].sort(function (x, y) {
            return y.timestamp - x.timestamp;
          })
        );
      });

      const deliveredUnsubscribe = onSnapshot(
        deliveredQuery,
        (querySnapshot) => {
          let deliveredUserOffersBookings = [];
          querySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === false)
              deliveredUserOffersBookings.push({
                ...doc.data(),
                id: doc.id,
                timestamp: doc.data().timestamp.valueOf(),
              });
          });
          setpackages((prevPackages) =>
            [...prevPackages, ...deliveredUserOffersBookings].sort(function (
              x,
              y
            ) {
              return y.timestamp - x.timestamp;
            })
          );
        }
      );
      return [prepaidUnsubscribe, deliveredUnsubscribe];
    };
    const [prepaidBookingsUnsubscribe, deliveredBookingsUnsubscribe] =
      getUserBookings(user.id);
    const [
      prepaidOffersBookingsUnsubscribe,
      deliveredOffersBookingsUnsubscribe,
    ] = getUserOffersBookings(user.id);

    return () => {
      prepaidBookingsUnsubscribe();
      deliveredBookingsUnsubscribe();
      prepaidOffersBookingsUnsubscribe();
      deliveredOffersBookingsUnsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log(packages);
  }, [packages]);

  return (
    <div className="container myPackages">
      <h2>My Packages</h2>
      {packages.length > 0 ? (
        packages.map((_package) => {
          return _package.uid === user.id ? (
            <UserPackage key={packages.indexOf(_package)} _package={_package} />
          ) : (
            <UserOfferPackage
              key={packages.indexOf(_package)}
              _package={_package}
            />
          );
        })
      ) : (
        <div className="infos">No Packages Yet ...</div>
      )}
    </div>
  );
};

export default MyPackages;

const UserPackage = (props) => {
  const { _package } = props;
  return (
    <div className="package userPackage">
      <div className="offerInfos">
        <div>{_package.departurePoint} </div>
        <i className="fa-solid fa-right-long"></i>
        <div>{_package.arrivalPoint}</div>
      </div>
      <div className="offerInfos dates">
        <div>
          <i className="fa-solid fa-plane-departure"></i>
          {DateTime.fromISO(_package.departureDate).toLocaleString(
            DateTime.DATE_MED
          )}
        </div>
        <div>
          {DateTime.fromISO(_package.arrivalDate).toLocaleString(
            DateTime.DATE_MED
          )}
          <i className="fa-solid fa-plane-arrival"></i>
        </div>
      </div>
      <div className="offerInfos">{_package.bookingDetails}</div>
      <div className="offerInfos">{_package.numberOfKilos} Kg</div>
      <div className="offerInfos prepaid">
        Prepaid {Number(_package.numberOfKilos) * Number(_package.price)}{" "}
        {_package.currency}
      </div>
    </div>
  );
};

const UserOfferPackage = (props) => {
  const { _package } = props;
  return (
    <div className="package userOfferPackage">
      <div className="offerInfos">
        <div>{_package.departurePoint} </div>
        <i className="fa-solid fa-right-long"></i>
        <div>{_package.arrivalPoint}</div>
      </div>
      <div className="offerInfos dates">
        <div>
          <i className="fa-solid fa-plane-departure"></i>
          {DateTime.fromISO(_package.departureDate).toLocaleString(
            DateTime.DATE_MED
          )}
        </div>
        <div>
          {DateTime.fromISO(_package.arrivalDate).toLocaleString(
            DateTime.DATE_MED
          )}
          <i className="fa-solid fa-plane-arrival"></i>
        </div>
      </div>
      <div className="offerInfos">{_package.bookingDetails}</div>
      <div className="offerInfos">{_package.numberOfKilos} Kg</div>
      <div className="offerInfos prepaid">
        Prepaid {Number(_package.numberOfKilos) * Number(_package.price)}{" "}
        {_package.currency}
      </div>
      <button id="confirmDelivery">Confirm Delivery</button>
    </div>
  );
};
