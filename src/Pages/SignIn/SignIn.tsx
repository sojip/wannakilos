import React, { SetStateAction, useState } from "react";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/SignForms.css";
import TextField from "@mui/material/TextField";
import { getAuth } from "@firebase/auth";

interface SignInProps {
  setshowLoader: React.Dispatch<SetStateAction<boolean>>;
}

interface FormDatas {
  email: string;
  password: string;
}

const SignInForm = (props: SignInProps) => {
  const navigate = useNavigate();
  const { setshowLoader } = props;
  const [datas, setdatas] = useState<FormDatas>({} as FormDatas);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    let name = e.target.name;
    let value = e.target.value;
    setdatas({ ...datas, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setshowLoader(true);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        datas.email,
        datas.password
      );
    } catch (e) {
      alert(e.message);
    } finally {
      setshowLoader(false);
    }
  }

  async function handleSignAsGuest() {
    setshowLoader(true);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        "guest@guest.fr",
        "sojip1"
      );
    } catch (e) {
      alert(e.message);
    } finally {
      setshowLoader(false);
    }
  }

  function close(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    return navigate("/");
  }
  return (
    <div className="formBackground">
      <i className="fa-solid fa-rectangle-xmark fa-xl" onClick={close}></i>
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
          <br />
          <input
            type="button"
            onClick={handleSignAsGuest}
            id="guest"
            value="Visit As A Guest"
          />
          <br></br>
          <div className="formSeparator">
            <div className="line"></div>
            <div>Or</div>
            <div className="line"></div>
          </div>
          <input type="button" id="googleLogIn" value="Continue with Google" />
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
  );
};

export default SignInForm;
