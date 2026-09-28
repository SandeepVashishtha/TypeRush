"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RotateCcw, AlertTriangle } from "lucide-react";
import GameCanvas from "@/components/canvas/GameCanvas";
import RaceHUD from "@/components/hud/RaceHUD";
import TypingArea from "@/components/typing/TypingArea";
import Countdown from "@/components/hud/Countdown";
import { useRaceEngine } from "@/lib/game/useRaceEngine";
import { saveRaceResult } from "@/lib/game/statsStorage";

function RaceScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const difficulty = searchParams.get("difficulty") || "normal";
  const passageLength = searchParams.get("length") || "medium";

  const handleRaceFinish = (finalResult) => {
    const { isNewBest } = saveRaceResult(finalResult);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "typeracer_last_result",
        JSON.stringify({ ...finalResult, isNewBest })
      );
    }

    setTimeout(() => {
      router.push("/results");
    }, 1200);
  };

  const {
    raceStatus,
    countdownNum,
    passage,
    playerSpeed,
    playerDistance,
    aiState,
    typing,
    startRace,
  } = useRaceEngine({
    difficulty,
    passageLength,
    onRaceFinished: handleRaceFinish,
  });

  useEffect(() => {
    startRace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleGlobalHotkeys = (e) => {
      if (e.key === "Escape") {
        router.push("/");
      }
    };
    window.addEventListener("keydown", handleGlobalHotkeys);
    return () => window.removeEventListener("keydown", handleGlobalHotkeys);
  }, [router]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 max-w-6xl mx-auto w-full space-y-4 select-none">
      <div className="w-full flex items-center justify-between pb-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> MAIN MENU (ESC)
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">
            RACE TRACK: <strong className="text-arcade-neonCyan">{passage.title}</strong>
          </span>
          <button
            onClick={startRace}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
            title="Restart Race"
          >
            <RotateCcw className="w-3.5 h-3.5 text-arcade-neonYellow" /> RESTART
          </button>
        </div>
      </div>

      <div className="md:hidden w-full p-2.5 rounded-xl border border-amber-900/50 bg-amber-950/40 text-amber-300 text-xs font-semibold flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>Physical keyboard strongly recommended for full arcade racing speed.</span>
      </div>

      <TypingArea
        text={passage.text}
        typedText={typing.typedText}
        raceStatus={raceStatus}
      />

      <div className="relative w-full">
        <Countdown countdownNum={countdownNum} raceStatus={raceStatus} />
        <GameCanvas
          playerDistance={playerDistance}
          playerSpeed={playerSpeed}
          playerWpm={typing.wpm}
          isNitroActive={typing.isNitroActive}
          aiDistance={aiState.distance}
          aiSpeed={aiState.speed}
          aiConfig={aiState.config}
          raceStatus={raceStatus}
          totalRaceDistance={100}
        />
      </div>

      <RaceHUD
        speed={playerSpeed}
        wpm={typing.wpm}
        accuracy={typing.accuracy}
        combo={typing.combo}
        maxCombo={typing.maxCombo}
        nitro={typing.nitro}
        isNitroActive={typing.isNitroActive}
        streakMilestone={typing.streakMilestone}
        playerDistance={playerDistance}
        aiDistance={aiState.distance}
        aiConfig={aiState.config}
        onTriggerNitro={typing.triggerNitro}
      />
    </main>
  );
}

export default function RacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center text-slate-400 font-mono">
          Loading race track...
        </div>
      }
    >
      <RaceScreen />
    </Suspense>
  );
}
