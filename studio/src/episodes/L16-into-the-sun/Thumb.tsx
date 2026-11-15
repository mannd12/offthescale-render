// L16 thumbnails (publish.md). One grammar (PRODUCTION-PLAN 7b.7): 1-3 words in capitals + one central object.
// A "IT DIDN'T MELT": the drawn probe, small, shield down, over a huge Sun limb on deep indigo. True to the video:
// Parker flew through the corona, the instruments behind the shield stayed about 30 C (sources rows 9, 13).
// B (Test & Compare) "STILL WORKING": a two-state split, the same probe far out / at the Sun. No numbers, no face on
// the Sun, nothing from Kurzgesagt. Drawn at 1920x1080, shown at 1280x720; text sits left, >= 40 px from the right.
import React from "react";
import { AbsoluteFill } from "remotion";
import { IF, P, loadIllustratedFonts, rnd } from "../../lib/illustrated";
import { L16_COLORS as C } from "./families";
import { Probe } from "./props16";
import { CoronaHalo, SunLimb } from "./sunbody";

loadIllustratedFonts();

const F = 60;

const Stars: React.FC<{ x0: number; x1: number; y1: number; n: number }> = ({ x0, x1, y1, n }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <circle key={i} cx={x0 + rnd(i * 3 + 1) * (x1 - x0)} cy={rnd(i * 7 + 2) * y1} r={1.5 + rnd(i * 5 + 4) * 2.6} fill={i % 3 ? "#FFE6A8" : "#5FE0F0"} opacity={0.35 + rnd(i * 11) * 0.5} />
    ))}
  </g>
);

const Sky: React.FC<{ id: string }> = ({ id }) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#070A22" />
        <stop offset="1" stopColor="#1C1670" />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id})`} />
  </>
);

const ArtA: React.FC = () => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080">
    <Sky id="l16skyA" />
    <Stars x0={0} x1={1920} y1={620} n={70} />
    <CoronaHalo f={F} cx={900} cy={2330} R={1750} extent={430} loops={6} a0={-96} a1={-58} intensity={1} rays={false} />
    <SunLimb f={F} cx={900} cy={2330} R={1750} granSize={90} bloom={1} />
    {/* the probe, small, shield down toward the limb */}
    <Probe x={1330} y={400} size={420} f={F} tilt={-90} lamp={false} />
  </svg>
);

const ArtB: React.FC = () => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080">
    <Sky id="l16skyB" />
    {/* left state: far out, the Sun a distant small disc, the probe quiet */}
    <Stars x0={0} x1={960} y1={1080} n={46} />
    <circle cx={150} cy={820} r={46} fill={C.gold} opacity={0.95} />
    <circle cx={150} cy={820} r={110} fill={C.amber} opacity={0.18} />
    <Probe x={560} y={720} size={300} f={F} tilt={0} lamp={false} />
    {/* right state: at the Sun */}
    <g>
      <clipPath id="l16clipB">
        <rect x={960} y={0} width={960} height={1080} />
      </clipPath>
      <g clipPath="url(#l16clipB)">
        <Stars x0={960} x1={1920} y1={620} n={30} />
        <CoronaHalo f={F} cx={1500} cy={2200} R={1600} extent={420} loops={5} a0={-104} a1={-62} rays={false} />
        <SunLimb f={F} cx={1500} cy={2200} R={1600} granSize={90} />
        <Probe x={1500} y={470} size={340} f={F} tilt={-90} lamp={false} />
      </g>
    </g>
    <line x1={960} y1={0} x2={960} y2={1080} stroke={C.bone} strokeWidth={8} opacity={0.9} />
  </svg>
);

const Words: React.FC<{ lines: string[]; size: number; accentLast?: boolean }> = ({ lines, size, accentLast = true }) => (
  <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0 }}>
    {lines.map((l, i) => (
      <text
        key={i}
        x={44}
        y={size + 22 + i * (size + 8)}
        style={{
          fontFamily: IF.label,
          fontSize: size,
          letterSpacing: 2,
          fill: accentLast && i === lines.length - 1 ? "#FFC85A" : P.bone,
          textTransform: "uppercase",
          stroke: "#05061A",
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

const Frame: React.FC<{ art: React.ReactNode; lines: string[]; size: number }> = ({ art, lines, size }) => (
  <AbsoluteFill style={{ backgroundColor: "#070A22", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.6667)", transformOrigin: "0 0" }}>{art}</div>
    <Words lines={lines} size={size} />
  </AbsoluteFill>
);

/** l16-thumb: "IT DIDN'T MELT" (recommended). */
export const ThumbL16: React.FC = () => <Frame art={<ArtA />} lines={["IT DIDN'T", "MELT"]} size={130} />;
/** l16-thumb-b: "STILL WORKING" (Test & Compare, two-state split). */
export const ThumbL16B: React.FC = () => <Frame art={<ArtB />} lines={["STILL", "WORKING"]} size={130} />;
