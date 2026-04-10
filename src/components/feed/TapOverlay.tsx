"use client";

import { useTapEngine } from "@/hooks/useTapEngine";
import { MAX_TAPS_PER_USER } from "@/lib/types";

interface TapOverlayProps {
  statusId: string;
  userId: string;
  onTap?: (count: number) => void;
}

export function TapOverlay({ statusId, userId, onTap }: TapOverlayProps) {
  const { tapCount, particles, handleTap, isMaxed } = useTapEngine(statusId, userId);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleTap(x, y);
    onTap?.(tapCount + 1);
  };

  const progressPct = (tapCount / MAX_TAPS_PER_USER) * 100;

  return (
    <div
      className="absolute inset-0 z-20 select-none"
      onPointerDown={handlePointerDown}
      style={{ cursor: isMaxed ? "default" : "pointer" }}
    >
      {/* Tap particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="emoji-burst"
          style={{ left: p.x, top: p.y }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Tap counter */}
      <div className="absolute top-4 right-4 z-30 pointer-events-none">
        <div className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${progressPct}%`,
                background: isMaxed
                  ? "linear-gradient(90deg, #7c3aed, #f97316)"
                  : "linear-gradient(90deg, #7c3aed, #ec4899)",
              }}
            />
          </div>
          <span className="text-white text-xs font-bold tabular-nums">
            {tapCount}/{MAX_TAPS_PER_USER}
          </span>
        </div>
      </div>

      {/* Maxed out label */}
      {isMaxed && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="glass rounded-full px-4 py-2">
            <span className="text-white/80 text-sm">Max taps reached ⚡</span>
          </div>
        </div>
      )}
    </div>
  );
}
