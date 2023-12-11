import styled from "styled-components";

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  align-items: start;
`;

export const PaymentLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const Img = styled.img`
  width: 32px;
  height: 32px;
`;

export const Form = styled.form`
  text-align: center;
`;
