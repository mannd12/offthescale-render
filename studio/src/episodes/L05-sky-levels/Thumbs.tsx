import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B, F } from "../../brand/tokens";

loadBrandFonts();

/**
 * L05 thumbnail: the real Earthrise (NASA, AS08-14-2383, public domain; no logo in the frame) with L01's gauge flipped
 * up the left edge, blue to indigo to black, its top tick at 630,000 km (sources.md #45). Two words, and an arrow to
 * the lunar horizon. The tease is qualified in the video by "0.2 atoms" (#45).
 */
export const ThumbL05: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Img src={staticFile("assets/l05-earthrise.jpg")} style={{ position: "absolute", left: 0, top: -450, width: 1400, height: 1400 }} />
    <div style={{ position: "absolute", left: 48, top: 30, width: 44, height: 660, borderRadius: 22, background: "linear-gradient(#000, #1B1F5E 45%, #19C3E6)", outline: "4px solid #fff", boxShadow: "0 0 40px rgba(25,195,230,0.8)" }} />
    <div style={{ position: "absolute", left: 92, top: 58, width: 40, height: 8, background: B.gauge }} />
    <div style={{ position: "absolute", left: 142, top: 26, fontFamily: F.headline, fontSize: 76, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap" }}>630,000 KM</div>
    <div style={{ position: "absolute", left: 142, top: 124, fontFamily: F.headline, fontSize: 200, lineHeight: 1.02, color: B.paper, whiteSpace: "nowrap" }}>
      STILL
      <br />
      SKY
    </div>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <path d="M470 440 C 620 470, 720 520, 790 600 M 730 596 L 796 608 L 786 540" stroke={B.gauge} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </AbsoluteFill>
);
