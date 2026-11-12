// L13 thumbnails (publish.md): key art I (3-14, the shock wall reaching Tick, gauge pinned at the ceiling), drawn at
// 1920x1080 and shown at 1280x720, with a two-line headline upper-left.
// "AIR HAS A CEILING" (a, recommended) / "IT BROKE THE AIR" (b, Test & Compare).
// Text ≥ 40 px from the right edge (it sits left); the gauge stays visible on the right.
import React from "react";
import { AbsoluteFill } from "remotion";
import { IF, P, loadIllustratedFonts } from "../../lib/illustrated";
import { KeyArt1 } from "./Full";

loadIllustratedFonts();

const L13Thumb: React.FC<{ lines: [string, string] }> = ({ lines }) => (
  <AbsoluteFill style={{ backgroundColor: P.ink, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.6667)", transformOrigin: "0 0" }}>
      <KeyArt1 />
    </div>
    {/* a soft dark wash behind the headline so it reads at 168 px, fading out before the summit */}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(10,24,34,0.55) 0%, rgba(10,24,34,0.25) 38%, rgba(10,24,34,0) 55%)" }} />
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0 }}>
      {lines.map((l, i) => (
        <text key={i} x={44} y={172 + i * 150} style={{ fontFamily: IF.label, fontSize: 142, letterSpacing: 2, fill: P.bone, textTransform: "uppercase", paintOrder: "stroke", stroke: "rgba(10,24,34,0.6)", strokeWidth: 6 }}>
          {l}
        </text>
      ))}
    </svg>
  </AbsoluteFill>
);

/** l13-thumb: "AIR HAS A CEILING" (recommended). */
export const ThumbL13: React.FC = () => <L13Thumb lines={["AIR HAS A", "CEILING"]} />;
/** l13-thumb-b: "IT BROKE THE AIR" (Test & Compare variant, same art). */
export const ThumbL13B: React.FC = () => <L13Thumb lines={["IT BROKE", "THE AIR"]} />;
