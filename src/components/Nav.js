import { NavLink } from "react-router-dom";
import "../styles/Nav.css";
import { useEffect } from "react";

function Nav(props) {
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
  }, []);

  return (
    <nav>
      <ul className="navItems">
        <li className="navItem">
          <NavLink
            style={linkStyle}
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="/send-package"
          >
            send a package
          </NavLink>
        </li>

        <li className="navItem">
          <NavLink
            style={linkStyle}
            // activeClassName="active"
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="/propose-kilos"
          >
            propose kilos
          </NavLink>
        </li>
        <li className="navItem">
          <NavLink
            style={linkStyle}
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="/inbox"
          >
            inbox
          </NavLink>
        </li>
        <li className="navItem">
          <NavLink
            style={linkStyle}
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="/mykilos"
          >
            My kilos
          </NavLink>
        </li>
        <li className="navItem">
          <NavLink
            style={linkStyle}
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="/mypackages"
          >
            My packages
          </NavLink>
        </li>
        <li className="navItem">
          <NavLink
            style={linkStyle}
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="/mybalance"
          >
            My balance
          </NavLink>
        </li>
        <li className="navItem">
          <NavLink
            style={linkStyle}
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="/myclaims"
          >
            My claims
          </NavLink>
        </li>
        <li className="navItem">
          <NavLink
            style={linkStyle}
            className={({ isActive }) => (isActive ? "active" : undefined)}
            to="/contact-support"
          >
            Contact support
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
