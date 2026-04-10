"use client";

import { useEffect, useState } from "react";
import { TapstaLogo } from "@/components/ui/TapstaLogo";

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 1800);
    const t3 = setTimeout(onDone, 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: "opacity 0.4s ease-out",
      }}
    >
      {/* Glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Tap particle decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["✨", "⚡", "🔥", "💫", "🌟"].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-lg opacity-20"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.2}s`,
              animation: "fade-in-up 0.6s ease-out forwards",
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div
        style={{
          opacity: phase === "enter" ? 0 : 1,
          transform: phase === "enter" ? "scale(0.8)" : "scale(1)",
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <TapstaLogo size="lg" showTagline />
      </div>
    </div>
  );
}
