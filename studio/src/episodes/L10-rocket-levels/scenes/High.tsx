import React from "react";
import { useCurrentFrame } from "remotion";
import { B, F } from "../../../brand/tokens";
import { SceneTiming } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { FUEL } from "../gauge";
import { logMix } from "../ladder";
import { Card, Clip, Dim, Pill, Plate, RungShell, Svg, at, fmt, lin, mix, win } from "./shell";

/** Rung 9. #27g-k. A real liftoff. Two boosters taking most of a drawn thrust bar; one page's conflicting figures, side by side; the weight, sorted into a stack. */
export const HalfSolid: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const eng = at(t, "and the three main");
  const nasa = at(t, "NASA's reference");
  const above = at(t, "just above");
  const page = at(t, "But that same");
  const close = at(t, "So call it");
  const tank = at(t, "Now look at");
  const each = at(t, "Each booster");
  const big = at(t, "and the big tank");
  const comes = at(t, "That comes");
  const shape = at(t, "A very different");
  const all = at(t, "And all of it");
  const stack = win(f, tank - 6, shape, 10);
  const H = 640;
  const px = (lb: number) => (lb / 4.5e6) * H;
  const Y = 270 + H;
  const a = px(1107000) * lin(f, each, each + 20);
  const c = px(1585379) * lin(f, big, big + 20);
  return (
    <RungShell t={t} index={8} n={3.47e7} reading="7.8 MILLION LB" sub="~35 MN · NASA's stated total" pct={f >= comes ? 84 * ease(f, comes, 24) : undefined} pctNote={f >= comes ? "our sum from NASA's weights" : undefined} flips={[comes]} chips={[{ kind: "REAL FOOTAGE", source: "NASA · STS-132, 2010" }, ...(f >= tank ? [{ kind: "ILLUSTRATION" as const, source: "the stack" }] : [])]}>
      <Clip id="l10-clip-sts" seconds={40} from={0} to={t.frames + 20} />
      <Pill x={60} y={170} size={28} color={B.gauge}>THE SPACE SHUTTLE, STS-132, 2010</Pill>
      <Svg o={win(f, 8, nasa, 10)}>
        <rect x={60} y={720} width={1000} height={60} fill={FUEL} />
        <rect x={60 + 1000 * 0.8} y={720} width={200} height={60} fill={B.aqua} opacity={ease(f, eng, 10)} />
      </Svg>
      <Pill x={60} y={660} size={28} color={FUEL} o={win(f, 8, nasa, 10)}>SOLID BOOSTERS: MOST OF IT</Pill>
      <Pill x={1060} y={790} align="right" size={28} color={B.aqua} o={ease(f, eng, 10) * (1 - ease(f, nasa, 10))}>MAIN ENGINES: 1.2 MILLION LB+</Pill>
      <Card x={60} y={260} big="7.8 MILLION LB" small="NASA's total" size={78} o={win(f, nasa, tank)} />
      <Pill x={60} y={450} size={30} color={B.gauge} o={win(f, above, page)}>SATURN V, THIS LADDER: 7.5</Pill>
      <Card x={60} y={450} big="BOOSTERS: 5.3 · 5.8" small="million lb, on the same NASA page" size={60} color={B.paper} o={win(f, page, tank)} />
      <Card x={60} y={640} big="TOO CLOSE TO RANK" size={72} color={B.tease} ink={B.paper} o={win(f, close, tank)} />
      <Dim o={stack} to={0.55} />
      <Svg o={stack}>
        <rect x={960} y={270} width={300} height={H} fill="rgba(5,14,24,0.7)" stroke={B.paper} strokeWidth={4} />
        <rect x={960} y={Y - a} width={300} height={a} fill={FUEL} />
        <rect x={960} y={Y - 2 * a} width={300} height={a} fill={FUEL} opacity={0.85} stroke="#0B1B2B" strokeWidth={3} />
        <rect x={960} y={Y - 2 * a - c} width={300} height={c} fill={B.gauge} stroke="#0B1B2B" strokeWidth={3} />
      </Svg>
      <Card x={60} y={260} big="4.5 MILLION LB" small="at liftoff" size={72} color={B.paper} o={stack} />
      <Card x={60} y={450} big="~1.1 MILLION × 2" small="each booster's propellant" size={58} color={FUEL} o={ease(f, each, 10) * stack} />
      <Card x={60} y={620} big="~1.6 MILLION" small="in the big tank" size={58} o={ease(f, big, 10) * stack} />
      <Card x={60} y={790} big="ABOUT 84%" size={72} color={FUEL} o={ease(f, comes, 10) * stack} />
      <Card x={60} y={300} big="ALMOST THE SAME SHARE" size={64} color={B.paper} o={win(f, shape, all)} />
      <Card x={60} y={300} big="ONLY THE TANK ISN'T REUSED" size={64} o={ease(f, all, 10)} />
    </RungShell>
  );
};

/** Rung 10. #40, #7, #43, #45, #34, #46. Slow-motion Artemis I. Two drawn silhouettes to scale; two Moon bars with their units; a pad filling against a clock. */
export const Giant: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const light = at(t, "and lighter");
  const reach = at(t, "But it reaches");
  const share = at(t, "The share");
  const each = at(t, "Each booster");
  const largest = at(t, "and it's the largest");
  const moon = at(t, "And more thrust");
  const sat = at(t, "The Saturn V could");
  const units = at(t, "Those are");
  const one = at(t, "One more thing");
  const gal = at(t, "Roughly four");
  const sound = at(t, "What's it for");
  const sil = win(f, 6, reach, 10);
  const bars = win(f, moon - 4, one, 10);
  const water = ease(f, one - 4, 12);
  const fill = lin(f, gal, sound);
  const rocket = (x: number, h: number, c: string) => (
    <g>
      <rect x={x - 26} y={900 - h} width={52} height={h - 40} fill={c} />
      <path d={`M${x - 26} ${900 - h} L${x} ${900 - h - 40} L${x + 26} ${900 - h} Z`} fill={c} />
    </g>
  );
  return (
    <RungShell t={t} index={9} n={3.9e7} reading="8.8 MILLION LB" sub="39 MN, maximum · SLS Block 1" pct={f >= share ? 86 * ease(f, share, 24) : undefined} pctNote={f >= share ? "without the upper stage" : undefined} flips={[share]} chips={[{ kind: "REAL FOOTAGE", source: "NASA Marshall · Artemis I, slow motion" }, ...(sil > 0 || bars > 0 || water > 0 ? [{ kind: "ILLUSTRATION" as const, source: "the drawings" }] : [])]}>
      <Clip id="l10-clip-slo" seconds={60} from={0} to={t.frames + 20} />
      <Pill x={60} y={170} size={28} color={B.gauge}>SLS BLOCK 1 · ARTEMIS I, 2022</Pill>
      <Svg o={sil}>
        <rect x={60} y={230} width={600} height={700} rx={16} fill="rgba(5,14,24,0.8)" />
        {rocket(200, 600, B.paper)}
        {rocket(500, (600 * 322) / 363, B.gauge)}
        <line x1={80} x2={640} y1={900} y2={900} stroke={B.paper} strokeWidth={4} />
      </Svg>
      <Pill x={200} y={910} align="center" size={24} o={sil}>SATURN V · 363 FT</Pill>
      <Pill x={500} y={910} align="center" size={24} color={B.gauge} o={sil}>SLS · 322 FT</Pill>
      <Card x={700} y={260} big="5.75 MILLION LB" small="lighter, too" size={60} color={B.paper} o={ease(f, light, 10) * sil} />
      <Card x={60} y={260} big="ABOUT 15% MORE" small="NASA's words, against the Saturn V" size={72} o={win(f, reach + 30, share)} />
      <Card x={60} y={260} big="ABOUT 86%" small="the share hardly moves" size={80} color={FUEL} o={win(f, share, each)} />
      <Card x={60} y={260} big="~6 TONS A SECOND" small="each booster" size={72} color={FUEL} o={win(f, each, moon - 4)} />
      <Pill x={60} y={470} size={30} color={B.gauge} o={win(f, largest, moon - 4)}>THE LARGEST SOLID BOOSTER TO FLY, NASA SAYS</Pill>
      <Dim o={bars} to={0.55} />
      <Svg o={bars}>
        <rect x={100} y={430} width={1300 * 0.48 * lin(f, sat, sat + 30)} height={90} fill={B.paper} />
        <rect x={100} y={650} width={1300 * 0.27 * lin(f, moon + 20, moon + 50)} height={90} fill={B.gauge} />
      </Svg>
      <Pill x={100} y={370} size={30} o={ease(f, sat, 10) * bars}>SATURN V · 48 TONS TO THE MOON</Pill>
      <Pill x={100} y={590} size={30} color={B.gauge} o={ease(f, moon + 20, 10) * bars}>SLS BLOCK 1 · OVER 27 METRIC TONS</Pill>
      <Card x={100} y={790} big="DIFFERENT UNITS, DIFFERENT MISSIONS" small="later versions planned to carry more" size={46} color={B.paper} o={ease(f, units, 10) * bars} />
      {water > 0 ? (
        <>
          <Dim o={water} to={0.55} />
          <Svg o={water}>
            <rect x={200} y={300} width={1000} height={580} fill="rgba(5,14,24,0.7)" stroke={B.paper} strokeWidth={4} />
            <rect x={200} y={880 - 580 * fill} width={1000} height={580 * fill} fill={B.aqua} opacity={0.75} />
          </Svg>
          <Card x={700} y={420} align="center" big={`${fmt(400000 * fill)} GALLONS`} small={`in under 30 seconds`} size={78} color={B.paper} o={ease(f, gal, 10)} />
          <Card x={700} y={660} align="center" big="FOR SOUND" size={96} o={ease(f, sound, 10)} />
        </>
      ) : null}
    </RungShell>
  );
};

/** Rung 11. #47-49a. The document as the picture: a drawn table row. The real ignition photo; NASA's tracking film, inset, 2023. A drawn weighing against SLS. The tank stays blank. */
export const TopOfTape: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const warn = at(t, "with a warning");
  const doc = at(t, "A draft FAA");
  const up = at(t, "And it lists");
  const prop = at(t, "The propellant in");
  const sls = at(t, "That's more than");
  const ship = at(t, "and the ship");
  const paper = at(t, "These are paper");
  const tank = at(t, "and without a total");
  const rep = at(t, "The latest report");
  const row = win(f, doc - 6, prop, 10);
  const w = win(f, prop - 4, paper, 10);
  const scale = 620 / 3700;
  return (
    <RungShell t={t} index={10} n={7.4e7} dashed={f >= up ? 1.03e8 : undefined} reading="74 MN" sub={f >= doc ? "~16.6 million lb · FAA figure, draft" : "Super Heavy booster"} pctNote={f >= tank ? "no total weight read" : undefined} chips={f >= rep ? [{ kind: "REAL FOOTAGE", source: "NASA tracking film, 18 Nov 2023" }] : f >= doc ? [{ kind: "ILLUSTRATION", source: "after the FAA's Table 2" }] : [{ kind: "REAL PHOTO", source: "Steve Jurvetson, CC BY 2.0 · 2024" }]}>
      <Plate id="l10-starship" from={0} to={rep + 12} s0={1.0} s1={1.2} o0={[50, 45]} bright={f >= doc ? 0.3 : 0.95} />
      <Pill x={60} y={170} size={28} color={B.gauge} o={ease(f, 6, 8) * (1 - ease(f, rep - 6, 8))}>STARSHIP ON SUPER HEAVY, IGNITION, 2024</Pill>
      <Card x={60} y={800} big="PAPER FIGURES AHEAD" size={56} color={B.tease} ink={B.paper} o={win(f, warn, doc)} />
      {row > 0 ? (
        <div style={{ position: "absolute", left: 90, top: 280, width: 1360, opacity: row, fontFamily: F.ui, fontWeight: 800, color: B.ink, background: B.paper, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "flex", padding: "14px 24px", fontSize: 26, background: "#D8E0E8" }}>
            <div style={{ width: 460 }}>FAA DRAFT, TABLE 2</div>
            <div style={{ width: 440 }}>2022 ASSESSMENT</div>
            <div style={{ width: 400 }}>UPGRADED DESIGN</div>
          </div>
          <div style={{ display: "flex", padding: "20px 24px", alignItems: "center" }}>
            <div style={{ width: 460, fontSize: 30 }}>Booster thrust</div>
            <div style={{ width: 440, fontFamily: F.headline, fontSize: 96 }}>74 MN</div>
            <div style={{ width: 400, fontFamily: F.headline, fontSize: 96, opacity: ease(f, up, 10), color: B.teaseInk }}>103 MN</div>
          </div>
        </div>
      ) : null}
      <Pill x={90} y={560} size={30} o={ease(f, doc + 60, 10) * row}>ABOUT 16.6 MILLION POUNDS · OUR CONVERSION</Pill>
      <Pill x={90} y={630} size={30} color={B.gauge} o={ease(f, up + 30, 10) * row}>DASHED ON THE TAPE: PROPOSED</Pill>
      {w > 0 ? (
        <Svg o={w}>
          <line x1={120} x2={1440} y1={900} y2={900} stroke={B.paper} strokeWidth={4} />
          <rect x={200} y={900 - 3700 * scale * lin(f, prop, prop + 30)} width={300} height={3700 * scale * lin(f, prop, prop + 30)} fill={FUEL} />
          <rect x={620} y={900 - 2608 * scale} width={300} height={2608 * scale} fill={B.paper} opacity={ease(f, sls, 10)} />
          <rect x={1040} y={900 - 1500 * scale} width={300} height={1500 * scale} fill={FUEL} opacity={ease(f, ship, 10)} />
        </Svg>
      ) : null}
      <Pill x={350} y={918} align="center" size={24} color={FUEL} o={w}>3,700 t · BOOSTER PROPELLANT</Pill>
      <Pill x={770} y={918} align="center" size={24} o={w * ease(f, sls, 10)}>~2,600 t · A WHOLE FUELLED SLS</Pill>
      <Pill x={1190} y={918} align="center" size={24} color={FUEL} o={w * ease(f, ship, 10)}>1,500 t · THE SHIP</Pill>
      <Card x={60} y={300} big="PAPER FIGURES" small="flown thrust: no primary source found" size={72} color={B.paper} o={win(f, paper, rep)} />
      <Clip id="l10-clip-star" seconds={35} from={rep} to={t.frames + 20} box={{ x: 200, y: 200, w: 1100, h: 619 }} />
      <Pill x={220} y={220} size={26} color={B.gauge} o={ease(f, rep, 10)}>A 2023 TEST FLIGHT · FILMED BY NASA</Pill>
      <Card x={200} y={840} big="13TH TEST FLIGHT · 24 JULY 2026" small="suborbital, as reported" size={44} o={ease(f, rep + 10, 10)} />
    </RungShell>
  );
};

/** Closer. #50, #14, #51, #4, #11. The tape falls to the bottom; Dawn's launch; two speed bars of comparable length; two tanks; the line. */
export const Closer: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const drop = at(t, "Now watch the tape");
  const rem = at(t, "Remember that Delta");
  const expect = at(t, "NASA expected");
  const jpl = at(t, "JPL's forecast");
  const vesta = at(t, "And it carried");
  const look = at(t, "And look at");
  const eq = at(t, "That's the equation");
  const where = at(t, "So that's where");
  const off = at(t, "Thrust gets you");
  const n = f < drop ? 7.4e7 : logMix(7.4e7, 0.091, ease(f, drop, 70));
  const bars = win(f, expect - 4, look, 10);
  const tanks = win(f, look - 4, where, 10);
  const tank = (x: number, pct: number, c: string) => (
    <g>
      <rect x={x} y={280} width={220} height={560} rx={16} fill="none" stroke={B.paper} strokeWidth={5} />
      <rect x={x + 6} y={280 + 560 * (1 - pct / 100) * 1 + 6} width={208} height={(560 * pct) / 100 - 12} rx={10} fill={c} />
    </g>
  );
  return (
    <RungShell t={t} index={10} title="Back to the bottom" n={n} reading={n > 1 ? "FALLING" : "0.091 N"} sub={n > 1 ? "all the way down" : "a sheet of paper"} pct={f >= look ? 39 : undefined} pctNote={f >= look ? "Dawn, the spacecraft" : undefined} chips={f >= drop && f < expect ? [{ kind: "REAL PHOTO", source: "NASA · Dawn's launch, 2007" }] : [{ kind: "ILLUSTRATION" }]}>
      <Plate id="l10-dawn" from={0} to={expect + 8} s0={1.1} s1={1.6} o0={[50, 70]} o1={[50, 60]} bright={0.85} />
      <Card x={60} y={260} big="~800 MILLION ×" small="about nine powers of ten" size={72} o={win(f, 8, rem)} />
      <Pill x={60} y={170} size={28} color={B.gauge} o={win(f, rem, expect)}>THE DELTA II HEAVY CARRYING DAWN · 2007</Pill>
      <Dim o={Math.max(bars, tanks)} to={0.7} />
      <Svg o={bars}>
        <rect x={100} y={470} width={1250 * ease(f, expect, 30)} height={80} fill={B.paper} />
        <rect x={100} y={650} width={1250 * lin(f, expect + 40, jpl)} height={80} fill={B.aqua} />
      </Svg>
      <Pill x={100} y={410} size={30} o={bars}>THE PUSH FROM THE DELTA II</Pill>
      <Pill x={100} y={590} size={30} color={B.aqua} o={bars}>THE ION ENGINE, OVER THE MISSION · COMPARABLE, FORECAST</Pill>
      <Card x={100} y={240} big="24,000 MPH+" small="JPL's forecast" size={72} color={B.paper} o={ease(f, jpl, 10) * bars} />
      <Card x={100} y={760} big="VESTA, THEN CERES" small="in the asteroid belt" size={56} o={ease(f, vesta, 10) * bars} />
      <Svg o={tanks}>
        {tank(280, 90, FUEL)}
        {tank(860, 39, B.aqua)}
      </Svg>
      <Pill x={390} y={860} align="center" size={30} o={tanks}>SATURN V · ~90%</Pill>
      <Pill x={970} y={860} align="center" size={30} color={B.aqua} o={tanks}>DAWN · ~39%</Pill>
      <Card x={740} y={200} align="center" big="DAWN'S EXHAUST: 7 TO 10× FASTER" size={56} o={ease(f, eq, 10) * tanks} />
      <Card x={750} y={330} align="center" big="MOSTLY, IT LIFTS FUEL" size={92} color={FUEL} o={ease(f, where + 30, 12) * (1 - ease(f, off, 8))} />
      <Card x={750} y={330} align="center" big="THRUST GETS YOU OFF THE GROUND" size={70} o={ease(f, off, 10)} />
      <Card x={750} y={520} align="center" big="FUEL AND EXHAUST SPEED: HOW FAR" size={70} color={B.paper} o={ease(f, off + 60, 10)} />
    </RungShell>
  );
};
