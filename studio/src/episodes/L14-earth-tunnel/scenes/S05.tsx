// L14 scene l05 "Down through the crust and the mantle" (storyboard §3 "5 ·": shots 5-01…5-26, script lines 34-43, noon
// pole → deep petrol Kola → STUDIO_SET crust and brackets → ember mantle, Act II). Shot components (hard cuts; continuous
// rows are phases): 5-01+5-02 (the polar hatch; the probe drops into the airless shaft) · 5-03+5-04 (Kola: the tilt down
// the borehole to 12,262 m; HEAT climbs to ~180 °C) · 5-05 (Tick's flag at the hole, heat rising) · 5-06 (the HEAT column
// past the warm band) · 5-07 (pull-back: the hole shrinks to a notch on the cut-away) · 5-08 (the crust skin draws round
// the disc) · 5-09+5-10 (Tick paints the skin along the 12,742 km ruler; the magnifier) · 5-11+5-12 (the crust leaves
// overhead; the mantle walls ripple) · 5-13 (a block sags and flows while a clock whirls) · 5-14 (the Kola core bends like
// putty) · 5-15 (Tick draws the walls; they bulge) · 5-16 (back in the shaft) · 5-17 (the walls close in) · 5-18 (the
// argument) · 5-19…5-21 (the two mantle brackets; nearly half the ruler) · 5-22+5-23 (the frost sheet cracks off) ·
// 5-24+5-25 (accelerating, the pull still high; the 19-min ring) · 5-26 (the core boundary rises; ZT into the line).
// Numbers drawn, each with its sources.md row: 12,262 m (#14) · ~180 °C (#14, V6 cleared; via GAUGE.kola) · 5 TO 40 km
// (#21 #29) · 12,742 km (#13) · OVER 2,800 km (#21) · ≈ 2,900 km (#15, F8: the mantle's thickness) · ≈ 45 % (#23b) ·
// 19 MIN (#10: 1,145.88 s; F11, the ring fills only to its end plate) · 2,886 km (#13: 6,371 − 3,485; F8, the depth of
// the core boundary). F9: HEAT and PRESSURE carry no number except Kola's. Tick never in the tunnel (F13).
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  Counter,
  Emissive,
  Embers,
  GroundShadow,
  IF2,
  Inset,
  Kicker,
  Layer,
  Motes,
  Puffs,
  Sky,
  Stage,
  Stars,
  Streamers,
  Tick,
  alpha,
  cameraAt,
  impact,
  mixHex,
  ramp,
  walkPhase,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { GAUGE, HeatGauge, L14Gauges, STOP, pullValue } from "../L14Gauges";
import { Shimmer, StrataWall, Stratum } from "../tunnel";
import { CutGlobe } from "../cutglobe";
import { ClockFace, HatchLid, Rig } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, CREAM, EMBER, INK, NOON, PETROL, Pop, STUDIO, Slab, StudioRoom, Tag, clamp01, ez } from "./Cold";
import { Bracket, DeepShaft, Ruler } from "./S04";

const FLOOR = 860;
const E = EMBER;
const P = PETROL;
const S = STUDIO;

/** Kola's banded crust (L11's look: alternating ochre bands; km below the surface, schematic). */
const KOLA: Stratum[] = [
  { from: -40, to: 0, color: "#0A3C4C", pattern: "rock" },
  ...Array.from({ length: 40 }, (_, i) => ({ from: i * 1.1, to: (i + 1) * 1.1, color: [C.crust, C.crustDeep, mixHex(C.crust, C.mantle, 0.35)][i % 3], pattern: "rock" as const })),
];

/** The cluster, compact, in the deep shaft: needles only (F9), no readouts. */
const ShaftGauges: React.FC<{ f: number; F: typeof E; speed: number; heat: number; pressure: number; pull: number; appear?: number }> = ({ f, F, speed, heat, pressure, pull, appear = 1 }) => (
  <L14Gauges
    family={F}
    frame={f}
    theme="light"
    compact
    speed={{ value: speed, stop: STOP.speed /* #2 */, appear }}
    heat={{ value: heat, appear }}
    pressure={{ value: pressure, appear }}
    pull={{ value: pull, stop: STOP.pull /* #3 */, appear }}
  />
);

/** A rounded number plate with a Counter rolling UP to a sourced value (`k` 0..1) and the unit in its own case. */
const CounterSlab: React.FC<{ x: number; y: number; value: number; k: number; unit: string; F: typeof E; size?: number; pre?: string; opacity?: number }> = ({ x, y, value, k, unit, F, size = 96, pre = "", opacity = 1 }) => {
  const digits = String(value).length;
  const w = (digits + Math.floor((digits - 1) / 3) * 0.4 + (pre ? 0.8 : 0)) * size * 0.6 + unit.length * size * 0.27 + size * 0.9;
  return (
    <g opacity={opacity}>
      <rect x={x - size * 0.3} y={y - size * 0.95} width={w} height={size * 1.25} rx={size * 0.18} fill={alpha(F.shadow, 0.72)} />
      {pre ? (
        <text x={x} y={y} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: size, fill: CREAM }}>
          {pre}
        </text>
      ) : null}
      <Counter x={x + (pre ? size * 0.66 : 0)} y={y} value={value * clamp01(k)} max={value} size={size} color={CREAM} unit={unit} align="start" />
    </g>
  );
};

const ink = { plate: alpha(P.shadow, 0.88), edge: alpha(C.bone, 0.55), ink: C.bone, dim: alpha(C.bone, 0.6) };

// ================================================================================================================
// cues
// ================================================================================================================
export const cuesL05 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    pole: 0, // 5-01
    go: p(0, "Now go down"), // 5-02 (phase)
    kola: at(1), // 5-03
    rock: p(1, "with the rock at about"), // 5-04 (phase)
    humans: at(2), // 5-05
    dial: p(2, "The heat dial"), // 5-06
    back: end(2, -10), // 5-07
    skin: p(3, "is a thin skin"), // 5-08
    paint: p(3, "Against a tunnel"), // 5-09
    coat: p(3, "it is a coat of paint"), // 5-10 (phase)
    mantle: at(4), // 5-11
    solid: p(4, "It's solid"), // 5-12 (phase)
    flows: p(4, "Over long times"), // 5-13
    plastic: at(5), // 5-14
    drawn: p(5, "Our drawn tunnel"), // 5-15
    drawing: p(5, "because we are drawing"), // 5-16
    real: at(6), // 5-17
    argue: p(6, "a long argument"), // 5-18
    reach: at(7), // 5-19
    far: p(7, "Count the far side"), // 5-20 (phase)
    half: p(7, "add up to"), // 5-21 (phase)
    frozen: at(8), // 5-22
    isnot: p(8, "and is not"), // 5-23 (phase)
    fast: at(9), // 5-24
    nineteen: p(9, "Without air"), // 5-25 (phase)
    boundary: p(9, "But the core boundary"), // 5-26
    end: t.frames,
  };
};
export type CL05 = ReturnType<typeof cuesL05>;

// ================================================================================================================
// 5-01 + 5-02 · noon: a polar ice plain under a low sun, aurora ribbons, the sealed hatch; Tick spins the valve wheel and
// the lid swings open. Then the camera dives in: petrol shaft, strata streaming up (16 px/f), the four dials light at
// right. MOVER: snow streamers (9 px/f) + aurora (amp 40) + the wheel; then the strata.
// ================================================================================================================
const ShotPole: ShotFC<CL05> = ({ f, len, c }) => {
  const ph = c.go - c.pole;
  const dive = f >= ph + 12;
  if (dive) {
    const g = f - ph - 12;
    const scroll = 260 + g * 16;
    return (
      <Stage theme={P.theme} cam={cameraAt(g, [{ f: 0, x: 900, y: 540, zoom: 1.2 }, { f: len - ph, x: 940, y: 540, zoom: 1.0 }])} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <DeepShaft f={g} F={P} scroll={scroll} depth={-20} pxPerKm={6} probe={{ y: 440 + Math.sin(g / 8) * 4 }} embers={0} ruler={1120} />
        </Layer>
        <Layer depth={0}>
          <ShaftGauges f={g} F={P} speed={0.05 + 0.12 * ez(g, 0, 60)} heat={0.03} pressure={0.03} pull={pullValue(GAUGE.pullSurface)} appear={ez(g, 0, 14)} />
        </Layer>
      </Stage>
    );
  }
  const open = ez(f, ph - 30, ph);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: ph, x: 900, y: 600, zoom: 1.1 },
    { f: ph + 12, x: 860, y: 740, zoom: 3.2 },
  ]);
  const gy = 760;
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} cam={cam} vignette={0.1} grain={0.5}>
        <Layer depth={0.3}>
          <Sky family={NOON} stops={["#1F5E8A", "#4FB5DE", "#CFEFF0"]} />
          <Bloom x={180} y={640} r={460} color="#FFE6B0" core={50} coreColor="#FFFFFF" strength={0.85} />
          {[0, 1, 2].map((i) => (
            <Emissive
              key={i}
              d={Array.from({ length: 25 }, (_, k) => `${k ? "L" : "M"}${-200 + k * 100} ${150 + i * 70 + Math.sin(k / 3 + f / 14 + i) * 40}`).join(" ")}
              color={i % 2 ? "#7FE8C0" : C.teal}
              core="#E6FFF4"
              width={10 + i * 4}
              strength={0.6}
              glow={16}
              opacity={0.75}
            />
          ))}
        </Layer>
        <Layer depth={1}>
          <rect x={-800} y={gy} width={3600} height={900} fill={C.ice} />
          <path d={`M-800 ${gy} Q 300 ${gy - 60} 900 ${gy - 10} Q 1500 ${gy + 30} 2800 ${gy - 40} L2800 ${gy + 30} L-800 ${gy + 30} Z`} fill={mixHex(C.ice, C.frost, 0.4)} />
          <HatchLid x={860} y={gy + 10} r={80} open={open} clamp={1 - open} family={NOON} f={f} />
          {/* the valve wheel */}
          <g transform={`rotate(${f * 6} 1010 ${gy - 40})`}>
            <circle cx={1010} cy={gy - 40} r={44} fill="none" stroke={C.saffron} strokeWidth={10} />
            {[0, 60, 120].map((a) => (
              <line key={a} x1={1010 + Math.cos((a * Math.PI) / 180) * 44} y1={gy - 40 + Math.sin((a * Math.PI) / 180) * 44} x2={1010 - Math.cos((a * Math.PI) / 180) * 44} y2={gy - 40 - Math.sin((a * Math.PI) / 180) * 44} stroke={C.saffron} strokeWidth={8} />
            ))}
          </g>
          <rect x={1002} y={gy - 40} width={16} height={50} fill={C.saffronDeep} />
          <GroundShadow x={1120} y={gy + 3} rx={50} color={NOON.shadow} opacity={0.3} blur={8} />
          <Tick x={1120} y={gy} pxPerM={150} frame={f} facing={-1} pose="heave" expression="determined" look={0.5} tilt={Math.sin(f / 4) * 3} />
        </Layer>
        <Layer depth={1.2}>
          <Streamers f={f} n={22} x0={-300} x1={2300} y0={100} y1={1000} len={60} width={6} speed={9} color="#FFFFFF" opacity={0.8} slope={0.25} seed={3} />
        </Layer>
        <Layer depth={0}>
          <Kicker x={120} y={130} text="AIRLESS · POLE TO POLE" color={INK} size={32} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-03 + 5-04 · petrol Kola: the rig at the top, the camera tilts down the banded borehole (10 px/f) while a Counter rolls
// to 12,262 m (#14) and the marker plate at the bottom flashes; then the HEAT column climbs to the Kola mark with its
// readout rolling to ~180 °C (#14, GAUGE.kola). MOVER: bands streaming + the counter; then the column (5 px/f) + roll.
// ================================================================================================================
const ShotKola: ShotFC<CL05> = ({ f, len, c }) => {
  const ph = c.rock - c.kola;
  const ppk = 60;
  const bottom = 12.262 * ppk; // #14, world px below the ground
  const k = ez(f, 4, ph - 6);
  const scroll = (bottom - 120) * k + 140 * ez(f, ph, len);
  const groundY = 540 + 40 * ppk * 0 - scroll - 260; // ground sits 260 px above the anchor at scroll 0
  const holeBottom = groundY + bottom;
  const heatK = ez(f, ph + 4, ph + 44);
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.01, panY: 0.0, frames: len + 40, seed: 5 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <rect x={-400} y={-400} width={2800} height={1900} fill={P.sky[0]} />
          <StrataWall f={f} family={P} layers={KOLA} depth={0} pxPerKm={ppk} anchorY={540 - 260} scroll={scroll} cx={640} gap={70} x0={-300} x1={1500} seams={false} lamp={null} />
          {/* sky and the rig above the ground */}
          <rect x={-400} y={-600} width={2800} height={Math.max(0, groundY + 600)} fill={P.sky[0]} />
          <Stars frame={f} n={40} x={-200} y={groundY - 600} w={1800} h={560} color={P.text} seed={4} size={2} twinkle={0.6} />
          <rect x={-400} y={groundY - 10} width={2800} height={14} fill={mixHex(C.crust, CREAM, 0.3)} />
          <Rig x={640} y={groundY} h={300} f={f} cableTo={Math.min(holeBottom, groundY + 2000)} />
          {/* the bottom of the hole and its marker plate */}
          <rect x={602} y={holeBottom} width={76} height={1400} fill={C.crustDeep} />
          <ellipse cx={640} cy={holeBottom} rx={35} ry={10} fill={C.saffron} opacity={0.6 + 0.4 * Math.sin(f / 3)} />
          <rect x={720} y={holeBottom - 40} width={140} height={46} rx={10} fill={C.saffron} opacity={k > 0.9 ? 1 : 0} />
          <Shimmer f={f} x={590} y={holeBottom - 500} w={100} h={500} speed={6} opacity={0.35 * heatK} />
          <Motes frame={f} n={16} x={-200} y={0} w={1700} h={1080} color={alpha(C.bone, 0.7)} seed={6} size={4} drift={40} />
        </Layer>
        <Layer depth={0}>
          <CounterSlab x={130} y={240} value={12262} /* #14 */ k={k} unit="m" F={P} size={92} opacity={1 - ez(f, ph, ph + 10)} />
          <Tag x={120} y={950} text="KOLA" F={P} dot={C.saffron} size={34} opacity={1 - ez(f, ph, ph + 8)} />
          <Tag x={120} y={950} text="KOLA: ABOUT 180 °C" /* #14 */ F={P} dot={C.vermilion} size={34} opacity={ez(f, ph + 4, ph + 14)} />
          {f >= ph ? (
            <g transform={`translate(1040 260) scale(1.6) translate(-1040 -260)`} opacity={ez(f, ph, ph + 8)}>
              <HeatGauge x={1040} y={260} s={{ value: 0.04 + 0.12 * heatK, readout: GAUGE.kola /* #14 */, approx: true, roll: heatK }} f={f} ink={ink} />
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-05 · night at the Kola rig: Tick crouches and plants a small flag beside the capped hole; heat streaks and steam rise
// out of it. Pill AS FAR AS HUMANS HAVE BEEN. MOVER: heat streaks rising (10 px/f) + puffs + Tick's plant.
// ================================================================================================================
const ShotFlag: ShotFC<CL05> = ({ f, len }) => {
  const gy = 780;
  const plant = 16;
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.1, panX: -0.02, panY: 0.01, frames: len + 30, seed: 6 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <Sky family={P} />
          <Stars frame={f} n={80} w={1920} h={600} color={P.text} seed={7} size={2.2} twinkle={0.7} />
          <Bloom x={1400} y={160} r={260} color={P.light} core={30} coreColor="#FFFFFF" strength={0.6} />
        </Layer>
        <Layer depth={1}>
          <rect x={-600} y={gy} width={3200} height={800} fill={mixHex(C.crustDeep, P.near, 0.4)} />
          <rect x={-600} y={gy - 8} width={3200} height={14} fill={mixHex(C.crust, CREAM, 0.25)} />
          <Rig x={700} y={gy} h={420} f={f * 0.3} cableTo={gy - 30} />
          <ellipse cx={700} cy={gy + 4} rx={60} ry={16} fill={P.shadow} />
          <ellipse cx={700} cy={gy + 2} rx={40} ry={10} fill={C.saffron} opacity={0.7 + 0.3 * Math.sin(f / 4)} />
          <g transform={`rotate(-90 700 ${gy})`}>
            <Streamers f={f} n={10} x0={gy - 40} x1={gy + 700} y0={660} y1={740} len={120} width={7} speed={10} color={C.saffronCore} opacity={0.65} seed={9} />
          </g>
          <Puffs frame={f} x={700} y={gy - 10} color={alpha(CREAM, 0.55)} period={10} size={36} rise={3} drift={10} life={60} seed={4} />
          <Shimmer f={f} x={620} y={gy - 520} w={160} h={520} speed={6} opacity={0.35} />
          {/* the flag */}
          <g transform={`translate(860 ${gy})`}>
            <line x1={0} y1={0} x2={0} y2={-150 * ez(f, plant, plant + 6)} stroke={CREAM} strokeWidth={6} />
            {f > plant + 4 ? <path d={`M0 ${-150} q 40 ${-10 + Math.sin(f / 4) * 10} 80 ${Math.sin(f / 4 + 1) * 8} l0 50 q -40 ${-6 + Math.sin(f / 4) * 8} -80 0 Z`} fill={C.vermilion} transform={`scale(${ez(f, plant + 4, plant + 14)} 1)`} /> : null}
          </g>
          <GroundShadow x={960} y={gy + 3} rx={50} color={P.shadow} opacity={0.4} blur={8} />
          <Tick x={960} y={gy} pxPerM={150} frame={f} facing={-1} pose={f < plant + 4 ? "crouch-reach" : "hips"} expression="proud" look={0.3} squash={impact(f, plant + 4, 0.12, 10)} />
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={950} text="AS FAR AS HUMANS HAVE BEEN" F={P} dot={C.saffron} size={32} opacity={ez(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-06 · the HEAT column, big: it climbs through the green warm band into the yellow zone (no readout, F9); heat shimmer
// rises behind; Tick leans in, worried. MOVER: the column's end (≈ 4 px/f at ×2.6) + shimmer + the camera push.
// ================================================================================================================
const ShotHeatDial: ShotFC<CL05> = ({ f, len }) => {
  const v = 0.06 + 0.4 * ez(f, 2, 50) + 0.05 * clamp01((f - 50) / 60);
  return (
    <Pop f={f}>
      <Stage theme={P.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 1000, y: 520, zoom: 1.16 }])} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <Sky family={P} />
          <Shimmer f={f} x={-100} y={0} w={2100} h={1080} rows={9} speed={6} opacity={0.3} width={12} />
          <Bloom x={1400} y={900} r={520} color={C.saffron} core={0} strength={0.35 + 0.2 * ez(f, 10, 50)} />
        </Layer>
        <Layer depth={1}>
          <g transform="translate(560 230) scale(2.6)">
            <HeatGauge x={0} y={0} s={{ value: v }} f={f} ink={ink} />
          </g>
          <GroundShadow x={330} y={FLOOR + 3} rx={50} color={P.shadow} opacity={0.4} blur={8} />
          <Tick x={330} y={FLOOR} pxPerM={160} frame={f} facing={1} pose="lean" expression="worried" look={0.8} tilt={8 * ez(f, 0, 30)} headTilt={10} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-07 · pull-back: from the borehole's mouth out to the whole cut-away; the 12-km hole shrinks to a pulsing notch at the
// top pole. MOVER: the zoom-out (×7 → ×1 in 40 f: edges ≫ 8 px/f) + the hatch turning.
// ================================================================================================================
const ShotPullBack: ShotFC<CL05> = ({ f, len }) => {
  const g = { cx: 860, cy: 600, R: 420 };
  const cam = cameraAt(f, [
    { f: 0, x: g.cx, y: g.cy - g.R + 10, zoom: 7 },
    { f: 44, x: g.cx, y: g.cy - 40, zoom: 1.15 },
    { f: Math.max(45, len), x: g.cx, y: g.cy - 20, zoom: 1.0 },
  ]);
  return (
    <Stage theme={P.theme} cam={cam} vignette={0.3} grain={0.5}>
      <Layer depth={0.2}>
        <Sky family={P} />
        <Stars frame={f} n={90} w={1920} h={1080} color={P.text} seed={8} size={2.2} twinkle={0.7} />
      </Layer>
      <Layer depth={1}>
        <CutGlobe {...g} f={f} family={P} rot={f * 1.2} notch={1} />
        <rect x={g.cx - 2} y={g.cy - g.R - 1} width={4} height={12} fill={C.saffron} />
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 5-08 · STUDIO: the cut-away disc; the crust line thickens into a thin ochre skin drawn round the top (head 20 px/f).
// Pill THE CRUST: 5 TO 40 km (#21 #29). MOVER: the skin's drawing head + the hatch turning.
// ================================================================================================================
const ShotSkin: ShotFC<CL05> = ({ f, len }) => {
  const g = { cx: 760, cy: 470, R: 330 };
  const k = clamp01((f * 20) / (Math.PI * g.R * 1.6));
  const a0 = -180;
  const a1 = a0 + 288 * k;
  const pt = (a: number, r: number) => [g.cx + Math.cos((a * Math.PI) / 180) * r, g.cy + Math.sin((a * Math.PI) / 180) * r];
  const [sx, sy] = pt(a0, g.R);
  const [ex, ey] = pt(a1, g.R);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.08, panX: -0.02, panY: 0.01, frames: len + 40, seed: 7 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 600} seed={10} hud={<Tag x={120} y={950} text="THE CRUST: 5 TO 40 km" /* #21 #29 */ F={S} dot={C.crust} size={32} opacity={ez(f, 6, 16)} />}>
          <CutGlobe {...g} f={f} family={S} rot={f * 1.0} />
          {k > 0 ? (
            <g>
              <path d={`M${sx} ${sy} A${g.R} ${g.R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${ex} ${ey}`} stroke={C.crust} strokeWidth={6 + 10 * k} fill="none" strokeLinecap="round" />
              {k < 1 ? <circle cx={ex} cy={ey} r={18} fill={C.saffron} stroke={CREAM} strokeWidth={4} /> : null}
            </g>
          ) : null}
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-09 + 5-10 · STUDIO: Tick walks the 12,742 km ruler (#13) with a brush, laying the crust on it like paint (≈ 4 px
// thick at this scale: 35 km of 12,742); then a magnifier zooms on the ruler's start where the skin is one thin line and
// the ruler marks slide past. Pill A COAT OF PAINT. MOVER: Tick + the paint wipe (12 px/f); then the inset's marks.
// ================================================================================================================
const ShotPaint: ShotFC<CL05> = ({ f, len, c }) => {
  const ph = c.coat - c.paint;
  const x0 = 160;
  const x1 = 1500;
  const ry = 640;
  const tx = x0 + 60 + Math.min(x1 - x0 - 60, f * 12);
  const thick = Math.max(3, ((x1 - x0) * 35) / 12742); // drawn crust ≈ 3.7 px (#13 #21)
  const ins = ez(f, ph, ph + 14);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.0, frames: len + 40, seed: 8 }} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 700}
          seed={11}
          hud={
            <g>
              <Slab x={140} y={250} value="12,742" /* #13 */ unit="km" size={96} F={S} />
              <Tag x={120} y={950} text="A COAT OF PAINT" F={S} dot={C.crust} size={32} opacity={ez(f, ph, ph + 10)} />
            </g>
          }
        >
          <Ruler x0={x0} x1={x1} y={ry} color={INK} step={44} />
          <rect x={x0} y={ry - 4 - thick} width={Math.max(0, tx - x0 - 40)} height={thick} fill={C.crust} />
          {/* the brush */}
          <g transform={`translate(${tx - 40} ${ry - 8}) rotate(${-30 + Math.sin(f / 3) * 10})`}>
            <rect x={-6} y={-150} width={12} height={130} rx={6} fill={C.saffronDeep} />
            <rect x={-14} y={-24} width={28} height={30} rx={6} fill={C.crust} />
          </g>
          <GroundShadow x={tx + 40} y={FLOOR + 3} rx={50} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={tx + 40} y={FLOOR} pxPerM={150} frame={f} facing={-1} walk={tx < x1 - 10 ? walkPhase(f, 20) : undefined} pose={tx < x1 - 10 ? "stand" : "hips"} expression="happy" look={0.4} />
          {ins > 0 ? (
            <Inset cx={900} cy={330} r={190} at={[x0 + 24, ry - 6]} scale={5} family={S} t={ins}>
              <rect x={x0 - 40} y={ry - 30} width={200} height={60} fill={mixHex(S.sky[1], S.sky[0], 0.5)} />
              <Ruler x0={x0 - 40} x1={x0 + 120} y={ry} color={INK} step={6} slide={(f - ph) * 1.6} w={2} />
              <rect x={x0} y={ry - 1 - thick} width={120} height={thick} fill={C.crust} stroke={C.crustDeep} strokeWidth={0.5} />
            </Inset>
          ) : null}
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-11 + 5-12 · ember: the crust's ochre bands slide away overhead (18 px/f) and the terracotta mantle with taffy
// hatching fills the shaft; Metric OVER 2,800 km (#21). Then the walls ripple and press in (wobble ±15 px) with the strata
// at 14 px/f; pill SOLID · BUT ONLY JUST (#15 #16). MOVER: the strata + the seam leaving; then the wobble.
// ================================================================================================================
const ShotMantle: ShotFC<CL05> = ({ f, len, c }) => {
  const ph = c.solid - c.mantle;
  const scroll = f < ph ? f * 18 : ph * 18 + (f - ph) * 14;
  return (
    <Pop f={f}>
      <Stage theme={E.theme} cam={cameraAt(f, [{ f: 0, x: 900, y: 540, zoom: 1.0 }, { f: len, x: 860, y: 540, zoom: 1.14 }])} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <DeepShaft f={f} F={E} scroll={scroll} depth={-10} pxPerKm={8} hatch="taffy" wobble={0.85 * ez(f, ph, ph + 20)} probe={{ y: 470 + Math.sin(f / 9) * 5 }} shimmer={0.6} seed={3} />
        </Layer>
        <Layer depth={0}>
          <Slab x={140} y={250} value="OVER 2,800" /* #21: 2,886 km minus 5-40 km of crust */ unit="km" size={84} F={E} opacity={ez(f, 20, 34)} />
          <Tag x={120} y={950} text="SOLID · BUT ONLY JUST" F={E} dot={C.mantle} size={32} opacity={ez(f, ph, ph + 10)} />
          <ShaftGauges f={f} F={E} speed={0.25 + 0.15 * clamp01(f / len)} heat={0.55 + 0.1 * clamp01(f / len)} pressure={0.4 + 0.1 * clamp01(f / len)} pull={pullValue(1.0)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-13 · ember close: a block of mantle rock sags and flows into a puddle while a clock whirls beside it (time sped up).
// Pill FLOWS OVER LONG TIMES (#16). MOVER: the clock hand (tip ≈ 8 px/f) + the block's sag (corners ≈ 2 px/f).
// ================================================================================================================
const ShotFlow: ShotFC<CL05> = ({ f, len }) => {
  const s = ez(f, 0, len);
  const x0 = 260 - 120 * s;
  const x1 = 760 + 120 * s;
  const top = 360 + 230 * s;
  const base = 780;
  const sag = 60 * s;
  const d = `M${x0 + 30} ${top + sag * 0.4} Q ${(x0 + x1) / 2} ${top - 20 + sag} ${x1 - 30} ${top + sag * 0.4} Q ${x1 + 40 * s} ${top + 120} ${x1 + 60 * s} ${base} L${x0 - 60 * s} ${base} Q ${x0 - 40 * s} ${top + 120} ${x0 + 30} ${top + sag * 0.4} Z`;
  return (
    <Pop f={f}>
      <Stage theme={E.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.02, panY: 0.01, frames: len + 40, seed: 9 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <Sky family={E} />
          <Bloom x={520} y={1000} r={700} color={E.light} core={0} strength={0.5} />
        </Layer>
        <Layer depth={1}>
          <rect x={-400} y={base} width={2800} height={600} fill={E.near} />
          <path d={d} fill={C.mantle} stroke={C.mantleDeep} strokeWidth={8} />
          {Array.from({ length: 6 }, (_, i) => {
            const y = top + 50 + i * ((base - top - 60) / 6);
            return <path key={i} d={`M${x0 + 10} ${y} Q ${(x0 + x1) / 2} ${y + 30 * s + Math.sin(f / 10 + i) * 8} ${x1 - 10} ${y}`} stroke={C.mantleDeep} strokeWidth={6} fill="none" opacity={0.8} />;
          })}
          <ClockFace x={1180} y={430} r={200} minutes={f * 0.7} ring={(f * 0.7) / 60 - Math.floor((f * 0.7) / 60)} family={E} f={f} ringColor={C.outer} />
          <Embers frame={f} x0={-100} x1={1500} y={1100} n={30} color={E.light} seed={5} />
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={950} text="FLOWS OVER LONG TIMES" F={E} dot={C.outer} size={32} opacity={ez(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-14 · petrol, the Kola rig: a teal-suited crew Tick heaves on the cable while Tick holds the rock core coming out of
// the hole; it bends like putty. Pill MORE LIKE PLASTIC THAN ROCK (#16). MOVER: the core extruding (8 px/f) and bending.
// ================================================================================================================
const ShotPutty: ShotFC<CL05> = ({ f, len }) => {
  const gy = 800;
  const L = Math.min(420, f * 8);
  const bend = 0.9 * ez(f, 20, len);
  const hx = 640;
  const pts: string[] = [];
  for (let i = 0; i <= 10; i++) {
    const u = i / 10;
    const a = bend * u * u * 1.4;
    pts.push(`${i ? "L" : "M"}${(hx + Math.sin(a) * L * u * 0.8).toFixed(1)} ${(gy - Math.cos(a) * L * u).toFixed(1)}`);
  }
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.1, panX: 0.02, panY: 0.01, frames: len + 30, seed: 10 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <Sky family={P} />
          <Stars frame={f} n={70} w={1920} h={600} color={P.text} seed={9} size={2.2} twinkle={0.7} />
        </Layer>
        <Layer depth={1}>
          <rect x={-600} y={gy} width={3200} height={800} fill={mixHex(C.crustDeep, P.near, 0.4)} />
          <rect x={-600} y={gy - 8} width={3200} height={14} fill={mixHex(C.crust, CREAM, 0.25)} />
          <Rig x={hx} y={gy} h={520} f={f} cableTo={gy - L} turn={-1} />
          <ellipse cx={hx} cy={gy + 4} rx={70} ry={16} fill={P.shadow} />
          <path d={pts.join(" ")} stroke={C.mantle} strokeWidth={70} fill="none" strokeLinecap="round" />
          <path d={pts.join(" ")} stroke={C.crust} strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.6} />
          <GroundShadow x={880} y={gy + 3} rx={50} color={P.shadow} opacity={0.4} blur={8} />
          <Tick x={880} y={gy} pxPerM={150} frame={f} facing={-1} pose="hold" expression="surprised" look={0.6} tilt={-6 * bend} />
          <GroundShadow x={330} y={gy + 3} rx={50} color={P.shadow} opacity={0.4} blur={8} />
          <Tick x={330} y={gy} pxPerM={150} frame={f} facing={1} pose="heave" expression="determined" color={C.teal} seed={4} tilt={-8 + Math.sin(f / 5) * 3} />
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={950} text="MORE LIKE PLASTIC THAN ROCK" F={P} dot={C.mantle} size={32} opacity={ez(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-15 · STUDIO: Tick draws the two tunnel walls down the cyc with ruler and pencil (16 px/f); the drawn right wall bulges
// out and Tick shoves it back. MOVER: the pencil lines; then the bulge (±40 px) and the push.
// ================================================================================================================
const ShotDrawWall: ShotFC<CL05> = ({ f, len }) => {
  const y0 = 110;
  const y1 = 840;
  const yl = y0 + Math.min(y1 - y0, f * 16);
  const done = (y1 - y0) / 16;
  const bulge = f > done ? 46 * Math.sin(clamp01((f - done) / Math.max(10, len - done)) * Math.PI) : 0;
  const wall = (xa: number, xb: number, b: number) =>
    `M${xa} ${y0} L${xb} ${y0} ` +
    Array.from({ length: 13 }, (_, i) => {
      const y = y0 + ((yl - y0) * i) / 12;
      const u = (y - y0) / (y1 - y0);
      return `L${xb + b * Math.sin(u * Math.PI)} ${y}`;
    }).join(" ") +
    ` L${xa} ${yl} Z`;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.06, panX: -0.02, panY: 0.0, frames: len + 40, seed: 11 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 800} seed={12}>
          <path d={wall(430, 570, 0)} fill={alpha(C.mantle, 0.85)} stroke={INK} strokeWidth={6} />
          <path d={wall(830, 970, bulge)} fill={alpha(C.mantle, 0.85)} stroke={INK} strokeWidth={6} />
          {/* the ruler and pencil at the drawing head */}
          {f < done + 4 ? (
            <g>
              <rect x={975} y={yl - 160} width={24} height={200} rx={4} fill={C.saffron} stroke={INK} strokeWidth={3} />
              <g transform={`translate(${970} ${yl}) rotate(-25)`}>
                <rect x={-8} y={-110} width={16} height={100} fill={C.saffronDeep} />
                <path d="M-8 -10 L8 -10 L0 8 Z" fill={INK} />
              </g>
            </g>
          ) : null}
          <GroundShadow x={1140} y={FLOOR + 3} rx={55} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={1140 - (f > done ? bulge * 0.6 : 0)} y={FLOOR} pxPerM={160} frame={f} facing={-1} pose={f < done ? "hold" : "press"} staff={f < done} expression="determined" look={0.5} tilt={f > done ? -10 : 0} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-16 · back in the ember shaft: the probe falls, strata streaming (16 px/f). MOVER: the strata.
// 5-17 · the walls close in on the probe (6 px/f each side). MOVER: the wall edges + strata.
// ================================================================================================================
const ShotFall: ShotFC<CL05> = ({ f, len }) => (
  <Stage theme={E.theme} cam={cameraAt(f, [{ f: 0, x: 900, y: 520, zoom: 1.08 }, { f: len, x: 900, y: 540, zoom: 1.0 }])} vignette={0.3} grain={0.5}>
    <Layer depth={1}>
      <DeepShaft f={f} F={E} scroll={f * 16} depth={1200} hatch="taffy" probe={{ y: 470 + Math.sin(f / 9) * 5 }} shimmer={0.5} seed={5} />
    </Layer>
    <Layer depth={0}>
      <ShaftGauges f={f} F={E} speed={0.42 + 0.06 * clamp01(f / len)} heat={0.7} pressure={0.55} pull={pullValue(1.02)} />
    </Layer>
  </Stage>
);
const ShotClose: ShotFC<CL05> = ({ f, len }) => {
  const gap = Math.max(170, 380 - f * 12);
  return (
    <Pop f={f}>
      <Stage theme={E.theme} cam={cameraAt(f, [{ f: 0, x: 820, y: 520, zoom: 1.12 }, { f: len, x: 700, y: 500, zoom: 1.3 }])} vignette={0.35} grain={0.5}>
        <Layer depth={1}>
          <DeepShaft f={f} F={E} scroll={f * 12} depth={1400} hatch="taffy" gap={gap} wobble={0.6} probe={{ y: 470, size: 130, tilt: Math.sin(f / 3) * 4 }} seed={6} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-18 · ember: Tick on a ledge argues with the rock face; speech bubbles pop alternately (every 8 f) carrying zig-zags.
// MOVER: bubbles popping (scale 0 → 1, 180 px) + Tick pointing.
// ================================================================================================================
const ShotArgue: ShotFC<CL05> = ({ f, len }) => {
  const gy = 820;
  return (
    <Pop f={f}>
      <Stage theme={E.theme} shotFrame={f} drift={{ zoom: 1.1, panX: 0.02, panY: 0.01, frames: len + 30, seed: 12 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <Sky family={E} />
          <Bloom x={900} y={1100} r={700} color={E.light} core={0} strength={0.5} />
        </Layer>
        <Layer depth={1}>
          <path d={`M900 -100 Q 1000 300 960 ${gy} L2400 ${gy} L2400 -100 Z`} fill={C.mantle} />
          {Array.from({ length: 7 }, (_, i) => (
            <path key={i} d={`M${980 + i * 10} ${80 + i * 110} Q 1300 ${60 + i * 110 + Math.sin(f / 8 + i) * 12} 1700 ${100 + i * 110}`} stroke={C.mantleDeep} strokeWidth={8} fill="none" />
          ))}
          <rect x={-400} y={gy} width={2800} height={500} fill={E.near} />
          <GroundShadow x={420} y={gy + 3} rx={50} color={E.shadow} opacity={0.45} blur={8} />
          <Tick x={420} y={gy} pxPerM={160} frame={f} facing={1} pose={Math.floor(f / 16) % 2 ? "point" : "shrug"} expression="worried" look={0.7} />
          {Array.from({ length: 6 }, (_, i) => {
            const t0 = 2 + i * 8;
            const k = ez(f, t0, t0 + 6) * (1 - ez(f, t0 + 20, t0 + 26));
            if (k <= 0) return null;
            const left = i % 2 === 0;
            const x = left ? 560 + (i % 3) * 30 : 880 - (i % 3) * 30;
            const y = 300 + (i % 3) * 70;
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(${k})`}>
                <rect x={-110} y={-70} width={220} height={130} rx={50} fill={left ? CREAM : C.outer} stroke={INK} strokeWidth={6} />
                <path d={`M${left ? -40 : 40} 56 L${left ? -70 : 70} 110 L${left ? -10 : 10} 58 Z`} fill={left ? CREAM : C.outer} stroke={INK} strokeWidth={6} />
                <path d="M-70 0 L-40 -30 L-10 20 L20 -30 L50 20 L70 -10" stroke={left ? C.vermilion : INK} strokeWidth={10} fill="none" strokeLinejoin="round" />
              </g>
            );
          })}
          <Embers frame={f} x0={-100} x1={1900} y={1100} n={24} color={E.light} seed={7} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-19 + 5-20 + 5-21 · STUDIO: the tunnel as one ruler (12,742 km wide). A bracket draws over the top-half mantle (20
// px/f), Metric ≈ 2,900 km (#15); the second bracket draws under the far-side mantle and the two slide together (18
// px/f); a fill wipes nearly half the ruler (14 px/f) while a Counter rolls to 45 % (#23b). MOVER: brackets, slide, fill.
// ================================================================================================================
const ShotBrackets: ShotFC<CL05> = ({ f, len, c }) => {
  const p2 = c.far - c.reach;
  const p3 = c.half - c.reach;
  const x0 = 160;
  const x1 = 1600;
  const L = x1 - x0;
  const km = (d: number) => x0 + (d / 12742) * L; // #13
  const m0 = km(35);
  const m1 = km(2886); // #13 #21
  const n0 = km(12742 - 2886);
  const n1 = km(12742 - 35);
  const ry = 600;
  const b1 = clamp01((f * 20) / (m1 - m0));
  const b2 = clamp01(((f - p2) * 24) / (n1 - n0));
  const slide = ez(f, p2 + 14, p2 + 14 + (n0 - m1) / 18);
  const dx = -(n0 - m1) * slide;
  const fill = clamp01(((f - p3) * 14) / (L * 0.45));
  const zones = [
    [x0, m0, C.crust],
    [m0, m1, C.mantle],
    [m1, km(6371 - 1250), C.outer],
    [km(6371 - 1250), km(6371 + 1250), C.inner],
    [km(6371 + 1250), n0, C.outer],
    [n0, n1, C.mantle],
    [n1, x1, C.crust],
  ] as const;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 520, zoom: 1.08 }, { f: p3, x: 900, y: 540, zoom: 1.02 }, { f: len, x: 880, y: 540, zoom: 0.96 }])} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 900}
          seed={13}
          hud={
            <g>
              <Slab x={140} y={230} value="≈ 2,900" /* #15 */ unit="km" size={90} F={S} opacity={ez(f, 8, 18) * (1 - ez(f, p3 - 6, p3 + 4))} />
              {f >= p3 - 4 ? (
                <g opacity={ez(f, p3 - 4, p3 + 6)}>
                  <rect x={110} y={140} width={330} height={120} rx={18} fill={alpha(S.shadow, 0.72)} />
                  <text x={140} y={232} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 90, fill: CREAM }}>≈</text>
                  <Counter x={210} y={232} value={45 * clamp01(fill / 1)} /* #23b: 44.7-45.2 % */ max={45} size={90} color={CREAM} unit="%" align="start" />
                </g>
              ) : null}
              <Tag x={120} y={950} text="NEARLY HALF THE TRIP" F={S} dot={C.mantle} size={32} opacity={ez(f, p3 + 6, p3 + 16)} />
            </g>
          }
        >
          {/* the tunnel as a strip, layer colours to scale (#12 #15) */}
          {zones.map(([a, b, col], i) => (
            <rect key={i} x={a} y={ry} width={Math.max(4, b - a)} height={60} fill={col} opacity={0.45} />
          ))}
          <Ruler x0={x0} x1={x1} y={ry} color={INK} step={36} />
          {fill > 0 ? <rect x={x0} y={ry + 6} width={L * 0.45 * fill} height={48} rx={8} fill={C.mantle} /> : null}
          <Bracket x0={m0} x1={m1} y={ry - 70} k={b1} color={C.mantleDeep} up={false} />
          <g transform={`translate(${dx} 0)`}>
            <Bracket x0={n0} x1={n1} y={ry + 130} k={b2} color={C.mantleDeep} up />
          </g>
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-22 + 5-23 · ember: a powder-blue frost sheet over the rock face cracks and slides away (10 px/f), the glow beneath;
// then the camera pushes in on the hatching flowing (5 px/f) and the glow breathing (#16). MOVER: the sheet; the flow.
// ================================================================================================================
const ShotFrost: ShotFC<CL05> = ({ f, len, c }) => {
  const ph = c.isnot - c.frozen;
  const crack = clamp01(f / 10);
  const go = Math.max(0, f - 12);
  const cam = cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: ph, x: 920, y: 540, zoom: 1.08 }, { f: len, x: 760, y: 560, zoom: 1.5 }]);
  return (
    <Pop f={f}>
      <Stage theme={E.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <rect x={-400} y={-400} width={2800} height={1900} fill={C.mantleDeep} />
          <Bloom x={760} y={560} r={700} color={E.light} core={0} strength={0.55 + 0.15 * Math.sin(f / 9)} />
          {Array.from({ length: 12 }, (_, i) => {
            const y = -100 + i * 110;
            const off = f * 5;
            return (
              <path
                key={i}
                d={Array.from({ length: 14 }, (_, k) => `${k ? "L" : "M"}${-300 + k * 170} ${y + Math.sin((k * 170 + off) / 200 + i) * 34}`).join(" ")}
                stroke={i % 3 ? C.mantle : E.light}
                strokeWidth={i % 3 ? 14 : 6}
                fill="none"
                opacity={i % 3 ? 0.9 : 0.6}
              />
            );
          })}
          {/* the frost sheet */}
          <g transform={`translate(${go * 10} ${go * 6}) rotate(${go * 0.4} 760 540)`} opacity={1 - clamp01((go - 40) / 20)}>
            <path d="M80 80 L1360 120 L1300 980 L120 960 Z" fill={alpha(C.frost, 0.94)} stroke={C.ice} strokeWidth={8} />
            <path d={`M700 120 L${700 - 80 * crack} ${360 * crack + 120} L${760 + 60 * crack} ${600 * crack + 120} L${680} ${860 * crack + 120}`} stroke={E.shadow} strokeWidth={8} fill="none" />
            <path d={`M300 500 L${300 + 400 * crack} ${500 + 40 * crack}`} stroke={E.shadow} strokeWidth={6} fill="none" />
          </g>
          <Embers frame={f} x0={-100} x1={1900} y={1100} n={30} color={E.light} seed={9} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-24 + 5-25 · ember shaft: the probe accelerates (strata 14 → 30 px/f), the SPEED needle sweeps (3°/f), the PULL needle
// holds high (pill PULL STILL HIGH). Then a clock plate slides in: its ring fills to the 19 MIN end plate (#10, F11).
// MOVER: strata + the needle; then the ring (10 px/f).
// ================================================================================================================
const ShotAccel: ShotFC<CL05> = ({ f, len, c }) => {
  const ph = c.nineteen - c.fast;
  const v = Math.min(30, 14 + f * 0.12);
  const scroll = f * 14 + 0.06 * f * f;
  const sp = 0.3 + 0.55 * ez(f, 0, ph + 60);
  const ring = ez(f, ph + 6, ph + 50);
  return (
    <Pop f={f}>
      <Stage theme={E.theme} cam={cameraAt(f, [{ f: 0, x: 880, y: 540, zoom: 1.04 }, { f: len, x: 860, y: 540, zoom: 1.12 }])} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <DeepShaft f={f} F={E} scroll={scroll} depth={1500} pxPerKm={6} hatch="taffy" probe={{ y: 470 + Math.sin(f / 7) * 4 }} shimmer={0.5} seed={8} />
          {/* speed streaks in the slot, faster as it accelerates */}
          <g transform="rotate(-90 640 540)">
            <Streamers f={f} n={8} x0={-200} x1={1300} y0={500} y1={780} len={200} width={5} speed={v} color={E.light} opacity={0.4} seed={11} />
          </g>
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={950} text="PULL STILL HIGH" F={E} dot={C.vermilion} size={32} opacity={ez(f, 6, 16) * (1 - ez(f, ph, ph + 8))} />
          <ShaftGauges f={f} F={E} speed={sp} heat={0.8} pressure={0.7} pull={pullValue(1.06)} />
          {f >= ph ? (
            <g transform={`translate(${-(1 - ez(f, ph, ph + 14)) * 700} 0)`}>
              <rect x={90} y={150} width={520} height={600} rx={30} fill={alpha(STUDIO.sky[0], 0.94)} />
              <ClockFace x={350} y={380} r={150} minutes={19 * ring} ring={(19 / 60) * ring} plate="19 MIN" /* #10: 1,145.88 s */ family={STUDIO} f={f} ringColor={C.vermilion} />
              <text x={350} y={720} textAnchor="middle" style={{ fontFamily: "'Anton', sans-serif", fontSize: 34, letterSpacing: 4, fill: INK }}>
                TO THE CENTRE
              </text>
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-26 · ember: a bright saffron-gold seam rises into view from below (12 px/f), the outer core's gold beneath it; a
// Counter rolls to 2,886 km (#13; F8); then the camera zooms through into the glowing line (ZT out). MOVER: the seam.
// ================================================================================================================
const ShotBoundary: ShotFC<CL05> = ({ f, len }) => {
  const ppk = 2;
  const stop = 640;
  const scroll = Math.min(stop, f * 12) + Math.max(0, f - stop / 12) * 3;
  const depth = 2886 - 320; // #13: the seam starts 640 px below the anchor
  const seamY = 540 + (2886 - depth) * ppk - scroll;
  const zt = ez(f, len - 26, len);
  const cam = cameraAt(f, [{ f: 0, x: 900, y: 540, zoom: 1.0 }, { f: len - 26, x: 800, y: 560, zoom: 1.1 }]);
  const camZ = { x: cam.x + (640 - cam.x) * zt, y: cam.y + (seamY - cam.y) * zt, zoom: cam.zoom * (1 + 5 * zt * zt) };
  return (
    <Pop f={f}>
      <Stage theme={E.theme} cam={camZ} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <DeepShaft f={f} F={E} scroll={scroll} depth={depth} pxPerKm={ppk} hatch="taffy" probe={{ y: 400 }} shimmer={0.6} seed={10} />
          <Bloom x={640} y={seamY} r={500} color={C.saffronCore} core={10} coreColor="#FFFFFF" strength={0.6} squash={0.35} />
        </Layer>
        <Layer depth={0}>
          <CounterSlab x={130} y={240} value={2886} /* #13: 6,371 − 3,485 */ k={ez(f, 6, 60)} unit="km" F={E} size={92} opacity={1 - zt} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================

export const SceneL05: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL05(t);
  const shots: ShotDef<CL05>[] = [
    { from: 0, S: ShotPole, id: "5-01" }, // + 5-02
    { from: c.kola, S: ShotKola, id: "5-03" }, // + 5-04
    { from: c.humans, S: ShotFlag, id: "5-05" },
    { from: c.dial, S: ShotHeatDial, id: "5-06" },
    { from: c.back, S: ShotPullBack, id: "5-07" },
    { from: c.skin, S: ShotSkin, id: "5-08" },
    { from: c.paint, S: ShotPaint, id: "5-09" }, // + 5-10
    { from: c.mantle, S: ShotMantle, id: "5-11" }, // + 5-12
    { from: c.flows, S: ShotFlow, id: "5-13" },
    { from: c.plastic, S: ShotPutty, id: "5-14" },
    { from: c.drawn, S: ShotDrawWall, id: "5-15" },
    { from: c.drawing, S: ShotFall, id: "5-16" },
    { from: c.real, S: ShotClose, id: "5-17" },
    { from: c.argue, S: ShotArgue, id: "5-18" },
    { from: c.reach, S: ShotBrackets, id: "5-19" }, // + 5-20, 5-21
    { from: c.frozen, S: ShotFrost, id: "5-22" }, // + 5-23
    { from: c.fast, S: ShotAccel, id: "5-24" }, // + 5-25
    { from: c.boundary, S: ShotBoundary, id: "5-26" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL05 = (t: SceneTiming): Cue[] => {
  const c = cuesL05(t);
  return [
    { at: 0, file: SFX.wind, vol: 0.18, dur: c.go + 12, fadeIn: 10, fadeOut: 12 },
    { at: c.go + 10, file: SFX.rumble, vol: 0.18, dur: c.kola - c.go, fadeIn: 8, fadeOut: 10 },
    ...cutHit(c.kola),
    ...Array.from({ length: 8 }, (_, i) => ({ at: c.kola + 6 + i * 9, file: SFX.click, vol: 0.06, dur: 6 })),
    ...Array.from({ length: 5 }, (_, i) => ({ at: c.rock + 6 + i * 8, file: SFX.click, vol: 0.06, dur: 6 })),
    ...cutHit(c.humans),
    { at: c.humans + 20, file: SFX.pop, vol: 0.2, dur: 16 },
    ...cutHit(c.dial),
    ...Array.from({ length: 5 }, (_, i) => ({ at: c.dial + 4 + i * 9, file: SFX.click, vol: 0.06, dur: 6 })),
    { at: c.back, file: SFX.swirl, vol: 0.18, dur: 40 },
    ...cutHit(c.skin),
    { at: c.skin + 4, file: SFX.pop, vol: 0.16, dur: 16 },
    ...cutHit(c.paint),
    { at: c.paint + 4, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...Array.from({ length: 5 }, (_, i) => ({ at: c.coat + 4 + i * 7, file: SFX.click, vol: 0.05, dur: 6 })),
    ...cutHit(c.mantle),
    { at: c.mantle, file: SFX.rumble, vol: 0.2, dur: c.flows - c.mantle, fadeIn: 10, fadeOut: 10 },
    ...cutHit(c.flows),
    { at: c.flows + 4, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...cutHit(c.plastic),
    { at: c.plastic + 20, file: SFX.pop, vol: 0.18, dur: 16 },
    ...cutHit(c.drawn),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.drawn + 4 + i * 8, file: SFX.click, vol: 0.05, dur: 6 })),
    { at: c.drawing, file: SFX.rumble, vol: 0.18, dur: c.argue - c.drawing, fadeIn: 8, fadeOut: 8 },
    ...cutHit(c.real),
    ...cutHit(c.argue),
    ...Array.from({ length: 4 }, (_, i) => ({ at: c.argue + 2 + i * 8, file: SFX.pop, vol: 0.14, dur: 12 })),
    ...cutHit(c.reach),
    { at: c.reach + 4, file: SFX.click, vol: 0.14, dur: 10 },
    { at: c.far + 14, file: SFX.swirl, vol: 0.14, dur: 40 },
    { at: c.half + 20, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.frozen),
    { at: c.frozen + 2, file: SFX.debris, vol: 0.26, dur: 70, fadeOut: 20 },
    { at: c.isnot, file: SFX.rumble, vol: 0.16, dur: c.fast - c.isnot, fadeIn: 8, fadeOut: 8 },
    ...cutHit(c.fast),
    { at: c.fast, file: SFX.riser, vol: 0.16, dur: c.nineteen - c.fast, fadeIn: 8, fadeOut: 8 },
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.nineteen + 8 + i * 7, file: SFX.click, vol: 0.05, dur: 6 })),
    ...cutHit(c.boundary),
    { at: t.frames - 30, file: SFX.deepWhoosh, vol: 0.26, dur: 60 },
  ];
};
