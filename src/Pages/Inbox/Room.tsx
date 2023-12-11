import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "components/auth/useAuthContext";
import { useState, useRef, useEffect } from "react";
import { Message, ChatUser } from "./type";
import { useLocation } from "react-router-dom";
import { addNewMessage, getMessages, updateReadStatus } from "./utils";
import SendIcon from "../../img/send.png";
import BackIcon from "../../img/arrow-left.png";
import TextField from "@mui/material/TextField";
import styled from "styled-components";
import { MessageItem } from "./Message";
import { Infos } from "Pages/SendPackage/SendPackage";
import { Photo, Img } from "./Chatroom";
import { Button } from "@mui/material";

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  overflow-y: hidden;
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  @media screen and (max-width: 700px) {
    border-radius: 10px;
    background-color: white;
  }
`;

const Header = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 5px;
  background-color: rgba(30, 58, 138, 0.1);
`;

const Name = styled.div`
  font-weight: bold;
  text-transform: capitalize;
`;

const Messages = styled.div`
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 5px;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 15px;
  padding-top: 10px;
  @media screen and (max-width: 700px) {
    padding: 10px;
  }
`;

const Icon = styled.img`
  display: none;
  @media screen and (max-width: 700px) {
    display: block;
  }
`;

export const Room = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const chatUser: ChatUser = location.state;
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesUnsubscribe = getMessages(id as string, setMessages);
    return () => {
      messagesUnsubscribe();
    };
  }, [id]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    //set read to true on all unread messages
    const unreadMessages = messages.filter(
      (message) => message.from !== user?.id && message.read === false
    );
    if (unreadMessages.length > 0) {
      try {
        Promise.all(
          unreadMessages.map((message) => {
            return updateReadStatus(id as string, message);
          })
        );
      } catch (e) {
        alert(e);
      }
    }
  }, [messages]);

  async function handleSubmitMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let message = userMessage;
    if (message === "") return;
    try {
      await addNewMessage(id as string, {
        from: user?.id as string,
        text: message,
      });
    } catch (e) {
      alert(e.message);
    }
    setUserMessage("");
    return;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserMessage(e.target.value);

  return (
    <Wrapper>
      <Header>
        <Icon
          onClick={() => {
            navigate(-1);
          }}
          src={BackIcon}
          alt=""
        />
        <Photo>
          <Img src={chatUser?.photo} alt="profile" />
        </Photo>
        <Name>{chatUser?.name}</Name>
      </Header>
      {messages.length > 0 ? (
        <Messages>
          {messages.map((message) => {
            return <MessageItem key={message.id} message={message} />;
          })}
          <div ref={bottomRef} />
        </Messages>
      ) : (
        <Infos>Start Conversation with {chatUser.name}</Infos>
      )}

      <Form onSubmit={handleSubmitMessage}>
        <TextField
          id="user-message"
          multiline
          maxRows={2}
          fullWidth
          value={userMessage}
          onChange={handleChange}
          placeholder="Type a message"
        />
        <Button type="submit">
          <img src={SendIcon} alt="" />
        </Button>
      </Form>
    </Wrapper>
  );
};
