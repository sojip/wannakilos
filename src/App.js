import "./App.css";
import { Header } from "./components/Header";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import CompleteProfile from "./components/CompleteProfile";
import SignInForm from "./components/SignIn";
import SignUpForm from "./components/SignUp";
import { auth } from "./components/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./components/utils/firebase";
import TravelerNav from "./components/TravelerNav";
import ProposeKilos from "./components/ProposeKilos";
import SenderNav from "./components/SenderNav";
import HomePage from "./components/HomePage";
import TravelerHome from "./components/TravelerHome";
import EditOffer from "./components/EditOffer";
import SendPackage from "./components/SendPackage";
import BookOffer from "./components/BookOffer";
import ShowBookings from "./components/ShowBookings";
function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [profile, setprofile] = useState("transporter");
  onAuthStateChanged(auth, (user) => {
    if (user) {
      //user is signed in
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      setisLoggedIn(true);
      const uid = user.uid;
      console.log(uid);
    } else {
      // User is signed out
      setisLoggedIn(false);
    }
  });

  return (
    <Router>
      <div className="App">
        <Header setprofile={setprofile} />

        <main style={{ marginTop: "12vh" }}>
          <HomePage isLoggedIn={isLoggedIn} />
          <TravelerNav profile={profile} />
          <SenderNav profile={profile} />
          <Switch>
            <Route
              path="/"
              exact
              render={(props) => <TravelerHome {...props} profile={profile} />}
            />

            <Route
              path="/signin"
              exact
              render={(props) => (
                <SignInForm {...props} setprofile={setprofile} />
              )}
            />
            <Route path="/signup" exact component={SignUpForm} />
            <Route
              path="/completeprofile"
              exact
              render={(props) => <CompleteProfile {...props} />}
            />
            <Route exact path="/propose-kilos">
              {!isLoggedIn ? <Redirect to="/signup" /> : <ProposeKilos />}
            </Route>
            <Route exact path={`/edit-:offerId`}>
              <EditOffer />
            </Route>
            <Route exact path={`/book-:offerId`}>
              <BookOffer />
            </Route>

            <Route
              exact
              path={`/show-bookings-:offerId`}
              component={ShowBookings}
            />
            {/* <Route exact path={`/bookings-:offerId`}>
              <OfferBookings />
            </Route> */}
            <Route exact path="/send-package">
              {!isLoggedIn ? <Redirect to="/signup" /> : <SendPackage />}
            </Route>

            <Route exact path="/inbox">
              <h3>Please select a topic.</h3>
            </Route>
            <Route eaxct path="/mypackages">
              <h3>Please select a topic.</h3>
            </Route>
            <Route exact path="/mybalance">
              <h3>Please select a topic.</h3>
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
