// L17 package-A helpers (Cold, S01-S06 only; package B never imports this file). Small drawing pieces the seven scenes
// share plus the bespoke props of the empty city, the water, the frost, the paint, the rust and Rome. Shot bodies stay
// bespoke in each scene file (hard rule 1). No figure lives here: every number a shot draws comes from data17.ts
// (READ / assertAllowed / assertValue). No people (F1): Tick is the only figure; no health, injury or hazard imagery.
import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { Bloom, Family, Form, IF2, Metric, alpha, cutPop, labelCase, mixHex, ramp, rnd, rrect, smooth, smoothPath, type Pt } from "../../../lib/illustrated";
import { L17_COLORS, familyOf, pillFill } from "../families";
import { assertAllowed, assertValue } from "../data17";

export const C = L17_COLORS;
export const NIGHT = familyOf("night");
export const DEEP = familyOf("deep");
export const RAIN = familyOf("rain");
export const FROST = familyOf("frost");
export const RUST = familyOf("rust");
export const NOON = familyOf("noon");
export const DUSK = familyOf("dusk");
export const STUDIO = familyOf("studio");
export const CREAM = "#FFF4E0";
export const INK = C.ink;
const D2R = Math.PI / 180;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");

export const cl01 = (v: number) => Math.max(0, Math.min(1, v));
/** eased 0..1 between frames a and b */
export const ez = (f: number, a: number, b: number) => smooth(ramp(f, a, b));
/** linear 0..1 between frames a and b (constant-speed movers) */
export const lin = (f: number, a: number, b: number) => cl01((f - a) / Math.max(1, b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const wrap = (v: number, m: number) => ((v % m) + m) % m;
/** Piecewise-linear path through [frame, value] keys (constant speed between keys). */
export const path1 = (f: number, keys: [number, number][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (f <= f1) return v0 + ((v1 - v0) * (f - f0)) / Math.max(1, f1 - f0);
  }
  return keys[keys.length - 1][1];
};
/** A number rolling up to a data17 value (`end` is checked; the rolling digits in between are the odometer). */
export const rollText = (end: number, k: number, dp = 0) => {
  assertValue(end, "rollText end");
  return (end * cl01(k)).toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
};

/** A hard cut's pop (scale bump over 9 frames). */
export const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/**
 * Two phases of one shot (a storyboard PUSH or SLIDE): `a` until `at`, then `b` arrives over `dur` frames.
 * "slide" = b slides in from the right over a (a slides out left); "push" = a scales up and fades, b grows in from 0.9.
 */
export const Phase: React.FC<{ f: number; at: number; dur?: number; kind?: "slide" | "push" | "fade"; a: React.ReactNode; b: React.ReactNode }> = ({ f, at, dur = 15, kind = "slide", a, b }) => {
  const k = ez(f, at, at + dur);
  if (k <= 0) return <AbsoluteFill>{a}</AbsoluteFill>;
  if (k >= 1) return <AbsoluteFill>{b}</AbsoluteFill>;
  if (kind === "slide")
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `translateX(${(-k * 1920).toFixed(1)}px)` }}>{a}</AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateX(${((1 - k) * 1920).toFixed(1)}px)` }}>{b}</AbsoluteFill>
      </AbsoluteFill>
    );
  if (kind === "push")
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ transform: `scale(${1 + k * 0.6})`, opacity: 1 - k }}>{a}</AbsoluteFill>
        <AbsoluteFill style={{ transform: `scale(${0.9 + k * 0.1})`, opacity: k }}>{b}</AbsoluteFill>
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill>
      <AbsoluteFill>{a}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: k }}>{b}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Clip children to a rectangle. */
export const ClipBox: React.FC<{ x: number; y: number; w: number; h: number; rx?: number; children: React.ReactNode }> = ({ x, y, w, h, rx = 0, children }) => {
  const id = "cb" + sid(useId());
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={rx} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
};

/** Clip children to an arbitrary path. */
export const ClipPath: React.FC<{ d: string; children: React.ReactNode }> = ({ d, children }) => {
  const id = "cp" + sid(useId());
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// type
// ---------------------------------------------------------------------------------------------------------------
/** A metric on a soft scrim: value + unit exactly as written, numerals checked against data17 (READ entries). */
export const MetricA: React.FC<{ x: number; y: number; value: string; unit?: string; size?: number; color?: string; scrim?: string; opacity?: number; align?: "start" | "middle" | "end" }> = ({
  x,
  y,
  value,
  unit,
  size = 96,
  color = CREAM,
  scrim,
  opacity = 1,
  align = "start",
}) => {
  if (opacity <= 0.01) return null;
  assertAllowed(`${value} ${unit ?? ""}`, "package-A metric");
  const w = (value.length * 0.6 + (unit ? unit.length * 0.27 + 0.4 : 0)) * size;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g opacity={opacity}>
      {scrim ? <rect x={x0 - size * 0.35} y={y - size * 0.95} width={w + size * 0.7} height={size * 1.25} rx={size * 0.28} fill={scrim} /> : null}
      <Metric x={x + 3} y={y + 4} value={value} unit={unit} size={size} color="#020B10" align={align} />
      <Metric x={x} y={y} value={value} unit={unit} size={size} color={color} align={align} />
    </g>
  );
};

/** A plain diagram label (part of the picture, not a pill): labelCase, numerals checked. */
export const Label: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; align?: "start" | "middle" | "end"; opacity?: number; weight?: number }> = ({
  x,
  y,
  text,
  size = 22,
  color = CREAM,
  align = "middle",
  opacity = 1,
  weight,
}) => {
  if (opacity <= 0.01) return null;
  const t = assertAllowed(labelCase(text), "package-A label");
  return (
    <text x={x} y={y} textAnchor={align} opacity={opacity} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.14, fill: color, fontWeight: weight }}>
      {t}
    </text>
  );
};

/** A slam (2.2× → 1× over 6 f, then a settle) for anything: wraps children around (x, y). `age` < 0 hides it. */
export const Slam: React.FC<{ x: number; y: number; age: number; children: React.ReactNode }> = ({ x, y, age, children }) => {
  if (age < 0) return null;
  const s = age < 6 ? 2.2 - 1.2 * (age / 6) : 1 + 0.06 * Math.sin((age - 6) * 0.9) * Math.exp(-(age - 6) / 6);
  return (
    <g transform={`translate(${x} ${y}) scale(${s.toFixed(3)}) translate(${-x} ${-y})`} opacity={cl01(age / 2)}>
      {children}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// fields and floors
// ---------------------------------------------------------------------------------------------------------------
/** A flat floor band with a lit lip and a darker foot. */
export const Floor: React.FC<{ y: number; color: string; lip?: string; foot?: string; x?: number; w?: number; h?: number }> = ({ y, color, lip, foot, x = -600, w = 3120, h = 900 }) => {
  const id = "fl" + sid(useId());
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={foot ?? mixHex(color, "#000000", 0.35)} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
      {lip ? <rect x={x} y={y - 2} width={w} height={5} fill={lip} opacity={0.6} /> : null}
    </g>
  );
};

/** An arrow from (x1,y1) to (x2,y2) with a rounded shaft and a head; `grow` 0..1 extends it from the tail. */
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; width?: number; color: string; grow?: number; outline?: string }> = ({ x1, y1, x2, y2, width = 30, color, grow = 1, outline }) => {
  const g = cl01(grow);
  if (g <= 0.01) return null;
  const ex = x1 + (x2 - x1) * g;
  const ey = y1 + (y2 - y1) * g;
  const a = Math.atan2(ey - y1, ex - x1);
  const hl = width * 1.5;
  const bx = ex - Math.cos(a) * hl;
  const by = ey - Math.sin(a) * hl;
  const nx = -Math.sin(a);
  const ny = Math.cos(a);
  const head = `M${ex} ${ey} L${bx + nx * width * 1.1} ${by + ny * width * 1.1} L${bx - nx * width * 1.1} ${by - ny * width * 1.1} Z`;
  return (
    <g>
      {outline ? <line x1={x1} y1={y1} x2={bx} y2={by} stroke={outline} strokeWidth={width + 8} strokeLinecap="round" /> : null}
      {outline ? <path d={head} fill={outline} stroke={outline} strokeWidth={8} strokeLinejoin="round" /> : null}
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path d={head} fill={color} stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// shared props of package A
// ---------------------------------------------------------------------------------------------------------------
/** A thermometer: `level` 0..1 of the bulb column; a FREEZING line at `freeze`; colour cools as it falls. */
export const Thermo: React.FC<{ x: number; y: number; h?: number; level: number; freeze?: number; ink?: string; label?: boolean }> = ({ x, y, h = 360, level, freeze = 0.4, ink = INK, label = true }) => {
  const w = h * 0.12;
  const col = mixHex("#2F8FC0", C.lever, cl01((level - freeze) * 2 + 0.5));
  const top = y - h + w;
  const lv = y - w * 0.6 - (h - w * 1.6) * cl01(level);
  const fz = y - w * 0.6 - (h - w * 1.6) * freeze;
  return (
    <g>
      <rect x={x - w / 2 - 6} y={top - w / 2 - 6} width={w + 12} height={h + 12} rx={w / 2 + 6} fill={ink} opacity={0.9} />
      <rect x={x - w / 2} y={top - w / 2} width={w} height={h - w * 0.4} rx={w / 2} fill="#F4F8F0" />
      <circle cx={x} cy={y - w * 0.2} r={w * 0.95} fill={ink} />
      <circle cx={x} cy={y - w * 0.2} r={w * 0.72} fill={col} />
      <rect x={x - w * 0.22} y={lv} width={w * 0.44} height={y - w * 0.2 - lv} rx={w * 0.2} fill={col} />
      <line x1={x - w * 0.9} y1={fz} x2={x + w * 0.9} y2={fz} stroke={C.waterDeep} strokeWidth={4} />
      {label ? <Label x={x + w * 1.2} y={fz + 8} text="freezing" size={20} color={ink} align="start" /> : null}
      {Array.from({ length: 7 }, (_, i) => (
        <line key={i} x1={x + w / 2} y1={top + 20 + i * ((h - w * 2) / 7)} x2={x + w / 2 + 12} y2={top + 20 + i * ((h - w * 2) / 7)} stroke={ink} strokeWidth={3} />
      ))}
    </g>
  );
};

/** A turning wheel with `notches` (marks), a hub and an index pointer at the top; `angle` in degrees. */
export const Wheel: React.FC<{ x: number; y: number; r: number; angle: number; notches?: number; fill?: string; ink?: string; mark?: string; labels?: string[]; hot?: number[] }> = ({
  x,
  y,
  r,
  angle,
  notches = 12,
  fill = C.paper,
  ink = INK,
  mark = C.saffron,
  labels,
  hot = [],
}) => (
  <g>
    <circle cx={x + r * 0.05} cy={y + r * 0.08} r={r * 1.04} fill="#020B10" opacity={0.3} />
    <circle cx={x} cy={y} r={r * 1.04} fill={C.saffronDeep} />
    <circle cx={x} cy={y} r={r} fill={fill} />
    <g transform={`rotate(${angle.toFixed(2)} ${x} ${y})`}>
      {Array.from({ length: notches }, (_, i) => {
        const a = (i / notches) * 360 - 90;
        const c = Math.cos(a * D2R);
        const s = Math.sin(a * D2R);
        const isHot = hot.includes(i);
        return (
          <g key={i}>
            <line x1={x + c * r * 0.72} y1={y + s * r * 0.72} x2={x + c * r * 0.96} y2={y + s * r * 0.96} stroke={isHot ? mark : ink} strokeWidth={isHot ? r * 0.06 : r * 0.025} strokeLinecap="round" />
            {labels?.[i] ? (
              <text
                x={x + c * r * 0.52}
                y={y + s * r * 0.52 + r * 0.05}
                textAnchor="middle"
                transform={`rotate(${a + 90} ${x + c * r * 0.52} ${y + s * r * 0.52})`}
                style={{ fontFamily: IF2.label, fontSize: r * 0.12, letterSpacing: r * 0.01, fill: ink }}
              >
                {assertAllowed(labelCase(labels[i]), "Wheel label")}
              </text>
            ) : null}
          </g>
        );
      })}
      <line x1={x} y1={y} x2={x} y2={y - r * 0.4} stroke={ink} strokeWidth={r * 0.05} strokeLinecap="round" />
    </g>
    <circle cx={x} cy={y} r={r * 0.1} fill={ink} />
    <path d={`M${x} ${y - r * 1.02} l${-r * 0.09} ${-r * 0.16} h${r * 0.18} Z`} fill={ink} />
  </g>
);

/** A flip calendar on a small stand: `page` (float) counts pages flipped; the current one swings down at 30-40 px/f. */
export const FlipCalendar: React.FC<{ x: number; y: number; w?: number; page: number; words: string[]; ink?: string; paper?: string; band?: string; cross?: number[] }> = ({
  x,
  y,
  w = 220,
  page,
  words,
  ink = INK,
  paper = C.paper,
  band = C.saffron,
  cross = [],
}) => {
  const h = w * 0.9;
  const i = Math.max(0, Math.floor(page));
  const k = page - i;
  const cur = words[Math.min(words.length - 1, i)];
  const next = words[Math.min(words.length - 1, i + 1)];
  const sheet = (word: string, sy: number, op = 1) => (
    <g opacity={op}>
      <rect x={x - w / 2} y={y - h} width={w} height={h * sy} rx={10} fill={paper} />
      <rect x={x - w / 2} y={y - h} width={w} height={h * 0.2} rx={10} fill={band} opacity={0.85} />
      {sy > 0.55 ? (
        <text x={x} y={y - h * 0.32} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: w * (word.length > 6 ? 0.17 : 0.24), fill: ink }}>
          {assertAllowed(labelCase(word), "calendar")}
        </text>
      ) : null}
    </g>
  );
  return (
    <g>
      <line x1={x - w * 0.3} y1={y} x2={x - w * 0.45} y2={y + h * 0.5} stroke={ink} strokeWidth={8} strokeLinecap="round" />
      <line x1={x + w * 0.3} y1={y} x2={x + w * 0.45} y2={y + h * 0.5} stroke={ink} strokeWidth={8} strokeLinecap="round" />
      <rect x={x - w / 2 + 8} y={y - h + 10} width={w} height={h} rx={10} fill="#020B10" opacity={0.3} />
      {sheet(next, 1)}
      {/* the flipping page: folds up over the top bar */}
      <g transform={`translate(0 ${(y - h).toFixed(1)}) scale(1 ${(1 - 2 * k).toFixed(3)}) translate(0 ${(-(y - h)).toFixed(1)})`}>{k < 0.5 ? sheet(cur, 1) : null}</g>
      {cross.map((c, j) =>
        c > 0 ? (
          <g key={j}>
            <line x1={x - w * 0.36} y1={y - h * 0.68} x2={x - w * 0.36 + w * 0.72 * cl01(c)} y2={y - h * 0.68 + h * 0.6 * cl01(c)} stroke={ink} strokeWidth={12} strokeLinecap="round" />
          </g>
        ) : null,
      )}
      {[0.25, 0.5, 0.75].map((p) => (
        <circle key={p} cx={x - w / 2 + w * p} cy={y - h + 4} r={7} fill={ink} />
      ))}
    </g>
  );
};

/** A stone-block wall face (lit top-left, cold shadows): `seed` varies the joints; children draw on top (cracks). */
export const StoneWall: React.FC<{ x: number; y: number; w: number; h: number; rows?: number; seed?: number; fill: string; joint: string; lit: string; shade: string; children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  rows = 4,
  seed = 1,
  fill,
  joint,
  lit,
  shade,
  children,
}) => {
  const rh = h / rows;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={joint} />
      {Array.from({ length: rows }, (_, r) => {
        let bx = x - rnd(seed * 31 + r) * 160 - (r % 2) * 90;
        const out: React.ReactNode[] = [];
        let i = 0;
        while (bx < x + w) {
          const bw = 220 + rnd(seed * 17 + r * 7 + i) * 160;
          const tone = mixHex(fill, rnd(seed * 3 + r * 11 + i) > 0.5 ? lit : shade, 0.12 + rnd(seed * 5 + i + r) * 0.18);
          const d = rrect(bx + 5, y + r * rh + 5, bw - 10, rh - 10, 14);
          out.push(<Form key={i} d={d} fill={tone} light={225} shadow={shade} shadowOpacity={0.45} inset={10} rim={lit} rimOpacity={0.55} hard />);
          bx += bw;
          i++;
        }
        return <g key={r}>{out}</g>;
      })}
      {children}
    </g>
  );
};

/** A box tower (our built stuff, "the city stack"): stacked rounded boxes with amber window dots, slight sway. */
export const BoxStack: React.FC<{ x: number; base: number; w: number; n: number; f: number; seed?: number; sway?: number; tone?: string; drop?: number; lit?: number; boxH?: number }> = ({
  x,
  base,
  w,
  n,
  f,
  seed = 1,
  sway = 0,
  tone = "#2F6F80",
  drop = 0,
  lit = 1,
  boxH = 90,
}) => {
  const out: React.ReactNode[] = [];
  let yy = base;
  for (let i = 0; i < Math.ceil(n); i++) {
    const frac = i === Math.floor(n) ? n - i : 1;
    const bw = w * (0.74 + rnd(seed * 7 + i) * 0.26);
    const bh = boxH * (0.8 + rnd(seed * 13 + i) * 0.5);
    const sx = Math.sin(f / 23 + i * 0.4) * sway * (i / 10);
    const off = (rnd(seed * 3 + i) - 0.5) * w * 0.16 + sx;
    const dy = frac < 1 ? -(1 - frac) * drop : 0;
    const by = yy - bh + dy;
    const col = mixHex(tone, i % 3 === 0 ? "#E3813F" : i % 3 === 1 ? "#26525F" : "#5A6E72", 0.35);
    out.push(
      <g key={i} opacity={frac < 1 ? cl01(frac * 3) : 1}>
        <Form d={rrect(x - bw / 2 + off, by, bw, bh - 4, 8)} fill={col} light={225} shadow="#06151D" shadowOpacity={0.55} inset={10} rim="#FFE6C0" rimOpacity={0.5} hard />
        {Array.from({ length: Math.max(2, Math.floor(bw / 34)) }, (_, k) =>
          rnd(seed * 19 + i * 5 + k) < lit ? <rect key={k} x={x - bw / 2 + off + 14 + k * 34} y={by + bh * 0.3} width={14} height={bh * 0.3} rx={3} fill={C.amber} opacity={0.9} /> : null,
        )}
      </g>,
    );
    yy -= bh;
  }
  return <g>{out}</g>;
};

/** A pylon (lattice tower) silhouette with two cross-arms; wire attach points returned via `pylonArms`. */
export const pylonArms = (x: number, base: number, h: number): Pt[] => [
  [x - h * 0.22, base - h * 0.82],
  [x + h * 0.22, base - h * 0.82],
  [x - h * 0.16, base - h * 0.64],
  [x + h * 0.16, base - h * 0.64],
];
export const Pylon: React.FC<{ x: number; base: number; h: number; ink?: string; lit?: string }> = ({ x, base, h, ink = "#0A222B", lit = "#3F7F8E" }) => {
  const w = h * 0.2;
  const top = base - h;
  const L = (k: number) => x - w / 2 + (w / 2 - h * 0.02) * k;
  const R = (k: number) => x + w / 2 - (w / 2 - h * 0.02) * k;
  const ys = [0, 0.2, 0.4, 0.58, 0.72, 0.86, 1];
  return (
    <g stroke={ink} strokeLinecap="round" fill="none">
      <path d={`M${x - w / 2} ${base} L${x - h * 0.02} ${top} L${x + h * 0.02} ${top} L${x + w / 2} ${base}`} strokeWidth={h * 0.016} />
      {ys.slice(0, -1).map((k, i) => {
        const y0 = base - h * k;
        const y1 = base - h * ys[i + 1];
        return (
          <g key={i} strokeWidth={h * 0.007}>
            <line x1={L(k)} y1={y0} x2={R(ys[i + 1])} y2={y1} />
            <line x1={R(k)} y1={y0} x2={L(ys[i + 1])} y2={y1} />
          </g>
        );
      })}
      <line x1={x - h * 0.24} y1={base - h * 0.82} x2={x + h * 0.24} y2={base - h * 0.82} strokeWidth={h * 0.014} />
      <line x1={x - h * 0.18} y1={base - h * 0.64} x2={x + h * 0.18} y2={base - h * 0.64} strokeWidth={h * 0.014} />
      <path d={`M${x - w / 2 + 4} ${base} L${x - h * 0.02 + 2} ${top}`} stroke={lit} strokeWidth={h * 0.005} opacity={0.6} />
    </g>
  );
};

/** A sagging wire from a to b with light pulses running along it (`speed` px/f) and a glow `lit` 0..1 that drains from b. */
export const Wire: React.FC<{ a: Pt; b: Pt; f: number; sag?: number; speed?: number; lit?: number; color?: string; pulse?: string; seed?: number; ink?: string }> = ({
  a,
  b,
  f,
  sag = 60,
  speed = 30,
  lit = 1,
  color = C.amber,
  pulse = C.saffronCore,
  seed = 1,
  ink = "#071A22",
}) => {
  const mid: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag];
  const at = (t: number): Pt => [
    (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * mid[0] + t * t * b[0],
    (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * mid[1] + t * t * b[1],
  ];
  const d = `M${a[0]} ${a[1]} Q${mid[0]} ${mid[1]} ${b[0]} ${b[1]}`;
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + sag;
  const L = cl01(lit);
  return (
    <g>
      <path d={d} fill="none" stroke={ink} strokeWidth={5} />
      {L > 0 ? <path d={d} fill="none" stroke={color} strokeWidth={4} opacity={0.75} strokeDasharray={`${len * L} ${len * 2}`} /> : null}
      {L > 0 ? <path d={d} fill="none" stroke={color} strokeWidth={14} opacity={0.18} strokeDasharray={`${len * L} ${len * 2}`} /> : null}
      {L > 0
        ? [0, 0.33, 0.66].map((o, i) => {
            const t = wrap((f * speed) / len + o + rnd(seed + i) * 0.1, 1);
            if (t > L) return null;
            const [px, py] = at(t);
            return (
              <g key={i}>
                <circle cx={px} cy={py} r={20} fill={pulse} opacity={0.25} />
                <circle cx={px} cy={py} r={8} fill={pulse} />
              </g>
            );
          })
        : null}
    </g>
  );
};

/** A gauge dial with a needle (`angle` deg from straight up), title under it; for SUPPLY / DEMAND and the desk wall. */
export const Gauge: React.FC<{ x: number; y: number; r: number; angle: number; title?: string; face?: string; ink?: string; needle?: string; glow?: number }> = ({
  x,
  y,
  r,
  angle,
  title,
  face = C.paper,
  ink = INK,
  needle = C.vermilion,
  glow = 0,
}) => {
  const a = (angle - 90) * D2R;
  return (
    <g>
      {glow > 0 ? <Bloom x={x} y={y} r={r * 1.8} color={C.amber} strength={0.5 * glow} /> : null}
      <circle cx={x + r * 0.05} cy={y + r * 0.08} r={r * 1.08} fill="#020B10" opacity={0.35} />
      <circle cx={x} cy={y} r={r * 1.08} fill={C.saffronDeep} />
      <circle cx={x} cy={y} r={r * 1.03} fill={C.saffron} />
      <circle cx={x} cy={y} r={r * 0.95} fill={face} />
      {Array.from({ length: 11 }, (_, i) => {
        const t = (-120 + i * 24 - 90) * D2R;
        return <line key={i} x1={x + Math.cos(t) * r * 0.7} y1={y + Math.sin(t) * r * 0.7} x2={x + Math.cos(t) * r * 0.86} y2={y + Math.sin(t) * r * 0.86} stroke={ink} strokeWidth={i % 5 === 0 ? r * 0.04 : r * 0.02} strokeLinecap="round" />;
      })}
      <line x1={x - Math.cos(a) * r * 0.14} y1={y - Math.sin(a) * r * 0.14} x2={x + Math.cos(a) * r * 0.78} y2={y + Math.sin(a) * r * 0.78} stroke={needle} strokeWidth={r * 0.06} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.09} fill={needle} />
      {title ? <Label x={x} y={y + r * 1.45} text={title} size={Math.max(18, r * 0.2)} color={face === C.paper ? CREAM : ink} /> : null}
    </g>
  );
};

/** A barrel (the pump's water, carried out). */
export const Barrel: React.FC<{ x: number; y: number; s?: number; fill?: string }> = ({ x, y, s = 1, fill = "#2F8FB0" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Form d={rrect(-32, -44, 64, 88, 18)} fill={fill} light={225} shadow="#0C0405" shadowOpacity={0.5} inset={8} rim="#BFF0F2" rimOpacity={0.6} hard />
    <rect x={-34} y={-24} width={68} height={6} rx={3} fill={C.saffronDeep} />
    <rect x={-34} y={18} width={68} height={6} rx={3} fill={C.saffronDeep} />
  </g>
);

/** A big lattice tower (generic, clean line art, no colour claim and no insignia: F7). Centre x, base y, height h. */
export const LatticeTower: React.FC<{ x: number; base: number; h: number; ink?: string; fill?: string; reveal?: number; strokeK?: number }> = ({ x, base, h, ink = "#3A3020", fill = "#C9A27A", reveal = 1, strokeK = 1 }) => {
  const s = h / 100;
  const P = (px: number, py: number) => `${(x + px * s).toFixed(1)} ${(base - py * s).toFixed(1)}`;
  const leg = (dir: 1 | -1) =>
    `M${P(dir * 34, 0)} Q${P(dir * 18, 22)} ${P(dir * 11, 40)} L${P(dir * 6, 62)} L${P(dir * 2.4, 88)} L${P(dir * 0.8, 100)}`;
  const inner = (dir: 1 | -1) => `M${P(dir * 24, 0)} Q${P(dir * 13, 20)} ${P(dir * 8, 40)} L${P(dir * 4, 62)} L${P(dir * 1.6, 88)}`;
  const halfAt = (py: number) => (py < 40 ? 34 - (34 - 11) * Math.sqrt(py / 40) : py < 62 ? 11 - (5 * (py - 40)) / 22 : 6 - (3.6 * (py - 62)) / 26);
  const ys = Array.from({ length: 22 }, (_, i) => (i / 21) * 96);
  const sw = Math.max(1.2, 0.5 * s) * strokeK;
  const clipY = base - h * 1.05 * cl01(reveal);
  return (
    <ClipBox x={x - h} y={clipY} w={h * 2} h={base - clipY + 10}>
      <g fill="none" stroke={ink} strokeLinejoin="round" strokeLinecap="round">
        {/* the arch between the legs and the faint leg fill */}
        <path d={`M${P(-34, 0)} Q${P(-18, 22)} ${P(-11, 40)} L${P(11, 40)} Q${P(18, 22)} ${P(34, 0)} L${P(22, 0)} Q${P(0, 30)} ${P(-22, 0)} Z`} fill={alpha(fill, 0.35)} stroke="none" />
        <path d={leg(-1)} strokeWidth={sw * 2.4} />
        <path d={leg(1)} strokeWidth={sw * 2.4} />
        <path d={inner(-1)} strokeWidth={sw * 1.4} />
        <path d={inner(1)} strokeWidth={sw * 1.4} />
        <path d={`M${P(-22, 0)} Q${P(0, 30)} ${P(22, 0)}`} strokeWidth={sw * 1.8} />
        {ys.map((py, i) => {
          if (i === ys.length - 1) return null;
          const a = halfAt(py);
          const b = halfAt(ys[i + 1]);
          const ia = a * 0.7;
          const ib = b * 0.7;
          return (
            <g key={i} strokeWidth={sw * 0.8}>
              <line x1={x - a * s} y1={base - py * s} x2={x - ib * s} y2={base - ys[i + 1] * s} />
              <line x1={x - ia * s} y1={base - py * s} x2={x - b * s} y2={base - ys[i + 1] * s} />
              <line x1={x + a * s} y1={base - py * s} x2={x + ib * s} y2={base - ys[i + 1] * s} />
              <line x1={x + ia * s} y1={base - py * s} x2={x + b * s} y2={base - ys[i + 1] * s} />
            </g>
          );
        })}
        {/* the two platforms */}
        <rect x={x - 13.5 * s} y={base - 41.5 * s} width={27 * s} height={3 * s} fill={fill} strokeWidth={sw * 1.4} />
        <rect x={x - 7.5 * s} y={base - 63.5 * s} width={15 * s} height={2.4 * s} fill={fill} strokeWidth={sw * 1.4} />
        <line x1={x} y1={base - 100 * s} x2={x} y2={base - 106 * s} strokeWidth={sw * 1.6} />
      </g>
    </ClipBox>
  );
};

/** A diamond-braced lattice panel (the beam / joint close-up and the 3-12 morph). */
export const LatticePanel: React.FC<{ x: number; y: number; w: number; h: number; cells?: number; ink?: string; width?: number; fill?: string }> = ({ x, y, w, h, cells = 6, ink = "#3A3020", width = 14, fill }) => {
  const cw = w / cells;
  return (
    <g fill="none" stroke={ink} strokeLinecap="round">
      {fill ? <rect x={x} y={y} width={w} height={h} fill={fill} stroke="none" /> : null}
      <line x1={x} y1={y} x2={x + w} y2={y} strokeWidth={width * 1.6} />
      <line x1={x} y1={y + h} x2={x + w} y2={y + h} strokeWidth={width * 1.6} />
      {Array.from({ length: cells }, (_, i) => (
        <g key={i} strokeWidth={width}>
          <line x1={x + i * cw} y1={y} x2={x + (i + 1) * cw} y2={y + h} />
          <line x1={x + (i + 1) * cw} y1={y} x2={x + i * cw} y2={y + h} />
          <line x1={x + i * cw} y1={y} x2={x + i * cw} y2={y + h} strokeWidth={width * 0.7} />
        </g>
      ))}
      {Array.from({ length: cells * 2 + 1 }, (_, i) => (
        <circle key={i} cx={x + (i * w) / (cells * 2)} cy={i % 2 ? y + h : y} r={width * 0.45} fill={ink} stroke="none" />
      ))}
    </g>
  );
};

/** A concrete block in section with a grid of steel bars (round ends) and a sweeping glint `glint` x (px). */
export const RebarBlock: React.FC<{ x: number; y: number; w: number; h: number; bars?: number; glint?: number; concrete?: string; steel?: string; rust?: number[]; seed?: number }> = ({
  x,
  y,
  w,
  h,
  bars = 3,
  glint,
  concrete = C.concrete,
  steel = C.steel,
  rust = [],
  seed = 1,
}) => {
  const ys = Array.from({ length: bars }, (_, i) => y + ((i + 1) * h) / (bars + 1));
  return (
    <g>
      <Form d={rrect(x, y, w, h, 18)} fill={concrete} light={225} shadow="#5A3A20" shadowOpacity={0.5} inset={20} rim="#FFF6E6" rimOpacity={0.6} bounce={C.amberDeep} hard />
      {Array.from({ length: 46 }, (_, i) => (
        <circle key={i} cx={x + 20 + rnd(seed * 7 + i) * (w - 40)} cy={y + 20 + rnd(seed * 11 + i) * (h - 40)} r={3 + rnd(seed * 3 + i) * 6} fill={mixHex(concrete, i % 2 ? "#FFF6E6" : "#6A5030", 0.3)} />
      ))}
      {ys.map((by, i) => {
        const r = cl01(rust[i] ?? 0);
        return (
          <g key={i}>
            <rect x={x + 30} y={by - 16} width={w - 60} height={32} rx={16} fill={mixHex(steel, C.rust, r)} />
            <rect x={x + 30} y={by - 16} width={w - 60} height={9} rx={4} fill={mixHex("#CFE6EA", C.lever, r)} opacity={0.6} />
            {Array.from({ length: Math.floor((w - 60) / 46) }, (_, k) => (
              <line key={k} x1={x + 50 + k * 46} y1={by - 16} x2={x + 62 + k * 46} y2={by + 16} stroke={mixHex("#3A4A50", "#5A2008", r)} strokeWidth={4} opacity={0.6} />
            ))}
            {glint !== undefined && glint > x && glint < x + w ? (
              <g>
                <ellipse cx={glint} cy={by - 6} rx={60} ry={10} fill="#FFFFFF" opacity={0.55 * (1 - r)} />
                <ellipse cx={glint} cy={by - 6} rx={18} ry={6} fill="#FFFFFF" opacity={0.9 * (1 - r)} />
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

/** A rusted bar segment: a bar of length `w` with a rust swelling `swell` 0..1 (it grows thicker and sheds scale). */
export const RustBar: React.FC<{ x: number; y: number; w: number; swell: number; f: number; seed?: number }> = ({ x, y, w, swell, f, seed = 1 }) => {
  const s = cl01(swell);
  const th = 32 + 34 * s;
  const pts: Pt[] = [];
  for (let i = 0; i <= 20; i++) pts.push([x + (w * i) / 20, y - th / 2 - Math.sin(i * 1.7 + seed) * 6 * s]);
  for (let i = 20; i >= 0; i--) pts.push([x + (w * i) / 20, y + th / 2 + Math.sin(i * 2.3 + seed) * 6 * s]);
  return (
    <g>
      <path d={smoothPath(pts) + " Z"} fill={mixHex(C.steel, C.rust, 0.3 + 0.7 * s)} stroke="#3A1208" strokeWidth={3} />
      <path d={smoothPath(pts.slice(0, 21))} fill="none" stroke={C.lever} strokeWidth={6} opacity={0.7} />
      {Array.from({ length: 14 }, (_, i) => {
        const t = wrap(f * 0.012 + rnd(seed * 9 + i), 1);
        const px = x + rnd(seed * 5 + i) * w;
        const py = y - th / 2 - t * 90 * s;
        return <rect key={i} x={px} y={py} width={10 + 8 * rnd(i)} height={6} rx={2} fill={i % 2 ? C.rust : C.lever} opacity={s * (1 - t)} transform={`rotate(${(i * 37 + f * 3) % 360} ${px} ${py})`} />;
      })}
    </g>
  );
};

/** A generic domed building (no name, F3): drum, colonnaded portico, round dome; `sun` shades it from the right. */
export const DomeHall: React.FC<{ x: number; base: number; w: number; fill?: string; shade?: string; lit?: string; seed?: number }> = ({ x, base, w, fill = "#F4E6C8", shade = "#C9A27A", lit = "#FFF8E8" }) => {
  const h = w * 0.62;
  const drumW = w * 0.62;
  const drumY = base - h * 0.56;
  const domeR = drumW * 0.5;
  const cols = 8;
  return (
    <g>
      <ellipse cx={x} cy={base + 6} rx={w * 0.62} ry={18} fill="#1F4F4C" opacity={0.25} />
      {/* drum */}
      <Form d={rrect(x - drumW / 2, drumY, drumW, base - drumY, 6)} fill={fill} light={315} shadow={shade} shadowOpacity={0.55} inset={24} rim={lit} hard />
      {/* dome */}
      <Form d={`M${x - domeR} ${drumY} A${domeR} ${domeR * 0.86} 0 0 1 ${x + domeR} ${drumY} Z`} fill={mixHex(fill, "#E0D0A8", 0.3)} light={315} shadow={shade} shadowOpacity={0.6} inset={30} rim={lit} hard />
      {Array.from({ length: 7 }, (_, i) => {
        const a = Math.PI * (0.15 + (i / 6) * 0.7);
        return <path key={i} d={`M${x - Math.cos(a) * domeR} ${drumY - 2} Q${x - Math.cos(a) * domeR * 0.7} ${drumY - domeR * 0.7} ${x} ${drumY - domeR * 0.86}`} fill="none" stroke={shade} strokeWidth={3} opacity={0.5} />;
      })}
      <rect x={x - domeR * 0.12} y={drumY - domeR * 0.98} width={domeR * 0.24} height={domeR * 0.14} rx={4} fill={lit} />
      {/* portico */}
      <Form d={`M${x - w / 2} ${base - h * 0.36} L${x} ${base - h * 0.56} L${x + w / 2} ${base - h * 0.36} Z`} fill={fill} light={315} shadow={shade} shadowOpacity={0.5} inset={12} rim={lit} hard />
      <rect x={x - w / 2} y={base - h * 0.36} width={w} height={h * 0.05} fill={mixHex(fill, shade, 0.3)} />
      {Array.from({ length: cols }, (_, i) => {
        const cx = x - w / 2 + w * 0.06 + (i * (w * 0.88)) / (cols - 1);
        return <Form key={i} d={rrect(cx - w * 0.022, base - h * 0.31, w * 0.044, h * 0.31, 4)} fill={lit} light={315} shadow={shade} shadowOpacity={0.6} inset={6} hard />;
      })}
      <rect x={x - w / 2 - 10} y={base - 14} width={w + 20} height={14} fill={mixHex(fill, shade, 0.4)} />
    </g>
  );
};

/** A plain modern building (our fallen wall / the folding block): concrete slabs + dark windows (never lit, 5-08). */
export const Block: React.FC<{ x: number; base: number; w: number; h: number; floors?: number; fill?: string; win?: string; edge?: string }> = ({ x, base, w, h, floors = 8, fill = "#26525F", win = "#06151D", edge = "#5FA0A8" }) => {
  const fh = h / floors;
  return (
    <g>
      <rect x={x} y={base - h} width={w} height={h} fill={fill} />
      <rect x={x} y={base - h} width={8} height={h} fill={edge} opacity={0.5} />
      {Array.from({ length: floors }, (_, i) => (
        <g key={i}>
          <rect x={x} y={base - (i + 1) * fh} width={w} height={6} fill={edge} opacity={0.4} />
          {Array.from({ length: Math.floor(w / 60) }, (_, k) => (
            <rect key={k} x={x + 18 + k * 60} y={base - (i + 1) * fh + 18} width={30} height={fh - 34} rx={3} fill={win} />
          ))}
        </g>
      ))}
    </g>
  );
};

/** A small tool held at a hand: hammer, clipboard, loupe, brush, staff tip. (Positions: kit Tick hand targets × pxPerM/100.) */
export const handAt = (x: number, y: number, pxPerM: number, facing: 1 | -1, local: Pt): Pt => [x + facing * local[0] * (pxPerM / 100), y + local[1] * (pxPerM / 100)];
export const Hammer: React.FC<{ x: number; y: number; s: number; angle?: number }> = ({ x, y, s, angle = -30 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
    <rect x={-3} y={-34} width={6} height={40} rx={3} fill="#7A4A20" />
    <rect x={-14} y={-44} width={28} height={13} rx={3} fill="#5A6E72" />
  </g>
);
export const Clipboard: React.FC<{ x: number; y: number; s: number; angle?: number }> = ({ x, y, s, angle = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
    <rect x={-26} y={-34} width={52} height={66} rx={5} fill="#C98A2E" />
    <rect x={-21} y={-26} width={42} height={54} rx={3} fill={C.paper} />
    <rect x={-10} y={-38} width={20} height={9} rx={3} fill="#5A6E72" />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={-15} y={-16 + i * 13} width={30 - i * 6} height={4} rx={2} fill="#4F6E7A" />
    ))}
  </g>
);
export const Loupe: React.FC<{ x: number; y: number; r: number; children?: React.ReactNode }> = ({ x, y, r, children }) => {
  const id = "lp" + sid(useId());
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
      </defs>
      <circle cx={x + 6} cy={y + 10} r={r + 12} fill="#020B10" opacity={0.25} />
      <g clipPath={`url(#${id})`}>{children}</g>
      <circle cx={x} cy={y} r={r} fill="#BFF0F2" opacity={0.12} />
      <circle cx={x} cy={y} r={r} fill="none" stroke="#3A3020" strokeWidth={r * 0.12} />
      <circle cx={x} cy={y} r={r * 0.94} fill="none" stroke="#FFE6A8" strokeWidth={r * 0.03} opacity={0.7} />
      <line x1={x + r * 0.72} y1={y + r * 0.72} x2={x + r * 1.5} y2={y + r * 1.5} stroke="#3A3020" strokeWidth={r * 0.2} strokeLinecap="round" />
    </g>
  );
};

/** A plain pill for words on the family's own pill fill (numerals checked). */
export const PillA: React.FC<{ x: number; y: number; text: string; F: Family; dot?: string; size?: number; align?: "start" | "middle" | "end"; opacity?: number; ink?: string }> = ({
  x,
  y,
  text,
  F,
  dot,
  size = 26,
  align = "start",
  opacity = 1,
  ink = CREAM,
}) => {
  if (opacity <= 0.01) return null;
  const t = assertAllowed(labelCase(text), "package-A pill");
  const w = t.length * size * 0.62 + size * (dot ? 2.4 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g opacity={opacity}>
      <rect x={x0 + 2} y={y - h / 2 + 4} width={w} height={h} rx={h / 2} fill="#020B10" opacity={0.3} />
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={pillFill(F)} stroke={alpha(CREAM, 0.35)} strokeWidth={2} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.12, fill: ink }}>
        {t}
      </text>
    </g>
  );
};
