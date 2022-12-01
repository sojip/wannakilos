import { useAuthListener } from "./Auth";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const { user, checkingStatus, setuser } = useAuthListener();
  return (
    <AuthContext.Provider
      value={checkingStatus ? undefined : { ...user, setuser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
