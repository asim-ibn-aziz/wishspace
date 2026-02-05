/**
 * Wishes – create wish, like wish, real-time listener.
 * Uses Firestore transactions for safe likeCount increment.
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  type Unsubscribe,
  type DocumentSnapshot,
  type QuerySnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Wish } from "./types";
import { MAX_WISH_LENGTH } from "./types";

const WISHES = "wishes";
const WISH_LIKES = "wishLikes";

/** Convert Firestore doc snapshot to Wish (with id). */
function snapshotToWish(snap: DocumentSnapshot): Wish {
  const d = snap.data()!;
  return {
    id: snap.id,
    text: d.text ?? "",
    userId: d.userId ?? "",
    username: d.username ?? "",
    isAnonymous: !!d.isAnonymous,
    x: Number(d.x) ?? 0,
    y: Number(d.y) ?? 0,
    likeCount: Number(d.likeCount) ?? 0,
    createdAt: d.createdAt,
  };
}

/** Subscribe to all wishes in real time. Returns unsubscribe. */
export function subscribeWishes(callback: (wishes: Wish[]) => void): Unsubscribe {
  const q = query(collection(db, WISHES));
  return onSnapshot(q, (snap: QuerySnapshot) => {
    const wishes = snap.docs.map((d) => snapshotToWish(d));
    callback(wishes);
  });
}

/** Create a new wish with random x/y. */
export async function createWish(
  userId: string,
  username: string,
  text: string,
  isAnonymous: boolean
): Promise<string> {
  const trimmed = text.trim().slice(0, MAX_WISH_LENGTH);
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const displayName = isAnonymous ? "Anonymous" : username;
  const ref = await addDoc(collection(db, WISHES), {
    text: trimmed,
    userId,
    username: displayName,
    isAnonymous,
    x,
    y,
    likeCount: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Like a wish once per user.
 * Uses a Firestore transaction to: (1) check wishLikes for existing like,
 * (2) create wishLikes doc, (3) increment wish.likeCount. Prevents double-likes and race conditions.
 */
export async function likeWish(wishId: string, userId: string): Promise<boolean> {
  const likeDocId = `${wishId}_${userId}`;
  const likeRef = doc(db, WISH_LIKES, likeDocId);
  const wishRef = doc(db, WISHES, wishId);

  await runTransaction(db, async (tx) => {
    const likeSnap = await tx.get(likeRef);
    if (likeSnap.exists()) return; // already liked

    const wishSnap = await tx.get(wishRef);
    if (!wishSnap.exists()) return;

    const currentCount = Number(wishSnap.data()?.likeCount ?? 0);
    tx.set(likeRef, { wishId, userId });
    tx.update(wishRef, { likeCount: currentCount + 1 });
  });

  return true;
}

/** Check if current user has already liked a wish. */
export async function hasLiked(wishId: string, userId: string): Promise<boolean> {
  const likeDocId = `${wishId}_${userId}`;
  const snap = await getDoc(doc(db, WISH_LIKES, likeDocId));
  return snap.exists();
}

/** Get a single wish by id (for modal). */
export async function getWish(wishId: string): Promise<Wish | null> {
  const snap = await getDoc(doc(db, WISHES, wishId));
  if (!snap.exists()) return null;
  return snapshotToWish(snap);
}
