import { useEffect, useState } from "react";
import "./MyPackages.css";
import {
  query,
  collection,
  where,
  orderBy,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import { DateTime } from "luxon";
import useAuthContext from "../../components/auth/useAuthContext";
import ConfirmationBox from "../../components/ConfirmationBox";
import Icon from "@mdi/react";
import { mdiCashCheck } from "@mdi/js";
import { mdiPackageCheck } from "@mdi/js";

const MyPackages = (props) => {
  const user = useAuthContext();
  const [packages, setpackages] = useState([]);
  const [prepaidUserBookings, setprepaidUserBookings] = useState([]);
  const [deliveredUserBookings, setdeliveredUserBookings] = useState([]);
  const [prepaidUserOffersBookings, setprepaidUserOffersBookings] = useState(
    []
  );
  const [deliveredUserOffersBookings, setdeliveredUserOffersBookings] =
    useState([]);

  useEffect(() => {
    function getUserBookings(uid) {
      const bookingsRef = collection(db, "bookings");
      // prepaid user bookings
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

      //get real time changes of both queries
      let prepaidunsubscribe = onSnapshot(
        prepaidQuery,
        { includeMetadataChanges: true },
        (QuerySnapshot) => {
          const packages_ = [];
          QuerySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === true) return;
            packages_.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setprepaidUserBookings(packages_);
        }
      );

      let deliveredunsubscribe = onSnapshot(
        deliveredQuery,
        { includeMetadataChanges: true },
        (QuerySnapshot) => {
          const packages_ = [];
          QuerySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === true) return;
            packages_.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setdeliveredUserBookings(packages_);
        }
      );
      return [prepaidunsubscribe, deliveredunsubscribe];
    }

    function getUserOffersBookings(uid) {
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

      let prepaidunsubscribe = onSnapshot(
        prepaidQuery,
        { includeMetadataChanges: true },
        (QuerySnapshot) => {
          const packages_ = [];
          QuerySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === true) return;
            packages_.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setprepaidUserOffersBookings(packages_);
        }
      );

      let deliveredunsubscribe = onSnapshot(
        deliveredQuery,
        { includeMetadataChanges: true },
        (QuerySnapshot) => {
          const packages_ = [];
          QuerySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === true) return;
            packages_.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setdeliveredUserOffersBookings(packages_);
        }
      );
      return [prepaidunsubscribe, deliveredunsubscribe];
    }

    let [prepaiduserbookings, delivereduserbookings] = getUserBookings(user.id);
    let [prepaiduseroffersbookings, delivereduseroffersbookings] =
      getUserOffersBookings(user.id);

    return () => {
      prepaiduserbookings();
      delivereduserbookings();
      prepaiduseroffersbookings();
      delivereduseroffersbookings();
    };
  }, []);

  useEffect(() => {
    setpackages(
      [
        ...prepaidUserBookings,
        ...deliveredUserBookings,
        ...prepaidUserOffersBookings,
        ...deliveredUserOffersBookings,
      ].sort(function (x, y) {
        return y.timestamp - x.timestamp;
      })
    );
  }, [
    prepaidUserBookings,
    deliveredUserBookings,
    prepaidUserOffersBookings,
    deliveredUserOffersBookings,
  ]);

  //listener to close package option menu if the user clicks anywhere
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

  // function to manage package option click
  function handlePackageOptionClick(e) {
    let openedOption = document.querySelector(".packageOptions.show");
    let selectedPackageId = e.currentTarget.dataset.package_;
    let selectedOption = Array.from(
      document.querySelectorAll(".packageOptions")
    ).find((option) => (option.dataset.package_ = selectedPackageId));
    if (openedOption) {
      openedOption.classList.remove("show");
      let openedOptionId = openedOption.dataset.package_;
      if (selectedPackageId === openedOptionId) return;
    }
    selectedOption.classList.toggle("show");
    return;
  }
  return (
    <div className="container myPackages">
      <h2>My Packages</h2>
      {packages.length > 0 ? (
        packages.map((_package) => {
          return _package.uid === user.id ? (
            <UserPackage
              key={packages.indexOf(_package)}
              _package={_package}
              handlePackageOptionClick={handlePackageOptionClick}
              style={{ "--animationOrder": packages.indexOf(_package) }}
            />
          ) : (
            <UserOfferPackage
              key={packages.indexOf(_package)}
              _package={_package}
              handlePackageOptionClick={handlePackageOptionClick}
              style={{ "--animationOrder": packages.indexOf(_package) }}
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
  const { _package, handlePackageOptionClick, style } = props;

  return (
    <div className="package userPackage" id={_package.id} style={style}>
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
      <div className="offerInfos deliveryotp">
        delivery code - {_package.deliveryotp}
      </div>
      {_package.status === "delivered" ? (
        <div className="package-status">
          delivered <Icon path={mdiPackageCheck} size={1} />
        </div>
      ) : (
        <>
          <i
            className="fa-solid fa-ellipsis fa-lg packageOptionsIcon"
            data-package_={_package.id}
            onClick={handlePackageOptionClick}
          ></i>
          <div className="packageOptions" data-package_={_package.id}>
            <ul>
              <li>request a refund</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

const UserOfferPackage = (props) => {
  const { _package, style } = props;
  const [openDialog, setopenDialog] = useState(false);

  function updateStatusToDelivered(id) {
    const docRef = doc(db, "bookings", id);
    try {
      updateDoc(docRef, {
        status: "delivered",
      });
    } catch (e) {
      alert(e);
      throw new Error(e.message);
    }
  }

  const confirmdelivery = (id = _package.id) => {
    updateStatusToDelivered(id);
    handleUserPayment(id);
  };

  const handleAskConfirmation = (e) => {
    setopenDialog(true);
  };

  //work on handle get paid
  const handleUserPayment = () => {
    const bookingRef = doc(db, "bookings", _package.id);
    try {
      updateDoc(bookingRef, {
        paid: true,
      });
    } catch (e) {
      alert(e);
      return;
    }
  };

  return (
    <div className="package userOfferPackage" style={style}>
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
      {_package.status === "prepaid" && (
        <button
          className="confirmDelivery"
          onClick={handleAskConfirmation}
          data-pid={_package.id}
        >
          Confirm Delivery
        </button>
      )}
      {_package.paid === true ? (
        <div className="package-status">
          paid
          <Icon path={mdiCashCheck} size={1} />
        </div>
      ) : null}

      {openDialog && (
        <ConfirmationBox
          title="Confirm Package Delivery"
          description="Please enter the delivery code provided by the package owner"
          confirmKeyword={true}
          keyword={_package.deliveryotp}
          handleConfirmation={confirmdelivery}
          open={openDialog}
          setopen={setopenDialog}
        />
      )}
    </div>
  );
};
