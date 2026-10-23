import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { CaptionPop } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { RungShell, Tag } from "./shell";

/**
 * Level 4 - the greatest migration on Earth, ~500 m. Sources: #12 (WW2 false bottom, rose at
 * night, sank at dawn, equipment/jamming suspected, Martin Johnson 1945; depth: NOAA "typically
 * seen around 300-500 meters" - ~500 m is the deep end of that range), #13 (NOAA: "greatest
 * migration on Earth", nightly), #33 (~10 billion tonnes; carbon carried down).
 * Lines: 0 "Around 500 m, the navy found a second sea floor..." 1 "...sonar operators... solid ground..."
 * 2 "And this floor moved. Every evening it rose... Every dawn, it sank." 3 "They checked the equipment... jamming..."
 * 4 "In 1945... Martin Johnson... It was alive." 5 "Billions upon billions of small animals..."
 * 6 "At sunset they swim up... Before sunrise... back down." 7 "NOAA calls it the greatest migration on Earth..."
 * 8 "...ten billion tonnes..." 9 "It isn't only a commute... carbon..." 10 "...great carbon pumps." 11 "...in the way of a war." 12 tease
 *
 * Motion pass (2026-10-01): the chart used to sit still for up to 17 s at a time. It now has a "now" marker
 * that travels along the time axis for the whole scene - first the sonar ship, pinging the layer below it,
 * then a sun / moon above the chart with daylight that comes and goes in the water - so the layer is seen
 * rising at dusk and sinking at dawn, over and over. Every other cue below is the word it is keyed to.
 */
export const Migration: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const traceAt = lineAt(t, 1);
  const riseAt = within(t, 2, 0.2); // "And this floor moved. | Every evening it rose toward the surface..."
  const aliveAt = within(t, 4, 0.8);
  const dotsAt = lineAt(t, 5);
  const nameAt = within(t, 7, 0.3);
  const tonnesAt = within(t, 8, 0.6);
  const carbonAt = lineAt(t, 9);
  const warAt = within(t, 11, 0.4);
  const teaseAt = lineAt(t, 12);

  const readingAt = within(t, 1, 0.5); // "solid ground, a few hundred metres down"
  const chartsAt = within(t, 1, 0.72); // "in places where the charts said the water was kilometres deep"
  const movedAt = lineAt(t, 2); // "And this floor moved."
  const dawnAt = within(t, 2, 0.68); // "Every dawn, it sank back down."
  const equipAt = within(t, 3, 0.03); // "They checked the equipment."
  const jamAt = within(t, 3, 0.3); // "They suspected the enemy was jamming them."
  const neitherAt = within(t, 3, 0.75); // "Neither explanation held."
  const johnsonAt = within(t, 4, 0.1); // "a scientist named Martin Johnson"
  const fishAt = within(t, 5, 0.28); // "tiny fish,"
  const shrimpAt = within(t, 5, 0.36); // "shrimp,"
  const jelliesAt = within(t, 5, 0.41); // "jellies,"
  const planktonAt = within(t, 5, 0.47); // "plankton"
  const gloomAt = within(t, 5, 0.55); // "spend their days down here in the gloom"
  const huntersAt = within(t, 5, 0.81); // "where hunters can't see them"
  const sunsetAt = lineAt(t, 6); // "At sunset they swim up"
  const feedAt = within(t, 6, 0.41); // "to feed under cover of night"
  const sunriseAt = within(t, 6, 0.67); // "Before sunrise, they all go back down."
  const everyDayAt = within(t, 7, 0.37); // "It happens every day,"
  const everyOceanAt = within(t, 7, 0.54); // "in every ocean"
  const darkAt = within(t, 7, 0.68); // "and the entire thing takes place in the dark"
  const scaleAt = lineAt(t, 8); // "And the scale of it is difficult to hold in your head."
  const risingAt = within(t, 8, 0.78); // "rising and sinking,"
  const feedsAt = within(t, 9, 0.18); // "Every one of those animals feeds up at the surface"
  const carbonWordAt = within(t, 9, 0.58); // "- that carbon -"
  const staysAt = within(t, 9, 0.84); // "where a great deal of it stays"
  const pumpAt = within(t, 10, 0.72); // "one of its great carbon pumps"
  const nextAt = within(t, 12, 0.42); // "And this is where the light finally runs out completely."
  const pulse = (at: number, hold = 16) => ease(frame, at, 8) * (1 - ease(frame, at + 8, hold));
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  const chart = ease(frame, 0, 12) * (1 - ease(frame, teaseAt, 10));
  // line 1: the sonar trace draws left to right as a FLAT band ("solid ground, a few hundred metres
  // down"). The night-time hump only grows at line 2, when the narration says the floor moved.
  const drawn = ease(frame, traceAt, 90);
  const rise = ease(frame, riseAt, 60);
  const alive = ease(frame, aliveAt, 20);
  const dots = ease(frame, dotsAt, 24);
  const cycling = 1 - ease(frame, warAt, 10); // the marker, the daylight and the carbon all leave for the last line

  // chart geometry: x = time of day across the frame, y = depth (500 m by day, ~50 m at night)
  const x0 = 260;
  const x1 = 1440;
  const yDay = 560;
  const yNight = 330;
  // tags for the daytime band sit BELOW it (ink from ~605; the band and its dots reach y ~598) - above
  // it, the rising ramp cut through them
  const bandTagY = yDay + 38;
  // "It was alive": from that word on the layer is never a hard line again - it ripples
  const wobble = 4 * alive;
  const bandY = (u: number) => {
    // u in 0..1 = noon -> noon; night is the middle third
    const night = Math.max(0, Math.min(1, (0.5 - Math.abs(u - 0.5) - 0.17) / 0.08));
    return yDay - (yDay - yNight) * night * rise + wobble * Math.sin(u * 46 + frame / 7);
  };
  const pts = Array.from({ length: 121 }, (_, i) => {
    const u = i / 120;
    return [x0 + u * (x1 - x0), bandY(u)] as const;
  });
  const visible = pts.filter((_, i) => i / 120 <= drawn);
  const path = visible.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");

  // "now": a time of day that keeps running. It waits at the left for line 0, rides the head of the trace
  // while that draws, then laps the chart: once across during line 1, over the evening ramp on "it rose" and
  // the dawn ramp on "it sank back down" (line 2), again on "At sunset they swim up" / "Before sunrise, they
  // all go back down" (line 6), and a lap every ~9 s in between and after.
  const laps =
    frame < traceAt + 90
      ? Math.max(0.19, drawn)
      : interpolate(frame, [traceAt + 90, within(t, 2, 0.23), within(t, 2, 0.93), sunsetAt, within(t, 6, 1), within(t, 6, 1) + 2700], [1, 2.15, 2.85, 5.15, 5.85, 15.85], { extrapolateLeft: "clamp", extrapolateRight: "extend" });
  const now = laps - Math.floor(laps);
  const nowX = x0 + now * (x1 - x0);
  const nowY = bandY(now);
  const atEdge = clamp01(Math.min(now / 0.03, (1 - now) / 0.03)); // fades through the wrap from noon back to noon
  // daylight: full at noon, gone across the shaded night third, fading over the two ramps
  const day = 1 - clamp01((0.5 - Math.abs(now - 0.5) - 0.17) / 0.16);
  const light = ease(frame, movedAt, 24) * cycling;
  // the sonar ship rides "now" until the layer turns out to be alive; it pings the layer under it, so the
  // echo comes back sooner when the layer is up. No pings under the "surface" tag (x < 440) or under / just
  // right of the "...rises every evening" tag while that is up (a return ping beside its last word read as a dash).
  const ship = ease(frame, 20, 14) * (1 - ease(frame, dotsAt, 16)) * atEdge;
  const riseTag = ease(frame, riseAt + 30, 10) * (1 - alive);
  const pingClear = clamp01((nowX - 430) / 20) * (nowX > 556 && nowX < 1210 ? 1 - riseTag : 1);
  const pingT = (Math.max(0, frame - 30) % 44) / 44;
  const pingGo = pingT < 0.45 ? pingT / 0.45 : pingT < 0.9 ? 1 - (pingT - 0.45) / 0.45 : -1;
  const echo = clamp01((pingT - 0.45) / 0.25);
  // line 0 only: the bounce is drawn big (the ship and its ping are tiny on a phone) - a stretch of "floor"
  // flashes where the ping lands and a wide ring spreads from it, for 20 frames of every 44
  const bounce = clamp01((pingT - 0.45) / 0.45);
  const firstEchoes = (1 - ease(frame, traceAt, 10)) * (pingT >= 0.45 && pingT < 0.9 ? 1 : 0);

  // line 1 "where the charts said the water was kilometres deep": the real floor lights up and the gap is measured
  const floorHi = ease(frame, chartsAt, 10) * (1 - ease(frame, movedAt, 12));
  const gapDraw = ease(frame, chartsAt + 4, 30);
  // line 8 "the scale of it": the layer thickens (dots to y ~522-598 by day, ~292-368 at night) and gains dots
  const thick = 1 + 0.25 * ease(frame, scaleAt, 60);
  const more = ease(frame, scaleAt, 50);
  // lines 9-10: three falling dots per drop line instead of one, and what reaches the deep stays there
  const fallen = (i: number) => [0, 173, 347].reduce((n, off) => n + Math.floor((Math.max(0, frame - carbonAt) * 3 + i * 60 + off) / 520) - Math.floor((i * 60 + off) / 520), 0);
  // the hand-off: "this is where the light finally runs out" - the water goes black behind the caption
  const lightsOut = interpolate(frame, [nextAt, t.frames - 10], [0, 0.82], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <RungShell t={t} index={3} depth={500} plate={null} credit={{ kind: "illustration" }} teaseFrom={teaseAt}>
      {/* the sonar strip-chart: sea surface at the top, a real sea floor at the bottom, and the false one moving */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: chart }}>
        <defs>
          <clipPath id="l04-panel">
            <rect x={x0} y={250} width={x1 - x0} height={700} rx={20} />
          </clipPath>
          <linearGradient id="l04-day" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5BB8EA" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#5BB8EA" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="l04-swarm">
            <stop offset="0%" stopColor="#FFF2C2" stopOpacity="0.85" />
            <stop offset="100%" stopColor={B.gauge} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x={x0} y={250} width={x1 - x0} height={700} rx={20} fill="#061422" stroke="#284A62" strokeWidth={2} />
        {/* daylight in the water (y 252-640), bright at noon and gone at night - it follows "now" */}
        <rect x={x0} y={252} width={x1 - x0} height={388} fill="url(#l04-day)" clipPath="url(#l04-panel)" opacity={light * day} />
        {/* night shading */}
        <rect x={x0 + (x1 - x0) * 0.33} y={250} width={(x1 - x0) * 0.34} height={700} fill="#03090F" opacity={0.8} />
        <line x1={x0} y1={262} x2={x1} y2={262} stroke={B.aqua} strokeWidth={3} />
        <line x1={x0} y1={930} x2={x1} y2={930} stroke={interpolateColors(floorHi, [0, 1], ["#8CA0B3", "#FFFFFF"])} strokeWidth={4 + 4 * floorHi} />
        {/* the gap between the reading and the charted floor (x 1,300, y 590-918), drawn on "kilometres deep" */}
        <g opacity={floorHi} stroke={B.paper} fill={B.paper}>
          <line x1={1300} y1={590} x2={1300} y2={590 + 310 * gapDraw} strokeWidth={4} strokeDasharray="12 10" />
          <path d={`M1287 ${586 + 310 * gapDraw} L1313 ${586 + 310 * gapDraw} L1300 ${608 + 310 * gapDraw} Z`} stroke="none" />
        </g>
        {/* sun / moon above the chart (y 172-228: under the collapsed title bar, above the ship) marks "now" */}
        <g transform={`translate(${nowX} 200)`} opacity={light * atEdge}>
          {/* never both at once: the sun is out by the middle of each ramp and only then does the moon come up
              (cross-faded, they made a muddy disc with a crescent on it) */}
          <g opacity={clamp01(day * 2 - 1)}>
            <circle r={15} fill={B.gauge} />
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI) / 4 + frame / 60;
              return <line key={i} x1={Math.cos(a) * 21} y1={Math.sin(a) * 21} x2={Math.cos(a) * 28} y2={Math.sin(a) * 28} stroke={B.gauge} strokeWidth={4} strokeLinecap="round" />;
            })}
          </g>
          <path d="M3 -16 A16 16 0 1 0 3 16 A22 22 0 0 1 3 -16 Z" fill="#DCE8F5" opacity={clamp01(1 - day * 2)} />
        </g>
        {/* the sonar ship on the surface (y 236-262) and its ping: down to the layer, an echo, back up */}
        <g transform={`translate(${nowX} ${262 + Math.sin(frame / 14) * 1.5})`} opacity={ship} fill="#B9C6D3">
          <path d="M-36 -13 L36 -13 L25 0 L-27 0 Z" />
          <rect x={-12} y={-23} width={20} height={10} />
          <rect x={-3} y={-26} width={3} height={4} />
        </g>
        {pingGo >= 0 ? (
          <rect x={nowX - (10 + 14 * pingGo)} y={272 + (nowY - 22 - 272) * pingGo} width={20 + 28 * pingGo} height={5} rx={2.5} fill={pingT < 0.45 ? B.aqua : B.gauge} opacity={ship * pingClear * 0.9} />
        ) : null}
        {pingT >= 0.45 && pingT < 0.7 ? <ellipse cx={nowX} cy={nowY} rx={16 + 30 * echo} ry={5 + 5 * echo} fill="none" stroke="#FFF2C2" strokeWidth={3} opacity={ship * pingClear * (1 - echo)} /> : null}
        {/* line 0 "a second sea floor. One that should not have been there": the bounce, big (x ~290-680, y 532-588) */}
        <g opacity={ship * firstEchoes}>
          <line x1={nowX - 120} y1={nowY} x2={nowX + 120} y2={nowY} stroke={B.gauge} strokeWidth={14} strokeLinecap="round" opacity={0.95 * (1 - bounce)} />
          <ellipse cx={nowX} cy={nowY} rx={70 + 120 * bounce} ry={12 + 14 * bounce} fill="none" stroke="#FFF2C2" strokeWidth={5} opacity={1 - bounce} />
        </g>
        {/* the false bottom: a bright band that moves - drawn as a trace, then resolved into animals.
            The band swells once on "the same impossible reading: solid ground". Clipped to the panel: its
            round caps used to poke 11-17 px outside the border at both ends. */}
        <g clipPath="url(#l04-panel)">
          <path d={path} fill="none" stroke={B.gauge} strokeWidth={22 + 12 * pulse(readingAt, 24)} strokeLinecap="round" opacity={0.9 * (1 - dots * 0.85)} />
          <path d={path} fill="none" stroke="#FFF2C2" strokeWidth={6} strokeLinecap="round" opacity={0.9 * (1 - dots)} />
        </g>
        {/* the animals travel: every dot moves along the trace with "now", climbing the evening ramp and
            coming down the dawn one, and wraps from noon back to noon */}
        {dots > 0
          ? Array.from({ length: 61 }, (_, i) => i).flatMap((i) => {
              const u = (i / 61 + laps) % 1;
              const edge = clamp01(Math.min(u / 0.02, (1 - u) / 0.02));
              const cx = x0 + u * (x1 - x0);
              const cy = bandY(u);
              return Array.from({ length: 8 }, (_, k) => {
                const jitter = k < 5 ? (((i * 31 + k * 17) % 40) - 20) * thick : ((i * 23 + k * 29) % 50) - 25;
                return <circle key={`${i}-${k}`} cx={cx + ((i * 13 + k * 7) % 14) - 7} cy={cy + jitter + Math.sin(frame / 25 + i + k) * 4} r={2.5 + (k % 3)} fill={B.gauge} opacity={dots * edge * (k < 5 ? 1 : more) * (0.5 + 0.5 * ((i + k) % 2))} />;
              });
            })
          : null}
        {/* the part of the layer that "now" is following: a bead on the sonar trace, a glow in the swarm.
            It swells on "The largest daily movement of life". */}
        <circle cx={nowX} cy={nowY} r={11} fill="#FFF2C2" opacity={light * atEdge * (1 - dots)} />
        <ellipse cx={nowX} cy={nowY} rx={44 + 22 * pulse(lineAt(t, 10), 30)} ry={22 + 6 * pulse(lineAt(t, 10), 30)} fill="url(#l04-swarm)" opacity={light * atEdge * (0.35 + 0.65 * dots)} />
        {/* line 5 "where hunters can't see them": a hunter cruises the lit water above the layer and sees
            nothing (x 275-474, y 390-450: left of the evening ramp, and gone before the up arrow at x 430 arrives) */}
        <g transform={`translate(${interpolate(frame, [huntersAt, sunsetAt + 10], [392, 330], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} ${420 + Math.sin(frame / 20) * 4})`} fill={B.mute} opacity={ease(frame, huntersAt, 12) * (1 - ease(frame, sunsetAt - 6, 14))}>
          <path d="M-55 0 C -25 -26, 25 -26, 55 0 C 25 22, -25 22, -55 0 Z" />
          <path d="M55 0 L 82 -22 L 82 22 Z" transform={`rotate(${Math.sin(frame / 6) * 8} 55 0)`} />
          <circle cx={-34} cy={-5} r={4} fill="#061422" />
        </g>
        {/* line 6: up at sunset (x 430, beside the evening ramp), down before sunrise (x 1,270, beside the dawn
            ramp). The dashes run the way the animals go; both swell on "rising and sinking" (line 8). */}
        <g stroke={B.gauge} fill={B.gauge} strokeWidth={5 + 4 * pulse(risingAt, 30)} strokeLinecap="round">
          <g opacity={ease(frame, sunsetAt + 6, 12) * (1 - ease(frame, carbonAt, 10))}>
            <line x1={430} y1={490} x2={430} y2={376} strokeDasharray="14 12" strokeDashoffset={-frame * 1.2} />
            <path d="M430 350 L416 378 L444 378 Z" stroke="none" />
          </g>
          <g opacity={ease(frame, sunriseAt, 12) * (1 - ease(frame, carbonAt, 10))}>
            <line x1={1270} y1={350} x2={1270} y2={474} strokeDasharray="14 12" strokeDashoffset={-frame * 1.2} />
            <path d="M1270 500 L1256 472 L1284 472 Z" stroke="none" />
          </g>
        </g>
        {/* line 9 "feeds up at the surface": food, twinkling just under the surface line (x 470-1,420, y 274-296) */}
        {Array.from({ length: 24 }, (_, i) => (
          <circle key={i} cx={470 + ((i * 397) % 950)} cy={274 + ((i * 53) % 22)} r={4} fill="#7FE07F" opacity={ease(frame, feedsAt + i, 14) * cycling * (0.35 + 0.65 * Math.abs(Math.sin(frame / 9 + i * 1.3)))} />
        ))}
        {/* carbon: arrows from the surface down into the deep */}
        {Array.from({ length: 6 }, (_, i) => {
          const on = ease(frame, carbonAt + i * 8, 14) * (1 - ease(frame, warAt, 10));
          const cx = x0 + 190 + i * 176; // first drop line clear of the "surface" label
          return (
            <g key={i} opacity={on}>
              <line x1={cx} y1={290} x2={cx} y2={880} stroke="#3F6B86" strokeWidth={2} strokeDasharray="6 14" />
              {[0, 173, 347].map((off) => (
                <circle key={off} cx={cx} cy={300 + (((frame - carbonAt) * 3 + i * 60 + off) % 520)} r={8} fill="#7FE07F" />
              ))}
              {/* "where a great deal of it stays": each dot that reaches the deep joins a pile (y 842-878, above the sea-floor tag) */}
              {Array.from({ length: Math.min(12, fallen(i)) }, (_, m) => (
                <circle key={`p${m}`} cx={cx - 21 + (m % 4) * 14 + (Math.floor(m / 4) % 2) * 7} cy={872 - Math.floor(m / 4) * 12} r={6} fill="#7FE07F" opacity={ease(frame, staysAt, 14)} />
              ))}
            </g>
          );
        })}
      </svg>
      <Tag x={x0 + 12} y={270} opacity={chart} color={B.aqua}>surface</Tag>
      <Tag x={x0 + 12} y={894} opacity={chart} color={interpolateColors(floorHi, [0, 1], [B.mute, B.paper])}>the real sea floor · kilometres down</Tag>
      <Tag x={x0} y={960} opacity={chart} color={B.mute}>noon</Tag>
      <Tag x={(x0 + x1) / 2} y={960} opacity={chart} color={B.mute} align="center">midnight</Tag>
      <Tag x={x1} y={960} opacity={chart} color={B.mute} align="right">noon</Tag>
      <Tag x={x0 + 20} y={bandTagY} opacity={chart * ease(frame, readingAt, 10) * (1 - alive)} color={B.gauge}>“solid ground” at ~500 m</Tag>
      <Tag x={(x0 + x1) / 2} y={yNight - 58} opacity={chart * riseTag} color={B.gauge} align="center">…and it rises every evening</Tag>
      {/* line 2 "Every dawn, it sank back down" - the other half, under the right-hand daytime band */}
      <Tag x={x1 - 20} y={bandTagY} opacity={chart * ease(frame, dawnAt + 16, 10) * (1 - alive)} color={B.gauge} align="right">…and sinks back every dawn</Tag>
      <Tag x={x0 + 20} y={bandTagY} opacity={chart * alive * (1 - ease(frame, gloomAt - 6, 8))} color={B.paper}>1945: not rock. alive.</Tag>
      {/* lines 5-6: where the layer is by day and by night, in the narrator's words (sources.md #13). Day: under
          the right-hand daytime band; night: under the raised band (ink y ~390-414; the band's dots stop at y ~368),
          kept short (x ~665-1,035) so it stays well clear of both ramps. Both leave before line 7's caption. */}
      <Tag x={x1 - 20} y={bandTagY} opacity={chart * ease(frame, gloomAt, 10) * (1 - ease(frame, nameAt - 8, 8))} align="right">by day: down in the gloom</Tag>
      <Tag x={(x0 + x1) / 2} y={384} opacity={chart * ease(frame, feedAt, 10) * (1 - ease(frame, nameAt - 8, 8))} align="center">by night: up to feed</Tag>

      {/* line 3 "They checked the equipment. They suspected the enemy was jamming them. Neither explanation held."
          (sources.md #12: faulty equipment or enemy jamming, and neither held up). Two cards in the chart's
          empty deep water (y 700-800), each on its sentence, both struck through on "Neither". */}
      <div style={{ position: "absolute", left: x0, width: x1 - x0, top: 700, display: "flex", justifyContent: "center", gap: 48, opacity: chart * (1 - ease(frame, lineAt(t, 4) - 6, 10)) }}>
        {[
          { text: "faulty equipment?", at: equipAt, strike: ease(frame, neitherAt, 12) },
          { text: "enemy jamming?", at: jamAt, strike: ease(frame, neitherAt + 8, 12) },
        ].map((c) => (
          <div key={c.text} style={{ position: "relative", padding: "12px 28px 14px", borderRadius: 16, background: "rgba(5,14,24,0.94)", border: `3px solid ${B.mute}`, opacity: ease(frame, c.at, 10), fontFamily: F.caption, fontWeight: 600, fontSize: 56, lineHeight: 1.2, color: B.paper, whiteSpace: "nowrap" }}>
            <span style={{ opacity: 1 - 0.5 * c.strike }}>{c.text}</span>
            <div style={{ position: "absolute", left: "5%", top: "50%", width: `${90 * c.strike}%`, height: 7, marginTop: -3, borderRadius: 4, background: B.tease }} />
          </div>
        ))}
      </div>
      {/* line 4 "In 1945 a scientist named Martin Johnson worked out what it was" (sources.md #12) - same spot */}
      <div style={{ position: "absolute", left: x0, width: x1 - x0, top: 700, display: "flex", justifyContent: "center", opacity: chart * ease(frame, johnsonAt, 10) * (1 - ease(frame, dotsAt, 10)) }}>
        {/* centred like the cards before and after it; the kit's NumberCard can only be placed by its left edge */}
        <div style={{ padding: "10px 22px 12px", borderRadius: 16, background: B.paper, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)", fontFamily: F.headline, fontSize: 60, lineHeight: 1, whiteSpace: "nowrap" }}>Martin Johnson, 1945</div>
      </div>
      {/* line 5 "tiny fish, shrimp, jellies, plankton": each on its word, same spot (y ~712-784) */}
      <div style={{ position: "absolute", left: x0, width: x1 - x0, top: 712, textAlign: "center", whiteSpace: "nowrap", opacity: chart * (1 - ease(frame, gloomAt - 6, 10)), fontFamily: F.caption, fontWeight: 600, fontSize: 60, lineHeight: 1.2, color: B.paper, WebkitTextStroke: `10px ${B.ink}`, paintOrder: "stroke fill" }}>
        <span style={{ opacity: ease(frame, fishAt, 8) }}>tiny fish</span>
        <span style={{ opacity: ease(frame, shrimpAt, 8) }}> · shrimp</span>
        <span style={{ opacity: ease(frame, jelliesAt, 8) }}> · jellies</span>
        <span style={{ opacity: ease(frame, planktonAt, 8) }}> · plankton</span>
      </div>

      {/* the carbon label lives in the empty deep part of the chart, on its own plate so the dashed
          drop-lines and falling dots pass behind it (at y 300 it sat on the night band, under "SURFACE").
          It now waits for the word ("that food - that carbon -"; it used to appear 6 s before it), and
          changes to the closing phrase on "one of its great carbon pumps". */}
      <div style={{ position: "absolute", left: x0, width: x1 - x0, top: 716, display: "flex", justifyContent: "center", opacity: chart * ease(frame, carbonWordAt, 10) * (1 - ease(frame, warAt - 8, 8)) }}>
        <div style={{ padding: "10px 24px", borderRadius: 12, background: "rgba(5,14,24,0.94)", fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 1.5, textTransform: "uppercase", color: "#7FE07F", whiteSpace: "nowrap", transform: `scale(${1 + 0.08 * pulse(pumpAt, 20)})` }}>{frame < pumpAt ? "carbon, carried down every day" : "one of the planet’s great carbon pumps"}</div>
      </div>

      {/* While the chart is up, captions sit in its empty deep water (bottom 250 -> y ~660-830): at the
          usual bottom 150 they covered "THE REAL SEA FLOOR · KILOMETRES DOWN" (y 894) and the floor line (y 930). */}
      {/* Centred on the chart (not on the frame, as CaptionPop is) and a size smaller: at 84 px its ink ran
          x 232-1,426, across the panel border at x 260, and sat off-centre over the row below. y ~736-826. */}
      <div style={{ position: "absolute", left: x0, width: x1 - x0, top: 716, textAlign: "center", whiteSpace: "nowrap", opacity: ease(frame, nameAt, 10) * (1 - ease(frame, scaleAt, 8)), fontFamily: F.caption, fontWeight: 600, fontSize: 80, lineHeight: 1.12, color: B.gauge, WebkitTextStroke: `13px ${B.ink}`, paintOrder: "stroke fill", textShadow: "0 8px 28px rgba(0,0,0,0.55)" }}>
        the greatest migration on Earth
      </div>
      {/* line 7 "It happens every day, in every ocean... and the entire thing takes place in the dark": a second
          row under the caption (y ~842-890, above the sea-floor tag at y 894), each part on its words */}
      <div style={{ position: "absolute", left: x0, width: x1 - x0, top: 820, textAlign: "center", whiteSpace: "nowrap", opacity: chart * (1 - ease(frame, scaleAt, 8)), fontFamily: F.caption, fontWeight: 600, fontSize: 40, lineHeight: 1.2, color: B.paper, WebkitTextStroke: `6px ${B.ink}`, paintOrder: "stroke fill" }}>
        <span style={{ opacity: ease(frame, everyDayAt, 8) }}>every day</span>
        <span style={{ opacity: ease(frame, everyOceanAt, 8) }}> · in every ocean</span>
        <span style={{ opacity: ease(frame, darkAt, 8) }}> · in the dark</span>
      </div>
      {/* The tonnes card: centred on the chart in normal flow. (It used to be an absolutely-positioned
          NumberCard inside a zero-height flex row, which put it flush-left at y 930 over NOON / MIDNIGHT
          and under the credit chip.) Occupies y ~690-820, x ~290-1,410: clear of the band (y <= 590),
          the sea-floor tag (y 894), the gauge column (x >= 1,580) and the chip (y >= 970). */}
      <div style={{ position: "absolute", left: x0, width: x1 - x0, top: 690, display: "flex", justifyContent: "center", opacity: ease(frame, tonnesAt, 12) * (1 - ease(frame, carbonAt, 8)) }}>
        <div style={{ padding: "10px 22px 12px", borderRadius: 16, background: B.gauge, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)", textAlign: "center" }}>
          <div style={{ fontFamily: F.headline, fontSize: 72, lineHeight: 1, whiteSpace: "nowrap" }}>≈ 10,000,000,000 tonnes</div>
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, marginTop: 4, letterSpacing: 1, whiteSpace: "nowrap" }}>OF ANIMALS · UP AND DOWN · EVERY DAY (CURRENT ESTIMATES)</div>
        </div>
      </div>
      <div style={{ opacity: ease(frame, warAt, 10) * (1 - ease(frame, teaseAt, 8)) }}>
        <CaptionPop bottom={250} size={76} color={B.paper}>
          <span style={{ whiteSpace: "nowrap" }}>noticed only because it</span>
          <br />
          <span style={{ whiteSpace: "nowrap", color: B.gauge }}>got in the way of a war</span>
        </CaptionPop>
      </div>
      {/* "this is where the light finally runs out completely": the water behind the hand-off goes dark */}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: lightsOut }} />
      {/* the chart is gone by now, so the hand-off sits at the usual height - on two balanced lines ("out" used to wrap alone).
          The second line waits for its sentence (it used to arrive with the first and then sit for 6 s). */}
      <div style={{ opacity: ease(frame, teaseAt + 8, 8), position: "absolute", left: 120, right: 380, bottom: 150, textAlign: "center", fontFamily: F.caption, fontWeight: 600, fontSize: 80, lineHeight: 1.12, color: B.paper, WebkitTextStroke: `12px ${B.ink}`, paintOrder: "stroke fill" }}>
        <span style={{ whiteSpace: "nowrap" }}>4 down, 8 to go</span>
        <br />
        <span style={{ whiteSpace: "nowrap", opacity: ease(frame, nextAt, 8) }}>
          next: the light <span style={{ color: B.gauge }}>runs out</span>
        </span>
      </div>
    </RungShell>
  );
};
