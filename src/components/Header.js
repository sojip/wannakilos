import "../styles/Header.css";
import { Link } from "react-router-dom";
import { auth } from "./utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const Header = () => {
  let history = useHistory();
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [user, setuser] = useState({});
  const linkStyle = {
    flex: "1 1 0",
    textDecoration: "none",
    color: "black",
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
    signOut(auth)
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        // An error happened.
      });
  }
  return (
    <div>
      <header>
        <div className="wrapper">
          <Link style={linkStyle} to="/">
            <div className="logo">
              <img
                src="https://img.icons8.com/ios-filled/50/000000/passenger-with-baggage.png"
                alt="logo"
              />
              <h1>WannaKilos</h1>
            </div>
          </Link>

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
              <div>{user.email}</div>
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
