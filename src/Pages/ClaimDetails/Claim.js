import "./Claim.css";
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
import useAuthContext from "../../components/auth/useAuthContext";
import { DateTime } from "luxon";

export const Claim = (props) => {
  const { id } = useParams();
  const user = useAuthContext();
  const [request, setrequest] = useState({});
  const [details, setdetails] = useState([]);
  const [addMessage, setaddMessage] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const collectionRef = collection(db, "supportRequests", id, "details");
    const detailsQuery = query(collectionRef, orderBy("timestamp"));

    async function getRequest(id) {
      const requestRef = doc(db, "supportRequests", id);
      const docSnap = await getDoc(requestRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // docSnap.data() will be undefined in this case
        throw new Error("No Such Document");
      }
    }

    const unsub = onSnapshot(
      detailsQuery,
      { includeMetadataChanges: true },
      (querySnapshot) => {
        const _details = [];
        querySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === true) return;
          console.log(doc.data());
          _details.push({ id: doc.id, ...doc.data() });
        });
        setdetails([..._details]);
      }
    );

    getRequest(id)
      .then((request) => setrequest(request))
      .catch((e) => {
        toast.error(e.message);
      });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [addMessage]);

  return (
    <div className="container" id="requests">
      <ToastContainer />
      <h2>{request?.summary}</h2>
      {details.map((request) => {
        return (
          <div className="request" key={details.indexOf(request)}>
            <div className="from">
              {request.fromSupport === true ? "Support" : user.name}
            </div>
            <div className="date">
              {DateTime.fromJSDate(request.timestamp.toDate()).toLocaleString(
                DateTime.DATETIME_MED
              )}
            </div>
            <p>{request.description}</p>
            {request.files?.map((file) => {
              return (
                <a
                  href={file}
                  target="blank_"
                  key={request.files?.indexOf(file)}
                >
                  <img src={file} alt="" className="file-preview" />;
                </a>
              );
            })}
          </div>
        );
      })}
      {addMessage === true ? (
        <>
          <div className="message" contentEditable={true}></div>
          <div className="message-icons">
            <button>Send</button>
            <i
              className="fa-solid fa-trash fa-xl cancel"
              onClick={() => {
                setaddMessage(false);
              }}
            ></i>
          </div>
          <div ref={bottomRef} />
        </>
      ) : (
        <button
          id="addMessage"
          onClick={() => {
            setaddMessage(true);
          }}
        >
          Add A Message
        </button>
      )}
    </div>
  );
};
