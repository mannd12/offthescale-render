import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, currentLine, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S25 - still air (episodes/S25-sky-air). For L05 (the last edge, 7:22). Vertical 1080x1920.
 * Layout: pictures run full height (y 0-1180) and change with the words: the orbit time-lapse (`l05-clip-orbit`, line 0),
 * the whole ISS with drawn air streaks (`l05-iss`, lines 1-3), the aurora (`l05-aurora`, line 4). From line 2 an altitude
 * bar stands at the left edge, to scale 0-500 km (y 1130 -> 300), marks at 100 km (#27), 415 km (#30), and on line 4 the
 * 80-500 km aurora band (#37); it never runs past 500, the last sourced point. On line 6 its top dissolves into "???".
 * Cut per the brief: "wouldn't feel hot" and the 2,000 degrees. Never said or shown: the answer's number, the Moon.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const BAR = { x: 60, w: 70, top: 300, bot: 1130, max: 500 };
const yOf = (km: number) => BAR.bot - (km / BAR.max) * (BAR.bot - BAR.top);
const STREAKS = Array.from({ length: 18 }, (_, i) => ({ y: 60 + ((i * 137) % 640), speed: 14 + ((i * 7) % 11), len: 90 + ((i * 53) % 150), off: (i * 211) % 1400 }));

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const yearsAt = cue(t, 0, "In about");
  const airAt = cue(t, 1, "Air.");
  const kmAt = cue(t, 2, "Four hundred");
  const dragAt = cue(t, 2, "drag");
  const edgeAt = cue(t, 3, "famous edge");
  const lightsAt = cue(t, 4, "northern lights");
  const notAt = cue(t, 5, "isn't where");
  const whereAt = cue(t, 6, "where does");
  const endAt = cue(t, 6, "the full video");
  const end = ease(frame, endAt, 12);

  const clip = 1 - ease(frame, L(1) - 6, 12);
  const iss = ease(frame, L(1) - 6, 12) * (1 - ease(frame, L(4) - 6, 12));
  const aurora = ease(frame, L(4) - 6, 12) * (1 - ease(frame, L(5) - 4, 12));
  const air = ease(frame, airAt, 10) * (1 - ease(frame, L(4) - 6, 10));
  const bar = ease(frame, kmAt, 12);
  const dot = smooth(frame, kmAt, kmAt + 26);
  const band = ease(frame, lightsAt + 6, 12) * (1 - ease(frame, notAt, 10));
  const ask = ease(frame, whereAt, 12);

  const chip =
    cur === 0
      ? { kind: "real" as const, source: "NASA Earth Observatory · photo time-lapse" }
      : cur < 4
        ? { kind: "illustration" as const, source: "air and bar drawn · photo: NASA, 2011" }
        : cur === 4
          ? { kind: "illustration" as const, source: "bar drawn · photo: NASA, ISS 2024" }
          : { kind: "illustration" as const, source: "bar drawn to scale" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden", opacity: 1 - end }}>
        {clip > 0 ? (
          <div style={{ position: "absolute", inset: 0, opacity: clip }}>
            <Loop durationInFrames={1197}>
              <OffthreadVideo src={staticFile("assets/l05-clip-orbit.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Loop>
          </div>
        ) : null}
        {iss > 0 ? <Img src={staticFile("assets/l05-iss.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: iss, transform: `scale(${1.02 + 0.1 * smooth(frame, L(1), L(4))})`, filter: "brightness(0.8)" }} /> : null}
        {aurora > 0 ? <Img src={staticFile("assets/l05-aurora.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: aurora, transform: `scale(${1.02 + 0.08 * smooth(frame, L(4), L(5))})` }} /> : null}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>

      <Note x={40} y={214} rows={[cur === 0 ? "real · space station photos as a time-lapse" : cur < 4 ? "real photo · the station · air streaks are drawn" : cur === 4 ? "real photo · aurora from the station, 2024" : ""]} opacity={(1 - end) * (cur <= 4 ? 1 : 0)} size={22} />

      {/* the air, drawn: thin streaks running past the station */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: air * 0.75 }}>
        {STREAKS.map((s, i) => {
          const x = 1300 - ((frame * s.speed + s.off) % 1700);
          return <line key={i} x1={x} y1={280 + s.y} x2={x + s.len} y2={280 + s.y} stroke={B.paper} strokeWidth={5} strokeLinecap="round" opacity={0.85} />;
        })}
      </svg>

      <Card x={200} y={300} big={["1 TO 2 YEARS"]} small={["without reboosts"]} size={110} opacity={span(frame, yearsAt, L(1))} />
      <Card x={420} y={300} big={["AIR."]} size={170} opacity={span(frame, airAt, kmAt)} bg={B.paper} />
      <Card x={300} y={300} big={["415 KM UP"]} small={["and still drag"]} size={110} opacity={span(frame, dragAt - 12, edgeAt)} />
      <Card x={300} y={300} big={["315 KM PAST", "THE 100 KM LINE"]} size={84} opacity={span(frame, edgeAt, L(4))} />
      <Card x={300} y={300} big={["UP TO 500 KM"]} small={["the northern lights"]} size={100} opacity={span(frame, lightsAt + 6, L(5))} />
      <Card x={200} y={520} big={["NOT WHERE THE", "AIR RUNS OUT"]} size={92} opacity={span(frame, notAt, L(6))} bg={B.tease} ink={B.paper} />

      {/* the bar, to scale */}
      <div style={{ opacity: bar * (1 - end) }}>
        <div style={{ position: "absolute", left: BAR.x, top: BAR.top, width: BAR.w, height: BAR.bot - BAR.top, borderRadius: 12, background: `linear-gradient(0deg, #2E7FC0, rgba(46,127,192,${lerp(0.15, 0.05, ask)}))`, border: "2px solid rgba(255,255,255,0.4)", boxSizing: "border-box" }} />
        <div style={{ position: "absolute", left: BAR.x, top: yOf(500), width: BAR.w, height: yOf(80) - yOf(500), background: "linear-gradient(0deg, #3CE08C, #E0405A)", opacity: 0.75 * band }} />
        {/* 100 km */}
        <div style={{ position: "absolute", left: BAR.x - 8, top: yOf(100) - 3, width: BAR.w + 40, height: 6, background: B.gauge }} />
        <div style={{ position: "absolute", left: BAR.x + BAR.w + 40, top: yOf(100) - 20, fontFamily: F.ui, fontWeight: 800, fontSize: 28, color: B.gauge, textShadow: "0 2px 10px #000", whiteSpace: "nowrap" }}>100 KM</div>
        {/* the station */}
        <div style={{ position: "absolute", left: BAR.x + BAR.w / 2 - 15, top: lerp(yOf(0), yOf(415), dot) - 15, width: 30, height: 30, borderRadius: 15, background: B.paper, boxShadow: "0 0 18px rgba(255,255,255,0.9)" }} />
        <div style={{ position: "absolute", left: BAR.x + BAR.w + 40, top: yOf(415) - 20, fontFamily: F.ui, fontWeight: 800, fontSize: 28, color: B.paper, textShadow: "0 2px 10px #000", opacity: dot, whiteSpace: "nowrap" }}>415 KM</div>
        <div style={{ position: "absolute", left: BAR.x, top: BAR.top - 76, fontFamily: F.headline, fontSize: 64, color: B.tease, opacity: ask * (0.6 + 0.4 * Math.abs(Math.sin(frame / 7))) }}>???</div>
      </div>

      <Card x={200} y={520} big={["WHERE DOES THE", "SKY ACTUALLY STOP?"]} size={88} opacity={span(frame, whereAt, endAt)} bg={B.tease} ink={B.paper} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF THE SKY" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 8 · still air"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF THE SKY" line="the last edge" />
    </AbsoluteFill>
  );
};

export const ShortS25: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
