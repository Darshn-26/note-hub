// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHSv2DB67g7I6ApjJdmRZlNp-qCA5XwHg",
  authDomain: "note-hub-afbf7.firebaseapp.com",
  projectId: "note-hub-afbf7",
  storageBucket: "note-hub-afbf7.firebasestorage.app",
  messagingSenderId: "796090997779",
  appId: "1:796090997779:web:3e9ab463b256eb604033e6"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
export {db}