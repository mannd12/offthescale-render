// L17 scene "closer" (storyboard §3 "Closer", script lines 52-55) + the 20-s end card. Package B.
// Shot components (hard cuts; PUSH rows are phases): Z-01 · Z-02 · Z-03 · Z-04 · Z-05 · Z-06 · Z-07 (+Z-08) · Z-09 ·
// Z-10 · Z-11 · E (the kit EndCard on a dark void field, `closerTail` frames after the last line).
// Numbers drawn (data17 READ): 3.3 MILLION YEARS (#12 A, Z-07). Words: WHERE THEY WERE LEFT (#12 A, in situ), the
// question 'WHERE WOULD YOU BURY IT?'. OUR REASONING on Z-02 and Z-05 (storyboard §5: #19, the order is ours).
// F6: on the Moon (Z-03, Z-09..Z-11) nothing blows; the flag is rigid; soil and dust only fall. Wind streaks only on
// Earth (Z-08).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, EndCard, Headline, Layer, Motes, Stage, Tick, cameraAt, walkPhase } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ } from "../data17";
import { RailTicks, TimeLadder, YearsDial } from "../ladder";
import { Rail, TimeCamera } from "../rig";
import { ReasoningPill } from "../stamps17";
import { Skyline } from "../city";
import { DotStream, StarsTint } from "../movers17";
import { BandIcon, LampIcon, PrintIcon, PumpIcon } from "../icons17";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, CREAM, FamSky, HeroStone, INK, Label, MoonSet, Pop, RigidFlag, Rings, RollDec, Strata, TextPlate, Wind, ez, lin, mod, path1, rnd } from "./b-parts";

/** Frames after the last line for the 20-s end card (EndCard from the kit). */
export const closerTail = 600;

export const cuesCloser = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    honest: 0, // Z-01
    sink: frac(0, 0.24), // Z-02
    prints: frac(0, 0.56), // Z-03
    band: frac(0, 0.79), // Z-04
    off: at(1), // Z-05
    stays: frac(1, 0.5), // Z-06
    stone: at(2), // Z-07
    left: frac(2, 0.54), // Z-08 (phase)
    flag: at(3), // Z-09
    dig: frac(3, 0.51), // Z-10
    pull: frac(3, 1.03), // Z-11
    card: t.frames, // E
    end: t.frames + closerTail,
  };
};
export type CCloser = ReturnType<typeof cuesCloser>;

const NIGHT = familyOf("night");
const VOID = familyOf("void");
const DUSK = familyOf("dusk");
const DEEP = familyOf("deep");
const MUD = ["#8F5A36", "#6E4630", "#A8703E", "#5A3A2A", "#7A5236", "#4A2E22"];
const SOIL = ["#4A1C16", "#3A1812", "#5A2A1E", "#2E1114"];

// ===============================================================================================================
// Z-01 · quiet: the empty rail, the camera, the dial settling at one million with a rattle; Tick stands beside it,
// hands folded. MOVER: stars sliding (14 px/f) + rail ticks (6 px/f) + the needle's rattle. HUD ladder fully lit.
// ===============================================================================================================
const ShotHonest: ShotFC<CCloser> = ({ f }) => {
  const settle = 1 - 0.07 * Math.exp(-f / 30) * Math.cos(f / 3);
  return (
    <Stage theme={NIGHT.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.01, panY: 0, frames: 240, seed: 3 }} vignette={0.3} grain={0.5}>
      <Layer depth={0.05}>
        <FamSky name="night" />
      </Layer>
      <Layer depth={0.2}>
        <StarsTint f={f} x={-300} y={-200} w={2500} h={1000} n={120} speed={14} seed={4} />
      </Layer>
      <Layer depth={1}>
        <rect x={-600} y={900} width={3200} height={500} fill="#06151D" />
        <Rail f={f} y={910} speed={6} family={NIGHT} />
        <TimeCamera x={1120} y={900} size={230} f={f} family={NIGHT} dial={{ value: settle, word: "ONE MILLION YEARS" }} />
        <ellipse cx={1420} cy={906} rx={90} ry={12} fill="#000" opacity={0.35} />
        <Tick x={1420} y={900} pxPerM={250} frame={f} facing={-1} pose="stand" expression="neutral" look={0.1} />
        <YearsDial x={480} y={460} r={230} value={settle} family={NIGHT} f={f} plate="dark" rattle={Math.exp(-f / 40)} />
      </Layer>
      <Layer depth={0}>
        <TimeLadder f={f} family={NIGHT} lit={9} glow={8} labels="none" x={1830} width={56} />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// Z-02 · a ghost skyline sinks box by box (16 px/f, staggered) into a band of ground cover that creeps up (8 px/f).
// Pill OUR REASONING (#19: "probably", no date).
// ===============================================================================================================
const GroundCover: React.FC<{ f: number; y: number; h: number }> = ({ f, y, h }) => (
  <g>
    <rect x={-600} y={y} width={3200} height={600} fill="#0E3A30" />
    {Array.from({ length: 46 }, (_, i) => {
      const x = -400 + i * 64 + rnd(i * 3) * 30;
      const bh = h * (0.6 + 0.6 * rnd(i * 7)) + Math.sin(f / 9 + i) * 6;
      return <ellipse key={i} cx={x} cy={y} rx={52 + rnd(i) * 20} ry={bh} fill={i % 3 ? "#1E5A44" : "#2F7A52"} />;
    })}
    {Array.from({ length: 30 }, (_, i) => (
      <circle key={"b" + i} cx={-300 + i * 90 + rnd(i * 9) * 40} cy={y - h * 0.5 * rnd(i * 5)} r={5} fill={i % 2 ? C.amber : "#7FE0D8"} opacity={0.7} />
    ))}
  </g>
);
const ShotSink: ShotFC<CCloser> = ({ f, len }) => {
  const sink = lin(f, 6, len - 10);
  const cover = 60 + f * 0.9;
  return (
    <Pop f={f}>
      <Stage theme={NIGHT.theme} shotFrame={f} drift={{ zoom: 1.04, panX: -0.008, panY: 0, frames: 220, seed: 5 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.05}>
          <FamSky name="night" />
        </Layer>
        <Layer depth={0.2}>
          <StarsTint f={f} x={-200} y={-100} w={2400} h={700} n={90} speed={4} seed={6} />
        </Layer>
        <Layer depth={1}>
          <Skyline f={f} family={NIGHT} ground={820} lights={0.05} wave={0} ghost sink={sink} seed={8} />
          <GroundCover f={f} y={820} h={cover} />
        </Layer>
        <Layer depth={0}>
          <ReasoningPill x={80} y={100} size={26} appear={ez(f, 10, 22)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-03 · the line of prints in the dust; the camera dollies along (18 px/f); dust only falls (F6). #11 A.
// ===============================================================================================================
const ShotPrints: ShotFC<CCloser> = ({ f }) => {
  const shift = f * 18;
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0, panY: 0, frames: 220, seed: 7 }} vignette={0.3} grain={0.45}>
        <Layer depth={1}>
          <MoonSet f={f} shift={shift} horizon={700} earth={{ x: 1500, y: 220, r: 60 }} prints={{ x0: 100, y: 880, n: 20, gap: 190, size: 150 }} starSpeed={1.5} />
          <DotStream f={f} from={[1500 - mod(shift, 600), 800]} to={[1500 - mod(shift, 600), 890]} n={14} speed={3} spread={50} gravity={1} color={C.moonDust} size={4} seed={9} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-04 · a strata band lights (a light sweeping along it at 24 px/f); a chipped stone slides in beside it (20 px/f).
// #13 #14 A, #12 A.
// ===============================================================================================================
const ShotBand: ShotFC<CCloser> = ({ f }) => {
  const lit = Math.max(0, f - 4) * 24;
  const sx = Math.max(1480, 2300 - Math.max(0, f - 30) * 20);
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.008, panY: 0, frames: 220, seed: 9 }} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <Strata y0={-500} depth={1000} palette={MUD} seed={31} minH={90} maxH={170} />
          <rect x={-600} y={500} width={3200} height={46} fill="#7A5236" />
          <clipPath id="zbandlit">
            <rect x={-600} y={480} width={600 + lit} height={90} />
          </clipPath>
          <g clipPath="url(#zbandlit)">
            <Bloom x={Math.min(1900, lit - 300)} y={523} r={400} color={C.amber} strength={0.45} squash={0.25} />
            <rect x={-600} y={500} width={3200} height={46} fill="#F2B544" />
            <rect x={-600} y={500} width={3200} height={14} fill="#FFE6A8" />
          </g>
          {lit < 2100 ? <rect x={lit - 20} y={490} width={30} height={66} fill="#FFFFFF" opacity={0.7} /> : null}
          <Strata y0={546} depth={900} palette={MUD.slice(2)} seed={33} minH={90} maxH={170} />
          <HeroStone x={sx} y={760} size={300} dark />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#FFCF73" seed={11} size={3} drift={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-05 · a lamp, a pump, a rusting bar and a paint can in a row switch off and sink in turn (16 px/f, stagger 26 f).
// Pill OUR REASONING (#19, modelled).
// ===============================================================================================================
const ShotOff: ShotFC<CCloser> = ({ f }) => {
  const ground = 780;
  const items = [
    { x: 400, node: (lit: number) => <LampIcon x={0} y={-150} size={300} lit={lit} /> },
    { x: 800, node: (lit: number) => <PumpIcon x={0} y={-110} size={200} f={f} running={lit > 0.5} /> },
    {
      x: 1200,
      node: (lit: number) => (
        <g>
          <rect x={-30} y={-300} width={60} height={300} rx={8} fill={C.steel} />
          <rect x={-30} y={-220} width={60} height={110} fill={C.rust} />
          <rect x={-30} y={-160} width={60} height={40} fill="#D86A2A" opacity={0.6 + 0.4 * lit} />
        </g>
      ),
    },
    {
      x: 1580,
      node: (lit: number) => (
        <g>
          <rect x={-80} y={-190} width={160} height={190} rx={12} fill="#C98A2E" />
          <rect x={-80} y={-150} width={160} height={70} fill={C.paper} opacity={0.4 + 0.6 * lit} />
          <ellipse cx={0} cy={-190} rx={80} ry={16} fill="#E0A93A" />
          <path d="M-70 -200 Q0 -280 70 -200" fill="none" stroke={INK} strokeWidth={6} />
        </g>
      ),
    },
  ];
  return (
    <Pop f={f}>
      <Stage theme={NIGHT.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.008, panY: 0, frames: 220, seed: 11 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.05}>
          <FamSky name="night" />
        </Layer>
        <Layer depth={0.2}>
          <StarsTint f={f} x={-200} y={-100} w={2400} h={700} n={90} speed={5} seed={12} />
        </Layer>
        <Layer depth={1}>
          <clipPath id="zoffclip">
            <rect x={-600} y={-600} width={3200} height={ground + 600} />
          </clipPath>
          {items.map((it, i) => {
            const t0 = 10 + i * 26;
            const lit = 1 - ez(f, t0, t0 + 6);
            const dy = Math.max(0, f - t0 - 8) * 16;
            return (
              <g key={i}>
                {lit > 0.05 ? <Bloom x={it.x} y={ground - 200} r={240} color={C.amber} strength={0.5 * lit} /> : null}
                <g clipPath="url(#zoffclip)">
                  <g transform={`translate(${it.x} ${ground + dy})`}>{it.node(lit)}</g>
                </g>
                {dy > 0 && dy < 420 ? <ellipse cx={it.x} cy={ground} rx={60 + dy * 0.2} ry={10 + dy * 0.03} fill="#4A6E72" opacity={0.6 * (1 - dy / 420)} /> : null}
              </g>
            );
          })}
          <rect x={-600} y={ground} width={3200} height={500} fill="#0D2B38" />
          <rect x={-600} y={ground} width={3200} height={8} fill="#26525F" />
        </Layer>
        <Layer depth={0}>
          <ReasoningPill x={80} y={100} size={26} appear={ez(f, 6, 18)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-06 · a print, a stone and a band stay solid; soft glow rings expand from each (10 px/f); Tick sits on the stone and
// rests. #11 #12 #13.
// ===============================================================================================================
const ShotStays: ShotFC<CCloser> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len, x: 980, y: 540, zoom: 1.1 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.45}>
        <Layer depth={0.1}>
          <FamSky name="void" />
          <StarsTint f={f} x={-300} y={-300} w={2500} h={1000} n={110} speed={3} seed={14} />
        </Layer>
        <Layer depth={1}>
          <ellipse cx={960} cy={830} rx={1100} ry={120} fill="#1B414C" />
          {[
            [420, 700],
            [960, 640],
            [1500, 700],
          ].map(([x, y], i) => (
            <Rings key={i} f={f + i * 10} cx={x} cy={y} r0={90} every={30} speed={10} maxR={330} color={[C.moonDust, C.amber, C.saffronCore][i]} width={5} ry={0.55} />
          ))}
          <g>
            <ellipse cx={420} cy={760} rx={170} ry={40} fill="#5E4E36" />
            <PrintIcon x={420} y={745} size={190} rotate={-90} fill="#B79C70" ink="#4E3F2C" />
          </g>
          <HeroStone x={960} y={700} size={300} dark />
          <BandIcon x={1500} y={700} size={190} glow={C.amber} />
          <Tick x={1000} y={600} pxPerM={170} frame={f} pose="sit" expression="sleepy" look={0} />
        </Layer>
        <Layer depth={1.3}>
          <Motes frame={f} n={16} w={1920} h={1080} color={C.moonDust} seed={15} size={3} drift={20} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-07 + Z-08 · the camera pushes onto the chipped stone (ruler ticks scrolling 16 px/f beneath) as the counter rolls to
// 3.3 MILLION YEARS (#12 A). Phase Z-08: the stone on its soil with the tag WHERE THEY WERE LEFT; dry wind streaks pass
// (14 px/f) and dust skims (12 px/f); the hold.
// ===============================================================================================================
const ShotStone: ShotFC<CCloser> = ({ f, len, c }) => {
  const p8 = c.left - c.stone;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 600, zoom: 0.82 },
    { f: p8, x: 960, y: 560, zoom: 1.18 },
    { f: len, x: 990, y: 550, zoom: 1.24 },
  ]);
  return (
    <Stage theme={DEEP.theme} cam={cam} vignette={0.35} grain={0.5}>
      <Layer depth={0.1}>
        <FamSky name="deep" />
      </Layer>
      <Layer depth={0.5}>
        <Strata y0={-500} depth={1100} palette={SOIL} seed={41} minH={100} maxH={200} />
      </Layer>
      <Layer depth={1}>
        <rect x={-800} y={640} width={3600} height={900} fill="#2E1114" />
        <rect x={-800} y={640} width={3600} height={14} fill="#6A3020" />
        <Bloom x={980} y={560} r={520} color={C.lantern} strength={0.5} />
        <HeroStone x={960} y={600} size={340} glint={mod(f / 50, 1)} dark />
        <RailTicks f={f} y={760} speed={16} color="#E0B49A" gap={56} x0={-600} x1={2600} />
        {f > p8 - 10 ? (
          <g opacity={ez(f, p8, p8 + 12)}>
            <line x1={1120} y1={520} x2={1300} y2={420} stroke={CREAM} strokeWidth={3} />
            <rect x={1290} y={370} width={470} height={90} rx={20} fill={C.paper} />
            <Label x={1525} y={428} text="WHERE THEY WERE LEFT" size={30} color={INK} align="middle" />
          </g>
        ) : null}
      </Layer>
      <Layer depth={1.2}>
        <Wind f={f} y0={420} y1={720} n={10} speed={14} color="#E0B49A" opacity={0.45 * ez(f, p8 - 20, p8)} />
        <DotStream f={f} from={[-100, 650]} to={[2100, 620]} n={30} speed={12} spread={40} color="#E0B49A" size={3} seed={17} />
      </Layer>
      <Layer depth={0}>
        <g opacity={ez(f, 4, 16) * (1 - ez(f, p8 - 12, p8))}>
          <TextPlate x={80} y={830} w={940} h={170} color="#1A0A0C" opacity={0.82} />
          <RollDec x={120} y={950} value={READ.lomekwi.value! /* #12 A */} k={ez(f, 8, 70)} unit="MILLION YEARS" size={110} unitColor={C.lantern} who="Z-07 tools" />
        </g>
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// Z-09 · on the Moon: the camera tilts down from the sky (peak ~20 px/f) to a single chipped stone; Tick walks in
// (5 px/f) and plants a rigid flag beside it; dust settles by falling only (F6). #11 #12.
// ===============================================================================================================
const ShotFlag: ShotFC<CCloser> = ({ f, len }) => {
  const camY = path1(f, [
    [0, -260],
    [8, -220],
    [64, 560],
    [len, 600],
  ]);
  const stop = 70;
  const tx = 360 + Math.min(f, stop) * 5;
  const plant = ez(f, stop + 4, stop + 22);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={{ x: 960, y: camY, zoom: 1 }} vignette={0.3} grain={0.45}>
        <Layer depth={1}>
          <MoonSet f={f} horizon={640} earth={{ x: 1380, y: -380, r: 120 }} starSpeed={1.2} seed={6} />
          <HeroStone x={1220} y={900} size={200} dark />
          <DotStream f={f} from={[tx + 160, 820]} to={[tx + 160, 912]} n={16} speed={3} spread={50} gravity={1} color={C.moonDust} size={4} seed={19} />
          <RigidFlag x={tx + 160} y={912} h={240} plant={f > stop ? plant : 0.001} />
          <ellipse cx={tx + 6} cy={914} rx={70} ry={12} fill="#1A140C" opacity={0.5} />
          <Tick x={tx} y={910} pxPerM={200} frame={f} pose={f < stop ? "carry" : plant < 1 ? "press" : "stand"} walk={f < stop ? walkPhase(f, 27) : undefined} expression="thinking" look={0.3} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-10 · Tick digs a small hole beside the stone (soil falling straight down onto a pile, 14 px/f) and lowers a plain
// box into it (10 px/f); the question sits on screen: Headline 'WHERE WOULD YOU BURY IT?'.
// ===============================================================================================================
const ShotDig: ShotFC<CCloser> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len, x: 1000, y: 580, zoom: 1.1 },
  ]);
  const hole = ez(f, 0, 40);
  const boxY = 740 + Math.max(0, f - 50) * 10;
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.45}>
        <Layer depth={1}>
          <MoonSet f={f} horizon={560} earth={{ x: 1600, y: 160, r: 70 }} starSpeed={1.2} seed={6} />
          <HeroStone x={1460} y={860} size={220} dark />
          {/* the hole and the soil pile */}
          <ellipse cx={1080} cy={900} rx={150 * hole} ry={44 * hole} fill="#1A140C" />
          <ellipse cx={1080} cy={904} rx={130 * hole} ry={34 * hole} fill="#0C0906" />
          <path d={`M720 ${930} Q790 ${930 - 70 * hole} 860 930 Z`} fill="#8C7552" />
          <DotStream f={f} from={[790, 760]} to={[790, 905]} n={24} speed={14} spread={40} gravity={1} color="#C9B086" size={6} seed={21} />
          <clipPath id="zdigclip">
            <rect x={900} y={0} width={360} height={900} />
            <ellipse cx={1080} cy={900} rx={150} ry={44} />
          </clipPath>
          <g clipPath="url(#zdigclip)">
            <rect x={1020} y={boxY - 100} width={120} height={100} rx={10} fill={C.saffron} />
            <rect x={1020} y={boxY - 100} width={120} height={18} rx={8} fill="#FFE6A8" />
          </g>
          <ellipse cx={930} cy={914} rx={70} ry={12} fill="#1A140C" opacity={0.5} />
          <Tick x={930} y={910} pxPerM={200} frame={f} pose={f < 50 ? "crouch-reach" : "crouch"} expression="thinking" look={0.2} />
        </Layer>
        <Layer depth={0}>
          <Headline x={110} y={300} lines={["WHERE WOULD", "YOU BURY IT?"]} size={104} color={CREAM} accent={C.saffronCore} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-11 · the hold (3.0 s): a slow pull back from the hole, the stone and Tick's camera with its dial; the stars stream
// (14 px/f); the frame darkens into the end card.
// ===============================================================================================================
const ShotPull: ShotFC<CCloser> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1040, y: 760, zoom: 1.35 },
    { f: len, x: 960, y: 520, zoom: 0.8 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.35} grain={0.45}>
        <Layer depth={0.2}>
          <StarsTint f={f} x={-600} y={-700} w={3200} h={1300} n={140} speed={14} seed={23} />
        </Layer>
        <Layer depth={1}>
          <MoonSet f={f} horizon={560} earth={false} starSpeed={0} seed={6} />
          <HeroStone x={1460} y={860} size={220} dark />
          <ellipse cx={1080} cy={900} rx={150} ry={44} fill="#1A140C" />
          <ellipse cx={1080} cy={904} rx={130} ry={34} fill="#0C0906" />
          <path d="M720 930 Q790 860 860 930 Z" fill="#8C7552" />
          <TimeCamera x={620} y={930} size={180} f={f} family={VOID} dial={{ value: 1, word: "ONE MILLION YEARS" }} />
        </Layer>
        <Layer depth={0}>
          <rect x={0} y={0} width={1920} height={1080} fill="#020A0E" opacity={ez(f, len - 26, len)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// E · the kit EndCard on a dark void field: tinted stars drift, a thin band of Moon dust low on the right; the right
// half stays clear for the end-screen tiles.
// ===============================================================================================================
const EndCardShot: React.FC<{ f: number; len: number }> = ({ f, len }) => (
  <AbsoluteFill>
    <Stage theme={VOID.theme} drift={false} vignette={0.3} grain={0.4}>
      <Layer depth={0.05}>
        <FamSky name="void" />
        <StarsTint f={f} x={0} y={0} w={1920} h={1080} n={120} speed={2} seed={31} />
      </Layer>
      <Layer depth={0}>
        <EndCard t={Math.min(1, f / Math.max(1, len))} family={{ ...VOID, text: CREAM, dim: "#9FB7B8" }} />
      </Layer>
    </Stage>
    <AbsoluteFill style={{ background: "#020A0E", opacity: 1 - Math.min(1, f / 16) }} />
  </AbsoluteFill>
);

// ===============================================================================================================

export const SceneCloser: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCloser(t);
  if (f >= c.card) return <EndCardShot f={f - c.card} len={c.end - c.card} />;
  const shots: ShotDef<CCloser>[] = [
    { from: 0, S: ShotHonest, id: "Z-01" },
    { from: c.sink, S: ShotSink, id: "Z-02" },
    { from: c.prints, S: ShotPrints, id: "Z-03" },
    { from: c.band, S: ShotBand, id: "Z-04" },
    { from: c.off, S: ShotOff, id: "Z-05" },
    { from: c.stays, S: ShotStays, id: "Z-06" },
    { from: c.stone, S: ShotStone, id: "Z-07" }, // + Z-08 (PUSH)
    { from: c.flag, S: ShotFlag, id: "Z-09" },
    { from: c.dig, S: ShotDig, id: "Z-10" },
    { from: c.pull, S: ShotPull, id: "Z-11" },
  ];
  return playShots(f, shots, c, c.card);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCloser = (t: SceneTiming): Cue[] => {
  const c = cuesCloser(t);
  return [
    ...cutHit(c.sink),
    { at: c.sink + 10, file: SFX.debris, vol: 0.12, dur: 90, fadeOut: 30 },
    ...cutHit(c.prints),
    { at: c.prints + 6, file: SFX.chime, vol: 0.14, dur: 60 },
    ...cutHit(c.band),
    { at: c.band + 30, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.off),
    ...[0, 1, 2, 3].map((i) => ({ at: c.off + 10 + i * 26, file: SFX.click, vol: 0.1, dur: 8 })),
    ...cutHit(c.stays),
    { at: c.stays + 8, file: SFX.chime, vol: 0.14, dur: 60 },
    ...cutHit(c.stone),
    { at: c.left + 4, file: SFX.wind, vol: 0.12, dur: 150, fadeIn: 20, fadeOut: 40 },
    ...cutHit(c.flag),
    ...cutHit(c.dig),
    ...cutHit(c.pull, 0.14),
  ];
};

