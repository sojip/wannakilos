import React from "react";
import styled, { keyframes } from "styled-components";

export const fadeIn = keyframes`
from {
    opacity: 0;
    right: -700px;
}
to {
    opacity: 1;
    right: 0
}
`;

const FORM = styled.form`
  position: relative;
  color: black;
  font-family: var(--textFont);
  right: -700px;
  opacity: 0;
  background-color: white;
  padding: 20px;
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
  margin: auto;
  animation: ${fadeIn} 400ms cubic-bezier(0.25, 0.1, 0.25, 1) 100ms forwards;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  & > button {
    display: block;
    margin: 10px auto;
    font-size: 0.9rem;
  }
`;

export const Form = (
  props: React.PropsWithChildren<React.FormHTMLAttributes<HTMLFormElement>>
) => {
  return <FORM {...props}>{props.children}</FORM>;
};
