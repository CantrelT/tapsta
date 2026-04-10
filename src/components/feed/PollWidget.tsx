"use client";

import { useState } from "react";
import type { Poll } from "@/lib/types";
import { getPollVote, castPollVote } from "@/store/app-store";

interface PollWidgetProps {
  statusId: string;
  userId: string;
  poll: Poll;
}

export function PollWidget({ statusId, userId, poll }: PollWidgetProps) {
  const [myVote, setMyVote] = useState<string | null>(() =>
    getPollVote(statusId, userId)
  );
  const [votes, setVotes] = useState<Record<string, number>>(poll.votes);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = (option: string) => {
    if (myVote) return;
    castPollVote(statusId, userId, option);
    setMyVote(option);
    setVotes((prev) => ({
      ...prev,
      [option]: (prev[option] ?? 0) + 1,
    }));
  };

  const getPct = (option: string) => {
    if (totalVotes === 0) return 0;
    return Math.round(((votes[option] ?? 0) / totalVotes) * 100);
  };

  return (
    <div className="glass rounded-2xl p-4 mx-4 mb-4">
      <p className="text-white font-semibold text-sm mb-3">{poll.question}</p>
      <div className="flex flex-col gap-2">
        {poll.options.map((option) => {
          const pct = getPct(option);
          const isVoted = myVote === option;
          const hasVoted = myVote !== null;

          return (
            <button
              key={option}
              onClick={() => handleVote(option)}
              disabled={!!myVote}
              className={`relative rounded-xl overflow-hidden text-left transition-all ${
                myVote ? "cursor-default" : "active:scale-[0.98]"
              }`}
            >
              {/* Background fill */}
              {hasVoted && (
                <div
                  className="absolute inset-0 rounded-xl transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: isVoted
                      ? "linear-gradient(135deg, #7c3aed40, #ec489940)"
                      : "rgba(255,255,255,0.08)",
                  }}
                />
              )}
              <div
                className={`relative px-4 py-2.5 flex justify-between items-center border rounded-xl transition-colors ${
                  isVoted
                    ? "border-purple-500/60"
                    : hasVoted
                    ? "border-white/10"
                    : "border-white/20 hover:border-white/40"
                }`}
              >
                <span className="text-white text-sm font-medium">{option}</span>
                {hasVoted && (
                  <span className="text-white/70 text-xs font-bold">{pct}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {myVote && (
        <p className="text-white/40 text-xs mt-2 text-center">
          {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
