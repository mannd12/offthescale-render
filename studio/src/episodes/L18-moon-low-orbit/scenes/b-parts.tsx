// L18 package B bespoke parts (scenes l05-l08 + closer). Never imported by package A (and B never imports a-parts).
// Everything here is a picture helper; every numeral that reaches the screen goes through data18's assertAllowed /
// assertValue (Num, Label, RollInt, RollDec, Readout do it for you).
// USAGE
//   runOf(c => [{ at, S }, …])   one ShotDef made of continuous PHASES (storyboard PUSH / SLIDE rows): each phase gets its own
//                                f and len; a phase change cross-dissolves over `blend` frames (default 14) with a small push
//   <Pop f>                      the hard-cut scale pop (kit cutPop) around a whole shot
//   <FamSky name /> · <NightSky />   oversized family sky; the abyss field from its first two stops only (dark frames)
//   <PaperGrid f />              the tangerine survey paper's faint grid (slides 2 px/f) + its near-plane floor
//   <Num>, <Label>, <RollInt>, <RollDec>, <Readout>   asserted text and readouts (units as their own span, F13)
//   <Ruler18>, <ReadHead>, <Bracket18>, <CheckMark>, <Slam>   drawing heads and slams (36-50 px/f)
import React from "react";
import { AbsoluteFill } from "remotion";
import { Counter, Dissolve, IF2, Sky, alpha, cutPop, labelCase, mixHex, rnd } from "../../../lib/illustrated";
import { L18_COLORS, PILL_TEXT, familyOf, type L18FamilyName } from "../families";
import { assertAllowed, assertValue } from "../data18";
import { ShotFC } from "../shots";

export const C = L18_COLORS;
export const INK = C.ink;
export const BROWN = "#2A0E04";
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const mod = (a: number, n: number) => ((a % n) + n) % n;
export const fr = (v: number) => v - Math.floor(v);
export const sm = (u: number) => {
  const t = clamp01(u);
  return t * t * (3 - 2 * t);
};
/** eased 0..1 between frames a and b */
export const ez = (f: number, a: number, b: number) => sm((f - a) / Math.max(1, b - a));
/** linear 0..1 between frames a and b */
export const lin = (f: number, a: number, b: number) => clamp01((f - a) / Math.max(1, b - a));
/** piecewise-linear value through [frame, value] keys (flat outside) */
export const path1 = (f: number, keys: [number, number][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (f <= f1) return v0 + ((v1 - v0) * (f - f0)) / Math.max(1e-6, f1 - f0);
  }
  return keys[keys.length - 1][1];
};
/** ping-pong 0..1..0 with period p frames */
export const ping = (f: number, p: number) => {
  const u = fr(f / p);
  return u < 0.5 ? u * 2 : (1 - u) * 2;
};
/** stroke props that draw a path to fraction k (the path needs pathLength={1}) */
export const drawn = (k: number) => ({ pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - clamp01(k) });
/** log-space interpolation (zoom and km paths look even when they move in ratio) */
export const logLerp = (a: number, b: number, t: number) => Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * t);
export { alpha, mixHex, rnd };

// ---------------------------------------------------------------------------------------------------------------
// shot plumbing
// ---------------------------------------------------------------------------------------------------------------
export type Phase<Cu> = { at: number; S: React.FC<{ f: number; len: number; c: Cu }>; dir?: "up" | "down" | "left" | "right"; blend?: number };

/** A ShotDef made of continuous phases (PUSH / SLIDE rows): `get(c)` lists the phases by SCENE frame, the first one at the
 *  shot's own `from`. The incoming phase cross-dissolves in over `blend` frames with a 60-px push. */
export function runOf<Cu>(get: (c: Cu) => Phase<Cu>[]): ShotFC<Cu> {
  const R: ShotFC<Cu> = ({ f, len, c }) => {
    const ph = get(c);
    const s0 = ph[0].at;
    const F = s0 + f;
    let k = 0;
    for (let i = 0; i < ph.length; i++) if (F >= ph[i].at) k = i;
    const endOf = (i: number) => (i + 1 < ph.length ? ph[i + 1].at : s0 + len);
    const P = ph[k];
    const cur = <P.S f={F - P.at} len={endOf(k) - P.at} c={c} />;
    const blend = P.blend ?? 14;
    if (k > 0 && F - P.at < blend) {
      const Q = ph[k - 1];
      const prev = <Q.S f={F - Q.at} len={endOf(k - 1) - Q.at} c={c} />;
      return <Dissolve t={(F - P.at) / blend} from={prev} to={cur} dir={P.dir ?? "left"} push={60} />;
    }
    return cur;
  };
  return R;
}

/** A hard cut's pop (scale bump over 9 frames). */
export const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

// ---------------------------------------------------------------------------------------------------------------
// fields
// ---------------------------------------------------------------------------------------------------------------
export const FamSky: React.FC<{ name: L18FamilyName; angle?: number; stops?: string[] }> = ({ name, angle = 90, stops }) => (
  <Sky family={familyOf(name)} stops={stops} x={-1400} y={-1400} w={4720} h={3880} angle={angle} />
);
/** The abyss field for a dark frame: only the family's first two stops (V < 0.3), so the lit subject carries the frame. */
export const NightSky: React.FC<{ lift?: number }> = ({ lift = 0 }) => (
  <Sky stops={["#01121B", lift > 0 ? mixHex("#022B40", "#07608A", lift) : "#022B40"]} x={-1400} y={-1400} w={4720} h={3880} />
);

/** The tangerine survey paper's faint grid (slides 2 px/f so the paper itself is never frozen) and its near floor. */
export const PaperGrid: React.FC<{ f: number; floor?: number; speed?: number; color?: string }> = ({ f, floor, speed = 2, color = "#FFE08A" }) => {
  const g = 80;
  const off = mod(f * speed, g);
  return (
    <g>
      {Array.from({ length: 40 }, (_, i) => (
        <line key={"v" + i} x1={-600 + i * g + off} y1={-600} x2={-600 + i * g + off} y2={1700} stroke={color} strokeWidth={i % 5 === 0 ? 2.4 : 1.2} opacity={0.22} />
      ))}
      {Array.from({ length: 30 }, (_, i) => (
        <line key={"h" + i} x1={-800} y1={-600 + i * g} x2={2800} y2={-600 + i * g} stroke={color} strokeWidth={i % 5 === 0 ? 2.4 : 1.2} opacity={0.22} />
      ))}
      {floor != null ? (
        <g>
          <rect x={-1200} y={floor} width={4400} height={1400} fill="#5E2410" />
          <rect x={-1200} y={floor} width={4400} height={10} fill="#C85A1E" />
          <rect x={-1200} y={floor + 40} width={4400} height={1400} fill="#3A1406" opacity={0.5} />
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// text (asserted)
// ---------------------------------------------------------------------------------------------------------------
const numStyle = (size: number, color: string): React.CSSProperties => ({ fontFamily: IF2.num, fontWeight: 800, fontSize: size, fill: color, fontVariantNumeric: "tabular-nums", letterSpacing: -size * 0.02 });

export const Num: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; align?: "start" | "middle" | "end"; who?: string; opacity?: number }> = ({
  x,
  y,
  text,
  size = 72,
  color = PILL_TEXT,
  align = "start",
  who = "Num",
  opacity = 1,
}) => (
  <text x={x} y={y} textAnchor={align} opacity={opacity} style={numStyle(size, color)}>
    {assertAllowed(text, who)}
  </text>
);

export const Label: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; align?: "start" | "middle" | "end"; opacity?: number; spacing?: number; halo?: string }> = ({
  x,
  y,
  text,
  size = 26,
  color = PILL_TEXT,
  align = "start",
  opacity = 1,
  spacing,
  halo,
}) => {
  const t = assertAllowed(labelCase(text), "Label");
  return (
    <text
      x={x}
      y={y}
      textAnchor={align}
      opacity={opacity}
      stroke={halo}
      strokeWidth={halo ? size * 0.28 : 0}
      paintOrder="stroke"
      style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: spacing ?? size * 0.12, fill: color }}
    >
      {t}
    </text>
  );
};

/** Integer readout rolling 0 → value (odometer), the unit after it as its own span (both asserted). */
export const RollInt: React.FC<{ x: number; y: number; value: number; k: number; unit?: string; size?: number; color?: string; unitColor?: string; who?: string; from?: number }> = ({
  x,
  y,
  value,
  k,
  unit,
  size = 96,
  color = PILL_TEXT,
  unitColor,
  who = "RollInt",
  from = 0,
}) => {
  assertValue(value, who);
  if (unit) assertAllowed(unit, who);
  const t = clamp01(k);
  const v = t >= 1 ? value : Math.floor(from + (value - from) * t);
  const digits = value.toLocaleString("en-US");
  const numW = digits.replace(/,/g, "").length * size * 0.6 + (digits.match(/,/g)?.length ?? 0) * size * 0.22;
  return (
    <g>
      <Counter x={x} y={y} value={v} max={value} size={size} color={color} align="start" digits={digits.replace(/,/g, "").length} />
      {unit ? (
        <text x={x + numW + size * 0.18} y={y} style={{ fontFamily: IF2.num, fontWeight: 600, fontSize: size * 0.42, fill: unitColor ?? color }}>
          {unit}
        </text>
      ) : null}
    </g>
  );
};

/** One-decimal readout rolling 0 → value (a data18 value), the unit as its own span (asserted). */
export const RollDec: React.FC<{ x: number; y: number; value: number; k: number; unit?: string; size?: number; color?: string; unitColor?: string; who?: string; align?: "start" | "middle" }> = ({
  x,
  y,
  value,
  k,
  unit,
  size = 96,
  color = PILL_TEXT,
  unitColor,
  who = "RollDec",
  align = "start",
}) => {
  assertValue(value, who);
  if (unit) assertAllowed(unit, who);
  const t = clamp01(k);
  const shown = (t >= 1 ? value : Math.floor(value * t * 10) / 10).toFixed(1);
  return (
    <text x={x} y={y} textAnchor={align} style={numStyle(size, color)}>
      {shown}
      {unit ? (
        <tspan dx={size * 0.16} style={{ fontSize: size * 0.42, fontWeight: 600, fill: unitColor ?? color, letterSpacing: size * 0.01 }}>
          {unit}
        </tspan>
      ) : null}
    </text>
  );
};

/** A dark rounded plate behind a readout. */
export const Plate: React.FC<{ x: number; y: number; w: number; h: number; color?: string; opacity?: number; stroke?: string }> = ({ x, y, w, h, color = "#01121B", opacity = 0.8, stroke }) => (
  <g>
    <rect x={x + 6} y={y + 9} width={w} height={h} rx={h * 0.22} fill="#000A10" opacity={0.25} />
    <rect x={x} y={y} width={w} height={h} rx={h * 0.22} fill={color} opacity={opacity} stroke={stroke} strokeWidth={stroke ? 3 : 0} />
  </g>
);

/** A readout block on a plate: optional word before the number ("ABOUT"), the rolling number, the unit span; slides in. */
export const Readout: React.FC<{
  x: number;
  y: number;
  value: number;
  k: number;
  pre?: string;
  unit?: string;
  dec?: boolean;
  size?: number;
  w?: number;
  appear?: number;
  plate?: string;
  color?: string;
  unitColor?: string;
  who: string;
}> = ({ x, y, value, k, pre, unit, dec = false, size = 92, w = 760, appear = 1, plate = "#01121B", color = PILL_TEXT, unitColor = C.amber, who }) => {
  const a = sm(appear);
  if (a <= 0) return null;
  const h = size * (pre ? 1.62 : 1.3);
  const ny = y + (pre ? size * 1.36 : size * 1.02);
  return (
    <g opacity={a} transform={`translate(${((1 - a) * -40).toFixed(1)} 0)`}>
      <Plate x={x} y={y} w={w} h={h} color={plate} opacity={0.82} />
      {pre ? <Label x={x + 34} y={y + size * 0.42} text={pre} size={size * 0.28} color={unitColor} /> : null}
      {dec ? (
        <RollDec x={x + 30} y={ny} value={value} k={k} unit={unit} size={size} color={color} unitColor={unitColor} who={who} />
      ) : (
        <RollInt x={x + 30} y={ny} value={value} k={k} unit={unit} size={size} color={color} unitColor={unitColor} who={who} />
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// drawing heads, brackets, checks, slams
// ---------------------------------------------------------------------------------------------------------------
/** A lemon survey ruler from (x, y) along +x, drawn to `len × k` with a lit drawing head. */
export const Ruler18: React.FC<{ x: number; y: number; len: number; k: number; h?: number; rotate?: number; color?: string; ink?: string }> = ({ x, y, len, k, h = 34, rotate = 0, color = C.lemon, ink = INK }) => {
  const L = Math.max(0, len * clamp01(k));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={4} y={-h / 2 + 7} width={L} height={h} rx={5} fill="#000A10" opacity={0.25} />
      <rect x={0} y={-h / 2} width={L} height={h} rx={5} fill={color} stroke={C.lemonDeep} strokeWidth={2} />
      {Array.from({ length: Math.floor(L / 20) + 1 }, (_, i) => (
        <line key={i} x1={i * 20} y1={-h / 2} x2={i * 20} y2={-h / 2 + (i % 5 === 0 ? h * 0.62 : h * 0.32)} stroke={ink} strokeWidth={i % 5 === 0 ? 3 : 1.8} />
      ))}
      {k > 0 && k < 1 ? (
        <g>
          <circle cx={L} cy={0} r={h * 0.9} fill={C.moonRim} opacity={0.3} />
          <circle cx={L} cy={0} r={h * 0.36} fill="#FFF3C8" />
        </g>
      ) : null}
    </g>
  );
};

/** A glowing reading head that ping-pongs along (x0,y0)→(x1,y1) at `speed` px/f (never settles). */
export const ReadHead: React.FC<{ x0: number; y0: number; x1: number; y1: number; f: number; speed?: number; r?: number; color?: string; phase?: number }> = ({ x0, y0, x1, y1, f, speed = 20, r = 12, color = C.moonRim, phase = 0 }) => {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const t = ping(f * speed + phase * L, 2 * L);
  const x = x0 + (x1 - x0) * t;
  const y = y0 + (y1 - y0) * t;
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.6} fill={color} opacity={0.28} />
      <circle cx={x} cy={y} r={r} fill="#FFF3C8" />
    </g>
  );
};

/** A dimension bracket from (x0,y) to (x1,y) with end feet, drawn from the left to `k`, with a lit head. */
export const Bracket18: React.FC<{ x0: number; x1: number; y: number; k: number; color?: string; feet?: number; width?: number }> = ({ x0, x1, y, k, color = INK, feet = 26, width = 5 }) => {
  const e = clamp01(k);
  const xe = x0 + (x1 - x0) * e;
  const P = (pts: [number, number][]) => "M" + pts.map(([a, b]) => `${a} ${b}`).join(" L");
  const [hx, hy] = [xe, y];
  return (
    <g>
      <path d={P([[x0, y - feet], [x0, y], [xe, y]])} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" />
      {e >= 1 ? <path d={P([[x1, y], [x1, y - feet]])} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" /> : null}
      {e > 0 && e < 1 ? (
        <g>
          <circle cx={hx} cy={hy} r={20} fill={C.moonRim} opacity={0.35} />
          <circle cx={hx} cy={hy} r={8} fill="#FFF3C8" />
        </g>
      ) : null}
    </g>
  );
};

/** A check mark drawn at 40 px/f-ish (k 0..1), scale `s` (base ≈ 200 px wide). */
export const CheckMark: React.FC<{ x: number; y: number; k: number; s?: number; color?: string }> = ({ x, y, k, s = 1, color = C.lemon }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 0 L-25 65 L105 -85" fill="none" stroke="#000A10" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} transform="translate(6 8)" {...drawn(k)} />
    <path d="M-90 0 L-25 65 L105 -85" fill="none" stroke={color} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" {...drawn(k)} />
  </g>
);

/** A slam: the child lands from 2.2× scale over 8 frames with an expanding ring (age = frames since the slam). */
export const Slam: React.FC<{ age: number; x: number; y: number; ring?: string; size?: number; children: React.ReactNode }> = ({ age, x, y, ring = C.moonRim, size = 120, children }) => {
  if (age < 0) return null;
  const s = age < 8 ? 2.2 - 1.2 * sm(age / 8) : 1 + 0.04 * Math.max(0, 1 - (age - 8) / 6) * Math.sin(age);
  const rr = age >= 6 && age < 26 ? size * (0.6 + (age - 6) * 0.09) : 0;
  return (
    <g>
      {rr > 0 ? <circle cx={x} cy={y} r={rr} fill="none" stroke={ring} strokeWidth={6} opacity={1 - (age - 6) / 20} /> : null}
      <g transform={`translate(${x} ${y}) scale(${s.toFixed(3)}) translate(${-x} ${-y})`} opacity={Math.min(1, age / 3)}>
        {children}
      </g>
    </g>
  );
};

/** A big X drawn in two strokes (k 0..1), vermilion (the closing "no" marks only). */
export const StrikeX: React.FC<{ x: number; y: number; r: number; k: number; color?: string; width?: number }> = ({ x, y, r, k, color = C.vermilion, width = 22 }) => {
  const a = clamp01(k * 2);
  const b = clamp01(k * 2 - 1);
  return (
    <g>
      <path d={`M${x - r} ${y - r} L${x + r} ${y + r}`} fill="none" stroke="#000A10" strokeWidth={width + 8} strokeLinecap="round" opacity={0.3} {...drawn(a)} />
      <path d={`M${x - r} ${y - r} L${x + r} ${y + r}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" {...drawn(a)} />
      <path d={`M${x + r} ${y - r} L${x - r} ${y + r}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" {...drawn(b)} />
    </g>
  );
};

/** Expanding glow rings (a spreading front) from (cx, cy): one ring every `every` frames, `speed` px/f. */
export const GlowRings: React.FC<{ f: number; cx: number; cy: number; every?: number; speed?: number; maxR?: number; color: string; ry?: number; width?: number }> = ({
  f,
  cx,
  cy,
  every = 24,
  speed = 24,
  maxR = 600,
  color,
  ry = 1,
  width = 6,
}) => {
  const life = maxR / speed;
  const n = Math.ceil(life / every) + 1;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const age = mod(f - i * every, n * every);
        if (age > life) return null;
        const r = age * speed;
        return <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * ry} fill="none" stroke={color} strokeWidth={width} opacity={0.7 * (1 - age / life)} />;
      })}
    </g>
  );
};

/** A warm rock block (survey-diagram style, lit upper left) — 6-14's splitting pieces, 8-16's impactor. */
export const RockBlock: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; seed?: number }> = ({ x, y, w, h, rot = 0, seed = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={Math.min(w, h) * 0.22} fill={C.moonMid} stroke={C.moonRim} strokeWidth={3} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h * 0.34} rx={Math.min(w, h) * 0.2} fill={C.moonLit} opacity={0.75} />
    <rect x={-w / 2 + w * 0.55} y={-h / 2} width={w * 0.45} height={h} rx={Math.min(w, h) * 0.2} fill={C.moonShade} opacity={0.55} />
    {Array.from({ length: 3 }, (_, i) => (
      <circle key={i} cx={(rnd(seed * 7 + i) - 0.5) * w * 0.6} cy={(rnd(seed * 11 + i) - 0.3) * h * 0.5} r={Math.min(w, h) * (0.06 + rnd(seed * 5 + i) * 0.06)} fill={C.moonCrater} opacity={0.7} />
    ))}
  </g>
);
