"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { TapToReveal as TapToRevealType } from "@/lib/types";

function RevealEffect({ onRevealed }: { onRevealed: () => void }) {
  useEffect(() => {
    const t = setTimeout(onRevealed, 100);
    return () => clearTimeout(t);
  }, [onRevealed]);
  return null;
}

interface TapToRevealProps {
  config: TapToRevealType;
  currentTapCount: number;
  mediaUrl: string;
}

export function TapToReveal({ config, currentTapCount, mediaUrl }: TapToRevealProps) {
  const [wasRevealed, setWasRevealed] = useState(false);
  const isRevealed = currentTapCount >= config.tapCountRequired || wasRevealed;
  const remaining = Math.max(0, config.tapCountRequired - currentTapCount);
  const progress = Math.min(1, currentTapCount / config.tapCountRequired);

  if (!config.enabled) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Revealed media */}
      {isRevealed && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: isRevealed ? 1 : 0 }}
        >
          <Image
            src={config.revealedMediaUrl}
            alt="Revealed content"
            fill
            className="object-cover"
            unoptimized
          />
          {!wasRevealed && <RevealEffect onRevealed={() => setWasRevealed(true)} />}
        </div>
      )}

      {/* Blur overlay — fades out as taps progress */}
      {!isRevealed && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300"
          style={{
            backdropFilter: `blur(${Math.max(0, 24 - progress * 24)}px)`,
            WebkitBackdropFilter: `blur(${Math.max(0, 24 - progress * 24)}px)`,
            background: `rgba(0,0,0,${0.5 - progress * 0.5})`,
          }}
        >
          {/* Progress ring */}
          <div className="relative w-24 h-24 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="6"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="url(#tapGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress)}`}
                style={{ transition: "stroke-dashoffset 0.2s ease-out" }}
              />
              <defs>
                <linearGradient id="tapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl">👀</span>
              <span className="text-white font-bold text-lg leading-none">
                {config.tapCountRequired - Math.floor(progress * config.tapCountRequired)}
              </span>
            </div>
          </div>

          <p className="text-white/90 text-sm font-semibold text-center px-6">
            Tap {remaining}x to unlock 👀
          </p>
        </div>
      )}
    </div>
  );
}
