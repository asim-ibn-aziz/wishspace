/**
 * WishSpace – Type definitions
 * User and Wish interfaces for Firestore and app logic.
 */

import type { Timestamp } from "firebase/firestore";

/** User document in Firestore `users` collection */
export interface UserData {
  username: string;
  email: string;
  createdAt: Timestamp;
}

/** Wish document in Firestore `wishes` collection */
export interface Wish {
  id: string;
  text: string;
  userId: string;
  username: string;
  isAnonymous: boolean;
  x: number;
  y: number;
  likeCount: number;
  createdAt: Timestamp;
}

/** Document for tracking who liked which wish (`wishLikes` collection) */
export interface WishLike {
  wishId: string;
  userId: string;
}

/** Max length for wish text (enforced in UI and rules) */
export const MAX_WISH_LENGTH = 200;
