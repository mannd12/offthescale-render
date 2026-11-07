// Kit v2 transitions (docs/STYLE-V2.md §6): iris reveals, zoom-throughs between two scenes, angled wipes, outline
// morphs and the small "pop" after a hard cut. Camera-level match cuts are a composition choice (same object at the
// same screen place on both sides of the cut); these helpers cover the mechanical part.
import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { morphPts, roundPoly, Pt } from "./shapes";

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
/** smoothstep between a and b */
export const smooth = (t: number, a = 0, b = 1) => {
  const u = clamp01((t - a) / (b - a));
  return u * u * (3 - 2 * u);
};
const safeId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");

/** Iris reveal inside an SVG: children are visible inside a circle of radius r(t) around (cx, cy). t 0 → hidden. */
export const Iris: React.FC<{ t: number; cx: number; cy: number; maxR?: number; children: React.ReactNode; invert?: boolean }> = ({ t, cx, cy, maxR = 2300, children, invert = false }) => {
  const id = "iris" + safeId(useId());
  const r = Math.max(0.01, maxR * smooth(invert ? 1 - t : t));
  return (
    <g>
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
};

/** Angled wipe inside an SVG: children are revealed behind an edge sweeping left→right (angle in deg from vertical). */
export const Wipe: React.FC<{ t: number; angle?: number; children: React.ReactNode; feather?: number }> = ({ t, angle = 12, children }) => {
  const id = "wipe" + safeId(useId());
  const k = Math.tan((angle * Math.PI) / 180) * 1080;
  const x = -k + (1920 + 2 * k) * smooth(t);
  return (
    <g>
      <clipPath id={id}>
        <path d={`M-3000 -1000 L${x + k} -1000 L${x - k} 2080 L-3000 2080 Z`} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
};

/**
 * Zoom-through between two full-frame scenes (DOM level, each child is a complete Stage): the outgoing scene scales
 * up around the focal point and fades out; the incoming one scales up from the focal point behind it. Focal is in
 * design pixels (1920x1080). `maxScale` 4-8 reads as a plunge into the object at the focal point.
 */
export const ZoomThrough: React.FC<{ t: number; focal: { x: number; y: number }; from: React.ReactNode; to: React.ReactNode; maxScale?: number; toFrom?: number }> = ({
  t,
  focal,
  from,
  to,
  maxScale = 6,
  toFrom = 0.35,
}) => {
  const u = clamp01(t);
  const e = u * u * (3 - 2 * u);
  const outScale = Math.exp(Math.log(maxScale) * e);
  const outOpacity = 1 - smooth(u, 0.38, 0.72);
  const inScale = Math.exp(Math.log(toFrom) + (0 - Math.log(toFrom)) * e);
  const inOpacity = smooth(u, 0.3, 0.6);
  const origin = `${(focal.x / 1920) * 100}% ${(focal.y / 1080) * 100}%`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${inScale})`, transformOrigin: origin, opacity: inOpacity }}>{to}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${outScale})`, transformOrigin: origin, opacity: outOpacity }}>{from}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Cross-dissolve with a slight push (incoming slides 40 px from `dir`), DOM level. */
export const Dissolve: React.FC<{ t: number; from: React.ReactNode; to: React.ReactNode; dir?: "up" | "down" | "left" | "right"; push?: number }> = ({ t, from, to, dir = "up", push = 40 }) => {
  const e = smooth(t);
  const d = (1 - e) * push;
  const tr = dir === "up" ? `translateY(${d}px)` : dir === "down" ? `translateY(${-d}px)` : dir === "left" ? `translateX(${d}px)` : `translateX(${-d}px)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - e }}>{from}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: e, transform: tr }}>{to}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Outline morph: a rounded polygon path interpolated between outline a and outline b. */
export const morphPath = (a: Pt[], b: Pt[], t: number, r = 10, n?: number) => roundPoly(morphPts(a, b, smooth(t), n), r);

/** Scale pop after a hard cut at frame `at`: 1.035 → 1 over `dur` frames (apply as a CSS/SVG scale about the centre). */
export const cutPop = (frame: number, at: number, dur = 9, amount = 0.035) => {
  const t = frame - at;
  if (t < 0 || t >= dur) return 1;
  const u = t / dur;
  return 1 + amount * (1 - u) * (1 - u);
};

/** Flash on a cut or impact: white/light-colour overlay opacity, 0 → peak → 0 over `dur` frames. */
export const flash = (frame: number, at: number, dur = 8, peak = 0.5) => {
  const t = frame - at;
  if (t < 0 || t >= dur) return 0;
  return peak * (1 - t / dur);
};

/** Progress 0..1 of a transition that starts at `at` and lasts `dur` frames (clamped). */
export const prog = (frame: number, at: number, dur: number) => clamp01((frame - at) / dur);
