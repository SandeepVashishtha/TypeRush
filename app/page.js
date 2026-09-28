"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Trophy, Shield, Award, Sparkles, Zap } from "lucide-react";
import { DIFFICULTY_CONFIG } from "@/lib/game/constants";
import { getCareerStats } from "@/lib/game/statsStorage";
import LeaderboardModal from "@/components/ui/LeaderboardModal";

export default function HomePage() {
  const [difficulty, setDifficulty] = useState("normal");
  const [passageLength, setPassageLength] = useState("medium");
  const [stats, setStats] = useState({ bestWpm: 0, totalRaces: 0, wins: 0, bestAccuracy: 0, history: [] });
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  useEffect(() => {
    setStats(getCareerStats());
  }, []);

  const difficulties = Object.values(DIFFICULTY_CONFIG);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8 select-none">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-arcade-border bg-slate-900/80 backdrop-blur-sm text-arcade-neonCyan text-xs md:text-sm font-bold tracking-widest uppercase shadow-md">
        <Zap className="w-4 h-4 animate-bounce" /> ARCADE TYPING SPEED BATTLE
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-arcade-neonCyan via-white to-arcade-neonPink drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
          TYPE RACER
        </h1>
        <p className="text-lg md:text-2xl font-semibold text-slate-400">
          Type faster. <span className="text-arcade-neonYellow font-black">Drive faster.</span> Defeat AI rivals.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 rounded-2xl border-2 border-arcade-border bg-slate-900/80 backdrop-blur-md space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wider uppercase text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-arcade-neonCyan" /> Select Rival Difficulty
            </h2>
            <span className="text-xs font-mono font-bold text-arcade-neonPink">
              {DIFFICULTY_CONFIG[difficulty]?.name.toUpperCase()} AI
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {difficulties.map((diff) => {
              const isSelected = difficulty === diff.id;
              return (
                <button
                  key={diff.id}
                  onClick={() => setDifficulty(diff.id)}
                  className={`flex flex-col items-center p-3.5 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? "border-arcade-neonCyan bg-slate-800/90 shadow-neon-cyan scale-[1.02]"
                      : "border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full mb-2 shadow-sm"
                    style={{ backgroundColor: diff.carColor }}
                  />
                  <span className="text-sm font-black text-slate-100">{diff.name}</span>
                  <span className="text-[11px] font-mono font-bold text-slate-400 mt-1">
                    {diff.minWpm}-{diff.maxWpm} WPM
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{diff.carName}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Race Track Distance:</span>
            <div className="flex gap-2">
              {[
                { id: "short", label: "Sprint (~25w)" },
                { id: "medium", label: "Standard (~55w)" },
                { id: "long", label: "Endurance (~90w)" },
              ].map((len) => (
                <button
                  key={len.id}
                  onClick={() => setPassageLength(len.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    passageLength === len.id
                      ? "bg-arcade-neonCyan text-slate-950 shadow-neon-cyan"
                      : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  {len.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border-2 border-arcade-border bg-slate-900/80 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <h2 className="text-sm font-black tracking-wider uppercase text-slate-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-arcade-neonYellow" /> Driver Stats
            </h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-bold text-slate-400">BEST SPEED:</span>
                <span className="text-lg font-mono font-black text-arcade-neonCyan">
                  {stats.bestWpm > 0 ? `${stats.bestWpm} WPM` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-bold text-slate-400">BEST ACCURACY:</span>
                <span className="text-lg font-mono font-black text-arcade-neonPink">
                  {stats.bestAccuracy > 0 ? `${stats.bestAccuracy}%` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-bold text-slate-400">TOTAL RACES:</span>
                <span className="text-lg font-mono font-black text-arcade-neonYellow">
                  {stats.totalRaces}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4 text-arcade-neonYellow" /> VIEW CAREER LOGS
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-2">
        <Link
          href={`/race?difficulty=${difficulty}&length=${passageLength}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-xl text-slate-950 bg-gradient-to-r from-arcade-neonCyan via-cyan-400 to-arcade-neonCyan hover:from-cyan-300 hover:to-cyan-400 shadow-neon-cyan transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200 uppercase tracking-wider"
        >
          <Play className="w-6 h-6 fill-slate-950" /> START RACE
        </Link>
        <button
          disabled
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl font-bold text-sm text-slate-500 border border-slate-800 bg-slate-900/50 cursor-not-allowed uppercase tracking-wider"
        >
          <Sparkles className="w-4 h-4" /> MULTIPLAYER (SOON)
        </button>
      </div>

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        stats={stats}
      />
    </main>
  );
}
