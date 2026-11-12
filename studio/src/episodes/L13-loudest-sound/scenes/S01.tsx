// L13 scene l01 "A wiggle on top of the air" (storyboard §3 "1 ·": shots 1-01…1-12, script lines 7-11, STUDIO_SET →
// petrol → STUDIO_SET, Act I). Shot components (PUSH/MORPH = one component): 1-01+1-02+1-03 (Tick walks in and sits;
// the air becomes visible as jostling dots pressing on everything; the dots stream into the flat line) · 1-04 (petrol: a
// wave rides the line, Tick shakes it like a rope) · 1-05 (faster: the wavelength halves twice) · 1-06 (a lens slides
// along the line; inside, a hair-thin wiggle) · 1-07 (decade zoom: the hair grows to fill the frame) · 1-08 (snap out:
// the hair beside the wall, ×5,000,000,000) · 1-09 (a ruler running off the top, ticks racing up) · 1-10 (Tick tries to
// count them, shrugs) · 1-11 (studio: Tick folds the ruler, accordion) · 1-12 (the fold snaps into the ladder 0-60; MATCH
// to l02's meadow ladder at the same screen place).
// Numbers drawn, each with its sources.md row: 101,325 Pa (#8) · 20 µPa · THE SCALE'S ZERO (#9, F17) · ×5,000,000,000
// and 5,000,000,000 : 1 (#9 + #8: 101,325 Pa ÷ 20 µPa = 5.07 × 10⁹) · rungs 0 · 20 · 40 · 60 (#9, the dB scale).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Bloom,
  CloudRack,
  Counter,
  CycClouds,
  Emissive,
  Family,
  GroundShadow,
  HazeBand,
  IF2,
  Inset,
  Kicker,
  Layer,
  Metric,
  Motes,
  Pill,
  Puffs,
  STUDIO_SET,
  Sky,
  Stage,
  Tick,
  alpha,
  cameraAt,
  cutPop,
  impact,
  mixHex,
  ramp,
  rnd,
  smooth,
  walkPhase,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L13_COLORS, familyOf, pillFill } from "../families";
import { PressureWave } from "../sound";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";

const S = STUDIO_SET;
const P = familyOf("petrol");
const TEAL = L13_COLORS.teal;
const BONE = L13_COLORS.bone;
const FLOOR = 880;
const LINE_Y = 560; // the flat line in the petrol field

/** Ladder geometry shared with l02 (MATCH cut): rails at x 700 / 820, a rung every 20 dB = 140 px, 0 dB at y 900. */
export const LADDER = { x0: 700, x1: 820, base: 900, step: 140 } as const;

export const cuesL01 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    start: 0,
    air: p(0, "all the time"), // 1-02: the air becomes visible (continuous push)
    pascals: p(0, "a hundred and one thousand"),
    flat: p(0, "Call that the flat line"), // 1-03: the dots stream into the line
    rope: at(1), // 1-04
    faster: p(1, "over and over"), // 1-05
    lens: at(2), // 1-06
    decades: p(2, "twenty millionths"), // 1-07
    beside: p(2, "Set that beside"), // 1-08
    ruler: at(3), // 1-09
    count: p(3, "That is the gap"), // 1-10
    fold: at(4), // 1-11
    ladder: p(4, "fold the ruler up"), // 1-12
    last: end(4),
    end: t.frames,
  };
};
export type CL01 = ReturnType<typeof cuesL01>;

const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/** A label tag that keeps the case of its units (µPa, Pa): the kit Pill upper-cases everything. */
const Tag: React.FC<{ x: number; y: number; text: string; F: Family; dot?: string; size?: number; align?: "start" | "end" | "middle" }> = ({ x, y, text, F, dot, size = 24, align = "start" }) => {
  const w = text.length * size * 0.6 + size * (dot ? 2.3 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={pillFill(F)} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.1, fill: F.dark ? F.text : "#FFF4DE" }}>
        {text}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------
// the studio room (teal cyc, ochre floor) and the petrol air field

const Room: React.FC<{ f: number; children: React.ReactNode; hud?: React.ReactNode; seed?: number; table?: boolean }> = ({ f, children, hud, seed = 2, table = true }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={S} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f} y={90} n={5} seed={seed} />
    </Layer>
    <Layer depth={0.6}>
      <rect x={-1400} y={FLOOR - 70} width={4800} height={900} fill={mixHex(S.mid, "#FFE4A8", 0.2)} />
      <HazeBand y={FLOOR - 200} h={200} color={S.haze} strength={0.8} x={-1400} w={4800} />
    </Layer>
    <Layer depth={1}>
      <rect x={-1400} y={FLOOR} width={4800} height={900} fill={mixHex(S.mid, S.near, 0.5)} />
      {table ? <TableSet f={f} /> : null}
      {children}
    </Layer>
    <Layer depth={1.25}>
      <Motes frame={f} n={20} x={-100} y={60} w={2100} h={860} color={alpha("#FFF4DE", 0.8)} seed={seed} size={5} drift={40} />
    </Layer>
    {hud ? <Layer depth={0}>{hud}</Layer> : null}
  </>
);

const TABLE = { x: 1180, w: 330, top: 700 };
const CUP: [number, number] = [TABLE.x + 70, TABLE.top];
const BOOK: [number, number] = [TABLE.x + 200, TABLE.top];

/** A small table with a cup and a book; the cast shadows sway a little with the key light. */
const TableSet: React.FC<{ f: number }> = ({ f }) => {
  const sway = Math.sin(f / 40) * 14;
  const wood = "#8A5A34";
  return (
    <g>
      <path d={`M${TABLE.x} ${FLOOR} L${TABLE.x + TABLE.w} ${FLOOR} L${TABLE.x + TABLE.w + 260 + sway} ${FLOOR + 70} L${TABLE.x + 200 + sway} ${FLOOR + 70} Z`} fill={S.shadow} opacity={0.2} />
      <rect x={TABLE.x + 20} y={TABLE.top} width={16} height={FLOOR - TABLE.top} fill={mixHex(wood, S.shadow, 0.4)} />
      <rect x={TABLE.x + TABLE.w - 36} y={TABLE.top} width={16} height={FLOOR - TABLE.top} fill={mixHex(wood, S.shadow, 0.4)} />
      <rect x={TABLE.x} y={TABLE.top - 18} width={TABLE.w} height={22} rx={4} fill={wood} />
      <rect x={TABLE.x} y={TABLE.top - 18} width={TABLE.w} height={6} rx={3} fill={mixHex(wood, "#FFE4A8", 0.4)} />
      {/* cup */}
      <path d={`M${CUP[0] - 26} ${CUP[1] - 70} L${CUP[0] + 26} ${CUP[1] - 70} L${CUP[0] + 20} ${CUP[1] - 18} L${CUP[0] - 20} ${CUP[1] - 18} Z`} fill={L13_COLORS.vermilion} />
      <path d={`M${CUP[0] + 24} ${CUP[1] - 60} q 22 6 4 30`} fill="none" stroke={L13_COLORS.vermilion} strokeWidth={6} />
      <rect x={CUP[0] - 26} y={CUP[1] - 72} width={52} height={7} fill={mixHex(L13_COLORS.vermilion, "#FFF", 0.35)} />
      {/* book */}
      <rect x={BOOK[0] - 60} y={BOOK[1] - 46} width={120} height={28} rx={3} fill="#2F7F6E" />
      <rect x={BOOK[0] - 56} y={BOOK[1] - 42} width={112} height={8} fill="#FFF4DE" />
    </g>
  );
};

const AirField: React.FC<{ f: number; children: React.ReactNode; hud?: React.ReactNode; seed?: number; ground?: number }> = ({ f, children, hud, seed = 4, ground }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={P} />
    </Layer>
    <Layer depth={0.12}>
      <Bloom x={1580} y={200} r={360} color={P.light} core={30} coreColor="#F4FBF6" strength={0.5} />
    </Layer>
    <Layer depth={0.3}>
      <CloudRack f={f} n={4} x0={-700} x1={2700} y0={190} y1={330} size={110} speed={2.2} body={alpha("#3FB0A4", 0.55)} under={alpha("#0A3A42", 0.5)} seed={seed} />
    </Layer>
    {ground !== undefined ? (
      <Layer depth={0.8}>
        <rect x={-1400} y={ground} width={4800} height={900} fill={P.near} />
        <HazeBand y={ground - 120} h={120} color={P.haze} strength={0.5} x={-1400} w={4800} />
      </Layer>
    ) : null}
    <Layer depth={1}>{children}</Layer>
    <Layer depth={1.2}>
      <Motes frame={f} n={26} x={-100} y={40} w={2100} h={980} color={alpha(BONE, 0.7)} seed={seed} size={4.5} drift={44} />
    </Layer>
    {hud ? <Layer depth={0}>{hud}</Layer> : null}
  </>
);

// ---------------------------------------------------------------------------------------------
// 1-01 + 1-02 + 1-03 · Tick walks in and sits; the air shows up as ~110 jostling dots, arrows pressing on Tick, cup and
// table from every side; on "Call that the flat line" the dots stream into one horizontal teal line.
const DOTS = Array.from({ length: 110 }, (_, i) => ({
  x: -120 + rnd(i * 3 + 1) * 2160,
  y: 40 + rnd(i * 7 + 2) * 900,
  r: 10 + rnd(i * 11 + 3) * 4,
  ph: rnd(i * 13 + 4) * 6.28,
  w: 0.16 + rnd(i * 17 + 5) * 0.1,
}));
const ShotRoom: ShotFC<CL01> = ({ f, len, c }) => {
  const arrive = 72;
  const sitAt = arrive + 4;
  const x0 = 240;
  const x1 = 960;
  const walking = f < arrive;
  const tx = walking ? x0 + ((x1 - x0) * f) / arrive : x1;
  const air = c.air;
  const flat = c.flat;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: air - 4, x: 980, y: 540, zoom: 1.04 },
    { f: air + 40, x: 1080, y: 560, zoom: 1.38 },
    { f: len + 30, x: 1100, y: 560, zoom: 1.5 },
  ]);
  const dotsOn = ramp(f, air, air + 16);
  const morph = smooth(ramp(f, flat, flat + 30));
  const arrows = ramp(f, air + 8, air + 24) * (1 - ramp(f, flat - 6, flat + 6));
  const metricA = ramp(f, c.pascals - 6, c.pascals + 8) * (1 - ramp(f, flat - 4, flat + 6));
  const flatA = ramp(f, flat + 24, flat + 36);
  // the line lands at the camera's centre height (world)
  const lineY = cam.y;
  const ppm = 150;
  const targets: [number, number, number][] = [
    [tx + 20, FLOOR - ppm * 1.2, ppm * 0.5],
    [CUP[0], CUP[1] - 44, 60],
    [TABLE.x + TABLE.w / 2, TABLE.top + 60, 200],
  ];
  return (
    <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5}>
      <Room
        f={f}
        hud={
          <g>
            <g opacity={metricA}>
              <Metric x={120} y={190} value="101,325" unit="Pa" /* #8 */ size={92} color="#FFF4DE" />
              <Pill x={120} y={250} text="AIR PRESSURE AT SEA LEVEL" /* #8 */ fill={pillFill(S)} color="#FFF4DE" dot={TEAL} size={24} />
            </g>
            <g opacity={flatA}>
              <Pill x={120} y={190} text="THE FLAT LINE" fill={pillFill(S)} color="#FFF4DE" dot={TEAL} size={26} />
            </g>
          </g>
        }
      >
        {/* stool */}
        <rect x={x1 - 40} y={FLOOR - 74} width={90} height={16} rx={6} fill="#8A5A34" />
        <rect x={x1 - 26} y={FLOOR - 60} width={12} height={60} fill="#6B4428" />
        <rect x={x1 + 24} y={FLOOR - 60} width={12} height={60} fill="#6B4428" />
        <GroundShadow x={tx + 6} y={FLOOR + 3} rx={ppm * 0.42} color={S.shadow} opacity={0.3} blur={8} />
        {walking ? (
          <Tick x={tx} y={FLOOR} pxPerM={ppm} frame={f} walk={walkPhase(f, 18)} pose="stand" expression="happy" />
        ) : (
          <Tick x={tx} y={FLOOR - 36} pxPerM={ppm} frame={f} pose="stand" poseTo="sit" poseT={Math.min(1.5, (f - sitAt) / 16)} expression="happy" expressionTo="surprised" expressionT={ramp(f, air + 10, air + 20)} look={f > air + 10 ? 0.3 : 0.8} headTilt={f > air + 10 ? 10 : 0} />
        )}
        {/* the pressing arrows: in and out, from all sides */}
        {arrows > 0
          ? targets.flatMap(([cx, cy, r], k) =>
              Array.from({ length: 8 }, (_, i) => {
                const a = (i / 8) * Math.PI * 2 + k;
                const pls = Math.sin(f / 6 + i * 0.8 + k) * 16;
                const d0 = r + 60 + pls;
                const d1 = r + 18 + pls;
                const ax = cx + Math.cos(a) * d0;
                const ay = cy + Math.sin(a) * d0;
                const bx = cx + Math.cos(a) * d1;
                const by = cy + Math.sin(a) * d1;
                const nx = -Math.sin(a) * 10;
                const ny = Math.cos(a) * 10;
                return (
                  <g key={`${k}-${i}`} opacity={arrows}>
                    <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#FFF4DE" strokeWidth={5} strokeLinecap="round" />
                    <path d={`M${bx} ${by} L${bx + Math.cos(a) * 16 + nx} ${by + Math.sin(a) * 16 + ny} L${bx + Math.cos(a) * 16 - nx} ${by + Math.sin(a) * 16 - ny} Z`} fill="#FFF4DE" />
                  </g>
                );
              }),
            )
          : null}
        {/* the air, made visible: big soft dots, each jostling 3-5 px/f; then they stream into the flat line */}
        {dotsOn > 0
          ? DOTS.map((d, i) => {
              const jx = d.x + Math.sin(f * d.w + d.ph) * 22 + Math.sin(f * d.w * 1.7 + d.ph * 2) * 10;
              const jy = d.y + Math.cos(f * d.w * 1.2 + d.ph) * 20;
              const target = -200 + (i / (DOTS.length - 1)) * 2400;
              const delay = rnd(i * 5) * 0.4;
              const m = smooth(Math.max(0, Math.min(1, (morph - delay) / 0.6)));
              const x = jx + (target - jx) * m;
              const y = jy + (lineY - jy) * m;
              return <circle key={i} cx={x} cy={y} r={d.r * (1 - m * 0.4)} fill={i % 3 ? alpha(BONE, 0.85) : alpha(TEAL, 0.9)} opacity={dotsOn} />;
            })
          : null}
        {morph > 0.6 ? <Emissive d={`M-400 ${lineY} L2400 ${lineY}`} color={TEAL} core={BONE} width={6} glow={16} opacity={ramp(morph, 0.6, 1)} /> : null}
      </Room>
    </Stage>
  );
};

// 1-04 · petrol: a wave rides the flat line, scrolling; above it lighter (push), below deeper (pull); Tick holds the
// line's left end like a rope and shakes it.
const ROPE_PPM = 200;
const RopeTick: React.FC<{ f: number; ppm: number; x: number; handY: number; jig: number; expression: "happy" | "determined"; speed?: number }> = ({ f, ppm, x, handY, jig, expression, speed = 1 }) => {
  const feet = handY + ppm * 1.04 + jig;
  return (
    <g>
      <GroundShadow x={x + 6} y={handY + ppm * 1.04 + 3} rx={ppm * 0.42} color={P.shadow} opacity={0.4} blur={8} />
      <Tick x={x} y={feet} pxPerM={ppm} frame={f} facing={1} pose="hold" expression={expression} look={0.7} headTilt={Math.sin(f / (5 / speed)) * 6} squash={{ sx: 1 - jig * 0.002, sy: 1 + jig * 0.003 }} />
    </g>
  );
};
const ShotRope: ShotFC<CL01> = ({ f, len }) => {
  const tx = 200;
  const hx = tx + ROPE_PPM * 0.36;
  const wp = { f, x0: hx, x1: 2000, wavelength: 360, speed: 6 } as const;
  const jig = Math.sin(((hx - hx - f * 6) / 360) * Math.PI * 2) * 18;
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.03, panY: 0.01, frames: len + 60, seed: 1 }} vignette={0.2} grain={0.5}>
        <AirField
          f={f}
          ground={LINE_Y + ROPE_PPM * 1.04}
          hud={<Pill x={120} y={150} text="A PRESSURE WIGGLE" /* #13 */ fill={pillFill(P)} color={P.text} dot={TEAL} size={26} />}
        >
          <PressureWave {...wp} y={LINE_Y} amp={60} fillAbove={alpha(BONE, 0.22)} fillBelow={alpha(P.shadow, 0.35)} width={6} />
          <RopeTick f={f} ppm={ROPE_PPM} x={tx} handY={LINE_Y - jig} jig={0} expression="happy" />
        </AirField>
      </Stage>
    </Pop>
  );
};

// 1-05 · "Over and over, very fast": the wavelength halves, then halves again; Tick shakes faster.
const ShotFaster: ShotFC<CL01> = ({ f, len }) => {
  const k = smooth(ramp(f, 6, len * 0.4)) + smooth(ramp(f, len * 0.5, len * 0.85));
  const wl = 320 / Math.pow(2, k);
  const ppm = 300;
  const tx = 130;
  const hx = tx + ppm * 0.36;
  const sp = 12;
  const amp = 80;
  const jig = Math.sin((-f * sp * 2 * Math.PI) / wl) * 22;
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.02, frames: len + 60, seed: 2 }} vignette={0.2} grain={0.5}>
        <AirField f={f + 200} ground={LINE_Y + 60 + ppm * 1.04} seed={6}>
          <PressureWave f={f} y={LINE_Y + 60} x0={hx} x1={2000} amp={amp} wavelength={wl} speed={sp} fillAbove={alpha(BONE, 0.22)} fillBelow={alpha(P.shadow, 0.35)} width={6} />
          <RopeTick f={f} ppm={ppm} x={tx} handY={LINE_Y + 60 - jig} jig={0} expression="determined" speed={2} />
        </AirField>
      </Stage>
    </Pop>
  );
};

// 1-06 · "How small a wiggle?": a magnifier slides along the line (8 px/f); inside it, a hair-thin wiggle. Tick walks
// with it, peering in; the camera pushes into the lens at the end (zoom-through to 1-07).
const ShotLens: ShotFC<CL01> = ({ f, len }) => {
  const lx = 420 + f * 8;
  const ly = LINE_Y - 250;
  const zin = ramp(f, len - 16, len);
  const cam = { x: 960 + (lx - 960) * zin, y: 540 + (ly - 540) * zin, zoom: 1 + zin * zin * 4 };
  const ppm = 170;
  const tkx = lx - 260;
  return (
    <Pop f={f}>
      <Stage theme={P.theme} cam={cam} vignette={0.2} grain={0.5}>
        <AirField f={f + 400} ground={LINE_Y + 200} seed={8}>
          <Emissive d={`M-400 ${LINE_Y} L2400 ${LINE_Y}`} color={TEAL} core={BONE} width={6} glow={16} />
          <Inset cx={lx} cy={ly} r={170} at={[lx, LINE_Y]} scale={7} family={P} t={ramp(f, 0, 12)}>
            <PressureWave f={f} y={LINE_Y} x0={lx - 60} x1={lx + 60} amp={2.2} wavelength={22} speed={0.9} width={0.9} glow={false} color={L13_COLORS.saffronCore} line={false} />
            <line x1={lx - 60} y1={LINE_Y} x2={lx + 60} y2={LINE_Y} stroke={alpha(BONE, 0.4)} strokeWidth={0.4} />
          </Inset>
          <GroundShadow x={tkx + 6} y={LINE_Y + 203} rx={ppm * 0.42} color={P.shadow} opacity={0.4} blur={8} />
          <Tick x={tkx} y={LINE_Y + 200} pxPerM={ppm} frame={f} facing={1} walk={walkPhase(f, 20)} pose="hold" expression="thinking" look={0.9} headTilt={-8} />
          <circle cx={tkx + ppm * 0.5} cy={LINE_Y + 200 - ppm * 1.06} r={20} fill={alpha(BONE, 0.25)} stroke={L13_COLORS.saffronDeep} strokeWidth={5} />
        </AirField>
      </Stage>
    </Pop>
  );
};

// 1-07 · decade zoom: the hair-wiggle doubles every ~6 frames until it fills the frame; a decade lamp per tenfold.
const ShotDecades: ShotFC<CL01> = ({ f, len }) => {
  const g = Math.min(Math.pow(2, f / 6), 170);
  const amp = 2.2 * g;
  const wl = 40 * Math.pow(g, 0.55);
  const decades = Math.min(9, Math.floor(Math.log10(Math.max(1, Math.pow(2, f / 6) * 3.2)) * 1.6));
  return (
    <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0.01, frames: len + 60, seed: 3 }} vignette={0.22} grain={0.5}>
      <AirField
        f={f + 600}
        seed={10}
        hud={
          <g>
            <Metric x={120} y={190} value="20" unit="µPa" /* #9 */ size={96} color={P.text} />
            <Pill x={120} y={252} text="THE SCALE'S ZERO" /* #9, F17 */ fill={pillFill(P)} color={P.text} dot={TEAL} size={24} />
            {Array.from({ length: 9 }, (_, i) => (
              <circle key={i} cx={130 + i * 34} cy={312} r={10} fill={i < decades ? L13_COLORS.saffron : alpha(BONE, 0.25)} />
            ))}
          </g>
        }
      >
        <PressureWave f={f} y={LINE_Y + 40} x0={-100} x1={2020} amp={amp} wavelength={wl} speed={8} width={Math.min(10, 1 + g * 0.06)} color={L13_COLORS.saffronCore} fillAbove={alpha(BONE, 0.18)} fillBelow={alpha(P.shadow, 0.3)} />
      </AirField>
    </Stage>
  );
};

// 1-08 · snap back out: the 20-µPa hair beside the 101,325-Pa flat line, which is now a wall; the Counter rolls to
// ×5,000,000,000 (#9 + #8).
const ShotFiveBillion: ShotFC<CL01> = ({ f, len }) => {
  const snap = smooth(ramp(f, 0, 12));
  const cam = { x: 1460 + (960 - 1460) * snap, y: 960 + (540 - 960) * snap, zoom: Math.exp(Math.log(7) * (1 - snap)) };
  const u = ramp(f, 10, Math.max(30, len - 20));
  const v = 5 * Math.pow(10, 9 * u); // 5 → 5,000,000,000
  const WALL = { x: 300, w: 380, base: 990 };
  return (
    <Stage theme={P.theme} cam={cam} vignette={0.2} grain={0.5}>
      <AirField
        f={f + 800}
        seed={12}
        hud={
          <g opacity={snap}>
            <text x={1000} y={200} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 84, fill: P.text }}>
              ×
            </text>
            <Counter x={1062} y={200} value={u >= 1 ? 5e9 : v} max={5e9} digits={10} size={72} color={P.text} />
          </g>
        }
      >
        {/* the wall: the flat line's pressure, a slab with bands climbing it */}
        <defs>
          <clipPath id="l01wall">
            <rect x={WALL.x} y={-3000} width={WALL.w} height={3000 + WALL.base} />
          </clipPath>
        </defs>
        <rect x={WALL.x} y={-3000} width={WALL.w} height={3000 + WALL.base} fill={mixHex(TEAL, P.near, 0.35)} />
        <g clipPath="url(#l01wall)">
          {Array.from({ length: 30 }, (_, i) => {
            const yy = WALL.base - ((i * 140 + f * 7) % 4200);
            return <rect key={i} x={WALL.x} y={yy} width={WALL.w} height={40 + rnd(i) * 40} fill={alpha(BONE, 0.18 + rnd(i * 3) * 0.12)} />;
          })}
        </g>
        <Emissive d={`M${WALL.x + WALL.w} ${WALL.base} L${WALL.x + WALL.w} -3000`} color={TEAL} core={BONE} width={5} glow={16} />
        <Tag x={WALL.x + WALL.w / 2} y={WALL.base - 60} text="101,325 Pa" /* #8 */ F={P} dot={TEAL} size={26} align="middle" />
        {/* the hair */}
        <PressureWave f={f} y={WALL.base - 20} x0={1200} x1={1720} amp={1.6} wavelength={30} speed={1.4} width={2} glow={false} color={L13_COLORS.saffronCore} line={false} />
        <Tag x={1460} y={WALL.base - 76} text="20 µPa" /* #9 */ F={P} dot={L13_COLORS.saffron} size={26} align="middle" />
      </AirField>
    </Stage>
  );
};

// 1-09 · Tick beside a ruler that would need five billion ticks: it runs off the top, the ticks racing upward.
const RulerBar: React.FC<{ f: number; x: number; w: number; base: number; speed: number }> = ({ f, x, w, base, speed }) => {
  const sp = 24;
  const off = f * speed;
  const first = Math.floor(off / sp);
  const out: React.ReactNode[] = [];
  for (let k = first; k < first + 70; k++) {
    const y = base - (k * sp - off);
    if (y < -600 || y > base) continue;
    const major = k % 5 === 0;
    const big = k % 25 === 0;
    const L = big ? w * 0.9 : major ? w * 0.6 : w * (0.22 + rnd(k) * 0.12);
    out.push(<rect key={k} x={x} y={y - (big ? 3 : 2)} width={L} height={big ? 6 : major ? 4 : 3} fill={big ? L13_COLORS.vermilion : "#1E3A44"} />);
  }
  return (
    <g>
      <rect x={x - 6} y={-700} width={w + 12} height={base + 700} fill="#FFF4DE" />
      <rect x={x + w} y={-700} width={6} height={base + 700} fill={L13_COLORS.landShade} />
      {out}
    </g>
  );
};
const ShotRuler: ShotFC<CL01> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 20, x: 960, y: 470, zoom: 1.04 },
  ]);
  const ppm = 160;
  return (
    <Pop f={f}>
      <Stage theme={P.theme} cam={cam} vignette={0.2} grain={0.5}>
        <AirField
          f={f + 1000}
          ground={900}
          seed={14}
          hud={<Kicker x={120} y={150} text="5,000,000,000 : 1" /* #8 #9 */ color={P.text} size={30} />}
        >
          <RulerBar f={f} x={840} w={130} base={900} speed={30} />
          <GroundShadow x={640} y={903} rx={ppm * 0.42} color={P.shadow} opacity={0.4} blur={8} />
          <Tick x={640} y={900} pxPerM={ppm} frame={f} facing={1} pose="stand" expression="surprised" look={0.8} headTilt={-22} slump={0.5 * ramp(f, 20, len)} />
        </AirField>
      </Stage>
    </Pop>
  );
};

// 1-10 · Tick (large) tries to count the ticks with the staff tip, loses track, shrugs.
const ShotCount: ShotFC<CL01> = ({ f, len }) => {
  const sh = Math.round(len * 0.55);
  const ppm = 360;
  const tx = 560;
  const tip = Math.sin(f / 4) * 40;
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.02, frames: len + 60, seed: 4 }} vignette={0.2} grain={0.5}>
        <AirField f={f + 1200} ground={1060} seed={16}>
          <RulerBar f={f + 90} x={1160} w={190} base={1100} speed={30} />
          {f < sh ? <line x1={tx + ppm * 0.6} y1={1060 - ppm * 1.2} x2={1150} y2={420 + tip} stroke={L13_COLORS.vermilion} strokeWidth={10} strokeLinecap="round" /> : null}
          <Tick x={tx} y={1060} pxPerM={ppm} frame={f} facing={1} pose="point" poseTo="shrug" poseT={Math.min(1.7, Math.max(0, (f - sh) / 14))} expression="thinking" expressionTo="sleepy" expressionT={ramp(f, sh, sh + 10)} look={f < sh ? 0.8 : -0.4} headTilt={f < sh ? -10 + tip * 0.15 : 8} />
        </AirField>
      </Stage>
    </Pop>
  );
};

// ---------------------------------------------------------------------------------------------
// 1-11 · studio: Tick grabs the ruler and folds it, accordion style (a zigzag that compresses in three tugs).
const SEG = 10;
const SEG_L = 128;
const zigzag = (fold: number, base: [number, number] = [760, 900]) => {
  const th = (fold * 84 * Math.PI) / 180;
  const pts: [number, number][] = [base];
  for (let i = 0; i < SEG; i++) {
    const [x, y] = pts[i];
    const s = i % 2 ? -1 : 1;
    pts.push([x + s * SEG_L * Math.sin(th), y - SEG_L * Math.cos(th)]);
  }
  return pts;
};
const FoldedRuler: React.FC<{ fold: number; w?: number; opacity?: number }> = ({ fold, w = 64, opacity = 1 }) => {
  const pts = zigzag(fold);
  return (
    <g opacity={opacity}>
      {pts.slice(0, -1).map(([x, y], i) => {
        const [x2, y2] = pts[i + 1];
        const dx = x2 - x;
        const dy = y2 - y;
        const L = Math.hypot(dx, dy) || 1;
        const nx = (-dy / L) * (w / 2);
        const ny = (dx / L) * (w / 2);
        const face = i % 2 ? "#F1DDB6" : "#FFF4DE";
        return (
          <g key={i}>
            <path d={`M${x + nx} ${y + ny} L${x2 + nx} ${y2 + ny} L${x2 - nx} ${y2 - ny} L${x - nx} ${y - ny} Z`} fill={face} stroke={L13_COLORS.landShade} strokeWidth={3} />
            {Array.from({ length: 5 }, (_, k) => {
              const q = (k + 0.5) / 5;
              const px = x + dx * q;
              const py = y + dy * q;
              return <line key={k} x1={px + nx} y1={py + ny} x2={px + nx * (k === 2 ? 0.1 : 0.45)} y2={py + ny * (k === 2 ? 0.1 : 0.45)} stroke="#1E3A44" strokeWidth={3} />;
            })}
          </g>
        );
      })}
    </g>
  );
};
const ShotFold: ShotFC<CL01> = ({ f, len }) => {
  const tugs = [0.12, 0.42, 0.72].map((q) => Math.round(q * len));
  const fold = tugs.reduce((a, t0, i) => a + 0.2 * smooth(ramp(f, t0, t0 + 14)) * (i < 3 ? 1 : 0), 0);
  const tug = tugs.reduce((m, t0) => (f >= t0 && f < t0 + 14 ? Math.sin(((f - t0) / 14) * Math.PI) : m), 0);
  const ppm = 170;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.03, panY: 0.01, frames: len + 60, seed: 5 }} vignette={0.1} grain={0.5}>
        <Room f={f + 300} table={false} seed={6}>
          <path d={`M720 ${FLOOR + 2} L800 ${FLOOR + 2} L1100 ${FLOOR + 60} L980 ${FLOOR + 60} Z`} fill={S.shadow} opacity={0.18} />
          <FoldedRuler fold={fold} />
          <GroundShadow x={520} y={FLOOR + 3} rx={ppm * 0.42} color={S.shadow} opacity={0.3} blur={8} />
          <Tick x={520 - tug * 12} y={FLOOR} pxPerM={ppm} frame={f} facing={1} pose="heave" poseTo="press" poseT={tug} expression="determined" look={0.8} headTilt={-10 + tug * 8} />
        </Room>
      </Stage>
    </Pop>
  );
};

// 1-12 · the fold snaps into a ladder with evenly spaced rungs 0 · 20 · 40 · 60 (#9); Tick, hands on hips, proud.
const RUNG_DB = [0, 20, 40, 60]; // #9 (the dB scale)
const ShotLadder: ShotFC<CL01> = ({ f, len }) => {
  const close = smooth(ramp(f, 0, 12));
  const snap = 14;
  const rails = ramp(f, snap, snap + 8);
  const ppm = 170;
  return (
    <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.0, panY: 0.0, frames: len + 60, seed: 6 }} vignette={0.1} grain={0.5}>
      <Room f={f + 500} table={false} seed={6}>
        {f < snap + 4 ? <FoldedRuler fold={0.6 + 0.4 * close} opacity={1 - ramp(f, snap, snap + 4)} /> : null}
        {/* rails: cream, climbing off the top */}
        <g opacity={rails}>
          <path d={`M${LADDER.x0} ${FLOOR + 2} L${LADDER.x1} ${FLOOR + 2} L${LADDER.x1 + 420} ${FLOOR + 70} L${LADDER.x0 + 300} ${FLOOR + 70} Z`} fill={S.shadow} opacity={0.18} />
          {[LADDER.x0, LADDER.x1].map((x) => (
            <g key={x}>
              <rect x={x - 11} y={-400} width={22} height={LADDER.base + 400} fill="#FFF4DE" />
              <rect x={x + 5} y={-400} width={6} height={LADDER.base + 400} fill={L13_COLORS.landShade} />
            </g>
          ))}
        </g>
        {RUNG_DB.map((db, i) => {
          const at = snap + 6 + i * 8;
          if (f < at) return null;
          const y = LADDER.base - (db / 20) * LADDER.step - 20;
          const drop = (1 - ramp(f, at, at + 6)) * -60;
          const sq = impact(f, at + 6, 0.25, 8);
          return (
            <g key={db} transform={`translate(0 ${drop.toFixed(1)})`}>
              <g transform={`translate(${(LADDER.x0 + LADDER.x1) / 2} ${y}) scale(${sq.sx} ${sq.sy}) translate(${-(LADDER.x0 + LADDER.x1) / 2} ${-y})`}>
                <rect x={LADDER.x0 - 4} y={y - 9} width={LADDER.x1 - LADDER.x0 + 8} height={18} rx={5} fill={L13_COLORS.saffron} />
              </g>
              <text x={LADDER.x0 - 30} y={y + 14} textAnchor="end" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 40, fill: "#FFF4DE" }}>
                {db}
              </text>
            </g>
          );
        })}
        {RUNG_DB.map((_, i) => (f >= snap + 12 + i * 8 && f < snap + 52 + i * 8 ? <Puffs key={i} frame={f - snap - 12 - i * 8 + 60} x={LADDER.x1 + 20} y={LADDER.base - i * LADDER.step - 20} color={alpha("#FFF4DE", 0.6)} period={60} size={12} rise={0.4} drift={0.8} life={34} seed={i + 3} /> : null))}
        <GroundShadow x={1060} y={FLOOR + 3} rx={ppm * 0.42} color={S.shadow} opacity={0.3} blur={8} />
        <Tick x={1060} y={FLOOR} pxPerM={ppm} frame={f} facing={-1} pose="heave" poseTo="hips" poseT={Math.min(1.7, Math.max(0, (f - snap) / 14))} expression="determined" expressionTo="proud" expressionT={ramp(f, snap + 10, snap + 20)} look={0.6} />
      </Room>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------

export const SceneL01: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL01(t);
  const shots: ShotDef<CL01>[] = [
    { from: 0, S: ShotRoom, id: "1-01" },
    { from: c.rope, S: ShotRope, id: "1-04" },
    { from: c.faster, S: ShotFaster, id: "1-05" },
    { from: c.lens, S: ShotLens, id: "1-06" },
    { from: c.decades, S: ShotDecades, id: "1-07" },
    { from: c.beside, S: ShotFiveBillion, id: "1-08" },
    { from: c.ruler, S: ShotRuler, id: "1-09" },
    { from: c.count, S: ShotCount, id: "1-10" },
    { from: c.fold, S: ShotFold, id: "1-11" },
    { from: c.ladder, S: ShotLadder, id: "1-12" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL01 = (t: SceneTiming): Cue[] => {
  const c = cuesL01(t);
  const foldLen = c.ladder - c.fold;
  return [
    // 1-01: two footsteps, the sit; 1-02 soft swirl as the air shows; 1-03 chime on the line
    { at: 20, file: SFX.click, vol: 0.08, dur: 10 },
    { at: 46, file: SFX.click, vol: 0.08, dur: 10 },
    { at: c.air, file: SFX.swirl, vol: 0.16, dur: 50 },
    { at: c.flat + 26, file: SFX.chime, vol: 0.2, dur: 60 },
    // 1-04 / 1-05
    ...cutHit(c.rope),
    { at: c.rope + 2, file: SFX.pop, vol: 0.18, dur: 20 },
    ...cutHit(c.faster),
    { at: c.faster, file: SFX.swirl, vol: 0.18, dur: 50 },
    { at: c.faster + 30, file: SFX.swirl, vol: 0.14, dur: 50 },
    // 1-06 / 1-07: into the lens, a click per decade
    ...cutHit(c.lens),
    { at: c.decades - 14, file: SFX.swirl, vol: 0.18, dur: 50 },
    ...Array.from({ length: 9 }, (_, i) => ({ at: c.decades + 4 + i * 6, file: SFX.click, vol: 0.08, dur: 8 })),
    // 1-08: snap out
    { at: c.beside, file: SFX.deepWhoosh, vol: 0.24, dur: 50 },
    { at: c.beside + 12, file: SFX.pop, vol: 0.2, dur: 20 },
    // 1-09 / 1-10
    ...cutHit(c.ruler),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.ruler + 6 + i * 9, file: SFX.click, vol: 0.06, dur: 8 })),
    ...cutHit(c.count),
    { at: c.count + Math.round((c.fold - c.count) * 0.55) + 6, file: SFX.pop, vol: 0.2, dur: 20 },
    // 1-11: a swirl per fold; 1-12: a pop per rung
    ...cutHit(c.fold),
    ...[0.12, 0.42, 0.72].map((q) => ({ at: c.fold + Math.round(q * foldLen), file: SFX.swirl, vol: 0.14, dur: 40 })),
    ...[0, 1, 2, 3].map((i) => ({ at: c.ladder + 26 + i * 8, file: SFX.pop, vol: 0.16, dur: 16 })),
  ];
};
