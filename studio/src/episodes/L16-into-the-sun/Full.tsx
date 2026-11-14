// L16INTOTHESUN "What If You Flew Into the Sun?" - the full episode (composition `L16IntoTheSun`): every scene in narration order, the voice, each scene's own
// SFX list, the music beds (BUILD.md §2, a different mix from L15's) and the 20-s end card (in the closer's tail).
// Key-art stills are rendered as `L16IntoTheSun@<frame>` (BUILD.md §2). Audio licences: studio/public/audio/LICENSES.md.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SceneTiming, within } from "../../lib/timeline";
import { Bed, Sfx, scene, timeline } from "./Episode";
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
export const L16IntoTheSunFrames = closer.from + closer.frames + closerTail;

/** Composition frame of a point in the episode: scene id + line index (within the scene) + fraction of that line. */
export const frameOf = (sceneId: string, line: number, fraction = 0) => {
  const t = scene(sceneId);
  return t.from + within(t, line, fraction);
};

/** Music beds (all Kevin MacLeod, CC BY 4.0, logged in public/audio/LICENSES.md; credit lines in the description).
 *  BUILD.md §2's plan, a different order from L15's. Each bed changes at a scene start; neighbours crossfade 60 f. */
const Music: React.FC = () => {
  const at = (id: string) => scene(id).from;
  return (
    <>
      {/* cold: slow start, warm pads; lifts on the card (C-13) */}
      <Bed file="macleod-impact-lento.mp3" from={0} to={at("l01") + 30} fade={30} />
      {/* l01-l02: forward motion, curious */}
      <Bed file="macleod-jellyfish-in-space.mp3" from={at("l01") - 30} to={at("l03") + 30} />
      {/* l03: the first touch, a gentle lift */}
      <Bed file="macleod-soaring.mp3" from={at("l03") - 30} to={at("l04") + 30} />
      {/* l04: the mystery drone */}
      <Bed file="macleod-mirage.mp3" from={at("l04") - 30} to={at("l05") + 30} />
      {/* l05-l06: the descent, a gentle build */}
      <Bed file="macleod-ossuary-2-turn.mp3" from={at("l05") - 30} to={at("l07") + 30} />
      {/* l07: the core, tense and ghostly */}
      <Bed file="macleod-ossuary-6-air.mp3" from={at("l07") - 30} to={at("l08") + 30} />
      {/* l08: the honest board, reflective */}
      <Bed file="macleod-mana-two-part-2.mp3" from={at("l08") - 30} to={at("closer") + 30} />
      {/* closer: calm rest */}
      <Bed file="macleod-ossuary-5-rest.mp3" from={at("closer") - 30} to={at("closer") + 990} />
      {/* end card (overlaps the rest bed by 30 f so the change is a crossfade, not a dip) */}
      {/* end card: wonder, a zoom-out ending */}
      <Bed file="macleod-floating-cities.mp3" from={at("closer") + 960} to={L16IntoTheSunFrames} fade={60} />
    </>
  );
};

export const FullL16INTOTHESUN: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#04051A" }}>
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
