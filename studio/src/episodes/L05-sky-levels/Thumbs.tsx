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

/**
 * L05 thumbnail B (2026-11-13, drawn, no photo): the geocorona claim itself (sources.md #45: Earth's hydrogen envelope
 * reaches 630,000 km and "the Moon flies through Earth's atmosphere"; the video says how thin it is). Earth low left,
 * a wide blue glow across the frame, the Moon sitting inside the glow.
 */
export const ThumbL05B: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#03040F" }}>
    <div style={{ position: "absolute", left: -520, top: 60, width: 1900, height: 1900, borderRadius: "50%", background: "radial-gradient(circle, rgba(25,195,230,0.95) 0%, rgba(30,110,235,0.75) 22%, rgba(40,60,200,0.42) 40%, rgba(40,40,150,0.16) 52%, rgba(3,4,15,0) 62%)" }} />
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <circle cx={430} cy={1010} r={1010 - 300} fill="none" stroke="#9FE9FF" strokeWidth={5} strokeDasharray="4 22" strokeLinecap="round" opacity={0.75} />
      <circle cx={170} cy={760} r={330} fill="#1565D8" />
      <path d="M-60 640 C 60 560, 150 600, 230 520 C 300 470, 380 520, 420 600 C 440 680, 330 700, 260 760 L -60 760 Z" fill="#2FB36B" />
      <path d="M-160 760 A 330 330 0 0 1 500 760" fill="none" stroke="#BFF3FF" strokeWidth={10} />
      <circle cx={1010} cy={470} r={92} fill="#D9DCE3" />
      <circle cx={980} cy={440} r={20} fill="#B4B8C4" />
      <circle cx={1040} cy={500} r={28} fill="#B4B8C4" />
      <circle cx={1035} cy={425} r={11} fill="#B4B8C4" />
      <path d="M960 392 A 92 92 0 0 0 960 548 A 120 120 0 0 1 960 392" fill="#8E93A3" opacity={0.6} />
    </svg>
    <div style={{ position: "absolute", left: 44, top: 22, fontFamily: F.headline, fontSize: 150, lineHeight: 1.02, color: B.paper, whiteSpace: "nowrap", textShadow: "0 6px 0 rgba(3,4,15,0.55)" }}>
      THE MOON IS
      <br />
      <span style={{ color: B.gauge }}>INSIDE OUR SKY</span>
    </div>
  </AbsoluteFill>
);
