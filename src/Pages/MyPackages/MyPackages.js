import { useEffect, useState } from "react";
import "./MyPackages.css";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import useAuthContext from "../../components/auth/useAuthContext";

const MyPackages = (props) => {
  const user = useAuthContext();
  const uid = user?.id;
  const [packages, setpackages] = useState([]);

  useEffect(() => {
    const getPackages = async () => {};

    const getPrepaidUserBookings = async () => {
      const bookingsRef = collection(db, "bookings");
      let prepaidUserBookings = [];
      //Prepaid user bookings
      const q1 = query(
        bookingsRef,
        where("uid", "==", uid),
        where("status", "==", "prepaid")
      );
      const querySnapshot1 = await getDocs(q1);
      querySnapshot1.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let id = doc.id;
        prepaidUserBookings.push({ ...doc.data(), id });
      });
      return prepaidUserBookings;
    };

    const getUserOffersBookings = async () => {
      const bookingsRef = collection(db, "offers");
      let userOffersBookings = [];

      const q2 = query(
        bookingsRef,
        where("offerUserId", "==", uid),
        where("status", "==", "prepaid"),
        orderBy("timestamp", "desc")
      );
      const q3 = query(
        bookingsRef,
        where("offerUserId", "==", uid),
        where("status", "==", "prepaid"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot1 = await getDocs(q2);
      querySnapshot1.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let id = doc.id;
        userOffersBookings.push({ ...doc.data(), id });
      });
    };
  }, []);

  return <div className="container">My Packages</div>;
};

export default MyPackages;
