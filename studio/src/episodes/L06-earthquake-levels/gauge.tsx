import React from "react";
import { useCurrentFrame } from "remotion";
import { B, F } from "../../brand/tokens";

/** Height of a magnitude on the column. Each tick is 32 times the energy (#1), so the column is linear in M. */
export const yOf = (m: number) => 940 - (m - 1) * (770 / 9);
export const LAST_SOURCED = 9.5;

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const mixHex = (a: string, b: string, k: number) => {
  const [x, y] = [hex(a), hex(b)];
  return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], k))).join(",")})`;
};
/** cool at the bottom, red at the top */
export const heat = (m: number) => {
  const k = Math.max(0, Math.min(1, (m - 1) / 8.5));
  return k < 0.5 ? mixHex(B.aqua, B.gauge, k * 2) : mixHex(B.gauge, B.tease, (k - 0.5) * 2);
};

/** a live seismograph line; `amp` in px. Sum of incommensurate sines, so it never visibly loops. */
export const tracePath = (frame: number, x0: number, w: number, y: number, amp: number, step = 4) => {
  let d = `M${x0} ${y}`;
  for (let x = 0; x <= w; x += step) {
    const u = x + frame * 6;
    const v = Math.sin(u * 0.17) * 0.5 + Math.sin(u * 0.41 + 1.3) * 0.3 + Math.sin(u * 0.073 + 0.5) * 0.2;
    d += ` L${x0 + x} ${(y + v * amp).toFixed(1)}`;
  }
  return d;
};

/**
 * L06's signature: an energy column up the LEFT edge, cool to red, every tick worth 32 times. Solid only to the last
 * sourced reading (9.5); from there to 10 it is dashed, because no known fault can do it (#54). The pill carries a
 * live trace that grows with the reading, so the instrument is always visibly listening.
 */
export const EnergyColumn: React.FC<{ m: number; reading: string; sub: string; subTop?: string }> = ({ m, reading, sub, subTop = "ABOUT" }) => {
  const frame = useCurrentFrame();
  const X = 54;
  const W = 18;
  const fillTop = yOf(Math.min(m, LAST_SOURCED));
  const pillTop = Math.max(122, Math.min(yOf(m) - 62, 866));
  const amp = 2 + Math.max(0, m) * 1.2;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="l06heat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={B.tease} />
            <stop offset="0.5" stopColor={B.gauge} />
            <stop offset="1" stopColor={B.aqua} />
          </linearGradient>
          <clipPath id="l06fill">
            <rect x={X} y={fillTop} width={W} height={940 - fillTop + 2} />
          </clipPath>
        </defs>
        <rect x={0} y={150} width={92} height={812} fill="rgba(5,14,24,0.72)" />
        <rect x={X} y={yOf(LAST_SOURCED)} width={W} height={940 - yOf(LAST_SOURCED)} rx={4} fill="rgba(255,255,255,0.14)" />
        <rect x={X} y={yOf(LAST_SOURCED)} width={W} height={940 - yOf(LAST_SOURCED)} rx={4} fill="url(#l06heat)" clipPath="url(#l06fill)" />
        <rect x={X + 1} y={yOf(10)} width={W - 2} height={yOf(LAST_SOURCED) - yOf(10) - 3} fill="none" stroke={B.tease} strokeWidth={2.5} strokeDasharray="6 5" />
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
          <line key={v} x1={X - 6} x2={X + W} y1={yOf(v)} y2={yOf(v)} stroke={v <= m ? B.paper : "rgba(255,255,255,0.4)"} strokeWidth={3} />
        ))}
        <path d={`M${X + W + 2} ${yOf(m)} l14 -10 v20 z`} fill={B.paper} />
      </svg>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
        <div key={v} style={{ position: "absolute", left: 14, width: 28, top: yOf(v) - 15, textAlign: "right", fontFamily: F.headline, fontSize: 25, lineHeight: "30px", color: v <= m ? B.paper : B.mute }}>{v}</div>
      ))}
      <div style={{ position: "absolute", left: 10, width: 34, top: yOf(10) - 15, textAlign: "right", fontFamily: F.headline, fontSize: 25, lineHeight: "30px", color: B.tease }}>10</div>
      <div style={{ position: "absolute", left: 90, top: pillTop, width: 188, padding: "6px 12px 8px", borderRadius: 14, background: heat(m), color: B.ink, boxShadow: "0 6px 24px rgba(0,0,0,0.55)", boxSizing: "border-box" }}>
        <div style={{ fontFamily: F.headline, fontSize: 46, lineHeight: 1.05, whiteSpace: "nowrap" }}>{reading}</div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 14, letterSpacing: 1.5, marginTop: 1 }}>{subTop}</div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 22, whiteSpace: "nowrap", lineHeight: 1.1 }}>{sub}</div>
        <svg width={164} height={28} style={{ display: "block", marginTop: 2 }}>
          <path d={tracePath(frame, 0, 164, 14, Math.min(12, amp))} stroke={B.ink} strokeWidth={2} fill="none" />
        </svg>
      </div>
    </div>
  );
};
