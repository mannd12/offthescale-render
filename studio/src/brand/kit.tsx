import React from "react";
import { Img, staticFile } from "remotion";
import { B, F, Level } from "./tokens";

export const levelImage = (l: Level) => (l.image ? staticFile(`assets/${l.image}.${l.ext ?? "jpg"}`) : null);

/** One tile of the ladder: real footage + label, or the coral mystery card. */
export const Tile: React.FC<{ level: Level; width: number; height: number; state?: "past" | "current" | "future"; labelSize?: number; badge?: string; imgStyle?: React.CSSProperties }> = ({
  level,
  width,
  height,
  state = "past",
  labelSize = 0,
  badge,
  imgStyle,
}) => {
  const src = levelImage(level);
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: Math.round(height * 0.09),
        overflow: "hidden",
        background: src || level.glyph ? B.ink : B.tease,
        outline: state === "current" ? `${Math.max(3, Math.round(height * 0.05))}px solid ${B.gauge}` : "none",
        opacity: state === "future" ? 0.42 : 1,
        flex: "none",
      }}
    >
      {src ? (
        <div style={{ width: "100%", height: "100%", transform: level.tileCrop ? `scale(${level.tileCrop.scale})` : undefined, transformOrigin: level.tileCrop?.origin, filter: level.tileCrop?.brightness ? `brightness(${level.tileCrop.brightness})` : undefined }}>
          <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", ...imgStyle }} />
        </div>
      ) : level.glyph ? (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: labelSize > 0 ? labelSize * 2.6 : 0, boxSizing: "border-box", fontFamily: F.headline, fontSize: height * (labelSize > 0 ? 0.3 : 0.36), color: B.gauge, letterSpacing: 1 }}>
          {level.glyph}
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // leave room for the label when there is one
            paddingBottom: labelSize > 0 ? labelSize * 2.6 : 0,
            boxSizing: "border-box",
            fontFamily: F.headline,
            fontSize: height * (labelSize > 0 ? 0.4 : 0.5),
            color: B.paper,
          }}
        >
          ???
        </div>
      )}
      {labelSize > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: `${labelSize * 1.4}px ${labelSize * 0.6}px ${labelSize * 0.45}px`,
            background: src || level.glyph ? "linear-gradient(transparent, rgba(5,14,24,0.92))" : "transparent",
            fontFamily: F.ui,
            fontWeight: 800,
            fontSize: labelSize,
            lineHeight: 1.1,
            letterSpacing: 0.4,
            color: B.paper,
            textTransform: "uppercase",
          }}
        >
          <div>{level.name}</div>
          <div style={{ color: B.gauge, fontSize: labelSize * 0.9 }}>{level.reading}</div>
        </div>
      ) : null}
      {badge ? (
        <div style={{ position: "absolute", top: labelSize * 0.5, left: labelSize * 0.5, padding: `${labelSize * 0.2}px ${labelSize * 0.55}px`, borderRadius: labelSize, background: B.gauge, color: B.ink, fontFamily: F.ui, fontWeight: 800, fontSize: labelSize }}>
          {badge}
        </div>
      ) : null}
    </div>
  );
};

/** Title bar + tile strip with progress: where are we on the ladder, and what's still hidden. */
/** `unit` is the word the counter on the right uses - it must match the gauge ("TYPE" for a ladder of types). */
export const TopBar: React.FC<{ series: string; levels: Level[]; current: number; progress: number; teasing?: boolean; compact?: number; unit?: string }> = ({
  series,
  levels,
  current,
  progress,
  teasing = false,
  compact = 0,
  unit = "LEVEL",
}) => {
  // Viewer review (L01 #4): on a phone the 12-tile strip is noise for the whole body of a rung.
  // `compact` 0..1 collapses the tiles into a thin segmented progress bar; scenes raise it a few
  // seconds into each rung and drop it again for the hand-off to the next level.
  const tileW = 116;
  const tileH = Math.round(65 * (1 - compact) + 8 * compact);
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "22px 40px 26px", background: "linear-gradient(rgba(5,14,24,0.94) 62%, rgba(5,14,24,0))" }}>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        {/* equal-width sides keep the level name on the true centre line */}
        <div style={{ flex: 1, fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: B.gauge }}>{series}</div>
        <div style={{ flex: "none", fontFamily: F.headline, fontSize: 58, letterSpacing: 1.5, color: teasing ? B.tease : B.paper, textTransform: "uppercase" }}>
          {teasing ? "? ? ? ? ?" : levels[current].name}
        </div>
        <div style={{ flex: 1, textAlign: "right", fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: B.mute }}>
          {unit} {current + 1} <span style={{ opacity: 0.6 }}>/ {levels.length}</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 9, marginTop: 14 }}>
        {levels.map((l, i) => (
          <div key={l.id} style={{ width: tileW }}>
            <div style={{ opacity: 1 - compact, height: tileH, overflow: "hidden" }}>
              <Tile level={l} width={tileW} height={65} state={i < current ? "past" : i === current ? "current" : "future"} />
            </div>
            <div style={{ height: 6, marginTop: 7, borderRadius: 3, background: "rgba(255,255,255,0.16)" }}>
              <div style={{ height: 6, borderRadius: 3, background: B.gauge, width: `${(i < current ? 1 : i === current ? progress : 0) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Scale cue: a tiny human against something vast. Both of the biggest thumbnails in this niche
 * use one and ours had none (see docs/THUMBNAILS.md). Code-drawn so it stays ours.
 */
export const DiverSilhouette: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = "#0B1B2B", style }) => (
  // A plain standing person - the universal scale reference. Tried a diving pose twice; at
  // thumbnail size it read as someone falling over. Unmistakable beats clever.
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", ...style }}>
    <g fill={color}>
      <circle cx="50" cy="17" r="13" />
      <rect x="40" y="33" width="20" height="34" rx="9" />
      <rect x="22" y="36" width="18" height="9" rx="4.5" />
      <rect x="60" y="36" width="18" height="9" rx="4.5" />
      <rect x="40" y="63" width="9" height="30" rx="4.5" />
      <rect x="51" y="63" width="9" height="30" rx="4.5" />
    </g>
  </svg>
);

export type GaugeStop = { at: number; label: string };

/**
 * The signature: a vertical scale with evenly spaced stops (so shallow zones aren't squashed)
 * and a live pointer. `position` is 0-1 along the stops, not a physical value.
 */
export const Gauge: React.FC<{ x: number; top: number; height: number; stops: GaugeStop[]; position: number; reading: string; sub?: string }> = ({
  x,
  top,
  height,
  stops,
  position,
  reading,
  sub,
}) => (
  <div style={{ position: "absolute", left: x, top, height, width: 300 }}>
    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 12, borderRadius: 6, background: "linear-gradient(#19C3E6, #0B3A5E 45%, #050E18)", outline: "2px solid rgba(255,255,255,0.55)" }} />
    {stops.map((s) => (
      // a stop label under the readout bubble would collide with it - fade it out
      <div key={s.label} style={{ position: "absolute", right: 0, top: s.at * height - 1, display: "flex", alignItems: "center", gap: 10, transform: "translateY(-50%)", opacity: Math.abs(s.at - position) < 0.085 ? 0 : 1 }}>
        <span style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 22, color: B.paper, textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{s.label}</span>
        <span style={{ width: 26, height: 3, background: B.paper, opacity: 0.85 }} />
      </div>
    ))}
    <div style={{ position: "absolute", right: 22, top: position * height, transform: "translateY(-50%)", display: "flex", alignItems: "center" }}>
      <div style={{ padding: "8px 18px 10px", borderRadius: 14, background: B.gauge, color: B.ink, textAlign: "right", boxShadow: "0 6px 24px rgba(0,0,0,0.55)" }}>
        <div style={{ fontFamily: F.headline, fontSize: 50, lineHeight: 1 }}>{reading}</div>
        {sub ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 20, marginTop: 2, whiteSpace: "nowrap" }}>{sub}</div> : null}
      </div>
      <div style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: `20px solid ${B.gauge}` }} />
    </div>
  </div>
);

/** Punchy half-sentence pop-up. Not subtitles - one idea, a few words. */
export const CaptionPop: React.FC<{ children: React.ReactNode; bottom?: number; size?: number; color?: string }> = ({ children, bottom = 120, size = 72, color = B.gauge }) => (
  <div
    style={{
      position: "absolute",
      left: 120,
      right: 380,
      bottom,
      textAlign: "center",
      fontFamily: F.caption,
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1.12,
      color,
      WebkitTextStroke: `${Math.round(size * 0.16)}px ${B.ink}`,
      paintOrder: "stroke fill",
      textShadow: "0 8px 28px rgba(0,0,0,0.55)",
    }}
  >
    {children}
  </div>
);

/** Says the footage is real and credits the source - our trust device and the licence credit in one. */
export const CreditChip: React.FC<{ source?: string; kind?: "real" | "illustration"; left?: number; bottom?: number }> = ({ source, kind = "real", left = 40, bottom = 36 }) => (
  <div style={{ position: "absolute", left, bottom, display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 999, background: "rgba(5,14,24,0.78)", fontFamily: F.ui, fontSize: 22, color: B.paper }}>
    <span style={{ width: 12, height: 12, borderRadius: 6, background: kind === "real" ? B.tease : B.aqua }} />
    <span style={{ fontWeight: 800, letterSpacing: 1.5 }}>{kind === "real" ? "REAL FOOTAGE" : "ILLUSTRATION"}</span>
    {source ? <span style={{ opacity: 0.75 }}>{source}</span> : null}
  </div>
);

/** A label card used by diagrams: headline number + small caption. */
export const NumberCard: React.FC<{ x: number; y: number; big: string; small?: string; color?: string; ink?: string; opacity?: number; size?: number }> = ({ x, y, big, small, color = B.gauge, ink = B.ink, opacity = 1, size = 64 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity, padding: "10px 22px 12px", borderRadius: 16, background: color, color: ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
    <div style={{ fontFamily: F.headline, fontSize: size, lineHeight: 1, whiteSpace: "nowrap" }}>{big}</div>
    {small ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: Math.round(size * 0.36), marginTop: 4, letterSpacing: 1, whiteSpace: "nowrap" }}>{small}</div> : null}
  </div>
);

/** Small uppercase label with a shadow, for diagram annotations. */
export const Tag: React.FC<{ x: number; y: number; children: React.ReactNode; color?: string; size?: number; opacity?: number; align?: "left" | "center" | "right" }> = ({ x, y, children, color = B.paper, size = 30, opacity = 1, align = "left" }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity, fontFamily: F.ui, fontWeight: 800, fontSize: size, letterSpacing: 1.5, textTransform: "uppercase", color, textShadow: "0 2px 10px rgba(0,0,0,0.9)", whiteSpace: "nowrap", transform: align === "center" ? "translateX(-50%)" : align === "right" ? "translateX(-100%)" : undefined }}>
    {children}
  </div>
);
