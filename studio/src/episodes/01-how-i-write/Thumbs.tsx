import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, TOKEN_COLORS } from "../../lib/theme";
import { Background, Chip, Orb } from "../../lib/ui";

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT.sans, color: C.text }}>
    <Background />
    {children}
  </AbsoluteFill>
);

const BARS: [string, number, string][] = [
  ["mat", 0.82, C.cyan],
  ["floor", 0.34, `${C.cyan}aa`],
  ["xylophone", 0.03, C.pink],
];

/** A: the host + "I guess every word" + the distribution. */
export const ThumbA: React.FC = () => (
  <Frame>
    <Orb x={330} y={360} r={170} speaking />
    <div style={{ position: "absolute", left: 590, top: 90, fontSize: 94, fontWeight: 900, lineHeight: 1.08, letterSpacing: -3, whiteSpace: "nowrap" }}>
      I <span style={{ color: C.amber }}>GUESS</span>
      <br />
      EVERY WORD
    </div>
    <div style={{ position: "absolute", left: 590, top: 390, width: 640 }}>
      {BARS.map(([w, v, color]) => (
        <div key={w} style={{ display: "flex", alignItems: "center", height: 86 }}>
          <div style={{ width: 300, fontFamily: FONT.mono, fontSize: 52, fontWeight: 700 }}>{w}</div>
          <div style={{ height: 50, width: Math.max(14, v * 330), borderRadius: 12, background: color }} />
        </div>
      ))}
    </div>
  </Frame>
);

/** B: what the model actually sees. */
export const ThumbB: React.FC = () => (
  <Frame>
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontSize: 78, fontWeight: 900, letterSpacing: -2, whiteSpace: "nowrap" }}>
      WHAT AN AI <span style={{ color: C.cyan }}>ACTUALLY</span> SEES
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", gap: 18 }}>
      {["str", "aw", "berry"].map((p, i) => (
        <Chip key={p} color={TOKEN_COLORS[i]} size={120} style={{ borderWidth: 6, fontWeight: 700 }}>
          {p}
        </Chip>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center", gap: 18 }}>
      {[496, 675, 15717].map((id, i) => (
        <div key={id} style={{ fontFamily: FONT.mono, fontSize: 84, fontWeight: 700, color: TOKEN_COLORS[i], width: [300, 250, 440][i], textAlign: "center" }}>
          {id}
        </div>
      ))}
    </div>
    <Orb x={1160} y={610} r={46} speaking />
  </Frame>
);
