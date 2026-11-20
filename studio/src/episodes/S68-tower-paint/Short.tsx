import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { EndShot, Chips, W, H, Shot, makeShort } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Bracket } from "../L15-space-jump/props";
import { EiffelIcon } from "../L17-humans-vanish/icons17";
import { Flakes } from "../L17-humans-vanish/movers17";
import { Count, C, HBar, Plaque, ez } from "../S61-record-peak/kit61";
import vo from "./vo.json";

/**
 * S68 - 15 tonnes of paint (episodes/S68-tower-paint). For L17, answered at 3:48 (A hundred years: the rust).
 * Numbers (sources.md, L17 row 5): twenty repaints in 136 years, an average of once every 7 years, 60 tonnes of paint per
 * campaign, about 15 tonnes eroded between two campaigns. Withheld: what rust does to steel inside concrete (L17 3:48).
 */
export const timeline = buildTimeline(vo as VoLine[]);

const SKY = ["#2A8FC4", "#4FB5DE", "#9BD6E8"];
const TOWER = C.brick;
const GREY = "#8A98A0";

const Day: React.FC<{ f: number; ground?: boolean }> = ({ f, ground = true }) => (
  <g>
    <Sky stops={SKY} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={8} y0={120} y1={900} color={C.foam} speed={3} opacity={0.4} seed={5} len={150} width={14} />
    {ground ? <rect x={0} y={1180} width={W} height={H - 1180} fill={C.green} /> : null}
  </g>
);

/** The tower in a chosen colour. */
const Tower: React.FC<{ x: number; y: number; size: number; ink?: string }> = ({ x, y, size, ink = TOWER }) => <EiffelIcon x={x} y={y} size={size} ink={ink} />;

/** A strip of repaint ticks along a ruler (x 100..980); k = how many are on. */
const Strip: React.FC<{ y: number; k: number; speed?: number; f?: number; color?: string }> = ({ y, k, speed = 0, f = 0, color = C.amber }) => (
  <g>
    <rect x={80} y={y + 28} width={920} height={14} rx={7} fill={C.ink} />
    {Array.from({ length: 20 }, (_, i) => {
      const off = speed ? (((f * speed) % 44) + 44) % 44 : 0;
      const x = 100 + i * 44 - off;
      const on = i < k;
      return <rect key={i} x={x - 9} y={y - (on ? 40 : 14)} width={18} height={on ? 76 : 50} rx={9} fill={on ? color : C.ink} opacity={on ? 1 : 0.5} stroke={C.ink} strokeWidth={4} />;
    })}
  </g>
);

/** a - about 15 tonnes of paint wear off between two repaints. */
const a1: Shot = ({ f }) => (
  <g>
    <Day f={f} />
    <Tower x={540} y={730} size={880} />
    <Flakes f={f} x={300} y={420} w={480} h={760} n={36} speed={9} color="#FFF4DE" seed={2} />
    <Plaque x={540} y={190} text="BETWEEN TWO REPAINTS" size={58} bg={C.ink} fg={C.cream} />
  </g>
);
const a2: Shot = ({ f, n }) => (
  <g>
    <Day f={f} />
    <Tower x={540} y={760} size={760} />
    <Flakes f={f} x={200} y={380} w={680} h={800} n={60} speed={11} color="#FFF4DE" seed={4} pile={{ x: 540, y: 1190, w: 520, grow: ez(f, 0, n) }} />
    <Count x={540} y={190} f={f} b={15} f1={Math.round(n * 0.4)} unit=" TONNES" w={640} size={110} />
    <Plaque x={540} y={340} text="OF PAINT WEAR OFF" size={50} bg={C.ink} fg={C.cream} />
  </g>
);

/** b - twenty repaints in 136 years. */
const b1: Shot = ({ f, n }) => (
  <g>
    <Day f={f} ground={false} />
    <Tower x={540} y={520} size={380} />
    <Strip y={900} k={Math.round(20 * ez(f, 0, Math.round(n * 0.4)))} />
    <Count x={540} y={190} f={f} b={20} f1={Math.round(n * 0.4)} unit=" REPAINTS" w={760} size={110} />
  </g>
);
const b2: Shot = ({ f, n }) => (
  <g>
    <Day f={f} ground={false} />
    <Tower x={540} y={520} size={380} />
    <Strip y={900} k={20} />
    <Bracket x1={100} y1={1010} x2={980} y2={1010} draw={ez(f, 0, Math.round(n * 0.5))} color={C.amber} />
    <Count x={540} y={190} f={f} b={136} f1={Math.round(n * 0.4)} unit=" YEARS" w={640} size={110} />
  </g>
);

/** c - once every seven years. */
const c1: Shot = ({ f, n }) => (
  <g>
    <Day f={f} ground={false} />
    <Strip y={760} k={20} />
    <Bracket x1={100} y1={860} x2={144} y2={860} draw={ez(f, 0, Math.round(n * 0.4))} color={C.verm} />
    <Plaque x={540} y={190} text="ONE GAP BETWEEN COATS" size={52} bg={C.ink} fg={C.cream} />
    <Plaque x={300} y={990} text="7 YEARS" size={90} bg={C.ink} fg={C.amber} opacity={ez(f, 4, 10)} />
  </g>
);
const c2: Shot = ({ f, n }) => (
  <g>
    <Day f={f} ground={false} />
    <Tower x={540} y={560} size={420} />
    <Plaque x={540} y={190} text="ONCE EVERY" size={96} bg={C.ink} fg={C.cream} />
    <Count x={540} y={960} f={f} b={7} f1={Math.round(n * 0.4)} unit=" YEARS" w={640} size={140} />
  </g>
);

/** d - 60 tonnes of paint, about 15 wear away between coats. */
const Bucket: React.FC<{ x: number; y: number; tip: number; f: number }> = ({ x, y, tip, f }) => (
  <g transform={`translate(${x} ${y}) rotate(${-tip * 62})`}>
    <path d="M-110 -80 L110 -80 L84 100 L-84 100 Z" fill={C.orange} stroke={C.ink} strokeWidth={9} strokeLinejoin="round" />
    <rect x={-110} y={-96} width={220} height={26} rx={13} fill={C.rust} stroke={C.ink} strokeWidth={7} />
    <path d="M-80 -80 Q0 -170 80 -80" fill="none" stroke={C.ink} strokeWidth={8} />
    <text x={0} y={46} textAnchor="middle" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 64, fill: C.cream }}>
      60 T
    </text>
    {tip > 0.5 ? <rect x={-70 + Math.sin(f / 3) * 4} y={-60} width={30} height={460} rx={15} fill={C.brick} opacity={0.9} transform={`rotate(${tip * 62})`} /> : null}
  </g>
);
const d1: Shot = ({ f, n }) => (
  <g>
    <Day f={f} />
    <Tower x={420} y={760} size={760} ink={ez(f, 6, n) > 0.5 ? C.brick : GREY} />
    <Bucket x={800} y={420} tip={ez(f, 0, 8)} f={f} />
    <Count x={540} y={190} f={f} b={60} f1={Math.round(n * 0.4)} unit=" TONNES" w={640} size={110} />
  </g>
);
const d2: Shot = ({ f, n }) => (
  <g>
    <Day f={f} ground={false} />
    <Plaque x={540} y={190} text="60 ON, 15 OFF" size={100} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={470} text="EACH REPAINT: 60 TONNES" size={46} bg={C.ink} fg={C.cream} />
    <HBar x={100} y={580} w={880} k={ez(f, 0, Math.round(n * 0.4))} color={C.amber} />
    <Plaque x={540} y={800} text="WEARS AWAY: ABOUT 15" size={46} bg={C.ink} fg={C.cream} />
    <HBar x={100} y={910} w={880} k={0.25 * ez(f, Math.round(n * 0.3), Math.round(n * 0.7))} color={C.verm} />
  </g>
);

/** e - skip a few sevens: the paint goes. */
const e1: Shot = ({ f, n }) => {
  const k = ez(f, 0, n);
  return (
    <g>
      <Day f={f} />
      <Tower x={540} y={680} size={780} ink={k > 0.5 ? GREY : TOWER} />
      <Strip y={1090} k={20} speed={2.4} f={f} color={C.gold} />
      <Plaque x={540} y={190} text="SKIP A FEW SEVENS" size={66} bg={C.ink} fg={C.amber} />
    </g>
  );
};
const e2: Shot = ({ f }) => (
  <g>
    <Day f={f} />
    <Tower x={680} y={720} size={760} ink={GREY} />
    <Flakes f={f} x={300} y={380} w={500} h={780} n={40} speed={9} color="#FFF4DE" seed={7} />
    <Tick x={190} y={1170} pxPerM={250} frame={f} pose="shrug" expression="worried" facing={1} />
    <Plaque x={540} y={190} text="NO ONE TO PAINT" size={72} bg={C.ink} fg={C.cream} />
  </g>
);
const e3: Shot = ({ f }) => (
  <g>
    <Day f={f} />
    <Tower x={540} y={720} size={880} ink={GREY} />
    <Plaque x={540} y={190} text="THE PAINT IS GONE" size={72} bg={C.ink} fg={C.amber} />
  </g>
);

/** f - bare steel, inside so many of our buildings. */
const Wall: React.FC<{ f: number; glow?: boolean }> = ({ f, glow = true }) => (
  <g>
    <rect x={120} y={380} width={840} height={760} rx={30} fill="#D9C7A0" stroke={C.ink} strokeWidth={10} />
    {[0, 1, 2, 3, 4].map((i) => (
      <line key={"h" + i} x1={160} y1={450 + i * 160} x2={920} y2={450 + i * 160} stroke={glow ? C.orange : C.rust} strokeWidth={24} strokeLinecap="round" opacity={0.85 + 0.15 * Math.sin(f / 6 + i)} />
    ))}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <line key={"v" + i} x1={210 + i * 130} y1={410} x2={210 + i * 130} y2={1110} stroke={C.orange} strokeWidth={14} strokeLinecap="round" opacity={0.7} />
    ))}
  </g>
);
const f1: Shot = ({ f }) => (
  <g>
    <Day f={f} ground={false} />
    <Wall f={f} />
    <Plaque x={540} y={190} text="BARE STEEL" size={110} bg={C.ink} fg={C.amber} />
  </g>
);
const f2: Shot = ({ f }) => (
  <g>
    <Day f={f} />
    {[
      [100, 620, C.petrol],
      [310, 820, C.teal],
      [520, 540, C.sea],
      [730, 760, C.petrol],
    ].map(([x, h, col], i) => (
      <g key={i}>
        <rect x={x as number} y={1180 - (h as number)} width={190} height={h as number} rx={14} fill={col as string} stroke={C.ink} strokeWidth={8} />
        {[0, 1, 2, 3].map((r) => (
          <line key={r} x1={(x as number) + 24} y1={1180 - (h as number) + 90 + r * 150} x2={(x as number) + 166} y2={1180 - (h as number) + 90 + r * 150} stroke={C.orange} strokeWidth={14} strokeLinecap="round" opacity={0.9} />
        ))}
      </g>
    ))}
    <Plaque x={540} y={190} text="SO MANY BUILDINGS" size={72} bg={C.ink} fg={C.cream} />
  </g>
);

const q: Shot = ({ f }) => (
  <g>
    <Day f={f} ground={false} />
    <g transform="translate(0 40) scale(1)">
      <Wall f={f} />
    </g>
    <Qmark f={f} x={540} y={1000} size={620} color={C.cream} />
    <Plaque x={540} y={190} text="WHAT HAPPENS TO IT?" size={60} bg={C.ink} fg={C.amber} />
  </g>
);
const end: Shot = ({ f }) => (
  <EndShot f={f} stops={SKY} q={["WHAT HAPPENS TO", "BARE STEEL?"]}>
    <g opacity={0.9}>
      <EiffelIcon x={900} y={1220} size={300} ink={C.brick} />
    </g>
  </EndShot>
);

export const ShortS68 = makeShort(timeline, [[a1, a2], [b1, b2], [c1, c2], [d1, d2], [e1, e2, e3], [f1, f2], [q, end]]);
