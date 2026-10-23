import React from "react";
import { AbsoluteFill, Loop, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { Tile } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { FPS, SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { Speedo } from "../gauge";
import { C_KMH, ESCAPE_KMH, ESCAPE_READING, LEVELS_REVEALED } from "../ladder";
import { CaptionPop, NumberCard, PillTag, RungShell, Tag } from "./shell";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** 0-1, linear, between two frames */
const lin = (frame: number, a: number, b: number) => clamp01((frame - a) / Math.max(1, b - a));
/** 0-1 between two frames, eased in and out */
const smooth = (frame: number, a: number, b: number) => {
  const x = lin(frame, a, b);
  return x * x * (3 - 2 * x);
};
/** between two speeds along the (logarithmic) gauge, so the needle turns at a steady rate */
const logLerp = (a: number, b: number, k: number) => (k <= 0 ? a : k >= 1 ? b : Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * k));

/**
 * Camera on a still plate: travels from one keyed shot [frame, scale, origin-x %, origin-y %] to the next for the whole
 * stretch between them (half linear, half eased), so the picture is never at rest.
 */
type Shot = [number, number, number, number];
const camera = (frame: number, shots: Shot[]) => {
  let i = 0;
  while (i < shots.length - 2 && frame >= shots[i + 1][0]) i++;
  const a = shots[i];
  const b = shots[i + 1];
  const k = 0.5 * lin(frame, a[0], b[0]) + 0.5 * smooth(frame, a[0], b[0]);
  const at = (p: 1 | 2 | 3) => a[p] + (b[p] - a[p]) * k;
  return { scale: at(1), origin: `${at(2).toFixed(2)}% ${at(3).toFixed(2)}%` };
};

/** Part of a card or tag that is not rendered at all until its words are spoken. */
const On: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  return frame >= at ? <span style={{ opacity: ease(frame, at, 8) }}>{children}</span> : null;
};
/** For bottom-anchored captions and flex rows only: keeps its place in the layout (so nothing jumps) but paints nothing before its cue. */
const hold = (frame: number, at: number): React.CSSProperties => (frame < at ? { visibility: "hidden" } : { opacity: ease(frame, at, 8) });

/** The kit NumberCard's look, with nodes instead of strings so parts of a card can wait for their words. */
const CueCard: React.FC<{ x: number; y: number; big: React.ReactNode; small?: React.ReactNode; size?: number; color?: string; opacity?: number }> = ({ x, y, big, small, size = 64, color = B.gauge, opacity = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity, padding: "10px 22px 12px", borderRadius: 16, background: color, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
    <div style={{ fontFamily: F.headline, fontSize: size, lineHeight: 1, minHeight: size, whiteSpace: "nowrap" }}>{big}</div>
    {small !== undefined ? <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: Math.round(size * 0.36), lineHeight: 1.2, minHeight: "1.2em", marginTop: 4, letterSpacing: 1, whiteSpace: "nowrap" }}>{small}</div> : null}
  </div>
);

/**
 * 9 · Falling forever, 8 km/s. Lines 0-6. Sources #11, #24. Plate: ISS sunrise still (JSC).
 * 0 ≈8 km/s, 27,000 km/h · 1 a lap every ~90 min, 350 km up · 2 15-16 sunrises a day, > 5,000 a year
 * · 3 365 on the ground · 4 not floating: falling · 5 moving sideways so fast the ground curves away = orbit
 * · 6 tease: a little faster and the ground never catches up.
 */
/** Earth disc of the orbit diagram, and the height the throws (and the orbit) start from. */
const EARTH = { cx: 800, cy: 1100, r: 520, launch: 546 };
const LAUNCH: [number, number] = [EARTH.cx, EARTH.cy - EARTH.launch];
/** landing angle from the top of the disc, clockwise, for the four throws that fall short */
const THROW_DEG = [15, 32, 54, 80];
/**
 * One throw: a quadratic from the launch point to its landing point on the surface, with the control point on the
 * bisector outside the disc (at the tangent-intersection radius, pushed out a little more per throw) - so the path
 * leaves roughly horizontally and stays outside the Earth all the way down.
 */
const throwGeom = (k: number) => {
  const a = (THROW_DEG[k] * Math.PI) / 180;
  const rc = (EARTH.launch / Math.cos(a / 2)) * (1.02 + 0.03 * k);
  return {
    c: [EARTH.cx + rc * Math.sin(a / 2), EARTH.cy - rc * Math.cos(a / 2)] as [number, number],
    e: [EARTH.cx + EARTH.r * Math.sin(a), EARTH.cy - EARTH.r * Math.cos(a)] as [number, number],
  };
};
/** the point a fraction u of the way along throw k */
const throwAt = (k: number, u: number): [number, number] => {
  const { c, e } = throwGeom(k);
  const v = 1 - u;
  return [v * v * LAUNCH[0] + 2 * v * u * c[0] + u * u * e[0], v * v * LAUNCH[1] + 2 * v * u * c[1] + u * u * e[1]];
};
/** throw k's path from the launch point as far as u - the trail behind the ball */
const throwTrail = (k: number, u: number) => {
  const n = 18;
  let d = `M${LAUNCH[0]} ${LAUNCH[1]}`;
  for (let j = 1; j <= n; j++) {
    const [x, y] = throwAt(k, (u * j) / n);
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
};
const ORBIT_PATH = `M${EARTH.cx} ${EARTH.cy - EARTH.launch} A${EARTH.launch} ${EARTH.launch} 0 1 1 ${EARTH.cx - 1} ${EARTH.cy - EARTH.launch}`;
const ORBIT_LEN = Math.ceil(2 * Math.PI * EARTH.launch);
/** frames for one lap of the drawn orbit */
const LAP_FRAMES = 75;

export const Orbit: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const stationAt = within(t, 0, 0.03); // "The International Space Station"
  const kmsAt = within(t, 0, 0.5); // "roughly eight kilometres every second" (five miles a second is already said)
  const kmhAt = within(t, 0, 0.8); // "around twenty-seven thousand kilometres an hour"
  const lapAt = lineAt(t, 1);
  const lapSaidAt = within(t, 1, 0.42); // "about once every ninety minutes"
  const upAt = within(t, 1, 0.66); // "three hundred and fifty kilometres up"
  const sunAt = lineAt(t, 2);
  const riseAt = within(t, 2, 0.27); // "fifteen or sixteen times every day"
  const yearAt = within(t, 2, 0.52); // "An astronaut who spends a year up there"
  const fiveKAt = within(t, 2, 0.86); // "more than five thousand sunrises" has been said
  const groundAt = lineAt(t, 3);
  const groundSaidAt = within(t, 3, 0.55); // "three hundred and sixty-five"
  const fallAt = lineAt(t, 4);
  const floatAt = within(t, 4, 0.29); // "The station is not floating."
  const dropAt = within(t, 4, 0.5); // "It is falling"
  const pullAt = within(t, 4, 0.61); // "pulled toward Earth the whole time"
  const sidewaysAt = lineAt(t, 5);
  const missAt = within(t, 5, 0.42); // "the ground has curved away beneath it"
  const orbitAt = within(t, 5, 0.84); // "That is all an orbit is."
  const teaseAt = lineAt(t, 6);
  // lines 4-5: the falling / orbit diagram
  const diagram = ease(frame, fallAt, 14) * (1 - ease(frame, teaseAt, 10));
  // line 4: the ball is dropped again and again and always comes down (it accelerates as it falls)
  const dropU = frame < dropAt ? 0 : frame >= sidewaysAt ? 1 : Math.pow(clamp01(((frame - dropAt) % 75) / 40), 1.6);
  // line 5: three more throws, each faster and landing further round, one after the other - all down before "curved away"
  const throwStart = (k: number) => sidewaysAt + 6 + 36 * (k - 1);
  const throwU = (k: number) => (k === 0 ? dropU : Math.pow(lin(frame, throwStart(k), throwStart(k) + 30), 1.3));
  // ...then the one that misses: it goes round and round until the diagram leaves
  const turns = frame < missAt ? 0 : (frame - missAt) / LAP_FRAMES;
  let ball: [number, number] = throwAt(0, dropU);
  for (let k = 1; k <= 3; k++) if (frame >= throwStart(k)) ball = throwU(k) < 1 ? throwAt(k, throwU(k)) : LAUNCH;
  if (frame >= missAt) ball = [EARTH.cx + EARTH.launch * Math.sin(2 * Math.PI * turns), EARTH.cy - EARTH.launch * Math.cos(2 * Math.PI * turns)];
  // line 2: the count runs while "a year up there" is said and passes 5,000 only as "five thousand" is
  const count = Math.round(5472 * lin(frame, yearAt, fiveKAt)); // NASA: 10,944 sunrises + sunsets in Kelly's yearlong mission -> 5,472 sunrises (#24)
  // the gauge holds rung 8's 27,000 km/h (already on screen) until this rung's own figure is spoken
  const kmh = 27000 + 700 * ease(frame, kmhAt, 20);
  // camera: along the limb for the lap, in on the sunrise glow for the sunrises, down to the ground for "on the ground", in again for the tease
  const cam = camera(frame, [
    [0, 1.02, 25, 45],
    [lapAt, 1.09, 40, 42],
    [sunAt, 1.06, 52, 40],
    [yearAt, 1.14, 62, 27],
    [fallAt, 1.1, 60, 35],
    [sidewaysAt, 1.03, 50, 60],
    [teaseAt, 1.05, 48, 50],
    [t.frames, 1.15, 55, 40],
  ]);
  return (
    <RungShell t={t} index={8} kmh={kmh} plate={{ image: "iss-sunrise" }} plateMove={cam} brightness={0.85 - 0.4 * diagram} credit={{ kind: "real", source: "NASA JSC · Expedition 40" }} sub={frame < kmsAt ? " " : frame < lapSaidAt ? "≈ 8 km/s" : "≈ 8 km/s · one lap every ~90 min"} drawn={{ label: "the orbit diagram, drawn", opacity: diagram }}>
      {/* a thrown ball's arc lengthening until it misses the ground; the disc runs under the (near-opaque) credit chip */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: diagram }}>
        <circle cx={EARTH.cx} cy={EARTH.cy} r={EARTH.r} fill="#12324A" stroke="#4FA3CF" strokeWidth={4} />
        {[0, 1, 2, 3].map((k) => (throwU(k) > 0 ? <path key={k} d={throwTrail(k, throwU(k))} stroke="rgba(255,255,255,0.55)" strokeWidth={4} fill="none" /> : null))}
        {frame >= missAt ? <path d={ORBIT_PATH} stroke={B.gauge} strokeWidth={8} fill="none" strokeDasharray={`${ORBIT_LEN}`} strokeDashoffset={ORBIT_LEN * (1 - Math.min(1, turns))} /> : null}
        {/* "pulled toward Earth the whole time": the pull, flowing down from the launch point into the disc */}
        <g opacity={ease(frame, pullAt, 10)}>
          <line x1={EARTH.cx} y1={LAUNCH[1] + 14} x2={EARTH.cx} y2={690} stroke={B.aqua} strokeWidth={5} strokeDasharray="12 10" strokeDashoffset={-frame * 1.5} />
          <polygon points={`${EARTH.cx - 13},690 ${EARTH.cx + 13},690 ${EARTH.cx},714`} fill={B.aqua} />
        </g>
        <circle cx={ball[0]} cy={ball[1]} r={frame >= missAt ? 12 : 9} fill={frame >= missAt ? B.gauge : B.paper} stroke={B.ink} strokeWidth={2} />
      </svg>
      {/* inside the drawn disc, under the arrow (the disc is 359 px either side of centre at this height) */}
      <Tag x={EARTH.cx} y={724} align="center" opacity={diagram * ease(frame, pullAt, 10)} color={B.aqua}>pulled toward Earth</Tag>
      {/* two rows, both above the launch point (y 554): the top one changes with the sentence */}
      <Tag x={700} y={400} opacity={diagram * ease(frame, floatAt, 8) * (1 - ease(frame, sidewaysAt, 8))} color={B.paper}>
        not floating<On at={dropAt}> · falling</On>
      </Tag>
      <Tag x={700} y={400} opacity={diagram * ease(frame, within(t, 5, 0.08), 8) * (1 - ease(frame, missAt, 8))} color={B.paper}>sideways, faster each time</Tag>
      <Tag x={700} y={400} opacity={diagram * ease(frame, missAt + 6, 10)} color={B.gauge}>the ground curves away</Tag>
      <Tag x={700} y={446} opacity={diagram * ease(frame, orbitAt, 10)} color={B.gauge}>that's an orbit</Tag>
      {/* lines 0-1: the station, its speed and its lap, each as it is said */}
      <div style={{ opacity: 1 - ease(frame, sunAt, 8) }}>
        <CueCard x={160} y={300} size={56} color={B.paper} opacity={ease(frame, stationAt, 12)} big="the International Space Station" />
        <CueCard
          x={160}
          y={392}
          size={96}
          opacity={ease(frame, kmsAt, 12)}
          big="≈ 8 km/s"
          small={
            <>
              ABOUT 5 MILES A SECOND<On at={kmhAt}> · ≈ 27,700 KM/H</On>
            </>
          }
        />
        <CueCard
          x={160}
          y={562}
          size={72}
          color={B.paper}
          opacity={ease(frame, lapSaidAt, 10)}
          big="one lap ≈ 90 minutes"
          small={
            <>
              AROUND THE WHOLE PLANET<On at={upAt}> · ≈ 350 KM UP</On>
            </>
          }
        />
      </div>
      {/* lines 2-3: the sunrises; gone when line 4 turns to falling */}
      <div style={{ opacity: 1 - ease(frame, fallAt, 8) }}>
        <NumberCard x={160} y={300} big="15–16 sunrises" small="EVERY DAY · 350 KM UP" size={90} opacity={ease(frame, riseAt, 12)} />
        <NumberCard x={160} y={460} big={count.toLocaleString("en-US")} small="SUNRISES · A YEARLONG MISSION IN ORBIT (NASA)" size={80} color={B.paper} opacity={ease(frame, yearAt, 10)} />
        <NumberCard x={160} y={610} big="365" small="SUNRISES ON THE GROUND · A YEAR" size={64} color={B.aqua} opacity={ease(frame, groundSaidAt, 10) * (frame >= groundAt ? 1 : 0)} />
      </div>
      {/* line 6: the gold half waits for "never catches up" */}
      <div style={{ opacity: ease(frame, teaseAt, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          a little faster still — and the ground <span style={{ color: B.gauge, ...hold(frame, within(t, 6, 0.6)) }}>never catches up</span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * 10 · Leaving, 11.2 km/s. Lines 0-4. Sources #12, #28, #29. Plate: the Apollo 11 film (NASA), from its first launch-day shot.
 * 0 escape velocity · 1 every craft crossed this line · 2 Voyager 1, 17 km/s, interstellar · 3 one light-day out
 * · 4 tease: the fastest thing we ever made.
 * The film is Apollo 11, so it is tagged as that on the picture, sits at 0.2 under the drawn escape path, and is taken
 * out completely (black, drawn stars) for the two Voyager lines - Apollo footage must not stand for Voyager.
 */
/**
 * The clip's first ~5.5 s are the painted Apollo 11 mission patch, not footage (seen on the current frames up to
 * clip frame 156; the pad is on screen by 181) - skip it, so REAL FOOTAGE is never said over a painting.
 */
const APOLLO_SKIP = 190;
/** the clip is trimmed to 15 s (manifest in 0, out 15); stop a few frames short, as the shell does */
const APOLLO_LOOP = 15 * FPS - APOLLO_SKIP - 3;
/** One pass of the film from the pad shot on, with the shell's crop (1.38 hides the pillar bars) and its dip through dark over the seam. */
const ApolloPass: React.FC<{ brightness: number }> = ({ brightness }) => {
  const f = useCurrentFrame(); // relative to this pass (inside <Loop>)
  const loop = Loop.useLoop();
  const fadeIn = loop && loop.iteration > 0 ? Math.min(1, f / 8) : 1;
  const fadeOut = Math.min(1, (APOLLO_LOOP - 1 - f) / 8);
  const seam = 0.2 + 0.8 * Math.max(0, Math.min(fadeIn, fadeOut));
  return <OffthreadVideo src={staticFile("assets/apollo11-liftoff.mp4")} muted trimBefore={APOLLO_SKIP} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.38)", filter: `brightness(${brightness * seam})` }} />;
};
/** the drawn escape path: a cubic from the top of the Earth disc out to the upper right */
const ESC = [
  [400, 640],
  [700, 560],
  [1000, 480],
  [1400, 300],
] as const;
const escAt = (u: number): [number, number] => {
  const v = 1 - u;
  const w = [v * v * v, 3 * v * v * u, 3 * v * u * u, u * u * u];
  return [0, 1].map((a) => w[0] * ESC[0][a] + w[1] * ESC[1][a] + w[2] * ESC[2][a] + w[3] * ESC[3][a]) as [number, number];
};
const escTrail = (u: number) => {
  const n = 28;
  let d = `M${ESC[0][0]} ${ESC[0][1]}`;
  for (let j = 1; j <= n; j++) {
    const [x, y] = escAt((u * j) / n);
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
};
/** repeatable scatter for the drawn stars */
const rnd = (i: number, s: number) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const STARS = Array.from({ length: 70 }, (_, i) => ({ x: rnd(i, 1) * 1920, y: rnd(i, 2) * 1080, v: 0.3 + 0.9 * rnd(i, 3), r: 1.2 + 2 * rnd(i, 4) }));

export const Escape: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const discAt = within(t, 0, 0.3); // "go this fast, straight out" is coming: the Earth and the craft
  const goAt = within(t, 0, 0.38); // "go this fast, straight out"
  const slowAt = within(t, 0, 0.55); // "gravity will slow you"
  const neverAt = within(t, 0, 0.66); // "but never stop you"
  const leaveAt = within(t, 0, 0.78); // "You are leaving"
  const everAt = lineAt(t, 1);
  const destAt = [within(t, 1, 0.39), within(t, 1, 0.51), within(t, 1, 0.6)]; // "to the Moon" · "to Mars" · "to the outer planets"
  const crossAt = within(t, 1, 0.78); // "had to cross this line"
  const voyagerAt = lineAt(t, 2);
  const nameAt = within(t, 2, 0.14); // "Voyager 1"
  const leftAt = within(t, 2, 0.33); // "left Earth in September 1977"
  const speedAt = within(t, 2, 0.47); // "seventeen kilometres a second"
  const sunRelAt = within(t, 2, 0.58); // "relative to the Sun"
  const beyondAt = within(t, 2, 0.68); // "out beyond the planets"
  const starsAt = within(t, 2, 0.8); // "in interstellar space"
  const lightDayAt = lineAt(t, 3);
  const dayAt = within(t, 3, 0.34); // "about one light-day out"
  const radioAt = within(t, 3, 0.5); // "a radio message sent from Earth"
  const fullDayAt = within(t, 3, 0.8); // "takes a full day"
  const teaseAt = lineAt(t, 4);
  // the film: full for the opening, 0.2 under the drawn path, black for the Voyager lines (gone by "Voyager 1"), back for the hand-off
  const black = smooth(frame, voyagerAt, nameAt);
  const back = ease(frame, teaseAt, 15);
  const film = (0.85 - 0.65 * ease(frame, discAt, 15)) * (1 - black);
  const plate = film + (0.85 - film) * back;
  const drawing = ease(frame, discAt, 10) * (1 - ease(frame, teaseAt, 8));
  // the craft: fast off the Earth, slowed all the way out, and never at rest ("gravity will slow you but never stop you")
  const x1 = lin(frame, goAt, leaveAt);
  const p = 0.7 * (0.25 * x1 + 0.75 * (1 - Math.pow(1 - x1, 3))) + 0.22 * lin(frame, leaveAt, voyagerAt) + 0.08 * lin(frame, voyagerAt, nameAt);
  // line 1: one more craft off the Earth for each destination named, all behind the first
  const others = destAt.map((at, j) => (frame < at ? -1 : (0.22 + 0.14 * j) * (1 - Math.pow(1 - lin(frame, at, at + 50), 3)) + 0.0006 * (frame - at)));
  // line 2: the view pulls back - the Earth and the whole escape path shrink away behind Voyager, done by "out beyond the planets"
  const s = 1 - 0.78 * smooth(frame, nameAt, beyondAt);
  const pathEnd: [number, number] = [200 + s * (ESC[3][0] - 200), 960 - s * (960 - ESC[3][1])];
  const craft = frame < nameAt ? escAt(Math.min(1, p)) : ([ESC[3][0], ESC[3][1]] as [number, number]);
  // line 3: one radio pulse leaves the Earth on "a radio message" and reaches Voyager as the line ends
  const radio = lin(frame, radioAt, within(t, 3, 0.97));
  const voyage = black * (1 - ease(frame, teaseAt, 10));
  const credit: { kind: "real" | "illustration"; source?: string } =
    frame < discAt || frame >= teaseAt ? { kind: "real", source: "NASA · Apollo 11" } : frame < nameAt ? { kind: "illustration", source: "escape path, drawn · not to scale · over Apollo 11 film" } : { kind: "illustration", source: "Voyager 1's path, drawn · not to scale" };
  return (
    <RungShell t={t} index={9} kmh={ESCAPE_KMH} reading={ESCAPE_READING} plate={null} credit={credit} sub="11.2 km/s · escape velocity">
      {plate > 0.004 ? (
        <Loop durationInFrames={APOLLO_LOOP}>
          <ApolloPass brightness={plate} />
        </Loop>
      ) : (
        <AbsoluteFill style={{ backgroundColor: "#000" }} />
      )}
      <AbsoluteFill style={{ background: "linear-gradient(transparent 55%, rgba(5,14,24,0.72))" }} />
      {/* on the picture from its first frame: this is Apollo 11. The tag goes with the film - down while it is dimmed
          under the drawn path (the credit chip says "over Apollo 11 film" then), gone for Voyager, back for the hand-off */}
      <PillTag x={160} y={232} size={26} opacity={clamp01((plate - 0.2) / 0.65)}>shown: Apollo 11 · NASA film</PillTag>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* lines 2-3: drawn stars sliding back past Voyager */}
        <g opacity={voyage}>
          {STARS.map((st, i) => (
            <circle key={i} cx={(((st.x - st.v * frame) % 1920) + 1920) % 1920} cy={(st.y + 0.45 * st.v * frame) % 1080} r={st.r} fill={B.paper} opacity={0.35 + 0.5 * rnd(i, 5)} />
          ))}
        </g>
        <g opacity={drawing}>
          <g transform={`translate(${(200 * (1 - s)).toFixed(2)} ${(960 * (1 - s)).toFixed(2)}) scale(${s.toFixed(4)})`}>
            <circle cx={400} cy={900} r={260} fill="#12324A" stroke="#4FA3CF" strokeWidth={4} />
            {p > 0 ? <path d={escTrail(Math.min(1, p))} stroke={B.gauge} strokeWidth={8} fill="none" strokeLinecap="round" /> : null}
            {others.map((o, j) => (o < 0 ? null : <circle key={j} cx={escAt(o)[0]} cy={escAt(o)[1]} r={9} fill={B.paper} opacity={0.85 * (1 - ease(frame, voyagerAt, 12))} />))}
          </g>
          {/* Voyager's own track, from the end of the escape path to the craft, dashes running outward */}
          {frame >= nameAt ? <line x1={pathEnd[0]} y1={pathEnd[1]} x2={craft[0]} y2={craft[1]} stroke={B.gauge} strokeWidth={6} strokeDasharray="14 12" strokeDashoffset={-frame * 1.2} /> : null}
          {radio > 0 && radio < 1 ? <circle cx={pathEnd[0] + (craft[0] - pathEnd[0]) * radio} cy={pathEnd[1] + (craft[1] - pathEnd[1]) * radio} r={13} fill="none" stroke={B.aqua} strokeWidth={5} /> : null}
          <circle cx={craft[0]} cy={craft[1]} r={14} fill={B.paper} opacity={ease(frame, discAt, 8)} />
        </g>
      </svg>
      {/* line 0: under the path (which passes y ≈ 553 at x 716), ending at x 1390 - clear of the gauge; gone when line 1 starts */}
      <PillTag x={716} y={585} opacity={ease(frame, slowAt, 8) * (1 - ease(frame, everAt, 8))} color={B.gauge}>
        slowed by gravity<On at={neverAt}> · never stopped</On>
      </PillTag>
      {/* line 1: the destinations, each as it is named, then the point of the line */}
      <Tag x={716} y={600} size={28} opacity={ease(frame, destAt[0], 8) * (1 - ease(frame, voyagerAt, 8))} color={B.paper}>
        the Moon<On at={destAt[1]}> · Mars</On>
        <On at={destAt[2]}> · the outer planets</On>
      </Tag>
      <Tag x={716} y={646} size={28} opacity={ease(frame, crossAt, 8) * (1 - ease(frame, voyagerAt, 8))} color={B.gauge}>all had to cross this line</Tag>
      <div style={{ position: "absolute", left: 160, top: 300, opacity: ease(frame, 0, 12) * (1 - ease(frame, voyagerAt, 8)) }}>
        <NumberCard x={0} y={0} big="11.2 km/s" small="≈ 40,300 KM/H · ESCAPE VELOCITY" size={96} />
      </div>
      {/* lines 2-3, on black: beside the craft, which now sits at the end of the path (1400, 300) */}
      <Tag x={740} y={232} opacity={ease(frame, nameAt, 10) * (1 - ease(frame, teaseAt, 8))} color={B.gauge}>
        Voyager 1<On at={leftAt}> · left Earth 5 Sep 1977</On>
      </Tag>
      <CueCard
        x={160}
        y={300}
        size={96}
        opacity={ease(frame, speedAt, 12) * (1 - ease(frame, teaseAt, 8))}
        big="17 km/s"
        small={
          <>
            VOYAGER 1<On at={sunRelAt}> · RELATIVE TO THE SUN</On>
          </>
        }
      />
      {/* below the track (it passes y ≈ 652 at x 760 and climbs to the right), short of the gauge */}
      <NumberCard x={700} y={700} big="in interstellar space" small="OUT BEYOND THE PLANETS" size={56} color={B.paper} opacity={ease(frame, starsAt, 10) * (1 - ease(frame, lightDayAt, 8))} />
      <CueCard
        x={700}
        y={700}
        size={72}
        color={B.paper}
        opacity={ease(frame, dayAt, 10) * (1 - ease(frame, teaseAt, 8))}
        big="about 1 light-day out"
        small={
          <>
            <On at={radioAt}>A RADIO MESSAGE</On>
            <On at={fullDayAt}> TAKES A FULL DAY</On>
          </>
        }
      />
      {/* line 4: after "Ten levels up. Two to go."; the gold words wait for "ever made" */}
      <div style={{ opacity: ease(frame, within(t, 4, 0.3), 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          next: the fastest thing we have <span style={{ color: B.gauge, ...hold(frame, within(t, 4, 0.8)) }}>ever made</span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * 11 · The fastest thing ever built, 700,000 km/h. Lines 0-7. Sources #13, #14, #30. Plate: Goddard trailer (visualisation).
 * 0 intro · 1 closest pass, 430,000 mph · 2 Philadelphia → Washington in a second · 3 the 11 cm shield, ≈1,400 °C face
 * · 4 ≈30 °C behind it · 5 fastest object ever; straighten the gauge · 6 0.06 % of c · 7 "One level left."
 * The clip is a NASA animation of the probe near Earth, and says so on the picture for the whole rung; it sits at 0.2
 * under the two drawings (the shield, the straight gauge).
 */
export const Parker: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const launchedAt = within(t, 0, 0.22); // "Launched in 2018"
  const builtAt = within(t, 0, 0.43); // "built to fly through the outer atmosphere of the Sun"
  const passAt = within(t, 1, 0.05); // "On Christmas Eve, 2024"
  const closestAt = within(t, 1, 0.2); // "its closest pass yet"
  const milesAt = within(t, 1, 0.3); // "just under four million miles above the Sun's surface"
  const speedAt = within(t, 1, 0.62); // "four hundred and thirty thousand miles an hour"
  const kmhAt = within(t, 1, 0.86); // "About seven hundred thousand kilometres an hour"
  const phillyAt = within(t, 2, 0.45); // "from Philadelphia"
  const dcAt = within(t, 2, 0.62); // "to Washington, D.C."
  const secAt = within(t, 2, 0.78); // "in one second"
  const shieldAt = lineAt(t, 3);
  const starAt = within(t, 3, 0.08); // "that close to a star"
  const slabAt = within(t, 3, 0.21); // "a shield"
  const cmAt = within(t, 3, 0.3); // "about eleven centimetres thick"
  const panelsAt = within(t, 3, 0.41); // "two carbon panels"
  const foamAt = within(t, 3, 0.55); // "a core of carbon foam"
  const hotAt = within(t, 3, 0.64); // "The face pointed at the Sun"
  const tempAt = within(t, 3, 0.82); // "nearly fourteen hundred degrees Celsius"
  const coolAt = within(t, 4, 0.02); // "The instruments behind it"
  const thirtyAt = within(t, 4, 0.42); // "around thirty"
  const fastestAt = lineAt(t, 5);
  const gaugeAt = within(t, 5, 0.35); // "And now straighten the gauge out."
  const tricksAt = within(t, 5, 0.7); // "with no tricks of scale"
  const registersAt = within(t, 5, 0.87); // "it barely registers"
  const lensAt = within(t, 6, 0.06);
  const pctAt = within(t, 6, 0.6); // "six hundredths of one per cent" is being said
  const oneAt = lineAt(t, 7);
  // the needle climbs while the speed is spoken and reaches 692,000 km/h (430,000 mph, #13) on "seven hundred thousand kilometres"
  const sweep = smooth(frame, speedAt, within(t, 1, 0.9));
  const kmh = sweep <= 0 ? ESCAPE_KMH : sweep >= 1 ? 692000 : logLerp(ESCAPE_KMH, 692000, sweep);
  const shield = ease(frame, shieldAt, 12) * (1 - ease(frame, fastestAt, 8));
  const hot = ease(frame, hotAt, 30);
  const zoom = ease(frame, gaugeAt, 15) * (1 - ease(frame, oneAt, 10));
  // line 2: the dot crosses in exactly one second (30 frames), then again
  const cross = frame < secAt ? 0 : clamp01(((frame - secAt) % 40) / 30);
  // Parker's share of the straight gauge: 692,000 / c = 0.064 % (#14) - 0.77 px of 1,200, drawn as 1 px; and of its first 1 %
  const share = 692000 / C_KMH;
  return (
    <RungShell
      t={t}
      index={10}
      kmh={kmh}
      reading={kmh <= ESCAPE_KMH ? ESCAPE_READING : undefined}
      plate={{ clip: "parker-trailer", seconds: 12 }}
      brightness={0.8 - 0.6 * Math.max(shield, zoom)}
      credit="visualisation"
      drawn={{ label: frame < fastestAt ? "the heat shield, drawn · not to scale" : "the gauge, drawn as a straight line", opacity: Math.max(shield, zoom) }}
      sub={kmh <= ESCAPE_KMH ? "11.2 km/s · escape velocity" : kmh > 690000 ? "≈ 192 km/s · 24 Dec 2024" : " "}
    >
      {/* on the picture for the whole rung: an animation, and of the probe near Earth - not film, and not the pass at the Sun */}
      <PillTag x={160} y={228} size={26} opacity={1 - Math.max(shield, zoom)}>NASA visualisation, not footage · shown near Earth</PillTag>
      {/* line 0: who this is */}
      <CueCard
        x={160}
        y={300}
        size={72}
        opacity={ease(frame, within(t, 0, 0.02), 12) * (1 - ease(frame, lineAt(t, 1), 8))}
        big="Parker Solar Probe"
        small={
          <>
            <On at={launchedAt}>LAUNCHED 2018</On>
            <On at={builtAt}> · BUILT TO FLY THROUGH THE SUN'S OUTER ATMOSPHERE</On>
          </>
        }
      />
      {/* line 1, first half: the pass (3.8 million miles, #13 - "just under four million") */}
      <CueCard
        x={160}
        y={300}
        size={64}
        color={B.paper}
        opacity={ease(frame, passAt, 10) * (1 - ease(frame, speedAt - 8, 8))}
        big="Christmas Eve, 2024"
        small={
          <>
            <On at={closestAt}>CLOSEST PASS YET</On>
            <On at={milesAt}> · JUST UNDER 4 MILLION MILES ABOVE THE SUN'S SURFACE</On>
          </>
        }
      />
      {/* line 1, second half, and line 2: the speed, then NASA's comparison */}
      <div style={{ opacity: 1 - ease(frame, shieldAt, 8) }}>
        <CueCard
          x={160}
          y={300}
          size={90}
          opacity={ease(frame, speedAt, 12)}
          big="430,000 mph"
          small={
            <>
              CLOSEST PASS · 24 DEC 2024<On at={kmhAt}> · ≈ 700,000 KM/H</On>
            </>
          }
        />
        <div style={{ position: "absolute", left: 160, top: 462, width: 1100, boxSizing: "border-box", padding: "12px 22px 14px", borderRadius: 16, background: B.paper, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)", opacity: ease(frame, phillyAt, 10) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: F.headline, fontSize: 52, lineHeight: 1, whiteSpace: "nowrap" }}>
            <span>Philadelphia</span>
            <div style={{ flex: 1, position: "relative", height: 52, ...hold(frame, dcAt) }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 23, height: 6, borderRadius: 3, background: "rgba(11,27,43,0.22)" }} />
              <div style={{ position: "absolute", left: 0, top: 23, height: 6, borderRadius: 3, width: `${(cross * 100).toFixed(2)}%`, background: B.teaseInk }} />
              <div style={{ position: "absolute", left: `${(cross * 100).toFixed(2)}%`, top: 14, width: 24, height: 24, marginLeft: -12, borderRadius: 12, background: B.teaseInk, opacity: frame >= secAt ? 1 : 0 }} />
            </div>
            <span style={hold(frame, dcAt)}>Washington, D.C.</span>
          </div>
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 22, lineHeight: 1.2, marginTop: 6, letterSpacing: 1, whiteSpace: "nowrap" }}>
            NASA'S COMPARISON<On at={secAt}> · IN ONE SECOND</On>
          </div>
        </div>
      </div>
      {/* lines 3-4: the heat shield in cross-section, built up as it is described - the Sun, the slab, its two panels, its core, the heat, the instruments */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: shield }}>
        <g transform="translate(700 620)">
          <g opacity={ease(frame, starAt, 12)}>
            <circle cx={-250} cy={140} r={150 + 6 * Math.sin(frame / 11)} fill="#FF7A45" opacity={0.25 + 0.35 * hot} />
            <circle cx={-250} cy={140} r={90 + 3 * Math.sin(frame / 7)} fill="#FFB347" opacity={0.6 + 0.4 * hot} />
          </g>
          {/* the heat, streaming from the Sun and stopping at the front face */}
          <g opacity={hot}>
            {[40, 90, 140, 190, 240].map((y) => (
              <line key={y} x1={-150} y1={y} x2={-6} y2={y} stroke="#FF7A45" strokeWidth={5} strokeDasharray="18 14" strokeDashoffset={-frame * 2.5} />
            ))}
          </g>
          <rect x={0} y={0} width={96} height={280} fill="#2A2622" stroke="#E8E2D6" strokeWidth={3} opacity={ease(frame, slabAt, 10)} />
          {/* "about eleven centimetres thick": the thickness, bracketed */}
          <g opacity={ease(frame, cmAt, 8)} stroke={B.paper} strokeWidth={4}>
            <line x1={0} y1={-18} x2={96} y2={-18} />
            <line x1={0} y1={-28} x2={0} y2={-8} />
            <line x1={96} y1={-28} x2={96} y2={-8} />
          </g>
          {/* front panel · foam core · back panel */}
          <g opacity={ease(frame, panelsAt, 10)}>
            <rect x={0} y={0} width={16} height={280} fill="#E8E2D6" />
            <rect x={80} y={0} width={16} height={280} fill="#E8E2D6" />
          </g>
          <rect x={16} y={0} width={64} height={280} fill="#5A5248" opacity={ease(frame, foamAt, 10)} />
          <rect x={0} y={0} width={16} height={280} fill="#FF7A45" opacity={0.85 * hot} />
          {/* the instruments, in the shadow */}
          <rect x={150} y={80} width={130} height={120} rx={12} fill="#12324A" stroke={B.aqua} strokeWidth={4} opacity={ease(frame, coolAt, 10)} />
        </g>
      </svg>
      {/* right of the bracket, clear of the ≈ 30 °C card (which ends at x ≈ 730) */}
      <Tag x={812} y={584} color={B.paper} opacity={shield * ease(frame, cmAt, 8)}>≈ 11 cm</Tag>
      <Tag x={420} y={915} color={B.paper} opacity={shield * ease(frame, panelsAt, 8)}>
        two carbon panels<On at={foamAt}> · carbon-foam core</On>
      </Tag>
      <Tag x={935} y={830} color={B.aqua} align="center" opacity={shield * ease(frame, coolAt, 10)}>instruments</Tag>
      <div style={{ position: "absolute", left: 160, top: 300, opacity: shield }}>
        <NumberCard x={0} y={0} big="≈ 1,377 °C" small="SUN-FACING FACE · NEARLY 2,500 °F" size={90} color="#FF7A45" opacity={ease(frame, tempAt, 10)} />
        <NumberCard x={0} y={160} big="≈ 30 °C" small="BEHIND THE SHIELD · ABOUT 85 °F" size={80} color={B.aqua} opacity={frame >= thirtyAt ? ease(frame, thirtyAt, 10) : 0} />
      </div>
      {/* line 5, first sentence: back on the picture */}
      <CueCard x={160} y={300} size={72} opacity={ease(frame, within(t, 5, 0.12), 10) * (1 - ease(frame, gaugeAt - 6, 8))} big="the fastest object ever built" />
      {/* lines 5-6: the whole gauge unrolled as a plain line, Parker's 1 px at its left end, then its first 1 % magnified */}
      <div style={{ position: "absolute", left: 160, top: 300, width: 1200, opacity: zoom }}>
        <Tag x={0} y={0} color={B.mute}>
          the gauge, drawn straight · walk → c<On at={tricksAt}> · no tricks of scale</On>
        </Tag>
        <div style={{ position: "absolute", left: 0, top: 44, width: 1200 * ease(frame, gaugeAt, 50), height: 40, borderRadius: 20, background: "rgba(255,255,255,0.14)", outline: "3px solid rgba(255,255,255,0.5)" }} />
        <Tag x={1200} y={96} color={B.tease} align="right" opacity={ease(frame, gaugeAt + 44, 8)}>c</Tag>
        {frame >= registersAt ? (
          <>
            <div style={{ position: "absolute", left: 0, top: 44, width: 1, height: 40, background: B.gauge }} />
            {/* a ring to find it by */}
            <div style={{ position: "absolute", left: 0.5 - (15 + 5 * Math.sin(frame / 5)), top: 64 - (15 + 5 * Math.sin(frame / 5)), width: 2 * (15 + 5 * Math.sin(frame / 5)), height: 2 * (15 + 5 * Math.sin(frame / 5)), boxSizing: "border-box", borderRadius: "50%", border: `3px solid ${B.gauge}`, opacity: ease(frame, registersAt, 8) }} />
            {/* under the left end until the lens lines are drawn through this spot; the name then moves to the magnified bar */}
            <Tag x={16} y={96} color={B.gauge} opacity={ease(frame, registersAt, 8) * (1 - ease(frame, lensAt, 8))}>Parker</Tag>
          </>
        ) : null}
        {/* line 6: the first 1 % of the line (12 px), stretched to the full width - Parker fills 6.4 % of it */}
        <div style={{ opacity: ease(frame, lensAt, 10) }}>
          <svg width={1200} height={300} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <rect x={0} y={40} width={12} height={48} fill="none" stroke={B.aqua} strokeWidth={3} />
            <line x1={0} y1={88} x2={0} y2={180} stroke={B.aqua} strokeWidth={3} />
            <line x1={12} y1={88} x2={1200} y2={180} stroke={B.aqua} strokeWidth={3} />
          </svg>
          <div style={{ position: "absolute", left: 0, top: 180, width: 1200, height: 40, borderRadius: 6, background: "rgba(255,255,255,0.14)", outline: `3px solid ${B.aqua}` }} />
          <div style={{ position: "absolute", left: 0, top: 180, width: 1200 * share * 100 * smooth(frame, within(t, 6, 0.15), within(t, 6, 0.5)), height: 40, background: B.gauge }} />
          {/* inside the magnified bar, just right of Parker's 77 px */}
          <Tag x={92} y={182} color={B.gauge} opacity={ease(frame, within(t, 6, 0.5), 8)}>Parker</Tag>
          <Tag x={0} y={232} color={B.aqua}>the first 1 % of the line · magnified 100 times</Tag>
        </div>
        <NumberCard x={0} y={290} big="≈ 0.06 % of c" small="THE FASTEST THING WE HAVE EVER MADE" size={80} opacity={ease(frame, pctAt, 10)} />
      </div>
      <div style={{ opacity: ease(frame, oneAt, 8) }}>
        <CaptionPop bottom={150} size={90}>one level left</CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * 12 · The limit, c. Lines 0-8. Sources #16, #19, #25, #31.
 * 0 "7.5 laps in a second" · 1 Moon 1.3 s, Sun 8 min 20 s · 2 three days vs "light" · 3 Proxima Centauri, 4.25 ly
 * · 4 "That's how big the gaps are." · 5 the speed limit · 6 the metre is defined from it · 7 299,792,458 m/s exactly
 * · 8 never accelerated.
 */
/** the drawn gap to the next star: the Sun at x 220, Proxima 4.25 light-years (#31) along at x 1340 - short of the gauge */
const GAP = { x0: 220, x1: 1340, y: 640, ly: 4.25 };
/** frames for light to cross from the Earth to the Moon: 1.3 s (#25) at 30 fps */
const MOON_FRAMES = Math.round(1.3 * FPS);

export const Light: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const revealAt = Math.round(t.lines[0].at + 0.2 * t.lines[0].audioFrames);
  const saidAt = within(t, 0, 0.5); // "...kilometres every second" has been said
  const vacuumAt = within(t, 0, 0.52); // "The speed of light in a vacuum."
  const aroundAt = within(t, 0, 0.7); // "Seven and a half times around the Earth"
  const moonAt = lineAt(t, 1);
  const moonSaidAt = within(t, 1, 0.14); // "the Moon is one point three seconds away"
  const sunAt = within(t, 1, 0.45); // "The Sun is eight minutes and twenty seconds away"
  const faceAt = within(t, 1, 0.72); // "the sunlight on your face left the Sun before you started this level"
  const daysAt = within(t, 2, 0.4); // "about three days"
  const proximaAt = lineAt(t, 3);
  const starAt = within(t, 3, 0.23); // "Proxima Centauri"
  const lyAt = within(t, 3, 0.36); // "four and a quarter light-years away"
  const topAt = within(t, 3, 0.5); // "Even at the top of this gauge"
  const tripAt = within(t, 3, 0.9); // "a four-year trip"
  const gapsAt = lineAt(t, 4);
  const limitAt = lineAt(t, 5);
  const nothingAt = within(t, 5, 0.44); // "Nothing —"
  const noAt = [within(t, 5, 0.52), within(t, 5, 0.62), within(t, 5, 0.71)]; // "no matter" · "no energy" · "no message"
  const fasterAt = within(t, 5, 0.8); // "can travel faster than this"
  const metreAt = lineAt(t, 6);
  const defineAt = within(t, 6, 0.7); // "we define the metre from it"
  const exactAt = lineAt(t, 7);
  const neverAt = lineAt(t, 8);
  const slowerAt = within(t, 8, 0.61); // "It cannot go slower."
  const accAt = within(t, 8, 0.76); // "It has never accelerated in its life."
  // the needle leaves rung 11's 692,000 km/h and reaches c exactly as the number has been read out
  const kmh = logLerp(692000, C_KMH, smooth(frame, lineAt(t, 0), saidAt));
  // line 0: the laps are run at one steady rate - light does not speed up
  const laps = 7.5 * lin(frame, aroundAt + 6, aroundAt + 81);
  const lapsOn = ease(frame, aroundAt, 10) * (1 - ease(frame, moonAt, 8));
  const lapA = 2 * Math.PI * laps;
  // lines 1-2: a pulse of light crosses from the Earth to the Moon in real time - 39 frames - again and again
  const moonF = frame < moonSaidAt ? -1 : (frame - moonSaidAt) % 60;
  // lines 3-4: the gap; the pulse leaves the Sun on "Even at the top of this gauge" and arrives under "That's how big the gaps are."
  const gap = ease(frame, proximaAt, 12) * (1 - ease(frame, limitAt, 8));
  const gapX = (k: number) => GAP.x0 + (GAP.x1 - GAP.x0) * k;
  const pulse = lin(frame, topAt, gapsAt + 30);
  // line 5: three things run at the line and none of them reaches it
  const race = ease(frame, nothingAt, 12) * (1 - ease(frame, metreAt, 8));
  const ruler = ease(frame, defineAt + 10, 10) * (1 - ease(frame, neverAt, 8));
  const cam = camera(frame, [
    [0, 1.0, 30, 50],
    [aroundAt, 1.06, 35, 50],
    [moonAt, 1.04, 50, 45],
    [faceAt, 1.14, 52, 30],
    [proximaAt, 1.08, 45, 40],
    [limitAt, 1.02, 50, 50],
    [nothingAt, 1.12, 40, 60],
    [metreAt, 1.06, 55, 45],
    [exactAt, 1.03, 50, 50],
    [neverAt, 1.05, 50, 40],
    [t.frames, 1.15, 52, 30],
  ]);
  return (
    <RungShell
      t={t}
      index={11}
      kmh={kmh}
      plate={{ image: "sun-sdo" }}
      plateMove={cam}
      brightness={0.55 - 0.35 * Math.max(gap, race)}
      credit={{ kind: "real", source: "NASA/SDO · the Sun, 2010" }}
      drawn={{ label: frame < moonAt ? "the Earth and the laps, drawn" : frame < limitAt ? "the gap to the next star, drawn · distances to scale" : "the speed limit, drawn", opacity: Math.max(lapsOn, gap, race) }}
      revealAt={revealAt}
      sub={frame < vacuumAt ? " " : frame < within(t, 7, 0.95) ? "the speed of light" : "299,792,458 m/s · exactly"}
      teaseFrom={t.frames + 1}
    >
      {/* line 0: the number, a group of digits at a time as it is read; it leaves before the Earth is drawn in its place */}
      <CueCard
        x={160}
        y={300}
        size={110}
        opacity={ease(frame, within(t, 0, 0.06), 10) * (1 - ease(frame, aroundAt - 10, 10))}
        big={
          <>
            299,<On at={within(t, 0, 0.22)}>792</On>
            <On at={within(t, 0, 0.4)}> km/s</On>
          </>
        }
        small={<On at={vacuumAt}>THE SPEED OF LIGHT IN A VACUUM</On>}
      />
      {/* seven and a half laps of Earth in one second */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: lapsOn }}>
        <circle cx={430} cy={600} r={220} fill="#12324A" stroke="#4FA3CF" strokeWidth={4} />
        <circle cx={430} cy={600} r={250} fill="none" stroke={B.gauge} strokeWidth={8} strokeDasharray={`${2 * Math.PI * 250}`} strokeDashoffset={2 * Math.PI * 250 * (1 - Math.min(1, laps % 1 || (laps > 0 ? 1 : 0)))} transform="rotate(-90 430 600)" />
        <circle cx={430 + 250 * Math.sin(lapA)} cy={600 - 250 * Math.cos(lapA)} r={13} fill={B.paper} />
      </svg>
      <div style={{ position: "absolute", left: 712, top: 520, opacity: ease(frame, aroundAt + 6, 10) * (1 - ease(frame, moonAt, 8)) }}>
        <NumberCard x={0} y={0} big={`${laps.toFixed(1)} laps`} small="AROUND THE EARTH · IN ONE SECOND" size={90} />
      </div>
      {/* lines 1-2: the Moon, the real-time crossing, the Sun, the astronauts - each on its words */}
      <div style={{ opacity: 1 - ease(frame, proximaAt, 8) }}>
        <CueCard x={160} y={300} size={72} opacity={ease(frame, moonSaidAt, 12)} big="Moon · 1.3 s" small="EARTH TO THE MOON · AT THE SPEED OF LIGHT" />
        <div style={{ position: "absolute", left: 160, top: 436, width: 860, height: 56, borderRadius: 28, background: "rgba(5,14,24,0.9)", opacity: ease(frame, moonSaidAt + 6, 10) }}>
          <div style={{ position: "absolute", left: 22, top: 14, fontFamily: F.ui, fontWeight: 800, fontSize: 22, lineHeight: "28px", letterSpacing: 1.5, color: B.aqua }}>EARTH</div>
          <div style={{ position: "absolute", left: 108, top: 14, width: 28, height: 28, borderRadius: 14, background: B.aqua }} />
          <div style={{ position: "absolute", left: 136, top: 26, width: 604, height: 4, background: "rgba(255,255,255,0.3)" }} />
          <div style={{ position: "absolute", left: 740, top: 20, width: 16, height: 16, borderRadius: 8, background: B.paper }} />
          <div style={{ position: "absolute", left: 768, top: 14, fontFamily: F.ui, fontWeight: 800, fontSize: 22, lineHeight: "28px", letterSpacing: 1.5, color: B.paper }}>MOON</div>
          {moonF >= 0 && moonF <= MOON_FRAMES ? <div style={{ position: "absolute", left: 136 + (604 * moonF) / MOON_FRAMES - 12, top: 22, width: 24, height: 12, borderRadius: 6, background: B.gauge, boxShadow: `0 0 14px ${B.gauge}` }} /> : null}
        </div>
        <Tag x={1040} y={448} size={26} color={B.gauge} opacity={ease(frame, moonSaidAt + 6, 10)}>light · in real time</Tag>
        <CueCard x={160} y={520} size={72} color={B.paper} opacity={ease(frame, sunAt, 10)} big="Sun · 8 min 20 s" small={<On at={faceAt}>THE LIGHT ON YOUR FACE LEFT BEFORE THIS LEVEL STARTED</On>} />
        <NumberCard x={160} y={660} big="astronauts: about 3 days" small="THE SAME TRIP TO THE MOON" size={64} color={B.aqua} opacity={frame >= daysAt ? ease(frame, daysAt, 10) : 0} />
      </div>
      {/* lines 3-4: the gap to the next star - the line reaches out to Proxima, then a pulse of light sets off and takes four years over it */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: gap }}>
        <line x1={GAP.x0} y1={GAP.y} x2={gapX(lin(frame, within(t, 3, 0.1), starAt))} y2={GAP.y} stroke="rgba(255,255,255,0.4)" strokeWidth={4} />
        <circle cx={GAP.x0} cy={GAP.y} r={22} fill="#FFB347" />
        <circle cx={GAP.x1} cy={GAP.y} r={12} fill={B.paper} opacity={ease(frame, starAt, 8)} />
        {/* one tick per light-year, lit as the pulse passes it */}
        {[1, 2, 3, 4].map((y) => (
          <line key={y} x1={gapX(y / GAP.ly)} y1={GAP.y - 14} x2={gapX(y / GAP.ly)} y2={GAP.y + 14} stroke={pulse >= y / GAP.ly ? B.gauge : "rgba(255,255,255,0.4)"} strokeWidth={4} opacity={ease(frame, topAt, 8)} />
        ))}
        {frame >= topAt ? (
          <>
            <line x1={GAP.x0} y1={GAP.y} x2={gapX(pulse)} y2={GAP.y} stroke={B.gauge} strokeWidth={8} strokeLinecap="round" />
            <circle cx={gapX(pulse)} cy={GAP.y} r={12} fill={B.gauge} />
          </>
        ) : null}
      </svg>
      {[1, 2, 3, 4].map((y) => (pulse >= y / GAP.ly ? <Tag key={y} x={gapX(y / GAP.ly)} y={590} size={26} align="center" color={B.gauge} opacity={gap}>{`${y} yr`}</Tag> : null))}
      <Tag x={GAP.x0} y={670} color={B.paper} opacity={gap * ease(frame, within(t, 3, 0.03), 8)}>the Sun</Tag>
      <Tag x={GAP.x1} y={670} color={B.paper} align="right" opacity={gap * ease(frame, starAt, 8)}>Proxima Centauri</Tag>
      <Tag x={300} y={500} color={B.gauge} opacity={gap * ease(frame, topAt, 10)}>
        even at the top of the gauge<On at={tripAt}> · a four-year trip</On>
      </Tag>
      <NumberCard x={160} y={300} big="4.25 light-years" small="PROXIMA CENTAURI · THE NEAREST STAR AFTER THE SUN" size={90} opacity={gap * ease(frame, lyAt, 10)} />
      <div style={{ opacity: ease(frame, gapsAt, 8) * (1 - ease(frame, limitAt, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>that's how big the gaps are</CaptionPop>
      </div>
      {/* line 5: the limit, then the three things that cannot pass it, each sent at the line as it is named */}
      <CueCard x={160} y={300} size={72} opacity={ease(frame, within(t, 5, 0.17), 10) * (1 - ease(frame, metreAt, 8))} big="the speed limit of the universe" />
      <div style={{ position: "absolute", inset: 0, opacity: race }}>
        <Tag x={1320} y={432} color={B.tease} align="right">the speed of light</Tag>
        <div style={{ position: "absolute", left: 1296, top: 476, width: 8, height: 214, borderRadius: 4, background: B.tease, boxShadow: `0 0 ${16 + 8 * Math.sin(frame / 6)}px ${B.tease}` }} />
        {["no matter", "no energy", "no message"].map((name, j) => {
          if (frame < noAt[j]) return null;
          const y = 520 + 65 * j;
          // closes on the line for ever and never arrives (stops 28 px short of it)
          const x = 400 + 868 * (1 - Math.exp(-(frame - noAt[j]) / 20));
          return (
            <React.Fragment key={name}>
              <Tag x={160} y={y - 18} color={B.paper} opacity={ease(frame, noAt[j], 8)}>{name}</Tag>
              <div style={{ position: "absolute", left: 400, top: y - 3, width: x - 400, height: 6, borderRadius: 3, background: B.gauge }} />
              <div style={{ position: "absolute", left: x - 12, top: y - 12, width: 24, height: 24, borderRadius: 12, background: B.gauge }} />
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ opacity: ease(frame, fasterAt, 10) * (1 - ease(frame, metreAt, 8)) }}>
        <CaptionPop bottom={150} size={88} color={B.tease}>nothing passes this line</CaptionPop>
      </div>
      {/* line 6: not measured any more - the metre is what is defined (BIPM, #16); light sweeping a metre bar, over and over */}
      <div style={{ opacity: 1 - ease(frame, exactAt, 8) }}>
        <CueCard x={160} y={300} size={72} color={B.paper} opacity={ease(frame, within(t, 6, 0.3), 10)} big="no longer measured" />
        <CueCard x={160} y={440} size={72} opacity={frame >= defineAt ? ease(frame, defineAt, 10) : 0} big="the metre is defined from it" />
      </div>
      <div style={{ position: "absolute", left: 160, top: 590, width: 860, height: 56, borderRadius: 28, background: "rgba(5,14,24,0.9)", opacity: ruler }}>
        <div style={{ position: "absolute", left: 30, top: 26, width: 800, height: 4, background: B.paper }} />
        <div style={{ position: "absolute", left: 28, top: 12, width: 4, height: 32, background: B.paper }} />
        <div style={{ position: "absolute", left: 828, top: 12, width: 4, height: 32, background: B.paper }} />
        {frame % 24 <= 12 ? <div style={{ position: "absolute", left: 30 + (800 * (frame % 24)) / 12 - 12, top: 22, width: 24, height: 12, borderRadius: 6, background: B.gauge, boxShadow: `0 0 14px ${B.gauge}` }} /> : null}
      </div>
      <Tag x={1040} y={602} size={26} color={B.paper} opacity={ruler}>the metre</Tag>
      {/* line 7: the exact figure, three digits at a time as it is read */}
      <CueCard
        x={160}
        y={300}
        size={110}
        color={B.paper}
        opacity={ease(frame, within(t, 7, 0.04), 10) * (1 - ease(frame, neverAt, 8))}
        big={
          <>
            299,<On at={within(t, 7, 0.3)}>792,</On>
            <On at={within(t, 7, 0.62)}>458</On>
            <On at={within(t, 7, 0.82)}> m/s</On>
          </>
        }
        small={
          <>
            THE METRE IS DEFINED FROM IT<On at={within(t, 7, 0.93)}> · EXACTLY</On>
          </>
        }
      />
      {/* line 8: the ladder point first, then the two short sentences, the second on its own words */}
      <CueCard x={160} y={300} size={72} opacity={ease(frame, within(t, 8, 0.08), 10) * (1 - ease(frame, slowerAt - 8, 8))} big="the only thing on this ladder" small={<On at={within(t, 8, 0.36)}>THAT DOESN'T HAVE TO WORK FOR ITS SPEED</On>} />
      <div style={{ opacity: ease(frame, slowerAt, 10) }}>
        <CaptionPop bottom={150} size={74} color={B.paper}>
          light cannot go slower
          <br />
          <span style={hold(frame, accAt)}>
            it has never <span style={{ color: B.gauge }}>accelerated</span>
          </span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * Closer. Lines 0-3. 0 the twelve tiles as recap, each lit (and the needle sent to its speed) as it is named · 1 "A probe
 * that touches the Sun." · 2 "And at the top, a line nothing crosses." - the gauge drawn straight, its c end lit ·
 * 3 "So - that walk you started on?" - the needle rewinds from c to 5 km/h and the walk is a sliver at the left end.
 */
/** where in line 0 each level is named, and which tile it is: a walk · a sprint · a cat · a car · a plane (the X-15) · a station */
const RECAP: [number, number][] = [
  [0.08, 0],
  [0.12, 1],
  [0.27, 2],
  [0.46, 3],
  [0.585, 6],
  [0.81, 8],
];

export const Closer: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const lineAtTop = lineAt(t, 2);
  const walkAt = lineAt(t, 3);
  const mmAt = within(t, 3, 0.27); // "Everything you have ever felt as fast"
  const firstAt = within(t, 3, 0.72); // "lives inside the first millimetre"
  // lines 0-1: the tile being named, and the one before it ("A probe that touches the Sun" is tile 11)
  const steps: [number, number][] = [...RECAP.map(([f, i]) => [within(t, 0, f), i] as [number, number]), [lineAt(t, 1), 10]];
  let step = -1;
  for (let j = 0; j < steps.length; j++) if (frame >= steps[j][0]) step = j;
  const lit = step < 0 ? -1 : steps[step][1];
  const from = step > 0 ? LEVELS_REVEALED[steps[step - 1][1]].kmh : 5;
  // the needle climbs with the recap, reaches c on line 2, then rewinds to a walk on the callback line
  const rewind = ease(frame, walkAt, 60);
  const kmh = frame < lineAtTop ? (step < 0 ? 5 : logLerp(from, LEVELS_REVEALED[lit].kmh, ease(frame, steps[step][0], 14))) : frame < walkAt ? logLerp(692000, C_KMH, ease(frame, lineAtTop, 20)) : Math.max(5, C_KMH * Math.pow(1 - rewind, 4));
  const cLine = ease(frame, lineAtTop, 12);
  const cOn = ease(frame, lineAtTop + 24, 8);
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 45%, #223A50 0%, #0B1B2B 60%, #050E18 100%)" }} />
      <Speedo kmh={kmh} sub={frame < lineAtTop ? (lit < 0 ? " " : LEVELS_REVEALED[lit].name) : kmh >= C_KMH * 0.999 ? "the speed of light" : kmh < 6 ? "your walking pace" : " "} />
      {/* six columns from x 120 to 1400; a tile is dim until the recap reaches it, and the one being named is ringed and steps forward */}
      <div style={{ position: "absolute", top: 290, left: 120, width: 1300, display: "grid", gridTemplateColumns: "repeat(6, 200px)", gap: 16, opacity: ease(frame, lineAt(t, 0), 12) * (1 - ease(frame, lineAtTop, 10)) }}>
        {LEVELS_REVEALED.map((l, i) => (
          <div key={l.id} style={{ position: "relative", zIndex: i === lit ? 1 : 0, opacity: ease(frame, lineAt(t, 0) + i * 4, 8), transform: i === lit ? `scale(${(1.05 + 0.07 * (1 - ease(frame, steps[step][0], 14))).toFixed(3)})` : undefined }}>
            <Tile level={l} width={200} height={112} labelSize={16} state={i === lit ? "current" : i < lit ? "past" : "future"} />
          </div>
        ))}
      </div>
      {/* the gauge drawn straight: line 2 unrolls it and lights the c end, line 3 adds the walk */}
      <div style={{ position: "absolute", left: 160, top: 400, width: 1200, opacity: cLine }}>
        <div style={{ position: "absolute", left: 0, top: 44, width: 1200 * ease(frame, lineAtTop, 30), height: 40, borderRadius: 20, background: "rgba(255,255,255,0.14)", outline: "3px solid rgba(255,255,255,0.5)" }} />
        <div style={{ position: "absolute", left: 1194, top: 14, width: 8, height: 100, borderRadius: 4, background: B.tease, opacity: cOn, boxShadow: `0 0 ${10 + 18 * (1 - rewind) + 6 * Math.sin(frame / 6)}px ${B.tease}` }} />
        <div style={{ position: "absolute", left: 0, top: 44, width: 2, height: 40, background: B.aqua, opacity: ease(frame, within(t, 3, 0.05), 10) }} />
        <Tag x={0} y={0} color={B.aqua} opacity={ease(frame, within(t, 3, 0.05), 10)}>your walk</Tag>
        <Tag x={1200} y={-30} color={B.tease} align="right" opacity={cOn}>the speed of light</Tag>
        <Tag x={1200} y={126} color={B.paper} align="right" opacity={ease(frame, within(t, 2, 0.4), 8) * (1 - ease(frame, mmAt - 8, 8))}>a line nothing crosses</Tag>
        {/* "the first millimetre": a ring on the left end, where the walk is */}
        {frame >= firstAt ? <div style={{ position: "absolute", left: 1 - (17 + 5 * Math.sin(frame / 5)), top: 64 - (17 + 5 * Math.sin(frame / 5)), width: 2 * (17 + 5 * Math.sin(frame / 5)), height: 2 * (17 + 5 * Math.sin(frame / 5)), boxSizing: "border-box", borderRadius: "50%", border: `3px solid ${B.gauge}`, opacity: ease(frame, firstAt, 8) }} /> : null}
        <div style={{ position: "absolute", left: 0, top: 120, fontFamily: F.caption, fontSize: 44, lineHeight: 1.25, color: B.paper, whiteSpace: "nowrap", opacity: ease(frame, mmAt, 10) }}>
          everything you've ever felt as "fast"
          <br />
          <span style={hold(frame, firstAt)}>
            lives inside the <span style={{ color: B.gauge }}>first millimetre</span>
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 140, bottom: 140, opacity: ease(frame, mmAt + 40, 12) }}>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: B.gauge }}>WATCH NEXT</div>
        <div style={{ fontFamily: F.headline, fontSize: 72, color: B.paper, lineHeight: 1.05, whiteSpace: "nowrap" }}>EVERY LEVEL OF THE OCEAN</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 380, top: 200, textAlign: "center", fontFamily: F.headline, fontSize: 64, letterSpacing: 2, color: B.paper, opacity: ease(frame, 0, 12) * (1 - ease(frame, lineAtTop, 10)) }}>
        TWELVE LEVELS
      </div>
    </AbsoluteFill>
  );
};
