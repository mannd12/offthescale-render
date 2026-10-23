import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../../lib/theme";
import { SceneTiming, VoLine, buildTimeline } from "../../lib/timeline";
import { Background, Orb, ease } from "../../lib/ui";
import vo from "./vo.json";
import { Hook } from "./scenes/Hook";
import { Tokens } from "./scenes/Tokens";
import { Embed } from "./scenes/Embed";
import { Attention } from "./scenes/Attention";
import { Layers } from "./scenes/Layers";
import { Predict } from "./scenes/Predict";
import { Loop } from "./scenes/Loop";
import { Training } from "./scenes/Training";
import { Outro } from "./scenes/Outro";

export const timeline = buildTimeline(vo as VoLine[]);

const SCENES: Record<string, { component: React.FC<{ t: SceneTiming }>; chapter?: string }> = {
  hook: { component: Hook },
  tokens: { component: Tokens, chapter: "tokens" },
  embed: { component: Embed, chapter: "embeddings" },
  attention: { component: Attention, chapter: "attention" },
  layers: { component: Layers, chapter: "layers" },
  predict: { component: Predict, chapter: "prediction" },
  loop: { component: Loop, chapter: "the loop" },
  training: { component: Training, chapter: "training" },
  outro: { component: Outro },
};

/** Thin chapter rail along the bottom: where we are in the explanation. */
const ChapterRail: React.FC = () => {
  const frame = useCurrentFrame();
  const chapters = timeline.scenes.filter((s) => SCENES[s.id]?.chapter);
  const first = chapters[0].from;
  const last = chapters[chapters.length - 1];
  const visible = ease(frame, first, 20) * (1 - ease(frame, last.from + last.frames - 10, 10));
  return (
    <div style={{ position: "absolute", left: 96, right: 96, bottom: 34, display: "flex", gap: 8, opacity: visible, fontFamily: FONT.sans }}>
      {chapters.map((s) => {
        const progress = Math.max(0, Math.min(1, (frame - s.from) / s.frames));
        const active = progress > 0 && progress < 1;
        return (
          <div key={s.id} style={{ flex: s.frames }}>
            <div style={{ height: 5, borderRadius: 3, background: C.line }}>
              <div style={{ height: 5, borderRadius: 3, width: `${progress * 100}%`, background: C.cyan }} />
            </div>
            <div style={{ marginTop: 6, fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: active ? C.text : C.dim }}>
              {SCENES[s.id].chapter}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Small persistent host presence, top-right, outside the scenes where the orb is the star. */
const HostBug: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = timeline.scenes.find((s) => frame >= s.from && frame < s.from + s.frames);
  if (!scene || scene.id === "hook" || scene.id === "outro") return null;
  const speaking = scene.lines.some((l) => frame >= l.from && frame < l.from + l.audioFrames);
  return <Orb x={1824} y={96} r={26} speaking={speaking} opacity={0.9} />;
};

export const Episode01: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Background />
    {timeline.scenes.map((s) => {
      const Scene = SCENES[s.id].component;
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={s.id}>
          <Scene t={s} />
        </Sequence>
      );
    })}
    <ChapterRail />
    <HostBug />
    {timeline.scenes.flatMap((s) =>
      s.lines.map((l) => (
        <Sequence key={l.file} from={l.from} durationInFrames={l.audioFrames + 3} name={`vo ${s.id} ${l.index}`}>
          <Audio src={staticFile(l.file)} />
        </Sequence>
      )),
    )}
  </AbsoluteFill>
);
