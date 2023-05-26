import "./Claim.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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

    // async function getDetails(id) {
    //   console.log(id);
    //   const details = [];
    //   const collectionRef = collection(db, "supportRequests", id, "details");
    //   const detailsQuery = query(collectionRef, orderBy("timestamp"));
    //   const querySnapshot = await getDocs(detailsQuery);
    //   querySnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     details.push({ id: doc.id, ...doc.data() });
    //   });
    //   return details;
    // }

    // getDetails(id).then((result) => console.log(result));
    console.log(user);

    return () => {
      unsub();
    };
  }, []);
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
                <a href={file} target="blank_">
                  <img src={file} alt="" className="file-preview" />;
                </a>
              );
            })}
          </div>
        );
      })}
      <button id="addMessage">Add A Message</button>
    </div>
  );
};
