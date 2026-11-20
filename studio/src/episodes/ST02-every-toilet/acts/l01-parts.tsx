// ST02 rung 1 (one flush) props: the gallon jug, the home-day bar, the country outline, the flip calendar, pipes.
import React from "react";
import { GroundShadow } from "../../../lib/illustrated/light";
import { mixHex } from "../../../lib/illustrated/palette";
import { AIR, CHALK, INK, ST_FONT, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { clamp01, closedPath, CREAM, Pt, WATER, WATER_DK } from "./cold-parts";

const S = SUPPOSE.sage;

/** a clear jug (cutaway) with a handle; `level` 0..1 */
export const Jug: React.FC<{ x: number; base: number; w: number; h: number; level: number; frame: number; slosh?: number }> = ({ x, base, w, h, level, frame, slosh = 0 }) => {
  const x0 = x - w / 2, x1 = x + w / 2, top = base - h;
  const neck = w * 0.22;
  const body = `M ${x0 + 24} ${base} Q ${x0} ${base} ${x0} ${base - 30} L ${x0} ${top + h * 0.28} Q ${x0} ${top + h * 0.12} ${x - neck} ${top + h * 0.06} L ${x - neck} ${top} L ${x + neck} ${top} L ${x + neck} ${top + h * 0.06} Q ${x1} ${top + h * 0.12} ${x1} ${top + h * 0.28} L ${x1} ${base - 30} Q ${x1} ${base} ${x1 - 24} ${base} Z`;
  const wl = base - 8 - (h * 0.86) * clamp01(level);
  const n = 12;
  const surf = Array.from({ length: n + 1 }, (_, i) => {
    const xx = x0 + (w * i) / n;
    return `L ${xx.toFixed(1)} ${(wl + Math.sin(xx / 18 + frame * 0.4) * slosh).toFixed(1)}`;
  }).join(" ");
  const id = `jug${Math.round(x)}${Math.round(base)}`;
  return (
    <g>
      <GroundShadow x={x} y={base} rx={w * 0.7} opacity={0.22} />
      <defs><clipPath id={id}><path d={body} /></clipPath></defs>
      <path d={`M ${x1 - 6} ${top + h * 0.3} Q ${x1 + w * 0.32} ${top + h * 0.32} ${x1 + w * 0.3} ${top + h * 0.55} Q ${x1 + w * 0.28} ${top + h * 0.72} ${x1 - 6} ${top + h * 0.7}`} stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d={body} fill={CHALK} opacity={0.55} />
      <g clipPath={`url(#${id})`}>
        <path d={`M ${x0 - 10} ${base + 10} ${surf} L ${x1 + 10} ${base + 10} Z`} fill={WATER} />
        <path d={`M ${x0} ${wl + 6} H ${x1}`} stroke={AIR} strokeWidth={4} opacity={0.5} />
      </g>
      <path d={body} fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M ${x0 + 22} ${top + h * 0.34} V ${base - 50}`} stroke={CHALK} strokeWidth={10} strokeLinecap="round" opacity={0.6} />
      <rect x={x - neck - 8} y={top - 12} width={neck * 2 + 16} height={18} rx={8} fill={CHALK} stroke={INK} strokeWidth={4} />
    </g>
  );
};

// ------------------------------------------------------------------ the home-day bar (1-04 .. 1-06)
export const BAR = { x0: 220, x1: 1480, y: 520, h: 110 };
export const INDOOR = 0.62;
export const TOILET_PART = 0.29;
export const HomeBar: React.FC<{ fill: number; frame: number; dimOut?: number }> = ({ fill, frame, dimOut = 0 }) => {
  const { x0, x1, y, h } = BAR;
  const W = x1 - x0;
  const fx = x0 + W * clamp01(fill);
  const n = 8;
  const head = fill > 0 && fill < 1;
  const wave = Array.from({ length: n + 1 }, (_, i) => {
    const yy = y + (h * i) / n;
    return `L ${(fx + (head ? Math.sin(yy / 14 + frame * 0.5) * 8 : 0)).toFixed(1)} ${yy.toFixed(1)}`;
  }).join(" ");
  const id = "st02homebar";
  return (
    <g>
      <rect x={x0 + 8} y={y + 12} width={W} height={h} rx={h / 2} fill={INK} opacity={0.12} />
      <defs><clipPath id={id}><rect x={x0} y={y} width={W} height={h} rx={h / 2} /></clipPath></defs>
      <rect x={x0} y={y} width={W} height={h} rx={h / 2} fill={CHALK} opacity={0.7} />
      <g clipPath={`url(#${id})`}>
        {fill > 0 ? <path d={`M ${x0 - 10} ${y} L ${fx} ${y} ${wave} L ${x0 - 10} ${y + h} Z`} fill={WATER} /> : null}
        <path d={`M ${x0} ${y + 22} H ${fx - 10}`} stroke={AIR} strokeWidth={8} strokeLinecap="round" opacity={0.45} />
        {Array.from({ length: 14 }, (_, i) => {
          const bx = x0 + ((i * 97 + frame * (1.6 + (i % 3) * 0.5)) % W);
          if (bx > fx - 12) return null;
          const by = y + h - 18 - ((i * 31 + frame * 1.2) % (h - 30));
          return <circle key={i} cx={bx} cy={by} r={4 + (i % 3) * 2} fill={AIR} opacity={0.55} />;
        })}
        {dimOut > 0 ? <rect x={x0 + W * INDOOR} y={y - 4} width={W * (1 - INDOOR) + 10} height={h + 8} fill={S.sky[1]} opacity={0.6 * dimOut} /> : null}
      </g>
      <rect x={x0} y={y} width={W} height={h} rx={h / 2} fill="none" stroke={INK} strokeWidth={4} />
    </g>
  );
};

// ------------------------------------------------------------------ the country (contiguous US, map units 1000 × 600)
export const US_PTS: Pt[] = [
  [70, 70], [330, 70], [560, 78], [600, 118], [650, 100], [700, 140], [740, 118], [800, 110], [860, 70], [905, 55], [925, 100], [890, 150],
  [860, 190], [840, 250], [810, 310], [785, 370], [800, 430], [830, 520], [800, 560], [760, 480], [715, 445], [640, 450], [580, 462],
  [530, 540], [480, 520], [440, 455], [380, 440], [300, 430], [200, 400], [120, 350], [70, 260], [45, 150],
];
export const US_D = closedPath(US_PTS);
const inPoly = (p: Pt, poly: Pt[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
/** toilet sites inside the country (map units) */
export const US_SITES: Pt[] = (() => {
  const out: Pt[] = [];
  let i = 0;
  for (let y = 80; y < 560; y += 21) {
    for (let x = 60; x < 930; x += 21) {
      i++;
      const p: Pt = [x + ((i * 7) % 5) - 2 + (y % 42 ? 10 : 0), y];
      if (inPoly(p, US_PTS) && inPoly([p[0], p[1] - 14], US_PTS) && inPoly([p[0] + 8, p[1]], US_PTS) && inPoly([p[0] - 8, p[1]], US_PTS)) out.push(p);
    }
  }
  return out;
})();

// ------------------------------------------------------------------ the flip calendar (month names only, day dots)
export const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const CalPage: React.FC<{ x: number; y: number; w: number; h: number; m: number }> = ({ x, y, w, h, m }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={14} fill={CREAM} stroke={INK} strokeWidth={4} />
    <rect x={x} y={y} width={w} height={h * 0.26} rx={14} fill={TERRA} stroke={INK} strokeWidth={4} />
    <text x={x + w / 2} y={y + h * 0.19} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={h * 0.15} letterSpacing={4} fill={CHALK}>{MONTHS[m % 12]}</text>
    {Array.from({ length: 30 }, (_, i) => (
      <circle key={i} cx={x + w * 0.14 + (i % 7) * (w * 0.12)} cy={y + h * 0.38 + Math.floor(i / 7) * (h * 0.13)} r={w * 0.025} fill={INK} opacity={0.35} />
    ))}
  </g>
);
export const FlipCalendar: React.FC<{ x: number; y: number; w: number; h: number; t: number; period: number }> = ({ x, y, w, h, t, period }) => {
  const idx = Math.floor(t / period);
  const ph = (t % period) / period;
  const flip = clamp01((ph - 0.55) / 0.45);
  const sy = 1 - flip;
  return (
    <g>
      <rect x={x + 10} y={y + 14} width={w} height={h} rx={14} fill={INK} opacity={0.15} />
      <CalPage x={x} y={y} w={w} h={h} m={idx + 1} />
      {sy > 0.02 ? (
        <g transform={`translate(0 ${y}) scale(1 ${sy}) translate(0 ${-y})`} opacity={0.5 + 0.5 * sy}>
          <CalPage x={x} y={y} w={w} h={h} m={idx} />
        </g>
      ) : null}
      <rect x={x + w * 0.2} y={y - 14} width={14} height={34} rx={7} fill={INK} />
      <rect x={x + w * 0.8 - 14} y={y - 14} width={14} height={34} rx={7} fill={INK} />
    </g>
  );
};

/** a pipe: dark shell, blue-sage water core, moving flow dashes. `pts` drawn from the source end. */
export const Pipe: React.FC<{ d: string; w: number; flow: number; opacity?: number }> = ({ d, w, flow, opacity = 1 }) => (
  <g opacity={opacity}>
    <path d={d} stroke={mixHex(S.near, INK, 0.35)} strokeWidth={w + 8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} stroke={WATER_DK} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} stroke={AIR} strokeWidth={Math.max(3, w * 0.28)} fill="none" strokeLinecap="round" strokeDasharray={`${w * 0.9} ${w * 1.6}`} strokeDashoffset={-flow} opacity={0.85} />
  </g>
);
