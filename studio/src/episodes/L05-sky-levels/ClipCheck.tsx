import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

// Temporary frame check of the L05 clips (stage 2). Removed before the build commit.
const row = (clip: string, secs: number[]) => secs.map((s) => ({ clip, s }));
const T = [
  ...row("l05-clip-balloon", [1, 10, 20, 30, 40, 50, 60, 66, 72, 78]),
  ...row("l05-clip-er2", [5, 60, 110, 160, 210, 260, 310, 360, 410, 460]),
  ...row("l05-clip-orbit", [2, 14, 26, 38, 50, 62, 74, 86, 98, 110]),
];
export const ClipCheckL05: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
    {T.map((c, i) => (
      <div key={i} style={{ width: 384, height: 216, position: "relative", overflow: "hidden" }}>
        <OffthreadVideo src={staticFile(`assets/${c.clip}.mp4`)} startFrom={c.s * 30} muted style={{ width: 384, height: 216, objectFit: "cover" }} />
        <div style={{ position: "absolute", left: 4, top: 4, background: "#000", color: "#fff", fontSize: 20 }}>{c.s}s</div>
      </div>
    ))}
  </AbsoluteFill>
);
