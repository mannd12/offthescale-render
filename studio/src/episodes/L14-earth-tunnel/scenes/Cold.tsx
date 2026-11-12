// L14 scene "cold" (storyboard §3 "Cold open": C-01…C-10, script lines 0-2, dusk desert → void cut-away → card, Act I).
// Shot components (hard cuts only; continuous rows are phases): C-01+C-02 (the desert hatch, the lid kicked open, the
// dotted line shooting down, tilt down) · C-03 (the cut-away disc, the line through the middle: 12,742 km) · C-04 (the
// clock sweeps to 42, two saffron crosses) · C-05 (the 42 cracks) · C-06 (the far end retracts, the "?" tag) · C-07+C-08
// (Tick lets the probe go, the gauges fade up, the camera rides down the strata) · C-09 (every needle to its stop) ·
// C-10 ChapterCard 1 (layer rings behind the type, zoom into the ring centre).
// Numbers drawn, each with its sources.md row: 12,742 km (#13) · 42 MIN (#1 #2). The SPEED stop "8 km/s" (#2). No PULL
// stop label before l02 line 2. The "?" tag marks the unrevealed ending, not a value (F10). Tick never enters the tunnel.
//
// This file also exports the package-I helpers (Tag, Pop, Desert, VoidField, StudioRoom, Arrow, ClockText, Cross) that
// S01-S03 import; the scene bodies stay bespoke.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Bloom,
  CloudRack,
  CycClouds,
  Family,
  GroundShadow,
  HazeBand,
  IF2,
  Kicker,
  Layer,
  Metric,
  Motes,
  STUDIO_SET,
  Sky,
  Stage,
  Stars,
  Streamers,
  Tick,
  UnknownTag,
  alpha,
  cameraAt,
  cutPop,
  impact,
  mixHex,
  ramp,
  rnd,
  smooth,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L14_COLORS, familyOf, pillFill } from "../families";
import { L14Gauges, STOP } from "../L14Gauges";
import { L14Card } from "../L14Card";
import { StrataWall, Stratum } from "../tunnel";
import { CutGlobe } from "../cutglobe";
import { ClockFace, HatchLid, Probe } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";

// ================================================================================================================
// package-I helpers (Cold, S01, S02, S03)
// ================================================================================================================

export const C = L14_COLORS;
export const DUSK = familyOf("dusk");
export const VOID = familyOf("void");
export const PETROL = familyOf("petrol");
export const NOON = familyOf("noon");
export const EMBER = familyOf("ember");
export const STUDIO = STUDIO_SET;
export const CREAM = "#FFF4DE";
export const INK = "#1E4A5C";
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** eased 0..1 between frames a and b */
export const ez = (f: number, a: number, b: number) => smooth(ramp(f, a, b));

/** A hard cut's pop (scale bump over 9 frames). */
export const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/** A pill that keeps the text EXACTLY as written (units like km, °C, kg stay in their case; write caps yourself). */
export const Tag: React.FC<{ x: number; y: number; text: string; F: Family; dot?: string; size?: number; align?: "start" | "end" | "middle"; opacity?: number }> = ({ x, y, text, F, dot, size = 28, align = "start", opacity = 1 }) => {
  const w = text.length * size * 0.62 + size * (dot ? 2.4 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g opacity={opacity}>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={pillFill(F)} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.1, fill: CREAM }}>
        {text}
      </text>
    </g>
  );
};

/** A big number on a dark slab (for metrics over busy art); `value` as written, unit in its own case. */
export const Slab: React.FC<{ x: number; y: number; value: string; unit?: string; size?: number; F: Family; opacity?: number; color?: string }> = ({ x, y, value, unit, size = 96, F, opacity = 1, color = CREAM }) => {
  const w = value.length * size * 0.6 + (unit ? unit.length * size * 0.27 + size * 0.3 : 0) + size * 0.6;
  return (
    <g opacity={opacity}>
      <rect x={x - size * 0.3} y={y - size * 0.95} width={w} height={size * 1.25} rx={size * 0.18} fill={pillFill(F)} />
      <Metric x={x} y={y} value={value} unit={unit} size={size} color={color} />
    </g>
  );
};

/** mm:ss text rolling up to `secs` (a counter rolling to a sourced value; `k` 0..1). */
export const ClockText: React.FC<{ x: number; y: number; secs: number; k?: number; size?: number; color: string; align?: "start" | "middle" | "end"; pre?: string }> = ({ x, y, secs, k = 1, size = 96, color, align = "middle", pre = "" }) => {
  const s = Math.round(secs * clamp01(k));
  const txt = `${pre}${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return (
    <text x={x} y={y} textAnchor={align} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: size, fontVariantNumeric: "tabular-nums", fill: color, letterSpacing: -size * 0.02 }}>
      {txt}
    </text>
  );
};

/** A straight arrow with a head, from (x1,y1) to (x2,y2). */
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string; w?: number; head?: number; opacity?: number }> = ({ x1, y1, x2, y2, color, w = 12, head = 34, opacity = 1 }) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const L = Math.hypot(x2 - x1, y2 - y1);
  if (L < 2) return null;
  const hx = x2 - Math.cos(a) * Math.min(head, L * 0.6);
  const hy = y2 - Math.sin(a) * Math.min(head, L * 0.6);
  const n = [Math.cos(a + Math.PI / 2), Math.sin(a + Math.PI / 2)];
  const hw = Math.min(head, L * 0.6) * 0.62;
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <path d={`M${x2} ${y2} L${hx + n[0] * hw} ${hy + n[1] * hw} L${hx - n[0] * hw} ${hy - n[1] * hw} Z`} fill={color} />
    </g>
  );
};

/** A saffron cross slamming in (k 0..1 = in; squash at landing). */
export const Cross: React.FC<{ x: number; y: number; s: number; k: number; color?: string }> = ({ x, y, s, k, color = C.saffron }) => {
  if (k <= 0) return null;
  const sc = 2.4 - 1.4 * smooth(clamp01(k));
  return (
    <g transform={`translate(${x} ${y}) scale(${sc.toFixed(3)}) rotate(${(1 - clamp01(k)) * 30})`} opacity={clamp01(k * 3)}>
      <path d={`M${-s} ${-s * 0.78} L${-s * 0.78} ${-s} L0 ${-s * 0.22} L${s * 0.78} ${-s} L${s} ${-s * 0.78} L${s * 0.22} 0 L${s} ${s * 0.78} L${s * 0.78} ${s} L0 ${s * 0.22} L${-s * 0.78} ${s} L${-s} ${s * 0.78} L${-s * 0.22} 0 Z`} fill={color} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    </g>
  );
};

/** The night desert (dusk): stars, low sun behind the dunes at right, cirrus rack, three tonal dunes, wind streamers.
 *  `deep` = the ground fills to the bottom of the frame; otherwise it stops 40 px under `ground` (a cut-away below). */
export const Desert: React.FC<{ f: number; ground?: number; deep?: boolean; wind?: number; dy?: number; children?: React.ReactNode; seed?: number }> = ({ f, ground = 860, deep = true, wind = 9, dy = 0, children, seed = 1 }) => {
  const F = DUSK;
  const far = mixHex(F.far, C.crustDeep, 0.35);
  const mid = mixHex(F.mid, C.crust, 0.45);
  const near = mixHex(F.near, C.crustDeep, 0.55);
  const bottom = deep ? 2600 : ground + 40;
  return (
    <g transform={`translate(0 ${(-dy).toFixed(1)})`}>
      <Sky family={F} y={-400} h={ground + 400} />
      <Stars frame={f} n={70} w={1920} h={ground - 300} color={F.text} seed={seed + 3} size={2.2} twinkle={0.6} />
      <Bloom x={1680} y={ground - 150} r={520} color={F.light} core={52} coreColor="#FFF1C8" strength={0.85} />
      <CloudRack f={f} n={4} x0={-700} x1={2700} y0={150} y1={420} size={70} speed={2.4} body={alpha("#F3A35C", 0.75)} under={alpha("#7A3A20", 0.5)} top={alpha("#FFE0A8", 0.6)} seed={seed + 11} flat={1.6} />
      <path d={`M-200 ${ground - 170} Q 300 ${ground - 300} 760 ${ground - 190} Q 1200 ${ground - 90} 1560 ${ground - 230} Q 1900 ${ground - 320} 2200 ${ground - 200} L2200 ${bottom} L-200 ${bottom} Z`} fill={far} />
      <HazeBand y={ground - 200} h={140} color={F.haze} strength={0.45} x={-200} w={2400} />
      <path d={`M-200 ${ground - 70} Q 380 ${ground - 170} 900 ${ground - 80} Q 1400 ${ground - 10} 2200 ${ground - 120} L2200 ${bottom} L-200 ${bottom} Z`} fill={mid} />
      <path d={`M-200 ${ground + 6} Q 500 ${ground - 26} 1100 ${ground + 4} Q 1600 ${ground + 20} 2200 ${ground - 10} L2200 ${bottom} L-200 ${bottom} Z`} fill={near} />
      {wind > 0 ? <Streamers f={f} n={16} x0={-300} x1={2300} y0={ground - 260} y1={ground + 10} len={220} width={6} speed={wind} color={alpha("#FFE0B0", 0.9)} opacity={0.55} slope={-0.02} seed={seed + 5} /> : null}
      {children}
    </g>
  );
};

/** The void field for the lit cut-away disc: stars, a warm rim bloom behind the disc. */
export const VoidField: React.FC<{ f: number; cx: number; cy: number; R: number; seed?: number }> = ({ f, cx, cy, R, seed = 1 }) => (
  <g>
    <Sky family={VOID} />
    <Stars frame={f} n={110} w={1920} h={1080} color={VOID.text} seed={seed} size={2.2} twinkle={0.7} />
    <Bloom x={cx - R * 0.5} y={cy + R * 0.3} r={R * 1.6} color={VOID.light} core={0} strength={0.35} />
  </g>
);

/** The teal studio cyclorama (never bone): cyc clouds sliding, ochre floor; children on the floor plane. */
export const StudioRoom: React.FC<{ f: number; children?: React.ReactNode; hud?: React.ReactNode; seed?: number; floor?: number }> = ({ f, children, hud, seed = 4, floor = 860 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={STUDIO} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f} y={70} n={5} seed={seed} />
    </Layer>
    <Layer depth={0.6}>
      <rect x={-1400} y={floor - 30} width={4800} height={1200} fill={mixHex(STUDIO.mid, "#FFE4A8", 0.15)} />
      <HazeBand y={floor - 160} h={180} color={STUDIO.haze} strength={0.7} x={-1400} w={4800} />
    </Layer>
    <Layer depth={1}>
      <rect x={-1400} y={floor + 40} width={4800} height={1200} fill={mixHex(STUDIO.mid, STUDIO.near, 0.55)} />
      {children}
    </Layer>
    <Layer depth={1.2}>
      <Motes frame={f} n={18} x={-100} y={60} w={2100} h={860} color={alpha(CREAM, 0.85)} seed={seed} size={5} drift={40} />
    </Layer>
    {hud ? <Layer depth={0}>{hud}</Layer> : null}
  </>
);

/** Schematic strata for the cold open's ride down (no numbers: "layer by layer"), in px of scroll. */
export const RIDE_STRATA: Stratum[] = [
  { from: 0, to: 320, color: C.crust, pattern: "rock" },
  { from: 320, to: 1900, color: C.mantle, pattern: "taffy" },
  { from: 1900, to: 2900, color: C.outer, pattern: "flow" },
  { from: 2900, to: 9000, color: C.inner, pattern: "crystal" },
];

/** Fall with a capped speed: distance after τ frames (accel a px/f², top speed v px/f). */
export const fallDist = (tau: number, a = 0.6, v = 18) => {
  if (tau <= 0) return 0;
  const tc = v / a;
  return tau < tc ? 0.5 * a * tau * tau : 0.5 * a * tc * tc + v * (tau - tc);
};

// ================================================================================================================
// cues
// ================================================================================================================

export const cuesCold = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    desert: 0, // C-01
    kick: p(0, "through the centre"), // C-02 (phase)
    disc: p(0, "and you come out"), // C-03
    clock: p(0, "in forty-two minutes"), // C-04
    famous: p(0, "That's the famous answer"),
    cross1: p(0, "It's also wrong"),
    cross2: p(0, "twice"),
    crack: at(1), // C-05
    ending: p(1, "And wrong in the ending"), // C-06
    send: p(1, "So we're going to send"), // C-07
    gauges: p(1, "with Tick watching"),
    layer: p(1, "and follow it"), // C-08 (phase)
    scale: p(1, "Every gauge will run"), // C-09
    card: at(2), // C-10
    last: end(2),
    end: t.frames,
  };
};
export type CCold = ReturnType<typeof cuesCold>;

const GROUND = 860;
const HATCH = { x: 1000, y: GROUND - 6, r: 92 };

// ================================================================================================================
// C-01 + C-02 · the desert hatch; Tick kicks the lid open; the dotted line shoots down; the camera tilts after it.
// MOVER: wind streamers 9 px/f + cirrus 2.4 px/f; then the line's head (60 px/f) and the tilting world.
// ================================================================================================================
const ShotDesert: ShotFC<CCold> = ({ f, len, c }) => {
  const kick = c.kick - c.desert;
  const lid = ez(f, kick + 4, kick + 14);
  const headY = HATCH.y + Math.max(0, f - kick - 10) * 60;
  const tilt = ez(f, kick + 14, len + 10);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: kick, x: 900, y: 600, zoom: 1.22 },
    { f: kick + 14, x: 920, y: 620, zoom: 1.22 },
    { f: len + 20, x: 980, y: 1250, zoom: 1.1 },
  ]);
  const dots = [];
  for (let y = HATCH.y + 20; y < headY; y += 46) dots.push(<circle key={y} cx={HATCH.x} cy={y} r={11} fill={C.saffron} />);
  return (
    <Stage theme={DUSK.theme} cam={cam} vignette={0.22} grain={0.5}>
      <Layer depth={0.15}>
        <Sky family={DUSK} y={-600} h={2000} />
      </Layer>
      <Layer depth={1}>
        {/* the cut-away below the sand (seen as the camera tilts down): crust bands, the shaft */}
        <rect x={-600} y={GROUND} width={3200} height={2200} fill={C.crustDeep} />
        {Array.from({ length: 18 }, (_, i) => (
          <path key={i} d={`M-600 ${GROUND + 60 + i * 120} Q 400 ${GROUND + 30 + i * 120 + Math.sin(i) * 30} 1000 ${GROUND + 60 + i * 120} T 2600 ${GROUND + 50 + i * 120} L2600 ${GROUND + 120 + i * 120} L-600 ${GROUND + 120 + i * 120} Z`} fill={i % 2 ? mixHex(C.crust, C.crustDeep, 0.3) : mixHex(C.crustDeep, C.mantle, 0.3 + i * 0.03)} />
        ))}
        <rect x={HATCH.x - 70} y={GROUND} width={140} height={2200} fill="#03171D" />
        <rect x={HATCH.x - 70} y={GROUND} width={18} height={2200} fill={alpha(DUSK.light, 0.35)} />
        <Desert f={f} ground={GROUND} deep={false} wind={9} />
        <HatchLid x={HATCH.x} y={HATCH.y} r={HATCH.r} open={lid} family={DUSK} f={f} />
        {dots}
        {f > kick + 10 ? <circle cx={HATCH.x} cy={headY} r={20} fill={C.saffronCore} stroke={C.saffron} strokeWidth={6} /> : null}
        <Probe x={1140} y={GROUND - 52} size={96} f={f} lamp={false} tilt={-8} />
        <GroundShadow x={780} y={GROUND + 4} rx={70} color={DUSK.shadow} opacity={0.5} blur={8} />
        <Tick
          x={780 + ez(f, kick - 12, kick) * 90}
          y={GROUND}
          pxPerM={150}
          frame={f}
          facing={1}
          pose="hold"
          poseTo="crouch-reach"
          poseT={ramp(f, kick - 10, kick + 2) - ramp(f, kick + 12, kick + 22)}
          expression="determined"
          expressionTo="happy"
          expressionT={ramp(f, kick + 6, kick + 14)}
          look={f < kick ? 0.4 : -0.3}
          squash={impact(f, kick + 4, 0.1, 8)}
        />
      </Layer>
      <Layer depth={0}>
        <g opacity={1 - tilt}>
          <Kicker x={120} y={130} text="A TUNNEL THROUGH THE EARTH" color={DUSK.text} size={28} />
        </g>
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// C-03 · the lit cut-away disc; the dotted line runs through the middle and out the far side. Metric 12,742 km (#13).
// MOVER: the line's head (≈ 15 px/f) + the pull back (zoom 1.4 → 1.0) + the radial hatch turning.
// ================================================================================================================
const GLOBE = { cx: 760, cy: 540, R: 410 };
const ShotDisc: ShotFC<CCold> = ({ f, len }) => {
  const k = ez(f, 4, len - 6);
  const cam = cameraAt(f, [
    { f: 0, x: 760, y: 420, zoom: 1.45 },
    { f: len, x: 900, y: 540, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <VoidField f={f} {...GLOBE} />
        </Layer>
        <Layer depth={1}>
          <CutGlobe {...GLOBE} f={f} family={VOID} rot={f * 0.8} line={{ to: -1 + 2.15 * k }} />
          <circle cx={GLOBE.cx} cy={GLOBE.cy - GLOBE.R} r={14} fill={C.saffronCore} />
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, 10, 24)}>
            <Slab x={1290} y={560} value="12,742" /* #13 */ unit="km" size={110} F={VOID} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-04 · the big clock: the minute hand sweeps to 42 and a gold mark stamps; two saffron crosses slam over it.
// MOVER: hand tip (≈ 13 px/f) + Counter to 42 + the crosses slamming in (40 px/f).
// ================================================================================================================
const CLK = { x: 720, y: 500, r: 270 };
const ShotClock: ShotFC<CCold> = ({ f, len, c }) => {
  const sweepEnd = Math.min(len * 0.45, c.famous - c.clock + 6);
  const m = 42 * ez(f, 2, sweepEnd); // #1 #2
  const x1 = c.cross1 - c.clock;
  const x2 = c.cross2 - c.clock;
  const shake = impact(f, x1 + 6, 1, 10).sy - 1 + (impact(f, x2 + 6, 1, 10).sy - 1);
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} shotFrame={f} drift={{ zoom: 1.1, panX: 0.03, panY: 0.01, frames: len + 40, seed: 2 }} vignette={0.25} grain={0.5}>
        <Layer depth={0.1}>
          <Sky family={DUSK} />
          <Stars frame={f} n={60} w={1920} h={600} color={DUSK.text} seed={9} size={2} />
        </Layer>
        <Layer depth={0.3}>
          <CloudRack f={f} n={4} x0={-700} x1={2700} y0={760} y1={1000} size={110} speed={3} body={alpha("#E3813F", 0.7)} under={alpha("#082028", 0.5)} seed={17} flat={1.4} />
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(${(Math.sin(f * 2.3) * 18 * Math.abs(shake)).toFixed(1)} 0)`}>
            <Bloom x={CLK.x} y={CLK.y} r={CLK.r * 1.7} color={DUSK.light} core={0} strength={0.5} />
            <ClockFace x={CLK.x} y={CLK.y} r={CLK.r} minutes={m} ring={m / 60} family={DUSK} f={f} />
            {f > sweepEnd ? <circle cx={CLK.x + Math.cos((((42 / 60) * 360 - 90) * Math.PI) / 180) * (CLK.r + 2)} cy={CLK.y + Math.sin((((42 / 60) * 360 - 90) * Math.PI) / 180) * (CLK.r + 2)} r={22 * (1 + 0.4 * (1 - ez(f, sweepEnd, sweepEnd + 8)))} fill={C.saffronCore} stroke={C.saffron} strokeWidth={6} /> : null}
            <Cross x={CLK.x - 60} y={CLK.y - 40} s={170} k={ramp(f, x1, x1 + 7)} />
            <Cross x={CLK.x + 70} y={CLK.y + 50} s={170} k={ramp(f, x2, x2 + 7)} />
          </g>
        </Layer>
        <Layer depth={0}>
          <g>
            <rect x={1170} y={330} width={560} height={150} rx={26} fill={pillFill(DUSK)} />
            <Metric x={1210} y={445} value={String(Math.round(m))} unit="MIN" /* #1 #2 */ size={120} color={CREAM} />
          </g>
          <Tag x={1180} y={560} text="THE FAMOUS ANSWER" F={DUSK} dot={C.saffron} size={30} opacity={ez(f, c.famous - c.clock, c.famous - c.clock + 10)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-05 · "Wrong in the number": the 42 cracks; a jagged crack runs across the face; shards fall; Tick flinches.
// MOVER: crack head (40 px/f) + shards falling.
// ================================================================================================================
const CRACK: [number, number][] = [
  [-300, -60], [-210, -20], [-160, -90], [-70, -30], [-20, 40], [60, -10], [130, 60], [200, 10], [300, 80],
];
const ShotCrack: ShotFC<CCold> = ({ f, len }) => {
  const prog = Math.max(0, f - 4) * 40; // px of crack drawn
  let acc = 0;
  const pts: string[] = [];
  for (let i = 0; i < CRACK.length; i++) {
    const [x, y] = CRACK[i];
    if (i === 0) {
      pts.push(`M${CLK.x + x} ${CLK.y + y}`);
      continue;
    }
    const [px, py] = CRACK[i - 1];
    const seg = Math.hypot(x - px, y - py);
    if (acc + seg <= prog) {
      pts.push(`L${CLK.x + x} ${CLK.y + y}`);
      acc += seg;
    } else {
      const u = Math.max(0, (prog - acc) / seg);
      pts.push(`L${CLK.x + px + (x - px) * u} ${CLK.y + py + (y - py) * u}`);
      break;
    }
  }
  const crackDone = prog > 700;
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} cam={{ x: 860 - f * 0.6, y: 520, zoom: 1.12 + f * 0.003 }} vignette={0.25} grain={0.5}>
        <Layer depth={0.1}>
          <Sky family={DUSK} />
          <Stars frame={f} n={60} w={1920} h={600} color={DUSK.text} seed={9} size={2} />
        </Layer>
        <Layer depth={0.3}>
          <CloudRack f={f + 120} n={4} x0={-700} x1={2700} y0={760} y1={1000} size={110} speed={3} body={alpha("#E3813F", 0.7)} under={alpha("#082028", 0.5)} seed={17} flat={1.4} />
        </Layer>
        <Layer depth={1}>
          <ClockFace x={CLK.x} y={CLK.y} r={CLK.r} minutes={42} ring={0.7} family={DUSK} f={f} shake={crackDone ? 0 : 4} />
          <text x={CLK.x} y={CLK.y + 70} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 200, fill: alpha(INK, 0.85) }}>
            42
          </text>
          <path d={pts.join(" ")} stroke={INK} strokeWidth={14} fill="none" strokeLinejoin="miter" />
          <path d={pts.join(" ")} stroke={C.saffron} strokeWidth={4} fill="none" strokeLinejoin="miter" />
          {Array.from({ length: 9 }, (_, i) => {
            const t0 = 10 + i * 4;
            if (f < t0) return null;
            const tau = f - t0;
            const x = CLK.x - 240 + i * 60 + Math.sin(i * 3) * 20;
            const y = CLK.y + 20 + tau * 8 + tau * tau * 0.25;
            const s = 18 + rnd(i) * 22;
            return <path key={i} d={`M${x} ${y} l ${s} ${s * 0.3} l ${-s * 0.4} ${s} Z`} fill={i % 2 ? CREAM : C.saffron} stroke={INK} strokeWidth={3} transform={`rotate(${tau * (6 + i)} ${x} ${y})`} />;
          })}
          <Tick x={1260} y={1010} pxPerM={120} frame={f} facing={-1} pose="shield" expression="surprised" look={0.6} squash={impact(f, 6, 0.12, 10)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-06 · "wrong in the ending": the dotted line's far end flickers out, the exit becomes the vermilion "?" tag.
// MOVER: the line retracting from the far side (≈ 14 px/f) + the push in + the "?" popping in.
// ================================================================================================================
const ShotEnding: ShotFC<CCold> = ({ f, len }) => {
  const to = 1 - 1.3 * ez(f, 2, len - 4);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.0 },
    { f: len + 10, x: 820, y: 720, zoom: 1.3 },
  ]);
  const pop = ez(f, len * 0.55, len * 0.55 + 8);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <VoidField f={f + 60} {...GLOBE} seed={3} />
        </Layer>
        <Layer depth={1}>
          <CutGlobe {...GLOBE} f={f + 60} family={VOID} rot={(f + 60) * 0.8} line={{ to }} />
          {pop > 0 ? (
            <g transform={`translate(${GLOBE.cx} ${GLOBE.cy + GLOBE.R + 10}) scale(${(0.4 + 0.6 * pop) * (1 + 0.15 * Math.sin(f / 3) * pop)})`}>
              <Bloom x={0} y={0} r={130} color={C.vermilion} core={0} strength={0.6} />
              <UnknownTag x={0} y={0} size={58} />
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-07 + C-08 · Tick lets the probe go into the hatch; the four gauges fade up at right, every needle off zero; the
// camera follows the probe down and rides beside it through the strata ("layer by layer").
// MOVER: the probe falling (24 px/f), then the strata streaming up (18 px/f) + the four needles sweeping.
// ================================================================================================================
const RIDE = { x: 700, ground: 820 };
const ShotRide: ShotFC<CCold> = ({ f, len, c }) => {
  const rel = Math.round((c.gauges - c.send) * 0.35);
  const y0 = RIDE.ground - 150; // in Tick's hands
  const worldY = y0 + fallDist(f - rel, 0.9, 20);
  const HOLD = 520;
  const scroll = Math.max(0, worldY - HOLD);
  const py = worldY - scroll;
  const g0 = c.gauges - c.send;
  const lay = c.layer - c.send;
  const ap = (i: number) => ez(f, g0 + i * 9, g0 + i * 9 + 14);
  const v = (a: number, b: number) => a + (b - a) * ez(f, g0, len);
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} cam={{ x: 900, y: 540, zoom: 1.04 + 0.04 * ez(f, 0, len) }} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <rect x={-200} y={-200} width={2400} height={1500} fill={DUSK.shadow} />
          <StrataWall f={f} family={DUSK} layers={RIDE_STRATA} depth={0} pxPerKm={1} anchorY={RIDE.ground} scroll={scroll} cx={RIDE.x} gap={240} x0={-200} x1={1460} ruler={1420} lamp={scroll > 0 ? { y: py } : null} hatch="taffy" />
          <Desert f={f} ground={RIDE.ground} deep={false} wind={9} dy={scroll} seed={4}>
            <HatchLid x={RIDE.x} y={RIDE.ground - 6} r={92} open={1} family={DUSK} f={f} />
            <GroundShadow x={470} y={RIDE.ground + 4} rx={70} color={DUSK.shadow} opacity={0.5} blur={8} />
            <Tick x={470} y={RIDE.ground} pxPerM={150} frame={f} facing={1} pose={f < rel ? "hold" : "point"} expression="determined" look={f < rel + 20 ? 0.5 : 1} />
          </Desert>
          <Probe x={RIDE.x + (f < rel ? -150 + ez(f, 0, rel) * 150 : 0)} y={py} size={130} f={f} lamp={f >= rel} />
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, lay, lay + 12)}>
            <rect x={90} y={96} width={520} height={56} rx={28} fill={pillFill(DUSK)} />
            <Kicker x={120} y={134} text="LAYER BY LAYER" color={DUSK.text} size={28} />
          </g>
          <L14Gauges
            family={DUSK}
            frame={f}
            theme="light"
            speed={{ value: v(0.05, 0.7), stop: STOP.speed /* #2 */, appear: ap(0) }}
            heat={{ value: v(0.05, 0.55), appear: ap(1) }}
            pressure={{ value: v(0.05, 0.6), appear: ap(2) }}
            pull={{ value: v(0.15, 0.6), appear: ap(3) }}
          />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-09 · "Every gauge will run off its scale": the four needles race to their stops, slam, bend and quiver; chevrons;
// Tick stares up at the stack. MOVER: needles rolling then rattling + the push to the cluster + the cirrus rack 3 px/f.
// ================================================================================================================
const ShotScale: ShotFC<CCold> = ({ f, len }) => {
  const k = ez(f, 0, 26);
  const pin = f > 26;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 20, x: 1220, y: 470, zoom: 1.22 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} cam={cam} vignette={0.25} grain={0.5}>
        <Layer depth={0.3}>
          <Sky family={DUSK} y={-300} h={1700} />
          <Stars frame={f} n={70} w={1920} h={700} color={DUSK.text} seed={21} size={2.2} />
          <CloudRack f={f} n={5} x0={-700} x1={2700} y0={180} y1={700} size={100} speed={3.4} body={alpha("#F3A35C", 0.7)} under={alpha("#7A3A20", 0.5)} top={alpha("#FFE0A8", 0.6)} seed={23} flat={1.5} />
        </Layer>
        <Layer depth={0.7}>
          <Desert f={f + 300} ground={900} wind={12} seed={7} />
        </Layer>
        <Layer depth={1}>
          <Tick x={560} y={1000} pxPerM={250} frame={f} facing={1} pose="lean" expression="surprised" look={1} headTilt={-14} squash={impact(f, 28, 0.1, 10)} />
          <g transform="translate(980 40) scale(1.25)">
            <L14Gauges
              family={DUSK}
              frame={f}
              theme="light"
              x={0}
              y={0}
              rattle={pin ? 0.8 : 0.2}
              speed={{ value: 0.4 + 0.7 * k, stop: STOP.speed /* #2 */, pinned: pin }}
              heat={{ value: 0.35 + 0.75 * k, pinned: pin }}
              pressure={{ value: 0.4 + 0.7 * k, pinned: pin }}
            />
          </g>
          <g transform="translate(1440 40) scale(1.25)">
            <L14Gauges family={DUSK} frame={f + 7} theme="light" x={0} y={-470} rattle={pin ? 0.8 : 0.2} pull={{ value: 0.4 + 0.7 * k, pinned: pin }} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-10 · ChapterCard 1 on the dusk card field; strata rings rise behind the type; at the end the camera zooms into the
// ring centre (ZT → the spring room). MOVER: rings launched every 40 f at 4.4 px/f + the final zoom.
// ================================================================================================================
const ShotCard: ShotFC<CCold> = ({ f, len }) => {
  const z = ez(f, len - 16, len);
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + 2.2 * z * z})`, transformOrigin: "1640px 900px" }}>
      <L14Card
        family={DUSK}
        kicker="OFF THE SCALE · THE EARTH"
        title="What If You Fell Through the Earth?"
        t={Math.min(0.84, f / len)}
        frame={f + 120}
        behind={(fr) => (
          <g>
            <LayerRingsLocal f={fr} />
          </g>
        )}
      />
    </AbsoluteFill>
  );
};
/** The card's rings, a little faster and thicker than the default so their edges cross ≥ 1.5 px/f at phone size. */
const LayerRingsLocal: React.FC<{ f: number }> = ({ f }) => {
  const every = 30;
  const speed = 7;
  const maxR = 2100;
  const cols = [C.crust, C.mantle, C.outer, C.inner];
  const k0 = Math.floor(f / every);
  return (
    <g>
      {Array.from({ length: Math.ceil(maxR / speed / every) + 1 }, (_, i) => {
        const k = k0 - i;
        const r = (f - k * every) * speed;
        if (r <= 0 || r > maxR) return null;
        return <circle key={k} cx={1640} cy={900} r={r} fill="none" stroke={cols[((k % 4) + 4) % 4]} strokeWidth={60} opacity={0.85 * Math.min(1, r / 60) * (1 - Math.max(0, (r - maxR * 0.7) / (maxR * 0.3)))} />;
      })}
      <circle cx={1640} cy={900} r={40} fill={C.innerCore} />
    </g>
  );
};

// ================================================================================================================

export const SceneCold: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCold(t);
  const shots: ShotDef<CCold>[] = [
    { from: 0, S: ShotDesert, id: "C-01" }, // + C-02
    { from: c.disc, S: ShotDisc, id: "C-03" },
    { from: c.clock, S: ShotClock, id: "C-04" },
    { from: c.crack, S: ShotCrack, id: "C-05" },
    { from: c.ending, S: ShotEnding, id: "C-06" },
    { from: c.send, S: ShotRide, id: "C-07" }, // + C-08
    { from: c.scale, S: ShotScale, id: "C-09" },
    { from: c.card, S: ShotCard, id: "C-10" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCold = (t: SceneTiming): Cue[] => {
  const c = cuesCold(t);
  return [
    { at: 0, file: SFX.wind, vol: 0.18, dur: c.disc + 10, fadeIn: 20, fadeOut: 20 },
    { at: c.kick + 4, file: SFX.popLong, vol: 0.2, dur: 30 },
    { at: c.kick + 10, file: SFX.whoosh, vol: 0.22, dur: 40 },
    ...cutHit(c.disc),
    { at: c.disc, file: SFX.riser, vol: 0.14, dur: c.clock - c.disc, fadeIn: 6, fadeOut: 6 },
    ...cutHit(c.clock),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.clock + 4 + i * 6, file: SFX.click, vol: 0.08, dur: 8 })),
    { at: c.cross1, file: SFX.pop, vol: 0.24, dur: 20 },
    { at: c.cross2, file: SFX.pop, vol: 0.26, dur: 20 },
    ...cutHit(c.crack),
    { at: c.crack + 4, file: SFX.debris, vol: 0.16, dur: 60, fadeOut: 20 },
    ...cutHit(c.ending),
    { at: c.ending + 22, file: SFX.pop, vol: 0.18, dur: 20 },
    ...cutHit(c.send),
    { at: c.gauges, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...[0, 9, 18, 27].map((o) => ({ at: c.gauges + o + 6, file: SFX.click, vol: 0.1, dur: 10 })),
    { at: c.layer - 10, file: SFX.rumble, vol: 0.2, dur: c.scale - c.layer + 20, fadeIn: 14, fadeOut: 10 },
    ...cutHit(c.scale),
    { at: c.scale + 26, file: SFX.boom, vol: 0.32, dur: 90, fadeOut: 30 },
    { at: c.card, file: SFX.boom, vol: 0.22, dur: 90, fadeOut: 30 },
    { at: c.end - 16, file: SFX.deepWhoosh, vol: 0.2, dur: 40 },
  ];
};
