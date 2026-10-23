import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { CaptionPop } from "../../../brand/kit";
import { B } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { LEVELS, depthPos } from "../ladder";
import { RungShell, Tag } from "./shell";

/**
 * Level 2 - the last plant, 200 m. Sources: #3 (200 m / twilight 200-1,000 m), #4, #9
 * (counter-illumination: belly photophores match the down-welling light).
 * Lines: 0 "Two hundred metres..." 1 "Below this line there isn't enough light for photosynthesis..."
 * 2 "Welcome to the twilight zone... down to a thousand metres" 3 "...nowhere to hide."
 * 4 "No rocks, no weeds... silhouette for anything looking up from below."
 * 5 "So the animals here cheat. Hatchetfish and lanternfish carry rows of tiny lamps..."
 * 6 "From underneath, the shadow simply... disappears." 7 "It's called counter-illumination..."
 * 8 tease
 */
export const LastPlant: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const zoneAt = lineAt(t, 2);
  const hideAt = lineAt(t, 3);
  const silhouetteAt = hideAt + 10; // the fish appears with 'nowhere to hide', not 4 s later
  const lampsAt = within(t, 5, 0.45);
  const goneAt = within(t, 6, 0.6);
  const nameAt = lineAt(t, 7);
  const teaseAt = lineAt(t, 8);

  // motion pass (2026-10-01). Lines 0-2 used to be the photo alone for 25 s and lines 3-5 a frozen diagram
  // for 17 s; every cue below is the word it is keyed to.
  const lookUpAt = within(t, 0, 0.2); // "Look up, and there's still a soft blue glow above you."
  const enoughAt = within(t, 0, 0.76); // "But it's no longer enough."
  const thisLineAt = lineAt(t, 1); // "Below this line ..."
  const noLightAt = within(t, 1, 0.14); // "... there isn't enough light for photosynthesis"
  const hereDownAt = within(t, 1, 0.44); // "so from about here to the bottom of the sea"
  const animalsAt = within(t, 1, 0.77); // "it's animals and microbes only"
  const thousandAt = within(t, 2, 0.2); // "It runs from here down to a thousand metres"
  const thousandWordAt = within(t, 2, 0.36); // "... down to | a thousand metres" - the number waits for the words
  const seeByAt = within(t, 2, 0.47); // "just enough light for animals to see by"
  const tooLittleAt = within(t, 2, 0.76); // "far too little for a plant to live on"
  const nowhereAt = within(t, 3, 0.6); // "There is nowhere to hide."
  const rocksAt = within(t, 4, 0.01); // "No rocks,"
  const weedsAt = within(t, 4, 0.075); // "no weeds,"
  const floorAt = within(t, 4, 0.14); // "no sea floor"
  const faintAt = within(t, 4, 0.37); // "and a faint light above"
  const bodyAt = within(t, 4, 0.66); // "turns your body into a silhouette"
  const lookingAt = within(t, 4, 0.78); // "for anything looking up from below"
  const hatchetAt = within(t, 5, 0.155); // "Hatchetfish"
  const lanternAt = within(t, 5, 0.235); // "and lanternfish"
  const tuneAt = within(t, 5, 0.6); // "and they tune the glow"
  const matchAt = within(t, 5, 0.72); // "to match the light coming down from the surface"
  const underAt = lineAt(t, 6); // "From underneath, ..."
  const firstLightsAt = within(t, 7, 0.31); // "The first lights in the deep aren't for seeing."
  const notSeenAt = within(t, 7, 0.76); // "They're for not being seen."
  const pulse = (at: number, hold = 16) => ease(frame, at, 8) * (1 - ease(frame, at + 8, hold));

  const diagram = ease(frame, hideAt, 14) * (1 - ease(frame, teaseAt, 10));
  const lamps = ease(frame, lampsAt, 20);
  const gone = ease(frame, goneAt, 24);
  // the fish's silhouette against the glow: full dark; a shade lighter once the lamps are tuned to the light
  // above; erased on "disappears" (same end state as before: 8 % left)
  const match = ease(frame, matchAt, 40);
  const fishDark = 1 - match * 0.3 - gone * 0.62;

  // --- the photo, lines 0-2 and the hand-off ---
  // Camera: "Look up" tilts to the top of the frame; "Below this line" comes back to the gauge line; the
  // twilight zone "runs from here down" tilts down; the hand-off keeps sinking until the cut.
  const tail = interpolate(frame, [teaseAt, t.frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sink = interpolate(frame, [thousandAt, hideAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const camScale = 1 + (0.02 * frame) / t.frames + 0.16 * ease(frame, lookUpAt, 40) - 0.08 * ease(frame, thisLineAt, 30) + 0.06 * ease(frame, zoneAt, 36) + 0.05 * sink + 0.04 * tail;
  const camY = 45 - 39 * ease(frame, lookUpAt, 40) + 28 * ease(frame, thisLineAt, 30) + 28 * ease(frame, zoneAt, 36) - 62 * ease(frame, teaseAt - 40, 30); // pass 4: the origin goes to the top edge while the plate is dark under the diagram, so at the hand-off the fish's snout (y~177 unscaled) lands under the tile strip's progress bars, not behind the tiles
  // "But it's no longer enough": the light drops (0.85 -> 0.65) and stays down until the hand-off
  const dim = ease(frame, enoughAt, 24) * (1 - ease(frame, teaseAt, 10));
  const onPhoto = 1 - ease(frame, hideAt, 10);
  const line1 = onPhoto * (1 - ease(frame, zoneAt, 10));
  // "this line" = the gauge's 200 m, "a thousand metres" = its next stop: both are drawn out from the gauge
  const y200 = 250 + depthPos(200) * 700;
  const y1000 = 250 + depthPos(1000) * 700;
  const draw200 = ease(frame, thisLineAt + 4, 30);
  const draw1000 = ease(frame, thousandAt, 30);
  const drawDown = ease(frame, hereDownAt, 40);
  const arrowY = y200 + 10 + (784 - (y200 + 10)) * drawDown; // end of the arrow's shaft; its head adds 24 px

  // --- the diagram, lines 3-7 ---
  // the fish swims across the panel for as long as the diagram is up (nose never left of x 380, tail never
  // right of x 1,400: inside the panel, x 260-1,440)
  const fishX = interpolate(frame, [silhouetteAt, teaseAt], [1150, 570], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fishY = 520 + Math.sin(frame / 30) * 6;
  // the hunter's pupil follows the fish; once the shadow is gone it sweeps left and right, looking for it
  const pupilX = (1 - gone) * Math.max(-20, Math.min(20, (fishX - 850) / 15)) + gone * 20 * Math.sin((frame - goneAt) / 12);
  const eyeScale = 1 + 0.3 * pulse(lookingAt, 30) + 0.3 * pulse(underAt, 30);
  // "They're for not being seen": the hunter gives up and drifts off to the right
  const leave = ease(frame, notSeenAt, 50);
  const hunter = ease(frame, silhouetteAt + 10, 12) * (1 - ease(frame, notSeenAt + 12, 30));
  // "they tune the glow": the lamps flicker while they search for the right level, then settle
  const tuning = ease(frame, tuneAt, 8) * (1 - ease(frame, matchAt, 30));
  const lampsDown = 1 - 0.6 * ease(frame, notSeenAt, 30);

  // The diagram panel does not cover the frame: at 0.55 the lancetfish's head and tail poked out above
  // and below it under an "ILLUSTRATION" chip. The plate goes to near-black while the diagram is up,
  // and comes back (with its NOAA credit) for the hand-off line.
  return (
    <RungShell
      t={t}
      index={1}
      depth={200}
      plate={LEVELS[1]}
      brightness={(0.85 - 0.2 * dim) * (1 - diagram) + 0.04 * diagram}
      plateMove={{ scale: camScale, origin: `52% ${camY}%` }}
      credit={diagram > 0.5 ? { kind: "illustration" } : { kind: "real", source: "NOAA Ocean Exploration · a lancetfish in midwater, 2017" }}
    >
      {/* lines 1-2, over the photo: the 200 m line the narrator points at, and the band it opens.
          200 m line y 341 (x 140-1,572, ends at the readout bubble, whose left edge is ~1,578); 1,000 m line
          y 460 (x 140-1,736, ends at its stop label). Both come out of the gauge, right to left. */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: onPhoto }}>
        <rect x={1572 - 1432 * draw1000} y={y200} width={1432 * draw1000} height={y1000 - y200} fill={B.aqua} opacity={0.22} />
        <line x1={1572} y1={y200} x2={1572 - 1432 * draw200} y2={y200} stroke={B.gauge} strokeWidth={5} strokeLinecap="round" opacity={draw200 > 0 ? 1 : 0} />
        <line x1={1736} y1={y1000} x2={1736 - 1596 * draw1000} y2={y1000} stroke={B.aqua} strokeWidth={4} strokeLinecap="round" opacity={draw1000 > 0 ? 1 : 0} />
        {/* "from about here to the bottom of the sea": an arrow runs down from just under the line
            (x 180, y 351 -> tip at 808; the head always sits below the line it starts from) */}
        <g opacity={line1 * (drawDown > 0 ? 1 : 0)}>
          <line x1={180} y1={y200 + 10} x2={180} y2={arrowY} stroke={B.paper} strokeWidth={5} strokeDasharray="14 12" />
          <path d={`M166 ${arrowY} L194 ${arrowY} L180 ${arrowY + 24} Z`} fill={B.paper} />
        </g>
      </svg>
      {/* line 1 in two captions, each on its words (sources.md #3): what stops at the line, and what is left below it */}
      <div style={{ opacity: ease(frame, noLightAt, 10) * (1 - ease(frame, animalsAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={68} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>not enough light for photosynthesis</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, animalsAt, 10) * (1 - ease(frame, zoneAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={84}>
          <span style={{ whiteSpace: "nowrap" }}>animals and microbes only</span>
        </CaptionPop>
      </div>
      {/* line 2, second half: a smaller row above the zone caption (y ~760-818; the caption starts at y ~836),
          one clause at a time - the narrator's words, sources.md #4 */}
      <div style={{ opacity: ease(frame, seeByAt, 10) * (1 - ease(frame, tooLittleAt - 8, 8)) }}>
        <CaptionPop bottom={262} size={52} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>enough light for animals to see by</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, tooLittleAt, 10) * (1 - ease(frame, hideAt, 10)) }}>
        <CaptionPop bottom={262} size={52}>
          <span style={{ whiteSpace: "nowrap" }}>far too little for a plant to live on</span>
        </CaptionPop>
      </div>

      {/* the zone band: 200 -> 1,000 m named on screen. Two states of one caption: "twilight zone · 200 m" on
          "Welcome to the twilight zone", then "200 – 1,000 m" on "a thousand metres". The second number's space
          is reserved from the start, so the first state is pushed right by half of what is still hidden (the
          " – 1,000" between "200" and "m", ~276 px at this size) to sit centred, and slides back as it arrives.
          The first state's unit is a zero-width inline-block laid over the reserved space; it fades as the range comes in. */}
      <div style={{ opacity: ease(frame, zoneAt, 10) * (1 - ease(frame, hideAt, 10)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap", transform: `translateX(${138 * (1 - ease(frame, thousandWordAt, 8))}px)` }}>
            twilight zone ·{" "}
            <span style={{ color: B.gauge }}>
              200
              <span style={{ display: "inline-block", width: 0, textAlign: "left", whiteSpace: "nowrap", opacity: 1 - ease(frame, thousandWordAt, 3) }}>{"\u00A0m"}</span>
              <span style={{ opacity: ease(frame, thousandWordAt, 8) }}> – 1,000 m</span>
            </span>
          </span>
        </CaptionPop>
      </div>

      {/* counter-illumination: looking UP from below. Glow at the top, a fish between, an eye beneath. */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: diagram }}>
        <defs>
          <radialGradient id="glow" cx="50%" cy="0%" r="70%">
            <stop offset="0%" stopColor="#7FD6F0" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#1E6C8F" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#050E18" stopOpacity="0" />
          </radialGradient>
          <clipPath id="l02-panel">
            <rect x={260} y={220} width={1180} height={720} rx={28} />
          </clipPath>
          {/* the shafts fade to nothing with depth: flat fills ended in a hard edge at y 720 that read as a
              ledge under "no sea floor" (fix run 2, item 2.1) */}
          <linearGradient id="l02-shaft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7FD6F0" stopOpacity="1" />
            <stop offset="100%" stopColor="#7FD6F0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x={260} y={220} width={1180} height={720} rx={28} fill="#061422" />
        <rect x={260} y={220} width={1180} height={720} rx={28} fill="url(#glow)" />
        {/* "a faint light above": the glow swells on the words */}
        <rect x={260} y={220} width={1180} height={720} rx={28} fill="url(#glow)" opacity={0.7 * pulse(faintAt, 40)} />
        {/* the light from the surface is never still: three soft shafts that sway and breathe */}
        <g clipPath="url(#l02-panel)">
          {[0, 1, 2].map((k) => {
            const top = 560 + k * 290 + Math.sin(frame / 60 + k * 2) * 40;
            const foot = top - 140 + k * 140 + Math.sin(frame / 45 + k) * 60;
            return <path key={k} d={`M${top - 50} 220 L${top + 50} 220 L${foot + 150} 720 L${foot - 150} 720 Z`} fill="url(#l02-shaft)" opacity={0.05 + 0.035 * Math.sin(frame / 23 + k * 2.1) + 0.06 * pulse(faintAt, 40)} />;
          })}
        </g>
        {/* the fish, seen from below, drawn as a silhouette - swimming, tail beating */}
        <g transform={`translate(${fishX} ${fishY}) scale(${1 + 0.1 * pulse(bodyAt, 24)})`} opacity={ease(frame, silhouetteAt, 12)}>
          <path d="M-190 0 C -120 -70, 120 -70, 190 0 C 120 60, -120 60, -190 0 Z" fill="#050E18" opacity={fishDark} />
          <path d="M190 0 L 250 -50 L 250 50 Z" fill="#050E18" opacity={fishDark} transform={`rotate(${Math.sin(frame / 6) * 9} 190 0)`} />
          {/* "turns your body into a silhouette": the outline flashes on the word */}
          <path d="M-190 0 C -120 -70, 120 -70, 190 0 C 120 60, -120 60, -190 0 Z" fill="none" stroke={B.paper} strokeWidth={4} opacity={pulse(bodyAt, 30)} />
          {/* belly lamps: a row of photophores that light nose to tail, flicker while they are tuned, and
              ripple on "the first lights in the deep" */}
          {Array.from({ length: 11 }, (_, i) => {
            const on = ease(frame, lampsAt + i * 3, 14);
            const flicker = 1 - 0.7 * tuning * (0.5 + 0.5 * Math.sin(frame / 2.5 + i * 1.9));
            return <circle key={i} cx={-150 + i * 30} cy={26 - Math.abs(i - 5) * 3} r={7 + 5 * pulse(firstLightsAt + i * 3, 12)} fill="#BFEFFF" opacity={lamps * on * flicker * lampsDown * (0.6 + 0.4 * ((i * 3) % 2))} />;
          })}
        </g>
        {/* the hunter's eye below, looking up - at y 770 so the captions at the bottom (ink from ~835) never cover it */}
        <g transform={`translate(${850 + 500 * leave} 770) scale(${eyeScale})`} opacity={hunter}>
          <ellipse cx={0} cy={0} rx={46} ry={26} fill="#0B1B2B" stroke="#8CA0B3" strokeWidth={3} />
          <circle cx={pupilX} cy={-3} r={12} fill="#FFC83D" />
        </g>
        {/* its line of sight follows the fish, and breaks when the shadow is gone */}
        <line x1={850} y1={738} x2={fishX} y2={fishY + 80} stroke={interpolateColors(pulse(lookingAt, 30) + pulse(underAt, 30), [0, 1], ["#8CA0B3", "#FFC83D"])} strokeWidth={2 + 2 * (pulse(lookingAt, 30) + pulse(underAt, 30))} strokeDasharray="8 10" strokeDashoffset={-frame * 0.8} opacity={ease(frame, silhouetteAt + 10, 12) * (1 - gone)} />
      </svg>
      <Tag x={290} y={240} opacity={diagram} color={B.mute}>looking up from below</Tag>
      <Tag x={290} y={752} opacity={diagram * hunter * (1 - ease(frame, notSeenAt, 10))} color={interpolateColors(pulse(lookingAt, 30), [0, 1], [B.paper, B.gauge])}>a hunter, looking up</Tag>
      <Tag x={1410} y={240} opacity={diagram} color={interpolateColors(pulse(faintAt, 40), [0, 1], [B.aqua, B.paper])} align="right">faint light from the surface</Tag>
      {/* this tag travels with the fish */}
      <Tag x={fishX + 270} y={560} opacity={diagram * lamps} color="#BFEFFF">belly lamps on</Tag>

      {/* captions inside the panel's bottom strip (y ~835-930), one idea at a time, each on its words */}
      <div style={{ opacity: ease(frame, nowhereAt, 8) * (1 - ease(frame, lineAt(t, 4) - 8, 8)) }}>
        <CaptionPop bottom={150} size={92}>nowhere to hide</CaptionPop>
      </div>
      <div style={{ opacity: 1 - ease(frame, faintAt - 8, 8) }}>
        <CaptionPop bottom={150} size={72} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            <span style={{ opacity: ease(frame, rocksAt, 6) }}>no rocks</span>
            <span style={{ opacity: ease(frame, weedsAt, 6) }}> · no weeds</span>
            <span style={{ opacity: ease(frame, floorAt, 6) }}> · no sea floor</span>
          </span>
        </CaptionPop>
      </div>
      {/* "turns your body into a silhouette" - with the outline flash on the fish above */}
      <div style={{ opacity: ease(frame, bodyAt, 8) * (1 - ease(frame, hatchetAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            your body: <span style={{ color: B.gauge }}>a silhouette</span>
          </span>
        </CaptionPop>
      </div>
      {/* named out loud, sources.md #9 - a caption, not a label on the drawn fish */}
      <div style={{ opacity: 1 - ease(frame, lampsAt - 8, 8) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            <span style={{ opacity: ease(frame, hatchetAt, 8) }}>hatchetfish</span>
            <span style={{ opacity: ease(frame, lanternAt, 8) }}> · lanternfish</span>
          </span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, tuneAt, 10) * (1 - ease(frame, underAt, 10)) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>tuned to match the light above</span>
        </CaptionPop>
      </div>

      <div style={{ opacity: ease(frame, goneAt, 10) * (1 - ease(frame, nameAt + 20, 10)) }}>
        <CaptionPop bottom={150} size={92}>hiding by glowing</CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, nameAt + 20, 10) * (1 - ease(frame, teaseAt, 8)) }}>
        <CaptionPop bottom={150} size={84}>counter-illumination</CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, teaseAt, 8) }}>
        {/* With the spoken qualifier ("...has ever gone on their own"): without it the claim is false - Level 3 is
            332 m and the video later puts people at 10,935 m. One line: 48 chars at 62 px need ~1,340 px of the
            1,420 px box (at 80 px the shorter old caption already wrapped "gone" alone). */}
        <CaptionPop bottom={150} size={62} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            next: the deepest a human has gone <span style={{ color: B.gauge }}>on their own</span>
          </span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};
