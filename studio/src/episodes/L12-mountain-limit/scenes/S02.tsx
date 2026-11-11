// L12 scene l02 "The root" (storyboard §3 "2 · The root": shots 2-01…2-14, script lines 12-19, families ember / noon, Act I).
// ChapterCard 2 is drawn by l01's tail; this scene opens on 2-01. Shot components (PUSH / ZT = one shot):
// 2-01+2-02 (cutaway, pull back, the 70 / 35 km brackets) · 2-03→2-04 (push into the root, ZT into the tank) ·
// 2-05 (heave: the raft sinks) · 2-06+2-07 (shove off: it rises; pull out; "Isostasy") · 2-08+2-09 (India slides in,
// the slabs jam) · 2-10 (the crust crumples, ×2) · 2-11+2-12 (HEIGHT and ROOT gauges, tilt down) · 2-13 (7 : 1) ·
// 2-14 (the root's base glows, the ceiling line returns, push down into the root).
// Numbers drawn, each with its sources.md row: crust ~70 km under Tibet, ~35 km ordinary, ×2 (#4) · 50 million years
// ago, India, same density (#2 #3) · 4,500 m (#5) · 35 km of extra crust (#4) · 7 : 1 (#5, arithmetic 35 / 4.5).
// Flag F2: the mantle and the root are HOT SOLID ROCK: heat bands and a glow, never a liquid surface; the tank is an
// analogy (pill MODEL) and its fluid moves in geological slow motion. The section is drawn at 4 px per km, so the
// 70-km root and the ~4.5-km plateau are to one scale; Tick on it cannot be (pill NOT TO SCALE).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Bobber,
  Bloom,
  Counter,
  Embers,
  Emissive,
  Form,
  GroundShadow,
  HazeBand,
  Headline,
  KEY_LIGHT,
  Kicker,
  Layer,
  LightCone,
  LightWash,
  Metric,
  Motes,
  P,
  Pill,
  Pt,
  Puffs,
  Ripples,
  Sky,
  Stage,
  Tick,
  ZoomThrough,
  alpha,
  cameraAt,
  cutPop,
  impact,
  mixHex,
  prog,
  pulse,
  ramp,
  smooth,
  smoothPath,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { L12_COLORS, familyOf, pillFill } from "../families";
import { cueKit } from "../cues";
import { HEIGHTS, L12Gauge } from "../L12Gauge";
import { SlateBlock } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";

const F = familyOf("ember");
const N = familyOf("noon");

// the section, at 4 px per km
const KM = 4;
const SURF = 430; // sea-level surface line (world y)
const CRUST = 35 * KM; // ordinary continental crust ~35 km (#4)
const ROOT = 35 * KM; // extra crust under Tibet: 70 − 35 = 35 km (#4)
const CX = 950; // centre of the range / root
const ZT = 36;

export const cuesL02 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    start: 0,
    float: p(0, "They float"),
    seventy: p(0, "seventy kilometres"), // the 70 km bracket (#4)
    twice: p(0, "twice"), // the 35 km bracket (#4)
    below: at(1), // 2-03: push down into the root
    hotter: p(1, "hotter, denser"),
    tank: at(2), // 2-04: the ZT lands on the tank here
    load: p(2, "Load it"), // 2-05
    unload: p(2, "Unload it"), // 2-06
    iso: at(3), // 2-07: "Isostasy"
    india: at(4), // 2-08
    ranInto: p(4, "India ran into"),
    same: p(4, "the same density"), // 2-09
    crumple: at(5), // 2-10
    up: p(5, "but up"),
    down: p(5, "and down"),
    doubled: p(5, "It doubled"),
    gauges: at(6), // 2-11
    m4500: p(6, "four and a half"),
    extra: p(6, "The extra crust"), // 2-12: tilt down the ROOT gauge
    km35: p(6, "thirty-five"),
    ratio: p(6, "Roughly seven"), // 2-13
    holds: at(7), // 2-14
    ceiling: p(7, "And, it turns out"),
    last: end(7),
    end: t.frames,
  };
};
export type CL02 = ReturnType<typeof cuesL02>;

const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

// ---------------------------------------------------------------------------------------------
// the cutaway

const bell = (x: number, c: number, w: number) => Math.exp(-Math.pow((x - c) / w, 2));
const CRUST_COL = L12_COLORS.slate;

type SectionProps = {
  f: number;
  /** 0..1: how much of the 35-km root has grown under the range (1 = Tibet today, 70 km in all) */
  root?: number;
  /** 0..1: height of the plateau + peaks on top (to scale: plateau ~4.5 km, peaks to ~8.8 km) */
  peaks?: number;
  /** 0..1 strength of the heat bands; `glow` adds the foreshadowing glow at the root's base */
  heat?: number;
  glow?: number;
  /** world x of India's leading edge (undefined = no separate slab: one continuous crust) */
  india?: number;
  /** 0..1 tighter mantle texture ("hotter, denser") */
  dense?: number;
  squeeze?: number;
  /** width of the open gap ahead of India's edge (px); 0 = in contact */
  gap?: number;
  children?: React.ReactNode;
};

/** Top of the crust (surface + plateau + peaks) and its base (with the root), as point lists left → right. */
const crustLines = (root: number, peaks: number, x0 = -900, x1 = 2800) => {
  const top: Pt[] = [];
  const bot: Pt[] = [];
  for (let x = x0; x <= x1; x += 25) {
    const plateau = 18 * peaks * Math.min(1, bell(x, CX, 330) * 1.5); // ~4.5 km at 4 px/km
    const spikes = 17 * peaks * bell(x, CX - 250, 120) * (0.55 + 0.45 * Math.abs(Math.sin(x * 0.045))); // peaks at the southern edge, to ~8.8 km
    const rough = 3 * peaks * Math.sin(x * 0.09) * bell(x, CX, 300);
    top.push([x, SURF - plateau - spikes - rough]);
    bot.push([x, SURF + CRUST + ROOT * root * bell(x, CX, 300)]);
  }
  return { top, bot };
};

const Section: React.FC<SectionProps> = ({ f, root = 1, peaks = 1, heat = 0.6, glow = 0, india, dense = 0, squeeze = 0, gap = 0, children }) => {
  const { top, bot } = crustLines(root, peaks);
  const crustD = `${smoothPath(top)} L${bot
    .slice()
    .reverse()
    .map(([x, y]) => `${x} ${y}`)
    .join(" L")} Z`;
  const hp = pulse(f, 52, 0.1, 2) * pulse(f, 19, 0.04, 7);
  const bands = [0, 1, 2, 3];
  const rootY = SURF + CRUST + ROOT * root;
  return (
    <>
      {/* a bone sky sliver above the block */}
      <Layer depth={0.05}>
        <Sky stops={["#E9D9BC", "#F6EAD2", "#F1DDB8"]} />
      </Layer>
      <Layer depth={0.4} haze={{ color: "#F1DDB8", amount: 0.35 }}>
        <path d={`M-900 ${SURF - 20} L-300 ${SURF - 62} L200 ${SURF - 40} L700 ${SURF - 78} L1300 ${SURF - 46} L1900 ${SURF - 70} L2800 ${SURF - 30} L2800 ${SURF + 40} L-900 ${SURF + 40} Z`} fill="#C9AF86" />
      </Layer>
      <Layer depth={1}>
        {/* the mantle: maroon-graphite, hotter (brighter) with depth; heat bands glow from below */}
        <Sky stops={["#43201A", "#4E1C10", "#7A2C12", "#A8481A"]} x={-900} y={SURF} w={3700} h={1000} />
        {/* mantle texture: rows of short dashes that tighten on "hotter, denser" */}
        <g stroke={mixHex("#7A2C12", F.light, 0.25)} strokeWidth={2} strokeLinecap="round" opacity={0.3 + 0.25 * dense}>
          {Array.from({ length: 9 }, (_, r) => {
            const gap = 64 - 26 * dense;
            const yy = SURF + CRUST + 60 + r * gap;
            return Array.from({ length: 40 }, (_, k) => {
              const xx = -800 + k * (90 - 30 * dense) + (r % 2 ? 40 : 0) + Math.sin(f / 60 + r) * 6;
              return <line key={`${r}-${k}`} x1={xx} y1={yy} x2={xx + 26} y2={yy + 3} />;
            });
          })}
        </g>
        {bands.map((i) => {
          const yy = 820 + i * 110;
          const pts: Pt[] = Array.from({ length: 16 }, (_, k) => [-900 + k * 250, yy + Math.sin(k * 1.4 + i * 2 + f / (70 + i * 9)) * 16] as Pt);
          return <Emissive key={i} d={smoothPath(pts)} color="#FF7A30" core="#FFB347" width={3 + i} strength={(0.35 + 0.2 * i) * heat * hp} glow={16} opacity={0.5 + 0.12 * i} />;
        })}
        <HazeBand y={900} h={500} color="#FF7A30" strength={0.35 * heat * hp} x={-900} w={3700} />
        {/* the root's base begins to glow (2-14 foreshadow): light on the surrounding mantle */}
        {glow > 0 ? <LightWash x={CX} y={rootY + 30} rx={520} ry={150} color="#FFB347" strength={0.75 * glow * hp} /> : null}
        {/* the crust: slate, lit top edge, coloured bounce from the heat below */}
        <g transform={squeeze ? `translate(${CX} 0) scale(${1 - squeeze * 0.02} 1) translate(${-CX} 0)` : undefined}>
          <Form d={crustD} fill={CRUST_COL} light={90} shadow={F.shadow} inset={26} shadowOpacity={0.4} rim="#FFF1D6" rimWidth={4} rimOpacity={0.9} bounce={F.bounce} bounceOpacity={0.55}>
            {/* strata hatch */}
            <g stroke={mixHex(CRUST_COL, F.shadow, 0.4)} strokeWidth={1.6} opacity={0.5}>
              {[0.25, 0.5, 0.75].map((k) => (
                <path key={k} d={smoothPath(top.map(([x, y], i) => [x, y + (bot[i][1] - y) * k] as Pt))} fill="none" />
              ))}
            </g>
            {glow > 0 ? <LightWash x={CX} y={rootY} rx={420} ry={110} color="#FF7A30" strength={0.7 * glow * hp} /> : null}
            {india !== undefined ? (
              <g>
                <path d={`M${india} ${SURF - 60} L${india + gap} ${SURF - 60} L${india + gap + 30} ${SURF + CRUST + 30} L${india - 30} ${SURF + CRUST + 30} Z`} fill="#D9C7A2" />
                <path d={`M${india - 6} ${SURF + 18} L${india + gap + 6} ${SURF + 18} L${india + gap + 30} ${SURF + CRUST + 30} L${india - 30} ${SURF + CRUST + 30} Z`} fill="#4E1C10" />
                <path d={`M${india} ${SURF - 60} L${india - 30} ${SURF + CRUST + 30}`} stroke={F.shadow} strokeWidth={5} opacity={0.8} />
                <path d={`M${india + gap} ${SURF - 60} L${india + gap + 30} ${SURF + CRUST + 30}`} stroke={F.shadow} strokeWidth={5} opacity={0.8} />
              </g>
            ) : null}
          </Form>
          {/* snow on the high ground */}
          {peaks > 0.5 ? <path d={smoothPath(top.filter(([x]) => x > CX - 380 && x < CX + 260))} fill="none" stroke={L12_COLORS.snow} strokeWidth={3} strokeLinecap="round" opacity={0.9 * peaks} /> : null}
        </g>
        {children}
      </Layer>
      <Layer depth={1.2}>
        <Embers frame={f} x0={-200} x1={2100} y={1120} n={34} color="#FFB347" seed={6} rise={1.1} life={150} size={2.4} wiggle={16} />
      </Layer>
    </>
  );
};

/** A vertical bracket with end ticks from y0 to y1 at x. */
const Bracket: React.FC<{ x: number; y0: number; y1: number; t: number; color: string }> = ({ x, y0, y1, t, color }) => {
  const yy = y0 + (y1 - y0) * smooth(t);
  return (
    <g stroke={color} strokeWidth={4} strokeLinecap="round" opacity={t > 0 ? 1 : 0}>
      <line x1={x} y1={y0} x2={x} y2={yy} />
      <line x1={x - 12} y1={y0} x2={x + 12} y2={y0} />
      <line x1={x - 12} y1={yy} x2={x + 12} y2={yy} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------
// 2-01 + 2-02 · the cutaway: start close on the range (Tick a visitor on the plateau), pull back until the root under
// it fills the frame; brackets: ~70 km under Tibet beside ~35 km of ordinary crust (#4).
const ShotCutaway: ShotFC<CL02> = ({ f, len, c }) => {
  const fl = c.float;
  const cam = cameraAt(f, [
    { f: 0, x: CX - 40, y: SURF - 30, zoom: 3.4 },
    { f: fl, x: CX - 30, y: SURF - 10, zoom: 3.0 },
    { f: c.seventy - 10, x: 960, y: 610, zoom: 1.0 },
    { f: len + 40, x: 990, y: 620, zoom: 1.06 },
  ]);
  const b70 = ramp(f, c.seventy - 6, c.seventy + 22);
  const b35 = ramp(f, c.twice - 6, c.twice + 18);
  const near = 1 - ramp(f, fl + 10, fl + 50); // while we are close: Tick + NOT TO SCALE
  const { top } = crustLines(1, 1);
  const ty = top.reduce((best, p) => (Math.abs(p[0] - (CX + 40)) < Math.abs(best[0] - (CX + 40)) ? p : best), top[0])[1];
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.2} grain={0.5}>
      <Section f={f} heat={0.7}>
        <g opacity={Math.min(1, near * 3 + 0.0001) > 0 ? 1 : 0}>
          <Tick x={CX + 40} y={ty + 1} pxPerM={15} frame={f} pose="stand" poseTo="wave" poseT={Math.min(1.6, f / 26)} expression="happy" look={0.4} outline={F.shadow} />
        </g>
        <Bracket x={CX} y0={SURF - 16} y1={SURF + CRUST + ROOT} t={b70} color={F.text} />
        <Bracket x={1640} y0={SURF} y1={SURF + CRUST} t={b35} color={F.text} />
      </Section>
      <Layer depth={0}>
        <g opacity={near}>
          <Pill x={150} y={930} text="NOT TO SCALE" fill={pillFill(F)} color={F.text} size={16} />
        </g>
        <g opacity={ramp(f, 8, 24) * (1 - b70)}>
          <Pill x={150} y={150} text="TIBET · CRUST ~70 km" fill={pillFill(F)} color={F.text} dot={CRUST_COL} size={22} />
        </g>
        <g opacity={b70}>
          <Metric x={1004} y={SURF + 400} value="70" unit="km" size={104} color={F.text} unitColor={F.dim} />
          <Pill x={1008} y={SURF + 442} text="UNDER TIBET" fill={pillFill(F)} color={F.text} dot={CRUST_COL} size={18} />
        </g>
        <g opacity={b35}>
          <Pill x={1612} y={SURF + CRUST + 56} text="ORDINARY CRUST · ~35 km" fill={pillFill(F)} color={F.text} dot={CRUST_COL} size={18} align="end" />
        </g>
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// the tank (noon): a glass tank of thick sea-glass fluid on a bone table in window light; a slate raft floats in it.

const TANK = { x0: 500, x1: 1420, top: 380, bot: 800, level: 520 };
const RAFT = { x: 800, w: 300, h: 46 };
const TPPM = 150;

type TankProps = {
  f: number;
  /** 0..1: how far the raft has sunk under its load */
  load: number;
  /** frames since the block hit the fluid (splash), or -1 */
  splash?: number;
  children?: (raftTop: number) => React.ReactNode;
  under?: React.ReactNode;
};

const Tank: React.FC<TankProps> = ({ f, load, splash = -1, children, under }) => {
  const sea = L12_COLORS.seaGlass;
  const sink = 16 * load;
  const raftTop = TANK.level - 22 + sink;
  // the fluid surface: geological slow motion (a 7-s swell, 2 px) + the bulge beside a loaded raft
  const pts: Pt[] = [];
  for (let x = TANK.x0; x <= TANK.x1; x += 20) {
    const slow = Math.sin(x / 150 + f / 210) * 2;
    const bulge = -9 * load * (bell(x, RAFT.x - 30, 70) + bell(x, RAFT.x + RAFT.w + 30, 70));
    pts.push([x, TANK.level + slow + bulge]);
  }
  const fluid = `${smoothPath(pts)} L${TANK.x1} ${TANK.bot} L${TANK.x0} ${TANK.bot} Z`;
  return (
    <>
      <Layer depth={0.05}>
        <Sky family={N} />
        <Bloom x={1750} y={170} r={620} color={N.light} strength={0.6} spread={0.3} />
      </Layer>
      {/* the room: a wall with a tall window at the right, light falling across the table */}
      <Layer depth={0.5}>
        <rect x={-600} y={-300} width={3200} height={1300} fill={mixHex(N.far, "#F3E9C8", 0.55)} />
        <rect x={1500} y={40} width={520} height={640} rx={10} fill="#8FD2E6" />
        <Bloom x={1760} y={300} r={420} color="#FFF8DC" strength={0.75} spread={0.4} />
        <g stroke={mixHex(N.near, "#F3E9C8", 0.3)} strokeWidth={16}>
          <rect x={1500} y={40} width={520} height={640} rx={10} fill="none" />
          <line x1={1760} y1={40} x2={1760} y2={680} />
          <line x1={1500} y1={330} x2={2020} y2={330} />
        </g>
        <LightCone x={1760} y={330} angle={158} length={1700} spread={13} color={N.light} strength={0.42} />
      </Layer>
      <Layer depth={1}>
        {/* the table */}
        <rect x={-600} y={TANK.bot} width={3200} height={60} fill="#E9D5B0" />
        <rect x={-600} y={TANK.bot + 60} width={3200} height={500} fill={mixHex("#C9AF86", N.shadow, 0.18)} />
        <rect x={-600} y={TANK.bot} width={3200} height={6} fill="#FFF6E0" opacity={0.8} />
        <GroundShadow x={(TANK.x0 + TANK.x1) / 2 - 60} y={TANK.bot + 8} rx={520} ry={22} color={N.shadow} opacity={0.3} blur={8} />
        {/* glass back wall */}
        <rect x={TANK.x0} y={TANK.top} width={TANK.x1 - TANK.x0} height={TANK.bot - TANK.top} fill={alpha("#FFFFFF", 0.16)} />
        {/* the fluid */}
        <path d={fluid} fill={mixHex(sea, N.shadow, 0.08)} />
        <clipPath id="l02-fluid">
          <path d={fluid} />
        </clipPath>
        <g clipPath="url(#l02-fluid)">
          <HazeBand y={TANK.level} h={TANK.bot - TANK.level} color={mixHex(sea, N.shadow, 0.55)} strength={0.75} />
          <LightWash x={1250} y={TANK.level + 40} rx={360} ry={150} color={N.light} strength={0.35} />
          {/* slow convection streaks */}
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${TANK.x0 + 60 + i * 190 + Math.sin(f / 150 + i) * 20} ${TANK.bot - 20} q 40 -90 -10 -180`} fill="none" stroke={mixHex(sea, "#FFFFFF", 0.4)} strokeWidth={3} strokeLinecap="round" opacity={0.25} />
          ))}
          {under}
          {splash >= 0 ? <Ripples frame={Math.min(splash, 200)} cx={RAFT.x + RAFT.w + 90} cy={TANK.level + 4} rx={260} ry={26} period={70} count={3} color="#FFFFFF" width={3} strength={0.7 * Math.max(0, 1 - splash / 200)} /> : null}
        </g>
        <path d={smoothPath(pts)} fill="none" stroke={mixHex(sea, "#FFFFFF", 0.65)} strokeWidth={4} strokeLinecap="round" />
        {/* the raft and its crew, rocking very slowly */}
        <Bobber frame={f} x={RAFT.x + RAFT.w / 2} y={raftTop} amp={2.2} roll={0.9} period={190} seed={3}>
          <SlateBlock x={RAFT.x} y={raftTop + RAFT.h} w={RAFT.w} h={RAFT.h} d={30} family={N} light={20} shadow={false} />
          {children ? children(raftTop) : null}
        </Bobber>
        {/* the submerged part reads through the fluid */}
        <rect x={RAFT.x} y={TANK.level + 2} width={RAFT.w} height={Math.max(0, raftTop + RAFT.h - TANK.level - 2)} fill={sea} opacity={0.45} />
        {/* glass: front rims + a highlight */}
        <rect x={TANK.x0} y={TANK.top} width={TANK.x1 - TANK.x0} height={TANK.bot - TANK.top} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={0.85} />
        <rect x={TANK.x0 + 26} y={TANK.top + 24} width={10} height={TANK.bot - TANK.top - 60} rx={5} fill="#FFFFFF" opacity={0.45} />
        <rect x={TANK.x1 - 60} y={TANK.top + 30} width={6} height={160} rx={3} fill="#FFFFFF" opacity={0.35} />
      </Layer>
      <Layer depth={1.25}>
        <Motes frame={f} n={30} x={500} y={80} w={1400} h={700} color="#FFFFFF" seed={4} size={3} drift={34} />
      </Layer>
    </>
  );
};

const TankWide: React.FC<{ f: number; len: number }> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.04 },
    { f: len + 40, x: 930, y: 540, zoom: 1.16 },
  ]);
  return (
    <Stage theme={N.theme} cam={cam} vignette={0.1} grain={0.5}>
      <Tank f={f} load={0}>
        {(top) => <Tick x={RAFT.x + 110} y={top} pxPerM={TPPM} frame={f} pose="hips" expression="happy" look={0.4 + 0.4 * Math.sin(f / 40)} />}
      </Tank>
      <Layer depth={0}>
        <g opacity={ramp(f, 16, 30)}>
          <Pill x={150} y={150} text="MODEL" fill={pillFill(N)} color={N.light} dot={L12_COLORS.seaGlass} size={22} />
        </g>
      </Layer>
    </Stage>
  );
};

// 2-03 → 2-04 · push down past the surface into the root; the heat bands brighten with depth; on "hotter, denser" the
// mantle texture tightens; ZoomThrough into the texture → the tank.
const RootPush: React.FC<{ f: number; len: number; c: CL02 }> = ({ f, len, c }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 600, zoom: 1.12 },
    { f: len + 10, x: CX, y: SURF + CRUST + ROOT - 10, zoom: 2.7 },
  ]);
  const dense = ramp(f, c.hotter - c.below - 6, c.hotter - c.below + 30);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.24} grain={0.5}>
      <Section f={f} heat={0.6 + 0.4 * ramp(f, 0, len)} dense={dense} glow={0.25 * dense} />
      <Layer depth={0}>
        <g opacity={ramp(f, c.hotter - c.below - 4, c.hotter - c.below + 10)}>
          <Pill x={150} y={150} text="HOT, DENSE, SOLID ROCK" fill={pillFill(F)} color={F.text} dot={F.light} size={22} />
        </g>
      </Layer>
    </Stage>
  );
};

const ShotRootTank: ShotFC<CL02> = ({ f, len, c }) => {
  const ztAt = c.tank - c.below - ZT + 8;
  const u = prog(f, ztAt, ZT);
  if (f < ztAt) return <Pop f={f}><RootPush f={f} len={ztAt + ZT} c={c} /></Pop>;
  const tank = <TankWide f={f - ztAt} len={len - ztAt} />;
  if (u >= 1) return tank;
  return <ZoomThrough t={u} focal={{ x: 960, y: 700 }} maxScale={6} from={<RootPush f={f} len={ztAt + ZT} c={c} />} to={tank} />;
};

// 2-05 · Tick heaves a block onto the raft: the raft sinks, the fluid bulges up around it in slow ripples.
const ShotHeave: ShotFC<CL02> = ({ f, len, c }) => {
  const hit = c.load - (c.load - 20) + 6; // the block lands 26 frames into the shot ("Load it")
  const drop = smooth(ramp(f, hit - 10, hit));
  const load = smooth(ramp(f, hit, hit + 34));
  const cam = cameraAt(f, [
    { f: 0, x: 930, y: 440, zoom: 1.75 },
    { f: len + 30, x: 950, y: 470, zoom: 1.95 },
  ]);
  const bx = RAFT.x + 190;
  return (
    <Pop f={f}>
      <Stage theme={N.theme} cam={cam} vignette={0.1} grain={0.5}>
        <Tank f={f + 200} load={load}>
          {(top) => (
            <>
              <Tick x={RAFT.x + 100} y={top} pxPerM={TPPM} frame={f} pose="heave" poseTo="press" poseT={Math.min(1.7, Math.max(0, (f - hit + 12) / 16))} expression="determined" expressionTo="worried" expressionT={ramp(f, hit, hit + 14)} look={0.9} squash={impact(f, hit, 0.08, 10)} />
              <SlateBlock x={bx} y={top - (1 - drop) * 150} w={84} h={62} d={24} family={N} light={20} shadow={false} color={L12_COLORS.slateDark} squash={impact(f, hit, 0.14, 10)} />
            </>
          )}
        </Tank>
      </Stage>
    </Pop>
  );
};

// 2-06 + 2-07 · Tick shoves the block overboard: a splash ring, the raft rises; the camera pulls out to the whole tank
// and the word arrives: "Isostasy" (#12); Tick taps the raft with the staff and looks at us.
const ShotUnloadIso: ShotFC<CL02> = ({ f, len, c }) => {
  const shove = 18; // "Unload it" lands 18 frames in
  const iso = c.iso - (c.unload - 18);
  const slide = smooth(ramp(f, shove - 8, shove + 6));
  const fallT = ramp(f, shove + 6, shove + 60);
  const splash = f - (shove + 16);
  const load = 1 - smooth(ramp(f, shove + 8, shove + 50));
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 460, zoom: 1.85 },
    { f: shove + 30, x: 990, y: 480, zoom: 1.7 },
    { f: iso + 10, x: 960, y: 520, zoom: 1.0 },
    { f: len + 40, x: 940, y: 530, zoom: 1.06 },
  ]);
  const word = ramp(f, iso, iso + 14);
  const tap = f > iso + 20 ? Math.max(0, Math.sin((f - iso - 20) / 5)) * (f < iso + 70 ? 1 : 0) : 0;
  const bx0 = RAFT.x + 190;
  return (
    <Pop f={f}>
      <Stage theme={N.theme} cam={cam} vignette={0.1} grain={0.5}>
        <Tank
          f={f + 400}
          load={load}
          splash={splash}
          under={fallT > 0 ? <SlateBlock x={RAFT.x + RAFT.w + 50} y={TANK.level + 40 + fallT * 200} w={84} h={62} d={24} family={N} light={20} shadow={false} color={L12_COLORS.slateDark} opacity={0.75} /> : undefined}
        >
          {(top) => (
            <>
              {f < iso ? (
                <Tick x={RAFT.x + 100 + slide * 26} y={top} pxPerM={TPPM} frame={f} pose="press" poseTo="cheer" poseT={Math.min(1.7, Math.max(0, (f - shove - 14) / 20))} expression="determined" expressionTo="happy" expressionT={ramp(f, shove + 6, shove + 20)} look={0.8} />
              ) : (
                <Tick x={RAFT.x + 126} y={top + tap * 3} pxPerM={TPPM} frame={f} staff pose="cheer" poseTo="hold" poseT={Math.min(1.7, (f - iso) / 18)} expression="proud" look={0.1} headTilt={4} />
              )}
              {fallT <= 0 ? <SlateBlock x={bx0 + slide * 130} y={top} w={84} h={62} d={24} family={N} light={20} shadow={false} color={L12_COLORS.slateDark} /> : null}
            </>
          )}
        </Tank>
        <Layer depth={0}>
          <g opacity={word} transform={`translate(0 ${((1 - word) * 18).toFixed(1)})`}>
            <Kicker x={150} y={130} text="The key" color={N.dim} size={24} />
            <Headline x={150} y={290} lines={["Isostasy"]} size={120} color={N.text} accent={N.second} />
          </g>
          <g opacity={1 - word}>
            <Pill x={150} y={150} text="MODEL" fill={pillFill(N)} color={N.light} dot={L12_COLORS.seaGlass} size={22} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ---------------------------------------------------------------------------------------------
// 2-08 + 2-09 · the cutaway again (the crust where the raft was): India slides in from the left under arrows; the two
// slabs, drawn in the same hatch and colour, meet; neither dips under the other; they jam.
const ShotIndia: ShotFC<CL02> = ({ f, len, c }) => {
  const meet = c.same - c.india - 20;
  const slide = smooth(ramp(f, 4, meet));
  const contact = CX - 250;
  const gap = 760 * (1 - slide); // the sea between them closes
  const edge = contact - gap; // India's leading edge
  const jam = f - meet;
  const shake = jam >= 0 && jam < 22 ? Math.sin(jam * 2.2) * (1 - jam / 22) * 10 : 0;
  const cam = cameraAt(f, [
    { f: 0, x: 560, y: 540, zoom: 1.15 },
    { f: meet, x: 720, y: 540, zoom: 1.3 },
    { f: len + 40, x: 740, y: 530, zoom: 1.46 },
  ]);
  const sameT = ramp(f, c.same - c.india - 4, c.same - c.india + 10);
  return (
    <Pop f={f}>
      <AbsoluteFill style={{ transform: `translate(${shake.toFixed(1)}px, 0)` }}>
        <Stage theme={F.theme} cam={cam} vignette={0.2} grain={0.5}>
          <Section f={f} root={0} peaks={jam > 0 ? Math.min(0.12, jam / 400) : 0} heat={0.6} india={edge} gap={gap} squeeze={jam > 0 ? Math.min(1, jam / 30) : 0}>
            {/* motion arrows riding India */}
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${edge - 420 + i * 120} ${SURF + 46} l 44 26 l -44 26`} fill="none" stroke="#FFF1D6" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={(jam > 0 ? Math.max(0.15, 1 - jam / 30) : 1) * (0.6 + 0.4 * (0.5 + 0.5 * Math.sin(f / 5 - i)))} />
            ))}
            {jam >= 0 && jam < 50 ? <Puffs frame={jam + 40} x={edge} y={SURF - 6} color={alpha("#E9D9BC", 0.8)} period={12} size={16} rise={0.8} drift={0.2} life={40} seed={5} /> : null}
          </Section>
          <Layer depth={0}>
            <Kicker x={150} y={150} text="50 million years ago" color={"#3A1208"} size={26} />
            <g opacity={ramp(f, 12, 26)}>
              <Pill x={150} y={206} text="INDIA" fill={pillFill(F)} color={F.text} dot={CRUST_COL} size={22} />
            </g>
            <g opacity={sameT}>
              <Pill x={150} y={254} text="SAME DENSITY" fill={pillFill(F)} color={F.text} dot={F.light} size={22} />
            </g>
          </Layer>
        </Stage>
      </AbsoluteFill>
    </Pop>
  );
};

// 2-10 · the crust crumples: it thickens upward AND downward at once (two arrows); a bracket doubles 35 → 70: ×2 (#4).
const ShotCrumple: ShotFC<CL02> = ({ f, len, c }) => {
  const grow = smooth(ramp(f, 6, c.doubled - c.crumple + 16));
  const upT = ramp(f, c.up - c.crumple - 4, c.up - c.crumple + 8);
  const dnT = ramp(f, c.down - c.crumple - 4, c.down - c.crumple + 8);
  const x2 = ramp(f, c.doubled - c.crumple, c.doubled - c.crumple + 12);
  const shake = f < 26 ? Math.sin(f * 2.4) * (1 - f / 26) * 14 : 0; // 1.5 % on the boom
  const cam = cameraAt(f, [
    { f: 0, x: 950, y: 560, zoom: 1.24 },
    { f: len + 40, x: 960, y: 600, zoom: 1.34 },
  ]);
  const arrow = (y0: number, y1: number, t: number) => (
    <g opacity={t} stroke={F.text} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1={CX + 300} y1={y0} x2={CX + 300} y2={y0 + (y1 - y0) * t} />
      <path d={`M${CX + 278} ${y0 + (y1 - y0) * t + (y1 > y0 ? -22 : 22)} L${CX + 300} ${y0 + (y1 - y0) * t} L${CX + 322} ${y0 + (y1 - y0) * t + (y1 > y0 ? -22 : 22)}`} />
    </g>
  );
  return (
    <Pop f={f}>
      <AbsoluteFill style={{ transform: `translate(0, ${shake.toFixed(1)}px)` }}>
        <Stage theme={F.theme} cam={cam} vignette={0.2} grain={0.5}>
          <Section f={f} root={grow} peaks={grow} heat={0.65}>
            {arrow(SURF - 30, SURF - 110, upT)}
            {arrow(SURF + CRUST + 30, SURF + CRUST + 30 + 110, dnT)}
            <Bracket x={CX - 40} y0={SURF - 16 * grow} y1={SURF + CRUST + ROOT * grow} t={1} color={F.text} />
            {f < 60 ? <Puffs frame={f + 30} x={CX - 250} y={SURF - 14} color={alpha("#E9D9BC", 0.7)} period={10} size={14} rise={0.9} drift={0.3} life={36} seed={8} /> : null}
          </Section>
          <Layer depth={0}>
            <g opacity={x2} transform={`translate(0 ${((1 - x2) * 14).toFixed(1)})`}>
              <Metric x={150} y={270} value="×2" size={150} color={F.text} />
              <Pill x={154} y={326} text="35 km → 70 km" fill={pillFill(F)} color={F.text} dot={CRUST_COL} size={20} />
            </g>
          </Layer>
        </Stage>
      </AbsoluteFill>
    </Pop>
  );
};

// ---------------------------------------------------------------------------------------------
// 2-11 + 2-12 · two gauges on one scale (20 px per km): HEIGHT, short, vermilion, 4,500 m (#5); ROOT, slate, running
// 35 km down off the frame (#4). Tick between them looks at the short one, then the long one; the camera tilts down the
// ROOT bar into the heat and Tick leans over the edge.
const G2 = 20; // px per km here
const ShotTwoGauges: ShotFC<CL02> = ({ f, len, c }) => {
  const g = c.gauges;
  const ground = 430;
  const hT = smooth(ramp(f, 6, c.m4500 - g + 10));
  const tilt0 = c.extra - g + 6;
  const rT = smooth(ramp(f, tilt0 - 10, c.km35 - g + 30));
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 420, zoom: 1.12 },
    { f: tilt0, x: 960, y: 440, zoom: 1.16 },
    { f: len - 6, x: 980, y: 800, zoom: 1.2 },
    { f: len + 40, x: 980, y: 840, zoom: 1.22 },
  ]);
  const hx = 640;
  const rx = 1180;
  const tx = 925;
  const leanT = Math.min(1.7, Math.max(0, (f - tilt0 - 6) / 22));
  const heightPx = 4.5 * G2; // 4,500 m (#5)
  const rootPx = 35 * G2; // 35 km (#4)
  const hp = pulse(f, 50, 0.1, 3);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.22} grain={0.5}>
        <Layer depth={0.05}>
          <Sky stops={["#3A1410", "#5A1C0E", "#7A2C12", "#B04A18"]} />
        </Layer>
        <Layer depth={0.5} haze={{ color: F.haze, amount: 0.2 }}>
          <path d={`M-600 ${ground + 30} L200 ${ground - 20} L700 ${ground + 10} L1300 ${ground - 26} L2600 ${ground + 20} L2600 2200 L-600 2200 Z`} fill={mixHex(F.far, F.shadow, 0.35)} />
        </Layer>
        <Layer depth={1}>
          {/* the ledge Tick stands on = sea level; below it the crust drops away */}
          {[
            `M-600 ${ground} H${rx - 70} V${ground + 2400} H-600 Z`,
            `M${rx + 90} ${ground} H2600 V${ground + 2400} H${rx + 90} Z`,
          ].map((d, i) => (
            <Form key={i} d={d} fill={mixHex(CRUST_COL, "#2B4A5C", 0.45)} light={90} shadow={false} rim="#FFE2B8" rimWidth={4} rimOpacity={0.9}>
              <HazeBand y={ground + 200} h={1100} color="#7A2C12" strength={0.85} />
              <g stroke={mixHex(CRUST_COL, F.shadow, 0.5)} strokeWidth={2} opacity={0.45}>
                {Array.from({ length: 9 }, (_, k) => (
                  <path key={k} d={`M-600 ${ground + 70 + k * 96} q 800 ${k % 2 ? 26 : -22} 1600 0 t 1600 0`} fill="none" />
                ))}
              </g>
            </Form>
          ))}
          {/* the shaft the ROOT gauge hangs in, glowing from below */}
          <Sky stops={["#2B0C08", "#5A1C0E", "#B04A18", "#FF8A2A"]} x={rx - 70} y={ground} w={160} h={rootPx + 300} />
          <LightWash x={rx + 10} y={ground + rootPx} rx={260} ry={260} color="#FF7A30" strength={0.6 * hp} />
          <Embers frame={f} x0={rx - 60} x1={rx + 80} y={ground + rootPx + 40} n={22} color="#FFB347" seed={4} rise={2.2} life={170} size={2.6} wiggle={12} />
          {/* HEIGHT: short, vermilion */}
          <rect x={hx - 14} y={ground - heightPx * hT} width={28} height={heightPx * hT} fill={P.vermilion} />
          <path d={`M${hx - 30} ${ground - heightPx * hT} h 60`} stroke={F.text} strokeWidth={3} opacity={hT} />
          <text x={hx} y={ground - heightPx - 26} textAnchor="middle" style={{ fontFamily: "'Anton', sans-serif", fontSize: 26, letterSpacing: 5, fill: F.dim }}>HEIGHT</text>
          {/* ROOT: long, slate, off the frame */}
          <rect x={rx - 14} y={ground} width={28} height={rootPx * rT} fill="#9FB4BF" stroke="#E3ECEF" strokeWidth={2} />
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} opacity={rT * rootPx > i * 5 * G2 ? 0.9 : 0}>
              <line x1={rx + 14} y1={ground + i * 5 * G2} x2={rx + 32} y2={ground + i * 5 * G2} stroke={F.text} strokeWidth={2} />
              <text x={rx + 40} y={ground + i * 5 * G2 + 7} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 20, fill: F.dim, fontVariantNumeric: "tabular-nums" }}>{i === 0 ? "0" : `${i * 5} km`}</text>
            </g>
          ))}
          <text x={rx} y={ground - 22} textAnchor="middle" style={{ fontFamily: "'Anton', sans-serif", fontSize: 26, letterSpacing: 5, fill: F.dim }}>ROOT</text>
          <GroundShadow x={tx + 6} y={ground + 2} rx={50} color={F.shadow} opacity={0.5} blur={8} />
          <Tick x={f > tilt0 ? tx + 96 * smooth(ramp(f, tilt0 - 14, tilt0 + 8)) : tx} y={ground} pxPerM={120} frame={f} facing={f < c.m4500 - g + 30 ? -1 : 1} pose="think" poseTo="lean" poseT={leanT} expression="thinking" expressionTo="worried" expressionT={ramp(f, tilt0, tilt0 + 16)} look={0.8} outline={F.shadow} />
        </Layer>
        <Layer depth={0}>
          <g opacity={ramp(f, c.m4500 - g - 4, c.m4500 - g + 10) * (1 - ramp(f, tilt0 + 20, tilt0 + 40))}>
            <Metric x={150} y={250} value="4,500" unit="m" size={104} color={F.text} unitColor={F.dim} />
            <Pill x={154} y={300} text="ABOVE SEA LEVEL" fill={pillFill(F)} color={F.text} dot={P.vermilion} size={18} />
          </g>
          <g opacity={ramp(f, c.km35 - g - 4, c.km35 - g + 10)}>
            <Pill x={150} y={150} text="ROOT · 35 km OF EXTRA CRUST" fill={pillFill(F)} color={F.text} dot={L12_COLORS.slate} size={22} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// 2-13 · the ratio: one bone block above the line, seven slate blocks below it, dropping in one by one; "7 : 1" (#5).
const ShotRatio: ShotFC<CL02> = ({ f, len }) => {
  const line = 330;
  const bw = 150;
  const bh = 78;
  const x = 885;
  const n = Math.min(7, Math.max(0, Math.floor((f - 6) / 9) + 1));
  return (
    <Pop f={f}>
      <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.07, panX: 0.02, panY: 0.02, frames: len + 60, seed: 3 }} vignette={0.22} grain={0.5}>
        <Layer depth={0.05}>
          <Sky stops={["#3A1410", "#5A1C0E", "#7A2C12", "#B04A18"]} />
          <LightWash x={960} y={1100} rx={1100} ry={420} color="#FF7A30" strength={0.5 * pulse(f, 50, 0.1)} />
        </Layer>
        <Layer depth={1}>
          <rect x={560} y={line - 2} width={800} height={5} fill={F.text} />
          <text x={1376} y={line + 8} textAnchor="start" style={{ fontFamily: "'Anton', sans-serif", fontSize: 20, letterSpacing: 3, fill: F.dim }}>SEA LEVEL</text>
          <SlateBlock x={x} y={line - 3} w={bw} h={bh} d={34} family={F} light={KEY_LIGHT} color="#E9D9BC" shadow={false} squash={impact(f, 2, 0.14, 9)} />
          {Array.from({ length: n }, (_, i) => {
            const born = 6 + i * 9;
            const d = smooth(ramp(f, born, born + 7));
            return (
              <g key={i} opacity={Math.min(1, d * 3)}>
                <SlateBlock x={x} y={line + 4 + (i + 1) * (bh + 4) - (1 - d) * 60} w={bw} h={bh} d={34} family={F} light={KEY_LIGHT} shadow={false} squash={impact(f, born + 7, 0.12, 8)} />
              </g>
            );
          })}
          <Embers frame={f} x0={500} x1={1400} y={1100} n={18} color="#FFB347" seed={9} rise={1.3} life={130} size={2.4} wiggle={14} />
        </Layer>
        <Layer depth={0}>
          <Counter x={150} y={280} value={n} max={9} digits={1} size={150} color={F.text} />
          <text x={250} y={280} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 150, fill: F.text }}>: 1</text>
          <Pill x={154} y={336} text="ROOT PER km OF HEIGHT" fill={pillFill(F)} color={F.text} dot={L12_COLORS.slate} size={20} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 2-14 · the cutaway: the root's base begins to glow; the dashed ceiling line returns above the peaks (unlabelled);
// Tick on top looks down, then up at the line; the camera plunges toward the glowing root (→ scene 3).
const ShotCeilingRoot: ShotFC<CL02> = ({ f, len, c }) => {
  const ce = c.ceiling - c.holds;
  const glow = ramp(f, 10, ce + 20);
  const lineT = ramp(f, ce, ce + 14);
  const dive = len - 30;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 610, zoom: 1.0 },
    { f: ce - 6, x: 950, y: 590, zoom: 1.12 },
    { f: dive, x: 950, y: 560, zoom: 1.22 },
    { f: len + 4, x: CX, y: SURF + CRUST + ROOT + 10, zoom: 4.6 },
  ]);
  const { top } = crustLines(1, 1);
  const ty = top.reduce((best, p) => (Math.abs(p[0] - (CX + 40)) < Math.abs(best[0] - (CX + 40)) ? p : best), top[0])[1];
  const hudOut = 1 - ramp(f, dive, dive + 12);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.22} grain={0.5}>
        <Section f={f} heat={0.7 + 0.3 * glow} glow={glow}>
          {/* the ceiling line above the peaks: "just above" the highest, no number */}
          <line x1={CX - 620} y1={SURF - 9 * KM - 4} x2={CX + 520} y2={SURF - 9 * KM - 4} stroke="#2B0C08" strokeWidth={3} strokeDasharray="12 9" opacity={lineT} />
          <Tick x={CX + 40} y={ty + 1} pxPerM={15} frame={f} pose="stand" expression="thinking" look={f < ce ? -0.2 : 0.8} headTilt={f < ce ? 16 : -14} outline={F.shadow} />
        </Section>
        <Layer depth={0}>
          <g opacity={hudOut}>
            <L12Gauge family={F} value={HEIGHTS.tibet /* 4,500 m, #5 */} base="ABOVE SEA LEVEL" ceiling={lineT > 0.5 ? { v: 9000 } : null} />
            <Pill x={150} y={930} text="NOT TO SCALE" fill={pillFill(F)} color={F.text} size={16} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ---------------------------------------------------------------------------------------------

export const SceneL02: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL02(t);
  const shots: ShotDef<CL02>[] = [
    { from: 0, S: ShotCutaway, id: "2-01" },
    { from: c.below, S: ShotRootTank, id: "2-03" },
    { from: c.load - 20, S: ShotHeave, id: "2-05" },
    { from: c.unload - 18, S: ShotUnloadIso, id: "2-06" },
    { from: c.india, S: ShotIndia, id: "2-08" },
    { from: c.crumple, S: ShotCrumple, id: "2-10" },
    { from: c.gauges, S: ShotTwoGauges, id: "2-11" },
    { from: c.ratio, S: ShotRatio, id: "2-13" },
    { from: c.holds, S: ShotCeilingRoot, id: "2-14" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL02 = (t: SceneTiming): Cue[] => {
  const c = cuesL02(t);
  return [
    { at: 0, file: SFX.rumble, vol: 0.2, dur: c.tank - 20, fadeIn: 20, fadeOut: 30 },
    { at: c.seventy - 6, file: SFX.click, vol: 0.16, dur: 12 },
    { at: c.seventy + 10, file: SFX.pop, vol: 0.22, dur: 20 },
    { at: c.twice, file: SFX.pop, vol: 0.2, dur: 20 },
    ...cutHit(c.below, 0.16),
    { at: c.tank - ZT + 4, file: SFX.deepWhoosh, vol: 0.26, dur: 60 },
    { at: c.tank + 10, file: SFX.pop, vol: 0.18, dur: 20 },
    { at: c.tank + 30, file: SFX.swirl, vol: 0.1, dur: 50 },
    ...cutHit(c.load - 20),
    { at: c.load + 6, file: SFX.popLong, vol: 0.26, dur: 30 },
    { at: c.load + 12, file: SFX.swirl, vol: 0.14, dur: 50 },
    ...cutHit(c.unload - 18),
    { at: c.unload, file: SFX.pop, vol: 0.22, dur: 20 },
    { at: c.unload + 8, file: SFX.swirl, vol: 0.18, dur: 50 },
    { at: c.iso, file: SFX.chime, vol: 0.24, dur: 60 },
    ...cutHit(c.india),
    { at: c.india, file: SFX.rumble, vol: 0.24, dur: c.crumple - c.india, fadeIn: 16, fadeOut: 20 },
    { at: c.ranInto, file: SFX.uBoom, vol: 0.16, dur: 90, fadeOut: 30 },
    { at: c.same - 20, file: SFX.uBoom, vol: 0.36, dur: 110, fadeOut: 30 },
    ...cutHit(c.crumple),
    { at: c.crumple, file: SFX.boom, vol: 0.34, dur: 120, fadeOut: 40 },
    { at: c.crumple + 6, file: SFX.debris, vol: 0.22, dur: 90, fadeOut: 30 },
    { at: c.doubled, file: SFX.pop, vol: 0.24, dur: 20 },
    ...cutHit(c.gauges),
    { at: c.m4500, file: SFX.popLong, vol: 0.22, dur: 30 },
    { at: c.extra + 6, file: SFX.deepWhoosh, vol: 0.2, dur: 70 },
    { at: c.km35, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...cutHit(c.ratio),
    ...Array.from({ length: 7 }, (_, i) => ({ at: c.ratio + 13 + i * 9, file: SFX.pop, vol: 0.16, dur: 14 })),
    ...cutHit(c.holds),
    { at: c.holds, file: SFX.rumble, vol: 0.26, dur: c.end - c.holds, fadeIn: 30, fadeOut: 10 },
    { at: c.ceiling, file: SFX.pop, vol: 0.2, dur: 20 },
    { at: c.end - 70, file: SFX.riser, vol: 0.16, dur: 70, fadeOut: 8 },
  ];
};
