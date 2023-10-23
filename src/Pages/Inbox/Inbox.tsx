import React from "react";
import "./Inbox.css";
import { useEffect, useState, useRef } from "react";
import { useAuthContext } from "components/auth/useAuthContext";
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
import { db } from "../../components/utils/firebase";
import {
  Outlet,
  NavLink,
  useParams,
  useNavigate,
  matchPath,
  useLocation,
} from "react-router-dom";
import TextField from "@mui/material/TextField";
import SendIcon from "../../img/send.png";
import { DateTime } from "luxon";
import BackIcon from "../../img/arrow-left.png";
import { Timestamp } from "@firebase/firestore-types";

type DbChatRooms = {
  id: string;
  timestamp: Timestamp;
  users: (string | User)[];
};

type UIChatRooms = {
  id: string;
  users: (string | User)[];
  lastMessage?: string;
  unReadMessages?: string[];
};

type User = {
  name: string;
  photo: string;
};

const Inbox = () => {
  const { user } = useAuthContext();
  const uid = user?.id;
  const pathname = useLocation().pathname;
  const roomViewURLmatch = matchPath({ path: "/inbox/:id" }, pathname);
  const [chatrooms, setchatrooms] = useState<UIChatRooms[]>([]);
  const [dbchatrooms, setdbchatrooms] = useState<DbChatRooms[]>([]);

  useEffect(() => {
    function getchatRooms(uid: string) {
      const chatroomsquery = query(
        collection(db, "chatrooms"),
        where("users", "array-contains", uid),
        orderBy("timestamp", "desc")
      );

      const unsubscribechatrooms = onSnapshot(
        chatroomsquery,
        (querySnapshot) => {
          const chatrooms: DbChatRooms[] = [];
          querySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === true) return;
            let chatroom = doc.data();
            chatrooms.push({
              id: doc.id,
              users: chatroom.users,
              timestamp: chatroom.timestamp,
            });
          });
          setdbchatrooms([...chatrooms]);
        },
        (error) => {
          alert(error);
        }
      );
      return unsubscribechatrooms;
    }

    const unsubscribechatrooms = getchatRooms(uid as string);

    return () => {
      unsubscribechatrooms();
    };
  }, []);

  useEffect(() => {
    async function getUserDatas(uid: string) {
      const userRef = doc(db, "users", uid);
      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) return userSnap.data();
        throw new Error("No Document");
      } catch (e) {
        throw new Error(e.message);
      }
    }
    if (dbchatrooms.length > 0) {
      Promise.all(
        dbchatrooms.map((chatroom) => {
          let chatPersonId = chatroom.users.find((id) => id !== user?.id);
          return getUserDatas(chatPersonId as string);
        })
      )
        .then((userdatas) => {
          return dbchatrooms.map((chatroom) => {
            let chatPersonId = chatroom.users.find((id) => id !== user?.id);
            let chatPersonIndex = chatroom.users.findIndex(
              (element) => element === chatPersonId
            );
            let chatroomIndex = dbchatrooms.findIndex(
              (element) => element.id === chatroom.id
            );
            let chatPersonDoc = userdatas[chatroomIndex];
            chatroom.users[chatPersonIndex] = {
              name: `${chatPersonDoc.firstName} ${chatPersonDoc.lastName}`,
              photo: chatPersonDoc.photo as string,
            };
            // chatroom.users[chatPersonIndex] = {
            //   name: `${userdatas[chatroomIndex].firstName userdatas[chatroomIndex].lastName}`
            // }
            // userdatas[chatroomIndex];

            // chatroom.users[chatPersonIndex] = userdatas[chatroomIndex];
            return chatroom;
          });
        })
        .then((chatrooms) => setchatrooms([...chatrooms]))
        .catch((e) => {
          throw new Error(e.message);
        });
    }
    return () => {};
  }, [dbchatrooms]);

  useEffect(() => {
    let mediaQuery = window.matchMedia("(max-width: 700px)");
    //execute on mount the first time
    handleMobileView(mediaQuery);
    //add listen
    mediaQuery.addEventListener("change", handleMobileView);
    // mediaQuery.addListener(handleMobileView);

    function handleMobileView(e: MediaQueryListEvent | MediaQueryList) {
      const element = document.querySelector(".roomView") as HTMLElement;
      if (e.matches) {
        // mobile version
        if (roomViewURLmatch === null) {
          //hide roomView if the url is not inbox/:id
          element.style.display = "none";
          // document?.querySelector(".roomView")?.style?.display = "none";
        } else {
          // if the url match show roomView
          element.style.display = "block";
        }
      } else {
        element.style.display = "block";
      }
    }

    // function handleMobileView(q: MediaQueryList, ev: MediaQueryListEvent | undefined = undefined) {
    //    const element = document.querySelector(".roomView") as HTMLElement;
    //   if (q.matches) {
    //     // mobile version
    //     if (roomViewURLmatch === null) {
    //       //hide roomView if the url is not inbox/:id
    //       element.style.display = "none";
    //       // document?.querySelector(".roomView")?.style?.display = "none";
    //     } else {
    //       // if the url match show roomView
    //       element.style.display = "block";
    //     }
    //   } else {
    //     element.style.display = "block";
    //   }
    // }
    return () => {
      // mediaQuery.removeListener(handleMobileView);
      mediaQuery.removeEventListener("change", handleMobileView);
    };
  }, [roomViewURLmatch]);

  return (
    <div className="container" id="inboxContainer">
      <div className="chatrooms">
        {chatrooms.length > 0 ? (
          chatrooms.map((chatroom) => {
            return (
              <Chatroom
                key={chatroom.id}
                chatroom={chatroom}
                style={{ "--animationOrder": chatrooms.indexOf(chatroom) }}
              />
            );
          })
        ) : (
          <div>No Inbox Yet</div>
        )}
      </div>
      <div className="roomView">
        <Outlet />
      </div>
    </div>
  );
};

export default Inbox;

type ChatRoomProps = {
  chatroom: UIChatRooms;
  style: object;
};

type Message = {
  id: string;
  from: string;
  read: boolean;
  text: string;
  timestamp: Timestamp;
};

const Chatroom = (props: ChatRoomProps) => {
  const { user } = useAuthContext();
  // const { chatroom } = props;
  const { chatroom, style } = props;
  const chatPerson = chatroom.users.find(
    (element: User | string) => element !== user?.id
  ) as User;
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
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === true) return;
          const data = doc.data();
          setLastMessage(data.text);
          // setLastMessage(doc.data());
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
      (querySnapshot) => {
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

  let activeStyle = {
    backgroundColor: "rgba(30, 58, 138, 0.1)",
  };
  return (
    <NavLink
      to={`/inbox/${chatroom.id}`}
      className="chatroom"
      style={({ isActive }) => (isActive ? activeStyle : { ...style })}
    >
      <img className="chatPersonPhoto" src={chatPerson.photo} alt="profile" />
      <div>
        <div className="chatPersonName">{chatPerson.name}</div>
        <div className="last-message">
          {lastMessage !== "" ? lastMessage : "You Can Exhange Now"}
        </div>
        {unreadMessages.length > 0 && (
          <div className="unreadCount">{unreadMessages.length}</div>
        )}
      </div>
    </NavLink>
  );
};

const Room = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [userMessage, setuserMessage] = useState("");
  const [chatPerson, setchatPerson] = useState<User>({
    name: "",
    photo: "",
  });
  const [messages, setmessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showBackIcon, setshowBackIcon] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getChatRoomInfos(rid: string) {
      const docRef = doc(db, "chatrooms", rid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
      return;
    }

    async function getChatPersonInfos(users: string[]) {
      const chatPersonId = users.find((id) => id !== user?.id) as string;
      const docRef = doc(db, "users", chatPersonId);
      const docSnap = await getDoc(docRef);
      // if (docSnap.exists()) return docSnap.data();
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          name: `${data.firstName} ${data.lastName}`,
          photo: data.photo as string,
        };
      }

      return;
    }

    function getMessages(rid: string) {
      const messagesQuery = query(
        collection(db, "chatrooms", rid, "messages"),
        orderBy("timestamp")
      );

      const unsubscribe = onSnapshot(
        messagesQuery,
        { includeMetadataChanges: true },
        (querySnapshot) => {
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
          setmessages(messages);
        }
      );
      return unsubscribe;
    }
    const messagesUnsubscribe = getMessages(id as string);

    getChatRoomInfos(id as string)
      .then((chatroom) => getChatPersonInfos(chatroom?.users))
      .then((chatPerson) => {
        setchatPerson({ ...(chatPerson as User) });
      });

    let mediaQuery = window.matchMedia("(max-width: 700px)");
    handleMobileView(mediaQuery);
    mediaQuery.addEventListener("change", handleMobileView);

    function handleMobileView(e: MediaQueryListEvent | MediaQueryList) {
      if (e.matches) {
        setshowBackIcon(true);
      } else {
        setshowBackIcon(false);
      }
    }
    // mediaQuery.addListener(handleMobileView);

    // function handleMobileView(q) {
    //   if (q.matches) {
    //     setshowBackIcon(true);
    //   } else {
    //     setshowBackIcon(false);
    //   }
    // }
    return () => {
      messagesUnsubscribe();
      mediaQuery.removeEventListener("change", handleMobileView);
      // mediaQuery.removeListener(handleMobileView);
    };
  }, [id]);

  useEffect(() => {
    async function updateReadStatus(message: Message) {
      const messageRef = doc(
        db,
        "chatrooms",
        id as string,
        "messages",
        message.id as string
      );
      try {
        await updateDoc(messageRef, {
          read: true,
        });
      } catch (e) {
        throw new Error(e.message);
      }
    }
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    //set read to true on all unread messages
    const unreadMessages = messages.filter(
      (message) => message.read === false && message.from !== user?.id
    );
    if (unreadMessages.length > 0) {
      try {
        Promise.all(
          unreadMessages.map((message) => {
            return updateReadStatus(message);
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
    const messagesRef = collection(db, "chatrooms", id as string, "messages");
    const chatroomRef = doc(db, "chatrooms", id as string);
    try {
      await Promise.all([
        addDoc(messagesRef, {
          from: user?.id,
          text: message,
          timestamp: serverTimestamp(),
          read: false,
        }),
        updateDoc(chatroomRef, {
          timestamp: serverTimestamp(),
        }),
      ]);
    } catch (e) {
      alert("Error adding the new message and updating chatroom");
    }
    setuserMessage("");
    return;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setuserMessage(e.target.value);
  return (
    <div className="room">
      <div className="chatPersonInfos">
        {showBackIcon && (
          <img
            onClick={() => {
              navigate(-1);
            }}
            src={BackIcon}
            alt=""
          />
        )}
        <img
          src={chatPerson?.photo}
          alt="profile"
          className="chatPersonPhoto"
        />
        <div className="chatPersonName">{chatPerson?.name}</div>
        <div className="status"></div>
      </div>
      {messages.length > 0 ? (
        <div className="messagesWrapper">
          {messages.map((message) => {
            return <MessageItem key={message.id} message={message} />;
          })}
          <div ref={bottomRef} />
        </div>
      ) : (
        <div className="startConversation">
          Start Conversation with {chatPerson.name}
        </div>
      )}
      <div className="message-input">
        <form onSubmit={handleSubmitMessage}>
          <TextField
            id="user-message"
            multiline
            maxRows={4}
            fullWidth
            value={userMessage}
            onChange={handleChange}
            placeholder="Type a message"
          />
          <button type="submit">
            <img src={SendIcon} alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

type messageItemProps = {
  message: Message;
};

const MessageItem = (props: messageItemProps) => {
  const { user } = useAuthContext();
  const { message } = props;
  return (
    <div
      className={
        message.from === user?.id ? "message sent" : "message received"
      }
    >
      <div>
        {DateTime.fromJSDate(message.timestamp.toDate()).toLocaleString(
          DateTime.DATETIME_MED
        )}
      </div>
      <div>{message.text}</div>
    </div>
  );
};

export { Room };
