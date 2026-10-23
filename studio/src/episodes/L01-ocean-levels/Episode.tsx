import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline } from "../../lib/timeline";
import vo from "./vo.json";
import { ColdOpen } from "./scenes/ColdOpen";
import { Sunlight } from "./scenes/Sunlight";
import { LastPlant } from "./scenes/LastPlant";
import { DeepestDive } from "./scenes/DeepestDive";
import { Migration } from "./scenes/Migration";
import { Midnight } from "./scenes/Midnight";
import { Vents } from "./scenes/Vents";
import { DeepestBreath } from "./scenes/DeepestBreath";
import { Titanic } from "./scenes/Titanic";
import { Abyss } from "./scenes/Abyss";
import { Trenches } from "./scenes/Trenches";
import { LastFish } from "./scenes/LastFish";
import { Bottom } from "./scenes/Bottom";
import { Closer } from "./scenes/Closer";

loadBrandFonts();

const LINES = vo as VoLine[];

// One bespoke scene per rung (hard rule 1); only the frame chrome in scenes/shell.tsx is shared.
const SCENES: Record<string, React.FC<{ t: SceneTiming }>> = {
  cold: ColdOpen, l01: Sunlight, l02: LastPlant, l03: DeepestDive, l04: Migration, l05: Midnight, l06: Vents,
  l07: DeepestBreath, l08: Titanic, l09: Abyss, l10: Trenches, l11: LastFish, l12: Bottom, closer: Closer,
};
const sceneFor = (id: string) => SCENES[id];

/** Build a timeline for the whole episode or a subset of scene ids (the 30-s sample). */
export const timelineFor = (ids?: string[]) => buildTimeline(ids ? LINES.filter((l) => ids.includes(l.scene)) : LINES);

export const timeline = timelineFor();
export const SAMPLE_SCENES = ["cold", "l01"];
export const sampleTimeline = timelineFor(SAMPLE_SCENES);

const Episode: React.FC<{ scenes: string[] | undefined }> = ({ scenes }) => {
  const tl = scenes ? timelineFor(scenes) : timeline;
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {tl.scenes.map((s) => {
        const Scene = sceneFor(s.id);
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={s.id}>
            <Scene t={s} />
          </Sequence>
        );
      })}
      {tl.scenes.flatMap((s) =>
        s.lines
          .filter((l) => !l.estimated) // estimated manifests have no audio files
          .map((l) => (
            <Sequence key={l.file} from={l.from} durationInFrames={l.audioFrames + 3} name={`vo ${s.id} ${l.index}`}>
              <Audio src={staticFile(l.file)} />
            </Sequence>
          )),
      )}
    </AbsoluteFill>
  );
};

export const EpisodeL01: React.FC = () => <Episode scenes={undefined} />;
export const SampleL01: React.FC = () => <Episode scenes={SAMPLE_SCENES} />;
