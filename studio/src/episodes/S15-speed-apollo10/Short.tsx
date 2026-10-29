import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, PlateFade, SeriesPill, ShortFrame, cue, currentLine, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S15 - the fastest humans ever (episodes/S15-speed-apollo10; storyboard.md). For L03, Every Level of Speed (level 8,
 * coming home from orbit, 6:17). Vertical 1080x1920.
 * Two real NASA photos, one after the other: lines 0-1 the Apollo 10 crew portrait (`apollo10-crew`, S69-34385, full
 * plate 1080x1180, names pinned under each man in NASA's left-to-right order: Cernan, Young, Stafford); lines 2-5 the
 * Earth photographed FROM Apollo 10 (`apollo10-earth`, AS10-34-5013, a square plate y 0-1080, the disc at about
 * (572, 628), r ~200 - read off NASA's thumbnail: check on the first stills), with a drawn ring for the top of the
 * atmosphere and a drawn path that reaches it. The mph readout sits top-left over black space; the cards sit at
 * y 880-1060 under the disc. Chip y ~1,170-1,216, captions y 1,290-1,590. Nothing past x = 930, nothing below y 1,620.
 * Lines: 0 a record unbroken for 50+ years · 1 Stafford, Cernan, Young - Apollo 10 · 2 May 1969, home from the Moon,
 * 24,791 mph at the top of the atmosphere (the readout rolls up to it) · 3 nearly 40,000 km/h (card 39,900, rounded) ·
 * 4 fastest humans, relative to the Earth · 5 what does the air do? -> end card on "the full video".
 * Honesty: the Earth photo was taken on the way OUT (18 May 1969, trans-lunar), not during re-entry - a note on the
 * picture says so. Ring and path are drawn, not to scale (chip says ILLUSTRATION from line 2). What the air does (the
 * heat) is NOT shown - that is L03 level 8. Numbers: L03 #23 only (24,791 mph ~ 39,900 km/h at entry interface,
 * 400,000 ft; May 1969; Stafford, Cernan, Young; still the record).
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const MPH = 24791; // L03 #23
const DISC = { x: 572, y: 628, r: 200 };
const RING_R = DISC.r + 22; // the drawn top of the atmosphere - hugely exaggerated
const ENTRY = { x: DISC.x - RING_R * Math.SQRT1_2, y: DISC.y - RING_R * Math.SQRT1_2 };
const P0 = { x: 40, y: 640 };
const PC = { x: 200, y: 400 };
const pathAt = (u: number) => ({
  x: (1 - u) * (1 - u) * P0.x + 2 * (1 - u) * u * PC.x + u * u * ENTRY.x,
  y: (1 - u) * (1 - u) * P0.y + 2 * (1 - u) * u * PC.y + u * u * ENTRY.y,
});

const NAMES = [
  // NASA's caption, left to right: Cernan, Young, Stafford (label x is its left edge; STAFFORD at 28 px ends ~x 914)
  { name: "Cernan", x: 175, say: "Gene Cernan" },
  { name: "Young", x: 500, say: "John Young" },
  { name: "Stafford", x: 720, say: "Tom Stafford" },
];

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const recordAt = cue(t, 0, "speed record");
  const fiftyAt = cue(t, 0, "more than fifty years");
  const nameAt = NAMES.map((n) => cue(t, 1, n.say));
  const crewAt = cue(t, 1, "the crew of Apollo 10");
  const mayAt = cue(t, 2, "In May 1969");
  const homeAt = cue(t, 2, "coming home");
  const topAt = cue(t, 2, "the top of the atmosphere");
  const numAt = cue(t, 2, "twenty-four thousand");
  const numEnd = cue(t, 2, "miles an hour");
  const kmAt = cue(t, 3, "forty thousand");
  const noneAt = cue(t, 4, "No human beings");
  const relAt = cue(t, 4, "relative to the Earth");
  const airAt = cue(t, 5, "hitting the air");
  const endAt = cue(t, 5, "the full video");
  const end = ease(frame, endAt, 12);

  // plates: the crew until line 2, then the Earth
  const earth = ease(frame, L(2) - 6, 14);
  const crew = 1 - earth;
  // the path: drawn from "coming home" to "top of the atmosphere"; the craft-dot sits at the ring after that
  const u = smooth(frame, homeAt, topAt + 10);
  const pathOn = ease(frame, homeAt - 4, 8) * (1 - end);
  const dot = pathAt(u);
  const hit = ease(frame, topAt + 10, 6);
  const ringOn = ease(frame, topAt - 6, 10) * (1 - end);
  // the readout rolls from 0 on "twenty-four thousand" to 24,791 as "miles an hour" is said
  const mph = Math.round(MPH * smooth(frame, numAt, numEnd));
  const readOn = ease(frame, numAt - 6, 8) * (1 - end);
  const pathD = Array.from({ length: 41 }, (_, i) => {
    const p = pathAt((i / 40) * u);
    return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }).join(" ");

  const chip =
    cur <= 1
      ? { kind: "real" as const, source: "NASA JSC · S69-34385 · 13 May 1969" }
      : { kind: "illustration" as const, source: "path drawn, not to scale · photo: NASA" };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* lines 0-1: the crew portrait */}
      {crew > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden", opacity: crew }}>
          <Img src={staticFile("assets/apollo10-crew.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "50% 35%", transform: `scale(${1 + 0.06 * smooth(frame, 0, L(2))})`, transformOrigin: "50% 40%" }} />
        </div>
      ) : null}
      {/* lines 2-5: the Earth from Apollo 10 (on the way out) */}
      {earth > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1080, overflow: "hidden", opacity: earth }}>
          <Img src={staticFile("assets/apollo10-earth.jpg")} style={{ width: 1080, height: 1080, objectFit: "cover", filter: `brightness(${lerp(1, 0.6, ease(frame, airAt, 12))})` }} />
        </div>
      ) : null}
      <PlateFade />

      {/* line 0: the record */}
      <Card x={520} y={250} big={["UNBROKEN"]} small={["more than 50 years"]} size={96} opacity={span(frame, recordAt, L(1)) * crew} />
      <Note x={520} y={420} rows={["fastest humans ever"]} opacity={span(frame, fiftyAt, L(1)) * crew} color={B.gauge} />

      {/* line 1: the names, in the photo's order */}
      {NAMES.map((n, i) => (
        <Note key={n.name} x={n.x} y={930} rows={[n.name]} opacity={ease(frame, nameAt[i], 8) * crew} color={B.gauge} size={28} />
      ))}
      <Card x={175} y={1000} big={["APOLLO 10"]} size={72} opacity={ease(frame, crewAt, 8) * crew} />
      <Note x={40} y={214} rows={["NASA photo · 13 May 1969 · their rocket behind them"]} opacity={ease(frame, L(1), 10) * crew} size={22} />

      {/* lines 2-5: the drawn top of the atmosphere and the way in */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={DISC.x} cy={DISC.y} r={RING_R} fill="none" stroke={B.aqua} strokeWidth={4} strokeDasharray="6 8" opacity={ringOn * 0.9} />
        <path d={pathD} fill="none" stroke={B.gauge} strokeWidth={5} strokeLinecap="round" opacity={pathOn} />
        <circle cx={dot.x} cy={dot.y} r={12} fill={B.paper} opacity={pathOn} />
        <circle cx={ENTRY.x} cy={ENTRY.y} r={18 + 26 * hit + 6 * Math.sin(frame / 5) * hit} fill="none" stroke={cur >= 5 ? B.tease : B.gauge} strokeWidth={5} opacity={hit * pathOn} />
      </svg>
      <Note x={548} y={DISC.y - RING_R - 84} rows={["top of the atmosphere", "400,000 ft · drawn"]} opacity={span(frame, topAt, airAt) * earth} color={B.aqua} size={22} />
      <Note x={40} y={214} rows={["Earth from Apollo 10 · on the way out, 18 May 1969"]} opacity={ease(frame, L(2), 10) * (1 - end)} size={22} />
      <Note x={40} y={270} rows={["May 1969 · home from the Moon"]} opacity={span(frame, mayAt, numAt)} color={B.gauge} size={30} />

      {/* the readout */}
      <div style={{ position: "absolute", left: 40, top: 270, opacity: readOn }}>
        <div style={{ fontFamily: F.headline, fontSize: 104, lineHeight: 1, color: mph >= MPH ? B.gauge : B.paper, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", textShadow: "0 4px 18px rgba(0,0,0,0.8)" }}>
          {mph.toLocaleString("en-US")} MPH
        </div>
      </div>

      {/* lines 3-4 */}
      <Card x={90} y={890} big={["39,900 KM/H"]} small={["nearly 40,000 · rounded from 24,791 mph"]} size={88} opacity={span(frame, kmAt, noneAt)} />
      <Card x={90} y={890} big={["FASTEST HUMANS EVER"]} small={["relative to the Earth"]} size={80} opacity={span(frame, noneAt, airAt)} bg={B.paper} />
      <Note x={90} y={1060} rows={["Stafford · Cernan · Young"]} opacity={span(frame, relAt, airAt)} color={B.gauge} />

      {/* line 5: the question */}
      <Card x={90} y={880} big={["WHAT DOES", "THE AIR DO?"]} size={84} opacity={span(frame, airAt, endAt)} bg={B.tease} ink={B.paper} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF SPEED" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 8 · coming home from orbit"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF SPEED" line="level 8: coming home from orbit" />
    </AbsoluteFill>
  );
};

export const ShortS15: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
