// Small drawing helpers shared by the L13 Shorts S51-S55 (episodes/S51..S55). Their shots are each Short's own drawings;
// this file only holds repeated pieces (a clock, a cross, a burst, a screen shake). Vertical 1080x1920.
import React from "react";
import { C } from "../S41-dig-plate/vkit";

/** Round clock face; `a` = hand position in turns (0 = 12 o'clock, 1 = a full turn). */
export const Clock: React.FC<{ x: number; y: number; r: number; a: number; face?: string; hand?: string; ticks?: number }> = ({ x, y, r, a, face = C.cream, hand = C.verm, ticks = 12 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={face} stroke={C.ink} strokeWidth={r * 0.08} />
    {Array.from({ length: ticks }, (_, i) => {
      const t = (i / ticks) * Math.PI * 2;
      return <path key={i} d={`M${Math.sin(t) * r * 0.8} ${-Math.cos(t) * r * 0.8} L${Math.sin(t) * r * 0.92} ${-Math.cos(t) * r * 0.92}`} stroke={C.ink} strokeWidth={r * 0.05} strokeLinecap="round" />;
    })}
    <path d={`M0 0 L${Math.sin(a * Math.PI * 2) * r * 0.74} ${-Math.cos(a * Math.PI * 2) * r * 0.74}`} stroke={hand} strokeWidth={r * 0.09} strokeLinecap="round" />
    <path d={`M0 0 L${Math.sin(a * Math.PI * 2 * 12) * r * 0.5} ${-Math.cos(a * Math.PI * 2 * 12) * r * 0.5}`} stroke={C.ink} strokeWidth={r * 0.07} strokeLinecap="round" />
    <circle r={r * 0.08} fill={C.ink} />
  </g>
);

/** A bold X (vermilion) that draws on over `k` 0..1. */
export const Cross: React.FC<{ x: number; y: number; r: number; k?: number; color?: string }> = ({ x, y, r, k = 1, color = C.verm }) => {
  const a = Math.min(1, k * 2);
  const b = Math.max(0, k * 2 - 1);
  return (
    <g transform={`translate(${x} ${y})`} stroke={color} strokeWidth={r * 0.22} strokeLinecap="round" fill="none">
      <path d={`M${-r} ${-r} L${-r + 2 * r * a} ${-r + 2 * r * a}`} />
      <path d={`M${r} ${-r} L${r - 2 * r * b} ${-r + 2 * r * b}`} />
    </g>
  );
};

/** Radial burst of short rays (a hit, a click, a flash). */
export const Burst: React.FC<{ x: number; y: number; r0: number; r1: number; n?: number; color?: string; width?: number; rot?: number; opacity?: number }> = ({ x, y, r0, r1, n = 14, color = C.amber, width = 14, rot = 0, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity} stroke={color} strokeWidth={width} strokeLinecap="round">
    {Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2;
      return <path key={i} d={`M${Math.cos(t) * r0} ${Math.sin(t) * r0} L${Math.cos(t) * r1} ${Math.sin(t) * r1}`} />;
    })}
  </g>
);

/** Screen-shake offset for a `<g transform>`: decays from frame `from` over `len` frames. */
export const shake = (f: number, from: number, len: number, amp = 14): string => {
  const k = f < from || f > from + len ? 0 : 1 - (f - from) / len;
  return `translate(${(Math.sin(f * 2.7) * amp * k).toFixed(1)} ${(Math.cos(f * 3.1) * amp * k).toFixed(1)})`;
};

/** A sinusoidal bob in px. */
export const bob = (f: number, period = 20, amp = 10, ph = 0) => Math.sin((f / period) * Math.PI * 2 + ph) * amp;
