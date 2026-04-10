"use client";

import { useState, useRef, useCallback } from "react";
import { addTap, getTapCount } from "@/store/app-store";
import { TAP_DEBOUNCE_MS, MAX_TAPS_PER_USER } from "@/lib/types";

export interface TapParticle {
  id: string;
  x: number;
  y: number;
  emoji: string;
}

const TAP_EMOJIS = ["💥", "✨", "⚡", "🔥", "💫", "🌟"];

export function useTapEngine(statusId: string, userId: string) {
  const [tapCount, setTapCount] = useState(() => getTapCount(statusId, userId));
  const [particles, setParticles] = useState<TapParticle[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapTime = useRef(0);

  const handleTap = useCallback(
    (clientX: number, clientY: number) => {
      const now = Date.now();
      if (now - lastTapTime.current < TAP_DEBOUNCE_MS) return;
      lastTapTime.current = now;

      if (tapCount >= MAX_TAPS_PER_USER) return;

      const newCount = addTap(statusId, userId);
      setTapCount(newCount);

      // Create emoji particle
      const particle: TapParticle = {
        id: `${now}-${Math.random()}`,
        x: clientX,
        y: clientY,
        emoji: TAP_EMOJIS[Math.floor(Math.random() * TAP_EMOJIS.length)],
      };

      setParticles((prev) => [...prev, particle]);

      // Remove particle after animation
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== particle.id));
      }, 900);
    },
    [statusId, userId, tapCount]
  );

  const isMaxed = tapCount >= MAX_TAPS_PER_USER;

  return { tapCount, particles, handleTap, isMaxed };
}
