import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCfcsIgy5coEl8yfDXMkTOY0pm18vQJXPA",
  authDomain: "project-pkm-5160f.firebaseapp.com",
  databaseURL: "https://project-pkm-5160f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "project-pkm-5160f",
  storageBucket: "project-pkm-5160f.firebasestorage.app",
  messagingSenderId: "335899824043",
  appId: "1:335899824043:web:b333825c1c9fa2feef0cee"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0]

export const db = getDatabase(app)
