// L16 package-A helpers (Cold, S01, S02, Closer only): small drawing pieces these four scenes share. Shot bodies stay
// bespoke in each scene file (hard rule 1). No figures live here: every number a shot draws comes from sundata.ts
// (READ / assertAllowed). Readouts with units are drawn as plain text (labelCase upper-cases "km").
import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { Bloom, CycClouds, Family, HazeBand, IF2, Layer, Metric, Motes, Sky, alpha, cutPop, labelCase, mixHex, ramp, rnd, smooth, smoothPath, type Pt } from "../../../lib/illustrated";
import { L16_COLORS, STAR_TINTS, familyOf, pillFill, sunGradient } from "../families";
import { assertAllowed } from "../sundata";
import { Granules } from "../movers16";
import { CoronaHalo } from "../sunbody";
import { Planet, partialPts } from "../props16";

export const C = L16_COLORS;
export const SPACE = familyOf("space");
export const CORONA = familyOf("corona");
export const GLOW = familyOf("glow");
export const SHADE = familyOf("shade");
export const CORE = familyOf("core");
export const STUDIO = familyOf("studio");
export const CREAM = "#FFF4E0";
export const INK = C.ink;
const D2R = Math.PI / 180;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const mod = (a: number, n: number) => ((a % n) + n) % n;

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
/** A number rolling up to `end` with `dp` decimals and thousands commas (Counters end on a sundata value). */
export const rollText = (end: number, k: number, dp = 0) => (end * cl01(k)).toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });

/** A hard cut's pop (scale bump over 9 frames). */
export const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

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

// ---------------------------------------------------------------------------------------------------------------
// the space field: the dark family's sky + two layers of tinted stars (never grey-white); `stream` px/f slides the near
// layer sideways as streaks (a camera moving past), `drift` the far one
// ---------------------------------------------------------------------------------------------------------------
export const SpaceField: React.FC<{ f: number; seed?: number; stream?: number; angle?: number; n?: number; x?: number; y?: number; w?: number; h?: number; lift?: number }> = ({
  f,
  seed = 3,
  stream = 0,
  angle = 180,
  n = 70,
  x = -400,
  y = -300,
  w = 2720,
  h = 1680,
  lift = 0,
}) => {
  const ct = Math.cos(angle * D2R);
  const st = Math.sin(angle * D2R);
  const layer = (depth: number, cnt: number, size: number, sd: number) =>
    Array.from({ length: cnt }, (_, i) => {
      const travel = f * stream * depth;
      const sx = x + mod(rnd(sd * 7 + i) * w + ct * travel, w);
      const sy = y + mod(rnd(sd * 11 + i) * h + st * travel, h);
      const col = STAR_TINTS[Math.floor(rnd(sd * 13 + i) * STAR_TINTS.length) % STAR_TINTS.length];
      const r = size * (0.6 + rnd(sd * 3 + i));
      const tw = 0.6 + 0.4 * Math.sin(f / (7 + rnd(sd * 17 + i) * 14) + i);
      const L = stream * depth * 2.2;
      return L > 3 ? (
        <line key={i} x1={sx} y1={sy} x2={sx - ct * L} y2={sy - st * L} stroke={col} strokeWidth={r * 1.3} strokeLinecap="round" opacity={tw} />
      ) : (
        <circle key={i} cx={sx} cy={sy} r={r} fill={col} opacity={tw} />
      );
    });
  return (
    <g>
      <Sky stops={[...SPACE.sky]} x={x} y={y} w={w} h={h} />
      {lift > 0 ? <rect x={x} y={y} width={w} height={h} fill={C.violet} opacity={lift} /> : null}
      {layer(0.35, Math.round(n * 0.6), 1.8, seed)}
      {layer(1, Math.round(n * 0.4), 3, seed + 9)}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// text
// ---------------------------------------------------------------------------------------------------------------
/** The episode pill (kit look, labelCase, the family shadow at 72 %); its numerals must be in sundata.ts. */
export const PillA: React.FC<{ x: number; y: number; text: string; F: Family; dot?: string; size?: number; align?: "start" | "middle" | "end"; opacity?: number }> = ({ x, y, text, F, dot, size = 26, align = "start", opacity = 1 }) => {
  if (opacity <= 0.01) return null;
  const t = assertAllowed(labelCase(text), "package-A pill");
  const w = t.length * size * 0.62 + size * (dot ? 2.4 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g opacity={opacity}>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={pillFill(F)} stroke={alpha(CREAM, 0.35)} strokeWidth={2} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.12, fill: CREAM }}>
        {t}
      </text>
    </g>
  );
};

/** A metric on a dark slab: `value` exactly as written, `unit` in its own case (km, km/s, mph); numerals checked. */
export const Slab: React.FC<{ x: number; y: number; value: string; unit?: string; size?: number; F: Family; opacity?: number; color?: string; check?: boolean; align?: "start" | "middle" }> = ({
  x,
  y,
  value,
  unit,
  size = 88,
  F,
  opacity = 1,
  color = CREAM,
  check = true,
  align = "start",
}) => {
  if (check) assertAllowed(value + (unit ? " " + unit : ""), "package-A slab");
  if (opacity <= 0.01) return null;
  const w = value.length * size * 0.58 + (unit ? unit.length * size * 0.25 + size * 0.3 : 0) + size * 0.6;
  const x0 = align === "middle" ? x - w / 2 + size * 0.3 : x;
  return (
    <g opacity={opacity}>
      <rect x={x0 - size * 0.3} y={y - size * 0.95} width={w} height={size * 1.25} rx={size * 0.18} fill={pillFill(F)} stroke={alpha(CREAM, 0.25)} strokeWidth={2} />
      <Metric x={x0} y={y} value={value} unit={unit} size={size} color={color} />
    </g>
  );
};

/** A plain diagram label (Anton caps), with a halo so it reads on busy art; numerals checked. */
export const Label: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; halo?: string; align?: "start" | "middle" | "end"; opacity?: number; raw?: boolean }> = ({
  x,
  y,
  text,
  size = 26,
  color = CREAM,
  halo = "#0B0828",
  align = "start",
  opacity = 1,
  raw = false,
}) => {
  const t = assertAllowed(raw ? text : labelCase(text), "package-A label");
  if (opacity <= 0.01) return null;
  const st: React.CSSProperties = { fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.1 };
  return (
    <g opacity={opacity}>
      <text x={x} y={y} textAnchor={align} style={{ ...st, fill: halo, stroke: halo, strokeWidth: size * 0.3, strokeLinejoin: "round", opacity: 0.8 }}>
        {t}
      </text>
      <text x={x} y={y} textAnchor={align} style={{ ...st, fill: color }}>
        {t}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// studio
// ---------------------------------------------------------------------------------------------------------------
/** The teal studio cyclorama (never bone): cyc clouds sliding, ochre floor; children on the floor plane. */
export const StudioRoom: React.FC<{ f: number; children?: React.ReactNode; hud?: React.ReactNode; seed?: number; floor?: number }> = ({ f, children, hud, seed = 4, floor = 900 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={STUDIO} x={-600} y={-300} w={3120} h={1700} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f} y={60} n={5} seed={seed} />
    </Layer>
    <Layer depth={0.6}>
      <rect x={-1400} y={floor - 30} width={4800} height={1200} fill={mixHex(STUDIO.mid, "#FFB45A", 0.25)} />
      <HazeBand y={floor - 160} h={180} color={STUDIO.haze} strength={0.6} x={-1400} w={4800} />
    </Layer>
    <Layer depth={1}>
      <rect x={-1400} y={floor + 40} width={4800} height={1200} fill={mixHex(STUDIO.mid, STUDIO.near, 0.55)} />
      {children}
    </Layer>
    <Layer depth={1.2}>
      <Motes frame={f} n={16} x={-100} y={60} w={2100} h={860} color={alpha(CREAM, 0.85)} seed={seed} size={5} drift={40} />
    </Layer>
    {hud ? <Layer depth={0}>{hud}</Layer> : null}
  </>
);

/** A saturated plate on the studio floor (paper-teal with a gold rule and a violet inset: never pale). */
export const Plate: React.FC<{ x: number; y: number; w: number; h: number; tilt?: number; fill?: string; children?: React.ReactNode }> = ({ x, y, w, h, tilt = 0, fill = "#1E5A6E", children }) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
    <rect x={10} y={14} width={w} height={h} rx={24} fill="#000" opacity={0.2} />
    <rect x={-8} y={-8} width={w + 16} height={h + 16} rx={28} fill={C.gold} />
    <rect x={0} y={0} width={w} height={h} rx={22} fill={fill} />
    <rect x={w - 90} y={h - 90} width={90} height={90} rx={22} fill={alpha(C.violet, 0.35)} />
    {children}
  </g>
);

/** A small saffron bracket for Tick to stand on (Tick never floats in gas, F1). */
export const Ledge: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 150 }) => (
  <g>
    <rect x={x} y={y} width={w} height={12} rx={4} fill={C.saffron} />
    <path d={`M${x + 8} ${y + 12} L${x + 8} ${y + 44} L${x + 40} ${y + 12} Z`} fill={C.saffronDeep} />
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// lines, arrows, strokes
// ---------------------------------------------------------------------------------------------------------------
/** A stroke drawing from (x1,y1) to (x2,y2) as k goes 0..1 with a glowing head (cross-outs, rays). */
export const Strike: React.FC<{ x1: number; y1: number; x2: number; y2: number; k: number; w?: number; color?: string }> = ({ x1, y1, x2, y2, k, w = 16, color = C.saffron }) => {
  const t = cl01(k);
  if (t <= 0) return null;
  const ex = x1 + (x2 - x1) * t;
  const ey = y1 + (y2 - y1) * t;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={INK} strokeWidth={w + 8} strokeLinecap="round" opacity={0.6} />
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={w} strokeLinecap="round" />
      {t < 1 ? <circle cx={ex} cy={ey} r={w * 0.9} fill={C.saffronCore} /> : null}
    </g>
  );
};

/** A path drawn by a head: `head` 0..1 by length; dotted (big round dots) or solid; dashes march with `f`. */
export const DrawnPath: React.FC<{ pts: Pt[]; head: number; f?: number; color?: string; width?: number; dots?: boolean; dashed?: boolean; headColor?: string; glow?: number; march?: number }> = ({
  pts,
  head,
  f = 0,
  color = C.saffron,
  width = 8,
  dots = false,
  dashed = false,
  headColor = C.saffronCore,
  glow = 0,
  march = 3,
}) => {
  const p = partialPts(pts, cl01(head));
  if (p.length < 2) return null;
  const d = smoothPath(p, 0.5);
  const tip = p[p.length - 1];
  const dash = dots ? `0.1 ${width * 3}` : dashed ? `${width * 2.4} ${width * 1.6}` : undefined;
  return (
    <g>
      {glow > 0 ? <path d={d} fill="none" stroke={color} strokeWidth={width * 4} opacity={glow * 0.25} strokeLinecap="round" /> : null}
      <path d={d} fill="none" stroke={color} strokeWidth={dots ? width * 1.6 : width} strokeLinecap="round" strokeDasharray={dash} strokeDashoffset={dash ? -f * march : undefined} />
      {head > 0 && head < 1 ? (
        <g>
          <Bloom x={tip[0]} y={tip[1]} r={width * 6} color={headColor} strength={0.7} />
          <circle cx={tip[0]} cy={tip[1]} r={width * 1.5} fill={headColor} stroke={color} strokeWidth={3} />
        </g>
      ) : null}
    </g>
  );
};

/** A fat arrow along a circle arc (centre cx,cy radius r) from angle a0 sweeping `sweep` degrees (+ = clockwise). */
export const ArcArrow: React.FC<{ cx: number; cy: number; r: number; a0: number; sweep: number; width?: number; color?: string; edge?: string }> = ({ cx, cy, r, a0, sweep, width = 34, color = C.gold, edge = C.saffronDeep }) => {
  if (Math.abs(sweep) < 1) return null;
  const n = Math.max(3, Math.ceil(Math.abs(sweep) / 3));
  const head = Math.min(Math.abs(sweep) * 0.5, (width * 1.4) / r / D2R);
  const s = Math.sign(sweep);
  const body = Math.abs(sweep) - head;
  const pt = (a: number, rr: number): Pt => [cx + Math.cos(a * D2R) * rr, cy + Math.sin(a * D2R) * rr];
  const outer: Pt[] = [];
  const inner: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + s * (body * i) / n;
    outer.push(pt(a, r + width / 2));
    inner.push(pt(a, r - width / 2));
  }
  const ae = a0 + s * body;
  const tip = pt(a0 + sweep, r);
  const d =
    "M" +
    outer.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L") +
    ` L${pt(ae, r + width).map((v) => v.toFixed(1)).join(" ")} L${tip[0].toFixed(1)} ${tip[1].toFixed(1)} L${pt(ae, r - width).map((v) => v.toFixed(1)).join(" ")} L` +
    inner
      .reverse()
      .map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
      .join(" L") +
    " Z";
  return <path d={d} fill={color} stroke={edge} strokeWidth={4} strokeLinejoin="round" />;
};

/** A fat straight arrow from (x1,y1) toward (x2,y2). */
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; width?: number; color?: string; edge?: string; opacity?: number }> = ({ x1, y1, x2, y2, width = 30, color = C.gold, edge = C.saffronDeep, opacity = 1 }) => {
  const L = Math.hypot(x2 - x1, y2 - y1);
  if (L < 4) return null;
  const a = Math.atan2(y2 - y1, x2 - x1) / D2R;
  const hl = Math.min(L * 0.6, width * 1.6);
  return (
    <g transform={`translate(${x1} ${y1}) rotate(${a.toFixed(2)})`} opacity={opacity}>
      <path d={`M0 ${-width / 2} L${L - hl} ${-width / 2} L${L - hl} ${-width} L${L} 0 L${L - hl} ${width} L${L - hl} ${width / 2} L0 ${width / 2} Z`} fill={color} stroke={edge} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};

/** Heat shimmer: wavy gold lines rising at `speed` px/f inside a box (a large-area mover for hot surfaces). */
export const Shimmer: React.FC<{ x: number; y: number; w: number; h: number; f: number; speed?: number; n?: number; color?: string; opacity?: number; vertical?: boolean }> = ({
  x,
  y,
  w,
  h,
  f,
  speed = 10,
  n = 7,
  color = C.gold,
  opacity = 0.5,
  vertical = false,
}) => {
  const lines = Array.from({ length: n }, (_, i) => {
    const u = mod(i / n + (f * speed) / (vertical ? w : h), 1);
    const pts: Pt[] = Array.from({ length: 13 }, (_, k) => {
      const s = k / 12;
      const wob = Math.sin(s * 9 + f / 5 + i * 1.7) * 14;
      return vertical ? [x + w - u * w + wob, y + s * h] : [x + s * w, y + h - u * h + wob];
    });
    const o = Math.sin(u * Math.PI);
    return <path key={i} d={smoothPath(pts, 0.5)} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" opacity={opacity * o} />;
  });
  return <g>{lines}</g>;
};

/** Expanding rings from a point (a beacon, a pop): one every `every` frames at `speed` px/f. */
export const Rings: React.FC<{ x: number; y: number; f: number; every?: number; speed?: number; maxR?: number; color?: string; width?: number; from?: number }> = ({ x, y, f, every = 24, speed = 22, maxR = 900, color = C.cyan, width = 8, from = 0 }) => {
  if (f < from) return null;
  const g = f - from;
  const life = maxR / speed;
  const n = Math.ceil(life / every) + 1;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const age = mod(g, every) + i * every;
        if (age > g) return null;
        const r = 20 + age * speed;
        if (r > maxR) return null;
        return <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={width} opacity={(1 - r / maxR) * 0.9} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// bodies
// ---------------------------------------------------------------------------------------------------------------
/** A whole Sun disc for the bird's-eye charts: gradient, boiling granules, a violet-magenta corona rim with loops.
 *  No face, no outline (F5). */
export const SunDisc: React.FC<{ x: number; y: number; r: number; f: number; halo?: number; seed?: number }> = ({ x, y, r, f, halo = 1, seed = 2 }) => {
  const id = "sd" + sid(useId());
  const circ = `M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  return (
    <g>
      {halo > 0 ? <CoronaHalo f={f} cx={x} cy={y} R={r} extent={r * 0.9} loops={6} a0={-175} a1={175} intensity={halo} seed={seed} /> : null}
      <defs>
        <radialGradient id={id}>
          {sunGradient(r).map(([o, c], i) => (
            <stop key={i} offset={o} stopColor={c} />
          ))}
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
      <Granules f={f} x={x - r} y={y - r} w={2 * r} h={2 * r} size={Math.max(20, r * 0.16)} drift={3} clip={circ} colors={[alpha(C.amber, 0), C.amber, C.whiteGold]} opacity={0.45} seed={seed} />
    </g>
  );
};

/** A row of Venus icons; `lit` 0..n lights them in order (each pops as it lights). */
export const VenusRow: React.FC<{ x: number; y: number; n?: number; gap?: number; r?: number; lit: number; f: number; vertical?: boolean }> = ({ x, y, n = 7, gap = 120, r = 34, lit, f, vertical = false }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const k = cl01(lit - i);
      const pop = k > 0 && k < 1 ? 1.35 - 0.35 * k : 1;
      const px = vertical ? x : x + i * gap;
      const py = vertical ? y + i * gap : y;
      return (
        <g key={i}>
          <circle cx={px} cy={py} r={r + 10} fill="none" stroke={C.gold} strokeWidth={4} opacity={k * 0.9} />
          {k > 0 ? <Bloom x={px} y={py} r={r * 2.4} color={C.gold} strength={0.5 * k} /> : null}
          <g opacity={0.35 + 0.65 * k} transform={`translate(${px} ${py}) scale(${pop}) translate(${-px} ${-py})`}>
            <Planet x={px} y={py} r={r} f={f} kind="venus" light={200} />
          </g>
        </g>
      );
    })}
  </g>
);

/** A numeral-free stopwatch (2-10): the hand sweeps to `angle` degrees; a ring pulses. */
export const Watch: React.FC<{ x: number; y: number; r: number; angle: number; f: number }> = ({ x, y, r, angle, f }) => {
  const a = ((angle - 90) * Math.PI) / 180;
  const wedge = Math.max(0.01, Math.min(359.9, angle));
  const p = (deg: number, rr: number) => `${(x + Math.cos((deg - 90) * D2R) * rr).toFixed(1)} ${(y + Math.sin((deg - 90) * D2R) * rr).toFixed(1)}`;
  return (
    <g>
      <rect x={x - r * 0.16} y={y - r - r * 0.34} width={r * 0.32} height={r * 0.22} rx={5} fill={C.saffron} stroke={INK} strokeWidth={3} />
      <circle cx={x} cy={y} r={r} fill={C.paper} stroke={INK} strokeWidth={6} />
      <path d={`M${x} ${y} L${p(0, r * 0.9)} A${r * 0.9} ${r * 0.9} 0 ${wedge > 180 ? 1 : 0} 1 ${p(wedge, r * 0.9)} Z`} fill={alpha(C.saffron, 0.55)} />
      {Array.from({ length: 12 }, (_, i) => {
        const th = (i * 30 * Math.PI) / 180;
        return <line key={i} x1={x + Math.cos(th) * r * 0.78} y1={y + Math.sin(th) * r * 0.78} x2={x + Math.cos(th) * r * 0.92} y2={y + Math.sin(th) * r * 0.92} stroke={INK} strokeWidth={4} />;
      })}
      <line x1={x} y1={y} x2={x + Math.cos(a) * r * 0.82} y2={y + Math.sin(a) * r * 0.82} stroke={C.vermilion} strokeWidth={9} strokeLinecap="round" />
      <circle cx={x} cy={y} r={12} fill={C.vermilion} />
      <circle cx={x} cy={y} r={r + 12} fill="none" stroke={C.saffron} strokeWidth={4} opacity={0.4 + 0.3 * Math.sin(f / 4)} />
    </g>
  );
};

/** A speed dial for the sums (1-06…1-08, 1-14, 1-16, 2-08): a 200° arc, zero at the top-centre when `centred`, needle in
 *  vermilion at `deg` (+ = clockwise), optional named marks (words only), a plate. No numerals on the face. */
export const SumDial: React.FC<{
  x: number;
  y: number;
  r: number;
  deg: number;
  f: number;
  title?: string;
  marks?: { deg: number; label: string; color?: string }[];
  centred?: boolean;
  plate?: string;
  ink?: string;
}> = ({ x, y, r, deg, f, title, marks = [], centred = true, plate = alpha("#0B0828", 0.82), ink = CREAM }) => {
  const base = centred ? -90 : 170; // screen angle of the zero
  const sweep0 = centred ? -100 : 0;
  const sweep1 = centred ? 100 : 200;
  const ang = (d: number) => base + d;
  const pt = (d: number, rr: number): Pt => [x + Math.cos(ang(d) * D2R) * rr, y + Math.sin(ang(d) * D2R) * rr];
  const arc = (d0: number, d1: number, rr: number) => {
    const [ax, ay] = pt(d0, rr);
    const [bx, by] = pt(d1, rr);
    return `M${ax.toFixed(1)} ${ay.toFixed(1)} A${rr} ${rr} 0 ${Math.abs(d1 - d0) > 180 ? 1 : 0} ${d1 > d0 ? 1 : 0} ${bx.toFixed(1)} ${by.toFixed(1)}`;
  };
  const [nx, ny] = pt(deg, r * 0.86);
  return (
    <g>
      <rect x={x - r - 50} y={y - r - (title ? 110 : 60)} width={2 * r + 100} height={r * 1.5 + (title ? 150 : 100)} rx={30} fill={plate} stroke={alpha(ink, 0.35)} strokeWidth={3} />
      {title ? <Label x={x} y={y - r - 52} text={title} size={30} align="middle" color={ink} /> : null}
      <path d={arc(sweep0, sweep1, r)} fill="none" stroke={alpha(ink, 0.25)} strokeWidth={22} strokeLinecap="round" />
      {Math.abs(deg) > 0.5 ? <path d={arc(0, deg, r)} fill="none" stroke={C.vermilion} strokeWidth={22} strokeLinecap="round" opacity={0.9} /> : null}
      {Array.from({ length: 21 }, (_, i) => {
        const d = sweep0 + ((sweep1 - sweep0) * i) / 20;
        const [ax, ay] = pt(d, r - 28);
        const [bx, by] = pt(d, r - (i % 5 ? 14 : 4));
        return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={ink} strokeWidth={i % 5 ? 3 : 5} opacity={0.75} />;
      })}
      {marks.map((m, i) => {
        const [ax, ay] = pt(m.deg, r - 36);
        const [bx, by] = pt(m.deg, r + 36);
        const [lx, ly] = pt(m.deg, r + 66);
        return (
          <g key={i}>
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke={m.color ?? C.saffron} strokeWidth={10} strokeLinecap="round" />
            <Label x={lx} y={ly + 8} text={m.label} size={22} align="middle" color={m.color ?? C.saffronCore} />
          </g>
        );
      })}
      <line x1={x} y1={y} x2={nx} y2={ny} stroke={C.vermilion} strokeWidth={12} strokeLinecap="round" />
      <circle cx={x} cy={y} r={20} fill={C.vermilion} stroke={C.bone} strokeWidth={4} />
      <circle cx={x} cy={y} r={r + 30} fill="none" stroke={C.saffron} strokeWidth={3} opacity={0.25 + 0.2 * Math.sin(f / 6)} />
    </g>
  );
};

/** A bar with diagonal stripes sliding along it at `speed` px/f (a speed bar that is alive while it holds). */
export const SpeedBar: React.FC<{ x: number; y: number; len: number; h?: number; f: number; color?: string; stripe?: string; speed?: number }> = ({ x, y, len, h = 70, f, color = C.gold, stripe = C.amber, speed = 18 }) => {
  if (len < 2) return null;
  const id = "sb" + sid(useId());
  const off = mod(f * speed, 60);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y - h / 2} width={len} height={h} rx={h / 2} />
        </clipPath>
      </defs>
      <rect x={x} y={y - h / 2} width={len} height={h} rx={h / 2} fill={color} />
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: Math.ceil(len / 60) + 3 }, (_, i) => {
          const sx = x - 120 + i * 60 + off;
          return <path key={i} d={`M${sx} ${y + h / 2} L${sx + 30} ${y + h / 2} L${sx + 30 + h * 0.7} ${y - h / 2} L${sx + h * 0.7} ${y - h / 2} Z`} fill={stripe} opacity={0.55} />;
        })}
      </g>
      <rect x={x} y={y - h / 2} width={len} height={h} rx={h / 2} fill="none" stroke={INK} strokeWidth={4} />
    </g>
  );
};

/** A small waving flag on a pole (Tick's survey flag; 6 px/f flap). */
export const Flag: React.FC<{ x: number; y: number; h?: number; f: number; color?: string }> = ({ x, y, h = 160, f, color = C.vermilion }) => {
  const w = h * 0.5;
  const pts: Pt[] = Array.from({ length: 9 }, (_, k) => [x + (w * k) / 8, y - h + Math.sin(k * 0.8 - f / 3) * 10 * (k / 8)]);
  const bot: Pt[] = pts.map(([px, py]): Pt => [px, py + h * 0.3]).reverse();
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - h - 8} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d={"M" + [...pts, ...bot].map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L") + " Z"} fill={color} stroke={INK} strokeWidth={3} />
    </g>
  );
};

/** A check-mark stamp slamming in (2-13's four passes): `age` frames since the slam. */
export const CheckStamp: React.FC<{ x: number; y: number; age: number; size?: number; lit?: boolean }> = ({ x, y, age, size = 70, lit = false }) => {
  if (age < 0) return null;
  const k = age < 6 ? 2.2 - 1.2 * (age / 6) ** 2 : 1;
  const ring = age >= 6 && age < 20 ? (age - 6) * 10 : -1;
  const col = lit ? C.stampGreen : mixHex(C.stampGreen, "#0B0828", 0.35);
  return (
    <g transform={`translate(${x} ${y})`}>
      {ring >= 0 ? <circle r={size / 2 + ring} fill="none" stroke={C.stampGreen} strokeWidth={5} opacity={1 - (age - 6) / 14} /> : null}
      <g transform={`scale(${k.toFixed(3)})`}>
        {lit ? <Bloom x={0} y={0} r={size * 1.3} color={C.stampGreen} strength={0.6} /> : null}
        <circle r={size / 2} fill={col} stroke={C.paper} strokeWidth={4} />
        <path d={`M${-size * 0.22} 0 L${-size * 0.05} ${size * 0.18} L${size * 0.25} ${-size * 0.18}`} fill="none" stroke={C.paper} strokeWidth={size * 0.12} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

/** Points along an ellipse (Sun at the left focus when `focus`), for lapping probes and nested orbits. */
export const ellipsePt = (cx: number, cy: number, rx: number, ry: number, t: number): Pt => [cx + Math.cos(t) * rx, cy + Math.sin(t) * ry];
