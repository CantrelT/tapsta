// Tapsta Core Types - Firebase-ready interfaces

export interface User {
  id: string;
  phone: string;
  username: string;
  avatarUrl: string;
  createdAt: number;
}

export interface Poll {
  enabled: boolean;
  question: string;
  options: [string, string];
  votes: Record<string, number>;
}

export interface TapToReveal {
  enabled: boolean;
  tapCountRequired: number;
  revealedMediaUrl: string;
}

export interface Status {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  caption: string;
  createdAt: number;
  expiresAt: number;
  viewsCount: number;
  poll?: Poll;
  tapToReveal?: TapToReveal;
}

export interface TapData {
  tapCount: number;
  lastTappedAt: number;
}

export interface EmojiReaction {
  emoji: string;
  userId: string;
  statusId: string;
}

export type EmojiType = "🔥" | "😂" | "😍" | "😳" | "💔";

export const EMOJI_OPTIONS: EmojiType[] = ["🔥", "😂", "😍", "😳", "💔"];

export const MAX_TAPS_PER_USER = 20;
export const TAP_DEBOUNCE_MS = 150;

export interface StatusAnalytics {
  statusId: string;
  totalViews: number;
  totalTaps: number;
  topTappers: Array<{ userId: string; username: string; avatarUrl: string; tapCount: number }>;
  pollResults?: {
    question: string;
    options: [string, string];
    votes: Record<string, number>;
  };
  reactions: Record<EmojiType, number>;
}
