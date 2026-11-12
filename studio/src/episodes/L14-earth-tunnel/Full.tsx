// L14 "What if you fell through the Earth?" - the full episode (composition `l14`): every scene in narration order, the voice, each scene's own
// SFX list and the 20-s end card (in the closer's tail), the eight music beds (storyboard §6, the `Bed` helper in
// Episode.tsx) and the three key-art stills `l14-key-1..3` (storyboard §2). Audio licences: studio/public/audio/LICENSES.md.
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
export const l14Frames = closer.from + closer.frames + closerTail;

/** Composition frame of a point in the episode: scene id + line index (within the scene) + fraction of that line. */
export const frameOf = (sceneId: string, line: number, fraction = 0) => {
  const t = scene(sceneId);
  return t.from + within(t, line, fraction);
};

/** Music beds (storyboard §6; all Kevin MacLeod, CC BY 4.0, logged in public/audio/LICENSES.md; credit in the
 *  description). Each bed starts or changes on a beat (a card or a scene start), never mid-line; neighbours crossfade. */
const Music: React.FC = () => {
  const cold = scene("cold");
  const card1 = cold.from + cold.lines[2].at; // ChapterCard 1 over cold line 2 (C-10): the bed lifts
  const end = (id: string) => {
    const t = scene(id);
    const last = t.lines[t.lines.length - 1];
    return t.from + last.at + last.audioFrames;
  };
  const card2 = end("l03") + 16; // after l03's BlackBeat (16 f): ChapterCard 2 lifts "Mana Two"
  const card3 = end("l06") + 36; // after l06's BlackBeat (36 f): ChapterCard 3 lifts "Impact Lento"
  const at = (id: string) => scene(id).from;
  return (
    <>
      {/* C-01…C-09: drone, calm and mysterious under the famous number cracking */}
      <Bed file="macleod-mirage.mp3" from={0} to={card1 + 30} fade={30} />
      {/* card 1 → l01-l02: the curious bed for the textbook and the real Earth */}
      <Bed file="macleod-jellyfish-in-space.mp3" from={card1 - 10} to={at("l03") + 30} />
      {/* l03 the villain, crossfaded in over 2-28's haze, to the BlackBeat */}
      <Bed file="macleod-ossuary-6-air.mp3" from={at("l03") - 30} to={card2 + 20} />
      {/* card 2 → l04-l05: the spin, Kola, the crust and mantle */}
      <Bed file="macleod-mana-two-part-2.mp3" from={card2 - 10} to={at("l06") + 30} />
      {/* l06 the iron seas and the numbers */}
      <Bed file="macleod-ossuary-2-turn.mp3" from={at("l06") - 30} to={card3 + 20} />
      {/* card 3 → l07: the build to the centre */}
      <Bed file="macleod-impact-lento.mp3" from={card3 - 10} to={at("l08") + 30} />
      {/* l08 friction and the stop */}
      <Bed file="macleod-ossuary-5-rest.mp3" from={at("l08") - 30} to={at("closer") + 30} />
      {/* the honest close, resolving into the end card */}
      <Bed file="macleod-soaring.mp3" from={at("closer") - 30} to={l14Frames} fade={60} />
    </>
  );
};

export const FullL14: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#03171D" }}>
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
    <AbsoluteFill style={{ backgroundColor: "#03171D" }}>
      <Sequence from={-at} name={`${sceneId}@${at}`}>
        <def.Body t={t} />
      </Sequence>
    </AbsoluteFill>
  );
};

/** Key art (storyboard §2), one still per act. Builders fill the shots; the stills follow automatically.
 *  I   3-17  the 175-km hazard band, l03 line 5 at 85 % (l14@6574)
 *  II  6-16  the iron sea, l06 line 5 at 30 % (l14@12151)
 *  III 7-05  three up, one down, l07 line 0 at 90 % (l14@14797) */
export const KeyArt1: React.FC = () => <SceneFrame sceneId="l03" line={5} fraction={0.85} />;
export const KeyArt2: React.FC = () => <SceneFrame sceneId="l06" line={5} fraction={0.3} />;
export const KeyArt3: React.FC = () => <SceneFrame sceneId="l07" line={0} fraction={0.9} />;
