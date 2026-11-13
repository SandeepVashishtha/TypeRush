import { describe, it, expect } from "vitest";
import { calculateTargetSpeed, lerpSpeed } from "@/lib/game/physics";
import { NITRO_CONFIG } from "@/lib/game/constants";

describe("physics", () => {
  describe("calculateTargetSpeed", () => {
    it("returns 0 when wpm is 0 or negative", () => {
      expect(calculateTargetSpeed({ wpm: 0 })).toBe(0);
      expect(calculateTargetSpeed({ wpm: -10 })).toBe(0);
    });

    it("calculates base speed without bonuses", () => {
      // wpm = 100, accuracy = 90 (<95), combo = 5 (<10), isNitroActive = false
      // baseSpeed = 100 * 0.95 = 95
      const speed = calculateTargetSpeed({ wpm: 100, accuracy: 90, combo: 5 });
      expect(speed).toBeCloseTo(95);
    });

    it("applies accuracy bonuses appropriately", () => {
      // baseSpeed = 100 * 0.95 = 95
      // accuracy >= 95 and < 98: +8% bonus = 95 * 1.08 = 102.6
      const speed95 = calculateTargetSpeed({ wpm: 100, accuracy: 96, combo: 0 });
      expect(speed95).toBeCloseTo(95 + 95 * 0.08);

      // accuracy >= 98: +15% bonus = 95 * 1.15 = 109.25
      const speed98 = calculateTargetSpeed({ wpm: 100, accuracy: 99, combo: 0 });
      expect(speed98).toBeCloseTo(95 + 95 * 0.15);
    });

    it("applies combo tier bonuses appropriately", () => {
      // baseSpeed = 95
      // combo >= 10: +8%
      const speed10 = calculateTargetSpeed({ wpm: 100, accuracy: 90, combo: 10 });
      expect(speed10).toBeCloseTo(95 + 95 * 0.08);

      // combo >= 20: +15%
      const speed20 = calculateTargetSpeed({ wpm: 100, accuracy: 90, combo: 20 });
      expect(speed20).toBeCloseTo(95 + 95 * 0.15);

      // combo >= 30: +25%
      const speed30 = calculateTargetSpeed({ wpm: 100, accuracy: 90, combo: 30 });
      expect(speed30).toBeCloseTo(95 + 95 * 0.25);
    });

    it("applies nitro multiplier when nitro is active", () => {
      const normalSpeed = calculateTargetSpeed({
        wpm: 100,
        accuracy: 95,
        combo: 20,
        isNitroActive: false,
      });

      const boostedSpeed = calculateTargetSpeed({
        wpm: 100,
        accuracy: 95,
        combo: 20,
        isNitroActive: true,
      });

      expect(boostedSpeed).toBeCloseTo(normalSpeed * NITRO_CONFIG.BOOST_MULTIPLIER);
    });

    it("clamps maximum speed to 240", () => {
      const extremeSpeed = calculateTargetSpeed({
        wpm: 250,
        accuracy: 100,
        combo: 50,
        isNitroActive: true,
      });
      expect(extremeSpeed).toBe(240);
    });
  });

  describe("lerpSpeed", () => {
    it("returns currentSpeed when dtSeconds is 0", () => {
      expect(lerpSpeed(50, 100, 0)).toBe(50);
    });

    it("accelerates towards targetSpeed using accelRate", () => {
      // currentSpeed = 50, targetSpeed = 100, dtSeconds = 0.1, accelRate = 3.5
      // factor = 0.1 * 3.5 = 0.35
      // result = 50 + (100 - 50) * 0.35 = 50 + 17.5 = 67.5
      expect(lerpSpeed(50, 100, 0.1, 3.5, 2.0)).toBeCloseTo(67.5);
    });

    it("decelerates towards targetSpeed using decelRate", () => {
      // currentSpeed = 100, targetSpeed = 50, dtSeconds = 0.1, decelRate = 2.0
      // factor = 0.1 * 2.0 = 0.2
      // result = 100 + (50 - 100) * 0.2 = 100 - 10 = 90
      expect(lerpSpeed(100, 50, 0.1, 3.5, 2.0)).toBeCloseTo(90);
    });

    it("caps factor at 1 so speed does not overshoot target", () => {
      // Large dtSeconds causes factor to hit Math.min(1, dtSeconds * rate)
      expect(lerpSpeed(50, 100, 5.0)).toBe(100);
      expect(lerpSpeed(100, 50, 5.0)).toBe(50);
    });
  });
});

