// L12 scene l03 "The dough" (storyboard §3 "3 · The dough": shots 3-01…3-12, script lines 20-25 = scene lines 0-5,
// families ember → noon kitchen (grounding scene 1) → noon plateau, Act II).
// Numbers drawn here, each a row in episodes/L12-mountain-limit/sources.md:
//   Tibetan Plateau ~4,500 m, 2.5 million km² (#5) · balance height ~5 km, attributed "one geologist's reading" (#10)
//   · Tibet and the central Andes capped by crustal strength, "Nature, 2009" (#11) · Everest 8,848.86 m (#1).
// Flag F2: the softened root is HOT SOLID ROCK creeping slowly: heat bands and a glow, no liquid surface, no lava
// texture, nothing drips; the outline spreads over many seconds. The plateau section has one vertical scale
// (PS px per metre) so the 4,500 m top, the ~5 km line and the 8,849 m spike are in honest proportion; widths are
// schematic (no width is claimed).
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  Cumulus,
  Embers,
  Facets,
  Flock,
  Form,
  GroundShadow,
  Hatch,
  HazeBand,
  Kicker,
  Layer,
  LightCone,
  LightWash,
  Metric,
  Motes,
  P,
  Pill,
  Puffs,
  Sky,
  Stage,
  Sway,
  Tick,
  alpha,
  cameraAt,
  cutPop,
  fall,
  mixHex,
  morphPath,
  pulse,
  ridgePath,
  rnd,
  roundPoly,
  smooth,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { L12_COLORS, familyOf, pillFill } from "../families";
import { cueKit } from "../cues";
import { HEIGHTS, L12Gauge } from "../L12Gauge";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";

type Pt = [number, number];
const EMBER = familyOf("ember");
const NOON = familyOf("noon");
const PETROL = familyOf("petrol");
/** pills, counters and the HUD over bright (noon) art: petrol plate + bone text (round 1: dark-on-dark, glaring plate) */
const PF = pillFill(PETROL);
const HT = PETROL.text;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (f: number, a: number, b: number) => smooth(clamp01((f - a) / Math.max(1, b - a)));

export const cuesL03 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    root: 0, // 3-01 → 3-02 (PUSH): the hot root softens and spreads
    weak: p(0, "hot rock is weak"),
    softens: p(0, "softens"),
    spread: p(0, "gravity starts"), // 3-02: the arrows press, the base bulges
    kitchen: at(1), // 3-03: grounding scene 1
    slump: p(1, "left on a table"), // 3-04: the time-lapse
    flattens: p(1, "it flattens"),
    plateau: at(2), // 3-05 → 3-06 (PUSH)
    area: p(2, "Two and a half million"),
    level: p(2, "levelling off"),
    balance: at(3), // 3-07
    pile: p(3, "Pile the whole thing"), // 3-08
    andes: at(4), // 3-09
    andesIn: p(4, "Tibet and the Andes", -20),
    spikes: at(5), // 3-10 → 3-11 (PUSH)
    everest: p(5, "Everest is one"),
    trimmed: p(5, "And spikes get trimmed", -6), // 3-12
    last: end(5),
    end: t.frames,
  };
};
export type CL03 = ReturnType<typeof cuesL03>;
type C = CL03;

// ---------------------------------------------------------------------------------------------------------------
// 3-01 / 3-02: deep in the block. The root is crust (hatched slate); around it the mantle, in heat bands that step up
// with depth. As it softens the hatch fades from the bottom and the outline creeps outward (solid creep, F2).
const ROOT_HARD: Pt[] = [[380, 250], [1540, 250], [1500, 330], [1400, 430], [1290, 560], [1180, 700], [1060, 800], [960, 830], [860, 800], [740, 700], [630, 560], [520, 430], [420, 330]];
const ROOT_SOFT: Pt[] = [[380, 250], [1540, 250], [1560, 350], [1560, 470], [1520, 590], [1400, 690], [1200, 744], [960, 756], [720, 744], [520, 690], [400, 590], [360, 470], [360, 350]];

const ShotRoot: ShotFC<C> = ({ f, len, c }) => {
  const F = EMBER;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: c.spread, x: 960, y: 620, zoom: 1.22 },
    { f: len, x: 960, y: 600, zoom: 1.12 },
  ]);
  const soft = ease(f, c.softens - 10, c.softens + 70) * 0.35 + ease(f, c.spread, len - 10) * 0.65; // slow: the whole shot
  const settle = 14 * ease(f, c.spread, len);
  const d = morphPath(ROOT_HARD, ROOT_SOFT, soft, 30);
  const crust = mixHex(L12_COLORS.slate, "#7A4A30", 0.3);
  const hot = pulse(f, 70, 0.08, 3);
  const arrows = ease(f, c.spread, c.spread + 24);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.5}>
      <Layer depth={0.05}>
        <Sky stops={["#F3E2C0", "#E0A060", "#6A2210", "#3A1208", "#2B0C08"]} />
      </Layer>
      <Layer depth={1}>
        {/* the mantle: maroon rock, heat bands that step up with depth (a glow, never a liquid surface) */}
        <rect x={-600} y={250} width={3200} height={1400} fill="#4A1A0E" />
        {[430, 580, 720, 860].map((y, i) => (
          <g key={i}>
            <rect x={-600} y={y} width={3200} height={1400} fill={mixHex("#4A1A0E", L12_COLORS.amber, 0.1 + i * 0.09)} opacity={0.75} />
            <line x1={-600} y1={y} x2={2600} y2={y} stroke={L12_COLORS.amber} strokeWidth={2} opacity={0.18 + i * 0.07} />
          </g>
        ))}
        <LightWash x={960} y={1120} rx={1500 * hot} ry={520 * hot} color="#FF9A40" strength={0.55} />
        <Embers frame={f} x0={100} x1={1820} y={1060} n={46} color="#FFC070" seed={4} rise={0.9} life={150} size={2.4} />
        {/* the surface: a bone-sky sliver, the range on top settling a hair as the base spreads */}
        <g transform={`translate(0 ${settle})`}>
          <path d={ridgePath([[-400, 250], [300, 236], [620, 150], [760, 196], [900, 96], [1010, 170], [1160, 120], [1320, 210], [1600, 240], [2400, 250]], 262, 8)} fill={mixHex(crust, F.light, 0.25)} />
          {/* the crust and its root: one Form, hatched; the hatch fades from the bottom as the rock softens */}
          <Hatch id="l03-hatch" color={alpha(F.shadow, 0.5)} gap={16} angle={35} width={1.6} />
          <Form d={`M-600 250 L2600 250 L2600 330 L-600 330 Z`} fill={crust} light={90} shadow={F.shadow} inset={16} shadowOpacity={0.35} hard />
          <Form d={d} fill={crust} light={90} shadow={F.shadow} inset={34} shadowOpacity={0.4} rim={F.light} rimWidth={5} rimOpacity={0.75} bounce={F.bounce}>
            <path d={d} fill="url(#l03-hatch)" />
            {/* warmth soaking into the base: the fill glows toward amber where it is hottest, and the hatch is lost */}
            <HazeBand y={lerp(640, 420, soft)} h={420} color={mixHex(crust, L12_COLORS.amber, 0.75)} strength={0.35 + 0.6 * soft} />
          </Form>
        </g>
        {/* 3-02: gravity presses down (two pulsing arrows), the base creeps out both ways (small side arrows) */}
        <g opacity={arrows}>
          {[760, 1160].map((x, i) => {
            const y = 360 + Math.sin(f / 12 + i) * 8;
            return (
              <g key={i}>
                <rect x={x - 12} y={y} width={24} height={110} fill={F.text} />
                <path d={`M${x} ${y + 156} L${x - 38} ${y + 108} L${x + 38} ${y + 108} Z`} fill={F.text} />
              </g>
            );
          })}
          {[-1, 1].map((s) => {
            const x = 960 + s * (640 + soft * 60 + Math.sin(f / 14) * 6);
            return <path key={s} d={`M${x + s * 60} 640 L${x} 606 L${x} 628 L${x - s * 60} 628 L${x - s * 60} 652 L${x} 652 L${x} 674 Z`} fill={L12_COLORS.amber} />;
          })}
        </g>
      </Layer>
      <Layer depth={1.3}>
        <path d={ridgePath([[-500, 1300], [-200, 1080], [100, 1030], [400, 1100], [700, 1300]], 1700, 30)} fill={F.near} />
        <path d={ridgePath([[1300, 1300], [1560, 1090], [1840, 1040], [2140, 1100], [2400, 1300]], 1700, 30)} fill={F.near} />
      </Layer>
      <Layer depth={0}>
        <g opacity={ease(f, c.weak - 6, c.weak + 12)}>
          <Pill x={120} y={128} text="HOT ROCK IS WEAK" fill={pillFill(F)} color={F.text} dot={L12_COLORS.amber} size={20} />
          <Pill x={120} y={178} text="SOLID · IT CREEPS" fill={pillFill(F)} color={F.text} size={16} />
        </g>
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 3-03 / 3-04: the kitchen (grounding scene 1): window light from the right, a busy warm room, Tick large.
const TABLE_Y = 830;
const DOUGH_TALL: Pt[] = [[870, TABLE_Y], [862, TABLE_Y - 60], [890, TABLE_Y - 120], [950, TABLE_Y - 154], [1020, TABLE_Y - 160], [1090, TABLE_Y - 148], [1140, TABLE_Y - 110], [1160, TABLE_Y - 54], [1150, TABLE_Y]];
const DOUGH_FLAT: Pt[] = [[700, TABLE_Y], [690, TABLE_Y - 22], [740, TABLE_Y - 44], [860, TABLE_Y - 56], [1030, TABLE_Y - 60], [1200, TABLE_Y - 56], [1320, TABLE_Y - 44], [1370, TABLE_Y - 22], [1360, TABLE_Y]];

const Kitchen: React.FC<{ f: number; dough: number; press?: number; clock: number; children?: React.ReactNode }> = ({ f, dough, press = 0, clock, children }) => {
  const F = NOON;
  const wall = "#F2D9A8";
  const wood = "#B9824E";
  const dPts: Pt[] = DOUGH_TALL.map(([x, y], i): Pt => {
    const [bx, by] = DOUGH_FLAT[i];
    const xx = lerp(x, bx, dough);
    const yy = lerp(y, by, dough);
    return [1010 + (xx - 1010) * (1 + press * 0.12), TABLE_Y - (TABLE_Y - yy) * (1 - press * 0.22)];
  });
  const dd = roundPoly(dPts, 26);
  return (
    <>
      <Layer depth={0.05}>
        <rect x={-400} y={-400} width={2720} height={1900} fill={wall} />
        <Sky stops={[alpha("#E8B878", 0), alpha("#D89A5A", 0.45)]} x={-400} y={300} w={2720} h={900} />
      </Layer>
      <Layer depth={0.5}>
        {/* the window at the right: noon sky, a far hill, a curtain that sways */}
        <g>
          <rect x={1290} y={150} width={520} height={470} rx={10} fill={mixHex(wood, F.shadow, 0.3)} />
          <Sky family={F} x={1310} y={170} w={480} h={430} />
          <path d={ridgePath([[1310, 520], [1420, 470], [1560, 500], [1700, 450], [1790, 480]], 600, 20)} fill={F.mid} />
          <Cumulus x={1360 + (f * 0.2) % 300} y={330} w={200} h={54} fill="#FFFFFF" shade="#D5E6EA" lit="#FFFFFF" light={20} seed={3} frame={f} />
          <rect x={1543} y={170} width={14} height={430} fill={mixHex(wood, F.shadow, 0.3)} />
          <rect x={1310} y={376} width={480} height={12} fill={mixHex(wood, F.shadow, 0.3)} />
          <Bloom x={1700} y={250} r={420} color="#FFF3C8" strength={0.6} spread={0.35} />
          <Sway frame={f} x={1300} y={150} amp={2.2} period={130} seed={2}>
            <path d={`M1280 140 L1420 140 Q1400 380 1350 640 L1280 640 Z`} fill="#E8704A" opacity={0.92} />
            <path d={`M1320 140 Q1330 380 1300 640`} fill="none" stroke={mixHex("#E8704A", F.shadow, 0.3)} strokeWidth={5} />
            <path d={`M1375 140 Q1378 380 1340 640`} fill="none" stroke={mixHex("#E8704A", "#FFFFFF", 0.3)} strokeWidth={5} />
          </Sway>
          <rect x={1260} y={126} width={580} height={18} rx={9} fill={mixHex(wood, F.shadow, 0.4)} />
        </g>
        {/* a shelf of jars, a wall clock that spins through the time-lapse */}
        <rect x={130} y={330} width={520} height={16} fill={mixHex(wood, F.shadow, 0.25)} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={160 + i * 120} y={330 - 96 - (i % 2) * 22} width={78} height={96 + (i % 2) * 22} rx={12} fill={["#7FAE9F", "#E0A040", "#C8D8C0", "#D06848"][i]} />
            <rect x={160 + i * 120} y={330 - 96 - (i % 2) * 22} width={22} height={96 + (i % 2) * 22} rx={10} fill="#FFFFFF" opacity={0.25} />
            <rect x={166 + i * 120} y={330 - 110 - (i % 2) * 22} width={66} height={18} rx={6} fill={mixHex(wood, F.shadow, 0.35)} />
          </g>
        ))}
        <g>
          <circle cx={900} cy={250} r={74} fill="#FFF8E8" stroke={mixHex(wood, F.shadow, 0.4)} strokeWidth={10} />
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1={900 + Math.cos((i * Math.PI) / 6) * 56} y1={250 + Math.sin((i * Math.PI) / 6) * 56} x2={900 + Math.cos((i * Math.PI) / 6) * 64} y2={250 + Math.sin((i * Math.PI) / 6) * 64} stroke={F.shadow} strokeWidth={3} />
          ))}
          <line x1={900} y1={250} x2={900 + Math.cos(clock / 12 - Math.PI / 2) * 34} y2={250 + Math.sin(clock / 12 - Math.PI / 2) * 34} stroke={F.shadow} strokeWidth={6} strokeLinecap="round" />
          <line x1={900} y1={250} x2={900 + Math.cos(clock - Math.PI / 2) * 52} y2={250 + Math.sin(clock - Math.PI / 2) * 52} stroke={F.shadow} strokeWidth={4} strokeLinecap="round" />
        </g>
        {/* the stove and a kettle that steams */}
        <rect x={120} y={640} width={420} height={500} fill={mixHex("#7FAE9F", F.shadow, 0.25)} />
        <rect x={120} y={640} width={420} height={22} fill={mixHex("#7FAE9F", "#FFFFFF", 0.3)} />
        <path d={`M250 640 Q250 540 330 540 Q410 540 410 640 Z`} fill={L12_COLORS.slate} />
        <path d={`M270 620 Q270 556 318 552`} fill="none" stroke="#FFFFFF" strokeWidth={8} opacity={0.3} strokeLinecap="round" />
        <path d={`M410 590 L466 566 L470 580 L410 616 Z`} fill={L12_COLORS.slate} />
        <path d={`M290 544 Q330 480 370 544`} fill="none" stroke={L12_COLORS.slateDark} strokeWidth={9} />
        <Puffs frame={f} x={476} y={562} color={alpha("#FFFFFF", 0.8)} period={22} size={12} rise={1.3} drift={0.5} life={70} seed={5} />
      </Layer>
      <Layer depth={1}>
        {/* the window beam across the room, motes in it */}
        <LightCone x={1700} y={300} angle={152} length={1500} spread={13} color="#FFF3C8" strength={0.34} />
        <Motes frame={f} n={46} x={500} y={280} w={1100} h={520} color="#FFFDF0" seed={6} size={3} drift={34} />
        {children}
        {/* the table: a lit top and a front edge */}
        <rect x={-400} y={TABLE_Y} width={2720} height={44} fill={mixHex(wood, "#FFF3C8", 0.35)} />
        <rect x={-400} y={TABLE_Y + 44} width={2720} height={600} fill={mixHex(wood, F.shadow, 0.22)} />
        {[0.2, 0.5, 0.8].map((k) => (
          <line key={k} x1={-400} y1={TABLE_Y + 44 * k} x2={2320} y2={TABLE_Y + 44 * k} stroke={mixHex(wood, F.shadow, 0.3)} strokeWidth={1.5} opacity={0.4} />
        ))}
        <LightWash x={1180} y={TABLE_Y + 16} rx={560} ry={40} color="#FFF8D8" strength={0.6} />
        {/* the dough: a lit bone lump with a cast shadow away from the window; flour dust */}
        <GroundShadow x={960} y={TABLE_Y + 6} rx={200 + dough * 170} ry={16} color={mixHex(wood, F.shadow, 0.6)} opacity={0.45} blur={8} />
        <Form d={dd} fill="#F4E4C4" light={340} shadow="#B98850" inset={30} shadowOpacity={0.5} rim="#FFFFFF" rimWidth={5} rimOpacity={0.9} bounce="#F4C890" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <ellipse key={i} cx={560 + i * 150 + rnd(i) * 60} cy={TABLE_Y + 10 + rnd(i + 5) * 22} rx={16 + rnd(i + 2) * 22} ry={4} fill="#FFFFFF" opacity={0.6} />
        ))}
        {/* a rolling pin and a bowl on the table */}
        <rect x={1380} y={TABLE_Y - 30} width={300} height={34} rx={17} fill={mixHex(wood, "#FFF3C8", 0.2)} />
        <rect x={1340} y={TABLE_Y - 22} width={50} height={18} rx={9} fill={mixHex(wood, F.shadow, 0.3)} />
        <rect x={1670} y={TABLE_Y - 22} width={50} height={18} rx={9} fill={mixHex(wood, F.shadow, 0.3)} />
        <path d={`M300 ${TABLE_Y - 90} L520 ${TABLE_Y - 90} Q500 ${TABLE_Y} 410 ${TABLE_Y} Q320 ${TABLE_Y} 300 ${TABLE_Y - 90} Z`} fill="#7FAE9F" />
        <ellipse cx={410} cy={TABLE_Y - 90} rx={110} ry={16} fill="#FFF8E8" />
      </Layer>
    </>
  );
};

const ShotKitchen: ShotFC<C> = ({ f, len }) => {
  const F = NOON;
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 540, zoom: 1.0 },
    { f: len, x: 940, y: 560, zoom: 1.14 },
  ]);
  // Tick presses twice: down on a ~44-frame rhythm
  const beat = (f % 44) / 44;
  const press = Math.max(0, Math.sin(beat * Math.PI)) * (f > 8 ? 1 : 0);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.5}>
      <Kitchen f={f} dough={0} press={press} clock={f / 60}>
        <g transform={`translate(0 ${press * 16})`}>
          <Tick x={800} y={1090} pxPerM={420} frame={f} pose="press" expression="happy" look={0.8} facing={1} outline={F.shadow} />
        </g>
      </Kitchen>
    </Stage>
  );
};

const ShotSlump: ShotFC<C> = ({ f, len, c }) => {
  const F = NOON;
  const cam = cameraAt(f, [
    { f: 0, x: 940, y: 600, zoom: 1.25 },
    { f: len, x: 960, y: 620, zoom: 1.42 },
  ]);
  const dough = ease(f, 6, len - 12); // the whole shot: slow, steady
  const tapAt = c.flattens - c.slump;
  const nod = f > tapAt ? Math.sin((f - tapAt) / 7) * 7 * Math.exp(-(f - tapAt) / 40) : 0;
  const pt = clamp01((f - 4) / 26) * 1.6;
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.5}>
      <Kitchen f={f} dough={dough} clock={f * 0.5}>
        <Tick x={600} y={1090} pxPerM={420} frame={f} pose="press" poseTo="lean" poseT={pt} expression="surprised" expressionTo="thinking" expressionT={clamp01((f - tapAt) / 16)} look={0.9} facing={1} headTilt={nod} outline={F.shadow} />
      </Kitchen>
      <Layer depth={0}>
        <Kicker x={1240} y={1000} text="— GIVE IT TIME" color="#FFF3D8" size={34} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 3-05 … 3-12: the plateau (noon, sun upper left 225). One vertical scale: PS px per metre.
const PS = 0.06;
const PX = -320; // the section sits left of the HUD gauge (round 1: the spikes hid under it)
const P_SEA = 830; // sea level (the datum; lowland haze in front)
const P_TOP = P_SEA - HEIGHTS.tibet /* #5 */ * PS; // 560
const P_BAL = P_SEA - 5000 /* #10: "near five kilometres", attributed */ * PS; // 530
const EV = { x: 1650, y: P_SEA - HEIGHTS.everest /* #1 */ * PS }; // ≈ 299
const SPIKES: Pt[] = [[1440, P_TOP], [1490, 470], [1530, 500], [1580, 400], [1612, 430], [EV.x, EV.y], [1690, 410], [1730, 380], [1770, 470], [1810, 520], [1850, 640], [1900, 830]];

/** The slab: flat top, a face down to the lowland; `bulge` 0..1 creeps the soft base outward, `lift` px raises the top. */
const slabPts = (x0: number, x1: number, top: number, bulge = 0, lift = 0): Pt[] => [
  [x0 - 130 - bulge * 90, P_SEA + 40],
  [x0 - 90 - bulge * 70, P_SEA - 70],
  [x0 - 30 - bulge * 16, top + 70 - lift],
  [x0, top - lift],
  [x0 + (x1 - x0) * 0.25, top - 6 - lift],
  [x0 + (x1 - x0) * 0.5, top + 2 - lift],
  [x0 + (x1 - x0) * 0.75, top - 5 - lift],
  [x1, top - lift],
  [x1 + 30 + bulge * 16, top + 70 - lift],
  [x1 + 90 + bulge * 70, P_SEA - 70],
  [x1 + 130 + bulge * 90, P_SEA + 40],
];

const PlateauWorld: React.FC<{ f: number; bulge?: number; lift?: number; morph?: number; andes?: number; spikes?: boolean; children?: React.ReactNode; under?: React.ReactNode }> = ({ f, bulge = 0, lift = 0, morph = 1, andes = 0, spikes = true, children, under }) => {
  const F = NOON;
  const rock = "#B58E62";
  const pts = slabPts(240, 1500, P_TOP, bulge, lift);
  // the MORPH in from the dough's outline (3-04 → 3-05): same silhouette family, flat and wide
  const dough: Pt[] = DOUGH_FLAT.map(([x, y]): Pt => [x, y - 200]);
  const d = morph < 1 ? morphPath(dough, pts, morph, 18) : roundPoly(pts, 18);
  const cloudX = (k: number, sp: number) => ((k + f * sp) % 2900) - 500;
  const snow = fall(f, 46, 2400, 900, 5, 1.0, 16);
  return (
    <>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Bloom x={250} y={130} r={760} color={F.light} strength={0.5} spread={0.3} />
        <Bloom x={250} y={130} r={150} color="#FFF6D8" strength={0.95} spread={0.45} core={44} coreColor="#FFFBEA" />
      </Layer>
      <Layer depth={0.2} haze={{ color: F.haze, amount: 0.4 }}>
        <Cumulus x={cloudX(300, 0.5)} y={300} w={560} h={130} fill="#F7F1E4" shade={mixHex("#F7F1E4", F.shadow, 0.3)} lit="#FFFFFF" seed={4} frame={f} />
        <Cumulus x={cloudX(1500, 0.36)} y={220} w={460} h={110} fill="#F7F1E4" shade={mixHex("#F7F1E4", F.shadow, 0.3)} lit="#FFFFFF" seed={8} frame={f} lobes={4} />
        <path d={ridgePath([[-600, 760], [-100, 700], [400, 730], [900, 690], [1500, 720], [2100, 690], [2600, 750]], 1200, 40)} fill={F.far} />
        <Flock frame={f} x={-100} y={380} vx={1.2} n={6} size={9} color={F.shadow} seed={3} />
      </Layer>
      <Layer depth={1}>
       <g transform={`translate(${PX} 0)`}>
        {under}
        {/* the central Andes (3-09): a second, narrower high plateau with volcanic cones, sliding in from the left */}
        {andes > 0 ? (
          <g transform={`translate(${-(1 - andes) * 900} 0)`} opacity={clamp01(andes * 2)}>
            {(() => {
              const ap: Pt[] = [[-760, P_SEA + 40], [-700, P_SEA - 60], [-640, 600], [-600, 584], [-520, 520], [-470, 580], [-360, 576], [-300, 500], [-250, 574], [-140, 584], [-100, 600], [-50, P_SEA - 60], [10, P_SEA + 40]];
              return (
                <Form d={roundPoly(ap, 12)} fill={mixHex(rock, "#8C6A5A", 0.4)} light={225} shadow={F.shadow} inset={30} shadowOpacity={0.4} rim={F.light} rimWidth={4} rimOpacity={0.8} bounce={F.bounce}>
                  <path d={`M-300 440 L-250 574 L-200 ${P_SEA + 60} L200 ${P_SEA + 60} L200 440 Z`} fill={F.shadow} opacity={0.25} />
                  <path d={`M-520 480 L-470 580 L-430 ${P_SEA + 60} L-300 ${P_SEA + 60} L-320 520 Z`} fill={F.shadow} opacity={0.18} />
                  <path d={roundPoly([[-560, 552], [-520, 520], [-488, 556]], 4)} fill={L12_COLORS.snow} />
                  <path d={roundPoly([[-336, 540], [-300, 500], [-270, 544]], 4)} fill={L12_COLORS.snow} />
                </Form>
              );
            })()}
            <line x1={-700} y1={556} x2={-40} y2={556} stroke={F.shadow} strokeWidth={4} strokeDasharray="14 10" />
          </g>
        ) : null}
        {/* the Himalayan spikes on the southern edge: they stand through the balance line */}
        {spikes && morph >= 1 ? (
          <Form d={roundPoly([...SPIKES, [1440, 830]], 6)} fill={mixHex(L12_COLORS.slate, rock, 0.25)} light={225} shadow={F.shadow} inset={18} shadowOpacity={0.45} rim={F.light} rimWidth={3} rimOpacity={0.9} bounce={F.bounce}>
            <Facets pts={SPIKES} base={900} light={225} fill={F.shadow} opacity={0.4} />
            <Facets pts={SPIKES} base={900} light={225} fill="#FFFFFF" opacity={0.25} lit />
            <path d={`M1300 200 L2000 200 L2000 452 L1770 440 L1736 470 L1700 436 L1664 474 L1628 440 L1596 468 L1560 430 L1300 440 Z`} fill={L12_COLORS.snow} />
            <Facets pts={SPIKES} base={480} light={225} fill="#9FC0D6" opacity={0.45} />
          </Form>
        ) : null}
        {/* Tibet: the slab */}
        <Form d={d} fill={rock} light={225} shadow={F.shadow} inset={36} shadowOpacity={0.3} rim={F.light} rimWidth={5} rimOpacity={0.9}>
          <path d={`M900 300 L2000 300 L2000 1000 L1100 1000 Z`} fill={F.shadow} opacity={0.14 * morph} />
          {/* three tonal steps: lit top band, the face, a warm soft base */}
          <rect x={-400} y={P_TOP - 40 - lift} width={2600} height={64} fill={mixHex(rock, "#FFF3C8", 0.5)} opacity={0.75 * morph} />
          {[0.3, 0.52, 0.74].map((k) => (
            <line key={k} x1={-200} y1={P_TOP + (P_SEA - P_TOP) * k} x2={2000} y2={P_TOP + (P_SEA - P_TOP) * k + 6} stroke={F.shadow} strokeWidth={1.5} opacity={0.25} />
          ))}
          <HazeBand y={P_SEA - 150} h={200} color={mixHex(rock, L12_COLORS.amber, 0.6)} strength={0.35 + bulge * 0.4} />
          {/* snow patches on the top */}
          {morph >= 1
            ? [300, 520, 760, 1010, 1240].map((x, i) => <ellipse key={i} cx={x + 40} cy={P_TOP + 4 - lift} rx={70 + (i % 2) * 30} ry={9} fill={L12_COLORS.snow} opacity={0.95} />)
            : null}
          {/* cloud shadows crawl across the top */}
          {[0, 1].map((i) => (
            <ellipse key={i} cx={((i * 900 + f * 1.6) % 1900) + 100} cy={P_TOP + 30 - lift} rx={190} ry={34} fill={F.shadow} opacity={0.14} />
          ))}
        </Form>
        {/* the lowland IN FRONT of the slab's foot: foothills, a hazy plain, a river glint */}
        <path d={ridgePath([[-1700, P_SEA + 10], [-1200, P_SEA - 14], [-800, P_SEA + 6], [-300, P_SEA - 30], [100, P_SEA - 6], [520, P_SEA - 26], [900, P_SEA - 4], [1300, P_SEA - 30], [1700, P_SEA - 2], [2100, P_SEA - 22], [2700, P_SEA + 8]], 1700, 40)} fill={mixHex("#8FB07A", F.haze, 0.3)} />
        <path d={ridgePath([[-1700, P_SEA + 70], [-900, P_SEA + 44], [-200, P_SEA + 66], [600, P_SEA + 40], [1400, P_SEA + 70], [2700, P_SEA + 50]], 1700, 40)} fill={mixHex("#6F9A68", F.haze, 0.15)} />
        <path d={`M-1700 ${P_SEA + 120} Q-600 ${P_SEA + 90} 200 ${P_SEA + 130} T2700 ${P_SEA + 110}`} fill="none" stroke="#D8F4F0" strokeWidth={5} opacity={0.6} strokeDasharray="60 30" strokeDashoffset={-f * 0.8} />
        {children}
       </g>
        {snow.map((p, i) => (
          <circle key={i} cx={p.x - 200} cy={p.y} r={p.r * 0.8} fill="#FFFFFF" opacity={0.55} />
        ))}
      </Layer>
      <Layer depth={1.3}>
        <path d={ridgePath([[-600, 1500], [-200, 1060], [120, 1010], [480, 1080], [800, 1500]], 1900, 40)} fill={F.near} />
        <path d={ridgePath([[1300, 1500], [1640, 1070], [1960, 1020], [2300, 1090], [2700, 1500]], 1900, 40)} fill={F.near} />
      </Layer>
    </>
  );
};

/** The dashed BALANCE line just above the plateau top (at ~5 km, #10). */
const Balance: React.FC<{ x0?: number; x1?: number; o?: number }> = ({ x0 = 140, x1 = 1900, o = 1 }) => <line x1={x0} y1={P_BAL} x2={x1} y2={P_BAL} stroke={NOON.shadow} strokeWidth={4} strokeDasharray="16 12" opacity={o} />;

const Hud: React.FC<{ value?: number; bands?: { from: number; to: number; color: string }[] }> = ({ value = HEIGHTS.tibet /* #5 */, bands = [] }) => <L12Gauge family={PETROL} value={value} base="ABOVE SEA LEVEL" bands={bands} />;

// 3-05 → 3-06: the slab arrives out of the dough's outline; the area tiles across its top
const ShotPlateau: ShotFC<C> = ({ f, len, c }) => {
  const F = NOON;
  const cam = cameraAt(f, [
    { f: 0, x: 500, y: 540, zoom: 1.12 },
    { f: len, x: 690, y: 520, zoom: 0.98 },
  ]);
  const morph = ease(f, 0, 34);
  const tA = c.area - c.plateau;
  const n = 30;
  const shown = Math.floor(ease(f, tA, tA + 90) * n);
  const area = 2.5 /* #5 */ * ease(f, tA, tA + 90);
  const v = HEIGHTS.tibet /* #5 */ * ease(f, c.level - c.plateau - 20, c.level - c.plateau + 30);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.1} grain={0.5}>
      <PlateauWorld f={f} morph={morph}>
        <Balance o={ease(f, 40, 70) * 0.8} />
        {/* the area counter tiles the top */}
        {Array.from({ length: shown }, (_, i) => (
          <rect key={i} x={262 + i * 41} y={P_TOP - 30} width={35} height={22} rx={3} fill={i % 2 ? "#FFF8E0" : mixHex("#FFF8E0", L12_COLORS.amber, 0.35)} opacity={0.92} />
        ))}
      </PlateauWorld>
      <Layer depth={0}>
        <Pill x={120} y={128} text="TIBETAN PLATEAU" fill={PF} color={HT} dot={"#B58E62"} size={20} />
        <g opacity={ease(f, tA - 4, tA + 12)}>
          <rect x={120} y={164} width={520} height={92} rx={10} fill={PF} />
          <text x={142} y={230} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 62, fontVariantNumeric: "tabular-nums", fill: HT }}>
            {area.toFixed(1)}
          </text>
          <text x={258} y={230} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 28, fill: HT }}>
            million km²
          </text>
        </g>
        <Hud value={v} />
      </Layer>
    </Stage>
  );
};

// 3-07 → 3-08: the balance line is named; a ghost layer is piled on, the base creeps out, the top sinks back (twice)
const ShotBalance: ShotFC<C> = ({ f, len, c }) => {
  const F = NOON;
  const tP = c.pile - c.balance;
  const cam = cameraAt(f, [
    { f: 0, x: 580, y: 560, zoom: 1.2 },
    { f: tP, x: 560, y: 560, zoom: 1.32 },
    { f: len, x: 550, y: 580, zoom: 1.42 },
  ]);
  // two pile-and-sink cycles after `pile`
  const cyc = Math.max(1, (len - tP) / 2);
  const u = f < tP ? 0 : ((f - tP) % cyc) / cyc;
  const k = f < tP ? 0 : Math.min(1, Math.floor((f - tP) / cyc));
  const piled = f < tP ? 0 : smooth(clamp01(u / 0.3)) * (1 - smooth(clamp01((u - 0.4) / 0.6))); // up fast, sinks back slowly
  const lift = piled * 34;
  const bulge = f < tP ? 0 : clamp01((k + smooth(clamp01((u - 0.3) / 0.7))) / 2);
  const tx = 860;
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.5}>
      <PlateauWorld f={f} bulge={bulge} lift={lift} under={<Embers frame={f} x0={100} x1={1700} y={P_SEA + 40} n={24} color="#FFC070" seed={5} rise={0.5} life={90} size={2} />}>
        {/* the ghost layer piled on top */}
        <rect x={250} y={P_TOP - lift - 4} width={1240} height={Math.max(0, lift)} fill="#FFF8E0" opacity={0.5 * clamp01(piled * 3)} stroke={F.shadow} strokeWidth={2} strokeDasharray="8 6" />
        <Balance />
        <g transform={`translate(0 ${-lift})`}>
          <GroundShadow x={tx + 4} y={P_TOP + 1} rx={24} color={F.shadow} opacity={0.4} blur={4} />
          <Tick x={tx} y={P_TOP - 2} pxPerM={52} frame={f} pose={f < tP ? "stand" : "shrug"} expression={f < tP ? "neutral" : "worried"} look={0.2} facing={1} outline={F.shadow} tilt={Math.sin(f / 6) * piled * 5} />
        </g>
        {[-1, 1].map((s) => (
          <path key={s} d={`M${870 + s * (790 + bulge * 80)} ${P_SEA - 30} l${-s * 40} -22 l0 14 l${-s * 50} 0 l0 16 l${s * 50} 0 l0 14 Z`} fill={L12_COLORS.amber} opacity={clamp01(bulge * 4) * (0.6 + 0.4 * Math.sin(f / 8))} />
        ))}
      </PlateauWorld>
      <Layer depth={0}>
        <Kicker x={120} y={128} text="— ONE GEOLOGIST'S READING" color={PETROL.shadow} size={26} />
        <g opacity={ease(f, 8, 26)}>
          <Pill x={120} y={186} text="BALANCE · ~5 km" fill={PF} color={HT} size={20} />
        </g>
        <Hud />
      </Layer>
    </Stage>
  );
};

// 3-09: the central Andes slide in beside Tibet (#11)
const ShotAndes: ShotFC<C> = ({ f, len, c }) => {
  const F = NOON;
  const tIn = Math.max(10, c.andesIn - c.andes);
  const cam = cameraAt(f, [
    { f: 0, x: 580, y: 560, zoom: 1.0 },
    { f: tIn + 40, x: 240, y: 580, zoom: 0.74 },
    { f: len, x: 200, y: 580, zoom: 0.7 },
  ]);
  const andes = ease(f, tIn - 30, tIn + 30);
  const br = ease(f, tIn + 20, tIn + 46);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.5}>
      <PlateauWorld f={f} andes={andes}>
        <Balance x0={200} x1={1540} />
        {/* the strength bracket at each base: the same soft, warm band */}
        <g opacity={br}>
          {[[-720, -30], [150, 1590]].map(([a, b], i) => (
            <path key={i} d={`M${a} ${P_SEA + 70} L${a} ${P_SEA + 96} L${b} ${P_SEA + 96} L${b} ${P_SEA + 70}`} fill="none" stroke={L12_COLORS.amber} strokeWidth={6} />
          ))}
        </g>
      </PlateauWorld>
      <Layer depth={0}>
        <Kicker x={120} y={128} text="— NATURE, 2009" color={PETROL.shadow} size={26} />
        <g opacity={andes}>
          <Pill x={250} y={440} text="CENTRAL ANDES" fill={PF} color={HT} dot={"#8C6A5A"} size={20} />
        </g>
        <Pill x={1060} y={440} text="TIBET" fill={PF} color={HT} dot={"#B58E62"} size={20} />
        <Hud />
      </Layer>
    </Stage>
  );
};

// 3-10 → 3-11: push to the southern edge; the spikes stand through the line; Tick looks up; the summit dot
const ShotSpikes: ShotFC<C> = ({ f, len, c }) => {
  const F = NOON;
  const tE = c.everest - c.spikes;
  const cam = cameraAt(f, [
    { f: 0, x: 780, y: 540, zoom: 1.05 },
    { f: tE, x: 1220, y: 450, zoom: 2.0 },
    { f: len, x: 1240, y: 430, zoom: 2.25 },
  ]);
  const v = lerp(HEIGHTS.tibet, HEIGHTS.everest, ease(f, 20, tE)); // the gauge brackets the gap: 4,500 → 8,848.86 m (#5, #1)
  const dot = ease(f, tE - 4, tE + 10);
  const pt = clamp01((f - 30) / 24);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.5}>
      <PlateauWorld f={f}>
        <Balance />
        <GroundShadow x={1394} y={P_TOP + 1} rx={24} color={F.shadow} opacity={0.4} blur={4} />
        <Tick x={1390} y={P_TOP - 2} pxPerM={56} frame={f} pose="stand" expression="neutral" expressionTo="surprised" expressionT={pt} look={1} facing={1} headTilt={-16 * pt} outline={F.shadow} staff />
        <Puffs frame={f} x={1404} y={P_TOP - 92} color={alpha("#FFFFFF", 0.7)} period={60} size={4} rise={0.3} drift={0.3} life={50} seed={3} />
        <Embers frame={f} x0={EV.x - 10} x1={EV.x + 40} y={EV.y + 6} n={14} color="#FFFFFF" seed={9} rise={0.25} life={70} size={1.6} wiggle={26} />
        <g opacity={dot}>
          <circle cx={EV.x} cy={EV.y - 2} r={6 + Math.sin(f / 9)} fill={P.vermilion} />
          <circle cx={EV.x} cy={EV.y - 2} r={9 + ((f * 0.4) % 16)} fill="none" stroke={P.vermilion} strokeWidth={1.6} opacity={1 - ((f * 0.4) % 16) / 16} />
        </g>
      </PlateauWorld>
      <Layer depth={0}>
        <g opacity={dot}>
          <Pill x={120} y={128} text="EVEREST" fill={PF} color={HT} dot={P.vermilion} size={20} />
        </g>
        <Hud value={v} bands={[{ from: HEIGHTS.tibet, to: HEIGHTS.everest, color: F.shadow }]} />
      </Layer>
    </Stage>
  );
};

// 3-12: "And spikes get trimmed": a glacier tongue slides over the top like a plane; a chip flies
const ShotTrim: ShotFC<C> = ({ f, len }) => {
  const F = NOON;
  const cam = cameraAt(f, [
    { f: 0, x: 1320, y: 360, zoom: 3.0 },
    { f: len, x: 1326, y: 356, zoom: 3.3 },
  ]);
  const slide = ease(f, 4, 40);
  const gx = lerp(1430, 1600, slide);
  const chipT = clamp01((f - 34) / 40);
  const ice = roundPoly([[gx - 220, EV.y + 4], [gx - 200, EV.y - 20], [gx + 40, EV.y - 22], [gx + 76, EV.y - 8], [gx + 60, EV.y + 6]], 6);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.5}>
      <PlateauWorld f={f}>
        <Form d={ice} fill={L12_COLORS.ice} light={225} shadow={mixHex(L12_COLORS.seaGlass, F.shadow, 0.3)} inset={6} shadowOpacity={0.5} rim="#FFFFFF" rimWidth={2} rimOpacity={0.9} hard>
          {[0.2, 0.45, 0.7].map((k) => (
            <line key={k} x1={gx - 200 + 250 * k} y1={EV.y - 22} x2={gx - 210 + 250 * k} y2={EV.y + 6} stroke={L12_COLORS.seaGlass} strokeWidth={1.2} />
          ))}
        </Form>
        {chipT > 0 && chipT < 1 ? (
          <g transform={`translate(${EV.x + 20 + chipT * 70} ${EV.y - 6 - Math.sin(chipT * Math.PI) * 30 + chipT * 40}) rotate(${chipT * 300})`}>
            <path d="M-6 -4 L6 -5 L7 4 L-4 6 Z" fill={mixHex(L12_COLORS.slate, "#B58E62", 0.25)} />
          </g>
        ) : null}
        <Embers frame={f} x0={gx + 30} x1={gx + 80} y={EV.y} n={10} color="#FFFFFF" seed={2} rise={0.3} life={40} size={1.2} wiggle={20} />
        <circle cx={EV.x} cy={EV.y - 2} r={3} fill={P.vermilion} opacity={1 - slide} />
      </PlateauWorld>
      <Layer depth={0}>
        <Hud value={HEIGHTS.everest /* #1 */} />
      </Layer>
    </Stage>
  );
};

export const SceneL03: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL03(t);
  const shots: ShotDef<C>[] = [
    { from: 0, S: ShotRoot, id: "3-01" },
    { from: c.kitchen, S: ShotKitchen, id: "3-03" },
    { from: c.slump, S: ShotSlump, id: "3-04" },
    { from: c.plateau, S: ShotPlateau, id: "3-05" },
    { from: c.balance, S: ShotBalance, id: "3-07" },
    { from: c.andes, S: ShotAndes, id: "3-09" },
    { from: c.spikes, S: ShotSpikes, id: "3-10" },
    { from: c.trimmed, S: ShotTrim, id: "3-12" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames; files from studio/public/audio/LICENSES.md only). */
export const soundL03 = (t: SceneTiming): Cue[] => {
  const c = cuesL03(t);
  const cyc = Math.max(1, (c.andes - c.pile) / 2);
  return [
    { at: 0, file: SFX.rumble, vol: 0.24, dur: c.kitchen, fadeIn: 20, fadeOut: 30 }, // 3-01 heat bed
    { at: c.weak, file: SFX.pop, vol: 0.24, dur: 20 },
    { at: c.spread, file: SFX.uBoom, vol: 0.22, dur: 100, fadeOut: 30 }, // 3-02 the base gives
    ...cutHit(c.kitchen),
    { at: c.kitchen, file: SFX.wind, vol: 0.06, dur: c.plateau - c.kitchen, fadeIn: 10, fadeOut: 20, trim: 6 }, // kettle hiss
    ...[10, 54, 98].map((o) => ({ at: c.kitchen + o, file: SFX.popLong, vol: 0.24, dur: 30 })), // Tick presses the dough
    ...cutHit(c.slump),
    { at: c.flattens, file: SFX.pop, vol: 0.2, dur: 20 }, // the tap
    { at: c.plateau - 4, file: SFX.swirl, vol: 0.2, dur: 60 }, // the morph: dough → plateau
    { at: c.plateau + 20, file: SFX.wind, vol: 0.14, dur: c.trimmed - c.plateau, fadeIn: 30, fadeOut: 30 }, // plateau wind bed
    ...[0, 15, 30, 45, 60, 75].map((o) => ({ at: c.area + o, file: SFX.click, vol: 0.12, dur: 12 })), // the area tiles
    { at: c.area + 92, file: SFX.pop, vol: 0.24, dur: 20 },
    ...cutHit(c.balance),
    { at: c.balance + 8, file: SFX.popLong, vol: 0.26, dur: 30 }, // the line is named
    ...[0, 1].flatMap((k) => [
      { at: Math.round(c.pile + k * cyc), file: SFX.swirl, vol: 0.2, dur: 60 },
      { at: Math.round(c.pile + k * cyc + 12), file: SFX.rumble, vol: 0.2, dur: Math.round(cyc - 16), fadeIn: 8, fadeOut: 20 },
    ]),
    ...cutHit(c.andes),
    { at: c.andesIn - 20, file: SFX.popLong, vol: 0.26, dur: 30 },
    { at: c.andesIn + 24, file: SFX.chime, vol: 0.22, dur: 60 },
    ...cutHit(c.spikes),
    { at: c.spikes + 16, file: SFX.riser, vol: 0.12, dur: c.everest - c.spikes, fadeOut: 20 },
    { at: c.everest, file: SFX.pop, vol: 0.26, dur: 20 }, // the summit dot
    ...cutHit(c.trimmed),
    { at: c.trimmed + 6, file: SFX.swirl, vol: 0.24, dur: 50 }, // the glacier plane
    { at: c.trimmed + 34, file: SFX.click, vol: 0.24, dur: 14 }, // the chip
  ];
};
