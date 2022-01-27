import "../styles/Header.css";
import { Link } from "react-router-dom";
import { auth, db } from "./utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Profile from "../img/user.png";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const Header = (props) => {
  let history = useHistory();
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [user, setuser] = useState({});
  const linkStyle = {
    flex: "1 1 0",
    textDecoration: "none",
    color: "black",
    // border: "solid 1px black",
  };

  const linkStyle_ = {
    textDecoration: "none",
    cursor: "pointer",
    width: "120px",
    color: "black",
    // border: "solid 1px red",
    textAlign: "center",
    padding: "10px 0",
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      //user is signed in
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      setuser(user);
      setisLoggedIn(true);
      // ...
    } else {
      // User is signed out
      setisLoggedIn(false);
      document.querySelector(".userActions").classList.remove("visible");
    }
  });

  useEffect(() => {
    function closeuserActions(e) {
      let div = document.querySelector(".visible");
      if (div && e.target.getAttribute("id") !== "expend")
        div.classList.remove("visible");
      return;
    }
    document.addEventListener("click", closeuserActions);

    return () => {
      document.removeEventListener("click", closeuserActions);
    };
  });

  function toggleUserActions() {
    let div = document.querySelector(".userActions");
    div.classList.toggle("visible");
  }

  function logOut() {
    //Stop listening to changes
    // const docRef = doc(db, "users", user.uid);
    // const unsub = onSnapshot(docRef, (doc) => {
    //   console.log("Current data: ", doc.data());
    //   let datas = doc.data();
    //   if (datas.firstName !== undefined) setisLoggedIn(true);
    // });
    // unsub();
    signOut(auth)
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        // An error happened.
      });
  }
  function switchToTransporter() {
    props.setprofile("transporter");
    return;
  }
  function switchTosender() {
    props.setprofile("sender");
    return;
  }
  return (
    <div>
      <header>
        <div className="wrapper">
          <Link style={{ textDecoration: "none", color: "black" }} to="/">
            <div className="logo">
              <img
                src="https://img.icons8.com/ios-filled/50/000000/passenger-with-baggage.png"
                alt="logo"
              />
              <h1>WannaKilos</h1>
            </div>
          </Link>
          <div className="chooseProfile">
            <Link
              style={linkStyle_}
              to="/propose-kilos"
              className="switchProfile"
              onClick={switchToTransporter}
            >
              Offer Kilos
            </Link>
            <Link
              style={linkStyle_}
              to="/send-package"
              className="switchProfile"
              onClick={switchTosender}
            >
              Send packages
            </Link>
          </div>

          {!isLoggedIn ? (
            <div className="login">
              <Link style={linkStyle} to="/signin">
                <button id="signIn">LogIn</button>
              </Link>

              <Link style={linkStyle} to="signup">
                <button id="signUp">SignUp</button>
              </Link>
            </div>
          ) : (
            <div className="login">
              {/* <div>{user.email}</div> */}
              <div>
                <img id="userPic" src={Profile} alt="profile" />
              </div>
              <img
                id="expend"
                onClick={toggleUserActions}
                src="https://img.icons8.com/material-outlined/50/000000/expand-arrow--v2.png"
                alt="expend"
              />
            </div>
          )}
        </div>
      </header>
      <div className="userActions">
        <ul>
          <li id="logOut" onClick={logOut}>
            Log out
          </li>
        </ul>
      </div>
    </div>
  );
};

export { Header };
