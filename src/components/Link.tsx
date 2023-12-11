import styled from "styled-components";
import { Link as link, LinkProps as linkProps } from "react-router-dom";
import React from "react";

const LINK = styled(link)<{
  $outline?: boolean;
  $hover?: boolean;
}>`
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: bold;
  border: ${(props) => (props.$outline ? "solid 2px var(--blue);" : "none;")}
  color: var(--blue);
  background-color: white;
  text-transform: uppercase;
  text-align: center;
  border-radius: 5px;
  transition: all 300ms ease-in-out;
    ${(props) =>
      props.$hover &&
      `&:hover {
    background-color: var(--blue);
    color: white;
  }`}
`;

interface LinkProps extends linkProps {
  $hover?: boolean;
  $outline?: boolean;
}
export const Link = (props: React.PropsWithChildren<LinkProps>) => {
  return <LINK {...props}>{props.children}</LINK>;
};
