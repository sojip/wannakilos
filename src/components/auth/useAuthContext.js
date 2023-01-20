import AuthContext from "./AuthContext";
import { useContext } from "react";
const useAuthContext = () => {
  const user = useContext(AuthContext);
  return user;
};
export default useAuthContext;
