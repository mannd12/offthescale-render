import React from "react";
import { B, F } from "../../brand/tokens";
import { C_KMH, LEVELS, fmtKmh, speedPos, walkSub } from "./ladder";

/**
 * L03's signature: a speedometer arc, logarithmic from a walk to c, with the twelve rungs as
 * ticks and the walker's dot pinned at rung 1 so every later speed is measured against it.
 * Sits in the same right-hand column the ocean gauge used (x ≈ 1540-1880).
 */
export const Speedo: React.FC<{ kmh: number; /** overrides the formatted number, e.g. "≈ 40,300 km/h" */ reading?: string; sub?: string; cx?: number; cy?: number; r?: number }> = ({ kmh, reading, sub, cx = 1700, cy = 640, r = 240 }) => {
  const a0 = Math.PI * 1.25; // arc from 225° to -45° (clockwise, 270° sweep)
  const sweep = Math.PI * 1.5;
  const at = (p: number) => a0 - p * sweep;
  const pt = (p: number, rr: number) => [cx + Math.cos(at(p)) * rr, cy - Math.sin(at(p)) * rr] as const;
  const pos = speedPos(kmh);
  const arc = (from: number, to: number, rr: number) => {
    const [x1, y1] = pt(from, rr);
    const [x2, y2] = pt(to, rr);
    const large = (to - from) * sweep > Math.PI ? 1 : 0;
    return `M${x1} ${y1} A${rr} ${rr} 0 ${large} 1 ${x2} ${y2}`;
  };
  const [nx, ny] = pt(pos, r - 10);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* dark backing so the dial and its labels hold up over bright footage (review pass 1, A14) */}
        <circle cx={cx} cy={cy} r={r + 92} fill="rgba(5,14,24,0.55)" />
        <path d={arc(0, 1, r)} stroke="rgba(255,255,255,0.18)" strokeWidth={16} fill="none" strokeLinecap="round" />
        <path d={arc(0, pos, r)} stroke={B.gauge} strokeWidth={16} fill="none" strokeLinecap="round" />
        {LEVELS.map((l) => {
          const p = speedPos(l.kmh);
          const [x1, y1] = pt(p, r + 14);
          const [x2, y2] = pt(p, r + 30);
          return <line key={l.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke={p <= pos ? B.gauge : "rgba(255,255,255,0.45)"} strokeWidth={4} />;
        })}
        {/* the needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={B.paper} strokeWidth={6} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={14} fill={B.paper} />
        {/* the walker's dot, pinned at rung 1 */}
        <circle cx={pt(speedPos(5), r)[0]} cy={pt(speedPos(5), r)[1]} r={9} fill={B.aqua} stroke={B.ink} strokeWidth={3} />
        {/* c at the end of the track */}
        <circle cx={pt(1, r)[0]} cy={pt(1, r)[1]} r={9} fill={B.tease} stroke={B.ink} strokeWidth={3} />
      </svg>
      {/* a blank reading (the cold open's last flash: level 12 is still "???") hides the pill instead of drawing it empty */}
      <div style={{ position: "absolute", left: cx - 170, top: cy + 20, width: 340, textAlign: "center", visibility: reading !== undefined && reading.trim() === "" ? "hidden" : undefined }}>
        <div style={{ display: "inline-block", padding: "8px 18px 10px", borderRadius: 14, background: B.gauge, color: B.ink, boxShadow: "0 6px 24px rgba(0,0,0,0.55)" }}>
          <div style={{ fontFamily: F.headline, fontSize: 48, lineHeight: 1, whiteSpace: "nowrap" }}>{reading ?? fmtKmh(kmh)}</div>
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 18, marginTop: 2, whiteSpace: "nowrap" }}>{sub ?? walkSub(kmh)}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: pt(0, r + 62)[0] - 40, top: pt(0, r + 62)[1] - 12, fontFamily: F.ui, fontWeight: 800, fontSize: 18, color: B.aqua, letterSpacing: 1 }}>WALK</div>
      {/* at cx 1700 the r+62 point is x ≈ 1914 - pull the label in so it clears the frame edge (right edge ≈ 1893) */}
      <div style={{ position: "absolute", left: pt(1, r + 62)[0] - 36, top: pt(1, r + 62)[1] - 12, fontFamily: F.headline, fontSize: 26, color: B.tease }}>c</div>
      <div style={{ position: "absolute", left: cx - 60, top: cy + r + 30, width: 120, textAlign: "center", fontFamily: F.ui, fontWeight: 800, fontSize: 14, letterSpacing: 2, color: B.mute }}>LOG SCALE</div>
    </div>
  );
};
