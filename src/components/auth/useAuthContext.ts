import React, { useContext, createContext, SetStateAction } from "react";
import { User } from "./useAuthListener";

interface AuthContext {
  user: User | null;
  // isLoggedIn: boolean;
  checkingStatus: boolean;
  setuser: React.Dispatch<SetStateAction<User>>;
}

export const Auth = createContext<AuthContext>({} as AuthContext);

export const useAuthContext = () => {
  const auth = useContext(Auth);
  return auth;
};
