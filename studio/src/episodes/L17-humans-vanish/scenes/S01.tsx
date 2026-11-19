// L17 scene "l01" · One day: the lights (storyboard §3 scene 1: 1-01…1-09, script lines 4-7; `night` grid and city ↔
// `studio` seesaw and desk plates). Shot components (hard cuts only; PUSH/SLIDE rows are phases of one component):
//   1-01 (+1-02, 1-03)  the pylons and the pulsing wires; the SUPPLY / DEMAND dials in lockstep; the seesaw Tick props level
//   1-04                the control desk: sliders, dials and the turning sun-moon disc; Tick works the sliders
//   1-05                the patchwork of region tiles, each with a dial pair and pulsing rings (BALANCING AUTHORITIES)
//   1-06 (+1-07)        the dim desk, the chair rolling back, the needles drifting apart (OUR REASONING); the dark wave
//   1-08 (+1-09)        the drop through the street: pavement layers, pipes and cables sliding up; the water line below
// Numbers drawn: none (row 2 words only: SUPPLY, DEMAND, BALANCING AUTHORITIES).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, CycClouds, Form, Kicker, Layer, Motes, Sky, Stage, Tick, alpha, mixHex, rnd, rrect } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { Rail, TimeCamera } from "../rig";
import { Skyline, drainFor } from "../city";
import { StarsTint } from "../movers17";
import { RungBadge } from "../ladder";
import { ReasoningPill } from "../stamps17";
import { ShotDef, ShotFC, lineFrac, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, CREAM, ClipBox, Floor, Gauge, Label, NIGHT, Phase, Pop, Pylon, STUDIO, Wire, ez, lerp, lin, pylonArms, wrap } from "./a-parts";

export const cuesL01 = (t: SceneTiming) => {
  const { at } = cueKit(t);
  return {
    s01: 0,
    s02: lineFrac(t, 0, 0.28), // phase (push)
    s03: lineFrac(t, 0, 0.57), // phase (slide)
    s04: at(1),
    s05: lineFrac(t, 1, 0.52),
    s06: at(2),
    s07: lineFrac(t, 2, 0.5), // phase (push)
    s08: at(3),
    s09: lineFrac(t, 3, 0.51), // phase (push)
    end: t.frames,
  };
};
export type CL01 = ReturnType<typeof cuesL01>;

// the studio room every plate here sits in
const Studio: React.FC<{ f: number; floor?: number }> = ({ f, floor = 900 }) => (
  <g>
    <Sky family={STUDIO} />
    <Layer depth={0.2}>
      <CycClouds f={f} y={120} n={4} seed={3} />
    </Layer>
    <Layer depth={1}>
      <Floor y={floor} color={STUDIO.mid} lip="#FFE6A8" foot={STUDIO.near} />
      <Bloom x={420} y={200} r={600} color="#FFFBF0" strength={0.35} />
    </Layer>
  </g>
);

// the distant grid glow on the night horizon: perspective lines lit amber
const GridGlow: React.FC<{ f: number; y: number; lit?: number }> = ({ f, y, lit = 1 }) => (
  <g opacity={lit}>
    <Bloom x={960} y={y} r={900} color={C.amber} strength={0.35} squash={0.25} />
    {Array.from({ length: 13 }, (_, i) => (
      <line key={i} x1={960 + (i - 6) * 60} y1={y} x2={960 + (i - 6) * 380} y2={y + 260} stroke={C.amber} strokeWidth={3} opacity={0.5} />
    ))}
    {Array.from({ length: 5 }, (_, i) => {
      const yy = y + wrap(i * 52 + f * 1.6, 260);
      return <line key={i} x1={-200} y1={yy} x2={2120} y2={yy} stroke={C.amber} strokeWidth={2.5} opacity={0.25 + 0.4 * ((yy - y) / 260)} />;
    })}
  </g>
);

// a row of pylons sliding left at `speed` px/f with live wires between neighbours
const PylonRow: React.FC<{ f: number; base: number; h: number; gap: number; speed: number; lit?: number; seed?: number; ink?: string }> = ({ f, base, h, gap, speed, lit = 1, seed = 1, ink }) => {
  const n = Math.ceil(2600 / gap) + 1;
  const xs = Array.from({ length: n }, (_, i) => -300 + wrap(i * gap - f * speed, n * gap));
  const sorted = [...xs].sort((a, b) => a - b);
  return (
    <g>
      {sorted.slice(0, -1).map((x, i) => {
        const nx = sorted[i + 1];
        if (nx - x > gap * 1.5) return null;
        const a = pylonArms(x, base, h);
        const b = pylonArms(nx, base, h);
        return (
          <g key={i}>
            <Wire a={a[1]} b={b[0]} f={f} sag={h * 0.12} lit={lit} seed={seed + i} />
            <Wire a={a[3]} b={b[2]} f={f + 9} sag={h * 0.1} lit={lit} seed={seed + i + 7} />
          </g>
        );
      })}
      {sorted.map((x, i) => (
        <Pylon key={i} x={x} base={base} h={h} ink={ink} />
      ))}
    </g>
  );
};

// ================================================================================================================
// 1-01 + 1-02 + 1-03 · pylons sliding (20 px/f) and pulses on the wires (30 px/f), Tick on a near pylon's arm waving;
// push into the SUPPLY / DEMAND plate (needles lockstep, 3 deg/f); slide to the studio seesaw Tick props level.
// ================================================================================================================
const ShotGrid: ShotFC<CL01> = ({ f, c }) => {
  const T2 = c.s02 - c.s01;
  const T3 = c.s03 - c.s01;
  const nearX = 1320 - f * 6;
  const arm = pylonArms(nearX, 1040, 760);
  const A = (
    <Stage theme={NIGHT.theme} cam={{ x: 960, y: 540, zoom: 1 + f * 0.0007 }} vignette={0.34} grain={0.5}>
      <Sky family={NIGHT} />
      <Layer depth={0.1}>
        <StarsTint f={f} n={90} speed={2} h={520} seed={4} />
      </Layer>
      <Layer depth={0.4}>
        <GridGlow f={f} y={720} />
        <PylonRow f={f} base={760} h={300} gap={520} speed={20} seed={3} ink="#0E3340" />
      </Layer>
      <Layer depth={1}>
        <Floor y={980} color="#06151D" foot="#020B10" />
        <Wire a={[-200, 380]} b={arm[0]} f={f} sag={60} />
        <Wire a={arm[1]} b={[2200, 420]} f={f + 5} sag={60} />
        <Pylon x={nearX} base={1040} h={760} ink="#04121A" lit="#26525F" />
        <Tick x={arm[1][0] - 40} y={arm[1][1] - 8} pxPerM={130} frame={f} facing={1} pose="wave" expression="happy" look={0.2} />
        <Motes frame={f} n={18} w={1920} h={900} color={alpha(C.amber, 0.5)} seed={5} />
      </Layer>
      <Layer depth={0}>
        <RungBadge f={f} rung={0} family={NIGHT} from={0} />
      </Layer>
    </Stage>
  );
  const g = f - T2;
  const sway = 30 * Math.sin(g / 10);
  const B = (
    <Stage theme={NIGHT.theme} shotFrame={Math.max(0, g)} drift={{ zoom: 1.05, panX: 0.02, panY: 0, frames: 140, seed: 2 }} vignette={0.34} grain={0.5}>
      <Sky family={NIGHT} />
      <Layer depth={0.4}>
        <Wire a={[-200, 260]} b={[2200, 300]} f={f} sag={80} />
        <Wire a={[-200, 900]} b={[2200, 860]} f={f + 11} sag={-60} />
      </Layer>
      <Layer depth={1}>
        <Form d={rrect(380, 250, 1160, 600, 40)} fill="#0B2530" light={225} shadow="#020B10" shadowOpacity={0.6} inset={20} rim={alpha(C.amber, 0.8)} />
        <rect x={380} y={250} width={1160} height={600} rx={40} fill="none" stroke={C.saffron} strokeWidth={6} />
        <Gauge x={700} y={520} r={170} angle={sway} title="supply" glow={0.6} />
        <Gauge x={1220} y={520} r={170} angle={sway} title="demand" glow={0.6} />
        <rect x={880} y={512} width={160} height={14} rx={7} fill={C.saffron} />
        <Motes frame={f} n={16} w={1920} h={900} color={alpha(C.amber, 0.5)} seed={6} />
      </Layer>
    </Stage>
  );
  const h = Math.max(0, f - T3);
  const amp = lerp(10, 3, ez(h, 30, 150));
  const ang = amp * Math.sin(h * 0.2);
  const ball = 300 * Math.sin(h * 0.05);
  const piv = { x: 900, y: 790 };
  const rad = (ang * Math.PI) / 180;
  const endX = piv.x + Math.cos(rad) * 560;
  const endY = piv.y + Math.sin(rad) * 560;
  const Cc = (
    <Stage theme={STUDIO.theme} shotFrame={h} drift={{ zoom: 1.04, panX: 0.015, panY: 0, frames: 200, seed: 3 }} vignette={0.12} grain={0.5}>
      <Studio f={h} floor={900} />
      <Layer depth={1}>
        <ellipse cx={piv.x} cy={905} rx={300} ry={22} fill={STUDIO.shadow} opacity={0.3} />
        <Form d={`M${piv.x - 110} 900 L${piv.x} ${piv.y + 10} L${piv.x + 110} 900 Z`} fill="#C98A2E" light={225} shadow="#5A3010" shadowOpacity={0.5} inset={14} rim="#FFE6A8" hard />
        <g transform={`rotate(${ang.toFixed(2)} ${piv.x} ${piv.y})`}>
          <Form d={rrect(piv.x - 580, piv.y - 22, 1160, 34, 14)} fill="#2F7F6E" light={225} shadow="#0F3540" shadowOpacity={0.55} inset={10} rim="#BFF5EA" hard />
          <circle cx={piv.x + ball} cy={piv.y - 62} r={40} fill={C.water} />
          <circle cx={piv.x + ball - 12} cy={piv.y - 74} r={12} fill="#BFF0F2" opacity={0.8} />
        </g>
        {/* Tick's staff props the right end */}
        <line x1={endX} y1={endY + 10} x2={1500} y2={880} stroke="#7A4A20" strokeWidth={14} strokeLinecap="round" />
        <Tick x={1640} y={960} pxPerM={260} frame={h} facing={-1} pose="press" expression="determined" look={0.2} />
      </Layer>
    </Stage>
  );
  if (f >= T3 - 8) return <Phase f={f} at={T3 - 8} dur={15} kind="slide" a={B} b={Cc} />;
  return <Phase f={f} at={T2 - 6} dur={14} kind="push" a={A} b={B} />;
};

// the control desk (studio colours or dimmed for night): wall of gauges, sliders, the sun-moon disc behind
const Desk: React.FC<{ f: number; dim?: boolean; spread?: number; disc?: number; sliders?: boolean }> = ({ f, dim = false, spread = 0, disc = 0, sliders = true }) => {
  const panel = dim ? "#0B2530" : "#2F6F80";
  const top = dim ? "#14414F" : "#5FA0A8";
  const face = dim ? "#1B414C" : C.paper;
  return (
    <g>
      {/* the sun-moon disc behind the wall */}
      <g transform={`rotate(${disc.toFixed(1)} 960 300)`}>
        <path d="M660 300 A300 300 0 0 1 1260 300 Z" fill={dim ? "#5A4A2A" : "#F2B544"} />
        <path d="M660 300 A300 300 0 0 0 1260 300 Z" fill={dim ? "#14414F" : "#2A6E78"} />
        <circle cx={1060} cy={420} r={50} fill={dim ? "#26525F" : "#BFE3D6"} />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={960 + Math.cos(-(i + 0.5) * 0.39) * 320} y1={300 + Math.sin(-(i + 0.5) * 0.39) * 320} x2={960 + Math.cos(-(i + 0.5) * 0.39) * 370} y2={300 + Math.sin(-(i + 0.5) * 0.39) * 370} stroke={dim ? "#5A4A2A" : "#F2B544"} strokeWidth={14} strokeLinecap="round" />
        ))}
      </g>
      <Form d={rrect(300, 330, 1320, 380, 30)} fill={panel} light={225} shadow="#06151D" shadowOpacity={0.55} inset={20} rim={top} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const gx = 420 + i * 216;
        const a = i < 3 ? -spread + 14 * Math.sin(f / 13 + i) : spread + 14 * Math.sin(f / 13 + i);
        return <Gauge key={i} x={gx} y={450} r={70} angle={dim ? a : 14 * Math.sin(f / 9 + i * 0.8)} face={face} ink={dim ? "#9FC8C6" : C.ink} needle={C.vermilion} />;
      })}
      {/* the desk top with five sliders */}
      <Form d={`M220 760 L1700 760 L1640 640 L280 640 Z`} fill={dim ? "#14414F" : "#C98A2E"} light={225} shadow="#06151D" shadowOpacity={0.5} inset={14} rim={dim ? "#26525F" : "#FFE6A8"} hard />
      {sliders
        ? [0, 1, 2, 3, 4].map((i) => {
            const sx = 520 + i * 220;
            const ky = 700 + (dim ? 0 : Math.sin(f * 0.25 + i * 1.3) * 34);
            return (
              <g key={i}>
                <rect x={sx - 60} y={694} width={120} height={12} rx={6} fill={dim ? "#06151D" : "#5A3010"} />
                <rect x={sx - 20 + (ky - 700) * 2.2} y={676} width={40} height={48} rx={8} fill={dim ? "#26525F" : C.paper} stroke={dim ? "#06151D" : "#5A3010"} strokeWidth={3} />
              </g>
            );
          })
        : null}
      <rect x={260} y={760} width={1400} height={170} fill={dim ? "#0B2530" : "#9C6A16"} />
    </g>
  );
};

// ================================================================================================================
// 1-04 · the control desk: the sun-moon disc turning (6 deg/f), the sliders sliding (22 px/f); Tick works them
// ================================================================================================================
const ShotDesk: ShotFC<CL01> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={STUDIO.theme} cam={{ x: 960 + f * 0.6, y: 540, zoom: 1.02 + f * 0.0008 }} vignette={0.12} grain={0.5}>
      <Studio f={f} floor={930} />
      <Layer depth={1}>
        <Desk f={f} disc={f * 6} />
        <Tick x={1540} y={990} pxPerM={200} frame={f} facing={-1} pose={Math.floor(f / 40) % 2 ? "press" : "point"} expression="thinking" look={0.1} />
      </Layer>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 1-05 · BALANCING AUTHORITIES: region tiles pop in (stagger 6 f), each with a dial pair; rings pulse out (10 px/f)
// ================================================================================================================
const TILE_COLS = ["#2F7F6E", "#C98A2E", "#5FB09A", "#E3813F", "#2A6E78", "#9C6A16", "#3F8E5E"];
const ShotRegions: ShotFC<CL01> = ({ f }) => {
  const tiles = Array.from({ length: 12 }, (_, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    return { x: 460 + col * 330 + (row % 2) * 120 + (rnd(i * 3) - 0.5) * 50, y: 400 + row * 200, i };
  });
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.01, frames: 160, seed: 4 }} vignette={0.12} grain={0.5}>
        <Studio f={f} floor={960} />
        <Layer depth={1}>
          {tiles.map(({ x, y, i }) => {
            const age = f - 6 - i * 6;
            if (age < 0) return null;
            const s = age < 8 ? 0.4 + 0.6 * (age / 8) + Math.sin((age / 8) * Math.PI) * 0.15 : 1;
            const pts = Array.from({ length: 6 }, (_, k) => {
              const a = (k / 6) * Math.PI * 2 + rnd(i) * 0.4;
              const rr = 150 * (0.85 + rnd(i * 7 + k) * 0.25);
              return `${(x + Math.cos(a) * rr * 1.1).toFixed(1)} ${(y + Math.sin(a) * rr * 0.62).toFixed(1)}`;
            });
            const ring = wrap(age * 10, 160);
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
                <ellipse cx={x} cy={y} rx={60 + ring * 1.5} ry={(60 + ring * 1.5) * 0.6} fill="none" stroke={C.saffronCore} strokeWidth={5} opacity={0.6 * (1 - ring / 160)} />
                <Form d={"M" + pts.join(" L") + " Z"} fill={TILE_COLS[i % TILE_COLS.length]} light={225} shadow="#1E4A5C" shadowOpacity={0.5} inset={12} rim="#FFF4DE" hard />
                <Gauge x={x - 42} y={y - 6} r={34} angle={20 * Math.sin(f / 9 + i)} face={C.paper} ink={C.ink} />
                <Gauge x={x + 42} y={y - 6} r={34} angle={20 * Math.sin(f / 9 + i)} face={C.paper} ink={C.ink} />
              </g>
            );
          })}
        </Layer>
        <Layer depth={0}>
          <Kicker x={120} y={110} text="Balancing authorities" color={C.ink} size={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-06 + 1-07 · the desk dim, the chair rolls back (14 px/f), the needles drift apart (3 deg/f; OUR REASONING); push to
// the city: the dark wave sweeps down the windows (30 px/f), the wire glow drains (28 px/f), Tick watches from the rail
// ================================================================================================================
const ShotDim: ShotFC<CL01> = ({ f, c }) => {
  const T7 = c.s07 - c.s06;
  const spread = Math.min(70, f * 3 * ez(f, 6, 20));
  const chairX = 1180 + Math.min(700, Math.max(0, f - 10) * 14);
  const A = (
    <Stage theme={NIGHT.theme} cam={{ x: 960 + f * 0.8, y: 540, zoom: 1.03 + f * 0.0008 }} vignette={0.36} grain={0.5}>
      <Sky family={NIGHT} />
      <Layer depth={0.1}>
        <StarsTint f={f} n={50} speed={2} h={300} seed={8} />
      </Layer>
      <Layer depth={1}>
        <Floor y={930} color="#0B2530" foot="#020B10" />
        <Desk f={f} dim spread={spread} disc={200} sliders />
        <Bloom x={960} y={480} r={420} color={C.amber} strength={0.18} />
        {/* the empty chair rolling back */}
        <g transform={`translate(${chairX} 0) rotate(${Math.sin(f / 5) * 2} 0 900)`}>
          <rect x={-70} y={770} width={140} height={26} rx={10} fill="#26525F" />
          <rect x={-60} y={640} width={26} height={150} rx={10} fill="#26525F" />
          <rect x={-8} y={796} width={16} height={80} fill="#14414F" />
          {[-50, 0, 50].map((wx, i) => (
            <g key={i}>
              <circle cx={wx} cy={900} r={16} fill="#06151D" stroke="#3F7F8E" strokeWidth={4} />
              <line x1={wx} y1={900} x2={wx + Math.cos(f * 0.4 + i) * 14} y2={900 + Math.sin(f * 0.4 + i) * 14} stroke="#3F7F8E" strokeWidth={4} />
            </g>
          ))}
        </g>
      </Layer>
      <Layer depth={0}>
        <ReasoningPill x={120} y={110} size={26} appear={ez(f, 10, 22)} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T7);
  const drain = drainFor(g, 4, 620, 30);
  const wireLit = 1 - Math.min(1, Math.max(0, g - 8) * 28 / 1600);
  const B = (
    <Stage theme={NIGHT.theme} cam={{ x: 960, y: 540, zoom: 1.02 + g * 0.0006 }} vignette={0.36} grain={0.5}>
      <Sky family={NIGHT} />
      <Layer depth={0.1}>
        <StarsTint f={g} n={100} speed={2} h={500} seed={9} />
      </Layer>
      <Layer depth={0.5}>
        <Skyline f={g} family={NIGHT} ground={820} scale={1.1} lights={0.95} wave={0} drain={drain} seed={4} />
      </Layer>
      <Layer depth={0.8}>
        <PylonRow f={g * 0.1} base={900} h={520} gap={760} speed={0} lit={wireLit} seed={5} ink="#04121A" />
      </Layer>
      <Layer depth={1}>
        <Floor y={900} color="#06151D" foot="#020B10" />
        <Rail f={g} y={960} speed={3} family={NIGHT} />
        <TimeCamera x={300} y={950} size={130} f={g} family={NIGHT} />
        <Tick x={470} y={952} pxPerM={130} frame={g} facing={1} pose="stand" expression="worried" look={0.6} headTilt={-8} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T7 - 6} dur={14} kind="push" a={A} b={B} />;
};

// the street cut open: a dark surface with a dead lamp, pavement layers and soil strata, pipes and cables, the water
const STRATA = ["#14262E", "#26323A", "#3A2A1E", "#4A3424", "#3A2A1E", "#2E2218", "#3A2A1E", "#241A12"];
const Underground: React.FC<{ f: number; ground: number; water: number; x0?: number; x1?: number }> = ({ f, ground, water, x0 = -400, x1 = 2320 }) => {
  const bands: React.ReactNode[] = [];
  let y = ground;
  let i = 0;
  while (y < water + 600) {
    const h = i === 0 ? 50 : i === 1 ? 90 : 160 + rnd(i * 7) * 140;
    bands.push(<rect key={i} x={x0} y={y} width={x1 - x0} height={h + 2} fill={STRATA[i % STRATA.length]} />);
    bands.push(<rect key={"e" + i} x={x0} y={y} width={x1 - x0} height={4} fill={i === 0 ? C.amber : "#5A4030"} opacity={i === 0 ? 0.6 : 0.5} />);
    y += h;
    i++;
  }
  const pipes = Array.from({ length: 12 }, (_, k) => ({ y: ground + 220 + k * ((water - ground - 300) / 12) + rnd(k * 3) * 60, r: 18 + rnd(k * 5) * 26, col: ["#5A6E72", "#2F6F80", "#9C6A16", "#3F7F8E"][k % 4], cable: k % 3 === 1 }));
  return (
    <g>
      {bands}
      {pipes.map((p, k) =>
        p.cable ? (
          <path key={k} d={`M${x0} ${p.y} Q${600} ${p.y + 40} ${1100} ${p.y - 10} T${x1} ${p.y + 20}`} fill="none" stroke={C.saffronDeep} strokeWidth={10} />
        ) : (
          <g key={k}>
            <rect x={x0} y={p.y - p.r} width={x1 - x0} height={p.r * 2} fill={p.col} />
            <rect x={x0} y={p.y - p.r} width={x1 - x0} height={p.r * 0.5} fill="#CFE6EA" opacity={0.25} />
            {Array.from({ length: 6 }, (_, j) => (
              <rect key={j} x={x0 + 200 + j * 420 + rnd(k + j) * 100} y={p.y - p.r - 6} width={22} height={p.r * 2 + 12} rx={4} fill={mixHex(p.col, "#06151D", 0.4)} />
            ))}
          </g>
        ),
      )}
      {/* vertical conduits */}
      {[420, 1380].map((vx, k) => (
        <rect key={k} x={vx} y={ground + 50} width={36} height={water - ground - 50} fill="#26525F" opacity={0.8} />
      ))}
      {/* the water below: dark teal with a shimmering surface */}
      <rect x={x0} y={water} width={x1 - x0} height={800} fill="#0F3540" />
      <path
        d={`M${x0} ${water} ${Array.from({ length: 60 }, (_, k) => `L${x0 + k * 50} ${water + Math.sin(k * 0.8 + f * 0.3) * 6}`).join(" ")} L${x1} ${water}`}
        fill="none"
        stroke="#7FD0E8"
        strokeWidth={5}
        opacity={0.8}
      />
      {Array.from({ length: 10 }, (_, k) => (
        <rect key={k} x={x0 + 120 + k * 260 + Math.sin(f / 9 + k) * 30} y={water + 30 + (k % 3) * 40} width={90} height={5} rx={2} fill="#7FD0E8" opacity={0.4} />
      ))}
    </g>
  );
};

// ================================================================================================================
// 1-08 + 1-09 · the camera drops through the street: pavement layers sliding up (24 px/f), a drip falling (20 px/f);
// then the wide cutaway: the dark skyline above, pipes and cables sliding up (24 px/f) toward the dark water line
// ================================================================================================================
const ShotDescend: ShotFC<CL01> = ({ f, c }) => {
  const T9 = c.s09 - c.s08;
  const camY = 300 + f * 24;
  const dripY = (k: number) => 600 + wrap((f - k * 30) * 20, 700);
  const A = (
    <Stage theme={NIGHT.theme} cam={{ x: 960, y: camY, zoom: 1.1 }} vignette={0.36} grain={0.5}>
      <Sky family={NIGHT} />
      <Layer depth={0.3}>
        <Skyline f={f} family={NIGHT} ground={560} scale={0.9} lights={0} wave={0} seed={4} />
      </Layer>
      <Layer depth={1}>
        <Underground f={f} ground={560} water={3400} />
        {[0, 1].map((k) => (
          <g key={k}>
            <ellipse cx={980 + k * 340} cy={camY - 540 + dripY(k) - 600 + 120} rx={9} ry={14} fill="#BFF0F2" />
            <circle cx={980 + k * 340} cy={camY - 540 + 110} r={12} fill="#BFF0F2" opacity={0.7} />
          </g>
        ))}
        <Motes frame={f} n={20} x={0} y={camY - 540} w={1920} h={1080} color={alpha("#CFE6EA", 0.5)} seed={7} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T9);
  const ground = 380 - g * 24;
  const B = (
    <Stage theme={NIGHT.theme} cam={{ x: 960, y: 540, zoom: 1 }} vignette={0.36} grain={0.5}>
      <Sky family={NIGHT} />
      <Layer depth={1}>
        <g transform={`translate(0 ${ground - 380})`}>
          <StarsTint f={g} n={50} speed={1} y={-200} h={420} seed={11} />
          <Skyline f={g} family={NIGHT} ground={380} scale={0.7} lights={0.04} wave={0} seed={6} />
        </g>
        <g transform={`translate(0 ${ground - 380})`}>
          <ClipBox x={-200} y={380} w={2400} h={4000}>
            <g transform="translate(960 380) scale(0.6) translate(-960 -380)">
              <Underground f={g} ground={380} water={380 + 4100} />
            </g>
          </ClipBox>
        </g>
        <Bloom x={960} y={980} r={600} color="#2F8FB0" strength={0.2} squash={0.3} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T9 - 6} dur={12} kind="push" a={A} b={B} />;
};

// ================================================================================================================

export const SceneL01: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL01(t);
  const shots: ShotDef<CL01>[] = [
    { from: 0, S: ShotGrid, id: "1-01" }, // + 1-02, 1-03
    { from: c.s04, S: ShotDesk, id: "1-04" },
    { from: c.s05, S: ShotRegions, id: "1-05" },
    { from: c.s06, S: ShotDim, id: "1-06" }, // + 1-07
    { from: c.s08, S: ShotDescend, id: "1-08" }, // + 1-09
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL01 = (t: SceneTiming): Cue[] => {
  const c = cuesL01(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 0, file: SFX.rumble, vol: 0.12, dur: c.s03, fadeIn: 20, fadeOut: 20 },
    { at: c.s02 - 6, file: SFX.whoosh, vol: 0.12, dur: 40 },
    ...run(c.s02 + 10, 6, 8),
    { at: c.s03 - 6, file: SFX.whoosh, vol: 0.12, dur: 40 },
    ...cutHit(c.s04),
    { at: c.s04 + 4, file: SFX.pop, vol: 0.14, dur: 16 },
    ...run(c.s04 + 10, 8, 10),
    ...cutHit(c.s05),
    { at: c.s05 + 6, file: SFX.popLong, vol: 0.16, dur: 30 },
    ...cutHit(c.s06),
    { at: c.s06 + 4, file: SFX.rumble, vol: 0.12, dur: c.s07 - c.s06, fadeOut: 40 },
    { at: c.s07 - 6, file: SFX.whoosh, vol: 0.12, dur: 40 },
    { at: c.s07 + 4, file: SFX.rumble, vol: 0.22, dur: c.s08 - c.s07, fadeIn: 8, fadeOut: 20 },
    ...cutHit(c.s08),
    { at: c.s08 + 2, file: SFX.deepWhoosh, vol: 0.24, dur: 70 },
  ];
};
