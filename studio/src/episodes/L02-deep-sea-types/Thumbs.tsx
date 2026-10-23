import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { DiverSilhouette, Tile } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { LEVELS } from "./ladder";

loadBrandFonts();

/**
 * L02 thumbnail: ladder-grid archetype (docs/THUMBNAILS.md) on the WHITE card (owner: video 2 = white).
 * At 168 px only the big text, one silhouette and a colour progression survive, so: "8 TYPES" huge,
 * eight real tiles ramping from lit to ink, the last one the coral "???", a scale figure top-left.
 */
export const ThumbL02: React.FC = () => {
  const cols = 4;
  const gap = 12;
  const gridLeft = 40;
  const tileW = Math.floor((1280 - gridLeft - 40 - gap * (cols - 1)) / cols);
  const tileH = Math.floor(tileW * 0.52);
  const gridTop = 254; // was 228: the sub-head grew, the empty bottom band absorbs it
  const tiles = LEVELS.map((l, i) => (i === 7 ? { ...l, name: "", reading: "" } : l));
  return (
    <AbsoluteFill style={{ backgroundColor: B.paper }}>
      {/* top 24 (was 14): clears the 14-px ink frame below */}
      <div style={{ position: "absolute", top: 24, left: 30, right: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: F.headline, lineHeight: 0.9, letterSpacing: 1, color: B.ink, whiteSpace: "nowrap" }}>
          {/* teaseInk: coral text on white was 3.1:1, now 5.0:1. Sub-head 74 (was 58) = ~64-px caps */}
          <div style={{ fontSize: 150, color: B.teaseInk }}>8 TYPES</div>
          <div style={{ fontSize: 74 }}>OF DEEP-SEA CREATURE</div>
        </div>
        <div style={{ padding: "8px 18px 10px", borderRadius: 16, background: B.ink, color: B.gauge, fontFamily: F.ui, fontWeight: 800, fontSize: 30, lineHeight: 1.05, textAlign: "center", transform: "rotate(-4deg)", whiteSpace: "nowrap" }}>
          REAL
          <br />
          FOOTAGE
        </div>
      </div>
      <div style={{ position: "absolute", left: gridLeft, top: gridTop, display: "grid", gridTemplateColumns: `repeat(${cols}, ${tileW}px)`, gap }}>
        {tiles.map((l, i) => {
          const depth = i / (tiles.length - 1);
          return (
            <div key={l.id} style={{ position: "relative" }}>
              {/* tile 6 re-uses the isopod still (as the episode does); its tighter crop now comes from ladder.ts (tileCrop) */}
              <Tile level={l} width={tileW} height={tileH} labelSize={l.image ? 22 : 0} />
              <div style={{ position: "absolute", inset: 0, borderRadius: Math.round(tileH * 0.09), pointerEvents: "none", background: `linear-gradient(180deg, rgba(25,195,230,${0.18 * (1 - depth)}) 0%, rgba(5,14,24,${0.6 * depth}) 58%, rgba(5,14,24,0) 82%)` }} />
            </div>
          );
        })}
      </div>
      <DiverSilhouette size={64} color={B.ink} style={{ position: "absolute", top: gridTop + tileH * 2 + gap * 2 + 6, left: 40 }} />
      <div style={{ position: "absolute", top: gridTop + tileH * 2 + gap * 2 + 20, left: 112, fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: B.ink }}>how each one survives the dark</div>
      {/* 14-px ink frame: the white card had no edge against YouTube's light feed (1.0:1) */}
      <div style={{ position: "absolute", inset: 0, border: `14px solid ${B.ink}`, boxSizing: "border-box", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/**
 * L02 thumbnail B (Test & Compare): the HERO archetype instead of the grid - one real animal, big.
 * The NOAA anglerfish (sources.md #1, asset anglerfish-lophiodes, public domain) fills the right,
 * the text adds a promise the title doesn't make: "8 WAYS TO LIVE IN THE DARK". Same white card.
 */
export const ThumbL02B: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: B.paper }}>
    <div style={{ position: "absolute", right: 0, top: 0, width: 700, height: 720, overflow: "hidden" }}>
      <Img src={staticFile("assets/anglerfish-lophiodes.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "40% 50%" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${B.paper} 0%, rgba(255,255,255,0) 22%)` }} />
    </div>
    <div style={{ position: "absolute", left: 50, top: 60, fontFamily: F.headline, lineHeight: 0.9, color: B.ink, whiteSpace: "nowrap" }}>
      {/* teaseInk: coral text on white was 3.1:1, now 5.0:1 */}
      <div style={{ fontSize: 210, color: B.teaseInk }}>8 WAYS</div>
      <div style={{ fontSize: 112 }}>TO LIVE</div>
      <div style={{ fontSize: 112 }}>IN THE DARK</div>
    </div>
    {/* was Inter 30 (21-px caps, unreadable at 168 px); now Anton 72 = ~62-px caps in the empty band under the headline */}
    <div style={{ position: "absolute", left: 54, top: 506, padding: "8px 20px 10px", borderRadius: 16, background: B.ink, color: B.gauge, fontFamily: F.headline, fontSize: 72, lineHeight: 1, letterSpacing: 1, whiteSpace: "nowrap" }}>TYPE 1 · THE LURE</div>
    <div style={{ position: "absolute", right: 40, top: 34, padding: "10px 22px 12px", borderRadius: 16, background: B.gauge, color: B.ink, fontFamily: F.ui, fontWeight: 800, fontSize: 30, transform: "rotate(-4deg)" }}>REAL FOOTAGE</div>
  </AbsoluteFill>
);
