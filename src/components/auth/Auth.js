import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export const useAuthListener = () => {
  // assume user to be logged out
  const [user, setuser] = useState({
    id: null,
    isLoggedIn: false,
    isprofilecompleted: false,
    isprofilesubmited: false,
  });

  // keep track to display a spinner while auth status is being checked
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    // auth listener to keep track of user signing in and out
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // check if the profile is completed
        const userdocRef = doc(db, "users", user.uid);
        getDoc(userdocRef).then((userdocSnap) => {
          let userDatas = userdocSnap.data();
          setuser({
            id: user.uid,
            isLoggedIn: true,
            isprofilecompleted: userDatas.isprofilecompleted,
            isprofilesubmited: userDatas.isprofilesubmited,
          });
          setCheckingStatus(false);
        });
        return;
      }
      setuser({
        id: null,
        isLoggedIn: false,
        isprofilecompleted: false,
        isprofilesubmited: false,
      });
      setCheckingStatus(false);
      return;
    });
  }, []);

  return { user, checkingStatus };
};
