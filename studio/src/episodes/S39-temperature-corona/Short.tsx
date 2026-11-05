import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S39 - the wrong way round (episodes/S39-temperature-corona). For L08 (Level 9, 4:53). Vertical 1080x1920.
 * A real white-light Sun (through a filter); a drawn Sun with the arrow you'd expect (cooler outward);
 * Parker's real WISPR frames; two to-scale bars (5,500 against 2 million: the surface is a sliver); a log thermometer
 * whose top is a question. The Sun's core (#48), fusion machines (#51) and the hottest ever made (#56) are withheld.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const BAR = 840;
// log thermometer: 10^3 at the bottom, 10^9 at the top
const LY = (c: number) => 1060 - ((Math.log10(c) - 3) / 6) * 640;

const Expect: React.FC<{ arrow: number; opacity: number }> = ({ arrow, opacity }) => (
  <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity }}>
    <defs>
      <radialGradient id="s39-glow">
        <stop offset="0%" stopColor="#FFE9A8" />
        <stop offset="45%" stopColor={B.gauge} />
        <stop offset="100%" stopColor={B.gauge} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={300} cy={700} r={260} fill="url(#s39-glow)" />
    <circle cx={300} cy={700} r={150} fill={B.gauge} />
    <line x1={470} y1={700} x2={470 + 400 * arrow} y2={700} stroke={B.aqua} strokeWidth={22} strokeLinecap="round" />
    <path d={`M${470 + 400 * arrow - 50} 650 L${470 + 400 * arrow + 6} 700 L${470 + 400 * arrow - 50} 750`} fill="none" stroke={B.aqua} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.2 ? 1 : 0} />
  </svg>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const surfAt = L(1);
  const fireAt = L(2);
  const expectAt = cue(t, 2, "You'd expect");
  const coronaAt = L(3);
  const twoAt = cue(t, 3, "reaches");
  const barsAt = L(4);
  const whyAt = L(5);
  const askAt = L(6);
  const endAt = cue(t, 6, "The full video");
  const end = ease(frame, endAt, 12);

  const sunOn = frame < fireAt ? 1 - ease(frame, fireAt, 10) : span(frame, whyAt, askAt);
  const clipOn = span(frame, coronaAt - 4, barsAt + 6);
  const grow = smooth(frame, barsAt + 6, barsAt + 46);

  const chip =
    frame < fireAt || (frame >= whyAt && frame < askAt)
      ? { kind: "real" as const, source: "Geoff Elston · CC BY 4.0 · through a solar filter" }
      : frame < coronaAt
        ? { kind: "illustration" as const, source: "drawn" }
        : frame < barsAt
          ? { kind: "real" as const, source: "NASA/Johns Hopkins APL/NRL · WISPR, Dec 2024" }
          : frame < whyAt
            ? { kind: "illustration" as const, source: "bars to scale" }
            : { kind: "illustration" as const, source: "drawn · each mark 10×" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden", opacity: sunOn }}>
        <Img src={staticFile("assets/l08-sun-white.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", transform: `scale(${frame < fireAt ? lerp(1.0, 1.25, smooth(frame, 0, fireAt)) : lerp(1.25, 1.1, smooth(frame, whyAt, askAt))})`, filter: `brightness(${frame < surfAt ? 0.7 : frame < fireAt ? 0.85 : 0.4})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>
      <Note x={40} y={1080} rows={["real photo · the Sun through a solar filter"]} size={28} opacity={sunOn} />

      <Card x={40} y={240} big={["ITS ATMOSPHERE", "IS HOTTER THAN", "ITS SURFACE"]} size={120} opacity={1 - ease(frame, surfAt, 10)} />
      <Card x={40} y={240} big={["~5,500 °C"]} small={["the visible surface"]} size={170} opacity={span(frame, surfAt, fireAt)} />

      <Expect arrow={smooth(frame, expectAt, expectAt + 24)} opacity={span(frame, fireAt, coronaAt)} />
      <Card x={40} y={240} big={["FURTHER AWAY", "= COOLER?"]} size={120} opacity={span(frame, expectAt, coronaAt)} />
      <Note x={40} y={1020} rows={["what you'd expect, drawn"]} size={28} opacity={span(frame, fireAt, coronaAt)} />

      {/* Parker's camera */}
      <div style={{ position: "absolute", left: 0, top: 160, width: 1080, height: 1000, overflow: "hidden", opacity: clipOn }}>
        <Sequence from={coronaAt - 4} layout="none">
          <Loop durationInFrames={20 * 30 - 33} layout="none">
            <OffthreadVideo src={staticFile("assets/l08-clip-wispr.mp4")} startFrom={30} muted style={{ width: 1080, height: 1000, objectFit: "cover", transform: `scale(${lerp(1.6, 1.8, smooth(frame, coronaAt, barsAt))})`, filter: "brightness(1.2)" }} />
          </Loop>
        </Sequence>
      </div>
      <Note x={40} y={1080} rows={["real images · Parker Solar Probe's camera, Dec 2024"]} size={26} opacity={span(frame, coronaAt, barsAt)} />
      <Card x={40} y={200} big={["THE CORONA"]} size={110} opacity={span(frame, coronaAt + 4, twoAt)} />
      <Card x={40} y={200} big={["~2 MILLION °C"]} small={["the corona"]} size={140} bg={B.tease} ink={B.paper} opacity={span(frame, twoAt, barsAt)} />

      {/* to scale */}
      <div style={{ opacity: span(frame, barsAt, whyAt) }}>
        <div style={{ position: "absolute", left: 40, top: 650, fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: B.paper, letterSpacing: 1, whiteSpace: "nowrap" }}>SURFACE · ~5,500 °C</div>
        <div style={{ position: "absolute", left: 40, top: 700, width: Math.max(4, (BAR * 5500) / 2e6), height: 60, background: B.gauge, borderRadius: 2 }} />
        <div style={{ position: "absolute", left: 40, top: 810, fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: B.paper, letterSpacing: 1, whiteSpace: "nowrap" }}>CORONA · ~2,000,000 °C</div>
        <div style={{ position: "absolute", left: 40, top: 860, width: BAR * grow, height: 60, background: B.tease, borderRadius: 6 }} />
        <Card x={40} y={240} big={["MORE THAN", "300× HOTTER"]} small={["further out"]} size={130} />
      </div>

      <Card x={40} y={300} big={["WHY?"]} small={["still one of the big unsolved questions"]} size={220} bg={B.paper} ink={B.ink} opacity={span(frame, whyAt + 4, askAt)} />

      {/* the climb continues */}
      <div style={{ opacity: span(frame, askAt, endAt) }}>
        <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={430} y={LY(1e9)} width={80} height={LY(1e3) - LY(1e9)} rx={40} fill="rgba(255,255,255,0.08)" stroke={B.paper} strokeWidth={6} />
          {[3, 4, 5, 6, 7, 8, 9].map((p) => (
            <line key={p} x1={400} x2={430} y1={LY(10 ** p)} y2={LY(10 ** p)} stroke={B.mute} strokeWidth={4} />
          ))}
          <rect x={444} y={LY(2e6)} width={52} height={LY(1e3) - LY(2e6)} rx={20} fill={B.tease} />
          <rect x={444} y={LY(1e9)} width={52} height={LY(2e6) - LY(1e9) - 10} rx={20} fill={B.paper} opacity={0.25 + 0.25 * Math.abs(Math.sin(frame / 8))} />
        </svg>
        <Note x={540} y={LY(5500) - 24} rows={["surface · ~5,500 °C"]} size={30} />
        <Note x={540} y={LY(2e6) - 24} rows={["corona · ~2 million °C"]} size={30} color={B.tease} />
        <div style={{ position: "absolute", left: 560, top: LY(1e8) - 90, fontFamily: F.headline, fontSize: 140, lineHeight: 1, color: B.paper }}>?</div>
        <Note x={40} y={1090} rows={["drawn · each mark 10×"]} size={26} />
      </div>
      <Card x={40} y={180} big={["WHAT'S HOTTER", "THAN THE CORONA?"]} size={96} bg={B.tease} ink={B.paper} opacity={span(frame, askAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF TEMPERATURE" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY LEVEL OF TEMPERATURE" line="the Sun, the wrong way round" />
    </AbsoluteFill>
  );
};

export const ShortS39: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
