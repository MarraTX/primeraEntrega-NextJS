// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDabBo_qam8YGuMA3nzcn6xsLkmcSgaRh0",
  authDomain: "oscared-db.firebaseapp.com",
  projectId: "oscared-db",
  storageBucket: "oscared-db.firebasestorage.app",
  messagingSenderId: "624093681916",
  appId: "1:624093681916:web:125fc8f9cce4abcf119f79",
  measurementId: "G-3F9D83G2RS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
