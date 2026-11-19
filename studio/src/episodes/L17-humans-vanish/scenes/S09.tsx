// L17 scene "l09" (storyboard §3 "9 · One million years: what's left", script lines 36-41). Package B.
// Shot components (hard cuts; PUSH rows are phases): 9-01 (+9-02: the rise off the world onto the Moon, then the prints,
// the meteorite that misses and Tick's rigid flag; KEY ART 3) · 9-03 · 9-04 · 9-05 · 9-06 · 9-07 · 9-08 · 9-09 · 9-10 ·
// 9-11 · 9-12 · 9-13 · 9-14.
// Numbers drawn (data17 READ): 3.3 MILLION YEARS (#12 A, 9-04) · LOMEKWI 3, KENYA (#12 A, the site sign) · MORE THAN 3
// TIMES + OUR SUM (#12 #18 C, 9-05) · 700,000 YEARS (#12 A, 9-06). Words: NASA SAYS: PROBABLY and the dial word MILLIONS
// (#11 A), TECHNOFOSSILS, PRESERVABLE REMAINS, BEYOND THE PLANET (#13 #14 A), the three card titles (#11-#14).
// F6: on the Moon nothing blows; the flag is rigid; dust only falls (DotStream gravity 1). F14: words only, no insignia.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Kicker, Layer, Motes, Stage, Tick, cameraAt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ } from "../data17";
import { YearsDial, rungValue } from "../ladder";
import { AgencyPill, OurSumPill, Sheet, WordPill } from "../stamps17";
import { Skyline } from "../city";
import { DotStream, StarsTint } from "../movers17";
import { BandIcon, GearIcon, PrintIcon, StoneIcon } from "../icons17";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  Big,
  C,
  CREAM,
  DarkBoard,
  Earth,
  FamSky,
  HeroStone,
  INK,
  Label,
  Lander,
  Meteor,
  MoonSet,
  Pop,
  RigidFlag,
  RollDec,
  RollInt,
  Strata,
  StudioCyc,
  TextPlate,
  Wind,
  alpha,
  clamp01,
  drawn,
  ez,
  lin,
  mixHex,
  mod,
  path1,
  rnd,
} from "./b-parts";

export const cuesL09 = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    rise: 0, // 9-01
    prints: frac(0, 0.49), // 9-02 (phase)
    stone: at(1), // 9-03
    pit: frac(1, 0.32), // 9-04
    three: frac(1, 0.72), // 9-05
    oldowan: at(2), // 9-06
    track: frac(2, 0.51), // 9-07
    strata: at(3), // 9-08
    techno: frac(3, 0.5), // 9-09
    lens: at(4), // 9-10
    beyond: frac(4, 0.51), // 9-11
    cards: at(5), // 9-12
    flip: frac(5, 0.34), // 9-13
    towers: frac(5, 0.67), // 9-14
    end: t.frames,
  };
};
export type C09 = ReturnType<typeof cuesL09>;

const VOID = familyOf("void");
const NOON = familyOf("noon");
const DUSK = familyOf("dusk");
const STUDIO_T = familyOf("studio").theme;
const MUD = ["#B8642A", "#8A4A20", "#C98238", "#6E3A1A", "#A8582A", "#5A2E14", "#C07436"];

// ===============================================================================================================
// 9-01 + 9-02 · the YEARS dial spins and lands on ONE MILLION YEARS; the camera rises off the world (the Earth shrinks
// away below and slides up into the sky, stars stream 14 px/f) and settles on pale dust. Phase 9-02 (KEY ART 3): a dolly
// along a line of sharp bootprints (18 → 10 px/f); a meteorite crosses the far sky (40 px/f) and puffs well away; Tick
// plants a rigid flag and salutes. 'NASA SAYS: PROBABLY' + the dial word MILLIONS (#11 A). Dark: void sky ≥ 60 %.
// ===============================================================================================================
const ShotMoon: ShotFC<C09> = ({ f, c }) => {
  const p2 = c.prints - c.rise;
  const g = f - p2;
  const rise = ez(f, 0, p2 - 6);
  const er = 1150 * (1 - rise) + 64 * rise;
  const ex = 960 * (1 - rise) + 1480 * rise;
  const ey = 1850 * (1 - rise) + 230 * rise;
  const horizon = path1(f, [
    [p2 - 56, 1400],
    [p2 - 4, 760],
  ]);
  const spin = f < 46 ? mod(rungValue(7) + f * 0.1, 1) : rungValue(8) - 0.12 * Math.max(0, 1 - (f - 46) / 14) * Math.cos((f - 46) * 0.9);
  const shift = g <= 0 ? 0 : g < 40 ? g * 18 : 720 + (g - 40) * 10;
  const tickWX = 2040;
  const tx = tickWX - shift;
  const plant = ez(g, 8, 26);
  return (
    <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0, panY: 0, frames: 260, seed: 4 }} vignette={0.3} grain={0.45}>
      <Layer depth={1}>
        {g < 0 ? (
          <g>
            <rect x={-600} y={-600} width={3120} height={2280} fill="#020A0E" />
            <StarsTint f={f} x={-200} y={-200} w={2400} h={1500} n={120} speed={14} vertical dir={1} seed={5} />
            <Earth x={ex} y={ey} r={er} />
            <MoonGround0 horizon={horizon} />
          </g>
        ) : (
          <g>
            <MoonSet f={f} shift={shift} horizon={760} earth={{ x: 1480, y: 230, r: 64 }} prints={{ x0: 180, y: 905, n: 10, gap: 180, size: 132 }} starSpeed={1.5} />
            <Meteor a={[1300, 60]} b={[1760, 742]} t={lin(g, 46, 66)} puff={lin(g, 66, 100)} />
            <DotStream f={g} from={[tx + 150, 820]} to={[tx + 150, 912]} n={18} speed={3} spread={50} gravity={1} color={C.moonDust} size={4} seed={8} />
            <RigidFlag x={tx + 150} y={912} h={250} plant={plant} />
            <ellipse cx={tx + 6} cy={914} rx={70} ry={12} fill="#1A140C" opacity={0.5} />
            <Tick x={tx} y={910} pxPerM={210} frame={f} facing={1} pose={g < 26 ? "press" : "wave"} poseTo={g < 26 ? undefined : "wave"} expression={g < 26 ? "determined" : "proud"} look={-0.2} />
          </g>
        )}
      </Layer>
      <Layer depth={0}>
        <g opacity={1 - ez(f, p2 - 16, p2 + 2)}>
          <Kicker x={80} y={110} text="ONE MILLION YEARS" color={CREAM} size={30} />
          <YearsDial x={560} y={520} r={230} value={spin} family={VOID} f={f} plate="dark" rattle={f > 46 && f < 70 ? 1 : 0} />
        </g>
        <g opacity={ez(g, 4, 16)}>
          <AgencyPill x={80} y={110} agency="NASA SAYS: PROBABLY" size={26} />
          <YearsDial x={180} y={300} r={92} value={1} family={VOID} f={f} plate="dark" word="MILLIONS" title="" />
        </g>
      </Layer>
    </Stage>
  );
};
/** The Moon's ground rising into frame (no prints yet), used while the camera settles. */
const MoonGround0: React.FC<{ horizon: number }> = ({ horizon }) => (
  <g>
    <path d={`M-600 ${horizon + 8} Q500 ${horizon - 18} 1000 ${horizon + 4} T2600 ${horizon} L2600 ${horizon + 1400} L-600 ${horizon + 1400} Z`} fill="#6E5C40" />
    <path d={`M-600 ${horizon + 8} Q500 ${horizon - 18} 1000 ${horizon + 4} T2600 ${horizon}`} fill="none" stroke={C.moonDust} strokeWidth={3} opacity={0.6} />
  </g>
);

// ===============================================================================================================
// 9-03 · match cut to a chipped stone on dry earth; the camera pans down to it (peak 20 px/f) and sun glints slide
// along its ridge. #12 A.
// ===============================================================================================================
const ShotStone: ShotFC<C09> = ({ f, len }) => {
  const camY = path1(f, [
    [0, 360],
    [16, 520],
    [56, 1180],
    [len, 1260],
  ]);
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} cam={{ x: 960, y: camY, zoom: 1 }} vignette={0.15} grain={0.6}>
        <Layer depth={0.3}>
          <FamSky name="noon" />
          <Bloom x={300} y={-200} r={560} color="#FFF3C8" strength={0.7} />
          <path d="M-900 520 L-200 380 L500 470 L1100 360 L1800 460 L2900 380 L2900 900 L-900 900 Z" fill={NOON.far} opacity={0.7} />
        </Layer>
        <Layer depth={1}>
          <rect x={-900} y={500} width={3800} height={1800} fill="#D9A867" />
          <rect x={-900} y={500} width={3800} height={14} fill="#F2CF94" />
          {Array.from({ length: 26 }, (_, i) => {
            const x = rnd(i * 3) * 2400 - 200;
            const y = 600 + rnd(i * 7) * 1300;
            return <path key={i} d={`M${x} ${y} l${40 + rnd(i) * 60} ${-10 + rnd(i * 5) * 20} l${30 + rnd(i * 9) * 50} ${10}`} fill="none" stroke="#A8703E" strokeWidth={4} opacity={0.7} />;
          })}
          {Array.from({ length: 40 }, (_, i) => (
            <circle key={"p" + i} cx={rnd(i * 11) * 2400 - 200} cy={560 + rnd(i * 13) * 1400} r={4 + rnd(i * 17) * 8} fill={i % 2 ? "#B78A52" : "#E8C08A"} />
          ))}
          <HeroStone x={960} y={1300} size={520} glint={mod(f / 40, 1)} />
        </Layer>
        <Layer depth={1.4}>
          <Motes frame={f} n={16} y={500} w={1920} h={1600} color="#FFF3C8" seed={9} size={3} drift={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 9-04 · a dug pit with a string grid and stones lying in place (popping, stagger 6 f); a sign LOMEKWI 3, KENYA; dust
// blowing (14 px/f); Tick kneels at the pit's edge; the counter rolls to 3.3 MILLION YEARS (#12 A).
// ===============================================================================================================
const ShotPit: ShotFC<C09> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0, frames: 200, seed: 6 }} vignette={0.15} grain={0.6}>
      <Layer depth={0.1}>
        <FamSky name="noon" />
        <Bloom x={300} y={-160} r={520} color="#FFF3C8" strength={0.7} />
      </Layer>
      <Layer depth={0.4}>
        <path d="M-900 420 L-200 300 L500 380 L1100 280 L1800 370 L2900 300 L2900 700 L-900 700 Z" fill={NOON.far} />
      </Layer>
      <Layer depth={1}>
        <rect x={-900} y={400} width={3800} height={1000} fill="#D9A867" />
        <rect x={-900} y={400} width={3800} height={12} fill="#F2CF94" />
        {/* the pit */}
        <path d="M360 560 L1420 560 L1340 900 L440 900 Z" fill="#A8703E" />
        <path d="M440 900 L1340 900 L1420 560 L1400 560 L1320 880 L460 880 L380 560 L360 560 Z" fill="#7A5236" opacity={0.7} />
        <rect x={360} y={548} width={1060} height={16} fill="#F2CF94" />
        {/* the string grid */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={"v" + i} x1={420 + i * 190} y1={560} x2={460 + i * 175} y2={900} stroke="#FFF8EA" strokeWidth={3} opacity={0.85} />
        ))}
        {[0, 1, 2].map((i) => (
          <line key={"h" + i} x1={380 + i * 20} y1={660 + i * 100} x2={1400 - i * 20} y2={660 + i * 100} stroke="#FFF8EA" strokeWidth={3} opacity={0.85} />
        ))}
        {Array.from({ length: 9 }, (_, i) => {
          const age = f - 10 - i * 6;
          if (age < 0) return null;
          const s = Math.min(1, age / 5) * (1 + 0.2 * Math.max(0, 1 - age / 10));
          return (
            <g key={i} transform={`translate(${520 + (i % 5) * 170 + rnd(i) * 40} ${640 + Math.floor(i / 5) * 140 + rnd(i * 3) * 40}) scale(${s})`}>
              <StoneIcon x={0} y={0} size={70} />
            </g>
          );
        })}
        {/* the site sign */}
        <rect x={190} y={420} width={14} height={180} fill="#7A4A2E" />
        <rect x={30} y={330} width={340} height={110} rx={10} fill={C.paper} stroke="#7A4A2E" strokeWidth={6} />
        <Label x={200} y={398} text={READ.lomekwiSign.text /* #12 A */} size={30} color={INK} align="middle" />
        <ellipse cx={1520} cy={566} rx={80} ry={12} fill="#000" opacity={0.2} />
        <Tick x={1500} y={560} pxPerM={210} frame={f} facing={-1} pose="crouch-reach" expression={f > 60 ? "surprised" : "neutral"} look={0.3} />
      </Layer>
      <Layer depth={1.3}>
        <Wind f={f} y0={380} y1={1000} n={10} speed={14} color="#F2CF94" opacity={0.6} width={5} />
        <DotStream f={f} from={[-100, 700]} to={[2100, 640]} n={40} speed={14} spread={220} color="#E8C08A" size={4} seed={3} />
      </Layer>
      <Layer depth={0}>
        <TextPlate x={90} y={830} w={960} h={170} color="#1F4F4C" opacity={0.82} />
        <RollDec x={130} y={952} value={READ.lomekwi.value! /* #12 A */} k={ez(f, 10, 40)} unit="MILLION YEARS" size={110} who="9-04 lomekwi" />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 9-05 · studio: three blocks, each A MILLION, drop onto a bar (30 px/f, stagger 12 f) with a small slice beside them;
// Tick counts them with the staff (a count mark pops over each block). Pills 'MORE THAN 3 TIMES' + 'OUR SUM' (#12 #18 C).
// ===============================================================================================================
const ShotThree: ShotFC<C09> = ({ f }) => {
  const bx = 520;
  const bw = 330;
  const by = 760;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO_T} shotFrame={f} drift={{ zoom: 1.04, panX: 0.008, panY: 0, frames: 200, seed: 8 }} vignette={0.12} grain={0.5}>
        <StudioCyc f={f} floor={900} seed={8} />
        <Layer depth={1}>
          <rect x={bx - 20} y={by} width={bw * 3.3 + 40} height={30} rx={10} fill={C.tealDeep} />
          <rect x={bx - 20} y={by} width={bw * 3.3 + 40} height={8} rx={4} fill="#5FB0B4" />
          {[0, 1, 2].map((i) => {
            const s = 4 + i * 12;
            const y = by - 150 - Math.max(0, 400 - (f - s) * 30);
            if (f < s) return null;
            return (
              <g key={i}>
                <rect x={bx + i * bw + 6} y={y} width={bw - 12} height={150} rx={14} fill={[C.saffron, C.amber, C.saffron][i]} />
                <rect x={bx + i * bw + 6} y={y} width={bw - 12} height={18} rx={9} fill="#FFE6A8" opacity={0.8} />
                <rect x={bx + i * bw + bw - 30} y={y + 10} width={18} height={136} rx={6} fill={C.saffronDeep} opacity={0.4} />
                <Label x={bx + i * bw + bw / 2} y={y + 88} text="A MILLION" size={32} color={INK} align="middle" />
                {f > 56 + i * 14 ? <circle cx={bx + i * bw + bw / 2} cy={y - 40} r={18 * Math.min(1, (f - 56 - i * 14) / 4)} fill={C.seen} /> : null}
              </g>
            );
          })}
          {f > 44 ? <rect x={bx + 3 * bw + 6} y={by - 150 - Math.max(0, 400 - (f - 44) * 30)} width={bw * 0.3 - 6} height={150} rx={10} fill="#E3813F" /> : null}
          <ellipse cx={280} cy={906} rx={110} ry={14} fill="#000" opacity={0.18} />
          <Tick x={280} y={900} pxPerM={270} frame={f} pose="point" staff expression={f > 90 ? "surprised" : "thinking"} look={0.2} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={520} y={170} text={READ.threeTimes.text /* #12 #18 C */} size={40} fill={alpha("#1E4A5C", 0.85)} appear={ez(f, 70, 82)} />
          <OurSumPill x={526} y={262} size={28} appear={ez(f, 78, 90)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 9-06 · studio plate: two timeline strips, LOMEKWI starting early and OLDOWAN starting later; a bracket slides between
// their starts (28 px/f) with dots popping along it; the counter rolls to 700,000 YEARS (#12 A).
// ===============================================================================================================
const ShotGap: ShotFC<C09> = ({ f }) => {
  const xl = 420;
  const xo = 1280;
  const k = lin(f, 14, 14 + (xo - xl) / 28);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO_T} shotFrame={f} drift={{ zoom: 1.04, panX: -0.008, panY: 0, frames: 200, seed: 10 }} vignette={0.12} grain={0.5}>
        <StudioCyc f={f} floor={960} seed={10} />
        <Layer depth={1}>
          <rect x={248} y={208} width={1440} height={640} rx={18} fill="#04161C" opacity={0.2} transform="translate(10 14)" />
          <rect x={248} y={208} width={1440} height={640} rx={18} fill={C.paper} />
          <Label x={300} y={270} text="OLDER" size={24} color={C.modelDeep} />
          <Label x={1640} y={270} text="NEWER" size={24} color={C.modelDeep} align="end" />
          <line x1={300} y1={290} x2={1640} y2={290} stroke={C.modelDeep} strokeWidth={3} />
          <path d="M1640 290 l-16 -9 l0 18 Z" fill={C.modelDeep} />
          <rect x={xl} y={400} width={1640 - xl} height={70} rx={14} fill={C.saffron} />
          <StoneIcon x={xl + 60} y={436} size={52} />
          <Label x={xl + 110} y={448} text="LOMEKWI" size={30} color={INK} />
          <rect x={xo} y={540} width={1640 - xo} height={70} rx={14} fill={C.teal} />
          <Label x={xo + 30} y={588} text="OLDOWAN" size={30} color={INK} />
          {/* the bracket from Lomekwi's start to Oldowan's */}
          <line x1={xl} y1={680} x2={xl + (xo - xl) * k} y2={680} stroke={INK} strokeWidth={6} />
          <line x1={xl} y1={650} x2={xl} y2={710} stroke={INK} strokeWidth={6} />
          {k >= 1 ? <line x1={xo} y1={650} x2={xo} y2={710} stroke={INK} strokeWidth={6} /> : null}
          {Array.from({ length: 14 }, (_, i) => {
            const u = (i + 0.5) / 14;
            const age = f - 14 - (u * (xo - xl)) / 28;
            if (age < 0) return null;
            return <circle key={i} cx={xl + u * (xo - xl)} cy={680} r={9 * Math.min(1, age / 4) * (1 + 0.15 * Math.sin(f / 5 + i))} fill={C.amberDeep} />;
          })}
          <circle cx={xl + (xo - xl) * k} cy={680} r={14} fill={C.saffronCore} opacity={k < 1 ? 1 : 0} />
          <line x1={xl} y1={470} x2={xl} y2={650} stroke={INK} strokeWidth={2} strokeDasharray="6 8" opacity={0.5} />
          <line x1={xo} y1={610} x2={xo} y2={650} stroke={INK} strokeWidth={2} strokeDasharray="6 8" opacity={0.5} />
          <RollInt x={xl + 140} y={800} value={READ.oldowanGap.value! /* #12 A */} k={ez(f, 18, 18 + (xo - xl) / 28)} unit="YEARS" size={88} color={INK} unitColor={C.modelDeep} who="9-06 gap" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 9-07 · Tick at the start line of a long track; a stone waits far ahead; the camera pans along the track (19 px/f, the
// lane ticks scrolling) with heat shimmer over the ground.
// ===============================================================================================================
const ShotTrack: ShotFC<C09> = ({ f, len }) => {
  const camX = path1(f, [
    [0, 760],
    [10, 820],
    [len - 10, 3780],
    [len, 3820],
  ]);
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} cam={{ x: camX, y: 560, zoom: 1 }} vignette={0.15} grain={0.6}>
        <Layer depth={0.05}>
          <FamSky name="noon" />
        </Layer>
        <Layer depth={0.3}>
          <path d="M-900 560 L-200 430 L500 520 L1300 400 L2100 500 L2900 410 L3700 520 L4600 420 L5600 520 L5600 900 L-900 900 Z" fill={NOON.far} />
        </Layer>
        <Layer depth={1}>
          <rect x={-900} y={640} width={6800} height={800} fill="#D9A867" />
          <rect x={-900} y={720} width={6800} height={160} fill="#C9905A" />
          <rect x={-900} y={716} width={6800} height={6} fill="#FFF8EA" />
          <rect x={-900} y={878} width={6800} height={6} fill="#FFF8EA" />
          {Array.from({ length: 40 }, (_, i) => (
            <rect key={i} x={-600 + i * 160} y={794} width={80} height={10} fill="#FFF8EA" opacity={0.85} />
          ))}
          {Array.from({ length: 30 }, (_, i) => (
            <line key={"t" + i} x1={-600 + i * 220} y1={890} x2={-600 + i * 220} y2={930} stroke="#A8703E" strokeWidth={6} />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <g key={"m" + i}>
              <rect x={1100 + i * 480} y={560} width={16} height={160} fill={C.paper} />
              <rect x={1116 + i * 480} y={560} width={70} height={44} fill={i % 2 ? C.teal : C.amber} />
            </g>
          ))}
          <rect x={560} y={716} width={14} height={168} fill={C.paper} />
          <Label x={567} y={700} text="START" size={26} color={INK} align="middle" />
          <ellipse cx={460} cy={806} rx={80} ry={12} fill="#000" opacity={0.2} />
          <Tick x={460} y={800} pxPerM={200} frame={f} pose="crouch" expression="determined" look={0.4} />
          <HeroStone x={4280} y={780} size={180} glint={mod(f / 40, 1)} />
          {Array.from({ length: 10 }, (_, i) => (
            <path key={"h" + i} d={`M${i * 520 + mod(f * 2, 60)} ${700 - (f * 1.5 + i * 20) % 60} q20 -16 40 0 t40 0 t40 0`} fill="none" stroke="#FFF3C8" strokeWidth={3} opacity={0.35} />
          ))}
        </Layer>
        <Layer depth={1.4}>
          <Motes frame={f} n={16} x={camX - 960} w={1920} h={1080} color="#FFF3C8" seed={11} size={3} drift={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 9-08 · the camera descends from the dusk sky into the ground (peak ~26 px/f, mud layers sliding up) and settles on
// the thin bright band just under the surface (our era); a highlight runs along the band (30 px/f). #13 A.
// ===============================================================================================================
const Band: React.FC<{ y: number; h: number; f: number; x0?: number; x1?: number }> = ({ y, h, f, x0 = -800, x1 = 2800 }) => {
  const hx = mod(f * 30, x1 - x0 + 600) + x0 - 300;
  return (
    <g>
      <Bloom x={960} y={y + h / 2} r={500} color={C.amber} strength={0.35} squash={0.25} />
      <rect x={x0} y={y} width={x1 - x0} height={h} fill="#F2B544" />
      <rect x={x0} y={y} width={x1 - x0} height={h * 0.3} fill="#FFE6A8" opacity={0.8} />
      {Array.from({ length: 30 }, (_, i) => (
        <rect key={i} x={x0 + rnd(i * 3) * (x1 - x0)} y={y + h * 0.3 + rnd(i * 7) * h * 0.5} width={10 + rnd(i) * 20} height={Math.max(3, h * 0.12)} rx={2} fill={[C.teal, "#9FC8C6", "#E3813F", C.paper][i % 4]} opacity={0.8} />
      ))}
      <rect x={hx} y={y - 4} width={260} height={h + 8} fill="#FFFFFF" opacity={0.35} transform={`skewX(-20)`} />
    </g>
  );
};
const ShotStrata: ShotFC<C09> = ({ f, len }) => {
  const camY = path1(f, [
    [0, -810],
    [8, -760],
    [52, 200],
    [66, 250],
    [len, 250 + (len - 66) * 4],
  ]);
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} cam={{ x: 960, y: camY, zoom: 1 }} vignette={0.2} grain={0.5}>
        <Layer depth={1}>
          <rect x={-900} y={-2400} width={3800} height={2420} fill="#1E6678" />
          <defs>
            <linearGradient id="l09duskSky" x1="0" y1="-1500" x2="0" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#0F3B4F" />
              <stop offset="0.6" stopColor="#1E6678" />
              <stop offset="0.85" stopColor="#E3813F" />
              <stop offset="1" stopColor="#F6B45A" />
            </linearGradient>
          </defs>
          <rect x={-900} y={-1500} width={3800} height={1510} fill="url(#l09duskSky)" />
          <Bloom x={1600} y={-60} r={500} color="#FFCF73" strength={0.7} />
          <Skyline f={f} family={DUSK} ground={0} lights={0} wave={0} ghost seed={6} scale={0.55} />
          <rect x={-900} y={-6} width={3800} height={36} fill="#5A6E3A" />
          <Band y={30} h={30} f={f} />
          <Strata y0={60} depth={3200} palette={MUD} seed={9} minH={70} maxH={180} />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={16} y={camY - 540} w={1920} h={1080} color="#FFCF73" seed={13} size={3} drift={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 9-09 · close on the band: a can-shaped piece, a concrete chunk and a plastic strip drop in (24 px/f, stagger 8 f) and
// settle; fine sediment keeps settling. Label 'TECHNOFOSSILS' (#13 A).
// ===============================================================================================================
const Can: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 34} y={y - 60} width={68} height={120} rx={14} fill="#9FC8C6" />
    <rect x={x - 34} y={y - 20} width={68} height={40} fill={C.amber} />
    <rect x={x - 26} y={y - 56} width={14} height={112} rx={6} fill="#FFFFFF" opacity={0.4} />
    <ellipse cx={x} cy={y - 60} rx={34} ry={9} fill="#CFE6E2" />
  </g>
);
const Chunk: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <path d={`M${x - 70} ${y + 30} L${x - 50} ${y - 40} L${x + 30} ${y - 54} L${x + 74} ${y - 6} L${x + 50} ${y + 44} Z`} fill={C.concrete} />
    <path d={`M${x - 50} ${y - 40} L${x + 30} ${y - 54} L${x + 20} ${y - 20} L${x - 40} ${y - 10} Z`} fill="#E3DCC8" />
    <line x1={x - 30} y1={y + 6} x2={x + 60} y2={y - 2} stroke={C.rust} strokeWidth={8} />
  </g>
);
const Strip: React.FC<{ x: number; y: number }> = ({ x, y }) => <path d={`M${x - 90} ${y} q45 -40 90 0 t90 0`} fill="none" stroke={C.teal} strokeWidth={22} strokeLinecap="round" />;
const ShotTechno: ShotFC<C09> = ({ f }) => {
  const bandY = 500;
  const bandH = 200;
  const piece = (i: number, x: number, node: (y: number) => React.ReactNode) => {
    const s = 6 + i * 8 + i * 6;
    const rest = bandY + 100;
    const y = Math.min(rest, -120 + Math.max(0, f - s) * 24);
    return f >= s ? <g key={i}>{node(y)}</g> : null;
  };
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0, frames: 200, seed: 14 }} vignette={0.22} grain={0.5}>
        <Layer depth={1}>
          <g transform={`translate(0 ${-f * 3})`}>
          <Strata y0={-700} depth={1220} palette={MUD} seed={15} minH={90} maxH={170} />
          <Band y={bandY} h={bandH} f={f} />
          <Strata y0={bandY + bandH} depth={1200} palette={MUD.slice(2)} seed={17} minH={90} maxH={170} />
          </g>
          {piece(0, 560, (y) => <Can x={560} y={y} />)}
          {piece(1, 980, (y) => <Chunk x={980} y={y} />)}
          {piece(2, 1400, (y) => <Strip x={1400} y={y} />)}
          <DotStream f={f} from={[960, -60]} to={[960, 560]} n={50} speed={8} spread={980} color="#E8C08A" size={4} seed={19} />
        </Layer>
        <Layer depth={0}>
          <TextPlate x={680} y={140} w={560} h={100} color="#082028" opacity={0.75} />
          <Label x={960} y={208} text="TECHNOFOSSILS" size={44} color={C.saffronCore} align="middle" opacity={ez(f, 30, 44)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 9-10 · a magnifier sweeps the band (28 px/f) revealing a gear (turning), a wire and a wheel. Pill 'PRESERVABLE REMAINS'
// (#14 A).
// ===============================================================================================================
const Wheel: React.FC<{ x: number; y: number; r: number; f: number }> = ({ x, y, r, f }) => (
  <g transform={`rotate(${f * 4} ${x} ${y})`}>
    <circle cx={x} cy={y} r={r} fill="none" stroke={INK} strokeWidth={r * 0.22} />
    <circle cx={x} cy={y} r={r * 0.78} fill="none" stroke="#9FC8C6" strokeWidth={r * 0.08} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <line key={i} x1={x} y1={y} x2={x + Math.cos((i * Math.PI) / 3) * r * 0.8} y2={y + Math.sin((i * Math.PI) / 3) * r * 0.8} stroke={INK} strokeWidth={r * 0.08} />
    ))}
    <circle cx={x} cy={y} r={r * 0.16} fill={C.saffron} />
  </g>
);
const ShotLens: ShotFC<C09> = ({ f }) => {
  const bandY = 420;
  const bandH = 260;
  const lx = 200 + Math.abs(mod(f * 28 + 1300, 2 * 1500) - 1500);
  const ly = bandY + bandH / 2;
  const R = 200;
  const things = (sc: number) => (
    <g>
      <GearIcon x={520} y={ly} size={130 * sc} f={f} speed={6} fill={C.saffron} ink={INK} />
      <path d={`M860 ${ly - 30} q40 -60 80 0 t80 0 t80 0 t80 0`} fill="none" stroke={C.amberDeep} strokeWidth={14 * sc} strokeLinecap="round" />
      <Wheel x={1480} y={ly} r={70 * sc} f={f} />
    </g>
  );
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.008, panY: 0, frames: 200, seed: 16 }} vignette={0.22} grain={0.5}>
        <Layer depth={1}>
          <Strata y0={-700} depth={1120} palette={MUD} seed={21} minH={90} maxH={170} />
          <Band y={bandY} h={bandH} f={f} />
          <Strata y0={bandY + bandH} depth={1200} palette={MUD.slice(1)} seed={23} minH={90} maxH={170} />
          <g opacity={0.25}>{things(0.8)}</g>
          <clipPath id="l09lens">
            <circle cx={lx} cy={ly} r={R} />
          </clipPath>
          <g clipPath="url(#l09lens)">
            <circle cx={lx} cy={ly} r={R} fill="#FFE6A8" />
            <g transform={`translate(${lx} ${ly}) scale(1.35) translate(${-lx} ${-ly})`}>{things(1)}</g>
          </g>
          <circle cx={lx} cy={ly} r={R} fill="none" stroke={C.saffronDeep} strokeWidth={22} />
          <circle cx={lx} cy={ly} r={R} fill="none" stroke={C.saffron} strokeWidth={12} />
          <line x1={lx + R * 0.72} y1={ly + R * 0.72} x2={lx + R * 1.35} y2={ly + R * 1.35} stroke={C.saffronDeep} strokeWidth={36} strokeLinecap="round" />
          <path d={`M${lx - R * 0.6} ${ly - R * 0.3} A${R * 0.7} ${R * 0.7} 0 0 1 ${lx - R * 0.2} ${ly - R * 0.66}`} fill="none" stroke="#FFFFFF" strokeWidth={8} opacity={0.6} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={120} y={150} text="PRESERVABLE REMAINS" size={34} fill={alpha("#082028", 0.82)} dot={C.amber} appear={ez(f, 8, 20)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 9-11 · the camera rises out of the mud (layers sliding down at 30 px/f) into black space; the Earth sinks away below,
// the Moon waits upper right; a dotted arc draws (50 px/f) from the Earth to a small lander on the Moon. Label
// 'BEYOND THE PLANET' (#14 A, transplanetary).
// ===============================================================================================================
const ShotBeyond: ShotFC<C09> = ({ f }) => {
  const up = f * 30;
  const out = ez(f, 0, 40);
  const ey = 1750 - 430 * out;
  const er = 820;
  const a: [number, number] = [620, ey - er + 40];
  const b: [number, number] = [1430, 250];
  const cx = (a[0] + b[0]) / 2 - 120;
  const cy = Math.min(a[1], b[1]) - 260;
  const arcD = `M${a[0]} ${a[1]} Q${cx} ${cy} ${b[0]} ${b[1]}`;
  const k = lin(f, 40, 40 + 1100 / 50);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0, panY: 0, frames: 220, seed: 18 }} vignette={0.3} grain={0.45}>
        <Layer depth={1}>
          <rect x={-600} y={-600} width={3120} height={2280} fill="#020A0E" />
          <StarsTint f={f} x={-200} y={-200} w={2400} h={1500} n={110} speed={14 * (1 - 0.7 * out)} vertical dir={1} seed={7} />
          <Earth x={760} y={ey} r={er} seed={5} />
          <g>
            <circle cx={1430} cy={330} r={120} fill="#C9B086" />
            <circle cx={1400} cy={310} r={120} fill="#E8D7B0" opacity={0.5} />
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={1380 + rnd(i * 3) * 100} cy={300 + rnd(i * 5) * 80} r={10 + rnd(i) * 14} fill="#A89068" />
            ))}
            <Lander x={1430} y={214} size={46} />
          </g>
          <path d={arcD} fill="none" stroke={CREAM} strokeWidth={8} strokeDasharray="2 20" strokeLinecap="round" opacity={0.25} />
          <clipPath id="l09arc">
            <rect x={a[0] - 40} y={-200} width={(b[0] - a[0] + 80) * k} height={1400} />
          </clipPath>
          <path d={arcD} fill="none" stroke={C.saffronCore} strokeWidth={10} strokeDasharray="2 20" strokeLinecap="round" clipPath="url(#l09arc)" />
          {/* the mud we rose out of, sliding down out of frame */}
          <g transform={`translate(0 ${up})`}>
            <Strata y0={-160} depth={1300} palette={MUD} seed={25} minH={90} maxH={180} />
          </g>
        </Layer>
        <Layer depth={0}>
          <Label x={1430} y={520} text="BEYOND THE PLANET" size={34} color={C.saffronCore} align="middle" opacity={ez(f, 60, 74)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 9-12 / 9-13 / 9-14 · the dark board: three pinned cards slide in (24 px/f, stagger 10 f) and Tick pins each (9-12);
// each card flips to show its icon, a print, a band, a chipped stone (12 deg/f, stagger 20 f: 9-13); a fourth card with
// the skyline tips over and slides off under a slash (40 px/f) as Tick waves it off (9-14).
// ===============================================================================================================
const CARDS = [
  { title: "ON THE MOON", band: "teal" as const },
  { title: "IN THE MUD", band: "ochre" as const },
  { title: "IN STONE", band: "green" as const },
];
const CW = 380;
const CH = 440;
const cardX = (i: number) => 330 + i * 430;
const CY = 300;
const CardIcon: React.FC<{ i: number; f: number }> = ({ i, f }) => {
  const cx = CW / 2;
  const cy = (CH - 70) / 2 + 10;
  if (i === 0) return <PrintIcon x={cx} y={cy} size={200} rotate={-90} />;
  if (i === 1) return <BandIcon x={cx} y={cy} size={200} glow={C.amber} />;
  return <StoneIcon x={cx} y={cy + 6 * Math.sin(f / 8)} size={190} />;
};
const BoardSet: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <>
    <Layer depth={0.1}>
      <rect x={-600} y={-600} width={3120} height={2280} fill="#020A0E" />
      <StarsTint f={f} x={-300} y={-300} w={2500} h={1700} n={100} speed={4} seed={21} />
    </Layer>
    <Layer depth={1}>
      <DarkBoard x={240} y={170} w={1460} h={760} f={f} />
      {children}
    </Layer>
  </>
);
const ShotCards: ShotFC<C09> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={VOID.theme} cam={{ x: 880 + f * 2.2, y: 560, zoom: 1 + f * 0.0012 }} vignette={0.3} grain={0.45}>
      <BoardSet f={f}>
        {CARDS.map((cd, i) => {
          const s = 4 + i * 10 + i * 14;
          const dx = Math.max(0, 600 - (f - s) * 24 * 1.4);
          if (f < s) return null;
          return <Sheet key={i} x={cardX(i) + dx} y={CY} w={CW} h={CH} f={f} title={cd.title} band={cd.band} tilt={(i - 1) * 1.5} />;
        })}
        <ellipse cx={170} cy={1000} rx={100} ry={14} fill="#000" opacity={0.4} />
        <Tick x={170} y={995} pxPerM={250} frame={f} pose={Math.floor(f / 24) % 2 ? "press" : "point"} expression="determined" look={0.2} />
      </BoardSet>
    </Stage>
  </Pop>
);
const ShotFlip: ShotFC<C09> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={VOID.theme} cam={{ x: 1100 - f * 2.2, y: 540, zoom: 1.02 + f * 0.0012 }} vignette={0.3} grain={0.45}>
      <BoardSet f={f}>
        {CARDS.map((cd, i) => {
          const s = 6 + i * 20;
          const ang = Math.min(180, Math.max(0, (f - s) * 12));
          const sx = Math.abs(Math.cos((ang * Math.PI) / 180));
          const front = ang >= 90;
          return (
            <g key={i} transform={`translate(${cardX(i) + CW / 2} 0) scale(${Math.max(0.02, sx)} 1) translate(${-(cardX(i) + CW / 2)} 0)`}>
              <Sheet x={cardX(i)} y={CY} w={CW} h={CH} f={f} title={cd.title} band={cd.band} tilt={0}>
                {front ? <CardIcon i={i} f={f} /> : <rect x={30} y={30} width={CW - 60} height={CH - 140} rx={12} fill={C.modelDeep} opacity={0.25} />}
              </Sheet>
            </g>
          );
        })}
      </BoardSet>
    </Stage>
  </Pop>
);
const ShotTowers: ShotFC<C09> = ({ f }) => {
  const s = 24;
  const tip = ez(f, s + 16, s + 34);
  const slide = Math.max(0, f - (s + 26)) * 40;
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.008, panY: 0, frames: 200, seed: 24 }} vignette={0.3} grain={0.45}>
        <BoardSet f={f}>
          {CARDS.map((cd, i) => (
            <g key={i} transform={`translate(${-cardX(i) * 0.3 + 120 * i - 60} ${CY * 0.2}) scale(0.78)`}>
              <Sheet x={cardX(i)} y={CY} w={CW} h={CH} f={f} title={cd.title} band={cd.band}>
                <CardIcon i={i} f={f} />
              </Sheet>
            </g>
          ))}
          <g transform={`translate(${slide * 0.4} ${slide}) rotate(${tip * 64} 1500 820)`}>
            <Sheet x={1290} y={300} w={360} h={440} f={f} title="THE TOWERS" band="slate">
              <g transform="translate(-40 -60) scale(0.24)">
                <Skyline f={f} family={VOID} ground={1300} lights={0.6} wave={0} seed={3} x0={200} x1={1700} />
              </g>
            </Sheet>
            <line x1={1300} y1={720} x2={1640} y2={330} stroke={CREAM} strokeWidth={26} strokeLinecap="round" {...drawn(lin(f, s, s + 520 / 40))} />
            <line x1={1300} y1={720} x2={1640} y2={330} stroke={INK} strokeWidth={10} strokeLinecap="round" {...drawn(lin(f, s, s + 520 / 40))} />
          </g>
          <ellipse cx={1760} cy={1000} rx={90} ry={14} fill="#000" opacity={0.4} />
          <Tick x={1760} y={995} pxPerM={240} frame={f} facing={-1} pose={f > s + 10 ? "wave" : "stand"} expression={f > s + 10 ? "happy" : "thinking"} headTilt={8} />
        </BoardSet>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL09: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL09(t);
  const shots: ShotDef<C09>[] = [
    { from: 0, S: ShotMoon, id: "9-01" }, // + 9-02 (PUSH): KEY ART 3
    { from: c.stone, S: ShotStone, id: "9-03" },
    { from: c.pit, S: ShotPit, id: "9-04" },
    { from: c.three, S: ShotThree, id: "9-05" },
    { from: c.oldowan, S: ShotGap, id: "9-06" },
    { from: c.track, S: ShotTrack, id: "9-07" },
    { from: c.strata, S: ShotStrata, id: "9-08" },
    { from: c.techno, S: ShotTechno, id: "9-09" },
    { from: c.lens, S: ShotLens, id: "9-10" },
    { from: c.beyond, S: ShotBeyond, id: "9-11" },
    { from: c.cards, S: ShotCards, id: "9-12" },
    { from: c.flip, S: ShotFlip, id: "9-13" },
    { from: c.towers, S: ShotTowers, id: "9-14" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL09 = (t: SceneTiming): Cue[] => {
  const c = cuesL09(t);
  const run = (at: number, n: number, gap = 5, vol = 0.06): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    { at: 0, file: SFX.riser, vol: 0.18, dur: 100, fadeOut: 20 },
    { at: c.prints + 50, file: SFX.chime, vol: 0.14, dur: 60 },
    ...cutHit(c.stone),
    ...cutHit(c.pit),
    ...run(c.pit + 14, 10, 5),
    ...cutHit(c.three),
    ...[0, 1, 2].map((i) => ({ at: c.three + 14 + i * 12, file: SFX.pop, vol: 0.14, dur: 14 })),
    ...cutHit(c.oldowan),
    { at: c.oldowan + 46, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.track),
    { at: c.track + 4, file: SFX.whoosh, vol: 0.2, dur: 60 },
    ...cutHit(c.strata),
    ...cutHit(c.techno),
    ...[0, 1, 2].map((i) => ({ at: c.techno + 32 + i * 14, file: SFX.pop, vol: 0.14, dur: 14 })),
    ...cutHit(c.lens),
    { at: c.lens + 10, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.beyond),
    { at: c.beyond + 4, file: SFX.swirl, vol: 0.18, dur: 60 },
    ...cutHit(c.cards),
    ...[0, 1, 2].map((i) => ({ at: c.cards + 20 + i * 24, file: SFX.click, vol: 0.12, dur: 8 })),
    ...cutHit(c.flip),
    ...[0, 1, 2].map((i) => ({ at: c.flip + 14 + i * 20, file: SFX.pop, vol: 0.14, dur: 14 })),
    ...cutHit(c.towers),
    { at: c.towers + 40, file: SFX.boom, vol: 0.22, dur: 90, fadeOut: 30 },
  ];
};

