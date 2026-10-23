import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../../../lib/theme";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { Chip, Footnote, SceneShell, ease, lerp, usePop, windowed } from "../../../lib/ui";

// Illustrative next-token probabilities at temperature 1 for "The cat sat on the ▌".
const CANDS: [string, number][] = [
  ["mat", 0.4],
  ["floor", 0.15],
  ["couch", 0.09],
  ["bed", 0.07],
  ["roof", 0.05],
  ["chair", 0.04],
  ["table", 0.03],
  ["xylophone", 0.0005],
];
// The rest of the vocabulary shares what's left; modelled as N equally unlikely tokens
// so that temperature reshapes the *whole* distribution correctly (p_T ∝ p^(1/T)).
const REST_N = 100;
const REST_P = (1 - CANDS.reduce((s, [, p]) => s + p, 0)) / REST_N;

const atTemperature = (T: number) => {
  const pow = CANDS.map(([, p]) => Math.pow(p, 1 / T));
  const z = pow.reduce((a, b) => a + b, 0) + REST_N * Math.pow(REST_P, 1 / T);
  return pow.map((v) => v / z);
};

const COLD_PICKS = ["mat", "mat", "mat", "mat", "mat"];
const HOT_PICKS = ["floor", "mat", "roof", "couch", "xylophone"];

export const Predict: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const pop = usePop();
  const scoreAt = lineAt(t, 1);
  const probAt = lineAt(t, 2);
  const dialAt = lineAt(t, 3);
  const coldAt = lineAt(t, 4);
  const hotAt = lineAt(t, 5);

  const T = lerp(lerp(1, 0.3, ease(frame, coldAt + 4, 30)), 1.4, ease(frame, hotAt + 4, 30));
  const probs = atTemperature(T);
  const toProb = ease(frame, probAt + 4, 24);
  const BAR_MAX = 820;

  // narration call-outs in line 2: mat → floor → couch → xylophone
  const callouts: Record<string, number> = { mat: 0.42, floor: 0.6, couch: 0.71, xylophone: 0.82 };

  return (
    <SceneShell frames={t.frames} kicker="Step 5 · Prediction">
      <div style={{ position: "absolute", top: 170, left: 0, right: 0, textAlign: "center", fontFamily: FONT.mono, fontSize: 60 }}>
        The cat sat on <span style={{ color: C.cyan, textShadow: `0 0 ${24 * windowed(frame, lineAt(t, 0) + 30, scoreAt, 14)}px ${C.cyan}` }}>the</span>
        <span style={{ color: C.cyan, opacity: Math.floor(frame / 8) % 2 ? 1 : 0.3 }}> ▌</span>
      </div>
      <div style={{ position: "absolute", top: 270, left: 0, right: 0, textAlign: "center", fontSize: 30, color: C.dim, opacity: windowed(frame, within(t, 0, 0.5), probAt, 10) }}>
        only the last token&apos;s final numbers decide what comes next
      </div>

      {/* candidates */}
      <div style={{ position: "absolute", top: 350, left: 330, width: 1260 }}>
        {CANDS.map(([word, p1], i) => {
          const appear = ease(frame, scoreAt + 6 + i * 3, 10);
          const p = probs[i];
          const logit = (Math.log(p1) + 9).toFixed(1);
          const hotWord = callouts[word] !== undefined && frame >= within(t, 2, callouts[word]) && frame < within(t, 2, callouts[word]) + 26;
          const width = Math.max(4, p * BAR_MAX) * toProb;
          return (
            <div key={word} style={{ display: "flex", alignItems: "center", height: 62, opacity: appear }}>
              <div style={{ width: 260, fontFamily: FONT.mono, fontSize: 38, textAlign: "right", paddingRight: 28, color: hotWord ? C.text : C.dim, fontWeight: hotWord ? 700 : 400 }}>
                {word}
              </div>
              <div style={{ width: 110, fontFamily: FONT.mono, fontSize: 30, color: C.amber, opacity: 1 - toProb * 0.75 }}>{logit}</div>
              <div style={{ height: 34, width, borderRadius: 8, background: hotWord ? C.text : i === 0 ? C.cyan : `${C.cyan}99` }} />
              <div style={{ marginLeft: 18, fontFamily: FONT.mono, fontSize: 32, color: hotWord ? C.text : C.dim, opacity: toProb }}>
                {p < 0.001 ? "<0.1%" : `${(p * 100).toFixed(p < 0.1 ? 1 : 0)}%`}
              </div>
            </div>
          );
        })}
        <div style={{ marginLeft: 260, marginTop: 6, fontSize: 28, color: C.dim, opacity: ease(frame, within(t, 1, 0.6)) }}>
          ⋮ plus ~100,000 more
        </div>
      </div>
      <div style={{ position: "absolute", top: 322, left: 590, fontSize: 24, letterSpacing: 3, color: C.amber, opacity: windowed(frame, scoreAt + 6, probAt + 20, 10) }}>
        SCORE
      </div>

      {/* temperature dial */}
      <div style={{ position: "absolute", top: 905, left: 330, width: 760, opacity: ease(frame, within(t, 3, 0.55)) }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: C.dim, marginBottom: 10 }}>
          <span style={{ color: "#3fa9ff" }}>❄ predictable</span>
          <span style={{ color: C.text, fontFamily: FONT.mono }}>temperature {T.toFixed(1)}</span>
          <span style={{ color: C.red }}>creative / weird 🔥</span>
        </div>
        <div style={{ height: 10, borderRadius: 5, background: `linear-gradient(90deg, #3fa9ff, ${C.amber}, ${C.red})`, position: "relative" }}>
          <div style={{ position: "absolute", top: -14, left: `${((T - 0.1) / 1.5) * 100}%`, marginLeft: -19, width: 38, height: 38, borderRadius: 19, background: C.text, border: `5px solid ${C.bg}` }} />
        </div>
      </div>

      {/* sampled picks */}
      <div style={{ position: "absolute", top: 890, left: 1150, width: 680 }}>
        <div style={{ fontSize: 26, color: C.dim, marginBottom: 12, opacity: ease(frame, coldAt + 20) }}>picks:</div>
        {[
          { picks: COLD_PICKS, line: 4, color: "#3fa9ff", until: hotAt },
          { picks: HOT_PICKS, line: 5, color: C.red, until: t.frames + 99 },
        ].map(({ picks, line, color, until }) => (
          <div key={line} style={{ position: "absolute", top: 44, display: "flex", gap: 10, opacity: frame < until ? 1 : 0 }}>
            {picks.map((w, i) => {
              const at = within(t, line, 0.3 + i * 0.13);
              return (
                <Chip key={i} color={w === "xylophone" ? C.pink : color} size={26} style={{ opacity: pop(at), transform: `scale(${pop(at, 9)})` }}>
                  {w}
                </Chip>
              );
            })}
          </div>
        ))}
      </div>
      <Footnote opacity={ease(frame, probAt + 10) * (1 - ease(frame, dialAt, 10))}>numbers illustrative</Footnote>
    </SceneShell>
  );
};
