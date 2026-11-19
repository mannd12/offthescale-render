// ST01 shot plumbing: every shot is a component of ShotProps, wrapped in <ShotStage> for its family, drift, ambient
// life, paper grain and the Counter/Ladder furniture. Builders write bodies only (acts/*.tsx), keyed by storyboard id.
import React from "react";
import { Layer, Stage } from "../../lib/illustrated/camera";
import { Sky } from "../../lib/illustrated/light";
import { Motes, Stars } from "../../lib/illustrated/ambient";
import { smooth } from "../../lib/illustrated/transitions";
import { Counter, Ladder } from "../../lib/suppose/devices";
import { SUPPOSE, SupposeFamily } from "../../lib/suppose/palette";

export type ShotProps = {
  /** frame within this shot (0 at its first frame) */
  t: number;
  /** this shot's length in frames */
  d: number;
  /** global composition frame (for ambient that must not restart at a cut) */
  f: number;
};
export type ShotC = React.FC<ShotProps>;
export type ShotMap = Record<string, ShotC>;

/** 0→1 between frames a and b, eased (smoothstep). */
export const ease = (t: number, a: number, b: number) => smooth(Math.max(0, Math.min(1, (t - a) / Math.max(1, b - a))));
/** linear 0→1 between a and b */
export const lin = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / Math.max(1, b - a)));
/** pop-in scale with overshoot, starting at frame a over n frames */
export const pop = (t: number, a: number, n = 12) => {
  const p = lin(t, a, a + n);
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  return 1 - Math.pow(1 - p, 3) + Math.sin(p * Math.PI) * 0.15;
};
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;

export type CounterSpec = { label: string; value: string; sub?: string };
export const LADDER_RUNGS = ["×1", "×1.1", "×1.25", "×1.5", "×2", "×4"];

export const ShotStage: React.FC<{
  fam: SupposeFamily;
  t: number;
  f: number;
  counter?: CounterSpec;
  /** show the Ladder at the right edge with this rung lit (index into LADDER_RUNGS) */
  ladder?: number;
  /** extra camera drift: 0 = still-ish, 1 = default */
  drift?: number;
  ambient?: boolean;
  /** draw the family sky (false = the body draws its own background) */
  sky?: boolean;
  children: React.ReactNode;
}> = ({ fam, t, f, counter, ladder, drift = 1, ambient = true, sky = true, children }) => {
  const F = SUPPOSE[fam];
  return (
    // gentle never-resting camera (driftCam: zoom is a multiplier, pan a fraction of the frame); the direction alternates
    // by shot. Kept small because shot bodies were composed without it and some run their own push-ins.
    <Stage theme={F.theme} shotFrame={t} drift={{ zoom: 1 + 0.04 * drift, panX: 0.012 * drift, panY: 0.005 * drift, seed: Math.floor((f - t) / 5) }} vignette={F.dark ? 0.28 : 0.12}>
      {sky ? <Sky family={F} /> : null}
      {ambient && F.dark ? <Stars frame={f} n={160} w={1920} h={1080} color={F.light} seed={4} /> : null}
      {ambient && !F.dark ? <Motes frame={f} n={18} w={1920} h={1080} color={F.light} seed={7} /> : null}
      <Layer depth={1}>{children}</Layer>
      {ladder !== undefined ? <Ladder x={1810} top={330} bottom={1010} rungs={LADDER_RUNGS} lit={ladder} frame={f} /> : null}
      {counter ? <Counter label={counter.label} value={counter.value} sub={counter.sub} /> : null}
    </Stage>
  );
};

/** Fallback body for a shot not built yet: its id and picture note, on its family, with a moving bar (never ships). */
export const placeholder = (id: string, fam: SupposeFamily, note: string): ShotC => ({ t, f }) => {
  const F = SUPPOSE[fam];
  return (
    <ShotStage fam={fam} t={t} f={f}>
      <text x={960} y={480} textAnchor="middle" fontFamily="'Nunito', sans-serif" fontWeight={900} fontSize={80} fill={F.text}>{id}</text>
      <text x={960} y={560} textAnchor="middle" fontFamily="'Nunito', sans-serif" fontWeight={700} fontSize={28} fill={F.dim}>{note.slice(0, 110)}</text>
      <rect x={(t * 12) % 1920} y={620} width={120} height={10} fill={F.dim} />
    </ShotStage>
  );
};
