// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZnjLlfovwPpb35r2avVLvCWBqS_0wP7Y",
  authDomain: "blacwom-70b2a.firebaseapp.com",
  projectId: "blacwom-70b2a",
  storageBucket: "blacwom-70b2a.appspot.com",
  messagingSenderId: "41873999360",
  appId: "1:41873999360:web:ec57453bcb51eb3b717ae5",
  measurementId: "G-H6Q0BXZ0FN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
