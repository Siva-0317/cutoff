import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbrhHnFTHDK-w-aa53Rh2tcRJxBub-UvI",
  authDomain: "cutoff-4f021.firebaseapp.com",
  projectId: "cutoff-4f021",
  storageBucket: "cutoff-4f021.firebasestorage.app",
  messagingSenderId: "66352946732",
  appId: "1:66352946732:web:00e586c336b25db19dbb89",
  measurementId: "G-BMBX723RER"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);