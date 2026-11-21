// L19 scene "l07" (storyboard §3 "7 · The fuzzy core", script lines 39-43). Package B.
// ShotDefs (hard cuts; PUSH / SLIDE rows are phases): 7-01 (+7-02, PUSH) · 7-03 · 7-04 · 7-05 · 7-06 · 7-07 (+7-08, SLIDE) · 7-09 ·
// 7-10 (+7-11, PUSH).
// Numbers drawn (data19 READ): ABOUT 63 % OF THE RADIUS (#12 A, model best fit) on 7-05 · ABOUT 18 % OF THE MASS (#12 A) on 7-06 ·
// MORE THAN 26,000 KM + OUR SUM (#13 C, 26,452; a model value) on 7-09 and 7-11 · 156 KM (#4 A) at the to-scale hair (7-09-7-11) ·
// ABOUT 170 TIMES + OUR SUM (#13 C) on 7-10 and 7-11. PREDICTED / MEASURED bars carry no numerals (#17, F3).
// The to-scale hair (F8): Section toScale on a 1,000-px radius = 156 / 71,492 × 1000 = 2.2 px.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Embers, Layer, Motes, Stage, Tick } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ } from "../data19";
import { TapeTicket } from "../tape";
import { Fog, Section } from "../interior";
import { AgencyPill, OurSumPill, WordPill } from "../tags19";
import { Sparks, StarsTint } from "../flows19";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  BandField19,
  C,
  CheckPen,
  DRIFT,
  DarkSky,
  FamSky,
  Floor,
  GlowBands,
  GlowRings,
  JunoArc,
  Label,
  Num,
  Planet,
  Plate,
  Pop,
  Readout,
  ValueBar,
  cl,
  ez,
  lin,
  mod,
  rnd,
  runOf,
} from "./b-parts";

export const cuesL07 = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    s701: 0,
    s702: frac(0, 0.5),
    s703: at(1),
    s704: frac(1, 0.52),
    s705: at(2),
    s706: frac(2, 0.5),
    s707: at(3),
    s708: frac(3, 0.35),
    s709: frac(3, 0.66),
    s710: at(4),
    s711: frac(4, 0.5),
    end: t.frames,
  };
};
export type C07 = ReturnType<typeof cuesL07>;

const FU = familyOf("furnace");
const SC = familyOf("scope");

const Furnace: React.FC<{ f: number; glow?: number }> = ({ f, glow = 0.26 }) => (
  <>
    <Layer depth={0.1}>
      <DarkSky name="furnace" />
      <BandField19 f={f} k="furnace" />
    </Layer>
    <Layer depth={0.5}>
      <GlowBands f={f} opacity={glow} />
    </Layer>
  </>
);

/** Two pairs of gravity bars (no numerals, F3): PREDICTED (amber) and MEASURED (lemon line). `over` 0..1 = how far PREDICTED stands
 *  above MEASURED (0 = matched). */
const GravityBars: React.FC<{ f: number; x: number; base: number; grow: number; over: number }> = ({ f, x, base, grow, over }) => {
  const meas = [300, 230];
  return (
    <g>
      <Plate x={x - 40} y={base - 560} w={560} h={640} color="#1E0503" opacity={0.6} rx={30} />
      {meas.map((m, i) => {
        const bx = x + 40 + i * 240;
        const ph = m * (1 + 0.55 * over);
        return (
          <g key={i}>
            <ValueBar x={bx} base={base} w={130} h={ph} k={grow} f={f} color={C.lever} waver={2} />
            <line x1={bx - 26} y1={base - m} x2={bx + 156} y2={base - m} stroke={C.heard} strokeWidth={8} strokeDasharray="20 10" strokeDashoffset={-f * 3} />
          </g>
        );
      })}
      <rect x={x - 10} y={base} width={500} height={6} fill={C.goldHot} />
      <Label x={x + 20} y={base - 500} text="PREDICTED" size={28} color={C.lever} />
      <Label x={x + 270} y={base - 500} text="MEASURED" size={28} color={C.heard} />
    </g>
  );
};

// ===============================================================================================================
// 7-01 · JUNO: GRAVITY: Juno glides along its bent arc (30 px/f); a small readout's bars tick up in a stagger (no numerals);
//        field lines pulse. PUSH → 7-02.
// ===============================================================================================================
const Shot701: ShotFC<C07> = ({ f }) => (
  <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(71)} vignette={0.24} grain={0.5}>
    <Furnace f={f} glow={0.22} />
    <Layer depth={0.3}>
      <StarsTint f={f} x={-200} y={-200} w={2320} h={1480} n={70} speed={10} seed={72} />
    </Layer>
    <Layer depth={1}>
      <GlowRings f={f} cx={640} cy={560} every={22} speed={20} r0={440} maxR={1100} color={C.goldHot} width={5} />
      <Planet cx={640} cy={560} r={440} f={f} shear={[18, -16, 20, -14]} />
      <JunoArc f={f} period={50} />
      <Plate x={1240} y={720} w={420} h={250} color="#1E0503" opacity={0.8} rx={24} stroke={C.goldRim} />
      {Array.from({ length: 8 }, (_, i) => {
        const h = 40 + 150 * cl(mod(f - i * 6, 48) / 24) * (0.5 + 0.5 * rnd(i * 3 + 1));
        return <rect key={i} x={1270 + i * 48} y={940 - h} width={30} height={h} rx={6} fill={i % 2 ? C.heard : C.goldHot} />;
      })}
    </Layer>
    <Layer depth={0}>
      <WordPill x={1240} y={660} text="JUNO: GRAVITY" size={34} F={FU} appear={lin(f, 4, 16)} />
    </Layer>
  </Stage>
);

// ===============================================================================================================
// 7-02 · OLD PICTURE: a cross-section with a hard round core (a ring of dashes turns round it, 4 deg/f); PREDICTED bars rise past
//        MEASURED (36 px/f)
// ===============================================================================================================
const Shot702: ShotFC<C07> = ({ f }) => (
  <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(72)} vignette={0.24} grain={0.5}>
    <Furnace f={f} />
    <Layer depth={1}>
      <Bloom x={600} y={560} r={600} color={C.glow} strength={0.35} />
      <Section f={f} cx={600} cy={560} radius={430} layers={["gas", "liquid", "metal"]} core="hard" swirl={1.2} />
      <g transform={`rotate(${(f * 4) % 360} 600 560)`}>
        <circle cx={600} cy={560} r={100} fill="none" stroke={C.goldHot} strokeWidth={8} strokeDasharray="22 16" />
      </g>
      <Label x={600} y={70} text="OLD PICTURE" size={36} color={C.goldHot} align="middle" halo="#3A0A04" />
      <GravityBars f={f} x={1160} base={900} grow={lin(f, 2, 2 + 470 / 36)} over={1} />
      <Sparks f={f} x={1100} y={1100} w={500} h={500} n={18} speed={24} angle={-90} seed={72} />
    </Layer>
  </Stage>
);
const Run701 = runOf<C07>((c) => [
  { at: c.s701, S: Shot701 },
  { at: c.s702, S: Shot702, dir: "left", blend: 16 },
]);

// ===============================================================================================================
// 7-03 · DILUTE CORE (MODEL): the hard core blurs; its dots diffuse outward (16-24 px/f) in a spreading fog
// ===============================================================================================================
const Shot703: ShotFC<C07> = ({ f, len }) => {
  const s = ez(f, 0, len * 0.9);
  return (
    <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(73)} vignette={0.24} grain={0.5}>
      <Furnace f={f} />
      <Layer depth={1}>
        <Bloom x={860} y={560} r={700} color={C.glow} strength={0.35} />
        <Section f={f} cx={860} cy={560} radius={470} layers={["gas", "liquid", "metal"]} core="dilute" spread={0.05 + 0.95 * s} swirl={1.2} />
        <g opacity={1 - ez(f, 0, len * 0.5)}>
          <circle cx={860} cy={560} r={80 * (1 + s)} fill={C.stripeRust} stroke={C.goldRim} strokeWidth={7} />
        </g>
        <Embers frame={f} x0={200} x1={1700} y={1100} n={30} color={C.goldHot} seed={73} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={90} y={110} text="DILUTE CORE (MODEL)" size={40} F={FU} appear={lin(f, 6, 18)} dash="10 8" />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 7-04 · FITS BETTER: the PREDICTED bars shrink onto the MEASURED line (34 px/f); the dots keep diffusing; a check draws (44 px/f)
// ===============================================================================================================
const Shot704: ShotFC<C07> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(74)} vignette={0.24} grain={0.5}>
      <Furnace f={f} />
      <Layer depth={1}>
        <Section f={f} cx={520} cy={580} radius={380} layers={["gas", "liquid", "metal"]} core="dilute" spread={1} swirl={1.2} />
        <GravityBars f={f} x={1120} base={900} grow={1} over={1 - ez(f, 4, 4 + 165 / 34 + 10)} />
        <CheckPen x={1380} y={250} k={lin(f, 24, 24 + 380 / 44)} s={0.9} />
        <Sparks f={f} x={1100} y={1100} w={500} h={500} n={16} speed={24} angle={-90} seed={74} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={90} y={110} text="FITS BETTER" size={42} F={FU} appear={lin(f, 20, 30)} />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 7-05 · 63 % of the radius: a dashed ring grows from the centre (32 px/f) and stops on 0.63; the fog billows past it and churns;
//        the camera pulls back
// ===============================================================================================================
const Shot705: ShotFC<C07> = ({ f, len }) => {
  const R = 470;
  const ring = 0.63 * lin(f, 4, 4 + (0.63 * R) / 32);
  return (
    <Pop f={f}>
      <Stage theme={FU.theme} cam={{ x: 960, y: 560, zoom: 1.22 - 0.2 * ez(f, 0, len) }} vignette={0.24} grain={0.5}>
        <Furnace f={f} />
        <Layer depth={1}>
          <Bloom x={980} y={600} r={700} color={C.glow} strength={0.35} />
          <Section f={f} cx={980} cy={600} radius={R} layers={["gas", "liquid", "metal"]} core="dilute" spread={0.85 + 0.15 * Math.sin(f * 0.08)} ring={ring} swirl={1.2} />
          <Embers frame={f} x0={200} x1={1700} y={1100} n={26} color={C.goldHot} seed={75} />
        </Layer>
        <Layer depth={0}>
          <Readout x={70} y={60} value={READ.r63.value! /* #12 A, model best fit */} k={lin(f, 4, 4 + (0.63 * R) / 32)} pre="ABOUT" unit="% OF THE RADIUS" size={80} w={780} appear={lin(f, 0, 10)} who="7-05 63" />
          <TapeTicket x={1560} y={130} word="MODEL" f={f} slam={lin(f, 10, 22)} swing={10} size={0.8} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-06 (6.9 s, three movers to the last frame) · 18 % of the mass: heavy dots drop (22 px/f) into a mass bar that fills to 18 %;
//        the fog churns; the glow bands rise; the bar's empty part streams a dashed hatch
// ===============================================================================================================
const Shot706: ShotFC<C07> = ({ f, len }) => {
  const bx = 1180;
  const bw = 230;
  const top = 160;
  const base = 940;
  const H = base - top;
  const fill = 0.18 * ez(f, 6, len * 0.3);
  const fy = base - H * fill;
  return (
    <Pop f={f}>
      <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(76)} vignette={0.24} grain={0.5}>
        <Furnace f={f} />
        <Layer depth={1}>
          <Bloom x={560} y={560} r={600} color={C.glow} strength={0.35} />
          <Fog f={f} cx={560} cy={560} r={420} n={90} spread={1} speed={18} />
          {/* the mass bar */}
          <rect x={bx} y={top} width={bw} height={H} rx={24} fill="#1E0503" stroke={C.goldRim} strokeWidth={6} />
          {Array.from({ length: 14 }, (_, i) => {
            const yy = top + mod(i * 70 + f * 4, 14 * 70);
            return yy < fy - 10 ? <line key={i} x1={bx + 14} y1={yy} x2={bx + bw - 14} y2={yy - 40} stroke={C.goldRim} strokeWidth={4} opacity={0.35} /> : null;
          })}
          <rect x={bx + 8} y={fy} width={bw - 16} height={base - fy - 8} rx={14} fill={C.gold} />
          <path d={`M${bx + 8} ${fy} ${Array.from({ length: 9 }, (_, k) => `L${bx + 8 + k * ((bw - 16) / 8)} ${fy + Math.sin(k + f * 0.4) * 6}`).join(" ")}`} stroke={C.goldHot} strokeWidth={8} fill="none" />
          {/* heavy dots dropping from the fog into the bar */}
          {Array.from({ length: 16 }, (_, i) => {
            const life = 48;
            const age = mod(f + i * 3, life);
            const t = age / life;
            const sx = 760 + rnd(i * 5) * 120;
            const sy = 380 + rnd(i * 7) * 300;
            const ex = bx + 30 + rnd(i * 9) * (bw - 60);
            const x = sx + (ex - sx) * t;
            const y = sy + (fy - sy) * t - Math.sin(Math.PI * t) * 160;
            return <circle key={i} cx={x} cy={y} r={11} fill={C.goldHot} stroke="#7A1A0C" strokeWidth={3} opacity={t > 0.94 ? 0 : 1} />;
          })}
          <Sparks f={f} x={560} y={1100} w={500} h={600} n={16} speed={22} angle={-90} seed={76} />
        </Layer>
        <Layer depth={0}>
          <Readout x={70} y={60} value={READ.m18.value! /* #12 A */} k={ez(f, 6, len * 0.3)} pre="ABOUT" unit="% OF THE MASS" size={80} w={720} appear={lin(f, 0, 10)} who="7-06 18" />
          <TapeTicket x={1560} y={1000} word="MODEL" f={f} slam={lin(f, 10, 22)} swing={10} size={0.8} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-07 · NASA SAYS: NOT SOLID: the fog churns, its edge heaving; convection arrows circle (6 deg/f). SLIDE → 7-08.
// ===============================================================================================================
const Shot707: ShotFC<C07> = ({ f }) => (
  <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(77)} vignette={0.24} grain={0.5}>
    <Furnace f={f} />
    <Layer depth={1}>
      <Bloom x={960} y={580} r={800} color={C.gold} strength={0.32} />
      <Fog f={f} cx={960} cy={580} r={520} n={100} spread={1} speed={22} />
      {[0, 1, 2, 3].map((k) => (
        <g key={k} transform={`rotate(${(f * 6 * (k % 2 ? -1 : 1) + k * 90) % 360} 960 580)`}>
          <path d="M960 180 A400 400 0 0 1 1300 380" fill="none" stroke={C.glow} strokeWidth={12} strokeLinecap="round" />
          <path d="M1300 380 l-6 -40 l34 22 Z" fill={C.glow} />
        </g>
      ))}
      <Embers frame={f} x0={200} x1={1700} y={1100} n={26} color={C.goldHot} seed={77} />
    </Layer>
    <Layer depth={0}>
      <AgencyPill x={90} y={110} agency="NASA SAYS" size={34} appear={lin(f, 4, 16)} />
      <WordPill x={380} y={110} text="NOT SOLID" size={34} F={FU} appear={lin(f, 10, 22)} />
    </Layer>
  </Stage>
);

// ===============================================================================================================
// 7-08 · NO CLEAR LINE: the fog's boundary becomes a dashed line marching (26 px/f) into the gold; a gradient sweeps outward
// ===============================================================================================================
const Shot708: ShotFC<C07> = ({ f, len }) => {
  const R = 380 + 80 * ez(f, 0, len);
  return (
    <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(78)} vignette={0.24} grain={0.5}>
      <Furnace f={f} />
      <Layer depth={1}>
        <circle cx={960} cy={580} r={760} fill={C.gold} opacity={0.85} />
        <circle cx={960} cy={580} r={760} fill="none" stroke={C.goldRim} strokeWidth={8} />
        <GlowRings f={f} cx={960} cy={580} every={18} speed={24} r0={R} maxR={760} color="#FFF0A0" width={10} />
        <Fog f={f} cx={960} cy={580} r={R / 0.95} n={90} spread={1} speed={22} />
        <circle cx={960} cy={580} r={R} fill="none" stroke={C.glow} strokeWidth={10} strokeDasharray="34 22" strokeDashoffset={-f * 26} />
        <Embers frame={f} x0={200} x1={1700} y={1100} n={20} color={C.goldHot} seed={78} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={90} y={110} text="NO CLEAR LINE" size={40} F={FU} appear={lin(f, 4, 16)} />
      </Layer>
    </Stage>
  );
};
const Run707 = runOf<C07>((c) => [
  { at: c.s707, S: Shot707 },
  { at: c.s708, S: Shot708, dir: "right", blend: 14 },
]);

// ===============================================================================================================
// 7-09 · the ruler from the cloud top down to the 63 % ring (drawing head 44 px/f, then ticks streaming 28 px/f) on a to-scale
//        section (R = 1,000 px; the 156 km hair at the rim is 2.2 px); the counter rolls to 26,000
// ===============================================================================================================
const SX = 760;
const SY = 1300;
const SR = 1000;
const RTOP = SY - SR; // 300: the 1-bar rim
const RBOT = SY - SR * 0.63; // 670: the 63 % ring
const RulerV: React.FC<{ f: number; k: number; x: number; speed?: number }> = ({ f, k, x, speed = 28 }) => {
  const L = (RBOT - RTOP) * cl(k);
  return (
    <g>
      <rect x={x + 6} y={RTOP + 8} width={46} height={L} rx={6} fill="#002A1A" opacity={0.3} />
      <rect x={x} y={RTOP} width={46} height={L} rx={6} fill={C.heard} stroke={C.lemonDeep} strokeWidth={3} />
      {Array.from({ length: 26 }, (_, i) => {
        const y = RTOP + mod(i * 16 + f * speed, 26 * 16);
        return y < RTOP + L - 4 ? <line key={i} x1={x} y1={y} x2={x + (i % 5 ? 16 : 30)} y2={y} stroke={C.ink} strokeWidth={i % 5 ? 2.5 : 4} /> : null;
      })}
      {k > 0 && k < 1 ? <circle cx={x + 23} cy={RTOP + L} r={16} fill="#FFF3C8" /> : null}
    </g>
  );
};
const ScaleSection: React.FC<{ f: number; ring?: number }> = ({ f, ring = 0.63 }) => (
  <g>
    <Section f={f} cx={SX} cy={SY} radius={SR} layers={["gas", "liquid", "metal"]} core="dilute" ring={ring} toScale swirl={0.6} />
  </g>
);
const Shot709: ShotFC<C07> = ({ f, len }) => {
  const k = lin(f, 2, 2 + 370 / 44);
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} cam={{ x: 960 - 60 * ez(f, 0, len), y: 520 + 40 * ez(f, 0, len), zoom: 1.02 + 0.08 * ez(f, 0, len) }} vignette={0.14} grain={0.5}>
        <Layer depth={0.1}>
          <FamSky name="scope" />
          <BandField19 f={f} k="scope" />
        </Layer>
        <Layer depth={1}>
          <ScaleSection f={f} />
          <RulerV f={f} k={k} x={SX + 40} />
          {k >= 1 ? <Num x={SX + 110} y={RBOT + 16} text="26,000 KM" size={44} color={C.heard} who="7-09 ruler" /> : null}
          <Label x={SX + 110} y={RTOP - 30} text="156 KM" size={30} color={C.heard} halo="#002A1A" />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#FFE7A0" seed={79} size={3} drift={20} />
        </Layer>
        <Layer depth={0}>
          <Readout x={1000} y={60} value={READ.km26k.value! /* #13 C (26,452; model) */} k={lin(f, 2, 36)} pre="MORE THAN" unit="KM" size={80} w={680} appear={lin(f, 0, 10)} who="7-09 26,000" />
          <OurSumPill x={1010} y={240} size={28} appear={lin(f, 8, 18)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-10 · ABOUT 170 TIMES: the camera zooms along the ruler onto the rim, where the 156 km bracket is a hair (ticks stream 30 px/f,
//        the hair's ring brightens). PUSH → 7-11.
// ===============================================================================================================
const Shot710: ShotFC<C07> = ({ f, len }) => {
  const u = ez(f, 0, len * 0.9);
  const zoom = Math.exp(Math.log(1.05) + (Math.log(6) - Math.log(1.05)) * u);
  return (
    <Stage theme={SC.theme} cam={{ x: 960 + (SX + 20 - 960) * u, y: 540 + (RTOP + 30 - 540) * u, zoom }} vignette={0.14} grain={0.5}>
      <Layer depth={0.1}>
        <FamSky name="scope" />
        <BandField19 f={f} k="scope" speed={3} />
      </Layer>
      <Layer depth={1}>
        <ScaleSection f={f} />
        <RulerV f={f} k={1} x={SX + 40} speed={30} />
        <circle cx={SX} cy={RTOP} r={26 / zoom + 6} fill="none" stroke={C.heard} strokeWidth={4 / Math.sqrt(zoom)} opacity={0.5 + 0.5 * u} />
        <Label x={SX - 30 / zoom} y={RTOP - 40 / zoom} text="156 KM" size={30 / Math.sqrt(zoom)} color={C.heard} halo="#002A1A" align="end" />
      </Layer>
      <Layer depth={0}>
        <Readout x={1000} y={60} value={READ.times170.value! /* #13 C */} k={lin(f, 4, 34)} pre="ABOUT" unit="TIMES" size={80} w={560} appear={lin(f, 0, 10)} who="7-10 170" />
        <OurSumPill x={1010} y={240} size={28} appear={lin(f, 8, 18)} />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 7-11 · "Both numbers are our sums": two OUR SUM pills flip onto the ruler's two numbers (12 deg/f); Tick (≥ 40 %) ticks them off;
//        the ruler's ticks stream (24 px/f)
// ===============================================================================================================
const Flip: React.FC<{ f: number; at: number; x: number; y: number }> = ({ f, at, x, y }) => {
  const k = lin(f, at, at + 15);
  if (k <= 0) return null;
  const sx = Math.abs(Math.cos((1 - k) * Math.PI * 1.5)) * (0.4 + 0.6 * k);
  return (
    <g transform={`translate(${x} ${y}) scale(${sx.toFixed(3)} 1) translate(${-x} ${-y})`}>
      <OurSumPill x={x} y={y} size={30} align="middle" />
    </g>
  );
};
const Shot711: ShotFC<C07> = ({ f }) => (
  <Stage theme={SC.theme} cam={{ x: 900 + 30 * Math.sin(f * 0.03), y: 520, zoom: 1.25 + 0.0015 * f }} vignette={0.14} grain={0.5}>
    <Layer depth={0.1}>
      <FamSky name="scope" />
      <BandField19 f={f} k="scope" />
    </Layer>
    <Layer depth={1}>
      <ScaleSection f={f} />
      <RulerV f={f} k={1} x={SX + 40} speed={24} />
      <Num x={SX + 110} y={RTOP + 120} text="ABOUT 170 TIMES" size={40} color={C.heard} who="7-11 170" />
      <Num x={SX + 110} y={RBOT + 16} text="MORE THAN 26,000 KM" size={40} color={C.heard} who="7-11 26,000" />
      <Flip f={f} at={8} x={SX + 290} y={RTOP + 170} />
      <Flip f={f} at={26} x={SX + 330} y={RBOT + 66} />
      <CheckPen x={SX + 640} y={RTOP + 160} k={lin(f, 22, 34)} s={0.35} />
      <CheckPen x={SX + 680} y={RBOT + 56} k={lin(f, 40, 52)} s={0.35} />
    </Layer>
    <Layer depth={1.1}>
      <Floor y={1010} />
      <Tick x={1640} y={1014} pxPerM={250} frame={f} facing={-1} pose="point" expression="proud" look={-0.6} headTilt={6 * Math.sin(f * 0.12)} />
    </Layer>
  </Stage>
);
const Run710 = runOf<C07>((c) => [
  { at: c.s710, S: Shot710 },
  { at: c.s711, S: Shot711, dir: "left", blend: 14 },
]);

const popped = (R: ShotFC<C07>): ShotFC<C07> => {
  const S: ShotFC<C07> = (p) => (
    <Pop f={p.f}>
      <R {...p} />
    </Pop>
  );
  return S;
};

// ===============================================================================================================

export const SceneL07: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL07(t);
  const shots: ShotDef<C07>[] = [
    { from: c.s701, S: popped(Run701), id: "7-01" }, // + 7-02 (PUSH)
    { from: c.s703, S: popped(Shot703), id: "7-03" },
    { from: c.s704, S: Shot704, id: "7-04" },
    { from: c.s705, S: Shot705, id: "7-05" },
    { from: c.s706, S: Shot706, id: "7-06" },
    { from: c.s707, S: popped(Run707), id: "7-07" }, // + 7-08 (SLIDE)
    { from: c.s709, S: Shot709, id: "7-09" },
    { from: c.s710, S: popped(Run710), id: "7-10" }, // + 7-11 (PUSH)
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL07 = (t: SceneTiming): Cue[] => {
  const c = cuesL07(t);
  const run = (at: number, n: number, gap = 6, vol = 0.05): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    ...cutHit(0),
    ...run(6, 6, 6, 0.05),
    { at: c.s702 + 4, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.s703),
    { at: c.s703 + 2, file: SFX.swirl, vol: 0.16, dur: 60 },
    ...cutHit(c.s704),
    { at: c.s704 + 24, file: SFX.chime, vol: 0.16, dur: 90, fadeOut: 30 },
    ...cutHit(c.s705),
    { at: c.s705 + 4, file: SFX.riser, vol: 0.12, dur: 60, fadeOut: 20 },
    ...cutHit(c.s706),
    { at: c.s706 + 8, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.s707),
    { at: c.s707 + 2, file: SFX.swirl, vol: 0.16, dur: 60 },
    { at: c.s708 + 4, file: SFX.click, vol: 0.1, dur: 8 },
    ...cutHit(c.s709),
    { at: c.s709 + 2, file: SFX.whoosh, vol: 0.14, dur: 50 },
    ...cutHit(c.s710),
    { at: c.s710 + 2, file: SFX.riser, vol: 0.12, dur: 70, fadeOut: 20 },
    { at: c.s711 + 10, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.s711 + 28, file: SFX.click, vol: 0.12, dur: 8 },
  ];
};
