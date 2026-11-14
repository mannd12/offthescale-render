import React, { useId } from "react";
import { Counter, Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, Rain, T, W, H, Shot, ez, makeShort, mix, ramp } from "../S41-dig-plate/vkit";
import { Qmark, Ruler } from "../S46-peak-seafloor/kit46";
import { Burst, bob, shake } from "../S51-phantom-guns/kit51";
import { PressureWave } from "../L13-loudest-sound/sound";
import vo from "./vo.json";

/**
 * S52 - the air has a loudest sound (episodes/S52-air-ceiling). For L13, answered at 2:12. Vertical 1080x1920.
 * Numbers (sources.md, L13 rows): #8 101,325 Pa; #9 20 millionths of a pascal, about five billion times smaller than the
 * air pressure, 194 dB; #11 the ceiling at sea level. Why it is a ceiling (vacuum floor) and the shock wave are withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const SAFF = "#E0A93A";
const STAGE = ["#06222B", "#0A3C4C", "#11707A"];
const Stage: React.FC<{ stops?: string[] }> = ({ stops = STAGE }) => <Sky stops={stops} x={0} y={0} w={W} h={H} />;

/** The vertical decibel gauge: track, fill (0..1), the saffron ceiling line at the top. */
const Gauge: React.FC<{ x: number; k: number; f: number; top?: number; bottom?: number; hot?: boolean }> = ({ x, k, f, top = 300, bottom = 1220, hot = false }) => {
  const h = bottom - top;
  return (
    <g>
      <rect x={x - 80} y={top - 40} width={160} height={h + 80} rx={80} fill={C.ink} stroke={C.cream} strokeWidth={8} />
      <rect x={x - 56} y={bottom - h * k} width={112} height={h * k} rx={56} fill={C.verm} />
      <Ruler f={f} x={x + 96} y0={top} y1={bottom} speed={-6} step={80} len={60} />
      <rect x={30} y={top - 10} width={W - 60} height={20} rx={10} fill={SAFF} opacity={hot ? 1 : 0.9} />
      <rect x={30} y={top - 10} width={W - 60} height={20} rx={10} fill="none" stroke={C.cream} strokeWidth={5} strokeDasharray="40 26" strokeDashoffset={-f * 4} />
    </g>
  );
};

/** a1 - Tick cranks a big dial; the gauge shoots up the frame. */
const a1: Shot = ({ f, n }) => {
  const k = ez(f, 0, n) * 0.8;
  return (
    <g>
      <Stage />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.mint} speed={9} opacity={0.3} seed={3} />
      <Gauge x={850} k={k} f={f} />
      <g transform={`translate(360 1000) rotate(${f * 18})`}>
        <circle r={170} fill={C.deep} stroke={C.cream} strokeWidth={12} />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <path key={a} d={`M0 0 L${Math.cos((a * Math.PI) / 180) * 160} ${Math.sin((a * Math.PI) / 180) * 160}`} stroke={C.mint} strokeWidth={14} strokeLinecap="round" />
        ))}
        <circle r={36} fill={C.amber} stroke={C.ink} strokeWidth={8} />
      </g>
      <Tick x={170} y={1250} pxPerM={380} frame={f} pose="heave" expression="determined" facing={1} />
    </g>
  );
};

/** a2 - the fill climbs the last stretch and hits the line. */
const a2: Shot = ({ f, n }) => {
  const k = mix(0.8, 1, ez(f, 0, n - 6));
  return (
    <g transform={shake(f, n - 8, 8, 16)}>
      <Stage />
      <Chips f={f} n={12} y0={100} y1={1100} color={C.mint} speed={14} opacity={0.35} seed={5} />
      <Gauge x={540} k={k} f={f} hot={k > 0.98} />
      <Burst x={540} y={300} r0={120} r1={120 + 160 * ramp(f, n - 8, n)} color={SAFF} opacity={ramp(f, n - 8, n - 4)} width={18} />
      <T x={540} y={190} text="LOUDER..." size={100} color={C.cream} />
    </g>
  );
};

/** a3 - the line holds; Tick shields its eyes, the frame shakes. */
const a3: Shot = ({ f }) => (
  <g transform={shake(f, 0, 30, 10)}>
    <Stage stops={["#06222B", "#4B2A8C", "#E4572E"]} />
    <Glow x={540} y={300} r={700} color={SAFF} f={f} strength={0.8} period={12} />
    <Gauge x={850} k={1} f={f} hot />
    <Tick x={330} y={1250} pxPerM={430} frame={f} pose="shield" expression="scared" facing={1} tilt={-4} />
    <Plaque x={540} y={190} text="IT HOLDS" size={120} bg={C.ink} fg={C.amber} scale={ez(f, 0, 8)} />
  </g>
);

/** The flat line with air pressure: Tick standing on it. */
const FlatLine: React.FC<{ f: number; y?: number }> = ({ f, y = 900 }) => (
  <g>
    <rect x={0} y={y} width={W} height={26} fill={SAFF} />
    <rect x={0} y={y} width={W} height={26} fill="none" stroke={C.cream} strokeWidth={5} strokeDasharray="40 26" strokeDashoffset={-f * 4} />
  </g>
);

/** b1 - the air-pressure counter rolls up to 101,325 Pa over the flat line. */
const b1: Shot = ({ f, n }) => {
  const v = 101325 * ez(f, 0, n - 6);
  return (
    <g>
      <Stage />
      <Rain f={f} n={22} x0={0} x1={W} color={C.foam} speed={9} len={140} width={10} opacity={0.35} seed={3} />
      <FlatLine f={f} y={1000} />
      <rect x={60} y={120} width={960} height={400} rx={70} fill={C.ink} opacity={0.94} />
      <Counter x={430} y={420} value={v} max={101325} size={170} color={C.amber} align="middle" digits={6} />
      <T x={870} y={400} text="PA" size={100} color={C.cream} />
      <Tick x={300} y={1000} pxPerM={270} frame={f} walk={f / 18} pose="stand" expression="determined" facing={1} />
    </g>
  );
};

/** b2 - the air presses down on Tick from every side. */
const b2: Shot = ({ f }) => (
  <g>
    <Stage stops={["#0A3C4C", "#11707A", "#66BEAD"]} />
    {[140, 340, 540, 740, 940].map((x, i) => {
      const y = 330 + ((f * 9 + i * 70) % 420);
      return <path key={x} d={`M${x} ${y - 160} V${y} m-50 -46 l50 56 l50 -56`} stroke={C.foam} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />;
    })}
    <FlatLine f={f} y={1150} />
    <Tick x={540} y={1150} pxPerM={400} frame={f} pose="crouch" expression="worried" facing={1} />
    <Plaque x={540} y={190} text="~101,000 PA" size={110} bg={C.ink} fg={C.amber} />
  </g>
);

const Wiggle: React.FC<{ f: number; y: number; amp: number; speed?: number; steepen?: number; wavelength?: number; color?: string }> = ({ f, y, amp, speed = 8, steepen = 0, wavelength = 360, color = C.mint }) => (
  <PressureWave f={f} y={y} x0={-40} x1={W + 40} amp={amp} wavelength={wavelength} speed={speed} steepen={steepen} color={color} core={C.cream} width={14} fillAbove={"rgba(224,169,58,0.25)"} fillBelow={"rgba(79,181,222,0.25)"} lineColor={SAFF} />
);

/** c1 - a sound wave scrolls across the line; Tick hops over the crests. */
const c1: Shot = ({ f }) => (
  <g>
    <Stage />
    <Wiggle f={f} y={820} amp={90} />
    <Tick x={540} y={1250 - Math.abs(bob(f, 18, 70))} pxPerM={380} frame={f} pose="cheer" expression="happy" facing={1} />
    <Plaque x={540} y={190} text="A WIGGLE" size={130} bg={C.ink} fg={C.amber} scale={ez(f, 0, 8)} />
  </g>
);

/** c2 - the swings get bigger on the same line. */
const c2: Shot = ({ f, n }) => (
  <g>
    <Stage stops={["#06222B", "#11707A", "#1FA69A"]} />
    <Wiggle f={f} y={780} amp={mix(90, 230, ez(f, 0, n))} speed={10} color={C.foam} />
    <T x={640} y={1090} text="ABOVE THE LINE" size={72} color={C.amber} />
    <T x={640} y={1190} text="BELOW THE LINE" size={72} color={C.sky} />
    <Tick x={150} y={1250} pxPerM={330} frame={f} pose="point" expression="surprised" facing={1} />
  </g>
);

/** c3 - the whole thing on a bigger wavelength, very fast. */
const c3: Shot = ({ f }) => (
  <g>
    <Stage />
    <Chips f={f} n={14} y0={120} y1={1150} color={C.mint} speed={18} opacity={0.35} seed={7} />
    <Wiggle f={f} y={740} amp={200} speed={20} wavelength={300} />
    <Plaque x={380} y={1100} text="VERY FAST" size={96} bg={C.ink} fg={C.cream} scale={1 + 0.04 * Math.sin(f / 3)} />
    <Tick x={880} y={1240} pxPerM={330} frame={f} pose="think" expression="thinking" facing={-1} />
  </g>
);

/** c4 - a magnifier on the wiggle. */
const c4: Shot = ({ f, n }) => {
  const id = "lens" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const s = mix(1, 2.4, ez(f, 0, n - 2));
  return (
    <g>
      <Stage />
      <Wiggle f={f} y={760} amp={30} speed={9} wavelength={240} />
      <clipPath id={id}>
        <circle cx={540} cy={760} r={380} />
      </clipPath>
      <circle cx={540} cy={760} r={380} fill={C.ink} />
      <g clipPath={`url(#${id})`}>
        <g transform={`translate(540 760) scale(${s}) translate(-540 -760)`}>
          <Wiggle f={f} y={760} amp={30} speed={9} wavelength={240} />
        </g>
      </g>
      <circle cx={540} cy={760} r={380} fill="none" stroke={C.amber} strokeWidth={28} />
      <path d="M800 1030 L980 1210" stroke={C.amber} strokeWidth={46} strokeLinecap="round" />
    </g>
  );
};

/** d1 - twenty millionths of a pascal. */
const d1: Shot = ({ f, n }) => (
  <g>
    <Stage stops={["#06222B", "#4B2A8C", "#7C3FA8"]} />
    <Wiggle f={f} y={420} amp={14} speed={9} wavelength={200} color={C.foam} />
    <rect x={70} y={480} width={940} height={500} rx={70} fill={C.ink} opacity={0.94} />
    <Counter x={540} y={750} value={20 * ez(f, 0, n - 6)} max={20} size={250} color={C.amber} align="middle" digits={2} />
    <T x={540} y={880} text="MILLIONTHS OF A PASCAL" size={50} color={C.cream} />
    <Tick x={940} y={1290} pxPerM={200} frame={f} pose="point" expression="surprised" facing={-1} />
  </g>
);

/** d2 - a ruler with five billion ticks unrolls off the page. */
const d2: Shot = ({ f }) => (
  <g>
    <Stage />
    {[120, 260, 400, 540, 680, 820, 960].map((x, i) => (
      <Ruler key={x} f={f} x={x - 30} y0={0} y1={1250} speed={-(26 + i * 4)} step={60} len={60 + (i % 3) * 20} width={10} color={i % 2 ? C.mint : C.cream} />
    ))}
    <Plaque x={540} y={420} text="5 BILLION TICKS" size={90} bg={C.ink} fg={C.amber} scale={ez(f, 0, 8)} />
    <Tick x={540} y={1250} pxPerM={330} frame={f} pose="stand" expression="surprised" facing={1} look={1} />
  </g>
);

/** d3 - a seesaw: air pressure on one pan, a speck on the other. */
const d3: Shot = ({ f, n }) => {
  const a = mix(0, 17, ez(f, 0, n - 4));
  return (
    <g>
      <Stage stops={["#0A3C4C", "#11707A", "#66BEAD"]} />
      <path d="M540 1200 L420 1260 H660 Z" fill={C.maroon} />
      <g transform={`translate(540 1180) rotate(${-a})`}>
        <rect x={-460} y={-18} width={920} height={36} rx={18} fill={C.cream} stroke={C.ink} strokeWidth={8} />
        <g transform={`translate(-380 -10) rotate(${a})`}>
          <rect x={-130} y={-240} width={260} height={240} rx={30} fill={C.sea} stroke={C.ink} strokeWidth={8} />
          <T x={0} y={-90} text="AIR" size={70} color={C.cream} />
        </g>
        <g transform={`translate(380 -10) rotate(${a})`}>
          <circle cx={0} cy={-26} r={14} fill={C.amber} />
        </g>
      </g>
      <Plaque x={540} y={190} text="5 BILLION TO 1" size={88} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** d4 - the ratio on a big plate. */
const d4: Shot = ({ f, n }) => (
  <g>
    <Stage stops={["#06222B", "#4B2A8C", "#E4572E"]} />
    <Chips f={f} n={12} y0={100} y1={1100} color={C.gold} speed={10} opacity={0.35} seed={9} />
    <rect x={90} y={250} width={900} height={600} rx={80} fill={C.ink} opacity={0.94} />
    <Counter x={430} y={620} value={5 * ez(f, 0, Math.round(n * 0.4))} max={5} size={300} color={C.amber} align="middle" digits={1} />
    <T x={750} y={600} text="BILLION" size={90} color={C.cream} />
    <T x={540} y={780} text="TIMES BIGGER" size={96} color={C.cream} />
    <Tick x={900} y={1290} pxPerM={230} frame={f} pose="shrug" expression="surprised" facing={1} />
  </g>
);

/** e1 - the long ruler folds into a short ladder; the fill climbs rung by rung. */
const e1: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Stage />
      <Gauge x={540} k={k * 0.96} f={f} top={260} bottom={1230} />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={380} y={1230 - ((i + 1) * (1230 - 260)) / 10} width={320} height={10} rx={5} fill={C.cream} opacity={k * 10 > i ? 0.9 : 0.25} />
      ))}
      <Tick x={170} y={1250} pxPerM={360} frame={f} pose="point" expression="happy" facing={1} />
    </g>
  );
};

/** e2 - the fill hits the line and the readout locks on 194. */
const e2: Shot = ({ f, n }) => (
  <g transform={shake(f, 4, 10, 12)}>
    <Stage stops={["#06222B", "#4B2A8C", "#E4572E"]} />
    <Glow x={540} y={640} r={800} color={SAFF} f={f} strength={0.7} />
    <rect x={60} y={330} width={960} height={600} rx={80} fill={C.ink} opacity={0.95} />
    <Counter x={430} y={720} value={194 * ez(f, 0, n - 8)} max={194} size={330} color={C.amber} align="middle" digits={3} />
    <T x={860} y={700} text="dB" size={130} color={C.cream} />
    <T x={540} y={880} text="ABOUT" size={70} color={C.cream} />
    <Tick x={900} y={1290} pxPerM={200} frame={f} pose="cheer" expression="surprised" facing={-1} />
  </g>
);

/** e3 - sparks; Tick punches the air. */
const e3: Shot = ({ f }) => (
  <g>
    <Stage stops={["#06222B", "#4B2A8C", "#E4572E"]} />
    <Burst x={540} y={700} r0={300 + 20 * Math.sin(f / 3)} r1={520} n={18} color={C.amber} width={20} rot={f * 2} />
    <Chips f={f} n={16} y0={100} y1={1150} color={C.gold} speed={16} opacity={0.5} seed={11} />
    <T x={540} y={760} text="194" size={380} color={C.amber} />
    <Tick x={540} y={1290} pxPerM={230} frame={f} pose="cheer" expression="happy" facing={1} />
  </g>
);

/** f1 - the CEILING plate slams down over the readout. */
const f1: Shot = ({ f }) => {
  const y = mix(-200, 560, ez(f, 0, 7));
  return (
    <g transform={shake(f, 7, 12, 22)}>
      <Stage stops={["#06222B", "#11707A", "#1FA69A"]} />
      <T x={540} y={900} text="194 dB" size={260} color={C.amber} />
      <rect x={0} y={y} width={W} height={150} fill={SAFF} stroke={C.ink} strokeWidth={10} />
      <T x={540} y={y + 105} text="CEILING" size={120} color={C.ink} halo={SAFF} />
    </g>
  );
};

/** f2 - Tick presses both hands up against the ceiling. */
const f2: Shot = ({ f }) => (
  <g>
    <Stage stops={["#06222B", "#4B2A8C", "#E4572E"]} />
    <rect x={0} y={330} width={W} height={150} fill={SAFF} stroke={C.ink} strokeWidth={10} />
    <T x={540} y={435} text="CEILING" size={110} color={C.ink} halo={SAFF} />
    <Tick x={540} y={1250 + bob(f, 10, 6)} pxPerM={420} frame={f} pose="press" expression="determined" facing={1} />
    <Plaque x={540} y={1090} text="SEA-LEVEL AIR" size={70} bg={C.ink} fg={C.cream} />
  </g>
);

/** g1 - the needle shoves past the line into chevrons; the wave starts to lean. */
const g1: Shot = ({ f, n }) => (
  <g>
    <Stage />
    <Wiggle f={f} y={900} amp={200} speed={12} steepen={ez(f, 0, n) * 0.5} color={C.amber} />
    <rect x={30} y={420} width={W - 60} height={20} rx={10} fill={SAFF} />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M420 ${380 - i * 90 - ((f * 6) % 90)} L540 ${300 - i * 90 - ((f * 6) % 90)} L660 ${380 - i * 90 - ((f * 6) % 90)}`} stroke={C.cream} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
    ))}
    <Tick x={880} y={1250} pxPerM={380} frame={f} pose="point" expression="surprised" facing={-1} />
  </g>
);

/** g2 - the crests bunch into a jagged front; Tick backs away. */
const g2: Shot = ({ f, n }) => (
  <g>
    <Stage stops={["#06222B", "#4B2A8C", "#E4572E"]} />
    <Wiggle f={f} y={800} amp={260} speed={16} steepen={mix(0.5, 0.95, ez(f, 0, n))} color={C.amber} />
    <Tick x={mix(500, 900, ez(f, 0, n))} y={1250} pxPerM={380} frame={f} pose="shield" expression="scared" facing={-1} />
    <Plaque x={540} y={190} text="NOT LOUDER" size={110} bg={C.ink} fg={C.amber} />
  </g>
);

/** g3 - a white flash and a question mark where the wave was. */
const g3: Shot = ({ f }) => (
  <g>
    <Stage stops={["#06222B", "#4B2A8C", "#E4572E"]} />
    <rect x={0} y={0} width={W} height={H} fill={C.foam} opacity={Math.max(0, 1 - f / 10)} />
    <Qmark f={f} x={540} y={900} size={800} />
    <Plaque x={540} y={190} text="SOMETHING ELSE" size={100} bg={C.ink} fg={C.amber} />
  </g>
);

/** h1 - the question over the ceiling line. */
const h1: Shot = ({ f }) => (
  <g>
    <Stage stops={["#06222B", "#4B2A8C", "#E4572E"]} />
    <rect x={0} y={520} width={W} height={26} fill={SAFF} />
    <Qmark f={f} x={540} y={1100} size={760} />
    <Plaque x={540} y={190} text="WHY A CEILING?" size={96} bg={C.ink} fg={C.amber} />
  </g>
);

const h2: Shot = ({ f }) => <EndShot f={f} stops={["#06222B", "#4B2A8C", "#E4572E"]} q={["WHY A", "CEILING?"]} />;

export const ShortS52 = makeShort(timeline, [[a1, a2, a3], [b1, b2], [c1, c2, c3, c4], [d1, d2, d3, d4], [e1, e2, e3], [f1, f2], [g1, g2, g3], [h1, h2]]);
