import { useState } from "react";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/SignForms.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import TextField from "@mui/material/TextField";
import { getAuth } from "@firebase/auth";
import { signInAnonymously } from "firebase/auth";

const SignInForm = (props) => {
  let navigate = useNavigate();
  const setshowLoader = props.setshowLoader;
  const [datas, setdatas] = useState({});

  function handleInputChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setdatas({ ...datas, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setshowLoader(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, datas.email, datas.password)
      .then((userCredential) => {
        setshowLoader(false);
      })
      .then((userdocSnap) => {})
      .catch((error) => {
        const errorMessage = error.message;
        setshowLoader(false);
        alert(errorMessage);
      });
  }

  function goHome(e) {
    // if (e.target.classList.value === "formBackground") navigate("/");
    return navigate("/");
  }
  return (
    <div>
      <div className="formBackground">
        <i className="fa-solid fa-rectangle-xmark fa-xl" onClick={goHome}></i>
        <div className="formWrapper">
          <form id="signInForm" onSubmit={handleSubmit}>
            <h2>Log in to WannaKilos</h2>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              required
              onChange={handleInputChange}
              fullWidth
              type="email"
              name="email"
              margin="dense"
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              required
              onChange={handleInputChange}
              fullWidth
              type="password"
              name="password"
              margin="normal"
              inputProps={{
                minLength: 6,
              }}
            />
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
            <span>Don't have a WannaKilos account ?</span>
            <br></br>
            <Link to="/signup">
              <input type="button" value="Sign Up" />
            </Link>
            <br></br>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
