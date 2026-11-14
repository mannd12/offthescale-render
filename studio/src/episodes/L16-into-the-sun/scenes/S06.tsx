// L16 scene "l06" (storyboard §3 "6 · The boiling layer", script lines 47-54): the convection zone, the waves, the
// radiative crawl, the eight minutes and the temperature arc. Package C.
// Shot components (hard cuts; PUSH/SLIDE rows are phases): 6-01 (+6-02: the bracket and 200,000 km) · 6-03 (quarter
// cutaway, radius to 0.7, NASA SAYS tag) · 6-04 (bubbles rising) · 6-05 (eyepiece + oatmeal pot) · 6-06 (+6-07: the
// wave rings, then the turning sectors and HELIOSEISMOLOGY) · 6-08 (DATA vs MODEL, within about 1 %) · 6-09 (+6-10,
// 6-11, 6-12: the descent into the radiative zone, the light zigzag, 170,000 years, the unnumbered bars) · 6-13 (about
// 8 min, OUR SUM) · 6-14 (the long bar and the window) · 6-15 (the arc chart falling) · 6-16 (the climb to 2 million).
// Numbers drawn, each with its sources.md row (all from sundata.ts READ): 200,000 km ABOUT (#17) · ABOUT 0.7 OF THE
// RADIUS (#17 #20) · BELOW 2 MILLION °C + NASA SAYS (#17, F14: a quote, not placed at a depth) · 1998 MODEL, WITHIN
// ABOUT 1 % (#20) · A QUARTER OF THE WAY OUT (#18) · 170,000 years + NASA SAYS (#18, F13) · about 8 min + OUR SUM (#1, C)
// · 15 million °C (#10 #19) · 5,500 °C ABOUT (#10 #15) · 2 million °C (#10). Class B (6-12): the other estimates are
// unnumbered bars. F1: Tick stays on the chart rim, a ledge or the studio floor. F5: no face on the Sun.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Headline, IF2, Layer, Motes, Stage, Stars, Tick, alpha, cameraAt, mixHex, rnd, smoothPath, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L16_COLORS, STAR_TINTS, familyOf } from "../families";
import { READ } from "../sundata";
import { ConvCells, Granules, Photon, photonPath } from "../movers16";
import { SunCutaway, SunLimb } from "../sunbody";
import { AboutPill, OurSumPill, SayPill, StateStamp } from "../stamps";
import { Bracket, Planet, Probe, Telescope, Trace, partialPts } from "../props16";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { AtomField, Bubbles, CREAM, FamSky, INK, Ledge, Plate, Pop, RadialField, Rim, RollMetric, StudioSet, Tag, TextPlate, Word, clamp01, ez, lin, mod, path1, photonHead } from "./c-parts";

const C = L16_COLORS;
const D2R = Math.PI / 180;

export const cuesL06 = (t: SceneTiming) => {
  const { at, p, frac } = cueKit(t);
  return {
    goIn: 0, // 6-01
    depth: frac(0, 0.35), // 6-02 phase
    base: p(0, "Its base sits"), // 6-03
    nasa: at(1),
    bubbles: at(2), // 6-04
    scope: p(2, "Through a telescope"), // 6-05
    waves: at(3), // 6-06
    helio: p(3, "The study"), // 6-07 phase
    model: p(3, "One 1998 model"), // 6-08
    within: p(3, "within about one percent"),
    rad: at(4), // 6-09
    crawl: p(4, "Here the energy"), // 6-10 phase
    years: at(5), // 6-11 phase
    differ: p(5, "Other estimates"), // 6-12 phase
    eight: at(6), // 6-13
    window: p(6, "So the sunlight"), // 6-14
    arc: at(7), // 6-15
    fromCore: p(7, "From the core"),
    atSurface: p(7, "at the surface"),
    climb: p(7, "Then it climbs"), // 6-16
    twoMillion: p(7, "to two million"),
    end: t.frames,
  };
};
export type C06 = ReturnType<typeof cuesL06>;

// ===============================================================================================================
// 6-01 + 6-02 · KEY ART (l16-key-3 at f 52). Below the photosphere band, whole-frame rolling cells; the dashed ghost
// probe sinks, the lavender MODEL stamp slams; Tick peers down from a ledge on the chart's rim. Phase 6-02: the camera
// slides down, a bracket spans the layer's depth, 200,000 km + ABOUT. MOVER: ConvCells (arrow loops 13 px/f, blobs
// 14 px/f, the pattern scrolling up 6 px/f as we descend) + the bracket's head (≈ 39 px/f).
// ===============================================================================================================
const ShotGoingIn: ShotFC<C06> = ({ f, len, c }) => {
  const d0 = c.depth - c.goIn;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.0 },
    { f: d0, x: 960, y: 548, zoom: 1.07 },
    { f: len, x: 960, y: 600, zoom: 1.03 },
  ]);
  const F = familyOf("cells");
  const top = 120;
  const base = 985;
  const dr = ez(f, d0 + 2, d0 + 24);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.25} grain={0.5}>
      <Layer depth={1}>
        <ConvCells f={f} x={-300} y={-200} w={2520} h={base + 200} cell={380} speed={13} scroll={6} />
        {/* the photosphere band above the zone (granules boiling), sinking out of view as we go in */}
        <Granules f={f} x={-300} y={-120} w={2520} h={top + 120} size={70} drift={8} colors={[C.tangerine, C.amber, C.whiteGold]} />
        <rect x={-300} y={top - 6} width={2520} height={12} fill={C.whiteGold} opacity={0.7} />
        {/* the zone's base: the honey radiative zone begins (true layer order, no numerals) */}
        <rect x={-300} y={base} width={2520} height={700} fill={C.honey} />
        <rect x={-300} y={base} width={2520} height={10} fill="#4A1D78" opacity={0.6} />
        <Probe x={1330} y={300 + f * 1.6} size={190} f={f} variant="ghost" tilt={90} />
        <Rim x={-400} w={560} />
        <Ledge x={225} y={430} w={170} />
        <Tick x={215} y={430} pxPerM={72} frame={f} facing={1} pose="lean" expression="surprised" look={0.5} />
        <Bloom x={960} y={top + 40} r={700} color={C.whiteGold} strength={0.25} squash={0.25} />
        <Motes frame={f} n={20} x={0} y={0} w={1920} h={1080} color={alpha(C.whiteGold, 0.7)} seed={6} size={3} drift={30} />
        {/* 6-02 · the layer's depth */}
        {f >= d0 ? <Bracket x1={1600} y1={top + 8} x2={1600} y2={base - 8} draw={dr} color={C.whiteGold} tick={22} /> : null}
      </Layer>
      <Layer depth={0}>
        <StateStamp x={1700} y={210} state="model" age={f - 12} size={180} />
        {f >= d0 ? (
          <g opacity={ez(f, d0 + 4, d0 + 12)}>
            <TextPlate x={980} y={470} w={540} h={250} opacity={0.75} />
            <RollMetric x={1010} y={600} value={READ.convDepth.value! /* #17 */} unit="km" k={ez(f, d0 + 6, d0 + 40)} size={96} who="6-02 depth" />
            <AboutPill x={1014} y={668} size={26} appear={ez(f, d0 + 30, d0 + 40)} />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 6-03 · a quarter cutaway in true proportions (SUN_R); the radius line draws from the centre to the 0.7 mark, the
// convection layer highlighted; from line 48 a colour front sweeps down the layer and the BELOW 2 MILLION °C · NASA
// SAYS tag slides on (F14: a quote, not placed at a depth). MOVER: the radius head (≈ 33 px/f), the cutaway's layer
// textures turning (4°/f), the colour front sweeping 16 px/f (loops), the camera pulling back.
// ===============================================================================================================
const ShotBase: ShotFC<C06> = ({ f, len, c }) => {
  const nasa = c.nasa - c.base;
  const cx = 660;
  const cy = 780;
  const r = 580;
  const rad = 0.7 * ez(f, 6, 18);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.12 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  const F = familyOf("cells");
  // the colour front: an arc band sweeping from the surface down to the base, again and again (16 px/f)
  const span = r * 0.3;
  const fr = f >= nasa ? mod((f - nasa) * 16, span) : -1;
  const arc = (rr: number) => `M${cx + Math.cos(-90 * D2R) * rr} ${cy + Math.sin(-90 * D2R) * rr} A${rr} ${rr} 0 0 1 ${cx + rr} ${cy}`;
  const mark = { x: cx + Math.cos(-45 * D2R) * r * 0.7, y: cy + Math.sin(-45 * D2R) * r * 0.7 };
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <RadialField id="l06base" cx={cx} cy={cy} r={1500} stops={[[0, C.magenta], [0.45, "#5B1A78"], [1, "#2A0A42"]]} />
        </Layer>
        <Layer depth={1}>
          <SunCutaway f={f} cx={cx} cy={cy} r={r} variant="quarter" wedge={-90} highlight="convective" rotate={4} radius={{ angle: -45, draw: rad, color: C.saffron }} />
          {fr >= 0 ? (
            <g>
              <path d={arc(r - fr - 6)} fill="none" stroke={mixHex(C.lavender, C.whiteGold, 0.4)} strokeWidth={30} opacity={0.75} strokeLinecap="round" />
              <path d={arc(r - fr - 30)} fill="none" stroke={C.tangerine} strokeWidth={18} opacity={0.55} strokeLinecap="round" />
            </g>
          ) : null}
          {rad >= 0.69 ? (
            <g>
              <line x1={mark.x - 26} y1={mark.y - 26} x2={mark.x + 26} y2={mark.y + 26} stroke={C.saffronCore} strokeWidth={8} strokeLinecap="round" />
              <Bloom x={mark.x} y={mark.y} r={70} color={C.saffronCore} strength={0.7} />
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <Tag x={1290} y={300} text={READ.convBase.text /* #17 #20 */} F={F} size={30} appear={ez(f, 14, 26)} />
          {f >= nasa ? (
            <g>
              <Tag x={1290} y={410} text={READ.convTemp.text /* #17 */} F={F} size={30} appear={ez(f, nasa + 4, nasa + 16)} />
              <SayPill x={1296} y={480} kind="NASA SAYS" size={26} appear={ez(f, nasa + 10, nasa + 22)} />
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-04 · large bubbles of hot plasma rise through the layer and flatten as they reach the photosphere band; the
// camera tilts up. MOVER: big white-gold bubbles rising 14 px/f + ConvCells' arrow loops (12 px/f).
// ===============================================================================================================
const ShotBubbles: ShotFC<C06> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 660, zoom: 1.06 },
    { f: len, x: 960, y: 500, zoom: 1.06 },
  ]);
  const top = 150;
  return (
    <Pop f={f}>
      <Stage theme={familyOf("cells").theme} cam={cam} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <ConvCells f={f} x={-300} y={-200} w={2520} h={1700} cell={340} speed={12} blobs={false} fills={[C.magenta, "#8E2A7E"]} seed={4} />
          <Bubbles f={f} n={8} speed={14} yTop={top} yBottom={1320} x0={-100} x1={2020} seed={5} />
          <Granules f={f} x={-300} y={-260} w={2520} h={top + 260} size={70} drift={8} colors={[C.tangerine, C.amber, C.whiteGold]} />
          <rect x={-300} y={top - 6} width={2520} height={12} fill={C.whiteGold} opacity={0.7} />
          <Motes frame={f} n={16} x={0} y={0} w={1920} h={1200} color={alpha(C.whiteGold, 0.7)} seed={9} size={3} drift={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-05 · a round eyepiece view of boiling granules beside a cutaway pot of oatmeal bubbling; Tick holds up the
// eyepiece, then turns to the spoon. MOVER: granules boiling (drift 9 px/f, pulsing) + pot bubbles rising 14 px/f +
// the spoon stirring.
// ===============================================================================================================
const OatPot: React.FC<{ x: number; y: number; w: number; f: number }> = ({ x, y, w, f }) => {
  const h = w * 0.62;
  const surf = y + 40;
  const bub = Array.from({ length: 9 }, (_, i) => {
    const bx = x - w * 0.38 + (i / 8) * w * 0.76 + (rnd(i * 3) - 0.5) * 30;
    const life = h - 30;
    const u = mod(f * 14 * (0.8 + 0.4 * rnd(i * 5)) + rnd(i * 7) * life, life) / life;
    const by = y + h - 10 - u * life;
    const r = 14 + rnd(i * 11) * 22;
    return { bx, by, r, u };
  });
  const st = Math.sin(f / 7) * 18;
  return (
    <g>
      {/* pot body (cutaway front) */}
      <path d={`M${x - w / 2} ${y} L${x + w / 2} ${y} L${x + w / 2 - 26} ${y + h} Q${x} ${y + h + 26} ${x - w / 2 + 26} ${y + h} Z`} fill="#3A0F58" stroke={INK} strokeWidth={5} />
      <clipPath id="l06pot">
        <path d={`M${x - w / 2 + 14} ${surf} L${x + w / 2 - 14} ${surf} L${x + w / 2 - 36} ${y + h - 10} Q${x} ${y + h + 12} ${x - w / 2 + 36} ${y + h - 10} Z`} />
      </clipPath>
      <g clipPath="url(#l06pot)">
        <rect x={x - w / 2} y={surf} width={w} height={h} fill={C.honey} />
        <rect x={x - w / 2} y={surf + h * 0.45} width={w} height={h} fill="#E08A1E" opacity={0.7} />
        {bub.map((b, i) => (
          <circle key={i} cx={b.bx} cy={b.by} r={b.r} fill={C.whiteGold} stroke="#B2651A" strokeWidth={3} opacity={0.9} />
        ))}
      </g>
      {/* surface domes that swell and pop where the bubbles arrive */}
      {bub.map((b, i) => (b.u > 0.82 ? <ellipse key={"d" + i} cx={b.bx} cy={surf} rx={b.r * (1 + (b.u - 0.82) * 6)} ry={b.r * (b.u - 0.82) * 5} fill={C.whiteGold} stroke="#B2651A" strokeWidth={3} /> : null))}
      <rect x={x - w / 2 - 22} y={y - 14} width={w + 44} height={22} rx={11} fill={C.magenta} stroke={INK} strokeWidth={4} />
      {[-1, 1].map((s) => (
        <rect key={s} x={s < 0 ? x - w / 2 - 70 : x + w / 2 + 10} y={y + 20} width={60} height={22} rx={11} fill={C.magenta} stroke={INK} strokeWidth={4} />
      ))}
      {/* the spoon stirring */}
      <g transform={`rotate(${st.toFixed(1)} ${x + 40} ${surf + 40})`}>
        <rect x={x + 30} y={y - 260} width={20} height={300} rx={10} fill={C.saffron} stroke={INK} strokeWidth={4} />
        <ellipse cx={x + 40} cy={surf + 40} rx={34} ry={22} fill={C.saffron} stroke={INK} strokeWidth={4} />
      </g>
    </g>
  );
};

const ShotOatmeal: ShotFC<C06> = ({ f, len }) => {
  const F = familyOf("glow");
  const ix = 600;
  const iy = 440;
  const ir = 290;
  const turn = f > len * 0.5;
  return (
    <Pop f={f}>
      <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 200, seed: 3 }} vignette={0.25} grain={0.5}>
        <Layer depth={0.05}>
          <FamSky name="glow" />
        </Layer>
        <Layer depth={1}>
          <rect x={-400} y={900} width={2720} height={500} fill="#3A0F58" />
          <rect x={-400} y={900} width={2720} height={10} fill={C.gold} opacity={0.6} />
          {/* the eyepiece view: mottled granules (the telescope's view of the surface) */}
          <clipPath id="l06eye">
            <circle cx={ix} cy={iy} r={ir} />
          </clipPath>
          <circle cx={ix} cy={iy} r={ir + 18} fill={INK} />
          <g clipPath="url(#l06eye)">
            <Granules f={f} x={ix - ir} y={iy - ir} w={ir * 2} h={ir * 2} size={66} drift={9} colors={[C.tangerine, C.amber, C.whiteGold]} />
          </g>
          <circle cx={ix} cy={iy} r={ir} fill="none" stroke={C.saffron} strokeWidth={8} />
          <Telescope x={250} y={790} size={230} f={f} tilt={-40} />
          <line x1={330} y1={700} x2={ix - ir * 0.7} y2={iy + ir * 0.7} stroke={C.saffron} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-f * 3} />
          <OatPot x={1420} y={560} w={560} f={f} />
          <Tick x={1010} y={902} pxPerM={84} frame={f} facing={turn ? 1 : -1} pose="hold" poseTo={turn ? "point" : undefined} poseT={turn ? ez(f, len * 0.5, len * 0.5 + 16) : undefined} expression="happy" staff look={0.3} />
          <Motes frame={f} n={14} x={0} y={0} w={1920} h={900} color={alpha(C.whiteGold, 0.8)} seed={12} size={3} drift={30} />
        </Layer>
        <Layer depth={0}>
          <Tag x={960} y={96} text="like boiling oatmeal" F={F} size={32} align="middle" appear={ez(f, 8, 20)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-06 + 6-07 · Tick lowers a drawn sound wave onto the Sun like a fishing line; the surface rings out. PUSH: the ring
// pattern becomes the turning sector map of the Sun's oscillations, HELIOSEISMOLOGY wipes in. MOVER: rings expanding
// 12 px/f + the wave travelling down the line 18 px/f; then the sectors turning 6°/f (edge ≈ 40 px/f), flipping, and
// the headline wipe (24 px/f).
// ===============================================================================================================
const SectorSun: React.FC<{ cx: number; cy: number; r: number; f: number }> = ({ cx, cy, r, f }) => {
  const rings = 4;
  const secs = 12;
  const flip = Math.cos(f / 6);
  const paths: React.ReactNode[] = [];
  for (let i = 0; i < rings; i++)
    for (let j = 0; j < secs; j++) {
      const r0 = (r * i) / rings;
      const r1 = (r * (i + 1)) / rings;
      const a0 = (j / secs) * 360 * D2R;
      const a1 = ((j + 1) / secs) * 360 * D2R;
      const p = (a: number, rr: number) => `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
      const sign = ((i + j) % 2 ? 1 : -1) * (flip >= 0 ? 1 : -1);
      const k = Math.abs(flip);
      const col = sign > 0 ? mixHex(C.gold, C.whiteGold, k * 0.5) : mixHex(C.violet, "#3A0F58", k * 0.4);
      paths.push(<path key={i + "-" + j} d={`M${p(a0, r0)} L${p(a0, r1)} A${r1} ${r1} 0 0 1 ${p(a1, r1)} L${p(a1, r0)} ${i ? `A${r0} ${r0} 0 0 0 ${p(a0, r0)}` : ""} Z`} fill={col} />);
    }
  return (
    <g>
      <defs>
        <radialGradient id="l06shade">
          <stop offset={0.55} stopColor="#000" stopOpacity={0} />
          <stop offset={1} stopColor="#2A0A42" stopOpacity={0.7} />
        </radialGradient>
      </defs>
      <Bloom x={cx} y={cy} r={r * 1.5} color={C.amber} strength={0.6} />
      <g transform={`rotate(${(f * 6).toFixed(1)} ${cx} ${cy})`}>{paths}</g>
      <circle cx={cx} cy={cy} r={r} fill="url(#l06shade)" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.gold} strokeWidth={8} />
    </g>
  );
};

const ShotWaves: ShotFC<C06> = ({ f, len, c }) => {
  const p2 = c.helio - c.waves;
  const k = ez(f, p2, p2 + 14);
  const contact: Pt = [1150, 455];
  const tip: Pt = [600, 160];
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: p2, x: 980, y: 540, zoom: 1.03 },
    { f: len, x: 1000, y: 540, zoom: 1.08 },
  ]);
  // the sound wave travelling down the line (18 px/f)
  const L = Math.hypot(contact[0] - tip[0], contact[1] - tip[1]);
  const ux = (contact[0] - tip[0]) / L;
  const uy = (contact[1] - tip[1]) / L;
  const wave: Pt[] = Array.from({ length: 61 }, (_, i) => {
    const s = (i / 60) * L;
    const env = Math.sin((i / 60) * Math.PI);
    const a = Math.sin((s - f * 18) / 26) * 22 * env;
    return [tip[0] + ux * s - uy * a, tip[1] + uy * s + ux * a];
  });
  const wipe = Math.max(0, (f - p2 - 6) * 24);
  return (
    <Stage theme={familyOf(k < 0.5 ? "glow" : "cells").theme} cam={cam} vignette={0.25} grain={0.5}>
      <Layer depth={0.05}>
        <FamSky name="glow" />
        {k > 0 ? (
          <g opacity={k}>
            <FamSky name="cells" />
          </g>
        ) : null}
      </Layer>
      {k < 1 ? (
        <Layer depth={1} opacity={1 - k}>
          <g transform={`translate(${contact[0]} ${contact[1]}) scale(${1 + k * 1.2}) translate(${-contact[0]} ${-contact[1]})`}>
            <SunLimb f={f} cx={1150} cy={1210} R={760} granSize={60} drift={6} />
            <clipPath id="l06disc">
              <circle cx={1150} cy={1210} r={760} />
            </clipPath>
            <g clipPath="url(#l06disc)">
              {Array.from({ length: 6 }, (_, i) => {
                const rr = mod(f * 12 + i * 120, 720);
                return <ellipse key={i} cx={contact[0]} cy={contact[1] + rr * 0.18} rx={rr} ry={rr * 0.42} fill="none" stroke={C.whiteGold} strokeWidth={9} opacity={0.85 * (1 - rr / 720)} />;
              })}
            </g>
            <Ledge x={540} y={330} w={200} />
            <line x1={540} y1={330} x2={540} y2={1200} stroke="#3A0F58" strokeWidth={18} />
            <Tick x={530} y={330} pxPerM={74} frame={f} facing={1} pose="hold" expression="happy" staff look={0.4} />
            <path d={smoothPath(wave, 0.5)} fill="none" stroke={C.cyan} strokeWidth={7} strokeLinecap="round" />
            <circle cx={contact[0]} cy={contact[1]} r={12 + 4 * Math.sin(f / 3)} fill={C.cyan} />
          </g>
        </Layer>
      ) : null}
      {k > 0 ? (
        <Layer depth={1} opacity={k}>
          <SectorSun cx={1240} cy={580} r={400} f={f - p2} />
        </Layer>
      ) : null}
      {f >= p2 ? (
        <Layer depth={0}>
          <clipPath id="l06wipe">
            <rect x={90} y={60} width={wipe} height={220} />
          </clipPath>
          <g clipPath="url(#l06wipe)">
            <Headline x={110} y={230} lines={["HELIOSEISMOLOGY"]} size={84} color={CREAM} accent={C.gold} />
          </g>
        </Layer>
      ) : null}
    </Stage>
  );
};

// ===============================================================================================================
// 6-08 · studio plate: DATA (gold, with dots) and MODEL (lavender) curves draw across, the magenta gap band between
// them shrinks; Tick lays a saffron ruler across the gap; WITHIN ABOUT 1 % (no counting numerals: only the table's
// figures appear). MOVER: two drawing heads (≈ 36 px/f) + the gap band shrinking + the ruler sliding in (20 px/f) + a
// bead scanning along the matched curves.
// ===============================================================================================================
const ShotModel: ShotFC<C06> = ({ f, len, c }) => {
  const w1 = c.within - c.model;
  const X0 = 680;
  const X1 = 1630;
  const yOf = (u: number) => 290 + 380 * Math.pow(u, 1.5) - 40 * Math.sin(u * 5);
  const gap = 70 - 64 * ez(f, 46, Math.max(80, w1 + 10));
  const N = 40;
  const data: Pt[] = Array.from({ length: N + 1 }, (_, i) => [X0 + ((X1 - X0) * i) / N, yOf(i / N)]);
  const model: Pt[] = data.map(([x, y], i) => [x, y - gap * (0.4 + 0.6 * Math.sin((i / N) * Math.PI))]);
  const hd = ez(f, 4, 34);
  const hm = ez(f, 12, 42);
  const dp = partialPts(data, hd);
  const mp = partialPts(model, hm);
  const band = hm > 0.05 ? [...mp, ...data.slice(0, mp.length).reverse()] : [];
  const ruler = ez(f, 60, 100);
  const scan = f > 100 ? photonHead(model, mod((f - 100) * 30, 1200)).head : null;
  return (
    <Pop f={f}>
      <Stage theme={familyOf("studio").theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.008, panY: 0, frames: 200, seed: 4 }} vignette={0.2} grain={0.5}>
        <StudioSet f={f} seed={6} />
        <Layer depth={1}>
          <Plate x={600} y={150} w={1200} h={650} />
          {/* axes: words only */}
          <line x1={X0 - 20} y1={760} x2={X1 + 20} y2={760} stroke={alpha(CREAM, 0.7)} strokeWidth={4} />
          <line x1={X0 - 20} y1={220} x2={X0 - 20} y2={760} stroke={alpha(CREAM, 0.7)} strokeWidth={4} />
          <Word x={X1 + 10} y={790} text="toward the surface" size={20} color={alpha(CREAM, 0.85)} align="end" />
          <Word x={X0 - 6} y={210} text="sound speed" size={20} color={alpha(CREAM, 0.85)} />
          {band.length > 2 ? <path d={"M" + band.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L") + " Z"} fill={C.magenta} opacity={0.55} /> : null}
          <Trace pts={data} head={hd} f={f} color={C.gold} width={9} />
          {dp.map((p, i) => (i % 4 === 0 ? <circle key={i} cx={p[0]} cy={p[1]} r={11} fill={C.gold} stroke={INK} strokeWidth={3} /> : null))}
          <Trace pts={model} head={hm} f={f} color={C.lavender} width={8} />
          {hm >= 1 ? <Word x={X1 - 10} y={model[N][1] - 34} text="model" size={24} color={C.lavender} align="end" /> : null}
          {hd >= 1 ? <Word x={X1 - 10} y={data[N][1] + 50} text="data" size={24} color={C.gold} align="end" /> : null}
          {mp.length > 1 && hm < 1 ? <circle cx={mp[mp.length - 1][0]} cy={mp[mp.length - 1][1]} r={10} fill={C.lavender} /> : null}
          {/* Tick's ruler laid across the gap */}
          <g transform={`translate(${(1 - ruler) * 900} 0) rotate(-18 1180 480)`} opacity={ruler > 0 ? 1 : 0}>
            <rect x={940} y={462} width={500} height={38} rx={6} fill={C.saffron} stroke={INK} strokeWidth={4} />
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1={960 + i * 40} y1={462} x2={960 + i * 40} y2={i % 2 ? 476 : 486} stroke={INK} strokeWidth={3} />
            ))}
          </g>
          {scan ? <Bloom x={scan[0]} y={scan[1]} r={60} color={C.whiteGold} strength={0.9} /> : null}
          {scan ? <circle cx={scan[0]} cy={scan[1]} r={12} fill="#FFFFFF" stroke={C.gold} strokeWidth={3} /> : null}
          <Tick x={400} y={902} pxPerM={92} frame={f} facing={1} pose="hold" poseTo="press" poseT={ez(f, 56, 76)} expression="thinking" expressionTo="proud" expressionT={ez(f, w1, w1 + 20)} staff look={0.3} />
        </Layer>
        <Layer depth={0}>
          <Tag x={640} y={108} text={READ.model1998.text /* #20 */} F={familyOf("studio")} size={30} appear={ez(f, 6, 18)} color={CREAM} />
          <Tag x={1000} y={108} text={READ.within1.text /* #20 */} F={familyOf("studio")} size={30} appear={ez(f, w1, w1 + 12)} color={CREAM} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-09 + 6-10 + 6-11 + 6-12 · the camera descends through the layer boundary (cells slide up and off, 12-14 px/f),
// the honey radiative zone fills the frame with flashing atoms; then the LIGHT dot zigzags atom to atom (Photon head
// 27 px/f); 170,000 years + NASA SAYS rolls in; the other estimates are unnumbered bars sliding in (class B). Tick rides
// the chart's rim on his ledge (F1). A radius bar at the right marks where we are (words only).
// ===============================================================================================================
const RadiusBar: React.FC<{ x: number; y: number; h: number; v: number; f: number; band?: number }> = ({ x, y, h, v, f, band = 0 }) => {
  const yOf = (u: number) => y + h * (1 - u);
  const seg = (a: number, b: number, col: string) => <rect x={x - 16} y={yOf(b)} width={32} height={yOf(a) - yOf(b)} fill={col} />;
  return (
    <g>
      <TextPlate x={x - 120} y={y - 70} w={190} h={h + 120} color="#2A0E4A" opacity={0.82} />
      {seg(0, 0.2, C.whiteGold)}
      {seg(0.2, 0.7, C.honey)}
      {seg(0.7, 1, C.tangerine)}
      <rect x={x - 16} y={y} width={32} height={h} fill="none" stroke={CREAM} strokeWidth={3} />
      {band > 0 ? <rect x={x - 26} y={yOf(0.7)} width={52} height={yOf(0.25) - yOf(0.7)} fill="none" stroke={C.whiteGold} strokeWidth={5} opacity={band} rx={8} /> : null}
      <line x1={x - 34} y1={yOf(0.25)} x2={x + 34} y2={yOf(0.25)} stroke={C.saffron} strokeWidth={6} opacity={band} />
      <Word x={x - 44} y={yOf(0.25) + 8} text="quarter" size={18} color={C.saffronCore} align="end" opacity={band} />
      <Word x={x - 44} y={y + 8} text="surface" size={18} color={CREAM} align="end" />
      <Word x={x - 44} y={y + h + 8} text="centre" size={18} color={CREAM} align="end" />
      <circle cx={x} cy={yOf(v)} r={15 + 2 * Math.sin(f / 4)} fill="none" stroke={C.bone} strokeWidth={4} strokeDasharray="6 5" />
      <circle cx={x} cy={yOf(v)} r={6} fill={C.bone} />
    </g>
  );
};

const ShotRadiative: ShotFC<C06> = ({ f, len, c }) => {
  const p2 = c.crawl - c.rad;
  const p3 = c.years - c.rad;
  const p4 = c.differ - c.rad;
  const F = familyOf("dense");
  // the descent: the boundary rises off the top; the atoms scroll with the camera, then slow to a crawl
  const B = path1(f, [
    [0, 1160],
    [16, 1000],
    [110, -120],
  ]);
  const scroll = path1(f, [
    [0, 0],
    [p2, p2 * 14],
    [len, p2 * 14 + (len - p2) * 2.5],
  ]);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.04 },
    { f: p2, x: 960, y: 540, zoom: 1.0 },
    { f: len, x: 990, y: 530, zoom: 1.06 },
  ]);
  // the light's random walk (shared vertices with Photon so the LIGHT tag rides the head)
  const ph = { x0: 330, y0: 960, x1: 1640, y1: 420, step: 74, seed: 7, speed: 27 };
  const pts = photonPath(ph.x0, ph.y0, ph.x1, ph.y1, ph.step, ph.seed);
  const fp = f - p2;
  const tot = photonHead(pts, 1e9).total;
  const head = fp >= 0 ? photonHead(pts, mod(fp * ph.speed, tot + 60)).head : null;
  const pose = f < p2 ? "sit" : f < p3 ? "point" : f < p4 ? "sit" : "shrug";
  const expr = f < p2 ? "determined" : f < p3 ? "surprised" : f < p4 ? "sleepy" : "thinking";
  const bars = [0.46, 0.74, 0.28, 0.98];
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.2} grain={0.5}>
      <Layer depth={0.05}>
        <FamSky name="dense" />
      </Layer>
      <Layer depth={1}>
        <AtomField f={f} oy={-scroll} n={44} seed={8} r={14} />
        {B > -100 ? (
          <g>
            <clipPath id="l06desc">
              <rect x={-400} y={-600} width={2720} height={B + 600} />
            </clipPath>
            <g clipPath="url(#l06desc)">
              <ConvCells f={f} x={-300} y={-600} w={2520} h={1800} cell={360} speed={13} scroll={14} />
            </g>
            <path d={`M-400 ${B} ${Array.from({ length: 30 }, (_, i) => `L${-400 + i * 100} ${(B + Math.sin(i * 1.3 + f / 6) * 16).toFixed(1)}`).join(" ")}`} fill="none" stroke={C.whiteGold} strokeWidth={10} />
          </g>
        ) : null}
        {fp >= 0 ? <Photon f={fp} x0={ph.x0} y0={ph.y0} x1={ph.x1} y1={ph.y1} step={ph.step} seed={ph.seed} speed={ph.speed} width={9} trail={5000} color={C.whiteGold} /> : null}
        <Rim x={-400} w={560} />
        <Ledge x={225} y={560} w={170} />
        <Tick x={215} y={560} pxPerM={72} frame={f} facing={1} pose={pose} expression={expr} staff={f >= p2 && f < p3} look={0.4} headTilt={f >= p2 && f < p3 ? Math.sin(f / 4) * 8 : 0} />
        <Motes frame={f} n={16} x={0} y={0} w={1920} h={1080} color={alpha("#4A1D78", 0.6)} seed={14} size={3} drift={20} />
      </Layer>
      <Layer depth={0}>
        <RadiusBar x={1800} y={170} h={760} v={path1(f, [[0, 0.8], [110, 0.66], [len, 0.58]])} f={f} band={ez(f, 50, 70)} />
        <g opacity={1 - ez(f, p2 + 30, p2 + 44)}>
          <Tag x={210} y={110} text="radiative zone · a quarter of the way out" F={F} size={28} appear={ez(f, 40, 54)} />
        </g>
        {head ? <Tag x={head[0] + 26} y={head[1] - 40} text="light" F={F} size={24} appear={ez(fp, 4, 14) * (1 - ez(f, p3 - 6, p3))} /> : null}
        {f >= p3 ? (
          <g opacity={ez(f, p3, p3 + 10)}>
            <TextPlate x={210} y={140} w={720} h={230} color="#2A0E4A" opacity={0.85} />
            <RollMetric x={240} y={270} value={READ.photonYears.value! /* #18 */} unit="years" k={ez(f, p3 + 6, p3 + 56)} size={96} who="6-11 years" />
            <SayPill x={246} y={330} kind="NASA SAYS" size={26} appear={ez(f, p3 + 20, p3 + 32)} />
          </g>
        ) : null}
        {f >= p4 ? (
          <g>
            {/* the fuzzy bracket round the counter */}
            <rect x={196 + Math.sin(f / 3) * 3} y={126 + Math.cos(f / 4) * 3} width={748} height={258} rx={28} fill="none" stroke={C.whiteGold} strokeWidth={6} strokeDasharray="18 14" strokeDashoffset={-f * 3} opacity={ez(f, p4, p4 + 10)} />
            {/* other estimates: bars of other lengths, NO numerals (class B, sources row 18) */}
            {bars.map((b, i) => {
              const L = 620 * b * ez(f, p4 + 6 + i * 8, p4 + 6 + i * 8 + Math.max(8, (620 * b) / 18));
              const y = 440 + i * 56;
              return (
                <g key={i}>
                  <rect x={210} y={y} width={L} height={34} rx={10} fill={i % 2 ? C.magenta : "#4A1D78"} />
                  {[1, 2, 3].map((k) => (
                    <rect key={k} x={210 + L - 6} y={y + 2} width={k * 18 + Math.sin(f / 3 + i + k) * 6} height={30} rx={10} fill={i % 2 ? C.magenta : "#4A1D78"} opacity={0.28 - k * 0.07} />
                  ))}
                </g>
              );
            })}
            <Tag x={210} y={700} text="depends on the model" F={F} size={28} appear={ez(f, p4 + 14, p4 + 26)} />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 6-13 · the dark: a photon streaks from the limb to Earth (40 px/f, three in flight), the SUN TO EARTH bar fills;
// about 8 min + OUR SUM (row 1: 149.6 million km at the speed of light, our rounding). Pan right. MOVER: the photon
// streaks + the bar filling.
// ===============================================================================================================
const ShotEightMin: ShotFC<C06> = ({ f, len }) => {
  const F = familyOf("space");
  const xs = 230;
  const xe = 1640;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 540, zoom: 1.02 },
    { f: len, x: 1010, y: 540, zoom: 1.02 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.05}>
          <FamSky name="space" />
        </Layer>
        <Layer depth={0.3}>
          <Stars frame={f} n={70} x={-300} y={-100} w={2600} h={1300} color={STAR_TINTS[0]} seed={3} />
          <Stars frame={f} n={50} x={-300} y={-100} w={2600} h={1300} color={STAR_TINTS[1]} seed={7} />
          <Stars frame={f} n={30} x={-300} y={-100} w={2600} h={1300} color={STAR_TINTS[2]} seed={11} />
        </Layer>
        <Layer depth={1}>
          <SunLimb f={f} cx={-1360} cy={500} R={1560} granSize={60} bloom={0.7} />
          <Planet x={1700} y={480} r={48} f={f} kind="earth" />
          {[0, 1, 2].map((i) => {
            const u = mod(f * 40 + i * 520, 1560);
            const x = xs + u;
            if (x > xe + 30) return null;
            return (
              <g key={i}>
                <path d={`M${x - 220} ${480 - 3} L${x} ${480 - 10} L${x} ${480 + 10} L${x - 220} ${480 + 3} Z`} fill={C.gold} opacity={0.75} />
                <Bloom x={x} y={480} r={56} color={C.whiteGold} strength={0.9} />
                <circle cx={x} cy={480} r={13} fill="#FFFFFF" />
              </g>
            );
          })}
          {/* SUN TO EARTH bar, filling with the first photon */}
          <rect x={xs} y={730} width={xe - xs} height={40} rx={20} fill="none" stroke={alpha(C.lavender, 0.8)} strokeWidth={3} />
          <rect x={xs} y={730} width={Math.min(xe - xs, f * 40)} height={40} rx={20} fill={C.gold} />
          <Word x={xs} y={712} text="sun to earth" size={24} color={C.lavender} />
        </Layer>
        <Layer depth={0}>
          <TextPlate x={690} y={820} w={620} h={170} color="#07061F" opacity={0.7} />
          <RollMetric x={720} y={935} value={READ.eightMin.value! /* #1 C */} pre="about" unit="min" k={ez(f, 10, 34)} size={104} color={CREAM} who="6-13 minutes" />
          <OurSumPill x={1010} y={880} size={26} appear={ez(f, 26, 38)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-14 · a tiny SUN TO EARTH sliver above a very long bar that runs off the frame (THROUGH THE SUN: NASA SAYS
// 170,000 YEARS, F13); a window with morning light pulsing at the lower right. Pull back. MOVER: the long bar drawing
// 60 px/f, then its chevrons streaming 20 px/f + the window's light pulsing.
// ===============================================================================================================
const ShotWindow: ShotFC<C06> = ({ f, len }) => {
  const F = familyOf("dense");
  const L = Math.min(2400, f * 60);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 520, zoom: 1.1 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  const win = ez(f, 40, 56);
  const pulse = 0.6 + 0.4 * Math.sin(f / 5);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.2} grain={0.5}>
        <Layer depth={0.05}>
          <FamSky name="dense" />
        </Layer>
        <Layer depth={1}>
          <AtomField f={f} ox={f * 2} n={24} seed={3} r={10} />
          <Word x={200} y={290} text="sun to earth" size={26} color="#2A0E4A" />
          <rect x={200} y={312} width={12} height={46} rx={4} fill={C.magenta} stroke={INK} strokeWidth={2} />
          <clipPath id="l06long">
            <rect x={200} y={500} width={L} height={110} />
          </clipPath>
          <g clipPath="url(#l06long)">
            <rect x={200} y={505} width={2600} height={100} rx={18} fill="#4A1D78" />
            {Array.from({ length: 40 }, (_, i) => {
              const x = 200 + mod(i * 90 + f * 20, 3600) - 200;
              return <path key={i} d={`M${x} 520 L${x + 34} 555 L${x} 590`} fill="none" stroke={C.gold} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />;
            })}
          </g>
          {L < 2400 ? <circle cx={200 + L} cy={555} r={16} fill={C.saffronCore} stroke={C.saffron} strokeWidth={4} /> : null}
          {/* the window with this morning's light */}
          <g opacity={win} transform={`translate(0 ${(1 - win) * 60})`}>
            <path d={`M1460 700 L980 1180 L1260 1180 L1720 700 Z`} fill={C.whiteGold} opacity={0.35 * pulse} />
            <rect x={1440} y={640} width={300} height={300} rx={14} fill={C.whiteGold} opacity={0.6 + 0.4 * pulse} />
            <rect x={1440} y={640} width={300} height={300} rx={14} fill="none" stroke="#4A1D78" strokeWidth={18} />
            <line x1={1590} y1={640} x2={1590} y2={940} stroke="#4A1D78" strokeWidth={12} />
            <line x1={1440} y1={790} x2={1740} y2={790} stroke="#4A1D78" strokeWidth={12} />
            <Bloom x={1590} y={790} r={260 + 30 * pulse} color={C.whiteGold} strength={0.7} />
          </g>
        </Layer>
        <Layer depth={0}>
          <Tag x={200} y={450} text={`through the sun: nasa says ${READ.photonYears.text}` /* #18, F13 */} F={F} size={30} appear={ez(f, 6, 18)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-15 / 6-16 · the arc chart: radius (true proportion from the centre to the surface) on x, temperature (a smooth
// log-shaped scale, no tick numerals) on y. 6-15: the curve falls from the core to the surface (head + the area under
// it filling), the saffron pin drops at the surface; 15 million °C then 5,500 °C ABOUT. 6-16: it climbs again into
// the corona strip (drawn ABOVE THE SURFACE, not to scale), 2 million °C; a bead runs up the curve (Tick's staff).
// ===============================================================================================================
const X0 = 470;
const XS = 1360;
const XE = 1760;
const YB = 800;
const yT = (lg: number) => 785 - ((lg - 3.74) / (7.18 - 3.74)) * 450;
const INNER: [number, number][] = [
  [0, 7.18],
  [0.1, 7.12],
  [0.2, 6.97],
  [0.3, 6.82],
  [0.45, 6.62],
  [0.6, 6.44],
  [0.7, 6.32],
  [0.8, 6.02],
  [0.9, 5.55],
  [0.96, 5.0],
  [0.99, 4.4],
  [1.0, 3.74],
];
const innerPts: Pt[] = INNER.map(([r, lg]) => [X0 + r * (XS - X0), yT(lg)]);
const OUTER: Pt[] = [
  [XS, yT(3.74)],
  [XS + 40, yT(3.72)],
  [XS + 90, yT(3.95)],
  [XS + 130, yT(4.7)],
  [XS + 170, yT(5.6)],
  [XS + 230, yT(6.12)],
  [XS + 310, yT(6.27)],
  [XE - 10, yT(6.3)],
];

const ArcChart: React.FC<{ f: number; inner: number; outer: number; pin: number }> = ({ f, inner, outer, pin }) => {
  const ip = partialPts(innerPts, inner);
  const op = outer > 0 ? partialPts(OUTER, outer) : [];
  const fillA = ip.length > 1 ? `M${ip[0][0]} ${YB} ${ip.map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ")} L${ip[ip.length - 1][0].toFixed(1)} ${YB} Z` : "";
  const fillB = op.length > 1 ? `M${op[0][0]} ${YB} ${op.map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ")} L${op[op.length - 1][0].toFixed(1)} ${YB} Z` : "";
  const sx = XS;
  const sy = yT(3.74);
  const pinY = sy - 30 - (1 - pin) * 420;
  const strip = (a: number, b: number, col: string) => <rect x={a} y={YB + 6} width={b - a} height={30} fill={col} />;
  return (
    <g>
      <Plate x={380} y={250} w={1440} h={650} />
      {/* the layer strips along the radius axis, true proportions (SUN_R) */}
      {strip(X0, X0 + 0.2 * (XS - X0), C.whiteGold)}
      {strip(X0 + 0.2 * (XS - X0), X0 + 0.7 * (XS - X0), C.honey)}
      {strip(X0 + 0.7 * (XS - X0), XS, C.tangerine)}
      {strip(XS, XE, C.magenta)}
      <line x1={X0} y1={YB} x2={XE} y2={YB} stroke={alpha(CREAM, 0.8)} strokeWidth={4} />
      <line x1={X0} y1={290} x2={X0} y2={YB} stroke={alpha(CREAM, 0.8)} strokeWidth={4} />
      <line x1={XS} y1={300} x2={XS} y2={YB} stroke={alpha(C.gold, 0.7)} strokeWidth={3} strokeDasharray="10 10" />
      <Word x={X0} y={868} text="core" size={22} color={CREAM} />
      <Word x={XS} y={868} text="surface" size={22} color={C.gold} align="middle" />
      <Word x={XE} y={868} text="corona" size={22} color="#FFC6EA" align="end" />
      <Word x={X0 + 14} y={300} text="temperature" size={20} color={alpha(CREAM, 0.85)} />
      {fillA ? <path d={fillA} fill={C.gold} opacity={0.22} /> : null}
      {fillB ? <path d={fillB} fill={C.magenta} opacity={0.35} /> : null}
      <Trace pts={innerPts} head={inner} f={f} color={C.gold} width={10} smooth={false} />
      {outer > 0 ? <Trace pts={OUTER} head={outer} f={f} color="#FF7BC8" width={10} smooth={false} /> : null}
      {pin > 0 ? (
        <g transform={`translate(${sx} ${pinY})`}>
          <path d="M0 0 C-24 -30 -26 -60 0 -70 C26 -60 24 -30 0 0 Z" fill={C.saffron} stroke={INK} strokeWidth={3} />
          <circle cx={0} cy={-46} r={9} fill={C.saffronCore} />
        </g>
      ) : null}
    </g>
  );
};

const ShotArc: ShotFC<C06> = ({ f, len, c }) => {
  const s0 = c.fromCore - c.arc;
  const s1 = c.atSurface - c.arc;
  const inner = ez(f, s0, s1 + 4);
  const pin = ez(f, s1 + 4, s1 + 18);
  const cam = cameraAt(f, [
    { f: 0, x: 860, y: 560, zoom: 1.08 },
    { f: len, x: 1010, y: 540, zoom: 1.03 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={familyOf("studio").theme} cam={cam} vignette={0.2} grain={0.5}>
        <StudioSet f={f} seed={8} floor={930} />
        <Layer depth={1}>
          <ArcChart f={f} inner={inner} outer={0} pin={pin} />
        </Layer>
        <Layer depth={0}>
          <TextPlate x={360} y={70} w={640} h={140} color="#0E2A3E" opacity={0.6} />
          <RollMetric x={390} y={175} value={READ.coreC.value! /* #10 #19 */} unit="million °C" k={ez(f, s0, s0 + 24)} size={92} who="6-15 core" />
          {f > s1 ? (
            <g opacity={ez(f, s1, s1 + 8)}>
              <TextPlate x={1080} y={70} w={520} h={140} color="#0E2A3E" opacity={0.6} />
              <RollMetric x={1110} y={175} value={READ.surfaceC.value! /* #10 #15 */} unit="°C" k={ez(f, s1 + 2, s1 + 18)} size={92} who="6-15 surface" />
              <AboutPill x={1450} y={146} size={24} appear={ez(f, s1 + 14, s1 + 24)} />
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

const ShotClimb: ShotFC<C06> = ({ f, len, c }) => {
  const s = c.twoMillion - c.climb;
  const outer = ez(f, 4, Math.max(18, s + 6));
  const all = [...innerPts, ...OUTER.slice(1)];
  const bead = f > s + 10 ? photonHead(all, mod((f - s - 10) * 30, photonHead(all, 1e9).total + 200)).head : null;
  const cam = cameraAt(f, [
    { f: 0, x: 1080, y: 520, zoom: 1.12 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={familyOf("studio").theme} cam={cam} vignette={0.2} grain={0.5}>
        <StudioSet f={f} seed={8} floor={930} />
        <Layer depth={1}>
          <ArcChart f={f} inner={1} outer={outer} pin={1} />
          {bead ? (
            <g>
              <Bloom x={bead[0]} y={bead[1]} r={70} color={C.whiteGold} strength={0.9} />
              <circle cx={bead[0]} cy={bead[1]} r={15} fill="#FFFFFF" stroke={C.saffron} strokeWidth={4} />
            </g>
          ) : null}
          <Tick x={250} y={932} pxPerM={84} frame={f} facing={1} pose="point" poseTo="cheer" poseT={ez(f, s + 40, s + 60)} expression="happy" staff look={0.4} />
        </Layer>
        <Layer depth={0}>
          <TextPlate x={1150} y={70} w={640} h={140} color="#0E2A3E" opacity={0.6} />
          <RollMetric x={1180} y={175} value={READ.coronaC.value! /* #10 */} unit="million °C" k={ez(f, s, s + 16)} size={92} who="6-16 corona" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL06: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL06(t);
  const shots: ShotDef<C06>[] = [
    { from: 0, S: ShotGoingIn, id: "6-01" }, // + 6-02 (PUSH)
    { from: c.base, S: ShotBase, id: "6-03" },
    { from: c.bubbles, S: ShotBubbles, id: "6-04" },
    { from: c.scope, S: ShotOatmeal, id: "6-05" },
    { from: c.waves, S: ShotWaves, id: "6-06" }, // + 6-07 (PUSH)
    { from: c.model, S: ShotModel, id: "6-08" },
    { from: c.rad, S: ShotRadiative, id: "6-09" }, // + 6-10 (SLIDE), 6-11 (PUSH), 6-12
    { from: c.eight, S: ShotEightMin, id: "6-13" },
    { from: c.window, S: ShotWindow, id: "6-14" },
    { from: c.arc, S: ShotArc, id: "6-15" },
    { from: c.climb, S: ShotClimb, id: "6-16" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL06 = (t: SceneTiming): Cue[] => {
  const c = cuesL06(t);
  const run = (at: number, n: number, gap = 5, vol = 0.07): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    { at: 4, file: SFX.rumble, vol: 0.12, dur: 120, fadeOut: 30 },
    { at: 12, file: SFX.click, vol: 0.12, dur: 8 },
    { at: 18, file: SFX.boom, vol: 0.12, dur: 60, fadeOut: 20 },
    ...run(c.depth + 4, 6),
    ...cutHit(c.base),
    { at: c.base + 8, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.nasa + 6, file: SFX.pop, vol: 0.14, dur: 14 },
    ...cutHit(c.bubbles),
    { at: c.bubbles + 4, file: SFX.swirl, vol: 0.16, dur: 50 },
    ...cutHit(c.scope),
    { at: c.scope + 10, file: SFX.popLong, vol: 0.16, dur: 30 },
    ...cutHit(c.waves),
    { at: c.waves + 8, file: SFX.chime, vol: 0.14, dur: 60 },
    { at: c.helio + 2, file: SFX.pop, vol: 0.14, dur: 14 },
    ...cutHit(c.model),
    ...run(c.model + 6, 6),
    { at: c.within + 4, file: SFX.pop, vol: 0.14, dur: 14 },
    ...cutHit(c.rad),
    { at: c.rad + 2, file: SFX.whoosh, vol: 0.2, dur: 50 },
    ...run(c.crawl + 4, 8, 6, 0.06),
    ...run(c.years + 6, 8),
    { at: c.differ + 8, file: SFX.pop, vol: 0.14, dur: 14 },
    ...cutHit(c.eight),
    { at: c.eight + 4, file: SFX.whoosh, vol: 0.18, dur: 50 },
    ...cutHit(c.window),
    { at: c.window + 4, file: SFX.riser, vol: 0.14, dur: 90, fadeOut: 20 },
    ...cutHit(c.arc),
    ...run(c.fromCore + 4, 8),
    { at: c.atSurface + 10, file: SFX.pop, vol: 0.14, dur: 14 },
    ...cutHit(c.climb),
    { at: c.climb + 4, file: SFX.riser, vol: 0.16, dur: 90, fadeOut: 20 },
  ];
};
