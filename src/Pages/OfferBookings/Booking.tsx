import React from "react";
import styled from "styled-components";
import { CardOption, Card, CardStatus } from "components/Card";
import { Booking } from "./types";
import { Button } from "components/Button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "components/utils/firebase";

interface BookingCardProps extends Booking {
  $animationOrder: number;
}

const Header = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  text-transform: capitalize;
  & > * {
    min-width: 0;
  }
  & > :last-child {
    display: grid;
    grid-template-columms: 1fr;
    &>: first-child {
      align-self: center;
    }
  }
  & span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
const Img = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
`;

export const BookingCard = (props: BookingCardProps) => {
  const handleAcceptBooking = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    let target = e.target as HTMLButtonElement;
    target.textContent = "waiting...";
    target.style.color = "black";
    let docRef = doc(db, "bookings", id);
    try {
      await updateDoc(docRef, { status: "accepted" });
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
      <Card $primary $animationOrder={props.$animationOrder}>
        <Header>
          <div>
            <Img src={props.uPhoto} alt="" />
          </div>
          <div>
            <span>{props.uFirstName}</span>
            <span>{props.uLastName}</span>
          </div>
        </Header>
        <Card.Body>
          <Card.List name={"goods"} values={props.goods} />
          <Card.Row name={"number of kilos"} value={`${props.numberOfKilos}`} />
          <Card.Text title={"details"} text={`${props.bookingDetails}`} />
          <Card.Row
            name={"total"}
            value={`${props.price * props.numberOfKilos} ${props.currency}`}
          />
        </Card.Body>
      </Card>
      <CardOption>
        {props.status === "pending" ? (
          <Button
            onClick={(e) => {
              handleAcceptBooking(e, props.id);
            }}
            value="accept"
          />
        ) : (
          <CardStatus
            status={
              props.status === "accepted"
                ? "waiting for prepayment..."
                : props.status === "prepaid"
                ? "waiting for delivery..."
                : "delivered"
            }
          />
        )}
      </CardOption>
    </>
  );
};
