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
import ProposeKilos from "./components/ProposeKilos";
import Nav from "./components/Nav";
import HomePage from "./components/HomePage";
import MyKilos from "./components/MyKilos";
import EditOffer from "./components/EditOffer";
import SendPackage from "./components/SendPackage";
import BookOffer from "./components/BookOffer";
import ShowBookings from "./components/ShowBookings";
function App() {
  const [user, setuser] = useState(undefined);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isprofilecompleted, setisprofilecompleted] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      //user is signed in
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      setuser(user);
      setisLoggedIn(true);
      const uid = user.uid;
      const docRef = doc(db, "users", uid);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.data().isprofilecompleted) {
          setisprofilecompleted(true);
          return;
        }
      });
    } else {
      // User is signed out
      setuser(undefined);
      setisLoggedIn(false);
      setisprofilecompleted(false);

      return;
    }
  });

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} />
        <main style={{ marginTop: "12vh" }}>
          <HomePage isLoggedIn={isLoggedIn} />
          <Nav
            isLoggedIn={isLoggedIn}
            isprofilecompleted={isprofilecompleted}
          />
          <Switch>
            <Route exact path="/">
              {isLoggedIn && isprofilecompleted ? (
                <Redirect to="/send-package" />
              ) : (
                <></>
              )}
            </Route>

            <Route path="/signin" exact component={SignInForm} />
            <Route path="/signup" exact component={SignUpForm} />
            <Route
              path="/completeprofile"
              exact
              render={(props) => <CompleteProfile {...props} user={user} />}
            />
            <Route path="/send-package" exact>
              {!isLoggedIn ? <Redirect to="/signup" /> : <SendPackage />}
            </Route>
            <Route exact path="/propose-kilos">
              {!isLoggedIn ? <Redirect to="/signup" /> : <ProposeKilos />}
            </Route>
            <Route path="/mykilos" exact>
              <div className="container">helllod je scouucpe</div>
            </Route>

            <Route path={`/edit-:offerId`} exact>
              <EditOffer />
            </Route>
            <Route path={`/book-:offerId`} exact>
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

            <Route exact path="/inbox">
              <div className="container" style={{ border: "solid 1px red" }}>
                <h3>Please select a topic.</h3>
              </div>
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
