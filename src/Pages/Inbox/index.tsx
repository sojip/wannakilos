import React from "react";
import ChatImage from "../../img/chat.png";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100%;
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const Index = () => {
  return <Wrapper>{<Img src={ChatImage} alt="" />}</Wrapper>;
};
