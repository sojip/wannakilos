import HomeResearch from "./HomeResearch";
import Advertisement from "./Advertisement";
import Annoucements from "./Announcements";
import { Outlet } from "react-router-dom";

function Home(props) {
  let style = {
    maxWidth: "1550px",
    margin: "auto",
  };

  return (
    <div style={style}>
      <Advertisement />
      <HomeResearch />
      <Annoucements />
      <Outlet />
    </div>
  );
}

export default Home;
