// L18 scene "l04" · rung two: the Roche limit (storyboard §3 scene 4: 4-01…4-17, script lines 17-24; `gauge` rail and
// lines ↔ `tangerine` survey-paper plates ↔ `abyss` for the far Moon).
// Shot components (hard cuts only; PUSH/SLIDE rows are phases of one component):
//   4-01              RUNG TWO; Tick runs a line across the rail (28 px/f), NASA SAYS, the ROCHE LIMIT tag hangs from it
//   4-02              NASA SAYS: the near-side pull grows into a fat arrow (chevrons crawl 22 px/f) as the ball draws long
//   4-03              KEY ART fallback: inside the dashed ring a crack draws across the ball, the halves drift apart as it
//                     orbits (5 px/f), dust streams off it (12 px/f)
//   4-04              THE ROCHE LIMIT types on; rings ripple out of the Earth to the dashed limit (24 px/f)
//   4-05              the stiff ball (bolts, braces) and the fluid ball, each bouncing on a spring (10 px/f); Tick pushes
//   4-06 (+4-07, 4-08, 4-09) the one-metre cube filling with dots, ABOUT 5,500 KG PER M3; the Moon's cube beside it fills
//                     to 3,300/5,500 of the height; push to the rail: the denser Earth darkens and the line climbs (18 px/f
//                     peak); the STIFF and FLUID lines draw across the rail, the gap filling, TEXTBOOK SAYS
//   4-10              the stiff ball rolling on the scrolling paper (16 px/f), the dashed circle round the Earth drawing
//   4-11              the STIFF line slides down to its mark (decade 4000: 18 px/f), ABOUT 9,500 KM
//   4-12 (+4-13)      the fluid drop sloshing, Tick pokes it, the FLUID line slides to its mark, ABOUT 18,400 KM; the ball
//                     half stiff, half fluid, its outline breathing, the "?" bobbing
//   4-14              the pull-back up the rail (decade 900 → 150), ABOUT 21 TIMES
//   4-15              the token rides its wide ring (15 px/f) with a pulsing halo; Tick wipes his brow; SAFE
//   4-16 (+4-17)      Tick levers the token down to the fluid line, the PULL bar climbs to ×9,000; the dive past both
//                     lines to the station mark (decade 1800: 28 px/f), NEXT RUNG
// Numbers drawn (data18 READ): rhoEarth 5,500 (#1, #2 A) · rhoMoon 3,300 (#1 A) · stiffKm 9,500 (#7 C, OUR SUM) ·
// fluidKm 18,400 (#7 C, OUR SUM) · times21 21 (#7 C, OUR SUM) · pull9000 9,000 (#10 C, OUR SUM). Mark km labels shown
// only from 4-11 on (OUR SUM with them); 4-09 draws the lines unlabelled.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Headline, Kicker, Layer, Stage, Tick, alpha } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { DistGauge, MARKS, MoonToken, StopBadge, railY } from "../gauge";
import { EarthDisc, EarthLimb, limbY } from "../planets18";
import { PullBar, TidalBall } from "../tidal";
import { AgencyPill, OurSumPill, QuestionTag, WordPill } from "../tags18";
import { DotFlow, SweepFront } from "../movers18";
import { READ } from "../data18";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  ABYSS,
  AbyssField,
  C,
  ClipCircle,
  FatArrow,
  FluidBall,
  GAUGE,
  GaugeRoom,
  Halo,
  Orbiter,
  Paper,
  Phase,
  Pop,
  Readout,
  Spring,
  StiffBall,
  TANG,
  TagPlate,
  ez,
  lin,
  logLerp,
  wrap,
} from "./a-parts";

export const cuesL04 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    s01: 0,
    s02: p(0, "For a large moon"),
    s03: p(0, "Within a certain distance"),
    s04: at(1),
    s05: at(2),
    s06: p(2, "The Earth averages"),
    s07: p(2, "The Moon averages"), // phase (same set)
    s08: at(3), // phase (push)
    s09: p(3, "The textbook gives two answers"), // phase (slide)
    s10: at(4),
    s11: p(4, "the line sits about"),
    s12: at(5),
    s13: p(5, "The real Moon is neither"), // phase (slide)
    s14: at(6),
    s15: p(6, "So today's Moon is safe"),
    s16: at(7),
    s17: p(7, "But the station is lower"), // phase (slide)
    end: t.frames,
  };
};
export type CL04 = ReturnType<typeof cuesL04>;

const label = (x: number, y: number, text: string, color = "#FFEFC8", size = 30, anchor: "start" | "middle" | "end" = "start") => (
  <text x={x} y={y} textAnchor={anchor} style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: size, letterSpacing: 3, fill: color }}>
    {text}
  </text>
);

// ================================================================================================================
// 4-01 · RUNG TWO: Tick runs a lever-orange line across the rail (head 28 px/f), the ROCHE LIMIT tag swings from it
// ================================================================================================================
const ShotNasa: ShotFC<CL04> = ({ f }) => {
  const RX = 1600;
  const LYn = 690;
  const k = lin(f, 2, 48);
  const hx = RX - 1320 * k;
  return (
    <Stage theme={GAUGE.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 90, seed: 1 }} vignette={0.2} grain={0.5}>
      <GaugeRoom f={f} floor={1000} seed={13} />
      <Layer depth={1}>
        <DistGauge f={f} family={GAUGE} center={13000} decade={420} x={RX} speed={18} labels={false} />
        <line x1={RX} y1={LYn} x2={hx} y2={LYn} stroke={C.lever} strokeWidth={8} strokeLinecap="round" strokeDasharray="26 12" />
        {k < 1 ? <circle cx={hx} cy={LYn} r={16} fill="#FFE7A0" /> : null}
        {k > 0.5 ? (
          <g transform={`rotate(${(10 * Math.sin(f * 0.3)).toFixed(2)} 520 ${LYn})`}>
            <line x1={520} y1={LYn} x2={520} y2={LYn + 60} stroke={C.amber} strokeWidth={4} />
            <TagPlate x={430} y={LYn + 104} text="ROCHE LIMIT" size={28} dash={false} />
          </g>
        ) : null}
        <Tick x={hx - 50} y={1002} pxPerM={130} frame={f} facing={-1} walk={k < 1 ? f / 7 : undefined} pose={k < 1 ? "stand" : "point"} expression="determined" look={0.3} />
      </Layer>
      <Layer depth={0}>
        {f < 75 ? <StopBadge f={f} rung={2} family={GAUGE} /> : null}
        <AgencyPill x={110} y={200} agency="NASA SAYS" size={30} appear={lin(f, 10, 20)} />
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 4-02 · NASA SAYS: the planet on the left; the near-side arrow grows (3.5 px/f) and fattens into a bar whose chevrons
// crawl toward the planet (22 px/f); the far arrow stays thin; the ball draws long (egg)
// ================================================================================================================
const ShotNear: ShotFC<CL04> = ({ f, len }) => {
  const st = 0.55 * lin(f, 0, len);
  const r = 230;
  const bx = 1220;
  const rx = r * (1 + 0.38 * st);
  const nearX = bx - rx - r * 0.12 * st;
  const L = 60 + 460 * ez(f, 6, 140);
  const W = 18 + 62 * ez(f, 20, 150);
  return (
    <Pop f={f}>
      <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.04, panX: -0.01, panY: 0, frames: 200, seed: 2 }} vignette={0.3} grain={0.5}>
        <AbyssField f={f} speed={8} angle={0} n={120} seed={31} lift={1} />
        <Layer depth={0.9}>
          <Bloom x={-120} y={560} r={700} color={C.earthLimb} strength={0.35} />
          <EarthDisc x={-160} y={560} r={430} f={f} spin={4} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={bx} y={560} r={420} color={C.moonRim} strength={0.32} />
          <TidalBall x={bx} y={560} r={r} f={f} stretch={st} far={90} spin={4} tags />
          <FatArrow x0={nearX + 6} y0={560} x1={nearX - L} y1={560} width={W} f={f} />
        </Layer>
        <Layer depth={0}>
          <AgencyPill x={110} y={130} agency="NASA SAYS" size={30} appear={lin(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-03 · KEY ART fallback: the dashed ring round the Earth; the ball inside it orbits (0.9 deg/f, 5 px/f), a crack
// draws across it (head lit), the halves drift apart (1.6 px/f) and dust streams off (12 px/f)
// ================================================================================================================
const ShotCrack: ShotFC<CL04> = ({ f }) => {
  const ex = 560;
  const ey = 560;
  const a = (-25 - f * 0.9) * (Math.PI / 180);
  const bx = ex + Math.cos(a) * 320;
  const by = ey + Math.sin(a) * 300;
  const dirDeg = (Math.atan2(ey - by, ex - bx) * 180) / Math.PI;
  const sep = Math.max(0, f - 62) * 1.6;
  const away: [number, number] = [bx + (bx - ex) * 1.3, by + (by - ey) * 1.3];
  return (
    <Pop f={f}>
      <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.012, panY: 0, frames: 170, seed: 3 }} vignette={0.3} grain={0.5}>
        <AbyssField f={f} speed={6} angle={200} n={130} seed={32} />
        <Layer depth={1}>
          <circle cx={ex} cy={ey} r={470} fill={alpha(C.lever, 0.06)} stroke={C.lever} strokeWidth={5} strokeDasharray="22 14" strokeDashoffset={-f * 3} />
          <Bloom x={ex} y={ey} r={300} color={C.earthLimb} strength={0.35} />
          <EarthDisc x={ex} y={ey} r={115} f={f} />
          {f > 55 ? <DotFlow f={f} mode="line" from={[bx, by]} to={away} n={36} speed={12} spread={60} colors={[C.moonLit, C.moonMid, C.moonGlow]} size={6} /> : null}
          <Bloom x={bx} y={by} r={260} color={C.moonRim} strength={0.4} />
          <TidalBall x={bx} y={by} r={100} f={f} dir={dirDeg} stretch={0.35} crack={lin(f, 18, 58)} separate={sep} spin={3} />
        </Layer>
        <Layer depth={0}>
          <AgencyPill x={1300} y={140} agency="NASA SAYS" size={30} appear={lin(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-04 · THE ROCHE LIMIT types on (1.5 f per letter); the dashed limit around the Earth with rings rippling out to it
// (24 px/f, looping); the rail at the right streaming
// ================================================================================================================
const ShotName: ShotFC<CL04> = ({ f }) => {
  const word = "THE ROCHE LIMIT";
  const n = Math.min(word.length, Math.floor(f / 1.5));
  const ex = 620;
  const ey = 700;
  const R = 330;
  return (
    <Pop f={f}>
      <Stage theme={GAUGE.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 120, seed: 4 }} vignette={0.2} grain={0.5}>
        <GaugeRoom f={f} floor={1100} seed={14} />
        <Layer depth={1}>
          <DistGauge f={f} family={GAUGE} center={13000} decade={420} x={1650} speed={12} labels={false} />
          <circle cx={ex} cy={ey} r={R} fill={alpha(C.lever, 0.1)} stroke={C.lever} strokeWidth={6} strokeDasharray="22 14" strokeDashoffset={-f * 3} opacity={lin(f, 10, 24)} />
          {[0, 1, 2].map((k) => {
            const rr = 120 + wrap(f * 24 + k * 70, R - 110);
            return <circle key={k} cx={ex} cy={ey} r={rr} fill="none" stroke={C.moonRim} strokeWidth={5} opacity={0.7 * (1 - (rr - 120) / (R - 110))} />;
          })}
          <EarthDisc x={ex} y={ey} r={120} f={f} />
        </Layer>
        <Layer depth={0}>
          <Headline x={110} y={230} lines={[word.slice(0, n) || " "]} size={110} color="#FFEFC8" accent={C.lever} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-05 · the stiff ball (bolts and braces turning, 14 px/f at the rim) and the fluid ball, each bouncing on a spring
// (peak 10.5 px/f); Tick between them pushes one, then the other
// ================================================================================================================
const ShotBalls: ShotFC<CL04> = ({ f }) => {
  const table = 930;
  const sY = 540 + 50 * Math.sin(f * 0.21);
  const fY = 540 + 55 * Math.sin(f * 0.21 + 1.6);
  const fV = Math.cos(f * 0.21 + 1.6);
  const side = Math.floor(f / 60) % 2;
  return (
    <Pop f={f}>
      <Stage theme={TANG.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 200, seed: 5 }} vignette={0.12} grain={0.5}>
        <Paper f={f} table={table} />
        <Layer depth={1}>
          <ellipse cx={600} cy={table + 6} rx={140} ry={16} fill={TANG.shadow} opacity={0.35} />
          <ellipse cx={1300} cy={table + 6} rx={140} ry={16} fill={TANG.shadow} opacity={0.35} />
          <Spring x={600} y0={sY + 150} y1={table} coils={6} />
          <Spring x={1300} y0={fY + 140} y1={table} coils={6} color={C.model} />
          <StiffBall x={600} y={sY} r={150} f={f} spin={5.3} />
          <FluidBall x={1300} y={fY} r={150} f={f} wobble={0.07} squash={0.25 * fV} />
          <Tick x={950} y={table} pxPerM={170} frame={f} facing={side ? 1 : -1} pose="press" expression="thinking" look={0.3} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={600} y={250} text="STIFF" size={34} align="middle" F={TANG} dot={C.lever} />
          <WordPill x={1300} y={250} text="FLUID" size={34} align="middle" F={TANG} dot={C.model} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// an iso box (front face w × h) for the one-metre cubes; the dots fill its front face
const Box: React.FC<{ x: number; y: number; w: number; h: number; d?: number; children?: React.ReactNode }> = ({ x, y, w, h, d = 90, children }) => (
  <g>
    <path d={`M${x} ${y} L${x + d} ${y - d * 0.55} L${x + w + d} ${y - d * 0.55} L${x + w} ${y} Z`} fill={alpha("#FFE08A", 0.55)} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
    <path d={`M${x + w} ${y} L${x + w + d} ${y - d * 0.55} L${x + w + d} ${y + h - d * 0.55} L${x + w} ${y + h} Z`} fill={alpha(TANG.far, 0.7)} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
    <rect x={x} y={y} width={w} height={h} fill={alpha(TANG.near, 0.35)} stroke={C.ink} strokeWidth={5} />
    {children}
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={C.ink} strokeWidth={5} />
  </g>
);

// ================================================================================================================
// 4-06 + 4-07 + 4-08 + 4-09 · the Earth's metre cube fills with dots (droppers keep falling), ABOUT 5,500 KG PER M3;
// the Moon's cube slides in and fills to 3,300/5,500 of the height; push to the rail room: the denser Earth darkens
// and the line climbs the rail (peak 18 px/f, looping with the density); slide: the two textbook lines draw across the
// rail, the gap between them filling (SweepFront), Tick big in the foreground: TEXTBOOK SAYS
// ================================================================================================================
const ShotDensity: ShotFC<CL04> = ({ f, c }) => {
  const T7 = c.s07 - c.s06;
  const T8 = c.s08 - c.s06;
  const T9 = c.s09 - c.s06;
  const side = 380;
  const k2 = ez(f, T7 - 4, T7 + 14);
  const x1 = 300 - 120 * k2;
  const top = 440;
  const fillE = 0.86 * lin(f, 2, 100);
  const fillM = 0.86 * (3300 / 5500) * lin(f, T7 + 6, T7 + 70); // #1: 3,300 / 5,500 of the Earth's height
  const A = (
    <Stage theme={TANG.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.008, panY: 0, frames: 200, seed: 6 }} vignette={0.12} grain={0.5}>
      <Paper f={f} table={top + side + 20} seed={2} />
      <Layer depth={1}>
        <Box x={x1} y={top} w={side} h={side}>
          <DotFlow f={f} mode="fill" from={[x1, top + side]} w={side} h={side} n={100} fill={fillE} speed={14} colors={[C.earthLimb, C.earthDeep, C.cloud]} />
        </Box>
        {label(x1, top + side + 90, "EARTH", "#2A0E04")}
        {k2 > 0 ? (
          <g opacity={k2} transform={`translate(${((1 - k2) * 400).toFixed(1)} 0)`}>
            <Box x={760} y={top} w={side} h={side}>
              <DotFlow f={f} mode="fill" from={[760, top + side]} w={side} h={side} n={100} fill={fillM} speed={14} colors={[C.moonLit, C.moonMid, C.moonShade]} seed={3} />
            </Box>
            {label(760, top + side + 90, "MOON", "#2A0E04")}
          </g>
        ) : null}
      </Layer>
      <Layer depth={0}>
        {k2 < 0.5 ? (
          <Readout x={860} y={330} k={lin(f, 6, 96)} rkey="rhoEarth" prefix="ABOUT" unit="KG PER M" sup="3" size={100} color="#2A0E04" shadow="#FFE08A" />
        ) : (
          <Readout x={1240} y={330} k={lin(f, T7 + 6, T7 + 70)} rkey="rhoMoon" prefix="ABOUT" unit="KG PER M" sup="3" size={96} color="#2A0E04" shadow="#FFE08A" />
        )}
      </Layer>
    </Stage>
  );
  // the rail room: density pulse d (0..1, 80-f cycle) darkens the Earth and lifts the line
  const g = Math.max(0, f - T8);
  const d = 0.5 - 0.5 * Math.cos((g * Math.PI * 2) / 80);
  const lineY = 780 - 460 * d;
  const B = (
    <Stage theme={GAUGE.theme} shotFrame={g} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 160, seed: 7 }} vignette={0.2} grain={0.5}>
      <GaugeRoom f={g} floor={1200} seed={15} />
      <Layer depth={1}>
        <DistGauge f={g} family={GAUGE} center={13000} decade={600} x={1560} speed={10} labels={false} />
        <line x1={1560} y1={lineY} x2={1000} y2={lineY} stroke={C.lever} strokeWidth={9} strokeLinecap="round" />
        <circle cx={1000} cy={lineY} r={16} fill="#FFE7A0" />
        <circle cx={1000} cy={lineY} r={34} fill={C.lever} opacity={0.3} />
        <Bloom x={600} y={1120} r={700} color={C.earthLimb} strength={0.3} />
        <EarthDisc x={600} y={1130} r={500} f={g} spin={4} />
        <ClipCircle cx={600} cy={1130} r={500}>
          <rect x={100} y={600} width={1000} height={1100} fill="#01121B" opacity={0.5 * d} />
          <DotFlow f={g} mode="line" from={[600, 1500]} to={[600, 640]} n={70} speed={20} spread={420} colors={[C.cloud, "#FFFFFF", C.earthLimb]} size={5 + 3 * d} />
        </ClipCircle>
        <MoonToken x={1000} y={lineY - 70} r={34} f={g} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={110} y={150} text="DENSER PLANET: LINE FARTHER OUT" size={32} F={GAUGE} appear={lin(g, 4, 14)} />
      </Layer>
    </Stage>
  );
  const h = Math.max(0, f - T9);
  const dec = 600;
  const cen = 13000;
  const yF = railY(MARKS.fluid.km, cen, dec);
  const yS = railY(MARKS.stiff.km, cen, dec);
  const Cc = (
    <Stage theme={GAUGE.theme} shotFrame={h} drift={{ zoom: 1.03, panX: 0.008, panY: 0, frames: 100, seed: 8 }} vignette={0.2} grain={0.5}>
      <GaugeRoom f={h} floor={1100} seed={16} />
      <Layer depth={1}>
        <SweepFront x={760} y={yF} w={800} h={yS - yF} level={lin(h, 10, 46)} dir="left" color={alpha(C.amber, 0.38)} f={h} />
        <DistGauge f={h} family={GAUGE} center={cen} decade={dec} x={1560} speed={14} labels={false} lines={["stiff", "fluid"]} lineDraw={lin(h, 0, 22)} lineFrom={760} lit={["stiff", "fluid"]} />
        <Tick x={420} y={1110} pxPerM={262} frame={h} pose="point" expression="thinking" look={0.4} headTilt={-6} />
      </Layer>
      <Layer depth={0}>
        <AgencyPill x={110} y={130} agency="TEXTBOOK SAYS" size={30} appear={lin(h, 2, 12)} />
        <WordPill x={770} y={yF - 44} text="FLUID" size={28} F={GAUGE} dot={C.model} appear={lin(h, 16, 24)} />
        <WordPill x={770} y={yS + 44} text="STIFF" size={28} F={GAUGE} dot={C.lever} appear={lin(h, 8, 16)} />
      </Layer>
    </Stage>
  );
  if (f >= T9 - 8) return <Phase f={f} at={T9 - 8} dur={14} kind="slide" a={B} b={Cc} />;
  return <Phase f={f} at={T8 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 4-10 · the stiff ball rolls along the paper (the grid and the table scroll 16 px/f, the bolts turn with it); the
// dashed circle round the small Earth draws (30 px/f), then its dashes march
// ================================================================================================================
const ShotRoll: ShotFC<CL04> = ({ f }) => {
  const table = 930;
  const r = 170;
  const circ = 2 * Math.PI * 230;
  return (
    <Pop f={f}>
      <Stage theme={TANG.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.0, panY: 0, frames: 200, seed: 9 }} vignette={0.12} grain={0.5}>
        <Paper f={f} scroll={16} table={table} seed={3} />
        <Layer depth={1}>
          <ellipse cx={720} cy={table + 6} rx={160} ry={16} fill={TANG.shadow} opacity={0.35} />
          <StiffBall x={720} y={table - r} r={r} f={f} spin={(21 / r) * 57.3} />
          <circle cx={1420} cy={380} r={230} fill="none" stroke={C.ink} strokeWidth={6} strokeDasharray={f < 50 ? `${(circ * lin(f, 0, 50)).toFixed(1)} ${circ}` : "22 14"} strokeDashoffset={f < 50 ? 0 : -f * 3} transform="rotate(-90 1420 380)" />
          <EarthDisc x={1420} y={380} r={80} f={f} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// a line pinned at screen y = cy while the rail slides (the shot's moving subject), with a lit head at x0
const PinLine: React.FC<{ x0: number; x1: number; y: number; color: string; dash?: boolean }> = ({ x0, x1, y, color, dash }) => (
  <g>
    <line x1={x1} y1={y} x2={x0} y2={y} stroke={color} strokeWidth={9} strokeLinecap="round" strokeDasharray={dash ? "26 14" : undefined} />
    <circle cx={x0} cy={y} r={30} fill={color} opacity={0.3} />
    <circle cx={x0} cy={y} r={13} fill="#FFE7A0" />
  </g>
);

// ================================================================================================================
// 4-11 · the STIFF line slides down the rail to its mark (decade 4000: the rail streams 18 px/f), the readout tracks
// the line's km and lands on ABOUT 9,500 KM
// ================================================================================================================
const ShotStiff: ShotFC<CL04> = ({ f, len }) => {
  const u = lin(f, 0, len * 0.82);
  const km = logLerp(30000, MARKS.stiff.km, u);
  const cy = 520;
  return (
    <Pop f={f}>
      <Stage theme={GAUGE.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 150, seed: 10 }} vignette={0.2} grain={0.5}>
        <GaugeRoom f={f} floor={1050} seed={17} />
        <Layer depth={1}>
          <DistGauge f={f} family={GAUGE} center={km} decade={4000} cy={cy} x={1500} speed={-20} lit={u >= 1 ? ["stiff"] : []} />
          <PinLine x0={560} x1={1500} y={cy} color={C.lever} />
        </Layer>
        <Layer depth={0}>
          <Readout x={110} y={330} k={(30000 - km) / (30000 - 9500)} from={30000} rkey="stiffKm" prefix="ABOUT" unit="KM" size={110} />
          <OurSumPill x={120} y={410} size={30} appear={lin(f, 20, 30)} />
          <WordPill x={570} y={cy + 56} text="STIFF" size={28} F={GAUGE} dot={C.lever} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-12 + 4-13 · the fluid drop sloshing on the paper (ripples), Tick pokes it; the FLUID line slides to its mark on a
// paper rail (decade 4000), ABOUT 18,400 KM; slide: the ball half stiff, half fluid, its outline breathing, the "?"
// ================================================================================================================
const ShotFluid: ShotFC<CL04> = ({ f, c }) => {
  const T13 = c.s13 - c.s12;
  const table = 930;
  const u = lin(f, 0, T13 * 0.85);
  const km = logLerp(60000, MARKS.fluid.km, u);
  const cy = 500;
  const sl = Math.sin(f * 0.12);
  const A = (
    <Stage theme={TANG.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.008, panY: 0, frames: 200, seed: 11 }} vignette={0.12} grain={0.5}>
      <Paper f={f} table={table} seed={4} />
      <Layer depth={1}>
        <DistGauge f={f} family={TANG} center={km} decade={4000} cy={cy} x={1560} speed={-20} lit={u >= 1 ? ["fluid"] : []} />
        <PinLine x0={1180} x1={1560} y={cy} color={C.model} dash />
        <ellipse cx={720 + 60 * sl} cy={table + 6} rx={200} ry={18} fill={TANG.shadow} opacity={0.35} />
        <FluidBall x={720 + 60 * sl} y={table - 190} r={190} f={f} wobble={0.08} slosh={sl} squash={0.2} />
        <Tick x={360} y={table} pxPerM={160} frame={f} pose="point" expression="happy" look={0.3} />
      </Layer>
      <Layer depth={0}>
        <Readout x={110} y={240} k={(60000 - km) / (60000 - 18400)} from={60000} rkey="fluidKm" prefix="ABOUT" unit="KM" size={104} color="#2A0E04" shadow="#FFE08A" />
        <OurSumPill x={120} y={318} size={30} appear={lin(f, 20, 30)} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T13);
  const br = 230 * (1 + 0.08 * Math.sin(g * 0.4));
  const B = (
    <Stage theme={TANG.theme} shotFrame={g} drift={{ zoom: 1.04, panX: 0.0, panY: 0, frames: 90, seed: 12 }} vignette={0.12} grain={0.5}>
      <Paper f={g} table={table} seed={5} />
      <Layer depth={1}>
        <ellipse cx={960} cy={table + 6} rx={230} ry={18} fill={TANG.shadow} opacity={0.35} />
        <StiffBall x={960} y={590} r={br} f={g} spin={4.5} half="left" />
        <FluidBall x={960} y={590} r={br} f={g} wobble={0.08} slosh={Math.sin(g * 0.2)} half="right" />
        <line x1={960} y1={590 - br - 10} x2={960} y2={590 + br + 10} stroke={C.ink} strokeWidth={5} strokeDasharray="14 10" />
        <QuestionTag x={960} y={240} f={g} size={96} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T13 - 6} dur={14} kind="slide" a={A} b={B} />;
};

// ================================================================================================================
// 4-14 · the pull-back: the camera rises and zooms out (decade 900 → 150) until today's token sits at the top and the
// two lines are tiny at the foot; stars streaming 14 px/f; ABOUT 21 TIMES
// ================================================================================================================
const ShotPullBack: ShotFC<CL04> = ({ f, len }) => {
  const u = ez(f, 0, len - 8);
  const dec = 900 * Math.pow(150 / 900, u);
  const center = logLerp(15000, 9000, u);
  return (
    <Pop f={f}>
      <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.0, panY: 0, frames: 160, seed: 13 }} vignette={0.3} grain={0.5}>
        <AbyssField f={f} speed={14} n={140} seed={33} />
        <Layer depth={1}>
          <DistGauge f={f} family={ABYSS} center={center} decade={dec} x={1300} speed={20} token={MARKS.today.km} tokenR={30 + 10 * u} lines={["stiff", "fluid"]} lineFrom={1300 - 500 * (1 - u * 0.4)} lit={["today", "fluid"]} labels={u > 0.6} band={["stiff", "fluid"]} />
        </Layer>
        <Layer depth={0}>
          <Readout x={110} y={330} k={lin(f, 20, len - 20)} rkey="times21" prefix="ABOUT" unit="TIMES FARTHER" size={130} />
          <OurSumPill x={120} y={420} size={30} appear={lin(f, 30, 40)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-15 · SAFE: the token rides its wide ring (1.15 deg/f = 15 px/f at the rim) with a halo pulsing and a dust trail;
// Tick on the limb wipes his brow
// ================================================================================================================
const ShotSafe: ShotFC<CL04> = ({ f }) => {
  const LY = 880;
  const R = 3000;
  const ang = 160 - f * 1.15;
  const a = (ang * Math.PI) / 180;
  const mx = 960 + Math.cos(a) * 760;
  const my = 470 + Math.sin(a) * 760 * 0.24;
  return (
    <Pop f={f}>
      <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 140, seed: 14 }} vignette={0.3} grain={0.5}>
        <AbyssField f={f} speed={8} angle={200} n={130} seed={34} lift={1} />
        <Layer depth={1}>
          <Halo x={mx} y={my} r={40} f={f} />
          <Orbiter cx={960} cy={470} r={760} tilt={0.24} angle={ang} kind="moon" size={40} f={f} trail={60} />
          <EarthLimb f={f} y={LY} R={R} cloudSpeed={12} />
          <Tick x={760} y={limbY(760, LY, R)} pxPerM={130} frame={f} pose="wipe-brow" expression="happy" look={0.4} />
        </Layer>
        <Layer depth={0}>
          <TagPlate x={1460} y={170} text="SAFE" size={44} appear={lin(f, 6, 16)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-16 + 4-17 · Tick levers the token down the rail to the FLUID line (decade 2600: 23 px/f), the PULL bar climbs to
// ×9,000 at constant speed; slide: the dive past both lines to the station mark (decade 1800: 28 px/f), NEXT RUNG
// ================================================================================================================
const ShotDive: ShotFC<CL04> = ({ f, c }) => {
  const T17 = c.s17 - c.s16;
  const RX = 1600;
  const cy = 520;
  const km = logLerp(MARKS.geo.km, MARKS.fluid.km, ez(f, 0, 44));
  const u = lin(f, 4, T17 + 8);
  const A = (
    <Stage theme={GAUGE.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.008, panY: 0, frames: 140, seed: 15 }} vignette={0.2} grain={0.5}>
      <GaugeRoom f={f} floor={990} seed={18} />
      <Layer depth={1}>
        <DistGauge f={f} family={GAUGE} center={km} decade={2600} cy={cy} x={RX} speed={-23} token={km} tokenR={40} lit={f > 44 ? ["fluid"] : []} lines={["fluid"]} lineFrom={1180} />
        <PullBar x={640} y={960} h={700} t={1 - Math.pow(1 - u, 1 / 3)} f={f} readKey="pull9000" w={130} />
        <line x1={1300 + 46 * 2} y1={990 - 150 * 2} x2={RX - 40} y2={cy} stroke="#7A3A0C" strokeWidth={14} strokeLinecap="round" />
        <line x1={1300 + 46 * 2} y1={990 - 150 * 2} x2={RX - 40} y2={cy} stroke={C.lever} strokeWidth={8} strokeLinecap="round" />
        <Tick x={1300} y={992} pxPerM={200} frame={f} pose="heave" expression="determined" look={0.4} squash={{ sx: 1 + 0.03 * Math.sin(f * 0.4), sy: 1 - 0.03 * Math.sin(f * 0.4) }} />
      </Layer>
      <Layer depth={0}>
        <text x={644} y={960 - 700 * u - 110} style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 30, letterSpacing: 3, fill: "#FFEFC8" }}>
          ABOUT
        </text>
        <OurSumPill x={830} y={960 - 700 * u - 44} size={30} appear={lin(f, 20, 30)} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T17);
  const dkm = logLerp(MARKS.fluid.km, MARKS.station.km, ez(g, 0, c.end - c.s17 - 4));
  const B = (
    <Stage theme={GAUGE.theme} shotFrame={g} drift={{ zoom: 1.04, panX: 0.0, panY: 0, frames: 120, seed: 16 }} vignette={0.2} grain={0.5}>
      <GaugeRoom f={g} floor={1300} seed={19} />
      <Layer depth={1}>
        <DistGauge f={g} family={GAUGE} center={dkm} decade={1800} cy={cy} x={1500} speed={-28} token={dkm} tokenR={40} lines={["stiff", "fluid"]} lineFrom={360} lit={["stiff", "fluid", "station"]} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={100} y={110} text="NEXT RUNG" color="#FFEFC8" size={36} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T17 - 6} dur={14} kind="slide" a={A} b={B} />;
};

// ================================================================================================================

export const SceneL04: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL04(t);
  const shots: ShotDef<CL04>[] = [
    { from: 0, S: ShotNasa, id: "4-01" },
    { from: c.s02, S: ShotNear, id: "4-02" },
    { from: c.s03, S: ShotCrack, id: "4-03" },
    { from: c.s04, S: ShotName, id: "4-04" },
    { from: c.s05, S: ShotBalls, id: "4-05" },
    { from: c.s06, S: ShotDensity, id: "4-06" }, // + 4-07, 4-08, 4-09
    { from: c.s10, S: ShotRoll, id: "4-10" },
    { from: c.s11, S: ShotStiff, id: "4-11" },
    { from: c.s12, S: ShotFluid, id: "4-12" }, // + 4-13
    { from: c.s14, S: ShotPullBack, id: "4-14" },
    { from: c.s15, S: ShotSafe, id: "4-15" },
    { from: c.s16, S: ShotDive, id: "4-16" }, // + 4-17
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL04 = (t: SceneTiming): Cue[] => {
  const c = cuesL04(t);
  const run = (at: number, n: number, gap: number, vol = 0.07): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 4, file: SFX.click, vol: 0.14, dur: 10 },
    ...cutHit(c.s02),
    { at: c.s02 + 4, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.s03),
    { at: c.s03 + 18, file: SFX.debris, vol: 0.18, dur: 110, fadeOut: 30 },
    ...cutHit(c.s04),
    { at: c.s04 + 6, file: SFX.boom, vol: 0.3, dur: 130, fadeOut: 40 },
    ...cutHit(c.s05),
    { at: c.s05 + 10, file: SFX.pop, vol: 0.12, dur: 16 },
    { at: c.s05 + 70, file: SFX.pop, vol: 0.12, dur: 16 },
    ...cutHit(c.s06),
    ...run(c.s06 + 6, 10, 9),
    ...run(c.s07 + 6, 8, 9),
    { at: c.s08 - 4, file: SFX.whoosh, vol: 0.12, dur: 40 },
    { at: c.s08 + 6, file: SFX.swirl, vol: 0.14, dur: 60 },
    ...cutHit(c.s09),
    ...run(c.s09 + 2, 2, 10, 0.1),
    ...cutHit(c.s10),
    { at: c.s10 + 4, file: SFX.pop, vol: 0.12, dur: 16 },
    ...cutHit(c.s11),
    { at: c.s11 + 90, file: SFX.boom, vol: 0.26, dur: 110, fadeOut: 40 },
    ...cutHit(c.s12),
    { at: c.s12 + 16, file: SFX.pop, vol: 0.12, dur: 16 },
    { at: c.s13 + 4, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.s14),
    { at: c.s14 + 2, file: SFX.deepWhoosh, vol: 0.24, dur: 80 },
    ...cutHit(c.s15),
    { at: c.s15 + 8, file: SFX.chime, vol: 0.16, dur: 90, fadeOut: 30 },
    ...cutHit(c.s16),
    { at: c.s16 + 20, file: SFX.boom, vol: 0.28, dur: 120, fadeOut: 40 },
    { at: c.s17 - 4, file: SFX.deepWhoosh, vol: 0.24, dur: 80 },
  ];
};
