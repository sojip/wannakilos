import React from "react";
import { Offer } from "./SendPackage";
import Airplane from "../../img/airplane-takeoff.png";
import { DateTime } from "luxon";
import { Link } from "../../components/Link";
import { Card, CardOption } from "components/Card";

interface CardProps extends Offer {
  $animationOrder: number;
}

export const OfferCard = (props: CardProps) => {
  return (
    <>
      <Card $animationOrder={props.$animationOrder}>
        <Card.Header
          value1={props.departurePoint}
          value2={props.arrivalPoint}
          Icon={<img src={Airplane} alt="" />}
        />
        <Card.Body>
          <Card.Row name={"number of kilos"} value={props.numberOfKilos} />
          <Card.Row
            name={"price"}
            value={`${props.price} ${props.currency}/Kg`}
          />
          <Card.List name={"goods accepted"} values={props.goods} />
          <Card.Row
            name={"departure date"}
            value={DateTime.fromISO(props.departureDate).toLocaleString(
              DateTime.DATE_MED
            )}
          />
          <Card.Row
            name={"arrival date"}
            value={DateTime.fromISO(props.arrivalDate).toLocaleString(
              DateTime.DATE_MED
            )}
          />
        </Card.Body>
      </Card>
      <CardOption>
        <Link to={`/book-offer/${props.id}`}>Book this offer</Link>
      </CardOption>
    </>
  );
};
