// Package B helpers (S07, S08, S09, S10, Closer only; BUILD.md §6). Bespoke pieces the five scene files share; the
// episode's shared pieces live in families.ts, data17.ts, ladder.tsx, rig.tsx, stamps17.tsx, city.tsx, movers17.tsx,
// icons17.tsx (never edited here). Package A's a-parts.tsx is never imported (BUILD.md §1).
// Every numeral that reaches the screen goes through data17.ts (assertAllowed / assertValue).
// USAGE (f = the shot's frame)
//   ez(f, a, b) / lin(f, a, b) / path1(f, keys)   eased / linear 0..1 between frames; piecewise-linear keys
//   <Pop f>                       a hard cut's scale pop
//   <FamSky name />               a family's sky, oversized for drift
//   <StudioCyc f floor? />        STUDIO_SET cyc + CycClouds + an ochre floor (the plates; never bone outside scene 10)
//   <RollDec x y value k unit />  a one-decimal readout rolling to a data17 value (3.3, 1.8: Counter has no decimals)
//   <RollInt x y value k unit />  an integer readout rolling (Counter) to a data17 value
//   <Num x y text />              a fixed readout string (asserted), units in their own case
//   <Tag x y text F />            a kit Pill on the family's pill fill (asserted)
//   <Label x y text />            a diagram label (asserted, no pill)
//   <TextPlate x y w h />         a dark rounded plate behind a readout
//   <Rings f cx cy … />           rings launched every `every` frames
//   <Wind f … />                  wind streaks (Earth only, never on the Moon: F6)
//   <Strata x0 x1 y0 y1 scroll palette band? />   mud / rock layers in content coords, sliding with `scroll`
//   <Cliff x y w h worn ghost />  the granite cliff with four stylised, unnamed carved heads (F1, F8: no likeness)
//   <MoonGround … /> <Prints … /> <RigidFlag … /> <Earth … /> <Meteor … /> <Lander … />   the Moon set (F6)
//   <Animal kind x y size f />    elk · roe · red · boar · wolf: stylised quadrupeds with a trot cycle (no birds, F5)
//   <House x y size lit />        a small house icon with amber windows (Chernobyl grid: no people, F10)
//   <AirDial x y r value />       the AIR plate (no numerals): cool teal → warm amber
//   <Slam age>children</Slam>     scale 2.2 → 1 over 6 frames + a ring
//   drawn(d, k)                   stroke-dash props drawing a path to fraction k (pathLength 1)
//   rungY(y0, y1, i)              TimeLadder's rung y (same formula), for icons and stamps beside a rung
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bloom, Counter, CycClouds, Family, IF2, Layer, Pill, STUDIO_SET, Sky, alpha, cutPop, labelCase, mixHex, rnd } from "../../../lib/illustrated";
import { L17_COLORS, STAR_TINTS, familyOf, pillFill, type L17FamilyName } from "../families";
import { assertAllowed, assertValue } from "../data17";
import { PrintIcon, StoneIcon } from "../icons17";

export const C = L17_COLORS;
export const CREAM = "#FFF4E0";
export const INK = C.ink;
export const STUDIO: Family = familyOf("studio");
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const mod = (a: number, n: number) => ((a % n) + n) % n;
const sm = (u: number) => {
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
/** stroke props that draw a path to fraction k (the path needs pathLength={1}) */
export const drawn = (k: number) => ({ pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - clamp01(k) });
/** TimeLadder's rung y (ladder.tsx formula, rung 0 = DAY at the bottom) */
export const rungY = (y0: number, y1: number, i: number) => {
  const gap = (y1 - y0) / (9 - 1 + 0.6);
  return y1 - gap * 0.3 - i * gap;
};

/** A hard cut's pop (scale bump over 9 frames). */
export const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/** A family's sky, oversized so the camera drift never shows an edge. */
export const FamSky: React.FC<{ name: L17FamilyName; angle?: number }> = ({ name, angle = 90 }) => <Sky family={familyOf(name)} x={-900} y={-900} w={3720} h={2880} angle={angle} />;

/** The studio cyclorama (STUDIO_SET, teal) with sliding cut-out clouds and a warm ochre floor. */
export const StudioCyc: React.FC<{ f: number; floor?: number; seed?: number; clouds?: number }> = ({ f, floor = 900, seed = 3, clouds = 4 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={STUDIO_SET} x={-900} y={-900} w={3720} h={2880} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f * 1.3} y={90} n={clouds} seed={seed} />
    </Layer>
    <Layer depth={0.6}>
      <rect x={-1400} y={floor - 20} width={4800} height={1600} fill={STUDIO_SET.mid} />
      <rect x={-1400} y={floor - 20} width={4800} height={14} fill={mixHex(STUDIO_SET.mid, "#FFF4DE", 0.45)} />
      <rect x={-1400} y={floor + 80} width={4800} height={1600} fill={STUDIO_SET.near} opacity={0.45} />
    </Layer>
  </>
);

/** An oversized radial gradient field (`id` unique in the shot). */
export const RadialField: React.FC<{ cx: number; cy: number; r?: number; stops: [number, string][]; id: string }> = ({ cx, cy, r = 1400, stops, id }) => (
  <g>
    <defs>
      <radialGradient id={id} cx={cx} cy={cy} r={r} gradientUnits="userSpaceOnUse">
        {stops.map(([o, c], i) => (
          <stop key={i} offset={o} stopColor={c} />
        ))}
      </radialGradient>
    </defs>
    <rect x={-1200} y={-1200} width={4320} height={3480} fill={`url(#${id})`} />
  </g>
);

const numStyle = (size: number, color: string): React.CSSProperties => ({ fontFamily: IF2.num, fontWeight: 800, fontSize: size, fill: color, fontVariantNumeric: "tabular-nums", letterSpacing: -size * 0.02 });

/** One-decimal readout rolling 0 → value (a data17 value), the unit as its own span (asserted). */
export const RollDec: React.FC<{ x: number; y: number; value: number; k: number; unit?: string; size?: number; color?: string; unitColor?: string; who?: string; align?: "start" | "middle" }> = ({
  x,
  y,
  value,
  k,
  unit,
  size = 96,
  color = CREAM,
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

/** Integer readout rolling 0 → value (an odometer Counter), the unit after it (asserted). */
export const RollInt: React.FC<{ x: number; y: number; value: number; k: number; unit?: string; size?: number; color?: string; unitColor?: string; who?: string }> = ({
  x,
  y,
  value,
  k,
  unit,
  size = 96,
  color = CREAM,
  unitColor,
  who = "RollInt",
}) => {
  assertValue(value, who);
  if (unit) assertAllowed(unit, who);
  const t = clamp01(k);
  const digits = value.toLocaleString("en-US");
  const numW = digits.replace(/,/g, "").length * size * 0.6 + (digits.match(/,/g)?.length ?? 0) * size * 0.22;
  return (
    <g>
      <Counter x={x} y={y} value={t >= 1 ? value : Math.floor(value * t)} max={value} size={size} color={color} align="start" />
      {unit ? (
        <text x={x + numW + size * 0.18} y={y} style={{ fontFamily: IF2.num, fontWeight: 600, fontSize: size * 0.42, fill: unitColor ?? color }}>
          {unit}
        </text>
      ) : null}
    </g>
  );
};

/** A fixed readout string (asserted), Inter 800, units kept in their own case (no labelCase). */
export const Num: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; align?: "start" | "middle" | "end"; who?: string; opacity?: number }> = ({
  x,
  y,
  text,
  size = 72,
  color = CREAM,
  align = "start",
  who = "Num",
  opacity = 1,
}) => {
  assertAllowed(text, who);
  return (
    <text x={x} y={y} textAnchor={align} opacity={opacity} style={numStyle(size, color)}>
      {text}
    </text>
  );
};

/** A kit Pill on the family's pill fill, text asserted. */
export const Tag: React.FC<{ x: number; y: number; text: string; F: Family; size?: number; appear?: number; dot?: string; align?: "start" | "middle" | "end"; color?: string; fill?: string }> = ({
  x,
  y,
  text,
  F,
  size = 26,
  appear = 1,
  dot,
  align = "start",
  color,
  fill,
}) => {
  assertAllowed(text, "Tag");
  const a = sm(appear);
  if (a <= 0) return null;
  return (
    <g opacity={a} transform={`translate(0 ${((1 - a) * 16).toFixed(1)})`}>
      <Pill x={x} y={y} text={text} fill={fill ?? pillFill(F)} color={color ?? (F.dark ? CREAM : "#FFF8EC")} dot={dot} size={size} align={align} />
    </g>
  );
};

/** A diagram label (asserted), label font, upper-case. */
export const Label: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; align?: "start" | "middle" | "end"; opacity?: number; spacing?: number; weight?: number }> = ({
  x,
  y,
  text,
  size = 26,
  color = CREAM,
  align = "start",
  opacity = 1,
  spacing,
  weight,
}) => {
  const t = labelCase(text);
  assertAllowed(t, "Label");
  return (
    <text x={x} y={y} textAnchor={align} opacity={opacity} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: spacing ?? size * 0.14, fill: color, fontWeight: weight }}>
      {t}
    </text>
  );
};

/** A big display headline word (asserted), Outfit 800. */
export const Big: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; align?: "start" | "middle" | "end"; opacity?: number }> = ({ x, y, text, size = 96, color = CREAM, align = "start", opacity = 1 }) => {
  assertAllowed(text, "Big");
  return (
    <text x={x} y={y} textAnchor={align} opacity={opacity} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.03, fill: color }}>
      {text}
    </text>
  );
};

/** A dark rounded plate behind a readout. */
export const TextPlate: React.FC<{ x: number; y: number; w: number; h: number; color?: string; opacity?: number }> = ({ x, y, w, h, color = "#04161C", opacity = 0.7 }) => (
  <g>
    <rect x={x + 5} y={y + 8} width={w} height={h} rx={22} fill="#020B10" opacity={opacity * 0.35} />
    <rect x={x} y={y} width={w} height={h} rx={22} fill={color} opacity={opacity} />
    <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx={19} fill="none" stroke="#FFFFFF" strokeOpacity={0.12} strokeWidth={2} />
  </g>
);

/** Rings launched every `every` frames from (cx, cy), growing at `speed` px/f. */
export const Rings: React.FC<{ f: number; cx: number; cy: number; r0?: number; every?: number; speed?: number; maxR?: number; color: string; width?: number; ry?: number }> = ({
  f,
  cx,
  cy,
  r0 = 20,
  every = 20,
  speed = 10,
  maxR = 260,
  color,
  width = 5,
  ry = 1,
}) => {
  const n = Math.ceil((maxR - r0) / speed / every) + 1;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const age = mod(f, every) + i * every;
        const r = r0 + age * speed;
        if (r > maxR || age > f + 0.01) return null;
        const a = 1 - (r - r0) / (maxR - r0);
        return <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * ry} fill="none" stroke={color} strokeWidth={width} opacity={a * 0.8} />;
      })}
    </g>
  );
};

/** Wind streaks crossing the frame (Earth only: F6). */
export const Wind: React.FC<{ f: number; x0?: number; x1?: number; y0: number; y1: number; n?: number; speed?: number; len?: number; color?: string; width?: number; seed?: number; opacity?: number }> = ({
  f,
  x0 = -300,
  x1 = 2300,
  y0,
  y1,
  n = 14,
  speed = 14,
  len = 220,
  color = "#FFFFFF",
  width = 4,
  seed = 2,
  opacity = 0.55,
}) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const W = x1 - x0 + len;
      const v = speed * (0.8 + rnd(seed * 3 + i) * 0.45);
      const x = x0 + mod(rnd(seed * 5 + i) * W + f * v, W) - len;
      const y = y0 + rnd(seed * 7 + i) * (y1 - y0);
      const l = len * (0.6 + rnd(seed * 11 + i) * 0.8);
      const wob = Math.sin(f / 9 + i) * 6;
      return <path key={i} d={`M${x} ${y} q${l * 0.5} ${wob - 8} ${l} ${wob}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" opacity={opacity * Math.min(1, (x - x0 + len) / 200, (x1 - x) / 200)} />;
    })}
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// strata: rock / mud layers in content coordinates (top at y0), sliding up by `scroll`
// ---------------------------------------------------------------------------------------------------------------
export type StrataBand = { top: number; h: number; color: string };
export const strataBands = (seed: number, total: number, palette: string[], minH = 50, maxH = 170): StrataBand[] => {
  const out: StrataBand[] = [];
  let y = 0;
  let i = 0;
  while (y < total) {
    const h = minH + rnd(seed * 13 + i * 7) * (maxH - minH);
    out.push({ top: y, h, color: palette[i % palette.length] });
    y += h;
    i++;
  }
  return out;
};
export const Strata: React.FC<{
  x0?: number;
  x1?: number;
  y0: number;
  /** content y where the layers end */
  depth?: number;
  scroll?: number;
  palette: string[];
  seed?: number;
  /** pebbles / grain dots per band */
  grain?: boolean;
  minH?: number;
  maxH?: number;
  wave?: number;
}> = ({ x0 = -800, x1 = 2720, y0, depth = 6000, scroll = 0, palette, seed = 3, grain = true, minH, maxH, wave = 14 }) => {
  const bands = strataBands(seed, depth, palette, minH, maxH);
  const step = 160;
  return (
    <g transform={`translate(0 ${-scroll})`}>
      {bands.map((b, i) => {
        const yy = y0 + b.top;
        const pts: string[] = [];
        for (let x = x0; x <= x1 + step; x += step) pts.push(`${x} ${(yy + Math.sin(x / 210 + i * 1.7) * wave + rnd(i * 31 + x) * 4).toFixed(1)}`);
        const d = `M${pts[0]} L${pts.slice(1).join(" L")} L${x1 + step} ${yy + b.h + 40} L${x0} ${yy + b.h + 40} Z`;
        return (
          <g key={i}>
            <path d={d} fill={b.color} />
            <path d={`M${pts[0]} L${pts.slice(1).join(" L")}`} fill="none" stroke={mixHex(b.color, "#FFF0DC", 0.28)} strokeWidth={3} opacity={0.6} />
            {grain
              ? Array.from({ length: 10 }, (_, k) => (
                  <ellipse
                    key={k}
                    cx={x0 + rnd(i * 17 + k * 3) * (x1 - x0)}
                    cy={yy + 18 + rnd(i * 19 + k * 5) * Math.max(10, b.h - 24)}
                    rx={4 + rnd(i + k * 11) * 9}
                    ry={3 + rnd(i * 3 + k) * 5}
                    fill={mixHex(b.color, rnd(i + k) > 0.5 ? "#000000" : "#FFF0DC", 0.22)}
                  />
                ))
              : null}
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// the granite cliff with four stylised carved heads (F1, F8): rounded blocks with a brow groove and a nose ridge;
// no eyes, no mouths, no hair, no likeness; never named on screen
// ---------------------------------------------------------------------------------------------------------------
const GRANITE = { face: "#D8B49A", lit: "#F2D6BE", shade: "#9C7460", deep: "#6E4C3E", speck: "#B78F78" };
const headShape = (cx: number, top: number, w: number, h: number, worn: number) => {
  const r = w * (0.32 + 0.12 * worn);
  const chin = h * (0.82 - 0.04 * worn);
  return `M${cx - w / 2} ${top + r} Q${cx - w / 2} ${top} ${cx - w / 2 + r} ${top} L${cx + w / 2 - r} ${top} Q${cx + w / 2} ${top} ${cx + w / 2} ${top + r}
    L${cx + w * 0.46} ${top + chin} Q${cx + w * 0.3} ${top + h} ${cx} ${top + h} Q${cx - w * 0.3} ${top + h} ${cx - w * 0.46} ${top + chin} Z`;
};
export const Cliff: React.FC<{ x: number; y: number; w: number; h: number; worn?: number; ghost?: number; dusk?: boolean }> = ({ x, y, w, h, worn = 0, ghost = 0, dusk = false }) => {
  // the rock mass: a stepped top edge, a lit left flank (sun from the upper left), scree at the foot
  const top = y;
  const rock = `M${x} ${y + h} L${x} ${top + h * 0.28} L${x + w * 0.08} ${top + h * 0.12} L${x + w * 0.2} ${top + h * 0.06} L${x + w * 0.38} ${top} L${x + w * 0.62} ${top + h * 0.02}
    L${x + w * 0.8} ${top + h * 0.1} L${x + w * 0.94} ${top + h * 0.22} L${x + w} ${top + h * 0.4} L${x + w} ${y + h} Z`;
  const tint = (c: string) => (dusk ? mixHex(c, "#E3813F", 0.25) : c);
  const heads = [
    { cx: x + w * 0.24, t: top + h * 0.16, hw: w * 0.15, hh: h * 0.36 },
    { cx: x + w * 0.42, t: top + h * 0.1, hw: w * 0.16, hh: h * 0.4 },
    { cx: x + w * 0.58, t: top + h * 0.2, hw: w * 0.13, hh: h * 0.32 },
    { cx: x + w * 0.76, t: top + h * 0.14, hw: w * 0.15, hh: h * 0.38 },
  ];
  return (
    <g>
      <path d={rock} fill={tint(GRANITE.face)} />
      <path d={`M${x} ${y + h} L${x} ${top + h * 0.28} L${x + w * 0.08} ${top + h * 0.12} L${x + w * 0.2} ${top + h * 0.06} L${x + w * 0.16} ${y + h} Z`} fill={tint(GRANITE.lit)} opacity={0.7} />
      <path d={`M${x + w * 0.94} ${top + h * 0.22} L${x + w} ${top + h * 0.4} L${x + w} ${y + h} L${x + w * 0.86} ${y + h} Z`} fill={tint(GRANITE.shade)} opacity={0.8} />
      {/* vertical joints and speckle */}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={x + w * (0.06 + i * 0.11)} y1={top + h * (0.3 + rnd(i) * 0.2)} x2={x + w * (0.05 + i * 0.11) + 10} y2={y + h} stroke={tint(GRANITE.shade)} strokeWidth={3} opacity={0.45} />
      ))}
      {Array.from({ length: 60 }, (_, i) => (
        <circle key={i} cx={x + rnd(i * 3) * w} cy={top + h * 0.3 + rnd(i * 5) * h * 0.7} r={2 + rnd(i * 7) * 3} fill={tint(GRANITE.speck)} opacity={0.6} />
      ))}
      {heads.map((hd, i) => {
        const d = headShape(hd.cx, hd.t, hd.hw, hd.hh, worn);
        const gd = headShape(hd.cx, hd.t - hd.hh * 0.06, hd.hw * 1.1, hd.hh * 1.08, 0);
        return (
          <g key={i}>
            {/* the alcove cut behind the head */}
            <path d={headShape(hd.cx, hd.t - 14, hd.hw * 1.28, hd.hh * 1.06, 0.3)} fill={tint(GRANITE.shade)} opacity={0.55} />
            <path d={d} fill={tint(GRANITE.face)} />
            {/* lit left half, shaded right half: sun from the upper left */}
            <clipPath id={`hd${i}${Math.round(hd.cx)}`}>
              <path d={d} />
            </clipPath>
            <g clipPath={`url(#hd${i}${Math.round(hd.cx)})`}>
              <rect x={hd.cx - hd.hw} y={hd.t} width={hd.hw * 0.9} height={hd.hh} fill={tint(GRANITE.lit)} opacity={0.75} />
              <rect x={hd.cx + hd.hw * 0.12} y={hd.t} width={hd.hw} height={hd.hh} fill={tint(GRANITE.shade)} opacity={0.55} />
              {/* brow groove and nose ridge: a carving, not a face */}
              <rect x={hd.cx - hd.hw * 0.42} y={hd.t + hd.hh * 0.34} width={hd.hw * 0.84} height={hd.hh * 0.05} rx={4} fill={tint(GRANITE.deep)} opacity={0.6 * (1 - 0.5 * worn)} />
              <path d={`M${hd.cx} ${hd.t + hd.hh * 0.36} L${hd.cx + hd.hw * 0.09} ${hd.t + hd.hh * 0.62} L${hd.cx - hd.hw * 0.02} ${hd.t + hd.hh * 0.62} Z`} fill={tint(GRANITE.deep)} opacity={0.45 * (1 - 0.5 * worn)} />
              <rect x={hd.cx - hd.hw * 0.3} y={hd.t + hd.hh * 0.74} width={hd.hw * 0.6} height={hd.hh * 0.035} rx={3} fill={tint(GRANITE.shade)} opacity={0.5 * (1 - 0.6 * worn)} />
            </g>
            <path d={d} fill="none" stroke={tint(GRANITE.lit)} strokeWidth={4} opacity={0.6} />
            {ghost > 0 ? <path d={gd} fill="none" stroke={CREAM} strokeWidth={4} strokeDasharray="14 10" opacity={ghost * 0.85} /> : null}
          </g>
        );
      })}
      {/* scree at the foot */}
      {Array.from({ length: 22 }, (_, i) => (
        <ellipse key={i} cx={x + rnd(i * 13) * w} cy={y + h - 6 + rnd(i * 2) * 10} rx={14 + rnd(i * 5) * 24} ry={8 + rnd(i * 9) * 10} fill={tint(i % 2 ? GRANITE.shade : GRANITE.speck)} />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// the Moon set (F6: no wind, nothing blows; the flag is rigid; dust only falls)
// ---------------------------------------------------------------------------------------------------------------
/** The lunar ground from `horizon` down: warm bone dust darkening to the horizon, craters, low sun from the left. */
export const MoonGround: React.FC<{ horizon: number; x0?: number; x1?: number; shift?: number; seed?: number; bottom?: number }> = ({ horizon, x0 = -1200, x1 = 3200, shift = 0, seed = 4, bottom = 2400 }) => {
  const id = `moong${seed}${Math.round(horizon)}`;
  const W = x1 - x0;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1={horizon} x2="0" y2={horizon + 520} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5A3E1C" />
          <stop offset="0.35" stopColor="#A87A3E" />
          <stop offset="1" stopColor="#E2B46C" />
        </linearGradient>
      </defs>
      <path d={`M${x0} ${horizon + 8} Q${x0 + W * 0.25} ${horizon - 18} ${x0 + W * 0.5} ${horizon + 4} T${x1} ${horizon} L${x1} ${bottom} L${x0} ${bottom} Z`} fill={`url(#${id})`} />
      <path d={`M${x0} ${horizon + 8} Q${x0 + W * 0.25} ${horizon - 18} ${x0 + W * 0.5} ${horizon + 4} T${x1} ${horizon}`} fill="none" stroke={C.moonDust} strokeWidth={3} opacity={0.55} />
      {Array.from({ length: 16 }, (_, i) => {
        const depth = rnd(seed * 3 + i);
        const cy = horizon + 30 + depth * depth * 480;
        const s = 0.25 + depth * 1.1;
        const cx = x0 + mod(rnd(seed * 7 + i) * W - shift * (0.4 + s * 0.6), W);
        const rx = 40 + rnd(seed * 11 + i) * 70 * s;
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.22} fill="#3A2E20" opacity={0.45} />
            <ellipse cx={cx + rx * 0.08} cy={cy + rx * 0.03} rx={rx * 0.86} ry={rx * 0.17} fill="#A89068" opacity={0.6} />
            <path d={`M${cx - rx} ${cy} A${rx} ${rx * 0.22} 0 0 0 ${cx + rx} ${cy}`} fill="none" stroke={C.moonDust} strokeWidth={2.5} opacity={0.55} />
          </g>
        );
      })}
    </g>
  );
};

/** A line of sharp-edged bootprints in perspective-free side view (scrolled by `shift`). */
export const Prints: React.FC<{ x0: number; y: number; n?: number; gap?: number; size?: number; shift?: number; wrap?: number }> = ({ x0, y, n = 10, gap = 190, size = 120, shift = 0, wrap }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const raw = x0 + i * gap - shift;
      const x = wrap ? mod(raw + 400, wrap) - 400 : raw;
      return (
        <g key={i}>
          <ellipse cx={x + 6} cy={y + (i % 2 ? 26 : -26) + 10} rx={size * 0.52} ry={size * 0.2} fill="#3A2E20" opacity={0.35} />
          <PrintIcon x={x} y={y + (i % 2 ? 26 : -26)} size={size} rotate={-90} fill="#B79C70" ink="#4E3F2C" />
        </g>
      );
    })}
  </g>
);

/** A rigid flag on a pole with a top rod (no wind, F6; plain, no insignia, F14). `plant` 0..1 drives it into the dust. */
export const RigidFlag: React.FC<{ x: number; y: number; h?: number; plant?: number }> = ({ x, y, h = 260, plant = 1 }) => {
  const dy = (1 - clamp01(plant)) * -h * 0.5;
  return (
    <g transform={`translate(0 ${dy})`}>
      <ellipse cx={x + 4} cy={y - dy + 4} rx={22} ry={6} fill="#2A2016" opacity={0.5 * clamp01(plant)} />
      <rect x={x - 3} y={y - h} width={6} height={h} fill="#E8F2EE" />
      <rect x={x - 3} y={y - h} width={140} height={5} fill="#E8F2EE" />
      <rect x={x + 3} y={y - h + 5} width={132} height={80} fill="#F4EEDF" />
      <rect x={x + 3} y={y - h + 5} width={132} height={14} fill={C.amber} />
      <rect x={x + 3} y={y - h + 77} width={132} height={8} fill="#D8CDB4" />
    </g>
  );
};

/** The Earth as a lit disc (sun from the left), petrol seas and teal-ochre land, a thin atmosphere rim. */
export const Earth: React.FC<{ x: number; y: number; r: number; seed?: number }> = ({ x, y, r, seed = 2 }) => {
  const id = `earth${seed}`;
  return (
    <g>
      <Bloom x={x} y={y} r={r * 1.5} color="#7FD0E8" strength={0.28} />
      <clipPath id={id}>
        <circle cx={x} cy={y} r={r} />
      </clipPath>
      <circle cx={x} cy={y} r={r} fill="#1D6E8C" />
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: 7 }, (_, i) => (
          <ellipse key={i} cx={x - r + rnd(seed * 5 + i) * 2 * r} cy={y - r + rnd(seed * 7 + i) * 2 * r} rx={r * (0.18 + rnd(i * 3) * 0.3)} ry={r * (0.1 + rnd(i * 9) * 0.2)} fill={i % 2 ? "#5FAE7A" : "#C9A45E"} opacity={0.9} />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse key={i} cx={x - r + rnd(seed * 13 + i) * 2 * r} cy={y - r + rnd(seed * 17 + i) * 2 * r} rx={r * 0.3} ry={r * 0.06} fill="#F4F8F0" opacity={0.65} />
        ))}
        <circle cx={x + r * 0.55} cy={y + r * 0.2} r={r * 1.05} fill="#04121A" opacity={0.62} />
      </g>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#9FE8E0" strokeWidth={Math.max(2, r * 0.03)} opacity={0.7} />
    </g>
  );
};

/** A meteorite streak (head at progress t along the line from a to b) and, after it lands, a dust puff far away. */
export const Meteor: React.FC<{ a: [number, number]; b: [number, number]; t: number; puff?: number }> = ({ a, b, t, puff = 0 }) => {
  const k = clamp01(t);
  const hx = a[0] + (b[0] - a[0]) * k;
  const hy = a[1] + (b[1] - a[1]) * k;
  const L = 260;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const tx = hx - Math.cos(ang) * L;
  const ty = hy - Math.sin(ang) * L;
  return (
    <g>
      {k > 0 && k < 1 ? (
        <g>
          <line x1={tx} y1={ty} x2={hx} y2={hy} stroke="#FFCF73" strokeWidth={5} strokeLinecap="round" opacity={0.5} />
          <line x1={(tx + hx) / 2} y1={(ty + hy) / 2} x2={hx} y2={hy} stroke="#FFF2C8" strokeWidth={4} strokeLinecap="round" />
          <circle cx={hx} cy={hy} r={7} fill="#FFFFFF" />
          <Bloom x={hx} y={hy} r={40} color="#FFCF73" strength={0.6} />
        </g>
      ) : null}
      {puff > 0 && puff < 1 ? (
        <g opacity={1 - puff}>
          {Array.from({ length: 9 }, (_, i) => {
            const ang2 = -Math.PI * (0.1 + 0.8 * (i / 8));
            const d = 20 + puff * 90;
            return <circle key={i} cx={b[0] + Math.cos(ang2) * d} cy={b[1] + Math.sin(ang2) * d * 0.7 + puff * puff * 60} r={6 + puff * 8} fill={C.moonDust} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

/** A small generic lander (no insignia): a gold-foil box on four splayed legs. */
export const Lander: React.FC<{ x: number; y: number; size?: number }> = ({ x, y, size = 60 }) => {
  const s = size / 60;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-30 0 L-18 -22 M30 0 L18 -22 M-12 0 L-8 -20 M12 0 L8 -20" stroke="#E8F2EE" strokeWidth={3} />
      <rect x={-22} y={-40} width={44} height={20} rx={3} fill="#E0A93A" />
      <rect x={-14} y={-58} width={28} height={18} rx={3} fill="#E8F2EE" />
      <rect x={-22} y={-40} width={44} height={5} fill="#FFE6A8" />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// animals (F5: no birds; F10: an illustration, labelled by bars, not a count)
// ---------------------------------------------------------------------------------------------------------------
export type AnimalKind = "elk" | "roe" | "red" | "boar" | "wolf";
const ANIMAL: Record<AnimalKind, { body: string; belly: string; len: number; hgt: number; leg: number }> = {
  elk: { body: "#8A5A36", belly: "#C99A6A", len: 1.25, hgt: 0.55, leg: 0.55 },
  roe: { body: "#B86A3A", belly: "#E8C49A", len: 0.9, hgt: 0.38, leg: 0.44 },
  red: { body: "#A0502E", belly: "#D8A070", len: 1.08, hgt: 0.46, leg: 0.5 },
  boar: { body: "#5A3E2E", belly: "#8A6A50", len: 1.0, hgt: 0.5, leg: 0.26 },
  wolf: { body: "#6F7F86", belly: "#D9D2BE", len: 1.05, hgt: 0.4, leg: 0.42 },
};
/** A stylised quadruped facing right, feet on y; `size` = body length in px; `phase` drives the trot. */
export const Animal: React.FC<{ kind: AnimalKind; x: number; y: number; size?: number; phase?: number; facing?: 1 | -1; shadow?: boolean }> = ({ kind, x, y, size = 160, phase = 0, facing = 1, shadow = true }) => {
  const a = ANIMAL[kind];
  const L = size;
  const H = size * a.hgt / a.len;
  const leg = size * a.leg / a.len;
  const by = y - leg - H * 0.5; // body centre y
  const bob = Math.abs(Math.sin(phase * Math.PI * 2)) * size * 0.025;
  const legs = [-0.36, -0.22, 0.24, 0.38].map((u, i) => {
    const sw = Math.sin(phase * Math.PI * 2 + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)) * 0.5;
    const hx = u * L;
    return { hx, fx: hx + sw * leg * 0.55, near: i % 2 === 1 };
  });
  const headX = L * 0.5;
  const headY = kind === "boar" ? by + H * 0.05 : by - H * 0.55;
  return (
    <g transform={`translate(${x} ${-bob}) scale(${facing} 1)`}>
      {shadow ? <ellipse cx={0} cy={y + bob} rx={L * 0.5} ry={size * 0.05} fill="#000000" opacity={0.18} /> : null}
      {legs.map((l, i) => (
        <line key={i} x1={l.hx} y1={by + H * 0.2} x2={l.fx} y2={y} stroke={l.near ? a.body : mixHex(a.body, "#000000", 0.3)} strokeWidth={Math.max(3, size * (kind === "boar" ? 0.075 : 0.05))} strokeLinecap="round" />
      ))}
      {/* tail */}
      {kind === "wolf" ? (
        <path d={`M${-L * 0.46} ${by - H * 0.15} q${-L * 0.25} ${H * 0.2} ${-L * 0.3} ${H * 0.65}`} fill="none" stroke={a.body} strokeWidth={size * 0.08} strokeLinecap="round" />
      ) : (
        <ellipse cx={-L * 0.5} cy={by - H * 0.2} rx={size * 0.04} ry={size * 0.06} fill={a.belly} />
      )}
      {/* body */}
      <ellipse cx={0} cy={by} rx={L * 0.52} ry={H * 0.5} fill={a.body} />
      <ellipse cx={L * 0.02} cy={by + H * 0.22} rx={L * 0.4} ry={H * 0.2} fill={a.belly} opacity={0.75} />
      <ellipse cx={-L * 0.12} cy={by - H * 0.28} rx={L * 0.32} ry={H * 0.12} fill="#FFFFFF" opacity={0.14} />
      {kind === "boar" ? (
        // a bristle ridge
        <path d={`M${-L * 0.35} ${by - H * 0.42} Q0 ${by - H * 0.72} ${L * 0.35} ${by - H * 0.4}`} fill="none" stroke={mixHex(a.body, "#000000", 0.3)} strokeWidth={size * 0.05} strokeLinecap="round" />
      ) : null}
      {/* neck + head */}
      {kind === "boar" ? (
        <g>
          <path d={`M${headX - L * 0.08} ${headY - H * 0.32} L${headX + L * 0.22} ${headY + H * 0.05} L${headX + L * 0.22} ${headY + H * 0.22} L${headX - L * 0.08} ${headY + H * 0.3} Z`} fill={a.body} />
          <rect x={headX + L * 0.2} y={headY + H * 0.04} width={L * 0.05} height={H * 0.18} rx={3} fill="#E8C49A" />
          <path d={`M${headX + L * 0.14} ${headY + H * 0.2} q${L * 0.05} ${-H * 0.12} ${L * 0.02} ${-H * 0.24}`} fill="none" stroke="#FFF4E0" strokeWidth={size * 0.022} strokeLinecap="round" />
          <path d={`M${headX - L * 0.02} ${headY - H * 0.3} l${L * 0.02} ${-H * 0.2} l${L * 0.04} ${H * 0.16} Z`} fill={a.body} />
        </g>
      ) : (
        <g>
          <path d={`M${L * 0.32} ${by - H * 0.1} L${headX - L * 0.02} ${headY - H * 0.1} L${headX + L * 0.06} ${headY + H * 0.18} L${L * 0.44} ${by + H * 0.2} Z`} fill={a.body} />
          <path
            d={`M${headX - L * 0.06} ${headY - H * 0.22} L${headX + L * 0.1} ${headY - H * 0.12} L${headX + L * 0.22} ${headY + H * 0.06} L${headX + L * 0.18} ${headY + H * 0.16} L${headX - L * 0.02} ${headY + H * 0.16} Z`}
            fill={a.body}
          />
          <circle cx={headX + L * 0.2} cy={headY + H * 0.1} r={size * 0.016} fill="#14262E" />
          {/* ears */}
          <path d={`M${headX - L * 0.04} ${headY - H * 0.2} l${-L * 0.03} ${-H * (kind === "wolf" ? 0.32 : 0.22)} l${L * 0.07} ${H * 0.16} Z`} fill={mixHex(a.body, "#000000", 0.15)} />
          {kind === "wolf" ? <rect x={headX + L * 0.04} y={headY + H * 0.02} width={L * 0.16} height={H * 0.1} rx={3} fill={a.belly} /> : null}
          {/* antlers: big palmate (elk), branched (red), short spikes (roe) */}
          {kind === "elk" ? (
            <path
              d={`M${headX} ${headY - H * 0.22} q${-L * 0.05} ${-H * 0.5} ${-L * 0.3} ${-H * 0.62} M${headX - L * 0.08} ${headY - H * 0.62} l${-L * 0.02} ${-H * 0.28} M${headX - L * 0.18} ${headY - H * 0.74} l${-L * 0.06} ${-H * 0.22} M${headX + L * 0.02} ${headY - H * 0.22} q${L * 0.12} ${-H * 0.42} ${L * 0.02} ${-H * 0.8}`}
              fill="none"
              stroke="#E8D7B0"
              strokeWidth={size * 0.03}
              strokeLinecap="round"
            />
          ) : kind === "red" ? (
            <path
              d={`M${headX} ${headY - H * 0.22} q${-L * 0.02} ${-H * 0.45} ${-L * 0.12} ${-H * 0.75} M${headX - L * 0.05} ${headY - H * 0.6} l${L * 0.08} ${-H * 0.12} M${headX - L * 0.09} ${headY - H * 0.78} l${L * 0.07} ${-H * 0.1}`}
              fill="none"
              stroke="#E8D7B0"
              strokeWidth={size * 0.025}
              strokeLinecap="round"
            />
          ) : kind === "roe" ? (
            <path d={`M${headX} ${headY - H * 0.22} l${-L * 0.01} ${-H * 0.35} M${headX - L * 0.01} ${headY - H * 0.4} l${L * 0.04} ${-H * 0.06}`} fill="none" stroke="#E8D7B0" strokeWidth={size * 0.022} strokeLinecap="round" />
          ) : null}
        </g>
      )}
    </g>
  );
};

/** A small house icon (roof + body + two windows); `lit` 0..1 lights the windows amber. No people (F10). */
export const House: React.FC<{ x: number; y: number; size?: number; lit?: number; body?: string; roof?: string }> = ({ x, y, size = 50, lit = 1, body = "#D9C7A2", roof = "#7A4A2E" }) => {
  const s = size;
  return (
    <g>
      <rect x={x - s * 0.42} y={y - s * 0.5} width={s * 0.84} height={s * 0.5} fill={body} />
      <path d={`M${x - s * 0.52} ${y - s * 0.48} L${x} ${y - s * 0.95} L${x + s * 0.52} ${y - s * 0.48} Z`} fill={roof} />
      {[-0.2, 0.2].map((u, i) => (
        <g key={i}>
          <rect x={x + u * s - s * 0.1} y={y - s * 0.38} width={s * 0.2} height={s * 0.18} fill={mixHex("#1B2A30", C.amber, clamp01(lit))} />
          {lit > 0.3 ? <rect x={x + u * s - s * 0.1} y={y - s * 0.38} width={s * 0.2} height={s * 0.05} fill="#FFE6A8" opacity={lit} /> : null}
        </g>
      ))}
    </g>
  );
};

/** The AIR plate: no numerals; cool teal at the left stop to warm amber at the right; needle `value` 0..1. */
export const AirDial: React.FC<{ x: number; y: number; r?: number; value: number }> = ({ x, y, r = 110, value }) => {
  const A0 = 150;
  const SW = 240;
  const pt = (d: number, rr: number): [number, number] => [x + Math.cos((d * Math.PI) / 180) * rr, y + Math.sin((d * Math.PI) / 180) * rr];
  const segs = 12;
  const ang = A0 + clamp01(value) * SW;
  const [nx, ny] = pt(ang, r * 0.78);
  return (
    <g>
      <circle cx={x + r * 0.05} cy={y + r * 0.08} r={r * 1.1} fill="#020B10" opacity={0.35} />
      <circle cx={x} cy={y} r={r * 1.1} fill={C.saffronDeep} />
      <circle cx={x} cy={y} r={r * 1.05} fill={C.saffron} />
      <circle cx={x} cy={y} r={r * 0.97} fill="#0B2530" />
      {Array.from({ length: segs }, (_, i) => {
        const d0 = A0 + (i / segs) * SW;
        const d1 = A0 + ((i + 0.85) / segs) * SW;
        const [ax, ay] = pt(d0, r * 0.84);
        const [bx, by] = pt(d1, r * 0.84);
        return <path key={i} d={`M${ax} ${ay} A${r * 0.84} ${r * 0.84} 0 0 1 ${bx} ${by}`} fill="none" stroke={mixHex("#2FBFA8", C.amber, i / (segs - 1))} strokeWidth={r * 0.12} />;
      })}
      <text x={x} y={y - r * 0.32} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: r * 0.2, letterSpacing: r * 0.05, fill: "#9FC8C6" }}>
        AIR
      </text>
      <text x={x} y={y + r * 0.58} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: r * 0.13, letterSpacing: r * 0.02, fill: C.amber }}>
        WARMER
      </text>
      <line x1={x} y1={y} x2={nx} y2={ny} stroke={C.saffronCore} strokeWidth={r * 0.06} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.1} fill={C.saffron} />
    </g>
  );
};

/** A stamp-like slam for any child group: scale 2.2 → 1 over 6 frames, a settle wobble and one ring. */
export const Slam: React.FC<{ age: number; x: number; y: number; ring?: string; size?: number; children: React.ReactNode }> = ({ age, x, y, ring = CREAM, size = 120, children }) => {
  if (age < 0) return null;
  const k = clamp01(age / 6);
  const sc = age < 6 ? 2.2 - 1.2 * k * k : 1 + Math.sin((age - 6) * 0.9) * 0.05 * Math.exp(-(age - 6) / 6);
  const ringR = size * (0.6 + Math.max(0, age - 5) * 0.12);
  return (
    <g>
      {age >= 5 && age < 22 ? <circle cx={x} cy={y} r={ringR} fill="none" stroke={ring} strokeWidth={5} opacity={1 - (age - 5) / 17} /> : null}
      <g opacity={Math.min(1, age / 2 + 0.3)} transform={`translate(${x} ${y}) scale(${sc}) translate(${-x} ${-y})`}>
        {children}
      </g>
    </g>
  );
};

/** A plain wooden-ish board panel for the dark board (9-12 to 9-14): petrol felt in a saffron frame. */
export const DarkBoard: React.FC<{ x: number; y: number; w: number; h: number; f: number }> = ({ x, y, w, h, f }) => {
  const shine = mod(f * 8, w + 600) - 300;
  return (
    <g>
      <rect x={x + 14} y={y + 20} width={w} height={h} rx={22} fill="#000000" opacity={0.35} />
      <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} rx={26} fill={C.saffronDeep} />
      <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx={22} fill={C.saffron} opacity={0.85} />
      <rect x={x} y={y} width={w} height={h} rx={18} fill="#0D2B38" />
      <clipPath id={`dkb${Math.round(x)}${Math.round(y)}`}>
        <rect x={x} y={y} width={w} height={h} rx={18} />
      </clipPath>
      <g clipPath={`url(#dkb${Math.round(x)}${Math.round(y)})`}>
        {Array.from({ length: Math.ceil((w + h) / 70) }, (_, i) => (
          <line key={i} x1={x + i * 70 - h} y1={y + h} x2={x + i * 70} y2={y} stroke="#14414F" strokeWidth={16} opacity={0.6} />
        ))}
        <rect x={x + shine} y={y} width={160} height={h} fill="#7FE0D8" opacity={0.06} transform={`skewX(-18)`} />
      </g>
    </g>
  );
};

/** A chipped stone, large, with lit flake scars and a cast shadow (the closer's and 9-03's hero stone). */
export const HeroStone: React.FC<{ x: number; y: number; size?: number; glint?: number; dark?: boolean }> = ({ x, y, size = 300, glint = -1, dark = false }) => (
  <g>
    <ellipse cx={x + size * 0.12} cy={y + size * 0.34} rx={size * 0.62} ry={size * 0.1} fill="#000000" opacity={dark ? 0.45 : 0.25} />
    <StoneIcon x={x} y={y} size={size} fill={dark ? "#B88A60" : "#C9A27A"} ink={dark ? "#2A160C" : "#3A2414"} />
    {glint >= 0 && glint <= 1 ? (
      <g>
        <Bloom x={x - size * 0.4 + glint * size * 0.8} y={y - size * 0.22 + Math.sin(glint * Math.PI) * -size * 0.12} r={size * 0.12} color="#FFF3C8" strength={0.9} />
        <circle cx={x - size * 0.4 + glint * size * 0.8} cy={y - size * 0.22 + Math.sin(glint * Math.PI) * -size * 0.12} r={size * 0.018} fill="#FFFFFF" />
      </g>
    ) : null}
  </g>
);

/** Tinted stars at fixed places (a still sky for the cards) with a twinkle. */
export const StillStars: React.FC<{ f: number; n?: number; seed?: number; h?: number }> = ({ f, n = 70, seed = 9, h = 1080 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <circle
        key={i}
        cx={rnd(seed * 13 + i) * 1920}
        cy={rnd(seed * 29 + i) * h}
        r={1 + (i % 3) * 0.7}
        fill={STAR_TINTS[i % STAR_TINTS.length]}
        opacity={0.45 + 0.55 * Math.abs(Math.sin(f / (9 + (i % 7) * 3) + i))}
      />
    ))}
  </g>
);

/** A wrench icon (MAINTENANCE tag). */
export const Wrench: React.FC<{ x: number; y: number; size?: number; color?: string; rotate?: number }> = ({ x, y, size = 60, color = INK, rotate = -40 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size / 60})`}>
    <rect x={-6} y={-6} width={44} height={12} rx={6} fill={color} />
    <path d="M-10 -16 A16 16 0 1 0 -10 16 L-4 6 L-12 0 L-4 -6 Z" fill={color} />
  </g>
);

/** An open eye (for "watching"), crossed out by a slash drawn to `slash` 0..1. */
export const Eye: React.FC<{ x: number; y: number; size?: number; slash?: number; ink?: string }> = ({ x, y, size = 80, slash = 0, ink = INK }) => (
  <g>
    <path d={`M${x - size * 0.6} ${y} Q${x} ${y - size * 0.55} ${x + size * 0.6} ${y} Q${x} ${y + size * 0.55} ${x - size * 0.6} ${y} Z`} fill="#FFF8EC" stroke={ink} strokeWidth={size * 0.06} />
    <circle cx={x} cy={y} r={size * 0.2} fill={C.tealDeep} />
    <circle cx={x} cy={y} r={size * 0.09} fill={ink} />
    <line x1={x - size * 0.62} y1={y + size * 0.45} x2={x + size * 0.62} y2={y - size * 0.45} stroke={ink} strokeWidth={size * 0.09} strokeLinecap="round" {...drawn(slash)} />
  </g>
);

/** A clock face (no numerals), hands at angles in degrees. */
export const ClockFace: React.FC<{ x: number; y: number; r?: number; hour: number; minute: number }> = ({ x, y, r = 120, hour, minute }) => {
  const hand = (deg: number, len: number, w: number, c: string) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return <line x1={x} y1={y} x2={x + Math.cos(a) * len} y2={y + Math.sin(a) * len} stroke={c} strokeWidth={w} strokeLinecap="round" />;
  };
  return (
    <g>
      <circle cx={x + 6} cy={y + 10} r={r * 1.08} fill="#000000" opacity={0.2} />
      <circle cx={x} cy={y} r={r * 1.08} fill={C.saffron} />
      <circle cx={x} cy={y} r={r} fill={C.paper} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={x + Math.cos(a) * r * 0.8} y1={y + Math.sin(a) * r * 0.8} x2={x + Math.cos(a) * r * 0.92} y2={y + Math.sin(a) * r * 0.92} stroke={INK} strokeWidth={i % 3 ? 3 : 6} />;
      })}
      {hand(hour, r * 0.5, r * 0.08, INK)}
      {hand(minute, r * 0.78, r * 0.05, C.tealDeep)}
      <circle cx={x} cy={y} r={r * 0.07} fill={INK} />
    </g>
  );
};

/** The Moon set (void family, F6): petrol-black sky with tinted stars, a small Earth, the bone-dust ground and a line of
 *  sharp prints, all scrolled by a dolly `shift` (px). Stars stream at `starSpeed` px/f (+ = leftward). */
export const MoonSet: React.FC<{
  f: number;
  shift?: number;
  horizon?: number;
  earth?: { x: number; y: number; r: number } | false;
  prints?: { x0: number; y: number; n: number; gap?: number; size?: number } | false;
  starSpeed?: number;
  seed?: number;
}> = ({ f, shift = 0, horizon = 760, earth = { x: 1480, y: 230, r: 64 }, prints = false, starSpeed = 2, seed = 4 }) => (
  <g>
    <Sky stops={["#021218", "#06232E", "#0E3A48"]} x={-1200} y={-1600} w={4320} h={2400 + horizon} />
    <g>
      {Array.from({ length: 120 }, (_, i) => {
        const W = 2600;
        const x = mod(rnd(seed * 13 + i) * W - f * starSpeed * (0.4 + 0.6 * rnd(seed * 3 + i)) - shift * 0.08, W) - 340;
        const y = -400 + rnd(seed * 29 + i) * (horizon + 380);
        return <circle key={i} cx={x} cy={y} r={1 + (i % 3) * 0.8} fill={STAR_TINTS[i % STAR_TINTS.length]} opacity={0.45 + 0.55 * Math.abs(Math.sin(f / (9 + (i % 7) * 3) + i))} />;
      })}
    </g>
    {earth ? <Earth x={earth.x - shift * 0.05} y={earth.y} r={earth.r} /> : null}
    <MoonGround horizon={horizon} shift={shift} seed={seed} />
    {prints ? <Prints x0={prints.x0} y={prints.y} n={prints.n} gap={prints.gap ?? 190} size={prints.size ?? 120} shift={shift} /> : null}
  </g>
);

export { alpha, mixHex, rnd };
