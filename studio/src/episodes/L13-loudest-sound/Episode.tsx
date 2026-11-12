// L13 "How loud can a sound get?" - timeline, voice envelope and the spot-SFX player.
// The composition itself is Full.tsx (`l13`); scene bodies live in scenes/ (one file per scene id, bespoke per episode,
// hard rule 1). Storyboard: episodes/L13-loudest-sound/storyboard.md; builder guide: episodes/L13-loudest-sound/BUILD.md.
// Audio sources and licences: studio/public/audio/LICENSES.md (music: Kevin MacLeod, CC BY 4.0 - credit in the
// description; SFX: Mixkit Free License).
import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { FPS, SceneTiming, VoLine, buildTimeline } from "../../lib/timeline";
import vo from "./vo.json";

/**
 * Timeline overrides (seconds ADDED to a line's pauseAfter), keyed "scene:lineIndex": room for a BlackBeat + the next
 * act's ChapterCard at the end of an act-closing scene, or a music-only beat. The storyboard decides them
 * (episodes/L13-loudest-sound/storyboard.md); publish-kit reads this table, so captions and chapters stay in sync.
 */
export const HOLDS: Record<string, number> = {
  "l03:7": 2.4,
  "l06:7": 2.4,
  "l08:9": 10,
};

export const LINES: VoLine[] = (vo as VoLine[]).map((l) => {
  const extra = HOLDS[`${l.scene}:${l.index}`];
  return extra ? { ...l, pauseAfter: l.pauseAfter + extra } : l;
});

export const timeline = buildTimeline(LINES);
export const scene = (id: string) => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`L13: no scene "${id}" in vo.json`);
  return s as SceneTiming;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 1 while any narration line plays (short ramps either side), 0 in the gaps: drives the music duck. */
export const voiceEnv = (f: number) => {
  let v = 0;
  for (const s of timeline.scenes)
    for (const l of s.lines) {
      if (l.estimated) continue;
      const a = s.from + l.at;
      const b = a + l.audioFrames;
      if (f < a - 8 || f > b + 12) continue;
      v = Math.max(v, interpolate(f, [a - 8, a, b, b + 12], [0, 1, 1, 0], clamp));
    }
  return v;
};

/** One spot effect: starts at `at` (composition frame), optional trim (s), length cap and fades (frames). */
export const Sfx: React.FC<{ at: number; file: string; vol: number; dur?: number; trim?: number; fadeIn?: number; fadeOut?: number }> = ({
  at,
  file,
  vol,
  dur = 240,
  trim = 0,
  fadeIn = 0,
  fadeOut = 0,
}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={dur} name={`sfx ${file}`} layout="none">
    <Audio
      src={staticFile(`audio/sfx/${file}`)}
      trimBefore={Math.round(trim * FPS)}
      volume={(f) => vol * (fadeIn ? interpolate(f, [0, fadeIn], [0, 1], clamp) : 1) * (fadeOut ? interpolate(f, [dur - fadeOut, dur], [1, 0], clamp) : 1)}
    />
  </Sequence>
);

const db = (x: number) => Math.pow(10, x / 20);

/** A music bed from `from` to `to` (composition frames): crossfades in and out, ducked −22 dB under the voice.
 *  `gain` (dB) evens out the tracks' own loudness. Only files logged in studio/public/audio/LICENSES.md. */
export const Bed: React.FC<{ file: string; from: number; to: number; gain?: number; trim?: number; fade?: number }> = ({ file, from, to, gain = 0, trim = 0, fade = 45 }) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)} name={`music ${file}`} layout="none">
    <Audio
      src={staticFile(`audio/music/${file}`)}
      trimBefore={Math.round(trim * FPS)}
      volume={(f) =>
        db(gain) *
        interpolate(voiceEnv(from + f), [0, 1], [db(-15), db(-22)]) *
        interpolate(f, [0, fade], [0, 1], clamp) *
        interpolate(f, [to - from - fade, to - from], [1, 0], clamp)
      }
    />
  </Sequence>
);
