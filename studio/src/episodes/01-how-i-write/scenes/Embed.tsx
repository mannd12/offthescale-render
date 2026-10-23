import React from "react";
import { random, useCurrentFrame } from "remotion";
import { C, FONT } from "../../../lib/theme";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { Chip, Footnote, SceneShell, ease, lerp, windowed } from "../../../lib/ui";

// Plot area (px) and where each word settles after "training".
const PLOT = { x: 820, y: 210, w: 920, h: 680 };
const WORDS: { w: string; x: number; y: number; c: string }[] = [
  { w: "king", x: 0.2, y: 0.22, c: C.amber },
  { w: "queen", x: 0.29, y: 0.15, c: C.amber },
  { w: "prince", x: 0.14, y: 0.33, c: C.amber },
  { w: "crown", x: 0.31, y: 0.31, c: C.amber },
  { w: "Paris", x: 0.72, y: 0.2, c: C.cyan },
  { w: "France", x: 0.8, y: 0.14, c: C.cyan },
  { w: "Tokyo", x: 0.7, y: 0.36, c: C.cyan },
  { w: "Japan", x: 0.8, y: 0.31, c: C.cyan },
  { w: "cat", x: 0.22, y: 0.7, c: C.green },
  { w: "dog", x: 0.3, y: 0.77, c: C.green },
  { w: "horse", x: 0.16, y: 0.84, c: C.green },
  { w: "tiger", x: 0.33, y: 0.64, c: C.green },
  { w: "bread", x: 0.7, y: 0.7, c: C.pink },
  { w: "cheese", x: 0.8, y: 0.76, c: C.pink },
  { w: "apple", x: 0.68, y: 0.85, c: C.pink },
  { w: "pasta", x: 0.83, y: 0.64, c: C.pink },
];
const PAIRS: [string, string][] = [
  ["king", "queen"],
  ["Paris", "France"],
];

const VECTOR = ["0.12", "-1.87", "0.45", "2.03", "-0.66", "0.91"];
const LABEL_LEFT = new Set(["king", "Paris"]); // keep labels off the pair connector

export const Embed: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const vecAt = lineAt(t, 1);
  const axesAt = lineAt(t, 2);
  const wordsAt = lineAt(t, 3);
  const pairsAt = lineAt(t, 4);
  const replayAt = lineAt(t, 5);

  const toSide = ease(frame, axesAt - 4, 22);
  const vec = ease(frame, vecAt + 6, 20);

  // Settled through lines 3–4; on line 5, scatter and re-converge to show "it emerged".
  const scatter = ease(frame, replayAt, 12);
  const converge = ease(frame, replayAt + 22, t.lines[5].audioFrames * 0.7);
  const settled = frame < replayAt ? 1 : lerp(1 - scatter, 1, converge);

  const pos = (i: number) => {
    const d = WORDS[i];
    const rx = 0.08 + random(`x${i}`) * 0.84;
    const ry = 0.08 + random(`y${i}`) * 0.84;
    return { x: PLOT.x + lerp(rx, d.x, settled) * PLOT.w, y: PLOT.y + lerp(ry, d.y, settled) * PLOT.h };
  };

  return (
    <SceneShell frames={t.frames} kicker="Step 2 · Embeddings">
      {/* Token ID → vector */}
      <div
        style={{
          position: "absolute",
          top: lerp(430, 220, vec),
          left: lerp(960, 430, toSide) - 330,
          width: 660,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Chip color={C.cyan} size={lerp(88, 50, vec)}>
          4821
        </Chip>
        <div style={{ fontSize: 40, color: C.dim, margin: "14px 0", opacity: vec }}>↓</div>
        <div
          style={{
            opacity: vec,
            fontFamily: FONT.mono,
            fontSize: 36,
            lineHeight: 1.45,
            padding: "18px 40px",
            borderLeft: `5px solid ${C.text}`,
            borderRight: `5px solid ${C.text}`,
            borderRadius: 14,
            textAlign: "right",
          }}
        >
          {VECTOR.map((v, i) => (
            <div key={i} style={{ opacity: ease(frame, vecAt + 10 + i * 3, 8), color: v.startsWith("-") ? C.pink : C.cyan }}>
              {v}
            </div>
          ))}
          <div style={{ color: C.dim, textAlign: "center" }}>⋮</div>
        </div>
        <div style={{ marginTop: 22, fontSize: 32, color: C.dim, opacity: ease(frame, within(t, 1, 0.55)) }}>
          thousands of numbers = one <span style={{ color: C.text, fontWeight: 600 }}>embedding</span>
        </div>
      </div>

      {/* The space */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, axesAt + 4, 20) }}>
        <rect x={PLOT.x} y={PLOT.y} width={PLOT.w} height={PLOT.h} rx={24} fill={`${C.panel}aa`} stroke={C.line} strokeWidth={2} />
        <line x1={PLOT.x + 40} y1={PLOT.y + PLOT.h - 40} x2={PLOT.x + PLOT.w - 40} y2={PLOT.y + PLOT.h - 40} stroke={C.dim} strokeWidth={3} />
        <line x1={PLOT.x + 40} y1={PLOT.y + PLOT.h - 40} x2={PLOT.x + 40} y2={PLOT.y + 40} stroke={C.dim} strokeWidth={3} />
        {PAIRS.map(([a, b]) => {
          const pa = pos(WORDS.findIndex((d) => d.w === a));
          const pb = pos(WORDS.findIndex((d) => d.w === b));
          const at = a === "king" ? pairsAt : within(t, 4, 0.5);
          return (
            <line
              key={a}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={C.text}
              strokeWidth={4}
              strokeDasharray="10 8"
              opacity={windowed(frame, at, replayAt, 10)}
            />
          );
        })}
        {WORDS.map((d, i) => {
          const p = pos(i);
          const appear = ease(frame, wordsAt + i * 2, 12);
          const hot = PAIRS.some(([a, b]) => (a === d.w || b === d.w) && frame >= (a === "king" ? pairsAt : within(t, 4, 0.5)) && frame < replayAt);
          return (
            <g key={d.w} opacity={appear}>
              <circle cx={p.x} cy={p.y} r={hot ? 15 : 10} fill={d.c} />
              <text x={p.x + (LABEL_LEFT.has(d.w) ? -24 : 24)} y={p.y + 10} textAnchor={LABEL_LEFT.has(d.w) ? "end" : "start"} fill={hot ? C.text : d.c} fontSize={hot ? 36 : 28} fontFamily={FONT.sans} fontWeight={hot ? 700 : 400}>
                {d.w}
              </text>
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          top: PLOT.y + PLOT.h + 16,
          left: PLOT.x,
          width: PLOT.w,
          textAlign: "center",
          fontSize: 28,
          color: C.dim,
          opacity: ease(frame, within(t, 2, 0.5)),
        }}
      >
        showing 2 of thousands of dimensions
      </div>

      {/* Line 5 — training progress */}
      <div style={{ position: "absolute", top: 150, left: PLOT.x, width: PLOT.w, opacity: ease(frame, replayAt + 6) }}>
        <div style={{ fontSize: 28, color: C.dim, marginBottom: 8 }}>training →</div>
        <div style={{ height: 8, borderRadius: 4, background: C.line }}>
          <div style={{ height: 8, borderRadius: 4, width: `${converge * 100}%`, background: C.cyan }} />
        </div>
      </div>
      <Footnote opacity={ease(frame, wordsAt)}>positions illustrative</Footnote>
    </SceneShell>
  );
};
