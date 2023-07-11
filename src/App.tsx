import "./App.css";
import React, { ReactElement, ReactNode, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CompleteProfile from "./Pages/CompleteProfile/CompleteProfile";
import SignInForm from "./Pages/SignIn/SignIn";
import SignUpForm from "./Pages/SignUp/SignUp";
import ProposeKilos from "./Pages/ProposeKilos/ProposeKilos";
import MyKilos from "./Pages/MyKilos/MyKilos";
import EditOffer from "./Pages/EditOffer/EditOffer";
import SendPackage from "./Pages/SendPackage/SendPackage";
import BookOffer from "./Pages/BookOffer/BookOffer";
import OfferBookings from "./Pages/OfferBookings/OfferBookings";
import Home from "./Pages/Home/index";
import MyPackages from "./Pages/MyPackages/MyPackages";
import DashboardLayout from "./components/DashboardLayout";
import Inbox from "./Pages/Inbox/Inbox";
import { Loader } from "./components/Loader";
import { Header } from "./components/Header";
import PayBooking from "./Pages/PayBooking/PayBooking";
import { Room } from "./Pages/Inbox/Inbox";
import InboxIndex from "./Pages/Inbox/InboxIndex";
import MyBalance from "./Pages/MyBalance/MyBalance";
import ContactSupport from "./Pages/ContactSupport/ContactSupport";
import { MyClaims } from "./Pages/MyClaims/MyClaims";
import { Claim } from "./Pages/ClaimDetails/Claim";
import { useAuthContext } from "./components/auth/Auth";

let ProtectedRoute = (props: React.PropsWithChildren): JSX.Element | null => {
  const auth = useAuthContext();
  if (auth?.checkingStatus === true) return <Loader />;
  let isLoggedIn = auth?.user?.isLoggedIn;
  let isprofilecompleted = auth?.user?.isprofilecompleted;
  if (isLoggedIn && isprofilecompleted) {
    return props.children as JSX.Element;
  }
  return <Navigate to="/" replace={true} />;
};

let ProtectedAuthentication = (
  props: React.PropsWithChildren
): JSX.Element | null => {
  const auth = useAuthContext();
  if (auth?.checkingStatus === true) return <Loader />;
  const isLoggedIn = auth?.user?.isLoggedIn;
  const isprofilecompleted = auth?.user?.isprofilecompleted;
  return isLoggedIn ? (
    isprofilecompleted ? (
      <Navigate to="/send-package" replace={true} />
    ) : (
      <Navigate to="/completeprofile" replace={true} />
    )
  ) : (
    (props.children as JSX.Element)
  );
};

let PublicHome = (props: React.PropsWithChildren): JSX.Element | null => {
  const auth = useAuthContext();
  if (auth?.checkingStatus === true) return <Loader />;
  const isprofilecompleted = auth?.user?.isprofilecompleted;
  return isprofilecompleted ? (
    <Navigate to="/send-package" replace={true} />
  ) : (
    (props.children as JSX.Element)
  );
};

let ProtectedProfile = (props: React.PropsWithChildren): JSX.Element | null => {
  const auth = useAuthContext();
  if (auth?.checkingStatus === true) return <Loader />;
  const isLoggedIn = auth?.user?.isLoggedIn;
  const isprofilecompleted = auth?.user?.isprofilecompleted;
  if (isLoggedIn && !isprofilecompleted) return props.children as JSX.Element;
  return <Navigate to="/" replace={true} />;
};

function App() {
  const [showLoader, setshowLoader] = useState(false);

  return (
    // <AuthProvider>
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
              path="/inbox/*"
              element={
                <ProtectedRoute>
                  <Inbox setshowLoader={setshowLoader} />
                </ProtectedRoute>
              }
            >
              <Route path=":id" element={<Room />} />
              <Route index element={<InboxIndex />} />
            </Route>
            <Route
              path="/mybalance"
              element={
                <ProtectedRoute>
                  <MyBalance setshowLoader={setshowLoader} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact-support"
              element={
                <ProtectedRoute>
                  <ContactSupport setshowLoader={setshowLoader} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/myclaims"
              element={
                <ProtectedRoute>
                  <MyClaims setshowLoader={setshowLoader} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/myclaims/:id"
              element={
                <ProtectedRoute>
                  <Claim setshowLoader={setshowLoader} />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
    // </AuthProvider>
  );
}

export default App;
