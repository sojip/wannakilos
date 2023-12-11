import "../styles/Loader.css";
import React from "react";
import styled from "styled-components";
import { useEffect } from "react";

export const Loader = (): JSX.Element => {
  useEffect(() => {
    const body = document.querySelector("body") as HTMLElement;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = "auto";
    };
  }, []);
  return (
    <WRAPPER>
      <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <LOGO>
        <Img
          src="https://img.icons8.com/ios-filled/50/000000/passenger-with-baggage.png"
          alt="logo"
        />
        <H1>WannaKilos</H1>
      </LOGO>
    </WRAPPER>
  );
};

const WRAPPER = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  z-index: 999;
  font-family: var(--logoFont);
  font-size: 15px;
`;

const LOGO = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const H1 = styled.h1`
  margin: 0;
  padding: 0;
`;

const Img = styled.img`
  width: 35px;
`;
