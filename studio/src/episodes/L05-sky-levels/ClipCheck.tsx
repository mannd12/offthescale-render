import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

// Temporary frame check of the L05 clips (stage 2). Removed before the build commit.
const row = (clip: string, secs: number[]) => secs.map((s) => ({ clip, s }));
const T = [
  ...row("l05-clip-er2", [160, 180, 200, 220, 240, 255, 270, 285, 295, 305]),
  ...row("l05-clip-er2", [320, 335, 350, 365, 380, 395, 410, 430, 450, 470]),
  ...row("l05-clip-orbit", [2, 14, 26, 38, 50, 62, 74, 86, 98, 110]),
];
export const ClipCheckL05: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
    {T.map((c, i) => (
      <div key={i} style={{ width: 384, height: 216, position: "relative", overflow: "hidden" }}>
        <OffthreadVideo src={staticFile(`assets/${c.clip}.mp4`)} startFrom={c.s} muted style={{ width: 384, height: 216, objectFit: "cover" }} />
        <div style={{ position: "absolute", left: 4, top: 4, background: "#000", color: "#fff", fontSize: 20 }}>{c.s}s</div>
      </div>
    ))}
  </AbsoluteFill>
);
