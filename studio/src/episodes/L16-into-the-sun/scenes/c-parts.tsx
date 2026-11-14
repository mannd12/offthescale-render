// Package C helpers (S06, S07, S08 only; BUILD.md §6). Small bespoke pieces the three scene files share; the episode's
// shared pieces live in families.ts, sundata.ts, movers16.tsx, sunbody.tsx, L16Dials.tsx, stamps.tsx, props16.tsx.
// Every numeral that reaches the screen goes through sundata.ts (assertAllowed / assertValue).
// USAGE (f = the shot's frame)
//   ez(f, a, b) / lin(f, a, b) / path1(f, keys)  eased / linear 0..1 between frames, piecewise-linear keys
//   <Pop f>                     a hard cut's scale pop
//   <StudioSet f />             STUDIO_SET cyc (never bone) + CycClouds + a warm floor at y = floor
//   <FamSky name />             a family's linear sky, oversized for the camera drift
//   <RadialField cx cy stops /> an oversized full-frame radial gradient (core / space fields)
//   <RollMetric x y value k unit? pre? tail? />   a number rolling to a sundata value (asserted), unit in its own case
//   <Num x y text size color />  a fixed readout string (asserted), unit case kept (no labelCase)
//   <Tag x y text F? />         a kit Pill on the family's pill fill, text asserted
//   <Plate x y w h />           a saturated chart plate (teal felt, gold frame, violet inset)
//   <TextPlate x y w h />       a dark rounded plate behind a readout
//   <Rings f cx cy … />         rings launched every `every` frames
//   <Rim x w />                 the chart's dark rim band at the left edge (Tick's ledge sits on it, F1)
//   <Ledge x y w? />            a saffron ledge for Tick
//   <Bubbles f … />             big plasma bubbles rising and flattening at a top line (6-04)
//   <AtomField f vy … />        violet/gold atoms scrolling (descents), flashing
//   <QMark x y f size? />       the vermilion "?" tag, bobbing ±20 px
//   <ChalkLoop cx cy rx ry draw />   an ellipse drawn by a head (8-15)
//   <Slam age>children</Slam>   scale 2.2 → 1 over 6 frames + a ring (tags that stamp)
//   photonHead(pts, d)          the point at distance d along a polyline
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bloom, CycClouds, Family, IF2, Layer, Pill, Sky, alpha, cutPop, mixHex, rnd, type Pt, Counter } from "../../../lib/illustrated";
import { L16_COLORS, familyOf, pillFill, type L16FamilyName } from "../families";
import { assertAllowed, assertValue } from "../sundata";

export const C = L16_COLORS;
export const STUDIO: Family = familyOf("studio");
export const CREAM = "#FFF4DE";
export const INK = "#0E2A3E";
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

/** The teal cyclorama room (never bone): sky, sliding paper clouds, a warm floor. */
export const StudioSet: React.FC<{ f: number; seed?: number; floor?: number }> = ({ f, seed = 4, floor = 900 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={STUDIO} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f * 3} y={40} n={6} seed={seed} />
    </Layer>
    <Layer depth={0.6}>
      <rect x={-1400} y={floor - 20} width={4800} height={1200} fill={mixHex(STUDIO.mid, "#FFB347", 0.25)} />
      <rect x={-1400} y={floor - 20} width={4800} height={10} fill={alpha(STUDIO.near, 0.7)} />
    </Layer>
  </>
);

/** A family's sky, oversized so the camera drift never shows an edge. */
export const FamSky: React.FC<{ name: L16FamilyName; angle?: number }> = ({ name, angle = 90 }) => <Sky family={familyOf(name)} x={-500} y={-500} w={2920} h={2080} angle={angle} />;

/** An oversized radial gradient field (`id` must be unique in the shot). */
export const RadialField: React.FC<{ cx: number; cy: number; r?: number; stops: [number, string][]; id: string }> = ({ cx, cy, r = 1400, stops, id }) => {
  return (
    <g>
      <defs>
        <radialGradient id={id} cx={cx} cy={cy} r={r} gradientUnits="userSpaceOnUse">
          {stops.map(([o, c], i) => (
            <stop key={i} offset={o} stopColor={c} />
          ))}
        </radialGradient>
      </defs>
      <rect x={-600} y={-600} width={3120} height={2280} fill={`url(#${id})`} />
    </g>
  );
};

/** Big number rolling to a sundata value (asserted), with a separate unit span in its own case. */
export const RollMetric: React.FC<{
  x: number;
  y: number;
  value: number;
  k: number;
  unit?: string;
  size?: number;
  color?: string;
  pre?: string;
  unitColor?: string;
  align?: "start" | "middle";
  who?: string;
}> = ({ x, y, value, k, unit, size = 96, color = CREAM, pre = "", unitColor, align = "start", who = "metric" }) => {
  assertValue(value, who);
  if (unit) assertAllowed(unit, who);
  const t = clamp01(k);
  const digits = value.toLocaleString("en-US");
  const numW = digits.replace(/[,.]/g, "").length * size * 0.6 + (digits.match(/[,.]/g)?.length ?? 0) * size * 0.22;
  const preW = pre ? pre.length * size * 0.3 + size * 0.2 : 0;
  const unitW = unit ? unit.length * size * 0.24 + size * 0.16 : 0;
  const x0 = align === "middle" ? x - (preW + numW + unitW) / 2 : x;
  return (
    <g>
      {pre ? (
        <text x={x0} y={y} style={{ fontFamily: IF2.num, fontWeight: 600, fontSize: size * 0.42, fill: unitColor ?? color }}>
          {pre}
        </text>
      ) : null}
      <Counter x={x0 + preW} y={y} value={t >= 1 ? value : value * t} max={value} size={size} color={color} align="start" />
      {unit ? (
        <text x={x0 + preW + numW + size * 0.16} y={y} style={{ fontFamily: IF2.num, fontWeight: 600, fontSize: size * 0.42, fill: unitColor ?? color }}>
          {unit}
        </text>
      ) : null}
    </g>
  );
};

/** A fixed readout string (asserted), Inter 800, units in their own case. */
export const Num: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; align?: "start" | "middle" | "end"; who?: string; opacity?: number }> = ({ x, y, text, size = 72, color = CREAM, align = "start", who = "Num", opacity = 1 }) => {
  assertAllowed(text, who);
  return (
    <text x={x} y={y} textAnchor={align} opacity={opacity} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: size, fill: color, fontVariantNumeric: "tabular-nums", letterSpacing: -size * 0.02 }}>
      {text}
    </text>
  );
};

/** A word label in the label face (asserted; upper-cased by the caller if wanted). */
export const Word: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; align?: "start" | "middle" | "end"; spacing?: number; opacity?: number }> = ({ x, y, text, size = 24, color = CREAM, align = "start", spacing = 3, opacity = 1 }) => {
  assertAllowed(text, "Word");
  return (
    <text x={x} y={y} textAnchor={align} opacity={opacity} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: spacing, fill: color }}>
      {text.toUpperCase()}
    </text>
  );
};

/** A kit Pill on the family's pill fill; text asserted (labelCase upper-cases km: use only for unitless text). */
export const Tag: React.FC<{ x: number; y: number; text: string; F?: Family; size?: number; align?: "start" | "middle" | "end"; color?: string; dot?: string; appear?: number }> = ({
  x,
  y,
  text,
  F = familyOf("core"),
  size = 28,
  align = "start",
  color = CREAM,
  dot = C.saffron,
  appear = 1,
}) => {
  assertAllowed(text, "Tag");
  const a = sm(appear);
  if (a <= 0) return null;
  return (
    <g opacity={a} transform={`translate(0 ${((1 - a) * 18).toFixed(1)})`}>
      <Pill x={x} y={y} text={text} fill={pillFill(F)} color={color} dot={dot} size={size} align={align} />
    </g>
  );
};

/** A saturated chart plate (teal felt, gold frame, a violet inset corner). */
export const Plate: React.FC<{ x: number; y: number; w: number; h: number; fill?: string }> = ({ x, y, w, h, fill = "#1E5A6E" }) => (
  <g>
    <rect x={x + 12} y={y + 18} width={w} height={h} rx={22} fill="#000" opacity={0.22} />
    <rect x={x - 12} y={y - 12} width={w + 24} height={h + 24} rx={28} fill={C.saffronDeep} />
    <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={24} fill={C.gold} />
    <rect x={x} y={y} width={w} height={h} rx={20} fill={fill} />
    <rect x={x + w - 70} y={y + h - 70} width={60} height={60} rx={12} fill={alpha(C.violet, 0.45)} />
  </g>
);

/** A dark rounded plate behind a readout. */
export const TextPlate: React.FC<{ x: number; y: number; w: number; h: number; color?: string; opacity?: number }> = ({ x, y, w, h, color = "#120A3A", opacity = 0.72 }) => (
  <rect x={x} y={y} width={w} height={h} rx={Math.min(24, h / 3)} fill={color} opacity={opacity} />
);

/** Rings launched every `every` frames from (cx, cy), growing at `speed` px/f to maxR. */
export const Rings: React.FC<{ f: number; cx: number; cy: number; every?: number; speed?: number; maxR?: number; color: string; width?: number; r0?: number }> = ({ f, cx, cy, every = 24, speed = 5, maxR = 400, color, width = 6, r0 = 0 }) => {
  if (f < 0) return null;
  const n = Math.ceil(maxR / speed / every) + 1;
  const k0 = Math.floor(f / every);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const k = k0 - i;
        const r = r0 + (f - k * every) * speed;
        if (k < 0 || r <= 0 || r > maxR) return null;
        return <circle key={k} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={width} opacity={0.9 * (1 - r / maxR)} />;
      })}
    </g>
  );
};

/** A horizontal bar with a lit top edge (grows with len). */
export const Bar: React.FC<{ x: number; y: number; len: number; h?: number; color: string; edge?: string; stroke?: string }> = ({ x, y, len, h = 60, color, edge = CREAM, stroke = INK }) =>
  len > 1 ? (
    <g>
      <rect x={x} y={y - h / 2} width={len} height={h} rx={Math.min(h * 0.2, len / 2)} fill={color} stroke={stroke} strokeWidth={4} />
      <rect x={x + 6} y={y - h / 2 + 6} width={Math.max(0, len - 12)} height={h * 0.16} rx={h * 0.08} fill={edge} opacity={0.45} />
    </g>
  ) : null;

/** The chart's dark rim band at the left edge: Tick's ledge sits on it, never in the gas (F1). */
export const Rim: React.FC<{ x?: number; w?: number }> = ({ x = -400, w = 560 }) => (
  <g>
    <rect x={x} y={-600} width={w} height={2400} fill="#1C0F52" />
    <rect x={x + w - 14} y={-600} width={14} height={2400} fill={C.gold} />
    <rect x={x + w} y={-600} width={6} height={2400} fill={C.saffronDeep} opacity={0.7} />
  </g>
);

/** A saffron ledge for Tick. */
export const Ledge: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 160 }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={16} rx={8} fill={C.saffron} stroke={INK} strokeWidth={3} />
    <rect x={x - w / 2 + 10} y={y + 16} width={w - 20} height={9} rx={4} fill={C.saffronDeep} />
  </g>
);

/** Big plasma bubbles rising at `speed` px/f from yBottom and flattening as they reach yTop (6-04). */
export const Bubbles: React.FC<{ f: number; n?: number; speed?: number; yTop: number; yBottom: number; x0?: number; x1?: number; seed?: number }> = ({ f, n = 7, speed = 14, yTop, yBottom, x0 = 0, x1 = 1920, seed = 3 }) => {
  const life = yBottom - yTop + 120;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const r = 70 + rnd(seed * 7 + i) * 60;
        const sp = speed * (0.85 + 0.3 * rnd(seed * 5 + i));
        const d = mod(rnd(seed * 3 + i) * life + f * sp, life);
        const cy = yBottom - d;
        const x = x0 + ((i + 0.5) / n) * (x1 - x0) + (rnd(seed * 11 + i) - 0.5) * 80 + Math.sin((f + i * 20) / 18) * 14;
        const near = clamp01((yTop + r * 1.4 - cy) / (r * 1.4)); // 0 below, 1 at the top line
        const rx = r * (1 + near * 0.9);
        const ry = r * (1 - near * 0.7);
        const y = Math.max(cy, yTop + ry * 0.4);
        const hot = 1 - near * 0.5;
        return (
          <g key={i} opacity={1 - clamp01((d - life + 60) / 60)}>
            <ellipse cx={x} cy={y + ry * 0.15} rx={rx * 1.08} ry={ry * 1.08} fill={C.magenta} opacity={0.55} />
            <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={mixHex(C.gold, C.whiteGold, hot)} />
            <ellipse cx={x - rx * 0.25} cy={y - ry * 0.3} rx={rx * 0.38} ry={ry * 0.3} fill="#FFFFFF" opacity={0.55 * hot} />
          </g>
        );
      })}
    </g>
  );
};

/** Atoms scrolling over a box, flashing now and then (the radiative zone's thick crowd). `ox`/`oy` = the scroll offset
 *  in px (pass an integrated position so a descent can slow down without a jump); f drives the flashes. */
export const AtomField: React.FC<{ f: number; ox?: number; oy?: number; n?: number; box?: { x: number; y: number; w: number; h: number }; seed?: number; r?: number; color?: string; flash?: string }> = ({
  f,
  ox = 0,
  oy = 0,
  n = 46,
  box = { x: -300, y: -300, w: 2520, h: 1680 },
  seed = 5,
  r = 13,
  color = C.violet,
  flash = C.whiteGold,
}) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = box.x + mod(rnd(seed * 7 + i) * box.w + ox * (0.7 + 0.6 * rnd(i * 3)), box.w);
      const y = box.y + mod(rnd(seed * 11 + i) * box.h + oy * (0.7 + 0.6 * rnd(i * 5)), box.h);
      const rr = r * (0.6 + 0.8 * rnd(seed * 13 + i));
      const fl = Math.max(0, Math.sin(f / 5 + rnd(seed * 17 + i) * 40)) ** 12;
      return (
        <g key={i}>
          <circle cx={x} cy={y} r={rr} fill={alpha(color, 0.75)} stroke={alpha(C.whiteGold, 0.55)} strokeWidth={2.5} />
          {fl > 0.05 ? <circle cx={x} cy={y} r={rr * (1 + fl * 1.4)} fill={flash} opacity={fl} /> : null}
        </g>
      );
    })}
  </g>
);

/** The vermilion "?" tag (F9: vermilion allowed here), bobbing ±20 px and rocking. */
export const QMark: React.FC<{ x: number; y: number; f: number; size?: number; appear?: number }> = ({ x, y, f, size = 120, appear = 1 }) => {
  const a = sm(appear);
  if (a <= 0) return null;
  const k = a < 1 ? 1.6 - 0.6 * a : 1;
  const by = Math.sin(f / 5) * 20;
  const rot = Math.sin(f / 7) * 10;
  return (
    <g transform={`translate(${x} ${(y + by).toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${k.toFixed(3)})`} opacity={a}>
      <circle cx={0} cy={-size * 0.32} r={size * 0.62} fill={C.vermilion} />
      <text x={0} y={0} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: size, fill: "#FFF4E0" }}>
        ?
      </text>
    </g>
  );
};

/** An ellipse drawn by a chalk head (8-15): `draw` 0..1 of its perimeter, starting at the top. */
export const ChalkLoop: React.FC<{ cx: number; cy: number; rx: number; ry: number; draw: number; color?: string; width?: number; f: number }> = ({ cx, cy, rx, ry, draw, color = "#FFF8EC", width = 9, f }) => {
  const n = 80;
  const m = Math.max(0, Math.round(n * clamp01(draw)));
  if (m < 1) return null;
  const pts: Pt[] = Array.from({ length: m + 1 }, (_, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2.08;
    const wob = 1 + 0.03 * Math.sin(i * 1.7);
    return [cx + Math.cos(a) * rx * wob, cy + Math.sin(a) * ry * wob];
  });
  const head = pts[pts.length - 1];
  return (
    <g>
      <path d={"M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={0.92} />
      {draw < 1 ? (
        <g>
          <Bloom x={head[0]} y={head[1]} r={40 + 6 * Math.sin(f / 3)} color={C.saffronCore} strength={0.8} />
          <circle cx={head[0]} cy={head[1]} r={width} fill={C.saffronCore} stroke={C.saffron} strokeWidth={3} />
        </g>
      ) : null}
    </g>
  );
};

/** Scale 2.2 → 1 over 6 frames, then a ring (tags that stamp onto something). Nothing before age 0. */
export const Slam: React.FC<{ age: number; x: number; y: number; color?: string; ringR?: number; children: React.ReactNode }> = ({ age, x, y, color = C.saffron, ringR = 120, children }) => {
  if (age < 0) return null;
  const SL = 6;
  const k = age < SL ? 2.2 - 1.2 * (age / SL) ** 2 : 1 + Math.max(0, 0.05 * Math.sin((age - SL) * 1.4) * Math.exp(-(age - SL) / 5));
  const o = age < SL ? 0.35 + 0.65 * (age / SL) : 1;
  const ring = age >= SL && age < SL + 14 ? (age - SL) * 14 : -1;
  return (
    <g>
      {ring >= 0 ? <circle cx={x} cy={y} r={ringR + ring} fill="none" stroke={color} strokeWidth={5} opacity={1 - (age - SL) / 14} /> : null}
      <g transform={`translate(${x} ${y}) scale(${k.toFixed(3)}) translate(${-x} ${-y})`} opacity={o}>
        {children}
      </g>
    </g>
  );
};

/** The point at distance d along a polyline (and the drawn part up to it). */
export const photonHead = (pts: Pt[], d: number): { head: Pt; drawn: Pt[]; total: number } => {
  let acc = 0;
  const drawn: Pt[] = [pts[0]];
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  for (let i = 1; i < pts.length; i++) {
    const s = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (acc + s <= d) {
      acc += s;
      drawn.push(pts[i]);
    } else {
      const u = (d - acc) / Math.max(1e-6, s);
      const h: Pt = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u];
      drawn.push(h);
      return { head: h, drawn, total };
    }
  }
  return { head: pts[pts.length - 1], drawn, total };
};

/** A filled radial disc with the Sun's gradient (F5: no face, no outline). */
export const SunDisc: React.FC<{ cx: number; cy: number; r: number; id: string; stops: [number, string][] }> = ({ cx, cy, r, id, stops }) => (
  <g>
    <defs>
      <radialGradient id={id}>
        {stops.map(([o, c], i) => (
          <stop key={i} offset={o} stopColor={c} />
        ))}
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
  </g>
);
