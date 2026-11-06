// L11 "How deep can we dig?" - the full episode (composition `l11`): every scene in narration order, the voice,
// a music bed per act, and each scene's own SFX list. The cold open keeps its own sound design (SoundCold).
// Audio sources and licences: studio/public/audio/LICENSES.md (music: Kevin MacLeod, CC BY 4.0 - credit in the
// description; SFX: Mixkit Free License).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { P } from "../../lib/illustrated";
import { SceneTiming } from "../../lib/timeline";
import { ColdOpen } from "./scenes/Cold";
import { Cue } from "./scenes/cue-types";
import { SceneL01, soundL01 } from "./scenes/S01";
import { SceneL02, soundL02 } from "./scenes/S02";
import { SceneL03, soundL03 } from "./scenes/S03";
import { SceneL04, soundL04 } from "./scenes/S04";
import { SceneL05, soundL05 } from "./scenes/S05";
import { SceneL06, soundL06 } from "./scenes/S06";
import { SceneL07, soundL07 } from "./scenes/S07";
import { SceneL08, soundL08 } from "./scenes/S08";
import { SceneL09, soundL09 } from "./scenes/S09";
import { SceneCloser, soundCloser, closerTail } from "./scenes/Closer";
import { SoundCold, Sfx, timeline } from "./Episode";

type SceneDef = { id: string; Body: React.FC<{ t: SceneTiming }>; sound: (t: SceneTiming) => Cue[] };

const SCENES: SceneDef[] = [
  { id: "l01", Body: SceneL01, sound: soundL01 },
  { id: "l02", Body: SceneL02, sound: soundL02 },
  { id: "l03", Body: SceneL03, sound: soundL03 },
  { id: "l04", Body: SceneL04, sound: soundL04 },
  { id: "l05", Body: SceneL05, sound: soundL05 },
  { id: "l06", Body: SceneL06, sound: soundL06 },
  { id: "l07", Body: SceneL07, sound: soundL07 },
  { id: "l08", Body: SceneL08, sound: soundL08 },
  { id: "l09", Body: SceneL09, sound: soundL09 },
  { id: "closer", Body: SceneCloser, sound: soundCloser },
];

const scene = (id: string) => timeline.scenes.find((s) => s.id === id) as SceneTiming;
const cold = scene("cold");
const closer = scene("closer");
export const l11Frames = closer.from + closer.frames + closerTail;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const db = (x: number) => Math.pow(10, x / 20);

/** 1 while any narration line plays (short ramps either side), 0 in the gaps: drives the music duck. */
const speaking = (f: number) => {
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

/** A music bed from `from` to `to` (composition frames): crossfades in and out, ducked under the voice.
 *  `gain` evens out the tracks' own loudness (Floating Cities is ~5 dB quieter than the others). */
const Bed: React.FC<{ file: string; from: number; to: number; gain?: number; trim?: number; fade?: number }> = ({
  file,
  from,
  to,
  gain = 0,
  trim = 0,
  fade = 45,
}) => (
  <Sequence from={from} durationInFrames={to - from} name={`music ${file}`} layout="none">
    <Audio
      src={staticFile(`audio/music/${file}`)}
      trimBefore={Math.round(trim * 30)}
      volume={(f) =>
        db(gain) *
        interpolate(speaking(from + f), [0, 1], [db(-15), db(-22)]) *
        interpolate(f, [0, fade], [0, 1], clamp) *
        interpolate(f, [to - from - fade, to - from], [1, 0], clamp)
      }
    />
  </Sequence>
);

const Music: React.FC = () => {
  const act2 = scene("l05").from;
  const act3 = scene("l08").from;
  return (
    <>
      {/* act 1 (the target, the long reach, the slow race, the wrong map): calm, forward motion */}
      <Bed file="macleod-jellyfish-in-space.mp3" from={scene("l01").from - 20} to={act2 + 25} />
      {/* act 2 (heat, a hole that won't stay a hole, the stop): the darker bed */}
      <Bed file="macleod-ossuary-6-air.mp3" from={act2 - 25} to={act3 + 25} />
      {/* act 3 (has anyone beaten it, the ocean shortcut): quiet and curious */}
      <Bed file="macleod-ossuary-5-rest.mp3" from={act3 - 25} to={closer.from + 25} />
      {/* closer and end card: wonder */}
      <Bed file="macleod-floating-cities.mp3" from={closer.from - 25} to={l11Frames} gain={5} fade={60} />
    </>
  );
};

export const FullL11: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.bone }}>
    <Sequence from={cold.from} durationInFrames={cold.frames} name="cold">
      <ColdOpen t={cold} />
    </Sequence>
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

    <Sequence from={0} durationInFrames={cold.frames + 45} name="sound cold" layout="none">
      <SoundCold />
    </Sequence>
    <Music />
    {SCENES.flatMap(({ id, sound }) => {
      const t = scene(id);
      return sound(t).map((c, k) => <Sfx key={`${id}-${k}`} {...c} at={t.from + c.at} />);
    })}
  </AbsoluteFill>
);
