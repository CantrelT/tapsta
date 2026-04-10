"use client";

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot,
  query,
  orderBy,
  limit,
  Timestamp,
  Firestore
} from "firebase/firestore";
import type { Status, User, Poll, TapToReveal, EmojiType } from "./types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tapsta-demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tapsta-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123",
};

let app: FirebaseApp;
let db: Firestore;

export function initFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  return { app, db };
}

export function getDb(): Firestore {
  if (!db) initFirebase();
  return db;
}

// Status operations
export async function createStatus(status: Omit<Status, "id">): Promise<string> {
  const db = getDb();
  const docRef = doc(collection(db, "statuses"));
  await setDoc(docRef, {
    ...status,
    createdAt: Timestamp.fromMillis(status.createdAt),
    expiresAt: Timestamp.fromMillis(status.expiresAt),
  });
  return docRef.id;
}

export async function getStatuses(limitCount = 50): Promise<Status[]> {
  const db = getDb();
  const q = query(
    collection(db, "statuses"),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      username: data.username,
      avatarUrl: data.avatarUrl,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
      caption: data.caption,
      createdAt: data.createdAt?.toMillis() || Date.now(),
      expiresAt: data.expiresAt?.toMillis() || Date.now() + 24 * 60 * 60 * 1000,
      viewsCount: data.viewsCount || 0,
      poll: data.poll,
      tapToReveal: data.tapToReveal,
    };
  });
}

export function subscribeToStatuses(callback: (statuses: Status[]) => void) {
  const db = getDb();
  const q = query(
    collection(db, "statuses"),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  return onSnapshot(q, (snapshot) => {
    const statuses = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        username: data.username,
        avatarUrl: data.avatarUrl,
        mediaUrl: data.mediaUrl,
        mediaType: data.mediaType,
        caption: data.caption,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        expiresAt: data.expiresAt?.toMillis() || Date.now() + 24 * 60 * 60 * 1000,
        viewsCount: data.viewsCount || 0,
        poll: data.poll,
        tapToReveal: data.tapToReveal,
      };
    });
    callback(statuses);
  });
}

// Tap operations
export async function addTap(statusId: string, userId: string): Promise<number> {
  const db = getDb();
  const tapRef = doc(db, "statuses", statusId, "taps", userId);
  const tapDoc = await getDoc(tapRef);
  
  const currentCount = tapDoc.exists() ? tapDoc.data().tapCount || 0 : 0;
  const newCount = currentCount + 1;
  
  await setDoc(tapRef, {
    tapCount: newCount,
    lastTappedAt: Timestamp.now(),
  });
  
  return newCount;
}

export async function getTaps(statusId: string): Promise<Record<string, number>> {
  const db = getDb();
  const tapsRef = collection(db, "statuses", statusId, "taps");
  const snapshot = await getDocs(tapsRef);
  const taps: Record<string, number> = {};
  snapshot.docs.forEach((doc) => {
    taps[doc.id] = doc.data().tapCount || 0;
  });
  return taps;
}

// Poll voting
export async function votePoll(statusId: string, userId: string, option: string) {
  const db = getDb();
  const voteRef = doc(db, "statuses", statusId, "votes", userId);
  await setDoc(voteRef, { option, votedAt: Timestamp.now() });
}

export async function getPollResults(statusId: string): Promise<Record<string, number>> {
  const db = getDb();
  const votesRef = collection(db, "statuses", statusId, "votes");
  const snapshot = await getDocs(votesRef);
  const results: Record<string, number> = {};
  snapshot.docs.forEach((doc) => {
    const option = doc.data().option;
    results[option] = (results[option] || 0) + 1;
  });
  return results;
}

// Reactions
export async function setReaction(statusId: string, userId: string, emoji: EmojiType) {
  const db = getDb();
  const reactionRef = doc(db, "statuses", statusId, "reactions", userId);
  await setDoc(reactionRef, { emoji, createdAt: Timestamp.now() });
}

export async function getReactions(statusId: string): Promise<Record<string, EmojiType>> {
  const db = getDb();
  const reactionsRef = collection(db, "statuses", statusId, "reactions");
  const snapshot = await getDocs(reactionsRef);
  const reactions: Record<string, EmojiType> = {};
  snapshot.docs.forEach((doc) => {
    reactions[doc.id] = doc.data().emoji as EmojiType;
  });
  return reactions;
}

// User operations
export async function createUser(user: User): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, "users", user.id), user);
}

export async function getUser(userId: string): Promise<User | null> {
  const db = getDb();
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? userDoc.data() as User : null;
}