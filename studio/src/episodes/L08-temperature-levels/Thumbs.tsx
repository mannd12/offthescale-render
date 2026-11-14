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

/**
 * L08 thumbnail B (2026-11-13, drawn, no photo): the top rung (sources.md #56, "hottest ever made", 4 trillion °C).
 * A thermometer whose column runs off the top of the frame, cold blue at the foot to white-hot at the top.
 */
export const ThumbL08B: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(105deg, #1A0508 0%, #5A0B0B 38%, #C2260E 68%, #FF7A1A 100%)" }}>
    <div style={{ position: "absolute", left: 760, top: -260, width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,246,200,0.95) 0%, rgba(255,200,61,0.7) 28%, rgba(255,122,26,0) 68%)" }} />
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="l08b" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#19C3E6" />
          <stop offset="0.28" stopColor="#FFC83D" />
          <stop offset="0.6" stopColor="#FF5A1F" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      <rect x={1040} y={-40} width={110} height={640} rx={55} fill="#12060A" stroke="#FFFFFF" strokeWidth={10} />
      <circle cx={1095} cy={600} r={96} fill="#12060A" stroke="#FFFFFF" strokeWidth={10} />
      <rect x={1068} y={-40} width={54} height={640} fill="url(#l08b)" />
      <circle cx={1095} cy={600} r={68} fill="#19C3E6" />
      {[120, 220, 320, 420].map((y) => (
        <line key={y} x1={970} y1={y} x2={1030} y2={y} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />
      ))}
    </svg>
    <div style={{ position: "absolute", left: 44, top: 60, fontFamily: F.headline, fontSize: 210, lineHeight: 1.0, color: "#FFE9A8", whiteSpace: "nowrap", textShadow: "0 8px 0 rgba(26,5,8,0.6)" }}>
      4 TRILLION
    </div>
    <div style={{ position: "absolute", left: 50, top: 290, fontFamily: F.headline, fontSize: 150, lineHeight: 1.04, color: B.paper, whiteSpace: "nowrap", textShadow: "0 6px 0 rgba(26,5,8,0.6)" }}>
      DEGREES.
      <br />
      MADE HERE.
    </div>
  </AbsoluteFill>
);
