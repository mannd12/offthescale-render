import React from "react";
import { Bubbles, CloudRack, Counter, Sky, Streamers, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, T, W, H, Shot, ez, makeShort, mix, ramp } from "../S41-dig-plate/vkit";
import { Peak, Qmark, Ruler } from "../S46-peak-seafloor/kit46";
import vo from "./vo.json";

/**
 * S49 - Olympus Mons (episodes/S49-giant-volcano). For L12, answered at 7:00. Vertical 1080x1920.
 * Numbers (sources.md, L12 #18-#20, #1): 22 to 26 km above the plains (MOLA ~22, other ~26); 2.5 to 3 Everests (22 / 8.849
 * = 2.5, 26 / 8.849 = 2.9); wider than Arizona (585 km); slopes 2-5 degrees; Earth's highest peak above sea 8,849 m (under
 * 9 km). The reason (weak gravity, a crust that does not move) is withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const FONT = "'Outfit', sans-serif";
const MARS_SKY = ["#E4572E", "#F6B45A", "#FFCF73"];
const KM = 33; // px per km on the gauge shots

const Dust: React.FC<{ f: number; y0?: number; y1?: number; seed?: number }> = ({ f, y0 = 200, y1 = 900, seed = 3 }) => (
  <g>
    <Streamers f={f} n={9} x0={-300} x1={1400} y0={y0} y1={y1} len={420} width={22} speed={6} color={C.cream} opacity={0.4} slope={0.03} seed={seed} />
    <Chips f={f} n={10} y0={y0} y1={y1} color={C.gold} speed={10} opacity={0.5} seed={seed + 2} />
  </g>
);

/** The shield, from the side: very wide, very low in this drawing, with the caldera notch. */
const Mons: React.FC<{ x: number; y: number; w: number; h: number; f?: number }> = ({ x, y, w, h, f = 0 }) => (
  <g>
    <path d={`M${x - w / 2} ${y} C${x - w * 0.3} ${y - h * 0.12} ${x - w * 0.14} ${y - h * 0.85} ${x - w * 0.06} ${y - h * 0.97} L${x - w * 0.03} ${y - h * 0.93} L${x + w * 0.03} ${y - h * 0.93} L${x + w * 0.06} ${y - h * 0.97} C${x + w * 0.14} ${y - h * 0.85} ${x + w * 0.3} ${y - h * 0.12} ${x + w / 2} ${y} Z`} fill="#B04A18" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
    <path d={`M${x + w * 0.06} ${y - h * 0.97} C${x + w * 0.14} ${y - h * 0.85} ${x + w * 0.3} ${y - h * 0.12} ${x + w / 2} ${y} L${x + w * 0.1} ${y} Z`} fill="#7A3418" opacity={0.6} />
    <Glow x={x} y={y - h * 0.95} r={h * 0.35 + 30} color={C.gold} f={f} strength={0.6} period={24} />
  </g>
);

const Planet: React.FC<{ x: number; y: number; r: number; f: number; body?: string; band?: string; spot?: boolean }> = ({ x, y, r, f, body = "#E4572E", band = "#B04A18", spot = true }) => {
  const sh = (f * 1.4) % (r * 2);
  return (
    <g>
      <clipPath id={`pl${Math.round(x)}${Math.round(y)}${Math.round(r)}`}>
        <circle cx={x} cy={y} r={r} />
      </clipPath>
      <circle cx={x} cy={y} r={r} fill={body} stroke={C.ink} strokeWidth={10} />
      <g clipPath={`url(#pl${Math.round(x)}${Math.round(y)}${Math.round(r)})`}>
        {[-0.5, -0.1, 0.3, 0.65].map((o, i) => (
          <path key={i} d={`M${x - r - 40 + ((sh + i * 90) % 180)} ${y + o * r} q${r * 0.5} ${i % 2 ? 30 : -30} ${r} 0 t${r} 0 t${r} 0`} stroke={band} strokeWidth={r * 0.12} fill="none" />
        ))}
        <circle cx={x + r * 0.3} cy={y - r * 0.2} r={r * 0.2} fill={band} opacity={0.8} />
        <circle cx={x - r * 0.9 + sh * 0.0} cy={y} r={r} fill={C.ink} opacity={0.18} />
      </g>
      {spot ? <circle cx={x + r * 0.3} cy={y - r * 0.2} r={r * 0.08 + 6 * Math.abs(Math.sin(f / 5))} fill={C.amber} /> : null}
    </g>
  );
};

/** a - the vast shield fills the frame, Tick tiny at its foot. */
const a: Shot = ({ f }) => (
  <g>
    <Sky stops={MARS_SKY} x={0} y={0} w={W} h={H} />
    <Dust f={f} y0={160} y1={600} seed={3} />
    <Mons x={540} y={1040} w={2400} h={780} f={f} />
    <rect x={0} y={1040} width={W} height={300} fill="#7A3418" />
    <Chips f={f} n={10} y0={1060} y1={1180} color={C.apricot} speed={14} opacity={0.6} seed={7} />
    <Tick x={190} y={1130} pxPerM={180} frame={f} pose="point" expression="surprised" facing={1} look={0.8} />
    <Plaque x={540} y={190} text="THE BIGGEST VOLCANO" size={72} bg={C.ink} fg={C.amber} />
  </g>
);

/** b - the camera pushes up the flank: the volcano keeps growing. */
const b: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={MARS_SKY} x={0} y={0} w={W} h={H} />
      <Dust f={f} y0={160} y1={700} seed={5} />
      <g transform={`translate(540 1100) scale(${mix(1, 1.7, k)}) translate(-540 -1100)`}>
        <Mons x={540} y={1100} w={2400} h={780} f={f} />
      </g>
      <rect x={0} y={1100} width={W} height={200} fill="#7A3418" />
      <Plaque x={540} y={190} text="IN THE SOLAR SYSTEM" size={68} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** c - Mars swings in with a pin blinking. */
const c: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={["#06222B", "#0A3C4C", "#4B2A8C"]} x={0} y={0} w={W} h={H} />
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={(i * 337) % W} cy={(i * 211) % 1200} r={4 + (i % 3) * 3} fill={C.cream} opacity={0.5 + 0.5 * Math.sin(f / 6 + i)} />
      ))}
      <Planet x={mix(1500, 540, k)} y={640} r={420} f={f} />
      <Plaque x={540} y={190} text="MARS" size={150} bg={C.ink} fg={C.amber} opacity={ramp(f, 4, 12)} />
    </g>
  );
};

/** d - zoom into the pin: the name. */
const d: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={["#06222B", "#0A3C4C", "#4B2A8C"]} x={0} y={0} w={W} h={H} />
      <g transform={`translate(540 640) scale(${mix(1, 1.9, k)}) translate(-540 -640)`}>
        <Planet x={540} y={640} r={420} f={f * 1.5} />
      </g>
      <Plaque x={540} y={190} text="OLYMPUS MONS" size={100} bg={C.ink} fg={C.amber} />
      <Plaque x={540} y={1100} text="ON MARS" size={90} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** e - a bar climbs the gauge, counter rolling, past 22 up to 26. */
const e: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const base = 1180;
  return (
    <g>
      <Sky stops={MARS_SKY} x={0} y={0} w={W} h={H} />
      <Ruler f={f} x={110} y0={80} y1={base} speed={-18} step={KM * 2} len={110} color={C.ink} />
      <Ruler f={f} x={860} y0={80} y1={base} speed={-18} step={KM * 2} len={110} color={C.ink} />
      <rect x={400} y={base - 26 * KM * k} width={280} height={26 * KM * k} rx={60} fill={C.ink} />
      <rect x={424} y={base - 26 * KM * k + 14} width={232} height={Math.max(0, 26 * KM * k - 28)} rx={46} fill={C.verm} />
      <Glow x={540} y={base - 26 * KM * k} r={220} color={C.gold} f={f} strength={0.9} period={10} />
      <rect x={110} y={190} width={600} height={190} rx={44} fill={C.ink} opacity={0.94} />
      <Counter x={330} y={330} value={26 * k} max={26} size={110} color={C.amber} align="middle" digits={2} />
      <text x={500} y={330} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, fill: C.cream }}>
        km
      </text>
    </g>
  );
};

/** f - the band settles between 22 and 26. */
const f_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const base = 1180;
  return (
    <g>
      <Sky stops={MARS_SKY} x={0} y={0} w={W} h={H} />
      <Ruler f={f} x={110} y0={80} y1={base} speed={4} step={KM * 2} len={110} color={C.ink} />
      <rect x={400} y={base - 26 * KM} width={280} height={26 * KM} rx={60} fill={C.ink} />
      <rect x={424} y={base - 26 * KM + 14} width={232} height={26 * KM - 28} rx={46} fill={C.verm} />
      <rect x={330} y={base - 26 * KM} width={420} height={4 * KM * k} rx={20} fill={C.amber} opacity={0.85} />
      <path d={`M780 ${base - 22 * KM} h60 M780 ${base - 26 * KM} h60 M810 ${base - 26 * KM} V${base - 22 * KM}`} stroke={C.cream} strokeWidth={10} fill="none" strokeLinecap="round" opacity={ramp(f, 6, 12)} />
      <Plaque x={540} y={250} text="22 TO 26 KM" size={120} bg={C.ink} fg={C.amber} scale={1 + 0.04 * Math.sin(f / 4)} />
      <Plaque x={540} y={420} text="ABOVE THE PLAINS" size={64} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** One Everest slab: a coloured block, height 8.849 km * KM, with a peak icon. */
const Slab: React.FC<{ x: number; y: number; k?: number; i: number }> = ({ x, y, k = 1, i }) => {
  const h = 8.849 * KM * 1 * k;
  return (
    <g opacity={k > 0 ? 1 : 0}>
      <rect x={x - 150} y={y - h} width={300} height={h} rx={26} fill={i % 2 ? C.orange : C.amber} stroke={C.ink} strokeWidth={8} />
      {k > 0.7 ? <Peak x={x} y={y - 24} w={190} h={h * 0.5} body={C.rust} shade={C.brick} /> : null}
    </g>
  );
};

/** g - Everests stack beside the gauge. */
const g: Shot = ({ f, n }) => {
  const base = 1180;
  const u = 8.849 * KM;
  return (
    <g>
      <Sky stops={MARS_SKY} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.gold} speed={9} opacity={0.5} seed={12} />
      <rect x={760} y={base - 26 * KM} width={190} height={26 * KM} rx={50} fill={C.ink} />
      <rect x={778} y={base - 26 * KM + 12} width={154} height={26 * KM - 24} rx={36} fill={C.verm} />
      {[0, 1, 2].map((i) => {
        const t = ez(f, i * 12, i * 12 + 14);
        const k = i === 2 ? mix(0.5, 0.94, ez(f, 26, n - 2)) : 1;
        const drop = (1 - t) * -500;
        return (
          <g key={i} transform={`translate(0 ${drop})`} opacity={t}>
            <Slab x={400} y={base - i * u - (i === 2 ? 0 : 0)} k={k * (i === 2 ? t : 1)} i={i} />
          </g>
        );
      })}
    </g>
  );
};

/** h - Tick counts on its fingers. */
const h: Shot = ({ f }) => {
  const u = 8.849 * KM;
  const base = 1180;
  return (
    <g>
      <Sky stops={MARS_SKY} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.gold} speed={-9} opacity={0.5} seed={4} />
      {[0, 1, 2].map((i) => (
        <Slab key={i} x={780} y={base - i * u} k={i === 2 ? 0.94 : 1} i={i} />
      ))}
      <Tick x={250} y={1230} pxPerM={430} frame={f} pose="point" expression="happy" facing={1} />
      <Plaque x={500} y={250} text="2.5 TO 3 EVERESTS" size={70} bg={C.ink} fg={C.amber} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={150 + i * 120} cy={420} r={34 + (Math.floor(f / 14) % 4 > i ? 10 : 0)} fill={Math.floor(f / 14) % 4 > i ? C.amber : C.ink} opacity={0.85} />
      ))}
    </g>
  );
};

/** i - top view: the base spreads, Arizona's outline slides under it, smaller. */
const i_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 12);
  const s = ez(f, 14, n - 4);
  return (
    <g>
      <Sky stops={["#B04A18", "#E3813F", "#F6B45A"]} x={0} y={0} w={W} h={H} />
      <Dust f={f} y0={100} y1={1100} seed={8} />
      <g transform={`translate(540 640)`}>
        <circle r={430 * k} fill="#E4572E" stroke={C.ink} strokeWidth={12} />
        <circle r={300 * k} fill="none" stroke={C.cream} strokeWidth={10} strokeDasharray="20 14" strokeDashoffset={-f * 2} opacity={0.7} />
        <circle r={60 * k} fill={C.amber} />
        <g transform={`translate(${mix(900, 0, s)} 20)`}>
          <path d="M-190 -250 H150 L180 -80 L110 -30 V260 H-90 L-190 140 Z" fill={C.green} stroke={C.ink} strokeWidth={10} strokeLinejoin="round" opacity={0.92} />
          <T x={-10} y={60} text="ARIZONA" size={62} color={C.ink} halo={C.green} />
        </g>
      </g>
      <Plaque x={540} y={1130} text="WIDER THAN ARIZONA" size={68} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** j - Tick strolls up a very gentle slope, not leaning. */
const j: Shot = ({ f }) => {
  const x = 80 + (f * 3.2) % 900;
  const yAt = (xx: number) => 1160 - xx * 0.09;
  return (
    <g>
      <Sky stops={MARS_SKY} x={0} y={0} w={W} h={H} />
      <Dust f={f} y0={160} y1={700} seed={6} />
      <path d={`M-40 ${yAt(-40)} L1120 ${yAt(1120)} V1300 H-40 Z`} fill="#B04A18" />
      <path d={`M-40 ${yAt(-40) + 40} L1120 ${yAt(1120) + 40}`} stroke={C.apricot} strokeWidth={14} strokeDasharray="60 50" strokeDashoffset={f * 8} />
      <Tick x={x} y={yAt(x)} pxPerM={300} frame={f} pose="stand" expression="happy" facing={1} walk={f / 12} />
      <Plaque x={540} y={190} text="HARDLY A CLIMB" size={90} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** k - the slope angle: a wedge sweeps between 2 and 5 degrees. */
const k_: Shot = ({ f }) => {
  const deg = 3.5 + 1.5 * Math.sin(f / 9);
  const L = 950;
  const rad = (deg * Math.PI) / 180;
  return (
    <g>
      <Sky stops={["#B04A18", "#E3813F", "#F6B45A"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.gold} speed={10} opacity={0.4} seed={10} />
      <g transform="translate(60 900)">
        <path d={`M0 0 L${L} 0 L${L} ${-Math.tan(rad) * L} Z`} fill="#7A3418" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
        <path d={`M0 0 L${L} 0`} stroke={C.cream} strokeWidth={10} strokeLinecap="round" />
        <path d={`M0 0 L${L} ${-Math.tan(rad) * L}`} stroke={C.amber} strokeWidth={14} strokeLinecap="round" />
        <path d={`M300 0 A300 300 0 0 0 ${300 * Math.cos(rad)} ${-300 * Math.sin(rad)}`} stroke={C.cream} strokeWidth={8} fill="none" />
      </g>
      <rect x={140} y={250} width={800} height={260} rx={60} fill={C.ink} opacity={0.94} />
      <T x={540} y={430} text="2 TO 5°" size={170} color={C.amber} />
      <T x={540} y={640} text="SLOPES" size={76} color={C.cream} />
    </g>
  );
};

/** l - Earth swings in, Everest pinned. */
const l: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={["#06222B", "#0A3C4C", "#1B6FA8"]} x={0} y={0} w={W} h={H} />
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={(i * 337) % W} cy={(i * 211) % 1200} r={4 + (i % 3) * 3} fill={C.cream} opacity={0.5 + 0.5 * Math.sin(f / 6 + i)} />
      ))}
      <Planet x={mix(-400, 540, k)} y={640} r={420} f={f} body="#2A8FC4" band="#3FBF8A" />
      <Plaque x={540} y={190} text="EARTH" size={150} bg={C.ink} fg={C.amber} opacity={ramp(f, 4, 12)} />
    </g>
  );
};

/** m - Everest's bar stops short of nine. */
const m: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 10);
  const base = 1180;
  return (
    <g>
      <Sky stops={["#1B6FA8", "#2A8FC4", "#4FB5DE"]} x={0} y={0} w={W} h={H} />
      <Ruler f={f} x={110} y0={80} y1={base} speed={-14} step={KM * 2} len={110} />
      <rect x={400} y={base - 8.849 * 90 * k} width={240} height={8.849 * 90 * k} rx={50} fill={C.ink} />
      <rect x={422} y={base - 8.849 * 90 * k + 14} width={196} height={Math.max(0, 8.849 * 90 * k - 28)} rx={36} fill={C.amber} />
      <path d={`M300 ${base - 9 * 90} H760`} stroke={C.cream} strokeWidth={8} strokeDasharray="22 14" strokeDashoffset={-f * 3} />
      <T x={800} y={base - 9 * 90 + 20} text="9 KM" size={60} align="start" />
      <rect x={110} y={190} width={640} height={210} rx={44} fill={C.ink} opacity={0.94} />
      <Counter x={350} y={350} value={8849 * k} max={8849} size={110} color={C.amber} align="middle" />
      <text x={600} y={350} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, fill: C.cream }}>
        m
      </text>
      <Plaque x={540} y={1100 - 0} text="EARTH'S HIGHEST: UNDER 9 KM" size={50} bg={C.ink} fg={C.cream} opacity={ramp(f, 14, 22)} />
    </g>
  );
};

/** n - a ceiling; Everest bumps against it. */
const n_: Shot = ({ f }) => {
  const bump = Math.max(0, 24 * Math.abs(Math.sin(f / 8)));
  return (
    <g>
      <Sky stops={["#1B6FA8", "#2A8FC4", "#4FB5DE"]} x={0} y={0} w={W} h={H} />
      <CloudRack f={f} n={4} x0={-400} x1={1500} y0={500} y1={1000} size={110} speed={6} body={C.cream} under={C.ice} top="#FFFFFF" seed={9} />
      <Peak x={540} y={1230} w={1000} h={700 + bump} body="#E3813F" shade="#B04A18" />
      <rect x={0} y={510} width={W} height={24} fill={C.verm} />
      <rect x={0} y={510} width={W} height={24} fill="none" stroke={C.cream} strokeWidth={6} strokeDasharray="40 24" strokeDashoffset={-f * 4} />
      <Plaque x={540} y={190} text="EARTH HITS A CEILING" size={74} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** o - the red giant sails through it; Tick, hands on head. */
const o: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const split = ez(f, 4, 22);
  return (
    <g>
      <Sky stops={MARS_SKY} x={0} y={0} w={W} h={H} />
      <Dust f={f} y0={160} y1={900} seed={9} />
      <Mons x={540} y={1230} w={1700} h={mix(500, 1100, k)} f={f} />
      <rect x={-20 - 560 * split} y={640} width={600} height={24} fill={C.verm} />
      <rect x={500 + 560 * split} y={640} width={600} height={24} fill={C.verm} />
      <Tick x={150} y={1230} pxPerM={300} frame={f} pose="shield" expression="surprised" facing={1} />
      <Plaque x={540} y={190} text="MARS: NO CEILING" size={80} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** p - the question over Mars. */
const p: Shot = ({ f }) => (
  <g>
    <Sky stops={["#06222B", "#0A3C4C", "#4B2A8C"]} x={0} y={0} w={W} h={H} />
    {Array.from({ length: 30 }, (_, i) => (
      <circle key={i} cx={(i * 337) % W} cy={(i * 211) % 1200} r={4 + (i % 3) * 3} fill={C.cream} opacity={0.5 + 0.5 * Math.sin(f / 6 + i)} />
    ))}
    <Planet x={360} y={740} r={330} f={f} />
    <Qmark f={f} x={760} y={900} size={640} />
    <Plaque x={540} y={190} text="WHY MARS?" size={140} bg={C.ink} fg={C.amber} />
    <Bubbles frame={f} x0={100} x1={980} y={1150} n={8} color={C.gold} seed={2} rise={3} size={8} />
  </g>
);

const q: Shot = ({ f }) => (
  <EndShot f={f} stops={["#06222B", "#0A3C4C", "#4B2A8C"]} q={["WHAT DOES MARS HAVE", "THAT EARTH DOESN'T?"]} size={64}>
    <Planet x={975} y={1130} r={75} f={f} />
  </EndShot>
);

export const ShortS49 = makeShort(timeline, [[a, b], [c, d], [e, f_], [g, h], [i_], [j, k_], [l, m], [n_, o], [p, q]]);
