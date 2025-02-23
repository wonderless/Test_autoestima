// src/lib/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA4gN9junNHD5fu5K6oElpsetCxpVj5_SY",
    authDomain: "psicologia-92b81.firebaseapp.com",
    projectId: "psicologia-92b81",
    storageBucket: "psicologia-92b81.firebasestorage.app",
    messagingSenderId: "114180714198",
    appId: "1:114180714198:web:28ebaf1e62a86d2145a377",
    measurementId: "G-ZM7YW7XH4D"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);