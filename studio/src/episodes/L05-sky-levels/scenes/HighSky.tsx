import React from "react";
import { useCurrentFrame } from "remotion";
import { Tag } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { CaptionPop, Card, Clip, PillTag, Photo, SkyShell, clamp01, lin, mix } from "./shell";

const EarthDisc: React.FC<{ cx: number; cy: number; r: number; spin?: number }> = ({ cx, cy, r, spin = 0 }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="#1B6FA8" />
    <g transform={`rotate(${spin} ${cx} ${cy})`} fill="#4F9A63" opacity={0.85}>
      <ellipse cx={cx - r * 0.35} cy={cy - r * 0.3} rx={r * 0.32} ry={r * 0.22} />
      <ellipse cx={cx + r * 0.3} cy={cy + r * 0.25} rx={r * 0.26} ry={r * 0.34} />
    </g>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#9BD8F0" strokeWidth={Math.max(2, r * 0.02)} />
  </g>
);

/**
 * 8 · The Space Station. Lines 0-5. Sources #30, #31, #32, #33, #37.
 * Second rescale. 0: whole ISS, then a true-scale globe with the Station 1 cm off it · 1: gravity bar at 90 % · 2: orbit clip, and a drawn
 * falling-but-missing arc · 3: drawn air and a falling height line · 4: aurora from the ISS · 5: the 100 km line against 415.
 */
export const Station: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const km415 = within(t, 0, 0.3);
  const desk = within(t, 0, 0.58);
  const oneCm = within(t, 0, 0.84);
  const gravity = lineAt(t, 1);
  const ninety = within(t, 1, 0.55);
  const falls = lineAt(t, 2);
  const sideways = within(t, 2, 0.42);
  const eight = within(t, 2, 0.62);
  const air = lineAt(t, 3);
  const drags = within(t, 3, 0.42);
  const years = within(t, 3, 0.72);
  const aurora = lineAt(t, 4);
  const band = within(t, 4, 0.3);
  const past = lineAt(t, 5);

  const globe = ease(frame, desk, 12) * (1 - ease(frame, gravity - 4, 8));
  const clip = ease(frame, falls - 2, 8) * (1 - ease(frame, air - 4, 6));
  const arc = ease(frame, sideways, 10) * clip;
  const issK = (1 - globe) * (frame < falls ? 1 : 0) + (frame >= air - 4 && frame < aurora ? 1 : 0);
  const auroraK = ease(frame, aurora - 4, 8) * (1 - ease(frame, past - 4, 8));
  const finalK = ease(frame, past, 10);
  const drag = ease(frame, air + 10, 12) * (1 - ease(frame, aurora - 4, 6));
  const R = 370;
  const gCx = 700;
  const gCy = 620 + R * 0.1;
  const issR = R * (1 + 415 / 6371); // true: 415 km over 6,371 km (#29, #30)
  const ang = -Math.PI / 2 + 0.18 * Math.sin(frame / 90);
  const credit = finalK > 0.5 ? { kind: "illustration" as const, source: "to scale" } : auroraK > 0.5 ? { kind: "real" as const, source: "NASA, ISS 2024" } : clip > 0.5 ? { kind: "real" as const, source: "NASA Earth Observatory: photo sequence" } : globe > 0.5 ? { kind: "illustration" as const, source: "to scale" } : { kind: "real" as const, source: "NASA, 2011" };
  return (
    <SkyShell
      t={t}
      index={7}
      climb={[{ at: 0, km: 108, reading: "108 KM" }, { at: km415, km: 415, reading: "415 KM", sub: "THE SPACE STATION" }]}
      scale={[{ at: 0, top: 108 }, { at: km415, top: 415, say: "SCALE CHANGE: NOW 0 TO 415 KM" }, { at: band, top: 500, say: "SCALE CHANGE: NOW 0 TO 500 KM" }]}
      marks={[{ km: 415, label: "Space Station", at: km415 }, { km: 500, label: "top of the aurora", at: band }]}
      credit={credit}
      drawn={arc > 0.5 ? "the orbit is drawn" : drag > 0.5 && issK > 0.5 ? "the air is drawn" : null}
    >
      {issK > 0 ? <Photo id="l05-iss" opacity={clamp01(issK)} scale={1.04 + 0.16 * lin(frame, frame < falls ? 0 : air, frame < falls ? desk : aurora)} origin="50% 55%" brightness={0.9} /> : null}
      {issK > 0.5 && frame < desk ? <PillTag x={60} y={206} size={30}>The whole Station, seen from a departing shuttle</PillTag> : null}
      {globe > 0 ? (
        <svg width={1400} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: globe, background: "#040B1A" }}>
          <EarthDisc cx={gCx} cy={gCy} r={R} spin={frame * 0.05} />
          <circle cx={gCx} cy={gCy} r={issR} fill="none" stroke={B.gauge} strokeWidth={3} strokeDasharray="10 10" />
          <rect x={gCx + Math.cos(ang) * issR - 11} y={gCy + Math.sin(ang) * issR - 6} width={22} height={12} fill={B.gauge} />
        </svg>
      ) : null}
      {globe > 0.5 ? <PillTag x={260} y={214} size={34} opacity={ease(frame, desk + 4, 8)}>a 30 cm desk globe</PillTag> : null}
      {globe > 0.5 && frame >= oneCm ? <Card x={880} y={210} size={72} big="ABOUT 1 CM" opacity={ease(frame, oneCm, 8)} /> : null}
      {frame >= gravity && frame < falls ? (
        <>
          <Photo id="l05-iss" scale={1.2} origin="50% 55%" brightness={0.5} />
          <div style={{ position: "absolute", left: 160, top: 480, width: 1160, height: 90, borderRadius: 14, background: "rgba(5,14,24,0.9)", outline: "3px solid #fff", overflow: "hidden" }}>
            <div style={{ width: `${(frame >= ninety ? 90 : 90 * ease(frame, gravity + 4, ninety - gravity - 4) * 0.8)}%`, height: "100%", background: B.gauge }} />
          </div>
          <PillTag x={160} y={410} size={36}>gravity up here, against the ground</PillTag>
          {frame >= ninety ? <Card x={520} y={600} size={110} big="ABOUT 90 %" opacity={ease(frame, ninety, 8)} /> : null}
        </>
      ) : null}
      <Clip id="l05-clip-orbit" seconds={40} opacity={clip} brightness={0.95} />
      {clip > 0.5 ? <PillTag x={60} y={206} size={30}>Earth from the Station: photos run as a time-lapse</PillTag> : null}
      {arc > 0 ? (
        <svg width={1400} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: arc }}>
          <path d="M120 360 Q 700 200 1300 620" stroke={B.gauge} strokeWidth={8} fill="none" strokeDasharray="28 18" strokeDashoffset={-frame * 3} />
          <circle cx={mix(120, 1300, (frame * 0.004) % 1)} cy={(() => { const u = (frame * 0.004) % 1; return (1 - u) * (1 - u) * 360 + 2 * u * (1 - u) * 200 + u * u * 620; })()} r={12} fill={B.paper} />
        </svg>
      ) : null}
      {frame >= falls && frame < sideways ? <CaptionPop bottom={150}>falling, all the time</CaptionPop> : null}
      {frame >= eight && clip > 0.5 ? <Card x={120} y={720} size={80} big="ABOUT 8 KM EVERY SECOND" small="SO IT KEEPS MISSING THE PLANET" opacity={ease(frame, eight, 8)} /> : null}
      {drag > 0 ? (
        <svg width={1400} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: drag }}>
          {Array.from({ length: 22 }, (_, i) => {
            const a = Math.sin(i * 12.9898) * 43758.5453;
            const y = 220 + (a - Math.floor(a)) * 640;
            const x = 1400 - ((frame * 9 + i * 120) % 1400);
            return <line key={i} x1={x} y1={y} x2={x + 46} y2={y} stroke="#9BD8F0" strokeWidth={5} strokeLinecap="round" opacity={0.8} />;
          })}
        </svg>
      ) : null}
      {frame >= air && frame < drags ? <PillTag x={60} y={206} size={34} color={B.aqua} opacity={ease(frame, air, 8)}>still air here. not much.</PillTag> : null}
      {frame >= drags && frame < aurora ? <PillTag x={60} y={206} size={34} color={B.aqua} opacity={ease(frame, drags, 8)}>enough to drag on the Station</PillTag> : null}
      {frame >= years && frame < aurora ? <Card x={120} y={740} size={84} big="1 TO 2 YEARS" small="TO COME DOWN WITHOUT BOOSTS" color={B.tease} ink={B.paper} opacity={ease(frame, years, 8)} /> : null}
      <Photo id="l05-aurora" opacity={auroraK} scale={1.03 + 0.18 * lin(frame, aurora, past)} origin="35% 45%" brightness={1} />
      {auroraK > 0.5 ? <PillTag x={60} y={206} size={30}>An aurora, from the Station, 2024</PillTag> : null}
      {auroraK > 0.5 && frame >= band ? <Card x={120} y={760} size={80} big="80 TO 500 KM UP" small="THE STATION FLIES THROUGH THAT BAND" opacity={ease(frame, band, 8)} /> : null}
      {finalK > 0 ? (
        <svg width={1400} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: finalK, background: "#040B1A" }}>
          <line x1={700} y1={950} x2={700} y2={mix(950, 950 - 415 * 1.75, ease(frame, past + 6, 40))} stroke={B.gauge} strokeWidth={22} strokeLinecap="round" />
          <line x1={360} y1={950 - 100 * 1.75} x2={1040} y2={950 - 100 * 1.75} stroke={B.aqua} strokeWidth={6} strokeDasharray="22 12" />
          <line x1={420} y1={950} x2={980} y2={950} stroke={B.paper} strokeWidth={5} />
        </svg>
      ) : null}
      {finalK > 0.5 ? (
        <>
          <PillTag x={380} y={950 - 100 * 1.75 + 12} size={30} color={B.aqua}>the famous edge</PillTag>
          <PillTag x={740} y={950 - 415 * 1.75 - 10} size={34} color={B.gauge} opacity={ease(frame, past + 30, 8)}>still inside the sky</PillTag>
        </>
      ) : null}
    </SkyShell>
  );
};

/**
 * 9 · GPS and geostationary. Lines 0-6. Sources #38, #39, #41.
 * Third rescale, spoken. 0: every old mark collapses to the foot of the gauge, and a drawn stack on screen does the same · 1: USAF artwork of a
 * GPS satellite, labelled as artwork from its first frame · 2: drawn clock and a growing error ring · 3: a true-scale Earth and orbit · 4: a
 * point on Earth and the satellite turn together · 5: the real GOES disc · 6: it dims with a question.
 */
export const Satellites: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const phone = lineAt(t, 1);
  const km20 = within(t, 1, 0.3);
  const four = within(t, 1, 0.55);
  const fast = within(t, 1, 0.86);
  const micro = lineAt(t, 2);
  const both = within(t, 2, 0.24);
  const errs = within(t, 2, 0.75);
  const climb2 = lineAt(t, 3);
  const km35 = within(t, 3, 0.45);
  const same = lineAt(t, 4);
  const real = lineAt(t, 5);
  const surely = lineAt(t, 6);
  const almost = within(t, 6, 0.35);

  const collapse = ease(frame, 10, 90);
  const stack = 1 - ease(frame, phone - 6, 8);
  const gps = ease(frame, phone - 4, 8) * (1 - ease(frame, micro - 4, 6));
  const clock = ease(frame, micro - 2, 8) * (1 - ease(frame, climb2 - 4, 6));
  const orbit = ease(frame, climb2 - 2, 10) * (1 - ease(frame, real - 4, 8));
  const goes = ease(frame, real - 4, 10);
  const dimGoes = mix(0.98, 0.5, ease(frame, almost, 14));
  const Ecx = 700;
  const Ecy = 590;
  const Er = 56; // to scale with the orbit below: 42,157 km (35,786 + 6,371) on 6,371 km
  const Or = Er * (42157 / 6371);
  const Gr = Er * (26571 / 6371); // GPS: 20,200 + 6,371
  const turn = ease(frame, same, 8) * (frame - same) * 0.9;
  const a = ((-60 + Math.max(0, turn)) * Math.PI) / 180;
  const credit = goes > 0.5 ? { kind: "real" as const, source: "NASA Goddard / NOAA GOES-13, CC BY 2.0" } : orbit > 0.5 ? { kind: "illustration" as const, source: "Earth and both orbits to scale" } : clock > 0.5 ? { kind: "illustration" as const, source: "drawn" } : gps > 0.5 ? { kind: "illustration" as const, source: "US Air Force artwork" } : { kind: "illustration" as const, source: "the climb so far, to scale" };
  return (
    <SkyShell
      t={t}
      index={8}
      climb={[{ at: 0, km: 415, reading: "415 KM" }, { at: km20, km: 20200, reading: "20,200 KM", sub: "GPS" }, { at: km35, km: 35786, reading: "35,786 KM", sub: "GEOSTATIONARY" }]}
      scale={[{ at: 0, top: 500 }, { at: 16, top: 20200, say: null }, { at: km20, top: 20200, say: "SCALE CHANGE: NOW 0 TO 20,200 KM" }, { at: km35, top: 35786, say: "SCALE CHANGE: NOW 0 TO 35,786 KM" }]}
      marks={[{ km: 20200, label: "GPS", at: km20 }, { km: 35786, label: "geostationary", at: km35 }]}
      credit={credit}
    >
      {stack > 0 ? (
        <div style={{ position: "absolute", inset: 0, background: "#040B1A", opacity: stack }}>
          <svg width={1400} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={700} y1={940} x2={700} y2={mix(250, 930, collapse)} stroke={B.gauge} strokeWidth={22} strokeLinecap="round" />
            <line x1={460} y1={940} x2={940} y2={940} stroke={B.paper} strokeWidth={5} />
          </svg>
          <PillTag x={740} y={mix(240, 860, collapse)} size={34} color={B.gauge}>everything so far</PillTag>
          <Card x={200} y={240} size={92} big="NEW SCALE" color={B.tease} ink={B.paper} opacity={ease(frame, 10, 12)} />
        </div>
      ) : null}
      {gps > 0 ? <Photo id="l05-gps-art" opacity={gps} scale={1.03 + 0.14 * lin(frame, phone, micro)} origin="46% 42%" brightness={0.92} /> : null}
      {gps > 0.5 ? <PillTag x={60} y={206} size={32} color={B.gauge}>Artwork of a GPS satellite, not a photo</PillTag> : null}
      {gps > 0.5 && frame >= four ? <Card x={100} y={750} size={84} big="AT LEAST 4 IN VIEW" small="FROM ALMOST ANYWHERE" opacity={ease(frame, four, 8)} /> : null}
      {gps > 0.5 && frame >= fast ? <PillTag x={60} y={268} size={34} color={B.tease} opacity={ease(frame, fast, 6)}>their clocks run fast</PillTag> : null}
      {clock > 0 ? (
        <svg width={1400} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: clock, background: "#040B1A" }}>
          {[{ x: 400, c: B.paper, k: 1 }, { x: 990, c: B.gauge, k: 1.012 }].map((c) => {
            const an = ((frame - micro) * 6 * c.k * Math.PI) / 180;
            return (
              <g key={c.x}>
                <circle cx={c.x} cy={430} r={150} fill="none" stroke={c.c} strokeWidth={9} />
                <line x1={c.x} y1={430} x2={c.x + Math.sin(an) * 126} y2={430 - Math.cos(an) * 126} stroke={c.c} strokeWidth={9} strokeLinecap="round" />
              </g>
            );
          })}
          {frame >= errs ? <circle cx={700} cy={830} r={mix(10, 110, lin(frame, errs, climb2))} fill="none" stroke={B.tease} strokeWidth={8} /> : null}
          {frame >= errs ? <circle cx={700} cy={830} r={9} fill={B.paper} /> : null}
        </svg>
      ) : null}
      {clock > 0.5 ? (
        <>
          <Tag x={400} y={610} align="center" size={30}>on the ground</Tag>
          <Tag x={990} y={610} align="center" size={30} color={B.gauge}>on a GPS satellite</Tag>
          <Card x={330} y={210} size={72} big="38 MILLIONTHS OF A SECOND A DAY" opacity={ease(frame, micro + 2, 8)} />
          {frame >= both && frame < errs ? <PillTag x={700} y={700} size={34} align="center" opacity={ease(frame, both, 8)}>weaker gravity, high speed: both change the clock</PillTag> : null}
          {frame >= errs ? <PillTag x={840} y={800} size={36} color={B.tease} opacity={ease(frame, errs, 8)}>kilometres of error, in a day</PillTag> : null}
        </>
      ) : null}
      {orbit > 0 ? (
        <svg width={1400} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: orbit, background: "#040B1A" }}>
          <circle cx={Ecx} cy={Ecy} r={Gr} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={3} strokeDasharray="8 10" />
          {frame >= km35 ? <circle cx={Ecx} cy={Ecy} r={Or} fill="none" stroke={B.gauge} strokeWidth={4} /> : null}
          <EarthDisc cx={Ecx} cy={Ecy} r={Er} spin={(a * 180) / Math.PI} />
          {frame >= same ? (
            <>
              <line x1={Ecx + Math.cos(a) * Er} y1={Ecy + Math.sin(a) * Er} x2={Ecx + Math.cos(a) * Or} y2={Ecy + Math.sin(a) * Or} stroke={B.gauge} strokeWidth={3} strokeDasharray="10 8" />
              <circle cx={Ecx + Math.cos(a) * Er} cy={Ecy + Math.sin(a) * Er} r={8} fill={B.tease} />
            </>
          ) : null}
          {frame >= km35 ? <rect x={Ecx + Math.cos(a) * Or - 13} y={Ecy + Math.sin(a) * Or - 8} width={26} height={16} fill={B.gauge} /> : null}
        </svg>
      ) : null}
      {orbit > 0.5 ? <PillTag x={Ecx - Gr - 20} y={Ecy + Gr * 0.4} size={28} align="right">GPS height</PillTag> : null}
      {orbit > 0.5 && frame >= same ? <PillTag x={60} y={206} size={34} color={B.gauge} opacity={ease(frame, same, 8)}>It circles as fast as Earth turns</PillTag> : null}
      {orbit > 0.5 && frame >= within(t, 4, 0.6) ? <PillTag x={60} y={268} size={34} opacity={ease(frame, within(t, 4, 0.6), 8)}>so it hangs over one spot</PillTag> : null}
      <Photo id="l05-goes" opacity={goes} fit="contain" scale={1 + 0.1 * lin(frame, real, t.frames)} brightness={dimGoes} box={{ left: 0, right: 520, top: 110, bottom: 0, background: "#000" }} />
      {goes > 0.5 ? <PillTag x={60} y={206} size={30}>The real thing: GOES-13, 2010</PillTag> : null}
      {frame >= surely && frame < almost ? <CaptionPop bottom={150}>beyond the air?</CaptionPop> : null}
      {frame >= almost ? <CaptionPop bottom={150}>almost. not quite.</CaptionPop> : null}
    </SkyShell>
  );
};

/**
 * 10 · The Moon. Lines 0-3. Sources #42, #43, #44.
 * Fourth rescale. 0: thirty Earth discs line up across the gap, to scale · 1: Earthrise (Apollo 8), the people counted out · 2: Orion's own
 * frame, pushing to the Moon and the Earth beyond · 3: the frame holds, darkening, the caption doubts.
 */
export const Moon: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const km = within(t, 0, 0.25);
  const line30 = within(t, 0, 0.6);
  const few = lineAt(t, 1);
  const apollo = within(t, 1, 0.16);
  const art = within(t, 1, 0.26);
  const far = within(t, 1, 0.62);
  const taken = lineAt(t, 2);
  const beyond = within(t, 2, 0.55);
  const surely = lineAt(t, 3);

  const bar = 1 - ease(frame, few - 4, 8);
  const rise = ease(frame, few - 4, 8) * (1 - ease(frame, taken - 4, 8));
  const orion = ease(frame, taken - 4, 8);
  const dots = lin(frame, line30, few - 4);
  const X0 = 110;
  const PX = 1260 / 406770; // the bar's scale; it stops at Artemis II's farthest point, the last sourced height of this rung
  const moonX = X0 + 384400 * PX;
  const eD = 12742 * PX;
  const zoom = 1 + 0.45 * ease(frame, taken, 60) ;
  const credit = bar > 0.5 ? { kind: "illustration" as const, source: "distance and Earth's width to scale" } : rise > 0.5 ? { kind: "real" as const, source: "NASA, Apollo 8, B. Anders" } : { kind: "real" as const, source: "NASA, Artemis II, 2026" };
  return (
    <SkyShell
      t={t}
      index={9}
      climb={[{ at: 0, km: 35786, reading: "35,786 KM" }, { at: km, km: 384400, reading: "384,400 KM", sub: "THE MOON" }, { at: far, km: 406770, reading: "406,770 KM", sub: "ARTEMIS II, 2026" }]}
      scale={[{ at: 0, top: 35786 }, { at: km, top: 384400, say: "SCALE CHANGE: NOW 0 TO 384,400 KM" }, { at: far, top: 406770, say: "SCALE CHANGE: NOW 0 TO 406,770 KM" }]}
      marks={[{ km: 384400, label: "Moon", at: km }, { km: 406770, label: "Artemis II", at: far }]}
      credit={credit}
    >
      {bar > 0 ? (
        <svg width={1400} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: bar, background: "#02060D" }}>
          <line x1={X0} y1={560} x2={moonX} y2={560} stroke="rgba(255,255,255,0.4)" strokeWidth={3} />
          {Array.from({ length: 30 }, (_, i) => (frame >= line30 && dots * 30 >= i ? <EarthDisc key={i} cx={X0 + eD / 2 + i * eD} cy={560} r={eD / 2} /> : null))}
          {frame < line30 ? <EarthDisc cx={X0 + eD / 2} cy={560} r={eD / 2} /> : null}
          {frame >= km ? <circle cx={moonX} cy={560} r={(3474 * PX) / 2 + 3} fill="#C9C9C4" /> : null}
        </svg>
      ) : null}
      {bar > 0.5 ? (
        <>
          <Tag x={X0} y={470} size={32}>Earth</Tag>
          {frame >= km ? <Tag x={moonX} y={470} size={32} align="center" color={B.gauge}>the Moon</Tag> : null}
          {frame >= km ? <Card x={420} y={250} size={84} big="384,400 KM" opacity={ease(frame, km, 8)} /> : null}
          {frame >= line30 ? <Card x={420} y={700} size={84} big={`${Math.min(30, Math.floor(dots * 30) + 1)} EARTHS`} color={B.paper} /> : null}
        </>
      ) : null}
      {rise > 0 ? <Photo id="l05-earthrise" opacity={rise} scale={1.0 + 0.08 * lin(frame, few, taken)} origin="50% 62%" brightness={1} box={{ background: "#000" }} /> : null}
      {rise > 0.5 ? (
        <>
          <PillTag x={60} y={206} size={30}>Earth from Moon orbit, Apollo 8, 1968</PillTag>
          <div style={{ position: "absolute", left: 90, top: 300, width: 500 }}>
            <div style={{ fontFamily: F.headline, fontSize: 96, color: B.gauge, lineHeight: 1 }}>{frame >= art ? "28 PEOPLE" : frame >= apollo ? "24 ON APOLLO" : "ONLY"}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16, width: 460 }}>
              {Array.from({ length: 28 }, (_, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: 14, background: i < 24 ? B.paper : B.gauge, opacity: frame >= (i < 24 ? apollo + i : art + (i - 24) * 4) ? 1 : 0 }} />
              ))}
            </div>
            {frame >= art ? <div style={{ marginTop: 14, fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: B.paper, whiteSpace: "nowrap" }}>24 on Apollo, 4 on Artemis II</div> : null}
          </div>
          {frame >= far ? <Card x={90} y={760} size={64} big="406,770 KM" small="THE FARTHEST HUMANS HAVE BEEN" opacity={ease(frame, far, 8)} /> : null}
        </>
      ) : null}
      {orion > 0 ? <Photo id="l05-orion" opacity={orion} scale={zoom} origin="92% 55%" brightness={mix(0.98, 0.68, ease(frame, surely, 30))} box={{ background: "#000" }} /> : null}
      {orion > 0.5 && frame < surely ? <PillTag x={60} y={206} size={30}>Orion's own camera, Artemis II, 2026</PillTag> : null}
      {orion > 0.5 && frame >= beyond && frame < surely ? <PillTag x={60} y={268} size={34} color={B.gauge} opacity={ease(frame, beyond, 8)}>the Moon, and past it, the Earth</PillTag> : null}
      {frame >= surely ? <CaptionPop bottom={150}>the sky has stopped. surely.</CaptionPop> : null}
    </SkyShell>
  );
};

/**
 * The last edge. Lines 0-6 (line 7 of script.json is a stray note and is dropped in Episode.tsx). Sources #1, #45, #46.
 * Final rescale; the scale's top is the last sourced point. 0: NASA S72-40818, the geocorona from the Moon, colour added, said on the picture
 * · 1-2: to-scale bar Earth to 630,000 km, Moon inside · 3: five cubic centimetres, one atom · 4: NOAA's 10,000 km tick · 5: the glow fades
 * with no edge · 6: back to the sky of the first shot.
 */
export const LastEdge: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const thatsEarth = within(t, 0, 0.42);
  const glow = within(t, 0, 0.55);
  const traced = lineAt(t, 1);
  const num = within(t, 1, 0.42);
  const fifty = within(t, 1, 0.62);
  const onehalf = within(t, 1, 0.76);
  const inside = lineAt(t, 2);
  const fair = lineAt(t, 3);
  const atoms = within(t, 3, 0.3);
  const vacuum = within(t, 3, 0.72);
  const other = lineAt(t, 4);
  const answer = lineAt(t, 5);
  const noEdge = within(t, 5, 0.12);
  const back = lineAt(t, 6);

  const plate = 1 - ease(frame, traced - 4, 10);
  const bar = ease(frame, traced - 2, 10) * (1 - ease(frame, fair - 4, 8)) + ease(frame, other - 4, 8) * (1 - ease(frame, back - 4, 12));
  const cubes = ease(frame, fair - 2, 8) * (1 - ease(frame, other - 4, 6));
  const sky = ease(frame, back - 4, 14);
  const X0 = 110;
  const W = 1240;
  const PX = W / 630000;
  const reach = frame >= num ? ease(frame, num, 40) : 0;
  const moonX = X0 + 384400 * PX;
  const eR = 6371 * PX;
  const fade = ease(frame, answer, 90);
  const credit = sky > 0.5 ? { kind: "real" as const, source: "NOAA Photo Library" } : cubes > 0.5 ? { kind: "illustration" as const, source: "drawn" } : bar > 0.5 ? { kind: "illustration" as const, source: "distances to scale; ESA figures, SOHO data" } : { kind: "real" as const, source: "NASA / NRL, Apollo 16, S72-40818" };
  return (
    <SkyShell
      t={t}
      index={9}
      last
      climb={[{ at: 0, km: 384400, reading: "384,400 KM" }, { at: num, km: 630000, reading: "630,000 KM", sub: "THE LAST TRACES" }]}
      scale={[{ at: 0, top: 406770 }, { at: num, top: 630000, say: "SCALE CHANGE: NOW 0 TO 630,000 KM" }]}
      marks={[{ km: 630000, label: "the last edge", at: num }]}
      credit={credit}
      drawn={plate > 0.5 && frame >= thatsEarth ? "pointer added" : null}
    >
      <Photo id="l05-geocorona" opacity={plate} fit="contain" scale={1 + 0.1 * lin(frame, 0, traced)} origin="42% 43%" brightness={1} box={{ left: 80, right: 500, top: 120, bottom: 0, background: "#000" }} />
      {plate > 0.5 ? <PillTag x={60} y={206} size={30} color={B.gauge}>Ultraviolet, colour added, Apollo 16, 1972</PillTag> : null}
      {plate > 0.5 && frame >= thatsEarth ? (
        <>
          <svg width={1400} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: ease(frame, thatsEarth, 8) }}>
            <path d="M190 520 H 600" stroke={B.paper} strokeWidth={5} />
          </svg>
          <PillTag x={60} y={500} size={34} opacity={ease(frame, thatsEarth, 8)}>Earth</PillTag>
        </>
      ) : null}
      {plate > 0.5 && frame >= glow ? <PillTag x={860} y={850} size={32} color={B.aqua} opacity={ease(frame, glow, 8)} align="left">the glow: hydrogen, the geocorona</PillTag> : null}
      {bar > 0 ? (
        <svg width={1400} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: clamp01(bar), background: "#02060D" }}>
          <defs>
            <linearGradient id="l05corona" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#7DD3F5" stopOpacity={0.85} />
              <stop offset="0.5" stopColor="#3B7FBF" stopOpacity={0.4} />
              <stop offset="1" stopColor="#1B3F7C" stopOpacity={mix(0.14, 0, fade)} />
            </linearGradient>
          </defs>
          <rect x={X0} y={420} width={W * reach} height={280} fill="url(#l05corona)" />
          <EarthDisc cx={X0} cy={560} r={Math.max(eR, 7)} />
          <circle cx={moonX} cy={560} r={frame >= inside ? 9 + Math.sin(frame / 5) * 2 : 8} fill="#E2E2DC" stroke={frame >= inside ? B.gauge : "none"} strokeWidth={4} />
          {reach > 0 && fade < 0.5 ? <line x1={X0 + W * reach} y1={400} x2={X0 + W * reach} y2={720} stroke={B.gauge} strokeWidth={5} /> : null}
          {frame >= other && frame < back ? <line x1={X0 + 10000 * PX} y1={380} x2={X0 + 10000 * PX} y2={740} stroke={B.tease} strokeWidth={5} opacity={ease(frame, other, 8)} /> : null}
        </svg>
      ) : null}
      {clamp01(bar) > 0.5 && frame < fair ? (
        <>
          <Tag x={moonX} y={360} align="center" size={32}>the Moon</Tag>
          {frame >= num ? <Card x={880} y={210} size={72} big="630,000 KM" opacity={ease(frame, num, 8)} /> : null}
          {frame < num ? <PillTag x={140} y={230} size={32} opacity={ease(frame, traced, 8)}>traced by a space telescope</PillTag> : null}
          {frame >= fifty ? <Card x={140} y={750} size={64} big="50 EARTHS ACROSS" opacity={ease(frame, fifty, 8)} /> : null}
          {frame >= onehalf ? <Card x={700} y={750} size={64} big="OVER 1.5 MOON DISTANCES" color={B.paper} opacity={ease(frame, onehalf, 8)} /> : null}
          {frame >= inside ? <CaptionPop bottom={380} size={68}>the Moon flies through it</CaptionPop> : null}
        </>
      ) : null}
      {cubes > 0 ? (
        <svg width={1400} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: cubes, background: "#02060D" }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const x = 190 + i * 215;
            return (
              <g key={i} stroke={B.paper} strokeWidth={4} fill="none">
                <rect x={x} y={480} width={150} height={150} />
                <path d={`M${x} 480 l40 -40 h150 l-40 40 M${x + 150} 480 l40 -40 v150 l-40 40`} />
              </g>
            );
          })}
          {frame >= atoms ? <circle cx={190 + 2 * 215 + 80 + Math.sin(frame / 14) * 34} cy={550 + Math.cos(frame / 19) * 34} r={12} fill={B.gauge} opacity={ease(frame, atoms, 8)} /> : null}
        </svg>
      ) : null}
      {cubes > 0.5 && frame >= atoms ? <Card x={230} y={220} size={76} big="0.2 ATOMS PER CM³" small="ONE ATOM IN FIVE CUBIC CENTIMETRES, AT THE MOON" opacity={ease(frame, atoms, 8)} /> : null}
      {cubes > 0.5 && frame < atoms ? <PillTag x={230} y={260} size={36}>what "atmosphere" means out here</PillTag> : null}
      {cubes > 0.5 && frame >= vacuum ? <PillTag x={230} y={700} size={36} color={B.aqua} opacity={ease(frame, vacuum, 8)}>"On Earth we would call it vacuum": ESA</PillTag> : null}
      {clamp01(bar) > 0.5 && frame >= other && frame < answer ? <PillTag x={X0 + 30} y={770} size={32} color={B.tease} opacity={ease(frame, other, 8)}>one definition stops far lower: NOAA, 10,000 km</PillTag> : null}
      {clamp01(bar) > 0.5 && frame >= noEdge && frame < back ? <CaptionPop bottom={250} size={96}>no edge</CaptionPop> : null}
      {clamp01(bar) > 0.5 && frame >= noEdge && frame < back ? <PillTag x={moonX} y={760} size={32} align="center" color={B.paper} opacity={ease(frame, noEdge + 60, 10)}>well past the Moon</PillTag> : null}
      {sky > 0 ? <Photo id="l05-cumulus" opacity={sky} scale={1.05 + 0.12 * lin(frame, back, t.frames)} origin="50% 0%" brightness={0.95} /> : null}
      {sky > 0.5 ? <CaptionPop bottom={150} size={64}>farther than any human has been</CaptionPop> : null}
    </SkyShell>
  );
};
