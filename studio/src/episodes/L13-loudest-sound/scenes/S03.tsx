// L13 scene l03 "The ceiling" (storyboard §3 "3 ·": shots 3-01…3-18 + ChapterCard 2 (4-00), script lines 19-26,
// petrol → STUDIO_SET → ember → noon, Act I). Shot components: 3-01 (the flat line, the vacuum floor, a wave) · 3-02
// (Tick surfs it) · 3-03 (Tick on the floor, a trough comes down) · 3-04 (the staff clanks on the floor, troughs flatten)
// · 3-05 (the wave grows, clipped) · 3-06 (the biggest clean wave: 1 atm) · 3-07 (the bracket fed into the fold) · 3-08
// (the fold becomes the gauge: 194, the ceiling gets its number; MATCH) · 3-09 (studio: the gauge locked, trembling) ·
// 3-10 (the LAW stamp) · 3-11 (inside the plate: the clipped wave; shrug) · 3-12 (ember: the pump) · 3-13 (sine →
// sawtooth → one front) · 3-14 KEY ART (the shock wall sweeping, palms bending, Tick braced, gauge pinned) · 3-15 ("300
// dB?" placard, struck, knocked over by the next front) · 3-16 (chevrons above the ceiling, streaks) · 3-17 + 3-18 (the
// fork, two signposts; Tick takes the left path) · BlackBeat + sting → ChapterCard 2 "A Rocket and a Volcano".
// Numbers drawn, each with its sources.md row: 101,325 Pa · 0 Pa · VACUUM (#8 #11) · 1 atm swing · ≈ 101,000 Pa (#8 #11)
// · 194 dB, the ceiling's first label at "a hundred and ninety-four decibels" (#8 #9 #11, F1) · "300 dB?" struck
// through (#11 #23, F8: generic, never linked to Krakatoa) · PAST 194: NOT A SOUND (#11 #12). No cover-ears: Tick braces
// with `shield` (F17). Nothing about Krakatoa's value anywhere (F3).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  BlackBeat,
  Bloom,
  CloudRack,
  CycClouds,
  Embers,
  Emissive,
  Family,
  Flock,
  GroundShadow,
  HazeBand,
  Headline,
  IF2,
  Kicker,
  Layer,
  LightWash,
  Metric,
  Motes,
  STUDIO_SET,
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
import { DB, L13Gauge } from "../L13Gauge";
import { Notebook, Palm } from "../props";
import { PressureWave, Rings, ShockFront } from "../sound";
import { ShotDef, ShotFC, actBreakAt, playShots } from "../shots";
import { Cue, SFX, cutHit, sting } from "./cue-types";

const P = familyOf("petrol");
const E = familyOf("ember");
const N = familyOf("noon");
const DUSK = familyOf("dusk");
const S = STUDIO_SET;
/** STUDIO_SET for the gauge: a dark petrol plate with light type on the teal cyc (the family theme is still bone). */
const GS: Family = { ...S, text: "#FFF4DE", theme: { ...S.theme, bg: "#1E4A5C", panel: "#2C6A74", line: "#FFF4DE", text: "#FFF4DE", dim: "#D9F1E7", dark: true } };
const SAF = L13_COLORS.saffron;
const TEAL = L13_COLORS.teal;
const BONE = L13_COLORS.bone;
const LINE = 470; // the flat line (101,325 Pa)
const FLOOR = 820; // the vacuum floor (0 Pa): 350 px = one atmosphere
const ATM = FLOOR - LINE;
const CEILING = { v: DB.ceiling /* #11 */ };
const BIG = { x: 760, y: 150, height: 720 }; // the big gauge (3-08 / 3-09, MATCH)

export const cuesL03 = (t: SceneTiming) => {
  const { at, p, end, frac } = cueKit(t);
  return {
    start: 0,
    surf: p(0, "For every push"), // 3-02
    floor: p(0, "And the pull has a floor"), // 3-03
    jab: at(1), // 3-04
    grow: at(2), // 3-05
    atm: p(2, "That swing is one atmosphere"), // 3-06
    feed: at(3), // 3-07
    gauge: p(3, "and the ladder reads"), // 3-08
    n194: p(3, "a hundred and ninety-four decibels"),
    locked: at(4), // 3-09
    law: p(4, "It isn't a law"), // 3-10
    quiet: p(4, "The quiet half"), // 3-11
    pump: at(5), // 3-12
    piles: p(5, "The wave piles up"), // 3-13
    wall: p(5, "a shock wave"), // 3-14 (key art I)
    key: frac(5, 0.85),
    placard: at(6), // 3-15
    past: p(6, "in air, past about"), // 3-16
    fork: at(7), // 3-17
    pick: p(7, "And the loudest sound"), // 3-18
    last: end(7),
    brk: actBreakAt(t).start,
    end: t.frames,
  };
};
export type CL03 = ReturnType<typeof cuesL03>;

const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/** A tag that keeps its units' case (Pa, dB). */
const Tag: React.FC<{ x: number; y: number; text: string; F: Family; dot?: string; size?: number; align?: "start" | "end" | "middle" }> = ({ x, y, text, F, dot, size = 24, align = "start" }) => {
  const w = text.length * size * 0.6 + size * (dot ? 2.3 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={pillFill(F)} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.1, fill: "#FFF4DE" }}>
        {text}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------
// fields: petrol air (moon fill 300°, the wave as emitter), the ember field, the studio cyc

const PetrolField: React.FC<{ f: number; children: React.ReactNode; hud?: React.ReactNode; seed?: number }> = ({ f, children, hud, seed = 3 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={P} />
    </Layer>
    <Layer depth={0.12}>
      <Bloom x={1560} y={170} r={380} color={P.light} core={30} coreColor="#F4FBF6" strength={0.5 + 0.08 * Math.sin(f / 16)} />
    </Layer>
    <Layer depth={0.3}>
      <CloudRack f={f} n={4} x0={-700} x1={2700} y0={140} y1={280} size={100} speed={2.2} body={alpha("#3FB0A4", 0.5)} under={alpha("#0A3A42", 0.5)} seed={seed} />
    </Layer>
    <Layer depth={0.9}>
      <rect x={-1400} y={FLOOR} width={4800} height={900} fill={alpha(P.shadow, 0.55)} />
    </Layer>
    <Layer depth={1}>{children}</Layer>
    <Layer depth={1.2}>
      <Motes frame={f} n={24} x={-100} y={40} w={2100} h={980} color={alpha(BONE, 0.7)} seed={seed} size={4.5} drift={44} />
    </Layer>
    {hud ? <Layer depth={0}>{hud}</Layer> : null}
  </>
);

const EmberField: React.FC<{ f: number; children: React.ReactNode; hud?: React.ReactNode; seed?: number; streak?: number }> = ({ f, children, hud, seed = 5, streak = 0 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={E} />
    </Layer>
    <Layer depth={0.3}>
      <CloudRack f={f} n={4} x0={-700} x1={2700} y0={160} y1={340} size={120} speed={2.6} body={alpha("#8F4420", 0.75)} under={alpha("#2B0C08", 0.6)} top={alpha("#FFB347", 0.4)} seed={seed} />
    </Layer>
    <Layer depth={0.7}>
      <path d={`M-1400 ${FLOOR + 40} Q 0 ${FLOOR - 40} 1200 ${FLOOR + 10} Q 2400 ${FLOOR + 50} 3400 ${FLOOR} L3400 2400 L-1400 2400 Z`} fill={E.near} />
    </Layer>
    <Layer depth={1}>{children}</Layer>
    <Layer depth={1.15}>
      <Embers frame={f} x0={-100} x1={2020} y={1080} n={36} color={E.light} seed={seed} size={6} />
      {streak > 0 ? <Streamers f={f} n={14} x0={-300} x1={2300} y0={120} y1={980} len={260} width={5} speed={streak} color={alpha(L13_COLORS.saffronCore, 0.8)} opacity={0.5} seed={seed + 2} /> : null}
    </Layer>
    {hud ? <Layer depth={0}>{hud}</Layer> : null}
  </>
);

const StudioRoom: React.FC<{ f: number; children: React.ReactNode; hud?: React.ReactNode; seed?: number }> = ({ f, children, hud, seed = 4 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={S} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f} y={90} n={5} seed={seed} />
    </Layer>
    <Layer depth={0.6}>
      <rect x={-1400} y={830} width={4800} height={900} fill={mixHex(S.mid, "#FFE4A8", 0.2)} />
      <HazeBand y={700} h={200} color={S.haze} strength={0.8} x={-1400} w={4800} />
    </Layer>
    <Layer depth={1}>
      <rect x={-1400} y={900} width={4800} height={900} fill={mixHex(S.mid, S.near, 0.5)} />
      {children}
    </Layer>
    <Layer depth={1.25}>
      <Motes frame={f} n={20} x={-100} y={60} w={2100} h={860} color={alpha("#FFF4DE", 0.8)} seed={seed} size={5} drift={40} />
    </Layer>
    {hud ? <Layer depth={0}>{hud}</Layer> : null}
  </>
);

const Wave: React.FC<{ f: number; amp: number; clip?: boolean; speed?: number; wl?: number; color?: string; steepen?: number; phase?: number; y?: number; floorY?: number }> = ({ f, amp, clip = false, speed = 6, wl = 380, color = TEAL, steepen = 0, phase = 0, y = LINE, floorY = FLOOR }) => (
  <PressureWave f={f} y={y} x0={-200} x1={2120} amp={amp} wavelength={wl} speed={speed} floorY={floorY} floorColor={BONE} clip={clip} steepen={steepen} phase={phase} color={color} width={6} fillAbove={alpha(BONE, 0.2)} fillBelow={alpha(P.shadow, 0.45)} />
);

// ---------------------------------------------------------------------------------------------
// 3-01 · the flat line at mid-frame, the hard vacuum floor near the bottom, a wave on the flat line.
const ShotField: ShotFC<CL03> = ({ f, len }) => (
  <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.07, panX: 0.02, panY: 0.01, frames: len + 60, seed: 1 }} vignette={0.2} grain={0.5}>
    <PetrolField
      f={f}
      hud={
        <g>
          <Tag x={120} y={LINE - 140} text="101,325 Pa" /* #8 */ F={P} dot={TEAL} size={26} />
          <Tag x={120} y={FLOOR + 70} text="0 Pa · VACUUM" /* #11 */ F={P} dot={BONE} size={26} />
        </g>
      }
    >
      <Wave f={f} amp={70} />
    </PetrolField>
  </Stage>
);

// 3-02 · "swings both ways": crests glow light (push), troughs deepen (pull); Tick surfs the wave on its staff.
const surfY = (f: number, x: number, amp: number) => {
  const theta = ((x + 200 - f * 6) / 380) * Math.PI * 2;
  return LINE - amp * Math.sin(theta);
};
const ShotSurf: ShotFC<CL03> = ({ f, len }) => {
  const amp = 130;
  const x = 960;
  const y = surfY(f, x, amp);
  const slope = (surfY(f, x + 30, amp) - surfY(f, x - 30, amp)) / 60;
  const ang = (Math.atan(slope) * 180) / Math.PI;
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.01, frames: len + 60, seed: 2 }} vignette={0.2} grain={0.5}>
        <PetrolField f={f + 100} seed={5}>
          <Wave f={f} amp={amp} />
          <g transform={`rotate(${ang.toFixed(1)} ${x} ${y})`}>
            <rect x={x - 110} y={y - 16} width={220} height={14} rx={7} fill={L13_COLORS.vermilion} />
            <rect x={x - 110} y={y - 16} width={220} height={4} rx={2} fill="#FFF4DE" opacity={0.7} />
            <Tick x={x} y={y - 16} pxPerM={130} frame={f} facing={1} pose="shrug" expression="happy" look={0.5} tilt={-ang * 0.4} />
          </g>
        </PetrolField>
      </Stage>
    </Pop>
  );
};

// 3-03 · "The pull has a floor": Tick stands on the vacuum line; a trough comes down toward it; Tick points down.
const ShotFloor: ShotFC<CL03> = ({ f, len }) => {
  const amp = 120 + 200 * ramp(f, 0, len);
  return (
    <Pop f={f}>
      <Stage theme={P.theme} cam={{ x: 1000 - f * 0.4, y: 680, zoom: 1.6 + f * 0.002 }} vignette={0.2} grain={0.5}>
        <PetrolField f={f + 200} seed={7}>
          <Wave f={f} amp={amp} />
          <GroundShadow x={1110} y={FLOOR + 2} rx={60} color={P.shadow} opacity={0.5} blur={8} />
          <Tick x={1100} y={FLOOR - 2} pxPerM={130} frame={f} facing={-1} pose="stand" poseTo="crouch-reach" poseT={Math.min(1.5, Math.max(0, (f - 10) / 16))} expression="thinking" look={0.4} headTilt={14} />
        </PetrolField>
      </Stage>
    </Pop>
  );
};

// 3-04 · Tick (large) jabs the staff below the floor; it clanks; troughs keep flattening on the line beside it.
const ShotJab: ShotFC<CL03> = ({ f, len }) => {
  const jabs = [10, Math.round(len * 0.45)];
  const jab = jabs.reduce((m, j) => (f >= j && f < j + 16 ? Math.sin(((f - j) / 16) * Math.PI) : m), 0);
  const ppm = 150;
  const tx = 620;
  const hand: [number, number] = [tx + ppm * 0.62, FLOOR - ppm * 0.5];
  const tip: [number, number] = [hand[0] + 70, FLOOR - 4 - (1 - jab) * 60];
  return (
    <Pop f={f}>
      <Stage theme={P.theme} cam={{ x: 860 + f * 0.3, y: 690, zoom: 2.15 }} vignette={0.2} grain={0.5}>
        <PetrolField f={f + 300} seed={9}>
          <Wave f={f} amp={420} clip />
          <line x1={hand[0] - 60} y1={hand[1] - 90} x2={tip[0]} y2={tip[1]} stroke={L13_COLORS.vermilion} strokeWidth={9} strokeLinecap="round" />
          {jabs.map((j) => (f >= j + 6 && f < j + 30 ? <circle key={j} cx={tip[0]} cy={FLOOR} r={10 + (f - j - 6) * 5} fill="none" stroke={L13_COLORS.saffronCore} strokeWidth={4} opacity={1 - (f - j - 6) / 24} /> : null))}
          <Tick x={tx} y={FLOOR - 2} pxPerM={ppm} frame={f} facing={1} pose="crouch-reach" expression="surprised" look={0.5} headTilt={12} squash={impact(f, jabs[1] + 8, 0.08, 8)} />
        </PetrolField>
      </Stage>
    </Pop>
  );
};

// 3-05 · the wave grows each cycle: troughs hit the floor and flatten while the crests keep climbing; pull back.
const ShotGrow: ShotFC<CL03> = ({ f, len }) => {
  const amp = 70 + 380 * ramp(f, 0, len);
  return (
    <Pop f={f}>
      <Stage theme={P.theme} cam={{ x: 960, y: 560 - f * 0.2, zoom: 1.12 - 0.17 * ramp(f, 0, len) }} vignette={0.2} grain={0.5}>
        <PetrolField f={f + 400} seed={11}>
          <Bloom x={960} y={LINE} r={700} color={TEAL} strength={0.25 + 0.1 * Math.sin(f / 8)} />
          <Wave f={f} amp={amp} clip />
        </PetrolField>
      </Stage>
    </Pop>
  );
};

// 3-06 · the biggest clean wave: the trough just kisses zero; a bracket from crest to trough: one atmosphere.
const ShotBracket: ShotFC<CL03> = ({ f, len }) => {
  const bx = 1640;
  const wy = surfY(f, bx, ATM);
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.02, panY: 0.0, frames: len + 60, seed: 3 }} vignette={0.2} grain={0.5}>
        <PetrolField
          f={f + 500}
          seed={13}
          hud={
            <g>
              <Metric x={120} y={190} value="1 atm" unit="swing" /* #8 #11 */ size={88} color={P.text} />
              <Tag x={120} y={252} text="≈ 101,000 Pa" /* #8 */ F={P} dot={TEAL} size={26} />
            </g>
          }
        >
          <Wave f={f} amp={ATM - 4} />
          {/* the bracket: crest height to the floor; its moving tick follows the wave at its x */}
          <path d={`M${bx - 24} ${LINE - ATM} L${bx} ${LINE - ATM} L${bx} ${FLOOR} L${bx - 24} ${FLOOR}`} stroke={L13_COLORS.vermilion} strokeWidth={9} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={bx} cy={wy} r={16} fill={L13_COLORS.vermilion} stroke="#FFF4DE" strokeWidth={4} />
        </PetrolField>
      </Stage>
    </Pop>
  );
};

// 3-07 · "Put that number through the fold": Tick feeds the bracket into the folded ruler; the accordion compresses.
const zig = (fold: number, base: [number, number], n = 10, L = 70) => {
  const th = (fold * 84 * Math.PI) / 180;
  const pts: [number, number][] = [base];
  for (let i = 0; i < n; i++) {
    const [x, y] = pts[i];
    pts.push([x + (i % 2 ? -1 : 1) * L * Math.sin(th), y - L * Math.cos(th)]);
  }
  return pts;
};
const Accordion: React.FC<{ fold: number; base: [number, number]; L?: number; w?: number }> = ({ fold, base, L = 70, w = 56 }) => {
  const pts = zig(fold, base, 10, L);
  return (
    <g>
      {pts.slice(0, -1).map(([x, y], i) => {
        const [x2, y2] = pts[i + 1];
        const dx = x2 - x;
        const dy = y2 - y;
        const D = Math.hypot(dx, dy) || 1;
        const nx = (-dy / D) * (w / 2);
        const ny = (dx / D) * (w / 2);
        return (
          <g key={i}>
            <path d={`M${x + nx} ${y + ny} L${x2 + nx} ${y2 + ny} L${x2 - nx} ${y2 - ny} L${x - nx} ${y - ny} Z`} fill={i % 2 ? "#F1DDB6" : "#FFF4DE"} stroke={L13_COLORS.landShade} strokeWidth={3} />
            {[0.25, 0.5, 0.75].map((q) => (
              <line key={q} x1={x + dx * q + nx} y1={y + dy * q + ny} x2={x + dx * q + nx * 0.3} y2={y + dy * q + ny * 0.3} stroke="#1E3A44" strokeWidth={3} />
            ))}
          </g>
        );
      })}
    </g>
  );
};
const ShotFeed: ShotFC<CL03> = ({ f, len }) => {
  const feed = smooth(ramp(f, 4, len * 0.7));
  const fold = 0.25 + 0.7 * smooth(ramp(f, 10, len));
  const base: [number, number] = [BIG.x + 7, BIG.y + BIG.height];
  const top = zig(fold, base)[10];
  const brX = 1500 - (1500 - top[0]) * feed;
  const brY = 300 + (top[1] - 40 - 300) * feed;
  const brH = ATM * 2 * (1 - feed * 0.85);
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.02, panY: 0.0, frames: len + 60, seed: 4 }} vignette={0.2} grain={0.5}>
        <PetrolField f={f + 600} seed={15}>
          <g opacity={0.35}>
            <Wave f={f} amp={ATM - 4} />
          </g>
          <Accordion fold={fold} base={base} />
          <path d={`M${brX - 24} ${brY - brH / 2} L${brX} ${brY - brH / 2} L${brX} ${brY + brH / 2} L${brX - 24} ${brY + brH / 2}`} stroke={L13_COLORS.vermilion} strokeWidth={9} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={1 - ramp(feed, 0.85, 1)} />
          <GroundShadow x={1310} y={FLOOR + 2} rx={60} color={P.shadow} opacity={0.5} blur={8} />
          <Tick x={1300} y={FLOOR} pxPerM={150} frame={f} facing={-1} pose="heave" poseTo="press" poseT={Math.sin(feed * Math.PI)} expression="determined" look={0.6} headTilt={-8} />
        </PetrolField>
      </Stage>
    </Pop>
  );
};

// 3-08 · the ruler becomes the dB gauge: the fill rises and the readout rolls 0 → 194 on the words; the saffron line
// gets its number (F1: the first "194").
const ShotGaugeBorn: ShotFC<CL03> = ({ f, len, c }) => {
  const land = Math.max(16, c.n194 - c.gauge + 10);
  const v = DB.ceiling * Math.pow(ramp(f, 4, land), 0.9);
  const named = f >= land;
  const morph = 1 - ramp(f, 0, 10);
  return (
    <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.0, panY: 0.0, frames: len + 60, seed: 5 }} vignette={0.2} grain={0.5}>
      <PetrolField
        f={f + 700}
        seed={17}
        hud={
          <g>
            <L13Gauge family={P} value={v} rolling={!named} frame={f} {...BIG} ceiling={CEILING} labelled={named} />
            {named ? (
              <g opacity={ramp(f, land, land + 8)}>
                <Metric x={1100} y={460} value="194" unit="dB" /* #8 #9 #11 */ size={150} color={P.text} />
              </g>
            ) : null}
            {named ? <rect x={0} y={0} width={1920} height={1080} fill={L13_COLORS.saffronCore} opacity={flash(f, land, 10, 0.25)} /> : null}
          </g>
        }
      >
        <g opacity={0.4}>
          <Wave f={f} amp={ATM - 4} />
        </g>
        {morph > 0 ? (
          <g opacity={morph}>
            <Accordion fold={0.95} base={[BIG.x + 7, BIG.y + BIG.height]} />
          </g>
        ) : null}
      </PetrolField>
    </Stage>
  );
};

// 3-09 · studio: the big gauge left of centre, the fill locked against the saffron ceiling, trembling; Tick beside it.
const ShotLocked: ShotFC<CL03> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 20, x: 1080, y: 600, zoom: 1.22 },
  ]);
  return (
    <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5}>
      <StudioRoom
        f={f}
        hud={
          <g>
            <Metric x={1180} y={240} value="194" /* #11 */ size={130} color="#FFF4DE" />
            <Tag x={1186} y={300} text="CEILING · SEA-LEVEL AIR" /* #11 */ F={S} dot={SAF} size={24} />
          </g>
        }
      >
        <Bloom x={BIG.x} y={BIG.y + BIG.height * 0.03} r={300} color={SAF} strength={0.45 + 0.1 * Math.sin(f / 7)} />
        <L13Gauge family={GS} value={DB.ceiling} frame={f} {...BIG} ceiling={CEILING} labelled tremble={6} />
        <path d={`M1180 902 L1260 902 L1560 980 L1420 980 Z`} fill={S.shadow} opacity={0.18 + 0.04 * Math.sin(f / 30)} />
        <GroundShadow x={1230} y={903} rx={80} color={S.shadow} opacity={0.3} blur={8} />
        <Tick x={1220} y={900} pxPerM={190} frame={f} facing={-1} pose="hips" expression="proud" staff look={0.4} />
      </StudioRoom>
    </Stage>
  );
};

// 3-10 · "It isn't a law anyone passed": a rubber stamp "LAW" swings down on a string; Tick bats it away.
const ShotStamp: ShotFC<CL03> = ({ f, len }) => {
  const bat = Math.round(len * 0.45);
  const pivot: [number, number] = [1180, -60];
  const Ls = 560;
  const a = f < bat ? 30 * Math.cos(f / 9) : 30 * Math.cos(bat / 9) + (f - bat) * 4.2;
  const ang = (a * Math.PI) / 180;
  const sx = pivot[0] + Math.sin(ang) * Ls;
  const sy = pivot[1] + Math.cos(ang) * Ls;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.01, frames: len + 60, seed: 6 }} vignette={0.1} grain={0.5}>
        <StudioRoom f={f + 200} seed={6}>
          <L13Gauge family={GS} value={DB.ceiling} frame={f} x={420} y={170} height={640} ceiling={CEILING} labelled tremble={3} readout={false} />
          <line x1={pivot[0]} y1={pivot[1]} x2={sx} y2={sy} stroke="#1E3A44" strokeWidth={4} />
          <g transform={`translate(${sx} ${sy}) rotate(${-a})`}>
            <rect x={-30} y={0} width={60} height={80} rx={10} fill="#8A5A34" />
            <rect x={-120} y={80} width={240} height={46} rx={8} fill="#6B4428" />
            <rect x={-130} y={126} width={260} height={90} rx={8} fill={L13_COLORS.vermilion} />
            <text x={0} y={192} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 66, letterSpacing: 6, fill: "#FFF4DE" }}>
              LAW
            </text>
          </g>
          <GroundShadow x={960} y={903} rx={80} color={S.shadow} opacity={0.3} blur={8} />
          <Tick x={950} y={900} pxPerM={200} frame={f} facing={1} pose={f < bat - 8 ? "stand" : "wave"} poseTo={f < bat - 8 ? "point" : "hips"} poseT={f < bat - 8 ? ramp(f, 0, 20) * 0.4 : Math.min(1.6, Math.max(0, (f - bat - 6) / 14))} expression="happy" look={0.8} headTilt={-10} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// 3-11 · inside the gauge plate: the clipped wave scrolling, "nowhere left to go"; Tick shrugs.
const ShotPlate: ShotFC<CL03> = ({ f, len }) => {
  const box = { x: 160, y: 170, w: 1180, h: 680 };
  const ly = box.y + box.h * 0.4;
  const fy = box.y + box.h * 0.84;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.01, frames: len + 60, seed: 7 }} vignette={0.1} grain={0.5}>
        <StudioRoom f={f + 400} seed={8}>
          <rect x={box.x - 16} y={box.y - 16} width={box.w + 32} height={box.h + 32} rx={30} fill={GS.theme.line} />
          <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={20} fill={GS.theme.bg} />
          <defs>
            <clipPath id="l03plate">
              <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={20} />
            </clipPath>
          </defs>
          <g clipPath="url(#l03plate)">
            <PressureWave f={f} y={ly} x0={box.x - 40} x1={box.x + box.w + 40} amp={(fy - ly) * 1.25} wavelength={340} speed={7} floorY={fy} floorColor={BONE} clip color={TEAL} width={7} fillAbove={alpha(BONE, 0.16)} fillBelow={alpha("#000", 0.25)} />
            <Emissive d={`M${box.x} ${box.y + 34} L${box.x + box.w} ${box.y + 34}`} color={SAF} core={L13_COLORS.saffronCore} width={5} glow={8} />
          </g>
          <GroundShadow x={1610} y={903} rx={80} color={S.shadow} opacity={0.3} blur={8} />
          <Tick x={1600} y={900} pxPerM={210} frame={f} facing={-1} pose="stand" poseTo="shrug" poseT={Math.min(1.7, Math.max(0, (f - 14) / 14))} expression="thinking" look={0.4} headTilt={f > 20 ? 8 : 0} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// 3-12 · ember: Tick heaves a big pump handle; the wave swells, troughs flat on the floor.
const ShotPump: ShotFC<CL03> = ({ f, len }) => {
  const stroke = (Math.sin((f / 20) * Math.PI) + 1) / 2; // ~200 px of handle travel every 20 f
  const amp = 160 + 260 * ramp(f, 0, len);
  const px = 300;
  const handleY = 520 + stroke * 200;
  return (
    <Pop f={f}>
      <Stage theme={E.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.01, frames: len + 60, seed: 8 }} vignette={0.25} grain={0.5}>
        <EmberField f={f}>
          <Bloom x={960} y={LINE} r={800} color={E.light} strength={0.3 + 0.15 * stroke} />
          <PressureWave f={f} y={LINE} x0={px + 90} x1={2120} amp={amp} wavelength={380} speed={6} floorY={FLOOR} floorColor={E.light} clip color={SAF} core={L13_COLORS.saffronCore} width={6} fillAbove={alpha(E.light, 0.16)} fillBelow={alpha(E.shadow, 0.45)} />
          {/* the pump */}
          <rect x={px - 60} y={600} width={150} height={FLOOR - 600} rx={14} fill="#5A2A14" />
          <rect x={px - 60} y={600} width={150} height={20} rx={8} fill="#8F4420" />
          <rect x={px + 6} y={handleY - 120} width={20} height={600 - handleY + 120} fill="#C9CFD1" />
          <rect x={px - 110} y={handleY - 140} width={240} height={26} rx={13} fill="#3A1208" />
          <path d={`M${px + 90} ${LINE + 40} Q ${px + 140} ${LINE + 120} ${px + 90} ${700}`} stroke="#3A1208" strokeWidth={18} fill="none" />
          <Tick x={px - 170} y={FLOOR} pxPerM={170} frame={f} facing={1} pose="heave" poseTo="press" poseT={stroke} expression="determined" look={0.5} />
        </EmberField>
      </Stage>
    </Pop>
  );
};

// 3-13 · the crests lean forward and bunch: sine → sawtooth → one steep saffron front, scrolling.
const ShotSteepen: ShotFC<CL03> = ({ f, len }) => {
  const st = smooth(ramp(f, 4, len - 4));
  const sp = 6;
  const wl = 420;
  const phase = 1100 - len * sp - wl / 2;
  // the surviving front's x (the steep drop of period 0): for the LightWash
  const frontX = phase + f * sp + wl * 0.5;
  return (
    <Stage theme={E.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.0, frames: len + 60, seed: 9 }} vignette={0.25} grain={0.5}>
      <EmberField f={f + 200} seed={7}>
        <LightWash x={frontX} y={LINE} rx={500} ry={420} color={SAF} strength={0.2 + 0.35 * st} />
        <PressureWave f={f} y={LINE} x0={-200} x1={2120} amp={300} wavelength={wl} speed={sp} steepen={st} phase={phase} frontIndex={0} floorY={FLOOR} floorColor={E.light} color={SAF} core={L13_COLORS.saffronCore} width={7 + st * 4} fillAbove={alpha(E.light, 0.16)} fillBelow={alpha(E.shadow, 0.4)} />
      </EmberField>
    </Stage>
  );
};

// 3-14 · KEY ART I · the jagged saffron wall sweeps left → right (~20 px/f); foreground palm silhouettes bend as it
// passes; Tick braced; the gauge at right pinned at 194 with chevrons above. The key-art still is l03 line 5 @ 0.85.
const PALMS = [
  { x: 230, h: 780, s: 2 },
  { x: 1580, h: 880, s: 5 },
];
const ShotWall: ShotFC<CL03> = ({ f, len, c }) => {
  const keyF = c.key - c.wall;
  const span = 2700;
  const raw = 860 + (f - keyF) * 20;
  const fx = ((((raw + 500) % span) + span) % span) - 500;
  const bendAt = (px: number) => {
    const d = fx - px;
    if (d < -140) return 0.12 * Math.sin(f / 9);
    return Math.max(0, 1 - Math.max(0, d - 120) / 600) * (0.85 + 0.15 * Math.sin(f / 2.5));
  };
  const tickX = 1040;
  const hitT = fx > tickX - 80 ? Math.min(1, (fx - tickX + 80) / 60) : 0;
  return (
    <Pop f={f}>
      <Stage theme={E.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.015, panY: 0.0, frames: len + 60, seed: 10 }} vignette={0.28} grain={0.5}>
        <EmberField
          f={f + 400}
          seed={9}
          streak={14}
          hud={
            <g>
              <Headline x={120} y={210} lines={["Shock Wave"]} size={100} color={E.text} accent={SAF} />
              <L13Gauge family={E} value={DB.ceiling} frame={f} ceiling={CEILING} labelled overflow tremble={3} />
            </g>
          }
        >
          <ShockFront f={f} x={fx} y={-40} height={1160} trail={420} jag={58} seed={3} />
          <GroundShadow x={tickX + 10} y={FLOOR + 22} rx={80} color={E.shadow} opacity={0.6} blur={8} />
          <Tick x={tickX} y={FLOOR + 20} pxPerM={200} frame={f} facing={-1} pose="shield" expression="surprised" look={0.6} tilt={3 - 8 * hitT} />
          {/* foreground palm silhouettes (drawn under the HUD so the gauge stays readable) */}
          {PALMS.map((p) => (
            <Palm key={p.s} x={p.x} y={1240} h={p.h} f={f} sway={90 * Math.min(1, bendAt(p.x) + 0.2)} period={18} bend={bendAt(p.x)} lean={0.05} silhouette="#1A0604" seed={p.s} />
          ))}
        </EmberField>
      </Stage>
    </Pop>
  );
};

// 3-15 · "three hundred decibels": a placard "300 dB?" rises on a stick, gets struck through, flickers and falls into the
// next passing front (F8: the script's generic example, nothing to do with Krakatoa).
const ShotPlacard: ShotFC<CL03> = ({ f, len }) => {
  const rise = smooth(ramp(f, 0, 16));
  const strike = ramp(f, 22, 32);
  const fx = -400 + Math.max(0, f - 30) * 22;
  const hit = Math.max(0, fx - 600) / 300;
  const fall = Math.min(1, hit);
  const flick = f > 34 && f < 50 && Math.floor(f / 3) % 2 ? 0.55 : 1;
  const px = 820;
  const py = 560 + (1 - rise) * 600;
  return (
    <Pop f={f}>
      <Stage theme={E.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.02, panY: 0.01, frames: len + 60, seed: 11 }} vignette={0.28} grain={0.5}>
        <EmberField f={f + 600} seed={11} streak={10} hud={<L13Gauge family={E} value={DB.ceiling} frame={f} ceiling={CEILING} labelled overflow readout={false} />}>
          <g transform={`translate(${px} ${py + fall * 300}) rotate(${fall * 78}) translate(${-px} ${-py})`} opacity={flick * (1 - ramp(fall, 0.7, 1))}>
            <rect x={px - 10} y={py} width={20} height={420} fill="#6B4428" />
            <rect x={px - 250} y={py - 190} width={500} height={200} rx={16} fill="#FFF4DE" stroke="#3A1208" strokeWidth={6} />
            <text x={px} y={py - 58} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 110, fill: "#2B0C08" }}>
              300 dB?
            </text>
            <line x1={px - 230} y1={py - 40} x2={px - 230 + 460 * strike} y2={py - 160 + 0 * strike} stroke={L13_COLORS.vermilion} strokeWidth={16} strokeLinecap="round" opacity={strike > 0 ? 1 : 0} />
          </g>
          {fx > -400 ? <ShockFront f={f} x={fx} y={-40} height={1160} trail={380} jag={56} seed={7} /> : null}
        </EmberField>
      </Stage>
    </Pop>
  );
};

// 3-16 · the gauge top, close: chevrons pulse above the ceiling; streaks pour past; "PAST 194: NOT A SOUND".
const ShotChevrons: ShotFC<CL03> = ({ f, len }) => {
  const Z = 2.5;
  const cy = 170 + 600 - (DB.ceiling / 200) * 600; // the default gauge's ceiling y
  return (
    <Pop f={f}>
      <Stage theme={E.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0.01, frames: len + 60, seed: 12 }} vignette={0.28} grain={0.5}>
        <EmberField f={f + 800} seed={13} streak={9}>
          <g transform={`translate(1080 640) scale(${Z}) translate(${-1767} ${-cy})`}>
            <L13Gauge family={E} value={DB.ceiling + 6} frame={f} ceiling={CEILING} labelled overflow readout={false} title="" />
          </g>
          {[0, 1, 2].map((k) => {
            const ph = ((f + k * 12) % 36) / 36;
            const s = 1 + 0.3 * Math.sin(ph * Math.PI);
            const y = 560 - ph * 320;
            return (
              <g key={k} transform={`translate(1098 ${y}) scale(${s})`} opacity={Math.sin(ph * Math.PI)}>
                <path d="M-70 30 L0 -40 L70 30 L70 62 L0 -8 L-70 62 Z" fill={L13_COLORS.vermilion} stroke="#FFF4DE" strokeWidth={5} />
              </g>
            );
          })}
        </EmberField>
        <Layer depth={0}>
          <Tag x={120} y={150} text="PAST 194: NOT A SOUND" /* #11 #12 */ F={E} dot={SAF} size={28} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 3-17 + 3-18 · noon: a fork in a path on a hill; two signposts swing in (left a rocket, right a plume over the sea);
// Tick looks left, then right; the right sign's plate flutters like the notebook page; Tick takes the left path.
const Sign: React.FC<{ x: number; y: number; swing: number; dir: 1 | -1; f: number; kind: "rocket" | "plume"; flutter?: number }> = ({ x, y, swing, dir, f, kind, flutter = 0 }) => {
  const rock = Math.sin(f / 9 + (dir > 0 ? 1 : 0)) * 4 * swing;
  const a = (1 - swing) * -dir * 80 + rock;
  return (
    <g transform={`rotate(${a} ${x} ${y})`}>
      <rect x={x - 9} y={y - 380} width={18} height={380} fill="#6B4428" />
      <path d={`M${x} ${y - 360} L${x + dir * 260} ${y - 360} L${x + dir * 310} ${y - 290} L${x + dir * 260} ${y - 220} L${x} ${y - 220} Z`} fill={kind === "rocket" ? "#FFF4DE" : "#F7EBCF"} stroke="#3A2A1A" strokeWidth={5} />
      {kind === "rocket" ? (
        <g transform={`translate(${x + dir * 150} ${y - 290})`}>
          <path d="M-90 0 L60 -26 L100 0 L60 26 Z" fill="#23262A" transform={`scale(${dir} 1)`} />
          <path d="M-90 -16 L-120 -40 L-80 -12 Z M-90 16 L-120 40 L-80 12 Z" fill="#23262A" transform={`scale(${dir} 1)`} />
        </g>
      ) : (
        <g>
          <Notebook x={x + dir * 150} y={y - 290} w={180} h={110} flutter={flutter} f={f} />
          <path d={`M${x + dir * 80} ${y - 262} Q ${x + dir * 150} ${y - 280} ${x + dir * 230} ${y - 262}`} stroke="#1F8F8A" strokeWidth={6} fill="none" />
          <circle cx={x + dir * 150} cy={y - 318} r={22} fill={SAF} opacity={0.9} />
          <circle cx={x + dir * 135} cy={y - 338} r={16} fill={SAF} opacity={0.8} />
        </g>
      )}
    </g>
  );
};
const ShotFork: ShotFC<CL03> = ({ f, len, c }) => {
  const pickF = c.pick - c.fork;
  const lsw = smooth(ramp(f, 6, 24));
  const rsw = smooth(ramp(f, 16, 34));
  const lookDir = f < pickF * 0.5 ? -1 : 1;
  const walking = f > pickF + 16;
  const tx = walking ? 960 - (f - pickF - 16) * 4.5 : 960;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: pickF, x: 960, y: 540, zoom: 1.04 },
    { f: len + 30, x: 760, y: 520, zoom: 1.3 },
  ]);
  const ground = 880;
  return (
    <Stage theme={N.theme} cam={cam} vignette={0.08} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={N} />
      </Layer>
      <Layer depth={0.1}>
        <Bloom x={260} y={130} r={380} color={N.light} core={44} coreColor="#FFFBE6" strength={0.9} />
      </Layer>
      <Layer depth={0.3}>
        <CloudRack f={f} n={5} x0={-700} x1={2700} y0={170} y1={430} size={120} speed={2.2} body="#FFFFFF" under="#B9DDE8" top="#FFFFFF" seed={21} />
        <Flock frame={f} x={-100 + ((f * 2) % 2300)} y={260} vx={0} n={5} size={12} color={alpha(N.shadow, 0.6)} seed={4} />
      </Layer>
      <Layer depth={0.6}>
        <path d={`M-1400 760 Q -200 560 900 700 Q 1800 820 3400 640 L3400 2400 L-1400 2400 Z`} fill={N.far} />
        <HazeBand y={600} h={200} color={N.haze} strength={0.5} x={-1400} w={4800} />
      </Layer>
      <Layer depth={1}>
        <path d={`M-1400 ${ground - 30} Q 400 ${ground - 120} 1200 ${ground - 60} Q 2200 ${ground} 3400 ${ground - 80} L3400 2400 L-1400 2400 Z`} fill={N.mid} />
        {/* the fork in the path */}
        <path d={`M900 1200 L1020 1200 Q 1000 ${ground} 960 ${ground - 50} Q 700 ${ground - 120} 300 ${ground - 150} L330 ${ground - 170} Q 760 ${ground - 150} 960 ${ground - 80} Q 1180 ${ground - 150} 1640 ${ground - 175} L1660 ${ground - 155} Q 1200 ${ground - 120} 1000 ${ground - 40} Z`} fill="#E8D3A2" />
        <Sign x={880} y={ground - 70} swing={lsw} dir={-1} f={f} kind="rocket" />
        <Sign x={1040} y={ground - 70} swing={rsw} dir={1} f={f} kind="plume" flutter={f > pickF ? 1 : 0.3} />
        <GroundShadow x={tx + 6} y={ground + 3} rx={60} color={N.shadow} opacity={0.3} blur={8} />
        <Tick x={tx} y={ground} pxPerM={140} frame={f} facing={walking ? -1 : 1} walk={walking ? walkPhase(f, 16) : undefined} pose={walking ? "stand" : "think"} expression={walking ? "determined" : "thinking"} look={walking ? 0.6 : lookDir} />
      </Layer>
      <Layer depth={1.12}>
        {Array.from({ length: 70 }, (_, i) => {
          const x = -300 + i * 38 + rnd(i) * 20;
          const h = 50 + rnd(i * 3) * 80;
          const s = Math.sin(f / 12 + i) * 20;
          return <path key={i} d={`M${x - 9} 1080 Q${x + s * 0.4} ${1080 - h * 0.55} ${x + s} ${1080 - h} Q${x + s * 0.3} ${1080 - h * 0.5} ${x + 9} 1080 Z`} fill={i % 2 ? N.near : mixHex(N.mid, N.near, 0.3)} />;
        })}
      </Layer>
    </Stage>
  );
};

// BlackBeat + sting → ChapterCard 2 (4-00) on the dusk field, rings rising behind the type.
const Card2: React.FC<{ f: number; len: number }> = ({ f, len }) => {
  const bb = 16;
  const g = f - bb;
  const a = smooth(ramp(g, 2, 16)) * (1 - smooth(ramp(g, len - bb - 10, len - bb)));
  return (
    <AbsoluteFill>
      {g >= 0 ? (
        <Stage theme={DUSK.theme} drift={false} vignette={0.3} grain={0.4}>
          <Sky family={DUSK} />
          <Rings f={g} cx={960} cy={1240} period={34} speed={12} maxR={1500} width={7} start={-60} />
          <Motes frame={g} n={40} w={1920} h={1080} color={DUSK.light} seed={41} size={3.2} drift={30} />
          <g opacity={a} transform={`translate(0 ${((1 - smooth(ramp(g, 2, 16))) * 24).toFixed(1)})`}>
            <Kicker x={160} y={400} text="CHAPTER TWO" color={DUSK.dim} size={26} />
            <text x={160} y={540} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 104, letterSpacing: -3, fill: DUSK.text }}>
              A Rocket and a Volcano
            </text>
            <rect x={160} y={590} width={60} height={6} rx={3} fill={DUSK.accent} />
          </g>
        </Stage>
      ) : null}
      <BlackBeat t={Math.min(1, f / (bb + 4))} fadeIn={0.2} fadeOut={0.35} />
    </AbsoluteFill>
  );
};
const ShotPickAndCard: ShotFC<CL03> = (props) => {
  const { f, c } = props;
  const b = c.brk - c.fork;
  if (f >= b) return <Card2 f={f - b} len={c.end - c.brk} />;
  return <ShotFork {...props} />;
};

// ---------------------------------------------------------------------------------------------

export const SceneL03: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL03(t);
  const shots: ShotDef<CL03>[] = [
    { from: 0, S: ShotField, id: "3-01" },
    { from: c.surf, S: ShotSurf, id: "3-02" },
    { from: c.floor, S: ShotFloor, id: "3-03" },
    { from: c.jab, S: ShotJab, id: "3-04" },
    { from: c.grow, S: ShotGrow, id: "3-05" },
    { from: c.atm, S: ShotBracket, id: "3-06" },
    { from: c.feed, S: ShotFeed, id: "3-07" },
    { from: c.gauge, S: ShotGaugeBorn, id: "3-08" },
    { from: c.locked, S: ShotLocked, id: "3-09" },
    { from: c.law, S: ShotStamp, id: "3-10" },
    { from: c.quiet, S: ShotPlate, id: "3-11" },
    { from: c.pump, S: ShotPump, id: "3-12" },
    { from: c.piles, S: ShotSteepen, id: "3-13" },
    { from: c.wall, S: ShotWall, id: "3-14" },
    { from: c.placard, S: ShotPlacard, id: "3-15" },
    { from: c.past, S: ShotChevrons, id: "3-16" },
    { from: c.fork, S: ShotPickAndCard, id: "3-17" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL03 = (t: SceneTiming): Cue[] => {
  const c = cuesL03(t);
  const jabLen = c.grow - c.jab;
  return [
    { at: 0, file: SFX.rumble, vol: 0.12, dur: c.surf + 10, fadeIn: 20, fadeOut: 20 },
    ...cutHit(c.surf),
    ...[20, 52, 84].map((o) => ({ at: c.surf + o, file: SFX.swirl, vol: 0.08, dur: 30 })),
    ...cutHit(c.floor),
    { at: c.floor + 12, file: SFX.pop, vol: 0.16, dur: 20 },
    ...cutHit(c.jab),
    { at: c.jab + 16, file: SFX.click, vol: 0.2, dur: 12 },
    { at: c.jab + Math.round(jabLen * 0.45) + 6, file: SFX.click, vol: 0.2, dur: 12 },
    { at: c.grow, file: SFX.riser, vol: 0.16, dur: c.atm - c.grow, fadeIn: 10, fadeOut: 10 },
    ...cutHit(c.atm),
    { at: c.atm + 4, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...[10, 30].map((o) => ({ at: c.feed + o, file: SFX.swirl, vol: 0.14, dur: 40 })),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.gauge + 6 + i * 8, file: SFX.click, vol: 0.08, dur: 8 })),
    { at: c.n194 + 10, file: SFX.chime, vol: 0.26, dur: 70 },
    { at: c.locked, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...cutHit(c.law),
    { at: c.law + Math.round((c.quiet - c.law) * 0.45), file: SFX.whoosh, vol: 0.24, dur: 40 },
    ...cutHit(c.quiet),
    { at: c.quiet + 16, file: SFX.pop, vol: 0.18, dur: 20 },
    ...cutHit(c.pump),
    { at: c.pump, file: SFX.rumble, vol: 0.22, dur: c.piles - c.pump + 10, fadeIn: 10, fadeOut: 10 },
    { at: c.piles, file: SFX.riser, vol: 0.18, dur: c.wall - c.piles + 4, fadeIn: 6, fadeOut: 4 },
    ...cutHit(c.wall),
    { at: c.wall + 2, file: SFX.whoosh, vol: 0.3, dur: 50 },
    { at: c.wall + 6, file: SFX.uBoom, vol: 0.36, dur: 120, fadeOut: 40 },
    ...cutHit(c.placard),
    { at: c.placard + 30, file: SFX.pop, vol: 0.16, dur: 20 },
    { at: c.placard + 52, file: SFX.debris, vol: 0.2, dur: 70, fadeOut: 24 },
    ...cutHit(c.past),
    ...[0, 12, 24].map((o) => ({ at: c.past + 6 + o, file: SFX.click, vol: 0.12, dur: 10 })),
    ...cutHit(c.fork),
    { at: c.fork + 22, file: SFX.pop, vol: 0.16, dur: 16 },
    { at: c.fork + 32, file: SFX.pop, vol: 0.16, dur: 16 },
    ...sting(c.brk),
  ];
};
