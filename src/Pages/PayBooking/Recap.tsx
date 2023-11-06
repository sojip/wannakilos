import styled from "styled-components";
import React from "react";
import { Booking, Offer } from "./type";
import { Row as row, Name, Value } from "components/Card";

type Row = [string, string] | [string, string[]];

type RecapProps = {
  rows: Row[];
};

const Row = styled(row)`
  &: last-of-type {
    border-top: solid 2px #dbdbdc;
    font-weight: bold;
  }
`;

const Wrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  & > h2 {
    padding-left: 5px;
    padding-right: 5px;
  }
`;

const List = styled.ul`
  list-style-type: square;
  display: flex;
  gap: 25px;
`;

export const Recap = ({ rows }: RecapProps) => {
  const fullWidth = ["details"];

  return (
    <Wrapper>
      <h2>Prepayment Recap</h2>
      {rows.map((row) => {
        return (
          <Row
            key={rows.indexOf(row)}
            $fullWidth={
              typeof row[1] !== "string" || fullWidth.includes(row[0])
            }
          >
            <Name>{row[0]}</Name>
            {typeof row[1] === "string" ? (
              <Value>{row[1]}</Value>
            ) : (
              <List>
                {row[1].map((val) => (
                  <li key={row[1].indexOf(val)}>{val}</li>
                ))}
              </List>
            )}
          </Row>
        );
      })}
    </Wrapper>
  );
};
