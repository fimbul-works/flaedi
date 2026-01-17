import type { AnimationFunction } from "./types.js";

/** Set of active animations */
const animations = new Set<AnimationFunction>();

/** ID of the current animation frame */
let animationFrameId: number | null = null;

/** Time of the last frame */
let lastFrameTime = 0;

/** Animation frame callback */
const animateFrame = (now: number) => {
  animationFrameId = requestAnimationFrame(animateFrame);
  if (lastFrameTime === 0) {
    lastFrameTime = now;
  }
  const deltaMs = lastFrameTime ? now - lastFrameTime : 0;
  lastFrameTime = now;
  let t = 0;
  animations.forEach((fn) => {
    t = fn(deltaMs);
    if (t >= 1) {
      stopAnimation(fn);
    }
  });
};

/**
 * Animate a tween
 * @param {AnimationFunction} callback - The tween to animate
 * @returns {() => void} A function to stop the animation
 */
export function animate(callback: AnimationFunction): () => void {
  // SSR Guard
  if (typeof window === "undefined") {
    return () => {};
  }
  animations.add(callback);
  animationFrameId = requestAnimationFrame(animateFrame);
  return () => stopAnimation(callback);
}

/**
 * Stop a tween.
 * @param {AnimationFunction} callback - The tween to stop
 */
function stopAnimation(callback: AnimationFunction) {
  animations.delete(callback);
  if (animations.size === 0) {
    cancelAnimationFrame(animationFrameId as number);
    lastFrameTime = 0;
  }
}
