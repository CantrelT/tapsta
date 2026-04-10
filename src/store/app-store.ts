"use client";

// Simple store with Firebase support
import { MOCK_STATUSES, MOCK_CURRENT_USER } from "@/lib/mock-data";
import type { Status, User, EmojiType, TapData } from "@/lib/types";
import { MAX_TAPS_PER_USER } from "@/lib/types";
import { 
  initFirebase, 
  getStatusesFromDb,
  createStatusInDb,
  addTapToDb,
  votePollInDb,
  setReactionInDb
} from "@/lib/firebase";

let currentUser: User | null = null;
let isAuthenticated = false;
let firebaseReady = false;

const tapStore: Record<string, Record<string, TapData>> = {};
const reactionStore: Record<string, Record<string, EmojiType>> = {};
const pollVoteStore: Record<string, Record<string, string>> = {};
const viewedStatuses = new Set<string>();

async function initFb() {
  if (firebaseReady) return;
  firebaseReady = await initFirebase();
}

export async function loadStatuses(): Promise<Status[]> {
  await initFb();
  if (firebaseReady) {
    try {
      const statuses = await getStatusesFromDb();
      if (statuses && statuses.length > 0) return statuses;
    } catch (e) {
      console.log("Using mock data");
    }
  }
  const now = Date.now();
  return MOCK_STATUSES.filter((s) => s.expiresAt > now);
}

export function getStatuses(): Status[] {
  const now = Date.now();
  return MOCK_STATUSES.filter((s) => s.expiresAt > now);
}

export function getCurrentUser(): User | null {
  return currentUser;
}

export function login(phone: string): User {
  const user = { ...MOCK_CURRENT_USER, phone };
  currentUser = user;
  isAuthenticated = true;
  return user;
}

export function logout() {
  currentUser = null;
  isAuthenticated = false;
}

export function getIsAuthenticated(): boolean {
  return isAuthenticated;
}

export function getTapCount(statusId: string, userId: string): number {
  return tapStore[statusId]?.[userId]?.tapCount ?? 0;
}

export function getTotalTaps(statusId: string): number {
  const statusTaps = tapStore[statusId];
  if (!statusTaps) return 0;
  return Object.values(statusTaps).reduce((sum, t) => sum + t.tapCount, 0);
}

export async function addTap(statusId: string, userId: string): Promise<number> {
  await initFb();
  
  if (firebaseReady) {
    const count = await addTapToDb(statusId, userId);
    if (count !== null) {
      if (!tapStore[statusId]) tapStore[statusId] = {};
      tapStore[statusId][userId] = { tapCount: count, lastTappedAt: Date.now() };
      return count;
    }
  }
  
  if (!tapStore[statusId]) tapStore[statusId] = {};
  const current = tapStore[statusId][userId] ?? { tapCount: 0, lastTappedAt: 0 };
  if (current.tapCount >= MAX_TAPS_PER_USER) return current.tapCount;
  const updated = { tapCount: current.tapCount + 1, lastTappedAt: Date.now() };
  tapStore[statusId][userId] = updated;
  return updated.tapCount;
}

export function getReaction(statusId: string, userId: string): EmojiType | null {
  return reactionStore[statusId]?.[userId] ?? null;
}

export function getReactionCounts(statusId: string): Record<EmojiType, number> {
  const counts: Record<EmojiType, number> = { "🔥": 0, "😂": 0, "😍": 0, "😳": 0, "💔": 0 };
  const statusReactions = reactionStore[statusId];
  if (!statusReactions) return counts;
  for (const emoji of Object.values(statusReactions)) {
    if (emoji in counts) counts[emoji as EmojiType]++;
  }
  return counts;
}

export async function setReaction(statusId: string, userId: string, emoji: EmojiType): Promise<void> {
  await initFb();
  
  if (firebaseReady) {
    await setReactionInDb(statusId, userId, emoji);
  }
  
  if (!reactionStore[statusId]) reactionStore[statusId] = {};
  reactionStore[statusId][userId] = emoji;
}

export function getPollVote(statusId: string, userId: string): string | null {
  return pollVoteStore[statusId]?.[userId] ?? null;
}

export async function castPollVote(statusId: string, userId: string, option: string): Promise<void> {
  await initFb();
  
  if (firebaseReady) {
    await votePollInDb(statusId, userId, option);
  }
  
  if (pollVoteStore[statusId]?.[userId]) return;
  if (!pollVoteStore[statusId]) pollVoteStore[statusId] = {};
  pollVoteStore[statusId][userId] = option;

  const status = MOCK_STATUSES.find((s) => s.id === statusId);
  if (status?.poll) {
    status.poll.votes[option] = (status.poll.votes[option] ?? 0) + 1;
  }
}

export function markViewed(statusId: string): void {
  if (viewedStatuses.has(statusId)) return;
  viewedStatuses.add(statusId);
  const status = MOCK_STATUSES.find((s) => s.id === statusId);
  if (status) status.viewsCount++;
}