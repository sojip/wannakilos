import "./App.css";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CompleteProfile from "./Pages/CompleteProfile/CompleteProfile";
import SignInForm from "./components/SignIn";
import SignUpForm from "./components/SignUp";
import { useState } from "react";
import ProposeKilos from "./components/ProposeKilos";
import MyKilos from "./components/MyKilos";
import EditOffer from "./components/EditOffer";
import SendPackage from "./components/SendPackage";
import BookOffer from "./components/BookOffer";
import OfferBookings from "./components/OfferBookings";
import Home from "./Pages/Home/index";
import MyPackages from "./Pages/MyPackages/MyPackages";
import DashboardLayout from "./components/DashboardLayout";
import Inbox from "./Pages/Inbox/Inbox";
import { Loader } from "./components/Loader";
import { Header } from "./components/Header";
import PayBooking from "./components/PayBooking";
import { AuthProvider } from "./components/auth/AuthProvider";
import useAuthContext from "./components/auth/useAuthContext";
import { Room } from "./Pages/Inbox/Inbox";
import InboxIndex from "./Pages/Inbox/InboxIndex";
let ProtectedRoute = ({ children }) => {
  const user = useAuthContext();
  if (user === undefined) {
    return <Loader />;
  }
  let isLoggedIn = user?.isLoggedIn;
  let isprofilecompleted = user?.isprofilecompleted;
  if (isLoggedIn && isprofilecompleted) {
    return children;
  }
  return <Navigate to="/" replace={true} />;
};

let ProtectedAuthentication = ({ children }) => {
  const user = useAuthContext();
  if (user === undefined) {
    return <Loader />;
  }
  const isLoggedIn = user?.isLoggedIn;
  const isprofilecompleted = user?.isprofilecompleted;
  return isLoggedIn ? (
    isprofilecompleted ? (
      <Navigate to="/send-package" replace={true} />
    ) : (
      <Navigate to="/completeprofile" replace={true} />
    )
  ) : (
    children
  );
};

let PublicHome = ({ children }) => {
  const user = useAuthContext();
  if (user === undefined) {
    return <Loader />;
  }
  const isprofilecompleted = user?.isprofilecompleted;
  return isprofilecompleted ? (
    <Navigate to="/send-package" replace={true} />
  ) : (
    children
  );
};

let ProtectedProfile = ({ children }) => {
  const user = useAuthContext();
  if (user === undefined) {
    return <Loader />;
  }
  const isLoggedIn = user?.isLoggedIn;
  const isprofilecompleted = user?.isprofilecompleted;
  if (isLoggedIn && !isprofilecompleted) return children;
  return <Navigate to="/" replace={true} />;
};

function App() {
  const [showLoader, setshowLoader] = useState(false);

  return (
    <AuthProvider>
      <div className="App">
        {showLoader && <Loader />}
        <Router basename="/">
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <PublicHome>
                  <Home />
                </PublicHome>
              }
            >
              <Route
                path="/signin"
                element={
                  <ProtectedAuthentication>
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
            <Route
              path="/completeprofile"
              element={
                <ProtectedProfile>
                  <CompleteProfile setshowLoader={setshowLoader} />
                </ProtectedProfile>
              }
            />
            <Route element={<DashboardLayout />}>
              <Route
                path="/send-package"
                element={
                  <ProtectedRoute>
                    <SendPackage setshowLoader={setshowLoader} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/propose-kilos"
                element={
                  <ProtectedRoute>
                    <ProposeKilos />
                  </ProtectedRoute>
                }
              />
              <Route
                path={`/edit/offer/:offerId`}
                element={
                  <ProtectedRoute>
                    <EditOffer />
                  </ProtectedRoute>
                }
              />
              <Route
                path={`/book-offer/:offerId`}
                element={
                  <ProtectedRoute>
                    <BookOffer />
                  </ProtectedRoute>
                }
              />
              <Route
                path={`/offers/:offerId/bookings`}
                element={
                  <ProtectedRoute>
                    <OfferBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mykilos"
                element={
                  <ProtectedRoute>
                    <MyKilos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mypackages"
                element={
                  <ProtectedRoute>
                    <MyPackages setshowLoader={setshowLoader} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pay/booking/:bookingId"
                element={
                  <ProtectedRoute>
                    <PayBooking setshowLoader={setshowLoader} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inbox"
                element={
                  <ProtectedRoute>
                    <Inbox setshowLoader={setshowLoader} />
                  </ProtectedRoute>
                }
              >
                <Route path="/inbox/:id" element={<Room />} />
                <Route index element={<InboxIndex />} />
              </Route>
            </Route>

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
    </AuthProvider>
  );
}

export default App;
