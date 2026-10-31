import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";

// Stage 2 check, cloud only: every L07 picture on one sheet, looked at before any scene is designed around it.
const IMGS = ["ml-aerial", "strom-kuhnmi", "strom-day", "msh-night", "red-apr", "red-mar", "eyja-plume", "eyja-sat", "msh-blowdown", "msh-plume", "pina-jun12", "pina-jun15", "pina-caldera", "novarupta", "vtts", "tam-iss", "tam-pano", "crater", "tuff", "tuff-cliff", "toba", "tonga-iss"];
const CLIPS: [string, number][] = [["fountains", 0], ["fountains", 300], ["wide", 0], ["wide", 450], ["flow", 0], ["flow", 500], ["dome", 0], ["dome", 200], ["dome", 800], ["wing", 0], ["wing", 240], ["wing", 470], ["column", 0], ["column", 240], ["column", 470], ["billow", 0], ["billow", 240], ["billow", 470], ["tonga", 0], ["tonga", 200]];

const Cell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ width: 274, height: 180, position: "relative", overflow: "hidden", background: "#222" }}>
    {children}
    <div style={{ position: "absolute", left: 0, bottom: 0, padding: "1px 6px", background: "#000", color: "#FF0", fontFamily: "sans-serif", fontSize: 18 }}>{label}</div>
  </div>
);

export const AssetSheetL07: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
    {IMGS.map((id) => (
      <Cell key={id} label={id}>
        <Img src={staticFile(`assets/l07-${id}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </Cell>
    ))}
    {CLIPS.map(([id, at]) => (
      <Cell key={`${id}${at}`} label={`${id}@${at}`}>
        <OffthreadVideo src={staticFile(`assets/l07-clip-${id}.mp4`)} startFrom={at} muted style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </Cell>
    ))}
  </AbsoluteFill>
);
