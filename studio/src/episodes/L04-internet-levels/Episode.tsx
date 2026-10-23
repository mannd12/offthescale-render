import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline } from "../../lib/timeline";
import vo from "./vo.json";
import { ColdOpen, Dark, Deep, Myth, Surface } from "./scenes/Web";
import { Cable, Closer, DataCentre, Exchange, Landing } from "./scenes/Wire";

loadBrandFonts();

const LINES = vo as VoLine[];

// script.md headings -> scene ids: "— · The myth line" gets the generator's fallback id, so map both spellings
const SCENES: Record<string, React.FC<{ t: SceneTiming }>> = {
  cold: ColdOpen, l01: Surface, l02: Deep, l03: Dark, myth: Myth, s4: Myth, l04: Exchange, l05: DataCentre, l06: Landing, l07: Cable, closer: Closer,
};

export const timeline = buildTimeline(LINES);

export const EpisodeL04: React.FC = () => (
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
