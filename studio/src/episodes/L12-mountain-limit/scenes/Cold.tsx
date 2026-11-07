// L12 cold open (storyboard §3 "Cold open": shots C-01…C-11, script lines 0-5, family dusk, Act I). Ends with
// ChapterCard 1 over line 5 (C-11) and a ZoomThrough into scene 1's studio floor.
// PLACEHOLDER with one proto-shot: the Summit module and the gauge, so the skeleton render proves the shared pieces.
// The Act I builder replaces `shots` with C-01…C-11. Numbers drawn: 8,848.86 m (#1) on the gauge.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Layer, Motes, Pill, Stage, cameraAt, fall, ramp } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { familyOf, pillFill } from "../families";
import { cueKit } from "../cues";
import { HEIGHTS, L12Gauge } from "../L12Gauge";
import { Summit } from "../Summit";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX } from "./cue-types";

const F = familyOf("dusk");

/** Cue table for the cold open: fill in from storyboard §3 (every shot boundary and hit keyed to a phrase). */
export const cuesCold = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    start: at(0),
    summit: p(0, "Eight thousand", -4), // C-02: the gauge rises and stops at 8,848.86 m (#1)
    rising: at(1), // C-03: +2 mm a year (#6)
    whyNot: p(1, "Why not"),
    stone: at(2), // C-05
    card: at(5) - 2, // C-11: ChapterCard 1 over line 5
    last: end(5),
    end: t.frames,
  };
};
export type CCold = ReturnType<typeof cuesCold>;

// Proto-shot (C-01/C-02 stand-in): slow push toward the summit; the gauge climbs from a sea-level tick and stops hard.
const ShotSummitProto: ShotFC<CCold> = ({ f, len, c }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: L, x: 950, y: 420, zoom: 1.5 },
  ]);
  const rise = c.summit - c.start;
  const k = ramp(f, rise, rise + 48);
  const v = HEIGHTS.everest * k; // #1
  const snow = fall(f, 60, 1920, 1080, 4, 0.9, 14);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.22} grain={0.5}>
      <Summit f={f} family={F} light={10} sun={{ x: 1560, y: 560 }} tick={{ pxPerM: 40, pose: "stand", expression: k > 0.95 ? "proud" : "neutral", look: 0.6 }} />
      <Layer depth={1.25}>
        {snow.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.9} fill="#FFFFFF" opacity={0.5} />
        ))}
        <Motes frame={f} n={24} x={700} y={300} w={1000} h={600} color={F.light} seed={5} size={2.4} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={128} text="L12 · cold open · placeholder (proto-shot: Summit + L12Gauge)" fill={pillFill(F)} color={F.text} dot={F.light} size={18} />
        <L12Gauge family={F} value={v} base={k > 0.9 ? "ABOVE SEA LEVEL" : undefined} readout={k >= 1 ? "8,848.86 m" : undefined} rolling marker={f >= rise} />
      </Layer>
    </Stage>
  );
};

export const SceneCold: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCold(t);
  const shots: ShotDef<CCold>[] = [{ from: 0, S: ShotSummitProto, id: "C-01" }];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX for the cold open (scene-relative). Placeholder: wind bed, the racing ticks and the chime on the stop. */
export const soundCold = (t: SceneTiming): Cue[] => {
  const c = cuesCold(t);
  return [
    { at: 0, file: SFX.wind, vol: 0.2, dur: c.card + 8, fadeIn: 20, fadeOut: 14 },
    ...[0, 6, 12, 18, 24, 30, 36].map((o) => ({ at: c.summit + o, file: SFX.click, vol: 0.14, dur: 12 })),
    { at: c.summit + 48, file: SFX.chime, vol: 0.24, dur: 60 },
    { at: c.card, file: SFX.boom, vol: 0.42, dur: 150, fadeOut: 40 },
  ];
};
