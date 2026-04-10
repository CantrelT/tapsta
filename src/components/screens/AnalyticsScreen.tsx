"use client";

import { useState } from "react";
import Image from "next/image";
import type { User, Status, EmojiType } from "@/lib/types";
import { getTotalTaps, getReactionCounts } from "@/store/app-store";
import { MOCK_ANALYTICS } from "@/lib/mock-data";
import { TapstaLogo } from "@/components/ui/TapstaLogo";
import { Avatar } from "@/components/ui/Avatar";

function formatTimeLeft(expiresAt: number, now: number): string {
  const remaining = expiresAt - now;
  const hours = Math.floor(remaining / 3600000);
  const mins = Math.floor((remaining % 3600000) / 60000);
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

interface AnalyticsScreenProps {
  currentUser: User;
  statuses: Status[];
}

function StatBadge({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-1">
      <span className="text-2xl">{icon}</span>
      <span className="text-white font-bold text-2xl">{value}</span>
      <span className="text-white/50 text-xs">{label}</span>
    </div>
  );
}

export function AnalyticsScreen({ currentUser, statuses }: AnalyticsScreenProps) {
  const myStatuses = statuses.filter((s) => s.userId === currentUser.id);
  const [selectedId, setSelectedId] = useState<string | null>(
    myStatuses[0]?.id ?? null
  );

  const selected = myStatuses.find((s) => s.id === selectedId);
  const analytics = MOCK_ANALYTICS.find((a) => a.statusId === selectedId);

  const totalViews = myStatuses.reduce((s, st) => s + st.viewsCount, 0);
  const totalTaps = myStatuses.reduce((s, st) => s + getTotalTaps(st.id), 0);

  const reactions = selected ? getReactionCounts(selected.id) : null;
  const reactionsFromAnalytics = analytics?.reactions;
  const displayReactions = reactionsFromAnalytics ?? reactions;

  const [now] = useState(() => Date.now());

  return (
    <div className="min-h-dvh bg-black flex flex-col pb-28 overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <TapstaLogo size="sm" />
        <h2 className="text-white text-xl font-bold mt-4">Your Stats</h2>
        <p className="text-white/40 text-sm">All your Tapsta activity</p>
      </div>

      {/* Overview stats */}
      <div className="px-4 grid grid-cols-3 gap-3 mb-6">
        <StatBadge icon="📸" label="Tapstaz" value={myStatuses.length} />
        <StatBadge icon="👁" label="Views" value={totalViews.toLocaleString()} />
        <StatBadge icon="⚡" label="Taps" value={totalTaps.toLocaleString()} />
      </div>

      {myStatuses.length === 0 ? (
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <span className="text-5xl">📭</span>
          <p className="text-white/60 text-sm">Post your first Tapsta to see stats</p>
        </div>
      ) : (
        <>
          {/* Status list */}
          <div className="px-4 mb-6">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Your Tapstaz</p>
            <div className="flex flex-col gap-2">
              {myStatuses.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setSelectedId(status.id)}
                  className={`flex items-center gap-3 rounded-2xl p-3 transition-all text-left ${
                    selectedId === status.id
                      ? "border border-purple-500/60"
                      : "border border-white/10"
                  }`}
                  style={{
                    background:
                      selectedId === status.id
                        ? "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))"
                        : "rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={status.mediaUrl}
                      alt={status.caption}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {status.caption || "No caption"}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-white/50 text-xs">👁 {status.viewsCount}</span>
                      <span className="text-white/50 text-xs">⚡ {getTotalTaps(status.id)}</span>
                      <span className="text-white/30 text-xs">{formatTimeLeft(status.expiresAt, now)} left</span>
                    </div>
                  </div>
                  {selectedId === status.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed analytics */}
          {selected && (
            <div className="px-4 flex flex-col gap-4">
              <p className="text-white/50 text-xs uppercase tracking-wider">Detailed Stats</p>

              {/* Top tappers */}
              {analytics && analytics.topTappers.length > 0 && (
                <div className="glass rounded-2xl p-4">
                  <p className="text-white font-semibold text-sm mb-3">Top Tappers ⚡</p>
                  <div className="flex flex-col gap-2.5">
                    {analytics.topTappers.map((tapper, i) => (
                      <div key={tapper.userId} className="flex items-center gap-3">
                        <span className="text-white/40 text-xs w-4 text-right">{i + 1}</span>
                        <Avatar src={tapper.avatarUrl} alt={tapper.username} size={32} />
                        <span className="flex-1 text-white text-sm">@{tapper.username}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-purple-400 text-sm font-bold">{tapper.tapCount}</span>
                          <span className="text-white/40 text-xs">taps</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Poll results */}
              {selected.poll?.enabled && (
                <div className="glass rounded-2xl p-4">
                  <p className="text-white font-semibold text-sm mb-1">Poll Results 🗳️</p>
                  <p className="text-white/50 text-xs mb-3">{selected.poll.question}</p>
                  {selected.poll.options.map((option) => {
                    const total = Object.values(selected.poll!.votes).reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? Math.round((selected.poll!.votes[option] ?? 0) / total * 100) : 0;
                    return (
                      <div key={option} className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/80">{option}</span>
                          <span className="text-white/60">{pct}% · {selected.poll!.votes[option] ?? 0} votes</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Reactions breakdown */}
              {displayReactions && (
                <div className="glass rounded-2xl p-4">
                  <p className="text-white font-semibold text-sm mb-3">Reactions 😊</p>
                  <div className="flex justify-between">
                    {(Object.entries(displayReactions) as [EmojiType, number][]).map(([emoji, count]) => (
                      <div key={emoji} className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{emoji}</span>
                        <span className="text-white/70 text-xs font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
