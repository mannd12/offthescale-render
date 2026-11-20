// L18MOONLOWORBIT "What If the Moon Orbited as Low as the Space Station?" - the full episode (composition `L18MoonLowOrbit`): every scene in narration order, the voice, each scene's own
// SFX list, the music beds (BUILD.md §2, a different mix from L16's and L17's), the 20-s end card (drawn HERE over the
// closer's tail: package B's SceneCloser only fills the closer's own frames) and the three key-art stills (`l18-key-1..3`,
// storyboard §2). Audio licences: studio/public/audio/LICENSES.md.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { EndCard, Layer, Stage } from "../../lib/illustrated";
import { SceneTiming, lineAt, within } from "../../lib/timeline";
import { Bed, Sfx, scene, timeline } from "./Episode";
import { familyOf } from "./families";
import { StarsTint18 } from "./movers18";
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
export const L18MoonLowOrbitFrames = closer.from + closer.frames + closerTail;

/** Composition frame of a point in the episode: scene id + line index (within the scene) + fraction of that line. */
export const frameOf = (sceneId: string, line: number, fraction = 0) => {
  const t = scene(sceneId);
  return t.from + within(t, line, fraction);
};

/** Music beds (all Kevin MacLeod, CC BY 4.0, logged in public/audio/LICENSES.md; credit lines in the description).
 *  BUILD.md §2's plan; neighbours crossfade 60 f. */
const Music: React.FC = () => {
  const at = (id: string) => scene(id).from;
  return (
    <>
      {/* cold: the rail, the numbers; curious drone */}
      <Bed file="macleod-mirage.mp3" from={0} to={at("l01") + 30} fade={30} />
      {/* l01: the Moon fills the sky; wonder */}
      <Bed file="macleod-floating-cities.mp3" from={at("l01") - 30} to={at("l02") + 30} />
      {/* l02-l03: orbits, the hover; soft forward motion */}
      <Bed file="macleod-jellyfish-in-space.mp3" from={at("l02") - 30} to={at("l04") + 30} />
      {/* l04: the two lines; a lift */}
      <Bed file="macleod-soaring.mp3" from={at("l04") - 30} to={at("l05") + 30} />
      {/* l05-l06: the stretch, the model; a slow build */}
      <Bed file="macleod-ossuary-2-turn.mp3" from={at("l05") - 30} to={at("l07") + 30} />
      {/* l07: the ladder reads out; slow weight */}
      <Bed file="macleod-impact-lento.mp3" from={at("l07") - 30} to={at("l08") + 30} />
      {/* l08: the honest board; reflective */}
      <Bed file="macleod-mana-two-part-2.mp3" from={at("l08") - 30} to={at("closer") + 30} />
      {/* closer: calm rest */}
      <Bed file="macleod-ossuary-5-rest.mp3" from={at("closer") - 30} to={at("closer") + 960} />
      {/* end card (overlaps the rest bed by 30 f: a crossfade, not a dip) */}
      <Bed file="macleod-floating-cities.mp3" from={at("closer") + 960} to={L18MoonLowOrbitFrames} fade={60} />
    </>
  );
};

/** The 20-s end card over a dark `abyss` field with tinted stars sliding (never a frozen frame). */
const EndTail: React.FC = () => {
  const f = useCurrentFrame();
  const F = familyOf("abyss");
  return (
    <Stage theme={F.theme} shotFrame={f} grain={0.5}>
      <rect x={-400} y={-400} width={2720} height={1880} fill={F.sky[0]} />
      <StarsTint18 f={f} x={-100} y={-100} w={2120} h={1280} n={120} speed={3} angle={200} />
      <Layer depth={0}>
        <EndCard t={f / closerTail} family={F} />
      </Layer>
    </Stage>
  );
};

export const FullL18MOONLOWORBIT: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#01121B" }}>
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
    <Sequence from={closer.from + closer.frames} durationInFrames={closerTail} name="end card">
      <EndTail />
    </Sequence>
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
    <AbsoluteFill style={{ backgroundColor: "#01121B" }}>
      <Sequence from={-at} name={`${sceneId}@${at}`}>
        <def.Body t={t} />
      </Sequence>
    </AbsoluteFill>
  );
};

/** Scene frame 40 % into a shot that starts at line `a` fraction `fa` and ends where the next shot starts (line `b`,
 *  fraction `fb`; b = -1 → the scene's end): the same rule as BUILD.md §6's still lists, so the key art follows a re-voice. */
const shot40 = (sceneId: string, a: number, fa: number, b: number, fb: number) => {
  const t = scene(sceneId);
  const s = within(t, a, fa);
  const e = b < 0 ? t.frames : fb === 0 ? lineAt(t, b) : within(t, b, fb);
  return s + Math.round(0.4 * (e - s));
};

/** Key art (storyboard §2), one still per act; builders fill the shots and the stills follow.
 *  I   1-07 the Moon fills the sky: l01 line 2 at 40 % → 1-08 at 76 % (L18MoonLowOrbit@1933 with the 2026-11-19 voice)
 *  II  5-05 the Earth pulls the near side: l05 line 1 at 37 % → 5-05b at 79 % (@8299)
 *  III 6-16 the ring: l06 line 5 at 68 % → the scene's end, hold included (@11208) */
export const KeyArt1: React.FC = () => <SceneFrame sceneId="l01" at={shot40("l01", 2, 0.4, 2, 0.76)} />;
export const KeyArt2: React.FC = () => <SceneFrame sceneId="l05" at={shot40("l05", 1, 0.37, 1, 0.79)} />;
export const KeyArt3: React.FC = () => <SceneFrame sceneId="l06" at={shot40("l06", 5, 0.68, -1, 0)} />;
