// L12 "Why can't mountains get much taller than Everest?" - timeline, voice envelope and the spot-SFX player.
// The composition itself is Full.tsx (`l12`); scene bodies live in scenes/ (one file per scene id, bespoke per episode,
// hard rule 1). Storyboard: episodes/L12-mountain-limit/storyboard.md; builder guide: episodes/L12-mountain-limit/BUILD.md.
// Audio sources and licences: studio/public/audio/LICENSES.md (music: Kevin MacLeod, CC BY 4.0 - credit in the
// description; SFX: Mixkit Free License).
import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { FPS, SceneTiming, VoLine, buildTimeline } from "../../lib/timeline";
import vo from "./vo.json";

/**
 * Timeline overrides (seconds ADDED to a line's pauseAfter), keyed "scene:lineIndex". Declared here, not in
 * script.json, so the voice run is untouched (storyboard §5, "Script changes" 5):
 *  - l01:5, l04:4, l06:7 - room for the BlackBeat + sting (≈ 0.5 s) and the next act's ChapterCard (≈ 2 s) at the END
 *    of the scene that closes the act (shots 2-00, 5-00, 7-00 are drawn in the tail of l01 / l04 / l06; see
 *    `actBreakAt` in shots.ts). The card is on screen before the next scene's lead-in, so no narration runs under it.
 *  - l08:7 (script line 66) - the 14-s music-only ladder replay M-01 after the BlackBeat (storyboard §2, §3 "M-01").
 */
export const HOLDS: Record<string, number> = {
  "l01:5": 2.4,
  "l04:4": 2.4,
  "l06:7": 2.4,
  "l08:7": 14,
};

/** The L13 tease (script line 71, closer index 4) is not voiced yet: estimated at Aoede's measured ~183 wpm until the
 *  next voice run writes its take into vo.json (takes are cached by text hash, so only this line is synthesised). */
const TEASE: VoLine = {
  scene: "closer",
  index: 4,
  text: "Next time, the same question for sound. How loud can a noise get before the air itself gives up?",
  file: "",
  seconds: 6.3,
  pauseAfter: 0.55,
  estimated: true,
};

const voiced = vo as VoLine[];
const withTease = voiced.some((l) => l.scene === "closer" && l.index === 4) ? voiced : [...voiced, TEASE];
export const LINES: VoLine[] = withTease.map((l) => {
  const extra = HOLDS[`${l.scene}:${l.index}`];
  return extra ? { ...l, pauseAfter: l.pauseAfter + extra } : l;
});

export const timeline = buildTimeline(LINES);
export const scene = (id: string) => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`L12: no scene "${id}" in vo.json`);
  return s as SceneTiming;
};

/** Scene ids in narration order with their storyboard names, families and script line ranges. */
export const SCENE_INFO = [
  { id: "cold", name: "Cold open", family: "dusk", lines: "0-5", act: "I" },
  { id: "l01", name: "1 · The stack", family: "studio", lines: "6-11", act: "I" },
  { id: "l02", name: "2 · The root", family: "ember / noon", lines: "12-19", act: "I" },
  { id: "l03", name: "3 · The dough", family: "ember → studio/noon → noon", lines: "20-25", act: "II" },
  { id: "l04", name: "4 · The saw", family: "noon winter → studio → petrol", lines: "26-30", act: "II" },
  { id: "l05", name: "5 · The mountain in the sea", family: "noon / petrol / void", lines: "31-40", act: "II" },
  { id: "l06", name: "6 · Why Everest is rising", family: "dusk / noon", lines: "41-48", act: "III" },
  { id: "l07", name: "7 · Other worlds", family: "studio / void / Mars / ember / Venus", lines: "49-58", act: "III" },
  { id: "l08", name: "8 · Where the rule breaks", family: "void high key → studio", lines: "59-66", act: "IV" },
  { id: "closer", name: "Closer", family: "studio → dusk → void → petrol", lines: "67-71", act: "IV" },
] as const;

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
