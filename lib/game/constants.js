export const RACE_STATUS = {
  IDLE: "IDLE",
  COUNTDOWN: "COUNTDOWN",
  RACING: "RACING",
  FINISHED: "FINISHED",
  PAUSED: "PAUSED",
};

export const DIFFICULTY_CONFIG = {
  easy: {
    id: "easy",
    name: "Rookie",
    minWpm: 32,
    maxWpm: 42,
    targetWpm: 36,
    errorRate: 0.07,
    burstChance: 0.15,
    carColor: "#38bdf8",
    carName: "Cyber Dart",
    aiCarModel: "compact",
  },
  normal: {
    id: "normal",
    name: "Pro",
    minWpm: 52,
    maxWpm: 65,
    targetWpm: 58,
    errorRate: 0.04,
    burstChance: 0.25,
    carColor: "#a855f7",
    carName: "Viper GT",
    aiCarModel: "sport",
  },
  hard: {
    id: "hard",
    name: "Champion",
    minWpm: 75,
    maxWpm: 88,
    targetWpm: 80,
    errorRate: 0.02,
    burstChance: 0.4,
    carColor: "#ffe600",
    carName: "Thunderbolt",
    aiCarModel: "hyper",
  },
  expert: {
    id: "expert",
    name: "Legend",
    minWpm: 95,
    maxWpm: 115,
    targetWpm: 105,
    errorRate: 0.01,
    burstChance: 0.55,
    carColor: "#ff0055",
    carName: "Phantom Mach-X",
    aiCarModel: "prototype",
  },
};

export const COMBO_TIERS = {
  TIER_1: { count: 5, bonus: 1.05, label: "STREAK", color: "#38bdf8" },
  TIER_2: { count: 10, bonus: 1.12, label: "HOT STREAK", color: "#00f0ff" },
  TIER_3: { count: 20, bonus: 1.25, label: "PERFECT STREAK", color: "#ffe600" },
  TIER_4: { count: 30, bonus: 1.4, label: "HYPERSPEED", color: "#ff0055" },
};

export const NITRO_CONFIG = {
  MAX_NITRO: 100,
  CHARGE_PER_CHAR: 0.8,
  CHARGE_PER_COMBO: 0.2,
  PENALTY_PER_ERROR: 6,
  BOOST_MULTIPLIER: 1.65,
  DURATION_MS: 3800,
};

export const DEFAULT_PLAYER_STATE = {
  distance: 0,
  speed: 0,
  wpm: 0,
  rawWpm: 0,
  accuracy: 100,
  combo: 0,
  maxCombo: 0,
  nitro: 0,
  isNitroActive: false,
  mistakes: 0,
  correctChars: 0,
  totalCharsTyped: 0,
  startTime: null,
  finishTime: null,
};

export const DEFAULT_AI_STATE = {
  distance: 0,
  speed: 0,
  wpm: 0,
  targetWpm: 50,
  isFinished: false,
  finishTime: null,
};
