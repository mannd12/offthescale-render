// L19 scene "l05" (storyboard §3 "5 · The last signal", script lines 31-33). Package B.
// ShotDefs (hard cuts; PUSH / SLIDE rows are phases): 5-01 · 5-02 · 5-03 · 5-04 · 5-05 · 5-06 (+5-07, SLIDE) · 5-08 · 5-09.
// Numbers drawn (all data19 READ): 23 ATMOSPHERES (#2, #3 A; D1: never "23 BAR", the needle parks on the dial's 23 notch) and
// the 58:00 timer (#2, #3 A) on 5-01 · TOPPED 300 F (#2 A) and the 300 F notch on 5-02 · ABOUT 150 C + OUR SUM (#15 C) on 5-03.
// 5-05's MISSION REQUIREMENT marker sits at the dial's 10 notch (below half of 23, F6) and shows no numeral; MORE THAN TWICE (#3 A).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Embers, Layer, Motes, Stage, Tick } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ } from "../data19";
import { BarDial, Thermo, dialAngle, needleTo } from "../dial";
import { TapeTicket, TapeTrace } from "../tape";
import { DeckBands, Wisps } from "../decks";
import { Canopy, Capsule, GhostProbe } from "../probe19";
import { AgencyPill, OurSumPill, WordPill } from "../tags19";
import { Sparks } from "../flows19";
import { Headset } from "../icons19";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { BandField19, C, DRIFT, DarkSky, FamSky, GlowBands, Label, Plate, Pop, Readout, cl, ez, lin, mod, runOf } from "./b-parts";

export const cuesL05 = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    s501: 0,
    s502: frac(0, 0.3),
    s503: frac(0, 0.56),
    s504: frac(0, 0.8),
    s505: at(1),
    s506: frac(1, 0.5),
    s507: at(2),
    s508: frac(2, 0.42),
    s509: frac(2, 0.7),
    end: t.frames,
  };
};
export type C05 = ReturnType<typeof cuesL05>;

const DD = familyOf("deepdeck");
const FU = familyOf("furnace");
const DEEP_COLS = ["#C0301A", "#A02418", "#D8381C", "#701410", "#F26A1E", "#8E1A18"];

/** The fall below the cloud tops: decks scrolling up past the camera (the free mover) with wisps rushing past. */
const DeepWorld: React.FC<{ f: number; speed?: number; dim?: number }> = ({ f, speed = 16, dim = 0 }) => (
  <>
    <Layer depth={0.1}>
      <FamSky name="deepdeck" />
    </Layer>
    <Layer depth={0.4}>
      <DeckBands f={f} speed={speed} shear={[16, -14, 20, -18, 14, -16]} x={-400} y={-300} w={2720} h={1680} colors={DEEP_COLS} belt />
      <Wisps f={f} x={-300} y={-200} w={2520} h={1480} n={10} speed={speed + 8} />
      {dim > 0 ? <rect x={-600} y={-600} width={3120} height={2280} fill="#2A0604" opacity={dim} /> : null}
    </Layer>
  </>
);

// ===============================================================================================================
// 5-01 · the needle sweeps 21 → 23 (then trembles on the notch), the timer rolls to 58:00, the jagged tape scrolls 30 px/f
// ===============================================================================================================
const Shot501: ShotFC<C05> = ({ f, len }) => {
  const p = ez(f, 4, len * 0.62);
  return (
    <Pop f={f}>
      <Stage theme={DD.theme} shotFrame={f} drift={DRIFT(51)} vignette={0.2} grain={0.5}>
        <DeepWorld f={f} />
        <Layer depth={0.7}>
          <Canopy x={360} y={360} r={44} unfurl={1} f={f} />
          <Capsule x={360} y={360} r={44} f={f} chips={6} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={1240} y={470} r={520} color={C.glow} strength={0.45 + 0.1 * Math.sin(f * 0.3)} />
          <circle cx={1240} cy={470} r={345} fill="#2A0604" opacity={0.5} />
          <BarDial f={f} cx={1240} cy={470} r={300} needle={needleTo(21, 23, p)} lit={12} />
          <Sparks f={f} x={1240} y={1120} w={500} h={500} n={26} speed={26} angle={-90} seed={4} />
          <TapeTrace f={f + 40} x={-80} y={940} w={1340} h={110} mode="jagged" speed={30} timer={lin(f, 0, len * 0.8)} />
        </Layer>
        <Layer depth={0}>
          <Readout x={70} y={64} value={READ.atm23.value! /* #2, #3 A */} from={21} k={p} unit="ATMOSPHERES" size={86} w={790} appear={lin(f, 0, 10)} who="5-01 23 atm" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-02 · the thermometer beside the dial: mercury climbs past the 300 F notch; the heat ring fills; the tape keeps scrolling
// ===============================================================================================================
const Shot502: ShotFC<C05> = ({ f, len }) => {
  const H = 680;
  const bulb = 960;
  const w = H * 0.12;
  const level = 0.34 + 0.6 * lin(f, 0, len);
  const y300 = bulb - w * 0.6 - (H - w) * 0.7;
  return (
    <Pop f={f}>
      <Stage theme={DD.theme} shotFrame={f} drift={DRIFT(52)} vignette={0.2} grain={0.5}>
        <DeepWorld f={f} speed={18} />
        <Layer depth={1}>
          <Bloom x={640} y={640} r={420} color={C.glow} strength={0.4 + 0.15 * Math.sin(f * 0.5)} />
          <BarDial f={f} cx={640} cy={650} r={250} needle={23} lit={12} heat={0.35 + 0.65 * lin(f, 0, len * 0.8)} heatMark={false} />
          <Bloom x={1320} y={y300} r={260} color="#FF7A30" strength={(0.35 + 0.2 * Math.sin(f * 0.7)) * cl((level - 0.6) * 4)} />
          <Thermo x={1320} y={bulb} h={H} level={level} f={f} />
          <line x1={1250} y1={y300} x2={1420} y2={y300} stroke={C.goldHot} strokeWidth={6} />
          <Label x={1440} y={y300 + 12} text="300 F" size={36} color={C.goldHot} halo="#3A0806" />
          <TapeTrace f={f + 60} x={-80} y={130} w={980} h={100} mode="jagged" speed={30} />
        </Layer>
        <Layer depth={0}>
          <Readout x={1000} y={60} value={READ.f300.value! /* #2 A */} k={lin(f, 2, 34)} pre="TOPPED" unit="F" size={80} w={500} appear={lin(f, 0, 10)} who="5-02 300 F" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-03 · the F → C slider: the puck slides 32 px/f along a lemon track whose ticks stream; the counter rolls 300 → 150
// ===============================================================================================================
const Shot503: ShotFC<C05> = ({ f, len }) => {
  const x0 = 320;
  const x1 = 1360;
  const k = ez(f, 2, Math.min(len - 6, 2 + (x1 - x0) / 32));
  const px = x0 + (x1 - x0) * k;
  return (
    <Pop f={f}>
      <Stage theme={DD.theme} shotFrame={f} drift={DRIFT(53)} vignette={0.2} grain={0.5}>
        <DeepWorld f={f} speed={16} dim={0.15} />
        <Layer depth={1}>
          <Plate x={x0 - 90} y={520} w={x1 - x0 + 180} h={150} color="#3A0806" opacity={0.75} rx={60} />
          <rect x={x0} y={575} width={x1 - x0} height={40} rx={20} fill={C.heard} stroke={C.lemonDeep} strokeWidth={4} />
          {Array.from({ length: 34 }, (_, i) => {
            const tx = x0 + mod(i * 40 - f * 32, 34 * 40);
            return tx < x1 - 10 ? <line key={i} x1={tx} y1={578} x2={tx} y2={i % 5 ? 596 : 610} stroke={C.ink} strokeWidth={i % 5 ? 3 : 5} /> : null;
          })}
          <Label x={x0 - 40} y={610} text="F" size={52} color={C.goldHot} align="end" />
          <Label x={x1 + 40} y={610} text="C" size={52} color={C.goldHot} />
          <Bloom x={px} y={595} r={170} color={C.goldHot} strength={0.5} />
          <circle cx={px} cy={595} r={66} fill={C.lever} stroke={C.goldHot} strokeWidth={8} />
          <path d={`M${px - 26} 595 L${px + 18} 595 M${px + 4} 578 L${px + 22} 595 L${px + 4} 612`} stroke={C.ink} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <TapeTrace f={f + 90} x={-80} y={950} w={1300} h={100} mode="jagged" speed={30} />
        </Layer>
        <Layer depth={0}>
          <Readout x={70} y={64} value={READ.c150.value! /* #15 C (149) */} from={300} k={k} pre="ABOUT" unit="C" size={86} w={560} appear={lin(f, 0, 10)} who="5-03 150 C" />
          <OurSumPill x={680} y={150} size={28} appear={lin(f, 6, 16)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-04 · silent: the tape goes flat but keeps scrolling; the six chips die in turn (8 f); the probe sinks, decks scroll up 14 px/f
// ===============================================================================================================
const Shot504: ShotFC<C05> = ({ f, len }) => {
  const dead = Math.max(0, (f - 8) / 8);
  const dim = 0.1 + 0.25 * lin(f, 0, len);
  return (
    <Pop f={f}>
      <Stage theme={DD.theme} shotFrame={f} drift={DRIFT(54)} vignette={0.24} grain={0.5}>
        <DeepWorld f={f} speed={14} dim={dim} />
        <Layer depth={1}>
          <Bloom x={820} y={420 + f * 1.2} r={420} color={C.probe} strength={0.35 * (1 - lin(f, 0, len) * 0.5)} />
          <Canopy x={820} y={420 + f * 1.2} r={130} unfurl={1} f={f} sway={4} />
          <Capsule x={820} y={420 + f * 1.2} r={130} f={f} chips={6} dead={Math.min(6, dead)} />
          <TapeTrace f={f + 120} x={-80} y={960} w={1500} h={100} mode="flat" speed={28} />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={18} w={1920} h={1080} color="#FFD27A" seed={54} size={3} drift={20} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-05 · MISSION REQUIREMENT: the marker at the 10 notch, the needle trembling at 23, a bracket arc drawing from one to the other
// ===============================================================================================================
const Shot505: ShotFC<C05> = ({ f, len }) => {
  const cx = 860;
  const cy = 560;
  const r = 360;
  const a10 = (dialAngle(10) * Math.PI) / 180;
  const mx = cx + Math.cos(a10) * (r + 70);
  const my = cy + Math.sin(a10) * (r + 70);
  return (
    <Pop f={f}>
      <Stage theme={DD.theme} shotFrame={f} drift={DRIFT(55)} vignette={0.2} grain={0.5}>
        <DeepWorld f={f} speed={20} />
        <Layer depth={1}>
          <Bloom x={cx} y={cy} r={560} color={C.glow} strength={0.45 + 0.15 * Math.sin(f * 0.6)} />
          <circle cx={cx} cy={cy} r={410} fill="#2A0604" opacity={0.5} />
          <BarDial
            f={f}
            cx={cx}
            cy={cy}
            r={r}
            needle={23 * Math.exp(0.05 * Math.sin(f * 0.8))}
            lit={12}
            marker={10}
            heat={0.6 + 0.2 * Math.sin(f * 0.25)}
            heatMark={false}
            arcs={[{ from: 10, to: 23, draw: lin(f, 6, 6 + 380 / 36 + 14), color: C.heard, inset: 1.2, width: 0.07 }]}
          />
          <Label x={mx - 30} y={my - 20} text="MISSION REQUIREMENT" size={30} color={C.heard} align="end" halo="#3A0806" />
        </Layer>
        <Layer depth={0}>
          <WordPill x={1300} y={150} text="MORE THAN TWICE" size={40} F={DD} appear={lin(f, 18, 30)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-06 · "a good run": through the station window the probe sinks lower (bands rising 18 px/f), the blank tape scrolls;
//        Tick (≥ 40 % of the frame) slowly lowers the headset. SLIDE → 5-07.
// ===============================================================================================================
const Shot506: ShotFC<C05> = ({ f, len }) => {
  const down = ez(f, 10, len * 0.85);
  const py = 300 + 320 * lin(f, 0, len);
  return (
    <Stage theme={DD.theme} shotFrame={f} drift={DRIFT(56)} vignette={0.22} grain={0.5}>
      <DeepWorld f={f} speed={18} dim={0.2} />
      <Layer depth={0.9}>
        <Canopy x={620} y={py} r={70} unfurl={1} f={f} />
        <Capsule x={620} y={py} r={70} f={f} chips={6} dead={6} />
      </Layer>
      <Layer depth={1}>
        {/* the station wall, right: window frame edge and an emerald wall */}
        <rect x={1180} y={-300} width={1200} height={1700} fill="#00603A" />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={1180 + mod(i * 240 + f * 4, 1440)} y={-300} width={110} height={1700} fill="#0B7A48" opacity={0.8} />
        ))}
        <rect x={1150} y={-300} width={44} height={1700} fill="#004A2E" />
        <rect x={1150} y={-300} width={10} height={1700} fill="#40D486" opacity={0.7} />
        <TapeTrace f={f + 140} x={-80} y={880} w={1180} h={96} mode="flat" speed={24} />
        <Tick
          x={1500}
          y={1060}
          pxPerM={270}
          frame={f}
          pose="listen"
          poseTo="stand"
          poseT={down}
          expression="worried"
          expressionTo="neutral"
          expressionT={down}
          headTilt={-10 * down}
          look={-0.6}
          facing={-1}
        />
        <Headset x={1490 - 40 * down} y={1060 - 395 + 250 * down} size={90} />
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={16} w={1920} h={1080} color="#FFD27A" seed={56} size={3} drift={20} />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 5-07 · NASA SAYS: the probe glows, its canopy dissolves into embers streaming up 26 px/f; a dashed ghost keeps falling;
//        the glow bands rise 20 px/f (furnace, dark but glowing)
// ===============================================================================================================
const Shot507: ShotFC<C05> = ({ f, len }) => {
  const u = lin(f, 0, len);
  const gy = 380 + 220 * u;
  return (
    <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(57)} vignette={0.24} grain={0.5}>
      <Layer depth={0.1}>
        <DarkSky name="furnace" />
        <BandField19 f={f} k="furnace" />
      </Layer>
      <Layer depth={0.5}>
        <GlowBands f={f} speed={20} opacity={0.26} />
        <Bloom x={900} y={1250} r={900} color={C.glow} strength={0.4} />
      </Layer>
      <Layer depth={1}>
        <Bloom x={900} y={gy} r={380} color={C.goldHot} strength={0.5 * (1 - u * 0.6)} />
        <Canopy x={900} y={gy} r={90} unfurl={1 - ez(f, 4, len * 0.7)} f={f} />
        <g opacity={1 - ez(f, len * 0.3, len * 0.9)}>
          <Capsule x={900} y={gy} r={90} f={f} glow={1} dead={6} />
        </g>
        <g opacity={ez(f, len * 0.2, len * 0.6)}>
          <GhostProbe x={900} y={gy} r={110} f={f} />
        </g>
        <Sparks f={f} x={900} y={gy - 40} w={500} h={700} n={40} speed={26} angle={-90} seed={7} />
        <Embers frame={f} x0={200} x1={1700} y={1100} n={40} color={C.goldHot} seed={57} />
      </Layer>
      <Layer depth={0}>
        <AgencyPill x={90} y={110} agency="NASA SAYS" size={34} appear={lin(f, 2, 14)} />
      </Layer>
    </Stage>
  );
};

const Run506 = runOf<C05>((c) => [
  { at: c.s506, S: Shot506 },
  { at: c.s507, S: Shot507, dir: "up", blend: 16 },
]);
const Shot506Run: ShotFC<C05> = (p) => (
  <Pop f={p.f}>
    <Run506 {...p} />
  </Pop>
);

// ===============================================================================================================
// 5-08 · "No instrument told us that": the HEARD ticket slides off the end of the tape (34 px/f) and tumbles away; the trace
//        ends in a short dash; the ghost keeps falling through rising glow bands
// ===============================================================================================================
const Shot508: ShotFC<C05> = ({ f, len }) => {
  const tx = 640 + f * 34;
  const off = Math.max(0, tx - 1180);
  return (
    <Pop f={f}>
      <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(58)} vignette={0.24} grain={0.5}>
        <Layer depth={0.1}>
          <DarkSky name="furnace" />
          <BandField19 f={f} k="furnace" />
        </Layer>
        <Layer depth={0.5}>
          <GlowBands f={f} speed={20} opacity={0.26} />
          <Bloom x={1100} y={1200} r={800} color={C.glow} strength={0.4} />
        </Layer>
        <Layer depth={1}>
          <TapeTrace f={f + 200} x={-120} y={300} w={1300} h={100} mode="flat" speed={8} head={false} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={1210 + i * 44} y={292} width={26} height={16} rx={8} fill={C.heard} opacity={0.9 - i * 0.25} />
          ))}
          <g transform={`translate(${tx} ${300 - 110 + off * off * 0.004}) rotate(${off * 0.12})`}>
            <TapeTicket x={0} y={0} word="HEARD" f={f} size={1} />
          </g>
          <GhostProbe x={1150} y={600 + 160 * lin(f, 0, len)} r={110} f={f} />
          <Embers frame={f} x0={300} x1={1700} y={1100} n={30} color={C.goldHot} seed={58} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-09 · KEY ART 3 (hold 1.5 s): the blue dashed MODEL ticket draws itself over the dashed tape (40 px/f) and then swings; the
//        ghost probe sinks into a hot amber haze; embers rise 24 px/f; the dashed tape streams 28 px/f
// ===============================================================================================================
const Shot509: ShotFC<C05> = ({ f, len }) => {
  const draw = lin(f, 4, 4 + 840 / 40);
  const gy = 600 + 160 * lin(f, 0, len);
  return (
    <Pop f={f}>
      <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(59)} vignette={0.26} grain={0.5}>
        <Layer depth={0.1}>
          <DarkSky name="furnace" />
          <BandField19 f={f} k="furnace" />
        </Layer>
        <Layer depth={0.5}>
          <GlowBands f={f} speed={20} opacity={0.26} />
          <Bloom x={820} y={1240} r={1000} color={C.glow} strength={0.6} />
          <Bloom x={820} y={1140} r={700} color={C.goldHot} strength={0.32 + 0.06 * Math.sin(f * 0.2)} />
          <Bloom x={820} y={640} r={300} color={C.model} strength={0.3} />
        </Layer>
        <Layer depth={1}>
          <TapeTrace f={f + 200} x={-120} y={230} w={1700} h={110} mode="dashed" speed={28} />
          <TapeTicket x={1080} y={230} word="MODEL" f={f} draw={draw} swing={draw >= 1 ? 14 : 0} size={1.45} />
          <GhostProbe x={820} y={gy} r={150} f={f} />
          <Sparks f={f} x={820} y={1120} w={600} h={800} n={34} speed={24} angle={-90} seed={9} />
          <Embers frame={f} x0={100} x1={1700} y={1100} n={46} color={C.goldHot} seed={59} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL05: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL05(t);
  const shots: ShotDef<C05>[] = [
    { from: c.s501, S: Shot501, id: "5-01" },
    { from: c.s502, S: Shot502, id: "5-02" },
    { from: c.s503, S: Shot503, id: "5-03" },
    { from: c.s504, S: Shot504, id: "5-04" },
    { from: c.s505, S: Shot505, id: "5-05" },
    { from: c.s506, S: Shot506Run, id: "5-06" }, // + 5-07 (SLIDE)
    { from: c.s508, S: Shot508, id: "5-08" },
    { from: c.s509, S: Shot509, id: "5-09" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL05 = (t: SceneTiming): Cue[] => {
  const c = cuesL05(t);
  return [
    ...cutHit(0),
    { at: 4, file: SFX.riser, vol: 0.14, dur: 70, fadeOut: 20 },
    ...cutHit(c.s502),
    { at: c.s502 + 4, file: SFX.boom, vol: 0.2, dur: 90, fadeOut: 30 },
    ...cutHit(c.s503),
    { at: c.s503 + 6, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.s504),
    { at: c.s504, file: SFX.rumble, vol: 0.12, dur: 70, fadeOut: 60 },
    ...cutHit(c.s505),
    { at: c.s505 + 8, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.s506),
    { at: c.s506 + 4, file: SFX.rumble, vol: 0.1, dur: 110, fadeIn: 20, fadeOut: 40 },
    { at: c.s507 + 4, file: SFX.boom, vol: 0.2, dur: 100, fadeOut: 40 },
    ...cutHit(c.s508),
    { at: c.s508 + 6, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.s509),
    { at: c.s509 + 6, file: SFX.chime, vol: 0.2, dur: 120, fadeOut: 40 },
  ];
};
