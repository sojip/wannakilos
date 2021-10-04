import "../styles/TravelerDashboard.css";
import {
  Link,
  useRouteMatch,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

const TravelerDashboard = () => {
  let { path, url } = useRouteMatch();
  console.log(url);
  const linkStyle = {
    // flex: "1 1 0",
    textDecoration: "none",
    color: "black",
  };
  return (
    <div className="dashboardWrapper">
      <nav id="travelerNav">
        <ul className="navItems">
          <li className="navItem active">
            <Link style={linkStyle} to={`${url}/proposeKilos`}>
              propose kilos
            </Link>
          </li>
          <li className="navItem">
            <Link style={linkStyle} to={`${url}/inbox`}>
              inbox
            </Link>
          </li>
          <li className="navItem">
            <Link style={linkStyle} to={`${url}/mypackages`}>
              My packages
            </Link>
          </li>
          <li className="navItem">
            <Link style={linkStyle} to={`${url}/mybalance`}>
              My balance
            </Link>
          </li>
          <li className="navItem">
            <Link style={linkStyle} to={`${url}/myclaims`}>
              My claims
            </Link>
          </li>
          <li className="navItem">
            <Link style={linkStyle} to={`${url}/proposeKilos`}>
              Contact support
            </Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route
          path={`${url}/proposeKilos`}
          component={<div>Please select a topic.</div>}
        ></Route>
        <Route path={`${url}/inbox`}>
          <h3>Please select a topic.</h3>
        </Route>
        <Route path={`${url}/mypackages`}>
          <h3>Please select a topic.</h3>
        </Route>
        <Route path={`${url}/mybalance`}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
    </div>
  );
};

export default TravelerDashboard;
