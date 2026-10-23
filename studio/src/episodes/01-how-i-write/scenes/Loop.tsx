import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, TOKEN_COLORS } from "../../../lib/theme";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { Chip, SceneShell, ease, lerp, usePop, windowed } from "../../../lib/ui";

const NODES = [
  { label: "text so far", color: C.text },
  { label: "every layer", color: C.violet },
  { label: "probabilities", color: C.cyan },
  { label: "pick one", color: C.amber },
];
const CX = 960;
const CY = 430;
const RX = 520;
const RY = 190;
const nodePos = (k: number) => {
  const a = Math.PI + (k / NODES.length) * Math.PI * 2; // start at left, go clockwise
  return { x: CX + Math.cos(a) * RX, y: CY + Math.sin(a) * RY };
};

const WRITTEN =
  "The token I picked gets glued onto the end of the text , and the entire process runs again . Every token . Through every layer . For one more piece .".split(" ");

const POEM_1 = "The night was cold, the wind was thin,";
const POEM_2 = ["she", "found", "a", "door", "and", "hurried"];

export const Loop: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const pop = usePop();
  const loopAt = lineAt(t, 1);
  const countAt = lineAt(t, 2);
  const planAt = lineAt(t, 3);
  const endAt = lineAt(t, 4);

  // Orbit speeds up over time: laps(f) is the integral of an increasing rate.
  const f = Math.max(0, frame - loopAt);
  const laps = f / 46 + (f * f) / 9000;
  const angle = Math.PI + laps * Math.PI * 2;
  const words = Math.min(WRITTEN.length, Math.floor(laps));
  const loopOpacity = windowed(frame, loopAt - 6, planAt, 12);

  const counting = ease(frame, countAt, t.lines[2].audioFrames * 0.85);
  const tokenCount = Math.round(lerp(words, 1000, counting));

  return (
    <SceneShell frames={t.frames} kicker="Step 6 · The loop">
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 100,
          fontWeight: 800,
          opacity: windowed(frame, lineAt(t, 0), loopAt, 10),
        }}
      >
        the whole <span style={{ color: C.amber }}>trick</span>
      </div>

      {/* the cycle */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: loopOpacity }}>
        <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke={C.line} strokeWidth={5} strokeDasharray="6 14" strokeDashoffset={-frame * 2} />
        <circle cx={CX + Math.cos(angle) * RX} cy={CY + Math.sin(angle) * RY} r={20} fill={C.amber} />
        <circle cx={CX + Math.cos(angle) * RX} cy={CY + Math.sin(angle) * RY} r={38} fill={C.amber} opacity={0.25} />
      </svg>
      {NODES.map((n, k) => {
        const p = nodePos(k);
        const phase = (((laps * NODES.length) % NODES.length) + NODES.length) % NODES.length;
        const near = Math.min(Math.abs(phase - k), NODES.length - Math.abs(phase - k)) < 0.5;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: p.x - 170,
              top: p.y - 44,
              width: 340,
              height: 88,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              fontWeight: 600,
              background: C.panel,
              border: `3px solid ${n.color}`,
              color: n.color,
              opacity: loopOpacity * ease(frame, loopAt + k * 5, 10),
              boxShadow: near ? `0 0 40px ${n.color}88` : "none",
            }}
          >
            {n.label}
          </div>
        );
      })}
      <div style={{ position: "absolute", top: CY - 58, left: 0, right: 0, textAlign: "center", opacity: loopOpacity }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 84, fontWeight: 700, color: C.text }}>{tokenCount.toLocaleString("en-US")}{counting >= 1 ? "+" : ""}</div>
        <div style={{ fontSize: 28, color: C.dim }}>tokens written</div>
      </div>

      {/* the growing text */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 260,
          right: 260,
          fontFamily: FONT.mono,
          fontSize: 34,
          lineHeight: 1.6,
          textAlign: "center",
          opacity: loopOpacity,
        }}
      >
        {WRITTEN.slice(0, words).map((w, i) => (
          <span key={i} style={{ color: i === words - 1 ? C.amber : C.text }}>
            {/^[.,]$/.test(w) ? w : ` ${w}`}
          </span>
        ))}
        <span style={{ color: C.cyan }}> ▌</span>
      </div>

      {/* line 3 — planning ahead */}
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: FONT.mono, fontSize: 52, lineHeight: 2, opacity: windowed(frame, planAt, endAt, 12) }}>
        <div style={{ color: C.dim }}>{POEM_1}</div>
        <div>
          {POEM_2.map((w, i) => (
            <span key={i} style={{ opacity: ease(frame, within(t, 3, 0.62 + i * 0.05), 6) }}>
              {w}{" "}
            </span>
          ))}
          <span
            style={{
              color: C.green,
              fontWeight: 700,
              opacity: ease(frame, within(t, 3, 0.36), 10),
              textShadow: `0 0 ${20 + 14 * Math.sin(frame * 0.3)}px ${C.green}`,
            }}
          >
            in.
          </span>
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 32, color: C.green, marginTop: 30, opacity: windowed(frame, within(t, 3, 0.4), endAt, 10) }}>
          ↑ rhyme chosen first — then the line written to reach it
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 24, color: C.dim, marginTop: 50, fontStyle: "italic" }}>
          illustration of a finding from Anthropic&apos;s interpretability research (2025)
        </div>
      </div>

      {/* line 4 */}
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, opacity: ease(frame, endAt) }}>
        {["one piece", "then the next", "then the next"].map((w, i) => {
          const at = within(t, 4, 0.42 + i * 0.2);
          return (
            <React.Fragment key={i}>
              {i > 0 ? <span style={{ fontSize: 50, color: C.dim, opacity: pop(at) }}>→</span> : null}
              <Chip color={TOKEN_COLORS[i]} size={54} style={{ opacity: pop(at) * (i === 2 ? 0.5 : 1), transform: `scale(${pop(at, 9)})` }}>
                {w}
              </Chip>
            </React.Fragment>
          );
        })}
      </div>
    </SceneShell>
  );
};
