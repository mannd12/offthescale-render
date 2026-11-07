// Print texture for the illustrated format (2026-11-05 art upgrade): the frame should read as ink on paper,
// not as a vector export. Two screen-locked layers, both procedural (SVG feTurbulence, no image files):
//  - paper: a fixed, low-frequency fibre/mottle (the sheet itself; it never moves),
//  - grain: fine tooth. STATIC by default since kit v2 (2026-11-06): a grain that re-seeded every 3 frames defeated
//    inter-frame compression and made L11's final 1.7 GB. Pass `step` (frames) to re-seed slowly (>= 60) if a shot
//    wants a faint boil; never below 30 (docs/STYLE-V2.md §9).
// Overlay blending keeps mid-grey neutral, so tones do not shift; the effect is tooth, not dirt.
import React from "react";
import { AbsoluteFill } from "remotion";

export const PaperGrain: React.FC<{ frame: number; dark?: boolean; amount?: number; step?: number }> = ({ frame, dark = false, amount = 1, step = 0 }) => {
  const seed = step > 0 ? Math.floor(frame / step) % 12 : 5;
  const grainId = `pg-grain-${seed}`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: (dark ? 0.3 : 0.26) * amount }}>
        <defs>
          <filter id="pg-paper" x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse">
            <feTurbulence type="fractalNoise" baseFrequency="0.0035 0.018" numOctaves={3} seed={7} />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="linear" slope={2.2} intercept={-0.6} />
              <feFuncG type="linear" slope={2.2} intercept={-0.6} />
              <feFuncB type="linear" slope={2.2} intercept={-0.6} />
              <feFuncA type="table" tableValues="1 1" />
            </feComponentTransfer>
          </filter>
          <filter id={grainId} x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="linear" slope={2.6} intercept={-0.8} />
              <feFuncG type="linear" slope={2.6} intercept={-0.8} />
              <feFuncB type="linear" slope={2.6} intercept={-0.8} />
              <feFuncA type="table" tableValues="1 1" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width={1920} height={1080} filter="url(#pg-paper)" opacity={0.55} />
        <rect width={1920} height={1080} filter={`url(#${grainId})`} />
      </svg>
    </AbsoluteFill>
  );
};
