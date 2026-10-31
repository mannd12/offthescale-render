import React from "react";
import { useCurrentFrame } from "remotion";
import { B } from "../../../brand/tokens";
import { SceneTiming } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { FUEL } from "../gauge";
import { Card, Clip, Dim, Pill, Plate, RungShell, Svg, at, fmt, lin, mix, win } from "./shell";

/** Rung 6. #27b-d. A real Delta II Heavy (GRAIL), named from its first frame. A drawn view from below: engine and nine boosters, six lighting; the sum says whose it is. Then Dawn's own launch. */
export const Workhorse: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const main = at(t, "the main engine gives");
  const nine = at(t, "Around it are");
  const six = at(t, "Six of them");
  const add = at(t, "Add it up");
  const ours = at(t, "That's our own");
  const dawn = at(t, "And this is a real");
  const met = at(t, "carrying a spacecraft");
  const here = at(t, "This is how");
  const lit = lin(f, six, add);
  const sum = 200000 + 600000 * lin(f, add - 10, add + 40);
  const dia = win(f, main - 4, dawn, 10);
  const CX = 460;
  const CY = 590;
  return (
    <RungShell t={t} index={5} n={3.6e6} reading={f >= add ? "~800,000 LB" : "~800,000 LB"} sub="~3.6 MN · our sum, Delta II 7925" chips={f >= dawn ? [{ kind: "REAL PHOTO", source: "NASA · Dawn's launch, 2007" }] : [{ kind: "REAL FOOTAGE", source: "NASA/KSC · GRAIL, 2011" }, ...(f >= main ? [{ kind: "ILLUSTRATION" as const, source: "the view from below" }] : [])]}>
      <Clip id="l10-clip-grail" seconds={40} from={0} to={dawn + 8} />
      <Pill x={60} y={170} size={28} color={B.gauge} o={1 - ease(f, dawn - 6, 8)}>A DELTA II HEAVY · GRAIL, 2011 · NOT THE VERSION IN THE SUM</Pill>
      <Plate id="l10-dawn" from={dawn} to={t.frames + 20} s0={1.2} s1={1.7} o0={[50, 80]} o1={[50, 62]} bright={1} />
      <Pill x={60} y={170} size={28} color={B.gauge} o={ease(f, dawn, 10)}>THE DELTA II HEAVY CARRYING DAWN · 2007</Pill>
      {dia > 0 ? (
        <>
          <Svg o={dia}>
            <circle cx={CX} cy={CY} r={300} fill="rgba(5,14,24,0.88)" />
            <circle cx={CX} cy={CY} r={70} fill={B.gauge} />
            {Array.from({ length: 9 }, (_, i) => {
              const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
              const on = i % 3 !== 2 && (i - Math.floor(i / 3)) / 6 < lit;
              return <circle key={i} cx={CX + Math.cos(a) * 215} cy={CY + Math.sin(a) * 215} r={50} fill={on ? FUEL : "rgba(255,255,255,0.14)"} stroke={B.paper} strokeWidth={3} opacity={ease(f, nine + i * 3, 8)} />;
            })}
          </Svg>
          <Card x={820} y={270} big="200,000 LB" small="main engine" size={72} o={dia} />
          <Card x={820} y={450} big="~100,000 LB EACH" small="nine solid boosters" size={64} color={FUEL} o={ease(f, nine, 10) * dia} />
          <Card x={820} y={630} big={`${fmt(sum)} LB`} small={f >= six ? "six light on the pad" : undefined} size={72} color={B.paper} o={ease(f, add - 10, 10) * dia} />
          <Pill x={820} y={830} size={30} color={B.gauge} o={ease(f, ours, 10) * dia}>OUR OWN SUM, NOT A NASA FIGURE</Pill>
        </>
      ) : null}
      <Card x={60} y={260} big="LARGER BOOSTERS" size={64} color={FUEL} o={win(f, dawn + 30, met)} />
      <Card x={60} y={260} big="YOU'VE MET THE PASSENGER" size={64} color={B.paper} o={win(f, met, here)} />
      <Card x={60} y={260} big="DAWN LEAVES EARTH" size={72} o={ease(f, here, 10)} />
    </RungShell>
  );
};

/** Rung 7. #27e, f. High-speed film of a real launch. Three drawn cores, dots lighting one by one; a counter that stops at its row. */
export const ManyEngines: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const light = at(t, "Falcon Heavy lights");
  const more = at(t, "for more than");
  const div = at(t, "Divide that");
  const close = at(t, "That's close");
  const roman = at(t, "This is the launch");
  const n = lin(f, light, more + 10);
  const dia = win(f, 6, roman, 10);
  const lb = 5e6 * lin(f, more - 10, more + 30);
  return (
    <RungShell t={t} index={6} n={2.2e7} reading="5 MILLION+ LB" sub="over 22 MN · Falcon Heavy" chips={[{ kind: "REAL FOOTAGE", source: "NASA Kennedy · Roman launch, high speed" }, ...(f < roman ? [{ kind: "ILLUSTRATION" as const, source: "engine dots, layout simplified" }] : [])]}>
      <Clip id="l10-clip-roman" seconds={43} from={0} to={t.frames + 20} scale={1.6} origin="30% 0%" />
      <Pill x={60} y={170} size={28} color={B.gauge}>FALCON HEAVY · ROMAN TELESCOPE, 2026</Pill>
      <Svg o={dia}>
        <rect x={780} y={240} width={720} height={270} rx={18} fill="rgba(5,14,24,0.88)" />
        {Array.from({ length: 27 }, (_, i) => {
          const core = Math.floor(i / 9);
          const k = i % 9;
          const on = i / 27 < n;
          return <circle key={i} cx={830 + core * 235 + (k % 3) * 62} cy={290 + Math.floor(k / 3) * 62 + 20} r={24} fill={on ? B.gauge : "rgba(255,255,255,0.16)"} />;
        })}
      </Svg>
      <Card x={780} y={530} big={f >= more ? `${fmt(lb)}${lb >= 5e6 ? "+" : ""} LB` : `${Math.round(27 * n)} ENGINES`} small={f >= more ? "from 27 engines, at liftoff" : undefined} size={72} o={dia * ease(f, light, 10) * (1 - ease(f, div, 10))} />
      <Card x={780} y={530} big="÷ 27 ≈ 185,000 LB+" small="each, on average · our sum" size={66} color={B.paper} o={win(f, div, close + 40)} />
      <Pill x={780} y={720} size={26} color={B.gauge} o={win(f, close, roman)}>CLOSE TO THE DELTA'S MAIN ENGINE, 27 TIMES</Pill>
      <Card x={60} y={780} big="30 AUGUST 2026" size={60} color={B.paper} o={ease(f, roman + 30, 12)} />
    </RungShell>
  );
};

/** Rung 8. #27-34, #6. The Saturn V's weight as one drawn column, cut to scale; it drains as it burns; what came home is one pixel. Real Apollo 4 film; real Apollo 4 still. */
export const Classic: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const num = at(t, "These are the numbers");
  const tall = at(t, "Three hundred");
  const pad = at(t, "six point two two");
  const prop = at(t, "And about five and a half");
  const so = at(t, "So seven and a half");
  const ratio = at(t, "That's only about");
  const go = at(t, "Then it starts");
  const burn = at(t, "The five first-stage");
  const by = at(t, "By then");
  const third = at(t, "and it weighs");
  const moment = at(t, "This is that moment");
  const home = at(t, "And the part");
  const cm = at(t, "Nine thousand");
  const pc = at(t, "About point one");
  const H = 660;
  const Y0 = 270;
  const X = 700;
  const full = 6220025;
  const px = (lb: number) => (lb / full) * H;
  const col = (1 - ease(f, moment - 8, 10)) * ease(f, num, 12);
  const drain = lin(f, burn, third);
  const s1 = 4400000 * (1 - drain);
  const remaining = 1820025 + s1;
  const pr = ease(f, prop, 20);
  const bal = win(f, so, go, 10);
  const end = ease(f, home - 6, 12);
  const tons = 15 * 150 * lin(f, burn, by);
  return (
    <RungShell t={t} index={7} n={3.3e7} reading="7.5 MILLION LB" sub="33 MN · Saturn V, Apollo 4" pct={f >= prop ? 90 * pr : undefined} pctNote={f >= prop ? "stage propellant, Apollo 4" : undefined} flips={[prop]} chips={f >= home ? [{ kind: "ILLUSTRATION", source: "to scale" }] : f >= moment ? [{ kind: "REAL FOOTAGE", source: "NASA · Apollo 4, on-board camera" }] : [{ kind: "REAL PHOTO", source: "NASA · Apollo 4, 1967" }, { kind: "ILLUSTRATION", source: "the column" }]}>
      <Plate id="l10-a4" from={0} to={moment + 6} s0={1.1} s1={1.5} o0={[40, 46]} o1={[40, 60]} bright={0.75} />
      <Clip id="l10-clip-sep" seconds={30} from={moment} to={home + 4} scale={1.6} origin="50% 30%" />
      <Dim o={end} to={0.9} />
      <Pill x={60} y={170} size={28} color={B.gauge} o={1 - ease(f, moment - 6, 6)}>THE SATURN V, APOLLO 4, 1967</Pill>
      <Pill x={60} y={170} size={28} color={B.gauge} o={win(f, moment, home)}>APOLLO 4 · THE FIRST STAGE FALLING AWAY</Pill>
      <Svg o={col}>
        <rect x={X - 20} y={Y0 - 16} width={240} height={H + 32} rx={12} fill="rgba(5,14,24,0.78)" />
        <rect x={X} y={Y0 + H - px(remaining)} width={200} height={px(remaining)} fill="rgba(255,255,255,0.3)" stroke={B.paper} strokeWidth={3} />
        {f >= prop ? (
          <>
            <rect x={X} y={Y0 + H - px(s1)} width={200 * pr} height={px(s1)} fill={FUEL} />
            <rect x={X} y={Y0 + H - px(s1) - px(945000)} width={200 * pr} height={px(945000)} fill={FUEL} opacity={0.85} stroke="#0B1B2B" strokeWidth={2} />
            <rect x={X} y={Y0 + H - px(s1) - px(945000) - px(230000)} width={200 * pr} height={px(230000)} fill={FUEL} opacity={0.7} stroke="#0B1B2B" strokeWidth={2} />
          </>
        ) : null}
      </Svg>
      <Card x={60} y={260} big="363 FEET" size={72} color={B.paper} o={win(f, tall, pad)} />
      <Card x={60} y={260} big="6.22 MILLION LB" small="on the pad" size={66} color={B.paper} o={win(f, pad, so)} />
      <Card x={60} y={470} big="~5.6 MILLION LB" small="propellant · ~90%" size={66} color={FUEL} o={win(f, prop, so)} />
      {bal > 0 ? (
        <>
          <Svg o={bal}>
            <rect x={60} y={300} width={600} height={70} fill={B.gauge} />
            <rect x={60} y={470} width={(600 * 6.22) / 7.5} height={70} fill={B.paper} />
          </Svg>
          <Pill x={60} y={240} size={28} color={B.gauge} o={bal}>THRUST · 7.5 MILLION LB</Pill>
          <Pill x={60} y={410} size={28} o={bal}>WEIGHT · 6.22 MILLION LB</Pill>
          <Card x={60} y={590} big="~1.2 TO 1" size={92} o={ease(f, ratio, 10) * bal} />
        </>
      ) : null}
      <Card x={60} y={260} big={`${fmt(tons)} TONS GONE`} small="about 15 tons a second" size={62} color={FUEL} o={win(f, burn, moment)} />
      <Card x={60} y={460} big="~38 MILES UP" size={60} color={B.paper} o={win(f, by, moment)} />
      <Card x={60} y={580} big="~6,100 MPH" size={60} color={B.paper} o={win(f, by + 40, moment)} />
      <Pill x={60} y={700} size={30} color={B.gauge} o={win(f, third, moment)}>UNDER A THIRD OF ITS WEIGHT</Pill>
      {end > 0 ? (
        <Svg o={end}>
          <rect x={700} y={Y0} width={200} height={H} fill={FUEL} opacity={0.35} stroke={B.paper} strokeWidth={3} />
          <rect x={700} y={Y0} width={200} height={1} fill={B.paper} />
          <circle cx={800} cy={Y0} r={mix(160, 44, ease(f, cm, 30))} fill="none" stroke={B.gauge} strokeWidth={6} />
        </Svg>
      ) : null}
      <Card x={60} y={320} big="9,130 LB" small="Apollo 11's command module" size={78} color={B.paper} o={ease(f, cm, 10) * end} />
      <Card x={60} y={560} big="~0.14%" small="of the launch weight · that line" size={84} o={ease(f, pc, 10) * end} />
    </RungShell>
  );
};
