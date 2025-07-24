// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-O1m3ERCCAW1RvUVqOWNtDBLk8itPJro",
  authDomain: "pumaly-milk.firebaseapp.com",
  projectId: "pumaly-milk",
  storageBucket: "pumaly-milk.appspot.com",
  messagingSenderId: "435321479368",
  appId: "1:435321479368:web:4050d57ee778615450c5fd",
  measurementId: "G-CHD2QVPKKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export { app, db, storage };
