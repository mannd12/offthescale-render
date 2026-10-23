import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { CaptionPop } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { LEVELS } from "../ladder";
import { NumberCard, RungShell, Tag } from "./shell";

/** even 0-1 between two frames (ease() is ease-out; an even fade or a steady traveller uses this) */
const lin = (f: number, a: number, b: number) => Math.min(1, Math.max(0, (f - a) / Math.max(1, b - a)));
/** 0-1 with a soft start and stop, for the camera */
const smooth = (f: number, a: number, b: number) => {
  const x = lin(f, a, b);
  return x * x * (3 - 2 * x);
};
/** a short pulse: up over `up` frames, back down over `down` */
const bump = (f: number, at: number, up = 6, down = 24) => {
  const u = f - at;
  return u <= 0 ? 0 : u < up ? u / up : Math.max(0, 1 - (u - up) / down);
};

/** Where the comb-jelly photo sits: [frame, scale, origin x %, origin y %]; "glide" = eased into, otherwise a slow drift. */
type Hold = [number, number, number, number, "glide"?];
const jellyAt = (frame: number, holds: Hold[]) => {
  let i = 0;
  while (i < holds.length - 2 && frame >= holds[i + 1][0]) i++;
  const a = holds[i];
  const b = holds[i + 1];
  const k = b[4] === "glide" ? smooth(frame, a[0], b[0]) : lin(frame, a[0], b[0]);
  return { scale: a[1] + (b[1] - a[1]) * k, origin: `${a[2] + (b[2] - a[2]) * k}% ${a[3] + (b[3] - a[3]) * k}%` };
};

// head and eye on the right, tail on the left - the same way round as the Level 1 fish it calls back to,
// so it swims in head-first from the left
const FISH_BODY = "M-220 0 C -140 -90, 140 -90, 220 0 C 140 80, -140 80, -220 0 Z";
const FISH_TAIL = "M-220 0 L -300 -70 L -300 70 Z";

/**
 * Level 5 - the midnight zone, 1,000 m. Sources: #3 (light detectable to ~1,000 m), #14
 * (76 % of 350,000+ animals in 17 years of ROV video make light), #15 (uses), #34 (blue
 * travels furthest), #6 (red = invisible), #16 (≈4 °C).
 * Lines: 0 "One thousand metres... night - permanently." 1 "And yet it isn't dark."
 * 2 "When scientists in California counted... three out of four can make their own light."
 * 3 "Down here, glowing isn't unusual... lures... flashes... bursts" 4 "Now look at the colour of it. Nearly all... blue"
 * 5 "That isn't decoration. Blue is the wavelength that travels furthest..." 6 "The sea filtered out red... Life answered in blue."
 * 7 "Which brings us back to that red fish... invisible." 8 "...red is the best camouflage in the ocean."
 * 9 "The water now is around four degrees Celsius..." 10 tease
 *
 * Motion pass 2026-10-01: nothing here holds still for more than a few seconds. The drawn lights do what the
 * voice says they do (lure, flash, burst), the blue band is found by the lights themselves, red and blue race,
 * the fish swims and goes dark before it vanishes. No new facts: every added word is spoken on its line.
 * Second pass (same day): small lights on a dark frame did not register at phone size, so the photo itself now
 * moves on every line, the three vignettes are half as big again and scale in, the bar wipes on taller, the
 * lights that fly into it are bigger, and the fish swims in from off screen - head first.
 */
export const Midnight: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const notDarkAt = lineAt(t, 1);
  const countLineAt = lineAt(t, 2);
  const countAt = within(t, 2, 0.35);
  const threeAt = within(t, 2, 0.85);
  // line 3: "Glowing is normal: lures to attract a meal, flashes to find a partner, bursts of light to startle a hunter and slip away."
  const normalAt = within(t, 3, 0.22);
  const lureAt = within(t, 3, 0.34);
  const flashAt = within(t, 3, 0.52);
  const burstAt = within(t, 3, 0.7);
  const slipAt = within(t, 3, 0.92);
  const colourAt = lineAt(t, 4);
  // line 4: "Nearly all of that light is blue - over and over, the same narrow band of blue."
  const blueAt = within(t, 4, 0.5);
  const overAt = within(t, 4, 0.58);
  // line 5: "Blue is the wavelength that travels furthest... a blue flash carries further... than any other colour could."
  const furthestAt = lineAt(t, 5);
  const raceAt = within(t, 5, 0.15);
  const carryAt = within(t, 5, 0.47);
  const otherAt = within(t, 5, 0.75);
  const filteredAt = lineAt(t, 6);
  const answerAt = within(t, 6, 0.7);
  const fishAt = lineAt(t, 7);
  const noRedAt = within(t, 7, 0.27);
  const vanishAt = within(t, 7, 0.75);
  const whyAt = lineAt(t, 8);
  const manyAt = within(t, 8, 0.11);
  const camoAt = within(t, 8, 0.5);
  const coldAt = lineAt(t, 9);
  const allDownAt = within(t, 9, 0.5);
  const teaseAt = lineAt(t, 10);

  // full black for line 0; the plate comes up dimly with the lights
  const plateIn = ease(frame, notDarkAt, 40);
  // line 0: the last of the sunlight ("about as deep as sunlight can be detected at all", #3) thins out evenly
  // and is gone on "night - permanently"
  const lastLight = (1 - lin(frame, within(t, 0, 0.18), within(t, 0, 0.84))) * (1 - plateIn);
  // the blue lights stay up through "Now look at the colour of it... blue" (lines 4-6); they leave when the red fish returns
  const lights = ease(frame, notDarkAt + 6, 30) * (1 - ease(frame, fishAt, 12));
  const counter = ease(frame, countAt, 40);
  const shown = Math.round(350000 * counter);
  // sources #14: "350,000+" - the plus joins once the count lands
  const shownText = `${shown.toLocaleString("en-US")}${shown >= 350000 ? "+" : ""}`;
  const spectrum = ease(frame, colourAt, 14) * (1 - ease(frame, fishAt, 10));
  const blueOnly = ease(frame, within(t, 5, 0.5), 30);
  const fish = ease(frame, fishAt, 14) * (1 - ease(frame, coldAt, 10));
  const vanish = ease(frame, vanishAt, 30);

  // "lures... flashes... bursts": three drawn lights, each scaling in on its word, all gone before the spectrum bar.
  // The count card makes room for them: "350,000+" leaves on "lures" and "3 out of 4" moves up into its place.
  const usesOut = 1 - ease(frame, colourAt - 12, 12);
  const lure = ease(frame, lureAt, 12) * usesOut;
  const flash = ease(frame, flashAt, 12) * usesOut;
  const burst = ease(frame, burstAt, 8) * usesOut;
  const arrive = (at: number) => 0.55 + 0.45 * ease(frame, at, 16);
  // the cards start making room half a second before the first drawing arrives
  const makeRoomAt = lureAt - 14;
  // the lure sways on its stalk and the meal drifts in toward it
  const lureX = 372 + 8 * Math.sin(frame / 17);
  const lureY = 742 + 6 * Math.sin(frame / 11);
  const lurePulse = 0.5 + 0.5 * Math.sin(frame / 5);
  const mealX = 500 - 60 * ease(frame, lureAt + 12, 60) + 4 * Math.sin(frame / 9);
  // two lights answering each other, one after the other
  const flashPhase = (((frame - flashAt) % 44) + 44) % 44;
  const flashA = Math.max(0, 1 - Math.abs(flashPhase - 6) / 6);
  const flashB = Math.max(0, 1 - Math.abs(flashPhase - 24) / 6);
  // the burst: a cloud of sparks thrown out, a second puff, and the animal slips away on "slip away"
  const burstOut = ease(frame, burstAt, 26);
  const burstAgain = ease(frame, burstAt + 34, 26);
  const slip = ease(frame, slipAt, 20);

  // "Now look at the colour of it": the lights swell (with a soft halo) so their colour reads; they pulse again on "Life answered in blue"
  const swell = ease(frame, colourAt, 14);
  // the bar wipes on from the red end
  const wipe = ease(frame, colourAt, 28);
  // "over and over, the same narrow band of blue": ten of the lights fly into the blue band of the bar, one after another
  const flights = Array.from({ length: 10 }, (_, j) => {
    const launch = overAt + j * 9;
    return { launch, p: smooth(frame, launch, launch + 22), hit: bump(frame, launch + 22, 3, 12), tx: 1075 + ((j * 53) % 155) };
  });
  const bandHit = Math.min(1, Math.max(0, ...flights.map((f) => f.hit)) + bump(frame, blueAt, 6, 20));

  // red against blue: both set off together, red dies almost at once (#6), blue crosses the whole stage (#34)
  const lane = ease(frame, raceAt, 8) * (1 - ease(frame, filteredAt, 10));
  const volley = frame >= otherAt ? otherAt : raceAt;
  // "The sea filtered out red at a hundred metres": the red end of the bar flares and is put out again
  const redFlash = ease(frame, filteredAt, 8) * (1 - ease(frame, filteredAt + 36, 30));
  const redHi = ease(frame, filteredAt, 10) * (1 - ease(frame, answerAt, 10));

  // the red fish swims in from off screen, head first, keeps easing forward, and goes dark as "no red light reaches
  // this world" (#6: a red fish looks black). It comes to rest centred on x=530.
  const fishX = -250 + 720 * ease(frame, fishAt, 50) + 60 * lin(frame, fishAt + 50, vanishAt);
  const bob = 10 * Math.sin(frame / 13);
  const wag = 9 * Math.sin(frame / 5);
  const fishRed = interpolateColors(frame, [noRedAt, vanishAt], ["#E8322B", "#5A1512"]);

  // The photo under the drawings (comb jelly, unscaled about x 870-1340, y 320-630) moves on every line. Nothing drawn
  // is pinned to it. The origins are chosen so the jelly stays clear of what is on screen: pushed up and away from the
  // three vignettes (line 3), kept above the bar (lines 4-6, bar from y=640), kept right of the fish (lines 7-8, origin
  // x <= 45 % holds its left edge at x≈870 or further right).
  const holds: Hold[] = [
    [0, 1, 50, 45],
    [countLineAt, 1.03, 50, 45],
    [countLineAt + 40, 1.14, 58, 44, "glide"], // "counted every animal in... deep-sea robot footage": in on the footage
    [threeAt, 1.18, 58, 44],
    [threeAt + 40, 1.26, 60, 46, "glide"], // "three out of four can make their own light": closer
    [normalAt, 1.28, 60, 46],
    [normalAt + 50, 1.25, 50, 75, "glide"], // "Glowing is normal": the jelly rides up to leave the lower half to the three lights
    [colourAt, 1.3, 50, 75],
    [colourAt + 40, 1.18, 58, 58, "glide"], // "Now look at the colour of it": settles above the bar
    [furthestAt, 1.22, 58, 58],
    [furthestAt + 50, 1.3, 70, 58, "glide"], // "That isn't decoration...": in, and across to the left
    [filteredAt, 1.33, 70, 58],
    [filteredAt + 50, 1.1, 45, 50, "glide"], // "The sea filtered out red...": back out
    [noRedAt, 1.12, 45, 50],
    [noRedAt + 50, 1.24, 45, 50, "glide"], // "No red light reaches this world": in, growing away from the fish
    [vanishAt, 1.26, 45, 50],
    [vanishAt + 50, 1.1, 45, 50, "glide"], // "...it is, effectively, invisible": out as the fish goes
    [whyAt, 1.11, 45, 50],
    [whyAt + 40, 1.2, 40, 48, "glide"], // "That's why so many deep-sea animals are red"
    [coldAt, 1.22, 40, 48],
    [coldAt + 40, 1.32, 52, 45, "glide"], // line 9 is the photo alone again (real-footage chip): push in on the comb jelly
    [t.frames, 1.35, 52, 45],
  ];

  // points of living light, deterministic
  const stars = Array.from({ length: 36 }, (_, i) => ({
    x: 160 + ((i * 7919) % 1300),
    y: 240 + ((i * 104729) % 680),
    r: 1.5 + (i % 4) * 1.1,
    ph: (i * 37) % 60,
  }));
  // line 2, "counted every animal": a ring passes over each light in turn, left to right, until the count starts
  const scanSpan = Math.max(1, countAt - countLineAt - 14);

  // the chip names what is drawn: the lights until the fish returns, then the fish; line 9 is the photo alone
  const credit =
    plateIn <= 0.5
      ? { kind: "illustration" as const }
      : frame < fishAt
        ? { kind: "illustration" as const, source: "drawn lights over a NOAA Ocean Exploration photo" }
        : frame < coldAt
          ? { kind: "illustration" as const, source: "drawing over a NOAA Ocean Exploration photo" }
          : { kind: "real" as const, source: "NOAA Ocean Exploration" };

  return (
    <RungShell t={t} index={4} depth={1000} plate={LEVELS[3]} brightness={0.55 * plateIn * (1 - 0.5 * fish)} plateMove={jellyAt(frame, holds)} credit={credit} sub="≈ 100× · sunlight ends">
      {/* black beat, then living light. While the screen is black the chip makes no "real footage" claim. */}
      <AbsoluteFill style={{ background: "#000", opacity: 1 - plateIn }} />
      {/* the last trace of daylight from above, fading to the full black of "it is night - permanently" */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 70% at ${50 + 3 * Math.sin(frame / 30)}% 8%, rgba(40,130,200,0.55) 0%, rgba(20,70,120,0.28) 45%, rgba(0,0,0,0) 100%)`, opacity: lastLight }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: lights }}>
        {stars.map((s, i) => {
          const tw = 0.5 + 0.5 * Math.sin((frame + s.ph) / 9);
          const across = (s.x - 160) / 1300;
          // a wave of brightness crosses the field on "Glowing is normal" and again on "Life answered in blue"
          const wave = bump(frame, normalAt + across * 24) + bump(frame, answerAt + 6 + across * 24);
          const scan = bump(frame, countLineAt + across * scanSpan, 4, 12);
          const r = s.r * (0.7 + tw * 0.6) * (1 + 1.6 * swell + 1.6 * wave);
          return (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r={r * 3} fill="#39B6FF" opacity={0.2 * Math.min(1, swell + wave)} />
              <circle cx={s.x} cy={s.y} r={r} fill={i % 7 === 0 ? "#BFEFFF" : "#39B6FF"} opacity={Math.min(1, 0.4 + 0.6 * tw + wave)} />
              {scan > 0 ? <circle cx={s.x} cy={s.y} r={8 + 20 * (1 - scan)} fill="none" stroke="#BFEFFF" strokeWidth={3} opacity={scan} /> : null}
            </g>
          );
        })}
      </svg>

      {/* the count: 350,000 animals -> 3 out of 4 glow. Just before "lures" the count leaves and "3 out of 4" moves up (y 300-464). */}
      <div style={{ position: "absolute", left: 160, top: 300, opacity: ease(frame, countAt, 10) * (1 - ease(frame, colourAt, 10)) }}>
        <NumberCard x={0} y={0} opacity={1 - ease(frame, makeRoomAt, 10)} big={shownText} small="ANIMALS COUNTED · 17 YEARS OF ROV VIDEO · MONTEREY BAY" size={76} color={B.paper} />
        <div style={{ position: "absolute", left: 0, top: 160 * (1 - ease(frame, makeRoomAt, 20)), opacity: ease(frame, threeAt, 12) }}>
          <NumberCard x={0} y={0} big="3 out of 4" small="MAKE THEIR OWN LIGHT" size={96} />
        </div>
      </div>

      {/* what the light is for (line 3, #15), in the lower half (drawings y 495-820, labels y 826-920), each scaling in
          on its word: a lure on its stalk with a meal drifting in (x 91-615), two lights flashing in turn (x 626-994),
          a burst and the animal gone (x 1028-1419). Drawn at 1.5x of their first size. */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g opacity={lure} transform={`translate(420 650) scale(${1.5 * arrive(lureAt)}) translate(-360 -725)`}>
          <ellipse cx={205} cy={748} rx={64} ry={46} fill="#14364F" stroke="#2E6E9E" strokeWidth={3} />
          <circle cx={236} cy={734} r={5} fill="#2E6E9E" />
          <path d={`M224 706 C 250 640, 345 648, ${lureX} ${lureY}`} stroke="#2E6E9E" strokeWidth={4} fill="none" strokeLinecap="round" />
          <circle cx={lureX} cy={lureY} r={30 + 12 * lurePulse} fill="#39B6FF" opacity={0.22 + 0.2 * lurePulse} />
          <circle cx={lureX} cy={lureY} r={13} fill="#BFEFFF" />
          <g transform={`translate(${mealX} 752)`} opacity={0.8}>
            <path d="M-30 0 C -16 -14, 16 -14, 30 0 C 16 12, -16 12, -30 0 Z" fill={B.mute} />
            <path d="M28 0 L 46 -12 L 46 12 Z" fill={B.mute} />
          </g>
        </g>
        <g opacity={flash} transform={`translate(810 655) scale(${arrive(flashAt)}) translate(-810 -655)`}>
          {[
            { x: 720, y: 590, on: flashA },
            { x: 900, y: 720, on: flashB },
          ].map((l) => (
            <g key={l.x}>
              <circle cx={l.x} cy={l.y} r={34 + 60 * l.on} fill="#39B6FF" opacity={0.3 + 0.4 * l.on} />
              <circle cx={l.x} cy={l.y} r={14 + 10 * l.on} fill="#BFEFFF" opacity={0.75 + 0.25 * l.on} />
            </g>
          ))}
        </g>
        <g opacity={burst}>
          <circle cx={1200} cy={695} r={36 + 165 * burstOut} fill="#BFEFFF" opacity={(1 - burstOut) * 0.7} />
          <circle cx={1200} cy={695} r={36 + 135 * burstAgain} fill="#BFEFFF" opacity={frame >= burstAt + 34 ? (1 - burstAgain) * 0.5 : 0} />
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i * Math.PI) / 8 + (i % 3) * 0.13;
            const d = (82 + ((i * 37) % 75)) * burstOut + 15 * burstAgain;
            const tw = 0.5 + 0.5 * Math.sin((frame + i * 17) / 6);
            return <circle key={i} cx={1200 + Math.cos(a) * d} cy={695 + Math.sin(a) * d * 0.72} r={6 + (i % 3) * 3} fill={i % 4 === 0 ? "#BFEFFF" : "#39B6FF"} opacity={0.45 + 0.55 * tw} />;
          })}
          {/* the animal itself: sits in the cloud, then is off to the right, under the jelly, on "slip away" */}
          <line x1={1200} y1={695} x2={1200 + 195 * slip} y2={695 - 55 * slip} stroke="#BFEFFF" strokeWidth={6} strokeLinecap="round" opacity={slip * (1 - ease(frame, slipAt + 14, 12)) * 0.6} />
          <ellipse cx={1200 + 195 * slip} cy={695 - 55 * slip} rx={24} ry={12} fill={B.paper} opacity={1 - ease(frame, slipAt + 14, 10)} />
        </g>
      </svg>
      {[
        { x: 360, at: lureAt, on: lure, word: "lures", what: "attract a meal" },
        { x: 780, at: flashAt, on: flash, word: "flashes", what: "find a partner" },
        { x: 1200, at: burstAt, on: burst, word: "bursts", what: "startle a hunter" },
      ].map((u) => (
        <div key={u.word} style={{ position: "absolute", left: u.x - 200, width: 400, top: 826, textAlign: "center", opacity: u.on, transform: `scale(${1 + 0.1 * bump(frame, u.at, 8, 30)})` }}>
          <div style={{ fontFamily: F.headline, fontSize: 54, lineHeight: 1, letterSpacing: 2, textTransform: "uppercase", color: "#BFEFFF", textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>{u.word}</div>
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 28, marginTop: 6, letterSpacing: 1.5, textTransform: "uppercase", color: B.paper, textShadow: "0 2px 10px rgba(0,0,0,0.9)", whiteSpace: "nowrap" }}>{u.what}</div>
        </div>
      ))}

      {/* spectrum bar (y 640-740, labels y 752-788): every colour wipes on from the red end, then only blue survives the water */}
      <div style={{ position: "absolute", left: 160, top: 640, width: 1240, opacity: spectrum }}>
        <div style={{ position: "relative", height: 100, borderRadius: 50, overflow: "hidden", clipPath: wipe < 1 ? `inset(-4px ${(1 - wipe) * 100}% -4px -4px)` : undefined, outline: "3px solid rgba(255,255,255,0.5)", background: "linear-gradient(90deg, #E8322B, #FF9A2E, #FFE14D, #66D66E, #39B6FF, #6A5AE0)" }}>
          {/* everything except the blue band goes dark */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "72%", background: "#050E18", opacity: blueOnly }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "12%", background: "#050E18", opacity: blueOnly }} />
          {/* line 6: the red end comes back for a moment and is filtered out again; it tails off, with no hard edge */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "26%", background: "linear-gradient(90deg, #E8322B 0%, #FF9A2E 45%, rgba(255,154,46,0) 100%)", opacity: redFlash }} />
          {/* each light that lands in the blue band makes it flare */}
          <div style={{ position: "absolute", left: "72%", top: 0, bottom: 0, width: "16%", background: "#FFFFFF", opacity: 0.45 * bandHit }} />
        </div>
        <div style={{ position: "relative", height: 36, marginTop: 12, fontFamily: F.ui, fontWeight: 800, fontSize: 26, color: B.paper, letterSpacing: 1, whiteSpace: "nowrap" }}>
          <span style={{ position: "absolute", left: 0, opacity: Math.min(1, 1 - blueOnly * 0.6 + redHi), color: redHi > 0.5 ? "#FF6B5E" : B.paper, transform: `scale(${1 + 0.12 * redHi})`, transformOrigin: "left center" }}>red · gone at 100 m</span>
          {/* centred under the blue band (72 %-88 % of the bar; the gradient's blue stop is at 80 %) */}
          <span style={{ position: "absolute", left: "80%", transform: "translateX(-50%)", color: "#39B6FF", opacity: ease(frame, within(t, 5, 0.5), 12) }}>blue travels furthest</span>
          <span style={{ position: "absolute", right: 0, opacity: (1 - blueOnly * 0.6) * (1 - ease(frame, within(t, 5, 0.5), 12)) }}>violet</span>
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* the blue band of the bar (x 1053-1251) is marked on "is blue", and the lights fly into it "over and over":
            each one a bright head with a halo and a tail, and the band throws a glow when it lands */}
        <g opacity={spectrum}>
          <ellipse cx={1152} cy={690} rx={150 + 60 * bandHit} ry={95 + 30 * bandHit} fill="#39B6FF" opacity={0.3 * bandHit} />
          <rect x={1047} y={634} width={210} height={112} rx={20} fill="none" stroke="#BFEFFF" strokeWidth={4 + 4 * bandHit} opacity={ease(frame, blueAt, 10)} />
          {flights.map((f, j) => {
            if (f.p <= 0 || f.p >= 1) return null;
            const from = stars[(j * 5 + 2) % stars.length];
            const x = from.x + (f.tx - from.x) * f.p;
            const y = from.y + (690 - from.y) * f.p;
            const back = Math.max(0, f.p - 0.3);
            return (
              <g key={j}>
                <line x1={from.x + (f.tx - from.x) * back} y1={from.y + (690 - from.y) * back} x2={x} y2={y} stroke="#39B6FF" strokeWidth={10} strokeLinecap="round" opacity={0.6} />
                <circle cx={x} cy={y} r={40} fill="#39B6FF" opacity={0.35} />
                <circle cx={x} cy={y} r={18} fill="#BFEFFF" />
              </g>
            );
          })}
        </g>
        {/* line 5, under the bar's labels (y 800-920): a red flash and a blue flash leave together. No numbers - red
            simply dies first and blue carries on; they go again on "than any other colour could". */}
        <g opacity={lane}>
          <line x1={180} y1={822} x2={1380} y2={822} stroke="rgba(255,255,255,0.14)" strokeWidth={3} />
          <line x1={180} y1={874} x2={1380} y2={874} stroke="rgba(255,255,255,0.14)" strokeWidth={3} />
          <line x1={180} y1={822} x2={180 + 260 * ease(frame, raceAt, 40)} y2={822} stroke="#E8322B" strokeWidth={12} strokeLinecap="round" opacity={0.85} />
          <circle cx={180 + 260 * ease(frame, volley, 40)} cy={822} r={16} fill="#FF6B5E" opacity={1 - ease(frame, volley + 18, 26)} />
          <line x1={180} y1={874} x2={180 + 1200 * lin(frame, raceAt, raceAt + 70)} y2={874} stroke="#39B6FF" strokeWidth={12} strokeLinecap="round" />
          <circle cx={180 + 1200 * lin(frame, volley, volley + 70)} cy={874} r={44 + 30 * bump(frame, carryAt, 6, 24)} fill="#39B6FF" opacity={0.3} />
          <circle cx={180 + 1200 * lin(frame, volley, volley + 70)} cy={874} r={16 + 3 * Math.sin(frame / 4)} fill="#BFEFFF" />
        </g>
      </svg>
      <div style={{ opacity: ease(frame, answerAt, 10) * (1 - ease(frame, fishAt, 8)) }}>
        {/* one line (72 px, nowrap): at 84 px it wrapped to two, and the top line landed on the spectrum's labels (y 752-788) */}
        <CaptionPop bottom={150} size={72} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            the sea took red. life answered in <span style={{ color: "#39B6FF" }}>blue</span>
          </span>
        </CaptionPop>
      </div>

      {/* the red fish from level 1 returns - and disappears. It swims in from off the left edge, head (and eye) leading,
          and comes to rest centred on x=530: tail tip at x=230, nose at x=750, tag to ~850. The comb jelly's left edge is
          held at x≈870 or further right for these two lines (see `holds`), so neither the nose nor the tag reaches it. */}
      {/* pass 3: the comb jelly's tentacles (in the photo) ran straight through the drawn fish like a line through its
          nose. The left of the plate is masked to black while the fish is up; it clears just before the jelly (x~870). */}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, #000 0%, #000 41%, rgba(0,0,0,0) 46%)", opacity: 0.92 * fish }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: fish }}>
        <g transform={`translate(${fishX} ${560 + bob})`}>
          <path d={FISH_BODY} fill={fishRed} opacity={1 - vanish} />
          <path d={FISH_TAIL} fill={fishRed} opacity={1 - vanish} transform={`rotate(${wag} -220 0)`} />
          <circle cx={150} cy={-18} r={12} fill="#050E18" opacity={1 - vanish} />
          <path d={FISH_BODY} fill="none" stroke="#39B6FF" strokeWidth={2} strokeDasharray="6 10" opacity={vanish * 0.6} />
        </g>
        {/* "so many deep-sea animals are red" (line 8): two more swim in red, the same way round, and are gone with
            "red = invisible". At rest x 150-410 and x 515-801, y 695-795: under the first fish, above the caption
            (from y≈822) and left of the comb jelly. */}
        {[
          { x: 300, y: 740, s: 0.5, at: manyAt + 18 },
          { x: 680, y: 745, s: 0.55, at: manyAt },
        ].map((f, k) => {
          const gone = ease(frame, camoAt + k * 6, 20);
          return (
            <g key={f.x} transform={`translate(${f.x - 260 * (1 - ease(frame, f.at, 30))} ${f.y + bob * 0.6}) scale(${f.s})`} opacity={ease(frame, f.at, 10)}>
              <path d={FISH_BODY} fill="#E8322B" opacity={1 - gone} />
              <path d={FISH_TAIL} fill="#E8322B" opacity={1 - gone} transform={`rotate(${-wag} -220 0)`} />
              <circle cx={150} cy={-18} r={12} fill="#050E18" opacity={1 - gone} />
              <path d={FISH_BODY} fill="none" stroke="#39B6FF" strokeWidth={4} strokeDasharray="12 20" opacity={gone * 0.6} />
            </g>
          );
        })}
      </svg>
      {/* the second half of the tag waits for "No red light reaches this world" */}
      <Tag x={530} y={420} opacity={fish * (1 - vanish)} color="#E8322B" align="center">
        a red fish<span style={{ opacity: ease(frame, noRedAt, 10) }}> · no red light to reflect</span>
      </Tag>
      <div style={{ opacity: ease(frame, camoAt, 10) * (1 - ease(frame, coldAt, 8)) }}>
        <CaptionPop bottom={150} size={96}>red = invisible</CaptionPop>
      </div>

      {/* thermometer: about 4 °C from here down; the card steps forward on "all the way down" */}
      <div style={{ position: "absolute", left: 160, top: 360, opacity: ease(frame, coldAt, 12) * (1 - ease(frame, teaseAt, 8)), transform: `scale(${1 + 0.07 * bump(frame, allDownAt, 8, 22)})`, transformOrigin: "left top" }}>
        <NumberCard x={0} y={0} big="≈ 4 °C" small="FROM HERE ALL THE WAY DOWN" size={90} color={B.aqua} />
      </div>
      <div style={{ opacity: ease(frame, teaseAt, 8) }}>
        <CaptionPop bottom={150} size={78} color={B.paper}>
          5 down, 7 to go · next: a rule <span style={{ color: B.gauge }}>gets broken</span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};
