import React from "react";
import { random, useCurrentFrame } from "remotion";
import { C, FONT } from "../../../lib/theme";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { SceneShell, ease, lerp, windowed } from "../../../lib/ui";

const COLS = 5;
const colX = (i: number, cx: number, spread: number) => cx + (i - (COLS - 1) / 2) * spread;

/** One transformer layer: attention (tokens mix) then feed-forward (each token alone). */
const LayerDiagram: React.FC<{ cx: number; top: number; scale: number; ffGlow: number; opacity: number }> = ({
  cx,
  top,
  scale,
  ffGlow,
  opacity,
}) => {
  const frame = useCurrentFrame();
  const s = 150;
  return (
    <g transform={`translate(${cx} ${top}) scale(${scale}) translate(${-cx} 0)`} opacity={opacity}>
      {/* feed-forward block (upper) */}
      <rect x={cx - 470} y={0} width={940} height={170} rx={22} fill={`${C.amber}${ffGlow > 0.5 ? "33" : "14"}`} stroke={C.amber} strokeWidth={3} />
      <text x={cx - 440} y={48} fontSize={30} fill={C.amber} fontFamily={FONT.sans} fontWeight={600}>
        FEED-FORWARD · arithmetic, one token at a time
      </text>
      {Array.from({ length: COLS }, (_, i) => (
        <line key={i} x1={colX(i, cx, s)} y1={160} x2={colX(i, cx, s)} y2={70} stroke={C.amber} strokeWidth={5} strokeDasharray="4 10" strokeDashoffset={-frame * 1.5} />
      ))}
      {/* attention block (lower) */}
      <rect x={cx - 470} y={200} width={940} height={170} rx={22} fill={`${C.violet}14`} stroke={C.violet} strokeWidth={3} />
      <text x={cx - 440} y={248} fontSize={30} fill={C.violet} fontFamily={FONT.sans} fontWeight={600}>
        ATTENTION · tokens share context
      </text>
      {Array.from({ length: COLS }, (_, i) =>
        Array.from({ length: i + 1 }, (_, j) => (
          <line key={`${i}${j}`} x1={colX(j, cx, s)} y1={360} x2={colX(i, cx, s)} y2={270} stroke={C.violet} strokeWidth={i === j ? 4 : 2} opacity={i === j ? 0.9 : 0.45} />
        )),
      )}
      {Array.from({ length: COLS }, (_, i) => (
        <rect key={i} x={colX(i, cx, s) - 22} y={392} width={44} height={44} rx={10} fill={[C.cyan, C.amber, C.pink, C.green, C.violet][i]} />
      ))}
    </g>
  );
};

const STACK = 14;

export const Layers: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const pairAt = lineAt(t, 1);
  const refineAt = lineAt(t, 2);
  const honestAt = lineAt(t, 3);
  const interpAt = lineAt(t, 4);

  const stackIn = ease(frame, within(t, 1, 0.5), 30);
  const dark = ease(frame, honestAt + 6, 30) * (1 - ease(frame, interpAt + 10, 20) * 0.4);
  const slabH = 46;
  const baseY = 900;
  const lensY = lerp(baseY - 60, baseY - STACK * slabH + 40, (Math.sin((frame - interpAt) * 0.035) + 1) / 2);
  const lens = ease(frame, within(t, 4, 0.12), 16);

  return (
    <SceneShell frames={t.frames} kicker="Step 4 · Layers">
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <LayerDiagram cx={lerp(960, 520, stackIn)} top={lerp(300, 380, stackIn)} scale={lerp(1, 0.72, stackIn)} ffGlow={frame < pairAt ? ease(frame, within(t, 0, 0.3)) : 0} opacity={1 - ease(frame, honestAt, 16) * 0.75} />

        {/* the stack */}
        <g opacity={stackIn}>
          {Array.from({ length: STACK }, (_, i) => {
            const rise = ease(frame, within(t, 1, 0.5) + i * 3, 14);
            const y = baseY - (i + 1) * slabH;
            const depth = i / (STACK - 1);
            const lit = windowed(frame, refineAt, honestAt, 10) * (0.5 + 0.5 * Math.sin(frame * 0.2 - i * 0.7));
            const inLens = lens * Math.max(0, 1 - Math.abs(y + slabH / 2 - lensY) / 90);
            return (
              <g key={i} opacity={rise} transform={`translate(0 ${lerp(40, 0, rise)})`}>
                <rect x={1130} y={y + 4} width={520} height={slabH - 8} rx={10} fill={dark > 0.05 ? "#0d1226" : C.panel} stroke={depth < 0.5 ? C.violet : C.cyan} strokeOpacity={lerp(0.9, 0.25, dark) + inLens} strokeWidth={2.5} />
                {Array.from({ length: 13 }, (_, k) => {
                  const on = random(`cell${i}-${k}`) > 0.55;
                  return (
                    <rect
                      key={k}
                      x={1146 + k * 38}
                      y={y + 13}
                      width={28}
                      height={slabH - 26}
                      rx={5}
                      fill={on ? (depth < 0.5 ? C.violet : C.cyan) : C.line}
                      opacity={Math.min(1, lerp(0.25 + lit * (on ? 0.7 : 0.1), 0.06, dark) + inLens * (on ? 1 : 0.2))}
                    />
                  );
                })}
              </g>
            );
          })}
          <text x={1390} y={baseY - STACK * slabH - 46} textAnchor="middle" fontSize={34} fill={C.dim} fontFamily={FONT.sans}>
            ⋮ dozens of layers
          </text>
          {/* magnifier */}
          <g opacity={lens}>
            <circle cx={1390} cy={lensY} r={96} fill="none" stroke={C.green} strokeWidth={6} />
            <line x1={1458} y1={lensY + 68} x2={1530} y2={lensY + 140} stroke={C.green} strokeWidth={10} strokeLinecap="round" />
          </g>
        </g>

        {/* bracket: that pair = one layer */}
        <g opacity={windowed(frame, within(t, 1, 0.3), honestAt, 10)}>
          <text x={lerp(960, 520, stackIn)} y={lerp(800, 760, stackIn)} textAnchor="middle" fontSize={40} fill={C.text} fontFamily={FONT.sans} fontWeight={600}>
            = one layer
          </text>
        </g>
      </svg>

      {/* line 2 labels */}
      <div style={{ position: "absolute", left: 1680, top: 770, fontSize: 28, color: C.violet, width: 220, opacity: windowed(frame, within(t, 2, 0.35), honestAt, 10) }}>
        early: grammar, nearby words
      </div>
      <div style={{ position: "absolute", left: 1680, top: 300, fontSize: 28, color: C.cyan, width: 220, opacity: windowed(frame, within(t, 2, 0.68), honestAt, 10) }}>
        deep: abstract meaning
      </div>

      {/* line 3 */}
      <div
        style={{
          position: "absolute",
          left: 1130,
          width: 520,
          top: 430,
          textAlign: "center",
          fontSize: 200,
          fontWeight: 800,
          color: C.text,
          opacity: windowed(frame, honestAt + 16, interpAt + 6, 12),
        }}
      >
        ?
      </div>
      <div style={{ position: "absolute", left: 140, width: 800, top: 820, fontSize: 40, color: C.dim, opacity: windowed(frame, within(t, 3, 0.35), interpAt, 10) }}>
        nobody fully understands what happens in here.
        <span style={{ color: C.text, opacity: ease(frame, within(t, 3, 0.82)) }}> Including me.</span>
      </div>
      {/* line 4 */}
      <div style={{ position: "absolute", left: 140, width: 800, top: 820, fontSize: 44, opacity: ease(frame, within(t, 4, 0.25)) }}>
        the field: <span style={{ color: C.green, fontWeight: 700 }}>interpretability</span>
      </div>
    </SceneShell>
  );
};
