import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import {doc, getDoc} from "firebase/firestore";
import {User as user} from "@firebase/auth-types"

export type User =  {
  id: string;
  photo: string;
  name: string;
  isprofilesubmited: boolean;
  isprofilecompleted: boolean;
}

export const useAuthListener = () => {
  // assume user to be logged out
  const [user, setuser] = useState<User | null>(null);
  // keep track to display a spinner while auth status is being checked
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

  useEffect(() => {
    // auth listener to keep track of user signing in and out
    const auth = getAuth();
    onAuthStateChanged(auth, async (user: user) => {
      setCheckingStatus(true);
      if (user) {
        // Complete user Schema
        const userdocRef = doc(db, "users", user.uid);
        const userdocSnap = await getDoc(userdocRef);
        const userDatas = userdocSnap.data();
        setuser({
          id: user.uid,
          photo: userDatas?.photo,
          name: `${userDatas?.firstName} ${userDatas?.lastName}`,
          isprofilesubmited: userDatas?.isprofilesubmited,
          isprofilecompleted: userDatas?.isprofilecompleted,
        });
        // setisLoggedIn(true);
        setCheckingStatus(false);
        return;
      }
      setuser(null);
      // setisLoggedIn(false);
      setCheckingStatus(false);
      return;
    });
  }, []);
  return { user, checkingStatus, setuser };
};
