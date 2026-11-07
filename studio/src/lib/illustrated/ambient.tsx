// Kit v2 ambient life (docs/STYLE-V2.md §4): the world is never still. Twinkling stars, drifting motes, rising embers
// or bubbles, expanding ripples, swaying and bobbing props, traffic lanes, squash-and-stretch. Everything is a pure
// function of the frame, so stills match the render and nothing has state.
import React from "react";
import { rnd } from "./motion";

const TAU = Math.PI * 2;

/** Twinkling stars in a box: each has its own period and phase; `twinkle` 0..1 is the depth of the flicker. */
export const Stars: React.FC<{ frame: number; n: number; x?: number; y?: number; w: number; h: number; color: string; seed?: number; size?: number; twinkle?: number }> = ({
  frame,
  n,
  x = 0,
  y = 0,
  w,
  h,
  color,
  seed = 1,
  size = 1.6,
  twinkle = 0.6,
}) => (
  <g fill={color}>
    {Array.from({ length: n }, (_, i) => {
      const sx = x + rnd(seed * 7 + i) * w;
      const sy = y + rnd(seed * 11 + i) * h;
      const r = size * (0.5 + rnd(seed * 3 + i) * 1.2);
      const ph = rnd(seed * 17 + i) * TAU;
      const per = 60 + rnd(seed * 19 + i) * 120;
      const o = 1 - twinkle * (0.5 + 0.5 * Math.sin((frame / per) * TAU + ph));
      const big = r > size * 1.4;
      return (
        <g key={i} opacity={o}>
          <circle cx={sx} cy={sy} r={r} />
          {big ? <path d={`M${sx - r * 3} ${sy} H${sx + r * 3} M${sx} ${sy - r * 3} V${sy + r * 3}`} stroke={color} strokeWidth={0.8} opacity={0.6} /> : null}
        </g>
      );
    })}
  </g>
);

/** Drifting motes (dust in a light shaft, plankton, pollen): slow 2-D drift, a soft glow pulse, fixed positions. */
export const Motes: React.FC<{ frame: number; n: number; x?: number; y?: number; w: number; h: number; color: string; seed?: number; size?: number; drift?: number; glow?: boolean }> = ({
  frame,
  n,
  x = 0,
  y = 0,
  w,
  h,
  color,
  seed = 1,
  size = 3,
  drift = 14,
  glow = true,
}) => (
  <g fill={color}>
    {Array.from({ length: n }, (_, i) => {
      const ph = rnd(seed * 5 + i) * TAU;
      const per = 160 + rnd(seed * 9 + i) * 200;
      const mx = x + rnd(seed * 13 + i) * w + Math.sin((frame / per) * TAU + ph) * drift;
      const my = y + rnd(seed * 23 + i) * h + Math.sin((frame / (per * 0.8)) * TAU + ph * 1.7) * drift * 0.6;
      const r = size * (0.5 + rnd(seed * 29 + i));
      const o = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin((frame / (per * 0.5)) * TAU + ph));
      return (
        <g key={i} opacity={o}>
          {glow ? <circle cx={mx} cy={my} r={r * 2.6} opacity={0.25} /> : null}
          <circle cx={mx} cy={my} r={r} />
        </g>
      );
    })}
  </g>
);

/**
 * Risers: particles born along [x0, x1] at `y`, rising `rise` px/frame with a sideways wiggle, shrinking and fading over
 * `life` frames. Embers (glowing, fast, small) and Bubbles (round, slow, growing) are presets of this.
 */
export const Risers: React.FC<{
  frame: number;
  x0: number;
  x1: number;
  y: number;
  n: number;
  color: string;
  seed?: number;
  rise?: number;
  life?: number;
  size?: number;
  wiggle?: number;
  grow?: boolean;
  glow?: boolean;
}> = ({ frame, x0, x1, y, n, color, seed = 1, rise = 1.4, life = 120, size = 3, wiggle = 10, grow = false, glow = false }) => (
  <g fill={color}>
    {Array.from({ length: n }, (_, i) => {
      const offset = rnd(seed * 3 + i) * life;
      const age = (frame + offset) % life;
      const a = age / life;
      const sp = rise * (0.7 + rnd(seed * 7 + i) * 0.6);
      const bx = x0 + rnd(seed * 11 + i) * (x1 - x0) + Math.sin(age / (14 + rnd(i) * 10) + i) * wiggle;
      const by = y - age * sp;
      const r = size * (grow ? 0.4 + a * 1.2 : 1.2 - a * 0.8) * (0.6 + rnd(seed * 17 + i) * 0.8);
      const o = a < 0.1 ? a / 0.1 : 1 - (a - 0.1) / 0.9;
      return (
        <g key={i} opacity={o}>
          {glow ? <circle cx={bx} cy={by} r={r * 3} opacity={0.22} /> : null}
          <circle cx={bx} cy={by} r={Math.max(0.3, r)} />
        </g>
      );
    })}
  </g>
);
export const Embers: React.FC<Omit<React.ComponentProps<typeof Risers>, "grow" | "glow">> = (p) => <Risers rise={1.6} life={110} size={2.6} wiggle={14} {...p} glow />;
export const Bubbles: React.FC<Omit<React.ComponentProps<typeof Risers>, "grow" | "glow">> = (p) => <Risers rise={0.9} life={160} size={3} wiggle={6} {...p} grow />;

/**
 * Expanding ripples / wavefronts: concentric ellipses born every `period` frames at (cx, cy), growing to (rx, ry) and
 * fading. `count` controls how many are alive at once. Used for sound fronts crossing a sea, rain rings, shockwaves.
 */
export const Ripples: React.FC<{ frame: number; cx: number; cy: number; rx: number; ry: number; period?: number; count?: number; color: string; width?: number; strength?: number; dash?: string; a0?: number; a1?: number }> = ({
  frame,
  cx,
  cy,
  rx,
  ry,
  period = 40,
  count = 6,
  color,
  width = 3,
  strength = 0.8,
  dash,
}) => (
  <g fill="none" stroke={color} strokeDasharray={dash} strokeLinecap="round">
    {Array.from({ length: count }, (_, i) => {
      const life = period * count;
      const age = (frame + i * period) % life;
      const a = age / life;
      const o = (1 - a) * strength * (a < 0.05 ? a / 0.05 : 1);
      return <ellipse key={i} cx={cx} cy={cy} rx={rx * a} ry={ry * a} opacity={o} strokeWidth={width * (1 - a * 0.5)} />;
    })}
  </g>
);

/** Sway a group around a pivot: a slow sine plus a smaller faster one (grass, trees, antennae, a hanging lamp). */
export const Sway: React.FC<{ frame: number; x: number; y: number; amp?: number; period?: number; seed?: number; children: React.ReactNode }> = ({
  frame,
  x,
  y,
  amp = 2,
  period = 120,
  seed = 1,
  children,
}) => {
  const ph = rnd(seed) * TAU;
  const a = Math.sin((frame / period) * TAU + ph) * amp + Math.sin((frame / (period * 0.37)) * TAU + ph * 2) * amp * 0.25;
  return <g transform={`rotate(${a.toFixed(3)} ${x} ${y})`}>{children}</g>;
};

/** Bob a group up and down with a slight roll (boats, balloons, floating things). */
export const Bobber: React.FC<{ frame: number; x: number; y: number; amp?: number; roll?: number; period?: number; seed?: number; children: React.ReactNode }> = ({
  frame,
  x,
  y,
  amp = 5,
  roll = 2,
  period = 110,
  seed = 1,
  children,
}) => {
  const ph = rnd(seed) * TAU;
  const t = (frame / period) * TAU + ph;
  return <g transform={`translate(0 ${(Math.sin(t) * amp).toFixed(2)}) rotate(${(Math.sin(t + 1.2) * roll).toFixed(3)} ${x} ${y})`}>{children}</g>;
};

/** Squash-and-stretch factors for a bounce phase p (0..1 per bounce): wide at impact, tall mid-air. Volume preserved. */
export const squash = (p: number, amount = 0.12) => {
  const s = Math.sin(p * TAU);
  const sy = 1 + s * amount;
  return { sx: 1 / sy, sy };
};

/** Landing squash after a step/impact at `at` frames: a quick compress-and-recover over ~10 frames. */
export const impact = (frame: number, at: number, amount = 0.18, dur = 10) => {
  const t = frame - at;
  if (t < 0 || t > dur) return { sx: 1, sy: 1 };
  const k = Math.sin((t / dur) * Math.PI) * amount;
  return { sx: 1 + k, sy: 1 - k };
};

/** Positions of `n` things moving along a lane from x0 to x1 (wrapping), with per-item speed jitter; dir -1 reverses. */
export const lane = (frame: number, n: number, x0: number, x1: number, speed: number, seed = 1, dir: 1 | -1 = 1) =>
  Array.from({ length: n }, (_, i) => {
    const span = x1 - x0;
    const sp = speed * (0.8 + rnd(seed * 5 + i) * 0.4);
    const start = rnd(seed * 9 + i) * span;
    const u = (((start + frame * sp * dir) % span) + span) % span;
    return { x: x0 + u, i, phase: u / span };
  });

/** A sea or lake surface: a smooth sine line with two harmonics travelling sideways, filled down to `bottom`. */
export const seaSurface = (frame: number, x0: number, x1: number, y: number, amp = 6, wavelength = 240, speed = 1.2, bottom = 1500, step = 40) => {
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += step) {
    const k = (x / wavelength) * TAU;
    const yy = y + Math.sin(k + (frame * speed) / 30) * amp + Math.sin(k * 2.3 - (frame * speed) / 22) * amp * 0.35;
    pts.push(`${x.toFixed(1)} ${yy.toFixed(1)}`);
  }
  return `M${pts.join(" L")} L${x1} ${bottom} L${x0} ${bottom} Z`;
};

/** Pulsing scale around 1 for a glow or a heartbeat (fast version of breathe()). */
export const pulse = (frame: number, period = 40, amount = 0.08, seed = 1) => 1 + Math.sin((frame / period) * TAU + rnd(seed) * TAU) * amount;

/** Flicker 0..1 for flames / lamps: two incommensurate sines plus a touch of hash noise. */
export const flicker = (frame: number, seed = 1, depth = 0.25) =>
  1 - depth * (0.5 + 0.3 * Math.sin(frame / 3.1 + seed) + 0.2 * Math.sin(frame / 7.7 + seed * 2) + 0.15 * (rnd(frame + seed * 99) - 0.5));
