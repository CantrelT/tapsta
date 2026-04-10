"use client";

import { useRef, useState, useEffect } from "react";
import type { Status, User } from "@/lib/types";
import { StatusCard } from "./StatusCard";

interface HomeFeedProps {
  statuses: Status[];
  currentUser: User;
}

export function HomeFeed({ statuses, currentUser }: HomeFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(idx);
          }
        }
      },
      { threshold: 0.6, root: container }
    );

    const items = container.querySelectorAll("[data-index]");
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [statuses.length]);

  if (statuses.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-6xl">👀</div>
        <h2 className="text-white text-xl font-bold">Nothing here yet</h2>
        <p className="text-white/50 text-sm">
          Post a status and watch the taps roll in
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="snap-container flex-1">
      {statuses.map((status, i) => (
        <div key={status.id} data-index={i}>
          <StatusCard
            status={status}
            userId={currentUser.id}
            isActive={activeIndex === i}
          />
        </div>
      ))}
    </div>
  );
}
