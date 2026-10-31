import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { CaptionPop as KitCaption, TopBar } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { EnergyColumn } from "../gauge";
import { LEVELS, SERIES, TNT } from "../ladder";

export { Tag } from "../../../brand/kit";
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lin = (f: number, a: number, b: number) => clamp01((f - a) / Math.max(1, b - a));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
/** fade in at a, out by b */
export const span = (f: number, a: number, b: number, fade = 10) => ease(f, a, fade) * (1 - ease(f, b - fade, fade));

/** The kit caption boxed to x 320-1840, clear of the column on the left (kit: left 120, right 380). */
export const Caption: React.FC<React.ComponentProps<typeof KitCaption>> = (p) => (
  <div style={{ position: "absolute", left: 200, top: 0, width: 2020, height: 1080, pointerEvents: "none" }}>
    <KitCaption {...p} />
  </div>
);

export const PillTag: React.FC<{ x: number; y: number; children: React.ReactNode; color?: string; size?: number; opacity?: number; align?: "left" | "center" | "right" }> = ({ x, y, children, color = B.paper, size = 28, opacity = 1, align = "left" }) =>
  opacity <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, opacity, padding: "4px 14px 6px", borderRadius: 12, background: "rgba(5,14,24,0.9)", fontFamily: F.ui, fontWeight: 800, fontSize: size, letterSpacing: 1, color, whiteSpace: "nowrap", transform: align === "center" ? "translateX(-50%)" : align === "right" ? "translateX(-100%)" : undefined }}>
      {children}
    </div>
  );

/** Headline number on a card, shown from its cue only. */
export const Big: React.FC<{ x: number; y: number; big: string; small?: string; opacity?: number; size?: number; color?: string; ink?: string }> = ({ x, y, big, small, opacity = 1, size = 84, color = B.gauge, ink = B.ink }) =>
  opacity <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, opacity, padding: "10px 24px 12px", borderRadius: 16, background: color, color: ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
      <div style={{ fontFamily: F.headline, fontSize: size, lineHeight: 1.05, whiteSpace: "nowrap" }}>{big}</div>
      {small ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: Math.max(26, Math.round(size * 0.36)), marginTop: 2, letterSpacing: 0.5, whiteSpace: "nowrap" }}>{small}</div> : null}
    </div>
  );

/** A photo layer with its own eased camera: frames a-b, scale s0-s1, origin travelling (percent). */
export const Photo: React.FC<{ id: string; opacity?: number; a?: number; b?: number; s0?: number; s1?: number; o0?: [number, number]; o1?: [number, number]; pos?: string; brightness?: number }> = ({ id, opacity = 1, a = 0, b = 300, s0 = 1, s1 = 1.1, o0 = [50, 50], o1, pos = "50% 50%", brightness = 0.82 }) => {
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

/** A photo too small to fill the frame (PROCESS stage 2), framed, with a slow creep inside the frame. */
export const Inset: React.FC<{ id: string; x: number; y: number; w: number; h: number; opacity?: number; a?: number; b?: number; s0?: number; s1?: number; pos?: string; origin?: string }> = ({ id, x, y, w, h, opacity = 1, a = 0, b = 300, s0 = 1, s1 = 1.08, pos = "50% 50%", origin = "50% 50%" }) => {
  const f = useCurrentFrame();
  if (opacity <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity, overflow: "hidden", borderRadius: 10, border: `4px solid ${B.paper}`, boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
      <Img src={staticFile(`assets/${id}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${mix(s0, s1, lin(f, a, b))})`, transformOrigin: origin }} />
    </div>
  );
};

const Chip: React.FC<{ kind: "real" | "illustration"; source?: string }> = ({ kind, source }) => (
  <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 12, padding: "9px 18px", borderRadius: 999, background: "rgba(5,14,24,0.94)", fontFamily: F.ui, fontSize: 22, color: B.paper, whiteSpace: "nowrap" }}>
    <span style={{ width: 12, height: 12, borderRadius: 6, background: kind === "real" ? B.tease : B.aqua }} />
    <span style={{ fontWeight: 800, letterSpacing: 1.5 }}>{kind === "real" ? "REAL FOOTAGE" : "ILLUSTRATION"}</span>
    {source ? <span style={{ opacity: 0.8 }}>{source}</span> : null}
  </div>
);

export type Credit = { kind: "real" | "illustration"; source?: string };

/** Chrome only (column, top bar, chips): every scene body draws its own picture underneath. */
export const QuakeShell: React.FC<{ t: SceneTiming; index: number; prevM: number; m: number; reading?: string; sub?: string; subTop?: string; credit: Credit; title?: string; children?: React.ReactNode }> = ({ t, index, prevM, m, reading, sub, subTop, credit, title, children }) => {
  const f = useCurrentFrame();
  const gm = mix(prevM, m, ease(f, 0, 26));
  const compact = clamp01((f - 90) / 20) * (1 - clamp01((f - (t.frames - 50)) / 20));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 42%, #1A2B3D 0%, #0B1B2B 55%, #050E18 100%)" }}>
      {children}
      <TopBar series={SERIES} levels={title ? LEVELS.map((l, i) => (i === index ? { ...l, name: title } : l)) : LEVELS} current={index} progress={clamp01(f / t.frames)} compact={compact} />
      <EnergyColumn m={gm} reading={reading ?? `M${m}`} sub={sub ?? TNT[String(m)] ?? ""} subTop={subTop} />
      <div style={{ position: "absolute", left: 100, bottom: 30, display: "flex", gap: 10 }}>
        <Chip {...credit} />
      </div>
    </AbsoluteFill>
  );
};
