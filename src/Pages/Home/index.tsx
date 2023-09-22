import HomeResearch from "./HomeResearch";
import Advertisement from "./Advertisement";
import Annoucements from "./Announcements";
import { Outlet } from "react-router-dom";
import React from "react";
import styled from "styled-components";

function Home() {
  const Wrapper = styled.div`
    max-width: 155Opx;
    margin: auto;
    padding-top: 13vh;
    display: flex;
    flex-direction: column;
    gap: 3vh;
  `;

  return (
    <Wrapper>
      <Advertisement />
      <HomeResearch />
      <Annoucements />
      <Outlet />
    </Wrapper>
  );
}

export default Home;
