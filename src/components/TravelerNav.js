import { NavLink } from "react-router-dom";
import "../styles/TravelerNav.css";

function TravelerNav(props) {
  const linkStyle = {
    flex: "1 1 0",
    textDecoration: "none",
    color: "#00008B",
    transition: "all 300ms ease-in-out",
    cursor: "pointer",
    paddingTop: "10px",
    paddingLeft: "5px",
    paddingRight: "5px",
  };
  if (props.profile !== "transporter") return null;
  return (
    <div
      style={{
        width: "100%",
        height: "10vh",
        // border: "solid 1px black",
        backgroundColor: "white",
        position: "fixed",
        top: "10vh",
        zIndex: "2",
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
