import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B, F } from "../../brand/tokens";
import { heat } from "./gauge";

loadBrandFonts();

/**
 * L07 thumbnail, per brief.md: the real St. Helens 1980 column (D. Swanson, USGS, public domain) fills the right two
 * thirds; a nine-step gauge on the left. The column is level 5, so it is lit only to step 5 and the column's top sits
 * at that step; steps 6-8 stand empty above it, and "8" is the open question, not a label on the photo.
 */
export const ThumbL07: React.FC = () => {
  const STEP = 68;
  const y = (v: number) => 54 + (8 - v) * STEP;
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <Img src={staticFile("assets/l07-msh-plume.jpg")} style={{ position: "absolute", left: 400, top: y(5), width: 880, height: 720 - y(5), objectFit: "cover", objectPosition: "60% 30%" }} />
      {Array.from({ length: 9 }, (_, v) => (
        <div key={v} style={{ position: "absolute", left: 40, top: y(v) - 2, width: 110 + v * 18, height: STEP - 8, borderRadius: 8, background: v <= 5 ? heat(v) : "rgba(255,255,255,0.14)", border: v > 5 ? `3px dashed ${B.mute}` : "none", boxSizing: "border-box", fontFamily: F.headline, fontSize: 44, lineHeight: `${STEP - 10}px`, paddingLeft: 14, color: v <= 5 ? B.ink : B.paper }}>{v}</div>
      ))}
      <div style={{ position: "absolute", left: 340, top: 8, fontFamily: F.headline, fontSize: 112, lineHeight: 1.08, color: B.gauge, whiteSpace: "nowrap" }}>ONLY LEVEL 5</div>
    </AbsoluteFill>
  );
};
