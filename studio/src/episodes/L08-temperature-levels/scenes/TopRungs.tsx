import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { Thermo, gaugeY } from "../gauge";
import { T } from "../ladder";
import { RING_FRONT, Ring } from "../ring";
import { Caption, Card, ChipSpec, Chips, Clip, Pill, Plate, RungShell, clamp01, cue, lin, mix, rnd } from "./shell";

const ILLU = (source: string): ChipSpec => ({ kind: "ILLUSTRATION", source });

/** 9 · The corona and the Sun's core. #47-#50, #5. Real Artemis II frame, a drawn profile, Parker's own camera, a drawn cross-section. */
export const Corona: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const expectAt = cue(t, 0, "You'd expect");
  const surfAt = cue(t, 0, "Its surface");
  const coronaAt = cue(t, 0, "And its outer");
  const twoAt = cue(t, 0, "about two million");
  const whyAt = lineAt(t, 1);
  const unsolvedAt = cue(t, 1, "and exactly");
  const parkerAt = lineAt(t, 2);
  const kmAt = cue(t, 2, "coming within");
  const shieldAt = cue(t, 2, "Its shield");
  const thinAt = cue(t, 2, "because the corona");
  const ruleAt = lineAt(t, 3);
  const coreAt = lineAt(t, 4);
  const fifteenAt = cue(t, 4, "fifteen million");
  const beatenAt = cue(t, 4, "And we've");

  let log = mix(T.lightning, T.sunFace, ease(frame, surfAt, 14));
  log = mix(log, T.corona, ease(frame, twoAt, 24));
  log = mix(log, T.sunCore, ease(frame, fifteenAt, 24));
  const reading = frame >= fifteenAt ? "15 million °C" : frame >= twoAt ? "2 million °C" : frame >= surfAt ? "5,500 °C" : "about 28,000 °C";
  const sub = frame >= fifteenAt ? "the Sun's centre" : frame >= twoAt ? "the corona" : frame >= surfAt ? "the Sun's surface" : "lightning";

  const eclipse = 1 - ease(frame, expectAt + 4, 10);
  const profile = ease(frame, expectAt, 10) * (1 - ease(frame, parkerAt - 4, 8));
  const wispr = ease(frame, parkerAt - 4, 10) * (1 - ease(frame, ruleAt, 8));
  const rule = ease(frame, ruleAt, 8) * (1 - ease(frame, coreAt, 8));
  const core = ease(frame, coreAt, 10);
  const chips: ChipSpec[] = eclipse > 0.5 ? [{ kind: "REAL FOOTAGE", source: "NASA, Artemis II crew, April 2026" }] : wispr > 0.5 ? [{ kind: "REAL IMAGES", source: "NASA/JHU APL/NRL · Parker's WISPR camera, Dec 2024" }] : [ILLU(core > 0.5 ? "the Sun, cut open · not to scale" : rule > 0.5 ? "particles, drawn" : "temperature outward from the Sun · not to scale")];

  // a profile running outward from the Sun's surface: first the line you'd expect, falling, then the real one, climbing; x and the expected line are not data
  const X0 = 200;
  const X1 = 1280;
  const Y0 = 800;
  const expectK = lin(frame, expectAt + 8, surfAt);
  const riseK = ease(frame, coronaAt, 40);
  const surfaceY = 660;
  const coronaY = 280;
  return (
    <RungShell t={t} index={8} log={log} reading={reading} sub={sub} chips={chips}>
      <Plate id="l08-eclipse-art" from={0} to={expectAt + 16} s0={1} s1={1.08} o0={[60, 50]} bright={1.1} />
      <Pill x={60} y={200} size={28} opacity={eclipse}>the Sun going behind the Moon, from Orion · Artemis II</Pill>
      {profile > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: profile }}>
            <circle cx={X0 - 240} cy={Y0 - 180} r={330} fill={B.gauge} />
            <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="rgba(255,255,255,0.4)" strokeWidth={4} />
            <path d={`M${X0 + 90} ${surfaceY} Q ${X0 + 400} ${surfaceY + 110} ${mix(X0 + 90, X1, expectK)} ${surfaceY + 130 * expectK}`} stroke={B.mute} strokeWidth={7} strokeDasharray="16 14" fill="none" />
            {frame >= coronaAt ? <path d={`M${X0 + 90} ${surfaceY} C ${X0 + 180} ${surfaceY} ${X0 + 220} ${mix(surfaceY, coronaY, riseK)} ${mix(X0 + 220, X1, riseK)} ${mix(surfaceY, coronaY, riseK)}`} stroke={B.tease} strokeWidth={10} fill="none" strokeLinecap="round" /> : null}
          </svg>
          <Pill x={760} y={700} size={30} color={B.mute} opacity={ease(frame, expectAt + 10, 10)}>what you'd expect: cooler further out</Pill>
          <Pill x={X0 + 100} y={surfaceY + 30} size={30} color={B.gauge} opacity={ease(frame, surfAt, 8)}>surface: 5,500 °C</Pill>
          <Pill x={760} y={coronaY - 62} size={36} color={B.tease} opacity={ease(frame, twoAt, 8)}>corona: about 2 million °C</Pill>
          <Pill x={700} y={Y0 + 16} size={26} opacity={ease(frame, expectAt + 10, 10)}>further from the Sun →</Pill>
          <div style={{ opacity: ease(frame, unsolvedAt, 8) }}>
            <Caption bottom={500} size={70} color={B.paper}>why? still unsolved</Caption>
          </div>
        </>
      ) : null}
      {/* Parker's own camera; the frame's small "Sun" diagram is NASA's. */}
      <Clip id="l08-clip-wispr" seconds={20} from={parkerAt - 4} to={ruleAt + 8} start={30} bright={1.25} fit="contain" scale={1.1} origin="55% 50%" />
      <Pill x={60} y={200} size={28} opacity={wispr}>Parker Solar Probe's own camera, inside the corona</Pill>
      <Card x={60} y={760} big="about 6 million km" small="from the Sun" size={70} opacity={ease(frame, kmAt, 8) * wispr * (1 - ease(frame, shieldAt, 8))} />
      <Card x={60} y={760} big="over a thousand degrees" small="on its shield, instead of millions" size={66} color={B.tease} ink={B.paper} opacity={ease(frame, shieldAt, 8) * wispr} />
      <Pill x={760} y={830} size={28} color={B.aqua} opacity={ease(frame, thinAt, 8) * wispr}>the corona is that thin</Pill>
      {/* line 3: the rule from level 8 */}
      {rule > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: rule }}>
            {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={300 + ((frame * (7 + i) + i * 170) % 900)} cy={340 + i * 72} r={12} fill={B.tease} />)}
          </svg>
          <Caption bottom={200} size={110} color={B.gauge}>temperature ≠ heat</Caption>
        </>
      ) : null}
      {/* line 4: the Sun cut open; the core lights on the number */}
      {core > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: core }}>
            <circle cx={680} cy={580} r={370} fill="#FF9A2E" />
            <circle cx={680} cy={580} r={250} fill="#FF7A2E" />
            <circle cx={680} cy={580} r={110 + 8 * Math.sin(frame / 8)} fill={frame >= fifteenAt ? B.paper : "#FFD23D"} />
            <circle cx={680} cy={580} r={150} fill={B.paper} opacity={ease(frame, fifteenAt, 10) * 0.25} />
          </svg>
          <Card x={60} y={200} big="15 million °C" small="where the fusion happens" size={76} opacity={ease(frame, fifteenAt, 8)} />
          <div style={{ opacity: ease(frame, beatenAt, 8) }}>
            <Caption bottom={90} size={80} color={B.paper}>and we've beaten it</Caption>
          </div>
        </>
      ) : null}
    </RungShell>
  );
};

/** 10 · Fusion machines. #51-#54. NSTX-U photo says it is another machine from the first frame; no free KSTAR picture exists. ITER is never on the gauge. */
export const Fusion: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const heldAt = cue(t, 0, "a hundred million");
  const secAt = cue(t, 0, "forty-eight");
  const severalAt = cue(t, 0, "That's several");
  const whyAt = lineAt(t, 1);
  const densAt = cue(t, 1, "Because the Sun");
  const earthAt = cue(t, 1, "On Earth");
  const bottleAt = cue(t, 1, "And since");
  const iterAt = lineAt(t, 2);
  const notAt = cue(t, 2, "It hasn't");
  const log = mix(T.sunCore, T.kstar, ease(frame, heldAt, 24));
  const photo = 1 - ease(frame, whyAt, 10);
  const count = Math.floor(48 * lin(frame, secAt, severalAt));
  const chips: ChipSpec[] = photo > 0.5 ? [{ kind: "OTHER MACHINE", source: "NSTX-U, Princeton · US DOE, not KSTAR" }] : [ILLU(frame >= bottleAt ? "a magnetic bottle, drawn" : "the trade-off, drawn")];
  const trade = ease(frame, whyAt, 10) * (1 - ease(frame, bottleAt - 4, 8));
  const bottle = ease(frame, bottleAt, 10);
  const CX = 660;
  const CY = 560;
  return (
    <RungShell t={t} index={9} log={log} reading={frame >= heldAt ? "100 million °C" : ""} sub={frame >= heldAt ? "KSTAR, held 48 s" : undefined} chips={chips}>
      <Plate id="l08-nstx" from={0} to={whyAt + 8} s0={1.02} s1={1.3} o0={[50, 48]} bright={0.72} />
      <Pill x={60} y={200} size={30} color={B.gauge} opacity={photo}>not KSTAR: another fusion machine, NSTX-U in the US, seen from above</Pill>
      <Card x={60} y={740} big="100 million °C" small="KSTAR, South Korea" size={86} opacity={ease(frame, heldAt, 8) * photo} />
      {frame >= secAt ? <Card x={640} y={740} big={`${count} s`} small="held" size={86} color={B.paper} opacity={photo * ease(frame, secAt, 8)} /> : null}
      {/* "several times hotter": the Sun's core drawn as one bar, the machine as its own, same scale (15 vs 100 million) */}
      <div style={{ position: "absolute", left: 60, top: 300, opacity: photo * ease(frame, severalAt, 8) }}>
        <div style={{ width: 150, height: 44, background: B.mute, borderRadius: 8, marginBottom: 8 }} />
        <div style={{ width: 1000 * ease(frame, severalAt, 24), height: 44, background: B.tease, borderRadius: 8 }} />
      </div>
      <Pill x={60} y={410} size={28} opacity={photo * ease(frame, severalAt, 8)}>the Sun's core, and this machine</Pill>
      {trade > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: trade }}>
            <circle cx={380} cy={560} r={210} fill={B.gauge} />
            {Array.from({ length: 90 }, (_, i) => <circle key={i} cx={380 + (rnd(i) - 0.5) * 300 + Math.sin(frame / 7 + i) * 3} cy={560 + (rnd(i + 50) - 0.5) * 300 + Math.cos(frame / 6 + i) * 3} r={6} fill={B.ink} />)}
            <rect x={780} y={370} width={480} height={380} rx={26} fill="rgba(255,255,255,0.06)" stroke={B.paper} strokeWidth={5} />
            {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={800 + ((frame * (6 + (i % 4)) + i * 83) % 440)} cy={400 + i * 34} r={9} fill={B.tease} opacity={ease(frame, earthAt, 10)} />)}
          </svg>
          <Pill x={380} y={800} align="center" size={32} color={B.gauge} opacity={trade * ease(frame, densAt, 8)}>a star: extreme density</Pill>
          <Pill x={1020} y={800} align="center" size={32} color={B.tease} opacity={trade * ease(frame, earthAt, 8)}>on Earth: more temperature</Pill>
          {frame < densAt ? <Caption bottom={520} size={90} color={B.paper}>why so hot?</Caption> : null}
        </>
      ) : null}
      {bottle > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: bottle * (1 - ease(frame, iterAt, 8) * 0.75) }}>
            {[1, 0.8, 0.6, 0.4].map((k, i) => (
              <ellipse key={k} cx={CX} cy={CY} rx={520 * k} ry={290 * k} fill="none" stroke={B.aqua} strokeWidth={5} strokeDasharray="30 18" strokeDashoffset={frame * (i % 2 ? 2 : -2)} />
            ))}
            {Array.from({ length: 22 }, (_, i) => {
              const a = frame * 0.06 + i * 1.7;
              return <circle key={i} cx={CX + Math.cos(a) * 160 * (0.4 + rnd(i))} cy={CY + Math.sin(a) * 90 * (0.4 + rnd(i))} r={9} fill={B.tease} />;
            })}
          </svg>
          <Pill x={CX} y={200} align="center" size={34} color={B.aqua} opacity={bottle * (1 - ease(frame, iterAt, 8))}>nothing solid can hold this: a magnetic bottle</Pill>
        </>
      ) : null}
      {/* ITER is a design target: a dashed card, off the gauge, in the future tense */}
      <div style={{ position: "absolute", left: 160, top: 400, padding: "20px 34px", border: `6px dashed ${B.gauge}`, borderRadius: 22, background: "rgba(5,14,24,0.92)", opacity: ease(frame, iterAt, 10) }}>
        <div style={{ fontFamily: F.headline, fontSize: 80, color: B.gauge, whiteSpace: "nowrap" }}>ITER: designed for up to 300 million °C</div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 34, marginTop: 6, color: B.paper, opacity: ease(frame, notAt, 8), whiteSpace: "nowrap" }}>not reached yet · so not on the thermometer</div>
      </div>
    </RungShell>
  );
};

/** 11 · Hottest ever made. #56-#61, #16. THE ring again, same drawing; RHIC's real tracks (a different ring, and it says so); protons melt, drawn. */
export const Hottest: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const smashAt = cue(t, 0, "Smash heavy");
  const instantAt = cue(t, 0, "for an instant");
  const bnlAt = lineAt(t, 1);
  const fourAt = cue(t, 1, "about four trillion");
  const quarterAt = cue(t, 1, "more than a quarter");
  const lhcAt = lineAt(t, 2);
  const timesAt = cue(t, 2, "runs collisions");
  const higherAt = cue(t, 2, "and may have");
  const meltAt = lineAt(t, 3);
  const surpriseAt = cue(t, 3, "And the result");
  const flowAt = cue(t, 3, "It flows");
  const bangAt = lineAt(t, 4);
  const endAt = lineAt(t, 5);
  const tripleAt = cue(t, 5, "and the collisions");
  const mostAt = cue(t, 5, "Most of the");

  const log = mix(T.kstar, T.top, ease(frame, fourAt, 40));
  const reading = frame >= fourAt ? "about 4 trillion °C" : "";
  const sub = frame >= fourAt ? "Brookhaven · top of the tube" : undefined;

  const ring1 = 1 - ease(frame, bnlAt - 4, 10);
  const rhic = ease(frame, bnlAt - 4, 10) * (1 - ease(frame, lhcAt - 4, 8));
  const ring2 = ease(frame, lhcAt - 4, 10) * (1 - ease(frame, meltAt - 4, 8));
  const melt = ease(frame, meltAt - 4, 10) * (1 - ease(frame, bangAt - 4, 8));
  const bang = ease(frame, bangAt - 4, 10) * (1 - ease(frame, endAt - 4, 8));
  const ring3 = ease(frame, endAt - 4, 10);
  const ring = Math.max(ring1, ring2, ring3);
  const flash = (frame >= instantAt && frame < bnlAt) || (frame >= timesAt && frame < meltAt) || frame >= tripleAt ? 0.55 + 0.45 * Math.abs(Math.sin(frame / 9)) : 0;
  const chips: ChipSpec[] = rhic > 0.5 ? [{ kind: "REAL IMAGES", source: "Brookhaven National Laboratory · CC BY 2.0" }, { kind: "OTHER MACHINE", source: "RHIC, not the LHC · US DOE" }] : [ILLU(melt > 0.5 ? "melting, drawn" : bang > 0.5 ? "the early universe, drawn" : "the ring, drawn · not to scale")];

  // protons and neutrons: three dots in a bag; the bags open and the dots run together as a stream
  const open = ease(frame, meltAt + 16, 40);
  const liquid = ease(frame, flowAt, 30);
  return (
    <RungShell t={t} index={10} log={log} reading={reading} sub={sub} chips={chips} bracket={frame >= endAt ? { from: T.lhc, to: T.lhcFloor, opacity: ease(frame, endAt, 10) } : undefined}>
      <Ring frame={frame} opacity={ring} beams={frame >= smashAt ? 1 : 0} flash={ring > 0.5 ? flash : 0} />
      <Pill x={700} y={240} align="center" color={B.aqua} size={34} opacity={ring1 * (1 - ease(frame, smashAt, 8))}>back to the ring</Pill>
      <Pill x={RING_FRONT.x} y={RING_FRONT.y + 110} align="center" color={B.tease} size={34} opacity={ease(frame, instantAt, 8) * ring1}>the hottest matter anyone has made</Pill>
      {/* a different ring: real tracks from Brookhaven, inset because the file is 1226 px; the detector beside it */}
      {rhic > 0 ? (
        <>
          <Plate id="l08-star" from={bnlAt - 4} to={lhcAt + 6} s0={1.7} s1={2} o0={[12, 12]} o1={[18, 14]} bright={0.55} />
          <Plate id="l08-gold" from={bnlAt} to={lhcAt + 6} box={{ x: 100, y: 180, w: 640, h: 494 }} s0={1} s1={1.1} bright={1.05} />
          <Pill x={100} y={684} size={26} opacity={rhic}>real tracks from one gold collision, at Brookhaven</Pill>
          <Pill x={780} y={200} size={26} color={B.gauge} opacity={rhic}>a different machine: RHIC's STAR detector</Pill>
          <Card x={100} y={750} big="about 4 trillion °C" small={frame >= quarterAt ? "more than 250,000 times the Sun's core" : "gold ions, New York"} size={80} opacity={rhic * ease(frame, fourAt, 8)} />
        </>
      ) : null}
      <Pill x={700} y={240} align="center" color={B.aqua} size={34} opacity={ring2}>that same ring, from level 2</Pill>
      <Card x={60} y={840} big="more than 100,000 times the Sun's centre" size={56} color={B.tease} ink={B.paper} opacity={ring2 * ease(frame, timesAt, 8)} />
      <Pill x={700} y={490} align="center" size={30} color={B.gauge} opacity={ring2 * ease(frame, higherAt, 8)}>may have gone higher · no final figure</Pill>
      {melt > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: melt }}>
            {liquid > 0 ? <path d={`M120 ${620 + Math.sin(frame / 10) * 14} C 500 ${500 + Math.sin(frame / 13) * 30} 800 ${720 + Math.cos(frame / 11) * 30} 1340 ${600 + Math.sin(frame / 9) * 16}`} stroke={B.gauge} strokeWidth={150 * liquid} fill="none" strokeLinecap="round" opacity={0.85} /> : null}
            {Array.from({ length: 12 }, (_, b) => {
              const bx = 200 + (b % 4) * 300 + 40 * open * Math.sin(frame / 15 + b);
              const by = 400 + Math.floor(b / 4) * 150;
              return (
                <g key={b}>
                  <circle cx={bx} cy={by} r={62} fill="none" stroke={b % 2 ? B.aqua : B.tease} strokeWidth={6} opacity={1 - open} />
                  {[0, 1, 2].map((q) => {
                    const a = (q / 3) * Math.PI * 2 + frame * 0.1 + b;
                    const r = 28 + open * 90 * rnd(b * 3 + q);
                    return <circle key={q} cx={bx + Math.cos(a) * r + open * frame * 0.3} cy={by + Math.sin(a) * r} r={13} fill={[B.tease, B.gauge, B.aqua][q]} opacity={1 - liquid * 0.8} />;
                  })}
                </g>
              );
            })}
          </svg>
          <Pill x={200} y={200} size={36} opacity={melt * ease(frame, meltAt, 8)}>protons and neutrons melt</Pill>
          <div style={{ position: "absolute", left: 200, top: 860, fontFamily: F.headline, fontSize: 70, color: B.mute, opacity: melt * ease(frame, surpriseAt, 8), textDecoration: frame >= flowAt - 10 ? "line-through" : "none", textDecorationColor: B.tease, whiteSpace: "nowrap" }}>not a gas</div>
          <Pill x={520} y={880} size={36} color={B.gauge} opacity={melt * ease(frame, flowAt, 8)}>a nearly friction-free liquid</Pill>
        </>
      ) : null}
      {bang > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: bang }}>
            <circle cx={680} cy={560} r={60 + ((frame - bangAt) * 3.2)} fill={B.gauge} opacity={0.5} />
            <circle cx={680} cy={560} r={30 + ((frame - bangAt) * 2)} fill={B.paper} opacity={0.5} />
            {Array.from({ length: 70 }, (_, i) => {
              const a = rnd(i) * Math.PI * 2;
              const r = (frame - bangAt) * (1 + rnd(i + 5) * 4);
              return <circle key={i} cx={680 + Math.cos(a) * r} cy={560 + Math.sin(a) * r} r={6} fill={B.tease} />;
            })}
          </svg>
          <Card x={100} y={220} big="a few millionths of a second" small="after the Big Bang, the whole universe" size={76} opacity={bang * ease(frame, bangAt + 20, 8)} />
        </>
      ) : null}
      {/* line 5: the same picture as the cold open's second beat, now with the numbers it has earned */}
      <Pill x={700} y={240} align="center" color={B.aqua} size={34} opacity={ring3}>its magnets: 1.9 K</Pill>
      <Pill x={RING_FRONT.x} y={RING_FRONT.y + 110} align="center" color={B.tease} size={34} opacity={ring3 * ease(frame, tripleAt, 8)}>its collisions: trillions of degrees</Pill>
      <div style={{ opacity: ease(frame, mostAt, 8) }}>
        <Caption bottom={500} size={56} color={B.gauge}>most of the thermometer, in one tunnel</Caption>
      </div>
    </RungShell>
  );
};

/** Past the top. #62-#67, then the recap. No title bar: the ladder is over, and the thermometer runs out at its top end. Nothing here is on the gauge. */
export const PastTheTop: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const stopAt = cue(t, 0, "It doesn't stop");
  const munichAt = lineAt(t, 1);
  const gasAt = cue(t, 1, "made a gas");
  const minusAt = cue(t, 1, "minus a few");
  const belowAt = cue(t, 1, "That's below");
  const exceptAt = lineAt(t, 2);
  const hotterAt = cue(t, 2, "By the standard");
  const wordsAt = cue(t, 2, "Their words");
  const ceilingAt = lineAt(t, 3);
  const pileAt = cue(t, 3, "so that most");
  const waterAt = cue(t, 3, "Water can");
  const researchersAt = lineAt(t, 4);
  const otherAt = cue(t, 4, "Other physicists");
  const noneAt = lineAt(t, 5);
  const recapAt = lineAt(t, 6);
  const towerAt = recapAt;
  const tunnelAt = cue(t, 6, "the coldest and hottest");
  const bendAt = cue(t, 6, "and even the number");
  const morningAt = cue(t, 6, "Not bad");

  // the scale, drawn as a line of its own to the left of the thermometer: 0 ... + ... infinity, then negative ... up to the hottest end
  const line = (1 - ease(frame, ceilingAt - 4, 8));
  const LX0 = 100;
  const LX1 = 1560;
  const LY = 560;
  const INF = 1120;
  const wrap = ease(frame, wordsAt, 30);
  const dotX = frame < exceptAt ? mix(LX0, LX0 - 0, 0) + 0 : mix(LX0, 1380, ease(frame, hotterAt, 30));
  const hill = ease(frame, ceilingAt, 10) * (1 - ease(frame, researchersAt - 4, 8));
  const debate = ease(frame, researchersAt, 10) * (1 - ease(frame, recapAt - 4, 8));
  const recap = ease(frame, recapAt - 2, 10);
  const pile = ease(frame, pileAt, 40);
  const hillPath = "M180 820 Q 480 820 720 380 Q 960 820 1260 820";
  const hillY = (x: number) => {
    const u = Math.abs(x - 720) / 540; // an approximation of the drawn hill, good enough for dots resting on it
    return 380 + 440 * Math.min(1, Math.sqrt(u) * 1.02) ;
  };
  const chips: ChipSpec[] = [ILLU(recap > 0.5 ? "the recap, drawn" : hill > 0.5 ? "our drawing of the researchers' analogy" : debate > 0.5 ? "the two views" : "the scale past the top, drawn")];

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 45%, #2A1626 0%, #140F22 55%, #050E18 100%)" }} />
      {/* line 0-2: the odd number line. It is NOT the gauge: it lives left of it. */}
      {line > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: line }}>
            <line x1={LX0} y1={LY} x2={frame >= stopAt ? INF : mix(LX0, INF, lin(frame, 4, stopAt))} y2={LY} stroke={B.gauge} strokeWidth={10} />
            <line x1={LX0} y1={LY - 30} x2={LX0} y2={LY + 30} stroke={B.tease} strokeWidth={8} />
            {wrap > 0 ? (
              <>
                <path d={`M${INF} ${LY} C ${INF + 70} ${LY - 170} ${INF + 110} ${LY - 170} ${INF + 170} ${LY}`} stroke={B.tease} strokeWidth={8} strokeDasharray="14 12" strokeDashoffset={-frame} fill="none" opacity={wrap} />
                <line x1={INF + 170} y1={LY} x2={mix(INF + 170, LX1, wrap)} y2={LY} stroke={B.tease} strokeWidth={10} />
              </>
            ) : null}
            {frame >= minusAt ? <circle cx={frame >= exceptAt ? dotX : LX0} cy={frame >= exceptAt ? LY : LY + 110 + 6 * Math.sin(frame / 9)} r={26} fill={B.paper} stroke={B.tease} strokeWidth={8} /> : null}
          </svg>
          <Pill x={LX0} y={LY + 44} size={26} color={B.tease} opacity={line * (1 - ease(frame, minusAt, 8))}>0 K</Pill>
          <Pill x={INF} y={LY + 44} align="center" size={36} color={B.gauge} opacity={line * ease(frame, stopAt, 10)}>∞ ?</Pill>
          <Card x={100} y={200} big="Munich, 2013" small={frame >= gasAt ? "about 100,000 atoms" : undefined} size={72} color={B.paper} opacity={ease(frame, munichAt, 8) * line * (1 - ease(frame, exceptAt, 8))} />
          <Pill x={LX0 + 40} y={LY + 96} size={34} color={B.tease} opacity={line * ease(frame, minusAt, 8) * (1 - ease(frame, exceptAt, 8))}>minus a few billionths of a kelvin</Pill>
          <Pill x={LX0 + 40} y={LY + 160} size={30} opacity={line * ease(frame, belowAt, 8) * (1 - ease(frame, exceptAt, 8))}>below the floor?</Pill>
          <Card x={100} y={200} big="it isn't colder" size={92} color={B.tease} ink={B.paper} opacity={line * ease(frame, exceptAt, 8) * (1 - ease(frame, wordsAt, 8))} />
          <Pill x={100} y={330} size={32} color={B.gauge} opacity={line * ease(frame, hotterAt, 8) * (1 - ease(frame, wordsAt, 8))}>by the standard definition: hotter than any positive temperature</Pill>
          <Card x={100} y={200} big="the scale jumps to negative" size={92} opacity={line * ease(frame, wordsAt, 8)} />
          <Pill x={INF + 180} y={LY + 44} size={34} color={B.tease} opacity={line * ease(frame, wordsAt + 20, 8)}>negative values</Pill>
        </>
      ) : null}
      {/* line 3: the hill. Our own drawing of the balls-on-a-hill idea. */}
      {hill > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: hill }}>
            <path d={`${hillPath} V 900 H 180 Z`} fill="#1F3148" />
            <path d={hillPath} stroke={B.paper} strokeWidth={6} fill="none" />
            <line x1={160} y1={330} x2={1280} y2={330} stroke={B.tease} strokeWidth={6} strokeDasharray="18 12" opacity={ease(frame, ceilingAt + 6, 10)} />
            {Array.from({ length: 24 }, (_, i) => {
              const homeX = 200 + rnd(i) * 120 + (i % 2 ? 900 : 0);
              const topX = 720 + (i - 12) * 7;
              const x = mix(homeX, topX, pile);
              const y = mix(800 - rnd(i + 3) * 16, 356 - (i % 4) * 16, pile) + Math.sin(frame / 8 + i) * 3;
              return <circle key={i} cx={x} cy={y} r={15} fill={i % 2 ? B.gauge : B.tease} stroke={B.ink} strokeWidth={3} />;
            })}
          </svg>
          <Pill x={1000} y={270} size={32} color={B.tease} opacity={hill * ease(frame, ceilingAt + 6, 10)}>an energy ceiling</Pill>
          <Pill x={200} y={200} size={32} color={B.gauge} opacity={hill * ease(frame, pileAt, 10)}>most atoms pile up at the top</Pill>
          <Pill x={200} y={930} size={32} color={B.aqua} opacity={hill * ease(frame, waterAt, 8)}>water can never do this</Pill>
        </>
      ) : null}
      {/* lines 4-5: two views, neither winning */}
      {debate > 0 ? (
        <>
          <div style={{ position: "absolute", left: 120, top: 280 + Math.sin(frame / 20) * 8, width: 600, padding: 30, borderRadius: 22, background: B.paper, color: B.ink, opacity: debate * ease(frame, researchersAt, 10), fontFamily: F.ui, fontWeight: 800, fontSize: 38, lineHeight: 1.25 }}>
            The researchers: the odd sign comes from how temperature was historically defined.
          </div>
          <div style={{ position: "absolute", left: 790, top: 280 - Math.sin(frame / 20) * 8, width: 600, padding: 30, borderRadius: 22, background: B.tease, color: B.paper, opacity: debate * ease(frame, otherAt, 10), fontFamily: F.ui, fontWeight: 800, fontSize: 38, lineHeight: 1.25 }}>
            Other physicists: a flawed definition of entropy, so the negative value isn't real.
          </div>
          <div style={{ opacity: ease(frame, noneAt, 6) * debate }}>
            <Caption bottom={170} size={110} color={B.gauge}>not everyone agrees</Caption>
          </div>
        </>
      ) : null}
      {/* line 6: three callbacks, each its own drawing again */}
      {recap > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: recap * (1 - ease(frame, morningAt, 10)) }}>
            <rect x={120} y={240} width={120} height={520} rx={12} fill="rgba(255,255,255,0.05)" stroke={B.paper} strokeWidth={5} />
            {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={180 + (rnd(i) - 0.5) * 50} cy={260 + (((frame - towerAt) / 110) % 1) ** 2 * 460 + (rnd(i + 8) - 0.5) * 50} r={5} fill={B.aqua} />)}
            {frame >= bendAt ? (
              <g opacity={ease(frame, bendAt, 10)}>
                <line x1={1040} y1={520} x2={1200} y2={520} stroke={B.gauge} strokeWidth={9} />
                <path d="M1200 520 C 1240 440 1270 440 1300 520" stroke={B.tease} strokeWidth={8} strokeDasharray="12 10" fill="none" strokeDashoffset={-frame} />
                <line x1={1300} y1={520} x2={1400} y2={520} stroke={B.tease} strokeWidth={9} />
              </g>
            ) : null}
          </svg>
          <Ring frame={frame} opacity={recap * (1 - ease(frame, morningAt, 10)) * ease(frame, tunnelAt, 10)} k={0.5} x={-40} y={-20} beams={1} />
          <Pill x={180} y={790} align="center" size={28} opacity={recap * (1 - ease(frame, morningAt, 10))}>dropped</Pill>
          <Pill x={660} y={790} align="center" size={28} color={B.aqua} opacity={ease(frame, tunnelAt, 10) * (1 - ease(frame, morningAt, 10))}>one tunnel</Pill>
          <Pill x={1220} y={590} align="center" size={28} color={B.tease} opacity={ease(frame, bendAt, 10) * (1 - ease(frame, morningAt, 10))}>the number line bends</Pill>
          <div style={{ position: "absolute", left: 120, top: 330, fontFamily: F.headline, fontSize: 130, lineHeight: 1.05, color: B.paper, whiteSpace: "nowrap", opacity: ease(frame, morningAt, 10) }}>something you check<br /><span style={{ color: B.gauge }}>every morning</span></div>
        </>
      ) : null}
      <Thermo log={T.top} frame={frame} space you offTop={ease(frame, stopAt, 20)} passed={10} />
      {frame >= morningAt ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle cx={1790} cy={gaugeY(T.you)} r={20 + 6 * Math.sin(frame / 7)} fill="none" stroke={B.gauge} strokeWidth={6} />
        </svg>
      ) : null}
      <Pill x={1730} y={120} align="right" size={28} color={B.tease} opacity={ease(frame, stopAt, 12) * line}>off the gauge</Pill>
      <Chips chips={chips} />
    </AbsoluteFill>
  );
};
