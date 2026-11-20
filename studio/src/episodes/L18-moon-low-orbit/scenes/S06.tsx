// L18 scene "l06" (storyboard §3 "6 · What the model says happens", script lines 31-36). Package B.
// ShotDefs (hard cuts; PUSH / SLIDE rows are phases): 6-01 · 6-02 (+6-03) · 6-04 (+6-05, 6-06, 6-07) · 6-08 · 6-09 (+6-10) · 6-11 ·
// 6-12 (+6-13) · 6-14 · 6-15 · 6-16 (KEY ART 3, holds 1.0 s).
// Numbers drawn (all data18 READ): 3,476 KM ACROSS + OUR SUM (#19 C, 6-03) · COMET SHOEMAKER-LEVY 9 and 1992 (#16 A, 6-05) ·
// FOUND 1993 and MORE THAN 20 PIECES (#16 A, 6-07) · IDEA 1 / IDEA 2 card titles (#15, scale labels). Words only: ROCK HAS STRENGTH
// (#6, Q3: the limit glows in the gap, the Moon token is NOT drawn between the lines), NASA SAYS (#5, #15, #16), FAR SMALLER (class B),
// THE EFFECT IS REAL, WHAT A MOON WOULD DO, BIG PIECES DO NOT STAY TOGETHER, THE MODEL'S ANSWER, MODEL (Q5: the ring has no size and no
// lifetime). F10: the comet passes near the planet; no impact imagery.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Kicker, Layer, Motes, Stage, Tick } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ } from "../data18";
import { DistGauge, MoonToken } from "../gauge";
import { Arrow18, DebrisRing, TidalBall } from "../tidal";
import { AgencyPill, FlipTag, OurSumPill, QuestionTag, Sheet18, WordPill, flipFor } from "../tags18";
import { BandedGiant, Comet, EarthDisc, EarthLimb, RingedPlanet } from "../planets18";
import { DotFlow, StarsTint18 } from "../movers18";
import { MoonFace } from "../sky";
import { RockChip } from "../icons18";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { BROWN, C, CheckMark, FamSky, GlowRings, Label, NightSky, PaperGrid, Pop, Readout, RockBlock, alpha, ez, lin, logLerp, mod, rnd, runOf, sm } from "./b-parts";

export const cuesL06 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    s601: 0,
    s602: p(0, "NASA says smaller objects"),
    s603: at(1),
    s604: at(2),
    s605: p(2, "Comet Shoemaker-Levy 9"),
    s606: p(2, "NASA says Jupiter's tidal forces"),
    s607: p(2, "By the time it was found in 1993"),
    s608: at(3),
    s609: p(3, "It shows the effect is real"),
    s610: p(3, "It does not show what a moon would do"),
    s611: at(4),
    s612: p(4, "A moon strayed inside the limit"),
    s613: p(4, "Or the material was inside the limit"),
    s614: at(5),
    s615: p(5, "That is the model's answer here"),
    s616: p(5, "and the pieces would spread into a ring"),
    end: t.frames,
  };
};
export type C06 = ReturnType<typeof cuesL06>;

const TAN = familyOf("tangerine");
const ABY = familyOf("abyss");

// ===============================================================================================================
// 6-01 · Tick (≥ 40 % of the frame) holds up a chip of rock and squeezes it; a strength meter fills in it (30 px/f, looping
// squeezes); on the rail beside him the gap between the STIFF and FLUID lines glows and its glow rings spread (24 px/f).
// Q3: the limit is drawn in the gap; the Moon token is not shown between the lines.
// ===============================================================================================================
const Shot601: ShotFC<C06> = ({ f }) => {
  const ppm = 270;
  const tx = 470;
  const ty = 1010;
  const hx = tx + 36 * (ppm / 100);
  const hy = ty - 104 * (ppm / 100);
  const sq = mod(f, 40);
  const fill = Math.min(1, sq / 12);
  const squeeze = sq < 12 ? 0.94 : 1;
  const center = 13200;
  const decade = 620;
  const yS = 540 - (Math.log10(9500) - Math.log10(center)) * decade;
  const yF = 540 - (Math.log10(18400) - Math.log10(center)) * decade;
  return (
    <Pop f={f}>
      <Stage theme={TAN.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.008, panY: 0, frames: 170, seed: 21 }} vignette={0.12} grain={0.5}>
        <Layer depth={0.15}>
          <FamSky name="tangerine" />
          <Bloom x={300} y={-80} r={760} color="#FFE08A" strength={0.7} />
        </Layer>
        <Layer depth={0.4}>
          <PaperGrid f={f} floor={ty} />
        </Layer>
        <Layer depth={1}>
          <GlowRings f={f} cx={1430} cy={(yS + yF) / 2} every={22} speed={24} maxR={560} color="#FFE08A" ry={0.36} width={7} />
          <rect x={1060} y={yF} width={640} height={yS - yF} fill={alpha("#FFE08A", 0.3 + 0.15 * Math.sin(f * 0.2))} />
          <DistGauge f={f} family={TAN} center={center} decade={decade} x={1500} speed={8} lit={["stiff", "fluid"]} lines={["stiff", "fluid"]} lineFrom={1060} band={["stiff", "fluid"]} />
          <Label x={1080} y={(yS + yF) / 2 + 10} text="THE REAL LIMIT" size={26} color={BROWN} />
          <Tick x={tx} y={ty} pxPerM={ppm} frame={f} facing={1} pose="hold" expression={f > 30 ? "determined" : "thinking"} look={0.4} headTilt={-6} squash={{ sx: 1, sy: squeeze > 0.95 ? 1 : 0.985 }} />
          <g transform={`translate(${hx + 40} ${hy - 30}) scale(${squeeze}) rotate(${(f * 8) % 360})`}>
            <RockChip x={0} y={0} size={110} />
          </g>
          {/* the strength meter in the chip */}
          <rect x={hx - 60} y={hy - 150} width={200} height={30} rx={15} fill="#3A1406" opacity={0.8} />
          <rect x={hx - 56} y={hy - 146} width={192 * fill} height={22} rx={11} fill={C.lemon} />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#FFE08A" seed={3} size={3} drift={22} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={90} y={110} text="ROCK HAS STRENGTH" size={28} fill={alpha(TAN.shadow, 0.8)} appear={lin(f, 4, 16)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-02 + 6-03 · one world, one camera: the chip close-up (zoom 9, authored at screen scale and shrunk ×1/9 around the chip)
// with two near-equal arrows pulsing across it and dust drifting off, then the pull-back (log zoom 9 → 1) until the whole
// 3,476-km ball is in frame and the chip is a speck; tiny Tick beside it, arms up.
// ===============================================================================================================
const CHIP: [number, number] = [520, 640];
const Z0 = 9;
const ChipWorld: React.FC<{ f: number; len: number; c: C06 }> = ({ f, c }) => {
  const b = c.s603 - c.s602;
  const u = ez(f, b, b + Math.min(170, 0.95 * (c.s604 - c.s602 - b)));
  const zoom = logLerp(Z0, 1, u);
  const cam = { x: CHIP[0] + (960 - CHIP[0]) * u, y: CHIP[1] + (540 - CHIP[1]) * u, zoom };
  const pulse = Math.sin(f * 0.28);
  return (
    <Stage theme={TAN.theme} cam={cam} vignette={0.12} grain={0.5}>
      <Layer depth={0.1}>
        <FamSky name="tangerine" />
      </Layer>
      <Layer depth={0.35}>
        <PaperGrid f={f} />
      </Layer>
      <Layer depth={1}>
        <TidalBall x={1180} y={560} r={380} f={f} spin={6} dir={180} />
        <Tick x={CHIP[0] + 70} y={CHIP[1] + 16} pxPerM={14} frame={f} facing={1} pose={u > 0.5 ? "cheer" : "stand"} expression="surprised" outline="#3A1406" />
        {/* the close-up, authored at screen scale around (960, 540) and shrunk around the chip */}
        <g transform={`translate(${CHIP[0]} ${CHIP[1]}) scale(${1 / Z0}) translate(-960 -540)`}>
          <DotFlow f={f} mode="line" from={[960, 540]} to={[160, 300]} n={40} speed={12} spread={90} colors={[C.moonGlow, C.starApricot]} size={8} />
          <RockChip x={960} y={540} size={300} rotate={f * 0.8} />
          <Arrow18 x0={1180} y0={380} x1={1180 - (430 + 26 * pulse)} y1={380} color={C.lever} width={22} />
          <Arrow18 x0={1180} y0={720} x1={1180 - (410 + 26 * pulse)} y1={720} color={C.amber} width={22} />
        </g>
      </Layer>
      <Layer depth={0}>
        {u < 0.2 ? <AgencyPill x={90} y={110} agency="NASA SAYS" appear={lin(f, 4, 16) * (1 - lin(f, b - 8, b))} size={26} /> : null}
        {f >= b ? (
          <g>
            <OurSumPill x={96} y={828} appear={lin(f, b + 10, b + 20)} />
            <Readout x={80} y={860} value={READ.moonDiam.value! /* #19 C */} k={lin(f, b + 14, b + 70)} unit="KM ACROSS" size={84} w={720} appear={lin(f, b + 10, b + 20)} who="6-03 diameter" />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};
const Shot602: ShotFC<C06> = ({ f, len, c }) => (
  <Pop f={f}>
    <ChipWorld f={f} len={len} c={c} />
  </Pop>
);

// ===============================================================================================================
// 6-04 → 6-07 · one set: the banded giant fills the right (bands 14 px/f), the comet slides in (20 px/f, then drifts), its
// nucleus stretches into a string (≈ 5 px/f), the beads spread, and beads pop in along it while the counter climbs past 20.
// ===============================================================================================================
const SL9: React.FC<{ x: number; y: number; ang: number; L: number; s: number; count: number; f: number; popAt?: number }> = ({ x, y, ang, L, s, count, f, popAt = -999 }) => {
  const a = (ang * Math.PI) / 180;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const N = 22;
  const order = Array.from({ length: N }, (_, i) => i).sort((p, q) => rnd(p * 7 + 3) - rnd(q * 7 + 3));
  const shown = new Set(order.slice(0, Math.max(1, Math.round(count))));
  return (
    <g>
      {s < 0.6 ? <ellipse cx={x} cy={y} rx={14 + (L * s) / 2} ry={14 * (1 - s)} transform={`rotate(${ang} ${x} ${y})`} fill={C.comet} opacity={0.5 * (1 - s / 0.6)} /> : null}
      {Array.from({ length: N }, (_, i) => {
        if (!shown.has(i)) return null;
        const t = i / (N - 1) - 0.5;
        const bx = x + ux * t * L * s + Math.sin(f * 0.2 + i) * 3 * s;
        const by = y + uy * t * L * s + Math.cos(f * 0.23 + i * 1.3) * 3 * s;
        const r = 6 + rnd(i * 3 + 1) * 6;
        const k = order.indexOf(i);
        const age = f - popAt - (k - 8) * 4;
        const sc = age >= 0 && age < 10 ? 1 + 0.8 * (1 - age / 10) : 1;
        const tx = bx - ux * (40 + r * 4);
        const ty = by - uy * (40 + r * 4) - 10;
        return (
          <g key={i}>
            <path d={`M${bx} ${by - r * 0.7} L${tx} ${ty} L${bx} ${by + r * 0.7} Z`} fill={C.starAqua} opacity={0.3} />
            <circle cx={bx} cy={by} r={r * 2.6 * sc} fill={C.starAqua} opacity={0.16} />
            <circle cx={bx} cy={by} r={r * sc} fill={i % 2 ? C.comet : "#FFE7A0"} />
          </g>
        );
      })}
    </g>
  );
};
const Shot604: ShotFC<C06> = ({ f, c }) => {
  const t5 = c.s605 - c.s604;
  const t6 = c.s606 - c.s604;
  const t7 = c.s607 - c.s604;
  const cx = f < 40 ? -200 + 20 * f : 600 + 1.4 * (f - 40);
  const cy = 560 - (cx + 200) * Math.tan((10 * Math.PI) / 180);
  const s = f < t5 ? 0 : f < t6 ? 0.5 * ez(f, t5, t6) : 0.5 + 0.5 * ez(f, t6, t7);
  const count = f < t7 ? 9 : 9 + 13 * ez(f, t7, t7 + 60);
  return (
    <Pop f={f}>
      <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.012, panY: 0, frames: 420, seed: 22 }} vignette={0.22} grain={0.5}>
        <Layer depth={0.1}>
          <NightSky />
        </Layer>
        <Layer depth={0.3}>
          <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={110} speed={12} angle={190} seed={4} />
        </Layer>
        <Layer depth={0.7}>
          <Bloom x={1780} y={700} r={760} color={C.giantBand3} strength={0.28} />
          <BandedGiant x={1780} y={700} r={560} f={f} speed={14} />
        </Layer>
        <Layer depth={1}>
          {s <= 0.02 ? <Comet x={cx} y={cy} angle={190} len={300} f={f} size={14} /> : <SL9 x={cx} y={cy} ang={-10} L={820} s={s} count={count} f={f} popAt={f < t7 ? -999 : t7} />}
        </Layer>
        <Layer depth={0}>
          {f < t5 + 6 ? (
            <g opacity={lin(f, 2, 12) * (1 - lin(f, t5, t5 + 6))}>
              <Kicker x={90} y={110} text="— WE HAVE WATCHED SOMETHING LIKE THIS ONCE" color={C.moonRim} size={26} />
            </g>
          ) : null}
          {f >= t5 && f < t6 ? (
            <g>
              <WordPill x={90} y={110} text="COMET SHOEMAKER-LEVY 9" size={26} appear={lin(f, t5, t5 + 10)} />
              <WordPill x={90} y={172} text={READ.sl9Year1.text /* #16 A */} size={26} appear={lin(f, t5 + 6, t5 + 16)} />
            </g>
          ) : null}
          {f >= t6 && f < t7 ? <AgencyPill x={90} y={110} agency="NASA SAYS" appear={lin(f, t6, t6 + 10)} size={26} /> : null}
          {f >= t7 ? (
            <g>
              <WordPill x={96} y={110} text={READ.sl9Year2.text /* #16 A */} size={26} appear={lin(f, t7, t7 + 10)} />
              <Readout x={80} y={150} value={READ.sl9Pieces.value! /* #16 A */} k={lin(f, t7 + 6, t7 + 60)} pre="MORE THAN" unit="PIECES" size={84} w={560} appear={lin(f, t7, t7 + 10)} who="6-07 pieces" />
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-08 · a comet speck beside a Moon disc that swells beside it (r 30 → 330); stars slide (12 px/f). FAR SMALLER (no numeral).
// ===============================================================================================================
const Shot608: ShotFC<C06> = ({ f, len }) => {
  const r = 30 + 300 * ez(f, 0, len * 0.9);
  return (
    <Pop f={f}>
      <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.04, panX: -0.006, panY: 0, frames: 110, seed: 23 }} vignette={0.22} grain={0.5}>
        <Layer depth={0.1}>
          <NightSky />
        </Layer>
        <Layer depth={0.3}>
          <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={110} speed={12} angle={180} seed={6} />
        </Layer>
        <Layer depth={1}>
          <Comet x={560} y={540} angle={200} len={110} f={f} size={6} />
          <MoonToken x={1180} y={540} r={r} f={f} spin={4} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={560} y={640} text="FAR SMALLER" size={26} align="middle" appear={lin(f, 10, 22)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-09 + 6-10 · a check draws (40 px/f) while the bead string slides past behind it (18 px/f); then a ghost Moon (its colour
// drained, dashes marching 18 px/f) under a bobbing vermilion "?".
// ===============================================================================================================
const Real: React.FC<{ f: number; len: number; c: C06 }> = ({ f }) => (
  <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0, panY: 0, frames: 90, seed: 24 }} vignette={0.22} grain={0.5}>
    <Layer depth={0.1}>
      <NightSky />
    </Layer>
    <Layer depth={0.3}>
      <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={100} speed={12} angle={180} seed={7} />
    </Layer>
    <Layer depth={0.8}>
      <SL9 x={1500 - f * 18} y={760} ang={-6} L={900} s={1} count={22} f={f} />
    </Layer>
    <Layer depth={1}>
      <Bloom x={960} y={450} r={360} color={C.lemon} strength={0.25} />
      <CheckMark x={960} y={460} k={lin(f, 2, 22)} s={1.5} color={C.lemon} />
    </Layer>
    <Layer depth={0}>
      <WordPill x={960} y={200} text="THE EFFECT IS REAL" size={30} align="middle" appear={lin(f, 4, 14)} />
    </Layer>
  </Stage>
);
const Ghost: React.FC<{ f: number; len: number; c: C06 }> = ({ f }) => (
  <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0, panY: -0.004, frames: 100, seed: 25 }} vignette={0.22} grain={0.5}>
    <Layer depth={0.1}>
      <NightSky />
    </Layer>
    <Layer depth={0.3}>
      <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={100} speed={12} angle={160} seed={8} />
    </Layer>
    <Layer depth={1}>
      <MoonFace f={f} x={960} y={600} radius={300} scroll={10} ghost={0.85} />
      <QuestionTag x={960} y={230} f={f} size={96} />
    </Layer>
    <Layer depth={0}>
      <WordPill x={960} y={1000} text="WHAT A MOON WOULD DO" size={28} align="middle" appear={lin(f, 4, 14)} />
    </Layer>
  </Stage>
);
const Shot609 = runOf<C06>((c) => [
  { at: c.s609, S: Real },
  { at: c.s610, S: Ghost, dir: "up" },
]);

// ===============================================================================================================
// 6-11 · the ringed planet on the survey paper (ring particles ≈ 11 px/f); two idea cards drop in on cords (30 px/f) and sway.
// ===============================================================================================================
const Card: React.FC<{ x: number; f: number; at: number; title: string; idea: 1 | 2 }> = ({ x, f, at, title, idea }) => {
  const d = ez(f, at, at + 22);
  const y = -420 + (240 + 420) * d;
  const sway = Math.sin((f - at) * 0.16) * 3 * (1 - 0.4 * lin(f, at, at + 60)) + (d < 1 ? (1 - d) * 6 : 0);
  return (
    <g>
      <line x1={x + 150} y1={-40} x2={x + 150} y2={y + 6} stroke={C.amber} strokeWidth={4} />
      <Sheet18 x={x} y={y} w={300} h={340} f={f} title={title} band="sky" sway={0} tilt={sway}>
        <circle cx={150} cy={140} r={100} fill="none" stroke={C.lever} strokeWidth={4} strokeDasharray="12 8" strokeDashoffset={-f * 2} />
        {idea === 1 ? (
          <g>
            <MoonToken x={150 + 70 * Math.cos(f * 0.05)} y={140 + 70 * Math.sin(f * 0.05)} r={24} f={f} />
            {Array.from({ length: 8 }, (_, i) => {
              const a = f * 0.05 - 0.2 - i * 0.12;
              return <circle key={i} cx={150 + 72 * Math.cos(a)} cy={140 + 72 * Math.sin(a)} r={5} fill={C.moonMid} />;
            })}
          </g>
        ) : (
          Array.from({ length: 26 }, (_, i) => {
            const a = rnd(i * 3) * Math.PI * 2 + f * (0.03 + rnd(i) * 0.03);
            const rr = 20 + rnd(i * 7) * 70;
            return <circle key={i} cx={150 + rr * Math.cos(a)} cy={140 + rr * Math.sin(a)} r={4 + rnd(i * 5) * 3} fill={i % 2 ? C.moonMid : C.moonShade} />;
          })
        )}
      </Sheet18>
    </g>
  );
};
const Shot611: ShotFC<C06> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={TAN.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.008, panY: 0, frames: 100, seed: 26 }} vignette={0.12} grain={0.5}>
      <Layer depth={0.15}>
        <FamSky name="tangerine" />
        <Bloom x={700} y={560} r={600} color="#FFE08A" strength={0.4} />
      </Layer>
      <Layer depth={0.4}>
        <PaperGrid f={f} />
      </Layer>
      <Layer depth={1}>
        <RingedPlanet x={640} y={580} r={200} f={f} n={110} speed={2.4} />
        <Card x={1130} f={f} at={6} title="IDEA 1" idea={1} />
        <Card x={1500} f={f} at={16} title="IDEA 2" idea={2} />
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={12} w={1920} h={1080} color="#FFE08A" seed={8} size={3} drift={22} />
      </Layer>
      <Layer depth={0}>
        <AgencyPill x={90} y={110} agency="NASA SAYS" appear={lin(f, 2, 12)} size={26} />
        <WordPill x={90} y={172} text="TWO IDEAS" size={26} fill={alpha(TAN.shadow, 0.8)} appear={lin(f, 8, 18)} />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 6-12 + 6-13 · top-down: a moon spirals in across the dashed limit (≈ 13 px/f) and peels into dots that smear round into a
// ring; then (IDEA 2) a cloud of dots inside the limit swirls, small clumps form and are pulled flat again.
// ===============================================================================================================
const PX = 900;
const PY = 560;
const Idea1: React.FC<{ f: number; len: number; c: C06 }> = ({ f, len }) => {
  const cross = Math.round(len * 0.45);
  const w = 1.4;
  const th = -60 + f * w;
  const rr = f < cross ? 620 - 290 * (f / cross) : 330 - 40 * ez(f, cross, len);
  const mx = PX + Math.cos((th * Math.PI) / 180) * rr;
  const my = PY + Math.sin((th * Math.PI) / 180) * rr;
  const peel = lin(f, cross, len + 30);
  return (
    <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0, panY: 0, frames: 120, seed: 27 }} vignette={0.22} grain={0.5}>
      <Layer depth={0.1}>
        <NightSky />
      </Layer>
      <Layer depth={0.3}>
        <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={100} speed={8} angle={200} seed={9} />
      </Layer>
      <Layer depth={1}>
        <circle cx={PX} cy={PY} r={330} fill={alpha(C.lever, 0.07)} stroke={C.lever} strokeWidth={5} strokeDasharray="20 14" strokeDashoffset={-f * 3} />
        <BandedGiant x={PX} y={PY} r={120} f={f} speed={8} />
        {f >= cross ? <DebrisRing cx={PX} cy={PY} f={f} radius={300} n={140} speed={w} spread={0.05 + 0.75 * peel} tilt={1} thickness={22} start={-60} part="all" /> : null}
        <MoonToken x={mx} y={my} r={46 * (1 - 0.85 * peel)} f={f} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={90} y={110} text="IDEA 1" size={28} appear={lin(f, 2, 12)} />
      </Layer>
    </Stage>
  );
};
const Idea2: React.FC<{ f: number; len: number; c: C06 }> = ({ f }) => (
  <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0, panY: 0, frames: 170, seed: 28 }} vignette={0.22} grain={0.5}>
    <Layer depth={0.1}>
      <NightSky />
    </Layer>
    <Layer depth={0.3}>
      <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={100} speed={8} angle={200} seed={10} />
    </Layer>
    <Layer depth={1}>
      <circle cx={PX} cy={PY} r={330} fill={alpha(C.lever, 0.07)} stroke={C.lever} strokeWidth={5} strokeDasharray="20 14" strokeDashoffset={-f * 3} />
      <DebrisRing cx={PX} cy={PY} f={f} radius={240} n={160} speed={1.8} spread={1} clump={0.5 + 0.5 * Math.sin(f * 0.09)} tilt={1} thickness={70} start={30} part="all" colors={[C.moonGlow, C.moonLit, C.moonMid, C.starApricot]} />
      <BandedGiant x={PX} y={PY} r={120} f={f} speed={8} />
    </Layer>
    <Layer depth={0}>
      <WordPill x={90} y={110} text="IDEA 2" size={28} appear={lin(f, 2, 12)} />
    </Layer>
  </Stage>
);
const Shot612 = runOf<C06>((c) => [
  { at: c.s612, S: Idea1 },
  { at: c.s613, S: Idea2, dir: "up", blend: 16 },
]);

// ===============================================================================================================
// 6-14 · below the dashed line a block splits, and splits again (2 → 4 → 8 pieces, drifting apart ≈ 16 px/f combined), dots fly.
// ===============================================================================================================
const Shot614: ShotFC<C06> = ({ f }) => {
  const T = [8, 34, 60];
  const g = T.filter((t) => f >= t).length;
  const n = 1 << g;
  const W0 = 460;
  const H0 = 300;
  const pieces = Array.from({ length: n }, (_, i) => {
    let ox = 0;
    let oy = 0;
    let w = W0;
    let h = H0;
    for (let l = 0; l < g; l++) {
      const bit = (i >> l) & 1 ? 1 : -1;
      const d = 14 + (f - T[l]) * (l === 0 ? 3.2 : 2.4);
      if (l % 2 === 0) {
        ox += bit * d;
        w /= 2;
      } else {
        oy += bit * d * 0.8;
        h /= 2;
      }
    }
    return { x: 960 + ox * 1.6, y: 660 + oy * 1.6, w: w - 6, h: h - 6, rot: (rnd(i * 5) - 0.5) * 2 * g * 0.06 * f };
  });
  return (
    <Pop f={f}>
      <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0, panY: 0, frames: 110, seed: 29 }} vignette={0.22} grain={0.5}>
        <Layer depth={0.1}>
          <NightSky />
        </Layer>
        <Layer depth={0.3}>
          <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={90} speed={12} angle={180} seed={11} />
        </Layer>
        <Layer depth={1}>
          <line x1={-200} y1={330} x2={2120} y2={330} stroke={C.lever} strokeWidth={6} strokeDasharray="26 16" strokeDashoffset={-f * 4} />
          <Label x={120} y={300} text="INSIDE THE LINE" size={26} color={C.lever} />
          {g > 0
            ? [0, 60, 120, 180, 240, 300].map((a) => (
                <DotFlow key={a} f={f} mode="line" from={[960, 660]} to={[960 + Math.cos((a * Math.PI) / 180) * 620, 660 + Math.sin((a * Math.PI) / 180) * 360]} n={10} speed={14} spread={14} colors={[C.moonGlow, C.moonMid]} size={5} seed={a + 3} />
              ))
            : null}
          {pieces.map((p, i) => (
            <RockBlock key={i} x={p.x} y={p.y} w={p.w} h={p.h} rot={p.rot} seed={i + 2} />
          ))}
        </Layer>
        <Layer depth={0}>
          <WordPill x={90} y={110} text="BIG PIECES DO NOT STAY TOGETHER" size={26} appear={lin(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-15 · the MODEL placard swings in (drop, a spin, then a 6 deg/f pendulum); at the station's height above the Earth limb the
// ball cracks along a drawn line (≈ 10 px/f head) and its halves start to part.
// ===============================================================================================================
const Shot615: ShotFC<C06> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0, panY: 0.004, frames: 110, seed: 30 }} vignette={0.22} grain={0.5}>
      <Layer depth={0.1}>
        <NightSky />
      </Layer>
      <Layer depth={0.3}>
        <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1300} n={90} speed={12} angle={180} seed={12} />
      </Layer>
      <Layer depth={0.8}>
        <EarthLimb f={f} y={880} R={2600} cx={960} cloudSpeed={12} dark={0.2} />
      </Layer>
      <Layer depth={1}>
        <TidalBall x={820} y={560} r={250} f={f} stretch={0.35} dir={90} spin={6} crack={lin(f, 8, 60)} separate={f > 62 ? (f - 62) * 0.9 : 0} />
        <FlipTag x={1480} y={40} word="MODEL" f={f} swing={18} drop={ez(f, 0, 14)} flip={flipFor(f, 14, 15)} prev="MODEL" size={1.25} cord={130} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={90} y={110} text="THE MODEL'S ANSWER" size={26} appear={lin(f, 4, 14)} />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 6-16 (KEY ART 3) · the Moon is gone: its pieces spread into a thin band at the station's height around the Earth (dots
// 2.4 deg/f ≈ 17 px/f at the ring, the inner ones lap faster so it keeps spreading); the camera pulls back the whole shot.
// Gold on black-teal, tinted stars, the MODEL placard. Q5: no ring size, no lifetime. Holds 1.0 s.
// ===============================================================================================================
const Shot616: ShotFC<C06> = ({ f, len }) => {
  const zoom = logLerp(1.28, 1.0, lin(f, 0, len));
  const sp = 0.22 + 0.78 * ez(f, 0, 80);
  const R = 300;
  const ring = R * (8516 / 6378); // #8: the ring at the Moon's centre distance, Earth radius 300 px
  return (
    <Pop f={f}>
      <Stage theme={ABY.theme} cam={{ x: 960, y: 560, zoom }} vignette={0.24} grain={0.5}>
        <Layer depth={0.1}>
          <NightSky />
        </Layer>
        <Layer depth={0.3}>
          <StarsTint18 f={f} x={-500} y={-400} w={2920} h={1880} n={140} speed={12} angle={185} seed={13} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={960} y={600} r={620} color={C.moonRim} strength={0.18} />
          <DebrisRing cx={960} cy={600} f={f} radius={ring} n={160} speed={2.4} spread={sp} tilt={0.26} thickness={12} start={200} part="back" />
          <EarthDisc x={960} y={600} r={R} f={f} spin={5} />
          <DebrisRing cx={960} cy={600} f={f} radius={ring} n={160} speed={2.4} spread={sp} tilt={0.26} thickness={12} start={200} part="front" />
          <FlipTag x={1600} y={40} word="MODEL" f={f + 30} swing={14} size={0.95} cord={110} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL06: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL06(t);
  const shots: ShotDef<C06>[] = [
    { from: 0, S: Shot601, id: "6-01" },
    { from: c.s602, S: Shot602, id: "6-02" }, // + 6-03 (PUSH: the pull-back)
    { from: c.s604, S: Shot604, id: "6-04" }, // + 6-05, 6-06 (SLIDE), 6-07
    { from: c.s608, S: Shot608, id: "6-08" },
    { from: c.s609, S: Shot609, id: "6-09" }, // + 6-10 (SLIDE)
    { from: c.s611, S: Shot611, id: "6-11" },
    { from: c.s612, S: Shot612, id: "6-12" }, // + 6-13 (PUSH)
    { from: c.s614, S: Shot614, id: "6-14" },
    { from: c.s615, S: Shot615, id: "6-15" },
    { from: c.s616, S: Shot616, id: "6-16" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL06 = (t: SceneTiming): Cue[] => {
  const c = cuesL06(t);
  const run = (at: number, n: number, gap = 5, vol = 0.05): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    ...cutHit(0),
    { at: 4, file: SFX.pop, vol: 0.16, dur: 20 },
    ...cutHit(c.s602),
    { at: c.s602 + 4, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.s603 + 4, file: SFX.whoosh, vol: 0.18, dur: 60 },
    ...cutHit(c.s604),
    { at: c.s604 + 2, file: SFX.riser, vol: 0.14, dur: 80, fadeOut: 20 },
    { at: c.s605 + 2, file: SFX.swirl, vol: 0.14, dur: 60 },
    { at: c.s606 + 2, file: SFX.debris, vol: 0.12, dur: 90, fadeOut: 30 },
    ...run(c.s607 + 6, 12, 5),
    ...cutHit(c.s608),
    { at: c.s608 + 2, file: SFX.whoosh, vol: 0.14, dur: 50 },
    ...cutHit(c.s609),
    { at: c.s609 + 10, file: SFX.click, vol: 0.14, dur: 8 },
    { at: c.s610 + 4, file: SFX.pop, vol: 0.14, dur: 20 },
    ...cutHit(c.s611),
    { at: c.s611 + 10, file: SFX.pop, vol: 0.14, dur: 20 },
    ...cutHit(c.s612),
    { at: c.s612 + 50, file: SFX.debris, vol: 0.12, dur: 90, fadeOut: 30 },
    { at: c.s613 + 6, file: SFX.pop, vol: 0.12, dur: 20 },
    ...cutHit(c.s614),
    { at: c.s614 + 8, file: SFX.debris, vol: 0.14, dur: 100, fadeOut: 30 },
    ...cutHit(c.s615),
    { at: c.s615 + 12, file: SFX.boom, vol: 0.22, dur: 100, fadeOut: 30 },
    ...cutHit(c.s616),
    { at: c.s616 + 6, file: SFX.chime, vol: 0.16, dur: 120, fadeOut: 40 },
  ];
};
