// L12 scene l08 "Where the rule breaks" (storyboard §3 "8 · Where the rule breaks": shots 8-01…8-14, then the BlackBeat
// and the 14-s music-only ladder replay M-01 in the tail (HOLDS l08:7), script lines 59-66, family void high key →
// studio, Act IV). Package IV (builder guide: episodes/L12-mountain-limit/BUILD.md).
// Every number drawn here carries its sources.md row in a comment next to the literal (validate while building):
//   Vesta 569 × 555 × 453 km, mean radius 263 km (#23) · predicted ceiling ~340 km (#26) · Rheasilvia 500 km wide,
//   19 km deep (#25) · central peak ~20 km high, ~200 km across, ~2.5 × Everest (#24) · Everest 8,848.86 m, snow
//   height (#1) · crush band 3.8-9.4 km (#9) · Olympus Mons 22 / 26 km by base (#18 #19) · river model (#6) ·
//   Mauna Kea 10,211 m from the sea floor (#13) · Earth radius 6,371 km (#8).
// Pieces exported for the closer (same package): Vesta, EverestSil, EarthDisc, Pop, hornPts.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  BlackBeat,
  Bloom,
  Counter,
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
const S = familyOf("studio");
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
 * Vesta's outline: a lumpy ellipsoid (569 × 555 × 453 km, #23) as a polar function, with the Rheasilvia basin carved
 * around `poleDeg` (500 km wide, 19 km deep, #25: that is ±72° of arc on a 263-km body) and the central peak (200 km
 * across, 20 km high, #24: ±22°) heaved up in its middle. `dish` and `peak` 0..1 grow them; `rot` tumbles the lumps.
 * Scale: everything in km × (R / 263), so the depth and the peak stay honest at any size.
 */
export const vestaPts = (cx: number, cy: number, R: number, rot = 0, dish = 0, peak = 0, poleDeg = 270, n = 132): Pt[] => {
  const k = R / VR;
  const pole = rad(poleDeg);
  const dw = rad(72);
  const pw = rad(22);
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const b = a - rad(rot);
    let r = R * (1 + 0.085 * Math.cos(2 * b + 0.6) + 0.03 * Math.sin(3 * b + 1.1) + 0.018 * Math.sin(5 * b + 2.3) + 0.012 * Math.sin(7 * b + 0.4));
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
  /** 0..1 the pole turned toward the camera: draws the basin face-on as a ring (8-04) */
  face?: number;
  frame: number;
  family?: Family;
  light?: number;
  fill?: string;
  bloom?: boolean;
  opacity?: number;
  craters?: boolean;
};

/** Vesta: the potato, lit by the gold key with a petrol fill on the night side, small craters that ride the tumble. */
export const Vesta: React.FC<VestaProps> = ({ cx, cy, R = VR, rot = 0, dish = 0, peak = 0, poleDeg = 270, face = 0, frame, family = F, light = KEY, fill = TAUPE, bloom = true, opacity = 1, craters = true }) => {
  const pts = vestaPts(cx, cy, R, rot, dish, peak, poleDeg);
  const d = roundPoly(pts, R * 0.06);
  const k = R / VR;
  const lit = mixHex(fill, family.light, 0.3);
  const shade = mixHex(fill, family.shadow, 0.35);
  // small craters at body-fixed positions (ride the tumble); hidden where the big basin is
  const cr = [
    { a: 20, k: 0.55, r: 0.07 },
    { a: 75, k: 0.7, r: 0.05 },
    { a: 110, k: 0.35, r: 0.09 },
    { a: 200, k: 0.6, r: 0.06 },
    { a: 300, k: 0.5, r: 0.045 },
    { a: 340, k: 0.78, r: 0.035 },
  ];
  const pole = rad(poleDeg);
  // the face-on basin ring: slides from the limb (face 0) to the disc centre (face 1), opening from a sliver to a circle
  const ringC: Pt = [cx + Math.cos(pole) * R * 0.92 * (1 - face), cy + Math.sin(pole) * R * 0.92 * (1 - face)];
  const ringRx = 250 * k * (0.55 + 0.45 * face); // #25 500 km wide
  const ringRy = 250 * k * Math.max(0.04, face);
  const ringRot = poleDeg + 90;
  return (
    <g opacity={opacity}>
      {bloom ? <Bloom x={cx - R * 0.4} y={cy - R * 0.35} r={R * 1.9} color={family.light} strength={0.13} spread={0.45} /> : null}
      <Form d={d} fill={fill} light={light} shadow={family.shadow} inset={R * 0.42} shadowOpacity={0.78} rim={family.light} rimWidth={Math.max(2, R * 0.024)} rimOpacity={0.9} bounce={FILL_PETROL} bounceOpacity={0.5}>
        {/* the petrol fill from the lower right, on the night side */}
        <LightWash x={cx + R * 0.55} y={cy + R * 0.5} rx={R * 0.95} ry={R * 0.8} color={FILL_PETROL} strength={0.28} />
        {/* lit flank toward the key */}
        <LightWash x={cx - R * 0.45} y={cy - R * 0.4} rx={R * 0.8} ry={R * 0.7} color={lit} strength={0.35} />
        {craters
          ? cr.map((c, i) => {
              const aa = rad(c.a + rot);
              const x = cx + Math.cos(aa) * R * c.k;
              const y = cy + Math.sin(aa) * R * c.k;
              const rr = R * c.r;
              // hide craters that fall inside the basin's footprint when it faces us
              const dd = Math.hypot(x - ringC[0], y - ringC[1]);
              if (face > 0.5 && dd < ringRx * 0.9) return null;
              const [lx, ly] = [Math.cos(rad(light)), Math.sin(rad(light))];
              return (
                <g key={i} opacity={0.9}>
                  <ellipse cx={x} cy={y} rx={rr} ry={rr * 0.8} fill={shade} opacity={0.7} />
                  <ellipse cx={x + lx * rr * 0.22} cy={y + ly * rr * 0.22} rx={rr * 0.74} ry={rr * 0.6} fill={mixHex(fill, family.shadow, 0.18)} />
                  <path d={`M${x - rr} ${y} A${rr} ${rr * 0.8} 0 0 1 ${x + rr} ${y}`} fill="none" stroke={lit} strokeWidth={Math.max(1, rr * 0.18)} opacity={0.8} transform={`rotate(${light - 180 + 90 - 90} ${x} ${y})`} />
                </g>
              );
            })
          : null}
        {face > 0.02 ? (
          <g transform={`rotate(${ringRot} ${ringC[0]} ${ringC[1]})`} opacity={Math.min(1, face * 3)}>
            {/* basin floor, a shade rim on the far side, a lit rim toward the key, the central peak as a lit knob */}
            <ellipse cx={ringC[0]} cy={ringC[1]} rx={ringRx} ry={ringRy} fill={mixHex(fill, family.shadow, 0.3)} />
            <ellipse cx={ringC[0]} cy={ringC[1]} rx={ringRx} ry={ringRy} fill="none" stroke={shade} strokeWidth={Math.max(2, R * 0.03)} opacity={0.85} />
            <ellipse cx={ringC[0]} cy={ringC[1]} rx={ringRx * 0.97} ry={ringRy * 0.97} fill="none" stroke={lit} strokeWidth={Math.max(1.5, R * 0.018)} opacity={0.75} strokeDasharray={`${ringRx * 1.4} ${ringRx * 4}`} transform={`rotate(${light - ringRot - 70} ${ringC[0]} ${ringC[1]})`} />
            <ellipse cx={ringC[0]} cy={ringC[1]} rx={100 * k} ry={100 * k * Math.max(0.04, face)} fill={mixHex(fill, family.light, 0.22)} />
            <ellipse cx={ringC[0] - 20 * k} cy={ringC[1] - 14 * k * face} rx={46 * k} ry={46 * k * Math.max(0.04, face)} fill={lit} opacity={0.8} />
          </g>
        ) : null}
      </Form>
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

/** Everest's silhouette as a lit form with a snow cap above 60 % of its height; `ghost` draws a dashed outline only. */
export const EverestSil: React.FC<{ x: number; base: number; w: number; h: number; family: Family; light?: number; ghost?: boolean; opacity?: number; dot?: boolean; frame?: number }> = ({ x, base, w, h, family: Fm, light = KEY, ghost = false, opacity = 1, dot = false, frame = 0 }) => {
  const pts = hornPts(x, base, w, h);
  const d = ridgePath(pts, base, Math.max(2, w * 0.02));
  if (ghost) return <path d={d} fill={alpha(Fm.text, 0.06)} stroke={Fm.text} strokeWidth={Math.max(1.5, h * 0.012)} strokeDasharray={`${h * 0.05} ${h * 0.035}`} opacity={opacity} />;
  const line = base - h * 0.58;
  const top = pts.filter((p) => p[1] <= line + h * 0.08);
  const cap = roundPoly([...top, ...top.slice().reverse().map(([px], i): Pt => [px, Math.max(line + Math.sin(i * 1.9 + px * 0.05) * h * 0.03 + (i % 2 ? h * 0.03 : -h * 0.01), hornY(pts, px))])], h * 0.02);
  return (
    <g opacity={opacity}>
      <Form d={d} fill={DUSK.mid} light={light} shadow={Fm.shadow} inset={Math.max(6, h * 0.08)} shadowOpacity={0.5} rim={Fm.light} rimWidth={Math.max(1.5, h * 0.01)} rimOpacity={0.85} bounce={Fm.bounce}>
        <Facets pts={pts} base={base} light={light} fill={Fm.shadow} opacity={0.42} />
        <Facets pts={pts} base={base} light={light} fill={mixHex(DUSK.mid, Fm.light, 0.5)} opacity={0.38} lit />
        <path d={cap} fill={L12_COLORS.snow} />
      </Form>
      {dot ? <circle cx={x} cy={base - h - 2} r={Math.max(3, h * 0.02) + Math.sin(frame / 9)} fill={P.vermilion} /> : null}
    </g>
  );
};
const hornY = (pts: Pt[], x: number) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    if (x >= ax && x <= bx) return ay + ((by - ay) * (x - ax)) / (bx - ax || 1);
  }
  return pts[0][1];
};

/** A shallow shield (Mauna Kea, Olympus Mons) or a dome (Rheasilvia's peak): a smooth profile over a base line. */
const domePts = (x: number, base: number, w: number, h: number, pow = 2, n = 24, notch = 0): Pt[] =>
  Array.from({ length: n + 1 }, (_, i): Pt => {
    const u = (i / n) * 2 - 1;
    let v = Math.max(0, 1 - Math.pow(Math.abs(u), pow));
    if (notch > 0 && Math.abs(u) < 0.08) v -= notch * (1 - Math.abs(u) / 0.08);
    return [x + (u * w) / 2, base - v * h];
  });

/** The Earth as a lit disc (M-01's last rung, Z-08): petrol ocean, soft green land, a polar cap, cloud wisps, rim light. */
export const EarthDisc: React.FC<{ cx: number; cy: number; r: number; frame: number; family?: Family; light?: number; ring?: number; opacity?: number }> = ({ cx, cy, r, frame, family: Fm = F, light = KEY, ring = 0, opacity = 1 }) => {
  const d = circlePath(cx, cy, r);
  const blob = (ox: number, oy: number, rr: number, n: number, seed: number, w: number, sq: number) => roundPoly(
    Array.from({ length: n }, (_, i): Pt => {
      const a = (i / n) * TAU;
      const q = rr * (1 + (rnd(seed * 13 + i) - 0.5) * 2 * w);
      return [cx + ox * r + Math.cos(a) * q * r, cy + oy * r + Math.sin(a) * q * r * sq];
    }),
    r * 0.06,
  );
  const spin = (frame * 0.02) % 1; // clouds drift slowly across the disc
  return (
    <g opacity={opacity}>
      <Bloom x={cx - r * 0.5} y={cy - r * 0.4} r={r * 2.2} color={Fm.light} strength={0.16} spread={0.4} />
      <Form d={d} fill="#2F6F80" light={light} shadow={Fm.shadow} inset={r * 0.5} shadowOpacity={0.85} rim={Fm.light} rimWidth={Math.max(2, r * 0.03)} rimOpacity={0.95} bounce={FILL_PETROL} bounceOpacity={0.4}>
        <g fill="#6E9A68" opacity={0.95}>
          <path d={blob(-0.18, -0.2, 0.3, 10, 3, 0.3, 1.25)} />
          <path d={blob(0.25, 0.05, 0.24, 9, 5, 0.32, 1.4)} />
          <path d={blob(-0.1, 0.42, 0.18, 8, 8, 0.3, 0.8)} />
          <path d={blob(0.45, -0.4, 0.14, 8, 12, 0.3, 1.0)} />
        </g>
        <ellipse cx={cx} cy={cy - r * 0.96} rx={r * 0.55} ry={r * 0.07} fill="#F4EFE6" />
        <ellipse cx={cx + r * 0.1} cy={cy + r * 0.97} rx={r * 0.4} ry={r * 0.05} fill="#F4EFE6" opacity={0.9} />
        <g fill="#FFFFFF" opacity={0.82} transform={`translate(${(spin * r * 0.3 - r * 0.15).toFixed(1)} 0)`}>
          <path d={blob(0.05, -0.1, 0.36, 10, 21, 0.25, 0.26)} transform={`rotate(-22 ${cx} ${cy})`} />
          <path d={blob(-0.2, 0.3, 0.28, 9, 23, 0.25, 0.28)} transform={`rotate(-26 ${cx} ${cy})`} />
          <path d={blob(0.35, 0.45, 0.2, 8, 25, 0.25, 0.3)} transform={`rotate(-18 ${cx} ${cy})`} />
        </g>
        <LightWash x={cx + r * 0.6} y={cy + r * 0.55} rx={r} ry={r * 0.9} color={FILL_PETROL} strength={0.22} />
      </Form>
      {ring > 0 ? (
        <g opacity={ring}>
          <circle cx={cx} cy={cy} r={r + 10 + Math.sin(frame / 14) * 2} fill="none" stroke={Fm.text} strokeWidth={2} strokeDasharray="10 8" opacity={0.75} />
          <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={Fm.text} strokeWidth={2.5} />
          <circle cx={cx} cy={cy} r={5} fill={Fm.text} />
          <line x1={cx + r} y1={cy - 10} x2={cx + r} y2={cy + 10} stroke={Fm.text} strokeWidth={2.5} />
        </g>
      ) : null}
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

/** A honesty plate: a calm bone card with a soft shadow and a slate top rule; `t` 0..1 brings it in. */
const Plate: React.FC<{ x: number; y: number; w: number; h: number; t?: number; children?: React.ReactNode }> = ({ x, y, w, h, t = 1, children }) => {
  const e = smooth(t);
  const sc = 0.96 + 0.04 * e;
  return (
    <g opacity={e} transform={`translate(${x + w / 2} ${y + h / 2}) scale(${sc}) translate(${-(x + w / 2)} ${-(y + h / 2)})`}>
      <path d={rrect(x + 10, y + 16, w, h, 18)} fill={alpha(S.shadow, 0.22)} filter="url(#soft-16)" />
      <path d={rrect(x, y, w, h, 18)} fill={S.light} />
      <path d={rrect(x, y, w, h, 18)} fill="none" stroke={mixHex(S.light, S.shadow, 0.18)} strokeWidth={1.5} />
      <rect x={x + 28} y={y + 22} width={64} height={6} rx={3} fill={L12_COLORS.slate} />
      {children}
    </g>
  );
};

/** The studio room of 8-08…8-14: paper sky, hazed far hills, a bone floor plane. */
const StudioRoom: React.FC<{ f: number; floor?: number; lamp?: boolean }> = ({ f, floor = 900, lamp = true }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={S} />
      {lamp ? <Bloom x={260} y={40} r={820} color={S.light} strength={0.5 * pulse(f, 120, 0.1, 5)} spread={0.3} squash={0.8} /> : null}
    </Layer>
    <Layer depth={0.3} haze={{ color: S.haze, amount: 0.35 }}>
      <path d={ridgePath([[-400, floor - 110], [200, floor - 170], [700, floor - 130], [1200, floor - 190], [1700, floor - 140], [2320, floor - 180]], floor + 400, 70)} fill={S.far} />
    </Layer>
    <Layer depth={1}>
      <rect x={-500} y={floor} width={2900} height={600} fill={S.near} />
      <rect x={-500} y={floor} width={2900} height={6} fill={mixHex(S.near, S.light, 0.35)} />
      <Motes frame={f} n={26} x={60} y={60} w={1500} h={760} color={S.light} seed={7} size={3} drift={30} />
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
  const cx = 820;
  const cy = 620;
  const stretch0 = c.stretch - c.start;
  const grow = smooth(f, stretch0 - 40, stretch0 + 70); // the ghost peak climbs
  const km = 340 * grow; // #26
  const topY = cy - VR - 4; // the top surface (the lumps sit within a few px)
  const apexY = topY - km;
  const radiusT = smooth(f, c.radius - c.start, c.radius - c.start + 36);
  const tiltT = smooth(f, c.tilt - c.start, c.tilt - c.start + 22);
  const cam = cameraAt(f, [
    { f: 0, x: cx, y: cy - 150, zoom: 1.28 },
    { f: stretch0 + 70, x: cx, y: cy - 170, zoom: 0.86 },
    { f: len + 20, x: cx + 40, y: cy - 150, zoom: 0.8 },
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
        <Vesta cx={cx} cy={cy} frame={f} rot={rot} poleDeg={150} />
        {/* the predicted mountain: a dashed ghost peak standing on the top of the world, 340 km tall (#26) */}
        {grow > 0.01 ? (
          <g>
            <path d={`M${cx - 190} ${topY + 14} L${cx - 60} ${apexY + km * 0.18} L${cx} ${apexY} L${cx + 50} ${apexY + km * 0.14} L${cx + 190} ${topY + 14} Z`} fill={alpha(F.text, 0.07)} stroke={F.text} strokeWidth={3} strokeDasharray="14 10" strokeLinejoin="round" opacity={0.9} />
            <g transform={`translate(${cx + 36} ${apexY - 14})`}>
              <text x={-6} y={0} textAnchor="end" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 52, fill: F.text }}>
                ~
              </text>
              <Counter x={0} y={0} value={km} max={340} size={52} color={F.text} unit="km" />
            </g>
          </g>
        ) : null}
        {/* 8-02: the radius bar, surface to centre, 263 km (#23), drawn to the MEAN radius (F13) */}
        {radiusT > 0 ? (
          <g opacity={radiusT}>
            <line x1={cx + 300} y1={topY + 6} x2={cx + 300} y2={topY + 6 + VR * radiusT} stroke={F.second} strokeWidth={6} strokeLinecap="round" />
            <line x1={cx + 286} y1={topY + 6} x2={cx + 314} y2={topY + 6} stroke={F.second} strokeWidth={4} />
            <line x1={cx + 286} y1={cy} x2={cx + 314} y2={cy} stroke={F.second} strokeWidth={4} opacity={radiusT} />
            <line x1={cx + 300} y1={cy} x2={cx + 40} y2={cy} stroke={F.second} strokeWidth={2} strokeDasharray="6 8" opacity={0.7 * radiusT} />
            <circle cx={cx} cy={cy} r={7} fill={F.second} opacity={radiusT} />
            <Pill x={cx + 330} y={cy} text="SURFACE TO CENTRE" fill={pillFill(F)} color={F.text} dot={F.second} size={17} />
            <Metric x={cx + 330} y={topY + 70} value={`${Math.round(263 * Math.min(1, radiusT * 1.4))}`} unit="km" size={56} color={F.text} />
          </g>
        ) : null}
        {/* Tick, not to scale, on the top of the world beside the ghost peak; a head tilt on "surface to its centre" */}
        {radiusT > 0 ? (
          <g opacity={Math.min(1, radiusT * 2)}>
            <GroundShadow x={cx - 228} y={topY + 10} rx={26} color={F.shadow} opacity={0.5} blur={4} />
            <Tick x={cx - 232} y={topY + 10} pxPerM={64} frame={f} pose="hips" expression="thinking" look={0.7} outline={F.shadow} headTilt={16 * tiltT} seed={3} />
            <Pill x={cx - 232} y={topY - 134} text="NOT TO SCALE" fill={pillFill(F)} color={F.dim} size={14} align="middle" />
          </g>
        ) : null}
      </Layer>
      <Layer depth={0}>
        <L12Gauge family={F} value={0} marker={false} max={100000} zoomTo={1000000} zoomT={gaugeZoom} ceiling={{ v: 340000 * grow, label: grow > 0.97 ? "PREDICTED" : undefined }} readout={false} />
      </Layer>
    </Stage>
  );
};

/** 8-03: Tick large holds the predicted bar as a rod beside the potato: longer than the radius line, deadpan to camera. */
const ShotRod: ShotFC<CL08> = ({ f, len, c }) => {
  const k = 0.5; // px per km in this shot
  const vx = 700;
  const vy = 640;
  const R = VR * k;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.02 },
    { f: len + 10, x: 980, y: 540, zoom: 1.09 },
  ]);
  const b0 = c.bigger - c.rod;
  const deadpan = smooth(f, b0, b0 + 18);
  const rodT = smooth(f, 4, 30);
  const rodLen = 340 * k; // #26
  const tx = 1270;
  const ty = 1040;
  const ppm = 300;
  // the rod sits in Tick's carry hands (front hand local (42, -92) at pxPerM 300, facing -1)
  const hx = tx - 0.42 * ppm;
  const hy = ty - 0.95 * ppm;
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.45}>
        <VoidSky f={f} />
        <Layer depth={0.4} haze={{ color: F.haze, amount: 0.25 }}>
          <Motes frame={f} n={24} x={-200} y={-100} w={2300} h={1300} color={F.dim} seed={33} size={2} drift={9} glow={false} />
        </Layer>
        <Layer depth={1}>
          <Vesta cx={vx} cy={vy} R={R} frame={f} rot={20 + f * 0.03} poleDeg={150} />
          {/* the radius line on the potato: surface to centre, 263 km (#23) */}
          <line x1={vx} y1={vy - R} x2={vx} y2={vy} stroke={F.second} strokeWidth={5} strokeLinecap="round" />
          <circle cx={vx} cy={vy} r={6} fill={F.second} />
          <line x1={vx - 14} y1={vy - R} x2={vx + 14} y2={vy - R} stroke={F.second} strokeWidth={3.5} />
          {/* the rod in Tick's hands: the 340-km prediction (#26), dashed like the ceiling line */}
          <g opacity={rodT}>
            <rect x={hx - 7} y={hy - rodLen * 0.55} width={14} height={rodLen} rx={5} fill={alpha(F.text, 0.1)} stroke={F.text} strokeWidth={3} strokeDasharray="12 9" />
            <line x1={hx - 22} y1={hy - rodLen * 0.55} x2={hx + 22} y2={hy - rodLen * 0.55} stroke={F.text} strokeWidth={3} />
            <line x1={hx - 22} y1={hy + rodLen * 0.45} x2={hx + 22} y2={hy + rodLen * 0.45} stroke={F.text} strokeWidth={3} />
            {/* a faint level line from the radius top across to the rod, so the eye compares the two lengths */}
            <line x1={vx + 20} y1={vy - R} x2={hx - 30} y2={vy - R} stroke={F.dim} strokeWidth={1.5} strokeDasharray="4 8" opacity={0.5} />
          </g>
          <Tick x={tx} y={ty} pxPerM={ppm} frame={f} facing={-1} pose="carry" expression="surprised" expressionTo="neutral" expressionT={deadpan} look={-0.2 - 0.6 * deadpan} seed={4} tilt={-3} />
          <Pill x={tx - 120} y={ty - 1.95 * ppm} text="NOT TO SCALE" fill={pillFill(F)} color={F.dim} size={15} align="middle" />
        </Layer>
      </Stage>
    </Pop>
  );
};

/** 8-04 + 8-05 (one shot): Vesta turns its south pole to us (the 500-km basin outline), then the pole swings to the
 *  limb and the camera pushes into the section: the bowl 19 km deep. */
const ShotPole: ShotFC<CL08> = ({ f, len, c }) => {
  const cx = 820;
  const cy = 580;
  const face0 = c.faceOn - c.pole;
  const sec0 = c.section - c.pole;
  const faceIn = smooth(f, 10, face0 + 10); // pole toward the camera
  const faceOut = smooth(f, face0 + 40, sec0); // pole swings up to the limb
  const face = faceIn * (1 - faceOut);
  const poleDeg = faceOut > 0 ? 150 + 120 * faceOut : 150; // the pole ends at 270 (straight up)
  const dish = faceOut;
  const push = smooth(f, sec0, sec0 + 56);
  const cam = cameraAt(f, [
    { f: 0, x: cx, y: cy - 20, zoom: 0.96 },
    { f: sec0, x: cx, y: cy - 60, zoom: 1.0 },
    { f: sec0 + 56, x: cx, y: cy - VR + 10, zoom: 3.4 },
    { f: len + 20, x: cx + 10, y: cy - VR + 6, zoom: 3.55 },
  ]);
  const rimY = cy - VR + 2; // the rim level at the pole (the lumps sit about here); the floor is 19 km lower (#25)
  const bracketX = cx - 420;
  const metric500 = smooth(f, face0 + 6, face0 + 26) * (1 - smooth(f, sec0 + 10, sec0 + 30));
  const metric19 = smooth(f, sec0 + 40, sec0 + 62);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.45}>
        <VoidSky f={f} />
        <Layer depth={0.3} haze={{ color: F.haze, amount: 0.3 }}>
          <Motes frame={f} n={30} x={-300} y={-200} w={2500} h={1500} color={F.dim} seed={35} size={2.2} drift={8} glow={false} />
        </Layer>
        <Layer depth={1}>
          <Vesta cx={cx} cy={cy} frame={f} rot={f * 0.025} poleDeg={poleDeg} face={face} dish={dish} peak={0} />
          {/* 8-04 label: the basin face-on, 500 km across (#25) */}
          <g opacity={metric500}>
            <Metric x={cx} y={cy + VR + 90} value="500" unit="km" size={60} color={F.text} align="middle" />
            <Pill x={cx} y={cy + VR + 140} text="RHEASILVIA" fill={pillFill(F)} color={F.text} dot={F.second} size={17} align="middle" />
          </g>
          {/* 8-05: the section's depth bracket: rim level (dashed) down to the floor, 19 km (#25); 1 px = 1 km here */}
          <g opacity={metric19 * push}>
            <line x1={cx - 520} y1={rimY} x2={cx + 520} y2={rimY} stroke={F.text} strokeWidth={0.8} strokeDasharray="4 4" opacity={0.7} />
            <line x1={bracketX} y1={rimY} x2={bracketX} y2={rimY + 19} stroke={F.second} strokeWidth={1.6} />
            <line x1={bracketX - 6} y1={rimY} x2={bracketX + 6} y2={rimY} stroke={F.second} strokeWidth={1.4} />
            <line x1={bracketX - 6} y1={rimY + 19} x2={bracketX + 6} y2={rimY + 19} stroke={F.second} strokeWidth={1.4} />
            <text x={bracketX - 12} y={rimY + 15} textAnchor="end" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 16, fill: F.text }}>
              19 km
            </text>
            <text x={bracketX - 12} y={rimY + 27} textAnchor="end" style={{ fontFamily: "'Anton', sans-serif", fontSize: 7, letterSpacing: 1.2, fill: F.dim }}>
              DEEP
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
  const shake = f > h0 && f < h0 + 26 ? Math.sin(f * 2.1) * 6 * (1 - (f - h0) / 26) : 0;
  const cam = cameraAt(f, [
    { f: 0, x: cx + 10, y: cy - VR + 6, zoom: 3.4 },
    { f: len + 10, x: cx, y: cy - VR + 2, zoom: 3.1 },
  ]);
  const camS = { ...cam, x: cam.x + shake };
  const rimY = cy - VR + 2;
  const apex = rimY - 19 + 20 * peak; // #25 floor, #24 peak: the summit ends about a kilometre above the rim level
  // debris: specks thrown up from the heave on parabolic arcs
  const debris = Array.from({ length: 16 }, (_, i) => {
    const t0 = h0 - 2 + rnd(i) * 10;
    const tt = f - t0;
    if (tt < 0 || tt > 40) return null;
    const vx = (rnd(i * 3) - 0.5) * 3.2;
    const vy = -(1.6 + rnd(i * 7) * 1.6);
    return { x: cx + (rnd(i * 11) - 0.5) * 60 + vx * tt, y: apex + 6 + vy * tt + 0.06 * tt * tt, o: 1 - tt / 40, r: 0.8 + rnd(i * 5) * 1.2 };
  });
  const label = smooth(f, h0 + 20, h0 + 40);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={camS} vignette={0.26} grain={0.45} overlay={<Flash f={f} at={h0} peak={0.25} />}>
        <VoidSky f={f} />
        <Layer depth={1}>
          <Vesta cx={cx} cy={cy} frame={f} rot={0} poleDeg={270} face={0} dish={1} peak={peak} />
          {debris.map((d, i) => (d ? <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={mixHex(TAUPE, F.light, 0.4)} opacity={d.o} /> : null))}
          <line x1={cx - 520} y1={rimY} x2={cx + 520} y2={rimY} stroke={F.text} strokeWidth={0.8} strokeDasharray="4 4" opacity={0.5} />
          {/* width bracket under the peak: ~200 km across (#24) */}
          <g opacity={label}>
            <line x1={cx - 100} y1={rimY + 34} x2={cx + 100} y2={rimY + 34} stroke={F.second} strokeWidth={1.4} />
            <line x1={cx - 100} y1={rimY + 29} x2={cx - 100} y2={rimY + 39} stroke={F.second} strokeWidth={1.4} />
            <line x1={cx + 100} y1={rimY + 29} x2={cx + 100} y2={rimY + 39} stroke={F.second} strokeWidth={1.4} />
            <Pill x={cx} y={rimY + 52} text="~200 km ACROSS" fill={pillFill(F)} color={F.text} dot={F.second} size={7} align="middle" />
          </g>
        </Layer>
        <Layer depth={0}>
          <L12Gauge family={F} value={20000 * peak /* #24 */} max={100000} readout={peak > 0.95 ? "~20 km" : false} base={label > 0.5 ? "FROM ITS BASE" : undefined} opacity={0.95} />
        </Layer>
      </Stage>
    </Pop>
  );
};

/** 8-07: the peak's profile at 8 px per km beside 2.5 Everests stacked (the third ghosted: "about"), and a dashed
 *  route across a small Vesta for "drive across in a day" (500 km, #23). */
const ShotStack: ShotFC<CL08> = ({ f, len, c }) => {
  const K = 8; // px per km
  const base = 840;
  const peakPts = domePts(1000, base, 200 * K /* #24 */, 20 * K /* #24 */, 1.8, 40);
  const ev = 8.849 * K; // #1
  const stackX = 300;
  const hits = [6, 22, 38];
  const cam = cameraAt(f, [
    { f: 0, x: 940, y: 560, zoom: 1.0 },
    { f: len + 10, x: 900, y: 540, zoom: 1.07 },
  ]);
  const route = smooth(f, 30, 90);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.45}>
        <VoidSky f={f} />
        <Layer depth={0.5} haze={{ color: F.haze, amount: 0.2 }}>
          <Motes frame={f} n={26} x={-200} y={0} w={2300} h={1000} color={F.dim} seed={37} size={2} drift={9} glow={false} />
        </Layer>
        <Layer depth={1}>
          {/* the central peak in profile */}
          <Form d={ridgePath(peakPts, base + 60, 10)} fill={TAUPE} light={KEY} shadow={F.shadow} inset={40} shadowOpacity={0.6} rim={F.light} rimWidth={3} rimOpacity={0.9} bounce={FILL_PETROL} bounceOpacity={0.45}>
            <Facets pts={peakPts} base={base + 60} light={KEY} fill={F.shadow} opacity={0.35} />
            <LightWash x={1300} y={base + 20} rx={700} ry={120} color={FILL_PETROL} strength={0.25} />
          </Form>
          <rect x={-400} y={base} width={2720} height={200} fill={mixHex(TAUPE, F.shadow, 0.55)} />
          <line x1={-400} y1={base} x2={2320} y2={base} stroke={F.light} strokeWidth={2} opacity={0.5} />
          {/* 2.5 Everests stacked beside it: two land, the third is a ghost (#24: "about two and a half") */}
          {hits.map((h, i) => {
            const t = smooth(f, h, h + 10);
            if (t <= 0) return null;
            const sq = impact(f, h + 8, 0.14, 10);
            const b = base - i * ev;
            const drop = (1 - t) * 160;
            return (
              <g key={i} transform={`translate(${stackX} ${b - drop}) scale(${sq.sx} ${sq.sy}) translate(${-stackX} ${-b + drop})`} opacity={i === 2 ? 0.75 : 1}>
                <EverestSil x={stackX} base={b - drop} w={ev * 1.5} h={ev * (i === 2 ? 0.5 : 1)} family={F} ghost={i === 2} dot={i === 0} frame={f} />
              </g>
            );
          })}
          <Pill x={stackX} y={base - 2.5 * ev - 54} text="~2.5 × EVEREST" fill={pillFill(F)} color={F.text} dot={P.vermilion} size={17} align="middle" />
          {/* a small Vesta with the 500-km drive across it (#23) */}
          <g transform="translate(1560 250)">
            <Vesta cx={0} cy={0} R={92} frame={f} rot={f * 0.04} poleDeg={130} craters bloom={false} />
            <path d="M-86 10 Q-30 -40 30 -10 T88 -6" fill="none" stroke={F.text} strokeWidth={2.5} strokeDasharray="7 7" strokeDashoffset={crawl(f, 0.6)} opacity={0.85 * route} />
            <circle cx={-86 + 174 * ((f * 0.004) % 1)} cy={10 - Math.sin(((f * 0.004) % 1) * Math.PI) * 28} r={4} fill={F.light} opacity={route} />
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
  const mx = 1056;
  const my = 755;
  const R = 135;
  const ppm = 260;
  const tx = 1150;
  const place0 = c.place - c.table;
  const shrug0 = c.shrug - c.table;
  const placed = smooth(f, place0, place0 + 12);
  const lift = smooth(f, place0 + 8, place0 + 34); // hold → stand after placing
  const shrugT = smooth(f, shrug0, shrug0 + 30);
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 640, zoom: 1.0 },
    { f: len + 10, x: 1010, y: 650, zoom: 1.24 },
  ]);
  const top = my - R * (1 - 0.07 + 0.076); // the peak's summit on the model (same proportions as vestaPts)
  const hand: Pt = [tx - 0.36 * ppm, floor - 1.04 * ppm];
  const stonePos: Pt = placed < 1 ? [hand[0] - 4 + (top - hand[1] - 6) * 0 , hand[1] + 6 + (top - 8 - hand[1] - 6) * placed] : [mx, top - 8];
  const stoneX = placed < 1 ? hand[0] + (mx - hand[0]) * placed : mx;
  const pebbles = [0, 1, 2].map((i) => smooth(f, shrug0 + 10 + i * 12, shrug0 + 20 + i * 12));
  const bar = smooth(f, shrug0 + 48, shrug0 + 70);
  const pebble = (x: number, y: number, r: number, seed: number) => (
    <Form d={roundPoly(Array.from({ length: 9 }, (_, i): Pt => [x + Math.cos((i / 9) * TAU) * r * (1 + (rnd(seed + i) - 0.5) * 0.3), y + Math.sin((i / 9) * TAU) * r * 0.82 * (1 + (rnd(seed * 3 + i) - 0.5) * 0.3)]), r * 0.4)} fill={mixHex(TAUPE, S.shadow, 0.25)} light={225} shadow={S.shadow} inset={r * 0.5} shadowOpacity={0.5} rim={S.light} rimWidth={2} rimOpacity={0.8} bounce={S.bounce} />
  );
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5} overlay={<Flash f={f} at={place0 + 12} peak={0.12} />}>
        <StudioRoom f={f} floor={floor} />
        <Layer depth={1}>
          {/* the tabletop model: pole up, the basin and its peak at the top */}
          <GroundShadow x={mx + 10} y={floor - 2} rx={R * 1.05} ry={R * 0.16} color={S.shadow} opacity={0.35} blur={16} />
          <Vesta cx={mx} cy={my} R={R} frame={f} rot={0} poleDeg={270} dish={1} peak={1} family={S} light={225} fill={mixHex(TAUPE, S.light, 0.12)} bloom={false} />
          {/* the stone: in the mitten, then on the peak */}
          <g transform={`translate(${(stoneX - mx).toFixed(1)} ${(stonePos[1] - (top - 8)).toFixed(1)})`}>{pebble(mx, top - 8, 14, 5)}</g>
          {pebbles.map((p, i) => (p > 0 ? <g key={i} transform={`translate(0 ${((1 - p) * -40).toFixed(1)})`} opacity={p}>{pebble(mx + (i % 2 ? -4 : 5), top - 8 - 24 - 46 * i - (i === 2 ? 6 : 0), 24 - i * 2, 11 + i * 7)}</g> : null))}
          {/* the model's own radius bar beside it: its surface to its centre */}
          <g opacity={bar}>
            <line x1={mx - R - 70} y1={my - R} x2={mx - R - 70} y2={my} stroke={L12_COLORS.slate} strokeWidth={5} strokeLinecap="round" />
            <line x1={mx - R - 84} y1={my - R} x2={mx - R - 56} y2={my - R} stroke={L12_COLORS.slate} strokeWidth={3} />
            <line x1={mx - R - 84} y1={my} x2={mx - R - 56} y2={my} stroke={L12_COLORS.slate} strokeWidth={3} />
            <line x1={mx - R - 70} y1={my} x2={mx - 20} y2={my} stroke={L12_COLORS.slate} strokeWidth={1.6} strokeDasharray="4 8" opacity={0.6} />
            <circle cx={mx} cy={my} r={5} fill={L12_COLORS.slate} />
            {/* a level line from the bar's top across to the stack */}
            <line x1={mx - R - 56} y1={my - R} x2={mx - 40} y2={my - R} stroke={L12_COLORS.slate} strokeWidth={1.4} strokeDasharray="3 7" opacity={0.6} />
          </g>
          <GroundShadow x={tx - 10} y={floor - 1} rx={ppm * 0.4} color={S.shadow} opacity={0.4} blur={8} />
          <Tick
            x={tx}
            y={floor}
            pxPerM={ppm}
            frame={f}
            facing={-1}
            pose={shrugT > 0 ? "stand" : "hold"}
            poseTo={shrugT > 0 ? "shrug" : "stand"}
            poseT={shrugT > 0 ? shrugT * 1.6 : lift * 1.6}
            expression={shrugT > 0 ? "happy" : "determined"}
            look={shrugT > 0 ? -0.5 : 0.6}
            seed={6}
            outline={S.shadow}
          />
        </Layer>
      </Stage>
    </Pop>
  );
};

/** The three thumbnails of plates already shown, bottom-left (the "done" stack), calm. */
const DonePlates: React.FC<{ n: number; t: number }> = ({ n, t }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const last = i === n - 1;
      const e = last ? smooth(t) : 1;
      const x = 150 + i * 84;
      return (
        <g key={i} opacity={0.9} transform={`translate(${x} 968) scale(${0.9 + 0.1 * e})`}>
          <rect x={0} y={0} width={64} height={44} rx={6} fill={S.light} stroke={mixHex(S.light, S.shadow, 0.25)} strokeWidth={1.2} />
          <rect x={8} y={7} width={18} height={3} rx={1.5} fill={L12_COLORS.slate} />
          {i === 0 ? <rect x={26} y={18} width={12} height={20} fill={L12_COLORS.slate} opacity={0.7} /> : null}
          {i === 1 ? <path d="M10 36 Q32 14 54 36" fill={MARS.mid} opacity={0.7} /> : null}
          {i === 2 ? <path d="M14 38 L32 16 L50 38 Z" fill={DUSK.mid} opacity={0.75} /> : null}
        </g>
      );
    })}
  </g>
);

const PL = { x: 150, y: 290, w: 780, h: 520 };

/** 8-10 + 8-11 (one push): plate 1, the column rule is rough: the cracked column; then the press vs the buried block
 *  (confined rock is stronger) and the gauge band relabelled FLOOR (#9, #4). Tick sits with the staff across its knees. */
const ShotPlate1: ShotFC<CL08> = ({ f, len, c }) => {
  const con0 = c.confined - c.plates;
  const floor0 = c.floor - c.plates;
  const toPress = smooth(f, con0, con0 + 24);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: con0, x: 940, y: 560, zoom: 1.03 },
    { f: con0 + 40, x: PL.x + PL.w / 2 + 20, y: PL.y + PL.h / 2 + 10, zoom: 1.32 },
    { f: len + 10, x: PL.x + PL.w / 2 + 30, y: PL.y + PL.h / 2, zoom: 1.38 },
  ]);
  const floor = 900;
  const cx = PL.x + PL.w / 2;
  const colBase = PL.y + PL.h - 90;
  const bw = 132;
  const bh = 66;
  const press = Math.sin(f / 7) * 2;
  const crack = smooth(f, 20, 80);
  const gaugeIn = smooth(f, con0 + 10, con0 + 40);
  const floorT = smooth(f, floor0, floor0 + 20);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5}>
        <StudioRoom f={f} floor={floor} />
        <Layer depth={1}>
          <Plate {...PL} t={smooth(f, 0, 16)}>
            {/* 1a: the cracked column (the rule's picture) */}
            <g opacity={1 - toPress}>
              {[0, 1, 2, 3].map((i) => (
                <SlateBlock key={i} x={cx - bw / 2 - 20} y={colBase - i * bh} w={bw} h={bh} family={S} light={225} crack={i === 0 ? crack : 0} split={i === 0 ? crack * 0.6 : 0} />
              ))}
              <line x1={cx - 230} y1={colBase + 2} x2={cx + 230} y2={colBase + 2} stroke={mixHex(S.light, S.shadow, 0.35)} strokeWidth={2} />
              <path d={`M${cx + 120} ${colBase - 4 * bh - 30} l0 ${4 * bh + 26}`} stroke={L12_COLORS.amber} strokeWidth={3} strokeDasharray="8 6" opacity={0.8} />
              <path d={`M${cx + 108} ${colBase - 4 * bh - 20} L${cx + 120} ${colBase - 4 * bh - 34} L${cx + 132} ${colBase - 4 * bh - 20}`} fill="none" stroke={L12_COLORS.amber} strokeWidth={3} strokeLinecap="round" opacity={0.8} />
            </g>
            {/* 1b: a block in a press beside a block buried, confined on all sides, with a root under it */}
            <g opacity={toPress}>
              {/* the press */}
              <SlateBlock x={cx - 330} y={colBase - 150 + press} w={200} h={26} d={30} family={S} light={225} shadow={false} />
              <SlateBlock x={cx - 285} y={colBase - 22} w={110} h={110} d={36} family={S} light={225} color={L12_COLORS.granite} crack={0.9} split={0.5} shadow={false} />
              <SlateBlock x={cx - 330} y={colBase + 6} w={200} h={26} d={30} family={S} light={225} />
              <path d={`M${cx - 230} ${colBase - 190 + press} l0 30 m-10 -12 l10 12 l10 -12`} fill="none" stroke={L12_COLORS.amber} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
              {/* the buried block: ground mass, inward arrows, a root wedge beneath */}
              <path d={rrect(cx + 30, colBase - 200, 330, 240, 14)} fill={mixHex(L12_COLORS.slate, S.light, 0.35)} />
              <path d={rrect(cx + 30, colBase - 200, 330, 240, 14)} fill="none" stroke={mixHex(L12_COLORS.slate, S.shadow, 0.2)} strokeWidth={1.5} />
              <path d={`M${cx + 150} ${colBase + 40} L${cx + 195} ${colBase + 110} L${cx + 240} ${colBase + 40} Z`} fill={mixHex(L12_COLORS.slate, S.light, 0.1)} />
              <SlateBlock x={cx + 140} y={colBase - 28} w={110} h={110} d={36} family={S} light={225} color={L12_COLORS.granite} shadow={false} />
              {(
                [
                  [cx + 70, colBase - 82, 0],
                  [cx + 320, colBase - 82, 180],
                  [cx + 195, colBase - 170, 90],
                  [cx + 195, colBase + 24, 270],
                ] as [number, number, number][]
              ).map(([ax, ay, ang], i) => {
                const k = 1 + 0.06 * Math.sin(f / 9 + i);
                return (
                  <g key={i} transform={`translate(${ax} ${ay}) rotate(${ang}) scale(${k})`}>
                    <path d="M-26 0 L14 0 M4 -10 L14 0 L4 10" fill="none" stroke={L12_COLORS.amber} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                );
              })}
            </g>
          </Plate>
          <GroundShadow x={1430} y={floor - 1} rx={110} color={S.shadow} opacity={0.4} blur={8} />
          <Tick x={1440} y={floor} pxPerM={230} frame={f} facing={-1} pose="sit" expression="thinking" look={0.5} seed={8} outline={S.shadow} />
          {/* the staff across the knees */}
          <g transform={`translate(1440 ${floor - 0.52 * 230}) rotate(-6)`}>
            <rect x={-150} y={-5} width={300} height={10} rx={4} fill="#EFE6D2" />
            {Array.from({ length: 9 }, (_, i) => (
              <rect key={i} x={-140 + i * 32} y={-5} width={9} height={10} fill={i % 2 ? "#1E2226" : P.vermilion} />
            ))}
            <path d="M150 -5 L166 0 L150 5 Z" fill={P.vermilion} />
          </g>
        </Layer>
        <Layer depth={0}>
          <g opacity={1 - toPress}>
            <Kicker x={120} y={128} text="A few honest notes" color={S.dim} size={22} />
            <Headline x={120} y={236} lines={["The column rule is rough"]} size={62} color={S.text} accent={L12_COLORS.amber} />
          </g>
          <g opacity={toPress}>
            <Pill x={960} y={990} text="CONFINED ROCK IS STRONGER" fill={pillFill(S)} color={S.light} dot={L12_COLORS.amber} size={19} align="middle" />
          </g>
          <g opacity={gaugeIn}>
            <L12Gauge family={S} value={HEIGHTS.everest /* #1 */} readout={false} bands={[{ ...HEIGHTS.crushBand /* #9 */, color: L12_COLORS.amber, label: floorT > 0.5 ? "FLOOR · 4-9 km" : "4-9 km · SOLID COLUMN" }]} />
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
  const VX = 6; // vertical exaggeration (the real slopes are 2-5°, #18)
  const kmH = 6 * VX; // px per km of height
  const cx = PL.x + PL.w / 2 + 10;
  const baseA = PL.y + 380; // the higher plains (26 km above them, #18)... see below
  // Two base conventions: 26 km above the surrounding plains (#18, the lower reference), 22 km of relief on MOLA (#19).
  const baseLow = baseA + 26 * kmH - 22 * kmH; // the lower plain is 4 km under the higher reference level
  const summitY = baseA - 22 * kmH;
  const prof = domePts(cx, baseA, 585 * 1.1 /* #18 585 km wide, 1.1 px/km */, 22 * kmH, 1.6, 48, 0.08);
  const dx = (1 - slide) * 1500;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5}>
        <StudioRoom f={f} floor={floor} />
        <Layer depth={1}>
          <DonePlates n={1} t={slide} />
          <g transform={`translate(${dx.toFixed(1)} 0)`}>
            <Plate {...PL}>
              {/* the plains at two levels: higher on the right (A), lower on the left (B) */}
              <path d={`M${PL.x + 20} ${baseLow} L${cx - 200} ${baseLow} L${cx - 120} ${baseA} L${PL.x + PL.w - 20} ${baseA} L${PL.x + PL.w - 20} ${PL.y + PL.h - 30} L${PL.x + 20} ${PL.y + PL.h - 30} Z`} fill={mixHex(MARS.far, S.light, 0.45)} />
              <Form d={ridgePath(prof, baseLow + 40, 6)} fill={MARS.mid} light={225} shadow={S.shadow} inset={26} shadowOpacity={0.45} rim={S.light} rimWidth={2} rimOpacity={0.8} bounce={MARS.bounce}>
                <Facets pts={prof} base={baseLow + 40} light={225} fill={S.shadow} opacity={0.28} />
              </Form>
              {/* base line A (right plains) and its bracket: 22 km */}
              <g opacity={1 - 0.6 * swap}>
                <line x1={cx - 60} y1={baseA} x2={PL.x + PL.w - 40} y2={baseA} stroke={S.text} strokeWidth={2} strokeDasharray="8 6" />
                <line x1={cx + 300} y1={baseA} x2={cx + 300} y2={summitY} stroke={L12_COLORS.amber} strokeWidth={4} />
                <line x1={cx + 290} y1={summitY} x2={cx + 310} y2={summitY} stroke={L12_COLORS.amber} strokeWidth={3} />
                <text x={cx + 316} y={(baseA + summitY) / 2 + 10} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 30, fill: S.text }}>
                  22 km
                </text>
              </g>
              {/* base line B (left, lower plains) and its bracket: 26 km */}
              <g opacity={0.4 + 0.6 * swap}>
                <line x1={PL.x + 40} y1={baseLow} x2={cx + 60} y2={baseLow} stroke={S.text} strokeWidth={2} strokeDasharray="8 6" />
                <line x1={cx - 300} y1={baseLow} x2={cx - 300} y2={summitY} stroke={L12_COLORS.amber} strokeWidth={4} />
                <line x1={cx - 310} y1={summitY} x2={cx - 290} y2={summitY} stroke={L12_COLORS.amber} strokeWidth={3} />
                <text x={cx - 316} y={(baseLow + summitY) / 2 + 10} textAnchor="end" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 30, fill: S.text }}>
                  26 km
                </text>
              </g>
              <line x1={cx - 300} y1={summitY} x2={cx + 300} y2={summitY} stroke={S.text} strokeWidth={1.2} strokeDasharray="3 6" opacity={0.6} />
              <text x={PL.x + PL.w - 30} y={PL.y + PL.h - 16} textAnchor="end" style={{ fontFamily: "'Anton', sans-serif", fontSize: 15, letterSpacing: 2.5, fill: S.dim }}>
                VERTICAL × 6 · OLYMPUS MONS
              </text>
            </Plate>
          </g>
          <GroundShadow x={1430} y={floor - 1} rx={110} color={S.shadow} opacity={0.4} blur={8} />
          <Tick x={1440} y={floor} pxPerM={230} frame={f} facing={-1} pose="sit" expression={swap > 0.5 ? "thinking" : "neutral"} look={0.4} seed={8} outline={S.shadow} headTilt={6 * swap} />
        </Layer>
        <Layer depth={0}>
          <g opacity={slide}>
            <Metric x={1180} y={236} value={swap > 0.5 ? "26" : "22"} unit="km" size={72} color={S.text} />
            <text x={1180} y={286} style={{ fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 500, fontSize: 24, fill: S.dim }}>
              or {swap > 0.5 ? "22" : "26"}, by the base you choose
            </text>
            <Pill x={1180} y={340} text="DEPENDS ON THE BASE" fill={pillFill(S)} color={S.light} dot={L12_COLORS.amber} size={18} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

/** 8-13: plate 3, the summit close: 8,848.86 m is the snow height; the rock surface under it carries a "?" (#1). */
const ShotPlate3: ShotFC<CL08> = ({ f, len, c }) => {
  const slide = smooth(f, 0, 26);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 10, x: 980, y: 540, zoom: 1.07 },
  ]);
  const floor = 900;
  const cx = PL.x + PL.w / 2;
  const base = PL.y + PL.h - 20;
  const h = 400;
  const pts = hornPts(cx, base, 820, h);
  const snowTop = base - h;
  const rockTop = snowTop + 34; // not a measurement: the rock height has not been announced (#1)
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
              <Form d={ridgePath(pts, base + 40, 8)} fill={DUSK.mid} light={225} shadow={S.shadow} inset={30} shadowOpacity={0.5} rim={S.light} rimWidth={3} rimOpacity={0.9} bounce={DUSK.bounce}>
                <Facets pts={pts} base={base + 40} light={225} fill={S.shadow} opacity={0.4} />
                <Facets pts={pts} base={base + 40} light={225} fill={mixHex(DUSK.mid, S.light, 0.5)} opacity={0.35} lit />
                {/* the snow cap: everything above the rock line; the rock surface is drawn as a dashed hint under it */}
                <path d={roundPoly([...pts.filter((p) => p[1] <= rockTop + 120), ...pts.filter((p) => p[1] <= rockTop + 120).slice().reverse().map(([px], i): Pt => [px, Math.max(rockTop + 100 + Math.sin(i * 1.4) * 10, hornY(pts, px))])], 8)} fill={L12_COLORS.snow} />
                <path d={`M${cx - 60} ${rockTop + 26} Q${cx - 20} ${rockTop + 4} ${cx} ${rockTop} Q${cx + 26} ${rockTop + 6} ${cx + 64} ${rockTop + 30}`} fill="none" stroke={mixHex(DUSK.mid, S.shadow, 0.2)} strokeWidth={2.5} strokeDasharray="6 5" opacity={0.85} />
              </Form>
              {snow.map((p, i) => (
                <circle key={i} cx={PL.x + p.x} cy={PL.y + p.y} r={p.r * 0.7} fill="#FFFFFF" opacity={0.55} />
              ))}
              {/* the official tick on the snow surface */}
              <line x1={cx - 180} y1={snowTop} x2={cx + 180} y2={snowTop} stroke={S.text} strokeWidth={2} strokeDasharray="8 6" />
              <path d={`M${cx - 196} ${snowTop - 10} L${cx - 182} ${snowTop} L${cx - 196} ${snowTop + 10} Z`} fill={P.vermilion} />
              <text x={cx - 206} y={snowTop + 9} textAnchor="end" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 26, fill: S.text, fontVariantNumeric: "tabular-nums" }}>
                8,848.86 m
              </text>
              <text x={cx - 206} y={snowTop + 34} textAnchor="end" style={{ fontFamily: "'Anton', sans-serif", fontSize: 14, letterSpacing: 2.5, fill: S.dim }}>
                SNOW SURFACE
              </text>
              <g opacity={tagT} transform={`translate(0 ${((1 - tagT) * 10).toFixed(1)})`}>
                <line x1={cx + 70} y1={rockTop + 32} x2={cx + 150} y2={rockTop + 70} stroke={S.text} strokeWidth={1.6} />
                <UnknownTag x={cx + 170} y={rockTop + 78} size={24} />
                <text x={cx + 206} y={rockTop + 86} style={{ fontFamily: "'Anton', sans-serif", fontSize: 14, letterSpacing: 2.5, fill: S.dim }}>
                  ROCK SURFACE
                </text>
              </g>
            </Plate>
          </g>
          <GroundShadow x={1430} y={floor - 1} rx={110} color={S.shadow} opacity={0.4} blur={8} />
          <Tick x={1440} y={floor} pxPerM={230} frame={f} facing={-1} pose="sit" expression="neutral" look={0.5} seed={8} outline={S.shadow} />
        </Layer>
        <Layer depth={0}>
          <g opacity={slide}>
            <Pill x={1180} y={236} text="ROCK HEIGHT · NOT ANNOUNCED" fill={pillFill(S)} color={S.light} dot={P.vermilion} size={18} />
          </g>
          <L12Gauge family={S} value={HEIGHTS.everest /* #1 */} readout="8,848.86 m" opacity={0.95} />
        </Layer>
      </Stage>
    </Pop>
  );
};

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
  const P4 = { x: 150, y: 330, w: 560, h: 400 };
  const dx = (1 - slide) * 1500;
  const riv = "M190 480 C 300 440, 420 470, 520 436 C 560 424, 600 430, 606 470 C 612 520, 560 560, 540 610 C 526 650, 560 690, 600 700";
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5} overlay={bb0 < len ? <BlackBeat t={Math.max(0, (f - bb0) / 16) * 0.5} /> : null}>
        <StudioRoom f={f} floor={floor} />
        <Layer depth={1}>
          <DonePlates n={3} t={slide} />
          <g transform={`translate(${dx.toFixed(1)} 0)`}>
            <Plate {...P4}>
              {/* schematic relief: three ridge bands, the summit dot, the Arun turning south through the range (F8) */}
              <path d={ridgePath([[170, 600], [260, 540], [340, 585], [420, 520], [500, 570], [600, 530], [700, 580]], 730, 20)} fill={mixHex(S.far, S.mid, 0.4)} />
              <path d={ridgePath([[170, 640], [250, 590], [330, 630], [410, 560], [470, 612], [560, 575], [640, 620], [700, 600]], 730, 16)} fill={S.mid} />
              <path d={riv} fill="none" stroke={L12_COLORS.seaGlass} strokeWidth={7} strokeLinecap="round" opacity={0.9} />
              <path d={riv} fill="none" stroke={L12_COLORS.ice} strokeWidth={2.5} strokeDasharray="10 14" strokeDashoffset={crawl(f, 1.2)} strokeLinecap="round" opacity={0.9} />
              <circle cx={410} cy={560} r={7 + Math.sin(f / 9) * 1.5} fill={P.vermilion} />
              <text x={P4.x + P4.w - 26} y={P4.y + P4.h - 16} textAnchor="end" style={{ fontFamily: "'Anton', sans-serif", fontSize: 14, letterSpacing: 2.5, fill: S.dim }}>
                SCHEMATIC
              </text>
            </Plate>
          </g>
          <GroundShadow x={1430} y={floor - 1} rx={110 - 30 * stand} color={S.shadow} opacity={0.4} blur={8} />
          <Tick x={1440} y={floor} pxPerM={230} frame={f} facing={-1} pose="sit" poseTo="stand" poseT={stand * 1.6} expression="neutral" look={0.5} seed={8} outline={S.shadow} headTilt={nod} staff={stand > 0.6} />
        </Layer>
        <Layer depth={0}>
          <g opacity={slide}>
            <Pill x={860} y={420} text="ONE STUDY'S MODEL" fill={pillFill(S)} color={S.light} dot={L12_COLORS.seaGlass} size={18} />
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

const ShotReplay: ShotFC<CL08> = ({ f, len }) => {
  const hero = STEPS.reduce((h, s, i) => (f >= s ? i : h), 0);
  const t = Math.min(1, (f - STEPS[hero]) / 46);
  const cam = cameraAt(f, [
    { f: 0, x: 990, y: 560, zoom: 1.08 },
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
  const opts = { hero: [1180, 640] as [number, number], rail: [230, 952] as [number, number], railGap: 200, railScale: 0.15 };
  const draw = (i: number) => {
    const st = lineupState(i, hero, t, opts);
    if (st.opacity <= 0) return null;
    const s = st.s;
    const inner = (() => {
      switch (i) {
        case 0:
          return <EverestSil x={0} base={0} w={560} h={420} family={F} dot frame={f} />;
        case 1: {
          const pts = domePts(0, 0, 1180, 330, 2.2, 36, 0.05);
          const sea = -330 + (4205 / 10211) * 330; // the sea surface, 4,205 m below the summit (#13): the rest is under water
          return (
            <g>
              <Form d={ridgePath(pts, 30, 10)} fill={mixHex(L12_COLORS.slateDark, F.light, 0.1)} light={KEY} shadow={F.shadow} inset={40} shadowOpacity={0.6} rim={F.light} rimWidth={3} rimOpacity={0.9} bounce={FILL_PETROL} bounceOpacity={0.4}>
                <Facets pts={pts} base={30} light={KEY} fill={F.shadow} opacity={0.35} />
                <rect x={-700} y={sea} width={1400} height={400} fill={PETROL.sky[1]} opacity={0.55} />
                <path d={Array.from({ length: 36 }, (_, k) => `${k === 0 ? "M" : "L"}${-700 + k * 40} ${(sea + Math.sin(k * 0.9 + f / 12) * 4).toFixed(1)}`).join(" ")} fill="none" stroke={PETROL.light} strokeWidth={3} opacity={0.8} />
              </Form>
              <line x1={-640} y1={0} x2={640} y2={0} stroke={F.dim} strokeWidth={2} opacity={0.7} />
            </g>
          );
        }
        case 2: {
          const pts = domePts(0, 0, 1320, 118, 1.5, 48, 0.1);
          return (
            <Form d={ridgePath(pts, 24, 8)} fill={MARS.mid} light={KEY} shadow={F.shadow} inset={30} shadowOpacity={0.55} rim={F.light} rimWidth={3} rimOpacity={0.9} bounce={MARS.bounce}>
              <Facets pts={pts} base={24} light={KEY} fill={F.shadow} opacity={0.32} />
            </Form>
          );
        }
        case 3: {
          const pts = domePts(0, 0, 820, 236, 1.8, 36);
          return (
            <Form d={ridgePath(pts, 24, 8)} fill={TAUPE} light={KEY} shadow={F.shadow} inset={36} shadowOpacity={0.6} rim={F.light} rimWidth={3} rimOpacity={0.9} bounce={FILL_PETROL} bounceOpacity={0.45}>
              <Facets pts={pts} base={24} light={KEY} fill={F.shadow} opacity={0.35} />
            </Form>
          );
        }
        default:
          return <EarthDisc cx={0} cy={-330} r={300} frame={f} ring={ring} />;
      }
    })();
    return (
      <g key={i} opacity={st.opacity}>
        <g transform={`translate(${st.x.toFixed(1)} ${st.y.toFixed(1)}) scale(${s.toFixed(4)})`}>{inner}</g>
        {st.onRail ? (
          <g>
            <circle cx={st.x} cy={st.y + 30} r={4} fill={F.text} />
            {st.railIndex === hero - 1 ? <Pill x={st.x} y={st.y + 64} text={RAIL_NAMES[st.railIndex]} fill={alpha(F.shadow, 0.6)} color={F.text} size={14} align="middle" /> : null}
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
        {/* the rail */}
        <line x1={150} y1={982} x2={150 + 3 * 200 + 80} y2={982} stroke={F.dim} strokeWidth={1.5} opacity={0.6 * smooth(f, STEPS[1], STEPS[1] + 40)} />
        {ITEMS.map((_, i) => draw(i))}
        {hero < 4 ? (
          <g opacity={labelT}>
            <Pill x={heroSt.x} y={heroSt.y + 70} text={ITEMS[hero].label} fill={pillFill(F)} color={F.text} dot={hero === 0 ? P.vermilion : F.second} size={17} align="middle" />
          </g>
        ) : (
          <g opacity={ring}>
            <Pill x={heroSt.x + 330} y={heroSt.y - 330} text={ITEMS[4].label} fill={pillFill(F)} color={F.text} dot={F.second} size={17} />
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
          marks={ring > 0.5 ? [{ v: HEIGHTS.earthRadius, label: "RADIUS" }] : []}
          opacity={1 - 0.3 * earthT}
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
