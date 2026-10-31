import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B, F } from "../../brand/tokens";

loadBrandFonts();

/**
 * L08 thumbnail: "COLDER THAN SPACE" (script header: the rival owns "hotter than infinity"). A real LHC magnet on the
 * right (MaGIc2laNTern, CC BY 3.0: credit in the description), a thermometer whose level sits below the SPACE mark (#16).
 */
export const ThumbL08: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: B.ink }}>
    <Img src={staticFile("assets/l08-dipole-close.jpg")} style={{ position: "absolute", left: 420, top: 0, width: 860, height: 720, objectFit: "cover", objectPosition: "42% 50%" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #06223A 0%, #06223A 34%, rgba(6,34,58,0.25) 62%, rgba(6,34,58,0.1) 100%)" }} />
    <div style={{ position: "absolute", left: 44, top: 34, fontFamily: F.headline, fontSize: 196, lineHeight: 1.03, color: B.paper, whiteSpace: "nowrap" }}>
      COLDER
      <br />
      THAN
      <br />
      <span style={{ color: B.aqua }}>SPACE</span>
    </div>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <rect x={1176} y={50} width={40} height={620} rx={20} fill="rgba(5,14,24,0.85)" stroke={B.paper} strokeWidth={5} />
      <rect x={1184} y={520} width={24} height={142} rx={12} fill={B.aqua} />
      <line x1={1130} y1={470} x2={1230} y2={470} stroke={B.paper} strokeWidth={8} />
    </svg>
    <div style={{ position: "absolute", right: 150, top: 438, padding: "2px 12px 4px", borderRadius: 10, background: "rgba(5,14,24,0.85)", fontFamily: F.headline, fontSize: 44, color: B.paper }}>SPACE</div>
  </AbsoluteFill>
);
