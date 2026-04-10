"use client";

// Simple in-memory store for Tapsta MVP
// Replace with Firebase/Zustand in production

import { MOCK_CURRENT_USER, MOCK_STATUSES } from "@/lib/mock-data";
import type { Status, User, EmojiType, TapData } from "@/lib/types";
import { MAX_TAPS_PER_USER } from "@/lib/types";

// App state (in-memory, would be Firebase in prod)
let currentUser: User | null = null;
let isAuthenticated = false;

// Tap counts: statusId -> userId -> TapData
const tapStore: Record<string, Record<string, TapData>> = {};

// Reactions: statusId -> userId -> emoji
const reactionStore: Record<string, Record<string, EmojiType>> = {};

// Poll votes: statusId -> userId -> option
const pollVoteStore: Record<string, Record<string, string>> = {};

// Viewed statuses: Set of statusId
const viewedStatuses = new Set<string>();

export function getStatuses(): Status[] {
  const now = Date.now();
  return MOCK_STATUSES.filter((s) => s.expiresAt > now);
}

export function getCurrentUser(): User | null {
  return currentUser;
}

export function login(phone: string): User {
  // Mock login — in prod, use Firebase Phone Auth
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

export function addTap(statusId: string, userId: string): number {
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

export function setReaction(statusId: string, userId: string, emoji: EmojiType): void {
  if (!reactionStore[statusId]) reactionStore[statusId] = {};
  reactionStore[statusId][userId] = emoji;
}

export function getPollVote(statusId: string, userId: string): string | null {
  return pollVoteStore[statusId]?.[userId] ?? null;
}

export function castPollVote(statusId: string, userId: string, option: string): void {
  if (pollVoteStore[statusId]?.[userId]) return; // already voted
  if (!pollVoteStore[statusId]) pollVoteStore[statusId] = {};
  pollVoteStore[statusId][userId] = option;

  // Update in-memory status votes
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
