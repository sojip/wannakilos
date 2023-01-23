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
import Icon from "@mdi/react";
import { mdiDotsHorizontal } from "@mdi/js";

const MyPackages = (props) => {
  const user = useAuthContext();
  const [packages, setpackages] = useState([]);

  useEffect(() => {
    const getUserBookings = async (uid) => {
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

      let prepaidUserBookings = [];
      let deliveredUserBookings = [];
      const [prepaidQuerySnapshot, deliveredQuerySnapshot] = await Promise.all([
        getDocs(prepaidQuery),
        getDocs(deliveredQuery),
      ]);
      prepaidQuerySnapshot.forEach((doc) => {
        prepaidUserBookings.push({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp.valueOf(),
        });
      });

      deliveredQuerySnapshot.forEach((doc) => {
        deliveredUserBookings.push({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp.valueOf(),
        });
      });

      return [...prepaidUserBookings, ...deliveredUserBookings];
    };

    const getUserOffersBookings = async (uid) => {
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

      let prepaidUserOffersBookings = [];
      let deliveredUserOffersBookings = [];
      const [prepaidQuerySnapshot, deliveredQuerySnapshot] = await Promise.all([
        getDocs(prepaidQuery),
        getDocs(deliveredQuery),
      ]);
      prepaidQuerySnapshot.forEach((doc) => {
        prepaidUserOffersBookings.push({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp.valueOf(),
        });
      });

      deliveredQuerySnapshot.forEach((doc) => {
        deliveredUserOffersBookings.push({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp.valueOf(),
        });
      });
      return [...prepaidUserOffersBookings, ...deliveredUserOffersBookings];
    };

    Promise.all([
      getUserBookings(user.id),
      getUserOffersBookings(user.id),
    ]).then((result) =>
      setpackages(
        [...result[0], ...result[1]].sort(function (x, y) {
          return y.timestamp - x.timestamp;
        })
      )
    );

    return () => {};
  }, []);

  useEffect(() => {
    function closePackageOptions(e) {
      let openedOption = document.querySelector(".packageOptions.show");
      if (openedOption && !e.target.classList.contains("packageOptionsIcon")) {
        openedOption.classList.remove("show");
      }
      return;
    }
    document.addEventListener("click", closePackageOptions);
    return () => {
      document.removeEventListener("click", closePackageOptions);
    };
  }, []);

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
        <div className="infos" style={{ fontStyle: "italic" }}>
          No Packages Yet ...
        </div>
      )}
    </div>
  );
};

export default MyPackages;

const UserPackage = (props) => {
  const { _package } = props;
  //define a state to show the options
  // const [showOptions, set]

  function handlePackageOptionClick(e) {
    let openedOption = document.querySelector(".packageOptions.show");
    let selectedPackageId = e.currentTarget.dataset.package_;
    let packageOptions = document.querySelectorAll(".packageOptions");
    if (openedOption) {
      openedOption.classList.remove("show");
      if (selectedPackageId === openedOption.dataset.package_) return;
    }
    let option = Array.from(packageOptions).find(
      (option) => option.dataset.package_ === selectedPackageId
    );
    option.classList.toggle("show");
  }

  return (
    <div className="package userPackage" id={_package.id}>
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
      <Icon
        path={mdiDotsHorizontal}
        size={1}
        className="packageOptionsIcon"
        onClick={handlePackageOptionClick}
        data-package_={_package.id}
      />
      <div className="packageOptions" data-package_={_package.id}>
        <ul>
          <li>Request A Refund</li>
        </ul>
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
