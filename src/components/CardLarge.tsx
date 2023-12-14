import React, { Key } from "react";
import styled from "styled-components";
import { fadeIn } from "./Card";
import { useState } from "react";

const Wrapper = styled.div<{ $order: number }>`
  padding: 5px;
  z-index: 2;
  border-radius: 15px;
  background-color: white;
  color: black;
  animation: ${fadeIn} 350ms ease-in both;
  animation-delay: calc(${(props) => props.$order} * 100ms);
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  margin-bottom: 25px;
  &:first-of-type {
    margin-top: 25px;
  }
  @media screen and (max-width: 768px) {
    &:last-of-type {
      margin-bottom: calc(5vh + 25px);
    }
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr min-content 1fr;
  align-items: center;
  padding: 10px 5px;
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

const Icon = styled.i``;

const Body = styled.div``;

const List = styled.ul`
  margin-top: 5px;
  list-style-type: square;
  display: flex;
  gap: 25px;
  text-tranform: capitalize;
`;

const ListOption = styled.li``;

const Row = styled.div`
  display: flex;
  padding: 5px;
  & > * {
    flex: 1 1 auto;
  }
  & > :nth-child(2) {
    text-align: right;
  }
  column-gap: 10px;
  text-transform: capitalize;
  // &:nth-child(5) {
  //   font-weight: bold;
  // }
`;

const Value = styled.div``;
const Name = styled.div`
  padding: 5px;
  text-transform: capitalize;
  font-weight: bold;
`;

type HeaderProps = {
  value1: String;
  value2: string;
  Icon: React.JSX.Element;
};

type RowProps = {
  value1: String | React.JSX.Element;
  value2?: String | React.JSX.Element;
};

type ListProps = {
  name: String;
  values: string[];
};

type colNum = 1 | 2;

// type Row =
//   | [React.JSX.Element, React.JSX.Element, colNum?]
//   | [string, string, colNum?]
//   | [string, string[], colNum?];

type CardLargeProps = {
  $animationOrder: number;
  children?: React.ReactNode;
};

export const CardLarge = ({ children, $animationOrder }: CardLargeProps) => {
  return (
    <Wrapper $order={$animationOrder}>{children}</Wrapper>
    //   <Header>
    //     <div>
    //       <span>{header[0]}</span>
    //     </div>
    //     <Icon className="fa-solid fa-right-long"></Icon>
    //     <div>
    //       <span>{header[1]}</span>
    //     </div>
    //   </Header>
    //   <Body>
    //     {rows.map((row) => {
    //       return (
    //         <Row
    //           key={rows.indexOf(row)}
    //           $colNum={row.length === 3 ? row[2] : undefined}
    //         >
    //           <Value>{row[0]}</Value>
    //           {typeof row[1] === "string" && <Value>{row[1]}</Value>}
    //           {React.isValidElement(row[1]) === true && <Value>{row[1]}</Value>}
    //           {Array.isArray(row[1]) && (
    //             <List>
    //               {row[1].map((val) => (
    //                 <ListOption key={val}>{val}</ListOption>
    //               ))}
    //             </List>
    //           )}
    //         </Row>
    //       );
    //     })}
    //     {children}
    //   </Body>
  );
};

const CardHeader = ({ value1, value2, Icon }: HeaderProps) => {
  return (
    <Header>
      <div>
        <span>{value1}</span>
      </div>
      {Icon}
      <div>
        <span>{value2}</span>
      </div>
    </Header>
  );
};

const CardRow = ({ value1, value2 }: RowProps) => {
  return (
    <Row>
      <Value>{value1}</Value>
      {value2 && <Value>{value2}</Value>}
    </Row>
  );
};

const CardList = ({ name, values }: ListProps) => {
  return (
    <>
      <Name>{name}</Name>
      <List>
        {values.map((val) => (
          <ListOption key={val as Key}>{val}</ListOption>
        ))}
      </List>
    </>
  );
};

CardLarge.Header = CardHeader;
CardLarge.Row = CardRow;
CardLarge.List = CardList;
