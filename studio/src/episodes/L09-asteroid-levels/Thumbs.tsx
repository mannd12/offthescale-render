import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { B, F } from "../../brand/tokens";

loadBrandFonts();

// the silhouettes are drawn (the honesty catch in brief.md): a plain rising row of sizes
const ROW = [6, 12, 22, 38, 62, 96, 150];

/** L09 thumbnail: "WE TOUCHED ONE". Right: the real SamCam frame (NASA SVS 31244, PD). Left: a drawn row of sizes. */
export const ThumbL09: React.FC = () => {
  let x = 44;
  return (
    <AbsoluteFill style={{ backgroundColor: "#050E18" }}>
      <div style={{ position: "absolute", left: 560, top: 0, width: 720, height: 720, overflow: "hidden" }}>
        <OffthreadVideo src={staticFile("assets/l09-clip-bennu.mp4")} startFrom={150} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #050E18 0%, #050E18 42%, rgba(5,14,24,0.15) 66%, rgba(5,14,24,0) 100%)" }} />
      <div style={{ position: "absolute", left: 44, top: 14, fontFamily: F.headline, fontSize: 158, lineHeight: 1.04, color: B.paper, whiteSpace: "nowrap" }}>
        WE
        <br />
        <span style={{ color: B.gauge }}>TOUCHED</span>
        <br />
        ONE
      </div>
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        {ROW.map((d, i) => {
          const cx = x + d / 2;
          x += d + 12;
          return <circle key={d} cx={cx} cy={704 - d / 2} r={d / 2} fill={i === 5 ? B.gauge : "#5B7186"} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
