// L14 scene "l01": PLACEHOLDER. The package builder replaces this body with the storyboard's shots (BUILD.md).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneTiming } from "../../../lib/timeline";
import { lineAtFrame } from "../shots";
import { Cue } from "./cue-types";

export const SceneL01: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const { line } = lineAtFrame(t, f);
  return (
    <AbsoluteFill style={{ backgroundColor: "#1E4A5C", color: "#FFF4DE", fontSize: 54, padding: 120, fontFamily: "sans-serif" }}>
      <div>L14 · l01 · line {line} (placeholder)</div>
      <div style={{ marginTop: 40, fontSize: 40, opacity: 0.85 }}>{line >= 0 ? t.lines[line].text : ""}</div>
    </AbsoluteFill>
  );
};

export const soundL01 = (_t: SceneTiming): Cue[] => [];
