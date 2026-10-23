import React from "react";
import { useCurrentFrame } from "remotion";
import { CaptionPop, DiverSilhouette, Tile } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { LEVELS, depthPos, pressureSub } from "../ladder";
import { NumberCard, RungShell, Tag } from "./shell";

/** even 0-1 between two frames */
const lin = (f: number, a: number, b: number) => Math.min(1, Math.max(0, (f - a) / Math.max(1, b - a)));
/** a short pulse: up over `up` frames, back down over `down` */
const bump = (f: number, at: number, up = 8, down = 26) => {
  const u = f - at;
  return u <= 0 ? 0 : u < up ? u / up : Math.max(0, 1 - (u - up) / down);
};

/** Where the camera sits on the whale photo: [frame, scale, origin x %, origin y %]; "push" = eased into, otherwise a slow drift. */
type Framing = [number, number, number, number, "push"?];
const framingAt = (frame: number, list: Framing[]) => {
  let i = 0;
  while (i < list.length - 2 && frame >= list[i + 1][0]) i++;
  const a = list[i];
  const b = list[i + 1];
  const x = lin(frame, a[0], b[0]);
  const k = b[4] === "push" ? x * x * (3 - 2 * x) : x;
  return { scale: a[1] + (b[1] - a[1]) * k, origin: `${a[2] + (b[2] - a[2]) * k}% ${a[3] + (b[3] - a[3]) * k}%` };
};

/**
 * Level 7 - the deepest breath, 2,992 m. Sources: #19 (sperm whales hunt at ≈2,130 m+), #20
 * (Cuvier's beaked whale 2,992 m; 137.5 min; Southern California), #36 (lung collapse stops
 * nitrogen; oxygen in blood and muscle; ~10x myoglobin; heart rate drops; blood to heart/brain),
 * #11 (≈300 atm at 2,992 m), #10 (332 m -> 9x deeper).
 * Lines: 0 "Sperm whales hunt giant squid more than two kilometres down. But they don't hold the record."
 * 1 "...Cuvier's beaked whale." 2 "...2,992 metres... Another dive lasted 137 minutes." 3 "More than two hours. On one breath... 300 times the pressure"
 * 4 "How is that even possible? By giving up on breathing altogether." 5 "...ribcage folds and its lungs deliberately collapse..."
 * 6 "It's a defence: with the lungs shut down, nitrogen can't cross..." 7 "...oxygen... blood and muscle... ten times more..."
 * 8 "Its heart rate drops. Blood pulls back..." 9 "...something much closer to a submarine." 10 "Remember Level 3?... nine times deeper - for lunch." 11 tease
 *
 * Final review 2026-09-30: the gauge never climbs (it opens where Level 6 ended, 2,500 m; the sperm
 * whale is a marker it has already passed); no heart-rate numbers (#36 gives none); the photo is a
 * Cuvier's beaked whale, so it stays dark through the sperm-whale line.
 *
 * Motion pass 2026-10-01: the long holds are broken up on the words. Ribs fold before the lungs do, the nitrogen
 * keeps bouncing off the barrier, the oxygen stores and the 10x bar arrive when they are named, the heart beats
 * slower and slower, Level 3 is recalled with its own tile, and the "9x" caption waits for "nine times deeper".
 * Several things used to appear a sentence early (the collapse, the nitrogen tags, the protein bars, the 332 m
 * marker and the "9x deeper" caption) - they are re-timed to their words, which is what removes the freezes.
 *
 * New plate 2026-10-01 (manifest "beaked-whale"): a USGS aerial photo of one Cuvier's beaked whale just under the
 * surface - dark navy water all round, the whale small in the middle of the frame (at plate scale 1: flukes at
 * about (870, 380), head tip at about (1095, 825), body ≈70 px wide; box x 800-1110, y 320-840). It always crosses
 * the rows y 480-700 whatever the camera does, so the scene keeps a clear lane for it at x≈810-1160: the left-hand
 * stacks end by x=800, the two whale marks keep their tags above/below the silhouettes (x 1161-1510), and the
 * lung tags sit under the diagram. `framings` says where the whale is on each line.
 */
export const DeepestBreath: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const noRecordAt = within(t, 0, 0.68);
  const photoAt = lineAt(t, 1);
  const cuvierAt = within(t, 1, 0.6);
  const studyAt = lineAt(t, 2);
  const depthAt = within(t, 2, 0.3);
  const clockAt = within(t, 2, 0.7);
  // line 3: "More than two hours. On one breath. In the cold and the dark, under about three hundred times the pressure..."
  const hoursAt = lineAt(t, 3);
  const breathAt = within(t, 3, 0.17);
  const darkAt = within(t, 3, 0.28);
  const pressAt = within(t, 3, 0.62);
  const clockEnd = lineAt(t, 4);
  const givingUpAt = within(t, 4, 0.43);
  const lungsAt = lineAt(t, 5);
  // line 5: "...the whale's ribcage folds and its lungs deliberately collapse. That sounds like a catastrophe."
  const ribsAt = within(t, 5, 0.27);
  const collapseAt = within(t, 5, 0.44);
  const catastropheAt = within(t, 5, 0.72);
  const defenceAt = lineAt(t, 6);
  // line 6: "...nitrogen can't cross into the blood - so the whale simply never gets the problem that cost our record-breaking diver thirteen and a half hours."
  const nitrogenAt = within(t, 6, 0.22);
  const neverAt = within(t, 6, 0.43);
  const diverAt = within(t, 6, 0.62);
  const thirteenAt = within(t, 6, 0.86);
  const myoAt = lineAt(t, 7);
  // line 7: "...It's stored in its blood and packed into its muscle, which carries roughly ten times more of the oxygen-holding protein than ours does."
  const storedAt = within(t, 7, 0.27);
  const muscleAt = within(t, 7, 0.5);
  const proteinAt = within(t, 7, 0.54);
  const tenAt = within(t, 7, 0.61);
  const oursAt = within(t, 7, 0.91);
  const heartAt = lineAt(t, 8);
  const pullsBackAt = within(t, 8, 0.24);
  const mammalAt = lineAt(t, 9);
  const subAt = within(t, 9, 0.6);
  const lunchAt = lineAt(t, 10);
  // line 10: "Remember Level 3? ...turned around at three hundred and thirty-two metres. This whale goes nine times deeper - for lunch."
  const turnedAt = within(t, 10, 0.37);
  const nineAt = within(t, 10, 0.72);
  const deeperAt = within(t, 10, 0.8);
  const forLunchAt = within(t, 10, 0.94);
  const teaseAt = lineAt(t, 11);

  // the gauge only ever goes down: it holds Level 6's 2,500 m (the sperm whale's ~2,130 m is a mark
  // above the pointer, already passed), then runs to the record when the narration names it
  const depth = 2500 + (2992 - 2500) * ease(frame, depthAt, 40);
  // the plate is a Cuvier's beaked whale: near-black while the voice is on sperm whales (line 0). The photo is dark
  // water with a pale whale, and no text sits on the whale, so it runs bright (0.92); it dips for the lung drawing
  // (0.72) and on "In the cold and the dark" (0.62) - the whale stays visible through both.
  const photo = ease(frame, photoAt, 40);
  // the stopwatch runs 0 -> 137:30 while "Another dive lasted a hundred and thirty-seven minutes" is spoken and has
  // landed when line 3 says "More than two hours" (it used to run on through line 3, behind the voice and its caption)
  const clock = ease(frame, clockAt, Math.max(30, hoursAt - clockAt));
  const totalSec = Math.round(137.5 * 60 * clock);
  const mm = Math.floor(totalSec / 60);
  const ss = String(totalSec % 60).padStart(2, "0");
  const clockVis = ease(frame, clockAt, 10) * (1 - ease(frame, lungsAt, 10));
  const lungs = ease(frame, lungsAt, 14) * (1 - ease(frame, myoAt, 10));
  // the ribs start to fold on "ribcage folds", then close with the lungs on "its lungs deliberately collapse" (the
  // lungs used to shut 20 frames into the line, a sentence ahead of the voice, and then nothing moved)
  const fold = ease(frame, ribsAt, 30);
  const collapse = ease(frame, collapseAt, 40);
  // "nitrogen can't cross into the blood" - the nitrogen, the barrier and its tag wait for those words
  const defence = ease(frame, nitrogenAt, 14);
  // the oxygen / heart stack clears at the start of line 9, before the camera pushes in on the photo it was covering
  const myo = ease(frame, myoAt, 14) * (1 - ease(frame, mammalAt, 12));
  const heart = ease(frame, heartAt, 12);
  // the heart beats slower and slower: one beat every 10 frames at first, every 40 four seconds later (no numbers, #36 gives none)
  const beatPhase = frame > heartAt ? 4 * Math.log(1 + (frame - heartAt) / 40) : 0;
  const beat = frame > heartAt ? Math.max(0, 1 - (beatPhase % 1) * 3) : 0;
  const lunch = ease(frame, lunchAt, 12) * (1 - ease(frame, teaseAt, 8));
  const marker = ease(frame, turnedAt, 12) * (1 - ease(frame, teaseAt, 8));
  const nine = ease(frame, nineAt, 30);
  // "In the cold and the dark": the photo sinks darker until the lungs take over the screen
  const dark = ease(frame, darkAt, 20) * (1 - ease(frame, lungsAt, 10));
  // both whale marks hang in the water rather than sit frozen
  const hang = 4 * Math.sin(frame / 19);

  // While the Level 3 tile is up the chip credits it too and says what it is: a reef diver (manifest: "diver-reef",
  // NOAA ONMS, Gray's Reef), not a photo of the record dive. The chip then runs to about x=1000 at y 998-1044, under
  // the tile (to y=554) and the caption (to y≈930). Line 0: the whale photo is faintly there, so the chip says so.
  // The chip does not name the species before the voice does (cuvierAt).
  const credit =
    lunch > 0.5
      ? { kind: "real" as const, source: "USGS · inset: NOAA ONMS, a reef diver, not the record dive" }
      : lungs > 0.5 || (myo > 0.5 && frame >= proteinAt)
        ? { kind: "illustration" as const, source: "over a USGS photo" }
        : photo > 0.5
          ? { kind: "real" as const, source: frame >= cuvierAt ? "USGS · a Cuvier's beaked whale near the surface, from the air" : "USGS" }
          : { kind: "illustration" as const, source: "over a USGS photo" };

  // The camera on the whale photo. The plate is uniform water, so the origin is used to place the whale (a point p
  // lands at o + s(p - o)); every origin is inside the frame and the scale stays <= 1.5 (the source is 1785 px wide).
  // Whale box (x, y) at each stop, from the unscaled box x 800-1110, y 320-840:
  const framings: Framing[] = [
    [0, 1, 50, 50],
    [cuvierAt - 30, 1.04, 50, 50], // the photo comes up wide: whale x 794-1116, y 311-852, in the lane left of the marks
    [cuvierAt + 10, 1.45, 67.7, 57.4, "push"], // "Cuvier's beaked whale": in on it, and it slides left - x 575-1025, y 185-939
    [clockAt - 53, 1.5, 67.7, 57.4], // creeping in: x 550-1015, y 170-950 (the left half is empty until the stopwatch)
    [clockAt - 3, 1.06, 5.2, 92.6, "push"], // back out to the lane before the stopwatch arrives: x 842-1171, y 279-830
    [pressAt, 1.07, 10.4, 92.6],
    [pressAt + 40, 1.09, 15.6, 92.6, "push"], // "three hundred times the pressure": a little closer - x 845-1183, y 259-826
    [lungsAt, 1.09, 15.6, 92.6],
    [myoAt, 1.07, 10.4, 92.6], // breathing out and back in under the lung drawing and the oxygen stack, never still
    [mammalAt, 1.09, 15.6, 92.6],
    [mammalAt + 50, 1.42, 67.7, 100, "push"], // "it stops being a mammal that breathes": the stack is gone, push in - x 590-1030, head tip y=718
    [lunchAt, 1.5, 57.3, 100], // tracking along the body through "closer to a submarine": x 650-1115, head tip y=697 (caption from y=742)
    [lunchAt + 50, 1.2, 57.3, 100, "push"], // "Remember Level 3?": back out, right of the tile - x 740-1112, y 168-792
    [teaseAt - 40, 1.24, 57.3, 100],
    [teaseAt + 6, 1.47, 78.1, 100, "push"], // the hand-off: the push lands before the caption, head tip ~ (932, 728) - 33+ px above it
    [t.frames, 1.5, 78.1, 100],
  ];

  return (
    <RungShell t={t} index={6} depth={depth} plate={{ id: "beaked-whale", name: "", reading: "", image: "beaked-whale" }} brightness={0.06 + 0.86 * photo - 0.2 * lungs - 0.3 * dark - 0.08 * myo} plateMove={framingAt(frame, framings)} credit={credit} sub={pressureSub(depth)}>
      {/* whales beside the gauge, at their depths (silhouettes, to scale with each other). The sperm whale's
          mark sits above the pointer from the first frame: a depth already passed, not the current reading.
          Silhouettes end by x=1510: the gauge readout (one-line subtitle) can reach left to x≈1555.
          The sperm whale's mark steps back on "But they don't hold the record"; the Cuvier's swells on "for lunch".
          Each tag is 24 px, right-aligned to its silhouette's tail at x=1510 - the sperm whale's above it (y 476-505),
          the Cuvier's below it (y 626-655) - so both marks stay inside x 1161-1510 and the real whale has the
          lane to their left. */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(1310 ${250 + depthPos(2130) * 700 + hang})`} opacity={ease(frame, 0, 12) * (1 - 0.3 * ease(frame, noRecordAt, 14))}>
          <path d="M0 0 C 30 -22, 120 -26, 170 -6 L 200 -22 L 196 0 L 200 22 L 170 6 C 120 26, 30 22, 0 0 Z" fill={B.mute} />
        </g>
        <g transform={`translate(1340 ${250 + depthPos(2992) * 700 - hang})`} opacity={ease(frame, cuvierAt, 12)}>
          <g transform={`translate(76 0) scale(${1 + 0.18 * bump(frame, forLunchAt)}) translate(-76 0)`}>
            <path d="M0 0 C 24 -16, 90 -18, 128 -4 L 152 -16 L 148 0 L 152 16 L 128 4 C 90 18, 24 16, 0 0 Z" fill={B.gauge} />
          </g>
        </g>
        {/* "This whale goes nine times deeper": an arrow runs down from the diver's mark to the whale's row. x 1520-1548,
            y 394-590: it passes right of the sperm whale's tail (ends x=1510, y 517-561) and its tip lands on the
            2,992 m row (y≈599), between the Cuvier mark (ends x≈1506) and the gauge readout (from x≈1555). */}
        <g opacity={marker * ease(frame, nineAt, 6)}>
          <line x1={1534} y1={394} x2={1534} y2={394 + 178 * nine} stroke={B.gauge} strokeWidth={6} strokeLinecap="round" />
          <path d={`M1520 ${394 + 178 * nine} L 1548 ${394 + 178 * nine} L 1534 ${412 + 178 * nine} Z`} fill={B.gauge} />
        </g>
      </svg>
      <Tag x={1510} y={250 + depthPos(2130) * 700 - 63} size={24} color={B.paper} opacity={ease(frame, 0, 12) * (1 - 0.3 * ease(frame, noRecordAt, 14))} align="right">sperm whale · 2,000 m+</Tag>
      <Tag x={1510} y={250 + depthPos(2992) * 700 + 27} size={24} color={B.gauge} opacity={ease(frame, cuvierAt, 12)} align="right">Cuvier's beaked whale</Tag>

      {/* the stopwatch */}
      <div style={{ position: "absolute", left: 160, top: 330, opacity: clockVis }}>
        <NumberCard x={0} y={0} big={`${mm}:${ss}`} small="ONE BREATH · MIN : SEC" size={120} color={B.paper} />
        {/* 137.5 min was a separate dive from the 2,992 m one (#20). 214 clears the stopwatch card (≈196 px tall);
            the card ends near x=790, left of the whale's lane. It arrives with "More than two hours". */}
        <div style={{ position: "absolute", left: 0, top: 214, opacity: ease(frame, hoursAt + 6, 12) }}>
          <NumberCard x={0} y={0} big="2 h 17 min" small="A SEPARATE DIVE · OFF SOUTHERN CALIFORNIA" size={64} />
        </div>
      </div>
      {/* line 3 in its own words while the stopwatch runs; gone before the camera pushes in on "three hundred times the pressure" */}
      <div style={{ opacity: ease(frame, hoursAt, 10) * (1 - ease(frame, pressAt - 14, 10)) }}>
        <CaptionPop bottom={150} size={72} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            more than two hours. <span style={{ color: B.gauge, opacity: ease(frame, breathAt, 8) }}>on one breath.</span>
          </span>
        </CaptionPop>
      </div>
      {/* line 4: the question, then its answer, each on its words */}
      <div style={{ opacity: ease(frame, clockEnd, 10) * (1 - ease(frame, givingUpAt - 6, 6)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>how is that even possible?</CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, givingUpAt, 10) * (1 - ease(frame, lungsAt, 8)) }}>
        <CaptionPop bottom={150} size={84}>by giving up on breathing</CaptionPop>
      </div>

      {/* the lungs fold shut on the way down - a defence, not a failure */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: lungs }}>
        <g transform="translate(560 420)">
          {/* each lung shrinks toward the trachea (its inner edge stays 10 px from the centre line), not toward its own middle */}
          <ellipse cx={-10 - 80 * (1 - collapse * 0.85)} cy={100 - 40 * collapse} rx={80 * (1 - collapse * 0.85)} ry={150 * (1 - collapse * 0.6)} fill="#7FB7E6" opacity={0.9} />
          <ellipse cx={10 + 80 * (1 - collapse * 0.85)} cy={100 - 40 * collapse} rx={80 * (1 - collapse * 0.85)} ry={150 * (1 - collapse * 0.6)} fill="#7FB7E6" opacity={0.9} />
          <rect x={-8} y={-60} width={16} height={120} rx={8} fill="#7FB7E6" />
          {/* the ribcage: five ribs a side over the lungs. It gives a little on "the whale's ribcage folds" and closes with
              the lungs, so it always encloses them (tips end at x=±109, outside the shut lungs at x=±10-34) */}
          {Array.from({ length: 5 }, (_, k) => {
            const y = -20 + k * 50;
            const w = 1 - 0.1 * fold - 0.32 * collapse;
            return (
              <g key={k} stroke="rgba(255,255,255,0.55)" strokeWidth={7} fill="none" strokeLinecap="round">
                <path d={`M-10 ${y} C ${-90 * w} ${y - 22}, ${-185 * w} ${y - 8}, ${-188 * w} ${y + 34}`} />
                <path d={`M10 ${y} C ${90 * w} ${y - 22}, ${185 * w} ${y - 8}, ${188 * w} ${y + 34}`} />
              </g>
            );
          })}
          {/* nitrogen trying to get in - and stopped: each dot keeps dropping onto the barrier and bouncing off it.
              The barrier sits above the ribcage and trachea (screen y=344; the trachea starts at y=360), dots y 262-335. */}
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={-260 + i * 70 + 6 * Math.sin(frame / 23 + i)} cy={-94 - Math.abs(Math.sin((frame + i * 11) / 10)) * 55} r={9} fill={B.aqua} opacity={defence} />
          ))}
          <line x1={-280} y1={-76} x2={230} y2={-76} stroke={B.tease} strokeWidth={5 + 3 * bump(frame, nitrogenAt, 8, 30)} opacity={defence} />
        </g>
      </svg>
      {/* below the un-collapsed lungs (they reach y=670) - at 600 the label sat on the left lung in its own colour */}
      <div style={{ position: "absolute", left: 474, top: 664, opacity: lungs, fontFamily: F.headline, fontSize: 72, color: "#7FB7E6", letterSpacing: 2, textShadow: "0 6px 24px rgba(0,0,0,0.8)" }}>LUNGS</div>
      {/* three tags under the diagram, from x=200 (they were beside it at x=840, which is now the whale's lane): rows
          y 762-798 and 800-836 end by x≈760; the third (y 842-878, to x≈1035) arrives after the captions have gone and
          runs under the whale, whose head ends at y≈826. The first waits for "its lungs deliberately collapse". */}
      <Tag x={200} y={762} opacity={lungs * ease(frame, collapseAt, 12)} color="#7FB7E6">the lungs fold shut on purpose</Tag>
      <Tag x={200} y={800} opacity={lungs * defence} color={B.tease}>nitrogen can't get in</Tag>
      {/* arrives on "the problem that cost our record-breaking diver", and turns white on "thirteen and a half hours" */}
      <Tag x={200} y={842} opacity={lungs * ease(frame, diverAt, 12)} color={frame >= thirteenAt ? B.paper : B.mute}>the diver's 13½-hour problem never happens</Tag>
      {/* line 5's worry and line 6's answer, in the narration's words; both sit below the second tag row (their tops
          are at y≈845 and y≈840) and are gone before the third tag arrives */}
      <div style={{ opacity: ease(frame, catastropheAt, 10) * (1 - ease(frame, defenceAt - 4, 6)) }}>
        <CaptionPop bottom={150} size={76} color={B.tease}>that sounds like a catastrophe</CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, defenceAt + 2, 10) * (1 - ease(frame, neverAt, 10)) }}>
        <CaptionPop bottom={150} size={80}>it's a defence</CaptionPop>
      </div>

      {/* where the oxygen is, myoglobin x10 and the heart rate - each row on its words */}
      <div style={{ position: "absolute", left: 160, top: 320, opacity: myo }}>
        {/* 26 px and no second clause: it ends at about x=720, left of the whale's flukes (from x≈842) */}
        <Tag x={0} y={0} size={26} color={B.paper}>the oxygen isn't in its lungs</Tag>
        <div style={{ position: "absolute", left: 0, top: 44, display: "flex", gap: 14 }}>
          {[
            { at: storedAt, label: "IN ITS BLOOD" },
            { at: muscleAt, label: "IN ITS MUSCLE" },
          ].map((s) => (
            <div key={s.label} style={{ opacity: ease(frame, s.at, 10), transform: `scale(${1 + 0.08 * bump(frame, s.at, 6, 20)})`, padding: "8px 18px 10px", borderRadius: 12, background: B.paper, color: B.ink, fontFamily: F.headline, fontSize: 44, lineHeight: 1, whiteSpace: "nowrap", boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
              {s.label}
            </div>
          ))}
        </div>
        {/* the comparison waits for "roughly ten times more of the oxygen-holding protein": the whale's bar counts up in ten blocks */}
        <div style={{ position: "absolute", left: 0, top: 130, opacity: ease(frame, proteinAt, 12) }}>
          <Tag x={0} y={0} color={B.paper}>oxygen-holding protein in muscle</Tag>
          <div style={{ position: "absolute", left: 0, top: 44, width: 60, height: 40, borderRadius: 8, background: frame >= oursAt ? B.paper : B.mute, transform: `scale(${1 + 0.25 * bump(frame, oursAt)})` }} />
          <Tag x={76} y={48}>you</Tag>
          {Array.from({ length: 10 }, (_, k) => (
            <div key={k} style={{ position: "absolute", left: k * 60, top: 100, width: 54, height: 40, borderRadius: 8, background: B.gauge, opacity: ease(frame, tenAt + k * 4, 6) }} />
          ))}
          <Tag x={0} y={150} color={B.gauge} opacity={ease(frame, tenAt + 40, 10)}>the whale · roughly 10×</Tag>
        </div>
        {/* #36 says only that the heart rate drops and blood is shunted to the heart and brain - no bpm figures.
            Two short lines keep the card inside x≈160-800, left of the whale's lane; y 650-774.
            The whole stack leaves at the start of line 9, well before the "submarine" caption (y from ≈742). */}
        <div style={{ position: "absolute", left: 0, top: 330, opacity: heart, padding: "10px 22px 12px", borderRadius: 16, background: B.tease, color: B.paper, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: F.headline, fontSize: 64, lineHeight: 1, whiteSpace: "nowrap" }}>
            <span style={{ display: "inline-block", transform: `scale(${1 + 0.3 * beat})` }}>♥</span> HEART RATE DROPS
          </div>
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 28, marginTop: 4, letterSpacing: 1, whiteSpace: "nowrap", opacity: ease(frame, pullsBackAt, 10) }}>BLOOD GOES TO THE HEART AND BRAIN</div>
        </div>
      </div>
      {/* line 9: two single-line captions cross-fading in one slot (pass 3: mounting the second half inside the
          first re-wrapped the block and "for two hours:" jumped 420 px in one frame) */}
      <div style={{ opacity: ease(frame, mammalAt + 12, 10) * (1 - ease(frame, subAt - 6, 6)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>for two hours:</CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, subAt, 8) * (1 - ease(frame, lunchAt, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            closer to a <span style={{ color: B.gauge }}>submarine</span> than a mammal
          </span>
        </CaptionPop>
      </div>

      {/* the callback. "Remember Level 3?": its tile comes back (ladder name and reading, #10)... */}
      <div style={{ position: "absolute", left: 160, top: 320, opacity: lunch, transform: `scale(${0.92 + 0.08 * ease(frame, lunchAt, 14)})`, transformOrigin: "left top", borderRadius: 21, boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
        <Tile level={LEVELS[2]} width={416} height={234} labelSize={24} badge="LEVEL 3" />
      </div>
      {/* ...the diver's 332 m goes on the gauge when the voice says it, against the whale's 2,992 m */}
      <div style={{ position: "absolute", left: 1500, top: 250 + depthPos(332) * 700 - 30, opacity: marker, display: "flex", alignItems: "center", gap: 8 }}>
        <DiverSilhouette size={56} color={B.paper} />
        <span style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: B.paper, textShadow: "0 2px 8px #000", whiteSpace: "nowrap" }}>332 m</span>
      </div>
      {/* ...and the punchline lands on "nine times deeper - for lunch", not at the top of the line */}
      <div style={{ opacity: ease(frame, deeperAt, 10) * (1 - ease(frame, teaseAt, 8)) }}>
        <CaptionPop bottom={150} size={96}>
          9× deeper. <span style={{ opacity: ease(frame, forLunchAt, 8) }}>for lunch.</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, teaseAt + 8, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          7 down · next: something famous, <span style={{ color: B.gauge, whiteSpace: "nowrap" }}>lying in the dark</span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};
