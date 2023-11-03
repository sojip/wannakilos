import React, { SetStateAction, useState } from "react";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { getAuth } from "@firebase/auth";
import styled, { keyframes } from "styled-components";
import { Link } from "components/Link";
import { Button } from "components/Button";

interface SignInProps {
  setshowLoader: React.Dispatch<SetStateAction<boolean>>;
}

interface FormDatas {
  email: string;
  password: string;
}

export const Background = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: O;
  width: 100%;
  height: 100%;
  z-index: 6;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
`;

export const Icon = styled.i`
  position: absolute;
  top: 3vh;
  right: 2vw;
  color: white;
  cursor: pointer;
`;

const fadeIn = keyframes`
from {
  top: -700px;
  opacity: 0;
}
to {
  top: 0;
  opacity: 1;
}
`;

export const Form = styled.form`
  position: relative;
  top: -700px;
  opacity: 0;
  background-color: white;
  padding: 20px;
  width: 95%;
  max-width: 500px;
  border-radius: 10px;
  margin: auto;
  animation: ${fadeIn} 400ms cubic-bezier(0.25, 0.1, 0.25, 1) 300ms forwards;
  text-align: center;
`;

export const Title = styled.h2`
  margin: 25px auto;
  text-transform: capitalize;
  max-width: 300px;
`;

export const Line = styled.div`
  flex: 1 1 auto;
  height: 0.5px;
  background-color: black;
`;

export const Separator = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: 90%;
  margin: auto;
`;

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

  function close(e: React.MouseEvent<HTMLElement>) {
    return navigate("/");
  }
  return (
    <Background>
      <Icon
        className="fa-solid fa-rectangle-xmark fa-xl"
        onClick={close}
      ></Icon>
      <Form onSubmit={handleSubmit}>
        <Title>Log in to WannaKilos</Title>
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
        <Button $outline={true} type="submit" value="Sign In" />
        <br />
        <Button
          type="button"
          onClick={handleSignAsGuest}
          value="Visit As A Guest"
        />
        <br />
        <Separator>
          <Line />
          <div>Or</div>
          <Line />
        </Separator>
        <Button type="button" value="Continue with Google" />
        <br />
        <Button
          type="button"
          id="facebookLogIn"
          value="Continue with Facebook"
        />
        <hr />
        <p>Don't have a WannaKilos account ?</p>
        <Link to="/signup">sign up</Link>
      </Form>
    </Background>
  );
};

export default SignInForm;
