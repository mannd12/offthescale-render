// L14 scene l02 "The real Earth" (storyboard §3 "2 ·": shots 2-01…2-28, script lines 11-19, dusk → petrol → STUDIO_SET
// → noon → dusk, Act I). Shot components (hard cuts; continuous rows are phases): 2-01 (the uniform ball opens into the
// true layers) · 2-02 (Tick heaves a cubic metre: 5,500 kg per m³) · 2-03+2-04 (the density ruler: 13,000 at the
// centre; PREM's layer cards) · 2-05 (the scroll of layers) · 2-06+2-07 (the gravity strip: uniform vs real) · 2-08+2-09
// (the 1.09× peak; the PULL dial mirrors it) · 2-10 (two probes race) · 2-11 (38:11 rolls) · 2-12 (the probe crosses:
// PERFECT TUNNEL) · 2-13+2-14 (constant pull: 38:00) · 2-15+2-16 (three time bars; the real curve hugs the flat line) ·
// 2-17+2-18 (noon: any two points, the chord) · 2-19+2-20 (short ~42, long ~38) · 2-21 (the slider, no numerals
// between) · 2-22 (two cities, about the same) · 2-23 (the ruler: 12,742 km) · 2-24 (5.56 km/s average) · 2-25 (the best
// case) · 2-26 (the crate, the haze creeping in) · 2-27 (the 8 km/s pennant) · 2-28 (the hatch, haze billows; ZT down).
// Numbers drawn, each with its sources.md row: 5,500 kg per m³ · 13,000 kg per m³ (#3) · PREM (#19, V3 cleared) · 1.09×
// (#3, V2 cleared: the peak at the outer-core boundary, no depth label, F4) · the PULL stop "1.09 g" from line 2 on (#3)
// · 42:12 · 38:11 · 38:00 · ~42 MIN · ~38 MIN · 42 → 38 (#1, F2: nothing between) · 12,742 km (#13) · 5.56 km/s (#13,
// F19) · 8 km/s (#2). Layer cards carry names only (no spans). The crate's "?" is ink, not the vermilion tag.
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  CloudRack,
  Counter,
  Flock,
  GroundShadow,
  IF2,
  Kicker,
  Layer,
  Metric,
  Sky,
  Stage,
  Stars,
  Streamers,
  Tick,
  alpha,
  cameraAt,
  impact,
  mixHex,
  ramp,
  rnd,
  walkPhase,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { GAUGE, L14Gauges, STOP, pullValue } from "../L14Gauges";
import { L14_STRATA, StrataWall, Stratum } from "../tunnel";
import { CutGlobe, chordPoint, harmonic, oscillate } from "../cutglobe";
import { ClockFace, HatchLid, Probe } from "../props";
import { R_CORE, R_EARTH, R_INNER } from "../families";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Arrow, C, CREAM, ClockText, DUSK, Desert, INK, NOON, PETROL, Pop, STUDIO, Slab, StudioRoom, Tag, VoidField, clamp01, ez } from "./Cold";

const S = STUDIO;
const FLOOR = 860;

export const cuesL02 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    real: 0, // 2-01
    cube: p(0, "On average"), // 2-02
    centre: p(0, "At the centre"), // 2-03
    prem: at(1), // 2-04 (phase)
    scroll: p(1, "lays out the real layers"), // 2-05
    strip: at(2), // 2-06
    uniform: p(2, "It stays strong"), // 2-07 (phase)
    peak: p(2, "It even peaks"), // 2-08
    dial: p(2, "times the pull at the top"), // 2-09 (phase)
    race: at(3), // 2-10
    clocks: p(3, "With the real density"), // 2-11
    cross: p(3, "thirty-eight minutes and eleven"), // 2-12
    odd: at(4), // 2-13
    exactly: p(4, "thirty-eight minutes exactly"), // 2-14 (phase)
    same: p(4, "Nearly the same"), // 2-15
    hug: p(4, "The dense core keeps"), // 2-16 (phase)
    chord: at(5), // 2-17
    slide: p(5, "and the same maths"), // 2-18 (phase)
    short: at(6), // 2-19
    long: p(6, "long ones"), // 2-20 (phase)
    slider: p(6, "and everything in between"), // 2-21
    cities: p(6, "So a tunnel between"), // 2-22
    ruler: at(7), // 2-23
    avg: p(7, "Cross it in"), // 2-24
    best: p(7, "That is the best case"), // 2-25
    crate: at(8), // 2-26
    keep: p(8, "Keep the eight"), // 2-27
    tested: p(8, "It's about to be tested"), // 2-28
    last: end(8),
    end: t.frames,
  };
};
export type CL02 = ReturnType<typeof cuesL02>;

/** The pull (in g) at a depth share d (0 = surface, 1 = centre): PREM-like, close to flat, a slight rise to the 1.09
 *  peak at the outer-core boundary, then a near-linear fall to zero (#3, Klotz via Verification log 2; schematic). */
const CMB = (R_EARTH - R_CORE) / R_EARTH; // 0.453 of the way down (#12 #13)
const realPull = (d: number) => (d <= CMB ? 1 + (GAUGE.pullTop - 1) * Math.pow(d / CMB, 2.2) : GAUGE.pullTop * ((1 - d) / (1 - CMB)));
const uniformPull = (d: number) => 1 - d;

const DuskField: React.FC<{ f: number; seed?: number }> = ({ f, seed = 1 }) => (
  <g>
    <Sky family={DUSK} />
    <Stars frame={f} n={70} w={1920} h={700} color={DUSK.text} seed={seed} size={2.2} twinkle={0.6} />
    <Bloom x={1780} y={760} r={600} color={DUSK.light} core={40} coreColor="#FFF1C8" strength={0.7} />
    <CloudRack f={f} n={4} x0={-700} x1={2700} y0={160} y1={460} size={80} speed={2.6} body={alpha("#F3A35C", 0.6)} under={alpha("#7A3A20", 0.4)} top={alpha("#FFE0A8", 0.5)} seed={seed + 7} flat={1.6} />
  </g>
);

// ===============================================================================================================
// 2-01 · the uniform ball opens from the centre outward into the true cut-away (crust, mantle, outer, inner core);
// apricot sun rim-lights it; Tick small at left. MOVER: the ochre ring's inner edge sweeping outward (8 px/f) + hatch.
// ===============================================================================================================
const ShotReal: ShotFC<CL02> = ({ f, len }) => {
  const G = { cx: 900, cy: 530, R: 420 };
  const rr = Math.min(G.R, 10 + f * 8);
  return (
    <Stage theme={DUSK.theme} shotFrame={f} drift={{ zoom: 1.1, panX: 0.03, panY: 0.01, frames: len + 40, seed: 1 }} vignette={0.25} grain={0.5}>
      <Layer depth={0.2}>
        <DuskField f={f} />
      </Layer>
      <Layer depth={1}>
        <CutGlobe {...G} f={f} family={DUSK} rot={f * 0.9} />
        {rr < G.R ? <path d={`M${G.cx - G.R} ${G.cy} a${G.R} ${G.R} 0 1 0 ${2 * G.R} 0 a${G.R} ${G.R} 0 1 0 ${-2 * G.R} 0 Z M${G.cx - rr} ${G.cy} a${rr} ${rr} 0 1 1 ${2 * rr} 0 a${rr} ${rr} 0 1 1 ${-2 * rr} 0 Z`} fill={C.crust} fillRule="evenodd" /> : null}
        {rr < G.R ? <circle cx={G.cx} cy={G.cy} r={rr} fill="none" stroke={C.saffronCore} strokeWidth={8} /> : null}
        <GroundShadow x={260} y={1003} rx={50} color={DUSK.shadow} opacity={0.5} blur={8} />
        <Tick x={260} y={1000} pxPerM={110} frame={f} facing={1} pose="point" expression="happy" look={0.6} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={130} text="THE REAL EARTH" color={DUSK.text} size={30} />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 2-02 · Tick heaves a one-metre cube onto a scale; rock chips pour into it; the Counter rolls to 5,500 kg per m³.
// MOVER: chips pouring (18 px/f) + the cube's fill rising (10 px/f) + the scale needle + Counter.
// ===============================================================================================================
const ShotCube: ShotFC<CL02> = ({ f, len }) => {
  const K = { x: 860, y: FLOOR - 120, s: 280 };
  const lift = ez(f, 0, 18);
  const fill = clamp01((f - 10) * 10 / K.s);
  const k = ez(f, 6, Math.min(len - 6, 60));
  const needle = -60 + 120 * k + Math.sin(f / 3) * 4 * (1 - k);
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.0, frames: len + 40, seed: 2 }} vignette={0.25} grain={0.5}>
        <Layer depth={0.3}>
          <DuskField f={f + 100} seed={3} />
        </Layer>
        <Layer depth={1}>
          <Desert f={f} ground={FLOOR + 40} wind={10} seed={2}>
            <rect x={K.x - 200} y={FLOOR - 10} width={400} height={40} rx={10} fill={INK} />
            <circle cx={K.x + 240} cy={FLOOR - 60} r={70} fill={CREAM} stroke={INK} strokeWidth={8} />
            <line x1={K.x + 240} y1={FLOOR - 60} x2={K.x + 240 + Math.cos(((needle - 90) * Math.PI) / 180) * 56} y2={FLOOR - 60 + Math.sin(((needle - 90) * Math.PI) / 180) * 56} stroke={C.vermilion} strokeWidth={8} strokeLinecap="round" />
            <g transform={`translate(${(1 - lift) * -220} ${(1 - lift) * -120})`}>
              <rect x={K.x - K.s / 2} y={K.y - K.s / 2 - 10} width={K.s} height={K.s} fill={alpha(C.frost, 0.35)} stroke={CREAM} strokeWidth={6} />
              <rect x={K.x - K.s / 2 + 3} y={K.y + K.s / 2 - 10 - fill * K.s} width={K.s - 6} height={fill * K.s} fill={C.crust} />
              {Array.from({ length: 6 }, (_, i) => <line key={i} x1={K.x - K.s / 2} y1={K.y + K.s / 2 - 10 - fill * K.s + i * 40} x2={K.x + K.s / 2} y2={K.y + K.s / 2 - 10 - fill * K.s + i * 40 + 10} stroke={C.crustDeep} strokeWidth={4} opacity={i * 40 < fill * K.s ? 0.7 : 0} />)}
            </g>
            {fill < 1
              ? Array.from({ length: 16 }, (_, i) => {
                  const y = ((f * 18 + i * 37) % 520) + 100;
                  const top = K.y + K.s / 2 - 10 - fill * K.s;
                  if (y > top) return null;
                  const x = K.x - 50 + rnd(i) * 100;
                  return <rect key={i} x={x} y={y} width={22} height={18} fill={i % 2 ? C.crust : C.crustDeep} stroke={INK} strokeWidth={2} transform={`rotate(${f * 8 + i * 30} ${x} ${y})`} />;
                })
              : null}
            <GroundShadow x={470} y={FLOOR + 43} rx={70} color={DUSK.shadow} opacity={0.5} blur={8} />
            <Tick x={470} y={FLOOR + 40} pxPerM={170} frame={f} facing={1} pose={f < 20 ? "heave" : "hips"} expression="determined" look={0.5} squash={impact(f, 18, 0.1, 10)} />
          </Desert>
        </Layer>
        <Layer depth={0}>
          <rect x={1080} y={200} width={760} height={150} rx={26} fill={alpha(DUSK.shadow, 0.75)} />
          <Counter x={1120} y={315} value={5500 * k} max={5500} size={110} color={CREAM} unit="kg per m³" /* #3 */ />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 2-03 + 2-04 · the density ruler beside the cut-away fills from the surface to the middle; 13,000 at the centre; then
// PREM's layer cards slide in down the ruler and the pointer scans down. MOVER: the ruler fill (8.6 px/f) + Counter; then
// the cards sliding in (14 px/f) + the pointer scanning.
// ===============================================================================================================
const RULER = { x: 1150, top: 150, bot: 930 };
const ShotRuler: ShotFC<CL02> = ({ f, len, c }) => {
  const prem = c.prem - c.centre;
  const G = { cx: 620, cy: 540, R: 390 };
  const k = ez(f, 2, prem - 4);
  const fillH = (RULER.bot - RULER.top) * k;
  const cards: { n: string; from: number; to: number; col: string }[] = [
    { n: "CRUST", from: 0, to: 0.04, col: C.crust },
    { n: "MANTLE", from: 0.04, to: CMB, col: C.mantle },
    { n: "OUTER CORE", from: CMB, to: 1 - R_INNER / R_EARTH, col: C.outer },
    { n: "INNER CORE", from: 1 - R_INNER / R_EARTH, to: 1, col: C.inner },
  ];
  const scan = ez(f, prem, len);
  const yAt = (d: number) => RULER.top + d * (RULER.bot - RULER.top);
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} cam={{ x: 960 + f * 0.4, y: 540, zoom: 1.0 + f * 0.0007 }} vignette={0.25} grain={0.5}>
        <Layer depth={0.2}>
          <DuskField f={f + 200} seed={5} />
        </Layer>
        <Layer depth={1}>
          <CutGlobe {...G} f={f} family={DUSK} rot={f * 0.9} ruler />
          <rect x={RULER.x - 30} y={RULER.top - 10} width={60} height={RULER.bot - RULER.top + 20} rx={14} fill={INK} />
          <defs>
            <linearGradient id="l02dens" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={C.crust} />
              <stop offset={CMB} stopColor={C.mantle} />
              <stop offset={CMB + 0.01} stopColor={C.outer} />
              <stop offset="1" stopColor={C.inner} />
            </linearGradient>
          </defs>
          <rect x={RULER.x - 20} y={RULER.top} width={40} height={RULER.bot - RULER.top} rx={10} fill="url(#l02dens)" clipPath="url(#l02densClip)" />
          <clipPath id="l02densClip">
            <rect x={RULER.x - 20} y={RULER.top} width={40} height={fillH} />
          </clipPath>
          {Array.from({ length: 17 }, (_, i) => <rect key={i} x={RULER.x - 44} y={RULER.top + i * 48} width={i % 4 ? 14 : 24} height={5} fill={CREAM} />)}
          {cards.map((cd, i) => {
            const s = ez(f, prem + i * 10, prem + i * 10 + 14);
            const y0 = yAt(cd.from);
            const y1 = Math.max(y0 + 50, yAt(cd.to));
            const ym = (y0 + y1) / 2;
            return (
              <g key={cd.n} transform={`translate(${(1 - s) * 700} 0)`} opacity={s}>
                <rect x={RULER.x + 50} y={y0 + 3} width={12} height={y1 - y0 - 6} fill={cd.col} />
                <rect x={RULER.x + 80} y={ym - 30} width={300} height={60} rx={14} fill={cd.col} stroke={INK} strokeWidth={4} />
                <text x={RULER.x + 100} y={ym + 11} style={{ fontFamily: IF2.label, fontSize: 28, letterSpacing: 3, fill: INK }}>
                  {cd.n}
                </text>
              </g>
            );
          })}
          {f > prem ? <path d={`M${RULER.x - 70} ${yAt(scan)} l -34 -20 l 0 40 Z`} fill={C.saffron} stroke={INK} strokeWidth={3} /> : null}
        </Layer>
        <Layer depth={0}>
          <g opacity={1 - ez(f, prem - 6, prem + 4)}>
            <rect x={90} y={40} width={940} height={130} rx={24} fill={alpha(DUSK.shadow, 0.75)} />
            <Counter x={120} y={140} value={13000 * k} max={13000} size={96} color={CREAM} unit="kg per m³ AT THE CENTRE" /* #3 */ />
          </g>
          <g opacity={ez(f, prem + 4, prem + 16)}>
            <Tag x={120} y={110} text="PREM" /* #19 */ F={DUSK} dot={C.saffron} size={34} />
            <Tag x={120} y={980} text="SEISMIC MODEL OF EARTH'S INTERIOR" /* #19, Verification log 2 */ F={DUSK} size={26} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 2-05 · STUDIO: Tick unrolls a long scroll; the layers are painted on it to scale. MOVER: the scroll unrolling
// (20 px/f) + the roll turning + the tilt down.
// ===============================================================================================================
const ShotScroll: ShotFC<CL02> = ({ f, len }) => {
  const X = 980;
  const W = 420;
  const top = 120;
  const full = 1500;
  const h = Math.min(full, 40 + f * 20);
  const band = (d0: number, d1: number) => [top + d0 * full, top + d1 * full];
  const segs: [number, number, string][] = [];
  const steps: [number, string][] = [
    [0, C.crust],
    [0.01, C.mantle],
    [CMB / 2, C.outer],
    [(1 - R_INNER / R_EARTH) / 2, C.inner],
    [(1 + R_INNER / R_EARTH) / 2, C.outer],
    [1 - CMB / 2, C.mantle],
    [0.99, C.crust],
  ];
  steps.forEach(([d, col], i) => segs.push([d, i + 1 < steps.length ? steps[i + 1][0] : 1, col]));
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 20, x: 980, y: 900, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 300} seed={6} floor={1700}>
          <rect x={X - W / 2 - 40} y={top - 30} width={W + 80} height={30} rx={10} fill={INK} />
          <clipPath id="l02scroll">
            <rect x={X - W / 2} y={top} width={W} height={h} />
          </clipPath>
          <g clipPath="url(#l02scroll)">
            <rect x={X - W / 2} y={top} width={W} height={full} fill={CREAM} />
            {segs.map(([a, b, col], i) => {
              const [y0, y1] = band(a, b);
              return <rect key={i} x={X - W / 2 + 30} y={y0} width={W - 60} height={y1 - y0} fill={col} />;
            })}
            {Array.from({ length: 40 }, (_, i) => <line key={i} x1={X - W / 2 + 30} y1={top + i * 40} x2={X - W / 2 + 60} y2={top + i * 40} stroke={INK} strokeWidth={3} />)}
          </g>
          <g transform={`translate(${X} ${top + h}) rotate(${f * 12})`}>
            <rect x={-W / 2 - 10} y={-26} width={W + 20} height={52} rx={26} fill={CREAM} stroke={INK} strokeWidth={5} />
            {[-0.3, 0, 0.3].map((u) => <line key={u} x1={u * W} y1={-24} x2={u * W} y2={24} stroke={INK} strokeWidth={4} />)}
          </g>
          <Tick x={620} y={top + Math.min(h, 1100) + 60} pxPerM={150} frame={f} facing={1} pose="heave" expression="happy" look={0.4} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 2-06 … 2-09 · petrol: the tunnel slot with the probe sliding down; beside it the gravity strip (depth down, pull
// across): the real curve draws down from the surface, nearly flat then rising; the uniform line falls steadily; the
// gap fills teal; then the curve's peak: the pointer slides up and 1.00 → 1.09 rolls; the PULL dial mirrors it.
// MOVER: the strata wall (12 px/f) + the curve's drawing head (≈ 10 px/f); then the pointer + the PULL needle.
// ===============================================================================================================
const CH = { x0: 840, x1: 1420, y0: 200, y1: 930 };
const pullX = (g: number) => CH.x0 + (g / 1.15) * (CH.x1 - CH.x0);
const depthY = (d: number) => CH.y0 + d * (CH.y1 - CH.y0);
const curvePts = (fn: (d: number) => number, upto: number) => {
  const n = Math.max(2, Math.ceil(upto * 60));
  return Array.from({ length: n + 1 }, (_, i) => {
    const d = (upto * i) / n;
    return `${i ? "L" : "M"}${pullX(fn(d)).toFixed(1)} ${depthY(d).toFixed(1)}`;
  }).join(" ");
};
const ShotStrip: ShotFC<CL02> = ({ f, len, c }) => {
  const peak = c.peak - c.strip;
  const unif = c.uniform - c.strip;
  const dial = c.dial - c.strip;
  const isPeak = f >= peak;
  const drawK = ez(f, 4, Math.min(peak, unif + 70));
  const uK = ez(f, unif, unif + 40);
  const gapK = ez(f, unif + 30, peak);
  const ptr = ez(f, peak + 4, peak + 30);
  const roll = ez(f, peak + 4, peak + 40);
  const pv = f < dial ? 0.3 : (f - dial) / 50;
  const pullG = pv <= 1 ? 1 + (GAUGE.pullTop - 1) * Math.min(1, pv * 2) : GAUGE.pullTop * Math.max(0, 1 - (pv - 1) * 0.6);
  const yPk = depthY(CMB);
  return (
    <Pop f={f}>
      <Stage theme={PETROL.theme} shotFrame={f} drift={{ zoom: isPeak ? 1.12 : 1.06, panX: 0.02, panY: 0.01, frames: len + 60, seed: isPeak ? 4 : 3 }} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <rect x={-200} y={-200} width={2400} height={1500} fill={PETROL.sky[0]} />
          <StrataWall f={f} family={PETROL} layers={L14_STRATA} depth={300} pxPerKm={0.6} speed={12} cx={360} gap={200} x0={-200} x1={760} ruler={720} lamp={{ y: 470 }} />
          <Probe x={360} y={470} size={120} f={f} />
          <rect x={CH.x0 - 40} y={CH.y0 - 70} width={CH.x1 - CH.x0 + 80} height={CH.y1 - CH.y0 + 110} rx={24} fill={alpha(PETROL.shadow, 0.82)} stroke={alpha(C.bone, 0.4)} strokeWidth={3} />
          {/* to-scale strata tint behind the strip */}
          {[
            [0, CMB, C.mantle],
            [CMB, 1 - R_INNER / R_EARTH, C.outer],
            [1 - R_INNER / R_EARTH, 1, C.inner],
          ].map(([a, b, col], i) => (
            <rect key={i} x={CH.x0} y={depthY(a as number)} width={CH.x1 - CH.x0} height={depthY(b as number) - depthY(a as number)} fill={col as string} opacity={0.18} />
          ))}
          <line x1={CH.x0} y1={CH.y0} x2={CH.x0} y2={CH.y1} stroke={C.bone} strokeWidth={4} />
          <line x1={pullX(1)} y1={CH.y0 - 20} x2={pullX(1)} y2={CH.y1} stroke={alpha(C.bone, 0.35)} strokeWidth={3} strokeDasharray="10 10" />
          {gapK > 0 ? (
            <clipPath id="l02gap">
              <rect x={CH.x0} y={CH.y0} width={CH.x1 - CH.x0} height={(CH.y1 - CH.y0) * gapK} />
            </clipPath>
          ) : null}
          {gapK > 0 ? <path d={`${curvePts(realPull, 1)} ${Array.from({ length: 61 }, (_, i) => `L${pullX(uniformPull(1 - i / 60)).toFixed(1)} ${depthY(1 - i / 60).toFixed(1)}`).join(" ")} Z`} fill={alpha(C.teal, 0.55)} clipPath="url(#l02gap)" /> : null}
          {uK > 0 ? <path d={curvePts(uniformPull, uK)} stroke={alpha(C.bone, 0.75)} strokeWidth={7} fill="none" strokeDasharray="16 10" /> : null}
          <path d={curvePts(realPull, isPeak ? 1 : drawK)} stroke={C.saffron} strokeWidth={10} fill="none" strokeLinecap="round" />
          {!isPeak && drawK < 1 ? <circle cx={pullX(realPull(drawK))} cy={depthY(drawK)} r={16} fill={C.saffronCore} stroke={INK} strokeWidth={4} /> : null}
          {isPeak ? (
            <g>
              <line x1={pullX(GAUGE.pullTop)} y1={CH.y0 - 20} x2={pullX(GAUGE.pullTop)} y2={yPk} stroke={C.saffronCore} strokeWidth={4} strokeDasharray="8 8" opacity={ptr} />
              <path d={`M${pullX(GAUGE.pullTop) + 22} ${CH.y0 + (yPk - CH.y0) * ptr} l 36 -22 l 0 44 Z`} fill={C.saffron} stroke={INK} strokeWidth={3} />
              <circle cx={pullX(GAUGE.pullTop)} cy={yPk} r={18 + 6 * Math.sin(f / 3) * (1 - ptr * 0.5)} fill={C.saffronCore} stroke={INK} strokeWidth={4} />
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          {!isPeak ? (
            <g>
              <Tag x={60} y={110} text="PULL" F={PETROL} dot={C.saffron} size={30} />
              <Tag x={CH.x0} y={CH.y1 + 70} text="REAL" F={PETROL} dot={C.saffron} size={28} opacity={uK} />
              <Tag x={CH.x0 + 200} y={CH.y1 + 70} text="UNIFORM" F={PETROL} dot={C.bone} size={28} opacity={uK} />
            </g>
          ) : (
            <g>
              <rect x={40} y={60} width={600} height={150} rx={24} fill={alpha(PETROL.shadow, 0.82)} />
              <Metric x={70} y={180} value={(1 + (GAUGE.pullTop - 1) * roll).toFixed(2) + "×"} /* #3: a counter rolling to 1.09 */ size={120} color={CREAM} />
              <Tag x={60} y={980} text="THE PULL AT THE TOP = 1" F={PETROL} dot={C.bone} size={30} />
              <L14Gauges family={PETROL} frame={f} theme="light" pull={{ value: pullValue(pullG), stop: STOP.pull /* #3, line 2 on */, appear: ez(f, dial - 8, dial + 6) }} />
            </g>
          )}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 2-10 · two probes race down side-by-side tunnels (uniform ochre vs the real strata); the real one pulls ahead.
// MOVER: both walls streaming (16 px/f) + the gap widening + trail streaks.
// ===============================================================================================================
const UNIFORM_STRATA: Stratum[] = [{ from: -1000, to: 20000, color: C.crust, pattern: "rock" }];
const ShotRace: ShotFC<CL02> = ({ f, len }) => {
  const ya = 380 + f * 0.6;
  const yb = 380 + f * 2.2;
  return (
    <Pop f={f}>
      <Stage theme={PETROL.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.0, panY: 0.02, frames: len + 40, seed: 5 }} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <rect x={-200} y={-200} width={2400} height={1500} fill={PETROL.sky[0]} />
          <StrataWall f={f} family={PETROL} layers={UNIFORM_STRATA} speed={16} cx={420} gap={180} x0={-200} x1={760} />
          <StrataWall f={f} family={PETROL} layers={L14_STRATA} depth={600} pxPerKm={0.5} speed={16} cx={1100} gap={180} x0={760} x1={1460} />
          <rect x={754} y={-100} width={12} height={1300} fill={PETROL.shadow} />
          {[
            [420, ya],
            [1100, yb],
          ].map(([x, y], i) => (
            <g key={i}>
              {Array.from({ length: 5 }, (_, k) => (
                <line key={k} x1={x - 40 + k * 20} y1={y - 90 - k * 10} x2={x - 40 + k * 20} y2={y - 260 - k * 20} stroke={C.bone} strokeWidth={5} opacity={0.6 - k * 0.08} strokeLinecap="round" />
              ))}
              <Probe x={x} y={y} size={110} f={f} />
            </g>
          ))}
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={110} text="UNIFORM" F={PETROL} dot={C.crust} size={28} />
          <Tag x={1460} y={110} text="REAL" F={PETROL} dot={C.outer} size={28} align="end" />
          <Tag x={120} y={980} text="STRONGER PULL, LONGER" F={PETROL} dot={C.saffron} size={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 2-11 · STUDIO: two clocks, 42:12 (uniform) and the new one rolling to 38:11. MOVER: the second hand + digits rolling.
// ===============================================================================================================
const ShotClocks: ShotFC<CL02> = ({ f, len }) => {
  const k = ez(f, 2, len - 2);
  const secs = (38 * 60 + 11) * k; // #1
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={{ x: 960 + f * 1.2, y: 540, zoom: 1.0 + f * 0.002 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 500} seed={8}>
          <ClockFace x={560} y={420} r={210} minutes={42.2} ring={0.703} family={S} f={f} ringColor={C.crust} />
          <ClockText x={560} y={780} secs={42 * 60 + 12} /* #1 */ size={90} color={INK} />
          <ClockFace x={1260} y={420} r={210} minutes={(secs / 60) % 60} ring={secs / 3600} family={S} f={f} ringColor={C.teal} />
          <rect x={1060} y={690} width={400} height={130} rx={24} fill={alpha(INK, 0.78)} />
          <ClockText x={1260} y={790} secs={secs} /* #1 rolling to 38:11 */ size={100} color={CREAM} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 2-12 · the probe crosses the cut-away to the far side and sparkles; PERFECT TUNNEL (no air, no wall, #7); 38:11.
// MOVER: the probe crossing the disc (≈ 15 px/f) + the pan with it + the sparkle.
// ===============================================================================================================
const ShotCross: ShotFC<CL02> = ({ f, len }) => {
  const G = { cx: 860, cy: 520, R: 380 };
  const u = -1 + 2 * ez(f, 2, Math.max(30, len - 14));
  const [px, py] = chordPoint(G, 180, 0, u);
  const sp = f - (len - 14);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={{ x: 860 + u * 120, y: 540, zoom: 1.05 }} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 700}
          seed={10}
          hud={
            <g>
              <rect x={1380} y={90} width={430} height={140} rx={24} fill={alpha(INK, 0.78)} />
              <ClockText x={1595} y={200} secs={38 * 60 + 11} /* #1 */ size={100} color={CREAM} />
              <Tag x={120} y={980} text="PERFECT TUNNEL: NO AIR, NO WALL" /* #7 */ F={S} dot={C.teal} size={28} />
            </g>
          }
        >
          <CutGlobe {...G} f={f} family={S} path={{ a: 180, b: 0 }} line={{ to: u }} probe={u} trail={0.4} />
          <Probe x={px} y={py - 70} size={80} f={f} tilt={-90} lamp={false} />
          {sp > 0 ? Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <line key={i} x1={G.cx + G.R + Math.cos(a) * (20 + sp * 6)} y1={G.cy + Math.sin(a) * (20 + sp * 6)} x2={G.cx + G.R + Math.cos(a) * (50 + sp * 9)} y2={G.cy + Math.sin(a) * (50 + sp * 9)} stroke={C.saffronCore} strokeWidth={8} strokeLinecap="round" />;
          }) : null}
          <GroundShadow x={1620} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={1620} y={FLOOR} pxPerM={150} frame={f} facing={-1} pose="hold" expression={sp > 0 ? "proud" : "determined"} look={0.5} squash={impact(f, len - 12, 0.1, 10)} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 2-13 + 2-14 · a third clock slides in ("PULL NEVER CHANGES"); a flat line draws under it and a dot races along it;
// its clock settles at 38:00. MOVER: the clock sliding in (22 px/f) + the flat line's head (12 px/f) + digits rolling.
// ===============================================================================================================
const ShotOdd: ShotFC<CL02> = ({ f, len, c }) => {
  const ex = c.exactly - c.odd;
  const slide = ez(f, 0, 30);
  const lineK = ez(f, 26, ex + 10);
  const k = ez(f, ex - 30, ex + 8);
  const secs = 38 * 60 * k; // #1: 38 min 0 s
  const X0 = 1060;
  const X1 = 1700;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.01, frames: len + 60, seed: 6 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 900} seed={12} hud={<Tag x={120} y={980} text="PULL NEVER CHANGES" F={S} dot={C.saffron} size={30} />}>
          {[
            [260, 42 * 60 + 12, C.crust],
            [640, 38 * 60 + 11, C.teal],
          ].map(([x, s, col], i) => (
            <g key={i}>
              <ClockFace x={x as number} y={360} r={150} minutes={(s as number) / 60} ring={(s as number) / 3600} family={S} f={f} ringColor={col as string} />
              <ClockText x={x as number} y={620} secs={s as number} /* #1 */ size={64} color={INK} />
            </g>
          ))}
          <g transform={`translate(${(1 - slide) * 900} 0)`}>
            <ClockFace x={1380} y={360} r={150} minutes={secs / 60} ring={secs / 3600} family={S} f={f} ringColor={C.saffron} />
            <rect x={1200} y={530} width={360} height={120} rx={22} fill={alpha(INK, 0.78)} />
            <ClockText x={1380} y={622} secs={secs} /* #1 */ size={88} color={CREAM} />
            <rect x={X0 - 20} y={690} width={X1 - X0 + 40} height={150} rx={20} fill={alpha(CREAM, 0.85)} />
            <line x1={X0} y1={800} x2={X0 + (X1 - X0) * lineK} y2={800} stroke={C.saffron} strokeWidth={12} strokeLinecap="round" />
            <circle cx={X0 + (X1 - X0) * lineK} cy={800} r={18} fill={C.teal} stroke={INK} strokeWidth={4} />
            <text x={X0} y={740} style={{ fontFamily: IF2.label, fontSize: 24, letterSpacing: 2, fill: INK }}>
              PULL
            </text>
          </g>
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 2-15 + 2-16 · three time bars grow from a baseline: 42:12 longest, 38:11 and 38:00 nearly equal; then the real curve
// hugging the flat line slides in and the overlap shades teal. MOVER: bars growing (20 px/f, staggered); then the
// slide and the shading wipe (15 px/f).
// ===============================================================================================================
const ShotBars: ShotFC<CL02> = ({ f, len, c }) => {
  const hug = c.hug - c.same;
  const times = [42 * 60 + 12, 38 * 60 + 11, 38 * 60]; // #1
  const cols = [C.crust, C.teal, C.saffron];
  const base = 820;
  const sw = ez(f, hug - 4, hug + 16);
  const wipe = clamp01((f - hug - 10) * 15 / 620);
  const P0 = { x: 760, y: 300 };
  const PW = 620;
  const PH = 420;
  const px = (d: number) => P0.x + d * PW;
  const py = (g: number) => P0.y + PH - (g / 1.15) * PH;
  const real = Array.from({ length: 61 }, (_, i) => `${i ? "L" : "M"}${px(i / 60).toFixed(1)} ${py(realPull(i / 60)).toFixed(1)}`).join(" ");
  const under = Array.from({ length: 61 }, (_, i) => `L${px(i / 60).toFixed(1)} ${py(Math.min(1, realPull(i / 60))).toFixed(1)}`).join(" ");
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={{ x: 960 - f * 0.5, y: 540, zoom: 1.04 - f * 0.0004 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 1100} seed={14} hud={<Tag x={120} y={980} text="HIGH FOR MOST OF THE WAY" F={S} dot={C.teal} size={30} opacity={ez(f, hug + 10, hug + 22)} />}>
          <g transform={`translate(${-sw * 1300} 0)`}>
            <rect x={300} y={base} width={1000} height={10} fill={INK} />
            {times.map((tt, i) => {
              const h = (tt / times[0]) * 600 * ez(f, i * 8, i * 8 + 30);
              const x = 380 + i * 320;
              return (
                <g key={i}>
                  <rect x={x} y={base - h} width={200} height={h} rx={14} fill={cols[i]} stroke={INK} strokeWidth={5} />
                  <ClockText x={x + 100} y={base - h - 24} secs={tt} /* #1 */ size={60} color={INK} />
                </g>
              );
            })}
          </g>
          <g transform={`translate(${(1 - sw) * 1300} 0)`}>
            <rect x={P0.x - 60} y={P0.y - 70} width={PW + 120} height={PH + 140} rx={24} fill={alpha(CREAM, 0.9)} />
            <clipPath id="l02hug">
              <rect x={P0.x} y={P0.y - 20} width={PW * wipe} height={PH + 40} />
            </clipPath>
            <path d={`M${px(0)} ${py(0)} ${under} L${px(1)} ${py(0)} Z`} fill={alpha(C.teal, 0.6)} clipPath="url(#l02hug)" />
            <line x1={px(0)} y1={py(1)} x2={px(1)} y2={py(1)} stroke={INK} strokeWidth={6} strokeDasharray="14 10" />
            <path d={real} stroke={C.saffron} strokeWidth={10} fill="none" />
            <line x1={P0.x} y1={py(0)} x2={px(1)} y2={py(0)} stroke={INK} strokeWidth={4} />
            <text x={P0.x} y={P0.y - 30} style={{ fontFamily: IF2.label, fontSize: 24, letterSpacing: 2, fill: INK }}>
              PULL
            </text>
            <text x={px(1)} y={py(0) + 40} textAnchor="end" style={{ fontFamily: IF2.label, fontSize: 24, letterSpacing: 2, fill: INK }}>
              CENTRE
            </text>
            <circle cx={px(wipe)} cy={py(realPull(wipe))} r={16} fill={C.teal} stroke={INK} strokeWidth={4} />
          </g>
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// noon disc helpers (2-17 … 2-22): a top-down Earth disc on the noon sky, clouds and birds.
// ===============================================================================================================
const NoonField: React.FC<{ f: number; seed?: number }> = ({ f, seed = 1 }) => (
  <g>
    <Sky family={NOON} />
    <Bloom x={260} y={130} r={380} color={NOON.light} core={44} coreColor="#FFFBE6" strength={0.85} />
    <CloudRack f={f} n={5} x0={-700} x1={2700} y0={170} y1={900} size={110} speed={2.6} body="#FFFFFF" under="#B9DDE8" top="#FFFFFF" seed={seed + 21} />
    <Flock frame={f} x={-100 + ((f * 2.5) % 2300)} y={240} vx={0} n={5} size={12} color={alpha(NOON.shadow, 0.6)} seed={seed} />
  </g>
);
const NG = { cx: 760, cy: 560, R: 360 };

// 2-17 + 2-18 · a chord is drawn between two cities; the probe slides down it with a sine strip scrolling below.
// MOVER: the chord's drawing head (20 px/f) + the hatch rotating (2°/f); then the probe + the strip (10 px/f).
const ShotChord: ShotFC<CL02> = ({ f, len, c }) => {
  const sl = c.slide - c.chord;
  const draw = ez(f, 6, sl);
  const pu = f < sl ? -1 : oscillate((f - sl) / 45);
  const A = -155;
  const B = -25;
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.01, frames: len + 60, seed: 7 }} vignette={0.08} grain={0.5}>
        <Layer depth={0.3}>
          <NoonField f={f} />
        </Layer>
        <Layer depth={1}>
          <CutGlobe {...NG} f={f} family={NOON} rot={f * 2} path={{ a: A, b: B }} cities line={{ to: -1 + 2 * draw }} probe={f < sl ? null : pu} trail={0.3} />
          <Tick x={NG.cx} y={NG.cy - NG.R + 2} pxPerM={80} frame={f} facing={-1} pose="point" expression="happy" look={0.4} />
          {f >= sl ? (
            <g opacity={ez(f, sl, sl + 10)}>
              <rect x={1180} y={340} width={300} height={440} rx={20} fill={alpha(CREAM, 0.9)} />
              <path d={Array.from({ length: 41 }, (_, i) => `${i ? "L" : "M"}${1180 + 150 + Math.sin(((i * 11 + (f - sl) * 10) / 440) * Math.PI * 2) * 110} ${340 + i * 11}`).join(" ")} stroke={C.teal} strokeWidth={8} fill="none" />
              <circle cx={1330 + pu * 110} cy={560} r={16} fill={C.saffron} stroke={INK} strokeWidth={4} />
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={980} text="ANY TWO POINTS" F={NOON} dot={C.saffron} size={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 2-19 + 2-20 · a short chord near the surface with its clock (~42 MIN), then the long chord through the middle (~38 MIN).
// MOVER: the probe along the chord (12-14 px/f) + the chord swinging round + clouds.
const ShotChords: ShotFC<CL02> = ({ f, len, c }) => {
  const lg = c.long - c.short;
  const m = ez(f, lg - 4, lg + 16);
  const a = -120 + (-180 - -120) * m;
  const b = -60 + (0 - -60) * m;
  const pu = oscillate(f / 40);
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.03, panY: 0.01, frames: len + 60, seed: 8 }} vignette={0.08} grain={0.5}>
        <Layer depth={0.3}>
          <NoonField f={f + 100} seed={3} />
        </Layer>
        <Layer depth={1}>
          <CutGlobe {...NG} f={f} family={NOON} rot={f * 1.5} path={{ a, b }} cities line={{ to: 1 }} probe={pu} trail={0.3} />
          <ClockFace x={1360} y={380} r={150} minutes={42 - 4 * m} ring={(42 - 4 * m) / 60} family={NOON} f={f} />
        </Layer>
        <Layer depth={0}>
          <rect x={1150} y={600} width={440} height={140} rx={24} fill={alpha(NOON.shadow, 0.78)} />
          <Metric x={1190} y={710} value={m < 0.5 ? "~42" : "~38"} unit="MIN" /* #1 */ size={110} color={CREAM} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 2-21 · a slider drags from "short" to "long"; the chord stretches; a bar slides from the 42 mark to the 38 mark with
// no numerals between (F2). MOVER: the slider handle (16 px/f) + the chord morphing + the bar sliding.
const ShotSlider: ShotFC<CL02> = ({ f, len }) => {
  const k = ez(f, 4, len - 6);
  const a = -120 + (-180 - -120) * k;
  const b = -60 + (0 - -60) * k;
  const S0 = 300;
  const S1 = 1140;
  const T = { x: 1380, y0: 300, y1: 760 };
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.01, frames: len + 60, seed: 9 }} vignette={0.08} grain={0.5}>
        <Layer depth={0.3}>
          <NoonField f={f + 200} seed={5} />
        </Layer>
        <Layer depth={1}>
          <CutGlobe cx={720} cy={470} R={330} f={f} family={NOON} rot={f * 1.5} path={{ a, b }} cities line={{ to: 1 }} />
          <rect x={T.x - 16} y={T.y0} width={32} height={T.y1 - T.y0} rx={14} fill={INK} />
          {[
            [T.y0, "42"],
            [T.y1, "38"],
          ].map(([y, s]) => (
            <g key={s as string}>
              <rect x={T.x - 40} y={(y as number) - 4} width={80} height={8} fill={INK} />
              <text x={T.x + 60} y={(y as number) + 22} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 64, fill: INK }}>
                {s /* #1 */}
              </text>
            </g>
          ))}
          <rect x={T.x - 60} y={T.y0 + (T.y1 - T.y0) * k - 16} width={120} height={32} rx={14} fill={C.saffron} stroke={INK} strokeWidth={4} />
        </Layer>
        <Layer depth={0}>
          <rect x={S0 - 10} y={870} width={S1 - S0 + 20} height={20} rx={10} fill={alpha(NOON.shadow, 0.8)} />
          <circle cx={S0 + (S1 - S0) * k} cy={880} r={34} fill={C.saffron} stroke={INK} strokeWidth={6} />
          <Tag x={S0 - 20} y={950} text="SHORT" F={NOON} size={26} />
          <Tag x={S1 + 20} y={950} text="LONG" F={NOON} size={26} align="end" />
          <Tag x={1300} y={130} text="42 → 38" /* #1, F2 */ F={NOON} dot={C.saffron} size={34} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 2-22 · two cities joined by a short chord and by the long way through the middle; two probes arrive together.
// MOVER: both probes racing (≈ 12 px/f) + the hatch rotating + clouds.
const ShotCities: ShotFC<CL02> = ({ f, len }) => {
  const G = { cx: 760, cy: 540, R: 380 };
  const ph = (f % 70) / 70;
  const u = harmonic(ph);
  const [cx1, cy1] = chordPoint(G, -150, -30, u);
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.01, frames: len + 60, seed: 10 }} vignette={0.08} grain={0.5}>
        <Layer depth={0.3}>
          <NoonField f={f + 300} seed={7} />
        </Layer>
        <Layer depth={1}>
          <CutGlobe {...G} f={f} family={NOON} rot={f * 1.5} path={{ a: 180, b: 0 }} cities line={{ to: 1 }} probe={u} trail={0.3} />
          <path d={`M${chordPoint(G, -150, -30, -1).join(" ")} L${chordPoint(G, -150, -30, 1).join(" ")}`} stroke={C.saffron} strokeWidth={8} strokeDasharray="16 12" />
          {[-150, -30].map((d) => {
            const [x, y] = chordPoint(G, d, d, 0);
            return <circle key={d} cx={x} cy={y} r={20} fill={CREAM} stroke={INK} strokeWidth={5} />;
          })}
          <circle cx={cx1} cy={cy1} r={20} fill={C.teal} stroke={INK} strokeWidth={5} />
          <GroundShadow x={1450} y={FLOOR + 3} rx={60} color={NOON.shadow} opacity={0.3} blur={8} />
          <Tick x={1450} y={FLOOR} pxPerM={160} frame={f} facing={-1} pose="point" expression="proud" look={0.5} headTilt={Math.sin(f / 6) * 8} />
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={980} text="ABOUT THE SAME" F={NOON} dot={C.saffron} size={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 2-23 · STUDIO: the tunnel as a long ruler across the floor; Tick pulls its end and walks; the camera pans with him;
// the Counter rolls to 12,742 km (#13). MOVER: the pan (8 px/f, ruler ticks streaming) + Tick walking.
// ===============================================================================================================
const ShotTape: ShotFC<CL02> = ({ f, len }) => {
  const v = 8;
  const tx = 700 + f * v;
  const k = ez(f, 2, len - 6);
  return (
    <Stage theme={S.theme} cam={{ x: 960 + f * v, y: 540, zoom: 1.0 }} vignette={0.12} grain={0.5}>
      <StudioRoom
        f={f + 1300}
        seed={16}
        hud={
          <g>
            <rect x={90} y={60} width={780} height={150} rx={24} fill={alpha(INK, 0.78)} />
            <Counter x={130} y={175} value={12742 * k} max={12742} size={110} color={CREAM} unit="km" /* #13 */ />
          </g>
        }
      >
        <rect x={-200} y={FLOOR - 40} width={tx - 60 + 200} height={70} fill={C.saffron} stroke={INK} strokeWidth={5} />
        {Array.from({ length: Math.ceil((tx + 200) / 40) }, (_, i) => (
          <rect key={i} x={-200 + i * 40} y={FLOOR - 40} width={6} height={i % 5 ? 26 : 50} fill={INK} />
        ))}
        <rect x={-260} y={FLOOR - 90} width={140} height={160} rx={20} fill={INK} />
        <GroundShadow x={tx} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
        <Tick x={tx} y={FLOOR} pxPerM={150} frame={f} facing={1} walk={walkPhase(f, 14)} pose="carry" expression="determined" look={0.5} />
      </StudioRoom>
    </Stage>
  );
};

// ===============================================================================================================
// 2-24 · the average-speed dial: the needle settles at 5.56 km/s (#13, F19). MOVER: the needle sweeping + the push +
// streaks behind (12 px/f).
// ===============================================================================================================
const ShotAvg: ShotFC<CL02> = ({ f, len }) => {
  const k = ez(f, 0, 30);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={{ x: 960, y: 540 - f * 0.4, zoom: 1.0 + f * 0.003 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 1500} seed={18} hud={<Tag x={120} y={980} text="AVERAGE" F={S} dot={C.teal} size={32} />}>
          <Streamers f={f} n={16} x0={-300} x1={2300} y0={90} y1={800} len={220} width={8} speed={12} color={alpha(CREAM, 0.9)} opacity={0.55} seed={11} />
          <g transform="translate(560 90) scale(2.3)">
            <L14Gauges family={S} frame={f} theme="dark" x={0} y={0} speed={{ value: (GAUGE.speedAvg / GAUGE.speedPeak) * k + Math.sin(f / 5) * 0.01 * (1 - k), stop: STOP.speed /* #2 */, readout: GAUGE.speedAvg /* #13 */, roll: ez(f, 20, 34) }} />
          </g>
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 2-25 · a gold "THE BEST CASE" stamp slams onto the dial while the probe streaks the tunnel (30 px/f).
// ===============================================================================================================
const ShotBest: ShotFC<CL02> = ({ f, len }) => {
  const st = ramp(f, 10, 18);
  const sc = 2.2 - 1.2 * st;
  const lap = 40;
  const px = -200 + ((f % lap) / lap) * 2400;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.02, panY: 0.0, frames: len + 40, seed: 11 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 1700} seed={20}>
          <rect x={-300} y={820} width={2600} height={110} fill={PETROL.sky[0]} />
          {Array.from({ length: 30 }, (_, i) => <rect key={i} x={-300 + i * 90} y={820} width={44} height={110} fill={i % 2 ? C.crust : C.mantle} opacity={0.35} />)}
          <g>
            {Array.from({ length: 5 }, (_, i) => <line key={i} x1={px - 70 - i * 60} y1={862 + (i % 2) * 18} x2={px - 150 - i * 80} y2={862 + (i % 2) * 18} stroke={C.bone} strokeWidth={6} strokeLinecap="round" opacity={0.8 - i * 0.14} />)}
            <Probe x={px} y={875} size={70} f={f} tilt={-90} lamp={false} />
          </g>
          <g transform="translate(560 40) scale(2.0)">
            <L14Gauges family={S} frame={f} theme="dark" x={0} y={0} speed={{ value: GAUGE.speedAvg / GAUGE.speedPeak, stop: STOP.speed /* #2 */, readout: GAUGE.speedAvg /* #13 */ }} />
          </g>
          {st > 0 ? (
            <g transform={`translate(900 360) rotate(-12) scale(${sc})`} opacity={Math.min(1, st * 3)}>
              <rect x={-300} y={-62} width={600} height={124} rx={18} fill={C.saffron} stroke={INK} strokeWidth={8} />
              <text x={0} y={22} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 60, letterSpacing: 6, fill: INK }}>
                THE BEST CASE
              </text>
            </g>
          ) : null}
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 2-26 · Tick holds up one finger beside a sealed crate marked "?"; a faint blue haze creeps in from the left.
// MOVER: the haze front creeping (8 px/f, contrasty bands) + the crate bobbing.
// ===============================================================================================================
const ShotCrate: ShotFC<CL02> = ({ f, len }) => {
  const front = -300 + f * 8;
  const bob = Math.sin(f / 8) * 14;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.01, frames: len + 60, seed: 12 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 1900} seed={22}>
          {Array.from({ length: 7 }, (_, i) => {
            const y = 160 + i * 110;
            const x1 = front - (i % 3) * 120 + Math.sin(f / 9 + i) * 20;
            return <rect key={i} x={-600} y={y} width={Math.max(0, x1 + 600)} height={60} rx={30} fill={mixHex(C.teal, C.frost, 0.5)} opacity={0.5} />;
          })}
          <g transform={`translate(960 ${640 + bob}) rotate(${Math.sin(f / 10) * 3})`}>
            <rect x={-150} y={-130} width={300} height={260} rx={16} fill={C.saffron} stroke={INK} strokeWidth={8} />
            <path d="M-150 -130 L150 130 M150 -130 L-150 130" stroke={C.saffronDeep} strokeWidth={10} />
            <circle cx={0} cy={0} r={80} fill={CREAM} stroke={INK} strokeWidth={6} />
            <text x={0} y={42} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 120, fill: INK }}>
              ?
            </text>
          </g>
          <GroundShadow x={1400} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={1400} y={FLOOR} pxPerM={170} frame={f} facing={-1} pose="point" expression="happy" look={-0.6} headTilt={10} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 2-27 · the SPEED dial with a pennant planted at the 8 km/s end, waving; the needle sweeps up to it (#2).
// MOVER: the needle sweeping (3°/f) + the pennant waving (30 px) + the push + streaks.
// ===============================================================================================================
const ShotPennant: ShotFC<CL02> = ({ f, len }) => {
  const k = ez(f, 0, Math.min(40, len - 4));
  const sc = 2.3;
  const ox = 560;
  const oy = 90;
  const a = ((180 + 180 / 1.15) * Math.PI) / 180;
  const sx = ox + (140 + Math.cos(a) * 128) * sc;
  const sy = oy + (148 + Math.sin(a) * 128) * sc;
  const wv = Math.sin(f / 4);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={{ x: 960 + f * 0.6, y: 540 - f * 0.4, zoom: 1.0 + f * 0.003 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 2100} seed={24}>
          <Streamers f={f} n={14} x0={-300} x1={2300} y0={90} y1={800} len={220} width={8} speed={12} color={alpha(CREAM, 0.9)} opacity={0.5} seed={13} />
          <g transform={`translate(${ox} ${oy}) scale(${sc})`}>
            <L14Gauges family={S} frame={f} theme="dark" x={0} y={0} speed={{ value: k, stop: STOP.speed /* #2 */, readout: GAUGE.speedPeak /* #2 */, roll: k }} />
          </g>
          <line x1={sx} y1={sy} x2={sx + 30} y2={sy - 220} stroke={INK} strokeWidth={8} strokeLinecap="round" />
          <path d={`M${sx + 30} ${sy - 220} Q ${sx + 100} ${sy - 210 + wv * 30} ${sx + 170} ${sy - 200 + wv * 12} L${sx + 30} ${sy - 150} Z`} fill={C.saffron} stroke={INK} strokeWidth={5} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 2-28 · the camera pushes to the desert hatch; Tick opens the lid and blue haze billows out; ZT down the hatch.
// MOVER: haze puffs billowing out (12 px/f) + the lid swinging + the push (zoom to 3.2 into the shaft).
// ===============================================================================================================
const ShotHatch: ShotFC<CL02> = ({ f, len }) => {
  const H = { x: 960, y: 820, r: 110 };
  const open = ez(f, 6, 18);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: Math.max(20, len - 26), x: 960, y: 700, zoom: 1.5 },
    { f: len, x: 960, y: H.y + 10, zoom: 3.4 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} cam={cam} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <Desert f={f} ground={880} wind={10} seed={9}>
            <HatchLid x={H.x} y={H.y} r={H.r} open={open} family={DUSK} f={f} />
            {open > 0.2
              ? Array.from({ length: 12 }, (_, i) => {
                  const life = 50;
                  const tau = (f - 10 + i * (life / 12)) % life;
                  if (f - 10 < i * (life / 12) * 0) return null;
                  const r = 30 + tau * 2.6;
                  const x = H.x + Math.sin(i * 2.1) * tau * 3;
                  const y = H.y - tau * 12;
                  return <circle key={i} cx={x} cy={y} r={r} fill={mixHex(C.teal, C.frost, 0.5)} opacity={0.55 * (1 - tau / life)} />;
                })
              : null}
            <GroundShadow x={660} y={883} rx={60} color={DUSK.shadow} opacity={0.5} blur={8} />
            <Tick x={660} y={880} pxPerM={150} frame={f} facing={1} pose="crouch-reach" poseTo="shield" poseT={ez(f, 18, 30)} expression="determined" look={0.5} />
          </Desert>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL02: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL02(t);
  const shots: ShotDef<CL02>[] = [
    { from: 0, S: ShotReal, id: "2-01" },
    { from: c.cube, S: ShotCube, id: "2-02" },
    { from: c.centre, S: ShotRuler, id: "2-03" }, // + 2-04
    { from: c.scroll, S: ShotScroll, id: "2-05" },
    { from: c.strip, S: ShotStrip, id: "2-06" }, // + 2-07 … 2-09 (peak phase from c.peak)
    { from: c.race, S: ShotRace, id: "2-10" },
    { from: c.clocks, S: ShotClocks, id: "2-11" },
    { from: c.cross, S: ShotCross, id: "2-12" },
    { from: c.odd, S: ShotOdd, id: "2-13" }, // + 2-14
    { from: c.same, S: ShotBars, id: "2-15" }, // + 2-16
    { from: c.chord, S: ShotChord, id: "2-17" }, // + 2-18
    { from: c.short, S: ShotChords, id: "2-19" }, // + 2-20
    { from: c.slider, S: ShotSlider, id: "2-21" },
    { from: c.cities, S: ShotCities, id: "2-22" },
    { from: c.ruler, S: ShotTape, id: "2-23" },
    { from: c.avg, S: ShotAvg, id: "2-24" },
    { from: c.best, S: ShotBest, id: "2-25" },
    { from: c.crate, S: ShotCrate, id: "2-26" },
    { from: c.keep, S: ShotPennant, id: "2-27" },
    { from: c.tested, S: ShotHatch, id: "2-28" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL02 = (t: SceneTiming): Cue[] => {
  const c = cuesL02(t);
  return [
    { at: 0, file: SFX.swirl, vol: 0.2, dur: 50 },
    ...cutHit(c.cube),
    { at: c.cube + 18, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.cube + 10 + i * 8, file: SFX.click, vol: 0.06, dur: 8 })),
    ...cutHit(c.centre),
    { at: c.centre, file: SFX.riser, vol: 0.14, dur: c.prem - c.centre, fadeIn: 6, fadeOut: 6 },
    ...[0, 10, 20, 30].map((o) => ({ at: c.prem + o + 6, file: SFX.pop, vol: 0.12, dur: 16 })),
    ...cutHit(c.scroll),
    { at: c.scroll + 4, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...cutHit(c.strip),
    { at: c.strip, file: SFX.rumble, vol: 0.14, dur: c.peak - c.strip, fadeIn: 14, fadeOut: 14 },
    ...cutHit(c.peak),
    { at: c.peak + 30, file: SFX.popLong, vol: 0.2, dur: 30 },
    { at: c.dial, file: SFX.click, vol: 0.14, dur: 10 },
    ...cutHit(c.race),
    { at: c.race + 4, file: SFX.whoosh, vol: 0.22, dur: 40 },
    ...cutHit(c.clocks),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.clocks + 4 + i * 6, file: SFX.click, vol: 0.06, dur: 6 })),
    ...cutHit(c.cross),
    { at: c.cross + Math.max(16, c.odd - c.cross - 14), file: SFX.chime, vol: 0.22, dur: 60 },
    ...cutHit(c.odd),
    { at: c.odd + 10, file: SFX.pop, vol: 0.16, dur: 16 },
    ...cutHit(c.same),
    ...[0, 8, 16].map((o) => ({ at: c.same + o + 4, file: SFX.pop, vol: 0.14, dur: 16 })),
    { at: c.hug, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...cutHit(c.chord),
    ...[8, 30].map((o) => ({ at: c.chord + o, file: SFX.pop, vol: 0.14, dur: 16 })),
    ...cutHit(c.short),
    { at: c.long, file: SFX.click, vol: 0.14, dur: 10 },
    ...cutHit(c.slider),
    { at: c.slider + 4, file: SFX.swirl, vol: 0.16, dur: 40 },
    ...cutHit(c.cities),
    { at: c.cities + 34, file: SFX.pop, vol: 0.16, dur: 16 },
    ...cutHit(c.ruler, 0.16),
    ...Array.from({ length: 8 }, (_, i) => ({ at: c.ruler + 6 + i * 7, file: SFX.click, vol: 0.05, dur: 6 })),
    ...cutHit(c.avg),
    ...cutHit(c.best),
    { at: c.best + 16, file: SFX.popLong, vol: 0.24, dur: 30 },
    ...cutHit(c.crate),
    { at: c.crate, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...cutHit(c.keep),
    { at: c.keep + 30, file: SFX.click, vol: 0.14, dur: 10 },
    ...cutHit(c.tested),
    { at: c.tested + 6, file: SFX.pop, vol: 0.16, dur: 16 },
    { at: c.last - 10, file: SFX.deepWhoosh, vol: 0.28, dur: 60 },
  ];
};
