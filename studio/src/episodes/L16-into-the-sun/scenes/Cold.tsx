// L16 scene "cold" (storyboard §3 "Cold open": C-01…C-14, script lines 0-6; space limb field ↔ corona halo ↔ shade pocket
// ↔ studio stamp card ↔ the L16Card). Shot components (hard cuts only; PUSH/SLIDE rows are phases of one component):
//   C-01 (+C-02, C-03)  the limb field: ruler + probe + Tick, the dotted line down, then the push into the halo and the shield pop
//   C-04                the hot band over the thin surface line (sparks streaming)
//   C-05                the shade pocket behind the shield (wind parting round it)
//   C-06 (+C-07)        the ENERGY dial slides in and swings to its stop, then the MARS / SUN bars (×55)
//   C-08                the stamp flipping measured → seen from afar → model over the cutaway (studio)
//   C-09 (+C-10, C-11)  the probe turns (name plate), streaks along the ruler, the green MEASURED stamp on its path
//   C-12                the dashed continuation and the two waiting stamp outlines
//   C-13                the chapter card (heat rings)
//   C-14                "First, the problem with falling": the drop that bends sideways
// Numbers drawn: ×55 only (READ.energyRatio, sources #3, NASA chip). Everything else is words (storyboard Acc "—", #9, #10, #13).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Layer, Motes, Sky, Stage, Tick, alpha, cameraAt, impact, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { READ, assertValue } from "../sundata";
import { RadiiRuler } from "../ruler";
import { WindStreaks } from "../movers16";
import { CoronaHalo, SunCutaway, SunLimb } from "../sunbody";
import { EnergyDial, L16DialsHUD, distanceValue } from "../L16Dials";
import { PillFor, StateStamp } from "../stamps";
import { Probe } from "../props16";
import { L16Card } from "../L16Card";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  C,
  CORONA,
  CREAM,
  ClipBox,
  DrawnPath,
  Flag,
  Label,
  Ledge,
  PillA,
  Pop,
  Rings,
  SHADE,
  SPACE,
  STUDIO,
  Shimmer,
  Slab,
  SpaceField,
  StudioRoom,
  ez,
  lerp,
  lin,
  path1,
} from "./a-parts";

// ================================================================================================================
// cues
// ================================================================================================================
export const cuesCold = (t: SceneTiming) => {
  const { at, p, frac } = cueKit(t);
  return {
    c01: 0,
    c02: frac(0, 0.5), // phase
    c03: at(1), // phase
    c04: p(1, "The gas around it"),
    c05: at(2),
    c06: at(3),
    c07: p(3, "It takes fifty-five"), // phase
    c08: p(3, "We'll go in"),
    c09: at(4),
    c10: p(4, "It's the fastest"), // phase
    c11: p(4, "Everything it measured"), // phase
    c12: at(5),
    c13: frac(5, 0.55),
    c14: at(6),
    end: t.frames,
  };
};
export type CCold = ReturnType<typeof cuesCold>;

// the limb the cold open sits on: centre far below the frame, top edge ≈ y 600 at x 760
const LIMB = { cx: 760, cy: 2900, R: 2300 };
const limbY = (x: number, L = LIMB) => L.cy - Math.sqrt(Math.max(0, L.R * L.R - (x - L.cx) * (x - L.cx)));

// ================================================================================================================
// C-01 + C-02 + C-03 · the limb field. Tick on the ruler with the probe at his feet; the dotted line draws down toward
// the limb (DISTANCE needle sweeping); then the camera pushes along the ruler, the probe slides into the halo, HEAT swings
// to the stop, the shield pops up and the needle drops back.
// MOVER: wind streaks fanning off the limb 22 px/f + ruler ticks 12 → 18 px/f + granules; the line's head; the push.
// ================================================================================================================
const ShotLimb: ShotFC<CCold> = ({ f, len, c }) => {
  const T2 = c.c02 - c.c01;
  const T3 = c.c03 - c.c01;
  const g = f - T3; // phase-3 frame
  const k3 = ez(f, T3 - 6, T3 + 30);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: T3, x: 990, y: 550, zoom: 1.06 },
    { f: len + 10, x: 1110, y: 640, zoom: 1.3 },
  ]);
  const rulerSpeed = f < T3 ? 12 : 18;
  const rulerOrigin = f < T3 ? -8000 : -8000 + T3 * 12 - T3 * 18; // far left: the surface end never enters
  // the probe: at Tick's feet, then sliding down-right into the halo (~3 px/f on top of the push)
  const px = 1000 + Math.max(0, g) * 1.6;
  const py = 290 + Math.max(0, g) * 1.5;
  // the dotted line (C-02): from the probe down to the limb
  const lineEnd: Pt = [1290, limbY(1290) - 10];
  const linePts: Pt[] = [
    [1000, 350],
    [1080, 420],
    [1190, 500],
    lineEnd,
  ];
  const lineHead = lin(f, T2 + 4, T2 + 34);
  const lineFade = 1 - ez(f, T3 + 10, T3 + 40);
  // HEAT: climbs as the probe enters, pins at the edge, the shield pops, it drops back to the middle
  const POP = 70;
  const heat = g < 0 ? 0.12 : g < 56 ? lerp(0.12, 1, ez(g, 0, 56)) : g < POP + 6 ? 1 : lerp(1, 0.5, ez(g, POP + 6, POP + 36));
  const pinned = g >= 56 && g < POP + 6;
  const dist = f < T2 ? distanceValue(40) : lerp(distanceValue(40), distanceValue(14), ez(f, T2, len));
  const turn = ez(g, POP - 4, POP + 6);
  // Tick: measuring with the staff, then pointing down the dotted line, then shielding from the halo, then peeking
  const tickPose = f < T2 ? "hold" : g < 0 ? "point" : g < 50 ? "hold" : g < POP + 8 ? "shield" : "lean";
  return (
    <AbsoluteFill>
      <Stage theme={SPACE.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <SpaceField f={f} seed={4} n={80} />
          {/* the corona's violet-magenta rises over the field in phase 3 */}
          <g opacity={k3 * 0.75}>
            <Sky stops={[...CORONA.sky.slice(0, 3)]} x={-400} y={-300} w={2720} h={1500} />
          </g>
        </Layer>
        <Layer depth={1}>
          <CoronaHalo f={f} cx={LIMB.cx} cy={LIMB.cy} R={LIMB.R} extent={560} loops={6} a0={-122} a1={-58} intensity={0.35 + 0.65 * k3} />
          <WindStreaks f={f} cx={LIMB.cx} cy={LIMB.cy} r0={LIMB.R + 10} rMax={LIMB.R + 1500} a0={-128} a1={-52} speed={22} count={70} len={200} width={9} seed={3} opacity={0.8} />
          <SunLimb f={f} cx={LIMB.cx} cy={LIMB.cy} R={LIMB.R} granSize={80} drift={8} />
          <RadiiRuler f={f} y={330} origin={rulerOrigin} speed={rulerSpeed} flags={false} />
          {/* C-02: the dotted line down toward the limb, and the empty stamp outline waiting at its end */}
          <g opacity={lineFade}>
            <DrawnPath pts={linePts} head={lineHead} f={f} dots width={9} color={C.saffron} />
            {f > T2 + 30 ? (
              <g transform={`translate(${lineEnd[0]} ${lineEnd[1] - 70}) scale(${1 + 0.12 * Math.sin(f / 4)})`}>
                <circle r={66} fill="none" stroke={C.gold} strokeWidth={6} strokeDasharray="16 12" strokeDashoffset={-f * 3} />
                <circle r={50} fill="none" stroke={C.gold} strokeWidth={3} opacity={0.5} />
              </g>
            ) : null}
          </g>
          {/* the shield pop: a flash ring as the plate swings up */}
          {g >= POP - 2 && g < POP + 24 ? <Rings x={px - 30} y={py + 40} f={g} from={POP - 2} every={40} speed={24} maxR={520} color={C.whiteGold} width={10} /> : null}
          {g >= POP - 2 && g < POP + 16 ? <Bloom x={px - 20} y={py + 50} r={260} color={C.whiteGold} strength={0.8 * (1 - (g - POP + 2) / 18)} /> : null}
          <Probe x={px} y={py} size={130} f={f} tilt={-88} turn={turn} trail={g > 0 ? 70 : 0} />
          <Tick
            x={850}
            y={327}
            pxPerM={108}
            frame={f}
            facing={1}
            pose={tickPose}
            expression={g < 50 ? "neutral" : g < POP + 8 ? "surprised" : "happy"}
            look={f < T3 && f >= T2 ? 0.9 : 0.4}
            headTilt={f < T3 && f >= T2 ? 14 : -6}
            staff={g < 50}
            squash={impact(f, T3 + 56, 0.12, 10)}
          />
        </Layer>
        <L16DialsHUD f={f} family={SPACE} theme="dark" distance={{ value: dist }} heat={{ value: heat, pinned }} />
      </Stage>
    </AbsoluteFill>
  );
};

// ================================================================================================================
// C-04 · "hundreds of times hotter than the surface": a thin gold surface line, a thick glowing magenta-violet band
// above it, big bright sparks streaming through the band. MOVER: sparks 18 px/f (large, bright) + shimmer 10 px/f.
// Words only (the ratio is class B).
// ================================================================================================================
const ShotBand: ShotFC<CCold> = ({ f, len }) => {
  const bright = ez(f, 0, 40);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 600, zoom: 1.04 },
    { f: len + 10, x: 960, y: 470, zoom: 1.0 },
  ]);
  const BAND = { y: 230, h: 620 };
  const SURF = 880;
  return (
    <Pop f={f}>
      <Stage theme={CORONA.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <Sky stops={["#14083E", "#2A0E5C", "#1B0B4F"]} x={-400} y={-300} w={2720} h={1700} />
        </Layer>
        <Layer depth={1}>
          {/* the corona band: magenta core, violet edges, brightening */}
          <defs>
            <linearGradient id="c04band" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={C.violet} stopOpacity={0} />
              <stop offset="0.22" stopColor={C.violet} stopOpacity={0.85} />
              <stop offset="0.6" stopColor={C.magenta} stopOpacity={1} />
              <stop offset="0.92" stopColor={C.amber} stopOpacity={0.9} />
              <stop offset="1" stopColor={C.gold} stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <rect x={-400} y={BAND.y} width={2720} height={SURF - BAND.y} fill="url(#c04band)" opacity={0.6 + 0.4 * bright} />
          <ClipBox x={-400} y={BAND.y + 30} w={2720} h={SURF - BAND.y - 40}>
            <Shimmer x={-400} y={BAND.y} w={2720} h={SURF - BAND.y} f={f} speed={10} n={8} color={C.gold} opacity={0.45} />
            <WindStreaks f={f} mode="sweep" angle={-8} box={{ x: -300, y: BAND.y + 40, w: 2520, h: SURF - BAND.y - 80 }} speed={18} count={46} len={150} width={18} seed={7} from={C.whiteGold} to={C.gold} opacity={0.95} />
          </ClipBox>
          {/* the thin surface line and the surface glow below it */}
          <rect x={-400} y={SURF} width={2720} height={700} fill={C.tangerine} />
          <rect x={-400} y={SURF + 18} width={2720} height={700} fill={C.amber} opacity={0.7} />
          <rect x={-400} y={SURF - 5} width={2720} height={10} fill={C.gold} />
          <Bloom x={960} y={SURF} r={900} color={C.gold} strength={0.5} squash={0.25} />
          <Label x={1500} y={SURF + 60} text="surface" size={30} color={C.ink} halo={C.gold} />
          <Label x={1500} y={BAND.y + 90} text="corona" size={30} />
        </Layer>
        <Layer depth={0}>
          <PillA x={120} y={110} text="hundreds of times hotter" F={CORONA} dot={C.gold} size={30} opacity={ez(f, 8, 22)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-05 · "behind its shield, room temperature": the probe cut away; the bright amber shield face at the left, a calm dark
// violet pocket behind it with the teal instrument box's green glow; HEAT sits at the middle.
// MOVER: amber wind streaks sliding past above, below and onto the shield 22 px/f + heat shimmer off the face 12 px/f.
// ================================================================================================================
const ShotPocket: ShotFC<CCold> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 10, x: 1010, y: 540, zoom: 1.12 },
  ]);
  const PX = 1180;
  const SZ = 720;
  const shieldX = PX - SZ * 0.3; // the shield plane (Probe geometry)
  const half = SZ * 0.43;
  return (
    <Pop f={f}>
      <Stage theme={SHADE.theme} cam={cam} vignette={0.35} grain={0.5}>
        <Layer depth={0.2}>
          <Sky family={SHADE} x={-400} y={-300} w={2720} h={1700} />
        </Layer>
        <Layer depth={1}>
          {/* the Sun's side: an amber wash at the far left */}
          <rect x={-400} y={-300} width={shieldX + 300} height={1700} fill={C.amber} opacity={0.12} />
          <Bloom x={shieldX - 60} y={540} r={520} color={C.shieldRim} strength={0.55} squash={1.6} />
          {/* wind: onto the face (left box) and parting past it (top and bottom bands) */}
          <ClipBox x={-400} y={0} w={shieldX + 380} h={1080}>
            <WindStreaks f={f} mode="sweep" angle={0} box={{ x: -400, y: 0, w: shieldX + 400, h: 1080 }} speed={22} count={34} len={170} width={11} seed={11} from={C.shieldRim} to={C.gold} opacity={0.9} />
            <Shimmer x={shieldX - 260} y={540 - half} w={240} h={half * 2} f={f} speed={12} n={6} color={C.gold} opacity={0.55} vertical />
          </ClipBox>
          <ClipBox x={-400} y={-300} w={2720} h={540 - half + 290}>
            <WindStreaks f={f} mode="sweep" angle={-4} box={{ x: shieldX - 200, y: 0, w: 2300, h: 540 - half - 10 }} speed={22} count={22} len={190} width={10} seed={12} from={C.shieldRim} to={C.magenta} opacity={0.85} />
          </ClipBox>
          <ClipBox x={-400} y={540 + half + 10} w={2720} h={800}>
            <WindStreaks f={f} mode="sweep" angle={4} box={{ x: shieldX - 200, y: 540 + half + 10, w: 2300, h: 1080 - 540 - half }} speed={22} count={22} len={190} width={10} seed={13} from={C.shieldRim} to={C.magenta} opacity={0.85} />
          </ClipBox>
          <Probe x={PX} y={540} size={SZ} f={f} variant="cutaway" tilt={0} lamp={false} />
          <Motes frame={f} n={10} x={shieldX + 80} y={300} w={700} h={480} color={alpha(C.instrument, 0.6)} seed={5} size={4} drift={30} />
        </Layer>
        <L16DialsHUD f={f} family={SHADE} theme="dark" only={["heat"]} heat={{ value: 0.5 + 0.02 * Math.sin(f / 9) }} />
        <Layer depth={0}>
          <PillA x={1240} y={110} text="room temperature" F={SHADE} dot={C.instrument} size={30} opacity={ez(f, 6, 20)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-06 + C-07 · "the real villain": the ENERGY TO GET HERE dial slides up beside the two others, wavers, swings to its
// stop; then (SLIDE) the dials slide away and two bars stand on a shared base: MARS short, SUN a tower rising off the top
// of the frame; the camera tilts up with it; Tick shrugs, then throws his hands up.
// MOVER: dial plate sliding 20 px/f + needle + wind streaks 16 px/f; then the SUN bar 40 px/f + camera tilt 24 px/f.
// ================================================================================================================
const ShotEnergy: ShotFC<CCold> = ({ f, len, c }) => {
  const T7 = c.c07 - c.c06;
  const g = f - T7;
  const slideIn = lin(f, 2, 22);
  const ev = f < 28 ? 0.32 + 0.14 * Math.sin(f / 3) : lerp(0.32, 1, ez(f, 28, 48));
  const epinned = f >= 48;
  const out = ez(g, 0, 16); // dials slide away
  // the bars (phase 2)
  const BASE = 900;
  const UNIT = 54; // MARS bar height; SUN = 55 × UNIT (#3)
  const hSun = Math.min(55 * UNIT, Math.max(0, g - 12) * 28); // still growing through the shot
  const top = BASE - hSun;
  const tk = ez(g, 20, 100); // tilt up + pull back: the base stays in frame while the tower runs off the top
  const ratio = ez(g, 14, 14 + 74);
  const shown = Math.max(1, Math.round(lerp(1, 55, ratio)));
  if (ratio >= 1) assertValue(READ.energyRatio.value!, "C-07 counter");
  return (
    <AbsoluteFill>
      <Stage theme={SPACE.theme} cam={{ x: lerp(960, 1100, tk), y: lerp(540, 300, tk), zoom: lerp(1, 0.62, tk) }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={6} n={90} />
        </Layer>
        <Layer depth={1}>
          <g opacity={1 - ez(g, 0, 20)}>
            <WindStreaks f={f} cx={LIMB.cx} cy={LIMB.cy + 300} r0={LIMB.R + 10} rMax={LIMB.R + 1300} a0={-128} a1={-52} speed={16} count={55} len={180} width={8} seed={8} opacity={0.75} />
            <SunLimb f={f} cx={LIMB.cx} cy={LIMB.cy + 300} R={LIMB.R} granSize={80} drift={8} />
          </g>
          {g >= 0 ? (
            <g>
              <rect x={760} y={BASE} width={900} height={14} rx={6} fill={C.saffron} />
              {/* MARS */}
              <rect x={860} y={BASE - UNIT * ez(g, 4, 12)} width={170} height={UNIT * ez(g, 4, 12)} rx={10} fill={C.magenta} stroke={CREAM} strokeWidth={3} />
              <Label x={945} y={BASE + 60} text="mars" size={40} align="middle" color={C.magenta} halo={CREAM} />
              {/* SUN tower */}
              <Bloom x={1335} y={top} r={260} color={C.gold} strength={0.55} />
              <rect x={1250} y={top} width={170} height={hSun} rx={10} fill={C.gold} stroke={C.whiteGold} strokeWidth={4} />
              <rect x={1250} y={top} width={60} height={hSun} rx={10} fill={C.whiteGold} opacity={0.45} />
              <Label x={1335} y={BASE + 60} text="sun" size={40} align="middle" color={C.ink} halo={C.gold} />
              
              <Tick
                x={1560}
                y={BASE}
                pxPerM={90}
                frame={f}
                facing={-1}
                pose="shrug"
                poseTo="cheer"
                poseT={ez(g, 40, 56)}
                expression="worried"
                expressionTo="surprised"
                expressionT={ez(g, 40, 50)}
                look={0.9}
                headTilt={-14}
              />
            </g>
          ) : (
            <g>
              <Ledge x={860} y={1000} w={200} />
              <Tick x={960} y={1000} pxPerM={88} frame={f} facing={-1} pose="stand" expression="worried" look={0.8} headTilt={-16} />
            </g>
          )}
        </Layer>
        <Layer depth={0}>
          <g transform={`translate(${-out * 900} 0)`} opacity={1 - out}>
            <L16DialsHUD f={f} family={SPACE} theme="dark" distance={{ value: distanceValue(30) }} heat={{ value: 0.3 }} />
            <g transform={`translate(0 ${(1 - slideIn) * 400})`} opacity={slideIn}>
              <EnergyDial x={566} y={700} f={f} family={SPACE} theme="dark" s={{ value: ev, pinned: epinned }} />
            </g>
          </g>
          {g >= 14 ? (
            <g opacity={ez(g, 14, 24)}>
              <Slab x={1230} y={300} value={`×${shown}`} size={110} F={SPACE} check={ratio >= 1} />
              <PillFor kind={READ.energyRatio.pill} x={1240} y={380} size={22} />
            </g>
          ) : null}
        </Layer>
      </Stage>
    </AbsoluteFill>
  );
};

// ================================================================================================================
// C-08 · "stage by stage, stamp from measured to model": on the cyclorama, Tick holds the stamp over the cutaway Sun; as it
// moves inward from the rim to the interior it flips green MEASURED → blue SEEN FROM AFAR → grey MODEL.
// MOVER: the stamp flipping (13°/f) and travelling inward with a press bob + the cutaway's rings rotating 4°/f + clouds.
// ================================================================================================================
const ShotStampCard: ShotFC<CCold> = ({ f, len }) => {
  const CX = 820;
  const CY = 500;
  const R = 330;
  const F1 = Math.round(len * 0.36);
  const F2 = Math.round(len * 0.64);
  const travel = ez(f, 10, len - 10);
  const sx = lerp(CX + R * 0.86, CX + R * 0.34, travel);
  const sy = CY + R * 0.42;
  const bob = (at: number) => (f >= at - 8 && f < at + 6 ? Math.sin(((f - at + 8) / 14) * Math.PI) * 46 : 0);
  const state = f < F1 ? "measured" : f < F2 ? "afar" : "model";
  const from = f < F1 ? undefined : f < F2 ? "measured" : "afar";
  const flipAge = f < F1 ? -1 : f < F2 ? f - F1 : f - F2;
  const hl = f < F1 ? "photosphere" : f < F2 ? "convective" : "radiative";
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 10, x: 900, y: 520, zoom: 1.1 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.12} grain={0.5}>
        <StudioRoom f={f} seed={7}>
          <WindStreaks f={f} cx={CX} cy={CY} r0={R + 20} rMax={1500} a0={-180} a1={180} speed={16} count={60} len={150} width={8} seed={17} opacity={0.6} />
          <SunCutaway f={f} cx={CX} cy={CY} r={R} highlight={hl} rotate={4} labels />
          <g transform={`translate(0 ${bob(F1) + bob(F2) + bob(8)})`}>
            <StateStamp x={sx} y={sy} state={state} age={f - 6} flip={from ? { from, age: flipAge } : undefined} size={190} rotate={-10} />
          </g>
          <Tick
            x={1420}
            y={900}
            pxPerM={190}
            frame={f}
            facing={-1}
            pose="hold"
            poseTo="press"
            poseT={Math.max(...[8, F1, F2].map((a) => ez(f, a - 8, a) * (1 - ez(f, a + 4, a + 14))))}
            expression="proud"
            look={0.3}
            headTilt={f % 60 < 30 && f > F1 ? 8 : 0}
          />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-09 + C-10 + C-11 · "called Parker Solar Probe": the probe turns toward us, its name plate slides in, Tick salutes;
// then it pulls back onto the ruler and streaks along it toward the Sun trailing a bright line, past a small flag; then the
// green MEASURED stamp slams on the first stretch of its path and the line turns green.
// MOVER: probe turning + plate sliding 20 px/f + wind 16 px/f; ruler ticks 20 px/f + the streak; the green head 30 px/f.
// ================================================================================================================
const ShotParker: ShotFC<CCold> = ({ f, len, c }) => {
  const T10 = c.c10 - c.c09;
  const T11 = c.c11 - c.c09;
  const g = f - T10;
  const h = f - T11;
  const k = ez(g, 0, 22); // pull back onto the ruler
  const turnIn = ez(f, 8, 34) * (1 - ez(g, 0, 18));
  const size = lerp(380, 130, k);
  const RY = 560; // ruler
  const probeX = g < 0 ? 1080 : lerp(1080, 1420, k) - Math.max(0, g - 22) * 5;
  const probeY = lerp(430, RY - 110, k);
  const plateX = Math.max(1080, 2100 - f * 20);
  const speed = g < 0 ? 0 : h < 0 ? 20 : 14;
  const origin = h < 0 ? -9000 : -9000 + (T11 - T10) * 20 - (T11 - T10) * 14;
  const flagX = g < 0 ? -400 : -200 + g * 20 - Math.max(0, h) * 6;
  const greenHead = lin(h, 0, 30);
  const trailFrom = probeX + 70;
  return (
    <AbsoluteFill>
      <Stage theme={SPACE.theme} cam={cameraAt(Math.max(0, h), [{ f: 0, x: 960, y: 540, zoom: 1 }, { f: 90, x: 1060, y: 520, zoom: 1.12 }])} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={9} n={90} stream={g > 0 ? 6 : 0} angle={0} />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={f} cx={700} cy={3500} r0={2310} rMax={3700} a0={-125} a1={-55} speed={16} count={60} len={180} width={8} seed={10} opacity={0.75} />
          <SunLimb f={f} cx={700} cy={3500} R={2300} granSize={80} drift={8} />
          {g >= 0 ? (
            <g opacity={k}>
              <RadiiRuler f={g} y={RY} origin={origin} speed={speed} flags={false} />
              <Flag x={flagX} y={RY - 4} h={90} f={f} color={C.saffron} />
              {/* the bright trail behind the probe, then the green measured stretch drawn from the right */}
              <line x1={trailFrom} y1={probeY} x2={2100} y2={probeY} stroke={C.whiteGold} strokeWidth={10} strokeLinecap="round" opacity={0.9} />
              <line x1={trailFrom} y1={probeY} x2={2100} y2={probeY} stroke={C.gold} strokeWidth={28} opacity={0.25} />
              {h >= 0 ? (
                <g>
                  <line x1={2100} y1={probeY} x2={lerp(2100, trailFrom, greenHead)} y2={probeY} stroke={C.stampGreen} strokeWidth={14} strokeLinecap="round" />
                  <line x1={2100} y1={probeY} x2={lerp(2100, trailFrom, greenHead)} y2={probeY} stroke={C.stampGreen} strokeWidth={40} opacity={0.3} />
                  {greenHead < 1 ? <circle cx={lerp(2100, trailFrom, greenHead)} cy={probeY} r={16} fill={C.saffronCore} stroke={C.stampGreen} strokeWidth={4} /> : null}
                  <StateStamp x={1600} y={probeY - 120} state="measured" age={h - 18} size={170} rotate={-8} />
                </g>
              ) : null}
            </g>
          ) : null}
          <Probe x={probeX} y={probeY} size={size} f={f} tilt={0} turn={turnIn} trail={g > 10 ? 160 : 0} />
          {/* the name plate (a diagram label) */}
          {g < 16 ? (
            <g transform={`translate(${plateX} 790)`} opacity={1 - ez(g, 0, 14)}>
              <rect x={-330} y={-50} width={660} height={92} rx={20} fill={alpha(C.indigo, 0.9)} stroke={C.gold} strokeWidth={4} />
              <rect x={-330} y={-50} width={660} height={92} rx={20} fill="none" stroke={C.gold} strokeWidth={14} opacity={0.2 + 0.2 * Math.sin(f / 5)} />
              <Label x={0} y={14} text="parker solar probe" size={46} align="middle" color={C.gold} />
            </g>
          ) : null}
          {g < 0 ? (
            <g>
              <Ledge x={300} y={800} w={220} />
              <Tick x={410} y={800} pxPerM={145} frame={f} facing={1} pose="wave" expression="proud" look={0.4} />
            </g>
          ) : (
            <Tick
              x={1560}
              y={RY - 3}
              pxPerM={105}
              frame={f}
              facing={-1}
              pose={h < 0 ? (g < 34 ? "shield" : "hold") : h < 10 ? "hold" : "press"}
              expression={h < 18 ? "neutral" : "happy"}
              squash={impact(h, 18, 0.14, 8)}
              look={0.2}
              staff={h < 10}
            />
          )}
        </Layer>
      </Stage>
    </AbsoluteFill>
  );
};

// ================================================================================================================
// C-12 · "everything past it gets a different one": the green path stops; a dashed line carries on toward the limb; a
// blue and a grey stamp outline pulse beyond its end. MOVER: the dashed head 40 px/f + outlines pulsing + wind.
// ================================================================================================================
const ShotDashed: ShotFC<CCold> = ({ f }) => {
  const Y = 470;
  const pts: Pt[] = [
    [1180, Y],
    [880, Y + 30],
    [560, Y + 90],
    [260, Y + 190],
  ];
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} shotFrame={f} drift={{ zoom: 1.05, panX: -0.02, panY: 0, frames: 60, seed: 2 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={12} n={90} />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={f} cx={200} cy={3000} r0={2310} rMax={3600} a0={-110} a1={-40} speed={20} count={50} len={170} width={8} seed={13} opacity={0.7} />
          <SunLimb f={f} cx={200} cy={3000} R={2300} granSize={80} drift={8} />
          <line x1={1180} y1={Y} x2={2100} y2={Y} stroke={C.stampGreen} strokeWidth={14} strokeLinecap="round" />
          <line x1={1180} y1={Y} x2={2100} y2={Y} stroke={C.stampGreen} strokeWidth={40} opacity={0.3} />
          <StateStamp x={1560} y={Y - 110} state="measured" size={150} rotate={-8} />
          <DrawnPath pts={pts} head={lin(f, 0, 24)} f={f} dashed width={9} color={CREAM} />
          <StateStamp x={820} y={Y - 150} state="afar" ghost f={f} size={150} rotate={-6} />
          <StateStamp x={440} y={Y - 60} state="model" ghost f={f + 6} size={150} rotate={6} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-13 · the chapter card: heat rings expand from a warm body at the lower right behind the type.
// MOVER: rings launched every 36 f, 8 px/f.
// ================================================================================================================
const ShotCard: ShotFC<CCold> = ({ f, len }) => (
  <L16Card family={CORONA} kicker="Off the Scale · Into the Sun" title="What If You Flew Into the Sun?" t={Math.min(0.97, f / len)} frame={f + 60} />
);

// ================================================================================================================
// C-14 · "First, the problem with falling": the probe drops straight down toward the limb, then its path bends sideways
// and carries it off to the right. MOVER: the path's head 30 px/f, then the probe following it 14 → 30 px/f + wind.
// ================================================================================================================
const ShotFall: ShotFC<CCold> = ({ f, len }) => {
  const pts: Pt[] = [
    [760, 130],
    [760, 330],
    [790, 500],
    [930, 610],
    [1250, 680],
    [1700, 700],
    [2200, 700],
  ];
  const head = lin(f, 0, 50);
  // the probe follows behind the head, accelerating
  const s = path1(f, [
    [0, 0],
    [8, 0],
    [36, 0.3],
    [len, 1],
  ]);
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = s * total;
  let pp: Pt = pts[0];
  let ang = 90;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) {
      const u = d / seg[i];
      pp = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u];
      ang = (Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]) * 180) / Math.PI;
      break;
    }
    d -= seg[i];
  }
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 520, zoom: 1.02 }, { f: len + 10, x: 1040, y: 580, zoom: 1.1 }])} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={15} n={90} />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={f} cx={960} cy={3150} r0={2310} rMax={3700} a0={-125} a1={-55} speed={20} count={60} len={170} width={8} seed={15} opacity={0.75} />
          <SunLimb f={f} cx={960} cy={3150} R={2300} granSize={80} drift={8} />
          <DrawnPath pts={pts} head={head} f={f} dots width={8} color={C.saffron} />
          {/* the fall pulls the shield round to face the way it goes; the probe never glows (F8) */}
          <Probe x={pp[0]} y={pp[1]} size={120} f={f} tilt={ang + 180} trail={s > 0.05 ? 110 : 0} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================

export const SceneCold: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCold(t);
  const shots: ShotDef<CCold>[] = [
    { from: 0, S: ShotLimb, id: "C-01" }, // + C-02, C-03
    { from: c.c04, S: ShotBand, id: "C-04" },
    { from: c.c05, S: ShotPocket, id: "C-05" },
    { from: c.c06, S: ShotEnergy, id: "C-06" }, // + C-07
    { from: c.c08, S: ShotStampCard, id: "C-08" },
    { from: c.c09, S: ShotParker, id: "C-09" }, // + C-10, C-11
    { from: c.c12, S: ShotDashed, id: "C-12" },
    { from: c.c13, S: ShotCard, id: "C-13" },
    { from: c.c14, S: ShotFall, id: "C-14" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCold = (t: SceneTiming): Cue[] => {
  const c = cuesCold(t);
  const POP = c.c03 + 70;
  return [
    { at: 0, file: SFX.rumble, vol: 0.12, dur: c.c04 + 10, fadeIn: 20, fadeOut: 20 },
    ...[0, 6, 12, 18, 24].map((o) => ({ at: c.c02 + 4 + o, file: SFX.click, vol: 0.08, dur: 8 })),
    { at: c.c03, file: SFX.whoosh, vol: 0.16, dur: 50 },
    { at: POP, file: SFX.pop, vol: 0.24, dur: 20 },
    ...cutHit(c.c04),
    { at: c.c04 + 4, file: SFX.swirl, vol: 0.16, dur: 60 },
    ...cutHit(c.c05),
    { at: c.c05 + 6, file: SFX.click, vol: 0.12, dur: 12 },
    ...cutHit(c.c06),
    { at: c.c06 + 4, file: SFX.riser, vol: 0.14, dur: c.c07 - c.c06, fadeIn: 6, fadeOut: 8 },
    { at: c.c07 + 14, file: SFX.boom, vol: 0.3, dur: 120, fadeOut: 40 },
    ...cutHit(c.c08),
    ...[6, 0.36, 0.64].map((k) => ({ at: c.c08 + (k < 1 ? Math.round((c.c09 - c.c08) * k) : k), file: SFX.click, vol: 0.14, dur: 12 })),
    ...cutHit(c.c09),
    { at: c.c09 + 8, file: SFX.popLong, vol: 0.18, dur: 30 },
    { at: c.c10, file: SFX.whoosh, vol: 0.2, dur: 50 },
    { at: c.c11 + 18, file: SFX.click, vol: 0.14, dur: 10 },
    { at: c.c11 + 18, file: SFX.boom, vol: 0.3 * 0.9, dur: 90, fadeOut: 30 },
    ...cutHit(c.c12),
    { at: c.c12 + 2, file: SFX.riser, vol: 0.14, dur: c.c13 - c.c12 + 10, fadeIn: 4, fadeOut: 8 },
    { at: c.c13, file: SFX.boom, vol: 0.3, dur: 120, fadeOut: 40 },
    ...cutHit(c.c14),
    { at: c.c14 + 4, file: SFX.pop, vol: 0.18, dur: 20 },
  ];
};

