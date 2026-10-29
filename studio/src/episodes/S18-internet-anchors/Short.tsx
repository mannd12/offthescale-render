import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, PlateFade, SeriesPill, ShortFrame, cue, currentLine, lin, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S18 - not sharks (episodes/S18-internet-anchors). A cliffhanger for L04 (Every Level of the Internet), answered by
 * Level 7 (the cable, 7:11). Vertical 1080x1920. Plate: the NOAA sea-floor still (`swimming-cucumber`, public domain,
 * Puerto Rico 2015) fills y 0-1,180, darkened; a drawn cable lies across it at y ~885. Cards sit top-left (x 120-760,
 * y 240-600); labels under the cable (y ~960). Chip y ~1,170-1,216, captions y 1,290-1,590 (shortKit). Nothing
 * important past x = 930, nothing in the bottom 300 px.
 * Lines: 0 what breaks the cables? a drawn shark, struck out · 1 zero fish-bite faults 2007-2014 · 2 150-200 faults a
 * year (sparks along the cable) · 3 70-80 %: fishing gear and ships' anchors, dragged across it · 4 a garden hose, on
 * the floor · 5 it breaks - how do you fix it? · 6 a hook, teased (only its tip, no ship, no method) -> end card.
 * Sources: L04 #22 (zero fish-bite faults 2007-2014), #23 (150-200 faults a year; 70-80 % fishing and anchors), #10
 * (garden hose; laid on the floor in the deep). No depth figure (L04 #9 is unsupported). The repair (#24) is not shown.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const PLATE_H = 1180;
const cableY = (x: number) => 885 + 12 * Math.sin(x / 140);
const cablePath = (x0: number, x1: number) => {
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += 20) pts.push(`${pts.length ? "L" : "M"} ${x} ${cableY(x).toFixed(1)}`);
  return pts.join(" ");
};
const BREAK_X = 540;
const SPARK_X = [180, 330, 470, 610, 760, 880];

const Shark: React.FC<{ x: number; y: number; s: number; opacity: number }> = ({ x, y, s, opacity }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    {/* a plain side-on silhouette, drawn */}
    <path d="M -180 0 C -120 -46 40 -60 140 -18 L 190 -64 L 178 -6 L 200 40 L 140 14 C 40 52 -120 44 -180 0 Z M -10 -48 L 30 -110 L 50 -46 Z M 20 30 L 0 70 L 52 26 Z" fill="#6E8396" />
    <circle cx={-128} cy={-8} r={6} fill="#0B1B2B" />
  </g>
);

const Anchor: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M 0 -70 V 30 M -26 -48 H 26 M -46 6 C -40 40 -18 50 0 50 C 18 50 40 40 46 6" stroke="#C9CED6" strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d="M -54 0 L -46 6 L -40 -6 M 54 0 L 46 6 L 40 -6" stroke="#C9CED6" strokeWidth={8} fill="none" strokeLinecap="round" />
    <circle cy={-82} r={12} fill="none" stroke="#C9CED6" strokeWidth={7} />
  </g>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const notAt = cue(t, 0, "It isn't sharks");
  const zeroAt = cue(t, 1, "exactly zero");
  const yearsAt = cue(t, 1, "Between 2007");
  const countAt = cue(t, 2, "a hundred and fifty");
  const pctAt = cue(t, 3, "Seventy to eighty percent");
  const gearAt = cue(t, 3, "fishing gear");
  const anchorAt = cue(t, 3, "ships' anchors");
  const dragAt = cue(t, 3, "dragged across");
  const deepAt = cue(t, 4, "Out in the deep");
  const hoseAt = cue(t, 4, "garden hose");
  const floorAt = cue(t, 4, "lying on the sea floor");
  const breaksAt = cue(t, 5, "when one breaks");
  const fixAt = cue(t, 5, "how do you fix it");
  const hookAt = cue(t, 6, "a hook");
  const endAt = cue(t, 6, "It's level seven");
  const end = ease(frame, endAt, 12);

  // the plate: a slow drift, a push in for the hose line
  const push = 1.06 + 0.05 * lin(frame, 0, L(4)) + 0.08 * smooth(frame, deepAt, floorAt);
  // the cable draws across from the first frame
  const cableDraw = smooth(frame, 0, 30);
  // the break on line 5: the two ends pull apart
  const gap = 26 * smooth(frame, breaksAt, breaksAt + 14);
  // line 3: the anchor comes down on its chain, then drags along the cable (right -> left); the net trails on the left
  const drop = smooth(frame, anchorAt, anchorAt + 24);
  const drag = smooth(frame, dragAt, L(4));
  const ax = lerp(840, 640, drag);
  const ay = lerp(380, cableY(ax) - 40, drop);
  const gearOn = span(frame, gearAt, L(4));
  const netX = lerp(140, 300, lin(frame, gearAt, L(4)));
  // line 2: faults spark along the cable, one after another, again and again
  const sparkOn = span(frame, countAt, pctAt);
  // line 6: the hook - only its tip comes into the top of the frame (the method is L04's answer)
  const hookY = lerp(-260, -40, smooth(frame, hookAt, hookAt + 30));

  const chip = cur <= 3 ? "drawn over a NOAA photo of the sea floor (Puerto Rico, 2015)" : "not to scale · NOAA sea-floor photo, 2015";

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PLATE_H, overflow: "hidden" }}>
        <Img src={staticFile("assets/swimming-cucumber.png")} style={{ width: 1080, height: PLATE_H, objectFit: "cover", transform: `scale(${push})`, transformOrigin: "50% 70%", filter: "brightness(0.55) saturate(0.85)" }} />
      </div>
      <PlateFade plateH={PLATE_H} />

      <svg width={1080} height={PLATE_H} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - end }}>
        {/* line 0-1: the shark that did not do it */}
        <Shark x={540} y={430} s={1.1} opacity={span(frame, 6, L(1) + 18)} />
        <line x1={330} y1={470} x2={760} y2={370} stroke={B.tease} strokeWidth={16} strokeLinecap="round" strokeDasharray="600" strokeDashoffset={600 * (1 - smooth(frame, notAt, notAt + 10))} opacity={span(frame, notAt, L(1) + 18)} />

        {/* the cable, drawn; it parts at BREAK_X on line 5 */}
        <g opacity={cableDraw}>
          <path d={cablePath(-20, BREAK_X)} transform={`translate(${-gap} 0)`} stroke="#1B1F24" strokeWidth={22} fill="none" strokeLinecap="round" />
          <path d={cablePath(BREAK_X, 1100)} transform={`translate(${gap} 0)`} stroke="#1B1F24" strokeWidth={22} fill="none" strokeLinecap="round" />
          <path d={cablePath(-20, BREAK_X)} transform={`translate(${-gap} 0)`} stroke={B.gauge} strokeWidth={4 + 6 * span(frame, deepAt, breaksAt)} fill="none" opacity={0.75} />
          <path d={cablePath(BREAK_X, 1100)} transform={`translate(${gap} 0)`} stroke={B.gauge} strokeWidth={4 + 6 * span(frame, deepAt, breaksAt)} fill="none" opacity={0.75} />
        </g>
        {/* the break's spark */}
        <circle cx={BREAK_X} cy={cableY(BREAK_X)} r={18 + 10 * Math.abs(Math.sin(frame / 3))} fill={B.tease} opacity={0.8 * span(frame, breaksAt, endAt)} />

        {/* line 2: faults flash along the cable */}
        {SPARK_X.map((x, i) => {
          const ph = (frame - countAt - i * 9) % 54;
          const on = frame >= countAt + i * 9 && ph >= 0 && ph < 14 ? 1 - ph / 14 : 0;
          return <circle key={x} cx={x} cy={cableY(x)} r={14 + 22 * (1 - on)} fill="none" stroke={B.tease} strokeWidth={6} opacity={on * sparkOn} />;
        })}

        {/* line 3: fishing gear (a drawn net) trailing over the cable, and an anchor on its chain */}
        <g opacity={gearOn}>
          <path d={`M ${netX - 140} ${cableY(netX) - 120} L ${netX} ${cableY(netX) - 8} L ${netX - 150} ${cableY(netX) + 10} Z`} fill="rgba(201,206,214,0.18)" stroke="#C9CED6" strokeWidth={3} strokeDasharray="8 8" />
          <line x1={netX - 140} y1={cableY(netX) - 120} x2={netX - 60} y2={0} stroke="#C9CED6" strokeWidth={3} />
        </g>
        <g opacity={span(frame, anchorAt, L(4))}>
          <line x1={940} y1={0} x2={ax} y2={ay - 82} stroke="#C9CED6" strokeWidth={5} strokeDasharray="14 6" />
          <Anchor x={ax} y={ay} />
        </g>

        {/* line 4: the hose, in cross-section (not to scale) */}
        <g transform="translate(250 470)" opacity={span(frame, hoseAt, breaksAt)}>
          <circle r={96} fill="#14181D" stroke={B.gauge} strokeWidth={6} />
          <circle r={60} fill="#20262E" stroke="#5A6470" strokeWidth={4} />
          {Array.from({ length: 6 }, (_, i) => (
            <circle key={i} cx={22 * Math.cos((i * Math.PI) / 3)} cy={22 * Math.sin((i * Math.PI) / 3)} r={4} fill={B.aqua} />
          ))}
        </g>

        {/* line 6: the tip of a hook, coming down from above - the rest is the long video's */}
        <g transform={`translate(800 ${hookY})`} opacity={span(frame, hookAt, endAt)}>
          <line x1={0} y1={-400} x2={0} y2={180} stroke="#C9CED6" strokeWidth={8} />
          <path d="M 0 180 C 0 250 -70 260 -80 200" stroke="#C9CED6" strokeWidth={14} fill="none" strokeLinecap="round" />
        </g>
      </svg>

      {/* cards, top-left */}
      <Card x={120} y={250} big={["0"]} small={["fish-bite faults · 2007–2014"]} size={210} opacity={span(frame, zeroAt, L(2))} />
      <Note x={120} y={250} rows={["2007–2014"]} opacity={span(frame, yearsAt, zeroAt)} color={B.gauge} size={34} />
      <Card x={120} y={250} big={["150–200"]} small={["faults a year · worldwide"]} size={170} opacity={span(frame, countAt, L(3))} />
      <Card x={120} y={250} big={["70–80%"]} small={["fishing gear + ships' anchors"]} size={150} bg={B.tease} ink={B.paper} opacity={span(frame, pctAt, L(4))} />
      {/* 70-80 % as a bar of ten: seven full, the eighth half (the range) */}
      <div style={{ position: "absolute", left: 120, top: 530, display: "flex", gap: 8, opacity: span(frame, pctAt + 8, L(4)) }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{ width: 50, height: 40, borderRadius: 6, background: i < 7 ? B.tease : i === 7 ? `repeating-linear-gradient(45deg, ${B.tease} 0 8px, rgba(255,90,79,0.25) 8px 16px)` : "rgba(255,255,255,0.16)" }} />
        ))}
      </div>
      <Note x={120} y={960} rows={["fishing gear"]} opacity={span(frame, gearAt, L(4))} />
      <Note x={600} y={960} rows={["ships' anchors"]} opacity={span(frame, anchorAt, L(4))} />
      <Note x={120} y={600} rows={["dragged across · by accident"]} opacity={span(frame, dragAt, L(4))} color={B.gauge} />

      <Note x={390} y={410} rows={["about as thick as", "a garden hose"]} opacity={span(frame, hoseAt, breaksAt)} color={B.gauge} size={32} />
      <Note x={120} y={960} rows={["laid on the sea floor"]} opacity={span(frame, floorAt, breaksAt)} />
      <Note x={120} y={250} rows={["out in the deep"]} opacity={span(frame, deepAt, breaksAt)} size={30} />

      <Card x={120} y={300} big={["HOW DO YOU", "FIX IT?"]} size={120} opacity={span(frame, fixAt, hookAt)} />
      <Note x={120} y={560} rows={["answer: a hook · level 7"]} opacity={span(frame, hookAt + 6, endAt)} color={B.gauge} size={30} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind="illustration" source={chip} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF THE INTERNET" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 7 · the cable"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF THE INTERNET" line="level 7: the cable" />
    </AbsoluteFill>
  );
};

export const ShortS18: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
