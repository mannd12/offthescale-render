// L12 scene l08 "Where the rule breaks" (storyboard §3 "8 · Where the rule breaks": shots 8-01…8-14, then the BlackBeat
// and the 14-s music-only ladder replay M-01 in the tail (HOLDS l08:7), script lines 59-66, family void high key →
// studio, Act IV). Package IV (builder guide: episodes/L12-mountain-limit/BUILD.md).
// Every number drawn here carries its sources.md row in a comment next to the literal (validate while building):
//   Vesta 569 × 555 × 453 km, mean radius 263 km (#23) · predicted ceiling ~340 km (#26) · Rheasilvia 500 km wide,
//   19 km deep (#25) · central peak ~20 km high, ~200 km across, ~2.5 × Everest (#24) · Everest 8,848.86 m, snow
//   height (#1) · crush band 3.8-9.4 km (#9) · Olympus Mons 22 / 26 km by base (#18 #19) · river model (#6) ·
//   Mauna Kea 10,211 m from the sea floor (#13) · Earth radius 6,371 km (#8).
// Pieces exported for the closer (same package): Vesta, EverestSil, EarthDisc, Pop, hornPts.
import React, { useId } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  BlackBeat,
  Bloom,
  Counter,
  Cumulus,
  Facets,
  Family,
  Form,
  GroundShadow,
  Headline,
  Kicker,
  Layer,
  LightWash,
  Metric,
  Motes,
  P,
  Pill,
  Sky,
  Stage,
  Stars,
  Tick,
  UnknownTag,
  alpha,
  cameraAt,
  circlePath,
  crawl,
  cutPop,
  decadeZoom,
  fall,
  flash,
  impact,
  lineupState,
  loadIllustratedFonts,
  mixHex,
  pulse,
  ridgePath,
  rnd,
  roundPoly,
  rrect,
  smooth,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { L12_COLORS, MARS, familyOf, pillFill } from "../families";
import { cueKit } from "../cues";
import { HEIGHTS, L12Gauge } from "../L12Gauge";
import { SlateBlock } from "../props";
import { ShotDef, ShotFC, actBreakAt, playShots } from "../shots";
import { Cue, SFX, cutHit, sting } from "./cue-types";

loadIllustratedFonts();

type Pt = [number, number];
const TAU = Math.PI * 2;
const rad = (d: number) => (d * Math.PI) / 180;

const F = familyOf("void");
/**
 * The L12 studio set (polish pass (a), 2026-11-11). The bone room measured as the greyest stretch of the video (HSV
 * saturation 0.18-0.19 at 1:00, 3:30 and 9:00), so the studio keeps its roles but is pushed to the colour targets: a
 * teal cyclorama (the family's mint `second`, deepened), warm ochre floor and hills under the gold key, cool blue-teal
 * shadows. Text stays dark (the cyc's top is mid-value). Shared by l01, l04, l08 and the closer.
 */
export const STUDIO_SET: Family = {
  ...familyOf("studio"),
  sky: ["#2A8890", "#3AA29F", "#66BEAD", "#A4DBC5"],
  far: "#5AAE9F",
  mid: "#E3A256",
  near: "#D2843F",
  haze: "#A4DBC5",
  shadow: "#1E4A5C",
  dim: "#1F4549",
};
const S = STUDIO_SET;

/** Painted cut-out clouds sliding across the studio cyc at ~1.6-2.4 px per frame: the motion floor of the studio shots
 *  (defined cream edges on teal register at the probe's 96×54 / 0.5-s steps; a slow push over flat paper did not). */
export const CycClouds: React.FC<{ f: number; y?: number; n?: number; seed?: number; opacity?: number }> = ({ f, y = 150, n = 4, seed = 1, opacity = 1 }) => (
  <g opacity={opacity}>
    {Array.from({ length: n }, (_, i) => {
      const w = 380 + rnd(seed * 7 + i) * 220;
      const v = 1.6 + rnd(seed * 3 + i) * 0.8;
      const x = ((((i / n) * 2900 + rnd(seed + i) * 300 + f * v) % 2900) + 2900) % 2900 - 700;
      return <Cumulus key={i} x={x} y={y + rnd(seed * 11 + i) * 230} w={w} h={w * 0.27} fill="#FFF4DE" shade="#BFE3D6" lit="#FFFFFF" seed={seed * 5 + i} frame={f} />;
    })}
  </g>
);
const DUSK = familyOf("dusk");
const PETROL = familyOf("petrol");
/** The void high key: gold from the upper left; the petrol fill comes from the lower right (storyboard §1, scene 8). */
const KEY = 200;
const FILL_PETROL = "#2FBFA8";
const TAUPE = "#A48E72"; // Vesta's regolith on our palette (warm taupe, never grey)
const VR = 263; // #23 mean radius, km; the void shots draw Vesta at 1 px per km

// ------------------------------------------------------------------------------------------------------------
// Shared pieces of this package

/** cutPop on a hard cut: wrap a shot whose first frame is a CUT / MATCH / JUMP. */
export const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/** A white flash overlay for impacts (Stage `overlay`). */
const Flash: React.FC<{ f: number; at: number; peak?: number; color?: string }> = ({ f, at, peak = 0.4, color = "#FFF4E0" }) => {
  const o = flash(f, at, 9, peak);
  return o > 0 ? <AbsoluteFill style={{ background: color, opacity: o }} /> : null;
};

/**
 * Lit: a round body shaded as ONE mass (round 1 lesson: Form's inner-shadow ring turned planets and balls into geodes
 * and glass bubbles). A radial light-to-shadow ramp centred toward the light, a rim on the lit edge and an optional
 * coloured fill rim on the far edge, all clipped to the silhouette. Children are drawn under the shading.
 */
export const Lit: React.FC<{ d: string; cx: number; cy: number; R: number; fill: string; family: Family; light?: number; rim?: string; rimW?: number; fillRim?: string | false; depth?: number; children?: React.ReactNode }> = ({ d, cx, cy, R, fill, family, light = KEY, rim, rimW, fillRim = false, depth = 1, children }) => {
  const id = "lit" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const lx = Math.cos(rad(light));
  const ly = Math.sin(rad(light));
  const w = rimW ?? Math.max(2, R * 0.03);
  const rc = rim ?? family.light;
  return (
    <g>
      <defs>
        <clipPath id={`${id}c`}>
          <path d={d} />
        </clipPath>
        <radialGradient id={`${id}g`} gradientUnits="userSpaceOnUse" cx={cx + lx * R * 0.55} cy={cy + ly * R * 0.55} r={R * 2.1}>
          <stop offset={0} stopColor={family.light} stopOpacity={0.36} />
          <stop offset={0.28} stopColor={family.light} stopOpacity={0.08} />
          <stop offset={0.42} stopColor={family.shadow} stopOpacity={0} />
          <stop offset={0.72} stopColor={family.shadow} stopOpacity={0.5 * depth} />
          <stop offset={1} stopColor={family.shadow} stopOpacity={0.8 * depth} />
        </radialGradient>
        <linearGradient id={`${id}r`} gradientUnits="userSpaceOnUse" x1={cx + lx * R} y1={cy + ly * R} x2={cx - lx * R * 0.15} y2={cy - ly * R * 0.15}>
          <stop offset={0} stopColor={rc} stopOpacity={0.95} />
          <stop offset={1} stopColor={rc} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}f`} gradientUnits="userSpaceOnUse" x1={cx - lx * R} y1={cy - ly * R} x2={cx + lx * R * 0.2} y2={cy + ly * R * 0.2}>
          <stop offset={0} stopColor={fillRim || "#000"} stopOpacity={0.75} />
          <stop offset={1} stopColor={fillRim || "#000"} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={d} fill={fill} />
      <g clipPath={`url(#${id}c)`}>
        {children}
        <rect x={cx - R * 3} y={cy - R * 3} width={R * 6} height={R * 6} fill={`url(#${id}g)`} />
        {fillRim ? <path d={d} fill="none" stroke={`url(#${id}f)`} strokeWidth={w * 3.2} strokeLinejoin="round" /> : null}
        <path d={d} fill="none" stroke={`url(#${id}r)`} strokeWidth={w * 2} strokeLinejoin="round" />
      </g>
    </g>
  );
};

/**
 * Vesta's outline: a lumpy ellipsoid (569 × 555 × 453 km, #23) as a polar function, with the Rheasilvia basin carved
 * around `poleDeg` (500 km wide, 19 km deep, #25: that is ±72° of arc on a 263-km body) and the central peak (200 km
 * across, 20 km high, #24: ±22°) heaved up in its middle. `dish` and `peak` 0..1 grow them; `rot` tumbles the lumps;
 * `lump` scales them (the section shots calm them so the 19-km bowl is not lost in 20-km lumps).
 * Scale: everything in km × (R / 263), so the depth and the peak stay honest at any size.
 */
export const vestaPts = (cx: number, cy: number, R: number, rot = 0, dish = 0, peak = 0, poleDeg = 270, lump = 1, n = 132): Pt[] => {
  const k = R / VR;
  const pole = rad(poleDeg);
  const dw = rad(72);
  const pw = rad(22);
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const b = a - rad(rot);
    let r = R * (1 + lump * (0.085 * Math.cos(2 * b + 0.6) + 0.03 * Math.sin(3 * b + 1.1) + 0.018 * Math.sin(5 * b + 2.3) + 0.012 * Math.sin(7 * b + 0.4)));
    const d = Math.abs((((a - pole + Math.PI) % TAU) + TAU) % TAU - Math.PI);
    if (d < dw) r -= 19 * k * dish * (1 - (d / dw) * (d / dw)); // #25
    if (d < pw) r += 20 * k * peak * Math.pow(1 - (d / pw) * (d / pw), 1.3); // #24
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return out;
};

export type VestaProps = {
  cx: number;
  cy: number;
  R?: number;
  rot?: number;
  dish?: number;
  peak?: number;
  poleDeg?: number;
  lump?: number;
  /** 0..1 the pole turned toward the camera: draws the basin face-on as a ring (8-04) */
  face?: number;
  frame: number;
  family?: Family;
  light?: number;
  fill?: string;
  /** coloured fill light on the far edge (petrol in the void); false in the studio */
  fillRim?: string | false;
  bloom?: boolean;
  opacity?: number;
  craters?: boolean;
};

/** Vesta: the potato, lit by the gold key with a petrol fill on the far edge, small craters that ride the tumble. */
export const Vesta: React.FC<VestaProps> = ({ cx, cy, R = VR, rot = 0, dish = 0, peak = 0, poleDeg = 270, lump = 1, face = 0, frame, family = F, light = KEY, fill = TAUPE, fillRim = FILL_PETROL, bloom = true, opacity = 1, craters = true }) => {
  const d = roundPoly(vestaPts(cx, cy, R, rot, dish, peak, poleDeg, lump), R * 0.05);
  const k = R / VR;
  const lit = mixHex(fill, family.light, 0.4);
  const shade = mixHex(fill, family.shadow, 0.45);
  const lx = Math.cos(rad(light));
  const ly = Math.sin(rad(light));
  const cr = [
    { a: 20, k: 0.55, r: 0.075 },
    { a: 75, k: 0.7, r: 0.05 },
    { a: 110, k: 0.35, r: 0.095 },
    { a: 200, k: 0.6, r: 0.06 },
    { a: 300, k: 0.5, r: 0.045 },
    { a: 340, k: 0.78, r: 0.035 },
  ];
  const pole = rad(poleDeg);
  const ringC: Pt = [cx + Math.cos(pole) * R * 0.92 * (1 - face), cy + Math.sin(pole) * R * 0.92 * (1 - face)];
  const ringRx = 250 * k * (0.55 + 0.45 * face); // #25 500 km wide
  const ringRy = 250 * k * Math.max(0.04, face);
  const ringRot = poleDeg + 90;
  const breathe = 1 + 0.004 * Math.sin(frame / 40);
  return (
    <g opacity={opacity}>
      {bloom ? <Bloom x={cx + lx * R * 0.4} y={cy + ly * R * 0.4} r={R * 1.9 * breathe} color={family.light} strength={0.13} spread={0.45} /> : null}
      <Lit d={d} cx={cx} cy={cy} R={R} fill={fill} family={family} light={light} fillRim={fillRim}>
        {craters
          ? cr.map((c, i) => {
              const aa = rad(c.a + rot);
              const x = cx + Math.cos(aa) * R * c.k;
              const y = cy + Math.sin(aa) * R * c.k;
              const rr = R * c.r;
              if (face > 0.3 && Math.hypot(x - ringC[0], y - ringC[1]) < ringRx) return null;
              return (
                <g key={i}>
                  <ellipse cx={x} cy={y} rx={rr} ry={rr * 0.8} fill={shade} />
                  <ellipse cx={x - lx * rr * 0.28} cy={y - ly * rr * 0.28} rx={rr * 0.78} ry={rr * 0.62} fill={lit} opacity={0.8} />
                  <ellipse cx={x - lx * rr * 0.06} cy={y - ly * rr * 0.06} rx={rr * 0.66} ry={rr * 0.5} fill={mixHex(fill, family.shadow, 0.2)} />
                </g>
              );
            })
          : null}
        {face > 0.02 ? (
          <g transform={`rotate(${ringRot} ${ringC[0]} ${ringC[1]})`} opacity={Math.min(1, face * 3)}>
            {/* the basin face-on: a shadowed near wall, a lit far wall, the floor, the central peak as a lit knob */}
            <ellipse cx={ringC[0]} cy={ringC[1]} rx={ringRx} ry={ringRy} fill={shade} />
            <ellipse cx={ringC[0]} cy={ringC[1] + ringRy * 0.05} rx={ringRx * 0.95} ry={ringRy * 0.93} fill={lit} opacity={0.55} />
            <ellipse cx={ringC[0]} cy={ringC[1] - ringRy * 0.02} rx={ringRx * 0.9} ry={ringRy * 0.88} fill={mixHex(fill, family.shadow, 0.16)} />
            <ellipse cx={ringC[0]} cy={ringC[1] + 10 * k * face} rx={104 * k} ry={104 * k * Math.max(0.04, face)} fill={shade} opacity={0.7} />
            <ellipse cx={ringC[0]} cy={ringC[1]} rx={100 * k} ry={100 * k * Math.max(0.04, face)} fill={mixHex(fill, family.light, 0.18)} />
            <ellipse cx={ringC[0] - 14 * k} cy={ringC[1] - 18 * k * face} rx={52 * k} ry={52 * k * Math.max(0.04, face)} fill={lit} opacity={0.85} />
          </g>
        ) : null}
      </Lit>
    </g>
  );
};

/** Everest-class horn silhouette points over a base line (unit horn × w/2, h). The base width is not a claim (F11). */
export const hornPts = (x: number, base: number, w: number, h: number): Pt[] =>
  (
    [
      [-1, 0],
      [-0.72, 0.2],
      [-0.5, 0.44],
      [-0.3, 0.66],
      [-0.12, 0.9],
      [0, 1],
      [0.09, 0.93],
      [0.22, 0.74],
      [0.42, 0.5],
      [0.66, 0.28],
      [1, 0],
    ] as Pt[]
  ).map(([u, v]) => [x + (u * w) / 2, base - v * h]);

const hornY = (pts: Pt[], x: number) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    if (x >= ax && x <= bx) return ay + ((by - ay) * (x - ax)) / (bx - ax || 1);
  }
  return pts[0][1];
};
const crossX = (pts: Pt[], line: number, fromLeft: boolean) => {
  let idx = -1;
  if (fromLeft) idx = pts.findIndex((p) => p[1] <= line);
  else for (let i = pts.length - 1; i >= 0; i--) if (pts[i][1] <= line) { idx = i; break; }
  if (idx < 0) return pts[0][0];
  const a = pts[idx];
  const b = pts[fromLeft ? idx - 1 : idx + 1] ?? a;
  const t = a[1] === b[1] ? 0 : (line - a[1]) / (b[1] - a[1]);
  return a[0] + (b[0] - a[0]) * t;
};
/** Snow cap of a ridge: everything above `line`, with a zigzag lower edge. */
export const capPath = (pts: Pt[], line: number, wob: number) => {
  const top = pts.filter((p) => p[1] <= line);
  const xl = crossX(pts, line, true);
  const xr = crossX(pts, line, false);
  const zig: Pt[] = Array.from({ length: 6 }, (_, i): Pt => {
    const x = xr + ((xl - xr) * (i + 0.5)) / 6;
    return [x, Math.max(hornY(pts, x), line + (i % 2 ? wob : -wob * 0.5))];
  });
  return roundPoly([[xl, line], ...top, [xr, line], ...zig], wob * 0.4);
};

/** Everest's silhouette: a lit flank and a shadow flank meeting under the summit, a snow cap; `ghost` = dashed outline. */
export const EverestSil: React.FC<{ x: number; base: number; w: number; h: number; family: Family; light?: number; ghost?: boolean; opacity?: number; dot?: boolean; frame?: number; fill?: string }> = ({ x, base, w, h, family: Fm, light = KEY, ghost = false, opacity = 1, dot = false, frame = 0, fill = "#4A8796" }) => {
  const id = "ev" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pts = hornPts(x, base, w, h);
  const d = ridgePath(pts, base, Math.max(2, w * 0.02));
  if (ghost) return <path d={d} fill={alpha(Fm.text, 0.06)} stroke={Fm.text} strokeWidth={Math.max(1.5, h * 0.025)} strokeDasharray={`${h * 0.09} ${h * 0.06}`} opacity={opacity} />;
  const fromLeft = Math.cos(rad(light)) < 0;
  const far = fromLeft ? pts.filter((p) => p[0] >= x) : pts.filter((p) => p[0] <= x).reverse();
  const foot = x + (fromLeft ? 1 : -1) * w * 0.08;
  const shadeD = `M${far.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")} L${foot.toFixed(1)} ${base} Z`;
  return (
    <g opacity={opacity}>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={mixHex(fill, Fm.light, 0.12)} />
      <g clipPath={`url(#${id})`}>
        <path d={shadeD} fill={mixHex(fill, Fm.shadow, 0.5)} />
        <path d={capPath(pts, base - h * 0.6, h * 0.045)} fill={L12_COLORS.snow} />
        <path d={shadeD} fill={Fm.shadow} opacity={0.14} />
        <path d={d} fill="none" stroke={Fm.light} strokeWidth={Math.max(2, h * 0.02)} opacity={0.6} transform={`translate(${fromLeft ? 1.5 : -1.5} 1.5)`} />
      </g>
      {dot ? <circle cx={x} cy={base - h - 2} r={Math.max(3, h * 0.022) + Math.sin(frame / 9)} fill={P.vermilion} /> : null}
    </g>
  );
};

/** A shallow shield (Mauna Kea, Olympus Mons) or a dome (Rheasilvia's peak): a smooth profile over a base line. */
const domePts = (x: number, base: number, w: number, h: number, pow = 2, n = 24, notch = 0): Pt[] =>
  Array.from({ length: n + 1 }, (_, i): Pt => {
    const u = (i / n) * 2 - 1;
    let v = Math.max(0, 1 - Math.pow(Math.abs(u), pow));
    if (notch > 0 && Math.abs(u) < 0.08) v -= notch * (1 - Math.abs(u) / 0.08);
    return [x + (u * w) / 2, base - v * h];
  });

/** A dome as one lit mass (Lit), sitting on its base line. */
const Dome: React.FC<{ pts: Pt[]; base: number; fill: string; family: Family; light?: number; fillRim?: string | false; children?: React.ReactNode }> = ({ pts, base, fill, family, light = KEY, fillRim = FILL_PETROL, children }) => {
  const x0 = pts[0][0];
  const x1 = pts[pts.length - 1][0];
  const top = Math.min(...pts.map((p) => p[1]));
  const d = `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")} L${x1} ${base} L${x0} ${base} Z`;
  return (
    <Lit d={d} cx={(x0 + x1) / 2} cy={(top + base) / 2 + (base - top) * 0.3} R={(x1 - x0) / 2} fill={fill} family={family} light={light} fillRim={fillRim} rimW={Math.max(2.5, (base - top) * 0.02)} depth={0.8}>
      {children}
    </Lit>
  );
};

/** The Earth as a lit disc (M-01's last rung, Z-08): petrol ocean, soft green land, polar caps, cloud wisps. */
export const EarthDisc: React.FC<{ cx: number; cy: number; r: number; frame: number; family?: Family; light?: number; ring?: number; opacity?: number }> = ({ cx, cy, r, frame, family: Fm = F, light = KEY, ring = 0, opacity = 1 }) => {
  const d = circlePath(cx, cy, r);
  const blob = (ox: number, oy: number, rr: number, n: number, seed: number, w: number, sq: number) =>
    roundPoly(
      Array.from({ length: n }, (_, i): Pt => {
        const a = (i / n) * TAU;
        const q = rr * (1 + (rnd(seed * 13 + i) - 0.5) * 2 * w);
        return [cx + ox * r + Math.cos(a) * q * r, cy + oy * r + Math.sin(a) * q * r * sq];
      }),
      r * 0.07,
    );
  const drift = Math.sin(frame / 160) * r * 0.06; // the cloud deck drifts
  return (
    <g opacity={opacity}>
      <Bloom x={cx - r * 0.5} y={cy - r * 0.4} r={r * 2.2} color={Fm.light} strength={0.16} spread={0.4} />
      <Lit d={d} cx={cx} cy={cy} R={r} fill="#2B7C8E" family={Fm} light={light} fillRim={FILL_PETROL}>
        <g fill="#7FAE6E">
          <path d={blob(-0.2, -0.22, 0.3, 10, 3, 0.3, 1.2)} />
          <path d={blob(0.28, 0.08, 0.24, 9, 5, 0.32, 1.35)} />
          <path d={blob(-0.12, 0.45, 0.17, 8, 8, 0.3, 0.8)} />
          <path d={blob(0.5, -0.42, 0.13, 8, 12, 0.3, 1.0)} />
        </g>
        <ellipse cx={cx} cy={cy - r * 0.97} rx={r * 0.5} ry={r * 0.07} fill="#F4EFE6" />
        <ellipse cx={cx + r * 0.1} cy={cy + r * 0.98} rx={r * 0.36} ry={r * 0.05} fill="#F4EFE6" />
        <g fill="#FFFFFF" opacity={0.85} transform={`translate(${drift.toFixed(1)} 0)`}>
          <path d={blob(0.05, -0.1, 0.34, 10, 21, 0.25, 0.2)} transform={`rotate(-20 ${cx} ${cy})`} />
          <path d={blob(-0.25, 0.3, 0.26, 9, 23, 0.25, 0.22)} transform={`rotate(-24 ${cx} ${cy})`} />
          <path d={blob(0.38, 0.5, 0.18, 8, 25, 0.25, 0.25)} transform={`rotate(-16 ${cx} ${cy})`} />
        </g>
      </Lit>
      {ring > 0 ? (
        <g opacity={ring}>
          <circle cx={cx} cy={cy} r={r + 12 + Math.sin(frame / 14) * 2} fill="none" stroke={Fm.text} strokeWidth={2} strokeDasharray="10 8" opacity={0.7} />
          <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={Fm.text} strokeWidth={3} />
          <circle cx={cx} cy={cy} r={6} fill={Fm.text} />
          <line x1={cx + r} y1={cy - 12} x2={cx + r} y2={cy + 12} stroke={Fm.text} strokeWidth={3} />
        </g>
      ) : null}
    </g>
  );
};

/** A honesty plate: a calm bone card with a soft shadow and a slate top rule; content is clipped to the card. */
const Plate: React.FC<{ x: number; y: number; w: number; h: number; t?: number; children?: React.ReactNode }> = ({ x, y, w, h, t = 1, children }) => {
  const id = "pl" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const e = smooth(t);
  const sc = 0.96 + 0.04 * e;
  return (
    <g opacity={e} transform={`translate(${x + w / 2} ${y + h / 2}) scale(${sc}) translate(${-(x + w / 2)} ${-(y + h / 2)})`}>
      <clipPath id={id}>
        <path d={rrect(x, y, w, h, 18)} />
      </clipPath>
      <path d={rrect(x + 10, y + 16, w, h, 18)} fill={alpha(S.shadow, 0.22)} filter="url(#soft-16)" />
      <path d={rrect(x, y, w, h, 18)} fill={S.light} />
      <g clipPath={`url(#${id})`}>{children}</g>
      <path d={rrect(x, y, w, h, 18)} fill="none" stroke={mixHex(S.light, S.shadow, 0.18)} strokeWidth={1.5} />
      <rect x={x + 28} y={y + 22} width={64} height={6} rx={3} fill={L12_COLORS.slate} />
    </g>
  );
};

/** The void sky of this scene: petrol-black, stars, the gold key blooming from the upper left, a thin dust band. */
const VoidSky: React.FC<{ f: number; keyStrength?: number }> = ({ f, keyStrength = 1 }) => (
  <Layer depth={0.05}>
    <Sky family={F} />
    <Stars frame={f} n={210} w={1920} h={1080} color={F.text} seed={41} size={1.3} twinkle={0.7} />
    <Bloom x={-120} y={-80} r={1100} color={F.light} strength={0.38 * keyStrength * pulse(f, 150, 0.08, 3)} spread={0.22} />
    <Bloom x={-120} y={-80} r={380} color="#FFF4D6" strength={0.7 * keyStrength} spread={0.4} />
    <Motes frame={f} n={46} x={0} y={120} w={1920} h={760} color={F.light} seed={14} size={1.8} drift={12} />
  </Layer>
);

/** The studio room of 8-08…8-14: paper sky, hazed far hills, a bone floor plane. */
const StudioRoom: React.FC<{ f: number; floor?: number; lamp?: boolean }> = ({ f, floor = 900, lamp = true }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={S} />
      {lamp ? <Bloom x={260} y={40} r={820} color="#FFE4A8" strength={0.5 * pulse(f, 120, 0.1, 5)} spread={0.3} squash={0.8} /> : null}
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f} y={140} seed={3} />
    </Layer>
    <Layer depth={0.3} haze={{ color: S.haze, amount: 0.35 }}>
      <path d={ridgePath([[-400, floor - 110], [200, floor - 170], [700, floor - 130], [1200, floor - 190], [1700, floor - 140], [2320, floor - 180]], floor + 400, 70)} fill={S.far} />
    </Layer>
    <Layer depth={1}>
      <rect x={-500} y={floor} width={2900} height={600} fill={S.near} />
      <rect x={-500} y={floor} width={2900} height={6} fill={mixHex(S.near, S.light, 0.35)} />
      <Motes frame={f} n={26} x={60} y={60} w={1500} h={760} color={S.light} seed={7} size={5} drift={40} />
    </Layer>
  </>
);

// ------------------------------------------------------------------------------------------------------------
// Cues

/** Cue table: one entry per shot boundary and sound hit, keyed to phrases (never timecodes). */
export const cuesL08 = (t: SceneTiming) => {
  const { at, p, end, frac } = cueKit(t);
  const brk = actBreakAt(t);
  return {
    start: at(0),
    stretch: p(0, "about three hundred", -10), // 8-01: the predicted bar climbs to 340 km (#26)
    radius: p(0, "Which is further"), // 8-02: the radius bar, 263 km (#23)
    tilt: p(0, "surface to its centre"), // Tick's head tilt
    rod: at(1), // 8-03 CUT: Tick large with the rod
    bigger: p(1, "bigger"),
    pole: at(2), // 8-04 CUT: Vesta turns to its south pole
    faceOn: p(2, "five hundred", -20), // the basin outline face-on, 500 km (#25)
    section: p(2, "and nineteen", -16), // 8-05: push in to the section, 19 km deep (#25)
    heave: at(3), // 8-06 CUT: the floor heaves up (#24)
    heavePunch: p(3, "heaved up"),
    stack: p(3, "Two and a half"), // 8-07 CUT: 2.5 Everests
    table: at(4), // 8-08 CUT: studio tabletop
    place: frac(4, 0.16),
    shrug: p(4, "The world is"), // 8-09
    plates: at(5), // 8-10 CUT: honesty plate 1
    confined: p(5, "Rock buried"), // 8-11 push
    floor: p(5, "a floor"),
    plate2: at(6), // 8-12 CUT: plate 2
    depending: p(6, "depending"),
    plate3: at(7), // 8-13 CUT: plate 3
    plate4: p(7, "And the river"), // 8-14 CUT: plate 4, Tick stands
    nod: p(7, "not a direct"),
    last: end(7),
    bb: brk.start, // BlackBeat + sting
    replay: brk.start + 8, // M-01 (the second half of the black beat plays over its first frames)
    end: t.frames,
  };
};
export type CL08 = ReturnType<typeof cuesL08>;

// ------------------------------------------------------------------------------------------------------------
// Shots

/** 8-01 + 8-02 (one continuous pull-back): the predicted mountain grows past the world; then the radius bar beside it. */
const ShotRule: ShotFC<CL08> = ({ f, len, c }) => {
  const cx = 800;
  const cy = 640;
  const stretch0 = c.stretch - c.start;
  const grow = smooth(f, stretch0 - 40, stretch0 + 70); // the ghost peak climbs
  const km = 340 * grow; // #26
  const topY = cy - VR - 4; // the top surface (the lumps sit within a few px)
  const apexY = topY - km;
  const radiusT = smooth(f, c.radius - c.start, c.radius - c.start + 36);
  const tiltT = smooth(f, c.tilt - c.start, c.tilt - c.start + 22);
  const cam = cameraAt(f, [
    { f: 0, x: cx + 60, y: cy - 150, zoom: 1.3 },
    { f: stretch0 + 70, x: cx + 80, y: cy - 170, zoom: 0.88 },
    { f: len + 20, x: cx + 110, y: cy - 150, zoom: 0.82 },
  ]);
  const gaugeZoom = smooth(f, stretch0 - 10, stretch0 + 60);
  const rot = f * 0.03;
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.45}>
      <VoidSky f={f} />
      <Layer depth={0.3} haze={{ color: F.haze, amount: 0.3 }}>
        <Motes frame={f} n={30} x={-300} y={-200} w={2500} h={1500} color={F.dim} seed={31} size={2.2} drift={8} glow={false} />
      </Layer>
      <Layer depth={1}>
        {/* the predicted mountain: a dashed ghost peak standing on the top of the world, 340 km tall (#26); drawn
            behind the body so its foot sinks into the curved surface */}
        {grow > 0.01 ? (
          <path d={`M${cx - 200} ${topY + 60} L${cx - 62} ${apexY + km * 0.18} L${cx} ${apexY} L${cx + 52} ${apexY + km * 0.14} L${cx + 200} ${topY + 60} Z`} fill={alpha(F.text, 0.08)} stroke={F.text} strokeWidth={3.5} strokeDasharray="16 11" strokeLinejoin="round" opacity={0.92} />
        ) : null}
        <Vesta cx={cx} cy={cy} frame={f} rot={rot} poleDeg={150} />
        {grow > 0.01 ? (
          <g transform={`translate(${cx + 44} ${apexY + 10})`}>
            <text x={-6} y={0} textAnchor="end" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 66, fill: F.text }}>
              ~
            </text>
            <Counter x={0} y={0} value={km} max={340} size={66} color={F.text} unit="km" />
          </g>
        ) : null}
        {/* 8-02: the radius bar, surface to centre, 263 km (#23), drawn to the MEAN radius (F13) */}
        {radiusT > 0 ? (
          <g opacity={radiusT}>
            <line x1={cx + 320} y1={topY + 6} x2={cx + 320} y2={topY + 6 + VR * radiusT} stroke={F.second} strokeWidth={7} strokeLinecap="round" />
            <line x1={cx + 304} y1={topY + 6} x2={cx + 336} y2={topY + 6} stroke={F.second} strokeWidth={5} />
            <line x1={cx + 304} y1={cy} x2={cx + 336} y2={cy} stroke={F.second} strokeWidth={5} />
            <line x1={cx + 320} y1={cy} x2={cx + 14} y2={cy} stroke={F.second} strokeWidth={2.5} strokeDasharray="7 9" opacity={0.75} />
            <circle cx={cx} cy={cy} r={8} fill={F.second} />
            <Metric x={cx + 352} y={cy - 96} value={`${Math.round(263 * Math.min(1, radiusT * 1.4))}`} unit="km" size={70} color={F.text} />
            <Pill x={cx + 352} y={cy - 46} text="SURFACE TO CENTRE" fill={pillFill(F)} color={F.text} dot={F.second} size={22} />
          </g>
        ) : null}
        {/* Tick, not to scale, on the top of the world beside the ghost peak; a head tilt on "surface to its centre" */}
        {radiusT > 0 ? (
          <g opacity={Math.min(1, radiusT * 2)}>
            <Tick x={cx - 250} y={topY + 40} pxPerM={70} frame={f} facing={-1} pose="hips" expression="thinking" look={0.7} outline={F.shadow} headTilt={16 * tiltT} seed={3} tilt={-22} />
            <Pill x={cx - 330} y={topY - 110} text="NOT TO SCALE" fill={pillFill(F)} color={F.dim} size={19} align="middle" />
          </g>
        ) : null}
      </Layer>
      <Layer depth={0}>
        <L12Gauge family={F} value={0} marker={false} max={100000} zoomTo={1000000} zoomT={gaugeZoom} ceiling={{ v: 340000 * grow, label: grow > 0.97 ? "PREDICTED" : undefined }} readout={false} />
      </Layer>
    </Stage>
  );
};

/** 8-03: Tick large holds the predicted bar as a rod beside the potato: longer than surface-to-centre, deadpan. */
const ShotRod: ShotFC<CL08> = ({ f, len, c }) => {
  const k = 0.9; // px per km in this shot
  const vx = 560;
  const vy = 640;
  const R = VR * k; // #23
  const rodLen = 340 * k; // #26
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 10, x: 990, y: 540, zoom: 1.08 },
  ]);
  const b0 = c.bigger - c.rod;
  const deadpan = smooth(f, b0, b0 + 18);
  const rodT = smooth(f, 2, 22);
  const ppm = 300;
  const tx = 1290;
  const ty = 930;
  // the rod stands in Tick's carry hands (front hand local (42, -92) at pxPerM 300, facing -1); its foot is level
  // with the world's centre, so its top out-reaches the radius bar
  const hx = tx - 0.44 * ppm;
  const bob = Math.sin(f / 50) * 8;
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.45}>
        <VoidSky f={f} />
        <Layer depth={0.4} haze={{ color: F.haze, amount: 0.25 }}>
          <Motes frame={f} n={24} x={-200} y={-100} w={2300} h={1300} color={F.dim} seed={33} size={2} drift={9} glow={false} />
        </Layer>
        <Layer depth={1}>
          <Vesta cx={vx} cy={vy} R={R} frame={f} rot={20 + f * 0.04} poleDeg={150} />
          {/* surface to centre, 263 km (#23) */}
          <line x1={vx} y1={vy - R} x2={vx} y2={vy} stroke={F.second} strokeWidth={7} strokeLinecap="round" />
          <circle cx={vx} cy={vy} r={9} fill={F.second} />
          <line x1={vx - 18} y1={vy - R} x2={vx + 18} y2={vy - R} stroke={F.second} strokeWidth={5} />
          {/* level lines: the centre and the surface, carried across to the rod */}
          <line x1={vx + 16} y1={vy} x2={hx + 40} y2={vy} stroke={F.dim} strokeWidth={2} strokeDasharray="5 9" opacity={0.6} />
          <line x1={vx + 26} y1={vy - R} x2={hx + 40} y2={vy - R} stroke={F.dim} strokeWidth={2} strokeDasharray="5 9" opacity={0.6} />
          <g transform={`translate(0 ${bob.toFixed(1)})`}>
            {/* the rod: the 340-km prediction (#26), dashed like the ceiling line */}
            <g opacity={rodT}>
              <rect x={hx - 9} y={vy - rodLen - bob} width={18} height={rodLen} rx={6} fill={alpha(F.text, 0.14)} stroke={F.text} strokeWidth={3.5} strokeDasharray="14 10" />
              <line x1={hx - 26} y1={vy - rodLen - bob} x2={hx + 26} y2={vy - rodLen - bob} stroke={F.text} strokeWidth={4} />
              <line x1={hx - 26} y1={vy - bob} x2={hx + 26} y2={vy - bob} stroke={F.text} strokeWidth={4} />
            </g>
            <Tick x={tx} y={ty} pxPerM={ppm} frame={f} facing={-1} pose="carry" expression="surprised" expressionTo="thinking" expressionT={deadpan} look={-0.1 - 0.7 * deadpan} seed={4} tilt={-3} />
          </g>
          <Pill x={tx + 30} y={ty - 1.92 * ppm} text="NOT TO SCALE" fill={pillFill(F)} color={F.dim} size={17} align="middle" />
        </Layer>
      </Stage>
    </Pop>
  );
};

/** 8-04 + 8-05 (one shot): Vesta turns its south pole to us (the 500-km basin outline), then the pole swings to the
 *  limb and the camera pushes into the profile: the bowl sits 19 km under the body's own curve. */
const SEC_LUMP = 0.25;
const ShotPole: ShotFC<CL08> = ({ f, len, c }) => {
  const cx = 820;
  const cy = 580;
  const face0 = c.faceOn - c.pole;
  const sec0 = c.section - c.pole;
  const faceIn = smooth(f, 10, face0 + 10); // pole toward the camera
  const faceOut = smooth(f, face0 + 40, sec0); // pole swings up to the limb
  const face = faceIn * (1 - faceOut);
  const poleDeg = faceOut > 0 ? 150 + 120 * faceOut : 150; // the pole ends at 270 (straight up)
  const lump = 1 - (1 - SEC_LUMP) * faceOut;
  const rot = 10 * (1 - faceOut) + f * 0.02 * (1 - faceOut);
  const cam = cameraAt(f, [
    { f: 0, x: cx + 40, y: cy - 20, zoom: 0.98 },
    { f: sec0, x: cx + 40, y: cy - 60, zoom: 1.04 },
    { f: sec0 + 56, x: cx + 30, y: cy - VR + 70, zoom: 2.7 },
    { f: len + 20, x: cx + 40, y: cy - VR + 66, zoom: 2.85 },
  ]);
  const ref = vestaPts(cx, cy, VR, 0, 0, 0, 270, SEC_LUMP);
  const top = ref[99][1]; // the body's own curve at the pole (i = 270°)
  const metric500 = smooth(f, face0 + 6, face0 + 26) * (1 - smooth(f, sec0 - 20, sec0));
  const metric19 = smooth(f, sec0 + 40, sec0 + 62);
  const refArc = "M" + ref.slice(72, 127).map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L");
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.45}>
        <VoidSky f={f} />
        <Layer depth={0.3} haze={{ color: F.haze, amount: 0.3 }}>
          <Motes frame={f} n={30} x={-300} y={-200} w={2500} h={1500} color={F.dim} seed={35} size={2.2} drift={8} glow={false} />
        </Layer>
        <Layer depth={1}>
          <Vesta cx={cx} cy={cy} frame={f} rot={rot} poleDeg={poleDeg} face={face} dish={faceOut} peak={0} lump={lump} />
          {/* 8-04 label: the basin face-on, 500 km across (#25) */}
          <g opacity={metric500}>
            <line x1={cx - 250} y1={cy + VR + 46} x2={cx + 250} y2={cy + VR + 46} stroke={F.second} strokeWidth={4} />
            <line x1={cx - 250} y1={cy + VR + 34} x2={cx - 250} y2={cy + VR + 58} stroke={F.second} strokeWidth={4} />
            <line x1={cx + 250} y1={cy + VR + 34} x2={cx + 250} y2={cy + VR + 58} stroke={F.second} strokeWidth={4} />
            <Metric x={cx + 300} y={cy + VR + 66} value="500" unit="km" size={64} color={F.text} />
            <Pill x={cx + 300} y={cy + VR + 110} text="RHEASILVIA" fill={pillFill(F)} color={F.text} dot={F.second} size={20} />
          </g>
          {/* 8-05: the body's own curve (dashed) and the floor 19 km under it at the pole (#25); 1 px = 1 km */}
          <g opacity={metric19}>
            <path d={refArc} fill="none" stroke={F.text} strokeWidth={1.2} strokeDasharray="5 4" opacity={0.8} />
            <line x1={cx} y1={top} x2={cx} y2={top + 19} stroke={F.second} strokeWidth={2.2} />
            <line x1={cx - 7} y1={top} x2={cx + 7} y2={top} stroke={F.second} strokeWidth={1.8} />
            <line x1={cx - 7} y1={top + 19} x2={cx + 7} y2={top + 19} stroke={F.second} strokeWidth={1.8} />
            <text x={cx + 14} y={top + 3} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 24, fill: F.text }}>
              19
              <tspan dx={3} style={{ fontSize: 11, fontWeight: 500 }}>
                km deep
              </tspan>
            </text>
          </g>
        </Layer>
        <Layer depth={0}>
          <L12Gauge family={F} value={0} marker={false} max={100000} readout={false} opacity={0.9} />
        </Layer>
      </Stage>
    </Pop>
  );
};

/** 8-06: the crater floor heaves up into the central peak (~20 km high, ~200 km across, #24); debris, a shake. */
const ShotHeave: ShotFC<CL08> = ({ f, len, c }) => {
  const cx = 820;
  const cy = 580;
  const h0 = c.heavePunch - c.heave;
  const peak = smooth(f, h0 - 6, h0 + 36);
  const shake = f > h0 && f < h0 + 26 ? Math.sin(f * 2.1) * 5 * (1 - (f - h0) / 26) : 0;
  const cam = cameraAt(f, [
    { f: 0, x: cx + 40, y: cy - VR + 66, zoom: 2.85 },
    { f: len + 10, x: cx + 30, y: cy - VR + 60, zoom: 2.6 },
  ]);
  const camS = { ...cam, x: cam.x + shake };
  const ref = vestaPts(cx, cy, VR, 0, 0, 0, 270, SEC_LUMP);
  const top = ref[99][1];
  const floorY = top + 19; // #25
  const apex = floorY - 20 * peak; // #24
  const refArc = "M" + ref.slice(72, 127).map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L");
  const debris = Array.from({ length: 18 }, (_, i) => {
    const t0 = h0 - 2 + rnd(i) * 12;
    const tt = f - t0;
    if (tt < 0 || tt > 44) return null;
    const vx = (rnd(i * 3) - 0.5) * 3.4;
    const vy = -(1.4 + rnd(i * 7) * 1.6);
    return { x: cx + (rnd(i * 11) - 0.5) * 70 + vx * tt, y: apex + 4 + vy * tt + 0.055 * tt * tt, o: 1 - tt / 44, r: 1 + rnd(i * 5) * 1.4 };
  });
  const label = smooth(f, h0 + 22, h0 + 42);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={camS} vignette={0.26} grain={0.45} overlay={<Flash f={f} at={h0} peak={0.22} />}>
        <VoidSky f={f} />
        <Layer depth={1}>
          <Vesta cx={cx} cy={cy} frame={f} rot={0} poleDeg={270} face={0} dish={1} peak={peak} lump={SEC_LUMP} />
          {debris.map((d, i) => (d ? <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={mixHex(TAUPE, F.light, 0.5)} opacity={d.o} /> : null))}
          <path d={refArc} fill="none" stroke={F.text} strokeWidth={1.2} strokeDasharray="5 4" opacity={0.6} />
          {/* width bracket above the peak: ~200 km across (#24) */}
          <g opacity={label}>
            <line x1={cx - 100} y1={top - 30} x2={cx + 100} y2={top - 30} stroke={F.second} strokeWidth={2} />
            <line x1={cx - 100} y1={top - 37} x2={cx - 100} y2={top - 23} stroke={F.second} strokeWidth={2} />
            <line x1={cx + 100} y1={top - 37} x2={cx + 100} y2={top - 23} stroke={F.second} strokeWidth={2} />
            <Pill x={cx} y={top - 52} text="~200 km ACROSS" fill={pillFill(F)} color={F.text} dot={F.second} size={9} align="middle" />
          </g>
        </Layer>
        <Layer depth={0}>
          <L12Gauge family={F} value={20000 * peak /* #24 */} max={100000} readout={peak > 0.95 ? "~20 km" : false} base={label > 0.5 ? "FROM ITS BASE" : undefined} opacity={0.95} />
        </Layer>
      </Stage>
    </Pop>
  );
};

/** 8-07: the peak's profile at 10 px per km beside 2.5 Everests stacked (the third a ghost: "about"), and a dashed
 *  route across a small Vesta for "drive across in a day" (500 km, #23). */
const ShotStack: ShotFC<CL08> = ({ f, len }) => {
  const K = 10; // px per km, both axes
  const base = 850;
  const peakPts = domePts(1150, base, 200 * K /* #24 */, 20 * K /* #24 */, 1.8, 44);
  const ev = 8.849 * K; // #1
  const stackX = 400;
  const hits = [6, 22, 38];
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 10, x: 920, y: 545, zoom: 1.07 },
  ]);
  const route = smooth(f, 30, 90);
  const u = (f * 0.005) % 1;
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.45}>
        <VoidSky f={f} />
        <Layer depth={0.5} haze={{ color: F.haze, amount: 0.2 }}>
          <Motes frame={f} n={26} x={-200} y={0} w={2300} h={1000} color={F.dim} seed={37} size={2} drift={9} glow={false} />
        </Layer>
        <Layer depth={1}>
          {/* the crater floor and the central peak in profile, one lit mass */}
          <rect x={-600} y={base - 2} width={3200} height={900} fill={mixHex(TAUPE, F.shadow, 0.5)} />
          <Dome pts={peakPts} base={base} fill={TAUPE} family={F} />
          <line x1={-600} y1={base} x2={2600} y2={base} stroke={F.light} strokeWidth={2.5} opacity={0.45} />
          {/* 2.5 Everests stacked beside it: two land, the third is a ghost (#24: "about two and a half") */}
          {hits.map((h, i) => {
            const t = smooth(f, h, h + 10);
            if (t <= 0) return null;
            const sq = impact(f, h + 8, 0.14, 10);
            const b = base - i * ev - (1 - t) * 180;
            return (
              <g key={i} transform={`translate(${stackX} ${b}) scale(${sq.sx} ${sq.sy}) translate(${-stackX} ${-b})`} opacity={i === 2 ? 0.8 : t}>
                <EverestSil x={stackX} base={b} w={ev * 1.7} h={ev * (i === 2 ? 0.5 : 1)} family={F} ghost={i === 2} dot={i === 0} frame={f} />
              </g>
            );
          })}
          {/* a level line from the stack's top to the peak's summit */}
          <line x1={stackX + 90} y1={base - 20 * K} x2={1150} y2={base - 20 * K} stroke={F.dim} strokeWidth={2} strokeDasharray="5 9" opacity={0.6 * smooth(f, 44, 60)} />
          <g opacity={smooth(f, 40, 56)}>
            <Pill x={stackX} y={base - 2.5 * ev - 50} text="~2.5 × EVEREST" fill={pillFill(F)} color={F.text} dot={P.vermilion} size={22} align="middle" />
          </g>
          {/* a small Vesta with the 500-km drive across it (#23) */}
          <g transform="translate(1540 250)">
            <Vesta cx={0} cy={0} R={110} frame={f} rot={f * 0.05} poleDeg={130} bloom={false} />
            <path d="M-104 14 Q-36 -48 36 -12 T106 -8" fill="none" stroke={F.text} strokeWidth={3} strokeDasharray="8 8" strokeDashoffset={crawl(f, 0.6)} opacity={0.9 * route} />
            <circle cx={-104 + 210 * u} cy={14 - Math.sin(u * Math.PI) * 34} r={6} fill={F.light} opacity={route} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

/** 8-08 + 8-09 (studio, one push): Tick sets a stone on the tabletop Vesta's peak, no crack, no sag; then shrugs to
 *  camera while a stack of three pebbles on the peak out-tops the model's own radius bar. */
const ShotTable: ShotFC<CL08> = ({ f, len, c }) => {
  const floor = 890;
  const mx = 800;
  const R = 150;
  const my = floor - R + 4;
  const ppm = 260;
  const tx = 1020;
  const place0 = c.place - c.table;
  const shrug0 = c.shrug - c.table;
  const placed = smooth(f, place0, place0 + 12);
  const lift = smooth(f, place0 + 8, place0 + 34); // point → stand after placing
  const shrugT = smooth(f, shrug0, shrug0 + 30);
  const cam = cameraAt(f, [
    { f: 0, x: 890, y: 600, zoom: 1.12 },
    { f: len + 10, x: 880, y: 590, zoom: 1.36 },
  ]);
  const top = my - R * 1.006; // the peak's summit on the model (the same proportions as vestaPts)
  const hand: Pt = [tx - 0.68 * ppm, floor - 1.24 * ppm]; // the pointing mitten (facing -1)
  const stoneAt: Pt = [mx + 2, top - 12];
  const sx = hand[0] + (stoneAt[0] - hand[0]) * placed;
  const sy = hand[1] + 16 + (stoneAt[1] - hand[1] - 16) * placed;
  const pebbles = [0, 1, 2].map((i) => smooth(f, shrug0 + 10 + i * 12, shrug0 + 20 + i * 12));
  const bar = smooth(f, shrug0 + 48, shrug0 + 70);
  const pebble = (x: number, y: number, r: number, seed: number) => {
    const d = roundPoly(Array.from({ length: 9 }, (_, i): Pt => [x + Math.cos((i / 9) * TAU) * r * (1 + (rnd(seed + i) - 0.5) * 0.3), y + Math.sin((i / 9) * TAU) * r * 0.8 * (1 + (rnd(seed * 3 + i) - 0.5) * 0.3)]), r * 0.4);
    return <Lit d={d} cx={x} cy={y} R={r} fill={mixHex(TAUPE, S.shadow, 0.2)} family={S} light={225} fillRim={S.bounce} depth={0.7} />;
  };
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5} overlay={<Flash f={f} at={place0 + 12} peak={0.1} />}>
        <StudioRoom f={f} floor={floor} />
        <Layer depth={1}>
          {/* the model's own radius bar beside it: its surface to its centre */}
          <g opacity={bar}>
            <line x1={mx - R - 80} y1={my - R} x2={mx - R - 80} y2={my} stroke={L12_COLORS.slate} strokeWidth={6} strokeLinecap="round" />
            <line x1={mx - R - 96} y1={my - R} x2={mx - R - 64} y2={my - R} stroke={L12_COLORS.slate} strokeWidth={4} />
            <line x1={mx - R - 96} y1={my} x2={mx - R - 64} y2={my} stroke={L12_COLORS.slate} strokeWidth={4} />
            <line x1={mx - R - 64} y1={my - R} x2={mx + R + 40} y2={my - R} stroke={L12_COLORS.slate} strokeWidth={2} strokeDasharray="4 8" opacity={0.7} />
          </g>
          {/* the tabletop model: pole up, the basin and its peak at the top */}
          <GroundShadow x={mx + 14} y={floor - 2} rx={R * 1.05} ry={R * 0.16} color={S.shadow} opacity={0.4} blur={16} />
          <Vesta cx={mx} cy={my} R={R} frame={f} rot={0} poleDeg={270} dish={1} peak={1} lump={0.5} family={S} light={225} fill={mixHex(TAUPE, S.light, 0.1)} fillRim={S.bounce} bloom={false} />
          <g opacity={bar}>
            <line x1={mx - R - 80} y1={my} x2={mx} y2={my} stroke={L12_COLORS.slate} strokeWidth={2} strokeDasharray="4 8" opacity={0.7} />
            <circle cx={mx} cy={my} r={6} fill={L12_COLORS.slate} />
          </g>
          {/* the stone: in the mitten, then on the peak; then two more: the stack out-tops the radius bar */}
          {pebble(sx, sy, 18, 5)}
          {pebbles.map((p, i) => (p > 0 ? <g key={i} transform={`translate(0 ${((1 - p) * -50).toFixed(1)})`} opacity={p}>{pebble(stoneAt[0] + (i % 2 ? -5 : 6), stoneAt[1] - 34 - 50 * i, 27 - i * 2, 11 + i * 7)}</g> : null))}
          <GroundShadow x={tx + 6} y={floor - 1} rx={ppm * 0.4} color={S.shadow} opacity={0.4} blur={8} />
          <Tick
            x={tx}
            y={floor}
            pxPerM={ppm}
            frame={f}
            facing={-1}
            pose={shrugT > 0 ? "stand" : "point"}
            poseTo={shrugT > 0 ? "shrug" : "stand"}
            poseT={shrugT > 0 ? shrugT * 1.6 : lift * 1.6}
            expression={shrugT > 0 ? "happy" : "determined"}
            look={shrugT > 0 ? -0.6 : 0.7}
            seed={6}
            outline={S.shadow}
          />
        </Layer>
      </Stage>
    </Pop>
  );
};

/** The thumbnails of plates already shown, bottom-left (the "done" stack), calm. */
const DonePlates: React.FC<{ n: number; t: number }> = ({ n, t }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const last = i === n - 1;
      const e = last ? smooth(t) : 1;
      const x = 150 + i * 84;
      return (
        <g key={i} opacity={0.9 * e} transform={`translate(${x} 968)`}>
          <rect x={0} y={0} width={64} height={44} rx={6} fill={S.light} stroke={mixHex(S.light, S.shadow, 0.25)} strokeWidth={1.2} />
          <rect x={8} y={7} width={18} height={3} rx={1.5} fill={L12_COLORS.slate} />
          {i === 0 ? <rect x={26} y={18} width={12} height={20} fill={L12_COLORS.slate} opacity={0.7} /> : null}
          {i === 1 ? <path d="M10 36 Q32 14 54 36" fill={MARS.mid} opacity={0.7} /> : null}
          {i === 2 ? <path d="M14 38 L32 16 L50 38 Z" fill="#4A8796" opacity={0.8} /> : null}
        </g>
      );
    })}
  </g>
);

const PL = { x: 150, y: 290, w: 780, h: 520 };

/** Tick sitting by the plates, the staff across its knees. */
const Sitter: React.FC<{ f: number; floor: number; expression?: "thinking" | "neutral"; headTilt?: number }> = ({ f, floor, expression = "thinking", headTilt = 0 }) => (
  <g>
    <GroundShadow x={1430} y={floor - 1} rx={110} color={S.shadow} opacity={0.4} blur={8} />
    <Tick x={1440} y={floor} pxPerM={230} frame={f} facing={-1} pose="sit" expression={expression} look={0.5} seed={8} outline={S.shadow} headTilt={headTilt} />
    <g transform={`translate(1432 ${floor - 0.5 * 230}) rotate(-6)`}>
      <rect x={-150} y={-5} width={300} height={10} rx={4} fill="#EFE6D2" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={-140 + i * 32} y={-5} width={9} height={10} fill={i % 2 ? "#1E2226" : P.vermilion} />
      ))}
      <path d="M-150 -5 L-166 0 L-150 5 Z" fill={P.vermilion} />
    </g>
  </g>
);

/** 8-10 + 8-11 (one push): plate 1, the column rule is rough: the cracked column; then the press vs the buried block
 *  (confined rock is stronger) and the gauge band relabelled FLOOR (#9, #4). Tick sits with the staff across its knees. */
const ShotPlate1: ShotFC<CL08> = ({ f, len, c }) => {
  const con0 = c.confined - c.plates;
  const floor0 = c.floor - c.plates;
  const toPress = smooth(f, con0, con0 + 24);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: con0, x: 940, y: 560, zoom: 1.03 },
    { f: con0 + 40, x: PL.x + PL.w / 2 + 150, y: PL.y + PL.h / 2 + 10, zoom: 1.3 },
    { f: len + 10, x: PL.x + PL.w / 2 + 160, y: PL.y + PL.h / 2, zoom: 1.36 },
  ]);
  const floor = 900;
  const cx = PL.x + PL.w / 2;
  const colBase = PL.y + PL.h - 120;
  const bw = 150;
  const bh = 76;
  const press = Math.sin(f / 7) * 2;
  const crack = smooth(f, 20, 80);
  const gaugeIn = smooth(f, con0 + 10, con0 + 40);
  const floorT = smooth(f, floor0, floor0 + 20);
  const mid = colBase - 130; // vertical centre of the two confined-rock pictures
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5}>
        <StudioRoom f={f} floor={floor} />
        <Layer depth={1}>
          <Plate {...PL} t={smooth(f, 0, 16)}>
            {/* 1a: the cracked column (the rule's picture) */}
            <g opacity={1 - toPress}>
              {[0, 1, 2, 3].map((i) => (
                <SlateBlock key={i} x={cx - bw / 2 - 30} y={colBase - i * bh} w={bw} h={bh} family={S} light={225} crack={i === 0 ? crack : 0} split={i === 0 ? crack * 0.6 : 0} shadow={i === 0} />
              ))}
              <line x1={cx - 260} y1={colBase + 2} x2={cx + 260} y2={colBase + 2} stroke={mixHex(S.light, S.shadow, 0.35)} strokeWidth={2} />
              <path d={`M${cx + 150} ${colBase - 4 * bh - 30} l0 ${4 * bh + 26}`} stroke={L12_COLORS.amber} strokeWidth={4} strokeDasharray="10 8" strokeDashoffset={crawl(f, 0.5)} opacity={0.85} />
              <path d={`M${cx + 136} ${colBase - 4 * bh - 18} L${cx + 150} ${colBase - 4 * bh - 36} L${cx + 164} ${colBase - 4 * bh - 18}`} fill="none" stroke={L12_COLORS.amber} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
            </g>
            {/* 1b: a block in a press beside a block buried, confined on all sides, with a root under it */}
            <g opacity={toPress}>
              <SlateBlock x={cx - 330} y={mid - 78 + press} w={210} h={28} d={30} family={S} light={225} shadow={false} />
              <SlateBlock x={cx - 290} y={mid + 62} w={130} h={130} d={36} family={S} light={225} color={L12_COLORS.granite} crack={0.9} split={0.5} shadow={false} />
              <SlateBlock x={cx - 330} y={mid + 96} w={210} h={28} d={30} family={S} light={225} />
              <path d={`M${cx - 225} ${mid - 150 + press} l0 30 m-11 -13 l11 13 l11 -13`} fill="none" stroke={L12_COLORS.amber} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              {/* the buried block: a ground mass, a root running down beneath it, inward arrows on all four sides */}
              <path d={rrect(cx + 20, mid - 160, 340, 330, 16)} fill={mixHex(L12_COLORS.slate, S.light, 0.42)} />
              <path d={`M${cx + 120} ${mid + 66} L${cx + 190} ${mid + 168} L${cx + 260} ${mid + 66} Z`} fill={mixHex(L12_COLORS.slate, S.light, 0.12)} />
              <SlateBlock x={cx + 125} y={mid + 62} w={130} h={130} d={0} family={S} light={225} color={L12_COLORS.granite} shadow={false} />
              {(
                [
                  [cx + 76, mid - 2, 0],
                  [cx + 304, mid - 2, 180],
                  [cx + 190, mid - 116, 90],
                ] as [number, number, number][]
              ).map(([ax, ay, ang], i) => {
                const k = 1 + 0.08 * Math.sin(f / 9 + i);
                return (
                  <g key={i} transform={`translate(${ax} ${ay}) rotate(${ang}) scale(${k})`}>
                    <path d="M-30 0 L16 0 M4 -12 L16 0 L4 12" fill="none" stroke={L12_COLORS.amber} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                );
              })}
            </g>
          </Plate>
          <Sitter f={f} floor={floor} />
        </Layer>
        <Layer depth={0}>
          <g opacity={1 - toPress}>
            <Kicker x={120} y={128} text="A few honest notes" color={S.dim} size={22} />
            <Headline x={120} y={236} lines={["The column rule is rough"]} size={62} color={S.text} accent={L12_COLORS.amber} />
          </g>
          <g opacity={toPress}>
            <Pill x={800} y={1000} text="CONFINED ROCK IS STRONGER" fill={pillFill(S)} color={S.light} dot={L12_COLORS.amber} size={24} align="middle" />
          </g>
          <g opacity={gaugeIn}>
            <L12Gauge family={S} value={HEIGHTS.everest /* #1 */} readout={false} bands={[{ ...HEIGHTS.crushBand /* #9 */, color: L12_COLORS.amber, label: floorT > 0.5 ? "A FLOOR · 4-9 km" : "4-9 km · SOLID COLUMN" }]} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

/** 8-12: plate 2, the Olympus profile with two base lines and two brackets (22 / 26 km, #18 #19); the emphasis swaps
 *  on "depending". Vertical × 6, said on the card. */
const ShotPlate2: ShotFC<CL08> = ({ f, len, c }) => {
  const dep0 = c.depending - c.plate2;
  const swap = smooth(f, dep0, dep0 + 14);
  const slide = smooth(f, 0, 28);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 10, x: 940, y: 550, zoom: 1.06 },
  ]);
  const floor = 900;
  const HX = 1.05; // px per km across (585 km wide, #18)
  const VXG = 6; // vertical exaggeration (the real slopes are 2-5°, #18)
  const kmH = HX * VXG; // px per km of height
  const cx = PL.x + PL.w / 2;
  // Two base conventions: 22 km of relief on MOLA (#19, the higher base) and 26 km above the surrounding plains (#18).
  const baseA = PL.y + 390;
  const baseLow = baseA + 4 * kmH;
  const summitY = baseA - 22 * kmH;
  const prof = domePts(cx, baseLow, 585 * HX /* #18 */, 26 * kmH, 1.7, 48, 0.06);
  const dx = (1 - slide) * 1500;
  const big = { fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 34, fill: S.text } as const;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5}>
        <StudioRoom f={f} floor={floor} />
        <Layer depth={1}>
          <DonePlates n={1} t={slide} />
          <g transform={`translate(${dx.toFixed(1)} 0)`}>
            <Plate {...PL}>
              {/* the plains at two levels: lower on the left, higher on the right */}
              <path d={`M${PL.x} ${baseLow} L${cx} ${baseLow} L${cx} ${baseA} L${PL.x + PL.w} ${baseA} L${PL.x + PL.w} ${PL.y + PL.h} L${PL.x} ${PL.y + PL.h} Z`} fill={mixHex(MARS.far, S.light, 0.35)} />
              <Dome pts={prof} base={baseLow + 2} fill={MARS.mid} family={S} light={225} fillRim={MARS.bounce} />
              <path d={`M${cx + 40} ${baseA} L${PL.x + PL.w} ${baseA} L${PL.x + PL.w} ${baseLow + 4} L${cx + 40} ${baseLow + 4} Z`} fill={mixHex(MARS.far, S.light, 0.35)} />
              <line x1={PL.x + 70} y1={summitY} x2={PL.x + PL.w - 70} y2={summitY} stroke={S.text} strokeWidth={1.5} strokeDasharray="3 7" opacity={0.6} />
              {/* the higher base (right) and its bracket: 22 km */}
              <g opacity={1 - 0.65 * swap}>
                <line x1={cx + 60} y1={baseA} x2={PL.x + PL.w - 30} y2={baseA} stroke={S.text} strokeWidth={2.5} strokeDasharray="9 7" />
                <line x1={PL.x + PL.w - 150} y1={baseA} x2={PL.x + PL.w - 150} y2={summitY} stroke={L12_COLORS.amber} strokeWidth={5} />
                <line x1={PL.x + PL.w - 162} y1={summitY} x2={PL.x + PL.w - 138} y2={summitY} stroke={L12_COLORS.amber} strokeWidth={4} />
                <text x={PL.x + PL.w - 130} y={(baseA + summitY) / 2 + 12} style={big}>
                  22
                </text>
              </g>
              {/* the lower base (left) and its bracket: 26 km */}
              <g opacity={0.35 + 0.65 * swap}>
                <line x1={PL.x + 30} y1={baseLow} x2={cx - 60} y2={baseLow} stroke={S.text} strokeWidth={2.5} strokeDasharray="9 7" />
                <line x1={PL.x + 150} y1={baseLow} x2={PL.x + 150} y2={summitY} stroke={L12_COLORS.amber} strokeWidth={5} />
                <line x1={PL.x + 138} y1={summitY} x2={PL.x + 162} y2={summitY} stroke={L12_COLORS.amber} strokeWidth={4} />
                <text x={PL.x + 130} y={(baseLow + summitY) / 2 + 12} textAnchor="end" style={big}>
                  26
                </text>
              </g>
              <text x={PL.x + PL.w - 30} y={PL.y + PL.h - 22} textAnchor="end" style={{ fontFamily: "'Anton', sans-serif", fontSize: 16, letterSpacing: 2.5, fill: S.dim }}>
                OLYMPUS MONS · VERTICAL × 6
              </text>
            </Plate>
          </g>
          <Sitter f={f} floor={floor} expression={swap > 0.5 ? "thinking" : "neutral"} headTilt={6 * swap} />
        </Layer>
        <Layer depth={0}>
          <g opacity={slide}>
            <Metric x={1020} y={236} value="22 or 26" unit="km" size={72} color={S.text} />
            <Pill x={1020} y={296} text="DEPENDS ON THE BASE" fill={pillFill(S)} color={S.light} dot={L12_COLORS.amber} size={20} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

/** 8-13: plate 3, the summit close: 8,848.86 m is the snow height; the rock surface under it carries a "?" (#1). */
const ShotPlate3: ShotFC<CL08> = ({ f, len }) => {
  const slide = smooth(f, 0, 26);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 10, x: 980, y: 540, zoom: 1.07 },
  ]);
  const floor = 900;
  const cx = PL.x + PL.w / 2 + 40;
  const base = PL.y + PL.h + 60;
  const h = 470;
  const pts = hornPts(cx, base, 900, h);
  const snowTop = base - h;
  const rockTop = snowTop + 30; // not a measurement: the rock height has not been announced (#1)
  const snow = fall(f, 40, PL.w, PL.h, 3, 0.8, 10);
  const tagT = smooth(f, 30, 48);
  const dx = (1 - slide) * 1500;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5}>
        <StudioRoom f={f} floor={floor} />
        <Layer depth={1}>
          <DonePlates n={2} t={slide} />
          <g transform={`translate(${dx.toFixed(1)} 0)`}>
            <Plate {...PL}>
              <rect x={PL.x} y={PL.y} width={PL.w} height={PL.h} fill={mixHex(S.light, "#8FD2E6", 0.25)} />
              {/* the summit: rock, and the snow cap over it (the cap's thickness is NOT a measurement) */}
              <path d={ridgePath(pts, base + 10, 8)} fill="#4A8796" />
              <path d={`M${cx} ${snowTop} L${pts[6][0]} ${pts[6][1]} L${pts[7][0]} ${pts[7][1]} L${pts[8][0]} ${pts[8][1]} L${pts[9][0]} ${pts[9][1]} L${pts[10][0]} ${base + 10} L${cx + 60} ${base + 10} Z`} fill={mixHex("#4A8796", S.shadow, 0.4)} />
              <path d={capPath(pts, snowTop + 200, 16)} fill={L12_COLORS.snow} />
              <path d={`M${cx} ${snowTop} L${pts[6][0]} ${pts[6][1]} L${pts[7][0]} ${pts[7][1]} L${crossXPub(pts, snowTop + 200)} ${snowTop + 200} L${cx + 30} ${snowTop + 200} Z`} fill={L12_COLORS.snowShade} opacity={0.8} />
              <path d={`M${cx - 110} ${rockTop + 58} Q${cx - 40} ${rockTop + 8} ${cx} ${rockTop} Q${cx + 40} ${rockTop + 6} ${cx + 110} ${rockTop + 70}`} fill="none" stroke="#4A8796" strokeWidth={3} strokeDasharray="8 6" opacity={0.9} />
              {snow.map((p, i) => (
                <circle key={i} cx={PL.x + p.x} cy={PL.y + p.y} r={p.r * 0.8} fill="#FFFFFF" opacity={0.7} />
              ))}
              {/* the official tick on the snow surface */}
              <line x1={cx - 250} y1={snowTop} x2={cx + 150} y2={snowTop} stroke={S.text} strokeWidth={2.5} strokeDasharray="9 7" />
              <path d={`M${cx - 268} ${snowTop - 11} L${cx - 252} ${snowTop} L${cx - 268} ${snowTop + 11} Z`} fill={P.vermilion} />
              <text x={cx - 280} y={snowTop + 34} textAnchor="end" style={{ fontFamily: "'Anton', sans-serif", fontSize: 17, letterSpacing: 2.5, fill: S.dim }}>
                SNOW SURFACE
              </text>
              <g opacity={tagT} transform={`translate(0 ${((1 - tagT) * 10).toFixed(1)})`}>
                <line x1={cx + 20} y1={rockTop + 6} x2={cx + 190} y2={rockTop + 40} stroke={S.text} strokeWidth={2} />
                <UnknownTag x={cx + 216} y={rockTop + 46} size={26} />
                <text x={cx + 254} y={rockTop + 54} style={{ fontFamily: "'Anton', sans-serif", fontSize: 17, letterSpacing: 2.5, fill: S.dim }}>
                  ROCK
                </text>
              </g>
            </Plate>
          </g>
          <Sitter f={f} floor={floor} expression="neutral" />
        </Layer>
        <Layer depth={0}>
          <g opacity={slide}>
            <Pill x={1000} y={330} text="ROCK HEIGHT · NOT ANNOUNCED" fill={pillFill(S)} color={S.light} dot={P.vermilion} size={20} />
          </g>
          <L12Gauge family={S} value={HEIGHTS.everest /* #1 */} readout="8,848.86 m" opacity={0.95} />
        </Layer>
      </Stage>
    </Pop>
  );
};
const crossXPub = (pts: Pt[], line: number) => crossX(pts, line, false).toFixed(1);

/** 8-14: plate 4, small: the river map inset (one study's model, #6); Tick stands and nods. Ends in the BlackBeat. */
const ShotPlate4: ShotFC<CL08> = ({ f, len, c }) => {
  const nod0 = c.nod - c.plate4;
  const bb0 = c.bb - c.plate4;
  const slide = smooth(f, 0, 24);
  const stand = smooth(f, 4, 34);
  const nod = f > nod0 ? Math.sin(Math.min(Math.PI * 2, ((f - nod0) / 28) * Math.PI * 2)) * 9 : 0;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 10, x: 940, y: 560, zoom: 1.06 },
  ]);
  const floor = 900;
  const P4 = { x: 190, y: 300, w: 620, h: 440 };
  const dx = (1 - slide) * 1500;
  // a schematic map, north up (F8): the river runs east along the north side of the range, then turns south through it
  const riv = `M${P4.x - 10} ${P4.y + 150} C ${P4.x + 160} ${P4.y + 110}, ${P4.x + 300} ${P4.y + 160}, ${P4.x + 420} ${P4.y + 130} C ${P4.x + 500} ${P4.y + 112}, ${P4.x + 540} ${P4.y + 170}, ${P4.x + 500} ${P4.y + 240} C ${P4.x + 470} ${P4.y + 300}, ${P4.x + 520} ${P4.y + 360}, ${P4.x + 560} ${P4.y + 450}`;
  const peaks = [70, 150, 230, 320, 410, 560].map((px, i) => ({ x: P4.x + px, y: P4.y + 250 + (i % 2 ? -14 : 8), s: 30 + (i % 3) * 8 }));
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5} overlay={bb0 < len ? <BlackBeat t={Math.max(0, (f - bb0) / 16) * 0.5} /> : null}>
        <StudioRoom f={f} floor={floor} />
        <Layer depth={1}>
          <DonePlates n={3} t={slide} />
          <g transform={`translate(${dx.toFixed(1)} 0)`}>
            <Plate {...P4}>
              <rect x={P4.x} y={P4.y} width={P4.w} height={P4.h} fill={mixHex(S.light, S.second, 0.16)} />
              <path d={`M${P4.x} ${P4.y + 205} Q${P4.x + 300} ${P4.y + 170} ${P4.x + P4.w} ${P4.y + 215} L${P4.x + P4.w} ${P4.y + 300} Q${P4.x + 300} ${P4.y + 330} ${P4.x} ${P4.y + 290} Z`} fill={mixHex(S.mid, S.light, 0.25)} />
              <path d={riv} fill="none" stroke={mixHex(S.light, S.second, 0.16)} strokeWidth={34} strokeLinecap="round" />
              {peaks.map((p, i) => (
                <g key={i}>
                  <path d={`M${p.x - p.s} ${p.y + p.s * 0.7} L${p.x} ${p.y - p.s * 0.7} L${p.x + p.s} ${p.y + p.s * 0.7} Z`} fill="#4A8796" />
                  <path d={`M${p.x} ${p.y - p.s * 0.7} L${p.x + p.s} ${p.y + p.s * 0.7} L${p.x + p.s * 0.2} ${p.y + p.s * 0.7} Z`} fill={mixHex("#4A8796", S.shadow, 0.4)} />
                  <path d={`M${p.x - p.s * 0.3} ${p.y - p.s * 0.28} L${p.x} ${p.y - p.s * 0.7} L${p.x + p.s * 0.3} ${p.y - p.s * 0.28} L${p.x} ${p.y - p.s * 0.16} Z`} fill={L12_COLORS.snow} />
                </g>
              ))}
              <path d={riv} fill="none" stroke={L12_COLORS.seaGlass} strokeWidth={10} strokeLinecap="round" />
              <path d={riv} fill="none" stroke={L12_COLORS.ice} strokeWidth={3.5} strokeDasharray="12 16" strokeDashoffset={crawl(f, 1.4)} strokeLinecap="round" />
              <circle cx={peaks[3].x} cy={peaks[3].y - peaks[3].s * 0.7 - 4} r={8 + Math.sin(f / 9) * 1.5} fill={P.vermilion} />
              <text x={P4.x + 28} y={P4.y + P4.h - 22} style={{ fontFamily: "'Anton', sans-serif", fontSize: 16, letterSpacing: 2.5, fill: S.dim }}>
                SCHEMATIC
              </text>
            </Plate>
          </g>
          <GroundShadow x={1430} y={floor - 1} rx={110 - 30 * stand} color={S.shadow} opacity={0.4} blur={8} />
          <Tick x={1440} y={floor} pxPerM={230} frame={f} facing={-1} pose="sit" poseTo="stand" poseT={stand * 1.6} expression="neutral" look={0.5} seed={8} outline={S.shadow} headTilt={nod} staff={stand > 0.6} />
        </Layer>
        <Layer depth={0}>
          <g opacity={slide}>
            <Pill x={900} y={330} text="ONE STUDY'S MODEL" fill={pillFill(S)} color={S.light} dot={L12_COLORS.seaGlass} size={22} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

/** M-01: the 14-s music-only ladder replay. Everest, Mauna Kea (from the floor), Olympus Mons and Rheasilvia's peak
 *  each enter large and shrink to the rail; the gauge decade-zooms 10 km → 100 km → 6,371 km; the Earth becomes a
 *  full disc with its radius ring. Ends on the circle the closer's 1-m ball match-cuts to. */
const STEPS = [0, 92, 184, 272, 346]; // frames (from the replay start) each rung enters
const ITEMS = [
  { id: "everest", label: "EVEREST · 8,849 m ABOVE SEA LEVEL" }, // #1
  { id: "maunakea", label: "MAUNA KEA · 10,211 m FROM THE SEA FLOOR" }, // #13
  { id: "olympus", label: "OLYMPUS MONS · 22-26 km ABOVE THE PLAINS" }, // #18 #19
  { id: "rheasilvia", label: "RHEASILVIA PEAK · ~20 km FROM ITS BASE" }, // #24
  { id: "earth", label: "EARTH · RADIUS 6,371 km" }, // #8
];
const RAIL_NAMES = ["EVEREST", "MAUNA KEA", "OLYMPUS MONS", "RHEASILVIA"];
/** Where M-01's Earth disc ends on screen (the closer's 1-m ball starts on the same circle): centre + radius. */
export const REPLAY_DISC = { x: 932, y: 373, r: 260 };

const ShotReplay: ShotFC<CL08> = ({ f, len }) => {
  const hero = STEPS.reduce((h, s, i) => (f >= s ? i : h), 0);
  const t = Math.min(1, (f - STEPS[hero]) / 46);
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 560, zoom: 1.08 },
    { f: Math.max(60, len), x: 930, y: 540, zoom: 0.93 },
  ]);
  // the gauge: 10 km → 100 km while Mauna Kea goes off scale; 100 km → 6,371 km as the Earth closes the ladder
  const z1 = smooth(f, STEPS[1] + 34, STEPS[1] + 80);
  const z2 = smooth(f, STEPS[4] + 10, STEPS[4] + 60);
  const gmax = z2 > 0 ? decadeZoom(100000, HEIGHTS.earthRadius /* #8 */, z2) : decadeZoom(10000, 100000, z1);
  const mk = HEIGHTS.maunaKeaFromFloor * smooth(f, STEPS[1] + 6, STEPS[1] + 40); // #13
  const oly = smooth(f, STEPS[2] + 6, STEPS[2] + 40);
  const rh = smooth(f, STEPS[3] + 6, STEPS[3] + 40);
  const earthT = smooth(f, STEPS[4], STEPS[4] + 50);
  const ring = smooth(f, STEPS[4] + 40, STEPS[4] + 70);
  const opts = { hero: [900, 660] as [number, number], rail: [230, 952] as [number, number], railGap: 200, railScale: 0.15 };
  const draw = (i: number) => {
    const st = lineupState(i, hero, t, opts);
    if (st.opacity <= 0) return null;
    const inner = (() => {
      switch (i) {
        case 0:
          return <EverestSil x={0} base={0} w={560} h={430} family={F} dot frame={f} />;
        case 1: {
          const pts = domePts(0, 0, 1000, 310, 2.2, 36, 0.04);
          const sea = -310 + (4205 / 10211) * 310; // the sea surface, 4,205 m below the summit (#13): the rest is under water
          const wave = Array.from({ length: 40 }, (_, k) => `${k === 0 ? "M" : "L"}${-640 + k * 33} ${(sea + Math.sin(k * 0.9 + f / 12) * 4).toFixed(1)}`).join(" ");
          return (
            <g>
              <path d={`${wave} L650 0 L-640 0 Z`} fill={PETROL.sky[1]} opacity={0.42} />
              <Dome pts={pts} base={0} fill="#5E7480" family={F}>
                <rect x={-700} y={sea} width={1400} height={400} fill={PETROL.sky[1]} opacity={0.5} />
              </Dome>
              <path d={wave} fill="none" stroke={PETROL.light} strokeWidth={3} opacity={0.75} />
              <line x1={-640} y1={0} x2={650} y2={0} stroke={F.dim} strokeWidth={2.5} opacity={0.8} />
            </g>
          );
        }
        case 2:
          return <Dome pts={domePts(0, 0, 1180, 104, 1.5, 48, 0.1)} base={0} fill={MARS.mid} family={F} fillRim={MARS.bounce} />;
        case 3:
          return <Dome pts={domePts(0, 0, 780, 226, 1.8, 36)} base={0} fill={TAUPE} family={F} />;
        default:
          return <EarthDisc cx={0} cy={-300} r={280} frame={f} ring={ring} />;
      }
    })();
    return (
      <g key={i} opacity={st.opacity}>
        <g transform={`translate(${st.x.toFixed(1)} ${st.y.toFixed(1)}) scale(${st.s.toFixed(4)})`}>{inner}</g>
        {st.onRail ? (
          <g>
            <circle cx={st.x} cy={st.y + 30} r={4} fill={F.text} />
            {st.railIndex === hero - 1 ? <Pill x={st.x} y={st.y + 64} text={RAIL_NAMES[st.railIndex]} fill={alpha(F.shadow, 0.6)} color={F.text} size={15} align="middle" /> : null}
          </g>
        ) : null}
      </g>
    );
  };
  const heroSt = lineupState(hero, hero, t, opts);
  const labelT = hero === 0 ? smooth(f, 20, 40) : smooth(t, 0.7, 1);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.3} grain={0.45} overlay={f < 8 ? <BlackBeat t={0.5 + (f / 16) * 0.5} /> : null}>
      <VoidSky f={f} keyStrength={1.1} />
      <Layer depth={0.3} haze={{ color: F.haze, amount: 0.3 }}>
        <Motes frame={f} n={36} x={-300} y={-200} w={2500} h={1500} color={F.dim} seed={43} size={2.4} drift={10} glow={false} />
      </Layer>
      <Layer depth={1}>
        <line x1={150} y1={982} x2={150 + 3 * 200 + 80} y2={982} stroke={F.dim} strokeWidth={1.5} opacity={0.6 * smooth(f, STEPS[1], STEPS[1] + 40)} />
        {ITEMS.map((_, i) => draw(i))}
        {hero < 4 ? (
          <g opacity={labelT}>
            <Pill x={heroSt.x} y={heroSt.y + 62} text={ITEMS[hero].label} fill={pillFill(F)} color={F.text} dot={hero === 0 ? P.vermilion : F.second} size={20} align="middle" />
          </g>
        ) : (
          <g opacity={ring}>
            <Pill x={heroSt.x + 316} y={heroSt.y - 300} text={ITEMS[4].label} fill={pillFill(F)} color={F.text} dot={F.second} size={19} />
          </g>
        )}
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={128} text="The ladder · shapes not to one scale" color={F.dim} size={20} />
        <L12Gauge
          family={F}
          value={HEIGHTS.everest /* #1 */}
          max={gmax}
          readout={false}
          base={hero === 0 ? "ABOVE SEA LEVEL" : undefined}
          bars={[
            ...(mk > 0 ? [{ value: mk, color: L12_COLORS.seaGlass, base: hero === 1 ? "FROM THE SEA FLOOR" : undefined }] : []), // #13, F3
            ...(oly > 0 ? [{ value: 22000 * oly, color: MARS.mid }, { value: 26000 * oly, color: MARS.mid, dashed: true }] : []), // #19 #18
            ...(rh > 0 ? [{ value: 20000 * rh, color: TAUPE }] : []), // #24
          ]}
          opacity={1 - 0.25 * earthT}
        />
      </Layer>
    </Stage>
  );
};

// ------------------------------------------------------------------------------------------------------------
// Scene

export const SceneL08: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL08(t);
  const shots: ShotDef<CL08>[] = [
    { from: 0, S: ShotRule, id: "8-01" },
    { from: c.rod, S: ShotRod, id: "8-03" },
    { from: c.pole, S: ShotPole, id: "8-04" },
    { from: c.heave, S: ShotHeave, id: "8-06" },
    { from: c.stack, S: ShotStack, id: "8-07" },
    { from: c.table, S: ShotTable, id: "8-08" },
    { from: c.plates, S: ShotPlate1, id: "8-10" },
    { from: c.plate2, S: ShotPlate2, id: "8-12" },
    { from: c.plate3, S: ShotPlate3, id: "8-13" },
    { from: c.plate4, S: ShotPlate4, id: "8-14" },
    { from: c.replay, S: ShotReplay, id: "M-01" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). */
export const soundL08 = (t: SceneTiming): Cue[] => {
  const c = cuesL08(t);
  return [
    // 8-01/02: the rule stretches past the world
    { at: c.start - 2, file: SFX.whoosh, vol: 0.2, dur: 50 },
    { at: c.stretch - 40, file: SFX.riser, vol: 0.26, dur: 120, fadeOut: 20 },
    { at: c.stretch + 70, file: SFX.popLong, vol: 0.26, dur: 30 },
    { at: c.radius, file: SFX.popLong, vol: 0.24, dur: 30 },
    { at: c.tilt, file: SFX.click, vol: 0.18, dur: 16 },
    // 8-03
    ...cutHit(c.rod),
    { at: c.rod + 6, file: SFX.pop, vol: 0.26, dur: 20 },
    // 8-04/05
    ...cutHit(c.pole),
    { at: c.pole + 4, file: SFX.deepWhoosh, vol: 0.28, dur: 70 },
    { at: c.faceOn + 8, file: SFX.pop, vol: 0.24, dur: 20 },
    { at: c.section, file: SFX.click, vol: 0.2, dur: 16 },
    { at: c.section + 44, file: SFX.popLong, vol: 0.24, dur: 30 },
    // 8-06
    ...cutHit(c.heave),
    { at: c.heavePunch - 4, file: SFX.uBoom, vol: 0.36, dur: 90, fadeOut: 20 },
    { at: c.heavePunch + 2, file: SFX.debris, vol: 0.26, dur: 60, fadeOut: 20 },
    { at: c.heavePunch + 22, file: SFX.pop, vol: 0.2, dur: 20 },
    // 8-07
    ...cutHit(c.stack),
    ...[6, 22, 38].map((o) => ({ at: c.stack + o + 8, file: SFX.pop, vol: 0.24, dur: 20 })),
    // 8-08/09
    ...cutHit(c.table),
    { at: c.place + 12, file: SFX.popLong, vol: 0.26, dur: 30 },
    ...[10, 22, 34].map((o) => ({ at: c.shrug + o, file: SFX.pop, vol: 0.2, dur: 20 })),
    { at: c.shrug + 50, file: SFX.chime, vol: 0.18, dur: 60 },
    // 8-10/11 honesty plates (the music bed drops in Full.tsx's bed change)
    ...cutHit(c.plates, 0.18),
    { at: c.plates + 4, file: SFX.popLong, vol: 0.22, dur: 30 },
    { at: c.confined + 10, file: SFX.pop, vol: 0.2, dur: 20 },
    { at: c.confined + 24, file: SFX.pop, vol: 0.2, dur: 20 },
    { at: c.floor, file: SFX.click, vol: 0.18, dur: 16 },
    // 8-12
    ...cutHit(c.plate2, 0.18),
    { at: c.plate2 + 10, file: SFX.popLong, vol: 0.22, dur: 30 },
    { at: c.depending, file: SFX.popLong, vol: 0.2, dur: 30 },
    // 8-13 / 8-14
    ...cutHit(c.plate3, 0.18),
    { at: c.plate3 + 32, file: SFX.pop, vol: 0.22, dur: 20 },
    ...cutHit(c.plate4, 0.18),
    { at: c.plate4 + 6, file: SFX.popLong, vol: 0.2, dur: 30 },
    { at: c.nod, file: SFX.click, vol: 0.16, dur: 16 },
    // BlackBeat + sting, then the replay: a chime per rung, a riser into the disc, a boom on the full disc
    ...sting(c.bb),
    ...STEPS.slice(0, 4).map((s) => ({ at: c.replay + s + 24, file: SFX.chime, vol: 0.26, dur: 70 })),
    { at: c.replay + STEPS[4] - 60, file: SFX.riser, vol: 0.24, dur: 100, fadeOut: 20 },
    { at: c.replay + STEPS[4] + 46, file: SFX.boom, vol: 0.34, dur: 150, fadeOut: 50 },
  ];
};
