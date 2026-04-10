"use client";

// Firebase initialization - only runs on client
import type { Status, EmojiType } from "./types";

let firebaseReady = false;

async function loadFirebase() {
  if (firebaseReady) return true;
  
  try {
    const { initializeApp, getApps } = await import("firebase/app");
    const { getFirestore } = await import("firebase/firestore");
    
    const firebaseConfig = {
      apiKey: "AIzaSyCsUD1CNOEHeAZuAjsCM1qoLyhbDhJWxkQ",
      authDomain: "tapsta-app-bed3f.firebaseapp.com",
      projectId: "tapsta-app-bed3f",
      storageBucket: "tapsta-app-bed3f.firebasestorage.app",
      messagingSenderId: "178442014239",
      appId: "1:178442014239:web:906be882b480a5cdc20f2a"
    };

    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
    getFirestore();
    firebaseReady = true;
    return true;
  } catch (e) {
    console.log("Firebase not available, using mock data");
    return false;
  }
}

export async function initFirebase(): Promise<boolean> {
  return loadFirebase();
}

export async function getStatusesFromDb(): Promise<Status[] | null> {
  const ready = await loadFirebase();
  if (!ready) return null;
  
  try {
    const { getFirestore, collection, query, orderBy, limit, getDocs } = await import("firebase/firestore");
    const { getDocs: getDocsFunc } = await import("firebase/firestore");
    
    const db = getFirestore();
    const q = query(collection(db, "statuses"), orderBy("createdAt", "desc"), limit(50));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId || "",
        username: data.username || "",
        avatarUrl: data.avatarUrl || "",
        mediaUrl: data.mediaUrl || "",
        mediaType: data.mediaType || "image",
        caption: data.caption || "",
        createdAt: data.createdAt?.toMillis?.() || Date.now(),
        expiresAt: data.expiresAt?.toMillis?.() || Date.now() + 24 * 60 * 60 * 1000,
        viewsCount: data.viewsCount || 0,
        poll: data.poll,
        tapToReveal: data.tapToReveal,
      };
    });
  } catch (e) {
    console.log("Error fetching statuses:", e);
    return null;
  }
}

export async function createStatusInDb(status: Omit<Status, "id">): Promise<string | null> {
  const ready = await loadFirebase();
  if (!ready) return null;
  
  try {
    const { getFirestore, collection, doc, setDoc, Timestamp } = await import("firebase/firestore");
    const db = getFirestore();
    const docRef = doc(collection(db, "statuses"));
    await setDoc(docRef, {
      ...status,
      createdAt: Timestamp.fromMillis(status.createdAt),
      expiresAt: Timestamp.fromMillis(status.expiresAt),
    });
    return docRef.id;
  } catch (e) {
    console.log("Error creating status:", e);
    return null;
  }
}

export async function addTapToDb(statusId: string, userId: string): Promise<number | null> {
  const ready = await loadFirebase();
  if (!ready) return null;
  
  try {
    const { getFirestore, doc, getDoc, setDoc, Timestamp } = await import("firebase/firestore");
    const db = getFirestore();
    const tapRef = doc(db, "statuses", statusId, "taps", userId);
    const tapDoc = await getDoc(tapRef);
    
    const currentCount = tapDoc.exists() ? tapDoc.data().tapCount || 0 : 0;
    const newCount = currentCount + 1;
    
    await setDoc(tapRef, {
      tapCount: newCount,
      lastTappedAt: Timestamp.now(),
    });
    
    return newCount;
  } catch (e) {
    return null;
  }
}

export async function setReactionInDb(statusId: string, userId: string, emoji: EmojiType): Promise<void> {
  const ready = await loadFirebase();
  if (!ready) return;
  
  try {
    const { getFirestore, doc, setDoc, Timestamp } = await import("firebase/firestore");
    const db = getFirestore();
    const reactionRef = doc(db, "statuses", statusId, "reactions", userId);
    await setDoc(reactionRef, { emoji, createdAt: Timestamp.now() });
  } catch (e) {}
}

export async function votePollInDb(statusId: string, userId: string, option: string): Promise<void> {
  const ready = await loadFirebase();
  if (!ready) return;
  
  try {
    const { getFirestore, doc, setDoc, Timestamp } = await import("firebase/firestore");
    const db = getFirestore();
    const voteRef = doc(db, "statuses", statusId, "votes", userId);
    await setDoc(voteRef, { option, votedAt: Timestamp.now() });
  } catch (e) {}
}