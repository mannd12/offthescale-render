import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S40 - hotter than infinity (episodes/S40-temperature-negative). For L08 ("Past the top", 6:49). Vertical 1080x1920.
 * All drawn (no picture of the experiment exists in the manifest): a thermometer with a coral floor at 0 K and a cluster
 * of atoms under it; the cluster rises past the top of the tube; then the scale as a line that runs to infinity and
 * comes back in at the negative end; the dissent (#67) on its own card. How it works (#65) and why (#66) are withheld.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const TX = 700;
const TOP = 330;
const FLOOR = 860;
const ATOMS = Array.from({ length: 22 }, (_, i) => ({ dx: Math.cos(i * 2.4) * Math.sqrt((i + 0.5) / 22), dy: Math.sin(i * 2.4) * Math.sqrt((i + 0.5) / 22) }));

const Atoms: React.FC<{ cx: number; cy: number; opacity: number }> = ({ cx, cy, opacity }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity }}>
      <circle cx={cx} cy={cy} r={70} fill={B.tease} opacity={0.25 + 0.1 * Math.sin(frame / 6)} />
      {ATOMS.map((a, i) => (
        <circle key={i} cx={cx + a.dx * 50 + 3 * Math.sin(frame / 4 + i)} cy={cy + a.dy * 50 + 3 * Math.cos(frame / 5 + i)} r={8} fill={B.gauge} />
      ))}
    </svg>
  );
};

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const floorAt = L(1);
  const neverAt = cue(t, 1, "Nothing has");
  const munichAt = L(2);
  const strangeAt = L(3);
  const notColderAt = cue(t, 3, "It isn't");
  const hotterAt = L(4);
  const wordsAt = L(5);
  const jumpsAt = cue(t, 5, "It jumps");
  const agreeAt = L(6);
  const askAt = L(7);
  const endAt = cue(t, 7, "The full video");
  const end = ease(frame, endAt, 12);

  const tubeOn = 1 - ease(frame, wordsAt, 10);
  // the atoms sit under the floor, then climb past the top of the tube (line 4)
  const rise = smooth(frame, hotterAt + 6, wordsAt - 6);
  const ay = lerp(FLOOR + 110, TOP - 150, rise);
  // the number line (line 5 on): 0 at the left, infinity at the right, then the loop back in at the negative end
  const lineDraw = smooth(frame, wordsAt + 4, jumpsAt);
  const loop = smooth(frame, jumpsAt, jumpsAt + 36);
  const LOOP_LEN = 1500;

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {/* the thermometer */}
      <div style={{ opacity: tubeOn }}>
        <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={TX} y={TOP} width={90} height={FLOOR - TOP + 210} rx={45} fill="rgba(255,255,255,0.06)" stroke={B.paper} strokeWidth={6} />
          <path d={`M${TX + 3} ${FLOOR} H${TX + 87} V${FLOOR + 165} A42 42 0 0 1 ${TX + 3} ${FLOOR + 165} Z`} fill="rgba(255,90,79,0.12)" />
          <line x1={TX - 60} x2={TX + 150} y1={FLOOR} y2={FLOOR} stroke={B.tease} strokeWidth={12} />
        </svg>
        <Note x={TX - 210} y={FLOOR - 64} rows={["0 K"]} size={34} color={B.tease} />
        <Note x={TX - 300} y={TOP} rows={["hotter ↑"]} size={30} opacity={ease(frame, hotterAt, 10)} />
      </div>
      <Atoms cx={TX + 45} cy={ay} opacity={tubeOn} />

      <Card x={40} y={240} big={["BELOW", "ABSOLUTE", "ZERO"]} size={150} bg={B.tease} ink={B.paper} opacity={1 - ease(frame, floorAt, 10)} />
      <Note x={40} y={760} rows={["a gas · 2013"]} size={34} opacity={1 - ease(frame, floorAt, 10)} />

      <Card x={40} y={240} big={["THE FLOOR"]} small={["0 K = −273.15 °C"]} size={130} opacity={span(frame, floorAt, munichAt)} />
      <Card x={40} y={480} big={["NEVER", "REACHED"]} size={110} opacity={span(frame, neverAt, munichAt)} />

      <Card x={40} y={240} big={["−A FEW", "BILLIONTHS", "OF A KELVIN"]} small={["~100,000 atoms · Munich, 2013"]} size={110} opacity={span(frame, munichAt + 4, strangeAt)} />

      <Card x={40} y={240} big={["THE STRANGE", "PART"]} size={120} opacity={span(frame, strangeAt, notColderAt)} />
      <Card x={40} y={240} big={["NOT COLDER", "THAN ZERO"]} size={120} bg={B.paper} ink={B.ink} opacity={span(frame, notColderAt, hotterAt)} />

      <Card x={40} y={500} big={["HOTTER THAN", "ANY POSITIVE", "TEMPERATURE"]} size={104} bg={B.tease} ink={B.paper} opacity={span(frame, hotterAt + 6, wordsAt)} />
      <Note x={40} y={850} rows={["by the standard definition"]} size={30} opacity={span(frame, hotterAt + 6, wordsAt)} />

      {/* the scale as a line */}
      <div style={{ opacity: span(frame, wordsAt, agreeAt) }}>
        <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={90} x2={90 + 710 * lineDraw} y1={760} y2={760} stroke={B.paper} strokeWidth={12} strokeLinecap="round" />
          {/* past infinity: up, over, and back in at the far left, under the zero */}
          <path d="M800 760 C 925 760, 925 560, 800 560 L 120 560 C 0 560, 0 900, 90 900 L 300 900" fill="none" stroke={B.tease} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${LOOP_LEN * loop} ${LOOP_LEN}`} />
          <circle cx={90} cy={760} r={16} fill={B.tease} />
        </svg>
        <Note x={60} y={790} rows={["0 K"]} size={32} color={B.tease} />
        <Note x={720} y={790} rows={["+∞"]} size={40} opacity={ease(frame, wordsAt + 30, 8)} />
        <Note x={200} y={930} rows={["negative"]} size={36} color={B.tease} opacity={ease(frame, jumpsAt + 30, 8)} />
        <Card x={40} y={200} big={["THE SCALE DOESN'T", "END AT INFINITY.", "IT JUMPS TO", "NEGATIVE VALUES."]} size={74} bg={B.paper} ink={B.ink} />
        <Note x={40} y={1030} rows={["as the researchers put it, 2013 · drawn, not to scale"]} size={26} />
      </div>

      <Atoms cx={TX + 45} cy={960 + 20 * Math.sin(frame / 10)} opacity={span(frame, agreeAt, endAt)} />
      <Card x={40} y={380} big={["NOT EVERY", "PHYSICIST", "AGREES"]} size={150} opacity={span(frame, agreeAt, askAt)} />

      <Card x={40} y={300} big={["BELOW ZERO", "BUT HOTTER?", "HOW?"]} size={140} bg={B.tease} ink={B.paper} opacity={span(frame, askAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind="illustration" source="drawn · not to scale" left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF TEMPERATURE" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY LEVEL OF TEMPERATURE" line="the temperature below zero" />
    </AbsoluteFill>
  );
};

export const ShortS40: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
