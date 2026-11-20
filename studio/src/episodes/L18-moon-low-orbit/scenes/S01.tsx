// L18 scene "l01" · the sky (storyboard §3 scene 1: 1-01…1-09, script lines 3-6; `bowl` throughout). The half-circle
// sky is honest geometry: the observer stands at the bowl's centre (960, 900), the Moon's centre is D = 500 px above
// him, so a disc of radius D·sin(half-angle) subtends exactly the bracket's angle (1-03: 78°, radius 315).
// Shot components (hard cuts only; PUSH/SLIDE rows are phases of one component):
//   1-01 (+1-02)        the degree arc and the pointer sweeping it (3 deg/f, ping-pong); the coin Moon; ABOUT HALF A
//                       DEGREE; push to Tick holding the pea at arm's length over the tiny Moon, the cloud band streaming
//   1-03                the coin swells to the 78° wedge (bracket arms 5 px/f), the counter rolls to 78 DEGREES
//   1-04 (+1-05, 1-06)  the bright edge sweeping the 180° arc (40 px/f, looping); the wedge filling and the bar under
//                       the arc filling to 78/180; push to the giant disc with 150 tiny Moons stamped across its diameter
//   1-07                KEY ART 1: the Moon over two thirds of the sky, crater map + grid gliding overhead (22 px/f)
//   1-08 (+1-09)        close on the face: craters sliding (26 px/f), the terminator sweeping (18 px/f); slide to the
//                       Moon sweeping across the sky (40 px/f) with its trail, the clock, Tick ducking then pointing
// Numbers drawn (data18 READ): halfDeg (#12 C, OUR SUM) · deg78 78 (#12 C, OUR SUM) · sky180 180 (#12 A) ·
// times150 150 (#12 C, OUR SUM); the 0° · 90° · 180° arc numerals are SCALE_LABELS. The crater map has no names (Q11).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Layer, Motes, Stage, Tick, alpha } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { MoonToken } from "../gauge";
import { MoonFace, SkyBowl } from "../sky";
import { DayClock } from "../orbit";
import { OurSumPill, WordPill } from "../tags18";
import { PeaIcon } from "../icons18";
import { Trail, trailOf } from "../movers18";
import { READ } from "../data18";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { BOWL, BowlGround, BowlSky, C, ClipCircle, CloudBand, DriftBands, MetricA, Phase, Pop, Readout, cl01, ez, lin, tri, wrap } from "./a-parts";

export const cuesL01 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    s01: 0,
    s02: p(0, "That is about the width of a pea"), // phase (push)
    s03: at(1),
    s04: p(1, "The sky from one horizon"),
    s05: p(1, "So one Moon would stretch"), // phase (same set)
    s06: at(2), // phase (push)
    s07: p(2, "Its craters"),
    s08: p(2, "and every one of them would be in motion"),
    s09: at(3), // phase (slide)
    end: t.frames,
  };
};
export type CL01 = ReturnType<typeof cuesL01>;

const CX = 960;
const HZ = 900;
const RB = 760; // the arc radius
const D = 500; // the Moon centre's height above the observer
const D2R = Math.PI / 180;

// ================================================================================================================
// 1-01 + 1-02 · the arc with the pointer ping-ponging 0 → 180 (3 deg/f, 40 px/f at the rim), clouds 14 px/f, the
// coin Moon at the top; push to Tick with the pea at arm's length covering the tiny Moon, clouds streaming 16 px/f
// ================================================================================================================
const ShotArc: ShotFC<CL01> = ({ f, c }) => {
  const T2 = c.s02 - c.s01;
  const ptr = 180 * tri(f, 120);
  const A = (
    <Stage theme={BOWL.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 120, seed: 1 }} vignette={0.2} grain={0.5}>
      <BowlSky f={f} horizon={HZ} />
      <Layer depth={1}>
        <SkyBowl f={f} family={BOWL} cx={CX} horizon={HZ} R={RB} pointer={ptr} numerals clouds={14} />
        <Bloom x={CX} y={HZ - D} r={60} color={C.moonRim} strength={0.6} />
        <circle cx={CX} cy={HZ - D} r={20} fill="none" stroke={C.moonRim} strokeWidth={2} opacity={0.7} />
        <MoonToken x={CX} y={HZ - D} r={6} f={f} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={110} y={130} text={READ.halfDeg.text} size={30} appear={lin(f, 8, 18)} />
        <OurSumPill x={110} y={196} size={28} appear={lin(f, 14, 24)} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T2);
  const drift = g * 3;
  const hand: [number, number] = [470 + 204 + drift, 1090 - 372];
  const B = (
    <Stage theme={BOWL.theme} shotFrame={g} drift={{ zoom: 1.03, panX: 0.008, panY: 0, frames: 140, seed: 2 }} vignette={0.2} grain={0.5}>
      <BowlSky f={g} horizon={920} seed={2} />
      <Layer depth={0.5}>
        <CloudBand f={g} y={560} speed={-16} n={9} seed={3} h={360} />
        <BowlGround horizon={920} />
        <CloudBand f={g} y={900} speed={-12} n={7} seed={5} h={60} />
      </Layer>
      <Layer depth={1}>
        <Bloom x={hand[0] + 4} y={hand[1] - 2} r={70} color={C.moonRim} strength={0.6} />
        <MoonToken x={hand[0] + 6} y={hand[1] - 3} r={11} f={g} />
        <Tick x={470 + drift} y={1090} pxPerM={300} frame={g} pose="point" expression="thinking" look={0.5} headTilt={-6} />
        <PeaIcon x={hand[0]} y={hand[1]} size={27} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T2 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 1-03 · the coin swells into the 78° wedge (radius D·sin(half), bracket arms 5 px/f), craters scroll 18 px/f, the
// counter tracks the angle and ends on 78 DEGREES; tiny Tick at the bowl's centre, head back
// ================================================================================================================
const ShotSwell: ShotFC<CL01> = ({ f }) => {
  const u = lin(f, 6, 112);
  const half = 0.26 + (39.1 - 0.26) * u; // #12: 78.2° wide straight underneath
  const rho = D * Math.sin(half * D2R);
  return (
    <Pop f={f}>
      <Stage theme={BOWL.theme} shotFrame={f} drift={{ zoom: 0.93, panX: 0.008, panY: 0, frames: 150, seed: 3 }} vignette={0.2} grain={0.5}>
        <BowlSky f={f} horizon={HZ} seed={3} />
        <Layer depth={1}>
          <SkyBowl f={f} family={BOWL} cx={CX} horizon={HZ} R={RB} wedge={[90 - half, 90 + half]} clouds={14} />
          <Bloom x={CX} y={HZ - D} r={rho * 1.6 + 60} color={C.moonRim} strength={0.45} />
          {rho < 10 ? <MoonToken x={CX} y={HZ - D} r={Math.max(6, rho)} f={f} /> : <MoonFace f={f} x={CX} y={HZ - D} radius={rho} scroll={18} />}
          <Tick x={CX} y={HZ} pxPerM={52} frame={f} pose="stand" expression="surprised" headTilt={-18} look={0.2} />
        </Layer>
        <Layer depth={0}>
          <Readout x={80} y={150} k={cl01((2 * half) / 78)} rkey="deg78" unit="DEGREES" size={100} />
          <OurSumPill x={90} y={212} size={28} appear={lin(f, 30, 40)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-04 + 1-05 + 1-06 · the bright edge sweeps the arc 0 → 180 (40 px/f, looping) as the numerals light; the 78° wedge
// fills (fill front) and the bar under the arc fills to 78/180 (NEARLY HALF); push to the giant disc with 150 tiny
// Moons stamped across its diameter (head 15 px/f) while its craters scroll (20 px/f)
// ================================================================================================================
const ShotHalf: ShotFC<CL01> = ({ f, c }) => {
  const T5 = c.s05 - c.s04;
  const T6 = c.s06 - c.s04;
  const half = 39.1;
  const sweep = Math.min(180, wrap(f * 3, 214));
  const g = Math.max(0, f - T5);
  const fill = lin(g, 0, 36);
  const barW = 2 * RB; // 180° → 1,520 px
  const bar = lin(g, 6, 40) * barW * (78.2 / 180); // #12: 78.2 / 180
  const stripe = wrap(f * 3, 40);
  const A = (
    <Stage theme={BOWL.theme} shotFrame={f} drift={{ zoom: 1.05, panX: -0.01, panY: 0, frames: 220, seed: 4 }} vignette={0.2} grain={0.5}>
      <BowlSky f={f} horizon={HZ} seed={4} />
      <Layer depth={1}>
        <SkyBowl f={f} family={BOWL} cx={CX} horizon={HZ} R={RB} sweep={sweep} numerals wedge={[90 - half, 90 + half]} wedgeFill={fill} clouds={14} />
        <MoonFace f={f} x={CX} y={HZ - D} radius={D * Math.sin(half * D2R)} scroll={18} rim={0.8} ghost={0.55 * fill} />
        {g > 0 ? (
          <g>
            <rect x={CX - RB} y={HZ + 70} width={barW} height={46} rx={23} fill="rgba(1,18,27,0.55)" stroke={C.amber} strokeWidth={3} />
            <rect x={CX - RB} y={HZ + 70} width={Math.max(46, bar)} height={46} rx={23} fill={C.amber} />
            {Array.from({ length: Math.ceil(bar / 40) + 1 }, (_, i) => {
              const x = CX - RB + i * 40 + stripe - 40;
              return x > CX - RB + 10 && x < CX - RB + bar - 14 ? <line key={i} x1={x} y1={HZ + 74} x2={x + 18} y2={HZ + 112} stroke="#FFE08A" strokeWidth={8} opacity={0.6} /> : null;
            })}
            <circle cx={CX - RB + bar} cy={HZ + 93} r={30 + 6 * Math.sin(f / 4)} fill={C.moonRim} opacity={0.35} />
            <line x1={CX} y1={HZ + 60} x2={CX} y2={HZ + 126} stroke="#FFEFC8" strokeWidth={4} strokeDasharray="6 6" />
          </g>
        ) : null}
      </Layer>
      <Layer depth={0}>
        {g <= 0 ? <MetricA x={110} y={180} value="180" unit="DEGREES" size={100} reveal={lin(f, 4, 16)} /> : <WordPill x={CX - RB + bar + 50} y={HZ + 93} text="NEARLY HALF" size={30} appear={lin(g, 30, 40)} />}
      </Layer>
    </Stage>
  );
  const h = Math.max(0, f - T6);
  const R6 = 520;
  const mx = 1060;
  const my = 600;
  const n = Math.min(150, Math.floor(lin(h, 4, 80) * 150));
  const headX = mx - R6 + (n / 150) * 2 * R6;
  const scan = mx - R6 + wrap((h - 80) * 22, 2 * R6);
  const B = (
    <Stage theme={BOWL.theme} shotFrame={h} drift={{ zoom: 1.04, panX: 0.012, panY: 0, frames: 140, seed: 5 }} vignette={0.2} grain={0.5}>
      <BowlSky f={h} horizon={980} seed={5} />
      <Layer depth={1}>
        <Bloom x={mx} y={my} r={R6 * 1.4} color={C.moonRim} strength={0.35} />
        <MoonFace f={h} x={mx} y={my} radius={R6} scroll={20} />
        <rect x={mx - R6 - 6} y={my - 16} width={2 * R6 + 12} height={32} rx={16} fill={C.ink} opacity={0.72} />
        {Array.from({ length: n }, (_, i) => {
          const x = mx - R6 + ((i + 0.5) / 150) * 2 * R6;
          const hot = h > 80 && Math.abs(x - scan) < 40;
          return <circle key={i} cx={x} cy={my} r={hot ? 4.6 : 3.2} fill={hot ? "#FFE7A0" : C.moonLit} />;
        })}
        {n < 150 ? (
          <g>
            <circle cx={headX} cy={my} r={22} fill={C.moonRim} opacity={0.35} />
            <circle cx={headX} cy={my} r={8} fill="#FFE7A0" />
          </g>
        ) : null}
      </Layer>
      <Layer depth={0}>
        <Readout x={80} y={150} k={n / 150} rkey="times150" unit="TIMES WIDER" size={96} />
        <OurSumPill x={90} y={212} size={28} appear={lin(h, 20, 30)} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T6 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 1-07 · KEY ART 1: the Moon fills the upper two thirds of the sky, crater map + faint grid gliding overhead at 22 px/f
// (wrap-around tiles, never settles); the gold rim and bloom on its lower edge; tiny Tick on the horizon shading his visor
// ================================================================================================================
const ShotSkyMap: ShotFC<CL01> = ({ f }) => {
  const hz = 935;
  return (
    <Pop f={f}>
      <Stage theme={BOWL.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: -0.005, frames: 120, seed: 6 }} vignette={0.22} grain={0.5}>
        <BowlSky f={f} horizon={hz} seed={6} />
        <Layer depth={0.35}>
          <Bloom x={960} y={720} r={1300} color={C.moonRim} strength={0.4} squash={0.3} />
          <MoonFace f={f} x={960} y={-640} radius={1350} scroll={22} grid />
          <ClipCircle cx={960} cy={-640} r={1350}>
            <DriftBands f={f} color="#8A3E14" opacity={0.3} speed={22} n={3} w={380} angle={-15} seed={6} />
          </ClipCircle>
        </Layer>
        <Layer depth={0.7}>
          <CloudBand f={f} y={900} speed={14} n={9} seed={7} h={90} />
        </Layer>
        <Layer depth={1}>
          <BowlGround horizon={hz} />
          <Tick x={780} y={hz + 4} pxPerM={72} frame={f} pose="shield" expression="surprised" headTilt={-14} look={0.3} />
          <Motes frame={f} n={16} w={1920} h={900} color={alpha("#FFE7A0", 0.55)} seed={8} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-08 + 1-09 · close on the face: craters sliding (26 px/f) and the terminator sweeping (18 px/f); slide to the bowl:
// the Moon sweeps across the sky (40 px/f) with its glowing trail, the clock hand (6 deg/f), Tick ducks then points
// ================================================================================================================
const ShotMotion: ShotFC<CL01> = ({ f, c }) => {
  const T9 = c.s09 - c.s08;
  const A = (
    <Stage theme={BOWL.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.0, panY: 0, frames: 100, seed: 7 }} vignette={0.24} grain={0.5}>
      <BowlSky f={f} seed={7} />
      <Layer depth={1}>
        <MoonFace f={f} x={960} y={540} radius={2600} scroll={26} grid terminator={0.33 - f * 0.0069} />
        <DriftBands f={f} color="#FFE7A0" opacity={0.28} speed={18} n={2} w={420} angle={12} seed={7} />
        <DriftBands f={f} color="#8A3E14" opacity={0.3} speed={26} n={2} w={340} angle={-20} seed={9} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T9);
  const pos = (k: number): [number, number] => {
    const x = -420 + k * 40;
    const u = Math.max(0, Math.min(1, (x + 420) / 2760));
    return [x, 560 - 300 * Math.sin(u * Math.PI)];
  };
  const [mx, my] = pos(g + 10);
  const B = (
    <Stage theme={BOWL.theme} shotFrame={g} drift={{ zoom: 1.03, panX: 0.01, panY: 0, frames: 120, seed: 8 }} vignette={0.2} grain={0.5}>
      <BowlSky f={g} horizon={920} seed={8} />
      <Layer depth={0.6}>
        <Trail points={trailOf((k) => pos(k + 10), g, 16, 3)} color={C.moonRim} width={150} />
        <Bloom x={mx} y={my} r={560} color={C.moonRim} strength={0.4} />
        <MoonFace f={g} x={mx} y={my} radius={360} scroll={12} />
      </Layer>
      <Layer depth={1}>
        <BowlGround horizon={920} />
        <CloudBand f={g} y={905} speed={14} n={6} seed={9} h={40} />
        <DayClock x={1640} y={740} r={110} f={g} progress={(g * 6) / 360} family={BOWL} />
        <Tick x={520} y={922} pxPerM={110} frame={g} pose={g < 26 ? "crouch" : "crouch"} poseTo="point" poseT={ez(g, 22, 40)} expression="surprised" headTilt={-10} look={0.5} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T9 - 6} dur={12} kind="slide" a={A} b={B} />;
};

// ================================================================================================================

export const SceneL01: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL01(t);
  const shots: ShotDef<CL01>[] = [
    { from: 0, S: ShotArc, id: "1-01" }, // + 1-02
    { from: c.s03, S: ShotSwell, id: "1-03" },
    { from: c.s04, S: ShotHalf, id: "1-04" }, // + 1-05, 1-06
    { from: c.s07, S: ShotSkyMap, id: "1-07" },
    { from: c.s08, S: ShotMotion, id: "1-08" }, // + 1-09
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL01 = (t: SceneTiming): Cue[] => {
  const c = cuesL01(t);
  const run = (at: number, n: number, gap: number, vol = 0.07): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 4, file: SFX.pop, vol: 0.14, dur: 16 },
    { at: c.s02 - 4, file: SFX.whoosh, vol: 0.1, dur: 40 },
    { at: c.s02 + 6, file: SFX.pop, vol: 0.12, dur: 16 },
    ...cutHit(c.s03),
    { at: c.s03 + 30, file: SFX.boom, vol: 0.3, dur: 120, fadeOut: 40 },
    ...cutHit(c.s04),
    { at: c.s04 + 2, file: SFX.swirl, vol: 0.14, dur: 60 },
    { at: c.s05 + 2, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.s06 - 4, file: SFX.whoosh, vol: 0.12, dur: 40 },
    ...run(c.s06 + 6, 10, 7),
    ...cutHit(c.s07),
    { at: c.s07 + 2, file: SFX.riser, vol: 0.16, dur: c.s08 - c.s07, fadeOut: 20 },
    { at: c.s08 + 2, file: SFX.whoosh, vol: 0.12, dur: 40 },
    ...cutHit(c.s09),
    { at: c.s09 + 2, file: SFX.deepWhoosh, vol: 0.22, dur: 70 },
  ];
};
