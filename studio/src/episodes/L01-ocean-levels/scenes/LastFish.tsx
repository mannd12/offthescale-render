import React from "react";
import { useCurrentFrame } from "remotion";
import { CaptionPop } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease, lerp, windowed } from "../../../lib/ui";
import { depthPos } from "../ladder";
import { RungShell, Tag } from "./shell";

/**
 * Level 11 - the last fish, 8,336 m. Sources: #25 (snailfish at 8,336 m, Izu-Ogasawara Trench,
 * Aug 2022), #26/#40 (TMAO stabilises proteins; more with depth; fish limited to ~8,200-8,400 m - a chemistry ceiling).
 * Lines: 0 "8,336 m. In 2022, in a trench south of Japan... snailfish... deepest fish anyone has ever seen."
 * 1 "And it may be close to the deepest a fish can be." 2 "...a molecule called TMAO." 3 "Think of it as chemical scaffolding..."
 * 4 "But scaffolding has a ceiling. At somewhere around 8,200 m..." 5 "The wall isn't the pressure itself..."
 * 6 "Below that line... no fish. Anywhere." 7 "There are still two and a half kilometres to go."
 *
 * The plate (`snailfish-hadal`) is a real hadal snailfish at 6,025 m in the Atacama Trench: Linley, Gerringer, Ritchie et al.
 * 2022, Marine Biodiversity 52:56, Fig. 8a, CC BY 4.0, cropped (assets.md). It is NOT the 8,336 m record fish, which was
 * filmed in the Izu-Ogasawara Trench: the chip says so, a disclosure sits beside the fish, and the record's own tags hang
 * off the gauge reading by a dashed tie, up on the sand, away from the animal.
 * At plate scale 1.0 the fish runs tail (top left, tip ~414,22) to head (~1274,770; eye ~1305,818; snout ~1496,866).
 *
 * The limit is shown as source #26's range (≈ 8,200-8,400 m), never as a bare 8,200 m line: the gauge on the
 * same frame reads 8,336 m for a living fish, and a line drawn above it would contradict it.
 */
const LIMIT = "≈ 8,200–8,400 m";
const GAUGE_TOP = 250;
const GAUGE_H = 700;
const yAt = (m: number) => GAUGE_TOP + depthPos(m) * GAUGE_H;
// the protein diagram
const CX = 560;
const CY = 540;

export const LastFish: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const revealAt = Math.round(t.lines[0].at + 0.15 * t.lines[0].audioFrames);
  const arriveAt = within(t, 0, 0.66);
  const closeAt = lineAt(t, 1);
  const diagramAt = lineAt(t, 2);
  const tmaoAt = within(t, 2, 0.6); // "...a molecule called TMAO"
  const scaffoldAt = within(t, 3, 0.2);
  const moreAt = within(t, 3, 0.62); // "the deeper a fish lives, the more of it it packs into its cells"
  const ceilingAt = lineAt(t, 4);
  const depthAt = within(t, 4, 0.28); // "At somewhere around eight thousand two hundred metres"
  const muchAt = within(t, 4, 0.58); // "a fish would need so much TMAO"
  const stopsAt = within(t, 4, 0.84); // "that the rest of its body chemistry stops working"
  const wallAt = lineAt(t, 5);
  const chemAt = within(t, 5, 0.28); // "The wall is that a fish, built the way fish are built..."
  const answerAt = within(t, 5, 0.7); // "...runs out of the chemistry to answer it."
  const limitAt = lineAt(t, 6); // "Below that line..."
  const noFishAt = within(t, 6, 0.6); // "...no fish. Anywhere."
  const goAt = lineAt(t, 7);

  // Lines 0-1 over the real photo: what the photo is (and is not) is on screen from the FIRST frame of the rung
  // (pass 3: for 7.8 s only the small chip said this was a different fish); the record line joins at the title reveal.
  const shown = ease(frame, 0, 12) * (1 - ease(frame, diagramAt - 10, 10));
  const record = ease(frame, revealAt, 10) * (1 - ease(frame, diagramAt - 10, 10));
  // from the diagram on, something drawn covers the photo for the rest of the rung (diagram, then the limit line and tint)
  const covered = ease(frame, diagramAt, 14);
  // 0.7 while the photo is the picture (the tags sit on the sand: white 6.7:1, yellow 4.3:1, plus their shadows);
  // near-dark under the diagram (the pale fish is the brightest thing in the plate), darker still from "a ceiling",
  // and it stays dark under the limit line, so "no fish. anywhere." is never printed over a plainly visible fish.
  const plateBrightness = 0.7 - 0.46 * covered - 0.1 * ease(frame, ceilingAt, 24) + 0.02 * ease(frame, limitAt, 14);
  const diagram = ease(frame, diagramAt, 14) * (1 - ease(frame, limitAt - 10, 10));
  const struts = ease(frame, scaffoldAt, 40);
  // the card carries the depth, so it waits for the depth to be spoken (it used to open the line, 2.6 s early)
  // (three frames after the cue: the card lands 12 % large, and at that size its left edge would still touch the arrow tip)
  const ceiling = ease(frame, depthAt + 3, 11);
  const limit = ease(frame, limitAt, 14);
  const y0 = yAt(8200);
  const y1 = yAt(8400);

  // --- motion pass 2026-10-01 (the diagram used to sit frozen between its labels) ---
  // The pressure pushes in, again and again. Before the scaffolding the protein gives with every push; once the
  // struts are in it holds - until "runs out of the chemistry to answer it", when the pushes start to win again.
  const beat = Math.max(0, Math.sin(frame / 11));
  const overload = ease(frame, answerAt, 40);
  const pushIn = (16 + 10 * overload) * beat;
  // "...stops working": from there the protein strains - it gives a little on every push and shivers in between
  const strain = ease(frame, stopsAt, 20);
  const squeeze = 1 - (0.1 * (1 - struts) + 0.012 + 0.04 * strain + 0.06 * overload) * beat + 0.012 * strain * Math.sin(frame / 1.7);
  // "The wall isn't the pressure itself": the pressure steps back for that sentence, and returns with the next
  const pressureOn = 1 - 0.7 * windowed(frame, wallAt, chemAt + 10, 10);
  // a short swell on the thing a sentence points at
  const pop = (at: number) => ease(frame, at, 8) * (1 - ease(frame, at + 12, 20));
  // "But scaffolding has a ceiling": a coral line closes round the protein - as far as the scaffolding can go -
  // and the photo behind sinks further into the dark. On "stops working" a coral haze comes up round the frame.
  const capped = ease(frame, ceilingAt, 30);
  const haze = diagram * ease(frame, stopsAt, 16) * (1 - 0.45 * ease(frame, wallAt, 30));
  // Camera on the plate. The source is only 718 px wide, so the scale never passes 1.15 and the move is a pan:
  // it opens on the tail (origin 0 % 30 %), travels down the body and reaches the head as "a small, pale snailfish"
  // is said (origin 100 % 100 %: head ~1177,724, eye ~1205,775, snout ~1425,830). It holds there (a 3 % creep over
  // 39 s, so the disclosure stays beside the fish), and under the limit line it goes back to the tail framing, which
  // puts the head behind the gauge instead of under "no fish".
  const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
  const smooth = (a: number, b: number) => {
    const k = clamp01((frame - a) / (b - a));
    return k * k * (3 - 2 * k);
  };
  const travel = smooth(30, arriveAt);
  const back = smooth(limitAt - 10, limitAt + 40);
  const camScale = lerp(lerp(1.15, 1.12 + 0.03 * clamp01((frame - arriveAt) / (limitAt - arriveAt)), travel), 1.15 - 0.05 * clamp01((frame - limitAt) / (t.frames - limitAt)), back);
  const camX = lerp(lerp(0, 100, travel), 0, back);
  const camY = lerp(lerp(30, 100, travel), 30, back);
  // the limit line is drawn from the gauge across the frame
  const sweep = ease(frame, limitAt, 24);

  return (
    <RungShell
      t={t}
      index={10}
      depth={8336}
      plate={{ id: "snail", name: "", reading: "", image: "snailfish-hadal", ext: "png" }}
      brightness={plateBrightness}
      credit={
        covered > 0.5
          ? { kind: "illustration", source: "over a photo: Linley et al. 2022 (CC BY 4.0)" }
          : { kind: "real", source: "Linley et al. 2022 (CC BY 4.0) · hadal snailfish, 6,025 m, Atacama Trench · not the record fish" }
      }
      revealAt={revealAt}
      sub="≈ 830× surface pressure"
      plateMove={{ scale: camScale, origin: `${camX}% ${camY}%` }}
    >
      {/* One block on the sand, left of the fish: what the photo is, and the record it is not. The two "shown" rows
          are up from frame 0; the record row (#25) opens under them at the title reveal, so the pill never shows an
          empty row. x 64-~700, y 578-~712; the fish's nearest edge is x~790 or further right for the whole rung. */}
      <div style={{ position: "absolute", left: 64, top: 578, opacity: shown, padding: "12px 18px 14px", borderRadius: 14, background: "rgba(5,14,24,0.72)", fontFamily: F.ui, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 26, lineHeight: "36px", color: B.paper }}>shown: a hadal snailfish at 6,025 m</div>
        <div style={{ fontSize: 26, lineHeight: "36px", color: B.paper }}>not the record fish</div>
        <div style={{ fontSize: 30, lineHeight: "38px", height: 38 * record, overflow: "hidden", color: B.gauge, opacity: record }}>the record fish: 8,336 m · 2022</div>
      </div>

      <div style={{ opacity: ease(frame, closeAt, 10) * (1 - ease(frame, diagramAt, 8)) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          close to the deepest a fish <span style={{ color: B.gauge }}>can be</span>
        </CaptionPop>
      </div>

      {/* "...stops working": a coral haze round the edge of the frame, under the diagram and its labels */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 45% 50%, rgba(255,90,79,0) 25%, rgba(255,90,79,0.42) 100%)", opacity: haze }} />
      {/* TMAO as scaffolding: a protein blob held in shape by struts; pressure arrows push in */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: diagram }}>
        <g transform={`translate(${CX} ${CY})`}>
          {/* pressure arrows from all sides, driving in on every beat */}
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const r1 = 290 - pushIn;
            const r2 = 232 - pushIn;
            return <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} stroke={B.tease} strokeWidth={6} strokeLinecap="round" opacity={pressureOn} />;
          })}
          <g transform={`scale(${squeeze})`}>
            {/* the protein, squashed a little less as struts appear */}
            <ellipse cx={0} cy={0} rx={150 + 30 * struts} ry={110 + 50 * struts} fill="#7FB7E6" opacity={0.85} />
            {/* struts */}
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const on = ease(frame, scaffoldAt + i * 3, 10);
              return <line key={i} x1={Math.cos(a) * 40} y1={Math.sin(a) * 40} x2={Math.cos(a) * 170} y2={Math.sin(a) * 150} stroke={B.gauge} strokeWidth={6} opacity={on} />;
            })}
            {/* "the more of it it packs into its cells": a second set of struts goes in between the first */}
            {Array.from({ length: 12 }, (_, i) => {
              const a = ((i + 0.5) / 12) * Math.PI * 2;
              const on = ease(frame, moreAt + i * 3, 10);
              return <line key={i} x1={Math.cos(a) * 40} y1={Math.sin(a) * 40} x2={Math.cos(a) * 170} y2={Math.sin(a) * 150} stroke={B.gauge} strokeWidth={6} opacity={on} />;
            })}
            {/* "so much TMAO": a third, crammed into every gap that is left */}
            {Array.from({ length: 24 }, (_, i) => {
              const a = ((i + 0.5) / 24) * Math.PI * 2;
              const on = ease(frame, muchAt + i, 10);
              return <line key={i} x1={Math.cos(a) * 64} y1={Math.sin(a) * 64} x2={Math.cos(a) * 170} y2={Math.sin(a) * 150} stroke={B.gauge} strokeWidth={4} opacity={on} />;
            })}
            {/* the ceiling: drawn round the protein on "scaffolding has a ceiling", then it throbs */}
            <ellipse cx={0} cy={0} rx={180} ry={160} fill="none" stroke={B.tease} strokeWidth={7} pathLength={100} strokeDasharray={`${100 * capped} 100`} opacity={frame >= ceilingAt ? 0.75 + 0.25 * Math.sin(frame / 6) : 0} />
          </g>
        </g>
      </svg>
      {/* labels sit on what they name: the blob is the protein, the coral arrows are the pressure */}
      <Tag x={CX} y={CY + 172} opacity={diagram} color="#A9D2F3" align="center">a protein</Tag>
      <Tag x={CX} y={CY - 290 - 44} opacity={diagram * pressureOn} color={B.tease} align="center">pressure</Tag>
      {/* TMAO is named on screen as it is named aloud (line 2), not a line later; it swells when a later line leans on it */}
      <div style={{ position: "absolute", left: 900, top: 262, opacity: diagram * ease(frame, tmaoAt, 10), fontFamily: F.headline, fontSize: 84, lineHeight: 1, color: B.gauge, letterSpacing: 2, textShadow: "0 6px 24px rgba(0,0,0,0.8)", transform: `scale(${1 + 0.12 * Math.max(pop(muchAt), pop(chemAt))})`, transformOrigin: "0% 60%" }}>TMAO</div>
      <Tag x={900} y={362} opacity={diagram * ease(frame, tmaoAt + 8, 10)}>holds deep-sea fish together</Tag>
      <Tag x={900} y={406} opacity={diagram * ease(frame, scaffoldAt, 12)} color={B.gauge}>chemical scaffolding for proteins</Tag>
      <Tag x={900} y={450} opacity={diagram * ease(frame, moreAt, 12)}>deeper fish pack in more</Tag>
      {/* The card lands large on its number (from 1.12× down, growing leftwards from its right edge so it never
          reaches the gauge's stop labels) and swells again on "stops working". It is the kit's NumberCard drawn here
          by hand, so each half of its small line can wait for its own words; the hidden halves keep their width, so
          the card does not change size. Ink on coral (5.8:1) - white on coral was only 3.1:1 at this size. */}
      <div style={{ position: "absolute", left: 900, top: 520, opacity: diagram * ceiling, transform: `scale(${1 + 0.12 * (1 - ease(frame, depthAt, 18)) + 0.04 * pop(stopsAt)})`, transformOrigin: "100% 50%", padding: "10px 22px 12px", borderRadius: 16, background: B.tease, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
        <div style={{ fontFamily: F.headline, fontSize: 64, lineHeight: 1, whiteSpace: "nowrap" }}>{LIMIT}</div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 23, marginTop: 4, letterSpacing: 1, whiteSpace: "nowrap" }}>
          THE CEILING
          <span style={{ opacity: ease(frame, muchAt, 8) }}> · TOO MUCH TMAO</span>
          <span style={{ opacity: ease(frame, stopsAt, 8) }}>, THE REST STOPS WORKING</span>
        </div>
      </div>
      {/* each sentence of line 5 gets its half of the caption */}
      <div style={{ opacity: ease(frame, wallAt, 10) * (1 - ease(frame, limitAt - 10, 8)) }}>
        <CaptionPop bottom={150} size={72} color={B.paper}>
          not a crushing limit. <span style={{ color: B.gauge, opacity: ease(frame, chemAt, 8) }}>a chemistry limit.</span>
        </CaptionPop>
      </div>

      {/* the limit, drawn as #26's range at the gauge's own height and carried across the frame: everything
          below it is the no-fish zone. The label stops left of the gauge pill (≈ x 1,540 now its subtitle is one
          line); the captions sit below the line, above the credit chip. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: y1, bottom: 0, background: "linear-gradient(rgba(255,90,79,0.26), rgba(255,90,79,0.05))", opacity: limit }} />
      <div style={{ position: "absolute", left: 1880 * (1 - sweep), right: 40, top: y0, height: Math.max(6, y1 - y0), background: B.tease, boxShadow: "0 2px 10px rgba(0,0,0,0.6)", opacity: limit }} />
      <div style={{ position: "absolute", right: 420, top: y0 - 46, opacity: limit, fontFamily: F.ui, fontWeight: 800, fontSize: 28, letterSpacing: 1.5, color: B.paper, textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
        <span style={{ color: B.tease }}>{LIMIT}</span> · the chemistry limit
      </div>
      <div style={{ opacity: ease(frame, noFishAt, 10) * (1 - ease(frame, goAt, 8)) }}>
        <CaptionPop bottom={100} size={84} color={B.tease}>no fish. anywhere.</CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, goAt, 8) }}>
        <CaptionPop bottom={100} size={84} color={B.paper}>
          still <span style={{ color: B.gauge }}>2.6 km</span> to go
        </CaptionPop>
      </div>
    </RungShell>
  );
};
