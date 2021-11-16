import { useState } from "react";
import "../styles/Announcements.css";
const Annoucements = (props) => {
  const [announceCount, setannounceCount] = useState(0);

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <div className="announcements">
        <div>Annoucement: {announceCount}</div>
        <div
          style={{
            width: "350px",
          }}
        >
          <form id="filterform">
            <label htmlFor="filters">Sort by : </label>
            <select name="filters" id="filters" form="filterform">
              <option value="distance">Distance</option>
              <option value="date">Date</option>
              <option value="price">Price</option>
            </select>
          </form>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          paddingTop: "15px",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        <div className="offers">
          <div className="homeOffer"></div>
        </div>
        <div className="videoplayer">video container</div>
      </div>
    </div>
  );
};

export default Annoucements;
