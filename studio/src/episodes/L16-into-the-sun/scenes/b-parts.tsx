// L16 package B helpers (scenes l03, l04, l05 only; BUILD.md §6). Small drawing helpers and three bespoke movers that the
// shared foundation does not have (a side-on limb, streaks that bend round a shield edge, a spiky boundary line). No
// figures live here: every numeral a caller passes goes through sundata.ts `assertAllowed` (Tag, Readout).
// F1: Tick only on a ledge, the ruler or the studio floor (never in gas). F5: no face on the Sun. F8: nothing glows red.
import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { Bloom, CycClouds, Family, HazeBand, IF2, Layer, STUDIO_SET, Sky, Stars, Tick, alpha, cutPop, mixHex, ramp, rnd, smoothPath, type Expression, type Pose, type Pt } from "../../../lib/illustrated";
import { L16_COLORS, STAR_TINTS, familyOf, pillFill, sunGradient } from "../families";
import { Granules } from "../movers16";
import { assertAllowed } from "../sundata";

export const C = L16_COLORS;
export const STU = STUDIO_SET;
export const SPACE = familyOf("space");
export const CORONA = familyOf("corona");
export const GLOW = familyOf("glow");
export const CELLS = familyOf("cells");
export const SHADE = familyOf("shade");
export const cl01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** eased 0..1 between frames a and b */
export const ez = (f: number, a: number, b: number) => ramp(f, a, b);
/** linear 0..1 between frames a and b */
export const lin = (f: number, a: number, b: number) => cl01((f - a) / Math.max(1, b - a));
const mod = (a: number, n: number) => ((a % n) + n) % n;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const D2R = Math.PI / 180;

/** A hard cut's pop (scale bump over 9 frames). */
export const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/** Counter text rolling to a TABLE value `v` (k 0..1): commas, fixed decimals. */
export const rollText = (v: number, k: number, decimals = 0) =>
  (v * cl01(k)).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** A pill that keeps its text EXACTLY as written (units keep their case); numerals checked against sundata.ts. */
export const Tag: React.FC<{ x: number; y: number; text: string; F: Family; dot?: string; size?: number; align?: "start" | "end" | "middle"; opacity?: number; color?: string; stroke?: string; fill?: string }> = ({
  x,
  y,
  text,
  F,
  dot,
  size = 30,
  align = "start",
  opacity = 1,
  color,
  stroke,
  fill,
}) => {
  assertAllowed(text, "b-parts Tag");
  if (opacity <= 0.001) return null;
  const w = text.length * size * 0.6 + size * (dot ? 2.4 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  const a = cl01(opacity);
  return (
    <g opacity={a} transform={`translate(0 ${((1 - a) * 14).toFixed(1)})`}>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill ?? pillFill(F)} stroke={stroke ?? alpha(C.saffronCore, 0.55)} strokeWidth={2.5} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.08, fill: color ?? "#FFF8EC" }}>
        {text}
      </text>
    </g>
  );
};

/**
 * A big readout on a dark slab. `text` = the FINAL table string (asserted against sundata.ts); `shown` = what is drawn now
 * (a rolling counter on its way to `text`). Units are drawn exactly as written (km, °C, °F: no labelCase).
 */
export const Readout: React.FC<{ x: number; y: number; text: string; shown?: string; size?: number; F: Family; opacity?: number; color?: string; align?: "start" | "middle"; scaleY?: number }> = ({
  x,
  y,
  text,
  shown,
  size = 92,
  F,
  opacity = 1,
  color = "#FFF8EC",
  align = "start",
  scaleY = 1,
}) => {
  assertAllowed(text, "b-parts Readout");
  if (opacity <= 0.001) return null;
  const s = shown ?? text;
  const w = Math.max(s.length, text.length) * size * 0.56 + size * 0.7;
  const x0 = align === "start" ? x - size * 0.35 : x - w / 2;
  return (
    <g opacity={cl01(opacity)} transform={`translate(0 ${y}) scale(1 ${scaleY.toFixed(3)}) translate(0 ${-y})`}>
      <rect x={x0} y={y - size * 0.98} width={w} height={size * 1.3} rx={size * 0.2} fill={pillFill(F)} stroke={alpha(C.saffron, 0.75)} strokeWidth={3} />
      <text
        x={align === "start" ? x : x}
        y={y}
        textAnchor={align === "start" ? "start" : "middle"}
        style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: size, fontVariantNumeric: "tabular-nums", fill: color, letterSpacing: -size * 0.02 }}
      >
        {s}
      </text>
    </g>
  );
};

export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string; w?: number; head?: number; opacity?: number }> = ({ x1, y1, x2, y2, color, w = 12, head = 34, opacity = 1 }) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const L = Math.hypot(x2 - x1, y2 - y1);
  if (L < 2) return null;
  const hl = Math.min(head, L * 0.6);
  const hx = x2 - Math.cos(a) * hl;
  const hy = y2 - Math.sin(a) * hl;
  const n = [Math.cos(a + Math.PI / 2), Math.sin(a + Math.PI / 2)];
  const hw = hl * 0.62;
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <path d={`M${x2} ${y2} L${hx + n[0] * hw} ${hy + n[1] * hw} L${hx - n[0] * hw} ${hy - n[1] * hw} Z`} fill={color} />
    </g>
  );
};

/** The teal studio cyclorama (STUDIO_SET, never bone): sky, cyc clouds, floor; children on depth 1. */
export const StudioSet: React.FC<{ f: number; children?: React.ReactNode; seed?: number; floor?: number }> = ({ f, children, seed = 4, floor = 860 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={STU} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f} y={70} n={5} seed={seed} />
    </Layer>
    <Layer depth={0.6}>
      <rect x={-1400} y={floor - 30} width={4800} height={1200} fill={mixHex(STU.mid, "#FFE4A8", 0.15)} />
      <HazeBand y={floor - 160} h={180} color={STU.haze} strength={0.7} x={-1400} w={4800} />
    </Layer>
    <Layer depth={1}>
      <rect x={-1400} y={floor + 40} width={4800} height={1200} fill={mixHex(STU.mid, STU.near, 0.55)} />
      {children}
    </Layer>
  </>
);

/** A saturated paper-teal plate with gold and violet insets (studio panels stay saturated, storyboard §1 chroma plan). */
export const Plate: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; tint?: string }> = ({ x, y, w, h, children, tint = "#1F7F86" }) => (
  <g>
    <rect x={x + 10} y={y + 14} width={w} height={h} rx={28} fill="#0F3A44" opacity={0.35} />
    <rect x={x} y={y} width={w} height={h} rx={28} fill={tint} stroke={C.gold} strokeWidth={5} />
    <rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} rx={20} fill="none" stroke={alpha(C.violet, 0.7)} strokeWidth={3} />
    {children}
  </g>
);

/** Deep space field: the family sky + three tinted star layers (never grey-white). Put it in a far Layer. */
export const SpaceField: React.FC<{ f: number; n?: number; seed?: number }> = ({ f, n = 70, seed = 1 }) => (
  <g>
    <Sky family={SPACE} />
    {STAR_TINTS.slice(0, 3).map((c, i) => (
      <Stars key={i} frame={f} n={Math.round(n / 3)} x={-300} y={-300} w={2520} h={1680} color={c} seed={seed * 5 + i} size={1.8 + i * 0.5} />
    ))}
  </g>
);

/** Tick on a small floating survey ledge (F1: never in gas). (x, y) = Tick's feet. */
export const Ledge: React.FC<{
  x: number;
  y: number;
  f: number;
  pose?: Pose;
  poseTo?: Pose;
  poseT?: number;
  expression?: Expression;
  expressionTo?: Expression;
  expressionT?: number;
  facing?: 1 | -1;
  pxPerM?: number;
  staff?: boolean;
  look?: number;
  headTilt?: number;
  tilt?: number;
  squash?: { sx: number; sy: number };
  w?: number;
}> = ({ x, y, f, pxPerM = 80, w = 190, ...p }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={18} rx={7} fill={mixHex(C.saffronDeep, C.indigo, 0.35)} />
    <rect x={x - w / 2} y={y} width={w} height={6} rx={3} fill={C.saffron} />
    {Array.from({ length: Math.floor(w / 24) }, (_, i) => (
      <line key={i} x1={x - w / 2 + 12 + i * 24} y1={y + 6} x2={x - w / 2 + 12 + i * 24} y2={y + (i % 2 ? 12 : 17)} stroke={C.saffronCore} strokeWidth={2} />
    ))}
    {[-1, 1].map((s) => (
      <path key={s} d={`M${x + s * (w / 2 - 20)} ${y + 18} L${x + s * 18} ${y + 70}`} stroke={alpha(C.saffron, 0.6)} strokeWidth={4} />
    ))}
    <circle cx={x} cy={y + 74} r={9} fill={C.saffron} opacity={0.7 + 0.3 * Math.sin(f / 6)} />
    <Tick x={x} y={y} pxPerM={pxPerM} frame={f} {...p} />
  </g>
);

/** A few BIG bright sparks streaming (hot but thin: few, large, fast). `angle` deg, `speed` px/f, inside a box. */
export const Sparks: React.FC<{ f: number; n?: number; speed?: number; angle?: number; box?: { x: number; y: number; w: number; h: number }; r?: number; seed?: number; color?: string; tail?: number; opacity?: number }> = ({
  f,
  n = 14,
  speed = 20,
  angle = 0,
  box = { x: 0, y: 0, w: 1920, h: 1080 },
  r = 13,
  seed = 3,
  color = C.whiteGold,
  tail = 120,
  opacity = 1,
}) => {
  const ct = Math.cos(angle * D2R);
  const st = Math.sin(angle * D2R);
  const along = Math.abs(ct) * box.w + Math.abs(st) * box.h + 400;
  const across = Math.abs(st) * box.w + Math.abs(ct) * box.h;
  const mx = box.x + box.w / 2;
  const my = box.y + box.h / 2;
  return (
    <g opacity={opacity}>
      {Array.from({ length: n }, (_, i) => {
        const sp = speed * (0.8 + 0.4 * rnd(seed * 17 + i));
        const a = mod(rnd(seed * 5 + i) * along + f * sp, along) - along / 2;
        const b = (rnd(seed * 11 + i) - 0.5) * across + Math.sin(f / 11 + i) * 14;
        const hx = mx + ct * a - st * b;
        const hy = my + st * a + ct * b;
        const rr = r * (0.7 + 0.6 * rnd(seed * 13 + i));
        const L = tail * (0.6 + 0.6 * rnd(seed * 7 + i));
        return (
          <g key={i}>
            <path d={`M${(hx - ct * L).toFixed(1)} ${(hy - st * L).toFixed(1)} L${(hx - st * rr).toFixed(1)} ${(hy + ct * rr).toFixed(1)} L${(hx + st * rr).toFixed(1)} ${(hy - ct * rr).toFixed(1)} Z`} fill={alpha(C.gold, 0.55)} />
            <circle cx={hx} cy={hy} r={rr * 1.9} fill={alpha(C.amber, 0.3)} />
            <circle cx={hx} cy={hy} r={rr} fill={color} />
          </g>
        );
      })}
    </g>
  );
};

/** Heat shimmer: wavy bright strokes rising at `speed` px/f across a box (a large-area mover, not motes). */
export const Shimmer: React.FC<{ f: number; x: number; y: number; w: number; h: number; n?: number; speed?: number; color?: string; opacity?: number; seed?: number; len?: number; width?: number }> = ({
  f,
  x,
  y,
  w,
  h,
  n = 14,
  speed = 10,
  color = C.whiteGold,
  opacity = 0.55,
  seed = 2,
  len = 180,
  width = 6,
}) => (
  <g fill="none" stroke={color} strokeLinecap="round" opacity={opacity}>
    {Array.from({ length: n }, (_, i) => {
      const sx = x + rnd(seed * 7 + i) * w;
      const span = h + len;
      const sy = y + h - mod(rnd(seed * 3 + i) * span + f * speed * (0.8 + 0.4 * rnd(i + seed)), span);
      const pts: Pt[] = Array.from({ length: 7 }, (_, k) => [sx + Math.sin(k * 1.1 + f / 6 + i) * 16, sy + (k * len) / 6]);
      const u = cl01((y + h - sy) / Math.max(1, h));
      return <path key={i} d={smoothPath(pts, 0.5)} strokeWidth={width * (0.7 + 0.6 * rnd(seed * 11 + i))} opacity={Math.min(1, u * 4) * Math.min(1, (1 - u) * 3 + 0.2)} />;
    })}
  </g>
);

/** A vermilion "?" tag (vermilion is allowed on the "?" tags only, F9), popping in at `age` frames. */
export const QTag: React.FC<{ x: number; y: number; age: number; size?: number; f: number; mark?: string; fill?: string }> = ({ x, y, age, size = 80, f, mark = "?", fill = C.vermilion }) => {
  if (age < 0) return null;
  const k = age < 8 ? 0.3 + 0.9 * (age / 8) + 0.25 * Math.sin((age / 8) * Math.PI) : 1 + 0.06 * Math.sin(f / 5 + x);
  const bob = Math.sin(f / 9 + x * 0.01) * 10;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${k.toFixed(3)})`}>
      <circle cx={0} cy={0} r={size * 0.62} fill={fill} stroke={C.paper} strokeWidth={size * 0.06} />
      <text x={0} y={size * 0.3} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: size * 0.9, fill: C.paper }}>
        {mark}
      </text>
    </g>
  );
};

/** The Sun seen side-on at the LEFT edge (the ruler shots): disc gradient, boiling granules clipped to it, a bloom. No face,
 *  no outline (F5). `edge` = screen x of the limb on the ruler's line `y`. */
export const SideSun: React.FC<{ f: number; edge: number; y?: number; R?: number; granules?: boolean; bloom?: number }> = ({ f, edge, y = 540, R = 2600, granules = true, bloom = 1 }) => {
  const id = "ss" + sid(useId());
  const cx = edge - R;
  const circle = `M${cx - R} ${y} a${R} ${R} 0 1 0 ${2 * R} 0 a${R} ${R} 0 1 0 ${-2 * R} 0 Z`;
  const gx = Math.max(-400, edge - 900);
  return (
    <g>
      <defs>
        <radialGradient id={id} cx={cx} cy={y} r={R} gradientUnits="userSpaceOnUse">
          {sunGradient(R).map(([o, c], i) => (
            <stop key={i} offset={o} stopColor={c} />
          ))}
        </radialGradient>
      </defs>
      {bloom > 0 ? <Bloom x={edge} y={y} r={900} color={C.amber} strength={0.55 * bloom} /> : null}
      <circle cx={cx} cy={y} r={R} fill={`url(#${id})`} />
      {granules && edge > -300 ? <Granules f={f} x={gx} y={-300} w={edge - gx + 20} h={1700} size={84} drift={6} clip={circle} seed={7} colors={[alpha(C.tangerine, 0), C.amber, C.whiteGold]} opacity={0.55} /> : null}
      <circle cx={cx} cy={y} r={R - 30} fill="none" stroke={C.tangerine} strokeWidth={60} opacity={0.35} />
      <circle cx={cx} cy={y} r={R - 8} fill="none" stroke={C.magenta} strokeWidth={16} opacity={0.5} />
    </g>
  );
};

/**
 * Wind streaks that come from the LEFT (the Sun), meet a shield plate at x = sx (centre y = cy, height h) and bend round
 * its top and bottom edges, leaving the pocket behind it calm (4-20, 4-21). Streaks outside the shield's height pass
 * straight. Large-area mover: `speed` px/f, ≤ 80 streaks.
 */
export const BendStreaks: React.FC<{ f: number; sx: number; cy: number; h: number; speed?: number; n?: number; len?: number; width?: number; seed?: number; spread?: number; opacity?: number; from?: string; to?: string }> = ({
  f,
  sx,
  cy,
  h,
  speed = 22,
  n = 70,
  len = 170,
  width = 7,
  seed = 5,
  spread = 0.18,
  opacity = 0.9,
  from = C.gold,
  to = C.amber,
}) => {
  const out: React.ReactNode[] = [];
  const N = Math.min(80, n);
  for (let i = 0; i < N; i++) {
    const y0 = -120 + rnd(seed * 3 + i) * 1320;
    const dy = y0 - cy;
    const inside = Math.abs(dy) < h / 2 + 40;
    const side = dy < 0 ? -1 : 1;
    const edgeY = cy + side * (h / 2 + 34 + Math.abs(dy) * 0.12);
    const path: Pt[] = inside
      ? [
          [-300, y0],
          [sx - 160, y0],
          [sx - 40, lerp(y0, edgeY, 0.75)],
          [sx + 40, edgeY],
          [sx + 500, edgeY + side * 80 * spread * 6],
          [2300, edgeY + side * (260 + Math.abs(dy) * spread * 2)],
        ]
      : [
          [-300, y0],
          [2300, y0 + side * Math.max(0, 300 - Math.abs(dy) + h / 2) * spread],
        ];
    const seg = path.slice(1).map((p, k) => Math.hypot(p[0] - path[k][0], p[1] - path[k][1]));
    const total = seg.reduce((a, b) => a + b, 0);
    const sp = speed * (0.8 + 0.4 * rnd(seed * 7 + i));
    const L = len * (0.6 + 0.7 * rnd(seed * 11 + i));
    const head = mod(rnd(seed * 5 + i) * (total + L) + f * sp, total + L);
    const at = (d: number): Pt => {
      let s = Math.max(0, Math.min(total, d));
      for (let k = 0; k < seg.length; k++) {
        if (s <= seg[k]) {
          const u = s / Math.max(1, seg[k]);
          return [lerp(path[k][0], path[k + 1][0], u), lerp(path[k][1], path[k + 1][1], u)];
        }
        s -= seg[k];
      }
      return path[path.length - 1];
    };
    const pts: Pt[] = Array.from({ length: 6 }, (_, k) => at(head - L + (k * L) / 5));
    const w = width * (0.6 + 0.8 * rnd(seed * 13 + i));
    out.push(<path key={i} d={smoothPath(pts, 0.5)} fill="none" stroke={mixHex(from, to, rnd(seed * 17 + i))} strokeWidth={w} strokeLinecap="round" opacity={0.55 + 0.45 * rnd(seed * 19 + i)} />);
  }
  return <g opacity={opacity}>{out}</g>;
};

/** A near-horizontal boundary line across the frame whose spikes and valleys grow and shrink (amplitude `amp` px, ≈ 17
 *  px/f at amp 160): 3-12. `grow` 0..1 fades the spikes in. */
const spikeX = (f: number, k: number, x0: number, x1: number) => x0 + ((k + 0.5) / 7) * (x1 - x0) + Math.sin(f / 40 + k) * 30;
/** y of the spiky boundary at screen x (SpikyLine's shape; spikes and valleys at 7 fixed places, heights breathing). */
export const spikyY = (f: number, x: number, y: number, amp = 160, grow = 1, x0 = -100, x1 = 2020, seed = 3) => {
  const base = Math.sin(x / 210 + f * 0.05) * 22 + Math.sin(x / 90 - f * 0.08 + seed) * 10;
  let sp = 0;
  for (let k = 0; k < 7; k++) {
    const px = spikeX(f, k, x0, x1);
    const wdt = 34 + 20 * rnd(seed * 9 + k);
    const hgt = amp * (0.55 + 0.45 * Math.sin(f / 9.5 + k * 1.9)) * (k % 2 ? 1 : -0.8);
    sp += hgt * Math.exp(-((x - px) * (x - px)) / (2 * wdt * wdt));
  }
  return y + base - sp * cl01(grow);
};
/** Where spike k's tip is now (for a measuring rod that follows it). */
export const spikeTipY = (f: number, y: number, k: number, amp = 160, grow = 1, x0 = -100, x1 = 2020, seed = 3) => {
  const x = spikeX(f, k, x0, x1);
  return { x, y: spikyY(f, x, y, amp, grow, x0, x1, seed) };
};

export const SpikyLine: React.FC<{ f: number; y: number; x0?: number; x1?: number; amp?: number; grow?: number; color?: string; seed?: number }> = ({ f, y, x0 = -100, x1 = 2020, amp = 160, grow = 1, color = C.gold, seed = 3 }) => {
  const n = 90;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    pts.push([x, spikyY(f, x, y, amp, grow, x0, x1, seed)]);
  }
  const d = smoothPath(pts, 0.5);
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={26} opacity={0.2} strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={7} strokeDasharray="3 15" strokeDashoffset={-f * 2} strokeLinecap="round" />
    </g>
  );
};

/** A thermometer column (bulb at the bottom), filled up to `fill` px; the fill's top edge is the mover. */
export const Thermo: React.FC<{ x: number; y: number; h: number; fill: number; f: number; color?: string; w?: number }> = ({ x, y, h, fill, f, color = C.amber, w = 54 }) => {
  const top = y - h;
  const fy = y - Math.max(0, Math.min(h, fill));
  return (
    <g>
      <rect x={x - w / 2 - 8} y={top - 8} width={w + 16} height={h + 16} rx={(w + 16) / 2} fill={alpha(C.ink, 0.7)} stroke={C.paper} strokeWidth={4} />
      <circle cx={x} cy={y + w * 0.7} r={w * 0.95} fill={alpha(C.ink, 0.7)} stroke={C.paper} strokeWidth={4} />
      <rect x={x - w / 2} y={fy} width={w} height={y - fy + 10} rx={w / 2} fill={color} />
      <circle cx={x} cy={y + w * 0.7} r={w * 0.8} fill={color} />
      <rect x={x - w / 2 + 8} y={fy + 6} width={10} height={Math.max(0, y - fy - 10)} rx={5} fill="#FFFFFF" opacity={0.45} />
      <rect x={x - w / 2 - 14} y={fy - 5} width={w + 28} height={10} rx={5} fill={C.saffronCore} opacity={0.7 + 0.3 * Math.sin(f / 4)} />
    </g>
  );
};

/** Soft plasma blobs drifting UP at `speed` px/f (a camera sinking through the gas: 5-08, 5-09). */
export const PlasmaFlow: React.FC<{ f: number; speed?: number; n?: number; seed?: number; colors?: string[]; opacity?: number }> = ({ f, speed = 13, n = 34, seed = 4, colors = [C.gold, C.amber, C.tangerine, C.whiteGold], opacity = 0.8 }) => (
  <g opacity={opacity}>
    {Array.from({ length: n }, (_, i) => {
      const span = 1600;
      const r = 50 + rnd(seed * 3 + i) * 110;
      const x = -100 + rnd(seed * 7 + i) * 2120 + Math.sin(f / 30 + i) * 40;
      const y = 1300 - mod(rnd(seed * 5 + i) * span + f * speed * (0.75 + 0.5 * rnd(seed * 9 + i)), span);
      return <ellipse key={i} cx={x} cy={y} rx={r * 1.25} ry={r} fill={colors[i % colors.length]} opacity={0.35 + 0.35 * rnd(seed * 11 + i)} />;
    })}
  </g>
);

/** Rounded-rect loop point at arc length s (the same geometry as props16 WaterLoop): for the travelling heat packets. */
export const loopAt = (x: number, y: number, w: number, h: number, s0: number): Pt => {
  const TAU = Math.PI * 2;
  const r = Math.min(w, h) * 0.3;
  const per = 2 * (w + h) - 8 * r + TAU * r;
  let s = mod(s0, per);
  const segs: [number, (u: number) => Pt][] = [
    [w - 2 * r, (u) => [x + r + u, y]],
    [(TAU * r) / 4, (u) => [x + w - r + Math.sin(u / r) * r, y + r - Math.cos(u / r) * r]],
    [h - 2 * r, (u) => [x + w, y + r + u]],
    [(TAU * r) / 4, (u) => [x + w - r + Math.cos(u / r) * r, y + h - r + Math.sin(u / r) * r]],
    [w - 2 * r, (u) => [x + w - r - u, y + h]],
    [(TAU * r) / 4, (u) => [x + r - Math.sin(u / r) * r, y + h - r + Math.cos(u / r) * r]],
    [h - 2 * r, (u) => [x, y + h - r - u]],
    [(TAU * r) / 4, (u) => [x + r - Math.cos(u / r) * r, y + r - Math.sin(u / r) * r]],
  ];
  for (const [L, fn] of segs) {
    if (s <= L) return fn(s);
    s -= L;
  }
  return [x + r, y];
};
export const loopPer = (w: number, h: number) => {
  const r = Math.min(w, h) * 0.3;
  return 2 * (w + h) - 8 * r + Math.PI * 2 * r;
};

/** A simple speedometer (4-10): words SLOW · FAST only; needle `v` 0..1 with a jitter. */
export const Speedo: React.FC<{ x: number; y: number; r: number; v: number; f: number }> = ({ x, y, r, v, f }) => {
  const a0 = 200;
  const a1 = 340;
  const a = (a0 + (a1 - a0) * cl01(v) + Math.sin(f * 1.7) * 3 * v) * D2R;
  const arc = (rr: number, s: number, e: number) => {
    const p = (q: number) => `${(x + Math.cos(q * D2R) * rr).toFixed(1)} ${(y + Math.sin(q * D2R) * rr).toFixed(1)}`;
    return `M${p(s)} A${rr} ${rr} 0 0 1 ${p(e)}`;
  };
  return (
    <g>
      <circle cx={x} cy={y} r={r * 1.12} fill={C.ink} stroke={C.gold} strokeWidth={5} />
      <path d={arc(r * 0.86, a0, a1)} fill="none" stroke={alpha(C.cyan, 0.5)} strokeWidth={r * 0.14} />
      <path d={arc(r * 0.86, a0, a0 + (a1 - a0) * cl01(v))} fill="none" stroke={C.gold} strokeWidth={r * 0.14} />
      <text x={x - r * 0.62} y={y + r * 0.42} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: r * 0.2, letterSpacing: 2, fill: C.lavender }}>
        SLOW
      </text>
      <text x={x + r * 0.62} y={y + r * 0.42} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: r * 0.2, letterSpacing: 2, fill: C.gold }}>
        FAST
      </text>
      <line x1={x} y1={y} x2={x + Math.cos(a) * r * 0.82} y2={y + Math.sin(a) * r * 0.82} stroke={C.vermilion} strokeWidth={r * 0.07} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.1} fill={C.vermilion} />
    </g>
  );
};

/** A tall vertical sky in world coordinates (y from `top` to `bottom`) with these stops: for tilts through layers. */
export const TallSky: React.FC<{ top: number; bottom: number; stops: string[] }> = ({ top, bottom, stops }) => {
  const id = "ts" + sid(useId());
  return (
    <g>
      <defs>
        <linearGradient id={id} x1={0} y1={top} x2={0} y2={bottom} gradientUnits="userSpaceOnUse">
          {stops.map((c, i) => (
            <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect x={-1400} y={top} width={4720} height={bottom - top} fill={`url(#${id})`} />
    </g>
  );
};

/** A radial burst of big sparks from (x, y), `age` frames after it fires (≈ 20 px/f): 3-09, 4-15. */
export const Burst: React.FC<{ x: number; y: number; age: number; n?: number; speed?: number; life?: number; r?: number; seed?: number; color?: string }> = ({ x, y, age, n = 16, speed = 20, life = 26, r = 10, seed = 2, color = C.whiteGold }) => {
  if (age < 0 || age > life) return null;
  const u = age / life;
  return (
    <g>
      <Bloom x={x} y={y} r={60 + age * 8} color={C.whiteGold} strength={0.9 * (1 - u)} />
      {Array.from({ length: n }, (_, i) => {
        const th = ((i + rnd(seed * 7 + i) * 0.6) / n) * Math.PI * 2;
        const d = age * speed * (0.7 + 0.6 * rnd(seed * 3 + i));
        const px = x + Math.cos(th) * d;
        const py = y + Math.sin(th) * d;
        return (
          <g key={i} opacity={1 - u}>
            <line x1={x + Math.cos(th) * d * 0.55} y1={y + Math.sin(th) * d * 0.55} x2={px} y2={py} stroke={C.gold} strokeWidth={r * 0.6} strokeLinecap="round" />
            <circle cx={px} cy={py} r={r * (1 - u * 0.5)} fill={color} />
          </g>
        );
      })}
    </g>
  );
};
