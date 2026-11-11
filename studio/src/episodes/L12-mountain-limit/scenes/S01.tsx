// L12 scene l01 "The stack" (storyboard §3 "1 · The stack": shots 1-01…1-12, script lines 6-11, family studio, Act I).
// The gag set piece. Shot components (PUSH = one shot): 1-01 (carry in, set down) · 1-02 (four blocks, wipes brow,
// chevrons) · 1-03 (the bottom block, hatch, calendar) · 1-04+1-05 (dial → the press, the cube crumbles) · 1-06 (air
// pressure ×1,000-2,500, the squashed tiny Tick) · 1-07 (the tower rockets up, two jumps) · 1-08 (the dial settles at
// 235) · 1-09+1-10 (anticipation, hold, collapse; the 4-9 km band) · 1-11+1-12 (Everest beside the ghost column, "?",
// push in on Tick: "cheating") · tail: BlackBeat + sting → ChapterCard 2 "Mountains Float".
// Numbers drawn, each with its sources.md row: dial 0-300 MPa with the band GRANITE CRUSHES · 100-250 MPa (#7) ·
// ×1,000-2,500 air pressure (#9) · gauge 8,849 m (#1) · needle / metric 235 MPa (#9) · band 4-9 km SOLID COLUMN
// (3.8-9.4 km, #9). Everything here is the UNCONFINED column rule (storyboard §4 "General"): labels say "granite
// crushes" and "solid column", never "mountain limit". Light: studio key 225 (upper left), cast shadows to the right.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  BlackBeat,
  ChapterCard,
  Counter,
  Dial,
  Facets,
  Form,
  GroundShadow,
  HazeBand,
  KEY_LIGHT,
  Layer,
  Metric,
  Motes,
  Pill,
  Pt,
  Puffs,
  Sky,
  Stage,
  Tick,
  UnknownTag,
  alpha,
  cameraAt,
  cutPop,
  flash,
  impact,
  mixHex,
  ramp,
  ridgePath,
  rnd,
  rrect,
  smooth,
  walkPhase,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { L12_COLORS, familyOf, pillFill } from "../families";
import { cueKit } from "../cues";
import { HEIGHTS, L12Gauge } from "../L12Gauge";
import { SlateBlock } from "../props";
import { snowCap } from "../Summit";
import { ShotDef, ShotFC, actBreakAt, playShots } from "../shots";
import { Cue, SFX, cutHit, sting } from "./cue-types";
import { CycClouds, STUDIO_SET } from "./S08";

const F = STUDIO_SET; // the coloured studio set (polish pass (a), 2026-11-11): teal cyc, ochre floor, cool shadows
const DUSK = familyOf("dusk");
const EMBER = familyOf("ember");
const AMBER = L12_COLORS.amber;

const FLOOR = 900;
const BW = 130; // block width (px)
const BH = 74; // block height
const BX = 850; // the stack's left edge
const BLOCK_M = 0.7; // a block ≈ 0.7 m beside a 1.7-m Tick at 110 px/m (the gauge reads the stack in metres)
const TICK_PPM = 110;
const TOWER_PX = 700; // screen height of the full column (8,849 m) in the wide shots
const DIAL = { x: 560, y: 610, r: 150 };

export const cuesL01 = (t: SceneTiming) => {
  const { at, p, end, frac } = cueKit(t);
  return {
    start: 0,
    four: frac(0, 0.3), // 1-02 (jump cut): four blocks
    presses: p(0, "presses down"),
    bottom: p(0, "The one at the bottom", -4), // 1-03: the bottom block
    dayOff: p(0, "never gets"),
    dial: at(1), // 1-04: the pressure dial
    squeeze: p(1, "Squeeze"), // → 1-05 the press (continuous push)
    crush: p(1, "and it crushes"),
    air: at(2), // 1-06
    glance: p(2, "the pressure"),
    tower: at(3), // 1-07: the tower rockets up
    dial2: p(3, "The pressure on its base"), // 1-08
    n235: p(3, "two hundred and thirty-five"),
    limit: p(3, "That is right"),
    wobble: at(4), // 1-09: anticipation
    crack: p(4, "the bottom gives way"), // the collapse lands on the words
    band: p(4, "somewhere between"), // 1-10: the 4-9 km band (#9)
    awkward: at(5), // 1-11
    everest: p(5, "Everest is standing"),
    taller: p(5, "taller than that"),
    cheat: p(5, "So it must"), // 1-12: push in on Tick
    last: end(5),
    brk: actBreakAt(t).start,
    end: t.frames,
  };
};
export type CL01 = ReturnType<typeof cuesL01>;

// ---------------------------------------------------------------------------------------------
// shared pieces

const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/** The bone studio: paper sky, a floor with a horizon haze, slow motes. Children are drawn on the subject plane. */
const Studio: React.FC<{ f: number; children: React.ReactNode; hud?: React.ReactNode; seed?: number }> = ({ f, children, hud, seed = 3 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={F} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f} y={110} seed={seed} />
    </Layer>
    <Layer depth={0.5}>
      <rect x={-1200} y={FLOOR - 70} width={4400} height={900} fill={mixHex(F.mid, "#FFE4A8", 0.25)} />
      <HazeBand y={FLOOR - 190} h={190} color={F.haze} strength={0.9} x={-1200} w={4400} />
      <rect x={-1200} y={FLOOR - 70} width={4400} height={3} fill={F.near} opacity={0.5} />
    </Layer>
    <Layer depth={1}>
      <rect x={-1200} y={FLOOR} width={4400} height={900} fill={mixHex(F.mid, F.near, 0.5)} />
      <HazeBand y={FLOOR} h={300} color={F.near} strength={0.25} x={-1200} w={4400} />
      {children}
    </Layer>
    <Layer depth={1.25}>
      <Motes frame={f} n={26} x={-100} y={60} w={2100} h={860} color={mixHex(F.haze, F.light, 0.5)} seed={seed} size={5.5} drift={44} />
    </Layer>
    {hud ? <Layer depth={0}>{hud}</Layer> : null}
  </>
);

/** Long cast shadow of the stack on the floor (key 225: falls to the lower right). */
const CastShadow: React.FC<{ n: number; x?: number; w?: number; sway?: number }> = ({ n, x = BX, w = BW, sway = 0 }) => {
  const L = Math.min(900, 60 + n * BH * 0.9);
  return <path d={`M${x} ${FLOOR} L${x + w} ${FLOOR} L${x + w + L + sway} ${FLOOR + L * 0.16} L${x + L * 0.82 + sway} ${FLOOR + L * 0.16 + 26} Z`} fill={F.shadow} opacity={0.2} />;
};

/** n blocks stacked at the stack site; `crack` on the bottom one; small alternating offsets so it reads hand-built. */
const Stack: React.FC<{ n: number; crack?: number; split?: number; topSquash?: { sx: number; sy: number }; lean?: number }> = ({ n, crack = 0, split = 0, topSquash, lean = 0 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const off = i === 0 ? 0 : (rnd(i * 7 + 2) - 0.5) * 14;
      return (
        <g key={i} transform={lean ? `rotate(${(lean * i) / Math.max(1, n)} ${BX + BW / 2} ${FLOOR})` : undefined}>
          <SlateBlock x={BX + off} y={FLOOR - i * BH} w={BW} h={BH} d={46} family={F} light={KEY_LIGHT} crack={i === 0 ? crack : 0} split={i === 0 ? split : 0} squash={i === n - 1 ? topSquash : undefined} shadow={i === 0} color={i % 3 === 1 ? mixHex(L12_COLORS.slate, L12_COLORS.slateDark, 0.25) : L12_COLORS.slate} />
        </g>
      );
    })}
  </g>
);

/** The tall column for the wide shots: thin courses up to `h` px, bottom block with its crack. */
const Column: React.FC<{ h: number; crack?: number; split?: number; opacity?: number; ghost?: boolean }> = ({ h, crack = 0, split = 0, opacity = 1, ghost = false }) => {
  const course = 35;
  const n = Math.max(1, Math.ceil(h / course));
  if (ghost)
    return (
      <g opacity={opacity}>
        <rect x={BX} y={FLOOR - h} width={BW} height={h} fill={alpha(L12_COLORS.slate, 0.16)} stroke={L12_COLORS.slate} strokeWidth={2.5} strokeDasharray="10 8" />
        <path d={`M${BX + BW * 0.45} ${FLOOR} L${BX + BW * 0.55} ${FLOOR - 30} L${BX + BW * 0.4} ${FLOOR - 52} L${BX + BW * 0.56} ${FLOOR - 74}`} fill="none" stroke={L12_COLORS.slateDark} strokeWidth={4} strokeLinejoin="round" />
      </g>
    );
  return (
    <g opacity={opacity}>
      {/* the shaft: front + side faces in two tones, course lines */}
      <path d={`M${BX + BW} ${FLOOR} L${BX + BW + 46} ${FLOOR - 28} L${BX + BW + 46} ${FLOOR - h - 28} L${BX + BW} ${FLOOR - h} Z`} fill={mixHex(L12_COLORS.slate, F.shadow, 0.4)} />
      <Form d={`M${BX} ${FLOOR} H${BX + BW} V${FLOOR - h} H${BX} Z`} fill={mixHex(L12_COLORS.slate, F.light, 0.08)} light={KEY_LIGHT} shadow={F.shadow} inset={8} shadowOpacity={0.2} rim={F.light} rimWidth={1.5} rimOpacity={0.45}>
        <g stroke={mixHex(L12_COLORS.slate, F.shadow, 0.45)} strokeWidth={1.6} opacity={0.6}>
          {Array.from({ length: n }, (_, i) => (
            <line key={i} x1={BX} y1={FLOOR - i * course} x2={BX + BW} y2={FLOOR - i * course + (i % 2 ? 2 : -2)} />
          ))}
        </g>
      </Form>
      <path d={`M${BX} ${FLOOR - h} L${BX + BW} ${FLOOR - h} L${BX + BW + 46} ${FLOOR - h - 28} L${BX + 46} ${FLOOR - h - 28} Z`} fill={mixHex(L12_COLORS.slate, F.light, 0.38)} />
      <SlateBlock x={BX} y={FLOOR} w={BW} h={BH} d={46} family={F} light={KEY_LIGHT} crack={crack} split={split} shadow={false} />
    </g>
  );
};

const Gauge: React.FC<{ v: number; readout?: string | false; band?: boolean; rolling?: boolean }> = ({ v, readout, band = false, rolling = false }) => (
  <L12Gauge family={F} value={v} readout={readout} rolling={rolling} bands={band ? [{ ...HEIGHTS.crushBand /* #9 */, color: AMBER, label: "4-9 km · SOLID COLUMN" }] : []} />
);

const fmtMPa = (v: number) => `${Math.round(v)}`;

/** The dial's band label, drawn here (not as a kit Pill) so the unit keeps its case: "MPa", never "MPA". Rows: #7. */
const GraniteTag: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 232} y={y - 22} width={464} height={44} rx={22} fill={pillFill(F)} />
    <circle cx={x - 206} cy={y} r={7} fill={AMBER} />
    <text x={x - 186} y={y + 9} style={{ fontFamily: "'Anton', sans-serif", fontSize: 26, letterSpacing: 2.4, fill: F.text }}>
      GRANITE CRUSHES · 100-250 MPa
    </text>
  </g>
);

// ---------------------------------------------------------------------------------------------
// 1-01 · Tick walks in carrying a slate block, sets it down (landing squash, dust), turns to fetch the next.
const ShotCarry: ShotFC<CL01> = ({ f, len }) => {
  const stride = 16;
  const arrive = Math.min(48, Math.round(len * 0.5));
  const x0 = 470;
  const x1 = BX - 96;
  const walking = f < arrive;
  const tx = walking ? x0 + ((x1 - x0) * f) / arrive : x1;
  const setT = Math.min(1.6, Math.max(0, (f - arrive) / 20)); // carry → crouch-reach
  const land = arrive + 16;
  const landed = f >= land;
  // the block: in the hands while walking, then an arc down onto the stack site
  const k = smooth(ramp(f, arrive, land));
  const hx = tx + TICK_PPM * 0.2;
  const hy = FLOOR - TICK_PPM * 0.72;
  const bx = hx + (BX - hx) * k;
  const by = hy + (FLOOR - hy) * k * k;
  const bob = walking ? Math.abs(Math.sin((f / stride) * Math.PI)) * -5 : 0;
  const backT = Math.min(1, Math.max(0, (f - land - 8) / 14));
  const leaving = f > land + 22;
  const lx = leaving ? tx - (f - land - 22) * 4.2 : tx;
  return (
    <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.07, panX: 0.03, panY: 0.01, frames: len + 60, seed: 1 }} vignette={0.1} grain={0.5}>
      <Studio f={f} hud={<Gauge v={landed ? BLOCK_M : 0} />}>
        {landed ? <CastShadow n={1} /> : null}
        <GroundShadow x={lx + 8} y={FLOOR + 3} rx={TICK_PPM * 0.42} color={F.shadow} opacity={0.3} blur={8} />
        <SlateBlock x={landed ? BX : bx} y={(landed ? FLOOR : by) + (landed ? 0 : bob)} w={BW} h={BH} d={46} family={F} light={KEY_LIGHT} squash={impact(f, land, 0.16, 10)} shadow={landed} />
        {leaving ? (
          <Tick x={lx} y={FLOOR} pxPerM={TICK_PPM} frame={f} facing={-1} walk={walkPhase(f, stride)} pose="stand" expression="determined" />
        ) : walking ? (
          <Tick x={tx} y={FLOOR} pxPerM={TICK_PPM} frame={f} walk={walkPhase(f, stride)} pose="carry" expression="determined" slump={0.15} />
        ) : landed ? (
          <Tick x={tx} y={FLOOR} pxPerM={TICK_PPM} frame={f} pose="crouch-reach" poseTo="stand" poseT={backT * 1.4} expression="determined" expressionTo="happy" expressionT={backT} look={0.6} />
        ) : (
          <Tick x={tx} y={FLOOR} pxPerM={TICK_PPM} frame={f} pose="carry" poseTo="crouch-reach" poseT={setT} expression="determined" />
        )}
        {landed && f < land + 40 ? (
          <>
            <Puffs frame={f - land + 60} x={BX - 6} y={FLOOR - 6} color={alpha(F.near, 0.55)} period={60} size={16} rise={0.5} drift={-0.9} life={36} seed={3} />
            <Puffs frame={f - land + 60} x={BX + BW + 10} y={FLOOR - 6} color={alpha(F.near, 0.55)} period={60} size={16} rise={0.5} drift={0.9} life={36} seed={5} />
          </>
        ) : null}
      </Studio>
    </Stage>
  );
};

// 1-02 · time-lapse jump: four blocks; Tick wipes its brow; chevrons light down the stack on "presses down on every block below".
const ShotFour: ShotFC<CL01> = ({ f, len, c }) => {
  const pr = c.presses - c.four;
  const tired = ramp(f, 10, len);
  const tx = BX - 110;
  return (
    <Pop f={f}>
      <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.02, panY: 0.02, frames: len + 60, seed: 2 }} vignette={0.1} grain={0.5}>
        <Studio f={f} seed={5} hud={<Gauge v={4 * BLOCK_M} />}>
          <CastShadow n={4} />
          <Stack n={4} topSquash={impact(f, 0, 0.12, 10)} />
          <GroundShadow x={tx + 8} y={FLOOR + 3} rx={TICK_PPM * 0.42} color={F.shadow} opacity={0.3} blur={8} />
          <Tick x={tx} y={FLOOR} pxPerM={TICK_PPM} frame={f} pose="stand" poseTo="wipe-brow" poseT={Math.min(1.7, Math.max(0, (f - 4) / 22))} expression="happy" expressionTo="sleepy" expressionT={tired} slump={0.2 + 0.4 * tired} look={0.5} />
          <Puffs frame={f} x={tx + 34} y={FLOOR - TICK_PPM * 1.5} color={alpha(F.near, 0.35)} period={38} size={8} rise={0.5} drift={0.3} life={30} seed={9} />
          {/* weight chevrons stepping down the stack */}
          {[0, 1, 2, 3].map((i) => {
            const on = ramp(f, pr + i * 8, pr + i * 8 + 6);
            const fade = 1 - ramp(f, pr + i * 8 + 26, pr + i * 8 + 44) * 0.55;
            const y = FLOOR - (3 - i) * BH - BH * 0.5;
            return <path key={i} d={`M${BX + BW + 74} ${y - 16} l 18 18 l 18 -18`} fill="none" stroke={F.text} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={on * fade} transform={`translate(0 ${((1 - on) * -14).toFixed(1)})`} />;
          })}
        </Studio>
      </Stage>
    </Pop>
  );
};

// 1-03 · the bottom block, close: hairline stress hatching grows; on "never gets a day off" a tear-off calendar flips.
const ShotBottom: ShotFC<CL01> = ({ f, len, c }) => {
  const cam = cameraAt(f, [
    { f: 0, x: BX + 110, y: FLOOR - 120, zoom: 2.3 },
    { f: len + 20, x: BX + 96, y: FLOOR - 70, zoom: 3.2 },
  ]);
  const crack = ramp(f, 6, len) * 0.55;
  const d0 = c.dayOff - c.bottom;
  const flips = Math.max(0, Math.floor((f - d0) / 11));
  const ph = f >= d0 ? ((f - d0) % 11) / 11 : 0;
  const cx = BX + BW + 96;
  const cy = FLOOR - 96;
  const calIn = ramp(f, d0 - 10, d0);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.12} grain={0.5}>
        <Studio f={f} seed={7}>
          <CastShadow n={4} />
          <Stack n={4} crack={crack} />
          {/* the calendar: a small tear-off pad whose top page keeps flipping away (no day is ever skipped) */}
          <g opacity={calIn} transform={`translate(0 ${((1 - calIn) * 10).toFixed(1)})`}>
            <GroundShadow x={cx + 26} y={FLOOR + 2} rx={30} color={F.shadow} opacity={0.25} blur={4} />
            <rect x={cx + 23} y={cy + 56} width={5} height={FLOOR - cy - 56} fill={F.near} />
            <rect x={cx} y={cy} width={52} height={58} rx={5} fill={F.light} stroke={F.near} strokeWidth={1.5} />
            <rect x={cx} y={cy} width={52} height={14} rx={5} fill={L12_COLORS.slate} />
            <text x={cx + 26} y={cy + 46} textAnchor="middle" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 26, fill: F.text, fontVariantNumeric: "tabular-nums" }}>
              {(flips % 30) + 1}
            </text>
            {f >= d0 ? <rect x={cx} y={cy + 14} width={52} height={44 * (1 - ph)} fill={F.light} stroke={F.near} strokeWidth={1} opacity={1 - ph} transform={`translate(${(ph * 26).toFixed(1)} ${(-ph * 30).toFixed(1)}) rotate(${(ph * 24).toFixed(1)} ${cx + 52} ${cy + 14})`} /> : null}
          </g>
        </Studio>
      </Stage>
    </Pop>
  );
};

// ---------------------------------------------------------------------------------------------
// 1-04 + 1-05 · a pressure dial beside the bottom block, needle climbing, the amber band GRANITE CRUSHES · 100-250 MPa
// (#7); the camera pushes to a press: two slate plates squeeze a granite cube and at the band it crumbles.
const PX = 1330; // the press's centre
const ShotDialPress: ShotFC<CL01> = ({ f, len, c }) => {
  const sq = c.squeeze - c.dial;
  const cr = c.crush - c.dial;
  const cam = cameraAt(f, [
    { f: 0, x: 720, y: 640, zoom: 1.5 },
    { f: sq - 6, x: 760, y: 640, zoom: 1.56 },
    { f: sq + 44, x: 1150, y: 640, zoom: 1.62 },
    { f: len + 30, x: 1200, y: 650, zoom: 1.74 },
  ]);
  const press = ramp(f, sq, cr); // plates close
  const v = 20 + 60 * ramp(f, 4, sq) + 170 * Math.pow(press, 1.4); // needle: climbs into the band as the press closes
  const broke = f >= cr;
  const age = f - cr;
  const gap = 150 - press * 34 - (broke ? Math.min(60, age * 6) : 0);
  const shake = broke && age < 14 ? Math.sin(age * 2.3) * (1 - age / 14) * 6 : press > 0.6 ? Math.sin(f * 1.7) * (press - 0.6) * 3 : 0;
  const gy = FLOOR - 70; // top of the lower plate
  const cube = 118;
  const shards = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 + rnd(i) * 0.6;
    const sp = 3 + rnd(i * 3 + 1) * 5;
    const x = PX + Math.cos(a) * sp * age * 1.3;
    const y = Math.min(FLOOR - 8, gy - 40 + Math.sin(a) * sp * age * 0.5 + 0.35 * age * age);
    return { x, y, s: 16 + rnd(i * 5) * 26, rot: age * (8 + i * 5) * (i % 2 ? 1 : -1) };
  });
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.12} grain={0.5}>
        <Studio f={f} seed={9}>
          <CastShadow n={4} />
          <Stack n={4} crack={0.55} />
          {/* the dial on a short post beside the bottom block */}
          <rect x={DIAL.x - 8} y={DIAL.y + DIAL.r} width={16} height={FLOOR - DIAL.y - DIAL.r} fill={F.near} />
          <GroundShadow x={DIAL.x + 20} y={FLOOR + 3} rx={90} color={F.shadow} opacity={0.25} blur={8} />
          <Dial x={DIAL.x} y={DIAL.y} r={DIAL.r} value={v} min={0} max={300} ticks={6} family={F} unit="MPa" format={fmtMPa} frame={f} title="PRESSURE" band={{ from: 100 /* #7 */, to: 250 /* #7 */, color: AMBER }} />
          <GraniteTag x={DIAL.x} y={DIAL.y - DIAL.r - 52} />
          {/* the press */}
          <g transform={`translate(${shake.toFixed(1)} 0)`}>
            <GroundShadow x={PX + 30} y={FLOOR + 4} rx={190} color={F.shadow} opacity={0.28} blur={8} />
            <rect x={PX - 150} y={gy - 330} width={22} height={330 + 70} fill={F.near} />
            <rect x={PX + 128} y={gy - 330} width={22} height={330 + 70} fill={mixHex(F.near, F.shadow, 0.3)} />
            <rect x={PX - 170} y={gy - 352} width={340} height={30} rx={6} fill={mixHex(F.near, F.shadow, 0.2)} />
            <SlateBlock x={PX - 120} y={FLOOR} w={240} h={70} d={40} family={F} light={KEY_LIGHT} shadow={false} />
            {/* the ram + upper plate */}
            <rect x={PX - 16} y={gy - 330} width={32} height={330 - gap - 46} fill={mixHex(L12_COLORS.slate, F.light, 0.2)} />
            <SlateBlock x={PX - 110} y={gy - gap} w={220} h={46} d={36} family={F} light={KEY_LIGHT} shadow={false} color={L12_COLORS.slateDark} />
            {/* the granite cube (squeezed), then its shards */}
            {!broke ? (
              <SlateBlock x={PX - cube / 2 - press * 5} y={gy} w={cube + press * 10} h={Math.min(cube, gap)} d={30} family={F} light={KEY_LIGHT} color={L12_COLORS.granite} crack={press} shadow={false} />
            ) : (
              shards.map((s, i) => (
                <path key={i} d={`M${s.x - s.s / 2} ${s.y} l ${s.s * 0.5} ${-s.s * 0.6} l ${s.s * 0.5} ${s.s * 0.5} l ${-s.s * 0.3} ${s.s * 0.4} Z`} fill={i % 2 ? L12_COLORS.granite : mixHex(L12_COLORS.granite, F.shadow, 0.3)} transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
              ))
            )}
            {broke && age < 44 ? (
              <>
                <Puffs frame={age + 50} x={PX - 70} y={gy - 20} color={alpha(L12_COLORS.granite, 0.7)} period={50} size={26} rise={0.7} drift={-1.4} life={42} seed={3} />
                <Puffs frame={age + 50} x={PX + 70} y={gy - 20} color={alpha(L12_COLORS.granite, 0.7)} period={50} size={26} rise={0.7} drift={1.4} life={42} seed={8} />
              </>
            ) : null}
          </g>
        </Studio>
        {broke ? (
          <Layer depth={0}>
            <rect x={0} y={0} width={1920} height={1080} fill={F.light} opacity={flash(age, 0, 8, 0.35)} />
          </Layer>
        ) : null}
      </Stage>
    </Pop>
  );
};

// ---------------------------------------------------------------------------------------------
// 1-06 · Tick large. A see-through column of air stands on it; a multiplier rolls ×1,000 → ×2,500 (#9) while ghost
// slabs pile onto a tiny second Tick that squashes flatter and flatter; the big Tick glances at it, worried.
const ShotAir: ShotFC<CL01> = ({ f, len, c }) => {
  const ppm = 300;
  const tx = 520;
  const ty = 990;
  const gl = c.glance - c.air;
  const glance = ramp(f, gl, gl + 12);
  const mult = 1000 + 1500 * ramp(f, 8, len - 26); // ×1,000 → ×2,500 (#9)
  const done = f >= len - 26;
  const sx = 1180; // the tiny Tick
  const sy = 900;
  const slabs = Math.min(8, Math.max(0, Math.floor((f - 6) / 12) + 1));
  const squashY = 1 - 0.07 * slabs;
  const air = mixHex(F.second, F.light, 0.5);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.07, panX: 0.03, panY: 0.01, frames: len + 60, seed: 4 }} vignette={0.1} grain={0.5}>
        <Layer depth={0.05}>
          <Sky family={F} />
        </Layer>
        <Layer depth={0.2}>
          <CycClouds f={f} y={110} seed={4} />
        </Layer>
        <Layer depth={0.5}>
          <rect x={-1200} y={900} width={4400} height={900} fill={mixHex(F.mid, "#FFE4A8", 0.25)} />
          <HazeBand y={720} h={180} color={F.haze} strength={0.9} x={-1200} w={4400} />
        </Layer>
        <Layer depth={1}>
          <rect x={-1200} y={ty - 20} width={4400} height={900} fill={mixHex(F.mid, F.near, 0.5)} />
          {/* the column of air on the big Tick: see-through, to the top of the frame, slow rising streaks */}
          <rect x={tx - 150} y={-400} width={300} height={ty - ppm * 1.82 + 400} fill={alpha(air, 0.22)} stroke={alpha(F.second, 0.7)} strokeWidth={2.5} strokeDasharray="12 9" />
          {Array.from({ length: 7 }, (_, i) => {
            const yy = ((i * 97 + f * 2.2) % 520) - 60;
            return <path key={i} d={`M${tx - 120 + i * 40} ${yy} l 12 12 l 12 -12`} fill="none" stroke={F.second} strokeWidth={4} strokeLinecap="round" opacity={0.45} />;
          })}
          <GroundShadow x={tx + 16} y={ty + 4} rx={ppm * 0.42} color={F.shadow} opacity={0.3} blur={16} />
          <Tick x={tx} y={ty} pxPerM={ppm} frame={f} pose="stand" poseTo="shrug" poseT={glance * 0.6} expression="neutral" expressionTo="worried" expressionT={glance} look={0.2 + glance * 0.8} headTilt={glance * 6} />
          {/* the tiny Tick on a plinth, under the pile */}
          <rect x={sx - 120} y={sy} width={240} height={200} fill={mixHex(F.mid, F.near, 0.3)} />
          <rect x={sx - 120} y={sy} width={240} height={10} fill={mixHex(F.mid, F.light, 0.4)} />
          <Tick x={sx} y={sy} pxPerM={96} frame={f} seed={5} pose="shield" expression="scared" squash={{ sx: 1 + (1 - squashY) * 0.7, sy: squashY }} look={-0.3} facing={-1} />
          {Array.from({ length: slabs }, (_, i) => {
            const born = 6 + i * 12;
            const d = smooth(ramp(f, born, born + 9));
            const restY = sy - 96 * 1.82 * squashY - i * 30;
            const y = restY - (1 - d) * 260;
            const imp = impact(f, born + 9, 0.12, 8);
            return (
              <g key={i} opacity={Math.min(1, d * 2)} transform={`translate(${sx} ${y}) scale(${imp.sx} ${imp.sy}) translate(${-sx} ${-y})`}>
                <rect x={sx - 84 + (i % 2 ? 6 : -6)} y={y - 26} width={168} height={26} rx={4} fill={alpha(L12_COLORS.slate, 0.42)} stroke={L12_COLORS.slate} strokeWidth={2} />
              </g>
            );
          })}
        </Layer>
        <Layer depth={1.25}>
          <Motes frame={f} n={22} x={-100} y={60} w={2100} h={860} color={mixHex(F.near, F.light, 0.3)} seed={11} size={3.4} drift={40} />
        </Layer>
        <Layer depth={0}>
          {done ? (
            <Metric x={880} y={300} value="×1,000-2,500" size={92} color={F.text} />
          ) : (
            <g>
              <text x={880} y={300} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 92, fill: F.text }}>×</text>
              <Counter x={950} y={300} value={mult} max={9999} digits={4} size={92} color={F.text} />
            </g>
          )}
          <Pill x={884} y={356} text="AIR PRESSURE ON YOU" fill={pillFill(F)} color={F.light} dot={F.second} size={20} />
          <Gauge v={4 * BLOCK_M} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ---------------------------------------------------------------------------------------------
// 1-07 · two jump cuts: the tower rockets up; the gauge climbs to 8,849 m (#1); Tick tiny at the base, head tilted back.
const ShotTower: ShotFC<CL01> = ({ f, len }) => {
  const j1 = Math.round(len * 0.3);
  const j2 = Math.round(len * 0.6);
  const stage = f < j1 ? 0 : f < j2 ? 1 : 2;
  const sf = stage === 0 ? f : stage === 1 ? f - j1 : f - j2;
  const base = [0.06, 0.34, 0.86][stage];
  const top = [0.3, 0.8, 1][stage];
  const dur = [j1, j2 - j1, len - j2][stage];
  const k = base + (top - base) * smooth(ramp(sf, 0, Math.max(8, dur - 4)));
  const h = TOWER_PX * k;
  const v = Math.max(4 * BLOCK_M, HEIGHTS.everestRounded * k); // #1
  const cam = cameraAt(f, [
    { f: 0, x: 915, y: 700, zoom: 1.5 },
    { f: j2 + 10, x: 930, y: 520, zoom: 1.02 },
    { f: len + 30, x: 940, y: 500, zoom: 0.97 },
  ]);
  const tx = BX - 150;
  const sway = Math.sin(f / 9) * k * 3;
  return (
    <AbsoluteFill style={{ transform: `scale(${Math.max(cutPop(f, 0), cutPop(f, j1), cutPop(f, j2))})` }}>
      <Stage theme={F.theme} cam={cam} vignette={0.1} grain={0.5}>
        <Studio f={f} seed={13} hud={<Gauge v={v} rolling readout={k >= 0.999 ? "8,849 m" : undefined} />}>
          <CastShadow n={k * 26} />
          <g transform={`rotate(${(sway * 0.12).toFixed(3)} ${BX + BW / 2} ${FLOOR})`}>
            <Column h={h} crack={0.55} />
          </g>
          <GroundShadow x={tx + 8} y={FLOOR + 3} rx={TICK_PPM * 0.42} color={F.shadow} opacity={0.3} blur={8} />
          <Tick x={tx} y={FLOOR} pxPerM={TICK_PPM} frame={f} pose="stand" poseTo="shield" poseT={stage === 2 ? Math.min(0.45, sf / 30) : 0} expression="happy" expressionTo="surprised" expressionT={ramp(f, j1 - 6, j1 + 8)} look={1} headTilt={-10 - 16 * k} slump={0.2} />
        </Studio>
      </Stage>
    </AbsoluteFill>
  );
};

// 1-08 · the dial, close: the needle swings into the amber band and settles at 235 MPa (#9); the hatching spreads.
const ShotDial235: ShotFC<CL01> = ({ f, len, c }) => {
  const n = c.n235 - c.dial2;
  const lim = c.limit - c.dial2;
  const swing = ramp(f, 4, n + 16);
  // overshoot then settle on 235 (#9: 2,700 × 9.82 × 8,849 = 2.35 × 10⁸ Pa)
  const v = 60 + (235 - 60) * (swing < 1 ? smooth(swing) * 1.06 - 0.06 * Math.pow(swing, 6) : 1) + (f > n + 16 && f < n + 40 ? Math.sin((f - n - 16) / 3) * 4 * (1 - (f - n - 16) / 24) : 0);
  const shown = f >= n + 16;
  const cam = cameraAt(f, [
    { f: 0, x: 560, y: 640, zoom: 1.6 },
    { f: len + 30, x: 590, y: 656, zoom: 1.76 },
  ]);
  const crack = 0.55 + 0.4 * ramp(f, lim, len);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.12} grain={0.5}>
        <Studio f={f} seed={15}>
          <CastShadow n={26} />
          <Column h={TOWER_PX} crack={crack} />
          <rect x={DIAL.x - 8} y={DIAL.y + DIAL.r} width={16} height={FLOOR - DIAL.y - DIAL.r} fill={F.near} />
          <GroundShadow x={DIAL.x + 20} y={FLOOR + 3} rx={90} color={F.shadow} opacity={0.25} blur={8} />
          <Dial x={DIAL.x} y={DIAL.y} r={DIAL.r} value={v} min={0} max={300} ticks={6} family={F} unit="MPa" format={fmtMPa} frame={f} title="PRESSURE" band={{ from: 100 /* #7 */, to: 250 /* #7 */, color: AMBER }} />
          <GraniteTag x={DIAL.x} y={DIAL.y - DIAL.r - 52} />
        </Studio>
        <Layer depth={0}>
          <g opacity={ramp(f, n - 4, n + 8)}>
            {shown ? <Metric x={150} y={300} value="235" unit="MPa" size={120} color={F.text} unitColor={F.dim} /> : <Counter x={150} y={300} value={Math.min(235, v)} max={999} digits={3} size={120} color={F.text} unit="MPa" unitColor={F.dim} />}
            <rect x={154} y={326} width={70} height={7} rx={3} fill={AMBER} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ---------------------------------------------------------------------------------------------
// 1-09 + 1-10 · the gag's payoff: anticipation (the tower trembles, grit trickles, Tick edges back) → a hold → on "the
// bottom gives way" the block cracks (flash), the tower sags and tilts, debris; Tick's arms go up. Then the gauge's
// amber band 4-9 km · SOLID COLUMN (#9) and the tower ghost flickering at each end of it.
const ShotCollapse: ShotFC<CL01> = ({ f, len, c }) => {
  const cr = c.crack - c.wobble;
  const bd = c.band - c.wobble;
  const pre = Math.min(1, f / Math.max(1, cr - 14)); // anticipation builds…
  const hold = f >= cr - 14 && f < cr; // …then a dead-still half second before the crack
  const age = f - cr;
  const broke = age >= 0;
  const tremble = broke ? 0 : hold ? 0 : Math.sin(f * 2.1) * pre * pre * 3.2;
  const fallT = broke ? smooth(Math.min(1, age / 22)) : 0;
  const sag = fallT * 46;
  const tilt = fallT * 7 + (broke && age < 40 ? Math.sin(age / 3) * (1 - age / 40) * 0.8 : 0);
  const shake = broke && age < 20 ? Math.sin(age * 2.6) * (1 - age / 20) * 20 : 0; // ~2 % of the frame
  const cam = cameraAt(f, [
    { f: 0, x: 930, y: 540, zoom: 1.0 },
    { f: Math.max(2, cr - 2), x: 925, y: 590, zoom: 1.16 },
    { f: cr + 14, x: 930, y: 540, zoom: 1.0 },
    { f: len + 30, x: 950, y: 530, zoom: 1.05 },
  ]);
  const tx = BX - 150 - 70 * smooth(ramp(f, cr * 0.35, cr - 16)) - 60 * fallT;
  const stepping = f > cr * 0.35 && f < cr - 16;
  const bandOn = f >= bd;
  const flick = bandOn ? 0.35 + 0.35 * (Math.sin(f * 0.9) > 0 ? 1 : 0.3) : 0;
  const pxPerM = TOWER_PX / HEIGHTS.everestRounded;
  const debris = Array.from({ length: 14 }, (_, i) => {
    const a = age - i * 1.5;
    if (!broke || a < 0 || a > 50) return null;
    const dir = i % 2 ? 1 : -1;
    return { x: BX + BW / 2 + dir * (20 + rnd(i) * 30 + a * (2 + rnd(i * 3) * 4)), y: Math.min(FLOOR - 4, FLOOR - 60 - rnd(i * 5) * 60 - a * 3 + 0.3 * a * a), s: 6 + rnd(i * 7) * 12, rot: a * 14 * dir };
  });
  return (
    <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)}) translate(${shake.toFixed(1)}px, ${(shake * 0.4).toFixed(1)}px)` }}>
      <Stage theme={F.theme} cam={cam} vignette={0.1} grain={0.5}>
        <Studio f={f} seed={17} hud={<Gauge v={HEIGHTS.everestRounded /* #1 */} readout="8,849 m" band={bandOn} />}>
          <CastShadow n={26} sway={tilt * 20} />
          {/* ghosts of the column's top at each end of the crush range (3.8 km and 9.4 km, #9) */}
          {bandOn
            ? [HEIGHTS.crushBand.from, HEIGHTS.crushBand.to].map((m, i) => (
                <g key={i} opacity={i === (Math.floor(f / 9) % 2) ? flick : flick * 0.4}>
                  <rect x={BX - 240} y={FLOOR - m * pxPerM} width={BW} height={m * pxPerM} fill={alpha(AMBER, 0.1)} stroke={AMBER} strokeWidth={2.5} strokeDasharray="10 8" />
                </g>
              ))
            : null}
          <g transform={`translate(${tremble.toFixed(1)} ${sag.toFixed(1)}) rotate(${tilt.toFixed(2)} ${BX + BW} ${FLOOR})`}>
            <Column h={TOWER_PX} crack={0.95} split={broke ? Math.min(1, age / 6) : 0} />
          </g>
          {/* grit trickling before, debris + dust after */}
          {!broke && pre > 0.3 ? <Puffs frame={f} x={BX + BW * 0.5} y={FLOOR - 60} color={alpha(L12_COLORS.slate, 0.5)} period={hold ? 9 : 16} size={6} rise={-0.9} drift={0.3} life={22} seed={4} /> : null}
          {debris.map((p, i) => (p ? <rect key={i} x={p.x - p.s / 2} y={p.y - p.s / 2} width={p.s} height={p.s * 0.7} fill={i % 3 ? L12_COLORS.slate : L12_COLORS.slateDark} transform={`rotate(${p.rot} ${p.x} ${p.y})`} /> : null))}
          {broke && age < 60 ? (
            <>
              <Puffs frame={age + 40} x={BX - 20} y={FLOOR - 10} color={alpha(F.near, 0.6)} period={14} size={30} rise={0.8} drift={-1.6} life={46} seed={2} />
              <Puffs frame={age + 40} x={BX + BW + 30} y={FLOOR - 10} color={alpha(F.near, 0.6)} period={14} size={30} rise={0.8} drift={1.6} life={46} seed={6} />
            </>
          ) : null}
          <GroundShadow x={tx + 8} y={FLOOR + 3} rx={TICK_PPM * 0.42} color={F.shadow} opacity={0.3} blur={8} />
          {broke ? (
            <Tick x={tx} y={FLOOR} pxPerM={TICK_PPM} frame={f} pose="stand" poseTo="shield" poseT={Math.min(1.7, age / 12)} expression="scared" look={1} squash={impact(f, cr, 0.1, 8)} />
          ) : (
            <Tick x={tx} y={FLOOR} pxPerM={TICK_PPM} frame={f} facing={1} walk={stepping ? -walkPhase(f, 20) : undefined} pose="stand" expression="surprised" expressionTo="worried" expressionT={pre} look={1} headTilt={-22} />
          )}
        </Studio>
        {broke ? (
          <Layer depth={0}>
            <rect x={0} y={0} width={1920} height={1080} fill="#FFFFFF" opacity={flash(age, 0, 8, 0.6)} />
          </Layer>
        ) : null}
      </Stage>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// 1-11 + 1-12 · the cracked column fades to a ghost; the real Everest silhouette rises beside it to the same 8,849 m
// (#1; inside the amber band, #9); a "?" pops between them; Tick looks from one to the other, then the camera pushes in
// and it narrows its eyes: "So it must be cheating." Tail: BlackBeat + sting → ChapterCard 2 (ember) "Mountains Float".
const EV: Pt[] = [
  [-326, -8],
  [-250, -150],
  [-170, -330],
  [-96, -520],
  [-40, -650],
  [-8, -TOWER_PX],
  [16, -TOWER_PX],
  [50, -640],
  [110, -500],
  [190, -330],
  [270, -160],
  [346, -8],
];
const ShotCheat: ShotFC<CL01> = ({ f, len, c }) => {
  const brk = c.brk - c.awkward;
  if (f >= brk) {
    const bf = f - brk;
    const BB = 16;
    const cardLen = Math.max(1, len - brk - BB);
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        {bf >= BB ? <ChapterCard family={EMBER} kicker="Chapter two · The root" title="Mountains Float" t={Math.min(0.84, ((bf - BB) / cardLen) * 0.84)} frame={bf} /> : null}
        {bf < BB + 8 ? <BlackBeat t={Math.min(1, (bf + 6) / (BB + 14))} fadeIn={0.3} fadeOut={0.35} /> : null}
      </AbsoluteFill>
    );
  }
  const ev = c.everest - c.awkward;
  const q = c.taller - c.awkward;
  const ch = c.cheat - c.awkward;
  const rise = smooth(ramp(f, ev, ev + 26));
  const ghostT = ramp(f, 0, 22);
  const push = ramp(f, ch - 8, ch + 20);
  const tx = 560;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: ch - 8, x: 975, y: 530, zoom: 1.05 },
    { f: ch + 22, x: tx + 40, y: FLOOR - 160, zoom: 3.0 },
    { f: brk + 20, x: tx + 46, y: FLOOR - 166, zoom: 3.3 },
  ]);
  const ex = 1230;
  const evPts: Pt[] = EV.map(([x, y]) => [ex + x * 0.74, FLOOR + y * rise]);
  const lookOsc = f < ch ? Math.sin((f - ev) / 9) : 1;
  const qT = ramp(f, q, q + 8);
  const blackOut = ramp(f, brk - 5, brk);
  return (
    <AbsoluteFill>
      <Pop f={f}>
        <Stage theme={F.theme} cam={cam} vignette={0.1} grain={0.5}>
          <Studio f={f} seed={19} hud={<g opacity={1 - push}><Gauge v={HEIGHTS.everestRounded /* #1 */} readout="8,849 m" band /></g>}>
            <CastShadow n={26} sway={140} />
            <g transform={`translate(0 46) rotate(7 ${BX + BW} ${FLOOR})`} opacity={1 - ghostT}>
              <Column h={TOWER_PX} crack={0.95} split={1} />
            </g>
            <g transform={`translate(0 46) rotate(7 ${BX + BW} ${FLOOR})`}>
              <Column h={TOWER_PX} ghost opacity={ghostT * 0.9} />
            </g>
            {/* Everest: the dusk mid colour, lit from the upper left, snow above its own line */}
            {rise > 0.01 ? (
              <g>
                <path d={`M${ex - 240} ${FLOOR} L${ex + 256} ${FLOOR} L${ex + 1000} ${FLOOR + 130} L${ex + 420} ${FLOOR + 150} Z`} fill={F.shadow} opacity={0.18 * rise} />
                <Form d={ridgePath(evPts, FLOOR + 1, 10)} fill={DUSK.mid} light={KEY_LIGHT} shadow={DUSK.shadow} inset={30} shadowOpacity={0.45} rim={F.light} rimWidth={4} rimOpacity={0.9} bounce={DUSK.bounce}>
                  <Facets pts={evPts} base={FLOOR} light={KEY_LIGHT} fill={DUSK.shadow} opacity={0.4} />
                  <Facets pts={evPts} base={FLOOR} light={KEY_LIGHT} fill={mixHex(DUSK.mid, F.light, 0.5)} opacity={0.35} lit />
                  <path d={snowCap(evPts, 2, 9, FLOOR - TOWER_PX * 0.66 * rise, 16)} fill={L12_COLORS.snow} />
                </Form>
                {rise > 0.95 ? <circle cx={ex + 3} cy={FLOOR - TOWER_PX - 6} r={8 + Math.sin(f / 8) * 1.5} fill="#E4572E" /> : null}
              </g>
            ) : null}
            <g opacity={qT} transform={`translate(1082 ${330 - (1 - qT) * 20}) scale(${0.6 + 0.4 * qT + impact(f, q + 8, 0.2, 8).sx - 1})`}>
              <UnknownTag x={0} y={0} size={44} />
            </g>
            <GroundShadow x={tx + 8} y={FLOOR + 3} rx={TICK_PPM * 0.42} color={F.shadow} opacity={0.3} blur={8} />
            <Tick x={tx} y={FLOOR} pxPerM={TICK_PPM} frame={f} pose="think" poseTo="hips" poseT={Math.min(1.7, Math.max(0, (f - ch) / 16))} expression="thinking" expressionTo="determined" expressionT={ramp(f, ch - 4, ch + 8)} look={f < ev ? 0.6 : lookOsc} headTilt={push * 7} />
          </Studio>
        </Stage>
      </Pop>
      {blackOut > 0 ? <AbsoluteFill style={{ background: "#000", opacity: blackOut }} /> : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------

export const SceneL01: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL01(t);
  const shots: ShotDef<CL01>[] = [
    { from: 0, S: ShotCarry, id: "1-01" },
    { from: c.four, S: ShotFour, id: "1-02" },
    { from: c.bottom, S: ShotBottom, id: "1-03" },
    { from: c.dial, S: ShotDialPress, id: "1-04" },
    { from: c.air, S: ShotAir, id: "1-06" },
    { from: c.tower, S: ShotTower, id: "1-07" },
    { from: c.dial2, S: ShotDial235, id: "1-08" },
    { from: c.wobble, S: ShotCollapse, id: "1-09" },
    { from: c.awkward, S: ShotCheat, id: "1-11" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL01 = (t: SceneTiming): Cue[] => {
  const c = cuesL01(t);
  const towerLen = c.dial2 - c.tower;
  return [
    // 1-01: footsteps, the landing
    ...[6, 22, 38].map((o) => ({ at: o, file: SFX.click, vol: 0.1, dur: 10 })),
    { at: Math.min(48, Math.round((c.four - 0) * 0.5)) + 16, file: SFX.popLong, vol: 0.26, dur: 30 },
    ...cutHit(c.four),
    ...[0, 1, 2, 3].map((i) => ({ at: c.presses + i * 8, file: SFX.pop, vol: 0.16, dur: 16 })),
    ...cutHit(c.bottom),
    { at: c.bottom + 4, file: SFX.rumble, vol: 0.16, dur: c.dial - c.bottom, fadeIn: 10, fadeOut: 20 },
    ...[0, 1, 2, 3].map((i) => ({ at: c.dayOff + i * 11, file: SFX.click, vol: 0.14, dur: 10 })),
    ...cutHit(c.dial),
    { at: c.dial + 4, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...[20, 40, 60].map((o) => ({ at: c.dial + o, file: SFX.click, vol: 0.1, dur: 10 })),
    { at: c.squeeze, file: SFX.rumble, vol: 0.24, dur: c.crush - c.squeeze + 6, fadeIn: 12, fadeOut: 6 },
    { at: c.crush, file: SFX.debris, vol: 0.34, dur: 70, fadeOut: 24 },
    ...cutHit(c.air),
    ...Array.from({ length: 8 }, (_, i) => ({ at: c.air + 15 + i * 12, file: SFX.pop, vol: 0.14, dur: 14 })),
    { at: c.tower - 26, file: SFX.popLong, vol: 0.24, dur: 30 },
    ...cutHit(c.tower),
    { at: c.tower, file: SFX.riser, vol: 0.2, dur: towerLen + 10, fadeOut: 20 },
    ...cutHit(c.tower + Math.round(towerLen * 0.3), 0.18),
    ...cutHit(c.tower + Math.round(towerLen * 0.6), 0.18),
    ...Array.from({ length: 10 }, (_, i) => ({ at: c.tower + 8 + Math.round((towerLen * i) / 10), file: SFX.click, vol: 0.1, dur: 10 })),
    ...cutHit(c.dial2),
    { at: c.dial2, file: SFX.rumble, vol: 0.2, dur: c.wobble - c.dial2, fadeIn: 20, fadeOut: 20 },
    { at: c.n235 + 16, file: SFX.pop, vol: 0.26, dur: 20 },
    ...cutHit(c.wobble),
    { at: c.wobble, file: SFX.rumble, vol: 0.26, dur: Math.max(20, c.crack - c.wobble - 12), fadeIn: 20, fadeOut: 4 }, // cuts out for the hold
    { at: c.crack, file: SFX.uBoom, vol: 0.44, dur: 110, fadeOut: 30 },
    { at: c.crack + 3, file: SFX.debris, vol: 0.36, dur: 120, fadeOut: 40 },
    { at: c.band, file: SFX.popLong, vol: 0.24, dur: 30 },
    ...cutHit(c.awkward),
    { at: c.everest, file: SFX.chime, vol: 0.22, dur: 60 },
    { at: c.taller + 6, file: SFX.pop, vol: 0.26, dur: 20 },
    { at: c.cheat - 8, file: SFX.whoosh, vol: 0.16, dur: 40 },
    ...sting(c.brk),
  ];
};
