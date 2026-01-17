import { animate } from "./animate.js";
import type { AnimationFunction } from "./types.js";

/**
 * Create a tweening function.
 * @param {number} durationMs - Duration of the tween in milliseconds
 * @param {(t: number) => number} easing - Easing function
 * @returns {AnimationFunction} Tweening function, which optionally accepts the current delta in milliseconds, and reurns the current progress.
 */
function createTween(durationMs: number, easing = (t: number) => t): AnimationFunction {
  let current = 0;
  return (deltaMs: number) => {
    current += deltaMs;
    if (current >= durationMs) {
      return 1;
    }
    return easing(current / durationMs);
  };
}

/**
 * Tween a Seidr value to a target value.
 * @param {Seidr<number>} object The Seidr to tween
 * @param {number} to The target value
 * @param {number} durationMs The duration of the tween in milliseconds
 * @param {(t: number) => number} easing The easing function to use
 * @returns {() => void} A function to stop the tween
 */
export function tween<T, K extends keyof T = keyof T, P = T[K] extends number ? number : never>(
  object: T,
  property: keyof T,
  to: number,
  durationMs: number,
  easing = (t: number) => t,
): Promise<void> & { stop: () => void } {
  // SSR Guard
  if (typeof window === "undefined") {
    const noop = Object.assign(Promise.resolve(), { stop: () => {} });
    return noop;
  }

  const tweenFn = createTween(durationMs, easing);
  const from = object[property] as number;
  let stopRef: () => void;
  let resolveRef: () => void;

  const promise = new Promise<void>((resolve) => {
    resolveRef = resolve;
    stopRef = animate((deltaMs: number) => {
      const t = tweenFn(deltaMs);
      object[property] = (from + (to - from) * t) as any;

      if (t >= 1) {
        resolve();
      }
      return t;
    });
  });

  return Object.assign(promise, {
    stop: () => {
      stopRef();
      resolveRef();
    },
  });
}
