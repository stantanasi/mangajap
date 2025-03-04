import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp({
  apiKey: "AIzaSyBERviz4ObXOcBPCHiY8weoU_zdA8UNcIk",
  authDomain: "mangajap.firebaseapp.com",
  projectId: "mangajap",
  storageBucket: "mangajap.appspot.com",
  messagingSenderId: "765459541968",
  appId: "1:765459541968:web:fd5acd1ab2ba4d4c1193d5",
  measurementId: "G-P784KGM19T"
});

export const auth = getAuth(app);
