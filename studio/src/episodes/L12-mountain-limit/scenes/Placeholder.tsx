// Placeholder scene body: a family-coloured Stage with the scene's kicker, so the full `l12` composition renders end
// to end before any shot exists. A builder REPLACES the scene file's body with its shot list (see BUILD.md); the
// overlay here (scene id · line index · fraction) is also what a review still of an unbuilt scene shows.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Family, Headline, Kicker, Layer, Motes, Pill, Sky, Stage, Stars, Tick, ridgePath } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { pillFill } from "../families";
import { L12Gauge, HEIGHTS } from "../L12Gauge";
import { lineAtFrame } from "../shots";

export const Placeholder: React.FC<{ t: SceneTiming; family: Family; id: string; name: string; lines: string; act: string; value?: number }> = ({ t, family: F, id, name, lines, act, value }) => {
  const f = useCurrentFrame();
  const { line, frac } = lineAtFrame(t, f);
  const progress = Math.min(1, f / Math.max(1, t.frames));
  const v = value ?? HEIGHTS.everestRounded * progress;
  const ground = 980;
  return (
    <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.04, frames: Math.max(120, t.frames), seed: id.length }} vignette={F.dark ? 0.24 : 0.1} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        {F.dark ? <Stars frame={f} n={60} w={1920} h={420} color={F.text} seed={5} size={1.3} twinkle={0.6} /> : null}
      </Layer>
      <Layer depth={0.3} haze={{ color: F.haze, amount: 0.3 }}>
        <path d={ridgePath([[-400, 820], [200, 740], [700, 790], [1200, 720], [1700, 780], [2320, 740]], 1300, 60)} fill={F.far} />
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={ground} width={2720} height={400} fill={F.near} />
        <Tick x={1380} y={ground} pxPerM={90} frame={f} pose="think" expression="thinking" look={-0.4} facing={-1} outline={F.shadow} />
        <Motes frame={f} n={30} x={100} y={100} w={1700} h={800} color={F.light} seed={7} size={3.5} drift={46} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={128} text={`— L12 · Act ${act} · placeholder`} color={F.dim} size={22} />
        <Headline x={120} y={250} lines={[name]} size={84} color={F.text} accent={F.light} shadow={F.shadow} rule />
        <Pill x={120} y={330} text={`${id} · script lines ${lines}`} fill={pillFill(F)} color={F.text} dot={F.light} size={18} />
        <Pill x={120} y={376} text={line < 0 ? "lead-in" : `line ${t.lines[line].index} · ${Math.round(Math.min(1, frac) * 100)} %`} fill={pillFill(F)} color={F.text} size={18} />
        <L12Gauge family={F} value={v} base="ABOVE SEA LEVEL" ceiling={{ v: 9000 }} />
      </Layer>
    </Stage>
  );
};
