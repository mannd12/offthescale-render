// L12 scene l06 "Why Everest is rising" (storyboard §3 "6 · Why Everest is rising": shots 6-01…6-15 (ends with BB + ChapterCard 4 in its tail), script lines 41-48, family dusk / noon, Act III).
// PLACEHOLDER: the builder of this package replaces the body with the shot list (episodes/L12-mountain-limit/BUILD.md).
// Every number drawn here must carry its sources.md row in a comment next to the literal (validate while building).
import React from "react";
import { SceneTiming } from "../../../lib/timeline";
import { familyOf } from "../families";
import { cueKit } from "../cues";
import { Cue, SFX } from "./cue-types";
import { Placeholder } from "./Placeholder";

const F = familyOf("dusk");

/** Cue table: one entry per shot boundary and sound hit, keyed to phrases (never timecodes). Fill in from the storyboard. */
export const cuesL06 = (t: SceneTiming) => {
  const { at, end } = cueKit(t);
  return {
    start: at(0),
    last: end(t.lines.length - 1),
    end: t.frames,
  };
};
export type CL06 = ReturnType<typeof cuesL06>;

export const SceneL06: React.FC<{ t: SceneTiming }> = ({ t }) => <Placeholder t={t} family={F} id="l06" name="Why Everest is rising" lines="41-48" act="III" />;

/** Spot SFX (scene-relative frames). Placeholder: one whoosh on the scene's first cut; the builder writes the real list. */
export const soundL06 = (t: SceneTiming): Cue[] => {
  const c = cuesL06(t);
  return [{ at: c.start - 2, file: SFX.whoosh, vol: 0.22, dur: 50 }];
};
