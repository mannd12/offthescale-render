// L11 cold open: eleven bespoke shots keyed to the narration (episodes/L11-dig-depth/script.md, scene "cold").
// Every number drawn is a row in episodes/L11-dig-depth/sources.md:
//   23 cm (#3) · 12,262 m (#2) · deepest ocean 10,935 m and 1,327 m to spare (#24 + arithmetic) ·
//   crust about 40 km, the hole not a third of it (#23) · about 20 years (#2) · Earth radius 6,371 km (#25).
// Light comes from the upper left (a low Arctic sun): lit() faces left, shade() faces right (docs/STYLE-ILLUSTRATED.md).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneTiming } from "../../../lib/timeline";
import {
  BONE,
  CornerTicks,
  Conifer,
  Flock,
  GRAPHITE,
  Gauge,
  Hatch,
  IF,
  Layer,
  P,
  PAIRS,
  Puffs,
  ReferenceFigure,
  ScaleBar,
  ShadedRidge,
  Stage,
  YouAreHere,
  bob,
  cameraAt,
  crawl,
  decadeZoom,
  drift,
  fall,
  fmt,
  labelStyle,
  lit,
  loadIllustratedFonts,
  mixHex,
  numStyle,
  ptsToPath,
  ramp,
  rnd,
  shade,
  specks,
  strataLine,
  stratumPath,
  tint,
} from "../../../lib/illustrated";
import { ColdCues, coldCues } from "../cues";

loadIllustratedFonts();

const E = PAIRS.earth;
const SEA = PAIRS.ocean.b;
const KOLA_M = 12262; // #2
const OCEAN_M = 10935; // #24
const CRUST_KM = 40; // #23
const EARTH_KM = 6371; // #25
const CORE_KM = 3485; // #25

const C = {
  skyTop: mixHex(P.bone, E.a, 0.2),
  skyMid: mixHex(P.bone, E.a, 0.1),
  sun: tint(E.b, P.bone, 0.42),
  sunRing: tint(E.b, P.bone, 0.75),
  cloud: lit(P.boneDeep, 0.35),
  cloudShade: mixHex(P.boneDeep, E.a, 0.18),
  farLit: tint(E.a, P.bone, 0.66),
  farShade: tint(E.a, P.bone, 0.55),
  midLit: tint(E.a, P.bone, 0.46),
  midShade: tint(E.a, P.bone, 0.3),
  treeLit: tint(E.a, P.ink, 0.1),
  treeShade: tint(E.a, P.ink, 0.42),
  tundra: mixHex(tint(E.b, P.bone, 0.55), E.a, 0.2),
  tundraFar: mixHex(tint(E.b, P.bone, 0.7), E.a, 0.18),
  moss: mixHex(tint(E.a, P.bone, 0.5), E.b, 0.22),
  lichen: tint(E.b, P.bone, 0.25),
  snow: "#F8F4EA",
  snowShade: mixHex("#F8F4EA", E.a, 0.2),
  fg: mixHex(E.a, P.ink, 0.62),
  fgLit: mixHex(E.a, P.ink, 0.32),
  soil: tint(E.b, P.bone, 0.48),
  clay: tint(E.b, E.a, 0.55),
  rock: tint(E.a, P.bone, 0.32),
  metal: tint(E.a, P.bone, 0.2),
  rust: mixHex(E.b, E.a, 0.45),
};

const rockBand = (i: number, k: number) =>
  mixHex(i % 2 ? tint(mixHex(E.a, E.b, 0.38), P.bone, 0.3) : tint(E.a, P.bone, 0.36), mixHex(E.a, P.graphite, 0.4), Math.min(1, k) * 0.85);

const lerp = (f: number, a: number, b: number, from: number, to: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

// ---------------------------------------------------------------------------------------------
// Shared landscape pieces (this episode only)

const Sky: React.FC<{ horizon: number }> = ({ horizon }) => (
  <g>
    <rect x={-2000} y={-2000} width={6000} height={2000 + horizon - 360} fill={C.skyTop} />
    <rect x={-2000} y={horizon - 360} width={6000} height={170} fill={C.skyMid} />
  </g>
);

const Sun: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y} r={92} fill={C.sunRing} />
    <circle cx={x} cy={y} r={58} fill={C.sun} />
  </g>
);

const Cloud: React.FC<{ x: number; y: number; w: number; f: number; seed: number; speed?: number }> = ({ x, y, w, f, seed, speed = 0.25 }) => {
  const o = drift(f, seed, 10, 260);
  const cx = x + o.x + f * speed;
  const top: [number, number][] = [
    [cx, y],
    [cx + w * 0.16, y - 24],
    [cx + w * 0.42, y - 38],
    [cx + w * 0.7, y - 26],
    [cx + w, y],
  ];
  return (
    <g>
      <path d={ptsToPath(top) + " Z"} fill={C.cloud} />
      <path d={ptsToPath([[cx + w * 0.08, y], [cx + w, y], [cx + w * 0.94, y + 9], [cx + w * 0.14, y + 9]]) + " Z"} fill={C.cloudShade} />
    </g>
  );
};

const ridgePts = (x0: number, x1: number, base: number, amp: number, seed: number, step: number): [number, number][] => {
  const pts: [number, number][] = [];
  for (let x = x0, i = 0; x <= x1; x += step, i++) pts.push([x, base - amp * (0.35 + 0.65 * Math.abs(Math.sin(i * 1.3 + seed))) - rnd(seed + i) * amp * 0.25]);
  return pts;
};

/** Far hills, the spruce ridge, birds: the backdrop shared by the surface shots. */
const Backdrop: React.FC<{ f: number; horizon: number; birds?: boolean; cloudSpeed?: number; sunX?: number; sunY?: number }> = ({
  f,
  horizon,
  birds = true,
  cloudSpeed = 0.25,
  sunX = 420,
  sunY,
}) => (
  <>
    <Layer depth={0.08}>
      <Sky horizon={horizon} />
      <Sun x={sunX} y={sunY ?? horizon - 170} />
    </Layer>
    <Layer depth={0.2}>
      <Cloud x={120} y={horizon - 300} w={340} f={f} seed={1} speed={cloudSpeed} />
      <Cloud x={980} y={horizon - 380} w={420} f={f} seed={2} speed={cloudSpeed} />
      <Cloud x={1560} y={horizon - 250} w={260} f={f} seed={3} speed={cloudSpeed} />
      {birds ? <Flock frame={f} x={1500} y={horizon - 330} vx={-1.6} n={5} size={11} color={tint(P.ink, P.bone, 0.35)} seed={4} /> : null}
    </Layer>
    <Layer depth={0.35}>
      <ShadedRidge pts={ridgePts(-600, 2600, horizon - 10, 120, 2, 150)} base={horizon + 40} fill={C.farLit} shadow={C.farShade} />
    </Layer>
    <Layer depth={0.6}>
      <ShadedRidge pts={ridgePts(-600, 2600, horizon + 4, 46, 7, 110)} base={horizon + 60} fill={C.midLit} shadow={C.midShade} />
      {[-150, -90, -40, 60, 120, 260, 330, 1180, 1240, 1300, 1390, 1500, 1570, 1760, 1830, 2050].map((x, i) => (
        <Conifer key={x} x={x} y={horizon + 6} h={58 + ((i * 37) % 46)} litColor={C.treeLit} shadeColor={C.treeShade} sway={Math.sin(f / 45 + i) * 1.4} />
      ))}
    </Layer>
  </>
);

/** Foreground silhouettes: a boulder with a lit facet and grass tufts, on a parallax layer in front of everything. */
const Foreground: React.FC<{ f: number; y: number; left?: number; right?: number }> = ({ f, y, left = -40, right = 1780 }) => (
  <g>
    <path d={ptsToPath([[left, y + 200], [left, y + 30], [left + 90, y - 40], [left + 230, y - 10], [left + 300, y + 200]]) + " Z"} fill={C.fg} />
    <path d={ptsToPath([[left, y + 30], [left + 90, y - 40], [left + 130, y + 40], [left, y + 90]]) + " Z"} fill={C.fgLit} />
    {Array.from({ length: 9 }, (_, i) => {
      const x = right + i * 26;
      const h = 60 + rnd(i + 3) * 70;
      const sw = Math.sin(f / 18 + i * 0.7) * 6;
      return <path key={i} d={`M${x - 8} ${y + 60} L${x + sw} ${y + 60 - h} L${x + 8} ${y + 60} Z`} fill={i % 2 ? C.fg : C.fgLit} />;
    })}
  </g>
);

/**
 * Block diagram of the ground: a lit top face (the tundra surface seen at a low angle) over a cut front face (the
 * strata). The hole is a slot in the front face and an ellipse on the top face. `ppm` = px per metre of depth.
 */
const Block: React.FC<{ f: number; G: number; ppm: number; holeX: number; holePx: number; capPx: number; depth?: number }> = ({ f, G, ppm, holeX, holePx, capPx, depth = 1600 }) => {
  const s1 = strataLine(-600, 2600, G + 0.7 * ppm, 8, 2);
  const s2 = strataLine(-600, 2600, G + 2.3 * ppm, 12, 5);
  const top: [number, number][] = [[-600, G], [2600, G]];
  const bot: [number, number][] = [[-600, G + depth], [2600, G + depth]];
  const back = G - 46;
  return (
    <g>
      <Hatch id="blk-clay" color={tint(E.a, P.bone, 0.22)} gap={16} dots width={1.6} />
      <Hatch id="blk-rock" color={tint(E.a, P.bone, 0.06)} gap={18} angle={60} width={1.4} />
      {/* top face: tundra with snow patches, lit */}
      <rect x={-600} y={back} width={3200} height={G - back} fill={C.tundra} />
      {[[-200, 120], [380, 90], [700, 160], [1290, 110], [1650, 140], [2050, 90]].map(([x, w], i) => (
        <path key={i} d={ptsToPath([[x, G - 30], [x + w * 0.3, G - 40], [x + w, G - 36], [x + w * 0.8, G - 24], [x + w * 0.1, G - 22]]) + " Z"} fill={C.snow} />
      ))}
      <line x1={-600} y1={back} x2={2600} y2={back} stroke={tint(P.ink, P.bone, 0.5)} strokeWidth={1.5} />
      {/* front face: strata, flat tints + hatch */}
      <path d={stratumPath(top, s1)} fill={C.soil} />
      <path d={stratumPath(s1, s2)} fill={C.clay} />
      <path d={stratumPath(s1, s2)} fill="url(#blk-clay)" />
      <path d={stratumPath(s2, bot)} fill={C.rock} />
      <path d={stratumPath(s2, bot)} fill="url(#blk-rock)" />
      {[s1, s2].map((s, i) => (
        <path key={i} d={ptsToPath(s)} fill="none" stroke={P.ink} strokeWidth={1.5} opacity={0.45} />
      ))}
      {/* lit lip where the sun hits the front edge */}
      <rect x={-600} y={G} width={3200} height={7} fill={lit(C.soil, 0.45)} />
      {/* the hole: a slot in the front face (right wall catches a little light), an opening on the top face */}
      <rect x={holeX - holePx / 2} y={G} width={holePx} height={depth} fill={P.graphite} />
      <rect x={holeX + holePx / 2 - Math.max(2, holePx * 0.18)} y={G} width={Math.max(2, holePx * 0.18)} height={depth} fill={shade(E.a, 0.45)} />
      {/* the cap: a short two-tone cylinder on the top face */}
      <ellipse cx={holeX + capPx * 0.35} cy={G - 16} rx={capPx * 0.75} ry={capPx * 0.18} fill={shade(C.tundra, 0.22)} />
      <path d={`M${holeX - capPx / 2} ${G - 20} L${holeX - capPx / 2} ${G - 12} A${capPx / 2} ${capPx * 0.16} 0 0 0 ${holeX + capPx / 2} ${G - 12} L${holeX + capPx / 2} ${G - 20} Z`} fill={shade(C.metal, 0.3)} />
      <ellipse cx={holeX} cy={G - 20} rx={capPx / 2} ry={capPx * 0.16} fill={C.metal} />
      <line x1={-600} y1={G} x2={2600} y2={G} stroke={P.ink} strokeWidth={2.5} />
      {/* survey ticks, one per metre */}
      {Array.from({ length: Math.ceil(3200 / ppm) }, (_, i) => -600 + i * ppm)
        .filter((x) => x > -200 && x < 2200)
        .map((x) => (
          <line key={x} x1={x} y1={G} x2={x} y2={G + 10} stroke={P.ink} strokeWidth={2} />
        ))}
      {specks(f, 18, 1920, Math.min(depth, 900), 21, 4).map((p, i) => (
        <circle key={i} cx={p.x} cy={G + 2.4 * ppm + p.y} r={p.r * 0.6} fill={tint(E.a, P.ink, 0.4)} opacity={0.5} />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 1 - wide tundra: the figure walks in toward a small cap (Kola label, Arctic Circle line)
const ShotWide: React.FC<{ f: number; c: ColdCues }> = ({ f, c }) => {
  const H = 560;
  const len = c.cap;
  const cam = cameraAt(f, [
    { f: 0, x: 940, y: 560, zoom: 1 },
    { f: len, x: 1010, y: 640, zoom: 1.2 },
  ]);
  const walkEnd = Math.round(len * 0.72);
  const fx = lerp(f, 0, walkEnd, 660, 975, Easing.out(Easing.quad));
  const walking = f < walkEnd - 4;
  const capX = 1060;
  const capY = 776;
  const ppm = 66;
  const kola = ramp(f, c.kola, c.kola + 10);
  const line = ramp(f, c.arctic, c.arctic + 22);
  const snow = fall(f, 46, 2400, 620, 5, 0.9, 14);
  return (
    <Stage theme={BONE} cam={cam}>
      <Backdrop f={f} horizon={H} />
      <Layer depth={1}>
        {/* tundra plane: flat stepped bands, nearer = warmer and taller */}
        <rect x={-800} y={H} width={3600} height={900} fill={C.tundraFar} />
        <rect x={-800} y={H + 60} width={3600} height={900} fill={C.tundra} />
        <rect x={-800} y={H + 190} width={3600} height={900} fill={mixHex(C.tundra, E.b, 0.12)} />
        {[[80, 610, 210], [520, 700, 140], [1250, 640, 260], [1500, 735, 180], [300, 860, 300], [1340, 900, 240]].map(([x, y, w], i) => (
          <g key={i}>
            <path d={ptsToPath([[x, y], [x + w * 0.25, y - 10], [x + w, y - 6], [x + w * 0.85, y + 8], [x + w * 0.1, y + 9]]) + " Z"} fill={C.snow} />
            <path d={ptsToPath([[x + w * 0.1, y + 9], [x + w * 0.85, y + 8], [x + w * 0.8, y + 12], [x + w * 0.16, y + 12]]) + " Z"} fill={C.snowShade} />
          </g>
        ))}
        {Array.from({ length: 26 }, (_, i) => {
          const x = rnd(i + 50) * 2300 - 200;
          const y = H + 40 + rnd(i + 90) * 420;
          const w = (30 + rnd(i + 7) * 80) * (0.5 + (y - H) / 420);
          return (
            <g key={i}>
              <path d={ptsToPath([[x, y], [x + w * 0.3, y - w * 0.12], [x + w * 0.7, y - w * 0.1], [x + w, y], [x + w * 0.5, y + w * 0.06]]) + " Z"} fill={C.moss} />
              <path d={ptsToPath([[x + w * 0.5, y + w * 0.06], [x + w, y], [x + w * 0.7, y - w * 0.1]]) + " Z"} fill={shade(C.moss, 0.15)} />
            </g>
          );
        })}
        {Array.from({ length: 50 }, (_, i) => (
          <circle key={`d${i}`} cx={rnd(i + 150) * 2300 - 200} cy={H + 30 + rnd(i + 190) * 420} r={2 + rnd(i) * 3} fill={i % 2 ? C.lichen : shade(C.tundra, 0.2)} />
        ))}
        {/* the cap, small at this distance */}
        <ellipse cx={capX + 14} cy={capY + 4} rx={26} ry={6} fill={shade(C.tundra, 0.25)} />
        <rect x={capX - 13} y={capY - 8} width={26} height={8} fill={shade(C.metal, 0.3)} />
        <ellipse cx={capX} cy={capY - 8} rx={13} ry={4} fill={C.metal} />
        {/* the figure walks in, stops, breathes; breath shows in the cold air */}
        <ReferenceFigure x={fx} y={780} pxPerM={ppm} walk={walking ? f / 22 : undefined} breath={f} look={walking ? 0 : lerp(f, walkEnd, walkEnd + 12, 0, 0.6)} />
        {!walking ? <Puffs frame={f - walkEnd} x={fx + 12} y={780 - 1.55 * ppm} color={C.snow} period={60} size={7} rise={0.5} drift={0.5} life={50} seed={3} /> : null}
        {/* Arctic Circle: a survey line drawn across the ground in front (we stand north of it) */}
        <line x1={-200} y1={960} x2={-200 + 2300 * line} y2={960} stroke={P.ink} strokeWidth={3} strokeDasharray="22 14" strokeDashoffset={crawl(f, 0.8)} opacity={0.75} />
        <text x={1560} y={940} style={labelStyle(30, P.ink, 4)} opacity={ramp(f, c.arctic + 10, c.arctic + 20) * 0.85}>
          Arctic Circle
        </text>
      </Layer>
      <Layer depth={1.25}>
        {snow.map((p, i) => (
          <circle key={i} cx={p.x - 200} cy={H + p.y} r={p.r} fill={C.snow} opacity={0.9} />
        ))}
      </Layer>
      <Layer depth={1.45}>
        <Foreground f={f} y={900} left={-60} right={1640} />
      </Layer>
      <Layer depth={0}>
        <g opacity={kola} transform={`translate(${(1 - kola) * -30} 0)`}>
          <text x={96} y={160} style={labelStyle(64, P.ink, 4)}>
            Kola Peninsula
          </text>
          <rect x={98} y={182} width={330 * kola} height={4} fill={P.ink} />
        </g>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 2 - close-up of the cap from above: bolts tick in, a 23 cm dimension, then a dinner plate covers it
const ShotCap: React.FC<{ f: number; c: ColdCues }> = ({ f, c }) => {
  const len = c.section - c.cap;
  const cam = cameraAt(f, [
    { f: 0, x: 930, y: 560, zoom: 1.0 },
    { f: len, x: 990, y: 590, zoom: 1.16 },
  ]);
  const ppm = 1400; // 23 cm → 322 px
  const cx = 1000;
  const cy = 600;
  const rx = 0.115 * ppm;
  const ry = rx * 0.5;
  const h = 34;
  const bolted = c.bolted - c.cap;
  const dim = ramp(f, c.width - c.cap, c.width - c.cap + 12);
  const pl0 = c.plate - c.cap;
  const pl1 = c.plateLand - c.cap;
  const plateY = lerp(f, pl0, pl1, -520, 0, Easing.out(Easing.cubic));
  const plateOn = f >= pl0;
  const prx = 0.135 * ppm; // a ~27 cm dinner plate: everyday grounding only (no number shown)
  const land = f >= pl1 ? Math.exp(-(f - pl1) / 5) * Math.sin((f - pl1) * 1.4) * 4 : 0;
  const spin = drift(f, 9, 3, 200);
  const wind = Array.from({ length: 22 }, (_, i) => {
    const sp = 6 + rnd(i) * 5;
    const x = ((rnd(i + 30) * 2600 + f * sp) % 2600) - 340;
    return { x, y: 80 + rnd(i + 70) * 960, w: 30 + rnd(i + 5) * 60 };
  });
  return (
    <Stage theme={BONE} cam={cam} vignette={0.2}>
      <Layer depth={1}>
        {/* ground seen from above: moss, lichen, pebbles, a snow drift; all flat, two-tone */}
        <rect x={-600} y={-600} width={3200} height={2400} fill={C.tundra} />
        {Array.from({ length: 16 }, (_, i) => {
          const x = rnd(i + 600) * 2300 - 200;
          const y = rnd(i + 700) * 1300 - 120;
          if (Math.abs(x - cx) < 300 && Math.abs(y - cy) < 200) return null;
          const w = 90 + rnd(i + 800) * 160;
          return (
            <g key={i}>
              <path d={ptsToPath([[x, y], [x + w * 0.4, y - w * 0.25], [x + w, y - w * 0.05], [x + w * 0.8, y + w * 0.3], [x + w * 0.2, y + w * 0.32]]) + " Z"} fill={C.moss} />
              <path d={ptsToPath([[x + w * 0.2, y + w * 0.32], [x + w * 0.8, y + w * 0.3], [x + w, y - w * 0.05], [x + w * 0.9, y + w * 0.2]]) + " Z"} fill={shade(C.moss, 0.14)} />
              {[0.3, 0.5, 0.7].map((k) => (
                <circle key={k} cx={x + w * k} cy={y + w * (k - 0.5) * 0.2} r={w * 0.035} fill={C.lichen} />
              ))}
            </g>
          );
        })}
        <path d={ptsToPath([[1400, 260], [1720, 200], [2100, 260], [2050, 420], [1600, 470], [1380, 380]]) + " Z"} fill={C.snow} />
        <path d={ptsToPath([[1380, 380], [1600, 470], [2050, 420], [2040, 450], [1590, 500], [1370, 400]]) + " Z"} fill={C.snowShade} />
        {Array.from({ length: 34 }, (_, i) => {
          const x = rnd(i + 11) * 2200 - 140;
          const y = rnd(i + 37) * 1300 - 100;
          if (Math.abs(x - cx) < 260 && Math.abs(y - cy) < 180) return null;
          const r = 10 + rnd(i + 3) * 22;
          const hex = (k: number): [number, number][] => Array.from({ length: 6 }, (_, j) => [x + Math.cos(j + rnd(i) * 3) * r * k, y + Math.sin(j + rnd(i) * 3) * r * 0.6 * k]);
          return (
            <g key={i}>
              <path d={ptsToPath(hex(1).map(([a, b]) => [a + r * 0.35, b + r * 0.25] as [number, number])) + " Z"} fill={shade(C.tundra, 0.25)} />
              <path d={ptsToPath(hex(1)) + " Z"} fill={shade(tint(E.a, P.bone, 0.4), 0.15)} />
              <path d={ptsToPath(hex(0.6).map(([a, b]) => [a - r * 0.2, b - r * 0.12] as [number, number])) + " Z"} fill={lit(tint(E.a, P.bone, 0.4), 0.3)} />
            </g>
          );
        })}
        {Array.from({ length: 60 }, (_, i) => (
          <circle key={`l${i}`} cx={rnd(i + 200) * 2200 - 140} cy={rnd(i + 300) * 1300 - 100} r={3 + rnd(i + 400) * 5} fill={i % 3 ? C.moss : tint(E.b, P.bone, 0.3)} />
        ))}
        {/* the figure's boots, at this scale (true size): weight shifts, shadows fall to the right */}
        {[0, 1].map((k) => {
          const shift = Math.sin(f / 50 + k * 2) * 4;
          const bx = 380 + k * 170;
          const by = 380 + k * 50 + shift;
          return (
            <g key={k}>
              <path d={ptsToPath([[bx - 40, by], [bx + 70, by], [bx + 330, by + 120], [bx + 230, by + 140]]) + " Z"} fill={shade(C.tundra, 0.3)} />
              <path d={ptsToPath([[bx - 62, -700], [bx + 62, -700], [bx + 66, by - 50], [bx - 64, by - 50]]) + " Z"} fill={k ? shade(P.vermilion, 0.3) : P.vermilion} />
              {/* boot: a straight-edged toe pointing toward the cap, darker sole */}
              <path d={ptsToPath([[bx - 70, by - 52], [bx + 70, by - 52], [bx + 150, by - 22], [bx + 160, by + 8], [bx - 74, by + 8]]) + " Z"} fill={shade(P.vermilion, k ? 0.42 : 0.18)} />
              <path d={ptsToPath([[bx - 74, by + 8], [bx + 160, by + 8], [bx + 156, by + 20], [bx - 72, by + 20]]) + " Z"} fill={shade(P.vermilion, 0.6)} />
            </g>
          );
        })}
        {/* cast shadow of the cap, then the cylinder (shadow side band, lit left band), then the top face */}
        <ellipse cx={cx + 46} cy={cy + h + 14} rx={rx * 1.08} ry={ry * 1.12} fill={shade(C.tundra, 0.32)} />
        <path d={`M${cx - rx} ${cy} L${cx - rx} ${cy + h} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy + h} L${cx + rx} ${cy} Z`} fill={shade(C.metal, 0.35)} />
        <path d={`M${cx - rx} ${cy} L${cx - rx} ${cy + h} A${rx} ${ry} 0 0 0 ${cx - rx * 0.35} ${cy + h + ry * 0.94} L${cx - rx * 0.35} ${cy + ry * 0.94} Z`} fill={shade(C.metal, 0.12)} />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={C.metal} />
        <ellipse cx={cx} cy={cy} rx={rx * 0.86} ry={ry * 0.86} fill="none" stroke={shade(C.metal, 0.25)} strokeWidth={3} />
        {/* lit crescent on the upper-left of the top face: the face minus an offset copy of itself */}
        <defs>
          <clipPath id="cap-top">
            <ellipse cx={cx} cy={cy} rx={rx * 0.86} ry={ry * 0.86} />
          </clipPath>
        </defs>
        <g clipPath="url(#cap-top)">
          <ellipse cx={cx} cy={cy} rx={rx * 0.86} ry={ry * 0.86} fill={lit(C.metal, 0.3)} />
          <ellipse cx={cx + rx * 0.12} cy={cy + ry * 0.14} rx={rx * 0.86} ry={ry * 0.86} fill={C.metal} />
        </g>
        {/* rust blooms */}
        {[[-0.4, 0.3, 30], [0.35, -0.2, 22], [0.1, 0.45, 18]].map(([u, v, r], i) => (
          <path key={i} d={ptsToPath(Array.from({ length: 7 }, (_, j) => [cx + u * rx + Math.cos(j) * r * (0.7 + rnd(i * 9 + j) * 0.5), cy + v * ry + Math.sin(j) * r * 0.5] as [number, number])) + " Z"} fill={C.rust} opacity={0.75} />
        ))}
        {/* centre boss */}
        <ellipse cx={cx} cy={cy + 6} rx={rx * 0.3} ry={ry * 0.3} fill={shade(C.metal, 0.35)} />
        <ellipse cx={cx} cy={cy} rx={rx * 0.3} ry={ry * 0.3} fill={lit(C.metal, 0.12)} />
        {/* bolts: tick in one by one on "bolted" */}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 + 0.2;
          const bx = cx + Math.cos(a) * rx * 0.72;
          const by = cy + Math.sin(a) * ry * 0.72;
          const flash = f >= bolted + i * 3 && f < bolted + i * 3 + 7;
          return (
            <g key={i}>
              <path d={ptsToPath(Array.from({ length: 6 }, (_, j) => [bx + Math.cos((j / 6) * Math.PI * 2) * 13, by + 3 + Math.sin((j / 6) * Math.PI * 2) * 7] as [number, number])) + " Z"} fill={shade(C.metal, 0.5)} />
              <path d={ptsToPath(Array.from({ length: 6 }, (_, j) => [bx + Math.cos((j / 6) * Math.PI * 2) * 13, by + Math.sin((j / 6) * Math.PI * 2) * 7] as [number, number])) + " Z"} fill={flash ? P.bone : lit(C.metal, 0.2)} />
            </g>
          );
        })}
        {/* the plate: shadow first (it sharpens as the plate lands), then rim and well, two-tone */}
        {plateOn ? (
          <g>
            <ellipse cx={cx + 40 + (plateY / -520) * 160} cy={cy + h + 24} rx={prx * (1 + (plateY / -520) * 0.3)} ry={prx * 0.52} fill={shade(C.tundra, 0.35)} opacity={0.5 + 0.5 * (1 - plateY / -520)} />
            <g transform={`translate(${spin.x * 0.5} ${plateY + land - 8})`}>
              <ellipse cx={cx} cy={cy + 8} rx={prx} ry={prx * 0.5} fill={mixHex("#FBF8F1", E.a, 0.22)} />
              <ellipse cx={cx} cy={cy} rx={prx} ry={prx * 0.5} fill="#FBF8F1" />
              <ellipse cx={cx} cy={cy + 3} rx={prx * 0.64} ry={prx * 0.32} fill={mixHex("#FBF8F1", E.a, 0.1)} />
              <path d={`M${cx + prx * 0.64} ${cy + 3} A${prx * 0.64} ${prx * 0.32} 0 0 1 ${cx - prx * 0.3} ${cy + prx * 0.3} A${prx * 0.5} ${prx * 0.22} 0 0 0 ${cx + prx * 0.64} ${cy + 3} Z`} fill={mixHex("#FBF8F1", E.a, 0.2)} />
              <ellipse cx={cx} cy={cy} rx={prx * 0.9} ry={prx * 0.45} fill="none" stroke={mixHex("#FBF8F1", E.a, 0.25)} strokeWidth={2} />
            </g>
          </g>
        ) : null}
      </Layer>
      <Layer depth={1.2}>
        {wind.map((w, i) => (
          <line key={i} x1={w.x} y1={w.y} x2={w.x + w.w} y2={w.y + 3} stroke={C.snow} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
        ))}
      </Layer>
      <Layer depth={1}>
        {/* dimension: 23 cm across (#3), drawn outward from the centre */}
        <g opacity={dim > 0 ? 1 : 0}>
          <line x1={cx - rx * dim} y1={cy - ry - 110} x2={cx + rx * dim} y2={cy - ry - 110} stroke={P.ink} strokeWidth={3} />
          {[-1, 1].map((sg) => (
            <g key={sg}>
              <line x1={cx + sg * rx * dim} y1={cy - ry - 130} x2={cx + sg * rx * dim} y2={cy - ry - 90} stroke={P.ink} strokeWidth={3} />
              <line x1={cx + sg * rx} y1={cy - ry - 80} x2={cx + sg * rx} y2={cy - 6} stroke={P.ink} strokeWidth={1.5} strokeDasharray="6 6" opacity={dim} />
            </g>
          ))}
          <text x={cx} y={cy - ry - 136} textAnchor="middle" style={numStyle(64, P.ink)} opacity={ramp(f, c.width - c.cap + 6, c.width - c.cap + 14)}>
            23 cm
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        <ScaleBar x={96} y={1000} px={0.1 * ppm * cam.zoom} label="10 CM" color={P.ink} font={IF.label} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 3 - block section: under the cap is the hole; the camera starts to fall toward it
const ShotSection: React.FC<{ f: number; c: ColdCues }> = ({ f, c }) => {
  const len = c.dive - c.section;
  const G = 520;
  const ppm = 120;
  const holeX = 1010;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 500, zoom: 1 },
    { f: 10, x: 962, y: 512, zoom: 1.01 },
    { f: len + 4, x: 1000, y: 780, zoom: 1.45 },
  ]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Backdrop f={f + 400} horizon={G - 60} birds={false} />
      <Layer depth={1}>
        <Block f={f} G={G} ppm={ppm} holeX={holeX} holePx={0.23 * ppm} capPx={0.23 * ppm + 22} />
        <ReferenceFigure x={holeX - 130} y={G - 22} pxPerM={ppm} pose="point" breath={f + 30} look={0.4} />
      </Layer>
      <Layer depth={0}>
        <Gauge x={1690} y={G} height={3 * ppm} value={lerp(f, 4, len, 0, 2.6)} max={3} unit="m" theme={BONE} format={(v) => `${v} m`} readout={false} plate={96} unitCap={false} />
        <ScaleBar x={96} y={1000} px={ppm} label="1 M" color={P.ink} font={IF.label} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 4 - the dive: down the borehole on a log scale (each power of ten takes equal time), rock bands streaming up
const DIVE_BANDS = [0, 0.7, 2.3, 8, 25, 70, 180, 450, 1100, 2400, 4200, 6500, 9000, 11000, KOLA_M, 30000];
const ShotDive: React.FC<{ f: number; c: ColdCues }> = ({ f, c }) => {
  const len = c.bottom - c.dive;
  const LOGMAX = Math.log10(1 + KOLA_M);
  const e = interpolate(f, [0, len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.2, 1) });
  const lc = e * LOGMAX; // camera depth, log10(1 + metres)
  const dc = Math.pow(10, lc) - 1;
  const K = 520; // px per power of ten
  const Y0 = 520; // screen y of the camera depth
  const y = (d: number) => Y0 + (Math.log10(1 + d) - lc) * K;
  const speed = Math.abs(interpolate(f + 1, [0, len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.2, 1) }) - e) * LOGMAX * K; // px per frame
  const shake = Math.min(1, speed / 40) * 3;
  const sx = Math.sin(f * 2.1) * shake;
  const holeL = 930;
  const holeR = 990;
  const band = (i: number) => {
    const k = i / (DIVE_BANDS.length - 1);
    if (i === 0) return C.soil;
    if (i === 1) return C.clay;
    return rockBand(i, k * 1.1);
  };
  const decades = [1, 10, 100, 1000, 10000];
  const pebbles = Array.from({ length: 90 }, (_, i) => ({ d: Math.pow(10, rnd(i + 5) * 4.3) - 1, x: rnd(i + 17) * 1700 + 110, r: 6 + rnd(i + 9) * 16, s: i }));
  const arrived = f >= len;
  const label = (d: number) => (d >= 1000 ? `${fmt(d / 1000)} km` : `${fmt(d)} m`);
  return (
    <Stage theme={BONE} vignette={0.26}>
      <Hatch id="dv-a" color={mixHex(P.ink, E.a, 0.55)} gap={18} angle={60} width={1.4} />
      <Hatch id="dv-b" color={mixHex(P.ink, E.a, 0.5)} gap={14} dots width={1.5} />
      <Hatch id="dv-c" color={mixHex(P.ink, E.a, 0.55)} gap={16} angle={-30} width={1.3} cross />
      <g transform={`translate(${sx} 0)`}>
        <rect x={-100} y={-100} width={2200} height={Math.max(0, y(0) + 100)} fill={C.skyMid} />
        <rect x={-100} y={Math.max(-100, y(20000))} width={2200} height={1400} fill={rockBand(15, 1)} />
        {DIVE_BANDS.slice(0, -1).map((d, i) => {
          const y0 = y(d);
          const y1 = y(DIVE_BANDS[i + 1]);
          if (y1 < -60 || y0 > 1140) return null;
          const top = strataLine(-100, 2020, y0, i < 2 ? 4 : 10, i * 2.3, 90);
          const bot = strataLine(-100, 2020, y1, 10, (i + 1) * 2.3, 90);
          const pat = ["dv-a", "dv-b", "dv-c"][i % 3];
          return (
            <g key={i}>
              <path d={stratumPath(top, bot)} fill={band(i)} />
              {i >= 2 ? <path d={stratumPath(top, bot)} fill={`url(#${pat})`} opacity={0.35} /> : null}
              <path d={ptsToPath(top)} fill="none" stroke={P.ink} strokeWidth={1.5} opacity={0.4} />
              {/* lit lip on each band's upper edge */}
              <path d={ptsToPath(top.map(([a, b]) => [a, b + 3] as [number, number]))} fill="none" stroke={lit(band(i), 0.3)} strokeWidth={4} opacity={0.8} />
            </g>
          );
        })}
        {pebbles.map((p) => {
          const py = y(p.d);
          if (py < -40 || py > 1120 || (p.x > holeL - 40 && p.x < holeR + 40)) return null;
          const pts = (k: number, dx = 0, dy = 0): [number, number][] => Array.from({ length: 6 }, (_, j) => [p.x + dx + Math.cos(j + p.s) * p.r * k, py + dy + Math.sin(j + p.s) * p.r * 0.65 * k]);
          return (
            <g key={p.s}>
              <path d={ptsToPath(pts(1)) + " Z"} fill={shade(band(Math.min(13, Math.max(2, Math.round(Math.log10(1 + p.d) * 3)))), 0.25)} />
              <path d={ptsToPath(pts(0.55, -p.r * 0.2, -p.r * 0.15)) + " Z"} fill={lit(band(Math.min(13, Math.max(2, Math.round(Math.log10(1 + p.d) * 3)))), 0.18)} />
            </g>
          );
        })}
        {/* the hole: dark core, shadow on the left wall, a cold lit strip on the right wall */}
        <rect x={holeL} y={y(0)} width={holeR - holeL} height={Math.max(0, y(KOLA_M) - y(0))} fill={P.graphite} />
        <rect x={holeL} y={y(0)} width={10} height={Math.max(0, y(KOLA_M) - y(0))} fill={mixHex(P.graphite, "#000000", 0.4)} />
        <rect x={holeR - 8} y={y(0)} width={8} height={Math.max(0, y(KOLA_M) - y(0))} fill={mixHex(P.graphite, P.chalk, 0.25)} />
        <path d={`M${holeL} ${y(KOLA_M)} L${holeR} ${y(KOLA_M)} L${(holeL + holeR) / 2} ${y(KOLA_M) + 18} Z`} fill={P.graphite} />
        {/* speed streaks either side of the hole */}
        {speed > 6
          ? Array.from({ length: 26 }, (_, i) => {
              const x = i % 2 ? holeL - 40 - rnd(i) * 700 : holeR + 40 + rnd(i) * 700;
              const yy = (((rnd(i + 3) * 1300 - f * speed * 1.4) % 1300) + 1300) % 1300 - 100;
              return <line key={i} x1={x} y1={yy} x2={x} y2={yy + Math.min(240, speed * 2.2)} stroke={P.bone} strokeWidth={3} opacity={Math.min(0.55, speed / 90)} />;
            })
          : null}
        {/* log depth ruler on the left: decades and their 2-9 minor ticks */}
        <rect x={150} y={-20} width={10} height={1120} fill={P.bone} stroke={P.ink} strokeWidth={1.5} opacity={0.9} />
        {decades.flatMap((d) =>
          Array.from({ length: 9 }, (_, m) => {
            const v = d * (m + 1);
            const ty = y(v);
            if (ty < -20 || ty > 1100 || v > 30000) return null;
            return <line key={`${d}-${m}`} x1={160} y1={ty} x2={m === 0 ? 196 : 176} y2={ty} stroke={P.ink} strokeWidth={m === 0 ? 3 : 1.5} />;
          }),
        )}
        {decades.map((d) => {
          const ty = y(d);
          if (ty < 0 || ty > 1080) return null;
          return (
            <g key={d}>
              <rect x={204} y={ty - 22} width={d >= 1000 ? 112 : 104} height={40} fill={P.bone} opacity={0.92} />
              <text x={212} y={ty + 10} style={numStyle(28, P.ink)}>
                {label(d)}
              </text>
            </g>
          );
        })}
      </g>
      <Layer depth={0}>
        <rect x={1460} y={92} width={380} height={128} fill={P.bone} opacity={0.94} stroke={P.ink} strokeWidth={1.5} />
        <text x={1490} y={136} style={labelStyle(26, P.inkSoft, 4)}>
          Depth
        </text>
        <text x={1490} y={200} style={numStyle(60, arrived ? P.vermilion : P.ink)}>
          {fmt(arrived ? KOLA_M : Math.round(dc))} m
        </text>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 5 - the gauge: a 3 m ruler beside the figure; the fill races to the end and runs off the scale
const ShotGauge: React.FC<{ f: number; c: ColdCues }> = ({ f, c }) => {
  const G = 400;
  const ppm = 140;
  const off = f >= 9;
  const v = off ? KOLA_M : lerp(f, 0, 8, 0, 3, Easing.in(Easing.quad));
  const hit = f - 9;
  const shakeAmt = hit >= 0 ? Math.exp(-hit / 6) * 9 : 0;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.04 },
    { f: 80, x: 980, y: 590, zoom: 1.12 },
  ]);
  const camS = { ...cam, x: cam.x + Math.sin(f * 3.3) * shakeAmt, y: cam.y + Math.cos(f * 2.7) * shakeAmt };
  const slam = hit >= 0 ? 1 + 0.35 * Math.exp(-hit / 3) : 0;
  const gx = 1080;
  const ry = G + 3 * ppm + 100;
  return (
    <Stage theme={BONE} cam={camS}>
      <Backdrop f={f + 600} horizon={G - 50} birds={false} />
      <Layer depth={1}>
        <Block f={f} G={G} ppm={ppm} holeX={1440} holePx={0.23 * ppm} capPx={0.23 * ppm + 26} />
        <ReferenceFigure x={860} y={G - 22} pxPerM={ppm} breath={f} look={hit > 4 ? 0.8 : 0.2} />
        {/* the hole keeps going: a dashed continuation past the frame */}
        <line x1={1440} y1={G + 3.3 * ppm} x2={1440} y2={1500} stroke={P.bone} strokeWidth={4} strokeDasharray="18 14" strokeDashoffset={crawl(f, 3)} opacity={0.6} />
      </Layer>
      <Layer depth={1}>
        <Gauge x={gx} y={G} height={3 * ppm} value={v} max={3} unit="m" theme={BONE} format={(x) => `${x} m`} readout={false} plate={104} unitCap={false} />
        {slam > 0 ? (
          <g transform={`translate(${gx + 7} ${ry}) scale(${slam}) translate(${-(gx + 7)} ${-ry})`}>
            <rect x={gx + 7 - 190} y={ry - 50} width={380} height={100} fill={P.vermilion} />
            <text x={gx + 7} y={ry + 26} textAnchor="middle" style={numStyle(68, P.bone)}>
              {fmt(KOLA_M)} m
            </text>
          </g>
        ) : null}
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 6 - the ocean dropped into the hole: 10,935 m of water lands with 1,327 m of hole to spare
const PXKM = 60;
const SURF = 170;
const ShotOcean: React.FC<{ f: number; c: ColdCues }> = ({ f, c }) => {
  const land = c.oceanLand - c.ocean;
  const spare = c.spare - c.ocean;
  const len = c.crust - c.ocean;
  const holeL = 880;
  const holeR = 1000;
  const bottom = SURF + (KOLA_M / 1000) * PXKM;
  const waterH = (OCEAN_M / 1000) * PXKM;
  const wTop = lerp(f, 4, land, -waterH - 60, SURF, Easing.in(Easing.cubic));
  const landed = f >= land;
  const bounce = landed ? Math.exp(-(f - land) / 5) * Math.sin((f - land) * 1.3) * 10 : 0;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1 },
    { f: spare, x: 960, y: 560, zoom: 1.02 },
    { f: len, x: 990, y: 700, zoom: 1.3 },
  ]);
  const bands = [0, 1.2, 3.5, 6.5, 9.5, 12.8, 20];
  const bTint = (i: number) => rockBand(i, i / 6);
  const br = ramp(f, spare, spare + 12);
  const wy = wTop + bounce;
  const waves = (yy: number, ph: number): [number, number][] => Array.from({ length: 9 }, (_, i) => [holeL + (i * (holeR - holeL)) / 8, yy + (i % 2 ? -7 : 3) + Math.sin(f / 6 + i + ph) * 2]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Hatch id="oc-r" color={mixHex(P.ink, E.a, 0.55)} gap={18} angle={60} width={1.3} />
      <Layer depth={0.3}>
        <rect x={-800} y={-800} width={3600} height={SURF + 800} fill={C.skyTop} />
        <rect x={-800} y={SURF - 70} width={3600} height={70} fill={C.skyMid} />
        <ShadedRidge pts={ridgePts(-800, 2800, SURF - 4, 34, 3, 120)} base={SURF + 10} fill={C.farLit} shadow={C.farShade} />
      </Layer>
      <Layer depth={1}>
        {bands.slice(0, -1).map((d, i) => {
          const t0 = strataLine(-800, 2800, SURF + d * PXKM, i ? 8 : 0, i * 1.7, 80);
          const t1 = strataLine(-800, 2800, SURF + bands[i + 1] * PXKM, 8, (i + 1) * 1.7, 80);
          return (
            <g key={i}>
              <path d={stratumPath(t0, t1)} fill={bTint(i)} />
              <path d={stratumPath(t0, t1)} fill="url(#oc-r)" opacity={0.3} />
              {i ? <path d={ptsToPath(t0)} fill="none" stroke={P.ink} strokeWidth={1.4} opacity={0.35} /> : null}
            </g>
          );
        })}
        <rect x={-800} y={SURF} width={3600} height={6} fill={lit(C.soil, 0.3)} />
        <line x1={-800} y1={SURF} x2={2800} y2={SURF} stroke={P.ink} strokeWidth={2.5} />
        {/* the hole, drawn wide so the water can show (depths to scale, width not) */}
        <rect x={holeL} y={SURF} width={holeR - holeL} height={bottom - SURF} fill={P.graphite} />
        <rect x={holeL} y={SURF} width={10} height={bottom - SURF} fill={mixHex(P.graphite, "#000000", 0.4)} />
        {/* the water column: lit left, shadow right, wave crest on top, bubbles */}
        <defs>
          <clipPath id="oc-water">
            <rect x={holeL} y={-2000} width={holeR - holeL} height={2000 + bottom} />
          </clipPath>
        </defs>
        <g clipPath={landed ? "url(#oc-water)" : undefined}>
          <path d={ptsToPath([...waves(wy, 0), [holeR, wy + waterH], [holeL, wy + waterH]]) + " Z"} fill={SEA} />
          <rect x={holeR - 34} y={wy + 4} width={34} height={waterH - 4} fill={shade(SEA, 0.22)} />
          <rect x={holeL} y={wy + 4} width={16} height={waterH - 4} fill={lit(SEA, 0.25)} />
          {Array.from({ length: 6 }, (_, i) => {
            const by = wy + waterH - ((f * (1.4 + rnd(i))) % waterH);
            return <circle key={i} cx={holeL + 24 + rnd(i + 2) * 70} cy={by} r={3 + rnd(i) * 3} fill="none" stroke={lit(SEA, 0.5)} strokeWidth={2} />;
          })}
        </g>
        {/* splash shards on landing */}
        {landed && f - land < 16
          ? Array.from({ length: 8 }, (_, i) => {
              const a = -Math.PI * (0.15 + 0.7 * (i / 7));
              const t = (f - land) / 16;
              const px = (holeL + holeR) / 2 + Math.cos(a) * 140 * t;
              const py = SURF + Math.sin(a) * 90 * t + 80 * t * t;
              return <path key={i} d={`M${px} ${py - 8} L${px + 6} ${py} L${px} ${py + 8} L${px - 6} ${py} Z`} fill={SEA} opacity={1 - t} />;
            })
          : null}
        {/* labels: water bottom on the left, hole bottom on the right, the spare between */}
        <g opacity={ramp(f, land + 2, land + 12)}>
          <line x1={540} y1={SURF + waterH} x2={holeL} y2={SURF + waterH} stroke={P.ink} strokeWidth={2} strokeDasharray="8 6" />
          <text x={530} y={SURF + waterH - 46} textAnchor="end" style={labelStyle(30, P.ink, 3)}>
            Deepest ocean
          </text>
          <text x={530} y={SURF + waterH + 12} textAnchor="end" style={numStyle(46, P.ink)}>
            {fmt(OCEAN_M)} m
          </text>
        </g>
        <line x1={holeR} y1={bottom} x2={1370} y2={bottom} stroke={P.ink} strokeWidth={2} strokeDasharray="8 6" />
        <text x={1380} y={bottom + 16} style={numStyle(46, P.ink)}>
          {fmt(KOLA_M)} m
        </text>
        <g opacity={br}>
          <path d={`M${holeR + 26} ${SURF + waterH} L${holeR + 46} ${SURF + waterH} L${holeR + 46} ${bottom} L${holeR + 26} ${bottom}`} fill="none" stroke={E.b} strokeWidth={5} />
          <rect x={holeR + 70} y={SURF + waterH + (bottom - SURF - waterH) / 2 - 36} width={240 * br} height={64} fill={E.b} />
          <text x={holeR + 86} y={SURF + waterH + (bottom - SURF - waterH) / 2 + 12} style={numStyle(44, P.ink)} opacity={ramp(f, spare + 6, spare + 12)}>
            {fmt(KOLA_M - OCEAN_M)} m
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        <ScaleBar x={96} y={1000} px={PXKM * cam.zoom} label="1 KM" color={P.ink} font={IF.label} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 7 - zoom out to the crust (about 40 km under Kola): the hole stops short of the first third
const ShotCrust: React.FC<{ f: number; c: ColdCues }> = ({ f, c }) => {
  const len = c.rig - c.crust;
  const third = c.third - c.crust;
  const bottom = SURF + (KOLA_M / 1000) * PXKM;
  const crustB = SURF + CRUST_KM * PXKM;
  const cam = cameraAt(f, [
    { f: 0, x: 990, y: 700, zoom: 1.3 },
    { f: Math.round(len * 0.7), x: 1000, y: 1420, zoom: 0.38 },
    { f: len, x: 1000, y: 1440, zoom: 0.36 },
  ]);
  const layers = [
    { a: 0, b: 15, col: tint(E.a, P.bone, 0.3) },
    { a: 15, b: 30, col: mixHex(E.a, P.graphite, 0.15) },
    { a: 30, b: 40, col: mixHex(E.a, P.graphite, 0.35) },
  ];
  const t3 = ramp(f, third, third + 14);
  const crustLab = ramp(f, third + 16, third + 28);
  const gmax = decadeZoom(12.5, 40, ramp(f, 4, Math.round(len * 0.7)));
  return (
    <Stage theme={BONE} cam={cam} vignette={0.22}>
      <Hatch id="cr-a" color={mixHex(P.ink, E.a, 0.5)} gap={22} angle={60} width={1.6} />
      <Layer depth={1}>
        <rect x={-3000} y={-3000} width={9000} height={3000 + SURF} fill={C.skyTop} />
        <rect x={-3000} y={crustB - 120} width={9000} height={3200} fill={mixHex(E.b, P.graphite, 0.45)} />
        {layers.map((l, i) => {
          const t0 = strataLine(-3000, 5000, SURF + l.a * PXKM, i ? 40 : 0, i * 2, 260);
          const t1 = strataLine(-3000, 5000, SURF + l.b * PXKM, 40, (i + 1) * 2, 260);
          return (
            <g key={i}>
              <path d={stratumPath(t0, t1)} fill={l.col} />
              <path d={stratumPath(t0, t1)} fill="url(#cr-a)" opacity={0.25} />
              <path d={ptsToPath(t1)} fill="none" stroke={P.ink} strokeWidth={2} opacity={0.4} vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}
        {/* mantle below the crust, darker, with slow convection contour crawl */}
        {[0, 1, 2].map((i) => (
          <path key={i} d={ptsToPath(strataLine(-3000, 5000, crustB + 120 + i * 120, 30, i * 4, 200))} fill="none" stroke={mixHex(E.b, P.chalk, 0.3)} strokeWidth={2} strokeDasharray="20 14" strokeDashoffset={crawl(f, 1 + i * 0.3)} vectorEffect="non-scaling-stroke" opacity={0.6} />
        ))}
        <line x1={-3000} y1={SURF} x2={5000} y2={SURF} stroke={P.ink} strokeWidth={3} vectorEffect="non-scaling-stroke" />
        {/* the hole as a line, with a halo so it reads on dark rock */}
        <line x1={940} y1={SURF} x2={940} y2={bottom} stroke={P.bone} strokeWidth={9} vectorEffect="non-scaling-stroke" />
        <line x1={940} y1={SURF} x2={940} y2={bottom} stroke={P.graphite} strokeWidth={4} vectorEffect="non-scaling-stroke" />
        {/* thirds of the crust: ruler on the right of the hole */}
        <g opacity={t3}>
          <line x1={1300} y1={SURF} x2={1300} y2={crustB} stroke={P.bone} strokeWidth={4} vectorEffect="non-scaling-stroke" />
          {[0, 1, 2, 3].map((k) => (
            <line key={k} x1={1300} y1={SURF + (k * CRUST_KM * PXKM) / 3} x2={1300 + 120} y2={SURF + (k * CRUST_KM * PXKM) / 3} stroke={P.bone} strokeWidth={4} vectorEffect="non-scaling-stroke" />
          ))}
          <line x1={940} y1={SURF + (CRUST_KM * PXKM) / 3} x2={1300} y2={SURF + (CRUST_KM * PXKM) / 3} stroke={P.bone} strokeWidth={3} strokeDasharray="12 10" vectorEffect="non-scaling-stroke" />
        </g>
      </Layer>
      <Layer depth={0}>
        {/* screen-locked labels placed from the camera so they stay crisp */}
        {(() => {
          const sx = (wx: number) => 960 + (wx - cam.x) * cam.zoom;
          const sy = (wy: number) => 540 + (wy - cam.y) * cam.zoom;
          return (
            <g>
              <text x={sx(1300) + 70} y={sy(SURF + (CRUST_KM * PXKM) / 3) + 14} style={labelStyle(40, P.bone, 3)} opacity={t3}>
                1/3
              </text>
              <g opacity={crustLab}>
                <text x={sx(1300) + 70} y={sy(SURF + CRUST_KM * PXKM * 0.62)} style={labelStyle(48, P.bone, 5)}>
                  Crust
                </text>
              </g>
            </g>
          );
        })()}
        <Gauge x={1600} y={190} height={700} value={KOLA_M / 1000} max={gmax} unit="km" theme={BONE} title="DEPTH" format={(v) => `${fmt(v)} km`} readoutText={`${fmt(KOLA_M)} m`} plate={110} unitCap={false} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 8 - the rig, years passing (time-lapse clouds, a tally to about 20), then it stops
const ShotRig: React.FC<{ f: number; c: ColdCues }> = ({ f, c }) => {
  const stop = c.stopped - c.rig;
  const running = f < stop;
  const G = 720;
  const ppm = 9; // px per metre: the figure is 15 px; the derrick is schematic, no height claimed
  const cx = 1080;
  // time-lapse: clouds race while it runs, then settle
  const tl = running ? f * 9 : stop * 9 + (f - stop) * 0.3;
  const years = Math.min(20, Math.floor(lerp(f, 4, stop - 6, 0, 20.99, Easing.inOut(Easing.quad))));
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.0 },
    { f: stop + 40, x: 1040, y: 560, zoom: 1.14 },
  ]);
  const spin = running ? f * 2.4 : stop * 2.4;
  const legL = cx - 70;
  const legR = cx + 70;
  const topY = G - 470;
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.08}>
        <Sky horizon={G} />
        <Sun x={300 + ((tl * 0.6) % 1500)} y={G - 250 - Math.sin((((tl * 0.6) % 1500) / 1500) * Math.PI) * 220} />
      </Layer>
      <Layer depth={0.2}>
        {[0, 1, 2, 3].map((i) => (
          <Cloud key={i} x={((i * 610 + tl * (0.7 + i * 0.2)) % 2600) - 500} y={G - 330 - i * 40} w={260 + i * 60} f={f} seed={i + 5} speed={0} />
        ))}
      </Layer>
      <Layer depth={0.35}>
        <ShadedRidge pts={ridgePts(-600, 2600, G - 20, 110, 5, 150)} base={G + 40} fill={C.farLit} shadow={C.farShade} />
      </Layer>
      <Layer depth={1}>
        <rect x={-600} y={G} width={3200} height={600} fill={C.tundra} />
        <rect x={-600} y={G + 90} width={3200} height={600} fill={mixHex(C.tundra, E.b, 0.12)} />
        {[[-100, G + 40, 300], [420, G + 140, 380], [1350, G + 60, 340], [1700, G + 200, 420], [900, G + 260, 300]].map(([x, y, w], i) => (
          <g key={i}>
            <path d={ptsToPath([[x, y], [x + w * 0.25, y - 12], [x + w, y - 6], [x + w * 0.85, y + 10], [x + w * 0.1, y + 11]]) + " Z"} fill={C.snow} />
            <path d={ptsToPath([[x + w * 0.1, y + 11], [x + w * 0.85, y + 10], [x + w * 0.8, y + 15], [x + w * 0.16, y + 15]]) + " Z"} fill={C.snowShade} />
          </g>
        ))}
        {Array.from({ length: 30 }, (_, i) => {
          const x = rnd(i + 900) * 2400 - 300;
          const y = G + 20 + rnd(i + 950) * 330;
          const w = 40 + rnd(i + 990) * 90;
          return <path key={`m${i}`} d={ptsToPath([[x, y], [x + w * 0.3, y - w * 0.14], [x + w, y], [x + w * 0.5, y + w * 0.07]]) + " Z"} fill={i % 3 ? C.moss : shade(C.moss, 0.15)} />;
        })}
        {/* vehicle track toward the hall */}
        <path d={ptsToPath([[cx - 200, G + 2], [cx - 420, G + 120], [cx - 900, G + 400]])} fill="none" stroke={shade(C.tundra, 0.18)} strokeWidth={10} strokeDasharray="30 12" />
        {/* drill hall: two-tone boxes, shed roof */}
        <path d={ptsToPath([[cx - 330, G], [cx - 330, G - 130], [cx + 330, G - 170], [cx + 330, G]]) + " Z"} fill={lit(tint(E.a, P.bone, 0.35), 0.1)} />
        <path d={ptsToPath([[cx + 330, G], [cx + 330, G - 170], [cx + 420, G - 150], [cx + 420, G]]) + " Z"} fill={shade(tint(E.a, P.bone, 0.35), 0.3)} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={cx - 300 + i * 120} y={G - 110 + i * -6} width={40} height={30} fill={shade(tint(E.a, P.bone, 0.35), 0.45)} />
        ))}
        {/* derrick: lattice tower, lit left leg, shaded right leg */}
        <path d={ptsToPath([[legL, G - 160], [cx - 18, topY], [cx - 8, topY], [legL + 16, G - 160]]) + " Z"} fill={lit(E.a, 0.15)} />
        <path d={ptsToPath([[legR, G - 160], [cx + 18, topY], [cx + 8, topY], [legR - 16, G - 160]]) + " Z"} fill={shade(E.a, 0.3)} />
        {Array.from({ length: 9 }, (_, i) => {
          const y0 = G - 160 - i * 34;
          const y1 = y0 - 34;
          const w0 = 70 - (i * 52) / 9;
          const w1 = 70 - ((i + 1) * 52) / 9;
          return (
            <g key={i} stroke={shade(E.a, 0.15)} strokeWidth={3}>
              <line x1={cx - w0} y1={y0} x2={cx + w1} y2={y1} />
              <line x1={cx + w0} y1={y0} x2={cx - w1} y2={y1} />
              <line x1={cx - w1} y1={y1} x2={cx + w1} y2={y1} />
            </g>
          );
        })}
        <rect x={cx - 26} y={topY - 20} width={52} height={20} fill={shade(E.a, 0.2)} />
        {/* the turning pipe: stripes crawl while it drills, freeze when it stops */}
        <g>
          <rect x={cx - 9} y={topY} width={18} height={G - 160 - topY} fill={tint(E.a, P.bone, 0.15)} />
          {Array.from({ length: 14 }, (_, i) => {
            const yy = topY + ((i * 24 + spin * 6) % (G - 160 - topY));
            return <line key={i} x1={cx - 9} y1={yy} x2={cx + 9} y2={yy + 8} stroke={shade(E.a, 0.3)} strokeWidth={3} />;
          })}
        </g>
        {running ? <Puffs frame={f} x={cx + 300} y={G - 175} color={tint(P.ink, P.bone, 0.75)} period={14} size={14} rise={1.6} drift={1.4} life={40} seed={8} /> : null}
        <ReferenceFigure x={cx - 420} y={G} pxPerM={ppm * 1.6} breath={f} look={running ? 0.6 : lerp(f, stop, stop + 10, 0.6, -0.3)} />
        {Array.from({ length: 6 }, (_, i) => (
          <Conifer key={i} x={120 + i * 80 + (i % 2) * 30} y={G + 4} h={90 + (i % 3) * 30} litColor={C.treeLit} shadeColor={C.treeShade} sway={Math.sin(f / 30 + i) * 2} />
        ))}
      </Layer>
      <Layer depth={1.4}>
        <Foreground f={f} y={980} left={-200} right={1660} />
      </Layer>
      <Layer depth={0}>
        {/* tally: twenty strokes in fives, then the honest "about" */}
        <g transform="translate(1290 150)">
          {Array.from({ length: years }, (_, i) => {
            const grp = Math.floor(i / 5);
            const k = i % 5;
            const gx = grp * 112;
            return k < 4 ? <rect key={i} x={gx + k * 20} y={0} width={8} height={70} fill={P.ink} /> : <line key={i} x1={gx - 10} y1={58} x2={gx + 80} y2={12} stroke={P.ink} strokeWidth={7} />;
          })}
          <text x={0} y={130} style={labelStyle(40, P.ink, 4)} opacity={ramp(f, stop - 8, stop + 2)}>
            About 20 years
          </text>
        </g>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 9 - "not because they ran out of planet": pull back from the crust to the whole Earth
const ShotPlanet: React.FC<{ f: number; c: ColdCues }> = ({ f, c }) => {
  const len = c.fought - c.planet;
  const ox = 820;
  const oy = 640;
  const R = 420;
  const pxkm = R / EARTH_KM;
  const pin = { x: ox, y: oy - R };
  const cam = cameraAt(f, [
    { f: 0, x: pin.x, y: pin.y + 2.5, zoom: 80 },
    { f: Math.round(len * 0.55), x: pin.x, y: pin.y + 120, zoom: 3.2 },
    { f: len, x: 930, y: 560, zoom: 1 },
  ]);
  const sx = (wx: number) => 960 + (wx - cam.x) * cam.zoom;
  const sy = (wy: number) => 540 + (wy - cam.y) * cam.zoom;
  const gmax = decadeZoom(40, EARTH_KM, ramp(f, 0, len));
  const crustPx = CRUST_KM * pxkm;
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Hatch id="pl-core" color={mixHex(E.b, P.graphite, 0.45)} gap={16} dots width={2} />
      <Layer depth={0.05}>
        {specks(f, 50, 2400, 1400, 13, 4).map((p, i) => (
          <circle key={i} cx={p.x - 240} cy={p.y - 160} r={p.r * 0.5} fill={P.chalkSoft} opacity={0.35} />
        ))}
      </Layer>
      <Layer depth={1}>
        <g transform={`rotate(${f * 0.04} ${ox} ${oy})`} stroke={P.chalkSoft} strokeWidth={2} opacity={interpolate(cam.zoom, [1.2, 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          {Array.from({ length: 72 }, (_, i) => {
            const a = (i / 72) * Math.PI * 2;
            const r2 = R + (i % 6 === 0 ? 44 : 30);
            return <line key={i} x1={ox + Math.cos(a) * (R + 20)} y1={oy + Math.sin(a) * (R + 20)} x2={ox + Math.cos(a) * r2} y2={oy + Math.sin(a) * r2} vectorEffect="non-scaling-stroke" />;
          })}
        </g>
        {/* mantle: lit disc with a flat shadow crescent on the lower right */}
        <defs>
          <clipPath id="pl-disc">
            <circle cx={ox} cy={oy} r={R} />
          </clipPath>
        </defs>
        <g clipPath="url(#pl-disc)">
          <circle cx={ox} cy={oy} r={R} fill={shade(mixHex(E.b, P.graphite, 0.5), 0.3)} />
          <circle cx={ox - R * 0.14} cy={oy - R * 0.14} r={R} fill={mixHex(E.b, P.graphite, 0.5)} />
        </g>
        <circle cx={ox} cy={oy} r={CORE_KM * pxkm} fill={mixHex(E.b, P.graphite, 0.2)} />
        <circle cx={ox} cy={oy} r={CORE_KM * pxkm} fill="url(#pl-core)" />
        {/* crust ring, ~40 km under Kola, drawn to scale */}
        <circle cx={ox} cy={oy} r={R - crustPx / 2} fill="none" stroke={tint(E.a, P.bone, 0.3)} strokeWidth={crustPx} />
        <circle cx={ox} cy={oy} r={R} fill="none" stroke={P.chalk} strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
        {/* the hole, to scale (12.262 km) */}
        <line x1={pin.x} y1={pin.y} x2={pin.x} y2={pin.y + (KOLA_M / 1000) * pxkm} stroke={P.graphite} strokeWidth={4} vectorEffect="non-scaling-stroke" />
      </Layer>
      <Layer depth={0}>
        <YouAreHere x={sx(pin.x)} y={sy(pin.y) - 6} size={34} label="Kola" font={IF.label} side="left" />
        <Gauge
          x={1600}
          y={190}
          height={700}
          value={KOLA_M / 1000}
          max={gmax}
          unit="km"
          theme={GRAPHITE}
          title="DEPTH"
          format={(v) => fmt(v)}
          readoutText={`${fmt(KOLA_M)} m`}
          marks={gmax > 6000 ? [{ v: EARTH_KM, label: "CENTRE" }] : []}
          plate={110}
          unitCap={false}
        />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 10 - "something down there fought back": the bottom of the hole, walls creeping in, bit judders
const ShotFought: React.FC<{ f: number; c: ColdCues }> = ({ f, c }) => {
  const cx = 900;
  const half = 112;
  const bottomY = 840;
  const squeeze = ramp(f, 0, 50);
  const judder = Math.sin(f * 4.1) * 4 * (0.4 + squeeze);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: 80, x: 930, y: 600, zoom: 1.16 },
  ]);
  const camS = { ...cam, x: cam.x + Math.sin(f * 2.9) * 3 * squeeze, y: cam.y + Math.cos(f * 3.7) * 2 * squeeze };
  const rock = mixHex(E.a, P.graphite, 0.5);
  const heat = (k: number) => mixHex(rock, E.b, k);
  const wall = (side: 1 | -1): [number, number][] =>
    Array.from({ length: 46 }, (_, i) => {
      const y = -60 + i * 20;
      const k = Math.max(0, (y - 380) / 460);
      const lobe = (16 + 34 * squeeze) * Math.exp(-Math.pow((y - 600) / 95, 2)) * (side > 0 ? 1 : 0.85);
      const bulge = lobe + 10 * k + Math.sin(f / 9 + i) * 2 * k * squeeze;
      return [cx + side * (half - bulge), Math.min(y, bottomY)] as [number, number];
    });
  const L = wall(-1);
  const R = wall(1);
  const bandEdge = (y: number, seed: number): [number, number][] =>
    Array.from({ length: 35 }, (_, i) => {
      const x = -200 + i * 70;
      const near = Math.max(0, 1 - Math.abs(x - cx) / 540);
      return [x, y + near * near * 70 + Math.sin(i * 0.8 + seed) * 8] as [number, number];
    });
  const edges = [bandEdge(460, 1), bandEdge(580, 2), bandEdge(690, 3), bandEdge(800, 4), bandEdge(910, 5)];
  const grit = fall(f, 26, half * 1.5, 760, 7, 3.4, 4);
  const pulse = (f % 22) / 22;
  return (
    <Stage theme={GRAPHITE} cam={camS} vignette={0.34}>
      <Hatch id="fb-r" color={mixHex(P.chalk, rock, 0.82)} gap={20} angle={25} width={1.3} />
      <Hatch id="fb-p" color={mixHex(P.chalk, rock, 0.78)} gap={14} angle={-35} width={1.3} cross />
      <Layer depth={1}>
        <rect x={-300} y={-300} width={2520} height={1680} fill={rock} />
        <rect x={-300} y={-300} width={2520} height={1680} fill="url(#fb-r)" />
        {edges.map((e, i) => (
          <path key={i} d={stratumPath(e, i < edges.length - 1 ? edges[i + 1] : [[-300, 1400], [2220, 1400]])} fill={heat(0.14 + i * 0.13)} />
        ))}
        <path d={stratumPath(edges[2], [[-300, 1400], [2220, 1400]])} fill="url(#fb-p)" />
        {edges.map((e, i) => (
          <path key={`c${i}`} d={ptsToPath(e)} fill="none" stroke={mixHex(E.b, P.chalk, 0.25)} strokeWidth={2} strokeDasharray="14 10" strokeDashoffset={crawl(f, 1.2 + i * 0.2)} opacity={0.85} />
        ))}
        {/* folded foliation pulled toward the hole */}
        {[-1, 1].map((s) =>
          [0, 1, 2, 3].map((j) => {
            const x0 = cx + s * (half + 40 + j * 62);
            const pts: [number, number][] = Array.from({ length: 26 }, (_, i) => {
              const y = -80 + i * 50;
              const k = Math.max(0, (y - 380) / 420);
              const pull = (20 + 30 * squeeze) * Math.exp(-Math.pow((y - 600) / 110, 2)) * (1 - j * 0.2);
              return [x0 - s * (k * k * (50 - j * 10) + pull), y];
            });
            return <path key={`${s}${j}`} d={ptsToPath(pts)} fill="none" stroke={mixHex(P.chalk, rock, 0.45)} strokeWidth={2} />;
          }),
        )}
        <path d={ptsToPath([...L, ...[...R].reverse()]) + " Z"} fill={P.graphite} />
        {/* inner walls: lit sliver on the right wall, shadow on the left */}
        <path d={ptsToPath(R)} fill="none" stroke={mixHex(P.graphite, P.chalk, 0.3)} strokeWidth={10} />
        <path d={ptsToPath(L)} fill="none" stroke={P.chalk} strokeWidth={2.5} />
        <path d={ptsToPath(R)} fill="none" stroke={P.chalk} strokeWidth={2.5} />
        {grit.map((g, i) => (
          <circle key={i} cx={cx - half * 0.75 + g.x} cy={60 + g.y} r={g.r * 0.7} fill={mixHex(P.chalk, P.graphite, 0.5)} />
        ))}
        {/* drill string + bit, juddering against the squeeze */}
        <g transform={`translate(${judder} ${bob(f, 4, 2, 7)})`}>
          <rect x={cx - 40} y={-300} width={80} height={1000} fill={mixHex(P.chalk, P.graphite, 0.45)} />
          <rect x={cx - 40} y={-300} width={22} height={1000} fill={mixHex(P.chalk, P.graphite, 0.3)} />
          {[80, 330, 580].map((y) => (
            <rect key={y} x={cx - 48} y={y} width={96} height={26} fill={mixHex(P.chalk, P.graphite, 0.3)} />
          ))}
          <path d={`M${cx - 44} 700 L${cx + 44} 700 L${cx + 62} 762 L${cx - 62} 762 Z`} fill={mixHex(P.chalk, P.graphite, 0.3)} stroke={P.chalk} strokeWidth={2} />
          {[-38, 0, 38].map((dx) => (
            <path key={dx} d={`M${cx + dx - 20} 762 L${cx + dx + 20} 762 L${cx + dx} 822 Z`} fill={mixHex(P.chalk, P.graphite, 0.2)} stroke={P.chalk} strokeWidth={2} />
          ))}
        </g>
        {/* the tip pulses: straight-edged rings in amber, expanding from the bottom of the hole */}
        {[0, 0.5].map((o) => {
          const k = (pulse + o) % 1;
          const r = 30 + k * 260;
          return (
            <path
              key={o}
              d={ptsToPath(Array.from({ length: 8 }, (_, j) => [cx + Math.cos((j / 8) * Math.PI * 2 + 0.39) * r, bottomY + Math.sin((j / 8) * Math.PI * 2 + 0.39) * r * 0.55] as [number, number])) + " Z"}
              fill="none"
              stroke={E.b}
              strokeWidth={4}
              opacity={(1 - k) * 0.9}
            />
          );
        })}
      </Layer>
      <Layer depth={0}>
        <text x={96} y={140} style={labelStyle(28, P.chalkSoft, 4)}>
          Depth
        </text>
        <text x={96} y={212} style={numStyle(68, P.chalk)}>
          {fmt(KOLA_M)} m
        </text>
        <ScaleBar x={96} y={1000} px={0.1 * 975} label="10 CM" color={P.chalk} font={IF.label} />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 11 - the question: title over the land, then the camera turns toward the sea ("another way in?")
const ShotTitle: React.FC<{ f: number; c: ColdCues }> = ({ f, c }) => {
  const G = 600;
  const ppm = 34;
  const holeX = 760;
  const pan = c.andIf - c.title;
  const turn = c.anotherWay - c.title;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: pan, x: 980, y: 560, zoom: 1.05 },
    { f: turn + 30, x: 1250, y: 590, zoom: 1.18 },
    { f: turn + 160, x: 1290, y: 600, zoom: 1.24 },
  ]);
  const slam = ramp(f, 0, 6);
  const sc = 1 + 0.18 * (1 - slam);
  const seaX = 1580;
  return (
    <Stage theme={BONE} cam={cam}>
      <Backdrop f={f + 900} horizon={G - 50} />
      <Layer depth={1}>
        <Block f={f} G={G} ppm={ppm} holeX={holeX} holePx={6} capPx={18} depth={900} />
        {/* the coast drops away to the sea on the right: flat sea-glass, crawling wave bands */}
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={stratumPath(strataLine(-600, 2600, G + 90 + i * 150, 12, i * 3 + 1, 120), strataLine(-600, 2600, G + 240 + i * 150, 12, i * 3 + 4, 120))} fill={rockBand(i + 2, 0.15 + i * 0.22)} />
        ))}
        <line x1={holeX} y1={G} x2={holeX} y2={G + 900} stroke={P.graphite} strokeWidth={6} />
        <path d={ptsToPath([[seaX, G - 46], [seaX + 60, G + 40], [seaX + 220, G + 130], [2600, G + 150], [2600, G - 46]]) + " Z"} fill={shade(SEA, 0.05)} />
        <path d={ptsToPath([[seaX + 60, G + 40], [seaX + 220, G + 130], [2600, G + 150], [2600, G + 170], [seaX + 200, G + 150], [seaX + 50, G + 60]]) + " Z"} fill={shade(C.rock, 0.2)} />
        <rect x={seaX + 30} y={G - 46} width={1100} height={60} fill={SEA} />
        {[0, 1, 2].map((i) => (
          <line key={i} x1={seaX + 60} y1={G - 36 + i * 18} x2={2600} y2={G - 36 + i * 18} stroke={lit(SEA, 0.4)} strokeWidth={3} strokeDasharray="40 30" strokeDashoffset={crawl(f, 0.6 + i * 0.3)} />
        ))}
        <path d={ptsToPath([[seaX, G - 46], [seaX + 60, G + 40], [seaX + 220, G + 130], [2600, G + 150]])} fill="none" stroke={P.ink} strokeWidth={2} />
        <ReferenceFigure x={holeX - 50} y={G - 22} pxPerM={ppm} breath={f} look={lerp(f, turn, turn + 14, -0.2, 1)} />
        <Puffs frame={f} x={holeX - 46} y={G - 22 - 1.55 * ppm} color={C.snow} period={70} size={4} rise={0.4} drift={0.4} life={48} seed={5} />
      </Layer>
      <Layer depth={1.4}>
        <Foreground f={f} y={900} left={-120} right={2300} />
      </Layer>
      <Layer depth={0}>
        <g opacity={slam} transform={`translate(96 210) scale(${sc}) translate(-96 -210)`}>
          <text x={96} y={210} style={labelStyle(118, P.ink, 4)}>
            How deep can we dig?
          </text>
          <rect x={100} y={236} width={1030 * ramp(f, 4, 20)} height={6} fill={P.ink} />
        </g>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
type Shot = { from: number; C: React.FC<{ f: number; c: ColdCues }> };

export const coldShots = (c: ColdCues): Shot[] => [
  { from: 0, C: ShotWide },
  { from: c.cap, C: ShotCap },
  { from: c.section, C: ShotSection },
  { from: c.dive, C: ShotDive },
  { from: c.bottom, C: ShotGauge },
  { from: c.ocean, C: ShotOcean },
  { from: c.crust, C: ShotCrust },
  { from: c.rig, C: ShotRig },
  { from: c.planet, C: ShotPlanet },
  { from: c.fought, C: ShotFought },
  { from: c.title, C: ShotTitle },
];

export const ColdOpen: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = coldCues(t);
  const shots = coldShots(c);
  let k = 0;
  for (let i = 0; i < shots.length; i++) if (f >= shots[i].from) k = i;
  const S = shots[k].C;
  return <S f={f - shots[k].from} c={c} />;
};
