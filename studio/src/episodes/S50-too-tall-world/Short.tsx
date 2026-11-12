import React from "react";
import { Counter, Sky, Streamers, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, T, W, H, Shot, ez, makeShort, mix, ramp } from "../S41-dig-plate/vkit";
import { Qmark, Ruler } from "../S46-peak-seafloor/kit46";
import vo from "./vo.json";

/**
 * S50 - Vesta: a rule that says too tall (episodes/S50-too-tall-world). For L12, answered at 8:24. Vertical 1080x1920.
 * Numbers (sources.md, L12 #23-#26): rule scaled by 1/g = ~340 km (our rough scaling, labelled "THE RULE"); Vesta about
 * 500 km across; surface to centre about 260 km (mean radius ~263); Rheasilvia 500 km wide, 19 km deep; central peak
 * ~20 km. In the circle drawings 1 km = 1.25 px, so the 340 km spike really is longer than the 260 km radius. Why the
 * rule breaks on small worlds is withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const FONT = "'Outfit', sans-serif";
const SPACE = ["#06222B", "#2A1260", "#4B2A8C"];
const ROCK = "#8B5FBF";
const ROCK_D = "#5B3FA0";
const PX = 1.25; // px per km

const Stars: React.FC<{ f: number; speed?: number }> = ({ f, speed = 3 }) => (
  <g>
    {Array.from({ length: 36 }, (_, i) => (
      <circle key={i} cx={(i * 337 + 100) % W} cy={((i * 211 + f * speed * (0.5 + (i % 4) * 0.4)) % 1250)} r={3 + (i % 3) * 2.5} fill={C.cream} opacity={0.5 + 0.4 * Math.sin(f / 7 + i)} />
    ))}
  </g>
);

const lump = (r: number, rot: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    const rr = r * (1 + 0.05 * Math.sin(3 * a + 1) + 0.035 * Math.sin(5 * a + 2) + 0.02 * Math.sin(9 * a));
    pts.push(`${i ? "L" : "M"}${(Math.cos(a + rot) * rr).toFixed(1)} ${(Math.sin(a + rot) * rr).toFixed(1)}`);
  }
  return pts.join(" ") + " Z";
};

const Rock: React.FC<{ x: number; y: number; r: number; f?: number; spin?: number; scale?: number }> = ({ x, y, r, f = 0, spin = 0.012, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d={lump(r, 0)} fill={ROCK} stroke={C.ink} strokeWidth={10} strokeLinejoin="round" />
    <g transform={`rotate(${(f * spin * 180) / Math.PI})`}>
      {[
        [-0.35, -0.3, 0.2],
        [0.4, -0.45, 0.14],
        [0.15, 0.3, 0.22],
        [-0.55, 0.35, 0.12],
        [0.6, 0.15, 0.1],
      ].map(([cx, cy, cr], i) => (
        <g key={i}>
          <circle cx={cx * r} cy={cy * r} r={cr * r} fill={ROCK_D} />
          <circle cx={cx * r - cr * r * 0.12} cy={cy * r - cr * r * 0.12} r={cr * r * 0.8} fill={C.mint} opacity={0.35} />
        </g>
      ))}
    </g>
  </g>
);

/** a - the asteroid tumbles in, Tick a dot on its crust. */
const a: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={SPACE} x={0} y={0} w={W} h={H} />
      <Stars f={f} speed={4} />
      <Rock x={540} y={650} r={mix(260, 440, k)} f={f} spin={0.02} />
      <g transform={`translate(540 650) rotate(${f * 1.1}) translate(0 ${-mix(260, 440, k)})`}>
        <Tick x={0} y={6} pxPerM={mix(70, 100, k)} frame={f} pose="stand" expression="neutral" facing={1} />
      </g>
      <Plaque x={540} y={190} text="THERE'S A RULE" size={96} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** b - the rule: a spike grows from the asteroid as the counter rolls to 340 km. */
const b: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 8);
  const cy = 940;
  const r = 263 * PX;
  return (
    <g>
      <Sky stops={SPACE} x={0} y={0} w={W} h={H} />
      <Stars f={f} speed={5} />
      <Rock x={540} y={cy} r={r} f={f} spin={0.015} />
      <path d={`M${540 - 70} ${cy - r + 20} L540 ${cy - r + 20 - 340 * PX * k} L${540 + 70} ${cy - r + 20} Z`} fill={C.verm} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      <Glow x={540} y={cy - r + 20 - 340 * PX * k} r={170} color={C.gold} f={f} strength={0.8} period={10} />
      <rect x={110} y={160} width={380} height={190} rx={44} fill={C.ink} opacity={0.94} />
      <Counter x={250} y={310} value={340 * k} max={340} size={110} color={C.amber} align="middle" />
      <text x={400} y={310} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, fill: C.cream }}>
        km
      </text>
      <Plaque x={780} y={1180} text="THE RULE SAYS" size={56} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** c - Tick at the foot of the spike, measuring up. */
const c: Shot = ({ f }) => {
  const r = 263 * PX;
  const cy = 1240 + r - 100;
  return (
    <g>
      <Sky stops={SPACE} x={0} y={0} w={W} h={H} />
      <Stars f={f} speed={6} />
      <Rock x={540} y={1500} r={r * 1.3} f={f} spin={0.01} />
      <path d={`M${540 - 90} 1160 L540 ${200 + 14 * Math.sin(f / 6)} L${540 + 90} 1160 Z`} fill={C.verm} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      <path d={`M860 1160 V${200 + 14 * Math.sin(f / 6)} M820 ${200 + 14 * Math.sin(f / 6)} H900`} stroke={C.cream} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="30 18" strokeDashoffset={-f * 4} />
      <Tick x={300} y={1180} pxPerM={300} frame={f} pose="point" expression="surprised" facing={1} look={0.7} />
      <Plaque x={540} y={1020} text="ABOUT 340 KM" size={64} bg={C.ink} fg={C.amber} />
      <T x={cy * 0 + 540} y={140} text="ON THIS ASTEROID" size={64} color={C.cream} />
    </g>
  );
};

/** d - the name, spinning. */
const d: Shot = ({ f }) => (
  <g>
    <Sky stops={SPACE} x={0} y={0} w={W} h={H} />
    <Stars f={f} speed={5} />
    <Glow x={540} y={680} r={560} color={C.sky} f={f} strength={0.4} period={30} />
    <Rock x={540} y={680} r={400} f={f} spin={0.05} />
    <Plaque x={540} y={190} text="VESTA" size={170} bg={C.ink} fg={C.amber} />
  </g>
);

/** e - a bracket across: about 500 km. */
const e: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 8);
  return (
    <g>
      <Sky stops={SPACE} x={0} y={0} w={W} h={H} />
      <Stars f={f} speed={4} />
      <Rock x={540} y={720} r={330} f={f} spin={0.03} />
      <path d={`M${540 - 330 * k} 1130 H${540 + 330 * k} M${540 - 330 * k} 1090 v80 M${540 + 330 * k} 1090 v80`} stroke={C.cream} strokeWidth={12} strokeLinecap="round" />
      <path d={`M${540 - 330 * k + 40} 1130 l-40 0`} stroke={C.amber} strokeWidth={12} />
      <Plaque x={540} y={190} text="~500 KM ACROSS" size={90} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** f - a dashed line from the surface to the centre; the counter rolls to 260. */
const f_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 8);
  const cy = 760;
  const r = 263 * PX;
  return (
    <g>
      <Sky stops={SPACE} x={0} y={0} w={W} h={H} />
      <Stars f={f} speed={4} />
      <Rock x={540} y={cy} r={r} f={f} spin={0.02} />
      <path d={`M540 ${cy - r} V${cy - r + r * k}`} stroke={C.amber} strokeWidth={14} strokeLinecap="round" strokeDasharray="30 18" strokeDashoffset={-f * 4} />
      <circle cx={540} cy={cy - r + r * k} r={24} fill={C.cream} stroke={C.ink} strokeWidth={8} />
      <rect x={110} y={1000} width={860} height={200} rx={50} fill={C.ink} opacity={0.94} />
      <Counter x={410} y={1150} value={260 * k} max={260} size={120} color={C.amber} align="middle" />
      <text x={640} y={1150} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, fill: C.cream }}>
        km to centre
      </text>
      <Plaque x={540} y={190} text="SURFACE TO CENTRE" size={72} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** g - cutaway: crust, mantle, core pulse; Tick on the rim measures. */
const g: Shot = ({ f }) => {
  const r = 263 * PX;
  return (
    <g>
      <Sky stops={SPACE} x={0} y={0} w={W} h={H} />
      <Stars f={f} speed={3} />
      <g transform="translate(540 800)">
        <circle r={r} fill={ROCK} stroke={C.ink} strokeWidth={10} />
        <circle r={r * 0.72} fill={C.orange} />
        <circle r={r * 0.4 + 6 * Math.sin(f / 5)} fill={C.amber} />
        <circle r={r * 0.2} fill={C.cream} />
        <g transform={`rotate(${f * 4})`}>
          <path d={`M0 0 L0 ${-r}`} stroke={C.cream} strokeWidth={10} strokeLinecap="round" />
          <circle cy={-r} r={20} fill={C.verm} stroke={C.ink} strokeWidth={6} />
        </g>
      </g>
      <Glow x={540} y={800} r={380} color={C.gold} f={f} strength={0.5} period={20} />
      <Plaque x={540} y={190} text="ONLY ABOUT 260 KM" size={78} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** h - two bars: the radius and the mountain; the mountain overtakes. */
const h: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const base = 1150;
  return (
    <g>
      <Sky stops={SPACE} x={0} y={0} w={W} h={H} />
      <Stars f={f} speed={4} />
      <rect x={250 - 90} y={base - 263 * PX * 1.5 * k} width={180} height={263 * PX * 1.5 * k} rx={50} fill={C.ink} />
      <rect x={250 - 68} y={base - 263 * PX * 1.5 * k + 14} width={136} height={Math.max(0, 263 * PX * 1.5 * k - 28)} rx={36} fill={C.sky} />
      <rect x={760 - 90} y={base - 340 * PX * 1.5 * k} width={180} height={340 * PX * 1.5 * k} rx={50} fill={C.ink} />
      <rect x={760 - 68} y={base - 340 * PX * 1.5 * k + 14} width={136} height={Math.max(0, 340 * PX * 1.5 * k - 28)} rx={36} fill={C.verm} />
      <Glow x={760} y={base - 340 * PX * 1.5 * k} r={190} color={C.gold} f={f} strength={0.8} period={10} />
      <Plaque x={250} y={base + 70} text="TO CENTRE" size={44} bg={C.ink} fg={C.cream} />
      <Plaque x={760} y={base + 70} text="THE MOUNTAIN" size={44} bg={C.ink} fg={C.amber} />
      <Plaque x={540} y={190} text="TALLER THAN THE WORLD" size={66} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** i - the spike runs through the whole asteroid and pokes out the far side. */
const i_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const r = 263 * PX;
  const cy = 700;
  const L = 603 * PX * k; // surface-to-tip: 263 + 340 = 603 km
  return (
    <g>
      <Sky stops={SPACE} x={0} y={0} w={W} h={H} />
      <Stars f={f} speed={5} />
      <Rock x={540} y={cy} r={r} f={0} spin={0} />
      <path d={`M${540 - 60} ${cy - r} L540 ${cy - r + L} L${540 + 60} ${cy - r} Z`} fill={C.verm} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" opacity={0.95} />
      <Glow x={540} y={cy - r + L} r={160} color={C.gold} f={f} strength={0.9} period={10} />
      <Tick x={820} y={1180} pxPerM={300} frame={f} pose="point" expression="surprised" facing={-1} />
      <Plaque x={540} y={190} text="OUT THE OTHER SIDE" size={78} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** j - "That can't be right": the blueprint crumples. */
const j: Shot = ({ f, n }) => {
  const k = ez(f, 6, n - 4);
  return (
    <g>
      <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={12} y0={100} y1={1150} color={C.gold} speed={10} opacity={0.5} seed={5} />
      <g transform={`translate(560 640) rotate(${mix(-6, 40, k)}) scale(${mix(1, 0.45, k)})`}>
        <rect x={-340} y={-420} width={680} height={840} rx={30} fill={C.cream} stroke={C.ink} strokeWidth={12} />
        <path d="M0 -300 L50 100 H-50 Z" fill={C.verm} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
        <circle cx={0} cy={220} r={120} fill={ROCK} stroke={C.ink} strokeWidth={8} />
        <path d="M-260 -380 L260 380 M260 -380 L-260 380" stroke={C.verm} strokeWidth={34} strokeLinecap="round" opacity={ramp(f, 4, 12)} />
      </g>
      <Tick x={230} y={1230} pxPerM={380} frame={f} pose="shrug" expression="worried" facing={1} />
      <Plaque x={540} y={190} text="THAT CAN'T BE RIGHT" size={78} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** k - the spike retracts; the south pole bowl opens. */
const k_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  const r = 330;
  return (
    <g>
      <Sky stops={SPACE} x={0} y={0} w={W} h={H} />
      <Stars f={f} speed={5} />
      <Rock x={540} y={mix(600, 520, k)} r={r} f={0} spin={0} />
      <path d={`M${540 - 50} ${mix(600, 520, k) - r} L540 ${mix(600, 520, k) - r - 260 * (1 - k)} L${540 + 50} ${mix(600, 520, k) - r} Z`} fill={C.verm} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" opacity={1 - k} />
      <ellipse cx={540} cy={mix(600, 520, k) + r - 70} rx={270 * k} ry={90 * k} fill={ROCK_D} stroke={C.ink} strokeWidth={8} />
      <ellipse cx={540} cy={mix(600, 520, k) + r - 60} rx={200 * k} ry={52 * k} fill="#2A1260" />
      <Glow x={540} y={mix(600, 520, k) + r - 60} r={260 * k} color={C.sky} f={f} strength={0.6} period={16} />
      <Plaque x={540} y={190} text="SOUTH POLE" size={110} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** l - the bowl, 500 km wide: a bracket spans nearly all of Vesta. */
const l: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={SPACE} x={0} y={0} w={W} h={H} />
      <Stars f={f} speed={5} />
      <g transform="translate(540 760)">
        <path d={lump(420, 0)} fill={ROCK} stroke={C.ink} strokeWidth={10} />
        <ellipse cx={0} cy={0} rx={360} ry={330} fill={ROCK_D} />
        <ellipse cx={0} cy={0} rx={300 + 8 * Math.sin(f / 6)} ry={270 + 8 * Math.sin(f / 6)} fill="#2A1260" />
        <circle r={60} fill={ROCK} />
        <circle r={160 + 20 * ((f % 40) / 40)} fill="none" stroke={C.sky} strokeWidth={8} opacity={0.5 * (1 - (f % 40) / 40)} />
      </g>
      <path d={`M${540 - 360 * k} 1230 H${540 + 360 * k} M${540 - 360 * k} 1190 v80 M${540 + 360 * k} 1190 v80`} stroke={C.cream} strokeWidth={12} strokeLinecap="round" />
      <Plaque x={540} y={190} text="500 KM WIDE" size={130} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** m - cross-section of the bowl, depth counter rolls to 19 km. */
const m: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 8);
  const top = 480;
  const depth = 340 * k; // exaggerated drawing of 19 km
  return (
    <g>
      <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.gold} speed={9} opacity={0.4} seed={3} />
      <path d={`M-40 ${top} H160 Q260 ${top + depth * 0.9} 540 ${top + depth} Q820 ${top + depth * 0.9} 920 ${top} H1120 V1300 H-40 Z`} fill={ROCK} stroke={C.ink} strokeWidth={10} strokeLinejoin="round" />
      <path d={`M1000 ${top} V${top + depth} M960 ${top} h80 M960 ${top + depth} h80`} stroke={C.cream} strokeWidth={10} fill="none" strokeLinecap="round" />
      <rect x={110} y={150} width={640} height={200} rx={44} fill={C.ink} opacity={0.94} />
      <Counter x={330} y={300} value={19 * k} max={19} size={120} color={C.amber} align="middle" digits={2} />
      <text x={510} y={300} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, fill: C.cream }}>
        km deep
      </text>
      <Plaque x={540} y={1100} text="DRAWN TALLER THAN TRUE" size={44} bg={C.ink} fg={C.cream} opacity={0.9} />
    </g>
  );
};

/** n - Tick peers over the rim into the deep bowl. */
const n_: Shot = ({ f }) => (
  <g>
    <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
    <Ruler f={f} x={60} y0={400} y1={1230} speed={-10} step={100} len={90} />
    <Ruler f={f} x={930} y0={400} y1={1230} speed={-10} step={100} len={90} />
    <path d="M-40 460 H260 Q300 900 540 1060 Q780 900 820 460 H1120 V1300 H-40 Z" fill={ROCK} stroke={C.ink} strokeWidth={10} strokeLinejoin="round" />
    <Tick x={250} y={460} pxPerM={320} frame={f} pose="lean" expression="surprised" facing={1} tilt={14} />
    <path d="M820 520 v460 m-50 -60 l50 70 l50 -70" stroke={C.amber} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${24 * Math.sin(f / 5)})`} />
    <Plaque x={540} y={190} text="19 KM DEEP" size={130} bg={C.ink} fg={C.amber} />
  </g>
);

/** o - a broad peak rises in the middle of the bowl. */
const o: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const top = 560;
  return (
    <g>
      <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.gold} speed={-9} opacity={0.4} seed={6} />
      <path d={`M-40 ${top} H160 Q260 ${top + 340 * 0.9} 540 ${top + 340} Q820 ${top + 340 * 0.9} 920 ${top} H1120 V1300 H-40 Z`} fill={ROCK} stroke={C.ink} strokeWidth={10} strokeLinejoin="round" />
      <path d={`M300 ${top + 335} Q540 ${top + 335 - 380 * k - 40} 780 ${top + 335} Z`} fill={C.orange} stroke={C.ink} strokeWidth={10} strokeLinejoin="round" />
      <Glow x={540} y={top + 335 - 380 * k} r={180} color={C.gold} f={f} strength={0.8} period={12} />
      <Plaque x={540} y={190} text="A PEAK IN THE MIDDLE" size={72} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** p - the peak's gauge reads about 20 km. */
const p: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const base = 1180;
  return (
    <g>
      <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
      <Ruler f={f} x={110} y0={80} y1={base} speed={-14} step={90} len={110} />
      <Ruler f={f} x={860} y0={80} y1={base} speed={-14} step={90} len={110} />
      <path d={`M240 ${base} Q540 ${base - 760 * k - 30} 840 ${base} Z`} fill={C.orange} stroke={C.ink} strokeWidth={10} strokeLinejoin="round" />
      <Glow x={540} y={base - 380 * k} r={200} color={C.gold} f={f} strength={0.7} period={12} />
      <rect x={110} y={160} width={700} height={200} rx={44} fill={C.ink} opacity={0.94} />
      <Counter x={330} y={310} value={20 * k} max={20} size={120} color={C.amber} align="middle" digits={2} />
      <text x={500} y={310} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, fill: C.cream }}>
        km high
      </text>
      <Tick x={930} y={1230} pxPerM={260} frame={f} pose="cheer" expression="surprised" facing={-1} />
    </g>
  );
};

/** q - the question beside the asteroid. */
const q: Shot = ({ f }) => (
  <g>
    <Sky stops={SPACE} x={0} y={0} w={W} h={H} />
    <Stars f={f} speed={5} />
    <Streamers f={f} n={6} x0={-300} x1={1400} y0={150} y1={1100} len={380} width={18} speed={6} color={C.sky} opacity={0.3} slope={0.04} seed={2} />
    <Rock x={330} y={760} r={300} f={f} spin={0.03} />
    <Qmark f={f} x={760} y={920} size={640} />
    <Plaque x={540} y={190} text="WHERE DOES IT BREAK?" size={76} bg={C.ink} fg={C.amber} />
  </g>
);

const r_: Shot = ({ f }) => (
  <EndShot f={f} stops={SPACE} q={["WHERE DOES THE", "RULE BREAK?"]}>
    <Rock x={975} y={1130} r={75} f={f} spin={0.05} />
  </EndShot>
);

export const ShortS50 = makeShort(timeline, [[a, b, c], [d, e], [f_, g], [h, i_], [j], [k_, l], [m, n_], [o, p], [q, r_]]);
