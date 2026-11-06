// L11 "How deep can we dig?" - first illustrated episode. So far only the cold open is built; `l11-test` plays it
// with narration, a music bed and spot SFX, as the motion test of the illustrated format (docs/STYLE-ILLUSTRATED.md).
// Audio sources and licences: studio/public/audio/LICENSES.md (music: Kevin MacLeod, CC BY 4.0 - credit in the
// description; SFX: Mixkit Free License).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { P } from "../../lib/illustrated";
import { SceneTiming, VoLine, buildTimeline } from "../../lib/timeline";
import vo from "./vo.json";
import { ColdOpen } from "./scenes/Cold";
import { coldCues } from "./cues";

const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);
const cold = timeline.scenes.find((s) => s.id === "cold") as SceneTiming;
const TAIL = 45;
export const l11TestFrames = cold.frames + TAIL;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const db = (x: number) => Math.pow(10, x / 20);

/** 1 while the narrator speaks (with short ramps either side), 0 in the gaps: drives the music duck. */
const voiceEnv = (f: number) => {
  let v = 0;
  for (const l of cold.lines) {
    if (l.estimated) continue;
    const a = cold.from + l.at;
    const b = a + l.audioFrames;
    v = Math.max(v, interpolate(f, [a - 8, a, b, b + 12], [0, 1, 1, 0], clamp));
  }
  return v;
};

/** One spot effect: starts at `at` (composition frame), optional trim (s), length cap and fades (frames). */
const Sfx: React.FC<{ at: number; file: string; vol: number; dur?: number; trim?: number; fadeIn?: number; fadeOut?: number }> = ({
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
      trimBefore={Math.round(trim * 30)}
      volume={(f) => vol * (fadeIn ? interpolate(f, [0, fadeIn], [0, 1], clamp) : 1) * (fadeOut ? interpolate(f, [dur - fadeOut, dur], [1, 0], clamp) : 1)}
    />
  </Sequence>
);

const SoundCold: React.FC = () => {
  const c = coldCues(cold);
  const o = cold.from;
  const title = o + c.title;
  const end = l11TestFrames;
  // Music: "Mirage" (calm, curious drone) under the hook; "Floating Cities" (wonder) lifts in on the title.
  // Levels: about -22 dB under the voice, opening ~7 dB in the gaps (both tracks measured; Floating Cities is ~5 dB
  // quieter, so it gets 5 dB more gain for the same place in the mix).
  const mirage = (f: number) => {
    const duck = interpolate(voiceEnv(f), [0, 1], [db(-15), db(-22)]);
    return duck * interpolate(f, [0, 20], [0, 1], clamp) * interpolate(f, [title - 4, title + 26], [1, 0], clamp);
  };
  const lift = (f: number) => {
    const F = f + title - 10;
    const duck = interpolate(voiceEnv(F), [0, 1], [db(-10), db(-17)]);
    return duck * interpolate(F, [title - 10, title + 10], [0, 1], clamp) * interpolate(F, [end - 30, end], [1, 0], clamp);
  };
  return (
    <>
      <Sequence from={0} durationInFrames={title + 30} name="music Mirage" layout="none">
        <Audio src={staticFile("audio/music/macleod-mirage.mp3")} trimBefore={4 * 30} volume={mirage} />
      </Sequence>
      <Sequence from={title - 10} durationInFrames={end - title + 10} name="music Floating Cities" layout="none">
        <Audio src={staticFile("audio/music/macleod-floating-cities.mp3")} volume={lift} />
      </Sequence>

      {/* surface: wind bed, label ticks, the cap */}
      <Sfx at={o} file="mixkit-2658-wind-ambience.mp3" vol={0.2} dur={c.section + 8} fadeIn={20} fadeOut={14} />
      <Sfx at={o + c.kola} file="mixkit-2568-ui-click-tone.mp3" vol={0.32} dur={20} />
      <Sfx at={o + c.arctic} file="mixkit-2356-ui-pop-dry.mp3" vol={0.28} dur={20} />
      <Sfx at={o + c.cap - 6} file="mixkit-1489-whoosh-air.mp3" vol={0.28} dur={50} />
      {[0, 2, 4, 6].map((i) => (
        <Sfx key={i} at={o + c.bolted + i * 3} file="mixkit-2568-ui-click-tone.mp3" vol={0.14} dur={12} />
      ))}
      <Sfx at={o + c.width} file="mixkit-2568-ui-click-tone.mp3" vol={0.32} dur={20} />
      <Sfx at={o + c.plate - 2} file="mixkit-2604-whoosh-deep-air.mp3" vol={0.3} dur={60} />
      <Sfx at={o + c.plateLand} file="mixkit-2358-ui-pop-long.mp3" vol={0.28} dur={20} />

      {/* the hole: swirl into the section, rumble down the dive, boom as the gauge runs off the scale */}
      <Sfx at={o + c.section - 4} file="mixkit-1493-whoosh-swirl.mp3" vol={0.28} dur={50} />
      <Sfx at={o + c.dive} file="mixkit-2604-whoosh-deep-air.mp3" vol={0.32} dur={60} />
      <Sfx at={o + c.dive} file="mixkit-2297-rumble-bass-hum.mp3" vol={0.5} dur={c.bottom - c.dive + 24} fadeIn={8} fadeOut={20} />
      <Sfx at={o + c.dive + 12} file="mixkit-403-rock-debris-falling.mp3" vol={0.18} dur={c.bottom - c.dive} fadeOut={14} />
      <Sfx at={o + c.bottom + 9} file="mixkit-788-boom-cinematic-impact.mp3" vol={0.5} dur={150} fadeOut={40} />
      <Sfx at={o + c.ocean + 4} file="mixkit-1489-whoosh-air.mp3" vol={0.28} dur={50} />
      <Sfx at={o + c.oceanLand} file="mixkit-2358-ui-pop-long.mp3" vol={0.26} dur={20} />
      <Sfx at={o + c.spare} file="mixkit-2568-ui-click-tone.mp3" vol={0.32} dur={20} />

      {/* the crust, twenty years of drilling, the stop, the planet */}
      <Sfx at={o + c.crust} file="mixkit-2604-whoosh-deep-air.mp3" vol={0.32} dur={60} />
      <Sfx at={o + c.third} file="mixkit-2568-ui-click-tone.mp3" vol={0.3} dur={20} />
      <Sfx at={o + c.third + 16} file="mixkit-2356-ui-pop-dry.mp3" vol={0.24} dur={20} />
      <Sfx at={o + c.rig} file="mixkit-855-drill-electric.mp3" vol={0.14} dur={c.stopped - c.rig + 3} fadeIn={6} fadeOut={4} />
      <Sfx at={o + c.stopped - 8} file="mixkit-2356-ui-pop-dry.mp3" vol={0.26} dur={20} />
      <Sfx at={o + c.planet} file="mixkit-1493-whoosh-swirl.mp3" vol={0.32} dur={50} />
      <Sfx at={o + c.planet + 30} file="mixkit-3108-chime-crystal.mp3" vol={0.24} dur={60} />

      {/* the villain, then the riser into the title */}
      <Sfx at={o + c.fought} file="mixkit-1686-boom-underground-echo.mp3" vol={0.5} dur={120} />
      <Sfx at={o + c.fought} file="mixkit-2297-rumble-bass-hum.mp3" vol={0.42} dur={c.title - c.fought + 10} fadeIn={4} fadeOut={14} />
      <Sfx at={o + c.fought + 6} file="mixkit-403-rock-debris-falling.mp3" vol={0.3} dur={c.title - c.fought} fadeOut={12} />
      <Sfx at={title - 120} file="mixkit-645-riser-synth.mp3" vol={0.24} trim={5} dur={124} fadeIn={30} />
      <Sfx at={title} file="mixkit-788-boom-cinematic-impact.mp3" vol={0.42} dur={150} fadeOut={40} />
      <Sfx at={o + c.andIf} file="mixkit-1489-whoosh-air.mp3" vol={0.22} dur={50} />
      <Sfx at={o + c.anotherWay} file="mixkit-3108-chime-crystal.mp3" vol={0.16} dur={60} />
      <Sfx at={title} file="mixkit-2658-wind-ambience.mp3" vol={0.12} trim={20} dur={end - title} fadeIn={30} fadeOut={30} />
    </>
  );
};

/** Motion test: the cold open alone, with narration, music and SFX (composition `l11-test`). */
export const TestL11: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.bone }}>
    <Sequence from={cold.from} durationInFrames={l11TestFrames - cold.from} name="cold">
      <ColdOpen t={cold} />
    </Sequence>
    {cold.lines
      .filter((l) => !l.estimated)
      .map((l) => (
        <Sequence key={l.file} from={l.from} durationInFrames={l.audioFrames + 3} name={`vo cold ${l.index}`}>
          <Audio src={staticFile(l.file)} />
        </Sequence>
      ))}
    <SoundCold />
  </AbsoluteFill>
);
