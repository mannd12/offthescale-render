// L15 scene "l07" (storyboard §3 "7 · From orbit height", script lines 55-64, void orbit; 7-10/7-11/7-13 STUDIO_SET
// plates; 7-16 dusk). F9: the orbit is a SPEED, not a height: 7-05…7-09 show the probe travelling sideways with the
// station; the straight fall from the station appears only in 7-04 (the "drop from rest" counter-example).
// Shot components (hard cuts; SLIDE rows are phases): 7-01+7-02 (the camera climbs the ruler to the station; the
// 370-460 km band wipes) · 7-03 (the station laps the globe; 90 min, 16 a day) · 7-04+7-04b (the drop from rest: 2.33
// km/s at the 100 km line) · 7-05 (KEY ART l15-key-3: nothing up there is at rest) · 7-06 (the sideways arrow: 17,500
// mph) · 7-07 (7.67 km/s) · 7-08 (falling around the Earth) · 7-09 (≈ 90 % of ground gravity) · 7-10 (two needles,
// 3.3×) · 7-11 (two bars) · 7-12 (7.84 km/s at the 100 km line) · 7-13 (≈ 28,000 km/h, ≈ 21×) · 7-14 (OUR MODEL: the
// height-only curve, ≈ 2.5 km/s at ≈ 48 km) · 7-15 (air drag, then a burn) · 7-16 (dusk: the balloon to 40 km) · 7-17
// (a lap of the planet) · 7-18 (the slow spiral) · 7-19 (off the scale).
// Numbers drawn, each with its sources.md row: 370 – 460 km, ≈ 90 min, 16 a day, 17,500 mph, ≈ 90 % (#16) · 2.33 km/s
// (#19) · 100 km (#1) · 7.67, 7.84 km/s (#18) · 3.3× (#19) · ≈ 28,000 km/h, ≈ 21× (#18) · ≈ 2.5 km/s, ≈ 48 km (#20, OUR
// MODEL chip). The SPEED dial in orbit runs to a stop at 8 km/s with no scale numbers (drawing only). The COLD gauge is not
// shown above 100 km (the thermosphere's temperature is not a sourced figure, storyboard §5 row 10).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, IF2, Kicker, Layer, Pill, Stage, Streamers, Tick, alpha, cameraAt, mixHex, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf, pillFill, skyFamily } from "../families";
import { BOUNDARY, JUMPS, MODEL, ORBIT } from "../jumpdata";
import { L15GaugesHUD, SpeedGauge } from "../L15Gauges";
import { AltRuler, Limb } from "../sky";
import { Balloon, Flame, Probe, Station, Trace } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Arrow, Bar, C, CREAM, INK, Ledge, ModelChip, OrbitStars, Pop, RollMetric, Rings, STUDIO, SkyView, StudioSet, clamp01, ez, lin, view, vy } from "./c-parts";

export const cuesL07 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    climb: 0, // 7-01
    between: p(0, "Between"), // 7-02 (phase)
    lap: p(0, "It circles"), // 7-03
    sixteen: p(0, "sixteen times"),
    drop: at(1), // 7-04
    reached: p(1, "by the time"), // 7-04b (phase)
    rest: at(2), // 7-05
    moves: p(2, "The station moves"), // 7-06
    arith: p(2, "By our arithmetic"), // 7-07
    around: at(3), // 7-08
    gravity: p(3, "Gravity there"), // 7-09
    needles: at(4), // 7-10
    against: p(4, "Seven point six seven against"), // 7-11
    orbit100: at(5), // 7-12
    kmh: p(5, "That is about"), // 7-13
    twentyone: p(5, "twenty-one times"),
    curve: at(6), // 7-14
    air: at(7), // 7-15
    burn: p(7, "needs rocket burns"),
    cheap: p(7, "The height is the cheap part"), // 7-16
    loop: at(8), // 7-17
    spiral: p(8, "The station's own"), // 7-18
    off: at(9), // 7-19
    end: t.frames,
  };
};
export type C07 = ReturnType<typeof cuesL07>;

const V = familyOf("void");
const VT = skyFamily(400).theme;
/** the SPEED dial's stop in orbit shots (km/s, drawing only: no scale numbers) */
const STOP = 8;
const sv = (kms: number) => kms / STOP;

/** Orbit-scene cluster: SPEED (+ AIR, empty up here) only; no COLD above 100 km. */
const OrbitCluster: React.FC<{ f: number; value: number; pinned?: boolean; readout?: number; roll?: number; ghost?: number }> = ({ f, value, pinned, readout, roll, ghost }) => (
  <L15GaugesHUD
    family={skyFamily(400)}
    frame={f}
    only={["speed", "air"]}
    speed={{ value, pinned, readout: readout ?? null, roll, unit: "km/s", ghost }}
    air={{ value: 0 }}
    stdTag={false}
  />
);

/** A point on a circle (deg, 0 = right, clockwise on screen). */
const onC = (cx: number, cy: number, r: number, deg: number): Pt => [cx + Math.cos((deg * Math.PI) / 180) * r, cy + Math.sin((deg * Math.PI) / 180) * r];
const arcPts = (cx: number, cy: number, r: number, d0: number, d1: number, n = 60): Pt[] => Array.from({ length: n + 1 }, (_, i) => onC(cx, cy, r, d0 + ((d1 - d0) * i) / n));

/** The whole globe (the Limb drawn as a small planet): rim, city glow, sliding hatch. */
const Globe: React.FC<{ f: number; cx: number; cy: number; R: number; slide?: number }> = ({ f, cx, cy, R, slide = 3 }) => (
  <g>
    <Bloom x={cx} y={cy} r={R * 1.5} color={C.limb} strength={0.22} />
    <Limb f={f} cx={cx} cy={cy - R} R={R} slide={slide} w={R * 2.4} />
  </g>
);

// ===============================================================================================================
// 7-01 + 7-02 · void: the camera climbs the ruler from the 100 km line to the station at 400 km (the limb stays at the
// bottom); Tick tiny on the limb, amazed; on "Between" the camera eases back and the 370-460 km band wipes up with the
// station inside it, gliding sideways. MOVER: the climb (≈ 28 px/f), then the band wipe (≈ 15 px/f) + the station
// gliding (3 px/f) + the dotted arrow's dashes.
// ===============================================================================================================
const ShotClimb: ShotFC<C07> = ({ f, c }) => {
  const b = c.between - c.climb;
  const climb = ez(f, 4, b - 6);
  const altC = 100 + (ORBIT.drawKm - 100) * climb + 30 * ez(f, b, b + 40);
  const pk = 15 - 10 * ez(f, b - 10, b + 30);
  const v = view(altC, pk);
  const sx = 960 + f * 3;
  const sy = vy(v, ORBIT.drawKm);
  const wipe = ez(f, b + 6, b + 36);
  return (
    <Pop f={f}>
      <Stage theme={VT} shotFrame={f} drift={{ zoom: 1.03, panX: 0.004, frames: 260, seed: 1 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <SkyView f={f} v={v} rulerX={220} bands={0.8} aurora={0.7} drift={0.6} ground={false} band={{ from: ORBIT.issLowKm, to: ORBIT.issHighKm, wipe, color: C.limb }} />
          <Station x={sx} y={sy} size={230} f={f} />
          <Arrow x={sx + 150} y={sy} len={260 * ez(f, 30, 70)} dashed f={f} width={10} color={C.saffron} />
        </Layer>
        <Layer depth={0.3}>
          <Limb f={f} cy={960} R={2600} slide={4} />
          <Tick x={430} y={1012} pxPerM={40} frame={f} facing={1} pose="stand" poseTo="point" poseT={ez(f, 60, 80)} expression="surprised" look={1} headTilt={18} />
        </Layer>
        <Layer depth={0}>
          <Kicker x={120} y={110} text="from orbit height" color={CREAM} size={30} />
          <g opacity={wipe}>
            <Pill x={1200} y={200} text={`${ORBIT.issLowKm} – ${ORBIT.issHighKm} km` /* #16 */} fill={pillFill(V)} color={C.limb} dot={C.limb} size={32} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-03 · the orbit view: the globe, a dashed orbit ring; the station laps round it (3°/f), a clock hand sweeping one lap
// per lap; the counter rolls to 16. MOVER: the station orbiting (≈ 21 px/f) + the clock hand + the counter.
// ===============================================================================================================
const ShotLap: ShotFC<C07> = ({ f, c }) => {
  const cx = 760;
  const cy = 560;
  const r = 400;
  const a = -150 + f * 3;
  const [sx, sy] = onC(cx, cy, r, a);
  const k16 = ez(c.lap + f, c.sixteen - 6, c.sixteen + 24);
  const hand = ((a + 150) / 360) * 360 - 90;
  return (
    <Pop f={f}>
      <Stage theme={VT} shotFrame={f} drift={{ zoom: 1.04, panX: 0.006, frames: 200, seed: 3 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <OrbitStars f={f} speed={1.2} seed={5} />
        </Layer>
        <Layer depth={1}>
          <Globe f={f} cx={cx} cy={cy} R={290} />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={alpha(C.limb, 0.45)} strokeWidth={3} strokeDasharray="10 14" strokeDashoffset={-f * 2} />
          <Trace pts={arcPts(cx, cy, r, -150, a, 50)} head={1} f={f} color={C.saffron} width={5} />
          <g transform={`rotate(${a + 90} ${sx} ${sy})`}>
            <Station x={sx} y={sy} size={130} f={f} tilt={0} />
          </g>
          {/* the clock: one sweep per lap */}
          <g transform="translate(1290 640)">
            <circle r={96} fill={alpha("#04051A", 0.8)} stroke={C.limb} strokeWidth={5} />
            {Array.from({ length: 12 }, (_, i) => {
              const [x1, y1] = onC(0, 0, 80, i * 30);
              const [x2, y2] = onC(0, 0, 92, i * 30);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.bone} strokeWidth={3} />;
            })}
            <path d={`M0 0 L0 -88 A88 88 0 ${hand + 90 > 180 ? 1 : 0} 1 ${onC(0, 0, 88, hand)[0]} ${onC(0, 0, 88, hand)[1]} Z`} fill={alpha(C.saffron, 0.35)} />
            <line x1={0} y1={0} x2={onC(0, 0, 78, hand)[0]} y2={onC(0, 0, 78, hand)[1]} stroke={C.saffron} strokeWidth={7} strokeLinecap="round" />
            <circle r={9} fill={C.saffronCore} />
          </g>
        </Layer>
        <Layer depth={0}>
          <Pill x={1210} y={300} text={`≈ ${ORBIT.issMinutes} min a lap` /* #16 */} fill={pillFill(V)} color={CREAM} dot={C.saffron} size={30} />
          <g opacity={ez(c.lap + f, c.sixteen - 6, c.sixteen + 4)}>
            <RollMetric x={1230} y={420} value={ORBIT.orbitsPerDay /* #16 */} k={k16} tail="a day" size={64} color={CREAM} slab={pillFill(V)} who="7-03 laps" />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-04 + 7-04b · the drop from rest (the counter-example): the probe falls straight down from the station; the camera
// follows; the SPEED needle climbs; at "by the time" the saffron 100 km line slides up past the probe with a flash ring,
// and the needle settles at 2.33; Tick tiny on the limb looks up. MOVER: the ruler streaming (≈ 10-35 px/f) + the probe
// falling + the needle; then the line sliding up (≈ 22 px/f) + the flash ring.
// ===============================================================================================================
const ShotDrop: ShotFC<C07> = ({ f, len, c }) => {
  const b = c.reached - c.drop;
  const cross = b + 50; // the frame the probe crosses 100 km
  const u = clamp01(f / cross);
  const t2 = Math.max(0, f - cross);
  // #19: vacuum fall from rest (drawing); after the line the follow eases off (the line slides up past the probe)
  const pAlt = f <= cross ? ORBIT.drawKm - (ORBIT.drawKm - BOUNDARY.fai) * u * u : BOUNDARY.fai - 38 * (1 - Math.exp(-t2 / 20));
  const v = view(pAlt, 11.5);
  const speedK = ORBIT.fallTo100 * Math.sqrt(clamp01((ORBIT.drawKm - pAlt) / (ORBIT.drawKm - BOUNDARY.fai)));
  const probeY = 540;
  const lineK = ez(f, b - 4, b + 10);
  return (
    <Pop f={f}>
      <Stage theme={VT} shotFrame={f} drift={{ zoom: 1.03, panX: 0.004, frames: 260, seed: 5 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <SkyView f={f} v={v} rulerX={220} bands={0.8} aurora={0.8} drift={0.6} ground={false} streak={Math.min(40, speedK * 16)} pins={[{ altKm: BOUNDARY.fai, label: "", draw: lineK, len: 1500 }]} />
          <Station x={980} y={vy(v, ORBIT.drawKm) - 70} size={220} f={f} />
          <Probe x={820} y={probeY} size={130} f={f} trail={Math.min(160, f * 3)} />
          {f >= cross ? <Rings f={f - cross} cx={820} cy={vy(v, BOUNDARY.fai)} once speed={10} maxR={420} color={C.saffronCore} width={7} /> : null}
          {f >= cross ? <Rings f={f - cross - 10} cx={820} cy={vy(v, BOUNDARY.fai)} once speed={10} maxR={420} color={C.saffron} width={4} /> : null}
        </Layer>
        <Layer depth={0.3}>
          <g opacity={ez(f, b - 10, b + 10)}>
            <Limb f={f} cy={990} R={2600} slide={9} />
            <Tick x={420} y={1042} pxPerM={34} frame={f} facing={1} pose="stand" expression="surprised" look={1} headTilt={22} />
          </g>
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, 8, 18)}>
            <RollMetric x={960} y={200} value={ORBIT.fallTo100 /* #19 */} decimals={2} k={speedK / ORBIT.fallTo100} unit="km/s" size={88} color={CREAM} slab={alpha("#04051A", 0.55)} who="7-04 fall" />
          </g>
          {f < b ? <Pill x={980} y={300} text="the height alone" fill={pillFill(V)} color={CREAM} dot={C.saffron} size={30} /> : null}
          {f >= cross - 4 ? <Pill x={980} y={300} text={`${BOUNDARY.fai} km line` /* #1 */} fill={pillFill(V)} color={C.saffronCore} dot={C.saffron} size={30} /> : null}
        </Layer>
        <OrbitCluster f={f} value={sv(speedK)} />
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-05 · KEY ART (l15-key-3): the probe is let go beside the station and does not drop: the pair travels sideways together
// along the arc above the limb (the camera tracks them, the stars pass), a dotted arrow ahead. MOVER: stars passing
// (12 px/f) + the limb sliding (8 px/f) + the pair's own drift (2 px/f) and the release.
// ===============================================================================================================
const Pair: React.FC<{ f: number; x: number; y: number; s?: number; sep?: number; tilt?: number }> = ({ f, x, y, s = 1, sep = 1, tilt = -4 }) => (
  <g>
    <Station x={x} y={y} size={300 * s} f={f} tilt={tilt} />
    <Probe x={x + 40 * s + 50 * sep * s} y={y + 150 * s + 40 * sep * s} size={90 * s} f={f} variant="float" tilt={90} lamp={false} />
  </g>
);

const ShotRest: ShotFC<C07> = ({ f }) => {
  const x = 640 + f * 2;
  const y = 420 + Math.sin(f / 40) * 6;
  const sep = ez(f, 6, 40);
  return (
    <Pop f={f}>
      <Stage theme={VT} shotFrame={f} drift={{ zoom: 1.04, panX: 0.006, frames: 240, seed: 7 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <OrbitStars f={f} speed={12} seed={7} streak={10} />
        </Layer>
        <Layer depth={1}>
          <Limb f={f} cy={820} R={2600} slide={8} />
          <Bloom x={960} y={840} r={900} color={C.limb} strength={0.16} squash={0.25} />
          <Pair f={f} x={x} y={y} sep={sep} />
          <Arrow x={x + 260} y={y + 40} len={300} dashed f={f} width={10} color={C.saffron} />
        </Layer>
        <Layer depth={0}>
          <Pill x={120} y={120} text="nothing up there is at rest" fill={pillFill(V)} color={CREAM} dot={C.saffron} size={32} />
        </Layer>
        <OrbitCluster f={f} value={sv(ORBIT.v400)} />
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-06 · the sideways arrow grows from the pair (0 → 520 px in 60 f) and the readout rolls to 17,500 mph. MOVER: the
// arrow growing (≈ 9 px/f) + the counter + stars passing (10 px/f).
// ===============================================================================================================
const ShotArrow: ShotFC<C07> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1 },
    { f: len, x: 1010, y: 540, zoom: 1.1 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VT} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <OrbitStars f={f} speed={10} seed={9} streak={14} />
        </Layer>
        <Layer depth={1}>
          <Limb f={f} cy={900} R={2600} slide={8} />
          <Pair f={f} x={440} y={520} s={0.8} />
          <Arrow x={640} y={560} len={540 * ez(f, 4, 64)} width={22} color={C.saffron} glow />
        </Layer>
        <Layer depth={0}>
          <RollMetric x={700} y={380} value={ORBIT.issMph /* #16 */} k={ez(f, 4, 60)} unit="mph" size={96} color={CREAM} who="7-06 mph" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-07 · close: the conversion: the small 17,500 mph above, a turning arrow glyph, the counter rolling to 7.67 km/s;
// Tick chalks it, proud. MOVER: the counter + the glyph spinning (8°/f) + stars passing.
// ===============================================================================================================
const ShotConvert: ShotFC<C07> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={VT} shotFrame={f} drift={{ zoom: 1.06, panX: 0.006, frames: 120, seed: 9 }} vignette={0.3} grain={0.5}>
      <Layer depth={0.2}>
        <OrbitStars f={f} speed={10} seed={13} streak={14} />
      </Layer>
      <Layer depth={1}>
        <text x={560} y={330} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 52, fill: alpha(CREAM, 0.55) }}>
          {ORBIT.issMph.toLocaleString("en-US") /* #16 */}
          <tspan dx={10} style={{ fontSize: 24, fontWeight: 600 }}>
            mph
          </tspan>
        </text>
        <g transform={`translate(470 470) rotate(${f * 8})`}>
          <path d="M-46 0 A46 46 0 1 1 0 46" fill="none" stroke={C.saffron} strokeWidth={10} strokeLinecap="round" />
          <path d="M0 30 L0 62 L-26 46 Z" fill={C.saffron} />
        </g>
        <Ledge x={1300} y={820} />
        <Tick x={1300} y={820} pxPerM={90} frame={f} facing={-1} pose="point" expression="proud" look={0.3} />
      </Layer>
      <Layer depth={0}>
        <RollMetric x={560} y={520} value={ORBIT.v400 /* #18 */} decimals={2} k={ez(f, 2, 40)} unit="km/s" size={120} color={C.saffronCore} who="7-07 v400" />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 7-08 · the probe's path draws as a curve bending round the planet (a big globe below), the probe and station riding the
// drawing head together. MOVER: the path's drawing head + the pair sliding along it (≈ 13 px/f) + the limb sliding.
// ===============================================================================================================
const ShotAround: ShotFC<C07> = ({ f, len }) => {
  const cx = 960;
  const cy = 1420;
  const R = 760;
  const r = 960;
  const a0 = -162;
  const a1 = -18;
  const h = lin(f, 0, len - 10);
  const a = a0 + (a1 - a0) * h;
  const [x, y] = onC(cx, cy, r, a);
  return (
    <Pop f={f}>
      <Stage theme={VT} shotFrame={f} drift={{ zoom: 1.03, panX: 0.004, frames: 240, seed: 11 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <OrbitStars f={f} speed={2} seed={17} />
        </Layer>
        <Layer depth={1}>
          <Globe f={f} cx={cx} cy={cy} R={R} slide={6} />
          <Trace pts={arcPts(cx, cy, r, a0, a1, 80)} head={h} f={f} color={C.saffron} width={7} ghost={0.25} />
          <g transform={`rotate(${a + 90} ${x} ${y})`}>
            <Pair f={f} x={x - 30} y={y - 90} s={0.55} tilt={0} />
          </g>
        </Layer>
        <Layer depth={0}>
          <Pill x={120} y={120} text="falling around the earth" fill={pillFill(V)} color={CREAM} dot={C.saffron} size={32} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-09 · the probe large, gliding sideways (the camera tracks; stars and the limb pass); a long down-arrow on it pulses
// and keeps its length (F8: gravity is not zero). MOVER: stars passing (12 px/f) + the limb sliding + the arrow pulsing.
// ===============================================================================================================
const ShotGravity: ShotFC<C07> = ({ f }) => {
  const x = 860 + f * 1.5;
  const y = 380;
  const pulse = 1 + 0.06 * Math.sin(f / 4);
  return (
    <Pop f={f}>
      <Stage theme={VT} shotFrame={f} drift={{ zoom: 1.04, panX: 0.006, frames: 200, seed: 13 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <OrbitStars f={f} speed={12} seed={19} streak={12} />
        </Layer>
        <Layer depth={1}>
          <Limb f={f} cy={860} R={2600} slide={10} />
          <Probe x={x} y={y} size={200} f={f} variant="float" tilt={90} lamp={false} />
          <Arrow x={x} y={y + 90} len={300 * pulse} angle={90} width={22} color={C.saffron} glow />
          <Arrow x={x + 130} y={y} len={240} dashed f={f} width={10} color={alpha(C.limb, 0.9)} />
        </Layer>
        <Layer depth={0}>
          <Pill x={120} y={120} text={`≈ ${ORBIT.gravityIss} % of ground gravity` /* #16 */} fill={pillFill(V)} color={CREAM} dot={C.saffron} size={32} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-10 · STUDIO_SET dial plate: the SPEED dial alone, large; the short needle (ghost) sweeps to 2.33 (THE HEIGHT), the
// far needle to 7.67 (THE ORBIT); a saffron arc-bracket draws between them; 3.3× rolls; Tick lays the bracket on.
// MOVER: two needles sweeping (≈ 3°/f, staggered) + the bracket drawing + the push.
// ===============================================================================================================
const DIAL = { x: 300, y: 130, s: 2.3 }; // gauge-local centre (180, 218), r 128, 180° sweep to 1.15 of the stop
const dialPt = (val: number, rr: number): Pt => {
  const a = ((180 + (Math.min(val, 1.15) / 1.15) * 180) * Math.PI) / 180;
  return [DIAL.x + DIAL.s * (180 + Math.cos(a) * rr), DIAL.y + DIAL.s * (218 + Math.sin(a) * rr)];
};
const ShotNeedles: ShotFC<C07> = ({ f, len }) => {
  const gk = ez(f, 6, 22);
  const nk = ez(f, 26, 74);
  const gv = sv(ORBIT.fallTo100) * gk;
  const nv = sv(ORBIT.v400) * nk;
  const bk = ez(f, 76, 106);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1 },
    { f: len, x: 900, y: 520, zoom: 1.1 },
  ]);
  const arc: Pt[] = Array.from({ length: 41 }, (_, i) => dialPt(sv(ORBIT.fallTo100) + ((sv(ORBIT.v400) - sv(ORBIT.fallTo100)) * i) / 40, 160));
  const [hx, hy] = dialPt(gv, 150);
  const [ox, oy] = dialPt(nv, 150);
  const tag = (x: number, y: number, t: string, o: number, anchor: "start" | "end") => (
    <text x={x} y={y} textAnchor={anchor} opacity={o} style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 4, fill: INK }}>
      {t}
    </text>
  );
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.16} grain={0.6}>
        <StudioSet f={f + 300} seed={27} />
        <Layer depth={1}>
          <SpeedGauge x={DIAL.x} y={DIAL.y} s={{ value: nv, ghost: gv }} f={f} family={STUDIO} scale={DIAL.s} />
          {tag(hx - 30, hy - 30, "THE HEIGHT", gk, "end")}
          {tag(ox + 30, oy - 20, "THE ORBIT", nk, "start")}
          <Trace pts={arc} head={bk} f={f} color={C.saffron} width={9} smooth />
          <Tick x={1560} y={880} pxPerM={150} frame={f} facing={-1} pose="hold" poseTo="point" poseT={ez(f, 70, 90)} expression="proud" look={0.4} />
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, 96, 106)}>
            <RollMetric x={1260} y={360} value={ORBIT.ratio /* #19 */} decimals={1} k={ez(f, 96, 124)} unit="×" size={130} color={CREAM} slab={pillFill(STUDIO)} who="7-10 ratio" />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-11 · STUDIO_SET: two bars, THE ORBIT and THE HEIGHT, grow side by side with their counters. MOVER: bars growing
// (24 px/f) + counters + the push.
// ===============================================================================================================
const ShotBars2: ShotFC<C07> = ({ f, len }) => {
  const x0 = 420;
  const scale = 1000 / ORBIT.v400;
  const oL = ORBIT.v400 * scale * lin(f, 4, 46);
  const hL = ORBIT.fallTo100 * scale * lin(f, 4, 17);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1 },
    { f: len, x: 990, y: 540, zoom: 1.08 },
  ]);
  const lab = (y: number, t: string) => (
    <text x={x0} y={y} style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 4, fill: INK }}>
      {t}
    </text>
  );
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.16} grain={0.6}>
        <StudioSet f={f + 700} seed={29} />
        <Layer depth={1}>
          {lab(380, "THE ORBIT")}
          <Bar x={x0} y={450} len={oL} h={90} color={C.saffron} />
          {lab(600, "THE HEIGHT")}
          <Bar x={x0} y={670} len={hL} h={90} color={C.teal} />
          <RollMetric x={x0 + oL + 40} y={474} value={ORBIT.v400 /* #18 */} decimals={2} k={lin(f, 4, 46)} unit="km/s" size={56} color={INK} who="7-11 orbit" />
          <RollMetric x={x0 + hL + 40} y={694} value={ORBIT.fallTo100 /* #19 */} decimals={2} k={lin(f, 4, 17)} unit="km/s" size={56} color={INK} who="7-11 height" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-12 · the probe on the saffron 100 km line (drawn as an arc just above the limb); a big sideways arrow grows (0 → 700
// px in 70 f) and the counter rolls to 7.84 km/s. MOVER: the arrow growing (10 px/f) + the counter + stars + limb.
// ===============================================================================================================
const ShotOrbit100: ShotFC<C07> = ({ f }) => {
  const R = 2600;
  const cy = 760;
  const lineR = R + 60;
  const lineCy = cy + R; // centre
  const yAt = (x: number) => lineCy - Math.sqrt(lineR * lineR - (x - 960) * (x - 960));
  const x = 420;
  const y = yAt(x);
  return (
    <Pop f={f}>
      <Stage theme={VT} shotFrame={f} drift={{ zoom: 1.04, panX: 0.006, frames: 200, seed: 15 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <OrbitStars f={f} speed={5} seed={23} />
        </Layer>
        <Layer depth={1}>
          <Limb f={f} cy={cy} R={R} slide={8} />
          <circle cx={960} cy={lineCy} r={lineR} fill="none" stroke={C.saffron} strokeWidth={5} strokeDasharray="22 14" strokeDashoffset={-f * 3} />
          <Probe x={x} y={y - 40} size={110} f={f} variant="float" tilt={90} lamp={false} />
          <Arrow x={x + 80} y={y - 40} len={720 * ez(f, 6, 76)} angle={-2} width={24} color={C.saffron} glow />
        </Layer>
        <Layer depth={0}>
          <RollMetric x={700} y={300} value={ORBIT.v100 /* #18 */} decimals={2} k={ez(f, 6, 70)} unit="km/s" size={110} color={CREAM} who="7-12 v100" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-13 · STUDIO_SET bar plate: Baumgartner's best is a stub; the orbit bar runs off the frame (30 px/f) with chevrons
// marching along it; ≈ 28,000 km/h and ≈ 21×; Tick tiny beside the stub, amazed. MOVER: the bars growing (30 vs 6 px/f),
// then the chevrons marching (12 px/f) + the pull back.
// ===============================================================================================================
const ShotBars3: ShotFC<C07> = ({ f, len, c }) => {
  const x0 = 300;
  const stub = 110;
  const unit = stub / JUMPS.baumgartner.topKmh;
  const sL = stub * lin(f, 2, 20);
  const oL = Math.min(ORBIT.kmh * unit, f * 30);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.05 },
    { f: len, x: 1020, y: 540, zoom: 0.9 },
  ]);
  const k21 = ez(c.kmh + f, c.twentyone - 4, c.twentyone + 16);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.16} grain={0.6}>
        <StudioSet f={f + 1100} seed={31} />
        <Layer depth={1}>
          <text x={x0} y={430} style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 4, fill: INK }}>
            ORBIT SPEED
          </text>
          <Bar x={x0} y={500} len={oL} h={90} color={C.saffron} />
          {Array.from({ length: 12 }, (_, i) => {
            const cx = x0 + 40 + ((((i * 180 + f * 12) % 2160) + 2160) % 2160);
            return cx < x0 + oL - 30 ? <path key={i} d={`M${cx} 474 L${cx + 26} 500 L${cx} 526 L${cx - 10} 526 L${cx + 16} 500 L${cx - 10} 474 Z`} fill={C.saffronCore} opacity={0.85} /> : null;
          })}
          <text x={x0} y={650} style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 4, fill: INK }}>
            BAUMGARTNER
          </text>
          <Bar x={x0} y={720} len={sL} h={90} color={C.teal} />
          <Tick x={x0 + 200} y={880} pxPerM={70} frame={f} facing={-1} pose="stand" poseTo="shrug" poseT={ez(f, 40, 60)} expression="surprised" look={0.8} />
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, 20, 30)}>
            <RollMetric x={700} y={300} pre="≈ " value={ORBIT.kmh /* #18 */} k={ez(f, 20, 70)} unit="km/h" size={64} color={CREAM} slab={pillFill(STUDIO)} who="7-13 kmh" />
          </g>
          <g opacity={k21}>
            <RollMetric x={560} y={760} pre="≈ " value={ORBIT.timesBaumgartner /* #18 */} k={k21} unit="×" size={64} color={CREAM} slab={pillFill(STUDIO)} who="7-13 times" />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-14 · OUR MODEL: the ruler 0-420 km; the height-only curve from rest at 400 km draws down beside it (speed to the
// right), the peak tick lands at 48 km; the camera tilts down with it. MOVER: the drawing head (≈ 14 px/f) + the peak
// tick popping + the tilt.
// ===============================================================================================================
const ShotCurve: ShotFC<C07> = ({ f, len }) => {
  const pk = 2.15;
  const v = view(210, pk);
  const rx = 300;
  const X = (kms: number) => rx + 60 + kms * 380;
  const pts: Pt[] = [];
  for (let a = 400; a >= 0; a -= 4) {
    const s = a >= MODEL.from400PeakKm ? MODEL.from400PeakKms * Math.sqrt((400 - a) / (400 - MODEL.from400PeakKm)) : MODEL.from400PeakKms * Math.pow(a / MODEL.from400PeakKm, 1.6) + 0.086;
    pts.push([X(s), vy(v, a)]);
  }
  const peakIdx = Math.round((400 - MODEL.from400PeakKm) / 4);
  const h = lin(f, 6, 150);
  const peakOn = h >= peakIdx / (pts.length - 1) + 0.02;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 330, zoom: 1.25 },
    { f: 150, x: 960, y: 640, zoom: 1.2 },
    { f: len, x: 960, y: 620, zoom: 1.15 },
  ]);
  const [pxk, pyk] = [X(MODEL.from400PeakKms), vy(v, MODEL.from400PeakKm)];
  return (
    <Pop f={f}>
      <Stage theme={VT} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <SkyView f={f} v={v} rulerX={rx} bands={0.8} aurora={0.6} drift={3} pins={[{ altKm: MODEL.from400PeakKm, label: "", draw: peakOn ? 1 : 0, len: 1400 }]} />
          <Trace pts={pts} head={h} f={f} color={C.saffronCore} width={8} peak={peakIdx} />
          {peakOn ? <Rings f={f - Math.round(6 + 144 * (peakIdx / (pts.length - 1)))} cx={pxk} cy={pyk} every={16} speed={5} maxR={200} color={C.saffronCore} width={5} /> : null}
        </Layer>
        <Layer depth={0}>
          <ModelChip x={1520} y={110} f={f} />
          <g opacity={peakOn ? 1 : 0}>
            <Pill x={1100} y={300} text={`≈ ${MODEL.from400PeakKms} km/s peak` /* #20 */} fill={pillFill(V)} color={C.saffronCore} dot={C.saffron} size={32} />
            <Pill x={1100} y={380} text={`≈ ${MODEL.from400PeakKm} km` /* #20 */} fill={pillFill(V)} color={CREAM} dot={C.saffron} size={32} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-15 · the station large; air streaks (thin drag) stream past it; it dips below the dotted old-height line; a thruster
// flame lights and lifts it back. MOVER: the station dipping (2 px/f), the flame growing (20 px/f) and the lift, air
// streaks streaming (14 px/f), stars passing.
// ===============================================================================================================
const ShotBurn: ShotFC<C07> = ({ f }) => {
  const oldY = 420;
  const dip = 110 * ez(f, 6, 62) - 110 * ez(f, 92, 140);
  const on = ez(f, 76, 90) * (1 - ez(f, 150, 166));
  return (
    <Pop f={f}>
      <Stage theme={VT} shotFrame={f} drift={{ zoom: 1.04, panX: 0.006, frames: 200, seed: 17 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <OrbitStars f={f} speed={7} seed={29} />
        </Layer>
        <Layer depth={1}>
          <Limb f={f} cy={900} R={2600} slide={8} />
          <line x1={-100} y1={oldY} x2={2020} y2={oldY} stroke={C.limb} strokeWidth={4} strokeDasharray="6 16" strokeDashoffset={f * 3} opacity={0.8} />
          <Streamers f={f} n={14} x0={-200} x1={2100} y0={oldY - 160 + dip} y1={oldY + 160 + dip} len={180} width={4} speed={14} color={alpha(C.cloud, 0.8)} opacity={0.5} dir={-1} seed={5} />
          <Station x={900} y={oldY + dip} size={460} f={f} tilt={-3} />
          <Flame x={900 - 250} y={oldY + dip + 10} angle={180 + 12} len={260} f={f} on={on} />
        </Layer>
        <Layer depth={0}>
          <Pill x={120} y={120} text="air drag · then a burn" fill={pillFill(V)} color={CREAM} dot={C.saffron} size={32} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-16 · dusk: the ruler 0-45 km; Tick pats the balloon and it rises to the 40 km mark (10 px/f); a saffron check slams
// onto the mark. MOVER: the balloon rising + the check slam + the tilt up.
// ===============================================================================================================
const ShotBalloon: ShotFC<C07> = ({ f, len }) => {
  const D = familyOf("dusk");
  const pk = 20;
  const v = view(22, pk);
  const rise = ez(f, 14, 96);
  const alt = 0.6 + 39.4 * rise;
  const by = vy(v, alt);
  const slam = f - 98;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 700, zoom: 1.15 },
    { f: 100, x: 960, y: 420, zoom: 1.1 },
    { f: len, x: 960, y: 410, zoom: 1.12 },
  ]);
  const k = slam < 0 ? 0 : slam < 6 ? 2.4 - 1.4 * (slam / 6) ** 2 : 1;
  const mx = 300;
  const my = vy(v, 40);
  return (
    <Pop f={f}>
      <Stage theme={D.theme} cam={cam} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <rect x={-300} y={-300} width={2520} height={1680} fill={D.sky[0]} />
          <rect x={-300} y={vy(v, 12)} width={2520} height={vy(v, 0) - vy(v, 12)} fill={D.sky[1]} />
          <rect x={-300} y={vy(v, 3)} width={2520} height={vy(v, 0) - vy(v, 3)} fill={D.sky[2]} opacity={0.8} />
          <rect x={-300} y={vy(v, 0)} width={2520} height={600} fill={mixHex(C.dune3, "#1A1030", 0.35)} />
          <AltRuler f={f} altTop={v.altTop} altBottom={v.altBottom} x={mx} y={v.y} h={v.h} flags={false} step={10} />
          <Balloon x={900} y={by} size={300} f={f} variant="gondola" />
          <Tick x={760} y={vy(v, 0)} pxPerM={60} frame={f} facing={1} pose="press" poseTo="stand" poseT={ez(f, 14, 30)} expression="happy" look={0.6 + 0.3 * rise} headTilt={10} />
          {slam >= 0 ? (
            <g transform={`translate(${mx + 90} ${my}) scale(${k.toFixed(3)})`}>
              <circle r={40} fill={C.saffron} stroke={INK} strokeWidth={4} />
              <path d="M-18 0 L-4 14 L20 -14" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : null}
          {slam >= 6 ? <Rings f={slam - 6} cx={mx + 90} cy={my} once speed={10} maxR={200} color={C.saffronCore} width={5} /> : null}
        </Layer>
        <Layer depth={0}>
          <Pill x={120} y={120} text="the height is the cheap part" fill={pillFill(D)} color={CREAM} dot={C.saffron} size={32} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-17 · the probe's path closes into a full loop round the globe; the probe rides the drawing head. MOVER: the loop's
// drawing head (≈ 24 px/f) + the probe orbiting.
// ===============================================================================================================
const ShotLoop: ShotFC<C07> = ({ f, len }) => {
  const cx = 900;
  const cy = 560;
  const r = 380;
  const h = lin(f, 2, Math.min(len - 6, 100));
  const a = -90 + 360 * h + (f > 100 ? (f - 100) * 3 : 0);
  const [x, y] = onC(cx, cy, r, a);
  return (
    <Pop f={f}>
      <Stage theme={VT} shotFrame={f} drift={{ zoom: 1.04, panX: 0.006, frames: 200, seed: 19 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <OrbitStars f={f} speed={1} seed={31} />
        </Layer>
        <Layer depth={1}>
          <Globe f={f} cx={cx} cy={cy} R={280} />
          <Trace pts={arcPts(cx, cy, r, -90, -90 + 360 * h, 90)} head={h < 1 ? h : 1} f={f} color={C.saffron} width={7} />
          {h >= 1 ? <Rings f={f - 100} cx={cx} cy={cy} once speed={6} maxR={520} color={C.saffronCore} width={5} /> : null}
          <Probe x={x} y={y} size={80} f={f} variant="float" tilt={a + 180} lamp={false} />
        </Layer>
        <Layer depth={0}>
          <Pill x={120} y={120} text="a lap of the planet" fill={pillFill(V)} color={CREAM} dot={C.saffron} size={32} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-18 · a faint spiral drawn inward round the globe, almost flat; the station glides along it, drawing it brighter
// behind itself. MOVER: the station orbiting (≈ 12 px/f) + the spiral head.
// ===============================================================================================================
const ShotSpiral: ShotFC<C07> = ({ f }) => {
  const cx = 960;
  const cy = 560;
  const rAt = (deg: number) => 440 - (deg / 360) * 14;
  const full: Pt[] = Array.from({ length: 241 }, (_, i) => {
    const d = i * 3;
    return onC(cx, cy, rAt(d), d - 90);
  });
  const d = f * 1.9;
  const drawn: Pt[] = Array.from({ length: Math.max(2, Math.floor(d / 3) + 1) }, (_, i) => {
    const dd = Math.min(d, i * 3);
    return onC(cx, cy, rAt(dd), dd - 90);
  });
  const [x, y] = onC(cx, cy, rAt(d), d - 90);
  return (
    <Pop f={f}>
      <Stage theme={VT} shotFrame={f} drift={{ zoom: 1.04, panX: 0.006, frames: 200, seed: 21 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <OrbitStars f={f} speed={1} seed={37} />
        </Layer>
        <Layer depth={1}>
          <Globe f={f} cx={cx} cy={cy} R={300} />
          <Trace pts={full} head={1} f={f} color={alpha(C.limb, 0.35)} width={3} dashed />
          <Trace pts={drawn} head={0.999} f={f} color={C.saffron} width={6} />
          <g transform={`rotate(${d} ${x} ${y})`}>
            <Station x={x} y={y} size={120} f={f} tilt={0} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-19 · three tiny balloons stub their tiny height arrows against one long sideways arrow that draws across the frame
// (40 px/f) and runs off it; the SPEED needle pins and rattles, chevrons run; Tick on the limb looks along it, arms wide.
// 2-s hold. MOVER: the long arrow drawing, then chevrons marching along it (12 px/f) + the needle rattle.
// ===============================================================================================================
const ShotOffScale: ShotFC<C07> = ({ f }) => {
  const ay = 600;
  const L = Math.max(0, (f - 10) * 40);
  return (
    <Pop f={f}>
      <Stage theme={VT} shotFrame={f} drift={{ zoom: 1.04, panX: 0.004, frames: 260, seed: 23 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <OrbitStars f={f} speed={2} seed={41} />
        </Layer>
        <Layer depth={1}>
          <Limb f={f} cy={900} R={2600} slide={8} />
          {[0, 1, 2].map((i) => {
            const bx = 220 + i * 150;
            const by = 820 - i * 18;
            return (
              <g key={i}>
                <Balloon x={bx} y={by} size={110} f={f + i * 20} variant="gondola" />
                <Arrow x={bx + 26} y={by - 10} len={46 + i * 10} angle={-90} width={8} color={C.limb} />
              </g>
            );
          })}
          <Arrow x={180} y={ay} len={Math.min(L, 2300)} width={26} color={C.saffron} glow />
          {L > 600
            ? Array.from({ length: 14 }, (_, i) => {
                const cx = 200 + ((((i * 160 + f * 12) % 2240) + 2240) % 2240);
                return cx < 180 + L - 60 ? <path key={i} d={`M${cx} ${ay - 22} L${cx + 22} ${ay} L${cx} ${ay + 22} L${cx - 9} ${ay + 22} L${cx + 13} ${ay} L${cx - 9} ${ay - 22} Z`} fill={C.saffronCore} /> : null;
              })
            : null}
          <Tick x={820} y={952} pxPerM={50} frame={f} facing={1} pose="stand" poseTo="shrug" poseT={ez(f, 20, 40)} expression="surprised" look={0.8} />
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, 50, 60)}>
            <Pill x={120} y={120} text="off the scale" fill={pillFill(V)} color={C.saffronCore} dot={C.saffron} size={34} />
          </g>
        </Layer>
        <OrbitCluster f={f} value={Math.min(1, ez(f, 6, 46) * 1.0)} pinned={f > 46} />
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL07: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL07(t);
  const shots: ShotDef<C07>[] = [
    { from: 0, S: ShotClimb, id: "7-01" }, // + 7-02 (SLIDE)
    { from: c.lap, S: ShotLap, id: "7-03" },
    { from: c.drop, S: ShotDrop, id: "7-04" }, // + 7-04b (SLIDE)
    { from: c.rest, S: ShotRest, id: "7-05" },
    { from: c.moves, S: ShotArrow, id: "7-06" },
    { from: c.arith, S: ShotConvert, id: "7-07" },
    { from: c.around, S: ShotAround, id: "7-08" },
    { from: c.gravity, S: ShotGravity, id: "7-09" },
    { from: c.needles, S: ShotNeedles, id: "7-10" },
    { from: c.against, S: ShotBars2, id: "7-11" },
    { from: c.orbit100, S: ShotOrbit100, id: "7-12" },
    { from: c.kmh, S: ShotBars3, id: "7-13" },
    { from: c.curve, S: ShotCurve, id: "7-14" },
    { from: c.air, S: ShotBurn, id: "7-15" },
    { from: c.cheap, S: ShotBalloon, id: "7-16" },
    { from: c.loop, S: ShotLoop, id: "7-17" },
    { from: c.spiral, S: ShotSpiral, id: "7-18" },
    { from: c.off, S: ShotOffScale, id: "7-19" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL07 = (t: SceneTiming): Cue[] => {
  const c = cuesL07(t);
  const run = (at: number, n: number, gap = 5, vol = 0.07): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    { at: 8, file: SFX.riser, vol: 0.14, dur: 70, fadeIn: 8, fadeOut: 16 },
    { at: c.between + 8, file: SFX.pop, vol: 0.16, dur: 14 },
    ...cutHit(c.lap),
    ...run(c.sixteen - 4, 6),
    ...cutHit(c.drop),
    { at: c.drop + 4, file: SFX.whoosh, vol: 0.22, dur: 50 },
    { at: c.reached + 50, file: SFX.pop, vol: 0.18, dur: 14 },
    ...cutHit(c.rest),
    { at: c.rest + 6, file: SFX.pop, vol: 0.14, dur: 14 },
    ...cutHit(c.moves),
    ...run(c.moves + 6, 8),
    ...cutHit(c.arith),
    ...run(c.arith + 4, 6),
    { at: c.arith + 40, file: SFX.chime, vol: 0.14, dur: 60 },
    ...cutHit(c.around),
    { at: c.around + 4, file: SFX.swirl, vol: 0.16, dur: 50 },
    ...cutHit(c.gravity),
    { at: c.gravity + 4, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.needles),
    { at: c.needles + 8, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.needles + 30, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.needles + 100, file: SFX.popLong, vol: 0.18, dur: 30 },
    ...cutHit(c.against),
    ...run(c.against + 4, 8),
    ...cutHit(c.orbit100),
    { at: c.orbit100 + 4, file: SFX.riser, vol: 0.12, dur: 50, fadeOut: 12 },
    ...cutHit(c.kmh),
    { at: c.kmh + 20, file: SFX.popLong, vol: 0.18, dur: 30 },
    ...cutHit(c.curve),
    { at: c.curve + 110, file: SFX.pop, vol: 0.16, dur: 14 },
    ...cutHit(c.air),
    { at: c.air + 76, file: SFX.whoosh, vol: 0.2, dur: 50 },
    { at: c.air + 80, file: SFX.popLong, vol: 0.14, dur: 30 },
    ...cutHit(c.cheap),
    { at: c.cheap + 98, file: SFX.pop, vol: 0.2, dur: 14 },
    ...cutHit(c.loop),
    { at: c.loop + 4, file: SFX.swirl, vol: 0.16, dur: 50 },
    ...cutHit(c.spiral),
    { at: c.spiral + 4, file: SFX.click, vol: 0.1, dur: 8 },
    ...cutHit(c.off),
    { at: c.off + 46, file: SFX.boom, vol: 0.3, dur: 120, fadeOut: 40 },
  ];
};
