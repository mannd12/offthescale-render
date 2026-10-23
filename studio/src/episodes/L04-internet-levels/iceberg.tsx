import React from "react";
import { B, F } from "../../brand/tokens";
import { MYTH_LINE, WATERLINE } from "./ladder";

const LABEL_BACK: React.CSSProperties = { display: "inline-block", padding: "3px 10px", borderRadius: 8, background: "rgba(5,14,24,0.82)", textShadow: "0 1px 4px rgba(0,0,0,0.9)" };

/**
 * L04's gauge: the iceberg itself, down the right-hand column. White tip above the waterline,
 * blue below, a red dashed myth line where the web ends and the wire begins, and a "you" dot
 * that descends. `pos` is 0-1 from tip to sea floor. Labels and the readout sit to the LEFT of
 * the berg so nothing is drawn over it. `labelSize` is the WATERLINE / THE MYTH LINE type size: 18 px
 * suits the landscape long video (the default - unchanged there); the vertical Shorts pass a larger one.
 */
export const Iceberg: React.FC<{ pos: number; reading: string; sub?: string; x?: number; top?: number; height?: number; labelSize?: number }> = ({ pos, reading, sub, x = 1560, top = 240, height = 720, labelSize = 18 }) => {
  const w = 300;
  const cx = x + w * 0.62;
  const pad = 360; // room to the left for labels + readout
  const left = x - pad;
  const width = w + 60 + pad;
  const yWater = top + height * WATERLINE;
  const yMyth = top + height * MYTH_LINE;
  const yPos = top + height * Math.min(1, Math.max(0, pos));
  const labelRight = cx - 150; // absolute x where left-hand labels end
  const path = `M${cx - 40} ${top} L${cx + 40} ${top} L${cx + 120} ${top + height * 0.25} L${cx + 96} ${top + height * 0.7} L${cx} ${top + height} L${cx - 96} ${top + height * 0.7} L${cx - 120} ${top + height * 0.25} Z`;
  const rel = (ax: number) => ax - left;
  const near = (y: number) => Math.abs(yPos - y) < 95 ? 0 : 1;
  // a taller label grows upward, so its bottom stays just above its line (0 at the default 18 px)
  const labelLift = Math.round((labelSize - 18) * 1.25);
  return (
    <div style={{ position: "absolute", left, top: top - 40, width, height: height + 120, pointerEvents: "none" }}>
      <svg width={width} height={height + 120} viewBox={`${left} ${top - 40} ${width} ${height + 120}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="ice-clip">
            <path d={path} />
          </clipPath>
          <linearGradient id="ice-deep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2FD8F5" />
            <stop offset="45%" stopColor="#0B3A5E" />
            <stop offset="100%" stopColor="#03080F" />
          </linearGradient>
        </defs>
        <path d={path} fill="url(#ice-deep)" />
        <rect x={cx - 140} y={top - 40} width={280} height={yWater - top + 40} fill={B.paper} clipPath="url(#ice-clip)" />
        <path d={path} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={3} />
        {/* the waterline (across the berg only) */}
        <line x1={cx - 140} y1={yWater} x2={cx + 140} y2={yWater} stroke={B.aqua} strokeWidth={3} />
        {/* the myth line: where the web ends */}
        <line x1={cx - 140} y1={yMyth} x2={cx + 140} y2={yMyth} stroke={B.tease} strokeWidth={5} strokeDasharray="14 10" />
        {/* leader from the readout to the dot */}
        <line x1={labelRight + 6} y1={yPos} x2={cx - 14} y2={yPos} stroke={B.gauge} strokeWidth={4} />
        <circle cx={cx} cy={yPos} r={12} fill={B.gauge} stroke={B.ink} strokeWidth={3} />
      </svg>
      {/* dark backing + shadow: at 18 px these vanished over light photo plates (real-timing review 2026-09-30) */}
      <div style={{ position: "absolute", left: 0, width: rel(labelRight) - 6, top: yWater - (top - 40) - 30 - labelLift, textAlign: "right", opacity: near(yWater), fontFamily: F.ui, fontWeight: 800, fontSize: labelSize, color: B.aqua, letterSpacing: 2 }}>
        <span style={LABEL_BACK}>WATERLINE</span>
      </div>
      <div style={{ position: "absolute", left: 0, width: rel(labelRight) - 6, top: yMyth - (top - 40) - 32 - labelLift, textAlign: "right", opacity: near(yMyth), fontFamily: F.ui, fontWeight: 800, fontSize: labelSize, color: B.tease, letterSpacing: 2 }}>
        <span style={LABEL_BACK}>THE MYTH LINE</span>
      </div>
      <div style={{ position: "absolute", right: width - rel(labelRight), top: yPos - (top - 40) - 36, display: "flex", alignItems: "center" }}>
        <div style={{ padding: "8px 18px 10px", borderRadius: 14, background: B.gauge, color: B.ink, boxShadow: "0 6px 24px rgba(0,0,0,0.55)" }}>
          <div style={{ fontFamily: F.headline, fontSize: 44, lineHeight: 1, whiteSpace: "nowrap" }}>{reading}</div>
          {sub ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 18, marginTop: 2, whiteSpace: "nowrap" }}>{sub}</div> : null}
        </div>
      </div>
    </div>
  );
};
