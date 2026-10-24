// ==============================================================================
// firebase-config.js — Firebase SDK Initialization (Auth + Firestore)
// ==============================================================================
import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace these placeholders with your actual project keys from Firebase Console:
// Firebase Console -> Project Settings -> General -> Your apps -> Web app
const firebaseConfig = {
  apiKey: "AIzaSyYOUR_API_KEY_HERE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase App instance
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Cloud Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Force session persistence in browser localStorage so users stay logged in across page reloads
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Failed to enable browserLocalPersistence in Firebase Auth:", err);
});
