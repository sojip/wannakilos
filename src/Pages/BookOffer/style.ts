import styled from "styled-components";

export const Flex = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
`;

export const Title = styled.h2`
  text-align: center;
`;
