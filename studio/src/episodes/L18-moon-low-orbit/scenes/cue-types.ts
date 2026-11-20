// One spot sound effect in a scene's sound list. `at` is a scene-relative frame; `file` is in studio/public/audio/sfx
// (licences: studio/public/audio/LICENSES.md). Optional trim (s), length cap and fades (frames), as Episode.tsx's Sfx.
export type Cue = {
  at: number;
  file: string;
  vol: number;
  dur?: number;
  trim?: number;
  fadeIn?: number;
  fadeOut?: number;
};

/** The storyboard's SFX names → files (storyboard §3 legend). Use these constants, never retype a file name. */
export const SFX = {
  pop: "mixkit-2356-ui-pop-dry.mp3",
  popLong: "mixkit-2358-ui-pop-long.mp3",
  click: "mixkit-2568-ui-click-tone.mp3",
  whoosh: "mixkit-1489-whoosh-air.mp3",
  deepWhoosh: "mixkit-2604-whoosh-deep-air.mp3",
  swirl: "mixkit-1493-whoosh-swirl.mp3",
  boom: "mixkit-788-boom-cinematic-impact.mp3",
  uBoom: "mixkit-1686-boom-underground-echo.mp3",
  rumble: "mixkit-2297-rumble-bass-hum.mp3",
  wind: "mixkit-2658-wind-ambience.mp3",
  chime: "mixkit-3108-chime-crystal.mp3",
  debris: "mixkit-403-rock-debris-falling.mp3",
  riser: "mixkit-645-riser-synth.mp3",
} as const;

/** The act-boundary sting (storyboard: "BB + sting" = deep-whoosh → boom), as cues starting at `at`. */
export const sting = (at: number): Cue[] => [
  { at: at - 6, file: SFX.deepWhoosh, vol: 0.3, dur: 60 },
  { at: at + 6, file: SFX.boom, vol: 0.42, dur: 150, fadeOut: 40 },
];

/** A hard cut's `cutPop` + whoosh (storyboard legend: every CUT / MATCH / JUMP gets one). */
export const cutHit = (at: number, vol = 0.22): Cue[] => [{ at: at - 2, file: SFX.whoosh, vol, dur: 50 }];
