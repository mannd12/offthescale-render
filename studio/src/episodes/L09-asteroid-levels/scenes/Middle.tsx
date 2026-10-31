import React from "react";
import { useCurrentFrame } from "remotion";
import { B, F } from "../../../brand/tokens";
import { SceneTiming } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { Card, Clip, Pill, Plate, RungShell, STATUE, Svg, at, clamp01, lin, mix, rnd, rock, win } from "./shell";

/** a drawn pile: stones with gaps, inside an ellipse; `fling` throws every seventh stone outward */
const Pile: React.FC<{ cx: number; cy: number; rx: number; ry: number; n?: number; seed?: number; spin?: number; fling?: number }> = ({ cx, cy, rx, ry, n = 46, seed = 3, spin = 0, fling = 0 }) => (
  <g transform={`rotate(${spin} ${cx} ${cy})`}>
    {Array.from({ length: n }, (_, i) => {
      const a = rnd(seed + i) * Math.PI * 2;
      const r = Math.sqrt(rnd(seed + i + 90));
      const out = i % 7 === 0 ? 1 + fling : 1;
      return <path key={i} d={rock(cx + Math.cos(a) * r * rx * out, cy + Math.sin(a) * r * ry * out, 10 + rnd(i) * 22, 8 + rnd(i + 3) * 18, i, 8)} fill={i % 3 ? "#7E8C99" : "#5F6E7C"} />;
    })}
  </g>
);

/** Rung 6. #26-33, #48-50. The real DART replay, timed so its end lands on the last-image line; then what it meant. */
export const Hit: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const target = at(t, "The target is");
  const statues = at(t, "about one point eight");
  const threat = at(t, "It orbits");
  const hit = at(t, "DART hit");
  const last = at(t, "The last complete");
  const look = at(t, "Look at it");
  const first = at(t, "It was the first");
  const nums = at(t, "And now the two");
  const got = at(t, "About thirty-three");
  const deb = at(t, "The difference");
  const k30 = at(t, "weighed about thirty");
  const push = at(t, "and it gave");
  const pile = at(t, "Dimorphos is a loosely");
  const shape = at(t, "and the hit even");
  const melon = at(t, "NASA's description");
  const why = at(t, "Here's why");
  const clue = at(t, "The clue is spin");
  const leave = at(t, "because past that");
  const below = at(t, "Below that size");
  const rough = at(t, "That's a rough");
  const under = at(t, "Dimorphos is under");
  // the clip's last frames (39 s) arrive at the last-image line; it never runs past its end
  const start = Math.max(0, 39 * 30 - 20 - last);
  const inset = win(f, last - 4, first, 12);
  const bars = win(f, nums - 6, deb, 10);
  const diag = win(f, deb, why, 12);
  const size = win(f, why, clue, 12);
  const spin = ease(f, clue, 12);
  const w33 = lin(f, got, got + 45);
  const hitNow = lin(f, deb + 10, k30);
  const oblong = ease(f, shape, 40);
  const pushOff = 1 - ease(f, pile, 10);
  return (
    <RungShell t={t} index={5} m={170} reading="~170 m" sub={f >= statues && f < last ? "~1.8 Statues of Liberty" : "Dimorphos"} craft={f >= hit ? "HIT" : undefined} made={f >= pile ? "LOOSE PILE" : undefined} flips={[hit, pile]} chips={f < last ? [{ kind: "REAL FOOTAGE", source: "NASA/Johns Hopkins APL · DART, 10× speed" }] : f < first ? [{ kind: "REAL PHOTO", source: "NASA/JHU APL · 2 s before impact" }] : [{ kind: "ILLUSTRATION", source: "not to scale" }]}>
      <Clip id="l09-clip-dart" seconds={39} from={0} to={last + 10} start={start} bright={0.98} />
      <Pill x={110} y={190} size={38} color={B.gauge} o={win(f, target, hit, 12)}>THE TARGET: DIMORPHOS</Pill>
      <Pill x={110} y={260} size={28} o={win(f, threat, hit, 10)}>ORBITS DIDYMOS · NEITHER IS A THREAT TO EARTH</Pill>
      <Card x={110} y={190} big="~6 km/s" o={win(f, hit, last, 10)} />
      <Plate id="l09-dimorphos" ext="png" from={last - 4} to={first} box={{ x: 330, y: 150, w: 700, h: 700 }} s0={1} s1={1.25} o0={[42, 58]} bright={1} />
      <Svg o={ease(f, look, 10) * inset}>
        <circle cx={660} cy={520} r={150 + 6 * Math.sin(f / 7)} stroke={B.gauge} strokeWidth={6} fill="none" />
      </Svg>
      <Card x={1060} y={200} big="2 SECONDS OUT" small="a patch about 100 ft wide" size={56} o={inset} />
      <Card x={1060} y={420} big="BOULDERS" size={70} color={B.paper} o={ease(f, look + 30, 10) * inset} />
      <Card x={700} y={420} align="center" big="THE FIRST DELIBERATE CHANGE" small="to a celestial object's motion" size={70} o={win(f, first, nums, 12)} />
      {bars > 0 ? (
        <div style={{ position: "absolute", left: 130, top: 240, width: 1300, opacity: bars }}>
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 34, color: B.paper }}>THE PUSH ALONE: EXPECTED</div>
          <div style={{ height: 76, marginTop: 8, width: (1250 * 7) / 33, background: B.aqua, borderRadius: 8, fontFamily: F.headline, fontSize: 56, color: B.ink, paddingLeft: 12, whiteSpace: "nowrap", overflow: "hidden" }}>~7 MIN</div>
          <div style={{ opacity: f >= got ? 1 : 0, marginTop: 30, fontFamily: F.ui, fontWeight: 800, fontSize: 34, color: B.paper }}>MEASURED</div>
          <div style={{ opacity: f >= got ? 1 : 0, height: 76, marginTop: 8, width: mix((1250 * 7) / 33, 1250, w33), background: B.gauge, borderRadius: 8, fontFamily: F.headline, fontSize: 56, color: B.ink, paddingLeft: 12, whiteSpace: "nowrap", overflow: "hidden" }}>~33 MIN</div>
        </div>
      ) : null}
      <Svg o={diag}>
        {/* the spacecraft's arrow, then the debris it throws back */}
        <Pile cx={900} cy={470} rx={mix(190, 250, oblong)} ry={mix(190, 150, oblong)} seed={8} spin={f * 0.05} />
        {hitNow < 1 ? <circle cx={mix(120, 700, hitNow)} cy={470} r={14} fill={B.paper} /> : null}
        {f >= k30 ? Array.from({ length: 40 }, (_, i) => {
          const d = ((f - k30) * (3 + rnd(i) * 5)) % 420;
          const a = Math.PI + (rnd(i + 7) - 0.5) * 1.3;
          return <circle key={i} cx={700 + Math.cos(a) * d} cy={470 + Math.sin(a) * d} r={3 + rnd(i) * 7} fill="#A9B6C2" opacity={1 - d / 420} />;
        }) : null}
        {f >= push && pushOff > 0 ? (
          <g opacity={pushOff}>
            <line x1={760} y1={720} x2={830} y2={720} stroke={B.aqua} strokeWidth={14} />
            <line x1={760} y1={790} x2={760 + 480 * ease(f, push, 30)} y2={790} stroke={B.gauge} strokeWidth={14} />
          </g>
        ) : null}
      </Svg>
      <Card x={110} y={190} big="30,000 ×" small="the debris, against the spacecraft" size={70} o={ease(f, k30, 10) * diag * pushOff} />
      <Pill x={740} y={712} align="right" size={24} color={B.aqua} o={ease(f, push, 10) * diag * pushOff}>THE SPACECRAFT'S PUSH</Pill>
      <Pill x={740} y={772} align="right" size={24} color={B.gauge} o={ease(f, push, 10) * diag * pushOff}>THE DEBRIS' PUSH</Pill>
      <Card x={110} y={190} big="A RUBBLE PILE" small="loosely packed" size={70} color={B.paper} o={ease(f, pile, 10) * diag} />
      <Card x={110} y={420} big="“OBLONG WATERMELON”" small="NASA, on its new shape" size={46} o={ease(f, melon, 10) * diag} />
      <Svg o={size}>
        <line x1={120} y1={500} x2={1400} y2={500} stroke="rgba(255,255,255,0.4)" strokeWidth={6} />
        <rect x={360} y={470} width={880 * ease(f, why + 20, 30)} height={60} rx={10} fill={B.aqua} opacity={0.85} />
        {[0, 1, 2, 3, 4].map((i) => <Pile key={i} cx={470 + i * 165} cy={340} rx={30 + i * 14} ry={28 + i * 12} n={12 + i * 4} seed={i * 7 + 1} spin={f * 0.12} />)}
      </Svg>
      <Pill x={360} y={545} align="center" o={size}>~200 m</Pill>
      <Pill x={1240} y={545} align="center" o={size}>~10 km</Pill>
      <Card x={800} y={620} align="center" big="HELD BY ITS OWN GRAVITY" small="with significant empty space inside" size={56} o={size} />
      <Svg o={spin * (1 - ease(f, rough, 12))}>
        <Pile cx={430} cy={500} rx={150} ry={150} n={36} seed={5} spin={f * 1.6} fling={0.55 * clamp01(lin(f, leave, leave + 40))} />
        <g transform={`rotate(${f * 4.5} 1070 500)`}>
          <path d={rock(1070, 500, 110, 90, 9, 12)} fill="#8796A4" opacity={ease(f, below, 12)} />
        </g>
      </Svg>
      <Card x={430} y={170} align="center" big="ONCE IN ~2.2 HOURS" small="over ~200 m, none spins faster" size={52} o={spin * (1 - ease(f, rough, 12))} />
      <Pill x={430} y={760} align="center" color={B.gauge} o={ease(f, leave, 10) * (1 - ease(f, rough, 12))}>PAST THAT, LOOSE PIECES LEAVE</Pill>
      <Card x={1070} y={170} align="center" big="UNDER ~200 m" small="some spin faster · suggests solid" size={52} color={B.paper} o={ease(f, below, 10) * (1 - ease(f, rough, 12))} />
      <Svg o={ease(f, rough, 12)}>
        <line x1={700} y1={190} x2={700} y2={820} stroke={B.paper} strokeWidth={6} strokeDasharray="16 14" />
        <Pile cx={420 + 8 * Math.sin(f / 13)} cy={480} rx={140} ry={100} seed={8} spin={f * 0.1} />
      </Svg>
      <Pill x={700} y={830} align="center" size={26} o={ease(f, rough, 12)}>THE ~200 m LINE</Pill>
      <Card x={1060} y={340} align="center" big="A ROUGH RULE" small="not a law" size={70} color={B.paper} o={ease(f, rough, 12)} />
      <Pill x={420} y={640} align="center" color={B.gauge} o={ease(f, under, 10)}>DIMORPHOS ~170 m · STILL A PILE</Pill>
    </RungShell>
  );
};

/** Rung 7. #36-38, #48. The radar frames did not clear (blank licence, third-party credit): all drawn, says so throughout. */
export const ClosePass: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const long = at(t, "at least four hundred");
  const pea = at(t, "maybe shaped");
  const stat = at(t, "That's about three");
  const date = at(t, "On the thirteenth");
  const closer = at(t, "closer than geosynchronous");
  const risk = at(t, "NASA says there is no risk");
  const see = at(t, "If you're in parts");
  const bino = at(t, "or even binoculars");
  const rare = at(t, "Something this size");
  const shake = at(t, "And it's Apophis");
  const tides = at(t, "Earth's tides");
  const pileQ = at(t, "By that rule");
  const touch = at(t, "So what happens");
  const a = 1 - ease(f, date - 10, 12);
  const b = win(f, date - 4, shake, 12);
  const c = ease(f, shake, 12);
  const pk = lin(f, date, see + 60);
  const px = mix(1500, -60, pk);
  const py = 420 + 4 * pk * (1 - pk) * -30;
  const jig = f >= tides ? Math.sin(f * 1.1) * 3 : 0;
  const peanut = (cx: number, cy: number, s: number, seed = 2) => (
    <g>
      <path d={rock(cx - 70 * s, cy, 90 * s, 74 * s, seed, 16)} fill="#7E8C99" />
      <path d={rock(cx + 70 * s, cy + 4 * s, 80 * s, 66 * s, seed + 30, 16)} fill="#71808E" />
    </g>
  );
  return (
    <RungShell t={t} index={6} m={340} reading="340 m" sub={f >= stat && f < date ? "about 3.7 Statues" : "Apophis, on average"} craft="not yet" made={f >= pileQ ? "a pile, probably" : undefined} flips={[pileQ]} chips={[{ kind: "ILLUSTRATION", source: "not to scale · drawn, no picture" }]}>
      <Svg o={a}>
        <g transform={`rotate(${f * 0.25} 800 380)`}>{peanut(800, 380, 1.8)}</g>
        <defs>
          <clipPath id="l09-partial"><rect x={-60} y={-210} width={120} height={210} /></clipPath>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${380 + i * 170} 840) scale(0.72)`} opacity={ease(f, stat + i * 6, 8)} clipPath={i === 3 ? "url(#l09-partial)" : undefined}>
            <path d={STATUE} fill="#6FA08E" />
          </g>
        ))}
      </Svg>
      <Card x={70} y={190} big="~340 m" small="on average" size={70} o={a} />
      <Card x={70} y={380} big="450 m+" small="the long way" size={60} color={B.paper} o={ease(f, long, 10) * a} />
      <Pill x={1160} y={300} color={B.gauge} o={ease(f, pea, 10) * a}>MAYBE A PEANUT</Pill>
      <Svg o={b}>
        <circle cx={380} cy={540} r={150} fill="#1E4A63" />
        <path d="M280 480 Q 340 430 400 480 T 500 540 Q 440 610 370 580 T 280 480" fill="#3A7A68" />
        <circle cx={380} cy={540} r={300} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={4} strokeDasharray="10 12" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a2 = (i / 8) * 6.283 + f * 0.003;
          return <rect key={i} x={380 + Math.cos(a2) * 300 - 8} y={540 + Math.sin(a2) * 300 - 8} width={16} height={16} fill={B.aqua} />;
        })}
        <path d="M1500 420 Q 700 360 -60 420" stroke={B.gauge} strokeWidth={3} strokeDasharray="8 12" fill="none" />
        <g transform={`rotate(${f * 0.5} ${px} ${py})`}>{peanut(px, py, 0.5)}</g>
      </Svg>
      <Card x={800} y={170} big="13 APRIL 2029" small="~32,000 km up" size={70} o={ease(f, date, 12) * b} />
      <Pill x={380} y={860} align="center" size={26} color={B.aqua} o={ease(f, closer, 10) * b}>INSIDE THE GEOSYNCHRONOUS SATELLITES</Pill>
      <Card x={800} y={470} big="NO RISK" small="for at least 100 years · NASA" size={70} color={B.paper} o={ease(f, risk, 10) * b * (1 - ease(f, see, 10))} />
      <Pill x={800} y={480} size={36} o={ease(f, see, 10) * b}>PARTS OF EUROPE, AFRICA, ASIA</Pill>
      <Pill x={800} y={550} size={36} color={B.gauge} o={ease(f, bino, 10) * b}>NO TELESCOPE. NO BINOCULARS.</Pill>
      <Pill x={800} y={620} size={26} o={ease(f, rare, 10) * b}>THIS SIZE, THIS CLOSE: EVERY FEW THOUSAND YEARS</Pill>
      <Svg o={c}>
        <g transform={`translate(${jig} ${-jig}) rotate(${f * (f >= tides ? 0.9 : 0.25)} 720 500)`}>{peanut(720, 500, 2.4)}</g>
        {f >= tides ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
          const d = ((f - tides) * (1.2 + rnd(i))) % 90;
          return <circle key={i} cx={460 + i * 58} cy={300 + rnd(i) * 80 + d * 2} r={5 + rnd(i + 2) * 5} fill="#A9B6C2" opacity={1 - d / 90} />;
        }) : null}
      </Svg>
      <Card x={70} y={190} big="TIDES" small="may trigger quakes, landslides" size={60} color={B.paper} o={ease(f, tides, 10) * c * (1 - ease(f, touch, 10))} />
      <Card x={720} y={790} align="center" big="SO WHAT IF YOU TOUCH ONE?" size={60} o={ease(f, touch, 10)} />
    </RungShell>
  );
};

/** Rung 8. #39-46. The real mosaic, a drawn beach, the real SamCam descent (8.4 s, slowed), a drawn ball pit, the real sample. */
export const Touched: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const tall = at(t, "slightly wider");
  const oct = at(t, "In October");
  const beach = at(t, "The scientists expected");
  const real = at(t, "This is the real");
  const head = at(t, "The head on");
  const gas = at(t, "About a second");
  const six = at(t, "The whole touch");
  const barely = at(t, "And the surface");
  const press = at(t, "It resisted");
  const balls = at(t, "NASA compares");
  const sunk = at(t, "The spacecraft would");
  const crater = at(t, "and it left");
  const quote = at(t, "The mission's lead");
  const away = at(t, "It also came");
  const grams = at(t, "A hundred and twenty-one");
  const amino = at(t, "In it were");
  const life = at(t, "Those are ingredients");
  const salt = at(t, "And there were salts");
  const pit = win(f, barely - 6, away, 12);
  const clipOn = f >= real - 6 && f < barely + 8;
  const sinkY = mix(180, 560, ease(f, barely, 90)) - 300 * ease(f, sunk + 30, 40);
  return (
    <RungShell t={t} index={7} m={500} reading="~500 m" sub={f >= grams ? "Bennu · 121.6 g brought home" : "Bennu"} craft={f >= head ? "TOUCHED" : undefined} made={f >= balls ? "LOOSE PILE" : undefined} flips={[head, balls]} chips={clipOn ? [{ kind: "REAL FOOTAGE", source: "NASA Goddard/SVS · SamCam, sped up" }] : f < beach ? [{ kind: "REAL PHOTO", source: "NASA/Goddard/University of Arizona" }, { kind: "ILLUSTRATION", source: "the tower" }] : f < real ? [{ kind: "ILLUSTRATION", source: "what they expected" }] : f >= away ? [{ kind: "REAL PHOTO", source: "NASA Johnson · the sample" }] : [{ kind: "ILLUSTRATION", source: "what it was like" }]}>
      <Plate id="l09-bennu" from={0} to={beach + 6} s0={1.1} s1={1.4} o0={[52, 50]} bright={1} />
      <Svg o={win(f, tall, beach + 6, 12)}>
        <rect x={240} y={260} width={58} height={560} fill="#5B7186" />
        <rect x={258} y={190} width={22} height={70} fill="#5B7186" />
      </Svg>
      <Pill x={270} y={830} align="center" size={24} o={win(f, tall, beach + 6, 12)}>EMPIRE STATE BUILDING, FOR SIZE</Pill>
      <Card x={1060} y={190} big="200 MILLION MILES+" small="from Earth · October 2020" size={52} o={win(f, oct, beach + 6, 12)} />
      <Svg o={win(f, beach - 4, real + 4, 10)}>
        <rect x={0} y={0} width={1920} height={1080} fill="#0B1B2B" />
        <path d={`M0 ${620 + 6 * Math.sin(f / 15)} Q 480 560 960 ${630 - 6 * Math.sin(f / 15)} T 1920 610 V960 H0 Z`} fill="#D9C08C" />
      </Svg>
      <Card x={760} y={260} align="center" big="EXPECTED: A SANDY BEACH" size={84} o={win(f, beach, real + 4, 10)} />
      <Clip id="l09-clip-bennu" seconds={8.4} from={real - 6} to={barely + 10} rate={0.45} />
      <Pill x={70} y={190} size={32} color={B.gauge} o={win(f, head, gas, 10)}>ONLY THE HEAD MADE CONTACT</Pill>
      <Pill x={70} y={190} size={32} color={B.gauge} o={win(f, gas, six, 10)}>~1 SECOND AFTER CONTACT: GAS</Pill>
      <Card x={70} y={190} big="~6 SECONDS" small="the whole touch" size={64} o={win(f, six, barely + 8, 10)} />
      <Svg o={pit}>
        {Array.from({ length: 130 }, (_, i) => {
          const x0 = 120 + (i % 22) * 62 + (Math.floor(i / 22) % 2) * 30;
          const y0 = 560 + Math.floor(i / 22) * 58;
          const dx = x0 - 760;
          const shove = Math.max(0, 1 - Math.abs(dx) / 240) * clamp01((sinkY - 400) / 120);
          return <circle key={i} cx={x0 + Math.sign(dx || 1) * shove * 110} cy={y0 - shove * 26 + 3 * Math.sin(f / 10 + i)} r={28} fill={["#E0654F", "#3FA7D6", "#F2C14E", "#7FB069"][i % 4]} />;
        })}
        <line x1={760} y1={120} x2={760} y2={sinkY} stroke="#C9D3DC" strokeWidth={16} />
        <rect x={700} y={sinkY} width={120} height={46} rx={8} fill="#C9D3DC" />
      </Svg>
      <Card x={70} y={190} big="A FRENCH PRESS PLUNGER" small="that's how much it resisted" size={46} color={B.paper} o={win(f, press, sunk, 10)} />
      <Card x={70} y={370} big="A PIT OF PLASTIC BALLS" small="NASA's comparison" size={46} o={win(f, balls, sunk, 10)} />
      <Card x={70} y={190} big="WOULD HAVE SUNK IN" small="without its thrusters" size={56} color={B.tease} ink={B.paper} o={win(f, sunk, quote, 10)} />
      <Card x={1040} y={190} big="8 m CRATER" size={70} o={win(f, crater, quote, 10)} />
      <Card x={760} y={220} align="center" big="“COMPLETELY WRONG”" small="Dante Lauretta, on expectations of the surface" size={84} color={B.paper} o={win(f, quote, away, 10)} />
      <Plate id="l09-sample" from={away - 4} to={t.frames + 20} s0={1.05} s1={1.55} o0={[62, 62]} bright={0.95} />
      <Card x={70} y={190} big="121.6 GRAMS" size={84} o={ease(f, grams, 10)} />
      <Card x={70} y={360} big="14 OF 20 · ALL 5" small="amino acids · nucleobases" size={56} color={B.paper} o={ease(f, amino, 10)} />
      <Card x={70} y={540} big="INGREDIENTS, NOT LIFE" size={56} color={B.aqua} o={ease(f, life, 10)} />
      <Pill x={70} y={700} color={B.gauge} size={36} o={ease(f, salt, 10)}>AND SALTS. HOLD THAT THOUGHT.</Pill>
    </RungShell>
  );
};
