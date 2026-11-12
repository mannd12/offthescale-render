// L13 "How loud can a sound get?" - the full episode (composition `l13`): every scene in
// narration order, the voice, a music bed per act (storyboard §3 SFX column: "music bed 1 lifts" on ChapterCard 1,
// "music bed 2" on ChapterCard 2, "music bed 3" on ChapterCard 3), each scene's own SFX list, the 10-s music-only ring
// replay M-01 (in l08's tail) and the 20-s end card (in the closer's tail). Also the three key-art stills
// `l13-key-1..3` (storyboard §2), each a frame inside its act's scene.
// Audio sources and licences: studio/public/audio/LICENSES.md (music: Kevin MacLeod, CC BY 4.0 - credit in the
// description; SFX: Mixkit Free License).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { P } from "../../lib/illustrated";
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
export const l13Frames = closer.from + closer.frames + closerTail;

/** Composition frame of a point in the episode: scene id + line index (within the scene) + fraction of that line.
 *  This is what `id@frame` review stills and the key-art stills use (BUILD.md lists the ranges). */
export const frameOf = (sceneId: string, line: number, fraction = 0) => {
  const t = scene(sceneId);
  return t.from + within(t, line, fraction);
};

/** Music beds (storyboard §3; all Kevin MacLeod, CC BY 4.0, logged in public/audio/LICENSES.md; credit in the
 *  description). Bed changes land on the chapter cards; M-01 is music only and swells into the end card. */
const Music: React.FC = () => {
  const cold = scene("cold");
  const card1 = cold.from + cold.lines[6].at - 4; // ChapterCard 1 plays over cold line 6 (C-13): "music bed 1 lifts"
  const end = (id: string) => {
    const t = scene(id);
    const last = t.lines[t.lines.length - 1];
    return t.from + last.at + last.audioFrames;
  };
  const card2 = end("l03") + 18; // after l03's BlackBeat: ChapterCard 2 (4-00), "music bed 2"
  const card3 = end("l06") + 18; // ChapterCard 3 (7-00), "music bed 3"
  const replay = end("l08") + 6; // M-01: the music-only ring replay
  return (
    <>
      {/* Hook: "Mirage" (drone, calm/eerie/mysterious) under the island morning and the sound from nowhere */}
      <Bed file="macleod-mirage.mp3" from={0} to={card1 + 30} trim={4} fade={30} />
      {/* Act I, the ceiling: "Ossuary 2 - Turn" (dark/mysterious with a gentle build) from the title card */}
      <Bed file="macleod-ossuary-2-turn.mp3" from={card1 - 10} to={card2 + 20} />
      {/* Act II, a rocket and a volcano: "Jellyfish in Space" (curious, soft forward motion) under the evidence */}
      <Bed file="macleod-jellyfish-in-space.mp3" from={card2 - 10} to={card3 + 20} />
      {/* Act III, the twin and other media: "Soaring" (wonder, gentle lift) */}
      <Bed file="macleod-soaring.mp3" from={card3 - 10} to={replay + 20} />
      {/* M-01 to the end card: "Floating Cities" (wonder, zoom-out endings; ~5 dB quieter than the others) */}
      <Bed file="macleod-floating-cities.mp3" from={replay - 20} to={l13Frames} gain={5} fade={60} />
    </>
  );
};

export const FullL13: React.FC = () => (
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

/** Key art (storyboard §2), one still per act. Builders fill the shots; the stills follow automatically.
 *  I   3-14  the shock wall, l03 line 5 at 85 % (l13@5454)
 *  II  6-14  "One Instrument", l06 line 6 at 25 % (l13@11409)
 *  III 8-05  the sperm whale, l08 line 2 at 30 % (l13@14580) */
export const KeyArt1: React.FC = () => <SceneFrame sceneId="l03" line={5} fraction={0.85} />;
export const KeyArt2: React.FC = () => <SceneFrame sceneId="l06" line={6} fraction={0.25} />;
export const KeyArt3: React.FC = () => <SceneFrame sceneId="l08" line={2} fraction={0.3} />;
