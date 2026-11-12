// L13 scene l02 "Folding the ruler" (storyboard §3 "2 ·": shots 2-01…2-16, script lines 12-18, family noon, Act I).
// The meadow ladder: a rung every 20 dB (140 px), 0 dB at y 880, at the same screen place as l01's 1-12 (MATCH cut).
// Shot components (PUSH = one component): 2-01 (the meadow, "The Decibel") · 2-02 (Tick climbs 20 dB, the wave ×10) ·
// 2-03 (one cube becomes ten) · 2-04 (the 0 rung under a lens: 20 µPa) · 2-05…2-09 (one tilt up the everyday rungs:
// leaves, crickets, talk, thunder, the jet) · 2-10 (the cannon at 126, a ring front crosses to Tick) · 2-11 (pull back,
// the 60 → 120 bracket) · 2-12 (the 120 wave bursts the frame, ×1,000) · 2-13 (a million cubes pour down the hill) ·
// 2-14 (Tick's double take) · 2-15 (the climb past the props, clouds falling past) · 2-16 (Tick bumps the saffron line).
// Numbers drawn, each with its sources.md row: rungs 0-180 every 20 (#9, the dB scale) · +20 dB = 10× pressure, +10 dB =
// 10× energy (#9) · 0 dB · 20 µPa · THE SCALE'S ZERO (#9 #10, F17) · 20 · 40 · 60 · 100 · 120 · 126 with distances,
// "EVERYDAY LEVELS (dBA)" (#10, F6) · 60 → 120: +60 dB · ×1,000 pressure · ×1,000,000 energy (#9). The ceiling line has
// NO number here (F1); the gauge readout is hidden above 130 so it can never show 194. No cover-ears (F17).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Bloom,
  CloudRack,
  Emissive,
  Family,
  Flock,
  GroundShadow,
  HazeBand,
  Headline,
  IF2,
  Inset,
  Layer,
  Metric,
  Motes,
  Puffs,
  Sky,
  Stage,
  Streamers,
  Tick,
  alpha,
  cameraAt,
  cutPop,
  flash,
  impact,
  mixHex,
  ramp,
  rnd,
  smooth,
  walkPhase,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L13_COLORS, familyOf, pillFill } from "../families";
import { DB, EVERYDAY_MARKS, L13Gauge } from "../L13Gauge";
import { Cannon } from "../props";
import { PressureWave, Rings } from "../sound";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";

const N = familyOf("noon");
const SAF = L13_COLORS.saffron;
const GROUND = 900;
const LX0 = 700;
const LX1 = 820;
const LXC = (LX0 + LX1) / 2;
/** screen-world y of a dB value on the ladder (0 dB at 880, 140 px per 20 dB) */
const rungY = (v: number) => 880 - v * 7;
const CEIL_Y = rungY(DB.ceiling); // #11 (no label in this scene, F1)
const LADDER_TOP = rungY(186);
const CEILING = { v: DB.ceiling };

export const cuesL02 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    start: 0,
    climb: p(0, "Every twenty decibels"), // 2-02
    cubes: p(0, "Every ten decibels"), // 2-03
    zero: at(1), // 2-04
    leaves: at(2), // 2-05 (tilt-up shot through 2-09)
    crickets: p(2, "Crickets"),
    talk: p(2, "Two people"),
    thunder: p(2, "Thunder"),
    jet: p(2, "A military jet"),
    cannon: at(3), // 2-10
    trick: at(4), // 2-11
    thousand: p(4, "That is a thousand times"), // 2-12
    million: p(4, "and a million times"), // 2-13
    polite: p(4, "The ladder looks polite"),
    notPolite: at(5), // 2-14
    climbHigh: at(6), // 2-15
    bump: p(6, "And then the ladder itself"), // 2-16
    last: end(6),
    end: t.frames,
  };
};
export type CL02 = ReturnType<typeof cuesL02>;

const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/** A tag that keeps its units' case ("dB", "m", "µPa"; the kit Pill upper-cases). */
const Tag: React.FC<{ x: number; y: number; text: string; dot?: string; size?: number; align?: "start" | "end" | "middle"; F?: Family }> = ({ x, y, text, dot, size = 24, align = "start", F = N }) => {
  const w = text.length * size * 0.6 + size * (dot ? 2.3 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={pillFill(F)} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.1, fill: "#FFF7DC" }}>
        {text}
      </text>
    </g>
  );
};
/** A kicker that keeps case ("dBA"): rule + spaced label. */
const KickerRaw: React.FC<{ x: number; y: number; text: string; color: string; size?: number }> = ({ x, y, text, color, size = 26 }) => (
  <g>
    <rect x={x} y={y - size * 0.36} width={size * 1.1} height={2.5} fill={color} opacity={0.8} />
    <text x={x + size * 1.5} y={y} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.18, fill: color }}>
      {text}
    </text>
  </g>
);

// ---------------------------------------------------------------------------------------------
// the meadow world: sky, sun (upper left, 225), high cumulus, hills, the ladder, swaying grass

const GRASS = Array.from({ length: 90 }, (_, i) => ({ x: -300 + i * 30 + rnd(i) * 20, h: 50 + rnd(i * 3) * 80, ph: rnd(i * 7) * 6.28, c: i % 3 }));
const Grass: React.FC<{ f: number; y: number; amp?: number }> = ({ f, y, amp = 20 }) => (
  <g>
    {GRASS.map((g, i) => {
      const s = Math.sin(f / 12 + g.ph) * amp + Math.sin(f / 5.3 + g.ph * 2) * amp * 0.25;
      return <path key={i} d={`M${g.x - 9} ${y} Q${g.x + s * 0.4} ${y - g.h * 0.55} ${g.x + s} ${y - g.h} Q${g.x + s * 0.3} ${y - g.h * 0.5} ${g.x + 9} ${y} Z`} fill={g.c === 0 ? N.near : g.c === 1 ? mixHex(N.mid, N.near, 0.3) : mixHex(N.mid, N.light, 0.15)} />;
    })}
  </g>
);

const Ladder: React.FC<{ top?: number; labels?: boolean; dim?: number }> = ({ top = LADDER_TOP, labels = true, dim = 0 }) => (
  <g>
    <path d={`M${LX0} ${GROUND} L${LX1} ${GROUND} L${LX1 + 300} ${GROUND + 60} L${LX0 + 200} ${GROUND + 60} Z`} fill={N.shadow} opacity={0.18} />
    {[LX0, LX1].map((x) => (
      <g key={x}>
        <rect x={x - 11} y={top} width={22} height={GROUND - top} fill="#FFF4DE" />
        <rect x={x + 5} y={top} width={6} height={GROUND - top} fill={L13_COLORS.landShade} />
      </g>
    ))}
    {Array.from({ length: 10 }, (_, i) => {
      const v = i * 20; // #9
      const y = rungY(v);
      if (y < top) return null;
      return (
        <g key={v} opacity={1 - dim}>
          <rect x={LX0 - 4} y={y - 9} width={LX1 - LX0 + 8} height={18} rx={5} fill={SAF} />
          {labels ? (
            <text x={LX0 - 30} y={y + 14} textAnchor="end" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 40, fill: N.text }}>
              {v}
            </text>
          ) : null}
        </g>
      );
    })}
  </g>
);

const Meadow: React.FC<{ f: number; children?: React.ReactNode; hud?: React.ReactNode; seed?: number; ladder?: boolean; grassAmp?: number; high?: boolean }> = ({ f, children, hud, seed = 1, ladder = true, grassAmp = 20, high = false }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={N} />
    </Layer>
    <Layer depth={0.1}>
      <Bloom x={260} y={130} r={380} color={N.light} core={44} coreColor="#FFFBE6" strength={0.9} />
    </Layer>
    <Layer depth={0.3}>
      <CloudRack f={f} n={5} x0={-700} x1={2700} y0={170} y1={440} size={120} speed={2} body="#FFFFFF" under="#B9DDE8" top="#FFFFFF" seed={seed} />
      <Flock frame={f} x={-200 + ((f * 1.8) % 2400)} y={300} vx={0} n={5} size={12} color={alpha(N.shadow, 0.6)} seed={seed + 2} />
    </Layer>
    <Layer depth={0.6}>
      <path d={`M-1400 ${GROUND - 40} Q -300 ${GROUND - 260} 500 ${GROUND - 150} Q 1300 ${GROUND - 40} 2000 ${GROUND - 210} Q 2800 ${GROUND - 300} 3400 ${GROUND - 120} L3400 2400 L-1400 2400 Z`} fill={N.far} />
      <HazeBand y={GROUND - 220} h={220} color={N.haze} strength={0.5} x={-1400} w={4800} />
    </Layer>
    {high ? (
      <Layer depth={1.05}>
        {/* clouds at every height, for the tilt-up: they fall past the climbing camera */}
        <CloudRack f={f} n={7} x0={-900} x1={2900} y0={-1300} y1={300} size={140} speed={1.2} body="#FFFFFF" under="#B9DDE8" top="#FFFFFF" seed={seed + 7} />
      </Layer>
    ) : null}
    <Layer depth={1}>
      <path d={`M-1400 ${GROUND + 10} Q 0 ${GROUND - 30} 1200 ${GROUND} Q 2200 ${GROUND + 20} 3400 ${GROUND - 20} L3400 2400 L-1400 2400 Z`} fill={N.mid} />
      {ladder ? <Ladder /> : null}
      {children}
    </Layer>
    <Layer depth={1.12}>
      <Grass f={f} y={GROUND + 120} amp={grassAmp} />
    </Layer>
    {hud ? <Layer depth={0}>{hud}</Layer> : null}
  </>
);

const Gauge: React.FC<{ v: number; f: number }> = ({ v, f }) => (
  <L13Gauge family={N} value={v} frame={f} ceiling={CEILING} labelled={false} readout={v > 130 ? false : undefined} marks={EVERYDAY_MARKS.filter((m) => v >= m.v - 0.5)} />
);

/** Tick on the ladder (climbing: arms up on the rails), feet at y. */
const Climber: React.FC<{ f: number; y: number; ppm: number; climbing: boolean; expression?: "determined" | "happy" | "surprised" | "worried"; x?: number }> = ({ f, y, ppm, climbing, expression = "determined", x = LXC - 10 }) => (
  <Tick x={x} y={y - (climbing ? Math.abs(Math.sin(f / 5)) * 8 : 0)} pxPerM={ppm} frame={f} facing={1} pose={climbing ? "heave" : "stand"} expression={expression} look={0.4} headTilt={climbing ? -10 : 0} />
);

/** An isometric cube (x, y = bottom-front corner). */
const Cube: React.FC<{ x: number; y: number; s: number; c: string; rot?: number }> = ({ x, y, s, c, rot = 0 }) => {
  const ix = s * 0.866;
  const iy = s * 0.5;
  const lit = mixHex(c, N.light, 0.4);
  const sh = mixHex(c, N.shadow, 0.35);
  return (
    <g transform={rot ? `rotate(${rot} ${x} ${y - s * 0.6})` : undefined}>
      <path d={`M${x} ${y - s} L${x + ix} ${y - s + iy} L${x} ${y - s + 2 * iy} L${x - ix} ${y - s + iy} Z`} transform={`translate(0 ${-iy})`} fill={lit} />
      <path d={`M${x - ix} ${y - s + iy} L${x} ${y - s + 2 * iy} L${x} ${y + iy} L${x - ix} ${y} Z`} transform={`translate(0 ${-iy})`} fill={c} />
      <path d={`M${x} ${y - s + 2 * iy} L${x + ix} ${y - s + iy} L${x + ix} ${y} L${x} ${y + iy} Z`} transform={`translate(0 ${-iy})`} fill={sh} />
    </g>
  );
};
const CUBE_C = L13_COLORS.saffron;

// ---------------------------------------------------------------------------------------------
// 2-01 · the meadow hillside; the ladder stands up into the sky; "The Decibel".
const ShotMeadow: ShotFC<CL02> = ({ f, len }) => (
  <Stage theme={N.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.03, panY: 0.01, frames: len + 60, seed: 1 }} vignette={0.08} grain={0.5}>
    <Meadow
      f={f}
      hud={
        <g>
          <g opacity={ramp(f, 6, 20)}>
            <Headline x={1000} y={300} lines={["The Decibel"]} size={104} color={N.text} accent={L13_COLORS.vermilion} />
          </g>
          <Gauge v={0} f={f} />
        </g>
      }
    />
  </Stage>
);

// 2-02 · Tick climbs one 20-dB step; beside it a wave on a line jumps to ten times its height.
const ShotClimb20: ShotFC<CL02> = ({ f, len }) => {
  const k = smooth(ramp(f, 6, 40));
  const ty = rungY(0) + 20 - k * 140;
  const cam = cameraAt(f, [
    { f: 0, x: 1000, y: 760, zoom: 1.55 },
    { f: 44, x: 1010, y: 650, zoom: 1.6 },
    { f: len + 30, x: 1015, y: 640, zoom: 1.66 },
  ]);
  const amp = 8 + 72 * k; // ×10 the pressure (#9)
  return (
    <Pop f={f}>
      <Stage theme={N.theme} cam={cam} vignette={0.08} grain={0.5}>
        <Meadow
          f={f + 100}
          seed={2}
          hud={
            <g>
              <Tag x={120} y={150} text="+20 dB = 10× THE PRESSURE" /* #9 */ dot={L13_COLORS.vermilion} size={26} />
              <Gauge v={20 * k} f={f} />
            </g>
          }
        >
          <PressureWave f={f} y={ty - 140} x0={900} x1={1420} amp={amp} wavelength={170} speed={5} color="#1F8F8A" core="#E6F5EA" width={5} lineColor={alpha(N.text, 0.4)} />
          <Climber f={f} y={ty} ppm={110} climbing={k < 0.98} />
        </Meadow>
      </Stage>
    </Pop>
  );
};

// 2-03 · energy cubes: one cube becomes ten, dropping in with impacts.
const ShotCubes: ShotFC<CL02> = ({ f, len }) => {
  const s = 64;
  const base = 760;
  return (
    <Pop f={f}>
      <Stage theme={N.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.01, frames: len + 60, seed: 3 }} vignette={0.08} grain={0.5}>
        <Meadow
          f={f + 200}
          seed={3}
          hud={
            <g>
              <Tag x={120} y={150} text="+10 dB = 10× THE ENERGY" /* #9 */ dot={SAF} size={26} />
              <Gauge v={20} f={f} />
            </g>
          }
        >
          <Climber f={f} y={rungY(20) + 20} ppm={110} climbing={false} expression="happy" />
          <Cube x={1000} y={base} s={s} c={CUBE_C} />
          <path d={`M1080 ${base - 40} L1160 ${base - 40}`} stroke={N.text} strokeWidth={6} strokeLinecap="round" />
          <path d={`M1150 ${base - 52} L1166 ${base - 40} L1150 ${base - 28}`} stroke={N.text} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {Array.from({ length: 10 }, (_, i) => {
            const at = 8 + i * 5;
            if (f < at) return null;
            const col = i % 5;
            const row = Math.floor(i / 5);
            const x = 1260 + col * s * 0.9;
            const y = base - row * s * 1.0;
            const fall = (1 - ramp(f, at, at + 7)) * -260;
            const sq = impact(f, at + 7, 0.2, 8);
            return (
              <g key={i} transform={`translate(${x} ${y + fall}) scale(${sq.sx} ${sq.sy}) translate(${-x} ${-y})`}>
                <Cube x={x} y={y} s={s * 0.86} c={CUBE_C} />
              </g>
            );
          })}
        </Meadow>
      </Stage>
    </Pop>
  );
};

// 2-04 · the bottom rung, close: a lens shows the hair-wave scrolling; Tick taps the rung, then listens.
const ShotZero: ShotFC<CL02> = ({ f, len }) => {
  const tap = Math.max(0, (f - 10) / 14);
  const lis = Math.max(0, (f - Math.round(len * 0.45)) / 14);
  const cam = { x: 860 - f * 0.25, y: 760, zoom: 2.0 + f * 0.0015 };
  const at0: [number, number] = [960 + (LXC - cam.x) * cam.zoom, 540 + (rungY(0) - cam.y) * cam.zoom];
  return (
    <Pop f={f}>
      <Stage theme={N.theme} cam={cam} vignette={0.1} grain={0.5}>
        <Meadow
          f={f + 300}
          seed={4}
          grassAmp={14}
          hud={
            <g>
              <Metric x={120} y={190} value="0" unit="dB" /* #9 #10 */ size={96} color={N.text} />
              <Tag x={120} y={252} text="20 µPa · THE SCALE'S ZERO" /* #9, F17 */ dot={L13_COLORS.vermilion} size={24} />
              <Inset cx={1300} cy={560} r={210} at={at0} scale={9} family={N}>
                <PressureWave f={f} y={at0[1]} x0={at0[0] - 60} x1={at0[0] + 60} amp={0.7} wavelength={26} speed={1} width={0.7} glow={false} color="#1F8F8A" line={false} />
              </Inset>
            </g>
          }
        >
          <GroundShadow x={600} y={GROUND + 3} rx={50} color={N.shadow} opacity={0.3} blur={8} />
          <Tick x={590} y={GROUND} pxPerM={120} frame={f} facing={1} pose={lis > 0 ? "point" : "stand"} poseTo={lis > 0 ? "listen" : "point"} poseT={lis > 0 ? Math.min(1.6, lis) : Math.min(1.6, tap)} expression="thinking" look={0.6} headTilt={lis > 0 ? 8 : -4} />
        </Meadow>
      </Stage>
    </Pop>
  );
};

// 2-05 … 2-09 · one tilt up the everyday rungs (#10, A-weighted, F6): leaves blow off a branch at 20; crickets ring at
// 40; two Ticks talk at 60; a storm rolls in at 100; a jet crosses at 120.
const RUNG_SHELF = (v: number) => (
  <path d={`M${LX1 + 10} ${rungY(v) + 12} L1760 ${rungY(v) + 12} Q 1790 ${rungY(v) + 34} 1740 ${rungY(v) + 40} L${LX1 + 10} ${rungY(v) + 40} Z`} fill={N.mid} stroke={N.near} strokeWidth={3} />
);
const STOPS = [
  { v: DB.leaves, label: "LEAVES · 20" },
  { v: DB.crickets, label: "CRICKETS AT 5 m · 40" },
  { v: DB.talk, label: "TALK AT 5 m · 60" },
  { v: DB.thunder, label: "THUNDER · 100" },
  { v: DB.jet, label: "MILITARY JET AT 100 m · 120" },
];
const ShotRungs: ShotFC<CL02> = ({ f, len, c }) => {
  const cuts = [0, c.crickets - c.leaves, c.talk - c.leaves, c.thunder - c.leaves, c.jet - c.leaves];
  const ys = STOPS.map((s) => rungY(s.v) - 30);
  const keys = [{ f: 0, x: 1180, y: ys[0], zoom: 1.32 }];
  for (let i = 1; i < 5; i++) {
    keys.push({ f: cuts[i], x: 1180, y: ys[i - 1], zoom: 1.32 });
    keys.push({ f: cuts[i] + 22, x: 1180, y: ys[i], zoom: 1.32 });
  }
  keys.push({ f: len + 20, x: 1190, y: ys[4] - 20, zoom: 1.38 });
  const cam = cameraAt(f, keys);
  let stop = 0;
  for (let i = 0; i < 5; i++) if (f >= cuts[i]) stop = i;
  const v = STOPS[stop].v * ramp(f, cuts[stop], cuts[stop] + 18) + (stop > 0 ? STOPS[stop - 1].v : 0) * (1 - ramp(f, cuts[stop], cuts[stop] + 18));
  const tagA = ramp(f, cuts[stop] + 10, cuts[stop] + 22);
  // the storm and the jet
  const th = f - cuts[3];
  const stormX = 1950 - Math.max(0, th + 30) * 3.2;
  const jx = -300 + Math.max(0, f - cuts[4] - 4) * 26;
  const ty20 = rungY(20);
  return (
    <Stage theme={N.theme} cam={cam} vignette={0.08} grain={0.5}>
      <Meadow
        f={f + 400}
        seed={5}
        hud={
          <g>
            <KickerRaw x={120} y={150} text="EVERYDAY LEVELS (dBA)" /* #10, F6 */ color={N.text} size={26} />
            <g opacity={tagA}>
              <Tag x={120} y={212} text={STOPS[stop].label} /* #10 */ dot={L13_COLORS.vermilion} size={26} />
            </g>
            <Gauge v={v} f={f} />
            {th > 10 ? <rect x={0} y={0} width={1920} height={1080} fill="#FFFFFF" opacity={flash(th, 12, 8, 0.55) + flash(th, 40, 6, 0.3)} /> : null}
          </g>
        }
      >
        {[20, 40, 60, 100, 120].map((r) => (
          <g key={r}>{RUNG_SHELF(r)}</g>
        ))}
        {/* 20 · a branch swings in, leaves blow off across the frame (40 px leaves, ~5 px/f) */}
        <g transform={`rotate(${Math.sin(f / 14) * 6} 1800 ${ty20 - 160})`}>
          <path d={`M1820 ${ty20 - 170} Q 1500 ${ty20 - 150} 1240 ${ty20 - 90}`} stroke="#6B4428" strokeWidth={16} fill="none" strokeLinecap="round" />
          {Array.from({ length: 7 }, (_, i) => (
            <ellipse key={i} cx={1300 + i * 70} cy={ty20 - 110 - (i % 2) * 24} rx={30} ry={16} fill={i % 2 ? N.near : mixHex(N.mid, "#E8C14A", 0.3)} transform={`rotate(${-20 + i * 9} ${1300 + i * 70} ${ty20 - 110})`} />
          ))}
        </g>
        {Array.from({ length: 9 }, (_, i) => {
          const life = 150;
          const age = (f + rnd(i) * life) % life;
          const x = 1500 - age * (4.5 + rnd(i * 3) * 2);
          const y = ty20 - 120 + age * 0.9 + Math.sin(age / 9 + i) * 26;
          return <ellipse key={i} cx={x} cy={y} rx={22} ry={12} fill={i % 2 ? "#E8A13A" : N.near} transform={`rotate(${age * 4 + i * 30} ${x} ${y})`} opacity={Math.min(1, age / 10)} />;
        })}
        {/* 40 · crickets on a grass blade, legs bowing, rings pulsing from each */}
        {[1060, 1380].map((x, i) => {
          const y = rungY(40) + 10;
          const bob = Math.sin(f / 4 + i) * 6;
          return (
            <g key={x}>
              <path d={`M${x - 80} ${y} Q ${x} ${y - 40 + bob} ${x + 90} ${y - 70 + bob}`} stroke={N.near} strokeWidth={8} fill="none" strokeLinecap="round" />
              <ellipse cx={x + 10} cy={y - 50 + bob} rx={30} ry={12} fill="#3E6B2E" />
              <path d={`M${x - 10} ${y - 54 + bob} L${x - 40} ${y - 80 + bob + Math.sin(f / 1.5 + i) * 6}`} stroke="#2F4F22" strokeWidth={4} />
              <Rings f={f} cx={x + 10} cy={y - 50 + bob} period={16} speed={3.4} maxR={90} width={4} color={L13_COLORS.vermilion} start={i * 7} glow={false} />
            </g>
          );
        })}
        {/* 60 · two Ticks talking 5 m apart, speech rings crossing between them */}
        <g>
          <Tick x={1020} y={rungY(60) + 12} pxPerM={90} frame={f} facing={1} pose={Math.sin(f / 10) > 0 ? "wave" : "point"} expression="happy" />
          <Tick x={1560} y={rungY(60) + 12} pxPerM={90} frame={f} facing={-1} pose={Math.sin(f / 10) > 0 ? "point" : "shrug"} expression="happy" color="#5F7A84" seed={4} />
          <Rings f={f} cx={1080} cy={rungY(60) - 120} period={22} speed={6} maxR={420} width={4} color="#1F8F8A" arc={[-40, 40]} glow={false} />
          <Rings f={f} cx={1500} cy={rungY(60) - 120} period={22} speed={6} maxR={420} width={4} color={L13_COLORS.vermilion} arc={[140, 220]} start={11} glow={false} />
        </g>
        {/* 100 · the storm cloud rolls in (~3 px/f, 40 % of the frame), rain streaks, a flash */}
        <g transform={`translate(${stormX - 1950} 0)`}>
          <ellipse cx={1900} cy={rungY(100) - 150} rx={420} ry={110} fill="#4F6170" />
          <ellipse cx={1760} cy={rungY(100) - 210} rx={220} ry={110} fill="#5D7080" />
          <ellipse cx={2040} cy={rungY(100) - 220} rx={240} ry={120} fill="#56697A" />
          <ellipse cx={1900} cy={rungY(100) - 100} rx={400} ry={40} fill="#3D4D5B" />
          {Array.from({ length: 22 }, (_, i) => {
            const x = 1540 + i * 34 + rnd(i) * 20;
            const y0 = rungY(100) - 80 + ((f * 22 + rnd(i * 3) * 200) % 200);
            return <line key={i} x1={x} y1={y0} x2={x - 10} y2={y0 + 50} stroke="#9FC3D6" strokeWidth={4} strokeLinecap="round" opacity={0.8} />;
          })}
          {th > 10 && th < 18 ? <path d={`M1880 ${rungY(100) - 110} L1840 ${rungY(100) - 30} L1876 ${rungY(100) - 34} L1830 ${rungY(100) + 50}`} stroke="#FFF6B0" strokeWidth={8} fill="none" strokeLinejoin="round" /> : null}
        </g>
        {/* 120 · a military jet crosses at ~26 px/f, its contrail growing */}
        {f > cuts[4] ? (
          <g>
            <path d={`M-400 ${rungY(120) - 120} L${jx - 70} ${rungY(120) - 120}`} stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" opacity={0.75} />
            <path d={`M${jx} ${rungY(120) - 120} l -40 -10 l -60 -40 l -22 0 l 30 44 l -60 4 l -22 -22 l -16 0 l 10 30 l -10 30 l 16 0 l 22 -22 l 60 4 l -30 44 l 22 0 l 60 -40 Z`} fill="#3D4D5B" />
          </g>
        ) : null}
        <Climber f={f} y={rungY(STOPS[stop].v) + 20} ppm={100} climbing={f - cuts[stop] < 20} expression={stop === 3 ? "surprised" : "happy"} />
      </Meadow>
    </Stage>
  );
};

// 2-10 · rung 126: a cannon on a far hill fires; the smoke balloons; a ring front crosses to Tick, who braces.
const ShotCannon: ShotFC<CL02> = ({ f, len }) => {
  const fire = 10;
  const mz: [number, number] = [1430, 560];
  const arrive = fire + 4 + Math.round((mz[0] - 420) / 22);
  const shake = f >= arrive && f < arrive + 14 ? Math.sin((f - arrive) * 2.6) * (1 - (f - arrive) / 14) * 11 : 0;
  const smoke = ramp(f, fire, fire + 34);
  const brace = Math.max(0, (f - arrive + 8) / 10);
  return (
    <Pop f={f}>
      <Stage theme={N.theme} cam={{ x: 960 + shake, y: 540 + shake * 0.5, zoom: 1.0 + f * 0.0006 }} vignette={0.08} grain={0.5}>
        <Meadow
          f={f + 500}
          seed={6}
          ladder={false}
          hud={
            <g>
              <Tag x={120} y={150} text="CANNON AT 150 m · 126" /* #10 */ dot={L13_COLORS.vermilion} size={26} />
              <Gauge v={DB.cannon} f={f} />
            </g>
          }
        >
          {/* far hill with the cannon */}
          <path d={`M1100 ${GROUND} Q 1300 ${mz[1] + 30} 1500 ${mz[1] + 50} Q 1700 ${mz[1] + 60} 1900 ${GROUND} Z`} fill={mixHex(N.mid, N.far, 0.4)} />
          <Cannon x={1360} y={mz[1] + 56} s={34} family={N} facing={-1} recoil={f >= fire ? Math.exp(-(f - fire) / 8) : 0} flash={f >= fire ? Math.max(0, 1 - (f - fire) / 8) : 0} />
          {smoke > 0
            ? Array.from({ length: 8 }, (_, i) => {
                const a = rnd(i) * 6.28;
                const r = 30 + 120 * smoke * (0.6 + rnd(i * 3) * 0.6);
                const cx = mz[0] - 120 * smoke - 60 + Math.cos(a) * r * 0.7 - (f - fire) * 0.6;
                const cy = mz[1] - 40 - 90 * smoke + Math.sin(a) * r * 0.5;
                return <circle key={i} cx={cx} cy={cy} r={r * 0.8} fill={i % 2 ? "#EEF2F0" : "#D7DFDD"} opacity={0.92 - 0.3 * ramp(f, fire + 40, len)} />;
              })
            : null}
          <Rings f={f} cx={mz[0] - 60} cy={mz[1]} period={999} speed={22} maxR={1800} width={8} start={fire + 4} count={1} />
          {/* the ladder's top at the left, Tick holding on */}
          <g transform="translate(-380 0)">
            {[LX0, LX1].map((x) => (
              <rect key={x} x={x - 11} y={-200} width={22} height={GROUND + 200} fill="#FFF4DE" />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={LX0 - 4} y={GROUND - 20 - i * 140} width={LX1 - LX0 + 8} height={18} rx={5} fill={SAF} />
            ))}
          </g>
          <Tick x={LXC - 380} y={GROUND - 300} pxPerM={130} frame={f} facing={1} pose="heave" poseTo="shield" poseT={Math.min(1.6, brace)} expression="happy" expressionTo="surprised" expressionT={ramp(f, arrive - 4, arrive + 2)} look={0.8} tilt={f > arrive ? -6 * Math.exp(-(f - arrive) / 12) : 0} />
        </Meadow>
      </Stage>
    </Pop>
  );
};

// 2-11 · pull back to the whole ladder; a bracket draws from 60 to 120 (+60 dB).
const ShotPullBack: ShotFC<CL02> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1100, y: rungY(110), zoom: 1.4 },
    { f: Math.min(50, len - 10), x: 1000, y: rungY(80), zoom: 0.72 },
    { f: len + 30, x: 990, y: rungY(82), zoom: 0.68 },
  ]);
  const y60 = rungY(60);
  const y120 = rungY(120);
  const draw = Math.min(1, Math.max(0, (f - 26) / 42)); // ~10 px/f
  const yy = y60 + (y120 - y60) * draw;
  return (
    <Stage theme={N.theme} cam={cam} vignette={0.08} grain={0.5}>
      <Meadow
        f={f + 600}
        seed={7}
        hud={
          <g>
            <KickerRaw x={120} y={150} text="60 → 120: +60 dB" /* #9 */ color={N.text} size={28} />
            <Gauge v={DB.jet} f={f} />
          </g>
        }
      >
        {draw > 0 ? (
          <g>
            <path d={`M560 ${y60} L520 ${y60} L520 ${yy}`} stroke={L13_COLORS.vermilion} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {draw >= 1 ? <path d={`M520 ${y120} L560 ${y120}`} stroke={L13_COLORS.vermilion} strokeWidth={10} strokeLinecap="round" /> : null}
            <circle cx={520} cy={yy} r={14} fill={L13_COLORS.vermilion} />
          </g>
        ) : null}
        <Tick x={LXC - 10} y={rungY(120) + 20} pxPerM={100} frame={f} facing={-1} pose="hips" expression="happy" look={0.6} />
      </Meadow>
    </Stage>
  );
};

// 2-12 · the wave at 60 beside the wave at 120: the bigger one grows ×1,000 and bursts off the top and bottom.
const ShotWaves: ShotFC<CL02> = ({ f, len }) => {
  const g = Math.min(1000, Math.pow(10, Math.max(0, f - 8) / 18)); // a decade every 18 frames, to ×1,000 (#9)
  return (
    <Pop f={f}>
      <Stage theme={N.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.02, panY: 0.0, frames: len + 60, seed: 8 }} vignette={0.08} grain={0.5}>
        <Meadow
          f={f + 700}
          seed={8}
          ladder={false}
          hud={
            <g>
              <Metric x={120} y={190} value="×1,000" unit="pressure" /* #9 */ size={92} color={N.text} />
              <Gauge v={DB.jet} f={f} />
            </g>
          }
        >
          <rect x={140} y={300} width={1440} height={560} rx={30} fill={alpha(N.light, 0.55)} />
          <PressureWave f={f} y={580} x0={180} x1={820} amp={0.6 * 10} wavelength={120} speed={4} color="#1F8F8A" core="#E6F5EA" width={5} lineColor={alpha(N.text, 0.4)} />
          <PressureWave f={f} y={580} x0={900} x1={1540} amp={6 * g * 0.06 + 6} wavelength={120 + Math.min(200, g * 0.2)} speed={6} color={L13_COLORS.vermilion} core="#FFE1D6" width={6} lineColor={alpha(N.text, 0.4)} />
          <Tag x={500} y={820} text="60 dB" /* #10 */ dot="#1F8F8A" size={24} align="middle" />
          <Tag x={1220} y={820} text="120 dB" /* #10 */ dot={L13_COLORS.vermilion} size={24} align="middle" />
        </Meadow>
      </Stage>
    </Pop>
  );
};

// 2-13 · one cube becomes a field of a million that pours down the hill toward Tick; zoom out; Tick backs away.
const FIELD = Array.from({ length: 34 * 15 }, (_, i) => ({ c: i % 34, r: Math.floor(i / 34), j: rnd(i * 3) }));
const ShotCubeField: ShotFC<CL02> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 520, y: 420, zoom: 2.2 },
    { f: Math.round(len * 0.7), x: 960, y: 560, zoom: 1.0 },
    { f: len + 30, x: 960, y: 570, zoom: 0.95 },
  ]);
  const front = Math.max(0, f - 6) * 22; // the pour front (px along the slope)
  const s = 34;
  const tx = 1640 - ramp(f, 30, len) * -200;
  return (
    <Pop f={f}>
      <Stage theme={N.theme} cam={cam} vignette={0.08} grain={0.5}>
        <Meadow
          f={f + 800}
          seed={9}
          ladder={false}
          hud={
            <g>
              <Metric x={120} y={190} value="×1,000,000" unit="energy" /* #9 */ size={88} color={N.text} />
              <Gauge v={DB.jet} f={f} />
            </g>
          }
        >
          {/* the slope */}
          <path d={`M-300 300 L1500 860 L1500 ${GROUND + 40} L-300 ${GROUND + 40} Z`} fill={mixHex(N.mid, N.far, 0.2)} />
          <Cube x={460} y={380} s={44} c={CUBE_C} />
          {FIELD.map((q, i) => {
            const d = q.c * s * 1.2 + q.r * 14;
            if (d > front) return null;
            const x = -200 + q.c * s * 1.05 + q.r * 8;
            const slopeY = 300 + ((x + 300) / 1800) * 560;
            const y = slopeY + q.r * s * 0.55 + 30;
            const land = Math.min(1, (front - d) / 60);
            const fall = (1 - land) * -80;
            return <Cube key={i} x={x} y={y + fall} s={s} c={q.j > 0.7 ? mixHex(CUBE_C, "#FFF", 0.25) : q.j < 0.2 ? L13_COLORS.saffronDeep : CUBE_C} rot={(1 - land) * 40} />;
          })}
          <GroundShadow x={tx + 6} y={GROUND + 3} rx={50} color={N.shadow} opacity={0.3} blur={8} />
          <Tick x={tx} y={GROUND} pxPerM={120} frame={f} facing={-1} walk={f > 30 ? walkPhase(f, 16) : undefined} pose="stand" poseTo="shield" poseT={Math.min(1.4, Math.max(0, (f - 20) / 14))} expression="surprised" look={0.9} />
        </Meadow>
      </Stage>
    </Pop>
  );
};

// 2-14 · "The thing it measures is not": Tick (large) looks at the neat ladder, then at the cube mountain: double take.
const ShotDoubleTake: ShotFC<CL02> = ({ f, len }) => {
  const look = f < 16 ? 1 : f < 26 ? -1 : f < 34 ? 1 : -1;
  const snap = f >= 34 ? impact(f, 34, 0.12, 10) : { sx: 1, sy: 1 };
  return (
    <Pop f={f}>
      <Stage theme={N.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.01, frames: len + 60, seed: 10 }} vignette={0.08} grain={0.5}>
        <Meadow f={f + 900} seed={10} ladder={false} grassAmp={24}>
          {/* the cube mountain at left, cubes still tumbling down its face */}
          <path d={`M-200 ${GROUND} L180 280 L560 ${GROUND} Z`} fill={L13_COLORS.saffronDeep} />
          {Array.from({ length: 60 }, (_, i) => {
            const x = -120 + (i % 10) * 64 + (Math.floor(i / 10) % 2) * 32;
            const y = GROUND - Math.floor(i / 10) * 70 - 20;
            const inside = Math.abs(x - 180) < (GROUND - y) * 0.6;
            return inside ? <Cube key={i} x={x} y={y} s={48} c={i % 4 ? CUBE_C : mixHex(CUBE_C, "#FFF", 0.25)} /> : null;
          })}
          {Array.from({ length: 6 }, (_, i) => {
            const life = 70;
            const age = (f + i * 12) % life;
            const side = i % 2 ? 1 : -1;
            const x = 180 + side * age * 5;
            const y = 280 + age * 8.4;
            return <Cube key={`t${i}`} x={x} y={Math.min(GROUND, y)} s={44} c={CUBE_C} rot={age * 9 * side} />;
          })}
          {/* the neat ladder at right */}
          <g transform="translate(900 0)">
            <Ladder labels={false} />
          </g>
          <Tick x={1080} y={1150} pxPerM={420} frame={f} facing={1} pose="stand" poseTo="shrug" poseT={f > 34 ? Math.min(1.5, (f - 34) / 14) : 0} expression="thinking" expressionTo="worried" expressionT={ramp(f, 24, 34)} look={look} headTilt={look < 0 ? 6 : -4} squash={snap} />
        </Meadow>
      </Stage>
    </Pop>
  );
};

// 2-15 · the camera climbs past 140, 160, 180; the props are gone; clouds fall past the tilting camera.
const ShotClimbHigh: ShotFC<CL02> = ({ f, len }) => {
  const y0 = rungY(120);
  const y1 = rungY(176);
  const cy = y0 + (y1 - y0) * Math.min(1, f / Math.max(1, len));
  const v = 126 + 50 * Math.min(1, f / Math.max(1, len));
  return (
    <Stage theme={N.theme} cam={{ x: 980, y: cy, zoom: 1.25 }} vignette={0.08} grain={0.5}>
      <Meadow f={f + 1000} seed={11} high hud={<Gauge v={v} f={f} />}>
        <Climber f={f} y={cy + 160} ppm={100} climbing />
      </Meadow>
    </Stage>
  );
};

// 2-16 · a saffron line (no number yet, F1) hangs above the top rung; Tick's head bumps it; a ring spreads along the
// line from the bump; Tick rubs its head; the camera plunges into the line (zoom-through to l03's wave field).
const ShotBump: ShotFC<CL02> = ({ f, len }) => {
  const bumpAt = 30;
  const ppm = 100;
  const headUp = ppm * 1.62;
  const feet = Math.max(CEIL_Y + headUp + 2, rungY(150) + 20 - f * 5.5);
  const bumped = f >= bumpAt;
  const sq = impact(f, bumpAt, 0.18, 10);
  const zin = ramp(f, len - 14, len);
  const bx = LXC + 6;
  const cam = { x: 900 + (bx - 900) * zin, y: CEIL_Y + 170 + (CEIL_Y - CEIL_Y - 170) * zin, zoom: 1.55 * (1 + zin * zin * 6) };
  const age = f - bumpAt;
  return (
    <Pop f={f}>
      <Stage theme={N.theme} cam={cam} vignette={0.08} grain={0.5}>
        <Meadow f={f + 1100} seed={12} high hud={<Gauge v={190} f={f} />}>
          <LadderTopGlow />
          <Emissive d={`M-600 ${CEIL_Y} L2600 ${CEIL_Y}`} color={SAF} core={L13_COLORS.saffronCore} width={bumped && age < 20 ? 10 : 6} glow={16} strength={1.1} />
          {bumped
            ? [-1, 1].map((d) => (
                <g key={d}>
                  {[0, 14].map((o) =>
                    age - o > 0 ? <ellipse key={o} cx={bx + d * (age - o) * 12} cy={CEIL_Y} rx={34} ry={14 - Math.min(10, (age - o) * 0.2)} fill={L13_COLORS.saffronCore} opacity={Math.max(0, 1 - (age - o) / 70)} /> : null,
                  )}
                </g>
              ))
            : null}
          <Tick x={LXC - 10} y={feet} pxPerM={ppm} frame={f} facing={1} pose={bumped ? "heave" : "heave"} poseTo={bumped ? "wipe-brow" : undefined} poseT={bumped ? Math.min(1.6, (f - bumpAt - 4) / 14) : 0} expression={bumped ? "surprised" : "determined"} squash={sq} look={0.3} headTilt={bumped ? 8 : -12} />
        </Meadow>
      </Stage>
    </Pop>
  );
};
const LadderTopGlow: React.FC = () => <rect x={LX0 - 14} y={LADDER_TOP - 4} width={LX1 - LX0 + 28} height={8} rx={4} fill={L13_COLORS.landShade} />;

// ---------------------------------------------------------------------------------------------

export const SceneL02: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL02(t);
  const shots: ShotDef<CL02>[] = [
    { from: 0, S: ShotMeadow, id: "2-01" },
    { from: c.climb, S: ShotClimb20, id: "2-02" },
    { from: c.cubes, S: ShotCubes, id: "2-03" },
    { from: c.zero, S: ShotZero, id: "2-04" },
    { from: c.leaves, S: ShotRungs, id: "2-05" },
    { from: c.cannon, S: ShotCannon, id: "2-10" },
    { from: c.trick, S: ShotPullBack, id: "2-11" },
    { from: c.thousand, S: ShotWaves, id: "2-12" },
    { from: c.million, S: ShotCubeField, id: "2-13" },
    { from: c.notPolite, S: ShotDoubleTake, id: "2-14" },
    { from: c.climbHigh, S: ShotClimbHigh, id: "2-15" },
    { from: c.bump, S: ShotBump, id: "2-16" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL02 = (t: SceneTiming): Cue[] => {
  const c = cuesL02(t);
  const bumpLen = c.end - c.bump;
  return [
    { at: 0, file: SFX.wind, vol: 0.12, dur: c.climb + 10, fadeIn: 20, fadeOut: 20 },
    ...cutHit(c.climb),
    { at: c.climb + 40, file: SFX.pop, vol: 0.18, dur: 20 },
    ...cutHit(c.cubes),
    ...Array.from({ length: 10 }, (_, i) => ({ at: c.cubes + 15 + i * 5, file: SFX.pop, vol: 0.1, dur: 12 })),
    ...cutHit(c.zero),
    { at: c.zero + 20, file: SFX.click, vol: 0.14, dur: 10 },
    ...cutHit(c.leaves),
    { at: c.leaves + 4, file: SFX.swirl, vol: 0.1, dur: 40 },
    ...[0, 1, 2].map((i) => ({ at: c.crickets + 6 + i * 9, file: SFX.click, vol: 0.08, dur: 8 })),
    { at: c.talk + 8, file: SFX.pop, vol: 0.14, dur: 16 },
    { at: c.thunder, file: SFX.rumble, vol: 0.2, dur: 60, fadeIn: 10, fadeOut: 20 },
    { at: c.thunder + 12, file: SFX.boom, vol: 0.16, dur: 80, fadeOut: 30 },
    { at: c.jet + 2, file: SFX.whoosh, vol: 0.26, dur: 70, fadeOut: 20 },
    ...cutHit(c.cannon),
    { at: c.cannon + 10, file: SFX.boom, vol: 0.3, dur: 110, fadeOut: 40 },
    ...cutHit(c.trick),
    { at: c.trick + 26, file: SFX.riser, vol: 0.12, dur: 44, fadeOut: 10 },
    ...cutHit(c.thousand),
    { at: c.thousand + 8, file: SFX.swirl, vol: 0.16, dur: 50 },
    { at: c.thousand + 62, file: SFX.pop, vol: 0.2, dur: 20 },
    ...cutHit(c.million),
    { at: c.million + 8, file: SFX.debris, vol: 0.16, dur: 80, fadeOut: 30 },
    ...cutHit(c.notPolite),
    { at: c.notPolite + 34, file: SFX.pop, vol: 0.2, dur: 20 },
    ...cutHit(c.climbHigh),
    { at: c.climbHigh, file: SFX.riser, vol: 0.14, dur: c.bump - c.climbHigh, fadeIn: 10, fadeOut: 10 },
    ...cutHit(c.bump),
    { at: c.bump + 30, file: SFX.popLong, vol: 0.26, dur: 30 },
    { at: c.bump + bumpLen - 16, file: SFX.deepWhoosh, vol: 0.26, dur: 50 },
  ];
};
