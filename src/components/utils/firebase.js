// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRbU1fUYTYXUNvHZiQmGGJFby0Pp1f2k0",
  authDomain: "wannakilos.firebaseapp.com",
  projectId: "wannakilos",
  storageBucket: "wannakilos.appspot.com",
  messagingSenderId: "844344683749",
  appId: "1:844344683749:web:bac69715445c484fd3380c",
  measurementId: "G-M67CVPFSJM",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage(firebaseApp);

export { db, storage };
export default firebaseApp;
