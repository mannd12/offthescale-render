// L19 scene "l01" · The brake (storyboard §3 act 1: 1-01…1-13, script lines 6-10; limb → deepdeck → scope).
// Shot components (hard cuts only; PUSH/SLIDE rows are phases of one component):
//   1-01          the probe a bright dot high over the shearing limb, its streak growing, the date rule drawing; 7 DEC 1995
//   1-02 (+1-03)  KEY ART 1: the shield plate leads a gold flare and sparks across the crimson-black sky over the limb (cloud
//                 edge shearing 28 px/f); 47.6 KM/S rolls, then swaps to ABOUT 170,000 KM/H while speed streaks fly (36 px/f)
//   1-04          the g-meter needle leaps and trembles, the probe shakes (±6 px), flare sparks; MORE THAN 200 TIMES GRAVITY
//   1-05 (+1-06)  the timer disc fills (hand 12 deg/f), the flare thins, sparks stream up the wake (26 px/f); ABOUT 2 MIN; the
//                 cards slide out and the canopy blooms (unfurl), the probe jerks up the frame, the decks slow to 20 px/f
//   1-07          the shield plate drops away tumbling (16 deg/f, 24 px/f), the tape starts printing (28 px/f), decks 18 px/f
//   1-08 (+1-09)  pull back: the small probe in endless bands, the floor line receding (36 px/f), the tape scrolling; tilt up to
//                 the orbiter: data dots stream up to it (28 px/f), the dashed line to Earth draws (36 px/f) and is crossed out
//   1-10          six chips light in turn (8 f stagger) and pulse rings (20 px/f), the orbiter glides off toward Earth; 6 INSTRUMENTS
//   1-11          the station: the BAR dial's rim lamps light in a stagger, the window's decks scroll (20 px/f), Tick throws the switch
//   1-12 (+1-13)  the needle climbs (never resting: it is still moving toward 4 at the cut, F6), the tape runs into the reel; then
//                 Tick reads the tape through his mitts (26 px/f) under a bouncing "!"
// Numbers drawn (data19 READ): date1995 (#1 A) · kmps476 47.6 (#1 A) · kmh170k 170,000 (#3 A, ABOUT) · g200 200 (#2 A) ·
// min2 2 (#3 A, ABOUT) · inst6 6 (#4 A). Dial numerals are SCALE_LABELS. F15: the line to Earth is crossed out (#2, #3).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Layer, Sky, Stage, Tick } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { ShotDef, ShotFC, playShots } from "../shots";
import { BarDial, needleTo } from "../dial";
import { Reel, TapeTrace } from "../tape";
import { Wisps } from "../decks";
import { Canopy, Capsule, Flare, Orbiter, ShieldPlate } from "../probe19";
import { AboutPill, QuestionTag } from "../tags19";
import { Sparks } from "../flows19";
import { EarthDot } from "../icons19";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  C,
  DEEP,
  DRIFT,
  DataDots,
  Descent,
  FloorSearch,
  GMeter,
  KickerA,
  LIMB,
  Limb,
  MetricA,
  Phase,
  Plate,
  Pop,
  Rings,
  Roll,
  SCOPE,
  SpaceField,
  Station,
  TimerDisc,
  ez,
  lerp,
  lin,
  wrap,
} from "./a-parts";

export const cuesL01 = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    c02: frac(0, 0.3), // key art 1 (Full.tsx KeyArt1 = 40 % into this shot)
    c03: frac(0, 0.68), // phase ("That is about a hundred and seventy thousand")
    c04: at(1),
    c05: at(2),
    c06: frac(2, 0.22), // phase ("Then the probe opened a parachute")
    c07: frac(2, 0.5),
    c08: frac(2, 0.74),
    c09: at(3), // phase ("And it did not report straight to Earth")
    c10: frac(3, 0.5),
    c11: at(4),
    c12: frac(4, 0.34),
    c13: frac(4, 0.68), // phase ("The first thing the probe found")
    end: t.frames,
  };
};
export type CL01 = ReturnType<typeof cuesL01>;

// ================================================================================================================
// 1-01 · the probe a bright dot high above the limb with its streak growing behind it (head 10 px/f, glow tail lengthening
// 44 px/f), the limb's bands shearing (16-22 px/f), the date rule drawing (36 px/f); 7 DEC 1995 (#1)
// ================================================================================================================
const ShotStreak: ShotFC<CL01> = ({ f }) => {
  const px = 380 + f * 9;
  const py = 150 + f * 5;
  const tail = Math.min(1400, 200 + f * 44);
  const a = Math.atan2(5, 9);
  return (
    <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(1, 1.1, 0.03)} vignette={0.3} grain={0.5}>
      <SpaceField f={f} speed={12} n={120} seed={21} />
      <Layer depth={1}>
        <Limb f={f} cx={960} cy={680 + 2600} R={2600} shear={[16, -22, 18, -20, 22, -16]} seed={21} />
        <g transform={`translate(${px} ${py}) rotate(${(a * 180) / Math.PI + 180})`}>
          <path d={`M0 -26 L${tail} -3 L${tail} 3 L0 26 Z`} fill={C.glow} opacity={0.45} />
          <path d={`M0 -9 L${tail * 0.8} 0 L0 9 Z`} fill={C.goldHot} opacity={0.9} />
        </g>
        <Flare x={px} y={py} r={30} f={f} angle={(a * 180) / Math.PI} strength={0.45} />
      </Layer>
      <Layer depth={0}>
        <KickerA x={140} y={560} text="7 DEC 1995" appear={lin(f, 2, 10)} size={40} />
        <rect x={120} y={608} width={Math.min(560, f * 36)} height={8} rx={4} fill={C.heard} />
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 1-02 + 1-03 · KEY ART 1: the shield plate leads the gold flare across the crimson-black sky, sparks trailing (30 px/f), the
// limb's cloud edge shearing past (28 px/f) at the lower right; 47.6 KM/S. Then the counter swaps to ABOUT 170,000 KM/H and
// speed streaks fly off the probe (36 px/f) while the flare breathes outward
// ================================================================================================================
const ShotFlare: ShotFC<CL01> = ({ f, c, len }) => {
  const T3 = c.c03 - c.c02;
  const g = Math.max(0, f - T3);
  const fx = 820;
  const fy = 430;
  const streaks = g > 0 ? 1 : 0;
  return (
    <Pop f={f}>
      <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(2, 1.12, 0.04, 0.02)} vignette={0.32} grain={0.5}>
        <SpaceField f={f} speed={30} angle={215} n={120} seed={22} />
        <Layer depth={1}>
          <Limb f={f} cx={1720} cy={1440} R={1100} shear={[28, -26, 30, -24, 28, -30]} seed={22} />
          {streaks
            ? Array.from({ length: 14 }, (_, i) => {
                const L = 2600;
                const u = wrap(g * 36 * (0.8 + (i % 4) * 0.12) + i * 190, L);
                const off = ((i * 137) % 700) - 350;
                const d = 0.6;
                const x0 = fx - Math.cos(0.61) * u - Math.sin(0.61) * off;
                const y0 = fy - Math.sin(0.61) * u + Math.cos(0.61) * off;
                return <line key={i} x1={x0} y1={y0} x2={x0 - Math.cos(0.61) * (160 + g * 3)} y2={y0 - Math.sin(0.61) * (160 + g * 3)} stroke="#FFD27A" strokeWidth={5} opacity={d} strokeLinecap="round" />;
              })
            : null}
          <Flare x={fx} y={fy} r={110 + g * 0.5} f={f} angle={35} strength={1} />
          <Capsule x={fx - 44} y={fy - 30} r={26} f={f} chips={6} glow={1} />
          <g transform={`rotate(-55 ${fx + 26} ${fy + 20})`}>
            <ShieldPlate x={fx + 26} y={fy + 20} r={70} f={f} glow={1} />
          </g>
        </Layer>
        <Layer depth={0}>
          <g opacity={1 - lin(g, 0, 8)}>
            <Roll x={110} y={960} k={lin(f, 2, 40)} rkey="kmps476" unit="KM/S" dec={1} size={140} />
          </g>
          {g > 2 ? (
            <g opacity={lin(g, 2, 10)}>
              <AboutPill x={120} y={800} size={32} />
              <Roll x={110} y={960} k={lin(g, 4, len - T3 - 30)} rkey="kmh170k" unit="KM/H" size={130} />
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-04 · the g-meter needle leaps to the top (10 f) and trembles (8 deg/f) while the probe shakes (±6 px at 3 f) inside its
// flare (sparks 28 px/f); the limb shears below; MORE THAN 200 TIMES GRAVITY (#2)
// ================================================================================================================
const ShotG: ShotFC<CL01> = ({ f, len }) => {
  const k = ez(f, 4, 14) * 0.9 + 0.05 * Math.sin(f * 1.7);
  const sh = Math.sin(f * 2.1) * 6;
  return (
    <Pop f={f}>
      <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(3, 1.1, 0.04)} vignette={0.3} grain={0.5}>
        <SpaceField f={f} speed={24} angle={215} n={110} seed={23} />
        <Layer depth={1}>
          <Limb f={f} cx={960} cy={780 + 2600} R={2600} shear={[22, -26, 20, -24, 26, -22]} seed={23} />
          <GMeter x={600} y={700} r={320} k={k} f={f} />
          <Flare x={1380 + sh} y={430 - sh * 0.5} r={80} f={f} angle={35} strength={0.85} />
          <Capsule x={1380 + sh} y={430 - sh * 0.5} r={70} f={f} chips={6} glow={0.6} tilt={sh} />
        </Layer>
        <Layer depth={0}>
          <Roll x={110} y={250} k={lin(f, 6, 36)} rkey="g200" prefix="MORE THAN" suffix="TIMES GRAVITY" size={120} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-05 + 1-06 · the air is the brake: the timer disc fills toward its two minutes (hand 12 deg/f), the flare thins, sparks
// stream up the wake (26 px/f), the decks rush up (26 px/f); ABOUT 2 MIN. The timer slides away, the canopy blooms
// (radius ~12 px/f) and snaps taut, the probe jerks up the frame (24 px/f), the cloud tops stream at 20 px/f
// ================================================================================================================
const ShotBrake: ShotFC<CL01> = ({ f, c }) => {
  const T6 = c.c06 - c.c05;
  const g = Math.max(0, f - T6);
  const out = ez(f, T6, T6 + 16);
  const py = 460 - 110 * ez(g, 0, 5) + 20 * ez(g, 5, 30);
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} shotFrame={f} drift={DRIFT(4, g > 0 ? 0.94 : 1.08, 0.03)} vignette={0.2} grain={0.5}>
        <Descent f={f} fam="deep" speed={g > 0 ? 20 : 26} seed={24} />
        <Layer depth={1}>
          <Wisps f={f} x={0} y={0} w={1920} h={1080} n={10} speed={g > 0 ? 20 : 30} color="#FFD27A" />
          {g <= 0 ? <Sparks f={f} x={1180} y={330} w={700} h={200} n={40} mode="trail" angle={270} speed={26} /> : null}
          <Flare x={1180} y={py} r={70} f={f} angle={90} strength={1 - lin(f, 0, T6)} />
          <Canopy x={1180} y={py} r={80} unfurl={lin(g, 0, 16)} f={f} />
          <Capsule x={1180} y={py} r={80} f={f} chips={6} jerk={lin(g, 10, 20)} />
          <g transform={`translate(${(-out * 1300).toFixed(1)} 0)`}>
            <TimerDisc x={520} y={470} r={220} k={lin(f, 0, T6 + 10)} f={f} />
            <AboutPill x={300} y={790} size={32} appear={lin(f, 4, 12)} />
            <MetricA x={290} y={930} value="2" unit="MIN" size={130} reveal={lin(f, 6, 14)} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-07 · the heat shield drops away below the probe, tumbling (16 deg/f) and falling out of frame (24 px/f) — drawn falling
// DOWN, as a released shield does (storyboard said "upward"; see review.md); the tape starts printing a wavering line
// (28 px/f); the decks scroll up (18 px/f)
// ================================================================================================================
const ShotShield: ShotFC<CL01> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={DEEP.theme} shotFrame={f} drift={DRIFT(5, 1.1, 0.04)} vignette={0.2} grain={0.5}>
      <Descent f={f} fam="deep" speed={18} seed={25} />
      <Layer depth={1}>
        <Canopy x={900} y={360} r={80} unfurl={1} f={f} />
        <Capsule x={900} y={360} r={80} f={f} chips={6} />
        <ShieldPlate x={900 + f * 4} y={470 + f * 24} r={92} f={f} glow={Math.max(0, 0.9 - f * 0.02)} tumble={16} />
        <rect x={80} y={900} width={1760} height={140} rx={24} fill="rgba(58,8,6,0.55)" />
        <TapeTrace f={f} x={120} y={970} w={1680} h={90} mode="wave" speed={28} />
      </Layer>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 1-08 + 1-09 · pull back: the small probe under its canopy in endless bands (18 px/f), the dotted floor line searching
// below and receding (36 px/f), the tape scrolling (24 px/f). Tilt up: the orbiter far above, data dots stream up to it
// (28 px/f), the dashed line to the tiny Earth draws (36 px/f) and is crossed out (F15); TO THE ORBITER
// ================================================================================================================
const ShotNoGround: ShotFC<CL01> = ({ f, c }) => {
  const T9 = c.c09 - c.c08;
  const A = (
    <Stage theme={DEEP.theme} shotFrame={f} drift={DRIFT(6, 0.92, 0.03)} vignette={0.2} grain={0.5}>
      <Descent f={f} fam="deep" speed={18} seed={26} />
      <Layer depth={1}>
        <Canopy x={960} y={300} r={40} unfurl={1} f={f} sway={10} />
        <Capsule x={960} y={300} r={40} f={f} chips={6} />
        <FloorSearch f={f} y={560} speed={36} span={380} />
        <rect x={80} y={920} width={1760} height={120} rx={24} fill="rgba(58,8,6,0.55)" />
        <TapeTrace f={f} x={120} y={980} w={1680} h={80} mode="wave" speed={24} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T9);
  const P: [number, number] = [760, 700];
  const O: [number, number] = [1380, 190];
  const E: [number, number] = [240, 130];
  const dl = lin(g, 6, 36);
  const ex: [number, number] = [lerp(P[0], E[0], 0.5), lerp(P[1], E[1], 0.5)];
  const B = (
    <Stage theme={DEEP.theme} shotFrame={g} drift={DRIFT(7, 1.1, 0.03, -0.02)} vignette={0.2} grain={0.5}>
      <Sky family={DEEP} stops={["#8E1A18", "#D8381C", "#F26A1E"]} />
      <Descent f={f} fam="deep" speed={16} y={560} h={520} seed={27} />
      <Layer depth={1}>
        <Orbiter x={O[0] + g * 2} y={O[1]} kind="galileo" f={g} size={0.9} />
        <DataDots f={g} x0={P[0]} y0={P[1] - 50} x1={O[0] + g * 2} y1={O[1] + 40} speed={28} n={10} />
        <line x1={P[0]} y1={P[1] - 40} x2={lerp(P[0], E[0], dl)} y2={lerp(P[1] - 40, E[1], dl)} stroke="#9FEFF8" strokeWidth={6} strokeDasharray="18 14" />
        {g > 40 ? (
          <g strokeLinecap="round" stroke={C.vermilion} strokeWidth={12} opacity={lin(g, 40, 48)}>
            <line x1={ex[0] - 40} y1={ex[1] - 50} x2={ex[0] + 40} y2={ex[1] + 30} />
            <line x1={ex[0] - 40} y1={ex[1] + 30} x2={ex[0] + 40} y2={ex[1] - 50} />
          </g>
        ) : null}
        <EarthDot x={E[0]} y={E[1]} size={30} f={g} />
        <Canopy x={P[0]} y={P[1]} r={46} unfurl={1} f={f} />
        <Capsule x={P[0]} y={P[1]} r={46} f={f} chips={6} />
      </Layer>
      <Layer depth={0}>
        <Plate x={1060} y={380} text="TO THE ORBITER" size={32} appear={lin(g, 10, 20)} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T9 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 1-10 · six instrument chips light one by one (8 f stagger), each pulsing a ring (20 px/f); the orbiter glides off toward
// the tiny Earth (receding), data dots stream to it (22 px/f); the decks scroll (16 px/f); 6 INSTRUMENTS (#4)
// ================================================================================================================
const ShotChips: ShotFC<CL01> = ({ f }) => {
  const X = 760;
  const Y = 600;
  const R = 200;
  const chips = lin(f, 6, 54) * 6;
  const ox = 1340 + f * 3;
  const oy = 200 - f * 0.6;
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} shotFrame={f} drift={DRIFT(8, 1.1, 0.04)} vignette={0.2} grain={0.5}>
        <Descent f={f} fam="deep" speed={16} seed={28} />
        <Layer depth={1}>
          <EarthDot x={1820} y={90} size={22} f={f} />
          <Orbiter x={ox} y={oy} kind="galileo" f={f} size={lerp(0.8, 0.45, lin(f, 0, 150))} />
          <DataDots f={f} x0={X + 120} y0={Y - 260} x1={ox} y1={oy + 30} speed={22} n={9} />
          <Canopy x={X} y={Y} r={R} unfurl={1} f={f} sway={3} />
          <Capsule x={X} y={Y} r={R} f={f} chips={chips} />
          {Array.from({ length: 6 }, (_, i) =>
            chips > i + 0.5 ? <Rings key={i} f={f - (6 + i * 8)} x={X - R * 0.62 + i * R * 0.25} y={Y + R * 0.15} speed={20} max={200} n={2} color={C.heard} width={7} /> : null,
          )}
        </Layer>
        <Layer depth={0}>
          <rect x={1100} y={790} width={760} height={190} rx={30} fill="rgba(58,8,6,0.6)" />
          <MetricA x={1140} y={930} value="6" unit="INSTRUMENTS" size={130} reveal={lin(f, 50, 60)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-11 · Tick's listening station: he throws the lamp switch (heave) and the BAR dial's rim lamps light around the arc
// (4 f stagger), the window shows the probe and the decks falling (20 px/f), the wall panels slide (5 px/f); THE DIAL: PRESSURE
// ================================================================================================================
const ShotStation: ShotFC<CL01> = ({ f }) => {
  const lever = -30 + 60 * ez(f, 2, 8);
  return (
    <Pop f={f}>
      <Stage theme={SCOPE.theme} shotFrame={f} drift={DRIFT(9, 1.1, 0.04)} vignette={0.16} grain={0.5}>
        <Station f={f} desk={860} win={{ x: 110, y: 110, w: 640, h: 400 }} winSpeed={20} seed={29} />
        <Layer depth={1}>
          <rect x={930} y={90} width={660} height={720} rx={40} fill={C.emeraldDeep} />
          <rect x={950} y={110} width={620} height={680} rx={30} fill="none" stroke={C.goldRim} strokeWidth={5} />
          <BarDial f={f} cx={1260} cy={450} r={290} needle={0} lit={lin(f, 8, 56) * 12} sweep={14} />
          <rect x={860} y={800} width={110} height={70} rx={14} fill="#8E1A18" />
          <g transform={`rotate(${lever} 915 810)`}>
            <rect x={908} y={700} width={14} height={110} rx={7} fill={C.goldRim} />
            <circle cx={915} cy={700} r={22} fill={C.vermilion} />
          </g>
          <Tick x={780} y={1050} pxPerM={254} frame={f} pose="heave" expression="determined" look={0.4} />
        </Layer>
        <Layer depth={0}>
          <KickerA x={140} y={630} text="THE DIAL: PRESSURE" appear={lin(f, 4, 12)} size={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-12 + 1-13 · the needle climbs slowly toward 4 (never reaching it inside the shot, so it never rests on an unsourced value,
// F6) while the tape runs into the reel (24 px/f) and the window's decks fall (20 px/f); Tick counts on his fingers. SLIDE:
// Tick (≥ 40 %) reads the tape running through his mitts (26 px/f) under a bouncing "!"
// ================================================================================================================
const ShotGauge: ShotFC<CL01> = ({ f, c, len }) => {
  const T13 = c.c13 - c.c12;
  const A = (
    <Stage theme={SCOPE.theme} shotFrame={f} drift={DRIFT(10, 1.1, 0.04)} vignette={0.16} grain={0.5}>
      <Station f={f} desk={880} win={{ x: 1180, y: 100, w: 620, h: 380 }} winSpeed={20} seed={30} />
      <Layer depth={1}>
        <rect x={290} y={110} width={660} height={700} rx={40} fill={C.emeraldDeep} />
        <BarDial f={f} cx={620} cy={450} r={290} needle={needleTo(0, 4, f / (len + 80))} lit={12} sweep={10} />
        <g transform="translate(2320 0) scale(-1 1)">
          <TapeTrace f={f} x={820} y={780} w={600} h={80} mode="wave" speed={24} />
        </g>
        <Reel x={1580} y={790} r={100} f={f} />
        <Tick x={1760} y={1050} pxPerM={150} frame={f} facing={-1} pose="think" expression="neutral" look={-0.4} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T13);
  const B = (
    <Stage theme={SCOPE.theme} shotFrame={g} drift={DRIFT(11, 1.12, 0.04)} vignette={0.16} grain={0.5}>
      <Station f={f} desk={900} win={{ x: 1240, y: 110, w: 580, h: 380 }} winSpeed={20} seed={31} />
      <Layer depth={1}>
        <rect x={120} y={700} width={1500} height={150} rx={24} fill="rgba(0,42,26,0.5)" />
        <TapeTrace f={f} x={140} y={775} w={1460} h={100} mode="jagged" speed={26} />
        <Tick x={760} y={1060} pxPerM={254} frame={g} pose="hold" expression="surprised" look={0.2} />
        <QuestionTag x={1000} y={260} f={g} mark="!" size={120} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T13 - 6} dur={14} kind="slide" a={A} b={B} />;
};

// ================================================================================================================

export const SceneL01: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL01(t);
  const shots: ShotDef<CL01>[] = [
    { from: 0, S: ShotStreak, id: "1-01" },
    { from: c.c02, S: ShotFlare, id: "1-02" }, // + 1-03
    { from: c.c04, S: ShotG, id: "1-04" },
    { from: c.c05, S: ShotBrake, id: "1-05" }, // + 1-06
    { from: c.c07, S: ShotShield, id: "1-07" },
    { from: c.c08, S: ShotNoGround, id: "1-08" }, // + 1-09
    { from: c.c10, S: ShotChips, id: "1-10" },
    { from: c.c11, S: ShotStation, id: "1-11" },
    { from: c.c12, S: ShotGauge, id: "1-12" }, // + 1-13
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL01 = (t: SceneTiming): Cue[] => {
  const c = cuesL01(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 6, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.c02),
    { at: c.c02 + 2, file: SFX.boom, vol: 0.34, dur: 120, fadeOut: 40 },
    { at: c.c03 - 2, file: SFX.whoosh, vol: 0.18, dur: 50 },
    ...cutHit(c.c04),
    { at: c.c04 + 6, file: SFX.boom, vol: 0.3, dur: 110, fadeOut: 40 },
    ...cutHit(c.c05),
    { at: c.c05 + 2, file: SFX.swirl, vol: 0.18, dur: 60 },
    { at: c.c06 + 2, file: SFX.pop, vol: 0.16, dur: 16 },
    ...cutHit(c.c07),
    { at: c.c07 + 4, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.c08),
    { at: c.c08, file: SFX.rumble, vol: 0.12, dur: c.c10 - c.c08, fadeIn: 20, fadeOut: 20 },
    ...run(c.c09 + 6, 5, 7),
    ...cutHit(c.c10),
    ...run(c.c10 + 6, 6, 8),
    ...cutHit(c.c11),
    { at: c.c11 + 6, file: SFX.pop, vol: 0.14, dur: 16 },
    ...run(c.c11 + 8, 12, 4, 0.06),
    ...cutHit(c.c12),
    ...run(c.c12 + 4, 6, 10),
    { at: c.c13 + 6, file: SFX.pop, vol: 0.16, dur: 16 },
  ];
};
