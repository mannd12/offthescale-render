// Ambient motion: nothing on screen is ever frozen. Every helper is a pure function of the frame,
// so stills and renders agree and a re-render is deterministic.
import { Easing, interpolate } from "remotion";

const TAU = Math.PI * 2;
/** deterministic 0..1 noise from an integer seed */
export const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Gentle 2-D drift (px) + a tiny rotation (deg). Default: 6 px over ~7 s, phase set by seed. */
export const drift = (frame: number, seed = 1, amp = 6, periodFrames = 210) => {
  const p = rnd(seed) * TAU;
  const q = rnd(seed + 7) * TAU;
  const t = (frame / periodFrames) * TAU;
  return {
    x: Math.sin(t + p) * amp,
    y: Math.sin(t * 0.77 + q) * amp * 0.6,
    r: Math.sin(t * 0.53 + p) * amp * 0.08,
  };
};

/** Vertical bob for a single prop (px). */
export const bob = (frame: number, seed = 1, amp = 4, periodFrames = 90) =>
  Math.sin((frame / periodFrames) * TAU + rnd(seed) * TAU) * amp;

/** Slow scale breathing around 1 (e.g. 1 ± 0.01). */
export const breathe = (frame: number, seed = 1, amount = 0.01, periodFrames = 150) =>
  1 + Math.sin((frame / periodFrames) * TAU + rnd(seed) * TAU) * amount;

/** Dash offset that crawls along a contour line, so hatches and isolines read as alive. */
export const crawl = (frame: number, speed = 0.4) => -frame * speed;

/** Eased 0→1 between two frames (clamped). */
export const ramp = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

/** Specks of dust/grit for a layer: fixed positions, each drifting on its own phase. */
export const specks = (frame: number, n: number, w: number, h: number, seed = 1, amp = 5) =>
  Array.from({ length: n }, (_, i) => {
    const d = drift(frame, seed * 100 + i, amp, 180 + rnd(seed + i) * 160);
    return { x: rnd(seed * 31 + i) * w + d.x, y: rnd(seed * 57 + i) * h + d.y, r: 1.5 + rnd(seed * 11 + i) * 2.5 };
  });
