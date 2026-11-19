// ST01 act l03 helpers: air dots that squash with the scale height, air columns, brackets, clay mountains, Mars.
import React from "react";
import { AIR, CHALK, INK, LIME } from "../../../lib/suppose/palette";
import { rnd } from "../../../lib/illustrated/motion";
import { rrect } from "../../../lib/illustrated/shapes";
import { CLAY, TERRA_DARK, TERRA_LIT, Txt } from "./l02-parts";
import { TERRA } from "../../../lib/suppose/palette";

/**
 * Air as dots: dot i sits at height −ln(u)·H above `ground` (an exponential atmosphere), so shrinking H squashes every
 * dot down continuously. `op(i, y)` lets a shot dim dots (e.g. those below Lev).
 */
export const AirDots: React.FC<{
  x0: number; x1: number; ground: number; H: number; n: number; seed: number; top?: number; frame?: number; jig?: number; r?: number;
  op?: (y: number) => number; color?: string;
}> = ({ x0, x1, ground, H, n, seed, top = 120, frame = 0, jig = 2.5, r = 4, op, color = AIR }) => {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const u = Math.max(0.0005, rnd(seed * 7919 + i * 3 + 1));
    const y = ground - 6 - -Math.log(u) * H;
    if (y < top) continue;
    const x = x0 + rnd(seed * 104729 + i * 5 + 2) * (x1 - x0) + Math.sin(frame / 5 + i * 1.7) * jig;
    const yy = y + Math.cos(frame / 6 + i * 2.3) * jig;
    const o = op ? op(yy) : 1;
    if (o <= 0.01) continue;
    out.push(<circle key={i} cx={x} cy={yy} r={r} fill={color} opacity={0.9 * o} />);
  }
  return <g>{out}</g>;
};

/** Glass column that holds a dot atmosphere. */
export const Column: React.FC<{ cx: number; w: number; top: number; ground: number; children?: React.ReactNode }> = ({ cx, w, top, ground, children }) => (
  <g>
    <path d={rrect(cx - w / 2, top, w, ground - top, 26)} fill={INK} opacity={0.22} />
    {children}
    <path d={rrect(cx - w / 2, top, w, ground - top, 26)} fill="none" stroke={CHALK} strokeWidth={4} opacity={0.55} />
    <path d={`M ${cx - w / 2 + 14} ${top + 30} V ${ground - 30}`} stroke={CHALK} strokeWidth={6} strokeLinecap="round" opacity={0.25} />
    <rect x={cx - w / 2 - 30} y={ground} width={w + 60} height={22} rx={10} fill={CLAY.near} />
  </g>
);

/** Lime bracket from y0 (bottom) up to y1 (top), drawn to fraction p. */
export const Bracket: React.FC<{ x: number; y0: number; y1: number; p?: number; color?: string; dash?: string; op?: number }> = ({ x, y0, y1, p = 1, color = LIME, dash, op = 1 }) => {
  if (p <= 0) return null;
  const yt = y0 + (y1 - y0) * p;
  return (
    <g opacity={op}>
      <path d={`M ${x - 22} ${y0} H ${x} V ${yt}${p >= 0.999 ? ` H ${x - 22}` : ""}`} stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />
    </g>
  );
};

/** Clay mountain path (from the approved STKeyAir shape), peak at peakY. */
export const mtnPath = (cx: number, w: number, ground: number, peakY: number, seed = 0) =>
  `M ${cx - w} ${ground} C ${cx - w * 0.55} ${ground - 120} ${cx - w * 0.3} ${peakY + 120} ${cx - 30} ${peakY + 14} Q ${cx} ${peakY - 8} ${cx + 34} ${peakY + 20} C ${cx + w * 0.3} ${peakY + 150 + seed} ${cx + w * 0.6} ${ground - 110} ${cx + w} ${ground} Z`;

export const Mountain: React.FC<{ cx: number; w: number; ground: number; peakY: number; seed?: number; fill?: string }> = ({ cx, w, ground, peakY, seed = 0, fill = CLAY.mid }) => (
  <g>
    <path d={mtnPath(cx, w, ground, peakY, seed)} fill={fill} />
    <path d={`M ${cx + 8} ${peakY + 16} C ${cx + w * 0.32} ${peakY + 160} ${cx + w * 0.66} ${ground - 110} ${cx + w} ${ground} L ${cx + w * 0.16} ${ground} C ${cx + w * 0.24} ${ground - 200} ${cx + w * 0.1} ${peakY + 200} ${cx + 8} ${peakY + 16} Z`} fill={CLAY.near} opacity={0.28} />
    <path d={`M ${cx - 62} ${peakY + 70} Q ${cx - 30} ${peakY + 5} ${cx} ${peakY - 2} Q ${cx + 40} ${peakY + 10} ${cx + 66} ${peakY + 74} Q ${cx + 20} ${peakY + 54} ${cx} ${peakY + 76} Q ${cx - 24} ${peakY + 50} ${cx - 62} ${peakY + 70} Z`} fill="#FFF1E0" />
  </g>
);

/** A little Mars: rust sphere, craters that turn with `rot`, a polar cap. */
export const Mars: React.FC<{ cx: number; cy: number; r: number; rot: number }> = ({ cx, cy, r, rot }) => {
  const id = "l03mars";
  return (
    <g>
      <defs>
        <radialGradient id={`${id}g`} cx="35%" cy="30%" r="75%">
          <stop offset={0} stopColor="#EE9C72" />
          <stop offset={0.55} stopColor={TERRA} />
          <stop offset={1} stopColor="#6E2A16" />
        </radialGradient>
        <clipPath id={`${id}c`}><circle cx={cx} cy={cy} r={r} /></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id}c)`}>
        <g transform={`rotate(${rot} ${cx} ${cy})`}>
          {[[-0.4, -0.2, 0.18], [0.3, 0.35, 0.14], [0.1, -0.5, 0.1], [-0.2, 0.55, 0.12], [0.55, -0.1, 0.09], [-0.65, 0.3, 0.08]].map(([dx, dy, rr], i) => (
            <g key={i}>
              <circle cx={cx + dx * r} cy={cy + dy * r} r={rr * r} fill={TERRA_DARK} opacity={0.55} />
              <circle cx={cx + dx * r - rr * r * 0.2} cy={cy + dy * r - rr * r * 0.2} r={rr * r * 0.7} fill={TERRA_LIT} opacity={0.35} />
            </g>
          ))}
          <path d={`M ${cx - r * 0.8} ${cy + r * 0.05} Q ${cx} ${cy - r * 0.12} ${cx + r * 0.8} ${cy + r * 0.1}`} stroke={TERRA_DARK} strokeWidth={r * 0.05} fill="none" opacity={0.5} />
        </g>
        <ellipse cx={cx} cy={cy - r * 0.95} rx={r * 0.38} ry={r * 0.14} fill={CHALK} opacity={0.9} />
      </g>
    </g>
  );
};

export { Txt };
