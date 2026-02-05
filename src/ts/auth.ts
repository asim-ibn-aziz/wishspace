/**
 * Authentication logic – sign up, sign in, sign out, auth state.
 * Creates/updates user document in Firestore on registration.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  type Unsubscribe,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { UserData } from "./types";

/** Subscribe to auth state changes. Returns unsubscribe function. */
export function subscribeAuth(callback: (user: FirebaseUser | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

/**
 * Sign up with email, password, and username.
 * Creates Firebase Auth user, then writes user profile (username, email, createdAt) to Firestore users/{uid}.
 */
export async function signUp(
  email: string,
  password: string,
  username: string
): Promise<void> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", cred.user.uid), {
    username: username.trim(),
    email: cred.user.email ?? email,
    createdAt: serverTimestamp(),
  });
}

/** Sign in with email and password. */
export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

/** Sign out. */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/** Get current Firebase user. */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

/** Fetch user profile from Firestore. */
export async function getUserProfile(userId: string): Promise<UserData | null> {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? (snap.data() as UserData) : null;
}
