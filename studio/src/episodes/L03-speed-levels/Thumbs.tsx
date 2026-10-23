import React from "react";
import { AbsoluteFill } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { DiverSilhouette } from "../../brand/kit";
import { B, F } from "../../brand/tokens";

loadBrandFonts();

/**
 * L03 thumbnail: hero archetype on the YELLOW card (owner: alternate colours; video 3 = yellow).
 * One silhouette at the left, a speedometer arc sweeping to a glowing "c", and text that adds to
 * the title instead of repeating it: WALK → LIGHT.
 */
export const ThumbL03: React.FC = () => {
  // centre moved up-left (was 900, 430) so the enlarged "c" disc clears the duration badge zone
  const cx = 850;
  const cy = 370;
  const r = 250;
  const a0 = Math.PI * 1.25;
  const sweep = Math.PI * 1.5;
  const pt = (p: number, rr: number) => [cx + Math.cos(a0 - p * sweep) * rr, cy - Math.sin(a0 - p * sweep) * rr] as const;
  const arc = (from: number, to: number, rr: number) => {
    const [x1, y1] = pt(from, rr);
    const [x2, y2] = pt(to, rr);
    return `M${x1} ${y1} A${rr} ${rr} 0 ${(to - from) * sweep > Math.PI ? 1 : 0} 1 ${x2} ${y2}`;
  };
  const [nx, ny] = pt(0.97, r - 14);
  return (
    <AbsoluteFill style={{ backgroundColor: B.gauge }}>
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        <path d={arc(0, 1, r)} stroke="rgba(11,27,43,0.18)" strokeWidth={34} fill="none" strokeLinecap="round" />
        <path d={arc(0, 0.97, r)} stroke={B.ink} strokeWidth={34} fill="none" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={B.tease} strokeWidth={14} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={26} fill={B.ink} />
        {/* "c" disc: 140 px (was 80) with a 10-px ink ring - coral alone was 2.0:1 against the yellow */}
        <circle cx={pt(1, r)[0]} cy={pt(1, r)[1]} r={88} fill={B.tease} opacity={0.35} />
        <circle cx={pt(1, r)[0]} cy={pt(1, r)[1]} r={70} fill={B.tease} stroke={B.ink} strokeWidth={10} />
      </svg>
      <div style={{ position: "absolute", left: pt(1, r)[0] - 70, top: pt(1, r)[1] - 70, width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.headline, fontSize: 124, lineHeight: 1, color: B.paper, paddingBottom: 30, boxSizing: "border-box" }}>c</div>
      <DiverSilhouette size={150} color={B.ink} style={{ position: "absolute", left: 70, top: 420 }} />
      <div style={{ position: "absolute", left: 60, top: 572, fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: B.ink, letterSpacing: 2 }}>YOU · 5 KM/H</div>
      <div style={{ position: "absolute", left: 60, top: 40, fontFamily: F.headline, fontSize: 176, lineHeight: 0.92, color: B.ink, whiteSpace: "nowrap" }}>
        WALK
        <br />
        <svg width={110} height={90} viewBox="0 0 110 90" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 10 }}>
          <path d="M6 45 H88 M60 14 L94 45 L60 76" stroke={B.ink} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        LIGHT
      </div>
      <div style={{ position: "absolute", right: 40, top: 34, padding: "10px 22px 12px", borderRadius: 16, background: B.ink, color: B.gauge, fontFamily: F.ui, fontWeight: 800, fontSize: 30, transform: "rotate(-4deg)" }}>REAL FOOTAGE</div>
    </AbsoluteFill>
  );
};

/**
 * L03 thumbnail B (Test & Compare): the NUMBER-CONTRAST archetype - your speed against the limit.
 * 5 km/h (sources.md #1, walking) vs 1,079,252,849 km/h (#16: c = 299,792,458 m/s × 3.6). The long
 * number is the point: at 168 px it reads as "absurdly big" even when the digits don't. Yellow card.
 */
export const ThumbL03B: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: B.gauge }}>
    <DiverSilhouette size={120} color={B.ink} style={{ position: "absolute", left: 60, top: 70 }} />
    <div style={{ position: "absolute", left: 200, top: 58, fontFamily: F.headline, fontSize: 150, lineHeight: 1, color: B.ink, whiteSpace: "nowrap" }}>5 km/h</div>
    <div style={{ position: "absolute", left: 206, top: 214, fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: B.ink }}>YOU, WALKING</div>
    <svg width={1280} height={120} style={{ position: "absolute", left: 0, top: 256 }}>
      <path d="M70 60 H1170 M1120 18 L1176 60 L1120 102" stroke={B.ink} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div style={{ position: "absolute", left: 40, right: 40, top: 376, padding: "14px 26px 18px", borderRadius: 20, background: B.ink }}>
      {/* the unit was a 27-px line under the number; it now sits beside it at the number's size (~113-px caps),
          and the rest of the line is Anton 72 (~62-px caps). Same words, same number. */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 34, fontFamily: F.headline, fontSize: 132, lineHeight: 1, whiteSpace: "nowrap" }}>
        <span style={{ color: B.paper }}>1,079,252,849</span>
        <span style={{ color: B.gauge }}>KM/H</span>
      </div>
      <div style={{ fontFamily: F.headline, fontSize: 72, lineHeight: 1, letterSpacing: 1, color: B.gauge, marginTop: 8, whiteSpace: "nowrap" }}>LIGHT · THE LAST LEVEL</div>
    </div>
    <div style={{ position: "absolute", right: 40, top: 34, padding: "10px 22px 12px", borderRadius: 16, background: B.ink, color: B.gauge, fontFamily: F.ui, fontWeight: 800, fontSize: 30, transform: "rotate(-4deg)" }}>12 LEVELS</div>
  </AbsoluteFill>
);
