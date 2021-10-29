import { NavLink } from "react-router-dom";
import "../styles/TravelerNav.css";

function TravelerNav(props) {
  const linkStyle = {
    flex: "1 1 0",
    textDecoration: "none",
    color: "black",
    transition: "all 300ms ease-in-out",
    cursor: "pointer",
    paddingBottom: "10px"
  };
  if (props.profile !== "transporter") return null;
  return (
    <div>
      <nav id="travelerNav">
        <ul className="navItems">
          <li className="navItem">
            <NavLink style={linkStyle} activeClassName="active" to="/propose-kilos">
              propose kilos
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink style={linkStyle} activeClassName="active" to="/inbox">
              inbox
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink style={linkStyle} activeClassName="active" to="/mypackages">
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
            <NavLink style={linkStyle} activeClassName="active" to="/contact-support">
              Contact support
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default TravelerNav;
