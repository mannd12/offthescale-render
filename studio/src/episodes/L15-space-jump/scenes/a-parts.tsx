// L15 package-A helpers (Cold, S01, S02, S08 only): small drawing pieces these four scenes share. Shot bodies stay
// bespoke in each scene file (hard rule 1). No figures live here: every number a shot draws comes from jumpdata.ts.
import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import {
  CycClouds,
  Family,
  HazeBand,
  IF2,
  Layer,
  Metric,
  Motes,
  Pill,
  Sky,
  alpha,
  cutPop,
  labelCase,
  mixHex,
  ramp,
  rnd,
  smooth,
} from "../../../lib/illustrated";
import { L15_COLORS, familyOf, pillFill } from "../families";
import { altY } from "../sky";

export const C = L15_COLORS;
export const VOID = familyOf("void");
export const DUSK = familyOf("dusk");
export const PETROL = familyOf("petrol");
export const NOON = familyOf("noon");
export const STUDIO = familyOf("studio");
export const CREAM = "#FFF4DE";
export const INK = "#1E4A5C";
export const cl01 = (v: number) => Math.max(0, Math.min(1, v));
/** eased 0..1 between frames a and b */
export const ez = (f: number, a: number, b: number) => smooth(ramp(f, a, b));
/** linear 0..1 between frames a and b (constant-speed movers) */
export const lin = (f: number, a: number, b: number) => cl01((f - a) / Math.max(1, b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Piecewise-linear path through [frame, value] keys (constant speed between keys: movers never ease to a halt). */
export const path1 = (f: number, keys: [number, number][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (f <= f1) return v0 + ((v1 - v0) * (f - f0)) / Math.max(1, f1 - f0);
  }
  return keys[keys.length - 1][1];
};

/** A hard cut's pop (scale bump over 9 frames). */
export const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/** The episode pill (kit Pill, labelCase, the family shadow at 72 %). */
export const PillA: React.FC<{ x: number; y: number; text: string; F: Family; dot?: string; size?: number; align?: "start" | "middle" | "end"; opacity?: number }> = ({ x, y, text, F, dot, size = 28, align = "start", opacity = 1 }) =>
  opacity <= 0.01 ? null : (
    <g opacity={opacity}>
      <Pill x={x} y={y} text={text} fill={pillFill(F)} color={CREAM} dot={dot} size={size} align={align} />
    </g>
  );

/** A metric on a dark slab: `value` exactly as written, `unit` in its own case (km, m, km/h). */
export const Slab: React.FC<{ x: number; y: number; value: string; unit?: string; size?: number; F: Family; opacity?: number; color?: string }> = ({ x, y, value, unit, size = 96, F, opacity = 1, color = CREAM }) => {
  const w = value.length * size * 0.6 + (unit ? unit.length * size * 0.27 + size * 0.3 : 0) + size * 0.6;
  return opacity <= 0.01 ? null : (
    <g opacity={opacity}>
      <rect x={x - size * 0.3} y={y - size * 0.95} width={w} height={size * 1.25} rx={size * 0.18} fill={pillFill(F)} />
      <Metric x={x} y={y} value={value} unit={unit} size={size} color={color} />
    </g>
  );
};

/** A number rolling up to `end` (a jumpdata.ts value), shown with `dp` decimals and thousands commas. */
export const rollText = (end: number, k: number, dp = 0) => (end * cl01(k)).toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });

// ---------------------------------------------------------------------------------------------------------------
// The night ruler world (scene 1, C-10, 8-11): a dark altitude column (NOT the day sky: value < 0.25 over most of it),
// two tinted star layers that stream with the camera's altitude, an optional night-ground sliver with a city glow.
// ---------------------------------------------------------------------------------------------------------------
const NIGHT: [number, string][] = [
  [0, "#16246A"],
  [10, "#101A52"],
  [30, "#0B1140"],
  [60, "#080C32"],
  [90, "#060824"],
  [110, "#04051A"],
];
export const nightAt = (alt: number) => {
  if (alt <= NIGHT[0][0]) return NIGHT[0][1];
  for (let i = 1; i < NIGHT.length; i++) if (alt <= NIGHT[i][0]) return mixHex(NIGHT[i - 1][1], NIGHT[i][1], (alt - NIGHT[i - 1][0]) / (NIGHT[i][0] - NIGHT[i - 1][0]));
  return NIGHT[NIGHT.length - 1][1];
};

export const NightColumn: React.FC<{ f: number; altTop: number; altBottom: number; ground?: boolean; seed?: number; drift?: number; streak?: number; tint?: string; tintK?: number }> = ({
  f,
  altTop,
  altBottom,
  ground = true,
  seed = 3,
  drift = 0,
  streak = 0,
  tint,
  tintK = 0,
}) => {
  const id = "nc" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const n = 9;
  const stops = Array.from({ length: n }, (_, i) => {
    const c = nightAt(altTop + ((altBottom - altTop) * i) / (n - 1));
    return tint ? mixHex(c, tint, tintK) : c;
  });
  const pxPerKm = 1080 / (altTop - altBottom);
  const mid = (altTop + altBottom) / 2;
  const layer = (depth: number, cnt: number, size: number, sd: number) => {
    const tile = 1280;
    const off = mid * pxPerKm * depth + f * drift * depth;
    return Array.from({ length: cnt }, (_, i) => {
      const sx = rnd(sd * 7 + i) * 1920;
      const sy = -100 + ((((rnd(sd * 11 + i) * tile - off) % tile) + tile) % tile);
      const col = rnd(sd * 13 + i) > 0.5 ? C.starGold : C.starTeal;
      const r = size * (0.6 + rnd(sd * 3 + i));
      const tw = 0.65 + 0.35 * Math.sin(f / (7 + rnd(sd * 17 + i) * 14) + i);
      return streak > 0 ? (
        <line key={i} x1={sx} y1={sy} x2={sx} y2={sy + streak * depth} stroke={col} strokeWidth={r * 1.2} strokeLinecap="round" opacity={tw} />
      ) : (
        <circle key={i} cx={sx} cy={sy} r={r} fill={col} opacity={tw} />
      );
    });
  };
  const gy = altY(0, altTop, altBottom);
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {stops.map((c, i) => (
            <stop key={i} offset={i / (n - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect x={-400} y={-300} width={2720} height={1680} fill={`url(#${id})`} />
      {layer(0.3, 80, 1.6, seed)}
      {layer(0.75, 46, 2.6, seed + 9)}
      {ground && gy < 1200 ? <NightGround f={f} y={gy} /> : null}
    </g>
  );
};

/** The night desert under the ruler: dark dunes with a glowing ember-saffron horizon and town lights. */
export const NightGround: React.FC<{ f: number; y: number }> = ({ f, y }) => {
  const d1 = mixHex(C.dune2, "#120A24", 0.62);
  const d2 = mixHex(C.dune3, "#0A0618", 0.72);
  return (
    <g>
      <rect x={-400} y={y - 40} width={2720} height={40} fill={C.cityGlow} opacity={0.32} />
      <rect x={-400} y={y - 12} width={2720} height={12} fill={C.cityGlow} opacity={0.6} />
      <path d={`M-400 ${y} Q 300 ${y - 26} 900 ${y + 4} Q 1500 ${y + 22} 2320 ${y - 10} L2320 ${y + 900} L-400 ${y + 900} Z`} fill={d1} />
      <path d={`M-400 ${y + 70} Q 500 ${y + 40} 1100 ${y + 74} Q 1700 ${y + 96} 2320 ${y + 60} L2320 ${y + 900} L-400 ${y + 900} Z`} fill={d2} />
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={rnd(i * 5 + 1) * 1920} cy={y + 14 + rnd(i * 9) * 46} r={2.5 + rnd(i * 3) * 2.5} fill={i % 3 ? C.cityGlow : C.saffronCore} opacity={0.6 + 0.4 * Math.sin(f / 6 + i)} />
      ))}
    </g>
  );
};

/** A small saffron bracket bolted to the ruler, for Tick to stand on (Tick never floats, never falls). */
export const Ledge: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 150 }) => (
  <g>
    <rect x={x} y={y} width={w} height={12} rx={4} fill={C.saffron} />
    <path d={`M${x + 8} ${y + 12} L${x + 8} ${y + 44} L${x + 40} ${y + 12} Z`} fill={C.saffronDeep} />
  </g>
);

/** The teal studio cyclorama (never bone): cyc clouds sliding, ochre floor; children on the floor plane. */
export const StudioRoom: React.FC<{ f: number; children?: React.ReactNode; hud?: React.ReactNode; seed?: number; floor?: number; dark?: number }> = ({ f, children, hud, seed = 4, floor = 880, dark = 0 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={STUDIO} x={-600} y={-300} w={3120} h={1700} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f} y={70} n={5} seed={seed} />
    </Layer>
    <Layer depth={0.6}>
      <rect x={-1400} y={floor - 30} width={4800} height={1200} fill={mixHex(STUDIO.mid, "#FFE4A8", 0.15)} />
      <HazeBand y={floor - 160} h={180} color={STUDIO.haze} strength={0.7} x={-1400} w={4800} />
    </Layer>
    <Layer depth={1}>
      <rect x={-1400} y={floor + 40} width={4800} height={1200} fill={mixHex(STUDIO.mid, STUDIO.near, 0.55)} />
      {children}
    </Layer>
    <Layer depth={1.2}>
      <Motes frame={f} n={18} x={-100} y={60} w={2100} h={860} color={alpha(CREAM, 0.85)} seed={seed} size={5} drift={40} />
    </Layer>
    {dark > 0 ? (
      <Layer depth={0}>
        <rect x={0} y={0} width={1920} height={1080} fill="#06082A" opacity={dark} />
      </Layer>
    ) : null}
    {hud ? <Layer depth={0}>{hud}</Layer> : null}
  </>
);

/** A plate on the studio floor (the honesty plates of scene 8): teal-ink card with a title and an optional icon slot. */
export const NotePlate: React.FC<{ x: number; y: number; w: number; h: number; title?: string; children?: React.ReactNode; tilt?: number; fill?: string }> = ({ x, y, w, h, title, children, tilt = 0, fill = "#14384A" }) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
    <rect x={8} y={12} width={w} height={h} rx={22} fill="#000" opacity={0.16} />
    <rect x={0} y={0} width={w} height={h} rx={22} fill={fill} stroke={alpha(CREAM, 0.4)} strokeWidth={3} />
    {title ? (
      <text x={w / 2} y={h * 0.5 + 16} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 40, letterSpacing: 4, fill: CREAM }}>
        {labelCase(title)}
      </text>
    ) : null}
    {children}
  </g>
);

/** A brick-wall icon (1-05), drawn in rows as `draw` 0..1 grows; saffron outline on teal-ink bricks. */
export const WallIcon: React.FC<{ x: number; y: number; w: number; h: number; draw: number }> = ({ x, y, w, h, draw }) => {
  const rows = 5;
  const bh = h / rows;
  const out: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const k = cl01(draw * rows - (rows - 1 - r));
    if (k <= 0) continue;
    const n = 4;
    const bw = w / n;
    for (let i = -1; i < n; i++) {
      const bx = x + i * bw + (r % 2 ? bw / 2 : 0);
      const x0 = Math.max(x, bx);
      const x1 = Math.min(x + w, bx + bw);
      if (x1 - x0 < 6) continue;
      out.push(<rect key={`${r}-${i}`} x={x0 + 3} y={y + h - (r + 1) * bh + 3 + (1 - k) * -30} width={x1 - x0 - 6} height={bh - 6} rx={4} fill={mixHex(C.saffronDeep, "#2A1206", 0.3)} stroke={C.saffron} strokeWidth={3} opacity={k} />);
    }
  }
  return <g>{out}</g>;
};

/** A saffron strike stroke drawing from (x1,y1) to (x2,y2) as k goes 0..1, with a glowing head while it draws. */
export const Strike: React.FC<{ x1: number; y1: number; x2: number; y2: number; k: number; w?: number; color?: string }> = ({ x1, y1, x2, y2, k, w = 16, color = C.saffron }) => {
  const t = cl01(k);
  if (t <= 0) return null;
  const ex = x1 + (x2 - x1) * t;
  const ey = y1 + (y2 - y1) * t;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={INK} strokeWidth={w + 8} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={w} strokeLinecap="round" />
      {t < 1 ? <circle cx={ex} cy={ey} r={w * 0.9} fill={C.saffronCore} /> : null}
    </g>
  );
};

/** A plain stopwatch with no numerals (8-10: the two disagreeing sources): the hand sweeps to `angle` degrees. */
export const BlankWatch: React.FC<{ x: number; y: number; r: number; angle: number; f: number; ring?: string }> = ({ x, y, r, angle, f, ring = C.saffron }) => {
  const a = ((angle - 90) * Math.PI) / 180;
  return (
    <g>
      <rect x={x - r * 0.16} y={y - r - r * 0.32} width={r * 0.32} height={r * 0.2} rx={4} fill={ring} />
      <circle cx={x} cy={y} r={r} fill={alpha("#04121A", 0.8)} stroke={CREAM} strokeWidth={4} />
      {Array.from({ length: 12 }, (_, i) => {
        const th = (i * 30 * Math.PI) / 180;
        return <line key={i} x1={x + Math.cos(th) * r * 0.8} y1={y + Math.sin(th) * r * 0.8} x2={x + Math.cos(th) * r * 0.94} y2={y + Math.sin(th) * r * 0.94} stroke={CREAM} strokeWidth={3} />;
      })}
      <line x1={x} y1={y} x2={x + Math.cos(a) * r * 0.8} y2={y + Math.sin(a) * r * 0.8} stroke={C.vermilion} strokeWidth={7} strokeLinecap="round" />
      <circle cx={x} cy={y} r={9} fill={C.vermilion} />
      <circle cx={x} cy={y} r={r + 8} fill="none" stroke={ring} strokeWidth={4} opacity={0.4 + 0.3 * Math.sin(f / 4)} />
    </g>
  );
};

/** The long dial of 2-17/2-18: a wide 180° arc in km/h, a SOUND mark (position from soundSpeed, F10), named marks
 *  with vermilion needles, and a saffron stop far above with chevrons. No numerals on the face. */
export const LongDial: React.FC<{
  x: number;
  y: number;
  r: number;
  f: number;
  max: number;
  marks: { v: number; label: string; k: number }[];
  sound?: number;
  stopPulse?: boolean;
  ink?: string;
  plate?: string;
}> = ({ x, y, r, f, max, marks, sound, stopPulse = true, ink = CREAM, plate = "#14384A" }) => {
  const OV = 1.0;
  const ang = (v: number) => Math.PI + (Math.min(v, max * OV) / (max * OV)) * Math.PI;
  const pt = (v: number, rr: number): [number, number] => [x + Math.cos(ang(v)) * rr, y + Math.sin(ang(v)) * rr];
  const arc = (v0: number, v1: number, rr: number) => {
    const [ax, ay] = pt(v0, rr);
    const [bx, by] = pt(v1, rr);
    return `M${ax.toFixed(1)} ${ay.toFixed(1)} A${rr} ${rr} 0 0 1 ${bx.toFixed(1)} ${by.toFixed(1)}`;
  };
  const [s1x, s1y] = pt(max * 0.97, r - 30);
  const [s2x, s2y] = pt(max * 0.97, r + 30);
  return (
    <g>
      <path d={`M${x - r - 60} ${y + 40} A${r + 60} ${r + 60} 0 0 1 ${x + r + 60} ${y + 40} Z`} fill={plate} stroke={alpha(ink, 0.4)} strokeWidth={3} />
      <path d={arc(0, max, r)} fill="none" stroke={alpha(ink, 0.3)} strokeWidth={18} />
      {Array.from({ length: 21 }, (_, i) => {
        const [ax, ay] = pt((max * i) / 20, r - 22);
        const [bx, by] = pt((max * i) / 20, r - (i % 5 ? 4 : -6));
        return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={ink} strokeWidth={i % 5 ? 3 : 5} opacity={0.8} />;
      })}
      <line x1={s1x} y1={s1y} x2={s2x} y2={s2y} stroke={C.saffron} strokeWidth={14} strokeLinecap="round" />
      {stopPulse
        ? [0, 1, 2].map((k) => {
            const [cx, cy] = pt(max * 0.97, r + 52 + k * 24);
            const on = (f + k * 3) % 9 < 5;
            return <circle key={k} cx={cx} cy={cy} r={9} fill={C.saffron} opacity={on ? 1 : 0.25} />;
          })
        : null}
      {sound != null
        ? (() => {
            const [ax, ay] = pt(sound, r - 30);
            const [bx, by] = pt(sound, r + 30);
            const [lx, ly] = pt(sound, r + 74);
            return (
              <g>
                <line x1={ax} y1={ay} x2={bx} y2={by} stroke={C.limb} strokeWidth={8} strokeLinecap="round" />
                <text x={lx} y={ly} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 26, letterSpacing: 3, fill: C.limb }}>
                  {labelCase("sound")}
                </text>
              </g>
            );
          })()
        : null}
      {marks.map((m, i) => {
        const v = m.v * cl01(m.k);
        const [hx, hy] = pt(v, r - 40);
        const [tx, ty] = pt(m.v, r + 40 + i * 40);
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={hx} y2={hy} stroke={C.vermilion} strokeWidth={10 - i * 2} strokeLinecap="round" />
            {m.k >= 1 ? (
              <text x={tx} y={ty} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 24, letterSpacing: 3, fill: ink }}>
                {labelCase(m.label)}
              </text>
            ) : null}
          </g>
        );
      })}
      <circle cx={x} cy={y} r={22} fill={C.vermilion} />
    </g>
  );
};
