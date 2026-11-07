// L12 scene l08 "Where the rule breaks" (storyboard §3 "8 · Where the rule breaks": shots 8-01…8-14, then BB + the 14-s music-only replay M-01 in its tail (HOLDS l08:7), script lines 59-66, family void high key → studio, Act IV).
// PLACEHOLDER: the builder of this package replaces the body with the shot list (episodes/L12-mountain-limit/BUILD.md).
// Every number drawn here must carry its sources.md row in a comment next to the literal (validate while building).
import React from "react";
import { SceneTiming } from "../../../lib/timeline";
import { familyOf } from "../families";
import { cueKit } from "../cues";
import { Cue, SFX } from "./cue-types";
import { Placeholder } from "./Placeholder";

const F = familyOf("void");

/** Cue table: one entry per shot boundary and sound hit, keyed to phrases (never timecodes). Fill in from the storyboard. */
export const cuesL08 = (t: SceneTiming) => {
  const { at, end } = cueKit(t);
  return {
    start: at(0),
    last: end(t.lines.length - 1),
    end: t.frames,
  };
};
export type CL08 = ReturnType<typeof cuesL08>;

export const SceneL08: React.FC<{ t: SceneTiming }> = ({ t }) => <Placeholder t={t} family={F} id="l08" name="Where the rule breaks" lines="59-66" act="IV" />;

/** Spot SFX (scene-relative frames). Placeholder: one whoosh on the scene's first cut; the builder writes the real list. */
export const soundL08 = (t: SceneTiming): Cue[] => {
  const c = cuesL08(t);
  return [{ at: c.start - 2, file: SFX.whoosh, vol: 0.22, dur: 50 }];
};
