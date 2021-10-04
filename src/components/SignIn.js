import { useState, useEffect } from "react";
import { auth } from "./utils/firebase";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { useHistory, Link } from "react-router-dom";
import "../styles/SignForms.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./utils/firebase";
import { Loader } from "./Loader";

const SignInForm = (props) => {
  let history = useHistory();

  const [datas, setdatas] = useState({});
  const [showLoader, setshowLoarder] = useState(false);

  function handleInputChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setdatas({ ...datas, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setshowLoarder(true);
    signInWithEmailAndPassword(auth, datas.email, datas.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const userid = user.uid;
        const userdocRef = doc(db, "users", user.email);
        getDoc(userdocRef).then((userdocSnap) => {
          setshowLoarder(false);
          e.target.reset();
          let profile = userdocSnap.data().profile;
          if (profile === "transporter") {
            history.push("/travelerdashboard");
            return;
          } else if (profile === "sender") {
            history.push("/senderdashboard");
            return;
          }
          history.push("/completeProfile");
          return;
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }

  function goHome(e) {
    if (e.target.classList.value === "formBackground") history.push("/");
  }
  return (
    <div>
      <div className="formBackground" onClick={goHome}>
        <div className="formWrapper">
          <form id="signInForm" onSubmit={handleSubmit}>
            <h2>Log in to WannaKilos</h2>
            <input
              type="email"
              name="email"
              onChange={handleInputChange}
              required
              placeholder="Email"
            />
            <br></br>
            <input
              type="password"
              name="password"
              onChange={handleInputChange}
              required
              placeholder="Password"
              minLength="6"
            />
            <br></br>
            <input type="submit" value="Sign In" />
            <br></br>
            <div className="formSeparator">
              <div className="line"></div>
              <div>Or</div>
              <div className="line"></div>
            </div>
            <input
              type="button"
              id="googleLogIn"
              value="Continue with Google"
            />
            <br></br>
            <input
              type="button"
              id="facebookLogIn"
              value="Continue with Facebook"
            />
            <hr></hr>
            <span>Don't have a WannaKilos account?</span>
            <br></br>
            <Link to="/signup">
              <input type="button" value="Sign Up" />
            </Link>
            <br></br>
          </form>
        </div>
      </div>
      {showLoader && <Loader />}
    </div>
  );
};

export default SignInForm;
