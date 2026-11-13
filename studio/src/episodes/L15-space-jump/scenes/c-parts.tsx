// Package C helpers (S06, S07, Closer only; BUILD.md §6). Small pieces the three scene files share; nothing here is a
// shared piece of the episode (those live in families.ts, jumpdata.ts, sky.tsx, props.tsx, L15Gauges.tsx).
// USAGE
//   view(altC, pxPerKm)            → { altTop, altBottom, y, h } for an oversized sky window centred on altC at y = 540
//   <SkyView f v ... />            SkyColumn + AltRuler for that window (the default mover when altC changes per frame)
//   <OrbitStars f speed />         tinted star field streaming sideways (orbit shots: the pair travels, the stars pass)
//   <ModelChip x y f />            the saffron OUR MODEL chip for row-20 shots without the gauge cluster (F5)
//   <Arrow x y len angle />        a fat arrow growing from (x, y); dashed for the dotted sideways arrow
//   <RollMetric x y value k unit /> a number rolling to a jumpdata.ts value (checked), unit kept in its case
//   <StudioSet f seed />           STUDIO_SET cyc (never bone) + CycClouds + floor (layers 0.05 / 0.2 / 0.6)
//   <Rings f cx cy />              rings launched every `every` frames
//   <Bar x y len h color />        a horizontal bar (grows with len)
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bloom, Counter, CycClouds, Family, IF2, Layer, STUDIO_SET, Sky, alpha, cutPop, labelCase, mixHex, rnd } from "../../../lib/illustrated";
import { L15_COLORS } from "../families";
import { assertAllowed } from "../jumpdata";
import { AltRuler, RulerFlag, RulerPin, SkyColumn } from "../sky";

export const C = L15_COLORS;
export const STUDIO: Family = STUDIO_SET;
export const CREAM = "#FFF4DE";
export const INK = "#0E2A3E";
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (u: number) => {
  const t = clamp01(u);
  return t * t * (3 - 2 * t);
};
/** eased 0..1 between frames a and b */
export const ez = (f: number, a: number, b: number) => sm((f - a) / Math.max(1, b - a));
/** linear 0..1 between frames a and b */
export const lin = (f: number, a: number, b: number) => clamp01((f - a) / Math.max(1, b - a));

/** Piecewise-linear value through [frame, value] keys (flat outside). */
export const path1 = (f: number, keys: [number, number][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (f <= f1) return v0 + ((v1 - v0) * (f - f0)) / Math.max(1e-6, f1 - f0);
  }
  return keys[keys.length - 1][1];
};

/** A hard cut's pop (scale bump over 9 frames). */
export const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

// ---------------------------------------------------------------------------------------------------------------
// the sky window
// ---------------------------------------------------------------------------------------------------------------
export const PAD = 180;
export type View = { altTop: number; altBottom: number; y: number; h: number; pxPerKm: number; altC: number };
/** A window (oversized by PAD px top and bottom, so the camera drift never shows an edge) centred on altC at y = 540. */
export const view = (altC: number, pxPerKm: number): View => ({
  altTop: altC + (540 + PAD) / pxPerKm,
  altBottom: altC - (540 + PAD) / pxPerKm,
  y: -PAD,
  h: 1080 + PAD * 2,
  pxPerKm,
  altC,
});
/** Screen y of an altitude in a view. */
export const vy = (v: View, alt: number) => 540 + (v.altC - alt) * v.pxPerKm;

export const SkyView: React.FC<{
  f: number;
  v: View;
  rulerX?: number;
  ruler?: boolean;
  pins?: RulerPin[];
  band?: { from: number; to: number; wipe: number; label?: string; color?: string };
  flags?: boolean | RulerFlag[];
  bands?: boolean | number;
  aurora?: boolean | number;
  ground?: boolean;
  drift?: number;
  streak?: number;
  numbers?: boolean;
  step?: number;
  rulerColor?: string;
  /** indigo lift over the near-black sky (value ≈ 0.3-0.4, high saturation); default by altitude, 0 = off */
  lift?: number;
}> = ({ f, v, rulerX = 200, ruler = true, pins, band, flags = true, bands, aurora = false, ground = true, drift = 0.4, streak = 0, numbers = true, step, rulerColor, lift }) => (
  <g>
    <SkyColumn f={f} altTop={v.altTop} altBottom={v.altBottom} x={-260} y={v.y} w={2440} h={v.h} bands={bands ?? (v.altC < 78 ? 1 : 0)} aurora={aurora} ground={ground} drift={drift} streak={streak} />
    {(lift ?? liftAt(v.altC)) > 0 ? <rect x={-260} y={v.y} width={2440} height={v.h} fill={LIFT} opacity={lift ?? liftAt(v.altC)} /> : null}
    {ruler ? <AltRuler f={f} altTop={v.altTop} altBottom={v.altBottom} x={rulerX} y={v.y} h={v.h} flags={flags} pins={pins} band={band} numbers={numbers} step={step} color={rulerColor} /> : null}
  </g>
);

/** Deep saturated indigo laid over the sky between ~35 and ~85 km (keeps true black for orbit and the edge). */
export const LIFT = "#3A2FC8";
export const liftAt = (alt: number) => 0.34 * sm((alt - 30) / 12) * (1 - sm((alt - 78) / 10));

/** The air passing a falling probe: vertical streaks scrolling UP at `speed` px/f over the whole frame; denser and
 *  brighter as the air thickens (`thick` 0..1). Teal-white streaks with a few saffron ones (never grey). */
export const AirStream: React.FC<{ f: number; speed: number; thick?: number; n?: number; seed?: number; x0?: number; x1?: number; tint?: string }> = ({ f, speed, thick = 0.5, n = 46, seed = 7, x0 = -100, x1 = 2020, tint = C.cloud }) => {
  const k = Math.max(0.15, Math.min(1, thick));
  const span = 1500;
  const m = Math.round(n * (0.45 + 0.55 * k));
  return (
    <g strokeLinecap="round">
      {Array.from({ length: m }, (_, i) => {
        const x = x0 + rnd(seed * 7 + i) * (x1 - x0);
        const len = 90 + rnd(seed * 3 + i) * 320 * (0.6 + k);
        const sp = speed * (0.7 + rnd(seed * 5 + i) * 0.6);
        const y = ((((rnd(seed * 11 + i) * span - f * sp) % span) + span) % span) - 220;
        const col = rnd(seed * 13 + i) > 0.82 ? C.saffronCore : rnd(seed * 17 + i) > 0.5 ? C.limb : tint;
        return <line key={i} x1={x} y1={y} x2={x} y2={y + len} stroke={col} strokeWidth={3 + rnd(i * 5 + seed) * 7 * (0.5 + k)} opacity={(0.18 + 0.32 * k) * (0.6 + rnd(i * 9) * 0.4)} />;
      })}
    </g>
  );
};

/** Wide soft wisps (airglow, haze, thin cloud) drifting at `vx`, `vy` px/f across the frame; large-area movers. */
export const Wisps: React.FC<{ f: number; vx?: number; vy?: number; n?: number; seed?: number; colors?: string[]; opacity?: number; y0?: number; y1?: number }> = ({
  f,
  vx = 0,
  vy = -8,
  n = 7,
  seed = 3,
  colors = [C.limb, C.teal, C.saffron],
  opacity = 0.22,
  y0 = -200,
  y1 = 1280,
}) => {
  const W = 2800;
  const H = y1 - y0;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const w = 500 + rnd(seed * 7 + i) * 700;
        const h = 40 + rnd(seed * 3 + i) * 90;
        const x = ((((rnd(seed * 11 + i) * W + f * vx) % W) + W) % W) - 440;
        const y = ((((rnd(seed * 13 + i) * H + f * vy) % H) + H) % H) + y0;
        const c = colors[i % colors.length];
        return (
          <g key={i} opacity={opacity}>
            <ellipse cx={x} cy={y} rx={w / 2} ry={h / 2} fill={c} opacity={0.55} />
            <ellipse cx={x} cy={y} rx={w * 0.32} ry={h * 0.22} fill={c} />
          </g>
        );
      })}
    </g>
  );
};

/** Clouds pinned to altitudes (km), so they stream past with the camera (6-11, 6-12). Teal-white, never grey. */
export const AltClouds: React.FC<{ f: number; v: View; n?: number; seed?: number; from?: number; to?: number }> = ({ f, v, n = 16, seed = 3, from = 1, to = 9 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const a = from + rnd(seed * 7 + i) * (to - from);
      const y = vy(v, a);
      if (y < -300 || y > 1400) return null;
      const w = 260 + rnd(seed * 11 + i) * 360;
      const x = -200 + rnd(seed * 13 + i) * 2200 + ((f * (0.6 + rnd(i) * 0.8)) % 400);
      const h = w * 0.32;
      return (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={w / 2} ry={h * 0.42} fill={C.cloudShade} />
          <ellipse cx={x - w * 0.18} cy={y - h * 0.28} rx={w * 0.24} ry={h * 0.5} fill={C.cloud} />
          <ellipse cx={x + w * 0.1} cy={y - h * 0.42} rx={w * 0.26} ry={h * 0.6} fill={C.cloud} />
          <ellipse cx={x + w * 0.3} cy={y - h * 0.2} rx={w * 0.18} ry={h * 0.42} fill={C.cloud} />
          <rect x={x - w * 0.4} y={y - h * 0.2} width={w * 0.8} height={h * 0.3} rx={h * 0.15} fill={C.cloud} />
        </g>
      );
    })}
  </g>
);

/** Tinted stars streaming sideways at `speed` px/f (two depths); `streak` px draws them as horizontal streaks. */
export const OrbitStars: React.FC<{ f: number; speed?: number; n?: number; seed?: number; streak?: number; y0?: number; y1?: number }> = ({ f, speed = 6, n = 90, seed = 11, streak = 0, y0 = -100, y1 = 1180 }) => {
  const W = 2600;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const depth = i % 3 === 0 ? 1 : 0.45;
        const x = ((((rnd(seed * 7 + i) * W - f * speed * depth) % W) + W) % W) - 340;
        const y = y0 + rnd(seed * 11 + i) * (y1 - y0);
        const r = (depth === 1 ? 2.4 : 1.4) * (0.6 + rnd(seed * 3 + i));
        const col = rnd(seed * 13 + i) > 0.55 ? C.starGold : C.starTeal;
        const tw = 0.65 + 0.35 * Math.sin(f / (7 + rnd(seed * 17 + i) * 14) + i);
        return streak > 0 ? (
          <line key={i} x1={x} y1={y} x2={x + streak * depth} y2={y} stroke={col} strokeWidth={r * 1.2} strokeLinecap="round" opacity={tw} />
        ) : (
          <circle key={i} cx={x} cy={y} r={r} fill={col} opacity={tw} />
        );
      })}
    </g>
  );
};

/** OUR MODEL chip (F5) for row-20 shots that do not show the gauge cluster. */
export const ModelChip: React.FC<{ x: number; y: number; f: number; size?: number }> = ({ x, y, f, size = 19 }) => {
  const w = size * 8.8;
  const h = size * 1.8;
  return (
    <g>
      <rect x={x} y={y - h / 2} width={w} height={h} rx={h / 2} fill={C.saffron} />
      <circle cx={x + size * 1.05} cy={y} r={size * 0.32} fill={C.vermilion} opacity={0.6 + 0.4 * Math.sin(f / 6)} />
      <text x={x + size * 1.8} y={y + size * 0.37} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.16, fill: "#1A1206" }}>
        {labelCase("our model")}
      </text>
    </g>
  );
};

/** A fat arrow from (x, y) along `angle` (deg, 0 = right), `len` px long; `dashed` for a dotted shaft. */
export const Arrow: React.FC<{ x: number; y: number; len: number; angle?: number; color?: string; width?: number; dashed?: boolean; f?: number; glow?: boolean }> = ({
  x,
  y,
  len,
  angle = 0,
  color = C.saffron,
  width = 14,
  dashed = false,
  f = 0,
  glow = false,
}) => {
  if (len <= 2) return null;
  const head = Math.min(len * 0.45, width * 2.6);
  const shaft = len - head;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      {glow ? <Bloom x={len - head / 2} y={0} r={width * 4} color={color} strength={0.5} /> : null}
      <line x1={0} y1={0} x2={shaft} y2={0} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? `${width * 1.2} ${width * 1.1}` : undefined} strokeDashoffset={dashed ? -f * 3 : undefined} />
      <path d={`M${shaft - 2} ${-width * 1.25} L${len} 0 L${shaft - 2} ${width * 1.25} Z`} fill={color} />
    </g>
  );
};

/** Big number rolling to a jumpdata.ts value (asserted), with a separate unit span in its own case and an optional slab. */
export const RollMetric: React.FC<{
  x: number;
  y: number;
  value: number;
  k: number;
  unit?: string;
  decimals?: number;
  size?: number;
  color?: string;
  pre?: string;
  slab?: string;
  unitColor?: string;
  /** words after the unit, label face, upper-cased (e.g. "· 20 KM", "A DAY") */
  tail?: string;
  who?: string;
}> = ({ x, y, value, k, unit, decimals = 0, size = 92, color = CREAM, pre = "", slab, unitColor, tail, who = "metric" }) => {
  assertAllowed(value, who);
  const t = clamp01(k);
  const preW = pre ? pre.length * size * 0.55 + size * 0.12 : 0;
  const digits = value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const numW = digits.replace(/[,.]/g, "").length * size * 0.6 + (digits.match(/[,.]/g)?.length ?? 0) * size * 0.24;
  const unitW = unit ? unit.length * size * 0.26 + size * 0.2 : 0;
  const tailW = tail ? tail.length * size * 0.36 + size * 0.3 : 0;
  const st: React.CSSProperties = { fontFamily: IF2.num, fontWeight: 800, fontSize: size, fontVariantNumeric: "tabular-nums", fill: color };
  return (
    <g>
      {slab ? <rect x={x - size * 0.3} y={y - size * 0.95} width={preW + numW + unitW + tailW + size * 0.6} height={size * 1.25} rx={size * 0.18} fill={slab} /> : null}
      {pre ? (
        <text x={x} y={y} style={st}>
          {pre}
        </text>
      ) : null}
      {decimals === 0 ? (
        <Counter x={x + preW} y={y} value={value * t} max={value} size={size} color={color} align="start" />
      ) : (
        <text x={x + preW} y={y} style={st}>
          {(value * t).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        </text>
      )}
      {unit ? (
        <text x={x + preW + numW + size * 0.16} y={y} style={{ fontFamily: IF2.num, fontWeight: 600, fontSize: size * 0.42, fill: unitColor ?? color }}>
          {unit}
        </text>
      ) : null}
      {tail ? (
        <text x={x + preW + numW + unitW + size * 0.3} y={y} style={{ fontFamily: IF2.label, fontSize: size * 0.5, letterSpacing: size * 0.06, fill: unitColor ?? color }}>
          {labelCase(tail)}
        </text>
      ) : null}
    </g>
  );
};

/** The teal cyclorama room (never bone): sky, sliding paper clouds, a warm floor. Put subjects in your own Layer. */
export const StudioSet: React.FC<{ f: number; seed?: number; floor?: number }> = ({ f, seed = 4, floor = 880 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={STUDIO} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f * 3} y={60} n={6} seed={seed} />
    </Layer>
    <Layer depth={0.6}>
      <rect x={-1400} y={floor - 20} width={4800} height={1200} fill={mixHex(STUDIO.mid, "#FFE4A8", 0.15)} />
      <rect x={-1400} y={floor - 20} width={4800} height={10} fill={alpha(STUDIO.near, 0.6)} />
    </Layer>
  </>
);

/** Rings launched every `every` frames from (cx, cy), growing at `speed` px/f to maxR. */
export const Rings: React.FC<{ f: number; cx: number; cy: number; every?: number; speed?: number; maxR?: number; color: string; width?: number; once?: boolean }> = ({
  f,
  cx,
  cy,
  every = 24,
  speed = 5,
  maxR = 400,
  color,
  width = 6,
  once = false,
}) => {
  if (f < 0) return null;
  if (once) {
    const r = f * speed;
    return r > 0 && r < maxR ? <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={width} opacity={0.9 * (1 - r / maxR)} /> : null;
  }
  const n = Math.ceil(maxR / speed / every) + 1;
  const k0 = Math.floor(f / every);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const k = k0 - i;
        const r = (f - k * every) * speed;
        if (k < 0 || r <= 0 || r > maxR) return null;
        return <circle key={k} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={width} opacity={0.9 * (1 - r / maxR)} />;
      })}
    </g>
  );
};

/** A horizontal bar with a rounded end and a lit top edge. */
export const Bar: React.FC<{ x: number; y: number; len: number; h?: number; color: string; edge?: string }> = ({ x, y, len, h = 70, color, edge = CREAM }) =>
  len > 1 ? (
    <g>
      <rect x={x} y={y - h / 2} width={len} height={h} rx={h * 0.2} fill={color} stroke={INK} strokeWidth={4} />
      <rect x={x + 6} y={y - h / 2 + 6} width={Math.max(0, len - 12)} height={h * 0.16} rx={h * 0.08} fill={edge} opacity={0.45} />
    </g>
  ) : null;

/** A small saffron base plate at the ruler's foot for Tick to stand on in the sky shots (Tick never falls). */
export const Ledge: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 150 }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={14} rx={7} fill={C.saffron} stroke={INK} strokeWidth={3} />
    <rect x={x - w / 2 + 10} y={y + 14} width={w - 20} height={8} rx={4} fill={C.saffronDeep} />
  </g>
);
