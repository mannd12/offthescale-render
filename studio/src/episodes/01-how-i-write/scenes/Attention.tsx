import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../../../lib/theme";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { Footnote, SceneShell, ease, lerp, windowed } from "../../../lib/ui";

const A = ["She", "sat", "by", "the", "river", "bank"];
const B = ["She", "robbed", "the", "bank"];
// How much "bank" attends to each token of sentence A (sums to 1, illustrative).
const WEIGHTS = [0.06, 0.08, 0.05, 0.07, 0.62, 0.12];

const CHAR = 30;
const PAD = 26;
const GAP = 22;
const layout = (words: string[], cx: number) => {
  const widths = words.map((w) => w.length * CHAR + PAD * 2);
  const total = widths.reduce((a, b) => a + b, 0) + GAP * (words.length - 1);
  let x = cx - total / 2;
  return widths.map((w) => {
    const box = { x, w, mid: x + w / 2 };
    x += w + GAP;
    return box;
  });
};

const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], t))).join(",")})`;
};

const Row: React.FC<{ words: string[]; y: number; bankColor: string; opacity: number; bankGlow: number }> = ({
  words,
  y,
  bankColor,
  opacity,
  bankGlow,
}) => (
  <g opacity={opacity}>
    {layout(words, 960).map((b, i) => {
      const isBank = words[i] === "bank";
      return (
        <g key={i}>
          <rect
            x={b.x}
            y={y}
            width={b.w}
            height={92}
            rx={18}
            fill={isBank ? `${bankColor}` : C.panel}
            fillOpacity={isBank ? 0.25 + bankGlow * 0.2 : 1}
            stroke={isBank ? bankColor : C.line}
            strokeWidth={isBank ? 4 : 2}
          />
          <text x={b.mid} y={y + 62} textAnchor="middle" fontSize={50} fontFamily={FONT.mono} fill={C.text}>
            {words[i]}
          </text>
        </g>
      );
    })}
  </g>
);

export const Attention: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const bankAt = lineAt(t, 1);
  const nameAt = lineAt(t, 2);
  const lookAt = lineAt(t, 3);
  const weighAt = lineAt(t, 4);
  const shiftAt = lineAt(t, 5);
  const allAt = lineAt(t, 6);

  const focus = ease(frame, nameAt + 4, 22); // sentence B leaves, A centers
  const yA = lerp(380, 560, focus);
  const boxes = layout(A, 960);
  const bank = boxes[5];

  const weigh = ease(frame, weighAt + 6, 26);
  const shift = ease(frame, shiftAt + 4, 40);
  const bankColor = frame < shiftAt ? C.violet : mix(C.violet, "#3fa9ff", shift);
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.25);
  const all = ease(frame, within(t, 6, 0.05), 30);

  return (
    <SceneShell frames={t.frames} kicker="Step 3 · Attention">
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Row words={A} y={yA} bankColor={bankColor} opacity={1} bankGlow={frame >= bankAt ? pulse : 0} />
        <Row words={B} y={620} bankColor={C.violet} opacity={1 - focus} bankGlow={frame >= bankAt ? pulse : 0} />

        {/* bank → every earlier token */}
        {boxes.map((b, i) => {
          const w = lerp(1 / 6, WEIGHTS[i], weigh);
          const appear = ease(frame, lookAt + 8 + (5 - i) * 4, 14) * (1 - all * 0.75);
          const self = i === 5;
          const lift = self ? 70 : 110 + (bank.mid - b.mid) * 0.22;
          const d = self
            ? `M ${bank.mid - 30} ${yA} C ${bank.mid - 60} ${yA - lift}, ${bank.mid + 60} ${yA - lift}, ${bank.mid + 30} ${yA}`
            : `M ${bank.mid} ${yA} Q ${(bank.mid + b.mid) / 2} ${yA - lift} ${b.mid} ${yA}`;
          return (
            <g key={i} opacity={appear}>
              <path d={d} fill="none" stroke={A[i] === "river" && weigh > 0.3 ? "#3fa9ff" : C.violet} strokeWidth={2 + w * 30} strokeLinecap="round" opacity={0.35 + w} />
              <text
                x={self ? bank.mid : b.mid}
                y={yA + 150}
                textAnchor="middle"
                fontSize={A[i] === "river" ? 44 : 32}
                fontFamily={FONT.mono}
                fill={A[i] === "river" ? "#3fa9ff" : C.dim}
                opacity={weigh}
              >
                {Math.round(WEIGHTS[i] * 100)}%
              </text>
            </g>
          );
        })}

        {/* line 6 — every token attends to everything before it */}
        {boxes.slice(0, 5).flatMap((from, i) =>
          boxes.slice(0, i).map((to, j) => (
            <path
              key={`${i}-${j}`}
              d={`M ${from.mid} ${yA} Q ${(from.mid + to.mid) / 2} ${yA - 80 - (from.mid - to.mid) * 0.2} ${to.mid} ${yA}`}
              fill="none"
              stroke={[C.cyan, C.amber, C.pink, C.green, C.cyan][i]}
              strokeWidth={3 + 3 * Math.abs(Math.sin(frame * 0.08 + i * 2 + j))}
              opacity={all * 0.7}
            />
          )),
        )}
      </svg>

      {/* line 1 — same embedding either way */}
      <div
        style={{
          position: "absolute",
          top: 505,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 36,
          color: C.violet,
          opacity: windowed(frame, within(t, 1, 0.62), nameAt + 4, 10),
        }}
      >
        same word → same starting numbers
      </div>

      {/* line 2 — the name */}
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 110,
          fontWeight: 800,
          letterSpacing: 4,
          color: C.violet,
          opacity: windowed(frame, within(t, 2, 0.6), allAt, 12),
          transform: `scale(${lerp(1.15, 1, ease(frame, within(t, 2, 0.6), 16))})`,
        }}
      >
        ATTENTION
      </div>
      <div
        style={{
          position: "absolute",
          top: 850,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 44,
          fontStyle: "italic",
          color: C.text,
          opacity: windowed(frame, within(t, 3, 0.55), weighAt + 10, 10),
        }}
      >
        “which of you matter to me?”
      </div>

      {/* line 5 — meaning shifts */}
      <div style={{ position: "absolute", top: 850, left: 560, width: 800, opacity: windowed(frame, shiftAt, allAt, 12) }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 36, marginBottom: 14 }}>
          <span style={{ color: C.amber }}>$ money</span>
          <span style={{ color: "#3fa9ff" }}>water ≈</span>
        </div>
        <div style={{ height: 10, borderRadius: 5, background: `linear-gradient(90deg, ${C.amber}, ${C.violet}, #3fa9ff)`, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: -13,
              left: `${lerp(50, 88, shift)}%`,
              width: 36,
              height: 36,
              marginLeft: -18,
              borderRadius: 18,
              background: C.text,
              border: `5px solid ${bankColor}`,
            }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 28, color: C.dim }}>what “bank” now means</div>
      </div>

      {/* line 6 — transformer */}
      <div
        style={{
          position: "absolute",
          top: 800,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 96,
          fontWeight: 800,
          color: C.text,
          opacity: ease(frame, within(t, 6, 0.78), 14),
        }}
      >
        the <span style={{ color: C.cyan }}>Transformer</span>
      </div>
      <Footnote opacity={ease(frame, weighAt + 10) * (1 - all)}>attention weights illustrative</Footnote>
    </SceneShell>
  );
};
