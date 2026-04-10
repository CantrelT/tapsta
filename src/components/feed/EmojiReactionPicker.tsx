"use client";

import { useState } from "react";
import { EMOJI_OPTIONS, type EmojiType } from "@/lib/types";
import { getReaction, setReaction, getReactionCounts } from "@/store/app-store";

interface EmojiReactionPickerProps {
  statusId: string;
  userId: string;
}

export function EmojiReactionPicker({ statusId, userId }: EmojiReactionPickerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<EmojiType | null>(() =>
    getReaction(statusId, userId)
  );
  const [counts, setCounts] = useState(() => getReactionCounts(statusId));

  const handleSelect = (emoji: EmojiType) => {
    setReaction(statusId, userId, emoji);
    setSelected(emoji);
    setCounts(getReactionCounts(statusId));
    setOpen(false);
  };

  const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="relative flex flex-col items-center gap-1">
      {/* Emoji picker tray */}
      {open && (
        <div className="absolute bottom-14 right-0 glass rounded-2xl px-3 py-2 flex gap-2 z-40"
          style={{ animation: "slide-up 0.2s ease-out" }}>
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleSelect(emoji)}
              className={`text-2xl transition-transform hover:scale-125 active:scale-110 ${
                selected === emoji ? "scale-125" : ""
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-12 h-12 rounded-full glass flex items-center justify-center text-2xl transition-transform active:scale-90"
      >
        {selected ?? "😊"}
      </button>

      {totalReactions > 0 && (
        <span className="text-white/70 text-xs font-medium">
          {totalReactions > 999 ? `${(totalReactions / 1000).toFixed(1)}k` : totalReactions}
        </span>
      )}
    </div>
  );
}
