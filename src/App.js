import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CompleteProfile from "./components/CompleteProfile";
import SignInForm from "./components/SignIn";
import SignUpForm from "./components/SignUp";
import { auth } from "./components/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./components/utils/firebase";
import ProposeKilos from "./components/ProposeKilos";
import MyKilos from "./components/MyKilos";
import EditOffer from "./components/EditOffer";
import SendPackage from "./components/SendPackage";
import BookOffer from "./components/BookOffer";
import ShowBookings from "./components/ShowBookings";
import Home from "./Pages/Home/index";
import DashboardLayout from "./components/DashboardLayout";

let ProtectedDashboard = ({ isLoggedIn, isprofilecompleted, children }) => {
  if (isLoggedIn && isprofilecompleted) return children;
  return <Navigate to="" replace={true} />;
};

let ProtectedAuthentication = ({ isLoggedIn, children }) => {
  // const [isLoggedIn, setisLoggedIn] = useState(false)

  if (!isLoggedIn) return children;
  return <Navigate to="/" replace={true} />;
};

let PublicHome = ({ isLoggedIn, isprofilecompleted, children }) => {
  if (isLoggedIn && isprofilecompleted)
    return <Navigate to="/send-package" replace={true} />;
  return children;
};

function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isprofilecompleted, setisprofilecompleted] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      //user is signed in
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
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
      setisLoggedIn(false);
      setisprofilecompleted(false);
      return;
    }
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicHome
              isLoggedIn={isLoggedIn}
              isprofilecompleted={isprofilecompleted}
            >
              <Home />
            </PublicHome>
          }
        >
          <Route
            path="/signin"
            element={
              <ProtectedAuthentication isLoggedIn={isLoggedIn}>
                <SignInForm />
              </ProtectedAuthentication>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedAuthentication isLoggedIn={isLoggedIn}>
                <SignUpForm />
              </ProtectedAuthentication>
            }
          />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/send-package" element={<SendPackage />} />
          <Route path="/propose-kilos" element={<ProposeKilos />} />
          <Route path={`/edit-:offerId`} element={<EditOffer />} />
          <Route path={`/book-:offerId`} element={<BookOffer />} />
          <Route path={`/offers/:offerId`} element={<ShowBookings />} />
        </Route>
        <Route
          path="/completeprofile"
          render={(props) => <CompleteProfile {...props} />}
        />
        <Route path="/mykilos" render={(props) => <MyKilos {...props} />} />

        {/* <Route path="/inbox">
          <div className="container" style={{ border: "solid 1px red" }}>
            <h3>Please select a topic.</h3>
          </div>
        </Route>
        <Route path="/mypackages">
          <h3>Please select a topic.</h3>
        </Route>
        <Route path="/mybalance">
          <h3>Please select a topic.</h3>
        </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
