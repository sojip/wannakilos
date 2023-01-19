import "./Inbox.css";
import { useEffect, useState } from "react";
import useAuthContext from "../../components/auth/useAuthContext";
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
} from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import { Outlet, NavLink, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import SendIcon from "../../img/send.png";
import { DateTime } from "luxon";

const Inbox = (props) => {
  const user = useAuthContext();
  const [chatrooms, setchatrooms] = useState([]);

  useEffect(() => {
    async function getchatRooms(uid) {
      let chatrooms = [];
      const q = query(
        collection(db, "chatrooms"),
        where("users", "array-contains", uid),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let chatroom = doc.data();
        chatrooms.push({
          ...chatroom,
          id: doc.id,
        });
      });
      return chatrooms;
    }

    async function getUserDatas(uid) {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) return userSnap.data();
      return;
    }

    getchatRooms(user?.id)
      .then(async (chatrooms) => {
        let userDatasRequests = chatrooms.map((chatroom) =>
          getUserDatas(chatroom.users.find((id) => id !== user.id))
        );

        let userDatas = await Promise.all(userDatasRequests);
        return chatrooms.map((chatroom) => {
          let index = chatroom.users.indexOf(
            chatroom.users.find((id) => id !== user.id)
          );
          chatroom.users[index] = userDatas[chatrooms.indexOf(chatroom)];
          return chatroom;
        });
      })
      .then((chatrooms) => setchatrooms(chatrooms))
      .catch((e) => alert(e));
  }, []);

  return (
    <div className="container" id="inboxContainer">
      <div className="chatrooms">
        {chatrooms.map((chatroom) => {
          return <Chatroom key={chatroom.id} chatroom={chatroom} />;
        })}
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
  const { chatroom } = props;
  const chatPerson = chatroom.users.find((element) => element !== user.id);

  let activeStyle = {
    backgroundColor: "rgba(30, 58, 138, 0.1)",
  };
  return (
    <NavLink
      to={`/inbox/${chatroom.id}`}
      className="chatroom"
      style={({ isActive }) => (isActive ? activeStyle : undefined)}
    >
      <img className="chatPersonPhoto" src={chatPerson.photo} alt="profile" />
      <div>
        <div className="chatPersonName">
          {chatPerson.firstName} {chatPerson.lastName}
        </div>
        <div className="last-message">
          {chatroom.messages
            ? chatroom.messages[-1].text
            : "You Can Exhange Now"}
        </div>
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
      const chatPerson = users.find((id) => id !== user.id);
      const docRef = doc(db, "users", chatPerson);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
      return;
    }

    function getMessages(rid) {
      const messagesQuery = query(
        collection(db, "chatrooms", rid, "messages"),
        orderBy("timestamp")
      );

      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === true) return;
          messages.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setmessages(messages);
      });
      return unsubscribe;
    }
    const messageUnsubscribe = getMessages(id);

    getChatRoomInfos(id, { signal: signal })
      .then((chatroom) =>
        getChatPersonInfos(chatroom.users, { signal: signal })
      )
      .then((chatPerson) => {
        console.log(chatPerson);
        setchatPerson({ ...chatPerson });
      });
    return () => {
      controller.abort();
      messageUnsubscribe();
    };
  }, []);

  async function handleSubmitMessage(e) {
    e.preventDefault();
    let message = userMessage;
    const messagesRef = collection(db, "chatrooms", id, "messages");
    const messageSnap = await addDoc(messagesRef, {
      from: user.id,
      text: message,
      timestamp: serverTimestamp(),
    });
    console.log(messageSnap);
    setuserMessage("");
    return;
  }

  const handleChange = (e) => setuserMessage(e.target.value);
  return (
    <div className="room">
      <div className="chatPersonInfos">
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
            return <Message key={message.id} message={message} user={user} />;
          })}
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
  const { message, user } = props;
  return (
    <div
      className={message.from === user.id ? "message sent" : "message received"}
    >
      <div>
        {" "}
        sent on{" "}
        {/* {DateTime.fromString(message.timestamp).toLocaleString(
          DateTime.DATE_MED
        )} */}
      </div>
      <div>{message.text}</div>
    </div>
  );
};

export { Room };
