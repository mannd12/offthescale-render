// Small drawing helpers shared by the L14 Shorts S56-S60 (episodes/S56..S60). Their shots are each Short's own drawings;
// this file only holds repeated pieces (a vertical shaft, a gauge dial, a flat planet disc, a stopwatch). The probe,
// the clock face, the cut-away globe, the air haze and the sparks are L14's own props (episodes/L14-earth-tunnel).
import React from "react";
import { STUDIO_SET, Family } from "../../lib/illustrated";
import { C, ez } from "../S41-dig-plate/vkit";
import { ClockFace } from "../L14-earth-tunnel/props";

export const FAM: Family = STUDIO_SET;
export const BG_STUDIO = ["#2A8890", "#3AA29F", "#66BEAD"];
export const BG_DEEP = ["#0A3C4C", "#11707A", "#1FA69A"];
export const BG_NIGHT = ["#0B1B3A", "#1B3A6B", "#2A6FA8"];
export const BG_DAWN = ["#4B2A8C", "#E4572E", "#FFC83D"];
export const BG_EMBER = ["#2B0C08", "#7A2A0E", "#C2561A"];

export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** A vertical shaft: rock walls with scrolling hatch bars (so a still probe still reads as falling), a dark slot. */
export const Shaft: React.FC<{ f: number; x: number; w: number; y0: number; y1: number; speed?: number; rock?: string; deep?: string; inner?: string; pad?: number }> = ({ f, x, w, y0, y1, speed = 14, rock = "#C45A2A", deep = "#9C3A1C", inner = "#06222B", pad = 180 }) => {
  const step = 110;
  const off = (((f * speed) % step) + step) % step;
  const rows: number[] = [];
  for (let y = y0 - step + off; y < y1 - 44; y += step) if (y >= y0) rows.push(y);
  return (
    <g>
      <rect x={x - w / 2 - pad} y={y0} width={w + pad * 2} height={y1 - y0} fill={rock} />
      {rows.map((y) => (
        <g key={y}>
          <rect x={x - w / 2 - pad} y={y} width={pad} height={12} fill={deep} />
          <rect x={x + w / 2} y={y + 36} width={pad} height={12} fill={deep} />
        </g>
      ))}
      <rect x={x - w / 2} y={y0} width={w} height={y1 - y0} fill={inner} />
    </g>
  );
};

/** A round gauge: v 0..1 fills a 240 degree arc, the needle sweeps; `shake` jitters it near the stop. */
export const Dial: React.FC<{ x: number; y: number; r: number; v: number; color?: string; shake?: number; f?: number }> = ({ x, y, r, v, color = C.amber, shake = 0, f = 0 }) => {
  const A0 = 150;
  const SW = 240;
  const t = Math.max(0, Math.min(1, v));
  const pt = (a: number, rr: number): [number, number] => [x + Math.cos((a * Math.PI) / 180) * rr, y + Math.sin((a * Math.PI) / 180) * rr];
  const arc = (tt: number, rr: number) => {
    const [sx, sy] = pt(A0, rr);
    const [ex, ey] = pt(A0 + SW * tt, rr);
    return `M${sx.toFixed(1)} ${sy.toFixed(1)} A${rr} ${rr} 0 ${SW * tt > 180 ? 1 : 0} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  };
  const jit = shake ? Math.sin(f * 2.7) * shake : 0;
  const [nx, ny] = pt(A0 + SW * t + jit, r * 0.78);
  return (
    <g>
      <circle cx={x} cy={y} r={r + 18} fill={C.ink} opacity={0.94} stroke={C.cream} strokeWidth={8} />
      <path d={arc(1, r * 0.86)} stroke={C.deep} strokeWidth={r * 0.2} fill="none" strokeLinecap="round" />
      {t > 0.01 ? <path d={arc(t, r * 0.86)} stroke={color} strokeWidth={r * 0.2} fill="none" strokeLinecap="round" /> : null}
      {Array.from({ length: 9 }, (_, i) => {
        const a = A0 + (SW * i) / 8;
        const [x1, y1] = pt(a, r * 0.62);
        const [x2, y2] = pt(a, r * 0.7);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.cream} strokeWidth={5} strokeLinecap="round" />;
      })}
      <line x1={x} y1={y} x2={nx} y2={ny} stroke={C.verm} strokeWidth={r * 0.07} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.09} fill={C.cream} />
    </g>
  );
};

/** A flat planet disc in one colour with slow radial hatching: "one ball of the same rock all the way through". */
export const Disc: React.FC<{ x: number; y: number; r: number; f: number; color?: string; hatch?: string }> = ({ x, y, r, f, color = "#C45A2A", hatch = "#9C3A1C" }) => (
  <g>
    <circle cx={x} cy={y} r={r + 10} fill="none" stroke="#2FBFA8" strokeWidth={9} opacity={0.5} />
    <circle cx={x} cy={y} r={r} fill={color} />
    {Array.from({ length: 24 }, (_, i) => {
      const a = ((i * 15 + f * 0.4) * Math.PI) / 180;
      return <line key={i} x1={x + Math.cos(a) * r * 0.2} y1={y + Math.sin(a) * r * 0.2} x2={x + Math.cos(a) * r * 0.92} y2={y + Math.sin(a) * r * 0.92} stroke={hatch} strokeWidth={7} strokeLinecap="round" opacity={0.6} />;
    })}
  </g>
);

/** A stopwatch: the L14 clock face with its ring filling to `k` of `full` minutes (k 0..1). Plate text comes from the shot. */
export const Watch: React.FC<{ x: number; y: number; r: number; k: number; full: number; plate?: string | null; f?: number; shake?: number }> = ({ x, y, r, k, full, plate = null, f = 0, shake = 0 }) => (
  <ClockFace x={x} y={y} r={r} minutes={full * k} ring={Math.min(1, (full * k) / 60)} plate={plate} family={FAM} f={f} shake={shake} />
);

/** A stack of drawn weights (tonnes) rising from a base; `h` = how many are drawn (fractional last one grows). */
export const Weights: React.FC<{ x: number; base: number; count: number; w?: number; hh?: number }> = ({ x, base, count, w = 300, hh = 62 }) => (
  <g>
    {Array.from({ length: Math.ceil(count) }, (_, i) => {
      const g = Math.min(1, count - i);
      const ww = w * (1 - 0.04 * (i % 3));
      return (
        <g key={i} opacity={g}>
          <rect x={x - ww / 2} y={base - (i + 1) * hh * 1.02} width={ww} height={hh} rx={12} fill={i % 2 ? C.rust : C.orange} stroke={C.ink} strokeWidth={6} />
          <rect x={x - ww / 2 + 14} y={base - (i + 1) * hh * 1.02 + 10} width={ww * 0.35} height={10} rx={5} fill={C.cream} opacity={0.5} />
        </g>
      );
    })}
  </g>
);

export { ez };
