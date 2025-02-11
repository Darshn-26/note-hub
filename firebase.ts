// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apikey,
  authDomain: "note-hub-afbf7.firebaseapp.com",
  projectId: "note-hub-afbf7",
  storageBucket: "note-hub-afbf7.firebasestorage.app",
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
export {db}