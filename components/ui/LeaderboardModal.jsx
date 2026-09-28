"use client";

import { Trophy, X } from "lucide-react";

export default function LeaderboardModal({ isOpen, onClose, stats }) {
  if (!isOpen) return null;

  const winRate = stats.totalRaces > 0 ? Math.round((stats.wins / stats.totalRaces) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-xl rounded-2xl border-2 border-arcade-border bg-slate-900 p-6 md:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-yellow-950/60 border border-yellow-700/50 text-arcade-neonYellow">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic tracking-tight text-white">CAREER STATS & RECORDS</h2>
            <p className="text-xs text-slate-400 font-semibold">Your local race history and personal bests</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase">BEST SPEED</span>
            <div className="text-2xl font-mono font-black text-arcade-neonCyan">{stats.bestWpm} <span className="text-xs">WPM</span></div>
          </div>
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase">WIN RATE</span>
            <div className="text-2xl font-mono font-black text-arcade-neonGreen">{winRate}%</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase">BEST ACCURACY</span>
            <div className="text-2xl font-mono font-black text-arcade-neonPink">{stats.bestAccuracy}%</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase">TOTAL RACES</span>
            <div className="text-2xl font-mono font-black text-arcade-neonYellow">{stats.totalRaces}</div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Recent Matches</h3>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {stats.history && stats.history.length > 0 ? (
              stats.history.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-950/40 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-black ${
                        item.position === 1
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-rose-950 text-rose-400 border border-rose-800"
                      }`}
                    >
                      {item.position === 1 ? "1ST" : "2ND"}
                    </span>
                    <span className="text-slate-300 capitalize font-sans font-bold">{item.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <span className="text-arcade-neonCyan font-bold">{item.wpm} WPM</span>
                    <span>{item.accuracy}%</span>
                    <span>{Number(item.time).toFixed(1)}s</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-slate-500 font-semibold">
                No races completed yet. Hit the track and set your first record!
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}
