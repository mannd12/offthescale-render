// ST01 rung 1 props: grocery bag, bathroom scale, backpack, bike, stopwatch, Lev's puffy coat, the beach.
import React from "react";
import { Cumulus } from "../../../lib/illustrated/props";
import { mixHex } from "../../../lib/illustrated/palette";
import { CHALK, CHALK_SHADE, INK, OCEAN, ST_FONT, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { STPill } from "../../../lib/suppose/devices";
import { Lev } from "../../../lib/suppose/lev";
import { rrect } from "../../../lib/illustrated/shapes";
import { ease, mix, pop } from "../shot";
import { partial, Pt } from "./cold-parts";

const S = SUPPOSE.sage;
export const TERRA_DK = mixHex(TERRA, INK, 0.3);
export const TERRA_LT = mixHex(TERRA, "#FFFFFF", 0.3);
export const SAND = mixHex(S.sky[2], TERRA, 0.12);
export const SAND_DK = mixHex(S.sky[2], TERRA, 0.3);

/** paper grocery bag hanging from (hx, hy) */
export const GroceryBag: React.FC<{ hx: number; hy: number; s: number; swing: number }> = ({ hx, hy, s, swing }) => (
  <g transform={`rotate(${swing} ${hx} ${hy})`}>
    <path d={`M ${hx - 10 * s} ${hy + 8 * s} L ${hx - 6 * s} ${hy - 4 * s} M ${hx + 10 * s} ${hy + 8 * s} L ${hx + 6 * s} ${hy - 4 * s}`} stroke={TERRA_DK} strokeWidth={3 * s} strokeLinecap="round" />
    <path d={`M ${hx - 3 * s} ${hy + 4 * s} L ${hx + 6 * s} ${hy - 26 * s}`} stroke={CHALK} strokeWidth={8 * s} strokeLinecap="round" />
    <circle cx={hx - 10 * s} cy={hy + 6 * s} r={8 * s} fill={S.near} />
    <circle cx={hx - 2 * s} cy={hy + 3 * s} r={7 * s} fill={S.mid} />
    <path d={rrect(hx - 20 * s, hy + 6 * s, 40 * s, 46 * s, 4 * s)} fill={TERRA} />
    <path d={rrect(hx + 6 * s, hy + 6 * s, 14 * s, 46 * s, 4 * s)} fill={TERRA_DK} opacity={0.5} />
    <path d={`M ${hx - 20 * s} ${hy + 12 * s} H ${hx + 20 * s}`} stroke={TERRA_DK} strokeWidth={2 * s} />
  </g>
);

/** bathroom scale seen from the front; (cx, base) = bottom centre; needle angle in degrees (0 = up) */
export const BathScale: React.FC<{ cx: number; base: number; needle: number; ghost?: number }> = ({ cx, base, needle, ghost }) => {
  const w = 300, h = 100;
  const dcx = cx, dcy = base - 48, r = 38;
  const nr = (needle * Math.PI) / 180;
  const gr = ((ghost ?? 0) * Math.PI) / 180;
  return (
    <g>
      <ellipse cx={cx} cy={base + 4} rx={w * 0.55} ry={10} fill={INK} opacity={0.18} />
      <path d={rrect(cx - w / 2, base - h, w, h, 22)} fill={CHALK} />
      <path d={rrect(cx - w / 2, base - h, w, 22, 11)} fill="#FFFFF4" />
      <path d={rrect(cx + w * 0.28, base - h, w * 0.22, h, 22)} fill={CHALK_SHADE} opacity={0.7} />
      <circle cx={dcx} cy={dcy} r={r + 6} fill={INK} opacity={0.85} />
      <circle cx={dcx} cy={dcy} r={r} fill="#FFFFF4" />
      {Array.from({ length: 11 }, (_, i) => {
        const a = ((-100 + i * 20) * Math.PI) / 180;
        return <path key={i} d={`M ${dcx + Math.sin(a) * r * 0.78} ${dcy - Math.cos(a) * r * 0.78} L ${dcx + Math.sin(a) * r * 0.94} ${dcy - Math.cos(a) * r * 0.94}`} stroke={INK} strokeWidth={2.4} strokeLinecap="round" opacity={0.7} />;
      })}
      {ghost !== undefined ? <path d={`M ${dcx} ${dcy} L ${dcx + Math.sin(gr) * r * 0.86} ${dcy - Math.cos(gr) * r * 0.86}`} stroke={INK} strokeWidth={3} strokeDasharray="4 4" opacity={0.45} /> : null}
      <path d={`M ${dcx} ${dcy} L ${dcx + Math.sin(nr) * r * 0.9} ${dcy - Math.cos(nr) * r * 0.9}`} stroke={TERRA} strokeWidth={5} strokeLinecap="round" />
      <circle cx={dcx} cy={dcy} r={6} fill={INK} />
    </g>
  );
};

/** a backpack standing on (cx, base) */
export const Backpack: React.FC<{ cx: number; base: number }> = ({ cx, base }) => (
  <g>
    <path d={`M ${cx - 50} ${base - 120} Q ${cx - 50} ${base - 150} ${cx} ${base - 168} Q ${cx + 50} ${base - 150} ${cx + 50} ${base - 120}`} stroke={TERRA_DK} strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d={rrect(cx - 70, base - 150, 140, 150, 40)} fill={TERRA} />
    <path d={rrect(cx + 26, base - 150, 44, 150, 30)} fill={TERRA_DK} opacity={0.45} />
    <path d={`M ${cx - 68} ${base - 100} Q ${cx} ${base - 130} ${cx + 68} ${base - 100} L ${cx + 68} ${base - 112} Q ${cx} ${base - 150} ${cx - 68} ${base - 112} Z`} fill={TERRA_DK} />
    <path d={rrect(cx - 40, base - 70, 80, 50, 14)} fill={TERRA_LT} opacity={0.75} />
    <circle cx={cx} cy={base - 106} r={6} fill={CHALK} />
  </g>
);

/** a bike standing on (cx, base) */
export const Bike: React.FC<{ cx: number; base: number; spin?: number }> = ({ cx, base, spin = 0 }) => {
  const r = 52;
  const w1: Pt = [cx - 76, base - r], w2: Pt = [cx + 76, base - r];
  const ped: Pt = [cx - 6, base - r];
  const seat: Pt = [cx - 30, base - r - 92];
  const bar: Pt = [cx + 52, base - r - 100];
  const wheel = (c: Pt) => (
    <g>
      <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={INK} strokeWidth={9} />
      <circle cx={c[0]} cy={c[1]} r={r - 6} fill="none" stroke={CHALK_SHADE} strokeWidth={2} />
      {[0, 60, 120].map((a) => {
        const q = ((a + spin) * Math.PI) / 180;
        return <path key={a} d={`M ${c[0] - Math.cos(q) * (r - 6)} ${c[1] - Math.sin(q) * (r - 6)} L ${c[0] + Math.cos(q) * (r - 6)} ${c[1] + Math.sin(q) * (r - 6)}`} stroke={INK} strokeWidth={2} opacity={0.6} />;
      })}
      <circle cx={c[0]} cy={c[1]} r={6} fill={INK} />
    </g>
  );
  return (
    <g>
      <ellipse cx={cx} cy={base + 2} rx={150} ry={8} fill={INK} opacity={0.15} />
      {wheel(w1)}
      {wheel(w2)}
      <path d={`M ${w1[0]} ${w1[1]} L ${ped[0]} ${ped[1]} L ${seat[0] + 6} ${seat[1] + 10} Z M ${ped[0]} ${ped[1]} L ${bar[0] - 8} ${bar[1] + 18} L ${seat[0] + 6} ${seat[1] + 10} M ${bar[0] - 8} ${bar[1] + 18} L ${w2[0]} ${w2[1]}`} stroke={TERRA} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <path d={`M ${seat[0] - 24} ${seat[1]} L ${seat[0] + 18} ${seat[1]}`} stroke={INK} strokeWidth={12} strokeLinecap="round" />
      <path d={`M ${bar[0] - 8} ${bar[1] + 18} L ${bar[0]} ${bar[1]} L ${bar[0] + 22} ${bar[1] - 4}`} stroke={INK} strokeWidth={8} strokeLinecap="round" fill="none" />
      <circle cx={ped[0]} cy={ped[1]} r={12} fill={INK} />
    </g>
  );
};

/** a tag card: big figure on an ink rounded card */
export const Tag: React.FC<{ x: number; y: number; text: string; k: number; size?: number }> = ({ x, y, text, k, size = 46 }) => {
  if (k <= 0.001) return null;
  const w = text.length * size * 0.6 + 44;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d={rrect(-w / 2, -size * 0.8, w, size * 1.5, size * 0.4)} fill={INK} opacity={0.88} />
      <path d={`M -12 ${size * 0.7} L 0 ${size * 0.7 + 14} L 12 ${size * 0.7} Z`} fill={INK} opacity={0.88} />
      <text x={0} y={size * 0.33} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={size} fill={CHALK}>{text}</text>
    </g>
  );
};

/** stopwatch prop; hand angle in degrees */
export const Stopwatch: React.FC<{ cx: number; cy: number; r: number; hand: number; tick?: number }> = ({ cx, cy, r, hand, tick = 0 }) => {
  const a = (hand * Math.PI) / 180;
  return (
    <g>
      <rect x={cx - r * 0.16} y={cy - r * 1.32 + tick * 6} width={r * 0.32} height={r * 0.26} rx={r * 0.06} fill={TERRA_DK} />
      <rect x={cx - r * 0.26} y={cy - r * 1.18} width={r * 0.52} height={r * 0.12} rx={r * 0.05} fill={TERRA} />
      <circle cx={cx} cy={cy} r={r * 1.1} fill={TERRA} />
      <circle cx={cx + r * 0.08} cy={cy + r * 0.08} r={r * 1.1} fill={TERRA_DK} opacity={0.3} />
      <circle cx={cx} cy={cy} r={r} fill="#FFFFF4" />
      {Array.from({ length: 12 }, (_, i) => {
        const q = (i * 30 * Math.PI) / 180;
        const r0 = i % 3 === 0 ? 0.78 : 0.86;
        return <path key={i} d={`M ${cx + Math.sin(q) * r * r0} ${cy - Math.cos(q) * r * r0} L ${cx + Math.sin(q) * r * 0.94} ${cy - Math.cos(q) * r * 0.94}`} stroke={INK} strokeWidth={i % 3 === 0 ? 6 : 3} strokeLinecap="round" />;
      })}
      <path d={`M ${cx - Math.sin(a) * r * 0.16} ${cy + Math.cos(a) * r * 0.16} L ${cx + Math.sin(a) * r * 0.82} ${cy - Math.cos(a) * r * 0.82}`} stroke={TERRA} strokeWidth={7} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r * 0.07} fill={INK} />
      <path d={`M ${cx - r * 0.7} ${cy - r * 0.5} A ${r * 0.86} ${r * 0.86} 0 0 1 ${cx - r * 0.2} ${cy - r * 0.84}`} stroke={CHALK} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" opacity={0.9} />
    </g>
  );
};

// ------------------------------------------------------------------ Lev's puffy coat (drawn over Lev, same local frame)
/** same curve Lev uses for an arm, so the sleeve sits exactly on it */
const armPath = (s: Pt, h: Pt, bend: number) => {
  const mx = (s[0] + h[0]) / 2, my = (s[1] + h[1]) / 2;
  const dx = h[0] - s[0], dy = h[1] - s[1];
  const len = Math.hypot(dx, dy) || 1;
  const k = Math.max(0, 40 - len) * 0.5 + 6;
  const ex = mx + (-dy / len) * k * bend, ey = my + (dx / len) * k * bend;
  return `M ${s[0]} ${s[1]} Q ${ex} ${ey} ${h[0]} ${h[1]}`;
};
const BANDS = [
  { y: -101, w: 72 }, { y: -84, w: 78 }, { y: -67, w: 80 }, { y: -50, w: 76 },
];
export const PuffyCoat: React.FC<{ x: number; y: number; h: number; frame: number; t: number; hands: { front: Pt; back: Pt }; seed?: number; inAt: number }> = ({ x, y, h, frame, t, hands, seed = 1, inAt }) => {
  const s = h / 170;
  const breathe = Math.sin(frame / 22 + seed) * 1.2;
  const shL: Pt = [-17, -104 + breathe * 0.4];
  const shR: Pt = [17, -104 + breathe * 0.4];
  const band = (i: number) => {
    const t0 = inAt + i * 8;
    const fly = ease(t, t0, t0 + 11);
    if (fly <= 0) return null;
    const pk = pop(t, t0 + 9, 12);
    const puff = 0.72 + 0.28 * pk + Math.sin((t - t0) * 0.35) * 0.02 * Math.exp(-(t - t0) * 0.04);
    const b = BANDS[i];
    const hh = 21;
    const ox = (1 - fly) * (-700 / s);
    return (
      <g key={i} transform={`translate(${ox} ${b.y}) scale(${puff})`}>
        <path d={rrect(-b.w / 2, -hh / 2, b.w, hh, hh / 2)} fill={TERRA} />
        <path d={rrect(-b.w / 2 + 6, -hh / 2 + 3, b.w * 0.55, hh * 0.35, hh * 0.18)} fill={TERRA_LT} opacity={0.65} />
        <path d={rrect(b.w * 0.12, -hh / 2, b.w * 0.38, hh, hh / 2)} fill={TERRA_DK} opacity={0.35} />
      </g>
    );
  };
  const sleeve = (i: 0 | 1) => {
    const t0 = inAt + 34 + i * 6;
    const k = pop(t, t0, 12);
    if (k <= 0.001) return null;
    const sh = i === 0 ? shL : shR;
    const hd = i === 0 ? hands.back : hands.front;
    return <path d={armPath(sh, hd, i === 0 ? -1 : 1)} stroke={i === 0 ? TERRA_DK : TERRA} strokeWidth={17 * k} strokeLinecap="round" fill="none" />;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s})`}>
      {sleeve(0)}
      {t >= inAt + 34 ? <circle cx={hands.back[0]} cy={hands.back[1]} r={7} fill={CHALK_SHADE} /> : null}
      {[3, 2, 1, 0].map((i) => band(i))}
      {sleeve(1)}
      {t >= inAt + 40 ? <circle cx={hands.front[0]} cy={hands.front[1]} r={7.5} fill={CHALK} /> : null}
    </g>
  );
};

// ------------------------------------------------------------------ the beach (1-07, 1-08)
export const HORIZON = 520;
export const LEV_BEACH = { x: 330, y: 860, h: 200 };
export const BEACH_EYE: Pt = [LEV_BEACH.x + 16 * (LEV_BEACH.h / 170), LEV_BEACH.y - 145 * (LEV_BEACH.h / 170)];

export const BeachScene: React.FC<{
  t: number; f: number; end: number; draw: number; ghostAt?: number; boat?: number; label?: { k: number; pill: number };
}> = ({ t, f, end, draw, ghostAt, boat = 0, label }) => {
  const seaTop = mixHex(OCEAN, S.sky[1], 0.55);
  const line = partial([BEACH_EYE, [end, HORIZON - 4]], draw);
  const shore = (x: number) => 760 + (x / 1920) * 220 + Math.sin(x / 140) * 8;
  const foam = Array.from({ length: 41 }, (_, i) => {
    const x = -60 + i * 52;
    return [x, shore(x) - 10 + Math.sin(t / 9 + i * 0.7) * 7] as Pt;
  });
  return (
    <g>
      <Cumulus x={640 - t * 0.6} y={300} w={330} h={120} fill={CHALK} shade={CHALK_SHADE} lit={S.light} seed={4} frame={f} opacity={0.85} />
      <Cumulus x={1250 - t * 0.45} y={200} w={250} h={90} fill={CHALK} shade={CHALK_SHADE} lit={S.light} seed={9} frame={f} opacity={0.7} />
      <defs>
        <linearGradient id="l1sea" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor={seaTop} />
          <stop offset={1} stopColor={OCEAN} />
        </linearGradient>
        <clipPath id="l1sky"><rect x={-100} y={-200} width={2200} height={HORIZON + 200} /></clipPath>
      </defs>
      {/* a boat beyond the old horizon, rising into view */}
      {boat > 0 ? (
        <g clipPath="url(#l1sky)">
          <g transform={`translate(1540 ${HORIZON + 46 - 46 * boat})`}>
            <path d="M -34 0 L 34 0 L 24 12 L -24 12 Z" fill={TERRA_DK} />
            <path d="M -2 -4 L -2 -58 L 28 -6 Z" fill={CHALK} />
            <path d="M -6 -4 L -6 -44 L -28 -6 Z" fill={CHALK_SHADE} />
          </g>
        </g>
      ) : null}
      <rect x={-100} y={HORIZON} width={2200} height={700} fill="url(#l1sea)" />
      <path d={`M -100 ${HORIZON} H 2100`} stroke={S.light} strokeWidth={3} opacity={0.8} />
      {/* wave dashes drifting */}
      {Array.from({ length: 30 }, (_, i) => {
        const row = i % 6;
        const y = HORIZON + 30 + row * row * 9 + row * 16;
        const sp = 0.8 + row * 0.5;
        const x = ((i * 397 - t * sp * 2) % 2200 + 2200) % 2200 - 140;
        const w = 30 + row * 16;
        return <path key={i} d={`M ${x} ${y} q ${w / 2} ${-4 - row} ${w} 0`} stroke={CHALK} strokeWidth={2 + row * 0.6} fill="none" strokeLinecap="round" opacity={0.55} />;
      })}
      {/* sand */}
      <path d={`M -100 ${shore(-100)} ${Array.from({ length: 22 }, (_, i) => `L ${i * 100} ${shore(i * 100)}`).join(" ")} L 2100 1200 L -100 1200 Z`} fill={SAND} />
      <path d={`M ${foam.map((p) => p.join(" ")).join(" L ")}`} stroke={CHALK} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.85} />
      <path d={`M -100 ${shore(-100) + 30} ${Array.from({ length: 22 }, (_, i) => `L ${i * 100} ${shore(i * 100) + 30}`).join(" ")}`} stroke={SAND_DK} strokeWidth={4} fill="none" opacity={0.35} />
      {/* old horizon point (ghost) */}
      {ghostAt !== undefined ? (
        <g opacity={0.8}>
          <path d={`M ${ghostAt} ${HORIZON} V ${HORIZON - 40}`} stroke={INK} strokeWidth={3} strokeDasharray="5 5" />
          <circle cx={ghostAt} cy={HORIZON - 44} r={7} fill="none" stroke={INK} strokeWidth={3} />
        </g>
      ) : null}
      {/* the sightline (dots march outward) */}
      <path d={line.d} stroke={INK} strokeWidth={6} strokeDasharray="1 16" strokeDashoffset={-t * 1.5} strokeLinecap="round" fill="none" opacity={0.85} />
      {draw >= 1 ? (
        <g>
          <path d={`M ${end} ${HORIZON} V ${HORIZON - 44}`} stroke={TERRA_DK} strokeWidth={4} />
          <circle cx={end} cy={HORIZON - 48} r={10} fill={TERRA} />
        </g>
      ) : null}
      <Lev x={LEV_BEACH.x} y={LEV_BEACH.y} h={LEV_BEACH.h} frame={f} pose="stand" eyes="open" tilt={-4} wind={0.7 + 0.2 * Math.sin(t / 20)} outline={INK} />
      {label ? (
        <g>
          <g transform={`translate(${end} 350) scale(${label.k})`}>
            <text x={0} y={0} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={104} fill={S.text}>4.7 km</text>
            <text x={0} y={38} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={24} letterSpacing={3} fill={S.dim}>TODAY'S EARTH</text>
          </g>
          <g transform={`translate(${end} 424) scale(${label.pill})`}>
            <STPill x={0} y={0} text="OUR SUM" align="middle" dark={false} />
          </g>
        </g>
      ) : null}
    </g>
  );
};

export { mix };
