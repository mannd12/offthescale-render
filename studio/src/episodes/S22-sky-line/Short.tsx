import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline } from "../../lib/timeline";
import { ease } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S22 - the round number (episodes/S22-sky-line). For L05 (level 7, 4:07). Vertical 1080x1920.
 * Layout: a to-scale altitude ruler up the left edge (70-110 km, y 1130 -> 240); the 100 km and 80 km lines run from it
 * across the frame, and the X-15 photo sits in the window between them, so the plane is literally in the disputed gap.
 * The awkward figure's value is not in L05 #27, so it is a "?" tag with no position, snapping to the 100 line.
 * The pilot marker stops at 95 km (#28). The five pilots are neither named nor counted: that is the answer. Nothing
 * says what FAI's rule is today (#28b).
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const R = { x: 60, w: 90, top: 240, bot: 1130, lo: 70, hi: 110 };
const yOf = (km: number) => R.bot - ((km - R.lo) / (R.hi - R.lo)) * (R.bot - R.top);
const Y100 = yOf(100);
const Y80 = yOf(80);
const Y95 = yOf(95);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();

  const roundAt = cue(t, 1, "round number");
  const awkAt = cue(t, 2, "awkward");
  const quoteAt = cue(t, 3, "the very round");
  const paperAt = cue(t, 4, "a paper");
  const closeAt = cue(t, 4, "close to eighty");
  const usAt = cue(t, 5, "The United States");
  const pilotAt = cue(t, 6, "an X-15 pilot");
  const reachAt = cue(t, 6, "ninety-five");
  const overAt = cue(t, 6, "Over one line");
  const whichAt = cue(t, 7, "So which");
  const endAt = cue(t, 7, "the full video");
  const end = ease(frame, endAt, 12);

  const line100 = smooth(frame, 2, 20);
  const line80 = smooth(frame, closeAt - 8, closeAt + 12);
  const gapGlow = ease(frame, overAt, 10) * (0.6 + 0.4 * Math.abs(Math.sin(frame / 9)));
  const climb = smooth(frame, pilotAt, reachAt + 14);
  const markerY = yOf(70) + (Y95 - yOf(70)) * climb;
  // the tag's "?" settles to 100 on the word "close"
  const snap = smooth(frame, awkAt + 12, awkAt + 30);
  const ticks = [70, 80, 90, 100, 110];

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {/* the X-15 window between the two lines */}
      <div style={{ position: "absolute", left: R.x + R.w, top: Y100, width: 1080 - R.x - R.w, height: Y80 - Y100, overflow: "hidden", opacity: 1 - end }}>
        <Img src={staticFile("assets/l05-x15.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.1 * smooth(frame, 0, whichAt)})`, filter: `brightness(${0.95 - 0.35 * ease(frame, whichAt, 10)})` }} />
        <div style={{ position: "absolute", inset: 0, background: `rgba(255,90,79,${0.18 * gapGlow})` }} />
      </div>
      <Note x={R.x + R.w + 50} y={Y80 - 56} rows={["real photo · an x-15, not the 1962 flight"]} opacity={1 - end} size={20} />

      {/* the ruler */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - end }}>
        <rect x={R.x} y={R.top} width={R.w} height={R.bot - R.top} rx={12} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
        {ticks.map((k) => (
          <g key={k}>
            <line x1={R.x} y1={yOf(k)} x2={R.x + 18} y2={yOf(k)} stroke={B.mute} strokeWidth={3} />
            <text x={R.x + 26} y={yOf(k) + (k === 110 ? 26 : k === 70 ? -8 : k === 90 ? 10 : 36)} fill={B.paper} fontFamily={F.ui} fontWeight={800} fontSize={28}>{k}</text>
          </g>
        ))}
        {/* the 100 line and the 80 line */}
        <line x1={R.x} y1={Y100} x2={R.x + 870 * line100} y2={Y100} stroke={B.gauge} strokeWidth={8} strokeLinecap="round" />
        <line x1={R.x} y1={Y80} x2={R.x + 870 * line80} y2={Y80} stroke={B.tease} strokeWidth={8} strokeLinecap="round" />
        {/* the pilot marker */}
        <g opacity={span(frame, pilotAt, endAt)}>
          <line x1={R.x + R.w + 26} y1={yOf(70)} x2={R.x + R.w + 26} y2={markerY} stroke={B.paper} strokeWidth={5} strokeDasharray="10 8" />
          <circle cx={R.x + R.w + 26} cy={markerY} r={15} fill={B.paper} />
        </g>
      </svg>
      <Note x={R.x + R.w + 14} y={R.bot - 30} rows={["km · ruler to scale"]} opacity={(1 - end) * (1 - ease(frame, pilotAt, 8))} color={B.mute} size={20} />

      {/* above the 100 line */}
      <Card x={R.x + R.w + 24} y={236} big={["100 KM"]} small={["the edge of space"]} size={120} opacity={span(frame, 6, quoteAt)} />
      <Note x={R.x + R.w + 420} y={260} rows={["a round", "number"]} opacity={span(frame, roundAt, awkAt)} color={B.tease} size={38} />
      <Note x={R.x + R.w + 420} y={260} rows={[snap < 0.5 ? "awkward figure" : "close to 100"]} opacity={span(frame, awkAt, quoteAt)} color={B.aqua} size={30} />
      <div style={{ position: "absolute", left: R.x + R.w + 24, top: 236, width: 700, opacity: span(frame, quoteAt, paperAt), padding: "14px 24px", boxSizing: "border-box", borderRadius: 18, background: B.paper, color: B.ink }}>
        <div style={{ fontFamily: F.caption, fontWeight: 600, fontSize: 50, lineHeight: 1.08 }}>"the very round number of 100 Km"</div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 22, letterSpacing: 1, marginTop: 8 }}>FAI'S OWN ACCOUNT · LAST UPDATED 2004</div>
      </div>
      <Note x={R.x + R.w + 24} y={Y100 - 58} rows={["100 km"]} opacity={ease(frame, paperAt, 8) * (1 - end)} color={B.gauge} size={30} />

      {/* below the 80 line */}
      <Card x={R.x + R.w + 60} y={Y80 + 18} big={["80 KM"]} small={["McDowell, 2018"]} size={80} opacity={span(frame, closeAt, usAt)} bg={B.tease} ink={B.paper} />
      <Note x={R.x + R.w + 60} y={Y80 + 24} rows={["80 km"]} opacity={ease(frame, usAt, 6) * (1 - end)} color={B.tease} size={30} />
      <Note x={R.x + R.w + 60} y={Y80 + 84} rows={["McDowell 2018", "US astronaut wings: above 50 miles"]} opacity={span(frame, usAt, pilotAt)} size={24} />
      <Card x={R.x + R.w + 60} y={Y80 + 70} big={["95 KM · 1962"]} size={70} opacity={span(frame, reachAt, whichAt)} bg={B.paper} />
      <Note x={R.x + R.w + 24} y={Y100 + 16} rows={["an astronaut?"]} opacity={span(frame, overAt, whichAt)} color={B.paper} size={30} />

      <Card x={R.x + R.w + 24} y={236} big={["WHICH PILOTS", "WENT TO SPACE?"]} size={84} opacity={span(frame, whichAt, endAt)} bg={B.tease} ink={B.paper} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind="illustration" source="ruler drawn · photo: NASA, X-15" left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF THE SKY" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 7 · where space begins"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF THE SKY" line="level 7: where space begins" />
    </AbsoluteFill>
  );
};

export const ShortS22: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
