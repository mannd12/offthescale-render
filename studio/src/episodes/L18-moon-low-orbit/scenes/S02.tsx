// L18 scene "l02" · the clock (storyboard §3 scene 2: 2-01…2-13, script lines 7-10; `abyss` orbits and clocks →
// `bowl` for the crossing → `gauge` for the rail's lights-on). Orbits are NOT to scale (F8: the tag sits on 2-01).
// Everything turns prograde: counterclockwise on screen seen from above (angles decrease), the Earth with its pin too.
// Shot components (hard cuts only; PUSH/SLIDE rows are phases of one component):
//   2-01 (+2-02)      top-down: the station racing (8 deg/f), the Moon crawling the wide ring; the Moon drops to just
//                     outside the station's ring (13 px/f) and races; ABOUT 27 DAYS → ABOUT 2 H 10 MIN
//   2-03 (+2-04)      two lap bars filling side by side (15 / 11 px/f, looping); slide to the speed bar growing out of
//                     the token (40 px/f) with streaks (30 px/f), NEARLY 7 KM/S
//   2-04b             the long bar streaming beside today's short bar creeping out (14 px/f); TODAY: ABOUT 1 KM/S
//   2-05 (+2-06)      the 24-hour clock, hand 12 deg/f, a pip per Moon lap (11); the station's clock slides in (16)
//   2-07              the Earth turning with its pin (24 h), the Moon racing its ring (8 deg/f)
//   2-08 (+2-09, 2-10) the Moon overtaking the pin again and again, a pip per pass; LIKE PHOBOS: Mars and Phobos (the
//                     2026-11-19 line 9, row 23); the bowl sky: the Moon rising out of the west, crossing to the east
//                     (W → E, row 14 reasoning) with its trail; the stopwatch (30 deg/f), MINUTES
//   2-11              the lights come on in the rail room; Tick heaves the token up to the GEOSTATIONARY mark
//   2-12 (+2-13)      five dashed marks drawn down the rail one after another (37 px/f); the big Earth at the foot with
//                     pull arrows stretching and snapping back (16 px/f); WHAT IS THE EARTH DOING TO IT?
// Numbers drawn (data18 READ): days27 (#1 A) · lap2h10 (#9 C, OUR SUM) · station90 (#3 A) · speed7 7 (#9 C, OUR SUM) ·
// speed1 (#1 A) · laps11 (#9 C, OUR SUM) · laps16 (#3 A) · earth24 (#13 A). Laps are pips, never rolling numerals.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Kicker, Layer, Stage, Tick, alpha } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { DistGauge, MARKS, MarkId, MoonToken, railY } from "../gauge";
import { MoonFace, SkyBowl, bowlPt } from "../sky";
import { DayClock, LapChip } from "../orbit";
import { EarthDisc } from "../planets18";
import { Arrow18 } from "../tidal";
import { OurSumPill, WordPill } from "../tags18";
import { Streaks } from "../movers18";
import { READ } from "../data18";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { ABYSS, AbyssField, BOWL, BowlGround, BowlSky, C, ClipCircle, GAUGE, GaugeRoom, MetricA, Orbiter, Phase, Pop, Readout, Stopwatch18, TagPlate, centerFor, ez, fr, lin, wrap } from "./a-parts";

export const cuesL02 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    s01: 0,
    s02: p(0, "At this height, one lap"), // phase (push)
    s03: p(0, "The station takes about ninety minutes"),
    s04: at(1), // phase (slide)
    s04b: p(1, "where today it moves at about one"),
    s05: p(1, "That is about eleven laps a day"),
    s06: p(1, "against the station's sixteen"), // phase (slide)
    s07: at(2),
    s08: p(2, "So the Moon would lap"),
    s09: p(2, "Like Mars's fast moon Phobos"), // phase (push)
    s09b: p(2, "it would rise in the west"), // phase (push)
    s10: p(2, "and cross the whole sky in minutes"), // phase (same set)
    s11: at(3),
    s12: p(3, "To see the second"),
    s13: p(3, "and at every step ask one question"), // phase (slide)
    end: t.frames,
  };
};
export type CL02 = ReturnType<typeof cuesL02>;

const OX = 720;
const OY = 560;

// ================================================================================================================
// 2-01 + 2-02 · the station racing its tight ring (8 deg/f = 17 px/f), the Moon crawling the wide ring (0.5 deg/f)
// with its trail; then the Moon drops inward (13 px/f) to just outside the station's ring and races (5.5 deg/f)
// ================================================================================================================
const ShotRings: ShotFC<CL02> = ({ f, c }) => {
  const T2 = c.s02;
  const g = Math.max(0, f - T2);
  const drop = ez(g, 0, 20);
  const rM = 430 + (175 - 430) * drop;
  const aM = 30 - f * 0.5 - 5 * Math.max(0, g - 10);
  const aS = -90 - f * 8;
  return (
    <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0, frames: 240, seed: 1 }} vignette={0.3} grain={0.5}>
      <AbyssField f={f} speed={6} angle={200} n={120} seed={11} />
      <Layer depth={1}>
        {g > 0 ? <ellipse cx={OX} cy={OY} rx={430} ry={430} fill="none" stroke={alpha(C.moonRim, 0.22 * (1 - drop))} strokeWidth={3} strokeDasharray="10 10" /> : null}
        <Orbiter cx={OX} cy={OY} r={125} angle={aS} kind="station" size={22} f={f} trail={90} color={C.amber} />
        <Orbiter cx={OX} cy={OY} r={rM} angle={aM} kind="moon" size={34} f={f} trail={g > 10 ? 80 : 26} />
        <EarthDisc x={OX} y={OY} r={60} f={f} />
        <LapChip x={1250} y={640} w={480} progress={fr((f * 8) / 360)} f={f} label="STATION" />
        <LapChip x={1250} y={780} w={480} progress={g > 10 ? fr((30 - aM) / 360) : fr((f * 0.5) / 360)} f={f} label="MOON" color={C.moonRim} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={560} y={1020} text="NOT TO SCALE" size={24} />
        {g <= 0 ? (
          <WordPill x={1250} y={330} text={READ.days27.text} size={32} appear={lin(f, 10, 20)} />
        ) : (
          <g>
            <MetricA x={1240} y={340} value={READ.lap2h10.text} size={78} reveal={lin(g, 8, 30)} />
            <OurSumPill x={1250} y={410} size={28} appear={lin(g, 24, 34)} />
          </g>
        )}
      </Layer>
    </Stage>
  );
};

// a horizontal speed bar with stripes crawling along it (never settles)
const SpeedBar: React.FC<{ x: number; y: number; w: number; h?: number; f: number; color?: string; crawl?: number }> = ({ x, y, w, h = 64, f, color = C.moonRim, crawl = 6 }) => {
  if (w < 2) return null;
  const off = wrap(f * crawl, 48);
  return (
    <g>
      <rect x={x - 4} y={y - h / 2 - 4} width={w + 8} height={h + 8} rx={h / 2 + 4} fill={alpha(color, 0.22)} />
      <rect x={x} y={y - h / 2} width={w} height={h} rx={h / 2} fill={color} />
      <ClipBar x={x} y={y - h / 2} w={w} h={h}>
        {Array.from({ length: Math.ceil(w / 48) + 2 }, (_, i) => (
          <line key={i} x1={x - 48 + i * 48 + off} y1={y + h / 2} x2={x - 48 + i * 48 + off + 30} y2={y - h / 2} stroke="#FFFFFF" strokeWidth={10} opacity={0.3} />
        ))}
      </ClipBar>
      <rect x={x + 8} y={y - h / 2 + 6} width={Math.max(0, w - 16)} height={10} rx={5} fill="#FFFFFF" opacity={0.3} />
    </g>
  );
};
const ClipBar: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode }> = ({ x, y, w, h, children }) => {
  const id = "cbar" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={h / 2} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
};

const UNIT = 160; // px per km/s on the speed bars (7 → 1,120 px; 1 → 160 px: 6.84 vs 1.02, rows 9 and 1)

// ================================================================================================================
// 2-03 + 2-04 · two lap bars filling side by side (station 15 px/f, Moon 11 px/f, looping) with both tokens circling;
// slide to the speed bar growing out of the token (40 px/f), streaks off it (30 px/f), stars streaming, NEARLY 7 KM/S
// ================================================================================================================
const ShotBars: ShotFC<CL02> = ({ f, c }) => {
  const T4 = c.s04 - c.s03;
  const ox = 470;
  const oy = 560;
  const aS = -90 - f * 8;
  const aM = 200 - f * 5.5;
  const A = (
    <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 160, seed: 2 }} vignette={0.3} grain={0.5}>
      <AbyssField f={f} speed={6} angle={200} n={110} seed={12} />
      <Layer depth={1}>
        <Orbiter cx={ox} cy={oy} r={120} angle={aS} kind="station" size={20} f={f} trail={90} color={C.amber} />
        <Orbiter cx={ox} cy={oy} r={172} angle={aM} kind="moon" size={30} f={f} trail={70} />
        <EarthDisc x={ox} y={oy} r={60} f={f} />
        <LapChip x={900} y={440} w={760} progress={fr((f * 8) / 360 + 0.15)} f={f} label="STATION" />
        <LapChip x={900} y={640} w={760} progress={fr((f * 5.5) / 360 + 0.05)} f={f} label="MOON" color={C.moonRim} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={900} y={300} text={`STATION: ${READ.station90.text}`} size={32} appear={lin(f, 6, 16)} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T4);
  const w = Math.min(7 * UNIT, g * 40);
  const B = (
    <Stage theme={ABYSS.theme} shotFrame={g} drift={{ zoom: 1.04, panX: -0.01, panY: 0, frames: 160, seed: 3 }} vignette={0.3} grain={0.5}>
      <AbyssField f={g} speed={22} angle={180} n={130} seed={13} />
      <Layer depth={1}>
        <Streaks x={330} y={560} f={g} angle={180} n={12} len={120} speed={30} spread={50} color={C.moonRim} width={6} />
        <SpeedBar x={420} y={560} w={w} f={g} />
        <Bloom x={340} y={560} r={180} color={C.moonRim} strength={0.5} />
        <MoonToken x={340} y={560} r={64} f={g} spin={6} />
        <text x={420} y={660} style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 30, letterSpacing: 3, fill: "#FFE2A8" }}>
          AT THE STATION'S HEIGHT
        </text>
      </Layer>
      <Layer depth={0}>
        <Readout x={430} y={380} k={lin(g, 4, 34)} rkey="speed7" prefix="NEARLY" unit="KM/S" size={120} />
        <OurSumPill x={440} y={444} size={28} appear={lin(g, 20, 30)} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T4 - 6} dur={14} kind="slide" a={A} b={B} />;
};

// ================================================================================================================
// 2-04b · the long bar streaming (stripes + streaks 22 px/f) above today's short bar creeping out (14 px/f) beside
// today's token crawling its wide ring
// ================================================================================================================
const ShotToday: ShotFC<CL02> = ({ f }) => {
  const w = Math.min(UNIT, 20 + f * 14);
  const aT = -60 - f * 0.5;
  return (
    <Pop f={f}>
      <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 100, seed: 4 }} vignette={0.3} grain={0.5}>
        <AbyssField f={f} speed={14} angle={180} n={120} seed={14} />
        <Layer depth={1}>
          <Streaks x={330} y={380} f={f} angle={180} n={12} len={110} speed={22} spread={44} color={C.moonRim} width={5} />
          <SpeedBar x={420} y={380} w={7 * UNIT} f={f} crawl={8} />
          <MoonToken x={340} y={380} r={56} f={f} spin={6} />
          <text x={420} y={470} style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: 3, fill: "#FFE2A8" }}>
            AT THE STATION'S HEIGHT
          </text>
          <Orbiter cx={250} cy={760} r={110} angle={aT} kind="moon" size={22} f={f} trail={30} />
          <circle cx={250} cy={760} r={22} fill={C.earthLimb} />
          <SpeedBar x={420} y={760} w={w} h={56} f={f} color={C.amber} crawl={2} />
          <text x={420} y={846} style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: 3, fill: "#FFE2A8" }}>
            TODAY
          </text>
        </Layer>
        <Layer depth={0}>
          <WordPill x={640} y={760} text={READ.speed1.text} size={32} appear={lin(f, 10, 20)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-05 + 2-06 · the 24-hour clock: the hand sweeps 12 deg/f (43 px/f at the tip) and a pip pops per Moon lap (11);
// the station's clock slides in beside it with sixteen pips
// ================================================================================================================
const ShotClocks: ShotFC<CL02> = ({ f, c }) => {
  const T6 = c.s06 - c.s05;
  const g = f - T6;
  const k = ez(f, T6 - 4, T6 + 10);
  const xa = 960 + (560 - 960) * k;
  return (
    <Pop f={f}>
      <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.005, panY: 0, frames: 150, seed: 5 }} vignette={0.3} grain={0.5}>
        <AbyssField f={f} speed={6} angle={200} n={110} seed={15} />
        <Layer depth={1}>
          <DayClock x={xa} y={470} r={230} f={f} progress={((f + 4) * 12) / 360} laps={11} family={ABYSS} label={READ.laps11.text} />
          <MoonToken x={xa + 190} y={250} r={34} f={f} />
          {g > -4 ? (
            <g opacity={k} transform={`translate(${((1 - k) * 300).toFixed(1)} 0)`}>
              <DayClock x={1340} y={470} r={230} f={f} progress={(Math.max(0, g + 4) * 12) / 360} laps={16} family={ABYSS} label={READ.laps16.text} />
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <OurSumPill x={xa} y={890} size={28} align="middle" appear={lin(f, 12, 22)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// the Earth seen from above, turning prograde with a surface pin (the cloud strips turn with it)
const TurningEarth: React.FC<{ x: number; y: number; r: number; f: number; angle: number; pin?: boolean }> = ({ x, y, r, f, angle, pin = true }) => {
  const a = (angle * Math.PI) / 180;
  const px = x + Math.cos(a) * r;
  const py = y + Math.sin(a) * r;
  return (
    <g>
      <g transform={`rotate(${angle.toFixed(2)} ${x} ${y})`}>
        <EarthDisc x={x} y={y} r={r} f={f * 0} spin={0} />
        <ClipCircle cx={x} cy={y} r={r}>
          {Array.from({ length: 7 }, (_, i) => (
            <ellipse key={i} cx={x + Math.cos(i * 0.9) * r * 0.55} cy={y + Math.sin(i * 1.7) * r * 0.55} rx={r * 0.22} ry={r * 0.08} fill="#FFFFFF" opacity={0.55} transform={`rotate(${i * 40} ${x} ${y})`} />
          ))}
        </ClipCircle>
      </g>
      {pin ? (
        <g>
          <line x1={x + Math.cos(a) * r * 0.86} y1={y + Math.sin(a) * r * 0.86} x2={px + Math.cos(a) * 40} y2={py + Math.sin(a) * 40} stroke={C.lever} strokeWidth={8} strokeLinecap="round" />
          <circle cx={px + Math.cos(a) * 46} cy={py + Math.sin(a) * 46} r={15} fill={C.lever} stroke="#2A0E04" strokeWidth={3} />
        </g>
      ) : null}
    </g>
  );
};

// ================================================================================================================
// 2-07 · the Earth turning with its pin (0.73 deg/f: one turn per 11 Moon laps), the Moon racing its ring (8 deg/f)
// ================================================================================================================
const ShotSpin: ShotFC<CL02> = ({ f }) => {
  const eA = -90 - f * 0.73;
  const mA = -40 - f * 8;
  return (
    <Pop f={f}>
      <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0, frames: 130, seed: 6 }} vignette={0.3} grain={0.5}>
        <AbyssField f={f} speed={6} angle={200} n={120} seed={16} />
        <Layer depth={1}>
          <Orbiter cx={760} cy={560} r={340} angle={mA} kind="moon" size={38} f={f} trail={70} />
          <TurningEarth x={760} y={560} r={180} f={f} angle={eA} />
          <path d="M560 300 A290 290 0 0 0 470 560" fill="none" stroke={alpha(C.cloud, 0.6)} strokeWidth={6} strokeDasharray="14 10" strokeDashoffset={f * 2} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={1260} y={300} text={READ.earth24.text} size={34} appear={lin(f, 6, 16)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-08 + 2-09 + 2-10 · the Moon overtaking the pin (9 vs 0.82 deg/f), a pip per pass; push to Mars and Phobos
// (LIKE PHOBOS, row 23: a moon that outruns its planet's spin); push to the bowl: the Moon rises out of the west and
// crosses to the east (row 14 reasoning) with its trail and the stopwatch (30 deg/f): MINUTES
// ================================================================================================================
const ShotCross: ShotFC<CL02> = ({ f, c }) => {
  const T9 = c.s09 - c.s08;
  const T9b = c.s09b - c.s08;
  const T10 = c.s10 - c.s08;
  const eA = -90 - f * 0.82;
  const mA = -90 + 100 - f * 9; // starts 100° behind the pin
  const rel = 100 - (f * 9 - f * 0.82); // > 0 behind the pin
  const passes = rel > 0 ? 0 : Math.floor(-rel / 360) + 1;
  const sinceLast = passes > 0 ? (-rel - (passes - 1) * 360) / 8.18 : 99;
  const A = (
    <Stage theme={ABYSS.theme} shotFrame={f} drift={{ zoom: 1.05, panX: -0.01, panY: 0, frames: 140, seed: 7 }} vignette={0.3} grain={0.5}>
      <AbyssField f={f} speed={6} angle={200} n={120} seed={17} />
      <Layer depth={1}>
        <Orbiter cx={760} cy={560} r={340} angle={mA} kind="moon" size={38} f={f} trail={80} />
        <TurningEarth x={760} y={560} r={180} f={f} angle={eA} />
        {passes > 0 && sinceLast < 10 ? <circle cx={760 + Math.cos((eA * Math.PI) / 180) * 340} cy={560 + Math.sin((eA * Math.PI) / 180) * 340} r={30 + sinceLast * 4} fill="none" stroke={C.moonRim} strokeWidth={6} opacity={1 - sinceLast / 10} /> : null}
        {/* the tally: one pip per pass (no numerals) */}
        {Array.from({ length: 4 }, (_, k) => {
          const on = k < passes;
          const age = k === passes - 1 ? sinceLast : 99;
          const s = on ? 1 + 0.7 * Math.max(0, 1 - age / 6) : 0.7;
          return <circle key={k} cx={1300 + k * 70} cy={320} r={20 * s} fill={on ? C.moonRim : alpha(C.amber, 0.25)} stroke={C.amber} strokeWidth={3} />;
        })}
        <text x={1300} y={250} style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: 3, fill: "#FFE2A8" }}>
          LAPS OVER THE PIN
        </text>
      </Layer>
    </Stage>
  );
  // Mars and Phobos: the same overtaking, on another planet (oxide disc, no map features)
  const g = Math.max(0, f - T9);
  const marsA = -90 - g * 2.8;
  const phA = -10 - g * 9;
  const B = (
    <Stage theme={ABYSS.theme} shotFrame={g} drift={{ zoom: 1.05, panX: 0.012, panY: 0, frames: 170, seed: 8 }} vignette={0.3} grain={0.5}>
      <AbyssField f={g} speed={6} angle={200} n={120} seed={18} />
      <Layer depth={1}>
        <Orbiter cx={760} cy={560} r={300} angle={phA} kind="rock" size={22} f={g} trail={80} color={C.moonMid} />
        <g transform={`rotate(${marsA.toFixed(2)} 760 560)`}>
          <Bloom x={760} y={560} r={260} color={C.oxide} strength={0.4} />
          <circle cx={760} cy={560} r={160} fill={C.oxide} />
          <circle cx={735} cy={530} r={130} fill="#E0662A" opacity={0.7} />
          <ellipse cx={760} cy={600} rx={150} ry={22} fill={C.giantBand2} opacity={0.6} />
          <ellipse cx={740} cy={500} rx={120} ry={16} fill={C.giantBand1} opacity={0.55} />
          <path d="M800 400 A160 160 0 0 1 800 720" fill="#3A1406" opacity={0.32} />
        </g>
        {(() => {
          const a = (marsA * Math.PI) / 180;
          return <circle cx={760 + Math.cos(a) * 176} cy={560 + Math.sin(a) * 176} r={13} fill={C.lever} stroke="#2A0E04" strokeWidth={3} />;
        })()}
      </Layer>
      <Layer depth={0}>
        <WordPill x={1250} y={330} text="LIKE PHOBOS" size={40} appear={lin(g, 6, 16)} />
        <text x={1260} y={420} style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 30, letterSpacing: 3, fill: "#FFE2A8" }} opacity={lin(g, 14, 24)}>
          MARS'S FAST MOON
        </text>
      </Layer>
    </Stage>
  );
  // the bowl sky: one continuous crossing W → E over 2-09b and 2-10 (the path radius 700 about the observer)
  const h = Math.max(0, f - T9b);
  const hz = 920;
  const crossLen = c.s11 - c.s09b;
  const th = -14 + (194 * h) / Math.max(1, crossLen); // deg: rises out of the west (0) and sets in the east (180)
  const [mx, my] = bowlPt(th, 960, hz + 80, 760);
  const m = Math.max(0, f - T10);
  const Cc = (
    <Stage theme={BOWL.theme} shotFrame={h} drift={{ zoom: 1.03, panX: 0.0, panY: 0, frames: 150, seed: 9 }} vignette={0.2} grain={0.5}>
      <BowlSky f={h} horizon={hz} seed={9} />
      <Layer depth={0.8}>
        <SkyBowl f={h} family={BOWL} cx={960} horizon={hz} R={820} clouds={14} labels={false} />
        <path d={`M${bowlPt(Math.max(-14, th - 60), 960, hz + 80, 760).join(" ")} A760 760 0 0 1 ${mx} ${my}`} fill="none" stroke={C.moonRim} strokeWidth={240} strokeLinecap="round" opacity={0.22} />
        <Bloom x={mx} y={my} r={560} color={C.moonRim} strength={0.4} />
        <MoonFace f={h} x={mx} y={my} radius={330} scroll={20} />
        <BowlGround horizon={hz} />
        <text x={960 - 820 + 6} y={hz + 52} textAnchor="middle" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 40, letterSpacing: 2, fill: "#FFEBC2" }}>
          W
        </text>
        <text x={960 + 820 - 6} y={hz + 52} textAnchor="middle" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 40, letterSpacing: 2, fill: "#FFEBC2" }}>
          E
        </text>
        {m > 0 ? <Stopwatch18 x={1640} y={250} r={110 * ez(m, 0, 8)} angle={m * 30} f={m} /> : null}
      </Layer>
      <Layer depth={0}>
        {m <= 0 ? <WordPill x={110} y={130} text="LIKE PHOBOS" size={32} /> : <TagPlate x={110} y={140} text="MINUTES" size={34} appear={lin(m, 4, 14)} />}
      </Layer>
    </Stage>
  );
  if (f >= T9b - 8) return <Phase f={f} at={T9b - 8} dur={14} kind="push" a={B} b={Cc} />;
  return <Phase f={f} at={T9 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 2-11 · the rail room's lights come on (lamps stagger 6 f); Tick heaves the token up; the camera rises and the
// GEOSTATIONARY mark comes down the rail to it (ticks streaming 24 px/f), its lamp lights
// ================================================================================================================
const ShotLightsOn: ShotFC<CL02> = ({ f }) => {
  const dec = 600;
  const RX = 1560;
  const yGeo = 330 - 24 * Math.max(0, 80 - f);
  const center = centerFor(MARKS.geo.km, yGeo, dec);
  const lift = ez(f, 12, 42);
  const tx = 1384 + (RX - 1384) * lift;
  const ty = 628 + (yGeo - 628) * lift;
  return (
    <Pop f={f}>
      <Stage theme={GAUGE.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 110, seed: 10 }} vignette={0.2} grain={0.5}>
        <GaugeRoom f={f} floor={1000} lamps={lin(f, 4, 44)} dim={1 - ez(f, 2, 14)} seed={2} />
        <Layer depth={1}>
          <DistGauge f={f} family={GAUGE} center={center} decade={dec} x={RX} speed={24} lit={f > 78 ? ["geo"] : []} />
          <Bloom x={tx} y={ty} r={140} color={C.moonRim} strength={0.5} />
          <MoonToken x={tx} y={ty} r={36} f={f} />
          <Tick x={1240} y={1062} pxPerM={270} frame={f} pose="heave" poseTo="cheer" poseT={ez(f, 46, 64)} expression="determined" expressionTo="happy" expressionT={ez(f, 70, 84)} look={0.3} />
        </Layer>
      </Stage>
    </Pop>
  );
};

const ORDER: MarkId[] = ["today", "geo", "fluid", "stiff", "station"];

// ================================================================================================================
// 2-12 + 2-13 · the whole rail: five dashed marks draw leftward one after another (37 px/f, 20 f each) as their lamps
// light, Tick pointing down the rail; slide to the big Earth at the foot: pull arrows stretching and snapping back
// (16 px/f) to the token, the token sliding down, WHAT IS THE EARTH DOING TO IT?
// ================================================================================================================
const ShotSteps: ShotFC<CL02> = ({ f, c }) => {
  const T13 = c.s13 - c.s12;
  const dec = 300;
  const RX = 1500;
  const center = 12400 * Math.pow(10, -(f * 3) / dec);
  const each = 20;
  const done = Math.floor(f / each);
  const A = (
    <Stage theme={GAUGE.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.0, panY: 0.01, frames: 140, seed: 11 }} vignette={0.2} grain={0.5}>
      <GaugeRoom f={f} floor={1010} seed={3} />
      <Layer depth={1}>
        <DistGauge f={f} family={GAUGE} center={center} decade={dec} x={RX} speed={14} labels={false} lit={ORDER.slice(0, Math.min(5, done))} />
        {ORDER.map((m, i) => {
          const k = lin(f, i * each, (i + 1) * each);
          if (k <= 0) return null;
          const y = railY(MARKS[m].km, center, dec);
          const x1 = RX - 740 * k;
          return (
            <g key={m}>
              <line x1={RX - 40} y1={y} x2={x1} y2={y} stroke={C.moonRim} strokeWidth={6} strokeDasharray="22 14" strokeLinecap="round" />
              {k < 1 ? <circle cx={x1} cy={y} r={14} fill="#FFE7A0" /> : null}
            </g>
          );
        })}
        <Tick x={560} y={1012} pxPerM={150} frame={f} pose="point" expression="neutral" look={0.2} tilt={-4 + Math.min(4, done) * 2} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T13);
  const ty = 210 + g * 1.4;
  const saw = (k: number) => fr((g + k * 7) / 20);
  const B = (
    <Stage theme={GAUGE.theme} shotFrame={g} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 160, seed: 12 }} vignette={0.2} grain={0.5}>
      <GaugeRoom f={g} floor={1080} seed={4} />
      <Layer depth={1}>
        <DistGauge f={g} family={GAUGE} center={8000 * Math.pow(10, -(g * 4) / 500)} decade={500} x={1640} speed={14} labels={false} />
        <Bloom x={760} y={1260} r={900} color={C.earthLimb} strength={0.35} />
        <EarthDisc x={760} y={1290} r={580} f={g} spin={5} />
        <Bloom x={760} y={ty} r={170} color={C.moonRim} strength={0.5} />
        {[-70, 0, 70].map((dx, k) => {
          const L = 120 + 300 * saw(k);
          return <Arrow18 key={k} x0={760 + dx} y0={ty + 80} x1={760 + dx * 1.8} y1={ty + 80 + L} color={C.lever} width={16} />;
        })}
        <MoonToken x={760} y={ty} r={72} f={g} />
        <Tick x={1260} y={1000} pxPerM={150} frame={g} facing={-1} pose="think" expression="thinking" headTilt={10} look={0.2} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={100} y={110} text="WHAT IS THE EARTH DOING TO IT?" color="#FFEFC8" size={36} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T13 - 6} dur={14} kind="slide" a={A} b={B} />;
};

// ================================================================================================================

export const SceneL02: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL02(t);
  const shots: ShotDef<CL02>[] = [
    { from: 0, S: ShotRings, id: "2-01" }, // + 2-02
    { from: c.s03, S: ShotBars, id: "2-03" }, // + 2-04
    { from: c.s04b, S: ShotToday, id: "2-04b" },
    { from: c.s05, S: ShotClocks, id: "2-05" }, // + 2-06
    { from: c.s07, S: ShotSpin, id: "2-07" },
    { from: c.s08, S: ShotCross, id: "2-08" }, // + 2-09 (Phobos, rise), 2-10
    { from: c.s11, S: ShotLightsOn, id: "2-11" },
    { from: c.s12, S: ShotSteps, id: "2-12" }, // + 2-13
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL02 = (t: SceneTiming): Cue[] => {
  const c = cuesL02(t);
  const run = (at: number, n: number, gap: number, vol = 0.07): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 2, file: SFX.swirl, vol: 0.14, dur: 60 },
    { at: c.s02, file: SFX.whoosh, vol: 0.14, dur: 40 },
    ...cutHit(c.s03),
    { at: c.s03 + 4, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.s04 - 4, file: SFX.whoosh, vol: 0.1, dur: 40 },
    { at: c.s04 + 10, file: SFX.boom, vol: 0.26, dur: 110, fadeOut: 40 },
    ...cutHit(c.s04b),
    { at: c.s04b + 4, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.s05),
    ...run(c.s05 + 4, 8, 8),
    ...run(c.s06 + 4, 10, 6),
    ...cutHit(c.s07),
    { at: c.s07 + 2, file: SFX.swirl, vol: 0.14, dur: 60 },
    ...cutHit(c.s08),
    ...run(c.s08 + 14, 3, 44, 0.1),
    { at: c.s09 - 4, file: SFX.whoosh, vol: 0.12, dur: 40 },
    { at: c.s09b - 6, file: SFX.deepWhoosh, vol: 0.22, dur: 70 },
    { at: c.s10, file: SFX.whoosh, vol: 0.14, dur: 50 },
    ...run(c.s10 + 4, 6, 10, 0.06),
    ...cutHit(c.s11),
    { at: c.s11 + 4, file: SFX.click, vol: 0.14, dur: 10 },
    { at: c.s11 + 80, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.s12),
    ...run(c.s12 + 4, 5, 20, 0.1),
    { at: c.s13 - 4, file: SFX.whoosh, vol: 0.1, dur: 40 },
    { at: c.s13 + 10, file: SFX.pop, vol: 0.14, dur: 16 },
  ];
};
