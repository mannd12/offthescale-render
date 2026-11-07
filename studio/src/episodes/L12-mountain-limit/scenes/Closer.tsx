// L12 closer (storyboard §3 "Closer": shots Z-01…Z-09 + E-01, script lines 67-71 incl. the unvoiced L13 tease, Act IV).
// Families: studio (the 1-m ball, key art IV = Z-03) → dusk summit at sunrise → void Earth disc → petrol tease → the
// 20-s end card on the dusk dark field (kit `EndCard`: wordmark left, right half clear for YouTube's end-screen tiles).
// PLACEHOLDER for Z-01…Z-09; the end card is real (shared kit piece) and already runs in the tail.
import React from "react";
import { useCurrentFrame } from "remotion";
import { EndCard, Layer, Motes, Sky, Stage, Stars, fall } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { familyOf } from "../families";
import { cueKit } from "../cues";
import { Placeholder } from "./Placeholder";
import { Cue, SFX } from "./cue-types";

/** Frames of end card after the last line (E-01: 20 s). */
export const closerTail = 600;

const F = familyOf("studio");
const CARD = familyOf("dusk");

export const cuesCloser = (t: SceneTiming) => {
  const { at, end } = cueKit(t);
  return {
    start: at(0),
    tease: at(Math.min(4, t.lines.length - 1)), // Z-09, the L13 tease (#28); estimated until it is voiced
    endCard: end(t.lines.length - 1, 6), // E-01
    end: t.frames + closerTail,
  };
};
export type CCloser = ReturnType<typeof cuesCloser>;

/** E-01: the end card on the dusk dark field, sparse snow motes, the bloom pulse; right half clear. */
const EndCardShot: React.FC<{ f: number; len: number }> = ({ f, len }) => {
  const snow = fall(f, 30, 1920, 1080, 8, 0.6, 12);
  return (
    <Stage theme={CARD.theme} drift={false} vignette={0.3} grain={0.4}>
      <Layer depth={0.05}>
        <Sky stops={[CARD.sky[0], CARD.sky[1]]} />
        <Stars frame={f} n={80} w={1920} h={700} color={CARD.text} seed={21} size={1.3} twinkle={0.7} />
      </Layer>
      <Layer depth={1}>
        {snow.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.8} fill="#FFFFFF" opacity={0.4} />
        ))}
        <Motes frame={f} n={24} x={60} y={80} w={1800} h={900} color={CARD.light} seed={9} size={3} drift={40} />
      </Layer>
      <Layer depth={0}>
        <EndCard t={Math.min(1, f / Math.max(1, len))} family={CARD} sub="Next: How loud can a sound get?" />
      </Layer>
    </Stage>
  );
};

export const SceneCloser: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCloser(t);
  if (f >= c.endCard) return <EndCardShot f={f - c.endCard} len={c.end - c.endCard} />;
  return <Placeholder t={t} family={F} id="closer" name="Closer" lines="67-71" act="IV" />;
};

export const soundCloser = (t: SceneTiming): Cue[] => {
  const c = cuesCloser(t);
  return [
    { at: c.start - 2, file: SFX.whoosh, vol: 0.22, dur: 50 },
    { at: c.tease, file: SFX.swirl, vol: 0.22, dur: 50 },
    { at: c.endCard + 20, file: SFX.boom, vol: 0.22, dur: 120, fadeOut: 60 },
    { at: c.endCard + 30, file: SFX.chime, vol: 0.16, dur: 60 },
  ];
};
