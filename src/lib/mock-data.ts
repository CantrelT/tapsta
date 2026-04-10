// Mock data for Tapsta MVP — replace with Firebase calls
import type { Status, User, StatusAnalytics } from "./types";

export const MOCK_CURRENT_USER: User = {
  id: "user_me",
  phone: "+2348012345678",
  username: "tapsta_user",
  avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=tapsta_user",
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
};

const now = Date.now();
const hour = 1000 * 60 * 60;

export const MOCK_STATUSES: Status[] = [
  {
    id: "status_1",
    userId: "user_2",
    username: "adaeze_ng",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=adaeze",
    mediaUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    mediaType: "image",
    caption: "Night vibes in Abuja 🌃",
    createdAt: now - hour * 2,
    expiresAt: now + hour * 22,
    viewsCount: 142,
    tapToReveal: {
      enabled: true,
      tapCountRequired: 5,
      revealedMediaUrl:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    },
  },
  {
    id: "status_2",
    userId: "user_3",
    username: "chukwuemeka",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=chukwuemeka",
    mediaUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    mediaType: "image",
    caption: "Festival energy 🔥🔥",
    createdAt: now - hour * 5,
    expiresAt: now + hour * 19,
    viewsCount: 389,
    poll: {
      enabled: true,
      question: "Lagos or Abuja? 🏙️",
      options: ["Lagos", "Abuja"],
      votes: { Lagos: 87, Abuja: 54 },
    },
  },
  {
    id: "status_3",
    userId: "user_4",
    username: "ngozi_creates",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=ngozi",
    mediaUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    mediaType: "image",
    caption: "New fit just dropped 👗✨",
    createdAt: now - hour * 1,
    expiresAt: now + hour * 23,
    viewsCount: 512,
  },
  {
    id: "status_4",
    userId: "user_5",
    username: "ifeoma_taps",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=ifeoma",
    mediaUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    mediaType: "image",
    caption: "Concert mode: ACTIVATED 🎵",
    createdAt: now - hour * 8,
    expiresAt: now + hour * 16,
    viewsCount: 278,
    poll: {
      enabled: true,
      question: "Afrobeats or Amapiano?",
      options: ["Afrobeats", "Amapiano"],
      votes: { Afrobeats: 134, Amapiano: 91 },
    },
    tapToReveal: {
      enabled: true,
      tapCountRequired: 8,
      revealedMediaUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    },
  },
  {
    id: "status_5",
    userId: "user_me",
    username: "tapsta_user",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=tapsta_user",
    mediaUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    mediaType: "image",
    caption: "Squad goals 💪🏾",
    createdAt: now - hour * 3,
    expiresAt: now + hour * 21,
    viewsCount: 67,
  },
];

export const MOCK_ANALYTICS: StatusAnalytics[] = [
  {
    statusId: "status_5",
    totalViews: 67,
    totalTaps: 234,
    topTappers: [
      { userId: "user_2", username: "adaeze_ng", avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=adaeze", tapCount: 20 },
      { userId: "user_3", username: "chukwuemeka", avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=chukwuemeka", tapCount: 18 },
      { userId: "user_4", username: "ngozi_creates", avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=ngozi", tapCount: 15 },
      { userId: "user_5", username: "ifeoma_taps", avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=ifeoma", tapCount: 12 },
      { userId: "user_6", username: "emeka_vibes", avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=emeka", tapCount: 9 },
    ],
    reactions: { "🔥": 23, "😂": 8, "😍": 19, "😳": 4, "💔": 2 },
  },
];
