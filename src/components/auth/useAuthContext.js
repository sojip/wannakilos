import AuthContext from "./AuthContext";
import { useContext } from "react";
const useAuthContext = () => {
  const user = useContext(AuthContext);
  console.log(user);
  return user;
};
export default useAuthContext;
