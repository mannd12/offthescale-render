import React from "react";
import { Bloom, CloudRack, Counter, Embers, Risers, Sky, Streamers, Tick, rnd, smoothPath } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, Derrick, EndShot, Glow, Plaque, Strata, T, W, H, Shot, ez, makeShort, mix, ramp } from "../S41-dig-plate/vkit";
import vo from "./vo.json";

/**
 * S44 - a hundred and eighty (episodes/S44-dig-heat). For L11, answered at 2:47. Vertical 1080x1920, kit v2.
 * 20 shots. Numbers (sources.md): #15 about 100 expected, about 180 found, +80 past boiling; #14 1 C per 100 m near the
 * top, 1.7-2 C per 100 m at 6-7 km ("closer to two"); #21 266 C straight-line projection at 15 km (shown dashed, tagged
 * PROJECTED); #4 15 km plan. What broke (#16 rubber/glue, #20 deformation, #12 round trips) is withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const FONT = "'Outfit', sans-serif";
const HOT: [number, string][] = [
  [160, "#B04A18"],
  [110, "#7A3418"],
  [190, "#E3813F"],
  [130, "#6A2210"],
  [150, "#F6B45A"],
];
const EMBER_SKY = ["#2B0C08", "#6A2210", "#B04A18"];
const TOP = 250;
const BOT = 1100;
const yOf = (c: number) => BOT - ((BOT - TOP) * c) / 300;

/** A thermometer: tube 0-300 C, bulb, mercury at `level`, optional dashed ghost to `ghost`, and 50-degree marks. */
const Thermo: React.FC<{ x: number; level: number; w?: number; f?: number; ghost?: number; marks?: boolean; shake?: number }> = ({ x, level, w = 120, f = 0, ghost, marks = true, shake = 0 }) => {
  const sx = Math.sin(f * 2.7) * shake;
  return (
    <g transform={`translate(${sx} 0)`}>
      <rect x={x - w / 2} y={TOP - 30} width={w} height={BOT - TOP + 80} rx={w / 2} fill={C.ink} />
      <circle cx={x} cy={BOT + 60} r={w * 0.95} fill={C.ink} />
      <rect x={x - w / 2 + 14} y={TOP - 16} width={w - 28} height={BOT - TOP + 70} rx={(w - 28) / 2} fill="#1B4C5C" />
      {ghost !== undefined ? <rect x={x - w / 2 + 14} y={yOf(ghost)} width={w - 28} height={BOT - yOf(ghost) + 40} rx={(w - 28) / 2} fill="none" stroke={C.amber} strokeWidth={8} strokeDasharray="18 12" strokeDashoffset={-f * 2} opacity={0.6 + 0.4 * Math.sin(f / 4)} /> : null}
      <rect x={x - w / 2 + 14} y={yOf(level)} width={w - 28} height={BOT - yOf(level) + 50} rx={(w - 28) / 2} fill={C.verm} />
      <circle cx={x} cy={BOT + 60} r={w * 0.95 - 14} fill={C.verm} />
      {marks
        ? [0, 50, 100, 150, 200, 250, 300].map((c) => (
            <g key={c}>
              <line x1={x + w / 2} x2={x + w / 2 + 34} y1={yOf(c)} y2={yOf(c)} stroke={C.cream} strokeWidth={6} />
              <text x={x + w / 2 + 46} y={yOf(c) + 12} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, fill: C.cream }}>
                {c}
              </text>
            </g>
          ))
        : null}
    </g>
  );
};

const Kettle: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(f * 1.6) * 1.6})`}>
    <path d="M-150 0 Q-150 -230 0 -230 Q150 -230 150 0 Z" fill={C.sea} />
    <path d="M-150 0 Q-150 -230 0 -230" stroke={C.ice} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.7} />
    <path d="M140 -70 Q300 -170 330 -300 L290 -300 Q250 -170 130 -130 Z" fill={C.sea} />
    <path d="M-150 -150 Q-290 -170 -230 -40" stroke={C.ink} strokeWidth={26} fill="none" strokeLinecap="round" />
    <rect x={-170} y={-8} width={340} height={30} rx={14} fill={C.ink} />
    <ellipse cx={0} cy={-232} rx={70} ry={20} fill={C.ice} />
    <circle cx={0} cy={-262} r={22} fill={C.amber} />
  </g>
);

const Heat: React.FC<{ f: number; opacity?: number }> = ({ f, opacity = 0.3 }) => <Streamers f={f} n={9} x0={-300} x1={1400} y0={200} y1={1150} len={420} width={26} speed={4} color={C.gold} opacity={opacity} slope={-0.18} seed={5} />;

/** a - Tick lowers a thermometer down the hole. */
const a: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  const ty = mix(480, 1020, k);
  return (
    <g>
      <Sky stops={["#1E6678", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={450} />
      <CloudRack f={f} n={3} x0={-400} x1={1500} y0={60} y1={350} size={90} speed={2.6} body={C.cream} under={C.ice} top="#FFFFFF" seed={3} />
      <rect x={0} y={420} width={W} height={H - 420} fill="#146A6C" />
      <Strata f={f} speed={7} bands={HOT} y0={420} amp={20} seed={3} />
      <rect x={500} y={420} width={80} height={H} fill={C.ink} />
      <line x1={540} y1={300} x2={540} y2={ty} stroke={C.cream} strokeWidth={8} />
      <g transform={`translate(540 ${ty + 100}) scale(0.5)`}>
        <rect x={-60} y={-200} width={120} height={360} rx={60} fill={C.cream} />
        <rect x={-30} y={-60} width={60} height={200} rx={30} fill={C.verm} />
        <circle cy={170} r={76} fill={C.verm} />
      </g>
      <Tick x={200} y={430} pxPerM={250} frame={f} pose="heave" expression="determined" facing={1} />
      <Plaque x={540} y={1100} text="EXPECTED: ~100 °C" size={62} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** b - the kettle: 100 degrees is boiling. */
const b: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <Streamers f={f} n={8} x0={-300} x1={1400} y0={150} y1={1150} len={380} width={24} speed={4} color={C.mint} opacity={0.3} slope={0.04} seed={7} />
    <Kettle x={470} y={1000} s={1.5} f={f} />
    <Risers frame={f} x0={820} x1={900} y={620} n={14} color={C.foam} rise={5} life={55} size={22} wiggle={30} grow glow />
    <Plaque x={540} y={260} text="100 °C" size={170} bg={C.ink} fg={C.amber} />
    <T x={540} y={410} text="BOILING WATER" size={70} />
  </g>
);

/** c - it overshoots: 100 -> 180. */
const c: Shot = ({ f, n }) => {
  const lvl = mix(100, 180, ez(f, 2, n - 3));
  return (
    <g>
      <Sky stops={EMBER_SKY} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={5} bands={HOT} amp={20} seed={2} />
      <rect x={0} y={0} width={W} height={H} fill={C.maroon} opacity={0.4} />
      <Glow x={380} y={yOf(lvl)} r={420} color={C.gold} f={f} strength={0.7} />
      <Thermo x={380} level={lvl} f={f} shake={f > 8 ? 3 : 0} ghost={undefined} />
      <g>
        <line x1={150} x2={930} y1={yOf(100)} y2={yOf(100)} stroke={C.cream} strokeWidth={6} strokeDasharray="22 14" strokeDashoffset={-f * 3} />
        <Plaque x={800} y={yOf(100) - 52} text="EXPECTED" size={44} bg={C.ink} fg={C.cream} />
      </g>
      <rect x={560} y={330} width={420} height={220} rx={40} fill={C.ink} opacity={0.93} />
      <Counter x={720} y={500} value={lvl} max={180} size={140} color={C.amber} align="middle" />
      <text x={855} y={420} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, fill: C.cream }}>
        °C
      </text>
      <Embers frame={f} x0={330} x1={430} y={yOf(lvl)} n={22} color={C.amber} seed={4} rise={4} />
      <T x={770} y={640} text="ABOUT" size={46} />
    </g>
  );
};

/** d - the gap: +80 past boiling. */
const d: Shot = ({ f, n }) => {
  const k = ez(f, 2, 16);
  return (
    <g>
      <Sky stops={EMBER_SKY} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={4} bands={HOT} amp={20} seed={4} />
      <rect x={0} y={0} width={W} height={H} fill={C.maroon} opacity={0.4} />
      <Thermo x={300} level={180} f={f} marks={false} />
      <g>
        <line x1={380} x2={640} y1={yOf(100)} y2={yOf(100)} stroke={C.cream} strokeWidth={8} />
        <line x1={380} x2={640} y1={yOf(180)} y2={yOf(180)} stroke={C.cream} strokeWidth={8} />
        <path d={`M610 ${yOf(100)} V${mix(yOf(100), yOf(180), k)}`} stroke={C.amber} strokeWidth={14} strokeLinecap="round" />
        <path d={`M586 ${mix(yOf(100), yOf(180), k) + 28} L610 ${mix(yOf(100), yOf(180), k)} L634 ${mix(yOf(100), yOf(180), k) + 28}`} stroke={C.amber} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Plaque x={810} y={mix(yOf(100), yOf(180), 0.5)} text="+80 °C" size={120} bg={C.ink} fg={C.amber} scale={0.6 + 0.4 * k} />
      <Plaque x={540} y={yOf(100) + 90} text="BOILING" size={56} bg={C.sea} fg={C.cream} />
      <Embers frame={f} x0={260} x1={340} y={yOf(180)} n={18} color={C.amber} seed={6} rise={4} />
    </g>
  );
};

/** e - Tick in the heat. */
const e: Shot = ({ f }) => (
  <g>
    <Sky stops={["#B04A18", "#E3813F", "#F6B45A"]} x={0} y={0} w={W} h={H} />
    <Bloom x={540} y={520} r={760 + 30 * Math.sin(f / 6)} color={C.gold} strength={0.9} />
    <Heat f={f} opacity={0.4} />
    <Chips f={f} n={14} y0={150} y1={1100} color={C.cream} speed={10} opacity={0.35} seed={8} />
    <Tick x={540} y={1230} pxPerM={560} frame={f} pose="wipe-brow" expression="worried" facing={1} />
    <Plaque x={540} y={240} text="80 °C PAST BOILING" size={68} bg={C.ink} fg={C.amber} />
  </g>
);

/** f - the plan: 15 km. */
const f_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  const tip = mix(330, 1130, k);
  return (
    <g>
      <Sky stops={["#1E6678", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={330} />
      <rect x={0} y={330} width={W} height={H - 330} fill="#146A6C" />
      <Strata f={f} speed={5} bands={HOT} y0={330} amp={20} seed={6} />
      <rect x={507} y={330} width={26} height={tip - 330} rx={13} fill={C.ink} />
      <Glow x={520} y={tip} r={170} color={C.amber} f={f} strength={0.8} />
      <circle cx={520} cy={tip} r={18} fill={C.cream} />
      <Derrick f={f * 2} x={250} y={340} s={1.2} />
      <Plaque x={780} y={1130} text="PLAN: 15 KM" size={72} bg={C.ink} fg={C.amber} />
      <rect x={560} y={400} width={420} height={210} rx={40} fill={C.ink} opacity={0.93} />
      <Counter x={720} y={550} value={15 * k} max={15} size={140} color={C.amber} align="middle" digits={2} />
      <text x={850} y={550} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 50, fill: C.cream }}>
        km
      </text>
    </g>
  );
};

/** g - the graph: found at 12 km, projected to 15 km. */
const Chart: React.FC<{ f: number; draw: number; proj: number }> = ({ f, draw, proj }) => {
  const x0 = 150;
  const y0 = 1100;
  const px = 52;
  const py = 2.4;
  const P = (km: number, c: number): [number, number] => [x0 + km * px, y0 - c * py];
  const pts: [number, number][] = [P(0, 0), P(3, 36), P(6, 76), P(9, 124), P(12.262, 180)];
  const curve = smoothPath(pts);
  return (
    <g>
      <path d={`M${x0} ${y0} H940 M${x0} ${y0} V330`} stroke={C.cream} strokeWidth={8} fill="none" strokeLinecap="round" />
      {[0, 5, 10, 15].map((km) => (
        <text key={km} x={x0 + km * px} y={y0 + 50} textAnchor="middle" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, fill: C.cream }}>
          {km}
        </text>
      ))}
      <text x={540} y={y0 + 100} textAnchor="middle" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, fill: C.mint }}>
        DEPTH (KM)
      </text>
      <path d={curve} stroke={C.verm} strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray="1600" strokeDashoffset={1600 * (1 - draw)} />
      <path d={`M${P(12.262, 180)[0]} ${P(12.262, 180)[1]} L${P(15, 266)[0]} ${P(15, 266)[1]}`} stroke={C.amber} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray="24 16" strokeDashoffset={-f * 2} opacity={proj} />
      <circle cx={P(12.262, 180)[0]} cy={P(12.262, 180)[1]} r={18} fill={C.cream} />
      <circle cx={P(15, 266)[0]} cy={P(15, 266)[1]} r={22 + 6 * Math.sin(f / 3)} fill="none" stroke={C.amber} strokeWidth={8} strokeDasharray="10 8" opacity={proj} />
    </g>
  );
};

const g: Shot = ({ f, n }) => (
  <g>
    <Sky stops={EMBER_SKY} x={0} y={0} w={W} h={H} />
    <Strata f={f} speed={3} bands={HOT} amp={20} seed={7} />
    <rect x={0} y={0} width={W} height={H} fill={C.maroon} opacity={0.5} />
    <Chart f={f} draw={ez(f, 0, n - 10)} proj={ez(f, n - 14, n)} />
    <T x={540} y={250} text="TEMPERATURE vs DEPTH" size={54} upper={false} />
    <T x={540} y={330} text="SCHEMATIC" size={40} color={C.mint} />
  </g>
);

/** h - the projected value, in outline. */
const h: Shot = ({ f }) => {
  const z = 1.5;
  return (
    <g>
      <Sky stops={EMBER_SKY} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={3} bands={HOT} amp={20} seed={9} />
      <rect x={0} y={0} width={W} height={H} fill={C.maroon} opacity={0.5} />
      <g transform={`translate(720 600) scale(${z}) translate(${-(150 + 15 * 52)} ${-(1100 - 266 * 2.4)})`}>
        <Chart f={f} draw={1} proj={1} />
      </g>
      <Glow x={720} y={600} r={380} color={C.gold} f={f} strength={0.7} period={20} />
      <Plaque x={540} y={260} text="~266 °C" size={160} bg={C.ink} fg={C.amber} />
      <Plaque x={540} y={420} text="PROJECTED" size={60} bg={C.cream} fg={C.ink} />
    </g>
  );
};

/** i - found vs projected on one thermometer. */
const i_: Shot = ({ f }) => (
  <g>
    <Sky stops={EMBER_SKY} x={0} y={0} w={W} h={H} />
    <Strata f={f} speed={4} bands={HOT} amp={20} seed={1} />
    <rect x={0} y={0} width={W} height={H} fill={C.maroon} opacity={0.45} />
    <Thermo x={330} level={180} ghost={266} f={f} shake={1.5} />
    <Glow x={330} y={yOf(266)} r={300} color={C.gold} f={f} strength={0.6} period={18} />
    <Plaque x={760} y={yOf(266) + 10} text="~266 °C" size={80} bg={C.ink} fg={C.amber} />
    <Plaque x={760} y={yOf(266) + 100} text="PROJECTED · 15 KM" size={42} bg={C.cream} fg={C.ink} />
    <Plaque x={760} y={yOf(180) + 20} text="~180 °C" size={80} bg={C.ink} fg={C.cream} />
    <Plaque x={760} y={yOf(180) + 110} text="FOUND" size={42} bg={C.verm} fg={C.cream} />
    <Embers frame={f} x0={280} x1={380} y={yOf(180)} n={14} color={C.amber} seed={2} rise={4} />
  </g>
);

/** j - walking down 100-m steps, each a little warmer. */
const j: Shot = ({ f, n }) => {
  const u = 5 * ez(f, 0, n - 1);
  const stepI = Math.min(4, Math.floor(u));
  const frac = u - stepI;
  const tx = 130 + u * 150;
  const ty = 420 + (stepI + ez(frac * 100, 60, 100)) * 150;
  const warm = u / 5;
  return (
    <g>
      <Sky stops={["#146A6C", mix(0, 1, warm) > 0.5 ? "#B04A18" : "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <rect x={0} y={0} width={W} height={H} fill={C.orange} opacity={warm * 0.6} />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <rect x={90 + i * 150} y={420 + i * 150} width={170} height={H} fill={i % 2 ? C.teal : C.petrol} />
          <Plaque x={175 + i * 150} y={460 + i * 150} text={i === 0 ? "0" : `+${i}°`} size={40} bg={C.ink} fg={C.amber} w={90} />
        </g>
      ))}
      <Tick x={tx} y={ty} pxPerM={250} frame={f} walk={f / 18} pose="stand" expression="determined" facing={1} />
      <Plaque x={540} y={220} text="DOWN 100 M = WARMER" size={58} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** k - a tight ruler: about 1 degree every 100 m. */
const Ruler: React.FC<{ f: number; speed: number; gap: number; label: string; sub?: string; bg: string[] }> = ({ f, speed, gap, label, sub, bg }) => {
  const off = (f * speed) % gap;
  return (
    <g>
      <Sky stops={bg} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={speed * 0.8} bands={HOT} amp={20} seed={3} x0={560} x1={1100} />
      <rect x={0} y={0} width={560} height={H} fill={C.ink} opacity={0.88} />
      {Array.from({ length: Math.ceil(1300 / gap) + 2 }, (_, i) => {
        const y = 180 + i * gap - off;
        return (
          <g key={i}>
            <line x1={120} x2={i % 2 ? 330 : 420} y1={y} y2={y} stroke={C.cream} strokeWidth={8} strokeLinecap="round" />
            {i % 2 === 0 ? <text x={440} y={y + 14} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, fill: C.amber }}>+1°</text> : null}
          </g>
        );
      })}
      <Plaque x={780} y={420} text={label} size={88} bg={C.ink} fg={C.amber} />
      {sub ? <Plaque x={780} y={560} text={sub} size={50} bg={C.ink} fg={C.cream} /> : null}
    </g>
  );
};

const k_: Shot = ({ f }) => <Ruler f={f} speed={6} gap={110} label="~1°" sub="PER 100 M" bg={["#146A6C", "#1FA69A"]} />;

/** l - the bars climb one degree at a time. */
const l: Shot = ({ f, n }) => (
  <g>
    <Sky stops={["#146A6C", "#1FA69A", "#66BEAD"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={12} y0={150} y1={1150} color={C.mint} speed={9} opacity={0.5} seed={5} />
    {Array.from({ length: 8 }, (_, i) => {
      const k = ez(f, i * 3, i * 3 + 10);
      const hh = (i + 1) * 90 * k;
      return (
        <g key={i}>
          <rect x={90 + i * 110} y={1100 - hh} width={92} height={hh} rx={16} fill={i % 2 ? C.orange : C.amber} />
          {k > 0.9 ? <text x={136 + i * 110} y={1100 - hh - 14} textAnchor="middle" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, fill: C.cream, stroke: C.ink, strokeWidth: 8, paintOrder: "stroke" }}>+1°</text> : null}
        </g>
      );
    })}
    <Plaque x={540} y={260} text="ONE DEGREE AT A TIME" size={62} bg={C.ink} fg={C.cream} />
    <Tick x={880} y={1230} pxPerM={260} frame={f} pose="point" expression="happy" facing={-1} />
  </g>
);

/** m - 6-7 km: the ticks bunch up. */
const m: Shot = ({ f, n }) => {
  const gap = mix(110, 62, ez(f, 0, n));
  return <Ruler f={f} speed={7} gap={gap} label="6-7 KM" bg={["#7A3418", "#B04A18"]} />;
};

/** n - closer to two. */
const n_: Shot = ({ f }) => <Ruler f={f} speed={9} gap={56} label="CLOSER TO 2°" sub="PER 100 M" bg={["#6A2210", "#B04A18"]} />;

/** o - the curve steepens. */
const o: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const pts: [number, number][] = [[150, 1100], [330, 1060], [510, 980], [690, 820], [870, 540]];
  const d = smoothPath(pts);
  return (
    <g>
      <Sky stops={EMBER_SKY} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={4} bands={HOT} amp={20} seed={2} />
      <rect x={0} y={0} width={W} height={H} fill={C.maroon} opacity={0.5} />
      <path d="M150 1100 H940 M150 1100 V330" stroke={C.cream} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d={d} stroke={C.amber} strokeWidth={18} fill="none" strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - k)} />
      <Glow x={870} y={540} r={300} color={C.gold} f={f} strength={0.7 * k} />
      <Plaque x={540} y={250} text="IT SPEEDS UP" size={90} bg={C.ink} fg={C.amber} />
      <Tick x={300} y={1230} pxPerM={300} frame={f} pose="shrug" expression="surprised" facing={1} />
    </g>
  );
};

/** p - the drill string shakes in the heat. */
const p: Shot = ({ f }) => {
  const sx = Math.sin(f * 2.9) * 7;
  return (
    <g>
      <Sky stops={EMBER_SKY} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={5} bands={HOT} amp={20} seed={6} />
      <rect x={0} y={0} width={W} height={H} fill={C.maroon} opacity={0.35} />
      <rect x={420} y={0} width={240} height={H} fill={C.ink} />
      <g transform={`translate(${540 + sx} 820)`}>
        <rect x={-34} y={-820} width={68} height={640} fill={C.cream} opacity={0.9} />
        <g transform={`rotate(${f * 12})`}>
          <circle r={140} fill={C.orange} stroke={C.amber} strokeWidth={12} />
          {[0, 1, 2].map((i) => (
            <circle key={i} r={44} cx={Math.cos((i * 2 * Math.PI) / 3) * 76} cy={Math.sin((i * 2 * Math.PI) / 3) * 76} fill={C.gold} stroke={C.ink} strokeWidth={7} />
          ))}
        </g>
        <Glow x={0} y={0} r={360} color={C.gold} f={f} strength={0.9} period={10} />
      </g>
      <Embers frame={f} x0={430} x1={650} y={950} n={30} color={C.amber} seed={5} rise={5.5} />
      <Plaque x={540} y={230} text="HEAT BREAKS MACHINES" size={62} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** q - a machine dims, its lamp goes out, a warning flashes. */
const q: Shot = ({ f, n }) => {
  const k = ez(f, 4, n - 4);
  return (
    <g>
      <Sky stops={["#B04A18", "#E3813F", "#F6B45A"]} x={0} y={0} w={W} h={H} />
      <Heat f={f} opacity={0.4} />
      <Bloom x={540} y={640} r={700} color={C.gold} strength={0.8 - 0.4 * k} />
      <g opacity={1 - 0.55 * k}>
        <Derrick f={f} x={540} y={1040} s={2.3} on={k < 0.6} body={C.deep} />
      </g>
      <g transform={`translate(540 440) scale(${1 + 0.1 * Math.sin(f / 3)})`} opacity={k > 0.3 && Math.floor(f / 5) % 2 === 0 ? 1 : 0.15}>
        <path d="M0 -110 L100 70 L-100 70 Z" fill={C.amber} stroke={C.ink} strokeWidth={14} strokeLinejoin="round" />
        <rect x={-9} y={-44} width={18} height={70} rx={9} fill={C.ink} />
        <circle cy={46} r={11} fill={C.ink} />
      </g>
      <Embers frame={f} x0={300} x1={800} y={1100} n={24} color={C.amber} seed={8} rise={4} />
    </g>
  );
};

/** r - a bit in white-hot rock: what does it do? */
const r_: Shot = ({ f }) => (
  <g>
    <Sky stops={["#2B0C08", "#B04A18", "#F6B45A"]} x={0} y={0} w={W} h={H} />
    <Strata f={f} speed={8} bands={HOT} amp={20} seed={1} />
    <Glow x={540} y={700} r={760} color={C.gold} f={f} strength={0.9} period={16} />
    <g transform={`translate(540 700) rotate(${f * 10})`}>
      <circle r={240} fill={C.orange} stroke={C.amber} strokeWidth={16} />
      {[0, 1, 2].map((i) => (
        <circle key={i} r={78} cx={Math.cos((i * 2 * Math.PI) / 3) * 130} cy={Math.sin((i * 2 * Math.PI) / 3) * 130} fill={C.gold} stroke={C.ink} strokeWidth={10} />
      ))}
    </g>
    <Embers frame={f} x0={200} x1={880} y={1000} n={36} color={C.amber} seed={3} rise={5} />
    <Plaque x={540} y={230} text="+80 °C PAST BOILING" size={64} bg={C.ink} fg={C.amber} />
  </g>
);

/** s - question marks rise off the thermometer. */
const s_: Shot = ({ f }) => (
  <g>
    <Sky stops={EMBER_SKY} x={0} y={0} w={W} h={H} />
    <Strata f={f} speed={4} bands={HOT} amp={20} seed={5} />
    <rect x={0} y={0} width={W} height={H} fill={C.maroon} opacity={0.4} />
    <Glow x={540} y={yOf(180)} r={500} color={C.gold} f={f} strength={0.7} />
    <Thermo x={540} level={180} f={f} shake={2} marks={false} />
    {[0, 1, 2, 3].map((i) => {
      const age = (f + i * 15) % 60;
      return (
        <text key={i} x={540 + (i - 1.5) * 150 + Math.sin(age / 7 + i) * 24} y={420 - age * 5} textAnchor="middle" opacity={Math.min(1, age / 6) * (1 - age / 60)} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 200, fill: C.amber, stroke: C.ink, strokeWidth: 14, paintOrder: "stroke" }}>
          ?
        </text>
      );
    })}
    <Plaque x={540} y={1250} text="WHAT BROKE?" size={80} bg={C.ink} fg={C.amber} />
  </g>
);

/** t - end card. */
const t_: Shot = ({ f }) => (
  <EndShot f={f} stops={EMBER_SKY} q={["WHAT BROKE", "DOWN THERE?"]}>
    <g transform="translate(880 330) scale(0.3)">
      <Thermo x={0} level={180} f={f} marks={false} />
    </g>
  </EndShot>
);

export const ShortS44 = makeShort(timeline, [[a, b], [c], [d, e], [f_, g, h, i_], [j, k_, l], [m, n_, o], [p, q], [r_, s_, t_]]);
