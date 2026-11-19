// Suppose Then voice audition (owner picks by ear, 2026-11-18): ST01's cold open read by three Gemini voices over the
// approved key frame. Rendered on Off the Scale's CI (kind=video, episode=st-aud-<voice>, preview).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { buildTimeline, VoLine } from "../timeline";
import { loadSupposeFonts } from "./fonts";
import { STKeyPull } from "./frames";
import { CHALK, INK, LIME, ST_FONT } from "./palette";
import voSulafat from "../../episodes/st-aud-sulafat/vo.json";
import voSadaltager from "../../episodes/st-aud-sadaltager/vo.json";
import voCharon from "../../episodes/st-aud-charon/vo.json";
import { FullST01, ST01Frames } from "../../episodes/ST01-earth-twice-as-big/Full";


const make = (voice: string, vo: VoLine[]) => {
  const timeline = buildTimeline(vo);
  const C: React.FC = () => {
    loadSupposeFonts(); // inside the component, so Off the Scale renders never wait on these fonts
    return (
    <AbsoluteFill>
      <STKeyPull />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <rect x={60} y={940} width={520} height={84} rx={42} fill={INK} opacity={0.75} />
        <text x={100} y={996} fontFamily={ST_FONT} fontWeight={800} fontSize={34} fill={CHALK}>
          Voice: <tspan fill={LIME} fontWeight={900}>{voice}</tspan>
        </text>
      </svg>
      {timeline.scenes.flatMap((s) =>
        s.lines
          .filter((l) => !l.estimated)
          .map((l) => (
            <Sequence key={l.file} from={l.from} durationInFrames={l.audioFrames + 3}>
              <Audio src={staticFile(l.file)} />
            </Sequence>
          )),
      )}
    </AbsoluteFill>
    );
  };
  return { C, frames: timeline.totalFrames + 30 };
};

export const AUDITIONS = [
  { id: "st-aud-sulafat", ...make("Sulafat", voSulafat as VoLine[]) },
  { id: "st-aud-sadaltager", ...make("Sadaltager", voSadaltager as VoLine[]) },
  { id: "st-aud-charon", ...make("Charon", voCharon as VoLine[]) },
  // Suppose Then episodes ride the same list so Root.tsx needs no further edits
  { id: "ST01EarthTwice", C: FullST01, frames: ST01Frames },
];
