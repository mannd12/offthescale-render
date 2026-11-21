// L19 movers (BUILD.md §5 `flows19.tsx`): the particle and fill systems that keep shots alive. ≤ 100 particles each.
// `Embers` is the kit's (ambient.tsx); these are L19's own. Every mover loops forever (no settle-then-hold).
// USAGE (f = the shot's frame)
//   <Sparks f x y w h n?=60 speed?=30 mode?="trail"|"zigzag" angle?={deg, trail direction} color? seed? />
//       trail: flare sparks streaming backward from (x, y) along `angle` at `speed` px/f (1-02)
//       zigzag: conduction sparks crawling across the box in zig-zag strokes at `speed` px/f (6-05 through the gold)
//   <Rain19 f x y w h n?=50 speed?=18 color? seed? />  droplets that form at the top, fall at 16-22 px/f, merge and splash
//   <Sweep19 x y w h p={0..1} color edge? vertical? />  a fill front: a colour fill with a bright soft edge (26-30 px/f when
//       the caller drives p at speed/w per frame)
//   <StarsTint f x y w h n speed?=12 angle?=180 seed? size? />  stars tinted apricot and aqua, sliding (never grey-white)
import React from "react";
import { rnd } from "../../lib/illustrated";
import { L19_COLORS as C, STAR_TINTS } from "./families";

const fr = (v: number) => v - Math.floor(v);

export const Sparks: React.FC<{ f: number; x: number; y: number; w: number; h: number; n?: number; speed?: number; mode?: "trail" | "zigzag"; angle?: number; color?: string; seed?: number }> = ({
  f,
  x,
  y,
  w,
  h,
  n = 60,
  speed = 30,
  mode = "trail",
  angle = 200,
  color = C.goldHot,
  seed = 1,
}) => {
  const N = Math.min(100, n);
  if (mode === "trail") {
    const a = (angle * Math.PI) / 180;
    const L = Math.hypot(w, h);
    return (
      <g>
        {Array.from({ length: N }, (_, i) => {
          const life = L / (speed * (0.6 + rnd(seed * 5 + i) * 0.8));
          const age = fr(f / life + rnd(seed * 3 + i));
          const d = age * L;
          const off = (rnd(seed * 7 + i) - 0.5) * h * 0.5 * (0.3 + age);
          const px = x + Math.cos(a) * d - Math.sin(a) * off;
          const py = y + Math.sin(a) * d + Math.cos(a) * off;
          const len = 18 + rnd(seed * 11 + i) * 30;
          const o = 1 - age;
          return (
            <g key={i} opacity={o}>
              <line x1={px} y1={py} x2={px - Math.cos(a) * len} y2={py - Math.sin(a) * len} stroke={i % 3 ? color : C.glow} strokeWidth={4 + rnd(i) * 3} strokeLinecap="round" />
              <circle cx={px} cy={py} r={4 + rnd(seed + i) * 3} fill="#FFF0A0" />
            </g>
          );
        })}
      </g>
    );
  }
  // zigzag conduction: each spark is a short bolt whose head crawls across the box
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {Array.from({ length: Math.min(N, 24) }, (_, i) => {
        const yy = y + rnd(seed * 13 + i) * h;
        const life = (w + 200) / (speed * (0.7 + rnd(seed * 17 + i) * 0.6));
        const age = fr(f / life + rnd(seed * 19 + i));
        const hx = x - 100 + age * (w + 200);
        const pts = Array.from({ length: 6 }, (_, k) => `${(hx - k * 26).toFixed(1)},${(yy + (k % 2 ? 16 : -16) * (0.6 + rnd(i * 7 + k) * 0.8)).toFixed(1)}`);
        return (
          <g key={i}>
            <polyline points={pts.join(" ")} stroke="#8E1A18" strokeWidth={11} opacity={0.55} />
            <polyline points={pts.join(" ")} stroke={i % 2 ? color : "#FFF6C8"} strokeWidth={4.5} />
          </g>
        );
      })}
    </g>
  );
};

/** Droplets that form, fall and merge (6-08 helium rain; storyboard 16-22 px/f). */
export const Rain19: React.FC<{ f: number; x: number; y: number; w: number; h: number; n?: number; speed?: number; color?: string; seed?: number }> = ({
  f,
  x,
  y,
  w,
  h,
  n = 50,
  speed = 18,
  color = C.goldHot,
  seed = 2,
}) => (
  <g>
    {Array.from({ length: Math.min(100, n) }, (_, i) => {
      const sp = speed * (0.85 + rnd(seed * 3 + i) * 0.3);
      const life = h / sp + 14;
      const age = fr(f / life + rnd(seed * 5 + i)) * life;
      const px = x + rnd(seed * 7 + i) * w + Math.sin(age / 9 + i) * 4;
      const form = Math.min(1, age / 14);
      const py = y + Math.max(0, age - 14) * sp;
      const r = (5 + rnd(seed * 11 + i) * 6) * form * (1 + Math.max(0, age - 14) / life);
      const splash = py > y + h - 20;
      return splash ? (
        <ellipse key={i} cx={px} cy={y + h} rx={r * 2.2} ry={r * 0.5} fill={color} opacity={0.7} />
      ) : (
        <g key={i}>
          <line x1={px} y1={py - r * 3} x2={px} y2={py} stroke={color} strokeWidth={r * 0.8} opacity={0.35} strokeLinecap="round" />
          <circle cx={px} cy={py} r={r} fill={color} />
          <circle cx={px - r * 0.3} cy={py - r * 0.3} r={r * 0.35} fill="#FFF6C8" opacity={0.8} />
        </g>
      );
    })}
  </g>
);

/** A fill front: colour fills the box up to p with a bright soft leading edge. */
export const Sweep19: React.FC<{ x: number; y: number; w: number; h: number; p: number; color: string; edge?: string; vertical?: boolean }> = ({ x, y, w, h, p, color, edge = C.goldHot, vertical = false }) => {
  const id = "sw19" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const q = Math.max(0, Math.min(1, p));
  if (q <= 0) return null;
  const gid = `${id}-g`;
  if (vertical) {
    const top = y + h * (1 - q);
    return (
      <g>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={edge} stopOpacity={0.95} />
            <stop offset="1" stopColor={edge} stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect x={x} y={top} width={w} height={h * q} fill={color} />
        <rect x={x} y={top - 6} width={w} height={46} fill={`url(#${gid})`} />
      </g>
    );
  }
  const right = x + w * q;
  return (
    <g>
      <defs>
        <linearGradient id={gid} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor={edge} stopOpacity={0.95} />
          <stop offset="1" stopColor={edge} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w * q} height={h} fill={color} />
      <rect x={right - 46} y={y} width={52} height={h} fill={`url(#${gid})`} />
    </g>
  );
};

/** Tinted stars sliding along `angle` (deg) at `speed` px/f, wrapping inside the box. */
export const StarsTint: React.FC<{ f: number; x?: number; y?: number; w: number; h: number; n: number; speed?: number; angle?: number; seed?: number; size?: number }> = ({
  f,
  x = 0,
  y = 0,
  w,
  h,
  n,
  speed = 12,
  angle = 180,
  seed = 1,
  size = 2.4,
}) => {
  const a = (angle * Math.PI) / 180;
  return (
    <g>
      {Array.from({ length: Math.min(140, n) }, (_, i) => {
        const z = 0.4 + rnd(seed * 23 + i) * 0.8;
        const px = x + fr(rnd(seed * 3 + i) + (Math.cos(a) * f * speed * z) / w) * w;
        const py = y + fr(rnd(seed * 5 + i) + (Math.sin(a) * f * speed * z) / h) * h;
        const r = size * z * (0.8 + 0.3 * Math.sin(f * 0.2 + i));
        return <circle key={i} cx={px} cy={py} r={r} fill={STAR_TINTS[i % STAR_TINTS.length]} opacity={0.55 + 0.4 * z} />;
      })}
    </g>
  );
};
