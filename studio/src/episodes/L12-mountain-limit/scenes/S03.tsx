// L12 scene l03 "The dough" (storyboard §3 "3 · The dough": shots 3-01…3-12 (grounding scene 1: the kitchen), script lines 20-25, family ember → studio/noon → noon, Act II).
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
export const cuesL03 = (t: SceneTiming) => {
  const { at, end } = cueKit(t);
  return {
    start: at(0),
    last: end(t.lines.length - 1),
    end: t.frames,
  };
};
export type CL03 = ReturnType<typeof cuesL03>;

export const SceneL03: React.FC<{ t: SceneTiming }> = ({ t }) => <Placeholder t={t} family={F} id="l03" name="The dough" lines="20-25" act="II" />;

/** Spot SFX (scene-relative frames). Placeholder: one whoosh on the scene's first cut; the builder writes the real list. */
export const soundL03 = (t: SceneTiming): Cue[] => {
  const c = cuesL03(t);
  return [{ at: c.start - 2, file: SFX.whoosh, vol: 0.22, dur: 50 }];
};
