// ST01 closer: rung icons (bag, air, mountain, calendar, rocket), the rocket with its exhaust, and the mini dot wall.
import React from "react";
import { rrect } from "../../../lib/illustrated/shapes";
import { rnd } from "../../../lib/illustrated/motion";
import { AIR, BRASS, CHALK, INK, OCEAN, TERRA } from "../../../lib/suppose/palette";
import { TERRA_DARK, TERRA_LIGHT } from "./l05-parts";

type IconP = { x: number; y: number; s?: number };
const G: React.FC<IconP & { children: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  s <= 0.001 ? null : <g transform={`translate(${x} ${y}) scale(${s})`}>{children}</g>
);

/** a weight bag (heavier) */
export const BagIcon: React.FC<IconP> = (p) => (
  <G {...p}>
    <path d="M -22 -46 a 22 20 0 1 1 44 0" stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d="M -36 -40 L 36 -40 Q 56 -40 56 0 Q 56 44 0 44 Q -56 44 -56 0 Q -56 -40 -36 -40 Z" fill={TERRA} stroke={INK} strokeWidth={5} />
    <ellipse cx={-22} cy={-14} rx={14} ry={9} fill={TERRA_LIGHT} opacity={0.8} />
  </G>
);

/** air thinning with height */
export const AirIcon: React.FC<IconP & { frame?: number }> = ({ frame = 0, ...p }) => (
  <G {...p}>
    <path d="M -64 46 H 64" stroke={CHALK} strokeWidth={6} strokeLinecap="round" />
    {Array.from({ length: 5 }, (_, row) => {
      const n = 9 - row * 2;
      return Array.from({ length: n }, (_, i) => (
        <circle key={`${row}-${i}`} cx={-56 + ((i + 0.5) * 112) / n + Math.sin(frame / 14 + i + row) * 2} cy={32 - row * 18} r={5.5 - row * 0.5} fill={AIR} />
      ));
    })}
  </G>
);

/** a mountain; `tall` stretches it (our Earth's tall peaks) */
export const MountainIcon: React.FC<IconP & { tall?: number }> = ({ tall = 1, ...p }) => {
  const h = 70 * tall;
  return (
    <G {...p}>
      <path d={`M -66 46 L -10 ${46 - h - 20} Q 0 ${36 - h - 26} 10 ${46 - h - 20} L 66 46 Z`} fill={TERRA_DARK} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d={`M -24 ${46 - h + 6} L -10 ${46 - h - 20} Q 0 ${36 - h - 26} 10 ${46 - h - 20} L 26 ${46 - h + 8} L 12 ${46 - h} L 0 ${46 - h + 10} L -12 ${46 - h} Z`} fill={CHALK} />
    </G>
  );
};

/** a calendar page */
export const CalendarIcon: React.FC<IconP> = (p) => (
  <G {...p}>
    <path d={rrect(-56, -46, 112, 98, 14)} fill={CHALK} stroke={INK} strokeWidth={5} />
    <path d={rrect(-56, -46, 112, 30, 14)} fill={TERRA} />
    <rect x={-56} y={-26} width={112} height={10} fill={TERRA} />
    <path d={rrect(-56, -46, 112, 98, 14)} fill="none" stroke={INK} strokeWidth={5} />
    <path d="M -28 -54 v 18 M 28 -54 v 18" stroke={INK} strokeWidth={8} strokeLinecap="round" />
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-36 + (i % 4) * 24} cy={4 + Math.floor(i / 4) * 16} r={4.5} fill={INK} opacity={0.75} />)}
  </G>
);

/** a little rocket pointing up (-y); `flame` 0..1 */
export const RocketIcon: React.FC<IconP & { flame?: number; frame?: number; rot?: number }> = ({ flame = 0, frame = 0, rot = 0, ...p }) => {
  const fl = flame * (0.85 + 0.15 * Math.sin(frame * 1.7));
  return (
    <G {...p}>
      <g transform={`rotate(${rot})`}>
        {fl > 0 ? (
          <g>
            <path d={`M -14 40 Q 0 ${40 + 80 * fl} 14 40 Z`} fill={BRASS} />
            <path d={`M -8 40 Q 0 ${40 + 48 * fl} 8 40 Z`} fill={CHALK} />
          </g>
        ) : null}
        <path d="M -20 10 L -38 40 L -20 34 Z M 20 10 L 38 40 L 20 34 Z" fill={TERRA} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 0 -62 Q 26 -30 22 38 L -22 38 Q -26 -30 0 -62 Z" fill={CHALK} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 0 -62 Q 16 -48 19 -32 L -19 -32 Q -16 -48 0 -62 Z" fill={TERRA} />
        <circle cx={0} cy={-6} r={10} fill={OCEAN} stroke={INK} strokeWidth={4} />
      </g>
    </G>
  );
};

/** exhaust puffs trailing a moving point: `pos(dt)` gives where the nozzle was dt frames ago */
export const Exhaust: React.FC<{ pos: (dt: number) => [number, number] | null; n?: number }> = ({ pos, n = 14 }) => (
  <g>
    {Array.from({ length: n }, (_, k) => {
      const p = pos(k * 3 + 2);
      if (!p) return null;
      const u = k / n;
      return <circle key={k} cx={p[0] + (rnd(k * 7) - 0.5) * 10 * u} cy={p[1] + (rnd(k * 3) - 0.5) * 10 * u} r={10 + u * 34} fill={k < 2 ? TERRA_LIGHT : CHALK} opacity={(1 - u) * 0.55} />;
    })}
  </g>
);

// ------------------------------------------------------------------ the mini dot wall (echoes STKeyGap)
export const wallX = (w: number) => 260 + ((w - 0.5) / 3.5) * 1200;
export type WallDot = { x: number; y: number; w: number; col: number; j: number; k: number };
export const wallDots = (axisY: number): WallDot[] => {
  const out: WallDot[] = [];
  let k = 0, col = 0;
  for (let w = 0.55; w < 4; w += 0.1, col++) {
    const n = Math.round(26 * Math.exp(-(((w - 1.3) / 0.28) ** 2)) + 23 * Math.exp(-(((w - 2.4) / 0.5) ** 2)) + 2 * Math.exp(-(((w - 3.4) / 0.6) ** 2)));
    for (let j = 0; j < n; j++) {
      k++;
      out.push({ x: wallX(w) + (rnd(k) - 0.5) * 5, y: axisY - 16 - j * 14.5, w, col, j, k });
    }
  }
  return out;
};
