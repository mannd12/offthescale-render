// PLACEHOLDER (wiring stub) - the scene builder replaces this whole file.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneTiming } from "../../../lib/timeline";
import { Cue } from "./cue-types";

export const SceneL05: React.FC<{ t: SceneTiming }> = ({ t }) => (
  <AbsoluteFill style={{ backgroundColor: "#F1EADB", alignItems: "center", justifyContent: "center", fontSize: 80 }}>
    {t.id}
  </AbsoluteFill>
);

export const soundL05 = (_t: SceneTiming): Cue[] => [];

