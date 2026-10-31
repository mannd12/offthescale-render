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
 * S35 - nobody has ever seen one (episodes/S35-volcano-unseen). For L07 (Level 8, 6:16). Vertical 1080x1920.
 * Yellowstone rock (labelled: rock, not an eruption). A struck-out eye on the top tile; a to-scale timeline of the two
 * eruptions up to today; a drawn dial whose needle never settles; three words arriving. No column is ever drawn, and what
 * the rock tells us is left for the long video.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const TL = { x0: 90, x1: 880 };
const YA = (myr: number) => TL.x1 - ((TL.x1 - TL.x0) * myr) / 2.1;

const Eye: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) => (
  <svg width={300} height={190} style={{ position: "absolute", left: x, top: y, opacity }}>
    <path d="M20 95 Q150 -10 280 95 Q150 200 20 95 Z" fill="rgba(5,14,24,0.9)" stroke={B.paper} strokeWidth={10} />
    <circle cx={150} cy={95} r={38} fill={B.paper} />
    <line x1={45} y1={175} x2={255} y2={15} stroke={B.tease} strokeWidth={18} strokeLinecap="round" />
  </svg>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const eightAt = L(1);
  const yellowAt = L(2);
  const againAt = cue(t, 2, "and again");
  const dialAt = L(3);
  const wordsAt = L(4);
  const measAt = cue(t, 4, "It comes");
  const obsAt = cue(t, 4, "observations");
  const judgeAt = cue(t, 4, "and then");
  const askAt = L(5);
  const endAt = cue(t, 5, "That's level eight");
  const end = ease(frame, endAt, 12);

  const fill = smooth(frame, yellowAt + 6, dialAt - 8);
  // never settles: a needle that keeps swinging across the blank dial
  const needle = -55 + 110 * (0.5 + 0.5 * Math.sin(frame / 11));
  const drawn = frame >= yellowAt && frame < askAt;
  const chip = drawn ? { kind: "illustration" as const, source: "drawn · timeline to scale · photo: J. Peaco, NPS" } : frame >= eightAt ? { kind: "illustration" as const, source: "tile drawn · photo: J. Peaco, NPS" } : { kind: "real" as const, source: "J. Peaco, NPS, rock at Yellowstone" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden" }}>
        {frame < yellowAt ? (
          <Img src={staticFile("assets/l07-tuff.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "40% 40%", transform: `scale(${lerp(1, 1.2, smooth(frame, 0, yellowAt))})`, filter: `brightness(${frame >= eightAt ? 0.45 : 0.8})` }} />
        ) : (
          <Img src={staticFile("assets/l07-tuff-cliff.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "60% 50%", transform: `scale(${lerp(1.16, 1, smooth(frame, yellowAt, endAt))})`, filter: "brightness(0.3)" }} />
        )}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>

      <Card x={40} y={280} big={["NOBODY HAS", "EVER SEEN", "THE TOP"]} size={130} opacity={1 - ease(frame, eightAt, 10)} />
      <Note x={40} y={1060} rows={["real photo · rock at Yellowstone · not an eruption"]} size={26} opacity={frame < yellowAt ? 1 : 0} />

      {/* the top tile */}
      <div style={{ opacity: span(frame, eightAt, yellowAt) }}>
        <div style={{ position: "absolute", left: 300, top: 220, width: 340, height: 340, borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center", background: B.tease, color: B.paper, fontFamily: F.headline, fontSize: 280, lineHeight: 1 }}>8</div>
        <Card x={40} y={600} big={["MORE THAN 1,000 km³"]} small={["of ash"]} size={92} />
        <Eye x={320} y={800} opacity={ease(frame, cue(t, 1, "No one"), 10)} />
      </div>

      {/* to scale: 2.1 million years ago up to today */}
      <div style={{ opacity: span(frame, yellowAt, dialAt) }}>
        <Card x={40} y={210} big={["YELLOWSTONE"]} size={120} />
        <svg width={1080} height={260} style={{ position: "absolute", left: 0, top: 560 }}>
          <line x1={TL.x0} y1={100} x2={TL.x1} y2={100} stroke="rgba(255,255,255,0.3)" strokeWidth={10} />
          <line x1={TL.x0} y1={100} x2={TL.x0 + (TL.x1 - TL.x0) * fill} y2={100} stroke={B.gauge} strokeWidth={10} />
          <circle cx={YA(2.1)} cy={100} r={30} fill={B.tease} />
          <circle cx={YA(0.631)} cy={100} r={30} fill={B.tease} opacity={ease(frame, againAt, 8)} />
          <circle cx={TL.x1} cy={100} r={16} fill={B.paper} />
        </svg>
        <Note x={50} y={480} rows={["2.1 million years ago"]} size={32} />
        <Note x={480} y={710} rows={["631,000 years ago"]} size={32} opacity={ease(frame, againAt, 8)} />
        <Note x={770} y={480} rows={["today"]} size={32} />
      </div>

      {/* the dial with no number */}
      <div style={{ opacity: span(frame, dialAt, wordsAt) }}>
        <svg width={760} height={480} viewBox="0 0 760 480" style={{ position: "absolute", left: 100, top: 420 }}>
          <path d="M60 420 A320 320 0 0 1 700 420" fill="rgba(5,14,24,0.86)" stroke={B.paper} strokeWidth={12} />
          <g transform={`rotate(${needle} 380 420)`}>
            <line x1={380} y1={420} x2={380} y2={150} stroke={B.tease} strokeWidth={16} strokeLinecap="round" />
          </g>
          <circle cx={380} cy={420} r={30} fill={B.paper} />
        </svg>
        <Card x={40} y={210} big={["NO INSTRUMENT", "GIVES THE SCORE"]} size={96} />
      </div>

      {/* where the number comes from */}
      <Card x={40} y={330} big={["NOT FROM INSTRUMENTS"]} size={84} bg={B.tease} ink={B.paper} opacity={span(frame, wordsAt, askAt)} />
      <Card x={40} y={500} big={["MEASUREMENTS"]} size={110} opacity={span(frame, measAt, askAt)} />
      <Card x={40} y={680} big={["OBSERVATIONS"]} size={110} opacity={span(frame, obsAt, askAt)} />
      <Card x={40} y={860} big={["A JUDGEMENT"]} size={110} bg={B.paper} ink={B.ink} opacity={span(frame, judgeAt, askAt)} />

      <Card x={40} y={330} big={["NOBODY SAW IT.", "HOW DO WE KNOW", "HOW BIG IT WAS?"]} size={100} bg={B.tease} ink={B.paper} opacity={span(frame, askAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF VOLCANIC ERUPTION" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY LEVEL OF VOLCANIC ERUPTION" line="level 8: the one nobody saw" />
    </AbsoluteFill>
  );
};

export const ShortS35: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
