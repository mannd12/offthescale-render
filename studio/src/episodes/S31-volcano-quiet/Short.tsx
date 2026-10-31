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
 * S31 - the quiet one (episodes/S31-volcano-quiet). For L07 (cold open, 0:00). Vertical 1080x1920.
 * Fountains under a big score of 0; a counter climbs to 145 million while a nine-tile score row stays on 0; then Redoubt
 * and two to-scale bars (L07 #13, #21, different measures, and it says so). That lava doesn't count (#8) is never said.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const BAR_W = 800;
const REDOUBT_W = (BAR_W * 20.6) / 145;

const Tiles: React.FC<{ x: number; y: number; lit: number; opacity: number }> = ({ x, y, lit, opacity }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 10, opacity }}>
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
      <div key={n} style={{ width: 86, height: 100, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.headline, fontSize: 60, background: n === lit ? B.gauge : "rgba(5,14,24,0.86)", color: n === lit ? B.ink : B.mute }}>{n}</div>
    ))}
  </div>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const countAt = L(3);
  const zeroAt = L(4);
  const redAt = L(5);
  const askAt = L(6);
  const threeAt = cue(t, 5, "It rated");
  const endAt = cue(t, 6, "The full video");
  const end = ease(frame, endAt, 12);

  const count = Math.round(145 * smooth(frame, countAt + 4, zeroAt - 8));
  const clipZoom = lerp(1, 1.14, smooth(frame, 0, countAt));
  const fill = smooth(frame, redAt + 8, redAt + 44);

  const chip =
    frame < countAt || frame >= askAt
      ? { kind: "real" as const, source: "USGS video, L. Gallant, Nov 2022" }
      : frame < zeroAt
        ? { kind: "real" as const, source: "Civil Air Patrol via USGS, Nov 2022" }
        : frame < redAt
          ? { kind: "illustration" as const, source: "score drawn · photo: Civil Air Patrol" }
          : { kind: "illustration" as const, source: "bars to scale · photo: R. G. McGimsey, AVO" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden" }}>
        {frame < countAt || frame >= askAt ? (
          <Loop durationInFrames={16 * 30 - 3}>
            <OffthreadVideo src={staticFile("assets/l07-clip-fountains.mp4")} muted style={{ width: 1080, height: 1180, objectFit: "cover", transform: `scale(${clipZoom})`, filter: `brightness(${frame >= askAt ? 0.45 : 0.95})` }} />
          </Loop>
        ) : frame < redAt ? (
          <Img src={staticFile("assets/l07-ml-aerial.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "45% 55%", transform: `scale(${lerp(1, 1.16, smooth(frame, countAt, redAt))})`, filter: `brightness(${frame >= zeroAt ? 0.4 : 0.95})` }} />
        ) : (
          <Img src={staticFile("assets/l07-red-mar.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "50% 30%", transform: `scale(${lerp(1, 1.1, smooth(frame, redAt, askAt))})`, filter: "brightness(0.8)" }} />
        )}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>

      <Card x={40} y={210} big={["OFFICIAL SCORE: 0"]} size={104} opacity={span(frame, 0, L(1))} />
      <Note x={40} y={214} rows={["real footage · Mauna Loa, 2022"]} size={32} opacity={span(frame, L(1), L(2))} />
      <Card x={40} y={290} big={["THE LARGEST ACTIVE", "VOLCANO IN THE WORLD"]} size={80} opacity={span(frame, L(1) + 12, L(2))} />
      <Card x={40} y={210} big={["20-25 m"]} small={["lava fountains, one fissure"]} size={130} opacity={span(frame, L(2), countAt)} />

      <Note x={40} y={214} rows={["real photo · Mauna Loa, Nov 2022"]} size={30} opacity={span(frame, countAt, zeroAt)} />
      <Card x={40} y={290} big={[`${count} MILLION m³`]} small={["lava and ash · about two weeks"]} size={100} opacity={span(frame, countAt, zeroAt)} />

      <div style={{ position: "absolute", left: 0, top: 240, width: 1080, textAlign: "center", fontFamily: F.headline, fontSize: 460, lineHeight: 1, color: B.gauge, opacity: span(frame, zeroAt, redAt) }}>0</div>
      <Tiles x={39} y={780} lit={0} opacity={span(frame, zeroAt, redAt)} />
      <Note x={190} y={910} rows={["the official scale · 0 to 8"]} size={32} opacity={span(frame, zeroAt, redAt)} />

      <Note x={40} y={214} rows={["real photo · Redoubt, Alaska, March 2009", "not Mauna Loa"]} size={30} opacity={span(frame, redAt, askAt)} />
      <div style={{ position: "absolute", left: 40, top: 600, width: 880, padding: "22px 20px 26px", boxSizing: "border-box", borderRadius: 18, background: "rgba(5,14,24,0.9)", opacity: span(frame, redAt, askAt), fontFamily: F.ui, fontWeight: 800, color: B.paper, letterSpacing: 1 }}>
        <div style={{ fontSize: 30, whiteSpace: "nowrap" }}>MAUNA LOA · 145 MILLION m³ · SCORE 0</div>
        <div style={{ width: BAR_W * fill, height: 56, margin: "10px 0 24px", borderRadius: 6, background: B.gauge }} />
        <div style={{ fontSize: 30, whiteSpace: "nowrap", opacity: ease(frame, threeAt - 30, 10) }}>REDOUBT · ~20 MILLION m³ · SCORE 3</div>
        <div style={{ width: REDOUBT_W * fill, height: 56, margin: "10px 0 16px", borderRadius: 6, background: B.tease, opacity: ease(frame, threeAt - 30, 10) }} />
        <div style={{ fontSize: 24, color: B.mute, whiteSpace: "nowrap" }}>DIFFERENT MEASURES: LAVA AND ASH · DENSE ROCK</div>
      </div>

      <Card x={40} y={330} big={["WHAT IS THIS SCALE", "ACTUALLY MEASURING?"]} size={94} bg={B.tease} ink={B.paper} opacity={span(frame, askAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF VOLCANIC ERUPTION" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY LEVEL OF VOLCANIC ERUPTION" line="the eruption that scored zero" />
    </AbsoluteFill>
  );
};

export const ShortS31: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
