import React from "react";
import { Offer } from "./SendPackage";
import Airplane from "../../img/airplane-takeoff.png";
import { DateTime } from "luxon";
import { Link } from "../../components/Link";
import styled, { keyframes } from "styled-components";

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 20%, 0);
    -webkit-transform: translate3d(0, 20%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
  }
`;
const Card = styled.div<{ $order: number }>`
  background-color: var(--blue);
  position: relative;
  font-family: var(--textFont);
  padding: 10px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  animation: ${fadeIn} 350ms ease-in both;
  animation-delay: calc(${(props) => props.$order} * 100ms);
`;

const Row = styled.div<{ $fullWidth?: boolean }>`
  display: grid;
  padding: 10px 5px;
  grid-template-columns: ${(props) =>
    props.$fullWidth ? `1fr;` : `repeat(2, 1fr);`};
  column-gap: 10px;
`;

const Header = styled(Row)`
  display: grid;
  grid-template-columns: 1fr min-content 1fr;
  color: white;
  font-weight: bold;
  text-transform: capitalize;
  & > :first-child {
    display: flex;
    align-items: center;
    min-width: 0;
  }
  & > :last-child {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 0;
  }
  & span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Icon = styled.img``;

const Body = styled.div`
  background-color: white;
  border-radius: 15px;
`;

const Name = styled.div`
  font-weight: bold;
  text-transform: capitalize;
`;

const Value = styled.div``;

const List = styled.ul`
  list-style-type: square;
`;

const ListOption = styled.li``;

const CardOptions = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 15px;
  display: flex;
  & > * {
    flex: 1;
  }
`;

interface CardProps extends Offer {
  animationOrder: number;
}

export const OfferCard = (props: CardProps) => {
  return (
    <>
      <Card $order={props.animationOrder}>
        <Header>
          <div>
            <span>{props.departurePoint}</span>
          </div>
          <Icon src={Airplane} alt="" />
          <div>
            <span>{props.arrivalPoint}</span>
          </div>
        </Header>
        <Body>
          <Row>
            <Name>Number of Kilos</Name>
            <Value>{props.numberOfKilos}</Value>
          </Row>
          <Row>
            <Name>Price</Name>
            <Value>
              {props.price} {props.currency}/Kg
            </Value>
          </Row>
          <Row $fullWidth={true}>
            <Name>Goods accepted</Name>
            <List>
              {props.goods.map((good) => (
                <ListOption key={props.goods.indexOf(good)}>{good}</ListOption>
              ))}
            </List>
          </Row>
          <Row>
            <Name>Departure date</Name>
            <Value>
              {DateTime.fromISO(props.departureDate).toLocaleString(
                DateTime.DATE_MED
              )}
            </Value>
          </Row>
          <Row>
            <Name>arrival date</Name>
            <Value>
              {DateTime.fromISO(props.arrivalDate).toLocaleString(
                DateTime.DATE_MED
              )}
            </Value>
          </Row>
        </Body>
      </Card>
      <CardOptions>
        <Link to={`/book-offer/${props.id}`} id="bookOffer">
          Book this offer
        </Link>
      </CardOptions>
    </>
  );
};
