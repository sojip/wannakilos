import React from "react";
import { useAuthListener } from "./Auth";
import { AuthContext } from "./Auth";

export const AuthProvider = (props: React.PropsWithChildren) => {
  const { user, checkingStatus, setuser } = useAuthListener();
  return (
    <AuthContext.Provider value={{ user, checkingStatus, setuser }}>
      {props.children}
    </AuthContext.Provider>
  );
};
