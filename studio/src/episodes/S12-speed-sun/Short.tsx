import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { FPS, SceneTiming, VoLine, buildTimeline, lineAt, within } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, currentLine, lin, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S12 - the Sun switches off (episodes/S12-speed-sun; storyboard written with the build). For L03, Every Level of
 * Speed (level 12, the speed of light). Vertical 1080x1920; the Sun plate is the top band (y 0-620), a drawn light
 * track runs down to a drawn Earth (x 260, y ~1,060), the countdown sits right of the track; chip y ~1,170-1,216,
 * captions y 1,290-1,590 (shortKit). Nothing past x = 930, nothing in the bottom 300 px.
 * Lines: 0 the switch-off · 1 8:20 of light still arriving (the countdown starts) · 2 Earth -> Moon in 1.3 s (real time)
 * · 3 nothing goes faster · 4 still eight minutes from the Sun (the countdown reaches 0:00 as the line ends) · 5 how
 * close have we got? -> end card on "The fastest thing".
 * Honesty: the plate is NASA/SDO (8 Sept 2010); the switch-off is a thought experiment drawn over it (the chip says
 * ILLUSTRATION from the first frame - the track, Earth and Moon are drawn and not to scale). The countdown is
 * time-lapsed and says "not real time"; the Moon hop runs at the real 1.3 s (39 frames) and says "real time".
 * Every number is an L03 claim (#25: 8 min 20 s, 1.3 s; #16: nothing faster - matter, energy, information).
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const SUN_H = 620;
const TRACK = { x: 260, y0: 600, y1: 990 };
const EARTH = { x: 260, y: 1060, r: 64 };
const MOON = { x: 820, y: 1060, r: 24 };
const MOON_FRAMES = Math.round(1.3 * FPS); // 39 frames: light from the Earth to the Moon (#25), shown at real speed
const TOTAL_S = 8 * 60 + 20; // 8 min 20 s (#25)

const fmt = (s: number) => {
  const v = Math.max(0, Math.ceil(s));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
};

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const offAt = cue(t, 0, "switched off");
  const knowAt = cue(t, 0, "You wouldn't know");
  const arriveAt = cue(t, 1, "keep arriving");
  const eightAt = cue(t, 1, "eight minutes and twenty seconds");
  const moonAt = cue(t, 2, "from the Earth to the Moon");
  const secAt = cue(t, 2, "one point three seconds");
  const nothingAt = cue(t, 3, "Nothing in the universe");
  const noAt = [cue(t, 3, "No matter"), cue(t, 3, "no energy"), cue(t, 3, "no message")];
  const sunAt = cue(t, 4, "from the Sun");
  const minutesAt = cue(t, 4, "eight minutes");
  const zeroAt = within(t, 4, 1); // the countdown reaches 0:00 as "...it takes eight minutes" ends
  const closeAt = cue(t, 5, "how close");
  const builtAt = cue(t, 5, "The fastest thing");
  const end = ease(frame, builtAt, 12);

  // the switch-off
  const off = ease(frame, offAt, 8);
  // the countdown: 8:20 when it is said, then time-lapsed down to 0:00
  const k = lin(frame, eightAt, zeroAt); // 0..1 of the 8 min 20 s gone
  const remaining = TOTAL_S * (1 - k);
  const countOn = ease(frame, eightAt, 10) * (1 - end);
  // the light still on its way: everything below the tail is still coming; the tail leaves the Sun when the clock starts
  const tailY = lerp(TRACK.y0, TRACK.y1 + EARTH.r, k);
  const photons = Array.from({ length: 14 }, (_, i) => {
    const y = TRACK.y0 + ((i * 30 + frame * 3.2) % (TRACK.y1 - TRACK.y0 + 20));
    const visible = frame < eightAt || y > tailY;
    return visible ? <rect key={i} x={TRACK.x - 5} y={y} width={10} height={18} rx={5} fill="#FFE27A" opacity={0.9} /> : null;
  });
  // the Earth's lit side fades only when the last light has arrived (0:00)
  const lit = 1 - ease(frame, zeroAt, 14);

  // line 2: a pulse crosses Earth -> Moon in 39 frames, then rests 21 frames, again and again (real time)
  const hopOn = span(frame, moonAt - 6, L(3));
  const hopF = frame < secAt ? -1 : (frame - secAt) % 60;
  const hopX = hopF < 0 || hopF > MOON_FRAMES ? -1 : lerp(EARTH.x + EARTH.r, MOON.x - MOON.r, hopF / MOON_FRAMES);

  const chip =
    frame < offAt
      ? "drawn · Sun photo: NASA/SDO, 8 Sept 2010"
      : cur <= 1
        ? "switch-off imagined · Sun: NASA/SDO, 2010"
        : "not to scale · Sun photo: NASA/SDO, 2010";

  return (
    <AbsoluteFill style={{ backgroundColor: "#04070D" }}>
      {/* the Sun (NASA/SDO), the top band - "switched off" by darkening it */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: SUN_H, overflow: "hidden" }}>
        <Img src={staticFile("assets/sun-sdo.jpg")} style={{ width: 1080, height: SUN_H, objectFit: "cover", transform: `scale(${1.04 + 0.06 * lin(frame, 0, L(2))})`, transformOrigin: "50% 50%", filter: `brightness(${lerp(1, 0.07, off)}) saturate(${lerp(1, 0.3, off)})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 220, background: "linear-gradient(transparent, #04070D)" }} />
      </div>
      <div style={{ position: "absolute", left: 640, top: 300, padding: "4px 24px", border: `7px solid ${B.tease}`, borderRadius: 14, color: B.tease, fontFamily: F.headline, fontSize: 110, lineHeight: 1.05, letterSpacing: 4, whiteSpace: "nowrap", transform: `rotate(-8deg) scale(${lerp(1.5, 1, off)})`, opacity: off * (1 - ease(frame, L(1), 10)) }}>OFF</div>

      {/* the drawn track, Earth and Moon */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - end }}>
        <line x1={TRACK.x} y1={TRACK.y0} x2={TRACK.x} y2={TRACK.y1} stroke="rgba(255,226,122,0.18)" strokeWidth={4} />
        {photons}
        {/* the tail of the light, travelling down once the clock runs */}
        <line x1={TRACK.x - 26} y1={tailY} x2={TRACK.x + 26} y2={tailY} stroke={B.gauge} strokeWidth={4} opacity={countOn * (tailY < TRACK.y1 ? 1 : 0)} />
        {/* Earth: drawn, its sunlit side facing the Sun (up) */}
        <defs>
          <linearGradient id="s12earth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7FD4FF" />
            <stop offset="0.55" stopColor="#1F6FA8" />
            <stop offset="1" stopColor="#0A2238" />
          </linearGradient>
        </defs>
        <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r} fill="#0A2238" />
        <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r} fill="url(#s12earth)" opacity={lit} />
        <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r + 10 + 3 * Math.sin(frame / 8)} fill="none" stroke="#FFE27A" strokeWidth={3} opacity={0.4 * lit} />
        {/* line 2: the Moon and the real-time hop */}
        <g opacity={hopOn}>
          <line x1={EARTH.x + EARTH.r} y1={EARTH.y} x2={MOON.x - MOON.r} y2={MOON.y} stroke="rgba(255,255,255,0.25)" strokeWidth={3} strokeDasharray="8 10" />
          <circle cx={MOON.x} cy={MOON.y} r={MOON.r} fill="#C9CED6" />
          {hopX > 0 ? <circle cx={hopX} cy={EARTH.y} r={11} fill="#FFE27A" /> : null}
          {hopX > 0 ? <circle cx={hopX} cy={EARTH.y} r={26} fill="#FFE27A" opacity={0.25} /> : null}
        </g>
      </svg>
      <Note x={60} y={EARTH.y - 22} rows={["Earth"]} opacity={(1 - end) * (cur >= 1 ? 1 : ease(frame, knowAt, 10))} size={24} />
      <Note x={400} y={1010} rows={["you wouldn't know"]} opacity={span(frame, knowAt, L(1))} color={B.gauge} size={30} />

      {/* the countdown (time-lapsed) */}
      <div style={{ position: "absolute", left: 400, top: 640, opacity: countOn }}>
        <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 1, color: remaining <= 0.5 ? B.tease : B.gauge, whiteSpace: "nowrap", textShadow: "0 4px 24px rgba(0,0,0,0.8)" }}>{fmt(remaining)}</div>
        <div style={{ marginTop: 8, fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 2, color: B.paper, whiteSpace: "nowrap" }}>{remaining > 0.5 ? "LIGHT STILL ARRIVING" : " "}</div>
        <div style={{ marginTop: 4, fontFamily: F.ui, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: B.mute, whiteSpace: "nowrap" }}>NOT REAL TIME</div>
      </div>
      <Note x={400} y={880} rows={["keep arriving: 8 min 20 s"]} opacity={span(frame, eightAt, L(2))} color="#FFE27A" />
      <Note x={400} y={880} rows={["Earth → Moon: 1.3 s", "real time"]} opacity={span(frame, secAt, L(3))} color="#FFE27A" size={28} />

      {/* line 3: nothing faster */}
      <Card x={400} y={870} big={["NOTHING", "GOES FASTER"]} size={64} opacity={span(frame, nothingAt, L(4))} />
      <Note x={400} y={1050} rows={["no matter"]} opacity={span(frame, noAt[0], L(4))} />
      <Note x={640} y={1050} rows={["no energy"]} opacity={span(frame, noAt[1], L(4))} />
      <Note x={400} y={1108} rows={["no message"]} opacity={span(frame, noAt[2], L(4))} />

      {/* line 4: still eight minutes from the Sun - the whole track bracketed */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: span(frame, sunAt, L(5)) }}>
        <path d={`M ${TRACK.x + 44} ${TRACK.y0} h 20 V ${EARTH.y - EARTH.r - 6} h -20`} fill="none" stroke={B.gauge} strokeWidth={4} />
      </svg>
      <Note x={400} y={900} rows={["from the Sun", "eight minutes"]} opacity={span(frame, minutesAt, L(5))} color={B.gauge} size={30} />

      {/* line 5: the question, then the end card */}
      <Card x={400} y={880} big={["HOW CLOSE?"]} size={84} opacity={span(frame, closeAt, builtAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind="illustration" source={chip} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF SPEED" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 12 · the speed of light"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF SPEED" line="the fastest thing ever built" />
    </AbsoluteFill>
  );
};

export const ShortS12: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
