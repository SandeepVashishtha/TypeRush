import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AISimulator } from "@/lib/game/aiEngine";
import { DIFFICULTY_CONFIG } from "@/lib/game/constants";

describe("aiEngine", () => {
  describe("AISimulator initialization & reset", () => {
    it("initializes with default normal difficulty and empty passage", () => {
      const ai = new AISimulator();
      const state = ai.getState();

      expect(state.config).toEqual(DIFFICULTY_CONFIG.normal);
      expect(state.distance).toBe(0);
      expect(state.speed).toBe(0);
      expect(state.wpm).toBe(0);
      expect(state.isFinished).toBe(false);
      expect(state.finishTime).toBeNull();
    });

    it("initializes with specified difficulty and passage text", () => {
      const passage = "Hello world";
      const ai = new AISimulator("expert", passage);
      const state = ai.getState();

      expect(state.config).toEqual(DIFFICULTY_CONFIG.expert);
      expect(ai.totalChars).toBe(passage.length);
      expect(ai.passageText).toBe(passage);
    });

    it("falls back to normal config when unknown difficulty is provided", () => {
      const ai = new AISimulator("unknown_diff", "text");
      expect(ai.config).toEqual(DIFFICULTY_CONFIG.normal);
    });

    it("resets state correctly with new difficulty and passage text", () => {
      const ai = new AISimulator("easy", "short");
      ai.update(1.0, 1000);

      ai.reset("hard", "a longer passage for testing reset");
      const state = ai.getState();

      expect(state.config).toEqual(DIFFICULTY_CONFIG.hard);
      expect(state.distance).toBe(0);
      expect(state.speed).toBe(0);
      expect(state.wpm).toBe(0);
      expect(state.isFinished).toBe(false);
      expect(state.finishTime).toBeNull();
      expect(ai.typedChars).toBe(0);
      expect(ai.passageText).toBe("a longer passage for testing reset");
    });
  });

  describe("AISimulator update", () => {
    beforeEach(() => {
      // Mock Math.random to avoid random pauses during deterministic checks
      vi.spyOn(Math, "random").mockReturnValue(0.99);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("handles empty passage text (totalChars = 0) without errors", () => {
      const ai = new AISimulator("normal", "");
      expect(() => ai.update(0.1, 100)).not.toThrow();
      expect(ai.getState().distance).toBe(0);
      expect(ai.getState().isFinished).toBe(false);
    });

    it("advances typedChars and updates distance during race", () => {
      const passage = "The quick brown fox jumps over the lazy dog";
      const ai = new AISimulator("normal", passage);

      ai.update(0.5, 500);

      const state = ai.getState();
      expect(ai.typedChars).toBeGreaterThan(0);
      expect(state.distance).toBeGreaterThan(0);
      expect(state.speed).toBeGreaterThan(0);
      expect(state.wpm).toBeGreaterThan(0);
    });

    it("marks AI as finished and sets finishTime when passage is fully typed", () => {
      const passage = "Quick test";
      const ai = new AISimulator("normal", passage);

      // Run multiple large steps to ensure passage completion
      for (let i = 0; i < 20; i++) {
        ai.update(1.0, (i + 1) * 1000);
      }

      const state = ai.getState();
      expect(state.isFinished).toBe(true);
      expect(state.distance).toBe(100);
      expect(state.finishTime).not.toBeNull();
      expect(state.finishTime).toBeGreaterThan(0);
    });

    it("does not update further once finished", () => {
      const passage = "Hi";
      const ai = new AISimulator("normal", passage);

      ai.update(10.0, 10000);
      const finishedTime = ai.finishTime;

      // Updating again should no-op
      ai.update(5.0, 15000);
      expect(ai.finishTime).toBe(finishedTime);
    });

    it("handles pauseTimer decrement when paused", () => {
      const ai = new AISimulator("normal", "Test passage");
      ai.pauseTimer = 0.5;
      ai.currentWpm = 40;
      ai.speed = 30;

      ai.update(0.2, 200);

      expect(ai.pauseTimer).toBeCloseTo(0.3);
      expect(ai.currentWpm).toBeLessThan(40);
      expect(ai.speed).toBeLessThan(30);
    });
  });
});

