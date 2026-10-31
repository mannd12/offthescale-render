import React from "react";
import { B, F } from "../../brand/tokens";
import { LEVELS, LOG_MAX, LOG_MIN, T, pos } from "./ladder";

const TOP = 138;
const BOT = 952;
const X = 1790; // tube centre
const W = 22;
export const gaugeY = (log: number) => BOT - pos(log) * (BOT - TOP);

/**
 * L08's signature: a thermometer on a log scale. Each mark is ten times the last, and it says so. The tube ends at
 * 4 trillion °C (#56), the last sourced point; absolute zero sits below a break because a log scale can never show it.
 */
export const Thermo: React.FC<{
  log: number;
  reading?: string;
  sub?: string;
  space?: boolean;
  you?: boolean;
  /** rungs up to this index get a dot on the tube */
  passed?: number;
  /** a highlighted span of the tube: the one machine at both ends (cold open and level 11), or a climb */
  bracket?: { from: number; to: number; color?: string; opacity?: number };
  /** the tick sweep of "each mark is ten times": 0-1 */
  sweep?: number;
  /** 0-1: a dashed line leaves the tube's top end (the ending only) */
  offTop?: number;
  frame: number;
}> = ({ log, reading = "", sub, space = false, you = false, passed = -1, bracket, sweep = 0, offTop = 0, frame }) => {
  const y = gaugeY(log);
  const ticks: number[] = [];
  for (let m = Math.ceil(LOG_MIN); m <= Math.floor(LOG_MAX); m++) ticks.push(m);
  const pillY = Math.max(208, Math.min(880, y - 44)); // 208: clears the title bar's thumbnail row
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="l08-mercury" x1="0" y1={BOT} x2="0" y2={TOP} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2B5BFF" />
            <stop offset="0.48" stopColor={B.aqua} />
            <stop offset="0.57" stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor={B.gauge} />
            <stop offset="0.85" stopColor="#FF7A45" />
            <stop offset="1" stopColor={B.tease} />
          </linearGradient>
        </defs>
        <rect x={1748} y={116} width={160} height={952} rx={18} fill="rgba(5,14,24,0.72)" />
        <rect x={X - W / 2} y={TOP} width={W} height={BOT - TOP} rx={W / 2} fill="rgba(255,255,255,0.14)" />
        <rect x={X - W / 2} y={y} width={W} height={BOT - y} rx={W / 2} fill="url(#l08-mercury)" />
        {/* every mark is 10x */}
        {ticks.map((m, i) => {
          const lit = sweep > 0 && i / ticks.length <= sweep;
          return <line key={m} x1={X - W / 2 - (lit ? 26 : 14)} y1={gaugeY(m)} x2={X - W / 2 - 3} y2={gaugeY(m)} stroke={lit ? B.gauge : "rgba(255,255,255,0.6)"} strokeWidth={lit ? 5 : 3} />;
        })}
        {/* the level's bright head, breathing so the gauge is never dead */}
        <circle cx={X} cy={y} r={15 + Math.sin(frame / 11) * 2} fill={B.paper} opacity={0.95} />
        {LEVELS.map((l, i) => (i <= passed ? <circle key={l.id} cx={X + W / 2 + 9} cy={gaugeY(l.log)} r={5} fill={B.gauge} /> : null))}
        {bracket ? <path opacity={bracket.opacity ?? 1} d={`M${X + 20} ${gaugeY(bracket.from)} h12 V${gaugeY(bracket.to)} h-12`} stroke={bracket.color ?? B.gauge} strokeWidth={6} fill="none" strokeLinecap="round" /> : null}
        {/* the break: a log scale cannot reach zero, so the floor sits below a cut */}
        <path d={`M${X - 22} 966 l14 -8 l16 12 l14 -8`} stroke={B.mute} strokeWidth={3} fill="none" />
        <line x1={X - 34} y1={986} x2={X + 34} y2={986} stroke={B.tease} strokeWidth={5} />
        {offTop > 0 ? <path d={`M${X} ${TOP - 4} V${TOP - 4 - 90 * offTop}`} stroke={B.tease} strokeWidth={6} strokeDasharray="5 6" /> : null}
      </svg>
      <div style={{ position: "absolute", left: 1752, top: 994, width: 152, textAlign: "center", fontFamily: F.ui, fontWeight: 800, fontSize: 17, lineHeight: "20px", color: B.tease, whiteSpace: "nowrap" }}>ABSOLUTE ZERO</div>
      <div style={{ position: "absolute", right: 12, top: 1020, padding: "2px 10px 4px", borderRadius: 10, background: "rgba(5,14,24,0.9)", fontFamily: F.ui, fontWeight: 800, fontSize: 24, lineHeight: "30px", color: B.gauge, whiteSpace: "nowrap" }}>each mark is 10×</div>
      {space ? <div style={{ position: "absolute", left: 1834, top: gaugeY(T.space) - 13, fontFamily: F.ui, fontWeight: 800, fontSize: 21, color: B.aqua }}>SPACE</div> : null}
      {you ? <div style={{ position: "absolute", left: 1834, top: gaugeY(T.you) - 13, fontFamily: F.ui, fontWeight: 800, fontSize: 21, color: B.paper }}>YOU</div> : null}
      {reading.trim() !== "" ? (
        <div style={{ position: "absolute", right: 192, top: pillY, padding: "7px 18px 9px", borderRadius: 14, background: B.gauge, color: B.ink, boxShadow: "0 6px 24px rgba(0,0,0,0.55)", textAlign: "right" }}>
          <div style={{ fontFamily: F.headline, fontSize: 46, lineHeight: 1, whiteSpace: "nowrap" }}>{reading}</div>
          {sub ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 22, marginTop: 3, whiteSpace: "nowrap" }}>{sub}</div> : null}
        </div>
      ) : null}
    </div>
  );
};
