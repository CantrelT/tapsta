"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Status } from "@/lib/types";
import { markViewed, getTotalTaps } from "@/store/app-store";
import { TapOverlay } from "./TapOverlay";
import { EmojiReactionPicker } from "./EmojiReactionPicker";
import { PollWidget } from "./PollWidget";
import { TapToReveal } from "./TapToReveal";
import { Avatar } from "@/components/ui/Avatar";

interface StatusCardProps {
  status: Status;
  userId: string;
  isActive: boolean;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  return `${hours}h`;
}

function formatExpiry(expiresAt: number): string {
  const remaining = expiresAt - Date.now();
  const hours = Math.floor(remaining / 3600000);
  const mins = Math.floor((remaining % 3600000) / 60000);
  if (hours > 0) return `${hours}h left`;
  return `${mins}m left`;
}

export function StatusCard({ status, userId, isActive }: StatusCardProps) {
  const [currentTapCount, setCurrentTapCount] = useState(0);
  const [totalTaps, setTotalTaps] = useState(() => getTotalTaps(status.id));

  useEffect(() => {
    if (isActive) {
      markViewed(status.id);
    }
  }, [isActive, status.id]);

  const handleTap = (count: number) => {
    setCurrentTapCount(count);
    setTotalTaps(getTotalTaps(status.id));
  };

  return (
    <div className="snap-item relative bg-black overflow-hidden">
      {/* Background media */}
      <div className="absolute inset-0">
        <Image
          src={status.mediaUrl}
          alt={status.caption}
          fill
          className="object-cover"
          unoptimized
          priority={isActive}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      </div>

      {/* Tap-to-reveal overlay */}
      {status.tapToReveal?.enabled && (
        <TapToReveal
          config={status.tapToReveal}
          currentTapCount={currentTapCount}
          mediaUrl={status.mediaUrl}
        />
      )}

      {/* Tap overlay (full screen) */}
      <TapOverlay statusId={status.id} userId={userId} onTap={handleTap} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-safe px-4 pt-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <Avatar src={status.avatarUrl} alt={status.username} size={36} />
          <div>
            <p className="text-white text-sm font-semibold leading-tight">
              @{status.username}
            </p>
            <p className="text-white/50 text-xs">
              {formatRelativeTime(status.createdAt)} · {formatExpiry(status.expiresAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass rounded-full px-2.5 py-1 flex items-center gap-1">
            <span className="text-white/60 text-xs">👁</span>
            <span className="text-white/80 text-xs font-medium">{status.viewsCount}</span>
          </div>
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
        {/* Poll */}
        {status.poll?.enabled && (
          <div className="pointer-events-auto">
            <PollWidget statusId={status.id} userId={userId} poll={status.poll} />
          </div>
        )}

        <div className="flex items-end justify-between px-4 pb-24 gap-3">
          {/* Left: caption + tap count */}
          <div className="flex-1 min-w-0">
            {status.caption && (
              <p className="text-white font-medium text-base leading-snug drop-shadow-lg line-clamp-3">
                {status.caption}
              </p>
            )}
            {totalTaps > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-white/60 text-sm">⚡</span>
                <span className="text-white/70 text-sm font-medium">
                  {totalTaps.toLocaleString()} taps
                </span>
              </div>
            )}
          </div>

          {/* Right: emoji reaction */}
          <div className="pointer-events-auto flex flex-col items-center gap-4">
            <EmojiReactionPicker statusId={status.id} userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
