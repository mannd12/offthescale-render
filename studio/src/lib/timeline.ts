// Turns the TTS manifest (vo.json) into frame-accurate scene/line timings.
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export type VoLine = {
  scene: string;
  index: number;
  text: string;
  file: string;
  seconds: number;
  pauseAfter: number;
  /** true when written by scripts/vo-estimate.mjs: no audio file exists, durations are a guess */
  estimated?: boolean;
};

export type TimedLine = VoLine & {
  /** absolute frame the audio starts */
  from: number;
  /** frame the audio starts, relative to its scene */
  at: number;
  audioFrames: number;
};

export type SceneTiming = {
  id: string;
  from: number;
  frames: number;
  lines: TimedLine[];
};

const LEAD_IN = 0.35; // seconds of visual-only breathing room at the top of each scene

export const buildTimeline = (vo: VoLine[]): { scenes: SceneTiming[]; totalFrames: number } => {
  const scenes: SceneTiming[] = [];
  let cursor = 0;
  for (const line of vo) {
    let scene = scenes[scenes.length - 1];
    if (!scene || scene.id !== line.scene) {
      scene = { id: line.scene, from: cursor, frames: 0, lines: [] };
      scenes.push(scene);
      cursor += Math.round(LEAD_IN * FPS);
    }
    const audioFrames = Math.ceil(line.seconds * FPS);
    scene.lines.push({ ...line, from: cursor, at: cursor - scene.from, audioFrames });
    cursor += audioFrames + Math.round(line.pauseAfter * FPS);
    scene.frames = cursor - scene.from;
  }
  return { scenes, totalFrames: cursor };
};

/** Frame (scene-relative) at which line i starts; clamps so scenes survive script edits. */
export const lineAt = (t: SceneTiming, i: number) => t.lines[Math.min(i, t.lines.length - 1)].at;

/** Frame (scene-relative) a fraction of the way through line i's audio. */
export const within = (t: SceneTiming, i: number, fraction: number) => {
  const l = t.lines[Math.min(i, t.lines.length - 1)];
  return l.at + Math.round(l.audioFrames * fraction);
};
