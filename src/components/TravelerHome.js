import "../styles/TravelerHome.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../components/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouteMatch } from "react-router-dom";

const TravelerHome = (props) => {
  const [userid, setuserid] = useState("");
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [offers, setoffers] = useState([]);

  useEffect(() => {
    async function getoffers() {
      const offers_ = [];
      const q = query(
        collection(db, "offers"),
        where("uid", "==", userid),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        offers_.push({ ...doc.data(), id: doc.id });
      });
      return offers_;
    }
    if (userid !== "") {
      getoffers()
        .then((response) => {
          console.log(response);
          setoffers([...response]);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    // const scrollContainer = document.querySelector(".userOffers");
    // scrollContainer.addEventListener("wheel", scrollHorizontally);
    return () => {
      setisLoggedIn(false);
      // const scrollContainer = document.querySelector(".userOffers");
      // scrollContainer.removeEventListener("wheel", scrollHorizontally);
    };
  }, [userid]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setuserid(uid);
      setisLoggedIn(true);
    } else {
      setisLoggedIn(false);
    }
  });
  // function handleEdit() {}

  function handleDelete() {}
  function showBookings() {}

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
    margin: "0 2vw",
  };

  let domoffers = offers.map((offer) => {
    return (
      <div
        className="userOffer"
        data-oid={offer.id}
        key={offers.indexOf(offer)}
      >
        <div className="road">
          <div className="offerDepature">{offer.departurePoint}</div>
          {/* <img
            src="https://img.icons8.com/metro/26/000000/long-arrow-right.png"
            alt="arrow"
          /> */}
          <img
            src="https://img.icons8.com/external-flatart-icons-solid-flatarticons/50/ffffff/external-right-arrow-arrow-flatart-icons-solid-flatarticons-10.png"
            alt="arrow"
          />
          <div className="offerArrival">{offer.arrivalPoint}</div>
        </div>
        <div className="offerNumOfkilos">
          Nomber of Kilos: {offer.numberOfKilos}
        </div>
        <div className="offerPrice">
          Price/Kg: {offer.price} {offer.currency}
        </div>
        <div className="offerGoods">
          <div className="goodsTitle">Goods accepted:</div>
          <ul>
            {offer.goods.map((good) => (
              <li key={offer.goods.indexOf(good)}>{good}</li>
            ))}
          </ul>
        </div>
        <div className="dates">
          <div> Departure date: {offer.departureDate}</div>
          <div> Arrival date: {offer.arrivalDate}</div>
        </div>
        <div className="actions">
          <Link to={`/edit-${offer.id}`} id="editOffer">
            Edit
          </Link>
          <div id="deleteOffer" onClick={handleDelete}>
            Delete
          </div>
          <div style={{ display: "flex" }}>
            <div id="bookings" onClick={showBookings}>
              Bookings
            </div>
            <div
              id="bookingsCounter"
              style={{
                position: "relative",
                bottom: "5px",
                border: "solid 1px #0cbaba",
                backgroundColor: "#0cbaba",
                borderRadius: "50%",
                padding: "1px 5px",
                fontSize: "12px",
              }}
            >
              4
            </div>
          </div>
        </div>
      </div>
    );
  });
  let match = useRouteMatch();

  if (isLoggedIn === false || props.profile !== "transporter") return null;

  return (
    <div className="container TravelerHomeContainer">
      <div className="travelerHome">
        <Link to="/propose-kilos" style={linkStyle}>
          <img
            src="https://img.icons8.com/ios/100/000000/plus-math.png"
            alt="addOffer"
          />
          <div style={{ marginTop: "10px" }}>Create Offer</div>
        </Link>
        <div className="userOffers">{domoffers}</div>
      </div>

      {/* <Switch>
        
      </Switch> */}
    </div>
  );
};

export default TravelerHome;
