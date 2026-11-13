// L15 scene l04 "Gauge two: sound and cold" (storyboard §3 "4 ·", shots 4-01…4-18, script lines 31-38; petrol strip ↔
// void ↔ STUDIO_SET plates ↔ noon). ShotDefs (hard cuts; continuous rows are phases): 4-01 · 4-02 · 4-03+4-04+4-05 ·
// 4-06 · 4-07 · 4-08 · 4-09 · 4-10 · 4-11 · 4-12 · 4-13 · 4-14+4-15 · 4-16 · 4-17 · 4-18.
// Numbers drawn, each with its sources.md row (all from jumpdata.ts): 15 °C, −56.5 °C, −2.5 °C, −74.5 °C, ≈ −47 °C (#11
// TEMP_READ) · 20/30/50/80 km (#11 ATM rows) · 340 m/s, 295 m/s, 1,062 km/h, 1,086 km/h (#15 SOUND) · 34 s, 50 s, 16 s,
// 1,357.6 km/h, Mach 1.25 (#4 JUMPS.baumgartner) · 0 s (scale end). NO number for the mesosphere average or the
// thermosphere (row 10 secondary, F3): the temperature chart has words only on its axis and its profile above 80 km is a
// drawn shape. The SOUND mark is always soundSpeed(T) (F10). STANDARD ATMOSPHERE under each temperature (F6).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, CloudRack, IF2, Kicker, Layer, Motes, Sky, Stage, Tick, UnknownTag, alpha, cameraAt, mixHex, rnd } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L15_COLORS, LAYER_TOPS, familyOf, skyFamily } from "../families";
import { ATM, JUMPS, SOUND, TEMP_READ, soundSpeed } from "../jumpdata";
import { L15GaugesHUD, PushGauge, SpeedGauge, coldColor } from "../L15Gauges";
import { Bracket } from "../props";
import { altY } from "../sky";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Arrow, C, Perch, Pop, SkyBack, Slab, StudioSet, T_HI, T_LO, TempChart, XTag, cl01, ez, lerp, lin, num, rollText, tProfile } from "./b-parts";

const NOON = familyOf("noon");
const PET = familyOf("petrol");
const VOID = familyOf("void");
const STU = familyOf("studio");
const B = JUMPS.baumgartner; // #4
const KM20 = ATM[2].km; // #11
const KM30 = ATM[3].km; // #11
const STD = "STANDARD ATMOSPHERE";

export const cuesL04 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    strip: 0, // 4-01
    ground: p(0, "At the ground"), // 4-02
    twenty: p(0, "At twenty kilometres"), // 4-03
    fifty: p(0, "At fifty"), // 4-04 (phase)
    eighty: at(1), // 4-05 (phase)
    strato: p(1, "The stratosphere warms"), // 4-06
    meso: p(1, "The mesosphere"), // 4-07
    thermo: at(2), // 4-08
    swings: p(2, "So the temperature"), // 4-09
    plate: at(3), // 4-10
    sea: p(3, "At the ground"), // 4-11
    cool: at(4), // 4-12
    passed: at(5), // 4-13
    peak: p(5, "His peak"), // 4-14
    mach: p(5, "At Mach"), // 4-15 (phase)
    fits: at(6), // 4-16
    stopped: at(7), // 4-17
    earlier: p(7, "And it wasn't"), // 4-18
  };
};
export type CL04 = ReturnType<typeof cuesL04>;

const tempStd = (v: number, k: number, from: number) => rollText(v, k, Number.isInteger(v) ? 0 : 1, from);

// ===============================================================================================================
// 4-01 · gauge two lights: the temperature strip wipes up the ruler from the ground as the camera climbs; the profile
// and its bead ride the wipe; the COLD gauge lights. MOVER: ruler + flags scrolling (≈ 11 px/f) + strip wipe + bead.
// ===============================================================================================================
const ShotStrip: ShotFC<CL04> = ({ f, len }) => {
  const centre = 13 + 0.31 * f;
  const wipe = 1 + 0.42 * f;
  const top = centre + 15;
  const bot = centre - 15;
  const lit = ez(f, 4, 22);
  return (
    <Stage theme={skyFamily(centre).theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0.0, frames: len + 40, seed: 1 }} vignette={0.2} grain={0.4}>
      <Layer depth={1}>
        <SkyBack f={f} altTop={top} altBottom={bot} drift={0.4} />
        <TempChart f={f} altTop={top} altBottom={bot} wipe={wipe} head={wipe} bead={wipe} words={false} />
      </Layer>
      <Layer depth={0}>
        <rect x={60} y={64} width={830} height={70} rx={35} fill={alpha("#04121A", 0.55)} />
        <Kicker x={90} y={110} text="Gauge two · sound and cold" color={PET.text} size={28} />
        <Bloom x={1680} y={740} r={260} color={C.saffronCore} strength={0.5 * lit} />
        <Perch x={1320} y={1000} f={f} pose="press" poseTo="stand" poseT={ez(f, 24, 40)} expression="happy" facing={1} look={0.8} />
        <L15GaugesHUD family={PET} frame={f} theme="dark" speed={{ value: 0, appear: 0.35 }} air={{ value: 0.5, appear: 0.35 }} push={{ value: 0, appear: 0.35 }} cold={{ value: tProfile(Math.min(80, wipe)), appear: 0.4 + 0.6 * lit }} />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 4-02 · noon, the ground: the bead sits at the bottom with a warm-gold glow; counter to 15 °C.
// MOVER: counter + CloudRack (2.4 px/f) + push-in; the bead pulses.
// ===============================================================================================================
const ShotGround: ShotFC<CL04> = ({ f, len }) => {
  const k = ez(f, 6, 60);
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.16, panX: -0.03, panY: 0.03, frames: len + 20, seed: 2 }} vignette={0.12} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={6} altBottom={-0.4} drift={0.3} />
          <CloudRack f={f} n={6} x0={-300} x1={2200} y0={160} y1={620} size={64} speed={2.4} body={C.cloud} under={C.cloudShade} seed={4} />
          <TempChart f={f} altTop={6} altBottom={-0.4} bead={0.25} words={false} beadR={30} />
          <Bloom x={lerp(450, 1190, (TEMP_READ.sea - T_LO) / (T_HI - T_LO))} y={altY(0.25, 6, -0.4)} r={170 + Math.sin(f / 5) * 20} color={C.saffronCore} strength={0.7} />
        </Layer>
        <Layer depth={0}>
          <Slab x={520} y={430} value={tempStd(TEMP_READ.sea /* #11 */, k, 0)} unit="°C" size={120} F={PET} sub={STD} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-03 + 4-04 + 4-05 · the camera follows the bead up the profile: 20 km (−56.5, cold blue), 50 km (−2.5, saffron
// tint), 80 km (−74.5, deep indigo, black field). MOVER: bead rising (≈ 12-20 px/f) + ruler scrolling + counters.
// ===============================================================================================================
const ShotBead: ShotFC<CL04> = ({ f, len, c }) => {
  const s50 = c.fifty - c.twenty;
  const s80 = c.eighty - c.twenty;
  const bead = 1 + (KM20 - 1) * ez(f, 0, 44) + (ATM[5].km - KM20) * ez(f, s50 - 8, s50 + 34) + (ATM[7].km - ATM[5].km) * ez(f, s80, s80 + 48) + 0.05 * Math.max(0, f - s80 - 48);
  const centre = bead + 2 + 0.03 * f;
  const ph = f < s50 - 8 ? 0 : f < s80 ? 1 : 2;
  const val = [TEMP_READ.at20, TEMP_READ.at50, TEMP_READ.at80][ph]; // #11
  const from = [TEMP_READ.sea, TEMP_READ.at20, TEMP_READ.at50][ph]; // #11
  const k = [ez(f, 4, 48), ez(f, s50 - 6, s50 + 34), ez(f, s80, s80 + 50)][ph];
  return (
    <Pop f={f}>
      <Stage theme={skyFamily(centre).theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.0, frames: len + 40, seed: 3 }} vignette={0.25} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={centre + 12} altBottom={centre - 12} drift={0.5} aurora={cl01((centre - 70) / 10)} />
          <TempChart f={f} altTop={centre + 12} altBottom={centre - 12} head={bead} bead={bead} words={false} beadR={26} />
        </Layer>
        <Layer depth={0}>
          <Slab x={1220} y={250} value={tempStd(val, k, from)} unit="°C" size={100} F={ph === 2 ? VOID : PET} sub={STD} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-06 · the stratosphere section pulses warm, an up-arrow grows beside it; NO number. Tick traces it with the staff.
// MOVER: warm band wiping up (≈ 14 px/f) + arrow growing (3 px/f) + tilt-up.
// ===============================================================================================================
const ShotStrato: ShotFC<CL04> = ({ f, len }) => {
  const top = 62;
  const bot = -2.5;
  const Y = (a: number) => altY(a, top, bot);
  const w = LAYER_TOPS.tropo + (LAYER_TOPS.strato - LAYER_TOPS.tropo) * ez(f, 4, 56);
  const arrow = 380 * ez(f, 8, len - 6);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 660, zoom: 1.1 },
    { f: len, x: 880, y: 470, zoom: 1.12 },
  ]);
  const pulse = 0.35 + 0.25 * Math.sin(f / 4);
  return (
    <Pop f={f}>
      <Stage theme={PET.theme} cam={cam} vignette={0.2} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={top} altBottom={bot} drift={0.3} />
          <TempChart f={f} altTop={top} altBottom={bot} head={top} words={false} />
          <rect x={316} y={Y(w)} width={84} height={Y(LAYER_TOPS.tropo) - Y(w)} rx={12} fill={C.saffron} opacity={pulse} />
          <rect x={310} y={Y(w) - 5} width={96} height={10} rx={5} fill={C.saffronCore} />
          <Arrow x1={470} y1={Y(LAYER_TOPS.tropo) - 10} x2={470} y2={Y(LAYER_TOPS.tropo) - 10 - Math.max(4, arrow)} color={C.saffronCore} w={18} head={46} />
          <Tick x={640} y={Y(0) + 6} pxPerM={110} frame={f} facing={-1} pose="point" staff expression="thinking" look={0.3 + 0.4 * ez(f, 10, len)} headTilt={-20 * ez(f, 10, len)} />
        </Layer>
        <Layer depth={0}>
          <XTag x={720} y={120} text="STRATOSPHERE WARMS WITH HEIGHT" F={PET} dot={C.saffron} size={32} opacity={ez(f, 14, 26)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-07 · void: the mesosphere band in deep indigo with frost-teal shimmer rows streaming; the bead dips to the coldest
// layer; a down-arrow; NO number. MOVER: shimmer rows (6 px/f) + bead dipping (≈ 9 px/f). DARK.
// ===============================================================================================================
const ShotMeso: ShotFC<CL04> = ({ f, len }) => {
  const top = 98;
  const bot = 40;
  const Y = (a: number) => altY(a, top, bot);
  const bead = lerp(ATM[5].km, LAYER_TOPS.meso + 2, ez(f, 6, len - 20));
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 620, zoom: 1.08 },
    { f: len, x: 960, y: 470, zoom: 1.1 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={top} altBottom={bot} drift={0.6} aurora={0.35} />
          <rect x={160} y={Y(LAYER_TOPS.meso)} width={1240} height={Y(LAYER_TOPS.strato) - Y(LAYER_TOPS.meso)} fill={L15_COLORS.meso} opacity={0.32} />
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={i}
              x1={160}
              x2={1400}
              y1={Y(LAYER_TOPS.strato) - (i + 0.5) * ((Y(LAYER_TOPS.strato) - Y(LAYER_TOPS.meso)) / 9)}
              y2={Y(LAYER_TOPS.strato) - (i + 0.5) * ((Y(LAYER_TOPS.strato) - Y(LAYER_TOPS.meso)) / 9)}
              stroke={C.frost}
              strokeWidth={3}
              strokeDasharray="26 34"
              strokeDashoffset={(i % 2 ? 1 : -1) * f * 6}
              opacity={0.55}
            />
          ))}
          <TempChart f={f} altTop={top} altBottom={bot} head={bead} bead={bead} words={false} beadR={26} />
          <Arrow x1={1110} y1={Y(60)} x2={1110} y2={Y(60) + 60 + 200 * ez(f, 10, 60)} color={C.frost} w={18} head={46} />
        </Layer>
        <Layer depth={0}>
          <XTag x={560} y={110} text="MESOSPHERE · COLDEST LAYER" F={VOID} dot={C.frost} size={32} opacity={ez(f, 10, 22)} />
          <Perch x={1340} y={1000} f={f} pose="hold" expression="worried" facing={-1} look={0.4} tilt={Math.sin(f * 1.9) * 2.5} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-08 · void: above 85 km the strip flares vermilion-saffron, the bead soars, aurora ribbons ripple; NO number; the
// air is labelled thin. MOVER: bead soaring (≈ 16 px/f) + aurora (5 px/f) + tilt-up. DARK.
// ===============================================================================================================
const ShotThermo: ShotFC<CL04> = ({ f, len }) => {
  const lift = 0.06 * f;
  const top = 128 + lift;
  const bot = 66 + lift;
  const bead = lerp(LAYER_TOPS.meso + 1, 122, ez(f, 6, 60)) + lift * 0.5;
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.01, panY: -0.03, frames: len + 30, seed: 4 }} vignette={0.3} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={top} altBottom={bot} drift={0.6} aurora={1} />
          <TempChart f={f} altTop={top} altBottom={bot} head={bead} bead={bead} words={false} flare={ez(f, 4, 30)} beadR={28} />
          <Bloom x={330 + 28} y={altY(100, top, bot)} r={260} color={L15_COLORS.thermo} strength={0.35 * ez(f, 4, 30)} />
        </Layer>
        <Layer depth={0}>
          <XTag x={560} y={980} text="THERMOSPHERE · HOT, THIN AIR" F={VOID} dot={L15_COLORS.thermo} size={32} opacity={ez(f, 10, 22)} />
          <Perch x={1340} y={1000} f={f} pose="stand" poseTo="shield" poseT={ez(f, 8, 22)} expression="neutral" expressionTo="surprised" expressionT={ez(f, 8, 16)} facing={-1} look={0.2} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-09 · the whole profile draws up the ruler, zigzagging; the COLD bead reverses with each turn.
// MOVER: zigzag drawing head (≈ 26 px/f) + the COLD bead reversing + pull-back.
// ===============================================================================================================
const ShotZigzag: ShotFC<CL04> = ({ f, len }) => {
  const top = 114;
  const bot = -2;
  const head = lerp(0, 112, lin(f, 4, len - 30));
  const cam = cameraAt(f, [
    { f: 0, x: 800, y: 600, zoom: 1.12 },
    { f: len, x: 900, y: 540, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={top} altBottom={bot} drift={0.6} aurora={0.6} step={20} />
          <TempChart f={f} altTop={top} altBottom={bot} head={head} bead={head} flare={1} />
        </Layer>
        <Layer depth={0}>
          <XTag x={260} y={110} text="UP · DOWN · UP · DOWN · UP" F={VOID} dot={C.saffron} size={32} opacity={ez(f, 8, 20)} />
          <Perch x={1330} y={1000} f={f} pose="stand" expression="happy" facing={1} look={Math.sin(f / 12) * 0.8} headTilt={Math.sin(f / 12) * 10} />
          <L15GaugesHUD family={VOID} frame={f} theme="light" only={["cold"]} cold={{ value: tProfile(head) }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Studio plates (4-10 … 4-12): a thermometer joined by a rod to the SPEED dial; the SOUND mark follows the thermometer.
// ===============================================================================================================
const Thermo: React.FC<{ x: number; y: number; h: number; tC: number; f: number }> = ({ x, y, h, tC, f }) => {
  const k = cl01((tC - T_LO) / (T_HI - T_LO));
  const col = coldColor(tC);
  return (
    <g>
      <rect x={x - 34} y={y - 10} width={68} height={h + 40} rx={34} fill={alpha("#04121A", 0.7)} stroke={C.bone} strokeWidth={4} />
      <rect x={x - 16} y={y + h * (1 - k)} width={32} height={h * k + 30} rx={16} fill={col} />
      <circle cx={x} cy={y + h + 60} r={62} fill={alpha("#04121A", 0.7)} stroke={C.bone} strokeWidth={4} />
      <circle cx={x} cy={y + h + 60} r={48} fill={col} />
      <circle cx={x - 16} cy={y + h + 44} r={12} fill="#FFFFFF" opacity={0.5} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={x + 34} y1={y + (i * h) / 8} x2={x + 52} y2={y + (i * h) / 8} stroke={C.bone} strokeWidth={3} />
      ))}
      <rect x={x - 6} y={y + h * (1 - k) - 3} width={12} height={6} rx={3} fill="#FFFFFF" opacity={0.6 + 0.4 * Math.sin(f / 3)} />
    </g>
  );
};
const Fan: React.FC<{ x: number; y: number; r: number; f: number }> = ({ x, y, r, f }) => (
  <g>
    <circle cx={x} cy={y} r={r + 10} fill="none" stroke={C.bone} strokeWidth={5} />
    <g transform={`translate(${x} ${y}) rotate(${f * 28})`}>
      {[0, 120, 240].map((a) => (
        <ellipse key={a} cx={0} cy={-r * 0.5} rx={r * 0.26} ry={r * 0.5} fill={C.frost} transform={`rotate(${a})`} />
      ))}
    </g>
    <circle cx={x} cy={y} r={10} fill={C.saffron} />
    <line x1={x} y1={y + r + 10} x2={x} y2={y + r + 80} stroke={C.bone} strokeWidth={8} strokeLinecap="round" />
  </g>
);

const ShotPlate: ShotFC<CL04> = ({ f, len }) => {
  const tC = -60 + 75 * (0.5 - 0.5 * Math.cos(f / 19));
  return (
    <Pop f={f}>
      <Stage theme={STU.theme} shotFrame={f} drift={{ zoom: 1.14, panX: 0.03, panY: 0.02, frames: len + 20, seed: 5 }} vignette={0.12} grain={0.4}>
        <StudioSet
          f={f + 120}
          seed={7}
          hud={<XTag x={110} y={110} text="SOUND ← TEMPERATURE, NOT THICKNESS" F={STU} dot={C.saffron} size={30} opacity={ez(f, 8, 20)} />}
        >
          <rect x={560} y={470} width={420} height={18} rx={9} fill={C.saffronDeep} />
          <Thermo x={560} y={210} h={460} tC={tC} f={f} />
          <SpeedGauge x={860} y={230} s={{ value: 0, soundT: tC, max: 400 }} f={f} family={STU} theme="dark" scale={1.5} />
          <Bloom x={560} y={730} r={200 + 30 * Math.sin(f / 6)} color={C.saffronCore} strength={0.45 * (0.5 - 0.5 * Math.cos(f / 19))} />
          <Tick x={330} y={860} pxPerM={150} frame={f} facing={1} pose="hold" lamp expression="happy" look={0.3} headTilt={Math.sin(f / 10) * 6} />
        </StudioSet>
      </Stage>
    </Pop>
  );
};

// 4-11 · close on the dial: the SOUND mark slides up to the ground's 15 °C and lands at 340 m/s.
const ShotSea: ShotFC<CL04> = ({ f, len }) => {
  const tC = lerp(T_LO, TEMP_READ.sea, ez(f, 4, 60));
  const k = ez(f, 30, 90);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len, x: 900, y: 500, zoom: 1.14 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={STU.theme} cam={cam} vignette={0.12} grain={0.4}>
        <StudioSet f={f + 260} seed={8}>
          <SpeedGauge x={330} y={60} s={{ value: 0, soundT: tC, max: 360, soundReadout: f > 90 ? SOUND.sea : undefined }} f={f} family={STU} theme="dark" scale={2.6} />
        </StudioSet>
        <Layer depth={0}>
          <Slab x={1310} y={820} value={rollText(SOUND.sea /* #15 */, k)} unit="m/s" size={110} F={PET} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 4-12 · Tick chills the thermometer with a fan: the mark slides down to 295 m/s (= 1,062 km/h) and stops.
const ShotCool: ShotFC<CL04> = ({ f, len }) => {
  const tC = lerp(TEMP_READ.sea, TEMP_READ.at20, ez(f, 6, 90));
  const k = ez(f, 40, 110);
  return (
    <Pop f={f}>
      <Stage theme={STU.theme} shotFrame={f} drift={{ zoom: 1.14, panX: -0.03, panY: 0.02, frames: len + 20, seed: 6 }} vignette={0.12} grain={0.4}>
        <StudioSet
          f={f + 380}
          seed={9}
          hud={
            <g>
              <Slab x={1010} y={190} value={rollText(SOUND.at20 /* #15 */, k, 0, SOUND.sea)} unit="m/s" size={100} F={PET} />
              <XTag x={1010} y={330} text={`${num(SOUND.at20kmh) /* #15 */} km/h`} F={STU} dot={C.saffron} size={34} opacity={ez(f, 100, 112)} />
            </g>
          }
        >
          <rect x={560} y={470} width={330} height={18} rx={9} fill={C.saffronDeep} />
          <Thermo x={560} y={210} h={460} tC={tC} f={f} />
          <SpeedGauge x={820} y={420} s={{ value: 0, soundT: tC, max: 360 }} f={f} family={STU} theme="dark" scale={1.25} />
          <Fan x={330} y={600} r={78} f={f} />
          <Tick x={190} y={860} pxPerM={150} frame={f} facing={1} pose="hold" expression="determined" look={0.3} />
          <Motes frame={f} n={18} x={380} y={420} w={200} h={340} color={alpha(C.frost, 0.9)} seed={3} size={5} drift={60} />
        </StudioSet>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// The 4-13 … 4-18 timeline strip: 0 s · 34 s · 50 s (#4), a sketch of the speed rising and falling (shape only, no
// readout), a SOUND line where the fall passed the speed of sound.
// ===============================================================================================================
const TX0 = 160;
const PXS = 19; // px per second
const TY = 800;
const tx = (s: number) => TX0 + s * PXS;
const vShape = (s: number) => (s <= B.peakAtS ? Math.pow(s / B.peakAtS, 0.58) : 1 - (s - B.peakAtS) * 0.022); // shape only
const vY = (s: number) => TY - 70 - vShape(s) * 420;
const MAXV = 420; // dial scale for these shots (m/s at the stop; no readout)
const VPEAK = B.topKmh / 3.6; // #4 m/s, drives the needle only
const SOUND_T = TEMP_READ.at30; // #11 the air his Mach number fits (4-16)
const speedAt = (s: number) => (VPEAK * vShape(s)) / MAXV;

const TimeStrip: React.FC<{ f: number; s: number; flag?: number; peakLabel?: number; underline?: number; tail?: number }> = ({ f, s, flag = 0, peakLabel = 0, underline = 0, tail = 62 }) => {
  const pts: string[] = [];
  for (let u = 0; u <= s; u += 0.5) pts.push(`${tx(u).toFixed(1)} ${vY(u).toFixed(1)}`);
  pts.push(`${tx(s).toFixed(1)} ${vY(s).toFixed(1)}`);
  const sy = vY(B.soundAtS);
  return (
    <g>
      <line x1={TX0} y1={sy} x2={tx(tail)} y2={sy} stroke={C.limb} strokeWidth={4} strokeDasharray="12 10" opacity={0.85} />
      <text x={tx(tail) + 10} y={sy + 8} style={{ fontFamily: IF2.label, fontSize: 22, letterSpacing: 3, fill: C.limb }}>
        SOUND
      </text>
      <path d={"M" + pts.join(" L")} fill="none" stroke={alpha(C.saffron, 0.35)} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
      <path d={"M" + pts.join(" L")} fill="none" stroke={C.saffronCore} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={TX0 - 20} y={TY - 12} width={tx(tail) - TX0 + 40} height={24} rx={12} fill={alpha("#04121A", 0.7)} stroke={C.bone} strokeWidth={2} />
      <rect x={TX0} y={TY - 6} width={Math.max(0, tx(s) - TX0)} height={12} rx={6} fill={L15_COLORS.vermilion} />
      {[0, B.soundAtS, B.peakAtS].map((v) => (
        <g key={v}>
          <line x1={tx(v)} y1={TY + 14} x2={tx(v)} y2={TY + 34} stroke={C.bone} strokeWidth={3} />
          <text x={tx(v)} y={TY + 70} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 34, fill: C.bone }}>
            {v}
            <tspan style={{ fontSize: 22, fontWeight: 600 }}> s</tspan>
          </text>
        </g>
      ))}
      <circle cx={tx(s)} cy={TY} r={20} fill={C.saffronCore} stroke={L15_COLORS.vermilion} strokeWidth={5} />
      <circle cx={tx(s)} cy={vY(s)} r={12} fill={C.saffronCore} />
      <Bloom x={tx(s)} y={vY(s)} r={60} color={C.saffronCore} strength={0.7} />
      {flag > 0 ? (
        <g transform={`translate(${tx(B.soundAtS)} ${sy}) scale(${flag})`}>
          <line x1={0} y1={0} x2={0} y2={-110} stroke={C.bone} strokeWidth={4} />
          <path d="M0 -110 L110 -88 L0 -66 Z" fill={C.limb} />
          <text x={12} y={-80} style={{ fontFamily: IF2.label, fontSize: 18, letterSpacing: 2, fill: "#04121A" }}>
            SOUND
          </text>
        </g>
      ) : null}
      {peakLabel > 0 ? (
        <text x={tx(B.peakAtS)} y={vY(B.peakAtS) - 40} textAnchor="middle" opacity={peakLabel} style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 4, fill: C.saffronCore }}>
          PEAK
        </text>
      ) : null}
      {underline > 0 ? <rect x={tx(B.peakAtS) - 70} y={vY(B.peakAtS) - 26} width={140 * underline} height={12} rx={6} fill={L15_COLORS.vermilion} /> : null}
    </g>
  );
};
const PetBack: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky stops={[mixHex(PET.sky[0], "#04121A", 0.5), PET.sky[0], PET.sky[1]]} />
    <Motes frame={f} n={30} x={-200} y={0} w={2300} h={1080} color={alpha(C.bone, 0.7)} seed={5} size={4} drift={30} />
  </g>
);

// 4-13 · the marker sweeps 0 → 34 s; the SOUND flag pops; the needle passes the SOUND mark.
const ShotPassed: ShotFC<CL04> = ({ f, len }) => {
  const s = B.soundAtS * ez(f, 6, 100) + 0.04 * Math.max(0, f - 100);
  const flag = ez(f, 98, 110);
  return (
    <Pop f={f}>
      <Stage theme={PET.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.0, frames: len + 30, seed: 7 }} vignette={0.2} grain={0.4}>
        <Layer depth={1}>
          <PetBack f={f} />
          <TimeStrip f={f} s={s} flag={flag} />
        </Layer>
        <Layer depth={0}>
          <XTag x={160} y={110} text={`${B.soundAtS} s · SOUND PASSED` /* #4 */} F={PET} dot={C.limb} size={32} opacity={ez(f, 100, 112)} />
          <Perch x={1320} y={1000} f={f} pose="stand" expression="neutral" facing={-1} look={0.3} headTilt={Math.sin(f / 15) * 5} />
          <L15GaugesHUD family={PET} frame={f} theme="dark" only={["speed"]} speed={{ value: speedAt(s), soundT: SOUND_T, max: MAXV }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 4-14 + 4-15 · the marker rushes on to 50 s (PEAK; the needle at its high point); then the STUDIO plate slides in and
// Tick chalks 1,357.6 ÷ 1.25 → 1,086 km/h. MOVER: marker (≈ 20 px/f) + needle → plate slide → chalk head + counter.
const ShotPeakSum: ShotFC<CL04> = ({ f, len, c }) => {
  const m = c.mach - c.peak;
  const s = B.soundAtS + (B.peakAtS - B.soundAtS) * ez(f, 2, 28) + 0.03 * Math.max(0, f - 28);
  const slide = ez(f, m - 4, m + 14);
  const g = f - m;
  const chalk = cl01((g - 6) / 50);
  const k = ez(g, 50, 100);
  const line1 = `${num(B.topKmh)} km/h ÷ ${B.mach}`; // #4
  return (
    <AbsoluteFill>
      {slide < 1 ? (
        <Pop f={f}>
          <Stage theme={PET.theme} shotFrame={f} drift={{ zoom: 1.08, panX: -0.03, panY: 0.0, frames: len, seed: 8 }} vignette={0.2} grain={0.4}>
            <Layer depth={1}>
              <PetBack f={f} />
              <TimeStrip f={f} s={s} flag={1} peakLabel={ez(f, 24, 32)} />
            </Layer>
            <Layer depth={0}>
              <XTag x={160} y={110} text={`${B.peakAtS} s · PEAK` /* #4 */} F={PET} dot={C.saffron} size={32} opacity={ez(f, 26, 36)} />
              <L15GaugesHUD family={PET} frame={f} theme="dark" only={["speed"]} speed={{ value: speedAt(s), soundT: SOUND_T, max: MAXV }} />
            </Layer>
          </Stage>
        </Pop>
      ) : null}
      {slide > 0 ? (
        <AbsoluteFill style={{ transform: `translateX(${(1 - slide) * 1920}px)` }}>
          <Stage theme={STU.theme} shotFrame={Math.max(0, g)} drift={{ zoom: 1.1, panX: 0.03, panY: 0.01, frames: len - m + 20, seed: 9 }} vignette={0.12} grain={0.4}>
            <StudioSet f={f + 500} seed={10} hud={<Slab x={330} y={960} value={rollText(SOUND.at30kmh /* #15 */, k)} unit="km/h" size={96} F={PET} />}>
              <rect x={160} y={180} width={1060} height={480} rx={24} fill={mixHex(PET.sky[0], "#04121A", 0.4)} stroke={C.saffronDeep} strokeWidth={14} />
              <defs>
                <clipPath id="l04chalk">
                  <rect x={200} y={220} width={960 * chalk} height={200} />
                </clipPath>
              </defs>
              <g clipPath="url(#l04chalk)">
                <text x={230} y={360} style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: 86, fill: C.bone, letterSpacing: 1 }}>
                  {line1}
                </text>
              </g>
              {chalk > 0 && chalk < 1 ? <circle cx={200 + 960 * chalk} cy={330} r={10} fill={C.saffronCore} /> : null}
              <text x={230} y={560} opacity={ez(g, 50, 60)} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 86, fill: C.saffronCore }}>
                = {rollText(SOUND.at30kmh, k)}
                <tspan style={{ fontSize: 46 }}> km/h</tspan>
              </text>
              <text x={230} y={620} opacity={ez(g, 60, 70)} style={{ fontFamily: IF2.label, fontSize: 22, letterSpacing: 3, fill: C.limb }}>
                THE LOCAL SPEED OF SOUND
              </text>
              <Tick x={1340} y={860} pxPerM={150} frame={f} facing={-1} pose={chalk < 1 ? "point" : "hips"} staff expression={chalk < 1 ? "determined" : "proud"} look={0.4} />
            </StudioSet>
          </Stage>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ===============================================================================================================
// 4-16 · the bead rises to the 30 km mark (≈ −47 °C); a match tick pops on the SOUND mark (Mach 1.25 fits there).
// MOVER: bead rising (≈ 12 px/f) + ruler scrolling + match tick popping.
// ===============================================================================================================
const ShotFits: ShotFC<CL04> = ({ f, len }) => {
  const bead = lerp(8, KM30, ez(f, 4, 100));
  const centre = bead + 3 + 0.05 * Math.max(0, f - 100);
  const top = centre + 10;
  const bot = centre - 10;
  const tick = ez(f, 104, 114);
  return (
    <Pop f={f}>
      <Stage theme={skyFamily(centre).theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.0, frames: len + 30, seed: 10 }} vignette={0.2} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={top} altBottom={bot} drift={0.5} pins={[{ altKm: KM30, label: "standard atmosphere", draw: ez(f, 90, 120), len: 1100 }]} />
          <TempChart f={f} altTop={top} altBottom={bot} head={bead} bead={bead} words={false} beadR={26} />
        </Layer>
        <Layer depth={0}>
          <XTag x={560} y={980} text={`≈ ${num(TEMP_READ.at30)} °C` /* #11 */} F={PET} dot={C.limb} size={34} opacity={ez(f, 100, 112)} />
          <XTag x={900} y={980} text={`${KM30} km` /* #11 */} F={PET} dot={C.saffron} size={34} opacity={ez(f, 100, 112)} />
          <L15GaugesHUD family={PET} frame={f} theme="dark" only={["speed", "cold"]} speed={{ value: VPEAK / MAXV, soundT: tProfile(bead), max: MAXV, mach: B.mach }} cold={{ value: tProfile(bead) }} />
          {tick > 0 ? (
            <g transform={`translate(1640 150) scale(${tick * (1 + 0.3 * (1 - tick))})`}>
              <circle cx={0} cy={0} r={30} fill={C.saffron} />
              <path d="M-14 0 L-4 11 L15 -11" fill="none" stroke="#1A1206" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// 4-17 · Tick underlines PEAK and jabs it; the speed curve and the SPEED needle turn back. MOVER: underline head (40 px/f)
// + curve head + needle reversing + push to the dial.
const ShotStopped: ShotFC<CL04> = ({ f, len }) => {
  const s = B.peakAtS + 9 * lin(f, 0, len);
  const ul = cl01((f - 10) / 8);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 540, zoom: 1.0 },
    { f: len, x: 1300, y: 420, zoom: 1.32 },
  ]);
  const jab = f > 26 ? Math.max(0, Math.sin((f - 26) / 4)) : 0;
  return (
    <Pop f={f}>
      <Stage theme={PET.theme} cam={cam} vignette={0.2} grain={0.4}>
        <Layer depth={1}>
          <PetBack f={f} />
          <TimeStrip f={f} s={s} flag={1} peakLabel={1} underline={ul} />
          <Tick x={1220} y={TY - 14} pxPerM={110} frame={f} facing={-1} pose={jab > 0.5 ? "press" : "point"} staff expression="determined" look={0.5} />
        </Layer>
        <Layer depth={0}>
          <L15GaugesHUD family={PET} frame={f} theme="dark" only={["speed"]} speed={{ value: speedAt(B.peakAtS) - 0.3 * ez(f, 20, 70), ghost: speedAt(B.peakAtS), soundT: SOUND_T, max: MAXV }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 4-18 · void: a bracket from 34 s to 50 s labelled 16 s; a '?' blinks on the PUSH gauge (something pushing back).
// MOVER: bracket drawing (14 px/f) + '?' blinking + pull-back + star stream. DARK.
const ShotEarlier: ShotFC<CL04> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.25 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  const blink = Math.floor(f / 9) % 2 === 0 ? 1 : 0.15;
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={110} altBottom={90} drift={3} streak={10} ruler={false} bands={false} />
          <TimeStrip f={f} s={B.peakAtS + 3} flag={1} peakLabel={1} />
          <Bracket x1={tx(B.soundAtS)} y1={TY + 120} x2={tx(B.peakAtS)} y2={TY + 120} draw={lin(f, 6, 30)} label={`${B.gapS} s` /* #4 arithmetic */} color={C.saffron} />
          <Tick x={1200} y={TY - 14} pxPerM={100} frame={f} facing={1} pose="think" expression="thinking" look={0.9} headTilt={Math.sin(f / 16) * 6} />
        </Layer>
        <Layer depth={0}>
          <XTag x={160} y={110} text={`${B.gapS} s EARLIER`} F={VOID} dot={C.saffron} size={32} opacity={ez(f, 24, 36)} />
          <PushGauge x={1480} y={250} s={{ value: 1.5, unknown: true, pinned: true }} f={f} family={VOID} theme="light" scale={1.9} />
          <g opacity={blink}>
            <UnknownTag x={1769} y={565} size={58} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL04: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL04(t);
  const shots: ShotDef<CL04>[] = [
    { from: 0, S: ShotStrip, id: "4-01" },
    { from: c.ground, S: ShotGround, id: "4-02" },
    { from: c.twenty, S: ShotBead, id: "4-03" }, // + 4-04, 4-05
    { from: c.strato, S: ShotStrato, id: "4-06" },
    { from: c.meso, S: ShotMeso, id: "4-07" },
    { from: c.thermo, S: ShotThermo, id: "4-08" },
    { from: c.swings, S: ShotZigzag, id: "4-09" },
    { from: c.plate, S: ShotPlate, id: "4-10" },
    { from: c.sea, S: ShotSea, id: "4-11" },
    { from: c.cool, S: ShotCool, id: "4-12" },
    { from: c.passed, S: ShotPassed, id: "4-13" },
    { from: c.peak, S: ShotPeakSum, id: "4-14" }, // + 4-15
    { from: c.fits, S: ShotFits, id: "4-16" },
    { from: c.stopped, S: ShotStopped, id: "4-17" },
    { from: c.earlier, S: ShotEarlier, id: "4-18" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL04 = (t: SceneTiming): Cue[] => {
  const c = cuesL04(t);
  const clicks = (at: number, n: number, gap = 7, vol = 0.06): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 7 }));
  return [
    { at: 6, file: SFX.click, vol: 0.14, dur: 10 },
    { at: 20, file: SFX.chime, vol: 0.18, dur: 60 },
    ...cutHit(c.ground),
    ...clicks(c.ground + 6, 6),
    ...cutHit(c.twenty),
    ...clicks(c.twenty + 4, 6),
    ...clicks(c.fifty - 4, 5),
    ...cutHit(c.eighty, 0.12),
    ...clicks(c.eighty + 2, 6),
    ...cutHit(c.strato),
    { at: c.strato + 6, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...cutHit(c.meso),
    { at: c.meso, file: SFX.wind, vol: 0.14, dur: c.thermo - c.meso, fadeIn: 12, fadeOut: 12 },
    ...cutHit(c.thermo),
    { at: c.thermo + 4, file: SFX.riser, vol: 0.14, dur: c.swings - c.thermo, fadeIn: 6, fadeOut: 10 },
    ...cutHit(c.swings),
    ...clicks(c.swings + 10, 5, 22, 0.08),
    ...cutHit(c.plate),
    { at: c.plate + 10, file: SFX.popLong, vol: 0.18, dur: 30 },
    ...cutHit(c.sea),
    ...clicks(c.sea + 30, 8),
    ...cutHit(c.cool),
    ...clicks(c.cool + 40, 8),
    ...cutHit(c.passed),
    ...clicks(c.passed + 10, 10, 9),
    { at: c.passed + 100, file: SFX.pop, vol: 0.2, dur: 16 },
    ...cutHit(c.peak),
    ...clicks(c.peak + 4, 4, 6),
    { at: c.mach - 4, file: SFX.whoosh, vol: 0.16, dur: 30 },
    ...clicks(c.mach + 56, 7),
    ...cutHit(c.fits),
    { at: c.fits + 104, file: SFX.chime, vol: 0.2, dur: 60 },
    ...cutHit(c.stopped),
    { at: c.stopped + 10, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.earlier),
    { at: c.earlier + 4, file: SFX.riser, vol: 0.12, dur: t.frames - c.earlier, fadeIn: 10, fadeOut: 20 },
  ];
};
