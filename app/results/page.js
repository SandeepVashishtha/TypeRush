"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Trophy, RotateCcw, Home, Sparkles, Target, Flame, Clock, AlertCircle, Award } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = sessionStorage.getItem("typeracer_last_result");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setResult(parsed);

          if (parsed.position === 1) {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#00f0ff", "#ff0055", "#ffe600", "#a855f7", "#38bdf8"],
            });
          }
        } catch {
          router.push("/");
        }
      } else {
        router.push("/");
      }
    }
  }, [router]);

  if (!result) {
    return (
      <main className="flex-1 flex items-center justify-center text-slate-400 font-mono">
        Calculating race results...
      </main>
    );
  }

  const isWinner = result.position === 1;

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-3xl mx-auto w-full space-y-6 select-none animate-fade-in">
      <div className="w-full flex flex-col items-center text-center space-y-3">
        {result.isNewBest && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-arcade-neonYellow bg-yellow-950/80 text-arcade-neonYellow text-xs font-black tracking-widest uppercase shadow-neon-yellow animate-bounce">
            <Sparkles className="w-4 h-4" /> 🔥 NEW PERSONAL BEST!
          </div>
        )}

        <div className="flex items-center justify-center">
          <div
            className={`p-5 rounded-3xl border-2 ${
              isWinner
                ? "border-arcade-neonYellow bg-yellow-950/40 text-arcade-neonYellow shadow-neon-yellow animate-pulse"
                : "border-slate-700 bg-slate-900/60 text-slate-400"
            }`}
          >
            <Trophy className="w-16 h-16" />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            RACE RESULT • {result.passageTitle || "CIRCUIT RACE"}
          </span>
          <h1
            className={`text-5xl md:text-6xl font-black italic tracking-tighter ${
              isWinner
                ? "text-transparent bg-clip-text bg-gradient-to-r from-arcade-neonYellow via-white to-arcade-neonCyan drop-shadow-lg"
                : "text-slate-300"
            }`}
          >
            {isWinner ? "🏆 1ST PLACE VICTORY" : "🥈 2ND PLACE FINISH"}
          </h1>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-arcade-neonCyan" /> FINAL SPEED
          </div>
          <div className="text-4xl font-mono font-black text-arcade-neonCyan mt-1">
            {result.wpm} <span className="text-sm font-bold text-slate-500">WPM</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-arcade-neonPink" /> ACCURACY
          </div>
          <div className="text-4xl font-mono font-black text-slate-100 mt-1">
            {result.accuracy}%
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-arcade-neonYellow" /> MAX STREAK
          </div>
          <div className="text-4xl font-mono font-black text-arcade-neonYellow mt-1">
            x{result.maxCombo || 0}
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> TOTAL TIME
          </div>
          <div className="text-3xl font-mono font-black text-slate-200 mt-1">
            {Number(result.time).toFixed(2)}s
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> MISTAKES
          </div>
          <div className="text-3xl font-mono font-black text-rose-400 mt-1">
            {result.mistakes}
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase">DIFFICULTY</div>
          <div className="text-2xl font-black text-arcade-neonPurple capitalize mt-1">
            {result.difficulty}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center pt-3">
        <Link
          href={`/race?difficulty=${result.difficulty || "normal"}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-black text-lg text-slate-950 bg-gradient-to-r from-arcade-neonCyan to-cyan-400 hover:from-cyan-300 hover:to-arcade-neonCyan shadow-neon-cyan transform hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wider"
        >
          <RotateCcw className="w-5 h-5 fill-slate-950" /> RACE AGAIN
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm text-slate-300 border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors uppercase tracking-wider"
        >
          <Home className="w-4 h-4" /> MAIN MENU
        </Link>
      </div>
    </main>
  );
}
