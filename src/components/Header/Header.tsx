import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuthContext } from "components/auth/useAuthContext";
import styled from "styled-components";
import {AuthCredential} from "@firebase/auth-types"
import { FirestoreError } from "@firebase/firestore-types";

const Header = () => {
  const { user } = useAuthContext();
  let isprofilecompleted = user?.isprofilecompleted;
  const [isExpand, setisExpand] = useState<boolean>(false);

  useEffect(() => {
    function closeuserActions(e: Event) {
      const target = e.target as HTMLElement;
      if (target.classList.contains("fa-chevron-down")) return;
      setisExpand(false);
    }
    document.addEventListener("click", closeuserActions);

    return () => {
      document.removeEventListener("click", closeuserActions);
    };
  }, []);

  const toggleIsExpand = () => {
    setisExpand(!isExpand);
  };

  const logOut = () => {
    const auth: AuthCredential = getAuth();
    signOut(auth)
      .then(() => {})
      .catch((error: FirestoreError) => {
        // An error happened.
      });
  };
  return (
    <header>
      <ContentWrapper>
        <Link className="link logo" to="/">
          <img
            src="https://img.icons8.com/ios-filled/50/000000/passenger-with-baggage.png"
            alt="logo"
          />
          <H1>WannaKilos</H1>
        </Link>
        {user === null ? (
          <div id="callToActions">
            <Link className="link callToAction" to="/signin">
              Propose Kilos
            </Link>
            <Link className="link callToAction" to="/signin">
              Send A Package
            </Link>
          </div>
        ) : null}
        {user === null ? (
          <div id="authentication">
            <Link className="link" id="signIn" to="/signin">
              Login
            </Link>
            <Link className="link" id="signUp" to="signup">
              Sign up
            </Link>
          </div>
        ) : (
          <OptionsWrapper>
            <i className="fa-solid fa-user fa-xl"></i>
            <i
              className="fa-solid fa-chevron-down"
              style={{ cursor: "pointer" }}
              onClick={toggleIsExpand}
            ></i>
            {isExpand ? (
              <UL>
                <li id="logOut" onClick={logOut}>
                  Log out
                </li>
                {!isprofilecompleted ? (
                  <li>
                    <Link className="link" to="/completeprofile">
                      Complete Profile
                    </Link>
                  </li>
                ) : null}
              </UL>
            ) : null}
          </OptionsWrapper>
        )}
      </ContentWrapper>
    </header>
  );
};

export { Header };

const ContentWrapper = styled.div`
  width: 80%;
  max-width: 124Opx;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  height: 100%;
  @media (max-width: 496px) {
    width: 95%;
  }
`;

const H1 = styled.h1`
  font-family: var(--logoFont);
`;

const OptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  position: relative;
`;

const UL = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 25px;
  right: 0;
  width: 200px;
  border: solid 2px green;
  border: none;
  border-radius: 5px;
  height: 200px;
  background-color: white;
  padding: 10px;
  z-index: 7;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.25);
`;
