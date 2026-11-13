// L15 scene "closer" (storyboard §3 "Closer", script lines 72-75, STUDIO_SET → petrol → void, then the kit EndCard E-01).
// Shot components (hard cuts; PUSH rows are phases): Z-01 (studio ruler with the three jump markers; the camera climbs to
// Eustace's) · Z-02 (one trace crosses the SOUND line once) · Z-03 (OUR MODEL: the taller trace from the 100 km line, the
// same ending) · Z-04 (the camera climbs to the station; the probe floats beside it) · Z-05 (the pair loops round the
// limb; 7.67 km/s) · Z-06+Z-07 (the ruler slides away; the SPEED dial alone in the dark; the needle runs off the scale and
// pins; OFF THE SCALE slams; 3-s hold) · E-01 (kit EndCard on the void/dusk dark field, orbit rings behind).
// Numbers drawn, each with its sources.md row: 7.67 km/s (#18). The jump markers carry names only (#4 #7 #8: no heights
// on screen here); "about three times as fast" is written in words (#22: 2.79, "almost three times"), with the OUR MODEL
// chip (F5). Ruler tick numbers are the ruler's scale.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, EndCard, Family, Headline, IF2, Kicker, Layer, Motes, Pill, Sky, Stage, Stars, Tick, alpha, cameraAt, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf, pillFill, skyFamily } from "../families";
import { BOUNDARY, JUMPS, MODEL, ORBIT, modelSpeedAt } from "../jumpdata";
import { SpeedGauge } from "../L15Gauges";
import { OrbitRings } from "../L15Card";
import { AltRuler, Limb, RulerFlag } from "../sky";
import { Probe, Stamp, Station, Trace } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, CREAM, INK, ModelChip, OrbitStars, Pop, RollMetric, Rings, STUDIO, SkyView, StudioSet, clamp01, ez, lin, view, vy } from "./c-parts";

/** Frames after the last line for the 20-s end card (EndCard from the kit). */
export const closerTail = 600;

export const cuesCloser = (t: SceneTiming) => {
  const { at, p, frac } = cueKit(t);
  return {
    honest: 0, // Z-01
    once: p(0, "you'd pass"), // Z-02
    onceWord: p(0, "once"),
    taller: at(1), // Z-03
    times: p(1, "about three times"),
    same: p(1, "the same ending"),
    letgo: p(1, "And if you let go"), // Z-04
    circle: at(2), // Z-05
    dial: at(3), // Z-06
    lose: p(3, "a speed you have to lose first"),
    pin: frac(3, 0.78), // Z-07 (phase)
    card: t.frames, // E-01
    end: t.frames + closerTail,
  };
};
export type CCloser = ReturnType<typeof cuesCloser>;

const V = familyOf("void");
const VT = skyFamily(400).theme;
/** the end card's dark field (void → dusk) */
const CARD: Family = { ...familyOf("dusk"), sky: ["#04051A", "#0B1040", "#13215E", "#1E6678"] };

// ===============================================================================================================
// Z-01 · STUDIO_SET: a tall painted ruler on the cyc with three small jump markers (names only), the 100 km line and the
// station far above; Tick plants the flag at the base; the camera climbs to Eustace's marker. MOVER: the camera climbing
// the ruler (ticks ≈ 15 px/f) + CycClouds + the flag swaying.
// ===============================================================================================================
const MARKERS: RulerFlag[] = [
  { altKm: JUMPS.kittinger.exitM / 1000, label: "Kittinger", color: C.teal }, // #7 (position only)
  { altKm: JUMPS.baumgartner.exitKm, label: "Baumgartner", color: C.saffronDeep }, // #4
  { altKm: JUMPS.eustace.exitM / 1000, label: "Eustace", color: C.limb }, // #8
  { altKm: BOUNDARY.fai, label: "Kármán line", color: C.saffron }, // #1
];
const ShotHonest: ShotFC<CCloser> = ({ f, len }) => {
  const altC = 4 + (JUMPS.eustace.exitKm - 4) * ez(f, 8, len - 4);
  const v = view(altC, 44);
  const gy = vy(v, 0);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} shotFrame={f} drift={{ zoom: 1.02, panX: 0.004, frames: 200, seed: 2 }} vignette={0.16} grain={0.6}>
        <StudioSet f={f} seed={33} floor={2000} />
        <Layer depth={1}>
          <rect x={-400} y={gy} width={2720} height={1400} fill={STUDIO.mid} />
          <rect x={-400} y={gy} width={2720} height={12} fill={alpha(STUDIO.near, 0.7)} />
          <rect x={560} y={-400} width={36} height={gy + 400} fill={alpha(CREAM, 0.35)} />
          <AltRuler f={f} altTop={v.altTop} altBottom={v.altBottom} x={600} y={v.y} h={v.h} flags={MARKERS} color={INK} step={5} />
          <Tick x={480} y={gy} pxPerM={130} frame={f} facing={1} pose="hold" staff expression="neutral" look={0.7} headTilt={10} />
        </Layer>
        <Layer depth={0.15}>
          <Station x={1620} y={160} size={140} f={f} />
        </Layer>
        <Layer depth={0}>
          <Kicker x={120} y={110} text="the honest answer" color={INK} size={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-02 · STUDIO_SET: a speed-vs-time trace climbs, crosses the SOUND line once, peaks and bends back down under it; the
// line pulses; ONCE on the crossing. MOVER: the trace head (≈ 14 px/f) + the SOUND line pulsing + a flash ring.
// ===============================================================================================================
const ShotOnce: ShotFC<CCloser> = ({ f, len, c }) => {
  const x0 = 360;
  const x1 = 1640;
  const yBase = 800;
  const ySound = 470;
  const pts: Pt[] = Array.from({ length: 61 }, (_, i) => {
    const u = i / 60;
    const rise = Math.sin(Math.min(1, u / 0.42) * Math.PI * 0.5);
    const fall = u > 0.42 ? Math.exp(-(u - 0.42) / 0.16) : 1;
    const sp = rise * (0.32 + 0.68 * fall);
    return [x0 + u * (x1 - x0), yBase - sp * 470];
  });
  const h = lin(f, 4, len - 8);
  // the crossing (up): first point above the line
  const ci = pts.findIndex((p) => p[1] < ySound);
  const crossed = h * 60 >= ci;
  const cf = Math.round(4 + ((len - 12) * ci) / 60);
  const pulse = 0.6 + 0.4 * Math.sin(f / 4);
  const cam = cameraAt(f, [
    { f: 0, x: 860, y: 560, zoom: 1.15 },
    { f: len, x: 1060, y: 540, zoom: 1.08 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.16} grain={0.6}>
        <StudioSet f={f + 200} seed={35} floor={930} />
        <Layer depth={1}>
          <rect x={x0 - 60} y={200} width={x1 - x0 + 120} height={680} rx={26} fill={alpha(STUDIO.shadow, 0.82)} />
          <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke={CREAM} strokeWidth={4} />
          <line x1={x0} y1={ySound} x2={x1} y2={ySound} stroke={C.limb} strokeWidth={5 + 3 * pulse} strokeDasharray="18 12" opacity={0.6 + 0.4 * pulse} />
          <text x={x1} y={ySound - 18} textAnchor="end" style={{ fontFamily: IF2.label, fontSize: 26, letterSpacing: 4, fill: C.limb }}>
            SOUND
          </text>
          <Trace pts={pts} head={h} f={f} color={C.saffron} width={9} />
          {crossed ? <Rings f={f - cf} cx={pts[ci][0]} cy={ySound} every={18} speed={5} maxR={160} color={C.saffronCore} width={5} /> : null}
          {crossed ? <circle cx={pts[ci][0]} cy={ySound} r={12} fill={C.saffronCore} /> : null}
        </Layer>
        <Layer depth={0}>
          <g opacity={crossed ? ez(f, cf, cf + 8) : 0}>
            <Pill x={140} y={130} text="once" fill={pillFill(STUDIO)} color={CREAM} dot={C.saffron} size={36} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-03 · petrol: speed (up) against height falling (left = high): the record trace from Eustace's height, a small hump;
// then the taller trace from the 100 km line, about three times as fast at its peak; both settle on the same plateau.
// Tick sketches the taller one, happy. MOVER: two trace heads (≈ 16 and 24 px/f) + motes.
// ===============================================================================================================
const HX = (km: number) => 300 + ((100 - km) / 100) * 1300; // left = 100 km, right = ground
const SY = (mps: number) => 860 - (mps / 1100) * 600;
const tallPts: Pt[] = Array.from({ length: 51 }, (_, i) => {
  const a = 100 - i * 2;
  return [HX(a), SY(modelSpeedAt(a))];
});
const shortPts: Pt[] = (() => {
  const top = JUMPS.eustace.exitKm;
  const peak = JUMPS.eustace.topKmh / 3.6; // #8 shape only (no figure drawn)
  const out: Pt[] = [];
  for (let a = top; a >= 0; a -= 1) {
    const u = (top - a) / top;
    const hump = peak * Math.sin(Math.min(1, u / 0.22) * Math.PI * 0.5) * (1 - Math.max(0, u - 0.22) * 0.6);
    const w = clamp01((a - 4) / 14); // blend onto the model's lower branch: the same ending
    out.push([HX(a), SY(hump * w + Math.min(hump, modelSpeedAt(a)) * (1 - w))]);
  }
  return out;
})();
const ShotTaller: ShotFC<CCloser> = ({ f, len, c }) => {
  const P = familyOf("petrol");
  const hs = lin(f, 4, 60);
  const ht = lin(f, 30, len - 30);
  const sf = c.taller + f;
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.008, frames: 200, seed: 5 }} vignette={0.28} grain={0.5}>
        <Layer depth={0.1}>
          <Sky stops={["#071C24", "#0A3C4C", "#11707A"]} />
        </Layer>
        <Layer depth={1}>
          <line x1={HX(100)} y1={SY(0) + 20} x2={HX(0) + 40} y2={SY(0) + 20} stroke={CREAM} strokeWidth={4} />
          <line x1={HX(100)} y1={SY(0) + 20} x2={HX(100)} y2={200} stroke={CREAM} strokeWidth={4} />
          <line x1={HX(BOUNDARY.fai)} y1={SY(0) + 30} x2={HX(BOUNDARY.fai)} y2={SY(0) + 60} stroke={C.saffron} strokeWidth={6} />
          <Trace pts={shortPts} head={hs} f={f} color={C.limb} width={8} />
          <Trace pts={tallPts} head={ht} f={f} color={C.saffronCore} width={9} />
          {ht >= 1 ? <Rings f={f - (len - 30)} cx={HX(0)} cy={SY(MODEL.ground)} every={18} speed={4} maxR={140} color={C.saffronCore} width={5} /> : null}
          <Tick x={1810} y={960} pxPerM={100} frame={f} facing={-1} pose="point" expression="happy" look={0.6} />
          <Motes frame={f} n={22} x={0} y={0} w={1920} h={1080} color={alpha(CREAM, 0.7)} seed={17} size={3} drift={40} />
        </Layer>
        <Layer depth={0}>
          <ModelChip x={1520} y={110} f={f} />
          <g opacity={ez(sf, c.times - 4, c.times + 8)}>
            <Pill x={120} y={130} text="about three times as fast" fill={pillFill(P)} color={C.saffronCore} dot={C.saffron} size={30} />
          </g>
          <g opacity={ez(sf, c.same - 4, c.same + 8)}>
            <Pill x={1060} y={980} text="the same ending" fill={pillFill(P)} color={CREAM} dot={C.limb} size={30} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-04 · the camera climbs from the desert (Tick far below, looking up) to the station at 400 km; the probe floats beside
// it; the two glide together. MOVER: the camera climbing (≈ 26 px/f: ruler, bands, stars) + the pair gliding (10 px/f).
// ===============================================================================================================
const ShotLetGo: ShotFC<CCloser> = ({ f, len }) => {
  const altC = 12 + (ORBIT.drawKm - 12) * ez(f, 0, len - 6);
  const v = view(altC, 7.2);
  const sy = vy(v, ORBIT.drawKm);
  const sx = 700 + f * 10;
  return (
    <Pop f={f}>
      <Stage theme={skyFamily(Math.min(altC, 100)).theme} shotFrame={f} drift={{ zoom: 1.02, panX: 0.004, frames: 200, seed: 7 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <SkyView f={f} v={v} rulerX={200} bands={0.8} aurora={0.7} drift={0.5} />
          <Tick x={760} y={vy(v, 0)} pxPerM={40} frame={f} facing={1} pose="stand" expression="surprised" look={1} headTilt={24} />
          <Station x={sx} y={sy} size={240} f={f} />
          <Probe x={sx + 110} y={sy + 120} size={70} f={f} variant="float" tilt={90} lamp={false} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-05 · an inclined orbit round a small globe (an ellipse: the back half behind the planet, the front half in front);
// the loop draws, the pair rides it; the counter rolls to 7.67 km/s; near the end the loop sinks a little (the air).
// MOVER: the loop's drawing head (≈ 22 px/f) + the pair orbiting + the counter.
// ===============================================================================================================
const ShotCircle: ShotFC<CCloser> = ({ f, len }) => {
  const cx = 640;
  const cy = 580;
  const R = 250;
  const sink = 1 - 0.06 * ez(f, len - 70, len);
  const rx = 520 * sink;
  const ry = 150 * sink;
  const tilt = -14;
  const T = (deg: number): Pt => {
    const a = (deg * Math.PI) / 180;
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    const t = (tilt * Math.PI) / 180;
    return [cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)];
  };
  const d = Math.min(360, f * 3.8) + (f > 95 ? (f - 95) * 3.2 : 0);
  const drawnTo = Math.min(360, d);
  const back: Pt[] = [];
  const front: Pt[] = [];
  for (let k = 0; k <= drawnTo; k += 4) (Math.sin((k * Math.PI) / 180) < 0 ? back : front).push(T(k));
  const [px, py] = T(d % 360);
  const inFront = Math.sin(((d % 360) * Math.PI) / 180) >= 0;
  const pair = <PairSmall f={f} x={px} y={py} />;
  return (
    <Pop f={f}>
      <Stage theme={VT} shotFrame={f} drift={{ zoom: 1.04, panX: 0.006, frames: 200, seed: 9 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <OrbitStars f={f} speed={1.5} seed={43} />
        </Layer>
        <Layer depth={1}>
          <Trace pts={arcSeg(T, 180, 360)} head={1} f={f} color={alpha(C.limb, 0.25)} width={3} dashed />
          {back.length > 1 ? <Trace pts={back} head={1} f={f} color={alpha(C.saffron, 0.7)} width={6} /> : null}
          {!inFront ? pair : null}
          <Bloom x={cx} y={cy} r={R * 1.5} color={C.limb} strength={0.22} />
          <Limb f={f} cx={cx} cy={cy - R} R={R} slide={3} w={R * 2.4} />
          <Trace pts={arcSeg(T, 0, 180)} head={1} f={f} color={alpha(C.limb, 0.25)} width={3} dashed />
          {front.length > 1 ? <Trace pts={front} head={1} f={f} color={C.saffron} width={7} /> : null}
          {inFront ? pair : null}
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, 4, 12)}>
            <RollMetric x={1220} y={330} value={ORBIT.v400 /* #18 */} decimals={2} k={ez(f, 4, 70)} unit="km/s" size={110} color={CREAM} slab={alpha("#04051A", 0.55)} who="Z-05 v400" />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};
const arcSeg = (T: (d: number) => Pt, d0: number, d1: number): Pt[] => Array.from({ length: 46 }, (_, i) => T(d0 + ((d1 - d0) * i) / 45));
const PairSmall: React.FC<{ f: number; x: number; y: number }> = ({ f, x, y }) => (
  <g>
    <Station x={x} y={y} size={110} f={f} tilt={0} />
    <Probe x={x + 30} y={y + 46} size={34} f={f} variant="float" tilt={90} lamp={false} />
  </g>
);

// ===============================================================================================================
// Z-06 + Z-07 · void: the ruler slides down and away (30 px/f), leaving the SPEED dial alone on the dark; its needle
// climbs with no end in sight, then (Z-07) runs off the scale and pins, rattling; rings flare from the stop; OFF THE SCALE
// slams across the dial; Tick small at the dial's foot, flag raised high; 3-s hold into the end card. MOVER: the ruler
// sliding off, the needle climbing, then the rattle (±5° at 10 Hz on a 290-px needle) + rings flaring (6 px/f) + the stamp.
// ===============================================================================================================
const DX = 1000;
const DY = 150;
const DS = 2.2;
const ShotDial: ShotFC<CCloser> = ({ f, len, c }) => {
  const pinAt = c.pin - c.dial;
  const slide = Math.max(0, f - 4) * 30;
  const climb = ez(f, 20, pinAt);
  const pinned = f >= pinAt;
  const value = pinned ? 1 : 1.0 * climb;
  const stamp = f - (pinAt + 18);
  const stopA = (180 + (1 / 1.15) * 180) * (Math.PI / 180);
  const stx = DX + DS * (180 + Math.cos(stopA) * 128);
  const sty = DY + DS * (218 + Math.sin(stopA) * 128);
  const v = view(60, 9);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1 },
    { f: pinAt, x: 1080, y: 520, zoom: 1.08 },
    { f: len, x: 1120, y: 510, zoom: 1.14 },
  ]);
  return (
    <Stage theme={VT} cam={cam} vignette={0.32} grain={0.5}>
      <Layer depth={0.2}>
        <Sky stops={["#04051A", "#070A2E", "#0B1040"]} />
        <Stars frame={f} n={110} w={1920} h={1080} color={C.starTeal} seed={47} size={2.2} twinkle={0.7} />
        <Stars frame={f} n={50} w={1920} h={1080} color={C.starGold} seed={53} size={2.6} twinkle={0.7} />
      </Layer>
      <Layer depth={1}>
        {slide < 1600 ? (
          <g transform={`translate(0 ${slide})`} opacity={1 - ez(f, 30, 54)}>
            <AltRuler f={f} altTop={v.altTop} altBottom={v.altBottom} x={260} y={v.y} h={v.h} flags color={C.bone} />
          </g>
        ) : null}
        {pinned ? <Bloom x={stx} y={sty} r={220 + Math.sin(f / 3) * 30} color={C.vermilion} strength={0.55} /> : null}
        {pinned ? <Rings f={f - pinAt} cx={stx} cy={sty} every={12} speed={6} maxR={300} color={C.vermilion} width={6} /> : null}
        <SpeedGauge x={DX} y={DY} s={{ value, pinned }} f={f} family={V} scale={DS} theme="light" />
        <Tick x={DX - 70} y={DY + 300 * DS + 90} pxPerM={60} frame={f} facing={-1} pose="cheer" staff expression="proud" look={0.8} />
        {stamp >= 0 ? <Stamp x={DX + 396} y={DY + 330} text="off the scale" age={stamp} size={62} rotate={-9} /> : null}
      </Layer>
      <Layer depth={0}>
        <g opacity={ez(f, 34, 48)}>
          <Headline x={120} y={480} lines={["A speed you have", "to lose first"]} size={84} color={CREAM} accent={C.saffron} />
        </g>
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// E-01 · the kit EndCard on the void → dusk dark field; orbit rings rise behind the wordmark; the right half stays clear
// for the end-screen tiles. MOVER: the rings (4.4 px/f) + stars.
// ===============================================================================================================
const EndCardShot: React.FC<{ f: number; len: number }> = ({ f, len }) => (
  <AbsoluteFill>
    <Stage theme={CARD.theme} drift={false} vignette={0.3} grain={0.4}>
      <Layer depth={0.05}>
        <Sky stops={CARD.sky} />
        <Stars frame={f} n={80} w={1920} h={760} color={C.starTeal} seed={21} size={1.9} twinkle={0.7} />
        <Stars frame={f} n={30} w={1920} h={760} color={C.starGold} seed={23} size={2.2} twinkle={0.7} />
      </Layer>
      <Layer depth={1}>
        <g opacity={ez(f, 0, 20)}>
          <OrbitRings f={f + 200} cx={420} cy={1180} />
        </g>
        <Motes frame={f} n={20} x={60} y={80} w={1800} h={900} color={alpha(C.limb, 0.8)} seed={9} size={3} drift={40} />
      </Layer>
      <Layer depth={0}>
        <EndCard t={Math.min(1, f / Math.max(1, len))} family={{ ...CARD, text: CREAM, dim: "#A9C8E6" }} />
      </Layer>
    </Stage>
    <AbsoluteFill style={{ background: "#04051A", opacity: 1 - Math.min(1, f / 16) }} />
  </AbsoluteFill>
);

// ===============================================================================================================

export const SceneCloser: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCloser(t);
  if (f >= c.card) return <EndCardShot f={f - c.card} len={c.end - c.card} />;
  const shots: ShotDef<CCloser>[] = [
    { from: 0, S: ShotHonest, id: "Z-01" },
    { from: c.once, S: ShotOnce, id: "Z-02" },
    { from: c.taller, S: ShotTaller, id: "Z-03" },
    { from: c.letgo, S: ShotLetGo, id: "Z-04" },
    { from: c.circle, S: ShotCircle, id: "Z-05" },
    { from: c.dial, S: ShotDial, id: "Z-06" }, // + Z-07 (PUSH)
  ];
  return playShots(f, shots, c, c.card);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCloser = (t: SceneTiming): Cue[] => {
  const c = cuesCloser(t);
  return [
    { at: 14, file: SFX.chime, vol: 0.14, dur: 60 },
    ...cutHit(c.once),
    { at: c.onceWord, file: SFX.pop, vol: 0.18, dur: 14 },
    ...cutHit(c.taller),
    { at: c.taller + 4, file: SFX.swirl, vol: 0.16, dur: 50 },
    ...cutHit(c.letgo),
    { at: c.letgo + 2, file: SFX.riser, vol: 0.14, dur: 70, fadeIn: 6, fadeOut: 16 },
    ...cutHit(c.circle),
    ...Array.from({ length: 8 }, (_, i) => ({ at: c.circle + 6 + i * 6, file: SFX.click, vol: 0.07, dur: 6 })),
    { at: c.circle + 72, file: SFX.chime, vol: 0.14, dur: 60 },
    ...cutHit(c.dial),
    { at: c.dial + 6, file: SFX.riser, vol: 0.16, dur: 80, fadeIn: 10, fadeOut: 16 },
    { at: c.pin, file: SFX.boom, vol: 0.34, dur: 150, fadeOut: 50 },
    { at: c.pin + 18, file: SFX.popLong, vol: 0.22, dur: 30 },
  ];
};
