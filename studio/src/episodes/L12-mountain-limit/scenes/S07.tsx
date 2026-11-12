// L12 scene l07 "Other worlds" (storyboard §3 "7 · Other worlds": shots 7-01…7-19, key art III = 7-07 Olympus Mons
// under the ochre sky; script lines 49-58 = scene lines 0-9; families studio / void / Mars / ember / Venus; Act III).
// Package III builder, 2026-11-07. Every number drawn here carries its sources.md row in a comment next to the
// literal (validate while building). Shared pieces used: L12Gauge (HEIGHTS), SlateBlock, kit Tick / Dial / TimeStrip
// / Inset / Counter. Scene bodies are bespoke (hard rule 1). The Olympus profile, the planet discs and the Vesta potato
// are exported for the closer / scene 8 builders if they want the same silhouettes (import from "./S07").
//
// Vertical exaggeration: the Olympus Mons profile (7-07 … 7-11) is drawn at ×3 vertically (true slopes are 2-5°,
// #18, so a true-scale profile is a 1:25 sliver); every profile shot carries the kicker "— PROFILE · VERTICAL SCALE X3".
// Olympus Mons' height is always a RANGE or a stated base (art-director note): the gauge reads the band 22-26 km (#18
// #19) and the base pill "ABOVE THE PLAINS"; the Mars and Venus skies are the L12 MARS / VENUS families (ochre on
// butterscotch; dim amber haze), never a red disc on indigo or a yellow ball.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Bloom,
  ChapterCard,
  Counter,
  Dial,
  Embers,
  Emissive,
  Facets,
  Family,
  Form,
  GroundShadow,
  HazeBand,
  Headline,
  Inset,
  Kicker,
  Layer,
  Leader,
  LightWash,
  Metric,
  Motes,
  P,
  Pill,
  Pt,
  Puffs,
  Sky,
  Stage,
  Stars,
  Tick,
  TimeStrip,
  alpha,
  blobPts,
  cameraAt,
  circlePath,
  cutPop,
  flicker,
  hazed,
  impact,
  lane,
  mixHex,
  pulse,
  ramp,
  ridgePath,
  rnd,
  roundPoly,
  rrect,
  smoothPath,
  walkPhase,
  walkSpeed,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { L12_COLORS, MARS, VENUS, familyOf, pillFill } from "../families";
import { cueKit } from "../cues";
import { HEIGHTS, L12Gauge } from "../L12Gauge";
import { SlateBlock } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";

const STUDIO = familyOf("studio");
const VOID = familyOf("void");
const EMBER = familyOf("ember");
const TAU = Math.PI * 2;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number, a = 0, b = 1) => {
  const u = clamp01((t - a) / (b - a));
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type Cam = { x: number; y: number; zoom: number };
/** the hard cut's pop (1.035 → 1 over 9 frames) folded into the shot's camera */
const pop = (f: number, cam: Cam): Cam => ({ ...cam, zoom: cam.zoom * cutPop(f, 0) });
/** Camera key that centres world point (tx, ty) of a depth-0.6 layer on screen at an effective scale `eff`. */
const onLayer = (f: number, tx: number, ty: number, eff: number) => ({ f, x: 960 + (tx - 960) / 0.6, y: 540 + (ty - 540) / 0.6, zoom: Math.pow(eff, 1 / 0.6) });

// ---------------------------------------------------------------------------------------------------------------
// L12 ambient movers (polish pass b, 2026-11-11). The craft probe (0.5-s steps at 96×54) only sees motion that moves
// sizeable, contrasty EDGES: a drift over flat fields or 2-px motes reads as frozen. These three draw defined-edge
// masses that cross the frame at ~1.5-4 px per frame on screen. Shared by cold / l06 / l07 (import from "./S07");
// bodies stay bespoke per shot. They carry no numbers and claim nothing.

export { CloudRack, Streamers, Caustics } from "../../../lib/illustrated";
import { CloudRack } from "../../../lib/illustrated";

// ---------------------------------------------------------------------------------------------------------------
// Cue table: every shot boundary and hit keyed to a phrase (never a timecode).

export const cuesL07 = (t: SceneTiming) => {
  const { at, p, frac, end } = cueKit(t);
  return {
    pad: 0, // 7-01 the bottom block on a scale pad; "weight = mass × gravity"
    balls: p(0, "Same rock"), // 7-02 three balls, Tick walks across Earth's
    hop: at(1), // 7-03 Tick hops onto Mars (continuous with 7-02)
    pairs: p(1, "If you weigh"), // 7-04 mini column + dough pairs
    marsDisc: at(2), // 7-05 the Mars disc, 0.38 g
    predict: p(2, "divide by that"), // 7-06 the ceiling stretches to ~23 km (same shot)
    olympus: at(3), // 7-07 KEY ART: the pan along Olympus Mons (frame 20 % in = l12-key-3)
    fits: p(3, "rises between"), // 7-08 Everest inside a corner of the flank; the gauge reads the band
    stack: p(3, "Two and a half"), // 7-09 2.5-3 Everests stacked
    arizona: at(4), // 7-10 the Arizona outline under the base
    level: p(4, "Stand on it"), // 7-11 Tick large with the spirit level
    cutaway: at(5), // 7-12 Mars cut open: heat glyph, a crust that does not move
    sheets: at(6), // 7-13 lava sheets stack, the strip blurs past (same shot, tilt up)
    pads: p(6, "And the whole pile"), // 7-14 two scale pads, ×0.38
    venusDisc: at(7), // 7-15 Venus beside Earth
    venusPredict: p(7, "The rule says"), // 7-16 the ceiling to just under 10 km (same shot)
    maxwell: at(8), // 7-17 Venus haze, Maxwell Montes, ~11 km
    close: p(8, "Close enough"), // 7-18 predicted vs actual bracket (same shot)
    vesta: at(9), // 7-19 the potato
    last: end(9),
    end: t.frames,
  };
};
export type CL07 = ReturnType<typeof cuesL07>;

// ---------------------------------------------------------------------------------------------------------------
// Pieces shared by this package's shots (bespoke to L12; exported for scene 8 / the closer if useful)

/** Planet discs at ONE diameter scale (flag F10): radii from NASA fact sheets #8 #17 #21, Vesta #23. px per km here. */
export const DISC_KM = { earth: 12742 /* #8 */, venus: 12104 /* #21 */, mars: 6779 /* #17 */, vesta: 525 /* #23 (mean) */ } as const;
export type World = keyof typeof DISC_KM;

/** A lit planet disc: family-coloured body, a terminator (shadow side toward `light`+180), rim light, a few surface
 *  marks per world (none is a map: abstract blobs / bands), and a slow terminator breathe. */
export const Disc: React.FC<{ x: number; y: number; r: number; world: World; f: number; light?: number; bg: Family; opacity?: number }> = ({ x, y, r, world, f, light = 200, bg, opacity = 1 }) => {
  const d = circlePath(x, y, r);
  const body = world === "earth" ? "#1E7F86" : world === "mars" ? "#B8622C" : world === "venus" ? "#D9A64A" : "#8C8A7E";
  const litC = world === "earth" ? "#5FC2B4" : world === "mars" ? "#E8A060" : world === "venus" ? "#FFE1A0" : "#C9C4B4";
  const marks = world === "earth" ? ["#5FAE9A", "#7FC9A8"] : world === "mars" ? ["#7E3D1C", "#D9944A"] : ["#B9782A", "#EDC27C"];
  const breathe = 1 + 0.02 * Math.sin(f / 70 + r);
  const a = ((light + 180) * Math.PI) / 180;
  // terminator: an ellipse of shadow whose centre sits toward the dark side
  const tx = x + Math.cos(a) * r * 0.55 * breathe;
  const ty = y + Math.sin(a) * r * 0.55 * breathe;
  return (
    <g opacity={opacity}>
      <Bloom x={x} y={y} r={r * 1.7} color={litC} strength={0.28} spread={0.5} />
      <Form d={d} fill={body} light={light} shadow={bg.shadow} inset={r * 0.32} shadowOpacity={0.55} rim={litC} rimWidth={Math.max(2, r * 0.03)} rimOpacity={0.9} bounce={bg.bounce} bounceOpacity={0.25}>
        {world === "earth" ? (
          <g fill={marks[0]} opacity={0.9}>
            <path d={roundPoly(blobPts(x - r * 0.25, y - r * 0.2, r * 0.36, 9, 3, 0.3, 1.3), r * 0.1)} />
            <path d={roundPoly(blobPts(x + r * 0.35, y + r * 0.3, r * 0.26, 8, 5, 0.3, 1.1), r * 0.08)} fill={marks[1]} />
            <ellipse cx={x} cy={y - r * 0.9} rx={r * 0.4} ry={r * 0.12} fill="#F4F2EA" opacity={0.85} />
            <ellipse cx={x + r * 0.1} cy={y + r * 0.92} rx={r * 0.35} ry={r * 0.1} fill="#F4F2EA" opacity={0.8} />
          </g>
        ) : world === "mars" ? (
          <g>
            <path d={roundPoly(blobPts(x + r * 0.15, y + r * 0.1, r * 0.42, 9, 7, 0.35, 0.7), r * 0.1)} fill={marks[0]} opacity={0.55} />
            <path d={roundPoly(blobPts(x - r * 0.4, y - r * 0.35, r * 0.2, 7, 9, 0.3, 1), r * 0.06)} fill={marks[1]} opacity={0.5} />
            <ellipse cx={x} cy={y - r * 0.92} rx={r * 0.22} ry={r * 0.08} fill="#F4F2EA" opacity={0.8} />
          </g>
        ) : world === "venus" ? (
          <g fill="none" stroke={marks[0]} strokeWidth={r * 0.07} opacity={0.5} strokeLinecap="round">
            {[-0.5, -0.15, 0.25, 0.6].map((k, i) => (
              <path key={i} d={`M${x - r} ${y + r * k} Q${x - r * 0.3} ${y + r * (k - 0.12 + 0.05 * Math.sin(f / 90 + i))} ${x + r * 0.2} ${y + r * (k + 0.04)} T${x + r} ${y + r * (k - 0.08)}`} />
            ))}
          </g>
        ) : null}
        {/* terminator */}
        <circle cx={x + (tx - x) * 1.9} cy={y + (ty - y) * 1.9} r={r * 1.3} fill={bg.shadow} opacity={0.62} filter={`url(#soft-${r > 150 ? 32 : r > 60 ? 16 : 8})`} />
      </Form>
    </g>
  );
};

/** Olympus Mons in profile (7-07 … 7-11; the closer / 8-12 may reuse): 585 km wide (#18) at 6300 px → 10.77 px/km;
 *  height drawn at the middle of the 22-26 km band (#18 #19) with ×3 VERTICAL EXAGGERATION (kicker on every shot).
 *  A basal escarpment and a summit caldera are schematic (no number is claimed for either). */
export const OLY = { x0: -1200, x1: 5100, base: 800, heightKm: 24 /* middle of 22-26, #18 #19 */, vx: 3, pxPerKm: 6300 / 585 /* #18 */ } as const;
const OLY_R = (OLY.x1 - OLY.x0) / 2;
const OLY_XC = (OLY.x0 + OLY.x1) / 2;
const OLY_H = OLY.heightKm * OLY.vx * OLY.pxPerKm; // ≈ 775 px
const OLY_SCARP = 2.5 * OLY.vx * OLY.pxPerKm; // schematic basal cliff ≈ 80 px
/** y of the shield's skyline at world x (plain = OLY.base) */
export const olympusY = (x: number) => {
  const d = Math.abs(x - OLY_XC) / OLY_R;
  if (d >= 1) return OLY.base;
  let h = OLY_SCARP + (OLY_H - OLY_SCARP) * (1 - Math.pow(d, 1.25));
  const cal = 430;
  const dc = Math.abs(x - OLY_XC);
  if (dc < cal) h -= 84 * (1 - Math.pow(dc / cal, 4));
  return OLY.base - h;
};
export const olympusPts = (): Pt[] => {
  const pts: Pt[] = [[OLY.x0 - 400, OLY.base], [OLY.x0, OLY.base], [OLY.x0 + 40, OLY.base - OLY_SCARP]];
  for (let x = OLY.x0 + 180; x <= OLY.x1 - 180; x += 140) pts.push([x, olympusY(x) + (rnd(x) - 0.5) * 12]);
  pts.push([OLY.x1 - 40, OLY.base - OLY_SCARP], [OLY.x1, OLY.base], [OLY.x1 + 400, OLY.base]);
  return pts;
};
const OLY_PTS = olympusPts();

/** The shield + the plain it stands on, lit by the low sun on the left (light ≈ 172°), with lava-flow tongues, a long
 *  dust-pink cast shadow on the right and a sun wash on the left plain. Put it on one Layer (depth 0.6). */
export const OlympusProfile: React.FC<{ f: number; light?: number; F?: Family }> = ({ f, light = 172, F = MARS }) => {
  const d = ridgePath(OLY_PTS, OLY.base + 900, 16);
  const plain = mixHex(F.mid, F.shadow, 0.28);
  // lava-flow tongues: a few lighter lobes running from high on the flank down toward the foot (clipped by the Form)
  const tongues = [-2600, -1900, -1200, -500, 300, 1100, 1800, 2500].map((x0, i) => {
    const top = olympusY(x0) + 20;
    const len = 700 + rnd(i * 3 + 1) * 900;
    const w = 90 + rnd(i * 7 + 2) * 80;
    const dir = x0 < 0 ? -1 : 1;
    const pts: Pt[] = [
      [x0, top],
      [x0 + dir * len * 0.4, olympusY(x0 + dir * len * 0.4) + 30 + w * 0.3],
      [x0 + dir * len, olympusY(x0 + dir * len) + 26 + w * 0.6],
      [x0 + dir * len - dir * 40, olympusY(x0 + dir * len) + 30 + w * 1.3],
      [x0 + dir * len * 0.45, olympusY(x0 + dir * len * 0.45) + 44 + w * 1.1],
      [x0 - dir * 30, top + w * 0.5],
    ];
    return roundPoly(pts, 30);
  });
  const dusk = mixHex(F.mid, F.light, 0.22);
  return (
    <g>
      {/* the plain, the sun wash on its left, the shield's long shadow to its right */}
      <rect x={-9000} y={OLY.base} width={24000} height={6000} fill={plain} />
      <LightWash x={OLY.x0 - 900} y={OLY.base + 160} rx={2600} ry={260} color={F.light} strength={0.28} />
      <path d={`M${OLY.x1 - 300} ${OLY.base} L${OLY.x1 + 4200} ${OLY.base + 20} L${OLY.x1 + 5200} ${OLY.base + 420} L${OLY.x1 - 200} ${OLY.base + 60} Z`} fill={F.shadow} opacity={0.22} />
      <Form d={d} fill={F.mid} light={light} shadow={F.shadow} inset={40} shadowOpacity={0.4} rim={F.light} rimWidth={4} rimOpacity={0.85} bounce={F.bounce} bounceOpacity={0.3}>
        {/* one plane per flank (STYLE-V2 round 5): a horizontal ramp from the sunlit west flank to the shaded east flank */}
        <defs>
          <linearGradient id="olyRamp" gradientUnits="userSpaceOnUse" x1={OLY.x0} y1={0} x2={OLY.x1} y2={0}>
            <stop offset={0} stopColor={mixHex(F.mid, F.light, 0.2)} />
            <stop offset={0.42} stopColor={mixHex(F.mid, "#8A3E1A", 0.45)} />
            <stop offset={0.56} stopColor={mixHex(F.mid, F.shadow, 0.5)} />
            <stop offset={1} stopColor={mixHex(F.mid, F.shadow, 0.7)} />
          </linearGradient>
        </defs>
        <rect x={OLY.x0 - 500} y={-400} width={7400} height={2400} fill="url(#olyRamp)" />
        {/* old flow terraces: the skyline repeated lower and flatter, so the dome reads as stacked flows */}
        <g fill="none" stroke={F.shadow} strokeLinecap="round" opacity={0.1} filter="url(#soft-4)">
          {[0.86, 0.7, 0.52, 0.34].map((q, i) => (
            <path key={i} d={smoothPath(OLY_PTS.slice(3, -3).filter((_, j) => j % 2 === 0).map(([x, y]): Pt => [x, OLY.base - (OLY.base - y) * q + 30]))} strokeWidth={26 - i * 4} />
          ))}
        </g>
        <g fill={mixHex(F.mid, F.light, 0.45)} opacity={0.16}>
          {tongues.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>
        {/* the caldera floor, a hair darker, and the dust haze creeping up the lower flank */}
        <ellipse cx={OLY_XC} cy={olympusY(OLY_XC) + 30} rx={400} ry={28} fill={F.shadow} opacity={0.28} />
        <HazeBand y={OLY.base - 220} h={230} color={F.haze} strength={0.3} x={-6000} w={16000} />
      </Form>
      {/* ground-contact grain: a few boulders along the foot */}
      {[-1500, -900, -300, 600, 1500, 2600, 3600, 4400, 5300].map((x, i) => (
        <ellipse key={i} cx={x + rnd(i) * 200} cy={OLY.base + 60 + rnd(i * 3) * 120} rx={22 + rnd(i * 5) * 30} ry={9 + rnd(i * 7) * 10} fill={mixHex(plain, F.shadow, 0.5)} opacity={0.8} />
      ))}
      <g opacity={0}>{f}</g>
    </g>
  );
};

/** A dust devil on the flank at world x: a tall, narrow, twisting translucent column that walks right at `speed`. */
const DustDevil: React.FC<{ f: number; x: number; h: number; speed?: number; seed?: number; F?: Family }> = ({ f, x, h, speed = 0.5, seed = 1, F = MARS }) => {
  const cx = x + f * speed;
  const base = olympusY(cx) - 2;
  const col = mixHex(F.haze, F.light, 0.4);
  const pts: Pt[] = [];
  const n = 9;
  for (let k = 0; k <= n; k++) {
    const u = k / n;
    const w = 10 + u * u * 62;
    const wob = Math.sin(f / 9 + u * 7 + seed) * (4 + u * 16);
    pts.push([cx + wob - w, base - u * h]);
  }
  for (let k = n; k >= 0; k--) {
    const u = k / n;
    const w = 10 + u * u * 62;
    const wob = Math.sin(f / 9 + u * 7 + seed) * (4 + u * 16);
    pts.push([cx + wob + w, base - u * h]);
  }
  return (
    <g>
      <path d={roundPoly(pts, 30)} fill={col} opacity={0.3} />
      <path d={roundPoly(pts.map(([px, py]) => [cx + (px - cx) * 0.45, py] as Pt), 20)} fill={col} opacity={0.3} />
      <ellipse cx={cx + Math.sin(f / 9 + 7 + seed) * 20} cy={base - h} rx={110} ry={38} fill={col} opacity={0.22} filter="url(#soft-16)" />
      <Puffs frame={f + seed * 40} x={cx} y={base} color={col} period={18} size={16} rise={0.2} drift={0.35} life={50} seed={seed} />
    </g>
  );
};

/** A weighing pad: a slab platform with a small dial on a post reading `value` of `max`; the thing weighed stands on it. */
const ScalePad: React.FC<{ x: number; y: number; w: number; value: number; max: number; F: Family; f: number; light?: number; title?: string; children?: React.ReactNode }> = ({ x, y, w, value, max, F, f, light = 225, title, children }) => {
  const h = 26;
  const top = rrect(x - w / 2, y - h, w, h, 8);
  return (
    <g>
      <GroundShadow x={x} y={y + 4} rx={w * 0.55} color={F.shadow} opacity={0.3} blur={8} />
      <Form d={top} fill={mixHex(L12_COLORS.slate, F.light, 0.1)} light={light} shadow={F.shadow} inset={8} rim={F.light} rimWidth={2} bounce={F.bounce} hard />
      <rect x={x - w / 2 + 10} y={y - h - 6} width={w - 20} height={8} rx={4} fill={mixHex(L12_COLORS.slateDark, F.shadow, 0.2)} />
      <rect x={x + w / 2 + 14} y={y - 150} width={8} height={150} fill={L12_COLORS.slateDark} />
      <Dial x={x + w / 2 + 18} y={y - 190} r={58} value={value} max={max} family={F} frame={f} ticks={4} format={() => ""} title={title} />
      {children}
    </g>
  );
};

/** Everest's silhouette at a vertical scale `pxPerKm` (height only, drawn narrow: its base width is not sourced, F11). */
const EverestSil: React.FC<{ x: number; base: number; pxPerKm: number; F: Family; ghost?: boolean; opacity?: number }> = ({ x, base, pxPerKm, F, ghost = false, opacity = 1 }) => {
  const h = HEIGHTS.everestRounded / 1000 * pxPerKm; // #1
  const w = h * 0.55;
  const pts: Pt[] = [[x - w / 2, base], [x - w * 0.22, base - h * 0.55], [x - w * 0.06, base - h * 0.86], [x, base - h], [x + w * 0.1, base - h * 0.8], [x + w * 0.3, base - h * 0.48], [x + w / 2, base]];
  const d = roundPoly(pts, 4);
  const cap: Pt[] = [[x - w * 0.14, base - h * 0.68], [x - w * 0.06, base - h * 0.86], [x, base - h], [x + w * 0.1, base - h * 0.8], [x + w * 0.16, base - h * 0.66], [x + w * 0.04, base - h * 0.7], [x - w * 0.05, base - h * 0.62]];
  return (
    <g opacity={opacity}>
      {ghost ? (
        <path d={d} fill="none" stroke={F.text} strokeWidth={2.5} strokeDasharray="8 6" />
      ) : (
        <Form d={d} fill={L12_COLORS.slate} light={172} shadow={F.shadow} inset={Math.max(4, h * 0.08)} rim={F.light} rimWidth={2} bounce={F.bounce} hard>
          <path d={roundPoly(cap, 3)} fill={L12_COLORS.snow} />
        </Form>
      )}
      <circle cx={x} cy={base - h - 6} r={5} fill={P.vermilion} />
    </g>
  );
};

/** Vesta, the potato (#23: 569 × 555 × 453 km): a blob Form with facets, a flattened south pole (the Rheasilvia basin,
 *  #25), craters, lit by the gold key with a petrol fill on the night side. `rot` tumbles it. */
export const Vesta: React.FC<{ x: number; y: number; r: number; f: number; rot?: number; light?: number; F?: Family; opacity?: number }> = ({ x, y, r, f, rot = 0, light = 200, F = VOID, opacity = 1 }) => {
  // 569 : 555 : 453 → drawn as an ellipse-ish blob squashed toward the pole (the view shows the 569 × 453 section)
  const pts = blobPts(0, 0, r, 14, 4, 0.1, 453 / 569 /* #23 */).map(([px, py], i): Pt => (i >= 4 && i <= 7 ? [px, py * 0.78 + r * 0.1] : [px, py]));
  const d = roundPoly(pts, r * 0.3);
  const body = "#9A9583";
  return (
    <g opacity={opacity} transform={`translate(${x} ${y}) rotate(${rot}) `}>
      <Bloom x={0} y={0} r={r * 1.9} color={F.light} strength={0.2} spread={0.5} />
      <Form d={d} fill={body} light={light} shadow={F.shadow} inset={r * 0.3} shadowOpacity={0.6} rim={F.light} rimWidth={Math.max(2, r * 0.03)} rimOpacity={0.9} bounce={F.bounce} bounceOpacity={0.45}>
        <Facets pts={pts.slice(0, 8)} base={r * 1.5} light={light} fill={F.shadow} opacity={0.2} depth={r * 0.5} />
        {[[-0.3, -0.35, 0.16], [0.3, -0.1, 0.11], [-0.05, 0.25, 0.09], [0.45, 0.35, 0.07], [-0.5, 0.2, 0.08]].map(([cx, cy, cr], i) => (
          <g key={i}>
            <ellipse cx={cx * r} cy={cy * r} rx={cr * r} ry={cr * r * 0.8} fill={mixHex(body, F.shadow, 0.5)} opacity={0.6} />
            <ellipse cx={cx * r - cr * r * 0.2} cy={cy * r - cr * r * 0.25} rx={cr * r * 0.75} ry={cr * r * 0.55} fill={mixHex(body, F.light, 0.25)} opacity={0.5} />
          </g>
        ))}
        {/* the south-polar basin: a broad shallow bowl with a central peak nub */}
        <ellipse cx={0} cy={r * 0.62} rx={r * 0.72} ry={r * 0.2} fill={mixHex(body, F.shadow, 0.35)} opacity={0.55} />
        <ellipse cx={0} cy={r * 0.62} rx={r * 0.16} ry={r * 0.07} fill={mixHex(body, F.light, 0.3)} opacity={0.8} />
        {/* night-side fill: the petrol bounce so no frame is near-grey */}
        <ellipse cx={r * 0.9} cy={r * 0.5} rx={r * 0.8} ry={r} fill="#2A6E78" opacity={0.5} filter="url(#soft-32)" />
      </Form>
      <g opacity={0}>{f}</g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// HUD helpers

const StudioFloor: React.FC<{ y: number; F: Family }> = ({ y, F }) => (
  <g>
    <rect x={-1200} y={y} width={4400} height={900} fill={F.mid} />
    <HazeBand y={y - 140} h={140} color={F.haze} strength={0.6} x={-1200} w={4400} />
    <rect x={-1200} y={y} width={4400} height={6} fill={mixHex(F.mid, F.shadow, 0.35)} opacity={0.6} />
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// 7-01 · studio: the bottom block from scene 1 on a scale pad; a "g" arrow presses it; "weight = mass × gravity"

const ShotPad: ShotFC<CL07> = ({ f, len }) => {
  const F = STUDIO;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 980, y: 560, zoom: 1.0 }, { f: len + 20, x: 960, y: 540, zoom: 1.09 }]));
  const floor = 860;
  const press = 0.5 + 0.5 * Math.sin(f / 14); // the arrow pumps
  const sq = { sx: 1 + press * 0.025, sy: 1 - press * 0.03 };
  const w = 220;
  const show = sm(f, 6, 26);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.1} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Bloom x={420} y={120} r={700} color={F.light} strength={0.5} spread={0.4} />
      </Layer>
      <Layer depth={0.5} haze={{ color: F.haze, amount: 0.25 }}>
        <StudioFloor y={floor + 40} F={F} />
      </Layer>
      <Layer depth={1}>
        <StudioFloor y={floor} F={F} />
        <Motes frame={f} n={30} x={100} y={100} w={1700} h={760} color={F.light} seed={71} size={3.5} drift={30} />
        <ScalePad x={760} y={floor} w={360} value={62 + press * 6} max={100} F={F} f={f} title="WEIGHT">
          <g transform={`translate(760 ${floor - 26}) scale(${sq.sx} ${sq.sy}) translate(-760 ${-(floor - 26)})`}>
            <SlateBlock x={760 - w / 2} y={floor - 26} w={w} h={150} family={F} crack={0.35} />
          </g>
        </ScalePad>
        {/* the g arrow: a fat down-arrow pressing on the block top */}
        <g transform={`translate(0 ${(press * 10).toFixed(1)})`} opacity={show}>
          <path d={`M${760 - 36} ${floor - 390} h72 v110 h46 l-82 96 l-82 -96 h46 Z`} fill={P.vermilion} stroke={F.shadow} strokeWidth={2} strokeLinejoin="round" />
          <text x={760} y={floor - 318} textAnchor="middle" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 54, fill: P.bone, fontStyle: "italic" }}>
            g
          </text>
        </g>
      </Layer>
      <Layer depth={1.25}>
        <ellipse cx={-40} cy={1120} rx={520} ry={150} fill={F.near} opacity={0.9} />
        <ellipse cx={1500} cy={1160} rx={700} ry={170} fill={F.near} opacity={0.85} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 10, 34)} transform={`translate(0 ${((1 - sm(f, 10, 34)) * 20).toFixed(1)})`}>
          <Headline x={120} y={230} lines={["weight = mass × gravity"]} size={66} color={F.text} accent={P.vermilion} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} ceiling={{ v: 9000 /* #9 ~9 km */ }} base="ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 7-02 / 7-03 · three balls at one diameter scale; Tick walks across Earth's with the block, then hops onto Mars

const BALL_PX_PER_KM = 190 / DISC_KM.earth; // Earth = 190 px radius
const BALLS = {
  venus: { x: 250, r: DISC_KM.venus * BALL_PX_PER_KM },
  earth: { x: 760, r: DISC_KM.earth * BALL_PX_PER_KM },
  mars: { x: 1330, r: DISC_KM.mars * BALL_PX_PER_KM },
} as const;
const FLOOR_B = 820;

const ShotBalls: ShotFC<CL07> = ({ f, len, c }) => {
  const F = STUDIO;
  const hopAt = c.hop - c.balls; // shot frame of the hop
  const hopDur = 44;
  const landAt = hopAt + hopDur;
  const cam = pop(
    f,
    cameraAt(f, [
      { f: 0, x: 820, y: 520, zoom: 1.0 },
      { f: hopAt, x: 940, y: 520, zoom: 1.06 },
      { f: landAt + 20, x: 1180, y: 560, zoom: 1.22 },
      { f: len + 20, x: 1200, y: 560, zoom: 1.3 },
    ]),
  );
  const ppm = 90;
  const E = BALLS.earth;
  const M = BALLS.mars;
  const ey = FLOOR_B - E.r;
  const my = FLOOR_B - M.r;
  // walk across Earth's top: angle along the rim at the walk speed
  const v = walkSpeed(ppm, 54);
  const a0 = -0.42;
  const angE = Math.min(0.5, a0 + (v * Math.min(f, hopAt)) / E.r);
  // the hop: from the rim point to Mars's top, a parabola that floats (slow landing on the lighter world)
  const k = clamp01((f - hopAt) / hopDur);
  const ke = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  const fromX = E.x + Math.sin(angE) * E.r;
  const fromY = ey - Math.cos(angE) * E.r;
  const toX = M.x - 6;
  const toY = my - M.r;
  const hx = lerp(fromX, toX, ke);
  const hy = lerp(fromY, toY, ke) - Math.sin(k * Math.PI) * 180;
  const onMars = f >= landAt;
  const marsWalk = onMars ? walkPhase(f - landAt, 84) : undefined;
  const angM = onMars ? Math.min(0.22, (walkSpeed(ppm, 84) * (f - landAt)) / M.r) : 0;
  const sq = onMars ? impact(f, landAt, 0.14, 14) : { sx: 1, sy: 1 };
  const expr = onMars ? "happy" : f > hopAt ? "surprised" : "determined";
  const metric = onMars ? { v: "3.73", r: "#17" } : { v: "9.82", r: "#8" };
  const block = (bx: number, by: number, s: number) => <SlateBlock x={bx - 20 * s} y={by} w={40 * s} h={30 * s} family={F} shadow={false} />;
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.1} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Bloom x={300} y={160} r={800} color={F.light} strength={0.5} spread={0.4} />
      </Layer>
      <Layer depth={0.5} haze={{ color: F.haze, amount: 0.3 }}>
        <StudioFloor y={FLOOR_B + 60} F={F} />
      </Layer>
      <Layer depth={1}>
        <StudioFloor y={FLOOR_B} F={F} />
        <Motes frame={f} n={34} x={0} y={60} w={1900} h={760} color={F.light} seed={72} size={3.4} drift={30} />
        {(["venus", "earth", "mars"] as World[]).map((w) => {
          const b = BALLS[w as "venus" | "earth" | "mars"];
          return (
            <g key={w}>
              <GroundShadow x={b.x + 14} y={FLOOR_B + 2} rx={b.r * 0.9} ry={b.r * 0.16} color={F.shadow} opacity={0.32} blur={16} />
              <Disc x={b.x} y={FLOOR_B - b.r} r={b.r} world={w} f={f} light={200} bg={F} />
              {/* contour rings: the "ball" read, not a map */}
              <g fill="none" stroke={F.light} strokeWidth={1.5} opacity={0.35}>
                {[0.35, 0.7].map((q) => (
                  <ellipse key={q} cx={b.x} cy={FLOOR_B - b.r} rx={b.r * q} ry={b.r * q * 0.98} />
                ))}
              </g>
            </g>
          );
        })}
        {/* Tick: on Earth's rim (rotated about its centre), in the air, or on Mars's rim */}
        {!onMars && f < hopAt ? (
          <g transform={`rotate(${((angE * 180) / Math.PI).toFixed(2)} ${E.x} ${ey})`}>
            <Tick x={E.x} y={ey - E.r} pxPerM={ppm} frame={f} pose="carry" expression="determined" walk={walkPhase(f, 54)} look={0.3} outline={F.shadow} />
            {block(E.x + 0.4 * ppm, ey - E.r - 0.95 * ppm, ppm / 100)}
          </g>
        ) : !onMars ? (
          <g>
            <Tick x={hx} y={hy} pxPerM={ppm} frame={f} pose="carry" expression="surprised" tilt={lerp(-10, 8, ke)} look={0.5} outline={F.shadow} />
            {block(hx + 0.4 * ppm, hy - 0.95 * ppm, ppm / 100)}
          </g>
        ) : (
          <g transform={`rotate(${((angM * 180) / Math.PI).toFixed(2)} ${M.x} ${my})`}>
            <Tick x={M.x} y={my - M.r} pxPerM={ppm} frame={f} pose="carry" expression={expr} walk={marsWalk} look={0.3} squash={sq} outline={F.shadow} />
            {block(M.x + 0.4 * ppm, my - M.r - 1.05 * ppm, ppm / 100)}
          </g>
        )}
      </Layer>
      <Layer depth={1.25}>
        <ellipse cx={-80} cy={1140} rx={560} ry={160} fill={F.near} opacity={0.9} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 8, 26)}>
          <Metric x={120} y={200} value={metric.v} unit="m/s²" size={72} color={F.text} />
          <Pill x={120} y={250} text={onMars ? "MARS · SURFACE GRAVITY" : "EARTH · SURFACE GRAVITY"} fill={pillFill(F)} color={F.light} dot={F.second} size={16} />
          <Pill x={120} y={296} text="BALLS · ONE DIAMETER SCALE" fill={pillFill(F)} color={F.light} size={16} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} ceiling={{ v: 9000 /* #9 */ }} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 7-04 · side by side on Mars: a mini column and a mini dough lump both stand taller than their Earth twins

const ShotPairs: ShotFC<CL07> = ({ f, len }) => {
  const F = STUDIO;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 960, y: 580, zoom: 1.0 }, { f: len + 20, x: 980, y: 560, zoom: 1.1 }]));
  const floor = 800;
  const ratio = 9.82 / 3.73; // #8 / #17 ≈ 2.63: the same rock stands that much taller before it crushes (#26's rule)
  const grow = sm(f, 10, 50);
  const hE = 150;
  const hM = hE * (1 + (ratio - 1) * grow);
  const doughE = { w: 230, h: 70 };
  const doughM = { w: 230 - 70 * grow, h: 70 + 110 * grow };
  const dough = (x: number, w: number, h: number, seed: number) => roundPoly(blobPts(x, floor - h / 2, w / 2, 12, seed, 0.06, h / w), 40);
  const pedestal = (x: number, label: World) => (
    <g>
      <GroundShadow x={x} y={floor + 4} rx={300} color={F.shadow} opacity={0.25} blur={16} />
      <Disc x={x - 330} y={floor - 60} r={44} world={label} f={f} light={200} bg={F} />
    </g>
  );
  const colE = 420;
  const colM = 1200;
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.1} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Bloom x={300} y={160} r={800} color={F.light} strength={0.5} spread={0.4} />
      </Layer>
      <Layer depth={0.5} haze={{ color: F.haze, amount: 0.3 }}>
        <StudioFloor y={floor + 60} F={F} />
      </Layer>
      <Layer depth={1}>
        <StudioFloor y={floor} F={F} />
        <Motes frame={f} n={30} x={0} y={60} w={1900} h={700} color={F.light} seed={73} size={3.4} drift={30} />
        {pedestal(colE + 120, "earth")}
        {pedestal(colM + 120, "mars")}
        {/* columns: Earth's at the limit (hairline cracks), Mars's taller and clean */}
        <SlateBlock x={colE - 50} y={floor} w={100} h={hE} family={F} crack={0.7} />
        <SlateBlock x={colM - 50} y={floor} w={100} h={hM} family={F} crack={0.05} />
        {/* dough lumps: Earth's slumped wide, Mars's standing tall */}
        <Form d={dough(colE + 300, doughE.w, doughE.h, 3)} fill="#E9D7B6" light={225} shadow={F.shadow} inset={16} rim={F.light} rimWidth={3} bounce={F.bounce} />
        <Form d={dough(colM + 300, doughM.w, doughM.h, 3)} fill="#E9D7B6" light={225} shadow={F.shadow} inset={16} rim={F.light} rimWidth={3} bounce={F.bounce} />
        {/* ghost of the Earth heights on the Mars side, so the "taller" reads */}
        <g stroke={F.dim} strokeWidth={2} strokeDasharray="7 6" opacity={0.55 * grow}>
          <line x1={colM - 70} y1={floor - hE} x2={colM + 70} y2={floor - hE} />
          <line x1={colM + 300 - 130} y1={floor - doughE.h} x2={colM + 300 + 130} y2={floor - doughE.h} />
        </g>
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 14, 34)}>
          <Pill x={colE - 50} y={floor - hE - 60 + 0} text="CRUSH" fill={pillFill(F)} color={F.light} dot={P.vermilion} size={18} />
          <Pill x={colE + 300 - 60} y={floor - doughE.h - 60} text="FLOW" fill={pillFill(F)} color={F.light} dot={F.second} size={18} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} ceiling={{ v: 9000 /* #9 */ }} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 7-05 / 7-06 · void: the Mars disc; the Earth ceiling line stretches from ~9 km to ~23 km, dashed, PREDICTED

const ShotMarsDisc: ShotFC<CL07> = ({ f, len, c }) => {
  const F = VOID;
  const t0 = c.predict - c.marsDisc;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 900, y: 540, zoom: 1.0 }, { f: len + 20, x: 960, y: 520, zoom: 1.12 }]));
  const stretch = sm(f, t0, t0 + 50);
  const ceil = lerp(9000 /* #9 */, HEIGHTS.predictedMars /* #26 */, stretch);
  const zoomT = sm(f, t0 - 6, t0 + 40);
  const r = 300;
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={110} w={1920} h={1080} color={F.text} seed={75} size={1.4} twinkle={0.7} />
        <Bloom x={-200} y={300} r={900} color={F.light} strength={0.3} spread={0.3} />
      </Layer>
      <Layer depth={0.3}>
        <Motes frame={f} n={26} x={0} y={0} w={1920} h={1080} color={mixHex(F.text, "#D9944A", 0.5)} seed={76} size={2.6} drift={24} glow={false} />
      </Layer>
      <Layer depth={1}>
        <Disc x={760} y={560} r={r} world="mars" f={f} light={200} bg={F} />
        <Motes frame={f} n={18} x={400} y={200} w={720} h={720} color="#E8A060" seed={77} size={2.2} drift={18} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 8, 26)}>
          {stretch < 0.5 ? (
            <Metric x={120} y={200} value="0.38" unit="g" size={84} color={F.text} />
          ) : (
            <Metric x={120} y={200} value="~23" unit="km" size={84} color={F.text} />
          )}
          <Pill x={120} y={256} text={stretch < 0.5 ? "MARS · SURFACE GRAVITY" : "PREDICTED · SIMPLE RULE"} fill={pillFill(F)} color={F.text} dot="#E8A060" size={16} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} max={10000} zoomTo={30000} zoomT={zoomT} ceiling={{ v: ceil, label: stretch > 0.95 ? "PREDICTED ~23 km" : undefined }} base="EVEREST · ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 7-07 · KEY ART · Mars daylight: the pan along Olympus Mons that does not end

const MarsSky: React.FC<{ f: number; sun: { x: number; y: number } | null; F?: Family }> = ({ f, sun, F = MARS }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={F} />
      {sun ? (
        <>
          {/* the Martian sun: smaller and paler than ours; a cool dust halo (the real blue-ish glow) kept faint so the sky stays ochre */}
          <Bloom x={sun.x} y={sun.y} r={760} color={F.light} strength={0.5} spread={0.26} squash={0.8} />
          <Bloom x={sun.x} y={sun.y} r={260} color="#DCE6E8" strength={0.22} spread={0.4} />
          <Bloom x={sun.x} y={sun.y} r={120} color="#FFF6E4" strength={pulse(f, 90, 0.06, 2)} spread={0.4} core={30} coreColor="#FFFBF0" />
        </>
      ) : null}
    </Layer>
    <Layer depth={0.12}>
      {/* drifting dust bands high in the sky */}
      {[0, 1, 2].map((i) => {
        const y = 300 + i * 120;
        const x = ((f * (0.35 + i * 0.12) + i * 700) % 3400) - 1700;
        return <ellipse key={i} cx={x} cy={y} rx={900 + i * 200} ry={14 + i * 6} fill={F.haze} opacity={0.22 - i * 0.04} />;
      })}
    </Layer>
  </>
);

const ShotOlympus: ShotFC<CL07> = ({ f, len }) => {
  const F = MARS;
  const L = Math.max(len, 80);
  // the shield lives on a depth-0.6 layer: `onLayer` centres a world point of it on screen at an effective scale
  const cam = pop(f, cameraAt(f, [onLayer(0, 260, 300, 0.7), onLayer(L + 30, 640, 270, 0.76)]));
  const pillIn = sm(f, 6, 22);
  const slide = -f * 0.7; // the foreground slides against the pan (screen-locked silhouettes with their own parallax)
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.22} grain={0.5}>
      <MarsSky f={f} sun={{ x: 300, y: 470 }} F={F} />
      <Layer depth={0.2} haze={{ color: F.haze, amount: 0.55 }}>
        {/* a far shield on the horizon behind the sun (schematic; Olympus has neighbours) and the dust horizon */}
        <path d={smoothPath([[-900, 760], [-300, 700], [200, 668], [700, 690], [1300, 752]]) + " L1300 1300 L-900 1300 Z"} fill={hazed(F, F.far, 0.2)} />
        <HazeBand y={520} h={300} color={F.haze} strength={0.75} />
      </Layer>
      <Layer depth={0.6}>
        <OlympusProfile f={f} light={172} F={F} />
        <DustDevil f={f} x={-760} h={330} speed={0.5} seed={1} F={F} />
        <DustDevil f={f} x={260} h={230} speed={0.35} seed={2} F={F} />
        <DustDevil f={f} x={-1700} h={260} speed={0.6} seed={5} F={F} />
        <Motes frame={f} n={50} x={-1800} y={-500} w={4200} h={1500} color={F.haze} seed={78} size={5.5} drift={44} />
        {/* low sun grazing the foot of the west flank */}
        <LightWash x={OLY.x0 + 300} y={OLY.base - 60} rx={1500} ry={300} color={F.light} strength={0.3} />
      </Layer>
      <Layer depth={0}>
        {/* foreground frame: wind-cut rocks, lit on their sunward (left) edges */}
        <g transform={`translate(${slide.toFixed(1)} 0)`}>
          <Form d={roundPoly([[-60, 1100], [-40, 900], [60, 820], [210, 800], [330, 860], [420, 960], [470, 1100]], 26)} fill={F.near} light={172} shadow={F.shadow} inset={26} rim={F.light} rimWidth={4} rimOpacity={0.9} bounce={F.bounce} />
          <Form d={roundPoly([[430, 1100], [470, 990], [570, 950], [680, 1000], [720, 1100]], 20)} fill={mixHex(F.near, F.second, 0.28)} light={172} shadow={F.shadow} inset={16} rim={F.light} rimWidth={3} bounce={F.bounce} />
          <Form d={roundPoly([[1180, 1100], [1230, 980], [1380, 930], [1560, 960], [1650, 1040], [1700, 1100]], 24)} fill={F.near} light={172} shadow={F.shadow} inset={22} rim={F.light} rimWidth={4} rimOpacity={0.9} bounce={F.bounce} />
          {/* long shadows thrown to the right by the low sun */}
          <path d="M420 1010 L1000 1040 L1000 1070 L470 1080 Z" fill={F.shadow} opacity={0.25} />
        </g>
        <g opacity={pillIn}>
          <Pill x={120} y={128} text="OLYMPUS MONS" fill={pillFill(F)} color={F.text} dot={F.light} size={26} />
          <Kicker x={120} y={186} text="— PROFILE · VERTICAL SCALE X3" color={F.dim} size={18} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} max={30000} ceiling={{ v: HEIGHTS.predictedMars /* #26 */, label: "PREDICTED ~23 km" }} base="EVEREST · ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 7-08 · the wide: Everest's silhouette inside a corner of the flank; the gauge runs off scale, zooms to 100 km, reads 22-26 km

const ShotFits: ShotFC<CL07> = ({ f, len }) => {
  const F = MARS;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 1200, y: 520, zoom: 0.5 }, { f: len + 20, x: 1500, y: 500, zoom: 0.46 }]));
  const sun = { x: -2400, y: 200 };
  const zoomT = sm(f, 16, 56);
  const value = lerp(HEIGHTS.everest, HEIGHTS.olympusLow / 2 + HEIGHTS.olympusHigh / 2 /* #18 #19 mid */, sm(f, 10, 60));
  const settled = f > 62;
  const silIn = sm(f, 4, 22);
  const pxPerKm = OLY.pxPerKm * OLY.vx;
  const everestX = OLY.x0 + 1000;
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.2} grain={0.5}>
      <MarsSky f={f} sun={sun} F={F} />
      <Layer depth={0.22} haze={{ color: F.haze, amount: 0.5 }}>
        <HazeBand y={560} h={260} color={F.haze} strength={0.7} />
      </Layer>
      <Layer depth={0.6} haze={{ color: F.haze, amount: 0.08 }}>
        <OlympusProfile f={f} light={172} F={F} />
        <DustDevil f={f} x={2400} h={360} speed={0.4} seed={3} F={F} />
        {/* pass b: dust banks rolling across the plain in front of the shield's foot */}
        <CloudRack f={f} n={6} x0={-2400} x1={6400} y0={760} y1={860} size={150} speed={3.4} body={mixHex(F.haze, F.light, 0.25)} under={mixHex(F.haze, F.shadow, 0.3)} opacity={0.7} seed={14} flat={1.4} />
        <Motes frame={f} n={40} x={-2000} y={-600} w={6000} h={1400} color={F.haze} seed={79} size={6} drift={40} />
        {/* Everest, height only, narrow, standing on the plain inside the lower corner of the flank (F11) */}
        <g opacity={silIn}>
          <EverestSil x={everestX} base={OLY.base} pxPerKm={pxPerKm} F={F} />
          <Leader from={[everestX, OLY.base - (HEIGHTS.everestRounded / 1000) * pxPerKm - 10]} to={[everestX + 260, OLY.base - 470]} color={F.text} />
          <Pill x={everestX + 270} y={OLY.base - 470} text="EVEREST · HEIGHT ONLY" fill={pillFill(F)} color={F.text} dot={P.vermilion} size={30} />
        </g>
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={1000} text="— PROFILE · VERTICAL SCALE X3" color={F.dim} size={18} />
        <g opacity={sm(f, 50, 66)}>
          <Pill x={120} y={128} text="OLYMPUS MONS · ABOVE THE PLAINS" fill={pillFill(F)} color={F.text} dot={F.light} size={22} />
          <Pill x={120} y={180} text="22 OR 26 km · DEPENDS ON THE BASE" fill={pillFill(F)} color={F.text} size={16} />
        </g>
        <L12Gauge
          family={F}
          value={value}
          max={30000}
          zoomTo={100000}
          zoomT={zoomT}
          ceiling={{ v: HEIGHTS.predictedMars /* #26 */ }}
          bands={settled ? [{ from: HEIGHTS.olympusLow /* #19 */, to: HEIGHTS.olympusHigh /* #18 */, color: F.light }] : []}
          readout={settled ? "22-26 km" : undefined}
          base={settled ? "ABOVE THE PLAINS" : undefined}
        />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 7-09 · 2.5-3 Everest silhouettes stacked beside the shield's height, the third half-ghosted

const ShotStack: ShotFC<CL07> = ({ f, len }) => {
  const F = MARS;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: OLY_XC - 700, y: 420, zoom: 0.72 }, { f: len + 20, x: OLY_XC - 600, y: 400, zoom: 0.78 }]));
  const pxPerKm = OLY.pxPerKm * OLY.vx;
  const eh = (HEIGHTS.everestRounded / 1000) * pxPerKm; // #1
  const sx = OLY_XC - 1500;
  const drop = (i: number) => {
    const at = 8 + i * 16;
    const k = sm(f, at, at + 12);
    return { y: (1 - k) * -300, o: k, sq: impact(f, at + 12, 0.1, 8) };
  };
  const summitY = olympusY(OLY_XC + 460);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.2} grain={0.5}>
      <MarsSky f={f} sun={{ x: -2200, y: 240 }} F={F} />
      <Layer depth={0.22} haze={{ color: F.haze, amount: 0.5 }}>
        <HazeBand y={560} h={260} color={F.haze} strength={0.7} />
      </Layer>
      <Layer depth={0.6} haze={{ color: F.haze, amount: 0.08 }}>
        <OlympusProfile f={f} light={172} F={F} />
        <Motes frame={f} n={36} x={-1500} y={-600} w={5000} h={1400} color={F.haze} seed={80} size={5} drift={40} />
        {/* the summit's height bracket, from the plain to the caldera rim */}
        <g stroke={F.text} strokeWidth={3} opacity={0.8}>
          <line x1={sx + 420} y1={OLY.base} x2={sx + 420} y2={summitY} strokeDasharray="12 10" />
          <line x1={sx + 380} y1={summitY} x2={OLY_XC + 460} y2={summitY} strokeDasharray="12 10" opacity={0.6} />
        </g>
        {[0, 1, 2].map((i) => {
          const d = drop(i);
          const base = OLY.base - i * eh;
          return (
            <g key={i} opacity={d.o} transform={`translate(0 ${d.y.toFixed(1)}) translate(${sx} ${base}) scale(${d.sq.sx} ${d.sq.sy}) translate(${-sx} ${-base})`}>
              <EverestSil x={sx} base={base} pxPerKm={pxPerKm} F={F} ghost={i === 2} opacity={i === 2 ? 0.7 : 1} />
            </g>
          );
        })}
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={1000} text="— PROFILE · VERTICAL SCALE X3" color={F.dim} size={20} />
        <L12Gauge family={F} value={HEIGHTS.olympusLow / 2 + HEIGHTS.olympusHigh / 2} max={100000} ceiling={{ v: HEIGHTS.predictedMars /* #26 */ }} bands={[{ from: HEIGHTS.olympusLow /* #19 */, to: HEIGHTS.olympusHigh /* #18 */, color: F.light }]} readout="22-26 km" base="ABOVE THE PLAINS" />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 7-10 · an Arizona outline (schematic, F5) laid on the plain under the shield's base and covered by it

/** Arizona, drawn by hand as a schematic (no public-domain vector imported; flag F5 → pill "SCHEMATIC"): straight
 *  north and east borders, the southern border west to the Gadsden diagonal, the Colorado River wiggle up the west. */
const ARIZONA: Pt[] = [
  [0.06, 0.0],
  [1.0, 0.0],
  [1.0, 1.0],
  [0.44, 1.0],
  [0.05, 0.74],
  [0.0, 0.6],
  [0.09, 0.47],
  [0.03, 0.33],
  [0.08, 0.18],
];

const ShotArizona: ShotFC<CL07> = ({ f, len }) => {
  const F = MARS;
  const cam = pop(f, cameraAt(f, [onLayer(0, OLY_XC, 700, 0.24), onLayer(len + 20, OLY_XC + 80, 690, 0.262)]));
  // the outline lies flat on the plain in front of the shield: the base's width (585 km, #18) is "wider than Arizona"
  // (#18) and its area "as large as Arizona" (#20); drawn in perspective (squashed), dropped in from above
  const W = OLY.x1 - OLY.x0;
  const H = W * 0.2;
  const k = sm(f, 6, 26);
  const land = impact(f, 26, 0.05, 10);
  const cy = OLY.base + 520;
  const az = ARIZONA.map(([u, v]): Pt => [OLY.x0 + u * W, cy - H / 2 + v * H]);
  const d = roundPoly(az, 50);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.2} grain={0.5}>
      <MarsSky f={f} sun={{ x: 240, y: 380 }} F={F} />
      <Layer depth={0.2} haze={{ color: F.haze, amount: 0.5 }}>
        <HazeBand y={480} h={300} color={F.haze} strength={0.7} />
      </Layer>
      <Layer depth={0.6}>
        <OlympusProfile f={f} light={172} F={F} />
        {/* the shield's footprint on the plain, then Arizona dropped over it */}
        <ellipse cx={OLY_XC} cy={cy} rx={W / 2} ry={H / 2} fill={F.shadow} opacity={0.22} />
        <ellipse cx={OLY_XC} cy={cy} rx={W / 2} ry={H / 2} fill="none" stroke={F.light} strokeWidth={10} strokeDasharray="60 40" strokeDashoffset={-f * 3} opacity={0.7} />
        <g opacity={k} transform={`translate(0 ${((1 - k) * -1600).toFixed(1)}) translate(${OLY_XC} ${cy}) scale(${land.sx} ${land.sy}) translate(${-OLY_XC} ${-cy})`}>
          <path d={d} fill={alpha("#FFF4E2", 0.3)} stroke="#FFF4E2" strokeWidth={16} strokeLinejoin="round" />
        </g>
        <DustDevil f={f} x={-600} h={420} speed={0.8} seed={7} F={F} />
        <Motes frame={f} n={30} x={-3000} y={-1200} w={9000} h={3400} color={F.haze} seed={81} size={12} drift={44} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 16, 34)}>
          <Pill x={120} y={128} text="BASE · THE SIZE OF ARIZONA" fill={pillFill(F)} color={F.text} dot={F.light} size={24} />
          <Pill x={120} y={182} text="OUTLINE SCHEMATIC" fill={pillFill(F)} color={F.text} size={16} />
        </g>
        <Kicker x={120} y={1000} text="— PROFILE · VERTICAL SCALE X3" color={F.dim} size={18} />
        <L12Gauge family={F} value={HEIGHTS.olympusLow / 2 + HEIGHTS.olympusHigh / 2} max={100000} bands={[{ from: HEIGHTS.olympusLow /* #19 */, to: HEIGHTS.olympusHigh /* #18 */, color: F.light }]} readout="22-26 km" base="ABOVE THE PLAINS" />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 7-11 · gag: Tick large on the flank with a spirit level; the bubble barely off centre; "2-5°"

const ShotLevel: ShotFC<CL07> = ({ f, len }) => {
  const F = MARS;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 980, y: 600, zoom: 1.0 }, { f: len + 20, x: 940, y: 580, zoom: 1.08 }]));
  const slope = 3.5; // degrees: inside the 2-5° range (#18); the TRUE slope, no exaggeration in this close shot
  const ppm = 290;
  const gx = 900;
  const gy = 960;
  const groundY = (x: number) => gy - (x - gx) * Math.tan((slope * Math.PI) / 180);
  const look = Math.sin(f / 40) * 0.9; // Tick looks around for the mountain
  const shrugAt = Math.max(30, len - 70);
  const poseT = clamp01((f - shrugAt) / 28) * 1.6;
  const bubble = Math.sin(f / 50) * 4 - 10;
  const levelW = 1.2 * ppm;
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.2} grain={0.5}>
      <MarsSky f={f} sun={{ x: -500, y: 300 }} F={F} />
      <Layer depth={0.3} haze={{ color: F.haze, amount: 0.45 }}>
        {/* the flank continues as a near-flat horizon either way */}
        <path d={`M-2000 ${groundY(-2000) - 160} L4000 ${groundY(4000) - 160} L4000 1600 L-2000 1600 Z`} fill={hazed(F, F.mid, 0.35)} />
      </Layer>
      <Layer depth={1}>
        <path d={`M-2000 ${groundY(-2000)} L4000 ${groundY(4000)} L4000 1800 L-2000 1800 Z`} fill={F.mid} />
        <path d={`M-2000 ${groundY(-2000)} L4000 ${groundY(4000)} L4000 ${groundY(4000) + 26} L-2000 ${groundY(-2000) + 26} Z`} fill={mixHex(F.mid, F.light, 0.25)} opacity={0.7} />
        <HazeBand y={gy + 120} h={500} color={F.shadow} strength={0.35} />
        {[-700, -300, 200, 1500, 1800].map((x, i) => (
          <ellipse key={i} cx={x} cy={groundY(x) + 8 + rnd(i) * 30} rx={14 + rnd(i * 3) * 30} ry={6 + rnd(i * 5) * 8} fill={mixHex(F.mid, F.shadow, 0.45)} />
        ))}
        <GroundShadow x={gx + 30} y={groundY(gx) + 2} rx={ppm * 0.5} color={F.shadow} opacity={0.4} blur={8} />
        <g transform={`rotate(${-slope} ${gx} ${groundY(gx)})`}>
          <Tick x={gx} y={groundY(gx)} pxPerM={ppm} frame={f} pose="hold" poseTo="shrug" poseT={poseT} expression="thinking" expressionTo="surprised" expressionT={clamp01((f - shrugAt + 6) / 20)} look={look} outline={F.shadow} />
          {/* the spirit level in the front hand: a sage body, a vial, the bubble a touch off centre */}
          <g opacity={1 - sm(poseT, 0.1, 0.5)} transform={`translate(${gx + 0.36 * ppm} ${groundY(gx) - 1.04 * ppm}) rotate(${slope})`}>
            <rect x={-levelW / 2} y={-0.1 * ppm} width={levelW} height={0.2 * ppm} rx={0.04 * ppm} fill="#8C8A6E" stroke={F.shadow} strokeWidth={2} />
            <rect x={-0.26 * ppm} y={-0.07 * ppm} width={0.52 * ppm} height={0.14 * ppm} rx={0.07 * ppm} fill="#CFE6A6" stroke={F.shadow} strokeWidth={1.5} />
            <line x1={-0.06 * ppm} y1={-0.07 * ppm} x2={-0.06 * ppm} y2={0.07 * ppm} stroke={F.shadow} strokeWidth={1.5} />
            <line x1={0.06 * ppm} y1={-0.07 * ppm} x2={0.06 * ppm} y2={0.07 * ppm} stroke={F.shadow} strokeWidth={1.5} />
            <ellipse cx={bubble} cy={-0.005 * ppm} rx={0.07 * ppm} ry={0.05 * ppm} fill="#FFFBEA" opacity={0.95} />
          </g>
        </g>
        <Motes frame={f} n={30} x={-200} y={100} w={2300} h={800} color={F.haze} seed={82} size={4} drift={36} />
      </Layer>
      <Layer depth={1.3}>
        <Form d={roundPoly([[-300, 1200], [-240, 1090], [-100, 1050], [60, 1100], [120, 1200]], 24)} fill={F.near} light={172} shadow={F.shadow} inset={18} rim={F.light} rimWidth={3} bounce={F.bounce} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 10, 30)}>
          <Metric x={120} y={200} value="2-5" unit="°" size={84} color={F.text} />
          <Pill x={120} y={256} text="FLANK SLOPE" fill={pillFill(F)} color={F.text} dot={F.light} size={16} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.olympusLow / 2 + HEIGHTS.olympusHigh / 2} max={100000} bands={[{ from: HEIGHTS.olympusLow /* #19 */, to: HEIGHTS.olympusHigh /* #18 */, color: F.light }]} readout="22-26 km" base="ABOVE THE PLAINS" />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 7-12 / 7-13 · ember: Mars cut open; the heat glyph under a crust that does not move; the Hawaii inset slides; then
// the camera tilts up to the surface where lava sheets stack while an unnumbered strip blurs past

const ShotCutaway: ShotFC<CL07> = ({ f, len, c }) => {
  const F = EMBER;
  const t1 = c.sheets - c.cutaway; // the tilt up starts here
  const cam = pop(
    f,
    cameraAt(f, [
      { f: 0, x: 900, y: 600, zoom: 1.0 },
      { f: t1 - 10, x: 900, y: 580, zoom: 1.07 },
      { f: t1 + 44, x: 900, y: 250, zoom: 1.45 },
      { f: len + 20, x: 900, y: 215, zoom: 1.58 },
    ]),
  );
  const surf = 330;
  const crustBot = 520;
  const cx = 860;
  // the shield on the surface (the same profile, shrunk); sheets land on its top from t1
  const sPts: Pt[] = OLY_PTS.filter((_, i) => i % 3 === 0).map(([x, y]): Pt => [cx + (x - OLY_XC) * 0.2, surf - (OLY.base - y) * 0.2]);
  const topY = surf - OLY_H * 0.2 + 16;
  const sheets = Array.from({ length: 9 }, (_, i) => {
    const at = t1 + 10 + i * 22;
    return { i, k: sm(f, at, at + 14), cool: clamp01((f - at - 14) / 46) };
  });
  const glyphP = pulse(f, 50, 0.08, 3);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.5}>
      <Layer depth={1}>
        {/* ochre Mars sky above the surface, hot solid mantle below (bands glow with depth; nothing molten) */}
        <rect x={-800} y={-1600} width={3600} height={surf + 1600} fill="#B86A2E" />
        <HazeBand y={surf - 420} h={420} color="#EDC27C" strength={0.6} x={-800} w={3600} />
        <CloudRack f={f} n={6} x0={-900} x1={2800} y0={-260} y1={250} size={70} speed={2} body="#E3A866" under="#A85A26" opacity={0.8} seed={18} flat={1.4} />
        <rect x={-800} y={crustBot - 40} width={3600} height={1500} fill="#5A1C0C" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={smoothPath([[-800, crustBot + 210 + i * 120], [200, crustBot + 170 + i * 120 + Math.sin(f / 80 + i) * 10], [cx, crustBot + 120 + i * 112], [1500, crustBot + 180 + i * 120 - Math.sin(f / 70 + i) * 10], [2800, crustBot + 215 + i * 120]]) + ` L2800 2200 L-800 2200 Z`} fill={mixHex("#7A2A10", "#B04A18", i / 3)} opacity={0.75} />
        ))}
        <LightWash x={cx} y={crustBot + 110} rx={760} ry={300} color={F.light} strength={0.5 * glyphP} />
        <Emissive d={roundPoly(blobPts(cx, crustBot + 150, 84 * glyphP, 10, 6, 0.16, 0.72), 34)} color="#FF9A3C" core="#FFD27A" fill strength={0.9} glow={32} />
        <Embers frame={f} x0={cx - 130} x1={cx + 130} y={crustBot + 130} n={22} color={F.second} seed={83} rise={0.8} life={80} />
        {/* the crust: one still slab, lit from below by the heat */}
        <Form d={`M-800 ${surf} L2800 ${surf} L2800 ${crustBot} L${cx + 500} ${crustBot + 26} L${cx} ${crustBot + 50} L${cx - 500} ${crustBot + 26} L-800 ${crustBot} Z`} fill="#8A4420" light={90} shadow={F.shadow} inset={34} shadowOpacity={0.45} rim="#FFB347" rimWidth={5} rimOpacity={0.8} bounce={F.bounce}>
          {[0.3, 0.62].map((q) => (
            <line key={q} x1={-800} y1={surf + (crustBot - surf) * q} x2={2800} y2={surf + (crustBot - surf) * q + 8} stroke={F.shadow} strokeWidth={3} opacity={0.25} />
          ))}
        </Form>
        <Form d={ridgePath(sPts, surf + 30, 10)} fill="#B86A2E" light={172} shadow={F.shadow} inset={18} rim="#FFE4AE" rimWidth={3} bounce={F.bounce} />
        {/* lava sheets: thin, arriving amber, cooling to terracotta on top of the last (never a column, F4) */}
        {sheets.map((s) => {
          if (s.k <= 0) return null;
          const y = topY - s.i * 11;
          const w = (300 - s.i * 16) * (0.4 + 0.6 * s.k);
          const d = rrect(cx - w / 2, y - 10, w, 12, 6);
          const col = mixHex("#FFB347", "#9A4A1E", s.cool);
          return (
            <g key={s.i}>
              {s.cool < 1 ? <path d={d} fill="#FF9A3C" filter="url(#soft-8)" opacity={(1 - s.cool) * 0.8} /> : null}
              <path d={d} fill={col} stroke={F.shadow} strokeWidth={1} />
            </g>
          );
        })}
        <Embers frame={f} x0={cx - 160} x1={cx + 160} y={topY - 40} n={14} color={F.second} seed={84} rise={0.5} life={60} size={2} />
        {/* the Hawaii inset (from 5-16): a plate sliding over its heat, carrying each cone away */}
        <Inset cx={1260} cy={800} r={150} at={[1260, 800]} scale={1} family={F} t={sm(f, 10, 34)}>
          <rect x={1100} y={640} width={320} height={320} fill="#0A3C4C" />
          <rect x={1100} y={830} width={320} height={140} fill="#5A1C0C" />
          <circle cx={1260} cy={890} r={30 * glyphP} fill="#FF9A3C" />
          <rect x={1100} y={800} width={320} height={40} fill="#56656F" />
          {lane(f, 3, 1060, 1460, 1.1, 5).map((p, i) => (
            <path key={i} d={`M${p.x - 26} 800 L${p.x} ${762 + i * 6} L${p.x + 26} 800 Z`} fill={i === 0 ? "#7FAE9F" : "#3F7F8E"} />
          ))}
          {lane(f, 4, 1100, 1420, 1.1, 6).map((p, i) => (
            <path key={i} d={`M${p.x} 820 h18 m-6 -6 l6 6 l-6 6`} stroke="#FFF0DC" strokeWidth={2.5} fill="none" />
          ))}
        </Inset>
        <g opacity={sm(f, 20, 40) * (1 - sm(f, t1, t1 + 20))}>
          <Pill x={1260} y={990} text="EARTH · THE PLATE MOVES" fill={pillFill(F)} color={F.text} dot="#7FAE9F" size={16} align="middle" />
        </g>
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 8, 28)}>
          <Pill x={120} y={128} text="MARS · NO PLATE TECTONICS" fill={pillFill(F)} color={F.text} dot={F.second} size={22} />
          <Kicker x={120} y={182} text="— PLANETARY SCIENTIST, PURDUE" color={F.text} size={18} />
        </g>
        {f > t1 ? (
          <g opacity={sm(f, t1 + 20, t1 + 40)}>
            {/* the strip blurs past unnumbered: no count of years is claimed ("hundreds of millions, maybe billions", #10) */}
            <TimeStrip x={120} y={1000} w={1100} value={f * 0.9} span={40} step={4} family={F} format={() => ""} height={40} kicker="FLOW ON FLOW" />
          </g>
        ) : null}
        <L12Gauge family={F} value={HEIGHTS.olympusLow / 2 + HEIGHTS.olympusHigh / 2} max={100000} bands={[{ from: HEIGHTS.olympusLow /* #19 */, to: HEIGHTS.olympusHigh /* #18 */, color: L12_COLORS.amber }]} readout="22-26 km" base="ABOVE THE PLAINS" />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 7-14 · two scale pads: the same pile of sheets reads well under half on Mars; ×0.38

const ShotPads: ShotFC<CL07> = ({ f, len }) => {
  const F = EMBER;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 960, y: 600, zoom: 1.0 }, { f: len + 20, x: 960, y: 580, zoom: 1.1 }]));
  const floor = 860;
  const k = sm(f, 10, 50);
  const mult = lerp(1, 0.38 /* #17 */, k);
  const pile = (x: number) => (
    <g>
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={x - 150 + i * 12} y={floor - 46 - i * 18} width={300 - i * 24} height={17} rx={7} fill={mixHex("#B86A2E", F.shadow, i % 2 ? 0.3 : 0.12)} stroke={F.shadow} strokeWidth={1.5} />
      ))}
      <rect x={x - 150 + 84} y={floor - 46 - 7 * 18} width={300 - 168} height={5} rx={2} fill="#FFB347" opacity={0.7} />
    </g>
  );
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Bloom x={960} y={1100} r={1000} color={F.light} strength={0.45} spread={0.3} squash={0.5} />
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={floor} width={2720} height={600} fill={F.near} />
        <LightWash x={960} y={floor} rx={1200} ry={200} color={F.light} strength={0.35} />
        <Embers frame={f} x0={-200} x1={2100} y={floor + 60} n={40} color={F.second} seed={85} rise={0.7} life={120} size={2.2} />
        <ScalePad x={440} y={floor} w={360} value={70} max={100} F={F} f={f} light={90} title="EARTH">
          {pile(440)}
          <Disc x={200} y={floor - 60} r={48} world="earth" f={f} light={200} bg={F} />
        </ScalePad>
        <ScalePad x={1060} y={floor} w={360} value={70 * mult} max={100} F={F} f={f} light={90} title="MARS">
          {pile(1060)}
          <Disc x={820} y={floor - 60} r={48} world="mars" f={f} light={200} bg={F} />
        </ScalePad>
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 8, 26)}>
          <Metric x={120} y={200} value={`×${mult.toFixed(2)}`} size={84} color={F.text} />
          <Pill x={120} y={256} text="THE SAME PILE · ON MARS" fill={pillFill(F)} color={F.text} dot={F.second} size={16} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.olympusLow / 2 + HEIGHTS.olympusHigh / 2} max={100000} bands={[{ from: HEIGHTS.olympusLow /* #19 */, to: HEIGHTS.olympusHigh /* #18 */, color: L12_COLORS.amber }]} readout="22-26 km" base="ABOVE THE PLAINS" />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 7-15 / 7-16 · void: Venus beside Earth, near-twin; the ceiling stretches a little, to just under 10 km

const ShotVenusDisc: ShotFC<CL07> = ({ f, len, c }) => {
  const F = VOID;
  const t0 = c.venusPredict - c.venusDisc;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 20, x: 940, y: 540, zoom: 1.1 }]));
  const stretch = sm(f, t0, t0 + 40);
  const ceil = lerp(9000 /* #9 */, HEIGHTS.predictedVenus /* #26 */, stretch);
  const r = 230;
  const slide = sm(f, 0, 30);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={110} w={1920} h={1080} color={F.text} seed={86} size={1.4} twinkle={0.7} />
        <Bloom x={-200} y={300} r={900} color={F.light} strength={0.3} spread={0.3} />
      </Layer>
      <Layer depth={0.3}>
        <Motes frame={f} n={26} x={0} y={0} w={1920} h={1080} color={mixHex(F.text, "#D9A64A", 0.5)} seed={87} size={2.6} drift={24} glow={false} />
      </Layer>
      <Layer depth={1}>
        <Disc x={520} y={560} r={r} world="earth" f={f} light={200} bg={F} />
        <Disc x={1060 + (1 - slide) * 900} y={560} r={r * (DISC_KM.venus / DISC_KM.earth)} world="venus" f={f} light={200} bg={F} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 8, 26)}>
          {stretch < 0.5 ? <Metric x={120} y={200} value="0.90" unit="g" size={84} color={F.text} /> : <Metric x={120} y={200} value="~10" unit="km" size={84} color={F.text} />}
          <Pill x={120} y={256} text={stretch < 0.5 ? "VENUS · SURFACE GRAVITY" : "PREDICTED · SIMPLE RULE"} fill={pillFill(F)} color={F.text} dot="#FFE1A0" size={16} />
          <Pill x={120} y={302} text="DISCS · ONE DIAMETER SCALE" fill={pillFill(F)} color={F.text} size={16} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} max={12000} ceiling={{ v: ceil, label: stretch > 0.95 ? "PREDICTED ~10 km" : undefined }} base="EVEREST · ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 7-17 / 7-18 · Venus: dim amber haze, bands drifting; Maxwell Montes as a rugged ridge; the gauge at ~11 km, then
// the bracket "CLOSE" between predicted ~10 and actual ~11

const MAXWELL: Pt[] = [
  [-500, 1000],
  [-200, 880],
  [60, 760],
  [300, 690],
  [520, 560],
  [700, 470],
  [820, 430],
  [900, 380],
  [960, 356],
  [1040, 392],
  [1130, 440],
  [1260, 420],
  [1400, 520],
  [1600, 640],
  [1850, 760],
  [2100, 880],
  [2500, 1000],
];

const ShotMaxwell: ShotFC<CL07> = ({ f, len, c }) => {
  const F = VENUS;
  const t1 = c.close - c.maxwell;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 980, y: 620, zoom: 1.0 }, { f: len + 20, x: 960, y: 560, zoom: 1.16 }]));
  const bracket = sm(f, t1, t1 + 24);
  const glints = [800, 900, 960, 1040, 1130, 1260].map((x, i) => {
    const y = MAXWELL.find((p) => p[0] === x)?.[1] ?? 500;
    return { x, y, o: flicker(f, i * 7 + 1, 0.8) };
  });
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.3} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        {/* diffuse light from above through the cloud deck: a wide soft bloom, no disc (light 270) */}
        <Bloom x={960} y={-200} r={1500} color={F.light} strength={0.4} spread={0.5} squash={0.6} />
      </Layer>
      <Layer depth={0.12}>
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 140 + i * 110;
          const x = ((f * (0.5 + i * 0.15) + i * 500) % 3400) - 1700;
          return <ellipse key={i} cx={x} cy={y} rx={1100 + i * 100} ry={22 + i * 8} fill={i % 2 ? F.haze : F.shadow} opacity={0.16} />;
        })}
        {/* pass b: the cloud deck's lower edge, defined masses streaming past (Venus' upper winds are fast) */}
        <CloudRack f={f} n={6} x0={-900} x1={2900} y0={400} y1={540} size={80} speed={2.4} body={mixHex(F.haze, F.light, 0.3)} under={mixHex(F.haze, F.shadow, 0.35)} opacity={0.75} seed={16} flat={1.5} />
      </Layer>
      <Layer depth={0.25} haze={{ color: F.haze, amount: 0.5 }}>
        <path d={ridgePath([[-600, 900], [-200, 820], [200, 860], [600, 780], [1000, 830], [1400, 770], [1900, 840], [2500, 800]], 1300, 30)} fill={F.far} />
        <HazeBand y={700} h={300} color={F.haze} strength={0.6} />
      </Layer>
      <Layer depth={0.6} haze={{ color: F.haze, amount: 0.1 }}>
        <Form d={ridgePath(MAXWELL, 1300, 6)} fill={mixHex(F.near, F.mid, 0.35)} light={270} shadow={F.shadow} inset={34} shadowOpacity={0.55} rim={F.light} rimWidth={4} rimOpacity={0.8} bounce={F.bounce}>
          <Facets pts={MAXWELL} base={1300} light={315} fill={F.shadow} opacity={0.45} depth={170} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${300 + i * 260} ${640 + (i % 2) * 60} l${90 + i * 10} 260 l-40 200`} fill="none" stroke={F.shadow} strokeWidth={5} opacity={0.22} strokeLinejoin="round" />
          ))}
          <HazeBand y={820} h={300} color={F.haze} strength={0.45} />
        </Form>
        {glints.map((g, i) => (
          <circle key={i} cx={g.x} cy={g.y + 2} r={3} fill={F.light} opacity={g.o * 0.9} />
        ))}
        <Motes frame={f} n={40} x={-200} y={100} w={2300} h={900} color={F.haze} seed={88} size={4.5} drift={38} />
      </Layer>
      <Layer depth={1.3}>
        <Form d={roundPoly([[-400, 1200], [-300, 1040], [-120, 990], [80, 1060], [160, 1200]], 24)} fill={F.near} light={270} shadow={F.shadow} inset={18} rim={F.light} rimWidth={3} bounce={F.bounce} />
        <Form d={roundPoly([[1500, 1200], [1580, 1080], [1760, 1030], [1920, 1100], [2000, 1200]], 24)} fill={F.near} light={270} shadow={F.shadow} inset={18} rim={F.light} rimWidth={3} bounce={F.bounce} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 8, 28)}>
          <Metric x={120} y={200} value="~11" unit="km" size={84} color={F.text} />
          <Pill x={120} y={256} text="MAXWELL MONTES · ABOVE MEAN RADIUS" fill={pillFill(F)} color={F.text} dot={F.light} size={16} />
        </g>
        <g opacity={bracket}>
          <Pill x={120} y={302} text="CLOSE" fill={pillFill(F)} color={F.text} dot={P.vermilion} size={16} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.maxwell /* #22 */} max={12000} ceiling={{ v: HEIGHTS.predictedVenus /* #26 */, label: "PREDICTED ~10 km" }} base="ABOVE MEAN RADIUS" readout="~11 km" />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 7-19 · void: a small potato tumbles slowly into frame

const ShotVesta: ShotFC<CL07> = ({ f, len }) => {
  const F = VOID;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 20, x: 980, y: 540, zoom: 1.08 }]));
  const k = sm(f, 0, 70);
  const x = lerp(2500, 820, k);
  const y = lerp(380, 560, k);
  const rot = -30 + f * 0.12;
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={120} w={1920} h={1080} color={F.text} seed={89} size={1.4} twinkle={0.7} />
        <Bloom x={-300} y={200} r={1000} color={F.light} strength={0.3} spread={0.3} />
      </Layer>
      <Layer depth={0.3}>
        <Motes frame={f} n={26} x={0} y={0} w={1920} h={1080} color={F.dim} seed={90} size={2.4} drift={24} glow={false} />
      </Layer>
      <Layer depth={1}>
        <Vesta x={x} y={y} r={250} f={f} rot={rot} light={200} F={F} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 30, 50)}>
          <Metric x={120} y={200} value="0.25" unit="m/s²" size={84} color={F.text} />
          <Pill x={120} y={256} text="VESTA · ~500 km ACROSS" fill={pillFill(F)} color={F.text} dot="#C9C4B4" size={16} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} max={10000} ceiling={{ v: 9000 /* #9 */ }} base="EVEREST · ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------

export const SceneL07: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL07(t);
  const shots: ShotDef<CL07>[] = [
    { from: 0, S: ShotPad, id: "7-01" },
    { from: c.balls, S: ShotBalls, id: "7-02" },
    { from: c.pairs, S: ShotPairs, id: "7-04" },
    { from: c.marsDisc, S: ShotMarsDisc, id: "7-05" },
    { from: c.olympus, S: ShotOlympus, id: "7-07" },
    { from: c.fits, S: ShotFits, id: "7-08" },
    { from: c.stack, S: ShotStack, id: "7-09" },
    { from: c.arizona, S: ShotArizona, id: "7-10" },
    { from: c.level, S: ShotLevel, id: "7-11" },
    { from: c.cutaway, S: ShotCutaway, id: "7-12" },
    { from: c.pads, S: ShotPads, id: "7-14" },
    { from: c.venusDisc, S: ShotVenusDisc, id: "7-15" },
    { from: c.maxwell, S: ShotMaxwell, id: "7-17" },
    { from: c.vesta, S: ShotVesta, id: "7-19" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). */
export const soundL07 = (t: SceneTiming): Cue[] => {
  const c = cuesL07(t);
  const hop = c.hop;
  return [
    // 7-01 the pad; the headline
    { at: 8, file: SFX.popLong, vol: 0.3, dur: 30 },
    ...cutHit(c.balls),
    // 7-02 footsteps on the ball, 7-03 the soft landing on Mars
    ...[0, 27, 54, 81].map((o) => ({ at: c.balls + 10 + o, file: SFX.click, vol: 0.12, dur: 10 })),
    { at: hop + 44, file: SFX.popLong, vol: 0.28, dur: 30 },
    ...cutHit(c.pairs),
    { at: c.pairs + 14, file: SFX.pop, vol: 0.26, dur: 20 },
    { at: c.pairs + 26, file: SFX.pop, vol: 0.26, dur: 20 },
    ...cutHit(c.marsDisc),
    { at: c.marsDisc, file: SFX.deepWhoosh, vol: 0.26, dur: 60 },
    { at: c.predict, file: SFX.riser, vol: 0.22, dur: 50, fadeOut: 12 },
    { at: c.predict + 48, file: SFX.pop, vol: 0.28, dur: 20 },
    // 7-07 the pan: a thin wind bed under Mars
    ...cutHit(c.olympus),
    { at: c.olympus, file: SFX.wind, vol: 0.14, dur: c.cutaway - c.olympus, fadeIn: 20, fadeOut: 20 },
    { at: c.fits + 16, file: SFX.click, vol: 0.2, dur: 14 },
    { at: c.fits + 28, file: SFX.click, vol: 0.2, dur: 14 },
    { at: c.fits + 62, file: SFX.popLong, vol: 0.3, dur: 30 },
    ...cutHit(c.stack),
    ...[8, 24, 40].map((o) => ({ at: c.stack + o + 12, file: SFX.pop, vol: 0.26, dur: 20 })),
    ...cutHit(c.arizona),
    { at: c.arizona + 28, file: SFX.popLong, vol: 0.3, dur: 30 },
    ...cutHit(c.level),
    { at: c.level + 10, file: SFX.click, vol: 0.22, dur: 14 },
    { at: c.level + 30, file: SFX.pop, vol: 0.24, dur: 20 },
    ...cutHit(c.cutaway),
    { at: c.cutaway, file: SFX.rumble, vol: 0.3, dur: c.pads - c.cutaway, fadeIn: 10, fadeOut: 20 },
    ...Array.from({ length: 8 }, (_, i) => ({ at: c.sheets + i * 18 + 10, file: SFX.popLong, vol: 0.14, dur: 20 })),
    { at: c.sheets, file: SFX.riser, vol: 0.18, dur: 90, fadeOut: 20 },
    ...cutHit(c.pads),
    { at: c.pads + 46, file: SFX.pop, vol: 0.28, dur: 20 },
    ...cutHit(c.venusDisc),
    { at: c.venusDisc, file: SFX.deepWhoosh, vol: 0.26, dur: 60 },
    { at: c.venusPredict + 38, file: SFX.pop, vol: 0.28, dur: 20 },
    ...cutHit(c.maxwell),
    { at: c.maxwell, file: SFX.rumble, vol: 0.22, dur: c.vesta - c.maxwell, fadeIn: 16, fadeOut: 20 },
    { at: c.close + 20, file: SFX.chime, vol: 0.24, dur: 50 },
    ...cutHit(c.vesta),
    { at: c.vesta, file: SFX.deepWhoosh, vol: 0.26, dur: 60 },
    { at: c.vesta + 40, file: SFX.pop, vol: 0.26, dur: 20 },
  ];
};

/** The void field's chapter card is drawn by l06's tail (ChapterCard 4); l07 opens on 7-01. Re-exported for S06. */
export const chapterFourCard = (t: number, frame: number) => <ChapterCard family={VOID} kicker="— CHAPTER FOUR · OTHER WORLDS" title="Now Change the Planet" t={t} frame={frame} />;

/** Hard black between acts (l06's tail uses it before the card). */
export const Black: React.FC<{ opacity: number }> = ({ opacity }) => <AbsoluteFill style={{ background: "#000", opacity, pointerEvents: "none" }} />;
