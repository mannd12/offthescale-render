// L12 "Why can't mountains get much taller than Everest?" - the full episode (composition `l12`): every scene in
// narration order, the voice, a music bed per act (storyboard §3 "Music beds"), each scene's own SFX list, the 14-s
// music-only replay (in l08's tail) and the 20-s end card (in the closer's tail). Also the four key-art stills
// `l12-key-1..4` (storyboard §6), each a frame inside its act's scene.
// Audio sources and licences: studio/public/audio/LICENSES.md (music: Kevin MacLeod, CC BY 4.0 - credit in the
// description; SFX: Mixkit Free License).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { P } from "../../lib/illustrated";
import { SceneTiming, within } from "../../lib/timeline";
import { Sfx, scene, timeline, voiceEnv } from "./Episode";
import { Cue } from "./scenes/cue-types";
import { SceneCold, soundCold } from "./scenes/Cold";
import { SceneL01, soundL01 } from "./scenes/S01";
import { SceneL02, soundL02 } from "./scenes/S02";
import { SceneL03, soundL03 } from "./scenes/S03";
import { SceneL04, soundL04 } from "./scenes/S04";
import { SceneL05, soundL05 } from "./scenes/S05";
import { SceneL06, soundL06 } from "./scenes/S06";
import { SceneL07, soundL07 } from "./scenes/S07";
import { SceneL08, soundL08 } from "./scenes/S08";
import { SceneCloser, closerTail, soundCloser } from "./scenes/Closer";

type SceneDef = { id: string; Body: React.FC<{ t: SceneTiming }>; sound: (t: SceneTiming) => Cue[] };

export const SCENES: SceneDef[] = [
  { id: "cold", Body: SceneCold, sound: soundCold },
  { id: "l01", Body: SceneL01, sound: soundL01 },
  { id: "l02", Body: SceneL02, sound: soundL02 },
  { id: "l03", Body: SceneL03, sound: soundL03 },
  { id: "l04", Body: SceneL04, sound: soundL04 },
  { id: "l05", Body: SceneL05, sound: soundL05 },
  { id: "l06", Body: SceneL06, sound: soundL06 },
  { id: "l07", Body: SceneL07, sound: soundL07 },
  { id: "l08", Body: SceneL08, sound: soundL08 },
  { id: "closer", Body: SceneCloser, sound: soundCloser },
];

const closer = scene("closer");
export const l12Frames = closer.from + closer.frames + closerTail;

/** Composition frame of a point in the episode: scene id + line index (within the scene) + fraction of that line.
 *  This is what `id@frame` review stills and the key-art stills use (BUILD.md lists the ranges). */
export const frameOf = (sceneId: string, line: number, fraction = 0) => {
  const t = scene(sceneId);
  return t.from + within(t, line, fraction);
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const db = (x: number) => Math.pow(10, x / 20);

/** A music bed from `from` to `to` (composition frames): crossfades in and out, ducked −22 dB under the voice (L11's
 *  voiceEnv recipe). `gain` evens out the tracks' own loudness (Floating Cities is ~5 dB quieter than the others). */
const Bed: React.FC<{ file: string; from: number; to: number; gain?: number; trim?: number; fade?: number }> = ({ file, from, to, gain = 0, trim = 0, fade = 45 }) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)} name={`music ${file}`} layout="none">
    <Audio
      src={staticFile(`audio/music/${file}`)}
      trimBefore={Math.round(trim * 30)}
      volume={(f) =>
        db(gain) *
        interpolate(voiceEnv(from + f), [0, 1], [db(-15), db(-22)]) *
        interpolate(f, [0, fade], [0, 1], clamp) *
        interpolate(f, [to - from - fade, to - from], [1, 0], clamp)
      }
    />
  </Sequence>
);

/** Music beds per act (storyboard §3 "Music beds"; all Kevin MacLeod, CC BY 4.0, in LICENSES.md). */
const Music: React.FC = () => {
  const cold = scene("cold");
  const card1 = cold.from + cold.lines[5].at - 2; // ChapterCard 1 lands over line 5 (C-11)
  const act2 = scene("l03").from;
  const card3 = scene("l05").from; // ChapterCard 3 is drawn in l04's tail; the bed changes as scene 5 opens
  const act3 = scene("l06").from;
  const act4 = scene("l08").from;
  const l08 = scene("l08");
  const last8 = l08.lines[l08.lines.length - 1];
  const replay = l08.from + last8.at + last8.audioFrames + 24; // M-01: the 14-s music-only ladder replay
  return (
    <>
      {/* Act I: "Mirage" under the hook; "Jellyfish in Space" lifts in on ChapterCard 1 and carries scenes 1-2 */}
      <Bed file="macleod-mirage.mp3" from={0} to={card1 + 30} trim={4} fade={30} />
      <Bed file="macleod-jellyfish-in-space.mp3" from={card1 - 10} to={act2 + 25} />
      {/* Act II: "Mana Two - Part 2" (the dough, the saw) → "Ossuary 2 - Turn" from ChapterCard 3 (the mountain in the sea) */}
      <Bed file="macleod-mana-two-part-2.mp3" from={act2 - 25} to={card3 + 25} />
      <Bed file="macleod-ossuary-2-turn.mp3" from={card3 - 25} to={act3 + 25} />
      {/* Act III: "Soaring" (why Everest is rising, other worlds) */}
      <Bed file="macleod-soaring.mp3" from={act3 - 25} to={act4 + 25} />
      {/* Act IV: "Ossuary 5 - Rest" (where the rule breaks, the honesty notes) → "Floating Cities" from M-01 to the end card */}
      <Bed file="macleod-ossuary-5-rest.mp3" from={act4 - 25} to={replay + 20} />
      <Bed file="macleod-floating-cities.mp3" from={replay - 20} to={l12Frames} gain={5} fade={60} />
    </>
  );
};

export const FullL12: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.bone }}>
    {SCENES.map(({ id, Body }) => {
      const t = scene(id);
      const len = t.frames + (id === "closer" ? closerTail : 0);
      return (
        <Sequence key={id} from={t.from} durationInFrames={len} name={id}>
          <Body t={t} />
        </Sequence>
      );
    })}

    {timeline.scenes.flatMap((s) =>
      s.lines
        .filter((l) => !l.estimated)
        .map((l) => (
          <Sequence key={l.file} from={l.from} durationInFrames={l.audioFrames + 3} name={`vo ${s.id} ${l.index}`}>
            <Audio src={staticFile(l.file)} />
          </Sequence>
        )),
    )}

    <Music />
    {SCENES.flatMap(({ id, sound }) => {
      const t = scene(id);
      return sound(t).map((c, k) => <Sfx key={`${id}-${k}`} {...c} at={t.from + c.at} />);
    })}
  </AbsoluteFill>
);

/** A single frame of one scene, for the key-art stills: the scene body is played at scene frame `at`. */
const SceneFrame: React.FC<{ sceneId: string; line: number; fraction: number; offset?: number }> = ({ sceneId, line, fraction, offset = 0 }) => {
  const t = scene(sceneId);
  const def = SCENES.find((s) => s.id === sceneId)!;
  const at = within(t, line, fraction) + offset;
  return (
    <AbsoluteFill style={{ backgroundColor: P.bone }}>
      <Sequence from={-at} name={`${sceneId}@${at}`}>
        <def.Body t={t} />
      </Sequence>
    </AbsoluteFill>
  );
};

/** Key art (storyboard §6), one still per act. Builders fill the shots; the stills follow automatically.
 *  I   C-10  cold open, line 4 at 60 %: the base swells under the summit
 *  II  5-03  the mountain in the sea, line 32 (l05 index 1) at 50 %: Mauna Kea from the sea floor, two gauges
 *  III 7-07  other worlds, line 52 (l07 index 3) at 20 %: Olympus Mons under the ochre sky
 *  IV  Z-03  closer, line 68 (closer index 1) at 25 %: Tick between the 1-m Earth ball and the 0.5-m Mars ball */
export const KeyArt1: React.FC = () => <SceneFrame sceneId="cold" line={4} fraction={0.6} />;
export const KeyArt2: React.FC = () => <SceneFrame sceneId="l05" line={1} fraction={0.5} />;
export const KeyArt3: React.FC = () => <SceneFrame sceneId="l07" line={3} fraction={0.2} />;
export const KeyArt4: React.FC = () => <SceneFrame sceneId="closer" line={1} fraction={0.25} />;
