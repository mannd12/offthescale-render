import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline } from "../../lib/timeline";
import vo from "./vo.json";
import { ColdOpen, Dust, Grain, HalfMetre, Range, Whale } from "./scenes/Small";
import { ClosePass, Hit, Touched } from "./scenes/Middle";
import { Closer, Crater, Top, World } from "./scenes/Big";

loadBrandFonts();

const LINES = vo as VoLine[];

// One bespoke scene per rung (hard rule 1); only the chrome in scenes/shell.tsx is shared.
const SCENES: Record<string, React.FC<{ t: SceneTiming }>> = {
  cold: ColdOpen, l01: Dust, l02: Grain, l03: HalfMetre, l04: Whale, l05: Range, l06: Hit, l07: ClosePass, l08: Touched, l09: Crater, l10: World, l11: Top, closer: Closer,
};

export const timeline = buildTimeline(LINES);

export const EpisodeL09: React.FC = () => (
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
