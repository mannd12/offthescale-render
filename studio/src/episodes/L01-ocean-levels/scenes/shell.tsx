import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { CreditChip, Gauge, TopBar, levelImage } from "../../../brand/kit";
import { B, F, Level } from "../../../brand/tokens";
import { SceneTiming } from "../../../lib/timeline";
import { LEVELS, LEVELS_REVEALED, SERIES, STOPS, depthPos, fmtDepth, pressureSub } from "../ladder";

/**
 * The frame chrome every rung shares (allowed by hard rule 1: kit, not body): plate, top bar
 * with the tile strip, the depth gauge and the credit chip. Everything inside `children` is
 * the rung's own device.
 */
export const RungShell: React.FC<{
  t: SceneTiming;
  index: number;
  /** metres shown on the gauge at this frame */
  depth: number;
  /** real photo behind the scene, or null for an illustration on ink */
  plate: Level | null;
  brightness?: number;
  /** override the gauge subtitle (default: pressure) */
  sub?: string;
  credit: { kind: "real" | "illustration"; source?: string };
  /** frame (scene-relative) from which the title bar shows "? ? ? ? ?" - default: last line */
  teaseFrom?: number;
  /** show "? ? ? ? ?" until this frame (the approach to a reveal) */
  revealAt?: number;
  /** frames before the chrome (bar, gauge, chip) fades in - lets a rung open on the picture alone */
  chromeFrom?: number;
  /** camera move on the photo, from the scene (push in on what the line names). Default: a slow 8 % drift. */
  plateMove?: { scale: number; origin: string };
  children?: React.ReactNode;
}> = ({ t, index, depth, plate, brightness = 0.85, sub, credit, teaseFrom, revealAt = -1, chromeFrom = 0, plateMove, children }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / t.frames);
  const tease = frame >= (teaseFrom ?? t.frames - 75) || frame < revealAt;
  const lastAt = t.lines[t.lines.length - 1].at;
  // tiles show for the first ~3 s and again for the hand-off; collapsed in between
  const compact = Math.min(1, Math.max(0, (frame - 90) / 20)) * (1 - Math.min(1, Math.max(0, (frame - (lastAt - 20)) / 20)));
  const chrome = chromeFrom > 0 ? Math.min(1, Math.max(0, (frame - chromeFrom) / 15)) : 1;
  const src = plate ? levelImage(plate) : null;
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {src ? (
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${plateMove?.scale ?? 1 + 0.08 * progress})`, transformOrigin: plateMove?.origin ?? "50% 45%", filter: `brightness(${brightness})` }} />
      ) : (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 40%, #10304A 0%, #0B1B2B 55%, #050E18 100%)" }} />
      )}
      <AbsoluteFill style={{ background: "linear-gradient(transparent 55%, rgba(5,14,24,0.72))" }} />
      {children}
      <div style={{ opacity: chrome }}>
      {/* on the last rung the "???" tile opens once the bottom is revealed (final review 2026-10-01) */}
      <TopBar series={SERIES} levels={index === LEVELS.length - 1 && frame >= revealAt ? LEVELS_REVEALED : LEVELS} current={index} progress={progress} teasing={index === LEVELS.length - 1 ? frame < revealAt : tease} compact={compact} />
      <Gauge x={1580} top={250} height={700} stops={STOPS} position={depthPos(depth)} reading={fmtDepth(depth)} sub={sub ?? pressureSub(depth)} />
      <CreditChip kind={credit.kind} source={credit.source} />
      </div>
    </AbsoluteFill>
  );
};

export { NumberCard, Tag } from "../../../brand/kit";
