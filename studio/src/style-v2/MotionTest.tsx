// Kit v2.1 motion test (10 s, 300 frames): a ChapterCard, a Lineup step with the gauge going off the scale and a rolling
// Counter, Tick's pose tween with anticipation and follow-through, a BlackBeat. Every Stage drifts by default.
// Registered as `v2-motion-test`. Numbers (docs/STYLE-V2.md §10): Everest 8,849 m; Mauna Kea ≈ 10,200 m from its base
// on the sea floor (USGS); Olympus Mons ≈ 22,000 m (NASA).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  BlackBeat,
  Bloom,
  ChapterCard,
  Counter,
  Cumulus,
  FAMILIES,
  Facets,
  Form,
  Gauge,
  GroundShadow,
  Kicker,
  Layer,
  LineupItem,
  LineupRail,
  Motes,
  PaperGrain,
  Pill,
  Sky,
  Stage,
  Stars,
  Tick,
  alpha,
  cutPop,
  decadeZoom,
  lineupState,
  loadIllustratedFonts,
  mixHex,
  prog,
  ridgePath,
} from "../lib/illustrated";

loadIllustratedFonts();

export const MOTION_TEST_FRAMES = 300;
const CARD_END = 60;
const LINEUP_END = 225;
const F = FAMILIES.dusk;
const S = FAMILIES.studio;

const ITEMS: (LineupItem & { height: number; draw: (s: number, x: number, y: number, f: number) => React.ReactNode })[] = [
  {
    id: "everest",
    label: "Everest",
    value: "8,849 m",
    height: 8849,
    draw: (s, x, y, f) => {
      const pts: [number, number][] = [[-320, 0], [-180, -120], [-90, -230], [-30, -330], [10, -352], [60, -300], [120, -200], [230, -90], [340, 0]];
      const P2 = pts.map(([px, py]): [number, number] => [x + px * s, y + py * s]);
      return (
        <Form d={ridgePath(P2, y + 10, 10 * s)} fill={F.mid} light={8} shadow={F.shadow} inset={26 * s} shadowOpacity={0.5} rim={F.light} rimWidth={3} rimOpacity={0.9} bounce={F.bounce}>
          <Facets pts={P2} base={y + 10} light={8} fill={F.shadow} opacity={0.6} />
          <path d={`M${x - 90 * s} ${y - 230 * s} L${x - 30 * s} ${y - 330 * s} L${x + 10 * s} ${y - 352 * s} L${x + 60 * s} ${y - 300 * s} L${x + 120 * s} ${y - 200 * s} L${x + 60 * s} ${y - 180 * s} L${x - 20 * s} ${y - 210 * s} L${x - 90 * s} ${y - 190 * s} Z`} fill="#FBF7EE" />
        </Form>
      );
    },
  },
  {
    id: "maunakea",
    label: "Mauna Kea",
    value: "~10,200 m",
    height: 10200,
    draw: (s, x, y, f) => {
      // a broad shield from the sea floor; the sea surface sits ~60 % of the way up (4,207 m above sea level of ~10,200 m)
      const pts: [number, number][] = [[-520, 0], [-300, -170], [-120, -330], [-20, -400], [40, -406], [140, -340], [320, -190], [540, 0]];
      const P2 = pts.map(([px, py]): [number, number] => [x + px * s, y + py * s]);
      const seaY = y - 240 * s + Math.sin(f / 40) * 2;
      return (
        <g>
          <Form d={ridgePath(P2, y + 10, 30 * s)} fill={mixHex(F.mid, F.second, 0.2)} light={8} shadow={F.shadow} inset={30 * s} shadowOpacity={0.5} rim={F.light} rimWidth={3} rimOpacity={0.9} bounce={F.bounce}>
            <Facets pts={P2} base={y + 10} light={8} fill={F.shadow} opacity={0.55} />
          </Form>
          <rect x={x - 620 * s} y={seaY} width={1240 * s} height={y - seaY + 10} fill={FAMILIES.petrol.mid} opacity={0.55} />
          <path d={`M${x - 620 * s} ${seaY} H${x + 620 * s}`} stroke={FAMILIES.petrol.light} strokeWidth={2} opacity={0.8} />
        </g>
      );
    },
  },
  {
    id: "olympus",
    label: "Olympus Mons",
    value: "~22,000 m",
    height: 22000,
    draw: (s, x, y, f) => {
      const pts: [number, number][] = [[-900, 0], [-600, -160], [-300, -330], [-100, -440], [-40, -470], [60, -472], [120, -450], [320, -340], [620, -170], [920, 0]];
      const P2 = pts.map(([px, py]): [number, number] => [x + px * s, y + py * s]);
      return (
        <Form d={ridgePath(P2, y + 10, 60 * s)} fill={mixHex("#B5633A", F.mid, 0.25)} light={8} shadow={F.shadow} inset={40 * s} shadowOpacity={0.5} rim={F.light} rimWidth={3} rimOpacity={0.9} bounce={F.bounce}>
          <Facets pts={P2} base={y + 10} light={8} fill={F.shadow} opacity={0.55} />
          <path d={`M${x - 40 * s} ${y - 470 * s} L${x + 60 * s} ${y - 472 * s} L${x + 50 * s} ${y - 462 * s} L${x - 30 * s} ${y - 460 * s} Z`} fill={F.shadow} opacity={0.5} />
        </Form>
      );
    },
  },
];

/** which lineup step and how far into its transition, for frame f (local to the lineup shot) */
const lineupAt = (f: number) => {
  const STEP_AT = [0, 55, 115];
  const DUR = 45;
  let step = 1;
  let t = 1;
  for (let i = 1; i < STEP_AT.length; i++) {
    if (f >= STEP_AT[i]) {
      step = i + 1;
      t = Math.min(1, (f - STEP_AT[i]) / DUR);
    }
  }
  return { step, t };
};

const LineupShot: React.FC<{ f: number }> = ({ f }) => {
  const { step, t } = lineupAt(f);
  const hero: [number, number] = [1180, 760];
  const rail: [number, number] = [240, 930];
  // the gauge carries the running value; it goes off the scale at Olympus and zooms out by a decade
  const prevH = ITEMS[step - 2]?.height ?? ITEMS[0].height;
  const curH = ITEMS[step - 1].height;
  const e = t * t * (3 - 2 * t);
  const value = prevH + (curH - prevH) * e;
  const off = value > 10000;
  const max = off ? decadeZoom(10000, 100000, Math.min(1, (f - 115 - 45) / 40)) : 10000;
  const pill = alpha(F.shadow, 0.72);
  return (
    <Stage theme={F.theme} drift={{ zoom: 1.05, panX: 0.025, frames: 170, seed: 3 }} vignette={0.24} grain={0}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={60} w={1920} h={360} color={F.text} seed={8} size={1.3} twinkle={0.7} />
        <Bloom x={1500} y={600} r={620} color={F.light} strength={0.5} spread={0.3} squash={0.7} />
      </Layer>
      <Layer depth={0.15}>
        <Cumulus x={160 + f * 0.08} y={330} w={300} h={60} fill={mixHex(F.sky[2], F.light, 0.35)} shade={mixHex(F.sky[1], F.sky[2], 0.45)} lit="#FFF2D0" light={60} seed={2} frame={f} />
        <Cumulus x={1300 + f * 0.05} y={280} w={240} h={48} fill={mixHex(F.sky[2], F.light, 0.35)} shade={mixHex(F.sky[1], F.sky[2], 0.45)} lit="#FFF2D0" light={60} seed={6} frame={f} />
      </Layer>
      <Layer depth={1}>
        {/* ground line */}
        <rect x={-400} y={hero[1] + 8} width={2720} height={400} fill={F.near} />
        {ITEMS.map((it, i) => {
          const st = lineupState(i, step, t, { hero, rail, railGap: 170, heroScale: 1, railScale: 0.14 });
          if (st.opacity <= 0) return null;
          return (
            <g key={it.id} opacity={st.opacity}>
              {it.draw(st.s, st.x, st.y, f)}
            </g>
          );
        })}
        <LineupRail items={ITEMS} step={step} t={t} family={F} rail={rail} railGap={170} />
        <GroundShadow x={1180 + 60} y={hero[1] + 6} rx={60} color={F.shadow} opacity={0.4} />
        <Tick x={1180 + 60} y={hero[1] + 4} pxPerM={60} frame={f} pose={t < 1 && step > 1 ? "cover-ears" : "point"} expression={t < 1 && step > 1 ? "surprised" : "neutral"} look={-0.7} facing={-1} seed={4} outline={F.shadow} />
        <Pill x={1180 + 60} y={hero[1] + 56} text="you" fill={pill} color={F.text} size={14} align="middle" />
        <Motes frame={f} n={30} x={200} y={200} w={1500} h={500} color={F.light} seed={9} size={2.2} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={110} text={`Rung ${step} of 3`} color={F.dim} size={20} />
        <Pill x={120} y={160} text={ITEMS[step - 1].label} fill={pill} color={F.text} dot={F.light} size={22} />
        <Gauge x={1760} y={160} height={520} value={value} max={max} unit="m" theme={F.theme} direction="up" title="HEIGHT" side="left" plate={128} readout={false} format={(v) => (v === 0 ? "0" : `${v / 1000} km`)} />
        <Counter x={1700} y={820} value={value} max={22000} size={54} color={F.text} unit="m" align="end" />
      </Layer>
    </Stage>
  );
};

const TickShot: React.FC<{ f: number }> = ({ f }) => {
  // f local: 0..75. Stand → point tween starts at 12 (30 frames + settle), expression neutral → surprised from 20
  const poseT = Math.max(0, (f - 12) / 30);
  const exprT = prog(f, 20, 18);
  return (
    <Stage theme={S.theme} drift={{ zoom: 1.05, panX: 0.015, frames: 80, seed: 5 }} vignette={0.1} grain={0}>
      <Layer depth={0.05}>
        <Sky family={S} />
        <g stroke={S.mid} strokeWidth={1} opacity={0.18}>
          {Array.from({ length: 24 }, (_, i) => (
            <line key={i} x1={i * 80 + 40} y1={0} x2={i * 80 + 40} y2={1080} />
          ))}
        </g>
      </Layer>
      <Layer depth={1}>
        <GroundShadow x={820} y={1000} rx={150} ry={30} color={S.shadow} opacity={0.3} blur={16} />
        <Tick x={780} y={1000} pxPerM={300} frame={f} pose="stand" poseTo="point" poseT={poseT} expression="neutral" expressionTo="surprised" expressionT={exprT} look={0.5} seed={6} />
        <Motes frame={f} n={16} x={200} y={200} w={1500} h={600} color={S.second} seed={3} size={2.4} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={110} text="pose tween · anticipation → overshoot → settle" color={S.dim} size={20} />
        <Pill x={1200} y={300 + Math.sin(f / 30) * 2} text={`poseT ${Math.min(1.8, poseT).toFixed(2)}`} fill={alpha(S.shadow, 0.5)} color={S.light} size={16} />
      </Layer>
    </Stage>
  );
};

export const MotionTest: React.FC = () => {
  const f = useCurrentFrame();
  const pop = f < CARD_END ? 1 : f < LINEUP_END ? cutPop(f, CARD_END) : cutPop(f, LINEUP_END);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${pop})` }}>
        {f < CARD_END ? (
          <ChapterCard family={F} kicker="Chapter one" title="How Tall Can a Mountain Get?" t={f / CARD_END} frame={f} />
        ) : f < LINEUP_END ? (
          <LineupShot f={f - CARD_END} />
        ) : (
          <TickShot f={f - LINEUP_END} />
        )}
      </AbsoluteFill>
      <BlackBeat t={prog(f, MOTION_TEST_FRAMES - 16, 16)} fadeIn={0.7} fadeOut={0.0001} />
      <PaperGrain frame={f} dark amount={0.45} />
    </AbsoluteFill>
  );
};
