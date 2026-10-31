import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, lin, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S24 - the clocks that run fast (episodes/S24-sky-gps). For L05 (level 9, 5:59). Vertical 1080x1920.
 * Layout: the Navstar painting (`l05-gps-art`, US Air Force artwork, said on the picture from frame 0: there is no usable
 * real photo, L05 assets.md) is the top band (y 0-620). Below it in y 660-1150, in turn: two counters (a day runs by,
 * time-lapsed, and the orbit clock ends +38.6 µs ahead: L05 #39, 4.4647e-10 x 86,400 s); one-day strip (38.6 µs of a day
 * is about 3.5e-7 of a pixel on an 800 px strip, so nothing can be drawn: arithmetic); a drawn pin drifting away from
 * its true place (no km figure: the wording stays #39's "kilometres of distance"; not a map); the "set down" dial.
 * The reasons (gravity, speed) and the height are never shown: they are the answer.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const PLATE_H = 620;
const DAY_S = 86400;
const hhmm = (s: number) => `${String(Math.floor(s / 3600) % 24).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}`;

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const secAt = cue(t, 1, "millionths");
  const dayAt = cue(t, 1, "every single day");
  const nothingAt = cue(t, 2, "nothing");
  const leftAt = cue(t, 3, "left uncorrected");
  const kmAt = cue(t, 3, "kilometres");
  const setAt = cue(t, 4, "set down");
  const whyAt = cue(t, 5, "why would");
  const highAt = cue(t, 5, "how high");
  const endAt = cue(t, 5, "the full video");
  const end = ease(frame, endAt, 12);

  // the day runs from line 0's start to "every single day"; the lead builds with it
  const dayFrac = lin(frame, 6, dayAt + 8);
  const counters = span(frame, 2, L(2));
  const lead = 38.6 * dayFrac;
  const strip = span(frame, L(2), leftAt);
  const drift = smooth(frame, leftAt, kmAt + 24);
  const pinBoard = span(frame, leftAt, L(4));
  const dial = span(frame, L(4), whyAt);
  const dialDown = smooth(frame, setAt, setAt + 20);

  const px = lerp(250, 760, drift);
  const py = lerp(960, 840, drift);

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PLATE_H, overflow: "hidden", opacity: 1 - end }}>
        <Img src={staticFile("assets/l05-gps-art.jpg")} style={{ width: 1080, height: PLATE_H, objectFit: "cover", objectPosition: "46% 42%", transform: `scale(${1.03 + 0.12 * smooth(frame, 0, whyAt)})`, transformOrigin: "46% 42%", filter: `brightness(${lerp(0.95, 0.45, ease(frame, whyAt, 12))})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>
      <Note x={40} y={214} rows={["a painting of a gps satellite · not a photo"]} opacity={1 - end} size={22} />

      {/* the counters */}
      <div style={{ opacity: counters }}>
        {[
          { y: 670, label: "a clock on the ground", color: B.paper, extra: "" },
          { y: 850, label: "a clock on a gps satellite", color: B.gauge, extra: lead > 0.05 ? `+${lead.toFixed(1)} µs` : "" },
        ].map((c) => (
          <div key={c.y} style={{ position: "absolute", left: 80, top: c.y, width: 840 }}>
            <Note x={-10} y={0} rows={[c.label]} size={24} color={c.color} />
            <div style={{ position: "absolute", left: 0, top: 56, fontFamily: F.headline, fontSize: 96, lineHeight: 1, color: c.color, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{hhmm(DAY_S * Math.min(dayFrac, 0.99999))}</div>
            <div style={{ position: "absolute", left: 300, top: 56, fontFamily: F.headline, fontSize: 96, lineHeight: 1, color: B.tease, whiteSpace: "nowrap" }}>{c.extra}</div>
          </div>
        ))}
        <Note x={70} y={1040} rows={["one day · not real time"]} color={B.mute} size={20} opacity={ease(frame, 6, 8)} />
        <Note x={70} y={1086} rows={["38.6 µs a day, net"]} color={B.gauge} size={26} opacity={ease(frame, secAt, 8)} />
      </div>

      {/* one day as a strip */}
      <div style={{ opacity: strip }}>
        <Note x={80} y={740} rows={["this strip is one whole day"]} size={26} />
        <div style={{ position: "absolute", left: 90, top: 800, width: 800, height: 90, borderRadius: 12, background: "rgba(255,255,255,0.16)", border: `3px solid ${B.mute}`, boxSizing: "border-box" }} />
        <Note x={80} y={920} rows={["38.6 µs on it: far thinner", "than one pixel"]} color={B.gauge} size={30} opacity={ease(frame, nothingAt - 4, 8)} />
      </div>

      {/* the drifting pin */}
      <div style={{ opacity: pinBoard }}>
        <svg width={1080} height={1160} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 9 }, (_, i) => <line key={`v${i}`} x1={90 + i * 100} y1={700} x2={90 + i * 100} y2={1100} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />)}
          {Array.from({ length: 5 }, (_, i) => <line key={`h${i}`} x1={90} y1={700 + i * 100} x2={890} y2={700 + i * 100} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />)}
          <circle cx={250} cy={960} r={14} fill={B.paper} />
          <line x1={250} y1={960} x2={px} y2={py} stroke={B.tease} strokeWidth={6} strokeDasharray="12 10" />
          <g transform={`translate(${px} ${py})`}>
            <path d="M 0 0 C -30 -40 -30 -76 0 -76 C 30 -76 30 -40 0 0 Z" fill={B.tease} />
            <circle cx={0} cy={-50} r={11} fill={B.paper} />
          </g>
        </svg>
        <Note x={150} y={990} rows={["where you are"]} size={24} />
        <Note x={500} y={1050} rows={["drawn · not a map"]} color={B.mute} size={20} />
      </div>
      <Card x={200} y={680} big={["KILOMETRES OFF"]} small={["in a single day"]} size={72} opacity={span(frame, kmAt, L(4))} bg={B.paper} />

      {/* set down before launch: an older satellite's clock, drawn */}
      <svg width={1080} height={1160} style={{ position: "absolute", left: 0, top: 0, opacity: dial }}>
        <circle cx={250} cy={900} r={150} fill="rgba(255,255,255,0.07)" stroke={B.paper} strokeWidth={6} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          return <line key={i} x1={250 + 128 * Math.sin(a)} y1={900 - 128 * Math.cos(a)} x2={250 + 142 * Math.sin(a)} y2={900 - 142 * Math.cos(a)} stroke={B.mute} strokeWidth={4} />;
        })}
        <line x1={250} y1={900} x2={250 + 110 * Math.sin(lerp(0.5, -0.2, dialDown))} y2={900 - 110 * Math.cos(lerp(0.5, -0.2, dialDown))} stroke={B.gauge} strokeWidth={10} strokeLinecap="round" />
      </svg>
      <Card x={440} y={800} big={["SET DOWN", "BEFORE LAUNCH"]} small={["older satellites"]} size={72} opacity={span(frame, setAt, whyAt)} />

      {/* the question */}
      <Card x={40} y={280} big={["WHY WOULD IT", "RUN FAST AT ALL?"]} size={86} opacity={span(frame, whyAt, endAt)} bg={B.tease} ink={B.paper} />
      <Card x={200} y={760} big={["HOW HIGH?  ??? KM"]} size={78} opacity={span(frame, highAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind="illustration" source="painting: US Air Force · rest drawn" left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF THE SKY" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 9 · gps"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF THE SKY" line="level 9: gps and geostationary" />
    </AbsoluteFill>
  );
};

export const ShortS24: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
