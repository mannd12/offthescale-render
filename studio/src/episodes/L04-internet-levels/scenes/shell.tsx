import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { CaptionPop, CreditChip, TopBar, levelImage } from "../../../brand/kit";
import { B } from "../../../brand/tokens";
import { SceneTiming } from "../../../lib/timeline";
import { Iceberg } from "../iceberg";
import { ICE_POS, LEVELS, LEVELS_REVEALED, SERIES } from "../ladder";

export { NumberCard, Tag } from "../../../brand/kit";

/**
 * A CaptionPop whose text box ends at x = `right` (default 1340) instead of the kit's 1540, so a caption
 * never runs under the iceberg gauge's readout chip (x ≈ 1350-1600). The kit's CaptionPop is absolute with
 * left 120 / right 380; narrowing its containing block moves that right edge without touching the kit.
 */
export const NarrowCaption: React.FC<{ opacity: number; right?: number; bottom?: number; size?: number; color?: string; children: React.ReactNode }> = ({ opacity, right = 1340, bottom, size, color, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: right + 380, height: 1080, opacity }}>
    <CaptionPop bottom={bottom} size={size} color={color}>{children}</CaptionPop>
  </div>
);

/** L04's chrome: plate (or drawn field), title bar with the seven tiles, the iceberg gauge, the credit chip. */
export const RungShell: React.FC<{
  t: SceneTiming;
  /** tile index 0-6, or -1 for the myth line / cold open (title bar shows the tease) */
  index: number;
  sceneId: string;
  reading: string;
  sub?: string;
  plate: { image: string; ext?: "jpg" | "png" } | null;
  brightness?: number;
  credit: { kind: "real" | "illustration"; source?: string };
  chromeFrom?: number;
  revealAt?: number;
  /** the level bar shows every level so far as complete (myth line: 3 of 7) */
  done?: boolean;
  children?: React.ReactNode;
}> = ({ t, index, sceneId, reading, sub, plate, brightness = 0.7, credit, chromeFrom = 0, revealAt = -1, done = false, children }) => {
  const frame = useCurrentFrame();
  const progress = done ? 1 : Math.min(1, frame / t.frames);
  const lastAt = t.lines[t.lines.length - 1].at;
  // the end-of-level teaser points at the next hidden tile; on the last rung there is none (narration: "the bottom")
  const last = index === LEVELS.length - 1;
  const tease = index < 0 || done || (!last && frame >= t.frames - 75) || frame < revealAt;
  const compact = Math.min(1, Math.max(0, (frame - 90) / 20)) * (1 - Math.min(1, Math.max(0, (frame - (lastAt - 20)) / 20)));
  const chrome = chromeFrom > 0 ? Math.min(1, Math.max(0, (frame - chromeFrom) / 15)) : 1;
  // the dot slides from the previous scene's position to this one's over the first 2 s
  const order = Object.keys(ICE_POS);
  const i = order.indexOf(sceneId);
  const from = i > 0 ? ICE_POS[order[i - 1]] : 0;
  const pos = from + (ICE_POS[sceneId] - from) * Math.min(1, frame / 60);
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {plate ? (
        <Img src={levelImage({ id: plate.image, name: "", reading: "", image: plate.image, ext: plate.ext })!} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.08 * progress})`, transformOrigin: "50% 45%", filter: `brightness(${brightness})` }} />
      ) : (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 40%, #12263A 0%, #0B1B2B 55%, #050E18 100%)" }} />
      )}
      <AbsoluteFill style={{ background: "linear-gradient(transparent 55%, rgba(5,14,24,0.72))" }} />
      {children}
      <div style={{ opacity: chrome }}>
        <TopBar series={SERIES} levels={tease ? LEVELS : LEVELS_REVEALED} current={Math.max(0, index)} progress={progress} teasing={tease} compact={compact} />
        <Iceberg pos={pos} reading={reading} sub={sub} />
        <CreditChip kind={credit.kind} source={credit.source} />
      </div>
    </AbsoluteFill>
  );
};
