// L16 scene "closer" (storyboard §3 "Closer": Z-01…Z-09, script lines 70-73, then the 20-s end card). Studio board → corona
// ride-in → shade pocket → space recap and the descent into the dark → studio stamp stack → core cutaway from outside →
// the limb glowing up → the turn away with the unnamed dark shape (F10) → the kit EndCard on a dark space field.
// Shot components (hard cuts only; PUSH/SLIDE rows are phases): Z-01 · Z-02 · Z-03 · Z-04 (+Z-05) · Z-06 · Z-07 · Z-08 ·
// Z-09 · E (end card, `closerTail` frames after the last line).
// Numbers drawn: none (Z-04's seven icons are a count of pictures, no numeral). Stamps: green only on the recap of the
// path (Z-02, F16); blue on the surface and grey on the interior and the core (Z-06, F2).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, EndCard, Kicker, Layer, Sky, Stage, Stars, Tick, alpha, cameraAt, impact, smoothPath, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { STAR_TINTS } from "../families";
import { RadiiRuler } from "../ruler";
import { WindStreaks } from "../movers16";
import { CoronaHalo, SunCutaway, SunLimb } from "../sunbody";
import { Board, Sheet, StateStamp } from "../stamps";
import { Probe, Shield } from "../props16";
import { HeatRings } from "../L16Card";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  C,
  CORE,
  CORONA,
  CREAM,
  ClipBox,
  Flag,
  INK,
  Label,
  Ledge,
  PillA,
  Plate,
  Pop,
  SHADE,
  SPACE,
  STUDIO,
  Shimmer,
  SpaceField,
  StudioRoom,
  SunDisc,
  VenusRow,
  ellipsePt,
  ez,
  lerp,
  lin,
} from "./a-parts";

/** Frames after the last line for the 20-s end card (EndCard from the kit). */
export const closerTail = 600;

// ================================================================================================================
// cues
// ================================================================================================================
export const cuesCloser = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    z01: 0,
    z02: p(0, "A probe can fly"),
    z03: p(0, "and it kept"),
    z04: at(1),
    z05: p(1, "Past that"), // phase
    z06: at(2),
    light: p(2, "seen by light"),
    waves: p(2, "by waves"),
    model: p(2, "by a model"),
    z07: p(2, "Every number"),
    z08: at(3),
    z09: p(3, "Next, we turn"),
    card: t.frames,
    end: t.frames + closerTail,
  };
};
export type CCloser = ReturnType<typeof cuesCloser>;

// ================================================================================================================
// Z-01 · "So here's the honest answer": quiet; on the board the ruler, the shield, the stamp and the probe drop into four
// pinned positions; Tick stands at the lowest point with his flag. MOVER: four sheets dropping 24 px/f (8 f stagger) +
// the board's path drawing + the flag flapping + clouds.
// ================================================================================================================
const ShotHonest: ShotFC<CCloser> = ({ f, len }) => {
  const drop = (i: number) => Math.max(0, 520 - Math.max(0, f - 4 - i * 8) * 24);
  const sheets: { x: number; y: number; title: string; body: (fr: number) => React.ReactNode }[] = [
    {
      x: 60,
      y: 60,
      title: "the ruler",
      body: () => (
        <g>
          <rect x={30} y={70} width={260} height={8} rx={4} fill={INK} />
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i} x1={30 + i * 20} y1={70} x2={30 + i * 20} y2={i % 2 ? 56 : 46} stroke={INK} strokeWidth={4} />
          ))}
        </g>
      ),
    },
    { x: 420, y: 90, title: "the shield", body: (fr) => <Shield x={150} y={80} size={110} f={fr} explode={0.4} heat={0.5} /> },
    { x: 60, y: 330, title: "the stamp", body: () => <StateStamp x={110} y={70} state="measured" size={110} rotate={-8} /> },
    { x: 420, y: 340, title: "the probe", body: (fr) => <Probe x={170} y={70} size={150} f={fr} tilt={0} /> },
  ];
  return (
    <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 10, x: 940, y: 530, zoom: 1.06 }])} vignette={0.12} grain={0.5}>
      <StudioRoom f={f} seed={21}>
        <Board x={330} y={150} w={880} h={640} f={f} path={{ pts: [[60, 600], [300, 520], [560, 470], [820, 400]], solidTo: 0.55, draw: lin(f, 30, 80) }}>
          {sheets.map((s, i) => (
            <g key={i} transform={`translate(0 ${-drop(i)})`} opacity={drop(i) > 500 ? 0 : 1}>
              <Sheet x={s.x} y={s.y} w={340} h={200} f={f} title={s.title}>
                {s.body(f)}
              </Sheet>
            </g>
          ))}
        </Board>
        <Flag x={1440} y={900} h={200} f={f} color={C.vermilion} />
        <Tick x={1340} y={900} pxPerM={170} frame={f} facing={1} pose="lean" expression="neutral" staff look={0.4} />
      </StudioRoom>
      <Layer depth={0}>
        <g opacity={ez(f, 4, 18)}>
          <Kicker x={330} y={110} text="The honest answer" color={INK} size={30} />
        </g>
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// Z-02 · "A probe can fly into the Sun's atmosphere. It has": the probe rides the ruler into the corona band; the stretch
// it covered is green, with its MEASURED stamp. MOVER: ruler ticks 14 px/f + the probe riding (≈ 16 px/f relative) +
// the limb and the halo sliding in.
// ================================================================================================================
const ShotRideIn: ShotFC<CCloser> = ({ f, len }) => {
  const RY = 640;
  const px = 1320 - f * 2;
  const limbX = -1750 + f * 6;
  return (
    <Pop f={f}>
      <Stage theme={CORONA.theme} shotFrame={f} drift={{ zoom: 1.05, panX: -0.01, panY: 0, frames: 120, seed: 3 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <Sky stops={["#1B0B4F", "#3A1270", "#5B1E8F"]} x={-400} y={-300} w={2720} h={1700} />
          <SpaceField f={f} seed={51} n={50} lift={0.35} />
        </Layer>
        <Layer depth={1}>
          <CoronaHalo f={f} cx={limbX} cy={560} R={1900} extent={760} loops={6} a0={-55} a1={55} />
          <WindStreaks f={f} cx={limbX} cy={560} r0={1910} rMax={3300} a0={-50} a1={50} speed={20} count={60} len={180} width={8} seed={52} opacity={0.75} />
          <SunLimb f={f} cx={limbX} cy={560} R={1900} granSize={80} drift={6} />
          <RadiiRuler f={f} y={RY} origin={-3000} speed={14} flags={false} />
          <line x1={px + 70} y1={RY - 70} x2={2100} y2={RY - 70} stroke={C.stampGreen} strokeWidth={14} strokeLinecap="round" />
          <line x1={px + 70} y1={RY - 70} x2={2100} y2={RY - 70} stroke={C.stampGreen} strokeWidth={40} opacity={0.3} />
          <StateStamp x={1640} y={RY - 210} state="measured" age={f - 20} size={170} rotate={-8} />
          <Probe x={px} y={RY - 70} size={130} f={f} tilt={0} trail={120} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// Z-03 · "kept its instruments at room temperature, because the corona is hot but thin": the dark pocket behind the shield
// (the Sun now at the right) with its green-glowing instruments; very few particles stream past.
// MOVER: big sparse particles streaming 20 px/f + shimmer off the shield face 12 px/f + the push.
// ================================================================================================================
const ShotThin: ShotFC<CCloser> = ({ f, len }) => {
  const PX = 760;
  const SZ = 680;
  const face = PX + SZ * 0.3; // tilt 180: the shield plane sits right of centre
  const half = SZ * 0.43;
  const lanes = [120, 230, 330, 470, 560, 650, 790, 900, 990];
  return (
    <Pop f={f}>
      <Stage theme={SHADE.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.02 }, { f: len + 10, x: 900, y: 540, zoom: 1.14 }])} vignette={0.35} grain={0.5}>
        <Layer depth={0.2}>
          <Sky family={SHADE} x={-400} y={-300} w={2720} h={1700} />
        </Layer>
        <Layer depth={1}>
          <rect x={face} y={-300} width={1800} height={1700} fill={C.amber} opacity={0.1} />
          <Bloom x={face + 60} y={540} r={520} color={C.shieldRim} strength={0.5} squash={1.6} />
          <ClipBox x={face + 10} y={540 - half} w={260} h={half * 2}>
            <Shimmer x={face + 10} y={540 - half} w={240} h={half * 2} f={f} speed={-12} n={6} color={C.gold} opacity={0.5} vertical />
          </ClipBox>
          {/* the sparse particles: few, big, fast (hot but thin); those on the shield's line stop at its face */}
          {lanes.map((y, i) => {
            const blocked = Math.abs(y - 540) < half - 20;
            const span = 2300;
            const x = 2200 - ((f * 20 + i * 263) % span);
            if (blocked && x < face + 30) return null;
            const r = 12 + (i % 3) * 5;
            return (
              <g key={i}>
                <line x1={x} y1={y} x2={x + 90} y2={y} stroke={C.shieldRim} strokeWidth={r * 0.6} strokeLinecap="round" opacity={0.5} />
                <circle cx={x} cy={y} r={r} fill={C.gold} stroke={C.whiteGold} strokeWidth={3} />
              </g>
            );
          })}
          <Probe x={PX} y={540} size={SZ} f={f} variant="cutaway" tilt={180} lamp={false} />
        </Layer>
        <Layer depth={0}>
          <PillA x={120} y={110} text="hot but thin" F={SHADE} dot={C.shieldRim} size={30} opacity={ez(f, 6, 18)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// Z-04 + Z-05 · "only after seven Venus flybys helped shed much of the speed": seven Venus icons light down the right
// edge while the orbit rings contract toward the Sun and the probe laps; then "Past that, nobody has gone": the green
// path ends, a dark empty column opens below it and the camera descends past the stage markers.
// MOVER: icons (14 f stagger) + rings contracting + the probe lapping 18 px/f; then the descent 22 px/f (markers sliding up).
// ================================================================================================================
const ShotRecap: ShotFC<CCloser> = ({ f, len, c }) => {
  const T5 = c.z05 - c.z04;
  const g = f - T5;
  const S = { x: 760, y: 470 };
  const k = lin(f, 4, 4 + 7 * 14);
  const R0 = lerp(560, 180, k);
  const t = f * (18 / Math.max(120, R0));
  const [px, py] = ellipsePt(S.x, S.y, R0, R0 * 0.62, -t);
  const down = Math.max(0, g) * 22;
  const markers = ["surface", "convection zone", "radiative zone", "core"];
  return (
    <AbsoluteFill>
      <Stage theme={SPACE.theme} cam={{ x: 960, y: 540 + down, zoom: 1 }} vignette={0.32} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={53} n={120} y={-300} h={4200} />
        </Layer>
        <Layer depth={1}>
          <SunDisc x={S.x} y={S.y} r={90} f={f} halo={0.7} />
          {[560, 460, 370, 290, 230, 200, 180].map((r, i) => (i / 6 <= k + 0.001 ? <ellipse key={i} cx={S.x} cy={S.y} rx={r} ry={r * 0.62} fill="none" stroke={alpha(C.lavender, 0.35)} strokeWidth={3} strokeDasharray="8 8" /> : null))}
          <ellipse cx={S.x} cy={S.y} rx={R0} ry={R0 * 0.62} fill="none" stroke={C.gold} strokeWidth={5} />
          <Probe x={px} y={py} size={80} f={f} tilt={0} />
          <VenusRow x={1660} y={130} n={7} gap={118} r={34} lit={Math.max(0, (f - 4) / 14)} f={f} vertical />
          {/* the green path coming down and ending; the dark column below it */}
          <line x1={760} y1={900} x2={760} y2={1180} stroke={C.stampGreen} strokeWidth={14} strokeLinecap="round" />
          <circle cx={760} cy={1180} r={20} fill={C.stampGreen} />
          <rect x={560} y={1240} width={400} height={3200} fill="#03041A" />
          <line x1={560} y1={1240} x2={560} y2={4400} stroke={alpha(C.lavender, 0.5)} strokeWidth={4} strokeDasharray="16 14" />
          <line x1={960} y1={1240} x2={960} y2={4400} stroke={alpha(C.lavender, 0.5)} strokeWidth={4} strokeDasharray="16 14" />
          {markers.map((m, i) => {
            const y = 1600 + i * 520;
            return (
              <g key={m}>
                <line x1={520} y1={y} x2={1000} y2={y} stroke={C.saffron} strokeWidth={6} />
                <Label x={1030} y={y + 10} text={m} size={34} color={C.saffronCore} />
              </g>
            );
          })}
          <Ledge x={800} y={1180} w={180} />
          <Tick x={890} y={1180} pxPerM={80} frame={f} facing={-1} pose="stand" expression="sleepy" look={-0.2} headTilt={20} />
        </Layer>
      </Stage>
    </AbsoluteFill>
  );
};

// ================================================================================================================
// Z-06 · "The surface is seen by light, the layers below it by waves, and the core by a model that neutrinos check": three
// stamps pinned down the stack (blue on the surface, grey on the interior, grey on the core), each band with its own
// moving icon (light dashes, a travelling wave, neutrino streaks). MOVER: icons 24 px/f + stamp slams + clouds.
// ================================================================================================================
const ShotStack: ShotFC<CCloser> = ({ f, len, c }) => {
  const at = [c.light - c.z06, c.waves - c.z06, c.model - c.z06];
  const bands = [
    { y: 170, fill: C.tangerine, label: "the surface", state: "afar" as const },
    { y: 400, fill: C.honey, label: "the layers below", state: "model" as const },
    { y: 630, fill: C.whiteGold, label: "the core", state: "model" as const },
  ];
  const BX = 240;
  const BW = 940;
  const BH = 190;
  const cur = at.filter((a) => f >= a - 10).length - 1;
  const tickX = 1560;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 520, zoom: 1.0 }, { f: len + 10, x: 940, y: 520, zoom: 1.07 }])} vignette={0.12} grain={0.5}>
        <StudioRoom f={f} seed={22}>
          <Plate x={BX - 40} y={130} w={BW + 380} h={730} fill="#1E5A6E" />
          {bands.map((b, i) => (
            <g key={i}>
              <ClipBox x={BX} y={b.y} w={BW} h={BH} rx={20}>
                <rect x={BX} y={b.y} width={BW} height={BH} fill={b.fill} />
                {i === 0
                  ? // light: bright dashes streaming out to the right
                    Array.from({ length: 10 }, (_, k) => {
                      const x = BX + ((f * 24 + k * 97) % (BW + 120)) - 60;
                      const yy = b.y + 40 + (k % 4) * 36;
                      return <line key={k} x1={x} y1={yy} x2={x + 70} y2={yy} stroke={C.whiteGold} strokeWidth={10} strokeLinecap="round" />;
                    })
                  : i === 1
                    ? // waves: two travelling sine lines
                      [0, 1].map((k) => {
                        const pts: Pt[] = Array.from({ length: 40 }, (_, j) => [BX + (BW * j) / 39, b.y + BH / 2 + (k ? 40 : -20) + Math.sin(j * 0.6 - f * 0.4 + k) * 34]);
                        return <path key={k} d={smoothPath(pts, 0.5)} fill="none" stroke={C.violet} strokeWidth={9} strokeLinecap="round" />;
                      })
                    : // neutrinos: thin fast cyan streaks
                      <WindStreaks f={f} mode="sweep" angle={0} box={{ x: BX - 100, y: b.y + 20, w: BW + 200, h: BH - 40 }} speed={24} count={16} len={110} width={6} seed={61} from={C.cyan} to="#1C4FA8" opacity={0.95} />}
              </ClipBox>
              <Label x={BX + 30} y={b.y + 50} text={b.label} size={30} color={INK} halo={b.fill} />
              <StateStamp x={BX + BW + 160} y={b.y + BH / 2} state={b.state} age={f - at[i]} size={170} rotate={-8 + i * 5} />
            </g>
          ))}
          <Tick x={tickX} y={900} pxPerM={150} frame={f} facing={-1} pose={cur >= 0 && f - at[Math.max(0, cur)] < 12 ? "press" : "hold"} expression="determined" look={0.2} squash={impact(f - at[Math.max(0, cur)], 0, 0.1, 8)} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// Z-07 · "Every number we gave you for those stages is our best reading from outside": the camera pulls back from the
// cutaway (true layer proportions, F6); Tick small on a ledge at the outside rim, looking in.
// MOVER: the pull-back (zoom 2.1 → 1.0) + wind streaks 20 px/f + the cutaway's textures turning.
// ================================================================================================================
const ShotOutside: ShotFC<CCloser> = ({ f, len }) => {
  const k = ez(f, 0, len);
  const zoom = Math.exp(Math.log(2.1) * (1 - k));
  const CX = 900;
  const CY = 560;
  const R = 400;
  return (
    <Pop f={f}>
      <Stage theme={CORE.theme} cam={{ x: lerp(CX - 80, 960, k), y: lerp(CY, 540, k), zoom }} vignette={0.32} grain={0.5}>
        <Layer depth={0.2}>
          <Sky stops={["#1C0F52", "#2A1466", "#4A1D78"]} x={-400} y={-300} w={2720} h={1700} />
          <Stars frame={f} n={60} x={-200} y={-100} w={2320} h={1300} color={STAR_TINTS[0]} seed={71} size={2.2} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={CX} y={CY} r={R * 2} color={C.magenta} strength={0.4} />
          <WindStreaks f={f} cx={CX} cy={CY} r0={R + 30} rMax={1700} a0={-180} a1={180} speed={20} count={70} len={150} width={8} seed={72} opacity={0.7} />
          <SunCutaway f={f} cx={CX} cy={CY} r={R} rotate={4} labels />
          <Ledge x={CX + R + 60} y={CY + 180} w={200} />
          <Tick x={CX + R + 150} y={CY + 180} pxPerM={70} frame={f} facing={-1} pose="think" expression="thinking" look={0.4} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// Z-08 · "The Sun was the hard place to reach": the ruler slides away to the right and the limb glows up from below;
// Tick salutes it, then turns. MOVER: ruler sliding 30 px/f + the limb rising 16 px/f + wind 18 px/f.
// ================================================================================================================
const ShotLimbRise: ShotFC<CCloser> = ({ f }) => {
  const cy = Math.max(2950, 3700 - f * 16);
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0, panY: 0.01, frames: 90, seed: 3 }} vignette={0.32} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={73} n={120} />
        </Layer>
        <Layer depth={1}>
          <CoronaHalo f={f} cx={960} cy={cy} R={2300} extent={520} loops={5} a0={-125} a1={-55} intensity={ez(f, 0, 40)} />
          <WindStreaks f={f} cx={960} cy={cy} r0={2310} rMax={3600} a0={-128} a1={-52} speed={18} count={60} len={170} width={8} seed={74} opacity={0.75} />
          <SunLimb f={f} cx={960} cy={cy} R={2300} granSize={80} drift={8} />
          <g transform={`translate(${f * 30} 0)`}>
            <RadiiRuler f={0} y={420} origin={-3000} flags={false} />
          </g>
          <Ledge x={820} y={560} w={200} />
          <Tick x={920} y={560} pxPerM={90} frame={f} facing={f < 44 ? 1 : -1} pose="wave" poseTo="stand" poseT={ez(f, 34, 46)} expression="proud" look={f < 44 ? -0.4 : 0.6} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// Z-09 · "Next, we turn around and go the other way": the camera turns; the limb slides off to the left; a dark, unnamed
// shape with a faint violet rim drifts into the top-right corner (F10: no label, no claim); the stars stream by.
// MOVER: the limb sliding 14 px/f + stars streaming 16 px/f + the shape drifting in.
// ================================================================================================================
const ShotTurn: ShotFC<CCloser> = ({ f, len }) => {
  const lx = 960 - f * 14;
  const sx = lerp(2650, 2080, ez(f, 10, len));
  const sy = lerp(-420, -60, ez(f, 10, len));
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.01, panY: 0, frames: 200, seed: 1 }} vignette={0.35} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={75} n={130} stream={16} angle={180} />
        </Layer>
        <Layer depth={1}>
          <CoronaHalo f={f} cx={lx} cy={2950} R={2300} extent={520} loops={5} a0={-125} a1={-55} />
          <WindStreaks f={f} cx={lx} cy={2950} r0={2310} rMax={3600} a0={-128} a1={-52} speed={18} count={50} len={170} width={8} seed={76} opacity={0.7} />
          <SunLimb f={f} cx={lx} cy={2950} R={2300} granSize={80} drift={8} />
          {/* the unnamed dark shape (F10) */}
          <circle cx={sx} cy={sy} r={560} fill="none" stroke={C.violet} strokeWidth={40} opacity={0.25} />
          <circle cx={sx} cy={sy} r={540} fill="#04031A" stroke={alpha("#9B6BE0", 0.8)} strokeWidth={6} />
        </Layer>
        <Layer depth={0}>
          <Ledge x={860} y={960} w={200} />
          <Tick x={960} y={960} pxPerM={90} frame={f} facing={f < 80 ? -1 : 1} pose={f < 80 ? "wave" : "stand"} expression={f < 80 ? "happy" : "thinking"} look={f < 80 ? 0.2 : 0.8} headTilt={f < 80 ? 0 : -12} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// E · the kit EndCard on a dark space field with the limb at the lower right; heat rings expand behind the wordmark;
// the right half stays clear for the end-screen tiles. MOVER: the rings (6 px/f) + stars.
// ================================================================================================================
const EndCardShot: React.FC<{ f: number; len: number }> = ({ f, len }) => (
  <AbsoluteFill>
    <Stage theme={SPACE.theme} drift={false} vignette={0.3} grain={0.4}>
      <Layer depth={0.05}>
        <Sky stops={[...SPACE.sky]} />
        <Stars frame={f} n={70} w={1920} h={800} color={STAR_TINTS[1]} seed={81} size={1.9} twinkle={0.7} />
        <Stars frame={f} n={40} w={1920} h={800} color={STAR_TINTS[0]} seed={83} size={2.2} twinkle={0.7} />
      </Layer>
      <Layer depth={1}>
        <g opacity={ez(f, 0, 20)}>
          <HeatRings f={f + 200} cx={1820} cy={1200} every={40} speed={5} r0={420} maxR={1900} opacity={0.7} />
        </g>
      </Layer>
      <Layer depth={0}>
        <EndCard t={Math.min(1, f / Math.max(1, len))} family={{ ...SPACE, text: CREAM, dim: C.lavender }} />
      </Layer>
    </Stage>
    <AbsoluteFill style={{ background: C.deepSpace, opacity: 1 - Math.min(1, f / 16) }} />
  </AbsoluteFill>
);

// ===============================================================================================================

export const SceneCloser: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCloser(t);
  if (f >= c.card) return <EndCardShot f={f - c.card} len={c.end - c.card} />;
  const shots: ShotDef<CCloser>[] = [
    { from: 0, S: ShotHonest, id: "Z-01" },
    { from: c.z02, S: ShotRideIn, id: "Z-02" },
    { from: c.z03, S: ShotThin, id: "Z-03" },
    { from: c.z04, S: ShotRecap, id: "Z-04" }, // + Z-05
    { from: c.z06, S: ShotStack, id: "Z-06" },
    { from: c.z07, S: ShotOutside, id: "Z-07" },
    { from: c.z08, S: ShotLimbRise, id: "Z-08" },
    { from: c.z09, S: ShotTurn, id: "Z-09" },
  ];
  return playShots(f, shots, c, c.card);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCloser = (t: SceneTiming): Cue[] => {
  const c = cuesCloser(t);
  return [
    { at: 12, file: SFX.chime, vol: 0.14, dur: 60 },
    ...[0, 8, 16, 24].map((o) => ({ at: 8 + o, file: SFX.click, vol: 0.07, dur: 8 })),
    ...cutHit(c.z02),
    { at: c.z02 + 20, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.z03),
    { at: c.z03 + 8, file: SFX.chime, vol: 0.12, dur: 60 },
    ...cutHit(c.z04),
    ...Array.from({ length: 7 }, (_, i) => ({ at: c.z04 + 4 + i * 14, file: SFX.click, vol: 0.08, dur: 8 })),
    { at: c.z05, file: SFX.riser, vol: 0.14, dur: c.z06 - c.z05, fadeIn: 6, fadeOut: 8 },
    ...cutHit(c.z06),
    ...[c.light, c.waves, c.model].flatMap((a) => [
      { at: a, file: SFX.click, vol: 0.14, dur: 10 },
      { at: a + 2, file: SFX.boom, vol: 0.3 * 0.7, dur: 80, fadeOut: 30 },
    ]),
    ...cutHit(c.z07),
    { at: c.z07 + 4, file: SFX.swirl, vol: 0.14, dur: 60 },
    ...cutHit(c.z08),
    { at: c.z08 + 4, file: SFX.riser, vol: 0.14, dur: 70, fadeIn: 6, fadeOut: 14 },
    ...cutHit(c.z09),
    { at: c.z09 + 6, file: SFX.whoosh, vol: 0.16, dur: 60 },
  ];
};
