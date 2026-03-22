// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcK7KNafG782rBFia-8OUXrI8iEHwqAJ4",
  authDomain: "task-manager-app-9b77b.firebaseapp.com",
  projectId: "task-manager-app-9b77b",
  storageBucket: "task-manager-app-9b77b.firebasestorage.app",
  messagingSenderId: "449739472766",
  appId: "1:449739472766:web:03a3e9b8785a07be7fbd2f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {getAuth} from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

export const db = getFirestore(app) ;
export const auth = getAuth(app) ;