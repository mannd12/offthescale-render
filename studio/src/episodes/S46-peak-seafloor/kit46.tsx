// Small drawing helpers shared by the L12 Shorts S46-S50 (episodes/S46..S50). Their shots are each Short's own drawings;
// this file only holds repeated pieces (a peak, a scrolling ruler, a brachiopod, a chalk question mark, a bar).
import React from "react";
import { C, W, ez } from "../S41-dig-plate/vkit";

/** A snow-capped peak: centre x, base y, width w, height h. */
export const Peak: React.FC<{ x: number; y: number; w: number; h: number; body?: string; shade?: string; snow?: string; snowOn?: boolean }> = ({ x, y, w, h, body = C.orange, shade = C.rust, snow = C.foam, snowOn = true }) => (
  <g>
    <path d={`M${x - w / 2} ${y} L${x - w * 0.22} ${y - h * 0.55} L${x - w * 0.08} ${y - h * 0.62} L${x} ${y - h} L${x + w * 0.1} ${y - h * 0.6} L${x + w * 0.25} ${y - h * 0.5} L${x + w / 2} ${y} Z`} fill={body} />
    <path d={`M${x} ${y - h} L${x + w * 0.1} ${y - h * 0.6} L${x + w * 0.25} ${y - h * 0.5} L${x + w / 2} ${y} L${x + w * 0.05} ${y} L${x + w * 0.02} ${y - h * 0.5} Z`} fill={shade} />
    {snowOn ? <path d={`M${x} ${y - h} L${x + w * 0.045} ${y - h * 0.82} L${x + w * 0.02} ${y - h * 0.76} L${x} ${y - h * 0.8} L${x - w * 0.02} ${y - h * 0.74} L${x - w * 0.036} ${y - h * 0.829} Z`} fill={snow} /> : null}
  </g>
);

/** Horizontal ticks scrolling vertically at x: a ruler that makes any shot feel like it is moving (px per frame = speed). */
export const Ruler: React.FC<{ f: number; x: number; y0: number; y1: number; speed: number; step?: number; color?: string; len?: number; width?: number; opacity?: number }> = ({ f, x, y0, y1, speed, step = 90, color = C.cream, len = 70, width = 8, opacity = 0.8 }) => {
  const off = (((f * speed) % step) + step) % step;
  const out: React.ReactNode[] = [];
  for (let y = y0 - step + off; y < y1; y += step) {
    if (y < y0) continue;
    out.push(<rect key={y} x={x} y={y} width={len} height={width} rx={width / 2} fill={color} opacity={opacity} />);
  }
  return <g>{out}</g>;
};

/** Brachiopod from the top: D-shaped valve with radial ribs. r = px across. */
export const Shell: React.FC<{ x: number; y: number; r: number; rot?: number; body?: string; rib?: string }> = ({ x, y, r, rot = 0, body = C.cream, rib = C.rust }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d={`M${-r * 0.78} ${-r * 0.42} L${r * 0.78} ${-r * 0.42} Q${r * 1.0} ${r * 0.2} ${r * 0.5} ${r * 0.8} Q0 ${r * 1.05} ${-r * 0.5} ${r * 0.8} Q${-r * 1.0} ${r * 0.2} ${-r * 0.78} ${-r * 0.42} Z`} fill={body} stroke={C.ink} strokeWidth={r * 0.06} strokeLinejoin="round" />
    {Array.from({ length: 7 }, (_, i) => {
      const a = Math.PI * (0.16 + (0.68 * i) / 6);
      return <path key={i} d={`M0 ${-r * 0.42} L${Math.cos(a) * r * 0.85} ${-r * 0.42 + Math.sin(a) * r * 1.2}`} stroke={rib} strokeWidth={r * 0.05} strokeLinecap="round" />;
    })}
  </g>
);

/** A chalk question mark, dashed stroke crawling. */
export const Qmark: React.FC<{ f: number; x: number; y: number; size?: number; color?: string; opacity?: number }> = ({ f, x, y, size = 520, color = C.amber, opacity = 1 }) => (
  <text x={x} y={y} textAnchor="middle" opacity={opacity * (0.78 + 0.22 * Math.sin(f / 4))} style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: size, fill: "none", stroke: color, strokeWidth: 26, strokeDasharray: "30 16", strokeDashoffset: -f * 3 }}>
    ?
  </text>
);

/** A rounded two-tone bar (ink outline + colour core), height grows from its top. */
export const Bar: React.FC<{ x: number; y: number; w: number; h: number; color?: string }> = ({ x, y, w, h, color = C.amber }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={Math.max(0, h)} rx={w * 0.3} fill={C.ink} />
    <rect x={x - w * 0.32} y={y} width={w * 0.64} height={Math.max(0, h)} rx={w * 0.2} fill={color} />
  </g>
);

export { W, ez };
