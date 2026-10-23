import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 eased ramp starting at `start`. */
export const ease = (frame: number, start: number, dur = 18) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

/** 0→1→0 window: in at `start`, out by `end`. */
export const windowed = (frame: number, start: number, end: number, fade = 12) =>
  Math.min(ease(frame, start, fade), 1 - ease(frame, end - fade, fade));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Springy 0→1 pop starting at `start`. */
export const usePop = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (start: number, damping = 14) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
};

/** Scene wrapper: background, fade in/out, and a small section kicker top-left. */
export const SceneShell: React.FC<{ frames: number; kicker?: string; children: React.ReactNode }> = ({
  frames,
  kicker,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = windowed(frame, 0, frames, 10);
  return (
    <AbsoluteFill style={{ opacity, fontFamily: FONT.sans, color: C.text }}>
      {kicker ? (
        <div
          style={{
            position: "absolute",
            top: 84,
            left: 96,
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: C.dim,
            opacity: ease(frame, 4),
          }}
        >
          {kicker}
        </div>
      ) : null}
      {children}
    </AbsoluteFill>
  );
};

export const Chip: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  filled?: boolean;
  style?: React.CSSProperties;
}> = ({ children, color = C.cyan, size = 44, filled = false, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT.mono,
      fontSize: size,
      lineHeight: 1,
      padding: `${size * 0.32}px ${size * 0.42}px`,
      borderRadius: size * 0.28,
      border: `3px solid ${color}`,
      background: filled ? color : `${color}1f`,
      color: filled ? C.bg : C.text,
      whiteSpace: "pre",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Centered caption-style statement used for key takeaways. */
export const Statement: React.FC<{ children: React.ReactNode; y?: number; size?: number; opacity?: number; color?: string }> = ({
  children,
  y = 880,
  size = 46,
  opacity = 1,
  color = C.text,
}) => (
  <div
    style={{
      position: "absolute",
      top: y,
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: size,
      fontWeight: 600,
      color,
      opacity,
    }}
  >
    {children}
  </div>
);

export const Footnote: React.FC<{ children: React.ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => (
  <div style={{ position: "absolute", bottom: 78, right: 96, fontSize: 22, color: C.dim, opacity, fontStyle: "italic" }}>
    {children}
  </div>
);

/** The host: a ring of dots that breathes, and pulses while narration is playing. */
export const Orb: React.FC<{ x: number; y: number; r: number; speaking: boolean; opacity?: number }> = ({
  x,
  y,
  r,
  speaking,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const voice = speaking ? 0.5 + 0.5 * Math.abs(Math.sin(frame * 0.41) * Math.sin(frame * 0.17 + 1)) : 0.15;
  const dots = 28;
  return (
    <svg
      style={{ position: "absolute", left: x - r * 2, top: y - r * 2, opacity, overflow: "visible" }}
      width={r * 4}
      height={r * 4}
      viewBox={`${-r * 2} ${-r * 2} ${r * 4} ${r * 4}`}
    >
      <circle r={r * (0.62 + voice * 0.12)} fill={C.cyan} opacity={0.14} />
      <circle r={r * 0.34} fill={C.cyan} opacity={0.9} />
      {Array.from({ length: dots }, (_, i) => {
        const a = (i / dots) * Math.PI * 2 + frame * 0.012;
        const wobble = 1 + voice * 0.22 * Math.sin(i * 1.7 + frame * 0.35);
        return (
          <circle
            key={i}
            cx={Math.cos(a) * r * wobble}
            cy={Math.sin(a) * r * wobble}
            r={r * 0.055}
            fill={i % 4 === 0 ? C.amber : C.cyan}
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
};

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 400) * 8;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1200px 800px at ${50 + drift}% 38%, ${C.bg2} 0%, ${C.bg} 70%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line}22 1px, transparent 1px), linear-gradient(90deg, ${C.line}22 1px, transparent 1px)`,
          backgroundSize: "96px 96px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 78%)",
        }}
      />
    </AbsoluteFill>
  );
};
