import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyByNfZodh_xjEc79QpUv0wlKjjOypjzXfs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sistem-isak-masjid.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sistem-isak-masjid",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sistem-isak-masjid.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "893289771510",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:893289771510:web:8a1bcd83c6d5731a9017d7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
