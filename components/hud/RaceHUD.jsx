"use client";

import { Gauge, Target, Volume2, VolumeX } from "lucide-react";
import NitroBar from "./NitroBar";
import ComboCounter from "./ComboCounter";
import { sound } from "@/lib/audio/soundSynth";
import { useState } from "react";

export default function RaceHUD({
  speed = 0,
  wpm = 0,
  accuracy = 100,
  combo = 0,
  maxCombo = 0,
  nitro = 0,
  isNitroActive = false,
  streakMilestone = null,
  playerDistance = 0,
  aiDistance = 0,
  aiConfig = {},
  onTriggerNitro,
}) {
  const [isMuted, setIsMuted] = useState(() => sound.isMuted);

  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const isLeading = playerDistance >= aiDistance;

  return (
    <div className="w-full flex flex-col space-y-4 select-none">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-arcade-border bg-slate-900/80 backdrop-blur-sm shadow-md">
          <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-arcade-neonCyan">
            <Gauge className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SPEED (WPM)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl md:text-3xl font-mono font-black text-slate-100">{wpm}</span>
              <span className="text-[10px] font-bold text-arcade-neonCyan">WPM</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-arcade-border bg-slate-900/80 backdrop-blur-sm shadow-md">
          <div className="p-2.5 rounded-lg bg-pink-950/60 border border-pink-800/50 text-arcade-neonPink">
            <Target className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ACCURACY</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl md:text-3xl font-mono font-black text-slate-100">{accuracy}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-arcade-border bg-slate-900/80 backdrop-blur-sm shadow-md">
          <ComboCounter combo={combo} maxCombo={maxCombo} streakMilestone={streakMilestone} />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">POSITION</span>
            <span
              className={`text-lg font-black italic tracking-tighter ${
                isLeading ? "text-arcade-neonYellow" : "text-slate-400"
              }`}
            >
              {isLeading ? "1ST PLACE" : "2ND PLACE"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-arcade-border bg-slate-900/80 backdrop-blur-sm shadow-md">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">EST. SPEED</span>
            <span className="text-2xl md:text-3xl font-mono font-black text-arcade-neonCyan">
              {speed} <span className="text-xs font-bold text-slate-500">MPH</span>
            </span>
          </div>

          <button
            onClick={handleToggleMute}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-arcade-neonPink" /> : <Volume2 className="w-5 h-5 text-arcade-neonCyan" />}
          </button>
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-arcade-border bg-slate-900/60 backdrop-blur-sm">
        <NitroBar nitro={nitro} isNitroActive={isNitroActive} onTriggerNitro={onTriggerNitro} />
      </div>

      <div className="relative p-3 rounded-xl border border-arcade-border bg-slate-950/80 flex flex-col space-y-2">
        <div className="flex justify-between text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          <span>START</span>
          <span>RACE PROGRESS</span>
          <span className="text-arcade-neonYellow">FINISH 🏁</span>
        </div>

        <div className="relative h-2 w-full rounded-full bg-slate-900 border border-slate-800">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[8px] font-black transition-all duration-100"
            style={{
              left: `calc(${Math.min(98, Math.max(0, aiDistance))}% - 8px)`,
              backgroundColor: aiConfig.carColor || "#a855f7",
            }}
            title={`AI: ${aiConfig.carName}`}
          >
            AI
          </div>
        </div>

        <div className="relative h-2 w-full rounded-full bg-slate-900 border border-slate-800">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-arcade-neonPink border-2 border-white shadow-neon-pink flex items-center justify-center text-[8px] font-black text-white transition-all duration-100"
            style={{
              left: `calc(${Math.min(98, Math.max(0, playerDistance))}% - 8px)`,
            }}
            title="Player (YOU)"
          >
            P1
          </div>
        </div>
      </div>
    </div>
  );
}
