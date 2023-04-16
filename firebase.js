// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxaZ5jcBmwKudqxLxc4Tzjurbk7_BuDno",
  authDomain: "job-management-app-8d114.firebaseapp.com",
  projectId: "job-management-app-8d114",
  storageBucket: "job-management-app-8d114.appspot.com",
  messagingSenderId: "42660960344",
  appId: "1:42660960344:web:2280abc287caa50b82d22d",
  measurementId: "G-N3PGTZHZYN"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();


export { auth, db, storage };