import React, { createContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useContext } from "react";

interface User {
  id: string;
  photo: string;
  isLoggedIn: boolean;
  name: string;
  isprofilesubmited: boolean;
  isprofilecompleted: boolean;
}

export interface AuthContextType {
  user: User;
  checkingStatus: boolean;
  setuser: React.Dispatch<React.SetStateAction<User>>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const useAuthContext = () => {
  const auth = useContext(AuthContext);
  return auth;
};

export const useAuthListener = () => {
  // assume user to be logged out
  const [user, setuser] = useState<User>({} as User);

  // keep track to display a spinner while auth status is being checked
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

  useEffect(() => {
    // auth listener to keep track of user signing in and out
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Complete user Schema
        const userdocRef = doc(db, "users", user.uid);
        const userdocSnap = await getDoc(userdocRef);
        const userDatas = userdocSnap.data();
        setuser({
          id: user.uid,
          photo: userDatas?.photo,
          name: `${userDatas?.firstName} ${userDatas?.lastName}`,
          isLoggedIn: true,
          isprofilecompleted: userDatas?.isprofilecompleted,
          isprofilesubmited: userDatas?.isprofilesubmited,
        });
        setCheckingStatus(false);
        return;
      }
      setuser({} as User);
      setCheckingStatus(false);
      return;
    });
  }, []);

  return { user, checkingStatus, setuser };
};
