// L12 scene l07 "Other worlds" (storyboard §3 "7 · Other worlds": shots 7-01…7-19 (key art III = 7-07 Olympus Mons under the ochre sky), script lines 49-58, family studio / void / Mars / ember / Venus, Act III).
// PLACEHOLDER: the builder of this package replaces the body with the shot list (episodes/L12-mountain-limit/BUILD.md).
// Every number drawn here must carry its sources.md row in a comment next to the literal (validate while building).
import React from "react";
import { SceneTiming } from "../../../lib/timeline";
import { MARS } from "../families";
import { cueKit } from "../cues";
import { Cue, SFX } from "./cue-types";
import { Placeholder } from "./Placeholder";

const F = MARS;

/** Cue table: one entry per shot boundary and sound hit, keyed to phrases (never timecodes). Fill in from the storyboard. */
export const cuesL07 = (t: SceneTiming) => {
  const { at, end } = cueKit(t);
  return {
    start: at(0),
    last: end(t.lines.length - 1),
    end: t.frames,
  };
};
export type CL07 = ReturnType<typeof cuesL07>;

export const SceneL07: React.FC<{ t: SceneTiming }> = ({ t }) => <Placeholder t={t} family={F} id="l07" name="Other worlds" lines="49-58" act="III" />;

/** Spot SFX (scene-relative frames). Placeholder: one whoosh on the scene's first cut; the builder writes the real list. */
export const soundL07 = (t: SceneTiming): Cue[] => {
  const c = cuesL07(t);
  return [{ at: c.start - 2, file: SFX.whoosh, vol: 0.22, dur: 50 }];
};
