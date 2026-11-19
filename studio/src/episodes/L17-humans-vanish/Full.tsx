// L17HUMANSVANISH "What If Every Human Vanished?" - the full episode (composition `L17HumansVanish`): every scene in narration order, the voice, each scene's own
// SFX list, the music beds (BUILD.md §2, a different mix from L16's), the 20-s end card (in the closer's tail) and the three
// key-art stills (`l17-key-1..3`, storyboard §2). Audio licences: studio/public/audio/LICENSES.md.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SceneTiming, lineAt, within } from "../../lib/timeline";
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
import { SceneL09, soundL09 } from "./scenes/S09";
import { SceneL10, soundL10 } from "./scenes/S10";
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
  { id: "l09", Body: SceneL09, sound: soundL09 },
  { id: "l10", Body: SceneL10, sound: soundL10 },
  { id: "closer", Body: SceneCloser, sound: soundCloser },
];

const closer = scene("closer");
export const L17HumansVanishFrames = closer.from + closer.frames + closerTail;

/** Composition frame of a point in the episode: scene id + line index (within the scene) + fraction of that line. */
export const frameOf = (sceneId: string, line: number, fraction = 0) => {
  const t = scene(sceneId);
  return t.from + within(t, line, fraction);
};

/** Music beds (all Kevin MacLeod, CC BY 4.0, logged in public/audio/LICENSES.md; credit lines in the description).
 *  BUILD.md §2's plan, a different mix from L16's. Neighbours crossfade 60 f. */
const Music: React.FC = () => {
  const at = (id: string) => scene(id).from;
  return (
    <>
      {/* cold: sparse, empty; lifts on the ONE DAY card */}
      <Bed file="macleod-ossuary-6-air.mp3" from={0} to={at("l01") + 30} fade={30} />
      {/* l01-l02: the grid, the water; quiet */}
      <Bed file="macleod-mirage.mp3" from={at("l01") - 30} to={at("l03") + 30} />
      {/* l03-l04: frost and paint; curious */}
      <Bed file="macleod-jellyfish-in-space.mp3" from={at("l03") - 30} to={at("l05") + 30} />
      {/* l05: the rust, the fall; a gentle build */}
      <Bed file="macleod-ossuary-2-turn.mp3" from={at("l05") - 30} to={at("l06") + 30} />
      {/* l06-l07 (to the air): Rome, the mountain; a lift */}
      <Bed file="macleod-soaring.mp3" from={at("l06") - 30} to={at("l07") + 930} />
      {/* l07 (the air) to l08: deep, sealed; slow */}
      <Bed file="macleod-impact-lento.mp3" from={at("l07") + 900} to={at("l09") + 30} />
      {/* l09: the Moon and the mud; wonder, quiet */}
      <Bed file="macleod-floating-cities.mp3" from={at("l09") - 30} to={at("l10") + 30} />
      {/* l10: the honest board; reflective */}
      <Bed file="macleod-mana-two-part-2.mp3" from={at("l10") - 30} to={at("closer") + 30} />
      {/* closer: calm rest */}
      <Bed file="macleod-ossuary-5-rest.mp3" from={at("closer") - 30} to={at("closer") + 990} />
      {/* end card (overlaps the rest bed by 30 f: a crossfade, not a dip) */}
      <Bed file="macleod-floating-cities.mp3" from={at("closer") + 960} to={L17HumansVanishFrames} fade={60} />
    </>
  );
};

export const FullL17HUMANSVANISH: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#06151D" }}>
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
const SceneFrame: React.FC<{ sceneId: string; at: number }> = ({ sceneId, at }) => {
  const t = scene(sceneId);
  const def = SCENES.find((s) => s.id === sceneId)!;
  return (
    <AbsoluteFill style={{ backgroundColor: "#06151D" }}>
      <Sequence from={-at} name={`${sceneId}@${at}`}>
        <def.Body t={t} />
      </Sequence>
    </AbsoluteFill>
  );
};

/** Scene frame 40 % into a shot that starts at line `a` fraction `fa` and ends where the next shot starts (line `b`,
 *  fraction `fb`): the same rule as BUILD.md §6's still lists, so the key art follows a re-voice. */
const shot40 = (sceneId: string, a: number, fa: number, b: number, fb: number) => {
  const t = scene(sceneId);
  const s = within(t, a, fa);
  const e = fb === 0 ? lineAt(t, b) : within(t, b, fb);
  return s + Math.round(0.4 * (e - s));
};

/** Key art (storyboard §2), one still per act; builders fill the shots and the stills follow.
 *  I   C-04 the scale settles level: cold line 1 at 23 % → C-05 at 59 % (L17HumansVanish@348 with the 2026-11-16 voice)
 *  II  3-05 the ice pushes the wall: l03 line 1 at 44 % → 3-06 at line 2 (@4549)
 *  III 9-02 the footprints: l09 line 0 at 49 % → 9-03 at line 1 (@12876) */
export const KeyArt1: React.FC = () => <SceneFrame sceneId="cold" at={shot40("cold", 1, 0.23, 1, 0.59)} />;
export const KeyArt2: React.FC = () => <SceneFrame sceneId="l03" at={shot40("l03", 1, 0.44, 2, 0)} />;
export const KeyArt3: React.FC = () => <SceneFrame sceneId="l09" at={shot40("l09", 0, 0.49, 1, 0)} />;
