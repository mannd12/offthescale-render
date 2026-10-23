import React from "react";
import { AbsoluteFill, Img, interpolateColors, useCurrentFrame } from "remotion";
import { CaptionPop, levelImage } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease, lerp, windowed } from "../../../lib/ui";
import { NumberCard, RungShell, Tag } from "./shell";

// NH 96797: Trieste "just before her record dive", 23 January 1960 (Commons / U.S. Navy) - the only photo that
// may carry the date and the names.
const TRIESTE_DAY = { id: "t1", name: "", reading: "", image: "trieste-1960" as const };
// USN 1044871: Trieste on 15 November 1959, after an 18,600 ft dive (Rechnitzer and Piccard on the tower).
// Background plate only - never captioned as the record dive (episodes/L01-ocean-levels/assets.md).
const TRIESTE_1959 = { id: "t2", name: "", reading: "", image: "trieste-sub" as const };

// Everest in the trench, drawn on a LINEAR scale (the gauge beside it is not linear): 700 px = 10,935 m.
const DEEP = 10935;
const EVEREST = 8849; // 8,848.86 m, #27
const COLUMN = { x: 200, y: 250, w: 1240, h: 700 };
const SUMMIT_Y = COLUMN.y + ((DEEP - EVEREST) / DEEP) * COLUMN.h; // 2,086 m of water above = 19 % of the column
const FLOOR_Y = COLUMN.y + COLUMN.h;
const PEAK_X = 820;
const HALF_BASE = 400;
const capW = (60 * HALF_BASE) / (FLOOR_Y - SUMMIT_Y); // half-width of the mountain 60 px below the summit

// the timeline runs 1960 -> today on a true scale, so the 52 empty years look like 52 years
const AX = { x: 190, w: 1000, y: 450, from: 1960, to: 2026 };
const yearX = (y: number) => AX.x + ((y - AX.from) / (AX.to - AX.from)) * AX.w;

const Person: React.FC<{ color: string; opacity: number }> = ({ color, opacity }) => (
  <svg width={40} height={56} viewBox="0 0 100 140" style={{ opacity, flex: "none" }}>
    <circle cx="50" cy="20" r="16" fill={color} />
    <rect x="34" y="40" width="32" height="50" rx="12" fill={color} />
    <rect x="36" y="90" width="12" height="44" rx="6" fill={color} />
    <rect x="52" y="90" width="12" height="44" rx="6" fill={color} />
  </svg>
);

/**
 * Level 12 - the bottom, 10,935 m. Sources: #2 (Challenger Deep 10,935 m, SW of Guam), #27
 * (Everest 8,848.86 m -> summit ≈2 km under), #11 (≈1,090 atm ≈ 8 tons/in²), #28 (23 Jan 1960,
 * Piccard & Walsh, Trieste, ~4 h 47 min down, window cracked, 20 min on the bottom), #29/#41
 * (52 years to Cameron 2012; one sub since 2019; 22 people listed vs exactly 12 on the Moon), #30 (amphipods eat wood).
 * Lines: 0 "10,935 m. Challenger Deep... south-west of Guam." 1 "If you stood Mount Everest in here... two kilometres under water."
 * 2 "The pressure is more than a thousand times the surface - roughly eight tons on every square inch."
 * 3 "Humans first came here on 23 January 1960. Two men, Jacques Piccard and Don Walsh... nearly five hours."
 * 4 "On the way down, an outer window cracked with a bang... twenty minutes on the bottom."
 * 5 "Then, for fifty-two years, nobody went back... Cameron 2012... since 2019, a single submarine..."
 * 6 "...more than twenty people... more people than have ever walked on the Moon."
 * 7 "And even here, there is life... amphipods... wood."
 */
export const Bottom: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const everestAt = lineAt(t, 1);
  const pressureAt = lineAt(t, 2);
  const triesteAt = lineAt(t, 3);
  const crackAt = within(t, 4, 0.25);
  const bottomAt = within(t, 4, 0.75);
  const gapAt = lineAt(t, 5);
  const cameronAt = within(t, 5, 0.3); // "James Cameron went down alone in 2012."
  const oneSubAt = within(t, 5, 0.5); // "And since 2019, a single submarine..."
  const peopleAt = within(t, 6, 0.06); // "more than twenty people..."
  const moonAt = within(t, 6, 0.68); // "...than have ever walked on the Moon."
  const lifeAt = lineAt(t, 7);
  const amphipodAt = within(t, 7, 0.2); // "Tiny shrimp-like animals called amphipods..."
  const woodAt = within(t, 7, 0.88); // "...wood."

  const depth = 10935;
  const everest = ease(frame, everestAt, 14) * (1 - ease(frame, pressureAt, 10));
  const rise = ease(frame, everestAt + 6, 40);
  const pressure = ease(frame, pressureAt, 12) * (1 - ease(frame, triesteAt, 10));
  const trieste = ease(frame, triesteAt, 12) * (1 - ease(frame, gapAt, 10));
  const crack = ease(frame, crackAt, 3) * (1 - ease(frame, crackAt + 10, 14));
  const timeline = ease(frame, gapAt, 12) * (1 - ease(frame, lifeAt, 10));
  const life = ease(frame, lifeAt, 12);
  const amphipods = ease(frame, amphipodAt, 12);
  const wood = ease(frame, woodAt, 10);
  const gap = ease(frame, gapAt + 8, 60); // the empty 52 years draw themselves along the axis

  // --- motion pass 2026-10-01: every sentence gets a visible step, and nothing drawn sits perfectly still ---
  const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
  const smooth = (a: number, b: number) => {
    const k = clamp01((frame - a) / (b - a));
    return k * k * (3 - 2 * k);
  };
  // a short swell on the thing a sentence points at
  const pop = (at: number) => ease(frame, at, 8) * (1 - ease(frame, at + 10, 24));
  const twoKmAt = within(t, 1, 0.62); // "...about two kilometres under water."
  const tonsAt = within(t, 2, 0.59); // "roughly eight tons on every square inch"
  const menAt = within(t, 3, 0.39); // "Two men, Jacques Piccard and Don Walsh"
  const sphereAt = within(t, 3, 0.66); // "inside a steel sphere"
  const sinkAt = within(t, 3, 0.8); // "sinking for nearly five hours"
  const keptAt = within(t, 4, 0.59); // "They kept going."
  const subAt = within(t, 5, 0.56); // "a single submarine has carried..."
  const majorityAt = within(t, 5, 0.7); // "...the great majority of everyone who has ever made the trip"
  const sinksAt = within(t, 7, 0.6); // "feeding on whatever sinks this far"
  // camera on the 1959 plate: a slow push whenever it is the picture, reset behind whatever covers it next
  // (the Everest column, the 1960 inset, the dimming for the amphipods). Nothing is anchored to a spot in it.
  let camScale = 1 + 0.1 * Math.min(1, frame / everestAt);
  camScale = lerp(camScale, 1 + 0.12 * clamp01((frame - pressureAt) / (triesteAt - pressureAt)), ease(frame, everestAt, 30));
  camScale = lerp(camScale, 1 + 0.1 * clamp01((frame - gapAt) / (lifeAt - gapAt)), ease(frame, triesteAt, 30));
  camScale = lerp(camScale, 1 + 0.06 * clamp01((frame - lifeAt) / (t.frames - lifeAt)), ease(frame, lifeAt, 30));
  // the 1960 photo: in on the bathyscaphe for "Two men...", then the frame sinks slowly into the water for "sinking"
  const men = ease(frame, menAt, 40);
  const sinking = smooth(sinkAt, gapAt);
  const insetScale = 1 + 0.05 * clamp01((frame - triesteAt) / (gapAt - triesteAt)) + 0.13 * men + 0.1 * sinking;
  // origin x 76 %: at 62 % (and still, just, at 70 %) the push ran the hull's right end into the inset border
  const insetOrigin = `${lerp(40, 76, men)}% ${lerp(lerp(55, 50, men), 100, sinking)}%`;
  // "a bang that shook the whole craft": the photo shudders after the flash
  const shook = frame - crackAt;
  const shake = shook >= 0 && shook < 60 ? Math.exp(-shook / 14) : 0;
  // "since 2019, a single submarine...": the 52 empty years and their two markers step back, 2019-2022 fills in (#29)
  const busy = ease(frame, subAt, 40);
  const older = 1 - 0.55 * ease(frame, subAt, 14);
  // the amphipods gather on the wood once it has landed
  const gather = ease(frame, woodAt + 10, 40);

  // what is on screen decides the chip: a drawing over the photo is an illustration; the inset is the 1960 photo
  const credit =
    everest > 0.5 || life > 0.5 || timeline > 0.5 // the drawn timeline and head-count cover most of the frame too
      ? { kind: "illustration" as const, source: "over a U.S. Navy photo" }
      : trieste > 0.5
        ? { kind: "real" as const, source: "U.S. Navy photo NH 96797 · 23 January 1960" }
        : { kind: "real" as const, source: "U.S. Navy · Trieste after an earlier dive, 1959" };

  const markers: { year: number; at: number; big: string; small: string; align: "left" | "right" }[] = [
    { year: 1960, at: gapAt, big: "1960", small: "Trieste", align: "left" },
    { year: 2012, at: cameronAt, big: "2012", small: "Cameron, alone", align: "right" },
    { year: 2019, at: oneSubAt, big: "2019 →", small: "one sub · most visitors", align: "left" },
  ];

  return (
    <RungShell t={t} index={11} depth={depth} plate={TRIESTE_1959} brightness={0.55 - 0.3 * life - 0.2 * pressure} credit={credit} teaseFrom={t.frames + 1} sub="≈ 1,088× surface pressure" chromeFrom={90} plateMove={{ scale: camScale, origin: "50% 46%" }}>
      <div style={{ opacity: ease(frame, 0, 12) * (1 - ease(frame, everestAt, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          <span style={{ color: B.gauge }}>Challenger Deep</span> · Mariana Trench
          <br />
          south-west of Guam
        </CaptionPop>
      </div>

      {/* Everest stood in the trench, on its own opaque water column (not drawn through the photo): the summit
          is 2,086 m down in a 10,935 m column - 19 % of the way, drawn at 19 % */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: everest }}>
        <defs>
          <linearGradient id="l12-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#12496F" />
            <stop offset="45%" stopColor="#0B2C44" />
            <stop offset="100%" stopColor="#050E18" />
          </linearGradient>
          <clipPath id="l12-column">
            <rect x={COLUMN.x} y={COLUMN.y} width={COLUMN.w} height={COLUMN.h} />
          </clipPath>
        </defs>
        <rect x={COLUMN.x} y={COLUMN.y} width={COLUMN.w} height={COLUMN.h} fill="url(#l12-water)" />
        {/* "about two kilometres under water": the water above the summit lights up, down to a line at the summit */}
        <rect x={COLUMN.x} y={COLUMN.y} width={COLUMN.w} height={SUMMIT_Y - COLUMN.y} fill={B.gauge} opacity={ease(frame, twoKmAt, 12) * (0.2 + 0.06 * Math.sin(frame / 10))} />
        <line x1={PEAK_X - 620 * ease(frame, twoKmAt, 24)} y1={SUMMIT_Y} x2={PEAK_X + 620 * ease(frame, twoKmAt, 24)} y2={SUMMIT_Y} stroke={B.gauge} strokeWidth={3} opacity={ease(frame, twoKmAt, 6)} />
        <g clipPath="url(#l12-column)">
          <g transform={`translate(0 ${(1 - rise) * 300})`}>
            <path d={`M${PEAK_X - HALF_BASE} ${FLOOR_Y} L ${PEAK_X} ${SUMMIT_Y} L ${PEAK_X + HALF_BASE} ${FLOOR_Y} Z`} fill="#C9D3DC" />
            <path d={`M${PEAK_X - capW} ${SUMMIT_Y + 60} L ${PEAK_X} ${SUMMIT_Y} L ${PEAK_X + capW} ${SUMMIT_Y + 60} Z`} fill={B.paper} />
          </g>
        </g>
        <line x1={COLUMN.x} y1={COLUMN.y} x2={COLUMN.x + COLUMN.w} y2={COLUMN.y} stroke={B.aqua} strokeWidth={4} />
        <line x1={COLUMN.x} y1={FLOOR_Y} x2={COLUMN.x + COLUMN.w} y2={FLOOR_Y} stroke={B.mute} strokeWidth={4} />
        <line x1={PEAK_X} y1={COLUMN.y} x2={PEAK_X} y2={SUMMIT_Y} stroke={B.gauge} strokeWidth={4} strokeDasharray="10 10" opacity={rise} />
      </svg>
      <Tag x={220} y={262} opacity={everest} color={B.aqua}>sea surface</Tag>
      <Tag x={1420} y={264} opacity={everest} color="#B8C7D3" size={22} align="right">depths to scale</Tag>
      {/* on its words, with the band (it used to come up with the mountain, 2 s early) */}
      <Tag x={PEAK_X + 30} y={(COLUMN.y + SUMMIT_Y) / 2 - 12} opacity={everest * ease(frame, twoKmAt, 10)} color={B.gauge}>summit: ≈ 2 km under water</Tag>
      <div style={{ position: "absolute", left: PEAK_X, top: 780, transform: `translate(-50%, ${(1 - rise) * 300}px)`, opacity: everest * rise, fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 1.5, textTransform: "uppercase", whiteSpace: "nowrap", color: B.ink }}>
        Mount Everest · 8,849 m
      </div>

      {/* Line 2 says "more than a thousand times the surface" first and "roughly eight tons" 2.9 s later, so each number
          gets its own card on its own words (#11): the first gives way to the second, which swells as it lands (its
          box is the card's own size, so it swells about its centre). */}
      <div style={{ position: "absolute", left: 200, top: 340, opacity: pressure * (1 - ease(frame, tonsAt - 6, 6)) }}>
        <NumberCard x={0} y={0} big="more than 1,000×" small="THE PRESSURE AT THE SURFACE" size={120} />
      </div>
      <div style={{ position: "absolute", left: 200, top: 340, width: 1390, height: 196, opacity: pressure * ease(frame, tonsAt, 8), transform: `scale(${1 + 0.04 * pop(tonsAt)})` }}>
        <NumberCard x={0} y={0} big="≈ 8 tons" small="ON EVERY SQUARE INCH · MORE THAN 1,000× THE SURFACE" size={120} />
      </div>

      {/* Trieste, 23 January 1960: one photo, NH 96797, for both lines - the tag's date belongs to it alone.
          The camera goes in on the bathyscaphe for "Two men...", sinks for "sinking...", and the frame shudders on the bang. */}
      <div style={{ position: "absolute", left: 160, top: 260, width: 1180, height: 540, borderRadius: 24, overflow: "hidden", opacity: trieste, outline: `4px solid ${B.paper}`, boxShadow: "0 12px 40px rgba(0,0,0,0.6)", transform: `translate(${16 * shake * Math.sin(shook * 1.9)}px, ${10 * shake * Math.cos(shook * 2.3)}px)` }}>
        <Img src={levelImage(TRIESTE_DAY)!} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${insetScale})`, transformOrigin: insetOrigin }} />
      </div>
      {/* "inside a steel sphere" - spoken; the sphere itself is under the water line in this photo */}
      <div style={{ opacity: windowed(frame, sphereAt, lineAt(t, 4) + 8, 8) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          inside a <span style={{ color: B.gauge }}>steel sphere</span>
        </CaptionPop>
      </div>
      <Tag x={160} y={200} opacity={trieste}>
        Trieste · 23 Jan 1960
        <span style={{ opacity: ease(frame, within(t, 3, 0.42), 8) }}> · Piccard & Walsh</span>
        <span style={{ opacity: ease(frame, within(t, 3, 0.8), 8) }}> · nearly 5 hours down</span>
      </Tag>
      <AbsoluteFill style={{ background: "#fff", opacity: crack * 0.85 }} />
      <div style={{ opacity: ease(frame, crackAt + 6, 8) * (1 - ease(frame, bottomAt, 8)) }}>
        <CaptionPop bottom={150} size={84} color={B.tease}>
          a window cracked.<span style={{ opacity: ease(frame, keptAt, 8) }}> they kept going.</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, bottomAt, 8) * (1 - ease(frame, gapAt, 8)) }}>
        <CaptionPop bottom={150} size={84}>20 minutes on the bottom</CaptionPop>
      </div>

      {/* lines 5-6 sit on a dark panel: the plate's white hull made grey labels unreadable. It grows for the head-count. */}
      <div style={{ position: "absolute", left: 120, top: 330, width: 1380, height: 290 + 250 * ease(frame, peopleAt - 8, 14), borderRadius: 28, background: "rgba(5,14,24,0.86)", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", opacity: timeline }} />

      {/* the 52-year gap on a timeline; each marker waits for its year to be spoken */}
      <div style={{ position: "absolute", inset: 0, opacity: timeline }}>
        <div style={{ position: "absolute", left: AX.x, top: AX.y - 3, width: AX.w, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.3)" }} />
        <div style={{ position: "absolute", left: yearX(1960), top: AX.y - 5, width: (yearX(2012) - yearX(1960)) * gap, height: 10, borderRadius: 5, opacity: older, background: `repeating-linear-gradient(90deg, ${B.gauge} 0 18px, transparent 18px 30px)` }} />
        {/* a bright head leads the dashes across the empty years, and goes out where 2012 lands */}
        <div style={{ position: "absolute", left: yearX(1960) + (yearX(2012) - yearX(1960)) * gap - 11, top: AX.y - 11, width: 22, height: 22, borderRadius: 11, background: B.paper, boxShadow: `0 0 18px 6px ${B.gauge}`, opacity: ease(frame, gapAt + 8, 6) * (1 - ease(frame, cameronAt - 6, 8)) }} />
        {/* "a single submarine has carried the great majority...": on this axis dashes mean nobody and solid means
            somebody, so the solid bar stops at the latest descent listed in #29 (12 July 2022 = 2022.53), not at the axis end */}
        <div style={{ position: "absolute", left: yearX(2019), top: AX.y - 9, width: (yearX(2022.53) - yearX(2019)) * busy, height: 18, borderRadius: 9, background: B.gauge }} />
        <div style={{ position: "absolute", left: (yearX(1960) + yearX(2012)) / 2, top: AX.y - 92, transform: `translateX(-50%) scale(${1 + 0.2 * (1 - ease(frame, gapAt + 8, 16))})`, opacity: ease(frame, gapAt + 8, 10) * older, fontFamily: F.caption, fontWeight: 600, fontSize: 48, color: B.gauge, whiteSpace: "nowrap" }}>52 years with nobody</div>
        {markers.map((m) => (
          <div key={m.year} style={{ position: "absolute", left: yearX(m.year), top: AX.y, opacity: ease(frame, m.at, 10) * (m.year === 2019 ? 1 : older) }}>
            <div style={{ position: "absolute", left: -13, top: -13, width: 26, height: 26, borderRadius: 13, background: B.gauge, outline: `4px solid ${B.ink}` }} />
            {/* each year lands with a small overshoot, growing away from its neighbour */}
            <div style={{ position: "absolute", top: 26, ...(m.align === "left" ? { left: -13 } : { right: -13 }), textAlign: m.align, whiteSpace: "nowrap", transform: `scale(${1 + 0.18 * (1 - ease(frame, m.at, 16))})`, transformOrigin: m.align === "left" ? "0% 0%" : "100% 0%" }}>
              <div style={{ fontFamily: F.headline, fontSize: 60, lineHeight: 1.1, color: B.paper }}>{m.big}</div>
              <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: m.year === 2019 ? interpolateColors(frame, [majorityAt, majorityAt + 10], [B.paper, B.gauge]) : B.paper, marginTop: 4 }}>{m.small}</div>
            </div>
          </div>
        ))}
      </div>

      {/* more than the Moon: 22 people listed (#29) against exactly 12 moonwalkers */}
      <div style={{ position: "absolute", left: 190, top: 640, display: "flex", gap: 110, opacity: timeline }}>
        {[
          { n: 22, cols: 11, big: "20+", label: "reached Challenger Deep", color: B.gauge as string, at: peopleAt },
          { n: 12, cols: 6, big: "12", label: "walked on the Moon", color: "#B8C7D3", at: moonAt },
        ].map((g) => (
          <div key={g.label} style={{ opacity: ease(frame, g.at, 10) }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", width: g.cols * 48 - 8 }}>
              {Array.from({ length: g.n }, (_, i) => (
                <Person key={i} color={g.color} opacity={ease(frame, g.at + i * 2, 6)} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 12, whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: F.headline, fontSize: 60, lineHeight: 1, color: g.color }}>{g.big}</span>
              <span style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: B.paper }}>{g.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* life at the bottom: amphipods, and wood - drawn, so the chip says ILLUSTRATION and the surface photo dims */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: life }}>
        {/* "whatever sinks this far": specks drift down to the animals (behind the label, like the snow in Level 9) */}
        {Array.from({ length: 14 }, (_, i) => {
          const y = 310 + ((Math.max(0, frame - sinksAt) * (1.3 + (i % 4) * 0.3) + i * 97) % 420);
          return <circle key={i} cx={330 + ((i * 263) % 900) + Math.sin((frame + i * 40) / 30) * 10} cy={y} r={3 + (i % 3)} fill="#D9C7A6" opacity={ease(frame, sinksAt + i * 4, 12) * Math.min(1, (y - 310) / 40) * Math.min(1, (730 - y) / 50)} />;
        })}
        {/* the wood drops the last stretch to the floor (drawn first, so the animals end up on it) */}
        <g opacity={wood} transform={`translate(0 ${-110 * (1 - ease(frame, woodAt, 18))})`}>
          <rect x={820} y={740} width={260} height={50} rx={10} fill="#6B4A2B" />
          <text x={950} y={775} textAnchor="middle" fontFamily={F.ui} fontWeight={800} fontSize={28} letterSpacing={3} fill={B.paper}>WOOD</text>
        </g>
        {/* the amphipods scuttle (legs too); once the wood has landed they close in on it */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = lerp(300 + i * 120, 950, 0.5 * gather) + Math.sin(frame / 16 + i * 1.7) * 24 * (1 - 0.85 * gather);
          const y = lerp(620 + ((i * 37) % 120), 716, 0.5 * gather) + Math.sin(frame / 9 + i * 2.3) * 4;
          return (
            <g key={i} opacity={ease(frame, amphipodAt + i * 3, 10)} transform={`translate(${x} ${y})`}>
              <ellipse cx={0} cy={0} rx={26} ry={12} fill="#F3E9F5" />
              {Array.from({ length: 5 }, (_, k) => (
                <line key={k} x1={-16 + k * 8} y1={8} x2={-20 + k * 8 + Math.sin(frame / 2.5 + k * 1.3 + i) * 4} y2={22} stroke="#F3E9F5" strokeWidth={2} />
              ))}
            </g>
          );
        })}
      </svg>
      <Tag x={300} y={560} opacity={life * amphipods}>amphipods · shrimp-like · living here, eating what sinks this far</Tag>
      <Tag x={1100} y={748} opacity={life * wood} color={B.gauge}>…even wood</Tag>
      <div style={{ opacity: life }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          even here, there is <span style={{ color: B.gauge }}>life</span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};
