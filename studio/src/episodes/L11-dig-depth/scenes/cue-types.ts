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
