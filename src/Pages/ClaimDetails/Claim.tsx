import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import { toast, ToastContainer } from "react-toastify";
import { useAuthContext } from "components/auth/useAuthContext";
import { QuerySnapshot, Timestamp } from "@firebase/firestore-types";
import { Content } from "components/DashboardContent";
import { Detail } from "./Request";
import { Button } from "components/Button";
import { NewMessage } from "./NewMessage";

export type Claim = {
  id: string;
  description: string;
  fromSupport: boolean;
  timestamp: Timestamp;
  files?: string[];
  username?: string;
};

type Request = {
  id: string;
  summary: string;
};

export const Claim = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [request, setRequest] = useState<Request | null>(null);
  const [details, setDetails] = useState<Claim[]>([]);
  const [addMessage, setAddMessage] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async function getRequest() {
      const requestRef = doc(db, "supportRequests", id as string);
      const docSnap = await getDoc(requestRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRequest({
          id: id as string,
          summary: data.summary,
        });
        return;
      } else {
        // docSnap.data() will be undefined in this case
        throw new Error("No Such Document");
      }
    })();

    const collectionRef = collection(db, "supportRequests", id, "details");
    const detailsQuery = query(collectionRef, orderBy("timestamp"));
    const unsub = onSnapshot(
      detailsQuery,
      { includeMetadataChanges: true },
      (querySnapshot: QuerySnapshot) => {
        const _details: Claim[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === true) return;
          const data = doc.data();
          _details.push({
            id: doc.id,
            description: data.description,
            fromSupport: data.fromSupport,
            timestamp: data.timestamp,
            files: data.files,
          });
        });
        setDetails([..._details]);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [addMessage]);

  return (
    <Content>
      <ToastContainer />
      <h2>{request?.summary}</h2>
      {details.map((request) => {
        return <Detail key={request.id} {...request} username={user?.name} />;
      })}
      {addMessage === true ? (
        <>
          <NewMessage
            setAddMessage={setAddMessage}
            setNewMessage={setNewMessage}
          />
          <div ref={bottomRef} />
        </>
      ) : (
        <Button
          onClick={() => {
            setAddMessage(true);
          }}
          value="Add A Message"
        />
      )}
    </Content>
  );
};
