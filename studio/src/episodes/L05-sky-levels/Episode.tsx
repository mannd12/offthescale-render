import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline } from "../../lib/timeline";
import vo from "./vo.json";
import { Airliners, ColdOpen, Everest, Ground } from "./scenes/LowSky";
import { Balloons, Meteors, SpaceLine, SpyPlanes } from "./scenes/MidSky";
import { LastEdge, Moon, Satellites, Station } from "./scenes/HighSky";

loadBrandFonts();

// script.md's closing note "Word count: ..." was converted into script.json as a spoken line. It must never be voiced
// or timed; dropped here until the note leaves the script (reported to the owner, the build does not edit script text).
const LINES = (vo as VoLine[]).filter((l) => !l.text.startsWith("Word count:"));

// One bespoke scene per rung (hard rule 1); only the chrome in scenes/shell.tsx is shared.
const SCENES: Record<string, React.FC<{ t: SceneTiming }>> = {
  cold: ColdOpen, l01: Ground, l02: Everest, l03: Airliners, l04: SpyPlanes, l05: Balloons, l06: Meteors, l07: SpaceLine, l08: Station, l09: Satellites, l10: Moon, s11: LastEdge,
};

export const timelineFor = (ids?: string[]) => buildTimeline(ids ? LINES.filter((l) => ids.includes(l.scene)) : LINES);
export const timeline = timelineFor();

export const EpisodeL05: React.FC = () => (
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
