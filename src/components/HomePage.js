import Advertisement from "./Advertisement";
import HomeResearch from "./HomeResearch";

const HomePage = (props) => {
  if (props.isLoggedIn) return null;
  return (
    <div>
      <Advertisement />
      <HomeResearch />
    </div>
  );
};

export default HomePage;
