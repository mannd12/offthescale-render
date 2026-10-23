import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { SERIES } from "../L02-deep-sea-types/ladder";
import { Captions, Card, EndCard, Note, PlateFade, SeriesPill, ShortFrame, TypeRail, cue, currentLine, lin, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S09 - a pill bug the length of your arm (episodes/S09-deep-isopod). Video 2's third Short: TYPE 5 · THE GIANT,
 * handing off to TYPE 6 (the Faster), whose name stays hidden. Vertical 1080x1920; rail left, content x 160-930,
 * chip y ~1,170-1,216, captions y 1,290-1,590 (shortKit).
 * Lines: 0 pill bug grows to 45 cm (drawn) · 1 the real animal (clip) · 2 14 legs + curl inset · 3 the egg (drawn) ·
 * 4 > 1,000 m, a fish head (clip) · 5 years without food · 6 they gorge · 7 how? · 8 end card.
 * Honesty: clip and still are NOAA EX1711 (2017). The fish-head sighting is a different dive (2019, L02 #24): the clip
 * says so on the picture from line 4's first frame, and the fish head is drawn. "In captivity" over a wild animal: the
 * still says "shown: a wild isopod" on lines 5-7. The pill bug, the curl and the egg are drawn (no photo in the manifest).
 * The Toba Aquarium five-year fast is NOT used (L02 #6 is secondary / "reportedly").
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const CLIP_FRAMES = 360; // isopod-swim is trimmed on the runner to seconds 0-12
const CLIP_CLEAN = 216; // NOAA's title card ends before this frame (L02 Types5to8.tsx uses the clip from here)
const CLIP_RATE = 0.75;
const CLIP_RUN = Math.floor((CLIP_FRAMES - CLIP_CLEAN) / CLIP_RATE); // 192 frames of clean footage on screen

/** a pill bug, seen from above, head to the right; local length 100 (x -50..50). curl 0..1 rolls it into a ball. */
const PillBug: React.FC<{ curl?: number; legs?: number; antennae?: number; frame: number }> = ({ curl = 0, legs = 1, antennae = 1, frame }) => {
  const rx = lerp(50, 27, curl);
  const ry = lerp(24, 27, curl);
  const segs = 7;
  return (
    <g>
      {/* legs: seven pairs, paddling (gone once it is a ball) */}
      {legs > 0
        ? Array.from({ length: segs }, (_, i) => {
            const x = -30 + i * 10;
            const w = 4 * Math.sin(frame / 3 + i);
            return (
              <g key={i} stroke="#9FB3C4" strokeWidth={2.4} strokeLinecap="round" opacity={(1 - curl) * legs}>
                <line x1={x} y1={-ry + 4} x2={x + w} y2={-ry - 8} />
                <line x1={x} y1={ry - 4} x2={x - w} y2={ry + 8} />
              </g>
            );
          })
        : null}
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill="#5E6B78" stroke="#C7D2DC" strokeWidth={2.5} />
      {Array.from({ length: segs - 1 }, (_, i) => {
        const u = (i + 1) / segs;
        const x = -rx + 2 * rx * u;
        const h = ry * Math.sqrt(Math.max(0, 1 - (x / rx) ** 2));
        return <path key={i} d={`M ${x} ${-h} Q ${x + 5 * (1 - curl)} 0 ${x} ${h}`} fill="none" stroke="#C7D2DC" strokeWidth={1.8} opacity={0.8} />;
      })}
      {/* antennae (fold away as it curls) */}
      <g stroke="#C7D2DC" strokeWidth={2} fill="none" opacity={(1 - curl) * antennae}>
        <path d={`M ${rx - 4} -6 q 14 -12 24 -8`} />
        <path d={`M ${rx - 4} 6 q 14 12 24 8`} />
      </g>
    </g>
  );
};

/** a drawn fish head, ~120 x 80 local units */
const FishHead: React.FC = () => (
  <g>
    <path d="M -60 -40 C -10 -52, 40 -36, 60 0 C 40 36, -10 52, -60 40 L -48 0 Z" fill="#B7C2CC" stroke="#E8EEF3" strokeWidth={3} strokeLinejoin="round" />
    <circle cx={26} cy={-8} r={9} fill="#0B1B2B" />
    <path d="M 52 8 L 36 12" stroke="#0B1B2B" strokeWidth={3} strokeLinecap="round" />
    <path d="M -48 -34 L -56 34" stroke="#8C9AA6" strokeWidth={4} />
  </g>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const makeAt = cue(t, 0, "Now make it");
  const footAt = cue(t, 0, "a foot and a half");
  const isopodAt = cue(t, 1, "giant isopod");
  const relAt = cue(t, 1, "A real relative");
  const curlAt = cue(t, 2, "it curls into a ball");
  const cmAt = cue(t, 3, "just over a centimetre");
  const biggestAt = cue(t, 3, "among the biggest");
  const thousandAt = cue(t, 4, "more than a thousand");
  const headAt = cue(t, 4, "eating a fish head");
  const yearsAt = cue(t, 5, "years without eating");
  const foodAt = cue(t, 6, "when food finally comes");
  const gorgeAt = cue(t, 6, "they gorge");
  const endAt = L(8);
  const end = ease(frame, endAt, 12);

  // ---- line 0: ruler 0-45 cm at x 200-900 (15.6 px per cm); the bug grows to the full 45 cm on "a foot and a half"
  const s0 = 1 - ease(frame, L(1), 8);
  const grow = smooth(frame, makeAt, footAt + 24);
  const bugLen = lerp(60, 700, grow);
  const pot = 1 - ease(frame, makeAt, 12);

  // ---- clips (lines 1 and 4) and the still (2, 5, 6, 7)
  // The clip opens on NOAA's own title card (logo, "GIANT ISOPOD", "Gulf of Mexico 2017"): it is used only from frame
  // CLIP_CLEAN on (as L02 does), slowed to 0.75 so its 144 clean frames cover line 1; the still waits underneath and
  // takes over if the voiced line 1 runs longer. Line 4 uses the still (no second pass through the clip).
  const line1 = span(frame, L(1), L(2));
  const clip4 = span(frame, L(4), L(5));
  const clipEnd = L(1) + CLIP_RUN - 8;
  const clip1 = line1 * (1 - ease(frame, clipEnd, 8));
  const still = Math.min(1, line1 + span(frame, L(2), L(3)) + clip4 + span(frame, L(5), endAt));
  const grey = cur === 5 ? lin(frame, L(5), L(6)) : cur === 6 ? 1 - ease(frame, foodAt, 14) : 0;
  const dark = cur === 7 ? ease(frame, L(7), 16) : 0;
  const stillMove = cur === 1 ? { s: 1.08 + 0.06 * lin(frame, L(1), L(2)), o: "60% 50%" } : cur === 4 ? { s: 1.15 + 0.08 * lin(frame, L(4), L(5)), o: "45% 60%" } : cur === 2 ? { s: 1.12 + 0.1 * lin(frame, L(2), L(3)), o: "40% 92%" } : { s: 1.1 + 0.12 * lin(frame, L(5), endAt), o: "38% 62%" };

  // line 2: fourteen legs counted, then the drawn curl
  const legCount = Math.round(14 * lin(frame, L(2) + 4, L(2) + 34));
  const curl = smooth(frame, curlAt, curlAt + 30);

  // line 3: the egg, 0-2 cm ruler at x 200-800 (300 px per cm): it grows to 1.3 cm = 390 px
  const s3 = span(frame, L(3), L(4));
  const egg = smooth(frame, L(3) + 4, cmAt + 20);
  const eggD = 390 * egg;

  // line 5: the calendar flips
  const flips = Math.floor(lin(frame, L(5), L(6)) * 18);
  // line 6: the drawn fish head drops onto the sea floor
  const drop = smooth(frame, foodAt, foodAt + 22);

  const chip =
    cur === 0 || cur === 3
      ? { kind: "illustration" as const, source: undefined }
      : cur === 2 && frame >= curlAt
        ? { kind: "illustration" as const, source: "inset drawn · photo: NOAA Ocean Exploration, EX1711" }
        : cur === 4
          ? { kind: "illustration" as const, source: "fish head drawn · photo: NOAA, EX1711" }
          : cur === 6
            ? { kind: "illustration" as const, source: "fish head drawn · photo: NOAA, EX1711" }
            : { kind: "real" as const, source: "NOAA Ocean Exploration · EX1711" };

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, #10304A 0%, #0B1B2B 58%, #050E18 100%)" }}>
      {/* ---- line 0: a pill bug, then the same shape at 45 cm, on one ruler (drawn) */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: s0 }}>
        {/* the flowerpot it lives under, gone once it starts to grow */}
        <g opacity={pot} transform="translate(250 640)">
          <path d="M -70 -60 L 70 -60 L 52 60 L -52 60 Z" fill="#B5643C" stroke="#E09A72" strokeWidth={4} strokeLinejoin="round" />
          <rect x={-80} y={-80} width={160} height={26} rx={6} fill="#C9774D" />
        </g>
        <g transform={`translate(${200 + bugLen / 2 + (1 - grow) * 140} ${760 + 4 * Math.sin(frame / 9)}) scale(${bugLen / 100})`}>
          <PillBug frame={frame} antennae={1 - grow} />
        </g>
        <line x1={200} y1={1000} x2={900} y2={1000} stroke={B.paper} strokeWidth={4} />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={200 + (i * 700) / 9} y1={1000} x2={200 + (i * 700) / 9} y2={i === 0 || i === 9 ? 972 : 984} stroke={B.paper} strokeWidth={3} />
        ))}
      </svg>
      <Note x={180} y={1018} rows={["0"]} opacity={s0} size={26} />
      <Note x={540} y={1018} rows={["1½ ft · 45 cm"]} opacity={s0 * ease(frame, footAt, 10)} color={B.gauge} size={34} />

      {/* ---- the still (under the clip on line 1; lines 2, 4-7) */}
      {still > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden", opacity: still }}>
          <Img src={staticFile("assets/isopod-still.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "40% 55%", transform: `scale(${stillMove.s})`, transformOrigin: stillMove.o, filter: `saturate(${1 - 0.9 * grey}) brightness(${(0.88 - 0.25 * grey) * (1 - 0.55 * dark)})` }} />
        </div>
      ) : null}

      {/* ---- line 1: the NOAA clip (EX1711), past its title card */}
      {clip1 > 0 ? (
        <Sequence from={L(1)} durationInFrames={CLIP_RUN} layout="none">
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, opacity: clip1 }}>
            <OffthreadVideo src={staticFile("assets/isopod-swim.mp4")} trimBefore={CLIP_CLEAN} playbackRate={CLIP_RATE} muted style={{ width: 1080, height: 1180, objectFit: "cover", filter: "brightness(0.9)" }} />
          </div>
        </Sequence>
      ) : null}
      {clip1 + still > 0 ? <PlateFade /> : null}

      {/* line 1 */}
      <Card x={180} y={850} big={["GIANT ISOPOD"]} opacity={line1 * ease(frame, isopodAt, 10)} />
      <Note x={180} y={980} rows={["a real relative of the pill bug"]} opacity={line1 * ease(frame, relAt, 10)} color={B.gauge} size={30} />

      {/* line 2: fourteen legs, counted; then the drawn curl in an inset */}
      <div style={{ position: "absolute", left: 180, top: 790, opacity: span(frame, L(2), L(3)) }}>
        <div style={{ fontFamily: F.headline, fontSize: 110, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap", textShadow: "0 4px 18px rgba(0,0,0,0.8)" }}>{legCount} LEGS</div>
        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i} style={{ width: 14, height: 46, borderRadius: 7, background: i < legCount ? B.gauge : "rgba(255,255,255,0.18)" }} />
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 640, top: 840, width: 260, height: 240, borderRadius: 20, background: "rgba(5,14,24,0.9)", outline: `3px solid ${B.paper}`, opacity: span(frame, curlAt, L(3)) }} />
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: span(frame, curlAt, L(3)) }}>
        <g transform={`translate(770 ${940 + 3 * Math.sin(frame / 8)}) scale(1.6)`}>
          <PillBug curl={curl} frame={frame} />
        </g>
      </svg>
      <Note x={656} y={994} rows={["curls", "into a ball"]} opacity={span(frame, curlAt, L(3))} size={22} />

      {/* ---- line 3: the egg on a 0-2 cm ruler (drawn) */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: s3 }}>
        <ellipse cx={200 + eggD / 2} cy={780 - eggD * 0.02 * Math.sin(frame / 10)} rx={eggD / 2} ry={eggD * 0.46} fill="#E9D9A6" stroke="#FFF4CF" strokeWidth={4} opacity={0.92} />
        <ellipse cx={200 + eggD * 0.36} cy={780 - eggD * 0.16} rx={eggD * 0.1} ry={eggD * 0.06} fill="#FFFFFF" opacity={0.5} />
        <line x1={200} y1={1000} x2={800} y2={1000} stroke={B.paper} strokeWidth={4} />
        {Array.from({ length: 21 }, (_, i) => (
          <line key={i} x1={200 + i * 30} y1={1000} x2={200 + i * 30} y2={1000 - (i % 10 === 0 ? 26 : i % 5 === 0 ? 18 : 10)} stroke={B.paper} strokeWidth={3} />
        ))}
        <line x1={200 + 390} y1={600} x2={200 + 390} y2={1000} stroke={B.gauge} strokeWidth={4} strokeDasharray="10 8" opacity={ease(frame, cmAt, 10)} />
      </svg>
      <Note x={180} y={1018} rows={["0"]} opacity={s3} size={26} />
      <Note x={460} y={1018} rows={["1 cm"]} opacity={s3} size={26} />
      <Note x={760} y={1018} rows={["2 cm"]} opacity={s3} size={26} />
      <Note x={540} y={530} rows={["≈ 1.3 cm (½ in)"]} opacity={s3 * ease(frame, cmAt, 10)} color={B.gauge} size={34} />
      <Note x={180} y={262} rows={["its eggs: huge"]} opacity={s3} size={34} />
      <Note x={180} y={330} rows={["among the biggest", "of any marine invertebrate"]} opacity={s3 * ease(frame, biggestAt, 10)} color={B.gauge} size={30} />

      {/* ---- line 4: the clip is NOT the fish-head dive - said on the picture from its first frame */}
      <Note x={180} y={250} rows={["shown: a different NOAA dive, 2017"]} opacity={clip4} />
      <Card x={180} y={830} big={["> 1,000 m"]} opacity={clip4 * ease(frame, thousandAt, 10)} />
      <Note x={180} y={980} rows={["eating a fish head"]} opacity={clip4 * ease(frame, headAt, 10)} color={B.gauge} size={30} />
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: clip4 * ease(frame, headAt, 10) }}>
        <g transform={`translate(${720 + 6 * Math.sin(frame / 10)} 900) rotate(${8 * Math.sin(frame / 14)})`}>
          <FishHead />
        </g>
      </svg>

      {/* ---- lines 5-7 on the still: a wild animal, while the voice says "in captivity" */}
      <Note x={180} y={250} rows={["shown: a wild isopod · NOAA, 2017"]} opacity={span(frame, L(5), endAt)} />
      {/* the calendar: pages tear away, faster and faster */}
      <div style={{ position: "absolute", left: 660, top: 800, width: 230, height: 230, opacity: span(frame, L(5), L(6)) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: B.paper, boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 56, borderRadius: "18px 18px 0 0", background: B.tease }} />
        {Array.from({ length: 3 }, (_, k) => (
          <div key={`${flips}-${k}`} style={{ position: "absolute", left: 24, right: 24, top: 86 + k * 40, height: 18, borderRadius: 9, background: "#D5DCE3", opacity: ((flips + k) % 3) / 3 + 0.3 }} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 56 - 12 * ((frame % 6) / 6), height: 174, background: "#F0F3F6", opacity: 0.45, borderRadius: "0 0 18px 18px" }} />
      </div>
      <Card x={180} y={830} big={["YEARS"]} small={["no food"]} bg={B.tease} ink={B.paper} opacity={span(frame, yearsAt, L(6))} />

      {/* line 6: food comes (a drawn fish head drops in), and the colour comes back */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: span(frame, foodAt, L(7)) }}>
        <g transform={`translate(${770} ${lerp(-120, 820, drop)}) rotate(${lerp(-40, 12, drop)})`}>
          <FishHead />
        </g>
      </svg>
      <Card x={180} y={830} big={["THEY GORGE"]} opacity={span(frame, gorgeAt, L(7))} />

      {/* line 7: the question - and the next type lights with its name withheld */}
      <div style={{ position: "absolute", left: 180, top: 640, fontFamily: F.headline, fontSize: 220, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap", textShadow: "0 6px 30px rgba(0,0,0,0.85)", opacity: span(frame, L(7), endAt) * (0.85 + 0.15 * Math.sin(frame / 6)) }}>HOW?</div>
      <Note x={180} y={900} rows={["years with nothing to eat"]} opacity={span(frame, L(7), endAt)} size={30} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text={SERIES} opacity={1 - end} />
      <EndCard opacity={end} series={SERIES} line="8 ways to live in the dark" />
      <TypeRail current={5} flicker={cur === 5 || cur === 6 ? 6 : undefined} litHidden={cur === 7 ? 6 : undefined} wave={lin(frame, endAt + 8, endAt + 50)} label={1 - end} />
    </AbsoluteFill>
  );
};

export const ShortS09: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
