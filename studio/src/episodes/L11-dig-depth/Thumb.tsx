// L11 thumbnails (episodes/L11-dig-depth/brief.md §2): bone sky over a slate block section; the Reference Figure
// beside the cap at true scale, the 23 cm hole (#3) plunging off the bottom through bands that warm toward amber,
// and the gauge (0-2 m ruler) blown off its scale: chevrons, the fill still running, "12,262 m" (#2).
// Headline ink on bone: "IT FOUGHT BACK" (a) / "WHY 12 KM?" (b). Drawn in 1920x1080 design units, shown at 1280x720,
// so every size here is x2/3 on the final image (headline 250 → 167 px; right margin ≥ 60 → ≥ 40 px).
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  Conifer,
  Gauge,
  Hatch,
  IF,
  P,
  PAIRS,
  PaperGrain,
  ReferenceFigure,
  ShadedRidge,
  BONE,
  fmt,
  lit,
  loadIllustratedFonts,
  mixHex,
  numStyle,
  ptsToPath,
  rnd,
  shade,
  strataLine,
  stratumPath,
  tint,
} from "../../lib/illustrated";

loadIllustratedFonts();

const E = PAIRS.earth;
const KOLA_M = 12262; // #2
const G = 600; // ground line
const PPM = 150; // px per metre: figure 255 tall, hole 23 cm = 35 px (#3)
const HOLE_X = 1500;
const GAUGE_X = 1240; // design units, before the gauge's own x2 scale
const GS = 2.2; // the kit gauge is drawn for 1080p video; scale it up so it survives at 168 px
const RULER_M = 2;

const C = {
  skyTop: mixHex(P.bone, E.a, 0.16),
  skyMid: mixHex(P.bone, E.a, 0.07),
  far: tint(E.a, P.bone, 0.6),
  farShade: tint(E.a, P.bone, 0.48),
  tree: tint(E.a, P.ink, 0.1),
  treeShade: tint(E.a, P.ink, 0.42),
  tundra: mixHex(tint(E.b, P.bone, 0.55), E.a, 0.2),
  snow: "#F8F4EA",
  soil: tint(E.b, P.bone, 0.48),
  metal: tint(E.a, P.bone, 0.2),
};

// stepped bands from cool slate to the amber heat band at the bottom (never a gradient)
const BANDS = [
  { y: 670, fill: tint(E.b, E.a, 0.55) },
  { y: 760, fill: mixHex(E.a, P.graphite, 0.2) },
  { y: 870, fill: mixHex(E.a, P.graphite, 0.38) },
  { y: 975, fill: mixHex(E.b, P.graphite, 0.3) },
];

const Art: React.FC = () => {
  const edges = BANDS.map((b, i) => strataLine(-60, 1980, b.y, 10, 3 + i * 2, 80));
  const top: [number, number][] = [[-60, G], [1980, G]];
  const bottom: [number, number][] = [[-60, 1120], [1980, 1120]];
  const back = G - 50;
  const ridge: [number, number][] = Array.from({ length: 13 }, (_, i) => [-40 + i * 170, back - 70 - Math.abs(Math.sin(i * 1.3 + 2)) * 90 - rnd(i + 4) * 30]);
  const capPx = 0.23 * PPM + 26;
  const holePx = 0.23 * PPM;
  const rulerTop = G;
  const rulerH = RULER_M * PPM;
  return (
    <g>
      <Hatch id="th-rock" color={mixHex(P.chalk, E.a, 0.75)} gap={22} angle={60} width={1.6} />
      <Hatch id="th-heat" color={mixHex(E.b, P.chalk, 0.35)} gap={18} angle={-30} width={1.6} />
      {/* sky: two flat bands, a pale low sun upper-left (the channel's light direction) */}
      <rect x={0} y={0} width={1920} height={back} fill={C.skyTop} />
      <rect x={0} y={back - 200} width={1920} height={200} fill={C.skyMid} />
      <ShadedRidge pts={ridge} base={back} fill={C.far} shadow={C.farShade} />
      {[1640, 1700, 1760, 1830, 1890, 1210, 1290].map((x, i) => (
        <Conifer key={x} x={x} y={back + 4} h={70 + rnd(i + 9) * 50} litColor={C.tree} shadeColor={C.treeShade} />
      ))}
      {/* top face of the block: tundra with snow patches */}
      <rect x={0} y={back} width={1920} height={G - back} fill={C.tundra} />
      {[[60, 160], [520, 120], [980, 140], [1700, 150]].map(([x, w], i) => (
        <path key={i} d={ptsToPath([[x, G - 30], [x + w * 0.3, G - 42], [x + w, G - 36], [x + w * 0.8, G - 22], [x + w * 0.1, G - 20]]) + " Z"} fill={C.snow} />
      ))}
      <line x1={0} y1={back} x2={1920} y2={back} stroke={tint(P.ink, P.bone, 0.5)} strokeWidth={2} />
      {/* front face: soil, then bands that darken and finally warm toward the bottom */}
      <path d={stratumPath(top, edges[0])} fill={C.soil} />
      {edges.map((e, i) => (
        <path key={i} d={stratumPath(e, i < edges.length - 1 ? edges[i + 1] : bottom)} fill={BANDS[i].fill} />
      ))}
      <path d={stratumPath(edges[1], edges[3])} fill="url(#th-rock)" opacity={0.5} />
      <path d={stratumPath(edges[3], bottom)} fill="url(#th-heat)" opacity={0.55} />
      {edges.map((e, i) => (
        <path key={`l${i}`} d={ptsToPath(e)} fill="none" stroke={P.ink} strokeWidth={2} opacity={0.4} />
      ))}
      <rect x={0} y={G} width={1920} height={8} fill={lit(C.soil, 0.45)} />
      {/* the hole: 23 cm at this scale, straight down and off the bottom of the frame */}
      <rect x={HOLE_X - holePx / 2} y={G} width={holePx} height={520} fill={P.graphite} />
      <rect x={HOLE_X + holePx / 2 - 7} y={G} width={7} height={520} fill={shade(E.a, 0.45)} />
      {/* the cap: a short two-tone cylinder on the top face */}
      <ellipse cx={HOLE_X + capPx * 0.4} cy={G - 16} rx={capPx * 0.8} ry={capPx * 0.2} fill={shade(C.tundra, 0.25)} />
      <path d={`M${HOLE_X - capPx / 2} ${G - 22} L${HOLE_X - capPx / 2} ${G - 10} A${capPx / 2} ${capPx * 0.17} 0 0 0 ${HOLE_X + capPx / 2} ${G - 10} L${HOLE_X + capPx / 2} ${G - 22} Z`} fill={shade(C.metal, 0.3)} />
      <ellipse cx={HOLE_X} cy={G - 22} rx={capPx / 2} ry={capPx * 0.17} fill={C.metal} />
      <line x1={0} y1={G} x2={1920} y2={G} stroke={P.ink} strokeWidth={3} />
      {/* the Reference Figure beside the cap, pointing down at it; its shadow falls right */}
      <path d={ptsToPath([[1378, G - 24], [1408, G - 24], [1470, G - 4], [1440, G - 4]]) + " Z"} fill={shade(C.tundra, 0.3)} />
      <ReferenceFigure x={1390} y={G - 24} pxPerM={PPM} pose="point" look={0.5} />
      {/* the gauge, scaled up: a 0-2 m ruler beside the figure, the value far past its end */}
      <g transform={`translate(${GAUGE_X} ${rulerTop}) scale(${GS}) translate(${-GAUGE_X} ${-rulerTop})`}>
        <Gauge
          x={GAUGE_X}
          y={rulerTop}
          height={rulerH / GS}
          value={KOLA_M}
          max={RULER_M}
          unit="m"
          theme={BONE}
          format={(v) => `${v} m`}
          readout={false}
          plate={86}
          platePad={10}
          ticks={2}
          unitCap={false}
        />
      </g>
      {/* the fill keeps running below the chevrons, off the bottom of the frame */}
      <rect x={GAUGE_X} y={rulerTop + rulerH + 90} width={14 * GS} height={400} fill={P.vermilion} />
      {/* readout: the number the ruler cannot hold */}
      <g>
        <rect x={GAUGE_X - 44 - 600} y={rulerTop + rulerH + 26} width={600} height={136} fill={P.vermilion} stroke={P.bone} strokeWidth={6} />
        <text x={GAUGE_X - 44 - 300} y={rulerTop + rulerH + 134} textAnchor="middle" style={numStyle(112, P.bone)}>
          {fmt(KOLA_M)} m
        </text>
      </g>
    </g>
  );
};

const L11Thumb: React.FC<{ lines: [string, string] }> = ({ lines }) => (
  <AbsoluteFill style={{ backgroundColor: P.bone }}>
    <svg width={1280} height={720} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <Art />
      {lines.map((l, i) => (
        <text key={i} x={70} y={258 + i * 262} style={{ fontFamily: IF.label, fontSize: 250, letterSpacing: 3, fill: P.ink, textTransform: "uppercase" }}>
          {l}
        </text>
      ))}
    </svg>
    <PaperGrain frame={0} amount={0.7} />
  </AbsoluteFill>
);

/** l11-thumb: "IT FOUGHT BACK" (recommended; adds the villain, doesn't repeat the title). */
export const ThumbL11: React.FC = () => <L11Thumb lines={["IT FOUGHT", "BACK"]} />;
/** l11-thumb-b: "WHY 12 KM?" (Test & Compare variant, same art). */
export const ThumbL11B: React.FC = () => <L11Thumb lines={["WHY", "12 KM?"]} />;
