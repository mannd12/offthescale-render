import React from "react";
import { B, F } from "../../brand/tokens";
import { fmtKm, Mark } from "./ladder";

/** One cue of the climb: from frame `at` the marker heads to `km` and the pill says `reading`. */
export type Climb = { at: number; km: number; reading: string; sub?: string };
/** One cue of the scale: from frame `at` the top of the track eases to `top` km. `say` is the pill; null = the number is not spoken yet, so none is printed. */
export type Scale = { at: number; top: number; say?: string | null };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (k: number) => 1 - Math.pow(1 - clamp01(k), 3);
/** Heights span five orders of magnitude, so they tween geometrically or the marker would jump. */
const geo = (a: number, b: number, k: number) => Math.exp(Math.log(Math.max(a, 0.05)) + (Math.log(Math.max(b, 0.05)) - Math.log(Math.max(a, 0.05))) * k);

const TRACK_X = 1852;
const TOP_Y = 250; // leaves room for the reading pill at the very top, under the range line
const BOT_Y = 960;
const H = BOT_Y - TOP_Y;

/**
 * L05's signature: L01's vertical gauge flipped, running upward. Unlike L01's it is a true linear scale, so the top
 * of the track is always a sourced height and the scale has to change at rungs 7, 8, 9 and 10: every old mark visibly
 * slides down the track, the line above the track gives the new range and a pill announces it.
 */
export const SkyGauge: React.FC<{ frame: number; climb: Climb[]; scale: Scale[]; marks: Mark[]; opacity?: number }> = ({ frame, climb, scale, marks, opacity = 1 }) => {
  let si = 0;
  scale.forEach((s, i) => {
    if (frame >= s.at) si = i;
  });
  const sNow = scale[si];
  const sPrev = scale[Math.max(0, si - 1)];
  const top = geo(sPrev.top, sNow.top, si === 0 ? 1 : easeOut((frame - sNow.at) / 45));
  let ci = 0;
  climb.forEach((c, i) => {
    if (frame >= c.at) ci = i;
  });
  const cNow = climb[ci];
  const cPrev = climb[Math.max(0, ci - 1)];
  const km = cNow.km === 0 ? 0 : geo(cPrev.km, cNow.km, ci === 0 ? 1 : easeOut((frame - cNow.at) / 30));
  const yOf = (h: number) => BOT_Y - Math.min(1, h / top) * H;
  const my = yOf(km);
  // thin the labels: highest first, keep one only if it clears the pill and the label above it; squeezed older ones drop out
  const kept: Mark[] = [];
  [...marks]
    .sort((a, b) => b.km - a.km)
    .forEach((m) => {
      const y = yOf(m.km);
      if (m.km > top * 1.001 || Math.abs(y - my) < 62) return;
      if (kept.some((k) => Math.abs(yOf(k.km) - y) < 36)) return;
      kept.push(m);
    });
  const notice = si > 0 ? clamp01((frame - sNow.at) / 8) * clamp01((sNow.at + 150 - frame) / 12) : 0;
  const scaleLine = sNow.say === null ? "SCALE CHANGING" : `SCALE: 0 TO ${fmtKm(sNow.top)} KM`;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}>
      <div style={{ position: "absolute", left: 1500, right: 0, top: 0, bottom: 0, background: "linear-gradient(90deg, rgba(5,14,24,0), rgba(5,14,24,0.72) 55%)" }} />
      {/* the track: blue to indigo to black. A colour progression only, not a claim about where the sky turns black */}
      <div style={{ position: "absolute", left: TRACK_X, top: TOP_Y, width: 16, height: H, borderRadius: 8, background: "linear-gradient(#02040A, #1B1F5E 45%, #19C3E6)", outline: "2px solid rgba(255,255,255,0.6)" }} />
      <div style={{ position: "absolute", left: TRACK_X + 4, top: my, width: 8, height: Math.max(0, BOT_Y - my), borderRadius: 4, background: B.gauge }} />
      {marks
        .filter((m) => m.km <= top * 1.001)
        .map((m) => (
          <div key={`t${m.km}`} style={{ position: "absolute", left: TRACK_X - 14, top: yOf(m.km) - 2, width: 14, height: 3, background: B.paper }} />
        ))}
      {kept.map((m) => (
        <div key={m.label} style={{ position: "absolute", right: 1920 - TRACK_X + 20, top: yOf(m.km) - 16, fontFamily: F.ui, fontWeight: 800, fontSize: 24, color: B.paper, whiteSpace: "nowrap", textShadow: "0 2px 8px rgba(0,0,0,0.95)" }}>
          {m.label}
        </div>
      ))}
      {/* the reading */}
      <div style={{ position: "absolute", right: 1920 - TRACK_X + 2, top: my, transform: "translateY(-50%)", display: "flex", alignItems: "center" }}>
        <div style={{ padding: "6px 16px 8px", borderRadius: 14, background: B.gauge, color: B.ink, textAlign: "right", boxShadow: "0 6px 24px rgba(0,0,0,0.55)" }}>
          <div style={{ fontFamily: F.headline, fontSize: 46, lineHeight: 1, whiteSpace: "nowrap" }}>{cNow.reading}</div>
          {cNow.sub ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 20, marginTop: 2, whiteSpace: "nowrap" }}>{cNow.sub}</div> : null}
        </div>
        <div style={{ width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: `16px solid ${B.gauge}` }} />
      </div>
      {/* always on: the range the track shows */}
      <div style={{ position: "absolute", right: 1920 - TRACK_X - 16, top: 160, fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: 1, color: si > 0 && frame < sNow.at + 150 ? B.gauge : B.paper, whiteSpace: "nowrap", textShadow: "0 2px 8px rgba(0,0,0,0.95)" }}>{scaleLine}</div>
      {/* the rescale says so */}
      {notice > 0 ? (
        <div style={{ position: "absolute", right: 420, top: 204, opacity: notice, padding: "8px 18px 10px", borderRadius: 12, background: B.tease, color: B.paper, fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 1, whiteSpace: "nowrap", boxShadow: "0 6px 24px rgba(0,0,0,0.55)" }}>
          {sNow.say ?? "THE GAUGE IS CHANGING SCALE"}
        </div>
      ) : null}
    </div>
  );
};
