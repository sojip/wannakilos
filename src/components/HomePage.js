import Advertisement from "./Advertisement";
import HomeResearch from "./HomeResearch";
import Annoucements from "./Announcements";

const HomePage = (props) => {
  if (props.isLoggedIn) return null;
  return (
    <div>
      <Advertisement />
      <HomeResearch />
      <Annoucements />
    </div>
  );
};

export default HomePage;
