// L16INTOTHESUN cue helpers: every shot change and sound hit is keyed to a PHRASE in the narration (never to a timecode), so the
// picture, SFX and music all re-sync when a line is re-voiced. Frames are scene-relative (line 0 of a scene starts at
// `t.lines[0].at`, after the 0.35-s lead-in). Phrase position is estimated from its character offset in the line (good
// to a few frames at an even pace); the voice QA probe flags lines that run uneven.
import { SceneTiming } from "../../lib/timeline";

/** Scene-relative frame where `phrase` is spoken in line `i` of scene `t` (+ `offset` frames). Throws if the phrase
 *  is not in the line's text, so a script edit that breaks a cue fails the type check / render, not the review. */
export const phraseAt = (t: SceneTiming, i: number, phrase: string, offset = 0) => {
  const l = t.lines[i];
  if (!l) throw new Error(`L16INTOTHESUN cue: scene ${t.id} has no line ${i}`);
  const k = l.text.indexOf(phrase);
  if (k < 0) throw new Error(`L16INTOTHESUN cue "${phrase}" not in ${t.id} line ${i}: "${l.text}"`);
  return l.at + Math.round((l.audioFrames * k) / l.text.length) + offset;
};

/** Scene-relative frame where line `i`'s audio ends (+ `offset`). */
export const lineEnd = (t: SceneTiming, i: number, offset = 0) => {
  const l = t.lines[Math.min(i, t.lines.length - 1)];
  return l.at + l.audioFrames + offset;
};

/**
 * The per-scene cue kit. Every scene module builds its cue table with this:
 *   const cues = (t) => { const { at, p, end, frac } = cueKit(t); return { stone: p(2, "Look at what"), ... }; };
 *  - at(i)          frame line i starts
 *  - p(i, phrase)   frame a phrase in line i is spoken (the normal way to place a shot or a hit)
 *  - end(i)         frame line i's audio ends
 *  - frac(i, k)     frame k of the way through line i (0..1) - the storyboard's "Share" column
 */
export const cueKit = (t: SceneTiming) => ({
  at: (i: number) => t.lines[Math.min(i, t.lines.length - 1)].at,
  p: (i: number, phrase: string, offset = 0) => phraseAt(t, i, phrase, offset),
  end: (i: number, offset = 0) => lineEnd(t, i, offset),
  frac: (i: number, k: number, offset = 0) => {
    const l = t.lines[Math.min(i, t.lines.length - 1)];
    return l.at + Math.round(l.audioFrames * k) + offset;
  },
});
export type CueKit = ReturnType<typeof cueKit>;
