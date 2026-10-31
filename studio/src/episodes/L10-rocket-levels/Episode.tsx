import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline } from "../../lib/timeline";
import vo from "./vo.json";
import { ColdOpen, Edge, FewInches, Hobby, TheRule, Weakest } from "./scenes/Low";
import { Classic, ManyEngines, Workhorse } from "./scenes/Middle";
import { Closer, Giant, HalfSolid, TopOfTape } from "./scenes/High";

loadBrandFonts();

const LINES = vo as VoLine[];

// One bespoke scene per rung (hard rule 1); only the chrome in scenes/shell.tsx is shared.
const SCENES: Record<string, React.FC<{ t: SceneTiming }>> = {
  cold: ColdOpen, l01: Weakest, l02: Hobby, l03: Edge, l04: FewInches, l05: TheRule, l06: Workhorse, l07: ManyEngines, l08: Classic, l09: HalfSolid, l10: Giant, l11: TopOfTape, closer: Closer,
};

export const timeline = buildTimeline(LINES);

export const EpisodeL10: React.FC = () => (
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
