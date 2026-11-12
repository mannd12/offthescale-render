// L13 scene l06 "The wave that circled the Earth" (storyboard §3 "6 · The wave that circled the Earth": shots
// 6-01…6-17, then the BlackBeat + ChapterCard 3 (7-00) in the tail; script lines 42-49 = scene lines 0-7; families void
// high key ↔ noon 1883 station room → STUDIO_SET; Act II). Package II builder. Key art II = 6-14 at frameOf("l06", 6, 0.25).
// Every number drawn carries its sources.md row in a comment. F12: sound's speed shows no temperature. F14: rings on the
// globe are schematic (not to a time scale except where a counter says so).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Bloom,
  ChapterCard,
  CloudRack,
  CycClouds,
  Dial,
  Emissive,
  GroundShadow,
  Headline,
  Kicker,
  Layer,
  LightWash,
  Metric,
  Motes,
  Pill,
  STUDIO_SET,
  Sky,
  Stage,
  Stars,
  Streamers,
  Sway,
  Tick,
  TimeStrip,
  alpha,
  cameraAt,
  cutPop,
  lane,
  mixHex,
  rnd,
} from "../../../lib/illustrated";
import type { CamKey } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L13_COLORS, familyOf, pillFill } from "../families";
import { Notebook, Satellite } from "../props";
import { Barograph, GlobeL13, GlobeRing, PassageCounter, PressureWave, Rings, SITES, Strip, globePoint, passageBlips, passageRing } from "../sound";
import { ShotDef, ShotFC, actBreakAt, playShots } from "../shots";
import { Cue, SFX, cutHit, sting } from "./cue-types";

const VOID = familyOf("void");
const NOON = familyOf("noon");
const PETROL = familyOf("petrol");
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

export const cuesL06 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    front: 0, // 6-01 the globe: a saffron front spreads from Krakatoa
    swell: p(0, "a single slow swell"), // 6-02 inset: the slow hump and a fast audible wiggle
    needle: p(0, "strong enough"), // 6-03 a barometer dial flicks as the ring passes
    room: at(1), // 6-04 the 1883 station room (PUSH into the pen)
    pen: p(1, "pens on paper"), // 6-05 the flat line, a sweeping second hand
    jump: at(2), // 6-06 the pen jumps; Tick startles
    again: p(2, "Then they saw"), // 6-07 the ring converges at the antipode and comes back teal
    tally: p(2, "At many stations"), // 6-08 blips 2-7; Tick tallies
    seven: p(2, "not fewer than seven"), // the "≥ 7" metric (same shot)
    split: at(3), // 6-09 four out, three back
    lap: at(4), // 6-10 the globe spins; a clock sweeps 36 h
    days: p(4, "That's seven"), // 6-11 the five-day strip
    race: at(5), // 6-12 two arrows race
    sprint: p(5, "a little slower"), // 6-13 Tick sprints; the front overtakes it
    petals: at(6), // 6-14 KEY ART II: barograph petals round the globe, "One Instrument"
    office: p(6, "People who never"), // 6-15 a city weather office
    timeline: at(7), // 6-16 the strip as a timeline 1883 → 2022
    orbit: p(7, "Then it happened"), // 6-17 the cyc opens to orbit; a satellite glides across
    brk: actBreakAt(t).start, // BlackBeat + sting → ChapterCard 3
    last: end(7),
    end: t.frames,
  };
};
export type CL06 = ReturnType<typeof cuesL06>;

// ---- the void high-key globe (6-01, 6-07, 6-09, 6-10, 6-14) ----------------------------------------------------
const Space: React.FC<{ f: number; seed?: number; sun?: [number, number] }> = ({ f, seed = 3, sun = [260, 280] }) => (
  <Layer depth={0.05}>
    <Sky family={VOID} />
    <Bloom x={sun[0]} y={sun[1]} r={1000} color={L13_COLORS.gold} strength={0.32} spread={0.45} />
    <Bloom x={1800} y={900} r={700} color={L13_COLORS.teal} strength={0.2} spread={0.45} />
    <Stars frame={f} n={130} w={1920} h={1080} color={VOID.text} seed={seed} size={1.5} twinkle={0.7} />
  </Layer>
);

/** A sweeping clock with ticks (no numerals): `turns` of the hand so far. */
const SweepClock: React.FC<{ x: number; y: number; r: number; turns: number; hour?: number }> = ({ x, y, r, turns, hour }) => {
  const a = turns * 360 - 90;
  const ha = hour !== undefined ? hour * 30 - 90 : undefined;
  const tip = (deg: number, l: number) => [x + Math.cos((deg * Math.PI) / 180) * l, y + Math.sin((deg * Math.PI) / 180) * l];
  const [mx, my] = tip(a, r * 0.8);
  return (
    <g>
      <circle cx={x + 5} cy={y + 7} r={r} fill={alpha("#000", 0.25)} />
      <circle cx={x} cy={y} r={r} fill="#FFF6E2" stroke="#2A3E46" strokeWidth={r * 0.07} />
      {Array.from({ length: 12 }, (_, i) => {
        const [ax, ay] = tip(i * 30, r * 0.76);
        const [bx, by] = tip(i * 30, r * 0.9);
        return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke="#2A3E46" strokeWidth={i % 3 === 0 ? r * 0.06 : r * 0.03} />;
      })}
      {ha !== undefined ? <line x1={x} y1={y} x2={tip(ha, r * 0.5)[0]} y2={tip(ha, r * 0.5)[1]} stroke="#2A3E46" strokeWidth={r * 0.09} strokeLinecap="round" /> : null}
      <line x1={x} y1={y} x2={mx} y2={my} stroke="#C8452A" strokeWidth={r * 0.045} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.07} fill="#2A3E46" />
    </g>
  );
};

// 6-01 · the globe; from the Krakatoa pin a saffron front spreads across the surface (a great-circle front, foreshortened)
const ShotFront: ShotFC<CL06> = ({ f, len }) => {
  const g = { cx: 960, cy: 540, R: 420, rot: 62 + f * 0.15, tilt: 8 };
  const kp = globePoint(g, SITES.krakatoa.lon, SITES.krakatoa.lat);
  const d = Math.min(Math.PI * 0.9, 0.04 + f * 0.0095); // ~4 px/f across the disc
  return (
    <Stage theme={VOID.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 10, x: 980, y: 540, zoom: 1.12 }])} vignette={0.2} grain={0.5}>
      <Space f={f} />
      <Layer depth={1}>
        <GlobeL13 {...g} family={VOID}>
          <GlobeRing globe={g} d={d} color={L13_COLORS.saffron} core={L13_COLORS.saffronCore} width={9} />
          <GlobeRing globe={g} d={Math.max(0.01, d - 0.12)} color={L13_COLORS.saffron} width={4} opacity={0.4} />
        </GlobeL13>
        {kp.z > 0 ? <circle cx={kp.x} cy={kp.y} r={11} fill={L13_COLORS.saffron} stroke="#5A3A08" strokeWidth={3} /> : null}
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="PRESSURE WAVE" /* #6 #7 */ fill={pillFill(VOID)} color={VOID.text} dot={L13_COLORS.saffron} size={24} />
      </Layer>
    </Stage>
  );
};

// 6-02 · inset: the swell is one slow hump; a tiny audible wiggle beside it races by
const ShotSwell: ShotFC<CL06> = ({ f, len }) => (
  <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 540, zoom: 1.04 }])} vignette={0.22} grain={0.5}>
    <Space f={f + 200} seed={5} />
    <Layer depth={1}>
      <rect x={100} y={250} width={1720} height={560} rx={36} fill={alpha(PETROL.sky[0], 0.85)} stroke={alpha(L13_COLORS.teal, 0.5)} strokeWidth={3} />
      <PressureWave f={f} y={600} x0={140} x1={1780} amp={170} wavelength={1500} speed={3.2} color={L13_COLORS.saffron} core={L13_COLORS.saffronCore} width={10} fillAbove={alpha(L13_COLORS.saffron, 0.18)} lineColor={alpha(VOID.text, 0.4)} />
      <PressureWave f={f} y={360} x0={140} x1={1780} amp={22} wavelength={44} speed={12} color={L13_COLORS.teal} core={L13_COLORS.bone} width={4} line={false} />
    </Layer>
    <Layer depth={0}>
      <Pill x={120} y={150} text="FAR TOO SLOW TO HEAR" /* #6 #15 */ fill={pillFill(VOID)} color={VOID.text} dot={L13_COLORS.saffron} size={24} />
    </Layer>
  </Stage>
);

// 6-03 · a barometer dial on a station dot: the ring passes, the needle flicks (±40°)
const ShotNeedle: ShotFC<CL06> = ({ f, len }) => {
  const sx = 860;
  const sy = 620;
  const arrivals = [26, 76, 126];
  const kick = arrivals.reduce((s, a) => {
    const u = f - a;
    return s + (u < 0 ? 0 : u < 4 ? u / 4 : Math.exp(-(u - 4) / 9) * Math.cos((u - 4) / 3));
  }, 0);
  const R0 = 1500;
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 980, y: 540, zoom: 1.05 }])} vignette={0.22} grain={0.5}>
      <Space f={f + 400} seed={7} sun={[200, 200]} />
      <Layer depth={1}>
        <GlobeL13 cx={760} cy={540 + R0 - 30} R={R0} rot={40 + f * 0.05} tilt={60} family={VOID} schematic={false} />
        <Rings f={f} cx={sx - 9 * 140} cy={sy} start={26 - 140} period={50} speed={9} maxR={2200} width={8} squash={0.32} color={L13_COLORS.saffron} core={L13_COLORS.saffronCore} fade={false} />
        <GroundShadow x={sx} y={sy + 4} rx={30} ry={8} />
        <circle cx={sx} cy={sy} r={14} fill="#FFF4E0" stroke="#1E3A44" strokeWidth={5} />
        <path d={`M${sx} ${sy - 14} L${sx + 300} ${sy - 230}`} stroke={alpha(VOID.text, 0.6)} strokeWidth={2.5} strokeDasharray="6 8" />
        <Dial x={1400} y={360} r={190} value={50 + 17 * kick} min={0} max={100} family={VOID} frame={f} ticks={8} format={() => ""} />
      </Layer>
    </Stage>
  );
};

// ---- the noon 1883 station room (6-04 to 6-06, 6-08) -----------------------------------------------------------
const WALL = mixHex(NOON.sky[2], "#E6B35C", 0.45);
const StationRoom: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Layer depth={0.2}>
      <rect x={-400} y={-400} width={2800} height={1900} fill={WALL} />
      {/* the window: noon sky, a cloud sliding past, the frame */}
      <rect x={100} y={90} width={420} height={500} fill={NOON.sky[0]} />
      <g>
        <clipPath id="l06win">
          <rect x={100} y={90} width={420} height={500} />
        </clipPath>
        <g clipPath="url(#l06win)">
          <CloudRack f={f} n={3} x0={-200} x1={800} y0={200} y1={480} size={90} speed={2.4} body="#FFFFFF" under="#CFE6EE" seed={41} />
        </g>
      </g>
      <path d="M310 90 V590 M100 340 H520" stroke="#8A5A34" strokeWidth={16} />
      <rect x={100} y={90} width={420} height={500} fill="none" stroke="#8A5A34" strokeWidth={20} />
      <path d={`M100 590 L520 590 L1200 1080 L-300 1080 Z`} fill="#FFF4C8" opacity={0.28} />
    </Layer>
  </>
);
const Curtain: React.FC<{ f: number; x: number; seed: number }> = ({ f, x, seed }) => (
  <Sway frame={f} x={x} y={70} amp={5} period={70} seed={seed}>
    <path d={`M${x - 70} 70 C ${x - 90} 300 ${x - 60} 500 ${x - 80} 660 L ${x + 70} 660 C ${x + 60} 480 ${x + 80} 280 ${x + 70} 70 Z`} fill="#2F8F86" />
    <path d={`M${x - 20} 70 C ${x - 30} 300 ${x - 10} 500 ${x - 26} 660`} stroke="#1F6A63" strokeWidth={10} fill="none" />
  </Sway>
);

// 6-04 · the 1883 weather-station room: window light, a recording barograph drum turning, pen on paper; curtains
const ShotRoom: ShotFC<CL06> = ({ f, len }) => {
  const penX = 700 + 640 * 0.78;
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 10, x: penX, y: 520, zoom: 1.6 }])} vignette={0.16} grain={0.5}>
      <StationRoom f={f} />
      <Layer depth={0.25}>
        <Curtain f={f} x={80} seed={2} />
        <Curtain f={f} x={540} seed={5} />
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={790} width={2800} height={600} fill="#8A5A34" />
        <rect x={520} y={660} width={1100} height={50} rx={6} fill="#6A4026" />
        <rect x={560} y={710} width={30} height={200} fill="#5A3420" />
        <rect x={1550} y={710} width={30} height={200} fill="#5A3420" />
        <Barograph f={f} x={700} y={420} w={640} h={200} speed={4} spikes={[]} wobble={2} family={NOON} />
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={24} x={100} y={100} w={1600} h={800} color="#FFF4C8" seed={3} size={6} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={620} y={130} text="— 1883 · RECORDING BAROMETERS" /* #6 */ color="#3A2412" size={26} />
      </Layer>
    </Stage>
  );
};

// 6-05 · pen on paper: the line runs flat; a clock's second hand sweeps
const ShotPen: ShotFC<CL06> = ({ f, len }) => (
  <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 1000, y: 540, zoom: 1.06 }])} vignette={0.16} grain={0.5}>
    <Layer depth={0.1}>
      <rect x={-400} y={-400} width={2800} height={1900} fill={WALL} />
      <LightWash x={300} y={200} rx={900} ry={500} color="#FFF4C8" strength={0.35} />
    </Layer>
    <Layer depth={1}>
      <Strip f={f + 200} x={80} y={330} w={1760} h={380} speed={3} spikes={[]} wobble={2.5} />
    </Layer>
    <Layer depth={1.2}>
      <Motes frame={f} n={20} x={100} y={100} w={1700} h={800} color="#FFF4C8" seed={5} size={6} />
    </Layer>
    <Layer depth={0}>
      <SweepClock x={1700} y={170} r={110} turns={f / 60} />
    </Layer>
  </Stage>
);

// 6-06 · the pen jumps: blip one; Tick startles (jumps back)
const ShotJump: ShotFC<CL06> = ({ f, len }) => {
  const hop = f > 14 && f < 30 ? Math.sin(((f - 14) / 16) * Math.PI) * 50 : 0;
  const back = sm(f, 14, 24) * 70;
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 980, y: 540, zoom: 1.04 }])} vignette={0.16} grain={0.5}>
      <Layer depth={0.1}>
        <rect x={-400} y={-400} width={2800} height={1900} fill={WALL} />
        <LightWash x={300} y={200} rx={900} ry={500} color="#FFF4C8" strength={0.35} />
      </Layer>
      <Layer depth={0.3}>
        <Curtain f={f + 40} x={60} seed={7} />
      </Layer>
      <Layer depth={1}>
        <Strip f={f} x={160} y={220} w={1180} h={320} speed={3} spikes={[{ at: 14, h: 0.9 }]} scale={210} start={-400} />
        <Tick x={1560 + back} y={1000 - hop} pxPerM={340} frame={f} facing={-1} pose="stand" poseTo="shield" poseT={sm(f, 14, 26) * 1.2} expression="surprised" tilt={-sm(f, 14, 22) * 8} />
      </Layer>
    </Stage>
  );
};

// 6-07 · globe: the ring reaches the antipode, converges, bounces back as a new teal ring; PASSAGES counter
const ShotAgain: ShotFC<CL06> = ({ f, len }) => {
  const g = { cx: 900, cy: 540, R: 420, rot: SITES.krakatoaAntipode.lon + 20 + f * 0.1, tilt: 4 };
  const pr = passageRing(0.5 + f * 0.0085);
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 940, y: 540, zoom: 1.06 }])} vignette={0.2} grain={0.5}>
      <Space f={f + 600} seed={9} />
      <Layer depth={1}>
        <GlobeL13 {...g} family={VOID}>
          <GlobeRing globe={g} d={pr.d} color={pr.color} core={pr.outward ? L13_COLORS.saffronCore : "#FFFFFF"} width={9} />
        </GlobeL13>
      </Layer>
      <Layer depth={0}>
        <PassageCounter x={1500} y={330} n={pr.passage} family={VOID} label="PASSAGE" size={110} color={pr.outward ? L13_COLORS.saffron : L13_COLORS.bone} />
      </Layer>
    </Stage>
  );
};

// 6-08 · station: blips 2-7 arrive one after another as the drum spins fast; Tick tallies on a slate
const ShotTally: ShotFC<CL06> = ({ f, len, c }) => {
  const blips = passageBlips(8, 15); // #6: seven passages (equal heights, schematic)
  const penX = 340 + 900 * 0.78;
  const seen = blips.filter((b) => b.at + 2 <= f).length;
  const tSeven = c.seven - c.tally;
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 980, y: 540, zoom: 1.05 }])} vignette={0.16} grain={0.5}>
      <StationRoom f={f + 300} />
      <Layer depth={0.25}>
        <Curtain f={f + 300} x={80} seed={2} />
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={790} width={2800} height={600} fill="#8A5A34" />
        <rect x={160} y={660} width={1300} height={50} rx={6} fill="#6A4026" />
        <Barograph f={f} x={340} y={400} w={900} h={220} speed={10} spikes={blips} scale={140} family={NOON} />
        <circle cx={penX} cy={400 + 220 * 0.66 - 140} r={28} fill="none" stroke="#C8452A" strokeWidth={4} opacity={seen > 0 ? 0.6 + 0.4 * Math.sin(f / 2) : 0} />
        {/* the slate and its tally strokes */}
        <g transform="translate(1300 470) rotate(-6)">
          <rect x={0} y={0} width={250} height={170} rx={10} fill="#2E3A40" stroke="#8A5A34" strokeWidth={10} />
          {Array.from({ length: seen }, (_, i) =>
            i === 4 ? (
              <line key={i} x1={20} y1={120} x2={150} y2={40} stroke="#F4F1E8" strokeWidth={6} strokeLinecap="round" />
            ) : (
              <line key={i} x1={30 + (i > 4 ? i + 1 : i) * 30} y1={36} x2={30 + (i > 4 ? i + 1 : i) * 30} y2={134} stroke="#F4F1E8" strokeWidth={6} strokeLinecap="round" />
            ),
          )}
        </g>
        <Tick x={1640} y={1000} pxPerM={260} frame={f} facing={-1} pose="hold" expression={seen >= 7 ? "determined" : "surprised"} headTilt={seen % 2 ? 6 : -4} look={0.3} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, tSeven, tSeven + 10)}>
          <Metric x={120} y={200} value="≥ 7" /* #6 */ size={110} color="#3A2412" />
          <Pill x={120} y={258} text="AT MANY STATIONS" /* #6 */ fill={pillFill(NOON)} color={NOON.text} dot={L13_COLORS.saffron} size={20} />
        </g>
      </Layer>
    </Stage>
  );
};

// 6-09 · globe side-on: four outward rings (saffron) and three returning (teal) on a split counter
const ShotSplit: ShotFC<CL06> = ({ f, len }) => {
  const g = { cx: 960, cy: 560, R: 400, rot: SITES.krakatoa.lon + 88, tilt: 6 };
  const born = Array.from({ length: 7 }, (_, k) => 4 + k * 14);
  const out = [0, 2, 4, 6]; // #6: four passages outward
  const nOut = out.filter((k) => f >= born[k]).length;
  const nBack = [1, 3, 5].filter((k) => f >= born[k]).length; // #6: three back
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.04 }, { f: len, x: 960, y: 540, zoom: 1.0 }])} vignette={0.2} grain={0.5}>
      <Space f={f + 800} seed={11} />
      <Layer depth={1}>
        <GlobeL13 {...g} family={VOID}>
          {born.map((b, k) => {
            if (f < b) return null;
            const isOut = out.includes(k);
            const run = (f - b) * 0.024;
            const d = isOut ? Math.min(Math.PI - 0.05, 0.05 + run) : Math.max(0.05, Math.PI - 0.05 - run);
            return <GlobeRing key={k} globe={g} d={d} color={isOut ? L13_COLORS.saffron : L13_COLORS.bone} width={7} />;
          })}
        </GlobeL13>
      </Layer>
      <Layer depth={0}>
        {nOut > 0 ? <Pill x={120} y={130} text={`${nOut} OUTWARD`} /* #6 */ fill={pillFill(VOID)} color={VOID.text} dot={L13_COLORS.saffron} size={26} /> : null}
        {nBack > 0 ? <Pill x={1800} y={130} text={`${nBack} BACK`} /* #6 */ fill={pillFill(VOID)} color={VOID.text} dot={L13_COLORS.bone} size={26} align="end" /> : null}
      </Layer>
    </Stage>
  );
};

// 6-10 · the globe spins while a clock sweeps 36 hours (three turns of the hour hand)
const ShotLap: ShotFC<CL06> = ({ f, len }) => {
  const g = { cx: 900, cy: 560, R: 380, rot: 40 + f * 3, tilt: 12 };
  const k = clamp01(f / Math.max(1, len - 8));
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 540, zoom: 1.05 }])} vignette={0.2} grain={0.5}>
      <Space f={f + 1000} seed={13} />
      <Layer depth={1}>
        <GlobeL13 {...g} family={VOID}>
          <GlobeRing globe={g} d={(f * 0.03) % Math.PI} color={L13_COLORS.saffron} width={6} opacity={0.8} />
        </GlobeL13>
      </Layer>
      <Layer depth={0}>
        <SweepClock x={1600} y={640} r={140} turns={k * 36 /* #6: ~36 h */} hour={k * 36} />
        <Metric x={120} y={210} value="~36 h" /* #6 */ unit="a lap" size={100} color={VOID.text} />
      </Layer>
    </Stage>
  );
};

// 6-11 · a five-day strip scrolls; seven passage ticks land on it; three and a half lap rings fill beside it
const ShotDays: ShotFC<CL06> = ({ f, len }) => {
  const v = lerp(0.3, 4.9, clamp01(f / Math.max(1, len - 6))); // days (#6: ≈ 5 days)
  const sx = 120;
  const sw = 1680;
  const span = 2.4;
  const pxPer = sw / span;
  const sy = 700;
  const laps = Math.min(3.5, (v / 5) * 3.5); // #6: 3½ laps
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 540, zoom: 1.03 }])} vignette={0.2} grain={0.5}>
      <Space f={f + 1200} seed={15} />
      <Layer depth={1}>
        <TimeStrip x={sx} y={sy} w={sw} value={v} span={span} step={0.5} family={VOID} height={70} format={(d) => (Number.isInteger(d) && d >= 0 && d <= 5 ? `DAY ${d}` : "")} />
        <g>
          <clipPath id="l06days">
            <rect x={sx} y={sy - 260} width={sw} height={260} />
          </clipPath>
          <g clipPath="url(#l06days)">
            {Array.from({ length: 7 }, (_, k) => {
              const d = 0.35 + k * 0.7; // schematic spacing (F14)
              const x = sx + sw / 2 + (d - v) * pxPer;
              const s = clamp01((v - d) * 12 + 1);
              const col = k % 2 ? L13_COLORS.bone : L13_COLORS.saffron;
              return (
                <g key={k} transform={`translate(${x} ${sy - 40}) scale(${s.toFixed(3)})`} opacity={s}>
                  <line x1={0} y1={0} x2={0} y2={-140} stroke={col} strokeWidth={8} strokeLinecap="round" />
                  <circle cx={0} cy={-150} r={18} fill={col} />
                </g>
              );
            })}
          </g>
        </g>
        {/* the lap rings: three full, then a half */}
        {[0, 1, 2, 3].map((i) => {
          const part = clamp01(laps - i);
          const cx = 1180 + i * 170;
          return (
            <g key={i}>
              <circle cx={cx} cy={300} r={66} fill="none" stroke={alpha(VOID.text, 0.2)} strokeWidth={10} />
              {part > 0 ? <circle cx={cx} cy={300} r={66} fill="none" stroke={L13_COLORS.saffron} strokeWidth={12} pathLength={100} strokeDasharray={`${(part * 100).toFixed(1)} 100`} transform={`rotate(-90 ${cx} 300)`} strokeLinecap="round" /> : null}
            </g>
          );
        })}
      </Layer>
      <Layer depth={0}>
        <Metric x={120} y={230} value="3½ laps" /* #6 */ size={100} color={VOID.text} />
        <Pill x={120} y={290} text="≈ 5 DAYS" /* #6 */ fill={pillFill(VOID)} color={VOID.text} dot={L13_COLORS.saffron} size={22} />
      </Layer>
    </Stage>
  );
};

// 6-12 · two arrows race across the frame: the air wave, and ordinary sound a little ahead (F12: no temperature)
const Arrow: React.FC<{ x: number; y: number; len: number; color: string; core: string }> = ({ x, y, len, color, core }) => (
  <g>
    <Emissive d={`M${x - len} ${y} L${x} ${y}`} color={color} core={core} width={18} glow={32} />
    <path d={`M${x + 50} ${y} L${x - 20} ${y - 44} L${x - 20} ${y + 44} Z`} fill={color} />
  </g>
);
const ShotRace: ShotFC<CL06> = ({ f, len }) => {
  const span = 2900;
  const xa = ((f * 20 + 300) % span) - 500;
  const xb = ((f * 20 + 470) % span) - 500;
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 540, zoom: 1.03 }])} vignette={0.2} grain={0.5}>
      <Space f={f + 1400} seed={17} />
      <Layer depth={1}>
        <Streamers f={f} n={26} x0={-200} x1={2200} y0={250} y1={900} len={120} width={3} speed={14} color={VOID.text} opacity={0.35} seed={5} />
        <Arrow x={xa} y={480} len={560} color={L13_COLORS.saffron} core={L13_COLORS.saffronCore} />
        <Arrow x={xb} y={720} len={560} color={L13_COLORS.teal} core={L13_COLORS.bone} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={400} text="674-726 mph" /* #6 */ fill={pillFill(VOID)} color={VOID.text} dot={L13_COLORS.saffron} size={26} />
        <Pill x={120} y={640} text="SOUND · ~761 mph" /* #13 · F12 */ fill={pillFill(VOID)} color={VOID.text} dot={L13_COLORS.teal} size={26} />
      </Layer>
    </Stage>
  );
};

// 6-13 · noon: Tick sprints with a stopwatch beside the front, which overtakes it at once
const ShotSprint: ShotFC<CL06> = ({ f, len }) => {
  const GY = 860;
  const fx = -260 + f * 18;
  const passed = fx > 820;
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 540, zoom: 1.04 }])} vignette={0.12} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={NOON} />
      </Layer>
      <Layer depth={0.3}>
        <CloudRack f={f} n={5} x0={-600} x1={2600} y0={160} y1={420} size={120} speed={3} body="#FFFFFF" under="#CFE6EE" seed={51} dir={-1} />
        <path d={`M-400 ${GY - 60} Q 500 ${GY - 140} 1200 ${GY - 80} T 2400 ${GY - 90} V 1400 H -400 Z`} fill={NOON.far} />
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={GY} width={2800} height={600} fill="#7DB95E" />
        {lane(f, 26, -200, 2200, 12, 3, -1).map((p, i) => (
          <path key={i} d={`M${p.x} ${GY + 30 + (i % 5) * 34} q -10 -40 -4 -60 M${p.x + 14} ${GY + 30 + (i % 5) * 34} q 6 -34 16 -50`} stroke="#4E8F3E" strokeWidth={7} fill="none" strokeLinecap="round" />
        ))}
        <Streamers f={f} n={18} x0={-200} x1={2200} y0={300} y1={800} len={100} width={3} speed={12} color="#FFFFFF" opacity={0.45} seed={9} dir={-1} />
        {/* the front: a tall translucent saffron wall */}
        <rect x={fx - 260} y={-200} width={260} height={1600} fill={alpha(L13_COLORS.saffron, 0.22)} />
        <Emissive d={`M${fx} -200 L${fx} 1400`} color={L13_COLORS.saffron} core={L13_COLORS.saffronCore} width={14} glow={32} />
        <GroundShadow x={820} y={GY + 140} rx={140} ry={16} />
        <Tick x={820} y={GY + 140} pxPerM={300} frame={f} facing={1} walk={f / 6} pose="hold" expression={passed ? "surprised" : "determined"} tilt={6} look={passed ? 0.9 : 0.4} />
      </Layer>
    </Stage>
  );
};

// 6-14 · KEY ART II "One Instrument": the void globe, barograph strips fanned around it like petals, each pen drawing
// the same seven blips at once
const PETALS = [0, 24, -24, 180, 156, 204, 50, 130, -50];
const ShotPetals: ShotFC<CL06> = ({ f, len }) => {
  const g = { cx: 1100, cy: 540, R: 250, rot: 80 + f * 0.3, tilt: 10 };
  const blips = passageBlips(34, 16);
  return (
    <Stage theme={VOID.theme} cam={cameraAt(f, [{ f: 0, x: 1100, y: 540, zoom: 1.18 }, { f: len + 10, x: 1000, y: 540, zoom: 0.98 }])} vignette={0.2} grain={0.5}>
      <Space f={f + 1600} seed={19} sun={[520, 260]} />
      <Layer depth={1}>
        {PETALS.map((a, i) => {
          const u = sm(f, 4 + i * 3, 36 + i * 3);
          const ang = lerp(a - 70, a, u);
          const rr = g.R + 26;
          const x = g.cx + Math.cos((ang * Math.PI) / 180) * rr;
          const y = g.cy + Math.sin((ang * Math.PI) / 180) * rr;
          return (
            <g key={i} opacity={u}>
              <Strip f={f} x={x} y={y - 42} w={330} h={84} speed={3} spikes={blips} scale={46} rot={ang} penAt={0.82} paper={mixHex("#F7EBCF", L13_COLORS.gold, 0.18)} ink="#1E3A44" />
            </g>
          );
        })}
        <GlobeL13 {...g} family={VOID} schematic={false} />
        <Rings f={f} cx={g.cx} cy={g.cy} period={34} speed={5} maxR={900} width={4} color={L13_COLORS.saffron} opacity={0.5} start={10} />
      </Layer>
      <Layer depth={0}>
        <Headline x={110} y={170} lines={["One Instrument"]} size={84} color={VOID.text} accent={L13_COLORS.saffron} />
      </Layer>
    </Stage>
  );
};

// 6-15 · noon: a city weather office; a slate crowd Tick pencils the blip into a chart margin, glances out at a quiet street
const ShotOffice: ShotFC<CL06> = ({ f, len }) => {
  const draw = clamp01((f - 6) / 70);
  const chartPts = Array.from({ length: 41 }, (_, i) => {
    const u = i / 40;
    const x = 360 + u * 640;
    const y = 840 - (Math.abs(u - 0.55) < 0.04 ? 80 * (1 - Math.abs(u - 0.55) / 0.04) : 0) - Math.sin(u * 9) * 6;
    return [x, y] as [number, number];
  });
  const n = Math.max(2, Math.round(draw * 40));
  const [tx, ty] = chartPts[n];
  const glance = sm(f, 80, 96);
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 1000, y: 540, zoom: 1.05 }])} vignette={0.14} grain={0.5}>
      <Layer depth={0.2}>
        <rect x={-400} y={-400} width={2800} height={1900} fill={mixHex(WALL, "#B9CF9A", 0.25)} />
        {/* the window onto the street: traffic slides past */}
        <rect x={1180} y={120} width={620} height={480} fill={NOON.sky[1]} />
        <g>
          <clipPath id="l06street">
            <rect x={1180} y={120} width={620} height={480} />
          </clipPath>
          <g clipPath="url(#l06street)">
            <rect x={1180} y={440} width={620} height={160} fill="#9A8A70" />
            {[1220, 1420, 1620].map((x, i) => (
              <rect key={x} x={x} y={200 + i * 20} width={140} height={240 - i * 20} fill={mixHex(NOON.far, "#C98A4E", 0.4 + i * 0.1)} />
            ))}
            {lane(f, 3, 1000, 2000, 5, 7).map((p, i) => (
              <g key={i}>
                <rect x={p.x} y={480 + (i % 2) * 40} width={120} height={46} rx={10} fill={["#2F8F86", "#E0A93A", "#4E6E8A"][i]} />
                <circle cx={p.x + 26} cy={526 + (i % 2) * 40} r={11} fill="#2E3A40" />
                <circle cx={p.x + 94} cy={526 + (i % 2) * 40} r={11} fill="#2E3A40" />
              </g>
            ))}
          </g>
        </g>
        <rect x={1180} y={120} width={620} height={480} fill="none" stroke="#6A4026" strokeWidth={18} />
        <path d="M1490 120 V600" stroke="#6A4026" strokeWidth={12} />
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={700} width={2800} height={60} fill="#6A4026" />
        <rect x={-400} y={760} width={2800} height={600} fill="#8A5A34" opacity={0.8} />
        {/* the weather chart on the desk, the pencilled blip in its margin */}
        <g transform="rotate(-3 680 820)">
          <rect x={320} y={730} width={720} height={220} fill="#F7EBCF" stroke="#C9A97A" strokeWidth={3} />
          {[770, 810, 850, 890].map((y) => (
            <line key={y} x1={330} y1={y} x2={1030} y2={y} stroke="#D9B98A" strokeWidth={1.5} />
          ))}
          <path d={"M" + chartPts.slice(0, n + 1).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} fill="none" stroke="#3A4A50" strokeWidth={4} />
          <g transform={`translate(${tx} ${ty}) rotate(-35)`}>
            <rect x={-6} y={-150} width={14} height={150} fill="#E0A93A" />
            <path d="M-6 0 L1 16 L8 0 Z" fill="#3A2412" />
          </g>
        </g>
        <Notebook x={1260} y={780} w={240} h={130} turn={(f % 46) / 46} f={f} tilt={4} />
        <Tick x={180} y={1010} pxPerM={250} frame={f} facing={1} pose="hold" color="#5E7D8A" expression="thinking" look={lerp(-0.2, 0.9, glance)} headTilt={glance * -8} />
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={20} x={100} y={100} w={1700} h={800} color="#FFF4C8" seed={21} size={6} />
      </Layer>
    </Stage>
  );
};

// 6-16 · STUDIO_SET: the strip on the floor as a timeline 1883 → 2022, years scrolling past
const ShotTimeline: ShotFC<CL06> = ({ f, len }) => {
  const yr = lerp(1883, 2022, sm(f, 8, len - 6)); // #6 (1883) · #15 (2022)
  const sx = 120;
  const sw = 1680;
  const span = 40;
  const pxPer = sw / span;
  const sy = 760;
  const flag = (y: number, label: string, col: string) => {
    const x = sx + sw / 2 + (y - yr) * pxPer;
    if (x < sx - 80 || x > sx + sw + 80) return null;
    return (
      <g>
        <line x1={x} y1={sy - 40} x2={x} y2={sy - 190} stroke={col} strokeWidth={6} />
        <rect x={x} y={sy - 200} width={130} height={56} rx={8} fill={col} />
        <text x={x + 65} y={sy - 160} textAnchor="middle" style={{ fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 800, fontSize: 34, fill: "#13343E" }}>
          {label}
        </text>
      </g>
    );
  };
  return (
    <Stage theme={STUDIO.theme} cam={cam(f, [{ f: 0, x: 900, y: 540, zoom: 1.0 }, { f: len, x: 1020, y: 560, zoom: 1.04 }])} vignette={0.14} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={STUDIO} />
      </Layer>
      <Layer depth={0.3}>
        <CycClouds f={f} y={80} n={4} seed={11} />
      </Layer>
      <Layer depth={1}>
        <path d={`M-600 860 Q 960 830 2600 860 V 1500 H -600 Z`} fill={STUDIO.mid} />
        {/* the barograph paper unrolled under the timeline, scrolling with it */}
        <Strip f={yr * 20} x={sx} y={sy + 30} w={sw} h={110} speed={pxPer / 20} spikes={[{ at: 1883 * 20, h: 0.9 }]} scale={60} showPen={false} penAt={0.5} start={1840 * 20} />
        <TimeStrip x={sx} y={sy} w={sw} value={yr} span={span} step={10} family={STUDIO} height={64} />
        {flag(1883, "1883" /* #6 */, L13_COLORS.saffron)}
        {flag(2022, "2022" /* #15 */, L13_COLORS.teal)}
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={130} text="— NEARLY 140 YEARS" /* #15 */ color={STUDIO.text} size={28} />
      </Layer>
    </Stage>
  );
};

// 6-17 · Tick looks up: the cyc opens to orbit; a satellite glides across (BB + sting → ChapterCard 3 in the tail)
const ShotOrbit: ShotFC<CL06> = ({ f, len }) => {
  const open = sm(f, 6, 50);
  const look = sm(f, 2, 16);
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 600, zoom: 1.0 }, { f: len, x: 960, y: 440, zoom: 1.04 }])} vignette={0.2} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={VOID} />
        <Stars frame={f} n={150} w={1920} h={1080} color={VOID.text} seed={23} size={1.6} twinkle={0.7} />
        <Bloom x={1500} y={260} r={700} color={L13_COLORS.teal} strength={0.25} spread={0.4} />
        <g opacity={1 - open}>
          <Sky family={STUDIO} />
        </g>
      </Layer>
      <Layer depth={0.3}>
        <g opacity={1 - open}>
          <CycClouds f={f + 300} y={80} n={4} seed={13} />
        </g>
      </Layer>
      <Layer depth={0.5}>
        <Satellite x={-200 + f * 10} y={250 + Math.sin(f / 30) * 10} s={1.6} family={VOID} f={f} rot={-8} />
      </Layer>
      <Layer depth={1}>
        <path d={`M-600 900 Q 960 870 2600 900 V 1500 H -600 Z`} fill={mixHex(STUDIO.mid, "#1E4A5C", open * 0.5)} />
        <Tick x={760} y={1000} pxPerM={260} frame={f} facing={1} pose="stand" expression="surprised" headTilt={-look * 24} look={0.8} />
      </Layer>
    </Stage>
  );
};

// 7-00 · act break: black + sting, then ChapterCard 3 "The Twin" on the petrol field, teal rings (as C-13) at right
const ShotCard: ShotFC<CL06> = ({ f, len }) => {
  const t = clamp01((f - 14) / Math.max(1, len - 14));
  return (
    <AbsoluteFill>
      <ChapterCard family={PETROL} kicker="— CHAPTER THREE · 2022" /* #15 #16 */ title="The Twin" t={t * 0.86} frame={f} />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <g opacity={sm(t, 0, 0.18) * (1 - sm(t * 0.86, 0.85, 1))}>
            <Rings f={f} cx={1480} cy={540} period={22} speed={7} maxR={620} width={5} color={L13_COLORS.teal} core={L13_COLORS.bone} />
          </g>
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: 1 - sm(f, 12, 22), pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const SceneL06: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL06(t);
  const shots: ShotDef<CL06>[] = [
    { from: 0, S: ShotFront, id: "6-01" },
    { from: c.swell, S: ShotSwell, id: "6-02" },
    { from: c.needle, S: ShotNeedle, id: "6-03" },
    { from: c.room, S: ShotRoom, id: "6-04" },
    { from: c.pen, S: ShotPen, id: "6-05" },
    { from: c.jump, S: ShotJump, id: "6-06" },
    { from: c.again, S: ShotAgain, id: "6-07" },
    { from: c.tally, S: ShotTally, id: "6-08" },
    { from: c.split, S: ShotSplit, id: "6-09" },
    { from: c.lap, S: ShotLap, id: "6-10" },
    { from: c.days, S: ShotDays, id: "6-11" },
    { from: c.race, S: ShotRace, id: "6-12" },
    { from: c.sprint, S: ShotSprint, id: "6-13" },
    { from: c.petals, S: ShotPetals, id: "6-14" },
    { from: c.office, S: ShotOffice, id: "6-15" },
    { from: c.timeline, S: ShotTimeline, id: "6-16" },
    { from: c.orbit, S: ShotOrbit, id: "6-17" },
    { from: c.brk, S: ShotCard, id: "7-00" },
  ];
  return playShots(f, shots, c, t.frames);
};

export const soundL06 = (t: SceneTiming): Cue[] => {
  const c = cuesL06(t);
  return [
    { at: 0, file: SFX.rumble, vol: 0.2, dur: c.swell, fadeIn: 16, fadeOut: 12 },
    ...cutHit(c.swell),
    { at: c.swell + 4, file: SFX.swirl, vol: 0.2, dur: 50 },
    ...cutHit(c.needle),
    ...[26, 76].map((o) => ({ at: c.needle + o, file: SFX.click, vol: 0.22, dur: 12 })),
    ...cutHit(c.room),
    ...Array.from({ length: Math.max(0, Math.floor((c.jump - c.room) / 30)) }, (_, i) => ({ at: c.room + 10 + i * 30, file: SFX.click, vol: 0.1, dur: 8 })),
    ...cutHit(c.jump),
    { at: c.jump + 14, file: SFX.pop, vol: 0.32, dur: 20 },
    ...cutHit(c.again),
    { at: c.again + 6, file: SFX.swirl, vol: 0.22, dur: 50 },
    { at: c.again + 60, file: SFX.pop, vol: 0.24, dur: 20 },
    ...cutHit(c.tally),
    ...passageBlips(8, 15).map((b) => ({ at: c.tally + b.at, file: SFX.pop, vol: 0.2, dur: 16 })),
    ...cutHit(c.split),
    ...Array.from({ length: 7 }, (_, k) => ({ at: c.split + 4 + k * 14, file: SFX.pop, vol: 0.2, dur: 16 })),
    ...cutHit(c.lap),
    { at: c.lap + 4, file: SFX.swirl, vol: 0.22, dur: 60 },
    ...cutHit(c.days),
    ...Array.from({ length: 7 }, (_, k) => ({ at: c.days + 4 + k * 16, file: SFX.pop, vol: 0.16, dur: 14 })),
    ...cutHit(c.race),
    { at: c.race + 6, file: SFX.whoosh, vol: 0.26, dur: 40 },
    { at: c.race + 16, file: SFX.whoosh, vol: 0.22, dur: 40 },
    ...cutHit(c.sprint),
    { at: c.sprint + 50, file: SFX.whoosh, vol: 0.3, dur: 40 },
    ...cutHit(c.petals),
    { at: c.petals + 30, file: SFX.chime, vol: 0.26, dur: 60 },
    ...Array.from({ length: 7 }, (_, k) => ({ at: c.petals + 34 + k * 16, file: SFX.click, vol: 0.1, dur: 8 })),
    ...cutHit(c.office),
    ...[10, 30, 50].map((o) => ({ at: c.office + o, file: SFX.click, vol: 0.1, dur: 8 })),
    ...cutHit(c.timeline),
    ...[0, 16, 32, 48, 64].map((o) => ({ at: c.timeline + 8 + o, file: SFX.click, vol: 0.1, dur: 8 })),
    ...cutHit(c.orbit),
    { at: c.orbit + 4, file: SFX.riser, vol: 0.18, dur: c.brk - c.orbit, fadeOut: 10 },
    ...sting(c.brk),
  ];
};
