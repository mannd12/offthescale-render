import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { EndShot, W, H, Shot, makeShort } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Bracket } from "../L15-space-jump/props";
import { Count, C, Plaque, ez, mix } from "../S61-record-peak/kit61";
import { L19_COLORS, familyOf } from "../L19-into-jupiter/families";
import { Limb } from "../L19-into-jupiter/scenes/a-parts";
import { DeckBands, Wisps } from "../L19-into-jupiter/decks";
import { Capsule, Canopy, GhostProbe } from "../L19-into-jupiter/probe19";
import { TapeTrace } from "../L19-into-jupiter/tape";
import { BarDial } from "../L19-into-jupiter/dial";
import { StarsTint } from "../L19-into-jupiter/flows19";
import { Magnifier } from "../L19-into-jupiter/icons19";
import { OurSumPill } from "../L19-into-jupiter/tags19";
import vo from "./vo.json";

/**
 * S72 - A probe fell into Jupiter for 58 minutes and got under 0.25 % of the way in (episodes/S72-quarter-percent). For L19, answered at 5:50 (No floor).
 * Numbers (sources.md, L19 rows 1-4, 8, 9): December 1995; 58 minutes; 156 km of data; radius more than 71,000 km (71,492); less than a quarter of
 * one percent (0.218 %, our sum); 22 cm of a 100 m track (our sum, same ratio); 23 atmospheres (never "23 bar"). OUR SUM pill on our figures.
 * Withheld: what lies below (no surface, liquid and metallic hydrogen, the fuzzy core): the ghost probe sinks into a plain gradient with a "?".
 */
export const timeline = buildTimeline(vo as VoLine[]);

const LIMB = familyOf("limb");
const DEEP = familyOf("deepdeck");
const SCOPE = familyOf("scope");
const CREST_COLS = ["#F28A1E", "#FFC247", "#E2571F", "#FFE066", "#F2A31B", "#B8431A"];
const DEEP_COLS = ["#D8381C", "#F26A1E", "#A02418", "#C0301A", "#F28A1E", "#8E1A18"];

/** Space around the limb: L19's limb sky + drifting tinted stars (a full-frame mover). */
const Space: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky stops={LIMB.sky as unknown as string[]} x={0} y={0} w={W} h={H} />
    <StarsTint f={f} x={-200} y={-200} w={W + 400} h={H + 400} n={70} speed={6} seed={72} size={1.4} />
  </g>
);
/** L19's Limb clips to its landscape frame (y -200..1280): shift it down so the vertical frame's lower half is drawn. */
const VLimb: React.FC<{ f: number; cy: number; R: number; seed?: number; dy?: number }> = ({ f, cy, R, seed = 1, dy = 640 }) => (
  <g transform={`translate(0 ${dy})`}>
    <Limb f={f} cx={540} cy={cy - dy} R={R} shear={[16, -20, 22, -18, 20, -22]} seed={seed} />
  </g>
);
/** The fall: decks scroll up past the probe and shear sideways (L19's free mover). */
const Fall: React.FC<{ f: number; deep?: boolean; speed?: number }> = ({ f, deep, speed = 22 }) => (
  <g>
    <DeckBands f={f} speed={speed} shear={[18, -22, 24, -16, 20, -26]} x={-200} y={0} w={W + 400} h={H} colors={deep ? DEEP_COLS : CREST_COLS} belt={!deep} scale={1.6} />
    <Wisps f={f} x={0} y={0} w={W} h={1300} n={10} speed={26} />
  </g>
);
const Probe: React.FC<{ f: number; x: number; y: number; r?: number; dead?: number }> = ({ f, x, y, r = 70, dead = 0 }) => (
  <g>
    <Canopy x={x} y={y} r={r} unfurl={1} f={f} />
    <Capsule x={x} y={y} r={r} f={f} chips={6} dead={dead} tilt={Math.sin(f / 10) * 4} />
  </g>
);

/** a - December 1995: a real probe fell into Jupiter and kept talking for 58 minutes. */
const a1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} />
    <VLimb f={f} cy={2500} R={1500} />
    <Probe f={f} x={540} y={mix(560, 760, ez(f, 0, n))} r={60} />
    <Plaque x={540} y={190} text="DEC 1995" size={90} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={330} text="A PROBE FALLS INTO JUPITER" size={50} bg={C.ink} fg={C.cream} />
  </g>
);
const a2: Shot = ({ f, n }) => (
  <g>
    <Space f={f} />
    <VLimb f={f} cy={2300} R={1500} seed={2} />
    <Probe f={f} x={780} y={600} r={58} />
    <TapeTrace f={f + 40} x={60} y={860} w={960} h={110} mode="wave" speed={28} timer={ez(f, 0, Math.round(n * 0.7))} />
    <Plaque x={540} y={190} text="58 MINUTES" size={110} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={340} text="OF RADIO DATA" size={56} bg={C.ink} fg={C.cream} />
  </g>
);

/** b - data from a fall of 156 km. */
const b1: Shot = ({ f, n }) => (
  <g>
    <Fall f={f} />
    <Probe f={f} x={540} y={760} r={80} />
    <Count x={540} y={190} f={f} b={156} f1={Math.round(n * 0.6)} unit=" KM" w={620} size={120} />
  </g>
);
const b2: Shot = ({ f, n }) => (
  <g>
    <Fall f={f} deep speed={26} />
    <Probe f={f} x={420} y={mix(560, 900, ez(f, 0, n))} r={66} />
    <Bracket x1={760} y1={470} x2={760} y2={1050} draw={ez(f, 0, Math.round(n * 0.5))} color={L19_COLORS.heard} />
    <Plaque x={760} y={760} text="156 KM" size={56} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={190} text="OF DATA ON THE WAY DOWN" size={56} bg={C.ink} fg={C.cream} />
  </g>
);

/** c - Jupiter's radius is more than 71,000 km. */
const Radius: React.FC<{ f: number; draw: number }> = ({ f, draw }) => (
  <g>
    <VLimb f={f} cy={1050} R={620} seed={3} dy={300} />
    <line x1={540} y1={430} x2={540} y2={mix(430, 1050, draw)} stroke={L19_COLORS.heard} strokeWidth={12} strokeDasharray="30 16" strokeDashoffset={-f * 3} strokeLinecap="round" />
    <circle cx={540} cy={1050} r={18 * draw} fill={L19_COLORS.heard} />
  </g>
);
const c1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} />
    <Radius f={f} draw={ez(f, 0, Math.round(n * 0.6))} />
    <Plaque x={540} y={160} text="JUPITER'S RADIUS" size={60} bg={C.ink} fg={C.cream} />
    <Count x={540} y={310} f={f} b={71000} f1={Math.round(n * 0.6)} unit=" KM" w={760} size={110} />
  </g>
);
const c2: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <Radius f={f} draw={1} />
    <Plaque x={540} y={160} text="MORE THAN" size={64} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={310} text="71,000 KM" size={110} bg={C.ink} fg={C.amber} />
    <Plaque x={760} y={760} text="TO THE CENTRE" size={40} bg={C.ink} fg={C.cream} />
  </g>
);

/** d - less than a quarter of one percent of the way to the centre (our sum). The probe's share of an 880 px bar is ~1.9 px. */
const BAR_X = 100;
const BAR_W = 880;
const Share: React.FC<{ f: number; k: number; y: number }> = ({ f, k, y }) => (
  <g>
    <rect x={BAR_X} y={y - 50} width={BAR_W} height={100} rx={22} fill={C.ink} opacity={0.92} />
    <rect x={BAR_X + 10} y={y - 40} width={(BAR_W - 20) * k} height={80} rx={14} fill="#B8431A" />
    {/* the probe's part: 0.218 % of the bar, drawn true (a hair), with a pulsing ring so it can be found */}
    <rect x={BAR_X + 10} y={y - 40} width={Math.max(2, (BAR_W - 20) * 0.00218)} height={80} fill={L19_COLORS.heard} />
    <circle cx={BAR_X + 12} cy={y} r={58 + 8 * Math.sin(f / 5)} fill="none" stroke={L19_COLORS.heard} strokeWidth={8} />
  </g>
);
const d1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} />
    <VLimb f={f} cy={2600} R={1500} seed={4} />
    <Plaque x={540} y={560} text="THE WAY TO THE CENTRE" size={52} bg={C.ink} fg={C.cream} />
    <Share f={f} k={ez(f, 0, Math.round(n * 0.5))} y={700} />
    <Plaque x={300} y={860} text="THE PROBE" size={46} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={220} text="LESS THAN 0.25 %" size={84} bg={C.ink} fg={C.amber} />
    <OurSumPill x={540} y={72} size={32} align="middle" />
  </g>
);
const d2: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <VLimb f={f} cy={2600} R={1500} seed={4} />
    <Share f={f} k={1} y={700} />
    <Magnifier x={130 + Math.sin(f / 8) * 10} y={700} size={300} rotate={-20} />
    <Plaque x={540} y={220} text="LESS THAN 0.25 %" size={84} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={380} text="OF THE WAY IN" size={60} bg={C.ink} fg={C.cream} />
    <OurSumPill x={540} y={72} size={32} align="middle" />
  </g>
);

/** e - shrink the trip to 100 m: the probe got about 22 cm (our sum). A running track up the frame, 750 px = 100 m, so 22 cm ~ 1.7 px. */
const TOP = 420;
const BOT = 1170;
const Track: React.FC<{ f: number; draw: number }> = ({ f, draw }) => {
  const yTop = mix(BOT, TOP, draw);
  return (
    <g>
      <Sky stops={SCOPE.sky as unknown as string[]} x={0} y={0} w={W} h={H} />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={((i * 260 + f * 5) % 1560) - 260} y={0} width={180} height={H} fill="#FFE08A" opacity={0.1} transform="skewX(-10)" />
      ))}
      <path d={`M300 ${BOT} L460 ${yTop} L620 ${yTop} L780 ${BOT} Z`} fill="#C0301A" />
      {[0.25, 0.5, 0.75].map((k) => (
        <line key={k} x1={mix(300, 780, k)} y1={BOT} x2={mix(460, 620, k)} y2={yTop} stroke="#FFE8B0" strokeWidth={4} opacity={0.7} />
      ))}
      <rect x={290} y={BOT - 6} width={500} height={12} fill="#FFF6DC" />
      {draw > 0.95 ? <rect x={450} y={TOP - 6} width={180} height={12} fill={L19_COLORS.heard} /> : null}
    </g>
  );
};
const e1: Shot = ({ f, n }) => (
  <g>
    <Track f={f} draw={ez(f, 0, Math.round(n * 0.5))} />
    <Plaque x={540} y={TOP - 70} text="100 M" size={60} bg={C.ink} fg={C.cream} />
    <circle cx={540} cy={BOT - 2} r={34 + 6 * Math.sin(f / 5)} fill="none" stroke={L19_COLORS.heard} strokeWidth={8} />
    <Plaque x={540} y={190} text="SHRINK THE TRIP" size={84} bg={C.ink} fg={C.amber} />
    <OurSumPill x={540} y={72} size={32} align="middle" />
  </g>
);
const e2: Shot = ({ f }) => (
  <g>
    <Track f={f} draw={1} />
    <Plaque x={540} y={TOP - 70} text="100 M" size={60} bg={C.ink} fg={C.cream} />
    <rect x={500} y={BOT - 8} width={80} height={6} fill={L19_COLORS.heard} />
    <circle cx={540} cy={BOT - 2} r={34 + 6 * Math.sin(f / 5)} fill="none" stroke={L19_COLORS.heard} strokeWidth={8} />
    <Tick x={190} y={1170} pxPerM={250} frame={f} pose="point" expression="surprised" facing={1} />
    <Plaque x={885} y={1110} text="22 CM" size={56} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={190} text="ABOUT 22 CM" size={100} bg={C.ink} fg={C.amber} />
    <OurSumPill x={540} y={72} size={32} align="middle" />
  </g>
);

/** f - the signal stopped at 23 atmospheres; nothing more was heard. */
const f1: Shot = ({ f, n }) => (
  <g>
    <Fall f={f} deep speed={14} />
    <BarDial f={f} cx={540} cy={760} r={340} needle={mix(0.5, 23, ez(f, 0, Math.round(n * 0.6)))} lit={12 * ez(f, 0, Math.round(n * 0.6))} />
    <Plaque x={540} y={190} text="23 ATMOSPHERES" size={90} bg={C.ink} fg={C.amber} />
  </g>
);
const f2: Shot = ({ f }) => (
  <g>
    <Fall f={f} deep speed={10} />
    <Probe f={f} x={540} y={660} r={70} dead={Math.min(6, f / 4)} />
    <TapeTrace f={f + 200} x={60} y={960} w={960} h={110} mode="flat" speed={22} timer={1} />
    <Plaque x={540} y={190} text="SIGNAL LOST" size={100} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={340} text="NOTHING MORE HEARD" size={56} bg={C.ink} fg={C.cream} />
  </g>
);

/** g - what fills the rest of the way down; anything to land on? (withheld: no floor, liquid, metal, fuzzy core) */
const Below: React.FC<{ f: number; mark: string; rate: number }> = ({ f, mark, rate }) => (
  <g>
    <Sky stops={[DEEP.sky[2], LIMB.sky[2], LIMB.sky[0]]} x={0} y={0} w={W} h={H} />
    <StarsTint f={f} x={-200} y={-200} w={W + 400} h={H + 400} n={40} speed={-8} angle={90} seed={73} size={1.2} />
    <GhostProbe x={400 + Math.sin(f / rate) * 30} y={560 + ((f * 3) % 120)} r={110} f={f} />
    <Qmark f={f} x={720} y={900} size={420} />
    <Plaque x={540} y={190} text={mark} size={74} bg={C.ink} fg={C.amber} />
  </g>
);
const g1: Shot = ({ f }) => <Below f={f} mark="WHAT'S DOWN THERE?" rate={14} />;
const g2: Shot = ({ f }) => <Below f={f + 30} mark="ANYTHING TO LAND ON?" rate={8} />;

const end: Shot = ({ f }) => (
  <EndShot f={f} stops={LIMB.sky as unknown as string[]} q={["WHAT'S DOWN", "THERE?"]}>
    <Capsule x={930} y={1250} r={50} f={f} chips={6} tilt={Math.sin(f / 9) * 6} />
  </EndShot>
);

export const ShortS72 = makeShort(timeline, [[a1, a2], [b1, b2], [c1, c2], [d1, d2], [e1, e2], [f1, f2], [g1, g2], [end]]);
