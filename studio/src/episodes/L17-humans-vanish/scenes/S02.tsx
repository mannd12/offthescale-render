// L17 scene "l02" · One week: the water (storyboard §3 scene 2: 2-01…2-11, script lines 8-11; `deep` subway tunnel →
// `rain` street). Shot components (hard cuts only; PUSH rows are phases of one component):
//   2-01 (+2-02)  the tunnel, seep lines, the pump in its pit, Tick on the lid; the barrels up the pipe and the counter
//   2-03          the day wheel: each turn a drop comes in and a barrel goes out
//   2-04          the clean tunnel, KEPT DRY slams while the seep lines still run; Tick presses it
//   2-05          the pump's lamp goes dark, the impeller spins down, the pit water starts to creep
//   2-06          the pit gauge: DAY 1, DAY 2, DAY 3 tags flip in as the level climbs
//   2-07          close on a wall seam: drops run into a spreading puddle
//   2-08          the calendar flips DAY 1-3 beside the empty pump control; the water ticks up
//   2-09          the U-section: the fill front rises from the lowest point and climbs both arms (OUR REASONING)
//   2-10 (+2-11)  the climb out to the street in rain; the rain thins, a crack runs, the thermometer falls
// Numbers drawn (data17 READ): MORE THAN 10 MILLION GALLONS (pumpGallons, row 3, + A TYPICAL DAY). DAY 1-3: SCALE_LABELS.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Form, Layer, Metric, Motes, Sky, Stage, Tick, alpha, mixHex, rnd, rrect } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { READ } from "../data17";
import { Skyline } from "../city";
import { CrackDraw, FillFront, Rain, Seep, StarsTint, crackDrawFor } from "../movers17";
import { RungBadge } from "../ladder";
import { PillFor, ReasoningPill, WordPill } from "../stamps17";
import { PumpIcon } from "../icons17";
import { ShotDef, ShotFC, lineFrac, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Barrel, C, CREAM, DEEP, FlipCalendar, Floor, Label, Phase, Pop, RAIN, Slam, Thermo, Wheel, ez, lerp, lin, rollText, wrap } from "./a-parts";

export const cuesL02 = (t: SceneTiming) => {
  const { at } = cueKit(t);
  return {
    s01: 0,
    s02: lineFrac(t, 0, 0.23), // phase (push)
    s03: lineFrac(t, 0, 0.58),
    s04: lineFrac(t, 0, 0.8),
    s05: at(1),
    s06: lineFrac(t, 1, 0.24),
    s07: lineFrac(t, 1, 0.51),
    s08: lineFrac(t, 1, 0.77),
    s09: at(2),
    s10: lineFrac(t, 3, 0.01),
    s11: lineFrac(t, 3, 0.54), // phase (push)
    end: t.frames,
  };
};
export type CL02 = ReturnType<typeof cuesL02>;

const VP = { x: 960, y: 520 };
/** The subway tunnel seen down its length: brick arch rings receding to a dark vanishing point (`travel` = rings passed,
 *  so a dolly makes the rings grow past the camera), rails converging, amber work lamps on the rings. */
const Tunnel: React.FC<{ f: number; travel: number; lamps?: number }> = ({ f, travel, lamps = 1 }) => {
  const N = 9;
  const rings = Array.from({ length: N }, (_, k) => {
    const z = 0.55 + wrap(k - travel, N);
    return { z, s: 1.5 / z, k };
  }).sort((a, b) => b.z - a.z);
  const arch = (s: number) => {
    const w = 980 * s;
    const h = 860 * s;
    const fy = VP.y + 520 * s;
    return `M${VP.x - w} ${fy} L${VP.x - w} ${fy - h * 0.55} Q${VP.x - w} ${fy - h} ${VP.x} ${fy - h} Q${VP.x + w} ${fy - h} ${VP.x + w} ${fy - h * 0.55} L${VP.x + w} ${fy} Z`;
  };
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1880} fill={DEEP.sky[1]} />
      <circle cx={VP.x} cy={VP.y} r={60} fill="#0C0405" />
      {rings.map(({ z, s, k }) => {
        const shade = Math.min(1, 1.2 / z);
        const col = mixHex("#1A0A0C", k % 2 ? "#5A2A1E" : "#4A1C16", shade);
        const fy = VP.y + 520 * s;
        return (
          <g key={k} opacity={Math.min(1, (N + 0.4 - z) / 1.2)}>
            <path d={arch(s)} fill={col} />
            <path d={arch(s * 0.94)} fill={mixHex("#1A0A0C", "#2E1114", shade)} />
            <path d={arch(s * 0.97)} fill="none" stroke={C.lantern} strokeWidth={Math.max(1.5, 7 * s)} opacity={0.35 * shade} />
            <rect x={VP.x - 420 * s} y={fy - 8 * s} width={840 * s} height={16 * s} fill="#5A2A1E" opacity={shade} />
            {/* rails on the floor of this ring */}
            <rect x={VP.x - 300 * s} y={fy - 14 * s} width={600 * s} height={10 * s} fill="#3A1812" />
            {[-160, 160].map((dx) => (
              <rect key={dx} x={VP.x + dx * s - 10 * s} y={fy - 30 * s} width={20 * s} height={30 * s} fill="#9C8A7A" opacity={shade} />
            ))}
            {lamps > 0
              ? [-1, 1].map((side) => (
                  <g key={side}>
                    <Bloom x={VP.x + side * 900 * s} y={fy - 560 * s} r={160 * s} color={C.lantern} strength={0.75 * lamps * shade} />
                    <rect x={VP.x + side * 900 * s - 16 * s} y={fy - 572 * s} width={32 * s} height={24 * s} rx={6 * s} fill={lamps > 0.5 ? "#FFE6A8" : "#5A2A1E"} />
                  </g>
                ))
              : null}
          </g>
        );
      })}
      {/* the rails, converging */}
      {[-160, 160].map((dx) => (
        <path key={dx} d={`M${VP.x + dx * 0.15} ${VP.y + 80} L${VP.x + dx * 3.2} 1200`} stroke="#B9A898" strokeWidth={14} />
      ))}
      <Motes frame={f} n={20} w={1920} h={1080} color={alpha(C.lantern, 0.5)} seed={3} />
    </g>
  );
};

/** A pit in the tunnel floor (section view) with the pump on its lid. Returns nothing but geometry via props. */
const PIT = { x: 1240, y: 760, w: 460, h: 300 };
const pitClip = `M${PIT.x} ${PIT.y} L${PIT.x + PIT.w} ${PIT.y} L${PIT.x + PIT.w - 20} ${PIT.y + PIT.h} L${PIT.x + 20} ${PIT.y + PIT.h} Z`;
const Pit: React.FC<{ f: number; level: number; running?: boolean; lamp?: number; speed?: number }> = ({ f, level, running = true, lamp = 1, speed = 25 }) => (
  <g>
    <path d={pitClip} fill="#0C0405" />
    <FillFront f={f} clip={pitClip} x0={PIT.x} x1={PIT.x + PIT.w} bottom={PIT.y + PIT.h} top={PIT.y} level={level} color="#2F8FB0" />
    <rect x={PIT.x - 20} y={PIT.y - 14} width={PIT.w + 40} height={18} rx={6} fill="#5A2A1E" />
    <PumpIcon x={PIT.x + PIT.w / 2} y={PIT.y - 110} size={210} f={f} speed={speed} running={running} />
    <circle cx={PIT.x + PIT.w / 2 + 120} cy={PIT.y - 190} r={14} fill={lamp > 0.5 ? "#2FBF71" : "#3A1812"} />
    {lamp > 0.5 ? <Bloom x={PIT.x + PIT.w / 2 + 120} y={PIT.y - 190} r={60} color="#2FBF71" strength={0.7 * lamp} /> : null}
  </g>
);

// near tunnel walls (screen edges) with the seep lines on them
const SideWalls: React.FC<{ f: number; n?: number }> = ({ f, n = 26 }) => (
  <g>
    <path d="M-40 -40 L330 -40 Q240 300 260 1120 L-40 1120 Z" fill="#3A1812" />
    <path d="M1960 -40 L1590 -40 Q1680 300 1660 1120 L1960 1120 Z" fill="#3A1812" />
    {Array.from({ length: 9 }, (_, i) => (
      <g key={i}>
        <line x1={-40} y1={i * 130} x2={280} y2={i * 130 + 10} stroke="#2E1114" strokeWidth={6} />
        <line x1={1960} y1={i * 130} x2={1640} y2={i * 130 + 10} stroke="#2E1114" strokeWidth={6} />
      </g>
    ))}
    <Seep f={f} x={0} y={0} w={250} h={1080} n={n} speed={16} seed={2} />
    <Seep f={f} x={1670} y={0} w={250} h={1080} n={n} speed={17} seed={5} />
  </g>
);

// ================================================================================================================
// 2-01 + 2-02 · the tunnel (rings drifting past: the slow dolly), seep lines (16 px/f), the impeller (25 deg/f), Tick on the
// lid; push to the barrels riding the conveyor up the pipe (24 px/f) and the counter rolling to MORE THAN 10 MILLION GALLONS
// ================================================================================================================
const ShotPump: ShotFC<CL02> = ({ f, c }) => {
  const T2 = c.s02 - c.s01;
  const A = (
    <Stage theme={DEEP.theme} cam={{ x: 960 + f * 0.6, y: 540, zoom: 1.02 }} vignette={0.36} grain={0.5}>
      <Layer depth={1}>
        <Tunnel f={f} travel={f * 0.012} />
        <SideWalls f={f} />
        <Floor y={900} color="#2E1114" foot="#0C0405" lip="#5A2A1E" />
        <Pit f={f} level={0.18} />
        <Tick x={PIT.x + PIT.w / 2 - 20} y={PIT.y - 196} pxPerM={120} frame={f} facing={-1} pose="sit" expression="happy" look={-0.3} />
      </Layer>
      <Layer depth={0}>
        <RungBadge f={f} rung={1} family={DEEP} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T2);
  const k = ez(g, 8, 90);
  const pipe = { x0: 360, y0: 1000, x1: 1700, y1: 200 };
  const B = (
    <Stage theme={DEEP.theme} shotFrame={g} drift={{ zoom: 1.05, panX: 0.02, panY: 0.01, frames: 180, seed: 2 }} vignette={0.36} grain={0.5}>
      <Sky family={DEEP} />
      <Layer depth={0.5}>
        <Seep f={f} x={0} y={0} w={1920} h={1080} n={40} speed={16} seed={7} color="#E0B49A" />
      </Layer>
      <Layer depth={1}>
        <line x1={pipe.x0} y1={pipe.y0} x2={pipe.x1} y2={pipe.y1} stroke="#5A2A1E" strokeWidth={170} strokeLinecap="round" />
        <line x1={pipe.x0} y1={pipe.y0} x2={pipe.x1} y2={pipe.y1} stroke="#4A1C16" strokeWidth={140} strokeLinecap="round" />
        <line x1={pipe.x0} y1={pipe.y0 - 60} x2={pipe.x1} y2={pipe.y1 - 60} stroke={C.lantern} strokeWidth={4} opacity={0.4} />
        {Array.from({ length: 9 }, (_, i) => {
          const u = wrap((g * 24) / 1570 + i / 9, 1);
          return <Barrel key={i} x={lerp(pipe.x0, pipe.x1, u)} y={lerp(pipe.y0, pipe.y1, u) - 30} s={1.1} />;
        })}
        <Bloom x={1700} y={200} r={300} color={C.lantern} strength={0.5} />
      </Layer>
      <Layer depth={0}>
        <Label x={130} y={150} text="more than" size={30} color={CREAM} align="start" />
        <Metric x={130} y={290} value={rollText(READ.pumpGallons.value!, k)} unit="MILLION GALLONS" size={130} color={CREAM} />
        <PillFor kind={READ.pumpGallons.pill} x={140} y={360} size={26} appear={ez(g, 60, 76)} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T2 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 2-03 · the day wheel turns (10 deg/f); each turn a drop comes in at the left and a barrel leaves at the right (16 px/f)
// ================================================================================================================
const ShotDayWheel: ShotFC<CL02> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={DEEP.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0, frames: 150, seed: 3 }} vignette={0.36} grain={0.5}>
      <Sky family={DEEP} />
      <Layer depth={0.6}>
        <SideWalls f={f} n={20} />
      </Layer>
      <Layer depth={1}>
        <Floor y={860} color="#2E1114" foot="#0C0405" lip="#5A2A1E" />
        <Bloom x={960} y={480} r={420} color={C.lantern} strength={0.4} />
        <Wheel x={960} y={480} r={230} angle={f * 10} notches={12} hot={[0, 6]} fill="#FFE6C0" ink="#2E1114" labels={["day", "", "", "", "", "", "night", "", "", "", "", ""]} />
        {/* drops falling in at the left (16 px/f) */}
        {Array.from({ length: 4 }, (_, i) => {
          const y = 120 + wrap(f * 16 + i * 190, 760);
          return <ellipse key={i} cx={470} cy={y} rx={16} ry={24} fill="#7FD0E8" />;
        })}
        {/* barrels rolling out at the right (16 px/f) */}
        {Array.from({ length: 3 }, (_, i) => (
          <Barrel key={i} x={1300 + wrap(f * 16 + i * 260, 780)} y={812} s={1.2} />
        ))}
      </Layer>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 2-04 · the pull back: the tunnel looks clean; KEPT DRY slams (40 px/f) while the seep lines still run; Tick presses it
// ================================================================================================================
const ShotKeptDry: ShotFC<CL02> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={DEEP.theme} cam={{ x: 960, y: 540, zoom: 1.25 - 0.2 * ez(f, 0, 100) }} vignette={0.36} grain={0.5}>
      <Layer depth={1}>
        <Tunnel f={f} travel={-f * 0.01} />
        <SideWalls f={f} n={34} />
        <Floor y={930} color="#2E1114" foot="#0C0405" lip="#5A2A1E" />
        <Tick x={660} y={960} pxPerM={210} frame={f} facing={1} pose={f > 22 ? "press" : "heave"} expression={f > 30 ? "proud" : "determined"} />
      </Layer>
      <Layer depth={0}>
        <Slam x={1080} y={520} age={f - 24}>
          <g transform="rotate(-6 1080 520)">
            <rect x={760} y={420} width={640} height={200} rx={26} fill="none" stroke="#2FBFA8" strokeWidth={14} />
            <WordPill x={1080} y={520} text="kept dry" size={60} align="middle" dot="#2FBFA8" />
          </g>
        </Slam>
      </Layer>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 2-05 · the pump's lamp goes dark; the impeller spins down (25 → 0 deg/f); the pit water creeps up, rippling
// ================================================================================================================
const ShotPumpStop: ShotFC<CL02> = ({ f }) => {
  const off = ez(f, 6, 16);
  const spd = 25 * (1 - ez(f, 8, 70));
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} cam={{ x: 1300 - f * 1.4, y: 620, zoom: 1.55 + f * 0.001 }} vignette={0.4} grain={0.5}>
        <Layer depth={1}>
          <Tunnel f={f} travel={0.4} lamps={1 - off * 0.7} />
          <SideWalls f={f} />
          <Floor y={900} color="#2E1114" foot="#0C0405" lip="#5A2A1E" />
          <Pit f={f} level={0.2 + 0.5 * lin(f, 10, 110)} running={spd > 0.5} speed={spd} lamp={1 - off} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-06 · the pit gauge: DAY tags flip in (40 px/f) as the water surface lifts (10 px/f) and ripples (12 px/f)
// ================================================================================================================
const ShotGauge: ShotFC<CL02> = ({ f }) => {
  const clip = "M560 180 L1360 180 L1360 1000 L560 1000 Z";
  const lv = 0.15 + 0.55 * lin(f, 0, 120);
  const yl = 1000 - 820 * lv;
  const marks = [0.3, 0.48, 0.66];
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.015, panY: 0, frames: 160, seed: 4 }} vignette={0.38} grain={0.5}>
        <Sky family={DEEP} />
        <Layer depth={0.6}>
          <SideWalls f={f} n={20} />
        </Layer>
        <Layer depth={1}>
          <path d={clip} fill="#0C0405" />
          <FillFront f={f} clip={clip} x0={560} x1={1360} bottom={1000} top={180} level={lv} color="#2F8FB0" />
          <rect x={540} y={160} width={22} height={860} fill="#5A2A1E" />
          <rect x={1358} y={160} width={22} height={860} fill="#5A2A1E" />
          {/* the gauge staff */}
          <rect x={900} y={180} width={60} height={820} fill="#FFE6C0" />
          {Array.from({ length: 21 }, (_, i) => (
            <rect key={i} x={900} y={1000 - i * 41} width={i % 5 ? 30 : 60} height={8} fill="#2E1114" />
          ))}
          {marks.map((m, i) => {
            const passed = lv >= m;
            const age = passed ? (f - (m - 0.15) / 0.55 * 120) : -1;
            const flip = Math.min(1, Math.max(0, age) / 8);
            const my = 1000 - 820 * m;
            return passed ? (
              <g key={i} transform={`translate(1000 ${my}) scale(1 ${flip.toFixed(2)}) translate(-1000 ${-my})`}>
                <rect x={1000} y={my - 34} width={240} height={68} rx={12} fill={C.lantern} />
                <Label x={1120} y={my + 12} text={`day ${i + 1}`} size={34} color="#2E1114" />
              </g>
            ) : null;
          })}
          <line x1={540} y1={yl} x2={1380} y2={yl} stroke="#BFF0F2" strokeWidth={4} opacity={0.6} />
          <Bloom x={960} y={200} r={400} color={C.lantern} strength={0.35} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-07 · close on a wall seam: drops form and run down (20 px/f) into a floor puddle whose edge spreads (10 px/f)
// ================================================================================================================
const ShotSeam: ShotFC<CL02> = ({ f }) => {
  const pw = 260 + f * 10;
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} cam={{ x: 960, y: 540, zoom: 1 + f * 0.001 }} vignette={0.4} grain={0.5}>
        <Sky family={DEEP} />
        <Layer depth={1}>
          {Array.from({ length: 6 }, (_, r) =>
            Array.from({ length: 6 }, (_, k) => (
              <Form key={`${r}-${k}`} d={rrect(-60 + k * 360 + (r % 2) * 180, r * 150 - 20, 350, 140, 12)} fill={mixHex("#4A1C16", "#5A2A1E", rnd(r * 9 + k))} light={225} shadow="#0C0405" shadowOpacity={0.5} inset={10} rim="#FF7A30" rimOpacity={0.35} hard />
            )),
          )}
          {/* the seam */}
          <path d="M930 -20 L950 300 L920 560 L960 820" fill="none" stroke="#0C0405" strokeWidth={22} strokeLinecap="round" />
          <Seep f={f} x={900} y={0} w={80} h={820} n={10} speed={20} len={90} seed={4} />
          {Array.from({ length: 3 }, (_, i) => {
            const y = 300 + wrap(f * 20 + i * 180, 540);
            return <ellipse key={i} cx={942 + (i - 1) * 10} cy={y} rx={14} ry={22} fill="#BFF0F2" />;
          })}
          <rect x={-200} y={820} width={2400} height={400} fill="#2E1114" />
          <ellipse cx={950} cy={880} rx={pw} ry={pw * 0.12} fill="#2F8FB0" opacity={0.9} />
          <ellipse cx={950} cy={874} rx={pw * 0.8} ry={pw * 0.07} fill="#7FD0E8" opacity={0.5} />
          <ellipse cx={950} cy={880} rx={30 + wrap(f * 6, 120)} ry={(30 + wrap(f * 6, 120)) * 0.15} fill="none" stroke="#BFF0F2" strokeWidth={3} opacity={1 - wrap(f * 6, 120) / 120} />
          <Bloom x={1500} y={160} r={500} color={C.lantern} strength={0.4} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-08 · the calendar flips DAY 1, DAY 2, DAY 3 (40 px/f) beside the empty pump control; the water ticks up (10 px/f)
// ================================================================================================================
const ShotCalendar: ShotFC<CL02> = ({ f }) => {
  const page = Math.min(2, Math.max(0, (f - 10) / 34));
  const step = Math.floor(page + 0.5);
  const wl = 860 - step * 70 - Math.min(1, (page % 1) * 2) * 30;
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0, frames: 150, seed: 5 }} vignette={0.38} grain={0.5}>
        <Sky family={DEEP} />
        <Layer depth={0.6}>
          <SideWalls f={f} n={24} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={760} y={420} r={420} color={C.lantern} strength={0.45} />
          <FlipCalendar x={760} y={640} w={360} page={page} words={["DAY 1", "DAY 2", "DAY 3"]} band="#E0A93A" />
          {/* the empty pump control: a dark panel, a switch thrown to OFF */}
          <Form d={rrect(1160, 300, 300, 380, 24)} fill="#3A1812" light={225} shadow="#0C0405" shadowOpacity={0.6} inset={14} rim="#E0B49A" rimOpacity={0.4} />
          <Label x={1310} y={360} text="pump" size={30} color="#E0B49A" />
          <rect x={1280} y={420} width={60} height={180} rx={30} fill="#1A0A0C" />
          <circle cx={1310} cy={570} r={34} fill="#5A2A1E" />
          <Label x={1310} y={650} text="off" size={28} color="#E0B49A" />
          {/* the water ticking up across the floor */}
          <rect x={-200} y={wl} width={2400} height={600} fill="#2F8FB0" opacity={0.85} />
          <path d={`M-200 ${wl} ${Array.from({ length: 50 }, (_, k) => `L${-200 + k * 50} ${wl + Math.sin(k * 0.9 + f * 0.3) * 6}`).join(" ")}`} fill="none" stroke="#BFF0F2" strokeWidth={4} opacity={0.7} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-09 · the U-section: the line dips in a U under the street; blue fills the dip and climbs both arms (front 14 px/f
// along the slopes); Tick on the street above watches the level climb (OUR REASONING)
// ================================================================================================================
const ShotU: ShotFC<CL02> = ({ f }) => {
  const outer = "M-100 470 L420 470 Q760 470 860 840 Q960 980 1060 840 Q1160 470 1500 470 L2020 470 L2020 600 L1540 600 Q1240 600 1150 900 Q960 1100 770 900 Q680 600 380 600 L-100 600 Z";
  const lv = 0.2 + 0.45 * lin(f, 0, 90);
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.015, panY: 0, frames: 150, seed: 6 }} vignette={0.36} grain={0.5}>
        <Sky stops={["#0D2B38", "#14414F"]} x={-400} y={-400} w={2720} h={720} />
        <Layer depth={0.4}>
          <Skyline f={f} family={DEEP} ground={300} scale={0.5} lights={0} wave={0} seed={7} />
          <StarsTint f={f} n={30} speed={1} h={200} seed={4} />
        </Layer>
        <Layer depth={1}>
          <rect x={-400} y={300} width={2720} height={1200} fill="#2E1114" />
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={-400} y={340 + i * 130} width={2720} height={4} fill="#4A1C16" />
          ))}
          <rect x={-400} y={296} width={2720} height={8} fill={C.lantern} opacity={0.5} />
          <path d={outer} fill="#0C0405" />
          <FillFront f={f} clip={outer} x0={-100} x1={2020} bottom={1060} top={470} level={lv} color="#2F8FB0" />
          <path d={outer} fill="none" stroke="#5A2A1E" strokeWidth={10} />
          <Seep f={f} x={300} y={320} w={1300} h={160} n={24} speed={16} len={40} seed={9} />
          <Tick x={960} y={300} pxPerM={130} frame={f} facing={1} pose="stand" expression="worried" look={0.7} headTilt={18} />
        </Layer>
        <Layer depth={0}>
          <ReasoningPill x={120} y={110} size={26} appear={ez(f, 10, 22)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-10 + 2-11 · the climb out of the tunnel to the street (26 px/f) into rain (26 px/f) over the sleeping skyline; push to
// the pavement: the rain thins and turns pale, a crack runs across (40 px/f), the thermometer falls (14 px/f); Tick taps it
// ================================================================================================================
const ShotRainUp: ShotFC<CL02> = ({ f, c }) => {
  const T11 = c.s11 - c.s10;
  const camY = 1700 - Math.min(1160, f * 26);
  const A = (
    <Stage theme={RAIN.theme} cam={{ x: 960, y: camY, zoom: 1 }} vignette={0.3} grain={0.5}>
      <Sky family={RAIN} />
      <Layer depth={0.4}>
        <Skyline f={f} family={RAIN} ground={820} scale={1} lights={0.03} wave={0} seed={8} />
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={860} width={2720} height={2000} fill="#2E1114" />
        <rect x={-400} y={850} width={2720} height={20} fill="#0F3540" />
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={-400} y={900 + i * 120} width={2720} height={5} fill="#4A1C16" />
        ))}
        <rect x={860} y={860} width={200} height={1400} fill="#1A0A0C" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={870} y={900 + i * 110} width={180} height={12} rx={4} fill="#5A2A1E" />
        ))}
        <Bloom x={960} y={2100} r={300} color={C.lantern} strength={0.4} />
      </Layer>
      <Layer depth={0}>
        <Rain f={f} n={80} speed={26} seed={3} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T11);
  const draw = crackDrawFor(g, 8, 1400, 40);
  const B = (
    <Stage theme={RAIN.theme} cam={{ x: 960 + g * 0.6, y: 560, zoom: 1.02 + g * 0.0008 }} vignette={0.3} grain={0.5}>
      <Sky family={RAIN} />
      <Layer depth={0.3}>
        <Skyline f={g} family={RAIN} ground={600} scale={0.8} lights={0.03} wave={0} seed={8} />
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={600} width={2720} height={800} fill="#235A69" />
        <rect x={-400} y={600} width={2720} height={10} fill="#7FD0E8" opacity={0.4} />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={-400} y={680 + i * 90} width={2720} height={3} fill="#0F3540" opacity={0.6} />
        ))}
        <CrackDraw x={200} y={860} seed={7} length={1400} draw={draw} width={9} color="#06151D" branches={4} />
        <Tick x={1180} y={940} pxPerM={210} frame={g} facing={-1} pose="crouch-reach" expression="thinking" look={-0.4} />
        <Thermo x={1680} y={900} h={460} level={0.75 - 0.5 * lin(g, 4, 30) - 0.1 * lin(g, 30, 90)} ink="#0F3540" />
      </Layer>
      <Layer depth={0}>
        <Rain f={f} n={70} speed={26} thin={ez(g, 0, 70)} pale={ez(g, 0, 60)} seed={3} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T11 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================

export const SceneL02: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL02(t);
  const shots: ShotDef<CL02>[] = [
    { from: 0, S: ShotPump, id: "2-01" }, // + 2-02
    { from: c.s03, S: ShotDayWheel, id: "2-03" },
    { from: c.s04, S: ShotKeptDry, id: "2-04" },
    { from: c.s05, S: ShotPumpStop, id: "2-05" },
    { from: c.s06, S: ShotGauge, id: "2-06" },
    { from: c.s07, S: ShotSeam, id: "2-07" },
    { from: c.s08, S: ShotCalendar, id: "2-08" },
    { from: c.s09, S: ShotU, id: "2-09" },
    { from: c.s10, S: ShotRainUp, id: "2-10" }, // + 2-11
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL02 = (t: SceneTiming): Cue[] => {
  const c = cuesL02(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 0, file: SFX.rumble, vol: 0.12, dur: c.s03, fadeIn: 20, fadeOut: 20 },
    { at: c.s02 - 6, file: SFX.whoosh, vol: 0.12, dur: 40 },
    ...run(c.s02 + 10, 8, 8),
    ...cutHit(c.s03),
    ...run(c.s03 + 6, 3, 36, 0.1),
    ...cutHit(c.s04),
    { at: c.s04 + 24, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.s04 + 26, file: SFX.boom, vol: 0.3, dur: 90, fadeOut: 30 },
    ...cutHit(c.s05),
    { at: c.s05 + 6, file: SFX.rumble, vol: 0.22, dur: c.s06 - c.s05, fadeIn: 4, fadeOut: 30 },
    ...cutHit(c.s06),
    ...run(c.s06 + 20, 3, 34, 0.1),
    ...cutHit(c.s07),
    ...cutHit(c.s08),
    ...run(c.s08 + 10, 3, 34, 0.1),
    ...cutHit(c.s09),
    { at: c.s09 + 4, file: SFX.rumble, vol: 0.2, dur: c.s10 - c.s09, fadeIn: 6, fadeOut: 16 },
    ...cutHit(c.s10),
    { at: c.s10 + 2, file: SFX.whoosh, vol: 0.16, dur: 50 },
    { at: c.s11 - 4, file: SFX.swirl, vol: 0.14, dur: 50 },
  ];
};
