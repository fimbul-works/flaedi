/**
 * A function that returns the current animation progress between 0...1.
 *
 * @param {number} deltaMs - The time elapsed since the last frame in milliseconds
 * @returns {number} The current animation progress
 */
export type AnimationFunction = (deltaMs: number) => number;
