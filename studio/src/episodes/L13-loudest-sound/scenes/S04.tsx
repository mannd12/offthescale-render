// L13 scene l04 "The loudest machine" (storyboard §3 "4 · The loudest machine": shots 4-01…4-15; script lines 27-33 =
// scene lines 0-6; families dusk → STUDIO_SET → noon → dusk; Act II). Package II builder.
// Every number drawn carries its sources.md row in a comment. F4: 203 / 170 / 200 are sound POWER, so they live on the
// gold PowerMeter (or the bulb's wattage plate, the power analogy), never on the vermilion air gauge, which is absent
// from this scene. F20: the myth bubbles carry a "MYTH" pill.
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  CloudRack,
  CycClouds,
  Embers,
  Emissive,
  GroundShadow,
  Kicker,
  Layer,
  LightWash,
  Metric,
  P,
  Pill,
  Plume,
  STUDIO_SET,
  Sky,
  Stage,
  Streamers,
  Tick,
  ZoomThrough,
  alpha,
  cameraAt,
  cutPop,
  mixHex,
  rnd,
  roundPoly,
} from "../../../lib/illustrated";
import type { CamKey } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L13_COLORS, familyOf, pillFill } from "../families";
import { POWER, PowerMeter } from "../PowerMeter";
import { Bulb, JetEngine, SaturnV, SurveyMap } from "../props";
import { Rings } from "../sound";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";

const DUSK = familyOf("dusk");
const NOON = familyOf("noon");
const STUDIO = STUDIO_SET;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number, a = 0, b = 1) => {
  const u = clamp01((t - a) / (b - a));
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const cam = (f: number, keys: CamKey[]) => {
  const c = cameraAt(f, keys);
  return { ...c, zoom: c.zoom * cutPop(f, 0) };
};

export const cuesL04 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    pad: 0, // 4-01 dawn pad, the Saturn V
    myth: p(0, "and the internet"), // 4-02 the myth bubbles
    crowd: p(0, "In twenty twenty-two"), // 4-03 the acousticians walk on
    model: at(1), // 4-04 the model liftoff
    power: p(1, "about two hundred and three", -10), // 4-05 the POWER meter locks at 203
    bulb: at(2), // 4-06 Tick screws in the bulb
    plate: p(2, "like the wattage"), // 4-07 the wattage plate
    walk: at(3), // 4-08 Tick walks away; the light pool shrinks
    swap: p(3, "Mix the two up"), // 4-09 labels swap, the block slumps
    engine: at(4), // 4-10 one jet engine (pull back continues into 4-11)
    ten: p(4, "a hundred and seventy"), // 4-11 ten engines (same shot)
    grid: p(4, "two hundred is"), // 4-12 the 10,000-engine grid
    heat: p(4, "And the concrete?"), // 4-13 the plume's heat on the pad
    settle: at(6), // 4-14 the steam settles (PUSH into 4-15)
    turn: p(6, "Now the one"), // 4-15 Tick turns to the plume at sea (same shot), ZT to the survey map
    last: end(6),
    end: t.frames,
  };
};
export type CL04 = ReturnType<typeof cuesL04>;

// ---- the dawn pad (shared set dressing inside this scene; the shots on it are each staged differently) ------------
const GROUND_Y = 860;
const CONCRETE = "#D99A5E";
const CONCRETE_SHADE = "#9A5E3A";
const STEAM = { body: "#FFE4C6", under: "#E39A72", top: "#FFF6EA" };

const PadSet: React.FC<{ f: number; sea?: boolean; tower?: boolean }> = ({ f, sea = false, tower = true }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={DUSK} />
      <Bloom x={1660} y={640} r={420} color={DUSK.light} strength={0.55} spread={0.5} />
    </Layer>
    <Layer depth={0.35}>
      {/* far hills, or the sea at the right of frame (4-15) */}
      <path d={`M-400 ${GROUND_Y - 120} Q 300 ${GROUND_Y - 190} 900 ${GROUND_Y - 130} T 2400 ${GROUND_Y - 150} V 1400 H -400 Z`} fill={mixHex(DUSK.far, DUSK.sky[2], 0.25)} />
      {sea ? <rect x={1100} y={GROUND_Y - 150} width={1500} height={700} fill={mixHex(DUSK.sky[1], DUSK.sky[2], 0.35)} /> : null}
      {sea ? <path d={`M1100 ${GROUND_Y - 150} H 2600`} stroke={DUSK.light} strokeWidth={3} opacity={0.7} /> : null}
    </Layer>
    <Layer depth={1}>
      <rect x={-600} y={GROUND_Y} width={sea ? 1900 : 3200} height={700} fill={CONCRETE} />
      <rect x={-600} y={GROUND_Y} width={sea ? 1900 : 3200} height={14} fill={mixHex(CONCRETE, "#FFF2D8", 0.4)} />
      {/* expansion joints on the pad slide with the camera */}
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1={-500 + i * 200} y1={GROUND_Y + 14} x2={-700 + i * 260} y2={1400} stroke={CONCRETE_SHADE} strokeWidth={3} opacity={0.35} />
      ))}
      {tower ? (
        <g>
          <rect x={1140} y={GROUND_Y - 700} width={70} height={700} fill={mixHex(DUSK.mid, "#7A2E1C", 0.35)} />
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={`M1140 ${GROUND_Y - 700 + i * 50} L1210 ${GROUND_Y - 650 + i * 50}`} stroke={mixHex(DUSK.light, "#C46A2C", 0.5)} strokeWidth={4} />
          ))}
          <rect x={1206} y={GROUND_Y - 700} width={8} height={700} fill={DUSK.light} opacity={0.7} />
        </g>
      ) : null}
    </Layer>
  </>
);

// 4-01 · dawn launch pad: the Saturn V, Tick a fleck at its base looking up; vent steam rolls off the pad
const ShotPad: ShotFC<CL04> = ({ f, len }) => {
  const look = sm(f, 10, 40);
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 700, zoom: 1.25 }, { f: len + 10, x: 960, y: 470, zoom: 1.05 }])} vignette={0.22} grain={0.5}>
      <PadSet f={f} />
      <Layer depth={1}>
        <SaturnV x={960} y={GROUND_Y} h={720} family={DUSK} light={15} />
        <GroundShadow x={960} y={GROUND_Y + 6} rx={120} ry={16} />
        <Tick x={1060} y={GROUND_Y} pxPerM={46} frame={f} facing={-1} pose="stand" expression="surprised" headTilt={look * 30} look={0.4} />
        <CloudRack f={f} n={6} x0={-500} x1={2400} y0={GROUND_Y - 30} y1={GROUND_Y + 40} size={160} speed={3} body={STEAM.body} under={STEAM.under} top={STEAM.top} seed={3} />
        <Streamers f={f} n={16} x0={-200} x1={2200} y0={300} y1={760} len={90} width={3} speed={5} color="#FFF4E0" opacity={0.45} seed={2} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="SATURN V · 1960s" /* #14 */ fill={pillFill(DUSK)} color={DUSK.text} dot={DUSK.light} size={20} />
      </Layer>
    </Stage>
  );
};

// 4-02 · "the internet decided": comment bubbles pop in around the pad: a melting block, a burning tuft "1 mile" (F20)
const Bubble: React.FC<{ x: number; y: number; w: number; h: number; s: number; tail: 1 | -1; children: React.ReactNode }> = ({ x, y, w, h, s, tail, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s.toFixed(3)})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={34} fill="#FFF8EC" stroke="#2A3E46" strokeWidth={5} />
    <path d={`M${tail * 30} ${h / 2 - 3} l${tail * 40} 60 l${-tail * 6} -60 Z`} fill="#FFF8EC" stroke="#2A3E46" strokeWidth={5} strokeLinejoin="round" />
    <rect x={tail * 26} y={h / 2 - 8} width={34} height={10} fill="#FFF8EC" />
    {children}
  </g>
);
const Flame: React.FC<{ x: number; y: number; s: number; f: number; seed: number }> = ({ x, y, s, f, seed }) => {
  const k = 1 + 0.18 * Math.sin(f / 2.2 + seed) + 0.1 * Math.sin(f / 1.3 + seed * 3);
  const lean = Math.sin(f / 3 + seed) * 8;
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${(s * k).toFixed(3)})`}>
      <path d={`M-22 0 C -30 -30 ${-6 + lean} -40 ${lean} -78 C 10 -50 30 -34 22 0 Z`} fill="#F08A2C" />
      <path d={`M-11 0 C -14 -18 ${-2 + lean * 0.6} -26 ${lean * 0.6} -46 C 6 -30 16 -18 11 0 Z`} fill="#FFD267" />
    </g>
  );
};
const ShotMyth: ShotFC<CL04> = ({ f, len }) => {
  const popAt = [6, 20, 34, 48];
  const s = (i: number) => {
    const u = clamp01((f - popAt[i]) / 9);
    return u <= 0 ? 0 : u < 1 ? u * 1.18 - 0.18 * u * u : 1;
  };
  const bob = (i: number) => Math.sin(f / 9 + i * 1.7) * 14;
  const melt = sm(f, 30, 90);
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len, x: 990, y: 540, zoom: 1.06 }])} vignette={0.22} grain={0.5}>
      <PadSet f={f + 200} />
      <Layer depth={1}>
        <SaturnV x={960} y={GROUND_Y} h={720} family={DUSK} light={15} />
        <CloudRack f={f + 200} n={6} x0={-500} x1={2400} y0={GROUND_Y - 30} y1={GROUND_Y + 40} size={150} speed={3.2} body={STEAM.body} under={STEAM.under} top={STEAM.top} seed={3} />
        <Streamers f={f} n={12} x0={-200} x1={2200} y0={300} y1={760} len={80} width={3} speed={5} color="#FFF4E0" opacity={0.4} seed={5} />
      </Layer>
      <Layer depth={0.9}>
        {/* bubble 1: a concrete block melting like wax */}
        <Bubble x={470} y={330 + bob(0)} w={300} h={210} s={s(0)} tail={1}>
          <path d={roundPoly([[-80, -50], [80, -50], [80 + melt * 10, 30 + melt * 20], [40, 30 + melt * 46], [10, 30 + melt * 20], [-30, 30 + melt * 58], [-80 - melt * 12, 30 + melt * 22]], 10)} fill="#B9B2A4" stroke="#5C5548" strokeWidth={4} />
          <Flame x={-30} y={-50} s={0.5} f={f} seed={1} />
          <Flame x={40} y={-50} s={0.6} f={f} seed={4} />
        </Bubble>
        {/* bubble 2: a burning grass tuft, "1 mile" (the claim being tested, #14, F20) */}
        <Bubble x={1450} y={300 + bob(1)} w={320} h={220} s={s(1)} tail={-1}>
          {[-60, -30, 0, 30, 60].map((dx, i) => (
            <path key={i} d={`M${dx} 60 q ${-8 + i * 4} -50 ${-4 + i * 3} -90`} stroke="#5D8C3A" strokeWidth={8} fill="none" strokeLinecap="round" />
          ))}
          <Flame x={-20} y={40} s={0.9} f={f} seed={2} />
          <Flame x={40} y={46} s={0.7} f={f} seed={7} />
          <text x={0} y={-62} textAnchor="middle" style={{ fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 800, fontSize: 40, fill: "#2A3E46" }}>
            1 mile{/* #14: the claim, under the MYTH pill (F20) */}
          </text>
        </Bubble>
        {/* bubbles 3-4: more of the same, smaller, emoji-free shouts */}
        <Bubble x={560} y={650 + bob(2)} w={220} h={140} s={s(2) * 0.85} tail={1}>
          <text x={0} y={22} textAnchor="middle" style={{ fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 800, fontSize: 64, fill: "#C8452A" }}>
            !!!
          </text>
        </Bubble>
        <Bubble x={1380} y={640 + bob(3)} w={220} h={140} s={s(3) * 0.85} tail={-1}>
          <Flame x={-40} y={40} s={0.7} f={f} seed={9} />
          <Flame x={10} y={40} s={0.8} f={f} seed={11} />
          <Flame x={58} y={40} s={0.6} f={f} seed={13} />
        </Bubble>
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="MYTH" /* F20 */ fill={alpha("#7A1E10", 0.82)} color="#FFF4E6" dot={P.vermilion} size={24} />
      </Layer>
    </Stage>
  );
};

// 4-03 · 2022: three slate crowd Ticks with microphones on poles walk onto the pad
const SLATE = ["#5E7D8A", "#6E8C96", "#53707C"];
const ShotCrowd: ShotFC<CL04> = ({ f, len }) => (
  <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 900, y: 640, zoom: 1.35 }, { f: len, x: 980, y: 620, zoom: 1.4 }])} vignette={0.22} grain={0.5}>
    <PadSet f={f + 400} />
    <Layer depth={1}>
      <SaturnV x={960} y={GROUND_Y} h={720} family={DUSK} light={15} />
      <CloudRack f={f + 400} n={5} x0={-500} x1={2400} y0={GROUND_Y - 10} y1={GROUND_Y + 50} size={130} speed={3} body={STEAM.body} under={STEAM.under} top={STEAM.top} seed={8} />
    </Layer>
    <Layer depth={1.15}>
      {[0, 1, 2].map((i) => {
        const x = -120 + i * 190 + f * 4.2;
        const y = GROUND_Y + 60 + i * 26;
        const ppm = 150 + i * 12;
        const bobY = Math.abs(Math.sin((f / 14 + i * 0.3) * Math.PI)) * -6;
        return (
          <g key={i}>
            <GroundShadow x={x} y={y + 4} rx={ppm * 0.4} ry={10} />
            {/* the microphone pole, carried over the shoulder */}
            <line x1={x + 20} y1={y - ppm * 1.0 + bobY} x2={x + 150} y2={y - ppm * 2.0 + bobY} stroke="#2E3A40" strokeWidth={6} strokeLinecap="round" />
            <rect x={x + 140} y={y - ppm * 2.0 - 16 + bobY} width={40} height={24} rx={10} fill="#2E3A40" />
            <Tick x={x} y={y} pxPerM={ppm} frame={f} seed={i + 3} color={SLATE[i]} walk={f / 14 + i * 0.3} expression="determined" />
          </g>
        );
      })}
    </Layer>
    <Layer depth={0}>
      <Kicker x={120} y={130} text="— 2022 · J. ACOUST. SOC. AM." /* #14 */ color={DUSK.text} size={26} />
    </Layer>
  </Stage>
);

// 4-04 · a model liftoff (ghosted, dashed outline): the rocket rises, the plume billows, gold rings leave the pad
const ShotModel: ShotFC<CL04> = ({ f, len }) => {
  const rise = Math.max(0, f - 14);
  const lift = rise * rise * 0.05 + rise * 1.5;
  const ry = GROUND_Y - lift;
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len, x: 960, y: 560 - Math.min(380, lift * 0.5), zoom: 0.96 }])} vignette={0.2} grain={0.5}>
      <PadSet f={f + 600} tower={false} />
      <Layer depth={1}>
        <Rings f={f} cx={960} cy={GROUND_Y} start={8} period={22} speed={8} squash={0.32} maxR={1300} width={7} color={L13_COLORS.gold} />
        <g opacity={0.6}>
          <SaturnV x={960} y={ry} h={720} family={DUSK} light={15} />
        </g>
        <rect x={960 - 720 * 0.05} y={ry - 720} width={720 * 0.1} height={720} fill="none" stroke={DUSK.text} strokeWidth={3} strokeDasharray="14 12" strokeDashoffset={-f * 3} />
        {/* exhaust: a flame tongue under the engines + billowing exhaust racks both ways along the pad */}
        <Emissive d={`M${960 - 30} ${ry} Q 960 ${ry + 120 + Math.sin(f / 2) * 16} ${960 + 30} ${ry} Z`} color="#FFB34A" core="#FFF3C8" width={10} fill glow={32} opacity={rise > 0 ? 1 : 0.4} />
        <CloudRack f={f} n={5} x0={300} x1={1800} y0={GROUND_Y - 40} y1={GROUND_Y + 40} size={190} speed={4.5} body={STEAM.body} under={STEAM.under} top={STEAM.top} seed={12} />
        <CloudRack f={f} n={5} x0={100} x1={1600} y0={GROUND_Y - 20} y1={GROUND_Y + 50} size={170} speed={4} dir={-1} body={mixHex(STEAM.body, "#F2B98A", 0.3)} under={STEAM.under} seed={14} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="MODEL" /* #14: a 2022 model matched to 1960s data */ fill={pillFill(DUSK)} color={DUSK.text} dot={L13_COLORS.gold} size={22} />
      </Layer>
    </Stage>
  );
};

// 4-05 · the gold POWER meter (bulb-shaped, never the air gauge) swings and locks at 203; 1960s data dots drop onto the curve
const ShotPower: ShotFC<CL04> = ({ f, len }) => {
  const v = lerp(150, POWER.saturnV /* #14 */, sm(f, 4, 44));
  const curve = (u: number): [number, number] => [1120 + u * 600, 700 - Math.sin(Math.PI * Math.pow(u, 0.8)) * 300 - u * 40];
  const pts = Array.from({ length: 41 }, (_, i) => curve(i / 40));
  const dots = [0.12, 0.26, 0.38, 0.5, 0.62, 0.74, 0.86];
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.04 }, { f: len, x: 960, y: 540, zoom: 1.0 }])} vignette={0.24} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={DUSK} />
        <Bloom x={640} y={480} r={600} color={L13_COLORS.gold} strength={0.35 + 0.25 * sm(f, 30, 46)} spread={0.5} />
      </Layer>
      <Layer depth={0.4}>
        <CloudRack f={f} n={5} x0={-400} x1={2400} y0={900} y1={1000} size={150} speed={3} body={STEAM.body} under={STEAM.under} top={STEAM.top} seed={21} opacity={0.9} />
      </Layer>
      <Layer depth={1}>
        <PowerMeter x={620} y={470} r={240} value={v} family={DUSK} frame={f} readout={f >= 44 ? "203 dB" /* #14 */ : false} />
        {/* the model curve and the 1960s data dots dropping onto it (schematic shape; no axis numbers) */}
        <rect x={1080} y={300} width={680} height={460} rx={24} fill={alpha(DUSK.shadow, 0.5)} />
        <path d={"M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} fill="none" stroke={L13_COLORS.gold} strokeWidth={6} strokeDasharray="16 10" strokeDashoffset={-f * 2} />
        {dots.map((u, i) => {
          const [x, y] = curve(u);
          const t0 = 10 + i * 8;
          const k = clamp01((f - t0) / 14);
          const yy = lerp(250, y + (rnd(i * 3) - 0.5) * 24, k * k);
          return k > 0 ? <circle key={i} cx={x} cy={yy} r={14} fill="#FFF4E0" stroke={L13_COLORS.goldDeep} strokeWidth={4} /> : null;
        })}
      </Layer>
      <Layer depth={0}>
        <Pill x={1100} y={250} text="MODEL vs 1960s DATA" /* #14 */ fill={pillFill(DUSK)} color={DUSK.text} dot={L13_COLORS.gold} size={18} />
      </Layer>
    </Stage>
  );
};

// ---- the studio cyc (4-06 to 4-09) ------------------------------------------------------------------------------
const FLOOR_Y = 900;
const Cyc: React.FC<{ f: number; seed?: number }> = ({ f, seed = 1 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={STUDIO} />
    </Layer>
    <Layer depth={0.3}>
      <CycClouds f={f} y={250} n={4} seed={seed} />
    </Layer>
    <Layer depth={1}>
      <path d={`M-600 ${FLOOR_Y - 40} Q 960 ${FLOOR_Y - 70} 2600 ${FLOOR_Y - 40} V 1500 H -600 Z`} fill={STUDIO.mid} />
      <path d={`M-600 ${FLOOR_Y - 40} Q 960 ${FLOOR_Y - 70} 2600 ${FLOOR_Y - 40}`} stroke={mixHex(STUDIO.mid, "#FFF2D0", 0.4)} strokeWidth={5} fill="none" />
    </Layer>
  </>
);

// 4-06 · a big bare bulb on a stand; Tick screws it in (three twists); it lights
const ShotBulb: ShotFC<CL04> = ({ f, len }) => {
  const twist = f < 54 ? Math.sin((f / 18) * Math.PI * 2) * 26 * (1 - f / 60) : 0;
  const on = sm(f, 56, 70);
  const bx = 860;
  const by = 380;
  return (
    <Stage theme={STUDIO.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len, x: 930, y: 540, zoom: 1.08 }])} vignette={0.14} grain={0.5}>
      <Cyc f={f} seed={2} />
      <Layer depth={1}>
        <LightWash x={bx} y={FLOOR_Y - 20} rx={700 * (0.3 + on)} ry={120 * (0.3 + on)} color={L13_COLORS.gold} strength={0.5 * on} />
        <Bloom x={bx} y={by} r={200 + 500 * on} color={L13_COLORS.gold} strength={0.75 * on} spread={0.5} />
        {/* stand */}
        <rect x={bx - 10} y={by + 180} width={20} height={FLOOR_Y - by - 200} fill="#2E4A52" />
        <ellipse cx={bx} cy={FLOOR_Y - 30} rx={110} ry={20} fill="#2E4A52" />
        <g transform={`rotate(${twist.toFixed(2)} ${bx} ${by + 170})`}>
          <Bulb x={bx} y={by} r={150} family={STUDIO} on={on} f={f} />
        </g>
        <Tick x={1210} y={FLOOR_Y - 10} pxPerM={300} frame={f} facing={-1} pose="hold" poseTo={on > 0.5 ? "cheer" : undefined} poseT={sm(f, 64, 84) * 1.2} expression={on > 0.5 ? "happy" : "determined"} tilt={twist * -0.15} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="POWER · LIKE A BULB'S WATTS" /* #14 analogy */ fill={pillFill(STUDIO)} color={STUDIO.text} dot={L13_COLORS.gold} size={20} />
      </Layer>
    </Stage>
  );
};

// 4-07 · close: the bulb's wattage plate reads 203; long rays fan out and rotate (12 rays, 1.5°/f)
const ShotPlate: ShotFC<CL04> = ({ f, len }) => {
  const bx = 820;
  const by = 430;
  return (
    <Stage theme={STUDIO.theme} cam={cam(f, [{ f: 0, x: 900, y: 540, zoom: 1.1 }, { f: len, x: 880, y: 560, zoom: 1.18 }])} vignette={0.16} grain={0.5}>
      <Cyc f={f + 300} seed={4} />
      <Layer depth={1}>
        <Bloom x={bx} y={by} r={700} color={L13_COLORS.gold} strength={0.7} spread={0.5} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = ((i * 30 + f * 1.5) * Math.PI) / 180;
          const r0 = 330;
          const r1 = 900 + (i % 2) * 160;
          return <Emissive key={i} d={`M${bx + Math.cos(a) * r0} ${by + Math.sin(a) * r0} L${bx + Math.cos(a) * r1} ${by + Math.sin(a) * r1}`} color={L13_COLORS.gold} core="#FFF6D8" width={16} glow={16} opacity={0.75} />;
        })}
        <Bulb x={bx} y={by} r={260} family={STUDIO} on={1} f={f} />
        {/* the wattage plate on the screw base (the power analogy, #14, F4) */}
        <rect x={bx - 120} y={by + 300} width={240} height={96} rx={14} fill={L13_COLORS.goldDeep} stroke="#5A3E10" strokeWidth={4} />
        <text x={bx} y={by + 372} textAnchor="middle" style={{ fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 800, fontSize: 66, fill: "#FFF4D6", fontVariantNumeric: "tabular-nums" }}>
          203{/* #14 */}
        </text>
      </Layer>
      <Layer depth={0}>
        <Metric x={1240} y={300} value="203" /* #14 */ unit="dB of power" size={110} color={STUDIO.text} />
        <Pill x={1240} y={360} text="TOTAL OUTPUT" /* #14 */ fill={pillFill(STUDIO)} color="#FFF4DE" dot={L13_COLORS.gold} size={20} />
      </Layer>
    </Stage>
  );
};

// 4-08 · Tick walks away from the bulb; the light pool on Tick shrinks and a brightness meter on its staff drops
const ShotWalk: ShotFC<CL04> = ({ f, len }) => {
  const bx = 300;
  const tx = lerp(560, 1620, clamp01(f / Math.max(1, len - 10)));
  const dist = (tx - bx) / 1320;
  const bright = clamp01(1 / (1 + 9 * dist * dist));
  const ppm = 210;
  return (
    <Stage theme={STUDIO.theme} cam={cam(f, [{ f: 0, x: 760, y: 540, zoom: 1.0 }, { f: len, x: 1180, y: 540, zoom: 1.0 }])} vignette={0.14} grain={0.5}>
      <Cyc f={f + 500} seed={6} />
      <Layer depth={1}>
        <Bloom x={bx} y={330} r={560} color={L13_COLORS.gold} strength={0.6} spread={0.5} />
        <rect x={bx - 10} y={480} width={20} height={FLOOR_Y - 500} fill="#2E4A52" />
        <Bulb x={bx} y={330} r={130} family={STUDIO} on={1} f={f} />
        {/* the light pool around Tick shrinks with distance */}
        <ellipse cx={tx} cy={FLOOR_Y - 8} rx={260 * bright + 40} ry={44 * bright + 8} fill={L13_COLORS.gold} opacity={0.55 * bright + 0.1} />
        <Tick x={tx} y={FLOOR_Y - 10} pxPerM={ppm} frame={f} facing={1} walk={f / 15} staff expression="thinking" look={-0.4} />
        {/* the brightness meter riding the staff top: its bar drops as Tick walks away */}
        <g transform={`translate(${tx + ppm * 0.5} ${FLOOR_Y - 10 - ppm * 2.25})`}>
          <rect x={-22} y={-150} width={44} height={150} rx={10} fill={alpha(STUDIO.shadow, 0.85)} stroke="#FFF4DE" strokeWidth={3} />
          <rect x={-14} y={-8 - 134 * bright} width={28} height={134 * bright} rx={6} fill={L13_COLORS.gold} />
        </g>
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="PRESSURE · BRIGHTNESS WHERE YOU STAND" /* #14 analogy */ fill={pillFill(STUDIO)} color="#FFF4DE" dot={L13_COLORS.teal} size={20} />
      </Layer>
    </Stage>
  );
};

// 4-09 · "mix the two up": the POWER and PRESSURE tags swap; a concrete block slumps like dough; Tick swaps them back
const ShotSwap: ShotFC<CL04> = ({ f, len }) => {
  const wrong = sm(f, 6, 24) * (1 - sm(f, 66, 86));
  const slump = sm(f, 18, 52) * (1 - sm(f, 72, 100));
  const tag = (label: string, color: string, xa: number, xb: number, up: number) => {
    const x = lerp(xa, xb, wrong);
    const y = 300 - Math.sin(wrong * Math.PI) * up;
    return (
      <g transform={`translate(${x} ${y})`}>
        <rect x={-150} y={-44} width={300} height={88} rx={44} fill={color} stroke="#13343E" strokeWidth={4} />
        <text x={0} y={16} textAnchor="middle" style={{ fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 800, fontSize: 44, letterSpacing: 2, fill: "#13343E" }}>
          {label}
        </text>
      </g>
    );
  };
  const bx = 620;
  const by = FLOOR_Y - 20;
  const s = slump;
  const block: [number, number][] = [
    [bx - 170 - s * 120, by],
    [bx - 170 + s * 10, by - 300 + s * 210],
    [bx - 40, by - 300 + s * 230 + Math.sin(f / 5) * 6 * s],
    [bx + 60, by - 300 + s * 200],
    [bx + 170 - s * 10, by - 300 + s * 220],
    [bx + 170 + s * 140, by],
  ];
  const wag = f > 86 ? Math.sin(f / 2.6) * 12 : 0;
  return (
    <Stage theme={STUDIO.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 980, y: 540, zoom: 1.05 }])} vignette={0.14} grain={0.5}>
      <Cyc f={f + 700} seed={8} />
      <Layer depth={1}>
        <GroundShadow x={bx} y={by + 6} rx={200 + s * 130} ry={22} />
        <path d={roundPoly(block, 30)} fill="#BDB4A2" stroke="#6D6556" strokeWidth={5} />
        <path d={roundPoly(block.map(([x, y]) => [x * 0.98 + bx * 0.02, y] as [number, number]).slice(0, 4), 20)} fill="#D6CFBE" opacity={0.6} />
        <Tick x={1440} y={FLOOR_Y - 10} pxPerM={330} frame={f} facing={-1} pose={f > 60 ? "point" : "think"} expression={f > 60 ? "determined" : "worried"} headTilt={wag} />
      </Layer>
      <Layer depth={0}>
        {/* the two tags (they are this shot's two pills) */}
        {tag("POWER", L13_COLORS.gold, 460, 980, 140)}
        {tag("PRESSURE", L13_COLORS.teal, 980, 460, -140)}
      </Layer>
    </Stage>
  );
};

// ---- the noon airfield (4-10 to 4-12) ---------------------------------------------------------------------------
const HORIZON = 520;
const Airfield: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={NOON} />
      <Bloom x={260} y={140} r={420} color="#FFF4C8" strength={0.4} spread={0.5} />
    </Layer>
    <Layer depth={0.3}>
      <CloudRack f={f} n={5} x0={-600} x1={2600} y0={160} y1={420} size={130} speed={2.6} body="#FFFFFF" under="#CFE6EE" top="#FFFFFF" seed={31} />
    </Layer>
    <Layer depth={1}>
      <rect x={-1200} y={HORIZON} width={4400} height={1600} fill="#8DBE6E" />
      <path d={`M-1200 ${HORIZON} H 3200`} stroke="#5E9B5A" strokeWidth={4} />
      <path d={`M700 ${HORIZON} L1220 ${HORIZON} L2400 1700 L-500 1700 Z`} fill="#6E7F86" />
      {Array.from({ length: 10 }, (_, i) => {
        const y0 = HORIZON + Math.pow(i / 10, 2) * 1200;
        const y1 = HORIZON + Math.pow((i + 0.5) / 10, 2) * 1200;
        return <path key={i} d={`M960 ${y0} L960 ${y1}`} stroke="#FFF6E0" strokeWidth={4 + i * 3} />;
      })}
    </Layer>
  </>
);

// 4-10 / 4-11 · one jet engine, front view, fan spinning; pull back: ten engines pop into a row; the meter reads 170
const ROW_Y = 700;
const ShotEngines: ShotFC<CL04> = ({ f, len, c }) => {
  const t1 = c.ten - c.engine;
  const hero = 4;
  const ex = (i: number) => 330 + i * 140;
  const k = sm(f, t1 - 6, t1 + 24);
  const camKeys: CamKey[] = [
    { f: 0, x: ex(hero), y: ROW_Y - 10, zoom: 4.4 },
    { f: t1 - 4, x: ex(hero), y: ROW_Y - 20, zoom: 3.4 },
    { f: t1 + 30, x: 960, y: 560, zoom: 1.05 },
    { f: len + 10, x: 960, y: 560, zoom: 0.98 },
  ];
  return (
    <Stage theme={NOON.theme} cam={cam(f, camKeys)} vignette={0.12} grain={0.5}>
      <Airfield f={f} />
      <Layer depth={1}>
        <Streamers f={f} n={14} x0={200} x1={1700} y0={ROW_Y - 90} y1={ROW_Y + 60} len={60} width={2.5} speed={3} color="#FFFFFF" opacity={0.35} seed={4} />
        {Array.from({ length: 10 }, (_, i) => {
          const at = t1 + Math.abs(i - hero) * 3;
          const s = i === hero ? 1 : clamp01((f - at) / 8);
          if (s <= 0) return null;
          const sc = s < 1 ? s * 1.15 - 0.15 * s * s : 1;
          return (
            <g key={i} transform={`translate(${ex(i)} ${ROW_Y}) scale(${sc.toFixed(3)}) translate(${-ex(i)} ${-ROW_Y})`}>
              <GroundShadow x={ex(i)} y={ROW_Y + 72} rx={70} ry={10} />
              <rect x={ex(i) - 8} y={ROW_Y + 40} width={16} height={34} fill="#4A565C" />
              <JetEngine x={ex(i)} y={ROW_Y} r={62} f={f + i * 5} family={NOON} />
            </g>
          );
        })}
      </Layer>
      <Layer depth={0} opacity={k}>
        <PowerMeter x={1620} y={250} r={150} value={POWER.tenEngines /* #14 */} family={NOON} frame={f} readout="170 dB" /* #14 */ />
        <Pill x={1800} y={560} align="end" text="≈ 10 JET ENGINES" /* #14 */ fill={pillFill(NOON)} color={NOON.text} dot={L13_COLORS.gold} size={20} />
      </Layer>
    </Stage>
  );
};

// 4-12 · the row multiplies into a grid of engine dots filling the airfield to the horizon; the meter climbs to 200
const ShotGrid: ShotFC<CL04> = ({ f, len }) => {
  const rows = 26;
  const fillT = f / 2.4; // rows filled, near to far
  const v = lerp(POWER.tenEngines, POWER.tenThousandEngines /* #14 */, sm(f, 4, 60));
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 960, y: 640, zoom: 1.25 }, { f: len, x: 960, y: 560, zoom: 0.94 }])} vignette={0.12} grain={0.5}>
      <Airfield f={f + 200} />
      <Layer depth={1}>
        {Array.from({ length: rows }, (_, r) => {
          if (r > fillT) return null;
          const u = r / rows;
          const y = 1180 - (1180 - HORIZON - 6) * (1 - Math.pow(1 - u, 2.2));
          const s = lerp(1, 0.05, 1 - Math.pow(1 - u, 2.2));
          const gap = 120 * s + 4;
          const n = Math.ceil(2400 / gap);
          const pop = clamp01(fillT - r);
          return (
            <g key={r} opacity={pop}>
              {Array.from({ length: n }, (_, i) => {
                const x = -240 + i * gap + (r % 2) * gap * 0.5;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={Math.max(1.5, 34 * s)} fill="#5E6B72" />
                    <circle cx={x} cy={y} r={Math.max(1, 24 * s)} fill="#2B3338" />
                    <circle cx={x - 6 * s} cy={y - 6 * s} r={Math.max(0.6, 8 * s)} fill="#DDE6E8" />
                  </g>
                );
              })}
            </g>
          );
        })}
      </Layer>
      <Layer depth={0}>
        <PowerMeter x={1620} y={250} r={150} value={v} family={NOON} frame={f} readout={v > 199.5 ? "200 dB" /* #14 */ : false} />
        <Pill x={1800} y={560} align="end" text="≈ 10,000 JET ENGINES" /* #14 */ fill={pillFill(NOON)} color={NOON.text} dot={L13_COLORS.gold} size={20} />
      </Layer>
    </Stage>
  );
};

// 4-13 · dusk pad: the plume's heat on the concrete; scorch marks spread; a thermometer glyph, not a speaker
const ShotHeat: ShotFC<CL04> = ({ f, len }) => {
  const sc = sm(f, 6, 80);
  const scorch = Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2;
    const r = (0.75 + rnd(i * 7) * 0.5) * (40 + 520 * sc);
    return [960 + Math.cos(a) * r, GROUND_Y + 80 + Math.sin(a) * r * 0.16] as [number, number];
  });
  const temp = sm(f, 10, 70);
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 640, zoom: 1.12 }, { f: len, x: 960, y: 620, zoom: 1.2 }])} vignette={0.24} grain={0.5}>
      <PadSet f={f + 900} tower={false} />
      <Layer depth={0.7}>
        <Plume x={960} y={GROUND_Y} h={760} r0={90} fill="#F0A35A" shade="#B5582C" lit="#FFE0A8" light={15} seed={5} frame={f * 2} t={1} lean={0.05} />
      </Layer>
      <Layer depth={1}>
        <path d={roundPoly(scorch, 24)} fill="#3A1E14" opacity={0.75} />
        <LightWash x={960} y={GROUND_Y + 60} rx={900} ry={160} color="#FF8A3A" strength={0.55} />
        <CloudRack f={f} n={6} x0={-400} x1={2300} y0={GROUND_Y - 20} y1={GROUND_Y + 30} size={150} speed={3.6} body="#F6B27A" under="#C0603A" top="#FFE6C2" seed={41} />
        <Embers frame={f} n={30} x0={500} x1={1400} y={900} color="#FFB060" seed={3} />
      </Layer>
      <Layer depth={0}>
        {/* thermometer glyph: the column rises */}
        <g transform="translate(1600 300)">
          <rect x={-26} y={-40} width={52} height={300} rx={26} fill="#FFF4E0" stroke="#4A2412" strokeWidth={5} />
          <circle cx={0} cy={280} r={50} fill="#E4572E" stroke="#4A2412" strokeWidth={5} />
          <rect x={-12} y={250 - 260 * temp} width={24} height={260 * temp + 20} rx={10} fill="#E4572E" />
        </g>
        <Pill x={120} y={130} text="HEAT FROM THE PLUME" /* #14 */ fill={pillFill(DUSK)} color={DUSK.text} dot="#FF8A3A" size={22} />
      </Layer>
    </Stage>
  );
};

// 4-14 / 4-15 · the steam settles around the empty pad; turn to the sea: a saffron plume far out, a ring rolls toward
// us on "wasn't a machine"; ZoomThrough into the plume → the survey map (l05 opens on it). 4-14 has no Tick, so Tick
// walks in from the left just before the turn (4-15: turn · surprised).
const SeaPad: React.FC<{ f: number; len: number; tTurn: number }> = ({ f, len, tTurn }) => {
  const px = 1560;
  const py = GROUND_Y - 150;
  const inT = sm(f, tTurn - 24, tTurn + 4);
  const turn = sm(f, tTurn + 4, tTurn + 16);
  return (
    <Stage
      theme={DUSK.theme}
      cam={cam(f, [{ f: 0, x: 760, y: 600, zoom: 1.05 }, { f: tTurn, x: 900, y: 600, zoom: 1.08 }, { f: len, x: 1380, y: 640, zoom: 1.6 }])}
      vignette={0.22}
      grain={0.5}
    >
      <PadSet f={f + 1200} sea tower={false} />
      <Layer depth={0.35}>
        <Plume x={px} y={py} h={260} r0={22} fill={L13_COLORS.saffron} shade={L13_COLORS.saffronDeep} lit={L13_COLORS.saffronCore} light={15} seed={9} frame={f} t={0.4 + 0.6 * sm(f, tTurn - 30, tTurn + 40)} />
        <Rings f={f} cx={px} cy={py + 8} start={tTurn + 10} period={46} speed={7} squash={0.3} maxR={1700} width={6} color={L13_COLORS.saffron} />
      </Layer>
      <Layer depth={1}>
        <CloudRack f={f + 1200} n={6} x0={-500} x1={1700} y0={GROUND_Y - 30} y1={GROUND_Y + 40} size={160} speed={3} body={STEAM.body} under={STEAM.under} top={STEAM.top} seed={3} />
        <Streamers f={f} n={14} x0={-200} x1={2200} y0={360} y1={800} len={80} width={3} speed={5} color="#FFF4E0" opacity={0.45} seed={8} />
      </Layer>
      {inT > 0 ? (
        <Layer depth={0.4}>
          <Tick
            x={lerp(-120, 520, inT)}
            y={1010}
            pxPerM={300}
            frame={f}
            facing={1}
            walk={inT < 1 ? f / 12 : undefined}
            pose={turn > 0.5 ? "point" : "stand"}
            expression={turn > 0.5 ? "surprised" : "neutral"}
            look={0.6}
            headTilt={-turn * 8}
          />
        </Layer>
      ) : null}
    </Stage>
  );
};
const ShotTurn: ShotFC<CL04> = ({ f, len, c }) => {
  const tTurn = c.turn - c.settle;
  const zt = clamp01((f - (len - 26)) / 26);
  const scene = <SeaPad f={f} len={len} tTurn={tTurn} />;
  if (zt <= 0) return scene;
  return (
    <ZoomThrough
      t={zt}
      focal={{ x: 1290, y: 620 }}
      from={scene}
      to={
        <Stage theme={NOON.theme} drift={false} vignette={0.1} grain={0.5}>
          <Layer depth={0}>
            <SurveyMap view="sunda" x={0} y={0} w={1920} h={1080} family={NOON} frame={f} schematic={false} />
          </Layer>
        </Stage>
      }
    />
  );
};

export const SceneL04: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL04(t);
  const shots: ShotDef<CL04>[] = [
    { from: 0, S: ShotPad, id: "4-01" },
    { from: c.myth, S: ShotMyth, id: "4-02" },
    { from: c.crowd, S: ShotCrowd, id: "4-03" },
    { from: c.model, S: ShotModel, id: "4-04" },
    { from: c.power, S: ShotPower, id: "4-05" },
    { from: c.bulb, S: ShotBulb, id: "4-06" },
    { from: c.plate, S: ShotPlate, id: "4-07" },
    { from: c.walk, S: ShotWalk, id: "4-08" },
    { from: c.swap, S: ShotSwap, id: "4-09" },
    { from: c.engine, S: ShotEngines, id: "4-10" },
    { from: c.grid, S: ShotGrid, id: "4-12" },
    { from: c.heat, S: ShotHeat, id: "4-13" },
    { from: c.settle, S: ShotTurn, id: "4-14" },
  ];
  return playShots(f, shots, c, t.frames);
};

export const soundL04 = (t: SceneTiming): Cue[] => {
  const c = cuesL04(t);
  return [
    { at: 0, file: SFX.wind, vol: 0.16, dur: c.model, fadeIn: 14, fadeOut: 14 },
    { at: 4, file: SFX.swirl, vol: 0.18, dur: 50 },
    ...cutHit(c.myth),
    ...[6, 20, 34, 48].map((o) => ({ at: c.myth + o, file: SFX.pop, vol: 0.26, dur: 20 })),
    ...cutHit(c.crowd),
    ...[0, 14, 28, 42, 56].map((o) => ({ at: c.crowd + 6 + o, file: SFX.click, vol: 0.12, dur: 10 })),
    ...cutHit(c.model),
    { at: c.model + 4, file: SFX.riser, vol: 0.2, dur: c.power - c.model, fadeOut: 12 },
    { at: c.model + 14, file: SFX.rumble, vol: 0.26, dur: c.power - c.model + 10, fadeOut: 16 },
    ...cutHit(c.power),
    ...[6, 14, 22, 30, 38].map((o) => ({ at: c.power + o, file: SFX.click, vol: 0.14, dur: 10 })),
    { at: c.power + 44, file: SFX.chime, vol: 0.28, dur: 60 },
    ...cutHit(c.bulb),
    ...[8, 26, 44].map((o) => ({ at: c.bulb + o, file: SFX.click, vol: 0.2, dur: 12 })),
    { at: c.bulb + 56, file: SFX.popLong, vol: 0.3, dur: 30 },
    ...cutHit(c.plate),
    { at: c.plate + 6, file: SFX.chime, vol: 0.26, dur: 60 },
    ...cutHit(c.walk),
    ...[0, 15, 30, 45, 60, 75, 90].map((o) => ({ at: c.walk + 6 + o, file: SFX.click, vol: 0.1, dur: 10 })),
    ...cutHit(c.swap),
    { at: c.swap + 8, file: SFX.pop, vol: 0.26, dur: 20 },
    { at: c.swap + 20, file: SFX.swirl, vol: 0.2, dur: 50 },
    { at: c.swap + 68, file: SFX.pop, vol: 0.24, dur: 20 },
    ...cutHit(c.engine),
    { at: c.engine, file: SFX.whoosh, vol: 0.24, dur: c.ten - c.engine, fadeOut: 10 },
    ...Array.from({ length: 10 }, (_, i) => ({ at: c.ten + i * 3, file: SFX.pop, vol: 0.14, dur: 14 })),
    ...cutHit(c.grid),
    { at: c.grid, file: SFX.riser, vol: 0.18, dur: 60, fadeOut: 16 },
    ...cutHit(c.heat),
    { at: c.heat, file: SFX.rumble, vol: 0.18, dur: c.settle - c.heat, fadeOut: 14 },
    ...cutHit(c.settle),
    { at: c.settle + 6, file: SFX.pop, vol: 0.2, dur: 20 },
    { at: c.settle, file: SFX.wind, vol: 0.14, dur: c.end - c.settle, fadeIn: 10, fadeOut: 10 },
    { at: c.end - 30, file: SFX.deepWhoosh, vol: 0.3, dur: 60 },
  ];
};
