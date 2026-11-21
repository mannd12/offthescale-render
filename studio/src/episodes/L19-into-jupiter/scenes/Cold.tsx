// L19 scene "cold" · the question, the hair, the dry spot, the dive (storyboard §3 cold open: C-01…C-14, script lines 0-5).
// Shot components (hard cuts only; PUSH rows are phases of one component):
//   C-01 (+C-02)  the limb shearing in opposite directions under the survey pad; the probe swings on its hook, drops, and the
//                 world scrolls up past it (22 px/f) with the radio tape unspooling behind it
//   C-03          the probe tumbling (6 deg/f) over the limb, the tape printing (30 px/f), the timer disc filling, 58 MIN
//   C-04          the banded disc (bands shearing 14-20 px/f), Earth discs stamping across it, MORE THAN 300 TIMES EARTH'S MASS
//   C-05          the dive at the cloud edge: the limb rises out of frame (24 px/f), haze thickens, the floor line recedes (40 px/f)
//   C-06          Tick (≥ 40 % of the frame) leans over the pad edge; haze bands scroll past (20 px/f); the "?" bobs
//   C-07 (+C-08)  the 156 KM bracket opens beside the tape (pulled down 28 px/f); push to the to-scale ruler across the planet
//                 (head 44 px/f; 1,600 px = 71,492 km, so the 156 km hair is 3.5 px)
//   C-09 (+C-10)  push to the rim of the to-scale section (LESS THAN 0.25 % + OUR SUM); the vertical ruler: HEARD slams on the
//                 hair, the dashed MODEL line draws the rest (44 px/f), OUR SUM drops in, Tick taps it
//   C-11          the tape curls into a "?" over the dry patch (head 40 px/f); the tumbleweed rolls (20 px/f)
//   C-12          pull out: the planet shrinks, bands shear, the entry cross pulses rings (20 px/f), ONE SPOT?
//   C-13 (+C-14)  the dive through the cloud tops (30 px/f) with the title lower-third; the shield plate turns, GETTING IN
// Numbers drawn (data19 READ): min58 58 (#2, #3 A) · mass300 300 (#8 A) · km156 156 (#4 A) · km71k 71,000 (#8 A, to scale) ·
// pct025 0.25 (#9 C, OUR SUM). Dial numerals are SCALE_LABELS. No people (F1); the cactus is the scientists' joke (F14, #6).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Embers, Headline, Layer, Sky, Stage, Tick } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { ShotDef, ShotFC, playShots } from "../shots";
import { BarDial } from "../dial";
import { TapeTicket, TapeTrace } from "../tape";
import { DeckBands, DryPatch, Wisps } from "../decks";
import { Capsule, ShieldPlate } from "../probe19";
import { Section } from "../interior";
import { AgencyPill, OurSumPill, QuestionTag, WordPill } from "../tags19";
import { Sparks } from "../flows19";
import { Tumbleweed } from "../icons19";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  C,
  CREST,
  ClipBox,
  ClipCircle,
  Clipboard,
  Cross,
  DRIFT,
  Descent,
  DriftBands,
  FloorSearch,
  FurnaceField,
  KickerA,
  LIMB,
  Limb,
  MetricA,
  Pad,
  Phase,
  Plate,
  Pop,
  Ribbon,
  Rings,
  Roll,
  SpaceField,
  Station,
  TimerDisc,
  VBracket,
  ez,
  lerp,
  lin,
  wrap,
} from "./a-parts";

export const cuesCold = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    c02: frac(0, 0.38), // phase of C-01 ("A real spacecraft already did")
    c03: frac(0, 0.72),
    c04: at(1),
    c05: frac(1, 0.44),
    c06: frac(1, 0.76),
    c07: at(2),
    c08: frac(2, 0.52), // phase of C-07 ("Jupiter's radius is")
    c09: at(3),
    c10: frac(3, 0.45), // phase of C-09 ("That is our sum")
    c11: at(4),
    c12: frac(4, 0.38),
    c13: frac(4, 0.72),
    c14: at(5), // phase of C-13 ("First, getting in")
    end: t.frames,
  };
};
export type CCold = ReturnType<typeof cuesCold>;

// ================================================================================================================
// C-01 + C-02 · the pad over the shearing limb (bands ±16-24 px/f, stars 12 px/f, pad bob, probe swing 6 px/f); the probe
// drops and the world scrolls up past it at 22 px/f while the tape unspools from the hook in a wavering line (30 px/f)
// ================================================================================================================
const ShotPad: ShotFC<CCold> = ({ f, c }) => {
  const T2 = c.c02;
  const g = Math.max(0, f - T2);
  const rise = 22 * Math.max(0, g - 6);
  const bob = Math.sin(f * 0.15) * 6;
  const padY = 330 + bob - rise;
  const hookX = 560;
  const hookY = padY - 110;
  const swing = Math.sin(f * 0.2) * 30;
  const px = g > 0 ? hookX + swing * Math.exp(-g / 20) : hookX + swing;
  const py = g > 0 ? Math.min(600, hookY + rise + 80 + 0.55 * g * g) : hookY + 80;
  return (
    <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(1, 1.1, 0.02, 0.03)} vignette={0.3} grain={0.5}>
      <SpaceField f={f} speed={12} angle={180} n={110} seed={1} />
      <Layer depth={1}>
        <Limb f={f} cx={960} cy={430 + 2600 - rise} R={2600} shear={[16, -20, 24, -18, 20, -22]} />
        <BarDial f={f} cx={1640} cy={250 - rise * 0.6} r={120} needle={0} />
        {/* the crane arm and hook on the pad */}
        <line x1={470} y1={padY} x2={470} y2={hookY - 20} stroke={C.goldRim} strokeWidth={8} />
        <line x1={466} y1={hookY - 20} x2={hookX + 10} y2={hookY - 20} stroke={C.goldRim} strokeWidth={8} />
        {g <= 0 ? <line x1={hookX} y1={hookY - 20} x2={px} y2={py - 60} stroke={C.goldRim} strokeWidth={4} /> : null}
        {g > 0 ? <Ribbon f={f} pts={[[hookX, hookY - 16], [lerp(hookX, px, 0.5) + 30, lerp(hookY, py, 0.5)], [px, py - 50]]} speed={30} amp={16} width={12} /> : null}
        <Pad x={180} y={padY} w={360} f={f} />
        <Tick x={300} y={padY} pxPerM={110} frame={f} pose="hold" expression={g > 4 ? "surprised" : "thinking"} look={g > 4 ? 0.5 : 0.2} headTilt={g > 4 ? 14 : 0} />
        <Clipboard x={338} y={padY - 118} size={46} rotate={-8} />
        <Capsule x={px} y={py} r={44} f={f} chips={6} tilt={g > 0 ? g * 5 : swing * 0.3} />
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// C-03 · the probe tumbling (6 deg/f) above the limb (bands shearing), the tape printing a wavering line (30 px/f) with
// its timer to 58:00, the timer disc filling with its hand (12 deg/f); 58 MIN
// ================================================================================================================
const ShotTimer: ShotFC<CCold> = ({ f, len }) => {
  const k = lin(f, 2, len - 4);
  return (
    <Pop f={f}>
      <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(2)} vignette={0.3} grain={0.5}>
        <SpaceField f={f} speed={14} angle={160} n={100} seed={3} />
        <Layer depth={1}>
          <Limb f={f} cx={960} cy={700 + 2400} R={2400} shear={[20, -18, 22, -24, 16, -20]} seed={2} />
          <Ribbon f={f} pts={[[780, -60], [800, 240]]} speed={30} amp={12} width={12} />
          <Capsule x={800} y={300} r={64} f={f} chips={6} tilt={f * 6} glow={0.3} />
          <TapeTrace f={f} x={140} y={560} w={1120} h={90} mode="wave" speed={30} timer={k} />
          <TimerDisc x={1530} y={360} r={190} k={k} f={f} />
        </Layer>
        <Layer depth={0}>
          <MetricA x={110} y={220} value={String(58) /* #2, #3 */} unit="MIN" size={130} reveal={lin(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-04 · the banded disc (shear 14-20 px/f) with small Earth discs stamping across it (head ~50 px/f), the camera pulling
// back; MORE THAN 300 TIMES EARTH'S MASS (the stamps are a count gesture, not a to-scale claim, F8)
// ================================================================================================================
const STAMPS = (() => {
  const out: [number, number][] = [];
  for (let y = -440; y <= 440; y += 58) for (let x = -460; x <= 460; x += 50) if (x * x + y * y < 450 * 450) out.push([x, y]);
  return out;
})();
const ShotMass: ShotFC<CCold> = ({ f, len }) => {
  const cx = 1260;
  const cy = 560;
  const n = Math.floor(f * 1.1);
  return (
    <Pop f={f}>
      <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(3, 0.9, 0.03)} vignette={0.3} grain={0.5}>
        <SpaceField f={f} speed={10} n={120} seed={4} />
        <Layer depth={1}>
          <Limb f={f} cx={cx} cy={cy} R={500} shear={[14, -18, 20, -16, 18, -20]} seed={3} />
          {STAMPS.slice(0, n).map(([x, y], i) => {
            const a = Math.min(1, (f * 1.1 - i) / 6);
            return (
              <g key={i} transform={`translate(${cx + x} ${cy + y}) scale(${(1.8 - 0.8 * a).toFixed(2)})`} opacity={0.4 + 0.6 * a}>
                <circle r={15} fill={C.earth} stroke="#FFE2A8" strokeWidth={3} />
                <circle cx={-4} cy={-4} r={5} fill="#9FEFF8" opacity={0.7} />
              </g>
            );
          })}
        </Layer>
        <Layer depth={0}>
          <Roll x={110} y={560} k={lin(f, 6, len - 20)} rkey="mass300" prefix="MORE THAN" suffix="TIMES EARTH'S MASS" size={170} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-05 · the dive at the cloud edge: the limb rises out of the frame (24 px/f) and turns to haze, wisps of mist (16 px/f),
// the dotted floor line keeps drawing below and receding (40 px/f); NASA SAYS + NO TRUE SURFACE (#10)
// ================================================================================================================
const ShotNoSurface: ShotFC<CCold> = ({ f }) => {
  const top = 280 - 24 * f;
  return (
    <Pop f={f}>
      <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(4, 1.14, 0.02, 0.02)} vignette={0.3} grain={0.5}>
        <SpaceField f={f} speed={16} angle={270} n={90} seed={5} />
        <Layer depth={1}>
          <Limb f={f} cx={960} cy={top + 3000} R={3000} shear={[22, -18, 24, -20, 16, -22]} seed={4} />
          <rect x={-200} y={top + 120} width={2320} height={1400} fill="#A8300C" opacity={Math.min(0.55, 0.2 + f * 0.004)} />
          <Wisps f={f} x={0} y={0} w={1920} h={1080} n={12} speed={16} color="#FFC27A" />
          <FloorSearch f={f} y={Math.max(560, top + 360)} speed={40} />
        </Layer>
        <Layer depth={0}>
          <AgencyPill x={120} y={150} agency="NASA SAYS" size={34} appear={lin(f, 6, 16)} />
          <WordPill x={120} y={225} text="NO TRUE SURFACE" F={LIMB} size={34} appear={lin(f, 12, 22)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-06 · Tick (≥ 40 % of the frame) tips his head over the pad edge; the haze bands scroll up past below (20 px/f), stars
// rise (12 px/f), the "?" tag bobs
// ================================================================================================================
const ShotLookDown: ShotFC<CCold> = ({ f }) => {
  const bob = Math.sin(f * 0.12) * 5;
  return (
    <Pop f={f}>
      <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(5, 1.1, 0.03)} vignette={0.3} grain={0.5}>
        <SpaceField f={f} speed={12} angle={270} n={90} seed={6} />
        <Layer depth={1}>
          <Bloom x={960} y={900} r={900} color="#FF8A3D" strength={0.35} />
          <DeckBands f={f} speed={20} shear={[18, -22, 16, -20]} y={660} h={420} colors={[C.stripeOrange, C.stripeAmber, C.stripeRust, "#F28A1E", C.belt]} seed={6} />
          <rect x={-100} y={640} width={2120} height={80} fill="#A8300C" opacity={0.5} />
          <Pad x={520} y={640 + bob} w={640} f={f} />
          <Tick x={820} y={640 + bob} pxPerM={254} frame={f} pose="lean" expression="thinking" headTilt={16 + Math.sin(f * 0.1) * 4} look={0.6} />
          <QuestionTag x={1150} y={230} f={f} size={90} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-07 + C-08 · the tape pulled down out of the probe (28 px/f) through the 156 KM bracket (opens at 40 px/f) beside the BAR
// dial, Tick pointing his pencil at it; push to the to-scale ruler across the planet face: head 44 px/f, then a pulse runs
// toward the centre (28 px/f); the planet's bands shear underneath. 1,600 px = 71,492 km (#8), so 156 km (#4) = 3.5 px.
// ================================================================================================================
const VTape: React.FC<{ f: number; x: number; y0: number; y1: number; speed: number }> = ({ f, x, y0, y1, speed }) => (
  <g>
    <rect x={x - 26} y={y0} width={52} height={y1 - y0} fill={C.heard} />
    <rect x={x - 26} y={y0} width={8} height={y1 - y0} fill={C.lemonDeep} />
    <ClipBox x={x - 26} y={y0} w={52} h={y1 - y0}>
      {Array.from({ length: Math.ceil((y1 - y0) / 40) + 2 }, (_, i) => (
        <rect key={i} x={x + 12} y={y0 - 40 + wrap(i * 40 + f * speed, Math.ceil((y1 - y0) / 40 + 2) * 40)} width={8} height={16} rx={3} fill={C.lemonDeep} />
      ))}
    </ClipBox>
    <Ribbon f={-f} pts={[[x - 6, y0], [x - 6, y1]]} speed={speed} amp={9} width={4} color={C.ink} />
  </g>
);
const ShotRuler: ShotFC<CCold> = ({ f, c, len }) => {
  const T8 = c.c08 - c.c07;
  const A = (
    <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(6, 1.1, 0.03)} vignette={0.3} grain={0.5}>
      <SpaceField f={f} speed={10} n={100} seed={7} />
      <Layer depth={1}>
        <Limb f={f} cx={960} cy={860 + 2600} R={2600} shear={[18, -20, 16, -22, 20, -18]} seed={5} />
        <VTape f={f} x={760} y0={210} y1={1100} speed={28} />
        <Capsule x={760} y={170} r={62} f={f} chips={6} />
        <VBracket x={860} y0={226} y1={786} draw={lin(f, 8, 22)} />
        <BarDial f={f} cx={1560} cy={320} r={180} needle={0} lit={lin(f, 0, 50) * 12} />
        <Pad x={150} y={990} w={380} f={f} />
        <Tick x={290} y={990} pxPerM={170} frame={f} pose="point" expression="determined" look={0.3} />
      </Layer>
      <Layer depth={0}>
        <Roll x={920} y={560} k={lin(f, 14, 70)} rkey="km156" unit="KM" size={130} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T8);
  const X0 = 200;
  const L = 1600;
  const head = L * lin(g, 4, 40);
  const pulse = X0 + wrap(g * 28, L);
  const B = (
    <Stage theme={LIMB.theme} shotFrame={g} drift={DRIFT(7, 1.12, 0.04)} vignette={0.3} grain={0.5}>
      <SpaceField f={f} speed={10} n={90} seed={8} />
      <Layer depth={1}>
        <Limb f={f} cx={X0 + L} cy={700} R={L} shear={[16, -20, 22, -18, 24, -16]} seed={6} />
        <rect x={X0} y={694} width={head} height={12} fill="#1A0402" opacity={0.5} />
        <rect x={X0} y={690} width={head} height={10} fill={C.heard} />
        {Array.from({ length: 41 }, (_, i) => (i * 40 <= head ? <rect key={i} x={X0 + i * 40 - 2} y={i % 5 ? 676 : 664} width={4} height={i % 5 ? 14 : 26} fill={C.heard} /> : null))}
        {g > 40 ? <circle cx={pulse} cy={695} r={14} fill={C.goldHot} /> : null}
        <circle cx={X0 + head} cy={695} r={g < 40 ? 16 : 0} fill={C.goldHot} />
        {/* the hair: 156 / 71,492 of 1,600 px = 3.5 px, ringed so it can be found */}
        <rect x={X0} y={680} width={(156 / 71492) * L} height={30} fill={C.goldHot} />
        <circle cx={X0 + 2} cy={695} r={34 + 4 * Math.sin(g * 0.3)} fill="none" stroke={C.goldHot} strokeWidth={4} />
        <line x1={X0 - 10} y1={665} x2={X0 - 60} y2={520} stroke={C.goldHot} strokeWidth={4} />
      </Layer>
      <Layer depth={0}>
        <rect x={80} y={90} width={760} height={230} rx={30} fill="rgba(26,4,2,0.62)" />
        <Roll x={110} y={270} k={lin(g, 10, len - T8 - 30)} rkey="km71k" prefix="MORE THAN" unit="KM" size={110} />
        <Plate x={60} y={490} text="156 KM" size={30} appear={lin(g, 30, 40)} />
        <Plate x={60} y={1000} text="TO SCALE" size={30} appear={lin(g, 20, 30)} stroke={C.heard} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T8 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// C-09 + C-10 · the push toward the rim of the to-scale section (rings sliding past as it grows, layers turning 4 deg/f,
// embers rising); LESS THAN 0.25 % + OUR SUM (#9 C). Then the vertical ruler down the planet's radius: HEARD slams onto
// the hair at its top, the dashed MODEL line draws down all the rest (44 px/f), the MODEL ticket draws on and swings, OUR
// SUM drops in (30 px/f), Tick taps it; the bands shear behind
// ================================================================================================================
const ShotSection: ShotFC<CCold> = ({ f, c }) => {
  const T10 = c.c10 - c.c09;
  const s = 1 + 1.8 * lin(f, 0, T10 + 10);
  const A = (
    <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(8, 1.06, 0.02)} vignette={0.3} grain={0.5}>
      <FurnaceField f={f} seed={9} />
      <Layer depth={1}>
        <g transform={`translate(960 520) scale(${s.toFixed(3)}) translate(-960 -520)`}>
          <Section f={f} cx={960} cy={1520} radius={1000} layers={["gas", "liquid", "metal"]} core="dilute" toScale swirl={4} />
          <circle cx={960} cy={520} r={30 / s + 10} fill="none" stroke={C.heard} strokeWidth={4 / s + 1} />
        </g>
        <Embers frame={f} x0={0} x1={1920} y={1080} n={40} color={C.goldHot} />
      </Layer>
      <Layer depth={0}>
        <rect x={80} y={110} width={820} height={260} rx={30} fill="rgba(26,4,2,0.55)" />
        <Roll x={110} y={290} k={lin(f, 8, 90)} rkey="pct025" prefix="LESS THAN" unit="%" dec={2} size={130} />
        <OurSumPill x={120} y={340} size={30} appear={lin(f, 30, 40)} />
        <Plate x={1010} y={440} text="156 KM" size={28} appear={lin(f, 10, 20)} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T10);
  const X = 820;
  const top = 210;
  const R = 900;
  const draw = lin(g, 10, 30);
  const pillY = 600 - Math.max(0, 90 - (g - 34) * 30);
  const B = (
    <Stage theme={LIMB.theme} shotFrame={g} drift={DRIFT(9, 1.1, 0.04)} vignette={0.3} grain={0.5}>
      <SpaceField f={f} speed={10} n={90} seed={10} />
      <Layer depth={1}>
        <Limb f={f} cx={X} cy={top + R} R={R} shear={[18, -22, 20, -16, 24, -18]} seed={7} />
        <rect x={X - 6} y={top} width={12} height={R} fill={C.goldRim} opacity={0.9} />
        <rect x={X - 6} y={top} width={12} height={(156 / 71492) * R + 1} fill={C.heard} />
        <line x1={X + 36} y1={top + 8} x2={X + 36} y2={top + 8 + (1080 - top) * draw} stroke={C.model} strokeWidth={12} strokeDasharray="26 16" strokeDashoffset={-g * 6} />
        {draw > 0 && draw < 1 ? <circle cx={X + 36} cy={top + 8 + (1080 - top) * draw} r={14} fill={C.goldHot} /> : null}
        <Sparks f={g} x={X + 80} y={top - 10} w={320} h={80} n={22} mode="trail" angle={10} />
        <TapeTicket x={X + 230} y={top - 40} word="HEARD" f={g} slam={lin(g, 4, 14)} swing={14} size={0.85} />
        <TapeTicket x={X + 240} y={640} word="MODEL" f={g + 11} draw={lin(g, 16, 46)} swing={16} size={0.95} />
        <Tick x={310} y={1010} pxPerM={210} frame={g} pose="point" expression="happy" look={0.3} />
      </Layer>
      <Layer depth={0}>{g >= 34 ? <OurSumPill x={240} y={pillY} size={40} /> : null}</Layer>
    </Stage>
  );
  return <Phase f={f} at={T10 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// C-11 · the tape curls into a "?" over the dry patch (head 40 px/f, then its waves keep travelling), the tumbleweed rolls
// across the patch (20 px/f), the cloud bands slide (14 px/f); Tick tilts his head at the cactus (F14: the joke; #6)
// ================================================================================================================
const Q_PATH = "M1010 300 C1000 130 1300 110 1300 260 C1300 360 1150 350 1150 450";
const ShotDryJoke: ShotFC<CCold> = ({ f }) => {
  const d = lin(f, 0, 22);
  const tw = 930 + wrap(f * 20, 460);
  return (
    <Pop f={f}>
      <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(10, 1.1, 0.05)} vignette={0.2} grain={0.5}>
        <Descent f={f} fam="crest" speed={0} shear={[14, -16, 15, -12, 16, -14]} seed={11} />
        <Layer depth={1}>
          <DryPatch f={f} x={1160} y={720} r={240} open={1} props />
          <Tumbleweed x={tw} y={790} size={70} rotate={f * 14} />
          <path d={Q_PATH} fill="none" stroke="#1A0402" strokeWidth={30} opacity={0.25} pathLength={1} strokeDasharray={`${d} 1`} transform="translate(6 10)" />
          <path d={Q_PATH} fill="none" stroke={C.heard} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={`${d} 1`} />
          <path d={Q_PATH} fill="none" stroke={C.lemonDeep} strokeWidth={6} strokeDasharray="12 18" strokeDashoffset={-f * 30} opacity={d >= 1 ? 1 : 0} />
          {d >= 1 ? <circle cx={1150} cy={520 + Math.sin(f * 0.3) * 6} r={20} fill={C.heard} stroke={C.lemonDeep} strokeWidth={5} /> : null}
          <Tick x={380} y={1010} pxPerM={200} frame={f} pose="think" expression="happy" headTilt={-14 + Math.sin(f * 0.08) * 4} look={0.5} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-12 · pull out: the banded planet shrinks (radius 900 → 380) while its bands shear (18-24 px/f); the entry cross pulses
// rings outward (20 px/f); ONE SPOT?
// ================================================================================================================
const ShotOneSpot: ShotFC<CCold> = ({ f, len }) => {
  const R = lerp(900, 380, ez(f, 0, len));
  const cx = 1180;
  const cy = 560;
  return (
    <Pop f={f}>
      <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(11, 1.04, 0.03)} vignette={0.25} grain={0.5}>
        <Sky family={CREST} />
        <DriftBands f={f} color="#FFE066" opacity={0.4} speed={7} n={3} w={500} angle={-24} seed={12} />
        <Layer depth={1}>
          <Limb f={f} cx={cx} cy={cy} R={R} shear={[18, -24, 20, -22, 24, -18]} glow={0.6} shade={0.25} seed={8} />
          <Cross x={cx - R * 0.18} y={cy + R * 0.12} s={Math.max(6, R * 0.02)} />
          <Rings f={f} x={cx - R * 0.18} y={cy + R * 0.12} speed={20} max={220} n={3} color="#FFF0A0" width={8} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={120} y={170} text="ONE SPOT?" F={CREST} size={44} appear={lin(f, 8, 18)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-13 + C-14 · the dive through the cloud tops (bands scroll up 30 px/f, wisps 28 px/f) with the probe's streak and the
// title lower-third (its rule drawing 40 px/f); Tick nods in the station window. Then the shield plate turns toward the
// camera (10 deg/f) while a bright streak crosses the top (36 px/f) and the bands rush up (24 px/f); GETTING IN
// ================================================================================================================
const ShotTitle: ShotFC<CCold> = ({ f, c }) => {
  const T14 = c.c14 - c.c13;
  const tIn = lin(f, 6, 14);
  const tOut = 1 - lin(f, 80, 92);
  const rule = Math.min(980, Math.max(0, f - 8) * 40);
  const A = (
    <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(12, 1.12, 0.02, 0.03)} vignette={0.2} grain={0.5}>
      <Descent f={f} fam="crest" speed={30} shear={[18, -22, 24, -20, 16, -18]} seed={13} />
      <Layer depth={1}>
        <Wisps f={f} x={0} y={0} w={1920} h={1080} n={14} speed={28} />
        <rect x={938} y={-40} width={44} height={300} rx={22} fill="#FFF0A0" opacity={0.5} />
        <rect x={952} y={-40} width={16} height={300} fill={C.goldHot} strokeDasharray="20 20" />
        <Capsule x={960} y={300} r={46} f={f} chips={6} glow={0.5} />
        {/* the station window: Tick nods at the planet */}
        <rect x={1490} y={70} width={340} height={300} rx={26} fill={C.emeraldDeep} />
        <ClipBox x={1504} y={84} w={312} h={272} rx={18}>
          <Station f={f} desk={330} pan={5} seed={14} />
          <Tick x={1660} y={340} pxPerM={130} frame={f} pose="stand" expression="determined" headTilt={Math.sin(f * 0.25) * 10} look={-0.3} />
        </ClipBox>
        <rect x={1504} y={84} width={312} height={272} rx={18} fill="none" stroke={C.goldRim} strokeWidth={6} />
      </Layer>
      <Layer depth={0}>
        <g opacity={tIn * tOut}>
          <rect x={80} y={700} width={1040} height={250} rx={30} fill="rgba(26,4,2,0.74)" />
          <Headline x={120} y={790} lines={["WHAT IF YOU FELL", "INTO JUPITER?"]} size={78} color="#FFEFC8" accent={C.heard} rule={false} />
          <rect x={120} y={915} width={rule} height={8} rx={4} fill={C.heard} />
        </g>
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T14);
  const B = (
    <Stage theme={CREST.theme} shotFrame={g} drift={DRIFT(13, 1.12, 0.03)} vignette={0.2} grain={0.5}>
      <Descent f={f} fam="crest" speed={24} shear={[20, -24, 22, -18, 26, -20]} seed={15} />
      <Layer depth={1}>
        <rect x={-400 + g * 36} y={110} width={520} height={18} rx={9} fill="#FFF6C8" opacity={0.9} />
        <rect x={-700 + g * 36} y={104} width={820} height={30} rx={15} fill={C.goldHot} opacity={0.35} />
        <Sparks f={g} x={960} y={560} w={900} h={260} n={40} mode="trail" angle={250} />
        <ShieldPlate x={960} y={560} r={lerp(90, 230, lin(g, 0, 60))} f={g} glow={1} tumble={10} />
      </Layer>
      <Layer depth={0}>
        <KickerA x={140} y={170} text="GETTING IN" appear={lin(g, 2, 10)} size={34} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T14 - 6} dur={12} kind="push" a={A} b={B} />;
};

// ================================================================================================================

export const SceneCold: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCold(t);
  const shots: ShotDef<CCold>[] = [
    { from: 0, S: ShotPad, id: "C-01" }, // + C-02
    { from: c.c03, S: ShotTimer, id: "C-03" },
    { from: c.c04, S: ShotMass, id: "C-04" },
    { from: c.c05, S: ShotNoSurface, id: "C-05" },
    { from: c.c06, S: ShotLookDown, id: "C-06" },
    { from: c.c07, S: ShotRuler, id: "C-07" }, // + C-08
    { from: c.c09, S: ShotSection, id: "C-09" }, // + C-10
    { from: c.c11, S: ShotDryJoke, id: "C-11" },
    { from: c.c12, S: ShotOneSpot, id: "C-12" },
    { from: c.c13, S: ShotTitle, id: "C-13" }, // + C-14
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCold = (t: SceneTiming): Cue[] => {
  const c = cuesCold(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 0, file: SFX.rumble, vol: 0.12, dur: c.c03, fadeIn: 30, fadeOut: 30 },
    { at: c.c02 + 6, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.c03),
    ...run(c.c03 + 4, 6, 8),
    ...cutHit(c.c04),
    ...run(c.c04 + 6, 8, 6),
    ...cutHit(c.c05),
    { at: c.c05 + 2, file: SFX.swirl, vol: 0.2, dur: 60 },
    ...cutHit(c.c06),
    { at: c.c06 + 8, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.c07),
    { at: c.c07 + 8, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.c08 - 4, file: SFX.whoosh, vol: 0.16, dur: 40 },
    ...cutHit(c.c09),
    { at: c.c09 + 4, file: SFX.riser, vol: 0.18, dur: c.c10 - c.c09, fadeOut: 20 },
    { at: c.c10 + 4, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.c10 + 12, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.c11),
    { at: c.c11 + 4, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.c12),
    { at: c.c12 + 2, file: SFX.swirl, vol: 0.18, dur: 60 },
    ...cutHit(c.c13),
    { at: c.c13 + 2, file: SFX.deepWhoosh, vol: 0.24, dur: 70 },
    { at: c.c14 - 4, file: SFX.riser, vol: 0.2, dur: c.end - c.c14 + 4, fadeOut: 12 },
  ];
};
