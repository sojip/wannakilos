import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 80%;
  max-width: 1240px;
  margin: auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1vh 0;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    @media screen and (max-width: 496px) {
      width: 95%;
    }
}
`;
const Advertisement = () => {
  return (
    <Wrapper>
      <p>Advertisement Space</p>
    </Wrapper>
  );
};

export default Advertisement;
