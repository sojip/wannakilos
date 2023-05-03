import "./MyClaims.css";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import useAuthContext from "../../components/auth/useAuthContext";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

export const MyClaims = (props) => {
  let user = useAuthContext();
  const [requests, setrequests] = useState([]);

  async function getRequests() {
    const _requests = [];
    const requestsQuery = query(
      collection(db, "supportRequests"),
      where("uid", "==", user.id),
      orderBy("updatedAt")
    );
    const requestsSnapshot = await getDocs(requestsQuery);
    requestsSnapshot.forEach(async (doc) => {
      const _request = { ...doc.data(), id: doc.id };
      _requests.push(_request);
    });
    const requests = await Promise.all(
      _requests.map((_request) => addDescription(_request))
    );
    return requests;
  }

  async function addDescription(req) {
    let description;
    const descriptionQuery = query(
      collection(db, "supportRequests", req.id, "details"),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const descriptionSnapshot = await getDocs(descriptionQuery);
    descriptionSnapshot.forEach((doc) => {
      description = doc.data().description;
    });
    return { ...req, description };
  }

  useEffect(() => {
    getRequests()
      .then((requests) => setrequests(requests))
      .catch((e) => {
        toast.error(e.message);
      });
  }, []);

  return (
    <div className="container" id="myclaims">
      <ToastContainer />
      <h2>My Claims</h2>
      {requests.length > 0 ? (
        <div className="requestsWrapper">
          {requests.map((request) => (
            <Link
              to={`/myclaims/${request.id}`}
              className="request"
              key={requests.indexOf(request)}
            >
              <div>{request.summary}</div>
              <div>{request.description}</div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
};
