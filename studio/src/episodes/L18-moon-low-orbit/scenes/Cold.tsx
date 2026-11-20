// L18 scene "cold" · the premise on the rail (storyboard §3 cold open: C-01…C-08, script lines 0-2; `abyss` throughout).
// Shot components (hard cuts only; PUSH/SLIDE rows are phases of one component):
//   C-01 (+C-02)  the km rail draws itself up the frame and the camera tilts up it (ticks 20 px/f, stars 12 px/f); the
//                 drop to the foot: the Earth limb, the station gliding its arc (14 px/f), ABOUT 400 KM
//   C-03          the rail rush to the Moon token (29 px/f) with the counter rolling to 384,400 KM
//   C-04 (+C-05)  Tick rides the token down the rail (ticks stream up 28 px/f), MORE THAN 900 TIMES CLOSER; the
//                 cross-section to scale: the Moon's surface 400 km above the limb, the station gliding under it
//   C-06          Earth and Moon discs to scale, the Moon sliding in (24 px/f), the centre-to-centre line and ABOUT 8,500 KM
//   C-07          the MEASURED / MODEL placards swinging (6 deg/f), MODEL flipping on "mark every guess", OUR SUM dropping
//   C-08          Tick walks onto the limb and looks up; the camera tilts up through the stars (24 px/f); the Moon's rim
//                 climbs into the top of frame (the 1.0-s hold)
// Numbers drawn (data18 READ): stationKm 400 (#3, #8 A) · moonKm 384,400 (#1 A) · closerTimes 900 (#8, #20 C, OUR SUM) ·
// surface400 (#3, #8) · centerKm 8,500 (#8 C, OUR SUM); rail decade numerals are SCALE_LABELS; mark km labels are READ.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Layer, Motes, Stage, Tick, alpha, rnd } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { DistGauge, railY } from "../gauge";
import { MoonFace } from "../sky";
import { EarthDisc, EarthLimb, StationToken, limbY } from "../planets18";
import { FlipTag, OurSumPill, AboutPill, WordPill, flipFor } from "../tags18";
import { Clipboard } from "../icons18";
import { READ } from "../data18";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { ABYSS, AbyssField, C, DimLine, MetricA, Phase, Pop, Readout, cl01, ez, lin, logLerp, wrap } from "./a-parts";

export const cuesCold = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    c01: 0,
    c02: p(0, "The station flies"), // phase (push)
    c03: p(0, "The Moon is about"),
    c04: at(1),
    c05: p(1, "To be exact"), // phase (push)
    c06: p(1, "That puts its center"),
    c07: at(2),
    flip: p(2, "mark every guess"),
    c08: p(2, "So let's stand under it"),
    end: t.frames,
  };
};
export type CCold = ReturnType<typeof cuesCold>;

// ================================================================================================================
// C-01 + C-02 · the rail draws up (head 36 px/f) while the camera tilts up it (20 px/f); Tick at the foot with the
// clipboard scrolls away; push to the foot of the rail: the limb, the station gliding (14 px/f), ABOUT 400 KM
// ================================================================================================================
const ShotRail: ShotFC<CCold> = ({ f, c }) => {
  const T2 = c.c02 - c.c01;
  const dec = 900;
  const center = 320 * Math.pow(10, (f * 20) / dec); // 20 px/f of tilt
  const tickY = railY(110, center, dec);
  const A = (
    <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.01, panY: 0, frames: 160, seed: 1 }} vignette={0.3} grain={0.5}>
      <AbyssField f={f} speed={12} n={130} />
      <Layer depth={1}>
        <Bloom x={1240} y={railY(384400, center, dec) - 40} r={520} color={C.moonRim} strength={0.35 * cl01((f - 60) / 60)} />
        <DistGauge f={f} family={ABYSS} center={center} decade={dec} x={1240} top={-60} bottom={1140} draw={lin(f, 0, 32)} speed={22} token={384400} tokenR={46} lit={["today"]} />
        <rect x={980} y={tickY} width={360} height={14} rx={7} fill={C.tealDeep} />
        <rect x={980} y={tickY} width={360} height={4} rx={2} fill={C.amber} opacity={0.8} />
        <Tick x={1100} y={tickY} pxPerM={110} frame={f} pose="hold" expression="neutral" look={0.3} headTilt={-8} />
        <Clipboard x={1144} y={tickY - 112} size={46} rotate={-8} />
        <Motes frame={f} n={14} w={1920} h={1080} color={alpha(C.starApricot, 0.5)} seed={2} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T2);
  const sx = -120 + g * 14;
  const LY = 820;
  const R = 2600;
  const B = (
    <Stage theme={ABYSS.theme} shotFrame={g} drift={{ zoom: 1.05, panX: 0.02, panY: 0, frames: 150, seed: 2 }} vignette={0.3} grain={0.5}>
      <AbyssField f={f} speed={8} n={110} seed={3} />
      <Layer depth={0.9}>
        <EarthLimb f={g} y={LY} R={R} cloudSpeed={10} />
        <path d={`M-200 ${limbY(-200, LY, R) - 130} Q960 ${LY - 210} 2120 ${limbY(2120, LY, R) - 130}`} fill="none" stroke={alpha(C.amber, 0.45)} strokeWidth={3} strokeDasharray="14 12" strokeDashoffset={-g * 3} />
        <StationToken x={sx} y={limbY(sx, LY, R) - 130 - 0} size={64} f={g} angle={Math.atan2(limbY(sx + 1, LY, R) - limbY(sx, LY, R), 1) * 57.3} />
        <DistGauge f={g} family={ABYSS} center={400 * Math.pow(10, (540 - 640) / 300)} decade={300} x={1620} speed={16} lit={["station"]} />
      </Layer>
      <Layer depth={0}>
        <AboutPill x={130} y={190} size={30} appear={lin(g, 4, 14)} />
        <MetricA x={120} y={340} value="400" unit="KM" size={130} reveal={lin(g, 6, 18)} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T2 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// C-03 · the rail rush: the camera shoots up the rail at ~29 px/f, the counter rolls to 384,400 KM, the token arrives
// ================================================================================================================
const ShotRush: ShotFC<CCold> = ({ f, len }) => {
  const dec = 1700;
  const u = lin(f, 0, len - 4);
  const center = logLerp(400, 384400, u);
  return (
    <Pop f={f}>
      <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.0, panY: 0, frames: 170, seed: 3 }} vignette={0.32} grain={0.5}>
        <AbyssField f={f} speed={18} n={140} seed={4} />
        <Layer depth={1}>
          <Bloom x={1300} y={-120 + 640 * u} r={700} color={C.moonRim} strength={0.2 + 0.35 * u} />
          <DistGauge f={f} family={ABYSS} center={center} decade={dec} x={1300} top={-60} bottom={1140} speed={30} token={384400} tokenR={64} lit={["today"]} />
        </Layer>
        <Layer depth={0}>
          <Readout x={120} y={620} k={center / 384400} rkey="moonKm" unit="KM" size={120} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-04 + C-05 · Tick rides the token down (ticks stream up 28 px/f; the decade numerals roll past) with MORE THAN 900
// TIMES CLOSER; push to the cross-section to scale (0.1726 px/km): the Moon's surface 400 km above the limb, the
// station gliding its orbit under it (14 px/f), the bracket and SURFACE 400 KM UP
// ================================================================================================================
const ShotShove: ShotFC<CCold> = ({ f, c }) => {
  const T5 = c.c05 - c.c04;
  const dec = 1440;
  const km = logLerp(384400, 8516 /* #8 C: the new centre distance, not drawn as a numeral */, lin(f, 0, T5));
  const A = (
    <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 120, seed: 4 }} vignette={0.3} grain={0.5}>
      <AbyssField f={f} speed={14} angle={270} n={130} seed={5} />
      <Layer depth={1}>
        <Bloom x={1100} y={540} r={420} color={C.moonRim} strength={0.35} />
        <DistGauge f={f} family={ABYSS} center={km} decade={dec} x={1100} top={-60} bottom={1140} speed={-28} token={km} tokenR={92} />
        <Tick x={1100} y={448} pxPerM={118} frame={f} pose="press" expression="determined" look={0.4} />
      </Layer>
      <Layer depth={0}>
        <Readout x={110} y={430} k={lin(f, 4, 60)} rkey="closerTimes" prefix="MORE THAN" unit="TIMES CLOSER" size={120} />
        <OurSumPill x={120} y={520} size={30} appear={lin(f, 20, 30)} />
      </Layer>
    </Stage>
  );
  // the cross-section, to scale: 1 px = 5.794 km (Earth R 6,378 km → 1,100 px; Moon r 1,738 km → 300 px; 400 km → 69 px)
  const g = Math.max(0, f - T5);
  const LY = 880;
  const ER = 1100;
  const ECX = 960;
  const gap = 69;
  const bob = 26 * Math.exp(-g / 28) * Math.cos(g / 4.5);
  const my = LY - gap - 300 + bob;
  const sa = -Math.PI / 2 - 0.55 + g * 0.012; // the station's angle on its orbit (radius ER + gap), 14 px/f
  const sx = ECX + Math.cos(sa) * (ER + gap);
  const sy = LY + ER + Math.sin(sa) * (ER + gap);
  const lead = lin(g, 12, 32);
  const B = (
    <Stage theme={ABYSS.theme} shotFrame={g} drift={{ zoom: 1.05, panX: 0.012, panY: 0.01, frames: 150, seed: 5 }} vignette={0.3} grain={0.5}>
      <AbyssField f={f} speed={6} n={100} seed={6} />
      <Layer depth={1}>
        <Bloom x={960} y={my} r={560} color={C.moonRim} strength={0.3} />
        <MoonFace f={g} x={ECX} y={my} radius={300} scroll={5} />
        <EarthLimb f={g} y={LY} R={ER} cx={ECX} cloudSpeed={10} />
        <ellipse cx={ECX} cy={LY + ER} rx={ER + gap} ry={ER + gap} fill="none" stroke={alpha(C.amber, 0.4)} strokeWidth={2.5} strokeDasharray="12 10" />
        <StationToken x={sx} y={sy} size={46} f={g} angle={(sa * 180) / Math.PI + 90} />
        {/* the bracket: the limb up to the Moon's lower edge, a leader out to the label */}
        <g opacity={lin(g, 4, 10)}>
          <line x1={ECX - 22} y1={LY} x2={ECX + 22} y2={LY} stroke={C.moonRim} strokeWidth={5} />
          <line x1={ECX} y1={LY} x2={ECX} y2={LY - lin(g, 4, 10) * (gap + bob * 0)} stroke={C.moonRim} strokeWidth={5} />
          <line x1={ECX - 22} y1={LY - gap + bob} x2={ECX + 22} y2={LY - gap + bob} stroke={C.moonRim} strokeWidth={5} />
          <DimLine x0={ECX} x1={ECX + 440} y={LY - gap / 2} draw={lead} tick={0} width={4} color={C.moonRim} />
        </g>
        <Tick x={ECX - 70} y={limbY(ECX - 70, LY, ER, ECX)} pxPerM={44} frame={g} pose="crouch-reach" expression="thinking" />
      </Layer>
      <Layer depth={0}>{lead >= 1 ? <WordPill x={ECX + 450} y={LY - gap / 2} text={READ.surface400.text} size={30} appear={lin(g, 30, 40)} /> : null}</Layer>
    </Stage>
  );
  return <Phase f={f} at={T5 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// C-06 · Earth and Moon to scale (0.075 px/km): the Moon slides in (24 px/f), the centre-to-centre line draws
// (36 px/f), ABOUT 8,500 KM rolls, then a pulse runs centre to centre (24 px/f) for the rest of the shot
// ================================================================================================================
const ShotCenters: ShotFC<CCold> = ({ f }) => {
  const ex = 620;
  const ey = 560;
  const mxT = ex + 639; // 8,516 km × 0.075 (#8 C)
  const mx = Math.max(mxT, 2120 - 24 * f);
  const draw = lin(f, 34, 52);
  const pulse = ex + wrap((f - 52) * 24, 639);
  return (
    <Pop f={f}>
      <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.04, panX: -0.012, panY: 0, frames: 180, seed: 6 }} vignette={0.3} grain={0.5}>
        <AbyssField f={f} speed={10} angle={180} n={120} seed={7} />
        <Layer depth={1}>
          <EarthDisc x={ex} y={ey} r={478} f={f} spin={4} />
          <Bloom x={mx} y={ey} r={260} color={C.moonRim} strength={0.4} />
          <MoonFace f={f} x={mx} y={ey} radius={130} scroll={9} />
          <DimLine x0={ex} x1={mxT} y={ey} draw={draw} tick={30} width={7} color={C.moonRim} />
          <circle cx={ex} cy={ey} r={12} fill={C.moonRim} opacity={draw > 0 ? 1 : 0} />
          {f > 52 ? (
            <g>
              <circle cx={pulse} cy={ey} r={26} fill={C.amber} opacity={0.35} />
              <circle cx={pulse} cy={ey} r={11} fill="#FFE7A0" />
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <Readout x={1180} y={250} k={lin(f, 44, 110)} rkey="centerKm" prefix="ABOUT" unit="KM" size={104} />
          <OurSumPill x={1190} y={330} size={30} appear={lin(f, 60, 70)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-07 · the two placards swing in on their cords (18° pendulum = 6 deg/f peak), the right one flips MEASURED → MODEL
// on "mark every guess" (12 deg/f), OUR SUM drops in (30 px/f); Tick points at the pill
// ================================================================================================================
const ShotPlacards: ShotFC<CCold> = ({ f, c }) => {
  const fl = c.flip - c.c07;
  const drop = (k: number) => ez(f, k * 8, k * 8 + 18);
  const pillY = 800 - Math.max(0, 90 - (f - (fl + 20)) * 30);
  return (
    <Pop f={f}>
      <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.012, panY: 0, frames: 170, seed: 7 }} vignette={0.3} grain={0.5}>
        <AbyssField f={f} speed={10} n={120} seed={8} />
        <Layer depth={1}>
          <Bloom x={960} y={360} r={760} color={C.moonRim} strength={0.22} />
          <rect x={300} y={96} width={1320} height={14} rx={7} fill={C.tealDeep} />
          <rect x={300} y={96} width={1320} height={4} rx={2} fill={C.amber} opacity={0.7} />
          <FlipTag x={640} y={104} word="MEASURED" f={f} swing={18} drop={drop(0)} size={1.4} cord={130} />
          <FlipTag x={1260} y={104} word="MODEL" prev="MEASURED" f={f + 9} swing={18} flip={flipFor(f, fl, 15)} drop={drop(1)} size={1.4} cord={130} />
          <Tick x={1540} y={1010} pxPerM={210} frame={f} facing={-1} pose="point" expression="happy" look={0.2} />
        </Layer>
        <Layer depth={0}>{f >= fl + 20 ? <OurSumPill x={980} y={pillY} size={44} align="middle" /> : null}</Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-08 · Tick walks onto the limb (5 px/f) and tips his head back; the camera tilts up (24 px/f) through streaming
// stars to the black; the Moon's gold rim climbs into the top of frame and keeps climbing through the hold (12 px/f)
// ================================================================================================================
const ShotLookUp: ShotFC<CCold> = ({ f }) => {
  const dy = f <= 40 ? 0 : f <= 100 ? 24 * (f - 40) : 1440 + 12 * (f - 100);
  const LY = 820;
  const R = 2600;
  const tx = 700 + Math.min(f, 34) * 5;
  const stars = Array.from({ length: 150 }, (_, i) => {
    const x = rnd(i * 7 + 3) * 1920;
    const d = 0.5 + 0.5 * rnd(i * 11 + 1);
    const y = wrap(rnd(i * 13 + 5) * 1400 + dy * 0.66 * d, 1400) - 160;
    return <circle key={i} cx={x} cy={y} r={(1 + rnd(i * 3) * 2.4) * d} fill={[C.starApricot, C.starAqua, "#FFD9A0", "#9FEFF8"][i % 4]} opacity={0.7 + 0.3 * Math.sin(f / 9 + i)} />;
  });
  return (
    <Pop f={f}>
      <Stage theme={ABYSS.theme} shotFrame={f} drift={false} vignette={0.32} grain={0.5}>
        <AbyssField f={f} speed={0} n={0} />
        <g>{stars}</g>
        {/* the Moon is drawn in screen coordinates (MoonFace culls its craters against the frame) */}
        <Bloom x={960} y={-1500 + dy} r={900} color={C.moonRim} strength={0.5} squash={0.4} />
        <MoonFace f={f} x={960} y={-3000 + dy} radius={1500} scroll={10} />
        <g transform={`translate(0 ${dy.toFixed(1)})`}>
          <EarthLimb f={f} y={LY} R={R} cloudSpeed={10} />
          <Tick x={tx} y={limbY(tx, LY, R)} pxPerM={150} frame={f} walk={f < 34 ? f / 14 : undefined} pose="stand" expression={f < 30 ? "neutral" : "surprised"} headTilt={-ez(f, 30, 44) * 22} look={0.4} />
        </g>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================

export const SceneCold: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCold(t);
  const shots: ShotDef<CCold>[] = [
    { from: 0, S: ShotRail, id: "C-01" }, // + C-02
    { from: c.c03, S: ShotRush, id: "C-03" },
    { from: c.c04, S: ShotShove, id: "C-04" }, // + C-05
    { from: c.c06, S: ShotCenters, id: "C-06" },
    { from: c.c07, S: ShotPlacards, id: "C-07" },
    { from: c.c08, S: ShotLookUp, id: "C-08" },
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCold = (t: SceneTiming): Cue[] => {
  const c = cuesCold(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 0, file: SFX.rumble, vol: 0.12, dur: c.c03, fadeIn: 30, fadeOut: 30 },
    { at: c.c02 - 4, file: SFX.whoosh, vol: 0.12, dur: 40 },
    { at: c.c02 + 8, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.c03),
    { at: c.c03 + 2, file: SFX.whoosh, vol: 0.2, dur: 60 },
    ...cutHit(c.c04),
    { at: c.c04 + 2, file: SFX.deepWhoosh, vol: 0.24, dur: 70 },
    { at: c.c05 + 14, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.c06),
    ...run(c.c06 + 36, 6, 6),
    ...cutHit(c.c07),
    ...run(c.c07 + 4, 3, 8),
    { at: c.flip, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.flip + 8, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.c08),
    { at: c.c08 + 30, file: SFX.riser, vol: 0.2, dur: c.end - c.c08 - 30, fadeOut: 20 },
  ];
};
