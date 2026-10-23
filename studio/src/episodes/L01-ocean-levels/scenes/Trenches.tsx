import React from "react";
import { useCurrentFrame } from "remotion";
import { Img } from "remotion";
import { CaptionPop, levelImage } from "../../../brand/kit";
import { B } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease, lerp, windowed } from "../../../lib/ui";
import { LEVELS, pressureTag } from "../ladder";
import { NumberCard, RungShell, Tag } from "./shell";

/**
 * Level 10 - the trenches, 6,000 m+. Sources: #23 (hadal zone 6,000-11,000 m, only in trenches,
 * Hades), #39 (subduction: the older, denser Pacific plate bends beneath its neighbour), #24
 * (dumbo octopus at 6,957 m, Java Trench, 2019 - the clip itself is copyrighted, so it is drawn).
 * Lines: 0 "Six thousand metres is where the ordinary sea floor runs out..." 1 "This is the hadal zone - named after Hades..."
 * 2 "And trenches aren't holes. They're seams." 3 "...the Pacific plate... sliding underneath its neighbour... The trench is the crease that makes."
 * 4 "The deepest place on Earth is... where the sea floor goes to be recycled." 5 "...in 2019... Java Trench... dumbo octopus... 6,957 metres."
 * 6 "It's the deepest octopus ever recorded." 7 tease
 *
 * The plate (`rov-coral`) is ROV Deep Discoverer on Retriever Seamount, 7 Sept 2014 (Commons metadata) - not a
 * trench, so the chip says so instead of letting the gauge imply it is 6,000 m. The dive's depth is not on the
 * file page, so the chip names the place and makes no depth comparison.
 */

// --- subduction cross-section geometry (full-frame px) ---
const PANEL = { x: 200, y: 300, w: 1240, h: 510 }; // ends at y = 810, clear of the caption line below
const SEA = 520; // the sea floor
const HALF = 40; // half the plate thickness
const BEND = { x: 740, r: 260, dip: (55 * Math.PI) / 180 }; // the plate runs flat to x, then turns down on a circle
const CY = SEA + HALF; // centre line of the flat plate
const ARC_END = { x: BEND.x + BEND.r * Math.sin(BEND.dip), y: CY + BEND.r * (1 - Math.cos(BEND.dip)) };
const DIR = { x: Math.cos(BEND.dip), y: Math.sin(BEND.dip) };
const along = (s: number) => ({ x: ARC_END.x + DIR.x * s, y: ARC_END.y + DIR.y * s });
const SLAB_END = along(260);
// centre line of the Pacific plate: starts off-panel (clipped), bends, and leaves through the panel floor
const PLATE = `M ${PANEL.x - 160} ${CY} L ${BEND.x} ${CY} A ${BEND.r} ${BEND.r} 0 0 1 ${ARC_END.x} ${ARC_END.y} L ${SLAB_END.x} ${SLAB_END.y}`;
// the plate's upper surface through the bend is a circle of radius r + HALF about (BEND.x, CY + r)
const TOP_R = BEND.r + HALF;
const topAt = (y: number) => ({ x: BEND.x + Math.sqrt(TOP_R * TOP_R - (CY + BEND.r - y) ** 2), y });
const AXIS = topAt(SEA + 60); // the trench axis: where the neighbour's toe meets the bending plate
const TOE = topAt(SEA + 2 * HALF); // where the neighbour's base meets it
const NEIGHBOUR_LIP = 1000; // the neighbour reaches the ordinary sea-floor level here
const SEAFLOOR = `M ${PANEL.x} ${SEA} L ${BEND.x} ${SEA} A ${TOP_R} ${TOP_R} 0 0 1 ${AXIS.x} ${AXIS.y} L ${NEIGHBOUR_LIP} ${SEA} L ${PANEL.x + PANEL.w} ${SEA}`;
const NOTCH = `M ${BEND.x} ${SEA} A ${TOP_R} ${TOP_R} 0 0 1 ${AXIS.x} ${AXIS.y} L ${NEIGHBOUR_LIP} ${SEA} Z`;
const NEIGHBOUR = `M ${AXIS.x} ${AXIS.y} L ${NEIGHBOUR_LIP} ${SEA} L ${PANEL.x + PANEL.w} ${SEA} L ${PANEL.x + PANEL.w} ${SEA + 2 * HALF} L ${TOE.x} ${TOE.y} A ${TOP_R} ${TOP_R} 0 0 0 ${AXIS.x} ${AXIS.y} Z`;
const arrow = (x1: number, y1: number, x2: number, y2: number, head = 22) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return `M ${x1} ${y1} L ${x2} ${y2} M ${x2 - head * Math.cos(a - 0.5)} ${y2 - head * Math.sin(a - 0.5)} L ${x2} ${y2} L ${x2 - head * Math.cos(a + 0.5)} ${y2 - head * Math.sin(a + 0.5)}`;
};
const SLAB_ARROW = arrow(along(36).x, along(36).y, along(128).x, along(128).y);

export const Trenches: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  // Motion pass 2026-10-01: the rung used to open on 9 s of one plate. Line 0 now gets its own caption, and the
  // hadal caption lands on its words (it used to wait for the middle of line 1, after "the Greek underworld").
  const trenchAt = within(t, 0, 0.66); // "To go deeper, you need a trench."
  const hadalAt = within(t, 1, 0.06); // "This is the hadal zone"
  const hadesAt = within(t, 1, 0.2); // "named after Hades"
  const scarsAt = within(t, 1, 0.52); // "and it exists only inside these long, narrow scars"
  const seamsAt = lineAt(t, 2);
  const pacificAt = within(t, 3, 0.04);
  const moveAt = within(t, 3, 0.3); // "...is bending downward and sliding underneath"
  const neighbourAt = within(t, 3, 0.5);
  const mantleAt = within(t, 3, 0.66);
  const creaseAt = within(t, 3, 0.8); // "The trench is the crease that makes."
  const deepestPlaceAt = lineAt(t, 4); // "The deepest place on Earth is, quite literally..."
  const recycledAt = within(t, 4, 0.5);
  const octoAt = lineAt(t, 5); // "You might expect nothing here." - the plate alone
  const javaAt = within(t, 5, 0.14); // "Instead, in 2019, a camera lowered into the Java Trench"
  const dumboAt = within(t, 5, 0.37); // "filmed a dumbo octopus"
  const finsAt = within(t, 5, 0.5); // "...that swims by flapping two ear-like fins"
  const numberAt = within(t, 5, 0.8); // "at six thousand nine hundred and fifty-seven metres"
  const deepestAt = lineAt(t, 6);
  const teaseAt = lineAt(t, 7);

  const depth = 6000 + 957 * ease(frame, numberAt, 40);
  const section = ease(frame, seamsAt, 14) * (1 - ease(frame, octoAt, 10));
  const moving = ease(frame, moveAt, 14);
  // The plate itself stays put (so does the trench); its markings travel into the bend and down. They were thin
  // lines creeping at 0.9 px a frame, which read as a still drawing: now they are broad bands at 2.4 px a frame
  // (after a one-second run-up), so the plate visibly slides under its neighbour for as long as it is on screen.
  const sliding = Math.max(0, frame - moveAt);
  const travel = sliding < 30 ? (2.4 * sliding * sliding) / 60 : 2.4 * (sliding - 15);
  // the two motion arrows glide forward and fade, again and again
  const glide = (sliding % 45) / 45;
  const nudge = 30 * glide;
  const arrowOn = moving * (0.35 + 0.65 * Math.sin(Math.PI * glide));
  // each part lights up as it is named: the Pacific plate, its neighbour, the mantle (which then keeps glowing)
  const flash = (at: number) => ease(frame, at, 8) * (1 - ease(frame, at + 14, 30));
  const heat = ease(frame, mantleAt, 14) * (0.6 + 0.4 * Math.sin(frame / 9)) * (1 + 0.8 * ease(frame, recycledAt, 14));
  // the crease keeps pulsing once it has been named; it swells on "the deepest place on Earth"
  const ring = frame >= creaseAt ? ((frame - creaseAt) % 36) / 36 : 0;
  const out = 1 - ease(frame, teaseAt, 8);
  // camera on the plate: a slow push through lines 0-1, back out wide on "You might expect nothing here", then a
  // second slow push that picks up for the hand-off (the photo has no labels anchored to it)
  const pushA = 1 + 0.1 * Math.min(1, frame / seamsAt);
  const pushB = 1 + 0.06 * Math.min(1, Math.max(0, (frame - octoAt) / (teaseAt - octoAt))) + 0.08 * ease(frame, teaseAt, 90);
  const camScale = lerp(pushA, pushB, ease(frame, octoAt, 45));
  // the inset pushes in on the octopus as its fins are described, and never sits perfectly still
  const octoZoom = 1 + 0.05 * Math.min(1, Math.max(0, (frame - dumboAt) / (teaseAt - dumboAt))) + 0.13 * ease(frame, finsAt, 40);
  const octo = ease(frame, dumboAt, 14) * out;
  const number = ease(frame, numberAt, 12) * out;

  const credit =
    section > 0.5
      ? { kind: "illustration" as const, source: "over a NOAA Ocean Exploration photo" }
      : octo > 0.5
        ? { kind: "real" as const, source: "NOAA Ocean Exploration · dumbo octopus, a shallower specimen · behind: Retriever Seamount, 2014" }
        : { kind: "real" as const, source: "NOAA Ocean Exploration · ROV on Retriever Seamount, 2014 (not a trench)" };

  return (
    <RungShell t={t} index={9} depth={depth} plate={{ id: "rov", name: "", reading: "", image: "rov-coral" }} brightness={0.7 - 0.35 * section - 0.3 * windowed(frame, javaAt, dumboAt, 10)} credit={credit} sub={pressureTag(depth, "hadal zone")} plateMove={{ scale: camScale, origin: "58% 55%" }}>
      {/* lines 0-1: one caption per spoken idea, each on its words */}
      <div style={{ opacity: windowed(frame, trenchAt, lineAt(t, 1) + 8, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          to go deeper, you need <span style={{ color: B.gauge }}>a trench</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: windowed(frame, hadalAt, scarsAt, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          the <span style={{ color: B.gauge }}>hadal</span> zone<span style={{ opacity: ease(frame, hadesAt, 8) }}> · named after Hades</span>
        </CaptionPop>
      </div>
      {/* #23: the hadal zone exists only in trenches */}
      <div style={{ opacity: windowed(frame, scarsAt, seamsAt + 4, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          only inside long, narrow <span style={{ color: B.gauge }}>scars</span>
        </CaptionPop>
      </div>

      {/* subduction cross-section: the Pacific plate bends under its neighbour; the trench is the crease */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: section }}>
        <defs>
          <linearGradient id="l10-mantle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7A2E1E" />
            <stop offset="100%" stopColor="#3A130B" />
          </linearGradient>
          <linearGradient id="l10-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F3552" />
            <stop offset="100%" stopColor="#0B2C44" />
          </linearGradient>
          <clipPath id="l10-panel">
            <rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={18} />
          </clipPath>
          {/* the mantle glows where the slab goes in */}
          <radialGradient id="l10-heat" gradientUnits="userSpaceOnUse" cx={along(150).x} cy={along(150).y} r={420}>
            <stop offset="0%" stopColor="#FF8A4C" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#FF8A4C" stopOpacity={0} />
          </radialGradient>
        </defs>
        <g clipPath="url(#l10-panel)">
          <rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={SEA - PANEL.y} fill="url(#l10-water)" />
          <rect x={PANEL.x} y={SEA} width={PANEL.w} height={PANEL.y + PANEL.h - SEA} fill="url(#l10-mantle)" />
          {/* "back into the mantle": the glow comes up on the word and breathes; stronger on "recycled" */}
          <rect x={PANEL.x} y={SEA} width={PANEL.w} height={PANEL.y + PANEL.h - SEA} fill="url(#l10-heat)" opacity={Math.min(1, heat)} />
          {/* the Pacific plate: one band from off-panel, round the bend and down into the mantle */}
          <path d={PLATE} fill="none" stroke="#2F6D8F" strokeWidth={HALF * 2} />
          <path d={PLATE} fill="none" stroke="#6FB2D6" strokeOpacity={0.42} strokeWidth={HALF * 2} strokeDasharray="56 56" strokeDashoffset={-travel} />
          <path d={PLATE} fill="none" stroke="#BFE6FA" strokeOpacity={0.45 * flash(pacificAt)} strokeWidth={HALF * 2} />
          {/* water fills the crease; the overriding plate is drawn after the slab, so the slab passes beneath it */}
          <path d={NOTCH} fill="#0B2C44" />
          <path d={NEIGHBOUR} fill="#4A5D6E" />
          <path d={NEIGHBOUR} fill="#C9D6E2" opacity={0.5 * flash(neighbourAt)} />
          {/* the sea floor, dipping into the trench */}
          <path d={SEAFLOOR} fill="none" stroke={B.gauge} strokeWidth={5} strokeLinejoin="round" />
          {/* motion arrows, inside the plate */}
          <path d={arrow(300, CY, 430, CY)} transform={`translate(${nudge} 0)`} stroke={B.paper} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={arrowOn} />
          <path d={SLAB_ARROW} transform={`translate(${DIR.x * nudge} ${DIR.y * nudge})`} stroke={B.paper} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={arrowOn} />
        </g>
        {/* the trench axis and its leader */}
        <g opacity={ease(frame, creaseAt, 12)}>
          <line x1={AXIS.x} y1={416} x2={AXIS.x} y2={AXIS.y - 18} stroke={B.gauge} strokeWidth={4} strokeDasharray="8 8" />
          <circle cx={AXIS.x} cy={AXIS.y} r={14 + 44 * ring} fill="none" stroke={B.gauge} strokeWidth={4} opacity={0.9 * (1 - ring)} />
          <circle cx={AXIS.x} cy={AXIS.y} r={14 + 6 * ease(frame, deepestPlaceAt, 12)} fill={B.gauge} />
        </g>
      </svg>
      <Tag x={220} y={480} opacity={section * ease(frame, pacificAt, 10)} color="#7FC4E8">Pacific plate · old, cold, heavy</Tag>
      <Tag x={1420} y={480} opacity={section * ease(frame, neighbourAt, 10)} color="#D5DEE6" align="right">its neighbour</Tag>
      <Tag x={AXIS.x} y={372} opacity={section * ease(frame, creaseAt, 12)} color={B.gauge} align="center">the trench: the crease</Tag>
      <Tag x={220} y={750} opacity={section * ease(frame, mantleAt, 10)} color="#F0A48A">the mantle</Tag>
      <div style={{ opacity: ease(frame, within(t, 2, 0.25), 10) * (1 - ease(frame, lineAt(t, 3), 8)) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          not holes. <span style={{ color: B.gauge }}>seams.</span>
        </CaptionPop>
      </div>
      {/* sits below the panel (which ends at y = 810), not across the slab and its arrow */}
      <div style={{ opacity: ease(frame, recycledAt, 10) * (1 - ease(frame, octoAt, 8)) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          where the sea floor goes to be <span style={{ color: B.gauge }}>recycled</span>
        </CaptionPop>
      </div>

      {/* a real dumbo octopus (NOAA, shallower dive) - the 6,957 m record clip is not ours to show.
          Each piece waits for its words: the place, then the animal, then the number. */}
      {/* The place is named in a caption while the plate is still the Retriever Seamount ROV; the "Java Trench · 2019"
          tag waits for the inset and its "shallower specimen" disclosure, so it never labels the seamount photo. */}
      <div style={{ opacity: windowed(frame, javaAt, dumboAt, 8) }}>
        <CaptionPop bottom={150} size={76} color={B.paper}>
          2019 · a camera in the <span style={{ color: B.gauge }}>Java Trench</span>
        </CaptionPop>
      </div>
      <Tag x={160} y={212} opacity={octo}>Java Trench · 2019</Tag>
      <div style={{ position: "absolute", left: 160, top: 260, width: 720, height: 460, borderRadius: 22, overflow: "hidden", outline: `4px solid ${B.paper}`, opacity: octo, boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
        {/* framed to the right so the right-hand fin is inside the inset; the push-in keeps both fins in view */}
        <Img src={levelImage(LEVELS[9])!} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "100% 50%", transform: `scale(${octoZoom})`, transformOrigin: "90% 42%" }} />
      </div>
      <div style={{ position: "absolute", left: 960, top: 420, opacity: number }}>
        <NumberCard x={0} y={0} big="6,957 m" small="DUMBO OCTOPUS · JAVA TRENCH · 2019" size={80} />
      </div>
      <Tag x={960} y={560} opacity={number * ease(frame, deepestAt, 10)} color={B.gauge}>the deepest octopus ever recorded</Tag>
      <Tag x={160} y={730} opacity={octo} color={B.paper}>shown: a shallower specimen, NOAA · the record was filmed by others</Tag>
      <div style={{ opacity: ease(frame, teaseAt, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          2 left · next: a line no backbone has <span style={{ color: B.gauge }}>ever crossed</span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};
