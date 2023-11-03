import React from "react";
import { Link } from "./Link";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuthContext } from "components/auth/useAuthContext";
import styled from "styled-components";
import { AuthCredential } from "@firebase/auth-types";
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
    <HEADER>
      <ContentWrapper $connected={user !== null}>
        <Link to="/">
          <LOGO
            src="https://img.icons8.com/ios-filled/50/000000/passenger-with-baggage.png"
            alt="logo"
          />
          <H1>WannaKilos</H1>
        </Link>
        {user === null ? (
          <>
            <CTAWrapper>
              <CTA to="/signin">Propose Kilos</CTA>
              <CTA to="/signin">Send A Package</CTA>
            </CTAWrapper>
            <AUTH>
              <Link to="/signin" $hover={true}>
                Login
              </Link>
              <Link to="/signup" $hover={true} $outline={true}>
                Sign up
              </Link>
            </AUTH>
          </>
        ) : (
          <OptionsWrapper>
            <i className="fa-solid fa-user fa-xl"></i>
            <i
              className="fa-solid fa-chevron-down"
              style={{ cursor: "pointer" }}
              onClick={toggleIsExpand}
            ></i>
            {isExpand && (
              <Options>
                <Option onClick={logOut}>Log out</Option>
                {!isprofilecompleted && (
                  <Option>
                    <Link to="/completeprofile">Complete Profile</Link>
                  </Option>
                )}
              </Options>
            )}
          </OptionsWrapper>
        )}
      </ContentWrapper>
    </HEADER>
  );
};

export { Header };

const HEADER = styled.header`
  height: 10vh;
  background-color: white;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 5;
`;

const ContentWrapper = styled.div<{ $connected: boolean }>`
  width: 80%;
  height: 100%;
  max-width: 1240px;
  margin: auto;
  display: grid;
  grid-template-columns: ${(props) =>
    props.$connected ? `repeat(2, 1fr);` : `repeat(3, 1fr)`};
  align-items: center;
  & > :first-child {
    justify-self: start;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
  }
  & > :last-child {
    justify-self: end;
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 496px) {
    width: 95%;
  }
`;

const LOGO = styled.img`
  width: 40px;
  object-fit: cover;
`;

const H1 = styled.h1`
  font-family: var(--logoFont);
  text-transform: capitalize;
  color: black;
`;

const CTAWrapper = styled.div`
  display: flex;
  gap: 25px;
  @media screen and (max-width: 768px) {
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    text-align: center;
    padding: 20px 10%;
    border: none;
    justify-content: space-between;
    flex-wrap: nowrap;
    margin: 0;
    background-color: white;
  }
`;
const CTA = styled(Link)`
  width: 150px;
  color: black;
  padding: 10px 0;
  font-size: 0.7rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  &:hover {
    background-color: black;
    color: white;
  }
`;

const AUTH = styled.div`
  display: flex;
  align-items: center;
  width: 200px;
  gap: 0.5rem;
  & > * {
    flex: 1 1 0;
    padding: 7px 10px;
  }
`;

const OptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  position: relative;
`;

const Options = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 25px;
  right: 0;
  width: 200px;
  border: none;
  border-radius: 5px;
  height: 200px;
  background-color: white;
  padding: 10px;
  z-index: 7;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.25);
`;

const Option = styled.li`
  list-style-type: none;
  cursor: pointer;
  padding: 5px;
  border-bottom: solid 1px grey;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: bold;
  color: black;
  &:hover {
    color: var(--blue);
  }
  & > * {
    color: black;
  }
  & > :hover {
    color: var(--blue);
  }
`;
