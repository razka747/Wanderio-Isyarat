// src/sistemLogin/firebaseConfig.js (atau sesuai struktur folder Anda)

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyYsnXA4VV8zSfGO714d93out3yyTBXvI",
  authDomain: "aplikasi-isyarat.firebaseapp.com",
  projectId: "aplikasi-isyarat",
  storageBucket: "aplikasi-isyarat.firebasestorage.app",
  messagingSenderId: "592587180218",
  appId: "1:592587180218:web:1df705af9842261587da83"
};

// Inisialisasi Firebase jika belum ada
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Setup auth Firebase
export const auth = getAuth(app);
export default app;
export const db = getFirestore(app);
