// L19 thumbnails (package.md concepts with the cream/silver of concept 2 overridden to amber and hot gold: storyboard §2,
// BUILD.md §2; PRODUCTION-PLAN 7b.7 grammar: 1-3 capital words + one central object, 40 px from every edge, 150 px type).
// A `L19IntoJupiter-thumb-a` "58 MINUTES": a huge striped Jupiter limb fills the top, warm orange at the top running to
//   crimson-black at the bottom; a tiny round probe under its canopy hangs below the limb with a thin lemon tape trailing up.
//   58 is READ.min58 (rows 2, 3, class A). No people (F1), no insignia (F7).
// B `L19IntoJupiter-thumb-b` "NO FLOOR": a single BarDial, needle on the 30 mark (a sourced stop, F6) with the heat ring
//   full (the red), over amber cloud running to hot gold. NO FLOOR is class B (no numeral).
// Drawn in 1920×1080 units and scaled to 1280×720 (so 225 units = 150 px, 60 units = 40 px).
import React from "react";
import { AbsoluteFill } from "remotion";
import { IF, loadIllustratedFonts } from "../../lib/illustrated";
import { L19_COLORS as C } from "./families";
import { READ, assertAllowed } from "./data19";
import { BarDial } from "./dial";
import { Canopy, Capsule } from "./probe19";
import { StarsTint } from "./flows19";

loadIllustratedFonts();

const W = 1920;
const H = 1080;
const TYPE = 225; // = 150 px at 1280
const EDGE = 60; // = 40 px at 1280

const Words: React.FC<{ words: [string, string]; first: string; second: string; stroke: string }> = ({ words, first, second, stroke }) => (
  <text x={EDGE} y={H - EDGE - 6} style={{ fontFamily: IF.label, fontSize: TYPE, letterSpacing: 3, stroke, strokeWidth: 16, paintOrder: "stroke", strokeLinejoin: "round" }}>
    <tspan fill={first}>{assertAllowed(words[0], "thumb")} </tspan>
    <tspan fill={second}>{words[1]}</tspan>
  </text>
);

const LIMB_BANDS = [C.stripeAmber, C.stripeOrange, "#FFC247", C.stripeRust, C.belt, C.stripeOrange, C.stripeAmber, C.stripeRust, "#F28A1E"];

const ArtA: React.FC = () => {
  const cx = 820;
  const cy = -2150;
  const R = 2700; // the limb's lowest point sits at y = 550
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="thA-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF9A2E" />
          <stop offset="0.45" stopColor="#A8300C" />
          <stop offset="0.75" stopColor="#5A1206" />
          <stop offset="1" stopColor="#2A0804" />
        </linearGradient>
        <clipPath id="thA-limb">
          <circle cx={cx} cy={cy} r={R} />
        </clipPath>
        <radialGradient id="thA-glow" cx="0.43" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#FFD27A" stopOpacity={0.55} />
          <stop offset="1" stopColor="#FFD27A" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#thA-sky)" />
      <StarsTint f={0} x={0} y={520} w={W} h={560} n={60} speed={0} seed={4} size={2.8} />
      <ellipse cx={cx} cy={540} rx={1500} ry={160} fill="url(#thA-glow)" />
      <g clipPath="url(#thA-limb)">
        {LIMB_BANDS.map((c, i) => {
          const y0 = -40 + i * 66;
          return <path key={i} d={`M-200 ${y0} Q500 ${y0 + 40} 960 ${y0 + 10} T2200 ${y0 + 20} V${y0 + 140} H-200 Z`} fill={c} />;
        })}
        <ellipse cx={1320} cy={330} rx={120} ry={58} fill={C.spot} />
        <circle cx={cx} cy={cy} r={R - 26} fill="none" stroke="#5A1206" strokeWidth={60} opacity={0.35} />
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#FFD27A" strokeWidth={8} opacity={0.85} />
      {/* the lemon tape trailing up from the probe to the limb */}
      <path d="M1495 770 C1470 690 1540 640 1500 560" fill="none" stroke={C.heard} strokeWidth={14} strokeLinecap="round" />
      <Canopy x={1500} y={800} r={34} unfurl={1} f={0} sway={0} />
      <Capsule x={1500} y={800} r={34} f={0} chips={6} />
      <Words words={[READ.min58.text.split(" ")[0], "MINUTES"]} first={C.heard} second="#FFE2A8" stroke="#2A0804" />
    </svg>
  );
};

const ArtB: React.FC = () => (
  <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="thB-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F28A1E" />
        <stop offset="0.55" stopColor="#FFC247" />
        <stop offset="1" stopColor={C.gold} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#thB-sky)" />
    {[180, 330, 470].map((y, i) => (
      <path key={i} d={`M0 ${y} Q480 ${y - 50} 960 ${y} T1920 ${y} V${y + 70} Q1440 ${y + 30} 960 ${y + 70} T0 ${y + 70} Z`} fill={i === 1 ? "#FFE8B0" : C.stripeAmber} opacity={0.5} />
    ))}
    <BarDial f={0} cx={1330} cy={470} r={330} needle={30} lit={12} heat={1} heatMark={false} />
    <Words words={["NO", "FLOOR"]} first="#2B0905" second="#2B0905" stroke="#FFE066" />
  </svg>
);

export const ThumbL19A: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#2A0804" }}>
    <ArtA />
  </AbsoluteFill>
);
export const ThumbL19B: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#FFC247" }}>
    <ArtB />
  </AbsoluteFill>
);
