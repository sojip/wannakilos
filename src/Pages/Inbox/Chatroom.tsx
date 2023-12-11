import React, { useState, useEffect } from "react";
import { ChatRoomProps, Message } from "./type";
import { useAuthContext } from "components/auth/useAuthContext";
import { db } from "components/utils/firebase";
import {
  query,
  collection,
  orderBy,
  limit,
  onSnapshot,
  where,
} from "firebase/firestore";
import { QuerySnapshot } from "@firebase/firestore-types";
import { NavLink, createSearchParams } from "react-router-dom";
import styled from "styled-components";
import { fadeIn } from "components/DashboardForm";

const Link = styled(NavLink)<{ $animationOrder: number }>`
  position: relative;
  opacity: 0;
  right: -100%;
  animation: ${fadeIn} 400ms cubic-bezier(0.25, 0.1, 0.25, 1)
    calc(${(props) => props.$animationOrder} * 100ms) forwards;
  display: flex;
  align-items: center;
  gap: 5px;
  overflow: hidden;
  text-decoration: none;
  color: black;
  padding: 5px 40px 5px 5px;
  transition: all 300ms ease-in-out;
  & > div {
    overflow: hidden;
  }

  border-radius: 10px;
`;

export const Photo = styled.div`
  width: 50px;
  height: 50px;
`;

export const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const Name = styled.div`
  font-weight: bold;
  text-transform: capitalize;
`;

const Count = styled.div`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  width: 30px;
  height: 30px;
  font-family: var(--textFont);
  border-radius: 50%;
  background-color: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
`;

const LastMessage = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 5px;
`;
let activeStyle = {
  backgroundColor: "rgba(30, 58, 138, 0.1)",
};

export const Chatroom = ({ chatroom, $animationOrder }: ChatRoomProps) => {
  const { user } = useAuthContext();
  const chatUser = chatroom.users[1];
  const [lastMessage, setLastMessage] = useState("");
  const [unreadMessages, setunreadMessages] = useState<Message[]>([]);
  useEffect(() => {
    const lastMessageQuery = query(
      collection(db, "chatrooms", chatroom.id, "messages"),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const lastMessageunsubscribe = onSnapshot(
      lastMessageQuery,
      (querySnapshot: QuerySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === true) return;
          const data = doc.data();
          setLastMessage(data.text);
        });
      }
    );
    const unreadMessagesQuery = query(
      collection(db, "chatrooms", chatroom.id, "messages"),
      where("read", "==", false),
      where("from", "!=", user?.id)
    );
    const unreadMessagesunsubscribe = onSnapshot(
      unreadMessagesQuery,
      (querySnapshot: QuerySnapshot) => {
        const unreadMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          unreadMessages.push({
            id: doc.id,
            from: data.from,
            read: data.read,
            text: data.text,
            timestamp: data.timestamp,
          });
        });
        setunreadMessages(unreadMessages);
      }
    );
    return () => {
      lastMessageunsubscribe();
      unreadMessagesunsubscribe();
    };
  }, []);

  return (
    <Link
      $animationOrder={$animationOrder}
      to={`/inbox/${chatroom.id}`}
      state={chatUser}
      style={({ isActive }) => (isActive ? activeStyle : undefined)}
    >
      <Photo>
        <Img src={chatUser.photo} alt="profile" />
      </Photo>
      <div>
        <Name>{chatUser.name}</Name>
        <LastMessage>
          {lastMessage !== "" ? lastMessage : "You Can Exhange Now"}
        </LastMessage>
        {unreadMessages.length > 0 && <Count>{unreadMessages.length}</Count>}
      </div>
    </Link>
  );
};
