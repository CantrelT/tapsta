"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
  const [tapCount, setTapCount] = useState(0);
  const [particles, setParticles] = useState<TapParticle[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapTime = useRef(0);

  useEffect(() => {
    setTapCount(getTapCount(statusId, userId));
  }, [statusId, userId]);

  const handleTap = useCallback(
    async (clientX: number, clientY: number) => {
      const now = Date.now();
      if (now - lastTapTime.current < TAP_DEBOUNCE_MS) return;
      lastTapTime.current = now;

      if (tapCount >= MAX_TAPS_PER_USER) return;

      const newCount = await addTap(statusId, userId);
      setTapCount(newCount);

      const particle: TapParticle = {
        id: `${now}-${Math.random()}`,
        x: clientX,
        y: clientY,
        emoji: TAP_EMOJIS[Math.floor(Math.random() * TAP_EMOJIS.length)],
      };

      setParticles((prev) => [...prev, particle]);

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