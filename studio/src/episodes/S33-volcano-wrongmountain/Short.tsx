import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S33 - blamed on the wrong mountain (episodes/S33-volcano-wrongmountain). For L07 (4:12). Vertical 1080x1920.
 * A valley photo, then a drawn column and a stack of km³ cubes, then one drawn mountain whose top falls in and a VENT?
 * pin that sits on it for a 1912-to-1950s line, until it is struck out. L07 #37 is open: no level is ever given for this
 * eruption, on screen or spoken, and the vent's name is held back for the long video.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const CUBE = 88;

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const columnAt = L(1);
  const sixtyAt = cue(t, 1, "and the eruption");
  const cubesAt = L(2);
  const mountainAt = L(3);
  const namedAt = cue(t, 3, "So Katmai");
  const yearsAt = L(4);
  const wrongAt = L(5);
  const askAt = L(6);
  const endAt = cue(t, 6, "The full video");
  const end = ease(frame, endAt, 12);

  const rise = smooth(frame, columnAt + 4, sixtyAt);
  const fall = smooth(frame, mountainAt + 8, mountainAt + 44);
  const yearsFill = smooth(frame, yearsAt + 6, wrongAt - 8);
  const drawn = frame >= columnAt && frame < wrongAt;
  const panelOn = span(frame, columnAt, wrongAt, 10, 8);

  const chip = drawn ? { kind: "illustration" as const, source: "drawn, not a map, not to scale" } : frame >= wrongAt ? { kind: "real" as const, source: "M. Fitz, NPS, 2011" } : { kind: "real" as const, source: "R. McGimsey, USGS, 1991" };

  // the mountain: flanks fixed, the summit's top sinks into a notch
  const peak = lerp(250, 470, fall);
  const lip = lerp(0, 120, fall);
  const mountain = `M60 980 L${500 - 90 - lip} ${peak + 40 * fall} L${500 - 30} ${peak} L${500 + 30} ${peak} L${500 + 90 + lip} ${peak + 40 * fall} L900 980 Z`;

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden" }}>
        {frame < columnAt ? <Img src={staticFile("assets/l07-vtts.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "50% 60%", transform: `scale(${lerp(1, 1.14, smooth(frame, 0, columnAt))})` }} /> : null}
        {frame >= wrongAt ? <Img src={staticFile("assets/l07-novarupta.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "52% 55%", transform: `scale(${lerp(1, 1.14, smooth(frame, wrongAt, endAt))})`, filter: `brightness(${frame >= askAt ? 0.5 : 0.95})` }} /> : null}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>

      <Card x={40} y={220} big={["BLAMED ON THE", "WRONG MOUNTAIN"]} size={110} bg={B.tease} ink={B.paper} opacity={1 - ease(frame, columnAt, 10)} />
      <Note x={40} y={1060} rows={["real photo · Valley of Ten Thousand Smokes, 1991"]} size={26} opacity={frame < columnAt ? 1 : 0} />

      {/* drawn stage */}
      <div style={{ position: "absolute", left: 0, top: 180, width: 1080, height: 1000, opacity: panelOn, background: "linear-gradient(#17324A, #0B1B2B)" }}>
        {/* the column: its top stops at the 30 km mark, an arrow says "more than" */}
        <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 0, opacity: span(frame, columnAt, cubesAt) }}>
          <line x1={110} y1={130} x2={110} y2={900} stroke={B.paper} strokeWidth={6} />
          <line x1={90} y1={130} x2={130} y2={130} stroke={B.paper} strokeWidth={6} />
          <line x1={90} y1={900} x2={130} y2={900} stroke={B.paper} strokeWidth={6} />
          <path d={`M430 900 C410 ${900 - 400 * rise} 380 ${900 - 620 * rise} 330 ${900 - 770 * rise} C440 ${880 - 790 * rise} 620 ${880 - 790 * rise} 730 ${900 - 770 * rise} C680 ${900 - 620 * rise} 650 ${900 - 400 * rise} 630 900 Z`} fill="#7E8791" />
          <path d="M240 960 L530 860 L820 960 Z" fill="#32424F" />
          {rise > 0.97 ? <path d="M530 118 L530 40 M500 70 L530 36 L560 70" stroke={B.gauge} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
        </svg>
        <Note x={40} y={50} rows={["30 km"]} size={34} color={B.gauge} opacity={span(frame, columnAt, cubesAt)} />
        <Card x={600} y={40} big={["30+ km"]} size={92} opacity={span(frame, columnAt + 40, sixtyAt + 2)} />
        <Card x={600} y={40} big={["~60 HOURS"]} size={84} bg={B.tease} ink={B.paper} opacity={span(frame, sixtyAt, cubesAt)} />

        {/* the cubes: 13 solid, 2 outlined (the sources differ, 13 to 15) */}
        <div style={{ opacity: span(frame, cubesAt, mountainAt) }}>
          {Array.from({ length: 15 }, (_, i) => {
            const solid = i < 13;
            const on = ease(frame, cubesAt + 4 + i * 3, 6);
            return <div key={i} style={{ position: "absolute", left: 150 + (i % 5) * (CUBE + 40), top: 320 + Math.floor(i / 5) * (CUBE + 40), width: CUBE, height: CUBE, borderRadius: 10, boxSizing: "border-box", background: solid ? B.gauge : "transparent", border: solid ? "none" : `5px dashed ${B.gauge}`, opacity: on }} />;
          })}
          <Card x={40} y={60} big={["13 TO 15 km³"]} small={["of magma · each square: 1 km³"]} size={110} />
        </div>

        {/* the mountain and the pin */}
        <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 0, opacity: span(frame, mountainAt, wrongAt) }}>
          <path d={mountain} fill="#4A5966" />
        </svg>
        <div style={{ position: "absolute", left: 500 - 240, top: 680, width: 480, textAlign: "center", fontFamily: F.headline, fontSize: 76, color: B.paper, whiteSpace: "nowrap", opacity: span(frame, mountainAt, wrongAt) }}>MOUNT KATMAI</div>
        <div style={{ position: "absolute", left: 500 - 110, top: peak - 130, width: 220, textAlign: "center", opacity: span(frame, namedAt, wrongAt), fontFamily: F.headline, fontSize: 72, color: B.ink, background: B.tease, borderRadius: 14, padding: "2px 0 6px" }}>VENT?</div>
        <Note x={40} y={50} rows={["its summit collapsed"]} size={34} color={B.gauge} opacity={span(frame, mountainAt + 30, yearsAt)} />

        <svg width={1080} height={200} style={{ position: "absolute", left: 0, top: 790, opacity: span(frame, yearsAt, wrongAt) }}>
          <line x1={90} y1={40} x2={880} y2={40} stroke="rgba(255,255,255,0.3)" strokeWidth={10} />
          <line x1={90} y1={40} x2={90 + 790 * yearsFill} y2={40} stroke={B.gauge} strokeWidth={10} />
          <circle cx={90} cy={40} r={18} fill={B.gauge} />
          <circle cx={880} cy={40} r={18} fill={yearsFill > 0.98 ? B.gauge : "rgba(255,255,255,0.3)"} />
        </svg>
        <Note x={50} y={850} rows={["1912"]} size={34} opacity={span(frame, yearsAt, wrongAt)} />
        <Note x={700} y={850} rows={["1953-54"]} size={34} opacity={span(frame, yearsAt + 40, wrongAt)} />
        <Note x={340} y={850} rows={["about 40 years"]} size={34} color={B.gauge} opacity={span(frame, yearsAt + 20, wrongAt)} />
      </div>

      <Note x={40} y={214} rows={["real photo, 2011 · the true 1912 vent", "name in the full video"]} size={30} opacity={span(frame, wrongAt, askAt)} />
      <Card x={40} y={900} big={["NOT KATMAI"]} size={120} bg={B.tease} ink={B.paper} opacity={span(frame, wrongAt, askAt)} />
      <Card x={40} y={330} big={["SO WHERE DID IT", "REALLY COME FROM?"]} size={100} bg={B.tease} ink={B.paper} opacity={span(frame, askAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF VOLCANIC ERUPTION" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY LEVEL OF VOLCANIC ERUPTION" line="the mountain that got the blame" />
    </AbsoluteFill>
  );
};

export const ShortS33: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
