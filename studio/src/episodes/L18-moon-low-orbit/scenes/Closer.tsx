// L18 scene "closer" (storyboard §3 "Closer", script lines 50-54). Package B. Full.tsx draws the 20-s end card over the 600-f
// tail (closerTail); SceneCloser fills only the closer's own frames, and every shot keeps moving to its last frame (the L17 lesson:
// the last minute was the weakest window): rails stream, tokens orbit and hop, the Moon scrolls, cracks draw, dots fall.
// ShotDefs (hard cuts; PUSH / SLIDE rows are phases): Z-01 (+Z-02, Z-03) · Z-04 · Z-05 (+Z-06) · Z-07 · Z-08 · Z-09 · Z-10 (+Z-11) · Z-12.
// Numbers drawn (all data18 READ): 3.8 CM / YEAR (#4 A, Z-03) · ABOUT 9,500 TO 18,400 KM + OUR SUM (#7 C, Z-04; spoken 18,400 since
// the Nov 19 fix) · 78 DEGREES + OUR SUM (#12 C, Z-08) · the rail's mark labels 384,400 · 42,164 · 18,400 · 9,500 · 400 KM (#1, #13,
// #7, #3, Z-11, Z-12). Words only: HOLDS TOGETHER (#7), DEPENDS ON THE MATERIAL (#6), EVEN A STIFF MOON LOSES + OUR SUM (#7, #11),
// FAR BELOW (#8), NOT POSSIBLE (#4: "our real Moon will never give us"), MODEL (Q5).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Headline, Layer, Motes, Sky, Stage, Tick } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ } from "../data18";
import { DistGauge, MARKS, MarkId, MoonToken, railY } from "../gauge";
import { Arrow18, TidalBall } from "../tidal";
import { FlipTag, OurSumPill, WordPill } from "../tags18";
import { EarthDisc } from "../planets18";
import { DotFlow, StarsTint18, SweepFront } from "../movers18";
import { MoonFace } from "../sky";
import { Clipboard } from "../icons18";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, FamSky, GlowRings, NightSky, Pop, ReadHead, Readout, alpha, ez, lin, logLerp, mod, runOf } from "./b-parts";

/** Frames after the last line for the 20-s end card (EndCard from the kit, drawn by Full.tsx). */
export const closerTail = 600;

export const cuesCloser = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    z01: 0,
    z02: p(0, "The Moon in the sky is far enough"),
    z03: p(0, "and it is still drifting farther"),
    z04: at(1),
    z05: p(1, "the answer depends on what the Moon is made of"),
    z06: p(1, "Below nine and a half thousand"),
    z07: at(2),
    z08: p(2, "So the sky at the start of this video"),
    z09: p(2, "is a sight our real Moon will never give us"),
    z10: at(3),
    z11: at(4),
    z12: p(4, "where would you stop it"),
    end: t.frames,
  };
};
export type CZ = ReturnType<typeof cuesCloser>;

const ABY = familyOf("abyss");
const GAU = familyOf("gauge");
const BOWL = familyOf("bowl");
const ORDER: MarkId[] = ["today", "geo", "fluid", "stiff", "station"];

// ===============================================================================================================
// Z-01 → Z-03 · quiet: the rail with the Moon token at the top, the camera drifting up (ticks stream down 12 px/f); Tick beneath
// with the clipboard. Z-02: the token rides its wide ring over a calm Earth, a halo pulsing round it. Z-03: back on the rail, the
// token drifts up (8 px/f) as the ticks stream down; 3.8 CM / YEAR.
// ===============================================================================================================
const RailUp: React.FC<{ f: number; len: number; c: CZ; drift?: boolean }> = ({ f, len, drift = false }) => {
  const decade = 520;
  const center = logLerp(drift ? 260000 : 200000, drift ? 900000 : 300000, lin(f, 0, len));
  const tok = drift ? center * Math.pow(10, 0.1 + 0.5 * lin(f, 0, len)) : MARKS.today.km;
  const ty = railY(tok, center, decade);
  const pulse = 10 * Math.sin(f * 0.35);
  return (
    <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0, panY: -0.006, frames: 160, seed: 51 }} vignette={0.24} grain={0.5}>
      <Layer depth={0.1}>
        <NightSky lift={0.5} />
      </Layer>
      <Layer depth={0.3}>
        <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={110} speed={14} angle={90} seed={31} />
      </Layer>
      <Layer depth={1}>
        <Bloom x={1240} y={ty} r={260} color={C.moonRim} strength={0.35} />
        <DistGauge f={f} family={ABY} center={center} decade={decade} x={1240} speed={12} token={tok} tokenR={44} lit={["today"]} />
        <Arrow18 x0={1170} y0={ty + 20} x1={1170} y1={ty - 90 - pulse} color={C.moonRim} width={12} outline="#000A10" />
        {!drift ? (
          <g>
            <rect x={760} y={1000} width={420} height={14} rx={7} fill={C.amber} />
            <Tick x={960} y={1000} pxPerM={130} frame={f} facing={1} pose="hold" expression="neutral" look={0.8} headTilt={-12} />
            <Clipboard x={960 + 50} y={1000 - 140} size={48} rotate={-8} />
          </g>
        ) : null}
      </Layer>
      {drift ? (
        <Layer depth={0}>
          <Readout x={80} y={100} value={READ.recede38.value! /* #4 A */} k={lin(f, 4, 44)} unit="CM / YEAR" dec size={84} w={640} appear={lin(f, 0, 8)} who="Z-03 recession" />
        </Layer>
      ) : null}
    </Stage>
  );
};
const RailUp1: React.FC<{ f: number; len: number; c: CZ }> = (p) => <RailUp {...p} />;
const RailUp2: React.FC<{ f: number; len: number; c: CZ }> = (p) => <RailUp {...p} drift />;
const WideRing: React.FC<{ f: number; len: number; c: CZ }> = ({ f }) => {
  const ex = 420;
  const ey = 900;
  const a = ((-96 + f * 0.8) * Math.PI) / 180;
  const mx = ex + Math.cos(a) * 1280;
  const my = ey + Math.sin(a) * 640;
  return (
    <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.006, panY: 0, frames: 120, seed: 52 }} vignette={0.24} grain={0.5}>
      <Layer depth={0.1}>
        <NightSky />
      </Layer>
      <Layer depth={0.3}>
        <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={110} speed={12} angle={180} seed={32} />
      </Layer>
      <Layer depth={1}>
        <ellipse cx={ex} cy={ey} rx={1280} ry={640} fill="none" stroke={alpha(C.moonRim, 0.5)} strokeWidth={4} strokeDasharray="16 12" strokeDashoffset={-f * 2} />
        <EarthDisc x={ex} y={ey} r={230} f={f} spin={6} />
        <Bloom x={mx} y={my} r={240} color={C.moonRim} strength={0.4} />
        <GlowRings f={f} cx={mx} cy={my} every={20} speed={5} maxR={150} color={C.moonRim} width={5} />
        <MoonToken x={mx} y={my} r={62} f={f} spin={3} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={90} y={110} text="HOLDS TOGETHER" size={30} appear={lin(f, 4, 14)} />
      </Layer>
    </Stage>
  );
};
const ShotZ01 = runOf<CZ>((c) => [
  { at: c.z01, S: RailUp1 },
  { at: c.z02, S: WideRing, dir: "up" },
  { at: c.z03, S: RailUp2, dir: "down" },
]);

// ===============================================================================================================
// Z-04 · the lit rail, zoomed to the band between STIFF and FLUID: the band fill spreads out from the rail (30 px/f, its front
// rippling), the two lines pulse, the hatch streams 14 px/f.
// ===============================================================================================================
const ShotZ04: ShotFC<CZ> = ({ f, len }) => {
  const decade = 900;
  const center = logLerp(15000, 12400, lin(f, 0, len));
  const yS = railY(MARKS.stiff.km, center, decade);
  const yF = railY(MARKS.fluid.km, center, decade);
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.3);
  return (
    <Pop f={f}>
      <Stage theme={GAU.theme} shotFrame={f} drift={{ zoom: 1.05, panX: -0.006, panY: 0, frames: 150, seed: 53 }} vignette={0.14} grain={0.5}>
        <Layer depth={0.1}>
          <FamSky name="gauge" />
        </Layer>
        <Layer depth={1}>
          <SweepFront x={120} y={yF} w={1120} h={yS - yF} level={ez(f, 4, 42)} dir="left" color={C.amber} f={f} />
          <line x1={120} y1={yS} x2={1240} y2={yS} stroke={C.lever} strokeWidth={6 + 6 * pulse} opacity={0.9} />
          <line x1={120} y1={yF} x2={1240} y2={yF} stroke={C.model} strokeWidth={6 + 6 * (1 - pulse)} strokeDasharray="22 12" strokeDashoffset={-f * 3} />
          <DistGauge f={f} family={GAU} center={center} decade={decade} x={1300} speed={14} lit={["stiff", "fluid"]} band={["stiff", "fluid"]} />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#FFE7A0" seed={5} size={3} drift={20} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={90} y={110} text="ABOUT 9,500 TO 18,400 KM" size={30} fill={alpha(GAU.shadow, 0.85)} appear={lin(f, 4, 14)} />
          <OurSumPill x={96} y={176} appear={lin(f, 10, 20)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-05 + Z-06 · Tick (≥ 40 % of the frame), hand on chin; in the band a ghost token morphs between a bolted stiff ball (bolts
// sliding round its rim 16 px/f) and a runny ball. Z-06: the camera dives, and below the STIFF line the rail floods orange
// (30 px/f) to the foot; EVEN A STIFF MOON LOSES + OUR SUM.
// ===============================================================================================================
const Depends: React.FC<{ f: number; len: number; c: CZ }> = ({ f }) => {
  const decade = 900;
  const center = 13200;
  const yS = railY(MARKS.stiff.km, center, decade);
  const yF = railY(MARKS.fluid.km, center, decade);
  const ym = (yS + yF) / 2;
  const m = 0.5 + 0.5 * Math.sin(f * 0.11);
  const bx = 1120;
  const r = 100;
  return (
    <Stage theme={GAU.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.006, panY: 0, frames: 120, seed: 54 }} vignette={0.14} grain={0.5}>
      <Layer depth={0.1}>
        <FamSky name="gauge" />
      </Layer>
      <Layer depth={1}>
        <rect x={760} y={yF} width={760} height={yS - yF} fill={C.moonGlow} />
        <DistGauge f={f} family={GAU} center={center} decade={decade} x={1500} speed={12} lit={["stiff", "fluid"]} lines={["stiff", "fluid"]} lineFrom={760} band={["stiff", "fluid"]} />
        <g opacity={1 - m}>
          <TidalBall x={bx} y={ym} r={r} f={f} spin={4} />
          {Array.from({ length: 10 }, (_, i) => {
            const a = ((i * 36 + f * (16 / r) * (180 / Math.PI)) * Math.PI) / 180;
            return <circle key={i} cx={bx + Math.cos(a) * r * 0.9} cy={ym + Math.sin(a) * r * 0.9} r={9} fill={C.amber} stroke="#7A3A0C" strokeWidth={3} />;
          })}
        </g>
        <g opacity={m}>
          <TidalBall x={bx} y={ym} r={r} f={f} material="fluid" stretch={0.25 + 0.2 * Math.sin(f * 0.2)} />
        </g>
        <rect x={-200} y={1040} width={2320} height={300} fill={GAU.near} />
        <rect x={-200} y={1040} width={2320} height={8} fill={alpha(C.amber, 0.7)} />
        <Tick x={420} y={1044} pxPerM={262} frame={f} facing={1} pose="think" expression="thinking" look={0.5} headTilt={10 + 6 * Math.sin(f * 0.07)} />
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={14} w={1920} h={1080} color="#FFE7A0" seed={7} size={3} drift={20} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={90} y={110} text="DEPENDS ON THE MATERIAL" size={30} fill={alpha(GAU.shadow, 0.85)} appear={lin(f, 4, 14)} />
      </Layer>
    </Stage>
  );
};
const Flood: React.FC<{ f: number; len: number; c: CZ }> = ({ f, len }) => {
  const u = ez(f, 0, len * 0.5);
  const decade = 900 + (400 - 900) * u;
  const center = logLerp(13200, 2500, u);
  const yS = railY(MARKS.stiff.km, center, decade);
  const h = Math.max(10, 1100 - yS);
  return (
    <Stage theme={GAU.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0, panY: 0.006, frames: 130, seed: 55 }} vignette={0.14} grain={0.5}>
      <Layer depth={0.1}>
        <FamSky name="gauge" />
      </Layer>
      <Layer depth={1}>
        <SweepFront x={120} y={yS} w={1120} h={h} level={ez(f, 4, 34)} dir="down" color={C.lever} f={f} />
        <DistGauge f={f} family={GAU} center={center} decade={decade} x={1300} speed={18} lit={["stiff", "station"]} lines={["stiff"]} lineFrom={120} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={90} y={110} text="EVEN A STIFF MOON LOSES" size={30} fill={alpha(GAU.shadow, 0.85)} appear={lin(f, 14, 24)} />
        <OurSumPill x={96} y={176} appear={lin(f, 18, 28)} />
      </Layer>
    </Stage>
  );
};
const ShotZ05 = runOf<CZ>((c) => [
  { at: c.z05, S: Depends },
  { at: c.z06, S: Flood, dir: "up" },
]);

// ===============================================================================================================
// Z-07 · the camera drops to the STATION mark (ticks ≈ 18 px/f), then a long bracket draws up to the STIFF line (40 px/f) and a
// reading head runs it.
// ===============================================================================================================
const ShotZ07: ShotFC<CZ> = ({ f, len }) => {
  const decade = 600;
  const center = logLerp(30000, 1950, ez(f, 0, 40)) * Math.pow(10, -0.04 * lin(f, 40, len));
  const yS = railY(MARKS.stiff.km, center, decade);
  const yT = railY(MARKS.station.km, center, decade);
  const k = lin(f, 36, 58);
  const yk = yT - (yT - yS) * k;
  return (
    <Pop f={f}>
      <Stage theme={GAU.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0, panY: 0, frames: 90, seed: 56 }} vignette={0.14} grain={0.5}>
        <Layer depth={0.1}>
          <FamSky name="gauge" />
        </Layer>
        <Layer depth={1}>
          <DistGauge f={f} family={GAU} center={center} decade={decade} x={1300} speed={10} lit={["station", "stiff"]} lines={["stiff", "station"]} lineFrom={1000} />
          <line x1={1100} y1={yT} x2={1100} y2={yk} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
          <line x1={1072} y1={yT} x2={1128} y2={yT} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
          {k >= 1 ? <line x1={1072} y1={yS} x2={1128} y2={yS} stroke={C.ink} strokeWidth={7} strokeLinecap="round" /> : null}
          {k > 0 && k < 1 ? <circle cx={1100} cy={yk} r={12} fill="#FFF3C8" /> : null}
          {k >= 1 ? <ReadHead x0={1100} y0={yT - 10} x1={1100} y1={yS + 10} f={f - 58} speed={20} r={11} /> : null}
        </Layer>
        <Layer depth={0}>
          <WordPill x={90} y={110} text="FAR BELOW" size={30} fill={alpha(GAU.shadow, 0.85)} appear={lin(f, 30, 40)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-08 / Z-09 · the huge Moon fills the sky again over tiny Tick (craters scroll 22 px/f, the terminator sweeps); 78 DEGREES +
// OUR SUM. Z-09: its colour drains to a dashed ghost (dashes march 18 px/f) and NOT POSSIBLE slams on; the surface keeps sliding.
// ===============================================================================================================
const SkyMoon: React.FC<{ f: number; len: number; ghost?: number; crack?: number; separate?: number; scroll?: number; children?: React.ReactNode; tick?: React.ReactNode }> = ({ f, ghost = 0, crack = 0, separate = 0, scroll = 22, children, tick }) => (
  <Stage theme={BOWL.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.004, panY: 0.004, frames: 150, seed: 57 }} vignette={0.16} grain={0.5}>
    <Layer depth={0.1}>
      <Sky stops={["#1FA8C9", "#F59A3B", "#FFC65C"]} x={-400} y={-300} w={2720} h={1360} />
    </Layer>
    <Layer depth={0.6}>
      <Bloom x={960} y={-560} r={1700} color={C.moonRim} strength={0.32 * (1 - ghost)} />
      <MoonFace f={f} x={960} y={-560} radius={1300} scroll={scroll} grid terminator={-0.7 + 0.5 * Math.sin(f * 0.012)} ghost={ghost} crack={crack} separate={separate} />
    </Layer>
    <Layer depth={1}>
      {children}
      <rect x={-300} y={900} width={2520} height={500} fill={BOWL.near} />
      <rect x={-300} y={898} width={2520} height={6} fill={BOWL.light} opacity={0.8} />
      <rect x={-300} y={960} width={2520} height={500} fill={BOWL.shadow} opacity={0.5} />
      {tick}
    </Layer>
    <Layer depth={1.25}>
      <Motes frame={f} n={16} w={1920} h={1080} color="#FFE7A0" seed={3} size={3} drift={22} />
    </Layer>
  </Stage>
);
const ShotZ08: ShotFC<CZ> = ({ f, len }) => (
  <Pop f={f}>
    <SkyMoon f={f} len={len} tick={<Tick x={960} y={902} pxPerM={60} frame={f} facing={1} pose="stand" expression="surprised" look={1} headTilt={-26} />}>
      <></>
    </SkyMoon>
    <Hud>
      <OurSumPill x={740} y={990} appear={lin(f, 8, 18)} />
      <Readout x={80} y={928} value={READ.deg78.value! /* #12 C 78.2 */} k={lin(f, 4, 40)} unit="DEGREES" size={84} w={620} appear={lin(f, 0, 10)} who="Z-08 width" />
    </Hud>
  </Pop>
);
/** A screen-locked overlay above a Stage (HUD text). */
const Hud: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);
const ShotZ09: ShotFC<CZ> = ({ f, len }) => {
  const rattle = f > 16 ? Math.max(0, 1 - (f - 16) / 30) : 0;
  return (
    <Pop f={f}>
      <SkyMoon f={f} len={len} ghost={ez(f, 0, 36)} scroll={14} tick={<Tick x={960} y={902} pxPerM={60} frame={f} facing={1} pose="stand" expression="worried" look={1} headTilt={-20} />}>
        <FlipTag x={960} y={300} word="NOT POSSIBLE" f={f} swing={8} drop={ez(f, 6, 14)} rattle={rattle} size={1.4} cord={100} />
      </SkyMoon>
    </Pop>
  );
};

// ===============================================================================================================
// Z-10 + Z-11 · the sky Moon cracks along drawn lines (50 px/f), the halves drift apart (4 px/f), dust falls (14 px/f); tiny Tick,
// hands on his head, steps back (MODEL). Z-11: in the dark Tick (≥ 40 % of the frame) slides the token down the rail; the camera
// follows it (ticks ≈ 28 px/f) and each mark lights with its distance as it passes.
// ===============================================================================================================
const Cracking: React.FC<{ f: number; len: number; c: CZ }> = ({ f, len }) => {
  const back = ez(f, 20, 50);
  return (
    <SkyMoon
      f={f}
      len={len}
      crack={lin(f, 2, 54)}
      separate={Math.max(0, f - 54) * 4}
      scroll={16}
      tick={<Tick x={960 - 50 * back} y={902} pxPerM={60} frame={f} facing={1} pose="shield" expression="worried" look={1} headTilt={-18} />}
    >
      <DotFlow f={f} mode="fall" from={[620, 560]} w={680} h={340} n={80} speed={14} accel={0.35} colors={[C.moonGlow, C.moonMid, C.moonLit]} size={5} />
      <FlipTag x={1640} y={0} word="MODEL" f={f} swing={14} size={0.9} cord={120} />
    </SkyMoon>
  );
};
const Slide: React.FC<{ f: number; len: number; c: CZ }> = ({ f, len }) => {
  const tok = logLerp(MARKS.today.km, MARKS.station.km, ez(f, 0, len * 0.9));
  const decade = 600;
  const cy = 810;
  const lit = ORDER.filter((m) => MARKS[m].km >= tok * 0.98);
  return (
    <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0, panY: 0, frames: 90, seed: 58 }} vignette={0.22} grain={0.5}>
      <Layer depth={0.1}>
        <NightSky />
      </Layer>
      <Layer depth={0.3}>
        <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={110} speed={16} angle={270} seed={33} />
      </Layer>
      <Layer depth={1}>
        <DistGauge f={f} family={ABY} center={tok} decade={decade} x={760} cy={cy} speed={-10} token={tok} tokenR={42} lit={lit} />
        <Tick x={640} y={1080} pxPerM={262} frame={f} facing={1} pose="hold" expression="thinking" look={0.2} headTilt={8} />
        <Clipboard x={560} y={880} size={90} rotate={-14} />
      </Layer>
    </Stage>
  );
};
const ShotZ10 = runOf<CZ>((c) => [
  { at: c.z10, S: Cracking },
  { at: c.z11, S: Slide, dir: "left", blend: 14 },
]);

// ===============================================================================================================
// Z-12 · the question: the whole rail in the dark, the token hops mark to mark (an arc, 26-f beat, ≈ 20 px/f), the camera pulls
// back the whole shot (zoom 1.32 → 0.92) and the stars stream; WHERE WOULD YOU STOP IT? holds 3.0 s into the end card.
// ===============================================================================================================
const HOPS: MarkId[] = ["today", "geo", "fluid", "stiff", "station", "stiff", "fluid", "geo", "fluid", "stiff"];
const ShotZ12: ShotFC<CZ> = ({ f, len }) => {
  const center = 12400;
  const decade = 300;
  const rx = 1360;
  const beat = 26;
  const k = Math.floor(f / beat);
  const u = ez(mod(f, beat), 0, 16);
  const a = HOPS[k % HOPS.length];
  const b = HOPS[(k + 1) % HOPS.length];
  const km = logLerp(MARKS[a].km, MARKS[b].km, u);
  const ty = railY(km, center, decade);
  const tx = rx - 90 * Math.sin(Math.PI * u);
  const zoom = logLerp(1.32, 0.92, lin(f, 0, len));
  return (
    <Pop f={f}>
      <Stage theme={ABY.theme} cam={{ x: 1100, y: 560, zoom }} vignette={0.26} grain={0.5}>
        <Layer depth={0.1}>
          <NightSky />
        </Layer>
        <Layer depth={0.3}>
          <StarsTint18 f={f} x={-700} y={-500} w={3320} h={2080} n={180} speed={14} angle={200} seed={34} />
        </Layer>
        <Layer depth={1}>
          <DistGauge f={f} family={ABY} center={center} decade={decade} x={rx} speed={10} lit={[a, b]} />
          <Bloom x={tx} y={ty} r={160} color={C.moonRim} strength={0.4} />
          <MoonToken x={tx} y={ty} r={38} f={f} />
          <rect x={720} y={1000} width={420} height={14} rx={7} fill={C.amber} />
          <Tick x={930} y={1000} pxPerM={140} frame={f} facing={1} pose="hips" expression="happy" look={0.9} headTilt={-14 + 6 * Math.sin(f * 0.08)} />
        </Layer>
        <Layer depth={0}>
          <g opacity={lin(f, 6, 20)}>
            <Headline x={110} y={300} lines={["WHERE WOULD YOU", "STOP IT?"]} size={92} color="#FFE2A8" accent={C.moonRim} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneCloser: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCloser(t);
  if (f >= c.end) return null; // the end card (Full.tsx) owns the tail
  const shots: ShotDef<CZ>[] = [
    { from: 0, S: ShotZ01, id: "Z-01" }, // + Z-02, Z-03 (PUSH)
    { from: c.z04, S: ShotZ04, id: "Z-04" },
    { from: c.z05, S: ShotZ05, id: "Z-05" }, // + Z-06 (SLIDE)
    { from: c.z07, S: ShotZ07, id: "Z-07" },
    { from: c.z08, S: ShotZ08, id: "Z-08" },
    { from: c.z09, S: ShotZ09, id: "Z-09" },
    { from: c.z10, S: ShotZ10, id: "Z-10" }, // + Z-11 (PUSH)
    { from: c.z12, S: ShotZ12, id: "Z-12" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCloser = (t: SceneTiming): Cue[] => {
  const c = cuesCloser(t);
  const run = (at: number, n: number, gap = 5, vol = 0.05): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    ...cutHit(0),
    { at: 2, file: SFX.rumble, vol: 0.12, dur: 120, fadeIn: 20, fadeOut: 40 },
    { at: c.z02 + 4, file: SFX.chime, vol: 0.12, dur: 110, fadeOut: 40 },
    { at: c.z03 + 6, file: SFX.click, vol: 0.1, dur: 8 },
    ...cutHit(c.z04),
    { at: c.z04 + 4, file: SFX.swirl, vol: 0.14, dur: 60 },
    ...cutHit(c.z05),
    { at: c.z05 + 6, file: SFX.pop, vol: 0.12, dur: 20 },
    { at: c.z06 + 6, file: SFX.boom, vol: 0.2, dur: 100, fadeOut: 30 },
    ...cutHit(c.z07),
    { at: c.z07, file: SFX.deepWhoosh, vol: 0.22, dur: 70 },
    ...cutHit(c.z08),
    { at: c.z08 + 2, file: SFX.riser, vol: 0.14, dur: 90, fadeOut: 30 },
    ...cutHit(c.z09),
    { at: c.z09 + 12, file: SFX.boom, vol: 0.22, dur: 100, fadeOut: 30 },
    ...cutHit(c.z10),
    { at: c.z10 + 6, file: SFX.debris, vol: 0.16, dur: 120, fadeOut: 40 },
    { at: c.z11 + 2, file: SFX.whoosh, vol: 0.14, dur: 50 },
    ...run(c.z11 + 6, 5, 12, 0.07),
    ...cutHit(c.z12),
    ...run(c.z12 + 8, 6, 26, 0.05),
  ];
};
