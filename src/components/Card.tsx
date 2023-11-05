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
const Wrapper = styled.div<{ $order: number; $secondary?: boolean }>`
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

const Row = styled.div<{ $fullWidth?: boolean }>`
  display: grid;
  padding: 10px 5px;
  grid-template-columns: ${(props) =>
    props.$fullWidth ? `1fr;` : `repeat(2, 1fr);`};
  column-gap: 10px;
`;

const Header = styled(Row)<{ $secondary?: boolean }>`
  display: grid;
  grid-template-columns: 1fr min-content 1fr;
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

const Body = styled.div<{ $secondary?: boolean }>`
  background-color: ${(props) =>
    props.$secondary === true ? `transparent` : "white"};
  border-radius: 15px;
  color: ${(props) => (props.$secondary === true ? "black" : "black")};
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

const CardOption = styled.div`
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

const Counter = styled.div`
  position: relative;
  bottom: 12px;
  color: var(--blue);
  font-weight: bold;
  font-size: 0.7rem;
`;

interface Row {
  name: string;
  value: string | string[];
  $fullWidth?: boolean;
}

type link = {
  to: string;
  value: string;
  count?: number;
};

interface CardProps {
  animationOrder: number;
  header: [string, string];
  rows: Row[];
  links?: link[];
  option?: link | string;
  $secondary?: boolean;
}

export const Card = (props: CardProps): JSX.Element => {
  const { animationOrder, header, rows, links, option, $secondary } = props;
  return (
    <>
      <Wrapper $order={animationOrder} $secondary={$secondary}>
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
              <Row key={rows.indexOf(row)} $fullWidth={row.$fullWidth}>
                <Name>{row.name}</Name>
                {typeof row.value === "string" ? (
                  <Value>{row.value}</Value>
                ) : (
                  <List>
                    {row.value.map((val) => (
                      <ListOption key={row.value.indexOf(val)}>
                        {val}
                      </ListOption>
                    ))}
                  </List>
                )}
              </Row>
            );
          })}
          {links?.length && (
            <Links>
              {links.map((link) => {
                return (
                  <div key={links.indexOf(link)}>
                    <Link to={link.to}>{link.value}</Link>
                    {link.count !== undefined && link.count > 0 && (
                      <Counter>{link.count}</Counter>
                    )}
                  </div>
                );
              })}
            </Links>
          )}
        </Body>
      </Wrapper>
      {option !== undefined && (
        <CardOption>
          {typeof option === "string" ? (
            <>{option}</>
          ) : (
            <Link to={option.to}>{option.value}</Link>
          )}
        </CardOption>
      )}
    </>
  );
};
