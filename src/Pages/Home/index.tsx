import React from "react";
import Research from "./Research";
import Advertisement from "./Advertisement";
import Annoucements from "./Announcements";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  margin: auto;
  padding-top: calc(10vh + 25px);
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

function Home() {
  return (
    <Wrapper>
      <Advertisement />
      <Research />
      <Annoucements />
      <Outlet />
    </Wrapper>
  );
}

export default Home;
