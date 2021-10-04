import "./App.css";
import { Header } from "./components/Header";
import Advertisement from "./components/Advertisement";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import CompleteProfile from "./components/CompleteProfile";
import SignInForm from "./components/SignIn";
import SignUpForm from "./components/SignUp";
import TravelerDashboard from "./components/TravelerDashboard";
import SenderDashboard from "./components/SenderDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main style={{ marginTop: "10vh" }}>
          {/* <Advertisement /> */}
          <Switch>
            <Route path="/" exact component={Advertisement} />
            <Route path="/completeProfile" exact component={CompleteProfile} />
            <Route path="/signin" exact component={SignInForm} />
            <Route path="/signup" exact component={SignUpForm} />
            <Route
              path="/travelerdashboard"
              exact
              component={TravelerDashboard}
            />
            <Route path="/senderdashboard" exact component={SenderDashboard} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
