import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { tween } from "./tween";

describe("Tweening function", () => {
  let currentTime = 0;

  beforeEach(() => {
    vi.useFakeTimers();
    currentTime = 0;

    // Set up window object for tests
    const g = globalThis as any;
    g.window = g.window || {};

    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      return setTimeout(() => {
        currentTime += 16.666;
        cb(currentTime);
      }, 16.666);
    });

    vi.stubGlobal("cancelAnimationFrame", (id: any) => {
      clearTimeout(id);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe("tween()", () => {
    it("should tween a Seidr value over time", () => {
      const obj = { value: 0 };
      tween(obj, "value", 100, 100); // 100ms duration

      // Start: 0
      expect(obj.value).toBe(0);

      // Advance halfway (plus one for the 0-delta first frame)
      vi.advanceTimersByTime(17 * 4);
      expect(obj.value).toBeCloseTo(49.998, 1);

      // After 100ms+: exactly 100
      vi.advanceTimersByTime(100);
      expect(obj.value).toBe(100);
    });

    it("should use easing function", () => {
      const obj = { value: 0 };
      // easeInQuad: t * t
      const t = tween(obj, "value", 100, 100, (t) => t * t);

      // Advance to frame 4: current time 4 * 16.666 = 66.664
      // Accumulated delta: (0) + 16.6 + 16.6 + 16.6 = 49.998
      // t = 49.998 / 100 = 0.5 (approx)
      // val = 100 * (0.5 * 0.5) = 25
      vi.advanceTimersByTime(17 * 4);
      expect(obj.value).toBeCloseTo(25, 0);
      // Cleanup
      t.stop();
    });

    it("should return a promise that resolves when finished", async () => {
      const obj = { value: 0 };
      const promise = tween(obj, "value", 100, 100);

      vi.advanceTimersByTime(150);
      await expect(promise).resolves.toBeUndefined();
      expect(obj.value).toBe(100);
    });

    it("should resolve and stop animation when stop() is called", async () => {
      const obj = { value: 0 };
      const t = tween(obj, "value", 100, 100);

      // Advance a bit
      vi.advanceTimersByTime(50);
      const currentValue = obj.value;
      expect(currentValue).toBeGreaterThan(0);
      expect(currentValue).toBeLessThan(100);

      // Manually stop
      t.stop();

      // Should resolve immediately
      await expect(t).resolves.toBeUndefined();

      // Should not update further
      vi.advanceTimersByTime(100);
      expect(obj.value).toBe(currentValue);
    });
  });
});
