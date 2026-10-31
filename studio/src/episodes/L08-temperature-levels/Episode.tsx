import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline } from "../../lib/timeline";
import vo from "./vo.json";
import { ColdOpen, Coldest, ColderThanSpace, EarthColdest, Moon } from "./scenes/ColdHalf";
import { Lava, Lightning, SunFace, Venus } from "./scenes/HotHalf";
import { Corona, Fusion, Hottest, PastTheTop } from "./scenes/TopRungs";

loadBrandFonts();

const LINES = vo as VoLine[];

// One bespoke scene per rung (hard rule 1); only the chrome in scenes/shell.tsx is shared.
const SCENES: Record<string, React.FC<{ t: SceneTiming }>> = {
  cold: ColdOpen, l01: Coldest, l02: ColderThanSpace, l03: Moon, l04: EarthColdest, l05: Venus, l06: Lava, l07: SunFace, l08: Lightning, l09: Corona, l10: Fusion, l11: Hottest, s12: PastTheTop,
};

export const timeline = buildTimeline(LINES);

export const EpisodeL08: React.FC = () => (
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
