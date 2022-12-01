import { useAuthListener } from "./Auth";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const { user, checkingStatus } = useAuthListener();
  return (
    <AuthContext.Provider value={checkingStatus ? undefined : user}>
      {children}
    </AuthContext.Provider>
  );
};
