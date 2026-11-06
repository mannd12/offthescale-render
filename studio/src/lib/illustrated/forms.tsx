// Forms with light and life (2026-11-05 art upgrade). Still flat and straight-edged ("survey chart"), but every
// solid gets two flat tones (lit left / shadow right, see shade()/lit() in palette.ts) and small things move.
import React from "react";
import { rnd } from "./motion";
import { ptsToPath } from "./lines";

/**
 * A ridge line with faceted two-tone shading: the base fill is the lit tone; every slope that falls to the right
 * (away from the low sun on the left) gets a flat shadow facet that runs from the crest down to the base.
 */
export const ShadedRidge: React.FC<{ pts: [number, number][]; base: number; fill: string; shadow: string; edge?: string }> = ({ pts, base, fill, shadow, edge }) => {
  const x0 = pts[0][0];
  const x1 = pts[pts.length - 1][0];
  const facets: string[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    if (by > ay + 2) {
      const foot = ax + (bx - ax) * 0.45;
      facets.push(ptsToPath([[ax, ay], [bx, by], [bx, base], [foot, base]]) + " Z");
    }
  }
  return (
    <g>
      <path d={ptsToPath([[x0, base], ...pts, [x1, base]]) + " Z"} fill={fill} />
      {facets.map((d, i) => (
        <path key={i} d={d} fill={shadow} />
      ))}
      {edge ? <path d={ptsToPath(pts)} fill="none" stroke={edge} strokeWidth={1.5} strokeLinejoin="round" /> : null}
    </g>
  );
};

/** A conifer as stacked straight-edged tiers: left half lit, right half in shadow. Pivots at the foot for sway. */
export const Conifer: React.FC<{ x: number; y: number; h: number; litColor: string; shadeColor: string; sway?: number; tiers?: number }> = ({
  x,
  y,
  h,
  litColor,
  shadeColor,
  sway = 0,
  tiers = 3,
}) => {
  const w = h * 0.34;
  const trunk = h * 0.08;
  const parts = Array.from({ length: tiers }, (_, i) => {
    const top = y - h + (i * h * 0.62) / tiers;
    const bot = y - trunk - ((tiers - 1 - i) * h * 0.18) / tiers;
    const half = w * (0.55 + (0.45 * (i + 1)) / tiers);
    return { top, bot, half };
  });
  return (
    <g transform={`rotate(${sway} ${x} ${y})`}>
      <rect x={x - h * 0.02} y={y - trunk} width={h * 0.04} height={trunk} fill={shadeColor} />
      {parts.map((p, i) => (
        <g key={i}>
          <path d={`M${x} ${p.top} L${x} ${p.bot} L${x - p.half} ${p.bot} Z`} fill={litColor} />
          <path d={`M${x} ${p.top} L${x + p.half} ${p.bot} L${x} ${p.bot} Z`} fill={shadeColor} />
        </g>
      ))}
    </g>
  );
};

/** A loose flock of distant birds: thin chevrons that flap on their own phase while the flock crosses the sky. */
export const Flock: React.FC<{ frame: number; x: number; y: number; vx: number; n?: number; size?: number; color: string; seed?: number }> = ({
  frame,
  x,
  y,
  vx,
  n = 5,
  size = 12,
  color,
  seed = 1,
}) => (
  <g fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round">
    {Array.from({ length: n }, (_, i) => {
      const bx = x + frame * vx + (i % 2 ? 1 : -1) * i * size * 2.2 + rnd(seed + i) * size * 3;
      const by = y + i * size * 1.1 + Math.sin(frame / 23 + i) * size * 0.4;
      const flap = 0.15 + 0.55 * Math.abs(Math.sin(frame / (4.2 + rnd(seed * 3 + i) * 1.5) + i));
      const s = size * (0.8 + rnd(seed * 7 + i) * 0.4);
      return <path key={i} d={`M${bx - s} ${by - s * flap} L${bx} ${by} L${bx + s} ${by - s * flap}`} />;
    })}
  </g>
);

/**
 * Rising puffs (breath in cold air, dust, vapour): straight-edged hexagons that grow, drift and fade.
 * One new puff every `period` frames; `drift` is the sideways wind in px per frame.
 */
export const Puffs: React.FC<{ frame: number; x: number; y: number; color: string; period?: number; size?: number; rise?: number; drift?: number; life?: number; seed?: number }> = ({
  frame,
  x,
  y,
  color,
  period = 75,
  size = 14,
  rise = 0.6,
  drift = 0.4,
  life = 60,
  seed = 1,
}) => {
  const out: React.ReactNode[] = [];
  const first = Math.floor((frame - life) / period);
  for (let k = Math.max(first, -2); k <= Math.floor(frame / period); k++) {
    const age = frame - k * period;
    if (age < 0 || age > life) continue;
    const a = age / life;
    const r = size * (0.5 + a * 1.6);
    const cx = x + age * drift + (rnd(seed + k) - 0.5) * size;
    const cy = y - age * rise;
    const pts: [number, number][] = Array.from({ length: 6 }, (_, j) => {
      const ang = (j / 6) * Math.PI * 2 + rnd(seed * 5 + k) * 0.6;
      const rr = r * (0.8 + rnd(seed * 11 + k * 6 + j) * 0.35);
      return [cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr * 0.72];
    });
    out.push(<path key={k} d={ptsToPath(pts) + " Z"} fill={color} opacity={(1 - a) * (a < 0.12 ? a / 0.12 : 1) * 0.7} />);
  }
  return <g>{out}</g>;
};

/** Falling specks (snow, grit) that wrap vertically inside [0, h]: deterministic, so stills match the render. */
export const fall = (frame: number, n: number, w: number, h: number, seed = 1, speed = 1.2, sway = 10) =>
  Array.from({ length: n }, (_, i) => {
    const sp = speed * (0.6 + rnd(seed * 3 + i) * 0.8);
    const y0 = rnd(seed * 17 + i) * h;
    const y = (((y0 + frame * sp) % h) + h) % h;
    const x = rnd(seed * 29 + i) * w + Math.sin(frame / (40 + rnd(i) * 30) + i) * sway;
    return { x, y, r: 1.4 + rnd(seed * 41 + i) * 2.2 };
  });
