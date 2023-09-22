import React from "react";
import { styled } from "styled-components";

interface ButtonOutlineProps {
  link?: string;
  text: string;
}

export const ButtonOutline = (props: ButtonOutlineProps): JSX.Element => {
  const { link, text } = props;
  const Button =
    link === null
      ? styled.button`
          width: 200px;
        `
      : styled.a`
          width: 100px;
        `;
  return (
    <>
      <Button></Button>
    </>
  );
};
