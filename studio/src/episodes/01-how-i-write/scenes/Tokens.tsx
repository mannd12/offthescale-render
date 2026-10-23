import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, TOKEN_COLORS } from "../../../lib/theme";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { Chip, Footnote, SceneShell, ease, lerp, usePop, windowed } from "../../../lib/ui";

// [piece, illustrative id, isPartOfSplitWord]
const TOKENS: [string, number, boolean][] = [
  ["Un", 1844, true],
  ["believ", 31405, true],
  ["able", 481, true],
  ["!", 0, false],
  [" The", 578, false],
  [" cat", 8415, false],
  [" sat", 7482, false],
  [" on", 389, false],
  [" the", 279, false],
  [" mat", 5634, false],
  [".", 13, false],
];

const BERRY: [string, number][] = [
  ["str", 496],
  ["aw", 675],
  ["berry", 15717],
];

const Way: React.FC<{ label: string; verdict: "no" | "yes"; at: number; x: number }> = ({ label, verdict, at, x }) => {
  const frame = useCurrentFrame();
  const v = ease(frame, at, 10);
  return (
    <div style={{ position: "absolute", top: 230, left: x, width: 360, textAlign: "center", fontSize: 44, fontWeight: 600 }}>
      <span style={{ color: verdict === "yes" ? lerp(0, 1, v) > 0.5 ? C.green : C.text : C.text, opacity: verdict === "no" ? lerp(1, 0.35, v) : 1 }}>
        {label}
      </span>
      <span style={{ marginLeft: 16, color: verdict === "yes" ? C.green : C.red, opacity: v }}>{verdict === "yes" ? "✓" : "✗"}</span>
    </div>
  );
};

export const Tokens: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const pop = usePop();

  const splitAt = lineAt(t, 1);
  const kindsAt = lineAt(t, 2);
  const idsAt = lineAt(t, 3);
  const berryAt = lineAt(t, 4);
  const chunksAt = lineAt(t, 5);

  const split = ease(frame, splitAt + 8, 24);
  const topOut = ease(frame, berryAt - 4, 16);

  return (
    <SceneShell frames={t.frames} kicker="Step 1 · Tokens">
      <Way label="letters" verdict="no" at={within(t, 0, 0.3)} x={360} />
      <Way label="words" verdict="no" at={within(t, 0, 0.62)} x={780} />
      <Way label="tokens" verdict="yes" at={splitAt + 6} x={1200} />

      {/* The sentence, breaking into tokens, then flipping to IDs */}
      <div
        style={{
          position: "absolute",
          top: lerp(440, 380, topOut),
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: lerp(0, 14, split),
          transform: `scale(${lerp(1, 0.72, topOut)})`,
          opacity: lerp(1, 0.4, topOut),
        }}
      >
        {TOKENS.map(([piece, id, isSplit], i) => {
          const color = TOKEN_COLORS[i % TOKEN_COLORS.length];
          const kind = ease(frame, isSplit ? within(t, 2, 0.5) : kindsAt + 6, 12) * (1 - ease(frame, idsAt - 6, 10));
          const flip = ease(frame, idsAt + 10 + i * 3, 14);
          const showId = flip > 0.5;
          const borderColor = kind > 0.01 ? (isSplit ? C.amber : C.green) : color;
          return (
            <div key={i} style={{ transform: `rotateX(${(showId ? 1 - flip : flip) * 180}deg)` }}>
              <Chip
                color={borderColor}
                size={46}
                style={{
                  borderColor: split > 0.05 ? borderColor : "transparent",
                  background: split > 0.05 ? `${borderColor}${kind > 0.3 ? "44" : "1f"}` : "transparent",
                  padding: `${14}px ${lerp(0, 18, split)}px`,
                  minWidth: showId ? 60 : undefined,
                  color: showId ? color : C.text,
                }}
              >
                {showId ? String(id) : piece}
              </Chip>
            </div>
          );
        })}
      </div>

      {/* Line 2 legend */}
      <div style={{ position: "absolute", top: 610, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 90, fontSize: 34 }}>
        <span style={{ color: C.green, opacity: windowed(frame, kindsAt + 6, idsAt, 10) }}>■ common word → one token</span>
        <span style={{ color: C.amber, opacity: windowed(frame, within(t, 2, 0.5), idsAt, 10) }}>■ rarer word → several pieces</span>
      </div>

      {/* Line 3 vocabulary counter */}
      <div
        style={{
          position: "absolute",
          top: 600,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 40,
          color: C.dim,
          opacity: windowed(frame, within(t, 3, 0.45), berryAt, 12),
        }}
      >
        vocabulary ≈{" "}
        <span style={{ fontFamily: FONT.mono, color: C.cyan, fontSize: 56 }}>
          {Math.round(lerp(0, 100000, ease(frame, within(t, 3, 0.45), 40))).toLocaleString("en-US")}
        </span>{" "}
        tokens
      </div>

      {/* Lines 4–5 strawberry */}
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", opacity: ease(frame, berryAt + 4) }}>
        <div style={{ fontSize: 34, color: C.dim, marginBottom: 30, opacity: 1 - ease(frame, chunksAt, 10) }}>
          how many <span style={{ color: C.pink }}>r</span>&apos;s?
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: lerp(0, 18, ease(frame, chunksAt + 6, 20)) }}>
          {BERRY.map(([piece, id], i) => {
            const chunk = ease(frame, chunksAt + 6, 20);
            const toId = ease(frame, within(t, 5, 0.62) + i * 5, 12);
            const color = TOKEN_COLORS[i];
            return (
              <Chip
                key={i}
                color={color}
                size={84}
                style={{
                  borderColor: chunk > 0.05 ? color : "transparent",
                  background: chunk > 0.05 ? `${color}1f` : "transparent",
                  padding: `22px ${lerp(0, 30, chunk)}px`,
                  transform: `scale(${1 + 0.04 * pop(chunksAt + 6)})`,
                }}
              >
                {toId > 0.5 ? (
                  <span style={{ color }}>{id}</span>
                ) : (
                  piece.split("").map((ch, k) => (
                    <span key={k} style={{ color: ch === "r" && chunk < 0.5 ? C.pink : C.text }}>
                      {ch}
                    </span>
                  ))
                )}
              </Chip>
            );
          })}
        </div>
      </div>
      <Footnote opacity={ease(frame, idsAt + 10)}>token IDs illustrative · real tokenizers vary by model</Footnote>
    </SceneShell>
  );
};
