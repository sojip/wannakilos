import { useState } from "react";
import { db } from "./utils/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "@firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getAuth } from "firebase/auth";

const SignUpForm = (props) => {
  let navigate = useNavigate();
  const [datas, setdatas] = useState({ country: "cameroon" });
  const { setshowLoader } = props;

  function handleInputChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setdatas({ ...datas, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setshowLoader(true);
    //signup
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, datas.email, datas.password)
      .then((userCredential) => {
        let user = userCredential.user;
        //store others user infos in firestore
        try {
          const docRef = doc(db, "users", user.uid);
          setDoc(
            docRef,
            {
              country: datas.country,
              isprofilecompleted: false,
              isprofilesubmited: false,
            },
            { merge: true }
          ).then(() => {
            e.target.reset();
            setshowLoader(false);
          });
          //alert signup success
        } catch (e) {
          //alert signup error
          setshowLoader(false);
          alert("Error adding document: ", e);
        }

        // sendEmailVerification(auth.currentUser).then(() => {
        //   //  Email verification sent!
        //   //  show component for email verification sent
        // });
      })
      .catch((error) => {
        //alert signup error
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + ":" + errorMessage);
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
          <form id="signUpForm" onSubmit={handleSubmit}>
            <h2>Sign up to WannaKilos</h2>
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
            <FormControl fullWidth margin="normal">
              <InputLabel id="countrylabel">Country</InputLabel>
              <Select
                displayEmpty
                labelId="countrylabel"
                id="country"
                value={datas.country}
                label="Country"
                onChange={handleInputChange}
                name="country"
                style={{
                  textAlign: "left",
                }}
              >
                <MenuItem value={"cameroon"}>Cameroon</MenuItem>
                <MenuItem value={"ivory coast"}>Ivory Coast</MenuItem>
                <MenuItem value={"nigeria"}>Nigeria</MenuItem>
              </Select>
            </FormControl>
            <input type="submit" value="Sign Up" />
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
