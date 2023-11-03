import React from "react";
import { useAuthListener } from "./useAuthListener";
import { Auth } from "./useAuthContext";

export const AuthProvider = (props: React.PropsWithChildren) => {
  const { user, checkingStatus, setuser } = useAuthListener();
  return (
    <Auth.Provider value={{ user, checkingStatus, setuser }}>
      {props.children}
    </Auth.Provider>
  );
};
