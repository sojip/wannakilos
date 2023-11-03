import React, { useState, SetStateAction } from "react";
import { db } from "../../components/utils/firebase";
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
import {
  Background,
  Icon,
  Form,
  Title,
  Separator,
  Line,
} from "../SignIn/SignIn";
import { Button } from "components/Button";
type SignUpProps = {
  setshowLoader: React.Dispatch<SetStateAction<boolean>>;
};

type FormDatas = {
  email: string;
  password: string;
  country: string;
};

const SignUpForm = (props: SignUpProps) => {
  let navigate = useNavigate();
  const [datas, setdatas] = useState<FormDatas>({
    country: "cameroon",
  } as FormDatas);
  const { setshowLoader } = props;

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
      const credential = await createUserWithEmailAndPassword(
        auth,
        datas.email,
        datas.password
      );
      const user = credential.user;
      const userDocRef = doc(db, "users", user.uid);
      const dbUpdate = await setDoc(
        userDocRef,
        {
          country: datas.country,
          isprofilecompleted: false,
          isprofilesubmited: false,
        },
        { merge: true }
      );
      (e.target as HTMLFormElement).reset();
    } catch (e) {
      alert(e.message);
    } finally {
      setshowLoader(false);
    }
    // sendEmailVerification(auth.currentUser).then(() => {
    //     //   //  Email verification sent!
    //     //   //  show component for email verification sent
    //     // });
  }

  function close(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    return navigate("/");
  }
  return (
    <Background>
      <Icon
        className="fa-solid fa-rectangle-xmark fa-xl"
        onClick={close}
      ></Icon>
      <Form onSubmit={handleSubmit}>
        <Title>Sign up to WannaKilos</Title>
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
        <Button $outline={true} type="submit" value="Sign Up" />
        <br />
        <Separator>
          <Line />
          <div>Or</div>
          <Line />
        </Separator>
        <Button type="button" value="Continue with Google" />
        <br />
        <Button type="button" value="Continue with Facebook" />
      </Form>
    </Background>
  );
};

export default SignUpForm;
