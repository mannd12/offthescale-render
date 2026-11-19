// ST01 · What If Earth Were Twice as Big? (Suppose Then). Shots are timed from the voiced vo.json: each storyboard row
// starts at line@fraction and runs until the next row; K-06 (end card) runs 3.5 s past the last line.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { buildTimeline, FPS, VoLine } from "../../lib/timeline";
import { loadSupposeFonts } from "../../lib/suppose/fonts";
import vo from "./vo.json";
import { SHOT_LIST } from "./shotlist";
import { placeholder, ShotC, ShotMap } from "./shot";
import { SHOTS_COLD } from "./acts/cold";
import { SHOTS_L01 } from "./acts/l01";
import { SHOTS_L02 } from "./acts/l02";
import { SHOTS_L03 } from "./acts/l03";
import { SHOTS_L04 } from "./acts/l04";
import { SHOTS_L05 } from "./acts/l05";
import { SHOTS_L06 } from "./acts/l06";
import { SHOTS_CLOSER } from "./acts/closer";

const BODIES: ShotMap = { ...SHOTS_COLD, ...SHOTS_L01, ...SHOTS_L02, ...SHOTS_L03, ...SHOTS_L04, ...SHOTS_L05, ...SHOTS_L06, ...SHOTS_CLOSER };
export const timeline = buildTimeline(vo as VoLine[]);
const LINES = timeline.scenes.flatMap((s) => s.lines);
const END_HOLD = Math.round(3.5 * FPS);
export const ST01Frames = timeline.totalFrames + END_HOLD;

export type TimedShot = { id: string; from: number; dur: number; C: ShotC };
const starts = SHOT_LIST.map((s) => (s.line < 0 ? timeline.totalFrames - 15 : s.line === 0 && s.frac === 0 ? 0 : LINES[s.line].from + Math.round(LINES[s.line].audioFrames * s.frac)));
export const SHOTS: TimedShot[] = SHOT_LIST.map((s, i) => ({
  id: s.id,
  from: starts[i],
  dur: (i + 1 < starts.length ? starts[i + 1] : ST01Frames) - starts[i],
  C: BODIES[s.id] ?? placeholder(s.id, s.fam, s.picture),
}));

const Body: React.FC<{ s: TimedShot }> = ({ s }) => {
  const t = useCurrentFrame();
  return <s.C t={t} d={s.dur} f={t + s.from} />;
};

export const FullST01: React.FC = () => {
  loadSupposeFonts();
  return (
    <AbsoluteFill style={{ background: "#0B1E19" }}>
      {SHOTS.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={Math.max(1, s.dur)} name={s.id}>
          <Body s={s} />
        </Sequence>
      ))}
      {LINES.filter((l) => !l.estimated).map((l) => (
        <Sequence key={l.file} from={l.from} durationInFrames={l.audioFrames + 3} name={`vo ${l.scene} ${l.index}`}>
          <Audio src={staticFile(l.file)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
