import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { SERIES } from "../L02-deep-sea-types/ladder";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, TypeRail, cue, currentLine, lin, smooth, span } from "./shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S07 - the male who never lets go (episodes/S07-deep-anglerfish). Video 2's first Short: TYPE 1 · THE LURE.
 * Vertical 1080x1920. Type rail on the left (x 40-140), drawings and the photo inset at x 160-920, chip y ~1,170-1,216,
 * captions y 1,290-1,590 (shortKit). Lines: 0 to scale · 1 the lure (photo) · 2 he latches on · 3 fusion close-up ·
 * 4 permanent · 5 2 animals / 1 bloodstream / 1 lure · 6 the light isn't hers (photo) · 7 end card.
 * Honesty: the only photo is footballfish-noaa (Himantolophus sp., NOAA specimen, Bear Seamount 2002; sex not stated),
 * so nothing on it says "her"; its glow is drawn and the chip says ILLUSTRATION. The pair, the fusion and the blood
 * supply are drawn (no photo of a fused male is in the manifest). anglerfish-lophiodes (a goosefish) is not used.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

// the photo inset: footballfish-noaa in a 4:3 box (L02 shows it 600x450 with the bulb at (226, 54) - same crop, x1.267)
const BOX = { x: 160, y: 250, w: 760, h: 570 };
const K = BOX.w / 600;
const BULB = { x: BOX.x + 226 * K, y: BOX.y + 54 * K }; // (446, 318)
const BULB_ORIGIN = `${(226 / 600) * 100}% ${(54 / 450) * 100}%`;

// --- the drawn pair. Her, facing right, local units: tail tip x 0, snout x 530 (= her length), belly y 160, rod to the bulb at (590, -214)
const HER_TAIL = "M0 -70 L 92 0 L 0 70 Q 26 0 0 -70 Z";
const HER_BODY = "M80 0 C 100 -120, 260 -170, 380 -140 C 460 -120, 515 -70, 525 -20 L 420 20 L 530 45 C 510 110, 420 160, 300 160 C 180 160, 90 100, 80 0 Z";
const HER_ROD = "M 400 -140 Q 470 -270 590 -224";
const HER_BULB = { x: 590, y: -214 };
const HER_FILL = "#14364F";
const HER_EDGE = "#2E6E9E";

const Her: React.FC<{ glow: number; bump?: number; pulse?: number; frame: number }> = ({ glow, bump = 0, pulse = 0, frame }) => (
  <g>
    <path d={HER_TAIL} fill={HER_FILL} stroke={HER_EDGE} strokeWidth={4} strokeLinejoin="round" />
    <path d={HER_BODY} fill={HER_FILL} stroke={HER_EDGE} strokeWidth={4} strokeLinejoin="round" />
    {/* teeth along the open jaw */}
    <g stroke="#BFD0E0" strokeWidth={3} strokeLinecap="round">
      {[0.2, 0.45, 0.7].map((u) => (
        <line key={`u${u}`} x1={525 - 105 * u} y1={-20 + 40 * u} x2={525 - 105 * u + 4} y2={-20 + 40 * u + 14} />
      ))}
      {[0.25, 0.5, 0.75].map((u) => (
        <line key={`l${u}`} x1={420 + 110 * u} y1={20 + 25 * u} x2={420 + 110 * u - 3} y2={20 + 25 * u - 13} />
      ))}
    </g>
    <circle cx={445} cy={-62} r={10} fill="#6F8598" />
    <path d={HER_ROD} fill="none" stroke={HER_EDGE} strokeWidth={6} strokeLinecap="round" />
    {glow > 0 ? <circle cx={HER_BULB.x} cy={HER_BULB.y} r={36 + 10 * Math.sin(frame / 6)} fill="#BFEFFF" opacity={0.35 * glow} /> : null}
    <circle cx={HER_BULB.x} cy={HER_BULB.y} r={16} fill={glow > 0 ? "#DFF8FF" : "#2E6E9E"} opacity={0.4 + 0.6 * Math.max(glow, 0.3)} />
    {/* where he was: a small bump on her belly */}
    {bump > 0 ? <ellipse cx={300} cy={172} rx={16} ry={24} fill={HER_FILL} stroke={pulse > 0 ? "#E8322B" : HER_EDGE} strokeWidth={4 + 3 * pulse} opacity={bump} /> : null}
  </g>
);

/** Him: a small fish, length 100 local units, facing right (head at x 100). No lure, no light. */
const Him: React.FC<{ fill?: string; edge?: number }> = ({ fill = "#24506E", edge = 1 }) => (
  <g>
    <path d="M0 -13 L 22 0 L 0 13 Z" fill={fill} stroke={HER_EDGE} strokeOpacity={edge} strokeWidth={2} strokeLinejoin="round" />
    <ellipse cx={60} cy={0} rx={42} ry={16} fill={fill} stroke={HER_EDGE} strokeOpacity={edge} strokeWidth={2} />
    <circle cx={88} cy={-4} r={3} fill="#9FB3C4" />
  </g>
);

const Lock: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => (
  <g transform={`translate(${x} ${y})`} opacity={on}>
    <path d="M10 22 V12 a14 14 0 0 1 28 0 V22" fill="none" stroke={B.gauge} strokeWidth={6} strokeLinecap="round" />
    <rect x={2} y={22} width={44} height={34} rx={7} fill={B.gauge} />
    <circle cx={24} cy={38} r={5} fill={B.ink} />
  </g>
);

/** the photo inset (lines 1 and 6). Zoom is about the bulb, so the bulb never moves and the drawn glow stays on it. */
const Photo: React.FC<{ on: number; zoom: number; glow: number; flicker: number; frame: number }> = ({ on, zoom, glow, flicker, frame }) => {
  if (on <= 0) return null;
  const r = 28 * zoom;
  const g = glow * (1 - flicker * 0.45 * (0.5 + 0.5 * Math.sin(frame / 2.3)));
  return (
    <>
      <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h, borderRadius: 22, overflow: "hidden", outline: `4px solid ${B.paper}`, boxShadow: "0 12px 40px rgba(0,0,0,0.6)", background: B.ink, opacity: on }}>
        <Img src={staticFile("assets/footballfish-noaa.jpg")} style={{ display: "block", width: BOX.w, height: BOX.h, objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: BULB_ORIGIN }} />
      </div>
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: on }}>
        <circle cx={BULB.x} cy={BULB.y} r={r + 22 + 8 * Math.sin(frame / 6)} fill="#BFEFFF" opacity={0.3 * g} />
        <circle cx={BULB.x} cy={BULB.y} r={r * 0.75} fill="#E6FAFF" opacity={0.75 * g} />
        <circle cx={BULB.x} cy={BULB.y} r={r + 8} fill="none" stroke={B.gauge} strokeWidth={5} opacity={0.9 * g} />
      </svg>
    </>
  );
};

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  // line 0
  const himAt = cue(t, 0, "He's two point eight");
  // line 1
  const lureAt = cue(t, 1, "a glowing lure");
  const noLureAt = cue(t, 1, "He has no lure");
  // line 2
  const findsAt = cue(t, 2, "when he finds her");
  const latchAt = cue(t, 2, "he latches on");
  const neverAt = cue(t, 2, "And he never lets go");
  // line 3
  const fusesAt = cue(t, 3, "his body fuses");
  const bloodAt = cue(t, 3, "Their blood supply");
  const joinsAt = cue(t, 3, "joins up");
  // line 4
  const permAt = cue(t, 4, "permanent");
  const restAt = cue(t, 4, "for the rest");
  // line 5
  const twoAt = cue(t, 5, "Two animals");
  const oneBloodAt = cue(t, 5, "One bloodstream");
  const oneLureAt = cue(t, 5, "One lure");
  // line 6
  const lightAt = cue(t, 6, "the light she fishes with");
  const hersAt = cue(t, 6, "It isn't even hers");
  const endAt = L(7);

  const end = ease(frame, endAt, 12);
  const s0 = 1 - ease(frame, L(1), 8); // already on at frame 0: no fade-in
  const s1 = span(frame, L(1), L(2));
  const s2 = span(frame, L(2), L(3));
  const s3 = span(frame, L(3), L(4));
  const s4 = span(frame, L(4), L(5));
  const s5 = span(frame, L(5), L(6));
  const s6 = span(frame, L(6), endAt);

  // marine snow: slow drifting specks behind everything, so no frame is ever still
  const snow = Array.from({ length: 26 }, (_, i) => {
    const x = (i * 197) % 1000 + 40;
    const y = ((i * 331 + frame * (0.6 + (i % 5) * 0.15)) % 1200) - 20;
    return <circle key={i} cx={x + 8 * Math.sin(frame / 40 + i)} cy={y} r={1.5 + (i % 3)} fill="#9FC7E0" opacity={0.18} />;
  });

  // line 2: he swims in from the lower right and latches onto her belly; her = translate(170 700) scale 1.15
  const herS2 = { x: 170, y: 700, s: 1.15 };
  const attach = { x: herS2.x + 300 * herS2.s, y: herS2.y + 160 * herS2.s }; // (515, 884)
  const swim = smooth(frame, findsAt, latchAt + 6);
  const hx = lerp(880, attach.x, swim);
  const hy = lerp(1110, attach.y, swim) + 6 * Math.sin(frame / 5) * (1 - swim);
  const hrot = lerp(-150, -90, swim);

  // line 3 close-up
  const fuse = smooth(frame, fusesAt, fusesAt + 40);
  const vessel = smooth(frame, bloodAt, bloodAt + 30);
  const himFill = `rgb(${Math.round(lerp(0x24, 0x14, fuse))}, ${Math.round(lerp(0x50, 0x36, fuse))}, ${Math.round(lerp(0x6e, 0x4f, fuse))})`;
  const zoom3 = 1.05 + 0.1 * lin(frame, L(3), L(4)); // a slow push in on the join

  // line 4: zoom out on her, the bump where he was
  const s4scale = lerp(1.2, 1.05, smooth(frame, L(4), L(5)));

  // chip
  const chip =
    cur === 0
      ? { source: "to scale" }
      : cur === 1 || cur === 6
        ? { source: "drawn glow · NOAA photo: footballfish, 2002" }
        : { source: undefined };

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 40%, #10304A 0%, #0B1B2B 55%, #050E18 100%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{snow}</svg>

      {/* ---- line 0: the two of them on one ruler, already on screen at frame 0. 30 px = 1 cm; she is 20 cm (x 200-800), he is 2.8 cm (84 px) */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: s0 }}>
        <g transform={`translate(200 ${760 + 6 * Math.sin(frame / 14)}) scale(${600 / 530})`}>
          <Her glow={0.25} frame={frame} />
        </g>
        <line x1={200} y1={985} x2={200 + 600 * lin(frame, 0, 24)} y2={985} stroke={B.paper} strokeWidth={4} />
        {Array.from({ length: 21 }, (_, i) => (
          <line key={i} x1={200 + i * 30} y1={985} x2={200 + i * 30} y2={985 - (i % 5 === 0 ? 22 : 12)} stroke={B.paper} strokeWidth={3} opacity={lin(frame, i, i + 6)} />
        ))}
        <g opacity={ease(frame, himAt, 10)}>
          <g transform={`translate(${200 + 3 * Math.sin(frame / 7)} 1045) scale(0.84)`}>
            <Him />
          </g>
          <line x1={200} y1={1072} x2={284} y2={1072} stroke={B.gauge} strokeWidth={4} />
          <line x1={200} y1={1062} x2={200} y2={1082} stroke={B.gauge} strokeWidth={4} />
          <line x1={284} y1={1062} x2={284} y2={1082} stroke={B.gauge} strokeWidth={4} />
        </g>
      </svg>
      <Note x={200} y={410} rows={["HER · 20 cm"]} opacity={s0} color={B.gauge} size={34} />
      <Note x={310} y={1018} rows={["HIM · 2.8 cm"]} opacity={s0 * ease(frame, himAt, 10)} color={B.gauge} size={34} />

      {/* ---- line 1: the real deep-sea anglerfish (a NOAA specimen); the glow on its bulb is drawn */}
      <Photo on={s1} zoom={1 + 0.06 * lin(frame, L(1), L(2))} glow={ease(frame, lureAt, 14)} flicker={0} frame={frame} />
      <Note x={176} y={724} rows={["a real deep-sea anglerfish", "footballfish · NOAA specimen, 2002"]} opacity={s1} />
      <Note x={510} y={268} rows={["the lure", "a glowing bulb"]} opacity={s1 * ease(frame, lureAt, 10)} color="#BFEFFF" size={28} />
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: s1 * ease(frame, noLureAt, 10) }}>
        <g transform={`translate(${220 + 10 * Math.sin(frame / 9)} ${985 + 5 * Math.sin(frame / 6)}) scale(1.6)`}>
          <Him />
        </g>
      </svg>
      <Note x={450} y={930} rows={["him", "no lure · no light"]} opacity={s1 * ease(frame, noLureAt, 10)} size={28} />

      {/* ---- line 2: drawn - he finds her and latches on */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: s2 }}>
        <g transform={`translate(${herS2.x} ${herS2.y + 5 * Math.sin(frame / 16)}) scale(${herS2.s})`}>
          <Her glow={0.6} frame={frame} />
        </g>
        <g opacity={ease(frame, findsAt - 10, 10)} transform={`translate(${hx} ${hy + 5 * Math.sin(frame / 16) * swim}) rotate(${hrot}) translate(-100 0)`}>
          <Him />
        </g>
        <Lock x={580} y={880} on={ease(frame, neverAt, 10)} />
      </svg>
      <Note x={180} y={262} rows={["in some deep-sea anglerfish"]} opacity={s2} />
      <Note x={645} y={890} rows={["never lets go"]} opacity={s2 * ease(frame, neverAt, 10)} color={B.gauge} size={28} />

      {/* ---- line 3: the same two drawings as line 2 (same scale), him attached under her belly. They merge: his colour
          blends into hers and both outlines at the join fade; then one blood supply runs from her body down into his and back */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: s3 }}>
        <g transform={`translate(${attach.x} 800) scale(${zoom3}) translate(${-attach.x} -800)`}>
          <g transform={`translate(${herS2.x} ${herS2.y}) scale(${herS2.s})`}>
            <Her glow={0.6} frame={frame} />
          </g>
          <g transform={`translate(${attach.x} ${attach.y}) rotate(-90) translate(-100 0)`}>
            <Him fill={himFill} edge={1 - 0.85 * fuse} />
          </g>
          {/* the seam: covered in her colour as they fuse */}
          <ellipse cx={attach.x} cy={attach.y + 2} rx={20} ry={5 + 10 * fuse} fill={HER_FILL} opacity={fuse} />
          <path d={`M ${attach.x - 18} ${attach.y} Q ${attach.x} ${attach.y + 6} ${attach.x + 18} ${attach.y}`} fill="none" stroke={B.paper} strokeWidth={3} strokeDasharray="6 5" opacity={1 - fuse} />
          {/* the blood supply: drawn in, then flowing */}
          {[
            { stroke: "#E8322B", w: 6, dash: "1 1", off: 1 - vessel, op: 1 },
            { stroke: "#FFB0A8", w: 3, dash: "0.015 0.05", off: -frame / 220, op: ease(frame, joinsAt, 12) },
          ].map((s) => (
            <path key={s.stroke} d={`M 420 760 C 470 800, ${attach.x - 6} 830, ${attach.x - 6} ${attach.y} L ${attach.x - 6} ${attach.y + 66} Q ${attach.x} ${attach.y + 80} ${attach.x + 6} ${attach.y + 66} L ${attach.x + 6} ${attach.y} C ${attach.x + 6} 830, 560 800, 620 760`} pathLength={1} fill="none" stroke={s.stroke} strokeWidth={s.w} strokeLinecap="round" strokeDasharray={s.dash} strokeDashoffset={s.off} opacity={s.op} />
          ))}
        </g>
      </svg>
      <Note x={180} y={1086} rows={["his body fuses into hers"]} opacity={s3 * ease(frame, fusesAt, 10)} />
      <Note x={580} y={950} rows={["one blood supply"]} opacity={s3 * ease(frame, joinsAt, 10)} color="#FF8A80" size={28} />

      {/* ---- line 4: drawn - zooming out on her; he is now a bump on her belly */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: s4 }}>
        <g transform={`translate(540 ${690 + 4 * Math.sin(frame / 15)}) scale(${s4scale}) translate(-300 50)`}>
          <Her glow={0.6} bump={1} pulse={0.5 + 0.5 * Math.sin(frame / 7)} frame={frame} />
        </g>
      </svg>
      <Note x={180} y={990} rows={["permanent"]} opacity={s4 * ease(frame, permAt, 10)} color={B.gauge} size={34} />
      <Note x={180} y={1062} rows={["for the rest of both their lives"]} opacity={s4 * ease(frame, restAt, 10)} />

      {/* ---- line 5: three beats, one per sentence; she sits under them, the bump pulses, the bulb lights on "One lure" */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: s5 }}>
        <g transform={`translate(540 ${900 + 4 * Math.sin(frame / 15)}) scale(0.75) translate(-300 50)`}>
          <Her glow={ease(frame, oneLureAt, 12) * (0.8 + 0.2 * Math.sin(frame / 4))} bump={1} pulse={frame >= oneBloodAt ? 1 : 0} frame={frame} />
        </g>
      </svg>
      {[
        { at: twoAt, text: "2 ANIMALS", y: 280, color: B.paper },
        { at: oneBloodAt, text: "1 BLOODSTREAM", y: 410, color: "#FF8A80" },
        { at: oneLureAt, text: "1 LURE", y: 540, color: "#BFEFFF" },
      ].map((b) => (
        <div key={b.text} style={{ position: "absolute", left: 180, top: b.y + 20 * (1 - ease(frame, b.at, 10)), fontFamily: F.headline, fontSize: 104, lineHeight: 1, color: b.color, whiteSpace: "nowrap", textShadow: "0 4px 18px rgba(0,0,0,0.8)", opacity: s5 * ease(frame, b.at, 8) }}>
          {b.text}
        </div>
      ))}

      {/* ---- line 6: back to the photo, in on the bulb; the drawn glow flickers */}
      <Photo on={s6} zoom={1 + 0.3 * smooth(frame, L(6), hersAt)} glow={1} flicker={ease(frame, hersAt, 10)} frame={frame} />
      <Note x={176} y={764} rows={["footballfish · NOAA specimen, 2002"]} opacity={s6} />
      <Note x={520} y={268} rows={["the light", "she fishes with"]} opacity={s6 * ease(frame, lightAt, 10) * (1 - ease(frame, hersAt, 8))} color="#BFEFFF" size={28} />
      <Card x={180} y={870} big={["THE LIGHT", "ISN'T HERS"]} bg={B.tease} ink={B.paper} opacity={s6 * ease(frame, hersAt, 10)} />

      {/* chip: left edge, under the rail */}
      <div style={{ opacity: 1 - end }}>
        <CreditChip kind="illustration" source={chip.source} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text={SERIES} opacity={1 - end} />
      <EndCard opacity={end} series={SERIES} line="8 ways to live in the dark" />
      <TypeRail current={1} wave={lin(frame, endAt + 8, endAt + 50)} label={1 - end} />
    </AbsoluteFill>
  );
};

export const ShortS07: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
