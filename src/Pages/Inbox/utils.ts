import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDoc,
  doc,
  serverTimestamp,
  addDoc,
  limit,
  updateDoc,
} from "firebase/firestore";
import { db } from "components/utils/firebase";
import { QuerySnapshot, FirestoreError } from "@firebase/firestore-types";
import { DbChatRoom, ChatUser, UIChatRoom, Message } from "./type";

export function getDbChatrooms(
  uid: string,
  setChatrooms: React.Dispatch<React.SetStateAction<DbChatRoom[]>>,
  setStatus: React.Dispatch<
    React.SetStateAction<"searching" | "found" | "not found">
  >
) {
  const chatroomsquery = query(
    collection(db, "chatrooms"),
    where("users", "array-contains", uid),
    orderBy("timestamp", "desc")
  );

  const unsubscribeChatrooms = onSnapshot(
    chatroomsquery,
    (querySnapshot: QuerySnapshot) => {
      const chatrooms: DbChatRoom[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.metadata.hasPendingWrites === true) return;
        let chatroom = doc.data();
        chatrooms.push({
          id: doc.id,
          users: chatroom.users,
          timestamp: chatroom.timestamp,
        });
      });
      chatrooms.length > 0 ? setStatus("found") : setStatus("not found");
      setChatrooms([...chatrooms]);
    },
    (error: FirestoreError) => {
      alert(error);
    }
  );
  return unsubscribeChatrooms;
}

export async function getUserDatas(uid: string): Promise<ChatUser> {
  const userRef = doc(db, "users", uid);
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: uid,
        name: `${data.firstName} ${data.lastName}`,
        photo: data.photo,
      };
    }
    throw new Error("No User Document");
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function getChatUser(
  chatroom: DbChatRoom,
  uid: string
): Promise<UIChatRoom> {
  const chatUser = chatroom.users.find((element) => element !== uid);
  const data = await getUserDatas(chatUser as string);
  return {
    ...chatroom,
    users: [uid, data],
  };
}

export async function updateReadStatus(rid: string, message: Message) {
  const messageRef = doc(db, "chatrooms", rid, "messages", message.id);
  try {
    await updateDoc(messageRef, {
      read: true,
    });
  } catch (e) {
    throw new Error(e.message);
  }
}

export function getMessages(
  rid: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  const messagesQuery = query(
    collection(db, "chatrooms", rid, "messages"),
    orderBy("timestamp")
  );

  const unsubscribe = onSnapshot(
    messagesQuery,
    { includeMetadataChanges: true },
    (querySnapshot: QuerySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.metadata.hasPendingWrites === true) return;
        const data = doc.data();
        messages.push({
          // ...doc.data(),
          id: doc.id,
          from: data.from,
          read: data.read,
          text: data.text,
          timestamp: data.timestamp,
        });
      });
      setMessages(messages);
    }
  );
  return unsubscribe;
}

type NewMessage = {
  from: string;
  text: string;
};

export async function addNewMessage(rid: string, message: NewMessage) {
  const messagesRef = collection(db, "chatrooms", rid, "messages");
  const chatroomRef = doc(db, "chatrooms", rid);
  try {
    await Promise.all([
      addDoc(messagesRef, {
        from: message.from,
        text: message.text,
        timestamp: serverTimestamp(),
        read: false,
      }),
      updateDoc(chatroomRef, {
        timestamp: serverTimestamp(),
      }),
    ]);
  } catch (e) {
    throw new Error("An error occured");
  }
}
