// L17 scene "l07" (storyboard §3 "7 · Ten thousand years: the mountain and the air", script lines 28-31). Package B.
// Shot components (hard cuts; PUSH rows are phases): 7-01 · 7-02 · 7-03 · 7-04 · 7-05 · 7-06 · 7-07 (+7-08: the lift
// into the night sky, then the CO2 dots and the warm band) · 7-09 · 7-10 · 7-11 · 7-12.
// Numbers drawn (all data17 READ): 1 INCH / 10,000 YEARS (#8 A, 7-02; the dial word 10,000 YEARS is a SCALE_LABEL) ·
// 100 INCHES + ABOUT 8 FT + OUR SUM (#8 C, 7-04) · OUR SUM (7-05, F4). Words only: MICA SCHIST (#8), NOAA SAYS and
// THOUSANDS OF YEARS (#9, no temperature or ppm figure), MAINTENANCE (7-11, no row: drawn as the spoken words).
// F1 / F8: the cliff's four heads are stylised carved blocks with no likeness and no names.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Cumulus, Layer, Motes, Stage, Tick, cameraAt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ } from "../data17";
import { RungBadge, YearsDial, rungValue } from "../ladder";
import { Rail } from "../rig";
import { AgencyPill, OurSumPill, WordPill } from "../stamps17";
import { Skyline } from "../city";
import { DotStream, StarsTint } from "../movers17";
import { BottleIcon } from "../icons17";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { AirDial, C, CREAM, Cliff, FamSky, INK, Label, Num, Pop, RollInt, Slam, Strata, StudioCyc, TextPlate, Wind, Wrench, alpha, clamp01, drawn, ez, lin, mixHex, mod, path1, rnd } from "./b-parts";

export const cuesL07 = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    cliff: 0, // 7-01
    ruler: frac(0, 0.31), // 7-02
    gully: frac(0, 0.65), // 7-03
    stack: at(1), // 7-04
    sum: frac(1, 0.38), // 7-05
    worn: frac(1, 0.71), // 7-06
    air: at(2), // 7-07
    co2: frac(2, 0.33), // 7-08 (phase)
    haze: frac(2, 0.67), // 7-09
    object: at(3), // 7-10
    maint: frac(3, 0.34), // 7-11
    dive: frac(3, 0.68), // 7-12
    end: t.frames,
  };
};
export type C07 = ReturnType<typeof cuesL07>;

const NOON = familyOf("noon");
const DUSK = familyOf("dusk");
const NIGHT = familyOf("night");
const DEEP = familyOf("deep");

/** Two to three painted clouds sliding at ~10 px/f (the noon and dusk skies' mover). */
const Clouds: React.FC<{ f: number; y: number; n?: number; speed?: number; fill?: string; shade?: string; seed?: number; span?: number }> = ({ f, y, n = 3, speed = 10, fill = "#FFF8EA", shade = "#BFE3E6", seed = 1, span = 3400 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const w = 420 + rnd(seed * 7 + i) * 260;
      const x = mod((i / n) * span + rnd(seed + i) * 300 - f * speed * (0.8 + 0.4 * rnd(i * 3)), span) - 800;
      return <Cumulus key={i} x={x} y={y + rnd(seed * 11 + i) * 220} w={w} h={w * 0.3} fill={fill} shade={shade} lit="#FFFFFF" seed={seed * 5 + i} frame={f} />;
    })}
  </g>
);

// ===============================================================================================================
// 7-01 · the granite cliff, four stylised unnamed heads; Tick at the foot with a ruler a hundred times too short.
// MOVER: the camera tilts up the cliff (zoom 1.35 → 0.95, 9 px/f + the scale change) + clouds (10 px/f) + wind (14 px/f).
// ===============================================================================================================
const ShotCliff: ShotFC<C07> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1300, y: 1230, zoom: 1.35 },
    { f: len, x: 1000, y: 560, zoom: 0.95 },
  ]);
  return (
    <Stage theme={NOON.theme} cam={cam} vignette={0.12} grain={0.5}>
      <Layer depth={0.05}>
        <FamSky name="noon" />
        <Bloom x={260} y={-120} r={520} color="#FFF3C8" strength={0.7} />
      </Layer>
      <Layer depth={0.3}>
        <Clouds f={f} y={-380} seed={3} />
      </Layer>
      <Layer depth={0.55} haze={{ color: NOON.haze, amount: 0.45 }}>
        <path d="M-900 1300 L-200 820 L300 1000 L800 760 L1400 980 L2100 700 L2900 1100 L2900 1700 L-900 1700 Z" fill={NOON.far} />
      </Layer>
      <Layer depth={1}>
        <Cliff x={160} y={-180} w={1640} h={1680} />
        <rect x={-900} y={1490} width={3800} height={600} fill="#B58A5E" />
        <rect x={-900} y={1490} width={3800} height={12} fill="#E8C8A0" />
        <ellipse cx={1520} cy={1500} rx={60} ry={10} fill="#000" opacity={0.2} />
        <Tick x={1500} y={1500} pxPerM={120} frame={f} pose="hold" expression={f > len * 0.55 ? "worried" : "thinking"} look={0.7} headTilt={-12} />
        {/* the ruler a hundred times too short */}
        <g transform={`translate(${1500 + 36 * 1.2} ${1500 - 104 * 1.2}) rotate(-70)`}>
          <rect x={-4} y={-30} width={9} height={36} rx={2} fill={C.saffron} stroke={INK} strokeWidth={1.5} />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={-4} x2={1} y1={-26 + i * 8} y2={-26 + i * 8} stroke={INK} strokeWidth={1.2} />
          ))}
        </g>
      </Layer>
      <Layer depth={1.25}>
        <Wind f={f} y0={200} y1={1400} n={12} speed={14} color="#FFFFFF" opacity={0.5} />
        <Motes frame={f} n={18} w={1920} h={1500} color="#FFF8EA" seed={7} size={3} drift={30} />
      </Layer>
      <Layer depth={0}>
        <RungBadge f={f} rung={6} family={NOON} from={5} />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 7-02 · close on the granite face: a ruler slides along it (20 px/f) under a fixed one-inch bracket; the YEARS dial
// sweeps to the TEN THOUSAND mark (4 deg/f) and reads 10,000 YEARS. Metric '1 INCH / 10,000 YEARS' (#8 A).
// ===============================================================================================================
const ShotRuler: ShotFC<C07> = ({ f }) => {
  const inch = 64; // px per inch on the ruler
  const off = f * 20;
  const v = Math.min(rungValue(6), rungValue(3) + f * 0.0167);
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0, frames: 200, seed: 4 }} vignette={0.15} grain={0.6}>
        <Layer depth={0.2}>
          <FamSky name="noon" />
          <Clouds f={f} y={-100} n={2} seed={6} />
        </Layer>
        <Layer depth={1}>
          {/* the granite face fills the lower two-thirds: warm speckled stone with a lit top edge */}
          <path d="M-200 360 L400 330 L900 350 L1500 320 L2200 345 L2200 1400 L-200 1400 Z" fill="#D8B49A" />
          <path d="M-200 360 L400 330 L900 350 L1500 320 L2200 345" fill="none" stroke="#F2D6BE" strokeWidth={10} />
          {Array.from({ length: 140 }, (_, i) => (
            <circle key={i} cx={rnd(i * 3) * 2200 - 100} cy={370 + rnd(i * 5) * 800} r={3 + rnd(i * 7) * 6} fill={["#B78F78", "#9C7460", "#F2D6BE", "#E3A27A"][i % 4]} opacity={0.75} />
          ))}
          <path d="M-200 360 L400 330 L900 350 L1500 320 L2200 345 L2200 372 L1500 347 L900 377 L400 357 L-200 387 Z" fill="#F2D6BE" opacity={0.5} />
          {/* the ruler, sliding left 20 px/f */}
          <g>
            <rect x={-60} y={560} width={2100} height={110} rx={10} fill="#04161C" opacity={0.25} transform="translate(8 10)" />
            <rect x={-60} y={560} width={2100} height={110} rx={10} fill={C.saffron} />
            <rect x={-60} y={560} width={2100} height={16} rx={8} fill="#FFE6A8" opacity={0.8} />
            {Array.from({ length: 40 }, (_, i) => {
              const x = mod(i * (inch / 4) * 2 - off, 2160) - 60;
              const big = i % 8 === 0;
              const mid = i % 4 === 0;
              return <line key={i} x1={x} y1={560} x2={x} y2={560 + (big ? 70 : mid ? 46 : 26)} stroke={INK} strokeWidth={big ? 5 : 3} />;
            })}
            {Array.from({ length: 80 }, (_, i) => {
              const x = mod(i * (inch / 4) - off, 2160) - 60;
              return <line key={"s" + i} x1={x} y1={560} x2={x} y2={580} stroke={INK} strokeWidth={2} opacity={0.6} />;
            })}
          </g>
          {/* the fixed one-inch bracket on the stone's worn edge */}
          <g>
            <rect x={840} y={540} width={inch * 2} height={150} fill={C.amber} opacity={0.22} />
            <path d={`M840 520 L840 540 L${840 + inch * 2} 540 L${840 + inch * 2} 520`} fill="none" stroke={INK} strokeWidth={5} />
            <Label x={840 + inch} y={505} text="1 INCH" size={30} color={INK} align="middle" />
          </g>
        </Layer>
        <Layer depth={0}>
          <TextPlate x={90} y={790} w={1040} h={190} color="#1F4F4C" opacity={0.8} />
          <Num x={130} y={922} text={READ.graniteRate.text /* #8 A */} size={92} color={CREAM} who="7-02 granite rate" />
          <YearsDial x={1580} y={230} r={150} value={v} family={NOON} f={f} plate="light" word={v >= rungValue(6) - 0.001 ? "10,000 YEARS" : undefined} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-03 · two blocks side by side: the granite barely changes; the mica schist beside it gullies (40 px/f drawing heads)
// and sheds grit (14 px/f) while its top wears down. Pill 'MICA SCHIST' (#8 A).
// ===============================================================================================================
const GULLIES = [0.2, 0.42, 0.63, 0.83];
const ShotGully: ShotFC<C07> = ({ f, len }) => {
  const bx = 1000;
  const bw = 640;
  const top = 330 + 70 * lin(f, 10, len);
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.05, panX: -0.008, panY: 0, frames: 200, seed: 6 }} vignette={0.14} grain={0.6}>
        <Layer depth={0.2}>
          <FamSky name="noon" />
          <Clouds f={f} y={-60} n={3} seed={8} />
        </Layer>
        <Layer depth={1}>
          <rect x={-300} y={860} width={2600} height={500} fill="#B58A5E" />
          <rect x={-300} y={860} width={2600} height={10} fill="#E8C8A0" />
          {/* granite: a block with crisp corners */}
          <rect x={240} y={330} width={560} height={540} rx={14} fill="#D8B49A" />
          <rect x={240} y={330} width={200} height={540} rx={14} fill="#F2D6BE" opacity={0.55} />
          <rect x={660} y={330} width={140} height={540} fill="#9C7460" opacity={0.45} />
          {Array.from({ length: 50 }, (_, i) => (
            <circle key={i} cx={260 + rnd(i * 3) * 520} cy={350 + rnd(i * 5) * 500} r={3 + rnd(i * 7) * 4} fill={["#B78F78", "#9C7460", "#F2D6BE"][i % 3]} />
          ))}
          <Label x={520} y={300} text="GRANITE" size={30} color={INK} align="middle" />
          {/* mica schist: a dark, glinting, layered block that wears down */}
          <path d={`M${bx} ${top + 20} Q${bx + bw * 0.3} ${top - 10} ${bx + bw * 0.55} ${top + 14} T${bx + bw} ${top + 8} L${bx + bw} 870 L${bx} 870 Z`} fill="#5E6E5A" />
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={bx} x2={bx + bw} y1={top + 50 + i * 56} y2={top + 40 + i * 56} stroke="#8FA08A" strokeWidth={4} opacity={0.5} />
          ))}
          {Array.from({ length: 26 }, (_, i) => (
            <circle key={"g" + i} cx={bx + 20 + rnd(i * 13) * (bw - 40)} cy={top + 40 + rnd(i * 17) * (840 - top)} r={2.5} fill="#FFF3C8" opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 7 + i))} />
          ))}
          {GULLIES.map((u, i) => {
            const gx = bx + bw * u;
            const k = lin(f, 8 + i * 18, 8 + i * 18 + (870 - top) / 40);
            const d = `M${gx} ${top + 10} q-22 90 6 180 q24 90 -10 200 q-22 90 8 ${870 - top - 390}`;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="#2A3428" strokeWidth={34} strokeLinecap="round" {...drawn(k)} />
                <path d={d} fill="none" stroke="#14201A" strokeWidth={14} strokeLinecap="round" {...drawn(k)} />
              </g>
            );
          })}
          <DotStream f={f} from={[bx + bw * 0.5, 840]} to={[bx + bw * 0.5 + 360, 900]} n={46} speed={14} spread={260} color="#7F8F72" size={6} seed={3} />
          <DotStream f={f} from={[bx + bw * 0.4, top + 30]} to={[bx + bw * 0.4, 860]} n={30} speed={15} spread={240} color="#A8B496" size={4} seed={5} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={1060} y={250} text="MICA SCHIST" size={28} fill={alpha("#1F4F4C", 0.82)} dot="#A8B496" appear={ez(f, 6, 18)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-04 · studio: inch ticks stack up into a tall ruler beside Tick (1.7 m at 300 px/m; the stack ends at 100 inches =
// 2.54 m = 762 px). Ticks land at 40 px/f, one every 1.3 f; the counter rolls to 100; then ABOUT 8 FT + OUR SUM (#8 C).
// ===============================================================================================================
const ShotStack: ShotFC<C07> = ({ f, len }) => {
  const floor = 900;
  const ppm = 300;
  const step = (0.0254 * ppm); // px per inch
  const gap = 1.3;
  const landed = Math.max(0, Math.min(100, Math.floor((f - 6) / gap) + 1));
  const done = landed >= 100;
  const doneAt = 6 + 99 * gap;
  const topY = floor - landed * step;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 600, zoom: 1.04 },
    { f: doneAt, x: 980, y: 480, zoom: 0.98 },
    { f: len, x: 990, y: 470, zoom: 0.96 },
  ]);
  const rx = 1080;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO_THEME} cam={cam} vignette={0.12} grain={0.5}>
        <StudioCyc f={f} floor={floor} seed={4} />
        <Layer depth={1}>
          {/* the backing board of the ruler: grows with the stack */}
          <rect x={rx - 70} y={topY - 6} width={140} height={floor - topY + 6} rx={8} fill={C.saffron} opacity={landed ? 1 : 0} />
          <rect x={rx - 70} y={topY - 6} width={22} height={floor - topY + 6} fill="#FFE6A8" opacity={landed ? 0.7 : 0} />
          {Array.from({ length: 100 }, (_, i) => {
            const t0 = 6 + i * gap;
            const age = f - t0;
            if (age < -3) return null;
            const fall = Math.max(0, -age) * 40; // 40 px/f drop
            const y = floor - (i + 1) * step - fall;
            const big = (i + 1) % 10 === 0;
            return <rect key={i} x={rx - 70} y={y} width={big ? 140 : 80} height={big ? 5 : 3} fill={INK} />;
          })}
          {/* the 1.7 m line at Tick's head and the stack's top */}
          <line x1={540} x2={rx - 80} y1={floor - 1.7 * ppm} y2={floor - 1.7 * ppm} stroke={INK} strokeWidth={3} strokeDasharray="10 8" opacity={0.5} />
          <ellipse cx={700} cy={floor + 6} rx={120} ry={16} fill="#000" opacity={0.18} />
          <Tick x={700} y={floor} pxPerM={ppm} frame={f} pose={done ? "point" : "stand"} expression={done ? "surprised" : "thinking"} look={0.9} headTilt={done ? -14 : -6} />
          {landed > 0 && landed < 100 ? <circle cx={rx} cy={topY} r={14} fill={C.saffronCore} opacity={0.9} /> : null}
        </Layer>
        <Layer depth={0}>
          <TextPlate x={1240} y={130} w={600} h={300} color="#1E4A5C" opacity={0.82} />
          <RollInt x={1280} y={270} value={READ.inches100.value! /* #8 C */} k={landed / 100} unit="INCHES" size={120} who="7-04 inches" />
          <Label x={1286} y={340} text="ABOUT 8 FT" size={40} color={C.saffronCore} opacity={ez(f, doneAt, doneAt + 10)} />
          <OurSumPill x={1286} y={395} size={24} appear={ez(f, doneAt + 6, doneAt + 16)} />
        </Layer>
      </Stage>
    </Pop>
  );
};
const STUDIO_THEME = familyOf("studio").theme;

// ===============================================================================================================
// 7-05 · Tick slams an OUR SUM stamp on a paper plate; a dashed straight line SAME RATE FOREVER draws (40 px/f), then a
// wobbling line beside it (the rate that may change) keeps rippling. Pill 'OUR SUM' (#8 C, F4).
// ===============================================================================================================
const ShotSum: ShotFC<C07> = ({ f, len }) => {
  const x0 = 360;
  const x1 = 1500;
  const wob = (x: number) => Math.sin(x / 70 + f / 6) * 26 + Math.sin(x / 31 - f / 4) * 10;
  const pts = Array.from({ length: 60 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / 59;
    const y = 640 - ((x - x0) / (x1 - x0)) * 300 + wob(x) * ((x - x0) / (x1 - x0));
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return (
    <Pop f={f}>
      <Stage theme={STUDIO_THEME} shotFrame={f} drift={{ zoom: 1.04, panX: 0.008, panY: 0, frames: 200, seed: 9 }} vignette={0.12} grain={0.5}>
        <StudioCyc f={f} floor={930} seed={6} />
        <Layer depth={1}>
          <rect x={268} y={198} width={1340} height={620} rx={18} fill="#04161C" opacity={0.22} transform="translate(10 14)" />
          <rect x={268} y={198} width={1340} height={620} rx={18} fill={C.paper} />
          <rect x={268} y={198} width={1340} height={60} rx={18} fill={C.tealDeep} />
          <Label x={300} y={240} text="A MILLION YEARS OF WEAR" size={26} color="#FFF8EC" />
          <line x1={x0} y1={760} x2={x1} y2={760} stroke={INK} strokeWidth={4} />
          <line x1={x0} y1={760} x2={x0} y2={300} stroke={INK} strokeWidth={4} />
          <path d={`M${x0} 640 L${x1} 340`} fill="none" stroke={C.tealDeep} strokeWidth={10} strokeDasharray="22 14" clipPath="url(#l07sumclip)" />
          <clipPath id="l07sumclip">
            <rect x={x0 - 10} y={200} width={(x1 - x0 + 20) * lin(f, 22, 22 + (x1 - x0) / 40)} height={700} />
          </clipPath>
          <path d={`M${pts.join(" L")}`} fill="none" stroke={C.rust} strokeWidth={8} strokeLinecap="round" {...drawn(lin(f, 52, 52 + (x1 - x0) / 40))} />
          <Label x={x1 - 10} y={322} text="SAME RATE FOREVER" size={26} color={C.tealDeep} align="end" opacity={ez(f, 40, 50)} />
          <ellipse cx={1700} cy={936} rx={110} ry={14} fill="#000" opacity={0.18} />
          <Tick x={1700} y={930} pxPerM={260} frame={f} facing={-1} pose={f < 12 ? "heave" : "press"} poseTo={f < 12 ? "press" : undefined} poseT={ez(f, 4, 10)} expression={f > 20 ? "happy" : "determined"} />
        </Layer>
        <Layer depth={0}>
          <Slam age={f - 8} x={1200} y={700} ring={C.saffron} size={160}>
            <OurSumPill x={1200} y={700} size={46} align="middle" />
          </Slam>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-06 · the cliff at dusk, faces softened (worn), a dashed ghost outline of the lost eight feet. MOVER: camera
// pull-back (zoom 1.45 → 1.0) + clouds (10 px/f) + a low sun bloom.
// ===============================================================================================================
const ShotWorn: ShotFC<C07> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 380, zoom: 1.45 },
    { f: len, x: 960, y: 520, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} cam={cam} vignette={0.25} grain={0.6}>
        <Layer depth={0.05}>
          <FamSky name="dusk" />
          <Bloom x={1700} y={820} r={600} color="#FFCF73" strength={0.75} />
        </Layer>
        <Layer depth={0.3}>
          <Clouds f={f} y={-60} n={3} seed={11} fill="#F6B45A" shade="#C0602A" />
        </Layer>
        <Layer depth={1}>
          <Cliff x={160} y={80} w={1600} h={1000} worn={1} ghost={ez(f, 10, 30)} dusk />
          <rect x={-900} y={1060} width={3800} height={500} fill="#3A2A20" />
        </Layer>
        <Layer depth={1.3}>
          <Motes frame={f} n={20} w={1920} h={1080} color="#FFCF73" seed={3} size={3} drift={40} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-07 + 7-08 · the camera lifts off the cliff into the sky (about 17 px/f, dusk to night); the AIR plate slides in
// beside the YEARS dial (20 px/f). Phase 7-08: CO2 dots rise (16 px/f), a warm band thickens, the AIR needle climbs
// (3 deg/f). Pill 'NOAA SAYS', label 'THOUSANDS OF YEARS' (#9 A, words only).
// ===============================================================================================================
const ShotAir: ShotFC<C07> = ({ f, c }) => {
  const p8 = c.co2 - c.air;
  const camY = path1(f, [
    [0, 560],
    [p8, -1900],
    [p8 + 400, -2000],
  ]);
  const cam = { x: 960, y: camY, zoom: 1 };
  const g = f - p8;
  const band = 40 + 130 * ez(f, p8, p8 + 110);
  const airIn = path1(f, [
    [10, 2200],
    [36, 1700],
  ]);
  const needle = 0.12 + 0.62 * lin(f, p8 + 4, p8 + 56);
  return (
    <Stage theme={NIGHT.theme} cam={cam} vignette={0.2} grain={0.5}>
      <Layer depth={1}>
        <defs>
          <linearGradient id="l07airsky" x1="0" y1="-3000" x2="0" y2="1100" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#06151D" />
            <stop offset="0.45" stopColor="#0D2B38" />
            <stop offset="0.72" stopColor="#1E6678" />
            <stop offset="0.88" stopColor="#E3813F" />
            <stop offset="1" stopColor="#F6B45A" />
          </linearGradient>
        </defs>
        <rect x={-800} y={-3200} width={3520} height={4400} fill="url(#l07airsky)" />
        <Bloom x={1700} y={900} r={500} color="#FFCF73" strength={0.6} />
        <Clouds f={f} y={-300} n={4} seed={13} fill="#F6B45A" shade="#C0602A" />
        <Clouds f={f} y={-1300} n={3} seed={17} fill="#3F7F8E" shade="#1E6678" speed={12} />
        <Cliff x={160} y={700} w={1600} h={1000} worn={1} dusk />
      </Layer>
      <Layer depth={0.6}>
        <StarsTint f={f} x={-200} y={-2600} w={2400} h={1600} n={90} speed={3} />
      </Layer>
      {f >= p8 - 20 ? (
        <Layer depth={0}>
          {/* the warm band: CO2 that stays (words only) */}
          <defs>
            <linearGradient id="l07band" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={C.amber} stopOpacity={0} />
              <stop offset="0.5" stopColor={C.amber} stopOpacity={0.55} />
              <stop offset="1" stopColor={C.amber} stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect x={-100} y={330 - band / 2} width={2120} height={band} fill="url(#l07band)" opacity={ez(f, p8 - 10, p8 + 10)} />
          <rect x={-100} y={330 - 2} width={2120} height={4} fill={C.saffronCore} opacity={0.5 * ez(f, p8, p8 + 20)} />
          <g opacity={ez(f, p8 - 20, p8)}>
            <DotStream f={g + 200} from={[700, 1150]} to={[700, 330]} n={90} speed={16} spread={720} color="#FFD27F" size={7} seed={4} />
          </g>
          <Label x={140} y={330 - band / 2 - 20} text="THOUSANDS OF YEARS" size={30} color={C.saffronCore} opacity={ez(f, p8 + 30, p8 + 44)} />
          <AgencyPill x={140} y={130} agency="NOAA SAYS" size={26} appear={ez(f, p8 + 6, p8 + 18)} />
        </Layer>
      ) : null}
      <Layer depth={0}>
        <YearsDial x={1420} y={880} r={120} value={rungValue(6)} family={NIGHT} f={f} plate="dark" />
        <g transform={`translate(${airIn - 1700} 0)`}>
          <AirDial x={1700} y={880} r={110} value={needle} />
        </g>
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 7-09 · the empty dark skyline under a teal haze that does not fade; the YEARS dial spins (24 deg/f); Tick sits on the
// rail looking up. MOVER: the dial needle spin + stars sliding (12 px/f) + haze rolling (10 px/f).
// ===============================================================================================================
const HazeRoll: React.FC<{ f: number; y: number; speed?: number; seed?: number; color?: string; strength?: number }> = ({ f, y, speed = 10, seed = 2, color = "#2FBFA8", strength = 0.22 }) => (
  <g>
    {Array.from({ length: 7 }, (_, i) => {
      const W = 3200;
      const x = mod(rnd(seed * 7 + i) * W - f * speed * (0.8 + 0.4 * rnd(i)), W) - 600;
      const rx = 380 + rnd(seed * 3 + i) * 260;
      return <ellipse key={i} cx={x} cy={y + (rnd(seed * 5 + i) - 0.5) * 80} rx={rx} ry={rx * 0.22} fill={color} opacity={strength} />;
    })}
  </g>
);
const ShotHaze: ShotFC<C07> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={NIGHT.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.01, panY: 0, frames: 220, seed: 12 }} vignette={0.3} grain={0.5}>
      <Layer depth={0.05}>
        <FamSky name="night" />
      </Layer>
      <Layer depth={0.2}>
        <StarsTint f={f} x={-200} y={-100} w={2400} h={700} n={110} speed={12} />
      </Layer>
      <Layer depth={0.6}>
        <Skyline f={f} family={NIGHT} ground={900} lights={0.04} wave={0} haze={1} seed={2} />
        <HazeRoll f={f} y={520} />
      </Layer>
      <Layer depth={1}>
        <rect x={-600} y={890} width={3200} height={400} fill="#06151D" />
        <Rail f={f} y={930} speed={3} family={NIGHT} />
        <Tick x={560} y={930} pxPerM={170} frame={f} pose="sit" expression="thinking" look={0.9} headTilt={-16} />
      </Layer>
      <Layer depth={0}>
        <YearsDial x={1500} y={300} r={170} value={mod(rungValue(6) + f * 0.1, 1)} family={NIGHT} f={f} plate="dark" word="THOUSANDS OF YEARS" />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 7-10 · a row of objects (a tower, a bridge, a bottle) dissolve one by one into dots drifting off (12 px/f, staggered).
// The cut line sweeps each object left to right; the dots leave from it. #19 (inference, no numeral).
// ===============================================================================================================
const Dissolve: React.FC<{ f: number; x: number; y: number; w: number; h: number; start: number; dur: number; seed: number; color: string; children: React.ReactNode }> = ({
  f,
  x,
  y,
  w,
  h,
  start,
  dur,
  seed,
  color,
  children,
}) => {
  const p = lin(f, start, start + dur);
  const id = `dis${seed}`;
  const N = 48;
  return (
    <g>
      <clipPath id={id}>
        <rect x={x + w * p} y={y - 20} width={w + 40} height={h + 40} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
      {Array.from({ length: N }, (_, i) => {
        const u = (i + rnd(seed * 3 + i)) / N;
        const birth = start + u * dur;
        const age = f - birth;
        if (age < 0 || age > 70) return null;
        const bx = x + w * u;
        const by = y + rnd(seed * 7 + i) * h;
        return <circle key={i} cx={bx + age * 12 * 0.9} cy={by - age * 12 * 0.45} r={4 + rnd(seed * 11 + i) * 5} fill={color} opacity={1 - age / 70} />;
      })}
    </g>
  );
};
const ShotObjects: ShotFC<C07> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={DUSK.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0, frames: 200, seed: 15 }} vignette={0.2} grain={0.6}>
      <Layer depth={0.05}>
        <FamSky name="dusk" />
        <Bloom x={1600} y={760} r={520} color="#FFCF73" strength={0.6} />
      </Layer>
      <Layer depth={0.3}>
        <Clouds f={f} y={40} n={3} seed={19} fill="#F6B45A" shade="#C0602A" />
      </Layer>
      <Layer depth={1}>
        <rect x={-600} y={820} width={3200} height={500} fill="#0F3540" />
        <rect x={-600} y={820} width={3200} height={10} fill="#3F7F8E" />
        <Dissolve f={f} x={300} y={260} w={260} h={560} start={10} dur={46} seed={1} color="#BFD3D0">
          <rect x={300} y={260} width={260} height={560} fill="#3F7F8E" />
          <rect x={300} y={260} width={70} height={560} fill="#6FA8B0" opacity={0.6} />
          {Array.from({ length: 24 }, (_, i) => (
            <rect key={i} x={326 + (i % 4) * 56} y={300 + Math.floor(i / 4) * 84} width={30} height={44} fill={i % 3 ? "#0F3540" : C.amber} opacity={0.85} />
          ))}
        </Dissolve>
        <Dissolve f={f} x={700} y={520} w={560} h={300} start={52} dur={46} seed={2} color="#F6B45A">
          <path d="M700 820 L700 600 Q980 440 1260 600 L1260 820 L1210 820 L1210 640 Q980 520 750 640 L750 820 Z" fill="#B58A5E" />
          <rect x={690} y={590} width={580} height={22} fill="#D9A878" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1={780 + i * 80} y1={600} x2={780 + i * 80} y2={555 + Math.abs(i - 2.5) * 18} stroke="#7A4A2E" strokeWidth={8} />
          ))}
        </Dissolve>
        <Dissolve f={f} x={1420} y={560} w={160} h={260} start={94} dur={40} seed={3} color="#7FC8D8">
          <BottleIcon x={1500} y={690} size={260} />
        </Dissolve>
      </Layer>
      <Layer depth={1.3}>
        <Motes frame={f} n={16} w={1920} h={1080} color="#FFCF73" seed={5} size={3} drift={40} />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 7-11 · the haze band stays over the dark skyline; a MAINTENANCE wrench tag drops (slam) and is slashed out (40 px/f).
// MOVER: tag slam + slash + haze rolling (10 px/f) + stars. #9 A; "needs no one" has no row (storyboard flags).
// ===============================================================================================================
const ShotMaint: ShotFC<C07> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={NIGHT.theme} shotFrame={f} drift={{ zoom: 1.05, panX: -0.01, panY: 0, frames: 220, seed: 17 }} vignette={0.3} grain={0.5}>
      <Layer depth={0.05}>
        <FamSky name="night" />
      </Layer>
      <Layer depth={0.2}>
        <StarsTint f={f} x={-200} y={-100} w={2400} h={600} n={90} speed={6} seed={3} />
      </Layer>
      <Layer depth={0.6}>
        <Skyline f={f} family={NIGHT} ground={960} lights={0.03} wave={0} haze={1} seed={7} />
        <HazeRoll f={f} y={600} seed={5} strength={0.26} />
        <HazeRoll f={f + 40} y={450} seed={9} strength={0.16} speed={13} />
      </Layer>
      <Layer depth={0}>
        <Slam age={f - 12} x={960} y={420} ring={C.saffronCore} size={240}>
          <g transform={`rotate(${Math.sin(f / 9) * 2} 960 300)`}>
            <line x1={960} y1={200} x2={960} y2={300} stroke={CREAM} strokeWidth={3} />
            <rect x={700} y={300} width={520} height={220} rx={26} fill={C.paper} />
            <rect x={700} y={300} width={520} height={18} rx={9} fill={C.saffron} />
            <circle cx={960} cy={330} r={10} fill={INK} />
            <Wrench x={790} y={420} size={90} color={C.tealDeep} />
            <Label x={1000} y={436} text="MAINTENANCE" size={40} color={INK} align="middle" />
          </g>
        </Slam>
        <line x1={660} y1={560} x2={1260} y2={260} stroke={CREAM} strokeWidth={22} strokeLinecap="round" {...drawn(lin(f, 44, 44 + 670 / 40))} />
        <line x1={660} y1={560} x2={1260} y2={260} stroke={INK} strokeWidth={8} strokeLinecap="round" {...drawn(lin(f, 44, 44 + 670 / 40))} />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 7-12 · the dive: the camera falls through the ground into dark maroon rock. MOVER: strata sliding up (24 px/f) +
// dust falling (16 px/f) + amber mineral glints riding with the rock.
// ===============================================================================================================
const DEEP_PAL = ["#5A2A1E", "#3A1812", "#4A1C16", "#2E1114", "#6A3020", "#1A0A0C", "#3A1812"];
const ShotDive: ShotFC<C07> = ({ f }) => {
  const scroll = f * 24;
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0, panY: 0, frames: 200, seed: 21 }} vignette={0.35} grain={0.5}>
        <Layer depth={0.05}>
          <FamSky name="night" />
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(0 ${-scroll})`}>
            <Skyline f={f} family={NIGHT} ground={340} lights={0.03} wave={0} haze={0.6} seed={4} scale={0.6} />
            <rect x={-800} y={330} width={3520} height={30} fill="#3F2A20" />
          </g>
          <Strata y0={360} scroll={scroll} palette={DEEP_PAL} seed={7} depth={5200} />
          <g transform={`translate(0 ${-scroll})`}>
            {Array.from({ length: 70 }, (_, i) => (
              <circle key={i} cx={rnd(i * 3) * 1920} cy={420 + rnd(i * 7) * 4600} r={2 + rnd(i * 5) * 3} fill={i % 3 ? "#FFCF73" : "#FF7A30"} opacity={0.7} />
            ))}
          </g>
          <DotStream f={f} from={[960, -60]} to={[960, 1140]} n={40} speed={16} spread={900} color="#E0B49A" size={4} seed={9} />
        </Layer>
        <Layer depth={0}>
          <Bloom x={960} y={540} r={700} color={C.lantern} strength={0.18} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL07: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL07(t);
  const shots: ShotDef<C07>[] = [
    { from: 0, S: ShotCliff, id: "7-01" },
    { from: c.ruler, S: ShotRuler, id: "7-02" },
    { from: c.gully, S: ShotGully, id: "7-03" },
    { from: c.stack, S: ShotStack, id: "7-04" },
    { from: c.sum, S: ShotSum, id: "7-05" },
    { from: c.worn, S: ShotWorn, id: "7-06" },
    { from: c.air, S: ShotAir, id: "7-07" }, // + 7-08 (PUSH)
    { from: c.haze, S: ShotHaze, id: "7-09" },
    { from: c.object, S: ShotObjects, id: "7-10" },
    { from: c.maint, S: ShotMaint, id: "7-11" },
    { from: c.dive, S: ShotDive, id: "7-12" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL07 = (t: SceneTiming): Cue[] => {
  const c = cuesL07(t);
  const run = (at: number, n: number, gap = 5, vol = 0.06): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    { at: 0, file: SFX.wind, vol: 0.14, dur: 130, fadeIn: 10, fadeOut: 30 },
    ...cutHit(c.ruler),
    { at: c.ruler + 40, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.gully),
    { at: c.gully + 10, file: SFX.debris, vol: 0.14, dur: 90, fadeOut: 30 },
    ...cutHit(c.stack),
    ...run(c.stack + 6, 26, 5, 0.05),
    ...cutHit(c.sum),
    { at: c.sum + 8, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.sum + 10, file: SFX.boom, vol: 0.3 * 0.6, dur: 90, fadeOut: 30 },
    ...cutHit(c.worn),
    ...cutHit(c.air),
    { at: c.air + 4, file: SFX.swirl, vol: 0.18, dur: 60 },
    ...cutHit(c.haze),
    ...cutHit(c.object),
    { at: c.object + 10, file: SFX.swirl, vol: 0.14, dur: 60 },
    ...cutHit(c.maint),
    { at: c.maint + 12, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.maint + 14, file: SFX.boom, vol: 0.3 * 0.7, dur: 90, fadeOut: 30 },
    ...cutHit(c.dive),
    { at: c.dive, file: SFX.deepWhoosh, vol: 0.26, dur: 70 },
  ];
};
