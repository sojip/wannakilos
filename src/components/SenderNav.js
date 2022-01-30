import { NavLink } from "react-router-dom";
import "../styles/TravelerNav.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../components/utils/firebase";
import { useState } from "react";

function SenderNav(props) {
  const [isLoggedIn, setisLoggedIn] = useState(false);

  const linkStyle = {
    textDecoration: "none",
    color: "#00008B",
    transition: "all 300ms ease-in-out",
    cursor: "pointer",
    paddingTop: "10px",
    paddingLeft: "5px",
    paddingRight: "5px",
  };
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setisLoggedIn(true);
    } else {
      setisLoggedIn(false);
    }
  });
  if (isLoggedIn === false || props.profile !== "sender") return null;
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
        zIndex: "2",
      }}
    >
      <nav id="senderNav">
        <ul className="navItems">
          <li className="navItem">
            <NavLink
              style={linkStyle}
              activeClassName="active"
              to="/send-package"
            >
              send a package
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
              to="/mybookings"
            >
              My bookings
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

export default SenderNav;
