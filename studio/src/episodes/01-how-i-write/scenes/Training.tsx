import React from "react";
import { random, useCurrentFrame } from "remotion";
import { C, FONT } from "../../../lib/theme";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { SceneShell, ease, lerp, usePop, windowed } from "../../../lib/ui";

const COLS = 16;
const ROWS = 4;
const GUESSES: [string, boolean][] = [
  ["xylophone", false],
  ["banana", false],
  ["roof", false],
  ["floor", false],
  ["mat", true],
];
const SKILLS = ["grammar", "facts", "some reasoning", "a sense of humour*"];

export const Training: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const pop = usePop();
  const randomAt = lineAt(t, 1);
  const trainAt = lineAt(t, 2);
  const assistAt = lineAt(t, 3);
  const coreAt = lineAt(t, 4);
  const skillsAt = lineAt(t, 5);

  const learn = ease(frame, trainAt + 10, t.lines[2].audioFrames * 0.9);
  const jitter = windowed(frame, randomAt, trainAt + 30, 10);
  const guessIdx = Math.min(GUESSES.length - 1, Math.floor(learn * GUESSES.length));
  const [guess, right] = GUESSES[guessIdx];
  const dialsOpacity = 1 - ease(frame, coreAt - 6, 14) * 0.85;

  // loss curve: noisy exponential decay, revealed as training progresses
  const pts = Array.from({ length: 80 }, (_, i) => {
    const x = i / 79;
    const y = Math.exp(-x * 4) * 0.85 + 0.08 + (random(`loss${i}`) - 0.5) * 0.06 * (1 - x * 0.7);
    return [x, y] as const;
  });
  const visible = pts.filter(([x]) => x <= learn);
  const G = { x: 1240, y: 640, w: 520, h: 260 };

  return (
    <SceneShell frames={t.frames} kicker="Where the numbers come from">
      {/* the dials */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: dialsOpacity }}>
        {Array.from({ length: COLS * ROWS }, (_, n) => {
          const cx = 210 + (n % COLS) * 100;
          const cy = 250 + Math.floor(n / COLS) * 100;
          const start = random(`d${n}`) * 360;
          const target = random(`t${n}`) * 360;
          const wobble = jitter * 40 * Math.sin(frame * 0.3 + n);
          const a = ((lerp(start, target + 720, learn) + wobble) * Math.PI) / 180;
          const appear = ease(frame, 4 + (n % COLS) * 1.5, 10);
          return (
            <g key={n} opacity={appear}>
              <circle cx={cx} cy={cy} r={34} fill={C.panel} stroke={learn > 0.98 ? C.cyan : C.line} strokeWidth={3} />
              <line x1={cx} y1={cy} x2={cx + Math.cos(a) * 26} y2={cy + Math.sin(a) * 26} stroke={learn > 0.98 ? C.cyan : C.amber} strokeWidth={5} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", top: 160, left: 176, fontSize: 30, color: C.dim, opacity: dialsOpacity * ease(frame, within(t, 0, 0.6)) }}>
        billions of adjustable numbers (“parameters”) —{" "}
        <span style={{ color: C.amber, opacity: ease(frame, within(t, 1, 0.45)) }}>all starting random</span>
      </div>

      {/* line 2 — predict, check, nudge */}
      <div style={{ position: "absolute", top: 730, left: 176, width: 1000, opacity: windowed(frame, trainAt, coreAt, 12) }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 46 }}>
          The cat sat on the{" "}
          <span style={{ color: right ? C.green : C.red, borderBottom: `4px solid ${right ? C.green : C.red}` }}>{guess}</span>
          <span style={{ marginLeft: 18, color: right ? C.green : C.red }}>{right ? "✓" : "✗"}</span>
        </div>
        <div style={{ fontSize: 30, color: C.dim, marginTop: 22 }}>
          guess → check against real text → nudge every dial →{" "}
          <span style={{ fontFamily: FONT.mono, color: C.text }}>{(learn * 10).toFixed(1)} trillion</span> tokens seen
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: windowed(frame, trainAt + 10, coreAt, 12) }}>
        <rect x={G.x} y={G.y} width={G.w} height={G.h} rx={16} fill={`${C.panel}cc`} stroke={C.line} strokeWidth={2} />
        <text x={G.x + 20} y={G.y + 40} fontSize={26} fill={C.dim} fontFamily={FONT.sans}>
          how wrong (loss)
        </text>
        <polyline
          points={visible.map(([x, y]) => `${G.x + 20 + x * (G.w - 40)},${G.y + G.h - 20 - y * (G.h - 70)}`).join(" ")}
          fill="none"
          stroke={C.pink}
          strokeWidth={5}
          strokeLinejoin="round"
        />
      </svg>

      {/* line 3 — base model → assistant */}
      <div style={{ position: "absolute", top: 730, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, fontSize: 40, opacity: windowed(frame, assistAt, coreAt, 12) }}>
        <span style={{ padding: "18px 30px", borderRadius: 16, border: `3px solid ${C.dim}`, color: C.dim }}>raw text predictor</span>
        <span style={{ color: C.dim }}>→ more training →</span>
        <span style={{ padding: "18px 30px", borderRadius: 16, border: `3px solid ${C.green}`, color: C.green, opacity: ease(frame, within(t, 3, 0.55)) }}>helpful assistant</span>
      </div>

      {/* lines 4–5 */}
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", opacity: ease(frame, coreAt) }}>
        <div style={{ fontSize: 96, fontWeight: 800, transform: `scale(${lerp(0.94, 1, ease(frame, coreAt, 30))})` }}>
          predict the <span style={{ color: C.cyan }}>next piece</span>
        </div>
        <div style={{ marginTop: 70, display: "flex", justifyContent: "center", gap: 28 }}>
          {SKILLS.map((s, i) => {
            const at = within(t, 5, 0.38 + i * 0.12);
            return (
              <div key={s} style={{ fontSize: 40, padding: "16px 28px", borderRadius: 16, background: C.panel, border: `2px solid ${C.line}`, opacity: pop(at), transform: `translateY(${lerp(24, 0, pop(at))}px)` }}>
                <span style={{ color: C.green }}>+ </span>
                {s}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 40, fontSize: 30, color: C.dim, fontStyle: "italic", opacity: ease(frame, within(t, 5, 0.9), 8) }}>*allegedly</div>
        <div style={{ marginTop: 10, fontSize: 30, color: C.dim, opacity: ease(frame, skillsAt + 10) }}>…picked up along the way, because they help predict</div>
      </div>
    </SceneShell>
  );
};
