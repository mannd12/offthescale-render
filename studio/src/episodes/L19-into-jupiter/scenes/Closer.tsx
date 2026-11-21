// L19 scene "closer" (storyboard §3 "Closer", script lines 54-57) + the 20-s end card (drawn by Full.tsx's EndTail). Package B.
// ShotDefs (hard cuts; PUSH rows are phases): Z-01 · Z-02 (+Z-03, PUSH) · Z-04 · Z-05 · Z-05b · Z-06 · Z-06b · Z-06c · Z-07 · Z-08 ·
// Z-09 · Z-10. The last 60 s before the end card must read ≥ 88 % alive: every shot has a drawing head, a drifting tape, a
// sweeping scan band, pinning tickets or a falling probe, plus a full-frame band field, and Z-10 keeps the limb bands scrolling.
// Numbers drawn (data19 READ): 58 MIN and the 58:00 timer (#2, #3 A) on Z-01 · 156 KM (#4 A) on Z-02. Z-09's WIND? WATER? CORE? carry
// no numerals (class B). The dial needle rests on 23 (#2, F6). Tick stays on the survey pad or behind the station porthole (F1).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Embers, Kicker, Layer, Motes, Stage, Tick } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ } from "../data19";
import { BarDial } from "../dial";
import { TapeTicket, TapeTrace } from "../tape";
import { DeckBands, DryPatch, FlatMap, WindStreaks, Wisps } from "../decks";
import { Canopy, Capsule, Orbiter } from "../probe19";
import { Fog, GoldLayer } from "../interior";
import { QuestionTag, WordPill } from "../tags19";
import { Sparks, StarsTint } from "../flows19";
import { Cactus, Tumbleweed } from "../icons19";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { BandField19, Bracket19, C, DRIFT, DarkSky, FamSky, GlowBands, Label, Limb, Pop, Readout, cl, ez, fr, lin, mod, runOf, uid } from "./b-parts";

/** Frames after the last line for the 20-s end card (EndCard from the kit). */
export const closerTail = 600;

export const cuesCloser = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    z01: 0,
    z02: frac(0, 0.3),
    z03: frac(0, 0.55),
    z04: frac(0, 0.78),
    z05: at(1),
    z05b: frac(1, 0.22),
    z06: frac(1, 0.5),
    z06b: frac(1, 0.66),
    z06c: frac(1, 0.78),
    z07: at(2),
    z08: at(3),
    z09: frac(3, 0.52),
    z10: frac(3, 0.92),
    end: t.frames,
  };
};
export type CZ = ReturnType<typeof cuesCloser>;

const LI = familyOf("limb");
const CR = familyOf("crest");
const FU = familyOf("furnace");
const CREST_COLS = ["#F28A1E", "#FFC247", "#E2571F", "#FFE066", "#B8431A", "#FF9A2E"];

const Space: React.FC<{ f: number; stars?: number }> = ({ f, stars = 90 }) => (
  <>
    <Layer depth={0.1}>
      <DarkSky name="limb" />
      <BandField19 f={f} k="limb" />
    </Layer>
    <Layer depth={0.3}>
      <StarsTint f={f} x={-300} y={-300} w={2520} h={1680} n={stars} speed={12} seed={7} />
    </Layer>
  </>
);
const Furnace: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Layer depth={0.1}>
      <DarkSky name="furnace" />
      <BandField19 f={f} k="furnace" />
    </Layer>
    <Layer depth={0.5}>
      <GlowBands f={f} speed={22} opacity={0.26} />
    </Layer>
  </>
);

// ===============================================================================================================
// Z-01 (6.1 s) · the honest answer: the long tape drifts past the dial (28 px/f), the limb below shears (16-22 px/f), the 58:00 timer
//        rolls; the camera pulls back
// ===============================================================================================================
const ShotZ01: ShotFC<CZ> = ({ f, len }) => (
  <Pop f={f}>
    <Stage theme={LI.theme} cam={{ x: 960, y: 540, zoom: 1.2 - 0.16 * ez(f, 0, len) }} vignette={0.24} grain={0.5}>
      <Space f={f} />
      <Layer depth={0.7}>
        <Limb f={f} cx={960} cy={2150} r={1450} />
      </Layer>
      <Layer depth={1}>
        <Bloom x={1380} y={400} r={360} color={C.glow} strength={0.35} />
        <BarDial f={f} cx={1380} cy={400} r={220} needle={23} lit={12} />
        <TapeTrace f={f + 60} x={-120} y={640} w={1500} h={100} mode="wave" speed={28} timer={lin(f, 0, len * 0.7)} />
      </Layer>
      <Layer depth={0}>
        <Readout x={70} y={64} value={READ.min58.value! /* #2, #3 A */} k={lin(f, 0, len * 0.7)} unit="MIN" size={92} w={420} appear={lin(f, 0, 12)} who="Z-01 58" />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// Z-02 · 156 KM down: the probe under its canopy falls through the crest decks (they scroll up 20 px/f); the 156 KM bracket opens
//        beside it (40 px/f). PUSH → Z-03.
// ===============================================================================================================
const ShotZ02: ShotFC<CZ> = ({ f }) => {
  const k = lin(f, 6, 6 + 620 / 40);
  return (
    <Stage theme={CR.theme} shotFrame={f} drift={DRIFT(202)} vignette={0.14} grain={0.5}>
      <Layer depth={0.1}>
        <FamSky name="crest" />
      </Layer>
      <Layer depth={0.4}>
        <DeckBands f={f} speed={20} shear={[16, -14, 18, -16]} x={-400} y={-300} w={2720} h={1680} colors={CREST_COLS} belt />
        <Wisps f={f} x={-200} y={-100} w={2320} h={1280} n={10} speed={28} />
      </Layer>
      <Layer depth={1}>
        <Canopy x={820} y={330} r={80} unfurl={1} f={f} sway={8} />
        <Capsule x={820} y={330} r={80} f={f} chips={6} />
        <Bracket19 x0={1060} y0={240} x1={1060} y1={240 + 620} k={k} color="#2B0905" feet={30} width={8} />
        {k >= 1 ? <Label x={1100} y={570} text="156 KM" size={48} color="#2B0905" /> : null}
      </Layer>
      <Layer depth={0}>
        <Readout x={70} y={64} value={READ.km156.value! /* #4 A */} k={k} unit="KM" size={92} w={480} plate={CR.shadow} appear={lin(f, 0, 10)} who="Z-02 156" />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// Z-03 · winds that did not fade: long streaks tear across the bands (40 px/f, alternating), the same length top to bottom; the
//        decks scroll up 20 px/f; a level line streams down (no numerals)
// ===============================================================================================================
const ShotZ03: ShotFC<CZ> = ({ f }) => (
  <Stage theme={CR.theme} shotFrame={f} drift={DRIFT(203)} vignette={0.14} grain={0.5}>
    <Layer depth={0.1}>
      <FamSky name="crest" />
    </Layer>
    <Layer depth={0.4}>
      <DeckBands f={f} speed={20} shear={[30, -34, 28, -30, 32, -28]} x={-400} y={-300} w={2720} h={1680} colors={CREST_COLS} belt />
    </Layer>
    <Layer depth={1}>
      <WindStreaks f={f} bands={[0, 1, 2, 3, 4, 5].map((i) => ({ y: 40 + i * 170, h: 120, dir: (i % 2 ? -1 : 1) as 1 | -1 }))} speed={40} x={-100} w={2120} />
      <line x1={1500} y1={-40} x2={1500} y2={1120} stroke="#2B0905" strokeWidth={10} strokeDasharray="40 24" strokeDashoffset={-f * 20} opacity={0.75} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={1180} y={70 + i * 170} width={320} height={22} rx={11} fill="#2B0905" opacity={0.7} />
      ))}
    </Layer>
  </Stage>
);
const RunZ02 = runOf<CZ>((c) => [
  { at: c.z02, S: ShotZ02 },
  { at: c.z03, S: ShotZ03, dir: "up", blend: 14 },
]);

// ===============================================================================================================
// Z-04 · air drier than expected: the dry patch with the joke props (F14); the tumbleweed rolls (22 px/f), heat shimmer rises,
//        cloud puffs slide (14 px/f); a "?" bobs; Tick, behind the station porthole, tips his head
// ===============================================================================================================
const ShotZ04: ShotFC<CZ> = ({ f }) => {
  const id = uid();
  const tw = 420 + mod(f * 22, 900);
  return (
    <Pop f={f}>
      <Stage theme={CR.theme} shotFrame={f} drift={DRIFT(204)} vignette={0.14} grain={0.5}>
        <Layer depth={0.1}>
          <FamSky name="crest" />
        </Layer>
        <Layer depth={0.4}>
          <DeckBands f={f} speed={0} shear={[14, -14, 16, -12, 14, -16]} x={-400} y={-300} w={2720} h={1680} colors={CREST_COLS} belt />
        </Layer>
        <Layer depth={1}>
          <DryPatch f={f} x={860} y={560} r={260} open={1} />
          <Cactus x={700} y={660} size={170} />
          <Tumbleweed x={tw} y={680} size={60} rotate={f * 14} />
          <QuestionTag x={880} y={200} f={f} size={110} />
          {/* the station porthole, lower right: Tick is at the station, not in the atmosphere (F1) */}
          <circle cx={1580} cy={820} r={230} fill="#004A2E" stroke={C.goldRim} strokeWidth={18} />
          <defs>
            <clipPath id={id}>
              <circle cx={1580} cy={820} r={212} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id})`}>
            <rect x={1360} y={600} width={440} height={440} fill="#00A35A" />
            {Array.from({ length: 4 }, (_, i) => (
              <rect key={i} x={1360 + mod(i * 160 + f * 4, 640) - 120} y={600} width={70} height={440} fill="#12BA6C" />
            ))}
            <Tick x={1580} y={1100} pxPerM={250} frame={f} facing={-1} pose="hips" expression="happy" look={-0.7} headTilt={-14 + 6 * Math.sin(f * 0.15)} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-05 · a single dry spot: the flat stripe map with the dry hole; a spotlight closes in on it (30 px/f); the map bands slide
// ===============================================================================================================
const MAP = { x: 160, y: 150, w: 1500, h: 800 };
const HOLE: [number, number] = [0.58, 0.46];
const ShotZ05: ShotFC<CZ> = ({ f }) => {
  const hx = MAP.x + HOLE[0] * MAP.w;
  const hy = MAP.y + HOLE[1] * MAP.h;
  const r = Math.max(150, 1100 - f * 30);
  return (
    <Pop f={f}>
      <Stage theme={LI.theme} shotFrame={f} drift={DRIFT(205)} vignette={0.24} grain={0.5}>
        <Space f={f} />
        <Layer depth={1}>
          <FlatMap f={f} x={MAP.x} y={MAP.y} w={MAP.w} h={MAP.h} speed={18} hole={1} holeAt={HOLE} />
          <path d={`M-600 -600 H2520 V1680 H-600 Z M${hx - r} ${hy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`} fill="#2A0804" fillRule="evenodd" opacity={0.6} />
          <circle cx={hx} cy={hy} r={r} fill="none" stroke={C.heard} strokeWidth={8} strokeDasharray="30 18" strokeDashoffset={-f * 4} />
          <path d={`M${hx - 40} ${hy - 40} L${hx + 40} ${hy + 40} M${hx + 40} ${hy - 40} L${hx - 40} ${hy + 40}`} stroke={C.heard} strokeWidth={12} strokeLinecap="round" />
        </Layer>
        <Layer depth={0}>
          <WordPill x={90} y={100} text="ONE SPOT" size={44} F={LI} appear={lin(f, 4, 16)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-05b · Juno has only started: its scan band sweeps over the limb (32 px/f), lighting stripe after stripe; Juno glides (20 px/f)
// ===============================================================================================================
const ShotZ05b: ShotFC<CZ> = ({ f, len }) => {
  const id = uid();
  const sx = -300 + mod(f * 32, 2500);
  return (
    <Pop f={f}>
      <Stage theme={LI.theme} cam={{ x: 960, y: 540, zoom: 1.14 - 0.12 * ez(f, 0, len) }} vignette={0.24} grain={0.5}>
        <Space f={f} />
        <Layer depth={1}>
          <Limb f={f} cx={960} cy={1900} r={1350} shear={[20, -16, 22, -18, 16, -20]} />
          <defs>
            <clipPath id={id}>
              <circle cx={960} cy={1900} r={1350} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id})`}>
            <rect x={sx - 160} y={400} width={320} height={1200} fill="#FFF0A0" opacity={0.3} />
            <rect x={sx - 5} y={400} width={10} height={1200} fill={C.goldHot} />
          </g>
          <Orbiter x={-150 + f * 20} y={250} kind="juno" f={f} size={0.7} dish="rings" aim={90} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-06 / Z-06b / Z-06c · the three model layers, each with its MODEL ticket pinning (drop 30 px/f): the liquid surging (22 px/f),
//        the gold's currents circling, the fuzzy core's fog churning with its ring drawing dashed (36 px/f)
// ===============================================================================================================
const PinTicket: React.FC<{ f: number; x: number; y: number }> = ({ f, x, y }) => {
  const s = ez(f, 4, 4 + 240 / 30);
  return (
    <g>
      <TapeTicket x={x} y={y - 240 * (1 - s)} word="MODEL" f={f} swing={s >= 1 ? 10 : 0} size={1} />
      {s >= 1 ? <circle cx={x} cy={y - 90} r={16} fill={C.lever} stroke={C.ink} strokeWidth={3} /> : null}
    </g>
  );
};
const ShotZ06: ShotFC<CZ> = ({ f, len }) => (
  <Pop f={f}>
    <Stage theme={FU.theme} cam={{ x: 960, y: 520 + 60 * ez(f, 0, len), zoom: 1.06 }} vignette={0.24} grain={0.5}>
      <Furnace f={f} />
      <Layer depth={1}>
        <rect x={-300} y={360} width={2520} height={900} fill={C.liquid} />
        {Array.from({ length: 9 }, (_, i) => (
          <ellipse key={i} cx={-300 + mod(i * 320 + f * 22, 2880)} cy={480 + (i % 3) * 160} rx={160} ry={24} fill="#FF9640" opacity={0.55} />
        ))}
        <path d={`M-300 360 ${Array.from({ length: 32 }, (_, k) => `L${-300 + k * 82} ${360 + Math.sin(k * 0.8 + f * 0.3) * 18}`).join(" ")}`} stroke={C.goldHot} strokeWidth={10} fill="none" />
        <PinTicket f={f} x={760} y={560} />
        <rect x={-300} y={1000} width={2520} height={400} fill="#004A2E" />
        <rect x={-300} y={1000} width={2520} height={8} fill="#40D486" />
        <Tick x={1500} y={1004} pxPerM={200} frame={f} facing={-1} pose="point" expression="neutral" look={-0.5} />
      </Layer>
    </Stage>
  </Pop>
);
const ShotZ06b: ShotFC<CZ> = ({ f, len }) => (
  <Pop f={f}>
    <Stage theme={FU.theme} cam={{ x: 960, y: 520 + 60 * ez(f, 0, len), zoom: 1.06 }} vignette={0.24} grain={0.5}>
      <Furnace f={f} />
      <Layer depth={1}>
        <GoldLayer f={f} x={-100} y={260} w={2120} h={760} currents sparks />
        <PinTicket f={f} x={960} y={520} />
      </Layer>
    </Stage>
  </Pop>
);
const ShotZ06c: ShotFC<CZ> = ({ f, len }) => {
  const rr = 300;
  const k = lin(f, 6, 6 + (2 * Math.PI * rr) / 36);
  const segs = 36;
  return (
    <Pop f={f}>
      <Stage theme={FU.theme} cam={{ x: 960, y: 540, zoom: 1.16 - 0.12 * ez(f, 0, len) }} vignette={0.24} grain={0.5}>
        <Furnace f={f} />
        <Layer depth={1}>
          <circle cx={900} cy={560} r={470} fill={C.gold} opacity={0.9} />
          <Fog f={f} cx={900} cy={560} r={rr / 0.95} n={90} spread={1} speed={16} />
          {Array.from({ length: segs }, (_, i) => {
            if (i / segs > k) return null;
            const a0 = -Math.PI / 2 + (i / segs) * Math.PI * 2;
            const a1 = a0 + ((Math.PI * 2) / segs) * 0.6;
            return <path key={i} d={`M${900 + Math.cos(a0) * rr} ${560 + Math.sin(a0) * rr} A${rr} ${rr} 0 0 1 ${900 + Math.cos(a1) * rr} ${560 + Math.sin(a1) * rr}`} stroke={C.model} strokeWidth={12} fill="none" strokeLinecap="round" />;
          })}
          <PinTicket f={f} x={1500} y={420} />
          <Embers frame={f} x0={200} x1={1700} y={1100} n={26} color={C.goldHot} seed={206} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={1500} y={640} text="BEST FIT, NOT A READING" size={32} F={FU} align="middle" appear={lin(f, 20, 32)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-07 (5.9 s) · go there again: a new probe falls down the dashed tape (the tape streams up past it 24 px/f, so the probe stays in
//        the upper third); behind it the dashes turn solid and the MODEL tickets flip to HEARD; the glow flows
// ===============================================================================================================
const ShotZ07: ShotFC<CZ> = ({ f }) => {
  const PY = 400; // the probe's height in frame
  const TX = 900;
  const sp = 24;
  const scroll = f * sp;
  const gap = 520;
  return (
    <Pop f={f}>
      <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(207)} vignette={0.24} grain={0.5}>
        <Furnace f={f} />
        <Layer depth={1}>
          {/* the tape: solid HEARD above the probe, dashed MODEL below; its sprocket marks scroll up with the world */}
          <rect x={TX - 55} y={-200} width={110} height={PY + 200} rx={14} fill={C.heard} stroke={C.lemonDeep} strokeWidth={4} />
          <rect x={TX - 55} y={PY} width={110} height={1200} rx={14} fill={C.modelDeep} stroke={C.model} strokeWidth={6} strokeDasharray="24 14" strokeDashoffset={scroll} />
          {Array.from({ length: 30 }, (_, i) => {
            const y = -200 + mod(i * 48 - scroll, 30 * 48);
            return <rect key={i} x={TX - 40} y={y} width={16} height={22} rx={4} fill={y < PY ? "#B07A10" : C.model} opacity={0.8} />;
          })}
          <Bloom x={TX} y={PY - 60} r={360} color={C.heard} strength={0.4} />
          {Array.from({ length: 5 }, (_, i) => {
            const y = PY + 180 + mod(i * gap - scroll, 5 * gap) - gap;
            const heard = y < PY + 20;
            return <TapeTicket key={i} x={TX + 260} y={y} word={heard ? "HEARD" : "MODEL"} f={f} size={0.8} swing={6} />;
          })}
          <Canopy x={TX - 200} y={PY} r={64} unfurl={1} f={f} sway={8} />
          <Capsule x={TX - 200} y={PY} r={64} f={f} chips={6} />
          <Sparks f={f} x={TX} y={1150} w={600} h={800} n={24} speed={24} angle={-90} seed={207} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-08 · WHERE WOULD YOU AIM IT?: the flat stripe map; an aiming reticle hops stripe to stripe (36 px/f); the bands slide (18 px/f);
//        Tick on the survey pad beside the map, reticle in hand
// ===============================================================================================================
const AIMS: [number, number][] = [
  [0.2, 0.18],
  [0.45, 0.4],
  [0.7, 0.62],
  [0.32, 0.84],
  [0.8, 0.28],
  [0.55, 0.7],
];
const ShotZ08: ShotFC<CZ> = ({ f }) => {
  const M = { x: 120, y: 200, w: 1180, h: 720 };
  const P = 22;
  const i = Math.floor(f / P);
  const u = ez(f % P, 0, 12);
  const [ax, ay] = AIMS[i % AIMS.length];
  const [bx, by] = AIMS[(i + 1) % AIMS.length];
  const rx = M.x + M.w * (ax + (bx - ax) * u);
  const ry = M.y + M.h * (ay + (by - ay) * u);
  const bob = Math.sin(f * 0.12) * 8;
  return (
    <Pop f={f}>
      <Stage theme={LI.theme} shotFrame={f} drift={DRIFT(208)} vignette={0.24} grain={0.5}>
        <Space f={f} />
        <Layer depth={1}>
          <FlatMap f={f} x={M.x} y={M.y} w={M.w} h={M.h} speed={18} spot={{ x: 0.3, y: 0.66, r: 0.06 }} />
          <g transform={`translate(${rx} ${ry})`}>
            <circle r={70} fill="none" stroke={C.heard} strokeWidth={8} />
            <circle r={12} fill={C.heard} />
            {[0, 90, 180, 270].map((a) => (
              <line key={a} x1={0} y1={-90} x2={0} y2={-46} stroke={C.heard} strokeWidth={8} strokeLinecap="round" transform={`rotate(${a})`} />
            ))}
          </g>
          <rect x={1400} y={900 + bob} width={360} height={26} rx={13} fill={C.goldRim} />
          <rect x={1420} y={926 + bob} width={320} height={14} rx={7} fill="#7A2A0A" />
          <Tick x={1580} y={900 + bob} pxPerM={210} frame={f} facing={-1} pose="hold" expression="thinking" look={-0.6} headTilt={6 * Math.sin(f * 0.1)} />
        </Layer>
        <Layer depth={0}>
          <Kicker x={90} y={110} text="— WHERE WOULD YOU AIM IT?" color={C.heard} size={28} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-09 · what would you ask it to measure?: three question chips pop beside the tape (8 f); the tape drifts (24 px/f); the dial needle
//        trembles on 23; Tick (≥ 40 %) plants the flag at the tape's end
// ===============================================================================================================
const ShotZ09: ShotFC<CZ> = ({ f }) => {
  const plant = ez(f, 4, 22);
  return (
    <Pop f={f}>
      <Stage theme={LI.theme} shotFrame={f} drift={DRIFT(209)} vignette={0.24} grain={0.5}>
        <Space f={f} />
        <Layer depth={0.7}>
          <Limb f={f} cx={960} cy={2300} r={1500} />
        </Layer>
        <Layer depth={1}>
          <TapeTrace f={f + 100} x={-140} y={330} w={1240} h={96} mode="dashed" speed={24} head={false} />
          <line x1={1130} y1={330 - 240 + 160 * (1 - plant)} x2={1130} y2={400} stroke={C.goldRim} strokeWidth={10} strokeLinecap="round" />
          <path d={`M1130 ${100 + 160 * (1 - plant)} l${120 + 8 * Math.sin(f * 0.4)} 40 l-120 40 Z`} fill={C.heard} />
          {["WIND?", "WATER?", "CORE?"].map((w, i) => {
            const age = f - (14 + i * 8);
            if (age < 0) return null;
            const s = age < 8 ? 1.6 - 0.6 * (age / 8) : 1 + 0.03 * Math.sin(f * 0.3 + i);
            return (
              <g key={w} transform={`translate(${200 + i * 300} ${560 + 10 * Math.sin(f * 0.15 + i)}) scale(${s})`}>
                <WordPill x={0} y={0} text={w} size={40} F={LI} align="middle" />
              </g>
            );
          })}
          <Bloom x={1050} y={780} r={260} color={C.glow} strength={0.3} />
          <BarDial f={f} cx={1050} cy={780} r={170} needle={23 * Math.exp(0.05 * Math.sin(f * 0.9))} lit={12} />
          <rect x={1340} y={1010} width={460} height={26} rx={13} fill={C.goldRim} />
          <Tick x={1560} y={1010} pxPerM={262} frame={f} facing={-1} pose="hold" expression="happy" look={-0.6} headTilt={5 * Math.sin(f * 0.12)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-10 · the closing hold: the camera pulls back from the dark limb (its bands scroll 14-22 px/f); the tape and the dial float away
//        (24 px/f); one tiny probe falls into the haze (16 px/f); the stars slide
// ===============================================================================================================
const ShotZ10: ShotFC<CZ> = ({ f, len }) => {
  const zoom = 1.3 - 0.3 * ez(f, 0, 180);
  const away = f * 8;
  return (
    <Pop f={f}>
      <Stage theme={LI.theme} cam={{ x: 960, y: 560, zoom }} vignette={0.26} grain={0.5}>
        <Space f={f} stars={110} />
        <Layer depth={0.8}>
          <Limb f={f} cx={960} cy={2000} r={1400} speed={16} shear={[22, -18, 20, -14, 18, -22]} />
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(${-away} ${-away * 0.3})`}>
            <TapeTrace f={f + 100} x={-100} y={300} w={1100} h={90} mode="dashed" speed={24} head={false} />
          </g>
          <g transform={`translate(${away * 0.8} ${-away * 0.4})`}>
            <BarDial f={f} cx={1400} cy={360} r={150} needle={23} lit={12} />
          </g>
          <Canopy x={900} y={520 + f * 1.4} r={26} unfurl={1} f={f} />
          <Capsule x={900} y={520 + f * 1.4} r={26} f={f} chips={6} />
          <Bloom x={900} y={520 + f * 1.4} r={120} color={C.probe} strength={0.4} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneCloser: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCloser(t);
  const shots: ShotDef<CZ>[] = [
    { from: c.z01, S: ShotZ01, id: "Z-01" },
    {
      from: c.z02,
      S: (p) => (
        <Pop f={p.f}>
          <RunZ02 {...p} />
        </Pop>
      ),
      id: "Z-02",
    }, // + Z-03 (PUSH)
    { from: c.z04, S: ShotZ04, id: "Z-04" },
    { from: c.z05, S: ShotZ05, id: "Z-05" },
    { from: c.z05b, S: ShotZ05b, id: "Z-05b" },
    { from: c.z06, S: ShotZ06, id: "Z-06" },
    { from: c.z06b, S: ShotZ06b, id: "Z-06b" },
    { from: c.z06c, S: ShotZ06c, id: "Z-06c" },
    { from: c.z07, S: ShotZ07, id: "Z-07" },
    { from: c.z08, S: ShotZ08, id: "Z-08" },
    { from: c.z09, S: ShotZ09, id: "Z-09" },
    { from: c.z10, S: ShotZ10, id: "Z-10" },
  ];
  // the closer's Sequence runs closerTail frames longer (the end card is drawn over it by Full.tsx): Z-10 keeps playing under it
  return playShots(f, shots, c, c.end + closerTail);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCloser = (t: SceneTiming): Cue[] => {
  const c = cuesCloser(t);
  const run = (at: number, n: number, gap = 6, vol = 0.05): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    ...cutHit(0),
    { at: 4, file: SFX.chime, vol: 0.14, dur: 90, fadeOut: 30 },
    ...cutHit(c.z02),
    { at: c.z02 + 2, file: SFX.whoosh, vol: 0.14, dur: 50 },
    { at: c.z03 + 2, file: SFX.swirl, vol: 0.14, dur: 60 },
    ...cutHit(c.z04),
    { at: c.z04 + 6, file: SFX.pop, vol: 0.14, dur: 20 },
    ...cutHit(c.z05),
    { at: c.z05 + 6, file: SFX.click, vol: 0.1, dur: 8 },
    ...cutHit(c.z05b),
    { at: c.z05b + 4, file: SFX.chime, vol: 0.12, dur: 90, fadeOut: 30 },
    ...cutHit(c.z06),
    { at: c.z06 + 12, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.z06b),
    { at: c.z06b + 12, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.z06c),
    { at: c.z06c + 12, file: SFX.chime, vol: 0.12, dur: 90, fadeOut: 30 },
    ...cutHit(c.z07),
    { at: c.z07 + 4, file: SFX.riser, vol: 0.12, dur: 70, fadeOut: 20 },
    ...cutHit(c.z08),
    ...run(c.z08 + 4, 6, 22, 0.06),
    ...cutHit(c.z09),
    { at: c.z09 + 14, file: SFX.chime, vol: 0.16, dur: 120, fadeOut: 40 },
    ...cutHit(c.z10),
    { at: c.z10 + 6, file: SFX.chime, vol: 0.12, dur: 150, fadeOut: 60 },
  ];
};
