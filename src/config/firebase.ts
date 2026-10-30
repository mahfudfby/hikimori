// src/config/firebase.ts
// Firebase di-load secara LAZY (dynamic import) supaya ±150 KB SDK tidak ikut
// bundle utama. Halaman publik tetap tampil instan dari cache/default, lalu
// Firestore menyusul di background.
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA2_CNohjlSmQN2phrYzVW47ghFWsqo8I8',
  authDomain: 'hikimori-18d47.firebaseapp.com',
  projectId: 'hikimori-18d47',
  storageBucket: 'hikimori-18d47.firebasestorage.app',
  messagingSenderId: '915025176309',
  appId: '1:915025176309:web:44c6b53844620882dd47bc',
};

let appP: Promise<FirebaseApp> | null = null;
let dbP: Promise<Firestore> | null = null;
let authP: Promise<Auth> | null = null;

export const getApp = () =>
  (appP ??= import('firebase/app').then(({ initializeApp, getApps, getApp: ga }) =>
    getApps().length ? ga() : initializeApp(firebaseConfig)));

export const getDb = () =>
  (dbP ??= Promise.all([getApp(), import('firebase/firestore')]).then(([app, fs]) => fs.getFirestore(app)));

export const getAuthInstance = () =>
  (authP ??= Promise.all([getApp(), import('firebase/auth')]).then(([app, a]) => a.getAuth(app)));
