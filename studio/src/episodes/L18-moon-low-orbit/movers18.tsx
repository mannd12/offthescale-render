// L18 movers (BUILD.md §5 "the movers", §0): pure functions of the frame, every one wraps or loops so it NEVER settles
// (the L17 settle-then-hold lesson). One probe pixel is 20 px at 1080p: keep speeds ≥ ~1.5 px/f for the whole shot.
// USAGE (f = the shot's frame)
//   <DotFlow f mode="line" from={[x,y]} to={[x,y]} n speed?=18 spread?=16 color|colors size? seed? />   dots stream from → to, wrap
//   <DotFlow f mode="fall" from={[x,y]} w? h? n speed? accel?=0.6 … />   dots fall straight down with acceleration (dust, rock)
//   <DotFlow f mode="infall" from={[cx,cy]} spread={ring radius} n speed? … />  dots fall inward onto a point (self-gravity, 5-06)
//   <DotFlow f mode="fill" from={[x,y]} w h fill={0..1} n … />   a box filling with dots from the bottom (cube fills, 3-05); the
//          filled dots jiggle 2 px and new dots keep dropping onto the front, so a full box still moves
//   <Trail points={trailOf(pos, f, 14, 2)} color width? />   a bright tapered trail behind a moving disc; `pos(frame)` → [x,y]
//   <SweepFront x y w h level={0..1} dir?="up"|"down"|"left"|"right" color edge? f clip? />   a fill front with a wavy lit edge
//          (the edge ripples at 6 px/f, so a held level still moves)
//   <StarsTint18 f x? y? w h n speed?=14 angle?=90 seed? size? />   apricot + aqua stars sliding at `speed` px/f along `angle`
//          (deg; 90 = downward, 270 = up, 0 = right), wrapping
//   <Streaks x y f angle?=180 n?=8 len?=90 speed?=30 spread?=40 color? />   speed streaks streaming off a token (behind it)
import React, { useId } from "react";
import { rnd } from "../../lib/illustrated";
import { L18_COLORS, STAR_TINTS } from "./families";

const C = L18_COLORS;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const fr = (v: number) => v - Math.floor(v);
const TAU = Math.PI * 2;

type Pt = [number, number];

export const DotFlow: React.FC<{
  f: number;
  mode?: "line" | "fall" | "infall" | "fill";
  from: Pt;
  to?: Pt;
  /** fall / fill: the box width and height (from = its top-left for fall, bottom-left for fill) */
  w?: number;
  h?: number;
  n: number;
  speed?: number;
  spread?: number;
  accel?: number;
  fill?: number;
  color?: string;
  colors?: string[];
  size?: number;
  seed?: number;
}> = ({ f, mode = "line", from, to, w = 200, h = 300, n, speed = 18, spread = 16, accel = 0.6, fill = 1, color = C.moonLit, colors, size = 5, seed = 1 }) => {
  const N = Math.min(100, n);
  const col = (i: number) => (colors ? colors[i % colors.length] : color);
  const dots: React.ReactNode[] = [];
  if (mode === "line") {
    const [x0, y0] = from;
    const [x1, y1] = to ?? [from[0] + 400, from[1]];
    const L = Math.hypot(x1 - x0, y1 - y0) || 1;
    const ux = (x1 - x0) / L;
    const uy = (y1 - y0) / L;
    for (let i = 0; i < N; i++) {
      const s = fr(rnd(seed * 13 + i) + (f * speed * (0.8 + 0.4 * rnd(seed * 7 + i))) / L);
      const off = (rnd(seed * 29 + i) - 0.5) * 2 * spread;
      const x = x0 + ux * s * L - uy * off;
      const y = y0 + uy * s * L + ux * off;
      const o = Math.min(1, s * 6, (1 - s) * 6);
      dots.push(<circle key={i} cx={x} cy={y} r={size * (0.6 + 0.6 * rnd(seed * 3 + i))} fill={col(i)} opacity={o} />);
    }
  } else if (mode === "fall") {
    for (let i = 0; i < N; i++) {
      const per = Math.sqrt((2 * h) / accel) * (0.9 + 0.3 * rnd(seed * 5 + i));
      const t = fr(rnd(seed * 17 + i) + f / per) * per;
      const v0 = speed * 0.25;
      const y = from[1] + Math.min(h, v0 * t + 0.5 * accel * t * t);
      const x = from[0] + rnd(seed * 23 + i) * w;
      const o = Math.min(1, (t / per) * 8, ((per - t) / per) * 8);
      dots.push(<circle key={i} cx={x} cy={y} r={size * (0.6 + 0.6 * rnd(seed * 3 + i))} fill={col(i)} opacity={o} />);
    }
  } else if (mode === "infall") {
    const [cx, cy] = from;
    for (let i = 0; i < N; i++) {
      const a = rnd(seed * 31 + i) * TAU;
      const s = fr(rnd(seed * 11 + i) + (f * speed) / Math.max(40, spread));
      const r = spread * (1 - s * s);
      const o = Math.min(1, s * 5, (1 - s) * 5);
      dots.push(<circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={size * (0.6 + 0.6 * rnd(seed * 3 + i))} fill={col(i)} opacity={o} />);
    }
  } else {
    // fill: a grid of dots from the bottom; the front row keeps dropping in
    const cols = Math.max(2, Math.round(Math.sqrt((N * w) / h)));
    const rows = Math.ceil(N / cols);
    const filled = Math.round(Math.max(0, Math.min(1, fill)) * rows * cols);
    const cw = w / cols;
    const rh = h / rows;
    for (let i = 0; i < Math.min(filled, N); i++) {
      const cxi = i % cols;
      const ryi = Math.floor(i / cols);
      const j = Math.sin(f * 0.5 + i) * 2;
      dots.push(<circle key={i} cx={from[0] + (cxi + 0.5) * cw + j} cy={from[1] - (ryi + 0.5) * rh} r={Math.min(cw, rh) * 0.34} fill={col(i)} />);
    }
    // droppers: always 6 dots falling onto the front (moves even when full)
    for (let k = 0; k < 6; k++) {
      const s = fr(rnd(seed * 41 + k) + (f * speed) / Math.max(60, h));
      const top = from[1] - h - 60;
      const front = from[1] - Math.ceil(filled / cols) * rh;
      dots.push(<circle key={"d" + k} cx={from[0] + rnd(seed * 43 + k) * w} cy={top + (front - top) * s} r={Math.min(cw, rh) * 0.3} fill={col(k)} opacity={Math.min(1, (1 - s) * 6)} />);
    }
  }
  return <g>{dots}</g>;
};

/** Sample a position function back in time: the newest point last. */
export const trailOf = (pos: (frame: number) => Pt, f: number, n = 14, step = 2): Pt[] => Array.from({ length: n }, (_, k) => pos(f - (n - 1 - k) * step));

export const Trail: React.FC<{ points: Pt[]; color?: string; width?: number; glow?: boolean }> = ({ points, color = C.moonRim, width = 14, glow = true }) => {
  if (points.length < 2) return null;
  const segs: React.ReactNode[] = [];
  for (let i = 1; i < points.length; i++) {
    const k = i / (points.length - 1);
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    if (glow) segs.push(<line key={"g" + i} x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth={width * 2.4 * k} strokeLinecap="round" opacity={0.18 * k} />);
    segs.push(<line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth={width * k} strokeLinecap="round" opacity={0.9 * k} />);
  }
  return <g>{segs}</g>;
};

export const SweepFront: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  level: number;
  dir?: "up" | "down" | "left" | "right";
  color: string;
  edge?: string;
  f: number;
  /** an SVG path the fill is clipped to (absolute coordinates) */
  clip?: string;
}> = ({ x, y, w, h, level, dir = "up", color, edge = C.moonRim, f, clip }) => {
  const id = "sf" + sid(useId());
  const L = Math.max(0, Math.min(1, level));
  const vertical = dir === "up" || dir === "down";
  const span = vertical ? h : w;
  const pos = L * span;
  // the wavy front: 12 segments, ripple travels at ~6 px/f
  const wave = (s: number) => Math.sin(s * 0.035 + f * 0.25) * 9 + Math.sin(s * 0.09 - f * 0.4) * 4;
  const pts: string[] = [];
  const steps = 24;
  for (let k = 0; k <= steps; k++) {
    const s = (k / steps) * (vertical ? w : h);
    const d = pos + (L > 0 && L < 1 ? wave(s) : L >= 1 ? wave(s) * 0.4 : 0);
    if (dir === "up") pts.push(`${x + s} ${y + h - d}`);
    if (dir === "down") pts.push(`${x + s} ${y + d}`);
    if (dir === "right") pts.push(`${x + d} ${y + s}`);
    if (dir === "left") pts.push(`${x + w - d} ${y + s}`);
  }
  const close =
    dir === "up" ? `L${x + w} ${y + h} L${x} ${y + h} Z` : dir === "down" ? `L${x + w} ${y} L${x} ${y} Z` : dir === "right" ? `L${x} ${y + h} L${x} ${y} Z` : `L${x + w} ${y + h} L${x + w} ${y} Z`;
  const body = `M${pts.join(" L")} ${close}`;
  const front = `M${pts.join(" L")}`;
  return (
    <g>
      {clip ? (
        <defs>
          <clipPath id={id}>
            <path d={clip} />
          </clipPath>
        </defs>
      ) : null}
      <g clipPath={clip ? `url(#${id})` : undefined}>
        {L > 0 ? <path d={body} fill={color} /> : null}
        {L > 0 ? <path d={front} fill="none" stroke={edge} strokeWidth={6} strokeLinecap="round" opacity={0.9} /> : null}
      </g>
    </g>
  );
};

export const StarsTint18: React.FC<{ f: number; x?: number; y?: number; w: number; h: number; n: number; speed?: number; angle?: number; seed?: number; size?: number }> = ({
  f,
  x = 0,
  y = 0,
  w,
  h,
  n,
  speed = 14,
  angle = 90,
  seed = 1,
  size = 2,
}) => {
  const a = (angle * Math.PI) / 180;
  const dx = Math.cos(a) * speed * f;
  const dy = Math.sin(a) * speed * f;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const depth = 0.55 + 0.45 * rnd(seed * 37 + i);
        const sx = x + fr(rnd(seed * 7 + i) + (dx * depth) / w) * w;
        const sy = y + fr(rnd(seed * 11 + i) + (dy * depth) / h) * h;
        const r = size * (0.5 + rnd(seed * 3 + i) * 1.3) * depth;
        const tw = 0.65 + 0.35 * Math.sin(f / (8 + rnd(i) * 14) + i);
        return <circle key={i} cx={sx} cy={sy} r={r} fill={STAR_TINTS[i % STAR_TINTS.length]} opacity={tw} />;
      })}
    </g>
  );
};

export const Streaks: React.FC<{ x: number; y: number; f: number; angle?: number; n?: number; len?: number; speed?: number; spread?: number; color?: string; width?: number }> = ({
  x,
  y,
  f,
  angle = 180,
  n = 8,
  len = 90,
  speed = 30,
  spread = 40,
  color = C.moonRim,
  width = 4,
}) => {
  const a = (angle * Math.PI) / 180;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const run = len * 4;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const s = fr(rnd(i * 5 + 2) + (f * speed) / run) * run;
        const off = (rnd(i * 9 + 1) - 0.5) * 2 * spread;
        const sx = x + ux * s - uy * off;
        const sy = y + uy * s + ux * off;
        const o = Math.max(0, 1 - s / run);
        return <line key={i} x1={sx} y1={sy} x2={sx + ux * len * (0.5 + rnd(i) * 0.5)} y2={sy + uy * len * (0.5 + rnd(i) * 0.5)} stroke={color} strokeWidth={width} strokeLinecap="round" opacity={o * 0.85} />;
      })}
    </g>
  );
};
