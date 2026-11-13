// L14 thumbnails (publish.md): key art II (the probe over the glowing inner core, liquid iron streaming past), drawn at
// 1920x1080 and shown at 1280x720, with a two-line headline upper-left.
// "IT NEVER MAKES IT" (a, recommended) / "42 MINUTES? NO." (b, Test & Compare).
// Text ≥ 40 px from the right edge (it sits left); the gauge stays visible on the right.
import React from "react";
import { AbsoluteFill } from "remotion";
import { IF, P, loadIllustratedFonts } from "../../lib/illustrated";
import { KeyArt2 } from "./Full";

loadIllustratedFonts();

const L14Thumb: React.FC<{ lines: [string, string] }> = ({ lines }) => (
  <AbsoluteFill style={{ backgroundColor: P.ink, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.6667)", transformOrigin: "0 0" }}>
      <KeyArt2 />
    </div>
    {/* an opaque ember panel behind the headline: it also covers any label of the shot itself */}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(96deg, rgba(40,12,6,0.9) 0%, rgba(40,12,6,0.82) 36%, rgba(40,12,6,0) 56%)" }} />
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0 }}>
      {lines.map((l, i) => (
        <text key={i} x={44} y={172 + i * 150} style={{ fontFamily: IF.label, fontSize: 128, letterSpacing: 2, fill: P.bone, textTransform: "uppercase", paintOrder: "stroke", stroke: "rgba(10,24,34,0.6)", strokeWidth: 6 }}>
          {l}
        </text>
      ))}
    </svg>
  </AbsoluteFill>
);

/** l14-thumb: "IT NEVER MAKES IT" (recommended). */
export const ThumbL14: React.FC = () => <L14Thumb lines={["IT NEVER", "MAKES IT"]} />;
/** l14-thumb-b: "42 MINUTES? NO." (Test & Compare variant, same art). */
export const ThumbL14B: React.FC = () => <L14Thumb lines={["42 MINUTES?", "NO."]} />;
