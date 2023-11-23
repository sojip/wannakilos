import React from "react";
import { Link } from "react-router-dom";
import { Request as Req } from "./utils";
import styled from "styled-components";

const SLink = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 10px;
  padding: 10px;
  transition: all 300ms ease-in;
  text-decoration: none;
  color: black;
  background-color: white;
  @media screen and (max-width: 496px) {
    grid-template-columns: 1fr;
  }
  &:hover {
    background-color: var(--blue);
    color: white;
  }
  &:not(:last-child) {
    border-bottom: solid 2px var(--bodyBakgroundColor);
  }
  & > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  & > :first-child {
    font-weight: bold;
  }
`;

export const Request = (request: Req) => {
  return (
    <SLink to={`/myclaims/${request.id}`}>
      <div>{request.summary}</div>
      <div>{request.description}</div>
    </SLink>
  );
};
