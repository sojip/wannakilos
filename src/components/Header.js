import "../styles/Header.css";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useAuthContext } from "./auth/Auth";

const Header = (props) => {
  const auth = useAuthContext();
  let isLoggedIn = auth?.user?.isLoggedIn;
  let isprofilecompleted = auth?.user?.isprofilecompleted;

  const linkStyle = {
    flex: "1 1 0",
    textDecoration: "none",
    color: "black",
  };

  const linkStyle_ = {
    textDecoration: "none",
    cursor: "pointer",
    width: "150px",
    color: "black",
    textAlign: "center",
    padding: "10px 0",
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
    borderRadius: "5px",
    fontWeight: "bold",
    fontFamily: "var(--textFont)",
  };

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
  }, []);

  function toggleUserActions() {
    let div = document.querySelector(".userActions");
    div.classList.toggle("visible");
  }

  function logOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        // An error happened.
      });
  }
  return (
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
        {isLoggedIn ? (
          <></>
        ) : (
          <div className="chooseProfile">
            <Link style={linkStyle_} to="/signin" className="switchProfile">
              Propose Kilos
            </Link>
            <Link style={linkStyle_} to="/signin" className="switchProfile">
              Send A Package
            </Link>
          </div>
        )}

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
            <i className="fa-solid fa-user fa-xl"></i>
            <img
              id="expend"
              onClick={toggleUserActions}
              src="https://img.icons8.com/material-outlined/50/000000/expand-arrow--v2.png"
              alt="expend"
            />
          </div>
        )}
        <div className="userActions">
          <ul>
            <li id="logOut" onClick={logOut}>
              Log out
            </li>
            {!isprofilecompleted && (
              <li>
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to="/completeprofile"
                >
                  Complete Profile
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export { Header };
