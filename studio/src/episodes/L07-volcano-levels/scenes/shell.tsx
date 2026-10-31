import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CaptionPop as KitCaption, Tag, TopBar } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { StepGauge } from "../gauge";
import { LEVELS, LEVELS_COLD, SERIES } from "../ladder";

export { Tag };
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lin = (f: number, a: number, b: number) => clamp01((f - a) / Math.max(1, b - a));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
/** fade in at a, out by b */
export const span = (f: number, a: number, b: number, fade = 10) => ease(f, a, fade) * (1 - ease(f, b - fade, fade));

/** The kit caption boxed to end at x 1540, left of the staircase (kit: left 120, right 380). */
export const Caption: React.FC<React.ComponentProps<typeof KitCaption>> = (p) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, pointerEvents: "none" }}>
    <KitCaption {...p} />
  </div>
);

export const Pill: React.FC<{ x: number; y: number; children: React.ReactNode; color?: string; size?: number; opacity?: number; align?: "left" | "center" | "right" }> = ({ x, y, children, color = B.paper, size = 28, opacity = 1, align = "left" }) =>
  opacity <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, opacity, padding: "5px 14px 7px", borderRadius: 12, background: "rgba(5,14,24,0.92)", fontFamily: F.ui, fontWeight: 800, fontSize: size, letterSpacing: 0.5, color, whiteSpace: "nowrap", transform: align === "center" ? "translateX(-50%)" : align === "right" ? "translateX(-100%)" : undefined }}>
      {children}
    </div>
  );

/** A number on a card, from its cue only. */
export const Big: React.FC<{ x: number; y: number; big: string; small?: string; opacity?: number; size?: number; color?: string; ink?: string }> = ({ x, y, big, small, opacity = 1, size = 84, color = B.gauge, ink = B.ink }) =>
  opacity <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, opacity, padding: "10px 24px 12px", borderRadius: 16, background: color, color: ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
      <div style={{ fontFamily: F.headline, fontSize: size, lineHeight: 1.05, whiteSpace: "nowrap" }}>{big}</div>
      {small ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: Math.max(26, Math.round(size * 0.36)), marginTop: 2, whiteSpace: "nowrap" }}>{small}</div> : null}
    </div>
  );

/** A photo with an eased camera over frames a-b; origin travels o0 to o1 (percent). */
export const Photo: React.FC<{ id: string; opacity?: number; a?: number; b?: number; s0?: number; s1?: number; o0?: [number, number]; o1?: [number, number]; pos?: string; brightness?: number }> = ({ id, opacity = 1, a = 0, b = 300, s0 = 1, s1 = 1.1, o0 = [50, 50], o1, pos = "50% 50%", brightness = 0.85 }) => {
  const f = useCurrentFrame();
  if (opacity <= 0) return null;
  const k = lin(f, a, b);
  const e = k * k * (3 - 2 * k);
  const to = o1 ?? o0;
  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <Img src={staticFile(`assets/${id}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${mix(s0, s1, e)})`, transformOrigin: `${mix(o0[0], to[0], e)}% ${mix(o0[1], to[1], e)}%`, filter: `brightness(${brightness})` }} />
    </AbsoluteFill>
  );
};

/** A photo too small for the full frame (PROCESS stage 2), framed, creeping. */
export const Inset: React.FC<{ id: string; x: number; y: number; w: number; h: number; opacity?: number; a?: number; b?: number; s0?: number; s1?: number; pos?: string; origin?: string }> = ({ id, x, y, w, h, opacity = 1, a = 0, b = 300, s0 = 1, s1 = 1.08, pos = "50% 50%", origin = "50% 50%" }) => {
  const f = useCurrentFrame();
  if (opacity <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity, overflow: "hidden", borderRadius: 10, border: `4px solid ${B.paper}`, boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
      <Img src={staticFile(`assets/${id}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${mix(s0, s1, lin(f, a, b))})`, transformOrigin: origin }} />
    </div>
  );
};

/** A trimmed clip, looped. No box = full frame; a box = a framed panel for a source under 1,400 px. */
export const Clip: React.FC<{ id: string; seconds: number; opacity?: number; brightness?: number; scale?: number; origin?: string; box?: { x: number; y: number; w: number; h: number } }> = ({ id, seconds, opacity = 1, brightness = 0.92, scale = 1, origin = "50% 50%", box }) =>
  opacity <= 0 ? null : (
    <div style={box ? { position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, opacity, overflow: "hidden", borderRadius: 10, border: `4px solid ${B.paper}`, boxShadow: "0 12px 40px rgba(0,0,0,0.6)" } : { position: "absolute", inset: 0, opacity, overflow: "hidden" }}>
      <Loop durationInFrames={Math.round(seconds * 30) - 3}>
        <OffthreadVideo src={staticFile(`assets/${id}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, transformOrigin: origin, filter: `brightness(${brightness})` }} />
      </Loop>
    </div>
  );

export type Credit = { kind: "real" | "illustration"; source?: string };

const Chip: React.FC<Credit> = ({ kind, source }) => (
  <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 12, padding: "9px 18px", borderRadius: 999, background: "rgba(5,14,24,0.94)", fontFamily: F.ui, fontSize: 22, color: B.paper, whiteSpace: "nowrap" }}>
    <span style={{ width: 12, height: 12, borderRadius: 6, background: kind === "real" ? B.tease : B.aqua }} />
    <span style={{ fontWeight: 800, letterSpacing: 1.5 }}>{kind === "real" ? "REAL FOOTAGE" : "ILLUSTRATION"}</span>
    {source ? <span style={{ opacity: 0.8 }}>{source}</span> : null}
  </div>
);

/** Chrome only (top bar, staircase, credit chip): every scene body draws its own picture underneath. */
export const VolcanoShell: React.FC<{ t: SceneTiming; index: number; lit: number; prevLit?: number; reading?: string; sub?: string; open?: number; cold?: boolean; credit: Credit; children?: React.ReactNode }> = ({ t, index, lit, prevLit, reading, sub, open = 0, cold = false, credit, children }) => {
  const f = useCurrentFrame();
  const g = prevLit === undefined ? lit : mix(prevLit, lit, ease(f, 0, 26));
  const compact = clamp01((f - 90) / 20) * (1 - clamp01((f - (t.frames - 50)) / 20));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 42%, #2A1F1C 0%, #14171F 55%, #050E18 100%)" }}>
      {children}
      <TopBar series={SERIES} levels={cold ? LEVELS_COLD : LEVELS} current={index} progress={clamp01(f / t.frames)} compact={compact} unit="STEP" />
      <StepGauge lit={g} reading={reading ?? LEVELS[index].reading} sub={sub ?? LEVELS[index].sub} open={open} />
      <div style={{ position: "absolute", left: 40, bottom: 28 }}>
        <Chip {...credit} />
      </div>
    </AbsoluteFill>
  );
};
