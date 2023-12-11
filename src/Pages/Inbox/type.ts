import { Timestamp } from "@firebase/firestore-types";

export type DbChatRoom = {
  id: string;
  timestamp: Timestamp;
  users: [string, string];
};

export type UIChatRoom = {
  id: string;
  users: [string, ChatUser];
  lastMessage?: string;
  unReadMessages?: string[];
};

export type ChatUser = {
  id: string;
  name: string;
  photo: string;
};

export type ChatRoomProps = {
  chatroom: UIChatRoom;
  $animationOrder: number;
};

export type Message = {
  id: string;
  from: string;
  read: boolean;
  text: string;
  timestamp: Timestamp;
};

export type MessageItemProps = {
  message: Message;
};
