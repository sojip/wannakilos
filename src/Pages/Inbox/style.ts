import styled from "styled-components";

export const Wrapper = styled.div`
  height: calc(100vh - 25vh - 25px);
  display: flex;
  // padding: 10px;
  gap: 15px;
  // background-color: white;
  border-radius: 10px;
  & > * {
    flex: 1 1 auto;
  }
`;
export const Nav = styled.nav`
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: white;
  padding: 10px;
  @media screen and (min-width: 700px) {
    max-width: 350px;

    // border-right: solid 1px #dbdbdc;
  }
`;
export const OutletContent = styled.div`
  // border: solid 1px red;
  // background-color: transparent;
`;
