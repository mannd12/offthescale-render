import React from "react";
import { AbsoluteFill, Img, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { CaptionPop, CreditChip, DiverSilhouette, Gauge, TopBar, levelImage } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { LEVELS, SERIES, STOPS, depthPos, fmtDepth, pressureSub } from "../ladder";

/**
 * Level 1, 0-200 m. Lines:
 *  0 "Here's the number that puts this whole video in perspective. Forty metres."
 *  1 "That's the limit for recreational scuba diving ..."
 *  2 "Forty metres. The sea floor is, on average, ninety times deeper than that."
 *  3 "This is the sunlight zone ..."   4 "Sunlight means plants ... phytoplankton."
 *  5 "... About half of the oxygen produced on Earth is produced in the sea ..."
 *  6 "But the ocean is already taking things away. The first to go is colour."
 *  7 "Water swallows red light first ... A bright red fish down here simply looks black."
 *  8 "Hold on to that. Four levels from now, it turns into a superpower."
 *  9 "Level one of twelve. Let's find the line where the plants stop."
 */
export const Sunlight: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const fortyAt = within(t, 0, 0.8);
  const ninetyAt = within(t, 2, 0.55);
  const plantsAt = lineAt(t, 4);
  const oxygenAt = within(t, 5, 0.3);
  const colourAt = lineAt(t, 6);
  const redGoneAt = within(t, 7, 0.55);
  const holdAt = lineAt(t, 8);
  const nextAt = lineAt(t, 9);
  const progress = Math.min(1, frame / t.frames);
  // tiles show for the first ~3 s and again for the hand-off; collapsed in between (same rule as RungShell)
  const compact = Math.min(1, Math.max(0, (frame - 90) / 20)) * (1 - Math.min(1, Math.max(0, (frame - (nextAt - 20)) / 20)));
  // motion pass (2026-10-01): one visible change per phrase - no span over ~5 s without one
  const limitAt = within(t, 1, 0.12); // "That's the | limit for recreational scuba diving"
  const holidayAt = within(t, 1, 0.5); // "... as deep as a trained holiday diver is ever meant to go"
  const fortyAgainAt = lineAt(t, 2); // "Forty metres." (the second time)
  const topAt = within(t, 3, 0.2); // "This is the sunlight zone, | the top two hundred metres"
  const phytoAt = within(t, 4, 0.84); // "... called | phytoplankton"
  const lensAt = within(t, 5, 0.72); // "... drifting life | you would need a microscope to see"
  const swallowAt = lineAt(t, 7); // "Water swallows red light first ..."
  const pulse = (at: number) => ease(frame, at, 8) * (1 - ease(frame, at + 8, 16));

  // camera on the whale shark: a move per sentence and a slow creep between them. Scale stays under 1.2;
  // the pan (px) is always smaller than (scale - 1) x the distance to the frame edge, so no edge shows.
  const camScale =
    1 + 0.03 * progress + 0.11 * ease(frame, holidayAt, 36) - 0.09 * ease(frame, ninetyAt, 30) + 0.08 * ease(frame, lineAt(t, 3), 36) + 0.07 * ease(frame, lineAt(t, 5), 40) - 0.1 * ease(frame, nextAt, 30);
  const camX = 40 * ease(frame, lineAt(t, 3), 36) - 30 * ease(frame, lineAt(t, 5), 40);

  // the gauge ticks 0 -> 40 m as the number is said, and stays there for the scale beat
  const depth = 40 * ease(frame, fortyAt, 20);
  // "ninety times deeper": a second flag drops to the average sea floor, 3,682 m - and leaves when
  // line 3 moves on to "This is the sunlight zone"
  const ninety = ease(frame, ninetyAt, 24) * (1 - ease(frame, lineAt(t, 3), 12));

  // colour loss: a strip of red that turns black across the first 100 m
  const redPhase = interpolate(frame, [colourAt + 10, redGoneAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const colourVis = ease(frame, colourAt, 12) * (1 - ease(frame, nextAt, 10));

  // phytoplankton: drifting specks, deterministic so every render matches
  const specks = Array.from({ length: 70 }, (_, i) => {
    const a = (i * 9301 + 49297) % 233280;
    const b = (i * 4171 + 7919) % 233280;
    return { x: (a / 233280) * 1300 + 140, y: (b / 233280) * 640 + 240, r: 4 + (i % 5) * 2.2, ph: i * 0.7 };
  });
  const specksVis = ease(frame, plantsAt, 14) * (1 - ease(frame, colourAt, 10));
  // the specks drift sideways (wrapping, faded at both ends) instead of only trembling in place
  const speckX = (x: number) => 140 + ((((x - 140 + (frame - plantsAt) * 0.5) % 1300) + 1300) % 1300);
  // the red fish of line 7 sinks along the colour strip: 0 m -> 100 m by "red is completely gone", then creeps on
  const fishX = interpolate(frame, [swallowAt, redGoneAt, nextAt], [200, 750, 830], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fishRed = interpolate(fishX, [200, 750], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {/* the plate is never still: a push or a pull on each sentence (camScale / camX above) */}
      <Img src={levelImage(LEVELS[0])!} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${camX}px) scale(${camScale})`, transformOrigin: "60% 45%", filter: `brightness(${1 - 0.45 * colourVis})` }} />
      <AbsoluteFill style={{ background: "linear-gradient(transparent 55%, rgba(5,14,24,0.7))" }} />

      {/* drifting phytoplankton */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: specksVis }}>
        {specks.map((s, i) => {
          const x = speckX(s.x);
          return <circle key={i} cx={x + Math.sin(frame / 40 + s.ph) * 14} cy={s.y + Math.cos(frame / 55 + s.ph) * 10} r={s.r} fill="#9FF0C8" opacity={(0.45 + (0.45 * ((i * 7) % 10)) / 10) * Math.max(0, Math.min(1, (x - 140) / 60, (1440 - x) / 60))} />;
        })}
      </svg>

      {/* line 5 "...drifting life you would need a microscope to see": a lens over the water with the same
          specks magnified inside it. Circle x 266-574, y 366-674, handle to (598, 698) - clear of the oxygen
          caption (y >= 827) and of the title bar. */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, lensAt, 12) * (1 - ease(frame, colourAt, 10)) }}>
        <defs>
          <clipPath id="l01-lens">
            <circle cx={420} cy={520} r={147} />
          </clipPath>
        </defs>
        <circle cx={420} cy={520} r={150} fill="rgba(5,14,24,0.6)" />
        <g clipPath="url(#l01-lens)">
          {Array.from({ length: 9 }, (_, i) => {
            // an even scatter: golden-angle steps (2.4 rad) at a radius that grows with sqrt(i), each blob
            // circling at its own rate. (The first version used sin(a * 1.3): 2.4 x 1.3 is ~pi, so the blobs
            // lined up in a row and then split into two.) Checked numerically over the lens's whole life:
            // no two blobs overlap by more than ~7 px.
            const a = i * 2.4 + ((frame - lensAt) / 70) * (0.7 + 0.3 * (i % 3));
            const d = 122 * Math.sqrt((i + 0.4) / 9);
            return <circle key={i} cx={420 + Math.cos(a) * d + Math.sin(frame / 31 + i) * 10} cy={520 + Math.sin(a) * d + Math.cos(frame / 27 + i * 2) * 10} r={16 + (i % 4) * 5} fill="#9FF0C8" opacity={0.55 + 0.1 * (i % 4)} />;
          })}
        </g>
        <circle cx={420} cy={520} r={150} fill="none" stroke={B.paper} strokeWidth={8} />
        <line x1={530} y1={630} x2={590} y2={690} stroke={B.paper} strokeWidth={16} strokeLinecap="round" />
      </svg>

      <TopBar series={SERIES} levels={LEVELS} current={0} progress={progress} compact={compact} />
      <Gauge x={1580} top={250} height={700} stops={STOPS} position={depthPos(depth)} reading={fmtDepth(depth)} sub={depth < 39 ? pressureSub(depth) : "scuba limit"} />

      {/* the tiny diver at 40 m, for scale */}
      <div style={{ position: "absolute", left: 1496, top: 250 + depthPos(40) * 700 - 36, opacity: ease(frame, fortyAt + 14, 10), display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <DiverSilhouette size={72} color={B.paper} style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.8))" }} />
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, color: B.paper, textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>YOU</div>
      </div>

      {/* "ninety times deeper": a dashed drop line runs from YOU down to the flag as it lands (x 1,530-1,534,
          y 346 -> 600: left of the 40 m readout bubble, and it ends on the flag's top edge) */}
      <div style={{ position: "absolute", left: 1530, top: 346, height: 254 * ease(frame, ninetyAt, 24), borderLeft: `4px dashed ${B.paper}`, opacity: ninety * 0.9 }} />

      {/* "ninety times deeper": the average sea floor flagged far below */}
      <div style={{ position: "absolute", right: 190, top: 250 + depthPos(3682) * 700 - 48, opacity: ninety, display: "flex", alignItems: "center", gap: 0 }}>
        <div style={{ padding: "8px 18px 10px", borderRadius: 14, background: B.paper, color: B.ink, fontFamily: F.headline, fontSize: 44, lineHeight: 1, whiteSpace: "nowrap" }}>
          {/* the headline face draws a tiny x that read as "90- deeper" on a phone */}
          90<span style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 44 }}>×</span> deeper
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, marginTop: 2 }}>AVERAGE SEA FLOOR · 3,682 m</div>
        </div>
        <div style={{ width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: `18px solid ${B.paper}` }} />
      </div>

      {/* line 0 "Forty metres.": the number itself, big, as it is said; line 1 names what it is ("the limit for
          recreational scuba diving", sources.md #7); line 2 says it again (the number pulses) and hands over to
          the 90x flag. "40 m" sits at y ~696-830, the second line at y ~849-930. */}
      <div style={{ opacity: ease(frame, fortyAt, 10) * (1 - ease(frame, ninetyAt, 12)) }}>
        <CaptionPop bottom={250} size={120}>
          <span style={{ display: "inline-block", transform: `scale(${1 + 0.14 * pulse(fortyAgainAt)})` }}>40 m</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, limitAt, 10) * (1 - ease(frame, fortyAgainAt, 10)) }}>
        <CaptionPop bottom={150} size={72} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>the recreational scuba limit</span>
        </CaptionPop>
      </div>

      {/* line 3 "...the sunlight zone, the top two hundred metres" (sources.md #3) */}
      <div style={{ opacity: ease(frame, topAt, 10) * (1 - ease(frame, plantsAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            sunlight zone · <span style={{ color: B.gauge }}>top 200 m</span>
          </span>
        </CaptionPop>
      </div>

      {/* line 4 "...single-celled algae called phytoplankton": the specks get their name on the word */}
      <div style={{ opacity: ease(frame, phytoAt, 10) * (1 - ease(frame, oxygenAt - 8, 8)) }}>
        <CaptionPop bottom={150} size={92} color="#9FF0C8">
          phytoplankton
        </CaptionPop>
      </div>

      {/* the oxygen number */}
      <div style={{ opacity: ease(frame, oxygenAt, 10) * (1 - ease(frame, colourAt, 10)) }}>
        {/* "About half ..." - the hedge is part of the claim (sources.md #5) */}
        <CaptionPop bottom={150} size={92} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>
            about <span style={{ color: B.gauge }}>half</span> of Earth's oxygen
          </span>
        </CaptionPop>
      </div>

      {/* colour loss strip: red -> black over the first 100 m */}
      <div style={{ position: "absolute", left: 160, bottom: 300, width: 1180, opacity: colourVis }}>
        <div style={{ height: 54, borderRadius: 27, background: `linear-gradient(90deg, #E8322B 0%, ${redPhase > 0 ? "#E8322B" : "#E8322B"} ${Math.max(0, 55 - redPhase * 55)}%, #050E18 ${Math.max(6, 100 - redPhase * 45)}%)`, outline: "3px solid rgba(255,255,255,0.5)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: F.ui, fontWeight: 800, fontSize: 26, color: B.paper, letterSpacing: 1 }}>
          <span>0 m</span>
          <span style={{ opacity: ease(frame, redGoneAt, 8) }}>100 m · red is gone</span>
          <span>200 m</span>
        </div>
      </div>
      {/* line 7: a red fish sinks along the strip and is black by the 100 m mark ("A bright red fish down here
          simply looks black", sources.md #6). Drawn y ~596-664, above the strip (y 683-737); a pale outline
          keeps the black fish visible on the dimmed plate. */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, swallowAt, 12) * (1 - ease(frame, nextAt, 10)) }}>
        <g transform={`translate(${fishX} ${630 + Math.sin(frame / 18) * 4})`} fill={interpolateColors(fishRed, [0, 1], ["#E8322B", "#0A0E14"])} stroke="rgba(255,255,255,0.55)" strokeWidth={3}>
          <path d={`M-62 0 L -92 ${-24 + Math.sin(frame / 5) * 5} L -92 ${24 + Math.sin(frame / 5) * 5} Z`} />
          <path d="M-64 0 C -32 -30, 32 -30, 64 0 C 32 26, -32 26, -64 0 Z" />
          <circle cx={40} cy={-5} r={5} fill="rgba(255,255,255,0.75)" stroke="none" />
        </g>
      </svg>
      <div style={{ opacity: ease(frame, redGoneAt, 10) * (1 - ease(frame, nextAt, 10)) }}>
        <CaptionPop bottom={150} size={96}>
          red → black
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, holdAt + 10, 10) * (1 - ease(frame, nextAt, 8)), position: "absolute", right: 380, bottom: 150, fontFamily: F.caption, fontWeight: 600, fontSize: 40, color: B.paper, textShadow: "0 4px 16px rgba(0,0,0,0.7)" }}>
        remember this · level 5
      </div>

      <div style={{ opacity: ease(frame, nextAt, 8) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          next: where the <span style={{ color: B.gauge }}>plants stop</span>
        </CaptionPop>
      </div>
      {/* the chip says so whenever a drawing covers the photo: the specks and lens (lines 4-5), then the colour
          strip and the red/black fish on the dimmed plate (lines 6-8) */}
      <CreditChip
        kind={specksVis > 0.5 || colourVis > 0.5 ? "illustration" : "real"}
        source={colourVis > 0.5 ? "drawn chart over a NOAA Photo Library photo" : specksVis > 0.5 ? "drawn specks over a NOAA Photo Library photo" : "NOAA Photo Library"}
      />
    </AbsoluteFill>
  );
};
