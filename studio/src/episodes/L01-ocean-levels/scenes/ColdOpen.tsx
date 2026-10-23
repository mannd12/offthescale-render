import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { CaptionPop, CreditChip, Gauge, Tile, levelImage } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { LEVELS, STOPS, depthPos, fmtDepth, pressureSub } from "../ladder";

const DEEP_PLATE = LEVELS[9]; // the NOAA dumbo-octopus still (manifest id "dumbo-real"): the "down there" behind the tiles

const BOTTOM = 10935;

/**
 * 0-3 s: one bright shot, then the camera falls. Lines:
 *  0 "You have never really seen the ocean. You've seen its roof."
 *  1 "Everything you picture ... top two hundred metres. The bottom is nearly eleven kilometres down."
 *  2 "Twelve levels. We're going down all of them ... And we are not coming back up."
 *  3 "Level one is the only one you've ever been to."
 */
export const ColdOpen: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const roofAt = within(t, 0, 0.72); // "...its roof."
  const fallAt = within(t, 1, 0.62); // "The bottom is nearly eleven kilometres down."
  const fallEnd = lineAt(t, 2) - 6;
  const tilesAt = lineAt(t, 2);
  const noReturnAt = within(t, 2, 0.8); // "And we are not coming back up."
  const oneAt = lineAt(t, 3);

  // the plunge: the reading races from 0 to the bottom while the picture sinks out of frame
  const fall = interpolate(frame, [fallAt, fallEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = 1 - Math.pow(1 - fall, 3);
  const depth = frame >= oneAt ? Math.max(0, BOTTOM * (1 - ease(frame, oneAt, 16))) : BOTTOM * eased;
  // the footage goes black on the way down, and comes back with the gauge at line 3
  const dark = (0.15 + 0.85 * eased) * (1 - ease(frame, oneAt, 16));
  const tilesIn = ease(frame, tilesAt, 1);
  // the deep plate (a NOAA dumbo octopus, not photographed at the bottom) arrives only once the
  // "nearly 11 km down" beat is over, and the 10,935 m readout leaves as it comes in - the gauge must
  // never sit on that photo as if it had been taken at that depth. It returns with the surface at line 3.
  const plateAt = tilesAt + 30;
  const plateIn = ease(frame, plateAt, 20) * (1 - ease(frame, oneAt, 12));
  const gaugeIn = ease(frame, lineAt(t, 1), 14) * (1 - ease(frame, plateAt - 4, 12)) + ease(frame, oneAt + 18, 10); // back only once the reading has reached 0 m (never shown counting up)
  // credit follows the plate on screen (assets/manifest.json): whale shark = NOAA Photo Library from
  // frame 0, fading as the picture goes black; dumbo octopus = NOAA Ocean Exploration
  const surfaceCredit = frame >= oneAt ? ease(frame, oneAt, 16) : 1 - eased;
  // Line 3 brings the surface back. The plate is at brightness 0.02 at `oneAt`, so that is where its framing
  // switches (unseen) from the cold open's tall, sunk, 6 %-zoomed picture to exactly what Sunlight.tsx draws
  // on its first frame - full height, top 0, scale 1 about 60% 45%, under the same bottom gradient. Otherwise
  // the photo jumped ~90 px and lost its zoom at the scene change.
  const surfaced = frame >= oneAt;

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <Img
        src={levelImage(LEVELS[0])!}
        style={{
          position: "absolute",
          width: "100%",
          height: surfaced ? "100%" : "112%",
          top: surfaced ? 0 : `${-12 * eased}%`,
          objectFit: "cover",
          transform: surfaced ? "scale(1)" : `scale(${1 + 0.06 * Math.min(1, frame / Math.max(1, fallAt))})`,
          transformOrigin: surfaced ? "60% 45%" : undefined,
          filter: `brightness(${1 - dark * 0.98})`,
        }}
      />
      {/* the deep, dimly, once the surface has gone black - no dead black frames behind the tiles */}
      <Img src={levelImage(DEEP_PLATE)!} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 * plateIn, transform: `scale(${1.08 - 0.06 * ease(frame, tilesAt, 200)})` }} />
      {/* the same bottom gradient Sunlight lays over this plate. It comes up with the surface (same 16-frame
          ease as the brightness) rather than switching on: the deep plate is still fading out at `oneAt` and a
          hard switch would show on it. Fully on 73 frames before the cut. */}
      <AbsoluteFill style={{ background: "linear-gradient(transparent 55%, rgba(5,14,24,0.7))", opacity: ease(frame, oneAt, 16) }} />
      {/* line 0: the roof */}
      {/* No gauge is on screen yet, so the caption is centred on the frame, not on the gauge-side caption box:
          the 130 px shift is on a span INSIDE CaptionPop. (On the wrapper div a transform made that zero-height div
          the containing block, and the caption rendered above the frame - found on the final, pass 4.) */}
      <div style={{ opacity: ease(frame, roofAt, 10) * (1 - ease(frame, lineAt(t, 1) + 14, 10)) }}>
        <CaptionPop bottom={150} size={110} color={B.paper}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap", transform: "translateX(130px)" }}>
            you've seen its <span style={{ color: B.gauge }}>roof</span>
          </span>
        </CaptionPop>
      </div>
      {/* scrim so the tile strip stays legible once the surface comes back. Painted BEFORE the gauge: after it,
          it greyed the top of the 0 m readout bubble for the whole of line 3 (it overlaps nothing else that
          comes between - the two captions sit at the bottom of the frame). */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 260, background: "linear-gradient(rgba(5,14,24,0.92) 55%, rgba(5,14,24,0))", opacity: ease(frame, tilesAt, 10) }} />
      {/* the gauge appears at the surface, then plunges */}
      <div style={{ opacity: gaugeIn }}>
        <Gauge x={1580} top={250} height={700} stops={STOPS} position={depthPos(depth)} reading={fmtDepth(depth)} sub={pressureSub(depth)} />
      </div>
      {/* line 1 tail: the distance, on "nearly eleven kilometres", gone as line 2 ("Twelve levels") begins */}
      <div style={{ opacity: ease(frame, within(t, 1, 0.84), 10) * (1 - ease(frame, tilesAt, 10)) }}>
        <CaptionPop bottom={140} size={96} color={B.paper}>
          nearly <span style={{ color: B.gauge }}>11 km</span> down
        </CaptionPop>
      </div>
      {/* line 2: the twelve tiles snap in across the top, the last one the coral "???" */}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14, opacity: tilesIn }}>
        {LEVELS.map((l, i) => {
          const s = ease(frame, tilesAt + i * 3, 8);
          const current = frame >= oneAt && i === 0;
          return (
            <div key={l.id} style={{ transform: `scale(${0.6 + 0.4 * s}) translateY(${(1 - s) * -30}px)`, opacity: s }}>
              <Tile level={l} width={138} height={78} state={current ? "current" : "past"} badge={current ? "YOU" : undefined} labelSize={0} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 152, left: 0, right: 0, textAlign: "center", fontFamily: F.headline, fontSize: 64, letterSpacing: 2, color: B.paper, opacity: ease(frame, tilesAt + 12, 10) * (1 - ease(frame, oneAt, 10)) }}>
        TWELVE LEVELS
      </div>
      <div style={{ opacity: surfaceCredit }}>
        <CreditChip source="NOAA Photo Library" />
      </div>
      <div style={{ opacity: plateIn }}>
        <CreditChip source="NOAA Ocean Exploration · a dumbo octopus, from a shallower dive" />
      </div>
      <div style={{ opacity: ease(frame, noReturnAt, 8) * (1 - ease(frame, oneAt, 8)) }}>
        <CaptionPop bottom={140} size={84} color={B.tease}>
          and we are not coming back up
        </CaptionPop>
      </div>
      {/* line 3: back to the surface, tile one lit */}
      <div style={{ opacity: ease(frame, oneAt + 6, 10) }}>
        <CaptionPop bottom={140} size={84}>
          level one: where you've been
        </CaptionPop>
      </div>
    </AbsoluteFill>
  );
};
