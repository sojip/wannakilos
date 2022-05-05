import { NavLink } from "react-router-dom";
import "../styles/Nav.css";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../components/utils/firebase";
import { useState, useEffect } from "react";
import _ from "lodash";

function TravelerNav(props) {
  const [user, setuser] = useState({});
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const linkStyle = {
    textDecoration: "none",
    color: "#1e3a8a",
    transition: "all 300ms linear",
    cursor: "pointer",
    paddingTop: "10px",
    paddingLeft: "5px",
    paddingRight: "5px",
  };
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log(user)
      // isProfileCompleted(user).then((response) => {
      setuser(user);
      // setisLoggedIn(true);
    } else {
      // setuser({});
      setisLoggedIn(false);
    }
  });

  useEffect(() => {
    if (_.isEqual(user, {})) return;
    const docRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(docRef, (doc) => {
      console.log("Current data: ", doc.data());
      let datas = doc.data();
      if (datas.firstName !== undefined) setisLoggedIn(true);
    });
    return () => {
      //Stop listening to changes
      // const docRef = doc(db, "users", user.uid);
      // const unsub = onSnapshot(docRef, (doc) => {
      //   console.log("Current data: ", doc.data());
      //   let datas = doc.data();
      //   if (datas.firstName !== undefined) setisLoggedIn(true);
      // });
      // unsub();
    };
  }, [user]);

  if (isLoggedIn === false || props.profile !== "transporter") return null;
  return (
    <div
      style={{
        width: "100%",
        height: "10vh",
        // border: "solid 1px black",
        backgroundColor: "white",
        opacity: "0.98",
        position: "fixed",
        top: "10vh",
        zIndex: "5",
      }}
    >
      <nav id="travelerNav">
        <ul className="navItems">
          <li className="navItem">
            <NavLink
              style={linkStyle}
              activeClassName="active"
              to="/propose-kilos"
            >
              propose kilos
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink style={linkStyle} activeClassName="active" to="/inbox">
              inbox
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink
              style={linkStyle}
              activeClassName="active"
              to="/mypackages"
            >
              My packages
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink style={linkStyle} activeClassName="active" to="/mybalance">
              My balance
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink style={linkStyle} activeClassName="active" to="/myclaims">
              My claims
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink
              style={linkStyle}
              activeClassName="active"
              to="/contact-support"
            >
              Contact support
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default TravelerNav;
