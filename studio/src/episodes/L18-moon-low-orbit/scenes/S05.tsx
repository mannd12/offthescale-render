// L18 scene "l05" (storyboard §3 "5 · Rung three: the station's height", script lines 25-30). Package B.
// ShotDefs (hard cuts; PUSH / SLIDE rows are phases): 5-01 (+5-02, 5-03, 5-04) · 5-05 (+5-05b, KEY ART 2) · 5-06 · 5-07 · 5-08 ·
// 5-09 (+5-10, 5-11) · 5-12 · 5-13 · 5-14 · 5-15.
// Numbers drawn (all data18 READ): SURFACE 400 KM UP (#3, #8 A, 5-01) · ABOUT 6,800 KM + OUR SUM (#21 C, 5-02) · ABOUT 10,000 KM
// + OUR SUM (#21 C, 5-03) · MORE THAN 2 TIMES + OUR SUM (#21 C, 5-05b) · ABOUT 1.6 M/S2 (#1 A, 5-07) · MOON AT 8,500 KM + OUR SUM
// (#8 C, 5-08) · AT 8,500 KM (#8, 5-09) · ABOUT 2.2 M/S2 + OUR SUM (#11 C, 5-10) · 1.6 / 2.2 bar labels and ABOUT 1.4 TIMES TOO MUCH +
// OUR SUM (#11 C, 5-12) · EQUAL + OUR SUM (#11 C, 5-13). Words only: FALLS WITH THE SQUARE OF DISTANCE (5-04, Q6: textbook physics),
// WHERE STRETCH = HOLDING (5-14), HOLDING / STRETCH tags. No tide height, no ocean (F6); Tick only where the storyboard has him.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Layer, Motes, Stage, Tick } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ } from "../data18";
import { DistGauge, MoonToken, StopBadge, railY } from "../gauge";
import { Arrow18, PullArrows, PullBar, TidalBall } from "../tidal";
import { OurSumPill, WordPill } from "../tags18";
import { EarthDisc, EarthLimb } from "../planets18";
import { DotFlow, StarsTint18 } from "../movers18";
import { MoonFace } from "../sky";
import { RockChip } from "../icons18";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  BROWN,
  Bracket18,
  C,
  CheckMark,
  FamSky,
  Label,
  NightSky,
  Num,
  PaperGrid,
  Plate,
  Pop,
  ReadHead,
  Readout,
  Ruler18,
  alpha,
  clamp01,
  ez,
  fr,
  lin,
  logLerp,
  mixHex,
  mod,
  runOf,
} from "./b-parts";

export const cuesL05 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    s501: 0,
    s502: p(0, "its near side is about sixty-eight"),
    s503: p(0, "and its far side is about ten thousand"),
    s504: at(1),
    s505: p(1, "So the Earth pulls the near side more than twice"),
    s505b: p(1, "as hard as the far side"),
    s506: at(2),
    s507: p(2, "At its surface"),
    s508: at(3),
    s509: p(3, "near side against center"),
    s510: at(4),
    s511: p(4, "The Earth would pull the near side away"),
    s512: p(4, "That is about one point four times too much"),
    s513: at(5),
    s514: p(5, "That is exactly what the line means"),
    s515: p(5, "At the station's height"),
    end: t.frames,
  };
};
export type C05 = ReturnType<typeof cuesL05>;

const TAN = familyOf("tangerine");
const ABY = familyOf("abyss");
const GAU = familyOf("gauge");
const HOLD = C.model; // HOLDING arrows: the Moon's own pull (blue)
const PULL = C.lever; // STRETCH arrows: the Earth's stretch (lever orange, not vermilion)

// ===============================================================================================================
// 5-01 → 5-03 · the ball 400 km above the Earth (scale cross-section, 0.127 px/km): the camera pulls out from the gap, a
// ruler draws from the Earth's centre to the near side (6,800) and on through the ball (10,000); a reading head runs it.
// MOVER: camera pull-out (zoom 1.9 → 1) + ball craters 16 px/f + Earth clouds 14 px/f; then the ruler head + reading head.
// ===============================================================================================================
const S = 809 / 6378; // px per km (Earth radius 809 px) - #2 radius, #3 / #8 height, #19 Moon radius
const EX = 200;
const EY = 600;
const NEAR_X = EX + 6778 * S; // #21 near side 6,778 km
const BALL_X = EX + 8516 * S; // #8 centre 8,516 km
const BALL_R = 1738.1 * S; // #1
const FAR_X = EX + 10254 * S; // #21 far side 10,254 km
const RulerSet: React.FC<{ f: number; len: number; c: C05 }> = ({ f, c }) => {
  const a = c.s502 - c.s501;
  const b = c.s503 - c.s501;
  const u = ez(f, 0, a + 20);
  const cam = { x: 1110 + (960 - 1110) * u, y: 560 + (540 - 560) * u, zoom: logLerp(1.9, 1, u) * (1 + 0.05 * lin(f, a + 20, b + 120)) };
  const kNear = (NEAR_X - EX) / (FAR_X - EX);
  const k = f < b ? kNear * lin(f, a, a + 60) : kNear + (1 - kNear) * lin(f, b, b + 30);
  const showRead = f >= a + 60;
  const readEnd = f >= b + 30 ? FAR_X : NEAR_X;
  const inFar = f >= b;
  return (
    <Stage theme={TAN.theme} cam={cam} vignette={0.12} grain={0.5}>
      <Layer depth={0.15}>
        <FamSky name="tangerine" />
        <Bloom x={1500} y={-60} r={700} color="#FFE08A" strength={0.6} />
      </Layer>
      <Layer depth={0.4}>
        <PaperGrid f={f} />
      </Layer>
      <Layer depth={1}>
        <EarthDisc x={EX} y={EY} r={809} f={f} spin={14} />
        <TidalBall x={BALL_X} y={EY} r={BALL_R} f={f} spin={16} dir={180} tags={f >= a} />
        {/* the 400 km gap: a small bracket between the Earth's surface and the ball's near side (#3, #8) */}
        <Bracket18 x0={EX + 809} x1={NEAR_X} y={548} k={lin(f, 8, 30)} color={BROWN} feet={-22} width={4} />
        {/* the Earth's centre */}
        {f >= a - 10 ? (
          <g opacity={lin(f, a - 10, a)}>
            <circle cx={EX} cy={EY} r={16} fill={C.lemon} stroke={BROWN} strokeWidth={4} />
            <Label x={EX + 6} y={EY + 66} text="EARTH'S CENTER" size={26} color={C.lemon} halo="#0B2A33" align="middle" />
          </g>
        ) : null}
        <Ruler18 x={EX} y={EY} len={FAR_X - EX} k={k} h={36} />
        {showRead ? <ReadHead x0={EX + 20} y0={EY} x1={readEnd - 6} y1={EY} f={f - a - 60} speed={26} r={10} /> : null}
        {/* the near-side figure stays as a small diagram label once the far side is measured */}
        {inFar ? <Label x={NEAR_X} y={EY + 66} text="6,800 KM" size={28} color={C.lemon} halo="#0B2A33" align="middle" opacity={lin(f, b, b + 10)} /> : null}
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={16} w={1920} h={1080} color="#FFE08A" seed={5} size={3} drift={24} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={90} y={240} text={READ.surface400.text /* #3, #8 */} appear={lin(f, 20, 34)} size={24} fill={alpha(TAN.shadow, 0.78)} />
        {f >= a ? (
          <g>
            <OurSumPill x={96} y={738} appear={lin(f, a, a + 10)} />
            {!inFar ? (
              <Readout x={80} y={770} value={READ.near6800.value! /* #21 C */} k={lin(f, a + 4, a + 48)} pre="ABOUT" unit="KM" w={620} appear={lin(f, a, a + 10)} who="5-02 near side" />
            ) : (
              <Readout x={80} y={770} value={READ.far10000.value! /* #21 C */} k={lin(f, b + 2, b + 34)} pre="ABOUT" unit="KM" w={680} who="5-03 far side" />
            )}
          </g>
        ) : null}
        <StopBadge f={f} rung={3} family={TAN} />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 5-04 · the pull cone: lines out of the Earth; squares at D, 2D and 3D hold 1, 4 and 9 cells (drawn, never numbered);
// a travelling square grows along the cone (14 px/f, height 6 px/f) and dots stream down the cone lines (20 px/f).
// ===============================================================================================================
const Cone: React.FC<{ f: number; len: number; c: C05 }> = ({ f }) => {
  const ox = 220;
  const oy = 560;
  const tn = 0.2126; // tan 12°
  const sq = (x: number, cells: number, key: string, o = 1) => {
    const h = (x - ox) * tn;
    const w = h * 0.5;
    const pts = `M${x - w / 2} ${oy - h + w * 0.2} L${x + w / 2} ${oy - h - w * 0.2} L${x + w / 2} ${oy + h - w * 0.2} L${x - w / 2} ${oy + h + w * 0.2} Z`;
    return (
      <g key={key} opacity={o}>
        <path d={pts} fill={alpha(C.lemon, 0.32)} stroke={C.lemon} strokeWidth={5} strokeLinejoin="round" />
        {Array.from({ length: cells - 1 }, (_, i) => {
          const t = (i + 1) / cells;
          return <line key={"h" + i} x1={x - w / 2} y1={oy - h + w * 0.2 + 2 * h * t} x2={x + w / 2} y2={oy - h - w * 0.2 + 2 * h * t} stroke={C.lemon} strokeWidth={3} />;
        })}
        {Array.from({ length: cells - 1 }, (_, i) => {
          const t = (i + 1) / cells;
          const xx = x - w / 2 + w * t;
          return <line key={"v" + i} x1={xx} y1={oy - h + w * 0.2 - 0.4 * w * t} x2={xx} y2={oy + h + w * 0.2 - 0.4 * w * t} stroke={C.lemon} strokeWidth={3} />;
        })}
      </g>
    );
  };
  const tx = 420 + mod(f * 14, 1300);
  return (
    <>
      <Stage theme={TAN.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0, frames: 160, seed: 3 }} vignette={0.12} grain={0.5}>
        <Layer depth={0.15}>
          <FamSky name="tangerine" />
        </Layer>
        <Layer depth={0.4}>
          <PaperGrid f={f} />
        </Layer>
        <Layer depth={1}>
          <path d={`M${ox} ${oy} L1900 ${oy - (1900 - ox) * tn} L1900 ${oy + (1900 - ox) * tn} Z`} fill={alpha("#FFE08A", 0.18)} />
          <line x1={ox} y1={oy} x2={1900} y2={oy - (1900 - ox) * tn} stroke={BROWN} strokeWidth={4} strokeDasharray="16 12" strokeDashoffset={-f * 4} />
          <line x1={ox} y1={oy} x2={1900} y2={oy + (1900 - ox) * tn} stroke={BROWN} strokeWidth={4} strokeDasharray="16 12" strokeDashoffset={-f * 4} />
          {[-1, 0, 1].map((k) => (
            <DotFlow key={k} f={f} mode="line" from={[ox + 60, oy + k * 12]} to={[1880, oy + k * (1880 - ox) * tn * 0.85]} n={26} speed={20} spread={6} colors={[C.lemon, "#FFF3C8"]} size={6} seed={k + 4} />
          ))}
          {sq(620, 1, "d")}
          {sq(1020, 2, "2d")}
          {sq(1420, 3, "3d")}
          {sq(tx, 1, "t", Math.min(1, (tx - 420) / 120, (1720 - tx) / 120))}
          <EarthDisc x={ox} y={oy} r={120} f={f} spin={8} />
          {[
            [620, "D"],
            [1020, "2D"],
            [1420, "3D"],
          ].map(([x, s]) => (
            <Label key={s as string} x={x as number} y={oy + ((x as number) - ox) * tn + 56} text={s as string} size={30} color={BROWN} align="middle" />
          ))}
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#FFE08A" seed={9} size={3} drift={24} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={90} y={110} text="FALLS WITH THE SQUARE OF DISTANCE" size={26} fill={alpha(TAN.shadow, 0.78)} appear={lin(f, 4, 16)} />
        </Layer>
      </Stage>
    </>
  );
};

const Shot501 = runOf<C05>((c) => [
  { at: c.s501, S: RulerSet },
  { at: c.s504, S: Cone, dir: "left" },
]);

// ===============================================================================================================
// 5-05 + 5-05b (KEY ART 2) · the tan ball over the Earth limb: the near arrow grows past the far arrow, the ball draws into an
// egg; Tick on the limb gauges it, arms wide. 5-05b: copies of the far arrow stack end to end along a near arrow (two fit).
// MOVER: arrows growing (≈4 px/f + pulse) + ball craters 8 px/f + limb clouds 14 px/f + camera push; 5-05b copies sliding in
// (stagger) + egg pulsing + dashed remainder marching.
// ===============================================================================================================
const Shot505: ShotFC<C05> = ({ f, c }) => {
  const b = c.s505b - c.s505;
  const grow = ez(f, 0, 70);
  const pulse = 1 + 0.05 * Math.sin(f * 0.3);
  const near = 250 * grow * pulse;
  const far = (250 / 2.29) * grow * pulse; // #21 C ratio 2.29
  const stretch = 0.65 * ez(f, 6, 90) + (f > b ? 0.12 * Math.sin((f - b) * 0.25) : 0);
  const zoom = 1 + 0.07 * ez(f, 0, b + 60);
  const surprised = f > 18;
  const hop = f > 18 && f < 34 ? -Math.sin(((f - 18) / 16) * Math.PI) * 22 : 0;
  const tx = 330;
  const ty = 860 + 2600 - Math.sqrt(2600 * 2600 - (tx - 960) * (tx - 960));
  return (
    <Pop f={f}>
      <Stage theme={TAN.theme} cam={{ x: 980, y: 540, zoom }} vignette={0.14} grain={0.5}>
        <Layer depth={0.15}>
          <FamSky name="tangerine" />
          <Bloom x={260} y={-80} r={820} color="#FFE08A" strength={0.75} />
        </Layer>
        <Layer depth={0.4}>
          <PaperGrid f={f} />
        </Layer>
        <Layer depth={0.9}>
          <EarthLimb f={f} y={860} R={2600} cx={960} cloudSpeed={14} />
        </Layer>
        <Layer depth={1}>
          <TidalBall x={1060} y={400} r={170} f={f} stretch={stretch} near={near} far={far} dir={90} spin={8} tags={f > 30} />
          {f >= b ? (
            <g opacity={lin(f, b, b + 8)}>
              <PullArrows x={1430} y={250} near={250} far={250 / 2.29} f={f} dir={90} stack={lin(f, b + 2, b + 2 + 70)} width={16} />
            </g>
          ) : null}
          <Tick x={tx} y={ty + hop} pxPerM={260} frame={f} facing={1} pose={f < 14 ? "stand" : "shrug"} expression={surprised ? "surprised" : "thinking"} look={0.6} headTilt={-10} />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={18} w={1920} h={1080} color="#FFE08A" seed={7} size={3} drift={26} />
        </Layer>
        <Layer depth={0}>
          <OurSumPill x={96} y={120} appear={lin(f, 8, 20)} />
          {f >= b ? (
            <g opacity={lin(f, b, b + 10)}>
              <Plate x={80} y={160} w={720} h={120} color={TAN.shadow} opacity={0.82} />
              <Num x={112} y={248} text={READ.twice.text /* #21 C 2.29 */} size={66} who="5-05b" />
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-06 · the Moon holds itself together: on a dark field the ball with inward arrows all round; dust falls onto it (14 px/f);
// Tick stands on top with a plumb line that swings and points at the centre. Dark weight planned 0.45.
// ===============================================================================================================
const Shot506: ShotFC<C05> = ({ f, len }) => {
  const zoom = 1 + 0.1 * lin(f, 0, len);
  const sw = Math.sin(f * 0.14) * 9;
  const hx = 960 + 36 * 0.9;
  const hy = 392 - 104 * 0.9;
  return (
    <Pop f={f}>
      <Stage theme={ABY.theme} cam={{ x: 960, y: 560, zoom }} vignette={0.22} grain={0.5}>
        <Layer depth={0.1}>
          <NightSky />
        </Layer>
        <Layer depth={0.3}>
          <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={90} speed={12} angle={170} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={960} y={640} r={460} color={C.moonRim} strength={0.32} />
          <DotFlow f={f} mode="infall" from={[960, 640]} spread={560} n={80} speed={14} colors={[C.moonGlow, C.starApricot, C.moonLit]} size={5} />
          <TidalBall x={960} y={640} r={250} f={f} selfPull spin={6} />
          <Tick x={960} y={392} pxPerM={90} frame={f} facing={1} pose="hold" expression="happy" look={0.2} />
          <g transform={`rotate(${sw.toFixed(2)} ${hx} ${hy})`}>
            <line x1={hx} y1={hy} x2={hx} y2={hy + 78} stroke={C.lemon} strokeWidth={3} />
            <path d={`M${hx - 9} ${hy + 76} L${hx + 9} ${hy + 76} L${hx} ${hy + 96} Z`} fill={C.amber} stroke="#7A3A0C" strokeWidth={2} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-07 · at the surface: Tick lifts a rock and lets go; it falls faster each frame (≈4 → 22 px/f, strobe ghosts show the
// growing spacing), lands, puffs; a new rock, again (44-f loop). Counter ABOUT 1.6 M/S2 (#1 A). Dark weight 0.35.
// ===============================================================================================================
const Shot507: ShotFC<C05> = ({ f, len }) => {
  const P = 44;
  const ph = mod(f - 6, P);
  const hand: [number, number] = [700 + 46 * 1.6, 823 - 150 * 1.6];
  const ground = 2300 - Math.sqrt(1500 * 1500 - (hand[0] - 960) ** 2);
  const h = ground - 14 - hand[1];
  const g = (22 * 22) / (2 * h);
  const T = Math.sqrt((2 * h) / g);
  const falling = ph < T;
  const y = (t: number) => hand[1] + 0.5 * g * t * t;
  const landedAge = ph - T;
  return (
    <Pop f={f}>
      <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.04, panX: -0.008, panY: 0, frames: 150, seed: 6 }} vignette={0.22} grain={0.5}>
        <Layer depth={0.1}>
          <NightSky />
        </Layer>
        <Layer depth={0.3}>
          <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1300} n={80} speed={12} angle={180} seed={3} />
        </Layer>
        <Layer depth={1}>
          <MoonFace f={f} x={960} y={2300} radius={1500} scroll={4} />
          <Tick x={700} y={823} pxPerM={160} frame={f} facing={1} pose={ph > P - 14 || falling ? "heave" : "point"} expression="thinking" look={0.7} headTilt={falling ? 14 : 0} />
          {/* strobe ghosts of the current fall: equal time steps, growing gaps */}
          {Array.from({ length: 7 }, (_, i) => {
            const t = i * 3;
            if (t > Math.min(ph, T)) return null;
            return <circle key={i} cx={hand[0] + 8} cy={y(t)} r={15} fill="none" stroke={C.moonRim} strokeWidth={3} opacity={0.5} />;
          })}
          <g transform={`translate(${hand[0] + 8} ${falling ? y(ph) : ground - 14})`}>
            <RockChip x={0} y={0} size={40} rotate={f * 6} />
          </g>
          {!falling && landedAge < 22 ? (
            <g opacity={1 - landedAge / 22}>
              {Array.from({ length: 8 }, (_, i) => {
                const a = Math.PI + (i / 7) * Math.PI;
                const r = 10 + landedAge * 3.2;
                return <circle key={i} cx={hand[0] + 8 + Math.cos(a) * r * 1.6} cy={ground - 6 + Math.sin(a) * r * 0.6} r={6} fill={C.moonGlow} />;
              })}
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <Readout x={1100} y={110} value={READ.g16.value! /* #1 A 1.62 */} k={lin(f, 10, 50)} pre="ABOUT" unit="M/S2" dec w={560} appear={lin(f, 4, 14)} who="5-07 surface gravity" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-08 · the balance: HOLDING on one plate, STRETCH on the other, the Moon at 8,500 km on the pivot; the beam seeks and tips
// toward STRETCH (≈ 8 px/f at the ends); both arrows grow (30 px/f) then breathe.
// ===============================================================================================================
const Shot508: ShotFC<C05> = ({ f }) => {
  const px = 960;
  const py = 520;
  const ang = 7 * Math.sin(f * 0.12) * (1 - 0.4 * ez(f, 0, 80)) + 6 * ez(f, 10, 70);
  const a = (ang * Math.PI) / 180;
  const end = (s: number): [number, number] => [px + s * 480 * Math.cos(a), py + s * 480 * Math.sin(a)];
  const grow = ez(f, 6, 22);
  const br = 1 + 0.06 * Math.sin(f * 0.35);
  const plate = (s: number, col: string, L: number, word: string) => {
    const [ex, ey] = end(s);
    const by = ey + 200;
    return (
      <g>
        <line x1={ex} y1={ey} x2={ex - 100} y2={by} stroke={C.amber} strokeWidth={4} />
        <line x1={ex} y1={ey} x2={ex + 100} y2={by} stroke={C.amber} strokeWidth={4} />
        <path d={`M${ex - 130} ${by} Q${ex} ${by + 50} ${ex + 130} ${by} Z`} fill={C.amber} stroke="#7A3A0C" strokeWidth={4} />
        <Arrow18 x0={ex} y0={by - 14} x1={ex} y1={by - 14 - L * grow * br} color={col} width={20} />
        <WordPill x={ex} y={by + 74} text={word} size={26} align="middle" fill={alpha(TAN.shadow, 0.8)} />
      </g>
    );
  };
  return (
    <Pop f={f}>
      <Stage theme={TAN.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.006, panY: 0, frames: 120, seed: 8 }} vignette={0.12} grain={0.5}>
        <Layer depth={0.15}>
          <FamSky name="tangerine" />
          <Bloom x={300} y={-60} r={700} color="#FFE08A" strength={0.6} />
        </Layer>
        <Layer depth={0.4}>
          <PaperGrid f={f} floor={950} />
        </Layer>
        <Layer depth={1}>
          <path d={`M${px - 120} 950 L${px} ${py + 30} L${px + 120} 950 Z`} fill="#9A3C14" stroke="#5E2410" strokeWidth={5} />
          <line x1={end(-1)[0]} y1={end(-1)[1]} x2={end(1)[0]} y2={end(1)[1]} stroke="#5E2410" strokeWidth={22} strokeLinecap="round" />
          <line x1={end(-1)[0]} y1={end(-1)[1] - 4} x2={end(1)[0]} y2={end(1)[1] - 4} stroke={C.amber} strokeWidth={6} strokeLinecap="round" />
          {plate(-1, HOLD, 160, "HOLDING")}
          {plate(1, PULL, 220, "STRETCH")}
          <MoonToken x={px} y={py - 58} r={52} f={f} spin={5} />
          <Label x={px} y={py - 140} text="MOON AT 8,500 KM" size={28} color={BROWN} align="middle" />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#FFE08A" seed={2} size={3} drift={24} />
        </Layer>
        <Layer depth={0}>
          <OurSumPill x={96} y={110} appear={lin(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-09 + 5-10 · near side against centre: a bracket draws from the near side to the centre (AT 8,500 KM); at the near side a
// tug of war: HOLDING points in, STRETCH points out to the Earth and, in 5-10, grows past HOLDING's length (dashed ghost);
// counter ABOUT 2.2 M/S2. Tick reads it and jumps back. Camera pushes the whole time.
// ===============================================================================================================
const NearSide: React.FC<{ f: number; len: number; c: C05 }> = ({ f, c }) => {
  const b = c.s510 - c.s509;
  const bx = 1150;
  const by = 520;
  const r = 250;
  const st = 0.25;
  const rx = r * (1 + 0.38 * st);
  const nx = bx - rx - r * 0.12 * st;
  const cxm = bx - r * 0.12 * st;
  const holdL = 1.6 * 110; // #1 1.62 (scale 110 px per m/s2)
  const strL = (f < b ? 1.6 * 110 * ez(f, 20, 60) : 1.6 * 110 + (2.2 - 1.6) * 110 * ez(f, b + 2, b + 30)) * (1 + 0.04 * Math.sin(f * 0.3)); // #11 C 2.24
  const zoom = 1 + 0.16 * ez(f, 0, b + 40);
  const jump = f > b + 34 ? ez(f, b + 34, b + 50) : 0;
  const hop = f > b + 34 && f < b + 52 ? -Math.sin(((f - b - 34) / 18) * Math.PI) * 30 : 0;
  return (
    <Stage theme={TAN.theme} cam={{ x: 940, y: 540, zoom }} vignette={0.12} grain={0.5}>
      <Layer depth={0.15}>
        <FamSky name="tangerine" />
        <Bloom x={1400} y={-80} r={700} color="#FFE08A" strength={0.55} />
      </Layer>
      <Layer depth={0.4}>
        <PaperGrid f={f} floor={930} />
      </Layer>
      <Layer depth={1}>
        <EarthDisc x={-700} y={by} r={900} f={f} spin={10} />
        <TidalBall x={bx} y={by} r={r} f={f} stretch={st} spin={8} dir={180} />
        <Bracket18 x0={nx} x1={cxm} y={by - r - 56} k={lin(f, 4, 40)} color={BROWN} feet={-26} width={5} />
        {f > 40 ? <ReadHead x0={nx + 8} y0={by - r - 56} x1={cxm - 8} y1={by - r - 56} f={f - 40} speed={14} r={9} /> : null}
        <circle cx={cxm} cy={by} r={9} fill={BROWN} />
        {/* the tug of war at the near side */}
        <Arrow18 x0={nx + 6} y0={by} x1={nx + 6 + holdL * ez(f, 10, 30)} y1={by} color={HOLD} width={22} outline="#0B2A33" />
        <Arrow18 x0={nx - 6} y0={by} x1={nx - 6 - strL} y1={by} color={PULL} width={22} />
        {f >= b ? <rect x={nx - 6 - holdL} y={by - 22} width={holdL} height={44} rx={12} fill="none" stroke={HOLD} strokeWidth={4} strokeDasharray="10 8" strokeDashoffset={-f * 3} /> : null}
        <WordPill x={nx + 70} y={by + 64} text="HOLDING" size={22} fill={alpha("#0B2A33", 0.78)} appear={lin(f, 20, 30)} />
        <WordPill x={nx - 250} y={by + 64} text="STRETCH" size={22} fill={alpha(TAN.shadow, 0.8)} appear={lin(f, 30, 40)} />
        {f >= b - 4 ? <Tick x={660 + 80 * jump} y={930 + hop} pxPerM={120} frame={f} facing={-1} pose={jump > 0 ? "shrug" : "point"} expression={jump > 0 ? "surprised" : "thinking"} look={-0.3} /> : null}
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={14} w={1920} h={1080} color="#FFE08A" seed={4} size={3} drift={24} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={90} y={110} text="AT 8,500 KM" size={26} fill={alpha(TAN.shadow, 0.8)} appear={lin(f, 4, 14) * (1 - lin(f, b - 6, b))} />
        {f >= b ? (
          <g>
            <OurSumPill x={96} y={100} appear={lin(f, b, b + 10)} />
            <Readout x={80} y={136} value={READ.stretch22.value! /* #11 C 2.24 */} k={lin(f, b + 4, b + 26)} pre="ABOUT" unit="M/S2" dec w={560} appear={lin(f, b, b + 10)} who="5-10 stretch" />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};

// 5-11 · on the dark field a patch on the near side lifts toward the Earth (a new patch every 40 f) and dust streams after it
// (22 px/f). No Tick (F11). Dark weight 0.35.
const PatchLift: React.FC<{ f: number; len: number; c: C05 }> = ({ f }) => (
  <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.06, panX: -0.01, panY: 0, frames: 160, seed: 11 }} vignette={0.22} grain={0.5}>
    <Layer depth={0.1}>
      <NightSky />
    </Layer>
    <Layer depth={0.3}>
      <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={80} speed={10} angle={0} seed={8} />
    </Layer>
    <Layer depth={1}>
      <EarthDisc x={-520} y={540} r={760} f={f} spin={10} />
      <DotFlow f={f} mode="line" from={[860, 540]} to={[300, 540]} n={90} speed={22} spread={70} colors={[C.moonGlow, C.moonLit, C.starApricot]} size={6} />
      <TidalBall x={1180} y={540} r={270} f={f} spin={5} stretch={0.35} dir={180} patch={0.15 + 0.85 * lin(mod(f, 40), 0, 40)} />
    </Layer>
  </Stage>
);

const Shot509 = runOf<C05>((c) => [
  { at: c.s509, S: NearSide },
  { at: c.s511, S: PatchLift, dir: "left", blend: 16 },
]);

// ===============================================================================================================
// 5-12 · the bars: HOLDING 1.6 against STRETCH 2.2 (300 px per m/s2); the overshoot slice above the HOLDING level flashes;
// counter ABOUT 1.4 TIMES TOO MUCH + OUR SUM. Bars grow (36 px/f), stripes climb, the level line's dashes march (14 px/f).
// ===============================================================================================================
const Shot512: ShotFC<C05> = ({ f }) => {
  const base = 900;
  const hH = 1.6 * 300; // #1
  const hS = 2.2 * 300; // #11 C
  const t = lin(f, 0, 20);
  const flash = 0.5 + 0.5 * Math.sin(f * 0.4);
  return (
    <Pop f={f}>
      <Stage theme={TAN.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.006, panY: -0.004, frames: 110, seed: 12 }} vignette={0.12} grain={0.5}>
        <Layer depth={0.15}>
          <FamSky name="tangerine" />
        </Layer>
        <Layer depth={0.4}>
          <PaperGrid f={f} floor={base} />
        </Layer>
        <Layer depth={1}>
          <PullBar x={420} y={base} h={hH} t={t} f={f} w={230} color={HOLD} label="HOLDING" />
          <PullBar x={900} y={base} h={hS} t={t} f={f} w={230} color={PULL} label="STRETCH" />
          {t >= 1 ? (
            <g>
              <rect x={900} y={base - hS} width={230} height={hS - hH} rx={10} fill={mixHex(C.lemon, C.amber, flash)} opacity={0.85} />
              <rect x={894} y={base - hS - 6} width={242} height={hS - hH + 12} rx={14} fill="none" stroke="#FFF3C8" strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={-f * 3} />
            </g>
          ) : null}
          <line x1={360} y1={base - hH} x2={1220} y2={base - hH} stroke={BROWN} strokeWidth={5} strokeDasharray="18 12" strokeDashoffset={-f * 14} opacity={t} />
          <Num x={535} y={base - hH * t - 30} text="1.6" size={58} color={BROWN} align="middle" who="5-12 holding" />
          <Num x={1015} y={base - hS * t - 30} text="2.2" size={58} color={BROWN} align="middle" who="5-12 stretch" />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={12} w={1920} h={1080} color="#FFE08A" seed={6} size={3} drift={24} />
        </Layer>
        <Layer depth={0}>
          <OurSumPill x={1296} y={150} appear={lin(f, 4, 14)} />
          <Readout x={1280} y={190} value={READ.times14.value! /* #11 C 1.38 */} k={lin(f, 14, 34)} pre="ABOUT" unit="TIMES TOO MUCH" dec size={84} w={600} appear={lin(f, 4, 14)} who="5-12 overshoot" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-13 · the check: the rail zooms to the STIFF line (decade 300 → 700, ticks stream); HOLDING and STRETCH slide to the same
// length; a check locks them; they then breathe together and the rail hatch keeps streaming (18 px/f).
// ===============================================================================================================
const Shot513: ShotFC<C05> = ({ f, len }) => {
  const u = ez(f, 0, len * 0.55);
  const center = logLerp(30000, 9500, u);
  const decade = 300 + 400 * u;
  const sy = railY(9500, center, decade);
  const eq = ez(f, 6, 52);
  const br = 1 + 0.05 * Math.sin(f * 0.3) * lin(f, 52, 60);
  const L1 = (520 + (320 - 520) * eq) * br;
  const L2 = (80 + (320 - 80) * eq) * br;
  return (
    <Pop f={f}>
      <Stage theme={GAU.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0, panY: 0.004, frames: 110, seed: 13 }} vignette={0.14} grain={0.5}>
        <Layer depth={0.1}>
          <FamSky name="gauge" />
          <Bloom x={1300} y={sy} r={520} color={C.amber} strength={0.35} />
        </Layer>
        <Layer depth={1}>
          <DistGauge f={f} family={GAU} center={center} decade={decade} x={1300} speed={18} lit={["stiff"]} lines={["stiff"]} lineDraw={lin(f, 4, 30)} lineFrom={160} />
          <WordPill x={200} y={sy - 150} text="HOLDING" size={22} fill={alpha(GAU.shadow, 0.8)} />
          <Arrow18 x0={200} y0={sy - 90} x1={200 + L1} y1={sy - 90} color={HOLD} width={24} outline="#0B2A33" />
          <WordPill x={200} y={sy + 150} text="STRETCH" size={22} fill={alpha(GAU.shadow, 0.8)} />
          <Arrow18 x0={200} y0={sy + 90} x1={200 + L2} y1={sy + 90} color={PULL} width={24} />
          {f > 50 ? <CheckMark x={200 + 320 + 130} y={sy} k={lin(f, 50, 64)} s={0.6} color={C.lemon} /> : null}
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#FFE7A0" seed={3} size={3} drift={20} />
        </Layer>
        <Layer depth={0}>
          <OurSumPill x={96} y={110} appear={lin(f, 4, 14)} />
          <WordPill x={96} y={180} text="EQUAL" size={34} fill={alpha(GAU.shadow, 0.85)} appear={lin(f, 54, 64)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-14 · the token rides down across the STIFF line (the camera follows: ticks stream 21 px/f); above the line the field is
// HOLDING blue, below it STRETCH orange; the token's bar wipes from blue to orange as it crosses.
// ===============================================================================================================
const Shot514: ShotFC<C05> = ({ f, len }) => {
  const decade = 900;
  const center = logLerp(60000, 1300, lin(f, 0, len));
  const sy = railY(9500, center, decade);
  const cross = Math.round(len * (Math.log(60000 / 9500) / Math.log(60000 / 1300)));
  const wipe = ez(f, cross, cross + 18);
  const top = Math.max(-200, Math.min(1300, sy));
  return (
    <Pop f={f}>
      <Stage theme={GAU.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0, panY: 0, frames: 90, seed: 14 }} vignette={0.14} grain={0.5}>
        <Layer depth={0.1}>
          <FamSky name="gauge" />
        </Layer>
        <Layer depth={1}>
          <rect x={260} y={-300} width={960} height={top + 300} fill={HOLD} opacity={0.62} />
          <rect x={260} y={top} width={960} height={1600} fill={PULL} opacity={0.82} />
          <Label x={300} y={Math.max(60, top - 30)} text="HOLDING WINS" size={26} color={C.ink} opacity={top > 90 ? 1 : 0} />
          <Label x={300} y={Math.min(1050, top + 52)} text="STRETCH WINS" size={26} color={C.ink} opacity={top < 1020 ? 1 : 0} />
          <DistGauge f={f} family={GAU} center={center} decade={decade} x={1300} token={center} tokenR={40} speed={6} lit={f > cross ? ["stiff"] : []} lines={["stiff"]} lineFrom={260} />
          <rect x={300} y={520} width={940} height={40} rx={20} fill={HOLD} />
          <rect x={1240 - 940 * wipe} y={520} width={940 * wipe} height={40} rx={20} fill={PULL} />
          <rect x={300} y={520} width={940} height={12} rx={6} fill="#FFFFFF" opacity={0.25} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={96} y={110} text="WHERE STRETCH = HOLDING" size={26} fill={alpha(GAU.shadow, 0.85)} appear={lin(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-15 · the dive: on the survey paper the token drops to the foot of the rail (decade 1200, ticks ≈ 21 px/f) and past the
// STIFF line to the STATION mark; the STRETCH arrow towers over HOLDING (grows ≈ 6 px/f, then pulses).
// ===============================================================================================================
const Shot515: ShotFC<C05> = ({ f, len }) => {
  const center = logLerp(37900, 400, ez(f, 0, len * 0.9));
  const sL = 170 + 600 * ez(f, 6, len * 0.85) + 10 * Math.sin(f * 0.3);
  return (
    <Pop f={f}>
      <Stage theme={TAN.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0, panY: 0.006, frames: 110, seed: 15 }} vignette={0.12} grain={0.5}>
        <Layer depth={0.15}>
          <FamSky name="tangerine" />
        </Layer>
        <Layer depth={0.4}>
          <PaperGrid f={f} floor={960} />
        </Layer>
        <Layer depth={1}>
          <DistGauge f={f} family={TAN} center={center} decade={1200} x={1420} token={center} tokenR={42} speed={10} lit={center < 700 ? ["station"] : ["stiff"]} lines={["stiff", "station"]} lineFrom={1080} />
          <Arrow18 x0={440} y0={950} x1={440} y1={950 - 170} color={HOLD} width={30} outline="#0B2A33" />
          <Arrow18 x0={760} y0={950} x1={760} y1={950 - sL} color={PULL} width={30} />
          <Label x={440} y={1010} text="HOLDING" size={26} color="#FFE08A" align="middle" />
          <Label x={760} y={1010} text="STRETCH" size={26} color="#FFE08A" align="middle" />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={12} w={1920} h={1080} color="#FFE08A" seed={10} size={3} drift={24} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL05: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL05(t);
  const shots: ShotDef<C05>[] = [
    { from: 0, S: Shot501, id: "5-01" }, // + 5-02, 5-03 (PUSH) and 5-04 (SLIDE)
    { from: c.s505, S: Shot505, id: "5-05" }, // + 5-05b
    { from: c.s506, S: Shot506, id: "5-06" },
    { from: c.s507, S: Shot507, id: "5-07" },
    { from: c.s508, S: Shot508, id: "5-08" },
    { from: c.s509, S: Shot509, id: "5-09" }, // + 5-10 (PUSH), 5-11 (SLIDE)
    { from: c.s512, S: Shot512, id: "5-12" },
    { from: c.s513, S: Shot513, id: "5-13" },
    { from: c.s514, S: Shot514, id: "5-14" },
    { from: c.s515, S: Shot515, id: "5-15" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL05 = (t: SceneTiming): Cue[] => {
  const c = cuesL05(t);
  const run = (at: number, n: number, gap = 5, vol = 0.05): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    { at: 2, file: SFX.pop, vol: 0.2, dur: 20 },
    { at: c.s502 + 2, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.s503 + 2, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.s504, file: SFX.whoosh, vol: 0.12, dur: 40 },
    ...run(c.s504 + 6, 10, 6),
    ...cutHit(c.s505),
    { at: c.s505 + 18, file: SFX.boom, vol: 0.2, dur: 90, fadeOut: 30 },
    { at: c.s505b + 4, file: SFX.boom, vol: 0.14, dur: 70, fadeOut: 30 },
    ...cutHit(c.s506),
    { at: c.s506 + 4, file: SFX.pop, vol: 0.16, dur: 20 },
    ...cutHit(c.s507),
    { at: c.s507 + 10, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.s508),
    { at: c.s508 + 6, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.s509),
    { at: c.s509 + 4, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.s510 + 30, file: SFX.boom, vol: 0.2, dur: 90, fadeOut: 30 },
    { at: c.s511 + 4, file: SFX.debris, vol: 0.14, dur: 120, fadeOut: 40 },
    ...cutHit(c.s512),
    { at: c.s512 + 20, file: SFX.boom, vol: 0.2, dur: 90, fadeOut: 30 },
    ...cutHit(c.s513),
    { at: c.s513 + 52, file: SFX.click, vol: 0.14, dur: 8 },
    ...cutHit(c.s514),
    { at: c.s514 + 2, file: SFX.swirl, vol: 0.16, dur: 60 },
    ...cutHit(c.s515),
    { at: c.s515, file: SFX.deepWhoosh, vol: 0.24, dur: 70 },
  ];
};
