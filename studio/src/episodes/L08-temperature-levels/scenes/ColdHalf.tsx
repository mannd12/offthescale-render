import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { DiverSilhouette } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { Thermo, gaugeY } from "../gauge";
import { T } from "../ladder";
import { RING_FRONT, Ring } from "../ring";
import { Caption, Card, ChipSpec, Chips, Pill, Plate, RungShell, Tag, clamp01, cue, lin, mix, rnd } from "./shell";

const ILLU = (source: string): ChipSpec => ({ kind: "ILLUSTRATION", source });

/** Cold open. The ring (#17), the magnets (#16), the collisions (#58); the thermometer acts out each sentence. */
export const ColdOpen: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const kmAt = cue(t, 0, "twenty-seven");
  const coldAt = cue(t, 0, "Its magnets");
  const spaceAt = cue(t, 0, "outer space");
  const hotAt = lineAt(t, 1);
  const collideAt = cue(t, 1, "collisions");
  const timesAt = cue(t, 1, "more than");
  const oneAt = lineAt(t, 2);
  const climbAt = lineAt(t, 3);
  const eachAt = cue(t, 3, "Each mark");
  const coversAt = cue(t, 3, "It covers");
  const liveAt = lineAt(t, 4);
  const midAt = cue(t, 4, "A bit past");
  const floorAt = lineAt(t, 5);

  // the level rests at 15 °C, falls past SPACE to 1.9 K, shoots to the LHC's floor figure, settles back at you, drops to the floor
  let log = mix(T.you, T.lhc, ease(frame, coldAt, 34));
  log = mix(log, T.lhcFloor, ease(frame, collideAt + 10, 22));
  log = mix(log, T.you, ease(frame, climbAt, 30));
  log = mix(log, T.coldest, ease(frame, floorAt + 4, 26));

  const ringOn = 1 - ease(frame, climbAt, 14);
  const flash = frame >= collideAt + 8 && frame < climbAt ? 0.55 + 0.45 * Math.abs(Math.sin((frame - collideAt) / 9)) : 0;
  const sweep = frame >= eachAt ? lin(frame, eachAt, coversAt) : 0;
  const reading = frame >= floorAt ? "" : frame >= liveAt ? "15 °C" : frame >= climbAt ? "" : frame >= spaceAt && frame < hotAt ? "1.9 K" : "";
  const sub = frame >= liveAt ? "where you live" : frame >= spaceAt ? "the magnets · space is 2.7 K" : undefined;
  const marks = Math.min(23, Math.floor(sweep * 23.99));
  const midY = gaugeY((T.coldest + T.top) / 2);

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, #142A40 0%, #0B1B2B 55%, #050E18 100%)" }} />
      {/* strata drift slowly: this is underground. The border runs through the ring. */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.5 * ringOn }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M0 ${240 + i * 150} Q 480 ${200 + i * 150 + Math.sin(frame / 60 + i) * 40} 960 ${240 + i * 150} T 1740 ${240 + i * 150}`} stroke="#2A4259" strokeWidth={3} fill="none" />
        ))}
        <line x1={420} y1={140} x2={980} y2={960} stroke={B.paper} strokeWidth={4} strokeDasharray="16 14" opacity={ease(frame, 4, 20)} />
      </svg>
      <Ring frame={frame} draw={lin(frame, 4, kmAt + 20)} cold={frame >= coldAt ? 1 : 0.2} beams={frame >= hotAt ? 1 : 0} flash={flash} opacity={ringOn} />
      <Tag x={300} y={170} opacity={ringOn * ease(frame, 10, 14)}>FRANCE</Tag>
      <Tag x={880} y={170} opacity={ringOn * ease(frame, 10, 14)}>SWITZERLAND</Tag>
      <Card x={590} y={470} big="27 km" size={92} opacity={ease(frame, kmAt, 12) * (1 - ease(frame, hotAt - 8, 10))} />
      {/* the real place: the ring marked on a satellite image; an inset because the file is 1026 px */}
      <Plate id="l08-aster" from={kmAt + 16} to={hotAt} box={{ x: 1330, y: 640, w: 300, h: 277 }} s0={1} s1={1.12} bright={1} />
      <Pill x={1730} y={925} align="right" size={24} opacity={ease(frame, kmAt + 16, 12) * (1 - ease(frame, hotAt - 12, 10))}>a real satellite view · NASA/METI/AIST</Pill>
      <Pill x={700} y={240} align="center" color={B.aqua} size={34} opacity={ease(frame, spaceAt - 6, 10) * (1 - ease(frame, hotAt, 8))}>colder than outer space</Pill>
      <Card x={120} y={40} big="more than 100,000 times" small="hotter than the centre of the Sun" size={72} color={B.tease} ink={B.paper} opacity={ease(frame, timesAt, 10) * (1 - ease(frame, oneAt - 6, 10))} />
      {/* line 2: both ends named on the same drawing, and bracketed on the tube */}
      <Pill x={700} y={240} align="center" color={B.aqua} size={34} opacity={ease(frame, oneAt, 10) * ringOn}>its coldest: the magnets</Pill>
      <Pill x={RING_FRONT.x} y={RING_FRONT.y + 110} align="center" color={B.tease} size={34} opacity={ease(frame, oneAt + 8, 10) * ringOn}>its hottest: the collisions</Pill>

      {frame >= climbAt && frame < floorAt ? (
        <>
          <div style={{ position: "absolute", left: 120, top: 170, fontFamily: F.headline, fontSize: 96, lineHeight: 1.05, color: B.paper, opacity: ease(frame, climbAt, 12) * (1 - ease(frame, liveAt, 10)), whiteSpace: "nowrap" }}>
            the <span style={{ color: B.aqua }}>coldest</span> ever made <br /> to the <span style={{ color: B.tease }}>hottest</span>
          </div>
          {/* twenty-three cells, one per mark, lighting with the ticks on the tube */}
          {frame >= eachAt && frame < liveAt ? (
            <>
              <div style={{ position: "absolute", left: 120, top: 420, width: 1220, display: "flex", flexWrap: "wrap", gap: 10 }}>
                {Array.from({ length: 23 }, (_, i) => (
                  <div key={i} style={{ width: 92, height: 62, borderRadius: 10, background: i < marks ? (i < 13 ? B.aqua : B.tease) : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontWeight: 800, fontSize: 28, color: B.ink }}>{i < marks ? "×10" : ""}</div>
                ))}
              </div>
              <Card x={120} y={760} big="about 23 powers of ten" size={72} opacity={ease(frame, cue(t, 3, "It covers"), 10)} />
            </>
          ) : null}
          {/* line 4: you, against the middle of the tube */}
          {frame >= liveAt ? (
            <>
              <DiverSilhouette size={320} color={B.paper} style={{ position: "absolute", left: 240, top: 340 + (1 - ease(frame, liveAt, 16)) * 40, opacity: ease(frame, liveAt, 14) }} />
              <Card x={600} y={380} big="about 15 °C" size={110} opacity={ease(frame, liveAt + 6, 12)} />
              <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, midAt, 10) }}>
                <line x1={640} y1={midY} x2={1770} y2={midY} stroke={B.aqua} strokeWidth={4} strokeDasharray="12 10" strokeDashoffset={-frame} />
              </svg>
              <Pill x={640} y={midY + 12} color={B.aqua} size={30} opacity={ease(frame, midAt, 10)}>the middle of the tube</Pill>
            </>
          ) : null}
        </>
      ) : null}
      <div style={{ opacity: ease(frame, floorAt + 2, 8) }}>
        <Caption bottom={420} size={150} color={B.tease}>the floor</Caption>
      </div>

      <Thermo log={log} reading={reading} sub={sub} space you={frame >= liveAt} sweep={sweep} frame={frame} bracket={frame >= oneAt && frame < climbAt ? { from: T.lhc, to: T.lhcFloor, opacity: ease(frame, oneAt, 10) } : undefined} />
      <Chips chips={[frame < climbAt ? ILLU("the ring, drawn · not to scale") : ILLU("the thermometer · log scale")]} />
    </AbsoluteFill>
  );
};

/** Dots that jiggle: `amp` is their energy of motion. */
const Atoms: React.FC<{ frame: number; x: number; y: number; w: number; h: number; amp: number; n?: number; color?: string; opacity?: number }> = ({ frame, x, y, w, h, amp, n = 70, color = B.aqua, opacity = 1 }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity }}>
    {Array.from({ length: n }, (_, i) => {
      const px = x + rnd(i) * w + Math.sin(frame * (0.5 + rnd(i + 7)) + i) * amp;
      const py = y + rnd(i + 200) * h + Math.cos(frame * (0.6 + rnd(i + 9)) + i * 2) * amp;
      return <circle key={i} cx={px} cy={py} r={9} fill={color} />;
    })}
  </svg>
);

/** 1 · The coldest ever made. Drawn: no free picture of the subject exists (assets.md). #1-#4, #9, #11, #12; stand-in photo labelled. */
export const Coldest: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const bottomAt = cue(t, 0, "So there's a bottom");
  const minusAt = cue(t, 0, "minus two hundred");
  const neverAt = cue(t, 0, "And nothing");
  const stepsAt = lineAt(t, 1);
  const motionAt = lineAt(t, 2);
  const zpAt = cue(t, 2, "matter still");
  const howAt = lineAt(t, 3);
  const in2021 = cue(t, 3, "In 2021");
  const pkAt = cue(t, 3, "thirty-eight picokelvin");
  const trilAt = cue(t, 3, "thirty-eight trillionths");
  const dropAt = lineAt(t, 4);
  const rbAt = cue(t, 4, "about a hundred thousand");
  const towerAt = cue(t, 4, "a tower");
  const fellAt = cue(t, 4, "The coldest thing");
  const lensAt = lineAt(t, 5);
  const usedAt = cue(t, 5, "they used");
  const noLens = cue(t, 5, "Without it");
  const withAt = lineAt(t, 6);

  const amp = mix(26, 3, ease(frame, bottomAt, 50));
  const box = frame < howAt ? clamp01(1 - ease(frame, stepsAt - 6, 10) + ease(frame, motionAt, 10)) * (1 - ease(frame, howAt - 8, 8)) : 0;
  const stairs = ease(frame, stepsAt, 10) * (1 - ease(frame, motionAt - 6, 8));
  const tower = ease(frame, dropAt, 12);

  // a ball steps down, each step half the last, and never lands (#4): an illustration, not data
  const stepN = Math.min(9, Math.floor(lin(frame, stepsAt + 6, motionAt - 10) * 10));
  const stairY = (n: number) => 260 + 490 * (1 - 0.5 ** n);
  const stairX = (n: number) => 200 + n * 112;

  // the fall: a looped drop, 110 m = 700 px on screen; a 150-frame loop stands for the two seconds
  const TY0 = 220;
  const TY1 = 900;
  const fallK = (from: number, secs: number) => (frame >= from ? (((frame - from) / (secs * 30)) % 1) ** 2 : 0);
  const k1 = frame < lensAt ? fallK(rbAt, 3.2) : 0;
  const loop = frame >= lensAt ? ((frame - lensAt) / 150) % 1 : 0;
  const kLens = loop ** 2;
  const compare = frame >= noLens;
  const cloud = (cx: number, k: number, spread: number, op: number, color: string) => {
    const cy = TY0 + (TY1 - TY0) * k;
    return (
      <g opacity={op}>
        {Array.from({ length: 46 }, (_, i) => (
          <circle key={i} cx={cx + (rnd(i) - 0.5) * spread + Math.sin(frame * 0.4 + i) * 1.5} cy={cy + (rnd(i + 80) - 0.5) * spread + Math.cos(frame * 0.5 + i) * 1.5} r={5} fill={color} />
        ))}
      </g>
    );
  };
  // #12: 160 ms of the 2 s fall is 0.08 of the loop: the unlensed cloud spreads and is gone by then
  const noSpread = 40 + 160 * clamp01(loop / 0.08);
  const noOp = loop < 0.08 ? 1 : Math.max(0, 1 - (loop - 0.08) / 0.04);

  const reading = frame >= pkAt ? "38 pK" : "";
  const sub = frame >= pkAt ? "reported in 2021" : undefined;
  const bec = ease(frame, in2021, 12) * (1 - ease(frame, dropAt - 6, 8));
  const chips: ChipSpec[] = bec > 0.5 ? [{ kind: "FALSE COLOUR", source: "a different cloud · NIST/JILA, 1995" }] : [ILLU(frame >= dropAt ? "the drop, drawn · not to scale" : stairs > 0.5 ? "the idea, drawn" : "atoms, drawn")];

  return (
    <RungShell t={t} index={0} log={T.coldest} reading={reading} sub={sub} chips={chips}>
      {box > 0 ? (
        <>
          <Atoms frame={frame} x={210} y={280} w={880} h={410} amp={frame >= motionAt ? 3 + 2 * Math.sin(frame / 8) : amp} opacity={box} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: box }}>
            <line x1={150} y1={790} x2={1340} y2={790} stroke={B.tease} strokeWidth={8} opacity={ease(frame, bottomAt, 12)} />
          </svg>
          <Pill x={210} y={200} size={34} color={B.aqua} opacity={box * ease(frame, 8, 12) * (1 - ease(frame, bottomAt, 10))}>temperature = energy of motion</Pill>
          <Card x={150} y={812} big="absolute zero · −273.15 °C" size={64} color={B.tease} ink={B.paper} opacity={box * ease(frame, minusAt, 10)} />
          <Pill x={990} y={830} color={B.gauge} size={36} opacity={box * ease(frame, neverAt, 10)}>never reached</Pill>
          {frame >= motionAt ? (
            <>
              <div style={{ position: "absolute", left: 210, top: 190, fontFamily: F.headline, fontSize: 64, color: B.mute, opacity: ease(frame, motionAt, 10), textDecoration: frame >= zpAt - 12 ? "line-through" : "none", textDecorationColor: B.tease, whiteSpace: "nowrap" }}>everything stops</div>
              <Pill x={730} y={204} color={B.aqua} size={36} opacity={ease(frame, zpAt, 10)}>zero-point motion</Pill>
            </>
          ) : null}
        </>
      ) : null}
      {stairs > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: stairs }}>
            {Array.from({ length: 10 }, (_, n) => (
              <path key={n} d={`M${stairX(n)} ${stairY(n)} h112 V${stairY(n + 1)}`} stroke={n <= stepN ? B.aqua : "rgba(255,255,255,0.25)"} strokeWidth={6} fill="none" />
            ))}
            <line x1={150} y1={790} x2={1340} y2={790} stroke={B.tease} strokeWidth={8} />
            <circle cx={stairX(stepN) + 56} cy={stairY(stepN) - 22 - Math.abs(Math.sin(frame / 6)) * 16} r={20} fill={B.gauge} />
          </svg>
          <Tag x={200} y={812} color={B.tease} opacity={stairs}>absolute zero</Tag>
          <Pill x={560} y={200} size={32} opacity={stairs * ease(frame, cue(t, 1, "no process"), 10)} color={B.gauge}>no finite number of steps, no finite time</Pill>
        </>
      ) : null}
      {/* line 3: the stand-in, saying so from its first frame */}
      {frame >= howAt - 8 && frame < in2021 ? <Caption bottom={480} size={96} color={B.paper}>so how close?</Caption> : null}
      <Plate id="l08-bec" from={in2021} to={dropAt} s0={1.02} s1={1.14} o0={[30, 50]} o1={[60, 45]} bright={0.75} />
      <Pill x={60} y={200} size={28} opacity={bec}>not this experiment: the first condensate, 1995 · colours are false</Pill>
      <Card x={60} y={740} big="38 picokelvin" small={frame >= trilAt ? "38 trillionths of a degree above the floor" : "Germany, 2021"} size={96} opacity={bec * ease(frame, pkAt, 10)} />

      {tower > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: tower }}>
            <rect x={compare ? 500 : 590} y={TY0 - 24} width={compare ? 420 : 240} height={TY1 - TY0 + 48} rx={18} fill="rgba(255,255,255,0.05)" stroke={B.paper} strokeWidth={5} />
            <g opacity={ease(frame, towerAt, 10)}>
              <line x1={460} y1={TY0} x2={460} y2={TY1} stroke={B.gauge} strokeWidth={5} />
              <line x1={445} y1={TY0} x2={475} y2={TY0} stroke={B.gauge} strokeWidth={5} />
              <line x1={445} y1={TY1} x2={475} y2={TY1} stroke={B.gauge} strokeWidth={5} />
            </g>
            {frame < lensAt ? cloud(710, k1, 60, frame >= rbAt ? 1 : 0, B.aqua) : null}
            {frame >= lensAt && !compare ? cloud(710, kLens, 60, 1, B.aqua) : null}
            {compare ? (
              <>
                <line x1={710} y1={TY0 - 20} x2={710} y2={TY1 + 20} stroke="rgba(255,255,255,0.25)" strokeWidth={3} strokeDasharray="10 10" />
                {cloud(605, kLens, noSpread, noOp, B.tease)}
                {cloud(815, kLens, 50, frame >= withAt ? 1 : 0.35, B.aqua)}
              </>
            ) : null}
          </svg>
          <Pill x={440} y={530} align="right" color={B.gauge} size={40} opacity={ease(frame, towerAt, 10)}>110 m</Pill>
          <Card x={960} y={230} big="about 100,000" small="atoms of rubidium" size={72} opacity={ease(frame, rbAt, 10) * (1 - ease(frame, lensAt, 8))} />
          <Card x={960} y={420} big="made by letting it fall" size={62} color={B.paper} opacity={ease(frame, fellAt, 10) * (1 - ease(frame, lensAt, 8))} />
          <Card x={960} y={230} big="2 s of free fall" size={72} opacity={ease(frame, lensAt, 10)} />
          <Pill x={960} y={370} color={B.aqua} size={28} opacity={ease(frame, usedAt, 10)}>a kind of lens spreads out their motion</Pill>
          {compare ? <Pill x={605} y={TY0 - 74} align="center" color={B.tease} size={26}>no lens</Pill> : null}
          {compare ? <Pill x={815} y={TY0 - 74} align="center" color={B.aqua} size={26} opacity={ease(frame, withAt - 6, 8)}>lens</Pill> : null}
          <Pill x={960} y={450} color={B.tease} size={28} opacity={ease(frame, noLens + 20, 10)}>no lens: gone after about 1/6 of a second</Pill>
          <Pill x={960} y={520} color={B.aqua} size={28} opacity={ease(frame, withAt, 10)}>lens: seen for the whole fall</Pill>
        </>
      ) : null}
    </RungShell>
  );
};

/** 2 · Colder than space. #16-#23. Planck map (false colour), Boomerang (false colour), the ring again, a real dipole in Belgrade. */
export const ColderThanSpace: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const lightAt = cue(t, 0, "It's filled");
  const twoAt = cue(t, 0, "about two point seven");
  const placesAt = lineAt(t, 1);
  const boomAt = lineAt(t, 2);
  const lyAt = cue(t, 2, "five thousand");
  const oneAt = cue(t, 2, "about one degree");
  const knownAt = cue(t, 2, "the coldest known");
  const chillAt = cue(t, 2, "chilled by");
  const ringAt = lineAt(t, 3);
  const lhcAt = cue(t, 3, "The Large Hadron");
  const nineAt = cue(t, 3, "one point nine");
  const heAt = lineAt(t, 4);
  const cryoAt = cue(t, 4, "the largest");
  const weeksAt = cue(t, 4, "and weeks");
  const superAt = cue(t, 4, "Below about");
  const tunnelAt = lineAt(t, 5);
  const remAt = cue(t, 5, "Remember");
  const backAt = cue(t, 5, "It comes back");
  const photoFrom = lhcAt + 30;

  let log = mix(T.coldest, T.space, ease(frame, twoAt - 6, 30));
  log = mix(log, T.boomerang, ease(frame, oneAt, 20));
  log = mix(log, T.lhc, ease(frame, nineAt, 20));
  const reading = frame >= nineAt ? "1.9 K" : frame >= ringAt ? "" : frame >= oneAt ? "about 1 K" : frame >= twoAt ? "about 2.7 K" : "";
  const sub = frame >= nineAt ? "the LHC's main magnets" : frame >= ringAt ? undefined : frame >= oneAt ? "Boomerang Nebula" : frame >= twoAt ? "deep space" : undefined;

  const ring = clamp01(ease(frame, ringAt, 12) * (1 - ease(frame, photoFrom, 10)) + ease(frame, tunnelAt, 12));
  const photo = frame >= photoFrom && frame < heAt;
  const chips: ChipSpec[] = frame < boomAt ? [{ kind: "FALSE COLOUR", source: "ESA and the Planck Collaboration" }] : frame < ringAt ? [{ kind: "FALSE COLOUR", source: "ALMA (ESO/NAOJ/NRAO)/R. Sahai" }] : photo ? [{ kind: "REAL FOOTAGE", source: "MaGIc2laNTern · CC BY 3.0" }] : [ILLU(frame >= heAt && frame < tunnelAt ? "inside a magnet, drawn · not to scale" : "the ring, drawn · not to scale")];

  // helium jostles, then below 2.17 K (#18) runs as one smooth stream
  const smooth = ease(frame, superAt, 24);
  const HX = 520;
  const HY = 560;
  const spaceY = gaugeY(T.space);
  const open = ease(frame, placesAt, 24);

  return (
    <RungShell t={t} index={1} log={log} reading={reading} sub={sub} chips={chips}>
      <Plate id="l08-cmb" from={0} to={boomAt} s0={1.06} s1={1.3} o0={[20, 45]} o1={[75, 55]} bright={frame >= placesAt ? 0.3 : 0.85} />
      <Pill x={60} y={200} size={28} opacity={1 - ease(frame, boomAt - 10, 8)}>the whole sky, as a map · the colours are false</Pill>
      <Card x={60} y={760} big="the oldest light in the universe" size={62} opacity={ease(frame, lightAt, 10) * (1 - ease(frame, placesAt, 8))} />
      {frame >= placesAt && frame < boomAt ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={1750 - 1630 * open} y={spaceY} width={1630 * open} height={Math.max(0, gaugeY(T.coldest) - spaceY)} fill={B.aqua} opacity={0.2} />
            <line x1={1750 - 1630 * open} y1={spaceY} x2={1750} y2={spaceY} stroke={B.aqua} strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={frame} />
          </svg>
          <Caption bottom={220} size={84} color={B.aqua}>colder than deep space</Caption>
        </>
      ) : null}
      {frame >= boomAt - 8 && frame < ringAt ? (
        <>
          <Plate id="l08-boomerang-alma" from={boomAt - 8} to={ringAt} box={{ x: 100, y: 170, w: 760, h: 760 }} s0={1} s1={1.22} o0={[50, 50]} o1={[50, 42]} bright={1} />
          <Pill x={120} y={190} size={26}>radio + visible light · colours are false</Pill>
          <Card x={900} y={210} big="Boomerang Nebula" size={60} color={B.paper} opacity={ease(frame, boomAt, 10)} />
          <Pill x={900} y={320} size={32} opacity={ease(frame, lyAt, 10)}>5,000 light-years away</Pill>
          <Pill x={900} y={390} size={32} color={B.paper} opacity={ease(frame, oneAt, 10)}>about 1 degree above zero</Pill>
          <Pill x={900} y={460} size={32} color={B.aqua} opacity={ease(frame, knownAt, 10)}>coldest known object in nature</Pill>
          <Pill x={900} y={530} size={32} color={B.gauge} opacity={ease(frame, chillAt, 10)}>chilled by its own expanding gas</Pill>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, chillAt, 10) }}>
            {[0, 1, 2, 3].map((i) => {
              const k = (frame / 40 + i / 4) % 1;
              return <path key={i} d={`M${920 + k * 340} ${640 + i * 60} h70 m-18 -14 l18 14 l-18 14`} stroke={B.aqua} strokeWidth={6} fill="none" opacity={1 - k} />;
            })}
          </svg>
        </>
      ) : null}
      <Ring frame={frame} opacity={ring} />
      <Pill x={700} y={240} align="center" color={B.aqua} size={34} opacity={ease(frame, lhcAt - 4, 10) * (1 - ease(frame, photoFrom, 8))}>the Large Hadron Collider</Pill>
      <Plate id="l08-dipole-close" from={photoFrom} to={heAt + 6} s0={1} s1={1.12} o0={[50, 50]} o1={[46, 46]} bright={0.8} />
      <Pill x={60} y={200} size={30} opacity={photo ? 1 : 0}>a real LHC magnet · on display in Belgrade, not in the tunnel</Pill>
      {frame >= heAt && frame < tunnelAt ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, heAt, 10) * (1 - ease(frame, tunnelAt - 8, 8)) }}>
            <circle cx={HX} cy={HY} r={330} fill="#132A3E" stroke={B.paper} strokeWidth={6} />
            {Array.from({ length: 64 }, (_, i) => {
              const a = (i / 64) * Math.PI * 2 + frame * 0.016 * (i % 2 ? 1 : 1);
              const r = 240 + (i % 4) * 24;
              const j = (1 - smooth) * 14;
              return <circle key={i} cx={HX + Math.cos(a) * r + Math.sin(frame * 0.7 + i) * j} cy={HY + Math.sin(a) * r + Math.cos(frame * 0.6 + i) * j} r={smooth > 0.5 ? 6 : 9} fill={B.aqua} opacity={0.9} />;
            })}
            <circle cx={HX - 110} cy={HY} r={84} fill="#050E18" stroke={B.gauge} strokeWidth={8} />
            <circle cx={HX + 110} cy={HY} r={84} fill="#050E18" stroke={B.gauge} strokeWidth={8} />
          </svg>
          <Tag x={HX - 110} y={HY - 22} align="center" color={B.gauge} size={26}>beam</Tag>
          <Tag x={HX + 110} y={HY - 22} align="center" color={B.gauge} size={26}>beam</Tag>
          <Card x={900} y={230} big="120 tonnes of helium" size={50} opacity={ease(frame, heAt + 4, 10)} />
          <Pill x={900} y={330} size={28} color={B.aqua} opacity={ease(frame, cryoAt, 10)}>largest cryogenic system in the world</Pill>
          <Pill x={900} y={400} size={28} opacity={ease(frame, weeksAt, 10)}>weeks just to cool down</Pill>
          <Pill x={900} y={470} size={28} color={B.gauge} opacity={ease(frame, superAt, 10)}>helium turns superfluid below 2.17 K</Pill>
        </>
      ) : null}
      <Card x={590} y={460} big="1.9 K" size={110} color={B.aqua} opacity={ease(frame, tunnelAt + 4, 10)} />
      <Pill x={700} y={240} align="center" color={B.aqua} size={32} opacity={ease(frame, tunnelAt, 10) * (1 - ease(frame, remAt, 8))}>a tunnel on Earth, colder than between the stars</Pill>
      <div style={{ opacity: ease(frame, backAt - 14, 8) }}>
        <Caption bottom={110} size={92} color={B.gauge}>remember this ring</Caption>
      </div>
    </RungShell>
  );
};

/** 3 · The Moon's dark craters. Pluto (#25, New Horizons) vs Hermite (#24, LRO mosaic; a 2010 statement); a labelled visualisation of the same kind of shadow. */
export const Moon: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const plutoAt = cue(t, 0, "Most people");
  const avgAt = cue(t, 0, "averaging");
  const nasaAt = lineAt(t, 1);
  const hermAt = cue(t, 1, "In Hermite");
  const minusAt = cue(t, 1, "minus two hundred");
  const coldestAt = lineAt(t, 2);
  const listAt = cue(t, 2, "So the coldest");
  const onMoon = cue(t, 2, "It was on");

  let log = mix(T.lhc, T.pluto, ease(frame, avgAt, 24));
  log = mix(log, T.hermite, ease(frame, minusAt, 20));
  const reading = frame >= minusAt ? "−248 °C" : frame >= hermAt - 10 ? "" : frame >= avgAt ? "about −232 °C" : "";
  const sub = frame >= minusAt ? "Hermite Crater · reported 2010" : frame >= hermAt - 10 ? undefined : frame >= avgAt ? "Pluto's average" : undefined;
  const chips: ChipSpec[] = frame >= listAt ? [{ kind: "REAL FOOTAGE", source: "LRO: NASA/GSFC/ASU · Pluto: NASA/JHU APL/SwRI · not to scale" }] : frame >= hermAt - 10 ? [{ kind: "REAL FOOTAGE", source: "NASA/GSFC/Arizona State University, LRO" }] : [{ kind: "REAL FOOTAGE", source: "NASA/JHU APL/SwRI, New Horizons" }];

  // Hermite's dark floor is at (50 %, 25 %) of the frame, name burned in; the camera's origin sits there, so the ring stays on it.
  const pinX = 960;
  const pinY = 270;
  return (
    <RungShell t={t} index={2} log={log} reading={reading} sub={sub} chips={chips}>
      <Plate id="l08-pluto" from={0} to={hermAt} s0={1.02} s1={1.3} o0={[40, 55]} o1={[52, 45]} bright={0.9} />
      {frame < plutoAt ? <Caption bottom={460} size={78} color={B.paper}>the coldest place in our solar system?</Caption> : null}
      <Pill x={60} y={200} size={28} opacity={ease(frame, plutoAt, 8) * (1 - ease(frame, nasaAt, 8))}>most people would say Pluto · New Horizons, 2015</Pill>
      <Card x={60} y={760} big="−232 °C" small="on average" size={90} color={B.aqua} opacity={ease(frame, avgAt, 10) * (1 - ease(frame, hermAt - 10, 8))} />
      <Pill x={60} y={200} size={30} color={B.gauge} opacity={ease(frame, nasaAt + 6, 8) * (1 - ease(frame, hermAt - 6, 8))}>2010: NASA reports something colder, much closer</Pill>
      <Plate id="l08-hermite" from={hermAt - 10} to={listAt + 6} s0={1} s1={1.25} o0={[50, 25]} bright={0.95} />
      {frame >= hermAt && frame < listAt + 6 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 1 - ease(frame, listAt, 8) }}>
          <circle cx={pinX} cy={pinY} r={120 + 8 * Math.sin(frame / 7)} stroke={B.aqua} strokeWidth={7} fill="none" />
        </svg>
      ) : null}
      <Pill x={60} y={200} size={28} opacity={ease(frame, hermAt, 8) * (1 - ease(frame, listAt, 8))}>Hermite Crater, near the Moon's north pole</Pill>
      <Card x={60} y={740} big="−248 °C" small="a spot in Hermite Crater" size={100} color={B.aqua} opacity={ease(frame, minusAt, 10) * (1 - ease(frame, listAt, 8))} />
      <Pill x={520} y={800} size={28} color={B.gauge} opacity={ease(frame, coldestAt, 8) * (1 - ease(frame, listAt, 8))}>coldest NASA said it had measured, at the time</Pill>
      {/* the two side by side, the real pictures: the place people guess and the reading's owner */}
      {frame >= listAt ? (
        <>
          <Plate id="l08-hermite" from={listAt} to={t.frames + 30} box={{ x: 440, y: 180, w: 900, h: 560 }} s0={1.3} s1={1.75} o0={[50, 25]} bright={0.95} />
          <Plate id="l08-pluto" from={listAt} to={t.frames + 30} box={{ x: 80, y: 300, w: 300, h: 300 }} s0={1} s1={1} bright={0.9} />
          <Pill x={80} y={612} size={28} opacity={ease(frame, listAt, 8)}>Pluto: −232 °C</Pill>
          <Pill x={440} y={752} size={28} color={B.aqua} opacity={ease(frame, listAt, 10)}>Hermite Crater: −248 °C</Pill>
        </>
      ) : null}
      <div style={{ opacity: ease(frame, onMoon, 8) }}>
        <Caption bottom={120} size={92} color={B.aqua}>it was on the Moon</Caption>
      </div>
    </RungShell>
  );
};

/** 4 · Earth's coldest. #27-#29. Blue Marble composite with a slow move to Vostok, a real inset, then the fork between two readings. */
export const EarthColdest: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const airAt = cue(t, 0, "minus eighty-nine");
  const vostokAt = cue(t, 0, "at Vostok");
  const julyAt = cue(t, 0, "in July");
  const satAt = lineAt(t, 1);
  const minusAt = cue(t, 1, "minus ninety-three");
  const recAt = cue(t, 1, "NASA called");
  const wmoAt = cue(t, 1, "The World");
  const whichAt = lineAt(t, 2);
  const climbAt = lineAt(t, 3);
  const freezerAt = cue(t, 3, "and we're");
  const hotAt = cue(t, 3, "From here");

  let log = mix(T.hermite, T.vostok, ease(frame, airAt, 24));
  log = mix(log, T.satellite, ease(frame, minusAt, 12) * (1 - ease(frame, wmoAt, 12)));
  const reading = frame >= minusAt && frame < wmoAt ? "−93.2 °C" : frame >= airAt ? "−89.2 °C" : "";
  const sub = frame >= minusAt && frame < wmoAt ? "satellite reading" : frame >= airAt ? "official air record" : undefined;

  // orthographic Blue Marble: Vostok (78.5 S, 106.8 E) sits 437 px right, 133 px down of the pole in the fetched frame (assets.md)
  const m = ease(frame, 0, 100);
  const s = mix(1, 1.45, m);
  const dx = -300 * m;
  const pinX = 960 + 437 * s + dx;
  const pinY = 540 + 133 * s;
  const map = 1 - ease(frame, whichAt - 6, 10);
  const ty = 800;
  const beam = (frame % 40) / 40;

  return (
    <RungShell t={t} index={3} log={log} reading={reading} sub={sub} chips={[map > 0.5 ? { kind: "SATELLITE COMPOSITE", source: "NASA Blue Marble · projection Dave Pape" } : ILLU(frame >= climbAt ? "the thermometer · log scale" : "two readings, drawn")]} bracket={frame >= climbAt ? { from: T.coldest, to: T.vostok, opacity: ease(frame, climbAt, 10) } : undefined}>
      {map > 0 ? (
        <AbsoluteFill style={{ opacity: map, backgroundColor: "#05082C", overflow: "hidden" }}>
          <Img src={staticFile("assets/l08-antarctica.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover", transform: `translateX(${dx}px) scale(${s})`, transformOrigin: "50% 50%", filter: "brightness(0.9)" }} />
        </AbsoluteFill>
      ) : null}
      <Pill x={60} y={200} size={28} opacity={map * (1 - ease(frame, julyAt, 8))}>Antarctica, from satellite data</Pill>
      {frame >= vostokAt && map > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: map }}>
          {frame >= minusAt ? <ellipse cx={pinX - 60} cy={pinY - 110} rx={170} ry={90} fill={B.aqua} opacity={0.3 * ease(frame, minusAt, 12)} stroke={B.aqua} strokeWidth={4} /> : null}
          <circle cx={pinX} cy={pinY} r={18} fill={B.tease} stroke={B.paper} strokeWidth={5} />
          <circle cx={pinX} cy={pinY} r={18 + ((frame % 40) / 40) * 50} fill="none" stroke={B.tease} strokeWidth={4} opacity={1 - (frame % 40) / 40} />
        </svg>
      ) : null}
      {frame >= vostokAt ? <Pill x={pinX + 160} y={pinY + 30} align="right" size={30} opacity={map}>{frame >= minusAt ? "Vostok and the plateau · marked roughly" : "Vostok Station · marked roughly"}</Pill> : null}
      <Card x={60} y={740} big="−89.2 °C" small={frame >= julyAt ? "official air record · July 1983" : "official air record"} size={90} color={B.aqua} opacity={ease(frame, airAt, 10) * map} />
      <Plate id="l08-vostok" ext="png" from={julyAt} to={satAt} box={{ x: 60, y: 190, w: 500, h: 282 }} s0={1} s1={1.08} bright={1} />
      <Pill x={60} y={480} size={24} opacity={ease(frame, julyAt, 10) * (1 - ease(frame, satAt, 8))}>real: Vostok's new building, 2024 · AARI, CC BY 4.0</Pill>
      <Card x={60} y={200} big="−93.2 °C" small="the plateau nearby · August 2010" size={90} color={B.paper} opacity={ease(frame, minusAt, 10) * map} />
      <Pill x={60} y={380} size={30} color={B.gauge} opacity={ease(frame, recAt, 8) * map}>NASA called it a new record</Pill>
      <Pill x={60} y={445} size={30} color={B.aqua} opacity={ease(frame, wmoAt, 8) * map}>the WMO still lists −89.2 °C</Pill>
      {frame >= whichAt - 6 && frame < climbAt + 6 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: (1 - map) * (1 - ease(frame, climbAt - 4, 8)) }}>
            <rect x={100} y={ty} width={1260} height={80} rx={12} fill="#DCEBF5" />
            <rect x={320} y={ty - 180} width={80} height={120} rx={8} fill="none" stroke={B.paper} strokeWidth={6} />
            <line x1={360} y1={ty - 60} x2={360} y2={ty} stroke={B.paper} strokeWidth={6} />
            {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={180 + ((rnd(i) * 400 + frame * 1.6) % 400)} cy={ty - 40 - rnd(i + 30) * 200} r={6} fill={B.aqua} />)}
            <rect x={960} y={250} width={100} height={46} rx={8} fill={B.paper} />
            <rect x={880} y={264} width={70} height={18} fill={B.gauge} />
            <rect x={1070} y={264} width={70} height={18} fill={B.gauge} />
            <path d={`M1010 296 L920 ${ty} H1100 Z`} fill={B.gauge} opacity={0.14} />
            <circle cx={1010} cy={mix(296, ty, beam)} r={9} fill={B.gauge} />
          </svg>
          <Pill x={360} y={ty - 250} align="center" color={B.aqua} size={32} opacity={(1 - map) * (1 - ease(frame, climbAt - 4, 8))}>the air: −89.2 °C</Pill>
          <Pill x={1160} y={400} color={B.gauge} size={32} opacity={(1 - map) * (1 - ease(frame, climbAt - 4, 8))}>a satellite: −93.2 °C</Pill>
          <div style={{ opacity: ease(frame, whichAt + 10, 8) * (1 - ease(frame, climbAt - 4, 8)) }}>
            <Caption bottom={130} size={60} color={B.paper}>depends what you are measuring</Caption>
          </div>
        </>
      ) : null}
      {frame >= climbAt ? (
        <>
          <Card x={160} y={260} big="almost 13 powers of ten" size={84} opacity={ease(frame, climbAt, 10)} />
          <Pill x={160} y={400} size={36} color={B.aqua} opacity={ease(frame, freezerAt, 10)}>and still at −89 °C</Pill>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, hotAt - 10, 12) }}>
            {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${160 + i * 90} ${1000 - ((frame * 5 + i * 67) % 340)} q 18 -30 0 -60`} stroke={B.tease} strokeWidth={8} fill="none" opacity={0.6} />)}
          </svg>
          <div style={{ opacity: ease(frame, hotAt, 8) }}>
            <Caption bottom={340} size={110} color={B.tease}>from here, it gets hot</Caption>
          </div>
        </>
      ) : null}
    </RungShell>
  );
};
