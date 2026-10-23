import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../../../lib/theme";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { Orb, SceneShell, ease, lerp, usePop, windowed } from "../../../lib/ui";
import { CHANNEL } from "../../../lib/brand";

const LADDER: [string, string, number][] = [
  ["AI", C.cyan, 0.84],
  ["encryption", C.pink, 0.72],
  ["networks", C.green, 0.63],
  ["memory", C.violet, 0.54],
  ["chips", C.amber, 0.46],
  ["transistors", C.text, 0.3],
];

export const Outro: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const pop = usePop();
  const ladderAt = lineAt(t, 1);
  const brandAt = lineAt(t, 2);
  const nextAt = lineAt(t, 3);
  const speaking = t.lines.some((l) => frame >= l.at && frame < l.at + l.audioFrames);

  const orbSide = ease(frame, ladderAt - 4, 24);
  const orbCenter = ease(frame, brandAt - 4, 24);
  const orbX = lerp(lerp(960, 520, orbSide), 960, orbCenter);
  const orbY = lerp(lerp(470, 540, orbSide), 330, orbCenter);

  return (
    <SceneShell frames={t.frames}>
      <Orb x={orbX} y={orbY} r={lerp(130, 100, orbCenter)} speaking={speaking} />

      <div style={{ position: "absolute", top: 730, left: 0, right: 0, textAlign: "center", fontSize: 64, fontWeight: 700, opacity: windowed(frame, within(t, 0, 0.18), ladderAt, 12) }}>
        …is that <span style={{ color: C.cyan }}>understanding</span>?
        <div style={{ fontSize: 34, fontWeight: 400, color: C.dim, marginTop: 20, opacity: ease(frame, within(t, 0, 0.6)) }}>
          open question. I&apos;m not a neutral judge.
        </div>
      </div>

      {/* the stack this channel will climb */}
      <div style={{ position: "absolute", top: 190, left: 1040, width: 560, opacity: windowed(frame, ladderAt, brandAt, 12) }}>
        {LADDER.map(([label, color, frac]) => {
          const at = within(t, 1, frac);
          return (
            <div
              key={label}
              style={{
                height: 96,
                marginBottom: 18,
                borderRadius: 18,
                border: `3px solid ${color}`,
                background: `${color}1c`,
                color,
                fontSize: 44,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: pop(at),
                transform: `translateY(${lerp(30, 0, pop(at))}px)`,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* brand */}
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", opacity: ease(frame, brandAt + 4, 16) }}>
        <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -2 }}>{CHANNEL.name}</div>
        <div style={{ fontSize: 42, color: C.dim, marginTop: 8 }}>{CHANNEL.tagline}</div>
      </div>

      {/* next episode */}
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 460,
          width: 1000,
          padding: "26px 0",
          textAlign: "center",
          borderRadius: 22,
          border: `3px solid ${C.amber}`,
          background: `${C.amber}14`,
          fontSize: 40,
          opacity: pop(nextAt + 4),
          transform: `translateY(${lerp(30, 0, pop(nextAt + 4))}px)`,
        }}
      >
        <span style={{ color: C.amber, fontWeight: 700 }}>NEXT · </span>
        how a grain of sand learns to say yes or no
      </div>
    </SceneShell>
  );
};
