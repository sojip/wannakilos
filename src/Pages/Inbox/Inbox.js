import "./Inbox.css";
import { useEffect, useState, useRef } from "react";
import { useAuthContext } from "components/auth/useAuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
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
import { Routes, Route } from "react-router-dom";
import InboxIndex from "./InboxIndex";
import BackIcon from "../../img/arrow-left.png";

const Inbox = (props) => {
  const { user } = useAuthContext();
  const [chatrooms, setchatrooms] = useState([]);
  const [dbchatrooms, setdbchatrooms] = useState([]);
  const pathname = useLocation().pathname;
  const roomViewURLmatch = matchPath({ path: "/inbox/:id" }, pathname);

  useEffect(() => {
    function getchatRooms(uid) {
      const chatroomsquery = query(
        collection(db, "chatrooms"),
        where("users", "array-contains", uid),
        orderBy("timestamp", "desc")
      );

      const unsubscribechatrooms = onSnapshot(
        chatroomsquery,
        (querySnapshot) => {
          const chatrooms = [];
          querySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === true) return;
            let chatroom = doc.data();
            chatrooms.push({
              ...chatroom,
              id: doc.id,
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

    const unsubscribechatrooms = getchatRooms(user?.id);

    return () => {
      unsubscribechatrooms();
    };
  }, []);

  useEffect(() => {
    let controller = new AbortController();
    let signal = controller.signal;

    async function getUserDatas(uid) {
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
          let chatPersonId = chatroom.users.find((id) => id !== user.id);
          return getUserDatas(chatPersonId, { signal: signal });
        })
      )
        .then((userdatas) => {
          return dbchatrooms.map((chatroom) => {
            let chatPersonId = chatroom.users.find((id) => id !== user.id);
            let chatPersonIndex = chatroom.users.findIndex(
              (element) => element === chatPersonId
            );
            let chatroomIndex = dbchatrooms.findIndex(
              (element) => element.id === chatroom.id
            );
            chatroom.users[chatPersonIndex] = userdatas[chatroomIndex];
            return chatroom;
          });
        })
        .then((chatrooms) => setchatrooms([...chatrooms]))
        .catch((e) => {
          throw new Error(e.message);
        });
    }
    return () => {
      controller.abort();
    };
  }, [dbchatrooms]);

  useEffect(() => {
    let mediaQuery = window.matchMedia("(max-width: 700px)");
    //execute on mount the first time
    handleMobileView(mediaQuery);
    //add listen
    mediaQuery.addListener(handleMobileView);

    function handleMobileView(q) {
      if (q.matches) {
        // mobile version
        if (roomViewURLmatch === null) {
          //hide roomView if the url is not inbox/:id
          document.querySelector(".roomView").style.display = "none";
        } else {
          // if the url match show roomView
          document.querySelector(".roomView").style.display = "block";
        }
      } else {
        document.querySelector(".roomView").style.display = "block";
      }
    }
    return () => {
      mediaQuery.removeListener(handleMobileView);
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

const Chatroom = (props) => {
  const user = useAuthContext();
  const { chatroom, style } = props;
  const chatPerson = chatroom.users.find((element) => element !== user.id);
  const [lastMessage, setLastMessage] = useState("");
  const [unreadMessages, setunreadMessages] = useState([]);

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
          setLastMessage(doc.data());
        });
      }
    );
    const unreadMessagesQuery = query(
      collection(db, "chatrooms", chatroom.id, "messages"),
      where("read", "==", false),
      where("from", "!=", user.id)
    );
    const unreadMessagesunsubscribe = onSnapshot(
      unreadMessagesQuery,
      (querySnapshot) => {
        const unreadMessages = [];
        querySnapshot.forEach((doc) => {
          unreadMessages.push({
            ...doc.data(),
            id: doc.id,
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
      // style={style}
    >
      <img className="chatPersonPhoto" src={chatPerson.photo} alt="profile" />
      <div>
        <div className="chatPersonName">
          {chatPerson.firstName} {chatPerson.lastName}
        </div>
        <div className="last-message">
          {lastMessage !== "" ? lastMessage.text : "You Can Exhange Now"}
        </div>
        {unreadMessages.length > 0 && (
          <div className="unreadCount">{unreadMessages.length}</div>
        )}
      </div>
    </NavLink>
  );
};

const Room = (props) => {
  const { id } = useParams();
  const user = useAuthContext();
  const [userMessage, setuserMessage] = useState("");
  const [chatPerson, setchatPerson] = useState({});
  const [messages, setmessages] = useState([]);
  const bottomRef = useRef(null);
  const [showBackIcon, setshowBackIcon] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getChatRoomInfos(rid) {
      const docRef = doc(db, "chatrooms", rid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
      return;
    }

    async function getChatPersonInfos(users) {
      const chatPersonId = users.find((id) => id !== user.id);
      const docRef = doc(db, "users", chatPersonId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
      return;
    }

    function getMessages(rid) {
      const messagesQuery = query(
        collection(db, "chatrooms", rid, "messages"),
        orderBy("timestamp")
      );

      const unsubscribe = onSnapshot(
        messagesQuery,
        { includeMetadataChanges: true },
        (querySnapshot) => {
          const messages = [];
          querySnapshot.forEach((doc) => {
            if (doc.metadata.hasPendingWrites === true) return;
            messages.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setmessages(messages);
        }
      );
      return unsubscribe;
    }
    const messagesUnsubscribe = getMessages(id);

    getChatRoomInfos(id)
      .then((chatroom) => getChatPersonInfos(chatroom.users))
      .then((chatPerson) => {
        setchatPerson({ ...chatPerson });
      });

    let mediaQuery = window.matchMedia("(max-width: 700px)");
    handleMobileView(mediaQuery);
    mediaQuery.addListener(handleMobileView);

    function handleMobileView(q) {
      if (q.matches) {
        setshowBackIcon(true);
      } else {
        setshowBackIcon(false);
      }
    }
    return () => {
      messagesUnsubscribe();
      mediaQuery.removeListener(handleMobileView);
    };
  }, [id]);

  useEffect(() => {
    async function updateReadStatus(message) {
      const messageRef = doc(db, "chatrooms", id, "messages", message.id);
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
      (message) => message.read === false && message.from !== user.id
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

  async function handleSubmitMessage(e) {
    e.preventDefault();
    let message = userMessage;
    if (message === "") return;
    const messagesRef = collection(db, "chatrooms", id, "messages");
    const chatroomRef = doc(db, "chatrooms", id);
    try {
      await Promise.all([
        addDoc(messagesRef, {
          from: user.id,
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

  const handleChange = (e) => setuserMessage(e.target.value);
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
        <div className="chatPersonName">
          {chatPerson?.firstName} {chatPerson?.lastName}
        </div>
        <div className="status"></div>
      </div>
      {messages.length > 0 ? (
        <div className="messagesWrapper">
          {messages.map((message) => {
            return <Message key={message.id} message={message} />;
          })}
          <div ref={bottomRef} />
        </div>
      ) : (
        <div className="startConversation">
          Start Conversation with {chatPerson.firstName}
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

const Message = (props) => {
  const user = useAuthContext();
  const { message } = props;
  return (
    <div
      className={message.from === user.id ? "message sent" : "message received"}
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
