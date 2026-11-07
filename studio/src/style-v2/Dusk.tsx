// Style frame v2 / 1: a mountain world at dusk. Everest-class massif in the midground, Olympus Mons as the whole
// horizon behind it, a low gold sun half-set on that horizon, Tick on a foreground ridge pointing at the problem.
// Previews the "how tall can a mountain get?" episode. Numbers: Everest 8,848.86 m (China-Nepal joint survey, 2020)
// → "8,849 m"; Olympus Mons ~22 km high, ~600 km across (NASA Mars Exploration). Both listed in docs/STYLE-V2.md §10.
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  Embers,
  FAMILIES,
  Facets,
  Flock,
  Form,
  Gauge,
  GroundShadow,
  HazeBand,
  Headline,
  Kicker,
  Layer,
  Leader,
  Motes,
  P,
  Pill,
  Sky,
  Stage,
  Stars,
  Sway,
  Tick,
  TickProps,
  alpha,
  blobPts,
  cameraAt,
  fall,
  hazed,
  loadIllustratedFonts,
  mixHex,
  ridgePath,
  roundPoly,
} from "../lib/illustrated";

loadIllustratedFonts();

const F = FAMILIES.dusk;
const SUN = { x: 1330, y: 512 };
/** light toward the sun for things left of it: right and a little down */
const L = 8;

export type DuskProps = {
  /** frame offset (motion test) */
  f0?: number;
  tick?: Partial<TickProps>;
  /** hide the title block (motion test uses its own) */
  title?: boolean;
  camKeys?: { f: number; x: number; y: number; zoom: number }[];
  grain?: number;
};

const shift = (pts: [number, number][], dx: number): [number, number][] => pts.map(([x, y]) => [x + dx, y]);

export const DuskScene: React.FC<DuskProps> = ({ f0 = 0, tick, title = true, camKeys, grain = 0.5 }) => {
  const f = useCurrentFrame() + f0;
  const cam = cameraAt(f, camKeys ?? [{ f: 0, x: 960, y: 540, zoom: 1 }, { f: 600, x: 980, y: 530, zoom: 1.06 }]);
  const ground = 905; // foreground ridge top under Tick
  const ppm = 104;
  const snow = fall(f, 60, 1920, 1080, 4, 0.9, 14);
  const pill = alpha(F.shadow, 0.72);

  // Olympus Mons: a shield so wide it is the horizon (very gentle slope, flat summit caldera)
  const olympus: [number, number][] = [
    [-400, 660],
    [120, 606],
    [520, 568],
    [820, 546],
    [1000, 538],
    [1060, 536],
    [1130, 537],
    [1320, 548],
    [1700, 582],
    [2320, 648],
  ];
  const farRidge: [number, number][] = [
    [-300, 760],
    [-60, 690],
    [180, 720],
    [420, 640],
    [600, 700],
    [830, 660],
    [1100, 712],
    [1380, 650],
    [1600, 705],
    [1840, 668],
    [2300, 740],
  ];
  // the massif: peak at x ≈ 860 so the title block on the left stays clear of it
  const massif: [number, number][] = shift(
    [
      [-700, 980],
      [-420, 840],
      [-200, 760],
      [60, 640],
      [250, 520],
      [380, 400],
      [460, 300],
      [520, 268],
      [585, 322],
      [660, 302],
      [740, 410],
      [880, 520],
      [1020, 600],
      [1160, 690],
      [1400, 780],
      [1700, 880],
      [2000, 980],
    ],
    340,
  );
  const nearRidge: [number, number][] = [
    [-300, 1000],
    [40, 930],
    [300, 905],
    [560, 905],
    [760, 924],
    [900, 960],
    [1180, 985],
    [1500, 1010],
    [2300, 1080],
  ];
  // snow cap: follows the ridge from i0..i1, bottom edge is the same ridge pushed down with a wobble (no vertical cuts)
  const snowCap = (pts: [number, number][], i0: number, i1: number, depth: number, wobble: number) => {
    const top = pts.slice(i0, i1 + 1);
    const bottom: [number, number][] = top.map(([x, y], k): [number, number] => [x, y + depth + Math.sin(k * 2.1 + x * 0.01) * wobble]).reverse();
    return roundPoly([...top, ...bottom], 10);
  };
  const tickX = tick?.x ?? 520;

  return (
    <Stage theme={F.theme} vignette={0.22} grain={grain}>
      {/* sky, stars, sun */}
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={70} x={0} y={0} w={1920} h={400} color={F.text} seed={2} size={1.4} twinkle={0.7} />
        <Bloom x={SUN.x} y={SUN.y} r={620} color={F.light} strength={0.6} spread={0.28} squash={0.72} />
        <Bloom x={SUN.x} y={SUN.y} r={170} color="#FFF1C8" strength={0.95} spread={0.42} core={48} coreColor="#FFF8E0" />
      </Layer>
      {/* lenticular clouds, lit from below by the sun */}
      <Layer depth={0.14}>
        {[
          { x: 120, y: 330, w: 420, h: 24, s: 1 },
          { x: 760, y: 262, w: 300, h: 20, s: 2 },
          { x: 1420, y: 372, w: 520, h: 30, s: 3 },
        ].map((c, i) => {
          const dx = Math.sin(f / 420 + i) * 18;
          const pts: [number, number][] = [
            [c.x + dx, c.y],
            [c.x + dx + c.w * 0.3, c.y - c.h],
            [c.x + dx + c.w * 0.72, c.y - c.h * 1.1],
            [c.x + dx + c.w, c.y - c.h * 0.2],
            [c.x + dx + c.w * 0.7, c.y + c.h * 0.5],
            [c.x + dx + c.w * 0.25, c.y + c.h * 0.4],
          ];
          return <Form key={i} d={roundPoly(pts, 40)} fill={mixHex(F.sky[2], F.light, 0.2)} light={90} shadow={F.sky[1]} inset={10} shadowOpacity={0.5} rim={F.light} rimWidth={2.5} rimOpacity={0.9} />;
        })}
      </Layer>
      {/* Olympus Mons: the horizon itself, with the sun setting behind its crest */}
      <Layer depth={0.2} haze={{ color: F.haze, amount: 0.4 }}>
        <Form d={ridgePath(olympus, 1300, 60)} fill={hazed(F, F.far, 0.15)} light={L} shadow={F.shadow} inset={40} shadowOpacity={0.35} rim={F.light} rimWidth={4} rimOpacity={0.7} />
        <path d="M1010 538 L1150 539 L1136 547 L1024 546 Z" fill={hazed(F, F.mid, 0.3)} opacity={0.8} />
      </Layer>
      <Layer depth={0.32} haze={{ color: F.haze, amount: 0.24 }}>
        <Form d={ridgePath(farRidge, 1300, 26)} fill={F.far} light={L} shadow={F.shadow} inset={26} shadowOpacity={0.45} rim={F.light} rimWidth={3} rimOpacity={0.6}>
          <Facets pts={farRidge} base={1300} light={L} fill={F.shadow} opacity={0.35} />
        </Form>
        <HazeBand y={640} h={300} color={F.haze} strength={0.3} />
      </Layer>
      {/* the massif */}
      <Layer depth={0.6} haze={{ color: F.haze, amount: 0.07 }}>
        <Form d={ridgePath(massif, 1300, 14)} fill={F.mid} light={L} shadow={F.shadow} inset={30} shadowOpacity={0.5} rim={F.light} rimWidth={4} rimOpacity={0.9}>
          <Facets pts={massif} base={1300} light={L} fill={F.shadow} opacity={0.55} />
          {/* snow caps: bone above the snow line, warm on the lit flank */}
          <path d={snowCap(massif, 4, 10, 95, 16)} fill={mixHex("#F4EFE6", F.light, 0.18)} />
          <path d={snowCap(massif, 5, 9, 30, 6)} fill="#FFFBF0" />
          <Facets pts={massif.slice(4, 11)} base={massif[4][1] + 110} light={L} fill={mixHex(F.mid, F.shadow, 0.3)} opacity={0.35} />
        </Form>
        <Flock frame={f} x={-140} y={520} vx={1.1} n={6} size={9} color={F.shadow} seed={3} />
        {/* spindrift blowing off the summit */}
        <Embers frame={f} x0={840} x1={900} y={275} n={18} color="#FFFFFF" seed={9} rise={0.3} life={70} size={1.8} wiggle={30} />
      </Layer>
      {/* near ridge with Tick */}
      <Layer depth={1}>
        <Form d={ridgePath(nearRidge, 1300, 30)} fill={F.near} light={L} shadow={F.shadow} inset={36} shadowOpacity={0.5} rim={mixHex(F.light, F.near, 0.3)} rimWidth={3} rimOpacity={0.9}>
          <Facets pts={nearRidge} base={1300} light={L} fill={F.shadow} opacity={0.5} />
        </Form>
        {/* boulders */}
        {[
          { x: 250, y: 918, r: 26, s: 1 },
          { x: 1090, y: 992, r: 34, s: 2 },
          { x: 1380, y: 1020, r: 22, s: 3 },
        ].map((b, i) => (
          <Form key={i} d={roundPoly(blobPts(b.x, b.y, b.r, 9, b.s, 0.22, 0.75), 14)} fill={mixHex(F.near, F.mid, 0.5)} light={L} shadow={F.shadow} inset={10} rim={F.light} rimWidth={2} rimOpacity={0.8} />
        ))}
        {/* grass tufts swaying */}
        {[120, 180, 640, 700, 760, 1180, 1230, 1600, 1660].map((x, i) => {
          const y = nearRidge.reduce((acc, p, j, arr) => (j < arr.length - 1 && x >= p[0] && x < arr[j + 1][0] ? p[1] + ((arr[j + 1][1] - p[1]) * (x - p[0])) / (arr[j + 1][0] - p[0]) : acc), 940) + 4;
          return (
            <Sway key={i} frame={f} x={x} y={y} amp={6} period={80} seed={i + 2}>
              <path d={`M${x} ${y} q-8 -16 -3 -34 M${x} ${y} q5 -18 13 -28 M${x} ${y} q-2 -20 -11 -26 M${x + 4} ${y} q8 -12 18 -16`} fill="none" stroke={mixHex(F.second, F.near, 0.35)} strokeWidth={3.2} strokeLinecap="round" />
            </Sway>
          );
        })}
        <GroundShadow x={tickX + 6} y={ground + 2} rx={ppm * 0.42} color={F.shadow} opacity={0.5} />
        <Tick x={520} y={ground} pxPerM={ppm} frame={f} pose="point" expression="surprised" staff look={0.6} {...tick} />
      </Layer>
      {/* foreground flurries and sunlit motes */}
      <Layer depth={1.25}>
        {snow.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.9} fill="#FFFFFF" opacity={0.5} />
        ))}
        <Motes frame={f} n={24} x={700} y={300} w={1000} h={600} color={F.light} seed={5} size={2.4} />
      </Layer>
      {/* HUD: title, labels, gauge */}
      <Layer depth={0}>
        <Leader from={[860, 268]} to={[940, 190]} color={F.text} />
        <Pill x={952} y={190} text="Everest · 8,849 m" fill={pill} color={F.text} dot={P.vermilion} size={20} />
        <Leader from={[1180, 538]} to={[1260, 462]} color={F.text} />
        <Pill x={1272} y={462} text="Olympus Mons · ~22 km" fill={pill} color={F.text} dot={F.light} size={20} />
        {title ? (
          <g>
            <Kicker x={120} y={128} text="Off the Scale · Mountains" color={F.dim} size={20} />
            <Headline x={120} y={250} lines={["How tall can", "a mountain get?"]} size={92} color={F.text} accent={F.light} shadow={F.shadow} rule />
          </g>
        ) : null}
        <Gauge x={1760} y={160} height={560} value={8849} max={10000} unit="m" theme={F.theme} direction="up" title="HEIGHT" side="left" plate={118} readout readoutText="8,849 m" format={(v) => (v === 0 ? "0" : `${v / 1000} km`)} />
      </Layer>
    </Stage>
  );
};
