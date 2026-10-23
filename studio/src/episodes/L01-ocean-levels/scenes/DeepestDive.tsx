import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { CaptionPop, DiverSilhouette } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { depthPos } from "../ladder";
import { NumberCard, RungShell, Tag } from "./shell";

/**
 * Level 3 - the deepest scuba dive, 332 m. Sources: #10 (332.35 m, Gabr, 2014, ~15 min down,
 * 13 h 35 min up, 4 years, 30 people), #32 (nitrogen / the bends / staged stops), #8 (332 m
 * is ~9 % of the average sea floor -> "not even a tenth"), #1 (3,682 m).
 * Lines: 0 "332 m... scuba tanks" 1 "In 2014, Ahmed Gabr..." 2 "Getting down took him about fifteen minutes."
 * 3 "Getting back up took more than thirteen and a half hours." 4 "That's not a mistake..."
 * 5 "At this pressure, the nitrogen... dissolves..." 6 "Come up quickly... bubbles. In the joints..."
 * 7 "Divers call it the bends..." 8 "So the only way home is to stop. And wait... stop after stop..."
 * 9 "He trained four years... thirty people..." 10 "The ocean lets you down for free. It charges you to come back."
 * 11 "...end of the road." 12 "...not even a tenth of the way to the average sea floor." 13 tease
 */
export const DeepestDive: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const gabrAt = within(t, 1, 0.25); // "...named Ahmed Gabr..."
  const downAt = within(t, 2, 0.4);
  const upAt = within(t, 3, 0.35);
  const nitrogenAt = lineAt(t, 5);
  const bubblesAt = within(t, 6, 0.3);
  const bendsAt = lineAt(t, 7); // "Divers call it the bends" - the label waits for the name
  const stopsAt = lineAt(t, 8);
  const teamAt = lineAt(t, 9);
  const freeAt = within(t, 10, 0.2);
  const roadAt = lineAt(t, 11);
  const tenthAt = within(t, 12, 0.3);
  const teaseAt = lineAt(t, 13);

  // motion pass (2026-10-01): the nitrogen figure, the stop staircase and the photo each sat still for
  // 8-12 s. Every cue below is the word it is keyed to.
  const pushAt = within(t, 0, 0.4); // "This is as deep as any human has ever gone ..."
  const hereAt = within(t, 1, 0.55); // "... descended here" - the GAUGE diver answers, never the photo's
  const redSeaAt = within(t, 1, 0.6); // "... in the Red Sea"
  const mistakeAt = lineAt(t, 4); // "That's not a mistake"
  const reasonAt = within(t, 4, 0.45); // "and the reason is the whole problem with the deep"
  const breathAt = within(t, 5, 0.13); // "the nitrogen in every breath he takes"
  const dissolveAt = within(t, 5, 0.41); // "dissolves into his blood and tissues"
  const deeperAt = within(t, 5, 0.69); // "The deeper he goes, the more of it goes in."
  const comeUpAt = lineAt(t, 6); // "Come up quickly, ..."
  const jointsAt = within(t, 6, 0.67); // "In the joints."
  const spineAt = within(t, 6, 0.79); // "In the spine."
  const brainAt = within(t, 6, 0.9); // "In the brain."
  const crippleAt = within(t, 7, 0.4); // "It can cripple you, and it can be fatal."
  const waitAt = within(t, 8, 0.18); // "And wait."
  const breatheOutAt = within(t, 8, 0.23); // "And let his body breathe the nitrogen back out"
  const againAt = within(t, 8, 0.59); // "stop after stop"
  const ropeAt = within(t, 8, 0.68); // "hanging on a line in the blue"
  const hoursAt = within(t, 8, 0.86); // "for thirteen and a half hours"
  const yearsAt = within(t, 9, 0.1); // "He trained four years"
  const teamOfAt = within(t, 9, 0.36); // "a team of thirty people"
  const recordAt = within(t, 9, 0.55); // "It is a record for professionals"
  const costsAt = within(t, 10, 0.55); // "It charges you to come back."
  const endAt = within(t, 11, 0.8); // "For a human body with tanks, this is more or less | the end of the road."
  const pulse = (at: number, hold = 16) => ease(frame, at, 8) * (1 - ease(frame, at + 8, hold));
  const lin = (a: number, b: number) => interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bars = ease(frame, downAt - 6, 10) * (1 - ease(frame, nitrogenAt, 10));
  const upGrow = ease(frame, upAt, 60); // the up-bar keeps growing while the line is spoken
  const body = ease(frame, nitrogenAt, 12) * (1 - ease(frame, stopsAt, 10));
  const ladder = ease(frame, stopsAt, 12) * (1 - ease(frame, freeAt, 10));
  const tenth = ease(frame, tenthAt, 14) * (1 - ease(frame, teaseAt, 8));

  // 15 min vs 13 h 35 min = 815 min -> the up-bar is ~54x the down-bar; we cap the drawn length
  const downW = 22;
  const upW = 1100 * upGrow;

  // camera on the reef diver: in on "as deep as any human", back out for the two bars, a step on "dissolves"
  // and on "the bends", a tilt up on "Come up quickly", a creep under the staircase, in again for "the end
  // of the road", and a look down for "just below him". Scale 1.0-1.26. It does NOT move on line 1: the man
  // in the photo is a NOAA reef diver, and a push onto his face while the card says "Ahmed Gabr" and the
  // voice says "descended here, in the Red Sea" would present him as Gabr (fix run 2, item 2.22).
  const camScale =
    1 +
    (0.02 * frame) / t.frames +
    0.13 * ease(frame, pushAt, 40) -
    0.08 * ease(frame, lineAt(t, 2) - 4, 30) +
    0.06 * ease(frame, reasonAt, 36) +
    0.05 * ease(frame, dissolveAt, 36) +
    0.04 * ease(frame, bendsAt, 30) -
    0.1 * ease(frame, stopsAt, 30) +
    0.07 * lin(stopsAt, freeAt) +
    0.04 * ease(frame, againAt, 36) -
    0.13 * ease(frame, freeAt, 30) +
    0.16 * ease(frame, roadAt, 40);
  const camY = 28 + 17 * ease(frame, lineAt(t, 2) - 4, 30) - 22 * ease(frame, comeUpAt, 40) + 22 * ease(frame, stopsAt, 30) - 17 * ease(frame, roadAt, 40) + 30 * ease(frame, teaseAt, 50);

  // the nitrogen figure: "Come up quickly" lifts it 70 px; the fill rises as the gas goes in and turns
  // coral as it comes back out
  const lift = 70 * ease(frame, comeUpAt, 30);
  const fillLevel = interpolate(frame, [dissolveAt, comeUpAt], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outAll = ease(frame, bubblesAt, 40);
  const cripple = ease(frame, crippleAt, 14);
  const figureStroke = interpolateColors(cripple, [0, 1], [B.paper, B.tease]);
  const figureFill = interpolateColors(outAll, [0, 1], [B.aqua, B.tease]);

  // the climb: the diver hops from stop to stop for the whole of lines 8-9 (a wait, then 20 frames of
  // travel), reaching the top stop two seconds before the staircase leaves
  const climbFrom = stopsAt + 20;
  const hop = (freeAt - 60 - climbFrom) / 8;
  const stopNo = Math.min(8, Math.max(0, Math.floor((frame - climbFrom) / hop)));
  const climb = stopNo + (stopNo < 8 ? ease(frame, climbFrom + (stopNo + 1) * hop - 20, 20) : 0);
  const diverX = 520 + climb * 84;
  const diverY = 780 - climb * 39;
  const flagTop = 250 + depthPos(3682) * 700 - 46;
  // line 1: while the card names Gabr the photo steps back (0.55 -> 0.35), so the card is the subject
  const gabrCard = ease(frame, gabrAt, 10) * (1 - ease(frame, lineAt(t, 2), 10));
  // lines 5-9: a body diagram, then the staircase, are drawn over the photo - the chip says so for exactly that span
  const drawnOver = frame >= downAt - 6 && frame < freeAt + 10; // from the two bars on (pass 2)

  return (
    <RungShell
      t={t}
      index={2}
      depth={332}
      plate={{ id: "diver-reef", name: "", reading: "", image: "diver-reef" }}
      brightness={0.55 - 0.2 * gabrCard}
      plateMove={{ scale: camScale, origin: `58% ${camY}%` }}
      credit={drawnOver ? { kind: "illustration", source: "over a NOAA ONMS photo (Gray's Reef) · a reef diver, not the record dive" } : { kind: "real", source: "NOAA ONMS, Gray's Reef · a reef diver for scale, not the record dive" }}
      sub="≈ 34× surface pressure"
    >
      {/* the diver beside the gauge, to scale with the reading. left 1450: the readout bubble can reach x ~1,550 now that its subtitle stays on one line.
          It swells on "descended here" (this figure is the dive - not the man in the photo) and again on
          "the end of the road" (to x 1,438-1,542 at most). */}
      <div style={{ position: "absolute", left: 1450, top: 250 + depthPos(332) * 700 - 40, opacity: ease(frame, 0, 12), transform: `scale(${1 + 0.3 * pulse(hereAt, 24) + 0.3 * pulse(endAt, 24)})`, transformOrigin: "50% 100%" }}>
        <DiverSilhouette size={80} color={B.paper} style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.8))" }} />
      </div>
      {/* "this is more or less the end of the road": a stop bar under him (x 1,444-1,536, y 406-413) */}
      <div style={{ position: "absolute", left: 1444, top: 406, width: 92 * ease(frame, endAt + 4, 12), height: 7, borderRadius: 4, background: B.tease, opacity: 1 - ease(frame, teaseAt, 8) }} />

      {/* line 1: whose dive this is - the photo behind is a NOAA reef diver, not Gabr (sources.md #10), and the
          card says so in its own third line, next to the name (the chip alone is too far from it). Built in two
          steps: the name on "Ahmed Gabr", the place and date on "in the Red Sea". x 200-~840, y 380-~545. */}
      <div style={{ position: "absolute", left: 200, top: 380, opacity: gabrCard, padding: "10px 22px 12px", borderRadius: 16, background: B.paper, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
        <div style={{ fontFamily: F.headline, fontSize: 64, lineHeight: 1, whiteSpace: "nowrap" }}>Ahmed Gabr</div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, marginTop: 4, letterSpacing: 1, whiteSpace: "nowrap", opacity: ease(frame, redSeaAt, 10) }}>DAHAB, RED SEA · 18 SEP 2014</div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 28, marginTop: 8, paddingTop: 7, borderTop: "2px solid rgba(11,27,43,0.3)", letterSpacing: 1, whiteSpace: "nowrap" }}>PHOTO: A NOAA REEF DIVER, FOR SCALE</div>
      </div>

      {/* two bars: 15 minutes down, 13½ hours up. Tags sit clear above their bars (the 74 px card beside
          the down-bar used to cover "WN"), and "up" waits for the line that says it. */}
      <div style={{ position: "absolute", left: 200, top: 380, opacity: bars }}>
        <Tag x={0} y={-18} color={B.paper}>down</Tag>
        <div style={{ position: "absolute", left: 0, top: 40, width: downW, height: 46, borderRadius: 8, background: B.aqua }} />
        <NumberCard x={downW + 24} y={26} big="≈ 15 min" size={52} color={B.aqua} />
        <Tag x={0} y={132} color={B.paper} opacity={ease(frame, upAt, 10)}>up</Tag>
        <div style={{ position: "absolute", left: 0, top: 190, width: upW, height: 46, borderRadius: 8, background: B.gauge }} />
        {/* "That's not a mistake": the 13 h 35 min card swells on the words */}
        <div style={{ position: "absolute", left: Math.min(upW + 24, 1100), top: 176, opacity: ease(frame, upAt + 20, 10), transform: `scale(${1 + 0.14 * pulse(mistakeAt, 20)})`, transformOrigin: "0px 37px" }}>
          <NumberCard x={0} y={0} big="13 h 35 min" size={52} />
        </div>
      </div>

      {/* nitrogen: pressure squeezes the figure, the gas streams in with every breath for the whole of line 5,
          then the figure shoots up and the gas comes back out as bubbles */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: body }}>
        <g transform={`translate(560 ${300 - lift})`}>
          {/* "At this pressure": arrows press in from both sides and keep pumping until he comes up */}
          {[200, 310, 420].map((y, k) => {
            const d = 9 + 9 * Math.sin((frame - nitrogenAt) / 6 + k);
            return (
              <g key={k} opacity={0.85 * (1 - ease(frame, comeUpAt, 10))} stroke={B.paper} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d={`M${-52 + d} ${y} H${26 + d} M${10 + d} ${y - 14} L${26 + d} ${y} L${10 + d} ${y + 14}`} />
                <path d={`M${292 - d} ${y} H${214 - d} M${230 - d} ${y - 14} L${214 - d} ${y} L${230 - d} ${y + 14}`} />
              </g>
            );
          })}
          {/* "dissolves into his blood and tissues... the more of it goes in": the figure fills */}
          <circle cx={120} cy={60} r={40} fill={figureFill} opacity={fillLevel} />
          <path d="M60 110 h120 v230 h-38 v190 h-44 v-190 h-38 Z" fill={figureFill} opacity={fillLevel} />
          <circle cx={120} cy={60} r={40} fill="none" stroke={figureStroke} strokeWidth={4 + 3 * cripple} />
          <path d="M60 110 h120 v230 h-38 v190 h-44 v-190 h-38 Z" fill="none" stroke={figureStroke} strokeWidth={4 + 3 * cripple} />
          {Array.from({ length: 26 }, (_, i) => {
            // one dot every 7 frames from "every breath" to the end of the line, in at the head, to a place inside
            const enter = ease(frame, breathAt + i * 7, 26);
            const leg = i % 4 === 3;
            const head = !leg && i % 9 === 0;
            const tx = head ? 104 + ((i * 13) % 32) : leg ? 106 + ((i * 37) % 28) : 74 + ((i * 53) % 92);
            const ty = head ? 44 + ((i * 29) % 32) : leg ? 352 + ((i * 71) % 166) : 124 + ((i * 97) % 204);
            const sx = 120 + ((i % 3) - 1) * 46;
            const out = ease(frame, bubblesAt + i * 2, 20);
            const r = 6 + out * 9;
            return (
              <circle
                key={i}
                cx={sx + (tx - sx) * enter + Math.sin(frame / 8 + i * 1.7) * 2.5}
                cy={-80 + (ty + 80) * enter - out * 40 + Math.cos(frame / 9 + i * 2.3) * 2.5}
                r={r}
                fill={out > 0.5 ? B.tease : B.aqua}
                opacity={Math.min(1, enter * 4) * (1 - out * 0.3)}
              />
            );
          })}
          {/* "In the joints. In the spine. In the brain.": each place is ringed as it is named */}
          <g fill="none" stroke={B.gauge} strokeWidth={5}>
            {[
              [62, 122],
              [178, 122],
              [104, 438],
              [136, 438],
            ].map(([x, y], k) => (
              <circle key={k} cx={x} cy={y} r={11 + 6 * pulse(jointsAt)} opacity={ease(frame, jointsAt, 8)} />
            ))}
            <rect x={110} y={118} width={20} height={216} rx={10} strokeWidth={5 + 4 * pulse(spineAt)} opacity={ease(frame, spineAt, 8)} />
            <circle cx={120} cy={60} r={49 + 8 * pulse(brainAt)} opacity={ease(frame, brainAt, 8)} />
          </g>
        </g>
      </svg>
      <Tag x={800} y={380} opacity={body * ease(frame, dissolveAt, 10)} color={B.aqua}>nitrogen dissolves in</Tag>
      <Tag x={800} y={420} opacity={body * ease(frame, deeperAt, 10) * (1 - ease(frame, comeUpAt, 8))}>the deeper, the more goes in</Tag>
      <Tag x={800} y={420} opacity={body * ease(frame, bubblesAt, 10)} color={B.tease}>come up fast: it comes out as bubbles</Tag>
      <div style={{ position: "absolute", left: 800, top: 490, whiteSpace: "nowrap", opacity: body, fontFamily: F.caption, fontSize: 44, color: B.paper, lineHeight: 1.2, textShadow: "0 4px 16px rgba(0,0,0,0.8)" }}>
        <span style={{ opacity: ease(frame, jointsAt, 8) }}>in the joints</span>
        <span style={{ opacity: ease(frame, spineAt, 8) }}> · the spine</span>
        <span style={{ opacity: ease(frame, brainAt, 8) }}> · the brain</span>
        <div style={{ color: B.tease, marginTop: 8, opacity: ease(frame, bendsAt, 10) }}>“the bends”</div>
      </div>

      {/* the staircase of stops: the only way home. Three rows that never share a band: tag + headline
          (y 256-410), the staircase (y 468-780), the team line (y 800-848). */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ladder }}>
        {Array.from({ length: 9 }, (_, i) => {
          const y = 780 - i * 39;
          const on = ease(frame, stopsAt + 10 + i * 9, 10);
          // a stop lights up (and rings once) when the diver reaches it
          const reachedAt = climbFrom + i * hop;
          const reached = ease(frame, reachedAt, 8);
          const ring = lin(reachedAt, reachedAt + 20);
          return (
            <g key={i} opacity={on}>
              <line x1={420} y1={y} x2={1280} y2={y} stroke={B.mute} strokeWidth={2} strokeDasharray="10 12" />
              <circle cx={520 + i * 84} cy={y} r={7} fill={B.mute} />
              <circle cx={520 + i * 84} cy={y} r={9} fill={B.gauge} opacity={reached} />
              <circle cx={520 + i * 84} cy={y} r={9 + 24 * ring} fill="none" stroke={B.gauge} strokeWidth={3} opacity={frame >= reachedAt ? 1 - ring : 0} />
            </g>
          );
        })}
        {/* "hanging on a line in the blue": the line he hangs on, from above the top stop down to him */}
        <line x1={diverX} y1={428} x2={diverX} y2={428 + Math.max(0, diverY - 70 - 428) * ease(frame, ropeAt, 20)} stroke={B.paper} strokeWidth={3} opacity={0.75 * ease(frame, ropeAt, 6)} />
        {/* "breathe the nitrogen back out, a little at a time": small puffs leave him, over and over */}
        {[0, 1, 2].map((j) => {
          const ph = ((frame + j * 15) % 45) / 45;
          return <circle key={j} cx={diverX + 34 + 34 * ph} cy={diverY - 54 - 30 * ph} r={5 + 4 * ph} fill={B.aqua} opacity={(1 - ph) * 0.9 * ease(frame, breatheOutAt, 10)} />;
        })}
      </svg>
      {/* the climbing diver stands on his stop (56 px figure, y diverY-68 .. diverY-12; at the top stop that is
          x 1,164-1,220, y 400-456 - clear of the 13 h 35 min card, which ends at x 1,160 / y 394) */}
      <div style={{ position: "absolute", left: diverX - 28, top: diverY - 68, opacity: ladder * ease(frame, climbFrom - 8, 10) }}>
        <DiverSilhouette size={56} color={B.paper} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))" }} />
      </div>
      <div style={{ position: "absolute", left: 420, top: 300, whiteSpace: "nowrap", opacity: ladder, fontFamily: F.headline, fontSize: 96, color: B.paper, letterSpacing: 2, textShadow: "0 6px 24px rgba(0,0,0,0.8)" }}>DECO STOPS</div>
      {/* each word arrives when it is said: "stop. And wait. And let his body breathe... stop after stop" */}
      <Tag x={420} y={256} opacity={ladder}>
        stop
        <span style={{ opacity: ease(frame, waitAt, 8) }}> · wait</span>
        <span style={{ opacity: ease(frame, breatheOutAt, 8) }}> · breathe it out</span>
        <span style={{ opacity: ease(frame, againAt, 8) }}> · again</span>
      </Tag>
      {/* "for thirteen and a half hours": the same card as the up-bar, back for the total (x 880-1,160, y 320-394:
          right of the headline, above the top stop at y 468) */}
      <NumberCard x={880} y={320} big="13 h 35 min" size={52} opacity={ladder * ease(frame, hoursAt, 10)} />
      <div style={{ position: "absolute", left: 420, top: 800, whiteSpace: "nowrap", opacity: ladder * ease(frame, teamAt, 10), fontFamily: F.caption, fontSize: 40, color: B.paper, textShadow: "0 4px 16px rgba(0,0,0,0.8)" }}>
        <span style={{ opacity: ease(frame, yearsAt, 8) }}>4 years of training</span>
        <span style={{ opacity: ease(frame, teamOfAt, 8) }}> · a team of 30</span>
        <span style={{ opacity: ease(frame, recordAt, 8) }}> · a record for professionals</span>
      </div>

      <div style={{ opacity: ease(frame, freeAt, 10) * (1 - ease(frame, roadAt, 10)) }}>
        <CaptionPop bottom={150} size={72} color={B.paper}>
          down is free. <span style={{ color: B.gauge, opacity: ease(frame, costsAt, 8) }}>coming back costs.</span>
        </CaptionPop>
      </div>

      {/* line 11 "...this is more or less the end of the road" - gone before the flag of line 12 */}
      <div style={{ opacity: ease(frame, endAt, 10) * (1 - ease(frame, lineAt(t, 12) - 6, 10)) }}>
        <CaptionPop bottom={150} size={92} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            the <span style={{ color: B.tease }}>end of the road</span>
          </span>
        </CaptionPop>
      </div>

      {/* not even a tenth: a dashed line drops from the diver (x 1,488, from under the stop bar) to the flag */}
      <div style={{ position: "absolute", left: 1488, top: 420, height: (flagTop - 420) * ease(frame, tenthAt, 24), borderLeft: `4px dashed ${B.paper}`, opacity: tenth * 0.9 }} />
      {/* not even a tenth: the gauge flags the average sea floor far below the diver. RungShell draws the
          gauge AFTER children, so the flag stops left of the stop labels (they start at x ~1,744) instead
          of sitting under "3,800 m". */}
      <div style={{ position: "absolute", right: 190, top: flagTop, opacity: tenth, display: "flex", alignItems: "center" }}>
        <div style={{ padding: "8px 18px 10px", borderRadius: 14, background: B.paper, color: B.ink, fontFamily: F.headline, fontSize: 40, lineHeight: 1, whiteSpace: "nowrap" }}>
          not even 1/10 of the way
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, marginTop: 2 }}>AVERAGE SEA FLOOR · 3,682 m</div>
        </div>
        <div style={{ width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: `18px solid ${B.paper}` }} />
      </div>
      <div style={{ opacity: ease(frame, teaseAt, 8) }}>
        {/* two balanced lines: on one it needs ~1,600 px of a 1,420 px box and left "navy" alone */}
        <CaptionPop bottom={150} size={80} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>just below him:</span>
          <br />
          <span style={{ whiteSpace: "nowrap" }}>
            something that <span style={{ color: B.gauge }}>fooled a navy</span>
          </span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};
