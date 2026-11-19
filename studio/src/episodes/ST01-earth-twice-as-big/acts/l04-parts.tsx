// ST01 act "l04" props: buckets, cubes, rockets, clay mountains with air dots, readouts, flags with sliding cards.
import React from "react";
import { rnd } from "../../../lib/illustrated/motion";
import { Bloom } from "../../../lib/illustrated/light";
import { mixHex } from "../../../lib/illustrated/palette";
import { AIR, BRASS, BRASS_DARK, CHALK, CHALK_SHADE, INK, OCEAN, ST_FONT, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { CounterSpec } from "../shot";

export type Pt = [number, number];
export const C2: CounterSpec = { label: "SIZE", value: "×2", sub: "GRAVITY 2.0 g" };
export const SAND = mixHex(BRASS, CHALK, 0.55);
export const TERRA_LIT = "#E8987A";
export const TERRA_DEEP = "#8E3F24";

/** Big Nunito figure. */
export const Big: React.FC<{ x: number; y: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; opacity?: number; children: React.ReactNode; weight?: number; ls?: number }> = ({
  x, y, size = 140, fill = CHALK, anchor = "middle", opacity = 1, children, weight = 900, ls = 0,
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={ST_FONT} fontWeight={weight} fontSize={size} fill={fill} opacity={opacity} letterSpacing={ls}>{children}</text>
);

/** A terracotta bucket of water; origin = top of the handle. */
export const Bucket: React.FC<{ x: number; y: number; s?: number; ghost?: number; slosh?: number }> = ({ x, y, s = 1, ghost = 0, slosh = 0 }) => {
  if (ghost > 0)
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`} opacity={ghost}>
        <path d="M -34 40 Q 0 -6 34 40" stroke={INK} strokeWidth={4} fill="none" strokeDasharray="8 7" />
        <path d="M -42 40 L 42 40 L 33 112 Q 0 121 -33 112 Z" fill={CHALK} fillOpacity={0.55} stroke={INK} strokeWidth={4} strokeDasharray="10 8" strokeLinejoin="round" />
      </g>
    );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -34 40 Q 0 -6 34 40" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
      <path d="M -42 40 L 42 40 L 33 112 Q 0 121 -33 112 Z" fill={TERRA} />
      <path d="M 12 42 L 42 40 L 33 112 Q 24 116 14 117 Z" fill={TERRA_DEEP} opacity={0.45} />
      <path d="M -38 70 Q 0 78 38 70" stroke={TERRA_DEEP} strokeWidth={4} fill="none" opacity={0.6} />
      <ellipse cx={0} cy={40} rx={42} ry={9} fill={TERRA_LIT} />
      <ellipse cx={0} cy={42 + slosh * 0.3} rx={35} ry={6} fill={OCEAN} transform={`rotate(${slosh} 0 42)`} />
      <ellipse cx={-10} cy={41} rx={10} ry={2} fill={AIR} opacity={0.8} />
    </g>
  );
};

/** An isometric sugar cube; (x, y) = top vertex of the top face, s = edge. */
export const Cube: React.FC<{ x: number; y: number; s: number; op?: number; hi?: boolean }> = ({ x, y, s, op = 1, hi }) => {
  const a = s * 0.866, b = s * 0.5;
  return (
    <g opacity={op}>
      <path d={`M ${x} ${y} L ${x + a} ${y + b} L ${x} ${y + 2 * b} L ${x - a} ${y + b} Z`} fill="#FFFFF4" stroke={CHALK_SHADE} strokeWidth={2} strokeLinejoin="round" />
      <path d={`M ${x - a} ${y + b} L ${x} ${y + 2 * b} L ${x} ${y + 2 * b + s} L ${x - a} ${y + b + s} Z`} fill={CHALK} stroke={CHALK_SHADE} strokeWidth={2} strokeLinejoin="round" />
      <path d={`M ${x + a} ${y + b} L ${x} ${y + 2 * b} L ${x} ${y + 2 * b + s} L ${x + a} ${y + b + s} Z`} fill={CHALK_SHADE} stroke="#AEBBA4" strokeWidth={2} strokeLinejoin="round" />
      {hi ? <circle cx={x - a * 0.3} cy={y + b * 1.0} r={s * 0.06} fill="#FFF" opacity={0.9} /> : null}
    </g>
  );
};

/** A little rocket; origin = base centre, h = height. rot in degrees (0 = nose up). */
export const Rocket: React.FC<{ x: number; y: number; h: number; rot?: number; flame?: number; frame?: number }> = ({ x, y, h, rot = 0, flame = 0, frame = 0 }) => {
  const s = h / 100;
  const fl = flame * (16 + Math.sin(frame * 1.3) * 5);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {flame > 0 ? (
        <g>
          <path d={`M -8 4 Q 0 ${10 + fl * 2.2} 8 4 Z`} fill={BRASS} />
          <path d={`M -4.5 4 Q 0 ${8 + fl * 1.3} 4.5 4 Z`} fill="#FFF3C8" />
        </g>
      ) : null}
      <path d="M -14 -8 L -27 6 L -27 -20 L -14 -36 Z" fill={TERRA} />
      <path d="M 14 -8 L 27 6 L 27 -20 L 14 -36 Z" fill={TERRA_DEEP} />
      <rect x={-9} y={-2} width={18} height={7} rx={2} fill={INK} />
      <path d="M -14 0 L -14 -62 Q -14 -86 0 -100 Q 14 -86 14 -62 L 14 0 Z" fill={CHALK} />
      <path d="M 5 0 L 5 -62 Q 6 -84 0 -100 Q 14 -86 14 -62 L 14 0 Z" fill={CHALK_SHADE} />
      <path d="M -11.5 -76 Q -8 -90 0 -100 Q 8 -90 11.5 -76 Q 0 -72 -11.5 -76 Z" fill={TERRA} />
      <circle cx={0} cy={-54} r={7} fill={OCEAN} stroke={INK} strokeWidth={2.5} />
      <circle cx={-2} cy={-56} r={2.2} fill={AIR} />
      <path d="M -14 -22 L 14 -22" stroke={CHALK_SHADE} strokeWidth={2} />
    </g>
  );
};

/** Lev's breath: three little puffs drifting up from (x, y). */
export const Puffs: React.FC<{ x: number; y: number; f: number; dir?: 1 | -1; color?: string }> = ({ x, y, f, dir = 1, color = CHALK }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const a = ((f + i * 14) % 42) / 42;
      return <circle key={i} cx={x + dir * a * 46} cy={y - a * 40} r={5 + a * 9} fill={color} opacity={(1 - a) * 0.55} />;
    })}
  </g>
);

// ---------------------------------------------------------------- clay range (matches STKeyAir)
export const CLAY_GROUND = 900;
export const CLAY_PEAK = 330;
/** px per km on the key-art scale (Everest 8.85 km = ground − peak) */
export const PX_KM = (CLAY_GROUND - CLAY_PEAK) / 8.85;

type Bez = [Pt, Pt, Pt, Pt];
const leftFlank = (cx: number, w: number, peakY: number): Bez => [
  [cx - w, CLAY_GROUND], [cx - w * 0.55, CLAY_GROUND - 120], [cx - w * 0.3, peakY + 120], [cx - 30, peakY + 14],
];
const bez = (b: Bez, t: number): Pt => {
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * b[0][k] + 3 * u * u * t * b[1][k] + 3 * u * t * t * b[2][k] + t * t * t * b[3][k]) as Pt;
};
/** point on the mountain's left flank at screen height y (bisection on the bezier) */
export const flankAt = (cx: number, w: number, y: number): Pt => {
  const b = leftFlank(cx, w, CLAY_PEAK);
  let lo = 0, hi = 1;
  for (let i = 0; i < 30; i++) {
    const m = (lo + hi) / 2;
    if (bez(b, m)[1] > y) lo = m;
    else hi = m;
  }
  return bez(b, (lo + hi) / 2);
};

export const Mountain: React.FC<{ cx: number; w?: number; seed?: number; k?: number; ghost?: boolean }> = ({ cx, w = 380, seed = 0, k = 1, ghost }) => {
  const fam = SUPPOSE.clay;
  const g = CLAY_GROUND, p = CLAY_PEAK;
  const d = `M ${cx - w} ${g} C ${cx - w * 0.55} ${g - 120} ${cx - w * 0.3} ${p + 120} ${cx - 30} ${p + 14} Q ${cx} ${p - 8} ${cx + 34} ${p + 20} C ${cx + w * 0.3} ${p + 150 + seed} ${cx + w * 0.6} ${g - 110} ${cx + w} ${g} Z`;
  if (ghost) return <path d={d} fill="none" stroke={CHALK} strokeWidth={4} strokeDasharray="16 12" opacity={0.7} />;
  return (
    <g transform={`translate(0 ${g}) scale(1 ${k}) translate(0 ${-g})`}>
      <path d={d} fill={fam.mid} />
      <path d={`M ${cx - 62} ${p + 70} Q ${cx - 30} ${p + 5} ${cx} ${p - 2} Q ${cx + 40} ${p + 10} ${cx + 66} ${p + 74} Q ${cx + 20} ${p + 54} ${cx} ${p + 76} Q ${cx - 24} ${p + 50} ${cx - 62} ${p + 70} Z`} fill="#FFF1E0" />
      <path d={`M ${cx + 8} ${p + 16} C ${cx + 120} ${p + 160} ${cx + 250} ${g - 110} ${cx + 380} ${g} L ${cx + 60} ${g} C ${cx + 90} ${g - 200} ${cx + 40} ${p + 200} ${cx + 8} ${p + 16} Z`} fill={fam.near} opacity={0.28} />
    </g>
  );
};

/** air dots for scale height 547 px (8.5 km); stored as [x, altitude px] so they can be squashed toward the ground */
const makeAir = (x0: number, x1: number, seed: number): Pt[] => {
  const out: Pt[] = [];
  let i = 0;
  for (let y = CLAY_GROUND - 6; y > 140; y -= 13) {
    for (let x = x0; x < x1; x += 13) {
      i++;
      const alt = CLAY_GROUND - y;
      if (rnd(seed * 997 + i) < Math.exp(-alt / 547) * 0.85) out.push([x + (rnd(i * 3 + seed) - 0.5) * 9, alt + (rnd(i * 5 + seed) - 0.5) * 9]);
    }
  }
  return out;
};
const AIR_L = makeAir(120, 900, 1);
const AIR_R = makeAir(1020, 1800, 2);
/** k = 1: today's air; k = 0.5: 2× Earth (scale height halved) */
export const AirDots: React.FC<{ side: "L" | "R"; k: number; f: number }> = ({ side, k, f }) => (
  <g fill={AIR} opacity={0.85}>
    {(side === "L" ? AIR_L : AIR_R).map(([x, a], i) => (
      <circle key={i} cx={x + Math.sin(f / 9 + i * 1.7) * 2.2} cy={CLAY_GROUND - Math.max(4, a * k) + Math.cos(f / 11 + i) * 1.6} r={2.6} />
    ))}
  </g>
);

export const ClayBack: React.FC<{ f: number }> = ({ f }) => {
  const fam = SUPPOSE.clay;
  return (
    <g>
      <Bloom x={960} y={860} r={620} color={fam.light} strength={0.55} spread={0.5} />
      <path d="M -60 760 C 100 700 250 690 420 730 C 600 770 640 650 820 670 C 980 690 1100 740 1250 660 C 1400 590 1560 740 1760 640 C 1860 600 1950 650 1990 700 L 1990 1100 L -60 1100 Z" fill={fam.far} opacity={0.75} />
      {/* a drifting wisp so the sky is never frozen */}
      <g opacity={0.28}>
        <ellipse cx={((f * 1.6) % 2400) - 240} cy={210} rx={150} ry={22} fill={fam.light} />
        <ellipse cx={((f * 1.6 + 1200) % 2400) - 240} cy={150} rx={110} ry={16} fill={fam.light} />
      </g>
    </g>
  );
};

export const ClayFloor: React.FC<{ right?: string; rightLime?: boolean }> = ({ right = "2× EARTH" }) => {
  const fam = SUPPOSE.clay;
  return (
    <g>
      <rect x={-60} y={CLAY_GROUND} width={2040} height={240} fill={fam.near} />
      <text x={520} y={CLAY_GROUND + 70} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={36} letterSpacing={3} fill={CHALK}>OUR EARTH</text>
      <text x={1400} y={CLAY_GROUND + 70} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={36} letterSpacing={3} fill="#C6E03A">{right}</text>
    </g>
  );
};

/** Flag (as devices.Flag) whose card can slide in on its own: `card` 0..1 (0 = above and hidden, 1 = home). */
export const SlideFlag: React.FC<{ x: number; y: number; big: string; small: string; side?: 1 | -1; frame: number; card: number; pole?: number }> = ({
  x, y, big, small, side = 1, frame, card, pole = 1,
}) => {
  const wv = Math.sin(frame / 7) * 6;
  const cw = Math.max(big.length * 44, small.length * 13.5) + 40;
  const cx = side === 1 ? x + 16 : x - 16 - cw;
  const ph = 120 * pole;
  const dy = (1 - card) * -60;
  return (
    <g>
      <path d={`M ${x} ${y} L ${x} ${y - ph}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      {pole > 0.3 ? (
        <path d={`M ${x} ${y - ph} Q ${x + side * 40} ${y - ph + 8 + wv} ${x + side * 72} ${y - ph + 16 + wv * 1.4} Q ${x + side * 40} ${y - ph + 28 + wv * 0.5} ${x} ${y - ph + 36} Z`} fill={TERRA} />
      ) : null}
      {card > 0 ? (
        <g transform={`translate(0 ${dy})`} opacity={Math.min(1, card * 1.4)}>
          <rect x={cx} y={y - 250} width={cw} height={112} rx={18} fill={INK} opacity={0.78} />
          <text x={cx + cw / 2} y={y - 180} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={64} fill={CHALK}>{big}</text>
          <text x={cx + cw / 2} y={y - 152} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={19} letterSpacing={1.5} fill={CHALK} opacity={0.85}>{small}</text>
        </g>
      ) : null}
    </g>
  );
};

/** Ink readout panel: small label, big value, small unit. (x, y) = top centre. */
export const Readout: React.FC<{ x: number; y: number; label: string; value: string; unit?: string; w?: number; size?: number; dark?: boolean }> = ({
  x, y, label, value, unit, w = 620, size = 170, dark = true,
}) => {
  const h = size + 130;
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={h} rx={28} fill={dark ? INK : CHALK} opacity={dark ? 0.66 : 0.92} />
      <rect x={x - w / 2} y={y} width={w} height={h} rx={28} fill="none" stroke={dark ? CHALK : INK} strokeOpacity={0.25} strokeWidth={2} />
      <text x={x} y={y + 52} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={28} letterSpacing={4} fill={dark ? CHALK : INK} opacity={0.85}>{label}</text>
      <text x={x} y={y + 52 + size * 0.95} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={size} fill={dark ? CHALK : INK}>
        {value}
        {unit ? <tspan fontSize={size * 0.32} fontWeight={800} dx={14}>{unit}</tspan> : null}
      </text>
    </g>
  );
};

export { BRASS_DARK };

/** Shot-body wrapper (ShotStage now drifts every body through <Layer>, so this adds no camera of its own). */
export const Push: React.FC<{ t: number; children: React.ReactNode }> = ({ children }) => <>{children}</>;
