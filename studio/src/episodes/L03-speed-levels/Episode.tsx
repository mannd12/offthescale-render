import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline } from "../../lib/timeline";
import vo from "./vo.json";
import { ColdOpen } from "./scenes/ColdOpen";
import { Cheetah, FastestHuman, ThrustSSC, Walking } from "./scenes/Rungs1to4";
import { Blackbird, Reentry, SpeedOfSound, X15 } from "./scenes/Rungs5to8";
import { Closer, Escape, Light, Orbit, Parker } from "./scenes/Rungs9to12";

loadBrandFonts();

const LINES = vo as VoLine[];

// One bespoke scene per rung (hard rule 1); only the chrome in scenes/shell.tsx is shared.
const SCENES: Record<string, React.FC<{ t: SceneTiming }>> = {
  cold: ColdOpen, l01: Walking, l02: FastestHuman, l03: Cheetah, l04: ThrustSSC, l05: SpeedOfSound, l06: Blackbird,
  l07: X15, l08: Reentry, l09: Orbit, l10: Escape, l11: Parker, l12: Light, closer: Closer,
};

export const timelineFor = (ids?: string[]) => buildTimeline(ids ? LINES.filter((l) => ids.includes(l.scene)) : LINES);
export const timeline = timelineFor();

export const EpisodeL03: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: B.ink }}>
    {timeline.scenes.map((s) => {
      const Scene = SCENES[s.id];
      if (!Scene) return null;
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={s.id}>
          <Scene t={s} />
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
  </AbsoluteFill>
);
