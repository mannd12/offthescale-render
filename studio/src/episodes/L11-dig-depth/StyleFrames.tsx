// L11 "How deep can we dig?" - four style frames (look test for the illustrated format, not the episode).
// Every number on these frames is listed with its source in episodes/L11-dig-depth/sources-stub.md.
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  BONE,
  CornerTicks,
  Contours,
  GRAPHITE,
  Gauge,
  Hatch,
  IF,
  Layer,
  P,
  PAIRS,
  ReferenceFigure,
  ScaleBar,
  Stage,
  YouAreHere,
  bob,
  cameraAt,
  crawl,
  drift,
  labelStyle,
  loadIllustratedFonts,
  mixHex,
  numStyle,
  ptsToPath,
  specks,
  strataLine,
  stratumPath,
  tint,
} from "../../lib/illustrated";

loadIllustratedFonts();

const E = PAIRS.earth;
// the hole: Kola SG-3, 12,262 m deep, about 23 cm across (sources-stub.md)
const KOLA_M = 12262;
const HOLE_M = 0.23;
const EARTH_KM = 6371;
const CORE_KM = 3485;
const MINE_M = 3740; // Mponeng, Harmony Gold: mining depth 3,160-3,740 m
const METRO_M = 105.5; // Arsenalna, Kyiv

// ---------------------------------------------------------------------------------------------
// 1 - the hook: a person, the ground, and a hole that runs off the gauge
export const L11Style1: React.FC = () => {
  const f = useCurrentFrame();
  const T = BONE;
  const G = 470; // ground line
  const ppm = 120; // px per metre in this scene
  const holeX = 980;
  const holeW = HOLE_M * ppm;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1 },
    { f: 240, x: 960, y: 590, zoom: 1.05 },
  ]);
  const d = (m: number) => G + m * ppm;
  const s1 = strataLine(-200, 2120, d(0.7), 10, 2);
  const s2 = strataLine(-200, 2120, d(2.3), 16, 5);
  const bottom: [number, number][] = [[-200, 1300], [2120, 1300]];
  const top: [number, number][] = [[-200, G], [2120, G]];
  const soil = tint(E.b, P.bone, 0.55);
  const clay = tint(E.b, E.a, 0.55);
  const rock = tint(E.a, P.bone, 0.35);
  const dust = specks(f, 26, 1920, G - 120, 3, 6);
  const cloud = (x: number, y: number, w: number, seed: number) => {
    const o = drift(f, seed, 14, 300);
    return (
      <path
        d={`M${x + o.x} ${y} L${x + o.x + w * 0.18} ${y - 26} L${x + o.x + w * 0.55} ${y - 34} L${x + o.x + w * 0.82} ${y - 18} L${x + o.x + w} ${y} Z`}
        fill={P.boneDeep}
        stroke={tint(T.line, P.bone, 0.75)}
        strokeWidth={1.5}
      />
    );
  };
  const sway = Math.sin(f / 40) * 0.8;
  return (
    <Stage theme={T} cam={cam}>
      <Hatch id="s1-rock" color={tint(E.a, P.bone, 0.05)} gap={18} angle={60} width={1.4} />
      <Hatch id="s1-clay" color={tint(E.a, P.bone, 0.2)} gap={16} dots width={1.6} />
      <Layer depth={0.3}>
        {cloud(180, 250, 300, 1)}
        {cloud(1180, 200, 380, 2)}
        {cloud(1560, 320, 220, 3)}
      </Layer>
      <Layer depth={0.55}>
        {/* far ridge: straight-edged, one flat tint, contour ticks */}
        <path d={ptsToPath([[-200, G], [-60, 400], [180, 360], [420, 410], [640, 330], [900, 395], [1210, 345], [1460, 400], [1700, 340], [2120, 405], [2120, G]]) + " Z"} fill={tint(E.a, P.bone, 0.72)} />
        <path d={ptsToPath([[180, 360], [230, 380]])} stroke={tint(E.a, P.bone, 0.45)} strokeWidth={2} />
        <path d={ptsToPath([[640, 330], [700, 352]])} stroke={tint(E.a, P.bone, 0.45)} strokeWidth={2} />
        <path d={ptsToPath([[1210, 345], [1262, 366]])} stroke={tint(E.a, P.bone, 0.45)} strokeWidth={2} />
        {dust.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.7} fill={tint(E.a, P.bone, 0.5)} />
        ))}
      </Layer>
      <Layer depth={0.8}>
        {/* near ridge with spruce: straight triangles, one flat tint */}
        <path d={ptsToPath([[-200, G], [-200, 440], [260, 420], [520, 438], [1300, 430], [1560, 414], [2120, 436], [2120, G]]) + " Z"} fill={tint(E.a, P.bone, 0.55)} />
        {[40, 92, 130, 330, 372, 1240, 1290, 1335, 1400, 1520, 1575].map((x, i) => {
          const h = 70 + ((i * 37) % 50);
          const sw = Math.sin(f / 50 + i) * 1.2;
          return (
            <g key={x} transform={`rotate(${sw} ${x} 440)`}>
              <path d={`M${x} ${440 - h} L${x + h * 0.22} ${440 - h * 0.45} L${x + h * 0.14} ${440 - h * 0.45} L${x + h * 0.3} 440 L${x - h * 0.3} 440 L${x - h * 0.14} ${440 - h * 0.45} L${x - h * 0.22} ${440 - h * 0.45} Z`} fill={tint(E.a, P.ink, 0.25)} />
            </g>
          );
        })}
      </Layer>
      <Layer depth={1}>
        {/* cross-section of the ground */}
        <path d={stratumPath(top, s1)} fill={soil} />
        <path d={stratumPath(s1, s2)} fill={clay} />
        <path d={stratumPath(s1, s2)} fill="url(#s1-clay)" />
        <path d={stratumPath(s2, bottom)} fill={rock} />
        <path d={stratumPath(s2, bottom)} fill="url(#s1-rock)" />
        <path d={ptsToPath(s1)} fill="none" stroke={T.line} strokeWidth={1.5} opacity={0.5} />
        <path d={ptsToPath(s2)} fill="none" stroke={T.line} strokeWidth={1.5} opacity={0.5} />
        <Contours x0={-200} x1={2120} y={d(3.2)} n={4} gap={34} amp={9} seed={9} color={tint(E.a, P.bone, 0.1)} width={1.2} opacity={0.6} />
        {/* the hole: true width at this scale */}
        <rect x={holeX - holeW / 2} y={G} width={holeW} height={900} fill={P.graphite} />
        {/* wellhead flange */}
        <rect x={holeX - holeW / 2 - 18} y={G - 12} width={holeW + 36} height={12} fill={E.a} />
        <line x1={-200} y1={G} x2={2120} y2={G} stroke={T.line} strokeWidth={3} />
        {/* survey ticks along the surface, one per metre */}
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i} x1={i * ppm - 60} y1={G} x2={i * ppm - 60} y2={G + 10} stroke={T.line} strokeWidth={2} />
        ))}
        <ReferenceFigure x={holeX - 120} y={G} pxPerM={ppm} pose="point" sway={sway} />
        {/* width callout */}
        <line x1={holeX + holeW / 2 + 6} y1={d(1.5)} x2={holeX + 120} y2={d(1.5)} stroke={T.line} strokeWidth={2} />
        <text x={holeX + 132} y={d(1.5) + 12} style={labelStyle(34, T.text)}>
          23 cm wide
        </text>
      </Layer>
      <Layer depth={0}>
        <text x={96} y={170} style={labelStyle(84, T.text, 3)}>
          How deep can we dig?
        </text>
        <Gauge x={1660} y={G} height={ppm * 3} value={KOLA_M} max={3} unit="m" theme={T} title="DEPTH" format={(v) => `${v} m`} readoutText="12,262 m" plate={96} unitCap={false} />
        <ScaleBar x={96} y={G - 40} px={ppm} label="1 M" color={T.line} font={IF.label} />
        <CornerTicks color={T.line} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// 2 - human scale, stacked: three panels, each a power-of-ten zoom-out of the one before
const SURF = 320;
const BOT = 1000;
const PH = BOT - SURF;

type PanelProps = { x0: number; w: number; id: string; children: React.ReactNode; strata: number[]; sky?: React.ReactNode };
const Panel: React.FC<PanelProps> = ({ x0, w, id, children, strata, sky }) => {
  const lines = strata.map((y, i) => strataLine(x0 - 20, x0 + w + 20, y, 7, i * 3 + x0 * 0.01, 40));
  const top: [number, number][] = [[x0 - 20, SURF], [x0 + w + 20, SURF]];
  const bot: [number, number][] = [[x0 - 20, BOT + 20], [x0 + w + 20, BOT + 20]];
  const edges = [top, ...lines, bot];
  const fills = [tint(E.b, P.bone, 0.55), tint(E.b, E.a, 0.55), tint(E.a, P.bone, 0.38), tint(E.a, P.bone, 0.22)];
  return (
    <g>
      <defs>
        <clipPath id={`clip-${id}`}>
          <rect x={x0} y={SURF - 110} width={w} height={PH + 110} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${id})`}>
        {sky}
        {edges.slice(0, -1).map((e, i) => (
          <g key={i}>
            <path d={stratumPath(e, edges[i + 1])} fill={fills[Math.min(i, fills.length - 1)]} />
            {i >= 2 ? <path d={stratumPath(e, edges[i + 1])} fill="url(#s2-rock)" /> : null}
            {i > 0 ? <path d={ptsToPath(e)} fill="none" stroke={P.ink} strokeWidth={1.2} opacity={0.4} /> : null}
          </g>
        ))}
        {children}
      </g>
      <line x1={x0} y1={SURF} x2={x0 + w} y2={SURF} stroke={P.ink} strokeWidth={3} />
      <rect x={x0} y={SURF - 110} width={w} height={PH + 110} fill="none" stroke={P.ink} strokeWidth={2} />
    </g>
  );
};

export const L11Style2: React.FC = () => {
  const f = useCurrentFrame();
  const T = BONE;
  const W = 400;
  const A = 200;
  const B = 760;
  const C = 1320;
  const ppmA = PH / 5; // 0-5 m
  const ppmB = PH / 120; // 0-120 m
  const ppkC = PH / 12.5; // 0-12.5 km
  const zoomLine = tint(P.ink, P.bone, 0.45);
  const lab = (x: number, y: number, t: string, size = 32, anchor: "start" | "end" = "start") => (
    <text x={x} y={y} textAnchor={anchor} style={labelStyle(size, T.text)}>
      {t}
    </text>
  );
  const val = (x: number, y: number, t: string, anchor: "start" | "end" = "start") => (
    <text x={x} y={y} textAnchor={anchor} style={numStyle(40, T.text)}>
      {t}
    </text>
  );
  // ambient: a lift car in the metro shaft and a cage in the mine shaft keep moving
  const lift = (Math.sin(f / 45) + 1) / 2;
  const cage = (Math.sin(f / 70 + 1) + 1) / 2;
  const roomTop = SURF + 0.25 * ppmA;
  const roomBot = SURF + 2.7 * ppmA;
  const stY = SURF + METRO_M * ppmB;
  const mineY = SURF + (MINE_M / 1000) * ppkC;
  const kolaY = SURF + (KOLA_M / 1000) * ppkC;
  return (
    <Stage theme={T}>
      <Hatch id="s2-rock" color={tint(E.a, P.bone, 0.1)} gap={16} angle={60} width={1.3} />
      <Layer depth={0}>
        <text x={96} y={140} style={labelStyle(64, T.text, 3)}>
          How deep is deep?
        </text>
        {/* zoom connectors: each panel is a tiny slice at the top of the next */}
        <g stroke={zoomLine} strokeWidth={2} fill="none">
          <path d={`M${A + W} ${SURF - 110} L${B} ${SURF - 2}`} />
          <path d={`M${A + W} ${BOT} L${B} ${SURF + 5 * ppmB}`} />
          <path d={`M${B + W} ${SURF - 110} L${C} ${SURF - 1}`} />
          <path d={`M${B + W} ${BOT} L${C} ${SURF + 0.12 * ppkC}`} />
        </g>

        {/* A: a basement, 0-5 m */}
        <Panel
          x0={A}
          w={W}
          id="a"
          strata={[SURF + 0.9 * ppmA, SURF + 3.1 * ppmA]}
          sky={
            <g>
              {/* house: cutaway walls rising out of frame */}
              <rect x={A + 150} y={SURF - 110} width={18} height={110} fill={E.a} />
              <rect x={A + 380} y={SURF - 110} width={18} height={110} fill={E.a} />
              <rect x={A + 168} y={SURF - 16} width={212} height={16} fill={tint(E.a, P.bone, 0.3)} />
            </g>
          }
        >
          {/* basement room */}
          <rect x={A + 150} y={roomTop} width={248} height={roomBot - roomTop} fill={P.boneDeep} stroke={P.ink} strokeWidth={2} />
          <rect x={A + 150} y={roomBot} width={248} height={14} fill={tint(E.a, P.bone, 0.3)} />
          {/* stairs */}
          <path
            d={ptsToPath(Array.from({ length: 9 }, (_, i) => [[A + 398 - i * 18, roomBot - i * 31], [A + 398 - (i + 1) * 18, roomBot - i * 31]] as [number, number][]).flat())}
            fill="none"
            stroke={P.ink}
            strokeWidth={2}
          />
          <ReferenceFigure x={A + 230} y={roomBot} pxPerM={ppmA} sway={Math.sin(f / 40) * 0.6} />
        </Panel>
        {lab(A + 150, roomBot + 74, "Basement", 38, "start")}

        {/* B: a deep metro station, 0-120 m */}
        <Panel
          x0={B}
          w={W}
          id="b"
          strata={[SURF + 18 * ppmB, SURF + 55 * ppmB]}
          sky={
            <g fill={tint(E.a, P.bone, 0.35)}>
              <rect x={B + 30} y={SURF - 70} width={60} height={70} />
              <rect x={B + 100} y={SURF - 96} width={46} height={96} />
              <rect x={B + 250} y={SURF - 58} width={80} height={58} />
              <rect x={B + 340} y={SURF - 84} width={44} height={84} />
            </g>
          }
        >
          {/* bracket: everything in panel A */}
          <rect x={B} y={SURF} width={W} height={5 * ppmB} fill="none" stroke={P.ink} strokeWidth={2.5} />
          {/* inclined escalator tunnels, two flights */}
          <path d={`M${B + 385} ${SURF} L${B + 355} ${SURF + 55.8 * ppmB} L${B + 330} ${stY - 4}`} fill="none" stroke={P.ink} strokeWidth={9} strokeLinejoin="round" />
          <path d={`M${B + 385} ${SURF} L${B + 355} ${SURF + 55.8 * ppmB} L${B + 330} ${stY - 4}`} fill="none" stroke={P.boneDeep} strokeWidth={4} strokeLinejoin="round" />
          {/* station hall: straight-edged vault */}
          <path d={`M${B + 170} ${stY + 22} L${B + 170} ${stY - 6} L${B + 192} ${stY - 24} L${B + 328} ${stY - 24} L${B + 350} ${stY - 6} L${B + 350} ${stY + 22} Z`} fill={P.boneDeep} stroke={P.ink} strokeWidth={2} />
          <rect x={B + 182 + lift * 100} y={stY + 2} width={56} height={16} fill={E.a} />
        </Panel>
        {lab(B + 160, stY - 112, "Metro station", 34, "start")}
        {val(B + 160, stY - 72, "105 m")}

        {/* C: the deepest mine and the Kola borehole, 0-12.5 km */}
        <Panel x0={C} w={W} id="c" strata={[SURF + 0.6 * ppkC, SURF + 3 * ppkC, SURF + 8 * ppkC]}>
          <rect x={C} y={SURF} width={W} height={Math.max(3, 0.12 * ppkC)} fill={P.ink} />
          {/* mine: shaft, galleries, moving cage */}
          <line x1={C + 195} y1={SURF} x2={C + 195} y2={mineY} stroke={P.ink} strokeWidth={4} />
          {[0.72, 0.82, 0.92, 1].map((k) => (
            <line key={k} x1={C + 160} y1={SURF + (MINE_M / 1000) * ppkC * k} x2={C + 240} y2={SURF + (MINE_M / 1000) * ppkC * k} stroke={P.ink} strokeWidth={3} />
          ))}
          <rect x={C + 189} y={SURF + 10 + cage * ((MINE_M / 1000) * ppkC - 30)} width={12} height={14} fill={E.b} />
          {/* borehole */}
          <line x1={C + 350} y1={SURF} x2={C + 350} y2={kolaY} stroke={P.ink} strokeWidth={3} />
        </Panel>
        {lab(C + 150, mineY + 52, "Deepest mine", 34)}
        {val(C + 150, mineY + 92, "3.7 km")}
        <YouAreHere x={C + 350} y={kolaY} size={30} font={IF.label} />
        {lab(C + 325, kolaY - 86, "Kola borehole", 34, "end")}
        {val(C + 325, kolaY - 46, "12.3 km", "end")}

        {/* one ruler per panel: same object, three zoom levels */}
        <Gauge x={A + 14} y={SURF} height={PH} value={0} max={5} unit="m" theme={T} side="right" readout={false} marker={false} unitCap={false} plate={100} format={(v) => `${v} m`} />
        <Gauge x={B + 14} y={SURF} height={PH} value={0} max={120} unit="m" theme={T} side="right" readout={false} marker={false} unitCap={false} plate={112} format={(v) => `${v} m`} />
        <Gauge x={C + 14} y={SURF} height={PH} value={12.262} max={12.5} unit="km" theme={T} side="right" readout={false} unitCap={false} plate={108} format={(v) => `${v} km`} />
        <CornerTicks color={T.line} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// 3 - the villain: heat at the bottom, rock that flows into the hole
export const L11Style3: React.FC = () => {
  const f = useCurrentFrame();
  const T = GRAPHITE;
  const cx = 820;
  const half = 112; // 23 cm hole → ~975 px per metre
  const bottomY = 830;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.02 },
    { f: 240, x: 960, y: 560, zoom: 1.08 },
  ]);
  // walls bulge inward lower down (the rock creeps into the hole)
  const wall = (side: 1 | -1): [number, number][] =>
    Array.from({ length: 44 }, (_, i) => {
      const y = -40 + i * 20;
      const k = Math.max(0, (y - 380) / 450);
      const lobe = 42 * Math.exp(-Math.pow((y - 590) / 95, 2)) * (side > 0 ? 1 : 0.85);
      const bulge = lobe + 10 * k + Math.sin(f / 50 + i) * 1.5 * k;
      return [cx + side * (half - bulge), Math.min(y, bottomY)] as [number, number];
    });
  const L = wall(-1);
  const R = wall(1);
  const rock = mixHex(E.a, P.graphite, 0.5);
  const heat = (k: number) => mixHex(rock, E.b, k);
  // stepped heat bands (flat tints, not a gradient), dragged down toward the hole
  const bandEdge = (y: number, seed: number): [number, number][] =>
    Array.from({ length: 33 }, (_, i) => {
      const x = -100 + i * 66;
      const near = Math.max(0, 1 - Math.abs(x - cx) / 520);
      return [x, y + near * near * 70 + Math.sin(i * 0.8 + seed) * 8] as [number, number];
    });
  const edges = [bandEdge(470, 1), bandEdge(590, 2), bandEdge(700, 3), bandEdge(810, 4), bandEdge(920, 5)];
  const grit = specks(f, 22, half * 1.6, 700, 7, 7);
  const pipeL = cx - 40;
  return (
    <Stage theme={T} cam={cam} vignette={0.3}>
      <Hatch id="s3-press" color={mixHex(P.chalk, rock, 0.78)} gap={14} angle={-35} width={1.3} cross />
      <Hatch id="s3-rock" color={mixHex(P.chalk, rock, 0.82)} gap={20} angle={25} width={1.3} />
      <Layer depth={1}>
        {/* rock mass */}
        <rect x={-200} y={-200} width={2320} height={1480} fill={rock} />
        <rect x={-200} y={-200} width={2320} height={1480} fill="url(#s3-rock)" />
        {edges.map((e, i) => (
          <path key={i} d={stratumPath(e, i < edges.length - 1 ? edges[i + 1] : [[-200, 1300], [2120, 1300]])} fill={heat(0.14 + i * 0.13)} />
        ))}
        <path d={stratumPath(edges[2], [[-200, 1300], [2120, 1300]])} fill="url(#s3-press)" />
        {/* isotherms crawl slowly */}
        {edges.map((e, i) => (
          <path key={`c${i}`} d={ptsToPath(e)} fill="none" stroke={mixHex(E.b, P.chalk, 0.25)} strokeWidth={2} strokeDasharray="14 10" strokeDashoffset={crawl(f, 0.6 + i * 0.1)} opacity={0.85} />
        ))}
        {/* folded foliation near the hole: rock that flowed */}
        {[-1, 1].map((s) =>
          [0, 1, 2, 3].map((j) => {
            const x0 = cx + s * (half + 40 + j * 60);
            const pts: [number, number][] = Array.from({ length: 24 }, (_, i) => {
              const y = -60 + i * 50;
              const k = Math.max(0, (y - 380) / 420);
              const pull = 40 * Math.exp(-Math.pow((y - 590) / 110, 2)) * (1 - j * 0.2);
              return [x0 - s * (k * k * (50 - j * 10) + pull), y];
            });
            return <path key={`${s}${j}`} d={ptsToPath(pts)} fill="none" stroke={mixHex(P.chalk, rock, 0.45)} strokeWidth={2} />;
          }),
        )}
        {/* the hole */}
        <path d={ptsToPath([...L, ...[...R].reverse()]) + " Z"} fill={P.graphite} />
        <path d={ptsToPath(L)} fill="none" stroke={P.chalk} strokeWidth={2.5} />
        <path d={ptsToPath(R)} fill="none" stroke={P.chalk} strokeWidth={2.5} />
        {grit.map((g, i) => (
          <circle key={i} cx={cx - half * 0.8 + g.x} cy={120 + g.y} r={g.r * 0.6} fill={mixHex(P.chalk, P.graphite, 0.55)} />
        ))}
        {/* drill string + bit */}
        <g transform={`translate(0 ${bob(f, 4, 3, 26)})`}>
          <rect x={pipeL} y={-200} width={80} height={890} fill={mixHex(P.chalk, P.graphite, 0.45)} />
          {[90, 330, 570].map((y) => (
            <rect key={y} x={pipeL - 8} y={y} width={96} height={26} fill={mixHex(P.chalk, P.graphite, 0.3)} />
          ))}
          <path d={`M${cx - 44} 690 L${cx + 44} 690 L${cx + 62} 752 L${cx - 62} 752 Z`} fill={mixHex(P.chalk, P.graphite, 0.3)} stroke={P.chalk} strokeWidth={2} />
          {[-38, 0, 38].map((dx) => (
            <path key={dx} d={`M${cx + dx - 20} 752 L${cx + dx + 20} 752 L${cx + dx} 812 Z`} fill={mixHex(P.chalk, P.graphite, 0.2)} stroke={P.chalk} strokeWidth={2} />
          ))}
        </g>
      </Layer>
      <Layer depth={0}>
        <text x={96} y={140} style={labelStyle(28, T.dim, 4)}>
          Depth
        </text>
        <text x={96} y={214} style={numStyle(72, T.text)}>
          12,262 m
        </text>
        {/* callout to the creeping wall */}
        <line x1={cx + half - 40} y1={592} x2={1130} y2={575} stroke={P.chalk} strokeWidth={2} />
        <circle cx={cx + half - 40} cy={592} r={7} fill={P.chalk} />
        <text x={1142} y={592} style={labelStyle(52, T.text, 3)}>
          Rock like plastic
        </text>
        <Gauge x={1660} y={210} height={660} value={180} max={200} unit="°C" theme={T} direction="up" title="HEAT" format={(v) => `${v}°`} readoutText="180 °C" />
        <ScaleBar x={96} y={1000} px={0.1 * 975} label="10 CM" color={T.line} font={IF.label} />
        <CornerTicks color={T.line} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// 4 - the zoom-out: the deepest hole against the whole planet
export const L11Style4: React.FC = () => {
  const f = useCurrentFrame();
  const T = GRAPHITE;
  const ox = 700;
  const oy = 585;
  const R = 450;
  const pxkm = R / EARTH_KM;
  const rc = CORE_KM * pxkm;
  const mantle = mixHex(E.a, P.graphite, 0.3);
  const core = mixHex(E.b, P.graphite, 0.2);
  const spin = f * 0.03; // the tick ring turns very slowly
  const ins = { x: 1310, y: 250, r: 170 };
  const insPx = 12; // px per km in the inset
  const surfY = ins.y - 70;
  const pin = { x: ox, y: oy - R };
  return (
    <Stage theme={T} vignette={0.3}>
      <Hatch id="s4-core" color={mixHex(E.b, P.graphite, 0.45)} gap={16} dots width={2} />
      <Hatch id="s4-crust" color={mixHex(P.chalk, E.a, 0.55)} gap={14} angle={60} width={1.3} />
      <defs>
        <clipPath id="s4-ins">
          <circle cx={ins.x} cy={ins.y} r={ins.r} />
        </clipPath>
      </defs>
      <Layer depth={0.4}>
        {specks(f, 40, 1920, 1080, 11, 4).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.5} fill={P.chalkSoft} opacity={0.35} />
        ))}
      </Layer>
      <Layer depth={1}>
        {/* bearing ring: survey ticks every 5 degrees */}
        <g transform={`rotate(${spin} ${ox} ${oy})`} stroke={P.chalkSoft} strokeWidth={2}>
          {Array.from({ length: 72 }, (_, i) => {
            const a = (i / 72) * Math.PI * 2;
            const r1 = R + 22;
            const r2 = R + (i % 6 === 0 ? 44 : 32);
            return <line key={i} x1={ox + Math.cos(a) * r1} y1={oy + Math.sin(a) * r1} x2={ox + Math.cos(a) * r2} y2={oy + Math.sin(a) * r2} />;
          })}
        </g>
        <circle cx={ox} cy={oy} r={R} fill={mantle} />
        {[0.62, 0.72, 0.82, 0.92].map((k, i) => (
          <circle key={k} cx={ox} cy={oy} r={R * k} fill="none" stroke={P.chalk} strokeWidth={1.3} opacity={0.22} strokeDasharray="10 8" strokeDashoffset={crawl(f, 0.3 + i * 0.1)} />
        ))}
        <circle cx={ox} cy={oy} r={rc} fill={core} />
        <circle cx={ox} cy={oy} r={rc} fill="url(#s4-core)" />
        <circle cx={ox} cy={oy} r={rc} fill="none" stroke={P.chalk} strokeWidth={1.5} opacity={0.6} />
        <circle cx={ox} cy={oy} r={R} fill="none" stroke={P.chalk} strokeWidth={3} />
        <text x={ox} y={oy + 14} textAnchor="middle" style={labelStyle(40, mixHex(P.graphite, E.b, 0.25), 4)}>
          Core
        </text>
        <text x={ox} y={oy - rc - 40} textAnchor="middle" style={labelStyle(34, P.chalk, 4)} opacity={0.7}>
          Mantle
        </text>
        {/* zoom box + leaders to the inset */}
        <rect x={pin.x - 14} y={pin.y - 10} width={28} height={28} fill="none" stroke={P.chalk} strokeWidth={2} />
        <line x1={pin.x + 14} y1={pin.y - 10} x2={ins.x - ins.r * 0.5} y2={ins.y - ins.r * 0.866} stroke={P.chalkSoft} strokeWidth={1.5} />
        <line x1={pin.x + 14} y1={pin.y + 18} x2={ins.x - ins.r} y2={ins.y} stroke={P.chalkSoft} strokeWidth={1.5} />
        <YouAreHere x={pin.x} y={pin.y - 14} size={34} label="You are here" font={IF.label} side="left" />
      </Layer>
      <Layer depth={0}>
        {/* inset: the top 30 km at 12 px/km */}
        <circle cx={ins.x} cy={ins.y} r={ins.r} fill={P.graphiteLift} />
        <g clipPath="url(#s4-ins)">
          <rect x={ins.x - ins.r} y={surfY} width={ins.r * 2} height={ins.r * 2} fill={mixHex(E.a, P.graphite, 0.45)} />
          <rect x={ins.x - ins.r} y={surfY} width={ins.r * 2} height={ins.r * 2} fill="url(#s4-crust)" />
          <line x1={ins.x - ins.r} y1={surfY} x2={ins.x + ins.r} y2={surfY} stroke={P.chalk} strokeWidth={3} />
          <line x1={ins.x} y1={surfY} x2={ins.x} y2={surfY + (KOLA_M / 1000) * insPx} stroke={P.vermilion} strokeWidth={4} />
        </g>
        <circle cx={ins.x} cy={ins.y} r={ins.r} fill="none" stroke={P.chalk} strokeWidth={2.5} />
        <text x={ins.x + 16} y={surfY + (KOLA_M / 1000) * insPx + 10} style={labelStyle(34, P.chalk, 2)}>
          12 km
        </text>
        {/* the takeaway */}
        <text x={1150} y={790} style={numStyle(132, P.chalk)}>
          0.2 %
        </text>
        <text x={1156} y={846} style={labelStyle(36, P.chalkSoft, 3)}>
          of the way to the centre
        </text>
        <Gauge
          x={1700}
          y={190}
          height={700}
          value={KOLA_M / 1000}
          max={EARTH_KM}
          unit="km"
          theme={T}
          title="DEPTH"
          format={(v) => v.toLocaleString("en-US")}
          readoutText="12 km"
          marks={[{ v: EARTH_KM, label: "CENTRE" }]}
        />
        <ScaleBar x={96} y={1000} px={1000 * pxkm} label="1,000 KM" color={T.line} font={IF.label} />
        <CornerTicks color={T.line} />
      </Layer>
    </Stage>
  );
};
