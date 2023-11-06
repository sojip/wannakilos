import React from "react";
import styled from "styled-components";
import { Offer } from "./types";
import { DateTime } from "luxon";
import { fadeIn } from "components/DashboardForm";

const Wrapper = styled.div`
  background-color: var(--blue);
  position: relative;
  right: -700px;
  opacity: 0;
  border-radius: 15px;
  color: white;
  padding: 5px;
  animation: ${fadeIn} 400ms cubic-bezier(0.25, 0.1, 0.25, 1) 100ms forwards;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(385px, 1fr));
`;

const Col = styled.div<{ $fullWidth?: boolean }>`
  display: grid;
  padding: 10px;
  grid-template-columns: ${(props) =>
    props.$fullWidth ? `1fr` : `repeat(2, 1fr)`};
`;

const Name = styled.div`
  font-weight: bold;
  text-transform: capitalize;
`;

const Value = styled.div`
  font-style: italic;
  text-transform: uppercase;
`;

const List = styled.ul`
  display: flex;
  gap: 25px;
  list-style-type: square;
`;

type OfferCardProps = {
  offer: Offer;
};

export const OfferCard = ({ offer }: OfferCardProps): React.JSX.Element => {
  return (
    <Wrapper>
      <Row>
        <Col>
          <Name>departure</Name>
          <Value>{offer.departurePoint}</Value>
        </Col>
        <Col>
          <Name>arrival</Name>
          <Value>{offer.arrivalPoint}</Value>
        </Col>
      </Row>
      <Row>
        <Col>
          <Name>departure date</Name>
          <Value>
            {DateTime.fromISO(offer.departureDate).toLocaleString(
              DateTime.DATE_MED
            )}
          </Value>
        </Col>
        <Col>
          <Name>arrival date</Name>
          <Value>
            {DateTime.fromISO(offer.arrivalDate).toLocaleString(
              DateTime.DATE_MED
            )}
          </Value>
        </Col>
      </Row>
      <Row>
        <Col>
          <Name>number of kilos</Name>
          <Value>{offer.numberOfKilos}</Value>
        </Col>
        <Col>
          <Name>price/kg</Name>
          <Value>
            {offer.price} {offer.currency}
          </Value>
        </Col>
      </Row>
      <Row>
        <Col $fullWidth>
          <Name>goods accepted</Name>
          <List>
            {offer.goods.map((good) => {
              return <li key={good}>{good}</li>;
            })}
          </List>
        </Col>
      </Row>
    </Wrapper>
  );
};
