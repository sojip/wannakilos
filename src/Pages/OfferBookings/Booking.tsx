import React from "react";
import styled from "styled-components";
import {
  CardOption,
  Links,
  Row,
  Wrapper as wrapper,
  Body,
  Name,
  Value,
  List,
  ListOption,
} from "components/Card";

type Row_ = [string, string] | [string, string[]];

interface BookingCardProps {
  $animationOrder?: number;
  header?: Row_;
  rows: Row_[];
  links?: React.JSX.Element[];
  option?: React.JSX.Element | string;
}

const Wrapper = styled(wrapper)`
  background-color: white;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  const { $animationOrder, header, rows, links, option } = props;
  return (
    <>
      <Wrapper $order={$animationOrder}>
        {header !== undefined && (
          <Header>
            <div>
              <Img src={header[0]} alt="" />
            </div>
            <div>
              <span>{header[1][0]}</span>
              <span>{header[1][1]}</span>
            </div>
          </Header>
        )}
        <Body>
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
