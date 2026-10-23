import React from "react";
import { AbsoluteFill, Img, interpolateColors, useCurrentFrame } from "remotion";
import { CaptionPop, levelImage } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { LEVELS } from "../ladder";
import { NumberCard, RungShell } from "./shell";

// "alvin-deck" (assets/manifest.json): Alvin aboard its support ship Lulu, November 1971, NOAA Photo Library.
// The old inset, "alvin-sub", is a 2004 recovery photo and was captioned as if it were the 1977 dive.
const ALVIN = { id: "alvin", name: "Alvin", reading: "", image: "alvin-deck" as const };

/** even 0-1 between two frames */
const lin = (f: number, a: number, b: number) => Math.min(1, Math.max(0, (f - a) / Math.max(1, b - a)));
/** 0-1 with a soft start and stop */
const smooth = (f: number, a: number, b: number) => {
  const x = lin(f, a, b);
  return x * x * (3 - 2 * x);
};
/** a short pulse: up over `up` frames, back down over `down` */
const bump = (f: number, at: number, up = 8, down = 30) => {
  const u = f - at;
  return u <= 0 ? 0 : u < up ? u / up : Math.max(0, 1 - (u - up) / down);
};

/** One position of the camera on the garden photo: [frame, scale, origin x %, origin y %]; "move" = eased into, otherwise a slow drift. */
type Shot = [number, number, number, number, "move"?];
const cameraAt = (frame: number, shots: Shot[]) => {
  let i = 0;
  while (i < shots.length - 2 && frame >= shots[i + 1][0]) i++;
  const a = shots[i];
  const b = shots[i + 1];
  const k = b[4] === "move" ? smooth(frame, a[0], b[0]) : lin(frame, a[0], b[0]);
  return { scale: a[1] + (b[1] - a[1]) * k, origin: `${a[2] + (b[2] - a[2]) * k}% ${a[3] + (b[3] - a[3]) * k}%` };
};

/** the worm's two blood vessels, plume -> organ (cutaway coordinates), as cubic curves */
const VESSELS = [
  [[60, 170], [40, 250], [40, 300], [50, 340]],
  [[90, 170], [110, 250], [110, 300], [100, 340]],
];
const onCurve = (p: number[][], u: number) => {
  const v = 1 - u;
  return [0, 1].map((k) => v * v * v * p[0][k] + 3 * v * v * u * p[1][k] + 3 * v * u * u * p[2][k] + u * u * u * p[3][k]);
};

/** A diagram label on its own dark scrim - the plate under the cutaway is a busy red-and-white photo. */
const Label: React.FC<{ y: number; color?: string; opacity?: number; scale?: number; children: React.ReactNode }> = ({ y, color = B.paper, opacity = 1, scale = 1, children }) => (
  <div style={{ position: "absolute", left: 776, top: y, opacity, transform: `scale(${scale})`, transformOrigin: "left center", padding: "4px 14px", borderRadius: 10, background: "rgba(5,14,24,0.78)", fontFamily: F.ui, fontWeight: 800, fontSize: 28, lineHeight: "34px", letterSpacing: 1.5, textTransform: "uppercase", color, whiteSpace: "nowrap" }}>
    {children}
  </div>
);

/** One sentence of the answer as a row: [who] lives on [what]. */
const ChainRow: React.FC<{ top: number; opacity: number; who: string; verb: string; what: string; whoColor: string; whatColor: string }> = ({ top, opacity, who, verb, what, whoColor, whatColor }) => {
  const card = (bg: string): React.CSSProperties => ({ padding: "10px 22px 12px", borderRadius: 16, background: bg, color: B.ink, fontFamily: F.headline, fontSize: 52, lineHeight: 1, whiteSpace: "nowrap" });
  return (
    <div style={{ position: "absolute", left: 160, top, opacity, display: "flex", alignItems: "center", gap: 18, padding: 10, borderRadius: 24, background: "rgba(5,14,24,0.78)" }}>
      <div style={card(whoColor)}>{who}</div>
      <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 1.5, textTransform: "uppercase", color: B.paper, whiteSpace: "nowrap" }}>{verb}</div>
      <div style={card(whatColor)}>{what}</div>
    </div>
  );
};

/**
 * Level 6 - life without the Sun, 2,500 m. Sources: #17 (Feb 1977, Galápagos, Alvin, foot-long
 * clams, 2 m tube worms, first chemosynthetic ecosystem, 500+ vent fields), #18 (>700 °F ≈ 370 °C),
 * #35 (Riftia: no mouth/gut; trophosome; plume takes in O2 + H2S; blood carries both).
 * Lines: 0 "Two and a half kilometres. In February 1977... Alvin... hot springs." 1 "It found them... a garden."
 * 2 "Clams a foot long. Tube worms as tall as a person... 700 °F / 370 °C." 3 "No sunlight... So what is everything eating?"
 * 4 "The answer rewrote the textbooks. Microbes... chemicals..." 5 "...first ecosystem... runs on the planet itself."
 * 6 "...A grown one has no mouth. No stomach. No gut at all." 7 "...an organ stuffed with bacteria... a third to a half of its body weight."
 * 8 "...That red plume... oxygen and hydrogen sulfide... blood carries both down" 9 "They turn the poison into food."
 * 10 "The worm never eats... fed from within." 11 "More than five hundred of these vent fields..." 12 tease
 *
 * Final review 2026-09-30: the question leaves when the answer starts (line 4) and the answer is shown in the
 * narration's own words; cutaway labels sit on scrims and appear on the line that says them.
 *
 * Motion pass 2026-10-01: the camera moves on the garden photo (push in on the worms when they are named, pull
 * back for the question), and the cutaway is a flow - gas into the plume, blood down the vessels, bacteria turning
 * it green - with every label arriving on its own words instead of a line early.
 */
export const Vents: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  // line 0: "...a three-person submersible called Alvin was exploring a volcanic crack in the sea floor... looking for hot springs."
  const alvinAt = within(t, 0, 0.38);
  const crackAt = within(t, 0, 0.5);
  const springsAt = within(t, 0, 0.87);
  const foundAt = lineAt(t, 1);
  const gardenAt = within(t, 1, 0.87);
  const wormsAt = within(t, 2, 0.1);
  const crowdedAt = within(t, 2, 0.3);
  const heatAt = within(t, 2, 0.6);
  const questionAt = lineAt(t, 3);
  const answerAt = lineAt(t, 4);
  const microbesAt = within(t, 4, 0.22);
  const everythingAt = within(t, 4, 0.7);
  const firstAt = lineAt(t, 5);
  const planetAt = within(t, 5, 0.72);
  const wormAt = lineAt(t, 6);
  // line 6: "A grown one has no mouth. No stomach. No gut at all."
  const mouthAt = within(t, 6, 0.63);
  const stomachAt = within(t, 6, 0.73);
  const gutAt = within(t, 6, 0.84);
  const organAt = within(t, 7, 0.3);
  const cargoAt = within(t, 7, 0.72);
  // line 8: "...a delivery system. That red plume at the top pulls in oxygen and hydrogen sulfide - the rotten-egg chemical
  // that is poisonous to you and me - and its blood carries both down to the bacteria inside."
  const plumeAt = lineAt(t, 8);
  const plumeHiAt = within(t, 8, 0.217);
  const takeAt = within(t, 8, 0.33);
  const oxyAt = within(t, 8, 0.36);
  const h2sAt = within(t, 8, 0.4);
  const poisonAt = within(t, 8, 0.6);
  const bloodAt = within(t, 8, 0.72);
  const insideAt = within(t, 8, 0.89);
  const foodAt = lineAt(t, 9);
  const neverAt = lineAt(t, 10);
  const breatheAt = within(t, 10, 0.5);
  const fedAt = within(t, 10, 0.72);
  const fieldsAt = lineAt(t, 11);
  const reasonAt = within(t, 11, 0.47);
  const teaseAt = lineAt(t, 12);

  // Alvin's card leaves on "It found them" (was: on "a garden", 3 s later) so the camera can find the garden first
  const alvin = ease(frame, 0, 12) * (1 - ease(frame, foundAt, 12));
  // the 1971 photo pushes in on the sub as the voice names it, then keeps creeping
  const inset = 1 + 0.26 * smooth(frame, alvinAt, alvinAt + 45) + 0.06 * lin(frame, alvinAt + 45, foundAt);
  const worm = ease(frame, wormAt, 14) * (1 - ease(frame, fieldsAt, 10));
  const organ = ease(frame, organAt, 16);
  const take = ease(frame, takeAt, 12);
  const oxy = ease(frame, oxyAt, 10);
  const h2s = ease(frame, h2sAt, 10);
  const poison = ease(frame, poisonAt, 12);
  const blood = ease(frame, bloodAt, 12);
  const food = ease(frame, foodAt, 16);
  const fed = ease(frame, fedAt, 14);
  const fields = ease(frame, fieldsAt, 12) * (1 - ease(frame, teaseAt, 8));
  // "No sunlight has ever touched this place": the photo dims for the question and comes back with the answer
  const noSun = ease(frame, questionAt, 20) * (1 - ease(frame, answerAt, 20));
  // the plume steps forward when it is named ("That red plume at the top") and again on "It simply breathes"
  const plumeHi = bump(frame, plumeHiAt, 10, 40);
  const breathe = bump(frame, breatheAt, 14, 30);
  // the organ swells on "a third to a half of its body weight" and on "to the bacteria inside"
  const organHi = bump(frame, cargoAt) + bump(frame, insideAt);
  // "The worm never eats. Not once in its life": the first label lights up again
  const neverEats = ease(frame, neverAt, 8) * (1 - ease(frame, breatheAt, 10));

  // The camera on the garden photo. The red tube-worm cluster is left of centre (≈35 %, 62 %), a second stand is
  // top right (≈74 %, 36 %). Nothing drawn is pinned to the photo, so it is free to move under the cards.
  const shots: Shot[] = [
    [0, 1, 70, 40],
    [crackAt, 1.03, 70, 40],
    [crackAt + 40, 1.14, 72, 38, "move"], // "exploring a volcanic crack in the sea floor": in on the worms beside Alvin's card
    [foundAt, 1.17, 72, 38],
    [foundAt + 50, 1.22, 36, 58, "move"], // "It found them": the card goes, pan across to the big cluster
    [wormsAt, 1.25, 36, 58],
    [wormsAt + 40, 1.33, 34, 60, "move"], // "Tube worms as tall as a person": push in on them
    [heatAt, 1.35, 40, 56],
    [questionAt, 1.26, 55, 50], // slow pull back and across while the temperature card is up
    [questionAt + 50, 1.1, 50, 45, "move"], // "No sunlight has ever touched this place": wide, and dimmer
    [firstAt, 1.16, 58, 45],
    [firstAt + 50, 1.26, 74, 36, "move"], // "the first ecosystem ever found...": across to the second stand of worms
    [wormAt, 1.3, 74, 36],
    [wormAt + 40, 1.12, 50, 45, "move"], // the cutaway: wide and dim behind the drawing
    [fieldsAt, 1.16, 50, 45],
    [fieldsAt + 40, 1.2, 62, 50, "move"], // the photo is back for "more than five hundred of these vent fields"
    [reasonAt, 1.22, 62, 50],
    [reasonAt + 50, 1.3, 76, 38, "move"], // "and they're one reason...": move on to another part of the garden
    [t.frames, 1.34, 76, 38],
  ];

  return (
    <RungShell t={t} index={5} depth={2500} plate={LEVELS[5]} brightness={0.9 - 0.5 * worm - 0.32 * noSun} plateMove={cameraAt(frame, shots)} credit={worm > 0.5 ? { kind: "illustration", source: "over a NOAA Ocean Exploration photo" } : { kind: "real", source: "NOAA Ocean Exploration" }} sub="≈ 250× surface pressure">
      {/* scrim under the gauge column: its "0 m / 200 m / 1,000 m" labels sat on white tube worms */}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,14,24,0) 84%, rgba(5,14,24,0.72) 90.5%)" }} />

      {/* Alvin, the submersible that found them. The photo is from 1971, not the 1977 dive - the caption says so,
          and sits on the card's own dark strip so it reads over the worms. */}
      <div style={{ position: "absolute", left: 120, top: 250, width: 640, borderRadius: 22, overflow: "hidden", outline: `4px solid ${B.paper}`, opacity: alvin, transform: `translateX(${-140 * ease(frame, foundAt, 14)}px)`, boxShadow: "0 12px 40px rgba(0,0,0,0.6)", background: "rgba(5,14,24,0.94)" }}>
        <div style={{ height: 400, overflow: "hidden" }}>
          <Img src={levelImage(ALVIN)!} style={{ display: "block", width: "100%", height: 400, objectFit: "cover", transform: `scale(${inset})`, transformOrigin: "48% 42%" }} />
        </div>
        <div style={{ padding: "12px 20px 14px", fontFamily: F.ui, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 26, color: B.paper }}>Alvin · found the vents, Feb 1977</div>
          <div style={{ fontSize: 24, color: B.mute, marginTop: 4 }}>this photo: 1971 · NOAA Photo Library</div>
        </div>
      </div>
      {/* "looking for hot springs" - held through "It found them", under Alvin's card (which ends at y≈744) */}
      <div style={{ opacity: ease(frame, springsAt, 10) * (1 - ease(frame, foundAt + 36, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          looking for <span style={{ color: B.gauge }}>hot springs</span>
        </CaptionPop>
      </div>

      {/* on the word "garden"; it leaves on "crowded around vents" so line 2 is not spoken under line 1's caption */}
      <div style={{ opacity: ease(frame, gardenAt, 10) * (1 - ease(frame, crowdedAt, 10)) }}>
        <CaptionPop bottom={150} size={92} color={B.paper}>
          a <span style={{ color: B.gauge }}>garden</span>. two and a half kilometres down.
        </CaptionPop>
      </div>
      {/* line 2: the tube worms the photo shows (#17), as they are named; gone before the temperature card takes the
          slot. The clams are spoken only - this photo has none, and the chip says REAL FOOTAGE. */}
      <div style={{ position: "absolute", left: 160, top: 300, opacity: 1 - ease(frame, heatAt - 10, 8) }}>
        <NumberCard x={0} y={0} opacity={ease(frame, wormsAt, 10)} big="TUBE WORMS · AS TALL AS A PERSON" size={60} />
      </div>
      <div style={{ position: "absolute", left: 160, top: 300, opacity: ease(frame, heatAt, 12) * (1 - ease(frame, questionAt + 30, 10)) }}>
        <NumberCard x={0} y={0} big="≈ 370 °C" small="VENT WATER · MORE THAN 700 °F" size={84} color={B.tease} ink={B.paper} />
      </div>
      <div style={{ opacity: ease(frame, questionAt + 30, 10) * (1 - ease(frame, answerAt, 10)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>no sunlight, ever. so what is everything eating?</CaptionPop>
      </div>
      {/* the answer, in the narration's words (line 4): each half arrives as it is said, both stay through line 5 */}
      <ChainRow top={300} opacity={ease(frame, microbesAt, 12) * (1 - ease(frame, wormAt, 8))} who="MICROBES" verb="live on" what="CHEMICALS IN THE VENT WATER" whoColor={B.gauge} whatColor={B.paper} />
      <ChainRow top={404} opacity={ease(frame, everythingAt, 12) * (1 - ease(frame, wormAt, 8))} who="EVERYTHING ELSE" verb="lives on" what="THE MICROBES" whoColor={B.paper} whatColor={B.gauge} />
      <div style={{ opacity: ease(frame, planetAt, 10) * (1 - ease(frame, wormAt, 8)) }}>
        <CaptionPop bottom={150} size={88}>
          it runs on the <span style={{ color: B.paper }}>planet itself</span>
        </CaptionPop>
      </div>

      {/* tube-worm cutaway: tube, red plume, and the organ full of bacteria (the trophosome) */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: worm }}>
        <g transform="translate(560 250)">
          {/* white tube - ends at y=980, above the credit chip (from y=998), which now reaches under it */}
          <rect x={0} y={150} width={150} height={580} rx={40} fill="#F2F2F2" />
          <rect x={0} y={150} width={150} height={580} rx={40} fill="none" stroke="#C9D3DC" strokeWidth={4} />
          {/* red plume: the filaments sway all the time, and the whole plume swells when it is named and when it "breathes" */}
          <g transform={`translate(75 160) scale(${1 + 0.1 * plumeHi + 0.1 * breathe}) translate(-75 -160)`}>
            {Array.from({ length: 9 }, (_, i) => {
              const sw = 5 * Math.sin(frame / 16 + i * 0.5) * (1 + 1.2 * breathe);
              return <path key={i} d={`M${75 + (i - 4) * 12} 160 C ${75 + (i - 4) * 30 + sw} 90, ${75 + (i - 4) * 34 + sw * 1.6} 40, ${75 + (i - 4) * 26 + sw * 2} 0`} stroke={interpolateColors(plumeHi, [0, 1], ["#E8322B", "#FF6A5C"])} strokeWidth={10 + 3 * plumeHi} fill="none" strokeLinecap="round" />;
            })}
          </g>
          {/* the trophosome: an organ packed with bacteria, a third to a half of the body */}
          <g transform={`translate(75 495) scale(${1 + 0.06 * Math.min(1, organHi)}) translate(-75 -495)`}>
            <rect x={22} y={330} width={106} height={330} rx={30} fill="#7A5CFF" opacity={organ * 0.9} />
            {/* the bacteria never sit still; from "They turn the poison into food" they turn green, top to bottom */}
            {Array.from({ length: 40 }, (_, i) => {
              const cy = 350 + ((i * 53) % 290);
              const fedYet = ease(frame, foodAt + ((cy - 350) / 290) * 24, 14);
              return <circle key={i} cx={40 + ((i * 29) % 70) + 2.5 * Math.sin(frame / 7 + i)} cy={cy + 2.5 * Math.cos(frame / 9 + i * 1.7)} r={4 + 2 * Math.min(1, organHi)} fill={interpolateColors(fedYet, [0, 1], ["#DCD3FF", "#8CF08C"])} opacity={organ} />;
            })}
          </g>
          {/* blood vessels: plume -> organ. They draw on with "a delivery system"; the gas rides down them on "its blood carries both down" */}
          {VESSELS.map((v, k) => (
            <path key={k} d={`M${v[0][0]} ${v[0][1]} C ${v[1][0]} ${v[1][1]}, ${v[2][0]} ${v[2][1]}, ${v[3][0]} ${v[3][1]}`} stroke="#B2121F" strokeWidth={6} fill="none" strokeDasharray={190} strokeDashoffset={190 * (1 - ease(frame, plumeAt, 30))} opacity={ease(frame, plumeAt, 4)} />
          ))}
          {VESSELS.map((v, k) =>
            Array.from({ length: 4 }, (_, j) => {
              // 0-1 runs down the vessel, 1-1.35 carries on a little way into the organ and fades there
              const w = (((((frame - bloodAt) / 48 + j / 4) % 1) + 1) % 1) * 1.35;
              const [x, y] = w <= 1 ? onCurve(v, w) : [v[3][0], v[3][1] + (w - 1) * 220];
              return <circle key={`${k}-${j}`} cx={x} cy={y} r={7} fill={(j + k) % 2 ? "#39B6FF" : "#FFE14D"} stroke={B.ink} strokeWidth={2} opacity={blood * Math.min(1, w / 0.1) * Math.min(1, (1.35 - w) / 0.3)} />;
            }),
          )}
          {/* O2 (blue, from "oxygen") and H2S (yellow, from "hydrogen sulfide") streaming into the plume from the open water on the left */}
          {Array.from({ length: 12 }, (_, i) => {
            const p = ((((frame - plumeAt) / 80 + i / 12) % 1) + 1) % 1;
            const sx = -200 + (i % 3) * 34;
            const sy = -70 + ((i * 37) % 150);
            const yellow = i % 2 === 0;
            return <circle key={i} cx={sx + (75 + ((i % 5) - 2) * 22 - sx) * p} cy={sy + (60 - sy) * p} r={9 + (yellow ? 4 * bump(frame, poisonAt, 8, 40) : 0)} fill={yellow ? "#FFE14D" : "#39B6FF"} opacity={(yellow ? h2s : oxy) * Math.min(1, p / 0.12) * Math.min(1, (1 - p) / 0.15)} />;
          })}
          {/* food out of the organ */}
          {Array.from({ length: 6 }, (_, i) => {
            const d = ((frame - foodAt) * 3 + i * 50) % 300;
            return <circle key={i} cx={180 + d * 0.6} cy={507 + Math.sin(d / 30 + i) * 22} r={7} fill="#7FE07F" opacity={food * (1 - d / 300)} />;
          })}
          {/* "fed from within": the food spreads out through the body, up and down the tube walls either side of the organ */}
          {Array.from({ length: 10 }, (_, i) => {
            const q = ((((frame - fedAt) / 90 + i / 10) % 1) + 1) % 1;
            return <circle key={i} cx={i % 2 ? 139 : 11} cy={495 + (i % 4 < 2 ? -300 : 200) * q} r={6} fill="#1E9E48" opacity={fed * (1 - q)} />;
          })}
        </g>
      </svg>
      {/* labels in the order they are spoken (lines 6, 8, 8, 7, 8, 9), each on a scrim and each on its own words; the
          reds are light tints so they read against the dimmed red worms. The long ones reach x≈1620, so none sits in
          the gauge readout's rows (y 518-612). The food dots run in the gap between the last two (y 728-786).
          A part that has not been said yet is not rendered at all (a hidden span still took its width and left an
          empty scrim). The organ label is on the row of the gauge's "3,800 m" stop (from x≈1752): without "an" and
          with the fractions written out it ends at about x=1600-1640. */}
      <Label y={280} opacity={worm * ease(frame, mouthAt, 8)} color={neverEats > 0.5 ? B.gauge : B.paper} scale={1 + 0.06 * neverEats}>
        no mouth
        {frame > stomachAt ? <span style={{ opacity: ease(frame, stomachAt, 8) }}> · no stomach</span> : null}
        {frame > gutAt ? <span style={{ opacity: ease(frame, gutAt, 8) }}> · no gut</span> : null}
      </Label>
      <Label y={330} opacity={worm * take} color="#FF6B5E">
        the plume takes in
        {frame > oxyAt ? <span style={{ color: "#6CC8FF", opacity: oxy }}> oxygen</span> : null}
        {frame > h2sAt ? <span style={{ color: "#FFE14D", opacity: h2s }}> + hydrogen sulfide</span> : null}
      </Label>
      {/* "poisonous to you and me" (spoken, line 8): the yellow dots are the poison the last label turns into food */}
      <Label y={380} opacity={worm * poison} color="#FFE14D">
        <span style={{ display: "inline-block", width: 18, height: 18, borderRadius: 9, background: "#FFE14D", marginRight: 12 }} />
        poisonous to you and me
      </Label>
      <Label y={632} opacity={worm * organ} color="#DCD3FF">
        organ of bacteria
        {frame > cargoAt ? <span style={{ opacity: ease(frame, cargoAt, 10) }}> · ≈ 1/3 – 1/2 of its body weight</span> : null}
      </Label>
      <Label y={682} opacity={worm * blood} color="#FF9A90">blood carries both down to them</Label>
      <Label y={792} opacity={worm * food} color="#7FE07F">they turn the poison into food</Label>
      {/* to the right of the tube (x 560-710): centred in the full width, the caption sat on the drawing.
          bottom 130 puts it at y≈850-950, under the last label (ends y=834) and above the "cutaway" note. */}
      <div style={{ position: "absolute", left: 640, top: 0, right: 0, bottom: 0, opacity: ease(frame, fedAt, 10) * (1 - ease(frame, fieldsAt, 8)) }}>
        <CaptionPop bottom={130} size={88}>fed from within</CaptionPop>
      </div>

      {/* 500+ vent fields (#17): the number is there whole as the voice says "more than five hundred" - it only pops */}
      <div style={{ position: "absolute", left: 160, top: 320, opacity: fields, transform: `scale(${1 + 0.08 * bump(frame, fieldsAt, 8, 14)})`, transformOrigin: "left top" }}>
        <NumberCard x={0} y={0} big="500+" small="VENT FIELDS FOUND SINCE 1977" size={110} />
      </div>
      <div style={{ opacity: ease(frame, teaseAt, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>6 down · next: the record</span>
          <br />
          <span style={{ whiteSpace: "nowrap" }}>
            that <span style={{ color: B.gauge }}>beats every human</span>
          </span>
        </CaptionPop>
      </div>
      <div style={{ position: "absolute", left: 790, top: 966, opacity: worm, fontFamily: F.ui, fontWeight: 800, fontSize: 24, color: B.mute, letterSpacing: 2 }}>CUTAWAY · NOT TO SCALE</div>
    </RungShell>
  );
};
