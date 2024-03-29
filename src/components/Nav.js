import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/Nav.css";
import { Tabs, Tab } from "@mui/material";
import styled from "styled-components";

const Navigation = styled.nav`
  width: 100%;
  height: 10vh;
  position: fixed;
  top: 10vh;
  left: 0;
  right: 0;
  background-color: white;
  opacity: 0.98;
  z-index: 3;
`;

function Nav() {
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

  return (
    <Navigation>
      <Tabs
        id="tabs"
        value={navLinks.includes(location.pathname) ? location.pathname : false}
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
    </Navigation>
  );
}

export default Nav;
