import React from "react";
import { useCurrentFrame } from "remotion";
import { CaptionPop, Tile } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { LEVELS, depthPos, pressureSub, pressureTag } from "../ladder";
import { NumberCard, RungShell, Tag } from "./shell";

/** frames the rung opens on the picture alone before bar, gauge and chip fade in */
const CHROME_FROM = 90;

/** even 0-1 between two frames */
const lin = (f: number, a: number, b: number) => Math.min(1, Math.max(0, (f - a) / Math.max(1, b - a)));
/** a short pulse: up over `up` frames, back down over `down` */
const bump = (f: number, at: number, up = 8, down = 26) => {
  const u = f - at;
  return u <= 0 ? 0 : u < up ? u / up : Math.max(0, 1 - (u - up) / down);
};

/** One camera position on the wreck photo: [frame, scale, origin x %, origin y %]; "ease" = eased into, otherwise a slow drift. */
type Position = [number, number, number, number, "ease"?];
const positionAt = (frame: number, path: Position[]) => {
  let i = 0;
  while (i < path.length - 2 && frame >= path[i + 1][0]) i++;
  const a = path[i];
  const b = path[i + 1];
  const x = lin(frame, a[0], b[0]);
  const k = b[4] === "ease" ? x * x * (3 - 2 * x) : x;
  return { scale: a[1] + (b[1] - a[1]) * k, origin: `${a[2] + (b[2] - a[2]) * k}% ${a[3] + (b[3] - a[3]) * k}%` };
};

/**
 * Level 8 - Titanic, 3,800 m. Sources: #21 (≈3.8 km, ~370 miles off Newfoundland, found 1 Sep
 * 1985, 73 years), #1 (average depth 3,682 m), #37 (rusticles are living bacteria/fungi;
 * Halomonas titanicae named 2010; timetable disputed), #11 (≈378 atm).
 * Lines: 0 "3,800 m... 370 miles off Newfoundland... most famous shipwreck" 1 "Titanic sank in 1912... 1 September 1985... 73 years..."
 * 2 "...We have just passed 3,682 metres." 3 "That is the average depth of the ocean." 4 "Average." (silent hold)
 * 5 "Everything so far... happened above the average sea floor." 6 "Picture the ocean floor anywhere... Titanic, in the dark, with nothing around it."
 * 7 "And she is being eaten." 8 "...rusticles... alive... bacteria and fungi..." 9 "...Halomonas titanicae."
 * 10 "Researchers disagree about the timetable..." 11 "Titanic is being digested... a window that is closing." 12 "...only a third of the way down."
 *
 * Final review 2026-09-30: the gauge runs down from Level 7's 2,992 m to 3,800 m in line 0 and holds - it is
 * only labelled "Titanic" once it reads 3,800 m (#21). The 3,682 m flag sits just above the pointer.
 *
 * Motion pass 2026-10-01: the wreck photo is filmed rather than hung. It opens close on the railing and pulls
 * back to the whole bow, pushes in on the rusticles when they are named, travels along the rail, and pulls back
 * for "Titanic is being digested". The dates count up as they are said, the tiles answer to their names, and the
 * rusticle tag builds one clause at a time instead of arriving whole at the top of the line.
 */
export const Titanic: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  // line 0: "...about three hundred and seventy miles off Newfoundland..."
  const milesAt = Math.max(within(t, 0, 0.35), CHROME_FROM + 16);
  const sankLineAt = lineAt(t, 1);
  // line 1: "Titanic sank in 1912. Nobody saw her again until the first of September, 1985 - seventy-three years later -
  // in part because it took that long to build machines that could search this deep."
  const sankAt = within(t, 1, 0.04);
  const rollAt = within(t, 1, 0.11);
  const foundAt = within(t, 1, 0.4);
  const yearsAt = within(t, 1, 0.45);
  const machinesAt = within(t, 1, 0.6);
  const planetAt = lineAt(t, 2);
  const passAt = within(t, 2, 0.55);
  const avgAt = lineAt(t, 3);
  const holdAt = lineAt(t, 4);
  const aboveAt = lineAt(t, 5);
  // line 5: "Everything so far - the last plant, the record dive, the great migration, the whales - all of it happened above..."
  const namedAt = [-1, within(t, 5, 0.14), within(t, 5, 0.26), within(t, 5, 0.38), -1, -1, within(t, 5, 0.53)];
  const allOfItAt = within(t, 5, 0.63);
  const pictureLineAt = lineAt(t, 6);
  const pictureAt = within(t, 6, 0.5);
  const nothingAt = within(t, 6, 0.64);
  const eatenAt = lineAt(t, 7);
  const railsAt = lineAt(t, 8);
  // line 8: "...have a name - rusticles - and they are alive. They are colonies of bacteria and fungi, consuming the iron of the ship itself."
  const rusticlesAt = within(t, 8, 0.36);
  const aliveAt = within(t, 8, 0.43);
  const coloniesAt = within(t, 8, 0.55);
  const ironAt = within(t, 8, 0.79);
  const speciesAt = lineAt(t, 9);
  const nameAt = within(t, 9, 0.7);
  const timetableAt = lineAt(t, 10);
  const directionAt = within(t, 10, 0.52);
  const digestedAt = lineAt(t, 11);
  const windowAt = within(t, 11, 0.55);
  const thirdAt = lineAt(t, 12);

  // the gauge only ever goes down: it comes in with the chrome (frames 90-105) still on Level 7's 2,992 m,
  // runs to Titanic's 3,800 m while line 0 is spoken, and holds there for the rest of the rung
  const depth = 2992 + (3800 - 2992) * ease(frame, CHROME_FROM + 6, 60);
  const arrived = depth >= 3799.5;
  // the 3,682 m flag: the number when the voice says "we have just passed", its meaning on the reveal line.
  // It leaves with the tiles at "Picture the ocean floor..." so that line shows the wreck and nothing else.
  const flag = ease(frame, passAt, 12) * (1 - ease(frame, pictureLineAt, 12));
  const flagLabel = ease(frame, avgAt, 10);
  const flagY = 250 + depthPos(3682) * 700;
  const hold = ease(frame, holdAt, 8) * (1 - ease(frame, aboveAt, 8));
  const above = ease(frame, aboveAt, 12) * (1 - ease(frame, pictureLineAt, 12));
  const rust = ease(frame, eatenAt, 12) * (1 - ease(frame, thirdAt, 8));
  // the found year counts up from 1912 while "Nobody saw her again until..." is spoken, and lands on 1985 as it is said
  const year = Math.round(1912 + 73 * lin(frame, rollAt, foundAt));
  // "Titanic, in the dark, with nothing around it": the wide shot sinks darker, and comes back for "she is being eaten"
  const inTheDark = ease(frame, nothingAt, 30) * (1 - ease(frame, eatenAt, 20));
  // "a window that is closing": the picture dims steadily to the end of the line and stays down for the last caption
  const closing = lin(frame, windowAt, thirdAt);
  const allOfIt = bump(frame, allOfItAt);

  // The camera on the bow. Unscaled, the top rail runs from about (30 %, 15 %) down to (52 %, 30 %) and up to
  // (75 %, 20 %); the big rusticle curtain hangs from it at about (62 %, 43 %); the rusted bollard is at (67 %, 68 %).
  // Nothing drawn is pinned to the photo (the 3,682 m flag points at the gauge), so the picture is free to move.
  // The source is 1,480 px wide (already 1.3x at scale 1), so no stop goes past 1.2; the travel comes from moving
  // the origin instead. Every origin is inside the frame and every scale >= 1, so no edge of the photo can show.
  const path: Position[] = [
    [0, 1.2, 58, 36], // opens close on the railing, the picture alone...
    [240, 1.04, 52, 44, "ease"], // ...and pulls back to the whole bow by "the most famous shipwreck in the world"
    [machinesAt, 1.1, 52, 44],
    [machinesAt + 60, 1.18, 62, 64, "ease"], // "machines that could search this deep": down onto the foredeck
    [planetAt, 1.2, 62, 64],
    [planetAt + 60, 1.08, 50, 45, "ease"], // "the part that should change how you picture the planet": wide for the flag
    [pictureLineAt, 1.14, 50, 45],
    [nothingAt, 1.2, 50, 45], // creeping in through "Picture the ocean floor anywhere in the world..."
    [nothingAt + 50, 1, 50, 45, "ease"], // "...Titanic, in the dark, with nothing around it": all the way out
    [eatenAt, 1.02, 50, 45],
    [railsAt, 1.1, 60, 40],
    [railsAt + 40, 1.18, 66, 40, "ease"], // "Those rust-coloured icicles hanging off her railings": push in on them
    [coloniesAt, 1.2, 68, 40],
    [coloniesAt + 60, 1.2, 22, 28, "ease"], // "They are colonies of bacteria and fungi": travel left along the rail
    [speciesAt, 1.2, 18, 28],
    [speciesAt + 50, 1.16, 48, 36, "ease"], // "One of the species found in them...": ease back to the middle of the rail
    [timetableAt, 1.18, 50, 36],
    [digestedAt, 1.2, 66, 62], // slow travel down toward the bollard through "Researchers disagree..."
    [digestedAt + 60, 1.04, 50, 45, "ease"], // "Titanic is being digested": back out to the whole wreck
    [t.frames, 1.1, 50, 45],
  ];

  return (
    <RungShell t={t} index={7} depth={depth} plate={LEVELS[7]} brightness={0.8 - 0.25 * above - 0.18 * inTheDark - 0.28 * closing} plateMove={positionAt(frame, path)} credit={{ kind: "real", source: "NOAA / IFE / URI" }} sub={arrived ? pressureTag(3800, "Titanic") : pressureSub(depth)} chromeFrom={CHROME_FROM}>
      {/* where she lies (#21), as the voice says it; gone before the dates take the same slot */}
      <div style={{ position: "absolute", left: 160, top: 300, opacity: ease(frame, milesAt, 10) * (1 - ease(frame, sankLineAt - 10, 8)) }}>
        <NumberCard x={0} y={0} big="≈ 370 miles" small="OFF NEWFOUNDLAND · ON THE SEA FLOOR" size={84} color={B.paper} />
      </div>
      {/* found: the dates. NumberCard's layout, built here so each part can arrive on its word: "1912 / SANK", then the
          year running up to 1985 / "FOUND", then "73 YEARS". The hidden parts hold their space, so the card never resizes. */}
      <div style={{ position: "absolute", left: 160, top: 300, opacity: ease(frame, sankAt, 10) * (1 - ease(frame, planetAt, 10)), padding: "10px 22px 12px", borderRadius: 16, background: B.paper, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
        <div style={{ fontFamily: F.headline, fontSize: 84, lineHeight: 1, whiteSpace: "nowrap" }}>
          1912<span style={{ opacity: ease(frame, rollAt, 8) }}> → {year}</span>
        </div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 30, marginTop: 4, letterSpacing: 1, whiteSpace: "nowrap" }}>
          SANK<span style={{ opacity: ease(frame, foundAt, 8) }}> · FOUND</span>
          <span style={{ opacity: ease(frame, yearsAt, 8) }}> · 73 YEARS IN THE DARK</span>
        </div>
      </div>

      {/* the AVERAGE DEPTH flag on the gauge - the share moment. Its arrow stays on the 3,682 m line (8 px above
          the 3,800 m pointer, to scale); the card unfolds its meaning downward on "That is the average depth". */}
      <div style={{ position: "absolute", right: 340, top: flagY - 34, opacity: flag, display: "flex", alignItems: "flex-start", transform: `scale(${1 + 0.06 * hold})`, transformOrigin: "right 34px" }}>
        <div style={{ padding: "10px 20px 12px", borderRadius: 14, background: B.paper, color: B.ink, fontFamily: F.headline, fontSize: 48, lineHeight: 1, whiteSpace: "nowrap" }}>
          3,682 m
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 20, lineHeight: "24px", height: 24 * flagLabel, maxWidth: 420 * flagLabel, marginTop: 2 * flagLabel, opacity: flagLabel, overflow: "hidden", letterSpacing: 2 }}>AVERAGE DEPTH OF THE OCEAN</div>
        </div>
        <div style={{ marginTop: 20, width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: `20px solid ${B.paper}` }} />
      </div>
      {/* the hold: nothing else on screen but the word */}
      <div style={{ position: "absolute", left: 0, right: 380, top: 470, textAlign: "center", opacity: ease(frame, avgAt, 10) * (1 - ease(frame, aboveAt, 8)), fontFamily: F.headline, fontSize: 200, color: B.paper, letterSpacing: 4, textShadow: "0 12px 40px rgba(0,0,0,0.8)" }}>
        AVERAGE
      </div>

      {/* everything so far sits above this line: the seven tiles drop in from 40 px above, each fading in as it comes,
          and the four the voice names ("the last plant, the record dive, the great migration, the whales") step
          forward on their names. A tile is never lower than its resting place (y 518-602), so none can touch the
          3,682 m flag card (top y≈612) or the rule (y≈646) on the way in. */}
      <div style={{ position: "absolute", left: 140, top: flagY - 130, display: "flex", gap: 12, opacity: above }}>
        {LEVELS.slice(0, 7).map((l, i) => {
          const named = namedAt[i] < 0 ? 0 : ease(frame, namedAt[i], 6) * (1 - ease(frame, namedAt[i] + 26, 10));
          return (
            <div key={l.id} style={{ position: "relative", zIndex: named > 0 ? 1 : 0, opacity: ease(frame, aboveAt + i * 4, 10), transform: `translateY(${(1 - ease(frame, aboveAt + i * 4, 14)) * -40 - 10 * named - 8 * allOfIt}px) scale(${1 + 0.16 * named})` }}>
              <Tile level={l} width={150} height={84} state={named > 0.5 ? "current" : "past"} />
            </div>
          );
        })}
      </div>
      {/* "all of it happened above the average sea floor": the rule is there with the tiles; its tag waits for those
          words and steps forward with the rule */}
      <div style={{ position: "absolute", left: 140, right: 800, top: flagY - 2 - 2 * allOfIt, height: 4 + 4 * allOfIt, background: B.paper, opacity: above }} />
      <div style={{ position: "absolute", left: 140, top: flagY + 14, transform: `scale(${1 + 0.06 * allOfIt})`, transformOrigin: "left top" }}>
        <Tag x={0} y={0} opacity={above * ease(frame, allOfItAt, 10)} color={B.paper}>all of it happened above the average sea floor</Tag>
      </div>
      {/* "...the honest picture is this: Titanic, in the dark, with nothing around it" - tiles, rule, tag and flag
          are gone by now (pictureLineAt); the one caption arrives on the second half of the line */}
      <div style={{ opacity: ease(frame, pictureAt, 10) * (1 - ease(frame, eatenAt, 8)) }}>
        <CaptionPop bottom={150} size={72} color={B.paper}>
          the average ocean floor is <span style={{ color: B.gauge }}>Titanic-deep</span>
        </CaptionPop>
      </div>

      {/* being eaten: rusticles and the bacterium named after her */}
      {/* the caption belongs to line 7 only: it leaves as the rusticles line starts (final review 2026-10-01) */}
      <div style={{ opacity: rust * (1 - ease(frame, railsAt + 20, 10)) }}>
        <CaptionPop bottom={150} size={92} color={B.tease}>and she is being eaten</CaptionPop>
      </div>
      {/* the tag builds with the sentence: the name when it is given, what they are, then what they do (#37). The dark
          halo keeps it readable when the camera puts the bright rail behind it. Tag and name card both leave on
          "Titanic is being digested", so the last pull-back is the wreck alone. */}
      <div style={{ position: "absolute", left: 160, top: 300, opacity: rust * ease(frame, rusticlesAt, 10) * (1 - ease(frame, digestedAt, 12)), filter: "drop-shadow(0 0 3px rgba(5,14,24,1)) drop-shadow(0 0 10px rgba(5,14,24,0.9))" }}>
        <Tag x={0} y={0} color={B.paper}>
          rusticles<span style={{ opacity: ease(frame, coloniesAt, 10) }}> · living colonies of bacteria and fungi</span>
          <span style={{ opacity: ease(frame, ironAt, 10) }}>, eating the iron</span>
        </Tag>
      </div>
      <div style={{ opacity: ease(frame, aliveAt, 10) * (1 - ease(frame, ironAt - 12, 10)) }}>
        <CaptionPop bottom={150} size={92} color={B.tease}>and they are alive</CaptionPop>
      </div>
      <div style={{ position: "absolute", left: 160, top: 360, opacity: rust * ease(frame, nameAt, 12) * (1 - ease(frame, digestedAt, 12)) }}>
        <NumberCard x={0} y={0} big="Halomonas titanicae" small="NEW TO SCIENCE · 2010 · NAMED AFTER THE WRECK IT EATS" size={64} color={B.paper} />
      </div>
      {/* line 10 in its own words, one sentence at a time (#37: the timetable is disputed) */}
      <div style={{ opacity: ease(frame, timetableAt, 10) * (1 - ease(frame, directionAt - 6, 6)) }}>
        <CaptionPop bottom={150} size={64} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>researchers disagree about the timetable</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, directionAt, 10) * (1 - ease(frame, digestedAt, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          not about the <span style={{ color: B.tease }}>direction</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, windowAt, 10) * (1 - ease(frame, thirdAt, 8)) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          a window that is <span style={{ color: B.tease }}>closing</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, thirdAt, 8) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          still only <span style={{ color: B.gauge }}>a third</span> of the way down
        </CaptionPop>
      </div>
    </RungShell>
  );
};
