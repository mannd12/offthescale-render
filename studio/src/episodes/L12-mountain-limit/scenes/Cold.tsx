// L12 cold open (storyboard §3 "Cold open": shots C-01…C-11, script lines 0-5, family dusk, Act I). Package I.
// Shot components (continuous moves are ONE shot, BUILD.md §3): C-01+C-02 (push to the summit, the gauge rises) ·
// C-03 (Tick large, +2 mm) · C-04 (the ceiling line) · C-05→C-06 (ZT into the stone) · C-07→C-08 (time-bar, ZT to
// the summit, the continent shoves) · C-09a (wind) · C-09b (rain) · C-09c→C-10 (ice chips, push down, the base swells
// = key art l12-key-1) · C-11 (ChapterCard 1 over the summit, ZT into the gauge bar → scene 1's floor).
// Numbers drawn, each with its sources.md row: 8,848.86 m (#1) · +2 mm a year (#6) · 450 million years (#2) ·
// 50 million years (#2 #3, flag F1: schematic, no height ticks). The dashed ceiling line is UNLABELLED (C-04).
// Light: low sun at the right (~10°), gold; from C-10 a warm ember fill from below. Clouds stay left of x ≈ 1300 in
// world space so they never cross the HEIGHT gauge or its readout (art-director note on the proto-shot).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Bloom,
  ChapterCard,
  Counter,
  Cumulus,
  Embers,
  Emissive,
  Facets,
  Form,
  GroundShadow,
  HazeBand,
  Kicker,
  Layer,
  LightWash,
  Metric,
  Motes,
  Pill,
  Pt,
  Puffs,
  Ripples,
  Sky,
  Stage,
  Tick,
  TimeStrip,
  ZoomThrough,
  alpha,
  cameraAt,
  cutPop,
  fall,
  flash,
  lane,
  mixHex,
  prog,
  pulse,
  ramp,
  ridgePath,
  rnd,
  roundPoly,
  blobPts,
  smooth,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { L12_COLORS, familyOf, pillFill } from "../families";
import { cueKit } from "../cues";
import { HEIGHTS, L12Gauge } from "../L12Gauge";
import { FossilShell } from "../props";
import { SUMMIT, Summit, massifY } from "../Summit";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";

const F = familyOf("dusk");
const STUDIO = familyOf("studio");
const SUN = { x: 1560, y: 560 };
const LIGHT = 10; // degrees toward the low sun at the right
const EVEREST = HEIGHTS.everest; // 8,848.86 m (#1)
/** The dashed line "just above" the summit (C-04). No number is claimed: it stays unlabelled all through Act I. */
const CEILING_V = 9000;
const ZT = 36; // frames of a ZoomThrough

/** Cue table: every shot boundary and hit keyed to a phrase (never a timecode). */
export const cuesCold = (t: SceneTiming) => {
  const { at, p, end, frac } = cueKit(t);
  return {
    start: 0,
    rise: p(0, "Eight thousand", -6), // C-02: the gauge rises from the sea-level tick
    stop: p(0, "metres above"), // …and stops hard at 8,848.86 m (#1)
    gps: at(1), // C-03: the antenna, +2 mm a year (#6)
    twoMm: p(1, "two millimetres"),
    ceiling: p(1, "And yet"), // C-04 (match cut on the gauge): the dashed line fades in
    bump: p(1, "never get"), // the bar bumps the line and stops
    nothing: p(1, "Nothing on Earth"),
    whyNot: p(1, "Why not"), // Tick turns to us
    stone: at(2), // C-05: Tick crouches and lifts the stone
    inside: frac(2, 0.3), // ZT into the stone → C-06
    fossil1: p(2, "limestone"),
    fossil2: p(2, "shallow sea"),
    plate: p(2, "four hundred"), // the date plate 450 million years (#2)
    timeBar: at(3), // C-07: the 50-million-year bar (#2 #3, F1)
    summit2: p(3, "Yet the top"), // → C-08 (the ZT lands here)
    shove: p(3, "stronger than"), // the continent shoves
    wind: at(4), // C-09a
    rain: p(4, "rain"), // C-09b
    ice: p(4, "ice"), // C-09c → push down into C-10
    swell: p(4, "The thing"), // C-10: the base swells (key art l12-key-1 = line 4 @ 60 %)
    weight: p(4, "Its own weight"),
    card: at(5) - 2, // C-11: ChapterCard 1 over line 5 (Full.tsx keys the music lift to the same frame)
    cardLast: end(5, -2),
    last: end(5),
    end: t.frames,
  };
};
export type CCold = ReturnType<typeof cuesCold>;

// ---------------------------------------------------------------------------------------------
// shared drawing pieces of the cold open

/** A hard cut's scale pop (1.035 → 1 over 9 frames) around the whole frame. */
const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/** Two cumulus bands on the far plane, both kept left of the HUD (world x ≤ 1300) whatever the push does. */
const Clouds: React.FC<{ f: number; opacity?: number }> = ({ f, opacity = 1 }) => {
  const cloud = mixHex(F.haze, "#FFF4E6", 0.55);
  const shade = mixHex(F.far, F.haze, 0.35);
  return (
    <Layer depth={0.18} haze={{ color: F.haze, amount: 0.3 }} opacity={opacity}>
      <Cumulus x={60 + f * 0.22} y={392} w={420} h={64} fill={cloud} shade={shade} lit="#FFF8E8" light={LIGHT} seed={4} frame={f} lobes={4} />
      <Cumulus x={1000 + f * 0.16} y={446} w={240} h={44} fill={cloud} shade={shade} lit="#FFF8E8" light={LIGHT} seed={9} frame={f} lobes={3} opacity={0.9} />
    </Layer>
  );
};

/** Snow in the near plane: n flakes wrapping the frame. */
const Snow: React.FC<{ f: number; n?: number; r?: number; speed?: number; depth?: number; seed?: number }> = ({ f, n = 70, r = 0.9, speed = 1.4, depth = 1.25, seed = 4 }) => (
  <Layer depth={depth}>
    {fall(f, n, 1920, 1080, seed, speed, 14).map((p, i) => (
      <circle key={i} cx={p.x} cy={p.y} r={p.r * r} fill="#FFFFFF" opacity={0.55} />
    ))}
  </Layer>
);

/** Breath puffs at Tick's visor (feet at x,y; facing +1). */
const Breath: React.FC<{ f: number; x: number; y: number; ppm: number; facing?: 1 | -1; seed?: number }> = ({ f, x, y, ppm, facing = 1, seed = 3 }) => (
  <Puffs frame={f} x={x + facing * ppm * 0.3} y={y - ppm * 1.42} color={alpha("#FFFFFF", 0.7)} period={70} size={ppm * 0.07} rise={ppm * 0.004} drift={facing * ppm * 0.004} life={52} seed={seed} />
);

/** The cold open's HUD gauge (screen-locked). `v` metres; the ceiling appears from C-04 on. */
const Hud: React.FC<{ v: number; ceiling?: boolean; rolling?: boolean; marker?: boolean; base?: boolean; readout?: string | false; opacity?: number }> = ({ v, ceiling = false, rolling = false, marker = true, base = true, readout, opacity = 1 }) => (
  <Layer depth={0}>
    <L12Gauge family={F} value={v} base={base ? "ABOVE SEA LEVEL" : undefined} readout={readout} rolling={rolling} marker={marker} ceiling={ceiling ? { v: CEILING_V } : null} opacity={opacity} />
  </Layer>
);

/** The summit shelf for the close shots (C-03…C-05), drawn large at depth 1 in front of the far planes. */
const SHELF: Pt[] = [
  [-300, 1200],
  [150, 900],
  [420, 790],
  [640, 748],
  [840, 740],
  [1040, 752],
  [1300, 820],
  [1620, 940],
  [2200, 1200],
];
const shelfY = (x: number) => {
  for (let i = 0; i < SHELF.length - 1; i++) {
    const [ax, ay] = SHELF[i];
    const [bx, by] = SHELF[i + 1];
    if (x >= ax && x <= bx) return ay + ((by - ay) * (x - ax)) / (bx - ax);
  }
  return 1200;
};
const Shelf: React.FC<{ f: number; children?: React.ReactNode }> = ({ f, children }) => (
  <Layer depth={1}>
    <Form d={ridgePath(SHELF, 1300, 30)} fill={L12_COLORS.snow} light={LIGHT} shadow={F.shadow} inset={44} shadowOpacity={0.28} rim={F.light} rimWidth={5} rimOpacity={0.8} bounce={F.bounce}>
      <Facets pts={SHELF} base={1300} light={LIGHT} fill={mixHex(L12_COLORS.snow, F.shadow, 0.5)} opacity={0.22} />
      {/* wind-carved sastrugi lines */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${200 + i * 380} ${shelfY(200 + i * 380) + 40 + i * 30} q 120 -14 260 8`} fill="none" stroke={mixHex(L12_COLORS.snow, F.shadow, 0.35)} strokeWidth={2} opacity={0.35} />
      ))}
    </Form>
    <Embers frame={f} x0={300} x1={1500} y={742} n={16} color="#FFFFFF" seed={11} rise={0.25} life={80} size={1.6} wiggle={34} />
    {children}
  </Layer>
);

/** Sky + far planes of the summit world without the massif (for the shelf shots). */
const FarWorld: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Summit f={f} family={F} light={LIGHT} sun={SUN} tick={false} massif={false} />
    <Clouds f={f} />
  </>
);

// ---------------------------------------------------------------------------------------------
// C-01 + C-02 · the approach: wide, the summit comes up through the haze; push to a mid shot; the gauge rises
// from a sea-level tick, ticks racing, and stops hard at 8,848.86 m (#1). Tick: stand, neutral → proud on "above the sea".
const ShotApproach: ShotFC<CCold> = ({ f, len, c }) => {
  const rise = c.rise - c.start;
  const stop = c.stop - c.start;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 600, zoom: 1.0 },
    { f: stop + 20, x: 940, y: 372, zoom: 2.1 },
    { f: len + 60, x: 936, y: 352, zoom: 2.3 },
  ]);
  const k = ramp(f, rise, stop); // the climb
  const v = EVEREST * k;
  const stopped = f >= stop;
  const proudT = ramp(f, stop - 4, stop + 16);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.22} grain={0.5}>
      <Summit f={f} family={F} light={LIGHT} sun={SUN} tick={{ pxPerM: 40, pose: "stand", expression: "neutral", expressionTo: "proud", expressionT: proudT, look: 0.6 }} spot={stopped} />
      <Clouds f={f} />
      <Layer depth={0.6}>
        <Breath f={f} x={SUMMIT.x} y={SUMMIT.y} ppm={40} />
      </Layer>
      <Snow f={f} n={80} r={0.8} />
      <Layer depth={1.1}>
        <Motes frame={f} n={20} x={300} y={200} w={1100} h={600} color={F.light} seed={5} size={2.2} />
      </Layer>
      <Hud v={v} rolling marker={f >= rise} base={k > 0.92} readout={stopped ? "8,848.86 m" : undefined} />
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// C-03 · Tick large on the shelf; the GPS antenna blinks; a Counter rolls "+2 mm" while a calendar strip runs one year (#6).
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const ShotGps: ShotFC<CCold> = ({ f, len, c }) => {
  const ppm = 290;
  const tx = 640;
  const ty = shelfY(tx);
  const year = ramp(f, 10, len - 10); // one year across the shot
  const mm = 2 * year; // +2 mm a year (#6)
  const surprised = ramp(f, c.twoMm - c.gps, c.twoMm - c.gps + 14);
  const ax = 1060;
  const ay = shelfY(ax);
  const lamp = pulse(f, 24, 0.5, 2) > 1.2 ? 1 : 0.25;
  return (
    <Pop f={f}>
      <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.01, frames: len + 40, seed: 3 }} vignette={0.22} grain={0.5}>
        <FarWorld f={f} />
        <Shelf f={f}>
          {/* GPS antenna glyph: a mast, a flat plate, a blinking lamp */}
          <GroundShadow x={ax + 10} y={ay + 2} rx={28} color={F.shadow} opacity={0.4} blur={4} />
          <rect x={ax - 5} y={ay - ppm * 0.95} width={10} height={ppm * 0.95} fill={mixHex(L12_COLORS.slate, F.shadow, 0.3)} />
          <rect x={ax - 36} y={ay - ppm * 0.95 - 22} width={72} height={22} rx={4} fill={L12_COLORS.slate} />
          <rect x={ax - 30} y={ay - ppm * 0.95 - 19} width={60} height={5} fill={F.light} opacity={0.6} />
          <Bloom x={ax} y={ay - ppm * 0.95 - 36} r={34} color={F.light} strength={lamp} spread={0.3} core={5} coreColor="#FFF6DC" />
          <GroundShadow x={tx + 12} y={ty + 2} rx={ppm * 0.4} color={F.shadow} opacity={0.42} blur={8} />
          <Tick x={tx} y={ty} pxPerM={ppm} frame={f} pose="think" expression="thinking" expressionTo="surprised" expressionT={surprised} look={0.9 - surprised * 0.3} headTilt={surprised * 6} outline={F.shadow} />
          <Breath f={f} x={tx} y={ty} ppm={ppm} seed={7} />
        </Shelf>
        <Snow f={f} n={60} r={1.1} />
        <Layer depth={0}>
          {/* the counter: "+" Counter "mm" · A YEAR, left of the gauge plate */}
          <g opacity={ramp(f, 8, 22)}>
            <text x={1118} y={400} textAnchor="end" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 84, fill: F.text }}>+</text>
            <Counter x={1132} y={400} value={mm} max={9} digits={1} size={84} color={F.text} unit="mm" unitColor={F.dim} />
            <Kicker x={1132} y={448} text="a year" color={F.dim} size={22} />
          </g>
          <g opacity={ramp(f, 14, 28)}>
            <TimeStrip x={430} y={960} w={720} value={12 * year} span={16} step={3} family={F} kicker="— ONE YEAR" format={(v) => MONTHS[(((Math.round(v) % 12) + 12) % 12)]} />
          </g>
          <L12Gauge family={F} value={EVEREST} base="ABOVE SEA LEVEL" readout="8,848.86 m" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ---------------------------------------------------------------------------------------------
// C-04 · the gauge: its top tick creeps up a hair → a dashed ceiling line fades in just above it; the bar bumps it and
// stops → on "Why not?" Tick turns to us. Mid shot on the shelf (match cut on the gauge).
const ShotCeiling: ShotFC<CCold> = ({ f, len, c }) => {
  const ppm = 170;
  const tx = 700;
  const ty = shelfY(tx);
  const bumpAt = c.bump - c.ceiling;
  const why = c.whyNot - c.ceiling;
  const creep = ramp(f, 0, bumpAt) * 60; // the top tick creeps a hair (visual only; the readout keeps the measured number)
  const bump = f < bumpAt ? 0 : Math.max(0, Math.sin(Math.min(1, (f - bumpAt) / 16) * Math.PI)) * 90;
  const lineIn = ramp(f, bumpAt - 20, bumpAt - 4);
  const turn = ramp(f, why, why + 14);
  return (
    <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.07, panX: 0.03, panY: 0.02, frames: len + 40, seed: 2 }} vignette={0.22} grain={0.5}>
      <FarWorld f={f} />
      <Shelf f={f}>
        <GroundShadow x={tx + 8} y={ty + 2} rx={ppm * 0.4} color={F.shadow} opacity={0.42} blur={8} />
        <Tick x={tx} y={ty} pxPerM={ppm} frame={f} pose="stand" expression="surprised" expressionTo="thinking" expressionT={turn} look={1 - turn * 0.9} headTilt={-8 + turn * 14} outline={F.shadow} />
        <Breath f={f} x={tx} y={ty} ppm={ppm} seed={5} />
      </Shelf>
      <Snow f={f} n={60} r={1.0} />
      <Layer depth={0}>
        <L12Gauge family={F} value={EVEREST + creep + bump} base="ABOVE SEA LEVEL" readout="8,848.86 m" ceiling={lineIn > 0 ? { v: CEILING_V } : null} opacity={1} />
        {/* the dashed line fades in: a soft wash behind its position while it arrives */}
        {lineIn > 0 && lineIn < 1 ? <rect x={1480} y={160 + 560 - (CEILING_V / 10000) * 560 - 2} width={330} height={4} fill={F.text} opacity={(1 - lineIn) * 0.5} /> : null}
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// C-05 → C-06 · Tick crouches and lifts a flat summit stone, turns it to the light; ZoomThrough into the stone: hatch
// resolves into a shell, a crinoid stem, a brachiopod; a sea-glass caustic ghosts the warm shallow sea; the plate:
// 450 million years (#2) · SEAFLOOR LIMESTONE.
const StoneOutside: React.FC<{ f: number; len: number; hud: boolean }> = ({ f, len, hud }) => {
  const ppm = 260;
  const tx = 700;
  const ty = shelfY(tx);
  // phase 1: stand → crouch-reach (f 0-28); phase 2: crouch-reach → hold (f 36-66): the stone comes up with the hands
  const t1 = ramp(f, 0, 28);
  const t2 = ramp(f, 36, 66);
  const pose = f < 36 ? ({ pose: "stand", poseTo: "crouch-reach", poseT: Math.min(1.6, (f / 28) * 1.0 + (f > 28 ? (f - 28) / 20 : 0)) } as const) : ({ pose: "crouch-reach", poseTo: "hold", poseT: Math.min(1.7, (f - 36) / 30) } as const);
  void t1;
  // the stone: lying on the snow ahead of Tick, then lifted to chest height and turned toward the light
  const lift = smooth(t2);
  const sx = tx + ppm * 0.62 - lift * ppm * 0.3;
  const sy = ty - 6 - lift * ppm * 0.86;
  const rot = -lift * 28 + Math.sin(f / 30) * lift * 3;
  const sw = ppm * 0.46;
  const sh = ppm * 0.11;
  const stone = roundPoly(
    [
      [sx - sw / 2, sy],
      [sx + sw / 2, sy],
      [sx + sw * 0.42, sy - sh],
      [sx - sw * 0.46, sy - sh * 0.9],
    ],
    6,
  );
  return (
    <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.02, panY: 0.02, frames: len + 40, seed: 5 }} vignette={0.22} grain={0.5}>
      <FarWorld f={f} />
      <Shelf f={f}>
        <GroundShadow x={tx + 8} y={ty + 2} rx={ppm * 0.4} color={F.shadow} opacity={0.42} blur={8} />
        <Tick x={tx} y={ty} pxPerM={ppm} frame={f} {...pose} expression="thinking" look={0.7} headTilt={10 - lift * 6} outline={F.shadow} />
        <g transform={`rotate(${rot.toFixed(2)} ${sx} ${sy})`}>
          {lift < 0.2 ? <GroundShadow x={sx + 6} y={sy + 2} rx={sw * 0.55} ry={8} color={F.shadow} opacity={0.4 * (1 - lift * 5)} blur={4} /> : null}
          <Form d={stone} fill={L12_COLORS.limestone} light={LIGHT} shadow={F.shadow} inset={8} shadowOpacity={0.45} rim={F.light} rimWidth={2.5} rimOpacity={0.9} bounce={F.bounce}>
            <path d={`M${sx - sw * 0.3} ${sy - sh * 0.5} l ${sw * 0.12} -4 l ${sw * 0.1} 6 l ${sw * 0.14} -5`} fill="none" stroke={mixHex(L12_COLORS.limestone, F.shadow, 0.4)} strokeWidth={1.5} opacity={0.6} />
            <FossilShell x={sx + sw * 0.1} y={sy - sh * 0.5} r={sh * 0.42} family={F} ghost opacity={0.5} />
          </Form>
        </g>
        <Breath f={f} x={tx} y={ty} ppm={ppm} seed={9} />
      </Shelf>
      <Snow f={f} n={60} r={1.0} />
      {hud ? <Hud v={EVEREST} ceiling readout="8,848.86 m" /> : null}
    </Stage>
  );
};

const StoneInside: React.FC<{ f: number; len: number; c: CCold }> = ({ f, len, c }) => {
  const i0 = c.inside;
  const ink1 = ramp(f, c.fossil1 - i0 - 20, c.fossil1 - i0 + 20);
  const ink2 = ramp(f, c.fossil1 - i0 + 10, c.fossil1 - i0 + 50);
  const ink3 = ramp(f, c.fossil2 - i0 - 10, c.fossil2 - i0 + 30);
  const plateT = ramp(f, c.plate - i0, c.plate - i0 + 14);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 30, x: 980, y: 540, zoom: 1.14 },
  ]);
  const lime = L12_COLORS.limestone;
  const sea = L12_COLORS.seaGlass;
  // crinoid stem: discs along a gentle curve
  const stem = Array.from({ length: 11 }, (_, i) => {
    const u = i / 10;
    const x = 1210 + Math.sin(u * 2.4) * 90;
    const y = 790 - u * 400;
    return { x, y, r: 26 - u * 6 };
  });
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.16} grain={0.6}>
      <Layer depth={0.05}>
        <Sky stops={[mixHex(lime, F.shadow, 0.35), lime, mixHex(lime, "#FFFFFF", 0.25)]} />
        {/* the warm shallow sea ghosts behind the stone: a caustic wobble */}
        <LightWash x={900} y={520} rx={900} ry={520} color={sea} strength={0.28 * (0.4 + 0.6 * ink1)} />
        <g opacity={0.5 * ink1}>
          <Ripples frame={f} cx={940} cy={560} rx={1000} ry={560} period={70} count={5} color={sea} width={5} strength={0.45} />
        </g>
      </Layer>
      <Layer depth={0.5}>
        {/* the rock's hatch, fading as the fossils resolve */}
        <g stroke={mixHex(lime, F.shadow, 0.5)} strokeWidth={1.2} opacity={0.5 - 0.38 * ink1}>
          {Array.from({ length: 46 }, (_, i) => (
            <line key={i} x1={-200 + i * 60} y1={-100} x2={-200 + i * 60 + 700} y2={1200} />
          ))}
        </g>
        <Motes frame={f} n={30} x={200} y={120} w={1500} h={800} color="#FFFFFF" seed={8} size={2.6} drift={20} />
      </Layer>
      <Layer depth={1}>
        {/* the small shell */}
        <FossilShell x={560} y={700} r={74} family={F} light={LIGHT} rot={28} ink={ink1} ghost={ink1 < 0.5} color={mixHex(lime, F.shadow, 0.08)} />
        {/* the crinoid stem */}
        <g opacity={ink2}>
          {stem.map((s, i) => (
            <g key={i}>
              <ellipse cx={s.x} cy={s.y} rx={s.r} ry={s.r * 0.42} fill={mixHex(lime, F.shadow, 0.3)} />
              <ellipse cx={s.x} cy={s.y - 6} rx={s.r} ry={s.r * 0.42} fill={mixHex(lime, F.light, 0.12)} />
              <ellipse cx={s.x} cy={s.y - 6} rx={s.r * 0.3} ry={s.r * 0.14} fill={mixHex(lime, F.shadow, 0.45)} />
            </g>
          ))}
        </g>
        {/* the brachiopod, the hero */}
        <FossilShell x={860} y={560} r={156} family={F} light={LIGHT} rot={-8} ink={ink3} ghost={ink3 < 0.4} />
      </Layer>
      <Layer depth={0}>
        <g opacity={plateT} transform={`translate(0 ${((1 - plateT) * 16).toFixed(1)})`}>
          <Metric x={160} y={250} value="450" unit="million years" size={96} color={F.shadow} unitColor={mixHex(F.shadow, lime, 0.35)} />
          <Pill x={160} y={312} text="SEAFLOOR LIMESTONE" fill={alpha(F.shadow, 0.8)} color={F.text} dot={sea} size={20} />
        </g>
      </Layer>
    </Stage>
  );
};

const ShotStone: ShotFC<CCold> = ({ f, len, c }) => {
  const ztAt = c.inside - c.stone;
  const u = prog(f, ztAt, ZT);
  if (f < ztAt) return <Pop f={f}><StoneOutside f={f} len={len} hud /></Pop>;
  const inside = <StoneInside f={f - ztAt} len={len - ztAt} c={c} />;
  if (u >= 1) return inside;
  return (
    <>
      <ZoomThrough t={u} focal={{ x: 862, y: 572 }} maxScale={7} from={<StoneOutside f={f} len={len} hud={false} />} to={inside} />
      {/* HUD outside the transition, fading out with the plunge */}
      <AbsoluteFill style={{ opacity: 1 - smooth(u, 0, 0.5) }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <L12Gauge family={F} value={EVEREST} base="ABOVE SEA LEVEL" readout="8,848.86 m" ceiling={{ v: CEILING_V }} />
        </svg>
      </AbsoluteFill>
    </>
  );
};

// ---------------------------------------------------------------------------------------------
// C-07 → C-08 · a time-bar unrolls left → right, "50 MILLION YEARS"; a ghost range rises TOWARD a dashed line near 9 km
// and touches it only at the far right (flag F1: schematic, no height ticks); ZoomThrough at the right end into the
// summit; on "stronger than a continent" an ink continent slides in under the range and shoves; Tick braces.
const TimeBar: React.FC<{ f: number; len: number }> = ({ f, len }) => {
  const x0 = 160;
  const x1 = 1560;
  const yb = 790;
  const top = 450;
  const unroll = ramp(f, 6, Math.max(40, len * 0.62));
  const xe = x0 + (x1 - x0) * unroll;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.04 },
    { f: len + 20, x: 1010, y: 560, zoom: 1.1 },
  ]);
  const breathe = 1 + 0.012 * Math.sin(f / 40);
  const pts: Pt[] = [];
  const n = 60;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = x0 + (x1 - x0) * u;
    if (x > xe + 2) break;
    const bump = 0.5 + 0.5 * Math.sin(u * 23 + 1.3) * Math.sin(u * 7.1);
    const h = (yb - top) * Math.pow(u, 0.8) * (0.86 + 0.14 * (u > 0.97 ? 1 : bump)) * breathe;
    pts.push([x, yb - h]);
  }
  if (pts.length > 1) pts[pts.length - 1] = [pts[pts.length - 1][0], Math.max(top, pts[pts.length - 1][1])];
  const rangeD = pts.length > 2 ? ridgePath(pts, yb, 8) : "";
  const ticks = [0, 1, 2, 3, 4, 5];
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.24} grain={0.5}>
      <Layer depth={0.05}>
        <Sky stops={[F.sky[0], F.sky[1], mixHex(F.sky[1], F.sky[2], 0.35)]} />
        <Bloom x={1560} y={760} r={700} color={F.light} strength={0.22} spread={0.3} squash={0.5} />
      </Layer>
      <Layer depth={0.4}>
        <Motes frame={f} n={30} x={100} y={100} w={1700} h={800} color={F.light} seed={6} size={3} drift={30} />
      </Layer>
      <Layer depth={1}>
        {/* the dashed ceiling line, unlabelled */}
        <line x1={x0 - 40} y1={top} x2={x1 + 60} y2={top} stroke={F.text} strokeWidth={2.5} strokeDasharray="10 8" opacity={0.85} />
        {/* the ghost range rising toward it */}
        {rangeD ? (
          <Form d={rangeD} fill={alpha(F.mid, 0.9)} light={LIGHT} shadow={F.shadow} inset={22} shadowOpacity={0.4} rim={F.light} rimWidth={3} rimOpacity={0.7} bounce={F.bounce} opacity={0.75}>
            <Facets pts={pts} base={yb} light={LIGHT} fill={F.shadow} opacity={0.3} />
          </Form>
        ) : null}
        {/* the bar */}
        <rect x={x0} y={yb} width={xe - x0} height={10} fill={F.text} opacity={0.9} />
        <circle cx={xe} cy={yb + 5} r={9} fill={F.light} />
        {ticks.map((i) => {
          const x = x0 + ((x1 - x0) * i) / 5;
          const on = x <= xe + 1;
          return (
            <g key={i} opacity={on ? 1 : 0}>
              <rect x={x - 2} y={yb + 10} width={4} height={22} fill={F.text} />
              <text x={x} y={yb + 62} textAnchor="middle" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 24, fill: F.dim, fontVariantNumeric: "tabular-nums" }}>
                {i === 0 ? "50" : i === 5 ? "today" : `${50 - i * 10}`}
              </text>
            </g>
          );
        })}
        <text x={x0} y={yb + 100} style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, letterSpacing: 3, fill: F.dim }}>MILLION YEARS AGO</text>
      </Layer>
      <Layer depth={0}>
        <Kicker x={160} y={230} text="— 50 MILLION YEARS" color={F.dim} size={26} />
        <Pill x={160} y={284} text="SCHEMATIC" fill={pillFill(F)} color={F.text} size={18} />
      </Layer>
    </Stage>
  );
};

/** The ink continent (an organic slab in the near colour) that slides in from the left and shoves the range's base. */
const continentD = roundPoly(blobPts(-720, 1060, 900, 14, 7, 0.14, 0.34), 60);

const SummitShove: React.FC<{ f: number; len: number; c: CCold; shotStart: number }> = ({ f, len, c, shotStart }) => {
  const shoveAt = c.shove - shotStart;
  const slide = smooth(ramp(f, shoveAt - 30, shoveAt + 4));
  const hit = f - shoveAt;
  const shake = hit >= 0 && hit < 24 ? Math.sin(hit * 1.9) * (1 - hit / 24) * 9 : 0;
  const braceT = Math.min(1.8, Math.max(0, (f - (shoveAt - 12)) / 22));
  const cam = cameraAt(f, [
    { f: 0, x: 940, y: 440, zoom: 1.55 },
    { f: len + 40, x: 930, y: 430, zoom: 1.68 },
  ]);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.22} grain={0.5}>
      <g transform={`translate(${shake.toFixed(1)} 0)`}>
        <Summit f={f} family={F} light={LIGHT} sun={SUN} tick={{ pxPerM: 40, pose: "hips", poseTo: "lean", poseT: braceT, expression: "determined", look: -0.4, facing: -1 }} spot />
      </g>
      <Clouds f={f} />
      <Layer depth={0.6}>
        <Breath f={f} x={SUMMIT.x} y={SUMMIT.y} ppm={40} facing={-1} />
      </Layer>
      {/* the continent, under the range, from the left */}
      <Layer depth={0.9}>
        <g transform={`translate(${(-900 + 1220 * slide).toFixed(1)} 0)`} opacity={slide > 0 ? 1 : 0}>
          <Form d={continentD} fill={F.near} light={LIGHT} shadow={F.shadow} inset={50} shadowOpacity={0.5} rim={F.light} rimWidth={6} rimOpacity={0.55} bounce={F.bounce} />
          {/* motion chevrons on the slab */}
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${-420 + i * 110} 1030 l 44 30 l -44 30`} fill="none" stroke={F.light} strokeWidth={5} strokeLinecap="round" opacity={0.4 + 0.4 * (0.5 + 0.5 * Math.sin(f / 5 - i))} />
          ))}
        </g>
        {hit >= 0 && hit < 40 ? <Puffs frame={hit} x={330} y={1010} color={alpha(F.haze, 0.8)} period={6} size={20} rise={0.9} drift={-0.6} life={34} seed={4} /> : null}
      </Layer>
      <Snow f={f} n={70} r={0.9} />
      <Hud v={EVEREST} ceiling readout="8,848.86 m" />
    </Stage>
  );
};

const ShotTimeBarSummit: ShotFC<CCold> = ({ f, len, c }) => {
  const ztAt = c.summit2 - c.timeBar - 16;
  const u = prog(f, ztAt, ZT);
  if (f < ztAt) return <Pop f={f}><TimeBar f={f} len={ztAt} /></Pop>;
  const summit = <SummitShove f={f - ztAt} len={len - ztAt} c={c} shotStart={c.timeBar + ztAt} />;
  if (u >= 1) return summit;
  return <ZoomThrough t={u} focal={{ x: 1560, y: 450 }} maxScale={5} from={<TimeBar f={f} len={ztAt} />} to={summit} />;
};

// ---------------------------------------------------------------------------------------------
// C-09a · wind streaks rake across the ridge (micro-shot).
const ShotWind: ShotFC<CCold> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 500, zoom: 1.4 },
    { f: len + 10, x: 930, y: 500, zoom: 1.46 },
  ]);
  const streaks = lane(f, 22, -500, 2500, 30, 3);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.22} grain={0.5}>
        <Summit f={f} family={F} light={LIGHT} sun={SUN} tick={{ pxPerM: 40, pose: "stand", expression: "determined", tilt: -9, look: -0.3, facing: -1 }} spot />
        <Clouds f={f} />
        <Layer depth={1.1}>
          {streaks.map((s, i) => {
            const y = 180 + rnd(i * 3 + 1) * 700;
            const L = 160 + rnd(i * 7 + 2) * 260;
            return <line key={i} x1={s.x} y1={y} x2={s.x + L} y2={y + 6} stroke="#FFFFFF" strokeWidth={2 + rnd(i) * 2} strokeLinecap="round" opacity={0.18 + 0.3 * Math.sin(s.phase * Math.PI)} />;
          })}
        </Layer>
        <Snow f={f} n={110} r={0.9} speed={6} />
        <Hud v={EVEREST} ceiling readout="8,848.86 m" />
      </Stage>
    </Pop>
  );
};

// C-09b · rain hatching on a lower flank; rings on a ledge pool (micro-shot).
const ShotRain: ShotFC<CCold> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 300, y: 790, zoom: 2.0 },
    { f: len + 10, x: 330, y: 800, zoom: 2.08 },
  ]);
  const rain = fall(f, 140, 1920, 1080, 6, 16, 1);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.5}>
        <Summit f={f} family={F} light={LIGHT} sun={SUN} tick={false} spindrift={false} />
        <Layer depth={0.6}>
          {/* a ledge pool inside the flank */}
          <path d={roundPoly([[40, 826], [360, 826], [372, 850], [28, 850]], 6)} fill={mixHex(F.mid, F.light, 0.25)} />
          <ellipse cx={200} cy={830} rx={126} ry={9} fill={L12_COLORS.seaGlass} opacity={0.9} />
          {[0, 1, 2].map((i) => (
            <Ripples key={i} frame={f + i * 13} cx={150 + i * 48} cy={830} rx={60} ry={5} period={26} count={3} color="#FFFFFF" width={1.4} strength={0.6} />
          ))}
          <LightWash x={300} y={820} rx={360} ry={120} color={F.light} strength={0.12} />
        </Layer>
        <Layer depth={1.15}>
          <g stroke="#DDEAF0" strokeWidth={1.3} opacity={0.6}>
            {rain.map((p, i) => (
              <line key={i} x1={p.x} y1={p.y} x2={p.x - 10} y2={p.y + 34} />
            ))}
          </g>
        </Layer>
        <Hud v={EVEREST} ceiling readout="8,848.86 m" />
      </Stage>
    </Pop>
  );
};

// ---------------------------------------------------------------------------------------------
// C-09c → C-10 · ice chips flick off the cornice, then the camera pushes down to a low wide: the ridge's base darkens,
// an ember bulge swells beneath and presses outward, the massif sags 2 %, Tick looks down at its feet. KEY ART (l12-key-1).
const ShotIceSwell: ShotFC<CCold> = ({ f, len, c }) => {
  const pushAt = c.swell - c.ice - 30;
  const cam = cameraAt(f, [
    { f: 0, x: 1000, y: 330, zoom: 2.6 },
    { f: pushAt, x: 1000, y: 340, zoom: 2.5 },
    { f: pushAt + 60, x: 960, y: 640, zoom: 1.0 },
    { f: len + 30, x: 960, y: 684, zoom: 1.05 }, // tilt down 3 %
  ]);
  const swell = smooth(ramp(f, pushAt + 20, c.weight - c.ice + 10));
  const heat = pulse(f, 46, 0.1, 3) * pulse(f, 17, 0.04, 5);
  const sag = swell * 22; // the whole massif sags 2 %
  const worried = ramp(f, pushAt + 30, pushAt + 56);
  // ice chips: launched from the cornice every 4 frames, ballistic, life 44
  const chips = Array.from({ length: 16 }, (_, i) => {
    const born = i * 4 + 2;
    const age = f - born;
    if (age < 0 || age > 44) return null;
    const vx = 1.6 + rnd(i * 5) * 2.4;
    const vy = -3.2 - rnd(i * 7) * 2;
    return { x: 1036 + vx * age, y: 334 + vy * age + 0.14 * age * age, r: 2.2 + rnd(i) * 3, rot: age * (20 + i * 7), o: 1 - age / 44 };
  });
  const domeTop = 1180 - swell * 230;
  const dome = roundPoly(blobPts(960, 1330, 760, 16, 3, 0.05, 0.42), 80);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.24} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Bloom x={SUN.x} y={SUN.y} r={680} color={F.light} strength={0.55} spread={0.28} squash={0.7} />
        <Bloom x={SUN.x} y={SUN.y} r={170} color="#FFF1C8" strength={0.95} spread={0.42} core={48} coreColor="#FFF8E0" />
      </Layer>
      <g transform={`translate(0 ${sag.toFixed(1)})`}>
        <Summit f={f} family={F} light={LIGHT} sun={SUN} sky={false} emberFill={swell} tick={{ pxPerM: 40, pose: "stand", expression: "neutral", expressionTo: "worried", expressionT: worried, look: 0.3, headTilt: 14 * worried }} spot />
      </g>
      <Clouds f={f} opacity={1 - swell * 0.3} />
      <Layer depth={0.6}>
        {/* the base darkens, then the ember bulge swells beneath it (hot solid rock: a glow band, no liquid, flag F2) */}
        <HazeBand y={760} h={420} color={F.shadow} strength={0.55 * swell} />
        <g transform={`translate(0 ${(domeTop - 1180 + 390).toFixed(1)})`} opacity={swell > 0 ? 1 : 0}>
          <Emissive d={dome} color="#FF7A30" core="#FFB347" fill strength={0.9 * heat * swell} glow={32} opacity={0.35 + 0.65 * swell} />
        </g>
        <LightWash x={960} y={domeTop - 40} rx={820} ry={220} color="#FF7A30" strength={0.5 * swell * heat} />
        {swell > 0.05 ? <Embers frame={f} x0={420} x1={1500} y={domeTop + 10} n={Math.round(40 * swell)} color="#FFB347" seed={12} rise={1.4} life={120} size={2.6} wiggle={18} /> : null}
        {/* ice chips at the cornice */}
        {chips.map((p, i) =>
          p ? <rect key={i} x={p.x - p.r} y={p.y - p.r * 0.5} width={p.r * 2} height={p.r} fill="#FFFFFF" opacity={p.o} transform={`rotate(${p.rot} ${p.x} ${p.y})`} /> : null,
        )}
        <Breath f={f} x={SUMMIT.x} y={SUMMIT.y} ppm={40} />
      </Layer>
      <Snow f={f} n={70} r={0.9} />
      <Hud v={EVEREST} ceiling readout="8,848.86 m" />
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// C-11 · ChapterCard 1 over the summit (the base still warm), snow falling through the letters; the card lifts and the
// summit + gauge stay; then a ZoomThrough into the gauge bar → scene 1's bone floor.
const StudioHint: React.FC<{ f: number }> = ({ f }) => (
  <Stage theme={STUDIO.theme} shotFrame={f} vignette={0.1} grain={0.5}>
    <Layer depth={0.05}>
      <Sky family={STUDIO} />
    </Layer>
    <Layer depth={1}>
      <rect x={-400} y={900} width={2720} height={400} fill={STUDIO.far} />
      <HazeBand y={760} h={140} color={STUDIO.haze} strength={0.5} />
      <Motes frame={f} n={24} x={100} y={100} w={1700} h={800} color={STUDIO.light} seed={7} size={3} drift={30} />
    </Layer>
  </Stage>
);

const ShotCard: ShotFC<CCold> = ({ f, len, c }) => {
  const ztAt = len - 26;
  const cardLen = ztAt - 14;
  const cardT = Math.min(1, f / Math.max(1, cardLen));
  const fieldIn = ramp(f, 0, 7);
  const fieldOut = 1 - ramp(f, cardLen - 16, cardLen);
  const fl = flash(f, 0, 10, 0.55);
  const snow = fall(f, 60, 1920, 1080, 4, 1.4, 14);
  const base = (
    <Stage theme={F.theme} shotFrame={f + 60} drift={{ zoom: 1.06, panX: 0.02, panY: 0.02, frames: 400, seed: 4 }} vignette={0.24} grain={0.5}>
      <Summit f={f + 400} family={F} light={LIGHT} sun={SUN} emberFill={0.45} tick={{ pxPerM: 40, pose: "stand", expression: "worried", look: 0.3, headTilt: 10 }} spot />
      <Clouds f={f + 400} opacity={0.7} />
      <Layer depth={0.6}>
        <HazeBand y={760} h={420} color={F.shadow} strength={0.4} />
        <LightWash x={960} y={1060} rx={820} ry={200} color="#FF7A30" strength={0.3 * pulse(f, 40, 0.1)} />
      </Layer>
      <Snow f={f + 400} n={70} r={0.9} />
      <Hud v={EVEREST} ceiling readout="8,848.86 m" />
    </Stage>
  );
  const u = prog(f, ztAt, 26);
  if (f >= ztAt) return <ZoomThrough t={u} focal={{ x: 1767, y: 470 }} maxScale={8} from={base} to={<StudioHint f={f - ztAt} />} />;
  return (
    <>
      {base}
      <AbsoluteFill style={{ opacity: fieldIn * fieldOut }}>
        <ChapterCard family={F} kicker="— OFF THE SCALE · MOUNTAINS" title="How Tall Can a Mountain Get?" t={cardT} frame={f} />
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {snow.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r * 1.1} fill="#FFFFFF" opacity={0.6} />
          ))}
        </svg>
      </AbsoluteFill>
      {fl > 0 ? <AbsoluteFill style={{ background: F.light, opacity: fl }} /> : null}
    </>
  );
};

// ---------------------------------------------------------------------------------------------

export const SceneCold: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCold(t);
  const shots: ShotDef<CCold>[] = [
    { from: 0, S: ShotApproach, id: "C-01" },
    { from: c.gps, S: ShotGps, id: "C-03" },
    { from: c.ceiling, S: ShotCeiling, id: "C-04" },
    { from: c.stone, S: ShotStone, id: "C-05" },
    { from: c.timeBar, S: ShotTimeBarSummit, id: "C-07" },
    { from: c.wind, S: ShotWind, id: "C-09a" },
    { from: c.rain, S: ShotRain, id: "C-09b" },
    { from: c.ice, S: ShotIceSwell, id: "C-09c" },
    { from: c.card, S: ShotCard, id: "C-11" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX for the cold open (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCold = (t: SceneTiming): Cue[] => {
  const c = cuesCold(t);
  const ticks = Array.from({ length: Math.max(1, Math.floor((c.stop - c.rise) / 5)) }, (_, i) => ({ at: c.rise + i * 5, file: SFX.click, vol: 0.12, dur: 10 }));
  const myr = [0, 1, 2, 3, 4, 5].map((i) => ({ at: c.timeBar + 6 + Math.round(((c.summit2 - c.timeBar - 16) * 0.62 * i) / 5), file: SFX.click, vol: 0.14, dur: 12 }));
  return [
    { at: 0, file: SFX.wind, vol: 0.2, dur: c.card + 8, fadeIn: 20, fadeOut: 14 },
    ...ticks,
    { at: c.stop, file: SFX.chime, vol: 0.26, dur: 60 },
    ...cutHit(c.gps),
    { at: c.gps + 10, file: SFX.pop, vol: 0.22, dur: 20 },
    { at: c.gps + 40, file: SFX.click, vol: 0.14, dur: 12 },
    { at: c.gps + 90, file: SFX.click, vol: 0.14, dur: 12 },
    ...cutHit(c.ceiling, 0.18),
    { at: c.bump - 20, file: SFX.pop, vol: 0.2, dur: 20 },
    { at: c.nothing, file: SFX.rumble, vol: 0.22, dur: 90, fadeIn: 10, fadeOut: 30 },
    ...cutHit(c.stone),
    { at: c.inside, file: SFX.swirl, vol: 0.24, dur: 50 },
    { at: c.fossil1, file: SFX.chime, vol: 0.18, dur: 50 },
    { at: c.fossil1 + 30, file: SFX.chime, vol: 0.14, dur: 50 },
    { at: c.fossil2, file: SFX.chime, vol: 0.18, dur: 50 },
    { at: c.plate, file: SFX.popLong, vol: 0.24, dur: 30 },
    ...cutHit(c.timeBar),
    { at: c.timeBar, file: SFX.riser, vol: 0.14, dur: 120, fadeOut: 30 },
    ...myr,
    { at: c.summit2 - 16, file: SFX.deepWhoosh, vol: 0.24, dur: 60 },
    { at: c.summit2, file: SFX.rumble, vol: 0.26, dur: 120, fadeIn: 10, fadeOut: 30 },
    { at: c.shove, file: SFX.uBoom, vol: 0.36, dur: 110, fadeOut: 30 },
    ...cutHit(c.wind, 0.26),
    { at: c.rain, file: SFX.swirl, vol: 0.2, dur: 50 },
    { at: c.ice, file: SFX.click, vol: 0.16, dur: 12 },
    { at: c.ice + 4, file: SFX.debris, vol: 0.2, dur: 50, fadeOut: 16 },
    { at: c.swell, file: SFX.rumble, vol: 0.3, dur: c.card - c.swell + 10, fadeIn: 30, fadeOut: 10 },
    { at: c.card, file: SFX.boom, vol: 0.42, dur: 150, fadeOut: 40 },
    { at: c.card + 40, file: SFX.riser, vol: 0.12, dur: 100, fadeOut: 30 },
    { at: c.end - 26, file: SFX.deepWhoosh, vol: 0.22, dur: 50 },
  ];
};
