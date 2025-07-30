// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwGe_wu3VS0HlaQ3TPHRAcwu4qKj679wA",
  authDomain: "gasygo-88285.firebaseapp.com",
  projectId: "gasygo-88285",
  storageBucket: "gasygo-88285.appspot.com",
  messagingSenderId: "622199370532",
  appId: "1:622199370532:web:e3d64dfd509becf1f179b1",
  measurementId: "G-TK3WJTE6S1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, db, storage, analytics };
