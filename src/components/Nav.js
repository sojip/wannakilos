import { NavLink, useLocation } from "react-router-dom";
import "../styles/Nav.css";
import { useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";

function Nav(props) {
  const [value, setvalue] = useState(0);
  const location = useLocation();

  const navLinks = [
    "/send-package",
    "/propose-kilos",
    "/inbox",
    "/mykilos",
    "/mypackages",
    "/mybalance",
    "/myclaims",
    "/contact-support",
  ];

  const handleChange = (event, newValue) => {
    console.log(newValue);
    setvalue(newValue);
  };

  // const linkStyle = {
  //   textDecoration: "none",
  //   color: "#00008B",
  //   transition: "all 100ms linear",
  //   cursor: "pointer",
  //   paddingTop: "10px",
  //   paddingLeft: "5px",
  //   paddingRight: "5px",
  //   paddingBottom: "10px",
  // };

  return (
    <nav>
      <Tabs
        id="tabs"
        value={navLinks.includes(location.pathname) ? location.pathname : false}
        onChange={handleChange}
        variant="scrollable"
      >
        <Tab
          label="send a package"
          value={"/send-package"}
          component={NavLink}
          to="/send-package"
        />
        <Tab
          label="propose kilos"
          value={"/propose-kilos"}
          component={NavLink}
          to="/propose-kilos"
        />
        <Tab label="inbox" value={"/inbox"} component={NavLink} to="/inbox" />
        <Tab
          label="my kilos"
          value={"/mykilos"}
          component={NavLink}
          to="/mykilos"
        />
        <Tab
          label="my packages"
          value={"/mypackages"}
          component={NavLink}
          to="/mypackages"
        />
        <Tab
          label="my balance"
          value={"/mybalance"}
          component={NavLink}
          to="/mybalance"
        />
        <Tab
          label="my claims"
          value={"/myclaims"}
          component={NavLink}
          to="/myclaims"
        />
        <Tab
          label="contact support"
          value={"/contact-support"}
          component={NavLink}
          to="/contact-support"
        />
      </Tabs>

      {/* <ul className="navItems">
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
      </ul> */}
    </nav>
  );
}

export default Nav;
