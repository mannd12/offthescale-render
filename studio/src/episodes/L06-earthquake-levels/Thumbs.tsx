import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B, F } from "../../brand/tokens";

loadBrandFonts();

/**
 * L06 thumbnail. brief.md's Valdivia photo did not clear (assets.md), so its fallback applies: a photo of the 1964
 * quake must say so, hence M9.2. Alaska Railroad tracks near Turnagain Arm (USGS, public domain), damage with no
 * people. The words add what the title lacks: this huge number is not the record (#37). Colour column, top at 9.5.
 */
export const ThumbL06: React.FC = () => {
  const yOf = (m: number) => 680 - (m - 1) * (640 / 8.5);
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <Img src={staticFile("assets/l06-rail.jpg")} style={{ position: "absolute", inset: 0, width: 1280, height: 720, objectFit: "cover", objectPosition: "50% 70%", filter: "brightness(0.85)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,27,43,0.9) 0%, rgba(11,27,43,0.55) 40%, rgba(11,27,43,0) 62%)" }} />
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="t6" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={B.tease} />
            <stop offset="0.5" stopColor={B.gauge} />
            <stop offset="1" stopColor={B.aqua} />
          </linearGradient>
        </defs>
        <rect x={34} y={yOf(9.5)} width={44} height={yOf(1) - yOf(9.5)} rx={10} fill="url(#t6)" stroke={B.ink} strokeWidth={5} />
        <path d={`M86 ${yOf(9.2)} l40 -26 v52 z`} fill={B.paper} stroke={B.ink} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: 150, top: 16, fontFamily: F.headline, fontSize: 210, lineHeight: 1.08, color: B.paper, whiteSpace: "nowrap" }}>M9.2</div>
      <div style={{ position: "absolute", left: 150, top: 240, fontFamily: F.headline, fontSize: 112, lineHeight: 1.08, color: B.gauge, whiteSpace: "nowrap" }}>NOT THE RECORD</div>
    </AbsoluteFill>
  );
};
