import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, currentLine, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S14 - LA to D.C. in an hour (episodes/S14-speed-blackbird; storyboard.md). For L03, Every Level of Speed (the SR-71 is
 * level 6; the cliff is answered at level 7, the fastest aircraft ever, 5:06). Vertical 1080x1920.
 * Layout: the SR-71 photo is the top band (y 0-760) fading into ink; below it a drawn route board (y 800-1130): LOS
 * ANGELES left, WASHINGTON, D.C. right, an arc the plane-dot flies along, a flight clock under it. Later lines reuse the
 * board for a Mach-3 bar, the Smithsonian card, the record card and a two-rung ladder whose top rung stays "???".
 * Chip y ~1,170-1,216, captions y 1,290-1,590 (shortKit). Nothing past x = 930, nothing in the bottom 300 px.
 * Lines: 0 LA -> D.C., 1 h 4 min 20 s (the clock runs to 1:04:20 as the line ends, the dot lands) · 1 March 1990, final
 * flight · 2 across the country, ~3,400 km/h average · 3 > Mach 3, up to 85,000 ft · 4 now the Smithsonian's · 5 still
 * a record (crewed, air-breathing) · 6 not the fastest aircraft ever flown · 7 what beat it? -> end card on "the full video".
 * Honesty: the photo is NASA's SR-71 #844 taking off on 31 Oct 1997 (EC97-44295-29) - not the 1990 flight's airframe
 * (61-7972); a note on the picture says so throughout. Route, clock and bars are drawn; the clock is time-lapsed and
 * says NOT REAL TIME; the route is not a map (no distance is claimed). Never named or shown: the X-15, Mach 6.7.
 * Numbers: L03 #27 (1 h 4 min 20 s, 3,418 km/h = 2,124 mph, 6 Mar 1990, 61-7972 is the Smithsonian's), #8 (> Mach 3,
 * up to 85,000 ft, record for crewed air-breathing aircraft), #9 (something flew faster - not named).
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const PLATE_H = 760;
const ROUTE = { x0: 130, x1: 880, y: 1000, peak: 880 };
const FLIGHT_S = 1 * 3600 + 4 * 60 + 20; // 1 h 4 min 20 s (#27)

/** a point on the drawn route (a quadratic arc LA -> D.C.) */
const routeAt = (u: number): [number, number] => {
  const mx = (ROUTE.x0 + ROUTE.x1) / 2;
  const x = (1 - u) * (1 - u) * ROUTE.x0 + 2 * (1 - u) * u * mx + u * u * ROUTE.x1;
  const y = (1 - u) * (1 - u) * ROUTE.y + 2 * (1 - u) * u * (2 * ROUTE.peak - ROUTE.y) + u * u * ROUTE.y;
  return [x, y];
};
const clock = (s: number) => {
  const v = Math.round(s);
  return `${Math.floor(v / 3600)}:${String(Math.floor((v % 3600) / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
};

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const laAt = cue(t, 0, "Los Angeles");
  const dcAt = cue(t, 0, "Washington");
  const timeAt = cue(t, 0, "One hour");
  const landAt = cue(t, 0, "twenty seconds");
  const marchAt = cue(t, 1, "March 1990");
  const finalAt = cue(t, 1, "final flight");
  const avgAt = cue(t, 2, "averaging");
  const machAt = cue(t, 3, "more than three times");
  const feetAt = cue(t, 3, "eighty-five thousand");
  const smithAt = cue(t, 4, "Smithsonian");
  const recordAt = cue(t, 5, "holds a record");
  const breatheAt = cue(t, 5, "engines that breathe air");
  const notAt = cue(t, 6, "not the fastest");
  const beatAt = cue(t, 7, "what beat it");
  const endAt = cue(t, 7, "the full video");
  const end = ease(frame, endAt, 12);

  // lines 0-2: the route board. The dot leaves LA on "Los Angeles" and lands as "...twenty seconds" ends.
  const landEnd = landAt + 30;
  const u = smooth(frame, laAt + 6, landEnd);
  const [px, py] = routeAt(u);
  const [qx, qy] = routeAt(Math.min(1, u + 0.02));
  const heading = (Math.atan2(qy - py, qx - px) * 180) / Math.PI;
  const board = span(frame, laAt, L(3));
  const clockOn = ease(frame, timeAt - 8, 8) * board;
  const elapsed = FLIGHT_S * u;
  // line 3: the Mach bar - three "speed of sound" blocks and a sliver past them
  const mach = span(frame, machAt, L(4));
  // lines 6-7: the ladder
  const ladder = span(frame, notAt, endAt);

  // the route is drawn from the first frame, so the chip says ILLUSTRATION throughout (as S12); the photo is credited in it
  // and the note on the picture says what the photo is
  const chip =
    cur <= 2
      ? { kind: "illustration" as const, source: "route drawn · photo: NASA Armstrong, 1997" }
      : { kind: "illustration" as const, source: "not to scale · photo: NASA Armstrong, 1997" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {/* the plate: NASA SR-71 #844 taking off, 1997 */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PLATE_H, overflow: "hidden", opacity: 1 - end }}>
        <Img src={staticFile("assets/sr71-takeoff.jpg")} style={{ width: 1080, height: PLATE_H, objectFit: "cover", objectPosition: "60% 50%", transform: `scale(${1.02 + 0.08 * smooth(frame, 0, L(3))})`, transformOrigin: "70% 50%", filter: `brightness(${lerp(1, 0.55, ease(frame, L(3), 14))})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>
      <Note x={40} y={214} rows={["shown: a NASA SR-71 taking off · 1997"]} opacity={1 - end} size={22} />

      {/* lines 0-2: the route board */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: board }}>
        <path d={`M ${ROUTE.x0} ${ROUTE.y} Q ${(ROUTE.x0 + ROUTE.x1) / 2} ${2 * ROUTE.peak - ROUTE.y} ${ROUTE.x1} ${ROUTE.y}`} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={4} strokeDasharray="10 12" />
        <path d={`M ${ROUTE.x0} ${ROUTE.y} Q ${(ROUTE.x0 + ROUTE.x1) / 2} ${2 * ROUTE.peak - ROUTE.y} ${ROUTE.x1} ${ROUTE.y}`} fill="none" stroke={B.gauge} strokeWidth={6} pathLength={1} strokeDasharray={`${u} 1`} />
        <circle cx={ROUTE.x0} cy={ROUTE.y} r={14} fill={B.paper} />
        <circle cx={ROUTE.x1} cy={ROUTE.y} r={14} fill={B.paper} opacity={ease(frame, dcAt, 8)} />
        {/* the plane: a drawn dart */}
        <g transform={`translate(${px} ${py}) rotate(${heading})`}>
          <path d="M 26 0 L -18 -13 L -10 0 L -18 13 Z" fill={B.gauge} />
        </g>
      </svg>
      <Note x={ROUTE.x0 - 50} y={1030} rows={["Los Angeles"]} opacity={board * ease(frame, laAt, 8)} />
      {/* right edge of this label ~ x 920 (16 chars at 26 px): keep it left of the Shorts buttons */}
      <Note x={580} y={1030} rows={["Washington, D.C."]} opacity={board * ease(frame, dcAt, 8)} />
      {/* the clock sits above the arc's peak */}
      <div style={{ position: "absolute", left: 0, width: 1010, top: 780, textAlign: "center", opacity: clockOn * (1 - ease(frame, marchAt, 8)) }}>
        <div style={{ fontFamily: F.headline, fontSize: 92, lineHeight: 1, color: u >= 1 ? B.gauge : B.paper, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", textShadow: "0 4px 18px rgba(0,0,0,0.8)" }}>{clock(elapsed)}</div>
      </div>
      <Note x={420} y={1100} rows={["not real time"]} opacity={clockOn * (1 - ease(frame, marchAt, 8))} color={B.mute} size={20} />
      {/* line 1: the date; line 2: the average */}
      <Card x={300} y={730} big={["6 MARCH 1990"]} small={["final flight"]} size={64} opacity={span(frame, marchAt, avgAt) * board} bg={B.paper} />
      <Card x={250} y={730} big={["3,418 KM/H"]} small={["average · 2,124 mph"]} size={80} opacity={span(frame, avgAt, L(3))} />

      {/* line 3: more than three times the speed of sound */}
      <div style={{ opacity: mach }}>
        <Note x={80} y={850} rows={["speed of sound"]} color={B.mute} size={22} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: 90 + i * 230, top: 900, width: 220 * ease(frame, machAt + i * 8, 8), height: 70, borderRadius: 10, background: B.gauge, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.headline, fontSize: 46, color: B.ink }}>{i + 1}</div>
        ))}
        <div style={{ position: "absolute", left: 90 + 3 * 230, top: 900, width: 60 * ease(frame, machAt + 30, 8), height: 70, borderRadius: 10, background: B.tease }} />
        <Note x={80} y={990} rows={["more than Mach 3"]} opacity={ease(frame, machAt + 20, 8)} color={B.gauge} size={30} />
        <Note x={80} y={1060} rows={["up to 85,000 ft"]} opacity={ease(frame, feetAt, 8)} color={B.paper} size={30} />
      </div>

      {/* line 4: the Smithsonian; line 5: the record */}
      <Card x={90} y={860} big={["NOW THE SMITHSONIAN'S"]} small={["the 1990 plane: 61-7972"]} size={70} opacity={span(frame, smithAt, L(5))} bg={B.paper} />
      <Card x={90} y={860} big={["STILL A RECORD"]} small={["fastest crewed aircraft", "with air-breathing engines"]} size={84} opacity={span(frame, recordAt, L(6))} />
      <Note x={90} y={1070} rows={["engines that gulp the air"]} opacity={span(frame, breatheAt, L(6))} color={B.aqua} size={24} />

      {/* lines 6-7: the ladder - the SR-71 is not the top rung */}
      <div style={{ opacity: ladder }}>
        <div style={{ position: "absolute", left: 90, top: 860, width: 820 * ease(frame, notAt + 10, 14), height: 74, borderRadius: 10, background: `linear-gradient(90deg, ${B.tease}, rgba(255,90,79,0))`, display: "flex", alignItems: "center", paddingLeft: 24, boxSizing: "border-box", fontFamily: F.headline, fontSize: 54, color: B.paper, whiteSpace: "nowrap", opacity: 0.6 + 0.4 * Math.abs(Math.sin(frame / 7)) }}>???</div>
        <div style={{ position: "absolute", left: 90, top: 980, width: 420, height: 74, borderRadius: 10, background: B.gauge, display: "flex", alignItems: "center", paddingLeft: 24, boxSizing: "border-box", fontFamily: F.headline, fontSize: 54, color: B.ink, whiteSpace: "nowrap" }}>SR-71</div>
        <Note x={530} y={994} rows={["not the top"]} color={B.paper} size={28} />
        <Note x={90} y={1066} rows={["bars not to scale"]} color={B.mute} size={20} />
      </div>
      <Card x={90} y={740} big={["WHAT BEAT IT?"]} size={72} opacity={span(frame, beatAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF SPEED" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 6 · faster than Mach 3"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF SPEED" line="level 7: the fastest aircraft ever" />
    </AbsoluteFill>
  );
};

export const ShortS14: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
