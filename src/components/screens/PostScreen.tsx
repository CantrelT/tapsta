"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { User, Status } from "@/lib/types";
import { TapstaLogo } from "@/components/ui/TapstaLogo";

interface PostScreenProps {
  currentUser: User;
  onPostCreated: (status: Status) => void;
}

export function PostScreen({ currentUser, onPostCreated }: PostScreenProps) {
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [caption, setCaption] = useState("");
  const [pollEnabled, setPollEnabled] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOpt1, setPollOpt1] = useState("Yes");
  const [pollOpt2, setPollOpt2] = useState("No");
  const [revealEnabled, setRevealEnabled] = useState(false);
  const [revealTaps, setRevealTaps] = useState(5);
  const [revealPreview, setRevealPreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const revealFileRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
  };

  const handleRevealSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRevealPreview(URL.createObjectURL(file));
  };

  const handlePost = async () => {
    if (!mediaPreview) return;
    setPosting(true);
    await new Promise((r) => setTimeout(r, 1000));

    const now = Date.now();
    const newStatus: Status = {
      id: `status_${now}`,
      userId: currentUser.id,
      username: currentUser.username,
      avatarUrl: currentUser.avatarUrl,
      mediaUrl: mediaPreview,
      mediaType,
      caption,
      createdAt: now,
      expiresAt: now + 1000 * 60 * 60 * 24,
      viewsCount: 0,
      ...(pollEnabled && pollQuestion
        ? {
            poll: {
              enabled: true,
              question: pollQuestion,
              options: [pollOpt1 || "Option 1", pollOpt2 || "Option 2"],
              votes: { [pollOpt1 || "Option 1"]: 0, [pollOpt2 || "Option 2"]: 0 },
            },
          }
        : {}),
      ...(revealEnabled && revealPreview
        ? {
            tapToReveal: {
              enabled: true,
              tapCountRequired: revealTaps,
              revealedMediaUrl: revealPreview,
            },
          }
        : {}),
    };

    setPosting(false);
    setPosted(true);
    setTimeout(() => {
      onPostCreated(newStatus);
      // Reset
      setMediaPreview(null);
      setCaption("");
      setPollEnabled(false);
      setPollQuestion("");
      setPollOpt1("Yes");
      setPollOpt2("No");
      setRevealEnabled(false);
      setRevealPreview(null);
      setRevealTaps(5);
      setPosted(false);
    }, 1200);
  };

  return (
    <div className="min-h-dvh bg-black flex flex-col overflow-y-auto pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 flex items-center justify-between">
        <TapstaLogo size="sm" />
        <h2 className="text-white font-semibold">New Tapsta</h2>
        <div className="w-16" />
      </div>

      <div className="flex flex-col gap-5 px-4">
        {/* Media picker */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleMediaSelect}
          className="hidden"
        />

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 relative transition-all active:scale-[0.98]"
          style={{
            background: mediaPreview ? "transparent" : "rgba(255,255,255,0.04)",
          }}
        >
          {mediaPreview ? (
            <Image
              src={mediaPreview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ background: "linear-gradient(135deg, #7c3aed40, #ec489940)" }}
              >
                📸
              </div>
              <p className="text-white/60 text-sm font-medium">Tap to add photo or video</p>
            </>
          )}
        </button>

        {/* Caption */}
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's happening? 🔥"
            rows={2}
            maxLength={150}
            className="w-full glass rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm border border-white/10 focus:border-purple-500/60 focus:outline-none resize-none transition-colors"
          />
          <p className="text-white/30 text-xs text-right mt-1">{caption.length}/150</p>
        </div>

        {/* Poll toggle */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🗳️</span>
              <div>
                <p className="text-white font-medium text-sm">Add Poll</p>
                <p className="text-white/40 text-xs">2 options, one vote per person</p>
              </div>
            </div>
            <button
              onClick={() => setPollEnabled((v) => !v)}
              className="relative w-12 h-6 rounded-full transition-colors duration-200"
              style={{
                background: pollEnabled
                  ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                  : "rgba(255,255,255,0.15)",
              }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                style={{ left: pollEnabled ? "calc(100% - 1.375rem)" : "0.125rem" }}
              />
            </button>
          </div>

          {pollEnabled && (
            <div className="flex flex-col gap-2">
              <input
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Ask your question..."
                className="glass rounded-xl px-3 py-2.5 text-white placeholder-white/30 text-sm border border-white/10 focus:border-purple-500/40 focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={pollOpt1}
                  onChange={(e) => setPollOpt1(e.target.value)}
                  placeholder="Option 1"
                  className="glass rounded-xl px-3 py-2.5 text-white placeholder-white/30 text-sm border border-white/10 focus:border-purple-500/40 focus:outline-none"
                />
                <input
                  value={pollOpt2}
                  onChange={(e) => setPollOpt2(e.target.value)}
                  placeholder="Option 2"
                  className="glass rounded-xl px-3 py-2.5 text-white placeholder-white/30 text-sm border border-white/10 focus:border-purple-500/40 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tap-to-reveal toggle */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">👀</span>
              <div>
                <p className="text-white font-medium text-sm">Tap-to-Reveal</p>
                <p className="text-white/40 text-xs">Unlock hidden content with taps</p>
              </div>
            </div>
            <button
              onClick={() => setRevealEnabled((v) => !v)}
              className="relative w-12 h-6 rounded-full transition-colors duration-200"
              style={{
                background: revealEnabled
                  ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                  : "rgba(255,255,255,0.15)",
              }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                style={{ left: revealEnabled ? "calc(100% - 1.375rem)" : "0.125rem" }}
              />
            </button>
          </div>

          {revealEnabled && (
            <div className="flex flex-col gap-3">
              {/* Tap count slider */}
              <div>
                <p className="text-white/60 text-xs mb-2">
                  Taps required to unlock: <span className="text-white font-bold">{revealTaps}</span>
                </p>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={revealTaps}
                  onChange={(e) => setRevealTaps(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Reveal media picker */}
              <input
                ref={revealFileRef}
                type="file"
                accept="image/*"
                onChange={handleRevealSelect}
                className="hidden"
              />
              <button
                onClick={() => revealFileRef.current?.click()}
                className="w-full rounded-xl overflow-hidden border border-dashed border-white/20 flex items-center gap-3 px-4 py-3 transition-all active:opacity-70"
                style={{ background: revealPreview ? "transparent" : "rgba(255,255,255,0.04)" }}
              >
                {revealPreview ? (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={revealPreview} alt="Reveal" fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
                    🔓
                  </div>
                )}
                <div className="text-left">
                  <p className="text-white/80 text-sm font-medium">
                    {revealPreview ? "Change reveal photo" : "Upload reveal photo"}
                  </p>
                  <p className="text-white/40 text-xs">Shown after {revealTaps} taps</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Post button */}
        {posted ? (
          <div className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-green-500/20 border border-green-500/30">
            <span className="text-green-400 font-semibold">Posted! Going live... ✓</span>
          </div>
        ) : (
          <button
            onClick={handlePost}
            disabled={!mediaPreview || posting}
            className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all active:scale-[0.98] disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            }}
          >
            {posting ? "Posting..." : "Post Tapsta ⚡"}
          </button>
        )}
      </div>
    </div>
  );
}
