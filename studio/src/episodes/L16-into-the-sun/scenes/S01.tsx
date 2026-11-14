// L16 scene "l01" · The wrong way round (storyboard §3 scene 1: 1-01…1-18, script lines 7-15; space bird's-eye ↔ studio
// plates ↔ a corona-dusk launch). Shot components (hard cuts only; PUSH/SLIDE rows are phases of one component):
//   1-01 (+1-02, 1-03)  the solar system circling (NOT TO SCALE), the push to Earth, its speed (29.8 km/s, ABOUT)
//   1-04                the probe riding Earth with the matching arrow (67,000 mph, NASA)
//   1-05                aim at the Sun and miss: the drawn line vs the probe swinging round
//   1-06 (+1-07, 1-08)  the two sum dials (+12.3 / −29.8 km/s, OUR SUM), then the bars on the studio plate (MORE THAN TWICE)
//   1-09                the OUR SUM stamp slams across both dials
//   1-10                the rocket lifting off a dusk pad
//   1-11 (+1-12, 1-13)  the tape to 42.1 km/s, Earth's gold head start, then it slides off (no head start for falling in)
//   1-14                chips paid into SIDEWAYS SPEED, the needle stepping down
//   1-15 (+1-16)        stop Earth: the straight drop (ABOUT 65 DAYS), then 616 km/s just short of the ESCAPE mark
//   1-17 (+1-18)        the 149.6 million km straight line, crossed out; the looping spiral drawn inward
// Numbers drawn (all READ.*, sources rows in sundata.ts): 29.8 km/s #2 · 67,000 mph #3 · +12.3 / −29.8 / 42.1 km/s #4 (OUR SUM) ·
// ABOUT 65 DAYS #5 (OUR SUM) · 616 km/s #5 #15 (OUR SUM; the ESCAPE mark has no numeral) · 149.6 million km #1.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Layer, Sky, Stage, Tick, alpha, cameraAt, impact, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { READ } from "../sundata";
import { WindStreaks } from "../movers16";
import { AboutPill, OurSumPill, PillFor } from "../stamps";
import { Calendar, Chips, Planet, PlanetsCircling, Probe, Rocket, Stamp, Tape } from "../props16";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  ArcArrow,
  Arrow,
  C,
  CORONA,
  ClipBox,
  DrawnPath,
  Label,
  Ledge,
  PillA,
  Plate,
  Pop,
  SPACE,
  STUDIO,
  Slab,
  SpaceField,
  SpeedBar,
  Strike,
  StudioRoom,
  SumDial,
  SunDisc,
  ez,
  lerp,
  lin,
  path1,
  rollText,
} from "./a-parts";

const D2R = Math.PI / 180;

// ================================================================================================================
// cues (scene-local line indices: line 0 here is script line 7)
// ================================================================================================================
export const cuesL01 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    s01: 0,
    s02: p(0, "But Earth isn't"), // phase
    s03: at(1), // phase
    s04: at(2),
    s05: p(2, "Aim straight"),
    s06: at(3),
    s07: p(3, "To fall in"), // phase
    s08: p(3, "Dropping in"), // phase
    s09: at(4),
    s10: p(4, "That's why NASA"),
    s11: at(5),
    s12: p(5, "Earth already"), // phase
    s13: p(5, "There's no such"), // phase
    s14: at(6),
    s15: at(7),
    s16: p(7, "You'd arrive"), // phase
    s17: at(8),
    s18: p(8, "isn't how anyone"), // phase
    end: t.frames,
  };
};
export type CL01 = ReturnType<typeof cuesL01>;

// bird's-eye geometry (NOT TO SCALE): the Sun left of centre, five orbits; Earth on the third
const SUN = { x: 560, y: 540, r: 150 };
const ORB = [250, 345, 450, 575, 730];
const SPD = [3.5, 2.6, 1.9, 1.3, 0.9]; // °/f → 15, 16, 15, 13, 11 px/f along the orbits
const PH = [40, 200, 130, 300, 250];
const KINDS = ["mercury", "venus", "earth", "mars", "venus"] as const;
const RAD = [9, 14, 16, 12, 24];
const earthAt = (f: number): Pt => {
  const th = (PH[2] + f * SPD[2]) * D2R;
  return [SUN.x + Math.cos(th) * ORB[2], SUN.y + Math.sin(th) * ORB[2]];
};

// ================================================================================================================
// 1-01 + 1-02 + 1-03 · the solar system from above: five planets circling, wind off the Sun, NOT TO SCALE; then the push
// to Earth with a fat arrow sweeping along its orbit; then the close view with speed streaks and the counter to 29.8.
// MOVER: planets circling 11-16 px/f + wind 14 px/f; the push + arrow growing 25 px/f; streaks 20 px/f + the counter.
// ================================================================================================================
const ShotSystem: ShotFC<CL01> = ({ f, len, c }) => {
  const T2 = c.s02 - c.s01;
  const T3 = c.s03 - c.s01;
  const g = f - T2;
  const h = f - T3;
  const k = ez(g, 0, T3 - T2);
  const [ex, ey] = earthAt(f);
  const cam = { x: lerp(960, ex, k), y: lerp(540, ey, k), zoom: Math.exp(Math.log(2.4) * k) };
  const thE = PH[2] + f * SPD[2];
  const sweep = Math.min(75, Math.max(0, g - 4) * ((25 / ORB[2]) / D2R));
  const x3 = ez(h, -8, 4);
  const roll = ez(h, 6, 70);
  return (
    <AbsoluteFill>
      <Stage theme={SPACE.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.15}>
          <SpaceField f={f} seed={21} n={110} />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={f} cx={SUN.x} cy={SUN.y} r0={SUN.r + 20} rMax={1500} a0={-180} a1={180} speed={14} count={70} len={110} width={6} seed={21} opacity={0.55} />
          <SunDisc x={SUN.x} y={SUN.y} r={SUN.r} f={f} />
          <PlanetsCircling cx={SUN.x} cy={SUN.y} f={f} planets={ORB.map((a, i) => ({ kind: KINDS[i], a, r: RAD[i], speed: SPD[i], phase: PH[i] }))} ring={alpha(C.lavender, 0.4)} />
          {g > 0 ? <ArcArrow cx={SUN.x} cy={SUN.y} r={ORB[2]} a0={thE + 3} sweep={sweep} width={14} color={C.gold} /> : null}
          <Bloom x={ex} y={ey} r={50} color={C.stampBlue} strength={0.6} />
        </Layer>
        <Layer depth={0}>
          <g opacity={1 - ez(g, 0, 14)}>
            <PillA x={120} y={110} text="not to scale" F={SPACE} dot={C.gold} size={26} />
            <Ledge x={120} y={1000} w={200} />
            <Tick x={220} y={1000} pxPerM={90} frame={f} facing={1} pose="shrug" expression="happy" look={0.6} />
          </g>
        </Layer>
      </Stage>
      {x3 > 0 ? (
        <AbsoluteFill style={{ opacity: x3 }}>
          <Stage theme={SPACE.theme} cam={{ x: 960, y: 540, zoom: 1.08 - 0.06 * ez(h, 0, len - T3) }} vignette={0.3} grain={0.5}>
            <Layer depth={0.3}>
              <SpaceField f={f} seed={22} n={110} stream={10} angle={180} />
            </Layer>
            <Layer depth={1}>
              <WindStreaks f={f} mode="sweep" angle={180} box={{ x: -200, y: 300, w: 2320, h: 520 }} speed={20} count={40} len={190} width={9} seed={23} from={C.gold} to={C.whiteGold} opacity={0.8} />
              <Arrow x1={1060} y1={560} x2={1760} y2={560} width={58} color={C.gold} />
              <Planet x={1000} y={560} r={190} f={f} kind="earth" light={180} />
            </Layer>
            <Layer depth={0}>
              <Slab x={150} y={230} value={rollText(READ.earthSpeed.value!, roll, 1)} unit={READ.earthSpeed.unit} size={104} F={SPACE} check={roll >= 1} />
              <AboutPill x={150} y={320} size={24} appear={ez(h, 20, 32)} />
            </Layer>
          </Stage>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ================================================================================================================
// 1-04 · "Anything launched from Earth starts with that sideways speed": the probe rides Earth along its orbit arc with a
// matching arrow; a tag slides onto the arrow and rolls to 67,000 mph (NASA). MOVER: Earth + probe gliding 12 px/f, the
// tag sliding 20 px/f, stars.
// ================================================================================================================
const ShotRide: ShotFC<CL01> = ({ f, len }) => {
  const O = { x: 960, y: 2500, R: 1900 };
  const a = lerp(-122, -64, f / Math.max(1, len)) * D2R; // ≈ 12 px/f along the arc
  const ex = O.x + Math.cos(a) * O.R;
  const ey = O.y + Math.sin(a) * O.R;
  const tx = Math.cos(a + Math.PI / 2);
  const ty = Math.sin(a + Math.PI / 2);
  const tagX = Math.max(ex + tx * 460, 2200 - f * 20);
  const roll = ez(f, 26, 90);
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 200, seed: 3 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={24} n={110} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={960} y={1260} r={760} color={C.amber} strength={0.5} squash={0.5} />
          <circle cx={O.x} cy={O.y} r={O.R} fill="none" stroke={alpha(C.lavender, 0.5)} strokeWidth={4} strokeDasharray="14 12" strokeDashoffset={-f * 2} />
          <ArcArrow cx={O.x} cy={O.y} r={O.R} a0={a / D2R + 3} sweep={13} width={40} color={C.gold} />
          <Planet x={ex} y={ey} r={80} f={f} kind="earth" light={90} />
          <Probe x={ex - tx * 10} y={ey - 130} size={120} f={f} tilt={-90} />
        </Layer>
        <Layer depth={0}>
          <g transform={`translate(${(tagX - (ex + tx * 460)).toFixed(1)} 0)`}>
            <Slab x={1180} y={250} value={rollText(READ.probeMph.value!, roll)} unit={READ.probeMph.unit} size={96} F={SPACE} check={roll >= 1} />
            <PillFor kind={READ.probeMph.pill} x={1190} y={330} size={22} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-05 · "Aim straight at the Sun, and you miss": Tick draws a line straight at the Sun; the probe's sideways arrow swings
// it along the circle instead, round past the Sun. MOVER: the line's head ≈ 40 px/f, then the probe swinging 16 px/f.
// ================================================================================================================
const ShotMiss: ShotFC<CL01> = ({ f, len }) => {
  const S = { x: 520, y: 600, r: 160 };
  const R = 980;
  const go = Math.max(0, f - 26);
  const th = -go * (16 / R) / D2R; // degrees, counter-clockwise (up and over)
  const px = S.x + Math.cos(th * D2R) * R;
  const py = S.y + Math.sin(th * D2R) * R;
  const nTrail = Math.max(2, Math.ceil(Math.abs(th) / 3) + 1);
  const trail: Pt[] = Array.from({ length: nTrail }, (_, i) => {
    const t = (th * i) / (nTrail - 1);
    return [S.x + Math.cos(t * D2R) * R, S.y + Math.sin(t * D2R) * R];
  });
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} cam={cameraAt(f, [{ f: 0, x: 1000, y: 560, zoom: 1 }, { f: len, x: 860, y: 420, zoom: 0.9 }])} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={25} n={110} />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={f} cx={S.x} cy={S.y} r0={S.r + 20} rMax={1300} a0={-180} a1={180} speed={14} count={60} len={110} width={6} seed={25} opacity={0.5} />
          <circle cx={S.x} cy={S.y} r={R} fill="none" stroke={alpha(C.lavender, 0.35)} strokeWidth={3} strokeDasharray="10 12" />
          <SunDisc x={S.x} y={S.y} r={S.r} f={f} />
          {/* the drawn line straight at the Sun (dims once the probe has gone round) */}
          <g opacity={1 - 0.6 * ez(f, 40, 70)}>
            <Strike x1={S.x + R - 70} y1={S.y} x2={S.x + S.r + 30} y2={S.y} k={lin(f, 4, 26)} w={12} color={C.saffron} />
          </g>
          <DrawnPath pts={trail} head={1} color={C.whiteGold} width={7} />
          <Arrow x1={px + Math.sin(th * D2R) * 70} y1={py - Math.cos(th * D2R) * 70} x2={px + Math.sin(th * D2R) * 330} y2={py - Math.cos(th * D2R) * 330} width={34} color={C.gold} />
          <Probe x={px} y={py} size={110} f={f} tilt={th} trail={go > 0 ? 90 : 0} />
          <Ledge x={1490} y={960} w={240} />
          <Tick x={1600} y={960} pxPerM={100} frame={f} facing={-1} pose="point" poseTo="shrug" poseT={ez(f, 60, 80)} expression="determined" expressionTo="worried" expressionT={ez(f, 60, 74)} staff look={0.2} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-06 + 1-07 + 1-08 · the two sum dials: LEAVE THE SOLAR SYSTEM +12.3 km/s, then (slide) FALL IN −29.8 km/s, both OUR SUM;
// then (slide) the studio plate: the two as bars, two short bars end to end still shorter than the long one.
// MOVER: needle + speed lines inside the plate 16 px/f; the camera slide; the studio panel wiping in, bars growing 24 px/f.
// ================================================================================================================
const DEG = 3; // needle degrees per km/s (drawing only)
const ShotSums: ShotFC<CL01> = ({ f, len, c }) => {
  const T7 = c.s07 - c.s06;
  const T8 = c.s08 - c.s06;
  const g7 = f - T7;
  const g8 = f - T8;
  const camX = lerp(560, 1360, ez(g7, 0, 22));
  const cam = { x: camX, y: 560, zoom: 1.4 };
  const kL = ez(f, 6, 60);
  const kR = ez(g7, 10, 70);
  const wipe = ez(g8, 0, 16);
  const BAR = 34; // px per km/s on the plate
  const grow1 = lin(g8, 14, 34);
  const grow2 = lin(g8, 22, 64);
  const ghost = lin(g8, 64, 90);
  return (
    <AbsoluteFill>
      <Stage theme={SPACE.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={26} n={110} />
        </Layer>
        <Layer depth={1}>
          {[
            { x: 560, title: "leave the solar system", deg: READ.extraKick.value! * DEG * kL, dir: 0, k: kL, r: READ.extraKick, sign: "+" },
            { x: 1360, title: "fall in", deg: -READ.earthMinus.value! * DEG * kR, dir: 180, k: kR, r: READ.earthMinus, sign: "−" },
          ].map((d, i) => (
            <g key={i}>
              <Bloom x={d.x} y={560} r={420} color={i ? C.magenta : C.gold} strength={0.3} />
              <ClipBox x={d.x - 280} y={325} w={560} h={490} rx={30}>
                <rect x={d.x - 280} y={325} width={560} height={490} fill={alpha("#0B0828", 0.85)} />
                <WindStreaks f={f} mode="sweep" angle={d.dir} box={{ x: d.x - 300, y: 330, w: 600, h: 480 }} speed={16} count={22} len={120} width={7} seed={27 + i} from={i ? C.magenta : C.gold} to={C.violet} opacity={0.5} />
              </ClipBox>
              <SumDial x={d.x} y={600} r={190} deg={d.deg} f={f} title={d.title} plate="none" />
              <Slab x={d.x} y={790} align="middle" value={d.sign + rollText(d.r.value!, d.k, 1)} unit={d.r.unit} size={64} F={SPACE} check={d.k >= 1} />
            </g>
          ))}
        </Layer>
        <Layer depth={0}>
          <OurSumPill x={1500} y={110} size={26} appear={ez(f, 30, 44)} />
        </Layer>
      </Stage>
      {wipe > 0 ? (
        <AbsoluteFill style={{ transform: `translateX(${((1 - wipe) * 1920).toFixed(1)}px)` }}>
          <Stage theme={STUDIO.theme} shotFrame={Math.max(0, g8)} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 120, seed: 2 }} vignette={0.12} grain={0.5}>
            <StudioRoom f={f} seed={8}>
              <Plate x={170} y={250} w={1580} h={560}>
                <Label x={70} y={140} text="leave" size={30} />
                <Label x={70} y={350} text="fall in" size={30} />
                <SpeedBar x={260} y={130} len={READ.extraKick.value! * BAR * grow1} h={74} f={f} color={C.gold} stripe={C.amber} />
                <SpeedBar x={260} y={340} len={READ.earthMinus.value! * BAR * grow2} h={74} f={f} color={C.magenta} stripe={C.violet} speed={-18} />
                {grow1 >= 1 ? <Label x={270 + READ.extraKick.value! * BAR + 20} y={142} text={READ.extraKick.text} size={30} raw /> : null}
                {grow2 >= 1 ? <Label x={270 + READ.earthMinus.value! * BAR + 20} y={352} text={READ.earthMinus.text} size={30} raw /> : null}
                {/* two short bars end to end, still shorter than the long one (no ratio numeral, F3) */}
                {[0, 1].map((i) => {
                  const w = READ.extraKick.value! * BAR;
                  const k = lin(ghost, i * 0.4, i * 0.4 + 0.6);
                  return k > 0 ? <rect key={i} x={260 + i * w} y={430} width={w * k} height={56} rx={28} fill="none" stroke={C.gold} strokeWidth={5} strokeDasharray="16 10" strokeDashoffset={-f * 3} /> : null;
                })}
                {ghost > 0 ? <Strike x1={260} y1={520} x2={260 + READ.earthMinus.value! * BAR} y2={520} k={lin(g8, 70, 100)} w={8} color={C.saffronCore} /> : null}
              </Plate>
            </StudioRoom>
            <Layer depth={0}>
              <OurSumPill x={190} y={150} size={26} />
              <PillA x={520} y={150} text="more than twice" F={STUDIO} dot={C.gold} size={28} opacity={ez(g8, 70, 84)} />
            </Layer>
          </Stage>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ================================================================================================================
// 1-09 · "Those sums are ours": the OUR SUM stamp slams across both dials; the plates shake; Tick pats it, sly.
// MOVER: stamp slam 40 px/f + plates shaking + speed lines inside the plates 16 px/f + clouds.
// ================================================================================================================
const ShotOurs: ShotFC<CL01> = ({ f, len }) => {
  const SLAM = 10;
  const shake = f > SLAM && f < SLAM + 24 ? Math.sin((f - SLAM) * 2.2) * 6 * (1 - (f - SLAM) / 24) : 0;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 10, x: 940, y: 520, zoom: 1.07 }])} vignette={0.12} grain={0.5}>
        <StudioRoom f={f} seed={9}>
          {[
            { x: 600, deg: READ.extraKick.value! * DEG, title: "leave", dir: 0 },
            { x: 1290, deg: -READ.earthMinus.value! * DEG, title: "fall in", dir: 180 },
          ].map((d, i) => (
            <g key={i} transform={`translate(${shake * (i ? -1 : 1)} ${shake * 0.5})`}>
              <ClipBox x={d.x - 250} y={190} w={500} h={520} rx={30}>
                <rect x={d.x - 250} y={190} width={500} height={520} fill="#1E5A6E" />
                <WindStreaks f={f} mode="sweep" angle={d.dir} box={{ x: d.x - 270, y: 200, w: 540, h: 500 }} speed={16} count={20} len={110} width={7} seed={31 + i} from={i ? C.magenta : C.gold} to={C.violet} opacity={0.55} />
              </ClipBox>
              <rect x={d.x - 250} y={190} width={500} height={520} rx={30} fill="none" stroke={C.gold} strokeWidth={6} />
              <SumDial x={d.x} y={470} r={170} deg={d.deg + Math.sin(f / 7 + i) * 2} f={f} title={d.title} plate="none" />
            </g>
          ))}
          <Stamp x={945} y={470} text="our sum" age={f - SLAM} size={92} rotate={-9} color={C.saffron} />
          <Tick x={1660} y={900} pxPerM={170} frame={f} facing={-1} pose="press" poseTo="hips" poseT={ez(f, 26, 40)} expression="proud" look={0.5} squash={impact(f, SLAM, 0.1, 10)} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-10 · "NASA picked one of the most powerful rockets there is": our simplified rocket lifts off a dusk-violet pad; the
// plume lights the ground gold; the camera tilts up with it. MOVER: rocket rising 14 px/f + exhaust 24 px/f + puffs.
// ================================================================================================================
const ShotLiftoff: ShotFC<CL01> = ({ f, len }) => {
  const lift = Math.max(0, f - 14) * 14;
  const GROUND = 900;
  const camY = 540 - Math.max(0, lift - 160) * 0.75;
  const ry = GROUND - lift;
  return (
    <Pop f={f}>
      <Stage theme={CORONA.theme} cam={{ x: 960, y: camY, zoom: 1 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <Sky stops={["#070A2E", "#1B0B4F", "#5B1E8F", "#B2287A", "#F2A03A"]} x={-400} y={-2200} w={2720} h={3600} />
          <SpaceField f={f} seed={28} n={80} x={-400} y={-2400} w={2720} h={2000} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={960} y={GROUND} r={900} color={C.gold} strength={0.7 * (1 - 0.6 * ez(f, 40, len))} squash={0.35} />
          {/* exhaust streaming down from the nozzles */}
          <ClipBox x={850} y={ry} w={220} h={Math.min(1400, GROUND - ry + 40)}>
            <WindStreaks f={f} mode="sweep" angle={90} box={{ x: 880, y: ry, w: 160, h: Math.max(200, GROUND - ry) }} speed={24} count={30} len={160} width={20} seed={29} from={C.whiteGold} to={C.amber} opacity={ez(f, 4, 12)} />
          </ClipBox>
          <Rocket x={960} y={GROUND} size={520} f={f} lift={lift} plume={ez(f, 4, 12)} />
          {/* the pad and the smoke spreading along it */}
          <rect x={-400} y={GROUND} width={2720} height={900} fill="#2A0E4A" />
          <rect x={-400} y={GROUND} width={2720} height={10} fill={C.gold} opacity={0.6} />
          <rect x={820} y={GROUND - 20} width={280} height={24} rx={6} fill="#4B1C7A" stroke={C.gold} strokeWidth={3} />
          {/* smoke rolling out along the pad both ways (≈ 9 px/f), lit gold from the plume */}
          {f > 6
            ? Array.from({ length: 16 }, (_, i) => {
                const side = i % 2 ? 1 : -1;
                const u = (((f - 6) * 9 + (i >> 1) * 110) % 900) / 900;
                const r = 50 + u * 110;
                return <circle key={i} cx={960 + side * (80 + u * 900)} cy={GROUND - r * 0.55} r={r} fill={i % 3 ? "#F2C6A0" : "#FFD9A8"} opacity={0.85 * (1 - u) * ez(f, 6, 14)} />;
              })
            : null}
          <path d={`M640 ${GROUND} L640 ${GROUND - 560} L700 ${GROUND - 560} L700 ${GROUND}`} fill="none" stroke="#4B1C7A" strokeWidth={14} />
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i} x1={640} y1={GROUND - 80 - i * 70} x2={700} y2={GROUND - 120 - i * 70} stroke="#4B1C7A" strokeWidth={6} />
          ))}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-11 + 1-12 + 1-13 · "Here's the sum": the tape unrolls to 42.1 km/s (OUR SUM); Earth's 29.8 shades gold with a FREE
// HEAD START tag, Tick hops onto it; then the gold slides off, flips to −29.8 and the tag is crossed out.
// MOVER: tape 40 px/f + counter; gold fill 24 px/f + tag dropping 30 px/f + Tick's hop; gold sliding + the stroke 40 px/f.
// ================================================================================================================
const ShotTape: ShotFC<CL01> = ({ f, len, c }) => {
  const T12 = c.s12 - c.s11;
  const T13 = c.s13 - c.s11;
  const g = f - T12;
  const h = f - T13;
  const TX = 220;
  const TY = 600;
  const TL = 1300;
  const unroll = lin(f, 6, 6 + 33);
  const share = READ.earthSpeed.value! / READ.escape.value!;
  const gold = lerp(0, share, lin(g, 0, 38));
  const slide = lin(h, 0, 13);
  const roll = ez(f, 10, 46);
  const tagY = g < 0 ? -200 : Math.min(420, -200 + g * 30);
  // Tick: on the tape's far end, hops onto the gold, then back
  const hop = (a: number, b: number) => (f >= a && f <= b ? -Math.sin(((f - a) / (b - a)) * Math.PI) * 130 : 0);
  const tickX = g < 6 ? 1380 : h < 0 ? lerp(1380, 640, ez(g, 6, 30)) : lerp(640, 1380, ez(h, 0, 22));
  const tickY = TY - 24 + hop(T12 + 6, T12 + 30) + hop(T13, T13 + 22);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 10, x: 960, y: 520, zoom: 1.08 }])} vignette={0.12} grain={0.5}>
        <StudioRoom f={f} seed={10}>
          <Plate x={120} y={330} w={1680} h={460} fill="#1E5A6E" />
          <Tape x={TX} y={TY} len={TL} f={f} unroll={unroll} gold={gold * (1 - 0 * slide)} slide={slide} />
          {gold > 0.02 ? (
            <g transform={`translate(${-slide * 260} ${slide * 130})`} opacity={1 - slide * 0.4}>
              <Label x={TX + 40 + TL * gold * 0.5} y={TY + 90} text={slide > 0.5 ? READ.earthMinus.text : READ.earthSpeed.text} size={34} align="middle" raw color={C.gold} />
            </g>
          ) : null}
          <Tick x={tickX} y={tickY} pxPerM={110} frame={f} facing={g >= 0 && h < 0 ? -1 : 1} pose={g >= 0 ? "cheer" : "hold"} expression={h >= 0 ? "worried" : g >= 0 ? "happy" : "neutral"} squash={impact(f, T12 + 30, 0.14, 10)} look={0.3} />
          <g>
            <PillA x={TX + 40 + TL * share * 0.5} y={tagY} text="free head start" F={STUDIO} dot={C.gold} size={28} align="middle" opacity={g >= 0 ? 1 : 0} />
            {h >= 0 ? <Strike x1={TX + 40 + TL * share * 0.5 - 260} y1={tagY + 22} x2={TX + 40 + TL * share * 0.5 + 260} y2={tagY - 22} k={lin(h, 4, 17)} w={12} color={C.vermilion} /> : null}
          </g>
        </StudioRoom>
        <Layer depth={0}>
          <Slab x={1260} y={250} value={rollText(READ.escape.value!, roll, 1)} unit={READ.escape.unit} size={96} F={STUDIO} check={roll >= 1} />
          <OurSumPill x={1270} y={330} size={24} appear={ez(f, 30, 42)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-14 · "Every kilometre a second of sideways speed has to be paid back": gold chips stream from the probe into a slot
// marked SIDEWAYS SPEED; the dial needle steps down with each; Tick feeds them in, tired.
// MOVER: chips streaming 18 px/f (scaled up) + the needle stepping 2° per chip.
// ================================================================================================================
const ShotPayBack: ShotFC<CL01> = ({ f }) => {
  const steps = Math.floor(Math.max(0, f - 6) / 5);
  const deg = Math.max(8, READ.earthMinus.value! * DEG - steps * 2);
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.012, panY: 0, frames: 160, seed: 4 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={30} n={110} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={-200} y={540} r={700} color={C.amber} strength={0.35} />
          <Probe x={430} y={520} size={260} f={f} tilt={0} />
          <g transform="translate(560 520) scale(1.7) translate(-560 -520)">
            <Chips x0={560} y0={520} x1={860} y1={600} f={f} n={6} speed={18} />
          </g>
          <rect x={980} y={660} width={440} height={180} rx={24} fill={alpha("#0B0828", 0.85)} stroke={C.saffron} strokeWidth={5} />
          <Label x={1200} y={770} text="sideways speed" size={34} align="middle" color={C.saffronCore} />
          <SumDial x={1520} y={420} r={170} deg={deg} f={f} title="sideways speed left" />
          <Ledge x={250} y={880} w={240} />
          <Tick x={370} y={880} pxPerM={100} frame={f} facing={1} pose="carry" expression="sleepy" slump={0.5} look={0.3} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-15 + 1-16 · "If you could somehow stop that sideways motion": Earth's arrow shrinks to nothing, the calendar flips, the
// probe drops straight in from the blue dot (ABOUT 65 DAYS, OUR SUM); then the push: the streak lengthens, the counter
// rolls to 616 km/s and the needle stops just short of the (unnumbered) ESCAPE mark.
// MOVER: calendar 40 px/f + arrow shrinking 20 px/f + the probe dropping; the streak 30 px/f + counter + needle.
// ================================================================================================================
const ShotDrop: ShotFC<CL01> = ({ f, len, c }) => {
  const T16 = c.s16 - c.s15;
  const g = f - T16;
  const E: Pt = [1500, 300];
  const S = { x: 470, y: 830, r: 170 };
  const end: Pt = [S.x + 150, S.y - 110];
  const s = path1(f, [
    [0, 0],
    [24, 0],
    [T16, 0.62],
    [len, 0.96],
  ]);
  const px = lerp(E[0], end[0], s);
  const py = lerp(E[1], end[1], s);
  const arrowL = Math.max(0, 340 - Math.max(0, f - 8) * 20);
  const push = ez(g, 0, 40);
  const roll = ez(g, 10, 80);
  const deg = lerp(0, 88, ez(g, 6, 70));
  const streak = Math.min(520, 60 + Math.max(0, g) * 30);
  const ang = (Math.atan2(end[1] - E[1], end[0] - E[0]) * 180) / Math.PI;
  return (
    <AbsoluteFill>
      <Stage theme={SPACE.theme} cam={{ x: lerp(960, 900, push), y: lerp(540, 600, push), zoom: lerp(1, 1.12, push) }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={32} n={110} />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={f} cx={S.x} cy={S.y} r0={S.r + 20} rMax={1500} a0={-120} a1={30} speed={14} count={50} len={110} width={6} seed={32} opacity={0.5} />
          <SunDisc x={S.x} y={S.y} r={S.r} f={f} />
          <line x1={E[0]} y1={E[1]} x2={end[0]} y2={end[1]} stroke={alpha(C.lavender, 0.4)} strokeWidth={4} strokeDasharray="10 12" />
          <g opacity={1 - ez(g, 0, 20)}>
            <Arrow x1={E[0] + 50} y1={E[1] - 20} x2={E[0] + 50 + arrowL} y2={E[1] - 20 - arrowL * 0.3} width={30} color={C.gold} />
            <Planet x={E[0]} y={E[1]} r={46} f={0} kind="earth" light={200} />
          </g>
          {/* the probe and its lengthening streak */}
          <g transform={`translate(${px} ${py}) rotate(${ang})`}>
            <line x1={-streak} y1={0} x2={-40} y2={0} stroke={C.whiteGold} strokeWidth={10} strokeLinecap="round" opacity={0.9} />
            <line x1={-streak} y1={0} x2={-40} y2={0} stroke={C.gold} strokeWidth={34} opacity={0.22} />
          </g>
          <Probe x={px} y={py} size={110} f={f} tilt={ang + 180} />
          <g opacity={1 - ez(g, 0, 16)}>
            <Calendar x={160} y={260} w={210} f={f} flipping={7.5} />
          </g>
          <g opacity={ez(g, 0, 20)}>
            <SumDial x={1440} y={560} r={210} deg={deg} f={f} title="arrival speed" marks={[{ deg: 95, label: "escape", color: C.gold }]} />
          </g>
        </Layer>
        <Layer depth={0}>
          <g opacity={1 - ez(g, 0, 14)}>
            <PillA x={430} y={110} text={READ.dropDays.text} F={SPACE} dot={C.gold} size={30} opacity={ez(f, 10, 24)} />
          </g>
          <OurSumPill x={120} y={g < 0 ? 110 : 330} size={24} appear={ez(f, 16, 28)} />
          {g >= 6 ? <Slab x={120} y={250} value={rollText(READ.arrival.value!, roll)} unit={READ.arrival.unit} size={100} F={SPACE} check={roll >= 1} opacity={ez(g, 6, 16)} /> : null}
        </Layer>
      </Stage>
    </AbsoluteFill>
  );
};

// ================================================================================================================
// 1-17 + 1-18 · "a straight drop of 149.6 million km isn't how anyone gets there": a long dotted line from Earth to the
// Sun with the distance counter (pan along it); then the line is crossed out and a looping spiral is drawn inward.
// MOVER: dotted line's head 60 px/f + the pan; then the cross-out 40 px/f and the spiral's head + the pull-back.
// ================================================================================================================
const ShotLoop: ShotFC<CL01> = ({ f, len, c }) => {
  const T18 = c.s18 - c.s17;
  const g = f - T18;
  const S = { x: 300, y: 560, r: 170 };
  const E: Pt = [2300, 560];
  const head = lin(f, 4, 4 + 33);
  const hx = lerp(E[0] - 60, S.x + S.r + 20, head);
  const back = ez(g, 0, 50);
  const cam = {
    x: g < 0 ? Math.max(1000, Math.min(1900, hx + 260)) : lerp(1000, 1200, back),
    y: 560,
    zoom: g < 0 ? 1 : Math.exp(Math.log(0.5) * back),
  };
  const roll = ez(f, 8, 60);
  // the spiral: 2.2 turns round the Sun, radius 2000 → 230
  const turns = 2.2;
  const spiral: Pt[] = Array.from({ length: 200 }, (_, i) => {
    const u = i / 199;
    const th = Math.PI * 2 * turns * u;
    const r = lerp(E[0] - S.x, 230, Math.pow(u, 0.8));
    return [S.x + Math.cos(th) * r, S.y - Math.sin(th) * r * 0.85];
  });
  const spHead = lin(g, 16, len - T18 - 6);
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={34} n={140} x={-1800} y={-1500} w={5600} h={3600} />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={f} cx={S.x} cy={S.y} r0={S.r + 20} rMax={1600} a0={-180} a1={180} speed={14} count={60} len={120} width={7} seed={34} opacity={0.5} />
          <SunDisc x={S.x} y={S.y} r={S.r} f={f} />
          <Planet x={E[0]} y={E[1]} r={50} f={f} kind="earth" light={180} />
          <g opacity={g < 0 ? 1 : 1 - 0.55 * ez(g, 10, 30)}>
            <DrawnPath pts={[[E[0] - 60, E[1]], [S.x + S.r + 20, S.y]]} head={head} f={f} dots width={10} color={C.saffron} march={0} />
          </g>
          {g >= 0 ? <Strike x1={1500} y1={430} x2={900} y2={700} k={lin(g, 0, 16)} w={22} color={C.vermilion} /> : null}
          {g >= 0 ? <DrawnPath pts={spiral} head={spHead} f={f} width={12} color={C.gold} glow={0.8} /> : null}
        </Layer>
        <Layer depth={0}>
          <g opacity={1 - ez(g, 0, 16)}>
            <Slab x={140} y={250} value={rollText(READ.au.value!, roll, 1)} unit="million km" size={96} F={SPACE} check={roll >= 1} />
          </g>
          {g >= 0 ? (
            <g opacity={ez(g, 0, 14)}>
              <Ledge x={1560} y={1000} w={240} />
              <Tick x={1680} y={1000} pxPerM={100} frame={f} facing={-1} pose="point" staff expression="determined" look={0.3} />
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================

export const SceneL01: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL01(t);
  const shots: ShotDef<CL01>[] = [
    { from: 0, S: ShotSystem, id: "1-01" }, // + 1-02, 1-03
    { from: c.s04, S: ShotRide, id: "1-04" },
    { from: c.s05, S: ShotMiss, id: "1-05" },
    { from: c.s06, S: ShotSums, id: "1-06" }, // + 1-07, 1-08
    { from: c.s09, S: ShotOurs, id: "1-09" },
    { from: c.s10, S: ShotLiftoff, id: "1-10" },
    { from: c.s11, S: ShotTape, id: "1-11" }, // + 1-12, 1-13
    { from: c.s14, S: ShotPayBack, id: "1-14" },
    { from: c.s15, S: ShotDrop, id: "1-15" }, // + 1-16
    { from: c.s17, S: ShotLoop, id: "1-17" }, // + 1-18
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL01 = (t: SceneTiming): Cue[] => {
  const c = cuesL01(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 4, file: SFX.swirl, vol: 0.14, dur: 60 },
    { at: c.s02 + 4, file: SFX.pop, vol: 0.14, dur: 16 },
    ...run(c.s03 + 8, 6, 8),
    ...cutHit(c.s04),
    { at: c.s04 + 26, file: SFX.popLong, vol: 0.16, dur: 30 },
    ...cutHit(c.s05),
    { at: c.s05 + 26, file: SFX.whoosh, vol: 0.16, dur: 50 },
    ...cutHit(c.s06),
    ...run(c.s06 + 8, 6, 8),
    ...run(c.s07 + 12, 6, 8),
    { at: c.s08, file: SFX.whoosh, vol: 0.14, dur: 40 },
    { at: c.s08 + 34, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.s09),
    { at: c.s09 + 10, file: SFX.boom, vol: 0.3, dur: 100, fadeOut: 30 },
    ...cutHit(c.s10),
    { at: c.s10 + 4, file: SFX.rumble, vol: 0.2, dur: c.s11 - c.s10, fadeIn: 8, fadeOut: 12 },
    ...cutHit(c.s11),
    ...run(c.s11 + 10, 6, 6),
    { at: c.s12 + 20, file: SFX.popLong, vol: 0.16, dur: 30 },
    { at: c.s13 + 2, file: SFX.whoosh, vol: 0.16, dur: 40 },
    ...cutHit(c.s14),
    ...run(c.s14 + 10, 6, 15, 0.1),
    ...cutHit(c.s15),
    { at: c.s15 + 6, file: SFX.swirl, vol: 0.14, dur: 50 },
    ...run(c.s15 + 10, 8, 4, 0.06),
    { at: c.s16 + 8, file: SFX.riser, vol: 0.14, dur: 70, fadeIn: 6, fadeOut: 12 },
    ...cutHit(c.s17),
    ...run(c.s17 + 6, 6, 6),
    { at: c.s18 + 16, file: SFX.swirl, vol: 0.16, dur: 60 },
  ];
};

