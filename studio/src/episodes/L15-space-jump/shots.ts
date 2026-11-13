// L15SPACEJUMP shot plumbing: a scene is a hard-cut list of shots, each keyed to a frame in the scene (from cues.ts). The shot
// on screen gets its OWN frame `f` (0 at its first frame) and length `len`, so camera paths, pose tweens and the Stage
// drift are born with the shot (v2.1 round 2 lesson: pass `shotFrame={f}` to <Stage>).
import React from "react";
import { SceneTiming, within } from "../../lib/timeline";

/** Props every shot component receives: its own frame, its length in frames, the scene's cue table. */
export type ShotProps<C> = { f: number; len: number; c: C };
export type ShotFC<C> = React.FC<ShotProps<C>>;
export type ShotDef<C> = { from: number; S: ShotFC<C>; /** storyboard id, e.g. "C-07" (review stills name it) */ id?: string };

/** Hard-cut shot list: the shot whose `from` was passed last is on screen. `total` = the scene's last frame. */
export function playShots<C>(f: number, shots: ShotDef<C>[], c: C, total: number) {
  let k = 0;
  for (let i = 0; i < shots.length; i++) if (f >= shots[i].from) k = i;
  const S = shots[k].S;
  const to = k + 1 < shots.length ? shots[k + 1].from : total;
  return React.createElement(S, { f: f - shots[k].from, len: to - shots[k].from, c });
}

/** Which shot (index + its frame) is on screen at scene frame f: for review overlays and the key-art stills. */
export function shotAt<C>(f: number, shots: ShotDef<C>[]) {
  let k = 0;
  for (let i = 0; i < shots.length; i++) if (f >= shots[i].from) k = i;
  return { index: k, id: shots[k].id, f: f - shots[k].from };
}

/**
 * Place a shot by line index + fraction of that line's audio (the storyboard's "L" and "Share" columns):
 *   { from: lineFrac(t, 3, 0.55), S: ShotTimeBar }   // shot C-08 starts 55 % into line 3
 * Prefer `cueKit(t).p(i, "phrase")` when the cut lands on a word; use lineFrac for shots whose boundary is a share.
 */
export const lineFrac = (t: SceneTiming, i: number, fraction: number, offset = 0) => within(t, i, fraction) + offset;

/**
 * Where the act break starts in a scene that closes an act (l01, l04, l06, l08): the frame its last line's audio ends.
 * From there to `t.frames` the scene draws the BlackBeat (12-20 frames + sting) and then the next act's ChapterCard
 * (l01 → card 2 "Mountains Float", l04 → card 3 "The Mountain in the Sea", l06 → card 4 "Now Change the Planet");
 * l08 draws the BlackBeat then the 14-s music-only replay M-01. The room comes from HOLDS in Episode.tsx.
 */
export const actBreakAt = (t: SceneTiming) => {
  const last = t.lines[t.lines.length - 1];
  return { start: last.at + last.audioFrames + 6, end: t.frames };
};

/** Which line (index) and fraction of it is playing at scene frame f, for review overlays. -1 before line 0. */
export const lineAtFrame = (t: SceneTiming, f: number) => {
  let i = -1;
  for (let k = 0; k < t.lines.length; k++) if (f >= t.lines[k].at) i = k;
  if (i < 0) return { line: -1, frac: 0 };
  const l = t.lines[i];
  return { line: i, frac: Math.min(1.5, (f - l.at) / Math.max(1, l.audioFrames)) };
};
