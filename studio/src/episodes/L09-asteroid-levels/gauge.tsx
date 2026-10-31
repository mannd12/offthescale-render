import React from "react";
import { B, F } from "../../brand/tokens";
import { LEVELS, RULER_MARKS, rulerX } from "./ladder";

const Y = 1006;

/**
 * L09's signature: a ruler along the foot of the frame, logarithmic, one tick per 10x, stopping dead at Ceres.
 * A rung that is a range (Tunguska, #21 #24; sand to pea, #9) shows a band instead of a point.
 */
export const Ruler: React.FC<{ m: number; band?: [number, number]; passed: number; opacity?: number; pulse?: number }> = ({ m, band, passed, opacity = 1, pulse = 0 }) => {
  const x = rulerX(m);
  const end = rulerX(9.52e5);
  return (
    <div style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 962, bottom: 0, background: "rgba(5,14,24,0.94)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={rulerX(1e-4)} y1={Y} x2={end} y2={Y} stroke="rgba(255,255,255,0.25)" strokeWidth={8} strokeLinecap="round" />
        <line x1={rulerX(1e-4)} y1={Y} x2={band ? rulerX(band[0]) : x} y2={Y} stroke={B.gauge} strokeWidth={8} strokeLinecap="round" />
        {band ? <line x1={rulerX(band[0])} y1={Y} x2={rulerX(band[1])} y2={Y} stroke={B.aqua} strokeWidth={22} strokeLinecap="round" /> : null}
        {RULER_MARKS.map((k) => (
          <line key={k.label} x1={rulerX(k.m)} y1={Y - 12} x2={rulerX(k.m)} y2={Y + 12} stroke={rulerX(k.m) <= x ? B.gauge : "rgba(255,255,255,0.55)"} strokeWidth={3 + pulse * 3} />
        ))}
        <line x1={end} y1={Y - 18} x2={end} y2={Y + 18} stroke={B.tease} strokeWidth={6} />
        {LEVELS.slice(0, passed).map((l) => (
          <circle key={l.id} cx={rulerX(l.m)} cy={Y} r={7} fill={B.paper} stroke={B.ink} strokeWidth={2} />
        ))}
        {band ? null : <path d={`M${x} ${Y - 12} l-15 -26 h30 z`} fill={B.paper} />}
      </svg>
      {RULER_MARKS.map((k) => (
        <div key={k.label} style={{ position: "absolute", left: rulerX(k.m) - 60, width: 120, top: 1030, textAlign: "center", fontFamily: F.ui, fontWeight: 800, fontSize: 21, color: B.mute, whiteSpace: "nowrap" }}>
          {k.label}
        </div>
      ))}
      <div style={{ position: "absolute", right: 20, top: 1030, fontFamily: F.ui, fontWeight: 800, fontSize: 21, color: B.tease, whiteSpace: "nowrap" }}>952 km</div>
      <div style={{ position: "absolute", left: 70, top: 968, fontFamily: F.ui, fontWeight: 800, fontSize: 17, letterSpacing: 1.5, color: B.gauge, whiteSpace: "nowrap" }}>EACH MARK IS 10×</div>
    </div>
  );
};

/** The instrument plate above the ruler: the reading, then the two lines the video is about. */
export const Readout: React.FC<{ reading: string; sub?: string; craft?: string; made?: string; flash?: number; opacity?: number }> = ({ reading, sub, craft, made, flash = 0, opacity = 1 }) => {
  const row = (k: string, v: string | undefined) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 8, fontFamily: F.ui, fontWeight: 800, fontSize: 21, whiteSpace: "nowrap" }}>
      <span style={{ color: B.mute, letterSpacing: 1 }}>{k}</span>
      <span style={{ color: v ? B.aqua : "rgba(255,255,255,0.35)" }}>{v ?? "—"}</span>
    </div>
  );
  return (
    <div style={{ position: "absolute", right: 30, bottom: 128, width: 400, boxSizing: "border-box", opacity, padding: "12px 20px 16px", borderRadius: 16, background: "rgba(5,14,24,0.94)", boxShadow: `0 0 ${10 + flash * 40}px rgba(25,195,230,${0.15 + flash * 0.8})`, border: `2px solid rgba(25,195,230,${0.25 + flash * 0.75})` }}>
      <div style={{ fontFamily: F.headline, fontSize: 52, lineHeight: 1.08, color: B.gauge, whiteSpace: "nowrap" }}>{reading}</div>
      {sub ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 20, color: B.paper, whiteSpace: "nowrap" }}>{sub}</div> : null}
      {row("SPACECRAFT", craft)}
      {row("MADE OF", made)}
    </div>
  );
};
