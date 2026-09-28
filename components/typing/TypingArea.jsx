"use client";

import { useEffect, useRef } from "react";
import { buildCharacterStream } from "@/lib/game/typingEngine";
import { RACE_STATUS } from "@/lib/game/constants";
import { Keyboard, Sparkles } from "lucide-react";

/**
 * Arcade Single-Line Horizontal Streaming Typing Tape
 * Positioned at the top for maximum visibility with smooth horizontal auto-tracking
 */
export default function TypingArea({
  text = "",
  typedText = "",
  raceStatus = RACE_STATUS.IDLE,
}) {
  const containerRef = useRef(null);
  const currentCursorRef = useRef(null);
  const inputRef = useRef(null);

  const characters = buildCharacterStream(text, typedText);

  // Auto-focus on start
  useEffect(() => {
    if (raceStatus === RACE_STATUS.RACING && inputRef.current) {
      inputRef.current.focus();
    }
  }, [raceStatus]);

  // Smoothly center the active character horizontally in the single-line tape
  useEffect(() => {
    if (currentCursorRef.current && containerRef.current) {
      const container = containerRef.current;
      const cursor = currentCursorRef.current;
      const cursorLeft = cursor.offsetLeft;
      const containerWidth = container.clientWidth;

      // Keep active cursor centered at 35% of the viewport width
      const targetScrollLeft = cursorLeft - containerWidth * 0.35;
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: "smooth",
      });
    }
  }, [typedText.length]);

  const handleCardClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Find upcoming word for top preview indicator
  const remainingText = text.slice(typedText.length).trim();
  const nextWord = remainingText.split(" ")[0] || "";

  return (
    <div
      className="w-full flex flex-col space-y-2 select-none"
      onClick={handleCardClick}
    >
      {/* Invisible focus anchor */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute -top-9999px left-0 pointer-events-none h-0 w-0"
        aria-hidden="true"
        tabIndex={-1}
        readOnly
      />

      {/* Top Telemetry & Current Word Bar */}
      <div className="flex items-center justify-between px-2 text-xs font-bold tracking-wider text-slate-400">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-arcade-neonCyan animate-pulse" />
          <span className="uppercase text-slate-300">TYPESTREAM:</span>
          {nextWord && (
            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-arcade-neonYellow font-mono font-black text-xs">
              {nextWord}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 text-arcade-neonCyan">
            <span className="w-2 h-2 rounded-full bg-arcade-neonCyan shadow-neon-cyan" /> CORRECT
          </span>
          <span className="flex items-center gap-1.5 text-arcade-neonPink">
            <span className="w-2 h-2 rounded-full bg-arcade-neonPink" /> ERROR
          </span>
        </div>
      </div>

      {/* Single-Line Streaming Marquee Tape */}
      <div
        className={`relative w-full rounded-2xl border-2 transition-all duration-300 p-4 md:p-5 shadow-2xl overflow-hidden ${
          raceStatus === RACE_STATUS.RACING
            ? "border-arcade-neonCyan/70 bg-slate-900/95 shadow-[0_0_30px_rgba(0,240,255,0.25)] ring-1 ring-arcade-neonCyan/30"
            : "border-arcade-border bg-slate-950/90"
        }`}
      >
        {/* Left & Right Fade Vignettes for continuous ticker effect */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />

        {/* Horizontal Text Track */}
        <div
          ref={containerRef}
          className="w-full overflow-x-hidden whitespace-nowrap scroll-smooth flex items-center font-mono text-2xl md:text-3xl font-medium tracking-wide py-1"
          style={{ scrollbarWidth: "none" }}
        >
          {characters.map((item) => {
            const isCurrent = item.status === "current";
            const isCorrect = item.status === "correct";
            const isIncorrect = item.status === "incorrect";

            let charClass = "text-slate-500 opacity-60";
            let bgClass = "";

            if (isCorrect) {
              charClass = "text-arcade-neonCyan font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.7)] opacity-100";
            } else if (isIncorrect) {
              charClass = "text-arcade-neonPink font-black underline decoration-wavy decoration-arcade-neonPink opacity-100";
              bgClass = "bg-arcade-neonPink/25 rounded-md px-0.5";
            } else if (isCurrent) {
              charClass = "text-slate-100 font-black opacity-100";
              bgClass = "bg-arcade-neonCyan/30 rounded-md border-b-4 border-arcade-neonCyan shadow-neon-cyan animate-pulse px-1";
            }

            return (
              <span
                key={item.index}
                ref={isCurrent ? currentCursorRef : null}
                className={`inline-block transition-colors duration-75 select-none ${charClass} ${bgClass}`}
              >
                {item.isSpace ? "\u00A0" : item.char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
