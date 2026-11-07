// Kit v2.1 widgets requested by the L12 storyboard's "missing from the kit" list (episodes/L12-mountain-limit/
// storyboard.md §5): Dial (radial gauge; L12 pressure, L13 dB meter), TimeStrip (scrolling calendar / Myr strip),
// EndCard (the shared end card, L11's layout promoted to the kit).
import React, { useId } from "react";
import { Family, alpha } from "./palette2";
import { Pill } from "./type2";
import { P } from "./palette";

const sm = (t: number, a = 0, b = 1) => {
  const u = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return u * u * (3 - 2 * u);
};
const safeId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const NUM = "'Inter', sans-serif";
const LAB = "'Anton', sans-serif";

/**
 * Dial: a radial gauge from `min` to `max` over `sweep` degrees, an optional coloured band with a label, a vermilion
 * needle with a small wobble, tabular tick labels, and a readout under the hub.
 */
export const Dial: React.FC<{
  x: number;
  y: number;
  r: number;
  value: number;
  min?: number;
  max?: number;
  sweep?: number;
  band?: { from: number; to: number; color: string; label?: string };
  family: Family;
  unit?: string;
  ticks?: number;
  format?: (v: number) => string;
  frame?: number;
  title?: string;
}> = ({ x, y, r, value, min = 0, max = 100, sweep = 240, band, family: F, unit, ticks = 6, format = (v) => `${v}`, frame = 0, title }) => {
  const a0 = 90 + (360 - sweep) / 2; // start angle in degrees (screen clockwise from +x): bottom-left
  const ang = (v: number) => ((a0 + ((v - min) / (max - min)) * sweep) * Math.PI) / 180;
  const pt = (v: number, rr: number): [number, number] => [x + Math.cos(ang(v)) * rr, y + Math.sin(ang(v)) * rr];
  const arc = (v0: number, v1: number, rr: number) => {
    const [ax, ay] = pt(v0, rr);
    const [bx, by] = pt(v1, rr);
    const large = ((v1 - v0) / (max - min)) * sweep > 180 ? 1 : 0;
    return `M${ax.toFixed(1)} ${ay.toFixed(1)} A${rr} ${rr} 0 ${large} 1 ${bx.toFixed(1)} ${by.toFixed(1)}`;
  };
  const wob = Math.sin(frame / 4) * 0.004 * (max - min) + Math.sin(frame / 11) * 0.003 * (max - min);
  const v = Math.max(min, Math.min(max, value + wob));
  const [nx, ny] = pt(v, r * 0.78);
  return (
    <g>
      <circle cx={x} cy={y} r={r + 14} fill={alpha(F.shadow, 0.55)} />
      <circle cx={x} cy={y} r={r + 14} fill="none" stroke={F.text} strokeWidth={1.5} opacity={0.6} />
      <path d={arc(min, max, r)} fill="none" stroke={F.dim} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
      {band ? <path d={arc(band.from, band.to, r)} fill="none" stroke={band.color} strokeWidth={10} /> : null}
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const tv = min + ((max - min) * i) / ticks;
        const [tx, ty] = pt(tv, r - 12);
        const [ex, ey] = pt(tv, r + 2);
        const [lx, ly] = pt(tv, r - 34);
        return (
          <g key={i}>
            <line x1={tx} y1={ty} x2={ex} y2={ey} stroke={F.text} strokeWidth={2} />
            <text x={lx} y={ly + 6} textAnchor="middle" style={{ fontFamily: NUM, fontWeight: 500, fontSize: Math.max(12, r * 0.13), fill: F.dim, fontVariantNumeric: "tabular-nums" }}>
              {format(tv)}
            </text>
          </g>
        );
      })}
      <line x1={x} y1={y} x2={nx} y2={ny} stroke={P.vermilion} strokeWidth={5} strokeLinecap="round" />
      <circle cx={x} cy={y} r={9} fill={P.vermilion} />
      <circle cx={x} cy={y} r={4} fill={F.text} />
      {title ? (
        <text x={x} y={y + r * 0.5} textAnchor="middle" style={{ fontFamily: LAB, fontSize: Math.max(14, r * 0.14), letterSpacing: 3, fill: F.dim, textTransform: "uppercase" }}>
          {title}
        </text>
      ) : null}
      {unit ? (
        <text x={x} y={y + r * 0.72} textAnchor="middle" style={{ fontFamily: NUM, fontWeight: 800, fontSize: Math.max(16, r * 0.2), fill: F.text, fontVariantNumeric: "tabular-nums" }}>
          {format(Math.round(value))} {unit}
        </text>
      ) : null}
      {band?.label ? <Pill x={x} y={y - r - 44} text={band.label} fill={alpha(F.shadow, 0.62)} color={F.text} dot={band.color} size={16} align="middle" /> : null}
    </g>
  );
};

/**
 * TimeStrip: a horizontal strip of ticks (years, Myr, km...) that scrolls as `value` changes, with a fixed centre marker
 * and a kicker. `span` = units visible across `w`; `step` = labelled tick spacing (four minor ticks between labels).
 */
export const TimeStrip: React.FC<{ x: number; y: number; w: number; value: number; span: number; step: number; family: Family; kicker?: string; format?: (v: number) => string; height?: number }> = ({
  x,
  y,
  w,
  value,
  span,
  step,
  family: F,
  kicker,
  format = (v) => `${v}`,
  height = 54,
}) => {
  const id = "ts" + safeId(useId());
  const pxPer = w / span;
  const first = Math.floor((value - span / 2) / step) * step;
  const n = Math.ceil(span / step) + 2;
  return (
    <g>
      <clipPath id={id}>
        <rect x={x} y={y - height} width={w} height={height * 2} />
      </clipPath>
      <rect x={x} y={y - height / 2} width={w} height={height} rx={height / 2} fill={alpha(F.shadow, 0.55)} />
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: n }, (_, i) => {
          const v = first + i * step;
          const px = x + w / 2 + (v - value) * pxPer;
          return (
            <g key={i}>
              <line x1={px} y1={y - height * 0.35} x2={px} y2={y + height * 0.1} stroke={F.text} strokeWidth={2} />
              {[1, 2, 3, 4].map((k) => (
                <line key={k} x1={px + (k * step * pxPer) / 5} y1={y - height * 0.18} x2={px + (k * step * pxPer) / 5} y2={y + height * 0.1} stroke={F.dim} strokeWidth={1} opacity={0.6} />
              ))}
              <text x={px} y={y + height * 0.42} textAnchor="middle" style={{ fontFamily: NUM, fontWeight: 800, fontSize: height * 0.3, fill: F.text, fontVariantNumeric: "tabular-nums" }}>
                {format(v)}
              </text>
            </g>
          );
        })}
      </g>
      <path d={`M${x + w / 2} ${y - height / 2 - 2} l-9 -14 h18 Z`} fill={P.vermilion} />
      <line x1={x + w / 2} y1={y - height / 2} x2={x + w / 2} y2={y + height / 2} stroke={P.vermilion} strokeWidth={2.5} />
      {kicker ? (
        <text x={x} y={y - height / 2 - 16} style={{ fontFamily: LAB, fontSize: 20, letterSpacing: 4, fill: F.dim, textTransform: "uppercase" }}>
          {kicker}
        </text>
      ) : null}
    </g>
  );
};

/**
 * EndCard: the channel's shared end card (L11's layout, promoted): the vermilion gauge bar fills, the off-scale chevrons
 * pop, the wordmark and its rule draw in on the LEFT half; the right half stays clear for YouTube's end-screen tiles.
 * `t` 0..1 over the card's ~20 s; draw it on a depth-0 Layer over the family field of the video's last scene.
 */
export const EndCard: React.FC<{ t: number; family: Family; sub?: string }> = ({ t, family: F, sub }) => {
  const wm = sm(t, 0, 0.12);
  const fillT = sm(t, 0.08, 0.3);
  const chev = sm(t, 0.3, 0.36);
  const rule = sm(t, 0.1, 0.25);
  return (
    <g opacity={wm} transform={`translate(0 ${((1 - wm) * 20).toFixed(1)})`}>
      <rect x={160} y={790} width={14} height={150} fill={alpha(F.text, 0.12)} stroke={F.text} strokeWidth={1.5} />
      <rect x={160} y={790 + 150 * (1 - fillT)} width={14} height={150 * fillT} fill={P.vermilion} />
      {[0, 1].map((i) => (
        <path key={i} d={`M154 ${948 + i * 14} L167 ${960 + i * 14} L180 ${948 + i * 14} L180 ${953 + i * 14} L167 ${965 + i * 14} L154 ${953 + i * 14} Z`} fill={P.vermilion} opacity={chev} />
      ))}
      <text x={210} y={880} style={{ fontFamily: LAB, fontSize: 96, letterSpacing: 5, fill: F.text, textTransform: "uppercase" }}>
        Off the Scale
      </text>
      <rect x={212} y={904} width={520 * rule} height={5} fill={F.text} />
      {sub ? (
        <text x={212} y={950} style={{ fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 500, fontSize: 26, fill: F.dim }}>
          {sub}
        </text>
      ) : null}
    </g>
  );
};
