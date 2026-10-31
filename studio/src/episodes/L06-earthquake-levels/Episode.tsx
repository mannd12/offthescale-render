import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline } from "../../lib/timeline";
import vo from "./vo.json";
import { ColdOpen, M1, M2, M3, M4 } from "./scenes/LowRungs";
import { M5, M6, M7, M8 } from "./scenes/MidRungs";
import { Limit, M9, M95 } from "./scenes/TopRungs";

loadBrandFonts();

const LINES = vo as VoLine[];

// One bespoke scene per rung (hard rule 1); only the chrome in scenes/shell.tsx is shared.
const SCENES: Record<string, React.FC<{ t: SceneTiming }>> = {
  cold: ColdOpen, l01: M1, l02: M2, l03: M3, l04: M4, l05: M5, l06: M6, l07: M7, l08: M8, l09: M9, l10: M95, s11: Limit,
};

export const timeline = buildTimeline(LINES);

export const EpisodeL06: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: B.ink }}>
    {timeline.scenes.map((s) => {
      const Scene = SCENES[s.id];
      return Scene ? (
        <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={s.id}>
          <Scene t={s} />
        </Sequence>
      ) : null;
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
