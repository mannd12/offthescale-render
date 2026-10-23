import React from "react";
import { Img, useCurrentFrame } from "remotion";
import { CaptionPop, levelImage } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease, lerp, windowed } from "../../../lib/ui";
import { LEVELS, pressureTag } from "../ladder";
import { NumberCard, RungShell, Tag } from "./shell";

/**
 * Level 9 - the abyss, 4,000-6,000 m. Sources: #22 (marine snow; some flakes fall for weeks),
 * #38 (abyssal plains ≈70 % of the ocean floor per NOAA; largest habitat), #11 (400-600 atm), #16.
 * Lines: 0 "Below 4,000 m... the abyss... a few degrees above freezing... four to six hundred times"
 * 1 "...wide, quiet plains of soft mud." 2 "No food is made down here. None. So the abyss lives on leftovers."
 * 3 "Far above, things die, and crumbs drift downward... marine snow... weeks" 4 "A whole world of animals... waiting for the snow."
 * 5 "...NOAA puts the abyssal plains at around seventy per cent of the ocean floor." 6 "...the largest habitat on Earth."
 * 7 "Not the rainforest. Not the grasslands. This." 8 "The default condition of our planet's surface..." 9 tease
 * Second plate (line 4): the grid-eye fish, Ipnops meadi - NOAA Ocean Exploration (EX1705), public domain.
 */
const GRIDEYE = { id: "g", name: "", reading: "", image: "grideye-fish" };

export const Abyss: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  // lines 0-2 used to be 19 s of one dark plate: each spoken idea now gets its own caption (#16, #11)
  const coldAt = within(t, 0, 0.43);
  const pressAt = within(t, 0, 0.7);
  const mudAt = lineAt(t, 1);
  const noFoodAt = lineAt(t, 2);
  const leftoversAt = within(t, 2, 0.55);
  const snowAt = lineAt(t, 3);
  const scrapsAt = within(t, 3, 0.31); // "— scraps of plankton, | dust, | waste."
  const dustAt = within(t, 3, 0.43);
  const wasteAt = within(t, 3, 0.47);
  const namedAt = within(t, 3, 0.62); // "Scientists call it marine snow"
  const animalsAt = lineAt(t, 4);
  const fishAt = within(t, 4, 0.5); // "...pale fish"
  const smallAt = lineAt(t, 5); // "And don't picture somewhere small."
  const seventyAt = within(t, 5, 0.55);
  const largestAt = within(t, 6, 0.66); // "...is the largest habitat on Earth." (0.5 was a second early)
  const notAt = lineAt(t, 7);
  const defaultAt = lineAt(t, 8);
  const teaseAt = lineAt(t, 9);
  const plainAt = within(t, 8, 0.4); // "...a dark plain under four kilometres of water"
  const crumbsAt = within(t, 8, 0.78); // "...waiting for crumbs to fall."

  // the gauge sinks slowly through the whole rung, 4,000 -> 6,000
  const depth = 4000 + 2000 * Math.min(1, frame / t.frames);
  const snow = ease(frame, snowAt, 20) * (1 - ease(frame, seventyAt, 12));
  // motion pass 2026-10-01: the snow comes back on "waiting for crumbs to fall" and keeps falling through the hand-off
  const crumbs = ease(frame, crumbsAt, 20);
  const snowfall = Math.max(snow, crumbs);
  // a second, nearer layer of bigger flakes thickens the fall when the snow gets its name
  const flurry = Math.max(ease(frame, namedAt, 20) * (1 - ease(frame, seventyAt, 12)), crumbs);
  // The inset is a fish (grid-eye fish, assets.md), so it now lands on "pale fish" (it used to open the line); the
  // plate's own sea cucumber gets the camera on "sea cucumbers". It leaves on "don't picture somewhere small"
  // (it used to stay until "70 %"), so the pull-back has the whole frame.
  const animals = ease(frame, fishAt, 14) * (1 - ease(frame, smallAt, 10));
  const seventy = ease(frame, seventyAt + 12, 14) * (1 - ease(frame, notAt, 10)); // after the snow tags have gone
  const fill = ease(frame, seventyAt + 18, 40);
  const compare = ease(frame, notAt, 12) * (1 - ease(frame, teaseAt, 8));
  // "Not the rainforest. Not the grasslands. This." - each card lands on its own word
  const cardAt = [notAt, within(t, 7, 0.42), within(t, 7, 0.82)];
  // the plate is a very dark photo: full brightness while it is the only picture, dimmed under the bar and cards
  const brightness = 1 - 0.3 * ease(frame, seventyAt, 20);

  const flakes = Array.from({ length: 140 }, (_, i) => ({ x: (i * 7919) % 1500 + 120, sp: 0.6 + (i % 5) * 0.25, ph: (i * 104729) % 1000, r: 1.5 + (i % 3) }));
  const bigFlakes = Array.from({ length: 26 }, (_, i) => ({ x: (i * 4513) % 1340 + 130, sp: 2.2 + (i % 4) * 0.5, ph: (i * 7907) % 1100, r: 4 + (i % 3) * 1.5 }));

  // Camera on the plate (replaces the shell's default drift, and matches it until the snow starts):
  // "Far above" looks up; the frame then follows the crumbs down until "before they land"; line 4 pushes in on the
  // plate's own sea cucumber (assets.md: `swimming-cucumber`); "don't picture somewhere small" pulls back to the
  // whole plain; the hand-off sinks toward the floor. Nothing on screen is anchored to a spot in the photo.
  const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
  const smooth = (a: number, b: number) => {
    const k = clamp01((frame - a) / (b - a));
    return k * k * (3 - 2 * k);
  };
  const up = smooth(snowAt, snowAt + 45);
  const down = smooth(within(t, 3, 0.15), within(t, 3, 0.95));
  const push = smooth(animalsAt, animalsAt + 48); // arrives as "sea cucumbers" is said
  const wide = smooth(smallAt, smallAt + 50);
  const sink = smooth(teaseAt, t.frames);
  let camScale = 1 + (0.08 * Math.min(frame, snowAt)) / t.frames;
  camScale = lerp(camScale, 1.25, up);
  camScale = lerp(camScale, 1.3 + 0.04 * clamp01((frame - animalsAt) / (smallAt - animalsAt)), push);
  camScale = lerp(camScale, 1 + 0.07 * clamp01((frame - smallAt) / (t.frames - smallAt)) + 0.1 * sink, wide);
  const camX = lerp(lerp(50, 22, push), 50, wide);
  const camY = lerp(lerp(lerp(lerp(45, 0, up), 100, down), 56, push), 45 + 40 * sink, wide);

  // the flakes are drawn, so while they are over the photo the chip says so (as Level 5 does for its drawn lights)
  const credit =
    snowfall > 0.5
      ? { kind: "illustration" as const, source: "drawn snow over NOAA Ocean Exploration photos · Puerto Rico 2015, Pacific 2017" }
      : { kind: "real" as const, source: "NOAA Ocean Exploration · Puerto Rico 2015, Pacific 2017" };

  return (
    <RungShell t={t} index={8} depth={depth} plate={LEVELS[8]} brightness={brightness} credit={credit} sub={pressureTag(depth, "just above freezing")} plateMove={{ scale: camScale, origin: `${camX}% ${camY}%` }}>
      {/* lines 0-2: one caption per spoken idea */}
      <div style={{ opacity: windowed(frame, lineAt(t, 0) + 6, coldAt, 8) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          below 4,000 m: <span style={{ color: B.gauge, opacity: ease(frame, within(t, 0, 0.3), 8) }}>the abyss</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: windowed(frame, coldAt, pressAt, 8) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          a few degrees <span style={{ color: B.gauge }}>above freezing</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: windowed(frame, pressAt, mudAt, 8) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          <span style={{ color: B.gauge }}>400–600×</span> the pressure at the surface
        </CaptionPop>
      </div>
      <div style={{ opacity: windowed(frame, mudAt, noFoodAt, 8) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          wide, quiet plains of <span style={{ color: B.gauge }}>soft mud</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: windowed(frame, noFoodAt, leftoversAt, 8) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          <span style={{ color: B.gauge }}>no food</span> is made down here
        </CaptionPop>
      </div>
      <div style={{ opacity: windowed(frame, leftoversAt, snowAt, 8) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          the abyss lives on <span style={{ color: B.gauge }}>leftovers</span>
        </CaptionPop>
      </div>

      {/* marine snow: flakes drifting down through the lights */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: snowfall }}>
        {flakes.map((f, i) => {
          const y = ((frame * f.sp + f.ph) % 900) + 200;
          return <circle key={i} cx={f.x + Math.sin((frame + f.ph) / 40) * 12} cy={y} r={f.r} fill="#E6EEF5" opacity={0.5 + 0.4 * ((i * 3) % 2)} />;
        })}
        {/* the nearer flakes: bigger, faster, fainter - in on "marine snow" */}
        <g opacity={flurry}>
          {bigFlakes.map((f, i) => {
            const y = ((frame * f.sp + f.ph) % 1100) + 100;
            return <circle key={i} cx={f.x + Math.sin((frame + f.ph) / 30) * 18} cy={y} r={f.r} fill="#E6EEF5" opacity={0.3 + 0.12 * (i % 2)} />;
          })}
        </g>
      </svg>
      {/* line 3, "scraps of plankton, dust, waste": the three crumbs, each on its word */}
      <div style={{ opacity: windowed(frame, scrapsAt, within(t, 3, 0.56), 8) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          scraps of <span style={{ color: B.gauge }}>plankton</span>
          <span style={{ opacity: ease(frame, dustAt, 6) }}>
            {" · "}
            <span style={{ color: B.gauge }}>dust</span>
          </span>
          <span style={{ opacity: ease(frame, wasteAt, 6) }}>
            {" · "}
            <span style={{ color: B.gauge }}>waste</span>
          </span>
        </CaptionPop>
      </div>
      {/* the name waits for "Scientists call it marine snow" (it used to lead the tag, 7 s early); both tags leave on
          "don't picture somewhere small" with the inset */}
      <Tag x={160} y={300} opacity={snow * (1 - ease(frame, smallAt, 10))}>
        crumbs from kilometres above
        {frame >= namedAt ? <span style={{ color: B.gauge, opacity: ease(frame, namedAt, 10) }}> · marine snow</span> : null}
      </Tag>
      <Tag x={160} y={340} opacity={snow * ease(frame, within(t, 3, 0.8), 10) * (1 - ease(frame, smallAt, 10))} color={B.gauge}>some flakes fall for weeks</Tag>

      {/* the animals waiting: a second real plate (grid-eye fish on the plain) */}
      <div style={{ position: "absolute", left: 160, top: 400, width: 700, height: 400, borderRadius: 22, overflow: "hidden", outline: `4px solid ${B.paper}`, opacity: animals, boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
        <Img src={levelImage(GRIDEYE)!} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <Tag x={160} y={810} opacity={animals}>a whole world, waiting for the snow</Tag>

      {/* 70 %: the ocean floor as a bar that fills */}
      <div style={{ position: "absolute", left: 160, top: 360, width: 1200, opacity: seventy }}>
        <Tag x={0} y={0} color={B.mute}>the ocean floor</Tag>
        <div style={{ position: "absolute", left: 0, top: 44, width: 1200, height: 70, borderRadius: 35, background: "rgba(255,255,255,0.14)", outline: "3px solid rgba(255,255,255,0.5)", overflow: "hidden" }}>
          <div style={{ width: `${70 * fill}%`, height: "100%", background: "#8CA0B3" }} />
        </div>
        {/* the card swells on "flat, freezing, permanently dark mud" (its own small line), so the wait for the caption is not a still */}
        <div style={{ position: "absolute", left: 0, top: 140, width: 1020, height: 164, opacity: ease(frame, seventyAt + 30, 10), transform: `scale(${1 + 0.05 * ease(frame, within(t, 6, 0.24), 8) * (1 - ease(frame, within(t, 6, 0.24) + 10, 24))})`, transformOrigin: "0% 50%" }}>
          <NumberCard x={0} y={0} big="≈ 70 %" small="ABYSSAL PLAINS · NOAA'S FIGURE · FLAT, DARK MUD" size={96} />
        </div>
      </div>
      <div style={{ opacity: ease(frame, largestAt, 10) * (1 - ease(frame, notAt, 8)) }}>
        <CaptionPop bottom={150} size={88}>the largest habitat on Earth</CaptionPop>
      </div>

      {/* not the rainforest, not the grasslands: three cards, two struck out. Line 8 points back at the third
          ("a dark plain under four kilometres of water"), so it steps forward on those words. */}
      <div style={{ position: "absolute", left: 160, top: 380, display: "flex", gap: 24, opacity: compare }}>
        {[
          ["rainforest", "#2E8B57", true],
          ["grasslands", "#B8A33A", true],
          ["dark mud,\n4 km down", "#3A4A58", false], // broken by hand: it used to wrap with "down" alone on line 2
        ].map(([name, colour, struck], i) => (
          <div key={String(name)} style={{ width: 380, height: 220, borderRadius: 22, background: String(colour), display: "flex", alignItems: "center", justifyContent: "center", position: "relative", opacity: ease(frame, cardAt[i], 10), outline: struck ? "none" : `6px solid ${B.gauge}`, transform: struck ? undefined : `scale(${1 + 0.06 * ease(frame, plainAt, 10)})`, transformOrigin: "0% 50%", boxShadow: struck ? undefined : `${12 * ease(frame, plainAt, 10)}px 0 ${22 * ease(frame, plainAt, 10)}px rgba(255,200,61,0.55)` }}>
            <div style={{ fontFamily: F.headline, fontSize: 44, color: B.paper, textAlign: "center", padding: 20, whiteSpace: "pre-line" }}>{String(name)}</div>
            {struck ? <div style={{ position: "absolute", left: 20, right: 20, top: "50%", height: 10, background: B.tease, transform: "rotate(-12deg)", opacity: ease(frame, cardAt[i] + 10, 8) }} /> : null}
          </div>
        ))}
      </div>
      <div style={{ opacity: ease(frame, defaultAt, 10) * (1 - ease(frame, teaseAt, 8)) }}>
        <CaptionPop bottom={150} size={72} color={B.paper}>
          the planet's default surface: <span style={{ color: B.gauge, opacity: ease(frame, plainAt, 8) }}>a dark plain, waiting for crumbs</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, teaseAt, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          9 down · next: the sea floor <span style={{ color: B.gauge }}>simply ends</span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};
