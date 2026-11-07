// Style frame v2 / 1: a mountain world at dusk. Everest-class massif in the midground, Olympus Mons as the whole
// horizon behind it, a low gold sun, Tick on a foreground ridge pointing at the problem. Previews the "how tall can a
// mountain get?" episode. Numbers: Everest 8,848.86 m (China-Nepal joint survey, 2020) → "8,849 m"; Olympus Mons
// ~22 km high, ~600 km across (NASA Mars Exploration). Both listed in docs/STYLE-V2.md §10.
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  Embers,
  FAMILIES,
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
  blobPts,
  cameraAt,
  fall,
  hazed,
  loadIllustratedFonts,
  mixHex,
  ridgePath,
  roundPoly,
  smoothPath,
} from "../lib/illustrated";

loadIllustratedFonts();

const F = FAMILIES.dusk;
const SUN = { x: 1250, y: 585 };
/** light toward the sun for things left of it: right and a little down */
const L = 12;

export type DuskProps = {
  /** frame offset (motion test) */
  f0?: number;
  tick?: Partial<TickProps>;
  /** hide the title block (motion test uses its own) */
  title?: boolean;
  camKeys?: { f: number; x: number; y: number; zoom: number }[];
};

export const DuskScene: React.FC<DuskProps> = ({ f0 = 0, tick, title = true, camKeys }) => {
  const f = useCurrentFrame() + f0;
  const cam = cameraAt(f, camKeys ?? [{ f: 0, x: 960, y: 540, zoom: 1 }, { f: 600, x: 980, y: 530, zoom: 1.06 }]);
  const ground = 905; // foreground ridge top under Tick
  const ppm = 92;
  const snow = fall(f, 70, 1920, 1080, 4, 0.9, 14);
  const motes = { color: F.light };

  // Olympus Mons: a shield so wide it is the horizon (very gentle slope, flat summit caldera)
  const olympus: [number, number][] = [
    [-400, 650],
    [120, 598],
    [520, 560],
    [820, 536],
    [1000, 528],
    [1060, 526],
    [1130, 527],
    [1320, 540],
    [1700, 574],
    [2320, 640],
  ];
  // far ridge line (hazed), mid massif (Everest-class), near dark ridge
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
  const massif: [number, number][] = [
    [-300, 980],
    [-120, 820],
    [60, 700],
    [200, 560],
    [330, 430],
    [410, 300],
    [470, 262],
    [540, 320],
    [620, 300],
    [700, 420],
    [830, 520],
    [960, 600],
    [1080, 680],
    [1300, 760],
    [1600, 860],
    [2300, 980],
  ];
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
  const snowLine = (pts: [number, number][], from: number, to: number, drop: number) =>
    smoothPath(pts.slice(from, to + 1).map(([x, y]) => [x, y + drop])) +
    ` L${pts[to][0]} ${pts[from][1] - 400} L${pts[from][0]} ${pts[from][1] - 400} Z`;

  return (
    <Stage theme={F.theme} vignette={0.22}>
      {/* sky, stars, sun */}
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={70} x={0} y={0} w={1920} h={420} color={F.text} seed={2} size={1.4} twinkle={0.7} />
        <Bloom x={SUN.x} y={SUN.y} r={520} color={F.light} strength={0.55} spread={0.3} squash={0.7} />
        <Bloom x={SUN.x} y={SUN.y} r={150} color="#FFF1C8" strength={0.9} spread={0.4} core={46} coreColor="#FFF6DA" />
      </Layer>
      {/* lenticular clouds, lit from below by the sun */}
      <Layer depth={0.14}>
        {[
          { x: 180, y: 330, w: 420, h: 26, s: 1 },
          { x: 700, y: 268, w: 300, h: 20, s: 2 },
          { x: 1400, y: 350, w: 520, h: 30, s: 3 },
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
          return <Form key={i} d={roundPoly(pts, 40)} fill={mixHex(F.sky[2], F.light, 0.25)} light={90} shadow={F.sky[1]} inset={10} shadowOpacity={0.5} rim={F.light} rimWidth={2.5} rimOpacity={0.9} />;
        })}
      </Layer>
      {/* Olympus Mons: the horizon itself */}
      <Layer depth={0.2} haze={{ color: F.haze, amount: 0.42 }}>
        <Form d={ridgePath(olympus, 1300, 60)} fill={hazed(F, F.far, 0.2)} light={L} shadow={F.shadow} inset={40} shadowOpacity={0.35} rim={F.light} rimWidth={4} rimOpacity={0.55} />
        {/* summit caldera: a flat notch */}
        <path d="M1010 528 L1150 529 L1136 537 L1024 536 Z" fill={hazed(F, F.mid, 0.3)} opacity={0.8} />
      </Layer>
      <Layer depth={0.32} haze={{ color: F.haze, amount: 0.26 }}>
        <Form d={ridgePath(farRidge, 1300, 26)} fill={F.far} light={L} shadow={F.shadow} inset={26} shadowOpacity={0.45} rim={F.light} rimWidth={3} rimOpacity={0.5} />
        <HazeBand y={640} h={300} color={F.haze} strength={0.35} />
      </Layer>
      {/* the massif */}
      <Layer depth={0.6} haze={{ color: F.haze, amount: 0.08 }}>
        <Form d={ridgePath(massif, 1300, 14)} fill={F.mid} light={L} shadow={F.shadow} inset={30} shadowOpacity={0.6} rim={F.light} rimWidth={4} rimOpacity={0.85}>
          {/* snow caps: bone above the snow line, lit side warm */}
          <path d={snowLine(massif, 3, 9, 70)} fill={mixHex("#F4EFE6", F.light, 0.25)} opacity={0.95} />
          <path d={snowLine(massif, 4, 8, 20)} fill="#FBF7EE" />
          {/* shadowed couloirs (flat shade facets) */}
          <path d="M470 262 L540 320 L560 520 L480 480 Z" fill={F.shadow} opacity={0.22} />
          <path d="M620 300 L700 420 L690 600 L630 560 Z" fill={F.shadow} opacity={0.22} />
        </Form>
        <Flock frame={f} x={-140} y={520} vx={1.1} n={6} size={9} color={F.shadow} seed={3} />
        {/* spindrift blowing off the summit */}
        <Embers frame={f} x0={430} x1={520} y={275} n={18} color="#FFFFFF" seed={9} rise={0.3} life={70} size={1.8} wiggle={30} />
      </Layer>
      {/* near ridge with Tick */}
      <Layer depth={1}>
        <Form d={ridgePath(nearRidge, 1300, 30)} fill={F.near} light={L} shadow={F.shadow} inset={36} shadowOpacity={0.5} rim={mixHex(F.light, F.near, 0.35)} rimWidth={3} rimOpacity={0.9} />
        {/* boulders */}
        {[
          { x: 250, y: 918, r: 26, s: 1 },
          { x: 1090, y: 992, r: 34, s: 2 },
          { x: 1380, y: 1020, r: 22, s: 3 },
        ].map((b, i) => (
          <Form key={i} d={roundPoly(blobPts(b.x, b.y, b.r, 9, b.s, 0.22, 0.75), 14)} fill={mixHex(F.near, F.mid, 0.4)} light={L} shadow={F.shadow} inset={10} rim={F.light} rimWidth={2} rimOpacity={0.7} />
        ))}
        {/* grass tufts swaying */}
        {[120, 180, 640, 700, 760, 1180, 1230, 1600, 1660].map((x, i) => {
          const y = nearRidge.reduce((acc, p, j, arr) => (j < arr.length - 1 && x >= p[0] && x < arr[j + 1][0] ? p[1] + ((arr[j + 1][1] - p[1]) * (x - p[0])) / (arr[j + 1][0] - p[0]) : acc), 940) + 4;
          return (
            <Sway key={i} frame={f} x={x} y={y} amp={6} period={80} seed={i + 2}>
              <path d={`M${x} ${y} q-6 -14 -2 -30 M${x} ${y} q4 -16 10 -24 M${x} ${y} q-1 -18 -8 -22`} fill="none" stroke={mixHex(F.near, F.second, 0.35)} strokeWidth={2.4} strokeLinecap="round" />
            </Sway>
          );
        })}
        <GroundShadow x={(tick?.x ?? 520) + 6} y={ground + 2} rx={ppm * 0.42} color={F.shadow} opacity={0.45} />
        <Tick x={520} y={ground} pxPerM={ppm} frame={f} pose="point" expression="surprised" staff look={0.6} {...tick} />
      </Layer>
      {/* foreground flurries and sunlit motes */}
      <Layer depth={1.25}>
        {snow.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.9} fill="#FFFFFF" opacity={0.55} />
        ))}
        <Motes frame={f} n={26} x={700} y={300} w={1000} h={600} color={motes.color} seed={5} size={2.4} />
      </Layer>
      {/* HUD: title, labels, gauge */}
      <Layer depth={0}>
        <Leader from={[470, 262]} to={[560, 170]} color={F.text} />
        <Pill x={572} y={170} text="Everest · 8,849 m" fill={mixHex(F.sky[0], "#000", 0.3)} color={F.text} dot={P.vermilion} size={20} />
        <Leader from={[1080, 528]} to={[1180, 455]} color={F.text} />
        <Pill x={1192} y={455} text="Olympus Mons · ~22 km" fill={mixHex(F.sky[0], "#000", 0.3)} color={F.text} dot={F.light} size={20} />
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
