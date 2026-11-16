import { describe, it, expect, beforeEach, vi } from "vitest";
import { getCareerStats, saveRaceResult } from "@/lib/game/statsStorage";

const STORAGE_KEY = "typeracer_career_stats";

const DEFAULT_STATS = {
  bestWpm: 0,
  totalRaces: 0,
  wins: 0,
  losses: 0,
  bestAccuracy: 0,
  bestCombo: 0,
  history: [],
};

describe("statsStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("getCareerStats", () => {
    it("returns DEFAULT_STATS when localStorage is empty", () => {
      const stats = getCareerStats();
      expect(stats).toEqual(DEFAULT_STATS);
    });

    it("parses and returns saved stats from localStorage", () => {
      const saved = {
        bestWpm: 80,
        totalRaces: 5,
        wins: 3,
        losses: 2,
        bestAccuracy: 98,
        bestCombo: 15,
        history: [],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const stats = getCareerStats();
      expect(stats).toEqual(saved);
    });

    it("handles corrupted localStorage gracefully (invalid JSON)", () => {
      // Acceptance Criterion: Corrupted localStorage handling is tested
      localStorage.setItem(STORAGE_KEY, "{corrupted: true, invalid JSON...");

      expect(() => getCareerStats()).not.toThrow();
      const stats = getCareerStats();
      expect(stats).toEqual(DEFAULT_STATS);
    });

    it("handles exceptions thrown by localStorage.getItem", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("SecurityError: Access is denied for this document");
      });

      expect(() => getCareerStats()).not.toThrow();
      const stats = getCareerStats();
      expect(stats).toEqual(DEFAULT_STATS);
    });
  });

  describe("saveRaceResult", () => {
    it("returns default payload when result is null or undefined", () => {
      expect(saveRaceResult(null)).toEqual({ isNewBest: false, stats: DEFAULT_STATS });
      expect(saveRaceResult(undefined)).toEqual({ isNewBest: false, stats: DEFAULT_STATS });
    });

    it("records first race and flags isNewBest when position is 1 and wpm > 0", () => {
      const result = {
        wpm: 75,
        accuracy: 97.5,
        position: 1,
        difficulty: "normal",
        time: 45.2,
        maxCombo: 18,
      };

      const outcome = saveRaceResult(result);
      expect(outcome.isNewBest).toBe(true);
      expect(outcome.stats.bestWpm).toBe(75);
      expect(outcome.stats.totalRaces).toBe(1);
      expect(outcome.stats.wins).toBe(1);
      expect(outcome.stats.losses).toBe(0);
      expect(outcome.stats.bestAccuracy).toBe(97.5);
      expect(outcome.stats.bestCombo).toBe(18);
      expect(outcome.stats.history).toHaveLength(1);
      expect(outcome.stats.history[0]).toMatchObject({
        wpm: 75,
        accuracy: 97.5,
        position: 1,
        difficulty: "normal",
        time: 45.2,
      });

      // Verify persisted in localStorage
      const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(persisted.bestWpm).toBe(75);
    });

    it("records a loss (position != 1) and sets isNewBest to false", () => {
      const result = {
        wpm: 60,
        accuracy: 92,
        position: 2,
        difficulty: "hard",
        time: 50.0,
        maxCombo: 5,
      };

      const outcome = saveRaceResult(result);
      expect(outcome.isNewBest).toBe(false);
      expect(outcome.stats.wins).toBe(0);
      expect(outcome.stats.losses).toBe(1);
      expect(outcome.stats.totalRaces).toBe(1);
    });

    it("does not flag isNewBest if wpm is lower than existing best even if position is 1", () => {
      // First race: 80 WPM, 1st place
      saveRaceResult({
        wpm: 80,
        accuracy: 98,
        position: 1,
        difficulty: "normal",
        time: 40,
        maxCombo: 20,
      });

      // Second race: 70 WPM, 1st place
      const outcome = saveRaceResult({
        wpm: 70,
        accuracy: 99,
        position: 1,
        difficulty: "normal",
        time: 42,
        maxCombo: 22,
      });

      expect(outcome.isNewBest).toBe(false);
      expect(outcome.stats.bestWpm).toBe(80);
      expect(outcome.stats.wins).toBe(2);
      expect(outcome.stats.totalRaces).toBe(2);
    });

    it("recovers from corrupted localStorage when saving new result", () => {
      // Seed with malformed JSON
      localStorage.setItem(STORAGE_KEY, "INVALID_SYNTAX_JSON");

      const result = {
        wpm: 65,
        accuracy: 95,
        position: 1,
        difficulty: "normal",
        time: 45,
        maxCombo: 10,
      };

      const outcome = saveRaceResult(result);
      expect(outcome.isNewBest).toBe(true);
      expect(outcome.stats.bestWpm).toBe(65);
      expect(outcome.stats.totalRaces).toBe(1);
    });

    it("limits history array to the 20 most recent entries", () => {
      for (let i = 1; i <= 25; i++) {
        saveRaceResult({
          wpm: 50 + i,
          accuracy: 90,
          position: 1,
          difficulty: "normal",
          time: 30,
          maxCombo: 10,
        });
      }

      const stats = getCareerStats();
      expect(stats.history).toHaveLength(20);
      // Latest race should be the first in history (wpm = 75)
      expect(stats.history[0].wpm).toBe(75);
    });

    it("handles exceptions thrown by localStorage.setItem gracefully", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

      expect(() => {
        saveRaceResult({
          wpm: 50,
          accuracy: 90,
          position: 1,
          difficulty: "normal",
          time: 30,
          maxCombo: 5,
        });
      }).not.toThrow();

      const outcome = saveRaceResult({
        wpm: 50,
        accuracy: 90,
        position: 1,
        difficulty: "normal",
        time: 30,
        maxCombo: 5,
      });

      expect(outcome).toEqual({ isNewBest: false, stats: DEFAULT_STATS });
    });
  });
});

