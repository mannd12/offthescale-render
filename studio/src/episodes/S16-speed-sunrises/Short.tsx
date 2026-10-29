import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, currentLine, lin, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S16 - sixteen sunrises a day (episodes/S16-speed-sunrises; storyboard.md). For L03, Every Level of Speed (level 9,
 * falling forever, 7:22). Vertical 1080x1920.
 * Layout: the real ISS sunrise photo (`iss-sunrise`, NASA JSC, Expedition 40) is the top band (1080x720, its own 3:2
 * shape, so nothing is cropped); readouts sit top-left over its dark sky (x 40-600, y 230-400). Below it, two drawn
 * pieces take turns in y 760-1150: line 0, two 24-hour strips (YOU: one sunrise; THE CREW: a sunrise every 92 min);
 * lines 1-5, a drawn orbit (Earth r 120 at (540, 960), orbit r 170) with the station-dot lapping it. Chip
 * y ~1,170-1,216, captions y 1,290-1,590. Nothing past x = 930, nothing in the bottom 300 px.
 * Lines: 0 one sunrise vs 15 or 16 · 1 one lap every ~92 min · 2 ~27,700 km/h · 3 ~8 km every second · 4 not floating:
 * falling (an arrow from the station to the Earth) · 5 why doesn't it hit the ground? -> end card on "the full video".
 * Honesty: the strips put a sunrise every 92 min (L03 #24), starting 30 min into the day, which gives 16 in 24 h - the
 * label says "15 or 16" because the count depends on where the day starts. The orbit is drawn, not to scale, and the
 * lap is time-lapsed (NOT REAL TIME). The answer (orbital speed: it falls around the curve) is NOT drawn - the arrow
 * only says it is falling. Numbers: L03 #24 (15 or 16 a day, 92 min, 27,700 km/h = 17,200 mph), #11 (~8 km/s).
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const PLATE_H = 720;
const ORBIT_MIN = 92; // L03 #24
const DAY_MIN = 24 * 60;
const STRIP = { x: 120, w: 780 };
const EARTH = { x: 540, y: 960, r: 120 };
const ORBIT_R = 170;
/** crew sunrises in one drawn day: one every 92 min from minute 30 -> 16 marks (15 if the day started ~60 min later) */
const CREW_RISES = Array.from({ length: 16 }, (_, k) => 30 + k * ORBIT_MIN).filter((m) => m < DAY_MIN);

const Sun: React.FC<{ x: number; y: number; on: number; r?: number }> = ({ x, y, on, r = 13 }) => (
  <g opacity={on} transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#FFD25A" />
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      return <line key={i} x1={Math.cos(a) * (r + 4)} y1={Math.sin(a) * (r + 4)} x2={Math.cos(a) * (r + 10)} y2={Math.sin(a) * (r + 10)} stroke="#FFD25A" strokeWidth={3} strokeLinecap="round" />;
    })}
  </g>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const youAt = cue(t, 0, "You got one sunrise");
  const crewAt = cue(t, 0, "The crew");
  const countAt = cue(t, 0, "fifteen or sixteen");
  const aroundAt = cue(t, 1, "all the way around");
  const lapAt = cue(t, 1, "ninety-two minutes");
  const speedAt = cue(t, 2, "twenty-seven thousand");
  const kmsAt = cue(t, 3, "eight kilometres");
  const floatAt = cue(t, 4, "isn't floating");
  const fallAt = cue(t, 4, "It's falling");
  const whyAt = cue(t, 5, "why doesn't it");
  const endAt = cue(t, 5, "the full video");
  const end = ease(frame, endAt, 12);

  // line 0: the strips. The crew's sunrises appear one by one from "The crew" to "fifteen or sixteen".
  const strips = span(frame, youAt, L(1));
  const risesShown = CREW_RISES.length * lin(frame, crewAt + 4, countAt + 6);
  // lines 1-5: the orbit. The dot laps once per ~2.4 s (time-lapsed), starting at the top.
  const orbit = ease(frame, L(1) - 4, 12) * (1 - end);
  const ang = -Math.PI / 2 + (frame >= aroundAt ? ((frame - aroundAt) / 72) * 2 * Math.PI : 0);
  const sx = EARTH.x + ORBIT_R * Math.cos(ang);
  const sy = EARTH.y + ORBIT_R * Math.sin(ang);
  const lapFrac = frame >= aroundAt ? ((frame - aroundAt) / 72) % 1 : 0;
  const fall = span(frame, fallAt, endAt);
  // the arrow: from the station toward the Earth's centre, stopping short of the surface
  const ax = EARTH.x + (ORBIT_R - 18) * Math.cos(ang);
  const ay = EARTH.y + (ORBIT_R - 18) * Math.sin(ang);
  const bx = EARTH.x + (EARTH.r + 12) * Math.cos(ang);
  const by = EARTH.y + (EARTH.r + 12) * Math.sin(ang);
  const headA = Math.atan2(by - ay, bx - ax);

  // the strips are drawn from the first line, so the chip says ILLUSTRATION throughout; the note on the photo says it is real
  const chip = { kind: "illustration" as const, source: cur === 0 ? "strips drawn · photo: NASA JSC, Expedition 40" : "drawn, not to scale · photo: NASA JSC, Exp. 40" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {/* the plate: a sunrise over Earth's limb, photographed from the ISS */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PLATE_H, overflow: "hidden", opacity: 1 - end }}>
        <Img src={staticFile("assets/iss-sunrise.jpg")} style={{ width: 1080, height: PLATE_H, objectFit: "cover", transform: `scale(${1.02 + 0.07 * smooth(frame, 0, L(2))})`, transformOrigin: "65% 20%", filter: `brightness(${lerp(1, 0.55, ease(frame, floatAt, 14))})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 180, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>
      <Note x={40} y={214} rows={["real photo · sunrise from the space station"]} opacity={span(frame, 0, L(1))} size={22} />

      {/* line 0: one day, two strips */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: strips }}>
        {[820, 990].map((y) => (
          <g key={y}>
            <rect x={STRIP.x} y={y} width={STRIP.w} height={36} rx={18} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
          </g>
        ))}
        {/* YOU: one sunrise (drawn at 06:00 - a generic morning) */}
        <Sun x={STRIP.x + (STRIP.w * 6 * 60) / DAY_MIN} y={838} on={ease(frame, youAt + 6, 8)} r={15} />
        {/* THE CREW: one every 92 minutes */}
        {CREW_RISES.map((m, k) => (
          <Sun key={m} x={STRIP.x + (STRIP.w * m) / DAY_MIN} y={1008} on={k < risesShown ? 1 : 0} r={10} />
        ))}
      </svg>
      <Note x={STRIP.x - 10} y={762} rows={["you · one day"]} opacity={strips * ease(frame, youAt, 8)} />
      <Note x={STRIP.x - 10} y={932} rows={["the crew · the same day"]} opacity={strips * ease(frame, crewAt, 8)} />
      <Note x={STRIP.x - 10} y={1056} rows={["15 or 16 sunrises"]} opacity={strips * ease(frame, countAt, 8)} color={B.gauge} size={34} />
      <Note x={660} y={1062} rows={["24 hours"]} opacity={strips * ease(frame, countAt, 8)} color={B.mute} size={20} />

      {/* lines 1-5: the drawn orbit */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: orbit }}>
        <defs>
          <radialGradient id="s16earth" cx="0.4" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#5FB4E8" />
            <stop offset="0.7" stopColor="#1F5C8F" />
            <stop offset="1" stopColor="#0A2238" />
          </radialGradient>
        </defs>
        <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r} fill="url(#s16earth)" />
        <circle cx={EARTH.x} cy={EARTH.y} r={ORBIT_R} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={3} strokeDasharray="8 10" />
        {/* the lap, drawn as it goes */}
        <circle cx={EARTH.x} cy={EARTH.y} r={ORBIT_R} fill="none" stroke={B.gauge} strokeWidth={5} pathLength={1} strokeDasharray={`${lapFrac} 1`} transform={`rotate(-90 ${EARTH.x} ${EARTH.y})`} opacity={span(frame, aroundAt, floatAt)} />
        <rect x={sx - 14} y={sy - 7} width={28} height={14} rx={3} fill={B.paper} />
        <rect x={sx - 26} y={sy - 3} width={52} height={6} rx={2} fill={B.aqua} />
        {/* line 4: falling */}
        <g opacity={fall}>
          <line x1={ax} y1={ay} x2={bx} y2={by} stroke={B.tease} strokeWidth={8} strokeLinecap="round" />
          <path d={`M ${bx} ${by} l ${-22 * Math.cos(headA - 0.5)} ${-22 * Math.sin(headA - 0.5)} M ${bx} ${by} l ${-22 * Math.cos(headA + 0.5)} ${-22 * Math.sin(headA + 0.5)}`} stroke={B.tease} strokeWidth={8} strokeLinecap="round" fill="none" />
        </g>
      </svg>
      <Note x={90} y={790} rows={["one lap ≈ 92 min", "not real time"]} opacity={span(frame, lapAt, floatAt) * orbit} color={B.gauge} size={24} />

      {/* readouts on the photo's dark sky */}
      <Card x={40} y={250} big={["27,700 KM/H"]} small={["17,200 mph"]} size={88} opacity={span(frame, speedAt, floatAt)} />
      <Note x={40} y={420} rows={["≈ 8 km every second"]} opacity={span(frame, kmsAt, floatAt)} color={B.gauge} size={34} />
      <Card x={40} y={250} big={["NOT FLOATING."]} small={["falling, the whole time"]} size={88} opacity={span(frame, floatAt, whyAt)} bg={B.paper} />
      <Note x={720} y={EARTH.y - 20} rows={["falling"]} opacity={fall * (1 - ease(frame, whyAt, 8))} color={B.tease} size={30} />

      {/* line 5: the question */}
      <Card x={40} y={250} big={["WHY DOESN'T IT", "HIT THE GROUND?"]} size={80} opacity={span(frame, whyAt, endAt)} bg={B.tease} ink={B.paper} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF SPEED" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 9 · falling forever"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF SPEED" line="level 9: falling forever" />
    </AbsoluteFill>
  );
};

export const ShortS16: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
