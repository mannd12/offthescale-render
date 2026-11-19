// L17 scene "l05" · One hundred years: the rust (storyboard §3 scene 5: 5-01…5-09, script lines 20-23; `rust` cutaways ↔
// `studio` loop ↔ `night` collapse → `noon` dome and the A THOUSAND YEARS card). Shot components (hard cuts only):
//   5-01   a concrete block in cutaway, the light sweeping its bars; building / bridge / road tiles pop in; Tick taps it
//   5-02   salty water seeps in and touches a bar; rust blooms along it (SALT + WATER)
//   5-03   a clean bar beside a rusted one: the brackets measure, the rust swells and sheds scale
//   5-04   cracks fan out from the bar with dust puffs
//   5-05   a chunk breaks away and falls; Tick catches it on his clipboard at arm's length (SPALL)
//   5-06   drops hit the bare bar; the rust spreads and loosens the next chunk
//   5-07   the loop WATER → RUST → CRACK: a pulse chases round, the loop thickens each lap; Tick follows it
//   5-08   night: the cracks fan like a delta, a dark building leans and folds gently (OUR REASONING; no windows lit)
//   5-09   the dust settles, the camera slides to the sunlit dome; the A THOUSAND YEARS: ROME card
// Numbers drawn: none (row 6 words: SALT + WATER, SPALL). The dome is generic and unnamed (F3).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, CycClouds, Cumulus, Form, Layer, Motes, Puffs, Sky, Stage, Tick, alpha, mixHex, rnd, rrect } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { CrackDraw, DotStream, StarsTint, crackDrawFor } from "../movers17";
import { RungBadge, RungCard } from "../ladder";
import { ReasoningPill, WordPill } from "../stamps17";
import { ShotDef, ShotFC, lineFrac, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Block, C, CREAM, ClipBox, Clipboard, DomeHall, Floor, Label, NIGHT, NOON, Phase, Pop, RUST, RebarBlock, RustBar, STUDIO, ez, handAt, lerp, lin, wrap } from "./a-parts";

const D2R = Math.PI / 180;

export const cuesL05 = (t: SceneTiming) => {
  const { at, end } = cueKit(t);
  return {
    s01: 0,
    s02: lineFrac(t, 0, 0.31),
    s03: lineFrac(t, 0, 0.65),
    s04: at(1),
    s05: at(2),
    s06: lineFrac(t, 2, 0.32),
    s07: lineFrac(t, 2, 0.66),
    s08: at(3),
    s09: lineFrac(t, 3, 0.55),
    card: end(3, -12), // the RungCard starts as the line ends (pause + the 1.0-s hold)
    end: t.frames,
  };
};
export type CL05 = ReturnType<typeof cuesL05>;

const RustRoom: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky family={RUST} />
    <Layer depth={0.2}>
      <Bloom x={260} y={300} r={620} color={C.amber} core={40} coreColor="#FFE6A8" strength={0.6} />
    </Layer>
    <Layer depth={0.9}>
      <Motes frame={f} n={26} w={1920} h={1080} color={alpha("#FFE6A8", 0.6)} seed={4} />
    </Layer>
  </g>
);

// three tiles: a building, a bridge, a road (generic silhouettes, no people)
const UseTile: React.FC<{ x: number; y: number; kind: 0 | 1 | 2; age: number }> = ({ x, y, kind, age }) => {
  if (age < 0) return null;
  const s = age < 8 ? 0.4 + 0.6 * (age / 8) + Math.sin((age / 8) * Math.PI) * 0.18 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Form d={rrect(-90, -90, 180, 180, 24)} fill={C.paper} light={225} shadow="#7A3418" shadowOpacity={0.4} inset={12} rim="#FFFFFF" hard />
      {kind === 0 ? (
        <g>
          <rect x={-40} y={-60} width={80} height={110} fill="#8F8670" />
          {[0, 1, 2].map((r) => [0, 1].map((k) => <rect key={`${r}${k}`} x={-28 + k * 32} y={-48 + r * 32} width={22} height={20} fill="#3A2A1E" />))}
        </g>
      ) : kind === 1 ? (
        <g fill="none" stroke="#5A4A30" strokeWidth={10}>
          <path d="M-70 30 Q0 -50 70 30" />
          <line x1={-80} y1={30} x2={80} y2={30} />
          <line x1={-40} y1={30} x2={-40} y2={60} />
          <line x1={40} y1={30} x2={40} y2={60} />
        </g>
      ) : (
        <g>
          <path d="M-30 60 L-10 -60 L10 -60 L30 60 Z" fill="#5A4A30" />
          {[0, 1, 2].map((k) => (
            <rect key={k} x={-3} y={-48 + k * 40} width={6} height={20} fill="#FFE6A8" />
          ))}
        </g>
      )}
    </g>
  );
};

// ================================================================================================================
// 5-01 · the concrete block in cutaway; a light sweeps along its bars (24 px/f); three tiles pop (stagger 10 f); Tick taps
// ================================================================================================================
const ShotBlock: ShotFC<CL05> = ({ f }) => (
  <Stage theme={RUST.theme} cam={{ x: 960 + f * 0.6, y: 540, zoom: 1.02 + f * 0.0008 }} vignette={0.24} grain={0.5}>
    <RustRoom f={f} />
    <Layer depth={1}>
      <Floor y={960} color="#3A1208" foot="#240A04" lip="#E3813F" />
      <RebarBlock x={420} y={300} w={1080} h={600} bars={3} glint={300 + wrap(f * 24, 1400)} seed={2} />
      {[0, 1, 2].map((k) => (
        <UseTile key={k} x={1660} y={330 + k * 230} kind={k as 0 | 1 | 2} age={f - 20 - k * 10} />
      ))}
      <Tick x={250} y={962} pxPerM={210} frame={f} facing={1} pose="point" staff expression="thinking" look={0.3} />
    </Layer>
    <Layer depth={0}>
      <RungBadge f={f} rung={4} family={RUST} />
    </Layer>
  </Stage>
);

// ================================================================================================================
// 5-02 · salty water seeps into the wall (14 px/f) and touches a bar; rust blooms along it (10 px/f)
// ================================================================================================================
const ShotSalt: ShotFC<CL05> = ({ f }) => {
  const front = Math.max(0, f - 30) * 10;
  return (
    <Pop f={f}>
      <Stage theme={RUST.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.015, panY: 0.01, frames: 140, seed: 2 }} vignette={0.24} grain={0.5}>
        <RustRoom f={f} />
        <Layer depth={1}>
          <g transform="translate(960 560) scale(1.8) translate(-960 -560)">
            <RebarBlock x={300} y={300} w={1320} h={520} bars={1} seed={5} />
            <ClipBox x={330} y={540} w={1260} h={40}>
              <rect x={960 - front} y={540} width={front * 2} height={40} fill={C.rust} />
              <rect x={960 - front} y={540} width={front * 2} height={10} fill={C.lever} opacity={0.6} />
            </ClipBox>
          </g>
          <DotStream f={f} from={[960, -40]} to={[960, 520]} n={40} speed={14} spread={120} color="#3FA9C8" size={14} seed={3} />
          <DotStream f={f} from={[960, -40]} to={[960, 520]} n={20} speed={14} spread={110} color="#FFFFFF" size={8} seed={8} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={120} y={110} text="salt + water" size={28} dot="#3FA9C8" appear={ez(f, 8, 20)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-03 · a clean bar beside a rusted bar of the same length; a bracket on each measures (opening 12 px/f); the rusted one
// swells and sheds scale
// ================================================================================================================
const ShotSwell: ShotFC<CL05> = ({ f, len }) => {
  const sw = lin(f, 6, len);
  const th = (32 + 34 * sw) * 2.4;
  const yC = 380;
  const yR = 740;
  const caliper = (x: number, y: number, h: number) => (
    <g stroke={CREAM} strokeWidth={7} fill="none" strokeLinecap="round">
      <line x1={x} y1={y - h / 2 - 20} x2={x + 90} y2={y - h / 2 - 20} />
      <line x1={x} y1={y + h / 2 + 20} x2={x + 90} y2={y + h / 2 + 20} />
      <line x1={x + 90} y1={y - h / 2 - 20} x2={x + 90} y2={y + h / 2 + 20} />
    </g>
  );
  return (
    <Pop f={f}>
      <Stage theme={RUST.theme} cam={{ x: 960 + f * 1.8, y: 540, zoom: 1.02 + f * 0.0008 }} vignette={0.24} grain={0.5}>
        <RustRoom f={f} />
        <Layer depth={1}>
          <DotStream f={f} from={[860, yR - 60]} to={[900, yR - 520]} n={50} speed={16} spread={700} color={C.lever} size={11} seed={6} />
          <rect x={260} y={yC - 38} width={1200} height={77} rx={38} fill="#4F9AB4" />
          <rect x={260} y={yC - 38} width={1200} height={20} rx={10} fill="#CFE6EA" opacity={0.6} />
          <ellipse cx={260 + wrap(f * 24, 1200)} cy={yC - 20} rx={90} ry={12} fill="#FFFFFF" opacity={0.85} />
          {caliper(1500, yC, 77)}
          <g transform={`translate(260 ${yR}) scale(2.4) translate(-260 ${-yR})`}>
            <RustBar x={260} y={yR} w={500} swell={sw} f={f * 3} seed={4} />
          </g>
          {caliper(1500, yR, th)}
          <Label x={160} y={yC + 12} text="steel" size={28} color={CREAM} align="end" />
          <Label x={160} y={yR + 12} text="rust" size={28} color={CREAM} align="end" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-04 · cracks fan out from the swollen bar (50 px/f) with dust puffs (12 px/f)
// ================================================================================================================
const ShotCracks: ShotFC<CL05> = ({ f, len }) => {
  const fans = [-60, -30, 0, 30, 60, 160, 190, 220];
  return (
    <Pop f={f}>
      <Stage theme={RUST.theme} cam={{ x: 960 + f * 0.6, y: 540, zoom: 1.04 + f * 0.001 }} vignette={0.24} grain={0.5}>
        <RustRoom f={f} />
        <Layer depth={1}>
          <RebarBlock x={140} y={180} w={1640} h={720} bars={1} rust={[1]} seed={6} />
          {fans.map((a, i) => (
            <CrackDraw key={i} x={960 + (i - 3.5) * 110} y={540} rotate={a - 90} seed={i + 3} length={700} draw={crackDrawFor(f, 2 + i * Math.max(4, (len - 20) / 8), 700, 50)} widen={lin(f, 20 + i * 8, len) * 0.5} width={9} color="#240A04" branches={3} />
          ))}
          <DotStream f={f} from={[960, 560]} to={[960, 920]} n={60} speed={16} spread={1300} color="#F2C8A4" size={8} gravity={1} seed={9} />
          {[0, 1, 2].map((i) => (
            <Puffs key={i} frame={f} x={700 + i * 260} y={420} color={alpha("#F2C8A4", 0.6)} period={18} size={24} rise={0.6} drift={2} life={40} seed={i + 2} />
          ))}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-05 · a chunk breaks away beside the bar and falls (24 px/f, 6 deg/f); Tick catches it on his clipboard at arm's length
// ================================================================================================================
const ShotSpall: ShotFC<CL05> = ({ f }) => {
  const tick = { x: 1460, y: 1000, ppm: 280 };
  const [hx, hy] = handAt(tick.x, tick.y, tick.ppm, -1, [36, -104]);
  const cb = { x: hx - 30, y: hy - 10 };
  const u = Math.max(0, f - 16);
  const fall = Math.min(1, (u * 24) / Math.max(1, cb.y - 70 - 330));
  const cx = lerp(1120, cb.x, fall);
  const cy = lerp(330, cb.y - 70, fall);
  const rot = Math.min(u * 6, 120);
  const caught = fall >= 1;
  return (
    <Pop f={f}>
      <Stage theme={RUST.theme} cam={{ x: 960 - f * 1.6, y: 540, zoom: 1.02 + f * 0.0008 }} vignette={0.24} grain={0.5}>
        <RustRoom f={f} />
        <Layer depth={1}>
          <Floor y={1000} color="#3A1208" foot="#240A04" lip="#E3813F" />
          {f > 16 ? <DotStream f={f} from={[1140, 400]} to={[1140, 1000]} n={40} speed={18} spread={120} color="#F2C8A4" size={9} gravity={1} seed={4} /> : null}
          {f > 70 ? (
            <g transform={`translate(1040 ${Math.min(950, 330 + (f - 70) * 24)}) rotate(${Math.min((f - 70) * 6, 200)})`}>
              <Form d="M-60 -50 L50 -60 L70 10 L10 60 L-60 40 Z" fill="#D9B07A" light={225} shadow="#5A3A20" shadowOpacity={0.5} inset={10} rim="#FFF6E6" hard />
            </g>
          ) : null}
          <ClipBox x={-200} y={0} w={1580} h={1200}>
            <RebarBlock x={-120} y={120} w={1440} h={560} bars={1} rust={[1]} seed={7} />
            {/* the hole the chunk left */}
            <path d="M1050 260 L1200 240 L1240 330 L1170 410 L1060 390 Z" fill="#240A04" opacity={f > 16 ? 1 : 0} />
          </ClipBox>
          {f > 14 ? <Puffs frame={f} x={1140} y={330} color={alpha("#F2C8A4", 0.6)} period={10} size={24} rise={0.4} drift={2} life={36} seed={4} /> : null}
          <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
            <Form d="M-90 -70 L60 -90 L100 0 L30 80 L-80 60 Z" fill={C.concrete} light={225} shadow="#5A3A20" shadowOpacity={0.5} inset={12} rim="#FFF6E6" hard />
            <rect x={-60} y={-10} width={120} height={20} rx={10} fill={C.rust} />
          </g>
          <Clipboard x={cb.x} y={cb.y} s={2.2} angle={caught ? -6 + Math.sin(f / 3) * 2 : 0} />
          <Tick x={tick.x} y={tick.y} pxPerM={tick.ppm} frame={f} facing={-1} pose="hold" expression={caught ? "surprised" : "thinking"} look={-0.4} headTilt={caught ? 8 : 0} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={120} y={110} text="spall" size={30} appear={ez(f, 20, 32)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-06 · water drops hit the bare bar (20 px/f); rust spreads (14 px/f) and loosens the next chunk
// ================================================================================================================
const ShotBare: ShotFC<CL05> = ({ f, len }) => {
  const spread = 80 + 1800 * lin(f, 0, len);
  const wob = Math.sin(f * 0.8) * (2 + 8 * lin(f, 0, len));
  return (
    <Pop f={f}>
      <Stage theme={RUST.theme} cam={{ x: 960 + f * 1.6, y: 540, zoom: 1.03 + f * 0.0008 }} vignette={0.26} grain={0.5}>
        <RustRoom f={f} />
        <Layer depth={1}>
          <rect x={-200} y={200} width={2400} height={720} fill="#D9B07A" />
          <path d="M700 380 L1240 380 L1240 700 L700 700 Z" fill="#3A1208" />
          <rect x={-200} y={510} width={2400} height={70} rx={35} fill="#4F9AB4" />
          <rect x={960 - spread / 2} y={505} width={spread} height={80} rx={40} fill={C.rust} />
          <rect x={960 - spread / 2} y={505} width={spread} height={18} rx={9} fill={C.lever} opacity={0.6} />
          {Array.from({ length: 5 }, (_, i) => {
            const y = 120 + wrap(f * 20 + i * 90, 400);
            return <ellipse key={i} cx={820 + i * 80} cy={y} rx={22} ry={34} fill="#3FA9C8" stroke="#BFF0F2" strokeWidth={4} />;
          })}
          {/* the next chunk loosening */}
          <g transform={`translate(${wob} ${wob * 0.5})`}>
            <path d="M1240 380 L1500 360 L1540 560 L1460 700 L1240 700 Z" fill="#9C9078" stroke="#240A04" strokeWidth={8} strokeDasharray={f > 60 ? "none" : "18 12"} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-07 · the loop WATER → RUST → CRACK → WATER: a bright pulse chases round (40 px/f), the loop thickens each lap; Tick
// follows the pulse with his staff
// ================================================================================================================
const ShotLoop: ShotFC<CL05> = ({ f }) => {
  const R = 300;
  const O = { x: 820, y: 520 };
  const laps = (f * 40) / (2 * Math.PI * R);
  const a = laps * 2 * Math.PI - Math.PI / 2;
  const px = O.x + Math.cos(a) * R;
  const py = O.y + Math.sin(a) * R;
  const thick = 10 + Math.floor(laps) * 8;
  const nodes = [
    { a: -90, t: "water", col: "#3FA9C8" },
    { a: 30, t: "rust", col: C.rust },
    { a: 150, t: "crack", col: "#8F8670" },
  ];
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.015, panY: 0, frames: 170, seed: 6 }} vignette={0.12} grain={0.5}>
        <Sky family={STUDIO} />
        <Layer depth={0.2}>
          <CycClouds f={f} y={100} n={4} seed={8} />
        </Layer>
        <Layer depth={1}>
          <Floor y={940} color={STUDIO.mid} lip="#FFE6A8" foot={STUDIO.near} />
          <circle cx={O.x} cy={O.y} r={R} fill="none" stroke="#1E4A5C" strokeWidth={thick} />
          {[0, 1, 2].map((k) => {
            const ang = (-90 + k * 120 + 60) * D2R;
            const ax = O.x + Math.cos(ang) * R;
            const ay = O.y + Math.sin(ang) * R;
            return <path key={k} d={`M${ax} ${ay} l${-Math.sin(ang) * 0 - 22} ${-14} l${44} ${14} l${-44} ${14} Z`} fill="#1E4A5C" transform={`rotate(${(ang / D2R) + 90} ${ax} ${ay})`} />;
          })}
          <path d={`M${O.x + Math.cos(a - 1.4) * R} ${O.y + Math.sin(a - 1.4) * R} A${R} ${R} 0 0 1 ${px} ${py}`} fill="none" stroke={C.saffronCore} strokeWidth={thick + 22} strokeLinecap="round" opacity={0.85} />
          <circle cx={px} cy={py} r={44} fill={C.saffronCore} opacity={0.4} />
          <circle cx={px} cy={py} r={22} fill="#FFFFFF" />
          {nodes.map((n, i) => {
            const nx = O.x + Math.cos(n.a * D2R) * R;
            const ny = O.y + Math.sin(n.a * D2R) * R;
            const sw = 1 + 0.2 * Math.max(0, 1 - Math.hypot(px - nx, py - ny) / 180);
            return (
              <g key={i} transform={`translate(${nx} ${ny}) scale(${sw}) translate(${-nx} ${-ny})`}>
                <Form d={`M${nx - 110} ${ny} a110 110 0 1 0 220 0 a110 110 0 1 0 -220 0 Z`} fill={n.col} light={225} shadow="#1E4A5C" shadowOpacity={0.5} inset={14} rim="#FFF4DE" hard />
                <Label x={nx} y={ny + 12} text={n.t} size={32} color={CREAM} />
              </g>
            );
          })}
          <Tick x={1460} y={940} pxPerM={250} frame={f} facing={-1} pose="point" staff expression="worried" look={-0.3} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-08 · night: cracks fan like a river delta (40 px/f); a dark building leans and folds gently (1 deg/f) with dust puffs
// (12 px/f); no windows lit (OUR REASONING)
// ================================================================================================================
const ShotFold: ShotFC<CL05> = ({ f, len }) => {
  const lean = Math.min(30, Math.max(0, f - 20) * 1);
  const sink = Math.max(0, f - 60) * 4;
  const hinge = { x: 1220, y: 640 };
  return (
    <Pop f={f}>
      <Stage theme={NIGHT.theme} cam={{ x: 960 + f * 0.6, y: 540, zoom: 1.02 + f * 0.0008 }} vignette={0.38} grain={0.5}>
        <Sky family={NIGHT} />
        <Layer depth={0.1}>
          <StarsTint f={f} n={100} speed={2} h={600} seed={17} />
        </Layer>
        <Layer depth={0.4}>
          <Block x={-100} base={900} w={360} h={420} fill="#14414F" win="#06151D" edge="#26525F" />
          <Block x={1640} base={900} w={360} h={360} fill="#14414F" win="#06151D" edge="#26525F" />
        </Layer>
        <Layer depth={1}>
          <rect x={-300} y={900} width={2520} height={400} fill="#06151D" />
          <Block x={820} base={900} w={400} h={260} floors={3} />
          <g transform={`translate(0 ${sink}) rotate(${lean} ${hinge.x} ${hinge.y})`}>
            <Block x={820} base={hinge.y} w={400} h={460} floors={5} />
          </g>
          {[0, 1, 2, 3, 4].map((i) => (
            <CrackDraw key={i} x={1020} y={640} rotate={110 + i * 22} seed={i + 9} length={900} draw={crackDrawFor(f, 4 + i * Math.max(4, (len - 30) / 5), 900, 40)} width={7} color="#020B10" branches={3} />
          ))}
          {f > 40
            ? [0, 1, 2].map((i) => (
                <Puffs key={i} frame={f} x={900 + i * 140} y={880} color={alpha("#9FC8C6", 0.5)} period={12} size={34} rise={0.7} drift={3} life={50} seed={i + 5} />
              ))
            : null}
          <Bloom x={960} y={900} r={600} color={C.amber} strength={0.18} squash={0.3} />
        </Layer>
        <Layer depth={0}>
          <ReasoningPill x={120} y={110} size={26} appear={ez(f, 10, 22)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 5-09 · the dust settles (8 px/f) over the rubble; the camera slides to the pale dome in sunlight (26 px/f); the RungCard
// A THOUSAND YEARS: ROME (the dial rolling, the rung glowing; hold 1.0 s)
// ================================================================================================================
const DomeSet: React.FC<{ f: number; x?: number }> = ({ f, x = 1180 }) => (
  <g>
    <Layer depth={0.2}>
      <Bloom x={1560} y={200} r={520} color="#FFF3C8" core={60} coreColor="#FFFBEA" strength={0.85} />
      {[0, 1].map((i) => (
        <Cumulus key={i} x={-300 + wrap(f * 2 + i * 1100, 2600)} y={220 + i * 80} w={420} h={110} fill="#FFFFFF" shade="#CFEAE4" lit="#FFFFFF" seed={i + 8} frame={f} />
      ))}
    </Layer>
    <Layer depth={1}>
      <Floor y={900} color={NOON.mid} foot={NOON.near} lip="#FFF3C8" x={-800} w={5200} />
      <DomeHall x={x} base={900} w={760} />
    </Layer>
  </g>
);
const ShotDome: ShotFC<CL05> = ({ f, len, c }) => {
  const TC = c.card - c.s09;
  const slide = Math.min(1500, f * 26);
  const A = (
    <Stage theme={NOON.theme} cam={{ x: 400 + slide, y: 540, zoom: 1 }} vignette={0.12} grain={0.5}>
      <Sky family={NOON} />
      <DomeSet f={f} x={2000} />
      <Layer depth={1}>
        {Array.from({ length: 9 }, (_, i) => (
          <Form key={i} d={rrect(80 + i * 90 + (i % 3) * 20, 860 - (i % 4) * 30, 120, 60 + (i % 4) * 30, 10)} fill={mixHex("#8F8670", "#5A4A30", rnd(i))} light={315} shadow="#1F4F4C" shadowOpacity={0.4} inset={8} hard />
        ))}
        <DotStream f={f} from={[500, 200]} to={[500, 880]} n={60} speed={8} spread={500} color="#E8D9C0" size={6} gravity={1} seed={5} />
      </Layer>
    </Stage>
  );
  const kCard = (f - TC) / Math.max(1, len - TC);
  const Card = <RungCard family={NOON} title="A THOUSAND YEARS: ROME" t={Math.max(0, kCard)} frame={f} rung={5} from={4} behind={(fr) => <DomeSet f={fr} x={900} />} />;
  return <Phase f={f} at={TC - 8} dur={12} kind="fade" a={A} b={Card} />;
};

// ================================================================================================================

export const SceneL05: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL05(t);
  const shots: ShotDef<CL05>[] = [
    { from: 0, S: ShotBlock, id: "5-01" },
    { from: c.s02, S: ShotSalt, id: "5-02" },
    { from: c.s03, S: ShotSwell, id: "5-03" },
    { from: c.s04, S: ShotCracks, id: "5-04" },
    { from: c.s05, S: ShotSpall, id: "5-05" },
    { from: c.s06, S: ShotBare, id: "5-06" },
    { from: c.s07, S: ShotLoop, id: "5-07" },
    { from: c.s08, S: ShotFold, id: "5-08" },
    { from: c.s09, S: ShotDome, id: "5-09" },
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL05 = (t: SceneTiming): Cue[] => {
  const c = cuesL05(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 20, file: SFX.pop, vol: 0.14, dur: 16 },
    { at: 30, file: SFX.pop, vol: 0.14, dur: 16 },
    { at: 40, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.s02),
    ...cutHit(c.s03),
    { at: c.s03 + 10, file: SFX.pop, vol: 0.12, dur: 16 },
    ...cutHit(c.s04),
    { at: c.s04 + 4, file: SFX.debris, vol: 0.16, dur: 80, fadeOut: 20 },
    ...cutHit(c.s05),
    { at: c.s05 + 14, file: SFX.debris, vol: 0.18, dur: 60, fadeOut: 20 },
    { at: c.s05 + 34, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.s06),
    ...cutHit(c.s07),
    ...run(c.s07 + 6, 8, 20),
    ...cutHit(c.s08),
    { at: c.s08 + 30, file: SFX.debris, vol: 0.18, dur: 100, fadeOut: 30 },
    { at: c.s08 + 30, file: SFX.rumble, vol: 0.2, dur: c.s09 - c.s08 - 30, fadeIn: 10, fadeOut: 20 },
    ...cutHit(c.s09),
    { at: c.card + 4, file: SFX.boom, vol: 0.3, dur: 120, fadeOut: 40 },
  ];
};
