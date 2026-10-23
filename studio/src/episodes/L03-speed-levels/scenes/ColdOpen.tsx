import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Tile, levelImage } from "../../../brand/kit";
import { CaptionPop, CreditChip, PillTag } from "./shell";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease, lerp } from "../../../lib/ui";
import { Speedo } from "../gauge";
import { C_KMH, LEVELS } from "../ladder";

/**
 * Lines: 0 "Right now, sitting still, you are moving at about 100,000 km/h around the Sun... only changes in speed."
 * 1 "Which raises a question..." 2 "How fast is everything? From a walk... the one speed nothing can pass."
 * 3 "Twelve levels. Real footage... the gauge only goes up." 4 "Level one is the only one your body was built for."
 * Sources: #18 (107,200 km/h = 29.78 km/s orbital), #16 (c).
 */
/**
 * The flash-forward up the ladder, cued to line 2: each plate carries the rung it belongs to (its tag), its manifest
 * credit and that rung's speed from ladder.ts, so plate, tag and gauge always agree.
 * "to the fastest thing human beings have ever built" is spoken over rung 11 and nothing else: Parker Solar Probe,
 * a NASA visualisation (clip `parker-trailer`), so its chip says VISUALISATION and the picture says so too.
 * The Sun is rung 12's plate; its tag does not name the level and the gauge prints nothing (the tile stays "???").
 */
const FLASH: { id: string; clip?: boolean; credit: string; tag: string; level: number; cue: number }[] = [
  { id: "x1-lakebed", credit: "NASA Armstrong, 1955 · E-1914", tag: "LEVEL 5", level: 4, cue: 0.29 },
  { id: "parker-trailer", clip: true, credit: "NASA", tag: "LEVEL 11", level: 10, cue: 0.36 },
  { id: "sun-sdo", credit: "NASA/SDO, 8 Sept 2010", tag: "THE TOP", level: 11, cue: 0.72 },
];
const TOP = FLASH.length - 1;
/** frames skipped at the head of the Parker clip (it opens on black; the probe is in shot from about here) */
const PARKER_SKIP = 55;

/** 0-1, linear and clamped: for slow camera creeps that must never stop */
const lin = (frame: number, from: number, to: number) => Math.max(0, Math.min(1, (frame - from) / (to - from)));

/**
 * The walker stands near the right edge of the grassland photo (4032 x 3024, so 2.1x is still its native size).
 * The opening shot pivots on him (84% 37%). Whenever the gauge is up, the camera is instead pinned to the photo's
 * right edge at 2.1x or more, which puts him at x ~1040-1320 - left of the dial and its dark disc (x >= 1368).
 * Rung 1 starts from the same framing (2.1, "100% 32%").
 */

export const ColdOpen: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const stillAt = within(t, 0, 0.06); // "sitting still"
  const countAt = within(t, 0, 0.26); // "about a hundred thousand kilometres an hour"
  const sunAt = within(t, 0, 0.51); // "around the Sun"
  const feelItAt = within(t, 0, 0.6); // "You can't feel it."
  const feelAt = within(t, 0, 0.72); // "You can't feel any speed"
  const changesAt = within(t, 0, 0.87); // "only changes in speed"
  const line1At = lineAt(t, 1);
  const questionAt = within(t, 1, 0.19); // "a question"
  const twelveAt = within(t, 1, 0.7); // "answer twelve times"
  const sweepAt = lineAt(t, 2);
  const walkAt = within(t, 2, 0.2); // "From a walk"
  const flashAt = FLASH.map((f) => within(t, 2, f.cue));
  const tilesAt = lineAt(t, 3);
  const realAt = within(t, 3, 0.16); // "Real footage at every one a camera has ever reached"
  const upAt = within(t, 3, 0.78); // "the gauge only goes up"
  const oneAt = lineAt(t, 4);
  // the counter spins up to Earth's orbital speed; it lands on the full figure as "a hundred thousand" finishes
  const count = Math.round(107200 * ease(frame, countAt, 40));
  // #18: 29.78 km/s x the seconds this video has been playing - a distance that keeps being eaten while nothing in
  // the picture seems to move (up from "You can't feel it" to the end of line 0)
  const travelled = Math.round((29.78 * frame) / 30);
  // which flash-forward plate is up (if any): the credit chip, the tag and the gauge all follow the picture
  let flashIdx = -1;
  if (frame < tilesAt) flashAt.forEach((at, i) => (flashIdx = frame >= at ? i : flashIdx));
  // the gauge enters reading a walk on "From a walk", then steps up with each plate to that rung's speed and reaches
  // c as "nothing can pass" is said. It is never seen coming back down ("the gauge only goes up"): it leaves the
  // frame before line 3's tiles and returns on "the gauge only goes up", already reading a walk.
  let logKmh = Math.log(5);
  if (frame < tilesAt) FLASH.forEach((f, i) => (logKmh = lerp(logKmh, Math.log(i === TOP ? C_KMH : LEVELS[f.level].kmh), ease(frame, flashAt[i], i === TOP ? 28 : 8))));
  const kmh = Math.exp(logKmh);
  const gaugeOn = ease(frame, walkAt, 10) * (1 - ease(frame, tilesAt - 10, 8)) + ease(frame, upAt, 12);
  // camera on the walker: opens tight on him and pulls back to the whole plain as the counter spins up. On "How fast
  // is everything?" it pushes in to the right-pinned 2.1x framing, so he is clear of the dial when the gauge enters on
  // "From a walk". Under the tiles it eases back from 2.3 to 2.1, the first value of rung 1's camera (no jump at the cut).
  const wide = 1.4 - 0.04 * lin(frame, 0, countAt) - 0.3 * ease(frame, countAt, 45) - 0.06 * lin(frame, countAt + 45, sweepAt);
  const push = ease(frame, sweepAt, 36);
  const cam = frame < tilesAt ? lerp(wide, 2.1, push) : 2.3 - 0.2 * lin(frame, tilesAt, t.frames);
  const camOrigin = frame < tilesAt ? `${lerp(84, 100, push)}% ${lerp(37, 32, push)}%` : "100% 32%";
  // the title row under the tiles: "TWELVE LEVELS" sits centred alone, then slides left as the second half joins it
  const titleGrow = ease(frame, upAt, 10);
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <Img src={levelImage({ id: "w", name: "", reading: "", image: "walker-grassland" })!} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55)", transform: `scale(${cam})`, transformOrigin: camOrigin }} />
      {/* flash-forward: rung 5 for a beat on "to the", rung 11 for "the fastest thing human beings have ever built", the Sun for "the one speed nothing can pass" */}
      {FLASH.map((f, i) => {
        if (flashIdx !== i) return null;
        const end = i === TOP ? tilesAt : flashAt[i + 1];
        if (f.clip)
          return (
            <Sequence key={f.id} from={flashAt[i]} durationInFrames={end - flashAt[i]} layout="none">
              <OffthreadVideo src={staticFile(`assets/${f.id}.mp4`)} muted trimBefore={PARKER_SKIP} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8)" }} />
            </Sequence>
          );
        const grow = 1 + (i === TOP ? 0.1 : 0.05) * lin(frame, flashAt[i], end);
        return <Img key={f.id} src={levelImage({ id: f.id, name: "", reading: "", image: f.id })!} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)", transform: `scale(${grow})` }} />;
      })}
      {/* which rung each flash plate belongs to, on the picture from its first frame */}
      {flashIdx >= 0 ? (
        <div style={{ position: "absolute", left: 160, top: 300, padding: "6px 24px 10px", borderRadius: 16, background: "rgba(5,14,24,0.9)", fontFamily: F.headline, fontSize: 84, lineHeight: 1.1, letterSpacing: 2, color: B.gauge, whiteSpace: "nowrap" }}>{FLASH[flashIdx].tag}</div>
      ) : null}
      {flashIdx >= 0 && FLASH[flashIdx].clip ? <PillTag x={160} y={414} size={26}>NASA visualisation, not footage</PillTag> : null}
      {/* line 0's speed block; gone when line 1 starts */}
      <div style={{ position: "absolute", left: 160, top: 300, opacity: 1 - ease(frame, line1At - 4, 10) }}>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: B.mute, opacity: ease(frame, stillAt, 10) }}>YOU, SITTING STILL</div>
        <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 1, color: B.paper, whiteSpace: "nowrap", opacity: ease(frame, countAt, 10) }}>{count.toLocaleString("en-US")} km/h</div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 2, color: B.gauge, opacity: ease(frame, sunAt, 10) }}>AROUND THE SUN</div>
        {/* "You can't feel it": the distance covered since frame 0 keeps ticking up (#18, 29.78 km/s) */}
        {frame >= feelItAt ? (
          <div style={{ marginTop: 22, opacity: ease(frame, feelItAt, 10) }}>
            <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 2, color: B.mute }}>SINCE THIS VIDEO BEGAN, YOU HAVE MOVED ABOUT</div>
            <div style={{ fontFamily: F.headline, fontSize: 72, lineHeight: 1.1, color: B.aqua, whiteSpace: "nowrap" }}>{travelled.toLocaleString("en-US")} km</div>
          </div>
        ) : null}
      </div>
      {/* "You can't feel any speed" / "only changes in speed": the second row arrives with its words */}
      <div style={{ opacity: ease(frame, feelAt, 10) * (1 - ease(frame, line1At, 10)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          you can't feel speed.
          <br />
          {frame >= changesAt ? (
            <span style={{ opacity: ease(frame, changesAt, 8) }}>
              only <span style={{ color: B.gauge }}>changes</span> in speed.
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </CaptionPop>
      </div>
      {/* line 1: "a question this video is going to answer twelve times" */}
      <div style={{ opacity: ease(frame, questionAt, 10) * (1 - ease(frame, sweepAt - 6, 6)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          one <span style={{ color: B.gauge }}>question</span>,
          <br />
          {frame >= twelveAt ? <span style={{ opacity: ease(frame, twelveAt, 8) }}>answered twelve times</span> : <span>&nbsp;</span>}
        </CaptionPop>
      </div>
      <div style={{ opacity: gaugeOn }}>
        {/* on the last flash the needle runs to the end but the gauge prints nothing: level 12 is still "???" */}
        <Speedo kmh={kmh} reading={flashIdx === TOP ? " " : undefined} sub={flashIdx === TOP ? " " : undefined} />
      </div>
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14, opacity: ease(frame, tilesAt, 1) }}>
        {LEVELS.map((l, i) => {
          const s = ease(frame, tilesAt + i * 3, 8);
          // "Real footage at every one...": a light runs along the twelve tiles, one tile every 6 frames
          const lit = frame >= realAt + i * 6 && frame < realAt + i * 6 + 10 && frame < oneAt;
          const current = (frame >= oneAt && i === 0) || lit;
          return (
            <div key={l.id} style={{ transform: `scale(${(0.6 + 0.4 * s) * (lit ? 1.14 : 1)})`, opacity: s }}>
              <Tile level={l} width={138} height={78} state={current ? "current" : "past"} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 152, left: lerp(778, 430, titleGrow), fontFamily: F.headline, fontSize: 64, letterSpacing: 2, color: B.paper, whiteSpace: "nowrap", opacity: ease(frame, tilesAt + 6, 10) * (1 - ease(frame, oneAt, 10)) }}>
        TWELVE LEVELS{frame >= upAt ? <span style={{ opacity: titleGrow }}> · THE GAUGE ONLY GOES UP</span> : null}
      </div>
      {/* the payoff question, on screen the moment it is asked and through the whole flash-forward */}
      <div style={{ opacity: ease(frame, sweepAt, 8) * (1 - ease(frame, tilesAt - 6, 6)) }}>
        <CaptionPop bottom={150} size={96} color={B.paper}>
          how fast is <span style={{ color: B.gauge }}>everything</span>?
        </CaptionPop>
      </div>
      {/* line 3: the promise, from "Real footage" until level one is named */}
      <div style={{ opacity: ease(frame, realAt, 10) * (1 - ease(frame, oneAt - 4, 6)) }}>
        <CaptionPop bottom={150} size={78} color={B.paper}>
          <span style={{ color: B.gauge }}>real footage</span> at every level
          <br />a camera has reached
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, oneAt + 4, 10) }}>
        <CaptionPop bottom={150} size={84}>level one: the only speed you were built for</CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, 0, 12) }}>
        <CreditChip kind={flashIdx >= 0 && FLASH[flashIdx].clip ? "visualisation" : "real"} source={flashIdx >= 0 ? FLASH[flashIdx].credit : "U.S. Forest Service · public domain"} />
      </div>
    </AbsoluteFill>
  );
};
