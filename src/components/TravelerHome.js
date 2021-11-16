import "../styles/TravelerHome.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../components/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

const TravelerHome = (props) => {
  const [userid, setuserid] = useState("");
  const [offers, setoffers] = useState([]);

  useEffect(() => {
    const offers_ = [];
    const q = query(collection(db, "offers"), where("uid", "==", userid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // console.log(doc.data());
        offers_.push(doc.data());
        // cities.push(doc.data().name);
      });
    });
    // setoffers([...offers_]);
    console.log(offers_);
  }, [offers]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setuserid(uid);
    }
  });

  const linkStyle = {
    textDecoration: "none",
    color: "black",
    display: "block",
    width: "130px",
    height: "120px",
    backgroundColor: "transparent",
    textAlign: "center",
    paddingTop: "10px",
    borderRadius: "5px",
    boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "center",
  };
  if (props.profile !== "transporter") return null;

  return (
    <div className="container TravelerHomeContainer">
      <div className="travelerHome">
        <Link to="/propose-kilos" style={linkStyle}>
          <img src="https://img.icons8.com/ios/100/000000/plus-math.png" />
          <div style={{ marginTop: "10px" }}>Create Offer</div>
        </Link>
        <div className="userOffers">
          <div className="userOffer"></div>
        </div>
      </div>
    </div>
  );
};

export default TravelerHome;
