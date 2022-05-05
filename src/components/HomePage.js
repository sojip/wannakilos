import Advertisement from "./Advertisement";
import HomeResearch from "./HomeResearch";
import Annoucements from "./Announcements";
import { useLocation } from "react-router-dom";

const HomePage = (props) => {
  let location = useLocation();
  console.log(location);
  if (props.isLoggedIn && props.isprofilecompleted) return null;
  if (
    (props.isLoggedIn &&
      !props.isprofilecompleted &&
      location.pathname === "/") ||
    !props.isLoggedIn
  ) {
    return (
      <div>
        <Advertisement />
        <HomeResearch />
        <Annoucements />
      </div>
    );
  }
  return null;
};

export default HomePage;
