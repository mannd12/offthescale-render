import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CaptionPop as KitCaptionPop, TopBar, levelImage } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { FPS, SceneTiming } from "../../../lib/timeline";
import { Speedo } from "../gauge";
import { LEVELS, LEVELS_REVEALED, PLATE_CROP, SERIES } from "../ladder";

export { NumberCard, Tag } from "../../../brand/kit";

/**
 * The kit caption, narrowed for this episode: the kit spans x 120-1540, which runs two-line
 * captions into the speedometer arc (x >= ~1450) and under its WALK label. A 1780-px-wide
 * positioning box makes the kit's `right: 380` land at x = 1400, so captions stay clear of the gauge.
 */
export const CaptionPop: React.FC<React.ComponentProps<typeof KitCaptionPop>> = (props) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1780, height: 1080, pointerEvents: "none" }}>
    <KitCaptionPop {...props} />
  </div>
);

/**
 * The credit chip, L03's copy of the kit's: same layout and wording, but a near-opaque pill (0.94, kit: 0.78)
 * because this episode's drawings (the Earth discs of rungs 9-10) run underneath it and showed through.
 */
export const CreditChip: React.FC<{ source?: string; kind?: "real" | "illustration" | "visualisation"; left?: number; bottom?: number; /** sits in a flex row instead of positioning itself */ inline?: boolean }> = ({ source, kind = "real", left = 40, bottom = 36, inline = false }) => (
  <div style={{ position: inline ? "relative" : "absolute", left: inline ? undefined : left, bottom: inline ? undefined : bottom, flex: "none", display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 999, background: "rgba(5,14,24,0.94)", fontFamily: F.ui, fontSize: 22, color: B.paper, whiteSpace: "nowrap" }}>
    <span style={{ width: 12, height: 12, borderRadius: 6, background: kind === "real" ? B.tease : kind === "illustration" ? B.aqua : B.gauge }} />
    <span style={{ fontWeight: 800, letterSpacing: 1.5 }}>{kind === "real" ? "REAL FOOTAGE" : kind === "illustration" ? "ILLUSTRATION" : "VISUALISATION"}</span>
    {source ? <span style={{ opacity: 0.75 }}>{source}</span> : null}
  </div>
);

/** The kit Tag on a dark pill, for labels that sit on bright footage (pale sky, cloud) where a text shadow is not enough. */
export const PillTag: React.FC<{ x: number; y: number; children: React.ReactNode; color?: string; size?: number; opacity?: number; align?: "left" | "center" | "right" }> = ({ x, y, children, color = B.paper, size = 30, opacity = 1, align = "left" }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity, padding: "4px 14px 6px", borderRadius: 12, background: "rgba(5,14,24,0.9)", fontFamily: F.ui, fontWeight: 800, fontSize: size, letterSpacing: 1.5, textTransform: "uppercase", color, whiteSpace: "nowrap", transform: align === "center" ? "translateX(-50%)" : align === "right" ? "translateX(-100%)" : undefined }}>
    {children}
  </div>
);

/** One pass of a looping clip; dips through dark over the seam so the restart reads as a cut, not a glitch. */
const ClipPass: React.FC<{ clip: string; loopFrames: number; scale: number; brightness: number }> = ({ clip, loopFrames, scale, brightness }) => {
  const f = useCurrentFrame(); // relative to this pass (inside <Loop>)
  const loop = Loop.useLoop();
  const fadeIn = loop && loop.iteration > 0 ? Math.min(1, f / 8) : 1;
  const fadeOut = Math.min(1, (loopFrames - 1 - f) / 8);
  const seam = 0.2 + 0.8 * Math.max(0, Math.min(fadeIn, fadeOut));
  return <OffthreadVideo src={staticFile(`assets/${clip}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: scale !== 1 ? `scale(${scale})` : undefined, filter: `brightness(${brightness * seam})` }} />;
};

/**
 * L03's frame chrome (kit, shared): plate (still or a trimmed clip), title bar with the tile
 * strip, the speedometer, the credit chip. Clips are used only where the storyboard says so -
 * stills render far cheaper, and compute is the owner's constraint.
 */
export const RungShell: React.FC<{
  t: SceneTiming;
  index: number;
  kmh: number;
  /** overrides the gauge's formatted number (e.g. "≈ 40,300 km/h") */
  reading?: string;
  sub?: string;
  /**
   * manifest image id, or {clip, seconds} for a trimmed video in public/assets/<id>.mp4. `seconds` is the
   * clip's trimmed length (manifest out - in): the clip LOOPS for the whole rung instead of freezing on its
   * last frame. `scale` crops in (e.g. 1.33 hides pillar bars baked into a 4:3 film).
   */
  plate: { image: string; ext?: "jpg" | "png" } | { clip: string; seconds: number; scale?: number } | null;
  brightness?: number;
  credit: { kind: "real" | "illustration"; source?: string } | "visualisation";
  /** a second chip, ILLUSTRATION, beside the photo credit while a drawn overlay sits on real footage */
  drawn?: { label: string; opacity?: number };
  teaseFrom?: number;
  revealAt?: number;
  /** frames before the chrome (bar, gauge, chip) fades in - lets a rung open on the picture alone */
  chromeFrom?: number;
  /** camera move on a still photo, from the scene (push in on what the line names). Replaces the default slow 8 % drift; multiplies the plate's own crop. */
  plateMove?: { scale: number; origin: string };
  children?: React.ReactNode;
}> = ({ t, index, kmh, reading, sub, plate, brightness = 0.8, credit, drawn, teaseFrom, revealAt = -1, chromeFrom = 0, plateMove, children }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / t.frames);
  const tease = frame >= (teaseFrom ?? t.frames - 75) || frame < revealAt;
  const lastAt = t.lines[t.lines.length - 1].at;
  // tiles show for the first ~3 s and again for the hand-off; collapsed in between
  const compact = Math.min(1, Math.max(0, (frame - 90) / 20)) * (1 - Math.min(1, Math.max(0, (frame - (lastAt - 20)) / 20)));
  const chrome = chromeFrom > 0 ? Math.min(1, Math.max(0, (frame - chromeFrom) / 15)) : 1;
  // the last tile is the mystery tile until its own rung names it (as L04 does)
  const levels = index === LEVELS.length - 1 && !tease ? LEVELS_REVEALED : LEVELS;
  const crop = plate && "image" in plate ? PLATE_CROP[plate.image] : undefined;
  // a few frames short of the nominal length, so a pass never runs past the clip's last frame
  const loopFrames = plate && "clip" in plate ? Math.max(30, Math.round(plate.seconds * FPS) - 3) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {plate && "clip" in plate ? (
        <Loop durationInFrames={loopFrames}>
          <ClipPass clip={plate.clip} loopFrames={loopFrames} scale={plate.scale ?? 1} brightness={brightness} />
        </Loop>
      ) : plate ? (
        <Img src={levelImage({ id: plate.image, name: "", reading: "", image: plate.image, ext: plate.ext })!} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${(crop?.scale ?? 1) * (plateMove?.scale ?? 1 + 0.08 * progress)})`, transformOrigin: plateMove?.origin ?? crop?.origin ?? "50% 45%", filter: `brightness(${brightness})` }} />
      ) : (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 40%, #1A2B3D 0%, #0B1B2B 55%, #050E18 100%)" }} />
      )}
      <AbsoluteFill style={{ background: "linear-gradient(transparent 55%, rgba(5,14,24,0.72))" }} />
      {children}
      <div style={{ opacity: chrome }}>
        <TopBar series={SERIES} levels={levels} current={index} progress={progress} teasing={tease} compact={compact} />
        <Speedo kmh={kmh} reading={reading} sub={sub} />
        <div style={{ position: "absolute", left: 40, bottom: 36, display: "flex", gap: 12, alignItems: "center" }}>
          {credit === "visualisation" ? <CreditChip inline kind="visualisation" source="NASA" /> : <CreditChip inline kind={credit.kind} source={credit.source} />}
          {drawn ? (
            <div style={{ opacity: drawn.opacity ?? 1 }}>
              <CreditChip inline kind="illustration" source={drawn.label} />
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
