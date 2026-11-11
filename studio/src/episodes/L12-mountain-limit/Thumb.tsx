// L12 thumbnails (publish.md): key art I (C-10, dusk Everest, Tick on the summit, the warm root swelling under it, the
// gauge at 8,848.86 m, sources #1) drawn at 1920x1080 and shown at 1280x720, with a two-line headline upper-left.
// "HARD CEILING" (a, recommended: names the villain without repeating the title) / "WHY 9 KM?" (b, Test & Compare).
// Text ≥ 40 px from the right edge (it sits left); the gauge stays visible on the right.
import React from "react";
import { AbsoluteFill } from "remotion";
import { IF, P, loadIllustratedFonts } from "../../lib/illustrated";
import { KeyArt1 } from "./Full";

loadIllustratedFonts();

const L12Thumb: React.FC<{ lines: [string, string] }> = ({ lines }) => (
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

/** l12-thumb: "HARD CEILING" (recommended). */
export const ThumbL12: React.FC = () => <L12Thumb lines={["HARD", "CEILING"]} />;
/** l12-thumb-b: "WHY 9 KM?" (Test & Compare variant, same art). */
export const ThumbL12B: React.FC = () => <L12Thumb lines={["WHY", "9 KM?"]} />;
