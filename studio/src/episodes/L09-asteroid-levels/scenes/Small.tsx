import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { B, F } from "../../../brand/tokens";
import { SceneTiming } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { Readout, Ruler } from "../gauge";
import { LEVELS, rulerX } from "../ladder";
import { Card, Chips, Clip, Pill, Plate, RungShell, STATUE, Svg, at, lin, mix, rnd, rock, win } from "./shell";

/** Sources: script.md rows #26-28, #5. Real DART frames, then the expected-against-measured bars, then the ruler arrives. */
export const ColdOpen: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const seven = at(t, "about seven minutes");
  const got = at(t, "It shortened it");
  const ask = at(t, "So what is that thing");
  const climb = at(t, "The answer changes");
  const ten = at(t, "about ten billion");
  const mark = at(t, "each mark on this bar");
  const watch = at(t, "Watch the two lines");
  const craft = at(t, "One says whether");
  const made = at(t, "The other says");
  const empty = at(t, "For the first five");
  const dim = ease(f, seven - 10, 14);
  const bars = win(f, seven, climb, 10);
  const w7 = ease(f, seven, 18);
  const w33 = lin(f, got, got + 70);
  const sweep = lin(f, climb + 20, ten + 60);
  const chrome = ease(f, climb, 14);
  const back = ease(f, watch, 30);
  const mNow = Math.pow(10, mix(mix(-4, Math.log10(9.52e5), sweep), -4, back));
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <Clip id="l09-clip-dart" seconds={39} from={0} to={climb + 8} start={600} bright={0.95 - 0.6 * dim} />
      {f >= climb ? <AbsoluteFill style={{ opacity: chrome, background: "radial-gradient(ellipse at 42% 42%, #16263A 0%, #0B1B2B 55%, #050E18 100%)" }} /> : null}
      {bars > 0 ? (
        <div style={{ position: "absolute", left: 130, top: 300, width: 1660, opacity: bars }}>
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 36, color: B.paper }}>THE PUSH ALONE: EXPECTED, MINUTES OFF ITS ORBIT</div>
          <div style={{ height: 76, marginTop: 8, width: (1500 * 7 * w7) / 33, background: B.aqua, borderRadius: 8, fontFamily: F.headline, fontSize: 56, color: B.ink, paddingLeft: 12, overflow: "hidden", whiteSpace: "nowrap" }}>~7</div>
          <div style={{ opacity: f >= got ? 1 : 0, marginTop: 34, fontFamily: F.ui, fontWeight: 800, fontSize: 36, color: B.paper }}>MEASURED</div>
          <div style={{ opacity: f >= got ? 1 : 0, height: 76, marginTop: 8, width: 1500 * Math.max(0.05, w33), background: B.gauge, borderRadius: 8, fontFamily: F.headline, fontSize: 56, color: B.ink, paddingLeft: 12, overflow: "hidden", whiteSpace: "nowrap" }}>~33</div>
        </div>
      ) : null}
      <Card x={960} y={760} align="center" big="SO WHAT IS IT MADE OF?" size={96} o={win(f, ask, climb, 8)} />
      {f >= climb ? (
        <>
          <Svg o={chrome * (1 - back)}>
            {LEVELS.map((l, i) => {
              const on = rulerX(l.m) <= rulerX(mNow) + 2;
              const r = 6 + i * i * 1.9;
              return <circle key={l.id} cx={rulerX(l.m)} cy={700 - r} r={r} fill={on ? (i === 10 ? B.tease : B.gauge) : "rgba(255,255,255,0.12)"} />;
            })}
          </Svg>
          <Pill x={70} y={726} size={24} color={B.mute} o={chrome * (1 - back)}>CIRCLES NOT TO SCALE</Pill>
          <Card x={760} y={190} align="center" big="ABOUT 10 BILLION × WIDER" small="a grain to the top of the belt" o={win(f, ten, watch, 12)} />
          <Ruler m={mNow} passed={0} opacity={chrome} pulse={win(f, mark, watch, 8)} />
          <Readout reading={f >= watch ? "THE TWO LINES" : "0.1 mm → 952 km"} craft={f >= craft ? "has one got there?" : undefined} made={f >= made ? "what is it?" : undefined} opacity={chrome} flash={Math.max(win(f, craft, craft + 40), win(f, made, made + 40))} />
          <Card x={760} y={380} align="center" big="RUNGS 1 TO 5: EMPTY" size={80} color={B.paper} o={ease(f, empty, 12)} />
        </>
      ) : null}
      <Chips chips={f < seven ? [{ kind: "REAL FOOTAGE", source: "NASA/Johns Hopkins APL · DART, sped up" }] : f < climb ? [{ kind: "REAL FOOTAGE", source: "DART, dimmed" }, { kind: "ILLUSTRATION", source: "the bars" }] : [{ kind: "ILLUSTRATION", source: "the ruler" }]} />
    </AbsoluteFill>
  );
};

/** Rung 1. #6, #7, #1. Drawn roofs under falling grains; a real micrograph that says it is not from the study; a grain changing its name. */
export const Dust: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const n500 = at(t, "five hundred");
  const big = at(t, "each more than");
  const est = at(t, "By one NASA");
  const differ = at(t, "Other estimates");
  const words = at(t, "And already");
  const oid = at(t, "is a meteoroid");
  const or = at(t, "The burn-up");
  const ite = at(t, "If it survives");
  const roofs = 1 - ease(f, words - 10, 14);
  const micro = win(f, n500 + 10, est + 30, 14);
  const fall = (i: number) => ((f * (1.4 + rnd(i) * 1.6) + rnd(i + 40) * 700) % 700) + 130;
  const tons = 48.5 * lin(f, est + 15, est + 80);
  // line 2: one grain drops through three bands
  const gy = f < or ? mix(240, 330, lin(f, oid - 40, or)) : f < ite ? mix(330, 570, lin(f, or, ite)) : mix(570, 760, lin(f, ite, ite + 40));
  const burn = win(f, or, ite + 10, 10);
  return (
    <RungShell t={t} index={0} m={1e-4} reading="OVER 0.1 mm" sub="reported on city rooftops" chips={f >= n500 + 10 && f < est + 30 ? [{ kind: "ILLUSTRATION", source: "the roofs" }, { kind: "REAL PHOTO", source: "Joris.vandorpe, CC0" }] : [{ kind: "ILLUSTRATION" }]}>
      <Svg o={roofs}>
        {Array.from({ length: 34 }, (_, i) => <circle key={i} cx={40 + rnd(i + 9) * 1400} cy={fall(i)} r={2 + rnd(i) * 2.5} fill={B.gauge} />)}
        <path d="M0 880 V720 L120 640 L240 720 V680 L380 590 L520 680 V730 L640 650 L780 730 V690 L900 610 L1040 690 V740 L1180 640 L1320 740 V880 Z" fill="#2A3D52" />
      </Svg>
      <Card x={110} y={200} big="500" small="large micrometeorites, reported" o={ease(f, n500, 12) * roofs * (1 - ease(f, est, 12))} />
      <Plate id="l09-micro" from={n500 + 10} to={est + 30} box={{ x: 760, y: 150, w: 700, h: 525 }} s0={1.02} s1={1.3} o0={[50, 50]} o1={[62, 70]} bright={1} />
      <Pill x={1110} y={690} align="center" size={24} o={micro}>ANOTHER ROOF, NOT THE STUDY · PER ITS PHOTOGRAPHER</Pill>
      <Card x={110} y={420} big=">0.1 mm" small="each grain" size={70} o={ease(f, big, 12) * (1 - ease(f, est, 12))} />
      <Card x={110} y={200} big={`~${tons.toFixed(1)} TONS`} small="a day · one NASA estimate" o={ease(f, est, 12) * roofs} />
      <Pill x={110} y={400} color={B.gauge} o={ease(f, differ, 10) * roofs}>OTHER ESTIMATES DIFFER WIDELY</Pill>
      <Svg o={ease(f, words, 14)}>
        <rect x={120} y={170} width={1300} height={230} fill="#0A1626" />
        <rect x={120} y={400} width={1300} height={240} fill="#14304C" />
        <rect x={120} y={640} width={1300} height={190} fill="#2A3D52" />
        {burn > 0 ? <line x1={1060} y1={gy - 180} x2={1060} y2={gy} stroke="#FFE9A8" strokeWidth={10} strokeLinecap="round" opacity={burn} /> : null}
        <path d={rock(1060, gy, 14, 12, 3)} fill={burn > 0.5 ? "#FFE9A8" : B.gauge} />
      </Svg>
      <Pill x={170} y={260} size={46} color={f >= oid ? B.gauge : B.mute} o={ease(f, oid - 10, 10)}>METEOROID · in space</Pill>
      <Pill x={170} y={490} size={46} color={f >= or ? B.gauge : B.mute} o={ease(f, or, 10)}>METEOR · the burn-up</Pill>
      <Pill x={170} y={700} size={46} color={f >= ite ? B.gauge : B.mute} o={ease(f, ite, 10)}>METEORITE · it lands</Pill>
    </RungShell>
  );
};

/** Rung 2. #9, #10. The ISS photo looks down on a meteor: ring on the streak (read off the picture); a grain and a pea; a comet, drawn. */
export const Grain: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const streak = at(t, "That faint streak");
  const most = at(t, "Most of the debris");
  const per = at(t, "The Perseids are");
  const all = at(t, "That's all it takes");
  const corr = at(t, "One correction");
  const comet = at(t, "The Perseids come");
  const fam = at(t, "So this rung");
  const next = at(t, "Now, on to");
  const ring = win(f, streak, most, 10);
  const size = win(f, most, corr, 12);
  const cx = mix(-200, 1300, lin(f, comet - 10, fam + 40));
  return (
    <RungShell t={t} index={1} m={2e-3} band={[5e-4, 8e-3]} reading="SAND TO PEA" sub="most shower debris" chips={f < most ? [{ kind: "REAL PHOTO", source: "ISS Expedition 28, NASA · a meteor" }] : [{ kind: "REAL PHOTO", source: "ISS Expedition 28, NASA" }, { kind: "ILLUSTRATION", source: "not to scale" }]}>
      <Plate id="l09-meteor" from={0} to={t.frames + 20} s0={1.05} s1={1.5} o0={[55, 50]} bright={f < most ? 1 : 0.42} />
      <Svg o={ring}>
        <circle cx={1056} cy={540} r={70 + 8 * Math.sin(f / 7)} stroke={B.gauge} strokeWidth={6} fill="none" />
      </Svg>
      <Pill x={1056} y={420} align="center" o={ring} color={B.gauge}>THE STREAK</Pill>
      <Svg o={size}>
        <circle cx={380} cy={520} r={10 + 2 * Math.sin(f / 9)} fill="#E3C98C" />
        <circle cx={780} cy={520} r={70 + 3 * Math.sin(f / 11)} fill="#7FB069" />
        {all <= f ? <line x1={380} y1={510} x2={380 + 900 * lin(f, all, all + 50)} y2={510 - 300 * lin(f, all, all + 50)} stroke="#FFE9A8" strokeWidth={6} strokeLinecap="round" /> : null}
      </Svg>
      <Pill x={380} y={610} align="center" o={size}>A GRAIN OF SAND</Pill>
      <Pill x={780} y={610} align="center" o={size}>A PEA</Pill>
      <Pill x={380} y={680} align="center" size={26} color={B.gauge} o={ease(f, per, 10) * size}>PERSEIDS, TYPICALLY</Pill>
      <Svg o={win(f, comet - 10, t.frames + 20)}>
        <circle cx={cx} cy={360} r={26} fill={B.paper} />
        <path d={`M${cx} 334 L${cx - 460} 300 L${cx - 460} 420 L${cx} 386 Z`} fill="rgba(180,220,255,0.35)" />
      </Svg>
      <Card x={110} y={480} big="COMET SWIFT-TUTTLE" small="not an asteroid" size={70} color={B.aqua} o={ease(f, comet, 12)} />
      <Card x={110} y={700} big="HERE FOR ITS SIZE" size={60} color={B.paper} o={win(f, fam, next + 10, 12)} />
      <Card x={110} y={700} big="NEXT: ASTEROIDS. NEARLY." size={60} o={ease(f, next, 10)} />
    </RungShell>
  );
};

/** Rung 3. #12-15. No real picture clears: a drawn track, a drawn metre stick, a word that wobbles. Says so from its first frame. */
export const HalfMetre: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const eight = at(t, "only eight");
  const name = at(t, "It got the name");
  const anal = at(t, "Then came");
  const kg = at(t, "About a hundred and forty");
  const half = at(t, "probably under half");
  const quote = at(t, "So small that");
  const rib = at(t, "Pieces were");
  const wob = at(t, "So here");
  const track = win(f, -20, anal, 12);
  const k = lin(f, 15, eight);
  const hrs = 3 * (1 - k);
  const stick = ease(f, anal, 14);
  // the drawn rock starts a full metre across and shrinks to its measured size: under half the stick
  const rx = mix(500, 235, ease(f, half, 30));
  const shard = ease(f, rib, 16) * (1 - ease(f, wob, 12));
  return (
    <RungShell t={t} index={2} m={f >= half ? 0.5 : 1} reading={f >= half ? "UNDER 0.5 m" : "2024 BX1"} sub={f >= kg ? "about 140 kg" : undefined} chips={[{ kind: "ILLUSTRATION", source: "no real picture clears" }]}>
      <Svg o={track}>
        <path d="M0 880 Q 700 650 1500 880 Z" fill="#1E4A63" />
        <path d="M200 190 Q 760 240 1040 740" stroke="rgba(255,255,255,0.3)" strokeWidth={5} strokeDasharray="14 14" fill="none" />
        <path d={rock(mix(200, 1040, k), mix(190, 740, k * k), 22, 18, 7)} fill={B.gauge} />
        <circle cx={1040} cy={745} r={9} fill={B.tease} />
        {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={150 + i * 52} cy={520} r={18} fill={f >= eight + i * 3 ? B.aqua : "rgba(255,255,255,0.12)"} />)}
      </Svg>
      <Card x={110} y={200} big={`${hrs.toFixed(1)} HOURS OUT`} small="spotted about 3 hours before it came in" size={70} o={track} />
      <Pill x={1040} y={660} align="center" o={track} size={26}>~50 km WEST OF BERLIN</Pill>
      <Pill x={130} y={560} size={28} o={ease(f, eight, 12) * track}>DETECTED BEFORE IMPACT, BY JANUARY 2024</Pill>
      <Card x={110} y={640} big="ASTEROID 2024 BX1" size={70} color={B.paper} o={ease(f, name, 12) * track} />
      <Svg o={stick}>
        <path d={rock(760, 420, rx, rx * 0.55, 5, 20)} fill="#6E7F8F" />
        {f >= rib ? [0, 1, 2, 3, 4].map((i) => <path key={i} d={rock(420 + i * 170 + shard * 12 * Math.sin(i), 690, 16 + i * 4, 12 + i * 2, 20 + i)} fill="#8DA0B0" opacity={shard} />) : null}
        <rect x={260} y={740} width={1000} height={46} fill="#E8D18A" />
        {Array.from({ length: 11 }, (_, i) => <line key={i} x1={260 + i * 100} y1={740} x2={260 + i * 100} y2={i % 5 === 0 ? 786 : 766} stroke={B.ink} strokeWidth={4} />)}
      </Svg>
      <Pill x={760} y={795} align="center" size={24} o={stick}>A METRE STICK · THE ROCK IS DRAWN</Pill>
      <Card x={110} y={190} big="~140 kg" size={70} o={ease(f, kg, 10) * (1 - ease(f, quote, 10))} />
      <Card x={760} y={180} align="center" big="“SHOULD RATHER BE CALLED A METEOROID”" small="Spurný et al." size={58} color={B.paper} o={win(f, quote, wob, 12)} />
      <Pill x={420} y={610} size={30} color={B.gauge} o={shard}>RIBBECK · pieces recovered on the ground</Pill>
      <div style={{ position: "absolute", left: 760, top: 200, opacity: ease(f, wob, 10), transform: `translateX(-50%) rotate(${8 * Math.sin(f / 5)}deg)`, fontFamily: F.headline, fontSize: 130, color: B.gauge, WebkitTextStroke: `10px ${B.ink}`, paintOrder: "stroke fill", whiteSpace: "nowrap" }}>ASTEROID?</div>
    </RungShell>
  );
};

const WHALE = "M0 60 C60 10 180 -10 340 8 C500 24 640 30 800 22 C880 18 940 10 1000 -30 C1010 0 1020 16 1060 28 C1020 40 1000 60 960 66 C820 92 620 120 420 118 C300 116 250 150 190 186 C180 150 190 126 170 112 C90 106 30 96 0 60 Z";

/** Rung 4. #17-20. No real picture clears (dashcams private, Commons BY-SA): a drawn whale for size only, then a drawn globe closing its dust belt. */
export const Whale: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const hump = at(t, "A humpback");
  const tons = at(t, "It weighed");
  const fast = at(t, "At its brightest");
  const part = at(t, "And here's the part");
  const three = at(t, "at least three months");
  const sum = at(t, "A thing the length");
  const a = 1 - ease(f, fast - 10, 12);
  const b = win(f, fast - 6, part, 10);
  const c = ease(f, part, 14);
  const belt = lin(f, part + 30, three + 90);
  const R = 250;
  const C = 2 * Math.PI * (R + 34);
  const px = 110 + (f - fast) * 8;
  return (
    <RungShell t={t} index={3} m={18} reading="~18 m" sub="across, over Chelyabinsk" chips={[{ kind: "ILLUSTRATION", source: "no real picture clears · size only" }]}>
      <Svg o={a}>
        <path d={rock(700, 340, 500, 120, 11, 22)} fill="#6E7F8F" />
        <line x1={200} y1={490} x2={1200} y2={490} stroke={B.gauge} strokeWidth={5} />
        <line x1={200} y1={472} x2={200} y2={508} stroke={B.gauge} strokeWidth={5} />
        <line x1={1200} y1={472} x2={1200} y2={508} stroke={B.gauge} strokeWidth={5} />
        <g transform={`translate(${200 + 8 * Math.sin(f / 25)} ${560 + 6 * Math.sin(f / 18)}) scale(0.94)`} opacity={ease(f, hump, 12)}>
          <path d={WHALE} fill="#3F6D8C" />
        </g>
      </Svg>
      <Pill x={420} y={190} align="center" o={a}>THE OBJECT, DRAWN</Pill>
      <Pill x={700} y={468} align="center" color={B.gauge} o={a}>~18 m</Pill>
      <Pill x={700} y={780} align="center" size={26} o={ease(f, hump, 12) * a}>HUMPBACK · FOR SIZE ONLY</Pill>
      <Card x={1040} y={170} big="~11,000 TONS" small="very approximate" size={60} o={ease(f, tons, 12) * a} />
      <Svg o={b}>
        <line x1={0} y1={690} x2={1500} y2={690} stroke="rgba(255,255,255,0.3)" strokeWidth={4} strokeDasharray="10 12" />
        <line x1={Math.max(0, px - 420)} y1={690} x2={px} y2={690} stroke="#FFE9A8" strokeWidth={14} strokeLinecap="round" />
        <circle cx={px} cy={690} r={18} fill="#FFF3C8" />
      </Svg>
      <Card x={140} y={240} big="18.6 km/s" small="at peak brightness" o={b} />
      <Card x={660} y={240} big="23.3 km UP" size={84} color={B.paper} o={b} />
      <Svg o={c}>
        <g transform={`rotate(${f * 0.1} 720 500)`}>
          <circle cx={720} cy={500} r={R} fill="#1E4A63" />
          <path d="M560 400 Q 640 340 720 400 T 860 470 Q 800 560 700 520 T 560 400" fill="#3A7A68" />
          <path d="M620 620 Q 700 580 800 640 Q 740 700 660 680 Z" fill="#3A7A68" />
        </g>
        <circle cx={720} cy={500} r={R + 34} fill="none" stroke={B.gauge} strokeWidth={14} strokeDasharray={`${C * belt} ${C}`} transform="rotate(-90 720 500)" opacity={0.9} />
      </Svg>
      <Pill x={70} y={190} size={28} o={c} color={B.gauge}>ITS DUST · from ~40 km up</Pill>
      <Pill x={70} y={250} size={24} o={c}>BELT HEIGHT NOT TO SCALE</Pill>
      <Card x={1060} y={210} big="3 MONTHS+" small="still detectable" size={70} o={ease(f, three, 12)} />
      <Card x={1060} y={450} big="A WHALE'S LENGTH" small="all the way round" size={54} color={B.paper} o={ease(f, sum, 12)} />
    </RungShell>
  );
};

/** Rung 5. #21-25. Forest only. Kulik's photo, then the size given back as a band beside a drawn Statue of Liberty. */
export const Range: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const y08 = at(t, "In 1908");
  const trees = at(t, "It flattened");
  const most = at(t, "Most scientists");
  const exp = at(t, "And the first expedition");
  const size = at(t, "So nobody");
  const forty = at(t, "Some scientists");
  const work = at(t, "A NASA workshop");
  const bar = at(t, "That's why");
  const lib = at(t, "and the Statue");
  const came = at(t, "Everything so far");
  const went = at(t, "On the next rung");
  const dim = ease(f, size - 8, 14);
  const u = (m: number) => 800 - m * 6; // drawn bars: 6 px a metre, on one scale
  const T = lin(f, exp, exp + 70);
  return (
    <RungShell t={t} index={4} m={60} band={f >= work ? [50, 80] : f >= forty ? [38, 42] : [40, 80]} reading={f >= work ? "50-80 m" : f >= forty ? "~40 m" : "A RANGE"} sub={f >= work ? "if stony · NASA workshop" : f >= forty ? "some scientists" : "not one number"} chips={f < size ? [{ kind: "REAL PHOTO", source: "Kulik expedition, 1929 · public domain" }] : [{ kind: "REAL PHOTO", source: "Kulik expedition, 1929" }, { kind: "ILLUSTRATION", source: "the bars and the statue" }]}>
      <Plate id="l09-tunguska" from={0} to={t.frames + 20} s0={1.12} s1={1.45} o0={[85, 40]} o1={[55, 55]} bright={0.9 - 0.68 * dim} />
      <Card x={110} y={190} big="1908" small="about 6 miles up · most likely vaporised" size={84} o={win(f, y08, exp, 12)} />
      <Card x={110} y={400} big="830 SQUARE MILES" small="millions of trees" size={64} color={B.paper} o={win(f, trees, exp, 12)} />
      <Pill x={110} y={600} o={win(f, most, exp, 10)}>MOST SCIENTISTS THINK: AN ASTEROID</Pill>
      {win(f, exp, size, 10) > 0 ? (
        <>
          <Svg o={win(f, exp, size, 10)}>
            <line x1={200} y1={480} x2={200 + 1000 * T} y2={480} stroke={B.gauge} strokeWidth={14} strokeLinecap="round" />
            <circle cx={200} cy={480} r={16} fill={B.paper} />
            {T >= 1 ? <circle cx={1200} cy={480} r={16} fill={B.paper} /> : null}
          </Svg>
          <Pill x={200} y={510} align="center" size={40} o={win(f, exp, size, 10)}>1908</Pill>
          <Pill x={1200} y={510} align="center" size={40} o={win(f, exp, size, 10) * (T >= 1 ? 1 : 0)}>1927 · FIRST EXPEDITION</Pill>
          <Card x={700} y={300} align="center" big={`${Math.round(19 * T)} YEARS`} o={win(f, exp, size, 10)} />
        </>
      ) : null}
      <Svg o={win(f, size, came, 12)}>
        <line x1={160} y1={800} x2={1300} y2={800} stroke={B.paper} strokeWidth={4} />
        <rect x={340} y={u(mix(0, 40, ease(f, forty, 18)))} width={120} height={800 - u(mix(0, 40, ease(f, forty, 18)))} fill={B.aqua} />
        <rect x={620} y={u(80)} width={120} height={(80 - 50) * 6 * ease(f, work, 18)} fill={B.gauge} />
        <rect x={620} y={u(50)} width={120} height={50 * 6} fill={B.gauge} opacity={0.35 * ease(f, work, 18)} />
        <g transform={`translate(1000 800) scale(${(93 * 6) / 300})`} opacity={ease(f, lib, 14)}>
          <path d={STATUE} fill="#6FA08E" />
        </g>
      </Svg>
      <Pill x={400} y={810} align="center" size={26} o={win(f, forty, came, 10)}>~40 m</Pill>
      <Pill x={680} y={810} align="center" size={26} o={win(f, work, came, 10)}>50-80 m, IF STONY</Pill>
      <Pill x={1000} y={810} align="center" size={26} o={win(f, lib, came, 10)}>STATUE OF LIBERTY · 93 m</Pill>
      <Pill x={500} y={190} align="center" color={B.gauge} o={win(f, bar, lib + 30, 10)}>A BAND, NOT A POINT</Pill>
      <Svg o={ease(f, came, 12)}>
        {Array.from({ length: 12 }, (_, i) => {
          const up = f >= went;
          const y = up ? 800 - ((f - went) * 9 + i * 30) % 500 : 300 + ((f - came) * 7 + i * 30) % 500;
          return <path key={i} d={up ? `M${190 + i * 105} ${y} l-16 28 h32 z` : `M${190 + i * 105} ${y} l-16 -28 h32 z`} fill={up ? B.aqua : B.gauge} />;
        })}
      </Svg>
      <Card x={700} y={200} align="center" big={f >= went ? "WE WENT TO IT" : "IT CAME TO US"} o={ease(f, came, 12)} color={f >= went ? B.aqua : B.gauge} />
    </RungShell>
  );
};
