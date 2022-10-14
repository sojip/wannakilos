import { NavLink } from "react-router-dom";
import "../styles/Nav.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../components/utils/firebase";
import { useState, useEffect } from "react";
import { act } from "@testing-library/react";

function Nav(props) {
  const { isLoggedIn, isprofilecompleted } = props;
  console.log("isloggedin:" + isLoggedIn);
  console.log("isprofilecompleted:" + isprofilecompleted);

  const linkStyle = {
    textDecoration: "none",
    color: "#00008B",
    transition: "all 100ms linear",
    cursor: "pointer",
    paddingTop: "10px",
    paddingLeft: "5px",
    paddingRight: "5px",
    paddingBottom: "10px",
  };

  function scrollTo(el) {
    let parent = document.querySelector(".navItems");
    const elLeft = el.offsetLeft + el.offsetWidth;
    const elParentLeft = parent.offsetLeft + parent.offsetWidth;

    // check if element not in view
    if (elLeft >= elParentLeft + parent.scrollLeft) {
      console.log("here");
      parent.scrollLeft = elLeft - elParentLeft;
    } else if (elLeft <= parent.offsetLeft + parent.scrollLeft) {
      parent.scrollLeft = el.offsetLeft - parent.offsetLeft;
    }
  }

  useEffect(() => {
    let element = document.querySelector(".active");
    if (element) {
      console.log(element.offsetParent);
      console.log(element);
    }
  });

  return (
    <div
      style={{
        width: "100%",
        height: "10vh",
        backgroundColor: "white",
        opacity: "0.98",
        position: "fixed",
        top: "10vh",
        zIndex: "5",
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
            <NavLink style={linkStyle} activeClassName="active" to="/mykilos">
              My kilos
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

export default Nav;
