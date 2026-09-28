"use client";

import { Flame, Sparkles } from "lucide-react";

export default function ComboCounter({ combo = 0, maxCombo = 0, streakMilestone = null }) {
  const isHyperspeed = combo >= 30;
  const isPerfect = combo >= 20;
  const isHot = combo >= 10;
  const isStreak = combo >= 5;

  let badgeColor = "border-slate-800 text-slate-400 bg-slate-900/60";
  if (isHyperspeed) {
    badgeColor = "border-arcade-neonPink text-arcade-neonPink bg-slate-900/90 shadow-neon-pink animate-pulse";
  } else if (isPerfect) {
    badgeColor = "border-arcade-neonYellow text-arcade-neonYellow bg-slate-900/90 shadow-neon-yellow";
  } else if (isHot) {
    badgeColor = "border-arcade-neonCyan text-arcade-neonCyan bg-slate-900/90 shadow-neon-cyan";
  } else if (isStreak) {
    badgeColor = "border-arcade-nitro text-arcade-nitro bg-slate-900/80";
  }

  return (
    <div className="relative flex flex-col items-center">
      {streakMilestone && (
        <div className="absolute -top-10 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/95 border-2 border-arcade-neonYellow shadow-neon-yellow animate-bounce text-xs font-black text-arcade-neonYellow tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{streakMilestone.label}!</span>
        </div>
      )}

      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${badgeColor}`}>
        <Flame
          className={`w-5 h-5 ${
            isHyperspeed ? "animate-bounce text-arcade-neonPink" : isStreak ? "text-arcade-neonYellow" : "text-slate-600"
          }`}
        />
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">COMBO</span>
          <span className="text-xl font-mono font-black tracking-tight leading-none">
            x{combo}
          </span>
        </div>
      </div>
    </div>
  );
}
