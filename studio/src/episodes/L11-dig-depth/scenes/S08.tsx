// L11 scene l08 "Has anyone beaten it?": fifteen bespoke shots keyed to the narration (script.md §8).
// Every number drawn is a row in episodes/L11-dig-depth/sources.md:
//   Kola 12,262 m (#2) · Sakhalin Z-44 Chayvo 12,376 m measured, 11,371 m reach (≈ 11,400 m), at most 4,886 m deep (< 5 km) (#27)
//   · KTB 9,101 m, 1994, about 265 °C (#26) · Kola about 180 °C (#15) · Mponeng 3,160-3,740 m → 3.2-3.7 km (#28)
//   · Kola more than three times the mine (#28 arithmetic) · crust about 40 km under Kola (#23).
// Light from the upper left: lit() faces left, shade() faces right (docs/STYLE-ILLUSTRATED.md).
// Small helpers used by S09 and Closer are exported from here (this episode only; not kit).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneTiming } from "../../../lib/timeline";
import {
  BONE,
  CornerTicks,
  Conifer,
  Flock,
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
  Theme,
  cameraAt,
  crawl,
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
import { phraseAt } from "../cues";
import { Cue } from "./cue-types";

loadIllustratedFonts();

export const E = PAIRS.earth;
export const SEA = PAIRS.ocean.b;
const KOLA_M = 12262; // #2
const SAK_M = 12376; // #27
const SAK_REACH = 11371; // #27
const SAK_MAX_TVD = 4886; // #27 arithmetic
const KTB_M = 9101; // #26
const MINE_TOP = 3160; // #28
const MINE_BOT = 3740; // #28

export const C = {
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
  grass: mixHex(tint(E.a, P.bone, 0.5), E.b, 0.3),
  dry: tint(E.b, P.bone, 0.4),
  snow: "#F8F4EA",
  snowShade: mixHex("#F8F4EA", E.a, 0.2),
  soil: tint(E.b, P.bone, 0.48),
  rock: tint(E.a, P.bone, 0.32),
  metal: tint(E.a, P.bone, 0.2),
  sea: SEA,
  seaDeep: mixHex(SEA, E.a, 0.45),
  seaDeeper: mixHex(SEA, P.graphite, 0.45),
  mantle: mixHex(mixHex(SEA, E.a, 0.5), P.bone, 0.15),
  hole: P.graphite,
};

/** Rock band tone: alternating slate / warm, darker with depth k (0..1). */
export const rockBand = (i: number, k: number) =>
  mixHex(i % 2 ? tint(mixHex(E.a, E.b, 0.38), P.bone, 0.3) : tint(E.a, P.bone, 0.36), mixHex(E.a, P.graphite, 0.4), Math.min(1, k) * 0.85);
/** Stepped heat tint, k 0..1 (amber → burnt rust; never vermilion). */
export const heat = (k: number) => mixHex(tint(E.b, P.bone, 0.55), mixHex(E.b, "#7A3418", 0.55), Math.max(0, Math.min(1, k)));

export const lerp = (f: number, a: number, b: number, from: number, to: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

// ---------------------------------------------------------------------------------------------
// Shared pieces (this episode)

export const Cloud: React.FC<{ x: number; y: number; w: number; f: number; seed: number; speed?: number }> = ({ x, y, w, f, seed, speed = 0.25 }) => {
  const o = drift(f, seed, 10, 260);
  const cx = x + o.x + f * speed;
  return (
    <g>
      <path d={ptsToPath([[cx, y], [cx + w * 0.16, y - 24], [cx + w * 0.42, y - 38], [cx + w * 0.7, y - 26], [cx + w, y]]) + " Z"} fill={C.cloud} />
      <path d={ptsToPath([[cx + w * 0.08, y], [cx + w, y], [cx + w * 0.94, y + 9], [cx + w * 0.14, y + 9]]) + " Z"} fill={C.cloudShade} />
    </g>
  );
};

export const ridgePts = (x0: number, x1: number, base: number, amp: number, seed: number, step: number): [number, number][] => {
  const pts: [number, number][] = [];
  for (let x = x0, i = 0; x <= x1; x += step, i++) pts.push([x, base - amp * (0.35 + 0.65 * Math.abs(Math.sin(i * 1.3 + seed))) - rnd(seed + i) * amp * 0.25]);
  return pts;
};

/** Sky, sun, clouds, far and mid ridges for surface shots. */
export const Land: React.FC<{ f: number; horizon: number; trees?: boolean; birds?: boolean; sunX?: number; seed?: number; farLit?: string; farShade?: string }> = ({
  f,
  horizon,
  trees = true,
  birds = true,
  sunX = 380,
  seed = 2,
  farLit = C.farLit,
  farShade = C.farShade,
}) => (
  <>
    <Layer depth={0.08}>
      <rect x={-2000} y={-2000} width={6000} height={2000 + horizon - 340} fill={C.skyTop} />
      <rect x={-2000} y={horizon - 340} width={6000} height={400} fill={C.skyMid} />
      <circle cx={sunX} cy={horizon - 190} r={88} fill={C.sunRing} />
      <circle cx={sunX} cy={horizon - 190} r={56} fill={C.sun} />
    </Layer>
    <Layer depth={0.2}>
      <Cloud x={160} y={horizon - 300} w={320} f={f} seed={seed} />
      <Cloud x={1000} y={horizon - 370} w={420} f={f} seed={seed + 1} />
      <Cloud x={1580} y={horizon - 240} w={260} f={f} seed={seed + 2} />
      {birds ? <Flock frame={f} x={1450} y={horizon - 320} vx={-1.5} n={4} size={10} color={tint(P.ink, P.bone, 0.35)} seed={seed + 3} /> : null}
    </Layer>
    <Layer depth={0.35}>
      <ShadedRidge pts={ridgePts(-600, 2600, horizon - 10, 110, seed, 150)} base={horizon + 40} fill={farLit} shadow={farShade} />
    </Layer>
    <Layer depth={0.6}>
      <ShadedRidge pts={ridgePts(-600, 2600, horizon + 4, 40, seed + 5, 110)} base={horizon + 60} fill={C.midLit} shadow={C.midShade} />
      {trees
        ? [-120, -60, 90, 180, 1220, 1290, 1380, 1700, 1780, 2000].map((x, i) => (
            <Conifer key={x} x={x} y={horizon + 6} h={52 + ((i * 37) % 40)} litColor={C.treeLit} shadeColor={C.treeShade} sway={Math.sin(f / 45 + i) * 1.4} />
          ))
        : null}
    </Layer>
  </>
);

/** A drilling derrick: two-tone lattice tower (lit left leg), crown block, a doghouse at its foot, a pennant. */
export const Rig: React.FC<{ x: number; y: number; h: number; f: number; tone?: string }> = ({ x, y, h, f, tone = mixHex(E.a, P.ink, 0.25) }) => {
  const w = h * 0.34;
  const t = Math.max(2, h * 0.035);
  const litT = lit(tone, 0.3);
  const levels = 6;
  return (
    <g>
      <path d={ptsToPath([[x - w / 2, y], [x - w / 2 + t * 1.6, y], [x - h * 0.03 + t, y - h], [x - h * 0.03, y - h]]) + " Z"} fill={litT} />
      <path d={ptsToPath([[x + w / 2, y], [x + w / 2 - t * 1.6, y], [x + h * 0.03 - t, y - h], [x + h * 0.03, y - h]]) + " Z"} fill={shade(tone, 0.2)} />
      <g stroke={tone} strokeWidth={Math.max(1.2, t * 0.45)}>
        {Array.from({ length: levels }, (_, i) => {
          const a = i / levels;
          const b = (i + 1) / levels;
          const ya = y - h * a;
          const yb = y - h * b;
          const ha = w / 2 - (w / 2 - h * 0.03) * a;
          const hb = w / 2 - (w / 2 - h * 0.03) * b;
          return (
            <g key={i}>
              <line x1={x - ha} y1={ya} x2={x + hb} y2={yb} />
              <line x1={x + ha} y1={ya} x2={x - hb} y2={yb} />
              <line x1={x - hb} y1={yb} x2={x + hb} y2={yb} />
            </g>
          );
        })}
      </g>
      <rect x={x - h * 0.06} y={y - h - h * 0.05} width={h * 0.12} height={h * 0.05} fill={tone} />
      <path d={`M${x} ${y - h * 1.05} L${x} ${y - h * 1.17}`} stroke={tone} strokeWidth={1.5} />
      <path d={`M${x} ${y - h * 1.17} L${x + h * 0.09} ${y - h * (1.145 + Math.sin(f / 6) * 0.012)} L${x} ${y - h * 1.12} Z`} fill={tint(E.b, P.bone, 0.15)} />
      {/* doghouse */}
      <rect x={x - w * 0.95} y={y - h * 0.12} width={w * 0.5} height={h * 0.12} fill={lit(C.metal, 0.1)} />
      <rect x={x - w * 0.6} y={y - h * 0.12} width={w * 0.15} height={h * 0.12} fill={shade(C.metal, 0.2)} />
      <rect x={x - w * 0.85} y={y - h * 0.09} width={w * 0.1} height={h * 0.04} fill={tint(E.b, P.bone, 0.3)} />
    </g>
  );
};

/** A small drill ship: two-tone hull, deck house, a derrick amidships; bobs on the swell. */
export const Ship: React.FC<{ x: number; y: number; s: number; f: number }> = ({ x, y, s, f }) => {
  const b = Math.sin(f / 28) * 3 * s;
  const r = Math.sin(f / 37) * 1.2;
  const hull = mixHex(E.a, P.ink, 0.35);
  return (
    <g transform={`translate(${x} ${y + b}) rotate(${r}) scale(${s})`}>
      <path d="M-160 -26 L170 -26 L140 18 L-140 18 Z" fill={hull} />
      <path d="M-160 -26 L170 -26 L166 -18 L-155 -18 Z" fill={lit(hull, 0.35)} />
      <path d="M40 -26 L170 -26 L140 18 L60 18 Z" fill={shade(hull, 0.2)} />
      <rect x={-140} y={-62} width={70} height={36} fill={lit(C.metal, 0.25)} />
      <rect x={-92} y={-62} width={22} height={36} fill={shade(C.metal, 0.15)} />
      <rect x={-132} y={-54} width={40} height={8} fill={tint(E.a, P.bone, 0.1)} />
      <Rig x={30} y={-26} h={120} f={f} />
      <rect x={-160} y={18} width={330} height={4} fill={shade(SEA, 0.3)} opacity={0.6} />
    </g>
  );
};

/** Sea surface band with crawling swell lines (flat sea-glass). */
export const SeaTop: React.FC<{ x0: number; x1: number; y: number; h: number; f: number }> = ({ x0, x1, y, h, f }) => (
  <g>
    <rect x={x0} y={y} width={x1 - x0} height={h} fill={SEA} />
    {[0, 1, 2].map((i) => (
      <line key={i} x1={x0} y1={y + 8 + i * (h / 3.2)} x2={x1} y2={y + 8 + i * (h / 3.2)} stroke={lit(SEA, 0.4)} strokeWidth={3} strokeDasharray="44 32" strokeDashoffset={crawl(f, 0.6 + i * 0.35)} opacity={0.8} />
    ))}
  </g>
);

/** Stepped rock strata between G and bottom. */
export const Strata: React.FC<{ G: number; bottom: number; n: number; seed: number; x0?: number; x1?: number; dark?: number; id: string; amp?: number }> = ({
  G,
  bottom,
  n,
  seed,
  x0 = -800,
  x1 = 2800,
  dark = 0.8,
  id,
  amp = 10,
}) => {
  const ys = Array.from({ length: n + 1 }, (_, i) => G + ((bottom - G) * i) / n);
  const lines = ys.map((y, i) => (i === 0 ? ([[x0, G], [x1, G]] as [number, number][]) : i === n ? ([[x0, bottom], [x1, bottom]] as [number, number][]) : strataLine(x0, x1, y, amp, seed + i, 90)));
  return (
    <g>
      <Hatch id={id} color={tint(E.a, P.bone, 0.08)} gap={18} angle={60} width={1.3} />
      {lines.slice(0, -1).map((l, i) => (
        <g key={i}>
          <path d={stratumPath(l, lines[i + 1])} fill={rockBand(i, (i / n) * dark)} />
          {i % 2 ? <path d={stratumPath(l, lines[i + 1])} fill={`url(#${id})`} opacity={0.5} /> : null}
        </g>
      ))}
      {lines.slice(1, -1).map((l, i) => (
        <path key={i} d={ptsToPath(l)} fill="none" stroke={P.ink} strokeWidth={1.3} opacity={0.35} />
      ))}
    </g>
  );
};

/** A label plate: flat panel with ink border and an Anton label or Inter number. */
export const Tag: React.FC<{ x: number; y: number; text: string; size?: number; num?: boolean; anchor?: "start" | "middle" | "end"; theme?: Theme; o?: number; plain?: boolean }> = ({
  x,
  y,
  text,
  size = 34,
  num = false,
  anchor = "start",
  theme = BONE,
  o = 1,
  plain = false,
}) => {
  const w = text.length * size * (num ? 0.6 : 0.47) + size * 0.9;
  const h = size * 1.45;
  const left = anchor === "start" ? x : anchor === "middle" ? x - w / 2 : x - w;
  return (
    <g opacity={o}>
      {plain ? null : <rect x={left} y={y - h / 2} width={w} height={h} fill={theme.bg} stroke={theme.line} strokeWidth={2} />}
      <text x={left + w / 2} y={y + size * 0.36} textAnchor="middle" style={num ? numStyle(size, theme.text) : labelStyle(size, theme.text, 2)}>
        {text}
      </text>
    </g>
  );
};

/** Chapter title, top left, screen-locked. */
export const Chapter: React.FC<{ n: string; title: string; o: number; theme?: Theme }> = ({ n, title, o, theme = BONE }) => (
  <g opacity={o} transform={`translate(${(1 - o) * -24} 0)`}>
    <text x={96} y={150} style={labelStyle(30, theme.dim, 5)}>
      {n}
    </text>
    <text x={96} y={214} style={labelStyle(64, theme.text, 3)}>
      {title}
    </text>
    <rect x={98} y={234} width={140 * o} height={5} fill={theme.text} />
  </g>
);

/** Dimension line with end ticks (horizontal or vertical), drawn to fraction k. */
export const Dim: React.FC<{ x1: number; y1: number; x2: number; y2: number; k?: number; color?: string; w?: number }> = ({ x1, y1, x2, y2, k = 1, color = P.ink, w = 2.5 }) => {
  const ex = x1 + (x2 - x1) * k;
  const ey = y1 + (y2 - y1) * k;
  const vert = Math.abs(x2 - x1) < Math.abs(y2 - y1);
  const t = 12;
  return (
    <g stroke={color} strokeWidth={w}>
      <line x1={x1} y1={y1} x2={ex} y2={ey} />
      {vert ? <line x1={x1 - t} y1={y1} x2={x1 + t} y2={y1} /> : <line x1={x1} y1={y1 - t} x2={x1} y2={y1 + t} />}
      {k > 0.98 ? vert ? <line x1={x2 - t} y1={y2} x2={x2 + t} y2={y2} /> : <line x1={x2} y1={y2 - t} x2={x2} y2={y2 + t} /> : null}
    </g>
  );
};

/** Lit top face of a cut block of ground (the low-angle surface), drawn above G. */
export const TopFace: React.FC<{ G: number; color: string; x0?: number; x1?: number; d?: number }> = ({ G, color, x0 = -800, x1 = 2800, d = 40 }) => (
  <g>
    <rect x={x0} y={G - d} width={x1 - x0} height={d} fill={color} />
    <line x1={x0} y1={G - d} x2={x1} y2={G - d} stroke={tint(P.ink, P.bone, 0.5)} strokeWidth={1.5} />
    <rect x={x0} y={G} width={x1 - x0} height={6} fill={lit(C.soil, 0.45)} />
    <line x1={x0} y1={G} x2={x1} y2={G} stroke={P.ink} strokeWidth={2.5} />
  </g>
);

export type ShotProps<K> = { f: number; len: number; k: K };
export type ShotDef<K> = { from: number; C: React.FC<ShotProps<K>> };
/** Plays the shot whose start is the latest one ≤ frame; each shot gets shot-relative frames and its own length. */
export function playShots<K>(frame: number, shots: ShotDef<K>[], k: K, end: number) {
  let i = 0;
  for (let j = 0; j < shots.length; j++) if (frame >= shots[j].from) i = j;
  const S = shots[i].C;
  const len = (i + 1 < shots.length ? shots[i + 1].from : end) - shots[i].from;
  return <S f={frame - shots[i].from} len={len} k={k} />;
}

// ---------------------------------------------------------------------------------------------
// Cues

const l08Cues = (t: SceneTiming) => {
  const at = (i: number) => t.lines[i].at;
  const p = (i: number, s: string, o = 0) => phraseAt(t, i, s, o);
  return {
    s2012: p(0, "In 2012", -3),
    reached: p(0, "reached", -2),
    sideways: at(1) - 4,
    geometry: p(1, "Do the geometry", -3),
    cant: p(1, "can't be more"),
    five: p(1, "five kilometres"),
    germany: at(2) - 6,
    ktb: p(2, "The KTB stopped", -3),
    y1994: p(2, "1994"),
    down: p(2, "Down there", -3),
    hotter: at(3) - 6,
    kolaWas: p(3, "than Kola"),
    gfz: p(3, "As Germany's", -3),
    tooWarm: p(3, "too warm"),
    stand: at(4) - 6,
    mine: p(4, "The deepest mine", -3),
    between: p(4, "works between"),
    kola3: p(4, "Kola goes", -3),
    record: at(5) - 6,
    crust: p(5, "But the crust", -3),
    end: t.frames,
  };
};
type K8 = ReturnType<typeof l08Cues>;
type SP = ShotProps<K8>;

// ---------------------------------------------------------------------------------------------
// Shot 1 - "Longer holes exist.": Kola laid flat as a bar, a longer bar slides in under it
const ShotLonger: React.FC<SP> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.06 },
    { f: Math.max(len, 60), x: 1000, y: 560, zoom: 1.14 },
  ]);
  const pxm = 1100 / 13000;
  const x0 = 360;
  const a = ramp(f, 0, 16);
  const b = ramp(f, 10, 34);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.3}>
        {specks(f, 30, 2200, 1200, 3, 6).map((s, i) => (
          <circle key={i} cx={s.x - 140} cy={s.y - 60} r={s.r * 0.7} fill={tint(E.a, P.bone, 0.55)} />
        ))}
      </Layer>
      <Layer depth={1}>
        <text x={x0} y={500} style={labelStyle(34, P.inkSoft, 4)}>
          KOLA
        </text>
        <rect x={x0} y={520} width={KOLA_M * pxm * a} height={34} fill={E.a} />
        <rect x={x0} y={520} width={KOLA_M * pxm * a} height={8} fill={lit(E.a, 0.3)} />
        <text x={x0 + KOLA_M * pxm * a + 20} y={550} style={numStyle(34, P.ink)} opacity={a}>
          {fmt(KOLA_M)} m
        </text>
        <rect x={x0} y={600} width={(KOLA_M * pxm + 150) * b} height={34} fill={tint(E.b, P.bone, 0.2)} />
        <rect x={x0} y={600} width={(KOLA_M * pxm + 150) * b} height={8} fill={lit(E.b, 0.3)} />
        <text x={x0 + (KOLA_M * pxm + 150) * b + 20} y={632} style={labelStyle(44, P.ink, 2)} opacity={b}>
          ?
        </text>
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={x0 + i * 1000 * pxm} y1={680} x2={x0 + i * 1000 * pxm} y2={i % 5 === 0 ? 702 : 692} stroke={P.ink} strokeWidth={2} />
        ))}
        <line x1={x0} y1={680} x2={x0 + 13000 * pxm} y2={680} stroke={P.ink} strokeWidth={2} />
      </Layer>
      <Layer depth={0}>
        <Chapter n="08" title="Has anyone beaten it?" o={ramp(f, 0, 12)} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 2 - Sakhalin coast, 2012: a rig at the shore, the cold sea with drifting ice floes
const ShotCoast: React.FC<SP> = ({ f, len }) => {
  const H = 600;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.0 },
    { f: Math.max(len, 60), x: 1000, y: 600, zoom: 1.12 },
  ]);
  const coast = 1020;
  const snow = fall(f, 40, 2400, 700, 9, 0.8, 12);
  return (
    <Stage theme={BONE} cam={cam}>
      <Land f={f} horizon={H} trees={false} seed={11} />
      <Layer depth={1}>
        <rect x={-800} y={H} width={3600} height={900} fill={C.tundra} />
        <path d={ptsToPath([[coast, H], [coast + 120, H + 70], [coast + 260, H + 160], [coast + 300, 1200], [2800, 1200], [2800, H]]) + " Z"} fill={SEA} />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={coast + 60 + i * 60} y1={H + 20 + i * 45} x2={2800} y2={H + 20 + i * 45} stroke={lit(SEA, 0.4)} strokeWidth={3} strokeDasharray="44 30" strokeDashoffset={crawl(f, 0.5 + i * 0.3)} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => {
          const x = coast + 260 + i * 210 + ((f * 0.35 + i * 50) % 220);
          const y = H + 40 + (i % 3) * 70;
          const w = 50 + rnd(i + 3) * 60;
          return (
            <g key={i}>
              <path d={ptsToPath([[x, y], [x + w, y - 4], [x + w * 0.9, y + 10], [x + 6, y + 12]]) + " Z"} fill={C.snow} />
              <path d={ptsToPath([[x + 6, y + 12], [x + w * 0.9, y + 10], [x + w * 0.88, y + 15], [x + 8, y + 16]]) + " Z"} fill={C.snowShade} />
            </g>
          );
        })}
        <path d={ptsToPath([[coast, H], [coast + 120, H + 70], [coast + 260, H + 160], [coast + 300, 1200]])} fill="none" stroke={P.ink} strokeWidth={2} />
        {[[120, 680, 220], [480, 760, 160], [760, 650, 140], [200, 900, 300]].map(([x, y, w], i) => (
          <path key={i} d={ptsToPath([[x, y], [x + w * 0.3, y - 10], [x + w, y - 4], [x + w * 0.8, y + 9], [x + w * 0.1, y + 8]]) + " Z"} fill={C.snow} />
        ))}
        <Rig x={880} y={H + 40} h={300} f={f} />
        <ReferenceFigure x={700} y={H + 60} pxPerM={30} breath={f} look={0.6} />
      </Layer>
      <Layer depth={1.25}>
        {snow.map((p, i) => (
          <circle key={i} cx={p.x - 200} cy={p.y + 100} r={p.r} fill={C.snow} opacity={0.85} />
        ))}
      </Layer>
      <Layer depth={0}>
        <g opacity={ramp(f, 2, 12)}>
          <text x={96} y={170} style={labelStyle(72, P.ink, 4)}>
            Sakhalin
          </text>
          <rect x={98} y={190} width={300 * ramp(f, 4, 18)} height={4} fill={P.ink} />
        </g>
        <Tag x={98} y={250} text="2012" num size={34} o={ramp(f, 8, 16)} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Sakhalin section geometry (km → px). The drawn path is illustrative; only the labelled numbers are data.
const SK = 120;
const SX0 = 190;
const SG = 330;
const sakPts = (n: number, m: number): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    const cx = (SAK_REACH / 1000) * Math.pow(u, 1.6);
    const cy = 2.6 * (1 - Math.pow(1 - u, 3));
    const lx = (SAK_REACH / 1000) * u;
    const ly = (SAK_MAX_TVD / 1000) * u;
    return [SX0 + (cx + (lx - cx) * m) * SK, SG + (cy + (ly - cy) * m) * SK];
  });

const SakSection: React.FC<{ f: number; draw: number; m: number }> = ({ f, draw, m }) => {
  const pts = sakPts(120, m).slice(0, Math.max(2, Math.round(121 * draw)));
  const coast = SX0 + 150;
  return (
    <g>
      <rect x={-800} y={-800} width={3600} height={800 + SG - 40} fill={C.skyMid} />
      <Strata G={SG} bottom={SG + 900} n={7} seed={3} id="s8-sak" dark={0.7} />
      <rect x={-800} y={SG - 26} width={coast + 800} height={26} fill={C.tundra} />
      <SeaTop x0={coast} x1={2800} y={SG - 26} h={26} f={f} />
      <line x1={-800} y1={SG} x2={2800} y2={SG} stroke={P.ink} strokeWidth={2.5} />
      <Rig x={SX0} y={SG - 26} h={120} f={f} />
      <path d={ptsToPath(pts)} fill="none" stroke={C.hole} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
};

// Shot 3 - the well draws itself: down, then curving out flat under the sea; the length counter rolls to 12,376 m
const ShotPath: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: SX0 + 40, y: SG + 60, zoom: 2.4 },
    { f: Math.round(L * 0.85), x: 900, y: 560, zoom: 1 },
    { f: L + 20, x: 920, y: 560, zoom: 0.98 },
  ]);
  const d = lerp(f, 6, L * 0.85, 0, 1, Easing.inOut(Easing.quad));
  const tip = sakPts(120, 0)[Math.round(120 * d)];
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <SakSection f={f} draw={d} m={0} />
        <circle cx={tip[0]} cy={tip[1]} r={9} fill={P.ink} />
      </Layer>
      <Layer depth={0}>
        <g>
          <rect x={1380} y={120} width={420} height={110} fill={P.bone} stroke={P.ink} strokeWidth={2} />
          <text x={1400} y={150} style={labelStyle(24, P.inkSoft, 4)}>
            LENGTH
          </text>
          <text x={1780} y={214} textAnchor="end" style={numStyle(58, P.ink)}>
            {fmt(Math.round(SAK_M * d))} m
          </text>
        </g>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 4 - "it ends about 11,400 m sideways": the camera runs along the flat leg, a dimension line follows
const ShotSideways: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const endX = SX0 + (SAK_REACH / 1000) * SK;
  const cam = cameraAt(f, [
    { f: 0, x: 700, y: 520, zoom: 1.45 },
    { f: L, x: endX - 200, y: 500, zoom: 1.3 },
  ]);
  const k = lerp(f, 4, L * 0.8, 0, 1);
  const y = SG - 90;
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <SakSection f={f} draw={1} m={0} />
        <line x1={endX} y1={SG - 26} x2={endX} y2={SG + 2.6 * SK} stroke={P.ink} strokeWidth={2} strokeDasharray="8 8" opacity={k} />
        <Dim x1={SX0} y1={y} x2={endX} y2={y} k={k} />
        <Tag x={SX0 + (endX - SX0) * Math.max(0.5, k * 0.9)} y={y - 46} text="≈ 11,400 m" num size={36} anchor="middle" o={ramp(f, L * 0.4, L * 0.6)} />
        <Tag x={endX - 20} y={SG + 2.6 * SK + 60} text="Out under the sea" size={30} anchor="end" o={ramp(f, L * 0.7, L * 0.9)} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 5 - "Do the geometry": the curved path straightens into a hypotenuse; the vertical leg can't exceed 4.9 km
const ShotGeometry: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.08 },
    { f: L, x: 930, y: 580, zoom: 1.0 },
  ]);
  const m = lerp(f, 4, 34, 0, 1);
  const cant = k.cant - k.geometry;
  const endX = SX0 + (SAK_REACH / 1000) * SK;
  const endY = SG + (SAK_MAX_TVD / 1000) * SK;
  const leg = ramp(f, cant - 6, cant + 14);
  const gv = (SAK_MAX_TVD / 1000) * ramp(f, cant, k.five - k.geometry + 10);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <SakSection f={f} draw={1} m={m} />
        {/* the real end stays where it was: drawn faint once the path is straightened */}
        <path d={ptsToPath(sakPts(120, 0))} fill="none" stroke={C.hole} strokeWidth={3} strokeDasharray="10 10" opacity={0.45 * m} />
        <Dim x1={SX0} y1={SG - 90} x2={endX} y2={SG - 90} />
        <Tag x={SX0 + (endX - SX0) / 2} y={SG - 136} text="≈ 11,400 m" num size={30} anchor="middle" />
        <line x1={endX} y1={SG} x2={endX} y2={SG + (endY - SG) * leg} stroke={P.ink} strokeWidth={3} strokeDasharray="12 8" strokeDashoffset={crawl(f, 1)} />
        <path d={`M${endX - 26} ${endY} L${endX - 26} ${endY - 26} L${endX} ${endY - 26}`} fill="none" stroke={P.ink} strokeWidth={2} opacity={leg} />
        <g transform={`rotate(${(Math.atan2(endY - SG, endX - SX0) * 180) / Math.PI} ${SX0} ${SG})`} opacity={ramp(f, 30, 44)}>
          <Tag x={SX0 + 640} y={-30 + SG} text="12,376 m" num size={30} anchor="middle" />
        </g>
        <Tag x={endX - 40} y={SG + (endY - SG) / 2} text="< 5 km" num size={44} anchor="end" o={leg} />
      </Layer>
      <Layer depth={0}>
        <Gauge
          x={1680}
          y={200}
          height={680}
          value={gv}
          max={15}
          unit="km"
          theme={BONE}
          title="DEPTH"
          readoutText="< 5 km"
          marks={[{ v: KOLA_M / 1000, label: "KOLA" }]}
          plate={104}
          unitCap={false}
          readout={f > cant}
        />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 6 - Germany: a tall derrick in green hills; the figure walks past at the bottom
const ShotGermany: React.FC<SP> = ({ f, len }) => {
  const H = 640;
  const cam = cameraAt(f, [
    { f: 0, x: 1000, y: 470, zoom: 1.15 },
    { f: Math.max(len, 60), x: 960, y: 540, zoom: 1.0 },
  ]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Land f={f} horizon={H} seed={21} sunX={330} farLit={mixHex(C.farLit, C.grass, 0.3)} farShade={mixHex(C.farShade, C.grass, 0.3)} />
      <Layer depth={1}>
        <rect x={-800} y={H} width={3600} height={900} fill={C.grass} />
        <rect x={-800} y={H + 140} width={3600} height={900} fill={mixHex(C.grass, E.b, 0.15)} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={i} x1={-800} y1={H + 30 + i * 50} x2={2800} y2={H + 30 + i * 50 + (i % 2 ? 20 : -10)} stroke={shade(C.grass, 0.12)} strokeWidth={2} opacity={0.6} />
        ))}
        <Rig x={1200} y={H + 60} h={560} f={f} />
        <ReferenceFigure x={lerp(f, 0, Math.max(len, 60), 700, 860, Easing.linear)} y={H + 110} pxPerM={40} walk={f / 22} breath={f} />
      </Layer>
      <Layer depth={0}>
        <g opacity={ramp(f, 2, 12)}>
          <text x={96} y={170} style={labelStyle(72, P.ink, 4)}>
            KTB · Germany
          </text>
          <rect x={98} y={190} width={420 * ramp(f, 4, 18)} height={4} fill={P.ink} />
        </g>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// KTB straight-down section: K px per km
const KK = 76;
const KG = 190;
// Shot 7 - "stopped in 1994 at 9,101 m": the camera rides down beside the straight hole; the gauge fills
const ShotKtb: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const d = lerp(f, 0, L * 0.85, 0, 1, Easing.inOut(Easing.quad));
  const tipY = KG + (KTB_M / 1000) * KK * d;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: KG + 80, zoom: 1.6 },
    { f: Math.round(L * 0.85), x: 900, y: 560, zoom: 1.0 },
    { f: L + 30, x: 900, y: 570, zoom: 0.98 },
  ]);
  const hx = 820;
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-800} y={-800} width={3600} height={800 + KG - 40} fill={C.skyMid} />
        <Strata G={KG} bottom={KG + 1100} n={9} seed={8} id="s8-ktb" />
        <TopFace G={KG} color={C.grass} />
        <Rig x={hx} y={KG - 20} h={130} f={f} />
        <line x1={hx} y1={KG} x2={hx} y2={tipY} stroke={C.hole} strokeWidth={7} />
        <rect x={hx - 7} y={tipY - 4} width={14} height={14} fill={P.ink} transform={`rotate(${f * 8} ${hx} ${tipY + 3})`} />
        {Array.from({ length: 9 }, (_, j) => j + 1).map((i) => (
          <g key={i} opacity={d * 9.101 >= i ? 1 : 0.35}>
            <line x1={hx + 30} y1={KG + i * KK} x2={hx + 52} y2={KG + i * KK} stroke={P.ink} strokeWidth={2} />
            <text x={hx + 62} y={KG + i * KK + 8} style={numStyle(24, P.ink)}>
              {i} km
            </text>
          </g>
        ))}
      </Layer>
      <Layer depth={0}>
        <Gauge x={1560} y={190} height={700} value={(KTB_M / 1000) * d} max={10} unit="km" theme={BONE} title="DEPTH" readoutText={`${fmt(Math.round(KTB_M * d))} m`} plate={96} unitCap={false} />
        <Tag x={1250} y={160} text="1994" num size={40} o={ramp(f, k.y1994 - k.ktb, k.y1994 - k.ktb + 8)} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

/** Close-up of a hole bottom with stepped heat bands closing in; `rot` = bit turning, `hot` 0..1. */
const HoleBottom: React.FC<{ f: number; hot: number; rot: number; bands?: number }> = ({ f, hot, rot, bands = 7 }) => {
  const hx = 960;
  const by = 760;
  return (
    <g>
      {Array.from({ length: bands }, (_, i) => {
        const y0 = -200 + (i * 1200) / bands;
        const top = strataLine(-800, 2800, y0, 10, 30 + i, 80);
        const bot = i === bands - 1 ? ([[-800, 1800], [2800, 1800]] as [number, number][]) : strataLine(-800, 2800, y0 + 1200 / bands, 10, 31 + i, 80);
        return <path key={i} d={stratumPath(top, bot)} fill={heat((i / (bands - 1)) * (0.35 + 0.65 * hot))} />;
      })}
      <Hatch id="s8-hb" color={mixHex(E.b, P.ink, 0.5)} gap={20} angle={50} width={1.2} />
      <rect x={-800} y={-200} width={3600} height={2000} fill="url(#s8-hb)" opacity={0.25} />
      {/* heat contours crowd round the bottom of the hole */}
      {[0, 1, 2, 3, 4].map((i) => {
        const r = 120 + i * 90 - hot * 40;
        return <ellipse key={i} cx={hx} cy={by + 40} rx={r * 1.5} ry={r} fill="none" stroke={mixHex(E.b, P.ink, 0.45)} strokeWidth={2} strokeDasharray="14 10" strokeDashoffset={crawl(f, 0.8 + i * 0.2)} opacity={0.55} />;
      })}
      <rect x={hx - 70} y={-200} width={140} height={by + 200 + 60} fill={C.hole} />
      <rect x={hx + 52} y={-200} width={18} height={by + 260} fill={shade(E.a, 0.45)} />
      {/* pipe and bit */}
      <rect x={hx - 26} y={-200} width={52} height={by + 200 - 50} fill={C.metal} />
      <rect x={hx + 6} y={-200} width={20} height={by + 150} fill={shade(C.metal, 0.3)} />
      {Array.from({ length: 12 }, (_, i) => {
        const y = (((i * 90 + rot * 30) % 1080) + 1080) % 1080 - 200;
        return y < by - 60 ? <rect key={i} x={hx - 26} y={y} width={52} height={10} fill={shade(C.metal, 0.15)} /> : null;
      })}
      <path d={`M${hx - 50} ${by - 50} L${hx + 50} ${by - 50} L${hx + 40} ${by + 20} L${hx} ${by + 50} L${hx - 40} ${by + 20} Z`} fill={mixHex(E.a, P.ink, 0.3)} />
      <path d={`M${hx - 50} ${by - 50} L${hx} ${by - 50} L${hx} ${by + 50} L${hx - 40} ${by + 20} Z`} fill={lit(mixHex(E.a, P.ink, 0.3), 0.25)} />
      {[0, 1, 2].map((i) => {
        const ph = ((rot * 0.4 + i / 3) % 1) * Math.PI * 2;
        return <circle key={i} cx={hx + Math.sin(ph) * 36} cy={by + 10} r={7} fill={Math.cos(ph) > 0 ? P.ink : lit(C.metal, 0.3)} />;
      })}
      {specks(f, 16, 600, 300, 41, 6).map((s, i) => (
        <circle key={i} cx={hx - 300 + s.x} cy={by - 160 + s.y} r={s.r * 0.7} fill={mixHex(E.b, P.ink, 0.5)} opacity={0.45} />
      ))}
    </g>
  );
};

// Shot 8 - "about 265 degrees": at the bottom, heat bands warm; a heat gauge climbs to 265 °C
const ShotHeat: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 500, zoom: 1.0 },
    { f: L, x: 900, y: 600, zoom: 1.18 },
  ]);
  const h = lerp(f, 4, L * 0.75, 0, 1);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <HoleBottom f={f} hot={h} rot={f} />
      </Layer>
      <Layer depth={0}>
        <Gauge x={1560} y={200} height={680} value={265 * h} max={300} unit="°C" theme={BONE} direction="up" title="HEAT" readoutText={`${Math.round(265 * h)} °C`} plate={96} unitCap={false} />
        <Tag x={150} y={160} text="9,101 m" num size={36} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 9 - "hotter at nine kilometres than Kola was at twelve": two columns, warming in stepped bands, side by side
const ShotCompare: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.08 },
    { f: L, x: 960, y: 560, zoom: 1.0 },
  ]);
  const G = 190;
  const K = 60;
  const kola = ramp(f, k.kolaWas - k.hotter - 6, k.kolaWas - k.hotter + 14);
  const col = (x: number, depthKm: number, topC: number, o: number, name: string, temp: string, dLabel: string) => {
    const steps = 12;
    return (
      <g opacity={o}>
        {Array.from({ length: steps }, (_, i) => {
          const z0 = (i * 13) / steps;
          const z1 = ((i + 1) * 13) / steps;
          const tC = (topC * (z0 + z1)) / 2 / depthKm;
          return <rect key={i} x={x - 170} y={G + z0 * K} width={340} height={(z1 - z0) * K + 1} fill={heat(Math.floor((tC / 300) * 6) / 6)} />;
        })}
        <rect x={x - 170} y={G} width={340} height={13 * K} fill="none" stroke={P.ink} strokeWidth={2} />
        <line x1={x} y1={G} x2={x} y2={G + depthKm * K} stroke={C.hole} strokeWidth={7} />
        <text x={x} y={G - 30} textAnchor="middle" style={labelStyle(44, P.ink, 3)}>
          {name}
        </text>
        <Tag x={x + 20} y={G + depthKm * K} text={temp} num size={34} />
        <text x={x - 20} y={G + depthKm * K + 10} textAnchor="end" style={numStyle(26, P.ink)}>
          {dLabel}
        </text>
      </g>
    );
  };
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.3}>
        {specks(f, 30, 2200, 1200, 5, 6).map((s, i) => (
          <circle key={i} cx={s.x - 140} cy={s.y - 60} r={s.r * 0.6} fill={tint(E.a, P.bone, 0.6)} />
        ))}
      </Layer>
      <Layer depth={1}>
        {col(700, KTB_M / 1000, 265, ramp(f, 0, 10), "KTB", "265 °C", "9.1 km")}
        {col(1260, KOLA_M / 1000, 180, kola, "KOLA", "180 °C", "12.3 km")}
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 10 - "at some point it just gets too warm to drill deeper": the bit slows and stops as the heat closes in
const ShotTooWarm: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 640, zoom: 1.5 },
    { f: L, x: 960, y: 700, zoom: 1.75 },
  ]);
  const stop = k.tooWarm - k.gfz;
  // bit rotation decelerates to a halt by the phrase "too warm"
  const rot = f < stop ? f - (f * f) / (2 * Math.max(stop, 1)) : stop / 2;
  const shake = f < stop ? Math.sin(f * 2.1) * 2 * (1 - f / stop) : 0;
  return (
    <Stage theme={BONE} cam={{ ...cam, x: cam.x + shake }}>
      <Layer depth={1}>
        <HoleBottom f={f} hot={1} rot={rot * 1.5} />
      </Layer>
      <Layer depth={0}>
        <Tag x={1180} y={300} text="Too warm" size={56} o={ramp(f, stop, stop + 10)} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 11 - "want to stand down there yourself?": the figure at a mine headframe, the sheave wheel turning
const ShotHeadframe: React.FC<SP> = ({ f, len }) => {
  const H = 640;
  const cam = cameraAt(f, [
    { f: 0, x: 860, y: 560, zoom: 1.0 },
    { f: Math.max(len, 60), x: 960, y: 520, zoom: 1.12 },
  ]);
  const hx = 1180;
  const top = H - 420;
  const wheel = (cx: number, cy: number, r: number) => (
    <g transform={`rotate(${f * 3} ${cx} ${cy})`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={P.ink} strokeWidth={5} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={cx + Math.cos((i * Math.PI) / 4) * r} y1={cy + Math.sin((i * Math.PI) / 4) * r} x2={cx - Math.cos((i * Math.PI) / 4) * r} y2={cy - Math.sin((i * Math.PI) / 4) * r} stroke={P.ink} strokeWidth={3} />
      ))}
    </g>
  );
  return (
    <Stage theme={BONE} cam={cam}>
      <Land f={f} horizon={H} trees={false} seed={31} sunX={420} farLit={mixHex(C.farLit, C.dry, 0.35)} farShade={mixHex(C.farShade, C.dry, 0.35)} />
      <Layer depth={1}>
        <rect x={-800} y={H} width={3600} height={900} fill={C.dry} />
        <rect x={-800} y={H + 160} width={3600} height={900} fill={mixHex(C.dry, E.a, 0.12)} />
        {Array.from({ length: 40 }, (_, i) => {
          const x = rnd(i + 3) * 2400 - 300;
          const y = H + 20 + rnd(i + 9) * 380;
          const sw = Math.sin(f / 16 + i) * 4;
          return <path key={i} d={`M${x - 6} ${y} L${x + sw} ${y - 26} L${x + 6} ${y} Z`} fill={shade(C.dry, 0.2)} />;
        })}
        {/* headframe: an A-frame with a sheave wheel; a cage hoists below */}
        <path d={ptsToPath([[hx - 110, H + 40], [hx - 90, H + 40], [hx - 10, top + 30], [hx - 26, top + 30]]) + " Z"} fill={lit(C.metal, 0.15)} />
        <path d={ptsToPath([[hx + 110, H + 40], [hx + 90, H + 40], [hx + 10, top + 30], [hx + 26, top + 30]]) + " Z"} fill={shade(C.metal, 0.3)} />
        <path d={ptsToPath([[hx + 160, H + 40], [hx + 140, H + 40], [hx + 20, top + 40], [hx + 36, top + 40]]) + " Z"} fill={shade(C.metal, 0.4)} />
        {[0.25, 0.5, 0.75].map((a) => (
          <line key={a} x1={hx - 100 + 75 * a} y1={H + 40 - (H + 10 - top) * a} x2={hx + 100 - 75 * a} y2={H + 40 - (H + 10 - top) * a} stroke={shade(C.metal, 0.3)} strokeWidth={5} />
        ))}
        {wheel(hx, top + 20, 46)}
        <line x1={hx + 40} y1={top + 26} x2={hx + 40} y2={H + 10} stroke={P.ink} strokeWidth={2} />
        <rect x={hx - 140} y={H + 10} width={280} height={40} fill={mixHex(E.a, P.ink, 0.3)} />
        <rect x={hx - 140} y={H + 10} width={280} height={8} fill={lit(mixHex(E.a, P.ink, 0.3), 0.3)} />
        <ReferenceFigure x={860} y={H + 60} pxPerM={60} breath={f} look={lerp(f, 0, 30, -0.2, 0.9)} pose={f > 30 ? "point" : "stand"} />
      </Layer>
      <Layer depth={1.4}>
        {Array.from({ length: 10 }, (_, i) => {
          const x = 1500 + i * 30;
          const h = 80 + rnd(i + 2) * 80;
          return <path key={i} d={`M${x - 10} 1120 L${x + Math.sin(f / 18 + i) * 7} ${1120 - h} L${x + 10} 1120 Z`} fill={mixHex(C.dry, P.ink, 0.45)} />;
        })}
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Mine section: 200 px per km
const MK = 200;
const MG = 160;
const mineY = (m: number) => MG + (m / 1000) * MK;
// Shot 12 - Mponeng in section: the shaft drops to the working levels between 3.2 and 3.7 km; an inset shows the figure in a tunnel
const ShotMine: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const bt = k.between - k.mine;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 380, zoom: 1.35 },
    { f: bt + 10, x: 900, y: 640, zoom: 1.15 },
    { f: L, x: 960, y: 660, zoom: 1.0 },
  ]);
  const sx = 640;
  const sh = lerp(f, 0, bt, 0, 1);
  const lv = ramp(f, bt, bt + 30);
  const inset = ramp(f, bt + 40, bt + 60);
  const levels = [3160, 3280, 3400, 3520, 3640, 3740];
  const cage = mineY(MINE_BOT) - 20 - Math.abs(Math.sin(f / 70)) * 600;
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-800} y={-800} width={3600} height={800 + MG - 40} fill={C.skyMid} />
        <Strata G={MG} bottom={MG + 1200} n={8} seed={14} id="s8-mine" dark={0.7} />
        <TopFace G={MG} color={C.dry} />
        <rect x={sx - 14} y={MG} width={28} height={(mineY(MINE_BOT) + 20 - MG) * sh} fill={C.hole} />
        <rect x={sx - 10} y={cage} width={20} height={16} fill={C.metal} opacity={sh > 0.99 ? 1 : 0} />
        {levels.map((m, i) => {
          const w = (320 + rnd(i + 4) * 420) * lv;
          return (
            <g key={m}>
              <rect x={sx} y={mineY(m) - 4} width={w} height={8} fill={C.hole} />
              <rect x={sx - w * 0.5} y={mineY(m) - 4} width={w * 0.5} height={8} fill={C.hole} />
            </g>
          );
        })}
        <Dim x1={sx - 340} y1={mineY(MINE_TOP)} x2={sx - 340} y2={mineY(MINE_BOT)} k={lv} />
        <Tag x={sx - 370} y={mineY(MINE_TOP)} text="3.2 km" num size={30} anchor="end" o={lv} />
        <Tag x={sx - 370} y={mineY(MINE_BOT)} text="3.7 km" num size={30} anchor="end" o={lv} />
        {/* zoom bracket to the inset */}
        <g opacity={inset} stroke={P.ink} strokeWidth={2} strokeDasharray="6 6">
          <rect x={sx + 260} y={mineY(3400) - 14} width={40} height={28} fill="none" />
          <line x1={sx + 300} y1={mineY(3400) - 14} x2={1300} y2={mineY(3400) - 240} />
          <line x1={sx + 300} y1={mineY(3400) + 14} x2={1300} y2={mineY(3400) + 240} />
        </g>
        <g opacity={inset}>
          <defs>
            <clipPath id="s8-inset">
              <rect x={1300} y={mineY(3400) - 240} width={560} height={480} />
            </clipPath>
          </defs>
          <g clipPath="url(#s8-inset)">
            <rect x={1300} y={mineY(3400) - 240} width={560} height={480} fill={rockBand(3, 0.6)} />
            <rect x={1300} y={mineY(3400) - 120} width={560} height={260} fill={C.hole} />
            <rect x={1300} y={mineY(3400) + 140} width={560} height={14} fill={shade(rockBand(3, 0.6), 0.2)} />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={1340 + i * 190} y={mineY(3400) - 120} width={16} height={260} fill={tint(E.b, P.ink, 0.35)} />
            ))}
            <ReferenceFigure x={1560 + Math.sin(f / 50) * 30} y={mineY(3400) + 140} pxPerM={130} breath={f} look={0.3} outline={P.graphite} walk={undefined} />
          </g>
          <rect x={1300} y={mineY(3400) - 240} width={560} height={480} fill="none" stroke={P.ink} strokeWidth={3} />
        </g>
      </Layer>
      <Layer depth={0}>
        <g opacity={ramp(f, 4, 14)}>
          <text x={96} y={160} style={labelStyle(64, P.ink, 4)}>
            Mponeng
          </text>
          <text x={98} y={204} style={labelStyle(28, P.inkSoft, 4)}>
            South Africa
          </text>
        </g>
        <g opacity={inset}>
          <ScaleBar x={1420} y={1000} px={130} label="1 m" color={P.ink} font={IF.label} />
        </g>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 13 - "Kola goes more than three times deeper": the mine's depth stacked three times beside Kola's hole
const ShotThrice: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const G = 170;
  const K = 64;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 420, zoom: 1.3 },
    { f: L, x: 960, y: 560, zoom: 1.0 },
  ]);
  const kx = 1100;
  const mx = 640;
  const kd = ramp(f, 0, L * 0.4);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-800} y={-800} width={3600} height={800 + G - 40} fill={C.skyMid} />
        <Strata G={G} bottom={G + 1000} n={9} seed={17} id="s8-thr" />
        <TopFace G={G} color={C.tundra} />
        <rect x={mx - 8} y={G} width={16} height={(MINE_BOT / 1000) * K} fill={C.hole} />
        <text x={mx} y={G - 60} textAnchor="middle" style={labelStyle(36, P.ink, 3)}>
          Mine
        </text>
        <line x1={kx} y1={G} x2={kx} y2={G + (KOLA_M / 1000) * K * kd} stroke={C.hole} strokeWidth={6} />
        <text x={kx} y={G - 60} textAnchor="middle" style={labelStyle(36, P.ink, 3)}>
          Kola
        </text>
        {[0, 1, 2].map((i) => {
          const o = ramp(f, L * 0.35 + i * 12, L * 0.35 + i * 12 + 10);
          const y0 = G + i * (MINE_BOT / 1000) * K;
          return (
            <g key={i} opacity={o}>
              <rect x={kx + 30} y={y0 + 3} width={26} height={(MINE_BOT / 1000) * K - 6} fill="none" stroke={P.ink} strokeWidth={2.5} strokeDasharray="8 6" />
              <text x={kx + 74} y={y0 + ((MINE_BOT / 1000) * K) / 2 + 12} style={numStyle(34, P.ink)}>
                {i + 1}
              </text>
            </g>
          );
        })}
        <Tag x={kx + 140} y={G + 3.4 * (MINE_BOT / 1000) * K} text="12,262 m" num size={32} o={ramp(f, L * 0.6, L * 0.75)} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 14 - "on land, twelve kilometres is still the record": all four holes to one vertical scale
const ShotLineup: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const G = 230;
  const K = 54;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.06 },
    { f: L, x: 1040, y: 560, zoom: 1.0 },
  ]);
  const holes = [
    { x: 440, m: MINE_BOT, name: "Mponeng", lab: "3.7 km", dash: false },
    { x: 780, m: SAK_MAX_TVD, name: "Sakhalin", lab: "< 5 km", dash: true },
    { x: 1120, m: KTB_M, name: "KTB", lab: "9.1 km", dash: false },
    { x: 1460, m: KOLA_M, name: "Kola", lab: "12.3 km", dash: false },
  ];
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-800} y={-800} width={3600} height={800 + G - 40} fill={C.skyMid} />
        <Strata G={G} bottom={G + 900} n={8} seed={23} id="s8-lin" />
        <TopFace G={G} color={C.tundra} />
        {holes.map((h, i) => {
          const d = ramp(f, i * 6, i * 6 + 22);
          const y1 = G + (h.m / 1000) * K * d;
          return (
            <g key={h.name}>
              <line x1={h.x} y1={G} x2={h.x} y2={y1} stroke={C.hole} strokeWidth={8} strokeDasharray={h.dash ? "14 8" : undefined} />
              <text x={h.x} y={G - 64} textAnchor="middle" style={labelStyle(34, P.ink, 2)}>
                {h.name}
              </text>
              <Tag x={h.x + 18} y={y1 + 10} text={h.lab} num size={28} o={d} />
            </g>
          );
        })}
        <Tag x={1460} y={G - 136} text="Record" size={36} anchor="middle" o={ramp(f, 30, 40)} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 15 - "the crust isn't the same thickness everywhere": the 40 km crust under Kola, thinning out under the sea
const ShotCrustTease: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const G = 220;
  const K = 14;
  const cam = cameraAt(f, [
    { f: 0, x: 760, y: 540, zoom: 1.2 },
    { f: L + 20, x: 1220, y: 540, zoom: 1.0 },
  ]);
  const moho = (x: number) => G + 40 * K - interpolate(x, [1150, 1700], [0, 33 * K], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const xs = Array.from({ length: 41 }, (_, i) => -800 + i * 90);
  const mpts: [number, number][] = xs.map((x) => [x, moho(x)]);
  const seaTop = (x: number) => G + interpolate(x, [1150, 1500], [0, 4 * K], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spts: [number, number][] = xs.map((x) => [x, seaTop(x)]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-800} y={-800} width={3600} height={800 + G} fill={C.skyMid} />
        <rect x={-800} y={G} width={3600} height={1600} fill={C.mantle} />
        <Hatch id="s8-man" color={shade(C.mantle, 0.2)} gap={16} dots width={1.6} />
        <rect x={-800} y={G} width={3600} height={1600} fill="url(#s8-man)" />
        <path d={ptsToPath([...spts, ...[...mpts].reverse()]) + " Z"} fill={tint(E.a, P.bone, 0.3)} />
        <path d={ptsToPath([[1150, G], ...spts.filter((p) => p[0] > 1150), [2800, G]]) + " Z"} fill={SEA} />
        <path d={ptsToPath(spts)} fill="none" stroke={P.ink} strokeWidth={2.5} />
        <path d={ptsToPath(mpts)} fill="none" stroke={P.ink} strokeWidth={2} strokeDasharray="12 8" strokeDashoffset={crawl(f, 0.8)} />
        <rect x={-800} y={G - 26} width={1950} height={26} fill={C.tundra} />
        <line x1={600} y1={G} x2={600} y2={G + (KOLA_M / 1000) * K} stroke={C.hole} strokeWidth={4} />
        <text x={300} y={G + 24 * K} style={labelStyle(40, P.ink, 4)}>
          Crust
        </text>
        <text x={300} y={G + 48 * K} style={labelStyle(36, shade(C.mantle, 0.5), 4)}>
          Mantle
        </text>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

const shots8 = (k: K8): ShotDef<K8>[] => [
  { from: 0, C: ShotLonger },
  { from: k.s2012, C: ShotCoast },
  { from: k.reached, C: ShotPath },
  { from: k.sideways, C: ShotSideways },
  { from: k.geometry, C: ShotGeometry },
  { from: k.germany, C: ShotGermany },
  { from: k.ktb, C: ShotKtb },
  { from: k.down, C: ShotHeat },
  { from: k.hotter, C: ShotCompare },
  { from: k.gfz, C: ShotTooWarm },
  { from: k.stand, C: ShotHeadframe },
  { from: k.mine, C: ShotMine },
  { from: k.kola3, C: ShotThrice },
  { from: k.record, C: ShotLineup },
  { from: k.crust, C: ShotCrustTease },
];

export const SceneL08: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const k = l08Cues(t);
  return playShots(f, shots8(k), k, k.end + 30);
};

export const soundL08 = (t: SceneTiming): Cue[] => {
  const k = l08Cues(t);
  const W = "mixkit-1489-whoosh-air.mp3";
  const WD = "mixkit-2604-whoosh-deep-air.mp3";
  const TICK = "mixkit-2568-ui-click-tone.mp3";
  const POP = "mixkit-2356-ui-pop-dry.mp3";
  return [
    { at: 2, file: POP, vol: 0.24, dur: 20 },
    { at: 12, file: TICK, vol: 0.26, dur: 20 },
    { at: k.s2012 - 4, file: W, vol: 0.26, dur: 50 },
    { at: k.s2012, file: "mixkit-2658-wind-ambience.mp3", vol: 0.14, dur: k.reached - k.s2012 + 10, fadeIn: 10, fadeOut: 10 },
    { at: k.s2012 + 8, file: TICK, vol: 0.28, dur: 20 },
    { at: k.reached - 3, file: WD, vol: 0.28, dur: 60 },
    { at: k.reached + 6, file: "mixkit-855-drill-electric.mp3", vol: 0.1, dur: k.sideways - k.reached - 10, fadeIn: 8, fadeOut: 10 },
    { at: k.sideways - 2, file: W, vol: 0.22, dur: 50 },
    { at: k.geometry - 2, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.24, dur: 50 },
    { at: k.cant, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.28, dur: 24 },
    { at: k.germany - 2, file: WD, vol: 0.28, dur: 60 },
    { at: k.ktb, file: "mixkit-2297-rumble-bass-hum.mp3", vol: 0.32, dur: k.down - k.ktb + 10, fadeIn: 10, fadeOut: 14 },
    { at: k.y1994, file: TICK, vol: 0.28, dur: 20 },
    { at: k.down - 2, file: W, vol: 0.24, dur: 50 },
    { at: k.hotter - 2, file: W, vol: 0.24, dur: 50 },
    { at: k.kolaWas, file: POP, vol: 0.24, dur: 20 },
    { at: k.gfz, file: "mixkit-855-drill-electric.mp3", vol: 0.14, dur: k.tooWarm - k.gfz + 4, fadeOut: 16 },
    { at: k.tooWarm, file: "mixkit-1686-boom-underground-echo.mp3", vol: 0.34, dur: 100, fadeOut: 30 },
    { at: k.stand - 2, file: WD, vol: 0.26, dur: 60 },
    { at: k.mine - 2, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.26, dur: 50 },
    { at: k.between, file: "mixkit-403-rock-debris-falling.mp3", vol: 0.14, dur: 70, fadeOut: 20 },
    { at: k.between + 40, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.24, dur: 24 },
    { at: k.kola3 - 2, file: W, vol: 0.24, dur: 50 },
    ...[0, 1, 2].map((i) => ({ at: k.kola3 + Math.round((k.record - k.kola3) * 0.35) + i * 12, file: TICK, vol: 0.26, dur: 16 })),
    { at: k.record - 2, file: WD, vol: 0.26, dur: 60 },
    { at: k.record + 30, file: "mixkit-788-boom-cinematic-impact.mp3", vol: 0.26, dur: 90, fadeOut: 30 },
    { at: k.crust - 2, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.24, dur: 50 },
  ];
};
