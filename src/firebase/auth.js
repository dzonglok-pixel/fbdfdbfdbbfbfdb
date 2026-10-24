// ==============================================================================
// auth.js — Nickname & Password Authentication (No Email & No Google Auth)
// ==============================================================================
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  serverTimestamp, 
  runTransaction 
} from "firebase/firestore";
import { auth, db } from "./firebase-config.js";

// Synthetic email domain required by Firebase Auth under the hood
const VIRTUAL_EMAIL_DOMAIN = "myshop.local";

/**
 * Converts a player nickname into a synthetic internal email for Firebase Auth.
 * Example: "Cyber_Slayer" -> "cyber_slayer@myshop.local"
 * @param {string} nickname - Raw player nickname
 * @returns {string} Synthetic email address
 */
export function nicknameToEmail(nickname) {
  const sanitized = nickname.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
  if (!sanitized) {
    throw new Error("Nickname may only contain alphanumeric characters and underscores.");
  }
  return `${sanitized}@${VIRTUAL_EMAIL_DOMAIN}`;
}

/**
 * Validates player credentials before submitting to Firebase.
 * @param {string} nickname
 * @param {string} password
 * @returns {string} Sanitized nickname
 */
export function validateCredentials(nickname, password) {
  const cleanNick = nickname.trim();
  if (cleanNick.length < 3 || cleanNick.length > 20) {
    throw new Error("Nickname must be between 3 and 20 characters.");
  }
  if (!/^[a-zA-Z0-9_]+$/.test(cleanNick)) {
    throw new Error("Nickname can only contain Latin letters, numbers, and underscores.");
  }
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }
  return cleanNick;
}

/**
 * Registers a new user using only Nickname and Password.
 * Guarantees nickname uniqueness in Firestore before and during account creation.
 * @param {string} nickname
 * @param {string} password
 * @returns {Promise<{uid: string, nickname: string}>}
 */
export async function registerWithNickname(nickname, password) {
  const cleanNick = validateCredentials(nickname, password);
  const nickLower = cleanNick.toLowerCase();
  const virtualEmail = `${nickLower}@${VIRTUAL_EMAIL_DOMAIN}`;

  // 1. Pre-check nickname availability in Firestore
  const usernameRef = doc(db, "usernames", nickLower);
  const usernameSnap = await getDoc(usernameRef);
  if (usernameSnap.exists()) {
    throw new Error("This nickname is already taken. Please choose another one.");
  }

  // 2. Create the account in Firebase Auth using the synthetic email
  let userCredential;
  try {
    userCredential = await createUserWithEmailAndPassword(auth, virtualEmail, password);
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      throw new Error("This nickname is already registered in the system.");
    }
    throw new Error(`Registration failed: ${err.message}`);
  }

  const uid = userCredential.user.uid;

  // 3. Atomically reserve the username document and create user profile in Firestore
  try {
    await runTransaction(db, async (transaction) => {
      const uSnap = await transaction.get(usernameRef);
      if (uSnap.exists()) {
        throw new Error("Nickname was reserved by another user during registration.");
      }
      
      // Reserve username to ensure strict uniqueness
      transaction.set(usernameRef, {
        uid: uid,
        nickname: cleanNick,
        createdAt: serverTimestamp()
      });

      // Primary user document in /users/{uid}
      const userRef = doc(db, "users", uid);
      transaction.set(userRef, {
        uid: uid,
        nickname: cleanNick,
        nicknameLower: nickLower,
        createdAt: serverTimestamp()
      });
    });
  } catch (err) {
    console.error("Error creating user profile in Firestore:", err);
    throw err;
  }

  return { uid, nickname: cleanNick };
}

/**
 * Logs in a user using Nickname and Password.
 * @param {string} nickname
 * @param {string} password
 * @returns {Promise<{uid: string, nickname: string}>}
 */
export async function loginWithNickname(nickname, password) {
  const cleanNick = nickname.trim();
  if (!cleanNick || !password) {
    throw new Error("Please enter both nickname and password.");
  }

  const virtualEmail = nicknameToEmail(cleanNick);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, virtualEmail, password);
    const uid = userCredential.user.uid;

    // Retrieve original formatted nickname from Firestore profile
    const userDoc = await getDoc(doc(db, "users", uid));
    const finalNick = userDoc.exists() ? userDoc.data().nickname : cleanNick;

    return { uid, nickname: finalNick };
  } catch (err) {
    if (
      err.code === "auth/user-not-found" || 
      err.code === "auth/invalid-credential" || 
      err.code === "auth/wrong-password"
    ) {
      throw new Error("Invalid nickname or password.");
    }
    throw new Error(`Login failed: ${err.message}`);
  }
}

/**
 * Signs out the current user.
 */
export async function logoutUser() {
  await signOut(auth);
}

/**
 * Listens for auth state changes with localStorage persistence.
 * @param {Function} callback - Invoked with { uid, nickname } or null
 */
export function initAuthListener(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const nickname = userDoc.exists() ? userDoc.data().nickname : user.email.split("@")[0];
        callback({ uid: user.uid, nickname });
      } catch (err) {
        console.error("Error loading user profile:", err);
        callback({ uid: user.uid, nickname: user.email.split("@")[0] });
      }
    } else {
      callback(null);
    }
  });
}
