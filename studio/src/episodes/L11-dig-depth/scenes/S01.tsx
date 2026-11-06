// L11 scene l01 "The target" (episodes/L11-dig-depth/script.md §1) + the episode-local pieces that scenes l02-l04 reuse
// (the long section, the rig, the bit, the turbine, crystal macro, clock): shared props of this episode only; every
// shot body stays bespoke (hard rule 1).
// Numbers drawn in l01, each a row in episodes/L11-dig-depth/sources.md:
//   SG-3 (#1) · Baltic Shield, Archean older than 2.6 billion years (#5) · basalt layer expected at ~7 km (#6) ·
//   target 15 km (#4). Light from the upper left (docs/STYLE-ILLUSTRATED.md).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneTiming } from "../../../lib/timeline";
import {
  BONE,
  Conifer,
  CornerTicks,
  Contours,
  Flock,
  Gauge,
  Hatch,
  IF,
  Layer,
  P,
  PAIRS,
  ReferenceFigure,
  ScaleBar,
  ShadedRidge,
  Stage,
  YouAreHere,
  bob,
  cameraAt,
  crawl,
  drift,
  fall,
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

// ---------------------------------------------------------------------------------------------
// Episode-local pieces (exported for S02-S04)

export const E = PAIRS.earth;
export const SEA = PAIRS.ocean.b;

export const K = {
  skyHi: mixHex(P.bone, E.a, 0.2),
  sky: mixHex(P.bone, E.a, 0.1),
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
  moss: mixHex(tint(E.a, P.bone, 0.5), E.b, 0.22),
  snow: "#F8F4EA",
  snowShade: mixHex("#F8F4EA", E.a, 0.2),
  metal: tint(E.a, P.bone, 0.2),
  steel: mixHex(E.a, P.ink, 0.35),
  alu: tint(E.a, P.bone, 0.62),
  amber: E.b,
  sea: SEA,
  seaShade: shade(SEA, 0.3),
  seaLit: lit(SEA, 0.3),
  hole: P.graphite,
};

/** Crystalline shield rock: stepped flat bands, darker with depth (k 0..1). */
export const rockTone = (k: number, alt = 0) =>
  mixHex(alt % 2 ? tint(mixHex(E.a, E.b, 0.3), P.bone, 0.42) : tint(E.a, P.bone, 0.46), mixHex(E.a, P.graphite, 0.35), Math.min(1, Math.max(0, k)) * 0.8);
/** Heat bands: bone → amber, stepped (k 0..1). */
export const heatTone = (k: number) => mixHex(tint(E.b, P.bone, 0.7), shade(E.b, 0.15), Math.min(1, Math.max(0, k)));

export const lerp = (f: number, a: number, b: number, from: number, to: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

export const cueKit = (t: SceneTiming) => ({
  at: (i: number) => t.lines[i].at,
  p: (i: number, s: string, o = 0) => phraseAt(t, i, s, o),
});

export type ShotFC<Q> = React.FC<{ f: number; len: number; c: Q }>;
export type ShotDef<Q> = { from: number; S: ShotFC<Q> };
/** Hard-cut shot list: the shot whose `from` was passed last is on screen, given its own frame and length. */
export function playShots<Q>(f: number, shots: ShotDef<Q>[], c: Q, total: number) {
  let k = 0;
  for (let i = 0; i < shots.length; i++) if (f >= shots[i].from) k = i;
  const S = shots[k].S;
  const to = k + 1 < shots.length ? shots[k + 1].from : total;
  return <S f={f - shots[k].from} len={to - shots[k].from} c={c} />;
}

const ridgePts = (x0: number, x1: number, base: number, amp: number, seed: number, step: number): [number, number][] => {
  const pts: [number, number][] = [];
  for (let x = x0, i = 0; x <= x1; x += step, i++) pts.push([x, base - amp * (0.35 + 0.65 * Math.abs(Math.sin(i * 1.3 + seed))) - rnd(seed + i) * amp * 0.25]);
  return pts;
};

const Cloud: React.FC<{ x: number; y: number; w: number; f: number; seed: number; speed?: number }> = ({ x, y, w, f, seed, speed = 0.25 }) => {
  const o = drift(f, seed, 10, 260);
  const cx = x + o.x + f * speed;
  return (
    <g>
      <path d={ptsToPath([[cx, y], [cx + w * 0.16, y - 24], [cx + w * 0.42, y - 38], [cx + w * 0.7, y - 26], [cx + w, y]]) + " Z"} fill={K.cloud} />
      <path d={ptsToPath([[cx + w * 0.08, y], [cx + w, y], [cx + w * 0.94, y + 9], [cx + w * 0.14, y + 9]]) + " Z"} fill={K.cloudShade} />
    </g>
  );
};

/** Sky, sun, far ridges, spruce, birds: the surface backdrop of this episode's middle act. */
export const Land: React.FC<{ f: number; G: number; birds?: boolean; sunX?: number; seed?: number }> = ({ f, G, birds = true, sunX = 360, seed = 3 }) => (
  <>
    <Layer depth={0.08}>
      <rect x={-2000} y={-2000} width={6000} height={2000 + G - 320} fill={K.skyHi} />
      <rect x={-2000} y={G - 320} width={6000} height={340} fill={K.sky} />
      <circle cx={sunX} cy={G - 180} r={88} fill={K.sunRing} />
      <circle cx={sunX} cy={G - 180} r={56} fill={K.sun} />
    </Layer>
    <Layer depth={0.2}>
      <Cloud x={160} y={G - 290} w={330} f={f} seed={seed} />
      <Cloud x={1050} y={G - 370} w={400} f={f} seed={seed + 1} />
      <Cloud x={1620} y={G - 240} w={240} f={f} seed={seed + 2} />
      {birds ? <Flock frame={f} x={1450} y={G - 320} vx={-1.5} n={4} size={10} color={tint(P.ink, P.bone, 0.35)} seed={seed + 3} /> : null}
    </Layer>
    <Layer depth={0.35}>
      <ShadedRidge pts={ridgePts(-700, 2700, G - 8, 110, seed, 150)} base={G + 40} fill={K.farLit} shadow={K.farShade} />
    </Layer>
    <Layer depth={0.6}>
      <ShadedRidge pts={ridgePts(-700, 2700, G + 4, 40, seed + 4, 110)} base={G + 60} fill={K.midLit} shadow={K.midShade} />
      {[-120, -40, 80, 150, 300, 1220, 1290, 1380, 1520, 1600, 1790, 1880, 2080].map((x, i) => (
        <Conifer key={x} x={x} y={G + 6} h={54 + ((i * 37) % 44)} litColor={K.treeLit} shadeColor={K.treeShade} sway={Math.sin(f / 45 + i) * 1.4} />
      ))}
    </Layer>
  </>
);

/** Drill derrick (schematic: no height is claimed): lattice tower, hall, turning pipe stripes while `spin` runs. */
export const Derrick: React.FC<{ x: number; G: number; h?: number; spin?: number; hall?: boolean }> = ({ x, G, h = 420, spin = 0, hall = true }) => {
  const base = G - (hall ? 140 : 0);
  const topY = G - h;
  const w = h * 0.16;
  const n = 8;
  return (
    <g>
      {hall ? (
        <g>
          <path d={ptsToPath([[x - 300, G], [x - 300, G - 120], [x + 280, G - 150], [x + 280, G]]) + " Z"} fill={lit(tint(E.a, P.bone, 0.35), 0.1)} />
          <path d={ptsToPath([[x + 280, G], [x + 280, G - 150], [x + 360, G - 132], [x + 360, G]]) + " Z"} fill={shade(tint(E.a, P.bone, 0.35), 0.3)} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={x - 270 + i * 130} y={G - 100 - i * 6} width={38} height={28} fill={shade(tint(E.a, P.bone, 0.35), 0.45)} />
          ))}
        </g>
      ) : null}
      <path d={ptsToPath([[x - w, base], [x - 14, topY], [x - 6, topY], [x - w + 14, base]]) + " Z"} fill={lit(E.a, 0.15)} />
      <path d={ptsToPath([[x + w, base], [x + 14, topY], [x + 6, topY], [x + w - 14, base]]) + " Z"} fill={shade(E.a, 0.3)} />
      {Array.from({ length: n }, (_, i) => {
        const y0 = base - ((base - topY) * i) / n;
        const y1 = base - ((base - topY) * (i + 1)) / n;
        const w0 = w - ((w - 12) * i) / n;
        const w1 = w - ((w - 12) * (i + 1)) / n;
        return (
          <g key={i} stroke={shade(E.a, 0.15)} strokeWidth={Math.max(1.5, h / 140)}>
            <line x1={x - w0} y1={y0} x2={x + w1} y2={y1} />
            <line x1={x + w0} y1={y0} x2={x - w1} y2={y1} />
            <line x1={x - w1} y1={y1} x2={x + w1} y2={y1} />
          </g>
        );
      })}
      <rect x={x - 22} y={topY - 16} width={44} height={16} fill={shade(E.a, 0.2)} />
      <rect x={x - 7} y={topY} width={14} height={base - topY} fill={tint(E.a, P.bone, 0.15)} />
      {Array.from({ length: 12 }, (_, i) => {
        const yy = topY + ((((i * 30 + spin * 5) % (base - topY)) + (base - topY)) % (base - topY));
        return <line key={i} x1={x - 7} y1={yy} x2={x + 7} y2={yy + 7} stroke={shade(E.a, 0.3)} strokeWidth={3} />;
      })}
    </g>
  );
};

/** Tri-cone drill bit, flat two-tone. `spin` scrolls the teeth (rotation read), `wear` 0..1 grinds them down. */
export const Bit: React.FC<{ x: number; y: number; s: number; spin: number; wear?: number }> = ({ x, y, s, spin, wear = 0 }) => {
  const body = tint(E.a, P.bone, 0.25);
  const cones = [-1, 0, 1];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* shank and body: lit left, shaded right */}
      <path d="M-40 -170 L40 -170 L40 -110 L-40 -110 Z" fill={lit(body, 0.15)} />
      <path d="M8 -170 L40 -170 L40 -110 L8 -110 Z" fill={shade(body, 0.25)} />
      <path d="M-70 -110 L70 -110 L84 -40 L-84 -40 Z" fill={lit(body, 0.1)} />
      <path d="M10 -110 L70 -110 L84 -40 L14 -40 Z" fill={shade(body, 0.28)} />
      {cones.map((k) => {
        const cx = k * 52;
        const cy = k === 0 ? -14 : -24;
        const r = 44;
        const tooth = 14 * (1 - wear * 0.85);
        const off = ((spin * (k === 0 ? 1 : -1) * 6) % 24 + 24) % 24;
        return (
          <g key={k}>
            <path d={`M${cx - r} ${cy - 18} L${cx + r} ${cy - 18} L${cx + r * 0.62} ${cy + 26} L${cx - r * 0.62} ${cy + 26} Z`} fill={k > 0 ? shade(K.metal, 0.35) : K.metal} />
            <clipPath id={`bit-c${k}`}>
              <path d={`M${cx - r - 2} ${cy + 20} L${cx + r + 2} ${cy + 20} L${cx + r * 0.7} ${cy + 26 + tooth} L${cx - r * 0.7} ${cy + 26 + tooth} Z`} />
            </clipPath>
            <g clipPath={`url(#bit-c${k})`}>
              {Array.from({ length: 6 }, (_, i) => {
                const tx = cx - r - 24 + i * 24 + off;
                return <path key={i} d={`M${tx - 8} ${cy + 24} L${tx + 8} ${cy + 24} L${tx} ${cy + 26 + tooth} Z`} fill={i % 2 ? shade(K.metal, 0.45) : lit(K.metal, 0.2)} />;
              })}
            </g>
          </g>
        );
      })}
    </g>
  );
};

/** Bottom-hole turbine, cut away: rotor/stator blade rows that slide (one-way = turning), mud arrows down the bore. */
export const Turbine: React.FC<{ x: number; y: number; w: number; h: number; f: number; run?: number; dead?: number }> = ({ x, y, w, h, f, run = 1, dead = 0 }) => {
  const house = mixHex(tint(E.a, P.bone, 0.3), P.graphite, dead * 0.45);
  const rows = 9;
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={h} fill={lit(house, 0.12)} />
      <rect x={x + w * 0.18} y={y} width={w * 0.32} height={h} fill={shade(house, 0.28)} />
      <rect x={x - w * 0.36} y={y + 10} width={w * 0.72} height={h - 20} fill={shade(house, 0.45)} />
      <clipPath id={`trb-${x}-${y}`}>
        <rect x={x - w * 0.36} y={y + 10} width={w * 0.72} height={h - 20} />
      </clipPath>
      <g clipPath={`url(#trb-${x}-${y})`}>
        {Array.from({ length: rows }, (_, r) => {
          const yy = y + 18 + (r * (h - 36)) / (rows - 1);
          const rotor = r % 2 === 0;
          const off = rotor ? ((f * 2.2 * run) % 22) : 0;
          return (
            <g key={r}>
              {Array.from({ length: 10 }, (_, i) => {
                const bx = x - w * 0.36 - 22 + i * 22 + off;
                return <line key={i} x1={bx} y1={yy - 7} x2={bx + (rotor ? 10 : -10)} y2={yy + 7} stroke={rotor ? lit(K.amber, 0.1) : tint(E.a, P.bone, 0.55)} strokeWidth={4} />;
              })}
            </g>
          );
        })}
      </g>
      {run > 0.05
        ? [0, 1, 2].map((i) => {
            const yy = y + ((f * 3 + i * (h / 3)) % h);
            return <path key={i} d={`M${x - 9} ${yy - 10} L${x} ${yy} L${x + 9} ${yy - 10}`} fill="none" stroke={K.snow} strokeWidth={3} opacity={0.8 * run} />;
          })
        : null}
    </g>
  );
};

/** Clock face as a pie: `frac` of the hour filled in amber, a sweeping hand, sixty minute ticks. */
export const ClockPie: React.FC<{ cx: number; cy: number; r: number; frac: number; f: number }> = ({ cx, cy, r, frac, f }) => {
  const a = Math.max(0.0001, Math.min(0.9999, frac)) * Math.PI * 2;
  const ex = cx + Math.sin(a) * r;
  const ey = cy - Math.cos(a) * r;
  const hand = (f / 90) * Math.PI * 2;
  return (
    <g>
      <circle cx={cx + r * 0.06} cy={cy + r * 0.07} r={r + 10} fill={shade(P.boneDeep, 0.2)} />
      <circle cx={cx} cy={cy} r={r + 10} fill={K.metal} />
      <circle cx={cx} cy={cy} r={r} fill={lit(P.bone, 0.3)} />
      <path d={`M${cx} ${cy} L${cx} ${cy - r} A${r} ${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${ex} ${ey} Z`} fill={K.amber} />
      {Array.from({ length: 60 }, (_, i) => {
        const t = (i / 60) * Math.PI * 2;
        const l = i % 5 === 0 ? 18 : 8;
        return <line key={i} x1={cx + Math.sin(t) * (r - l)} y1={cy - Math.cos(t) * (r - l)} x2={cx + Math.sin(t) * r} y2={cy - Math.cos(t) * r} stroke={P.ink} strokeWidth={i % 5 === 0 ? 4 : 2} />;
      })}
      <line x1={cx} y1={cy} x2={cx + Math.sin(hand) * r * 0.82} y2={cy - Math.cos(hand) * r * 0.82} stroke={P.ink} strokeWidth={6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={10} fill={P.ink} />
    </g>
  );
};

/**
 * Crystal macro: a jittered grid of faceted grains (upper-left triangle lit, lower-right in shadow). `bands` stretches
 * grains into gneiss foliation; `cracks` 0..1 opens dark fissures along grain edges; `wet` 0..1 fills them sea-glass.
 */
export const Crystals: React.FC<{ x: number; y: number; w: number; h: number; cell: number; seed: number; f: number; bands?: boolean; cracks?: number; wet?: number; alter?: number }> = ({
  x,
  y,
  w,
  h,
  cell,
  seed,
  f,
  bands = false,
  cracks = 0,
  wet = 0,
  alter = 0,
}) => {
  const cw = bands ? cell * 1.8 : cell;
  const ch = bands ? cell * 0.55 : cell;
  const nx = Math.ceil(w / cw) + 1;
  const ny = Math.ceil(h / ch) + 1;
  const pt = (i: number, j: number): [number, number] => [
    x + i * cw + (i > 0 && i < nx ? (rnd(seed * 7 + i * 31 + j * 17) - 0.5) * cw * 0.6 : 0),
    y + j * ch + (j > 0 && j < ny ? (rnd(seed * 3 + i * 13 + j * 29) - 0.5) * ch * 0.6 + (bands ? Math.sin(i * 0.5 + j * 0.3 + seed) * ch * 0.5 : 0) : 0),
  ];
  const pal = bands
    ? [tint(E.a, P.bone, 0.6), mixHex(E.a, P.graphite, 0.25), tint(E.a, P.bone, 0.3), tint(mixHex(E.a, E.b, 0.35), P.bone, 0.45)]
    : [tint(E.a, P.bone, 0.5), tint(E.a, P.bone, 0.3), tint(mixHex(E.a, E.b, 0.4), P.bone, 0.4), mixHex(E.a, P.graphite, 0.2), tint(E.b, P.bone, 0.55)];
  const quads: React.ReactNode[] = [];
  const crackPaths: string[] = [];
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++) {
      const a = pt(i, j);
      const b = pt(i + 1, j);
      const c = pt(i + 1, j + 1);
      const d = pt(i, j + 1);
      const pick = bands ? (Math.floor(j / 2) % 2 ? (rnd(i * 5 + j + seed) < 0.75 ? 1 : 3) : rnd(i * 5 + j + seed) < 0.75 ? 0 : 2) : Math.floor(rnd(seed * 11 + i * 7 + j * 3) * pal.length);
      const base = mixHex(pal[pick], mixHex(E.b, E.a, 0.3), alter * 0.5);
      quads.push(
        <g key={`${i}-${j}`}>
          <path d={ptsToPath([a, b, c, d]) + " Z"} fill={shade(base, 0.12)} />
          <path d={ptsToPath([a, b, d]) + " Z"} fill={lit(base, 0.12)} />
        </g>,
      );
      if (rnd(seed * 19 + i * 3 + j * 11) < cracks * 0.55) crackPaths.push(ptsToPath([a, b, c]));
    }
  return (
    <g>
      {quads}
      <g fill="none" strokeLinejoin="round" strokeLinecap="round">
        {crackPaths.map((d, i) => (
          <g key={i}>
            <path d={d} stroke={P.graphite} strokeWidth={cell * 0.09} />
            {wet > 0 ? <path d={d} stroke={K.sea} strokeWidth={cell * 0.06} strokeDasharray={`${cell * 2} ${cell * 2}`} strokeDashoffset={(1 - wet) * cell * 2 + crawl(f, 0.6)} /> : null}
          </g>
        ))}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------
// The long section of the Kola hole (0 → 15 km+), world-attached. Light from the upper left.

export const SEC = { SY: 150, PPK: 54, HX: 1000 };
export const secY = (km: number) => SEC.SY + km * SEC.PPK;

export const LongSection: React.FC<{
  f: number;
  /** km drilled (hole drawn to here) */
  drill: number;
  /** km of the drill tip (default = drill); less than drill while the string is pulled up */
  tip?: number;
  /** steel for the top ~2 km of the string */
  steel?: boolean;
  basalt?: number;
  struck?: number;
  ray?: number;
  /** dashed planned path to `plan` km */
  plan?: number;
  heat?: number;
  water?: number;
  /** turning marks along the string: 1 = full at the top, fading with depth */
  twist?: number;
  label?: boolean;
}> = ({ f, drill, tip, steel = true, basalt = 0, struck = 0, ray = 0, plan = 0, heat = 0, water = 0, twist = 0, label = true }) => {
  const { SY, PPK, HX } = SEC;
  const tipKm = tip ?? drill;
  const edges = Array.from({ length: 22 }, (_, i) => strataLine(-900, 2900, SY + (i === 0 ? 0 : i * 1.5 * PPK), i === 0 ? 0 : 7, i * 1.7 + 2, 90));
  const by = secY(7);
  const rayPts: [number, number][] = [
    [HX - 470, SY],
    [HX - 380, SY + 2.2 * PPK],
    [HX - 260, SY + 4.6 * PPK],
    [HX - 120, by],
    [HX + 20, SY + 4.6 * PPK],
    [HX + 140, SY + 2.2 * PPK],
    [HX + 230, SY],
  ];
  const segLen = rayPts.slice(1).map((p, i) => Math.hypot(p[0] - rayPts[i][0], p[1] - rayPts[i][1]));
  const total = segLen.reduce((a, b) => a + b, 0);
  const per = 75;
  const ph = ((f % per) + per) % per / per;
  let dist = ph * total;
  let pulse: [number, number] = rayPts[0];
  for (let i = 0; i < segLen.length; i++) {
    if (dist <= segLen[i]) {
      const k = dist / segLen[i];
      pulse = [rayPts[i][0] + (rayPts[i + 1][0] - rayPts[i][0]) * k, rayPts[i][1] + (rayPts[i + 1][1] - rayPts[i][1]) * k];
      break;
    }
    dist -= segLen[i];
  }
  const steelKm = Math.min(2, tipKm);
  return (
    <g>
      <Hatch id="sec-xtal" color={tint(E.a, P.ink, 0.25)} gap={22} angle={30} width={1.2} cross />
      {/* above ground: pale sky band, low ridge */}
      <rect x={-1500} y={-2000} width={5000} height={2000 + SY} fill={K.sky} />
      <ShadedRidge pts={ridgePts(-900, 2900, SY - 4, 34, 6, 120)} base={SY + 2} fill={K.farLit} shadow={K.farShade} />
      {/* strata: stepped flat bands, crystalline hatch right up to the surface (Baltic Shield) */}
      {edges.slice(0, -1).map((top, i) => (
        <g key={i}>
          <path d={stratumPath(top, edges[i + 1])} fill={rockTone(i / 14, i)} />
          {heat > 0 ? <path d={stratumPath(top, edges[i + 1])} fill={heatTone(i / 9)} opacity={heat * Math.min(1, (i + 1) / 9) * 0.85} /> : null}
        </g>
      ))}
      <rect x={-1500} y={SY} width={5000} height={22 * 1.5 * PPK} fill="url(#sec-xtal)" opacity={0.28} />
      {edges.slice(1).map((e, i) => (
        <path key={i} d={ptsToPath(e)} fill="none" stroke={P.ink} strokeWidth={1.2} opacity={0.3} />
      ))}
      <rect x={-1500} y={SY} width={5000} height={6} fill={K.tundra} />
      <line x1={-1500} y1={SY} x2={3500} y2={SY} stroke={P.ink} strokeWidth={2.5} />
      {/* grit drifting in the rock */}
      {specks(f, 26, 1920, 900, 33, 4).map((p, i) => (
        <circle key={i} cx={p.x} cy={SY + 30 + p.y} r={p.r * 0.6} fill={tint(E.a, P.ink, 0.3)} opacity={0.45} />
      ))}
      {/* the expected basalt boundary at ~7 km (#6) */}
      {basalt > 0 ? (
        <g opacity={basalt * (1 - struck * 0.7)}>
          <path d={ptsToPath(strataLine(-900, 2900, by, 6, 9, 80))} fill="none" stroke={P.ink} strokeWidth={7} strokeDasharray={struck > 0 ? `${40 - struck * 30} ${struck * 30}` : undefined} />
          {label ? (
            <g>
              <text x={HX + 420} y={by - 18} style={labelStyle(40, P.ink, 3)}>
                Basalt?
              </text>
              <line x1={HX + 412} y1={by - 32} x2={HX + 412 + 150 * struck} y2={by - 32} stroke={P.ink} strokeWidth={5} />
            </g>
          ) : null}
        </g>
      ) : null}
      {/* seismic ray: dashed path, a pulse riding it */}
      {ray > 0 ? (
        <g opacity={ray}>
          <path d={ptsToPath(rayPts)} fill="none" stroke={P.ink} strokeWidth={3} strokeDasharray="14 10" strokeDashoffset={crawl(f, 1.4)} />
          <circle cx={pulse[0]} cy={pulse[1]} r={9} fill={P.ink} />
          <path d={`M${HX - 488} ${SY - 4} L${HX - 452} ${SY - 4} L${HX - 470} ${SY - 30} Z`} fill={P.ink} />
          <path d={`M${HX + 214} ${SY - 4} L${HX + 246} ${SY - 4} L${HX + 230} ${SY - 26} Z`} fill={tint(P.ink, P.bone, 0.3)} />
        </g>
      ) : null}
      {/* planned path */}
      {plan > drill ? (
        <g>
          <line x1={HX} y1={secY(drill)} x2={HX} y2={secY(plan)} stroke={P.ink} strokeWidth={3} strokeDasharray="10 10" strokeDashoffset={crawl(f, 0.8)} opacity={0.8} />
        </g>
      ) : null}
      {/* hole + string */}
      <rect x={HX - 5} y={SY} width={10} height={drill * PPK} fill={K.hole} />
      {water > 0
        ? Array.from({ length: 10 }, (_, i) => {
            const d = 4.5 + (i % 5) * 1.1 + (i > 4 ? 0.5 : 0);
            if (d > drill) return null;
            const sd = i > 4 ? 1 : -1;
            const run = ((f * 1.6 + i * 23) % 60) / 60;
            const x0 = HX + sd * (90 - run * 70);
            const yy = secY(d);
            return (
              <path
                key={i}
                d={`M${x0 + sd * 22} ${yy - 18} L${x0} ${yy} L${x0 + sd * 22} ${yy + 18}`}
                fill="none"
                stroke={shade(K.sea, 0.15)}
                strokeWidth={8}
                strokeLinejoin="round"
                opacity={water * Math.sin(run * Math.PI)}
              />
            );
          })
        : null}
      {tipKm > 0 ? (
        <g>
          {steel ? <line x1={HX} y1={SY - 30} x2={HX} y2={secY(steelKm)} stroke={K.steel} strokeWidth={5} /> : null}
          <line x1={HX} y1={steel ? secY(steelKm) : SY - 30} x2={HX} y2={secY(tipKm)} stroke={steel ? K.alu : K.steel} strokeWidth={steel ? 4 : 4} />
          <path d={`M${HX - 8} ${secY(tipKm) - 4} L${HX + 8} ${secY(tipKm) - 4} L${HX} ${secY(tipKm) + 10} Z`} fill={P.ink} />
          {twist > 0
            ? Array.from({ length: 16 }, (_, i) => {
                const d = ((i * 0.9 + f * 0.05) % 14.4) + 0.1;
                if (d > tipKm) return null;
                return <line key={i} x1={HX - 10} y1={secY(d) - 5} x2={HX + 10} y2={secY(d) + 5} stroke={P.ink} strokeWidth={2.5} opacity={twist * Math.max(0, 1 - d / 9)} />;
              })
            : null}
        </g>
      ) : null}
      {/* rig glyph on the surface */}
      <g>
        <path d={`M${HX - 22} ${SY} L${HX - 4} ${SY - 74} L${HX + 4} ${SY - 74} L${HX + 22} ${SY} Z`} fill="none" stroke={shade(E.a, 0.2)} strokeWidth={4} />
        <path d={`M${HX - 16} ${SY - 22} L${HX + 16} ${SY - 22} M${HX - 10} ${SY - 46} L${HX + 10} ${SY - 46}`} stroke={shade(E.a, 0.2)} strokeWidth={3} />
        <rect x={HX + 18} y={SY - 20} width={70} height={20} fill={lit(tint(E.a, P.bone, 0.35), 0.1)} />
        <rect x={HX + 66} y={SY - 20} width={22} height={20} fill={shade(tint(E.a, P.bone, 0.35), 0.3)} />
      </g>
    </g>
  );
};

/** Depth gauge for the long section: 0-15 km at the section's own scale, world-attached so it tracks the camera. */
export const SecGauge: React.FC<{ value: number; max?: number; readout?: boolean; readoutText?: string; marks?: { v: number; label: string }[]; x?: number }> = ({
  value,
  max = 15,
  readout = false,
  readoutText,
  marks,
  x = 300,
}) => (
  <Gauge
    x={x}
    y={SEC.SY}
    height={max * SEC.PPK}
    value={value}
    max={max}
    unit="km"
    theme={BONE}
    title="Depth"
    format={(v) => `${v} km`}
    readout={readout}
    readoutText={readoutText}
    marks={marks}
    plate={128}
    unitCap={false}
    marker={value > 0}
  />
);

// ---------------------------------------------------------------------------------------------
// l01 cues and shots

const l01Cues = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    shield: p(0, "Under Kola", -4),
    rock: p(0, "ancient rock"),
    oldest: p(0, "The oldest", -4),
    billion: p(0, "two and a half"),
    seismic: at(1) - 6,
    seven: p(1, "At around", -4),
    basalt: p(1, "a layer of basalt"),
    plan: p(1, "The plan", -4),
    fifteen: p(1, "all the way"),
    problem: at(2) - 6,
    cut: p(2, "To cut", -4),
    turn: p(2, "you have to turn", -2),
    away: p(2, "fifteen kilometres away"),
    end: t.frames,
  };
};
type C1 = ReturnType<typeof l01Cues>;

// Shot 1 - survey chart from above: terrain contours, lakes, the drill site pin "SG-3" (#1)
const ShotChart: ShotFC<C1> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 940, y: 520, zoom: 1.0 },
    { f: len + 20, x: 1010, y: 560, zoom: 1.28 },
  ]);
  const lakes: [number, number, number][] = [
    [380, 300, 90],
    [620, 760, 140],
    [1380, 260, 110],
    [1560, 760, 80],
    [240, 820, 60],
    [1700, 480, 70],
  ];
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-600} y={-600} width={3200} height={2400} fill={lit(P.bone, 0.1)} />
        {[0, 1, 2, 3, 4].map((i) => (
          <Contours key={i} x0={-400} x1={2400} y={-120 + i * 260} n={4} gap={22} amp={16} seed={i * 3 + 1} color={tint(E.a, P.bone, 0.45)} width={1.6} dash={i % 2 ? "8 8" : undefined} dashOffset={crawl(f, 0.3)} />
        ))}
        {lakes.map(([x, y, r], i) => {
          const pts = Array.from({ length: 9 }, (_, j) => {
            const a = (j / 9) * Math.PI * 2;
            const rr = r * (0.7 + rnd(i * 9 + j) * 0.5);
            return [x + Math.cos(a) * rr * 1.4, y + Math.sin(a) * rr * 0.7] as [number, number];
          });
          return (
            <g key={i}>
              <path d={ptsToPath(pts) + " Z"} fill={K.seaShade} transform="translate(5 6)" />
              <path d={ptsToPath(pts) + " Z"} fill={lit(K.sea, 0.25)} />
              {[0, 1].map((k) => (
                <line key={k} x1={x - r * 0.5 + ((f * 0.6 + k * 40) % (r * 1.2))} y1={y - 6 + k * 14} x2={x - r * 0.3 + ((f * 0.6 + k * 40) % (r * 1.2))} y2={y - 6 + k * 14} stroke={K.snow} strokeWidth={3} opacity={0.7} />
              ))}
            </g>
          );
        })}
        {/* survey grid */}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={-200 + i * 300} y1={-400} x2={-200 + i * 300} y2={1500} stroke={P.ink} strokeWidth={1.2} strokeDasharray="4 10" opacity={0.35} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1={-400} y1={-150 + i * 300} x2={2400} y2={-150 + i * 300} stroke={P.ink} strokeWidth={1.2} strokeDasharray="4 10" opacity={0.35} />
        ))}
        <g transform={`translate(0 ${bob(f, 2, 4, 50)})`}>
          <YouAreHere x={1000} y={560} size={46} label="SG-3" font={IF.label} />
        </g>
        <circle cx={1000} cy={560} r={26 + ((f * 0.9) % 50)} fill="none" stroke={P.ink} strokeWidth={2} opacity={1 - ((f * 0.9) % 50) / 50} />
      </Layer>
      <Layer depth={0}>
        <ScaleBar x={96} y={1000} px={180} label="10 KM" color={P.ink} font={IF.label} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 2 - block cutaway: grey crystalline rock right up to the surface, the rig small on top; "Baltic Shield" (#5)
const ShotShield: ShotFC<C1> = ({ f, len, c }) => {
  const G = 430;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 470, zoom: 1.12 },
    { f: len + 10, x: 940, y: 600, zoom: 1.0 },
  ]);
  const lab = ramp(f, c.rock - c.shield, c.rock - c.shield + 14);
  return (
    <Stage theme={BONE} cam={cam}>
      <Land f={f} G={G - 40} />
      <Layer depth={1}>
        {/* top face, low angle */}
        <rect x={-700} y={G - 40} width={3400} height={40} fill={K.tundra} />
        {[[-100, 160], [520, 110], [1300, 140], [1720, 90]].map(([x, w], i) => (
          <path key={i} d={ptsToPath([[x, G - 22], [x + w * 0.3, G - 32], [x + w, G - 28], [x + w * 0.8, G - 14], [x + w * 0.1, G - 12]]) + " Z"} fill={K.snow} />
        ))}
        {/* front face: crystal grains to the surface */}
        <clipPath id="s01-front">
          <rect x={-700} y={G} width={3400} height={1400} />
        </clipPath>
        <g clipPath="url(#s01-front)">
          <Crystals x={-700} y={G} w={3400} h={1300} cell={74} seed={4} f={f} />
          <rect x={-700} y={G} width={3400} height={1300} fill={mixHex(E.a, P.graphite, 0.3)} opacity={0.12} />
        </g>
        <rect x={-700} y={G} width={3400} height={8} fill={lit(K.tundra, 0.3)} />
        <line x1={-700} y1={G} x2={2700} y2={G} stroke={P.ink} strokeWidth={2.5} />
        <Derrick x={1080} G={G - 20} h={250} spin={f} />
        <ReferenceFigure x={760} y={G - 18} pxPerM={10} breath={f} look={0.5} />
        {/* the hole begins under the rig */}
        <rect x={1076} y={G} width={8} height={900} fill={K.hole} />
      </Layer>
      <Layer depth={0}>
        <g opacity={lab} transform={`translate(${(1 - lab) * -30} 0)`}>
          <text x={110} y={880} style={labelStyle(70, P.bone, 4)}>
            Baltic Shield
          </text>
          <rect x={112} y={904} width={420 * lab} height={5} fill={P.bone} />
        </g>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 3 - macro of the oldest rock: big faceted grains; the age tag counts up to "2.6 billion years +" (#5)
const ShotOldest: ShotFC<C1> = ({ f, len, c }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 500, zoom: 1.0 },
    { f: len + 20, x: 1010, y: 560, zoom: 1.16 },
  ]);
  const b0 = c.billion - c.oldest;
  const k = ramp(f, b0 - 6, b0 + 26);
  const v = (2.6 * k).toFixed(1);
  return (
    <Stage theme={BONE} cam={cam} vignette={0.22}>
      <Layer depth={1}>
        <Crystals x={-500} y={-400} w={2900} h={1900} cell={150} seed={11} f={f} />
      </Layer>
      <Layer depth={1.3}>
        {specks(f, 22, 2200, 1200, 7, 9).map((p, i) => (
          <circle key={i} cx={p.x - 100} cy={p.y - 60} r={p.r * 1.3} fill={tint(E.b, P.bone, 0.6)} opacity={0.6} />
        ))}
      </Layer>
      <Layer depth={0}>
        <g opacity={ramp(f, b0 - 8, b0 + 2)} transform={`translate(0 ${bob(f, 3, 3, 80)})`}>
          <rect x={1180} y={760} width={600} height={190} fill={P.bone} stroke={P.ink} strokeWidth={2} />
          <line x1={1180} y1={760} x2={1080} y2={640} stroke={P.ink} strokeWidth={2.5} />
          <circle cx={1080} cy={640} r={9} fill={P.ink} />
          <text x={1210} y={862} style={numStyle(96, P.ink)}>
            {v}
          </text>
          <text x={1380} y={830} style={labelStyle(40, P.ink, 3)}>
            Billion years
          </text>
          <text x={1380} y={880} style={labelStyle(40, P.inkSoft, 3)}>
            and older
          </text>
        </g>
        <ScaleBar x={96} y={1000} px={150} label="1 CM" color={P.bone} font={IF.label} />
        <CornerTicks color={P.bone} />
      </Layer>
    </Stage>
  );
};

// Shot 4 - a seismic survey at the surface: a vibrator pad thumps, wave arcs run down into the rock, geophones listen
const ShotSurvey: ShotFC<C1> = ({ f, len }) => {
  const G = 560;
  const ppm = 40;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.0 },
    { f: len + 10, x: 1040, y: 640, zoom: 1.12 },
  ]);
  const sx = 640;
  const per = 32;
  const thump = Math.max(0, 1 - (f % per) / 6);
  return (
    <Stage theme={BONE} cam={cam}>
      <Land f={f + 200} G={G - 30} seed={8} />
      <Layer depth={1}>
        <rect x={-700} y={G - 30} width={3400} height={30} fill={K.tundra} />
        <clipPath id="s01-survey">
          <rect x={-700} y={G} width={3400} height={1200} />
        </clipPath>
        <g clipPath="url(#s01-survey)">
          <Crystals x={-700} y={G} w={3400} h={1000} cell={64} seed={21} f={f} />
          {[0, 1, 2, 3, 4].map((k) => {
            const age = ((f - k * per) % (per * 5) + per * 5) % (per * 5);
            const r = age * 7;
            return <circle key={k} cx={sx} cy={G} r={r} fill="none" stroke={P.ink} strokeWidth={4} strokeDasharray="18 12" opacity={Math.max(0, 1 - r / 1000) * 0.8} />;
          })}
        </g>
        <line x1={-700} y1={G} x2={2700} y2={G} stroke={P.ink} strokeWidth={2.5} />
        {/* vibrator pad: a two-tone box on a plate, jolting on each thump */}
        <g transform={`translate(0 ${-thump * 6})`}>
          <rect x={sx - 70} y={G - 30} width={140} height={22} fill={shade(K.metal, 0.3)} />
          <path d={ptsToPath([[sx - 60, G - 30], [sx - 50, G - 110], [sx + 60, G - 110], [sx + 60, G - 30]]) + " Z"} fill={lit(tint(E.b, P.bone, 0.3), 0.1)} />
          <rect x={sx + 20} y={G - 110} width={40} height={80} fill={shade(tint(E.b, P.bone, 0.3), 0.3)} />
        </g>
        {/* geophones along a cable */}
        <line x1={sx + 140} y1={G - 6} x2={1900} y2={G - 6} stroke={P.ink} strokeWidth={2} />
        {Array.from({ length: 9 }, (_, i) => {
          const gx = sx + 220 + i * 140;
          const hit = Math.max(0, 1 - Math.abs(((f % per) - (gx - sx) / 14) / 4));
          return (
            <g key={i}>
              <path d={`M${gx - 12} ${G - 4} L${gx + 12} ${G - 4} L${gx} ${G - 30 - hit * 8} Z`} fill={hit > 0.3 ? P.ink : tint(P.ink, P.bone, 0.4)} />
            </g>
          );
        })}
        <ReferenceFigure x={sx - 190} y={G - 30} pxPerM={ppm} breath={f} look={0.7} />
      </Layer>
      <Layer depth={0}>
        <ScaleBar x={96} y={1000} px={ppm * 2} label="2 M" color={P.bone} font={IF.label} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 5 - the long section: the ray bounces off a bold line at ~7 km, "Basalt?" (#6)
const ShotSeven: ShotFC<C1> = ({ f, len, c }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 10, x: 950, y: 560, zoom: 1.06 },
  ]);
  const bas = ramp(f, c.basalt - c.seven - 6, c.basalt - c.seven + 10);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <LongSection f={f} drill={0} ray={ramp(f, 0, 10)} basalt={bas} />
        <SecGauge value={0} marks={bas > 0.5 ? [{ v: 7, label: "7 km" }] : []} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 6 - the plan: a dashed path runs down to 15 km, the gauge marker slides to the target (#4)
const ShotPlan: ShotFC<C1> = ({ f, len, c }) => {
  const g0 = c.fifteen - c.plan;
  const k = lerp(f, g0 - 4, g0 + 40, 0, 1);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: g0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 10, x: 900, y: 760, zoom: 1.22 },
  ]);
  const tgt = secY(15);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <LongSection f={f} drill={0} basalt={1} ray={1 - ramp(f, 0, 16)} plan={15 * k} />
        <g opacity={ramp(f, g0 + 30, g0 + 40)}>
          <circle cx={SEC.HX} cy={tgt} r={26 + Math.sin(f / 8) * 3} fill="none" stroke={P.ink} strokeWidth={4} />
          <line x1={SEC.HX - 44} y1={tgt} x2={SEC.HX + 44} y2={tgt} stroke={P.ink} strokeWidth={3} />
          <line x1={SEC.HX} y1={tgt - 44} x2={SEC.HX} y2={tgt + 44} stroke={P.ink} strokeWidth={3} />
          <text x={SEC.HX + 60} y={tgt + 14} style={labelStyle(40, P.ink, 3)}>
            Target
          </text>
        </g>
        <SecGauge value={15 * k} readout={k > 0.02} readoutText={`${Math.round(15 * k)} km`} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 7 - "one problem": the rig at the surface, quiet; the figure looks up at the derrick, snow falling
const ShotProblem: ShotFC<C1> = ({ f, len }) => {
  const G = 760;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.05 },
    { f: len + 20, x: 1020, y: 620, zoom: 1.18 },
  ]);
  const snow = fall(f, 40, 2400, 900, 9, 1.0, 12);
  return (
    <Stage theme={BONE} cam={cam}>
      <Land f={f + 500} G={G - 120} seed={12} />
      <Layer depth={1}>
        <rect x={-700} y={G - 120} width={3400} height={1000} fill={K.tundra} />
        <rect x={-700} y={G - 30} width={3400} height={1000} fill={mixHex(K.tundra, E.b, 0.12)} />
        {[[100, G - 60, 260], [1400, G - 90, 300], [600, G + 120, 380]].map(([x, y, w], i) => (
          <path key={i} d={ptsToPath([[x, y], [x + w * 0.25, y - 10], [x + w, y - 6], [x + w * 0.85, y + 8], [x + w * 0.1, y + 9]]) + " Z"} fill={K.snow} />
        ))}
        <Derrick x={1180} G={G} h={560} spin={0} />
        <ReferenceFigure x={760} y={G + 6} pxPerM={16} breath={f} look={lerp(f, 6, 30, 0, 0.9)} />
      </Layer>
      <Layer depth={1.25}>
        {snow.map((p, i) => (
          <circle key={i} cx={p.x - 200} cy={p.y} r={p.r} fill={K.snow} opacity={0.9} />
        ))}
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 8 - "to cut rock fifteen kilometres down": the bit at the bottom, grinding, chips flying; the gauge reads 15 km
const ShotCut: ShotFC<C1> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.0 },
    { f: len + 10, x: 980, y: 560, zoom: 1.1 },
  ]);
  const shakeX = Math.sin(f * 2.3) * 2;
  return (
    <Stage theme={GRAPHITE_SAFE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <Crystals x={-500} y={-300} w={2900} h={1700} cell={110} seed={31} f={f} />
        <rect x={-500} y={-300} width={2900} height={1700} fill={P.graphite} opacity={0.3} />
        {/* hole walls */}
        <rect x={720} y={-300} width={480} height={1060} fill={K.hole} />
        <rect x={1150} y={-300} width={50} height={1060} fill={shade(E.a, 0.5)} />
        <path d={`M720 760 L1200 760 L1170 800 L750 800 Z`} fill={K.hole} />
        <rect x={938} y={-300} width={44} height={470} fill={K.metal} />
        <rect x={962} y={-300} width={20} height={470} fill={shade(K.metal, 0.3)} />
        <g transform={`translate(${shakeX} 0)`}>
          <Bit x={960} y={740} s={2.4} spin={f} />
        </g>
        {Array.from({ length: 14 }, (_, i) => {
          const age = (f * 1.3 + i * 11) % 40;
          const sd = i % 2 ? 1 : -1;
          return <rect key={i} x={960 + sd * (60 + age * 7 + rnd(i) * 40)} y={770 - age * 5 + age * age * 0.09} width={8 + rnd(i + 3) * 8} height={8} fill={tint(E.a, P.bone, 0.4)} opacity={1 - age / 40} transform={`rotate(${age * 12} ${960 + sd * (60 + age * 7)} ${770 - age * 5})`} />;
        })}
      </Layer>
      <Layer depth={0}>
        <Gauge x={1700} y={150} height={600} value={15} max={15} unit="km" theme={GRAPHITE_SAFE} title="Depth" format={(v) => `${v}`} readoutText="15 km" side="left" plate={90} unitCap={false} />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 9 - "turn a drill bit fifteen kilometres away": from the turning table at the rig, zoom out until the string is a
// hairline 15 km long; a dimension line spans it
const ShotTurn: ShotFC<C1> = ({ f, len, c }) => {
  const HX = 960;
  const top = 120;
  const ppk = 58; // 15 km → 870 px
  const bot = top + 15 * ppk;
  const a0 = c.away - c.turn;
  const cam = cameraAt(f, [
    { f: 0, x: HX, y: top + 30, zoom: 9 },
    { f: 14, x: HX, y: top + 30, zoom: 9 },
    { f: Math.max(40, a0 + 10), x: HX, y: 560, zoom: 1.0 },
    { f: len + 10, x: HX - 20, y: 580, zoom: 0.96 },
  ]);
  const dim = ramp(f, a0, a0 + 18);
  const rot = (f * 9) % 360;
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-2000} y={-2000} width={6000} height={2000 + top} fill={K.sky} />
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={-2000} y={top + i * 1.5 * ppk} width={6000} height={1.5 * ppk + 1} fill={rockTone(i / 12, i)} />
        ))}
        {specks(f, 30, 1920, 880, 41, 3).map((p, i) => (
          <circle key={i} cx={p.x} cy={top + p.y} r={p.r * 0.5} fill={tint(E.a, P.ink, 0.3)} opacity={0.4} />
        ))}
        <line x1={-2000} y1={top} x2={4000} y2={top} stroke={P.ink} strokeWidth={2} />
        <rect x={HX - 1.5} y={top} width={3} height={15 * ppk} fill={K.hole} />
        <line x1={HX} y1={top - 6} x2={HX} y2={bot} stroke={K.steel} strokeWidth={1.2} />
        {/* the rotary table: a small turning disc with an arrow, seen at zoom 9 */}
        <g transform={`translate(${HX} ${top - 6})`}>
          <ellipse cx={0} cy={0} rx={9} ry={2.6} fill={K.metal} stroke={P.ink} strokeWidth={0.4} />
          <g transform={`scale(1 0.3) rotate(${rot})`}>
            <path d="M0 -12 A12 12 0 0 1 11 -4" fill="none" stroke={P.ink} strokeWidth={1.6} />
            <path d="M11 -4 L13.5 -9 L7 -7 Z" fill={P.ink} />
          </g>
          <ReferenceFigure x={-16} y={0} pxPerM={4} breath={f} look={0.6} outline={P.bone} />
        </g>
        {/* the far bit: a small question of a turn */}
        <path d={`M${HX - 7} ${bot - 4} L${HX + 7} ${bot - 4} L${HX} ${bot + 8} Z`} fill={P.ink} />
        <g opacity={dim}>
          <circle cx={HX} cy={bot} r={22} fill="none" stroke={P.ink} strokeWidth={2} strokeDasharray="6 6" strokeDashoffset={crawl(f, 1)} />
          <line x1={HX + 120} y1={top} x2={HX + 120} y2={top + 15 * ppk * dim} stroke={P.ink} strokeWidth={3} />
          <line x1={HX + 100} y1={top} x2={HX + 140} y2={top} stroke={P.ink} strokeWidth={3} />
          <line x1={HX + 100} y1={top + 15 * ppk * dim} x2={HX + 140} y2={top + 15 * ppk * dim} stroke={P.ink} strokeWidth={3} />
          <text x={HX + 160} y={top + 7.5 * ppk + 20} style={numStyle(64, P.ink)} opacity={ramp(f, a0 + 12, a0 + 22)}>
            15 km
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

/** A graphite theme alias (dark macro shots). */
const GRAPHITE_SAFE = { bg: P.graphite, panel: P.graphiteLift, line: P.chalk, text: P.chalk, dim: P.chalkSoft, dark: true };

export const SceneL01: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = l01Cues(t);
  const shots: ShotDef<C1>[] = [
    { from: 0, S: ShotChart },
    { from: c.shield, S: ShotShield },
    { from: c.oldest, S: ShotOldest },
    { from: c.seismic, S: ShotSurvey },
    { from: c.seven, S: ShotSeven },
    { from: c.plan, S: ShotPlan },
    { from: c.problem, S: ShotProblem },
    { from: c.cut, S: ShotCut },
    { from: c.turn, S: ShotTurn },
  ];
  return playShots(f, shots, c, t.frames);
};

export const soundL01 = (t: SceneTiming): Cue[] => {
  const c = l01Cues(t);
  return [
    { at: 0, file: "mixkit-2658-wind-ambience.mp3", vol: 0.12, dur: c.seismic, fadeIn: 20, fadeOut: 20 },
    { at: 8, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.26, dur: 20 },
    { at: c.shield - 4, file: "mixkit-1489-whoosh-air.mp3", vol: 0.24, dur: 50 },
    { at: c.rock + 2, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.28, dur: 20 },
    { at: c.oldest - 4, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.26, dur: 60 },
    { at: c.billion + 20, file: "mixkit-3108-chime-crystal.mp3", vol: 0.18, dur: 60 },
    { at: c.seismic - 2, file: "mixkit-1489-whoosh-air.mp3", vol: 0.2, dur: 50 },
    ...[0, 1, 2].map((i) => ({ at: c.seismic + i * 32, file: "mixkit-1686-boom-underground-echo.mp3", vol: 0.16, dur: 30, fadeOut: 10 })),
    { at: c.seven - 4, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.24, dur: 50 },
    { at: c.basalt, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.28, dur: 20 },
    { at: c.fifteen - 4, file: "mixkit-2297-rumble-bass-hum.mp3", vol: 0.3, dur: 50, fadeIn: 6, fadeOut: 14 },
    { at: c.fifteen + 36, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.3, dur: 20 },
    { at: c.problem - 2, file: "mixkit-2658-wind-ambience.mp3", vol: 0.16, trim: 10, dur: c.cut - c.problem + 6, fadeIn: 6, fadeOut: 6 },
    { at: c.cut - 2, file: "mixkit-855-drill-electric.mp3", vol: 0.12, dur: c.turn - c.cut + 2, fadeIn: 4, fadeOut: 4 },
    { at: c.cut, file: "mixkit-403-rock-debris-falling.mp3", vol: 0.16, dur: c.turn - c.cut, fadeOut: 6 },
    { at: c.turn + 12, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.28, dur: 60 },
    { at: c.away + 18, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.3, dur: 20 },
  ];
};
