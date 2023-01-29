import { useEffect, useState } from "react";
import "./MyPackages.css";
import {
  query,
  collection,
  where,
  orderBy,
  doc,
  getDocs,
  onSnapshot,
  QuerySnapshot,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import { DateTime } from "luxon";
import useAuthContext from "../../components/auth/useAuthContext";
import { useConfirm } from "material-ui-confirm";

const MyPackages = (props) => {
  const user = useAuthContext();
  const [packages, setpackages] = useState([]);
  const [prepaidUserBookings, setprepaidUserBookings] = useState([]);
  const [deliveredUserBookings, setdeliveredUserBookings] = useState([]);
  const [deliveryRequestedUserBookings, setdeliveryRequestedUserBookings] =
    useState([]);
  const [prepaidUserOffersBookings, setprepaidUserOffersBookings] = useState(
    []
  );
  const [deliveredUserOffersBookings, setdeliveredUserOffersBookings] =
    useState([]);
  const [
    deliveryRequestedUserOffersBookings,
    setdeliveryRequestedUserOffersBookings,
  ] = useState([]);

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

      // deliveryRequested user bookings
      const delivereyRequestedQuery = query(
        bookingsRef,
        where("uid", "==", uid),
        where("status", "==", "deliveryRequested"),
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

      let deliveryRequestedunsubscribe = onSnapshot(
        delivereyRequestedQuery,
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
          setdeliveryRequestedUserBookings(packages_);
        }
      );
      return [
        prepaidunsubscribe,
        deliveredunsubscribe,
        deliveryRequestedunsubscribe,
      ];
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

      //delivery requested bookings
      const deliveryRequestedQuery = query(
        bookingsRef,
        where("offerUserId", "==", uid),
        where("status", "==", "deliveryRequested"),
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

      let deliveryRequestedunsubscribe = onSnapshot(
        deliveryRequestedQuery,
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
          setdeliveryRequestedUserOffersBookings(packages_);
        }
      );
      return [
        prepaidunsubscribe,
        deliveredunsubscribe,
        deliveryRequestedunsubscribe,
      ];
    }

    let [
      prepaiduserbookings,
      delivereduserbookings,
      deliveryrequesteduserbookings,
    ] = getUserBookings(user.id);
    let [
      prepaiduseroffersbookings,
      delivereduseroffersbookings,
      deliveryrequesteduseroffersbookings,
    ] = getUserOffersBookings(user.id);

    return () => {
      prepaiduserbookings();
      delivereduserbookings();
      prepaiduseroffersbookings();
      delivereduseroffersbookings();
      deliveryrequesteduserbookings();
      deliveryrequesteduseroffersbookings();
    };
  }, []);

  useEffect(() => {
    setpackages(
      [
        ...prepaidUserBookings,
        ...deliveredUserBookings,
        ...deliveryRequestedUserBookings,
        ...prepaidUserOffersBookings,
        ...deliveredUserOffersBookings,
        ...deliveryRequestedUserOffersBookings,
      ].sort(function (x, y) {
        return y.timestamp - x.timestamp;
      })
    );
  }, [
    prepaidUserBookings,
    deliveredUserBookings,
    deliveryRequestedUserBookings,
    prepaidUserOffersBookings,
    deliveredUserOffersBookings,
    deliveryRequestedUserOffersBookings,
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
    // let selectedOption = document.querySelector(
    //   `.packageOptions[data-package_=${selectedPackageId}]`
    // );
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
            />
          ) : (
            <UserOfferPackage
              key={packages.indexOf(_package)}
              _package={_package}
              handlePackageOptionClick={handlePackageOptionClick}
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
  const { _package, handlePackageOptionClick } = props;
  let confirm = useConfirm();

  function handleConfirmDelivery(id) {
    let docRef = doc(db, "bookings", id);
    try {
      updateDoc(docRef, {
        status: "delivered",
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  const handleAskConfirmation = (e) => {
    const pid = _package.id;
    confirm({
      description: "This action is permanent!",
      title: "Confirm The Package Has Been Delivered ?",
    })
      .then(() => {
        /* updata package status */
        handleConfirmDelivery(pid);
      })
      .catch((e) => {
        /* ... */
        console.table("confirmation refused");
      });
  };

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
      {_package.status === "delivered" ? (
        <div className="package-status">delivered</div>
      ) : (
        <>
          <i
            className="fa-solid fa-ellipsis fa-lg packageOptionsIcon"
            data-package_={_package.id}
            onClick={handlePackageOptionClick}
          ></i>
          {_package.status === "deliveryRequested" && (
            <div className="package-status">
              Waiting for delivery confirmation
            </div>
          )}
          <div className="packageOptions" data-package_={_package.id}>
            <ul>
              <li>request a refund</li>
              {_package.status === "deliveryRequested" && (
                <li onClick={handleAskConfirmation} data-pid={_package.id}>
                  confirm delivery
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

const UserOfferPackage = (props) => {
  const { _package } = props;
  const confirm = useConfirm();

  function handleRequestDelivery(id) {
    const docRef = doc(db, "bookings", id);
    try {
      updateDoc(docRef, {
        status: "deliveryRequested",
      });
    } catch (e) {
      alert(e);
      throw new Error(e.message);
    }
  }

  const handleAskConfirmation = (e) => {
    const pid = _package.id;
    confirm({
      description: "This action is permanent!",
      title: "Confirm The Package Has Been Delivered ?",
    })
      .then(() => {
        /* updata package status */
        handleRequestDelivery(pid);
      })
      .catch((e) => {
        /* ... */
        console.table("no");
      });
  };

  //work on handle get paid
  const handleGetPaid = (e) => {
    const bookingRef = doc(db, "bookings", _package.id);
    try {
      updateDoc(bookingRef, {
        usergotpaid: true,
      });
    } catch (e) {
      alert(e);
      return;
    }
  };

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
      {_package.status === "prepaid" && (
        <button
          className="confirmDelivery"
          onClick={handleAskConfirmation}
          data-pid={_package.id}
        >
          Confirm Delivery
        </button>
      )}
      {_package.status === "deliveryRequested" && (
        <div className="package-status">Waiting for user Confirmation</div>
      )}
      {_package.status === "delivered" ? (
        _package.usergotpaid !== true ? (
          <button
            className="getPaid"
            onClick={handleGetPaid}
            data-pid={_package.id}
          >
            Get Paid
          </button>
        ) : (
          <div className="package-status">paid</div>
        )
      ) : null}
    </div>
  );
};
