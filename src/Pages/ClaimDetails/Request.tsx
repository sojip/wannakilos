import React from "react";
import styled from "styled-components";
import { Claim as claim } from "./Claim";
import { DateTime } from "luxon";

const Wrapper = styled.div`
  padding-bottom: 20px;
  &:not(:last-of-type) {
    border-bottom: solid 1px grey;
  }
`;

const From = styled.div`
  font-weight: bold;
  text-transform: capitalize;
  margin-top: 20px;
`;

const Date = styled.div`
  font-style: italic;
  margin-top: 5px;
`;

const Img = styled.img`
  width: 150px;
  margin-right: 10px;
  transition: all 200ms ease-in;
  &:hover {
    transform: scale(1.1);
  }
`;

export const Detail = (claim: claim) => {
  return (
    <Wrapper>
      <From>{claim.fromSupport === true ? "Support" : claim.username}</From>
      <Date>
        {DateTime.fromJSDate(claim.timestamp.toDate()).toLocaleString(
          DateTime.DATETIME_MED
        )}
      </Date>
      <p>{claim.description}</p>
      {claim.files?.map((file) => {
        return (
          <a href={file} target="blank_" key={file}>
            <Img src={file} alt="" />
          </a>
        );
      })}
    </Wrapper>
  );
};
