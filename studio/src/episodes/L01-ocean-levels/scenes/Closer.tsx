import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { CaptionPop, CreditChip, Gauge, Tile, levelImage } from "../../../brand/kit";
import { B, F, Level } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { LEVELS, STOPS, depthPos, fmtDepth, pressureSub } from "../ladder";

// The recap is after the reveal: Level 12's tile is the Trieste on 23 January 1960 (NH 96797), not the "???" card.
// (ladder.ts keeps image: null so the strip stays a mystery during levels 1-11.)
const RECAP: Level[] = LEVELS.map((l, i) => (i === LEVELS.length - 1 ? { ...l, image: "trieste-1960" } : l));

const COLS = 4;
const TILE = { w: 322, h: 196, gap: 24 };

/**
 * The gauge stays at the bottom while the twelve tiles light up in step with the recap, and only rewinds to
 * the surface on "that roof we started on?" - so "eleven kilometres down" is never said over a 0 m gauge.
 *  0 "Twelve levels. A sunlit skin ... Gardens that never needed the Sun."
 *  1 "And eleven kilometres down ... small animals getting on with their lives."
 *  2 "... only about twenty-nine per cent of the sea floor has ever been properly mapped." (#31: 28.7 %)
 *  3 "So — that roof we started on?"   4 "Most of what's under it is still a blank space on the map."
 *  5 "Next: the animals that actually live down here ..."
 */
export const Closer: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const startAt = lineAt(t, 0);
  const deepAt = lineAt(t, 1);
  const darkAt = within(t, 1, 0.32); // "...in permanent darkness"
  const animalsAt = within(t, 1, 0.55); // "small animals getting on with their lives"
  const partAt = lineAt(t, 2); // "And here's the part that keeps oceanographers up at night."
  const stackAt = within(t, 2, 0.34); // "Of that entire eleven-kilometre stack"
  const mappedAt = within(t, 2, 0.62); // "...only about twenty-nine per cent"
  const roofAt = lineAt(t, 3);
  const blankAt = lineAt(t, 4);
  const nextAt = lineAt(t, 5);
  const typeAt = within(t, 5, 0.4); // "every type of deep-sea creature"
  const trickAt = within(t, 5, 0.68); // "and the trick each one uses to survive"

  const rewind = ease(frame, roofAt, 60);
  const depth = 10935 * (1 - rewind);
  const recapVis = ease(frame, startAt, 12) * (1 - ease(frame, mappedAt - 10, 10));
  const mapped = ease(frame, mappedAt, 12) * (1 - ease(frame, nextAt, 10));

  // when each tile lights: the phrase that names it, with the levels in between swept on the way down
  const litAt = [
    within(t, 0, 0.09), // "A sunlit skin we all know."
    within(t, 0, 0.25), // "A twilight of animals that hide by glowing."
    within(t, 0, 0.38),
    within(t, 0, 0.51), // "A nightly migration bigger than anything on land."
    within(t, 0, 0.7),
    within(t, 0, 0.8), // "Gardens that never needed the Sun."
    deepAt, // "And eleven kilometres down..." - 7 to 11 go by on the way to the bottom
    deepAt + 6,
    deepAt + 12,
    deepAt + 18,
    deepAt + 24,
    deepAt + 36, // the bottom
  ];
  // Motion pass 2026-10-01: the grid used to freeze for ten seconds once the twelfth tile was lit.
  // "Of that entire eleven-kilometre stack": the outline runs down all twelve again, four frames a tile.
  const WAVE = 4;
  const waving = frame >= stackAt && frame < stackAt + WAVE * RECAP.length;
  const current = waving ? Math.floor((frame - stackAt) / WAVE) : litAt.reduce((acc, at, i) => (frame >= at ? i : acc), -1);
  // "in permanent darkness": the other eleven go dark and the bottom stands alone; they come back on "here's the part"
  const dark = ease(frame, darkAt, 14) * (1 - ease(frame, partAt, 14));
  // a short swell on the tile a phrase points at
  const pop = (at: number) => ease(frame, at, 6) * (1 - ease(frame, at + 8, 14));
  // the roof drifts in slowly once it is back, so the last twenty seconds never sit on a still photo
  const roofScale = 1 + 0.1 * Math.min(1, Math.max(0, (frame - roofAt) / (t.frames - roofAt)));
  // "still a blank space on the map": the blank part of the bar answers
  const blank = ease(frame, blankAt, 10) * (1 - ease(frame, nextAt, 10));

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {/* the dark of the bottom, until the rewind brings the roof back */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 40%, #10304A 0%, #0B1B2B 55%, #050E18 100%)" }} />
      <Img src={levelImage(LEVELS[0])!} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: rewind, filter: "brightness(0.85)", transform: `scale(${roofScale})`, transformOrigin: "55% 40%" }} />
      <AbsoluteFill style={{ background: "linear-gradient(rgba(5,14,24,0.5), transparent 40%, rgba(5,14,24,0.75))" }} />

      {/* recap: the twelve tiles, each lighting as the narration reaches it */}
      <div style={{ position: "absolute", top: 190, left: 140, display: "grid", gridTemplateColumns: `repeat(${COLS}, ${TILE.w}px)`, gap: TILE.gap, opacity: recapVis }}>
        {RECAP.map((l, i) => {
          const last = i === RECAP.length - 1;
          const lit = ease(frame, litAt[i], 10) * (last ? 1 : 1 - dark);
          // each picture pushes in slowly from the moment it lights; the tile swells when its phrase lands
          const zoom = 1 + 0.12 * Math.min(1, Math.max(0, (frame - litAt[i]) / 240));
          const swell = 1 + Math.max(0.04 * pop(stackAt + i * WAVE), last ? 0.06 * pop(animalsAt) : 0);
          return (
            <div key={l.id} style={{ opacity: ease(frame, startAt + i * 3, 8) * (0.3 + 0.7 * lit), transform: `scale(${swell})` }}>
              <Tile level={l} width={TILE.w} height={TILE.h} labelSize={24} badge={String(i + 1)} state={i === current ? "current" : "past"} imgStyle={{ transform: `scale(${zoom})` }} />
            </div>
          );
        })}
      </div>

      {/* 29 % mapped (#31): the number on a dark panel, the sea floor as a bar that is mostly blank */}
      <div style={{ position: "absolute", left: 160, top: 360, width: 1300, boxSizing: "border-box", padding: "26px 40px 36px", borderRadius: 28, background: "rgba(5,14,24,0.86)", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", opacity: mapped }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 26, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: F.headline, fontSize: 128, lineHeight: 1.05, color: B.gauge }}>≈ 29 %</span>
          <span style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 40, color: B.paper }}>of the sea floor has been mapped</span>
        </div>
        <div style={{ position: "relative", marginTop: 20, height: 60, borderRadius: 30, background: "rgba(255,255,255,0.1)", outline: "3px solid rgba(255,255,255,0.6)", overflow: "hidden" }}>
          <div style={{ width: `${29 * ease(frame, mappedAt + 6, 30)}%`, height: "100%", background: B.gauge }} />
          <div style={{ position: "absolute", left: "29%", right: 0, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 1, color: B.paper, opacity: ease(frame, mappedAt + 30, 10), background: `rgba(255,255,255,${blank * (0.14 + 0.08 * Math.sin(frame / 7))})` }}>the rest is blank</div>
        </div>
      </div>
      <div style={{ opacity: ease(frame, blankAt, 10) * (1 - ease(frame, nextAt, 8)) }}>
        <CaptionPop bottom={150} size={90} color={B.paper}>
          still a <span style={{ color: B.gauge }}>blank space</span> on the map
        </CaptionPop>
      </div>

      {/* the gauge leaves with the last line: the right strip and lower-right stay clear for YouTube's end-screen elements */}
      <div style={{ opacity: 1 - ease(frame, nextAt, 12) }}>
        <Gauge x={1580} top={250} height={700} stops={STOPS} position={depthPos(depth)} reading={fmtDepth(depth)} sub={pressureSub(depth)} />
      </div>

      {/* credits: the recap tiles are NOAA, NOAA/IFE/URI (Titanic), U.S. Navy (Trieste), USGS (tile 7) and Linley et al.
          2022 (tile 11, CC BY 4.0 - the attribution is a licence condition) photos; the roof is NOAA's whale shark.
          Tiles 3, 10 and 11 carry a record's name over a stand-in photo, as their own levels disclose, so the chip
          says so here too. Kept to 94 characters: the chip has to end left of x 1400. */}
      <div style={{ opacity: recapVis }}>
        <CreditChip kind="real" source="NOAA, NOAA/IFE/URI, U.S. Navy, USGS, Linley et al. 2022 (CC BY 4.0) · tiles 3/10/11: stand-ins" />
      </div>
      <div style={{ opacity: rewind }}>
        <CreditChip kind="real" source="NOAA Photo Library" />
      </div>

      {/* The last line used to put kicker and title up together and then hold one frame for 7 s. Now the kicker
          comes on "Next", the title on its own words, and the line's last clause under it (all three are spoken). */}
      <div style={{ position: "absolute", left: 140, bottom: 184, opacity: ease(frame, nextAt, 12) }}>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: B.gauge }}>NEXT LEVEL</div>
        <div style={{ fontFamily: F.headline, fontSize: 72, color: B.paper, lineHeight: 1.05, whiteSpace: "nowrap", opacity: ease(frame, typeAt, 12), transform: `translateY(${24 * (1 - ease(frame, typeAt, 16))}px)` }}>EVERY TYPE OF DEEP-SEA CREATURE</div>
      </div>
      <div style={{ position: "absolute", left: 140, bottom: 132, opacity: ease(frame, trickAt, 12), fontFamily: F.ui, fontWeight: 800, fontSize: 28, letterSpacing: 1.5, textTransform: "uppercase", whiteSpace: "nowrap", color: B.paper, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
        and the trick each one uses to survive
      </div>
    </AbsoluteFill>
  );
};
