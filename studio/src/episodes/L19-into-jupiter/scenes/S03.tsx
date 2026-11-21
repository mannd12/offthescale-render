// L19 scene "l03" · The wind that didn't fade (storyboard §3 act 2: 3-01…3-15, script lines 16-22; crest ↔ deepdeck ↔ limb).
// Shot components (hard cuts only; PUSH rows are phases of one component):
//   3-01          KEY ART 2: the probe under its canopy on the top deck; three bands tearing sideways in opposite directions
//                 with long streaks (24 px/f), the teal belt, the WIND bar growing (30 px/f); 80 TO 100 M/S
//   3-02 (+3-03)  the probe sinks; each lower band's streaks are faster (24 → 40 px/f), decks up 20 px/f, the bar grows. Push to
//                 the dial: the needle sweeps to 4 (4 deg/f), the WIND bar tops out with a fluttering flag; 170 M/S + 4 BAR
//   3-04          170 M/S slides into the unit slot and ABOUT 610 KM/H rolls out (OUR SUM, #15 C); a speed bar races (44 px/f)
//   3-05 (+3-06)  the needle sweeps 4 → 21 (3 deg/f) while the WIND bar holds level and its level line streams (36 px/f). Push to
//                 the wind trace printing down the log pressure axis to the 21 mark, then a pulse runs it (34 px/f);
//                 DOWN TO 21 BAR (no "deepest" bracket, Q10)
//   3-07          Tick draws a straight line across three equal bars (44 px/f), their flags flutter, streaks behind (30 px/f)
//   3-08          the sun at the top, its chevron arrow pushing down (24 px/f), the bands shearing (24 px/f); SUNLIGHT?
//   3-09          the glowing arrow rising from below (24 px/f), the seesaw tilting both ways (neither wins); HEAT FROM INSIDE?
//   3-10          Juno glides over the limb (24 px/f), the dashed line drops into the planet (44 px/f); 3,000 KM + JUNO SAYS
//   3-11 (+3-12)  the 156 km bracket stamps itself down the line (every 4 f, 26 px/f with the camera); ABOUT 20 TIMES DEEPER +
//                 OUR SUM (#16 C). Push: a thin gold shell fills round the planet's edge (30 px/f), the mass bar fills (24 px/f)
//                 with its 1 % sliver; ABOUT 1 % OF THE MASS
//   3-13          the top of the jet column: the stream bundle flowing down past the tiny 156 km cap (32 px/f), streaks
//   3-14 (+3-15)  the flat map, the Great Red Spot's arms turning (6 deg/f), its depth bar dropping (36 px/f); ABOUT 500 KM +
//                 NASA SAYS (#10, Q3). Push: the disc, a thin skin drawing round the whole limb (40 px/f); no numeral (Q4)
// Numbers drawn (data19 READ): wind80_100 (#5 A) · wind170 170 (#5 A) · bar4 4, bar21 21 (#5 A; needle stops, F6) · kmh610 610
// (#15 C, OUR SUM) · jet3000 3,000 (#14 A, JUNO SAYS) · times20 20 (#16 C, OUR SUM) · massPct1 1 (#14 A) · grs500 500 (#10 A,
// NASA SAYS) · km156 156 (#4 A). Axis numerals 1, 4, 21 are SCALE_LABELS. F12: the oval is the only named feature.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Layer, Sky, Stage, Tick } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { ShotDef, ShotFC, playShots } from "../shots";
import { BarDial, needleTo } from "../dial";
import { FlatMap, WindStreaks } from "../decks";
import { Canopy, Capsule, Orbiter } from "../probe19";
import { AgencyPill, OurSumPill, QuestionTag } from "../tags19";
import { Sparks } from "../flows19";
import { SunIcon } from "../icons19";
import { IF2 } from "../../../lib/illustrated";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  C,
  CREST,
  ChevronArrow,
  ClipCircle,
  DEEP,
  DRIFT,
  Descent,
  DriftBands,
  LIMB,
  Limb,
  MetricA,
  Phase,
  Plate,
  Pop,
  Roll,
  Seesaw,
  SpaceField,
  SpotOval,
  VBracket,
  ez,
  lerp,
  lin,
  wrap,
} from "./a-parts";

export const cuesL03 = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    c02: frac(0, 0.33),
    c03: frac(0, 0.66), // phase ("Between one and four bar")
    c04: at(1),
    c05: at(2),
    c06: frac(2, 0.4), // phase ("all the way down to twenty-one bar")
    c07: frac(2, 0.76),
    c08: at(3),
    c09: frac(3, 0.5),
    c10: at(4),
    c11: frac(4, 0.5),
    c12: at(5), // phase ("The authors estimate")
    c13: frac(5, 0.34),
    c14: frac(5, 0.68),
    c15: at(6), // phase ("Even that storm")
    end: t.frames,
  };
};
export type CL03 = ReturnType<typeof cuesL03>;

const Probe: React.FC<{ f: number; x: number; y: number; r: number; sway?: number }> = ({ f, x, y, r, sway = 8 }) => (
  <g>
    <Canopy x={x} y={y} r={r} unfurl={1} f={f} sway={sway} />
    <Capsule x={x} y={y} r={r} f={f} chips={6} />
  </g>
);
/** The WIND bar: a lemon bar from the base `y` up `h` px with a flag fluttering at its top. */
const WindBar: React.FC<{ f: number; x: number; y: number; h: number; w?: number }> = ({ f, x, y, h, w = 90 }) => {
  const top = y - h;
  const fl = Math.sin(f * 0.6) * 18;
  return (
    <g>
      <rect x={x - w / 2 + 6} y={top + 8} width={w} height={h} rx={14} fill="#1A0402" opacity={0.3} />
      <rect x={x - w / 2} y={top} width={w} height={h} rx={14} fill={C.heard} />
      <rect x={x - w / 2} y={top} width={w * 0.25} height={h} rx={10} fill={C.lemonDeep} />
      <line x1={x} y1={top} x2={x} y2={top - 90} stroke={C.goldRim} strokeWidth={6} />
      <path d={`M${x} ${top - 90} Q${x + 50} ${top - 90 + fl} ${x + 110} ${top - 76 + fl * 0.6} L${x + 110} ${top - 46 + fl * 0.6} Q${x + 50} ${top - 56 + fl} ${x} ${top - 50} Z`} fill={C.belt} />
      <text x={x} y={y + 50} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 32, letterSpacing: 4, fill: "#FFEFC8" }}>
        WIND
      </text>
    </g>
  );
};

// ================================================================================================================
// 3-01 · KEY ART 2: the probe on its canopy over the top deck; three bands tear sideways in opposite directions (shear
// 22-28 px/f) under long streaks (24 px/f), one teal belt; the WIND bar grows (30 px/f) then its flag flutters; 80 TO 100 M/S
// ================================================================================================================
const ShotWinds: ShotFC<CL03> = ({ f }) => (
  <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(1, 1.1, 0.04)} vignette={0.2} grain={0.5}>
    <Descent f={f} fam="crest" speed={4} shear={[24, -26, 28, -22, 26, -24]} seed={61} />
    <Layer depth={1}>
      <WindStreaks f={f} bands={[{ y: 380, h: 150, dir: 1 }, { y: 590, h: 150, dir: -1 }, { y: 800, h: 170, dir: 1 }]} speed={24} />
      <Probe f={f} x={980} y={260} r={74} sway={8} />
      <WindBar f={f} x={1700} y={960} h={Math.min(240, 40 + f * 30)} />
    </Layer>
    <Layer depth={0}>
      <rect x={80} y={100} width={720} height={190} rx={30} fill="rgba(43,9,5,0.62)" />
      <MetricA x={110} y={240} value="80 TO 100" unit="M/S" size={110} reveal={lin(f, 4, 16)} />
    </Layer>
  </Stage>
);

// ================================================================================================================
// 3-02 + 3-03 · the probe sinks: each lower band's streaks run faster (24 / 32 / 40 px/f), the decks rise (20 px/f), the WIND
// bar grows. Push to the dial: the needle sweeps 1 → 4 (4 deg/f), the WIND bar rises tall (36 px/f) and its flag flutters,
// streaks at 40 px/f; 170 M/S + 4 BAR (#5)
// ================================================================================================================
const ShotSpeedUp: ShotFC<CL03> = ({ f, c }) => {
  const T3 = c.c03 - c.c02;
  const A = (
    <Pop f={f}>
      <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(2, 1.12, 0.02, 0.03)} vignette={0.2} grain={0.5}>
        <Descent f={f} fam="crest" speed={20} shear={[24, -28, 30, -32, 34, -36]} seed={62} />
        <Layer depth={1}>
          <WindStreaks f={f} bands={[{ y: 360, h: 150, dir: 1 }]} speed={24} seed={3} />
          <WindStreaks f={f} bands={[{ y: 580, h: 150, dir: -1 }]} speed={32} seed={4} />
          <WindStreaks f={f} bands={[{ y: 800, h: 170, dir: 1 }]} speed={40} seed={5} />
          <Probe f={f} x={960} y={250} r={66} />
          <WindBar f={f} x={1700} y={960} h={lerp(240, 420, lin(f, 0, T3))} />
        </Layer>
      </Stage>
    </Pop>
  );
  const g = Math.max(0, f - T3);
  const B = (
    <Stage theme={DEEP.theme} shotFrame={g} drift={DRIFT(3, 1.1, 0.04)} vignette={0.2} grain={0.5}>
      <Descent f={f} fam="deep" speed={16} shear={[30, -34, 36, -32, 38, -30]} seed={63} />
      <Layer depth={1}>
        <WindStreaks f={f} bands={[{ y: 120, h: 220, dir: 1 }, { y: 420, h: 220, dir: -1 }, { y: 760, h: 220, dir: 1 }]} speed={40} />
        <Probe f={f} x={440} y={230} r={56} />
        <WindBar f={f} x={820} y={920} h={Math.min(640, 420 + g * 36)} />
        <BarDial f={g} cx={1400} cy={460} r={300} needle={needleTo(1, 4, lin(g, 4, 30))} lit={12} sweep={12} />
      </Layer>
      <Layer depth={0}>
        <rect x={60} y={860} width={560} height={170} rx={30} fill="rgba(58,8,6,0.6)" />
        <MetricA x={90} y={990} value={String(170) /* #5 */} unit="M/S" size={120} reveal={lin(g, 10, 20)} />
        <Plate x={1400} y={870} text="4 BAR" size={40} align="middle" appear={lin(g, 28, 36)} fill={C.heard} color={C.ink} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T3 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 3-04 · our sum: the 170 M/S chip slides into the unit slot (30 px/f) and ABOUT 610 KM/H rolls out (OUR SUM, #15 C);
// a speed bar races across (44 px/f); streaks at 40 px/f
// ================================================================================================================
const ShotConvert: ShotFC<CL03> = ({ f, len }) => {
  const cx = lerp(110, 640, lin(f, 0, 18));
  const rx = wrap(f * 44, 2600) - 600;
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} shotFrame={f} drift={DRIFT(4, 1.1, 0.04)} vignette={0.2} grain={0.5}>
        <Descent f={f} fam="deep" speed={14} shear={[32, -36, 34, -38, 30, -34]} seed={64} />
        <Layer depth={1}>
          <WindStreaks f={f} bands={[{ y: 100, h: 200, dir: 1 }, { y: 760, h: 200, dir: -1 }]} speed={40} />
          <rect x={rx} y={880} width={600} height={40} rx={20} fill={C.heard} opacity={0.35} />
          <rect x={rx + 420} y={872} width={180} height={56} rx={28} fill={C.heard} />
          <rect x={820} y={330} width={280} height={340} rx={30} fill={C.emeraldDeep} stroke={C.goldRim} strokeWidth={8} />
          <rect x={850} y={470} width={220} height={60} rx={12} fill="#002A1A" />
          <text x={960} y={420} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 34, letterSpacing: 3, fill: C.heard }}>
            {"M/S → KM/H"}
          </text>
          {f < 24 ? <Plate x={cx} y={500} text="170 M/S" size={44} fill={C.heard} color={C.ink} /> : null}
          <Sparks f={f} x={1110} y={500} w={240} h={80} n={18} mode="trail" angle={0} />
        </Layer>
        <Layer depth={0}>
          <rect x={1150} y={360} width={720} height={330} rx={30} fill="rgba(58,8,6,0.6)" />
          <Roll x={1190} y={560} k={lin(f, 20, len - 40)} rkey="kmh610" prefix="ABOUT" unit="KM/H" size={140} />
          <OurSumPill x={1200} y={640} size={32} appear={lin(f, 40, 50)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-05 + 3-06 · the needle sweeps 4 → 21 (3 deg/f) while the WIND bar holds level and its level line streams along it
// (36 px/f); streaks 40 px/f. Push to the chart: the wind trace prints down the log pressure axis to the 21 mark (head),
// then a pulse runs down it (34 px/f); the decks rise behind (22 px/f); DOWN TO 21 BAR (#5; no "deepest" bracket, Q10)
// ================================================================================================================
const yOfP = (p: number) => 150 + 800 * (Math.log(p) / Math.log(30));
const TRACE: [number, number][] = [
  [1, 90],
  [1.5, 112],
  [2.2, 140],
  [3, 160],
  [4, 170],
  [6, 168],
  [9, 172],
  [13, 167],
  [17, 171],
  [21, 169],
];
const ShotHold21: ShotFC<CL03> = ({ f, c, len }) => {
  const T6 = c.c06 - c.c05;
  const A = (
    <Pop f={f}>
      <Stage theme={DEEP.theme} shotFrame={f} drift={DRIFT(5, 1.1, 0.03, 0.02)} vignette={0.2} grain={0.5}>
        <Descent f={f} fam="deep" speed={18} shear={[30, -34, 36, -32, 38, -30]} seed={65} />
        <Layer depth={1}>
          <WindStreaks f={f} bands={[{ y: 120, h: 220, dir: 1 }, { y: 760, h: 220, dir: -1 }]} speed={40} />
          <Probe f={f} x={300} y={220} r={50} />
          <WindBar f={f} x={620} y={940} h={640} />
          <line x1={420} y1={300} x2={900} y2={300} stroke="#FFF0A0" strokeWidth={8} strokeDasharray="30 18" strokeDashoffset={-f * 36} />
          <BarDial f={f} cx={1360} cy={460} r={300} needle={needleTo(4, 21, lin(f, 4, 40))} lit={12} sweep={12} />
        </Layer>
        <Layer depth={0}>
          <Plate x={1360} y={870} text="21 BAR" size={40} align="middle" appear={lin(f, 38, 46)} fill={C.heard} color={C.ink} />
        </Layer>
      </Stage>
    </Pop>
  );
  const g = Math.max(0, f - T6);
  const X0 = 520;
  const pts = TRACE.map(([p, v]) => [X0 + (v - 60) * 6, yOfP(p)] as [number, number]);
  const yHead = lerp(yOfP(1), yOfP(21), lin(g, 4, Math.max(30, (len - T6) * 0.65)));
  const shown: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    if (pts[i][1] <= yHead) shown.push(pts[i]);
    else {
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i];
      shown.push([lerp(ax, bx, (yHead - ay) / (by - ay)), yHead]);
      break;
    }
  }
  const head = shown[shown.length - 1];
  const done = yHead >= yOfP(21) - 0.5;
  const py = yOfP(1) + wrap(g * 34, yOfP(21) - yOfP(1));
  const pIdx = pts.findIndex((q) => q[1] >= py);
  const px = pIdx > 0 ? lerp(pts[pIdx - 1][0], pts[pIdx][0], (py - pts[pIdx - 1][1]) / (pts[pIdx][1] - pts[pIdx - 1][1])) : pts[0][0];
  const B = (
    <Stage theme={DEEP.theme} shotFrame={g} drift={DRIFT(6, 1.1, 0.04)} vignette={0.2} grain={0.5}>
      <Descent f={f} fam="deep" speed={22} seed={66} />
      <Layer depth={1}>
        <rect x={300} y={70} width={1340} height={960} rx={36} fill="rgba(58,8,6,0.6)" />
        <line x1={420} y1={yOfP(1)} x2={420} y2={yOfP(30)} stroke={C.apricot} strokeWidth={6} />
        {[1, 4, 21].map((p) => (
          <g key={p}>
            <line x1={404} y1={yOfP(p)} x2={1560} y2={yOfP(p)} stroke={C.apricot} strokeWidth={2} strokeDasharray="8 14" opacity={0.5} />
            <text x={390} y={yOfP(p) + 14} textAnchor="end" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 40, fill: C.heard }}>
              {p}
            </text>
          </g>
        ))}
        <text x={350} y={yOfP(30) + 50} style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 4, fill: C.apricot }}>
          BAR
        </text>
        <text x={1500} y={130} textAnchor="end" style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 4, fill: C.apricot }}>
          {"WIND →"}
        </text>
        <polyline points={shown.map((q) => q.join(",")).join(" ")} fill="none" stroke={C.heard} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
        {!done ? <circle cx={head[0]} cy={head[1]} r={18} fill={C.goldHot} /> : <circle cx={px} cy={py} r={16} fill={C.goldHot} />}
        {done ? <line x1={pts[pts.length - 1][0] - 60} y1={yOfP(21)} x2={pts[pts.length - 1][0] + 60} y2={yOfP(21)} stroke={C.goldHot} strokeWidth={8} /> : null}
      </Layer>
      <Layer depth={0}>
        <Plate x={1180} y={yOfP(21) + 70} text="DOWN TO 21 BAR" size={36} align="middle" appear={done ? 1 : 0} fill={C.heard} color={C.ink} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T6 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 3-07 · the wind did not fade: Tick draws a straight line across three equal bars (44 px/f, then a glint runs it), the bars'
// flags flutter, streaks tear behind (30 px/f)
// ================================================================================================================
const ShotLine: ShotFC<CL03> = ({ f }) => {
  const d = lin(f, 6, 6 + 880 / 44);
  const xe = lerp(620, 1500, d);
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} shotFrame={f} drift={DRIFT(7, 1.1, 0.04)} vignette={0.2} grain={0.5}>
        <Descent f={f} fam="deep" speed={12} shear={[28, -30, 26, -32, 30, -28]} seed={67} />
        <Layer depth={1}>
          <WindStreaks f={f} bands={[{ y: 140, h: 200, dir: 1 }, { y: 500, h: 220, dir: -1 }]} speed={30} />
          {[760, 1060, 1360].map((x) => (
            <WindBar key={x} f={f + x} x={x} y={960} h={520} w={140} />
          ))}
          <line x1={620} y1={410} x2={xe} y2={410} stroke="#FFF0A0" strokeWidth={12} strokeLinecap="round" />
          {d < 1 ? <circle cx={xe} cy={410} r={18} fill={C.goldHot} /> : <circle cx={620 + wrap(f * 44, 880)} cy={410} r={14} fill={C.goldHot} />}
          <Tick x={360} y={1040} pxPerM={230} frame={f} pose="point" expression="determined" headTilt={f > 30 ? Math.sin(f * 0.3) * 8 : 0} look={0.3} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-08 · sunlight? the sun at the top, its chevron arrow pushing down into the bands (24 px/f), the bands shearing (24 px/f),
// the "?" bobbing; SUNLIGHT? (#5)
// ================================================================================================================
const ShotSun: ShotFC<CL03> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={DEEP.theme} shotFrame={f} drift={DRIFT(8, 1.1, 0.04)} vignette={0.2} grain={0.5}>
      <Descent f={f} fam="deep" speed={0} shear={[24, -24, 26, -22, 24, -26]} seed={68} />
      <Layer depth={1}>
        <Bloom x={960} y={160} r={420} color="#FFE066" strength={0.6} />
        <SunIcon x={960} y={160} size={250} f={f} />
        <ChevronArrow x={960} y0={320} y1={780} w={100} f={f} crawl={24} color={C.heard} glow="#FFE066" />
        <QuestionTag x={1220} y={540} f={f} size={110} />
      </Layer>
      <Layer depth={0}>
        <Plate x={110} y={160} text="SUNLIGHT?" size={44} appear={lin(f, 6, 16)} fill={C.heard} color={C.ink} />
      </Layer>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 3-09 · or heat from inside: a glowing arrow rises from below (24 px/f); the seesaw tilts both ways and neither side wins;
// the bands shear (24 px/f); HEAT FROM INSIDE? (#5)
// ================================================================================================================
const ShotSeesaw: ShotFC<CL03> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={DEEP.theme} shotFrame={f} drift={DRIFT(9, 1.1, 0.04)} vignette={0.2} grain={0.5}>
      <Descent f={f} fam="deep" speed={0} shear={[-24, 24, -22, 26, -24, 22]} seed={69} />
      <Layer depth={1}>
        <Bloom x={1560} y={1000} r={420} color={C.glow} strength={0.6} />
        <ChevronArrow x={1560} y0={1060} y1={600} w={100} f={f} crawl={24} color={C.goldHot} glow={C.glow} />
        <Seesaw
          x={860}
          y={560}
          w={980}
          tilt={16 * Math.sin(f * 0.28)}
          left={
            <g transform="translate(0 -100)">
              <SunIcon x={0} y={0} size={150} f={f} />
            </g>
          }
          right={
            <g transform="translate(0 -90)">
              <circle r={90} fill={C.glow} opacity={0.35} />
              <circle r={64} fill={C.gold} stroke={C.goldRim} strokeWidth={8} />
            </g>
          }
        />
      </Layer>
      <Layer depth={0}>
        <Plate x={110} y={160} text="HEAT FROM INSIDE?" size={44} appear={lin(f, 6, 16)} fill={C.heard} color={C.ink} />
      </Layer>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 3-10 · Juno glides in over the limb (24 px/f), a deep dashed line drops into the planet (44 px/f, then its dashes keep
// running down 20 px/f), the limb's bands shear (16-20 px/f); 3,000 KM + JUNO SAYS (#14)
// ================================================================================================================
const ShotJuno: ShotFC<CL03> = ({ f }) => {
  const top = 360;
  const L = 680;
  const d = lin(f, 8, 8 + L / 44);
  return (
    <Pop f={f}>
      <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(10, 1.1, 0.02, 0.04)} vignette={0.3} grain={0.5}>
        <SpaceField f={f} speed={10} n={100} seed={70} />
        <Layer depth={1}>
          <Limb f={f} cx={960} cy={top + 3000} R={3000} shear={[18, -16, 20, -18, 16, -20]} seed={70} />
          <Orbiter x={2000 - f * 24} y={170} kind="juno" f={f} size={1} />
          <line x1={1100} y1={top} x2={1100} y2={top + L * d} stroke="#FFF0A0" strokeWidth={12} strokeDasharray="30 20" strokeDashoffset={-f * 20} />
          {d < 1 ? <circle cx={1100} cy={top + L * d} r={18} fill={C.goldHot} /> : <line x1={1060} y1={top + L} x2={1140} y2={top + L} stroke="#FFF0A0" strokeWidth={10} />}
        </Layer>
        <Layer depth={0}>
          <AgencyPill x={120} y={130} agency="JUNO SAYS" size={32} appear={lin(f, 6, 16)} />
          <MetricA x={110} y={300} value="3,000" unit="KM" size={130} reveal={lin(f, 14, 26)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-11 + 3-12 · the 156 km bracket stamps itself down the line, one every 4 f (26 px/f) with the camera following, each copy a
// little brighter; then a pulse runs down the stack (40 px/f); ABOUT 20 TIMES DEEPER + OUR SUM (#16 C). Push: the disc, a
// thin gold shell filling round its edge (30 px/f, then a glint circles), the mass bar filling (24 px/f) with its 1 % sliver;
// ABOUT 1 % OF THE MASS (#14)
// ================================================================================================================
const ShotTwenty: ShotFC<CL03> = ({ f, c }) => {
  const T12 = c.c12 - c.c11;
  const B0 = 104;
  const n = Math.max(0, Math.min(20, Math.floor((f - 4) / 4) + 1));
  const stackEnd = 180 + n * B0;
  const shift = Math.max(0, stackEnd - 760);
  const A = (
    <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(11, 1.08, 0.03)} vignette={0.3} grain={0.5}>
      <Sky family={LIMB} />
      <Layer depth={1}>
        <Limb f={f} cx={960} cy={5100} R={5000} shear={[16, -20, 18, -14, 20, -18]} scroll={n < 20 ? 26 : 14} glow={0} shade={0} seed={71} />
        <rect x={-100} y={-100} width={2120} height={1280} fill="#2A0804" opacity={0.42} />
        <g transform={`translate(0 ${-shift})`}>
          <line x1={1100} y1={180} x2={1100} y2={180 + 20 * B0} stroke="#FFF0A0" strokeWidth={6} strokeDasharray="20 16" opacity={0.6} />
          {Array.from({ length: n }, (_, i) => (
            <g key={i} opacity={0.55 + 0.45 * (i / 19)}>
              <VBracket x={1100} y0={180 + i * B0 + 4} y1={180 + (i + 1) * B0 - 4} draw={1} cap={36 + i} width={8} color={i % 2 ? C.heard : C.goldHot} />
            </g>
          ))}
          {n >= 20 ? <circle cx={1100} cy={180 + wrap((f - 84) * 40, 20 * B0)} r={18} fill={C.goldHot} /> : null}
        </g>
      </Layer>
      <Layer depth={0}>
        <rect x={80} y={90} width={820} height={360} rx={30} fill="rgba(26,4,2,0.6)" />
        <Roll x={110} y={290} k={lin(f, 4, 84)} rkey="times20" prefix="ABOUT" suffix="TIMES DEEPER" size={150} />
        <OurSumPill x={120} y={410} size={32} appear={lin(f, 40, 50)} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T12);
  const cx = 1200;
  const cy = 560;
  const R = 420;
  const shell = lin(g, 4, 4 + (2 * Math.PI * (R + 22)) / 30);
  const ga = -90 + ((g * 30) / (R + 22)) * (180 / Math.PI);
  const B = (
    <Stage theme={LIMB.theme} shotFrame={g} drift={DRIFT(12, 0.94, 0.03)} vignette={0.3} grain={0.5}>
      <SpaceField f={f} speed={10} n={100} seed={72} />
      <Layer depth={1}>
        <Limb f={f} cx={cx} cy={cy} R={R} shear={[16, -22, 18, -20, 22, -16]} seed={72} />
        <circle cx={cx} cy={cy} r={R + 22} fill="none" stroke={C.gold} strokeWidth={26} pathLength={1} strokeDasharray={`${shell} 1`} transform={`rotate(-90 ${cx} ${cy})`} opacity={0.95} />
        {shell >= 1 ? <circle cx={cx + Math.cos((ga * Math.PI) / 180) * (R + 22)} cy={cy + Math.sin((ga * Math.PI) / 180) * (R + 22)} r={20} fill={C.goldHot} /> : null}
        <rect x={110} y={860} width={700} height={56} rx={14} fill="#5A1206" />
        <rect x={110} y={860} width={700 * lin(g, 4, 4 + 700 / 24)} height={56} rx={14} fill={C.stripeOrange} />
        <rect x={110} y={860} width={7 /* 1 % of 700 px (#14) */} height={56} fill={C.goldHot} />
        <circle cx={114} cy={888} r={44 + 6 * Math.sin(g * 0.3)} fill="none" stroke={C.goldHot} strokeWidth={5} />
      </Layer>
      <Layer depth={0}>
        <Roll x={110} y={330} k={lin(g, 6, 60)} rkey="massPct1" prefix="ABOUT" unit="%" suffix="OF THE MASS" size={150} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T12 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 3-13 · the top of the jet column: the stream bundle flowing down past the tiny 156 km cap (32 px/f), the camera tilting
// along it, streaks tearing sideways, sparks
// ================================================================================================================
const ShotBundle: ShotFC<CL03> = ({ f }) => {
  const top = 220;
  return (
    <Pop f={f}>
      <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(13, 1.1, 0.02, 0.05)} vignette={0.3} grain={0.5}>
        <SpaceField f={f} speed={10} n={80} seed={73} />
        <Layer depth={1}>
          <Limb f={f} cx={960} cy={top + 5000} R={5000} shear={[20, -22, 18, -24, 22, -18]} seed={73} />
          <rect x={-100} y={top + 40} width={2120} height={1100} fill="#2A0804" opacity={0.3} />
          <WindStreaks f={f} bands={[{ y: 420, h: 160, dir: 1 }, { y: 760, h: 180, dir: -1 }]} speed={26} color="#FFD27A" />
          {Array.from({ length: 9 }, (_, i) => {
            const x = 720 + i * 60;
            const d = `M${x} ${top} C${x + 30} ${top + 300} ${x - 30} ${top + 600} ${x} ${top + 1000}`;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={i % 2 ? C.stripeAmber : C.gold} strokeWidth={22} opacity={0.5} />
                <path d={d} fill="none" stroke="#FFF0A0" strokeWidth={8} strokeDasharray="40 60" strokeDashoffset={-f * 32 - i * 23} />
              </g>
            );
          })}
          <rect x={700} y={top - 14} width={560} height={14} rx={7} fill={C.heard} />
          <Sparks f={f} x={980} y={top} w={600} h={120} n={24} mode="trail" angle={0} />
        </Layer>
        <Layer depth={0}>
          <Plate x={1300} y={top - 50} text="156 KM" size={32} appear={lin(f, 6, 14)} fill={C.heard} color={C.ink} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-14 + 3-15 · the flat map: the Great Red Spot's arms turning (6 deg/f), its depth bar dropping (36 px/f) then a glow running
// down it, the map bands sliding (18 px/f); ABOUT 500 KM + NASA SAYS (#10, Q3). Push: the disc; a thin skin line draws round
// the whole limb (40 px/f) and a glint keeps circling it; the bands slide, the oval turns (class B, no numeral, Q4)
// ================================================================================================================
const ShotGRS: ShotFC<CL03> = ({ f, c }) => {
  const T15 = c.c15 - c.c14;
  const mx = 120;
  const my = 90;
  const mw = 1680;
  const mh = 560;
  const ox = mx + 0.36 * mw;
  const oy = my + 0.62 * mh;
  const ry = 0.07 * mw;
  const bar = 430 * lin(f, 6, 6 + 430 / 36);
  const A = (
    <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(14, 1.1, 0.04)} vignette={0.2} grain={0.5}>
      <Sky family={CREST} />
      <DriftBands f={f} color="#FFE066" opacity={0.35} speed={7} n={3} w={500} angle={-24} seed={74} />
      <Layer depth={1}>
        <FlatMap f={f} x={mx} y={my} w={mw} h={mh} speed={18} spot={{ x: 0.36, y: 0.62, r: 0.07 }} spotSpin={6} />
        <rect x={ox - 30} y={oy + ry * 0.9} width={60} height={bar} rx={12} fill={C.spot} />
        <rect x={ox - 12} y={oy + ry * 0.9} width={24} height={bar} rx={8} fill={C.spotArm} />
        {bar >= 430 ? <circle cx={ox} cy={oy + ry * 0.9 + wrap(f * 36, 430)} r={16} fill={C.goldHot} /> : null}
      </Layer>
      <Layer depth={0}>
        <Plate x={ox + 300} y={oy + 30} text="GREAT RED SPOT" size={34} appear={lin(f, 4, 12)} />
        <rect x={1000} y={720} width={820} height={300} rx={30} fill="rgba(43,9,5,0.62)" />
        <AgencyPill x={1040} y={780} agency="NASA SAYS" size={32} appear={lin(f, 10, 20)} />
        <Roll x={1030} y={960} k={lin(f, 12, 70)} rkey="grs500" prefix="ABOUT" unit="KM" size={130} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T15);
  const R = 420;
  const sk = lin(g, 2, 2 + (2 * Math.PI * (R + 10)) / 40);
  const ga = -90 + ((g * 40) / (R + 10)) * (180 / Math.PI);
  const B = (
    <Stage theme={CREST.theme} shotFrame={g} drift={DRIFT(15, 0.94, 0.03)} vignette={0.2} grain={0.5}>
      <Sky family={CREST} />
      <DriftBands f={f} color="#FFE066" opacity={0.35} speed={7} n={3} w={500} angle={-24} seed={75} />
      <Layer depth={1}>
        <Bloom x={960} y={560} r={R * 1.3} color="#FF7A30" strength={0.4} />
        <ClipCircle cx={960} cy={560} r={R}>
          <FlatMap f={f} x={960 - R} y={560 - R} w={2 * R} h={2 * R} speed={18} />
          <SpotOval f={f} x={900} y={680} r={44} spin={6} />
        </ClipCircle>
        <circle cx={960} cy={560} r={R + 10} fill="none" stroke={C.heard} strokeWidth={10} pathLength={1} strokeDasharray={`${sk} 1`} transform="rotate(-90 960 560)" />
        <circle cx={960 + Math.cos((ga * Math.PI) / 180) * (R + 10)} cy={560 + Math.sin((ga * Math.PI) / 180) * (R + 10)} r={sk >= 1 ? 14 : 18} fill={C.goldHot} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T15 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================

export const SceneL03: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL03(t);
  const shots: ShotDef<CL03>[] = [
    { from: 0, S: ShotWinds, id: "3-01" },
    { from: c.c02, S: ShotSpeedUp, id: "3-02" }, // + 3-03
    { from: c.c04, S: ShotConvert, id: "3-04" },
    { from: c.c05, S: ShotHold21, id: "3-05" }, // + 3-06
    { from: c.c07, S: ShotLine, id: "3-07" },
    { from: c.c08, S: ShotSun, id: "3-08" },
    { from: c.c09, S: ShotSeesaw, id: "3-09" },
    { from: c.c10, S: ShotJuno, id: "3-10" },
    { from: c.c11, S: ShotTwenty, id: "3-11" }, // + 3-12
    { from: c.c13, S: ShotBundle, id: "3-13" },
    { from: c.c14, S: ShotGRS, id: "3-14" }, // + 3-15
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL03 = (t: SceneTiming): Cue[] => {
  const c = cuesL03(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 2, file: SFX.whoosh, vol: 0.18, dur: 50 },
    { at: 4, file: SFX.wind, vol: 0.1, dur: c.c04, fadeIn: 30, fadeOut: 30 },
    ...cutHit(c.c02),
    { at: c.c02 + 2, file: SFX.swirl, vol: 0.18, dur: 60 },
    { at: c.c03 + 20, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.c03 + 28, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.c04),
    { at: c.c04 + 18, file: SFX.whoosh, vol: 0.16, dur: 50 },
    ...cutHit(c.c05),
    { at: c.c05 + 2, file: SFX.swirl, vol: 0.18, dur: 60 },
    { at: c.c06 + 4, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.c07),
    { at: c.c07 + 6, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.c08),
    { at: c.c08 + 6, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.c09),
    { at: c.c09 + 6, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.c10),
    { at: c.c10 + 2, file: SFX.whoosh, vol: 0.2, dur: 60 },
    ...cutHit(c.c11),
    ...run(c.c11 + 4, 20, 4, 0.06),
    { at: c.c12 + 4, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.c13),
    { at: c.c13 + 4, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.c14),
    { at: c.c14 + 2, file: SFX.swirl, vol: 0.18, dur: 60 },
    { at: c.c15 + 4, file: SFX.click, vol: 0.12, dur: 10 },
  ];
};
