import React from "react";
import { useCurrentFrame } from "remotion";
import { Tag } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { Scale } from "../gauge";
import { CaptionPop, Card, Clip, PillTag, Photo, SkyShell, clamp01, lin, mix } from "./shell";

const SCALE_LOW: Scale[] = [{ at: 0, top: 86 }];

/**
 * 4 · Spy planes. Lines 0-3. Sources #12, #14, #15.
 * 0: ER-2, 1981 photo cropped clear of its paper caption; a drawn bar fills to 95 % · 1: flight clip of the ER-2 (2023) with arrows
 * looking down · 2: SR-71B panning across · 3: the wing against thinning dots.
 */
export const SpyPlanes: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const km21 = within(t, 0, 0.5);
  const pct = within(t, 0, 0.82);
  const look = lineAt(t, 1);
  const sr = lineAt(t, 2);
  const past = within(t, 2, 0.32);
  const mach = within(t, 2, 0.68);
  const wings = lineAt(t, 3);
  const none = within(t, 3, 0.62);

  const clip = ease(frame, look, 10) * (1 - ease(frame, sr - 6, 8));
  const srK = ease(frame, sr - 4, 8) * (1 - ease(frame, wings - 4, 8));
  const dia = ease(frame, wings, 12);
  const bar = ease(frame, pct, 30);
  const credit = dia > 0.5 ? { kind: "illustration" as const, source: "a wing in thinning air, drawn" } : srK > 0.5 ? { kind: "real" as const, source: "NASA, 1991" } : clip > 0.5 ? { kind: "real" as const, source: "NASA Armstrong, 2023" } : { kind: "real" as const, source: "NASA, 1981" };
  return (
    <SkyShell
      t={t}
      index={3}
      climb={[{ at: 0, km: 11.3, reading: "11,300 M" }, { at: km21, km: 21, reading: "21 KM", sub: "NASA ER-2" }, { at: past, km: 25.9, reading: "25.9 KM", sub: "SR-71" }]}
      scale={SCALE_LOW}
      marks={[{ km: 21, label: "ER-2", at: km21 }, { km: 25.9, label: "SR-71", at: past }]}
      credit={credit}
      drawn={clip < 0.5 && srK < 0.5 && dia < 0.5 && frame >= pct ? "the bar is drawn" : null}
    >
      <Photo id="l05-er2" scale={1.14 + 0.1 * lin(frame, 0, look)} origin="50% 0%" brightness={0.92} />
      <Clip id="l05-clip-er2" seconds={12} opacity={clip} brightness={0.9} />
      <Photo id="l05-sr71b" opacity={srK} scale={1.3 - 0.2 * lin(frame, sr, wings)} origin={`${mix(95, 10, lin(frame, sr, wings))}% 45%`} brightness={0.9} />
      {clip < 0.5 && srK < 0.5 && dia < 0.5 ? <PillTag x={60} y={206} size={30}>NASA's ER-2 research plane</PillTag> : null}
      {frame >= pct && frame < look ? (
        <div style={{ position: "absolute", left: 160, top: 860, width: 1160, height: 60, borderRadius: 12, background: "rgba(5,14,24,0.85)", outline: "3px solid #fff", overflow: "hidden", opacity: ease(frame, pct, 8) }}>
          <div style={{ width: `${95 * bar}%`, height: "100%", background: B.gauge }} />
          <div style={{ position: "absolute", left: 24, top: 6, fontFamily: F.headline, fontSize: 40, color: B.ink, whiteSpace: "nowrap" }}>ABOUT 95 % OF THE AIR IS BELOW IT</div>
        </div>
      ) : null}
      {clip > 0 ? <PillTag x={60} y={206} size={30} opacity={clip}>The ER-2 in flight, 2023</PillTag> : null}
      {clip > 0.5 ? <CaptionPop bottom={130}>looking down at the air, not through it</CaptionPop> : null}
      {srK > 0.5 ? <PillTag x={60} y={206} size={30}>NASA's SR-71B Blackbird</PillTag> : null}
      {frame >= mach && frame < wings ? <Card x={120} y={760} size={100} big="OVER 3 TIMES" small="THE SPEED OF SOUND" opacity={ease(frame, mach, 8)} /> : null}
      {dia > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: dia, background: "#061225" }}>
          {Array.from({ length: 150 }, (_, i) => {
            const a = Math.sin(i * 12.9898) * 43758.5453;
            const b = Math.sin(i * 78.233) * 12543.123;
            const x = ((a - Math.floor(a)) * 1400 + frame * 3) % 1400;
            const f = b - Math.floor(b);
            const y = 1000 - Math.pow(f, 2.6) * 820;
            const fade = clamp01(1 - ease(frame, wings, 200) * (1 - (y - 180) / 820));
            return <circle key={i} cx={x} cy={y - 40 * lin(frame, wings, t.frames)} r={5} fill="#9BD8F0" opacity={fade * 0.9} />;
          })}
          <g transform={`translate(650 ${540 - 60 * lin(frame, wings, t.frames)})`} fill={B.paper}>
            <path d="M-300 20 Q-120 -46 300 -6 L300 6 Q-120 -6 -300 26 Z" />
          </g>
        </svg>
      ) : null}
      {dia > 0.5 ? <PillTag x={520} y={250} size={38} opacity={ease(frame, wings + 6, 8)}>wings need air. jets need air.</PillTag> : null}
      {frame >= none ? <CaptionPop bottom={150}>hardly any left</CaptionPop> : null}
    </SkyShell>
  );
};

/**
 * 5 · Balloons. Lines 0-6. Sources #5, #16, #18, #19, #21.
 * 0: McMurdo balloon, named as "not the jump balloons" from its first frame, and a race SR-71 against weather balloon, to scale ·
 * 1: a weather balloon swelling 1.5 m to 8 m · 2: the stratosphere band · 3: squeezed to two pennies · 4-5: PUEO balloon with the two
 * jumps flagged on a to-scale ladder · 6: the record flag on the same ladder.
 */
export const Balloons: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const ordinary = within(t, 0, 0.35);
  const beats = within(t, 0, 0.82);
  const swell = lineAt(t, 1);
  const wide8 = within(t, 1, 0.32);
  const past35 = within(t, 1, 0.8);
  const ozone = lineAt(t, 2);
  const ninety = within(t, 2, 0.4);
  const squeeze = lineAt(t, 3);
  const pennies = within(t, 3, 0.78);
  const two = lineAt(t, 4);
  const felix = within(t, 4, 0.36);
  const alan = within(t, 4, 0.72);
  const free = lineAt(t, 5);
  const top = lineAt(t, 6);
  const rec = within(t, 6, 0.55);

  const race = ease(frame, ordinary, 10) * (1 - ease(frame, swell - 4, 6));
  const raceK = ease(frame, ordinary + 4, 50);
  const swK = ease(frame, swell, 8) * (1 - ease(frame, ozone - 4, 6));
  const r = mix(30, 160, ease(frame, swell + 40, Math.max(30, past35 - swell - 40)));
  const oz = ease(frame, ozone, 10) * (1 - ease(frame, two - 4, 6));
  const sq = ease(frame, squeeze + 6, 40);
  const lad = ease(frame, two, 10);
  const ice = 1 - ease(frame, swell - 4, 6);
  const pueo = ease(frame, two - 4, 8);
  const yL = (km: number) => 960 - km * 12.5; // the ladder's scale: 53.7 km = 671 px
  const flags = [
    { at: felix, km: 38.97, text: "Felix Baumgartner, 2012: almost 39 km", c: B.paper, dx: 0 },
    { at: alan, km: 41.4, text: "Alan Eustace, 2014: about 41 km", c: B.paper, dx: 0 },
    { at: rec, km: 53.7, text: "Japanese balloon, 2013: 53.7 km, nobody on board", c: B.gauge, dx: 0 },
  ];
  const credit = race > 0.5 || swK > 0.5 || oz > 0.5
    ? { kind: "illustration" as const, source: oz > 0.5 ? "the ozone, drawn" : race > 0.5 ? "heights to scale" : "balloon sizes to scale" }
    : pueo > 0.5
      ? { kind: "real" as const, source: "NASA / S. Battaion" }
      : { kind: "real" as const, source: "NASA Goddard, 2011" };
  return (
    <SkyShell
      t={t}
      index={4}
      climb={[
        { at: 0, km: 25.9, reading: "25.9 KM" },
        { at: past35, km: 35, reading: "35 KM+", sub: "WEATHER BALLOON" },
        { at: felix, km: 38.97, reading: "ALMOST 39 KM" },
        { at: alan, km: 41.4, reading: "ABOUT 41 KM" },
        { at: rec, km: 53.7, reading: "53.7 KM", sub: "BALLOON RECORD" },
      ]}
      scale={SCALE_LOW}
      marks={[{ km: 35, label: "weather balloon", at: past35 }, { km: 53.7, label: "balloon record", at: rec }]}
      credit={credit}
      drawn={pueo > 0.5 && lad > 0.5 ? "the ladder is drawn" : null}
    >
      <Photo id="l05-balloon-ice" opacity={ice} scale={1.05 + 0.2 * lin(frame, 0, swell)} origin="40% 60%" brightness={mix(0.92, 0.2, race)} />
      {pueo > 0 ? <Photo id="l05-balloon-pueo" opacity={pueo} scale={1.04 + 0.14 * lin(frame, two, t.frames)} origin="10% 0%" pos="50% 0%" brightness={0.62} /> : null}
      {ice > 0.5 && race < 0.5 ? <PillTag x={60} y={206} size={30} color={B.gauge}>A NASA science balloon, Antarctica, not the jump balloons</PillTag> : null}
      {race > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: race }}>
          <line x1={260} y1={930} x2={1140} y2={930} stroke={B.paper} strokeWidth={4} />
          <rect x={430} y={930 - 25.9 * 19 * raceK} width={70} height={25.9 * 19 * raceK} fill={B.mute} />
          <rect x={860} y={930 - 35 * 19 * raceK} width={70} height={35 * 19 * raceK} fill={B.gauge} />
          <circle cx={895} cy={930 - 35 * 19 * raceK - 44} r={40} fill="#F2F6F8" />
          <path d={`M455 ${930 - 25.9 * 19 * raceK - 44} L435 ${930 - 25.9 * 19 * raceK - 6} H 495 L475 ${930 - 25.9 * 19 * raceK - 44} Z`} fill={B.paper} />
        </svg>
      ) : null}
      {race > 0.5 ? <PillTag x={465} y={950} size={30} align="center" color={B.paper}>SR-71: 25.9 km</PillTag> : null}
      {race > 0.5 && frame >= beats ? <PillTag x={895} y={950} size={30} align="center" color={B.gauge} opacity={ease(frame, beats, 8)}>weather balloon wins</PillTag> : null}

      {swK > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: swK, background: "#071A33" }}>
          <circle cx={700} cy={560} r={r} fill="#F2F6F8" />
          <path d={`M700 ${560 + r} V ${560 + r + 120}`} stroke={B.paper} strokeWidth={4} />
          <rect x={688} y={560 + r + 120} width={24} height={18} fill={B.tease} />
          {/* a 1.5 m reference beside it, same scale: 8 m = 320 px across */}
          <path d={`M1120 ${560 - 30} V ${560 + 30}`} stroke={B.gauge} strokeWidth={8} strokeLinecap="round" />
        </svg>
      ) : null}
      {swK > 0.5 ? <Tag x={1150} y={540} size={34} color={B.gauge}>1.5 m at launch</Tag> : null}
      {swK > 0.5 && frame >= wide8 ? <Card x={200} y={260} size={84} big="UP TO 8 M WIDE" opacity={ease(frame, wide8, 8)} /> : null}

      {oz > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: oz, background: "#071A33" }}>
          {/* the band narrows from the whole stratosphere to one thin line, then pennies replace it */}
          <rect x={120} y={mix(300, 540, sq)} width={1160} height={mix(420, 14, sq)} fill={B.aqua} opacity={mix(0.3, 1, sq)} />
          {frame >= pennies
            ? [0, 1].map((k) => <ellipse key={k} cx={700} cy={620 - k * 26} rx={170} ry={60} fill="#B46A3C" stroke="#7B4120" strokeWidth={5} opacity={ease(frame, pennies + k * 6, 6)} />)
            : null}
        </svg>
      ) : null}
      {oz > 0.5 && frame < squeeze ? <PillTag x={160} y={320} size={36} color={B.aqua}>the stratosphere</PillTag> : null}
      {oz > 0.5 && frame >= ninety && frame < squeeze ? <Card x={420} y={460} size={96} big="90 % OF THE OZONE" opacity={ease(frame, ninety, 8)} /> : null}
      {frame >= squeeze && oz > 0.5 ? <PillTag x={160} y={300} size={36} opacity={ease(frame, squeeze, 8)}>all of it, at sea-level pressure</PillTag> : null}
      {frame >= pennies && oz > 0.5 ? <Card x={400} y={740} size={84} big="TWO PENNIES THICK" opacity={ease(frame, pennies, 8)} /> : null}

      {lad > 0 ? (
        <>
          <PillTag x={60} y={206} size={30} color={B.gauge} opacity={pueo}>Another NASA balloon, not a jump balloon</PillTag>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: lad }}>
            <line x1={150} y1={yL(0)} x2={150} y2={yL(53.7)} stroke={B.paper} strokeWidth={6} />
            {flags.map((f) => (frame >= f.at ? <circle key={f.km} cx={150} cy={yL(f.km)} r={13} fill={f.c} opacity={ease(frame, f.at, 8)} /> : null))}
          </svg>
          {flags.map((f, i) => (frame >= f.at ? <PillTag key={f.km} x={186} y={yL(f.km) - (i === 0 ? 8 : 34)} size={32} color={f.c} opacity={ease(frame, f.at, 8)}>{f.text}</PillTag> : null))}
        </>
      ) : null}
      {frame >= free && frame < top ? <CaptionPop bottom={150} size={60}>that footage isn't free to show</CaptionPop> : null}
    </SkyShell>
  );
};

/**
 * 6 · Meteors and night-shining clouds. Lines 0-5. Sources #23, #24, #25.
 * 0: the ISS meteor frame, pushing in on the streak, with a drawn ring · 1: back out; 44 tonnes · 2: drawn rain over it · 3: noctilucent
 * clouds · 4: dust rising from falling streaks into a cloud band · 5: a dashed line drawn across the dark.
 */
export const Meteors: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const streak = within(t, 0, 0.3);
  const down = within(t, 0, 0.62);
  const here = lineAt(t, 1);
  const thick = within(t, 1, 0.34);
  const tonnes = within(t, 1, 0.7);
  const rain = lineAt(t, 2);
  const clouds = lineAt(t, 3);
  const high = within(t, 3, 0.62);
  const dust = within(t, 3, 0.82);
  const remains = lineAt(t, 4);
  const lineUp = lineAt(t, 5);

  const push = ease(frame, streak - 10, 40) * (1 - ease(frame, here, 30));
  const ring = ease(frame, streak, 8) * (1 - ease(frame, here, 10));
  const rainK = ease(frame, rain, 8) * (1 - ease(frame, clouds - 4, 6));
  const nlc = ease(frame, clouds - 4, 10) * (1 - ease(frame, lineUp - 4, 8));
  const dustK = ease(frame, remains, 10) * (1 - ease(frame, lineUp - 4, 8));
  const final = ease(frame, lineUp, 10);
  const SX = 0.552 * 1920; // the streak in the plate: about 55 % across, 48 % down
  const SY = 0.48 * 1080;
  const zoom = 1 + 1.1 * push;
  const dimMeteor = mix(0.92, 0.45, rainK);
  const credit = final > 0.5 ? { kind: "illustration" as const, source: "the line, drawn" } : nlc > 0.5 ? { kind: "real" as const, source: "NASA, ISS 2008" } : { kind: "real" as const, source: "NASA, ISS crew, 2011" };
  return (
    <SkyShell
      t={t}
      index={5}
      climb={[{ at: 0, km: 53.7, reading: "53.7 KM" }, { at: here, km: 67, reading: "50 TO 85 KM", sub: "WHERE METEORS BURN" }, { at: high, km: 86, reading: "UP TO 86 KM", sub: "NIGHT-SHINING CLOUDS" }]}
      scale={SCALE_LOW}
      marks={[{ km: 86, label: "night clouds", at: high }]}
      credit={credit}
      drawn={(ring > 0.5 && "the ring is drawn") || (rainK > 0.5 && "the streaks are drawn") || (dustK > 0.5 && "the dust is drawn") || null}
    >
      <Photo id="l05-meteor" opacity={1 - nlc} scale={zoom * (1.0 + 0.05 * lin(frame, here, clouds))} origin="55.2% 48%" brightness={dimMeteor} />
      <Photo id="l05-nlc" opacity={nlc} scale={1.03 + 0.14 * lin(frame, clouds, lineUp)} origin="50% 33%" brightness={0.98} />
      {ring > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ring }}>
          <circle cx={SX} cy={SY} r={mix(40, 110, push)} stroke={B.gauge} strokeWidth={7} fill="none" />
        </svg>
      ) : null}
      {frame >= streak && frame < here ? <PillTag x={SX} y={SY + 140} size={36} align="center" color={B.gauge} opacity={ease(frame, streak, 8)}>a shooting star</PillTag> : null}
      {frame >= down && frame < here ? <PillTag x={60} y={206} size={32} opacity={ease(frame, down, 8)}>The camera is above it, on the Space Station</PillTag> : null}
      {frame >= thick && frame < rain ? <PillTag x={60} y={206} size={32} opacity={ease(frame, thick, 8)}>almost no air, but enough to slow a rock</PillTag> : null}
      {frame >= tonnes && frame < rain ? <Card x={90} y={700} size={110} big="44 TONNES A DAY" opacity={ease(frame, tonnes, 8)} /> : null}
      {rainK > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: rainK }}>
          {Array.from({ length: 34 }, (_, i) => {
            const a = Math.sin(i * 12.9898) * 43758.5453;
            const x = (a - Math.floor(a)) * 1400;
            const y = ((i * 97 + frame * 7) % 900) + 120;
            return <line key={i} x1={x} y1={y} x2={x - 26} y2={y + 60} stroke="#FFE9B0" strokeWidth={4} strokeLinecap="round" opacity={0.85} />;
          })}
        </svg>
      ) : null}
      {nlc > 0.5 && frame < remains ? <PillTag x={60} y={206} size={32} opacity={ease(frame, clouds + 6, 8)}>Noctilucent, "night-shining" clouds, from the Space Station</PillTag> : null}
      {frame >= dust && frame < remains ? <CaptionPop bottom={130} size={60}>grown on meteor dust</CaptionPop> : null}
      {dustK > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: dustK }}>
          {Array.from({ length: 70 }, (_, i) => {
            const a = Math.sin(i * 39.1) * 9121.7;
            const x = (a - Math.floor(a)) * 1400;
            const k = ((frame * 0.006 + i * 0.037) % 1);
            return <circle key={i} cx={x} cy={mix(150, 370, k)} r={4} fill="#FFE9B0" opacity={0.9 * (1 - k * 0.3)} />;
          })}
        </svg>
      ) : null}
      {frame >= remains && frame < lineUp ? <CaptionPop bottom={130} size={60}>the remains of shooting stars</CaptionPop> : null}
      {final > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: final, background: "#040B1A" }}>
          <line x1={80} y1={560} x2={80 + 1240 * ease(frame, lineUp + 6, 40)} y2={560} stroke={B.gauge} strokeWidth={10} strokeDasharray="44 22" />
        </svg>
      ) : null}
      {final > 0.5 ? <PillTag x={700} y={470} size={40} align="center" opacity={ease(frame, lineUp + 30, 10)}>on every diagram of the sky</PillTag> : null}
    </SkyShell>
  );
};

/**
 * 7 · Where space begins. Lines 0-6. Sources #26, #27, #28, #28c.
 * The gauge rescales here for the first time. 0: X-15 #2 igniting, a wing's lift fading · 1: the round number · 2-3: the zoomed bar
 * 70-110 km, the 80 km and 50-mile lines · 4: the five names between the lines · 5: White's flight, a dot at 95; Walker's at 108 · 6: the
 * lines dissolve, dots keep rising past them.
 */
export const SpaceLine: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const heard = within(t, 0, 0.1);
  const calc = within(t, 0, 0.55);
  const awkward = lineAt(t, 1);
  const round = within(t, 1, 0.72);
  const agree = lineAt(t, 2);
  const mcd = within(t, 2, 0.32);
  const near80 = within(t, 2, 0.78);
  const usa = lineAt(t, 3);
  const pilots = lineAt(t, 4);
  const five = within(t, 4, 0.3);
  const white = lineAt(t, 5);
  const inSpace = within(t, 5, 0.28);
  const walker = within(t, 5, 0.72);
  const noWall = lineAt(t, 6);
  const keeps = within(t, 6, 0.5);

  const bar = ease(frame, awkward + 10, 14);
  const y = (km: number) => 900 - (km - 70) * 16.5; // 70 km to 110 km, full height
  const line100 = ease(frame, awkward + 14, 18);
  const line80 = ease(frame, near80, 18);
  const dissolve = 1 - ease(frame, noWall, 40);
  const NAMES = ["White", "Rushworth", "McKay", "Dana", "Adams"]; // #28
  const credit = bar > 0.5 ? { kind: "illustration" as const, source: "the lines, to scale" } : { kind: "real" as const, source: "NASA, X-15 #2" };
  return (
    <SkyShell
      t={t}
      index={6}
      climb={[
        { at: 0, km: 86, reading: "UP TO 86 KM" },
        { at: heard, km: 100, reading: "100 KM", sub: "THE FAMOUS LINE" },
        { at: walker, km: 108, reading: "108 KM", sub: "JOE WALKER, 1963" },
      ]}
      scale={[{ at: 0, top: 86 }, { at: heard, top: 100, say: "SCALE CHANGE: NOW 0 TO 100 KM" }, { at: walker, top: 108, say: "SCALE CHANGE: NOW 0 TO 108 KM" }]}
      marks={[{ km: 100, label: "100 km line", at: heard }, { km: 80, label: "50 miles", at: usa }]}
      credit={credit}
    >
      <Photo id="l05-x15" opacity={1 - bar} scale={1.04 + 0.2 * lin(frame, 0, awkward)} origin="20% 50%" brightness={0.88} />
      {bar < 0.5 ? <PillTag x={60} y={206} size={30}>The X-15 rocket plane, just after release</PillTag> : null}
      {frame >= calc && bar < 0.5 ? <CaptionPop bottom={130} size={60}>where a wing stops holding anything up</CaptionPop> : null}
      {bar > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: bar, background: "#050F20" }}>
          <rect x={200} y={y(110)} width={60} height={y(70) - y(110)} rx={10} fill="url(#l05g)" />
          <defs>
            <linearGradient id="l05g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#02040A" />
              <stop offset="1" stopColor="#1B3F7C" />
            </linearGradient>
          </defs>
          <line x1={150} y1={y(100)} x2={150 + 1160 * line100} y2={y(100)} stroke={B.gauge} strokeWidth={7} strokeDasharray={dissolve < 1 ? "4 24" : undefined} opacity={0.2 + 0.8 * dissolve} />
          {frame >= near80 ? <line x1={150} y1={y(80)} x2={150 + 1160 * line80} y2={y(80)} stroke={B.aqua} strokeWidth={7} strokeDasharray={dissolve < 1 ? "4 24" : undefined} opacity={0.2 + 0.8 * dissolve} /> : null}
          {frame >= pilots && frame < noWall ? <rect x={150} y={y(100)} width={1160} height={y(80) - y(100)} fill={B.tease} opacity={0.13 * ease(frame, pilots, 12)} /> : null}
          {frame >= white ? <circle cx={230} cy={y(95)} r={15} fill={B.tease} stroke={B.paper} strokeWidth={4} opacity={ease(frame, white, 8)} /> : null}
          {frame >= walker ? <circle cx={230} cy={y(108)} r={15} fill={B.gauge} stroke={B.paper} strokeWidth={4} opacity={ease(frame, walker, 8)} /> : null}
          {frame >= noWall
            ? Array.from({ length: 40 }, (_, i) => {
                const a = Math.sin(i * 12.9898) * 43758.5453;
                const x = 300 + (a - Math.floor(a)) * 1000;
                const k = (frame * 0.004 + i * 0.05) % 1;
                return <circle key={i} cx={x} cy={mix(960, 170, k)} r={5} fill="#9BD8F0" opacity={0.8 * ease(frame, noWall, 20)} />;
              })
            : null}
        </svg>
      ) : null}
      {bar > 0.5 ? (
        <>
          <PillTag x={300} y={y(100) - 56} size={34} color={B.gauge} opacity={dissolve}>100 km</PillTag>
          {frame >= awkward && frame < mcd ? <Card x={720} y={y(100) + 26} size={64} big="CLOSE TO 100" small={frame >= round ? `"VERY ROUND": THE FAI'S WORDS` : "THE CALCULATION"} opacity={ease(frame, awkward + 8, 8)} /> : null}
          {frame >= agree && frame < pilots ? <PillTag x={720} y={y(100) + 40} size={34} opacity={ease(frame, agree, 8)}>{frame >= mcd ? "Jonathan McDowell, astronomer, 2018" : "not everyone agrees"}</PillTag> : null}
          {frame >= near80 ? <PillTag x={300} y={y(80) + 16} size={34} color={B.aqua} opacity={ease(frame, near80, 8) * dissolve}>about 80 km</PillTag> : null}
          {frame >= usa ? <PillTag x={560} y={y(80) + 16} size={34} color={B.aqua} opacity={ease(frame, usa, 8) * dissolve}>50 miles: the US line, for decades</PillTag> : null}
          {frame >= five && frame < white
            ? NAMES.map((n, i) => (
                <div key={n} style={{ position: "absolute", left: 340 + (i % 2) * 460, top: y(99) + 30 + Math.floor(i / 2) * 56, opacity: ease(frame, five + i * 10, 8), fontFamily: F.ui, fontWeight: 800, fontSize: 36, color: B.paper, whiteSpace: "nowrap" }}>{n}</div>
              ))
            : null}
          {frame >= five && frame < white ? <PillTag x={340} y={640} size={30} color={B.tease} opacity={ease(frame, five + 50, 8)}>astronauts on one line only</PillTag> : null}
          {frame >= white && frame < noWall ? <PillTag x={270} y={y(95) - 24} size={34} color={B.tease} opacity={ease(frame, white, 8)}>Bob White, 95 km, 1962</PillTag> : null}
          {frame >= inSpace && frame < noWall ? <Card x={830} y={y(95) - 40} size={64} big="IN SPACE?" small={frame >= inSpace + 40 ? "IT DEPENDS WHOSE LINE" : undefined} color={B.tease} ink={B.paper} opacity={ease(frame, inSpace, 8)} /> : null}
          {frame >= walker && frame < noWall ? <PillTag x={270} y={y(108) - 2} size={34} color={B.gauge} opacity={ease(frame, walker, 8)}>Joe Walker, 108 km: past every line</PillTag> : null}
          {frame >= noWall && frame < keeps ? <CaptionPop bottom={420} size={96}>no wall, no edge</CaptionPop> : null}
          {frame >= keeps ? <CaptionPop bottom={420} size={84}>the air keeps going</CaptionPop> : null}
        </>
      ) : null}
    </SkyShell>
  );
};
