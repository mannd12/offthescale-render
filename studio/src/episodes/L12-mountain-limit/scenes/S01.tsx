// L12 scene l01 "The stack" (storyboard §3 "1 · The stack": shots 1-01…1-12 (the gag set piece; ends with BB + ChapterCard 2 in its tail), script lines 6-11, family studio, Act I).
// PLACEHOLDER: the builder of this package replaces the body with the shot list (episodes/L12-mountain-limit/BUILD.md).
// Every number drawn here must carry its sources.md row in a comment next to the literal (validate while building).
import React from "react";
import { SceneTiming } from "../../../lib/timeline";
import { familyOf } from "../families";
import { cueKit } from "../cues";
import { Cue, SFX } from "./cue-types";
import { Placeholder } from "./Placeholder";

const F = familyOf("studio");

/** Cue table: one entry per shot boundary and sound hit, keyed to phrases (never timecodes). Fill in from the storyboard. */
export const cuesL01 = (t: SceneTiming) => {
  const { at, end } = cueKit(t);
  return {
    start: at(0),
    last: end(t.lines.length - 1),
    end: t.frames,
  };
};
export type CL01 = ReturnType<typeof cuesL01>;

export const SceneL01: React.FC<{ t: SceneTiming }> = ({ t }) => <Placeholder t={t} family={F} id="l01" name="The stack" lines="6-11" act="I" />;

/** Spot SFX (scene-relative frames). Placeholder: one whoosh on the scene's first cut; the builder writes the real list. */
export const soundL01 = (t: SceneTiming): Cue[] => {
  const c = cuesL01(t);
  return [{ at: c.start - 2, file: SFX.whoosh, vol: 0.22, dur: 50 }];
};
