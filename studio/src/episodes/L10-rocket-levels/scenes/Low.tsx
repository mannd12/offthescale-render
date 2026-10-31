import React from "react";
import { useCurrentFrame } from "remotion";
import { B, F } from "../../../brand/tokens";
import { SceneTiming } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { FUEL } from "../gauge";
import { logMix } from "../ladder";
import { Card, Clip, Dim, Pill, Plate, RungShell, Svg, at, clamp01, fmt, lin, mix, rnd, win } from "./shell";

/** Cold. #27, #6, #10, #50. Apollo 11's engines (1280 px: inset) with Apollo 4's weights, each said on the picture. The tape sweeps; a drawn sheet of paper marks the bottom. */
export const ColdOpen: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const ninety = at(t, "And about ninety");
  const what = at(t, "So what was");
  const climb = at(t, "To find out");
  const paper = at(t, "from an engine");
  const up = at(t, "up about eight");
  const mark = at(t, "so each mark");
  const tank = at(t, "Next to it");
  const fills = at(t, "and it only fills");
  const sweep = ease(f, up, 90);
  const n = f < paper ? 3.3e7 : f < up ? logMix(3.3e7, 0.091, ease(f, paper, 40)) : logMix(0.091, 7.4e7, sweep);
  const pct = f < ninety ? undefined : f >= tank ? undefined : 90 * ease(f, ninety, 40);
  const isSaturn = f < paper;
  return (
    <RungShell t={t} index={0} title="Off the scale" n={n} reading={isSaturn ? "7.5 MILLION LB" : f < up ? "0.091 N" : `×${fmt(800 * sweep)} MILLION`} sub={isSaturn ? "33 MN · Saturn V" : f < up ? "a sheet of paper" : "from bottom to top"} pct={pct} pctNote={isSaturn && f >= ninety ? "Apollo 4's weights" : f >= tank ? "fills only where a figure exists" : undefined} flips={[ninety, tank]} chips={isSaturn ? [{ kind: "REAL FOOTAGE", source: "NASA/KSC · Apollo 11, slow motion" }] : [{ kind: "ILLUSTRATION" }]}>
      <Clip id="l10-clip-e8" seconds={40} from={0} to={paper} box={{ x: 40, y: 170, w: 1440, h: 810 }} />
      <Pill x={70} y={190} size={28} color={B.gauge} o={ease(f, 6, 10) * (1 - ease(f, paper - 12, 10))}>THE SATURN V, APOLLO 11</Pill>
      <Card x={70} y={760} big="WHAT WAS ALL THAT LIFTING?" size={62} color={B.paper} o={win(f, what, climb + 20)} />
      <Svg o={win(f, paper, up + 70)}>
        <g transform={`translate(740 ${540 + Math.sin(f / 18) * 6}) rotate(-4)`}>
          <rect x={-170} y={-220} width={340} height={440} fill={B.paper} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <line key={i} x1={-140} x2={140} y1={-170 + i * 44} y2={-170 + i * 44} stroke={B.aqua} strokeWidth={3} opacity={0.6} />
          ))}
        </g>
      </Svg>
      <Pill x={740} y={800} align="center" size={32} color={B.gauge} o={win(f, paper, up + 70)}>THE FORCE TO HOLD THIS</Pill>
      <Card x={420} y={460} big="EACH MARK IS 10×" size={84} o={win(f, mark, tank)} />
      <Svg o={ease(f, tank, 14)}>
        <path d={`M1490 ${560 + Math.sin(f / 9) * 10} L1190 ${560}`} stroke={FUEL} strokeWidth={12} strokeLinecap="round" />
        <path d={`M1490 ${560 + Math.sin(f / 9) * 10} l-40 -24 v48 z`} fill={FUEL} />
      </Svg>
      <Card x={470} y={490} big="THE TANK" small="how much of the machine is fuel" size={92} color={FUEL} o={ease(f, tank, 12)} />
      <Pill x={470} y={700} size={30} o={ease(f, fills, 12)}>BLANK WHERE NOBODY GIVES THE NUMBERS</Pill>
    </RungShell>
  );
};

/** Rung 1. #10, #11, #13, #9. A later ion thruster on test, labelled from its first frame. A four-day counter, two exhaust lanes, a 2,000-day grid. */
export const Weakest: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const paper = at(t, "and NASA says");
  const days = at(t, "At full throttle");
  const spend = at(t, "So what's the point");
  const oz = at(t, "In twenty-four");
  const ions = at(t, "and those ions");
  const stop = at(t, "And it doesn't stop");
  const plan = at(t, "The plan was");
  const tank = at(t, "Now the tank");
  const c = (1 - ease(f, days - 6, 12));
  const dayA = win(f, days, spend, 10);
  const day = 4 * lin(f, days + 10, spend - 12);
  const lanes = win(f, ions, plan, 10);
  const grid = win(f, plan, tank + 6, 10);
  return (
    <RungShell t={t} index={0} n={0.091} reading="0.091 N" sub="91 mN, at most" pct={f >= tank ? 39 * ease(f, tank, 30) : undefined} pctNote={f >= tank ? "Dawn, the spacecraft, at launch" : undefined} flips={[tank]} chips={[{ kind: "REAL PHOTO", source: "NASA/JPL-Caltech" }, ...(f >= days ? [{ kind: "ILLUSTRATION" as const, source: "the drawn figures" }] : [])]}>
      <Plate id="l10-ion" from={0} to={t.frames + 20} s0={1.02} s1={1.3} o0={[42, 50]} bright={f >= days ? 0.45 : 1} />
      <Pill x={60} y={170} size={28} color={B.gauge}>A LATER ENGINE ON TEST · NOT DAWN'S OWN</Pill>
      <Card x={60} y={260} big="91 mN" small="Dawn's engine, at most" size={96} o={ease(f, 8, 12) * c} />
      <Svg o={ease(f, paper, 14) * c}>
        <g transform={`translate(1190 ${700 + Math.sin(f / 16) * 5}) rotate(5)`}>
          <rect x={-90} y={-115} width={180} height={230} fill={B.paper} />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={-70} x2={70} y1={-80 + i * 38} y2={-80 + i * 38} stroke={B.aqua} strokeWidth={3} opacity={0.6} />
          ))}
        </g>
      </Svg>
      <Pill x={60} y={760} size={34} color={B.gauge} o={ease(f, paper, 12) * c}>ABOUT THE FORCE TO HOLD ONE SHEET OF PAPER</Pill>
      {dayA > 0 ? (
        <div style={{ opacity: dayA }}>
          <Card x={100} y={230} big={`DAY ${day.toFixed(1)}`} size={120} />
          <Svg>
            <line x1={100} y1={640} x2={1440} y2={640} stroke="rgba(255,255,255,0.3)" strokeWidth={22} strokeLinecap="round" />
            <line x1={100} y1={640} x2={100 + 1340 * (day / 4)} y2={640} stroke={B.gauge} strokeWidth={22} strokeLinecap="round" />
            {[1, 2, 3, 4].map((d) => (
              <line key={d} x1={100 + 335 * d} x2={100 + 335 * d} y1={610} y2={670} stroke={B.paper} strokeWidth={4} />
            ))}
          </Svg>
          <Pill x={100} y={690} size={32}>0 MPH</Pill>
          <Pill x={1440} y={690} size={32} align="right" color={B.gauge}>60 MPH AT FULL THROTTLE</Pill>
        </div>
      ) : null}
      <Card x={100} y={230} big="ABOUT 10 OZ OF XENON" small="in 24 hours" size={76} color={B.aqua} o={win(f, oz, plan)} />
      {lanes > 0 ? (
        <Svg o={lanes}>
          {Array.from({ length: 16 }, (_, i) => {
            const speed = 2.6;
            const x = 100 + ((f * speed + rnd(i) * 1340) % 1340);
            return <circle key={`c${i}`} cx={x} cy={530 + (rnd(i + 40) - 0.5) * 50} r={7} fill={FUEL} />;
          })}
          {Array.from({ length: 16 }, (_, i) => {
            const speed = 22;
            const x = 100 + ((f * speed + rnd(i + 7) * 1340) % 1340);
            return <line key={`i${i}`} x1={x - 90} x2={x} y1={760 + (rnd(i + 90) - 0.5) * 50} y2={760 + (rnd(i + 90) - 0.5) * 50} stroke={B.aqua} strokeWidth={6} />;
          })}
        </Svg>
      ) : null}
      <Pill x={100} y={440} size={28} color={FUEL} o={lanes}>CHEMICAL EXHAUST</Pill>
      <Pill x={100} y={670} size={28} color={B.aqua} o={lanes}>XENON IONS · 7 TO 10× FASTER · SPEEDS NOT TO SCALE</Pill>
      {grid > 0 ? (
        <Svg o={grid}>
          {Array.from({ length: 200 }, (_, i) => {
            const on = i / 200 < lin(f, plan, plan + 80);
            return <rect key={i} x={120 + (i % 25) * 52} y={380 + Math.floor(i / 25) * 52} width={44} height={44} rx={6} fill={on ? B.gauge : "rgba(255,255,255,0.15)"} />;
          })}
        </Svg>
      ) : null}
      <Card x={120} y={230} big="ABOUT 2,000 DAYS PLANNED" small="each square, ten days" size={64} o={grid} />
    </RungShell>
  );
};

/** Rung 2. #12, #8, #16. The real launch. A drawn balance whose weights are to scale by area. The 1926 flight, drawn against a 41-foot pole. */
export const Hobby: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const more = at(t, "more than a hundred");
  const burn = at(t, "and it burns");
  const odd = at(t, "Here's the odd");
  const lift = at(t, "and the most");
  const five = at(t, "So at its limit");
  const down = at(t, "The tank went");
  const back = at(t, "Now look back");
  const rose = at(t, "It rose");
  const bal = win(f, odd - 4, back, 12);
  const old = ease(f, back - 4, 12);
  const riseK = ease(f, rose, 75);
  const b = 620;
  return (
    <RungShell t={t} index={1} n={10.7} reading="10.7 N" sub="at its peak · Estes A8" pct={f >= five ? 5 : undefined} pctNote={f >= five ? "at the motor's rated limit" : undefined} flips={[five]} chips={f >= back ? [{ kind: "ILLUSTRATION", source: "the 1926 rocket, drawn" }] : f >= odd ? [{ kind: "ILLUSTRATION", source: "areas to scale" }] : [{ kind: "REAL PHOTO", source: "newmexico.photographer, CC BY 2.0" }]}>
      <Plate id="l10-model" from={0} to={odd + 12} s0={1.0} s1={1.25} o0={[50, 30]} o1={[50, 62]} bright={0.95} />
      <Pill x={60} y={170} size={28} color={B.gauge} o={1 - ease(f, odd - 8, 10)}>A MODEL ROCKET · NOT NECESSARILY AN A8</Pill>
      <Card x={60} y={260} big="10.7 N" small="peak thrust" size={88} o={ease(f, 8, 10) * (1 - ease(f, odd - 8, 10))} />
      <Card x={60} y={470} big="100×+" small="the ion engine" size={72} color={B.paper} o={win(f, more, burn + 30)} />
      <Card x={60} y={470} big="0.8 SECONDS" small="and it's done" size={72} color={B.paper} o={win(f, burn + 30, odd)} />
      {bal > 0 ? (
        <>
          <Svg o={bal}>
            <rect x={120} y={b} width={1280} height={10} fill={B.paper} />
            <rect x={300} y={b - 26 * Math.sqrt(4.1) * 2} width={52 * Math.sqrt(4.1)} height={52 * Math.sqrt(4.1)} fill={FUEL} />
            <rect x={840} y={b - 52 * Math.sqrt(85)} width={52 * Math.sqrt(85)} height={52 * Math.sqrt(85)} fill="rgba(255,255,255,0.28)" opacity={ease(f, lift, 12)} stroke={B.paper} strokeWidth={3} />
          </Svg>
          <Pill x={350} y={b + 30} align="center" size={32} color={FUEL} o={bal}>4.1 g OF PROPELLANT</Pill>
          <Pill x={1080} y={b + 30} align="center" size={32} o={bal * ease(f, lift, 12)}>85 g · THE MOST IT'S RATED TO LIFT</Pill>
          <Card x={150} y={260} big="ABOUT 5% FUEL" size={92} color={FUEL} o={ease(f, five, 12) * bal} />
          <Pill x={150} y={400} size={32} color={B.gauge} o={ease(f, down, 10) * bal}>THE TANK WENT DOWN</Pill>
        </>
      ) : null}
      {old > 0 ? (
        <>
          <Svg o={old}>
            <line x1={120} y1={880} x2={1460} y2={880} stroke={B.paper} strokeWidth={4} />
            <rect x={1040} y={260} width={14} height={620} fill={B.mute} />
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={1040} x2={1090} y1={260 + i * 155} y2={260 + i * 155} stroke={B.paper} strokeWidth={4} />
            ))}
            <g transform={`translate(${mix(620, 880, riseK)} ${mix(860, 300, Math.sin(Math.PI * riseK * 0.5))})`}>
              <rect x={-6} y={-60} width={12} height={60} fill={B.paper} />
              <rect x={-30} y={-6} width={60} height={8} fill={B.paper} />
              <path d="M-5 2 L5 2 L0 40 Z" fill={FUEL} opacity={f >= rose ? 1 : 0} />
            </g>
          </Svg>
          <Card x={120} y={230} big="1926" small="the first liquid-fuel rocket" size={84} color={B.paper} />
          <Pill x={120} y={410} size={30} o={ease(f, back + 40, 12)}>GASOLINE AND LIQUID OXYGEN</Pill>
          <Pill x={1110} y={250} size={32} color={B.gauge} o={ease(f, rose, 12)}>41 FEET</Pill>
          <Pill x={120} y={480} size={30} color={B.gauge} o={ease(f, rose + 40, 12)}>IN 2.5 SECONDS</Pill>
        </>
      ) : null}
    </RungShell>
  );
};

/** Rung 3. #19-21, #23. The vehicle itself (Hi-C, 2024); another sounding rocket moving; a drawn arc; a clock whose bright slice is the minutes that count. */
export const Edge: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const first = at(t, "The first gives");
  const second = at(t, "the second eighty");
  const burn = at(t, "Forty-six seconds");
  const carry = at(t, "And that typically");
  const over = at(t, "That's above");
  const most = at(t, "Most of these");
  const five = at(t, "and only five");
  const one = at(t, "One NASA flight");
  const sub = at(t, "These are suborbital");
  const bar = win(f, first, carry, 10);
  const arc = win(f, carry - 4, most, 10);
  const ring = win(f, most - 4, one, 10);
  const pics = 1500 * lin(f, one + 6, sub - 10);
  const hk = lin(f, carry + 10, most - 10);
  const R = 230;
  const sweep = lin(f, most, five);
  const slice = (a0: number, a1: number) => {
    const p = (a: number) => [760 + Math.sin(a) * R, 570 - Math.cos(a) * R];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M760 570 L${x0} ${y0} A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1} Z`;
  };
  const TAU = Math.PI * 2;
  const clipOn = f >= carry - 8 && f < most;
  return (
    <RungShell t={t} index={2} n={8.9e4} reading="89 kN" sub="Terrier-Black Brant IX, first stage" chips={clipOn ? [{ kind: "REAL FOOTAGE", source: "NASA SVS/WFF · Australia campaign" }, { kind: "ILLUSTRATION", source: "the arc" }] : f >= most ? [{ kind: "ILLUSTRATION" }] : [{ kind: "REAL PHOTO", source: "NASA / Lee Wingfield, 2024" }]}>
      <Plate id="l10-bb9" from={0} to={carry + 10} s0={1.05} s1={1.5} o0={[50, 66]} o1={[50, 40]} bright={1} />
      <Pill x={60} y={170} size={28} color={B.gauge} o={1 - ease(f, carry - 8, 8)}>A BLACK BRANT IX, ALASKA, 2024</Pill>
      <Clip id="l10-clip-sr" seconds={20} from={carry} to={most + 6} />
      <Pill x={60} y={170} size={28} color={B.gauge} o={win(f, carry, most)}>ANOTHER NASA SOUNDING ROCKET</Pill>
      {bar > 0 ? (
        <div style={{ opacity: bar }}>
          <Svg>
            <rect x={80} y={770} width={1370} height={60} rx={8} fill="rgba(5,14,24,0.9)" />
            <rect x={80} y={770} width={1370 * (6 / 46) * lin(f, first, first + 40)} height={60} fill={B.gauge} />
            <rect x={80 + 1370 * (12 / 46)} y={770} width={1370 * (34 / 46) * lin(f, second, second + 60)} height={60} fill={B.aqua} />
          </Svg>
          <Pill x={80} y={700} size={28} color={B.gauge}>89,000 N · 6 s</Pill>
          <Pill x={80 + 1370 * (12 / 46)} y={700} size={28} color={B.aqua} o={ease(f, second, 10)}>81,000 N · 34 s</Pill>
          <Pill x={1450} y={850} align="right" size={28} o={ease(f, burn, 10)}>ALL OVER BY 46 s · GAP NOT TO SCALE</Pill>
        </div>
      ) : null}
      {arc > 0 ? (
        <Svg o={arc}>
          <path d="M120 900 Q 760 -300 1400 900" fill="none" stroke={B.paper} strokeWidth={5} strokeDasharray="14 12" />
          <circle cx={mix(120, 1400, hk)} cy={900 - 4 * hk * (1 - hk) * 600} r={13} fill={B.gauge} />
        </Svg>
      ) : null}
      <Card x={120} y={230} big="360 kg → 400 km" size={72} o={arc} />
      <Pill x={120} y={350} size={30} o={ease(f, over, 10) * arc}>ABOVE THE ATMOSPHERE · NOT FOR LONG</Pill>
      {ring > 0 ? (
        <Svg o={ring}>
          <circle cx={760} cy={570} r={R} fill="rgba(255,255,255,0.12)" stroke={B.paper} strokeWidth={4} />
          <path d={slice(0, Math.max(0.01, TAU * sweep * 0.999))} fill="rgba(255,255,255,0.22)" />
          {f >= five ? <path d={slice(TAU * 0.2, TAU * (0.2 + 0.3 * ease(f, five, 20)))} fill={B.gauge} /> : null}
        </Svg>
      ) : null}
      <Pill x={760} y={210} align="center" size={36} o={ring}>MOST FLIGHTS: 15 TO 20 MINUTES</Pill>
      <Pill x={760} y={840} align="center" size={36} color={B.gauge} o={ease(f, five, 10) * ring}>5 OR 6 OBSERVING ABOVE THE ATMOSPHERE</Pill>
      {f >= one - 8 ? (
        <Svg o={ease(f, one - 8, 12) * (1 - ease(f, sub, 10))}>
          <circle cx={760} cy={570} r={170} fill={B.gauge} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={120 + (i % 12) * 112} y={800} width={96} height={60} fill={i / 12 < pics / 1500 ? B.paper : "rgba(255,255,255,0.15)"} />
          ))}
        </Svg>
      ) : null}
      <Card x={120} y={230} big={`${fmt(pics)} PICTURES`} small="of the Sun, in five minutes" size={72} color={B.paper} o={win(f, one, sub)} />
      <Card x={500} y={480} big="SUBORBITAL" small="height alone doesn't keep you up" size={92} color={B.gauge} o={ease(f, sub, 12)} />
    </RungShell>
  );
};

/** Rung 4. #24, #25. MR-3, labelled as a later flight from its first frame. A drawn pad: the rise of a few inches, repeated, and a connector letting go. */
export const FewInches: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const tall = at(t, "stood eighty-three");
  const burn = at(t, "burning liquid");
  const made = at(t, "It made");
  const here = at(t, "And here's one");
  const rose = at(t, "at launch, it rose");
  const shut = at(t, "The engines shut");
  const cause = at(t, "The cause");
  const conn = at(t, "Power and control");
  const ruler = at(t, "Seventy-eight thousand pounds of thrust, and");
  const pad = ease(f, here - 6, 12);
  const up = 26 * ease(f, rose, 18) * (1 - ease(f, shut, 26));
  const off = ease(f, conn, 24);
  const GY = 860;
  return (
    <RungShell t={t} index={3} n={3.47e5} reading="78,000 LB" sub="347 kN · Mercury-Redstone" chips={f >= here ? [{ kind: "ILLUSTRATION", source: "not to scale · rise exaggerated" }] : [{ kind: "REAL PHOTO", source: "NASA · MR-3, 1961" }]}>
      <Plate id="l10-mr3" from={0} to={here + 8} s0={1} s1={1.35} o0={[50, 72]} o1={[50, 46]} bright={1} />
      <Pill x={60} y={170} size={28} color={B.gauge} o={1 - pad}>MR-3, 1961 · A LATER FLIGHT THAN THE ONE COMING UP</Pill>
      <Card x={60} y={260} big="83 FEET" small="with its spacecraft" size={80} color={B.paper} o={win(f, tall, burn + 16)} />
      <Card x={60} y={260} big="LIQUID OXYGEN + RP-1" size={64} color={B.aqua} o={win(f, burn + 16, made)} />
      <Card x={60} y={260} big="78,000 LB" small="of thrust" size={96} o={win(f, made, here)} />
      {pad > 0 ? (
        <Svg o={pad}>
          <rect x={60} y={GY} width={1440} height={14} fill={B.mute} />
          <rect x={820} y={GY - 40} width={320} height={40} fill={B.mute} />
          <g transform={`translate(0 ${-up})`}>
            <rect x={950} y={GY - 560} width={60} height={520} fill={B.paper} />
            <path d={`M950 ${GY - 560} L980 ${GY - 650} L1010 ${GY - 560} Z`} fill={B.paper} />
            <path d={`M950 ${GY - 40} L920 ${GY - 40} L950 ${GY - 110} Z M1010 ${GY - 40} L1040 ${GY - 40} L1010 ${GY - 110} Z`} fill={B.paper} />
            {up > 1 ? <path d={`M962 ${GY - 40} L998 ${GY - 40} L980 ${GY - 40 + up + 6} Z`} fill={FUEL} /> : null}
          </g>
          {/* the connector */}
          <line x1={470} y1={GY - 300} x2={mix(950, 800, off)} y2={mix(GY - 300, GY - 180, off)} stroke={off > 0 ? B.tease : B.aqua} strokeWidth={10} strokeLinecap="round" />
          <rect x={410} y={GY - 340} width={60} height={340} fill={B.mute} />
          {f >= ruler ? (
            <g opacity={ease(f, ruler, 12)}>
              <rect x={1080} y={GY - 120} width={36} height={120} fill={B.gauge} />
              {Array.from({ length: 7 }, (_, i) => (
                <line key={i} x1={1080} x2={1098} y1={GY - i * 18} y2={GY - i * 18} stroke={B.ink} strokeWidth={3} />
              ))}
            </g>
          ) : null}
        </Svg>
      ) : null}
      <Card x={80} y={230} big="NOVEMBER 1960" small="nobody aboard" size={72} color={B.paper} o={win(f, here + 10, cause)} />
      <Card x={80} y={420} big="A FEW INCHES" small="then back on the pad" size={80} o={win(f, rose, cause)} />
      <Card x={80} y={230} big="NOT THE ENGINES" size={72} color={B.paper} o={win(f, cause, ruler)} />
      <Pill x={80} y={400} size={30} color={B.tease} o={win(f, conn, ruler)}>CONNECTORS CAME AWAY TOO EARLY</Pill>
      <Card x={80} y={230} big="78,000 LB" small="a height for a ruler" size={80} o={ease(f, ruler, 12)} />
    </RungShell>
  );
};

/** Rung 5. #27a, #4, #2. The real Titan II rising. A drawn logarithm with a dot crawling along it; ratio ten, ratio a hundred. A 90 / 1 stack. */
export const TheRule: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const titan = at(t, "The Titan two");
  const eq = at(t, "The ideal rocket");
  const exh = at(t, "how fast your exhaust");
  const log = at(t, "and the logarithm");
  const trap = at(t, "That logarithm");
  const sq = at(t, "You square it");
  const so = at(t, "So in NASA's");
  const one = at(t, "and about one");
  const cur = win(f, trap - 8, so, 10);
  const plot = (r: number) => [160 + (r / 100) * 1240, 880 - (Math.log(r) / Math.log(100)) * 540] as const;
  const path = Array.from({ length: 100 }, (_, i) => plot(i + 1)).map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const kk = lin(f, trap, sq + 40);
  const dotR = kk < 0.45 ? mix(1, 10, kk / 0.45) : mix(10, 100, (kk - 0.45) / 0.55);
  const [dx, dy] = plot(dotR);
  const [x10, y10] = plot(10);
  const [x100, y100] = plot(100);
  return (
    <RungShell t={t} index={4} n={1.9e6} reading="430,000 LB" sub="1.9 MN · Titan II, first stage" chips={f >= eq - 8 ? [{ kind: "ILLUSTRATION", source: "after NASA Glenn's equation" }] : [{ kind: "REAL PHOTO", source: "NASA/KSC · Gemini 11, 1966" }]}>
      <Plate id="l10-titan" from={0} to={t.frames + 20} s0={1.02} s1={1.3} o0={[50, 30]} o1={[50, 55]} bright={f >= eq - 8 ? 0.28 : 1} />
      <Pill x={60} y={170} size={28} color={B.gauge} o={1 - ease(f, eq - 8, 8)}>TITAN II, GEMINI 11, 1966</Pill>
      <Card x={60} y={260} big="109 FEET" small="430,000 lb of thrust" size={80} o={win(f, titan, eq)} />
      <div style={{ position: "absolute", left: 90, top: 240, opacity: win(f, eq, trap, 10), display: "flex", gap: 22, fontFamily: F.headline, fontSize: 66, color: B.paper, whiteSpace: "nowrap", alignItems: "center" }}>
        <span>SPEED GAINED =</span>
      </div>
      <Card x={90} y={350} big="EXHAUST SPEED" size={78} color={B.aqua} o={ease(f, exh, 10) * win(f, eq, trap, 10)} />
      <Card x={90} y={510} big="× LOG (FULL ÷ EMPTY)" size={78} color={FUEL} o={ease(f, log, 10) * win(f, eq, trap, 10)} />
      <Svg o={cur}>
        <line x1={160} y1={880} x2={1420} y2={880} stroke={B.paper} strokeWidth={4} />
        <line x1={160} y1={880} x2={160} y2={290} stroke={B.paper} strokeWidth={4} />
        <path d={path} fill="none" stroke={FUEL} strokeWidth={8} />
        <circle cx={dx} cy={dy} r={16} fill={B.gauge} />
        <line x1={x10} x2={x10} y1={880} y2={y10} stroke={B.mute} strokeWidth={3} strokeDasharray="8 8" opacity={kk > 0.45 ? 1 : 0} />
        <line x1={x100} x2={x100} y1={880} y2={y100} stroke={B.mute} strokeWidth={3} strokeDasharray="8 8" opacity={kk > 0.95 ? 1 : 0} />
      </Svg>
      <Pill x={170} y={290} size={26} o={cur}>SPEED GAINED</Pill>
      <Pill x={1420} y={896} align="right" size={26} o={cur}>FULL ÷ EMPTY WEIGHT</Pill>
      <Pill x={x10 + 12} y={y10 + 30} size={30} color={B.gauge} o={cur * clamp01((kk - 0.42) * 12)}>RATIO 10</Pill>
      <Pill x={x100 - 10} y={y100 + 40} align="right" size={30} color={B.gauge} o={cur * ease(f, sq, 12)}>DOUBLE THE SPEED: RATIO 100</Pill>
      {f >= so - 6 ? (
        <Svg o={ease(f, so - 6, 12)}>
          <rect x={600} y={250} width={300} height={650} fill="rgba(255,255,255,0.2)" stroke={B.paper} strokeWidth={4} />
          <rect x={600} y={250 + 65} width={300} height={585 * ease(f, so + 6, 30)} fill={FUEL} />
          <rect x={600} y={250} width={300} height={6.5} fill={B.gauge} opacity={ease(f, one, 10)} />
        </Svg>
      ) : null}
      <Card x={100} y={560} big="90% PROPELLANT" size={64} color={FUEL} o={ease(f, so + 6, 12)} />
      <Pill x={920} y={228} size={32} color={B.gauge} o={ease(f, one, 10)}>~1% PAYLOAD</Pill>
      <Pill x={100} y={480} size={28} o={ease(f, so - 6, 12)}>NASA'S IDEAL CASE, GOING TO ORBIT</Pill>
    </RungShell>
  );
};
