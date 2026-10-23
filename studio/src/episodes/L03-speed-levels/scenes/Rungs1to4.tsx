import React from "react";
import { Img, useCurrentFrame } from "remotion";
import { levelImage } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease, lerp } from "../../../lib/ui";
import { CaptionPop, NumberCard, PillTag, RungShell, Tag } from "./shell";

/** 0-1, linear and clamped: constant-speed travel and slow camera creeps */
const lin = (frame: number, from: number, to: number) => Math.max(0, Math.min(1, (frame - from) / (to - from)));

/**
 * 1 · Walking, 5 km/h. Lines 0-3. Source #1 (5 km/h; the bar's "≈ 15 km/h" is 3 x 5, the row's on-screen note).
 * 0 "Here is the speed you actually live at. About five kilometres an hour." · 1 "...on your own two feet - every
 * school run, every walk to the shops - happened inside a range that runs from here to roughly three times this."
 * · 2 "...the only speed... your body is designed for. Everything above it, we borrowed from an animal, or built."
 * · 3 "Let's start by borrowing."
 */
export const Walking: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const hereIsAt = lineAt(t, 0);
  const fiveAt = within(t, 0, 0.57); // "About five kilometres an hour"
  const feetAt = within(t, 1, 0.18); // "on your own two feet"
  const schoolAt = within(t, 1, 0.31); // "every school run"
  const shopsAt = within(t, 1, 0.42); // "every walk to the shops"
  const rangeAt = within(t, 1, 0.63); // "inside a range"
  const hereAt = within(t, 1, 0.78); // "from here"
  const fillAt = within(t, 1, 0.83); // "to roughly three times this": the fill runs to the bar's right end
  const threeAt = within(t, 1, 0.9); // "three times this"
  const paceAt = lineAt(t, 2);
  const onlyAt = within(t, 2, 0.31); // "the only speed..."
  const designedAt = within(t, 2, 0.61); // "designed for"
  const aboveAt = within(t, 2, 0.68); // "Everything above it"
  const borrowedAt = within(t, 2, 0.81); // "we borrowed"
  const builtAt = within(t, 2, 0.95); // "or built"
  const startAt = lineAt(t, 3); // "Let's start by borrowing."
  const range = ease(frame, fillAt, 36);
  const bar = ease(frame, fiveAt, 12) * (1 - ease(frame, paceAt, 12));
  // line 1's two examples drop into the bar on "happened inside a range", then clear for the fill
  const into = ease(frame, rangeAt, 20);
  const listOut = 1 - ease(frame, hereAt, 10);
  // camera: pinned to the photo's right edge ("100% 32%") at 2.1x or more (2.1x is the 4032-px photo's native size),
  // which keeps the real walker left of the dial and its dark disc for the whole rung. It starts where the cold open
  // ends (2.1), pushes in on "the speed you actually live at", pulls back for "a range", pushes in again for "this
  // pace is astonishing" and opens out on "Everything above it". A linear creep runs under every hold.
  const cam = 2.1 + 0.14 * ease(frame, hereIsAt, 40) + 0.02 * lin(frame, hereIsAt + 40, rangeAt) - 0.14 * ease(frame, rangeAt, 40) + 0.18 * ease(frame, paceAt, 45) + 0.02 * lin(frame, paceAt + 45, aboveAt) - 0.18 * ease(frame, aboveAt, 50) + 0.02 * lin(frame, aboveAt + 50, t.frames);
  // where that camera puts him (at 1x he spans x 1539-1635, y 309-519): the "YOU ARE HERE" pill rides beside his shoulder
  const walkerLeft = 1920 - 381 * cam;
  const shoulderY = 346 + 14 * cam;
  return (
    <RungShell t={t} index={0} kmh={5} plate={{ image: "walker-grassland" }} brightness={0.7} plateMove={{ scale: cam, origin: "100% 32%" }} credit={{ kind: "real", source: "U.S. Forest Service" }} drawn={bar > 0 ? { label: "the bar, drawn", opacity: bar } : undefined} sub="your walking pace">
      {/* "Here is the speed you actually live at": the label sits beside the real walker and follows the camera */}
      <PillTag x={walkerLeft - 24} y={shoulderY - 22} size={28} color={B.gauge} align="right" opacity={ease(frame, hereIsAt, 12)}>
        you are here
      </PillTag>
      {/* the band of speeds a body reaches on its own: outline and the 5 km/h end on "About five kilometres an hour" */}
      <div style={{ position: "absolute", left: 160, top: 380, width: 760, opacity: bar }}>
        <Tag x={0} y={0} color={B.mute} opacity={ease(frame, feetAt, 10)}>
          on your own two feet
        </Tag>
        <div style={{ position: "absolute", left: 0, top: 44, width: 760, height: 40, borderRadius: 20, background: "rgba(255,255,255,0.14)", outline: `${3 + 3 * ease(frame, rangeAt, 10) * (1 - ease(frame, rangeAt + 20, 20))}px solid rgba(255,255,255,${0.5 + 0.5 * ease(frame, rangeAt, 10) * (1 - ease(frame, rangeAt + 20, 20))})` }} />
        <div style={{ position: "absolute", left: 0, top: 44, width: 40 + 720 * range, height: 40, borderRadius: 20, background: B.aqua }} />
        {/* "from here": a ring opens around the 5 km/h end */}
        {frame >= hereAt && frame < hereAt + 24 ? <div style={{ position: "absolute", left: 20 - (20 + 30 * lin(frame, hereAt, hereAt + 24)), top: 64 - (20 + 30 * lin(frame, hereAt, hereAt + 24)), width: 2 * (20 + 30 * lin(frame, hereAt, hereAt + 24)), height: 2 * (20 + 30 * lin(frame, hereAt, hereAt + 24)), borderRadius: "50%", border: `5px solid ${B.aqua}`, boxSizing: "border-box", opacity: 1 - lin(frame, hereAt, hereAt + 24) }} /> : null}
        <Tag x={0} y={96} color={B.aqua}>
          5 km/h · your walk
        </Tag>
        {frame >= threeAt ? (
          <Tag x={760} y={138} color={B.paper} align="right" opacity={ease(frame, threeAt, 10)}>
            ≈ 15 km/h · three times this
          </Tag>
        ) : null}
      </div>
      {/* line 1's examples, each on its words; on "inside a range" they move into the bar */}
      {frame >= schoolAt ? (
        <PillTag x={lerp(160, 172, into)} y={lerp(600, 423, into)} size={26} opacity={ease(frame, schoolAt, 8) * listOut * bar}>
          every school run
        </PillTag>
      ) : null}
      {frame >= shopsAt ? (
        <PillTag x={lerp(160, 488, into)} y={lerp(652, 423, into)} size={26} opacity={ease(frame, shopsAt, 8) * listOut * bar}>
          every walk to the shops
        </PillTag>
      ) : null}
      {/* line 2, first half: "the only speed... your body is designed for" */}
      <div style={{ opacity: ease(frame, onlyAt, 10) * (1 - ease(frame, aboveAt - 6, 6)) }}>
        <CaptionPop bottom={150} size={78} color={B.paper}>
          the only speed your body was <span style={{ color: frame >= designedAt ? B.gauge : B.paper }}>designed</span> for
        </CaptionPop>
      </div>
      {/* line 2, second half, growing with its words; line 3 lights "borrowed" */}
      <div style={{ opacity: ease(frame, aboveAt, 8) }}>
        <CaptionPop bottom={150} size={84}>
          everything above this,
          <br />
          {frame >= borrowedAt ? <span style={{ color: frame >= startAt ? B.paper : B.gauge }}>we borrowed</span> : <span>&nbsp;</span>}
          {frame >= builtAt ? <span> or built</span> : null}
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * 2 · Fastest human, 44 km/h. Lines 0-2. Source #2 (9.58 s, Berlin, 16 Aug 2009; peak "about 44 km/h" between 60
 * and 80 m). The plate is a 2013 U.S. Marine Corps 100 m start (assets.md) - not the record race - so it says so on
 * the picture for the whole rung, and it is dimmed to 0.07 while the drawn track and its labels are up. A dot runs
 * the 100 m in 9.58 s of real time (287 frames, constant speed - no split times are claimed).
 * The photo is this scene's own element (the shell gets no plate): shown whole at 0.615x on the left (x 0-1180, its
 * right edge fading out), so the sprinter sits at x ~650-1110, clear of the dial and its disc. It is not mirrored.
 * 0 "Berlin, August 2009. Usain Bolt runs a hundred metres in nine point five eight seconds, and... between the
 * sixty- and eighty-metre marks he is doing about forty-four kilometres an hour." · 1 "Forty-four. ...the fastest a
 * human being has ever been measured moving under their own power. And he could hold it for about a second."
 * · 2 "Roughly nine times your walk. Level two of twelve... the ceiling of what a human body can do. From here on..."
 */
export const FastestHuman: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const dimAt = within(t, 0, 0.11); // "Usain Bolt": the photo dims and the drawn track takes over
  const runAt = within(t, 0, 0.16); // "runs a hundred metres"
  const hundredAt = within(t, 0, 0.2);
  const cardAt = within(t, 0, 0.29); // "nine point five eight seconds"
  const bandAt = within(t, 0, 0.58); // "between the sixty- and eighty-metre marks"
  const peakAt = within(t, 0, 0.85); // "forty-four kilometres an hour" - the dot is inside the band as it is said
  const fortyAt = lineAt(t, 1); // "Forty-four."
  const measuredAt = within(t, 1, 0.14); // "the fastest a human being has ever been measured"
  const powerAt = within(t, 1, 0.5); // "moving under their own power"
  const holdAt = within(t, 1, 0.74); // "he could hold it"
  const raceAt = lineAt(t, 2); // "Roughly nine times your walk."
  const ceilAt = within(t, 2, 0.44); // "the ceiling of what a human body can do": the photo comes back
  const runFrames = Math.round(9.58 * 30);
  const p = lin(frame, runAt, runAt + runFrames);
  const x0 = 200;
  const x1 = 1380;
  const len = x1 - x0;
  const bandX = x0 + len * 0.6;
  const bandW = len * 0.2;
  const inBand = p > 0.6 && p < 0.8;
  // the drawn board is up from "Usain Bolt" to "the ceiling"; the photo sits at 0.07 underneath it
  const board = ease(frame, dimAt, 15) * (1 - ease(frame, ceilAt, 14));
  // line 1's labels leave when line 2's race starts
  const line1Out = 1 - ease(frame, raceAt - 6, 6);
  // the gauge holds rung 1 (5) until the 44 is said - it never shows an unsourced in-between speed for long
  const kmh = 5 + 39 * ease(frame, peakAt, 24);
  // "he could hold it for about a second": the dot crosses the 60-80 m band again - 20 m at the 12.27 m/s peak (#2) is 1.63 s
  const hold = lin(frame, holdAt, holdAt + 49);
  // "nine times your walk": both dots leave the line together at 44 and 5 km/h (rungs 2 and 1), in proportion
  const race = lin(frame, raceAt, raceAt + 66);
  const pulse = Math.sin(Math.PI * lin(frame, fortyAt, fortyAt + 16));
  // a small push while the photo is shown clean (at the top, and again from "the ceiling"); it stays under 1.04 so his
  // hair keeps clear of the pill above him and his hands of the caption below
  const cam = 1 + 0.03 * lin(frame, 0, dimAt + 15) - 0.03 * lin(frame, dimAt + 15, ceilAt) + 0.015 * ease(frame, ceilAt, 40) + 0.025 * lin(frame, ceilAt, t.frames);
  const drawnUp = frame >= dimAt + 8 && frame < ceilAt + 7;
  return (
    <RungShell t={t} index={1} kmh={kmh} plate={null} credit={drawnUp ? { kind: "illustration", source: "the 100 m, drawn · over a U.S. Marine Corps photo" } : { kind: "real", source: "U.S. Marine Corps · a 100 m start, 2013" }}>
      {/* the photo: whole width of the 1920 x 2400 original in a 1180-px column, fading into the dark at its right edge */}
      <Img
        src={levelImage({ id: "sprinter", name: "", reading: "", image: "sprinter-usmc" })!}
        style={{ position: "absolute", left: 0, top: 0, width: 1180, height: 1080, objectFit: "cover", objectPosition: "50% 57.6%", filter: `brightness(${0.5 - 0.43 * board})`, transform: `scale(${cam})`, transformOrigin: "0% 60%", WebkitMaskImage: "linear-gradient(to right, #000 94%, transparent 100%)", maskImage: "linear-gradient(to right, #000 94%, transparent 100%)" }}
      />
      {/* on the picture for the whole rung: this is not the Berlin race */}
      <PillTag x={1200} y={222} size={26} align="right">
        shown: a 100 m start, U.S. Marine Corps, 2013 · not the record race
      </PillTag>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: board }}>
        {[0, 1, 2, 3].map((lane) => (
          <line key={lane} x1={x0} y1={470 + lane * 50} x2={x1} y2={470 + lane * 50} stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
        ))}
        <line x1={x0} y1={460} x2={x0} y2={630} stroke="rgba(255,255,255,0.6)" strokeWidth={4} />
        <line x1={x1} y1={460} x2={x1} y2={630} stroke="rgba(255,255,255,0.6)" strokeWidth={4} opacity={ease(frame, hundredAt, 8)} />
        {/* the 60-80 m band, on "between the sixty- and eighty-metre marks"; it lights when the dot is inside it */}
        <rect x={bandX} y={460} width={bandW} height={170} fill={B.gauge} opacity={ease(frame, bandAt, 10) * (0.2 + 0.25 * ease(frame, peakAt, 8) + (inBand || (hold > 0 && hold < 1) ? 0.15 : 0))} />
        {/* the real-time run */}
        <circle cx={x0 + len * p} cy={545} r={16} fill={inBand ? B.gauge : B.paper} opacity={ease(frame, runAt, 6) * (1 - ease(frame, holdAt - 10, 8))} />
        {/* line 1: the band crossed once more */}
        {frame >= holdAt ? <circle cx={bandX + bandW * hold} cy={545} r={16} fill={B.gauge} opacity={line1Out} /> : null}
        {/* line 2: sprint against walk */}
        {frame >= raceAt ? (
          <>
            <line x1={x0} y1={545} x2={x0 + len * race} y2={545} stroke={B.gauge} strokeWidth={6} opacity={0.6} />
            <circle cx={x0 + len * race} cy={545} r={16} fill={B.gauge} />
            <line x1={x0} y1={595} x2={x0 + len * (5 / 44) * race} y2={595} stroke={B.aqua} strokeWidth={6} opacity={0.6} />
            <circle cx={x0 + len * (5 / 44) * race} cy={595} r={14} fill={B.aqua} />
          </>
        ) : null}
      </svg>
      <Tag x={x0} y={418} color={B.mute} opacity={board}>
        0 m
      </Tag>
      <Tag x={x1} y={418} color={B.mute} align="right" opacity={board * ease(frame, hundredAt, 8)}>
        100 m
      </Tag>
      <Tag x={x0} y={644} color={B.mute} opacity={board * ease(frame, runAt + 20, 10) * (1 - ease(frame, fortyAt - 6, 6))}>
        the dot runs it in real time
      </Tag>
      <Tag x={bandX + bandW / 2} y={644} color={B.gauge} align="center" opacity={board * ease(frame, bandAt, 10) * line1Out}>
        60–80 m
      </Tag>
      <div style={{ position: "absolute", left: 200, top: 276, opacity: board * ease(frame, cardAt, 10) }}>
        <NumberCard x={0} y={0} big="9.58 s" small="BERLIN · 16 AUGUST 2009 · USAIN BOLT" size={80} color={B.paper} />
      </div>
      {/* "about forty-four kilometres an hour"; it bumps on line 1's "Forty-four." */}
      <div style={{ position: "absolute", left: 786, top: 690, opacity: board * ease(frame, peakAt, 10) * line1Out, transform: `scale(${1 + 0.12 * pulse})`, transformOrigin: "50% 0%" }}>
        <NumberCard x={0} y={0} big="44 km/h" small="HIS PEAK SPEED" size={72} />
      </div>
      {frame >= measuredAt ? (
        <Tag x={766} y={704} size={28} align="right" opacity={board * ease(frame, measuredAt, 10) * line1Out}>
          fastest ever measured
        </Tag>
      ) : null}
      {frame >= powerAt ? (
        <Tag x={766} y={746} size={28} align="right" opacity={board * ease(frame, powerAt, 10) * line1Out}>
          under their own power
        </Tag>
      ) : null}
      {/* line 2's race labels */}
      {frame >= raceAt ? (
        <>
          <Tag x={x0} y={644} color={B.aqua} opacity={board * ease(frame, raceAt, 8)}>
            your walk · 5 km/h
          </Tag>
          <Tag x={x1} y={644} color={B.gauge} align="right" opacity={board * ease(frame, raceAt, 8)}>
            44 km/h
          </Tag>
        </>
      ) : null}
      {/* one line at a time, so the caption stays below his hands when the photo is back */}
      <div style={{ opacity: ease(frame, raceAt + 4, 10) * (1 - ease(frame, ceilAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={78} color={B.paper}>
          ≈ 9× your walk
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, ceilAt, 10) }}>
        <CaptionPop bottom={150} size={78}>the ceiling of a human body</CaptionPop>
      </div>
    </RungShell>
  );
};

/** point on a quadratic curve, for the dot that rides rung 3's sketched path */
const quad = (a: [number, number], c: [number, number], b: [number, number], u: number): [number, number] => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];

/**
 * 3 · Fastest land animal, 93 km/h. Lines 0-5. Source #3 (Wilson et al. 2013). Plate: the CC0 cheetah clip - a zoo
 * sprint in slow motion, which the picture says for the whole rung. The clip moves by itself, so this rung adds
 * cues, not camera; every card and the sketch sit above the band the animal runs in (y >= ~440).
 * 0 the quoted numbers weren't wild hunts · 1 2013, Botswana, five wild cheetahs, collars (position, speed,
 * acceleration), 367 runs, most of them real hunts (the paper: "predominantly hunting runs") · 2 fastest run: 93 km/h
 * · 3 the honest number, more than double the fastest human; most hunts never went near it · 4 accelerate, brake
 * and turn · 5 tease.
 */
export const Cheetah: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const quotedAt = within(t, 0, 0.11); // "higher numbers quoted"
  const noneAt = within(t, 0, 0.42); // "Almost none of them..."
  const yearAt = within(t, 1, 0.03); // "in 2013"
  const botswanaAt = within(t, 1, 0.15);
  const fiveAt = within(t, 1, 0.24); // "five wild cheetahs"
  const collarsAt = within(t, 1, 0.37);
  const listAt = [within(t, 1, 0.48), within(t, 1, 0.53), within(t, 1, 0.59)]; // "position, speed and acceleration"
  const runsAt = within(t, 1, 0.68); // "three hundred and sixty-seven runs" - the count lands as the number ends
  const runsDoneAt = within(t, 1, 0.84);
  const huntsAt = within(t, 1, 0.87); // "most of them real hunts"
  const numberAt = within(t, 2, 0.5); // "ninety-three"
  const honestAt = lineAt(t, 3);
  const doubleAt = within(t, 3, 0.2); // "still more than double the fastest human"
  const betterAt = within(t, 3, 0.44); // "But the collars found something better"
  const mostAt = within(t, 3, 0.78); // "Most hunts never went anywhere near it."
  const deadlyAt = lineAt(t, 4);
  const straightAt = within(t, 4, 0.2); // "the straight-line speed"
  const violentAt = within(t, 4, 0.34);
  const accelAt = within(t, 4, 0.51);
  const brakeAt = within(t, 4, 0.58);
  const turnAt = within(t, 4, 0.63);
  const highestAt = within(t, 4, 0.67); // "Some of the highest values ever measured in any land mammal."
  const teaseAt = lineAt(t, 5);
  const nextAt = within(t, 5, 0.22); // "the next one is where a car does something"
  const aircraftAt = within(t, 5, 0.66); // "only aircraft had done before"
  const kmh = 44 + 49 * ease(frame, numberAt, 30); // holds rung 2 (44) until the 93 lands - the gauge only goes up
  const runs = Math.round(367 * lin(frame, runsAt, runsDoneAt));
  const cardsOut = 1 - ease(frame, deadlyAt, 8);
  const sketch = ease(frame, straightAt, 10) * (1 - ease(frame, teaseAt, 8));
  // the dot rides the sketched path in an 80-frame loop: it gathers speed, brakes hard, swings through the turn, and goes
  const loop = frame >= highestAt ? (frame - highestAt) % 80 : -1;
  let dot: [number, number] = [220, 410];
  if (loop >= 60) dot = [1120 + 240 * Math.pow((loop - 60) / 20, 2), 292 + 4 * ((loop - 60) / 20)];
  else if (loop >= 50) dot = quad([1010, 340], [1024, 290], [1120, 292], (loop - 50) / 10);
  else if (loop >= 40) dot = quad([880, 410], [990, 412], [1010, 340], (loop - 40) / 10);
  else if (loop >= 28) dot = [700 + 180 * (1 - Math.pow(1 - (loop - 28) / 12, 2)), 410];
  else if (loop >= 0) dot = [220 + 480 * Math.pow(loop / 28, 2), 410];
  return (
    <RungShell t={t} index={2} kmh={kmh} plate={{ clip: "cheetah-rozi", seconds: 8 }} brightness={0.9} credit={{ kind: "real", source: "HAV0Xunderscore · CC0 · Cincinnati Zoo, slow motion" }} drawn={frame >= straightAt && frame < teaseAt + 8 ? { label: "the path, a sketch", opacity: sketch } : undefined}>
      {/* on the picture for the whole rung: the animal on screen is a zoo cheetah, not one of the collared ones */}
      <PillTag x={1880} y={222} size={26} align="right">
        shown: a zoo sprint, in slow motion
      </PillTag>
      {/* line 1: the study card, built in the order it is told */}
      {frame >= yearAt ? (
        <div style={{ position: "absolute", left: 160, top: 280, opacity: ease(frame, yearAt, 10) * cardsOut, padding: "10px 22px 12px", borderRadius: 16, background: B.paper, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: 1, whiteSpace: "nowrap" }}>
            2013
            {frame >= botswanaAt ? <span> · BOTSWANA</span> : null}
            {frame >= collarsAt ? <span> · TRACKING COLLARS</span> : null}
          </div>
          {frame >= fiveAt ? (
            <div style={{ fontFamily: F.headline, fontSize: 56, lineHeight: 1, marginTop: 4, whiteSpace: "nowrap" }}>
              5 wild cheetahs
              {frame >= runsAt ? <span> · {runs} runs</span> : null}
            </div>
          ) : null}
        </div>
      ) : null}
      {/* what the collars recorded, one at a time; replaced by "most of them real hunts" */}
      {["position", "speed", "acceleration"].map((w, i) =>
        frame >= listAt[i] ? (
          <PillTag key={w} x={[160, 338, 465][i]} y={405} size={26} color={B.aqua} opacity={ease(frame, listAt[i], 8) * (1 - ease(frame, runsDoneAt - 8, 8))}>
            {w}
          </PillTag>
        ) : null,
      )}
      {frame >= huntsAt ? (
        <PillTag x={160} y={405} size={26} opacity={ease(frame, huntsAt, 8) * (1 - ease(frame, numberAt - 8, 8))}>
          most of them real hunts
        </PillTag>
      ) : null}
      {/* line 2: the number, beside the study card; it dims on "Most hunts never went anywhere near it" */}
      <div style={{ position: "absolute", left: 840, top: 280, opacity: ease(frame, numberAt, 10) * cardsOut * (1 - 0.6 * ease(frame, mostAt, 12)) }}>
        <NumberCard x={0} y={0} big="93 km/h" small="FASTEST RUN RECORDED" size={80} />
      </div>
      {frame >= mostAt ? (
        <PillTag x={840} y={435} size={26} opacity={ease(frame, mostAt, 10) * cardsOut}>
          most hunts: nowhere near it
        </PillTag>
      ) : null}
      {/* line 4: "wasn't the straight-line speed" - one straight pass, then it clears for the sketch */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, straightAt, 8) * (1 - ease(frame, violentAt, 10)) }}>
        <line x1={220} y1={410} x2={1360} y2={410} stroke={B.paper} strokeWidth={6} strokeDasharray="18 14" />
        <circle cx={220 + 1140 * lin(frame, straightAt, violentAt)} cy={410} r={16} fill={B.paper} />
      </svg>
      {frame >= straightAt ? (
        <PillTag x={220} y={352} size={28} opacity={ease(frame, straightAt, 8) * (1 - ease(frame, violentAt, 10))}>
          not the straight-line speed
        </PillTag>
      ) : null}
      {/* accelerate / brake / turn: a sketch above the run, each stretch drawn on its word */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 1 - ease(frame, teaseAt, 8) }}>
        {frame >= accelAt ? <path d="M220 410 L700 410" stroke={B.gauge} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="480" strokeDashoffset={480 * (1 - ease(frame, accelAt, 12))} /> : null}
        {frame >= brakeAt ? <path d="M700 410 L880 410" stroke={B.tease} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="180" strokeDashoffset={180 * (1 - ease(frame, brakeAt, 10))} /> : null}
        {frame >= turnAt ? <path d="M880 410 Q 990 412 1010 340 Q 1024 290 1120 292 L 1360 296" stroke={B.aqua} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="600" strokeDashoffset={600 * (1 - ease(frame, turnAt, 14))} /> : null}
        {loop >= 0 ? <circle cx={dot[0]} cy={dot[1]} r={16} fill={B.paper} stroke={B.ink} strokeWidth={4} /> : null}
      </svg>
      {frame >= accelAt ? (
        <PillTag x={220} y={352} size={28} color={B.gauge} opacity={ease(frame, accelAt, 8) * (1 - ease(frame, teaseAt, 8))}>
          accelerate
        </PillTag>
      ) : null}
      {frame >= brakeAt ? (
        <PillTag x={720} y={352} size={28} color={B.tease} opacity={ease(frame, brakeAt, 8) * (1 - ease(frame, teaseAt, 8))}>
          brake
        </PillTag>
      ) : null}
      {frame >= turnAt ? (
        <PillTag x={1040} y={228} size={28} color={B.aqua} opacity={ease(frame, turnAt, 8) * (1 - ease(frame, teaseAt, 8))}>
          turn
        </PillTag>
      ) : null}
      {/* line 0 */}
      <div style={{ opacity: ease(frame, quotedAt, 10) * (1 - ease(frame, yearAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={72} color={B.paper}>
          the higher numbers you'll see quoted?
          <br />
          {frame >= noneAt ? (
            <span style={{ opacity: ease(frame, noneAt, 8) }}>
              almost none come from a <span style={{ color: B.gauge }}>wild hunt</span>
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </CaptionPop>
      </div>
      {/* line 3, first sentence */}
      <div style={{ opacity: ease(frame, honestAt, 10) * (1 - ease(frame, betterAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={64} color={B.paper}>
          the honest number: <span style={{ color: B.gauge }}>93</span>
          <br />
          {frame >= doubleAt ? <span style={{ opacity: ease(frame, doubleAt, 8) }}>more than double the fastest human</span> : <span>&nbsp;</span>}
        </CaptionPop>
      </div>
      {/* line 3, second sentence */}
      <div style={{ opacity: ease(frame, betterAt, 10) * (1 - ease(frame, deadlyAt - 4, 8)) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          the collars found <span style={{ color: B.gauge }}>something better</span>
        </CaptionPop>
      </div>
      {/* line 4, last sentence */}
      <div style={{ opacity: ease(frame, highestAt, 10) * (1 - ease(frame, teaseAt - 4, 8)) }}>
        <CaptionPop bottom={150} size={72} color={B.paper}>
          among the <span style={{ color: B.gauge }}>highest</span> ever measured
          <br />
          in any land mammal
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, nextAt, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          next: a car does something
          <br />
          {frame >= aircraftAt ? (
            <span style={{ opacity: ease(frame, aircraftAt, 8) }}>
              only <span style={{ color: B.gauge }}>aircraft</span> had done
            </span>
          ) : (
            <span>&nbsp;</span>
          )}
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/** "Mach 1.016", typed on as it is spoken: fractions of line 4 for "Mach", "one", "point zero", "one", "six" */
const MACH_TYPED: [string, number][] = [
  ["Mach ", 0.71],
  ["1", 0.75],
  [".0", 0.77],
  ["1", 0.82],
  ["6", 0.84],
];

/**
 * 4 · The sound barrier on wheels, 1,228 km/h. Lines 0-6. Sources #7, #26 (FIA). Plate: a public-domain photo of the
 * car on display in a museum (assets.md: Coventry Transport Museum, 2007), which the picture says for the whole
 * rung; the run itself is drawn.
 * 0 place, date · 1 the car, its two engines, the driver, the run at 763 mph · 2 "1,228 km/h" · 3 still the record,
 * only supersonic land vehicle · 4 two runs, opposite directions, average = Mach 1.016, not under the wall
 * · 5 "Through it." · 6 tease: the wall.
 */
export const ThrustSSC: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const placeAt = lineAt(t, 0); // "Black Rock Desert, Nevada."
  const dateAt = within(t, 0, 0.47); // "The fifteenth of October, 1997."
  const nameAt = within(t, 1, 0.03); // "A car called Thrust SSC"
  const enginesAt = within(t, 1, 0.14); // "two jet engines": the camera goes to the left nozzle...
  const betweenAt = within(t, 1, 0.26); // "...with a cockpit in between": ...and sweeps across to the right one
  const driverAt = within(t, 1, 0.44); // "a Royal Air Force pilot"
  const greenAt = within(t, 1, 0.57); // "Andy Green"
  const lakeAt = within(t, 1, 0.64); // "across a dry lakebed": the photo dims and the drawn run comes in
  const runAt = within(t, 1, 0.75); // "at seven hundred and sixty-three miles an hour"
  const recordAt = lineAt(t, 2); // "One thousand two hundred and twenty-eight kilometres an hour."
  const stillAt = lineAt(t, 3); // "It is still the land speed record."
  const onlyAt = within(t, 3, 0.33); // "the only time a land vehicle..." - on screen as "the first" (FIA #26: "the first supersonic record")
  const soundAt = within(t, 3, 0.83); // "faster than sound"
  const luckyAt = lineAt(t, 4); // "isn't one lucky run"
  const twoRunsAt = within(t, 4, 0.25); // "two runs"
  const oppositeAt = within(t, 4, 0.31); // "in opposite directions"
  const averageAt = within(t, 4, 0.43); // "the average is what counts"
  const countsAt = within(t, 4, 0.52); // "...is what counts": the pill travels to where the Mach card will type on
  const machAt = within(t, 4, MACH_TYPED[0][1]); // "Mach one point zero one six"
  const notUnderAt = within(t, 4, 0.86); // "Not a fraction under the wall."
  const throughAt = lineAt(t, 5); // "Through it."
  const numberAt = lineAt(t, 6); // "Which brings us to the number itself."
  const machineAt = within(t, 6, 0.39); // "the next level isn't a machine at all"
  const wallAt = within(t, 6, 0.88); // "It's a wall."
  // the run: constant acceleration from "at seven hundred..." to the first frame of line 2, so the dot's position
  // (u squared) and the two speed readouts (u) agree, and neither final figure is readable before it has been said
  const u = lin(frame, runAt, recordAt);
  // line 4 opens by replaying that one run (70 frames, so it is still moving until just before "two runs")
  const replay = lin(frame, luckyAt + 6, luckyAt + 76);
  const pos = frame < luckyAt + 6 ? u * u : replay * replay;
  const dotOn = (frame < luckyAt + 6 ? 1 - ease(frame, luckyAt, 6) : ease(frame, luckyAt + 6, 4)) * (1 - ease(frame, twoRunsAt, 10));
  // one value drives both readouts (km/h = mph x 1.609344); the gauge holds rung 3's 93 until the run passes it
  const mph = 763 * u;
  const kmh = Math.max(93, mph * 1.609344);
  const run1 = ease(frame, twoRunsAt, 40);
  const run2 = ease(frame, oppositeAt, 70);
  const rulesOut = 1 - ease(frame, numberAt, 8);
  // the sketch's words leave when the Mach card types on
  const rulesText = 1 - ease(frame, machAt - 8, 8);
  // the MACH 1 marker is a fixed place on the first line: hidden while the two-run sketch is up, back for "not under the wall"
  const markerOn = 1 - ease(frame, twoRunsAt, 8) + ease(frame, notUnderAt, 8);
  // its label waits for "faster than sound"
  const machPill = ease(frame, soundAt, 8) * (1 - ease(frame, twoRunsAt, 8)) + ease(frame, notUnderAt, 8);
  const machBig = MACH_TYPED.filter(([, f]) => frame >= within(t, 4, f))
    .map(([s]) => s)
    .join("");
  const mx = 160 + 1220 * 0.92; // the MACH 1 marker
  // rings off the marker: when the dot passes it, on "faster than sound" (two), and a heavier one on "Through it."
  const ringAt = [frame < luckyAt + 6 ? runAt + Math.round(Math.sqrt(0.92) * (recordAt - runAt)) : luckyAt + 6 + Math.round(Math.sqrt(0.92) * 70), soundAt, soundAt + 24, throughAt];
  // line 6: the marker becomes the wall
  const wall = ease(frame, wallAt, 12);
  // camera on the museum photo (1600 x 1200: never past 1.15): a slow push through line 0, to the left nozzle on
  // "two jet engines", a sweep across the tail to the right nozzle, back out as the drawn run takes over; then in on
  // "1,228", a drift left through line 3, right with run 1, back left with run 2, and a slow return to centre
  const cam = 1 + 0.1 * lin(frame, 0, enginesAt) + 0.05 * ease(frame, enginesAt, 30) - 0.1 * ease(frame, lakeAt, 40) + 0.1 * ease(frame, recordAt, 40);
  const ox = 50 - 35 * ease(frame, enginesAt, 30) + 70 * lin(frame, betweenAt, betweenAt + 100) - 35 * ease(frame, lakeAt, 40) - 20 * lin(frame, stillAt, luckyAt) + 50 * ease(frame, twoRunsAt, 40) - 55 * ease(frame, oppositeAt, 70) + 25 * lin(frame, oppositeAt + 70, throughAt);
  return (
    <RungShell t={t} index={3} kmh={kmh} plate={{ image: "thrustssc-museum" }} brightness={0.85 - 0.35 * ease(frame, lakeAt, 20)} plateMove={{ scale: cam, origin: `${ox}% 45%` }} credit={{ kind: "real", source: "AJB83 · Coventry Transport Museum · public domain" }} drawn={{ label: "the run, drawn", opacity: ease(frame, lakeAt, 10) }}>
      {/* the museum photo stays up the whole rung, so its credit does too; the drawn run gets its own chip beside it */}
      {/* on the picture for the whole rung: this is the car, but not the day */}
      <PillTag x={160} y={222} size={26}>
        shown: the car itself, in a museum · not the record run
      </PillTag>
      {/* the desert line: a dot crosses the MACH 1 marker */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, lakeAt, 10) }}>
        <line x1={160} y1={700} x2={1380} y2={700} stroke="rgba(255,255,255,0.5)" strokeWidth={4} opacity={1 - ease(frame, machineAt, 10)} />
        {/* dashed marker; on "It's a wall" it shoots up and down into one */}
        <line x1={mx} y1={650 - 400 * wall} x2={mx} y2={745 - 30 * wall} opacity={markerOn} stroke={B.tease} strokeWidth={6 + 6 * wall + (frame >= notUnderAt ? 6 * Math.sin(Math.PI * lin(frame, notUnderAt, notUnderAt + 20)) : 0)} strokeDasharray="12 10" />
        <circle cx={160 + 1220 * pos} cy={700} r={18} fill={B.gauge} opacity={dotOn} />
        {ringAt.map((at, i) => (frame >= at && frame < at + 26 ? <circle key={i} cx={mx} cy={700} r={30 + 80 * lin(frame, at, at + 26)} fill="none" stroke={B.paper} strokeWidth={i === 3 ? 10 : 4} opacity={(1 - lin(frame, at, at + 26)) * markerOn} /> : null))}
        {/* line 4: the rule - two runs, opposite directions, and the average is the record */}
        <g opacity={rulesOut}>
          {frame >= twoRunsAt ? (
            <>
              <path d="M 200 660 L 1355 660" stroke={B.paper} strokeWidth={4} strokeDasharray="1200" strokeDashoffset={1200 * (1 - run1)} />
              <path d="M 1355 655 L 1380 660 L 1355 665 Z" fill={B.paper} opacity={ease(frame, twoRunsAt + 40, 6)} />
              <circle cx={200 + 1155 * run1} cy={660} r={14} fill={B.gauge} opacity={1 - ease(frame, twoRunsAt + 40, 10)} />
            </>
          ) : null}
          {frame >= oppositeAt ? (
            <>
              <path d="M 1380 740 L 200 740" stroke={B.paper} strokeWidth={4} strokeDasharray="1200" strokeDashoffset={1200 * (1 - run2)} />
              <path d="M 200 735 L 175 740 L 200 745 Z" fill={B.paper} opacity={ease(frame, oppositeAt + 70, 6)} />
              <circle cx={1380 - 1180 * run2} cy={740} r={14} fill={B.gauge} opacity={1 - ease(frame, oppositeAt + 70, 10)} />
            </>
          ) : null}
        </g>
      </svg>
      {/* the marker's label: from "faster than sound", away during the two-run sketch; on "the number itself" it swells */}
      <PillTag x={mx} y={596 - 10 * ease(frame, numberAt, 14)} size={30 + 14 * ease(frame, numberAt, 14)} color={B.tease} align="center" opacity={machPill}>
        MACH 1
      </PillTag>
      <Tag x={160} y={770} opacity={ease(frame, placeAt, 12) * (1 - ease(frame, stillAt - 8, 8))}>
        Black Rock Desert · Nevada
      </Tag>
      {frame >= dateAt ? (
        <Tag x={160} y={812} opacity={ease(frame, dateAt, 10) * (1 - ease(frame, recordAt, 10))}>
          15 October 1997
        </Tag>
      ) : null}
      {/* line 1: the car and its driver, named as they are spoken; the 1,228 card takes over this corner on line 2 */}
      {frame >= nameAt ? <div style={{ position: "absolute", left: 160, top: 290, opacity: ease(frame, nameAt, 10) * (1 - ease(frame, recordAt - 6, 6)), padding: "4px 20px 8px", borderRadius: 14, background: "rgba(5,14,24,0.9)", fontFamily: F.headline, fontSize: 72, lineHeight: 1.1, letterSpacing: 2, color: B.paper, whiteSpace: "nowrap" }}>THRUST SSC</div> : null}
      {frame >= driverAt ? (
        <PillTag x={160} y={392} size={28} opacity={ease(frame, driverAt, 10) * (1 - ease(frame, recordAt - 6, 6))}>
          a Royal Air Force pilot{frame >= greenAt ? <span style={{ color: B.gauge }}> · Andy Green</span> : null}
        </PillTag>
      ) : null}
      {/* "seven hundred and sixty-three miles an hour": the count reaches 763 as the gauge reaches 1,228 */}
      {frame >= runAt ? (
        <div style={{ position: "absolute", left: 160, top: 456, opacity: ease(frame, runAt, 8) * (1 - ease(frame, recordAt + 4, 10)) }}>
          <NumberCard x={0} y={0} big={`${Math.round(mph)} mph`} size={80} />
        </div>
      ) : null}
      <Tag x={200} y={620} color={B.mute} opacity={ease(frame, twoRunsAt, 10) * rulesText}>
        run 1 →
      </Tag>
      <Tag x={200} y={756} color={B.mute} opacity={ease(frame, oppositeAt, 10) * rulesText}>
        ← run 2
      </Tag>
      {frame >= averageAt ? (
        <PillTag x={lerp(770, 411, ease(frame, countsAt, 40))} y={lerp(679, 476, ease(frame, countsAt, 40))} size={26} align="center" color={frame >= countsAt + 40 ? B.gauge : B.paper} opacity={ease(frame, averageAt, 10) * rulesText}>
          the average is what counts
        </PillTag>
      ) : null}
      <div style={{ position: "absolute", left: 160, top: 290, opacity: ease(frame, recordAt, 12) * (1 - ease(frame, machineAt, 10)) }}>
        <NumberCard x={0} y={0} big="1,228 km/h" small="763 MPH · THRUST SSC · ANDY GREEN · 15 OCT 1997" size={96} />
        {machBig ? (
          <div style={{ position: "absolute", left: 0, top: 180, opacity: rulesOut }}>
            <NumberCard x={0} y={0} big={machBig} small="AVERAGE OF TWO RUNS IN OPPOSITE DIRECTIONS · FIA" size={80} color={B.paper} />
          </div>
        ) : null}
      </div>
      {/* line 3, first sentence; line 4's opening takes the same spot */}
      <PillTag x={160} y={476} size={26} color={B.gauge} opacity={ease(frame, stillAt, 10) * (1 - ease(frame, luckyAt - 4, 8))}>
        still the land speed record
      </PillTag>
      {frame >= luckyAt + 12 ? (
        <PillTag x={160} y={476} size={26} opacity={ease(frame, luckyAt + 12, 10) * (1 - ease(frame, twoRunsAt + 60, 10))}>
          not one lucky run
        </PillTag>
      ) : null}
      <div style={{ opacity: ease(frame, onlyAt, 10) * (1 - ease(frame, luckyAt - 4, 8)) }}>
        <CaptionPop bottom={150} size={78} color={B.paper}>
          the first land vehicle
          <br />
          to <span style={{ color: B.gauge }}>break the sound barrier</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, notUnderAt, 8) * (1 - ease(frame, numberAt, 8)) }}>
        <CaptionPop bottom={150} size={80}>
          not under the wall.{frame >= throughAt ? <span style={{ color: B.paper }}> through it.</span> : null}
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, machineAt, 8) }}>
        <CaptionPop bottom={150} size={84} color={B.tease}>
          the next level isn't a machine.
          <br />
          {frame >= wallAt ? <span>it's a wall.</span> : <span>&nbsp;</span>}
        </CaptionPop>
      </div>
    </RungShell>
  );
};
