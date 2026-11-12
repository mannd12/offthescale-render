// L13 scene "closer" (storyboard §3 "Closer": shots Z-01…Z-17 + the end card E-01; script lines 68-74 = scene lines
// 0-6; families STUDIO_SET plates → dusk morning Batavia → void globe → dusk Rodriguez → end card on the dusk dark
// field; Act III). Package III builder.
// Every number drawn carries its sources.md row in a comment. F3: Krakatoa's readout is always the vermilion "?"; 172
// and 150 appear only dashed with "?" as readings of one gauge; in Z-14 the gauge shows only the ceiling, labelled as the
// air's ceiling, never as the eruption's value. F4: 203 only on the gold POWER meter. F7: Batavia's spikes carry the
// table's relative heights, no unit; the row is quoted as printed. Order note: Z-06 (the squint) plays before Z-05 (the
// mercury column) so the column fills on "Read its jump as inches of mercury".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Bloom,
  CloudRack,
  CycClouds,
  EndCard,
  Family,
  GroundShadow,
  IF2,
  Layer,
  LightWash,
  Metric,
  Motes,
  Pill,
  Puffs,
  Ripples,
  STUDIO_SET,
  Sky,
  Stage,
  Stars,
  Streamers,
  Tick,
  ZoomThrough,
  alpha,
  cameraAt,
  cutPop,
  lane,
  mixHex,
  rnd,
  seaSurface,
} from "../../../lib/illustrated";
import type { CamKey } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L13_COLORS, familyOf, pillFill } from "../families";
import { DB, L13Gauge } from "../L13Gauge";
import { POWER, PowerMeter } from "../PowerMeter";
import { GasHolder, Jetty, Notebook, Palm, SitePin } from "../props";
import { Barograph, GlobeL13, GlobeRing, Rings, SITES, ShockFront, Strip, bataviaSpikes, globePoint, passageBlips } from "../sound";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";

/** Frames after the last line for the 20-s end card (EndCard from the kit). */
export const closerTail = 600;

const S = STUDIO_SET;
const DUSK = familyOf("dusk");
const VOID = familyOf("void");
/** STUDIO_SET for the gauge: a dark petrol plate with light type on the teal cyc (the gauge has no light/dark option). */
const GS: Family = { ...S, text: "#FFF4DE", theme: { ...S.theme, bg: "#1E4A5C", panel: "#2C6A74", line: "#FFF4DE", text: "#FFF4DE", dim: "#D9F1E7", dark: true } };
/** the end card's dark dusk field */
const CARD: Family = { ...DUSK, sky: ["#071C24", "#0F3B4F", "#2A4A5A", "#3A5260"] };
const SAF = L13_COLORS.saffron;
const TEAL = L13_COLORS.teal;
const BONE = L13_COLORS.bone;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number, a = 0, b = 1) => {
  const u = clamp01((t - a) / (b - a));
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const cam = (f: number, keys: CamKey[]) => {
  const c = cameraAt(f, keys);
  return { ...c, zoom: c.zoom * cutPop(f, 0) };
};
/** a drop with two bounces (0..1 → 0..1) */
const bounce = (u: number) => {
  const x = clamp01(u);
  if (x < 0.6) return (x / 0.6) * (x / 0.6);
  if (x < 0.85) return 1 - 0.12 * Math.sin(((x - 0.6) / 0.25) * Math.PI);
  return 1 - 0.03 * Math.sin(((x - 0.85) / 0.15) * Math.PI);
};

/** A tag that keeps its text's case (dB, mm, in, h). */
const Tag: React.FC<{ x: number; y: number; text: string; F: Family; dot?: string; size?: number; align?: "start" | "end" | "middle"; color?: string }> = ({ x, y, text, F, dot, size = 24, align = "start", color }) => {
  const w = text.length * size * 0.6 + size * (dot ? 2.3 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={pillFill(F)} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.1, fill: color ?? F.text }}>
        {text}
      </text>
    </g>
  );
};

export const cuesCloser = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    plate1: 0, // Z-01 plate one drops
    knob: p(0, "change the pressure"), // Z-02 the ceiling slides down
    plate2: at(1), // Z-03 plate two: the POWER meter
    batavia: at(2), // Z-04 the Batavia strip
    squint: p(2, "that one gasworks"), // Z-06 Tick squints at the page
    mercury: p(2, "Read its jump"), // Z-05 the mercury column
    water: at(3), // Z-07 the water column
    seesaw: p(3, "The report prints"), // Z-08 63 mm vs 0.37 in
    noDb: p(3, "So we won't give you a decibel"), // Z-09 the "?" gauge
    jumps: at(4), // Z-10 the strip draws its nine spikes again
    blips: p(4, "and every barometer"), // Z-11 the globe and seven blips; ZT into Rodriguez
    island: at(5), // Z-12 Rodriguez, afternoon
    wrote: p(5, "He wrote"), // Z-13 the underline
    arc: p(5, "The air has a loudest"), // Z-14 the arc and the ceiling
    wall: p(6, "They become a wall"), // Z-15 the wall
    swell: p(6, "then a slow swell"), // Z-16 the globe ring
    chart: p(6, "then a line on a chart"), // Z-17 the pen by the window → DIS end card
    last: end(6),
    card: t.frames, // E-01
    end: t.frames + closerTail,
  };
};
export type CCloser = ReturnType<typeof cuesCloser>;

// ---- STUDIO_SET plates (Z-01 to Z-03) -------------------------------------------------------------------------
const Cyc: React.FC<{ f: number; seed?: number }> = ({ f, seed = 1 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={S} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f} y={70} n={5} seed={seed} />
    </Layer>
    <Layer depth={1}>
      <path d="M-600 860 Q 960 830 2600 860 V 1500 H -600 Z" fill={S.mid} />
    </Layer>
  </>
);
const Plate: React.FC<{ x: number; y: number; w: number; lines: [string, string]; tilt?: number }> = ({ x, y, w, lines, tilt = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt.toFixed(2)})`}>
    <rect x={-w / 2 + 10} y={-110 + 16} width={w} height={220} rx={24} fill={alpha("#000", 0.25)} />
    <rect x={-w / 2} y={-110} width={w} height={220} rx={24} fill="#1E4A5C" stroke={SAF} strokeWidth={7} />
    <text x={0} y={-12} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 92, fill: "#FFF4DE" }}>
      {lines[0]}
    </text>
    <text x={0} y={62} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 34, letterSpacing: 4, fill: L13_COLORS.saffronCore }}>
      {lines[1]}
    </text>
  </g>
);

// Z-01 · quiet: the first plate drops onto the floor (impact ring, dust)
const ShotPlate1: ShotFC<CCloser> = ({ f, len }) => {
  const land = 18;
  const y = lerp(-300, 700, bounce(f / (land / 0.6)));
  return (
    <Stage theme={S.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 560, zoom: 1.05 }])} vignette={0.14} grain={0.5}>
      <Cyc f={f} seed={3} />
      <Layer depth={1}>
        <GroundShadow x={960} y={830} rx={lerp(200, 520, sm(f, 0, land))} ry={24} />
        {f >= land ? <Rings f={f} cx={960} cy={830} period={26} speed={14} maxR={1500} width={7} squash={0.14} color={SAF} core={L13_COLORS.saffronCore} start={land} /> : null}
        {f >= land ? <Puffs frame={f - land} x={960} y={820} color={alpha("#FFF4DE", 0.8)} period={4} size={40} rise={1.6} drift={3} life={40} seed={3} /> : null}
        <Plate x={960} y={y} w={1300} lines={["194" /* #11 */, "A CLEAN WAVE AT SEA LEVEL" /* #11 */]} />
      </Layer>
    </Stage>
  );
};

// Z-02 · "change the pressure and the ceiling moves": a pressure knob turns; on a small gauge the ceiling slides
const ShotKnob: ShotFC<CCloser> = ({ f, len }) => {
  const k = 0.5 - 0.5 * Math.cos(f / 22);
  const ceil = DB.ceiling - 34 * k; // the line slides ~100 px (no number while it moves: F1-style, unlabelled)
  const ang = -120 + 240 * k;
  return (
    <Stage theme={S.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 980, y: 540, zoom: 1.04 }])} vignette={0.14} grain={0.5}>
      <Cyc f={f + 200} seed={5} />
      <Layer depth={1}>
        <Plate x={760} y={930} w={900} lines={["194", "A CLEAN WAVE AT SEA LEVEL"]} tilt={-2} />
        {/* the knob */}
        <g transform="translate(620 470)">
          <circle r={230} fill="#13343E" />
          <circle r={200} fill="#2C6A74" stroke="#FFF4DE" strokeWidth={6} />
          {Array.from({ length: 13 }, (_, i) => {
            const a = ((-120 + i * 20 - 90) * Math.PI) / 180;
            return <line key={i} x1={Math.cos(a) * 210} y1={Math.sin(a) * 210} x2={Math.cos(a) * 228} y2={Math.sin(a) * 228} stroke="#FFF4DE" strokeWidth={5} />;
          })}
          <g transform={`rotate(${ang.toFixed(2)})`}>
            <rect x={-26} y={-190} width={52} height={150} rx={16} fill={SAF} />
            <circle r={60} fill="#1E4A5C" stroke={SAF} strokeWidth={8} />
          </g>
          <text x={0} y={300} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 5, fill: "#13343E" }}>
            PRESSURE
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        <L13Gauge family={GS} value={0} fill={false} readout={false} frame={f} x={1400} y={170} height={600} ceiling={{ v: ceil }} />
        <Pill x={120} y={130} text="LESS PRESSURE → LOWER CEILING" /* #11 #8 */ fill={pillFill(S)} color="#FFF4DE" dot={SAF} size={24} />
      </Layer>
    </Stage>
  );
};

// Z-03 · plate two lands with the gold POWER meter on it; Tick swaps the POWER / PRESSURE labels into place
const ShotPlate2: ShotFC<CCloser> = ({ f, len }) => {
  const land = 14;
  const y = lerp(-400, 0, bounce(f / (land / 0.6)));
  const sw = sm(f, 26, 60);
  // the two labels trade places along arcs (they start on the wrong slots)
  const slotA = { x: 760, y: 300 };
  const slotB = { x: 1360, y: 300 };
  const pa = { x: lerp(slotB.x, slotA.x, sw), y: lerp(slotB.y, slotA.y, sw) - Math.sin(sw * Math.PI) * 140 };
  const pb = { x: lerp(slotA.x, slotB.x, sw), y: lerp(slotA.y, slotB.y, sw) + Math.sin(sw * Math.PI) * 140 };
  return (
    <Stage theme={S.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 540, zoom: 1.04 }])} vignette={0.14} grain={0.5}>
      <Cyc f={f + 400} seed={7} />
      <Layer depth={1}>
        <g transform={`translate(0 ${y.toFixed(1)})`}>
          <rect x={460} y={420} width={1100} height={430} rx={30} fill="#1E4A5C" stroke={SAF} strokeWidth={7} />
          <PowerMeter x={760} y={600} r={130} value={POWER.saturnV /* #14 */} family={GS} frame={f} readout="203 dB" /* #14 · F4: power, on the gold meter only */ />
          {/* a small pressure dial on the right half: a different instrument */}
          <circle cx={1360} cy={620} r={110} fill="#FFF4DE" stroke="#13343E" strokeWidth={8} />
          <line x1={1360} y1={620} x2={1360 + Math.cos(f / 10) * 80} y2={620 + Math.sin(f / 10) * 80} stroke={L13_COLORS.vermilion} strokeWidth={8} strokeLinecap="round" />
          <text x={1010} y={810} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 34, letterSpacing: 4, fill: L13_COLORS.saffronCore }}>
            POWER ≠ PRESSURE
          </text>
        </g>
        {f >= land ? <Rings f={f} cx={760} cy={600} period={22} speed={9} maxR={1100} width={5} color={L13_COLORS.gold} start={land} /> : null}
        <Tag x={pa.x} y={pa.y} text="POWER" F={GS} dot={L13_COLORS.gold} size={30} align="middle" />
        <Tag x={pb.x} y={pb.y} text="PRESSURE" F={GS} dot={L13_COLORS.vermilion} size={30} align="middle" />
        <GroundShadow x={1700} y={990} rx={130} ry={14} />
        <Tick x={1700} y={990} pxPerM={300} frame={f} facing={-1} pose="point" poseTo="cheer" poseT={sm(f, 56, 70) * 1.1} expression="determined" expressionTo="proud" expressionT={sm(f, 56, 66)} look={0.4} />
      </Layer>
    </Stage>
  );
};

// ---- dusk morning, Batavia (Z-04 to Z-10) --------------------------------------------------------------------
const Batavia: React.FC<{ f: number; seed?: number }> = ({ f, seed = 1 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={DUSK} />
      <Bloom x={1600} y={640} r={520} color={DUSK.light} core={40} coreColor="#FFEFC0" strength={0.8} />
    </Layer>
    <Layer depth={0.3}>
      <rect x={1180} y={360} width={70} height={420} fill="#2A3E46" />
      <CloudRack f={f} n={4} x0={1000} x1={2600} y0={180} y1={360} size={90} speed={2.6} body={alpha("#E8C8B0", 0.75)} under={alpha("#8A5A5A", 0.6)} seed={seed} dir={1} />
      <GasHolder x={500} y={800} w={420} h={300} family={DUSK} fill={0.75} />
    </Layer>
    <Layer depth={1}>
      <rect x={-400} y={790} width={2800} height={700} fill={DUSK.near} />
    </Layer>
  </>
);

// Z-04 · the strip with the nine spikes, creeping (2 px/f); the tallest ringed; the table row beside it
const ShotBatavia: ShotFC<CCloser> = ({ f, len }) => {
  const sf = f + 620;
  const spikes = bataviaSpikes(40, 30); // #5 · F7
  const sx = 140;
  const sw = 1640;
  const penX = sx + sw * 0.78;
  const tall = penX - (sf - spikes[7].at) * 2;
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 560, zoom: 1.05 }])} vignette={0.2} grain={0.5}>
      <Batavia f={f} seed={3} />
      <Layer depth={1}>
        <Strip f={sf} x={sx} y={560} w={sw} h={300} speed={2} spikes={spikes} scale={230} paper={mixHex("#F7EBCF", DUSK.light, 0.2)} />
        <circle cx={tall} cy={560 + 300 * 0.66 - 230} r={36} fill="none" stroke={SAF} strokeWidth={5} opacity={0.6 + 0.4 * Math.sin(f / 4)} />
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={20} x={100} y={100} w={1700} h={800} color={DUSK.light} seed={5} size={5} />
      </Layer>
      <Layer depth={0}>
        <Tag x={120} y={130} text="10 h 15 m · 63 (0.37)" /* #5 · F7: as printed */ F={DUSK} dot={SAF} size={30} />
      </Layer>
    </Stage>
  );
};

// Z-06 · Tick squints at the report's page through a magnifier; the unit is a smudge
const ShotSquint: ShotFC<CCloser> = ({ f, len }) => {
  const mx = 980 + Math.sin(f / 9) * 130;
  const my = 520 + Math.cos(f / 13) * 30;
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 990, y: 540, zoom: 1.06 }])} vignette={0.2} grain={0.5}>
      <Layer depth={0.05}>
        <Sky stops={[mixHex(DUSK.sky[1], "#3A2440", 0.3), DUSK.sky[2]]} />
        <LightWash x={1500} y={300} rx={900} ry={500} color={DUSK.light} strength={0.4} />
      </Layer>
      <Layer depth={1}>
        <g transform="rotate(-3 1000 560)">
          <rect x={560} y={240} width={900} height={640} rx={8} fill="#F7EBCF" stroke="#C9A97A" strokeWidth={4} />
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <rect x={600} y={290 + i * 64} width={180} height={16} rx={6} fill="#8A6A4A" opacity={0.5} />
              <rect x={820} y={290 + i * 64} width={120} height={16} rx={6} fill="#8A6A4A" opacity={0.5} />
              <rect x={980} y={290 + i * 64} width={i === 7 ? 0 : 90} height={16} rx={6} fill="#8A6A4A" opacity={0.5} />
            </g>
          ))}
          {/* row 8: the jump and its unit, smudged */}
          <ellipse cx={1040} cy={738} rx={90} ry={26} fill="#8A6A4A" opacity={0.45} />
          <ellipse cx={1060} cy={742} rx={50} ry={18} fill="#6A4A3A" opacity={0.4} />
        </g>
        {/* the magnifier */}
        <g transform={`translate(${mx.toFixed(1)} ${(my + 180).toFixed(1)})`}>
          <line x1={90} y1={90} x2={220} y2={220} stroke="#6A4026" strokeWidth={30} strokeLinecap="round" />
          <circle r={130} fill={alpha("#DFF4F0", 0.35)} stroke="#2A3E46" strokeWidth={16} />
          <path d="M-70 -70 A100 100 0 0 1 40 -100" stroke="#FFFFFF" strokeWidth={8} fill="none" opacity={0.7} />
        </g>
        <GroundShadow x={330} y={1000} rx={140} ry={16} />
        <Tick x={330} y={1000} pxPerM={420} frame={f} facing={1} pose="lean" expression="thinking" look={0.6} headTilt={8 + Math.sin(f / 10) * 4} />
      </Layer>
    </Stage>
  );
};

/** a glass column filling (mercury or water) with a dashed reading line at its top */
const Column: React.FC<{ x: number; base: number; h: number; fill: number; liquid: string; shine: string; f: number; ripple?: boolean }> = ({ x, base, h, fill, liquid, shine, f, ripple }) => {
  const top = base - h * fill;
  return (
    <g>
      <rect x={x - 70} y={base - h - 30} width={140} height={h + 60} rx={70} fill={alpha("#DFF4F0", 0.28)} stroke="#FFF4DE" strokeWidth={6} />
      <rect x={x - 52} y={top} width={104} height={base - top + 10} rx={20} fill={liquid} />
      <rect x={x - 36} y={top + 10} width={18} height={Math.max(0, base - top - 10)} rx={9} fill={shine} opacity={0.6} />
      {ripple && fill > 0.05 ? <Ripples frame={f} cx={x} cy={top + 6} rx={140} ry={20} period={10} count={4} color="#E6F5EA" width={4} /> : null}
      <rect x={x - 110} y={base + 10} width={220} height={40} rx={10} fill="#6A4026" />
    </g>
  );
};

// Z-05 · "inches of mercury": a mercury column fills to the spike's height (0 → 500 px); a dashed "172 ?" appears
const ShotMercury: ShotFC<CCloser> = ({ f, len }) => {
  const fill = sm(f, 4, Math.max(30, len - 22));
  const base = 900;
  const top = base - 520 * fill;
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len, x: 960, y: 520, zoom: 1.05 }])} vignette={0.2} grain={0.5}>
      <Batavia f={f + 300} seed={5} />
      <Layer depth={1}>
        <Column x={960} base={base} h={540} fill={fill * (520 / 540)} liquid="#B8C6D2" shine="#FFFFFF" f={f} />
        <line x1={760} y1={top} x2={1160} y2={top} stroke={SAF} strokeWidth={5} strokeDasharray="14 10" />
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={18} x={100} y={100} w={1700} h={800} color={DUSK.light} seed={7} size={5} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, len - 22, len - 12)}>
          <Metric x={1220} y={top + 30} value="172 ?" /* #23 · F3: one reading of the gauge, dashed */ size={96} color={DUSK.text} />
        </g>
        <Pill x={120} y={130} text="READ AS MERCURY" /* #23 */ fill={pillFill(DUSK)} color={DUSK.text} dot={SAF} size={26} />
      </Layer>
    </Stage>
  );
};

// Z-07 · "read it as water": a water column fills with ripples on top; a dashed "150 ?"
const ShotWater: ShotFC<CCloser> = ({ f, len }) => {
  const fill = sm(f, 4, Math.max(30, len - 22));
  const base = 920;
  const top = base - 640 * fill;
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len, x: 960, y: 500, zoom: 1.05 }])} vignette={0.2} grain={0.5}>
      <Batavia f={f + 500} seed={7} />
      <Layer depth={1}>
        <Column x={960} base={base} h={660} fill={fill * (640 / 660)} liquid="#2E9BC2" shine="#BFF2F0" f={f} ripple />
        <line x1={760} y1={top} x2={1160} y2={top} stroke={SAF} strokeWidth={5} strokeDasharray="14 10" />
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={18} x={100} y={100} w={1700} h={800} color={DUSK.light} seed={9} size={5} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, len - 22, len - 12)}>
          <Metric x={1220} y={top + 30} value="150 ?" /* #23 · F3 */ size={96} color={DUSK.text} />
        </g>
        <Pill x={120} y={130} text="READ AS WATER" /* #23 */ fill={pillFill(DUSK)} color={DUSK.text} dot={TEAL} size={26} />
      </Layer>
    </Stage>
  );
};

// Z-08 · the table's two printings sit on a seesaw that will not balance (±15°)
const ShotSeesaw: ShotFC<CCloser> = ({ f, len }) => {
  const a = 15 * Math.sin(f / 11) + 3 * Math.sin(f / 4.3);
  const r = (a * Math.PI) / 180;
  const px = 960;
  const py = 700;
  const arm = 560;
  const L = { x: px - Math.cos(r) * arm, y: py - Math.sin(r) * arm };
  const R = { x: px + Math.cos(r) * arm, y: py + Math.sin(r) * arm };
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 560, zoom: 1.04 }])} vignette={0.2} grain={0.5}>
      <Batavia f={f + 700} seed={9} />
      <Layer depth={1}>
        <path d={`M${px} ${py} L${px - 90} 880 L${px + 90} 880 Z`} fill="#6A4026" />
        <line x1={L.x} y1={L.y} x2={R.x} y2={R.y} stroke="#C98A4E" strokeWidth={26} strokeLinecap="round" />
        <circle cx={px} cy={py} r={20} fill="#2A3E46" />
        <g transform={`translate(${L.x} ${L.y - 60}) rotate(${a.toFixed(2)})`}>
          <rect x={-150} y={-60} width={300} height={120} rx={18} fill="#F7EBCF" stroke="#8A6A4A" strokeWidth={5} />
          <text x={0} y={22} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 64, fill: "#2A1E0A" }}>
            63 mm
          </text>
        </g>
        <g transform={`translate(${R.x} ${R.y - 60}) rotate(${a.toFixed(2)})`}>
          <rect x={-150} y={-60} width={300} height={120} rx={18} fill="#F7EBCF" stroke="#8A6A4A" strokeWidth={5} />
          <text x={0} y={22} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 64, fill: "#2A1E0A" }}>
            0.37 in
          </text>
        </g>
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={18} x={100} y={100} w={1700} h={800} color={DUSK.light} seed={11} size={5} />
      </Layer>
      <Layer depth={0}>
        <Tag x={120} y={130} text="63 mm · 0.37 in · AS PRINTED" /* #5 #23 */ F={DUSK} dot={SAF} size={26} />
      </Layer>
    </Stage>
  );
};

// Z-09 · the dB gauge: Krakatoa's readout is the vermilion "?"; Tick lowers the 172 and 150 placards and sets them down
const Placard: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <g transform={`translate(${x} ${y})`}>
    <line x1={0} y1={60} x2={0} y2={220} stroke="#6A4026" strokeWidth={10} />
    <rect x={-130} y={-60} width={260} height={120} rx={14} fill={alpha(DUSK.shadow, 0.85)} stroke={DUSK.text} strokeWidth={4} strokeDasharray="12 8" />
    <text x={0} y={24} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 66, fill: DUSK.text }}>
      {text}
    </text>
  </g>
);
const ShotNoDb: ShotFC<CCloser> = ({ f, len }) => {
  const down = sm(f, 6, Math.max(30, len - 20));
  const py = lerp(330, 760, down);
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 940, y: 540, zoom: 1.05 }])} vignette={0.2} grain={0.5}>
      <Batavia f={f + 900} seed={11} />
      <Layer depth={1}>
        <Placard x={520} y={py} text="172 ?" /* #23 · F3 */ />
        <Placard x={1060} y={py + 30} text="150 ?" /* #23 · F3 */ />
        <GroundShadow x={790} y={1000} rx={140} ry={16} />
        <Tick x={790} y={1000} pxPerM={300} frame={f} facing={1} pose="carry" poseTo="crouch" poseT={down * 1.1} expression="determined" look={0.3} />
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={18} x={100} y={100} w={1700} h={800} color={DUSK.light} seed={13} size={5} />
      </Layer>
      <Layer depth={0}>
        <L13Gauge family={DUSK} value={0} unknown frame={f} x={1700} y={170} height={600} ceiling={{ v: DB.ceiling /* #11, unlabelled here (F3) */ }} />
        <circle cx={1700 - 118 - 48} cy={770} r={52 + 10 * Math.sin(f / 5)} fill="none" stroke={L13_COLORS.vermilion} strokeWidth={4} opacity={0.6} />
        <Tag x={120} y={130} text="NO dB FOR KRAKATOA" /* #23 · F3 */ F={DUSK} dot={L13_COLORS.vermilion} size={28} />
      </Layer>
    </Stage>
  );
};

// Z-10 · "what the instruments did": the Batavia strip draws its nine spikes again, fast; pull back
const ShotJumps: ShotFC<CCloser> = ({ f, len }) => {
  const spikes = bataviaSpikes(8, Math.max(4, (len - 30) / 18)); // #5 · F7
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 1200, y: 560, zoom: 1.3 }, { f: len, x: 960, y: 540, zoom: 1.0 }])} vignette={0.2} grain={0.5}>
      <Batavia f={f + 1100} seed={13} />
      <Layer depth={1}>
        <Barograph f={f} x={260} y={460} w={1400} h={320} speed={12} spikes={spikes} scale={240} family={DUSK} start={-400} />
      </Layer>
      <Layer depth={0}>
        <Metric x={120} y={200} value="9 jumps · ~140" unit="km" /* #5 */ size={88} color={DUSK.text} />
      </Layer>
    </Stage>
  );
};

// ---- the void globe (Z-11, Z-16) ------------------------------------------------------------------------------
const Space: React.FC<{ f: number; seed?: number }> = ({ f, seed = 3 }) => (
  <Layer depth={0.05}>
    <Sky family={VOID} />
    <Bloom x={300} y={260} r={1000} color={L13_COLORS.gold} strength={0.3} spread={0.45} />
    <Bloom x={1700} y={900} r={700} color={TEAL} strength={0.22} spread={0.45} />
    <Stars frame={f} n={110} w={1920} h={1080} color={VOID.text} seed={seed} size={2.2} twinkle={0.7} />
  </Layer>
);

// Z-11 · pull out to the globe with station strips fanned beside it, seven blips drawing in unison; ZT into Rodriguez
const BlipsBody: React.FC<{ f: number; len: number }> = ({ f, len }) => {
  const g = { cx: 620, cy: 560, R: 380, rot: SITES.rodriguez.lon + 30 - f * 0.25, tilt: 10 };
  const blips = passageBlips(10, Math.max(8, (len - 30) / 7)); // #6: seven passages (equal heights, schematic)
  const rp = globePoint(g, SITES.rodriguez.lon, SITES.rodriguez.lat);
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 1000, y: 540, zoom: 1.2 }, { f: len, x: 960, y: 540, zoom: 1.0 }])} vignette={0.2} grain={0.5}>
      <Space f={f} seed={5} />
      <Layer depth={1}>
        <GlobeL13 {...g} family={VOID} schematic={false}>
          <GlobeRing globe={g} d={(f * 0.03) % Math.PI} color={SAF} width={7} opacity={0.8} />
        </GlobeL13>
        {rp.z > 0 ? <SitePin x={rp.x} y={rp.y} kind="here" frame={f} size={12} /> : null}
        {Array.from({ length: 5 }, (_, i) => (
          <Strip key={i} f={f} x={1080} y={180 + i * 150} w={720} h={110} speed={10} spikes={blips} scale={70} penAt={0.85} paper={mixHex("#F7EBCF", L13_COLORS.gold, 0.15)} ink="#1E3A44" start={-300} />
        ))}
      </Layer>
      <Layer depth={0}>
        <Metric x={1080} y={150} value="7 blips" /* #6 */ size={80} color={VOID.text} />
      </Layer>
    </Stage>
  );
};

// ---- Rodriguez, afternoon (Z-12 to Z-15) ---------------------------------------------------------------------
const HORIZON = 600;
const JETTY_Y = 820;
const Island: React.FC<{ f: number; sway?: number; bend?: number; children?: React.ReactNode; fg?: boolean }> = ({ f, sway = 30, bend = 0, children, fg = true }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={DUSK} stops={["#2A6C80", "#5C9AA0", "#F0A050", "#F6C46A"]} />
    </Layer>
    <Layer depth={0.1}>
      <Bloom x={1620} y={420} r={460} color={DUSK.light} core={50} coreColor="#FFEFC0" strength={0.9} />
    </Layer>
    <Layer depth={0.25}>
      <CloudRack f={f} n={5} x0={-700} x1={2700} y0={140} y1={420} size={120} speed={2.6} body="#F6C49A" under="#C0704A" top="#FFE6C0" seed={13} />
    </Layer>
    <Layer depth={0.7}>
      <rect x={-1400} y={HORIZON} width={4800} height={1600} fill="#3E8C94" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={seaSurface(f + i * 30, -1400, 3400, HORIZON + 40 + i * 90, 6 + i * 4, 220 + i * 80, 3 + i * 1.4, 2400, 30)} fill={["#3A8290", "#2F7484", "#256678", "#1B586C"][i]} />
      ))}
      <LightWash x={1620} y={HORIZON + 80} rx={460} ry={120} color={DUSK.light} strength={0.5} />
    </Layer>
    <Layer depth={1}>
      <path d={`M-900 ${JETTY_Y + 40} Q -300 ${HORIZON - 120} 380 ${HORIZON - 10} Q 620 ${HORIZON + 40} 700 ${JETTY_Y + 40} Z`} fill={L13_COLORS.land} />
      <path d={`M-900 ${JETTY_Y + 40} Q -300 ${HORIZON - 150} 340 ${HORIZON - 30} Q 560 ${HORIZON + 10} 610 ${JETTY_Y + 40} Z`} fill="#2F6B52" />
      {[
        [80, 640, 260, 2],
        [260, 620, 290, 5],
        [-100, 610, 250, 7],
      ].map(([x, y, h, s]) => (
        <Palm key={s} x={x} y={y} h={h} f={f} sway={sway} period={60} bend={bend} seed={s} trunk="#6B4428" frond="#2F8F6E" frondDark="#1D5A4A" />
      ))}
      <Jetty x={560} y={JETTY_Y} w={720} family={DUSK} posts={7} postH={120} f={f} />
      {children}
    </Layer>
    {fg ? (
      <Layer depth={1.35}>
        <Palm x={1900} y={1260} h={860} f={f} sway={sway * 1.2} period={56} bend={bend} lean={-0.2} silhouette="#0A2730" seed={9} />
      </Layer>
    ) : null}
  </>
);

const IslandBody: React.FC<{ f: number; len: number }> = ({ f, len }) => (
  <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len, x: 920, y: 600, zoom: 1.12 }])} vignette={0.16} grain={0.5}>
    <Island f={f}>
      <GroundShadow x={900} y={JETTY_Y + 2} rx={90} ry={10} />
      <Tick x={900} y={JETTY_Y} pxPerM={170} frame={f} facing={1} pose="hold" expression="neutral" look={0.2} headTilt={8} />
      <Notebook x={985} y={JETTY_Y - 170} w={105} h={68} turn={((f % 40) / 40) * 1.2} f={f} tilt={-12} />
    </Island>
    <Layer depth={1.2}>
      <Streamers f={f} n={10} x0={-300} x1={2300} y0={260} y1={860} len={160} width={4} speed={9} color={alpha("#FFE9C8", 0.7)} opacity={0.4} seed={6} dir={-1} />
    </Layer>
  </Stage>
);

const ShotBlips: ShotFC<CCloser> = ({ f, len }) => {
  const zt = clamp01((f - (len - 22)) / 22);
  const body = <BlipsBody f={f} len={len} />;
  if (zt <= 0) return body;
  const g = { cx: 620, cy: 560, R: 380, rot: SITES.rodriguez.lon + 30 - len * 0.25, tilt: 10 };
  const rp = globePoint(g, SITES.rodriguez.lon, SITES.rodriguez.lat);
  return <ZoomThrough t={zt} focal={{ x: rp.x, y: rp.y }} from={body} to={<IslandBody f={f - len} len={60} />} />;
};

// Z-12 · Rodriguez, afternoon light: jetty, palms swaying (30 px), swell; Tick with the notebook
const ShotIsland: ShotFC<CCloser> = ({ f, len }) => <IslandBody f={f} len={len} />;

// Z-13 · Tick underlines "heavy guns" in the notebook, then looks east
const ShotWrote: ShotFC<CCloser> = ({ f, len }) => {
  const u = sm(f, 10, 50);
  const look = sm(f, 60, 80);
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 1000, y: 540, zoom: 1.05 }])} vignette={0.16} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={DUSK} stops={["#2A6C80", "#5C9AA0", "#F0A050", "#F6C46A"]} />
        <Bloom x={1700} y={460} r={460} color={DUSK.light} core={50} coreColor="#FFEFC0" strength={0.9} />
      </Layer>
      <Layer depth={0.4}>
        <rect x={-400} y={HORIZON} width={2800} height={900} fill="#3E8C94" />
        <path d={seaSurface(f, -400, 2400, HORIZON + 60, 10, 240, 4, 1600, 30)} fill="#2F7484" />
        {[[200, 640, 420, 3], [1500, 660, 380, 6]].map(([x, y, h, s]) => (
          <Palm key={s} x={x} y={y} h={h} f={f} sway={30} period={60} seed={s} trunk="#6B4428" frond="#2F8F6E" frondDark="#1D5A4A" />
        ))}
      </Layer>
      <Layer depth={1}>
        {/* the open notebook, large, in the foreground */}
        <g transform="rotate(-4 700 760)">
          <rect x={250} y={560} width={900} height={440} rx={16} fill="#7A4A2A" />
          <rect x={270} y={575} width={430} height={410} fill="#FFF6E2" />
          <path d={`M700 575 L1130 575 L1130 985 L700 985 Z`} fill="#FFF6E2" transform={`skewY(${(Math.sin(f / 6) * 1.2).toFixed(2)})`} />
          {[640, 700, 760, 820, 880, 940].map((y) => (
            <line key={y} x1={290} y1={y} x2={1110} y2={y} stroke="#C9DCE6" strokeWidth={2} />
          ))}
          <text x={320} y={752} style={{ fontFamily: "'Georgia', serif", fontStyle: "italic", fontSize: 64, fill: "#2A3E6A" }}>
            heavy guns
          </text>
          <line x1={320} y1={776} x2={320 + 320 * u} y2={772} stroke="#2A3E6A" strokeWidth={6} strokeLinecap="round" />
          <g transform={`translate(${320 + 320 * u} 770) rotate(-35)`}>
            <rect x={-8} y={-190} width={18} height={190} fill="#E0A93A" />
            <path d="M-8 0 L1 18 L10 0 Z" fill="#3A2412" />
          </g>
        </g>
        <Tick x={1500} y={1060} pxPerM={430} frame={f} facing={1} pose="hold" expression="thinking" look={lerp(-0.6, 0.9, look)} headTilt={lerp(14, -4, look)} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text={"“HEAVY GUNS”"} /* #1 */ fill={pillFill(DUSK)} color={DUSK.text} dot={L13_COLORS.vermilion} size={26} />
      </Layer>
    </Stage>
  );
};

// Z-14 · the cold open's dashed arc across the ocean, a ring travelling along it; the gauge shows only its ceiling
const ShotArc: ShotFC<CCloser> = ({ f, len }) => {
  const u = sm(f, 2, Math.max(30, len - 14));
  const A: [number, number] = [1480, 300];
  const B: [number, number] = [420, 640];
  const Q: [number, number] = [1000, 160];
  const at = (s: number): [number, number] => [(1 - s) * (1 - s) * A[0] + 2 * (1 - s) * s * Q[0] + s * s * B[0], (1 - s) * (1 - s) * A[1] + 2 * (1 - s) * s * Q[1] + s * s * B[1]];
  const pts = Array.from({ length: 41 }, (_, i) => at((i / 40) * u));
  const [rx, ry] = at(u);
  const gy = 170;
  const gh = 600;
  const cy = gy + gh - (DB.ceiling / 200) * gh;
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 900, y: 620, zoom: 1.12 }, { f: len, x: 960, y: 540, zoom: 1.0 }])} vignette={0.16} grain={0.5}>
      <Island f={f + 200} fg={false}>
        <path d={"M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} fill="none" stroke="#FFF4E6" strokeWidth={5} strokeDasharray="16 12" />
        <Rings f={f} cx={rx} cy={ry} period={12} speed={6} maxR={120} width={5} color={SAF} />
        <SitePin x={420} y={640} kind="here" frame={f} size={12} />
      </Island>
      <Layer depth={0}>
        <L13Gauge family={DUSK} value={0} fill={false} unknown frame={f} x={1700} y={gy} height={gh} ceiling={{ v: DB.ceiling /* #11 */ }} />
        <Tag x={1700 - 140} y={cy - 46} text="194 dB · THE AIR'S CEILING" /* #11 · F3 */ F={DUSK} dot={SAF} size={22} align="end" />
      </Layer>
    </Stage>
  );
};

// Z-15 · "they become a wall": the shock wall sweeps across the sea (20 px/f); palms whip; Tick braces
const ShotWall: ShotFC<CCloser> = ({ f, len }) => {
  const x = 1560 - f * 32; // the front crosses the frame in the shot (~32 px/f)
  const passed = clamp01((1000 - x) / 400);
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len, x: 960, y: 560, zoom: 1.04 }])} vignette={0.2} grain={0.5}>
      <Island f={f + 400} sway={50} bend={passed}>
        <GroundShadow x={900} y={JETTY_Y + 2} rx={90} ry={10} />
        <Tick x={900} y={JETTY_Y} pxPerM={170} frame={f} facing={1} pose="stand" poseTo="shield" poseT={sm(f, 8, 20) * 1.1} expression="surprised" tilt={passed * -8} />
      </Island>
      <Layer depth={1.05}>
        <ShockFront f={f} x={x} dir={-1} trail={420} />
        <Streamers f={f} n={16} x0={-300} x1={2300} y0={200} y1={900} len={220} width={5} speed={22} color={alpha(L13_COLORS.saffronCore, 0.8)} opacity={0.4} seed={9} dir={-1} />
      </Layer>
    </Stage>
  );
};

// Z-16 · "then a slow swell": the front becomes a ring circling the globe (MORPH: the wall's band fades into the ring)
const ShotSwell: ShotFC<CCloser> = ({ f, len }) => {
  const g = { cx: 960, cy: 560, R: 410, rot: SITES.krakatoa.lon - 40 + f * 0.4, tilt: 8 };
  const d = Math.min(Math.PI - 0.05, 0.25 + f * 0.03);
  const m = 1 - sm(f, 0, 14);
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.08 }, { f: len, x: 960, y: 540, zoom: 1.0 }])} vignette={0.2} grain={0.5}>
      <Space f={f + 300} seed={7} />
      <Layer depth={1}>
        <GlobeL13 {...g} family={VOID} schematic={false}>
          <GlobeRing globe={g} d={d} color={SAF} core={L13_COLORS.saffronCore} width={10} />
          <GlobeRing globe={g} d={Math.max(0.02, d - 0.14)} color={SAF} width={4} opacity={0.4} />
        </GlobeL13>
        {m > 0 ? <rect x={-200} y={-200} width={2400} height={1500} fill={SAF} opacity={m * 0.5} /> : null}
      </Layer>
    </Stage>
  );
};

// Z-17 · "then a line on a chart in a city that never heard a thing": a barograph pen draws the blip by a window over
// a quiet street; rain streaks on the glass; DIS → the end card
const ShotChart: ShotFC<CCloser> = ({ f, len }) => {
  const fade = sm(f, len - 18, len);
  return (
    <AbsoluteFill>
      <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 1000, y: 520, zoom: 1.08 }])} vignette={0.2} grain={0.5}>
        <Layer depth={0.05}>
          <rect x={-400} y={-400} width={2800} height={1900} fill="#3A3048" />
          <LightWash x={1300} y={360} rx={800} ry={420} color={DUSK.light} strength={0.3} />
        </Layer>
        <Layer depth={0.2}>
          <g>
            <clipPath id="zwin">
              <rect x={1000} y={110} width={760} height={520} />
            </clipPath>
            <g clipPath="url(#zwin)">
              <Sky stops={["#1E6678", "#E3813F", "#F6B45A"]} x={1000} y={110} w={760} h={520} />
              {[1030, 1210, 1400, 1580].map((x, i) => (
                <g key={x}>
                  <rect x={x} y={300 + i * 22} width={150} height={340} fill={mixHex("#2A3E46", "#6A3A4A", i * 0.25)} />
                  {[0, 1, 2].map((w) => (
                    <rect key={w} x={x + 20 + w * 42} y={340 + i * 22} width={22} height={26} fill="#FFCF73" opacity={0.85} />
                  ))}
                </g>
              ))}
              <rect x={1000} y={560} width={760} height={80} fill="#2A2A3A" />
              {/* rain streaks running down the glass */}
              {Array.from({ length: 30 }, (_, i) => {
                const x = 1000 + rnd(i * 3) * 760;
                const y = ((rnd(i * 7) * 620 + f * (8 + rnd(i) * 6)) % 620) + 60;
                return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 46} stroke="#DFF4F0" strokeWidth={3} opacity={0.55} />;
              })}
            </g>
          </g>
          <rect x={1000} y={110} width={760} height={520} fill="none" stroke="#6A4026" strokeWidth={20} />
          <path d="M1380 110 V630" stroke="#6A4026" strokeWidth={14} />
        </Layer>
        <Layer depth={1}>
          <rect x={-400} y={720} width={2800} height={60} fill="#6A4026" />
          <rect x={-400} y={780} width={2800} height={600} fill="#4A2E22" />
          <Barograph f={f} x={240} y={430} w={760} h={240} speed={5} spikes={[{ at: 24, h: 0.8 }]} scale={150} family={DUSK} start={-300} />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={16} x={100} y={100} w={1700} h={800} color={DUSK.light} seed={17} size={5} />
        </Layer>
      </Stage>
      <AbsoluteFill style={{ background: CARD.sky[0], opacity: fade, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// E-01 · the end card on the dusk dark field: slow saffron rings behind the wordmark; right half clear for the tiles
const EndCardShot: React.FC<{ f: number; len: number }> = ({ f, len }) => (
  <Stage theme={CARD.theme} drift={false} vignette={0.3} grain={0.4}>
    <Layer depth={0.05}>
      <Sky stops={[CARD.sky[0], CARD.sky[1]]} />
      <Stars frame={f} n={70} w={1920} h={700} color={CARD.text} seed={21} size={1.6} twinkle={0.7} />
    </Layer>
    <Layer depth={1}>
      <g opacity={sm(f, 0, 20)}>
        <Rings f={f} cx={420} cy={870} period={60} speed={5} maxR={520} width={5} color={SAF} core={L13_COLORS.saffronCore} start={-240} />
      </g>
      <Motes frame={f} n={24} x={60} y={80} w={1800} h={900} color={CARD.light} seed={9} size={3} drift={40} />
    </Layer>
    <Layer depth={0}>
      <EndCard t={Math.min(1, f / Math.max(1, len))} family={CARD} />
    </Layer>
  </Stage>
);

export const SceneCloser: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCloser(t);
  if (f >= c.card) return <EndCardShot f={f - c.card} len={c.end - c.card} />;
  const shots: ShotDef<CCloser>[] = [
    { from: 0, S: ShotPlate1, id: "Z-01" },
    { from: c.knob, S: ShotKnob, id: "Z-02" },
    { from: c.plate2, S: ShotPlate2, id: "Z-03" },
    { from: c.batavia, S: ShotBatavia, id: "Z-04" },
    { from: c.squint, S: ShotSquint, id: "Z-06" },
    { from: c.mercury, S: ShotMercury, id: "Z-05" },
    { from: c.water, S: ShotWater, id: "Z-07" },
    { from: c.seesaw, S: ShotSeesaw, id: "Z-08" },
    { from: c.noDb, S: ShotNoDb, id: "Z-09" },
    { from: c.jumps, S: ShotJumps, id: "Z-10" },
    { from: c.blips, S: ShotBlips, id: "Z-11" },
    { from: c.island, S: ShotIsland, id: "Z-12" },
    { from: c.wrote, S: ShotWrote, id: "Z-13" },
    { from: c.arc, S: ShotArc, id: "Z-14" },
    { from: c.wall, S: ShotWall, id: "Z-15" },
    { from: c.swell, S: ShotSwell, id: "Z-16" },
    { from: c.chart, S: ShotChart, id: "Z-17" },
  ];
  return <AbsoluteFill>{playShots(f, shots, c, c.card)}</AbsoluteFill>;
};

export const soundCloser = (t: SceneTiming): Cue[] => {
  const c = cuesCloser(t);
  return [
    { at: 18, file: SFX.popLong, vol: 0.26, dur: 30 },
    ...cutHit(c.knob),
    ...[0, 1, 2, 3].map((i) => ({ at: c.knob + 8 + i * 16, file: SFX.click, vol: 0.14, dur: 10 })),
    ...cutHit(c.plate2),
    { at: c.plate2 + 14, file: SFX.pop, vol: 0.24, dur: 20 },
    { at: c.plate2 + 60, file: SFX.chime, vol: 0.22, dur: 60 },
    ...cutHit(c.batavia),
    { at: c.batavia, file: SFX.wind, vol: 0.14, dur: c.jumps - c.batavia, fadeIn: 20, fadeOut: 20 },
    ...cutHit(c.squint),
    { at: c.squint + 8, file: SFX.click, vol: 0.16, dur: 10 },
    ...cutHit(c.mercury),
    { at: c.mercury + 4, file: SFX.riser, vol: 0.14, dur: 60, fadeOut: 12 },
    ...cutHit(c.water),
    { at: c.water + 6, file: SFX.swirl, vol: 0.18, dur: 50 },
    ...cutHit(c.seesaw),
    { at: c.seesaw + 8, file: SFX.pop, vol: 0.18, dur: 16 },
    { at: c.seesaw + 30, file: SFX.pop, vol: 0.18, dur: 16 },
    ...cutHit(c.noDb),
    { at: c.noDb + 20, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...cutHit(c.jumps),
    ...bataviaSpikes(8, Math.max(4, (c.blips - c.jumps - 30) / 18)).map((s) => ({ at: c.jumps + Math.round(s.at), file: SFX.pop, vol: 0.14, dur: 14 })),
    ...cutHit(c.blips),
    { at: c.blips + 10, file: SFX.chime, vol: 0.22, dur: 60 },
    { at: c.island - 20, file: SFX.swirl, vol: 0.2, dur: 50 },
    { at: c.island, file: SFX.wind, vol: 0.16, dur: c.wall - c.island, fadeIn: 20, fadeOut: 20 },
    ...cutHit(c.wrote),
    { at: c.wrote + 12, file: SFX.click, vol: 0.16, dur: 10 },
    { at: c.arc, file: SFX.riser, vol: 0.14, dur: c.wall - c.arc, fadeOut: 10 },
    { at: c.wall + 10, file: SFX.whoosh, vol: 0.3, dur: 50 },
    { at: c.swell + 2, file: SFX.swirl, vol: 0.2, dur: 50 },
  ];
};
