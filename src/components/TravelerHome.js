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
    function getoffers() {
      // let offers_ = [];
      const q = query(
        collection(db, "offers"),
        where("uid", "==", userid),
        orderBy("timestamp", "desc")
      );
      //listen to real time changes
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let offers_ = [];
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === false)
            offers_.push({ ...doc.data(), id: doc.id });
        });
        setoffers(offers_);
      });

      // const querySnapshot = await getDocs(q);
      // querySnapshot.forEach((doc) => {
      //   offers_.push({ ...doc.data(), id: doc.id });
      // });
      // setoffers(offers_);
      // return offers_;
    }

    if (userid !== "") {
      getoffers();
      // getoffers()
      //   .then((response) => {
      //     console.log(response);
      //     setoffers([...response]);
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
    }
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
    backgroundColor: "white",
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
          <img src="https://img.icons8.com/external-flatart-icons-solid-flatarticons/50/ffffff/external-right-arrow-arrow-flatart-icons-solid-flatarticons-2.png" />
          <div className="offerArrival">{offer.arrivalPoint}</div>
        </div>
        <div className="offerNumOfkilos">
          <div>Number of Kilos</div>
          <div>{offer.numberOfKilos}</div>
        </div>
        <div className="offerPrice">
          <div>Price/Kg</div>
          <div>
            {offer.price} {offer.currency}
          </div>
        </div>
        <div className="offerGoods">
          <div className="goodsTitle">Goods accepted</div>
          <ul style={{ listStyleType: "square" }}>
            {offer.goods.map((good) => (
              <li key={offer.goods.indexOf(good)}>{good}</li>
            ))}
          </ul>
        </div>
        <div className="dates">
          <div> Departure date</div>
          <div>{offer.departureDate}</div>
          <div> Arrival date</div>
          <div>{offer.arrivalDate}</div>
        </div>
        <div className="actions">
          <Link to={`/edit-${offer.id}`} id="editOffer">
            Edit
          </Link>
          <div id="deleteOffer" onClick={handleDelete}>
            Delete
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Link to={`/show-bookings-${offer.id}`} id="bookings">
              Bookings
            </Link>
            {offer.bookings.length > 0 && (
              <div
                id="bookingsCounter"
                style={{
                  position: "relative",
                  bottom: "7px",
                  backgroundColor: "white",
                  textAlign: "center",
                  padding: "5px",
                  borderRadius: "50%",
                  // padding: "1px 5px",
                  fontSize: "15px",
                }}
              >
                {offer.bookings.length}
              </div>
            )}
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
