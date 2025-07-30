// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// It's good practice to check if window is defined before calling getAnalytics
// to avoid errors during server-side rendering.
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;


export { app, db, storage, analytics };
