import { Header } from "../../components/Header";
import HomeResearch from "./HomeResearch";
import Advertisement from "./Advertisement";
import Annoucements from "./Announcements";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <>
      {/* <Header /> */}
      <Advertisement />
      <HomeResearch />
      <Annoucements />
      <Outlet />
    </>
  );
}

export default Home;
