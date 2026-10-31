import React from "react";
import { B, F } from "../../brand/tokens";

const TOP = 262;
const STEP = 62;
/** y of the top edge of a step; level 8 is the top one */
export const stepY = (v: number) => TOP + (8 - v) * STEP;
/** each step is wider than the one below: a staircase growing out of the right edge */
export const stepW = (v: number) => 56 + v * 21;

const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const mixHex = (a: string, b: string, k: number) => {
  const [x, y] = [hex(a), hex(b)];
  return `rgb(${x.map((c, i) => Math.round(c + (y[i] - c) * k)).join(",")})`;
};
/** pale yellow at level 0, deep red at level 8 */
export const heat = (v: number) => {
  const k = Math.max(0, Math.min(1, v / 8));
  return k < 0.5 ? mixHex("#FFE9A8", B.gauge, k * 2) : mixHex(B.gauge, "#C8201A", (k - 0.5) * 2);
};

/**
 * L07's signature: a staircase of nine steps out of the right edge, lit from the bottom up. The steps are ranks, not
 * to scale. The header "ASH AND ROCK, NOT LAVA" is on it from the first frame, because that is the video's twist (#8).
 * `lit` may be fractional while a step fills. `open` draws the unsettled top on the closer (#48).
 */
export const StepGauge: React.FC<{ lit: number; reading: string; sub?: string; open?: number; x0?: number }> = ({ lit, reading, sub, open = 0 }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <div style={{ position: "absolute", right: 0, top: TOP - 74, width: 300, height: 9 * STEP + 74 + 118, background: "rgba(5,14,24,0.72)", borderRadius: "16px 0 0 16px" }} />
    <div style={{ position: "absolute", right: 14, top: TOP - 66, width: 280, textAlign: "right", fontFamily: F.ui, fontWeight: 800, fontSize: 24, lineHeight: 1.15, letterSpacing: 0.5, color: B.gauge }}>
      ASH AND ROCK,
      <br />
      NOT LAVA
    </div>
    {Array.from({ length: 9 }, (_, v) => {
      const k = Math.max(0, Math.min(1, lit + 1 - v));
      const w = stepW(v);
      return (
        <div key={v} style={{ position: "absolute", right: 14, top: stepY(v), width: w, height: STEP - 6, borderRadius: 6, background: "rgba(255,255,255,0.13)", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${k * 100}%`, background: heat(v) }} />
          <div style={{ position: "absolute", right: 12, top: 5, fontFamily: F.headline, fontSize: 36, lineHeight: "46px", color: k > 0.5 ? B.ink : B.mute }}>{v}</div>
        </div>
      );
    })}
    {open > 0 ? <div style={{ position: "absolute", right: 14, top: stepY(8) - 58 * open, width: stepW(8), height: 52 * open, overflow: "hidden", borderRadius: 6, border: `3px dashed ${B.tease}`, boxSizing: "border-box", textAlign: "center", fontFamily: F.headline, fontSize: 34, color: B.tease }}>?</div> : null}
    <div style={{ position: "absolute", right: 14, top: stepY(0) + STEP + 2, width: 280, boxSizing: "border-box", padding: "6px 12px 8px", borderRadius: 12, background: heat(Math.floor(Math.max(0, lit))), color: B.ink, textAlign: "center" }}>
      <div style={{ fontFamily: F.headline, fontSize: 38, lineHeight: 1.08, whiteSpace: "nowrap" }}>{reading}</div>
      {sub ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 20, whiteSpace: "nowrap", marginTop: 1 }}>{sub}</div> : null}
    </div>
  </div>
);
