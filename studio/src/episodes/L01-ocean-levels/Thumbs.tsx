import React from "react";
import { AbsoluteFill } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { DiverSilhouette, Tile } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { LEVELS } from "./ladder";

loadBrandFonts();

/**
 * L01 thumbnail A: the yellow ladder card (owner: yellow on video 1), built from the EPISODE'S OWN twelve
 * levels. Replaces `brand-thumb-b`, which was drawn from the early brand-kit level list (2026-09-20) and
 * showed tiles the finished video doesn't have - "Undersea lake", "Sixgill ray", "Eyes without eyes",
 * "Robot explorer" - plus a wrong "Midnight zone 3,900 m" (the video says 1,000 m). YouTube's thumbnail
 * policy (Help 2801973) and our accuracy gate both require the thumbnail to show what the video shows
 * (docs/RESEARCH-ALGORITHM-2026-09.md). Same design: a cyan -> black depth ramp across the tiles and a
 * scale figure, which is what survives at 168 px (docs/THUMBNAILS.md). Tile 12 stays "???" - the video
 * reveals the bottom last.
 */
export const ThumbL01: React.FC<{ labels?: boolean }> = ({ labels = true }) => {
  const cols = 4;
  const gap = 12;
  const gridLeft = 118;
  const tileW = Math.floor((1280 - gridLeft - 28 - gap * (cols - 1)) / cols);
  const tileH = Math.floor(tileW * 0.62);
  const ink = B.ink;
  return (
    <AbsoluteFill style={{ backgroundColor: B.gauge }}>
      <div style={{ position: "absolute", top: 14, left: 30, right: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: F.headline, fontSize: 97, lineHeight: 1, letterSpacing: 1, color: ink, whiteSpace: "nowrap" }}>EVERY LEVEL OF THE OCEAN</div>
        <div style={{ padding: "8px 18px 10px", borderRadius: 16, background: B.ink, color: B.gauge, fontFamily: F.ui, fontWeight: 800, fontSize: 30, lineHeight: 1.05, textAlign: "center", transform: "rotate(-4deg)" }}>
          REAL
          <br />
          FOOTAGE
        </div>
      </div>
      {/* the gauge as an arrow down the left edge, a person at the surface for scale */}
      <div style={{ position: "absolute", left: 30, top: 150, bottom: 30, width: 64 }}>
        <div style={{ position: "absolute", left: 22, top: 34, bottom: 46, width: 20, borderRadius: 10, background: "linear-gradient(#19C3E6, #0B3A5E 50%, #050E18)" }} />
        <div style={{ position: "absolute", left: 6, bottom: 8, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "44px solid #050E18" }} />
        <DiverSilhouette size={40} color={ink} style={{ position: "absolute", top: -4, left: 12 }} />
      </div>
      <div style={{ position: "absolute", left: gridLeft, top: 150, display: "grid", gridTemplateColumns: `repeat(${cols}, ${tileW}px)`, gap }}>
        {LEVELS.map((l, i) => {
          const depth = i / (LEVELS.length - 1);
          return (
            <div key={l.id} style={{ position: "relative" }}>
              <Tile level={l} width={tileW} height={tileH} labelSize={labels ? 19 : 0} badge={i === 0 ? "YOU ARE HERE" : undefined} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: Math.round(tileH * 0.09),
                  pointerEvents: "none",
                  background: `linear-gradient(180deg, rgba(25,195,230,${0.18 * (1 - depth)}) 0%, rgba(5,14,24,${0.72 * depth}) 58%, rgba(5,14,24,0) 82%)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/**
 * L01 thumbnail C (2026-09-30, docs/research-deep-2026-09/02): the same yellow ladder card without the twelve
 * 14-px tile labels. Unreadable text still pulls the eye (Wang & Pomplun 2012) and gives nothing back at feed
 * size; the depth ramp, "YOU ARE HERE" and the "???" tile carry the idea. Owner picks A or C.
 */
export const ThumbL01C: React.FC = () => <ThumbL01 labels={false} />;
