import React from "react";
import { useAuthContext } from "components/auth/useAuthContext";
import { MessageItemProps } from "./type";
import styled from "styled-components";
import { DateTime } from "luxon";
import { fadeIn } from "components/Card";

const Message = styled.div<{ $type: "sent" | "received" }>`
  position: relative;
  width: fit-content;
  width: -moz-fit-content;
  max-width: 300px;
  word-wrap: break-word;
  padding: 10px;
  border-radius: 10px;
  font-family: var(--textFont);
  color: white;
  & > div:first-child {
    font-style: italic;
    margin-bottom: 5px;
    font-size: 0.8rem;
  }
  animation: ${fadeIn} 350ms 200ms ease-in both;
  ${(props) =>
    props.$type === "sent"
      ? `
        align-self: flex-end;
        background-color: var(--green);
      `
      : `background-color: var(--blue);
      `};
`;

export const MessageItem = (props: MessageItemProps) => {
  const { user } = useAuthContext();
  const { message } = props;
  return (
    <Message $type={message.from === user?.id ? "sent" : "received"}>
      <div>
        {DateTime.fromJSDate(message.timestamp.toDate()).toLocaleString(
          DateTime.DATETIME_MED
        )}
      </div>
      <div>{message.text}</div>
    </Message>
  );
};
