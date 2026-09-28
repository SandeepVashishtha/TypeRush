"use client";

import { Zap, Flame } from "lucide-react";
import { NITRO_CONFIG } from "@/lib/game/constants";

export default function NitroBar({ nitro = 0, isNitroActive = false, onTriggerNitro }) {
  const isFull = nitro >= NITRO_CONFIG.MAX_NITRO;

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs font-bold tracking-wider">
        <div className="flex items-center gap-1.5 text-arcade-nitro">
          <Zap className={`w-4 h-4 ${isFull ? "animate-bounce text-arcade-neonCyan" : ""}`} />
          <span>NITRO BOOST</span>
        </div>
        <span
          className={`text-xs font-mono font-black ${
            isNitroActive
              ? "text-arcade-neonPink animate-pulse"
              : isFull
              ? "text-arcade-neonCyan animate-pulse"
              : "text-slate-400"
          }`}
        >
          {isNitroActive ? "OVERDRIVE ACTIVE!" : isFull ? "READY [SHIFT / SPACE]" : `${Math.round(nitro)}%`}
        </span>
      </div>

      <div
        onClick={isFull && !isNitroActive ? onTriggerNitro : undefined}
        className={`relative h-4 w-full rounded-full bg-slate-950 p-0.5 border overflow-hidden cursor-pointer transition-all duration-300 ${
          isNitroActive
            ? "border-arcade-neonPink shadow-neon-pink"
            : isFull
            ? "border-arcade-neonCyan shadow-nitro-glow animate-pulse"
            : "border-slate-800"
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-150 flex items-center justify-end pr-1 ${
            isNitroActive
              ? "bg-gradient-to-r from-arcade-neonCyan via-arcade-neonPink to-arcade-neonYellow"
              : isFull
              ? "bg-gradient-to-r from-cyan-500 to-arcade-neonCyan"
              : "bg-gradient-to-r from-slate-700 to-arcade-nitro"
          }`}
          style={{ width: `${Math.min(100, Math.max(0, nitro))}%` }}
        >
          {isFull && <Flame className="w-3 h-3 text-white fill-white animate-spin" />}
        </div>
      </div>
    </div>
  );
}
