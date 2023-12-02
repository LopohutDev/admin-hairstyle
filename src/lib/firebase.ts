import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDdyfuv-qR2E18kARLBm233dn-ApirFJOg",
  authDomain: "hairstyledatabase.firebaseapp.com",
  databaseURL: "https://hairstyledatabase-default-rtdb.firebaseio.com",
  projectId: "hairstyledatabase",
  storageBucket: "hairstyledatabase.appspot.com",
  messagingSenderId: "152457732683",
  appId: "1:152457732683:web:d882c8f27f70dd73d0a3ce",
  measurementId: "G-N65ZTTQJTW",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const database = getDatabase();
