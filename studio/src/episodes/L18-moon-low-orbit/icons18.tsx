// L18 small shared icons (BUILD.md §5 `icons18.tsx`). Flat, two-tone, lit from the upper left; no logos, no real devices.
// USAGE
//   <PeaIcon x y size? />                         Tick's green pea (1-02): sized to cover the tiny Moon at arm's length
//   <RockChip x y size? rotate? />                 a warm rock chip (6-01: the chip; 5-07: the falling rock)
//   <Clipboard x y size? rotate? />                Tick's clipboard (C-01); a pencil line on it
//   <LaserDots x0 y0 x1 y1 f period?=36 />         a pulse that flies out to (x1,y1) and back (8-02, the ranging dot); loops
//   <Magnifier x y size? rotate? />                a lens (8-05: looking closely)
//   <Tape x y length unroll={0..1} f rotate? label?={a data18 text} caseR?=44 />   a tape measure unrolling from its case; the ticks
//          on the tape crawl as it pays out; `label` sits at the tape's end (8-14: 3.8 CM A YEAR)
import React from "react";
import { IF2 } from "../../lib/illustrated";
import { L18_COLORS } from "./families";
import { assertAllowed } from "./data18";

const C = L18_COLORS;
const cl = (v: number) => Math.max(0, Math.min(1, v));

export const PeaIcon: React.FC<{ x: number; y: number; size?: number }> = ({ x, y, size = 24 }) => (
  <g>
    <circle cx={x + size * 0.06} cy={y + size * 0.08} r={size / 2} fill="#1E6A1A" opacity={0.35} />
    <circle cx={x} cy={y} r={size / 2} fill="#5FC83A" />
    <circle cx={x + size * 0.12} cy={y + size * 0.12} r={size * 0.36} fill="#3FA02A" />
    <circle cx={x - size * 0.16} cy={y - size * 0.16} r={size * 0.12} fill="#D9FFB0" />
  </g>
);

export const RockChip: React.FC<{ x: number; y: number; size?: number; rotate?: number }> = ({ x, y, size = 60, rotate = 0 }) => {
  const s = size / 60;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <path d="M-28 6 L-18 -20 L6 -28 L28 -10 L24 16 L0 26 L-22 20 Z" fill={C.moonShade} />
      <path d="M-28 6 L-18 -20 L6 -28 L2 -2 Z" fill={C.moonLit} />
      <path d="M6 -28 L28 -10 L2 -2 Z" fill={C.moonMid} />
      <path d="M-28 6 L-18 -20 L6 -28 L28 -10 L24 16 L0 26 L-22 20 Z" fill="none" stroke="#7A3A0C" strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  );
};

export const Clipboard: React.FC<{ x: number; y: number; size?: number; rotate?: number }> = ({ x, y, size = 60, rotate = 0 }) => {
  const s = size / 60;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <rect x={-22} y={-30} width={44} height={60} rx={5} fill="#C97A38" />
      <rect x={-17} y={-22} width={34} height={48} rx={2} fill={C.lemon} />
      <rect x={-9} y={-34} width={18} height={10} rx={3} fill={C.teal} />
      {[-12, -4, 4, 12].map((ly) => (
        <line key={ly} x1={-12} y1={ly} x2={12 - (ly > 8 ? 8 : 0)} y2={ly} stroke={C.ink} strokeWidth={2.2} />
      ))}
    </g>
  );
};

export const LaserDots: React.FC<{ x0: number; y0: number; x1: number; y1: number; f: number; period?: number; color?: string }> = ({ x0, y0, x1, y1, f, period = 36, color = C.lever }) => {
  const ph = (((f % period) + period) % period) / period;
  const out = ph < 0.5;
  const t = out ? ph * 2 : (1 - ph) * 2;
  const px = x0 + (x1 - x0) * t;
  const py = y0 + (y1 - y0) * t;
  return (
    <g>
      <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={color} strokeWidth={2} strokeDasharray="6 10" strokeDashoffset={-f * 4} opacity={0.5} />
      <circle cx={px} cy={py} r={22} fill={color} opacity={0.3} />
      <circle cx={px} cy={py} r={9} fill="#FFE7A0" />
      <circle cx={x1} cy={y1} r={6 + (ph > 0.45 && ph < 0.6 ? 8 : 0)} fill={color} opacity={0.9} />
    </g>
  );
};

export const Magnifier: React.FC<{ x: number; y: number; size?: number; rotate?: number }> = ({ x, y, size = 80, rotate = 0 }) => {
  const s = size / 80;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <line x1={22} y1={22} x2={48} y2={48} stroke="#7A3A0C" strokeWidth={12} strokeLinecap="round" />
      <circle cx={0} cy={0} r={30} fill={C.sky} opacity={0.45} />
      <circle cx={0} cy={0} r={30} fill="none" stroke={C.amber} strokeWidth={7} />
      <path d="M-16 -10 A18 18 0 0 1 -4 -20" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
    </g>
  );
};

export const Tape: React.FC<{ x: number; y: number; length: number; unroll: number; f: number; rotate?: number; label?: string; caseR?: number }> = ({ x, y, length, unroll, f, rotate = 0, label, caseR = 44 }) => {
  const k = caseR / 44;
  const L = length * cl(unroll);
  const tickGap = 22;
  const crawl = ((L % tickGap) + tickGap) % tickGap;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={0} y={-12} width={L} height={24} fill={C.lemon} stroke={C.lemonDeep} strokeWidth={2} />
      {Array.from({ length: Math.floor(L / tickGap) + 1 }, (_, i) => {
        const tx = L - crawl - i * tickGap;
        if (tx < 4) return null;
        return <line key={i} x1={tx} y1={-12} x2={tx} y2={i % 5 === 0 ? 6 : -2} stroke={C.ink} strokeWidth={2} />;
      })}
      <rect x={L - 4} y={-18} width={10} height={36} rx={2} fill="#7A3A0C" />
      <g transform={`translate(${-40 * k} 0) rotate(${(-f * 6) % 360}) scale(${k})`}>
        <circle cx={0} cy={0} r={44} fill={C.amber} stroke="#7A3A0C" strokeWidth={4} />
        <circle cx={0} cy={0} r={14} fill="#7A3A0C" />
        <line x1={0} y1={-30} x2={0} y2={-18} stroke="#7A3A0C" strokeWidth={5} strokeLinecap="round" />
      </g>
      {label ? (
        <text x={L + 18} y={10} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 34, fill: C.lemon }}>
          {assertAllowed(label, "Tape label")}
        </text>
      ) : null}
    </g>
  );
};
