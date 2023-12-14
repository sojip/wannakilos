import styled from "styled-components";
import React from "react";
import { Booking, Offer } from "./type";
import { DateTime } from "luxon";

type Recap = Offer & Booking;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background-color: white;
  border-radius: 10px;
  padding: 15px 20px;
  text-transform: capitalize;
  & > h2 {
    grid-column: span 2;
  }
`;

const Name = styled.div<{ $span?: number }>`
  padding: 10px 0px 10px 0px;
  font-weight: bold;
  grid-column: ${(props) => (props.$span ? `span ${props.$span}` : "span 1")};
`;
const Value = styled.div<{ $span?: number }>`
  padding: 10px 0px 10px 0px;
  grid-column: ${(props) => (props.$span ? `span ${props.$span}` : "span 1")};
`;

const List = styled.ul`
  list-style-type: square;
  display: flex;
  gap: 25px;
`;

const ListOption = styled.li``;

export const Recap = (props: Recap) => {
  return (
    <Wrapper>
      <h2>Prepayment Recap</h2>
      <Name>departure</Name>
      <Value>{props.departurePoint}</Value>
      <Name>arrival</Name>
      <Value>{props.arrivalPoint}</Value>
      <Name>departure date</Name>
      <Value>
        {DateTime.fromISO(props.departureDate).toLocaleString(
          DateTime.DATE_MED
        )}
      </Value>
      <Name>arrival date</Name>
      <Value>
        {DateTime.fromISO(props.arrivalDate).toLocaleString(DateTime.DATE_MED)}
      </Value>
      <Name>number of kilos</Name>
      <Value>{props.numberOfKilos}</Value>
      <Name>price/kg</Name>
      <Value>{`${props.price} ${props.currency}`}</Value>
      <Name>departure</Name>
      <Name $span={2}>goods</Name>
      <List>
        {props.goods.map((good) => (
          <ListOption key={good}>{good}</ListOption>
        ))}
      </List>
      <Name $span={2}>details</Name>
      <Value $span={2}>{props.bookingDetails}</Value>
      <Name>total</Name>
      <Value>{`${props.numberOfKilos * props.price} ${props.currency}`}</Value>
    </Wrapper>
  );
};
