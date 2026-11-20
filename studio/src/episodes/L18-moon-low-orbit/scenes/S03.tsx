// L18 scene "l03" · rung one: the satellite height (storyboard §3 scene 3: 3-01…3-14, script lines 11-16; `gauge` rail
// ↔ `abyss` top-down hover and the ball). The 3-02..3-04 top-down is to scale: Earth r 64 px, the geostationary ring
// 422 px (42,164 / 6,378 = 6.61).
// Shot components (hard cuts only; PUSH/SLIDE rows are phases of one component):
//   3-01 (+3-02, 3-03, 3-03b) the rail zooming (decade 300 → 900) while the token drops onto GEOSTATIONARY and bounces,
//                     RUNG ONE; push to the top-down: the measuring line rides the satellite round (5 deg/f = 37 px/f),
//                     42,164 KM FROM THE CENTER; slide to the dark: the 24-hour clock, the Earth turning with it, the pin
//                     and the dashed line that never changes angle (HOVERS OVER ONE SPOT)
//   3-04              the Moon token takes the satellite's place, in lockstep with the pin (SAME)
//   3-05              NOAA SAYS: the distance bar shortens (8.6 px/f) as small cubes drop into the big cube (stagger 4 f)
//   3-06 (+3-07, 3-08) Tick rides the token down to the mark (ticks streaming 25 px/f), DISTANCE ÷ 9; the PULL bar grows
//                     out of the frame with the camera tilting after it (20 px/f), ×760; push to the dark: the token
//                     shrinks to a point, Tick pokes it, it inflates into the ball (+10 px/f), TREATED AS A POINT
//   3-09 (+3-10, 3-11) the ball turning (14 px/f), the diameter bracket and its caliper bead, 3,476 KM ACROSS; slide to
//                     the ball over the limb: near half gold, far half teal, arrows pulsing (16 px/f), NEAR / FAR; the
//                     near arrow lengthens and the ball draws into an egg (OUR SUM)
//   3-12              the rail rush up to today's token (21 px/f), the two arrows nearly equal, LESS THAN 2 %
//   3-13              back on the mark: the arrows differ a little more, the gap bar widening; IT GROWS (line 15 reworded)
//   3-14              the token slides on down (26 px/f; no mark labels yet), the near arrow keeps growing under the
//                     magnifier; THAT SMALL DIFFERENCE
// Numbers drawn (data18 READ): geoKm 42,164 (#13 A) · earth24 (#13 A) · div9 (#10 C, OUR SUM) · pull760 760 (#10 C,
// OUR SUM) · moonDiam 3,476 (#19 C, OUR SUM) · todayPct 2 (#22 C, OUR SUM). Arrow ratios: today 1.02 (#22), the rung
// 1.18 (our sum, no numeral: Q4), drawn as lengths only.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Kicker, Layer, Stage, Tick, alpha } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { DistGauge, MARKS, MoonToken, StopBadge } from "../gauge";
import { DayClock } from "../orbit";
import { EarthDisc, EarthLimb, WeatherSat, limbY } from "../planets18";
import { PullArrows, PullBar, TidalBall } from "../tidal";
import { AgencyPill, OurSumPill, WordPill } from "../tags18";
import { Magnifier } from "../icons18";
import { READ } from "../data18";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { ABYSS, AbyssField, C, ClipCircle, DimLine, FatArrow, GAUGE, GaugeRoom, HalfTint, IsoCube, MetricA, Phase, Pop, Readout, TagPlate, centerFor, ez, lin, logLerp, wrap } from "./a-parts";

export const cuesL03 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    s01: 0,
    s02: p(0, "It is about forty-two thousand"), // phase (push)
    s03: at(1), // phase (slide)
    s03b: p(1, "the same as the turning Earth"), // phase (same set)
    s04: p(1, "Put the Moon there"),
    s05: at(2),
    s06: p(2, "Cut the distance by a factor of nine"),
    s07: p(2, "and the pull is about seven hundred"), // phase (push)
    s08: at(3), // phase (push)
    s09: p(3, "It is a ball"),
    s10: p(3, "The side facing Earth is closer"), // phase (slide)
    s11: at(4), // phase (same set)
    s12: p(4, "At today's distance"),
    s13: p(4, "At this rung it grows"),
    s14: at(5),
    end: t.frames,
  };
};
export type CL03 = ReturnType<typeof cuesL03>;

const EX = 640;
const EY = 560;
const ER = 64; // Earth radius, px (6,378 km)
const GR = 422; // geostationary ring, px (42,164 km: to scale, #13)

// the top-down Earth turning prograde (screen angles decrease) with a surface pin
const TopEarth: React.FC<{ f: number; angle: number; pin?: number }> = ({ f, angle, pin = 0 }) => {
  const a = (angle * Math.PI) / 180;
  return (
    <g>
      <g transform={`rotate(${angle.toFixed(2)} ${EX} ${EY})`}>
        <EarthDisc x={EX} y={EY} r={ER} f={0} spin={0} />
        <ClipCircle cx={EX} cy={EY} r={ER}>
          {Array.from({ length: 5 }, (_, i) => (
            <ellipse key={i} cx={EX + Math.cos(i * 1.3) * ER * 0.5} cy={EY + Math.sin(i * 2.1) * ER * 0.5} rx={ER * 0.3} ry={ER * 0.1} fill="#FFFFFF" opacity={0.6} transform={`rotate(${i * 50} ${EX} ${EY})`} />
          ))}
        </ClipCircle>
      </g>
      {pin > 0 ? (
        <g opacity={pin}>
          <line x1={EX + Math.cos(a) * ER * 0.8} y1={EY + Math.sin(a) * ER * 0.8} x2={EX + Math.cos(a) * (ER + 22)} y2={EY + Math.sin(a) * (ER + 22)} stroke={C.lever} strokeWidth={7} strokeLinecap="round" />
          <circle cx={EX + Math.cos(a) * (ER + 28)} cy={EY + Math.sin(a) * (ER + 28)} r={12} fill={C.lever} stroke="#2A0E04" strokeWidth={3} />
        </g>
      ) : null}
      <circle cx={EX} cy={EY} r={ER + 1} fill="none" stroke={C.cloud} strokeWidth={2} opacity={0.6 + 0.0 * f} />
    </g>
  );
};

// ================================================================================================================
// 3-01 + 3-02 + 3-03 + 3-03b · the rung: the rail zooms about the GEOSTATIONARY mark while the token drops onto it and
// bounces; push to the top-down to scale: the measuring line rides the satellite round; slide to the dark: the
// 24-hour clock fills, the Earth turns with the satellite, the pin's dashed line never changes angle
// ================================================================================================================
const ShotRung: ShotFC<CL03> = ({ f, c }) => {
  const T2 = c.s02;
  const T3 = c.s03;
  const T3b = c.s03b;
  const dec = 300 + 6.5 * f;
  const MY = 640;
  const RX = 1560;
  const center = centerFor(MARKS.geo.km, MY, dec);
  const t = f - 6;
  const bounce = t < 0 ? -460 : -440 * Math.exp(-t / 16) * Math.abs(Math.cos(t * 0.17));
  const A = (
    <Stage theme={GAUGE.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 120, seed: 1 }} vignette={0.2} grain={0.5}>
      <GaugeRoom f={f} floor={1010} seed={5} />
      <Layer depth={1}>
        <DistGauge f={f} family={GAUGE} center={center} decade={dec} x={RX} speed={22} bottom={MY + 150} lit={["geo"]} />
        <Bloom x={RX} y={MY + bounce} r={150} color={C.moonRim} strength={0.5} />
        <MoonToken x={RX} y={MY - 6 + bounce} r={38} f={f} />
        <Tick x={1330} y={1012} pxPerM={190} frame={f} pose="point" expression={f < 40 ? "surprised" : "happy"} look={0.3} />
      </Layer>
      <Layer depth={0}>{f < 75 ? <StopBadge f={f} rung={1} family={GAUGE} /> : null}</Layer>
    </Stage>
  );
  // the top-down (shared by 3-02, 3-03, 3-03b): satellite 5 deg/f on the ring
  const satA = (k: number) => -30 - k * 5;
  const g = Math.max(0, f - T2);
  const lineK = lin(g, 4, 16);
  const sa = (satA(f) * Math.PI) / 180;
  const sx = EX + Math.cos(sa) * GR;
  const sy = EY + Math.sin(sa) * GR;
  const B = (
    <Stage theme={GAUGE.theme} shotFrame={g} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 160, seed: 2 }} vignette={0.2} grain={0.5}>
      <GaugeRoom f={g} floor={1200} seed={6} />
      <Layer depth={1}>
        <circle cx={EX} cy={EY} r={GR} fill="none" stroke={C.moonRim} strokeWidth={4} strokeDasharray="16 12" strokeDashoffset={-g * 3} opacity={0.8} />
        <line x1={EX} y1={EY} x2={EX + (sx - EX) * lineK} y2={EY + (sy - EY) * lineK} stroke={C.lever} strokeWidth={8} strokeLinecap="round" />
        {lineK > 0 && lineK < 1 ? <circle cx={EX + (sx - EX) * lineK} cy={EY + (sy - EY) * lineK} r={14} fill="#FFE7A0" /> : null}
        <TopEarth f={g} angle={-90} />
        <circle cx={EX} cy={EY} r={9} fill={C.lever} />
        <WeatherSat x={sx} y={sy} size={64} f={g} />
      </Layer>
      <Layer depth={0}>
        <Readout x={1060} y={300} k={lin(g, 6, 70)} rkey="geoKm" unit="KM FROM THE CENTER" size={84} />
      </Layer>
    </Stage>
  );
  const h = Math.max(0, f - T3);
  const hb = Math.max(0, f - T3b);
  const eA = satA(f); // the Earth turns with the satellite (same rate)
  const pinA = satA(f);
  const pa = (pinA * Math.PI) / 180;
  const Cc = (
    <Stage theme={ABYSS.theme} shotFrame={h} drift={{ zoom: 1.04, panX: -0.01, panY: 0, frames: 200, seed: 3 }} vignette={0.3} grain={0.5}>
      <AbyssField f={h} speed={5} angle={200} n={120} seed={21} lift={1} />
      <Layer depth={1}>
        <circle cx={EX} cy={EY} r={GR} fill="none" stroke={alpha(C.moonRim, 0.6)} strokeWidth={3} />
        <path d={`M${EX + Math.cos(pa + 0.9) * GR} ${EY + Math.sin(pa + 0.9) * GR} A${GR} ${GR} 0 0 0 ${sx} ${sy}`} fill="none" stroke={C.model} strokeWidth={9} strokeLinecap="round" opacity={0.6} />
        {hb > 0 ? <line x1={EX + Math.cos(pa) * (ER + 28)} y1={EY + Math.sin(pa) * (ER + 28)} x2={sx} y2={sy} stroke={C.moonRim} strokeWidth={4} strokeDasharray="14 10" strokeDashoffset={-h * 4} opacity={lin(hb, 0, 10)} /> : null}
        <TopEarth f={h} angle={eA} pin={lin(hb, 0, 10)} />
        <WeatherSat x={sx} y={sy} size={64} f={h} />
        <DayClock x={1450} y={560} r={170} f={h} progress={(h * 5) / 360 + 0.05} family={ABYSS} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={1270} y={830} text={READ.earth24.text} size={32} appear={lin(h, 4, 14)} />
        {hb > 0 ? <TagPlate x={1240} y={180} text="HOVERS OVER ONE SPOT" size={30} appear={lin(hb, 6, 16)} /> : null}
      </Layer>
    </Stage>
  );
  if (f >= T3 - 8) return <Phase f={f} at={T3 - 8} dur={14} kind="slide" a={B} b={Cc} />;
  return <Phase f={f} at={T2 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 3-04 · the Moon token takes the satellite's place and rides the ring in lockstep with the pin (5 deg/f): SAME
// ================================================================================================================
const ShotSame: ShotFC<CL03> = ({ f, c }) => {
  const ff = f + c.s04; // continue the 3-01..3-03b angles (that shot starts at scene frame 0)
  const satA = -30 - ff * 5;
  const pa = (satA * Math.PI) / 180;
  const sx = EX + Math.cos(pa) * GR;
  const sy = EY + Math.sin(pa) * GR;
  const swap = ez(f, 2, 14);
  return (
    <Pop f={f}>
      <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0, frames: 120, seed: 4 }} vignette={0.3} grain={0.5}>
        <AbyssField f={f} speed={5} angle={200} n={120} seed={22} lift={1} />
        <Layer depth={1}>
          <circle cx={EX} cy={EY} r={GR} fill="none" stroke={alpha(C.moonRim, 0.6)} strokeWidth={3} />
          <path d={`M${EX + Math.cos(pa + 0.9) * GR} ${EY + Math.sin(pa + 0.9) * GR} A${GR} ${GR} 0 0 0 ${sx} ${sy}`} fill="none" stroke={C.moonRim} strokeWidth={12} strokeLinecap="round" opacity={0.55} />
          <line x1={EX + Math.cos(pa) * (ER + 28)} y1={EY + Math.sin(pa) * (ER + 28)} x2={sx} y2={sy} stroke={C.moonRim} strokeWidth={4} strokeDasharray="14 10" strokeDashoffset={-f * 4} />
          <TopEarth f={f} angle={satA} pin={1} />
          {swap < 1 ? (
            <g opacity={1 - swap}>
              <WeatherSat x={sx} y={sy} size={64 * (1 - swap * 0.6)} f={f} />
            </g>
          ) : null}
          <Bloom x={sx} y={sy} r={140 * swap} color={C.moonRim} strength={0.55} />
          <MoonToken x={sx} y={sy} r={44 * swap} f={f} />
          <DayClock x={1450} y={560} r={170} f={f} progress={(ff * 5) / 360 + 0.05} family={ABYSS} />
        </Layer>
        <Layer depth={0}>
          <TagPlate x={1240} y={180} text="SAME" size={40} appear={lin(f, 18, 28)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-05 · NOAA SAYS: the distance bar shortens to a third (8.6 px/f) while small cubes drop into the big cube (27 at
// stagger 4 f, each falling 30 px/f): the pull grows with the cube of the cut. No numerals (class A words).
// ================================================================================================================
const ShotCube: ShotFC<CL03> = ({ f }) => {
  const L = 900 - 600 * lin(f, 8, 78);
  const s = 84;
  const X0 = 1340;
  const Y0 = 560;
  const cubes: { a: number; b: number; c: number }[] = [];
  for (let cc = 0; cc < 3; cc++) for (let bb = 2; bb >= 0; bb--) for (let aa = 2; aa >= 0; aa--) cubes.push({ a: aa, b: bb, c: cc });
  // draw order back → front: lower layers first, then larger a+b in front
  const order = cubes.map((q, i) => ({ ...q, i })).sort((p, q) => p.c - q.c || p.a + p.b - (q.a + q.b));
  const shown = order.filter((q) => f >= 16 + q.i * 4);
  return (
    <Pop f={f}>
      <Stage theme={GAUGE.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0, frames: 150, seed: 5 }} vignette={0.2} grain={0.5}>
        <GaugeRoom f={f} floor={960} seed={7} />
        <Layer depth={1}>
          {/* the distance bar */}
          <rect x={150} y={600} width={900} height={60} rx={30} fill="rgba(1,18,27,0.5)" stroke={C.amber} strokeWidth={3} strokeDasharray="12 10" />
          <rect x={150} y={600} width={L} height={60} rx={30} fill={C.amber} />
          {Array.from({ length: 24 }, (_, i) => {
            const x = 150 + wrap(i * 40 + f * 6, 960) - 40;
            return x > 160 && x < 150 + L - 20 ? <line key={i} x1={x} y1={656} x2={x + 22} y2={604} stroke="#FFE08A" strokeWidth={8} opacity={0.55} /> : null;
          })}
          <circle cx={150} cy={630} r={40} fill={C.earthLimb} stroke={C.cloud} strokeWidth={4} />
          <MoonToken x={150 + L + 30} y={630} r={34} f={f} />
          <text x={150} y={730} style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 30, letterSpacing: 3, fill: "#FFEFC8" }}>
            DISTANCE
          </text>
          {/* the big cube's wireframe and the small cubes dropping in */}
          {(() => {
            const P = (a: number, b: number, cc: number): [number, number] => [X0 + (a - b) * s * 0.866, Y0 + (a + b) * s * 0.5 - cc * s];
            const corners = [P(-0.5, -0.5, 0), P(2.5, -0.5, 0), P(2.5, 2.5, 0), P(-0.5, 2.5, 0)];
            const top = corners.map(([x, y]) => [x, y - 3 * s]);
            return (
              <g>
                <path d={`M${corners.map((p) => p.join(" ")).join(" L")} Z`} fill={alpha(C.amber, 0.12)} stroke={C.moonRim} strokeWidth={3} strokeDasharray="10 8" />
                <path d={`M${top.map((p) => p.join(" ")).join(" L")} Z`} fill="none" stroke={C.moonRim} strokeWidth={3} strokeDasharray="10 8" />
                {[0, 1, 2, 3].map((k) => (
                  <line key={k} x1={corners[k][0]} y1={corners[k][1]} x2={top[k][0]} y2={top[k][1]} stroke={C.moonRim} strokeWidth={3} strokeDasharray="10 8" />
                ))}
              </g>
            );
          })()}
          {shown.map((q) => {
            const t0 = 16 + q.i * 4;
            const fall = Math.max(0, 240 - (f - t0) * 30);
            const [x, y] = [X0 + (q.a - q.b) * s * 0.866, Y0 + (q.a + q.b) * s * 0.5 - q.c * s - s * 0.5];
            return <IsoCube key={q.i} x={x} y={y - fall} s={s * 0.5} color={q.c === 2 ? C.lever : C.amber} />;
          })}
          <text x={X0} y={Y0 + 4 * s + 40} textAnchor="middle" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 30, letterSpacing: 3, fill: "#FFEFC8" }}>
            PULL
          </text>
        </Layer>
        <Layer depth={0}>
          <AgencyPill x={110} y={140} agency="NOAA SAYS" size={30} appear={lin(f, 4, 14)} />
          <WordPill x={110} y={220} text="CUBE OF THE DISTANCE" size={30} appear={lin(f, 10, 20)} F={GAUGE} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-06 + 3-07 + 3-08 · Tick rides the token from today down to the mark (decade 2200 px: ticks stream up 25 px/f),
// DISTANCE ÷ 9; push to the PULL bar growing at constant speed (20 px/f) with the camera tilting after its top, ×760;
// push to the dark: the token shrinks to a point, Tick pokes it with his staff, it inflates into the warm ball
// ================================================================================================================
const ShotNine: ShotFC<CL03> = ({ f, c }) => {
  const T7 = c.s07 - c.s06;
  const T8 = c.s08 - c.s06;
  const dec = 2200;
  const km = logLerp(384400, MARKS.geo.km, lin(f, 0, T7 - 4));
  const A = (
    <Stage theme={GAUGE.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 120, seed: 6 }} vignette={0.2} grain={0.5}>
      <GaugeRoom f={f} floor={1200} seed={8} />
      <Layer depth={1}>
        <FatArrow x0={1100} y0={180} x1={1100} y1={900} width={70} f={f} color={C.lever} crawl={24} />
        <DistGauge f={f} family={GAUGE} center={km} decade={dec} x={1360} speed={-25} token={km} tokenR={70} lit={f > T7 - 8 ? ["geo"] : []} />
        <Tick x={1360} y={472} pxPerM={88} frame={f} pose="crouch" expression="surprised" look={0.3} />
      </Layer>
      <Layer depth={0}>
        <MetricA x={110} y={330} value={READ.div9.text} size={104} reveal={lin(f, 4, 20)} />
        <OurSumPill x={120} y={410} size={30} appear={lin(f, 16, 26)} />
      </Layer>
    </Stage>
  );
  // the PULL bar at constant speed: k = u (PullBar eases with 1-(1-t)^3, so pass t = 1-(1-u)^(1/3))
  const g = Math.max(0, f - T7);
  const len7 = T8 - T7;
  const u = lin(g, 4, len7 + 10);
  const H = 3400;
  const base = 1000;
  const topW = base - H * u;
  const dy = Math.max(0, 300 - topW);
  const B = (
    <Stage theme={GAUGE.theme} shotFrame={g} drift={{ zoom: 1.03, panX: 0.005, panY: 0, frames: 180, seed: 7 }} vignette={0.2} grain={0.5}>
      <GaugeRoom f={g} floor={2200} seed={9} />
      <Layer depth={1}>
        <g transform={`translate(0 ${dy.toFixed(1)})`}>
          <rect x={-400} y={base} width={2720} height={700} fill={GAUGE.near} />
          <rect x={-400} y={base} width={2720} height={7} fill={GAUGE.light} opacity={0.7} />
          {/* a pull scale beside the bar: a tick every 100 px streaming down as the camera tilts */}
          {Array.from({ length: 36 }, (_, i) => {
            const y = base - i * 100;
            return <line key={i} x1={560} y1={y} x2={i % 5 ? 600 : 620} y2={y} stroke={C.amber} strokeWidth={i % 5 ? 3 : 6} strokeLinecap="round" />;
          })}
          <line x1={560} y1={base} x2={560} y2={base - 3500} stroke={C.amber} strokeWidth={4} />
          <PullBar x={660} y={base} h={H} t={1 - Math.pow(1 - u, 1 / 3)} f={g} readKey="pull760" w={150} />
          <Tick x={1000} y={base} pxPerM={170} frame={g} facing={-1} pose="lean" expression="surprised" headTilt={-14} look={0.2} />
        </g>
      </Layer>
      <Layer depth={0}>
        <text x={664} y={Math.min(topW + dy, 2000) - 110} style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 30, letterSpacing: 3, fill: "#FFEFC8" }}>
          ABOUT
        </text>
        <OurSumPill x={1020} y={Math.min(topW + dy, 2000) - 44} size={30} appear={lin(g, 20, 30)} />
      </Layer>
    </Stage>
  );
  const h = Math.max(0, f - T8);
  const shrink = h < 14 ? 40 - (h / 14) * 32 : 8;
  const r = h < 30 ? shrink : Math.min(300, 8 + (h - 30) * 5);
  const wob = h > 30 ? 1 + 0.05 * Math.sin((h - 30) * 0.5) * Math.exp(-(h - 30) / 90) : 1;
  const BX = 1180;
  const BY = 520;
  const tx = 880 - 160 * ez(h, 44, 80);
  const Cc = (
    <Stage theme={ABYSS.theme} shotFrame={h} drift={{ zoom: 1.04, panX: 0.0, panY: 0, frames: 140, seed: 8 }} vignette={0.32} grain={0.5}>
      <AbyssField f={h} speed={10} n={120} seed={23} />
      <Layer depth={1}>
        <Bloom x={BX} y={BY} r={Math.max(60, r * 1.8)} color={C.moonRim} strength={0.45} />
        {h < 30 ? <MoonToken x={BX} y={BY} r={shrink} f={h} /> : <TidalBall x={BX} y={BY} r={r * wob} f={h} spin={14} />}
        <Tick x={tx} y={1070} pxPerM={262} frame={h} facing={1} pose={h < 44 ? "point" : "stand"} staff={h < 44} expression={h < 30 ? "thinking" : "surprised"} walk={h > 44 && h < 80 ? -(h - 44) / 14 : undefined} look={0.4} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={110} y={130} text="TREATED AS A POINT" size={32} appear={lin(h, 4, 14)} />
      </Layer>
    </Stage>
  );
  if (f >= T8 - 8) return <Phase f={f} at={T8 - 8} dur={14} kind="push" a={B} b={Cc} />;
  return <Phase f={f} at={T7 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 3-09 + 3-10 + 3-11 · the ball turning (craters 14 px/f), the diameter bracket draws (40 px/f) and a caliper bead runs
// along it (24 px/f), 3,476 KM ACROSS; slide to the ball over the limb: near half gold, far half teal, the arrows
// pulsing (16 px/f), the cloud band sliding (14 px/f); then the near arrow lengthens and the ball draws into an egg
// ================================================================================================================
const ShotBall: ShotFC<CL03> = ({ f, c }) => {
  const T10 = c.s10 - c.s09;
  const T11 = c.s11 - c.s09;
  const bx = 820;
  const by = 600;
  const br = 300;
  const draw = lin(f, 6, 22);
  const bead = bx - br + Math.abs(wrap((f - 22) * 24, 4 * br) - 2 * br);
  const A = (
    <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 200, seed: 9 }} vignette={0.32} grain={0.5}>
      <AbyssField f={f} speed={8} angle={180} n={120} seed={24} lift={1} />
      <Layer depth={1}>
        <Bloom x={bx} y={by} r={540} color={C.moonRim} strength={0.35} />
        <TidalBall x={bx} y={by} r={br} f={f} spin={14} />
        <line x1={bx - br} y1={by} x2={bx - br} y2={210} stroke={alpha(C.moonRim, 0.7)} strokeWidth={3} strokeDasharray="8 8" />
        <line x1={bx + br} y1={by} x2={bx + br} y2={210} stroke={alpha(C.moonRim, 0.7)} strokeWidth={3} strokeDasharray="8 8" opacity={draw >= 1 ? 1 : 0} />
        <DimLine x0={bx - br} x1={bx + br} y={220} draw={draw} color={C.moonRim} tick={28} width={7} />
        {f > 22 ? (
          <g>
            <circle cx={bead} cy={220} r={26} fill={C.amber} opacity={0.35} />
            <circle cx={bead} cy={220} r={11} fill="#FFE7A0" />
          </g>
        ) : null}
      </Layer>
      <Layer depth={0}>
        <Readout x={1220} y={560} k={lin(f, 14, 80)} rkey="moonDiam" unit="KM ACROSS" size={100} />
        <OurSumPill x={1230} y={640} size={30} appear={lin(f, 30, 40)} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T10);
  const h = Math.max(0, f - T11);
  const grow = ez(h, 0, 22);
  const near = 150 + 210 * grow + 60 * Math.sin(g * 0.27);
  const far = 104 + 40 * grow + 30 * Math.sin(g * 0.27 + 1.2);
  const st = 0.35 * ez(h, 0, 40) + (h > 40 ? 0.04 * Math.sin((h - 40) * 0.2) : 0);
  const LY = 860;
  const tickX = 1380;
  const B = (
    <Stage theme={ABYSS.theme} shotFrame={g} drift={{ zoom: 1.04, panX: -0.01, panY: 0, frames: 200, seed: 10 }} vignette={0.3} grain={0.5}>
      <AbyssField f={g} speed={6} n={100} seed={25} lift={1} />
      <Layer depth={1}>
        <EarthLimb f={g} y={LY} R={2600} cloudSpeed={14} />
        <Bloom x={900} y={350} r={420} color={C.moonRim} strength={0.35} />
        <TidalBall x={900} y={340} r={200} f={g} dir={90} spin={6} stretch={st} near={near} far={far} tags />
        <HalfTint x={900} y={340} r={200 * (1 + 0.38 * st) * 0.98} dir={90} k={lin(g, 0, 12)} />
        <Tick x={tickX} y={limbY(tickX, LY, 2600)} pxPerM={130} frame={g} facing={-1} pose="point" expression="thinking" tilt={Math.sin(g * 0.06) * 8} headTilt={Math.sin(g * 0.06) * 10} />
      </Layer>
      <Layer depth={0}>{h > 0 ? <OurSumPill x={110} y={140} size={30} appear={lin(h, 4, 14)} /> : null}</Layer>
    </Stage>
  );
  return <Phase f={f} at={T10 - 6} dur={14} kind="slide" a={A} b={B} />;
};

// ================================================================================================================
// 3-12 · the rail rush from the mark up to today's token (decade 2400: 21 px/f), the two arrows nearly equal (1.02,
// #22), LESS THAN 2 % rolling
// ================================================================================================================
const ShotTodayGap: ShotFC<CL03> = ({ f, len }) => {
  const km = logLerp(MARKS.geo.km, MARKS.today.km, lin(f, 0, len - 6));
  return (
    <Pop f={f}>
      <Stage theme={GAUGE.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 150, seed: 11 }} vignette={0.2} grain={0.5}>
        <GaugeRoom f={f} floor={1300} seed={10} />
        <Layer depth={1}>
          <DistGauge f={f} family={GAUGE} center={km} decade={2400} x={1520} speed={24} token={km} tokenR={46} lit={f > len - 20 ? ["today"] : []} />
          <MoonToken x={950} y={250} r={46} f={f} />
          <PullArrows x={905} y={320} near={330} far={324} f={f} dir={90} width={20} />
          <text x={830} y={760} style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: 3, fill: "#FFEFC8" }}>
            NEAR · FAR
          </text>
        </Layer>
        <Layer depth={0}>
          <Readout x={110} y={330} k={lin(f, 16, 70)} rkey="todayPct" prefix="LESS THAN" unit="%" size={130} />
          <OurSumPill x={120} y={420} size={30} appear={lin(f, 30, 40)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-13 · back on the GEOSTATIONARY mark: the near arrow grows to 1.18 × the far one (no numeral, Q4), the gap bar
// between their tips widening and pulsing; the rail streaming (8 px/f + hatch 12): IT GROWS (line 15 as re-voiced)
// ================================================================================================================
const ShotGrows: ShotFC<CL03> = ({ f }) => {
  const dec = 900;
  const center = MARKS.geo.km * Math.pow(10, (f * 8) / dec);
  const far = 270;
  const near = far * (1.0 + 0.18 * ez(f, 6, 40)) + (f > 40 ? 8 * Math.sin((f - 40) * 0.25) : 0);
  const x0 = 905;
  const y0 = 300;
  return (
    <Pop f={f}>
      <Stage theme={GAUGE.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0, frames: 120, seed: 12 }} vignette={0.2} grain={0.5}>
        <GaugeRoom f={f} floor={1010} seed={11} />
        <Layer depth={1}>
          <DistGauge f={f} family={GAUGE} center={center} decade={dec} x={1560} speed={12} lit={["geo"]} />
          <MoonToken x={950} y={230} r={46} f={f} />
          <PullArrows x={x0} y={y0} near={near} far={far} f={f} dir={90} width={20} />
          {/* the gap bar: from the far tip's level down to the near tip's, beside the far arrow */}
          <rect x={x0 + 140} y={y0 + far} width={44} height={Math.max(2, near - far)} rx={8} fill={C.moonRim} opacity={0.9} />
          <rect x={x0 + 134} y={y0 + far - 6} width={56} height={Math.max(2, near - far) + 12} rx={10} fill="none" stroke="#FFE7A0" strokeWidth={3} opacity={0.5 + 0.5 * Math.sin(f / 3)} />
          <line x1={x0 + 100} y1={y0 + far} x2={x0 + 200} y2={y0 + far} stroke="#FFE7A0" strokeWidth={3} strokeDasharray="6 6" />
        </Layer>
        <Layer depth={0}>
          <TagPlate x={110} y={150} text="IT GROWS" size={36} appear={lin(f, 6, 16)} />
          <WordPill x={110} y={240} text="NOT YET ENOUGH TO BREAK IT" size={28} appear={lin(f, 40, 50)} F={GAUGE} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-14 · the token slides on down the rail (decade 3000: 26 px/f; mark labels hidden until each rung opens) while the
// near arrow keeps growing under the magnifier and the gap bar widens; THAT SMALL DIFFERENCE
// ================================================================================================================
const ShotDown: ShotFC<CL03> = ({ f, len }) => {
  const u = lin(f, 0, len);
  const km = logLerp(MARKS.geo.km, MARKS.geo.km / 45, u);
  const far = 220;
  const near = far * (1.18 + 1.2 * u);
  const x0 = 905;
  const y0 = 260;
  return (
    <Pop f={f}>
      <Stage theme={GAUGE.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.0, panY: 0, frames: 200, seed: 13 }} vignette={0.2} grain={0.5}>
        <GaugeRoom f={f} floor={1300} seed={12} />
        <Layer depth={1}>
          <DistGauge f={f} family={GAUGE} center={km} decade={3000} x={1520} speed={-26} token={km} tokenR={50} labels={false} />
          <MoonToken x={950} y={190} r={46} f={f} />
          <PullArrows x={x0} y={y0} near={near} far={far} f={f} dir={90} width={20} />
          <rect x={x0 + 140} y={y0 + far} width={44} height={Math.max(2, near - far)} rx={8} fill={C.moonRim} opacity={0.9} />
          <line x1={x0 + 100} y1={y0 + far} x2={x0 + 200} y2={y0 + far} stroke="#FFE7A0" strokeWidth={3} strokeDasharray="6 6" />
          <Magnifier x={x0 + 160} y={y0 + far + 30 + 10 * Math.sin(f / 6)} size={210} rotate={-20 + 6 * Math.sin(f / 9)} />
        </Layer>
        <Layer depth={0}>
          <Kicker x={100} y={110} text="THAT SMALL DIFFERENCE" color="#FFEFC8" size={36} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================

export const SceneL03: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL03(t);
  const shots: ShotDef<CL03>[] = [
    { from: 0, S: ShotRung, id: "3-01" }, // + 3-02, 3-03, 3-03b
    { from: c.s04, S: ShotSame, id: "3-04" },
    { from: c.s05, S: ShotCube, id: "3-05" },
    { from: c.s06, S: ShotNine, id: "3-06" }, // + 3-07, 3-08
    { from: c.s09, S: ShotBall, id: "3-09" }, // + 3-10, 3-11
    { from: c.s12, S: ShotTodayGap, id: "3-12" },
    { from: c.s13, S: ShotGrows, id: "3-13" },
    { from: c.s14, S: ShotDown, id: "3-14" },
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL03 = (t: SceneTiming): Cue[] => {
  const c = cuesL03(t);
  const run = (at: number, n: number, gap: number, vol = 0.07): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 8, file: SFX.pop, vol: 0.16, dur: 16 },
    { at: c.s02 - 2, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.s03 - 4, file: SFX.swirl, vol: 0.14, dur: 60 },
    { at: c.s03b, file: SFX.swirl, vol: 0.1, dur: 60 },
    ...cutHit(c.s04),
    { at: c.s04 + 12, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.s05),
    ...run(c.s05 + 16, 14, 8),
    ...cutHit(c.s06),
    { at: c.s06 + 2, file: SFX.whoosh, vol: 0.16, dur: 50 },
    { at: c.s07 + 10, file: SFX.boom, vol: 0.28, dur: 130, fadeOut: 40 },
    ...cutHit(c.s08),
    { at: c.s08 + 30, file: SFX.pop, vol: 0.16, dur: 16 },
    ...cutHit(c.s09),
    { at: c.s09 + 8, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.s10 - 4, file: SFX.whoosh, vol: 0.1, dur: 40 },
    { at: c.s10 + 10, file: SFX.pop, vol: 0.12, dur: 16 },
    { at: c.s11 + 2, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.s12),
    { at: c.s12 + 2, file: SFX.whoosh, vol: 0.18, dur: 60 },
    ...cutHit(c.s13),
    { at: c.s13 + 6, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.s14),
    { at: c.s14 + 2, file: SFX.deepWhoosh, vol: 0.24, dur: 80 },
  ];
};
