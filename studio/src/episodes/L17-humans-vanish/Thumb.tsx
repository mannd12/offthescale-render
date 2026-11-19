// L17 thumbnails (package.md "Thumbnail concept"; PRODUCTION-PLAN 7b.7 grammar: 1-3 capital words + one central object).
// A `L17HumansVanish-thumb-a` "A MILLION / YEARS": one sharp-edged bootprint in warm Moon dust fills the lower half; a tiny
//   Tick and a rigid flag beside it (F6: no wind); a faint ghost skyline top-left fading to nothing. Colour runs
//   city-amber at the far left edge → cool teal → petrol-black sky; the print is the brightest cool mark.
// B `L17HumansVanish-thumb-b` "NOTHING LEFT?" over the same art (Test & Compare).
// No people, no bodies (F1); no numbers on A (B carries none either). Drawn at 1280×720; type 150 px, ≥ 40 px from
// every edge (right-aligned at x = 1240, top line's cap at y ≈ 48).
import React from "react";
import { AbsoluteFill } from "remotion";
import { IF, Tick, loadIllustratedFonts, rnd } from "../../lib/illustrated";
import { L17_COLORS as C, STAR_TINTS } from "./families";

loadIllustratedFonts();

const W = 1280;
const H = 720;
const HORIZON = 360;

const Art: React.FC = () => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="l17tSky" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#5A2E14" />
        <stop offset="0.12" stopColor="#1C3A40" />
        <stop offset="0.45" stopColor="#0A1E26" />
        <stop offset="1" stopColor="#03080B" />
      </linearGradient>
      <radialGradient id="l17tGlow" cx="0" cy="0.42" r="0.5">
        <stop offset="0" stopColor={C.amber} stopOpacity={0.75} />
        <stop offset="0.5" stopColor={C.amberDeep} stopOpacity={0.2} />
        <stop offset="1" stopColor={C.amberDeep} stopOpacity={0} />
      </radialGradient>
      <linearGradient id="l17tDust" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6E6250" />
        <stop offset="0.35" stopColor="#B8A57E" />
        <stop offset="1" stopColor={C.moonDust} />
      </linearGradient>
      <linearGradient id="l17tGhost" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C.amber} stopOpacity={0.55} />
        <stop offset="1" stopColor={C.amber} stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill="url(#l17tSky)" />
    <rect x={0} y={0} width={W} height={H} fill="url(#l17tGlow)" />
    {Array.from({ length: 60 }, (_, i) => (
      <circle key={i} cx={260 + rnd(i * 3 + 1) * 1000} cy={rnd(i * 7 + 2) * (HORIZON - 30)} r={0.9 + rnd(i * 5 + 4) * 1.8} fill={STAR_TINTS[i % 4]} opacity={0.35 + rnd(i * 11) * 0.5} />
    ))}
    {/* the ghost skyline, top-left, fading to nothing */}
    <g opacity={0.5}>
      {Array.from({ length: 9 }, (_, i) => {
        const bx = -10 + i * 52;
        const bh = 70 + rnd(i * 13 + 3) * 150;
        return <rect key={i} x={bx} y={HORIZON - bh} width={44} height={bh} fill="none" stroke="url(#l17tGhost)" strokeWidth={2} strokeDasharray="6 5" />;
      })}
    </g>
    {/* Moon dust plane with grain */}
    <rect x={0} y={HORIZON} width={W} height={H - HORIZON} fill="url(#l17tDust)" />
    <path d={`M0 ${HORIZON} Q320 ${HORIZON - 14} 640 ${HORIZON - 4} T1280 ${HORIZON - 10} V${HORIZON + 6} H0 Z`} fill="#8C7C60" />
    {Array.from({ length: 140 }, (_, i) => {
      const gy = HORIZON + 10 + rnd(i * 17 + 5) ** 0.8 * (H - HORIZON - 10);
      return <circle key={i} cx={rnd(i * 19 + 2) * W} cy={gy} r={0.8 + ((gy - HORIZON) / (H - HORIZON)) * 2.2} fill={i % 3 ? "#7A6A50" : "#FFF4DC"} opacity={0.4} />;
    })}
    {/* the bootprint: a pressed hollow, lit far rim, shadowed near rim, sharp tread bars */}
    <g transform="translate(560 560) rotate(-62) scale(1 0.62)">
      {(() => {
        const s = 3.1;
        const sole = `M${-14 * s} ${-46 * s} Q0 ${-54 * s} ${14 * s} ${-46 * s} L${18 * s} ${-6 * s} Q${16 * s} ${4 * s} ${12 * s} ${10 * s} L${13 * s} ${42 * s} Q0 ${52 * s} ${-13 * s} ${42 * s} L${-12 * s} ${10 * s} Q${-16 * s} ${4 * s} ${-18 * s} ${-6 * s} Z`;
        return (
          <g>
            <path d={sole} fill="#FFF6E0" transform="translate(-7 -9)" opacity={0.9} />
            <path d={sole} fill="#4A3E2C" transform="translate(6 8)" />
            <path d={sole} fill="#A8946C" />
            {Array.from({ length: 9 }, (_, i) => {
              const ty = -40 + i * 9.5;
              const hw = ty < 0 ? 13 : 10.5;
              return (
                <g key={i}>
                  <rect x={-hw * s} y={ty * s} width={2 * hw * s} height={4.2 * s} rx={1} fill="#5E4E36" />
                  <rect x={-hw * s} y={ty * s - 3} width={2 * hw * s} height={2.2} fill="#E8D7B0" opacity={0.8} />
                </g>
              );
            })}
          </g>
        );
      })()}
    </g>
    {/* tiny Tick and a rigid flag (no flutter) beside the print */}
    <g>
      <line x1={930} y1={470} x2={930} y2={352} stroke="#E8F2EE" strokeWidth={4} />
      <rect x={930} y={354} width={74} height={44} fill="#E8F2EE" />
      <rect x={930} y={354} width={74} height={8} fill={C.saffron} />
      <line x1={930} y1={355} x2={1006} y2={355} stroke="#E8F2EE" strokeWidth={3} />
      <ellipse cx={930} cy={472} rx={22} ry={5} fill="#3A3020" opacity={0.6} />
    </g>
    <Tick x={1000} y={478} pxPerM={62} frame={40} pose="stand" expression="proud" facing={-1} look={-0.3} />
    <ellipse cx={1000} cy={480} rx={34} ry={6} fill="#3A3020" opacity={0.5} />
  </svg>
);

const Words: React.FC<{ lines: [string, string]; size?: number; second?: string }> = ({ lines, size = 150, second = C.seen }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    {lines.map((l, i) => (
      <text
        key={i}
        x={W - 40}
        y={40 + size * 0.86 + i * (size * 0.98)}
        textAnchor="end"
        style={{
          fontFamily: IF.label,
          fontSize: size,
          letterSpacing: 2,
          fill: i === 1 ? second : C.bone,
          textTransform: "uppercase",
          stroke: "#020A0E",
          strokeWidth: 10,
          paintOrder: "stroke",
          strokeLinejoin: "round",
        }}
      >
        {l}
      </text>
    ))}
  </svg>
);

const Frame: React.FC<{ lines: [string, string]; second?: string }> = ({ lines, second }) => (
  <AbsoluteFill style={{ backgroundColor: "#03080B", overflow: "hidden" }}>
    <Art />
    <Words lines={lines} second={second} />
  </AbsoluteFill>
);

/** L17HumansVanish-thumb-a: "A MILLION / YEARS" (recommended; the second line in the SEEN stamp green). */
export const ThumbL17A: React.FC = () => <Frame lines={["A MILLION", "YEARS"]} />;
/** L17HumansVanish-thumb-b: "NOTHING LEFT?" (Test & Compare), the same art. */
export const ThumbL17B: React.FC = () => <Frame lines={["NOTHING", "LEFT?"]} second={C.amber} />;
