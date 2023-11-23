import { Timestamp } from "@firebase/firestore-types";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "components/utils/firebase";

export type Request = {
  id: string;
  summary: string;
  description?: string;
  timestamp: Timestamp;
};

export async function getUserClaims(uid: string) {
  const claims: Request[] = [];
  const claimsQuery = query(
    collection(db, "supportRequests"),
    where("uid", "==", uid),
    orderBy("updatedAt", "desc")
  );
  const snapshot = await getDocs(claimsQuery);
  snapshot.forEach((doc: any) => {
    const data = doc.data();
    claims.push({
      id: doc.id,
      summary: data.summary,
      timestamp: data.timestamp,
    });
  });
  return claims;
}

export async function findDetails(req: Request) {
  let description = "";
  const descriptionQuery = query(
    collection(db, "supportRequests", req.id, "details"),
    orderBy("timestamp", "desc"),
    limit(1)
  );
  const snapshot = await getDocs(descriptionQuery);
  snapshot.forEach((doc: any) => {
    description = doc.data().description;
  });
  return { ...req, description };
}
