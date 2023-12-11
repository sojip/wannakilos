import { FilePondFile } from "filepond";
import { storage, db } from "components/utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { QuerySnapshot } from "@firebase/firestore-types";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export function storeFileAndGetUrl(
  item: FilePondFile,
  uid: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    let fileRef = ref(storage, `${uid}/claimsfiles/${item.file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, item.file);
    uploadTask.on(
      "state_changed",
      (snapshot: QuerySnapshot) => {},
      (error: unknown) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
          resolve(downloadURL);
        });
      }
    );
  });
}

export async function createSupportRequest(uid: string, summary: string) {
  try {
    const request = await addDoc(collection(db, "supportRequests"), {
      uid: uid,
      summary: summary,
      updatedAt: serverTimestamp(),
    });
    return request;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function updateRequestDetails(
  rid: string,
  description: string,
  files: string[]
) {
  try {
    await addDoc(collection(db, "supportRequests", rid, "details"), {
      description: description,
      files: [...files],
      timestamp: serverTimestamp(),
    });
    return;
  } catch (e) {
    throw new Error(e.message);
  }
}
