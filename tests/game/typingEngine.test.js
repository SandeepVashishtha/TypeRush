import { describe, it, expect } from "vitest";
import {
  calculateWpm,
  calculateAccuracy,
  smoothMetric,
  buildCharacterStream,
} from "@/lib/game/typingEngine";

describe("typingEngine", () => {
  describe("calculateWpm", () => {
    it("returns 0 for zero elapsed time", () => {
      expect(calculateWpm(100, 0)).toBe(0);
    });

    it("returns 0 for elapsed time less than 500ms", () => {
      expect(calculateWpm(50, 499)).toBe(0);
      expect(calculateWpm(50, -100)).toBe(0);
    });

    it("returns 0 when correctChars is zero or negative", () => {
      expect(calculateWpm(0, 60000)).toBe(0);
      expect(calculateWpm(-10, 60000)).toBe(0);
    });

    it("calculates accurate WPM for standard elapsed time", () => {
      // 250 chars / 5 = 50 words in 1 minute (60,000ms) = 50 WPM
      expect(calculateWpm(250, 60000)).toBe(50);
      // 100 chars in 30 seconds = 20 words / 0.5 min = 40 WPM
      expect(calculateWpm(100, 30000)).toBe(40);
    });

    it("rounds WPM to nearest whole number", () => {
      // 103 chars in 30 seconds = 20.6 words / 0.5 min = 41.2 -> 41 WPM
      expect(calculateWpm(103, 30000)).toBe(41);
    });

    it("clamps WPM to maximum 300", () => {
      // Extremely high chars in short time
      expect(calculateWpm(5000, 10000)).toBe(300);
    });
  });

  describe("calculateAccuracy", () => {
    it("returns 100 when totalKeystrokes is zero or negative", () => {
      expect(calculateAccuracy(0, 0)).toBe(100);
      expect(calculateAccuracy(0, -5)).toBe(100);
    });

    it("returns 100 when all keystrokes are correct", () => {
      expect(calculateAccuracy(50, 50)).toBe(100);
    });

    it("calculates percentage rounded to 1 decimal place", () => {
      // 95 correct out of 100
      expect(calculateAccuracy(95, 100)).toBe(95);
      // 97 correct out of 99 = 97.9797... -> 98
      expect(calculateAccuracy(97, 99)).toBe(98);
      // 1 out of 3 = 33.333... -> 33.3
      expect(calculateAccuracy(1, 3)).toBe(33.3);
    });

    it("returns 0 when correctChars is 0", () => {
      expect(calculateAccuracy(0, 50)).toBe(0);
    });

    it("clamps accuracy between 0 and 100", () => {
      expect(calculateAccuracy(120, 100)).toBe(100);
      expect(calculateAccuracy(-10, 100)).toBe(0);
    });
  });

  describe("smoothMetric", () => {
    it("returns rawValue directly when currentSmoothed is 0", () => {
      expect(smoothMetric(0, 65.4)).toBe(65.4);
    });

    it("applies exponential smoothing with default alpha 0.25", () => {
      // 0.25 * 80 + 0.75 * 60 = 20 + 45 = 65
      expect(smoothMetric(60, 80)).toBe(65);
    });

    it("respects custom alpha parameter", () => {
      // alpha = 0.5 -> 0.5 * 100 + 0.5 * 50 = 75
      expect(smoothMetric(50, 100, 0.5)).toBe(75);
    });
  });

  describe("buildCharacterStream", () => {
    it("handles empty strings gracefully", () => {
      expect(buildCharacterStream("", "")).toEqual([]);
    });

    it("marks untyped and current characters properly", () => {
      const stream = buildCharacterStream("cat", "");
      expect(stream).toHaveLength(3);
      expect(stream[0]).toMatchObject({ char: "c", status: "current", typedChar: null });
      expect(stream[1]).toMatchObject({ char: "a", status: "untyped", typedChar: null });
      expect(stream[2]).toMatchObject({ char: "t", status: "untyped", typedChar: null });
    });

    it("identifies correct and incorrect characters", () => {
      const stream = buildCharacterStream("cat", "cz");
      expect(stream[0]).toMatchObject({ char: "c", status: "correct", typedChar: "c" });
      expect(stream[1]).toMatchObject({ char: "a", status: "incorrect", typedChar: "z" });
      expect(stream[2]).toMatchObject({ char: "t", status: "current", typedChar: null });
    });

    it("marks character as incorrect if present in errorIndices Set", () => {
      const errorIndices = new Set([0]);
      const stream = buildCharacterStream("cat", "c", errorIndices);
      expect(stream[0]).toMatchObject({ char: "c", status: "incorrect", typedChar: "c" });
    });

    it("correctly identifies space characters", () => {
      const stream = buildCharacterStream("a b", "a ");
      expect(stream[1]).toMatchObject({ char: " ", isSpace: true, status: "correct" });
    });
  });
});

