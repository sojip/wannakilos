import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  max-width: 1240px;
  width: 80%;
  margin: auto;
  padding-top: calc(20vh + 25px);
  overflow: hidden;
  word-wrap: break-word;
  @media screen and (max-width: 496px) {
    width: 95%;
  }
`;

export const Content = (props: React.PropsWithChildren) => {
  return <Wrapper>{props.children}</Wrapper>;
};
