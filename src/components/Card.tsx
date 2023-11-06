import React from "react";
import Airplane from "../img/airplane-takeoff.png";
import { DateTime } from "luxon";
import { Link } from "./Link";
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
export const Wrapper = styled.div<{
  $order: number | undefined;
  $secondary?: boolean;
}>`
  background-color: ${(props) =>
    props.$secondary === true ? `var(--transparentBlue)` : `var(--blue)`};
  position: relative;
  font-family: var(--textFont);
  padding: 10px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  animation: ${fadeIn} 350ms ease-in both;
  animation-delay: calc(${(props) => props.$order} * 100ms);
`;

export const Row = styled.div<{ $fullWidth?: boolean }>`
  display: grid;
  // padding: 10px 5px;
  grid-template-columns: ${(props) =>
    props.$fullWidth ? `1fr;` : `repeat(2, 1fr);`};
  column-gap: 10px;
  text-transform: capitalize;
`;

const Header = styled(Row)<{ $secondary?: boolean }>`
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

const Icon = styled.img``;

export const Body = styled.div<{ $secondary?: boolean }>`
  background-color: ${(props) =>
    props.$secondary === true ? `transparent` : "white"};
  border-radius: 15px;
  color: ${(props) => (props.$secondary === true ? "black" : "black")};
`;

export const Name = styled.div`
  font-weight: bold;
  padding: 10px 5px;
`;

export const Value = styled.div`
  padding: 10px 5px;
`;

export const List = styled.ul`
  list-style-type: square;
`;

export const ListOption = styled.li``;

export const CardOption = styled.div`
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

export const Links = styled.div`
  padding: 20px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  & > * {
    flex: 1;
    display: flex;
  }
`;

export const Counter = styled.div`
  position: relative;
  bottom: 12px;
  color: var(--blue);
  font-weight: bold;
  font-size: 0.7rem;
`;

type Row = [string, string] | [string, string[]];

interface CardProps {
  $animationOrder: number;
  $secondary?: boolean;
  header: Row;
  rows: Row[];
  links?: React.JSX.Element[];
  option?: React.JSX.Element | string;
}

export const Card = (props: CardProps): JSX.Element => {
  const { $animationOrder, header, rows, links, option, $secondary } = props;
  return (
    <>
      <Wrapper $order={$animationOrder} $secondary={$secondary}>
        <Header $secondary={$secondary}>
          <div>
            <span>{header[0]}</span>
          </div>
          <Icon src={Airplane} alt="" />
          <div>
            <span>{header[1]}</span>
          </div>
        </Header>
        <Body $secondary={$secondary}>
          {rows.map((row) => {
            return (
              <Row
                key={rows.indexOf(row)}
                $fullWidth={typeof row[1] !== "string"}
              >
                <Name>{row[0]}</Name>
                {typeof row[1] === "string" ? (
                  <Value>{row[1]}</Value>
                ) : (
                  <List>
                    {row[1].map((val) => (
                      <ListOption key={row[1].indexOf(val)}>{val}</ListOption>
                    ))}
                  </List>
                )}
              </Row>
            );
          })}
          {links?.length && (
            <Links>
              {links.map((link) => {
                return <div key={links.indexOf(link)}>{link}</div>;
              })}
            </Links>
          )}
        </Body>
      </Wrapper>
      {option !== undefined && <CardOption>{option}</CardOption>}
    </>
  );
};
