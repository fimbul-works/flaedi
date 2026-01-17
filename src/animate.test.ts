import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { animate } from "./animate";

describe("Animation function", () => {
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

  describe("animate()", () => {
    it("should call the callback with delta time", async () => {
      let totalDelta = 0;
      animate((delta) => {
        totalDelta += delta;
        return totalDelta >= 50 ? 1 : 0;
      });

      // Frame 1: ~16.6ms total. deltaMs is 0 on the very first frame of a batch
      vi.advanceTimersByTime(17);
      expect(totalDelta).toBe(0);

      // Frame 2: ~33.3ms total. deltaMs is ~16.6ms
      vi.advanceTimersByTime(17);
      expect(totalDelta).toBeCloseTo(16.666, 1);

      // Advance until it reaches 50
      vi.advanceTimersByTime(17 * 3);
      expect(totalDelta).toBeCloseTo(66.664, 1);

      const lastDelta = totalDelta;
      vi.advanceTimersByTime(17);
      expect(totalDelta).toBe(lastDelta); // Should have stopped
    });

    it("should allow manual stopping", () => {
      let callCount = 0;
      const stop = animate(() => {
        callCount++;
        return 0;
      });

      vi.advanceTimersByTime(17); // Frame 1 (delta 0)
      vi.advanceTimersByTime(17); // Frame 2 (delta 16.6)
      expect(callCount).toBe(2);

      stop();
      vi.advanceTimersByTime(17);
      expect(callCount).toBe(2);
    });
  });
});
