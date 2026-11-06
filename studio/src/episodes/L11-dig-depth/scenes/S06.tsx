// L11 scene l06 "A hole that won't stay a hole": bespoke shots keyed to the narration (episodes/L11-dig-depth/script.md §6).
// Every number drawn is a row in episodes/L11-dig-depth/sources.md:
//   cavities only while cutting, hardly grew, more of them and a wider hole below 4,500 m (#18) · "like plastic",
//   attributed to the project's scientists, plus "not melted" (#19) · the recap: 23 cm (#3), 180 °C (#15), motors
//   (#16), 24 km round trip (#2, #12 + arithmetic). The "like plastic" shots illustrate a quoted description: the
//   walls bow, the quote card carries the attribution, nothing on screen measures it.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneTiming } from "../../../lib/timeline";
import {
  BONE,
  CornerTicks,
  GRAPHITE,
  Hatch,
  Layer,
  P,
  PAIRS,
  ReferenceFigure,
  ScaleBar,
  Stage,
  bob,
  cameraAt,
  crawl,
  fall,
  labelStyle,
  lit,
  loadIllustratedFonts,
  mixHex,
  numStyle,
  ptsToPath,
  ramp,
  rnd,
  shade,
  specks,
  strataLine,
  stratumPath,
  tint,
  IF,
} from "../../../lib/illustrated";
import { phraseAt } from "../cues";
import { Cue } from "./cue-types";

loadIllustratedFonts();

const E = PAIRS.earth;
const ROCK = mixHex(E.a, P.graphite, 0.5);
const heat = (k: number) => mixHex(ROCK, E.b, k);
const STEEL = mixHex(P.chalk, P.graphite, 0.45);
const STEEL_LIT = mixHex(P.chalk, P.graphite, 0.3);

const lerp = (f: number, a: number, b: number, from: number, to: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

const cues06 = (t: SceneTiming) => {
  const at = (i: number) => t.lines[i].at;
  const p = (i: number, s: string, o = 0) => phraseAt(t, i, s, o);
  return {
    didnt: p(0, "This one didn't"),
    cut: p(0, "As the bit cut"),
    oddly: p(0, "Oddly"),
    once: p(0, "once made"),
    below: at(1) - 4,
    wider: p(1, "and the hole got wider"),
    near: at(2) - 6,
    plastic: p(2, "behaving"),
    notMelted: p(2, "Not melted"),
    job: at(3) - 6,
    plate: p(3, "A hole you could"),
    crumbles: p(3, "Rock that crumbles"),
    boil: p(3, "Eighty degrees"),
    motors: p(3, "Motors that"),
    trip: p(3, "and a twenty-four"),
    end: t.frames,
  };
};
type Cues = ReturnType<typeof cues06>;
type ShotProps = { f: number; F: number; c: Cues; len: number };


/** small top-left caption on a graphite backing plate, legible over the amber rock */
const Tag: React.FC<{ text: string }> = ({ text }) => (
  <g>
    <rect x={78} y={104} width={text.length * 19 + 36} height={52} fill={P.graphite} opacity={0.88} />
    <text x={96} y={140} style={labelStyle(28, P.chalk, 4)}>
      {text}
    </text>
  </g>
);

// ---------------------------------------------------------------------------------------------
// The macro wall: a section of the hole; the bit cuts down and pieces of the wall break away behind it
const WL = 760;
const WR = 1160;
const bitY = (F: number, c: Cues) => (F < c.once ? 120 + F * 1.55 : 120 + c.once * 1.55 - Math.pow(Math.max(0, F - c.once), 2) * 1.2);
type Cav = { at: number; y: number; side: -1 | 1; d: number; h: number };
const cavities = (c: Cues): Cav[] => {
  // the first break lands on "This one didn't"; then a steady run while the bit cuts; none after "once made"
  const times = [c.didnt + 6, c.cut + 14, c.cut + 40, c.cut + 70, c.cut + 100, c.oddly + 20, c.oddly + 60];
  return times.map((at, i) => ({ at, y: bitY(at, c) - 30, side: i % 2 ? 1 : -1, d: 40 + rnd(i + 3) * 40, h: 70 + rnd(i + 9) * 60 }));
};
const wallPts = (side: -1 | 1, F: number, cavs: Cav[]): [number, number][] => {
  const x0 = side < 0 ? WL : WR;
  const pts: [number, number][] = [];
  for (let y = -400; y <= 1900; y += 16) {
    let off = 0;
    for (const v of cavs) {
      if (v.side !== side || F < v.at) continue;
      const g = Math.min(1, (F - v.at) / 5);
      const u = Math.abs(y - v.y) / (v.h / 2);
      if (u < 1) off = Math.max(off, v.d * g * Math.min(1, (1 - u) * 2.2));
    }
    pts.push([x0 - side * -off, y]);
  }
  return pts;
};

const WallSet: React.FC<{ F: number; c: Cues; ghost?: Cav | null }> = ({ F, c, ghost }) => {
  const cavs = cavities(c);
  const L = wallPts(-1, F, cavs);
  const R = wallPts(1, F, cavs);
  const by = bitY(F, c);
  const cutting = F < c.once;
  const edges = Array.from({ length: 10 }, (_, i) => strataLine(-500, 2500, -400 + i * 260, 18, i * 1.9 + 3, 100));
  return (
    <g>
      <Hatch id="c6-r" color={mixHex(P.chalk, ROCK, 0.84)} gap={20} angle={25} width={1.3} />
      {edges.slice(0, 9).map((e, i) => (
        <path key={i} d={stratumPath(e, edges[i + 1])} fill={heat(0.12 + (i % 3) * 0.05)} />
      ))}
      <rect x={-500} y={-400} width={3000} height={2400} fill="url(#c6-r)" />
      {/* foliation lines in the rock */}
      {[-1, 1].map((s) =>
        [0, 1, 2].map((j) => (
          <path
            key={`${s}${j}`}
            d={ptsToPath(Array.from({ length: 24 }, (_, i) => [(s < 0 ? WL : WR) + s * (90 + j * 110) + Math.sin(i * 0.7 + j) * 12, -400 + i * 100] as [number, number]))}
            fill="none"
            stroke={mixHex(P.chalk, ROCK, 0.55)}
            strokeWidth={2}
            strokeDasharray="20 12"
            strokeDashoffset={crawl(F, 0.3)}
          />
        )),
      )}
      <path d={ptsToPath([...L, ...[...R].reverse()]) + " Z"} fill={P.graphite} />
      <path d={ptsToPath(R)} fill="none" stroke={mixHex(P.graphite, P.chalk, 0.28)} strokeWidth={12} />
      <path d={ptsToPath(L)} fill="none" stroke={P.chalk} strokeWidth={3} />
      <path d={ptsToPath(R)} fill="none" stroke={P.chalk} strokeWidth={3} />
      {ghost ? (
        <path
          d={ptsToPath(wallPts(ghost.side, ghost.at + 6, [ghost]).filter(([, y]) => Math.abs(y - ghost.y) < ghost.h))}
          fill="none"
          stroke={E.b}
          strokeWidth={4}
          strokeDasharray="12 8"
          strokeDashoffset={crawl(F, 1)}
        />
      ) : null}
      {/* falling flakes: each break sheds a straight-edged chip that tumbles down the hole */}
      {cavs.map((v, i) => {
        const age = F - v.at;
        if (age < 0 || age > 50) return null;
        const x = (v.side < 0 ? WL + 30 : WR - 30) + -v.side * age * 1.2;
        const y = v.y + 0.12 * age * age;
        const s = v.d * 0.5;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${age * 7 * v.side})`} opacity={1 - age / 50}>
            <path d={`M${-s} ${-s * 0.6} L${s * 0.7} ${-s * 0.8} L${s} ${s * 0.5} L${-s * 0.4} ${s * 0.7} Z`} fill={heat(0.2)} />
            <path d={`M${s * 0.7} ${-s * 0.8} L${s} ${s * 0.5} L${0} ${0} Z`} fill={shade(heat(0.2), 0.3)} />
          </g>
        );
      })}
      {fall(F, 26, WR - WL - 60, 1600, 4, 2.8, 4).map((g, i) => (
        <circle key={i} cx={WL + 30 + g.x} cy={by - 1500 + g.y} r={g.r * 0.7} fill={mixHex(P.chalk, P.graphite, 0.5)} />
      ))}
      {/* drill string + bit */}
      <g transform={`translate(${cutting ? Math.sin(F * 3.1) * 3 : 0} 0)`}>
        <rect x={900} y={by - 2200} width={120} height={2120} fill={STEEL} />
        <rect x={900} y={by - 2200} width={34} height={2120} fill={STEEL_LIT} />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={892} y={by - 380 - i * 340} width={136} height={30} fill={STEEL_LIT} />
        ))}
        <path d={`M${900} ${by - 80} L${1020} ${by - 80} L${1050} ${by} L${870} ${by} Z`} fill={STEEL_LIT} stroke={P.chalk} strokeWidth={2} />
        {[-60, 0, 60].map((dx) => (
          <path key={dx} d={`M${960 + dx - 26} ${by} L${960 + dx + 26} ${by} L${960 + dx} ${by + 50} Z`} fill={mixHex(P.chalk, P.graphite, 0.2)} />
        ))}
      </g>
    </g>
  );
};

const followCam = (F: number, c: Cues, dx: number, dy: number, z0: number, z1: number, f: number, len: number) => {
  const by = Math.max(bitY(F, c), 300);
  const z = z0 + (z1 - z0) * ramp(f, 0, len);
  return { x: 960 + dx, y: by + dy, zoom: z };
};

// Shot 1 - "you'd think a hole in solid rock stays a hole. This one didn't.": smooth walls, then the first piece breaks
const ShotStays: React.FC<ShotProps> = ({ f, F, c, len }) => {
  const cam = followCam(F, c, 0, -60, 1.0, 1.12, f, len);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.32}>
      <Layer depth={1}>
        <WallSet F={F} c={c} />
      </Layer>
      <Layer depth={0}>
        <text x={96} y={140} style={labelStyle(30, P.chalkSoft, 5)}>
          6
        </text>
        <text x={136} y={140} style={labelStyle(30, P.chalk, 5)}>
          A hole that won't stay a hole
        </text>
        <ScaleBar x={96} y={1000} px={100} label="10 CM" color={P.chalk} font={IF.label} />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 2 - "as the bit cut, pieces of the wall broke away": closer, from the side; the wall goes ragged behind the bit
const ShotCut: React.FC<ShotProps> = ({ f, F, c, len }) => {
  const cam = followCam(F, c, -170, -200, 1.45, 1.6, f, len);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.32}>
      <Layer depth={1}>
        <WallSet F={F} c={c} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 3 - "only while the drill was cutting": wider, with a turning glyph that spins while the bit cuts
const ShotWhile: React.FC<ShotProps> = ({ f, F, c, len }) => {
  const cam = followCam(F, c, 120, -260, 0.82, 0.9, f, len);
  const a = F * 0.25;
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.32}>
      <Layer depth={1}>
        <WallSet F={F} c={c} />
      </Layer>
      <Layer depth={0}>
        <g transform="translate(1600 200)">
          <circle r={70} fill={P.graphiteLift} stroke={P.chalk} strokeWidth={2} />
          {[0, 1, 2].map((i) => {
            const t0 = a + (i * Math.PI * 2) / 3;
            const pts: [number, number][] = Array.from({ length: 6 }, (_, j) => [Math.cos(t0 + j * 0.25) * 46, Math.sin(t0 + j * 0.25) * 46]);
            const [ex, ey] = pts[5];
            const nx = Math.cos(t0 + 1.25 + 0.3);
            const ny = Math.sin(t0 + 1.25 + 0.3);
            return (
              <g key={i}>
                <path d={ptsToPath(pts)} fill="none" stroke={E.b} strokeWidth={8} />
                <path d={`M${ex - ny * 12} ${ey + nx * 12} L${ex + ny * 12} ${ey - nx * 12} L${ex + nx * 18} ${ey + ny * 18} Z`} fill={E.b} />
              </g>
            );
          })}
          <text x={0} y={122} textAnchor="middle" style={labelStyle(32, P.chalk, 4)}>
            Cutting
          </text>
        </g>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 4 - "once made, they hardly grew": the bit is pulled away, a clock races, the cavity keeps its dashed outline
const ShotHeld: React.FC<ShotProps> = ({ f, F, c, len }) => {
  const cavs = cavities(c);
  const v = cavs[3];
  const cam = cameraAt(f, [
    { f: 0, x: v.side < 0 ? WL + 60 : WR - 60, y: v.y, zoom: 1.7 },
    { f: len + 20, x: v.side < 0 ? WL + 40 : WR - 40, y: v.y + 20, zoom: 1.9 },
  ]);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.32}>
      <Layer depth={1}>
        <WallSet F={F} c={c} ghost={v} />
      </Layer>
      <Layer depth={0}>
        <g transform="translate(1640 220)">
          <circle r={86} fill={P.graphiteLift} stroke={P.chalk} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={Math.sin(a) * 68} y1={-Math.cos(a) * 68} x2={Math.sin(a) * 80} y2={-Math.cos(a) * 80} stroke={P.chalk} strokeWidth={3} />;
          })}
          <line x1={0} y1={0} x2={Math.sin(f * 0.45) * 62} y2={-Math.cos(f * 0.45) * 62} stroke={P.chalk} strokeWidth={5} />
          <line x1={0} y1={0} x2={Math.sin(f * 0.04) * 40} y2={-Math.cos(f * 0.04) * 40} stroke={P.chalk} strokeWidth={7} />
          <circle r={7} fill={P.chalk} />
        </g>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// The long section: below 4,500 m the hole gets ragged and wider on average
const LKM = 70;
const LS = 150;
const LX = 960;
const ly = (z: number) => LS + z * LKM;
const holeHalf = (z: number, k: number, i: number) => {
  const deep = z > 4.5 ? 1 : 0;
  const bite = rnd(i * 7 + 1) > (deep ? 0.45 : 0.88) ? 3 + rnd(i * 3 + 2) * (deep ? 9 : 4) : 0;
  return 7 + deep * k * (5 + bite) + (1 - deep) * bite * 0.6;
};
const LongSection: React.FC<{ f: number; k: number; line: number }> = ({ f, k, line }) => {
  const N = 124;
  const L: [number, number][] = [];
  const R: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const z = (i / N) * 12.262;
    L.push([LX - holeHalf(z, k, i), ly(z)]);
    R.push([LX + holeHalf(z, k, i + 500), ly(z)]);
  }
  const bands = Array.from({ length: 14 }, (_, i) => strataLine(-1500, 3500, ly(i), 6, i * 2.1, 120));
  return (
    <g>
      <Hatch id="c6-l" color={mixHex(P.chalk, ROCK, 0.84)} gap={18} angle={28} width={1.2} />
      <rect x={-1500} y={LS - 400} width={5000} height={400} fill={P.graphite} />
      {bands.slice(0, 13).map((b, i) => (
        <path key={i} d={stratumPath(b, bands[i + 1])} fill={heat(0.08 + i * 0.05)} />
      ))}
      <rect x={-1500} y={LS} width={5000} height={14 * LKM} fill="url(#c6-l)" />
      <rect x={-1500} y={LS - 14} width={5000} height={14} fill={tint(E.a, P.bone, 0.35)} />
      <path d={ptsToPath([...L, ...[...R].reverse()]) + " Z"} fill={P.graphite} stroke={P.chalk} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      <g opacity={line}>
        <line x1={-1500} y1={ly(4.5)} x2={3500} y2={ly(4.5)} stroke={E.b} strokeWidth={3} strokeDasharray="16 10" strokeDashoffset={crawl(f, 0.8)} vectorEffect="non-scaling-stroke" />
      </g>
      {specks(f, 40, 2400, 900, 3, 5).map((s, i) => (
        <circle key={i} cx={s.x - 240} cy={LS + 20 + s.y} r={s.r * 0.6} fill={P.chalk} opacity={0.15} />
      ))}
    </g>
  );
};
const toScreen = (cam: { x: number; y: number; zoom: number }, wx: number, wy: number) => ({ x: 960 + (wx - cam.x) * cam.zoom, y: 540 + (wy - cam.y) * cam.zoom });

// Shot 5 - "below four and a half kilometres": pan down the hole; a dashed line at 4,500 m
const ShotBelow: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: ly(2.6), zoom: 2.6 },
    { f: len, x: 960, y: ly(4.6), zoom: 2.4 },
  ]);
  const s = toScreen(cam, LX + 30, ly(4.5));
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <LongSection f={f} k={0.35} line={ramp(f, len * 0.4, len * 0.4 + 12)} />
      </Layer>
      <Layer depth={0}>
        <text x={s.x + 120} y={s.y - 18} style={numStyle(56, E.b)} opacity={ramp(f, len * 0.45, len * 0.45 + 12)}>
          4,500 m
        </text>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 6 - "more common, and the hole got wider on average": zoom out; below the line the outline frays and widens
const ShotWider: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: ly(4.8), zoom: 2.0 },
    { f: Math.round(len * 0.7), x: 1000, y: ly(6.3), zoom: 0.92 },
    { f: len + 20, x: 1000, y: ly(6.3), zoom: 0.9 },
  ]);
  const k = lerp(f, 6, len * 0.8, 0.35, 1);
  const a = toScreen(cam, LX, ly(2.5));
  const b = toScreen(cam, LX, ly(9.5));
  const wa = holeHalf(2.5, k, 0) * cam.zoom;
  const wb = 16 * cam.zoom * k;
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <LongSection f={f} k={k} line={1} />
      </Layer>
      <Layer depth={0}>
        <g opacity={ramp(f, len * 0.55, len * 0.7)}>
          {[
            [a, wa, 0.6],
            [b, wb, 1],
          ].map(([p, w, o], i) => {
            const q = p as { x: number; y: number };
            const ww = (w as number) + 14;
            return (
              <g key={i} stroke={i ? E.b : P.chalkSoft} strokeWidth={3} opacity={o as number}>
                <line x1={q.x - ww} y1={q.y} x2={q.x - ww - 60} y2={q.y} />
                <line x1={q.x + ww} y1={q.y} x2={q.x + ww + 60} y2={q.y} />
                <path d={`M${q.x - ww} ${q.y} L${q.x - ww - 14} ${q.y - 9} L${q.x - ww - 14} ${q.y + 9} Z`} fill={i ? E.b : P.chalkSoft} />
                <path d={`M${q.x + ww} ${q.y} L${q.x + ww + 14} ${q.y - 9} L${q.x + ww + 14} ${q.y + 9} Z`} fill={i ? E.b : P.chalkSoft} />
              </g>
            );
          })}
          <text x={b.x + wb + 110} y={b.y + 14} style={labelStyle(44, E.b, 4)}>
            Wider
          </text>
        </g>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Near the bottom: hot amber walls that bow inward like something soft (an illustration of a quoted description)
const PX = 760;
const PlasticWalls: React.FC<{ f: number; bow: number }> = ({ f, bow }) => {
  const half = 190;
  const wall = (side: 1 | -1): [number, number][] =>
    Array.from({ length: 40 }, (_, i) => {
      const y = -300 + i * 45;
      const sag = bow * (60 * Math.exp(-Math.pow((y - 520) / 260, 2)) + 22 * Math.exp(-Math.pow((y - 120) / 160, 2)));
      const breath = Math.sin(f / 26 + i * 0.4) * 5 * bow;
      return [PX + side * (half - sag - breath), y];
    });
  const L = wall(-1);
  const R = wall(1);
  const edges = Array.from({ length: 9 }, (_, i) =>
    Array.from({ length: 30 }, (_, j) => {
      const x = -300 + j * 90;
      const near = Math.max(0, 1 - Math.abs(x - PX) / 600);
      return [x, -300 + i * 220 + near * near * 90 * bow + Math.sin(j * 0.8 + i) * 8] as [number, number];
    }),
  );
  return (
    <g>
      <Hatch id="c6-p" color={mixHex(P.chalk, ROCK, 0.8)} gap={16} angle={-30} width={1.3} />
      {edges.slice(0, 8).map((e, i) => (
        <path key={i} d={stratumPath(e, edges[i + 1])} fill={heat(0.5 + (i % 4) * 0.08)} />
      ))}
      <rect x={-300} y={-300} width={2600} height={1800} fill="url(#c6-p)" />
      {edges.map((e, i) => (
        <path key={`e${i}`} d={ptsToPath(e)} fill="none" stroke={mixHex(E.b, P.chalk, 0.3)} strokeWidth={2} strokeDasharray="14 10" strokeDashoffset={crawl(f, 0.7)} />
      ))}
      <path d={ptsToPath([...L, ...[...R].reverse()]) + " Z"} fill={P.graphite} />
      <path d={ptsToPath(R)} fill="none" stroke={mixHex(P.graphite, E.b, 0.35)} strokeWidth={14} />
      <path d={ptsToPath(L)} fill="none" stroke={P.chalk} strokeWidth={3} />
      <path d={ptsToPath(R)} fill="none" stroke={P.chalk} strokeWidth={3} />
      <rect x={PX - 34} y={-300} width={68} height={1100} fill={STEEL} />
      <rect x={PX - 34} y={-300} width={20} height={1100} fill={STEEL_LIT} />
      {fall(f, 18, 300, 1400, 6, 1.6, 6).map((g, i) => (
        <rect key={i} x={PX - 150 + g.x} y={-300 + g.y} width={g.r * 1.4} height={g.r * 1.4} fill={E.b} opacity={0.35} />
      ))}
    </g>
  );
};

const QuoteCard: React.FC<{ f: number; k: number; text: number }> = ({ f, k, text }) => {
  const y = 330 + (1 - k) * 60 + bob(f, 5, 3, 120);
  const card = lit(P.boneDeep, 0.4);
  return (
    <g opacity={k} transform={`translate(1180 ${y}) rotate(-1.5)`}>
      <rect x={14} y={14} width={600} height={330} fill={shade(P.graphite, 0.4)} />
      <rect x={0} y={0} width={600} height={330} fill={card} />
      <text x={40} y={130} style={{ fontFamily: IF.label, fontSize: 170, fill: E.a }}>
        “
      </text>
      <text x={290} y={186} textAnchor="middle" style={labelStyle(76, P.ink, 4)} opacity={text}>
        Like plastic
      </text>
      <text x={548} y={250} textAnchor="start" style={{ fontFamily: IF.label, fontSize: 170, fill: E.a }} opacity={text}>
        ”
      </text>
      <rect x={40} y={262} width={160} height={4} fill={P.inkSoft} />
      <text x={40} y={306} style={labelStyle(30, P.inkSoft, 3)}>
        Kola scientists
      </text>
    </g>
  );
};

// Shot 7 - "near the bottom, the project's scientists described the rock": the hot walls, a quote card slides in
const ShotNear: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.12 },
    { f: len + 20, x: 960, y: 540, zoom: 1.0 },
  ]);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.34}>
      <Layer depth={1}>
        <PlasticWalls f={f} bow={0.1} />
      </Layer>
      <Layer depth={0}>
        <QuoteCard f={f} k={ramp(f, 20, 36)} text={0} />
        <Tag text="Near the bottom" />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 8 - "behaving more like plastic than rock": the words land in the card and the walls start to sag inward
const ShotPlastic: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 860, y: 600, zoom: 1.3 },
    { f: len + 20, x: 820, y: 640, zoom: 1.42 },
  ]);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.34}>
      <Layer depth={1}>
        <PlasticWalls f={f} bow={lerp(f, 6, len, 0.1, 1)} />
      </Layer>
      <Layer depth={0}>
        <QuoteCard f={f} k={1} text={ramp(f, 2, 12)} />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 9 - "not melted. Just softer, more willing to bend.": a layered slab bends slowly; a crossed-out drop
const ShotBend: React.FC<ShotProps> = ({ f, len }) => {
  const k = lerp(f, 10, len, 0, 1, Easing.inOut(Easing.sin));
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 20, x: 990, y: 540, zoom: 1.1 },
  ]);
  const layer = (i: number): [number, number][] =>
    Array.from({ length: 25 }, (_, j) => {
      const x = 360 + j * 50;
      const u = (x - 960) / 600;
      return [x, 480 + i * 46 + (1 - u * u) * 120 * k];
    });
  const layers = Array.from({ length: 6 }, (_, i) => layer(i));
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.32}>
      <Layer depth={0.4}>
        {specks(f, 50, 2200, 1300, 8, 6).map((s, i) => (
          <circle key={i} cx={s.x - 140} cy={s.y - 110} r={s.r * 0.6} fill={E.b} opacity={0.18} />
        ))}
      </Layer>
      <Layer depth={1}>
        {/* the slab: lit top layer, shaded underside, amber bands between */}
        {layers.slice(0, 5).map((l, i) => (
          <path key={i} d={stratumPath(l, layers[i + 1])} fill={i === 0 ? lit(heat(0.55), 0.18) : i === 4 ? shade(heat(0.55), 0.3) : heat(0.42 + i * 0.07)} />
        ))}
        {layers.map((l, i) => (
          <path key={`l${i}`} d={ptsToPath(l)} fill="none" stroke={mixHex(P.chalk, P.graphite, 0.4)} strokeWidth={2} />
        ))}
        {/* supports at both ends */}
        <path d="M300 700 L420 700 L400 900 L320 900 Z" fill={mixHex(ROCK, P.graphite, 0.3)} />
        <path d="M1500 700 L1620 700 L1600 900 L1520 900 Z" fill={mixHex(ROCK, P.graphite, 0.3)} />
      </Layer>
      <Layer depth={0}>
        <g transform="translate(1480 230)" opacity={ramp(f, 4, 14)}>
          <path d="M0 -70 L40 0 L28 40 L0 54 L-28 40 L-40 0 Z" fill={E.b} />
          <path d="M0 -70 L40 0 L28 40 L0 54 Z" fill={shade(E.b, 0.3)} />
          <line x1={-60} y1={60} x2={60} y2={-70} stroke={P.chalk} strokeWidth={10} />
          <text x={-80} y={20} textAnchor="end" style={labelStyle(48, P.chalk, 4)}>
            Not melted
          </text>
        </g>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// The recap board: the Reference Figure at the cap, and the five problems pinned around it in turn
const GND = 760;
const PPM = 200; // figure 340 px; the 23 cm cap 46 px
const FX = 900;
const CAPX = 1030;
type Item = { key: string; x: number; y: number };
const ITEMS: Item[] = [
  { key: "plate", x: 470, y: 300 },
  { key: "crumble", x: 1420, y: 280 },
  { key: "boil", x: 1560, y: 640 },
  { key: "motor", x: 1180, y: 930 },
  { key: "trip", x: 380, y: 720 },
];
const Icon: React.FC<{ k: string; f: number }> = ({ k, f }) => {
  if (k === "plate") {
    return (
      <g>
        <ellipse cx={0} cy={0} rx={90} ry={36} fill={lit(P.boneDeep, 0.5)} stroke={P.ink} strokeWidth={2.5} />
        <ellipse cx={0} cy={0} rx={56} ry={22} fill="none" stroke={tint(P.ink, P.bone, 0.6)} strokeWidth={2} />
        <text x={0} y={92} textAnchor="middle" style={numStyle(46, P.ink)}>
          23 cm
        </text>
      </g>
    );
  }
  if (k === "crumble") {
    const rock = tint(E.a, P.bone, 0.3);
    return (
      <g>
        <path d="M-90 -60 L20 -60 L10 -10 L30 30 L0 70 L-90 70 Z" fill={rock} />
        <path d="M-10 -60 L20 -60 L10 -10 L30 30 L0 70 L-20 70 Z" fill={shade(rock, 0.25)} />
        {[0, 1, 2].map((i) => {
          const a = ((f + i * 14) % 42) / 42;
          return <path key={i} d={`M${30 + a * 50} ${-30 + i * 30 + a * a * 60} l14 -6 l6 14 l-14 4 Z`} fill={rock} opacity={1 - a} />;
        })}
        <path d="M-60 -60 L-40 -20 L-60 10 L-34 40" fill="none" stroke={P.ink} strokeWidth={3} />
      </g>
    );
  }
  if (k === "boil") {
    return (
      <g>
        <rect x={-18} y={-80} width={36} height={130} fill={lit(P.boneDeep, 0.4)} stroke={P.ink} strokeWidth={2.5} />
        <circle cx={0} cy={66} r={30} fill={E.b} stroke={P.ink} strokeWidth={2.5} />
        <rect x={-10} y={-62 + 8 * Math.sin(f / 10)} width={20} height={120} fill={E.b} />
        <text x={50} y={20} style={numStyle(46, P.ink)}>
          180 °C
        </text>
      </g>
    );
  }
  if (k === "motor") {
    const g = tint(P.inkSoft, P.bone, 0.3);
    return (
      <g>
        <rect x={-90} y={-40} width={180} height={80} fill={g} />
        <rect x={-90} y={-40} width={180} height={20} fill={lit(g, 0.3)} />
        {[-50, -10, 30].map((x) => (
          <path key={x} d={`M${x} -20 L${x + 26} 0 L${x} 20 Z`} fill={shade(g, 0.25)} />
        ))}
        <rect x={90} y={-20} width={30} height={40} fill={shade(g, 0.3)} />
        <path d="M-40 -66 L40 66 M40 -66 L-40 66" stroke={P.ink} strokeWidth={6} opacity={0.75} />
      </g>
    );
  }
  return (
    <g>
      <path d="M-40 60 L-40 -40" stroke={P.ink} strokeWidth={8} />
      <path d="M-58 -30 L-40 -64 L-22 -30 Z" fill={P.ink} />
      <path d="M40 -60 L40 40" stroke={P.ink} strokeWidth={8} />
      <path d="M22 30 L40 64 L58 30 Z" fill={P.ink} />
      <text x={0} y={120} textAnchor="middle" style={numStyle(46, P.ink)}>
        24 km
      </text>
    </g>
  );
};

const Board: React.FC<{ f: number; F: number; c: Cues }> = ({ f, F, c }) => {
  const appear = [c.plate, c.crumbles, c.boil, c.motors, c.trip];
  const snow = fall(F, 50, 2600, 1300, 7, 0.9, 14);
  return (
    <g>
      <Layer depth={0.15}>
        <rect x={-800} y={-800} width={3600} height={1600 + GND - 300} fill={mixHex(P.bone, E.a, 0.16)} />
        <rect x={-800} y={GND - 300} width={3600} height={140} fill={mixHex(P.bone, E.a, 0.08)} />
      </Layer>
      <Layer depth={1}>
        <rect x={-800} y={GND - 160} width={3600} height={1400} fill={mixHex(tint(E.b, P.bone, 0.55), E.a, 0.2)} />
        <rect x={-800} y={GND + 60} width={3600} height={1400} fill={mixHex(tint(E.b, P.bone, 0.5), E.a, 0.22)} />
        {/* cap */}
        <ellipse cx={CAPX + 14} cy={GND} rx={36} ry={9} fill={shade(tint(E.b, P.bone, 0.55), 0.25)} />
        <path d={`M${CAPX - 23} ${GND - 12} L${CAPX - 23} ${GND - 2} A23 7 0 0 0 ${CAPX + 23} ${GND - 2} L${CAPX + 23} ${GND - 12} Z`} fill={shade(tint(E.a, P.bone, 0.2), 0.3)} />
        <ellipse cx={CAPX} cy={GND - 12} rx={23} ry={7} fill={tint(E.a, P.bone, 0.2)} />
        <ReferenceFigure x={FX} y={GND} pxPerM={PPM} breath={F} look={Math.sin(F / 60) * 0.6} sway={Math.sin(F / 50) * 0.6} />
        {/* the five pinned problems: a card each, a leader line to the figure */}
        {ITEMS.map((it, i) => {
          const k = ramp(F, appear[i], appear[i] + 10);
          if (k <= 0) return null;
          const s = 0.7 + 0.3 * k;
          return (
            <g key={it.key} opacity={k}>
              <line x1={it.x} y1={it.y} x2={FX + (it.x - FX) * 0.35} y2={GND - 170 + (it.y - GND + 170) * 0.35} stroke={P.ink} strokeWidth={2} strokeDasharray="8 8" strokeDashoffset={crawl(F, 0.6)} />
              <g transform={`translate(${it.x} ${it.y + bob(F, i + 2, 4, 100)}) scale(${s})`}>
                <rect x={-150} y={-110} width={300} height={240} fill={shade(P.boneDeep, 0.1)} transform="translate(10 10)" />
                <rect x={-150} y={-110} width={300} height={240} fill={lit(P.boneDeep, 0.2)} stroke={P.ink} strokeWidth={2} />
                <Icon k={it.key} f={F} />
              </g>
            </g>
          );
        })}
        {snow.map((s, i) => (
          <circle key={i} cx={s.x - 340} cy={s.y - 200} r={s.r} fill="#F8F4EA" opacity={0.85} />
        ))}
      </Layer>
    </g>
  );
};

const boardShot = (keys: (len: number) => { f: number; x: number; y: number; zoom: number }[]): React.FC<ShotProps> => {
  const B: React.FC<ShotProps> = ({ f, F, c, len }) => (
    <Stage theme={BONE} cam={cameraAt(f, keys(len))}>
      <Board f={f} F={F} c={c} />
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
  return B;
};
// Shots 10-15 - "so picture the job" and the five problems, each framed in turn, then the whole board
const ShotJob = boardShot((len) => [
  { f: 0, x: 960, y: GND - 140, zoom: 1.7 },
  { f: len + 20, x: 940, y: GND - 160, zoom: 1.45 },
]);
const ShotPlate = boardShot((len) => [
  { f: 0, x: 700, y: 420, zoom: 1.35 },
  { f: len + 20, x: 680, y: 410, zoom: 1.42 },
]);
const ShotCrumble = boardShot((len) => [
  { f: 0, x: 1230, y: 400, zoom: 1.35 },
  { f: len + 20, x: 1260, y: 390, zoom: 1.42 },
]);
const ShotBoilItem = boardShot((len) => [
  { f: 0, x: 1320, y: 620, zoom: 1.3 },
  { f: len + 20, x: 1340, y: 630, zoom: 1.38 },
]);
const ShotMotorItem = boardShot((len) => [
  { f: 0, x: 1100, y: 780, zoom: 1.3 },
  { f: len + 20, x: 1080, y: 790, zoom: 1.36 },
]);
const ShotWhole = boardShot((len) => [
  { f: 0, x: 700, y: 700, zoom: 1.3 },
  { f: Math.round(len * 0.45), x: 980, y: 600, zoom: 0.92 },
  { f: len + 20, x: 980, y: 600, zoom: 0.9 },
]);

// ---------------------------------------------------------------------------------------------
type Shot = { from: number; C: React.FC<ShotProps> };
const shots06 = (c: Cues): Shot[] => [
  { from: 0, C: ShotStays },
  { from: c.cut, C: ShotCut },
  { from: c.oddly, C: ShotWhile },
  { from: c.once, C: ShotHeld },
  { from: c.below, C: ShotBelow },
  { from: c.wider, C: ShotWider },
  { from: c.near, C: ShotNear },
  { from: c.plastic, C: ShotPlastic },
  { from: c.notMelted, C: ShotBend },
  { from: c.job, C: ShotJob },
  { from: c.plate, C: ShotPlate },
  { from: c.crumbles, C: ShotCrumble },
  { from: c.boil, C: ShotBoilItem },
  { from: c.motors, C: ShotMotorItem },
  { from: c.trip, C: ShotWhole },
];

export const SceneL06: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const F = useCurrentFrame();
  const c = cues06(t);
  const shots = shots06(c);
  let k = 0;
  for (let i = 0; i < shots.length; i++) if (F >= shots[i].from) k = i;
  const S = shots[k].C;
  const len = (k + 1 < shots.length ? shots[k + 1].from : c.end) - shots[k].from;
  return <S f={F - shots[k].from} F={F} c={c} len={len} />;
};

export const soundL06 = (t: SceneTiming): Cue[] => {
  const c = cues06(t);
  const breaks = cavities(c).map((v): Cue => ({ at: v.at, file: "mixkit-403-rock-debris-falling.mp3", vol: 0.22, dur: 40, fadeOut: 12 }));
  return [
    { at: 0, file: "mixkit-855-drill-electric.mp3", vol: 0.1, dur: c.once + 6, fadeIn: 12, fadeOut: 8 },
    { at: 0, file: "mixkit-2297-rumble-bass-hum.mp3", vol: 0.24, dur: c.below, fadeIn: 20, fadeOut: 20 },
    { at: c.didnt + 6, file: "mixkit-1686-boom-underground-echo.mp3", vol: 0.32, dur: 90 },
    ...breaks,
    { at: c.cut - 4, file: "mixkit-1489-whoosh-air.mp3", vol: 0.22, dur: 50 },
    { at: c.oddly - 4, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.24, dur: 50 },
    { at: c.oddly + 4, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.28, dur: 20 },
    { at: c.once, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.26, dur: 60 },
    { at: c.once + 20, file: "mixkit-3108-chime-crystal.mp3", vol: 0.14, dur: 60 },
    { at: c.below - 4, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.3, dur: 60 },
    { at: c.below + 40, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.3, dur: 20 },
    { at: c.wider, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.24, dur: 50 },
    { at: c.near - 4, file: "mixkit-1489-whoosh-air.mp3", vol: 0.24, dur: 50 },
    { at: c.near, file: "mixkit-2297-rumble-bass-hum.mp3", vol: 0.32, dur: c.job - c.near, fadeIn: 10, fadeOut: 20 },
    { at: c.near + 22, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.24, dur: 20 },
    { at: c.plastic + 2, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.28, dur: 20 },
    { at: c.notMelted, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.24, dur: 60 },
    { at: c.notMelted + 6, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.28, dur: 20 },
    { at: c.job - 4, file: "mixkit-1489-whoosh-air.mp3", vol: 0.24, dur: 50 },
    { at: c.job, file: "mixkit-2658-wind-ambience.mp3", vol: 0.14, dur: c.end - c.job, fadeIn: 20, fadeOut: 20 },
    { at: c.plate, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.26, dur: 20 },
    { at: c.crumbles, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.26, dur: 20 },
    { at: c.boil, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.26, dur: 20 },
    { at: c.motors, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.26, dur: 20 },
    { at: c.trip, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.28, dur: 20 },
    { at: c.trip + 10, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.24, dur: 60 },
  ];
};

