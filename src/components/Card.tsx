import React, { ReactNode } from "react";
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

const Wrapper = styled.div<{
  $animationOrder: number;
  $primary?: boolean;
  $secondary?: boolean;
}>`
  background-color: ${(props) =>
    props.$secondary === true
      ? `var(--transparentBlue)`
      : props.$primary === true
      ? "white"
      : `var(--blue)`};
  position: relative;
  font-family: var(--textFont);
  padding: 10px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  animation: ${fadeIn} 350ms ease-in both;
  animation-delay: calc(${(props) => props.$animationOrder} * 100ms);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 10px;
  text-transform: capitalize;
`;

const Header = styled.div<{ $secondary?: boolean }>`
  display: grid;
  grid-template-columns: 1fr min-content 1fr;
  padding: 10px 5px;
  color: ${(props) => (props.$secondary ? "black" : "white")};
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

const Body = styled.div<{ $secondary?: boolean }>`
  background-color: ${(props) => (props.$secondary ? "transparent" : "white")};
  border-radius: 15px;
  color: black;
`;

const Name = styled.div`
  font-weight: bold;
  padding: 10px 0px 10px 5px;
  text-transform: capitalize;
`;

const Value = styled.div`
  padding: 10px 5px 10px 0;
`;

const Text = styled.div`
  padding: 10px 5px;
  text-transform: capitalize;
`;

const List = styled.ul`
  list-style-type: square;
  margin-top: 0;
  margin-bottom: 0;
`;

const ListOption = styled.li`
  padding: 3px 0;
`;

const Option = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  text-transform: capitalize;
  font-size: 0.8rem;
  font-weight: bold;
  & > * {
    flex: 1;
  }
`;

const Links = styled.div`
  padding: 15px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  & > * {
    flex: 1;
    display: flex;
  }
  & > *:last-child {
    justify-content: flex-end;
  }
`;

const Status = styled.div`
  color: var(--darkGreen);
  text-align: center;
  font-style: italic;
`;

export const Card = (props: {
  children: ReactNode;
  $animationOrder: number;
  $primary?: boolean;
  $secondary?: boolean;
}): JSX.Element => {
  return (
    <Wrapper
      $animationOrder={props.$animationOrder}
      $primary={props.$primary}
      $secondary={props.$secondary}
    >
      {props.children}
    </Wrapper>
  );
};

const CardHeader = (props: {
  value1: string;
  value2: string;
  Icon: React.JSX.Element;
  $secondary?: boolean;
}) => {
  return (
    <Header $secondary={props.$secondary}>
      <div>
        <span>{props.value1}</span>
      </div>
      {props.Icon}
      <div>
        <span>{props.value2}</span>
      </div>
    </Header>
  );
};

const CardBody = (props: { children: ReactNode; $secondary?: boolean }) => {
  return <Body $secondary={props.$secondary}>{props.children}</Body>;
};

const CardRow = (props: { name: string; value: string | number }) => {
  return (
    <Row>
      <Name>{props.name}</Name>
      <Value>{props.value}</Value>
    </Row>
  );
};

const CardList = (props: { name: string; values: string[] }) => {
  return (
    <>
      <Name>{props.name}</Name>
      <List>
        {props.values.map((val) => (
          <ListOption key={val}>{val}</ListOption>
        ))}
      </List>
    </>
  );
};

const CardLinks = (props: { children: ReactNode }) => {
  return <Links>{props.children}</Links>;
};

const CardText = (props: { title: string; text: string }) => {
  return (
    <>
      <Name>{props.title}</Name>
      <Text>{props.text}</Text>
    </>
  );
};

export const CardOption = (props: { children: ReactNode }) => {
  return <Option>{props.children}</Option>;
};

export const CardStatus = (props: {
  status:
    | "pending..."
    | "waiting for prepayment..."
    | "waiting for delivery..."
    | "delivered";
}) => {
  return <Status>{props.status}</Status>;
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Row = CardRow;
Card.List = CardList;
Card.Links = CardLinks;
Card.Text = CardText;
