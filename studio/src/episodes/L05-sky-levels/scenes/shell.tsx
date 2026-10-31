import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CaptionPop as KitCaptionPop, TopBar } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming } from "../../../lib/timeline";
import { Climb, Scale, SkyGauge } from "../gauge";
import { LEVELS, LEVELS_LAST, LEVELS_REVEALED, MARKS_BY_RUNG, Mark, SERIES } from "../ladder";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** linear 0-1 between two frames: slow camera creep, counters */
export const lin = (frame: number, from: number, to: number) => clamp01((frame - from) / Math.max(1, to - from));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;

/** The kit caption, narrowed so it ends left of the gauge column (x = 1400). */
export const CaptionPop: React.FC<React.ComponentProps<typeof KitCaptionPop>> = (props) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1780, height: 1080, pointerEvents: "none" }}>
    <KitCaptionPop {...props} />
  </div>
);

/** A label that must read on any picture. */
export const PillTag: React.FC<{ x: number; y: number; children: React.ReactNode; color?: string; size?: number; opacity?: number; align?: "left" | "center" | "right" }> = ({ x, y, children, color = B.paper, size = 30, opacity = 1, align = "left" }) =>
  opacity <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, opacity, padding: "4px 14px 6px", borderRadius: 12, background: "rgba(5,14,24,0.9)", fontFamily: F.ui, fontWeight: 800, fontSize: size, letterSpacing: 1, color, whiteSpace: "nowrap", transform: align === "center" ? "translateX(-50%)" : align === "right" ? "translateX(-100%)" : undefined }}>
      {children}
    </div>
  );

/** A number on a card. */
export const Card: React.FC<{ x: number; y: number; big: string; small?: string; size?: number; color?: string; ink?: string; opacity?: number }> = ({ x, y, big, small, size = 72, color = B.gauge, ink = B.ink, opacity = 1 }) =>
  opacity <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, opacity, padding: "10px 22px 12px", borderRadius: 16, background: color, color: ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
      <div style={{ fontFamily: F.headline, fontSize: size, lineHeight: 1.05, whiteSpace: "nowrap" }}>{big}</div>
      {small ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: Math.max(24, Math.round(size * 0.36)), marginTop: 4, letterSpacing: 1, whiteSpace: "nowrap" }}>{small}</div> : null}
    </div>
  );

/** A still as a layer, with the scene's own camera. contain = a square plate that must not lose its edges. */
export const Photo: React.FC<{ id: string; opacity?: number; scale?: number; origin?: string; brightness?: number; fit?: "cover" | "contain"; box?: React.CSSProperties }> = ({ id, opacity = 1, scale = 1, origin = "50% 50%", brightness = 0.85, fit = "cover", box }) =>
  opacity <= 0 ? null : (
    <div style={{ position: "absolute", inset: 0, opacity, overflow: "hidden", ...box }}>
      <Img src={staticFile(`assets/${id}.jpg`)} style={{ width: "100%", height: "100%", objectFit: fit, transform: `scale(${scale})`, transformOrigin: origin, filter: `brightness(${brightness})` }} />
    </div>
  );

/** A trimmed clip, looped for as long as the beat needs. */
export const Clip: React.FC<{ id: string; seconds: number; opacity?: number; brightness?: number; scale?: number; origin?: string }> = ({ id, seconds, opacity = 1, brightness = 0.85, scale = 1, origin = "50% 50%" }) =>
  opacity <= 0 ? null : (
    <div style={{ position: "absolute", inset: 0, opacity, overflow: "hidden" }}>
      <Loop durationInFrames={Math.round(seconds * 30) - 3}>
        <OffthreadVideo src={staticFile(`assets/${id}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, transformOrigin: origin, filter: `brightness(${brightness})` }} />
      </Loop>
    </div>
  );

export type Credit = { kind: "real" | "illustration"; source?: string };

const Chip: React.FC<Credit> = ({ kind, source }) => (
  <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 999, background: "rgba(5,14,24,0.94)", fontFamily: F.ui, fontSize: 24, color: B.paper, whiteSpace: "nowrap" }}>
    <span style={{ width: 12, height: 12, borderRadius: 6, background: kind === "real" ? B.tease : B.aqua }} />
    <span style={{ fontWeight: 800, letterSpacing: 1.5 }}>{kind === "real" ? "REAL FOOTAGE" : "ILLUSTRATION"}</span>
    {source ? <span style={{ opacity: 0.8 }}>{source}</span> : null}
  </div>
);

/**
 * L05's frame chrome only: dark ground, top bar, gauge, chips. Every picture and drawing is the scene's own (hard rule 1).
 * `credit` is what the frame is right now. `index` -1 is the cold open: no rung is current yet.
 */
export const SkyShell: React.FC<{
  t: SceneTiming;
  index: number;
  climb: Climb[];
  scale: Scale[];
  /** this rung's own marks, each from the frame its words are spoken */
  marks?: (Mark & { at: number })[];
  credit: Credit;
  /** second chip while a drawing sits on a real photo */
  drawn?: string | null;
  last?: boolean;
  /** frames before the bar, gauge and chips fade in: lets a scene open on the picture alone */
  chromeFrom?: number;
  children?: React.ReactNode;
}> = ({ t, index, climb, scale, marks = [], credit, drawn, last = false, chromeFrom = 0, children }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / t.frames);
  const tease = !last && index >= 0 && frame >= t.frames - 60;
  const lastAt = t.lines[t.lines.length - 1].at;
  const compact = Math.min(1, Math.max(0, (frame - 90) / 20)) * (1 - Math.min(1, Math.max(0, (frame - Math.max(lastAt, t.frames - 90)) / 20)));
  const chrome = chromeFrom > 0 ? clamp01((frame - chromeFrom) / 15) : 1;
  const levels = last ? LEVELS_LAST : index === LEVELS.length - 1 && !tease ? LEVELS_REVEALED : LEVELS;
  const past = MARKS_BY_RUNG.slice(0, Math.max(0, index)).flat();
  const own = marks.filter((m) => frame >= m.at);
  return (
    <AbsoluteFill style={{ background: "#02060D" }}>
      {children}
      <div style={{ opacity: chrome }}>
        {index >= 0 ? <TopBar series={SERIES} levels={levels} current={index} progress={progress} teasing={tease} compact={compact} /> : null}
        <SkyGauge frame={frame} climb={climb} scale={scale} marks={[...past, ...own]} />
        <div style={{ position: "absolute", left: 40, bottom: 36, display: "flex", gap: 12, alignItems: "center" }}>
          <Chip {...credit} />
          {drawn ? <Chip kind="illustration" source={drawn} /> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
