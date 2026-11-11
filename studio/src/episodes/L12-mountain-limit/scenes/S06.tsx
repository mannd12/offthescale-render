// L12 scene l06 "Why Everest is rising" (storyboard §3 "6 · Why Everest is rising": shots 6-01…6-15, then the
// BlackBeat + ChapterCard 4 in the tail; script lines 41-48 = scene lines 0-7; families dusk / noon / void; Act III).
// Package III builder. Every number drawn carries its sources.md row in a comment (validate while building).
// The river beat is ONE STUDY'S MODEL (Han et al. 2024, #6): the map carries "SCHEMATIC" (F8), the band shot carries
// the dated kicker "— 2024 · NATURE GEOSCIENCE · ONE STUDY'S MODEL", and the up/down arrows carry no rates (F9).
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  Bobber,
  Embers,
  Emissive,
  Facets,
  Family,
  Form,
  GroundShadow,
  HazeBand,
  Kicker,
  Layer,
  Leader,
  LightWash,
  Metric,
  Motes,
  P,
  Pill,
  Pt,
  Ripples,
  Sky,
  Stage,
  Stars,
  Tick,
  alpha,
  cameraAt,
  cutPop,
  fall,
  hazed,
  impact,
  lane,
  mixHex,
  ridgePath,
  rnd,
  roundPoly,
  rrect,
  seaSurface,
  smoothPath,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { L12_COLORS, familyOf, pillFill } from "../families";
import { cueKit } from "../cues";
import { HEIGHTS, L12Gauge } from "../L12Gauge";
import { FossilShell, SlateBlock } from "../props";
import { MASSIF, SUMMIT, Summit, massifY } from "../Summit";
import { ShotDef, ShotFC, actBreakAt, playShots } from "../shots";
import { Cue, SFX, cutHit, sting } from "./cue-types";
import { Black, CloudRack, DISC_KM, Disc, Streamers, chapterFourCard } from "./S07";

const DUSK = familyOf("dusk");
const NOON = familyOf("noon");
const VOID = familyOf("void");
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number, a = 0, b = 1) => {
  const u = clamp01((t - a) / (b - a));
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type Cam = { x: number; y: number; zoom: number };
const pop = (f: number, cam: Cam): Cam => ({ ...cam, zoom: cam.zoom * cutPop(f, 0) });
/** Camera that puts a point of the Summit's massif layer (depth 0.6) at the screen centre. */
const onMassif = (f: number, tx: number, ty: number, zoom: number) => ({ f, x: 960 + (tx - 960) / 0.6, y: 540 + (ty - 540) / 0.6, zoom });

export const cuesL06 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    dawn: 0, // 6-01 pre-dawn summit, the +2 mm counter
    lifting: p(0, "what's lifting"), // 6-02 Tick looks down; the arrow under the summit (same shot)
    map: at(1), // 6-03 the relief map
    capture: p(1, "Around eighty-nine"), // 6-04 the river snaps into its new course (same shot)
    gorge: p(1, "joined the Kosi"), // 6-05 the gorge, oblique
    section: at(2), // 6-06 the section through the gorge
    rises: p(2, "Every tonne"), // 6-07 the unloaded crust rises (same shot)
    boat: p(2, "And a boat"), // 6-08 the tank: cargo overboard, the raft rides higher
    band: at(3), // 6-09 the gauge top: the RIVER band
    peaks: p(3, "Everest and its neighbours"), // 6-10 three peaks nudged (same shot)
    twice: at(4), // 6-11 the two bars
    arrows: at(5), // 6-12 rebound vs erosion
    peel: p(5, "the land around it"), // 6-13 the land lowers, the peak rides up (same shot)
    shell: at(6), // 6-14 Tick holds the shell up as the sun crests
    zoom: at(7), // 6-15 decade zoom, the three discs
    brk: actBreakAt(t).start, // BlackBeat + sting → ChapterCard 4
    last: end(7),
    end: t.frames,
  };
};
export type CL06 = ReturnType<typeof cuesL06>;

const Snow: React.FC<{ f: number; n?: number; seed?: number }> = ({ f, n = 50, seed = 4 }) => (
  <g>
    {fall(f, n, 1920, 1080, seed, 1.0, 14).map((p, i) => (
      <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.9} fill="#FFFFFF" opacity={0.5} />
    ))}
  </g>
);

// 6-01 / 6-02 · pre-dawn summit: Tick taps the +2 mm counter, then looks down past its boots at the glowing arrow
const ShotDawn: ShotFC<CL06> = ({ f, len, c }) => {
  const F = DUSK;
  const t1 = c.lifting;
  const cam = pop(f, cameraAt(f, [onMassif(0, 1010, 235, 3.0), onMassif(t1, 1000, 250, 3.4), onMassif(len + 20, 955, 330, 3.9)]));
  const ppm = 80;
  const tap = clamp01((f - 24) / 26) * 1.5;
  const down = sm(f, t1 - 4, t1 + 18);
  const mm = 2 * sm(f, 30, 110); // #6: ~2 mm a year
  const px = SUMMIT.x + 78;
  const py = SUMMIT.y - 120;
  const glow = sm(f, t1 + 4, t1 + 26);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.24} grain={0.5}>
      <Summit f={f} family={F} light={12} sun={null} sunGlow={0.4 + 0.04 * Math.sin(f / 30)} tick={{ pxPerM: ppm, pose: down > 0.5 ? "think" : "stand", poseTo: down > 0.5 ? undefined : "point", poseT: tap, expression: "thinking", headTilt: down * 18, look: lerp(0.6, 0.1, down), staff: true }} />
      <Layer depth={0.6}>
        {/* pass b: pre-dawn cloud sea drifting past the flanks below Tick's boots, spindrift off the cornice */}
        <CloudRack f={f + 300} n={5} x0={500} x1={1600} y0={400} y1={470} size={46} speed={0.8} body={mixHex(F.haze, F.shadow, 0.3)} under={mixHex(F.shadow, F.sky[0], 0.3)} top={mixHex(F.light, F.haze, 0.5)} seed={11} />
        <Streamers f={f} n={18} x0={SUMMIT.x - 10} x1={SUMMIT.x + 360} y0={SUMMIT.y - 30} y1={SUMMIT.y + 16} len={50} width={2.6} speed={1.6} slope={0.16} color="#FFFFFF" opacity={0.65} seed={6} />
        {/* the +2 mm counter plate beside Tick (it rides the mountain) */}
        <g opacity={1 - down * 0.5}>
          <rect x={px} y={py - 22} width={112} height={34} rx={6} fill={alpha(F.shadow, 0.78)} stroke={F.light} strokeWidth={1.2} />
          <text x={px + 10} y={py + 2} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 19, fill: F.text, fontVariantNumeric: "tabular-nums" }}>
            +{mm.toFixed(1)} mm
          </text>
          <circle cx={px + 100} cy={py - 14} r={3} fill={P.vermilion} opacity={0.5 + 0.5 * Math.sin(f / 5)} />
        </g>
        {/* 6-02: the ground goes faintly see-through and an upward arrow glows under the summit */}
        <g opacity={glow}>
          <ellipse cx={SUMMIT.x} cy={SUMMIT.y + 66} rx={50} ry={46} fill={F.shadow} opacity={0.22} />
          <g transform={`translate(0 ${(-((f * 0.5) % 14)).toFixed(1)})`}>
            <Emissive d={`M${SUMMIT.x} ${SUMMIT.y + 104} V${SUMMIT.y + 44} M${SUMMIT.x - 16} ${SUMMIT.y + 62} L${SUMMIT.x} ${SUMMIT.y + 42} L${SUMMIT.x + 16} ${SUMMIT.y + 62}`} color={F.light} core="#FFF6DC" width={4} glow={8} strength={0.9} />
          </g>
        </g>
      </Layer>
      <Layer depth={1.25}>
        <Snow f={f} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 10, 30)}>
          <Metric x={120} y={200} value="+2 mm" unit="a year" size={84} color={F.text} />
          <Pill x={120} y={256} text="EVEREST · MEASURED BY GPS" fill={pillFill(F)} color={F.text} dot={P.vermilion} size={16} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} readout="8,848.86 m" ceiling={{ v: 9000 /* #9 ~9 km */ }} base="ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// 6-03 / 6-04 · noon relief map (SCHEMATIC, F8): the range, the summit dot, the Arun, its capture into the Kosi
const EV: Pt = [900, 560];
const GORGE_X = EV[0] + 300; // 75 km (#6) at 4 px per km
const ShotMap: ShotFC<CL06> = ({ f, len, c }) => {
  const F = NOON;
  const t1 = c.capture - c.map;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 0.94 }, { f: t1, x: 1010, y: 560, zoom: 1.12 }, { f: len + 20, x: 1080, y: 640, zoom: 1.24 }]));
  const k = sm(f, t1, t1 + 22);
  const land = "#D9C58E";
  const high = "#E9DDB6";
  // old course: east along the high valley and on; new course: hard south through the range to the Kosi
  const upper: Pt[] = [[-200, 380], [300, 400], [700, 372], [1000, 392], [GORGE_X, 400]];
  const oldTail: Pt[] = [[GORGE_X, 400], [1500, 380], [1800, 396], [2200, 380]];
  const newTail: Pt[] = [[GORGE_X, 400], [GORGE_X + 14, 520], [GORGE_X - 10, 660], [GORGE_X + 20, 800], [GORGE_X + 4, 900]];
  const tail = oldTail.map(([x, y], i): Pt => [lerp(x, newTail[Math.min(i + 1, 4)][0], k), lerp(y, newTail[Math.min(i + 1, 4)][1], k)]);
  const river = smoothPath([...upper, ...(k > 0 ? [newTail[1]] : []).map(([x, y]): Pt => [lerp(GORGE_X + 100, x, k), lerp(392, y, k)]), ...tail.slice(1)]);
  const kosi = smoothPath([[-200, 960], [400, 930], [900, 905], [GORGE_X + 4, 900], [1700, 930], [2200, 990]]);
  const peaks = Array.from({ length: 26 }, (_, i) => {
    const x = -160 + i * 88 + rnd(i) * 30;
    const gap = Math.abs(x - GORGE_X) < 50;
    const h = (60 + rnd(i * 3) * 70) * (gap ? 0.3 : 1) * (Math.abs(x - EV[0]) < 60 ? 1.5 : 1);
    return { x, y: 600 + rnd(i * 7) * 40 - (i % 2) * 50, h, w: 70 + rnd(i * 5) * 40 };
  });
  const pulse = (f * 3) % 500;
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.1} grain={0.5}>
      <Layer depth={1}>
        <rect x={-800} y={-600} width={3600} height={2400} fill={land} />
        <path d={smoothPath([[-800, 200], [200, 240], [900, 210], [1700, 250], [2800, 200]]) + " L2800 -600 L-800 -600 Z"} fill={high} />
        <path d={smoothPath([[-800, 760], [300, 800], [1100, 770], [1900, 810], [2800, 780]]) + " L2800 1800 L-800 1800 Z"} fill="#B9CF9A" opacity={0.7} />
        {/* cloud shadows crawling over the map (pass b: defined edges, the clouds that cast them float above at depth 1.2) */}
        <CloudRack f={f} n={4} x0={-700} x1={2700} y0={300} y1={900} size={90} speed={1.8} body={F.shadow} opacity={0.16} seed={4} flat={1.3} />
        {/* the range: hill symbols with a lit west face and a shaded east face (sun upper left) */}
        {peaks.map((p, i) => (
          <g key={i}>
            <path d={`M${p.x - p.w} ${p.y} L${p.x} ${p.y - p.h} L${p.x + p.w} ${p.y} Z`} fill="#F4EEDD" />
            <path d={`M${p.x} ${p.y - p.h} L${p.x + p.w} ${p.y} L${p.x + p.w * 0.15} ${p.y} Z`} fill="#8FA7A0" />
            <path d={`M${p.x - p.w} ${p.y} L${p.x + p.w} ${p.y}`} stroke="#B7A46E" strokeWidth={2} />
          </g>
        ))}
        {/* rivers: sea-glass with a crawling shimmer */}
        <path d={kosi} fill="none" stroke="#4E9FA8" strokeWidth={16} strokeLinecap="round" opacity={0.3 + 0.7 * k} />
        <path d={river} fill="none" stroke="#4E9FA8" strokeWidth={13} strokeLinecap="round" />
        <path d={river} fill="none" stroke="#DFF3EE" strokeWidth={3} strokeDasharray="18 30" strokeDashoffset={-f * 2.4} strokeLinecap="round" opacity={0.9} />
        <path d={kosi} fill="none" stroke="#DFF3EE" strokeWidth={3} strokeDasharray="18 30" strokeDashoffset={-f * 2.4} opacity={0.3 + 0.6 * k} />
        {k > 0.2 ? <circle cx={GORGE_X + 6} cy={400 + pulse} r={14} fill="#DFF3EE" opacity={pulse < 480 ? 0.8 * k : 0} /> : null}
        {/* Everest: the summit dot, and the 75-km leader to the gorge */}
        <circle cx={EV[0]} cy={EV[1] - 96} r={10 + Math.sin(f / 9) * 1.5} fill={P.vermilion} />
        <circle cx={EV[0]} cy={EV[1] - 96} r={16 + ((f * 0.5) % 22)} fill="none" stroke={P.vermilion} strokeWidth={2} opacity={1 - ((f * 0.5) % 22) / 22} />
        <g opacity={sm(f, 20, 40)} stroke={F.text} strokeWidth={3}>
          <line x1={EV[0]} y1={EV[1] + 40} x2={GORGE_X} y2={EV[1] + 40} strokeDasharray="10 8" />
          <line x1={EV[0]} y1={EV[1] + 28} x2={EV[0]} y2={EV[1] + 52} />
          <line x1={GORGE_X} y1={EV[1] + 28} x2={GORGE_X} y2={EV[1] + 52} />
        </g>
        <g opacity={k}>
          <Pill x={GORGE_X + 60} y={880} text="KOSI" fill={pillFill(F)} color="#FFF8E8" dot="#7FD0E8" size={20} />
        </g>
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 14, 34) * (1 - k)}>
          <Pill x={120} y={128} text="ARUN GORGE · ~75 km FROM EVEREST" fill={pillFill(F)} color="#FFF8E8" dot="#7FD0E8" size={20} />
        </g>
        <g opacity={k}>
          <Metric x={120} y={170} value="89,000" unit="years ago" size={76} color={F.text} />
        </g>
      </Layer>
      <Layer depth={1.2}>
        <CloudRack f={f} n={4} x0={-700} x1={2700} y0={160} y1={760} size={90} speed={2.2} body="#FFFDF6" under="#E8E2D2" opacity={0.85} seed={4} flat={1.3} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={1000} text="SCHEMATIC MAP · ONE STUDY'S MODEL" fill={pillFill(F)} color="#FFF8E8" size={16} />
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} ceiling={{ v: 9000 /* #9 */ }} base="ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// 6-05 · the gorge, oblique: a notch deepening between two lit walls, water lines crawling
const ShotGorge: ShotFC<CL06> = ({ f, len }) => {
  const F = NOON;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 960, y: 500, zoom: 1.0 }, { f: len + 20, x: 960, y: 620, zoom: 1.2 }]));
  const deep = 760 + 120 * sm(f, 0, len);
  const left: Pt[] = [[-300, 1300], [-300, 300], [200, 260], [520, 330], [700, 480], [860, deep], [860, 1300]];
  const right: Pt[] = [[1060, 1300], [1060, deep], [1220, 460], [1420, 300], [1800, 240], [2300, 290], [2300, 1300]];
  const rock = "#8FA39A";
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.12} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Bloom x={200} y={80} r={800} color={F.light} strength={0.6} spread={0.4} />
      </Layer>
      <Layer depth={0.3} haze={{ color: F.haze, amount: 0.45 }}>
        <path d={ridgePath([[-400, 520], [100, 380], [500, 450], [960, 330], [1400, 440], [1900, 360], [2400, 480]], 1300, 20)} fill={F.far} />
        <path d={ridgePath([[560, 700], [760, 420], [900, 300], [960, 250], [1040, 310], [1200, 440], [1400, 700]], 1300, 8)} fill="#DCE9E4" />
        <path d={roundPoly([[820, 380], [900, 300], [960, 250], [1040, 310], [1110, 370], [1000, 350], [930, 372]], 6)} fill="#FFFFFF" />
      </Layer>
      <Layer depth={1}>
        <path d={`M700 ${deep - 30} L1220 ${deep - 30} L1300 1300 L600 1300 Z`} fill="#3E8E98" />
        {lane(f, 9, 0, 520, 3.4, 3).map((p, i) => (
          <path key={i} d={`M${940 + ((i * 37) % 60)} ${deep - 20 + p.x} q16 14 0 40`} stroke="#DFF3EE" strokeWidth={4} fill="none" opacity={0.8 * (1 - p.phase)} />
        ))}
        <Form d={roundPoly(left, 14)} fill={rock} light={225} shadow={F.shadow} inset={40} rim={F.light} rimWidth={4} bounce={F.bounce}>
          <Facets pts={left.slice(1, 6)} base={1300} light={225} fill={F.shadow} opacity={0.35} />
        </Form>
        <Form d={roundPoly(right, 14)} fill={mixHex(rock, F.light, 0.25)} light={225} shadow={F.shadow} inset={40} rim={F.light} rimWidth={4} bounce={F.bounce}>
          <Facets pts={right.slice(1, 6)} base={1300} light={225} fill={F.shadow} opacity={0.2} />
          {[420, 560, 700, 840].map((y, i) => (
            <path key={y} d={`M1040 ${y + 60} L1500 ${y - 20 + i * 6} L2300 ${y + 10}`} fill="none" stroke={F.shadow} strokeWidth={4} opacity={0.14} />
          ))}
        </Form>
        <g>
          {[420, 560, 700, 840].map((y, i) => (
            <path key={y} d={`M-300 ${y + 10} L400 ${y - 16 + i * 5} L880 ${y + 70}`} fill="none" stroke={F.shadow} strokeWidth={4} opacity={0.12} />
          ))}
        </g>
        {lane(f, 8, 0, 300, 2.6, 7).map((p, i) => (
          <circle key={i} cx={880 + rnd(i) * 160} cy={deep - 60 - p.x} r={5 + rnd(i * 3) * 6} fill="#FFFFFF" opacity={0.35 * (1 - p.phase)} />
        ))}
      </Layer>
      <Layer depth={0}>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} ceiling={{ v: 9000 /* #9 */ }} base="ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// 6-06 / 6-07 · dusk section through the gorge: the river cuts down, rock leaves as specks, the unloaded crust rises
const ShotSection: ShotFC<CL06> = ({ f, len, c }) => {
  const F = DUSK;
  const t1 = c.rises - c.section;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 940, y: 560, zoom: 1.0 }, { f: t1, x: 960, y: 560, zoom: 1.08 }, { f: len + 20, x: 960, y: 520, zoom: 1.14 }]));
  const cut = sm(f, 0, t1 + 30);
  const lift = sm(f, t1, len) * 46;
  const notch = 520 + cut * 190;
  const top: Pt[] = [[-400, 640], [0, 560], [260, 420], [480, 300], [640, 360], [800, 470], [900, notch], [1010, notch], [1110, 450], [1260, 330], [1420, 270], [1640, 400], [1900, 540], [2320, 620]];
  const crust = ridgePath(top, 900, 12);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.24} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={50} w={1920} h={380} color={F.text} seed={12} size={1.3} />
        <Bloom x={1600} y={640} r={700} color={F.light} strength={0.5} spread={0.3} squash={0.7} />
      </Layer>
      <Layer depth={0.3} haze={{ color: F.haze, amount: 0.4 }}>
        <path d={ridgePath([[-400, 600], [100, 520], [500, 570], [900, 500], [1300, 560], [1800, 500], [2400, 580]], 1300, 30)} fill={F.far} />
      </Layer>
      <Layer depth={1}>
        {/* warm, solid mantle below (hot rock, never molten: F2), then the crust slab riding on it */}
        <rect x={-400} y={840} width={2720} height={700} fill="#7A3418" />
        <HazeBand y={840} h={300} color="#FF8A2A" strength={0.35} up />
        <Embers frame={f} x0={-200} x1={2100} y={1080} n={30} color="#FFB347" seed={13} rise={0.6} life={120} size={2.2} />
        <g transform={`translate(0 ${(-lift).toFixed(1)})`}>
          <Form d={crust} fill={mixHex(F.mid, F.near, 0.45)} light={12} shadow={F.shadow} inset={34} shadowOpacity={0.5} rim={F.light} rimWidth={4} rimOpacity={0.9} bounce={F.bounce}>
            
            <path d={roundPoly([[440, 340], [480, 300], [640, 360], [700, 400], [600, 384], [520, 372]], 6)} fill={L12_COLORS.snow} />
            <path d={roundPoly([[1200, 376], [1260, 330], [1420, 270], [1500, 316], [1400, 330], [1300, 372]], 6)} fill={L12_COLORS.snow} />
            <HazeBand y={700} h={200} color="#FF8A2A" strength={0.4} />
          </Form>
          {/* the river in the notch and the rock it carries off downstream (right) */}
          <rect x={902} y={notch - 12} width={106} height={14} rx={6} fill="#7FD0E8" />
          {lane(f, 16, 960, 2200, 5, 14).map((p, i) => (
            <circle key={i} cx={p.x} cy={notch - 20 + rnd(i) * 30 - 380 * Math.sin(p.phase * Math.PI)} r={3 + rnd(i * 3) * 4} fill={mixHex(F.mid, F.light, 0.4)} opacity={(1 - p.phase) * 0.9 * cut} />
          ))}
        </g>
        {/* ghost of where the surface was, and the up arrows */}
        <g opacity={sm(f, t1 + 6, t1 + 26)}>
          <path d={smoothPath(top.filter((_, i) => i < 6 || i > 8))} fill="none" stroke={F.text} strokeWidth={2} strokeDasharray="8 8" opacity={0.5} />
          {[520, 1340].map((x) => (
            <g key={x} transform={`translate(0 ${(-((f * 0.8) % 20)).toFixed(1)})`}>
              <Emissive d={`M${x} 800 V700 M${x - 26} 730 L${x} 696 L${x + 26} 730`} color={F.light} width={6} glow={8} />
            </g>
          ))}
        </g>
      </Layer>
      <Layer depth={1.25}>
        <Snow f={f} n={36} seed={8} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, t1 + 4, t1 + 24)}>
          <Pill x={120} y={128} text="UNLOADED → RISES" fill={pillFill(F)} color={F.text} dot={F.light} size={20} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} ceiling={{ v: 9000 /* #9 */ }} base="ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// 6-08 · the tank from scene 2 (MODEL): Tick tosses a block overboard and the raft rides higher
const ShotBoat: ShotFC<CL06> = ({ f, len }) => {
  const F = NOON;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 960, y: 560, zoom: 1.05 }, { f: len + 20, x: 980, y: 530, zoom: 1.18 }]));
  const toss = clamp01((f - 6) / 22);
  const rise = sm(f, 22, 50) * 34;
  const water = 620;
  const raftY = water + 16 - rise;
  const bx = lerp(1010, 1330, toss);
  const by = raftY - 190 - Math.sin(toss * Math.PI) * 150 + toss * toss * 260;
  const splash = f - 28;
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.1} grain={0.5}>
      <Layer depth={0.05}>
        <Sky stops={["#F8EEDC", "#F1E2C8", "#E6D2B0"]} />
        <Bloom x={1700} y={200} r={900} color={F.light} strength={0.7} spread={0.4} />
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={880} width={2720} height={600} fill="#C9AF86" />
        <rect x={-400} y={880} width={2720} height={10} fill="#AE9068" />
        <Motes frame={f} n={30} x={900} y={100} w={900} h={760} color={F.light} seed={21} size={3.5} drift={30} />
        {/* the tank: thick sea-glass fluid in glass */}
        <path d={seaSurface(f, 420, 1500, water, 5, 360, 0.5, 880, 40)} fill="#7FAE9F" opacity={0.92} />
        <path d={seaSurface(f, 420, 1500, water + 70, 4, 300, 0.4, 880, 40)} fill="#5F9486" opacity={0.6} />
        <rect x={420} y={420} width={1080} height={460} rx={10} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={0.7} />
        <rect x={440} y={436} width={18} height={420} rx={8} fill="#FFFFFF" opacity={0.3} />
        {splash > 0 ? <Ripples frame={splash} cx={1330} cy={water + 4} rx={150} ry={22} period={16} count={3} color="#EAF7F2" width={4} /> : null}
        <Bobber frame={f} x={900} y={raftY} amp={3} roll={1.2} period={130}>
          <SlateBlock x={720} y={raftY + 34} w={380} h={60} family={F} shadow={false} />
          <Tick x={880} y={raftY - 26} pxPerM={150} frame={f} pose="heave" poseTo="cheer" poseT={clamp01((f - 24) / 26) * 1.5} expression="determined" expressionTo="happy" expressionT={clamp01((f - 22) / 14)} look={0.5} outline={F.shadow} />
        </Bobber>
        <g transform={`rotate(${toss * 120} ${bx} ${by})`} opacity={by > water + 40 ? 0.35 : 1}>
          <SlateBlock x={bx - 40} y={by + 30} w={80} h={60} family={F} shadow={false} />
        </g>
        {/* the old waterline mark on the raft's side */}
        <line x1={700} y1={water + 16} x2={640} y2={water + 16} stroke={F.text} strokeWidth={3} strokeDasharray="8 6" opacity={sm(f, 30, 44)} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={128} text="MODEL" fill={pillFill(F)} color="#FFF8E8" dot="#7FD0E8" size={20} />
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} ceiling={{ v: 9000 /* #9 */ }} base="ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// 6-09 / 6-10 · the gauge top, magnified: the RIVER band (15-50 m, #6); then three peaks nudged up by it
const ShotBand: ShotFC<CL06> = ({ f, len, c }) => {
  const F = DUSK;
  const t1 = c.peaks - c.band;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 900, y: 540, zoom: 1.0 }, { f: t1, x: 960, y: 540, zoom: 1.05 }, { f: len + 20, x: 1040, y: 520, zoom: 1.12 }]));
  // magnified ruler: 8,750 … 8,880 m over 620 px
  const y0 = 860;
  const pxPerM = 620 / 130;
  const yOf = (m: number) => y0 - (m - 8750) * pxPerM;
  const grow = sm(f, 10, 50);
  const topM = HEIGHTS.everest; // #1
  const bandLo = topM - 50 * grow; // #6: 15-50 m of the present height
  const bandHi = topM - 15 * grow;
  const rx = 330;
  const peaks = [
    { x: 940, h: 330, name: "LHOTSE", at: t1 + 16 },
    { x: 1200, h: 400, name: "", at: t1 + 4 },
    { x: 1470, h: 320, name: "MAKALU", at: t1 + 28 },
  ];
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.24} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={60} w={1920} h={420} color={F.text} seed={15} size={1.3} />
        <Bloom x={1650} y={700} r={760} color={F.light} strength={0.55} spread={0.3} squash={0.7} />
      </Layer>
      <Layer depth={0.3} haze={{ color: F.haze, amount: 0.42 }}>
        <path d={ridgePath([[-400, 760], [100, 690], [500, 740], [900, 670], [1300, 730], [1800, 660], [2400, 740]], 1300, 30)} fill={F.far} />
        <HazeBand y={640} h={300} color={F.haze} strength={0.35} />
        <CloudRack f={f} n={5} x0={300} x1={2400} y0={700} y1={860} size={70} speed={1.8} body={mixHex(F.haze, "#FFF4E6", 0.4)} under={mixHex(F.light, "#FFFFFF", 0.3)} seed={8} />
      </Layer>
      <Layer depth={1}>
        {/* the three peaks: each hops (squash) as the band lifts it; no heights are claimed for the neighbours */}
        {peaks.map((p, i) => {
          const hop = sm(f, p.at, p.at + 10) * 14 + Math.sin(clamp01((f - p.at) / 14) * Math.PI) * 16;
          const sq = impact(f, p.at + 14, 0.06, 10);
          const base = 980;
          const pts: Pt[] = [[p.x - 900, base + 700], [p.x - 170, base - p.h * 0.5], [p.x - 50, base - p.h * 0.9], [p.x, base - p.h], [p.x + 60, base - p.h * 0.86], [p.x + 190, base - p.h * 0.45], [p.x + 900, base + 700]];
          const lit = sm(f, p.at, p.at + 12);
          return (
            <g key={i} opacity={sm(f, t1 - 16 + i * 4, t1 + i * 4)} transform={`translate(0 ${(-hop).toFixed(1)}) translate(${p.x} ${base}) scale(${sq.sx} ${sq.sy}) translate(${-p.x} ${-base})`}>
              <Form d={ridgePath(pts, base + 700, 10)} fill={i === 1 ? F.mid : hazed(F, F.mid, 0.18)} light={12} shadow={F.shadow} inset={26} rim={F.light} rimWidth={3.5} bounce={F.bounce}>
                
                <path d={roundPoly([[p.x - 90, base - p.h * 0.74], [p.x - 50, base - p.h * 0.9], [p.x, base - p.h], [p.x + 60, base - p.h * 0.86], [p.x + 110, base - p.h * 0.7], [p.x + 20, base - p.h * 0.76]], 6)} fill={L12_COLORS.snow} />
                <rect x={p.x - 200} y={base - p.h - 4} width={400} height={16} fill="#7FD0E8" opacity={0.85 * lit} />
              </Form>
              {i === 1 ? <circle cx={p.x} cy={base - p.h - 8} r={8} fill={P.vermilion} /> : null}
              {p.name ? <Pill x={p.x} y={base - p.h - 52} text={p.name} fill={pillFill(F)} color={F.text} size={18} align="middle" /> : null}
            </g>
          );
        })}
        <Snow f={f} n={30} seed={9} />
      </Layer>
      <Layer depth={0}>
        {/* the magnified gauge top */}
        <g>
          <rect x={rx - 150} y={200} width={220} height={700} fill={alpha(F.theme.bg, 0.94)} stroke={F.text} strokeWidth={1.5} />
          <rect x={rx} y={220} width={22} height={660} fill={F.theme.panel} stroke={F.text} strokeWidth={1.5} />
          <rect x={rx} y={yOf(topM)} width={22} height={880 - yOf(topM)} fill={P.vermilion} />
          <rect x={rx} y={yOf(bandHi)} width={22} height={Math.max(0, yOf(bandLo) - yOf(bandHi))} fill="#7FD0E8" />
          <rect x={rx + 28} y={yOf(topM)} width={10} height={Math.max(0, yOf(bandLo) - yOf(topM))} fill="#7FD0E8" />
          {[8760, 8780, 8800, 8820, 8840, 8860, 8880].map((m) => (
            <g key={m}>
              <line x1={rx - 14} y1={yOf(m)} x2={rx} y2={yOf(m)} stroke={F.text} strokeWidth={1.5} />
              <text x={rx - 22} y={yOf(m) + 7} textAnchor="end" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 20, fill: F.text, fontVariantNumeric: "tabular-nums" }}>
                {m.toLocaleString("en-US")}
              </text>
            </g>
          ))}
          <path d={`M${rx + 44} ${yOf(topM)} l16 -9 v18 Z`} fill={P.vermilion} />
          <text x={rx - 40} y={176} textAnchor="middle" style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, letterSpacing: 4, fill: F.dim }}>
            HEIGHT · MAGNIFIED
          </text>
        </g>
        <g opacity={sm(f, 8, 28)}>
          <Kicker x={470} y={128} text="— 2024 · NATURE GEOSCIENCE · ONE STUDY'S MODEL" color={F.dim} size={18} />
          <Metric x={470} y={220} value="15-50 m" size={84} color={F.text} />
          <Pill x={470} y={272} text="RIVER · PART OF TODAY'S HEIGHT" fill={pillFill(F)} color={F.text} dot="#7FD0E8" size={16} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} ceiling={{ v: 9000 /* #9 */ }} base="ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// 6-11 · two bars: the long-term ~1 mm a year beside today's ~2 mm a year → ×2
const ShotTwice: ShotFC<CL06> = ({ f, len }) => {
  const F = DUSK;
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 20, x: 940, y: 520, zoom: 1.1 }]));
  const base = 860;
  const unit = 250; // px per mm a year
  const a = sm(f, 6, 30);
  const b = sm(f, 22, 54);
  const bar = (x: number, h: number, col: string) => (
    <Form d={rrect(x, base - h, 150, Math.max(2, h), 10)} fill={col} light={12} shadow={F.shadow} inset={18} rim={F.light} rimWidth={3} bounce={F.bounce} />
  );
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.24} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={60} w={1920} h={420} color={F.text} seed={17} size={1.3} />
        <Bloom x={1650} y={700} r={760} color={F.light} strength={0.55} spread={0.3} squash={0.7} />
      </Layer>
      <Layer depth={0.3} haze={{ color: F.haze, amount: 0.42 }}>
        <path d={ridgePath([[-400, 780], [100, 700], [500, 750], [900, 660], [1300, 740], [1800, 680], [2400, 760]], 1300, 30)} fill={F.far} />
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={base} width={2720} height={500} fill={F.near} />
        <GroundShadow x={900} y={base + 6} rx={420} color={F.shadow} opacity={0.4} blur={16} />
        {bar(640, unit * 1 * a /* #6 long-term ~1 mm/yr */, "#7FAE9F")}
        {bar(960, unit * 2 * b /* #6 GPS ~2 mm/yr */, P.vermilion)}
        <g opacity={sm(f, 50, 66)} stroke={F.text} strokeWidth={3} fill="none">
          <path d={`M1150 ${base - unit} h40 v${-unit} h-40`} />
        </g>
        <g opacity={a}>
          <Pill x={715} y={base + 50} text="LONG-TERM ~1 mm A YEAR" fill={pillFill(F)} color={F.text} dot="#7FAE9F" size={18} align="middle" />
        </g>
        <g opacity={b}>
          <Pill x={1035} y={base + 96} text="TODAY ~2 mm A YEAR" fill={pillFill(F)} color={F.text} dot={P.vermilion} size={18} align="middle" />
        </g>
        <Snow f={f} n={40} seed={10} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 50, 66)} transform={`translate(1230 ${base - unit * 1.5 + 30}) scale(${1 + 0.2 * (1 - sm(f, 50, 62))})`}>
          <Metric x={0} y={0} value="×2" size={110} color={F.text} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} ceiling={{ v: 9000 /* #9 */ }} base="ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// 6-12 / 6-13 · the summit: REBOUND up, EROSION down (no rates, F9), the collision arrow fades; then the land around
// lowers and is carried off while the peak rides up
const ShotArrows: ShotFC<CL06> = ({ f, len, c }) => {
  const F = DUSK;
  const t1 = c.peel - c.arrows;
  const cam = pop(f, cameraAt(f, [onMassif(0, 940, 440, 1.5), onMassif(t1, 950, 470, 1.7), onMassif(len + 20, 960, 520, 1.5)]));
  const up = sm(f, 8, 30);
  const dn = sm(f, 24, 46);
  const coll = sm(f, 4, 20) * (1 - sm(f, 40, 90));
  const peel = sm(f, t1, len);
  const arrow = (x: number, y0: number, y1: number, col: string, w = 10) => {
    const d = y1 < y0 ? -1 : 1;
    return `M${x} ${y0} V${y1} M${x - w * 2.4} ${y1 - d * w * 2.6} L${x} ${y1} L${x + w * 2.4} ${y1 - d * w * 2.6}`;
  };
  const band = (x0: number, x1: number) => {
    const pts: Pt[] = [];
    for (let x = x0; x <= x1; x += 60) pts.push([x, massifY(x) + 2]);
    const low = pts.map(([x, y]): Pt => [x, y + 22]).reverse();
    return roundPoly([...pts, ...low], 6);
  };
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.24} grain={0.5}>
      <Summit f={f} family={F} light={12} sun={null} sunGlow={0.55} tick={{ pxPerM: 40, pose: "stand", expression: "neutral", look: -0.4 }} spot />
      <Layer depth={0.6}>
        <CloudRack f={f + 500} n={5} x0={200} x1={1900} y0={520} y1={640} size={60} speed={1.2} body={mixHex(F.haze, "#FFF4E6", 0.35)} under={mixHex(F.light, "#FFFFFF", 0.3)} seed={12} />
        <Streamers f={f} n={18} x0={SUMMIT.x - 10} x1={SUMMIT.x + 420} y0={SUMMIT.y - 30} y1={SUMMIT.y + 20} len={70} width={3} speed={2.2} slope={0.16} color="#FFFFFF" opacity={0.6} seed={7} />
        {/* 6-13: a band of the flanks peels off and leaves as specks, downstream to the right */}
        <g opacity={peel * (1 - peel * 0.6)} transform={`translate(${peel * 60} ${peel * 30})`}>
          <path d={band(1180, 1880)} fill={mixHex(F.mid, F.light, 0.35)} />
          <path d={band(40, 640)} fill={mixHex(F.mid, F.light, 0.2)} />
        </g>
        {lane(f, 22, 1200, 2400, 5, 31).map((p, i) => (
          <circle key={i} cx={p.x} cy={massifY(Math.min(p.x, 1890)) + 18 + rnd(i) * 26} r={2.5 + rnd(i * 3) * 3.5} fill={mixHex(F.mid, F.light, 0.5)} opacity={peel * (1 - p.phase)} />
        ))}
        {/* arrows: collision (grey, fading), rebound up (light, longer), erosion down (ice, shorter) */}
        <g opacity={coll * 0.7}>
          <path d={`M300 560 H620 M590 536 L622 560 L590 584`} stroke={F.dim} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g opacity={up} transform={`translate(0 ${(-peel * 14 - Math.sin(f / 12) * 4).toFixed(1)})`}>
          <Emissive d={arrow(SUMMIT.x - 70, 520, 520 - 170 * up, F.light)} color={F.light} core="#FFF6DC" width={11} glow={16} strength={0.8} />
        </g>
        <g opacity={dn} transform={`translate(0 ${(Math.sin(f / 12) * 3).toFixed(1)})`}>
          <path d={arrow(SUMMIT.x + 90, 360, 360 + 110 * dn, L12_COLORS.ice)} stroke={L12_COLORS.ice} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* ice chips flying off the peak */}
        {lane(f, 9, 0, 200, 2.2, 33).map((p, i) => (
          <rect key={i} x={SUMMIT.x + 30 + p.x * (0.6 + rnd(i))} y={SUMMIT.y + 10 + p.x * p.x * 0.004 + rnd(i * 3) * 30} width={7} height={5} fill="#FFFFFF" opacity={dn * (1 - p.phase)} transform={`rotate(${p.x * 3} ${SUMMIT.x + 30 + p.x} ${SUMMIT.y + 10})`} />
        ))}
        <g opacity={up}>
          <Pill x={SUMMIT.x - 110} y={560} text="REBOUND" fill={pillFill(F)} color={F.text} dot={F.light} size={17} align="end" />
        </g>
        <g opacity={dn}>
          <Pill x={SUMMIT.x + 130} y={400} text="EROSION" fill={pillFill(F)} color={F.text} dot={L12_COLORS.ice} size={17} />
        </g>
      </Layer>
      <Layer depth={1.25}>
        <Snow f={f} />
      </Layer>
      <Layer depth={0}>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} readout="8,848.86 m" ceiling={{ v: 9000 /* #9 */ }} base="ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// 6-14 · Tick large: the fossil shell held up as the first sun crests
const ShotShell: ShotFC<CL06> = ({ f, len }) => {
  const F = DUSK;
  const ppm = 130;
  const cam = pop(f, cameraAt(f, [onMassif(0, 985, 190, 3.6), onMassif(len + 20, 1000, 210, 3.0)]));
  const crest = sm(f, 0, len * 0.7);
  const sun = { x: 1420, y: lerp(700, 566, crest) };
  const raise = clamp01((f - 6) / 30) * 1.6;
  const s = ppm / 100;
  const hk = sm(f, 10, 34);
  const hx = SUMMIT.x + lerp(36, 46, hk) * s;
  const hy = SUMMIT.y + lerp(-104, -152, hk) * s;
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.22} grain={0.5}>
      <Summit f={f} family={F} light={10} sun={sun} sunGlow={lerp(0.5, 1.25, crest)} tick={{ pxPerM: ppm, pose: "hold", poseTo: "heave", poseT: raise, expression: "thinking", expressionTo: "proud", expressionT: sm(f, 20, 40), look: 0.7 }} />
      <Layer depth={0.6}>
        <Bloom x={hx + 8} y={hy - 18} r={60} color={F.light} strength={0.5 * crest} spread={0.4} />
        <FossilShell x={hx + 8} y={hy - 20} r={0.13 * ppm} family={F} light={10} rot={-12 + Math.sin(f / 30) * 3} />
      </Layer>
      <Layer depth={1.25}>
        <Snow f={f} n={40} />
        <Motes frame={f} n={20} x={700} y={200} w={1000} h={600} color={F.light} seed={19} size={2.6} />
      </Layer>
      <Layer depth={0}>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} readout="8,848.86 m" ceiling={{ v: 9000 /* #9 */ }} base="ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// 6-15 · the gauge zooms out by decades; the Earth shrinks to a disc with rings; two more discs slide in
const ShotZoomOut: ShotFC<CL06> = ({ f, len }) => {
  const F = VOID;
  const k = sm(f, 0, 46);
  const cam = pop(f, cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 20, x: 990, y: 540, zoom: 1.08 }]));
  const r = Math.exp(lerp(Math.log(2600), Math.log(170), k));
  const ex = lerp(960, 520, k);
  const ey = lerp(540 + 2600 - 240, 560, k);
  const slide = sm(f, 34, 70);
  const s = 170 / DISC_KM.earth;
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.26} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Sky family={DUSK} opacity={1 - sm(f, 0, 30)} />
        <Stars frame={f} n={120} w={1920} h={1080} color={F.text} seed={23} size={1.4} twinkle={0.7} />
        <Bloom x={-200} y={300} r={900} color={F.light} strength={0.3} spread={0.3} />
      </Layer>
      <Layer depth={1}>
        <Disc x={ex} y={ey} r={r} world="earth" f={f} light={200} bg={F} />
        {/* tick rings: the gauge's decades, drawn around the disc (not to scale) */}
        <g fill="none" stroke={F.text} opacity={0.5 * sm(f, 30, 50)}>
          {[1.16, 1.34].map((q, i) => (
            <circle key={i} cx={ex} cy={ey} r={r * q * (1 + 0.01 * Math.sin(f / 20 + i))} strokeWidth={1.5} strokeDasharray="4 10" strokeDashoffset={f * (i ? -0.4 : 0.4)} />
          ))}
        </g>
        <Disc x={lerp(2300, 930, slide)} y={560} r={DISC_KM.venus * s} world="venus" f={f} light={200} bg={F} />
        <Disc x={lerp(2700, 1210, slide)} y={560} r={DISC_KM.mars * s} world="mars" f={f} light={200} bg={F} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 44, 60)}>
          <Pill x={120} y={128} text="DISCS · ONE DIAMETER SCALE" fill={pillFill(F)} color={F.text} dot={F.light} size={18} />
          <Pill x={120} y={174} text="RINGS NOT TO SCALE" fill={pillFill(F)} color={F.text} size={16} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} max={10000} zoomTo={100000} zoomT={sm(f, 4, 44)} ceiling={{ v: 9000 /* #9 */ }} base="EVEREST · ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// act break: 14 black frames + sting, then ChapterCard 4 "Now Change the Planet" on the void field
const ShotCard: ShotFC<CL06> = ({ f, len }) => (
  <>
    {chapterFourCard(clamp01((f - 12) / Math.max(1, len - 12)) * 0.84, f)}
    <Black opacity={1 - sm(f, 12, 24)} />
  </>
);

export const SceneL06: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL06(t);
  const shots: ShotDef<CL06>[] = [
    { from: 0, S: ShotDawn, id: "6-01" },
    { from: c.map, S: ShotMap, id: "6-03" },
    { from: c.gorge, S: ShotGorge, id: "6-05" },
    { from: c.section, S: ShotSection, id: "6-06" },
    { from: c.boat, S: ShotBoat, id: "6-08" },
    { from: c.band, S: ShotBand, id: "6-09" },
    { from: c.twice, S: ShotTwice, id: "6-11" },
    { from: c.arrows, S: ShotArrows, id: "6-12" },
    { from: c.shell, S: ShotShell, id: "6-14" },
    { from: c.zoom, S: ShotZoomOut, id: "6-15" },
    { from: c.brk, S: ShotCard, id: "7-00" },
  ];
  return playShots(f, shots, c, t.frames);
};

export const soundL06 = (t: SceneTiming): Cue[] => {
  const c = cuesL06(t);
  return [
    { at: 0, file: SFX.wind, vol: 0.16, dur: c.map, fadeIn: 16, fadeOut: 14 },
    ...[30, 50, 70, 90].map((o) => ({ at: o, file: SFX.click, vol: 0.12, dur: 10 })),
    { at: c.lifting + 6, file: SFX.pop, vol: 0.26, dur: 20 },
    { at: c.lifting, file: SFX.rumble, vol: 0.2, dur: c.map - c.lifting, fadeIn: 8, fadeOut: 10 },
    ...cutHit(c.map),
    { at: c.capture, file: SFX.popLong, vol: 0.3, dur: 30 },
    { at: c.capture + 6, file: SFX.swirl, vol: 0.24, dur: 50 },
    ...cutHit(c.gorge),
    { at: c.gorge + 4, file: SFX.swirl, vol: 0.2, dur: 50 },
    ...cutHit(c.section),
    { at: c.section + 20, file: SFX.debris, vol: 0.14, dur: 90, fadeOut: 30 },
    { at: c.rises, file: SFX.riser, vol: 0.16, dur: 80, fadeOut: 20 },
    ...cutHit(c.boat),
    { at: c.boat + 28, file: SFX.pop, vol: 0.28, dur: 20 },
    { at: c.boat + 30, file: SFX.swirl, vol: 0.2, dur: 40 },
    ...cutHit(c.band),
    { at: c.band + 14, file: SFX.popLong, vol: 0.3, dur: 30 },
    ...[4, 16, 28].map((o) => ({ at: c.peaks + o + 14, file: SFX.pop, vol: 0.24, dur: 20 })),
    ...cutHit(c.twice),
    { at: c.twice + 10, file: SFX.click, vol: 0.2, dur: 14 },
    { at: c.twice + 52, file: SFX.pop, vol: 0.3, dur: 20 },
    ...cutHit(c.arrows),
    { at: c.arrows + 10, file: SFX.pop, vol: 0.24, dur: 20 },
    { at: c.arrows + 26, file: SFX.pop, vol: 0.24, dur: 20 },
    { at: c.peel, file: SFX.swirl, vol: 0.2, dur: 50 },
    ...cutHit(c.shell),
    { at: c.shell + 30, file: SFX.chime, vol: 0.26, dur: 60 },
    { at: c.shell + 90, file: SFX.click, vol: 0.18, dur: 12 },
    ...cutHit(c.zoom),
    { at: c.zoom, file: SFX.riser, vol: 0.22, dur: c.brk - c.zoom, fadeOut: 10 },
    ...sting(c.brk),
  ];
};
