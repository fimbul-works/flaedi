![flæði](flaedi-logo.svg)

**flæði** (Old Norse for *flow*) is a high-performance, kilobyte-sized animation engine designed for the modern web. It provides a functional, promise-based approach to motion without the bloat of traditional animation libraries.

[![npm version](https://badge.fury.io/js/%40fimbul-works%2Fflaedi.svg)](https://www.npmjs.com/package/@fimbul-works/flaedi)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/microsoft/TypeScript)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@fimbul-works/flaedi)](https://bundlephobia.com/package/@fimbul-works/flaedi)

## Features

* **⚡ Ultra-lightweight**: Sub-1KB gzipped core for maximum performance.
* **⏳ Promise-based**: Native support for `async/await` chaining, enabling clean animation sequencing.
* **🧮 Mathematically Dense**: A comprehensive suite of high-precision easing functions.
* **🎯 Surgical Precision**: Directly modifies object properties to bypass framework overhead.
* **🛡️ SSR Safe**: Built-in environment guards to ensure safe execution in Node.js/SSR contexts.
* **🧹 Explicit Cleanup**: Every animation returns a `stop()` method to prevent memory leaks and hanging promises.

## Installation

```bash
npm install @fimbul-works/flaedi
```

## Quick Start

### Basic Tweening

Tween any numeric property of an object (like a Seiðr observable) with ease.

```typescript
import { tween } from '@fimbul-works/flaedi';
import { easeOutElastic } from '@fimbul-works/flaedi/easing';

const player = { x: 0, y: 0 };

// Move the player to x: 100 over 500ms
const animation = tween(player, 'x', 100, 500, easeOutElastic);

// Stop manually if needed
animation.stop();
```

### Async Chaining

Use `async/await` to create complex, frame-perfect sequences without callback hell.

```typescript
const entrance = async () => {
  // Fade in
  await tween(ui, 'opacity', 1, 300);

  // Then slide up
  await tween(ui, 'y', 0, 500, easeOutBack);

  console.log("Animation sequence complete!");
};
```

## Easing Functions

**flaedi** comes with a rich assortment of easing functions. You can import them individually to keep your bundle size minimal.

```typescript
import {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  smoothstep,
} from '@fimbul-works/flaedi/easing';
```

## Core Concepts

### The Animation Loop

At its heart, **flaedi** manages a single `Set` of active animation functions. When the set is empty, the `requestAnimationFrame` loop automatically stops, saving CPU cycles.

### Tween Objects

The `tween` function is generic and type-safe. It can target any object with a numeric property.

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

Built with ⚡ by [FimbulWorks](https://github.com/fimbul-works)
