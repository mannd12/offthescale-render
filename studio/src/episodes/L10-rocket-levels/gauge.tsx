import React from "react";
import { B, F } from "../../brand/tokens";
import { BOT, TAPE_MARKS, TOP, tapeY } from "./ladder";

export const FUEL = "#FF8A3D";
const X = 1600;
const CX = 1780;
// a plain rocket body: tip just above TOP, base at BOT
const BODY = `M${CX} ${TOP - 10} C${CX + 34} ${TOP + 50} ${CX + 52} ${TOP + 110} ${CX + 52} ${TOP + 180} L${CX + 52} ${BOT - 52} L${CX + 84} ${BOT} L${CX - 84} ${BOT} L${CX - 52} ${BOT - 52} L${CX - 52} ${TOP + 180} C${CX - 52} ${TOP + 110} ${CX - 34} ${TOP + 50} ${CX} ${TOP - 10} Z`;

/**
 * L10's signature, in a right-hand column: the thrust tape (log, one mark per 10x) beside a rocket-shaped tank whose fill is
 * the share of the machine that is propellant. No row, no fill: the tank says so.
 */
export const Tape: React.FC<{ n: number; reading: string; sub?: string; pct?: number; pctNote?: string; dashed?: number; flash?: number }> = ({ n, reading, sub, pct, pctNote, dashed, flash = 0 }) => {
  const y = tapeY(n);
  const fillTop = pct === undefined ? BOT : BOT - ((BOT - TOP + 10) * pct) / 100;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 1516, top: 150, width: 390, height: 900, borderRadius: 18, background: "rgba(5,14,24,0.93)", boxShadow: `0 0 ${10 + flash * 40}px rgba(255,138,61,${0.1 + flash * 0.8})` }} />
      <div style={{ position: "absolute", left: 1532, top: 156, width: 360, fontFamily: F.headline, fontSize: 50, lineHeight: 1.05, color: B.gauge, whiteSpace: "nowrap" }}>{reading}</div>
      <div style={{ position: "absolute", left: 1532, top: 214, width: 360, fontFamily: F.ui, fontWeight: 800, fontSize: 20, color: B.paper, whiteSpace: "nowrap" }}>{sub ?? " "}</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={X} y1={BOT} x2={X} y2={TOP} stroke="rgba(255,255,255,0.22)" strokeWidth={14} />
        <line x1={X} y1={BOT} x2={X} y2={y} stroke={B.gauge} strokeWidth={14} />
        {TAPE_MARKS.map((k) => (
          <line key={k.n} x1={X - 14} y1={tapeY(k.n)} x2={X + 14} y2={tapeY(k.n)} stroke={tapeY(k.n) >= y ? B.gauge : "rgba(255,255,255,0.55)"} strokeWidth={3} />
        ))}
        {dashed ? <line x1={X} y1={y} x2={X} y2={tapeY(dashed)} stroke={B.paper} strokeWidth={8} strokeDasharray="10 10" /> : null}
        {dashed ? <path d={`M${X + 12} ${tapeY(dashed)} l22 -11 v22 z`} fill={B.paper} /> : null}
        <path d={`M${X + 12} ${y} l26 -13 v26 z`} fill={B.paper} />
        <clipPath id="l10-tank">
          <path d={BODY} />
        </clipPath>
        <rect x={CX - 90} y={fillTop} width={180} height={Math.max(0, BOT - fillTop)} fill={FUEL} clipPath="url(#l10-tank)" />
        <path d={BODY} fill="none" stroke={pct === undefined ? "rgba(255,255,255,0.45)" : B.paper} strokeWidth={4} strokeDasharray={pct === undefined ? "12 10" : undefined} />
      </svg>
      {TAPE_MARKS.filter((k) => k.label).map((k) => (
        <div key={k.n} style={{ position: "absolute", left: 1524, width: 60, top: tapeY(k.n) - 11, textAlign: "right", fontFamily: F.ui, fontWeight: 800, fontSize: 15, color: B.mute, whiteSpace: "nowrap" }}>{k.label}</div>
      ))}
      <div style={{ position: "absolute", left: CX - 90, width: 180, top: 560, textAlign: "center", fontFamily: F.headline, fontSize: pct === undefined ? 28 : 54, lineHeight: 1.05, color: pct === undefined ? B.mute : B.paper, textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{pct === undefined ? "NO FIGURE" : `~${Math.round(pct)}%`}</div>
      <div style={{ position: "absolute", left: 1532, top: 932, fontFamily: F.ui, fontWeight: 800, fontSize: 17, color: B.gauge, whiteSpace: "nowrap" }}>THRUST · EACH MARK IS 10×</div>
      <div style={{ position: "absolute", left: 1532, top: 958, fontFamily: F.ui, fontWeight: 800, fontSize: 17, color: FUEL, whiteSpace: "nowrap" }}>TANK · SHARE THAT IS FUEL</div>
      <div style={{ position: "absolute", left: 1532, top: 988, width: 360, fontFamily: F.ui, fontWeight: 700, fontSize: 17, color: B.paper, whiteSpace: "nowrap" }}>{pctNote ?? " "}</div>
    </div>
  );
};
