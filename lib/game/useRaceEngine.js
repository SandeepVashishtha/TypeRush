"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RACE_STATUS, DIFFICULTY_CONFIG } from "./constants";
import { getPassage } from "./words";
import { calculateTargetSpeed, lerpSpeed } from "./physics";
import { AISimulator } from "./aiEngine";
import { useTypingEngine } from "./useTypingEngine";
import { sound } from "@/lib/audio/soundSynth";

export function useRaceEngine({
  difficulty = "normal",
  passageLength = "medium",
  onRaceFinished,
}) {
  const [raceStatus, setRaceStatus] = useState(RACE_STATUS.IDLE);
  const [countdownNum, setCountdownNum] = useState(3);
  const [passage, setPassage] = useState(() => getPassage(passageLength));
  const [playerSpeed, setPlayerSpeed] = useState(0);
  const [playerDistance, setPlayerDistance] = useState(0);
  const [aiState, setAiState] = useState({
    distance: 0,
    speed: 0,
    wpm: 0,
    isFinished: false,
    config: DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.normal,
  });

  const aiSimulatorRef = useRef(null);
  const raceStartTimeRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTickTimeRef = useRef(performance.now());
  const playerSpeedRef = useRef(0);
  const countdownTimerRef = useRef(null);

  // Initialize AI Simulator
  useEffect(() => {
    aiSimulatorRef.current = new AISimulator(difficulty, passage.text);
  }, [difficulty, passage.text]);

  // Handle player finishing typing
  const handlePlayerFinish = useCallback(
    (typingResults) => {
      if (raceStatus !== RACE_STATUS.RACING) return;
      
      setRaceStatus(RACE_STATUS.FINISHED);
      const isPlayerWinner = !aiSimulatorRef.current || !aiSimulatorRef.current.isFinished;
      
      if (isPlayerWinner) {
        sound.playVictory();
      } else {
        sound.playDefeat();
      }

      const finalResult = {
        position: isPlayerWinner ? 1 : 2,
        wpm: typingResults.wpm,
        accuracy: typingResults.accuracy,
        maxCombo: typingResults.maxCombo,
        mistakes: typingResults.mistakes,
        time: typingResults.time,
        passageTitle: passage.title,
        difficulty,
      };

      if (onRaceFinished) {
        onRaceFinished(finalResult);
      }
    },
    [raceStatus, passage.title, difficulty, onRaceFinished]
  );

  // Use Typing Engine
  const typing = useTypingEngine({
    text: passage.text,
    raceStatus,
    onFinish: handlePlayerFinish,
  });

  const resetTypingRef = useRef(typing.resetTyping);
  resetTypingRef.current = typing.resetTyping;

  // Start Countdown Sequence
  const startRace = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    const newPassage = getPassage(passageLength);
    setPassage(newPassage);
    if (resetTypingRef.current) resetTypingRef.current();
    
    setPlayerSpeed(0);
    setPlayerDistance(0);
    playerSpeedRef.current = 0;

    if (aiSimulatorRef.current) {
      aiSimulatorRef.current.reset(difficulty, newPassage.text);
    }

    setRaceStatus(RACE_STATUS.COUNTDOWN);
    setCountdownNum(3);
    sound.playCountdown(false);

    let count = 3;
    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownNum(count);
        sound.playCountdown(false);
      } else if (count === 0) {
        setCountdownNum("GO!");
        sound.playCountdown(true);
      } else {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
        setRaceStatus(RACE_STATUS.RACING);
        raceStartTimeRef.current = performance.now();
        lastTickTimeRef.current = performance.now();
      }
    }, 900);
  }, [passageLength, difficulty]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // Main Race Physics & AI Update Loop
  useEffect(() => {
    if (raceStatus !== RACE_STATUS.RACING) return;

    const updateLoop = (currentTime) => {
      const dtSeconds = Math.min(0.1, (currentTime - lastTickTimeRef.current) / 1000);
      lastTickTimeRef.current = currentTime;

      const elapsedRaceTime = currentTime - raceStartTimeRef.current;

      // 1. Update Player Physics
      const targetSpeed = calculateTargetSpeed({
        wpm: typing.wpm,
        accuracy: typing.accuracy,
        combo: typing.combo,
        isNitroActive: typing.isNitroActive,
      });

      playerSpeedRef.current = lerpSpeed(playerSpeedRef.current, targetSpeed, dtSeconds);
      setPlayerSpeed(Math.round(playerSpeedRef.current));
      setPlayerDistance(typing.progress);

      // 2. Update AI Simulator
      if (aiSimulatorRef.current) {
        aiSimulatorRef.current.update(dtSeconds, elapsedRaceTime);
        const newAiState = aiSimulatorRef.current.getState();
        setAiState(newAiState);
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [raceStatus, typing.wpm, typing.accuracy, typing.combo, typing.isNitroActive, typing.progress]);

  return {
    raceStatus,
    countdownNum,
    passage,
    playerSpeed,
    playerDistance,
    aiState,
    typing,
    startRace,
  };
}
