import "./App.css";
import React, { useState } from "react";
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
import { Room } from "./Pages/Inbox/Room";
import { Index } from "./Pages/Inbox/index";
import { MyBalance } from "./Pages/MyBalance/MyBalance";
import ContactSupport from "./Pages/ContactSupport/ContactSupport";
import { MyClaims } from "./Pages/MyClaims/MyClaims";
import { Claim } from "./Pages/ClaimDetails/Claim";
import { useAuthContext } from "components/auth/useAuthContext";

let ProtectedRoute = (props: React.PropsWithChildren): React.ReactNode => {
  const { user, checkingStatus } = useAuthContext();
  let isprofilecompleted = user?.isprofilecompleted;
  if (checkingStatus === true) return <Loader />;
  if (user === null || !isprofilecompleted)
    return <Navigate to="/" replace={true} />;
  return props.children;
};

let ProtectedAuthentication = (
  props: React.PropsWithChildren
): React.ReactNode => {
  const { user, checkingStatus } = useAuthContext();
  let isprofilecompleted = user?.isprofilecompleted;
  if (checkingStatus === true) return <Loader />;
  return user !== null ? (
    isprofilecompleted ? (
      <Navigate to="/send-package" replace={true} />
    ) : (
      <Navigate to="/completeprofile" replace={true} />
    )
  ) : (
    props.children
  );
};

let PublicHome = (props: React.PropsWithChildren): React.ReactNode => {
  const { user, checkingStatus } = useAuthContext();
  let isprofilecompleted = user?.isprofilecompleted;
  if (checkingStatus === true) return <Loader />;
  return isprofilecompleted ? (
    <Navigate to="/send-package" replace={true} />
  ) : (
    props.children
  );
};

let ProtectedProfile = (props: React.PropsWithChildren): React.ReactNode => {
  const { user, checkingStatus } = useAuthContext();
  let isprofilecompleted = user?.isprofilecompleted;
  if (checkingStatus === true) return <Loader />;
  if (user === null || isprofilecompleted)
    return <Navigate to="/" replace={true} />;
  return props.children;
};

function App() {
  const [showLoader, setshowLoader] = useState<boolean>(false);

  return (
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
                  <SendPackage />
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
                  <MyPackages />
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
                  <Inbox />
                </ProtectedRoute>
              }
            >
              <Route path=":id" element={<Room />} />
              <Route index element={<Index />} />
            </Route>
            <Route
              path="/mybalance"
              element={
                <ProtectedRoute>
                  <MyBalance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact-support"
              element={
                <ProtectedRoute>
                  <ContactSupport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/myclaims"
              element={
                <ProtectedRoute>
                  <MyClaims />
                </ProtectedRoute>
              }
            />
            <Route
              path="/myclaims/:id"
              element={
                <ProtectedRoute>
                  <Claim />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/*" element={<>"Error"</>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
