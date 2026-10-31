import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";

// Stage 2 check, cloud only: every L08 picture on one sheet, looked at before any scene is designed around it.
const IMGS: [string, string?][] = [["bec"], ["dipole"], ["dipole-close"], ["magnet-types"], ["aster"], ["cmb"], ["boomerang-alma"], ["boomerang-hst"], ["hermite"], ["pluto"], ["antarctica"], ["vostok"], ["venus-uv"], ["venus-globe"], ["mercury"], ["fountain"], ["sun-white"], ["lightning-a"], ["lightning-b"], ["nstx"], ["cmod"], ["gold"], ["star"], ["rhic"], ["eclipse"], ["eclipse-art"]];
const CLIPS: [string, number][] = [["fountains", 0], ["fountains", 300], ["fountains", 800], ["lake", 0], ["lake", 600], ["wispr", 0], ["wispr", 300], ["iss", 0], ["iss", 200], ["iss", 500], ["iss", 900], ["iss", 1300], ["iss", 1700], ["lro", 0], ["lro", 300], ["lro", 700], ["lro", 1100], ["lro", 1500]];

const Cell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ width: 274, height: 180, position: "relative", overflow: "hidden", background: "#222" }}>
    {children}
    <div style={{ position: "absolute", left: 0, bottom: 0, padding: "1px 6px", background: "#000", color: "#FF0", fontFamily: "sans-serif", fontSize: 18 }}>{label}</div>
  </div>
);

export const AssetSheetL08: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
    {IMGS.map(([id]) => (
      <Cell key={id} label={id}>
        <Img src={staticFile(`assets/l08-${id}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </Cell>
    ))}
    {CLIPS.map(([id, at]) => (
      <Cell key={`${id}${at}`} label={`${id}@${at}`}>
        <OffthreadVideo src={staticFile(`assets/l08-clip-${id}.mp4`)} startFrom={at} muted style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </Cell>
    ))}
  </AbsoluteFill>
);
