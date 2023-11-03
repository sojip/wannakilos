import React from "react";
import styled from "styled-components";

const BUTTON = styled.button<{ $outline?: boolean }>`
  font-family: var(--textFont);
  color: var(--blue);
  border: none;
  background-color: transparent;
  font-weight: bold;
  font-size: 0.8rem;
  cursor: pointer;
  margin: 5px 0;
  ${(props) =>
    props.$outline &&
    `
  margin: 20px 0;
  border: solid 2px var(--blue);
  border-radius: 5px;
  padding: 5px 0;
  width: 220px;
  &: hover {
    background-color: var(--blue);
    color: white;
  }
  `}
`;
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $outline?: boolean;
}

export const Button = (props: ButtonProps) => {
  return <BUTTON {...props}>{props.value}</BUTTON>;
};
