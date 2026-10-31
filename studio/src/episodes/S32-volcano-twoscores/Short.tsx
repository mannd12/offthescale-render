import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S32 - same mountain, two scores (episodes/S32-volcano-twoscores). For L07 (Level 2, 1:40). Vertical 1080x1920.
 * Opens split: the 2004 dome at night over the 1980 film, a 2 and a 5. Each half then gets its own run; the last line
 * brings the split back with time beside score. Why they differ (squeezed against thrown) is never said.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const Clip: React.FC<{ id: string; seconds: number; x: number; y: number; w: number; h: number; scale?: number; dim?: number }> = ({ id, seconds, x, y, w, h, scale = 1, dim = 0.95 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden" }}>
    <Loop durationInFrames={seconds * 30 - 3}>
      <OffthreadVideo src={staticFile(`assets/${id}.mp4`)} muted style={{ width: w, height: h, objectFit: "cover", transform: `scale(${scale})`, filter: `brightness(${dim})` }} />
    </Loop>
  </div>
);

const Score: React.FC<{ n: number; x: number; y: number; opacity: number; size?: number; bg?: string }> = ({ n, x, y, opacity, size = 240, bg = B.gauge }) => (
  <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center", background: bg, color: B.ink, fontFamily: F.headline, fontSize: size * 0.8, lineHeight: 1, opacity, boxShadow: "0 10px 34px rgba(0,0,0,0.65)" }}>{n}</div>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const nightAt = L(1);
  const domeAt = L(2);
  const tallyAt = L(3);
  const twoAt = cue(t, 3, "On the official");
  const filmAt = L(4);
  const ashAt = L(5);
  const fiveAt = cue(t, 5, "That rates");
  const backAt = L(6);
  const askAt = cue(t, 6, "So what");
  const endAt = cue(t, 6, "That's level two");
  const end = ease(frame, endAt, 12);

  const split = frame < nightAt || frame >= backAt;
  const years = smooth(frame, domeAt + 6, tallyAt - 6);
  const chip = frame < nightAt || frame >= backAt ? { kind: "illustration" as const, source: "scores drawn · photos: USGS" } : frame < domeAt ? { kind: "real" as const, source: "E. Endo, USGS, Nov 2004" } : frame < filmAt ? { kind: "real" as const, source: "USGS time-lapse, 2004-08" } : { kind: "real" as const, source: "16 mm, Don Swanson, USGS, 1980" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {split ? (
        <>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 590, overflow: "hidden" }}>
            <Img src={staticFile("assets/l07-msh-night.jpg")} style={{ width: 1080, height: 590, objectFit: "cover", objectPosition: "60% 45%", filter: `brightness(${frame >= askAt ? 0.45 : 0.95})` }} />
          </div>
          <Clip id="l07-clip-column" seconds={16} x={0} y={596} w={1080} h={584} scale={1.3} dim={frame >= askAt ? 0.45 : 0.95} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 980, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
        </>
      ) : null}
      {frame >= nightAt && frame < domeAt ? <Img src={staticFile("assets/l07-msh-night.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, objectFit: "cover", objectPosition: "62% 40%", transform: `scale(${lerp(1, 1.2, smooth(frame, nightAt, domeAt))})` }} /> : null}
      {frame >= domeAt && frame < filmAt ? <Clip id="l07-clip-dome" seconds={41} x={0} y={190} w={1080} h={640} /> : null}
      {frame >= filmAt && frame < ashAt ? <Clip id="l07-clip-wing" seconds={16} x={0} y={190} w={1080} h={720} scale={1.24} /> : null}
      {frame >= ashAt && frame < backAt ? <Clip id="l07-clip-column" seconds={16} x={0} y={190} w={1080} h={720} scale={1.3} /> : null}

      {/* the opening split: which is which, from frame 0 */}
      <Note x={40} y={170} rows={["real photo · St. Helens, 2004"]} size={28} opacity={frame < nightAt ? 1 : 0} />
      <Note x={40} y={620} rows={["real film · St. Helens, 1980"]} size={28} opacity={frame < nightAt ? 1 : 0} />
      <Score n={2} x={670} y={270} opacity={frame < nightAt ? 1 : 0} />
      <Score n={5} x={670} y={700} opacity={frame < nightAt ? 1 : 0} bg={B.tease} />

      <Card x={40} y={210} big={["ST. HELENS, 2004-2008"]} size={80} opacity={span(frame, nightAt, domeAt)} />
      <Note x={40} y={320} rows={["real photo · the new dome at night"]} size={30} opacity={span(frame, nightAt, domeAt)} />

      <Note x={40} y={214} rows={["real · USGS time-lapse of the dome"]} size={30} opacity={span(frame, domeAt, filmAt)} />
      {/* over three years, dome growth (L07 #20: Oct 2004 to Jan 2008) */}
      <svg width={1080} height={180} style={{ position: "absolute", left: 0, top: 850, opacity: span(frame, domeAt, tallyAt) }}>
        <line x1={70} y1={70} x2={900} y2={70} stroke="rgba(255,255,255,0.28)" strokeWidth={12} />
        <line x1={70} y1={70} x2={70 + 830 * years} y2={70} stroke={B.gauge} strokeWidth={12} />
        <circle cx={70 + 830 * years} cy={70} r={22} fill={B.gauge} />
      </svg>
      <Note x={50} y={950} rows={["over three years of growth"]} size={34} color={B.gauge} opacity={span(frame, domeAt, tallyAt)} />

      <Card x={40} y={860} big={["93 MILLION m³"]} small={["the new dome, by July 2007"]} size={100} opacity={span(frame, tallyAt, filmAt)} />
      <Score n={2} x={700} y={850} size={200} opacity={span(frame, twoAt, filmAt)} />

      <Card x={40} y={930} big={["MAY 18, 1980"]} small={["real film · 16 mm · from a plane"]} size={100} opacity={span(frame, filmAt, ashAt)} />
      <Note x={40} y={214} rows={["same mountain"]} size={34} color={B.gauge} opacity={span(frame, filmAt, ashAt)} />

      <Note x={40} y={214} rows={["real film · St. Helens, 1980"]} size={30} opacity={span(frame, ashAt, backAt)} />
      <Card x={40} y={930} big={["~1 km³ OF ASH"]} small={["over nine hours"]} size={100} opacity={span(frame, ashAt, backAt)} />
      <Score n={5} x={700} y={920} size={200} bg={B.tease} opacity={span(frame, fiveAt, backAt)} />

      {/* time beside score */}
      <Card x={40} y={190} big={["3+ YEARS: 2"]} size={110} opacity={span(frame, backAt, endAt)} />
      <Card x={40} y={640} big={["9 HOURS: 5"]} size={110} bg={B.tease} ink={B.paper} opacity={span(frame, backAt + 14, endAt)} />
      <Card x={40} y={850} big={["WHAT MADE THE DIFFERENCE?"]} size={76} bg={B.paper} ink={B.ink} opacity={span(frame, askAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF VOLCANIC ERUPTION" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY LEVEL OF VOLCANIC ERUPTION" line="level 2: the same mountain" />
    </AbsoluteFill>
  );
};

export const ShortS32: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
