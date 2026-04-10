"use client";

import { useState } from "react";
import { TapstaLogo } from "@/components/ui/TapstaLogo";
import { login } from "@/store/app-store";
import type { User } from "@/lib/types";

interface AuthScreenProps {
  onAuth: (user: User) => void;
}

type AuthStep = "phone" | "otp";

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (phone.trim().length < 8) {
      setError("Enter a valid phone number");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate OTP send
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("otp");
  };

  const handleVerifyOtp = async () => {
    if (otp.trim().length < 4) {
      setError("Enter the 6-digit code");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate OTP verify
    await new Promise((r) => setTimeout(r, 1000));
    const user = login(phone);
    setLoading(false);
    onAuth(user);
  };

  return (
    <div className="min-h-dvh bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-sm flex flex-col gap-8" style={{ animation: "fade-in-up 0.5s ease-out" }}>
        {/* Logo */}
        <div className="text-center">
          <TapstaLogo size="md" showTagline />
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <h2 className="text-white text-xl font-bold">
              {step === "phone" ? "Enter your number" : "Verify your number"}
            </h2>
            <p className="text-white/40 text-sm mt-1">
              {step === "phone"
                ? "We'll send you a one-time code"
                : `Code sent to ${phone}`}
            </p>
          </div>

          {step === "phone" ? (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="glass rounded-xl px-3 py-4 text-white/60 text-sm flex items-center border border-white/10">
                  🇳🇬 +234
                </div>
                <input
                  type="tel"
                  placeholder="812 345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  className="flex-1 glass rounded-xl px-4 py-4 text-white placeholder-white/30 text-base border border-white/10 focus:border-purple-500/60 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                }}
              >
                {loading ? "Sending..." : "Send Code"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                type="number"
                inputMode="numeric"
                placeholder="_ _ _ _ _ _"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                className="w-full glass rounded-xl px-4 py-4 text-white placeholder-white/30 text-center text-2xl font-bold tracking-widest border border-white/10 focus:border-purple-500/60 focus:outline-none transition-colors"
                autoFocus
              />

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                }}
              >
                {loading ? "Verifying..." : "Verify & Enter"}
              </button>

              <button
                onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                className="text-white/40 text-sm text-center"
              >
                Change number
              </button>
            </div>
          )}
        </div>

        <p className="text-white/20 text-xs text-center">
          By continuing you agree to Tapsta&apos;s Terms of Service
        </p>
      </div>
    </div>
  );
}
