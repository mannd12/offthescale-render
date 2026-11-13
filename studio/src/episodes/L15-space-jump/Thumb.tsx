// L15 thumbnails (publish.md): one tall sky, dawn-orange at the bottom to black at the top, the probe falling with a
// streak, the SPEED dial with its needle turned back from the (ghost) peak, Tick small. Drawn at 1920x1080, shown at
// 1280x720, with a two-line headline upper-left on an opaque panel. No numbers are drawn.
// "THEN IT BRAKES" (a) / "NO SUCH EDGE" (b, Test & Compare). Text >= 40 px from the right edge (it sits left).
import React from "react";
import { AbsoluteFill } from "remotion";
import { IF, P, Tick, loadIllustratedFonts } from "../../lib/illustrated";
import { familyOf } from "./families";
import { SpeedGauge } from "./L15Gauges";
import { Probe } from "./props";
import { SkyColumn } from "./sky";

loadIllustratedFonts();

const F = 40;
const Art: React.FC = () => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080">
    <SkyColumn f={F} altTop={110} altBottom={0} stars drift={0} />
    {/* dawn glow at the foot of the column */}
    <defs>
      <linearGradient id="l15dawn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FF8A3D" stopOpacity="0" />
        <stop offset="0.6" stopColor="#FF8A3D" stopOpacity="0.6" />
        <stop offset="1" stopColor="#FFC27A" stopOpacity="0.85" />
      </linearGradient>
    </defs>
    <rect x={0} y={420} width={1920} height={660} fill="url(#l15dawn)" />
    {[-70, -28, 24, 66].map((dx, i) => (
      <line key={i} x1={930 + dx} y1={20 + i * 30} x2={930 + dx} y2={170 + i * 36} stroke="#F4EBDD" strokeWidth={7 - (i % 2) * 2} strokeLinecap="round" opacity={0.7} />
    ))}
    <Probe x={930} y={380} size={290} f={F} lamp={false} />
    <SpeedGauge x={1260} y={560} scale={1.45} f={F} family={familyOf("void")} s={{ value: 0.42, ghost: 0.955, soundT: -46.6, max: 1100 }} />
    <Tick x={1110} y={1010} pxPerM={70} frame={F} facing={1} pose="point" expression="determined" look={-0.4} />
  </svg>
);

const L15Thumb: React.FC<{ lines: [string, string] }> = ({ lines }) => (
  <AbsoluteFill style={{ backgroundColor: P.ink, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.6667)", transformOrigin: "0 0" }}>
      <Art />
    </div>
    {/* an opaque ink panel behind the headline: nothing ghosts through the letters */}
    <div style={{ position: "absolute", left: 0, top: 0, width: 600, height: 720, background: "linear-gradient(90deg, #070A1C 0%, #070A1C 84%, rgba(7,10,28,0) 100%)" }} />
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0 }}>
      {lines.map((l, i) => (
        <text key={i} x={44} y={170 + i * 118} style={{ fontFamily: IF.label, fontSize: 110, letterSpacing: 2, fill: i === 1 ? "#FFC85A" : P.bone, textTransform: "uppercase" }}>
          {l}
        </text>
      ))}
    </svg>
  </AbsoluteFill>
);

/** l15-thumb: "THEN IT BRAKES" (recommended). */
export const ThumbL15: React.FC = () => <L15Thumb lines={["THEN IT", "BRAKES"]} />;
/** l15-thumb-b: "NO SUCH EDGE" (Test & Compare variant, same art). */
export const ThumbL15B: React.FC = () => <L15Thumb lines={["NO SUCH", "EDGE"]} />;
