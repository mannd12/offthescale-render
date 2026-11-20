// L18 package-A helpers (Cold, S01-S04 only; package B never imports this file). Small drawing pieces the five scenes
// share: the backgrounds of the four families A uses (abyss · bowl · gauge · tangerine), the phase/pop plumbing, the
// readouts (every numeral goes through data18: READ / assertAllowed / assertValue), and the bespoke props of the cold
// open, the sky, the clock, rung one and the Roche limit (orbiter, stopwatch, iso cubes, springs, bolts, fat arrows).
// Shot bodies stay bespoke in each scene file (hard rule 1). No people (F1): Tick is the only figure. No oceans (F6).
import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { Bloom, Counter, Family, IF2, Metric, Motes, Sky, alpha, cutPop, mixHex, ramp, rnd, smooth } from "../../../lib/illustrated";
import { L18_COLORS, familyOf } from "../families";
import { READ, ReadKey, assertAllowed, assertValue } from "../data18";
import { StarsTint18 } from "../movers18";
import { MoonToken } from "../gauge";
import { StationToken, WeatherSat } from "../planets18";
import { RockChip } from "../icons18";

export const C = L18_COLORS;
export const ABYSS = familyOf("abyss");
export const BOWL = familyOf("bowl");
export const GAUGE = familyOf("gauge");
export const TANG = familyOf("tangerine");
export const INK = C.ink;
export const D2R = Math.PI / 180;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");

export const cl01 = (v: number) => Math.max(0, Math.min(1, v));
/** eased 0..1 between frames a and b */
export const ez = (f: number, a: number, b: number) => smooth(ramp(f, a, b));
/** linear 0..1 between frames a and b (constant-speed movers) */
export const lin = (f: number, a: number, b: number) => cl01((f - a) / Math.max(1, b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const wrap = (v: number, m: number) => ((v % m) + m) % m;
export const fr = (v: number) => v - Math.floor(v);
/** a triangle wave 0..1..0 with period `p` frames (ping-pong movers that never settle) */
export const tri = (f: number, p: number) => {
  const u = wrap(f, p) / p;
  return u < 0.5 ? u * 2 : (1 - u) * 2;
};
/** km at the rail centre that puts `km` at screen y (railY inverse): keep a subject pinned while the ticks stream. */
export const centerFor = (km: number, y: number, decade: number, cy = 540) => km * Math.pow(10, (y - cy) / decade);
/** geometric interpolation between two km values (a log rail moves at constant px/f) */
export const logLerp = (a: number, b: number, k: number) => Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * k);

/** A hard cut's pop (scale bump over 9 frames). */
export const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/**
 * Two phases of one shot (a storyboard PUSH or SLIDE): `a` until `at`, then `b` arrives over `dur` frames.
 * "slide" = b slides in from the right over a; "push" = a scales up and fades, b grows in from 0.9.
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

/** Clip children to a circle. */
export const ClipCircle: React.FC<{ cx: number; cy: number; r: number; children: React.ReactNode }> = ({ cx, cy, r, children }) => {
  const id = "cc" + sid(useId());
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// backgrounds (storyboard §1 hexes, used exactly; nothing grey, cream or blue-grey)
// ---------------------------------------------------------------------------------------------------------------
/** The dark field: petrol-black top (#01121B) to #022B40, tinted stars streaming. `lift` 0..1 brings in the family's
 *  third stop at the bottom (for the lit-limb shots). Dark weight: with lift 0 the whole field is under V 0.3. */
export const AbyssField: React.FC<{ f: number; speed?: number; angle?: number; n?: number; lift?: number; seed?: number }> = ({ f, speed = 12, angle = 90, n = 110, lift = 0, seed = 1 }) => (
  <g>
    <Sky stops={lift > 0 ? ["#01121B", "#01121B", "#022B40", mixHex("#022B40", "#07608A", lift)] : ["#01121B", "#01121B", "#022B40"]} />
    <StarsTint18 f={f} x={-200} y={-200} w={2320} h={1480} n={n} speed={speed} angle={angle} seed={seed} size={2.4} />
  </g>
);

/** The lit rail room (gauge): chart-teal wall, panel seams, an amber lamp row, the floor plane with a lit lip. */
export const GaugeRoom: React.FC<{ f: number; floor?: number; lamps?: number; dim?: number; seed?: number }> = ({ f, floor = 980, lamps = 1, dim = 0, seed = 1 }) => (
  <g>
    <Sky family={GAUGE} />
    {/* far wall panels: far / mid stops, seams every 240 px */}
    {Array.from({ length: 10 }, (_, i) => (
      <rect key={i} x={-120 + i * 240} y={-40} width={232} height={floor + 40} fill={i % 2 ? GAUGE.far : mixHex(GAUGE.far, GAUGE.mid, 0.35)} opacity={0.55} />
    ))}
    {/* the lamp row along the top of the wall */}
    {Array.from({ length: 9 }, (_, i) => {
      const on = cl01(lamps * 9 - i);
      const pulse = 0.8 + 0.2 * Math.sin(f / 7 + i * 1.3 + seed);
      return (
        <g key={"l" + i}>
          <circle cx={120 + i * 220} cy={70} r={34 * pulse} fill={C.amber} opacity={0.22 * on} />
          <circle cx={120 + i * 220} cy={70} r={11} fill={on > 0.5 ? "#FFE7A0" : mixHex(C.amber, GAUGE.near, 0.6)} stroke={C.amber} strokeWidth={3} />
        </g>
      );
    })}
    <Bloom x={420} y={180} r={700} color={C.moonRim} strength={0.22} />
    {/* the floor */}
    <rect x={-400} y={floor} width={2720} height={700} fill={GAUGE.near} />
    <rect x={-400} y={floor} width={2720} height={7} fill={mixHex(GAUGE.light, GAUGE.mid, 0.25)} />
    <rect x={-400} y={floor + 7} width={2720} height={60} fill={mixHex(GAUGE.near, GAUGE.mid, 0.5)} opacity={0.6} />
    <Motes frame={f} n={16} w={1920} h={floor} color={alpha(C.amber, 0.55)} seed={seed + 3} />
    {dim > 0 ? <rect x={-400} y={-400} width={2720} height={1880} fill="#01121B" opacity={dim * 0.72} /> : null}
  </g>
);

/** Survey paper (tangerine): oxide-orange to saffron, a faint chart grid that can scroll (`scroll` px/f), a table plane. */
export const Paper: React.FC<{ f: number; scroll?: number; table?: number; seed?: number }> = ({ f, scroll = 0, table = 930, seed = 1 }) => {
  const off = wrap(f * scroll, 120);
  return (
    <g>
      <Sky family={TANG} angle={100} />
      {Array.from({ length: 20 }, (_, i) => (
        <line key={"v" + i} x1={-120 + i * 120 - off} y1={-20} x2={-120 + i * 120 - off} y2={table} stroke={TANG.mid} strokeWidth={2} opacity={0.35} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={"h" + i} x1={-40} y1={60 + i * 120} x2={1960} y2={60 + i * 120} stroke={TANG.mid} strokeWidth={2} opacity={0.3} />
      ))}
      <Bloom x={360} y={160} r={760} color={TANG.light} strength={0.28} />
      <rect x={-400} y={table} width={2720} height={600} fill={TANG.far} />
      <rect x={-400} y={table} width={2720} height={8} fill={TANG.light} opacity={0.8} />
      {Array.from({ length: 14 }, (_, i) => {
        const x = wrap(i * 190 - f * scroll * 1.3, 2660) - 370;
        return <rect key={"t" + i} x={x} y={table + 40 + (i % 3) * 38} width={90} height={8} rx={4} fill={TANG.near} opacity={0.5} />;
      })}
      <Motes frame={f} n={12} w={1920} h={table} color={alpha(TANG.light, 0.6)} seed={seed + 5} />
    </g>
  );
};

/** The sky under the huge Moon (bowl): dusk-blue to apricot to gold, the horizon plane. */
export const BowlSky: React.FC<{ f: number; horizon?: number; seed?: number }> = ({ f, horizon = 920, seed = 1 }) => (
  <g>
    <Sky family={BOWL} />
    <Bloom x={180} y={horizon - 40} r={900} color={BOWL.sky[2]} strength={0.4} squash={0.45} />
    <Motes frame={f} n={14} w={1920} h={horizon} color={alpha("#FFE7A0", 0.55)} seed={seed + 2} />
  </g>
);

/** The flat ground under the bowl sky (no shore, no ocean: F6). */
export const BowlGround: React.FC<{ horizon?: number }> = ({ horizon = 920 }) => (
  <g>
    <rect x={-400} y={horizon} width={2720} height={700} fill={BOWL.near} />
    <rect x={-400} y={horizon} width={2720} height={6} fill={mixHex(BOWL.light, BOWL.near, 0.3)} />
    <rect x={-400} y={horizon + 6} width={2720} height={70} fill={BOWL.mid} opacity={0.55} />
  </g>
);

/** The apricot cloud band drifting across a bowl sky (wraps; 14-16 px/f). */
export const CloudBand: React.FC<{ f: number; y: number; speed: number; n?: number; seed?: number; h?: number }> = ({ f, y, speed, n = 8, seed = 1, h = 180 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const span = 2800;
      const bx = wrap(rnd(seed * 3 + i) * span + f * speed * (0.75 + 0.5 * rnd(seed + i)), span) - 440;
      const by = y - rnd(seed * 5 + i * 2) * h;
      const bw = 240 + rnd(seed * 7 + i) * 300;
      const bh = 26 + rnd(seed * 9 + i) * 24;
      return (
        <g key={i}>
          <rect x={bx} y={by} width={bw} height={bh} rx={bh / 2} fill={i % 2 ? "#FFC65C" : "#F59A3B"} opacity={0.75} />
          <rect x={bx + 20} y={by + bh * 0.62} width={bw - 40} height={bh * 0.3} rx={bh * 0.15} fill="#F08A4A" opacity={0.55} />
        </g>
      );
    })}
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// type: every numeral goes through data18
// ---------------------------------------------------------------------------------------------------------------
const textW = (s: string, size: number) => s.length * size * 0.58;

/** A static metric (value + unit exactly as written) on a soft shadow; `reveal` 0..1 types it on. Numerals checked. */
export const MetricA: React.FC<{ x: number; y: number; value: string; unit?: string; size?: number; color?: string; reveal?: number; align?: "start" | "middle" | "end"; shadow?: string }> = ({
  x,
  y,
  value,
  unit,
  size = 96,
  color = "#FFEFC8",
  reveal = 1,
  align = "start",
  shadow = "#01121B",
}) => {
  assertAllowed(`${value} ${unit ?? ""}`, "package-A metric");
  const r = cl01(reveal);
  if (r <= 0) return null;
  const n = Math.ceil(value.length * r);
  const v = value.slice(0, n);
  const u = r >= 1 ? unit : undefined;
  return (
    <g>
      <Metric x={x + 4} y={y + 5} value={v} unit={u} size={size} color={shadow} align={align} />
      <Metric x={x} y={y} value={v} unit={u} size={size} color={color} align={align} />
    </g>
  );
};

/**
 * A rolling readout for a data18 entry: small `prefix` label above (ABOUT, MORE THAN …), the odometer Counter rolling to
 * READ[key].value × k, and the unit as a separate span (F13: KM, M/S2, KG PER M3 read exactly). `k` 0..1.
 */
export const Readout: React.FC<{
  x: number;
  y: number;
  k: number;
  rkey: ReadKey;
  size?: number;
  color?: string;
  prefix?: string;
  unit?: string;
  sup?: string;
  from?: number;
  shadow?: string;
}> = ({ x, y, k, rkey, size = 96, color = "#FFEFC8", prefix, unit, sup, from = 0, shadow = "#01121B" }) => {
  const R = READ[rkey];
  const end = assertValue(R.value ?? 0, `Readout ${rkey}`);
  assertAllowed(`${prefix ?? ""} ${R.text} ${unit ?? ""}${sup ?? ""}`, `Readout ${rkey}`);
  const v = from + (end - from) * cl01(k);
  const digits = Math.max(1, Math.floor(Math.log10(Math.max(1, end, from))) + 1);
  const W = digits * size * 0.6 + Math.floor((digits - 1) / 3) * size * 0.22;
  const ux = x + W + size * 0.16;
  const num = (dx: number, dy: number, col: string) => <Counter2 x={x + W + dx} y={y + dy} value={v} max={Math.max(end, from)} size={size} color={col} />;
  return (
    <g>
      {prefix ? (
        <text x={x + 3} y={y - size * 0.92} style={{ fontFamily: IF2.label, fontSize: size * 0.3, letterSpacing: size * 0.04, fill: color }}>
          {prefix}
        </text>
      ) : null}
      {num(4, 5, shadow)}
      {num(0, 0, color)}
      {unit ? (
        <text x={ux} y={y} style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: size * 0.42, fill: color }}>
          {unit}
          {sup ? (
            <tspan dy={-size * 0.2} style={{ fontSize: size * 0.28 }}>
              {sup}
            </tspan>
          ) : null}
        </text>
      ) : null}
    </g>
  );
};
// the kit Counter, right-aligned (its width shrinks while leading zeros are hidden; the right edge stays put)
const Counter2: React.FC<{ x: number; y: number; value: number; max: number; size: number; color: string }> = (p) => <Counter {...p} align="end" />;

/** A Kicker-style tag on a dark plate (for the storyboard's Kicker lines and short tags). */
export const TagPlate: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; fill?: string; appear?: number; dash?: boolean }> = ({
  x,
  y,
  text,
  size = 30,
  color = "#FFEFC8",
  fill = "rgba(1,18,27,0.72)",
  appear = 1,
  dash = true,
}) => {
  assertAllowed(text, "TagPlate");
  const a = smooth(cl01(appear));
  if (a <= 0) return null;
  const w = textW(text, size) + size * (dash ? 2.6 : 1.4);
  const h = size * 1.8;
  return (
    <g opacity={a} transform={`translate(0 ${((1 - a) * 20).toFixed(1)})`}>
      <rect x={x - size * 0.6} y={y - h * 0.68} width={w} height={h} rx={h / 2} fill={fill} stroke={C.amber} strokeWidth={2.5} />
      {dash ? <rect x={x} y={y - size * 0.36} width={size * 0.9} height={3} fill={C.amber} /> : null}
      <text x={x + (dash ? size * 1.3 : 0)} y={y} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.16, fill: color }}>
        {text}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// props
// ---------------------------------------------------------------------------------------------------------------
/** A token on an orbit at an explicit angle (deg; screen coords, so − = counterclockwise = prograde seen from above),
 *  with its ring and a glowing trail arc. `kind` picks the token art. */
export const Orbiter: React.FC<{ cx: number; cy: number; r: number; angle: number; tilt?: number; kind: "moon" | "station" | "sat" | "rock"; size?: number; f: number; trail?: number; ring?: boolean; color?: string; dir?: 1 | -1 }> = ({
  cx,
  cy,
  r,
  angle,
  tilt = 1,
  kind,
  size = 30,
  f,
  trail = 60,
  ring = true,
  color,
  dir = -1,
}) => {
  const col = color ?? (kind === "moon" ? C.moonRim : kind === "station" ? C.amber : kind === "rock" ? C.moonMid : C.model);
  const a = angle * D2R;
  const x = cx + Math.cos(a) * r;
  const y = cy + Math.sin(a) * r * tilt;
  const a0 = (angle - dir * trail) * D2R;
  const x0 = cx + Math.cos(a0) * r;
  const y0 = cy + Math.sin(a0) * r * tilt;
  const sweep = dir < 0 ? 0 : 1;
  return (
    <g>
      {ring ? <ellipse cx={cx} cy={cy} rx={r} ry={r * tilt} fill="none" stroke={alpha(col, 0.5)} strokeWidth={3} /> : null}
      {trail > 0 ? <path d={`M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r * tilt} 0 ${trail > 180 ? 1 : 0} ${sweep} ${x.toFixed(1)} ${y.toFixed(1)}`} fill="none" stroke={col} strokeWidth={Math.max(6, size * 0.3)} strokeLinecap="round" opacity={0.65} /> : null}
      {kind === "moon" ? (
        <MoonToken x={x} y={y} r={size} f={f} />
      ) : kind === "station" ? (
        <StationMini x={x} y={y} size={size * 1.6} f={f} angle={angle + 90} />
      ) : kind === "sat" ? (
        <SatMini x={x} y={y} size={size * 1.4} f={f} />
      ) : (
        <RockMini x={x} y={y} size={size} angle={f * 6} />
      )}
    </g>
  );
};
const StationMini: React.FC<{ x: number; y: number; size: number; f: number; angle: number }> = (p) => <StationToken {...p} />;
const SatMini: React.FC<{ x: number; y: number; size: number; f: number }> = (p) => <WeatherSat {...p} />;
const RockMini: React.FC<{ x: number; y: number; size: number; angle: number }> = ({ x, y, size, angle }) => <RockChip x={x} y={y} size={size * 1.8} rotate={angle} />;

/** A stopwatch (2-10): amber case, a hand at `angle` deg (0 = up), a crown. */
export const Stopwatch18: React.FC<{ x: number; y: number; r: number; angle: number; f: number }> = ({ x, y, r, angle, f }) => {
  const a = (angle - 90) * D2R;
  return (
    <g>
      <circle cx={x} cy={y} r={r * 1.18} fill={alpha(C.amber, 0.18)} />
      <rect x={x - r * 0.14} y={y - r * 1.32} width={r * 0.28} height={r * 0.24} rx={r * 0.06} fill={C.amber} />
      <circle cx={x} cy={y} r={r} fill={INK} stroke={C.amber} strokeWidth={r * 0.09} />
      {Array.from({ length: 12 }, (_, i) => {
        const t = (i / 12) * Math.PI * 2;
        return <line key={i} x1={x + Math.cos(t) * r * 0.78} y1={y + Math.sin(t) * r * 0.78} x2={x + Math.cos(t) * r * 0.9} y2={y + Math.sin(t) * r * 0.9} stroke={C.amber} strokeWidth={i % 3 ? 3 : 6} strokeLinecap="round" />;
      })}
      <path d={`M${x} ${y} L${x} ${y - r * 0.85} A${r * 0.85} ${r * 0.85} 0 ${wrap(angle, 360) > 180 ? 1 : 0} 1 ${x + Math.cos(a) * r * 0.85} ${y + Math.sin(a) * r * 0.85} Z`} fill={alpha(C.amber, 0.25)} />
      <line x1={x} y1={y} x2={x + Math.cos(a) * r * 0.82} y2={y + Math.sin(a) * r * 0.82} stroke={C.lever} strokeWidth={r * 0.08} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.1} fill={C.lever} />
      <circle cx={x + Math.cos(a) * r * 0.82} cy={y + Math.sin(a) * r * 0.82} r={r * 0.06 + Math.sin(f / 3)} fill="#FFE7A0" />
    </g>
  );
};

/** A small isometric cube (3-05): top, left and right faces lit from the upper left. */
export const IsoCube: React.FC<{ x: number; y: number; s: number; color?: string; opacity?: number }> = ({ x, y, s, color = C.amber, opacity = 1 }) => {
  // corners of a 2:1 iso cube whose front-top vertex is (x, y)
  const T = [x, y - s];
  const L = [x - s * 0.866, y - s * 0.5];
  const R = [x + s * 0.866, y - s * 0.5];
  const M = [x, y];
  const B = [x, y + s];
  const BL = [x - s * 0.866, y + s * 0.5];
  const BR = [x + s * 0.866, y + s * 0.5];
  const P = (pts: number[][]) => "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L") + " Z";
  return (
    <g opacity={opacity}>
      <path d={P([T, R, M, L])} fill={mixHex(color, "#FFFFFF", 0.35)} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d={P([L, M, B, BL])} fill={color} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d={P([M, R, BR, B])} fill={mixHex(color, "#7A2E10", 0.4)} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
    </g>
  );
};

/** A coil spring between y0 (top) and y1 (bottom) at x (4-05). */
export const Spring: React.FC<{ x: number; y0: number; y1: number; w?: number; coils?: number; color?: string }> = ({ x, y0, y1, w = 70, coils = 7, color = C.teal }) => {
  const n = coils * 2;
  const pts = Array.from({ length: n + 1 }, (_, i) => `${(x + (i === 0 || i === n ? 0 : i % 2 ? -w / 2 : w / 2)).toFixed(1)} ${(y0 + ((y1 - y0) * i) / n).toFixed(1)}`);
  return (
    <g>
      <path d={"M" + pts.join(" L")} fill="none" stroke={INK} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
      <path d={"M" + pts.join(" L")} fill="none" stroke={color} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
      <rect x={x - w * 0.7} y={y1 - 6} width={w * 1.4} height={16} rx={6} fill={INK} />
    </g>
  );
};

/** A stiff (rigid) ball: the warm regolith disc with a riveted steel-free rim (bolts that catch the light) turning at
 *  `spin` deg/f. Bolts are dark-teal with a gold glint (never grey). */
export const StiffBall: React.FC<{ x: number; y: number; r: number; f: number; spin?: number; bolts?: number; half?: "left" | "right" }> = ({ x, y, r, f, spin = 4, bolts = 12, half }) => {
  const id = "stb" + sid(useId());
  const a0 = f * spin;
  return (
    <g>
      <defs>
        <radialGradient id={id} cx="0.36" cy="0.32" r="0.8">
          <stop offset="0" stopColor={C.moonLit} />
          <stop offset="0.62" stopColor={C.moonMid} />
          <stop offset="1" stopColor={C.moonShade} />
        </radialGradient>
        <clipPath id={id + "h"}>
          <rect x={half === "right" ? x : x - r * 1.3} y={y - r * 1.3} width={half ? r * 1.3 : r * 2.6} height={r * 2.6} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}h)`}>
        <circle cx={x} cy={y} r={r} fill={`url(#${id})`} stroke={C.tealDeep} strokeWidth={r * 0.12} />
        {/* cross braces turning with the ball: it holds its shape */}
        {[0, 60, 120].map((d) => {
          const t = (a0 + d) * D2R;
          return <line key={d} x1={x - Math.cos(t) * r * 0.82} y1={y - Math.sin(t) * r * 0.82} x2={x + Math.cos(t) * r * 0.82} y2={y + Math.sin(t) * r * 0.82} stroke={C.moonShade} strokeWidth={r * 0.07} strokeLinecap="round" opacity={0.75} />;
        })}
        {Array.from({ length: bolts }, (_, i) => {
          const t = (a0 + (i * 360) / bolts) * D2R;
          const bx = x + Math.cos(t) * r * 0.88;
          const by = y + Math.sin(t) * r * 0.88;
          const lit = Math.max(0, -Math.cos(t + 0.8));
          return (
            <g key={i}>
              <circle cx={bx} cy={by} r={r * 0.075} fill={C.tealDeep} />
              <circle cx={bx - r * 0.02} cy={by - r * 0.02} r={r * 0.035} fill={mixHex(C.teal, "#FFE7A0", lit)} />
            </g>
          );
        })}
      </g>
    </g>
  );
};

/** A fluid ball (a blob that wobbles and sloshes): `slosh` -1..1 leans it, ripple rings travel across it. */
export const FluidBall: React.FC<{ x: number; y: number; r: number; f: number; wobble?: number; slosh?: number; squash?: number; half?: "left" | "right" }> = ({ x, y, r, f, wobble = 0.06, slosh = 0, squash = 0, half }) => {
  const id = "flb" + sid(useId());
  const pts: string[] = [];
  for (let k = 0; k <= 60; k++) {
    const a = (k / 60) * Math.PI * 2;
    const w = 1 + wobble * (Math.sin(a * 3 + f * 0.24) * 0.6 + Math.sin(a * 5 - f * 0.33) * 0.4) + slosh * 0.12 * Math.cos(a);
    const rx = r * (1 + squash * 0.25);
    const ry = r * (1 - squash * 0.2);
    pts.push(`${(x + Math.cos(a) * rx * w).toFixed(1)} ${(y + Math.sin(a) * ry * w + (Math.sin(a) > 0 ? squash * r * 0.1 : 0)).toFixed(1)}`);
  }
  const d = "M" + pts.join(" L") + " Z";
  return (
    <g>
      <defs>
        <radialGradient id={id} cx={0.38 + slosh * 0.1} cy="0.3" r="0.85">
          <stop offset="0" stopColor="#FFD27A" />
          <stop offset="0.55" stopColor={C.moonMid} />
          <stop offset="1" stopColor={C.moonShade} />
        </radialGradient>
        <clipPath id={id + "c"}>
          <path d={d} />
        </clipPath>
        <clipPath id={id + "h"}>
          <rect x={half === "right" ? x : x - r * 1.5} y={y - r * 1.5} width={half ? r * 1.5 : r * 3} height={r * 3} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}h)`}>
        <path d={d} fill={`url(#${id})`} stroke={C.model} strokeWidth={r * 0.06} strokeLinejoin="round" />
        <g clipPath={`url(#${id}c)`}>
          {[0, 1, 2, 3].map((k) => {
            const rr = fr(f / 36 + k / 4) * r * 1.3;
            return <ellipse key={k} cx={x + slosh * r * 0.2} cy={y + r * 0.1} rx={rr} ry={rr * 0.8} fill="none" stroke={C.moonGlow} strokeWidth={r * 0.05} opacity={0.7 * (1 - rr / (r * 1.3))} />;
          })}
          <ellipse cx={x - r * 0.35 + slosh * r * 0.15} cy={y - r * 0.45} rx={r * 0.32} ry={r * 0.13} fill="#FFFFFF" opacity={0.4} />
        </g>
      </g>
    </g>
  );
};

/** A fat pull arrow from (x0,y0) to (x1,y1) with chevrons crawling toward the head at `crawl` px/f (4-02). */
export const FatArrow: React.FC<{ x0: number; y0: number; x1: number; y1: number; width: number; f: number; color?: string; crawl?: number }> = ({ x0, y0, x1, y1, width, f, color = C.lever, crawl = 22 }) => {
  const id = "fa" + sid(useId());
  const L = Math.hypot(x1 - x0, y1 - y0);
  if (L < 4) return null;
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  const hl = Math.min(L * 0.5, width * 1.5);
  const sh = L - hl;
  const w2 = width / 2;
  const body = `M0 ${-w2} L${sh} ${-w2} L${sh} ${-w2 * 1.9} L${L} 0 L${sh} ${w2 * 1.9} L${sh} ${w2} L0 ${w2} Z`;
  const gap = Math.max(36, width * 1.1);
  const off = wrap(f * crawl, gap);
  return (
    <g transform={`translate(${x0} ${y0}) rotate(${ang.toFixed(2)})`}>
      <defs>
        <clipPath id={id}>
          <path d={body} />
        </clipPath>
      </defs>
      <path d={body} fill="#2A0E04" transform="translate(4 6)" opacity={0.35} />
      <path d={body} fill={color} stroke="#2A0E04" strokeWidth={6} strokeLinejoin="round" />
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: Math.ceil(L / gap) + 2 }, (_, i) => {
          const cx = -gap + i * gap + off;
          return <path key={i} d={`M${cx - w2 * 0.5} ${-w2 * 1.4} L${cx + w2 * 0.3} 0 L${cx - w2 * 0.5} ${w2 * 1.4}`} fill="none" stroke="#FFE08A" strokeWidth={Math.max(5, width * 0.18)} strokeLinecap="round" strokeLinejoin="round" opacity={0.75} />;
        })}
      </g>
    </g>
  );
};

/** A horizontal dimension line from x0 to x1 at y with end ticks; `draw` 0..1 grows it from x0 with a lit head. */
export const DimLine: React.FC<{ x0: number; x1: number; y: number; draw?: number; color?: string; tick?: number; width?: number }> = ({ x0, x1, y, draw = 1, color = C.moonRim, tick = 26, width = 6 }) => {
  const d = cl01(draw);
  const xe = x0 + (x1 - x0) * d;
  return (
    <g>
      <line x1={x0} y1={y - tick} x2={x0} y2={y + tick} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <line x1={x0} y1={y} x2={xe} y2={y} stroke={color} strokeWidth={width} strokeLinecap="round" />
      {d >= 1 ? <line x1={x1} y1={y - tick} x2={x1} y2={y + tick} stroke={color} strokeWidth={width} strokeLinecap="round" /> : null}
      {d > 0 && d < 1 ? (
        <g>
          <circle cx={xe} cy={y} r={width * 4} fill={color} opacity={0.3} />
          <circle cx={xe} cy={y} r={width * 1.6} fill={color} />
        </g>
      ) : null}
    </g>
  );
};

/** Near half gold / far half teal tint over a ball (3-10): `dir` deg toward the Earth (90 = down). */
export const HalfTint: React.FC<{ x: number; y: number; r: number; dir: number; k?: number }> = ({ x, y, r, dir, k = 1 }) => {
  const id = "ht" + sid(useId());
  return (
    <g transform={`translate(${x} ${y}) rotate(${dir - 180})`} opacity={cl01(k)}>
      <defs>
        <clipPath id={id}>
          <circle cx={0} cy={0} r={r} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x={-r * 1.1} y={-r * 1.1} width={r * 1.1} height={r * 2.2} fill={C.moonRim} opacity={0.42} />
        <rect x={0} y={-r * 1.1} width={r * 1.1} height={r * 2.2} fill={C.teal} opacity={0.5} />
      </g>
      <line x1={0} y1={-r} x2={0} y2={r} stroke="#FFE7A0" strokeWidth={4} strokeDasharray="12 8" opacity={0.8} />
    </g>
  );
};

/** A glow halo ring that pulses (4-15). */
export const Halo: React.FC<{ x: number; y: number; r: number; f: number; color?: string }> = ({ x, y, r, f, color = C.moonRim }) => (
  <g>
    {[0, 1, 2].map((k) => {
      const t = fr(f / 45 + k / 3);
      return <circle key={k} cx={x} cy={y} r={r * (1 + t * 1.4)} fill="none" stroke={color} strokeWidth={6 * (1 - t) + 1} opacity={0.6 * (1 - t)} />;
    })}
    <Bloom x={x} y={y} r={r * 3} color={color} strength={0.35} />
  </g>
);

export type { Family };
