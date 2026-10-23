import React from "react";
import { AbsoluteFill, Img, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { CaptionPop, CreditChip, DiverSilhouette, Tile, levelImage } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease, lerp } from "../../../lib/ui";
import { LEVELS } from "../ladder";
import { NumberCard, Problems, RungShell, Tag } from "./shell";

const INCUMBENTS = ["anglerfish", "gulper eel", "giant isopod", "vampire squid", "goblin shark", "sea pig", "blobfish", "viperfish"];

// --- motion pass 2026-10-01: the small maths the five scenes share. What moves, and when, stays bespoke per scene. ---
/** even 0-1 between two frames (ease() is ease-out; a steady traveller or an even fade uses this) */
const lin = (f: number, a: number, b: number) => Math.min(1, Math.max(0, (f - a) / Math.max(1, b - a)));
/** 0-1 with a soft start and stop, for camera moves and anything that travels */
const smooth = (f: number, a: number, b: number) => {
  const x = lin(f, a, b);
  return x * x * (3 - 2 * x);
};
/** a short pulse: up over `up` frames, back down over `down` */
const bump = (f: number, at: number, up = 6, down = 20) => {
  const u = f - at;
  return u <= 0 ? 0 : u < up ? u / up : Math.max(0, 1 - (u - up) / down);
};
/** a ring thrown out once from `at`: 0-1 while it travels, -1 when there is nothing to draw */
const ripple = (f: number, at: number, len = 24) => (f > at && f < at + len ? (f - at) / len : -1);
/** a point on a cubic curve, one coordinate at a time */
const cubic = (p0: number, p1: number, p2: number, p3: number, u: number) => {
  const v = 1 - u;
  return v * v * v * p0 + 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u * p3;
};
/** One position of the camera on a plate: [frame, scale, origin x %, origin y %]; "move" = eased into, otherwise a slow drift. */
type Shot = [number, number, number, number, "move"?];
const cameraAt = (frame: number, shots: Shot[]) => {
  let i = 0;
  while (i < shots.length - 2 && frame >= shots[i + 1][0]) i++;
  const a = shots[i];
  const b = shots[i + 1];
  const k = b[4] === "move" ? smooth(frame, a[0], b[0]) : lin(frame, a[0], b[0]);
  return { scale: a[1] + (b[1] - a[1]) * k, origin: `${a[2] + (b[2] - a[2]) * k}% ${a[3] + (b[3] - a[3]) * k}%` };
};
const photo = (id: string, ext: "jpg" | "png" = "jpg") => levelImage({ id, name: "", reading: "", image: id, ext })!;

/** A note on its own dark scrim (26 px or more): what a photo is, or which part of it the voice is naming. */
const Pill: React.FC<{ x: number; y: number; opacity?: number; size?: number; color?: string; children: React.ReactNode }> = ({ x, y, opacity = 1, size = 26, color = B.paper, children }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity, padding: "8px 18px", borderRadius: 999, background: "rgba(5,14,24,0.82)", fontFamily: F.ui, fontWeight: 800, fontSize: size, letterSpacing: 1.5, color, textTransform: "uppercase", whiteSpace: "nowrap" }}>
    {children}
  </div>
);
/** The kit's NumberCard as two styles, for cards whose halves wait for their own words. */
const cardBox = (size: number, color: string = B.gauge, ink: string = B.ink): React.CSSProperties => ({ padding: "10px 22px 12px", borderRadius: 16, background: color, color: ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)", fontFamily: F.headline, fontSize: size, lineHeight: 1, whiteSpace: "nowrap" });
const cardSmall = (size: number): React.CSSProperties => ({ fontFamily: F.ui, fontWeight: 800, fontSize: Math.round(size * 0.36), letterSpacing: 1, whiteSpace: "nowrap" });

// credits as logged in studio/assets/manifest.json and episodes/L02-deep-sea-types/sources.md (#22, #23, #27)
const NOAA_OE = "NOAA Ocean Exploration";
const WHALE_CREDIT = "OET/NOAA (CC BY 2.0) · a whale skeleton, Monterey Bay National Marine Sanctuary, 2019";
const GOOSE_CREDIT = "NOAA Ocean Exploration · a goosefish, Gulf of Mexico 2018";
/**
 * The Lure plate is a goosefish (#22): this note is on the picture whenever it is plainly visible, in the cold open too.
 * Fix run 1 (A3): it sits on the problem-strip row, right of the strip (x 1050-~1370, y 247-323; the strip ends at
 * x≈1035) - across the forehead it covered both lure rods, the very thing the scene is about.
 */
const GooseNote: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ position: "absolute", left: 1050, top: 247, opacity, padding: "8px 18px", borderRadius: 18, background: "rgba(5,14,24,0.82)", fontFamily: F.ui, fontWeight: 800, fontSize: 24, lineHeight: "30px", letterSpacing: 1.5, color: B.paper, textTransform: "uppercase", whiteSpace: "nowrap" }}>
    photo: a goosefish
    <br />a sea-floor cousin
  </div>
);

/**
 * Cold open (draft 3, 6 lines). 0 "Every video about the deep sea gives you the same list..." 1 "This isn't that list... The tricks are."
 * 2 "A thousand metres down, the water presses on you with about a hundred times the weight of the air... But that isn't the problem." (NEW · source #17)
 * 3 "Below a thousand metres there is no light, almost no food, and nowhere to hide... Eight types."
 * 4 "Learn them, and you can look at any deep-sea creature and know what it's for." 5 "Type one is the one you already know..."
 *
 * Motion pass 2026-10-01: the photos are full frame and bright, and cut on the words (the goosefish on "the
 * anglerfish", the eel on "the gulper eel", the isopod on "the giant isopod"); each carries its own credit. The list, the pressure and the three problems are then
 * read on dark water, not on an animal they do not describe, and every card waits for its own words. Real photos come
 * back for "look at any deep-sea creature" (each with its tile lit), and the Type 1 photo arrives on "Type one" and
 * carries straight on into the Lure scene.
 */
export const ColdOpen: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  // line 0: "Every video about the deep sea / gives you the same list. / The anglerfish. / The gulper eel. / The giant isopod. / Eight animals, in the dark, / one after another."
  const jellyAt = within(t, 0, 0.18);
  const anglerAt = within(t, 0, 0.36);
  const eelAt = within(t, 0, 0.465);
  const isopodAt = within(t, 0, 0.57);
  const darkAt = within(t, 0, 0.78); // "in the dark"
  const listAt = darkAt + 6;
  const strikeAt = lineAt(t, 1);
  const pointAt = within(t, 1, 0.25); // "Because down there, the animals aren't the point."
  const tricksAt = within(t, 1, 0.83); // "The tricks are."
  const pressureAt = lineAt(t, 2);
  const pressesAt = within(t, 2, 0.15); // "the water presses on you"
  const hundredAt = within(t, 2, 0.33); // "about a hundred times the weight of the air"
  const notThatAt = within(t, 2, 0.69); // "But that isn't the problem..."
  const problemsAt = lineAt(t, 3);
  const pillAt = [within(t, 3, 0.18), within(t, 3, 0.24), within(t, 3, 0.35)]; // "no light" / "almost no food" / "nowhere to hide"
  const tilesAt = within(t, 3, 0.72); // "...with one of a handful of strategies"; the eighth tile lands on "Eight types"
  const eightAt = within(t, 3, 0.92); // "Eight types."
  const learnAt = lineAt(t, 4);
  const lookAt = within(t, 4, 0.2); // "you can look at any deep-sea creature"
  const secondAt = within(t, 4, 0.52);
  const knowAt = within(t, 4, 0.75); // "and know what it's for"
  const oneAt = lineAt(t, 5);
  const whyAt = within(t, 5, 0.53); // "You just don't know why it works."

  // The opening photos: two before any animal is named, then one on each name, cut on the word. The last one sinks
  // into the dark on "in the dark". Each carries its own credit (assets/manifest.json).
  const cuts: { id: string; ext?: "png"; from: number; to: number; zoom: number; origin: string; bright: number; credit: string }[] = [
    { id: "whale-fall", from: 0, to: jellyAt, zoom: 1, origin: "62% 42%", bright: 1, credit: WHALE_CREDIT },
    { id: "comb-jelly", ext: "png", from: jellyAt, to: anglerAt, zoom: 1, origin: "58% 44%", bright: 1, credit: NOAA_OE },
    { id: "anglerfish-lophiodes", from: anglerAt, to: eelAt, zoom: 1, origin: "50% 45%", bright: 0.85, credit: NOAA_OE },
    { id: "pelican-eel", from: eelAt, to: isopodAt, zoom: 1.1, origin: "20% 55%", bright: 0.7, credit: NOAA_OE },
    { id: "isopod-still", from: isopodAt, to: darkAt + 16, zoom: 1, origin: "45% 50%", bright: 0.85, credit: NOAA_OE },
  ];
  const montage = ease(frame, 0, 10) * (1 - ease(frame, darkAt, 14));
  // line 4: two creatures, each with the tile of its type lit - see the animal, know the type
  const creatures: { id: string; ext?: "png"; from: number; to: number; zoom: number; origin: string }[] = [
    { id: "comb-jelly", ext: "png", from: learnAt, to: secondAt, zoom: 1.04, origin: "58% 44%" },
    { id: "isopod-still", from: secondAt, to: oneAt + 12, zoom: 1.08, origin: "40% 58%" },
  ];
  const back = ease(frame, learnAt, 12);
  // line 5: the Type 1 photo. It ends on the framing the Lure scene opens with (scale 1.05 about 50% 45%, brightness 0.8).
  const goose = ease(frame, oneAt - 4, 14);
  const cut = cuts.find((c) => frame >= c.from && frame < c.to);
  const chip = frame >= oneAt ? GOOSE_CREDIT : frame >= learnAt ? NOAA_OE : cut?.credit;
  // the goosefish note is on the picture whenever the goosefish is: on "The anglerfish" (line 0) and from "Type one"
  const gooseNote = cut?.id === "anglerfish-lophiodes" ? 1 : goose;
  const lit = frame >= oneAt ? 0 : frame >= secondAt ? 4 : frame >= learnAt ? 3 : -1;
  const litAt = frame >= oneAt ? oneAt : frame >= secondAt ? secondAt : learnAt;
  // "A thousand metres down": the water goes from deep blue to black while the depth runs up to 1,000 m. The specks
  // in the water rise slowly all the time (we are sinking) and streak past while the depth is running.
  const deep = ease(frame, pressureAt, 40);
  const depthNow = Math.round(1000 * lin(frame, pressureAt + 2, pressureAt + 34));
  const sunk = (f: number) => f * 0.7 + 1500 * smooth(f, pressureAt, pressureAt + 40);
  const rush = sunk(frame) - sunk(frame - 1);
  // "the water presses on you": arrows drive in on a figure, harder on "a hundred times", and let go on "But that isn't the problem"
  const press = ease(frame, pressesAt, 12) * (1 - ease(frame, notThatAt, 14));
  const squeeze = (16 + 22 * ease(frame, hundredAt, 12)) * Math.max(0, Math.sin((frame - pressesAt) / 7));
  return (
    <AbsoluteFill style={{ backgroundColor: "#02060B" }}>
      {/* dark water behind the list and the cards: a slow-drifting glow, no photo, so no label sits on an animal */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${46 + 6 * Math.sin(frame / 70)}% ${38 + 3 * Math.sin(frame / 47)}%, ${interpolateColors(deep, [0, 1], ["#12395C", "#081826"])} 0%, ${interpolateColors(deep, [0, 1], ["#0A1D30", "#040B14"])} 55%, #02060B 100%)` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 46 }, (_, i) => {
          const k = 0.5 + (i % 5) * 0.25;
          const y = 1130 - ((((i * 104729) % 1180) + sunk(frame) * k) % 1180);
          const x = ((i * 7919) % 1920) + 10 * Math.sin(frame / 40 + i);
          return <line key={i} x1={x} y1={y} x2={x} y2={y + Math.min(70, rush * k * 2.2)} stroke="#BFD9EA" strokeWidth={3 + (i % 4) * 1.5} strokeLinecap="round" opacity={0.22 + 0.08 * (i % 3)} />;
        })}
      </svg>
      {/* real animals first, full frame and bright - the viewer sees the promise kept before any text */}
      {cuts.map((c) =>
        frame >= c.from && frame < c.to ? (
          <Img key={c.id} src={photo(c.id, c.ext)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${c.bright})`, transform: `scale(${c.zoom + 0.06 * lin(frame, c.from, c.to)})`, transformOrigin: c.origin, opacity: montage }} />
        ) : null,
      )}
      {creatures.map((c) =>
        frame >= c.from && frame < c.to ? (
          <Img key={`${c.id}-again`} src={photo(c.id, c.ext)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8)", transform: `scale(${c.zoom + 0.05 * lin(frame, c.from, c.to)})`, transformOrigin: c.origin, opacity: back }} />
        ) : null,
      )}
      {frame >= oneAt - 6 ? <Img src={photo("anglerfish-lophiodes")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8)", transform: `scale(${1 + 0.05 * lin(frame, oneAt, t.frames)})`, transformOrigin: "50% 45%", opacity: goose }} /> : null}
      <AbsoluteFill style={{ background: "linear-gradient(transparent 55%, rgba(5,14,24,0.72))", opacity: goose }} />
      {/* scrim under the tile row once photos are behind it again */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 250, background: "linear-gradient(rgba(5,14,24,0.92) 55%, rgba(5,14,24,0))", opacity: back }} />

      {/* the same old list: the names arrive "one after another", on the dark, and are struck through on "This isn't that list" */}
      <div style={{ position: "absolute", left: 160, top: 260, display: "grid", gridTemplateColumns: "repeat(4, 300px)", gap: 18, opacity: (1 - ease(frame, pressureAt, 10)) * (1 - 0.5 * ease(frame, pointAt, 12)) }}>
        {INCUMBENTS.map((n, i) => {
          const on = ease(frame, listAt + i * 6, 8);
          return (
            <div key={n} style={{ position: "relative", padding: "18px 20px", borderRadius: 14, background: "rgba(255,255,255,0.08)", fontFamily: F.headline, fontSize: 40, color: B.mute, opacity: on, transform: `scale(${0.85 + 0.15 * on})` }}>
              {n}
              <div style={{ position: "absolute", left: 14, right: 14, top: "50%", height: 8, background: B.tease, transform: "rotate(-8deg)", opacity: ease(frame, strikeAt + i * 4, 6) }} />
            </div>
          );
        })}
      </div>
      {/* line 1: each sentence gets its half of the caption (the second line keeps its place, unseen, until "The tricks are") */}
      <div style={{ opacity: ease(frame, pointAt, 10) * (1 - ease(frame, pressureAt, 8)) }}>
        <CaptionPop bottom={150} size={90} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>the animals aren't the point.</span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, tricksAt, 8) }}>
            the <span style={{ color: B.gauge }}>tricks</span> are.
          </span>
        </CaptionPop>
      </div>
      {/* the pressure beat (source #17: +1 atm per 10 m → ≈100× at 1,000 m): the depth runs down as it is said and
          stays for "Below a thousand metres" (line 3); the number lands on "about a hundred times" (y 430-543; written
          "100 times" - the headline font has no × glyph) and
          steps back on "But that isn't the problem" (card y 590-692) */}
      <div style={{ position: "absolute", left: 160, top: 300, opacity: ease(frame, pressureAt, 10) * (1 - ease(frame, learnAt - 8, 8)) }}>
        <NumberCard x={0} y={0} big={`${depthNow.toLocaleString("en-US")} m down`} size={72} color={B.paper} />
      </div>
      <div style={{ position: "absolute", left: 160, top: 430, opacity: 1 - ease(frame, problemsAt, 8) }}>
        <NumberCard x={0} y={0} opacity={ease(frame, hundredAt, 10) * (1 - 0.55 * ease(frame, notThatAt, 12))} big="≈ 100 times the pressure at the surface" small="ABOUT ONE MORE ATMOSPHERE EVERY 10 M · NOAA" size={64} />
        <NumberCard x={0} y={160} opacity={ease(frame, notThatAt, 10)} big="but that isn't what shapes them" small="THE PRESSURE IS NOT THE PROBLEM" size={56} color="rgba(255,255,255,0.14)" ink={B.paper} />
      </div>
      {/* "the water presses on you": a figure (x 1360-1600, y 320-560) and the water pushing in on it from every side
          (arrows within x 1218-1742, y 178-702; the "100 times" card, at 64 px, ends at x≈1185) */}
      <div style={{ position: "absolute", left: 1360, top: 320, opacity: ease(frame, pressesAt, 12) * (1 - 0.6 * ease(frame, notThatAt, 14)) * (1 - ease(frame, problemsAt, 8)) }}>
        <DiverSilhouette size={240} color="#DCE8F2" />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: press }}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const r1 = 262 - squeeze;
          const r2 = 182 - squeeze;
          const cx = 1480;
          const cy = 440;
          return (
            <g key={i} stroke={B.tease} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none">
              <line x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1} x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2} />
              <path d={`M ${cx + Math.cos(a - 0.15) * (r2 + 28)} ${cy + Math.sin(a - 0.15) * (r2 + 28)} L ${cx + Math.cos(a) * r2} ${cy + Math.sin(a) * r2} L ${cx + Math.cos(a + 0.15) * (r2 + 28)} ${cy + Math.sin(a + 0.15) * (r2 + 28)}`} />
            </g>
          );
        })}
      </svg>
      {/* the three problems, each on its own words, left-aligned under the depth card (x 160-1230, y 420-560); gone before the photos return */}
      <div style={{ position: "absolute", left: 160, top: 420, opacity: 1 - ease(frame, learnAt - 8, 8) }}>
        <div style={{ display: "flex", gap: 24 }}>
          {["NO LIGHT", "NO FOOD", "NOWHERE TO HIDE"].map((p, i) => (
            <div key={p} style={{ padding: "22px 34px", borderRadius: 20, background: B.gauge, color: B.ink, fontFamily: F.headline, fontSize: 64, opacity: ease(frame, pillAt[i], 8), transform: `scale(${1 + 0.06 * bump(frame, pillAt[i], 5, 14)})` }}>
              {p}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 30, fontFamily: F.caption, fontSize: 56, color: B.paper, opacity: ease(frame, eightAt, 10) }}>
          eight ways to solve them
        </div>
      </div>
      {/* the eight tiles pop in one by one under "one of a handful of strategies"; on line 4 the tile of the creature
          on screen steps forward, on line 5 it is Type 1 */}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16, opacity: ease(frame, tilesAt, 1) }}>
        {LEVELS.map((l, i) => {
          const s = ease(frame, tilesAt + i * 9, 8);
          const current = i === lit;
          return (
            <div key={l.id} style={{ position: "relative", zIndex: current ? 1 : 0, transform: `scale(${(0.6 + 0.4 * s) * (current ? 1 + 0.14 * ease(frame, litAt, 8) : 1)})`, opacity: s }}>
              <Tile level={l} width={190} height={100} labelSize={l.image || l.glyph ? 14 : 0} state={current ? "current" : "past"} badge={current && i === 0 ? "TYPE 1" : undefined} />
            </div>
          );
        })}
      </div>
      {/* line 4, in its own words */}
      <div style={{ opacity: ease(frame, lookAt, 10) * (1 - ease(frame, oneAt - 4, 8)) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>look at any deep-sea creature</span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, knowAt, 8) }}>
            and know <span style={{ color: B.gauge }}>what it's for</span>
          </span>
        </CaptionPop>
      </div>
      {/* the anglerfish photo is a goosefish (#22): said on the picture from its first frame, where the Lure scene keeps it
          (x 1050-~1370, y 247-323: under the tile row, which ends at y≈167, and right of the lure rods) */}
      <GooseNote opacity={gooseNote} />
      <div style={{ opacity: ease(frame, oneAt + 6, 10) }}>
        <CaptionPop bottom={150} size={84}>
          <span style={{ whiteSpace: "nowrap" }}>type one: the one you already know</span>
          <br />
          <span style={{ whiteSpace: "nowrap", color: B.paper, opacity: ease(frame, whyAt, 8) }}>you just don't know why it works</span>
        </CaptionPop>
      </div>
      {/* the credit follows the photo on screen; on the dark there is no photo and no chip */}
      <div style={{ opacity: Math.max(montage, back) }}>
        <CreditChip source={chip} />
      </div>
    </AbsoluteFill>
  );
};

/** One line of the footballfish caption card: it opens (height and all) on its own words, so the card never shows an empty row. */
const InsetRow: React.FC<{ on: number; h: number; size: number; color?: string; children: React.ReactNode }> = ({ on, h, size, color = B.paper, children }) => (
  <div style={{ height: h * on, opacity: on, overflow: "hidden", fontSize: size, lineHeight: `${h}px`, color }}>{children}</div>
);

// the drawn anglerfish (lines 3-7): body centre x, total length tail tip -> snout, and the male at 2.8 / 20 of it (#1)
const HER_X = 560;
const HER_LEN = 530;
const HIS_LEN = (HER_LEN * 2.8) / 20;
const PREY_BODY = "M-30 0 C -16 -14, 16 -14, 30 0 C 16 12, -16 12, -30 0 Z";
const PREY_TAIL = "M28 0 L 46 -12 L 46 12 Z";

/**
 * 1 · The Lure. Lines 0-8 (draft 3: line 3 "≈90 % glow" is new — source #1; old 3-7 → 4-8). Sources #1, #15, #22, #23, #31. Plate: NOAA goosefish still.
 * 0 "Here's the deep-sea rule... chasing it costs more energy than it gives back. So the first strategy is not to chase at all."
 * 1 "A female deep-sea anglerfish grows to about twenty centimetres. Above her mouth hangs a rod... a glowing bulb. The light isn't hers."
 * 2 "Inside that bulb live bacteria... a home in exchange for the glow." 3 "...around ninety percent... A light that hangs still is."
 * 4 "...a small moving light... Things come to look. She doesn't move." 5 "And the males? About two point eight centimetres. A seventh of her length..."
 * 6 "...how does he ever find her? In some species... once he does, he never lets go." 7 "He latches on... fuses into her body... one bloodstream, one lure." 8 tease
 *
 * Motion pass 2026-10-01. The plate is a goosefish, not the deep-sea anglerfish the voice describes, so: the note saying
 * so (26 px) is on the picture whenever the photo is plainly visible; the footballfish's caption sits on its own card,
 * not on the goosefish; and from line 3 on, where the old cards ("≈ 90 % glow", "her: 20 cm") sat on the goosefish's
 * face, the photo goes dark and the story is drawn - the lights, the still lure, the male a seventh of her length,
 * the search, the fusing - each step on its own words. No new facts: every added word is spoken on its line.
 */
export const Lure: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const costAt = within(t, 0, 0.47); // "chasing it costs more energy than it gives back"
  const firstAt = within(t, 0, 0.76); // "So the first strategy is not to chase at all."
  const rodAt = lineAt(t, 1);
  const rodWordAt = within(t, 1, 0.37); // "Above her mouth hangs a rod"
  const bulbAt = within(t, 1, 0.7); // "and on its tip, a glowing bulb"
  const hersAt = within(t, 1, 0.88); // "The light isn't hers."
  const bacteriaAt = lineAt(t, 2);
  const homeAt = within(t, 2, 0.53); // "and she gives them a home in exchange for the glow"
  const glowAt = lineAt(t, 3);
  const ninetyAt = within(t, 3, 0.29); // "around ninety percent"
  const hereAt = within(t, 3, 0.68); // "Down here, a light is not strange."
  const stillAt = within(t, 3, 0.86); // "A light that hangs still is."
  const waitAt = lineAt(t, 4);
  const movingAt = within(t, 4, 0.24); // "a small moving light"
  const thingsAt = within(t, 4, 0.74); // "Things come to look."
  const sheAt = within(t, 4, 0.88); // "She doesn't move."
  const malesAt = lineAt(t, 5);
  const aboutAt = within(t, 5, 0.13); // "About two point eight centimetres."
  const seventhAt = within(t, 5, 0.42); // "A seventh of her length."
  const noLureAt = within(t, 5, 0.64); // "He has no lure at all, and he doesn't glow."
  const problemAt = lineAt(t, 6);
  const allDarkAt = within(t, 6, 0.29); // "in all that dark"
  const findAt = within(t, 6, 0.38); // "how does he ever find her?"
  const someAt = within(t, 6, 0.58); // "In some species, the answer is..."
  const onceAt = within(t, 6, 0.8); // "once he does, he never lets go"
  const latchAt = lineAt(t, 7);
  const fusesAt = within(t, 7, 0.2); // "he fuses into her body"
  const twoAt7 = within(t, 7, 0.7); // "Two animals,"
  const bloodAt = within(t, 7, 0.8); // "one bloodstream"
  const oneLureAt = within(t, 7, 0.93); // "one lure"
  const teaseAt = lineAt(t, 8);
  const twoAt = within(t, 8, 0.47); // "Type two takes the same idea — and cheats."

  const insetIn = ease(frame, rodAt + 4, 24);
  const inset = insetIn * (1 - ease(frame, glowAt, 8)); // the footballfish card leaves as the drawn lights arrive
  const glow = ease(frame, bulbAt, 20);
  // lines 3-7 are drawn on a plate dimmed almost to black; the photo comes back for the tease
  const stage = ease(frame, glowAt, 14) * (1 - ease(frame, teaseAt, 12));
  // The goosefish note. Alone on screen the photo is "the photo" (top left, where the cold open left it); while the
  // footballfish card is up it is "behind", under the card, and grows as the rod and the glow are named.
  const noteAlone = Math.min(1, 1 - ease(frame, rodAt, 6) + ease(frame, teaseAt + 6, 10));
  // A5: while the story is drawn (lines 3-7) the real footballfish stays on screen, small, top right (x 1096-1416, y 336-576)
  const realOne = ease(frame, glowAt + 4, 14) * (1 - ease(frame, teaseAt, 10));
  // S1: when he latches on, a lens opens on him at three times the size, and the fusing is played out in it
  const lens = ease(frame, latchAt + 6, 14);
  const noteBehind = ease(frame, rodAt, 8) * (1 - ease(frame, glowAt, 8));
  const credit =
    frame < rodAt
      ? { kind: "real" as const, source: GOOSE_CREDIT }
      : frame < rodWordAt
        ? { kind: "real" as const, source: "NOAA · goosefish 2018 · footballfish 2002" }
        : frame < glowAt
          ? { kind: "illustration" as const, source: "drawn over NOAA photos · goosefish 2018 · footballfish 2002" }
          : frame < teaseAt + 6
            ? { kind: "illustration" as const, source: "a drawing · inset photo: footballfish, NOAA, 2002" }
            : { kind: "real" as const, source: GOOSE_CREDIT };
  // the camera on the goosefish (1920×1080, so never past 1.25): it carries on from the cold open, goes in on the
  // mouth for the rule, backs off for "not to chase at all", makes room when the card arrives, and is wide again for the tease
  const shots: Shot[] = [
    [0, 1.05, 50, 45],
    [costAt - 30, 1.07, 50, 45],
    [costAt + 14, 1.2, 50, 64, "move"], // "food is so scarce that chasing it costs more energy...": in on the mouth
    [firstAt, 1.22, 50, 64],
    [firstAt + 40, 1.08, 50, 45, "move"], // "So the first strategy is not to chase at all": back out; it just sits there
    [rodAt, 1.1, 48, 44],
    [rodAt + 40, 1.12, 64, 45, "move"], // the footballfish card takes the left; the goosefish slides right
    [glowAt, 1.16, 64, 45],
    [teaseAt, 1.2, 50, 45],
    [teaseAt + 40, 1.06, 50, 42, "move"], // "Type one: make the food come to you": the photo again, wide
    [t.frames, 1.14, 48, 40],
  ];

  // --- the drawn stage ---
  // she sits lower from line 5, to leave the card slot (y 340-470) above her rod (rod apex ≈ herY - 185 = 475)
  const herY = 580 + 80 * ease(frame, malesAt, 24);
  const her = ease(frame, waitAt + 10, 40);
  // the lure hangs still (line 3), then "a small moving light" (line 4): it starts to twitch on its rod
  const twitch = ease(frame, movingAt, 20);
  const lureX = HER_X + 340 + twitch * 10 * Math.sin(frame / 6);
  const lureY = herY - 48 + twitch * 7 * Math.sin(frame / 4.3);
  const lureHi = Math.max(bump(frame, stillAt, 8, 30), bump(frame, noLureAt, 8, 24), bump(frame, oneLureAt, 8, 30));
  // line 3: the other lights, each drifting on its own path, none within reach of the lure; out again on "nothing else shines"
  const others = 1 - ease(frame, waitAt, 24);
  // (the ones on the right keep below the inset photo: x > 1010 -> y 635-685)
  const lights = Array.from({ length: 26 }, (_, i) => {
    const x = 220 + Math.round(((i * 7919) % 1150) * 0.975);
    return { x, y: x > 1010 ? 635 + ((i * 104729) % 50) : 560 + ((i * 104729) % 125), r: 6 + (i % 4) * 2, ph: i * 1.7 };
  }).filter((l) => Math.abs(l.x - 900) > 150);
  // line 4: three small fish swim in to look, and stop short of the light
  const prey = [
    { x: 1030, dy: 20, d: 0 },
    { x: 1170, dy: 95, d: 10 },
    { x: 1260, dy: 30, d: 18 },
  ];
  // line 5: the scale bars under her (20 cm) and him (2.8 cm), and his bar stepped seven times along hers
  const bars = ease(frame, malesAt + 10, 14) * (1 - ease(frame, problemAt, 10));
  const barY = herY + 162;
  // him: in from the right (line 5), off to search (line 6), in to her on "In some species...", then fused (line 7)
  const him = ease(frame, aboutAt, 12);
  const arrive = ease(frame, aboutAt, 30);
  const search = smooth(frame, problemAt, problemAt + 40);
  const home = smooth(frame, someAt + 6, onceAt + 6);
  const fuse = ease(frame, fusesAt, 60);
  // (S1: a wide wander, x 1000-1380, y 620-760 - under the inset photo, right of her lure)
  const hisX = lerp(lerp(lerp(1400, 1150, arrive), 1190 + 190 * Math.sin(frame / 24), search), lerp(657, 650, fuse), home);
  const hisY = lerp(lerp(650 + 6 * Math.sin(frame / 9), 690 + 70 * Math.sin(frame / 15 + 1), search), herY + lerp(141, 128, fuse), home);
  // "in all that dark": the dark closes in around him and lifts again when he turns for her
  const dark = ease(frame, allDarkAt, 20) * (1 - ease(frame, someAt, 30));
  const ringNoLure = ripple(frame, noLureAt);
  const ringLatch = ripple(frame, latchAt);
  const ringStill = ripple(frame, stillAt, 30);

  return (
    <RungShell t={t} index={0} plate={{ image: "anglerfish-lophiodes" }} brightness={Math.max(0, 0.8 - 0.4 * inset - 0.8 * stage)} plateMove={cameraAt(frame, shots)} credit={credit}>
      {/* The plate is a GOOSEFISH (Lophiodes beroe, NOAA 2018, ~640 m): a sea-floor angler whose lure does NOT glow
          (sources.md #22). The note is on the picture from the first frame, beside the problem strip, for as long as
          the photo is the only picture on screen. */}
      <GooseNote opacity={noteAlone} />

      {/* line 0, the rule and what follows from it; under the note, above the chip */}
      <div style={{ opacity: ease(frame, costAt, 10) * (1 - ease(frame, firstAt, 8)) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>chasing food costs more energy</span>
          <br />
          <span style={{ whiteSpace: "nowrap" }}>
            than it <span style={{ color: B.gauge }}>gives back</span>
          </span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, firstAt + 8, 10) * (1 - ease(frame, rodAt, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>so the first strategy:</span>
          <br />
          <span style={{ whiteSpace: "nowrap", color: B.gauge }}>not to chase at all</span>
        </CaptionPop>
      </div>

      {/* The glowing bulb the narration describes is shown on a real deep-sea angler: a footballfish (Himantolophus)
          specimen, NOAA 2002 (#23), 600×450 and never enlarged (photo x 160-760, y 340-790). The ring marks the lure when
          the rod is named and the glow comes up on "a glowing bulb". On line 2 ("Inside that bulb live bacteria that
          make their own light") the bulb is magnified in a circle on the empty tray, top right of the photo: rods that
          never sit still, brighter once the bargain is named. */}
      <div style={{ position: "absolute", left: 160, top: 340, width: 600, height: 450, borderRadius: 20, overflow: "hidden", outline: `4px solid ${B.paper}`, boxShadow: "0 12px 40px rgba(0,0,0,0.6)", opacity: inset, transform: `translateX(${-70 * (1 - insetIn)}px)` }}>
        <Img src={staticFile("assets/footballfish-noaa.jpg")} style={{ width: 600, height: 450, objectFit: "cover" }} />
        <svg width={600} height={450} style={{ position: "absolute", inset: 0 }}>
          <circle cx={226} cy={54} r={34} fill="none" stroke={B.gauge} strokeWidth={5} opacity={ease(frame, rodWordAt, 10)} />
          {[rodWordAt, bulbAt, hersAt, homeAt].map((at) => {
            const p = ripple(frame, at);
            return p < 0 ? null : <circle key={at} cx={226} cy={54} r={34 + 70 * p} fill="none" stroke={B.gauge} strokeWidth={5} opacity={1 - p} />;
          })}
          <circle cx={226} cy={54} r={22 + 7 * glow + 4 * glow * Math.sin(frame / 6)} fill="#BFEFFF" opacity={(0.5 + 0.12 * Math.sin(frame / 6)) * glow} />
          <g opacity={ease(frame, bacteriaAt, 14)}>
            <line x1={258} y1={44} x2={420} y2={62} stroke={B.gauge} strokeWidth={3} />
            <line x1={254} y1={72} x2={436} y2={146} stroke={B.gauge} strokeWidth={3} />
            <circle cx={490} cy={92} r={76 * (0.6 + 0.4 * ease(frame, bacteriaAt, 16))} fill="#06121F" stroke={B.gauge} strokeWidth={5} />
            <circle cx={490} cy={92} r={54 + 5 * Math.sin(frame / 8)} fill="#BFEFFF" opacity={0.14 + 0.18 * ease(frame, homeAt, 14) + 0.05 * Math.sin(frame / 8)} />
            {Array.from({ length: 12 }, (_, i) => {
              const a = i * 2.4;
              const d = 12 + ((i * 23) % 36);
              const cx = 490 + Math.cos(a) * d + 4 * Math.sin(frame / 7 + i);
              const cy = 92 + Math.sin(a) * d + 4 * Math.cos(frame / 9 + i * 2);
              const tilt = i * 0.7 + 0.5 * Math.sin(frame / 15 + i);
              return <line key={i} x1={cx - 8 * Math.cos(tilt)} y1={cy - 8 * Math.sin(tilt)} x2={cx + 8 * Math.cos(tilt)} y2={cy + 8 * Math.sin(tilt)} stroke="#BFEFFF" strokeWidth={8} strokeLinecap="round" opacity={0.65 + 0.35 * Math.sin(frame / 6 + i * 1.3) * ease(frame, homeAt, 14)} />;
            })}
          </g>
        </svg>
      </div>
      {/* its caption card, beside the photo and on its own scrim, so no line of it sits on the goosefish behind
          (x 776-~1415, y 340-~644 when every row is open). Rows open on: the rod, the bulb, "The light isn't hers",
          the bacteria (line 2), "a home in exchange for the glow". */}
      <div style={{ position: "absolute", left: 776, top: 340, padding: "14px 18px", borderRadius: 18, background: "rgba(5,14,24,0.86)", fontFamily: F.ui, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", whiteSpace: "nowrap", opacity: inset, transform: `translateX(${70 * (1 - insetIn)}px)` }}>
        <InsetRow on={1} h={40} size={30}>a deep-sea anglerfish</InsetRow>
        <InsetRow on={1} h={36} size={26} color={B.mute}>footballfish · NOAA specimen, 2002</InsetRow>
        <InsetRow on={ease(frame, rodWordAt, 10)} h={48} size={30} color="#BFEFFF">the lure · a fishing rod, grown</InsetRow>
        <InsetRow on={ease(frame, bulbAt, 10)} h={38} size={26}>on its tip: a glowing bulb</InsetRow>
        <InsetRow on={ease(frame, hersAt, 10)} h={38} size={26} color={B.gauge}>the light isn't hers</InsetRow>
        <InsetRow on={ease(frame, bacteriaAt, 10)} h={38} size={26}>its bulb holds light-making bacteria</InsetRow>
        <InsetRow on={ease(frame, homeAt, 10)} h={38} size={26}>a home, in exchange for the glow</InsetRow>
      </div>
      {/* under the card (x 160-~1180, y 812-860): what the big photo behind it is */}
      <Pill x={160} y={812} opacity={noteBehind}>
        behind: a goosefish, a sea-floor cousin
        {frame > rodWordAt ? <span style={{ opacity: ease(frame, rodWordAt, 8) }}> · same rod</span> : null}
        {frame > bulbAt ? <span style={{ opacity: ease(frame, bulbAt, 8) }}>, no glow</span> : null}
      </Pill>

      {/* lines 3-7, drawn on the dark plate. Her: tail tip x 260 to snout x 790, body y herY ± 140, rod over the top to
          the lure at (900, herY - 48). */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: stage }}>
        {/* "she is not the only one glowing": lights everywhere, all of them on the move (x 176-1430, y 504-741: under the card and the inset photo, above the caption) */}
        {lights.map((l, i) => {
          const on = ease(frame, glowAt + 6 + i * 3, 12) * others;
          const cx = l.x + 44 * Math.sin(frame / 36 + l.ph);
          const cy = l.y + 20 * Math.cos(frame / 27 + l.ph * 1.3);
          return (
            <g key={i} opacity={on}>
              <circle cx={cx} cy={cy} r={l.r * 3} fill="#39B6FF" opacity={0.22} />
              <circle cx={cx} cy={cy} r={l.r} fill={i % 5 === 0 ? "#BFEFFF" : "#39B6FF"} />
            </g>
          );
        })}
        {/* her, faint at first: the animal behind the light */}
        <g transform={`translate(${HER_X} ${herY})`} opacity={her * (0.75 + 0.25 * bump(frame, sheAt, 10, 40))}>
          {/* a diagram, not a character: round body, gaping underslung jaw with a few teeth, a small eye, the rod */}
          <path d="M-200 0 L -300 -74 L -286 0 L -300 74 Z" fill="#14364F" stroke="#2E6E9E" strokeWidth={4} strokeLinejoin="round" />
          <path d="M -205 0 C -185 -105, -40 -150, 80 -128 C 160 -112, 218 -62, 224 -12 L 132 34 L 230 58 C 222 100, 150 136, 50 140 C -70 146, -185 100, -205 0 Z" fill="#14364F" stroke="#2E6E9E" strokeWidth={4} strokeLinejoin="round" />
          <g stroke="#BFD0E0" strokeWidth={3} strokeLinecap="round" fill="none">
            {[0.2, 0.42, 0.64].map((u) => (
              <line key={u} x1={224 - 92 * u} y1={-12 + 46 * u} x2={224 - 92 * u + 5} y2={-12 + 46 * u + 15} />
            ))}
            {[0.3, 0.52, 0.74].map((u) => (
              <line key={u} x1={132 + 98 * u} y1={34 + 24 * u} x2={132 + 98 * u - 3} y2={34 + 24 * u - 15} />
            ))}
          </g>
          <ellipse cx={-30} cy={46} rx={46} ry={18} fill="none" stroke="#2E6E9E" strokeWidth={4} transform="rotate(24 -30 46)" />
          <circle cx={120} cy={-62} r={11} fill="#BFEFFF" opacity={0.9} />
          <path d={`M96 -125 C 150 -210, 315 -185, ${lureX - HER_X} ${lureY - herY}`} stroke="#2E6E9E" strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
        {/* "one bloodstream" (#31): a vessel runs from her body into him */}
        <path d={`M ${HER_X - 40} ${herY + 30} C ${HER_X + 20} ${herY + 70}, 620 ${herY + 90}, 650 ${herY + 124}`} stroke="#E8322B" strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray="16 12" strokeDashoffset={-frame * 2} opacity={ease(frame, bloodAt, 12)} />
        {/* the lure: the one light that stays where it is */}
        {ringStill < 0 ? null : <circle cx={lureX} cy={lureY} r={30 + 90 * ringStill} fill="none" stroke="#BFEFFF" strokeWidth={5} opacity={1 - ringStill} />}
        {/* "the most interesting thing for hundreds of metres": its light carries, ring after ring, for the rest of line 4 */}
        {[0, 1, 2].map((k) => {
          const p = ((((frame - movingAt) / 66 + k / 3) % 1) + 1) % 1;
          return <circle key={k} cx={lureX} cy={lureY} r={40 + 150 * p} fill="none" stroke="#39B6FF" strokeWidth={4} opacity={0.55 * (1 - p) * ease(frame, movingAt, 20) * (1 - ease(frame, malesAt, 12))} />;
        })}
        <circle cx={lureX} cy={lureY} r={(40 + 8 * Math.sin(frame / 7)) * (1 + 0.8 * lureHi)} fill="#39B6FF" opacity={0.28 + 0.2 * lureHi} />
        <circle cx={lureX} cy={lureY} r={15 * (1 + 0.5 * lureHi)} fill="#BFEFFF" />
        {/* "Things come to look": three small fish, heads toward the light */}
        {prey.map((p, i) => {
          const on = ease(frame, thingsAt + p.d, 14) * (1 - ease(frame, malesAt, 10));
          const px = p.x + 300 * (1 - ease(frame, thingsAt + p.d, 50));
          return (
            <g key={i} transform={`translate(${px} ${herY + p.dy + 6 * Math.sin(frame / 10 + i * 2)}) scale(1.6)`} opacity={on}>
              <path d={PREY_BODY} fill={B.mute} />
              <path d={PREY_TAIL} fill={B.mute} transform={`rotate(${10 * Math.sin(frame / 4 + i)} 28 0)`} />
            </g>
          );
        })}
        {/* her 20 cm, drawn under her on "And the males?"; his 2.8 cm under him; then his length seven times along hers */}
        <g opacity={bars}>
          <line x1={HER_X - 300} y1={barY} x2={HER_X - 300 + HER_LEN * ease(frame, malesAt + 10, 24)} y2={barY} stroke="rgba(255,255,255,0.4)" strokeWidth={8} strokeLinecap="round" />
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i} x1={HER_X - 300 + (i * HER_LEN) / 7 + 3} y1={barY} x2={HER_X - 300 + ((i + 1) * HER_LEN) / 7 - 3} y2={barY} stroke={i % 2 ? B.paper : B.gauge} strokeWidth={8} opacity={ease(frame, seventhAt + i * 5, 6)} />
          ))}
          <line x1={1150 - HIS_LEN / 2} y1={barY} x2={1150 + HIS_LEN / 2} y2={barY} stroke={B.gauge} strokeWidth={8} opacity={ease(frame, aboutAt + 20, 10)} />
        </g>
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${hisX}px ${hisY}px, rgba(2,6,11,0) ${80 + 30 * Math.sin(frame / 6)}px, rgba(2,6,11,0.94) ${300 + 60 * Math.sin(frame / 6)}px)`, opacity: dark * stage }} />
      {/* him, to her scale (2.8 cm to her 20 cm, #1): no lure, no glow. He turns into part of her on "fuses into her body". */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: stage * him }}>
        {ringNoLure < 0 ? null : <circle cx={hisX} cy={hisY} r={40 + 60 * ringNoLure} fill="none" stroke={B.paper} strokeWidth={4} opacity={1 - ringNoLure} />}
        {ringLatch < 0 ? null : <circle cx={hisX - 30} cy={hisY - 4} r={20 + 70 * ringLatch} fill="none" stroke={B.gauge} strokeWidth={5} opacity={1 - ringLatch} />}
        <g transform={`translate(${hisX} ${hisY}) scale(${1 - 0.15 * fuse})`}>
          <path d={`M ${HIS_LEN / 2 - 16} 0 L ${HIS_LEN / 2} -11 L ${HIS_LEN / 2} 11 Z`} fill={interpolateColors(fuse, [0, 1], ["#6C7F92", "#14364F"])} transform={`rotate(${12 * Math.sin(frame / 4) * (1 - home)} ${HIS_LEN / 2 - 16} 0)`} />
          <ellipse cx={-6} cy={0} rx={HIS_LEN / 2 - 6} ry={13} fill={interpolateColors(fuse, [0, 1], ["#6C7F92", "#14364F"])} stroke={interpolateColors(fuse, [0, 1], ["#BFD0E0", "#2E6E9E"])} strokeWidth={3} />
          <circle cx={-24} cy={-3} r={3} fill="#050E18" opacity={1 - fuse} />
        </g>
      </svg>
      {/* bar labels (28 px), on the dark under the two animals: y herY+172 = 832-868. No numbers here: the card has them, with ≈ (A8) */}
      <Tag x={HER_X - 300} y={barY + 10} opacity={stage * bars} color={B.paper} size={28}>her</Tag>
      <Tag x={500} y={barY + 10} opacity={stage * bars * ease(frame, seventhAt, 10)} color={B.gauge} size={28}>a seventh of her length</Tag>
      <Tag x={1150 - HIS_LEN / 2} y={barY + 10} opacity={stage * bars * ease(frame, aboutAt + 20, 10)} color={B.gauge} size={28}>him</Tag>
      {/* once he has found her he is easy to lose against her: a tag under him (x ~635-710, y herY+150 to +185) until "Two animals..." */}
      <Tag x={hisX - 22} y={hisY + 22} opacity={stage * home * (1 - ease(frame, twoAt7, 12))} color={B.gauge} size={28}>him</Tag>
      {/* S1 (fix run 1): he is 74 px long, so what happens to him did not register. On "He latches on" a lens opens
          to his right (circle x 888-1112, y 723-947) and shows him at 3×, under her belly: he wriggles, then on "fuses
          into her body" sinks into her and takes her colour, the seam closes, and on "one bloodstream" her blood runs
          into him. */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: stage * lens }}>
        <defs>
          <clipPath id="l02-lure-lens">
            <circle cx={1000} cy={835} r={109} />
          </clipPath>
        </defs>
        <line x1={hisX + 40} y1={hisY - 6} x2={912} y2={770} stroke={B.gauge} strokeWidth={3} />
        <line x1={hisX + 40} y1={hisY + 10} x2={912} y2={900} stroke={B.gauge} strokeWidth={3} />
        <circle cx={1000} cy={835} r={112 * (0.6 + 0.4 * lens)} fill="#06121F" stroke={B.gauge} strokeWidth={5} />
        <g clipPath="url(#l02-lure-lens)">
          <path d="M 860 700 L 1140 700 L 1140 792 C 1070 812, 930 812, 860 792 Z" fill="#1D4F72" stroke="#2E6E9E" strokeWidth={5} />
          <g transform={`translate(1000 ${852 - 30 * fuse}) scale(${3 * (1 + 0.12 * bump(frame, latchAt + 14, 6, 16)) * (1 - 0.12 * fuse)})`}>
            <path d={`M ${HIS_LEN / 2 - 16} 0 L ${HIS_LEN / 2} -11 L ${HIS_LEN / 2} 11 Z`} fill={interpolateColors(fuse, [0, 1], ["#6C7F92", "#1D4F72"])} stroke={interpolateColors(fuse, [0, 1], ["#BFD0E0", "#2E6E9E"])} strokeWidth={1.5} transform={`rotate(${14 * Math.sin(frame / 4) * (1 - fuse)} ${HIS_LEN / 2 - 16} 0)`} />
            <ellipse cx={-6} cy={0} rx={HIS_LEN / 2 - 6} ry={13} fill={interpolateColors(fuse, [0, 1], ["#6C7F92", "#1D4F72"])} stroke={interpolateColors(fuse, [0, 1], ["#BFD0E0", "#2E6E9E"])} strokeWidth={1.5} />
            <circle cx={-24} cy={-3} r={3} fill="#050E18" opacity={1 - fuse} />
          </g>
          {/* the seam between them closes */}
          <ellipse cx={985} cy={806} rx={76 * fuse} ry={18 * fuse} fill="#1D4F72" />
          {/* "one bloodstream" (#31) */}
          <path d="M 930 720 C 950 770, 985 790, 990 842" stroke="#E8322B" strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray="18 14" strokeDashoffset={-frame * 2.5} opacity={ease(frame, bloodAt, 12)} />
        </g>
        <circle cx={1000} cy={835} r={112} fill="none" stroke={B.gauge} strokeWidth={5} opacity={lens} />
      </svg>
      {/* A5 (fix run 1): the real animal stays in view while the story is drawn - the footballfish photo again, at
          320×240 (its source is 600×450), top right at x 1096-1416, y 336-576: right of every card (the widest ends at
          x≈1040), above the lights on that side (from y≈579), the fish that come to look (from y≈588), the wandering
          male (from y≈607) and the lens (from y 723); the lure's rings stop at x≈1090. Its tag is on the picture. */}
      <div style={{ position: "absolute", left: 1096, top: 336, width: 320, height: 240, borderRadius: 14, overflow: "hidden", outline: `3px solid ${B.paper}`, boxShadow: "0 10px 30px rgba(0,0,0,0.6)", opacity: realOne }}>
        <Img src={staticFile("assets/footballfish-noaa.jpg")} style={{ width: 320, height: 240, objectFit: "cover" }} />
        <div style={{ position: "absolute", right: 6, bottom: 6, padding: "5px 10px", borderRadius: 10, background: "rgba(5,14,24,0.84)", fontFamily: F.ui, fontWeight: 800, fontSize: 22, lineHeight: "26px", letterSpacing: 1.2, color: B.paper, textTransform: "uppercase", whiteSpace: "nowrap", textAlign: "right" }}>
          a real one
          <br />
          NOAA, 2002
        </div>
      </div>

      {/* she is not the only one glowing (source #1: NOAA ≈90 % of pelagic animals) - on "ninety percent", above the lights */}
      <div style={{ position: "absolute", left: 160, top: 336, opacity: ease(frame, ninetyAt, 12) * (1 - ease(frame, waitAt, 8)), transform: `scale(${1 + 0.08 * bump(frame, ninetyAt, 6, 14)})`, transformOrigin: "left top", ...cardBox(64, "#BFEFFF") }}>
        {/* x 160-~800, y 336-484: the small print is on two rows so the card ends left of the still lure (x 852) and the inset photo */}
        <div>≈ 90 % glow</div>
        <div style={{ ...cardSmall(64), marginTop: 4, lineHeight: "29px" }}>
          OF THE ANIMALS IN THE OPEN WATER COLUMN
          <br />
          MAKE THEIR OWN LIGHT · NOAA
        </div>
      </div>
      {/* each sentence gets its half: "a light is not strange." / "A light that hangs still is." */}
      <div style={{ opacity: ease(frame, hereAt, 10) * (1 - ease(frame, waitAt, 8)) }}>
        <CaptionPop bottom={150} size={78} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>a light is not strange.</span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, stillAt, 8) }}>
            a light that <span style={{ color: B.gauge }}>hangs still</span> is.
          </span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, thingsAt, 10) * (1 - ease(frame, malesAt, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>things come to look.</span>
          <br />
          <span style={{ color: B.gauge, whiteSpace: "nowrap", opacity: ease(frame, sheAt, 8) }}>she doesn't move.</span>
        </CaptionPop>
      </div>

      {/* the card slot (x 160-, y 340-470): the sizes on "About two point eight centimetres" (the second row opens on
          "He has no lure at all, and he doesn't glow"), then the question, then the answer */}
      <div style={{ position: "absolute", left: 160, top: 340, opacity: ease(frame, aboutAt, 12) * (1 - ease(frame, problemAt, 8)), ...cardBox(72) }}>
        <div>her: ≈ 20 cm · him: ≈ 2.8 cm</div>
        <div style={{ ...cardSmall(72), height: 35 * ease(frame, noLureAt, 10), lineHeight: "35px", overflow: "hidden", opacity: ease(frame, noLureAt, 10) }}>HE HAS NO LURE AND DOES NOT GLOW</div>
      </div>
      <div style={{ position: "absolute", left: 160, top: 340, opacity: ease(frame, findAt, 10) * (1 - ease(frame, onceAt - 6, 6)) }}>
        <NumberCard x={0} y={0} big="how does he ever find her?" size={64} color={B.paper} />
      </div>
      {/* A7 (fix run 1): the hedge is in the big line (42 px; it was a 20 px small row). The small row (24 px) opens on
          "fuses into her body" and grows; complete, it is ≈ 51 characters ≈ 810 px, so the card ends at x≈1020-1040,
          left of the inset photo (x 1096). Card y 340-440. */}
      <div style={{ position: "absolute", left: 160, top: 340, opacity: ease(frame, onceAt, 12) * (1 - ease(frame, teaseAt, 8)), ...cardBox(42, B.paper) }}>
        <div>in some species: he finds her once. then he stays.</div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: 1, whiteSpace: "nowrap", lineHeight: "30px", height: 30 * ease(frame, fusesAt, 10), marginTop: 6 * ease(frame, fusesAt, 10), overflow: "hidden", opacity: ease(frame, fusesAt, 10) }}>
          HE FUSES INTO HER BODY
          {frame > bloodAt ? <span style={{ opacity: ease(frame, bloodAt, 8) }}> · ONE BLOODSTREAM</span> : null}
          {frame > oneLureAt ? <span style={{ opacity: ease(frame, oneLureAt, 8) }}> · ONE LURE</span> : null}
        </div>
      </div>

      {/* the tease, over the photo again: one line per sentence, the second waits for "Type two" */}
      <div style={{ opacity: ease(frame, teaseAt + 6, 8) }}>
        <CaptionPop bottom={150} size={64} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>type one: make the food come to you</span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, twoAt, 8) }}>
            type two takes the same idea — and <span style={{ color: B.gauge }}>cheats</span>
          </span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * 2 · The Red Torch. Lines 0-5 (draft 3 merged old lines 0+1 into 0; old 2-6 → 1-5). Sources #2, #19, #27. Plate: NOAA loosejaw still; the beam is drawn.
 * 0 "Nearly every light in the deep sea is blue. Blue travels best through water, and blue is what deep-sea eyes evolved to see. Which means... red light is effectively invisible: most animals simply cannot see it."
 * 1 "Three kinds of dragonfish — loose-jawed hunters called Malacosteus, Aristostomias and Pachystomias — have a second light under each eye that shines far-red, beyond seven hundred nanometres."
 * 2 "And they are among the very few animals down there that can see it." 3 "So picture it. A hunter with a torch that only it can see, sweeping a beam across the dark, lighting up prey that has no idea it is lit."
 * 4 "One of them, Malacosteus, sees its own red light using a pigment related to chlorophyll... which it seems to get from its food. A predator, a kilometre down, seeing by borrowed plant chemistry." 5 tease
 *
 * Motion pass 2026-10-01. The plate is a 1956×504 strip, already upscaled 2.1× to fill the frame: the camera only travels
 * along it (constant 1.12), it never pushes in. Lines 0-3 are a drawing over it (chip: ILLUSTRATION): the spectrum
 * builds as it is described and a deep-sea eye answers blue light but not red; the three names arrive one at a time
 * over a drawn head whose lamp lights under the eye; the beam then sweeps, and prey shows only where it falls.
 * Line 4 is the photo itself, brighter - it is a Malacosteus (#27) - with the pigment story in the narration's own words.
 */
export const RedTorch: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const barAt = lineAt(t, 0);
  const blueAt = within(t, 0, 0.16); // "...is blue."
  const travelsAt = within(t, 0, 0.2); // "Blue travels best through water"
  const eyesAt = within(t, 0, 0.35); // "and blue is what deep-sea eyes evolved to see"
  const redLightAt = within(t, 0, 0.67); // "red light is effectively invisible"
  const mostAt = within(t, 0, 0.84); // "most animals simply cannot see it"
  const threeAt = lineAt(t, 1);
  const looseAt = within(t, 1, 0.13); // "loose-jawed hunters called..."
  const names = [within(t, 1, 0.27), within(t, 1, 0.36), within(t, 1, 0.47)]; // Malacosteus / Aristostomias / Pachystomias
  const lampAt = within(t, 1, 0.57); // "have a second light under each eye"
  const farAt = within(t, 1, 0.74); // "that shines far-red"
  const beyondAt = within(t, 1, 0.84); // "beyond seven hundred nanometres"
  const canSeeAt = within(t, 2, 0.7); // "...that can see it."
  const beamAt = lineAt(t, 3);
  const hunterAt = within(t, 3, 0.11); // "A hunter with a torch that only it can see"
  const sweepAt = within(t, 3, 0.43); // "sweeping a beam across the dark"
  const litAt = within(t, 3, 0.68); // "lighting up prey"
  const noIdeaAt = within(t, 3, 0.85); // "that has no idea it is lit"
  const chloroAt = lineAt(t, 4);
  const seesAt = within(t, 4, 0.14); // "sees its own red light"
  const usingAt = within(t, 4, 0.24); // "using a pigment related to"
  const chlAt = within(t, 4, 0.36); // "chlorophyll"
  const greenAt = within(t, 4, 0.42); // "the green stuff in plants"
  const seemsAt = within(t, 4, 0.55); // "which it seems to get from its food"
  const predatorAt = within(t, 4, 0.71); // "A predator, a kilometre down"
  const borrowedAt = within(t, 4, 0.84); // "seeing by borrowed plant chemistry"
  const teaseAt = lineAt(t, 5);
  const nextAt = within(t, 5, 0.17); // "The next one doesn't bother with light at all."
  const betsAt = within(t, 5, 0.67); // "It bets everything on one bite."

  const spectrum = ease(frame, barAt, 12) * (1 - ease(frame, beamAt, 10));
  const wipe = ease(frame, barAt, 30);
  const tracks = ease(frame, travelsAt, 10) * (1 - ease(frame, threeAt, 10));
  const head = ease(frame, lampAt - 16, 14) * (1 - ease(frame, chloroAt - 10, 10));
  const beam = ease(frame, farAt, 14) * (1 - ease(frame, chloroAt - 10, 10));
  const hunting = ease(frame, beamAt, 14) * (1 - ease(frame, chloroAt - 10, 10));
  // A4 (fix run 1): from line 4 the photo is shown whole, as a band, instead of the middle 46 % that "cover" leaves
  const band = frame >= chloroAt;
  const photoBack = ease(frame, chloroAt, 20);
  // something drawn covers the photo from the first bar (11 frames in) to the end of the beam
  const drawn = !band;
  // line 0: a blue flash and (from "red light") a red one run to a deep-sea eye; only the blue one is answered
  const bp = ((((frame - travelsAt) / 54) % 1) + 1) % 1;
  const rp = ((((frame - redLightAt) / 54 + 0.5) % 1) + 1) % 1;
  const ends = (p: number) => Math.min(1, p / 0.06, (1 - p) / 0.06);
  const seen = ease(frame, eyesAt, 12) * (bp > 0.9 ? (bp - 0.9) / 0.1 : Math.max(0, 1 - bp / 0.2));
  // the drawn head: under the names on lines 1-2, then it rides up to hunt on line 3
  const rise = smooth(frame, beamAt, beamAt + 30);
  const headX = lerp(430, 400, rise);
  const headY = lerp(800, 630, rise);
  const lamp = ease(frame, lampAt, 10);
  // the beam holds still until "sweeping", then swings ±6° about the lamp (its top edge stays under the "lit up" tag)
  const swing = frame > sweepAt ? 6 * Math.sin((frame - sweepAt) / 22) : 0;
  const apexX = headX + 30;
  const apexY = headY + 22;
  const preyFish = [
    { x: 1120, y: 560 },
    { x: 1240, y: 680 },
    { x: 1040, y: 740 },
  ];
  // the far-red label grows as line 1 names it; it is "red" for line 0
  // (A15: once "beyond 700 nm" is on, the label is only that - it ran into the blue label with a 29 px gap)
  const redLabel = frame > beyondAt ? "far-red · beyond 700 nm" : (frame < farAt ? "red" : "far-red") + " · invisible to almost everything";
  // under the drawing (lines 0-3) the dark, cropped strip only drifts sideways
  const shots: Shot[] = [
    [0, 1.12, 30, 50],
    [chloroAt, 1.12, 44, 50],
  ];
  // The band: 1956×504 contained in 1920 wide = 1920×495, placed at y 515-1010 (object-position 50% 88%). It grows 3 %
  // from its top edge over lines 4-5 (to y 515-1025), so it never rises into the cards. In it the head is on the
  // left (x < ~480, jaw down to y≈965), the body's lower edge is at y≈870 and the tail is on the right.
  const plateMove = band ? { scale: 1 + 0.03 * lin(frame, chloroAt, t.frames), origin: "50% 47.7%" } : cameraAt(frame, shots);
  // the dark crop goes to black before the switch, and the band comes up from black
  const brightness = band ? 1.1 * photoBack : (0.34 - 0.08 * hunting) * (1 - ease(frame, chloroAt - 10, 10));

  return (
    <RungShell t={t} index={1} plate={{ image: "loosejaw" }} brightness={brightness} plateMove={plateMove} plateFit={band ? "contain" : "cover"} platePosition={band ? "50% 88%" : "50% 50%"} credit={drawn ? { kind: "illustration", source: "drawn over a NOAA NEFSC photo, 2005" } : { kind: "real", source: "NOAA NEFSC · loosejaw, 1,500 m" }}>
      {/* the spectrum (bar x 160-1400, y 350-420; labels y 432-468): it wipes on, the blue band is boxed on "is blue",
          the red end (from 78 %) goes dark on "red light is effectively invisible" and its far end is boxed on "shines far-red". The bar is
          position:relative so the shade stays inside it and never dims the labels below. */}
      <div style={{ position: "absolute", left: 160, top: 350, width: 1240, opacity: spectrum }}>
        <div style={{ position: "relative", height: 70, borderRadius: 35, overflow: "hidden", clipPath: wipe < 1 ? `inset(-4px ${(1 - wipe) * 100}% -4px -4px)` : undefined, outline: "3px solid rgba(255,255,255,0.5)", background: "linear-gradient(90deg, #6A5AE0 0%, #39B6FF 30%, #66D66E 50%, #FFE14D 62%, #FF9A2E 72%, #E8322B 84%, #6A0A0A 100%)" }}>
          <div style={{ position: "absolute", left: "19%", width: "22%", top: 0, bottom: 0, background: "#FFFFFF", opacity: 0.4 * Math.max(bump(frame, blueAt, 6, 20), seen) }} />
          <div style={{ position: "absolute", left: "78%", top: 0, bottom: 0, right: 0, background: "rgba(5,14,24,0.85)", opacity: ease(frame, redLightAt, 12) }} />
        </div>
        <div style={{ position: "absolute", left: "19%", width: "22%", top: -8, height: 86, boxSizing: "border-box", border: "5px solid #BFEFFF", borderRadius: 16, opacity: ease(frame, blueAt, 8) }} />
        <div style={{ position: "absolute", left: "88%", right: -8, top: -8, height: 86, boxSizing: "border-box", border: `5px solid ${B.tease}`, borderRadius: 16, opacity: ease(frame, farAt, 8) * (0.7 + 0.3 * Math.sin(frame / 6)) }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: F.ui, fontWeight: 800, fontSize: 28, color: B.paper, whiteSpace: "nowrap" }}>
          <span style={{ color: "#39B6FF", opacity: ease(frame, blueAt, 8) }}>
            blue
            {frame > eyesAt ? <span style={{ opacity: ease(frame, eyesAt, 8) }}> · what deep-sea eyes see</span> : null}
          </span>
          <span style={{ color: B.tease, opacity: ease(frame, redLightAt, 10) }}>{redLabel}</span>
        </div>
      </div>
      {/* line 0 under the bar (y 505-720): the blue flash runs the whole track, again and again, and the eye answers it;
          the red one arrives and nothing happens */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: tracks }}>
        <line x1={200} y1={560} x2={1180} y2={560} stroke="rgba(57,182,255,0.25)" strokeWidth={4} />
        <line x1={Math.max(200, 200 + 980 * bp - 140)} y1={560} x2={200 + 980 * bp} y2={560} stroke="#39B6FF" strokeWidth={12} strokeLinecap="round" opacity={0.7 * ends(bp)} />
        <circle cx={200 + 980 * bp} cy={560} r={16} fill="#BFEFFF" opacity={ends(bp)} />
        <g opacity={ease(frame, redLightAt, 10)}>
          <line x1={200} y1={660} x2={1180} y2={660} stroke="rgba(232,50,43,0.3)" strokeWidth={4} />
          <line x1={Math.max(200, 200 + 980 * rp - 140)} y1={660} x2={200 + 980 * rp} y2={660} stroke="#E8322B" strokeWidth={12} strokeLinecap="round" opacity={0.75 * ends(rp)} />
          <circle cx={200 + 980 * rp} cy={660} r={16} fill="#FF8A80" opacity={ends(rp)} />
          <g opacity={ease(frame, mostAt, 8)} stroke={B.tease} strokeWidth={7} strokeLinecap="round">
            <line x1={1191} y1={646} x2={1219} y2={674} />
            <line x1={1219} y1={646} x2={1191} y2={674} />
          </g>
        </g>
        <g transform="translate(1300 610)" opacity={ease(frame, eyesAt, 12)}>
          <path d="M -75 0 C -40 -48, 40 -48, 75 0 C 40 48, -40 48, -75 0 Z" fill="#0B1B2B" stroke="#BFD0E0" strokeWidth={4} />
          <circle cx={0} cy={0} r={28 + 5 * seen} fill={interpolateColors(seen, [0, 1], ["#1E3348", "#39B6FF"])} />
          <circle cx={0} cy={0} r={11} fill="#050E18" />
        </g>
      </svg>
      <Tag x={200} y={505} opacity={tracks} color="#39B6FF" size={26}>blue travels best through water</Tag>
      <Tag x={1300} y={504} opacity={tracks * ease(frame, eyesAt, 12)} color={B.paper} size={26} align="center">a deep-sea eye</Tag>
      <Tag x={200} y={688} opacity={tracks * ease(frame, mostAt, 10)} color={B.tease} size={26}>most animals cannot see it</Tag>

      {/* lines 1-2 under the bar: the sentence grows as it is said (later parts keep their place, unseen), and the
          three names arrive one at a time (cards y 552-620) */}
      <div style={{ position: "absolute", left: 160, top: 486, fontFamily: F.caption, fontSize: 44, color: B.paper, whiteSpace: "nowrap", opacity: spectrum * ease(frame, looseAt, 10) }}>
        three loose-jawed dragonfish
        <span style={{ opacity: ease(frame, farAt, 8) }}> shine it</span>
        <span style={{ color: B.tease, opacity: ease(frame, canSeeAt, 8) }}> — and can see it</span>
      </div>
      <div style={{ position: "absolute", left: 160, top: 552, display: "flex", gap: 18, opacity: spectrum }}>
        {["Malacosteus", "Aristostomias", "Pachystomias"].map((n, i) => (
          <div key={n} style={{ ...cardBox(46, B.paper), opacity: ease(frame, names[i], 8), transform: `scale(${1 + 0.12 * bump(frame, names[i], 5, 14)})` }}>
            {n}
          </div>
        ))}
      </div>
      <Tag x={170} y={640} opacity={ease(frame, lampAt, 10) * (1 - ease(frame, beamAt, 8))} color="#FF8A80" size={28}>a second light under each eye</Tag>

      {/* the hunter, drawn: a head with the lamp under its eye (lines 1-2: x 100-580, y 700-900; line 3: y 530-730),
          its far-red beam (ends x ≤ 1390), and on line 3 the prey, which shows only where the beam falls */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g opacity={beam} transform={`rotate(${swing} ${apexX} ${apexY})`}>
          <path d={`M ${apexX} ${apexY} L ${apexX + 930} ${apexY - 130} L ${apexX + 930} ${apexY + 130} Z`} fill="#B3121F" opacity={0.36} />
          <path d={`M ${apexX} ${apexY} L ${apexX + 930} ${apexY - 55} L ${apexX + 930} ${apexY + 55} Z`} fill="#E8322B" opacity={0.36 + 0.08 * Math.sin(frame / 5)} />
        </g>
        {preyFish.map((p, i) => {
          const off = Math.abs((Math.atan2(p.y - apexY, p.x - apexX) * 180) / Math.PI - swing);
          const inBeam = Math.max(0, 1 - off / 8);
          return (
            <g key={i} transform={`translate(${p.x + 12 * Math.sin(frame / 40 + i * 2)} ${p.y + 8 * Math.sin(frame / 29 + i)}) scale(-1.5 1.5)`} opacity={hunting * (0.1 + 0.9 * inBeam)}>
              <path d={PREY_BODY} fill="#FF8A80" />
              <path d={PREY_TAIL} fill="#FF8A80" />
              <circle cx={-16} cy={-2} r={3} fill="#050E18" />
            </g>
          );
        })}
        <g transform={`translate(${headX} ${headY})`} opacity={head}>
          <path d="M -330 -34 C -200 -92, 20 -100, 100 -44 C 124 -26, 128 -6, 120 8 C 40 34, -120 52, -330 58 Z" fill="#141C26" stroke="#8CA0B3" strokeWidth={3} />
          <path d="M -160 60 L 150 88" stroke="#8CA0B3" strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* the loose lower jaw and its fangs */}
          {[-110, -60, -10, 40, 90].map((x) => (
            <path key={x} d={`M ${x} ${61 + (x + 160) * 0.09} l 6 -20 l 6 21`} fill="none" stroke="#BFD0E0" strokeWidth={3} strokeLinejoin="round" />
          ))}
          {/* a plain grey disc for the eye (a white eye with a pupil read as a cartoon) */}
          <circle cx={0} cy={-30} r={20} fill="#8CA0B3" />
          <circle cx={0} cy={-30} r={27 + 6 * bump(frame, canSeeAt, 8, 30)} fill="none" stroke="#E8322B" strokeWidth={6} opacity={ease(frame, canSeeAt, 8)} />
          <circle cx={6} cy={22} r={(34 + 6 * Math.sin(frame / 6)) * (1 + 0.5 * bump(frame, lampAt, 8, 24))} fill="#E8322B" opacity={0.35 * lamp} />
          <ellipse cx={6} cy={22} rx={24} ry={12} fill={interpolateColors(lamp, [0, 1], ["#4A1513", "#FF4A3D"])} stroke="#8CA0B3" strokeWidth={2} />
        </g>
      </svg>
      <Tag x={150} y={470} opacity={hunting * ease(frame, hunterAt, 10)} color={B.tease} size={34}>a torch only the hunter can see</Tag>
      <Tag x={960} y={372} opacity={hunting * ease(frame, litAt, 10)} color={B.paper} size={30}>
        lit up
        {frame > noIdeaAt ? <span style={{ opacity: ease(frame, noIdeaAt, 8) }}> · and has no idea</span> : null}
      </Tag>

      {/* Line 4 is the photo itself (it is a Malacosteus, #27), whole, as a band at y 515-1010. Nothing sits on the fish:
          the note is on the problem-strip row (x 1050-~1415, y 247-323), the story - in the narration's words, a card
          per clause, 40 px - is in the dark above the band: "sees…" x 160-~555 and "using…chlorophyll" x 568-~1220 on
          one row (y 336-433), "which it seems…" under them (x 160-~765, y 445-507). "seems" is the narration's hedge.
          A10: the second card arrives complete, on "chlorophyll". A2: its small row has 8 px of air above it. */}
      <div style={{ position: "absolute", left: 1050, top: 247, opacity: ease(frame, chloroAt + 8, 10), padding: "8px 18px", borderRadius: 18, background: "rgba(5,14,24,0.82)", fontFamily: F.ui, fontWeight: 800, fontSize: 22, lineHeight: "30px", letterSpacing: 1.5, color: B.paper, textTransform: "uppercase", whiteSpace: "nowrap" }}>
        the photo: Malacosteus,
        <br />
        one of the three
      </div>
      <div style={{ position: "absolute", left: 160, top: 336, opacity: 1 - ease(frame, teaseAt, 8) }}>
        <div style={{ ...cardBox(40, B.paper), position: "absolute", left: 0, top: 0, opacity: ease(frame, seesAt, 10) }}>sees its own red light</div>
        <div style={{ ...cardBox(40, B.paper), position: "absolute", left: 408, top: 0, opacity: ease(frame, chlAt, 10) }}>
          <div>
            using a pigment related to <span style={{ color: "#17803A" }}>chlorophyll</span>
          </div>
          <div style={{ ...cardSmall(60), height: 27 * ease(frame, greenAt, 10), marginTop: 8 * ease(frame, greenAt, 10), lineHeight: "27px", overflow: "hidden", opacity: ease(frame, greenAt, 10) }}>CHLOROPHYLL: THE GREEN STUFF IN PLANTS</div>
        </div>
        <div style={{ ...cardBox(40, B.paper), position: "absolute", left: 0, top: 109, opacity: ease(frame, seemsAt, 10) }}>which it seems to get from its food</div>
      </div>
      {/* on the tray under the body and right of the jaw (56 px, x ≈ 520-1420, y ≈ 907-970; chip from y 998) */}
      <div style={{ opacity: ease(frame, borrowedAt, 10) * (1 - ease(frame, teaseAt, 8)) }}>
        <CaptionPop bottom={110} size={56} color={B.paper}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap", transform: "translateX(140px)" }}>
            seeing by <span style={{ color: B.gauge }}>borrowed plant chemistry</span>
          </span>
        </CaptionPop>
      </div>
      {/* the tease takes the dark space the cards have left (y ≈ 357-500), not the fish */}
      <div style={{ opacity: ease(frame, nextAt, 8) }}>
        <CaptionPop bottom={580} size={64} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>next: no light at all.</span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, betsAt, 8) }}>
            it bets everything on <span style={{ color: B.gauge }}>one bite</span>
          </span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * 3 · The Trap Mouth. Lines 0-4. Source #3. Plate: the NOAA pelican-eel photo (Journey into Midnight, June 2019), full size (3008×2554).
 * 0 "If a meal comes past once a week, you cannot afford to miss it. The gulper eel's answer: a mouth that cannot miss."
 * 1 "Its lower jaw is estimated to be a quarter the length of its entire body. It opens like a net and expands into a pouch — the same reason it's also called the pelican eel."
 * 2 "The rest of the animal is almost an afterthought: a thin tail, small eyes, a body that is barely there. Everything the eel is has been spent on... never letting a meal get away."
 * 3 "And its skin is among the blackest in the ocean. When scientists on a NOAA expedition caught one in 2019, they measured it. A mouth with a shadow attached." 4 tease
 *
 * Motion pass 2026-10-01. The photo is large enough for the camera to go to 1.5: it opens on the tail and pulls back, goes in on the mouth when it is named,
 * across to the tail and along the body on line 2 (the photo alone, REAL FOOTAGE), close on the skin on line 3, the
 * whole animal for "A mouth with a shadow attached". In the frame at scale 1: snout ≈ (10, 415), black head and pouch
 * bottom left, body ≈ (660, 705) to (1400, 925), tail up the right side under the gauge, filament ≈ (1660, 265) to
 * (1380, 785). The drawing on line 1 measures first, then opens, then inflates, and its measures sit below the pouch.
 * The line-3 wording and date are unchanged (#3: measured on the June 2019 expedition).
 */
export const TrapMouth: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const eelAt = within(t, 0, 0.56); // "The gulper eel's answer:"
  const missAt = within(t, 0, 0.78); // "a mouth that cannot miss"
  const jawAt = lineAt(t, 1);
  const quarterAt = within(t, 1, 0.19); // "a quarter the length"
  const entireAt = within(t, 1, 0.33); // "of its entire body"
  const opensAt = within(t, 1, 0.44); // "It opens like a net"
  const expandsAt = within(t, 1, 0.56); // "and expands into a pouch"
  const alsoAt = within(t, 1, 0.8); // "...it's also called the pelican eel"
  const restAt = lineAt(t, 2);
  const tailAt = within(t, 2, 0.23); // "a thin tail"
  const bodyAt = within(t, 2, 0.35); // "a body that is barely there"
  const everythingAt = within(t, 2, 0.48); // "Everything the eel is has been spent on..."
  const neverAt = within(t, 2, 0.86); // "never letting a meal get away"
  const blackAt = lineAt(t, 3);
  const blackestAt = within(t, 3, 0.1); // "among the blackest in the ocean"
  const scientistsAt = within(t, 3, 0.32); // "When scientists on a NOAA expedition caught one in 2019"
  const measuredAt = within(t, 3, 0.68); // "they measured it"
  const shadowAt = within(t, 3, 0.8); // "A mouth with a shadow attached."
  const teaseAt = lineAt(t, 4);
  const disappearsAt = within(t, 4, 0.84); // "it disappears"

  // the drawing is up for line 1 only; line 2 goes back to the photo
  const jaw = ease(frame, jawAt, 14) * (1 - ease(frame, restAt, 10));
  const measures = 1 - ease(frame, restAt, 8);
  const gape = ease(frame, opensAt, 16);
  const pouch = ease(frame, expandsAt, 30);
  // the mouth: closed, then open like a net, then blown out into a pouch (y 610 ± 135 at its fullest)
  const up1 = 36 + 44 * gape + 80 * pouch;
  const up2 = 42 + 58 * gape + 100 * pouch;
  const lip = (u: number) => [cubic(0, 40, 220, 300, u), cubic(0, -up1, -up2, 0, u)];
  const eye = lip(0.1);
  const sway = 9 * Math.sin(frame / 20);
  const sway2 = 7 * Math.sin(frame / 27 + 1);
  const row3 = ease(frame, scientistsAt, 10);
  const shots: Shot[] = [
    [0, 1.3, 100, 15],
    [20, 1.3, 100, 15],
    [eelAt, 1.05, 50, 45, "move"], // "If a meal comes past once a week...": from the tail, back until the whole animal is in frame
    [eelAt + 40, 1.38, 0, 42, "move"], // "The gulper eel's answer: a mouth that cannot miss": in on the mouth
    [jawAt - 4, 1.42, 0, 42],
    [jawAt + 30, 1, 50, 45, "move"], // wide and dim behind the drawing
    [restAt, 1.03, 50, 45],
    [restAt + 45, 1.46, 100, 100, "move"], // "The rest of the animal is almost an afterthought: a thin tail": across to the tail
    [bodyAt, 1.5, 100, 100],
    [bodyAt + 40, 1.4, 50, 100, "move"], // "a body that is barely there": back along the body
    [everythingAt + 16, 1.42, 50, 100],
    [everythingAt + 60, 1.45, 0, 60, "move"], // "...the one thing that matters at this depth": to the mouth again
    [blackAt, 1.48, 0, 60],
    [blackAt + 40, 1.5, 26, 78, "move"], // "its skin is among the blackest in the ocean": close on the skin
    [measuredAt, 1.5, 30, 78],
    [measuredAt + 28, 1.5, 8, 64, "move"], // "they measured it": along the skin, towards the head (B3: this was a swelling black swatch)
    [shadowAt, 1.5, 8, 64],
    [shadowAt + 45, 1.05, 50, 45, "move"], // "A mouth with a shadow attached": the whole animal
    [teaseAt, 1.07, 50, 45],
    [t.frames, 1.16, 50, 45],
  ];

  return (
    <RungShell t={t} index={2} plate={{ image: "pelican-eel" }} brightness={0.75 - 0.5 * jaw - 0.3 * ease(frame, disappearsAt, 30)} plateMove={cameraAt(frame, shots)} credit={jaw > 0.5 ? { kind: "illustration", source: "drawn over a NOAA Ocean Exploration photo, 2019" } : { kind: "real", source: "NOAA Ocean Exploration · Journey into Midnight, 2019" }}>
      {/* line 0, on the photo: the caption lands as the camera reaches the mouth */}
      <div style={{ opacity: ease(frame, missAt, 10) * (1 - ease(frame, jawAt, 8)) }}>
        <CaptionPop bottom={150} size={88} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            a mouth that <span style={{ color: B.gauge }}>cannot miss</span>
          </span>
        </CaptionPop>
      </div>

      {/* the eel, to proportion: a body 4 units long, a jaw 1 unit (x 240-540 of 240-1420). The body sways; the mouth
          opens on "opens like a net" (mesh), then inflates on "expands into a pouch" (y 475-745). Small eye by the snout. */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: jaw }}>
        <g transform="translate(240 610)">
          <path d={`M0 0 C 200 ${-20 + sway}, 500 ${20 - sway}, 800 ${-10 + sway2} C 1000 ${-30 - sway2}, 1100 ${20 + sway}, 1180 ${sway2}`} stroke="#3A4A5C" strokeWidth={26} fill="none" strokeLinecap="round" />
          <path d={`M0 0 C 200 ${-20 + sway}, 500 ${20 - sway}, 800 ${-10 + sway2} C 1000 ${-30 - sway2}, 1100 ${20 + sway}, 1180 ${sway2}`} stroke="#8CA0B3" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d={`M0 0 C 40 ${-up1}, 220 ${-up2}, 300 0 C 220 ${up2}, 40 ${up1}, 0 0 Z`} fill="#141C26" stroke="#BFD0E0" strokeWidth={4} />
          {/* the net: chords and two inner arcs, clearest while the mouth is only open, fainter once it is a pouch */}
          <g stroke="#BFD0E0" strokeWidth={2} fill="none" opacity={0.7 * gape * (1 - 0.6 * pouch)}>
            {[0.2, 0.35, 0.5, 0.65, 0.8].map((u) => {
              const [x, y] = lip(u);
              return <line key={u} x1={x} y1={y} x2={x} y2={-y} />;
            })}
            <path d={`M0 0 C 40 ${-up1 / 2}, 220 ${-up2 / 2}, 300 0`} />
            <path d={`M0 0 C 40 ${up1 / 2}, 220 ${up2 / 2}, 300 0`} />
          </g>
          <circle cx={eye[0] + 8} cy={eye[1] + 9} r={6} fill="#F3E9F5" />
          {/* the measures, under the pouch: the jaw's length (y 760), then the whole animal (y 810) with the jaw's
              length stepped along it four times on "a quarter" */}
          <g opacity={measures}>
            <line x1={0} y1={150} x2={300 * ease(frame, jawAt + 4, 20)} y2={150} stroke={B.gauge} strokeWidth={8} strokeLinecap="round" />
            <line x1={0} y1={200} x2={1180 * ease(frame, jawAt + 30, 26)} y2={200} stroke="rgba(255,255,255,0.45)" strokeWidth={6} strokeLinecap="round" />
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={i * 295 + 4} y1={200} x2={(i + 1) * 295 - 4} y2={200} stroke={i === 0 ? B.gauge : B.paper} strokeWidth={8} opacity={ease(frame, quarterAt + 6 + i * 7, 6)} />
            ))}
          </g>
        </g>
      </svg>
      <Tag x={560} y={741} opacity={jaw * measures * ease(frame, quarterAt, 10)} color={B.gauge} size={34}>jaw ≈ ¼ of the body</Tag>
      <Tag x={1420} y={822} opacity={jaw * measures * ease(frame, entireAt, 10)} color={B.paper} align="right">the whole animal</Tag>
      <Tag x={600} y={400} opacity={jaw * gape} color={B.paper} size={34}>
        opens like a net
        {frame > expandsAt ? <span style={{ opacity: ease(frame, expandsAt, 8) }}> · expands into a pouch</span> : null}
      </Tag>
      <Tag x={600} y={452} opacity={jaw * ease(frame, alsoAt, 10)} color={B.gauge} size={30}>also called the pelican eel</Tag>

      {/* line 2 is the photo alone: the camera goes to the part the voice names, and a note names it beside it
          (tail framing: note on the dish, x 850-~1072, y 612-660, just left of the tip of the tail at ≈1120,645; body framing: on the dish above the body, x 640-~1120, y 420-468 - the body's upper edge is ≈65 px below it; U2: at y 470 its corner touched the body) */}
      <Pill x={850} y={612} opacity={ease(frame, tailAt, 8) * (1 - ease(frame, bodyAt - 4, 8))}>a thin tail</Pill>
      <Pill x={640} y={420} opacity={ease(frame, bodyAt + 16, 10) * (1 - ease(frame, everythingAt + 20, 8))}>a body that is barely there</Pill>
      <div style={{ opacity: ease(frame, everythingAt, 10) * (1 - ease(frame, blackAt, 8)) }}>
        <CaptionPop bottom={150} size={78} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            everything it <span style={{ color: B.gauge }}>is</span> was spent on
          </span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, neverAt, 8) }}>never missing a meal</span>
        </CaptionPop>
      </div>

      {/* line 3 (B3, fix run 1): the two swatch boxes and "its skin vs. our darkest blue" are gone - unspoken, unsourced,
          and a flat black box is not its skin. The camera is close on the real skin; the card (x 160-~960, y 336-~450)
          says only what the voice says: the first row on "among the blackest in the ocean", the measurement row on
          "When scientists on a NOAA expedition caught one in 2019". */}
      <div style={{ position: "absolute", left: 160, top: 336, opacity: ease(frame, blackestAt, 12) * (1 - ease(frame, teaseAt, 8)), padding: "16px 26px 18px", borderRadius: 20, background: "rgba(5,14,24,0.86)", fontFamily: F.caption, fontSize: 44, lineHeight: "54px", color: B.gauge, whiteSpace: "nowrap" }}>
        among the blackest in the ocean
        <div style={{ fontSize: 28, lineHeight: "36px", height: 36 * row3, overflow: "hidden", color: B.paper, opacity: 0.85 * row3 }}>measured on a NOAA expedition, 2019</div>
      </div>
      <div style={{ opacity: ease(frame, shadowAt, 10) * (1 - ease(frame, teaseAt, 8)) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            a mouth with a <span style={{ color: B.gauge }}>shadow attached</span>
          </span>
        </CaptionPop>
      </div>
      {/* the tease: the last word waits for "it disappears" - and then goes faint, as the photo sinks */}
      <div style={{ opacity: ease(frame, teaseAt + 18, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>type four goes the other way —</span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, disappearsAt, 8) * (1 - 0.55 * ease(frame, disappearsAt + 24, 30)) }}>
            it <span style={{ color: B.gauge }}>disappears</span>
          </span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};

// the drawn glass squid: mantle (tail to the left), head and arms to the right; the only opaque parts are the gland and the gills (#4)
const MANTLE = "M -330 0 C -250 -120, 150 -125, 300 -60 L 300 60 C 150 125, -250 120, -330 0 Z";

/**
 * 4 · The Glass Body. Lines 0-5. Sources #4, #24. Plate: a NOAA comb jelly (another see-through animal); the glass squid is drawn.
 * 0 "In the twilight zone there's nowhere to hide: no rock, no weed, no floor. Only water. So a whole class of animals hides in the one place left — inside the water itself, by being transparent."
 * 1 "Biologists call it hiding in plain sight, and it is especially common among animals of the open midwater, exactly where there is nothing to hide behind."
 * 2 "In 2023 a NOAA camera off Alaska filmed a glass squid, seven hundred metres down. Almost the whole animal is clear."
 * 3 "The only things you can see are what it can't make transparent: a small red digestive gland in the middle, and two pale gills either side of it. Everything else is water-coloured."
 * 4 "It is harder than it sounds. To be transparent, almost nothing inside you can scatter light — so the parts that have to be solid are kept small, and the rest is given up. It is a strategy that costs you a body." 5 tease
 *
 * Motion pass 2026-10-01. On the photo (lines 0-1, and from "a strategy that costs you a body") the camera moves on the
 * comb jelly (1720×960, so never past 1.15) and the captions arrive on their own words. Under the drawing the photo is
 * all but black and slides away to the right, so neither the jelly nor its tentacles sit behind the squid. The squid
 * swims; its outline draws on with its name, its gland and gills arrive when they are named, the outline fades on
 * "everything else is water-coloured", and on line 4 light passes straight through it except where it meets a solid part.
 */
export const GlassBody: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  // line 0: "...no rock, / no weed, / no floor. / Only water. / So a whole class of animals... / inside the water itself, / by being transparent."
  const rockAt = within(t, 0, 0.24);
  const weedAt = within(t, 0, 0.29);
  const floorAt = within(t, 0, 0.34);
  const waterAt = within(t, 0, 0.39);
  const classAt = within(t, 0, 0.45);
  const insideAt = within(t, 0, 0.75);
  const transparentAt = within(t, 0, 0.89);
  const hiddenAt = lineAt(t, 1); // "Biologists call it hiding in plain sight"
  const openAt = within(t, 1, 0.28); // "especially common among animals of the open midwater"
  const exactlyAt = within(t, 1, 0.8); // "...there is nothing to hide behind"
  const squidAt = lineAt(t, 2);
  const filmedAt = within(t, 2, 0.07); // "a NOAA camera off Alaska filmed"
  const nameAt = within(t, 2, 0.34); // "a glass squid"
  const sevenAt = within(t, 2, 0.48); // "seven hundred metres down"
  const clearAt = within(t, 2, 0.72); // "Almost the whole animal is clear."
  const partsAt = lineAt(t, 3);
  const glandAt = within(t, 3, 0.37); // "a small red digestive gland in the middle"
  const gillsAt = within(t, 3, 0.61); // "and two pale gills either side of it"
  const elseAt = within(t, 3, 0.81); // "Everything else is water-coloured."
  const costAt = lineAt(t, 4);
  const lightAt = within(t, 4, 0.14); // "To be transparent,"
  const nothingAt = within(t, 4, 0.23); // "almost nothing inside you can scatter light"
  const solidAt = within(t, 4, 0.45); // "so the parts that have to be solid"
  const smallAt = within(t, 4, 0.61); // "are kept small"
  const givenUpAt = within(t, 4, 0.69); // "and the rest is given up"
  const strategyAt = within(t, 4, 0.82); // "It is a strategy that costs you a body."
  const teaseAt = lineAt(t, 5);
  const nextAt = within(t, 5, 0.22); // "And the next one solves the food problem"
  const enormousAt = within(t, 5, 0.76); // "by being enormous"

  // the drawing is up from line 2 until "It is a strategy that costs you a body", when the photo comes back
  const squid = ease(frame, squidAt, 14) * (1 - ease(frame, strategyAt, 12));
  const draw = ease(frame, nameAt, 30);
  const big = 1 + 0.15 * smooth(frame, partsAt, partsAt + 40); // "The only things you can see...": closer
  const sx = 560 + 14 * Math.sin(frame / 61);
  const sy = 650 + 8 * Math.sin(frame / 23); // 25 px lower than before: the card above it is one row taller (B7)
  const gland = ease(frame, glandAt, 10);
  const gills = ease(frame, gillsAt, 10);
  // the outline all but goes on "Everything else is water-coloured", returns for line 4, and goes again on "the rest is given up"
  const faded = Math.max(ease(frame, elseAt, 24) * (1 - ease(frame, costAt, 20)), ease(frame, givenUpAt, 24));
  const outline = 1 - 0.78 * faded;
  const solid = 1 + 0.25 * bump(frame, solidAt, 8, 24) - 0.4 * ease(frame, smallAt, 20);
  const rays = ease(frame, lightAt, 12);
  const glint = lin(frame, clearAt, clearAt + 34);
  // The camera on the comb jelly (at scale 1 it spans about x 870-1340, y 320-630, its upper lobe from x≈1040 at the
  // note's height). Every framing grows away from the left edge, so the animal only ever moves right of the note
  // (which ends at x≈1030), and stays left of the gauge readout (x≈1555).
  const shots: Shot[] = [
    [0, 1, 0, 50],
    [classAt, 1.03, 0, 50],
    [classAt + 45, 1.14, 20, 20, "move"], // "So a whole class of animals hides...": in on the comb jelly
    [openAt, 1.15, 10, 35],
    [openAt + 50, 1.02, 0, 50, "move"], // "animals of the open midwater": back out - one small animal in a lot of water
    [squidAt, 1.03, 0, 50],
    [squidAt + 40, 1.15, 0, 100, "move"], // the photo slides away to the right, dark, under the drawing
    [strategyAt, 1.15, 0, 100],
    [strategyAt + 45, 1.05, 0, 50, "move"], // "It is a strategy that costs you a body": the comb jelly again
    [enormousAt, 1.07, 0, 50],
    [enormousAt + 30, 1.15, 20, 20, "move"], // "by being enormous": in
    [t.frames, 1.15, 16, 26],
  ];

  return (
    <RungShell t={t} index={3} plate={{ image: "comb-jelly", ext: "png" }} brightness={0.6 * (1 - squid)} plateMove={cameraAt(frame, shots)} credit={squid > 0.5 ? { kind: "illustration", source: "a drawing" } : { kind: "real", source: "NOAA Ocean Exploration · a comb jelly, Puerto Rico 2015" }}>
      {/* line 0: what there is not, word by word, then what there is; then where they hide (later parts keep their place, unseen) */}
      <div style={{ opacity: ease(frame, rockAt, 8) * (1 - ease(frame, insideAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            no rock.
            <span style={{ opacity: ease(frame, weedAt, 6) }}> no weed.</span>
            <span style={{ opacity: ease(frame, floorAt, 6) }}> no floor.</span>
          </span>
          <br />
          <span style={{ whiteSpace: "nowrap", color: B.gauge, opacity: ease(frame, waterAt, 8) }}>only water.</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, insideAt, 10) * (1 - ease(frame, hiddenAt, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            so hide <span style={{ color: B.gauge }}>inside the water</span>
          </span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, transparentAt, 8) }}>by being transparent</span>
        </CaptionPop>
      </div>
      {/* the photo is a comb jelly (Duobrachium sparksae, NOAA 2015) - another see-through animal, not the squid
          (sources #24). On the picture from the first frame, 26 px, x 160-~1030, y 336-384; the camera keeps the jelly
          to the right of it. Gone while the drawing covers the dark photo, back with the photo. */}
      <Pill x={160} y={336} opacity={1 - squid}>shown: a comb jelly · another see-through animal</Pill>
      <div style={{ opacity: ease(frame, hiddenAt + 8, 10) * (1 - ease(frame, exactlyAt, 8)) }}>
        <CaptionPop bottom={150} size={88}>hidden in plain sight</CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, exactlyAt + 8, 10) * (1 - ease(frame, squidAt, 8)) }}>
        <CaptionPop bottom={150} size={88} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            nothing to <span style={{ color: B.gauge }}>hide behind</span>
          </span>
        </CaptionPop>
      </div>

      {/* the glass squid, drawn (centre ≈ 560, 650; x 200-1100 at first, x 146-1181 and y 504-796 once it is closer).
          Specks drift past behind it and stay visible through it. */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: squid }}>
        <defs>
          <clipPath id="l02-glass-mantle">
            <path d={MANTLE} />
          </clipPath>
          <linearGradient id="l02-glass-ray" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFE9A8" stopOpacity={0} />
            <stop offset="1" stopColor="#FFE9A8" stopOpacity={1} />
          </linearGradient>
        </defs>
        {Array.from({ length: 16 }, (_, i) => (
          <circle key={i} cx={1420 - ((frame * (1.2 + (i % 3) * 0.5) + i * 97) % 1300)} cy={400 + ((i * 137) % 420)} r={3 + (i % 3)} fill="#BFEFFF" opacity={0.45} />
        ))}
        <g transform={`translate(${sx} ${sy}) scale(${big})`}>
          <g stroke="#BFEFFF" strokeWidth={3} fill="rgba(191,239,255,0.07)" opacity={outline * ease(frame, nameAt - 2, 10)}>
            {/* fins, either side of the tail, fluttering */}
            <ellipse cx={-290} cy={-40} rx={68} ry={30 * (0.7 + 0.3 * Math.sin(frame / 5))} transform="rotate(-22 -290 -40)" />
            <ellipse cx={-290} cy={40} rx={68} ry={30 * (0.7 + 0.3 * Math.sin(frame / 5 + 1))} transform="rotate(22 -290 40)" />
            <path d={MANTLE} pathLength={100} strokeDasharray={`${100 * draw} 100`} transform={`scale(${1 + 0.012 * Math.sin(frame / 9)} 1)`} />
            <path d="M300 -60 C 360 -72, 400 -40, 400 0 C 400 40, 360 72, 300 60" opacity={draw} />
            <circle cx={352} cy={-56} r={22} opacity={draw} />
            <circle cx={352} cy={56} r={22} opacity={draw} />
            {[-30, -18, -6, 6, 18, 30].map((a, i) => (
              <path key={a} d={`M400 ${a} Q 462 ${a * 1.6 + 8 * Math.sin(frame / 11 + i)} 530 ${a * 2.4 + 12 * Math.sin(frame / 8 + i)}`} fill="none" opacity={draw} />
            ))}
          </g>
          {/* "Almost the whole animal is clear": a glint runs the length of the mantle */}
          {glint > 0 && glint < 1 ? (
            <g clipPath="url(#l02-glass-mantle)">
              <rect x={-400 + 800 * glint} y={-150} width={80} height={300} fill="#FFFFFF" opacity={0.3} transform="skewX(-20)" />
            </g>
          ) : null}
          {/* line 4, "almost nothing inside you can scatter light": light crosses the body untouched - except the one ray that meets a gill */}
          <g opacity={rays} stroke="#FFE9A8" strokeWidth={6} strokeLinecap="round">
            {[-84, -50, -8, 36, 62, 88].map((y, j) => {
              const p = ((((frame - lightAt) / 64 + j * 0.17) % 1) + 1) % 1;
              const x = -560 + 1220 * p;
              const stop = j === 2 ? -110 - 34 * solid - 8 : 9999;
              if (x > stop) {
                const b = Math.min(1, (x - stop) / 160);
                return (
                  <g key={y} opacity={1 - b}>
                    {[-0.9, 0, 0.9].map((d) => (
                      <line key={d} x1={stop} y1={y} x2={stop - (14 + 26 * b) * Math.cos(d)} y2={y - (14 + 26 * b) * Math.sin(d)} />
                    ))}
                  </g>
                );
              }
              return <rect key={y} x={x - 190} y={y - 4} width={190} height={8} rx={4} fill="url(#l02-glass-ray)" stroke="none" opacity={0.9 * Math.min(1, p / 0.05)} />;
            })}
          </g>
          {/* the parts it cannot make clear: the gland on "a small red digestive gland", the gills on "two pale gills";
              they swell on "the parts that have to be solid" and shrink on "are kept small" */}
          <ellipse cx={-20} cy={0} rx={50 * solid * (0.6 + 0.4 * gland + 0.3 * bump(frame, glandAt, 6, 16))} ry={26 * solid * (0.6 + 0.4 * gland + 0.3 * bump(frame, glandAt, 6, 16))} fill="#C0231F" opacity={gland} />
          {[-110, 70].map((cx) => (
            <ellipse key={cx} cx={cx} cy={-10} rx={34 * solid * (0.6 + 0.4 * gills + 0.3 * bump(frame, gillsAt, 6, 16))} ry={14 * solid * (0.6 + 0.4 * gills + 0.3 * bump(frame, gillsAt, 6, 16))} fill="#F3E9F5" opacity={gills} />
          ))}
        </g>
      </svg>
      {/* labels under the squid (y 812-848 and 854-890), each on its own words; line 4's pair takes the same two rows */}
      <Tag x={300} y={812} opacity={squid * gland * (1 - ease(frame, costAt, 8))} color="#FF8A80" size={30}>a red digestive gland</Tag>
      <Tag x={300} y={854} opacity={squid * gills * (1 - ease(frame, costAt, 8))} color={B.paper} size={30}>
        two pale gills
        {frame > elseAt ? <span style={{ opacity: ease(frame, elseAt, 8) }}> · everything else is water-coloured</span> : null}
      </Tag>
      <Tag x={300} y={812} opacity={squid * ease(frame, nothingAt, 10)} color="#FFE9A8" size={30}>almost nothing inside can scatter light</Tag>
      <Tag x={300} y={854} opacity={squid * ease(frame, smallAt, 10)} color={B.paper} size={30}>
        the solid parts are kept small
        {frame > givenUpAt ? <span style={{ opacity: ease(frame, givenUpAt, 8) }}> · the rest is given up</span> : null}
      </Tag>
      {/* the card (x 160-~1070, y 336-496 when open). B7 (fix run 1): it says in so many words that NOAA filmed one and
          that what is on screen is a drawing (both small rows 26 px); the viewfinder corners that framed the drawing as
          that dive's footage are gone. The strip arrives on "a NOAA camera off Alaska filmed"; the name opens above it,
          and "shown here as a drawing" under it, as the outline draws on "a glass squid"; the depth joins on "seven
          hundred metres down" (#4). */}
      <div style={{ position: "absolute", left: 160, top: 336, opacity: squid * ease(frame, filmedAt, 10), ...cardBox(72) }}>
        <div style={{ height: 72 * ease(frame, nameAt, 10), overflow: frame < nameAt + 10 ? "hidden" : "visible", opacity: ease(frame, nameAt, 10) }}>
          glass squid
          {frame > sevenAt ? <span style={{ opacity: ease(frame, sevenAt, 8) }}> · 700 m</span> : null}
        </div>
        <div style={{ ...cardSmall(72), lineHeight: "31px", marginTop: 4 * ease(frame, nameAt, 10) }}>NOAA FILMED ONE · SEASCAPE ALASKA 3 · 15 JULY 2023</div>
        <div style={{ ...cardSmall(72), lineHeight: "31px", height: 31 * ease(frame, nameAt, 10), overflow: "hidden", opacity: ease(frame, nameAt, 10) }}>SHOWN HERE AS A DRAWING</div>
      </div>
      <div style={{ opacity: ease(frame, clearAt, 10) * (1 - ease(frame, partsAt, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            almost all of it is <span style={{ color: B.gauge }}>clear</span>
          </span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, strategyAt + 12, 10) * (1 - ease(frame, teaseAt, 8)) }}>
        <CaptionPop bottom={150} size={78} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            a strategy that <span style={{ color: B.gauge }}>costs you a body</span>
          </span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, nextAt, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>next: solve the food problem</span>
          <br />
          <span style={{ whiteSpace: "nowrap", opacity: ease(frame, enormousAt, 8) }}>
            by <span style={{ color: B.gauge }}>being enormous</span>
          </span>
        </CaptionPop>
      </div>
      <Problems lit={[2]} opacity={0} />
    </RungShell>
  );
};
