"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RACE_STATUS, NITRO_CONFIG, COMBO_TIERS } from "./constants";
import { calculateWpm, calculateAccuracy, smoothMetric } from "./typingEngine";
import { sound } from "@/lib/audio/soundSynth";

export function useTypingEngine({
  text = "",
  raceStatus = RACE_STATUS.IDLE,
  onFinish,
  onKeystroke,
}) {
  const [typedText, setTypedText] = useState("");
  const [mistakes, setMistakes] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [nitro, setNitro] = useState(0);
  const [isNitroActive, setIsNitroActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [streakMilestone, setStreakMilestone] = useState(null);

  const startTimeRef = useRef(null);
  const nitroTimerRef = useRef(null);
  const smoothedWpmRef = useRef(0);
  const milestoneTimeoutRef = useRef(null);

  // State refs to guarantee keydown handler always reads latest state synchronously
  const stateRef = useRef({
    typedText: "",
    mistakes: 0,
    combo: 0,
    maxCombo: 0,
    nitro: 0,
    isNitroActive: false,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    text,
    raceStatus,
  });

  // Keep stateRef synced
  stateRef.current.typedText = typedText;
  stateRef.current.mistakes = mistakes;
  stateRef.current.combo = combo;
  stateRef.current.maxCombo = maxCombo;
  stateRef.current.nitro = nitro;
  stateRef.current.isNitroActive = isNitroActive;
  stateRef.current.totalKeystrokes = totalKeystrokes;
  stateRef.current.correctKeystrokes = correctKeystrokes;
  stateRef.current.text = text;
  stateRef.current.raceStatus = raceStatus;

  // Reset all typing states
  const resetTyping = useCallback(() => {
    setTypedText("");
    setMistakes(0);
    setCombo(0);
    setMaxCombo(0);
    setNitro(0);
    setIsNitroActive(false);
    setWpm(0);
    setAccuracy(100);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setStreakMilestone(null);
    startTimeRef.current = null;
    smoothedWpmRef.current = 0;
    if (nitroTimerRef.current) clearInterval(nitroTimerRef.current);
    if (milestoneTimeoutRef.current) clearTimeout(milestoneTimeoutRef.current);
  }, []);

  // Activate Nitro
  const triggerNitro = useCallback(() => {
    const s = stateRef.current;
    if (s.nitro < 100 || s.isNitroActive || s.raceStatus !== RACE_STATUS.RACING) return;

    setIsNitroActive(true);
    sound.playNitro();

    if (nitroTimerRef.current) clearInterval(nitroTimerRef.current);

    const startTime = Date.now();
    nitroTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / NITRO_CONFIG.DURATION_MS) * 100);
      setNitro(Math.round(remaining));
      if (remaining <= 0) {
        clearInterval(nitroTimerRef.current);
        setIsNitroActive(false);
      }
    }, 50);
  }, []);

  // Handle combo milestone sound and banner
  const checkComboMilestones = useCallback((newCombo) => {
    let tier = null;
    if (newCombo === COMBO_TIERS.TIER_4.count) tier = COMBO_TIERS.TIER_4;
    else if (newCombo === COMBO_TIERS.TIER_3.count) tier = COMBO_TIERS.TIER_3;
    else if (newCombo === COMBO_TIERS.TIER_2.count) tier = COMBO_TIERS.TIER_2;
    else if (newCombo === COMBO_TIERS.TIER_1.count) tier = COMBO_TIERS.TIER_1;

    if (tier) {
      sound.playCombo(
        tier === COMBO_TIERS.TIER_4 ? 4 : tier === COMBO_TIERS.TIER_3 ? 3 : tier === COMBO_TIERS.TIER_2 ? 2 : 1
      );
      setStreakMilestone(tier);
      if (milestoneTimeoutRef.current) clearTimeout(milestoneTimeoutRef.current);
      milestoneTimeoutRef.current = setTimeout(() => {
        setStreakMilestone(null);
      }, 1500);
    }
  }, []);

  // Process keyboard input
  const handleKeyDown = useCallback(
    (e) => {
      const s = stateRef.current;
      if (s.raceStatus !== RACE_STATUS.RACING || !s.text) return;

      // Nitro activation via Shift or Space when Nitro full and expected char isn't Space
      if (e.key === "Shift" || (e.key === " " && s.nitro >= 100 && s.text[s.typedText.length] !== " ")) {
        if (s.nitro >= 100 && !s.isNitroActive) {
          e.preventDefault();
          triggerNitro();
          return;
        }
      }

      // Ignore modifiers, Tab, Alt, Meta, Escape
      if (e.key === "Tab" || e.key === "Control" || e.key === "Alt" || e.key === "Meta" || e.key === "Escape") {
        return;
      }

      // Prevent page scrolling on Spacebar & Backspace navigation
      if (e.key === " " || e.key === "Backspace") {
        e.preventDefault();
      }

      // Handle Backspace
      if (e.key === "Backspace") {
        if (s.typedText.length > 0) {
          const newTyped = s.typedText.slice(0, -1);
          setTypedText(newTyped);
          setCombo(0);
        }
        return;
      }

      // Single printable character input
      if (e.key.length !== 1) return;

      const expectedChar = s.text[s.typedText.length];
      const typedChar = e.key;
      const isCorrect = typedChar === expectedChar;

      // Start timer on first keypress
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      const newTotal = s.totalKeystrokes + 1;
      const newTyped = s.typedText + typedChar; // Advance typed text so user can see errors

      setTotalKeystrokes(newTotal);
      setTypedText(newTyped);

      if (isCorrect) {
        sound.playKeyClick(typedChar === " ");
        const newCorrect = s.correctKeystrokes + 1;
        const newCombo = s.combo + 1;
        const newMax = Math.max(s.maxCombo, newCombo);

        setCorrectKeystrokes(newCorrect);
        setCombo(newCombo);
        setMaxCombo(newMax);

        // Charge Nitro
        if (!s.isNitroActive) {
          const charge = NITRO_CONFIG.CHARGE_PER_CHAR + (newCombo > 10 ? NITRO_CONFIG.CHARGE_PER_COMBO : 0);
          setNitro((prev) => Math.min(NITRO_CONFIG.MAX_NITRO, prev + charge));
        }

        checkComboMilestones(newCombo);

        // Calculate Metrics
        const elapsedMs = Date.now() - startTimeRef.current;
        const rawWpm = calculateWpm(newCorrect, elapsedMs);
        smoothedWpmRef.current = smoothMetric(smoothedWpmRef.current, rawWpm);
        setWpm(smoothedWpmRef.current);
        setAccuracy(calculateAccuracy(newCorrect, newTotal));

        if (onKeystroke) {
          onKeystroke({ isCorrect: true, char: typedChar, combo: newCombo });
        }

        // Check race finish
        if (newTyped.length >= s.text.length) {
          const finalTimeMs = Date.now() - startTimeRef.current;
          const finalWpm = calculateWpm(newCorrect, finalTimeMs);
          const finalAccuracy = calculateAccuracy(newCorrect, newTotal);

          if (onFinish) {
            onFinish({
              wpm: finalWpm,
              accuracy: finalAccuracy,
              maxCombo: newMax,
              mistakes: s.mistakes,
              time: finalTimeMs / 1000,
            });
          }
        }
      } else {
        // Mistake
        sound.playError();
        const newMistakes = s.mistakes + 1;
        setMistakes(newMistakes);
        setCombo(0);

        if (!s.isNitroActive) {
          setNitro((prev) => Math.max(0, prev - NITRO_CONFIG.PENALTY_PER_ERROR));
        }

        setAccuracy(calculateAccuracy(s.correctKeystrokes, newTotal));

        if (onKeystroke) {
          onKeystroke({ isCorrect: false, char: typedChar, combo: 0 });
        }
      }
    },
    [triggerNitro, checkComboMilestones, onKeystroke, onFinish]
  );

  // Global window keyboard listener
  useEffect(() => {
    if (raceStatus !== RACE_STATUS.RACING) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [raceStatus, handleKeyDown]);

  // Calculate progress based on correctly typed characters up to the current length
  let correctCount = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === text[i]) correctCount++;
  }

  return {
    typedText,
    mistakes,
    combo,
    maxCombo,
    nitro,
    isNitroActive,
    wpm,
    accuracy,
    streakMilestone,
    currentIndex: typedText.length,
    progress: text.length > 0 ? (correctCount / text.length) * 100 : 0,
    resetTyping,
    triggerNitro,
    handleKeyDown,
  };
}
