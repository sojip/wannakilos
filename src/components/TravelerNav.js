import { Link } from "react-router-dom";
import "../styles/TravelerNav.css";

function TravelerNav(props) {
  const linkStyle = {
    flex: "1 1 0",
    textDecoration: "none",
    color: "black",
  };
  if (props.profile !== "transporter") return null;
  return (
    <div>
      <nav id="travelerNav">
        <ul className="navItems">
          <li className="navItem">
            <Link style={linkStyle} to="/propose-kilos">
              propose kilos
            </Link>
          </li>
          <li className="navItem">
            <Link style={linkStyle} to="/inbox">
              inbox
            </Link>
          </li>
          <li className="navItem">
            <Link style={linkStyle} to="/mypackages">
              My packages
            </Link>
          </li>
          <li className="navItem">
            <Link style={linkStyle} to="/mybalance">
              My balance
            </Link>
          </li>
          <li className="navItem">
            <Link style={linkStyle} to="/myclaims">
              My claims
            </Link>
          </li>
          <li className="navItem">
            <Link style={linkStyle} to="/contact-support">
              Contact support
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default TravelerNav;
