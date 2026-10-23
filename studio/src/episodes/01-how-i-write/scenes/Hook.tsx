import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, TOKEN_COLORS } from "../../../lib/theme";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { Chip, Footnote, Orb, SceneShell, Statement, ease, lerp, usePop, windowed } from "../../../lib/ui";

// The opening line, word by word, with made-up (but plausible) next-word candidates.
const WORDS: [string, [string, number][]][] = [
  ["Right", [["Right", 31], ["So", 22], ["Hello", 12]]],
  ["now,", [["now", 64], ["here", 9], ["then", 5]]],
  ["a", [["a", 38], ["I", 21], ["you", 14]]],
  ["machine", [["machine", 27], ["computer", 19], ["person", 8]]],
  ["is", [["is", 71], ["will", 12], ["has", 6]]],
  ["about", [["about", 44], ["trying", 18], ["going", 15]]],
  ["to", [["to", 97], ["ready", 1], ["the", 1]]],
  ["guess", [["guess", 33], ["predict", 29], ["write", 14]]],
  ["the", [["the", 82], ["your", 7], ["a", 5]]],
  ["next", [["next", 58], ["last", 11], ["first", 9]]],
  ["word", [["word", 76], ["part", 8], ["line", 5]]],
  ["of", [["of", 61], ["in", 17], [".", 9]]],
  ["this", [["this", 69], ["the", 18], ["a", 6]]],
  ["sentence.", [["sentence", 86], ["video", 6], ["story", 3]]],
];

const PIECES = ["I", " only", " ever", " write", " one", " next", " piece"];

export const Hook: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const pop = usePop();
  const l0 = t.lines[0];

  // Words land in step with the narration of line 0.
  const perWord = (l0.audioFrames * 0.94) / WORDS.length;
  const shown = Math.max(0, Math.min(WORDS.length, Math.floor((frame - l0.at) / perWord) + 1));
  const typing = frame >= l0.at && shown < WORDS.length;
  const pending = Math.min(shown, WORDS.length - 1);
  const sinceWord = frame - (l0.at + (shown - 1) * perWord);

  const meAt = lineAt(t, 1);
  const tagsAt = lineAt(t, 2);
  const questionAt = lineAt(t, 3);
  const pieceAt = lineAt(t, 5);

  const textOpacity = 1 - ease(frame, meAt - 4, 14);
  const orbIn = ease(frame, meAt, 24);
  const orbOut = ease(frame, questionAt - 8, 14);
  const speaking = t.lines.some((l) => frame >= l.at && frame < l.at + l.audioFrames);

  const tags = ["written by an AI", "animated by an AI", "narrated by an AI"];

  return (
    <SceneShell frames={t.frames}>
      {/* Line 0 — the sentence writes itself */}
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 210,
          right: 210,
          textAlign: "center",
          fontFamily: FONT.mono,
          fontSize: 62,
          lineHeight: 1.55,
          opacity: textOpacity,
        }}
      >
        {WORDS.map(([w], i) => (
          <React.Fragment key={i}>
            {i === shown ? (
              <span style={{ position: "relative", display: "inline-block", width: 0, height: 62, verticalAlign: "middle" }}>
                <span
                  style={{
                    position: "absolute",
                    left: -4,
                    top: 0,
                    width: 6,
                    height: 62,
                    background: C.cyan,
                    opacity: Math.floor(frame / 8) % 2 ? 1 : 0.35,
                  }}
                />
                {typing ? (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 96,
                      left: -190,
                      width: 380,
                      padding: "18px 22px",
                      borderRadius: 18,
                      background: C.panel,
                      border: `2px solid ${C.line}`,
                      fontSize: 28,
                      lineHeight: 1.2,
                      textAlign: "left",
                    }}
                  >
                    {WORDS[pending][1].map(([cand, pct], k) => (
                      <span key={k} style={{ display: "flex", alignItems: "center", gap: 12, margin: "7px 0" }}>
                        <span style={{ width: 150, color: k === 0 ? C.text : C.dim }}>{cand}</span>
                        <span style={{ flex: 1, height: 14, borderRadius: 7, background: `${C.line}` }}>
                          <span
                            style={{
                              display: "block",
                              height: 14,
                              borderRadius: 7,
                              width: `${pct * ease(sinceWord, 0, 5)}%`,
                              background: k === 0 ? C.cyan : C.dim,
                            }}
                          />
                        </span>
                        <span style={{ width: 62, textAlign: "right", color: C.dim }}>{pct}%</span>
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>
            ) : null}
            <span style={{ visibility: i < shown ? "visible" : "hidden" }}>{w} </span>
          </React.Fragment>
        ))}
      </div>
      <Footnote opacity={windowed(frame, l0.at + 10, meAt, 10)}>probabilities illustrative</Footnote>

      {/* Lines 1–2 — the host */}
      <Orb x={960} y={lerp(1180, 500, orbIn)} r={lerp(60, 150, orbIn)} speaking={speaking} opacity={orbIn * (1 - orbOut)} />
      {tags.map((tag, i) => {
        const at = within(t, 2, 0.28 + i * 0.16);
        return (
          <div
            key={tag}
            style={{
              position: "absolute",
              top: 800,
              left: 960 + (i - 1) * 440 - 200,
              width: 400,
              textAlign: "center",
              fontSize: 34,
              color: C.text,
              opacity: pop(at) * (1 - orbOut),
              transform: `translateY(${lerp(30, 0, pop(at))}px)`,
            }}
          >
            <span style={{ color: C.green }}>✓ </span>
            {tag}
          </div>
        );
      })}
      <Statement y={900} size={32} color={C.dim} opacity={ease(frame, within(t, 2, 0.8)) * (1 - orbOut)}>
        no human on the mic
      </Statement>

      {/* Lines 3–4 — the question */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 84,
          fontWeight: 700,
          opacity: windowed(frame, questionAt, pieceAt, 12),
          transform: `scale(${lerp(0.96, 1, ease(frame, questionAt, 40))})`,
        }}
      >
        What actually happens
        <br />
        <span style={{ color: C.cyan }}>inside</span> when I write?
        <div style={{ fontSize: 40, fontWeight: 400, color: C.dim, marginTop: 36, opacity: ease(frame, lineAt(t, 4)) }}>
          stranger — and simpler — than you&apos;d think
        </div>
      </div>

      {/* Line 5 — one piece at a time */}
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", opacity: ease(frame, pieceAt) }}>
        <div style={{ fontSize: 60, fontWeight: 600, color: C.dim, position: "relative", display: "inline-block" }}>
          I write sentences
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "52%",
              height: 6,
              borderRadius: 3,
              background: C.red,
              width: `calc(${ease(frame, within(t, 5, 0.12), 14) * 100}% + 20px)`,
            }}
          />
        </div>
        <div style={{ marginTop: 80, display: "flex", justifyContent: "center", gap: 14 }}>
          {PIECES.map((p, i) => {
            const at = within(t, 5, 0.28 + i * 0.065);
            return (
              <Chip key={i} color={TOKEN_COLORS[i % TOKEN_COLORS.length]} size={50} style={{ opacity: pop(at), transform: `scale(${pop(at, 9)})` }}>
                {p}
              </Chip>
            );
          })}
        </div>
        <div style={{ marginTop: 70, fontSize: 44, color: C.amber, opacity: ease(frame, within(t, 5, 0.8)) }}>↻ and again</div>
      </div>
    </SceneShell>
  );
};
