// L12 scene l04 "The saw" (storyboard §3 "4 · The saw": shots 4-01…4-10 (ends with BB + ChapterCard 3 in its tail), script lines 26-30, family noon winter → studio → petrol, Act II).
// PLACEHOLDER: the builder of this package replaces the body with the shot list (episodes/L12-mountain-limit/BUILD.md).
// Every number drawn here must carry its sources.md row in a comment next to the literal (validate while building).
import React from "react";
import { SceneTiming } from "../../../lib/timeline";
import { familyOf } from "../families";
import { cueKit } from "../cues";
import { Cue, SFX } from "./cue-types";
import { Placeholder } from "./Placeholder";

const F = familyOf("noon");

/** Cue table: one entry per shot boundary and sound hit, keyed to phrases (never timecodes). Fill in from the storyboard. */
export const cuesL04 = (t: SceneTiming) => {
  const { at, end } = cueKit(t);
  return {
    start: at(0),
    last: end(t.lines.length - 1),
    end: t.frames,
  };
};
export type CL04 = ReturnType<typeof cuesL04>;

export const SceneL04: React.FC<{ t: SceneTiming }> = ({ t }) => <Placeholder t={t} family={F} id="l04" name="The saw" lines="26-30" act="II" />;

/** Spot SFX (scene-relative frames). Placeholder: one whoosh on the scene's first cut; the builder writes the real list. */
export const soundL04 = (t: SceneTiming): Cue[] => {
  const c = cuesL04(t);
  return [{ at: c.start - 2, file: SFX.whoosh, vol: 0.22, dur: 50 }];
};
