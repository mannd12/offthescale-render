// Style frame v2 / 1: a mountain world at dusk (Earth). An Everest-class massif in the midground, far ranges sinking
// into apricot haze, a low gold sun half-set behind them, Tick on a foreground ridge pointing at the problem. Previews
// the "how tall can a mountain get?" episode. v2.1: Olympus Mons removed from this Earth horizon (it belongs to the
// Lineup); dusk family pushed to petrol/apricot; the massif has three tonal steps. Round 5 (L12 foundation): cumulus
// redesigned as flat-based irregular lobes, the stratus saucers dropped, facets as clean-edged tonal planes.
// Number: Everest 8,848.86 m (China-Nepal joint survey, 2020) → "8,849 m" (docs/STYLE-V2.md §10).
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  Cumulus,
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
const SUN = { x: 1330, y: 585 };
/** light toward the sun for things left of it: right and a little down */
const L = 8;

export type DuskProps = {
  f0?: number;
  tick?: Partial<TickProps>;
  title?: boolean;
  camKeys?: { f: number; x: number; y: number; zoom: number }[];
  grain?: number;
};

const shift = (pts: [number, number][], dx: number): [number, number][] => pts.map(([x, y]) => [x + dx, y]);

export const DuskScene: React.FC<DuskProps> = ({ f0 = 0, tick, title = true, camKeys, grain = 0.5 }) => {
  const f = useCurrentFrame() + f0;
  const cam = camKeys ? cameraAt(f, camKeys) : undefined;
  const ground = 905;
  const ppm = 104;
  const snow = fall(f, 60, 1920, 1080, 4, 0.9, 14);
  const pill = alpha(F.shadow, 0.72);

  const farRange: [number, number][] = [
    [-400, 700],
    [-100, 640],
    [200, 672],
    [460, 600],
    [700, 650],
    [900, 612],
    [1150, 660],
    [1400, 596],
    [1640, 640],
    [1900, 606],
    [2320, 680],
  ];
  const farRidge: [number, number][] = [
    [-300, 780],
    [-60, 700],
    [180, 740],
    [420, 660],
    [600, 720],
    [830, 680],
    [1100, 730],
    [1380, 666],
    [1600, 724],
    [1840, 690],
    [2300, 760],
  ];
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
  const snowCap = (pts: [number, number][], i0: number, i1: number, line: number, wobble: number) => {
    const top = pts.slice(i0, i1 + 1);
    const bottom: [number, number][] = top
      .map(([x, y], k): [number, number] => [x + (k === 0 ? 1 : k === top.length - 1 ? -1 : 0), Math.max(y, line + Math.sin(k * 1.7 + x * 0.013) * wobble + (k % 2 ? 22 : -10))])
      .reverse();
    return roundPoly([...top, ...bottom], 8);
  };
  const tickX = tick?.x ?? 520;
  const cloudFill = mixHex(F.sky[2], F.light, 0.35);
  const cloudShade = mixHex(F.sky[1], F.sky[2], 0.45);
  const cloudLit = mixHex(F.light, "#FFFFFF", 0.4);

  return (
    <Stage theme={F.theme} cam={cam} drift={{ zoom: 1.06, panX: 0.03, frames: 300, seed: 1 }} vignette={0.22} grain={grain}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={70} x={0} y={0} w={1920} h={380} color={F.text} seed={2} size={1.4} twinkle={0.7} />
        <Bloom x={SUN.x} y={SUN.y} r={680} color={F.light} strength={0.6} spread={0.28} squash={0.7} />
        <Bloom x={SUN.x} y={SUN.y} r={170} color="#FFF1C8" strength={0.95} spread={0.42} core={48} coreColor="#FFF8E0" />
      </Layer>
      {/* clouds: two flat-based cumulus banks lit from below-right by the low sun (no stratus saucers: v2.1 round 5) */}
      <Layer depth={0.14}>
        <Cumulus x={1110 + f * 0.05} y={330} w={340} h={74} fill={cloudFill} shade={cloudShade} lit={cloudLit} light={60} seed={3} frame={f} lobes={4} />
        <Cumulus x={1470 + f * 0.03} y={424} w={300} h={60} fill={cloudFill} shade={cloudShade} lit={cloudLit} light={70} seed={5} frame={f} opacity={0.95} lobes={3} />
      </Layer>
      {/* far range in the apricot haze; the sun sets behind it */}
      <Layer depth={0.2} haze={{ color: F.haze, amount: 0.45 }}>
        <Form d={ridgePath(farRange, 1300, 40)} fill={hazed(F, F.far, 0.1)} light={L} shadow={F.shadow} inset={36} shadowOpacity={0.3} rim={F.light} rimWidth={4} rimOpacity={0.7} bounce={F.bounce}>
          <Facets pts={farRange} base={1300} light={L} fill={F.shadow} opacity={0.3} />
        </Form>
      </Layer>
      <Layer depth={0.32} haze={{ color: F.haze, amount: 0.24 }}>
        <Form d={ridgePath(farRidge, 1300, 26)} fill={F.far} light={L} shadow={F.shadow} inset={26} shadowOpacity={0.45} rim={F.light} rimWidth={3} rimOpacity={0.6} bounce={F.bounce}>
          <Facets pts={farRidge} base={1300} light={L} fill={F.shadow} opacity={0.35} />
        </Form>
        <HazeBand y={660} h={300} color={F.haze} strength={0.3} />
      </Layer>
      {/* the massif: three tonal steps (lit flank, base, shadow flank) + snow */}
      <Layer depth={0.6} haze={{ color: F.haze, amount: 0.07 }}>
        <Form d={ridgePath(massif, 1300, 14)} fill={F.mid} light={L} shadow={F.shadow} inset={30} shadowOpacity={0.5} rim={F.light} rimWidth={4} rimOpacity={0.9} bounce={F.bounce}>
          <Facets pts={massif} base={1300} light={L} fill={F.shadow} opacity={0.45} />
          <Facets pts={massif} base={1300} light={L} fill={mixHex(F.mid, F.light, 0.5)} opacity={0.4} lit />
          <path d={snowCap(massif, 3, 12, 470, 18)} fill={mixHex("#F4EFE6", F.light, 0.18)} />
          <path d={snowCap(massif, 5, 10, 372, 10)} fill="#FFFBF0" />
        </Form>
        <Flock frame={f} x={-140} y={520} vx={1.1} n={6} size={9} color={F.shadow} seed={3} />
        <Embers frame={f} x0={840} x1={900} y={275} n={18} color="#FFFFFF" seed={9} rise={0.3} life={70} size={1.8} wiggle={30} />
      </Layer>
      {/* near ridge with Tick */}
      <Layer depth={1}>
        <Form d={ridgePath(nearRidge, 1300, 30)} fill={F.near} light={L} shadow={F.shadow} inset={36} shadowOpacity={0.5} rim={mixHex(F.light, F.near, 0.3)} rimWidth={3} rimOpacity={0.9} bounce={F.bounce}>
          <Facets pts={nearRidge} base={1300} light={L} fill={F.shadow} opacity={0.5} />
        </Form>
        {[
          { x: 250, y: 918, r: 26, s: 1 },
          { x: 1090, y: 992, r: 34, s: 2 },
          { x: 1380, y: 1020, r: 22, s: 3 },
        ].map((b, i) => (
          <Form key={i} d={roundPoly(blobPts(b.x, b.y, b.r, 9, b.s, 0.22, 0.75), 14)} fill={mixHex(F.near, F.mid, 0.5)} light={L} shadow={F.shadow} inset={10} rim={F.light} rimWidth={2} rimOpacity={0.8} bounce={F.bounce} />
        ))}
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
      <Layer depth={1.25}>
        {snow.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.9} fill="#FFFFFF" opacity={0.5} />
        ))}
        <Motes frame={f} n={24} x={700} y={300} w={1000} h={600} color={F.light} seed={5} size={2.4} />
      </Layer>
      <Layer depth={0}>
        <Leader from={[860, 268]} to={[940, 190]} color={F.text} />
        <Pill x={952} y={190} text="Everest · 8,849 m" fill={pill} color={F.text} dot={P.vermilion} size={20} />
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
