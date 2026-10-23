import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { CaptionPop, CreditChip, Tile, levelImage } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { LEVELS, LEVELS_REVEALED, PROBLEMS } from "../ladder";
import { NumberCard, RungShell, Tag } from "./shell";

// Motion pass 2026-10-01 (one fix run before the review): every line has a visible change cued to its words, the
// photos take a camera move, and the labels follow docs/PROCESS.md (REAL FOOTAGE only over an untouched photo; a photo
// of something other than what is named says so on the picture; nothing before its words or after its line).

/** even 0-1 between two frames */
const lin = (f: number, a: number, b: number) => Math.min(1, Math.max(0, (f - a) / Math.max(1, b - a)));
/** 0-1 with a soft start and stop */
const smooth = (f: number, a: number, b: number) => {
  const x = lin(f, a, b);
  return x * x * (3 - 2 * x);
};
/** a short pulse: up over `up` frames, back down over `down` */
const bump = (f: number, at: number, up = 8, down = 24) => {
  const u = f - at;
  return u <= 0 ? 0 : u < up ? u / up : Math.max(0, 1 - (u - up) / down);
};
/** fractional part, safe for negative input */
const fract = (x: number) => ((x % 1) + 1) % 1;

/** One position of the camera on a plate: [frame, scale, origin x %, origin y %]; "move" = eased into, otherwise a slow drift. Each scene writes its own list. */
type Shot = [number, number, number, number, "move"?];
const cameraAt = (frame: number, shots: Shot[]) => {
  let i = 0;
  while (i < shots.length - 2 && frame >= shots[i + 1][0]) i++;
  const a = shots[i];
  const b = shots[i + 1];
  const k = b[4] === "move" ? smooth(frame, a[0], b[0]) : lin(frame, a[0], b[0]);
  return { scale: a[1] + (b[1] - a[1]) * k, origin: `${a[2] + (b[2] - a[2]) * k}% ${a[3] + (b[3] - a[3]) * k}%` };
};

/** A label on its own dark scrim, for words that sit on a photo. A part that has not been said yet is not rendered at all, so no empty scrim shows. */
const Pill: React.FC<{ x: number; y: number; size?: number; color?: string; opacity?: number; children: React.ReactNode }> = ({ x, y, size = 26, color = B.paper, opacity = 1, children }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity, padding: "6px 14px", borderRadius: 10, background: "rgba(5,14,24,0.8)", fontFamily: F.ui, fontWeight: 800, fontSize: size, lineHeight: `${size + 8}px`, letterSpacing: 1.5, textTransform: "uppercase", color, whiteSpace: "nowrap" }}>
    {children}
  </div>
);

// The NOAA clip (the shell plays it from the scene's first frame) opens on NOAA's own title card. Scene frame 216
// (7.2 s into the clip) is the earliest frame known to be clean footage, and the trimmed clip is 12 s long - so the
// scene only shows it between these two frames and uses the sharp still of the same animal the rest of the time.
const CLIP_CLEAN = 216;
const CLIP_END = 358;

/**
 * 5 · The Giant. Lines 0-7. Sources #5, #16, #18. Plates: the NOAA isopod still (camera moves) and, for the name, the NOAA clip.
 * 0 "You have met a relative of this animal. The pill bug... rolls into a ball... Now imagine one a foot and a half long."
 * 1 "That's the giant isopod, Bathynomus giganteus. NOAA has filmed them... around a thousand metres down, and eating whatever falls..."
 * 2 "They live from a couple of hundred metres down to more than two thousand... four degrees. Fourteen legs... curls into a ball"
 * 3 "Even their eggs are oversized: just over a centimetre across, among the largest..., twenty or thirty at a time in a pouch"
 * 4 "Why so big? ...animals in deep, cold water often grow much larger than their shallow-water relatives."
 * 5 "Biologists call it deep-sea gigantism. Why it happens is still argued: ...the cold, the scarcity of food, and the slow metabolism"
 * 6 "There are more than twenty species of these giants, and this one is the biggest. What isn't argued is that it happens."
 * 7 "And this particular giant has one more trick. The next type is the same animal — and what it can do when the food stops coming."
 */
export const Giant: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const pillAt = within(t, 0, 0.26); // "The pill bug"
  const rollAt = within(t, 0, 0.54); // "rolls into a ball"
  const imagineAt = within(t, 0, 0.77); // "Now imagine one"
  const footAt = within(t, 0, 0.87); // "a foot and a half long"
  const nameAt = lineAt(t, 1);
  const bathyAt = within(t, 1, 0.14); // "Bathynomus giganteus"
  const filmedAt = within(t, 1, 0.27); // "NOAA has filmed them"
  const thousandAt = within(t, 1, 0.49); // "around a thousand metres down"
  const fallsAt = within(t, 1, 0.67); // "and eating whatever falls from above"
  const rangeAt = lineAt(t, 2);
  const degreesAt = within(t, 2, 0.42); // "in water of about four degrees"
  const legsAt = within(t, 2, 0.58); // "Fourteen legs"
  const curlAt = within(t, 2, 0.82); // "it curls into a ball when bothered"
  const eggsAt = lineAt(t, 3);
  const acrossAt = within(t, 3, 0.19); // "just over a centimetre across"
  const largestAt = within(t, 3, 0.37); // "among the largest of any marine invertebrate"
  const pouchAt = within(t, 3, 0.64); // "carried twenty or thirty at a time"
  const inPouchAt = within(t, 3, 0.85); // "in a pouch under the mother"
  const whyAt = lineAt(t, 4);
  const patternAt = within(t, 4, 0.1); // "This is a pattern across the deep"
  const deepAt = within(t, 4, 0.36); // "animals in deep, cold water"
  const growAt = within(t, 4, 0.57); // "often grow much larger"
  const thanAt = within(t, 4, 0.75); // "than their shallow-water relatives"
  const gigAt = lineAt(t, 5);
  const gigNameAt = within(t, 5, 0.11); // "deep-sea gigantism"
  const arguedAt = within(t, 5, 0.24); // "Why it happens is still argued"
  const suspectsAt = within(t, 5, 0.43); // "the usual suspects are"
  const suspectAt = [within(t, 5, 0.56), within(t, 5, 0.62), within(t, 5, 0.77)]; // "the cold" · "the scarcity of food" · "the slow metabolism"
  const nineAt = lineAt(t, 6);
  const speciesAt = within(t, 6, 0.09); // "more than twenty species"
  const biggestAt = within(t, 6, 0.45); // "and this one is the biggest"
  const notArguedAt = within(t, 6, 0.7); // "What isn't argued is that it happens"
  const teaseAt = lineAt(t, 7);
  const sameAt = within(t, 7, 0.5); // "the same animal"
  const foodAt = within(t, 7, 0.8); // "when the food stops coming"

  // the clip plays under "That's the giant isopod, Bathynomus giganteus" only (see CLIP_CLEAN / CLIP_END)
  const clipIn = Math.max(nameAt - 14, CLIP_CLEAN);
  const clipOut = Math.max(clipIn, Math.min(filmedAt, CLIP_END));
  const onClip = frame >= clipIn && frame < clipOut;

  // line 0: the pill bug is drawn over the dimmed photo, rolls up, then drops to its size beside a 45 cm animal
  const drawn = frame < clipIn ? ease(frame, pillAt, 12) : 0; // it leaves on the cut to the clip
  const curl = smooth(frame, rollAt, rollAt + 18);
  const toScale = smooth(frame, imagineAt, imagineAt + 26);
  const giant = smooth(frame, imagineAt + 6, imagineAt + 36);
  const bugX = 760 + 70 * curl * (1 - toScale) - 410 * toScale;
  const bugY = 600 + 113 * toScale;
  const bugK = 1 - 0.887 * toScale; // the 124 px ball ends 14 px across: 1 cm at the 45 cm animal's scale, as before (no size is stated)
  const rx = 130 - 68 * curl;
  const ry = 55 + 7 * curl;

  // The camera on the still (1920 px wide, scale <= 1.25). The animal fills the right two thirds: head and mouth near
  // 47 % / 59 %, legs along the bottom, bare sand on the left - so the cards sit on the left with the origin at the left edge.
  // It never shows the plain full frame: Type 6 uses the same photo and opens on exactly that.
  const shots: Shot[] = [
    [0, 1.14, 34, 62],
    [pillAt, 1.2, 34, 62], // "You have met a relative of this animal": slow push on the face
    [clipIn, 1.22, 34, 62],
    [clipOut - 1, 1.22, 34, 62],
    [clipOut, 1.1, 0, 100], // cut back from the clip: the animal on the sea floor ("NOAA has filmed them on the sea floor")
    [fallsAt, 1.13, 0, 100],
    [fallsAt + 36, 1.25, 30, 72, "move"], // "and eating whatever falls from above": in on the mouth
    [rangeAt, 1.25, 31, 72],
    [rangeAt + 40, 1.12, 0, 100, "move"], // room on the sand for the depth and temperature cards
    [legsAt, 1.14, 0, 100],
    [legsAt + 36, 1.25, 0, 100, "move"], // "Fourteen legs": down to the legs
    [eggsAt, 1.25, 2, 100],
    [eggsAt + 40, 1.1, 0, 60, "move"], // "Even their eggs are oversized": back up
    [pouchAt, 1.12, 0, 60],
    [pouchAt + 40, 1.25, 0, 100, "move"], // "in a pouch under the mother": toward the underside
    [whyAt, 1.25, 2, 100],
    [whyAt + 40, 1.08, 0, 50, "move"], // "Why so big?": the whole giant
    [gigAt, 1.12, 0, 50],
    [gigAt + 40, 1.15, 0, 100, "move"],
    [nineAt, 1.19, 0, 100],
    [biggestAt, 1.2, 0, 100],
    [biggestAt + 30, 1.25, 12, 88, "move"], // "and this one is the biggest"
    [teaseAt, 1.25, 13, 88],
    [teaseAt + 40, 1.25, 34, 62, "move"], // "this particular giant has one more trick": back to its face
    [t.frames, 1.25, 37, 64],
  ];

  return (
    <RungShell
      t={t}
      index={4}
      plate={onClip ? { clip: "isopod-swim" } : { image: "isopod-still" }}
      brightness={onClip ? 0.85 : 0.85 - 0.72 * drawn}
      plateMove={cameraAt(frame, shots)}
      credit={drawn > 0.5 ? { kind: "illustration", source: "over a NOAA Ocean Exploration photo, EX1711" } : { kind: "real", source: "NOAA Ocean Exploration, EX1711" }}
    >
      {/* line 0 · a pill bug, drawn: it appears on "The pill bug", rolls up on "rolls into a ball", and on "Now imagine one a
          foot and a half long" drops to scale beside a 45 cm outline (source #5; no pill-bug size on screen: none is sourced) */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: drawn }}>
        <g transform={`translate(445 720) scale(${0.03 + 0.97 * giant}) translate(-445 -720)`} opacity={Math.min(1, giant * 4)}>
          <rect x={445} y={500} width={630} height={220} rx={110} fill="rgba(255,200,61,0.14)" stroke={B.gauge} strokeWidth={5} />
          {Array.from({ length: 7 }, (_, i) => (
            <path key={i} d={`M${560 + i * 68} 508 Q ${546 + i * 68} 610 ${560 + i * 68} 712`} stroke={B.gauge} strokeWidth={3} fill="none" opacity={0.6} />
          ))}
        </g>
        <circle cx={bugX} cy={bugY} r={24} fill="none" stroke={B.paper} strokeWidth={3} opacity={0.9 * toScale} />
        <g transform={`translate(${bugX} ${bugY}) scale(${bugK}) rotate(${65 * curl})`}>
          <g opacity={1 - curl}>
            <path d={`M${-rx} -10 L ${-rx - 40} -38 M${-rx} 2 L ${-rx - 46} -8`} stroke="#9AA7B4" strokeWidth={5} fill="none" strokeLinecap="round" />
            {Array.from({ length: 7 }, (_, i) => (
              <path key={i} d={`M${-rx + 30 + i * 33} ${ry - 8} l -7 26`} stroke="#9AA7B4" strokeWidth={5} strokeLinecap="round" />
            ))}
          </g>
          <ellipse cx={0} cy={0} rx={rx} ry={ry} fill="#9AA7B4" stroke="#5E6B78" strokeWidth={5} />
          {Array.from({ length: 6 }, (_, i) => {
            const x = -rx + ((i + 1) * 2 * rx) / 7;
            const h = ry * Math.sqrt(Math.max(0, 1 - (x / rx) * (x / rx)));
            return <path key={i} d={`M${x} ${-h} L ${x} ${h}`} stroke="#5E6B78" strokeWidth={4} />;
          })}
        </g>
      </svg>
      <div style={{ position: "absolute", left: bugX - 150, top: bugY + 62 * bugK + 16, width: 300, textAlign: "center", fontFamily: F.headline, fontSize: 40, color: B.paper, whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,0.9)", opacity: drawn }}>pill bug</div>
      <div style={{ position: "absolute", left: 445, top: 736, width: 630, textAlign: "center", fontFamily: F.headline, fontSize: 56, color: B.gauge, whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,0.9)", opacity: drawn * ease(frame, footAt, 10) }}>45 cm · "a foot and a half"</div>

      {/* line 1 · the name over the moving footage; each half on its own words */}
      <div style={{ opacity: ease(frame, nameAt, 10) * (1 - ease(frame, thousandAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={72} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            the giant isopod<span style={{ color: B.gauge, opacity: ease(frame, bathyAt, 8) }}> · Bathynomus giganteus</span>
          </span>
        </CaptionPop>
      </div>
      {/* "around a thousand metres down" (source #5), on the sand left of the animal; it hands over to the depth range at line 2 */}
      <div style={{ position: "absolute", left: 160, top: 340, opacity: ease(frame, thousandAt, 10) * (1 - ease(frame, rangeAt - 8, 8)) }}>
        <NumberCard x={0} y={0} big="around 1,000 m down" small="NOAA HAS FILMED THEM ON THE SEA FLOOR" size={56} color={B.paper} />
      </div>
      <div style={{ opacity: ease(frame, fallsAt, 10) * (1 - ease(frame, rangeAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            it eats <span style={{ color: B.gauge }}>whatever falls</span> from above
          </span>
        </CaptionPop>
      </div>

      {/* line 2 · natural history (source #18): each card on its own words - depth band, then temperature, then legs */}
      <div style={{ position: "absolute", left: 160, top: 340, opacity: 1 - ease(frame, eggsAt - 8, 8) }}>
        <NumberCard x={0} y={0} big="≈ 170 – 2,130 m down" small="SEA FLOOR · ABOUT 560 TO NEARLY 7,000 FT" size={56} opacity={ease(frame, rangeAt + 8, 10)} color={B.paper} />
        <NumberCard x={0} y={118} big="≈ 4 °C" small="ABOUT 39 °F" size={56} opacity={ease(frame, degreesAt, 10)} color={B.paper} />
        <NumberCard x={0} y={236} big="14 legs" small={frame > curlAt ? "SEVEN PAIRS · CURLS INTO A BALL WHEN BOTHERED" : "SEVEN PAIRS"} size={56} opacity={ease(frame, legsAt, 10)} color={B.paper} />
      </div>

      {/* line 3 · the eggs (source #18): size, then "among the largest", then how many and where */}
      <div style={{ position: "absolute", left: 160, top: 340, opacity: 1 - ease(frame, whyAt - 8, 8) }}>
        <NumberCard x={0} y={0} big="eggs ≈ ½ in · 1.3 cm across" small={frame > largestAt ? "AMONG THE LARGEST OF ANY MARINE INVERTEBRATE" : undefined} size={56} opacity={ease(frame, acrossAt, 10)} />
        <NumberCard x={0} y={118} big="20 – 30 at a time" small={frame > inPouchAt ? "IN A POUCH UNDER THE MOTHER" : undefined} size={56} opacity={ease(frame, pouchAt, 10)} color={B.paper} />
      </div>

      {/* line 4 (source #16) · the question, then the pattern built up as it is said */}
      <div style={{ opacity: ease(frame, whyAt, 8) * (1 - ease(frame, deepAt + 20, 8)) }}>
        <CaptionPop bottom={150} size={96} color={B.paper}>
          why so <span style={{ color: B.gauge }}>big</span>?
        </CaptionPop>
      </div>
      <Pill x={160} y={340} size={28} color={B.gauge} opacity={ease(frame, patternAt, 10) * (1 - ease(frame, gigAt - 8, 8))}>a pattern across the deep</Pill>
      <Pill x={160} y={394} size={28} opacity={ease(frame, deepAt, 10) * (1 - ease(frame, gigAt - 8, 8))}>
        deep, cold water
        {frame > growAt ? <span style={{ opacity: ease(frame, growAt, 8) }}> → much larger</span> : null}
      </Pill>
      {/* on its own row, so the pill stays on the sand and off the shell */}
      <Pill x={160} y={448} size={28} opacity={ease(frame, thanAt, 10) * (1 - ease(frame, gigAt - 8, 8))}>than shallow-water relatives</Pill>

      {/* lines 5-6 (source #16) · the name of the pattern; "still argued"; the three suspects one at a time; then the species count */}
      <div style={{ position: "absolute", left: 160, top: 340, opacity: ease(frame, gigNameAt, 10) * (1 - ease(frame, teaseAt - 8, 8)), transform: `scale(${1 + 0.06 * bump(frame, notArguedAt, 8, 20)})`, transformOrigin: "left top" }}>
        <NumberCard x={0} y={0} big="deep-sea gigantism" small={frame > notArguedAt ? "NOT ARGUED: THAT IT HAPPENS" : frame > arguedAt ? "WHY IT HAPPENS: STILL ARGUED" : undefined} size={64} />
      </div>
      <Pill x={160} y={468} opacity={ease(frame, suspectsAt, 10) * (1 - ease(frame, nineAt - 8, 8))}>the usual suspects</Pill>
      <div style={{ position: "absolute", left: 160, top: 526, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, opacity: 1 - ease(frame, nineAt - 8, 8) }}>
        {["the cold", "scarce food", "slow metabolism"].map((s, i) => (
          <div key={s} style={{ padding: "16px 24px", borderRadius: 16, background: B.paper, color: B.ink, fontFamily: F.headline, fontSize: 44, lineHeight: "44px", whiteSpace: "nowrap", opacity: ease(frame, suspectAt[i], 8), transform: `scale(${1 + 0.15 * bump(frame, suspectAt[i], 6, 14)})`, transformOrigin: "left center" }}>
            {s}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 160, top: 468, opacity: 1 - ease(frame, teaseAt - 8, 8) }}>
        <NumberCard x={0} y={0} big="more than 20 species" small="OF THESE GIANTS" size={56} opacity={ease(frame, speciesAt + 6, 10)} color={B.paper} />
        <NumberCard x={0} y={122} big="this one is the biggest" size={56} opacity={ease(frame, biggestAt, 10)} />
      </div>

      {/* line 7 · the hand-off, each half on its own words (hidden parts keep their place, so nothing jumps) */}
      <div style={{ opacity: ease(frame, sameAt, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            next: the <span style={{ color: B.gauge }}>same animal</span>
          </span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, foodAt, 8) }}>
            when the food <span style={{ color: B.gauge }}>stops coming</span>
          </span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * 6 · The Faster. Lines 0-6. Sources #6 (Toba Aquarium, reported), #18. Plate: the same NOAA still as Type 5, framed and graded
 * differently (it opens wide and dim; Type 5 ends tight on the face). The pictured animal is not Number One - the picture says so.
 * 0 "At Toba Aquarium in Japan, a giant isopod known as Number One arrived in 2007. In January 2009 it ate a meal. Then it stopped."
 * 1 "Keepers offered food for years. It refused all of it. It was found dead on the fourteenth of February, 2014 — more than five years..."
 * 2 "Number One was extreme, but not a freak: other captive giant isopods have gone years without eating, then gorged..."
 * 3 "And in the wild, when there's nothing to eat, they dig into the sediment and stay still — spending as little as possible..."
 * 4 "That is the sixth strategy... you don't need to be fast, or clever, or bright. You need to be able to wait."
 * 5 "...animals whose main talent is doing almost nothing, for an astonishingly long time, and then eating everything."
 * 6 "Six down. Now the strangest builder in the ocean."
 */
export const Faster: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const tobaAt = within(t, 0, 0.02); // "At Toba Aquarium in Japan"
  const knownAt = within(t, 0, 0.22); // "a giant isopod known as"
  const numberOneAt = within(t, 0, 0.41); // "Number One"
  const arrivedAt = within(t, 0, 0.5); // "arrived in 2007"
  const mealAt = within(t, 0, 0.65); // "In January 2009 it ate a meal"
  const stoppedAt = within(t, 0, 0.88); // "Then it stopped"
  const dateAt = within(t, 1, 0.54); // "the fourteenth of February"
  const yearAt = within(t, 1, 0.68); // "2014"
  const fiveAt = within(t, 1, 0.75); // "more than five years"
  const extremeAt = lineAt(t, 2);
  const freakAt = within(t, 2, 0.18); // "but not a freak"
  const othersAt = within(t, 2, 0.3); // "other captive giant isopods"
  const yearsAt = within(t, 2, 0.5); // "have gone years without eating"
  const gorgedAt = within(t, 2, 0.73); // "then gorged"
  const wildAt = lineAt(t, 3);
  const nothingAt = within(t, 3, 0.13); // "when there's nothing to eat"
  const digAt = within(t, 3, 0.32); // "they dig into the sediment"
  const spendAt = within(t, 3, 0.62); // "spending as little as possible"
  const sixthAt = lineAt(t, 4);
  const importantAt = within(t, 4, 0.15); // "and it may be the most important of all down there"
  const whenFoodAt = within(t, 4, 0.41); // "when food arrives once in a great while"
  const notAt = [within(t, 4, 0.73), within(t, 4, 0.77), within(t, 4, 0.83)]; // "fast" · "or clever" · "or bright"
  const waitAt = within(t, 4, 0.87); // "You need to be able to wait"
  const talentAt = lineAt(t, 5);
  const almostAt = within(t, 5, 0.41); // "doing almost nothing"
  const eatingAt = within(t, 5, 0.81); // "and then eating everything"
  const sixDownAt = lineAt(t, 6);
  const teaseAt = within(t, 6, 0.2); // "Now the strangest builder"

  // the timeline is on screen for Number One's story (lines 0-2) and leaves when the narration goes to the wild
  const chart = ease(frame, arrivedAt - 4, 10) * (1 - ease(frame, wildAt - 8, 8));
  const story = 1 - ease(frame, wildAt - 8, 8);
  // the fast runs from "Then it stopped" to "2014": the red bar and the counter climb together, in whole years, and the
  // counter only reads "> 5 years" once the voice says "more than five years" (source #6)
  const fast = lin(frame, stoppedAt, yearAt);
  const n = Math.min(4, Math.floor(fast * 5)); // "5" is only shown with the words "more than five years"
  const years = frame >= fiveAt ? "> 5 years" : `${n} year${n === 1 ? "" : "s"}`;
  const marks: [number, string, string, number][] = [
    [0, "2007", "arrives at Toba Aquarium", arrivedAt],
    [0.3, "Jan 2009", "its last meal", mealAt],
    [1, "14 Feb 2014", "found dead", dateAt],
  ];

  // The camera on the still: opens on the untouched full frame (Type 5 never shows that, and is brighter), drifts in behind the
  // timeline, goes down to the legs on the sea floor for "in the wild", up to the shell and the whip coral for the strategy,
  // and in on the legs for "eating everything".
  const shots: Shot[] = [
    [0, 1, 100, 50],
    [arrivedAt, 1.05, 100, 50],
    [lineAt(t, 1), 1.09, 100, 50],
    [lineAt(t, 1) + 40, 1.2, 60, 75, "move"], // "Keepers offered food for years": toward the mouth, behind the timeline
    [extremeAt, 1.23, 60, 75],
    [othersAt, 1.24, 60, 75],
    [othersAt + 40, 1.1, 80, 60, "move"], // "other captive giant isopods": pull back
    [wildAt, 1.12, 80, 60],
    // from here on every framing is anchored on the photo's right edge (rear body, whip coral, legs): Type 5 is anchored left
    [wildAt + 45, 1.25, 100, 100, "move"], // "And in the wild": down to the legs on the sediment, photo brighter
    [spendAt, 1.25, 100, 100], // "and stay still": the camera holds
    [spendAt + 50, 1.25, 70, 100, "move"], // "spending as little as possible": a slow travel along the legs
    [sixthAt, 1.25, 68, 100],
    [sixthAt + 50, 1.2, 100, 0, "move"], // "That is the sixth strategy": up to the shell and the whip coral
    [waitAt, 1.2, 100, 8],
    [talentAt, 1.2, 100, 10],
    [talentAt + 40, 1.08, 100, 60, "move"], // the animal from behind, almost still ("doing almost nothing")
    [eatingAt, 1.1, 100, 62],
    [eatingAt + 20, 1.25, 85, 90, "move"], // "and then eating everything": in on the legs and underside
    [t.frames, 1.25, 83, 90],
  ];

  return (
    <RungShell
      t={t}
      index={5}
      plate={{ image: "isopod-still" }}
      brightness={0.64 - 0.5 * chart}
      plateMove={cameraAt(frame, shots)}
      credit={chart > 0.5 ? { kind: "illustration", source: "over a NOAA Ocean Exploration photo, EX1711" } : { kind: "real", source: "NOAA Ocean Exploration, EX1711" }}
    >
      {/* the photo is a wild animal filmed by NOAA, not the aquarium's Number One: said on the picture from the first frame,
          for as long as Number One is the subject (lines 0-2) */}
      <Pill x={160} y={925} opacity={story}>shown: a giant isopod on the sea floor · NOAA · not Number One</Pill>

      {/* line 0 · where and who, as the words arrive */}
      <Pill x={200} y={340} size={28} color={B.gauge} opacity={ease(frame, tobaAt, 10) * story}>
        Toba Aquarium, Japan
        {frame > knownAt ? <span style={{ color: B.paper, opacity: ease(frame, knownAt, 8) }}> · a giant isopod known as</span> : null}
        {frame > numberOneAt ? <span style={{ opacity: ease(frame, numberOneAt, 8) }}> “Number One”</span> : null}
      </Pill>

      {/* the timeline (source #6): each date on its words; the line is only drawn as far as the story has got */}
      <div style={{ position: "absolute", left: 200, top: 410, width: 1200, opacity: chart }}>
        <div style={{ position: "absolute", left: 0, top: 40, height: 6, width: `${30 * ease(frame, mealAt, 20)}%`, background: B.mute }} />
        <div style={{ position: "absolute", left: "30%", top: 40, height: 6, width: `${70 * fast}%`, background: B.tease }} />
        {marks.map(([u, y, l, at], i) => (
          <div key={y} style={{ position: "absolute", left: `${u * 100}%`, top: 0, opacity: ease(frame, at, 10) }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: i === 2 ? B.tease : B.gauge, marginLeft: -11, marginTop: 32, transform: `scale(${1 + 0.6 * bump(frame, at, 6, 14)})` }} />
            <div style={{ fontFamily: F.headline, fontSize: 48, color: B.paper, marginTop: 20, marginLeft: u === 1 ? -320 : -11, whiteSpace: "nowrap", textAlign: u === 1 ? "right" : "left", width: u === 1 ? 320 : undefined, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>{y}</div>
            <div style={{ marginLeft: u === 1 ? -320 : -11, marginTop: 6, whiteSpace: "nowrap", textAlign: u === 1 ? "right" : "left", width: u === 1 ? 320 : undefined }}>
              <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: 999, background: "rgba(5,14,24,0.8)", fontFamily: F.ui, fontWeight: 800, fontSize: 24, color: B.paper }}>{l}</span>
            </div>
          </div>
        ))}
      </div>
      {/* the counter starts on "Then it stopped" and pulses on "Number One was extreme"; the story is secondary reporting (source #6), so the card says whose account it is */}
      <div style={{ position: "absolute", left: 200, top: 630, opacity: ease(frame, stoppedAt, 10) * story, transform: `scale(${1 + 0.08 * bump(frame, extremeAt + 6, 8, 20)})`, transformOrigin: "left center" }}>
        <NumberCard x={0} y={0} big={years} small="WITHOUT A MEAL · AS REPORTED BY THE AQUARIUM" size={80} color={B.tease} ink={B.paper} />
      </div>

      {/* line 2 (source #18) · not a freak: a second, unnumbered run for the other captives - the dashed bar grows on "have gone
          years without eating" and ends in a meal on "then gorged" (no figures are sourced, so none are drawn; the bar is kept well short of Number One's - he was "extreme") */}
      <Pill x={200} y={790} opacity={ease(frame, freakAt, 10) * story}>
        not a freak
        {frame > othersAt ? <span style={{ opacity: ease(frame, othersAt, 8) }}> · other captive giant isopods</span> : null}
      </Pill>
      <div style={{ position: "absolute", left: 200, top: 852, width: 450 * lin(frame, yearsAt, yearsAt + 50), height: 8, opacity: story, background: `repeating-linear-gradient(90deg, ${B.mute} 0 22px, rgba(0,0,0,0) 22px 34px)` }} />
      <Tag x={200} y={868} size={24} opacity={ease(frame, yearsAt, 10) * story}>years without eating</Tag>
      <div style={{ position: "absolute", left: 650 - 14, top: 856 - 14, width: 28, height: 28, borderRadius: 14, background: B.gauge, opacity: ease(frame, gorgedAt, 6) * story, transform: `scale(${1 + 0.9 * bump(frame, gorgedAt, 6, 16)})` }} />
      <Tag x={678} y={841} size={24} color={B.gauge} opacity={ease(frame, gorgedAt, 8) * story}>then gorged</Tag>

      {/* line 3 (source #18) · in the wild: the photo itself (legs on the sediment). Two rows only, low on the sediment they
          name; "stay still" and "spending as little as possible" are left to the camera (it holds, then creeps) */}
      <Pill x={160} y={860} color={B.gauge} opacity={ease(frame, wildAt + 4, 10) * (1 - ease(frame, sixthAt - 8, 8))}>
        in the wild
        {frame > nothingAt ? <span style={{ color: B.paper, opacity: ease(frame, nothingAt, 8) }}> · nothing to eat</span> : null}
      </Pill>
      <Pill x={160} y={912} opacity={ease(frame, digAt, 10) * (1 - ease(frame, sixthAt - 8, 8))}>they dig into the sediment</Pill>

      {/* line 4 · the strategy; the three things you do not need are struck out as they are named */}
      <Pill x={160} y={340} color={B.gauge} opacity={ease(frame, sixthAt + 4, 10) * (1 - ease(frame, talentAt - 4, 8))}>the sixth strategy</Pill>
      {/* its own rows, short enough to stay on the sand left of the shell; it leaves when the narration moves on to "when food arrives" */}
      <Pill x={160} y={392} opacity={ease(frame, importantAt, 10) * (1 - ease(frame, whenFoodAt - 8, 8))}>
        maybe the most important
        <br />
        of all down there
      </Pill>
      <div style={{ position: "absolute", left: 160, top: 400, display: "flex", gap: 16, opacity: 1 - ease(frame, talentAt - 4, 8) }}>
        {["fast", "clever", "bright"].map((s, i) => (
          <div key={s} style={{ position: "relative", padding: "16px 24px", borderRadius: 16, background: B.paper, color: B.ink, fontFamily: F.headline, fontSize: 44, lineHeight: "44px", whiteSpace: "nowrap", opacity: ease(frame, notAt[i], 8) }}>
            {s}
            <div style={{ position: "absolute", left: 10, right: 10, top: "50%", height: 8, marginTop: -4, transform: "rotate(-8deg)" }}>
              <div style={{ height: 8, width: `${100 * lin(frame, notAt[i] + 6, notAt[i] + 14)}%`, background: B.tease }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ opacity: ease(frame, waitAt, 10) * (1 - ease(frame, talentAt - 4, 8)) }}>
        <CaptionPop bottom={150} size={84}>you need to be able to wait</CaptionPop>
      </div>

      {/* line 5 · the punchline in two halves, each on its words */}
      <div style={{ opacity: ease(frame, almostAt, 10) * (1 - ease(frame, sixDownAt, 8)) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            doing <span style={{ color: B.gauge }}>almost nothing</span>
          </span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, eatingAt, 8) }}>
            then eating <span style={{ color: B.gauge }}>everything</span>
          </span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, teaseAt, 8) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            next: the strangest <span style={{ color: B.gauge }}>builder</span> in the ocean
          </span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * 7 · The Drifter. Lines 0-10. Sources #8, #14, #25, #26, #29, #30. Plate: NOAA siphonophore still, kept near-black until line 7 so it
 * doesn't give the siphonophore away; the larvacean and its house are drawn over it (no free photo exists - assets.md).
 * 0 "A giant larvacean is a soft animal about five centimetres long — and it lives inside a house it builds itself, out of mucus."
 * 1 "Not a small house. Two net-like filters, one inside the other, and the outer one can be up to a metre across."
 * 2 "The animal sits at the centre and beats its tail, pulling water through: the outer net stops the coarse stuff, the inner net traps..."
 * 3 "When the filters clog, the larvacean abandons the whole house and builds another. The old one sinks... eight hundred metres in a single day."
 * 4 "Scientists call these houses "sinkers", and they carry carbon from the surface down into the deep sea... a missing piece of the ocean's carbon budget."
 * 5 "A strategy of drifting, filtering, and throwing away your home. And it helps run the planet."
 * 6 "MBARI found that the same filters collect microplastic particles, and the larvaceans eat them — so the sinking houses are also a pathway..."
 * 7 "The drifters have a giant of their own, too." 8 "In 2020, off Western Australia... Falkor found a siphonophore — a colony of thousands... forty-five metres long."
 * 9 "If the estimate holds, it is the longest animal ever recorded. And it hunts by doing nothing: it hangs... like a curtain and waits..."
 * 10 "One type left — and it's the one that turns a death into a neighbourhood."
 */
export const Drifter: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const nameAt = within(t, 0, 0.03); // "A giant larvacean"
  const softAt = within(t, 0, 0.18); // "a soft animal"
  const fiveAt = within(t, 0, 0.3); // "about five centimetres long"
  const houseAt = within(t, 0, 0.6); // "inside a house it builds itself"
  const mucusAt = within(t, 0, 0.91); // "out of mucus"
  const notSmallAt = lineAt(t, 1);
  const twoAt = within(t, 1, 0.18); // "Two net-like filters"
  const insideAt = within(t, 1, 0.39); // "one inside the other"
  const outerAt = within(t, 1, 0.59); // "and the outer one"
  const metreAt = within(t, 1, 0.82); // "up to a metre across"
  const centreAt = lineAt(t, 2);
  const tailAt = within(t, 2, 0.21); // "beats its tail"
  const waterAt = within(t, 2, 0.31); // "pulling water through"
  const coarseAt = within(t, 2, 0.45); // "the outer net stops the coarse stuff"
  const fineAt = within(t, 2, 0.67); // "the inner net traps the tiny particles"
  const eatsAt = within(t, 2, 0.9); // "it actually eats"
  const clogAt = lineAt(t, 3);
  const abandonAt = within(t, 3, 0.14); // "the larvacean abandons the whole house"
  const buildsAt = within(t, 3, 0.35); // "and builds another"
  const sinksAt = within(t, 3, 0.46); // "The old one sinks"
  const notSlowlyAt = within(t, 3, 0.57); // "and not slowly"
  const eightAt = within(t, 3, 0.8); // "eight hundred metres in a single day"
  const sinkersAt = lineAt(t, 4);
  const calledAt = within(t, 4, 0.14); // "sinkers"
  const carbonAt = within(t, 4, 0.24); // "and they carry carbon from the surface"
  const deepAt = within(t, 4, 0.44); // "down into the deep sea"
  const pieceAt = within(t, 4, 0.75); // "a missing piece of the ocean's carbon budget"
  const strategyAt = lineAt(t, 5);
  const driftAt = within(t, 5, 0.15); // "drifting"
  const filterAt = within(t, 5, 0.26); // "filtering"
  const throwAt = within(t, 5, 0.39); // "and throwing away your home"
  const planetAt = within(t, 5, 0.71); // "And it helps run the planet"
  const mbariAt = lineAt(t, 6);
  const sameAt = within(t, 6, 0.1); // "the same filters collect"
  const microAt = within(t, 6, 0.25); // "microplastic particles"
  const eatAt = within(t, 6, 0.38); // "and the larvaceans eat them"
  const pathAt = within(t, 6, 0.55); // "so the sinking houses are also a pathway"
  const websAt = within(t, 6, 0.8); // "carrying plastic into deep-sea food webs"
  const siphAt = lineAt(t, 7);
  const falkorAt = lineAt(t, 8);
  const offAt = within(t, 8, 0.05); // "off Western Australia"
  const shipAt = within(t, 8, 0.2); // "the research ship Falkor"
  const foundAt = within(t, 8, 0.29); // "found a siphonophore"
  const colonyAt = within(t, 8, 0.39); // "a colony of thousands of tiny identical animals"
  const jobAt = within(t, 8, 0.59); // "each doing one job"
  const strungAt = within(t, 8, 0.67); // "strung together into a single drifting line"
  const estAt = within(t, 8, 0.86); // "estimated at"
  const fortyAt = within(t, 8, 0.92); // "forty-five metres long"
  const longestAt = within(t, 9, 0.15); // "it is the longest animal ever recorded"
  const huntsAt = within(t, 9, 0.39); // "And it hunts by doing nothing"
  const hangsAt = within(t, 9, 0.57); // "it hangs in the water like a curtain"
  const waitsAt = within(t, 9, 0.79); // "and waits"
  const teaseAt = lineAt(t, 10);
  const turnsAt = within(t, 10, 0.24); // "and it's the one that turns a death into a neighbourhood"

  const siph = ease(frame, siphAt, 14);
  const drawing = 1 - ease(frame, siphAt, 10);

  // where the animal is: at the centre of its first house (760, 660); out to the right to build the next one (1130, 545)
  // on "abandons the whole house"; back to the middle (760, 590) on "drifting". Later houses are built around it.
  const out = smooth(frame, abandonAt, abandonAt + 40);
  const back = smooth(frame, driftAt, driftAt + 40);
  const ax = 760 + 370 * out - 370 * back;
  const ay = 660 - 115 * out + 45 * back;
  // it is drawn large on its own, then shrinks into its house on "lives inside a house" (the drawing is not to scale: a 5 cm
  // animal in a 1 m house would be a dot - the note under the drawing says so)
  const big = 2.4 - 1.4 * smooth(frame, houseAt - 4, houseAt + 30);
  const tailPhase = frame / 4 + Math.max(0, frame - tailAt) / 6; // the tail beats faster from "beats its tail"
  const tail = (20 + 34 * ease(frame, tailAt, 10)) * Math.sin(tailPhase);

  // the live house around the animal: big (the first one) until it is abandoned, smaller ones after that
  const first = frame < abandonAt;
  const hrx = first ? 380 : 230;
  const hry = first ? 215 : 140;
  // water is pulled through whichever house is in use: house 1 (until it clogs), 2, 3 and 4
  const flow =
    ease(frame, waterAt, 14) * (1 - ease(frame, clogAt, 24)) +
    ease(frame, buildsAt + 40, 14) * (1 - ease(frame, throwAt - 6, 6)) +
    ease(frame, throwAt + 60, 14) * (1 - ease(frame, pathAt - 6, 6)) +
    ease(frame, pathAt + 70, 14);
  const filtering = 1 + 0.6 * bump(frame, filterAt, 8, 30); // "filtering": the particles step forward
  const outerEdge = (dy: number) => ax - hrx * Math.sqrt(Math.max(0, 1 - (dy / hry) * (dy / hry)));
  const innerEdge = (dy: number) => ax - hrx * 0.45 * Math.sqrt(Math.max(0, 1 - (dy / (hry * 0.48)) * (dy / (hry * 0.48))));

  // one house: outer filter (dashed, with a net drawn on it), inner filter, and whatever is stuck in it
  const house = (key: string, cx: number, cy: number, rx: number, ry: number, grown: number, net: number, inner: number, murk: number, opacity: number, rim = 0, innerRim = 0, stuck: React.ReactNode = null) => (
    <g key={key} transform={`translate(${cx} ${cy}) scale(${0.25 + 0.75 * grown})`} opacity={opacity * Math.min(1, grown * 3)}>
      <ellipse rx={rx} ry={ry} fill={`rgba(${191 - 60 * murk},${239 - 80 * murk},${255 - 130 * murk},${0.07 + 0.2 * murk})`} stroke={rim > 0.05 ? B.paper : "#BFEFFF"} strokeWidth={4 + 8 * rim} strokeDasharray="14 9" />
      {[0.33, 0.66].map((k) => (
        <g key={k} stroke="#BFEFFF" strokeWidth={1.5} fill="none" opacity={0.3 * net}>
          <ellipse rx={rx * k} ry={ry} />
          <ellipse rx={rx} ry={ry * k} />
        </g>
      ))}
      <path d={`M${-rx} 0 L ${rx} 0 M0 ${-ry} L 0 ${ry}`} stroke="#BFEFFF" strokeWidth={1.5} opacity={0.3 * net} />
      <g opacity={inner}>
        <ellipse rx={rx * 0.45} ry={ry * 0.48} fill={`rgba(${191 - 36 * innerRim},${239 - 8 * innerRim},${255 - 95 * innerRim},${0.1 + 0.14 * murk + 0.2 * innerRim})`} stroke={innerRim > 0.05 ? "#9BE7A0" : "#BFEFFF"} strokeWidth={3 + 7 * innerRim} />
        <ellipse rx={rx * 0.22} ry={ry * 0.48} fill="none" stroke="#BFEFFF" strokeWidth={1.2} opacity={0.4} />
        <ellipse rx={rx * 0.45} ry={ry * 0.24} fill="none" stroke="#BFEFFF" strokeWidth={1.2} opacity={0.4} />
      </g>
      {stuck}
    </g>
  );
  // house 1: built on line 0, netted on line 1, fills up through line 2, clogs, is left behind and drops on "The old one sinks"
  // (it falls for as long as "the old one sinks — and not slowly" is on screen, about 3 s, speeding up, and fades out low in the frame)
  const fallEnd = eightAt - 8;
  const sink1 = lin(frame, sinksAt, fallEnd);
  const house1 = house(
    "h1",
    760,
    660 + 520 * Math.pow(sink1, 1.5),
    380 * (1 + 0.04 * bump(frame, notSmallAt + 6, 8, 20)), // "Not a small house"
    215 * (1 + 0.04 * bump(frame, notSmallAt + 6, 8, 20)),
    smooth(frame, houseAt, houseAt + 36),
    ease(frame, twoAt, 14),
    ease(frame, insideAt, 14),
    ease(frame, clogAt, 30),
    1 - lin(frame, sinksAt + (fallEnd - sinksAt) * 0.66, fallEnd),
    bump(frame, outerAt, 8, 30) + bump(frame, coarseAt, 8, 40), // "and the outer one" · "the outer net stops the coarse stuff"
    bump(frame, fineAt, 8, 40), // "the inner net traps the tiny particles"
    <>
      {Array.from({ length: 8 }, (_, i) => {
        const a = ((118 + i * 18) * Math.PI) / 180;
        return <circle key={`c${i}`} cx={380 * Math.cos(a)} cy={215 * Math.sin(a)} r={12} fill="#C6D0DA" opacity={ease(frame, coarseAt + 24 + i * 14, 10)} />;
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const a = ((112 + i * 19) * Math.PI) / 180;
        return <circle key={`f${i}`} cx={171 * Math.cos(a)} cy={103 * Math.sin(a)} r={7} fill="#9BE7A0" opacity={ease(frame, fineAt + 24 + i * 9, 10)} />;
      })}
    </>,
  );
  // house 2: built on "and builds another", thrown away on "throwing away your home"
  const drop2 = lin(frame, throwAt, throwAt + 36);
  // (it fades as it falls, so it is gone before it reaches the caption)
  const house2 = house("h2", ax, ay + 420 * drop2 * drop2, 230, 140, smooth(frame, buildsAt, buildsAt + 40), 1, 1, 0.6 * ease(frame, throwAt - 30, 30), 1 - lin(frame, throwAt + 8, throwAt + 24));
  // house 3: catches the red (microplastic) particles and carries them down on "the sinking houses are also a pathway"
  const drop3 = lin(frame, pathAt, pathAt + 60);
  const house3 = house(
    "h3",
    ax,
    ay + 300 * Math.pow(drop3, 1.6),
    230,
    140,
    smooth(frame, throwAt + 26, throwAt + 60),
    1,
    1,
    0.5 * ease(frame, pathAt - 30, 30),
    1 - lin(frame, pathAt + 40, pathAt + 60),
    0,
    0,
    Array.from({ length: 7 }, (_, i) => {
      const a = ((110 + i * 23) * Math.PI) / 180;
      return <circle key={i} cx={103 * Math.cos(a)} cy={67 * Math.sin(a)} r={6} fill={B.tease} opacity={ease(frame, microAt + 14 + i * 9, 8)} />;
    }),
  );
  const house4 = house("h4", ax, ay, 230, 140, smooth(frame, pathAt + 34, pathAt + 70), 1, 1, 0, 1);

  // line 4: "sinkers" - discarded houses falling past, each carrying carbon (the yellow dots) down
  const lane = ease(frame, calledAt, 12) * (1 - ease(frame, strategyAt - 8, 8));

  // lines 7-10: the camera on the siphonophore photo (1710 px wide: scale 1.1-1.15 only). The origin stays on the right edge
  // so the animal slides clear of the gauge's labels; the travel is down its length.
  const shots: Shot[] = [
    [0, 1.12, 100, 0],
    [siphAt, 1.12, 100, 0],
    [foundAt, 1.13, 100, 6],
    [foundAt + 40, 1.15, 100, 30, "move"], // "found a siphonophore": in, and down from its tip
    [strungAt, 1.15, 100, 62], // travelling down the line through "a colony of thousands..."
    [estAt, 1.15, 100, 70],
    [estAt + 40, 1.1, 100, 40, "move"], // back out for the length
    [huntsAt, 1.11, 100, 40],
    [huntsAt + 40, 1.15, 100, 0, "move"], // "And it hunts by doing nothing": up to the top...
    [waitsAt, 1.15, 100, 50], // ...and slowly down as "it hangs in the water like a curtain"
    [t.frames, 1.15, 100, 100],
  ];
  // the 45 m bar is a chart over the photo, so the chip says illustration while it is up
  const bar = ease(frame, estAt, 10) * (1 - ease(frame, huntsAt - 8, 8));
  const facts = 1 - ease(frame, huntsAt - 8, 8);

  return (
    <RungShell
      t={t}
      index={6}
      plate={{ image: "siphonophore", ext: "png" }}
      brightness={0.02 + 0.83 * siph}
      plateMove={cameraAt(frame, shots)}
      credit={siph <= 0.5 ? { kind: "illustration", source: "drawn over a NOAA Ocean Exploration photo, EX1502" } : bar > 0.5 ? { kind: "illustration", source: "over a NOAA Ocean Exploration photo, EX1502 · physonect siphonophore" } : { kind: "real", source: "NOAA Ocean Exploration, EX1502 · physonect siphonophore" }}
    >
      {/* scrim under the gauge column while the photo is up: the animal's lower body runs under the gauge's labels */}
      <AbsoluteFill style={{ opacity: siph, background: "linear-gradient(90deg, rgba(5,14,24,0) 86%, rgba(5,14,24,0.78) 91.5%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: drawing }}>
        {/* line 4 · the way down: surface at the top, deep sea at the bottom, drawn on "carry carbon from the surface" */}
        <g opacity={lane}>
          <path d="M300 372 L 300 930" stroke={B.mute} strokeWidth={3} strokeDasharray={560} strokeDashoffset={560 * (1 - ease(frame, carbonAt, 30))} />
          <path d="M288 912 L 300 934 L 312 912" stroke={B.mute} strokeWidth={3} fill="none" opacity={ease(frame, deepAt, 10)} />
          {[400, 600, 490, 680].map((x, i) => {
            const y = 340 + ((((frame - calledAt) * 2.4 + i * 165) % 660) + 660) % 660;
            return (
              <g key={i} transform={`translate(${x + 14 * Math.sin(frame / 20 + i)} ${y}) rotate(${8 * Math.sin(frame / 15 + i)})`} opacity={Math.min(1, (y - 340) / 50) * Math.min(1, Math.max(0, (950 - y) / 60))}>
                <ellipse rx={56} ry={30} fill="rgba(191,239,255,0.14)" stroke="#BFEFFF" strokeWidth={3} strokeDasharray="10 7" />
                <ellipse rx={24} ry={13} fill="none" stroke="#BFEFFF" strokeWidth={2} />
                {[[-34, -6], [-12, 10], [10, -12], [30, 6], [0, 0]].map(([dx, dy], k) => (
                  <circle key={k} cx={dx} cy={dy} r={5} fill={B.gauge} opacity={ease(frame, carbonAt, 12)} />
                ))}
              </g>
            );
          })}
        </g>

        {house1}
        {house2}
        {house3}
        {house4}

        {/* water pulled through the house in use (from "pulling water through"): streaks, then the coarse grains that stop
            at the outer net and the fine ones that reach the inner net - red ones from "microplastic particles" */}
        {Array.from({ length: 14 }, (_, j) => {
          const u = fract(frame / 44 + j / 14);
          const x0 = ax - hrx - 200;
          const x = x0 + u * (Math.min(1400, ax + hrx + 90) - 90 - x0);
          const y = ay + ((((j * 53) % 100) - 50) / 50) * hry * 0.8;
          return <path key={`s${j}`} d={`M${x} ${y} l 90 0`} stroke="#BFEFFF" strokeWidth={5} strokeLinecap="round" opacity={0.75 * flow * Math.min(1, u / 0.1) * Math.min(1, (1 - u) / 0.1)} />;
        })}
        {Array.from({ length: 12 }, (_, i) => {
          const coarse = i % 3 === 0;
          const dy = ((((i * 37) % 100) - 50) / 50) * hry * 0.6;
          const reachesInner = Math.abs(dy) < hry * 0.44;
          const u = fract(frame / 66 + i / 12);
          const xs = ax - hrx - 170;
          const xe = coarse ? outerEdge(dy) : reachesInner ? innerEdge(dy) : ax + hrx + 60;
          const seen = coarse ? ease(frame, coarseAt, 12) : ease(frame, fineAt, 12);
          return <circle key={`p${i}`} cx={xs + (xe - xs) * Math.min(1, u / 0.75)} cy={ay + dy} r={(coarse ? 12 : 7) * filtering} fill={coarse ? "#C6D0DA" : "#9BE7A0"} opacity={flow * seen * Math.min(1, u / 0.08) * (u < 0.75 ? 1 : 1 - (u - 0.75) / 0.25)} />;
        })}
        {Array.from({ length: 5 }, (_, j) => {
          const dy = (j - 2) * 0.16 * hry;
          const u = fract(frame / 90 + j / 5);
          const xs = ax - hrx - 170;
          return <circle key={`m${j}`} cx={xs + (innerEdge(dy) - xs) * Math.min(1, u / 0.75)} cy={ay + dy} r={6} fill={B.tease} opacity={flow * ease(frame, microAt, 10) * Math.min(1, u / 0.08) * (u < 0.75 ? 1 : 1 - (u - 0.75) / 0.25)} />;
        })}
        {/* "it actually eats" (green) and "the larvaceans eat them" (red): from the inner net to the animal */}
        {Array.from({ length: 3 }, (_, k) => {
          const w = fract((frame - eatsAt) / 40 + k / 3);
          const x = ax - hrx * 0.45 + (hrx * 0.45 - 44) * w;
          return (
            <g key={`e${k}`} opacity={Math.min(1, w / 0.15) * Math.min(1, (1 - w) / 0.2)}>
              <circle cx={x} cy={ay - 8 + k * 8} r={7} fill="#9BE7A0" opacity={ease(frame, eatsAt, 10) * (1 - ease(frame, clogAt, 20))} />
              <circle cx={x} cy={ay + 10 - k * 8} r={6} fill={B.tease} opacity={ease(frame, eatAt, 10) * (1 - ease(frame, pathAt - 6, 6))} />
            </g>
          );
        })}

        {/* the animal: trunk and a long tail that never stops beating. "sits at the centre": a ring steps out from it */}
        <circle cx={ax} cy={ay} r={50 + 50 * bump(frame, centreAt + 8, 8, 30)} fill="none" stroke={B.paper} strokeWidth={4} opacity={0.8 * bump(frame, centreAt + 8, 8, 30)} />
        <g transform={`translate(${ax} ${ay}) scale(${big * (1 + 0.3 * bump(frame, eatsAt, 8, 24))})`} opacity={ease(frame, nameAt, 12)}>
          <path d={`M36 0 C 70 ${tail}, 110 ${-tail}, 176 ${tail * 0.6}`} stroke="#6FB8FF" strokeWidth={11} fill="none" strokeLinecap="round" />
          <path d="M-44 0 C -20 -26, 20 -20, 36 0 C 20 20, -20 26, -44 0 Z" fill="#6FB8FF" />
          {[[-12, -4], [6, 6], [20, -3]].map(([dx, dy], k) => (
            <circle key={k} cx={dx} cy={dy} r={4} fill={B.tease} opacity={ease(frame, eatAt + 24 + k * 10, 8)} />
          ))}
        </g>
        {/* source #26: Bathochordaeus body ≈ 50 mm - the bracket spans the animal while it is on its own */}
        <g opacity={ease(frame, fiveAt, 10) * (1 - ease(frame, houseAt - 8, 8))} stroke="#BFEFFF" strokeWidth={3} fill="none">
          <path d={`M${ax - 106} ${ay + 92} L ${ax + 422} ${ay + 92} M${ax - 106} ${ay + 80} L ${ax - 106} ${ay + 104} M${ax + 422} ${ay + 80} L ${ax + 422} ${ay + 104}`} />
        </g>
        {/* source #8: the outer filter up to one metre across - a dimension line under the first house */}
        <g opacity={ease(frame, metreAt, 10) * (1 - ease(frame, centreAt - 8, 8))} stroke="#BFEFFF" strokeWidth={3} fill="none">
          <path d="M380 897 L 1140 897 M380 885 L 380 909 M1140 885 L 1140 909" />
        </g>
      </svg>
      <Tag x={918} y={764} size={30} color="#BFEFFF" align="center" opacity={drawing * ease(frame, fiveAt, 10) * (1 - ease(frame, houseAt - 8, 8))}>≈ 5 cm long</Tag>
      <Tag x={760} y={907} size={28} color="#BFEFFF" align="center" opacity={drawing * ease(frame, metreAt, 10) * (1 - ease(frame, centreAt - 8, 8))}>up to 1 m across</Tag>
      <Tag x={288} y={352} size={24} align="right" opacity={drawing * lane * ease(frame, carbonAt, 10)}>surface</Tag>
      <Tag x={288} y={908} size={24} align="right" opacity={drawing * lane * ease(frame, deepAt, 10)}>deep sea</Tag>
      <div style={{ position: "absolute", left: 160, top: 950, fontFamily: F.ui, fontWeight: 800, fontSize: 22, color: B.mute, letterSpacing: 2, whiteSpace: "nowrap", opacity: drawing * ease(frame, nameAt, 12) }}>DRAWING · NOT TO SCALE</div>

      {/* the words for the drawing, two rows under the problem strip, each phrase on its cue and gone when the line is over */}
      <Pill x={160} y={340} color="#BFEFFF" opacity={drawing * ease(frame, nameAt, 10) * (1 - ease(frame, notSmallAt - 8, 8))}>
        giant larvacean
        {frame > softAt ? <span style={{ color: B.paper, opacity: ease(frame, softAt, 8) }}> · a soft animal</span> : null}
      </Pill>
      <Pill x={160} y={392} opacity={drawing * ease(frame, houseAt, 10) * (1 - ease(frame, notSmallAt - 8, 8))}>
        lives in a house it builds itself
        {frame > mucusAt ? <span style={{ color: "#BFEFFF", opacity: ease(frame, mucusAt, 8) }}> · out of mucus</span> : null}
      </Pill>
      <Pill x={160} y={340} color="#BFEFFF" opacity={drawing * ease(frame, twoAt, 10) * (1 - ease(frame, centreAt - 8, 8))}>
        two net-like filters
        {frame > insideAt ? <span style={{ color: B.paper, opacity: ease(frame, insideAt, 8) }}> · one inside the other</span> : null}
      </Pill>
      <Pill x={160} y={340} opacity={drawing * ease(frame, tailAt, 10) * (1 - ease(frame, coarseAt - 8, 8))}>
        it beats its tail
        {frame > waterAt ? <span style={{ color: "#BFEFFF", opacity: ease(frame, waterAt, 8) }}> · pulling water through</span> : null}
      </Pill>
      <Pill x={160} y={340} opacity={drawing * ease(frame, coarseAt, 10) * (1 - ease(frame, clogAt - 8, 8))}>outer net: stops the coarse stuff</Pill>
      <Pill x={160} y={392} color="#9BE7A0" opacity={drawing * ease(frame, fineAt, 10) * (1 - ease(frame, clogAt - 8, 8))}>inner net: traps the tiny particles it eats</Pill>
      <Pill x={160} y={340} opacity={drawing * ease(frame, clogAt + 6, 10) * (1 - ease(frame, sinkersAt - 8, 8))}>
        the filters clog
        {frame > abandonAt ? <span style={{ opacity: ease(frame, abandonAt, 8) }}> → it abandons the house</span> : null}
        {frame > buildsAt ? <span style={{ color: "#BFEFFF", opacity: ease(frame, buildsAt, 8) }}> → builds another</span> : null}
      </Pill>
      <Pill x={160} y={392} opacity={drawing * ease(frame, sinksAt, 10) * (1 - ease(frame, eightAt - 8, 8))}>
        the old one sinks
        {frame > notSlowlyAt ? <span style={{ color: B.gauge, opacity: ease(frame, notSlowlyAt, 8) }}> — and not slowly</span> : null}
      </Pill>
      {/* source #14: "as rapidly as 800 meters (2,600 feet) a day" - on the left, where the first house was */}
      <div style={{ position: "absolute", left: 160, top: 560, opacity: drawing * ease(frame, eightAt, 10) * (1 - ease(frame, sinkersAt - 8, 8)) }}>
        <NumberCard x={0} y={0} big="up to 800 m a day" small="HOW FAR A DISCARDED HOUSE CAN DROP" size={64} />
      </div>
      {/* line 4 (source #8) · the name, what they carry, and what that turned out to be - under the animal's new house */}
      <div style={{ position: "absolute", left: 780, top: 700, opacity: drawing * (1 - ease(frame, strategyAt - 8, 8)) }}>
        <NumberCard x={0} y={0} big={'"sinkers"'} small={frame > deepAt ? "CARRY CARBON FROM THE SURFACE TO THE DEEP SEA" : frame > carbonAt ? "CARRY CARBON FROM THE SURFACE" : undefined} size={56} opacity={ease(frame, calledAt, 10)} />
        <NumberCard x={0} y={122} big="a missing piece" small="OF THE OCEAN'S CARBON BUDGET" size={56} opacity={ease(frame, pieceAt, 10)} color={B.paper} />
      </div>
      {/* line 5 · the three verbs as the drawing does them (it drifts back, filters, drops its house), then the payoff */}
      <div style={{ opacity: ease(frame, driftAt, 10) * (1 - ease(frame, mbariAt - 4, 8)) }}>
        <CaptionPop bottom={150} size={68} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            drift
            <span style={{ opacity: ease(frame, filterAt, 8) }}> · filter</span>
            <span style={{ opacity: ease(frame, throwAt, 8) }}> · throw away your home</span>
          </span>
          <br />
          <span style={{ color: B.gauge, whiteSpace: "nowrap", opacity: ease(frame, planetAt, 8) }}>and it helps run the planet</span>
        </CaptionPop>
      </div>
      {/* line 6 (source #14, MBARI) · microplastic: caught, eaten, carried down */}
      <Pill x={160} y={340} opacity={drawing * ease(frame, sameAt, 10)}>
        MBARI: the same filters collect
        {frame > microAt ? <span style={{ color: B.tease, opacity: ease(frame, microAt, 8) }}> microplastic</span> : null}
      </Pill>
      <Pill x={160} y={392} opacity={drawing * ease(frame, eatAt, 10)}>and the larvaceans eat it</Pill>
      <div style={{ opacity: ease(frame, websAt, 10) * (1 - ease(frame, siphAt - 4, 8)) }}>
        <CaptionPop bottom={150} size={62} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            a pathway for <span style={{ color: B.tease }}>plastic</span> into deep-sea food webs
          </span>
        </CaptionPop>
      </div>

      {/* the pictured animal is not the 45 m Apolemia (source #25): said on the picture for as long as the photo is up; "the 45 m one" only once the length has been spoken */}
      <Pill x={160} y={712} opacity={siph}>
        shown: a different siphonophore · NOAA, 2015
        {frame > fortyAt ? <span style={{ opacity: ease(frame, fortyAt, 8) }}> · not the 45 m one</span> : null}
      </Pill>
      {/* line 8 (sources #8, #30) · when, where, who; what it is; how it is built - all left of the animal (it starts at x≈1250) */}
      <Pill x={160} y={340} color={B.gauge} opacity={siph * ease(frame, falkorAt + 2, 10) * facts}>
        2020
        {frame > offAt ? <span style={{ opacity: ease(frame, offAt, 8) }}> · off Western Australia</span> : null}
        {frame > shipAt ? <span style={{ opacity: ease(frame, shipAt, 8) }}> · research ship Falkor</span> : null}
      </Pill>
      <Pill x={160} y={392} opacity={siph * ease(frame, colonyAt, 10) * facts}>
        a colony of thousands of tiny animals
        {frame > jobAt ? <span style={{ opacity: ease(frame, jobAt, 8) }}> · each with one job</span> : null}
      </Pill>
      <Pill x={160} y={444} opacity={siph * ease(frame, strungAt, 10) * facts}>strung together into one drifting line</Pill>
      {/* the length (source #8): the bar grows on "estimated at"; the bus (source #29, no number shown) and the figure on "forty-five metres" */}
      <div style={{ position: "absolute", left: 160, top: 512, width: 1040 * smooth(frame, estAt, estAt + 36), height: 10, borderRadius: 5, background: B.gauge, opacity: siph * bar }} />
      <div style={{ position: "absolute", left: 160, top: 534, width: 1040 * (12 / 45), height: 26, borderRadius: 6, background: B.mute, opacity: siph * ease(frame, fortyAt, 10) * facts }} />
      <Tag x={160 + 1040 * (12 / 45) + 16} y={532} color={B.paper} size={24} opacity={siph * ease(frame, fortyAt, 10) * facts}>a city bus</Tag>
      <div style={{ position: "absolute", left: 160, top: 574, opacity: siph * ease(frame, fortyAt, 10) * facts, transform: `scale(${1 + 0.06 * bump(frame, longestAt, 8, 20)})`, transformOrigin: "left top" }}>
        <NumberCard x={0} y={0} big="≈ 45 m" small={frame > longestAt ? "IF THE ESTIMATE HOLDS: THE LONGEST ANIMAL EVER RECORDED" : "AN APOLEMIA SIPHONOPHORE · ESTIMATED"} size={72} />
      </div>
      <div style={{ opacity: ease(frame, hangsAt, 10) * (1 - ease(frame, teaseAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={78} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            it hangs like a <span style={{ color: B.gauge }}>curtain</span>
            <span style={{ opacity: ease(frame, waitsAt, 8) }}> and waits</span>
          </span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, teaseAt + 2, 8) }}>
        <CaptionPop bottom={150} size={72} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>one type left —</span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, turnsAt, 8) }}>
            it turns a death into a <span style={{ color: B.gauge }}>neighbourhood</span>
          </span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/** the three drawn worms stand on the bone at these x positions */
const WORMS = [320, 570, 820];

/**
 * 8 · The Bone-Eater. Lines 0-8. Sources #10, #20, #21. Plate: a whale skeleton covered in octopuses, Monterey Bay National Marine
 * Sanctuary, 2019 (OET/NOAA, CC BY 2.0) - a different whale fall from the one the worms were described from, and its record gives no
 * depth, so none is stated for it. Inset on line 1: real Osedax japonicus on bone in an aquarium (Syced, CC0). Roots, bacteria and
 * dwarf males are drawn.
 * 0 "When a whale dies and sinks, it lands on a sea floor... Everything comes. And when the flesh is gone... something arrives that eats bone."
 * 1 "They're called Osedax. Worms, found on a whale skeleton nearly three kilometres down on the floor of Monterey Bay, and named in 2004. They have no way to chew."
 * 2 "Instead, the females grow branching, root-like tissues into the bone, and inside those roots live bacteria that break down the fats and oils... and feed the worm."
 * 3 "...the first time anyone had seen a fat-digesting bacterium living inside another animal this way."
 * 4 "And the males? They are dwarfs — microscopic, living inside the jelly tube around her body — ...more than six hundred of them."
 * 5 "...meeting a mate is as unlikely as finding a meal, the answer is to bring the whole population to the bone."
 * 6 "Scientists have since found thirty-two species, from ten metres down to four thousand — and not only on whales. Fish, birds, turtles, even land mammals. Wherever a skeleton lands..."
 * 7 "They aren't alone. Bone-eating snails share the same skeleton. The scavengers strip the soft tissue in a matter of months; the skeleton then feeds a community for years — sometimes decades."
 * 8 "That's the eighth strategy: don't wait for crumbs. Wait for the whole meal, once — and then build your life on it."
 */
export const BoneEater: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const landsAt = within(t, 0, 0.14); // "it lands on a sea floor"
  const foodAt = within(t, 0, 0.38); // "that much food at once"
  const everythingAt = within(t, 0, 0.49); // "Everything comes"
  const skeletonAt = within(t, 0, 0.71); // "and only the skeleton is left"
  const boneAt = within(t, 0, 0.86); // "something arrives that eats bone"
  const nameAt = lineAt(t, 1);
  const calledAt = within(t, 1, 0.08); // "Osedax"
  const foundAt = within(t, 1, 0.2); // "found on a whale skeleton"
  const deepAt = within(t, 1, 0.36); // "nearly three kilometres down"
  const bayAt = within(t, 1, 0.54); // "on the floor of Monterey Bay"
  const namedAt = within(t, 1, 0.73); // "and named in 2004"
  const chewAt = within(t, 1, 0.85); // "They have no way to chew"
  const rootsAt = lineAt(t, 2);
  const growAt = within(t, 2, 0.07); // "the females grow branching, root-like tissues"
  const bacteriaAt = within(t, 2, 0.5); // "live bacteria"
  const breakAt = within(t, 2, 0.57); // "that break down the fats and oils"
  const feedAt = within(t, 2, 0.9); // "and feed the worm"
  const lensAt = lineAt(t, 3);
  const firstAt = within(t, 3, 0.24); // "it was the first time"
  const fatAt = within(t, 3, 0.53); // "a fat-digesting bacterium"
  const insideAt = within(t, 3, 0.72); // "living inside another animal"
  const malesAt = lineAt(t, 4);
  const dwarfsAt = within(t, 4, 0.1); // "They are dwarfs"
  const microAt = within(t, 4, 0.2); // "microscopic"
  const tubeAt = within(t, 4, 0.28); // "living inside the jelly tube around her body"
  const largerAt = within(t, 4, 0.54); // "and some of the larger species"
  const hundredAt = within(t, 4, 0.85); // "more than six hundred of them"
  const populationAt = lineAt(t, 5);
  const mateAt = within(t, 5, 0.3); // "as unlikely as finding a meal"
  const answerAt = within(t, 5, 0.55); // "the answer is to bring the whole population to the bone"
  const speciesAt = lineAt(t, 6);
  const thirtyAt = within(t, 6, 0.13); // "thirty-two species"
  const tenAt = within(t, 6, 0.24); // "from ten metres down"
  const fourAt = within(t, 6, 0.34); // "to four thousand"
  const whalesAt = within(t, 6, 0.43); // "and not only on whales"
  const boneOf = [within(t, 6, 0.55), within(t, 6, 0.58), within(t, 6, 0.61), within(t, 6, 0.66)]; // "Fish" · "birds" · "turtles" · "even land mammals"
  const whereverAt = within(t, 6, 0.75); // "Wherever a skeleton lands"
  const waitingAt = within(t, 6, 0.88); // "something is waiting for it"
  const aloneAt = lineAt(t, 7);
  const snailsAt = within(t, 7, 0.11); // "Bone-eating snails share the same skeleton"
  const scavAt = within(t, 7, 0.34); // "The scavengers strip the soft tissue"
  const monthsAt = within(t, 7, 0.54); // "in a matter of months"
  const yearsAt = within(t, 7, 0.84); // "for years"
  const decadesAt = within(t, 7, 0.91); // "sometimes decades"
  const strategyAt = lineAt(t, 8);
  const crumbsAt = within(t, 8, 0.26); // "don't wait for crumbs"
  const wholeAt = within(t, 8, 0.46); // "Wait for the whole meal, once"
  const lifeAt = within(t, 8, 0.74); // "and then build your life on it"

  // the board is held for 1.5 s after its last chip ("even land mammals"), then the photo comes back and the caption follows
  const boardOutAt = Math.max(whereverAt - 8, boneOf[3] + 53);
  const inset = ease(frame, nameAt, 12) * (1 - ease(frame, rootsAt - 8, 8)); // line 1: the real worms, in an aquarium
  const vis = ease(frame, rootsAt, 12) * (1 - ease(frame, thirtyAt - 12, 10)); // lines 2-5: the drawing (it hands over to the board on "thirty-two species")
  const words = 1 - ease(frame, speciesAt - 6, 8); // ...but line 5's words leave when line 6 starts
  const board = ease(frame, thirtyAt - 2, 10) * (1 - ease(frame, boardOutAt, 8)); // line 6: the species board
  const covered = ease(frame, nameAt, 12) * (1 - ease(frame, boardOutAt, 10)); // the photo is a dim backdrop (0.18) from line 1 until the board leaves

  // The camera on the whale photo (1851 px wide: scale <= 1.2). In the full frame the ribs fan out on the left (x 0-940), the
  // skull is right of centre, octopuses sit near (580, 463), (1040, 423), (1470, 353) and (1820, 633), eelpouts along the bottom.
  const shots: Shot[] = [
    [0, 1.2, 30, 100], // opens low, on the sea floor
    [landsAt, 1.2, 30, 96],
    [landsAt + 45, 1.2, 30, 40, "move"], // "it lands on a sea floor": up onto the skeleton
    [foodAt, 1.2, 32, 38],
    [foodAt + 36, 1, 50, 50, "move"], // "that much food at once": the whole of it
    [everythingAt, 1.02, 60, 45],
    [everythingAt + 36, 1.2, 70, 38, "move"], // "Everything comes": in on the octopuses on the skull
    [skeletonAt, 1.2, 68, 38],
    [skeletonAt + 45, 1.2, 8, 45, "move"], // "and only the skeleton is left": across to the bare ribs
    [nameAt, 1.2, 4, 45],
    [nameAt + 30, 1.05, 50, 50, "move"], // a backdrop behind the aquarium photo and the drawing
    [boardOutAt, 1.1, 50, 50],
    [boardOutAt + 40, 1.15, 72, 40, "move"], // "Wherever a skeleton lands, something is waiting": the photo is back - toward the skull
    [aloneAt, 1.17, 72, 40],
    [aloneAt + 45, 1.2, 0, 0, "move"], // "They aren't alone": across the whole skeleton; this framing keeps the top-left rows over bare ribs
    [scavAt, 1.2, 0, 0],
    [scavAt + 40, 1.2, 15, 0, "move"], // "The scavengers strip the soft tissue": along it
    [strategyAt, 1.2, 15, 0],
    [strategyAt + 50, 1, 50, 50, "move"], // "the whole meal": all of it
    [lifeAt, 1.03, 60, 45],
    [t.frames, 1.12, 68, 40], // "build your life on it": slowly in on the animals living on the skull
  ];

  const credit =
    frame >= rootsAt - 4 && frame < boardOutAt + 4
      ? ({ kind: "illustration", source: "over a photo by OET/NOAA (CC BY 2.0)" } as const)
      : frame >= nameAt + 4 && frame < rootsAt - 4
        ? ({ kind: "real", source: "OET/NOAA (CC BY 2.0) · inset: Syced (CC0), Osedax japonicus, Enoshima Aquarium" } as const)
        : ({ kind: "real", source: "OET/NOAA (CC BY 2.0) · whale skeleton with octopuses, Monterey Bay National Marine Sanctuary, 2019" } as const);

  // the drawing: three females on a bone in section. Roots grow in on line 2; the lens looks at a root tip (line 3) and then at
  // the jelly tube with its dwarf males (lines 4-5).
  const toTube = smooth(frame, malesAt, malesAt + 24);
  const lens = ease(frame, lensAt, 14);
  const tube = ease(frame, tubeAt, 14);
  const fed = ease(frame, feedAt, 10);
  const males = 3 * ease(frame, dwarfsAt, 8) + 37 * lin(frame, largerAt, hundredAt); // the lens fills up as "some of the larger species... more than six hundred" is said
  const srcX = 918 - 98 * toTube; // what the lens is looking at: a root tip of the third worm, then her trunk
  const srcY = 856 - 236 * toTube;

  return (
    <RungShell t={t} index={7} plate={{ image: "whale-fall" }} brightness={0.88 - 0.7 * covered} plateMove={cameraAt(frame, shots)} credit={credit} revealAt={boneAt}>
      {/* scrim under the gauge column: one octopus sits at the right edge of the photo, and the gauge's labels are not about it */}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,14,24,0) 86%, rgba(5,14,24,0.78) 91.5%)" }} />

      {/* line 0 · two captions, each on its words (the title and the eighth tile are revealed with the second) */}
      <div style={{ opacity: ease(frame, everythingAt, 8) * (1 - ease(frame, skeletonAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={92} color={B.paper}>
          <span style={{ color: B.gauge }}>everything</span> comes
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, boneAt, 10) * (1 - ease(frame, nameAt - 4, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            something arrives that eats <span style={{ color: B.gauge }}>bone</span>
          </span>
        </CaptionPop>
      </div>

      {/* the only animals in the plain photo are octopuses - said beside them (below the one on the ribs, over rib ends and bare
          floor), from "Everything comes" until the aquarium photo arrives, so nobody takes them for the bone-eaters */}
      <Pill x={160} y={614} opacity={ease(frame, everythingAt + 30, 10) * (1 - ease(frame, nameAt - 10, 8))}>octopuses on the skeleton</Pill>

      {/* line 1 · the animal itself: real bone-eating worms on a piece of bone, photographed in an aquarium - the picture says so from
          its first frame. The camera inside the card pushes in on the worms. */}
      <div style={{ position: "absolute", left: 160, top: 336, width: 740, height: 470, borderRadius: 22, overflow: "hidden", outline: `4px solid ${B.paper}`, boxShadow: "0 12px 40px rgba(0,0,0,0.6)", background: B.ink, opacity: inset, transform: `translateX(${-50 * (1 - ease(frame, nameAt, 14))}px)` }}>
        <Img src={levelImage({ id: "osedax", name: "", reading: "", image: "osedax-aquarium" })!} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.1 * lin(frame, nameAt, rootsAt) + 0.22 * smooth(frame, chewAt, chewAt + 30)})`, transformOrigin: "50% 58%" }} />
        <div style={{ position: "absolute", left: 14, bottom: 14, padding: "6px 14px", borderRadius: 10, background: "rgba(5,14,24,0.86)", fontFamily: F.ui, fontWeight: 800, fontSize: 26, lineHeight: "34px", letterSpacing: 1.5, textTransform: "uppercase", color: B.paper, whiteSpace: "nowrap" }}>real bone-eating worms · in an aquarium</div>
      </div>
      {/* the discovery (sources #10, #20), one fact per phrase, beside the photo */}
      <div style={{ position: "absolute", left: 940, top: 336, opacity: inset * ease(frame, calledAt, 10) }}>
        <NumberCard x={0} y={0} big="Osedax" size={88} />
      </div>
      <Pill x={940} y={462} opacity={inset * ease(frame, foundAt, 10)}>found on a whale skeleton</Pill>
      <Pill x={940} y={514} opacity={inset * ease(frame, deepAt, 10)}>2,891 m down</Pill>
      <Pill x={940} y={566} opacity={inset * ease(frame, bayAt, 10)}>Monterey Bay</Pill>
      <Pill x={940} y={618} color={B.gauge} opacity={inset * ease(frame, namedAt, 10)}>named in 2004</Pill>
      {/* the whale skeleton behind (dimmed to 0.18) was photographed in 2019: it is not the one the worms were found on, and the picture says so while the discovery is told */}
      <Pill x={160} y={940} opacity={inset}>shown behind: a different whale skeleton, photographed in 2019</Pill>
      <div style={{ opacity: ease(frame, chewAt, 10) * (1 - ease(frame, rootsAt - 4, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          no way to <span style={{ color: B.gauge }}>chew</span>
        </CaptionPop>
      </div>

      {/* lines 2-5 · a bone in section: roots grow in, bacteria in the roots, fat broken down and passed up to the worm; then the jelly tubes and the males */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: vis }}>
        <defs>
          <clipPath id="l08-lens">
            <circle cx={0} cy={0} r={176} />
          </clipPath>
        </defs>
        <rect x={180} y={690} width={780} height={220} rx={60} fill="#E9E2D0" />
        {/* the fats and oils locked in the bone: they shrink from "break down the fats and oils" */}
        {Array.from({ length: 18 }, (_, k) => (
          <circle key={`o${k}`} cx={215 + ((k * 97) % 710)} cy={716 + ((k * 61) % 170)} r={(9 + (k % 3) * 2) * (1 - 0.75 * ease(frame, breakAt + (k % 6) * 8, 36))} fill="#F2C94C" opacity={0.85} />
        ))}
        {WORMS.map((wx, w) => {
          const sw = 5 * Math.sin(frame / 22 + w);
          const branches = [`M${wx} 690 L ${wx} 770`, `M${wx} 716 Q ${wx - 50} 760 ${wx - 92} 846`, `M${wx} 732 Q ${wx + 56} 770 ${wx + 98} 856`, `M${wx} 770 Q ${wx - 10} 830 ${wx - 34} 888`, `M${wx} 770 Q ${wx + 14} 826 ${wx + 48} 886`];
          const germs = [[-92, 846], [98, 856], [-34, 888], [48, 886], [-46, 766], [50, 778], [-18, 834], [26, 832]];
          return (
            <g key={wx}>
              {/* roots: drawn on, branch by branch, from "the females grow branching, root-like tissues into the bone" */}
              {branches.map((d, i) => (
                <path key={i} d={d} stroke="#C0231F" strokeWidth={i === 0 ? 9 : 6} fill="none" strokeLinecap="round" strokeDasharray={220} strokeDashoffset={220 * (1 - smooth(frame, growAt + i * 10 + w * 6, growAt + 50 + i * 10 + w * 6))} />
              ))}
              {/* bacteria in the roots, from "live bacteria": they never sit still */}
              {germs.map(([dx, dy], k) => (
                <circle key={k} cx={wx + dx + 2 * Math.sin(frame / 7 + k + w)} cy={dy + 2 * Math.cos(frame / 9 + k * 1.7)} r={7} fill="#8E6BFF" stroke={B.ink} strokeWidth={1.5} opacity={ease(frame, bacteriaAt + k * 4 + w * 3, 8)} />
              ))}
              {/* "and feed the worm": food rides up the root into her body */}
              {Array.from({ length: 3 }, (_, j) => {
                const q = fract((frame - feedAt) / 46 + j / 3 + w * 0.2);
                return <circle key={`q${j}`} cx={wx + 3 * Math.sin(q * 9)} cy={880 - 330 * q} r={6} fill="#1E9E48" stroke={B.paper} strokeWidth={1.5} opacity={fed * Math.min(1, q / 0.1) * Math.min(1, (1 - q) / 0.15)} />;
              })}
              {/* the jelly tube around her body (line 4), and the males that arrive on "bring the whole population to the bone" */}
              <rect x={wx - 26} y={552} width={52} height={138} rx={22} fill="rgba(191,239,255,0.16)" stroke="#BFEFFF" strokeWidth={3} opacity={tube} />
              <path d={`M${wx} 690 C ${wx - 10} 640, ${wx + 10} 600, ${wx + sw} 545`} stroke="#F08A8A" strokeWidth={16} fill="none" strokeLinecap="round" />
              {Array.from({ length: 4 }, (_, i) => {
                const s2 = 6 * Math.sin(frame / 14 + i + w);
                return <path key={`pl${i}`} d={`M${wx + sw} 545 C ${wx + sw + (i - 1.5) * 18} 512, ${wx + sw + (i - 1.5) * 34 + s2} 484, ${wx + sw + (i - 1.5) * 30 + s2 * 1.6} ${458 - 12 * bump(frame, feedAt + 20, 10, 30)}`} stroke="#E0453A" strokeWidth={7} fill="none" strokeLinecap="round" />;
              })}
              {Array.from({ length: 6 }, (_, k) => {
                const go = smooth(frame, answerAt + k * 5 + w * 8, answerAt + 30 + k * 5 + w * 8);
                const ex = wx + (k % 2 ? 18 : -18);
                const ey = 574 + k * 18;
                const sx = wx - 150 + k * 14;
                return <circle key={`m${k}`} cx={sx + (ex - sx) * go + 1.5 * Math.sin(frame / 6 + k)} cy={456 + (ey - 456) * go} r={4.5} fill={B.gauge} stroke={B.ink} strokeWidth={1} opacity={ease(frame, answerAt + k * 5 + w * 8, 6)} />;
              })}
            </g>
          );
        })}
        {/* the lens: what it looks at is ringed on the drawing; it opens on line 3 and steps forward on "the answer" */}
        <g opacity={lens}>
          <circle cx={srcX} cy={srcY} r={30} fill="none" stroke={B.paper} strokeWidth={4} />
          <path d={`M${srcX + 21} ${srcY - 21} L 1088 513 M${srcX + 21} ${srcY + 21} L 1088 767`} stroke={B.paper} strokeWidth={2.5} opacity={0.6} />
          <g transform={`translate(1215 640) scale(${(0.3 + 0.7 * lens) * (1 + 0.05 * bump(frame, answerAt, 8, 20))})`}>
            <circle cx={0} cy={0} r={180} fill="#0E2740" stroke={B.paper} strokeWidth={5} />
            <g clipPath="url(#l08-lens)">
              {/* line 3 · inside a root: the bacteria (purple) and the fat they digest (yellow, shrinking as it is drawn in) */}
              <g opacity={1 - toTube}>
                <rect x={-180} y={-180} width={360} height={360} fill="#E9E2D0" />
                {[[-96, 84], [24, 112], [-30, -118], [104, -64]].map(([fx, fy], k) => {
                  const q = fract(frame / 44 + k / 4);
                  return (
                    <g key={k}>
                      <circle cx={fx} cy={fy} r={20 * (0.65 + 0.35 * Math.abs(Math.sin(frame / 30 + k)))} fill="#F2C94C" />
                      <circle cx={fx * (1 - q) + (k % 2 ? 40 : -40) * q} cy={fy * (1 - q)} r={6} fill="#F2C94C" stroke={B.ink} strokeWidth={1.5} opacity={Math.min(1, (1 - q) / 0.2)} />
                    </g>
                  );
                })}
                <path d="M-210 -64 C -80 -40, 40 10, 210 64" stroke={B.paper} strokeWidth={104} fill="none" strokeLinecap="round" opacity={bump(frame, insideAt, 8, 30)} />
                <path d="M-210 -64 C -80 -40, 40 10, 210 64" stroke="#C0231F" strokeWidth={88} fill="none" strokeLinecap="round" />
                {Array.from({ length: 7 }, (_, k) => {
                  const u = -150 + k * 50;
                  const hi = bump(frame, fatAt + k * 2, 8, 30);
                  return <circle key={k} cx={u + 4 * Math.sin(frame / 7 + k)} cy={u * 0.3 + (k % 2 ? 16 : -16) + 4 * Math.cos(frame / 9 + k * 1.7)} r={13 + 2 * Math.sin(frame / 11 + k) + 7 * hi} fill="#8E6BFF" stroke={hi > 0.1 ? B.gauge : B.ink} strokeWidth={2 + 3 * hi} />;
                })}
              </g>
              {/* lines 4-5 · her trunk in its jelly tube, the dwarf males between the two */}
              <g opacity={toTube}>
                <rect x={-84} y={-200} width={168} height={400} rx={60} fill="rgba(191,239,255,0.16)" stroke="#BFEFFF" strokeWidth={4} opacity={tube} />
                <path d="M0 -200 L 0 200" stroke="#F08A8A" strokeWidth={64} />
                {Array.from({ length: 40 }, (_, k) => (
                  <circle key={k} cx={(k % 2 ? 1 : -1) * (46 + (k % 3) * 10) + 2 * Math.sin(frame / 6 + k)} cy={-150 + ((k * 41) % 300) + 2 * Math.cos(frame / 8 + k)} r={6.5} fill={B.gauge} stroke={B.ink} strokeWidth={1.5} opacity={Math.min(1, Math.max(0, males - k))} />
                ))}
              </g>
            </g>
          </g>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 180, top: 926, fontFamily: F.ui, fontWeight: 800, fontSize: 22, color: B.mute, letterSpacing: 2, whiteSpace: "nowrap", opacity: vis }}>DRAWING · NOT TO SCALE</div>
      {/* the words for the drawing: two rows that take turns, read top to bottom, each phrase on its cue and gone before the next one needs the row */}
      <Pill x={160} y={336} opacity={vis * ease(frame, growAt, 10) * (1 - ease(frame, bacteriaAt - 8, 8))}>the females grow branching roots into the bone</Pill>
      <Pill x={160} y={336} color="#C9BBFF" opacity={vis * ease(frame, bacteriaAt, 10) * (1 - ease(frame, lensAt - 8, 8))}>
        bacteria inside the roots
        {frame > breakAt ? <span style={{ color: B.paper, opacity: ease(frame, breakAt, 8) }}> break down the bone’s fats and oils</span> : null}
      </Pill>
      <Pill x={160} y={384} color="#7FE07F" opacity={vis * ease(frame, feedAt, 10) * (1 - ease(frame, lensAt - 8, 8))}>…and feed the worm</Pill>
      {/* source #10: "the first time a lipid-degrading bacterium has been observed in a symbiotic relationship" */}
      <Pill x={160} y={336} opacity={vis * ease(frame, firstAt, 10) * (1 - ease(frame, malesAt - 8, 8))}>
        <span style={{ color: B.gauge }}>a first:</span> a fat-digesting bacterium living inside another animal
      </Pill>
      <Pill x={160} y={336} opacity={vis * ease(frame, malesAt + 4, 10) * (1 - ease(frame, populationAt - 8, 8))}>
        the males?
        {frame > dwarfsAt ? <span style={{ color: B.gauge, opacity: ease(frame, dwarfsAt, 8) }}> dwarfs</span> : null}
        {frame > microAt ? <span style={{ opacity: ease(frame, microAt, 8) }}> · microscopic</span> : null}
      </Pill>
      <Pill x={160} y={384} color="#BFEFFF" opacity={vis * ease(frame, tubeAt, 10) * (1 - ease(frame, populationAt - 8, 8))}>living inside the jelly tube around her body</Pill>
      {/* the harem count (source #20, MBARI), under the lens, on "more than six hundred" */}
      <div style={{ position: "absolute", left: 990, top: 836, opacity: vis * ease(frame, hundredAt, 10) * (1 - ease(frame, populationAt - 8, 8)) }}>
        <NumberCard x={0} y={0} big="> 600 males" small="IN SOME OF THE LARGER SPECIES" size={52} />
      </div>
      <Pill x={160} y={336} opacity={vis * words * ease(frame, mateAt, 10)}>a mate: as unlikely as a meal</Pill>
      <Pill x={160} y={384} color={B.gauge} opacity={vis * words * ease(frame, answerAt, 10)}>the answer: bring the whole population to the bone</Pill>

      {/* line 6 (source #20) · the genus since 2004: the count with one small worm per species, the depth range, then each kind of bone as it is named */}
      <div style={{ position: "absolute", left: 160, top: 340, opacity: board }}>
        <NumberCard x={0} y={0} big="32 species" size={80} opacity={ease(frame, thirtyAt, 10)} />
        <NumberCard x={0} y={212} big={frame > fourAt ? "from 10 m down to 4,000 m" : "from 10 m down…"} size={56} opacity={ease(frame, tenAt, 10)} color={B.paper} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: board }}>
        {Array.from({ length: 32 }, (_, i) => {
          const gx = 632 + (i % 8) * 84;
          const gy = 372 + Math.floor(i / 8) * 46;
          const s = 3 * Math.sin(frame / 12 + i);
          return (
            <g key={i} opacity={ease(frame, thirtyAt + i * 2, 8)} transform={`translate(${gx} ${gy}) scale(${0.6 + 0.4 * ease(frame, thirtyAt + i * 2, 10)})`}>
              <path d="M0 14 L 0 -4" stroke="#F08A8A" strokeWidth={6} strokeLinecap="round" />
              <path d={`M0 -4 L ${-9 + s} -20 M0 -4 L ${s} -22 M0 -4 L ${9 + s} -20`} stroke="#E0453A" strokeWidth={3.5} strokeLinecap="round" fill="none" />
            </g>
          );
        })}
      </svg>
      <Pill x={160} y={652} opacity={board * ease(frame, whalesAt, 10)}>and not only on whales:</Pill>
      <div style={{ position: "absolute", left: 160, top: 716, display: "flex", gap: 16, opacity: board }}>
        {["fish", "birds", "turtles", "even land mammals"].map((s, i) => (
          <div key={s} style={{ padding: "16px 24px", borderRadius: 16, background: B.paper, color: B.ink, fontFamily: F.headline, fontSize: 44, lineHeight: "44px", whiteSpace: "nowrap", opacity: ease(frame, boneOf[i], 8), transform: `scale(${1 + 0.15 * bump(frame, boneOf[i], 6, 14)})` }}>
            {s}
          </div>
        ))}
      </div>
      <div style={{ opacity: ease(frame, boardOutAt + 10, 10) * (1 - ease(frame, aloneAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={72} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>wherever a skeleton lands,</span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, Math.max(waitingAt, boardOutAt + 24), 8) }}>
            <span style={{ color: B.gauge }}>something is waiting</span> for it
          </span>
        </CaptionPop>
      </div>

      {/* line 7 (sources #10, #21) · on the photo again. The rows sit top-left, where this framing shows only bare ribs: nothing here
          labels the octopuses or the fish (none of them is a bone-eating snail). */}
      <Pill x={160} y={336} opacity={ease(frame, snailsAt, 10) * (1 - ease(frame, monthsAt - 8, 8))}>bone-eating snails share the same skeleton</Pill>
      {/* (kept short: it must end left of the octopus that sits on the ribs, at about x 540 in this framing) */}
      <Pill x={160} y={388} opacity={ease(frame, monthsAt, 10) * (1 - ease(frame, strategyAt - 8, 8))}>soft tissue: months</Pill>
      <Pill x={160} y={336} color={B.gauge} opacity={ease(frame, yearsAt, 10) * (1 - ease(frame, strategyAt - 8, 8))}>
        the skeleton: years
        {frame > decadesAt ? <span style={{ opacity: ease(frame, decadesAt, 8) }}> — sometimes decades</span> : null}
      </Pill>

      {/* line 8 · the strategy in its two halves (the hidden half keeps its place, so nothing jumps) */}
      <div style={{ opacity: ease(frame, crumbsAt, 10) }}>
        <CaptionPop bottom={150} size={78} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>don't wait for crumbs.</span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, wholeAt, 8) }}>
            wait for the <span style={{ color: B.gauge }}>whole meal</span>, once.
          </span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * Closer. Lines 0-2. The eight tiles arrive as they are named (the eighth, the whale fall, last); the three problems arrive as they
 * are named; then the question.
 * 0 "Eight types. The lure. The red torch. The trap mouth. The glass body. The giant. The faster. The drifter. The bone-eater."
 * 1 "Eight answers to the same three problems: no light, no food, nowhere to hide."
 * 2 "So the next time you see one of these animals — on a screen, in a list, in a museum — don't ask what it is. Ask which trick it's using. You'll usually be able to tell."
 */
export const Closer: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const eightAt = lineAt(t, 0);
  const tileAt = [0.12, 0.2, 0.32, 0.46, 0.59, 0.68, 0.78, 0.89].map((f) => within(t, 0, f)); // "The lure" ... "The bone-eater"
  const answersAt = lineAt(t, 1);
  const sameAt = within(t, 1, 0.19); // "to the same three problems"
  const problemAt = [within(t, 1, 0.56), within(t, 1, 0.69), within(t, 1, 0.8)]; // "no light" · "no food" · "nowhere to hide"
  const soAt = lineAt(t, 2);
  const animalsAt = within(t, 2, 0.16); // "one of these animals"
  const dontAt = within(t, 2, 0.52); // "don't ask what it is"
  const askAt = within(t, 2, 0.66); // "Ask which trick it's using"
  const tellAt = within(t, 2, 0.82); // "You'll usually be able to tell"

  // which tile is lit: the one just named on line 0
  const named = tileAt.filter((at) => frame >= at).length - 1;
  const lit = frame < answersAt ? named : -1;
  // "one of these animals": one pass of the light along the eight tiles, 11 frames each, each fading into the next
  const passAt = (i: number) => Math.min(ease(frame, animalsAt + i * 11, 5), 1 - ease(frame, animalsAt + (i + 1) * 11, 5));
  // the grid steps back for the three problems, comes forward again for "these animals", and leaves for the question
  // (it shrinks in the pause before line 1, so the sentence under it never meets its bottom row)
  const grid = 1 - 0.38 * smooth(frame, answersAt - 14, answersAt + 6) + 0.2 * smooth(frame, soAt + 4, soAt + 28);
  // the goosefish behind: a slow push all the way, and in on its face when the grid has gone
  const cam = 1 + 0.05 * lin(frame, 0, dontAt) + 0.1 * smooth(frame, dontAt, dontAt + 40) + 0.03 * lin(frame, dontAt + 40, t.frames);

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <Img src={levelImage(LEVELS[0])!} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${cam})`, transformOrigin: "38% 43%", filter: "brightness(0.35)" }} />
      <div style={{ position: "absolute", top: 120, left: 136, width: 1648, display: "grid", gridTemplateColumns: "repeat(4, 400px)", gap: 16, opacity: 1 - ease(frame, dontAt - 6, 10), transform: `scale(${grid})`, transformOrigin: "50% 0%" }}>
        {LEVELS_REVEALED.map((l, i) => (
          <div key={l.id} style={{ position: "relative", width: 400, height: 200 }}>
            {/* "Eight types": eight empty places, filled one by one */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, outline: "3px dashed rgba(255,255,255,0.4)", outlineOffset: -3, background: "rgba(5,14,24,0.45)", opacity: ease(frame, eightAt + i * 3, 8) * (1 - ease(frame, tileAt[i], 8)) }} />
            <div style={{ position: "absolute", inset: 0, opacity: ease(frame, tileAt[i], 8), transform: `scale(${0.9 + 0.1 * ease(frame, tileAt[i], 10) + (i === 7 ? 0.1 : 0.04) * bump(frame, tileAt[i] + 4, 6, 16)})` }}>
              {/* (tile 6's tighter crop of the isopod still now comes from ladder.ts) */}
              <Tile level={l} width={400} height={200} labelSize={22} state={i === lit ? "current" : "past"} />
              <div style={{ position: "absolute", inset: 0, borderRadius: 18, outline: `10px solid ${B.gauge}`, opacity: passAt(i) }} />
            </div>
          </div>
        ))}
      </div>
      {/* line 1 · the sentence, then each problem on its own words (the hidden ones keep their place) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", opacity: ease(frame, answersAt + 4, 10) * (1 - ease(frame, soAt - 4, 8)) }}>
        <div style={{ fontFamily: F.caption, fontWeight: 600, fontSize: 60, color: B.paper, whiteSpace: "nowrap", textShadow: "0 4px 18px rgba(0,0,0,0.8)" }}>
          eight answers<span style={{ opacity: ease(frame, sameAt, 8) }}> to the same <span style={{ color: B.gauge }}>three problems</span></span>
        </div>
        <div style={{ display: "inline-flex", gap: 24, marginTop: 36 }}>
          {PROBLEMS.map((p, i) => (
            <div key={p} style={{ padding: "22px 34px", borderRadius: 20, background: B.gauge, color: B.ink, fontFamily: F.headline, fontSize: 64, lineHeight: "76px", textTransform: "uppercase", whiteSpace: "nowrap", opacity: ease(frame, problemAt[i], 8), transform: `scale(${1 + 0.12 * bump(frame, problemAt[i], 6, 14)})` }}>
              {p}
            </div>
          ))}
        </div>
      </div>
      {/* line 2 · the question, centred on the frame (there is no gauge here), each half on its words */}
      <div style={{ position: "absolute", left: 130, right: -130, top: 0, bottom: 0, opacity: ease(frame, dontAt, 10) }}>
        <CaptionPop bottom={200} size={84} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>don't ask what it is.</span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, askAt, 8) }}>
            ask <span style={{ color: B.gauge }}>which trick</span> it's using.
          </span>
        </CaptionPop>
      </div>
      <div style={{ position: "absolute", left: 140, bottom: 60, opacity: ease(frame, tellAt, 12) }}>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: B.gauge }}>NEXT VIDEO</div>
        <div style={{ fontFamily: F.headline, fontSize: 64, color: B.paper, lineHeight: 1.05, whiteSpace: "nowrap" }}>EVERY LEVEL OF SPEED</div>
      </div>
      {/* the plate is the NOAA goosefish (manifest: anglerfish-lophiodes · sources #22); chip sits bottom-right, clear of NEXT LEVEL */}
      <div style={{ opacity: ease(frame, 0, 12) }}>
        <CreditChip kind="real" source="NOAA Ocean Exploration · goosefish, 2018" left={1180} />
      </div>
    </AbsoluteFill>
  );
};
