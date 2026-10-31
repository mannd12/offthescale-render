import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { TopBar } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, within } from "../../../lib/timeline";
import { Tape } from "../gauge";
import { LEVELS, LEVELS_REVEALED, SERIES } from "../ladder";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lin = (f: number, a: number, b: number) => clamp01((f - a) / Math.max(1, b - a));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const win = (f: number, a: number, b: number, fade = 12) => clamp01((f - a) / fade) * clamp01((b - f) / fade);
export const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
export const fmt = (v: number) => Math.round(v).toLocaleString("en-US");

/** Frame at which `words` are spoken in this scene, by character position. A typo throws at render. */
export const at = (t: SceneTiming, words: string) => {
  for (let i = 0; i < t.lines.length; i++) {
    const k = t.lines[i].text.indexOf(words);
    if (k >= 0) return within(t, i, k / t.lines[i].text.length);
  }
  throw new Error(`cue not in ${t.id}: ${words}`);
};

export const Svg: React.FC<{ o?: number; children: React.ReactNode }> = ({ o = 1, children }) =>
  o <= 0 ? null : (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
      {children}
    </svg>
  );

export type ChipSpec = { kind: "REAL FOOTAGE" | "REAL PHOTO" | "ILLUSTRATION"; source?: string };
export const Chips: React.FC<{ chips: ChipSpec[] }> = ({ chips }) => (
  <div style={{ position: "absolute", left: 30, bottom: 30, display: "flex", gap: 10 }}>
    {chips.map((c) => (
      <div key={c.kind + (c.source ?? "")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: "rgba(5,14,24,0.94)", fontFamily: F.ui, fontSize: 20, color: B.paper, whiteSpace: "nowrap" }}>
        <span style={{ width: 12, height: 12, borderRadius: 6, background: c.kind.startsWith("REAL") ? B.tease : B.aqua }} />
        <span style={{ fontWeight: 800, letterSpacing: 1.2 }}>{c.kind}</span>
        {c.source ? <span style={{ opacity: 0.8 }}>{c.source}</span> : null}
      </div>
    ))}
  </div>
);

export const Pill: React.FC<{ x: number; y: number; children: React.ReactNode; color?: string; size?: number; o?: number; align?: "left" | "center" | "right" }> = ({ x, y, children, color = B.paper, size = 30, o = 1, align = "left" }) =>
  o <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, padding: "5px 16px 7px", borderRadius: 12, background: "rgba(5,14,24,0.92)", fontFamily: F.ui, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap", transform: align === "center" ? "translateX(-50%)" : align === "right" ? "translateX(-100%)" : undefined }}>
      {children}
    </div>
  );

export const Card: React.FC<{ x: number; y: number; big: string; small?: string; size?: number; color?: string; ink?: string; o?: number; align?: "left" | "center" }> = ({ x, y, big, small, size = 84, color = B.gauge, ink = B.ink, o = 1, align = "left" }) =>
  o <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `${align === "center" ? "translateX(-50%) " : ""}scale(${0.94 + 0.06 * o})`, padding: "10px 24px 12px", borderRadius: 16, background: color, color: ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)", textAlign: align }}>
      <div style={{ fontFamily: F.headline, fontSize: size, lineHeight: 1.05, whiteSpace: "nowrap" }}>{big}</div>
      {small ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: Math.max(24, Math.round(size * 0.32)), marginTop: 4, whiteSpace: "nowrap" }}>{small}</div> : null}
    </div>
  );

type Box = { x: number; y: number; w: number; h: number };
const wrap = (o: number, box?: Box): React.CSSProperties =>
  box ? { position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, overflow: "hidden", borderRadius: 18, opacity: o, boxShadow: "0 10px 40px rgba(0,0,0,0.6)" } : { position: "absolute", inset: 0, overflow: "hidden", opacity: o };

export const Plate: React.FC<{ id: string; from: number; to: number; s0?: number; s1?: number; o0?: [number, number]; o1?: [number, number]; bright?: number; box?: Box }> = ({ id, from, to, s0 = 1, s1 = 1.1, o0 = [50, 50], o1, bright = 0.9, box }) => {
  const f = useCurrentFrame();
  const o = (from <= 0 ? 1 : clamp01((f - from) / 12)) * clamp01((to - f) / 12);
  if (o <= 0) return null;
  const k = lin(f, from, to);
  const e = o1 ?? o0;
  return (
    <div style={wrap(o, box)}>
      <Img src={staticFile(`assets/${id}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${mix(s0, s1, k)})`, transformOrigin: `${mix(o0[0], e[0], k)}% ${mix(o0[1], e[1], k)}%`, filter: `brightness(${bright})` }} />
    </div>
  );
};

/** A real clip entered `start` frames in; loops rather than freezes if a voiced line runs long. */
export const Clip: React.FC<{ id: string; seconds: number; from: number; to: number; start?: number; bright?: number; scale?: number; origin?: string; box?: Box }> = ({ id, seconds, from, to, start = 0, bright = 0.92, scale = 1, origin = "50% 50%", box }) => {
  const f = useCurrentFrame();
  const o = (from <= 0 ? 1 : clamp01((f - from) / 10)) * clamp01((to - f) / 10);
  if (o <= 0) return null;
  const loop = Math.max(30, Math.floor(seconds * 30 - start - 3));
  return (
    <div style={wrap(o, box)}>
      <Sequence from={from} layout="none">
        <Loop durationInFrames={loop} layout="none">
          <OffthreadVideo src={staticFile(`assets/${id}.mp4`)} startFrom={start} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, transformOrigin: origin, filter: `brightness(${bright})` }} />
        </Loop>
      </Sequence>
    </div>
  );
};

/** A dark field over a picture, for drawings that need quiet behind them. */
export const Dim: React.FC<{ o: number; to?: number }> = ({ o, to = 0.82 }) => (o <= 0 ? null : <AbsoluteFill style={{ background: `rgba(5,14,24,${to * o})` }} />);

/** L10's chrome: field, the scene's body, the title bar, the tape and tank, the honest chips. */
export const RungShell: React.FC<{
  t: SceneTiming;
  index: number;
  n: number;
  reading: string;
  sub?: string;
  pct?: number;
  pctNote?: string;
  dashed?: number;
  flips?: number[];
  chips: ChipSpec[];
  children?: React.ReactNode;
}> = ({ t, index, n, reading, sub, pct, pctNote, dashed, flips = [], chips, children }) => {
  const f = useCurrentFrame();
  const progress = Math.min(1, f / t.frames);
  const tease = f >= t.frames - 22 && index < LEVELS.length - 1;
  const last = t.lines[t.lines.length - 1];
  const compact = clamp01((f - 90) / 20) * (1 - clamp01((f - (last.at + last.audioFrames - 24)) / 20));
  const flash = Math.max(0, ...flips.map((a) => (f >= a ? clamp01(1 - (f - a) / 40) : 0)));
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 42%, #1A2B3D 0%, #0B1B2B 55%, #050E18 100%)" }} />
      {children}
      <TopBar series={SERIES} levels={index === LEVELS.length - 1 ? LEVELS_REVEALED : LEVELS} current={index} progress={progress} teasing={tease} compact={compact} unit="RUNG" />
      <Tape n={n} reading={reading} sub={sub} pct={pct} pctNote={pctNote} dashed={dashed} flash={flash} />
      <Chips chips={chips} />
    </AbsoluteFill>
  );
};
