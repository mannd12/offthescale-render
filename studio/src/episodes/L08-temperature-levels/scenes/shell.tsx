import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CaptionPop as KitCaptionPop, TopBar } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, within } from "../../../lib/timeline";
import { Thermo } from "../gauge";
import { LEVELS, LEVELS_REVEALED, SERIES } from "../ladder";

export { Tag } from "../../../brand/kit";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lin = (frame: number, from: number, to: number) => clamp01((frame - from) / Math.max(1, to - from));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** Frame at which `words` are spoken in line i, by character position; survives re-voicing. A typo throws at render, on purpose. */
export const cue = (t: SceneTiming, i: number, words: string) => {
  const text = t.lines[i].text;
  const at = text.indexOf(words);
  if (at < 0) throw new Error(`cue not in ${t.id} line ${i}: ${words}`);
  return within(t, i, at / text.length);
};

/** The kit caption, kept left of the thermometer's reading pill (ends at x = 1400). */
export const Caption: React.FC<React.ComponentProps<typeof KitCaptionPop>> = (props) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1780, height: 1080, pointerEvents: "none" }}>
    <KitCaptionPop {...props} />
  </div>
);

export type ChipSpec = { kind: "REAL FOOTAGE" | "ILLUSTRATION" | "VISUALISATION" | "FALSE COLOUR" | "OTHER MACHINE" | "SATELLITE COMPOSITE" | "REAL IMAGES"; source?: string };
const DOT: Record<ChipSpec["kind"], string> = { "REAL FOOTAGE": B.tease, "REAL IMAGES": B.tease, ILLUSTRATION: B.aqua, VISUALISATION: B.gauge, "FALSE COLOUR": B.gauge, "OTHER MACHINE": B.gauge, "SATELLITE COMPOSITE": B.gauge };

export const Chip: React.FC<ChipSpec> = ({ kind, source }) => (
  <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 12, padding: "9px 18px", borderRadius: 999, background: "rgba(5,14,24,0.94)", fontFamily: F.ui, fontSize: 21, color: B.paper, whiteSpace: "nowrap" }}>
    <span style={{ width: 12, height: 12, borderRadius: 6, background: DOT[kind] }} />
    <span style={{ fontWeight: 800, letterSpacing: 1.3 }}>{kind}</span>
    {source ? <span style={{ opacity: 0.8 }}>{source}</span> : null}
  </div>
);

export const Chips: React.FC<{ chips: ChipSpec[] }> = ({ chips }) => (
  <div style={{ position: "absolute", left: 40, bottom: 30, display: "flex", gap: 10 }}>
    {chips.map((c) => (
      <Chip key={c.kind + (c.source ?? "")} {...c} />
    ))}
  </div>
);

/** A dark pill for a label that must hold up on a picture; says what the picture is, from its first frame. */
export const Pill: React.FC<{ x: number; y: number; children: React.ReactNode; color?: string; size?: number; opacity?: number; align?: "left" | "center" | "right" }> = ({ x, y, children, color = B.paper, size = 28, opacity = 1, align = "left" }) =>
  opacity <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, opacity, padding: "4px 14px 6px", borderRadius: 12, background: "rgba(5,14,24,0.9)", fontFamily: F.ui, fontWeight: 800, fontSize: size, letterSpacing: 0.6, color, whiteSpace: "nowrap", transform: align === "center" ? "translateX(-50%)" : align === "right" ? "translateX(-100%)" : undefined }}>
      {children}
    </div>
  );

/** The headline card. */
export const Card: React.FC<{ x: number; y: number; big: string; small?: string; size?: number; color?: string; ink?: string; opacity?: number }> = ({ x, y, big, small, size = 76, color = B.gauge, ink = B.ink, opacity = 1 }) =>
  opacity <= 0 ? null : (
    <div style={{ position: "absolute", left: x, top: y, opacity, padding: "10px 22px 12px", borderRadius: 16, background: color, color: ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
      <div style={{ fontFamily: F.headline, fontSize: size, lineHeight: 1.04, whiteSpace: "nowrap" }}>{big}</div>
      {small ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: Math.max(24, Math.round(size * 0.34)), marginTop: 4, whiteSpace: "nowrap" }}>{small}</div> : null}
    </div>
  );

type Box = { x: number; y: number; w: number; h: number };
const frameStyle = (op: number, box?: Box): React.CSSProperties =>
  box ? { position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: 18, overflow: "hidden", opacity: op, boxShadow: "0 10px 40px rgba(0,0,0,0.6)" } : { position: "absolute", inset: 0, overflow: "hidden", opacity: op };

/** A still with a real camera move between two states, fading on its window. */
export const Plate: React.FC<{ id: string; ext?: "jpg" | "png"; from: number; to: number; s0?: number; s1?: number; o0?: [number, number]; o1?: [number, number]; bright?: number; fade?: number; box?: Box }> = ({ id, ext = "jpg", from, to, s0 = 1, s1 = 1.1, o0 = [50, 50], o1, bright = 0.85, fade = 12, box }) => {
  const f = useCurrentFrame();
  const op = (from <= 0 ? 1 : clamp01((f - from) / fade)) * clamp01((to - f) / fade);
  if (op <= 0) return null;
  const k = lin(f, from, to);
  const oe = o1 ?? o0;
  return (
    <div style={frameStyle(op, box)}>
      <Img src={staticFile(`assets/${id}.${ext}`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${mix(s0, s1, k)})`, transformOrigin: `${mix(o0[0], oe[0], k)}% ${mix(o0[1], oe[1], k)}%`, filter: `brightness(${bright})` }} />
    </div>
  );
};

/** A real clip on a window, entered at `start` frames (past its fade-in); loops rather than freezes if a voiced line runs long. */
export const Clip: React.FC<{ id: string; seconds: number; from: number; to: number; start?: number; bright?: number; scale?: number; origin?: string; fade?: number; box?: Box; fit?: "cover" | "contain" }> = ({ id, seconds, from, to, start = 60, bright = 0.85, scale = 1, origin = "50% 50%", fade = 12, box, fit = "cover" }) => {
  const f = useCurrentFrame();
  const op = (from <= 0 ? 1 : clamp01((f - from) / fade)) * clamp01((to - f) / fade);
  if (op <= 0) return null;
  const loopFrames = Math.max(30, Math.round(seconds * 30) - start - 3);
  return (
    <div style={frameStyle(op, box)}>
      <Sequence from={from} layout="none">
        <Loop durationInFrames={loopFrames} layout="none">
          <OffthreadVideo src={staticFile(`assets/${id}.mp4`)} startFrom={start} muted style={{ width: "100%", height: "100%", objectFit: fit, transform: `scale(${scale})`, transformOrigin: origin, filter: `brightness(${bright})` }} />
        </Loop>
      </Sequence>
    </div>
  );
};

/** L08's chrome: dark field, the scene's body, the title bar, the thermometer, the honest chips. */
export const RungShell: React.FC<{
  t: SceneTiming;
  index: number;
  log: number;
  reading?: string;
  sub?: string;
  chips: ChipSpec[];
  bracket?: React.ComponentProps<typeof Thermo>["bracket"];
  children?: React.ReactNode;
}> = ({ t, index, log, reading, sub, chips, bracket, children }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / t.frames);
  const tease = frame >= t.frames - 22 && index < LEVELS.length - 1;
  const last = t.lines[t.lines.length - 1];
  const compact = clamp01((frame - 90) / 20) * (1 - clamp01((frame - (last.at + last.audioFrames - 24)) / 20));
  const levels = index === LEVELS.length - 1 ? LEVELS_REVEALED : LEVELS;
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 45%, #16293C 0%, #0B1B2B 55%, #050E18 100%)" }} />
      {children}
      <TopBar series={SERIES} levels={levels} current={index} progress={progress} teasing={tease} compact={compact} />
      <Thermo log={log} reading={reading} sub={sub} space={index >= 1} you passed={index} bracket={bracket} frame={frame} />
      <Chips chips={chips} />
    </AbsoluteFill>
  );
};
