import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B, F } from "../../brand/tokens";
import { FUEL } from "./gauge";

loadBrandFonts();

/** L10 thumbnail: "90% FUEL". The real Apollo 4 Saturn V (NASA, PD), no insignia in the crop; beside it a drawn gauge filled to the row's ~90 % (#6). */
export const ThumbL10: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#050E18" }}>
    <div style={{ position: "absolute", left: 520, top: 0, width: 760, height: 720, overflow: "hidden" }}>
      <Img src={staticFile("assets/l10-a4.jpg")} style={{ position: "absolute", left: -20, top: -140, width: 865, height: 1122 }} />
    </div>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #050E18 0%, #050E18 42%, rgba(5,14,24,0) 66%)" }} />
    <div style={{ position: "absolute", left: 44, top: 60, fontFamily: F.headline, fontSize: 270, lineHeight: 1.04, color: FUEL, whiteSpace: "nowrap" }}>90%</div>
    <div style={{ position: "absolute", left: 44, top: 350, fontFamily: F.headline, fontSize: 270, lineHeight: 1.04, color: B.paper, whiteSpace: "nowrap" }}>FUEL</div>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <rect x={1160} y={36} width={76} height={648} rx={12} fill="rgba(5,14,24,0.9)" stroke={B.paper} strokeWidth={6} />
      <rect x={1166} y={36 + 648 * 0.1} width={64} height={648 * 0.9 - 6} rx={8} fill={FUEL} />
    </svg>
  </AbsoluteFill>
);
