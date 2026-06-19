// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA2_CNohjlSmQN2phrYzVW47ghFWsqo8I8",
  authDomain: "hikimori-18d47.firebaseapp.com",
  projectId: "hikimori-18d47",
  storageBucket: "hikimori-18d47.firebasestorage.app",
  messagingSenderId: "915025176309",
  appId: "1:915025176309:web:44c6b53844620882dd47bc",
  measurementId: "G-BMP1SW77RD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
