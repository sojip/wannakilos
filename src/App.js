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
import { Loader } from "./components/Loader";
import { getAuth } from "firebase/auth";
import { Header } from "./components/Header";
import { Link } from "react-router-dom";

let ProtectedRoute = ({ isLoggedIn, isprofilecompleted, children }) => {
  if (isLoggedIn && isprofilecompleted) return children;
  return <Navigate to="/" replace={true} />;
};

let ProtectedAuthentication = ({ isLoggedIn, children }) => {
  if (isLoggedIn) return <Navigate to="/" replace={true} />;
  return children;
};

let PublicHome = ({ isLoggedIn, isprofilecompleted, children }) => {
  if (isLoggedIn && isprofilecompleted)
    return <Navigate to="/send-package" replace={true} />;
  return children;
};

function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isprofilecompleted, setisprofilecompleted] = useState(false);
  const [user, setuser] = useState(undefined);
  const [showLoader, setshowLoader] = useState(false);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      //user is signed in
      setisLoggedIn(true);
      setuser(user);
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
      setuser(undefined);
      return;
    }
  });

  return (
    <div>
      {showLoader && <Loader />}
      {/* <div>Hello</div> */}

      <Router>
        <Header />
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
                  <SignInForm setshowLoader={setshowLoader} />
                </ProtectedAuthentication>
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectedAuthentication>
                  <SignUpForm setshowLoader={setshowLoader} />
                </ProtectedAuthentication>
              }
            />
          </Route>
          <Route element={<DashboardLayout />}>
            <Route
              path="/send-package"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  isprofilecompleted={isprofilecompleted}
                >
                  <SendPackage setshowLoader={setshowLoader} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/propose-kilos"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  isprofilecompleted={isprofilecompleted}
                >
                  <ProposeKilos />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/edit-:offerId`}
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  isprofilecompleted={isprofilecompleted}
                >
                  <EditOffer />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/book-:offerId`}
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  isprofilecompleted={isprofilecompleted}
                >
                  <BookOffer />
                </ProtectedRoute>
              }
            />
            <Route
              path={`/offers/:offerId`}
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  isprofilecompleted={isprofilecompleted}
                >
                  <ShowBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mykilos"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  isprofilecompleted={isprofilecompleted}
                >
                  <MyKilos user={user} />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/completeprofile"
            render={(props) => <CompleteProfile {...props} />}
          />

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
    </div>
  );
}

export default App;
