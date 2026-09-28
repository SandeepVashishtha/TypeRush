"use client";

import { RACE_STATUS } from "@/lib/game/constants";

export default function Countdown({ countdownNum, raceStatus }) {
  if (raceStatus !== RACE_STATUS.COUNTDOWN) return null;

  const isGo = countdownNum === "GO!";

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm pointer-events-none select-none">
      <div className="relative flex flex-col items-center">
        <div
          key={String(countdownNum)}
          className={`absolute inset-0 rounded-full border-4 animate-ping ${
            isGo ? "border-arcade-neonGreen scale-150" : "border-arcade-neonYellow scale-125"
          }`}
        />

        <div
          key={`num-${countdownNum}`}
          className={`text-8xl md:text-9xl font-black italic tracking-tighter transform transition-all duration-300 animate-bounce drop-shadow-[0_0_35px_rgba(0,240,255,0.8)] ${
            isGo
              ? "text-arcade-neonGreen neon-text-cyan scale-110"
              : "text-arcade-neonYellow neon-text-yellow"
          }`}
        >
          {countdownNum}
        </div>

        <p className="mt-4 text-sm md:text-base font-bold tracking-widest text-slate-300 uppercase">
          {isGo ? "FLOOR IT!" : "PREPARE TO TYPE"}
        </p>
      </div>
    </div>
  );
}
