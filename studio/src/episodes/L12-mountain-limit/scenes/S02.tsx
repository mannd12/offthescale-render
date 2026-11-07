// L12 scene l02 "The root" (storyboard §3 "2 · The root": shots 2-01…2-14, script lines 12-19, family ember / noon, Act I).
// PLACEHOLDER: the builder of this package replaces the body with the shot list (episodes/L12-mountain-limit/BUILD.md).
// Every number drawn here must carry its sources.md row in a comment next to the literal (validate while building).
import React from "react";
import { SceneTiming } from "../../../lib/timeline";
import { familyOf } from "../families";
import { cueKit } from "../cues";
import { Cue, SFX } from "./cue-types";
import { Placeholder } from "./Placeholder";

const F = familyOf("ember");

/** Cue table: one entry per shot boundary and sound hit, keyed to phrases (never timecodes). Fill in from the storyboard. */
export const cuesL02 = (t: SceneTiming) => {
  const { at, end } = cueKit(t);
  return {
    start: at(0),
    last: end(t.lines.length - 1),
    end: t.frames,
  };
};
export type CL02 = ReturnType<typeof cuesL02>;

export const SceneL02: React.FC<{ t: SceneTiming }> = ({ t }) => <Placeholder t={t} family={F} id="l02" name="The root" lines="12-19" act="I" />;

/** Spot SFX (scene-relative frames). Placeholder: one whoosh on the scene's first cut; the builder writes the real list. */
export const soundL02 = (t: SceneTiming): Cue[] => {
  const c = cuesL02(t);
  return [{ at: c.start - 2, file: SFX.whoosh, vol: 0.22, dur: 50 }];
};
