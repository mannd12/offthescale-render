// L14 scene l06 "The iron seas" (storyboard §3 "6 ·": shots 6-01…6-43 + ChapterCard 3 (7-00), script lines 44-58, IRON ↔
// STUDIO_SET ↔ void → noon lab → void trend → BlackBeat, Act II). Shot components (hard cuts; continuous rows are phases):
// 6-01…6-03 (the seam; the iron sea; HEAT presses its stop; OUTER CORE · LIQUID) · 6-04 (the faceted inner core below)
// · 6-05+6-06 (squeezed solid: arrows in, flames out) · 6-07+6-08 (the notebook; one kind of wave crosses) · 6-09+6-10
// (the ray fan, the S ray stops; Tick's torch on the locked ball) · 6-11+6-12 (the shadow wedge; the seismograph) ·
// 6-13…6-15 (the ~2,200 km and ~1,250 km spans) · 6-16+6-17 KEY ART II (the probe crosses the iron sea; enters the ball)
// · 6-18+6-19 (6,970 km; 55 %) · 6-20+6-21 (~1/6 of the volume) · 6-22+6-23 (the core stretch lit; most of the trip) ·
// 6-24+6-25 (3.3 million atm; the HEAT needle snaps, the big dial rolls to 6,000 ± 500 °C) · 6-26 (the ± 500 band flares)
// · 6-27+6-28 (33× Kola; gauges 2 and 3 off the scale) · 6-29+6-30 (the ribbons run off; no instrument has been here) ·
// 6-31…6-33 (1 cm²; 3,400 tonnes; 1 kg) · 6-34+6-35 (the seesaw; 3,300,000×) · 6-36+6-37 (the trend chart; the barrier)
// · 6-38+6-39 (two diamonds; ~5,000 K) · 6-40+6-41 (X-rays; the corkboard) · 6-42+6-43 (EXTRAPOLATED; drain to black) ·
// BlackBeat + sting → ChapterCard 3 "The Middle".
// Numbers drawn, each with its sources.md row: ~2,200 km · ~1,250 km · 1,250 km LEFT (#15, F15) · 6,970 km · 55 % · ~1/6
// (#26, F18) · 3.3 MILLION atm and the 3,300,000 odometer · 6,000 ± 500 °C (#17 #25, V4 cleared; via GAUGE) · 33× (#13 #14,
// F18) · 1 cm² · 3,400 TONNES · 1 kg · 3,300,000× (#24) · ~5,000 K (#25). F9/F10: no centre temperature or pressure; HEAT
// and PRESSURE carry numbers only at the inner-core boundary. F16: only the S wave is named. Tick never in the tunnel.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  BlackBeat,
  Bloom,
  Counter,
  Emissive,
  Embers,
  GroundShadow,
  IF2,
  Kicker,
  Layer,
  Motes,
  Sky,
  Stage,
  Stars,
  Tick,
  alpha,
  cameraAt,
  impact,
  mixHex,
  ramp,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { IRON } from "../families";
import { BIG_HEAT_MAX, GAUGE, HeatGauge, L14Gauges, PressureGauge, STOP } from "../L14Gauges";
import { IronFlow, Shimmer, StrataWall } from "../tunnel";
import { CutGlobe, chordPoint, globePoint } from "../cutglobe";
import { DiamondAnvil, HazardBand, Probe, Seesaw, Sparks } from "../props";
import { LayerRings, L14Card } from "../L14Card";
import { ShotDef, ShotFC, actBreakAt, playShots } from "../shots";
import { Cue, SFX, cutHit, sting } from "./cue-types";
import { Arrow, C, CREAM, EMBER, INK, NOON, Pop, STUDIO, Slab, StudioRoom, Tag, VOID, VoidField, clamp01, ez } from "./Cold";
import { Bracket, Ruler } from "./S04";

const FLOOR = 860;
const S = STUDIO;
const V = VOID;
const E = EMBER;
const I = IRON;
const LABEL: React.CSSProperties = { fontFamily: IF2.label, letterSpacing: 4, fill: INK };
const inkLight = (F: typeof V) => ({ plate: alpha(F.light, 0.14), edge: alpha(C.bone, 0.55), ink: C.bone, dim: alpha(C.bone, 0.6) });
const inkDark = (F: typeof V) => ({ plate: alpha(F.shadow, 0.88), edge: alpha(C.bone, 0.35), ink: C.bone, dim: alpha(C.bone, 0.55) });

/** The solid inner core as a faceted gem: lit crescents glide round its facets (`glint` px/f at the rim); `ignite` 0..1
 *  lights the facets one after another; `ring` 0..1 flashes a ring outward. */
const FacetBall: React.FC<{ cx: number; cy: number; R: number; f: number; glint?: number; ignite?: number; ring?: number }> = ({ cx, cy, R, f, glint = 5, ignite = 0, ring = 0 }) => {
  const n = 14;
  const r1 = R * 0.56;
  const sweep = (f * glint) / R;
  const pt = (a: number, r: number) => `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
  const step = (2 * Math.PI) / n;
  const fill = (a: number, idx: number) => {
    const b = 0.5 + 0.5 * Math.cos(a - sweep);
    const lit = idx / (2 * n) < ignite;
    return lit ? mixHex(C.innerCore, "#FFFFFF", 0.4 + 0.3 * b) : mixHex("#D9A850", C.innerCore, b);
  };
  return (
    <g>
      <Bloom x={cx} y={cy} r={R * 2.1} color={C.inner} core={0} strength={0.55 + 0.3 * ignite} />
      {Array.from({ length: n }, (_, i) => {
        const a0 = i * step;
        const a1 = a0 + step;
        const am = a0 + step / 2;
        return (
          <g key={i}>
            <path d={`M${pt(a0 + step / 2, r1)} L${pt(a0, R)} L${pt(a1, R)} Z`} fill={fill(am + 0.3, i * 2)} stroke={alpha("#9C6A16", 0.6)} strokeWidth={3} />
            <path d={`M${pt(a0 - step / 2, r1)} L${pt(a0 + step / 2, r1)} L${pt(a0, R)} Z`} fill={fill(a0, i * 2 + 1)} stroke={alpha("#9C6A16", 0.6)} strokeWidth={3} />
            <path d={`M${cx} ${cy} L${pt(a0 - step / 2, r1)} L${pt(a0 + step / 2, r1)} Z`} fill={fill(a0 + Math.PI, i * 2 + 1)} stroke={alpha("#9C6A16", 0.5)} strokeWidth={3} />
          </g>
        );
      })}
      {ring > 0 && ring < 1 ? <circle cx={cx} cy={cy} r={R + ring * 420} fill="none" stroke={C.saffronCore} strokeWidth={18 * (1 - ring) + 4} opacity={1 - ring} /> : null}
    </g>
  );
};

/** The IRON field: maroon ground lit from below, iron ribbons streaming, big embers, shimmer. */
const IronSea: React.FC<{ f: number; speed?: number; y0?: number; seed?: number }> = ({ f, speed = 14, y0 = -100, seed = 1 }) => (
  <g>
    <Sky family={I} />
    <Bloom x={760} y={1250} r={900} color={I.bounce} core={0} strength={0.55} />
    <IronFlow f={f} x0={-300} x1={2200} y0={y0} y1={1180} n={12} speed={speed} seed={seed} />
    <Shimmer f={f} x={-200} y={0} w={2300} h={1080} rows={8} speed={6} opacity={0.22} width={10} />
  </g>
);

// ================================================================================================================
// cues
// ================================================================================================================
export const cuesL06 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    seam: 0, // 6-01
    iron: p(0, "the iron begins"), // 6-02 (phase)
    liquid: p(0, "The outer core is liquid"), // 6-03 (phase)
    ball: p(0, "Inside, a ball"), // 6-04
    hot: at(1), // 6-05
    squeezes: p(1, "squeezes it"), // 6-06 (phase)
    know: at(2), // 6-07
    kinds: p(2, "Earthquakes send"), // 6-08 (phase)
    stops: p(2, "The other stops"), // 6-09
    nobody: p(2, "Nobody has seen"), // 6-10 (phase)
    shadows: at(3), // 6-11
    read: p(3, "shadows of waves"), // 6-12 (phase)
    stretch: at(4), // 6-13
    solidball: p(4, "The solid ball"), // 6-14 (phase)
    edge: p(4, "from its edge"), // 6-15 (phase)
    sea: at(5), // 6-16 (key art II at line 5 @ 0.3)
    enters: p(5, "and then it enters"), // 6-17 (phase)
    halves: at(6), // 6-18
    sixtynine: p(6, "about sixty-nine hundred"),
    twelve: p(6, "of its twelve thousand"), // 6-19 (phase)
    sixth: p(6, "Yet the core holds"), // 6-20
    volume: p(6, "of the planet's volume"), // 6-21 (phase)
    most: at(7), // 6-22
    spent: p(7, "is spent"), // 6-23 (phase)
    pressure: at(8), // 6-24
    temp: p(8, "And the temperature"), // 6-25 (phase)
    give: p(8, "give or take"), // 6-26
    kola: at(9), // 6-27
    second: p(9, "The second and third"), // 6-28 (phase)
    heatfirst: p(9, "Heat first"), // 6-29
    beyond: p(9, "and then the probe"), // 6-30 (phase)
    mean: at(10), // 6-31
    tonnes: p(10, "About three thousand"), // 6-32 (phase)
    surface: p(10, "At the surface"), // 6-33 (phase)
    times: at(11), // 6-34
    million: p(11, "million times"), // 6-35 (phase)
    how: at(12), // 6-36
    notby: p(12, "Not by going"), // 6-37 (phase)
    diamonds: at(13), // 6-38
    lasers: p(13, "heat it with lasers"), // 6-39 (phase)
    xray: p(13, "and watch with X-rays"), // 6-40
    whether: p(13, "whether it is solid"), // 6-41 (phase)
    trend: at(14), // 6-42
    last: end(14),
    brk: actBreakAt(t).start, // 6-43 drains into BB + card 7-00
    end: t.frames,
  };
};
export type CL06 = ReturnType<typeof cuesL06>;

// ================================================================================================================
// 6-01…6-03 · IRON: the terracotta rock ends at a bright seam rising past the probe; below it a sea of liquid iron in
// two golds. The camera pushes in: the probe lit from below, the HEAT pointer pressing its stop with sparks (pinned).
// Then a pull-back as the pill OUTER CORE · LIQUID rides in (#15). MOVER: the seam + iron swirls (14 px/f) + the push.
// ================================================================================================================
const ShotSeam: ShotFC<CL06> = ({ f, len, c }) => {
  const p2 = c.iron - c.seam;
  const p3 = c.liquid - c.seam;
  const scroll = -220 + f * 14;
  const seamY = 540 - scroll; // depth 2,886 at the anchor (#13)
  const py = 470;
  const lit = clamp01((py - seamY + 80) / 120);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 540, zoom: 1.0 },
    { f: p2, x: 880, y: 520, zoom: 1.06 },
    { f: p3, x: 760, y: 500, zoom: 1.32 },
    { f: len, x: 900, y: 540, zoom: 1.04 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={I.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <rect x={-400} y={-400} width={2800} height={1900} fill={I.sky[0]} />
          <StrataWall f={f} family={I} depth={2886} pxPerKm={2} scroll={scroll} cx={640} gap={320} x0={-700} x1={2300} hatch="iron" lamp={{ y: py }} />
          <clipPath id="l06sea">
            <rect x={-400} y={seamY + 6} width={2800} height={2000} />
          </clipPath>
          <g clipPath="url(#l06sea)">
            <IronFlow f={f} x0={-300} x1={2200} y0={-200} y1={1200} n={12} speed={14} seed={2} />
          </g>
          <Bloom x={640} y={Math.max(-100, seamY)} r={560} color={C.saffronCore} core={0} strength={0.5 + 0.2 * Math.sin(f / 5)} squash={0.3} />
          <Probe x={640} y={py} size={150} f={f} variant="lit" amount={lit} />
          <Embers frame={f} x0={-200} x1={1500} y={1120} n={36} color={I.light} seed={3} size={4} />
        </Layer>
        <Layer depth={0}>
          <Kicker x={120} y={130} text="THE CORE BOUNDARY" color={I.text} size={32} />
          <L14Gauges family={I} frame={f} theme="light" heat={{ value: 0.6 + 0.5 * ez(f, 0, p2 + 10), pinned: f >= p2 + 10 }} />
          {f >= p2 + 10 ? <Sparks x={1810} y={380} f={f} dir={1} rate={1} size={120} /> : null}
          <Tag x={120} y={950} text="OUTER CORE · LIQUID" F={I} dot={C.outer} size={32} opacity={ez(f, p3, p3 + 12)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-04 · far below, the solid inner core: a bright faceted ball, still, lit crescents gliding over its facets; iron
// ribbons stream across the foreground; the camera pushes. Pill SOLID INNER CORE (#15). MOVER: ribbons + glints + push.
// ================================================================================================================
const ShotBall: ShotFC<CL06> = ({ f, len }) => (
  <Pop f={f}>
    <Stage theme={I.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len, x: 760, y: 640, zoom: 1.35 }])} vignette={0.3} grain={0.5}>
      <Layer depth={0.5}>
        <IronSea f={f} speed={10} seed={4} />
      </Layer>
      <Layer depth={1}>
        <FacetBall cx={760} cy={700} R={240} f={f} glint={5} />
        <IronFlow f={f + 40} x0={-300} x1={2200} y0={-100} y1={1180} n={5} speed={16} seed={9} glow={false} />
        <Embers frame={f} x0={-200} x1={1700} y={1120} n={30} color={I.light} seed={5} size={4} />
      </Layer>
      <Layer depth={0}>
        <Tag x={120} y={950} text="SOLID INNER CORE" F={I} dot={C.inner} size={32} opacity={ez(f, 4, 14)} />
      </Layer>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 6-05 + 6-06 · the inner ball with weight-arrows pressing in from all sides (6 px/f) and heat wisps rising out; then a
// tug of war: flame tongues push out, the arrows pulse in (8 px/f), the ball holds. Pill SQUEEZED SOLID (#15).
// MOVER: the arrow ring contracting + flames.
// ================================================================================================================
const ShotSqueeze: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.squeezes - c.hot;
  const g = { cx: 760, cy: 540, R: 190 };
  const tug = f >= ph;
  const sp = tug ? 8 : 6;
  return (
    <Pop f={f}>
      <Stage theme={I.theme} shotFrame={f} drift={{ zoom: 1.1, panX: 0.02, panY: 0.01, frames: len + 40, seed: 3 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.5}>
          <IronSea f={f} speed={8} seed={6} />
        </Layer>
        <Layer depth={1}>
          {/* flames out (flicker), stronger in the tug of war */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2 + 0.26;
            const L = (tug ? 120 : 60) + Math.sin(f / 2.3 + i * 1.7) * 30;
            const r0 = g.R + 10;
            const x0 = g.cx + Math.cos(a) * r0;
            const y0 = g.cy + Math.sin(a) * r0;
            const x1 = g.cx + Math.cos(a) * (r0 + L);
            const y1 = g.cy + Math.sin(a) * (r0 + L);
            const nx = -Math.sin(a) * 26;
            const ny = Math.cos(a) * 26;
            return <path key={i} d={`M${x0 + nx} ${y0 + ny} Q ${(x0 + x1) / 2 + nx * 0.5} ${(y0 + y1) / 2 + ny * 0.5} ${x1} ${y1} Q ${(x0 + x1) / 2 - nx * 0.5} ${(y0 + y1) / 2 - ny * 0.5} ${x0 - nx} ${y0 - ny} Z`} fill={i % 2 ? C.outer : C.saffronCore} opacity={0.85} />;
          })}
          <FacetBall {...g} f={f} glint={6} />
          {/* weight-arrows pressing in from all sides, contracting */}
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const cyc = 170;
            const r = g.R + 150 + cyc - ((f * sp + i * 7) % cyc);
            const x = g.cx + Math.cos(a) * r;
            const y = g.cy + Math.sin(a) * r;
            return <Arrow key={i} x1={x + Math.cos(a) * 150} y1={y + Math.sin(a) * 150} x2={x} y2={y} color={CREAM} w={18} head={44} />;
          })}
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={950} text="SQUEEZED SOLID" F={I} dot={C.inner} size={32} opacity={ez(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-07 + 6-08 · STUDIO: Tick opens a slim notebook (the cover turns, 24 px/f): two columns, LIQUID and SOLID. Then two
// wave arrows run at the LIQUID column (16 px/f): the wavy one crosses, the jagged one stops at its edge and fades.
// Kicker HOW WE KNOW, pill ONE KIND CROSSES (#15; F16: neither wave is named here). MOVER: the cover; the arrows.
// ================================================================================================================
const ShotNotebook: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.kinds - c.know;
  const turn = ez(f, 2, 26);
  const nb = { x: 280, y: 170, w: 940, h: 600 };
  const spine = nb.x + nb.w / 2;
  const colL = { x: nb.x + 60, w: 360 };
  const g = f - ph;
  const wavyX = colL.x - 260 + Math.max(0, g) * 16;
  const jagX = Math.min(colL.x, colL.x - 260 + Math.max(0, g) * 16);
  const jagFade = 1 - ez(g, (260 / 16) + 4, (260 / 16) + 16);
  const wave = (x1: number, y: number, jag: boolean) => {
    const x0 = x1 - 300;
    const pts: string[] = [];
    for (let k = 0; k <= 30; k++) {
      const x = x0 + (k * 300) / 30;
      const yy = jag ? y + (k % 2 ? -26 : 26) : y + Math.sin((x - f * 6) / 24) * 22;
      pts.push(`${k ? "L" : "M"}${x.toFixed(1)} ${yy.toFixed(1)}`);
    }
    return pts.join(" ");
  };
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.01, frames: len + 40, seed: 4 }} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 1000}
          seed={14}
          hud={
            <g>
              <Kicker x={120} y={110} text="HOW WE KNOW" color={INK} size={30} />
              <Tag x={120} y={950} text="ONE KIND CROSSES" F={S} dot={C.teal} size={32} opacity={ez(g, 4, 14)} />
            </g>
          }
        >
          <rect x={nb.x + 14} y={nb.y + 18} width={nb.w} height={nb.h} rx={18} fill={alpha(S.shadow, 0.35)} />
          <rect x={nb.x} y={nb.y} width={nb.w} height={nb.h} rx={18} fill={CREAM} stroke={INK} strokeWidth={6} />
          <line x1={spine} y1={nb.y} x2={spine} y2={nb.y + nb.h} stroke={INK} strokeWidth={5} />
          <rect x={colL.x} y={nb.y + 110} width={colL.w} height={nb.h - 160} rx={14} fill={alpha(C.outer, 0.55)} />
          <rect x={spine + 50} y={nb.y + 110} width={colL.w} height={nb.h - 160} rx={14} fill={alpha(C.inner, 0.8)} />
          <text x={colL.x + colL.w / 2} y={nb.y + 80} textAnchor="middle" style={{ ...LABEL, fontSize: 46 }}>LIQUID</text>
          <text x={spine + 50 + colL.w / 2} y={nb.y + 80} textAnchor="middle" style={{ ...LABEL, fontSize: 46 }}>SOLID</text>
          {/* the cover turning over the spine */}
          {turn < 1 ? (
            <g transform={`translate(${spine} 0) scale(${(1 - 2 * turn).toFixed(3)} 1) translate(${-spine} 0)`}>
              <rect x={spine} y={nb.y - 6} width={nb.w / 2 + 6} height={nb.h + 12} rx={18} fill={turn < 0.5 ? C.teal : mixHex(C.teal, CREAM, 0.5)} stroke={INK} strokeWidth={6} />
            </g>
          ) : null}
          {g >= 0 ? (
            <g>
              <path d={wave(wavyX, nb.y + 250, false)} stroke={C.teal} strokeWidth={12} fill="none" strokeLinecap="round" />
              <path d={`M${wavyX} ${nb.y + 222} L${wavyX + 40} ${nb.y + 250} L${wavyX} ${nb.y + 278} Z`} fill={C.teal} />
              <g opacity={jagFade}>
                <path d={wave(jagX, nb.y + 420, true)} stroke={C.saffronDeep} strokeWidth={12} fill="none" strokeLinejoin="round" />
                {jagX >= colL.x ? <circle cx={colL.x} cy={nb.y + 420} r={30 * (1 - jagFade) + 14} fill="none" stroke={C.saffron} strokeWidth={6} /> : null}
              </g>
            </g>
          ) : null}
          <GroundShadow x={1430} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={1430} y={FLOOR} pxPerM={160} frame={f} facing={-1} pose={f < 26 ? "hold" : "press"} staff={f >= 26} expression="thinking" look={0.5} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-09 + 6-10 · void globe: a quake star at the top pole and a fan of rays racing through the layers (12 px/f); the rays
// that meet the outer core stop there with a flash. Pill S WAVE: STOPPED (#15, F16). Then Tick, small at the pole,
// shines a torch at the locked inner ball (beam sweeping 6 px/f, lock swinging). MOVER: the rays; the beam.
// ================================================================================================================
const G9 = { cx: 760, cy: 580, R: 400 };
const ShotRays: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.nobody - c.stops;
  const rays = clamp01(f / 70);
  const [qx, qy] = globePoint(G9, -90);
  const ri = (G9.R * 1250) / 6371;
  const beam = ph + 4 <= f ? Math.sin((f - ph) / 10) * 0.25 : 0;
  return (
    <Pop f={f}>
      <Stage theme={V.theme} shotFrame={f} drift={{ zoom: 1.08, panX: -0.02, panY: 0.01, frames: len + 40, seed: 5 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <VoidField f={f} {...G9} seed={6} />
        </Layer>
        <Layer depth={1}>
          <CutGlobe {...G9} f={f} family={V} rot={f * 0.6} rays={rays} />
          {/* the quake star */}
          <path d={Array.from({ length: 16 }, (_, k) => `${k ? "L" : "M"}${qx + Math.cos((k * Math.PI) / 8) * (k % 2 ? 14 : 40 + Math.sin(f / 2) * 6)} ${qy + Math.sin((k * Math.PI) / 8) * (k % 2 ? 14 : 40 + Math.sin(f / 2) * 6)}`).join(" ") + " Z"} fill={C.saffronCore} stroke={C.saffron} strokeWidth={4} />
          {f >= ph ? (
            <g opacity={ez(f, ph, ph + 8)}>
              <path d={`M${qx + 40} ${qy - 70} L${G9.cx - 70 + beam * 300} ${G9.cy - 40} L${G9.cx + 70 + beam * 300} ${G9.cy + 40} Z`} fill={alpha(C.saffronCore, 0.35)} />
              <g transform={`rotate(${Math.sin(f / 6) * 14} ${G9.cx} ${G9.cy - ri * 0.5})`}>
                <rect x={G9.cx - 34} y={G9.cy - 20} width={68} height={56} rx={10} fill={INK} />
                <path d={`M${G9.cx - 22} ${G9.cy - 20} L${G9.cx - 22} ${G9.cy - 42} A22 22 0 0 1 ${G9.cx + 22} ${G9.cy - 42} L${G9.cx + 22} ${G9.cy - 20}`} stroke={INK} strokeWidth={10} fill="none" />
              </g>
              <Tick x={qx + 70} y={qy - 4} pxPerM={80} frame={f} facing={-1} pose="hold" expression="thinking" look={-0.4} headTilt={-12} />
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={950} text="S WAVE: STOPPED" F={V} dot={C.saffron} size={32} opacity={ez(f, 30, 42)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-11 + 6-12 · void globe: the S-wave "shadow" on the far side sweeps open in teal (10 px/f at the rim); then the camera
// pushes right to Tick on a ledge, reading a seismograph strip through a magnifier (strip 6 px/f, pen jitter).
// MOVER: the wedge sweep; then the strip + the push.
// ================================================================================================================
const ShotShadow: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.read - c.shadows;
  const g = { cx: 700, cy: 540, R: 380 };
  const dt = (Math.asin(3485 / 6371) * 180) / Math.PI; // the tangent to the core from the source (#12)
  const half = Math.min(2 * dt, (f * 10 * 180) / (Math.PI * g.R));
  const [ax, ay] = globePoint(g, 90 - half, 1);
  const [bx, by] = globePoint(g, 90 + half, 1);
  const cam = cameraAt(f, [{ f: 0, x: 860, y: 540, zoom: 1.0 }, { f: ph, x: 900, y: 540, zoom: 1.04 }, { f: Math.min(len, ph + 30), x: 1300, y: 640, zoom: 1.35 }, { f: len + 1, x: 1320, y: 650, zoom: 1.4 }]);
  const strip = { x: 1180, y: 690, w: 560, h: 150 };
  return (
    <Pop f={f}>
      <Stage theme={V.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <VoidField f={f} {...g} seed={7} />
        </Layer>
        <Layer depth={1}>
          <CutGlobe {...g} f={f} family={V} rot={f * 0.6} rays={1} />
          {half > 0.5 ? <path d={`M${g.cx} ${g.cy} L${ax} ${ay} A${g.R} ${g.R} 0 0 1 ${bx} ${by} Z`} fill={alpha(C.teal, 0.55)} stroke={C.ice} strokeWidth={5} /> : null}
          {/* the ledge, the seismograph, Tick */}
          <rect x={1080} y={FLOOR} width={760} height={40} rx={14} fill={C.saffronDeep} />
          <rect x={strip.x} y={strip.y} width={strip.w} height={strip.h} rx={12} fill={CREAM} stroke={INK} strokeWidth={5} />
          <clipPath id="l06strip">
            <rect x={strip.x} y={strip.y} width={strip.w} height={strip.h} rx={12} />
          </clipPath>
          <g clipPath="url(#l06strip)">
            <path d={Array.from({ length: 80 }, (_, k) => {
              const x = strip.x + k * 8 - ((f * 6) % 8);
              const w = k * 8 + Math.floor((f * 6) / 8) * 8;
              const amp = (w % 400) < 120 ? 50 : 10;
              return `${k ? "L" : "M"}${x} ${strip.y + strip.h / 2 + Math.sin(w * 0.9) * amp}`;
            }).join(" ")} stroke={C.vermilion} strokeWidth={4} fill="none" />
          </g>
          <circle cx={strip.x + 200} cy={strip.y + strip.h / 2} r={70} fill={alpha(C.ice, 0.25)} stroke={INK} strokeWidth={10} />
          <line x1={strip.x + 250} y1={strip.y + 125} x2={strip.x + 320} y2={strip.y + 210} stroke={INK} strokeWidth={14} strokeLinecap="round" />
          <Tick x={1520} y={FLOOR} pxPerM={130} frame={f} facing={-1} pose="hold" expression="thinking" look={0.6} headTilt={8} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-13…6-15 · ember: a ruler for the core's radius (3,485 km, #12) over glowing flow lines (10 px/f). A bracket draws over
// the liquid stretch (22 px/f), Metric ~2,200 km (#15); a bright ball pops at the ruler's end with its own short ruler,
// Metric ~1,250 km (#15); then the two spans slide to a common baseline as bars (16 px/f). F15: the 35 km gap is inside
// "about". MOVER: the bracket; the ball growing; the bars.
// ================================================================================================================
const ShotSpans: ShotFC<CL06> = ({ f, len, c }) => {
  const p2 = c.solidball - c.stretch;
  const p3 = c.edge - c.stretch;
  const x0 = 160;
  const x1 = 1380;
  const L = x1 - x0;
  const km = (d: number) => x0 + (d / 3485) * L; // #12 core radius
  const ry = 470;
  const b1 = clamp01((f * 22) / (km(2200) - x0));
  const ballK = ez(f, p2, p2 + 14);
  const r2 = clamp01(((f - p2 - 8) * 16) / (x1 - km(2235)));
  const bars = f - p3;
  return (
    <Pop f={f}>
      <Stage theme={E.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.01, frames: len + 40, seed: 6 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.5}>
          <Sky family={E} />
          <IronFlow f={f} x0={-300} x1={2200} y0={-100} y1={1180} n={8} speed={10} seed={7} glow={false} />
        </Layer>
        <Layer depth={1}>
          <rect x={x0 - 40} y={ry - 110} width={L + 80} height={170} rx={20} fill={alpha(E.shadow, 0.6)} />
          <Ruler x0={x0} x1={x1} y={ry} color={CREAM} step={40} />
          <Bracket x0={x0} x1={km(2200)} y={ry - 70} k={b1} color={C.outer} up={false} />
          {ballK > 0 ? <FacetBall cx={x1} cy={ry} R={70 * ballK} f={f} glint={6} /> : null}
          {r2 > 0 ? <Bracket x0={x1} x1={km(3485 - 1250)} y={ry + 40} k={r2} color={C.inner} up /> : null}
          {bars >= 0 ? (
            <g>
              <rect x={x0} y={700} width={(km(2200) - x0) * clamp01((bars * 16) / (km(2200) - x0))} height={56} rx={12} fill={C.outer} />
              <rect x={x0} y={790} width={(x1 - km(2235)) * clamp01((bars * 16) / (x1 - km(2235)))} height={56} rx={12} fill={C.inner} />
              <line x1={x0} y1={680} x2={x0} y2={870} stroke={CREAM} strokeWidth={6} />
            </g>
          ) : null}
          <Embers frame={f} x0={-100} x1={1700} y={1120} n={26} color={E.light} seed={8} />
        </Layer>
        <Layer depth={0}>
          <Slab x={140} y={240} value="~2,200" /* #15 */ unit="km" size={88} F={E} opacity={ez(f, 10, 20) * (1 - ez(f, p2, p2 + 8))} />
          <Slab x={140} y={240} value="~1,250" /* #15 */ unit="km" size={88} F={E} opacity={ez(f, p2 + 6, p2 + 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-16 + 6-17 · KEY ART II (l14-key-2 at line 5 @ 0.3). The probe crosses the iron sea, lit from below; iron ribbons
// stream past (20 px/f), sparks fly off the probe; the HEAT pointer pinned past its stop at right; the faceted ball
// glows ahead. Then the push: the probe reaches the ball, the facets ignite one after another and a ring flashes. Pill
// 1,250 km LEFT (#15). MOVER: ribbons + sparks + the push; then the ignition sweep (14 px/f) + ring.
// ================================================================================================================
const ShotKeyArt: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.enters - c.sea;
  const ballY = 1180 - 260 * ez(f, 0, ph + 30);
  const py = 420 + 170 * ez(f, ph - 10, ph + 20);
  const touch = ph + 20;
  const ign = clamp01((f - touch) / 30);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: ph, x: 900, y: 560, zoom: 1.08 },
    { f: len, x: 760, y: 700, zoom: 1.4 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={I.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.5}>
          <IronSea f={f} speed={20} seed={10} />
        </Layer>
        <Layer depth={1}>
          <FacetBall cx={720} cy={ballY} R={300} f={f} glint={6} ignite={ign} ring={clamp01((f - touch - 20) / 26)} />
          <IronFlow f={f + 90} x0={-300} x1={2200} y0={-100} y1={1180} n={5} speed={22} seed={12} glow={false} />
          <Probe x={720} y={py} size={170} f={f} variant="lit" amount={0.8 + 0.2 * Math.sin(f / 4)} tilt={Math.sin(f / 7) * 4} />
          <Sparks x={720 + 60} y={py + 10} f={f} dir={1} rate={1.2} size={170} />
          <Sparks x={720 - 60} y={py + 20} f={f + 5} dir={-1} rate={1} size={150} />
          <Embers frame={f} x0={-200} x1={1700} y={1120} n={40} color={I.light} seed={11} size={4.5} />
        </Layer>
        <Layer depth={0}>
          <L14Gauges family={I} frame={f} theme="light" speed={{ value: 0.86, stop: STOP.speed /* #2 */ }} heat={{ value: 1.1, pinned: true }} pressure={{ value: 0.95 }} />
          <Sparks x={1810} y={380} f={f} dir={1} rate={1} size={110} />
          <Tag x={120} y={950} text="1,250 km LEFT" /* #15 */ F={I} dot={C.inner} size={34} opacity={ez(f, ph + 6, ph + 16)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-18 + 6-19 · STUDIO: the tunnel ruler (12,742 km, #13); two gold core stretches slide in from either end (18 px/f)
// and fill just over half of it; Metric 6,970 km (#26). Then a ring chart fills past half while a Counter rolls to 55 %
// (#26); Tick points. MOVER: the stretches sliding; then the ring (12 px/f).
// ================================================================================================================
const ShotCoreShare: ShotFC<CL06> = ({ f, len, c }) => {
  const p69 = c.sixtynine - c.halves;
  const p2 = c.twelve - c.halves;
  const x0 = 160;
  const x1 = 1700;
  const L = x1 - x0;
  const km = (d: number) => x0 + (d / 12742) * L;
  const ry = 380;
  const half = km(6371) - km(6371 - 3485); // one core stretch, px
  const slideK = clamp01((f * 18) / (km(2886) - x0 + half));
  const lx = x0 - half + (km(2886) - x0 + half) * slideK; // left stretch's left edge
  const rx = x1 - (x1 - km(6371 + 3485)) * slideK; // right stretch's right edge
  const ring = ez(f, p2, p2 + 40);
  const rr = 160;
  const rc = { x: 720, y: 690 };
  const RL = 2 * Math.PI * rr;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.05, panX: -0.02, panY: 0.01, frames: len + 40, seed: 7 }} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 1100}
          seed={15}
          hud={
            <g>
              <Slab x={140} y={200} value="6,970" /* #26: 2 × 3,485 */ unit="km" size={88} F={S} opacity={ez(f, p69 - 4, p69 + 8) * (1 - ez(f, p2, p2 + 8))} />
              {f >= p2 ? (
                <g opacity={ez(f, p2 + 2, p2 + 10)}>
                  <rect x={110} y={115} width={650} height={115} rx={18} fill={alpha(S.shadow, 0.72)} />
                  <Counter x={140} y={200} value={55 * ring} /* #26: 54.7 % */ max={55} size={88} color={CREAM} unit="% OF THE TUNNEL" align="start" />
                </g>
              ) : null}
            </g>
          }
        >
          <rect x={x0} y={ry} width={L} height={56} fill={alpha(C.mantle, 0.35)} />
          <rect x={lx} y={ry} width={half} height={56} fill={C.outer} />
          <rect x={rx - half} y={ry} width={half} height={56} fill={C.outer} />
          <Ruler x0={x0} x1={x1} y={ry} color={INK} step={44} />
          {/* the ring chart */}
          <circle cx={rc.x} cy={rc.y} r={rr} fill="none" stroke={alpha(INK, 0.18)} strokeWidth={50} />
          {ring > 0 ? <circle cx={rc.x} cy={rc.y} r={rr} fill="none" stroke={C.outer} strokeWidth={50} strokeDasharray={`${(RL * 0.547 * ring).toFixed(1)} ${RL + 10}`} transform={`rotate(-90 ${rc.x} ${rc.y})`} /> : null}
          <line x1={rc.x} y1={rc.y + rr - 40} x2={rc.x} y2={rc.y + rr + 40} stroke={INK} strokeWidth={4} strokeDasharray="8 6" />
          <GroundShadow x={1240} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={1240} y={FLOOR} pxPerM={160} frame={f} facing={-1} pose={f >= p2 ? "point" : "stand"} expression={f >= p2 ? "proud" : "neutral"} look={0.5} squash={impact(f, p2 + 2, 0.1, 10)} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-20 + 6-21 · STUDIO: the planet's outline with the gold core inside it; the core fills (10 px/f) and a 1/6 pie wedge
// sweeps full beside it; Metric ~1/6 OF THE VOLUME (#26). Then Tick, holding a small gold ball, double-takes while a bar
// the core's width stretches along the planet's diameter ruler (20 px/f). MOVER: the fill + wedge; then the bar.
// ================================================================================================================
const ShotVolume: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.volume - c.sixth;
  const g = { cx: 600, cy: 440, R: 320 };
  const rc = g.R * (3485 / 6371); // #12
  const fill = clamp01((f * 10) / (2 * rc));
  const pie = ez(f, 10, 40);
  const pc = { x: 1180, y: 330, r: 130 };
  const a1 = -90 + 60 * pie;
  const bar = clamp01(((f - ph) * 20) / (2 * rc));
  const ry = 840;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.0, frames: len + 40, seed: 8 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 1200} seed={16} hud={<Slab x={1010} y={600} value="~1/6" /* #26: 0.547³ = 0.164 */ unit="OF THE VOLUME" size={84} F={S} opacity={ez(f, 20, 32)} />}>
          <circle cx={g.cx} cy={g.cy} r={g.R} fill={alpha(C.mantle, 0.25)} stroke={INK} strokeWidth={8} strokeDasharray="20 12" />
          <clipPath id="l06core">
            <rect x={g.cx - rc} y={g.cy + rc - 2 * rc * fill} width={2 * rc} height={2 * rc * fill + 2} />
          </clipPath>
          <circle cx={g.cx} cy={g.cy} r={rc} fill={alpha(C.outer, 0.25)} stroke={C.saffronDeep} strokeWidth={6} />
          <g clipPath="url(#l06core)">
            <circle cx={g.cx} cy={g.cy} r={rc} fill={C.outer} />
            <circle cx={g.cx - rc * 0.3} cy={g.cy - rc * 0.3} r={rc * 0.4} fill={C.inner} opacity={0.6} />
          </g>
          <circle cx={pc.x} cy={pc.y} r={pc.r} fill={alpha(C.mantle, 0.35)} stroke={INK} strokeWidth={6} />
          {pie > 0 ? (
            <path d={`M${pc.x} ${pc.y} L${pc.x} ${pc.y - pc.r} A${pc.r} ${pc.r} 0 0 1 ${pc.x + Math.cos((a1 * Math.PI) / 180) * pc.r} ${pc.y + Math.sin((a1 * Math.PI) / 180) * pc.r} Z`} fill={C.outer} stroke={INK} strokeWidth={4} />
          ) : null}
          {/* the diameter ruler and the core-width bar */}
          <Ruler x0={g.cx - g.R} x1={g.cx + g.R} y={ry - 30} color={INK} step={32} />
          {bar > 0 ? <rect x={g.cx - rc} y={ry - 22} width={2 * rc * bar} height={26} rx={8} fill={C.outer} /> : null}
          <GroundShadow x={1470} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={1470} y={FLOOR} pxPerM={160} frame={f} facing={-1} pose="hold" expression={f >= ph + 10 ? "surprised" : "thinking"} look={f >= ph + 6 && f < ph + 14 ? -0.8 : 0.5} squash={impact(f, ph + 10, 0.14, 10)} />
          <circle cx={1420} cy={FLOOR - 172} r={34} fill={C.outer} stroke={C.saffronDeep} strokeWidth={4} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-22 + 6-23 · void globe: a spotlight sweeps along the probe's path (14 px/f); the core stretch lights gold and the rest
// dims. Then the core ring pulses and a path dot travels its length (10 px/f). Pill MOST OF THE TRIP (#26).
// ================================================================================================================
const ShotPath: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.spent - c.most;
  const g = { cx: 760, cy: 540, R: 420 };
  const kc = 3485 / 6371;
  const spot = -1 + clamp01((f * 14) / (2 * g.R)) * 2;
  const [sx, sy] = chordPoint(g, -90, 90, spot);
  const dot = f >= ph ? -kc + ((((f - ph) * 10) / g.R) % (2 * kc)) : null;
  const lit = ez(f, 10, 30);
  return (
    <Pop f={f}>
      <Stage theme={V.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.02, panY: 0.01, frames: len + 40, seed: 9 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <VoidField f={f} {...g} seed={8} />
        </Layer>
        <Layer depth={1}>
          <CutGlobe {...g} f={f} family={V} rot={f * 0.6} line={{ to: 1 }} highlight={f >= ph ? { layer: "outer", k: 0.5 + 0.5 * Math.sin((f - ph) / 3) } : null} probe={dot} trail={0.15} />
          <circle cx={g.cx} cy={g.cy} r={g.R + 2} fill={alpha(V.shadow, 0.55 * lit)} />
          <rect x={g.cx - 36} y={g.cy - g.R * kc} width={72} height={2 * g.R * kc} rx={30} fill={alpha(C.saffronCore, 0.55 * lit)} />
          <Emissive d={`M${g.cx} ${g.cy - g.R * kc} L${g.cx} ${g.cy + g.R * kc}`} color={C.outer} core={C.innerCore} width={14} strength={lit} glow={16} />
          <Bloom x={sx} y={sy} r={170} color={C.saffronCore} core={20} coreColor="#FFFFFF" strength={0.7 * (1 - ez(f, 60, 80))} />
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={950} text="MOST OF THE TRIP" F={V} dot={C.outer} size={32} opacity={ez(f, ph, ph + 10)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-24 + 6-25 · void: the PRESSURE manometer, big: its needle sweeps past the stop and the odometer rolls to 3,300,000
// (GAUGE.boundaryP, #17 #25); Metric 3.3 MILLION atm, pill AT THE SOLID BALL'S EDGE (V4 cleared). Then the camera pans to
// HEAT: its pointer snaps off and spins away, the big 0-7,000 dial swaps in and rolls to 6,000 ± 500 °C (#17).
// MOVER: the needle (≈ 17 px/f) + digits; then the pointer flying (20 px/f) + the swap + the roll.
// ================================================================================================================
const ShotNumbers: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.temp - c.pressure;
  const pv = 1.1 * ez(f, 2, 40);
  const roll = ez(f, 6, 56);
  const brk = ramp(f, ph + 4, ph + 26);
  const big = f >= ph + 22;
  const hroll = ez(f, ph + 26, ph + 70);
  const cam = cameraAt(f, [
    { f: 0, x: 640, y: 540, zoom: 1.0 },
    { f: ph - 4, x: 600, y: 520, zoom: 1.08 },
    { f: ph + 14, x: 1200, y: 520, zoom: 1.0 },
    { f: len, x: 1260, y: 520, zoom: 1.12 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={V.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <Sky family={V} />
          <Stars frame={f} n={90} x={-400} w={2800} h={1080} color={V.text} seed={9} size={2.2} twinkle={0.7} />
          <Bloom x={1000} y={900} r={700} color={C.inner} core={0} strength={0.35} />
        </Layer>
        <Layer depth={1}>
          <g transform="translate(140 300) scale(2.3)">
            <PressureGauge x={0} y={0} s={{ value: pv, pinned: pv >= 1.08, readout: GAUGE.boundaryP /* #17 #25 */, roll }} f={f} ink={inkLight(V)} />
          </g>
          <g transform="translate(1000 300) scale(2.3)">
            <HeatGauge x={0} y={0} s={big ? { value: (GAUGE.boundaryT / BIG_HEAT_MAX) * hroll, big: true, readout: GAUGE.boundaryT /* #17 */, tol: GAUGE.tol /* #17 */, roll: hroll } : { value: 1.1, pinned: true, broken: brk }} f={f} ink={inkLight(V)} />
          </g>
          {big ? <circle cx={1000 + 170 * 2.3} cy={300 + 112 * 2.3} r={260 + 200 * (1 - ez(f, ph + 22, ph + 34))} fill="none" stroke={C.saffronCore} strokeWidth={10} opacity={1 - ez(f, ph + 22, ph + 34)} /> : null}
        </Layer>
        <Layer depth={0}>
          <Slab x={140} y={200} value="3.3 MILLION" /* #17 #25 */ unit="atm" size={84} F={V} opacity={ez(f, 30, 42) * (1 - ez(f, ph, ph + 8))} />
          <Tag x={120} y={950} text="AT THE SOLID BALL'S EDGE" F={V} dot={C.inner} size={32} opacity={ez(f, 8, 18) * (1 - ez(f, ph, ph + 8))} />
          <Slab x={140} y={200} value="6,000 ± 500" /* #17 */ unit="°C" size={84} F={V} opacity={ez(f, ph + 50, ph + 62)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-26 · void close: the big HEAT dial; the ± 500 band flares outward (80 → 160 px, 5 px/f), the needle wobbles at 6,000
// (ticks only, no numerals); Tick shields its eyes. Pill LAB DATA · EXTRAPOLATED (#17 #25, V4). MOVER: the flare + wobble.
// ================================================================================================================
const ShotFlare: ShotFC<CL06> = ({ f, len }) => {
  const d = { x: 1000, y: 560, r: 300 };
  const a0 = 135;
  const sweep = 270;
  const ang = (v: number) => ((a0 + (v / BIG_HEAT_MAX) * sweep) * Math.PI) / 180;
  const flare = 80 + 80 * ez(f, 2, 18) + Math.sin(f / 3) * 10;
  const lo = GAUGE.boundaryT - GAUGE.tol; // #17
  const hi = GAUGE.boundaryT + GAUGE.tol;
  const band = (rr: number) => `M${d.x + Math.cos(ang(lo)) * rr} ${d.y + Math.sin(ang(lo)) * rr} A${rr} ${rr} 0 0 1 ${d.x + Math.cos(ang(hi)) * rr} ${d.y + Math.sin(ang(hi)) * rr}`;
  const na = ang(GAUGE.boundaryT) + Math.sin(f / 1.6) * 0.09;
  return (
    <Pop f={f}>
      <Stage theme={V.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 1000, y: 520, zoom: 1.12 }])} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <Sky family={V} />
          <Bloom x={d.x} y={d.y} r={700} color={C.saffron} core={0} strength={0.45} />
        </Layer>
        <Layer depth={1}>
          <circle cx={d.x} cy={d.y} r={d.r + 30} fill={alpha(V.light, 0.12)} stroke={alpha(C.bone, 0.5)} strokeWidth={4} />
          <path d={`M${d.x + Math.cos(ang(0)) * d.r} ${d.y + Math.sin(ang(0)) * d.r} A${d.r} ${d.r} 0 1 1 ${d.x + Math.cos(ang(BIG_HEAT_MAX)) * d.r} ${d.y + Math.sin(ang(BIG_HEAT_MAX)) * d.r}`} stroke={alpha(C.bone, 0.6)} strokeWidth={10} fill="none" />
          {Array.from({ length: 15 }, (_, i) => {
            const a = ang((i / 14) * BIG_HEAT_MAX);
            return <line key={i} x1={d.x + Math.cos(a) * (d.r - 10)} y1={d.y + Math.sin(a) * (d.r - 10)} x2={d.x + Math.cos(a) * (d.r + 18)} y2={d.y + Math.sin(a) * (d.r + 18)} stroke={C.bone} strokeWidth={5} />;
          })}
          <path d={band(d.r - 40)} stroke={C.saffron} strokeWidth={flare} fill="none" opacity={0.85} />
          <path d={band(d.r - 40)} stroke={C.saffronCore} strokeWidth={flare * 0.3} fill="none" />
          <line x1={d.x} y1={d.y} x2={d.x + Math.cos(na) * (d.r - 30)} y2={d.y + Math.sin(na) * (d.r - 30)} stroke={C.vermilion} strokeWidth={16} strokeLinecap="round" />
          <circle cx={d.x} cy={d.y} r={28} fill={C.vermilion} />
          <rect x={-400} y={FLOOR} width={1000} height={400} fill={V.near} />
          <GroundShadow x={340} y={FLOOR + 3} rx={60} color={V.shadow} opacity={0.5} blur={8} />
          <Tick x={340} y={FLOOR} pxPerM={160} frame={f} facing={1} pose="shield" expression="surprised" look={0.5} tilt={-6 * ez(f, 0, 10)} />
          <Embers frame={f} x0={600} x1={1500} y={1100} n={30} color={C.saffronCore} seed={12} />
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={950} text="LAB DATA · EXTRAPOLATED" F={V} dot={C.saffron} size={32} opacity={ez(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-27 + 6-28 · void: one Kola thermometer against a column of 33 that fills up (14 px/f) while a Counter rolls to 33×
// (#13 #14, F18). Then the column slides away and HEAT and PRESSURE slide in, both pinned past their stops, chevrons
// pulsing, under a push. Pill GAUGES 2 AND 3: OFF THE SCALE. MOVER: the stack; then the slide + the push.
// ================================================================================================================
const Therm: React.FC<{ x: number; y: number; w?: number; fill?: number }> = ({ x, y, w = 220, fill = 0.3 }) => (
  <g>
    <rect x={x} y={y - 10} width={w} height={20} rx={10} fill={alpha(CREAM, 0.25)} stroke={C.bone} strokeWidth={2} />
    <rect x={x + 2} y={y - 6} width={(w - 4) * fill} height={12} rx={6} fill={C.saffron} />
    <circle cx={x - 6} cy={y} r={14} fill={C.saffron} stroke={C.bone} strokeWidth={2} />
  </g>
);
const ShotStack: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.second - c.kola;
  const n = Math.min(33, Math.floor((f * 14) / 24)); // #13: 6,000 / 180 = 33
  const k = clamp01((f * 14) / (24 * 33));
  const out = ez(f, ph - 6, ph + 10);
  const cam = cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: ph, x: 960, y: 540, zoom: 1.04 }, { f: len, x: 1040, y: 520, zoom: 1.3 }]);
  return (
    <Pop f={f}>
      <Stage theme={V.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <Sky family={V} />
          <Stars frame={f} n={90} x={-200} w={2400} h={1080} color={V.text} seed={13} size={2.2} twinkle={0.7} />
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(${-out * 1400} 0)`}>
            <Therm x={240} y={880} />
            <text x={350} y={940} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 4, fill: CREAM }}>KOLA</text>
            {Array.from({ length: n }, (_, i) => (
              <Therm key={i} x={760} y={900 - i * 24} w={300} fill={0.3} />
            ))}
            {n < 33 ? <circle cx={760 + 150} cy={900 - n * 24} r={18} fill={C.saffronCore} /> : null}
          </g>
          {f >= ph - 6 ? (
            <g transform={`translate(${(1 - out) * 1400} 0)`}>
              <g transform="translate(600 180) scale(1.7)">
                <HeatGauge x={0} y={0} s={{ value: 1.1, pinned: true }} f={f} ink={inkLight(V)} />
              </g>
              <g transform="translate(600 560) scale(1.7)">
                <PressureGauge x={0} y={0} s={{ value: 1.1, pinned: true }} f={f + 1} ink={inkLight(V)} />
              </g>
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <g opacity={1 - out}>
            <rect x={110} y={140} width={330} height={120} rx={18} fill={alpha(V.shadow, 0.72)} />
            <Counter x={140} y={232} value={33 * k} /* #13 #14 */ max={33} size={92} color={CREAM} unit="×" align="start" />
          </g>
          <Tag x={120} y={950} text="GAUGES 2 AND 3: OFF THE SCALE" F={V} dot={C.vermilion} size={32} opacity={ez(f, ph + 4, ph + 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-29 + 6-30 · void: from the two pinned gauges, their ribbons run off the right edge (24 px/f) while Tick stares after
// them. Then the camera travels with the ribbons to the planet: a lit shell around its surface, the dark spreading
// inside it (16 px/f), the probe's dot passing into the dark. Pill NO INSTRUMENT OF OURS HAS BEEN HERE.
// MOVER: the ribbons; then the camera move + the dark boundary + the dot.
// ================================================================================================================
const ShotBeyond: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.beyond - c.heatfirst;
  const g = { cx: 2700, cy: 540, R: 400 };
  const head = Math.min(1080 + f * 24, g.cx - g.R - 80);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: ph, x: 1060, y: 540, zoom: 1.0 },
    { f: ph + 26, x: g.cx - 60, y: 540, zoom: 1.02 },
    { f: len, x: g.cx - 80, y: 540, zoom: 1.1 },
  ]);
  const gk = Math.max(0, f - ph - 10);
  const darkR = Math.min(g.R - 22, gk * 16);
  const dot = -1 + clamp01(gk / 70) * 1.1;
  return (
    <Pop f={f}>
      <Stage theme={V.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.4}>
          <rect x={-800} y={-400} width={5000} height={1900} fill={V.sky[0]} />
          <Stars frame={f} n={200} x={-400} w={4400} h={1080} color={V.text} seed={14} size={2.2} twinkle={0.7} />
        </Layer>
        <Layer depth={1}>
          {[0, 1].map((i) => {
            const y = 340 + i * 330;
            return (
              <g key={i}>
                <path d={`M1080 ${y} L${head} ${y}`} stroke={i ? C.saffron : C.vermilion} strokeWidth={30} strokeDasharray="70 24" strokeDashoffset={-f * 24} strokeLinecap="round" />
              </g>
            );
          })}
          <g transform="translate(340 160) scale(1.6)">
            <HeatGauge x={0} y={0} s={{ value: 1.1, pinned: true }} f={f} ink={inkLight(V)} />
          </g>
          <g transform="translate(340 490) scale(1.6)">
            <PressureGauge x={0} y={0} s={{ value: 1.1, pinned: true }} f={f + 1} ink={inkLight(V)} />
          </g>
          <rect x={-600} y={FLOOR} width={1500} height={400} fill={V.near} />
          <GroundShadow x={180} y={FLOOR + 3} rx={50} color={V.shadow} opacity={0.5} blur={8} />
          <Tick x={180} y={FLOOR} pxPerM={130} frame={f} facing={1} pose="stand" expression="worried" look={0.9} headTilt={-6} />
          <CutGlobe {...g} f={f} family={V} rot={f * 0.6} line={{ to: dot }} probe={gk > 0 ? dot : null} />
          {darkR > 0 ? <circle cx={g.cx} cy={g.cy} r={darkR} fill={alpha("#020A0E", 0.82)} /> : null}
          <circle cx={g.cx} cy={g.cy} r={g.R - 11} fill="none" stroke={C.saffronCore} strokeWidth={22} opacity={0.75} />
          <Bloom x={g.cx} y={g.cy - g.R} r={200} color={C.saffronCore} core={0} strength={0.4} />
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={950} text="NO INSTRUMENT OF OURS HAS BEEN HERE" F={V} dot={C.saffron} size={30} opacity={ez(f, ph + 20, ph + 32)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-31…6-33 · STUDIO: the PRESSURE face is replaced by a teal one-centimetre tile zooming in (×6 in 20 f), Metric 1 cm²
// (#24). Weights drop on it one after another (40 px/f), the tile squashes, a Counter rolls to 3,400 TONNES (#24); Tick
// shakes its head. Then the camera pushes to a twin tile where a feather-light block bobs on a spring, Metric 1 kg (#24).
// MOVER: the tile zoom; the weights; the push + the bob (±20 px).
// ================================================================================================================
const ShotTile: ShotFC<CL06> = ({ f, len, c }) => {
  const p2 = c.tonnes - c.mean;
  const p3 = c.surface - c.mean;
  const tz = ez(f, 0, 20);
  const ts = 40 + 200 * tz;
  const tile = { x: 560, y: 760 };
  const drops = Math.max(0, Math.floor((f - p2) / 9) + 1);
  const nW = Math.min(8, f >= p2 ? drops : 0);
  const squash = f >= p2 ? Math.min(30, nW * 4) + impact(f, p2 + (nW - 1) * 9 + 12, 10, 8).sy - 1 : 0;
  const tk = ez(f, p2, p2 + 70);
  const cam = cameraAt(f, [{ f: 0, x: 900, y: 540, zoom: 1.0 }, { f: p3, x: 860, y: 520, zoom: 1.04 }, { f: Math.min(len, p3 + 26), x: 1240, y: 560, zoom: 1.15 }, { f: len + 1, x: 1260, y: 560, zoom: 1.2 }]);
  const bob = Math.sin((f - p3) / 4) * 20;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 1300}
          seed={17}
          hud={
            <g>
              <Slab x={140} y={200} value="1 cm²" /* #24 */ size={88} F={S} opacity={ez(f, 10, 20) * (1 - ez(f, p2, p2 + 8))} />
              {f >= p2 ? (
                <g opacity={ez(f, p2 + 2, p2 + 10) * (1 - ez(f, p3, p3 + 8))}>
                  <rect x={110} y={115} width={560} height={115} rx={18} fill={alpha(S.shadow, 0.72)} />
                  <Counter x={140} y={200} value={3400 * tk} /* #24: 3.41 × 10⁶ kgf */ max={3400} size={88} color={CREAM} unit="TONNES" align="start" />
                </g>
              ) : null}
              <Slab x={140} y={200} value="1" /* #24 */ unit="kg" size={88} F={S} opacity={ez(f, p3 + 10, p3 + 20)} />
            </g>
          }
        >
          {/* the manometer bezel, its face giving way to the tile */}
          <circle cx={tile.x} cy={tile.y - 130} r={160} fill="none" stroke={INK} strokeWidth={14} opacity={1 - tz} />
          <rect x={tile.x - ts / 2} y={tile.y - ts * 0.3 - squash * 0.3} width={ts} height={ts * 0.3 + squash * 0.3} rx={10} fill={C.teal} stroke={INK} strokeWidth={6} transform={`translate(0 ${-squash * 0.2})`} />
          {Array.from({ length: nW }, (_, i) => {
            const land = p2 + i * 9 + 12;
            const yTop = tile.y - ts * 0.3 - 70 * (i + 1);
            const y = f < land ? yTop - (land - f) * 40 : yTop;
            return (
              <g key={i}>
                <path d={`M${tile.x - 90} ${y + 70} L${tile.x - 70} ${y} L${tile.x + 70} ${y} L${tile.x + 90} ${y + 70} Z`} fill={i % 2 ? INK : mixHex(INK, C.teal, 0.3)} stroke={CREAM} strokeWidth={3} />
                <rect x={tile.x - 24} y={y - 22} width={48} height={26} rx={10} fill="none" stroke={INK} strokeWidth={8} />
              </g>
            );
          })}
          {/* the twin tile at the surface: one feather-light block on a spring */}
          <rect x={1160} y={tile.y - 72} width={240} height={72} rx={10} fill={C.teal} stroke={INK} strokeWidth={6} />
          <path d={Array.from({ length: 13 }, (_, i) => `${i ? "L" : "M"}${1280 + (i % 2 ? 22 : -22) * (i > 0 && i < 12 ? 1 : 0)} ${tile.y - 72 - (i * (120 + bob)) / 12}`).join(" ")} stroke={INK} strokeWidth={5} fill="none" />
          <rect x={1230} y={tile.y - 72 - 120 - bob - 70} width={100} height={70} rx={14} fill={C.ice} stroke={INK} strokeWidth={5} />
          <GroundShadow x={900} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={900} y={FLOOR} pxPerM={160} frame={f} facing={-1} pose={f >= p2 ? "shrug" : "stand"} expression="surprised" look={0.6} headTilt={f >= p2 ? Math.sin(f / 4) * 12 : 0} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-34 + 6-35 · STUDIO: a seesaw: the pile slams down, the 1 kg block flies up (3°/f); then a Counter rolls to
// 3,300,000× (#24). MOVER: the beam + the flying block; then the digits.
// ================================================================================================================
const ShotSeesaw: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.million - c.times;
  const tilt = -22 * ez(f, 4, 12);
  const fly = Math.max(0, f - 10);
  const k = ez(f, ph, Math.min(len - 4, ph + 40));
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.02, panY: 0.01, frames: len + 30, seed: 10 }} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 1400}
          seed={18}
          hud={
            f >= ph ? (
              <g opacity={ez(f, ph, ph + 8)}>
                <rect x={110} y={115} width={640} height={115} rx={18} fill={alpha(S.shadow, 0.72)} />
                <Counter x={140} y={200} value={3300000 * k} /* #24: 3.3 × 10⁶ */ max={3300000} size={84} color={CREAM} unit="×" align="start" />
              </g>
            ) : null
          }
        >
          <Seesaw
            x={760}
            y={FLOOR}
            len={900}
            tilt={tilt}
            left={
              <g>
                {[0, 1, 2, 3].map((i) => (
                  <path key={i} d={`M-80 ${-i * 56} L-62 ${-56 - i * 56} L62 ${-56 - i * 56} L80 ${-i * 56} Z`} fill={i % 2 ? INK : mixHex(INK, C.teal, 0.3)} stroke={CREAM} strokeWidth={3} />
                ))}
              </g>
            }
            right={fly > 0 ? null : <rect x={-40} y={-60} width={80} height={60} rx={12} fill={C.ice} stroke={INK} strokeWidth={5} />}
          />
          {fly > 0 ? <rect x={1150 + fly * 4} y={FLOOR - 300 - fly * 30 + fly * fly * 0.4} width={80} height={60} rx={12} fill={C.ice} stroke={INK} strokeWidth={5} transform={`rotate(${fly * 12} ${1190 + fly * 4} ${FLOOR - 270 - fly * 30 + fly * fly * 0.4})`} /> : null}
          {f > 6 && f < 30 ? <circle cx={400} cy={FLOOR - 20} r={(f - 6) * 14} fill="none" stroke={C.saffron} strokeWidth={8} opacity={1 - (f - 6) / 24} /> : null}
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-36 + 6-37 · STUDIO: Tick scratches its head at a trend chart, a dotted line's head running off its edge (14 px/f).
// Then Tick shakes its head and points as a striped barrier slams down at the core's depth on the chart.
// MOVER: the dotted head; then the barrier drop (impact) + Tick.
// ================================================================================================================
const ShotTrend: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.notby - c.how;
  const ch = { x: 260, y: 160, w: 900, h: 560 };
  const head = ch.x + 60 + Math.min(1100, f * 14);
  const drop = ez(f, ph + 2, ph + 10);
  const bx = ch.x + ch.w * 0.62;
  const pts = (x1: number) => {
    const out: string[] = [];
    for (let x = ch.x + 60; x <= x1; x += 18) out.push(`${x === ch.x + 60 ? "M" : "L"}${x} ${ch.y + ch.h - 60 - (x - ch.x - 60) * 0.42}`);
    return out.join(" ");
  };
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.07, panX: 0.02, panY: 0.01, frames: len + 40, seed: 11 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 1500} seed={19}>
          <rect x={ch.x} y={ch.y} width={ch.w} height={ch.h} rx={20} fill={CREAM} stroke={INK} strokeWidth={6} />
          <line x1={ch.x + 60} y1={ch.y + 40} x2={ch.x + 60} y2={ch.y + ch.h - 60} stroke={INK} strokeWidth={6} />
          <line x1={ch.x + 60} y1={ch.y + ch.h - 60} x2={ch.x + ch.w - 30} y2={ch.y + ch.h - 60} stroke={INK} strokeWidth={6} />
          <clipPath id="l06trend">
            <rect x={ch.x} y={ch.y - 200} width={ch.w + 900} height={ch.h + 200} />
          </clipPath>
          <g clipPath="url(#l06trend)">
            <path d={pts(head)} stroke={C.saffronDeep} strokeWidth={8} strokeDasharray="4 14" strokeLinecap="round" fill="none" />
          </g>
          <circle cx={Math.min(head, ch.x + ch.w + 800)} cy={ch.y + ch.h - 60 - (Math.min(head, ch.x + ch.w + 800) - ch.x - 60) * 0.42} r={14} fill={C.saffron} />
          {f >= ph ? (
            <g transform={`translate(0 ${-(1 - drop) * 700})`}>
              <HazardBand x={bx - 20} y={ch.y - 40} w={40} h={ch.h - 20} f={f} speed={3} />
            </g>
          ) : null}
          <GroundShadow x={1380} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={1380} y={FLOOR} pxPerM={160} frame={f} facing={-1} pose={f < ph ? "think" : "point"} expression={f < ph ? "thinking" : "determined"} look={0.5} headTilt={f < ph ? Math.sin(f / 5) * 6 : Math.sin(f / 2.5) * 14 * (1 - ez(f, ph + 10, ph + 30))} squash={impact(f, ph + 10, 0.1, 10)} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-38 + 6-39 · noon lab: two cut diamonds close on a speck of iron, glints sweeping their facets; pill TWO DIAMONDS
// (#25). Then lasers heat the speck white-gold, the beams flaring, a Counter rolling to ~5,000 K (#25). MOVER: the glint
// sweep (20 px/f) + diamonds closing + the push; then the beams and the bloom.
// ================================================================================================================
const LabRoom: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <g>
    <Sky family={NOON} stops={["#8FD2E6", "#CFEFF0", "#F3E9C8"]} w={3800} />
    <rect x={1250} y={120} width={420} height={500} rx={20} fill={alpha("#FFF3C8", 0.85)} stroke={NOON.shadow} strokeWidth={10} />
    <line x1={1460} y1={120} x2={1460} y2={620} stroke={NOON.shadow} strokeWidth={8} />
    <Bloom x={1460} y={300} r={420} color={NOON.light} core={30} coreColor="#FFFFFF" strength={0.7} />
    <rect x={-400} y={780} width={3800} height={500} fill={mixHex(C.crust, NOON.near, 0.25)} />
    <rect x={-400} y={770} width={3800} height={20} fill={C.crustDeep} />
    <circle cx={700} cy={470} r={290} fill={alpha(C.tealDeep, 0.8)} />
    {children}
    <Motes frame={f} n={20} x={-100} y={60} w={2100} h={860} color={alpha("#FFFFFF", 0.85)} seed={21} size={5} drift={40} />
  </g>
);
const ShotAnvil: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.lasers - c.diamonds;
  const sq = ez(f, 0, ph);
  const laser = ez(f, ph, ph + 14);
  const k = ez(f, ph + 6, ph + 50);
  const gx = 700 + ((f * 20) % 600) - 300;
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 820, y: 480, zoom: 1.25 }])} vignette={0.1} grain={0.5}>
        <Layer depth={1}>
          <LabRoom f={f}>
            <DiamondAnvil x={700} y={470} s={260} squeeze={sq} laser={laser} f={f} />
            <rect x={gx - 30} y={150} width={60} height={640} fill={alpha("#FFFFFF", 0.5)} transform={`skewX(-20)`} opacity={1 - laser * 0.5} />
            {laser > 0 ? (
              <g>
                <Emissive d={`M-200 650 L700 470`} color={C.vermilion} core="#FFF0E0" width={10 + 6 * Math.sin(f / 2)} strength={laser} glow={16} />
                <Emissive d={`M1600 ${260} L700 470`} color={C.vermilion} core="#FFF0E0" width={10 + 6 * Math.cos(f / 2)} strength={laser} glow={16} />
                <Bloom x={700} y={470} r={60 + 140 * k} color={C.saffronCore} core={10 + 20 * k} coreColor="#FFFFFF" strength={0.6 + 0.4 * k} />
              </g>
            ) : null}
          </LabRoom>
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={950} text="TWO DIAMONDS" F={NOON} dot={C.teal} size={32} opacity={ez(f, 4, 14) * (1 - ez(f, ph, ph + 8))} />
          {f >= ph ? (
            <g opacity={ez(f, ph + 2, ph + 10)}>
              <rect x={110} y={115} width={420} height={115} rx={18} fill={alpha(NOON.shadow, 0.72)} />
              <text x={140} y={200} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 88, fill: CREAM }}>~</text>
              <Counter x={196} y={200} value={5000 * k} /* #25: "around 5000 K" */ max={5000} size={88} color={CREAM} unit="K" align="start" />
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-40 + 6-41 · noon lab: an X-ray fan sweeps across the speck onto a detector where diffraction rings pulse outward
// (6 px/f); pill SOLID OR LIQUID? (#25). Then the camera pushes right: Tick pins four sketches to a corkboard, pins
// dropping (24 px/f), strings drawing between them. MOVER: the fan + rings; then the pins.
// ================================================================================================================
const ShotXray: ShotFC<CL06> = ({ f, len, c }) => {
  const ph = c.whether - c.xray;
  const fan = Math.sin(f / 8) * 0.3;
  const det = { x: 1240, y: 470 };
  const cam = cameraAt(f, [{ f: 0, x: 900, y: 540, zoom: 1.0 }, { f: ph, x: 960, y: 540, zoom: 1.02 }, { f: Math.min(len, ph + 20), x: 1900, y: 520, zoom: 1.05 }, { f: len + 1, x: 1920, y: 520, zoom: 1.1 }]);
  const card = (i: number) => ({ x: 1660 + (i % 2) * 300, y: 260 + Math.floor(i / 2) * 280 });
  const pinAt = (i: number) => ph + 10 + i * 8;
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} cam={cam} vignette={0.1} grain={0.5}>
        <Layer depth={1}>
          <LabRoom f={f}>
            <DiamondAnvil x={700} y={470} s={260} squeeze={1} laser={0.4} f={f} />
            <path d={`M100 ${470 - 20} L700 ${470} L100 ${490}`} fill={alpha(C.teal, 0.5)} />
            <path d={`M700 470 L${det.x} ${det.y - 200 + fan * 300} L${det.x} ${det.y + 200 + fan * 300} Z`} fill={alpha(C.teal, 0.35)} />
            <rect x={det.x - 20} y={det.y - 240} width={60} height={480} rx={14} fill={INK} />
            {[0, 1, 2, 3].map((i) => {
              const r = ((f * 6 + i * 40) % 160) + 10;
              return <ellipse key={i} cx={det.x + 10} cy={det.y} rx={r * 0.2} ry={r} fill="none" stroke={C.saffronCore} strokeWidth={6} opacity={1 - r / 170} />;
            })}
            {/* the corkboard */}
            <rect x={1580} y={140} width={680} height={600} rx={20} fill={C.crustDeep} stroke={INK} strokeWidth={8} />
            {[0, 1, 2, 3].map((i) => {
              const { x, y } = card(i);
              const t0 = pinAt(i);
              if (f < t0) return null;
              const drop = Math.min(0, -(t0 + 8 - f) * 24);
              return (
                <g key={i} transform={`translate(0 ${drop})`}>
                  <rect x={x} y={y} width={240} height={190} rx={8} fill={CREAM} stroke={INK} strokeWidth={4} transform={`rotate(${(i % 2 ? 3 : -3)} ${x + 120} ${y + 95})`} />
                  {i === 0 ? <path d={`M${x + 70} ${y + 140} L${x + 120} ${y + 50} L${x + 170} ${y + 140} Z`} fill={alpha(C.teal, 0.6)} stroke={INK} strokeWidth={4} /> : null}
                  {i === 1 ? [20, 40, 60].map((r) => <circle key={r} cx={x + 120} cy={y + 95} r={r} fill="none" stroke={INK} strokeWidth={4} />) : null}
                  {i === 2 ? <path d={`M${x + 30} ${y + 160} L${x + 100} ${y + 110} L${x + 150} ${y + 90} L${x + 210} ${y + 40}`} stroke={INK} strokeWidth={5} strokeDasharray="6 8" fill="none" /> : null}
                  {i === 3 ? <circle cx={x + 120} cy={y + 95} r={60} fill={C.inner} stroke={INK} strokeWidth={4} /> : null}
                  <circle cx={x + 120} cy={y + 10} r={14} fill={C.vermilion} />
                </g>
              );
            })}
            {[0, 1, 2].map((i) => {
              const a = card(i);
              const b = card(i + 1);
              const k = clamp01((f - pinAt(i + 1) - 8) / 10);
              return k > 0 ? <line key={i} x1={a.x + 120} y1={a.y + 10} x2={a.x + 120 + (b.x - a.x) * k} y2={a.y + 10 + (b.y - a.y) * k} stroke={C.vermilion} strokeWidth={4} /> : null;
            })}
            <GroundShadow x={2380} y={782} rx={55} color={NOON.shadow} opacity={0.3} blur={8} />
            <Tick x={2380} y={780} pxPerM={150} frame={f} facing={-1} pose={f >= ph ? "press" : "stand"} expression="proud" look={0.5} squash={impact(f, pinAt(3) + 8, 0.1, 10)} />
          </LabRoom>
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={950} text="SOLID OR LIQUID?" F={NOON} dot={C.teal} size={32} opacity={ez(f, 4, 14) * (1 - ez(f, ph + 10, ph + 18))} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-42 + 6-43 · void: lab data dots climb to the right edge of the lab chart; a dotted trend line carries on past it into
// the boundary mark (20 px/f); pill EXTRAPOLATED (#17 #25). Then the line runs off the frame (24 px/f) as the picture
// drains to black → BlackBeat + sting → ChapterCard 3 "The Middle" (7-00), pale-gold rings rising behind the type.
// ================================================================================================================
const ShotExtrap: ShotFC<CL06> = ({ f, len, c }) => {
  const bb = c.brk - c.trend;
  const ch = { x0: 200, x1: 860, y0: 820, y1: 200 };
  const dots = 9;
  const shown = Math.min(dots, Math.floor(f / 3));
  const lineY = (x: number) => ch.y0 - 60 - (x - ch.x0) * 0.62;
  const head = ch.x1 + Math.max(0, f - 24) * 20 + Math.max(0, f - bb + 20) * 4;
  const drain = ez(f, bb - 30, bb);
  const markX = 1360;
  const cam = cameraAt(f, [{ f: 0, x: 860, y: 540, zoom: 1.0 }, { f: bb, x: 1100, y: 470, zoom: 1.08 }]);
  return (
    <Stage theme={V.theme} cam={cam} vignette={0.3} grain={0.5}>
      <Layer depth={0.3}>
        <Sky family={V} />
        <Stars frame={f} n={90} x={-200} w={2400} h={1080} color={V.text} seed={15} size={2.2} twinkle={0.7} />
      </Layer>
      <Layer depth={1}>
        <rect x={ch.x0 - 30} y={ch.y1 - 40} width={ch.x1 - ch.x0 + 60} height={ch.y0 - ch.y1 + 70} rx={20} fill={alpha(V.light, 0.12)} stroke={alpha(C.bone, 0.5)} strokeWidth={3} />
        <line x1={ch.x0} y1={ch.y0} x2={ch.x1} y2={ch.y0} stroke={C.bone} strokeWidth={5} />
        <line x1={ch.x0} y1={ch.y0} x2={ch.x0} y2={ch.y1} stroke={C.bone} strokeWidth={5} />
        {Array.from({ length: shown }, (_, i) => {
          const x = ch.x0 + 40 + i * ((ch.x1 - ch.x0 - 60) / (dots - 1));
          return <circle key={i} cx={x} cy={lineY(x) + Math.sin(i * 2.1) * 18} r={14} fill={C.saffron} stroke={CREAM} strokeWidth={3} />;
        })}
        <path d={`M${ch.x0 + 40} ${lineY(ch.x0 + 40)} L${ch.x1} ${lineY(ch.x1)}`} stroke={C.saffron} strokeWidth={6} />
        {head > ch.x1 ? <path d={`M${ch.x1} ${lineY(ch.x1)} L${head} ${lineY(head)}`} stroke={C.saffronCore} strokeWidth={8} strokeDasharray="4 16" strokeLinecap="round" fill="none" /> : null}
        {head > ch.x1 ? <circle cx={head} cy={lineY(head)} r={14} fill={C.saffron} /> : null}
        <line x1={markX} y1={120} x2={markX} y2={ch.y0} stroke={C.inner} strokeWidth={8} strokeDasharray="20 12" />
        <circle cx={markX} cy={lineY(markX)} r={30 + (head > markX ? 10 * Math.sin(f / 3) : 0)} fill="none" stroke={C.inner} strokeWidth={6} opacity={head > markX ? 1 : 0.4} />
      </Layer>
      <Layer depth={0}>
        <Tag x={120} y={950} text="EXTRAPOLATED" F={V} dot={C.saffron} size={32} opacity={ez(f, 26, 36) * (1 - drain)} />
        <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={drain} />
      </Layer>
    </Stage>
  );
};
const Card3: React.FC<{ f: number; len: number }> = ({ f, len }) => {
  const bb = 30;
  const g = f - bb;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {g >= 0 ? (
        <L14Card
          family={V}
          kicker="CHAPTER THREE"
          title="The Middle"
          t={Math.min(0.86, g / Math.max(1, len - bb))}
          frame={g + 200}
          behind={(fr) => <LayerRings f={fr} cx={1560} cy={1150} every={24} speed={7} colors={[C.inner, C.outer, C.innerCore, C.saffron]} />}
        />
      ) : null}
      <BlackBeat t={Math.min(1, f / (bb + 4))} fadeIn={0.1} fadeOut={0.35} />
    </AbsoluteFill>
  );
};
const ShotExtrapAndCard: ShotFC<CL06> = (props) => {
  const { f, c } = props;
  const b = c.brk - c.trend;
  if (f >= b) return <Card3 f={f - b} len={c.end - c.brk} />;
  return <ShotExtrap {...props} />;
};

// ================================================================================================================

export const SceneL06: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL06(t);
  const shots: ShotDef<CL06>[] = [
    { from: 0, S: ShotSeam, id: "6-01" }, // + 6-02, 6-03
    { from: c.ball, S: ShotBall, id: "6-04" },
    { from: c.hot, S: ShotSqueeze, id: "6-05" }, // + 6-06
    { from: c.know, S: ShotNotebook, id: "6-07" }, // + 6-08
    { from: c.stops, S: ShotRays, id: "6-09" }, // + 6-10
    { from: c.shadows, S: ShotShadow, id: "6-11" }, // + 6-12
    { from: c.stretch, S: ShotSpans, id: "6-13" }, // + 6-14, 6-15
    { from: c.sea, S: ShotKeyArt, id: "6-16" }, // + 6-17
    { from: c.halves, S: ShotCoreShare, id: "6-18" }, // + 6-19
    { from: c.sixth, S: ShotVolume, id: "6-20" }, // + 6-21
    { from: c.most, S: ShotPath, id: "6-22" }, // + 6-23
    { from: c.pressure, S: ShotNumbers, id: "6-24" }, // + 6-25
    { from: c.give, S: ShotFlare, id: "6-26" },
    { from: c.kola, S: ShotStack, id: "6-27" }, // + 6-28
    { from: c.heatfirst, S: ShotBeyond, id: "6-29" }, // + 6-30
    { from: c.mean, S: ShotTile, id: "6-31" }, // + 6-32, 6-33
    { from: c.times, S: ShotSeesaw, id: "6-34" }, // + 6-35
    { from: c.how, S: ShotTrend, id: "6-36" }, // + 6-37
    { from: c.diamonds, S: ShotAnvil, id: "6-38" }, // + 6-39
    { from: c.xray, S: ShotXray, id: "6-40" }, // + 6-41
    { from: c.trend, S: ShotExtrapAndCard, id: "6-42" }, // + 6-43, BlackBeat, card 7-00
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL06 = (t: SceneTiming): Cue[] => {
  const c = cuesL06(t);
  const clicks = (at: number, n: number, gap = 8, vol = 0.06) => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    { at: 0, file: SFX.boom, vol: 0.3, dur: 120, fadeOut: 30 },
    { at: c.iron, file: SFX.rumble, vol: 0.2, dur: c.ball - c.iron, fadeIn: 10, fadeOut: 10 },
    { at: c.liquid, file: SFX.swirl, vol: 0.16, dur: 40 },
    ...cutHit(c.ball),
    { at: c.ball + 6, file: SFX.chime, vol: 0.22, dur: 70 },
    ...cutHit(c.hot),
    { at: c.hot, file: SFX.rumble, vol: 0.2, dur: c.know - c.hot, fadeIn: 8, fadeOut: 8 },
    { at: c.squeezes + 4, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.know),
    { at: c.know + 6, file: SFX.click, vol: 0.14, dur: 10 },
    { at: c.kinds, file: SFX.whoosh, vol: 0.18, dur: 40 },
    { at: c.kinds + 22, file: SFX.pop, vol: 0.18, dur: 16 },
    ...cutHit(c.stops),
    ...clicks(c.stops + 4, 8),
    { at: c.nobody + 2, file: SFX.click, vol: 0.14, dur: 10 },
    ...cutHit(c.shadows),
    { at: c.shadows + 2, file: SFX.swirl, vol: 0.16, dur: 40 },
    { at: c.read, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.stretch),
    { at: c.stretch + 4, file: SFX.click, vol: 0.14, dur: 10 },
    { at: c.solidball + 2, file: SFX.popLong, vol: 0.22, dur: 30 },
    { at: c.edge, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...cutHit(c.sea),
    { at: c.sea, file: SFX.rumble, vol: 0.24, dur: c.halves - c.sea, fadeIn: 10, fadeOut: 10 },
    { at: c.enters + 20, file: SFX.chime, vol: 0.26, dur: 80 },
    ...cutHit(c.halves),
    { at: c.halves + 2, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...clicks(c.twelve + 2, 6),
    ...cutHit(c.sixth),
    { at: c.sixth + 4, file: SFX.pop, vol: 0.18, dur: 16 },
    { at: c.volume + 10, file: SFX.pop, vol: 0.16, dur: 16 },
    ...cutHit(c.most),
    { at: c.most + 2, file: SFX.whoosh, vol: 0.18, dur: 40 },
    { at: c.spent, file: SFX.pop, vol: 0.16, dur: 16 },
    ...cutHit(c.pressure),
    ...clicks(c.pressure + 6, 7),
    { at: c.temp + 6, file: SFX.pop, vol: 0.22, dur: 16 },
    ...clicks(c.temp + 26, 6),
    ...cutHit(c.give),
    { at: c.give + 2, file: SFX.chime, vol: 0.22, dur: 70 },
    ...cutHit(c.kola),
    ...clicks(c.kola + 2, 8, 7),
    ...clicks(c.second + 4, 3, 10, 0.12),
    ...cutHit(c.heatfirst),
    { at: c.heatfirst + 2, file: SFX.whoosh, vol: 0.22, dur: 40 },
    { at: c.beyond, file: SFX.deepWhoosh, vol: 0.24, dur: 60 },
    ...cutHit(c.mean),
    { at: c.mean + 6, file: SFX.pop, vol: 0.18, dur: 16 },
    ...Array.from({ length: 8 }, (_, i) => ({ at: c.tonnes + 12 + i * 9, file: SFX.pop, vol: 0.12, dur: 12 })),
    { at: c.surface + 8, file: SFX.pop, vol: 0.16, dur: 16 },
    ...cutHit(c.times),
    { at: c.times + 8, file: SFX.popLong, vol: 0.24, dur: 30 },
    ...clicks(c.million, 6, 5),
    ...cutHit(c.how),
    { at: c.how + 4, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.notby + 10, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...cutHit(c.diamonds),
    { at: c.diamonds + 4, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.lasers, file: SFX.riser, vol: 0.14, dur: c.xray - c.lasers, fadeIn: 6, fadeOut: 6 },
    ...cutHit(c.xray),
    ...clicks(c.xray + 4, 4, 10),
    ...Array.from({ length: 4 }, (_, i) => ({ at: c.whether + 18 + i * 8, file: SFX.pop, vol: 0.14, dur: 12 })),
    ...cutHit(c.trend),
    ...clicks(c.trend + 2, 8, 4),
    ...sting(c.brk),
  ];
};
