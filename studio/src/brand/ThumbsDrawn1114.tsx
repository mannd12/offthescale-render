import React from "react";
import { AbsoluteFill } from "remotion";
import { loadBrandFonts } from "./fonts";
import { B, F } from "./tokens";

loadBrandFonts();

/**
 * Drawn replacement thumbnails for the six public ladder videos (owner, 2026-11-13: change them all, then review the
 * impact). No photos; one big claim each, taken from the episode's own ladder.ts / sources.md (row noted per thumb).
 * Text stays clear of the bottom-right corner (duration badge) and ≥ 40 px from the right edge.
 */
const H: React.CSSProperties = { position: "absolute", fontFamily: F.headline, lineHeight: 1.02, whiteSpace: "nowrap" };

/** L01 Ocean: "The last fish, 8,336 m" (ladder l11). A depth column from cyan to black, one small fish near the foot. */
export const ThumbL01D: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #19C3E6 0%, #0E6FB8 22%, #0A2E6B 48%, #050B24 76%, #01020A 100%)" }}>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      {[90, 200, 310, 420, 530, 640].map((y, i) => (
        <line key={y} x1={1150} y1={y} x2={1236} y2={y} stroke="#FFFFFF" strokeWidth={i === 5 ? 12 : 6} strokeLinecap="round" opacity={i === 5 ? 1 : 0.55} />
      ))}
      <line x1={1236} y1={40} x2={1236} y2={690} stroke="#FFFFFF" strokeWidth={6} opacity={0.55} />
      <g transform="translate(880 600)">
        <ellipse cx={0} cy={0} rx={150} ry={46} fill="#F4B6C8" />
        <path d="M130 0 L 235 -52 L 215 0 L 235 52 Z" fill="#F4B6C8" />
        <path d="M-60 -40 C -10 -86, 70 -80, 110 -30 Z" fill="#E79BB3" />
        <circle cx={-96} cy={-8} r={13} fill="#01020A" />
        <circle cx={-100} cy={-12} r={4} fill="#FFFFFF" />
      </g>
      <circle cx={880} cy={600} r={250} fill="none" stroke="#FFC83D" strokeWidth={8} strokeDasharray="6 26" strokeLinecap="round" opacity={0.9} />
    </svg>
    <div style={{ ...H, left: 44, top: 28, fontSize: 250, color: B.paper, textShadow: "0 8px 0 rgba(1,2,10,0.45)" }}>8,336 M</div>
    <div style={{ ...H, left: 50, top: 300, fontSize: 132, color: B.gauge, textShadow: "0 6px 0 rgba(1,2,10,0.55)" }}>
      THE LAST
      <br />
      FISH
    </div>
  </AbsoluteFill>
);

/** L02 Deep-sea types: eight ways of living in the dark (title: 8 types; ladder l01 the lure). A lure and a mouth. */
export const ThumbL02D: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#02030C" }}>
    <div style={{ position: "absolute", left: 610, top: -30, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(140,255,230,0.95) 0%, rgba(25,195,230,0.55) 18%, rgba(25,120,230,0.18) 42%, rgba(2,3,12,0) 66%)" }} />
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <path d="M1250 560 C 1230 380, 1100 300, 930 290 C 800 284, 700 350, 690 440 L 800 470 L 700 520 C 720 640, 860 720, 1010 720 L 1280 720 L 1280 560 Z" fill="#0B1430" stroke="#1E2C5C" strokeWidth={6} />
      <path d="M700 440 L 742 500 L 770 448 L 800 506 L 832 452 L 860 508 L 890 458 Z" fill="#F2F5FF" />
      <path d="M712 522 L 746 478 L 778 530 L 812 484 L 846 536 L 880 492 L 900 540 Z" fill="#F2F5FF" />
      <circle cx={1010} cy={390} r={34} fill="#F2F5FF" />
      <circle cx={1002} cy={392} r={16} fill="#02030C" />
      <path d="M1000 296 C 990 190, 950 150, 922 256" fill="none" stroke="#1E2C5C" strokeWidth={10} strokeLinecap="round" />
      <circle cx={920} cy={280} r={30} fill="#C9FFF2" />
    </svg>
    <div style={{ ...H, left: 44, top: 30, fontSize: 280, color: B.gauge }}>8 WAYS</div>
    <div style={{ ...H, left: 50, top: 330, fontSize: 128, color: B.paper }}>
      TO LIVE IN
      <br />
      THE DARK
    </div>
  </AbsoluteFill>
);

/** L03 Speed: the fastest thing ever built, 700,000 km/h (ladder l11, Parker Solar Probe). Streaks and one probe. */
export const ThumbL03D: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(100deg, #12062E 0%, #3A0F6B 45%, #B0206B 80%, #FF7A1A 100%)" }}>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      {[
        [40, 470, 760],
        [0, 520, 900],
        [120, 575, 700],
        [60, 630, 860],
        [200, 682, 640],
      ].map(([x, y, w], i) => (
        <rect key={i} x={x} y={y} width={w} height={i % 2 ? 10 : 18} rx={9} fill="#FFFFFF" opacity={0.28 + i * 0.1} />
      ))}
      <g transform="translate(1030 560) rotate(-8)">
        <rect x={-70} y={-150} width={44} height={300} rx={6} fill="#19C3E6" stroke="#FFFFFF" strokeWidth={6} />
        <line x1={-70} y1={-75} x2={-26} y2={-75} stroke="#FFFFFF" strokeWidth={5} />
        <line x1={-70} y1={75} x2={-26} y2={75} stroke="#FFFFFF" strokeWidth={5} />
        <path d="M-150 -40 L 40 -40 L 100 -22 L 100 22 L 40 40 L -150 40 Z" fill="#F2F5FF" />
        <path d="M100 -22 L 150 -96 L 176 -96 L 176 96 L 150 96 L 100 22 Z" fill="#FFC83D" />
        <path d="M-150 -14 L -196 -30 M -150 14 L -196 30" stroke="#F2F5FF" strokeWidth={8} strokeLinecap="round" />
      </g>
    </svg>
    <div style={{ ...H, left: 44, top: 26, fontSize: 236, color: "#FFE9A8", textShadow: "0 8px 0 rgba(18,6,46,0.55)" }}>700,000</div>
    <div style={{ ...H, left: 50, top: 262, fontSize: 150, color: B.paper, textShadow: "0 6px 0 rgba(18,6,46,0.55)" }}>KM/H. WE BUILT IT.</div>
  </AbsoluteFill>
);

/** L04 Internet: the last level is the cable on the sea floor (ladder l07 revealed). Sea section, one yellow cable. */
export const ThumbL04D: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #19C3E6 0%, #0E6FB8 20%, #0A2E6B 55%, #04102E 100%)" }}>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <path d="M0 640 C 200 600, 380 660, 600 630 C 820 600, 1000 660, 1280 620 L 1280 720 L 0 720 Z" fill="#2B1F14" />
      <path d="M-20 628 C 200 588, 380 648, 600 618 C 820 588, 1000 648, 1300 608" fill="none" stroke="#FFC83D" strokeWidth={26} strokeLinecap="round" />
      <path d="M-20 628 C 200 588, 380 648, 600 618 C 820 588, 1000 648, 1300 608" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeDasharray="2 60" strokeLinecap="round" />
      {[[980, 250, 26], [1060, 330, 16], [930, 380, 12], [1120, 210, 10]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={0.6} />
      ))}
    </svg>
    <div style={{ ...H, left: 44, top: 26, fontSize: 168, color: B.paper, textShadow: "0 8px 0 rgba(4,16,46,0.5)" }}>
      THE INTERNET
      <br />
      IS <span style={{ color: B.gauge }}>DOWN HERE</span>
    </div>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <path d="M520 400 C 540 470, 560 520, 590 580 M 548 560 L 594 590 L 604 536" stroke={B.gauge} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </AbsoluteFill>
);

/** L06 Earthquakes: the open top of the ladder, "M10?" (ladder s11, the limit). A seismograph trace that leaves the paper. */
export const ThumbL06D: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(110deg, #FFF4D6 0%, #FFE08A 55%, #FFC83D 100%)" }}>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      {[470, 540, 610, 680].map((y) => (
        <line key={y} x1={0} y1={y} x2={1280} y2={y} stroke="#0B1B2B" strokeWidth={3} opacity={0.14} />
      ))}
      <path
        d="M0 600 L 120 600 L 140 588 L 160 612 L 190 580 L 220 622 L 260 560 L 300 640 L 350 520 L 400 680 L 460 440 L 520 720 L 590 330 L 660 720 L 740 190 L 820 720 L 900 60 L 980 720 L 1060 -40 L 1140 720 L 1220 -80"
        fill="none"
        stroke="#D7261E"
        strokeWidth={16}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
    <div style={{ ...H, left: 44, top: 22, fontSize: 210, color: "#0B1B2B" }}>MAGNITUDE</div>
    <div style={{ ...H, left: 44, top: 220, fontSize: 290, color: "#D7261E", textShadow: "0 8px 0 rgba(255,244,214,0.9)" }}>10?</div>
  </AbsoluteFill>
);

/** L07 Volcanoes: level 8 means 1,000+ km³ of ash (ladder s9, sources #4). A small cone under a plume that fills the sky. */
export const ThumbL07D: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #1B0B1F 0%, #4A1326 50%, #C2260E 100%)" }}>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <g fill="#6B5A66">
        <circle cx={960} cy={150} r={190} />
        <circle cx={1150} cy={210} r={170} />
        <circle cx={780} cy={230} r={150} />
        <circle cx={1010} cy={330} r={150} />
        <circle cx={1200} cy={60} r={150} />
        <circle cx={840} cy={70} r={130} />
      </g>
      <g fill="#8F7C88">
        <circle cx={930} cy={120} r={110} />
        <circle cx={1120} cy={170} r={100} />
        <circle cx={800} cy={210} r={80} />
      </g>
      <path d="M930 640 C 950 520, 960 430, 1000 400 C 1040 430, 1050 520, 1070 640 Z" fill="#6B5A66" />
      <path d="M760 720 L 930 600 L 1070 600 L 1250 720 Z" fill="#1B0B1F" />
      <path d="M930 600 L 1070 600 L 1040 632 L 960 632 Z" fill="#FFC83D" />
    </svg>
    <div style={{ ...H, left: 44, top: 26, fontSize: 250, color: "#FFE9A8", textShadow: "0 8px 0 rgba(27,11,31,0.6)" }}>LEVEL 8</div>
    <div style={{ ...H, left: 50, top: 300, fontSize: 124, color: B.paper, textShadow: "0 6px 0 rgba(27,11,31,0.6)" }}>
      1,000+ KM³
      <br />
      OF ASH
    </div>
  </AbsoluteFill>
);
