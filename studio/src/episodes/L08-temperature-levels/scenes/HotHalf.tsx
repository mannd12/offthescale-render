import React from "react";
import { useCurrentFrame } from "remotion";
import { DiverSilhouette } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { T } from "../ladder";
import { Caption, Card, ChipSpec, Clip, Pill, Plate, RungShell, clamp01, cue, lin, mix, rnd } from "./shell";

const ILLU = (source: string): ChipSpec => ({ kind: "ILLUSTRATION", source });

/** 5 · Venus. #30-#33. Planets as a drawn row; MESSENGER inset; Mariner 10 (UV, colour added) and Magellan (radar on a simulated globe), each labelled. */
export const Venus: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const mercAt = cue(t, 0, "Mercury is");
  const dayAt = cue(t, 0, "four hundred and thirty");
  const nightAt = cue(t, 0, "But at night");
  const hotAt = lineAt(t, 1);
  const venusAt = cue(t, 1, "Venus sits");
  const leadAt = cue(t, 1, "hot enough");
  const atmoAt = cue(t, 1, "and it stays");
  const distAt = lineAt(t, 2);
  const aroundAt = cue(t, 2, "What's around");

  let log = mix(T.vostok, T.mercuryDay, ease(frame, dayAt, 20));
  log = mix(log, T.mercuryNight, ease(frame, nightAt + 6, 20));
  log = mix(log, T.venus, ease(frame, venusAt, 24));
  const reading = frame >= venusAt ? "about 465 °C" : frame >= nightAt + 6 ? "−180 °C" : frame >= dayAt ? "430 °C" : "";
  const sub = frame >= venusAt ? "Venus" : frame >= nightAt + 6 ? "Mercury, at night" : frame >= dayAt ? "Mercury, by day" : undefined;

  const row = (1 - ease(frame, venusAt - 6, 10)) * ease(frame, 4, 10);
  const uv1 = ease(frame, venusAt - 6, 10) * (1 - ease(frame, leadAt, 10));
  const radar = ease(frame, leadAt, 10) * (1 - ease(frame, atmoAt, 10));
  const uv2 = ease(frame, atmoAt, 10) * (1 - ease(frame, distAt - 4, 8));
  const chips: ChipSpec[] = frame >= distAt - 4 ? [ILLU("the two planets, charted")] : radar > 0.5 ? [{ kind: "VISUALISATION", source: "NASA/JPL, Magellan radar · colour added" }] : uv1 + uv2 > 0.5 ? [{ kind: "REAL FOOTAGE", source: "NASA, Mariner 10, 1974 · ultraviolet, colour added" }] : [ILLU("the planets, not to scale"), { kind: "REAL FOOTAGE", source: "Mercury: NASA MESSENGER" }];

  // sun at left, the first three planets in a row; the planet on the word lights up
  const px = [640, 930, 1200];
  const secondLit = ease(frame, hotAt + 20, 10);
  const nightK = ease(frame, nightAt, 16);
  return (
    <RungShell t={t} index={4} log={log} reading={reading} sub={sub} chips={chips}>
      {row > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: row }}>
            <circle cx={40} cy={560} r={300 + 6 * Math.sin(frame / 9)} fill={B.gauge} />
            <circle cx={40} cy={560} r={340} fill={B.gauge} opacity={0.25} />
            {px.map((x, i) => <line key={x} x1={x} y1={330} x2={x} y2={790} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />)}
            <circle cx={px[1]} cy={560} r={90} fill="#E8D9A8" opacity={0.25 + 0.75 * secondLit} stroke={secondLit > 0.5 ? B.tease : "none"} strokeWidth={7} />
            <circle cx={px[2]} cy={560} r={94} fill="#3A7BD5" opacity={0.25} />
          </svg>
          <Plate id="l08-mercury" from={0} to={venusAt + 4} box={{ x: px[0] - 110, y: 450, w: 220, h: 220 }} s0={1.02} s1={1.05} bright={frame >= nightAt + 6 ? 0.35 : 1} fade={1} />
          <Pill x={px[0]} y={690} align="center" size={30} opacity={row * ease(frame, mercAt, 8)}>Mercury · closest</Pill>
          <Pill x={px[1]} y={690} align="center" size={30} color={B.tease} opacity={row * secondLit}>second one out</Pill>
          <Card x={px[0] - 130} y={240} big="+430 °C" small="day" size={80} opacity={row * ease(frame, dayAt, 8) * (1 - nightK)} />
          <Card x={px[0] - 130} y={240} big="−180 °C" small="night" size={80} color={B.aqua} opacity={row * nightK} />
          {frame < mercAt ? <Caption bottom={200} size={84} color={B.paper}>the hottest planet?</Caption> : null}
        </>
      ) : null}
      <div style={{ position: "absolute", inset: 0, opacity: uv1 }}>
        <Plate id="l08-venus-uv" from={venusAt - 8} to={leadAt + 14} s0={1} s1={1.2} o0={[50, 40]} bright={0.95} fade={1} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: radar }}>
        <Plate id="l08-venus-globe" from={leadAt - 4} to={atmoAt + 14} s0={1.05} s1={1.35} o0={[45, 50]} o1={[55, 45]} bright={0.95} fade={1} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: uv2 }}>
        <Plate id="l08-venus-uv" from={atmoAt - 4} to={distAt + 8} s0={1.2} s1={1.02} o0={[50, 30]} bright={0.95} fade={1} />
      </div>
      <Pill x={60} y={200} size={28} opacity={uv1 + uv2}>Venus's cloud tops · ultraviolet photo, colour added</Pill>
      <Pill x={60} y={200} size={28} opacity={radar}>Venus's surface · radar on a computer-simulated globe</Pill>
      <Card x={60} y={740} big="about 465 °C" size={100} opacity={ease(frame, venusAt, 10) * (uv1 + radar + uv2)} />
      <Pill x={700} y={790} size={36} color={B.tease} opacity={radar}>hot enough to melt lead</Pill>
      <Pill x={720} y={790} size={34} color={B.gauge} opacity={uv2}>a thick atmosphere traps the heat</Pill>
      {/* line 2: the order by distance against the order by heat */}
      {frame >= distAt - 4 ? (
        <>
          {[
            { y: 340, name: "Mercury", note: "closer to the Sun · by day", c: 430, color: B.aqua },
            { y: 520, name: "Venus", note: "farther from the Sun", c: 465, color: B.tease },
          ].map((p, i) => {
            const w = 900 * (p.c / 465) * ease(frame, distAt + i * 8, 24);
            return (
              <div key={p.name}>
                <div style={{ position: "absolute", left: 160, top: p.y, width: w, height: 110, borderRadius: 14, background: p.color }} />
                <div style={{ position: "absolute", left: 180, top: p.y + 18, fontFamily: F.headline, fontSize: 66, color: B.ink, whiteSpace: "nowrap" }}>{p.name} · {p.c === 465 ? "about " : ""}{p.c} °C</div>
                <Pill x={160} y={p.y + 118} size={26} opacity={ease(frame, distAt + i * 8, 10)}>{p.note}</Pill>
              </div>
            );
          })}
          <div style={{ opacity: ease(frame, aroundAt, 8) }}>
            <Caption bottom={200} size={78} color={B.gauge}>what's around you matters too</Caption>
          </div>
        </>
      ) : null}
    </RungShell>
  );
};

/** 6 · Lava. #35, #37. Real USGS footage throughout; the colour strip is a chart over it and says so. */
export const Lava: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const heatAt = cue(t, 0, "Its lava");
  const readAt = lineAt(t, 1);
  const yellowAt = cue(t, 1, "Yellow");
  const orangeAt = cue(t, 1, "Orange");
  const redAt = cue(t, 1, "Red");
  const coolAt = lineAt(t, 2);
  const log = mix(T.venus, T.lava, ease(frame, heatAt, 24));
  const strip = ease(frame, yellowAt - 4, 10);
  const bands = [
    { at: yellowAt, c: "#FFD23D", text: "yellow · 1,000–1,200 °C" },
    { at: orangeAt, c: "#FF8A2B", text: "orange · 800–1,000 °C" },
    { at: redAt, c: "#E5301F", text: "red · 600–800 °C" },
  ];
  // line 2: a marker runs down the strip, yellow to red, and restarts
  const run = frame >= coolAt ? ((frame - coolAt) / 110) % 1 : 0;
  const chips: ChipSpec[] = [{ kind: "REAL FOOTAGE", source: frame < readAt ? "USGS HVO, Kīlauea, 5 Oct 2021" : "M. Patrick, USGS HVO, 20 Jan 2023 · time-lapse" }];
  if (strip > 0.5) chips.push(ILLU("colour chart over the footage"));
  return (
    <RungShell t={t} index={5} log={log} reading={frame >= heatAt ? "about 1,170 °C" : ""} sub={frame >= heatAt ? "Kīlauea" : undefined} chips={chips}>
      <Clip id="l08-clip-fountains" seconds={30} from={0} to={readAt + 8} start={720} scale={1.25} origin="45% 45%" bright={0.95} />
      <Clip id="l08-clip-lake" seconds={40} from={readAt - 4} to={t.frames + 30} start={300} scale={1.15} origin="45% 60%" bright={1} />
      <Pill x={60} y={200} size={28} opacity={1 - ease(frame, readAt - 4, 8)}>Kīlauea, Hawaii · lava fountains</Pill>
      <Pill x={60} y={200} size={28} opacity={ease(frame, readAt, 8)}>Kīlauea's lava lake · 90 minutes, speeded up</Pill>
      {frame >= heatAt && frame < readAt ? <Card x={60} y={760} big="about 1,170 °C" size={100} opacity={ease(frame, heatAt, 10) * (1 - ease(frame, readAt - 6, 6))} /> : null}
      {strip > 0
        ? bands.map((b, i) => (
            <div key={b.c} style={{ position: "absolute", left: 60, top: 310 + i * 130, width: 620, height: 112, borderRadius: 14, background: b.c, opacity: ease(frame, b.at, 8), boxShadow: "0 8px 28px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", paddingLeft: 24, fontFamily: F.headline, fontSize: 48, color: B.ink, whiteSpace: "nowrap" }}>{b.text}</div>
          ))
        : null}
      {frame >= coolAt ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d={`M710 ${320 + run * 350} l-30 16 l30 16 z`} fill={B.paper} />
            <path d={`M730 330 V ${320 + run * 350 + 10}`} stroke={B.paper} strokeWidth={6} strokeLinecap="round" />
          </svg>
          <Pill x={760} y={310 + run * 350} size={32}>cooling</Pill>
        </>
      ) : null}
    </RungShell>
  );
};

/** 7 · The Sun's face and under your feet. #39-#42. A real white-light photo; a drawn Earth and a drawn anvil, because no one has a picture of either. */
export const SunFace: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const downAt = lineAt(t, 1);
  const sixAt = cue(t, 1, "around six thousand");
  const roughAt = cue(t, 1, "That's roughly");
  const noOneAt = lineAt(t, 2);
  const squeezeAt = cue(t, 2, "They squeezed");
  const laserAt = cue(t, 2, "heated them");
  const workedAt = cue(t, 2, "and worked");
  const faceAt = cue(t, 0, "about five");
  const log = mix(T.lava, T.sunFace, ease(frame, faceAt, 24));
  const photo = 1 - ease(frame, downAt, 10);
  const anvil = ease(frame, squeezeAt - 6, 10);
  const earth = ease(frame, downAt, 14) * (1 - ease(frame, squeezeAt - 8, 8));
  const chips: ChipSpec[] = photo > 0.5 ? [{ kind: "REAL FOOTAGE", source: "Geoff Elston · CC BY 4.0 · through a solar filter" }] : [ILLU(anvil > 0.5 ? "a diamond anvil, drawn · not to scale" : "inside the Earth, drawn · not to scale")];
  const ER = 360;
  const EX = 620;
  const EY = 610 + 90 * (1 - ease(frame, downAt, 30));
  const glow = 0.5 + 0.5 * Math.sin(frame / 12);
  const press = ease(frame, squeezeAt + 6, 30);
  return (
    <RungShell t={t} index={6} log={log} reading={frame >= faceAt ? "about 5,500 °C" : ""} sub={frame >= faceAt ? "the Sun's visible surface" : undefined} chips={chips}>
      <Plate id="l08-sun-white" from={0} to={downAt + 8} box={{ x: 330, y: 120, w: 900, h: 900 }} s0={1} s1={1.35} o0={[60, 50]} bright={0.95} />
      <Pill x={60} y={200} size={28} opacity={photo}>the Sun's visible surface, in white light</Pill>
      <Card x={60} y={760} big="about 5,500 °C" size={100} color={B.gauge} opacity={ease(frame, faceAt, 10) * photo} />
      {earth > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: earth }}>
            <defs>
              <clipPath id="l08-cut"><rect x={EX - ER - 10} y={EY - ER - 10} width={ER + 10} height={2 * ER + 20} /></clipPath>
            </defs>
            <circle cx={EX} cy={EY} r={ER} fill="#2E6FB7" />
            <g clipPath="url(#l08-cut)">
              <circle cx={EX} cy={EY} r={ER} fill="#7B3A1E" />
              <circle cx={EX} cy={EY} r={ER * 0.86} fill="#C2531C" />
              <circle cx={EX} cy={EY} r={ER * 0.55} fill="#F08A24" />
            </g>
            <circle cx={EX} cy={EY} r={ER * 0.22 + 6 * glow} fill={B.gauge} />
            <circle cx={EX} cy={EY} r={ER * 0.22 + 30} fill={B.gauge} opacity={0.3 * glow} />
            <path d={`M${EX} ${EY - ER} V ${EY - ER * 0.25}`} stroke={B.paper} strokeWidth={5} strokeDasharray="14 12" strokeDashoffset={-frame * 1.5} />
            {/* the Sun, drawn the same colour, on the far side of the comparison */}
            <circle cx={1220} cy={560} r={90 + 4 * glow} fill={B.gauge} opacity={ease(frame, roughAt, 10)} />
          </svg>
          <DiverSilhouette size={80} color={B.paper} style={{ position: "absolute", left: EX - 40, top: EY - ER - 74, opacity: earth }} />
          <Pill x={EX + 110} y={EY - 40} size={36} color={B.gauge} opacity={ease(frame, sixAt, 10) * earth}>about 6,000 °C ± 500</Pill>
          <Pill x={1220} y={670} align="center" size={28} opacity={ease(frame, roughAt, 10) * earth}>the Sun's surface: about 5,500 °C</Pill>
          <div style={{ opacity: ease(frame, roughAt + 20, 8) * earth }}>
            <Caption bottom={100} size={70} color={B.gauge}>roughly as hot, under your feet</Caption>
          </div>
        </>
      ) : null}
      {anvil > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: anvil }}>
            {/* two diamonds closing on a speck */}
            <path d={`M420 ${240 + 66 * press} h400 l-140 ${220} h-120 z`} fill="#BFE9F7" stroke={B.paper} strokeWidth={5} />
            <path d={`M420 ${880 - 66 * press} h400 l-140 ${-220} h-120 z`} fill="#BFE9F7" stroke={B.paper} strokeWidth={5} />
            <circle cx={620} cy={560} r={20 + 8 * ease(frame, laserAt, 20) * glow} fill={frame >= laserAt ? B.gauge : "#8CA0B3"} />
            {frame >= laserAt ? <line x1={120} y1={560} x2={600} y2={560} stroke={B.tease} strokeWidth={8} opacity={0.7 + 0.3 * glow} /> : null}
            {frame >= laserAt ? <line x1={1120} y1={560} x2={640} y2={560} stroke={B.tease} strokeWidth={8} opacity={0.7 + 0.3 * glow} /> : null}
          </svg>
          <Pill x={660} y={596} size={30} opacity={ease(frame, squeezeAt, 10)}>a tiny sample of iron</Pill>
          <Pill x={140} y={500} size={30} color={B.tease} opacity={ease(frame, laserAt, 10)}>lasers</Pill>
          <Pill x={900} y={200} size={30} color={B.gauge} opacity={ease(frame, workedAt, 10)}>then worked out from there</Pill>
        </>
      ) : null}
      {frame >= noOneAt && anvil <= 0 ? <Pill x={900} y={200} size={36} color={B.paper} opacity={ease(frame, noOneAt, 8)}>no one has been there</Pill> : null}
    </RungShell>
  );
};

/** 8 · Lightning. #43, #5, #44, #45. Real NOAA/NSSL photo; temperature vs heat drawn; real ISS footage with the thin air charted over it, and said so. */
export const Lightning: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const airAt = cue(t, 0, "Lightning heats");
  const fiveAt = cue(t, 0, "That's about five");
  const holdAt = lineAt(t, 1);
  const notAt = cue(t, 1, "Temperature is not");
  const fastAt = cue(t, 1, "Temperature is how");
  const heatAt = cue(t, 1, "Heat is");
  const upAt = lineAt(t, 2);
  const issAt = cue(t, 2, "The Space Station");
  const thinAt = cue(t, 2, "And it's fine");
  const lastAt = lineAt(t, 3);
  const log = mix(T.sunFace, T.lightning, ease(frame, airAt, 24));
  const picture = 1 - ease(frame, holdAt, 10);
  const concept = ease(frame, holdAt, 10) * (1 - ease(frame, upAt - 4, 8));
  const space = ease(frame, upAt - 4, 10);
  const chips: ChipSpec[] = picture > 0.5 ? [{ kind: "REAL FOOTAGE", source: "Sean Waugh, NOAA/NSSL, VORTEX II" }] : concept > 0.5 ? [ILLU("particles, drawn")] : frame >= thinAt ? [{ kind: "REAL FOOTAGE", source: "NASA Johnson · time-lapse from the ISS" }, ILLU("the dots are drawn")] : [{ kind: "REAL FOOTAGE", source: "NASA Johnson · time-lapse from the ISS" }];
  const suns = Math.min(5, Math.floor(lin(frame, fiveAt, fiveAt + 40) * 5.99));
  const dot = (cx: number, cy: number, i: number, spd: number, color: string, r = 11) => {
    const a = rnd(i) * Math.PI * 2;
    const R = 270;
    // wraps inside a square of side 2R, so no dot leaves the footage's frame
    const wrap = (v: number) => ((v % (2 * R)) + 2 * R) % (2 * R) - R;
    const x = cx + wrap(Math.cos(a) * frame * spd + rnd(i + 11) * 2 * R);
    const y = cy + wrap(Math.sin(a) * frame * spd + rnd(i + 23) * 2 * R);
    return <circle key={i} cx={x} cy={y} r={r} fill={color} />;
  };
  return (
    <RungShell t={t} index={7} log={log} reading={frame >= airAt ? "about 28,000 °C" : ""} sub={frame >= airAt ? "the air around lightning" : undefined} chips={chips}>
      <Plate id="l08-lightning-a" from={0} to={holdAt + 8} s0={1.02} s1={1.3} o0={[30, 50]} o1={[42, 48]} bright={1} />
      <Card x={60} y={200} big="about 28,000 °C" size={84} opacity={ease(frame, airAt, 10) * picture} />
      <div style={{ position: "absolute", left: 60, top: 330, display: "flex", gap: 12, opacity: picture * ease(frame, fiveAt, 8) }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ width: 84, height: 84, borderRadius: 42, background: i < suns ? B.gauge : "rgba(5,14,24,0.7)", border: `4px solid ${B.gauge}` }} />
        ))}
      </div>
      <Pill x={60} y={430} size={28} opacity={picture * ease(frame, fiveAt + 20, 8)}>about 5 times the surface of the Sun</Pill>
      {concept > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: concept * ease(frame, fastAt - 4, 10) }}>
            <rect x={160} y={320} width={520} height={440} rx={20} fill="rgba(255,255,255,0.05)" stroke={B.tease} strokeWidth={5} />
            <rect x={760} y={320} width={520} height={440} rx={20} fill="rgba(255,255,255,0.05)" stroke={B.gauge} strokeWidth={5} />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const yy = 370 + i * 50;
              const xx = 190 + ((frame * (6 + i) + i * 70) % 460);
              return <g key={i}><path d={`M${Math.max(170, xx - 40)} ${yy} H${xx}`} stroke={B.tease} strokeWidth={5} /><circle cx={xx} cy={yy} r={11} fill={B.tease} /></g>;
            })}
            {frame >= heatAt ? [0, 1, 2, 3, 4, 5].map((i) => {
              const k = ((frame + i * 18) % 60) / 60;
              return <path key={i} d={`M${820 + k * 300} ${380 + i * 60} h60 m-16 -12 l16 12 l-16 12`} stroke={B.gauge} strokeWidth={7} fill="none" opacity={ease(frame, heatAt, 10)} />;
            }) : null}
          </svg>
          <div style={{ position: "absolute", left: 160, top: 180, fontFamily: F.headline, fontSize: 100, color: B.paper, opacity: concept * ease(frame, notAt, 8) * (1 - ease(frame, fastAt, 8)), whiteSpace: "nowrap" }}>temperature ≠ heat</div>
          <Pill x={160} y={260} size={32} color={B.tease} opacity={concept * ease(frame, fastAt, 8)}>temperature: how fast they move</Pill>
          <Pill x={760} y={260} size={32} color={B.gauge} opacity={concept * ease(frame, heatAt, 8)}>heat: total energy they transfer</Pill>
          {frame < notAt ? <Caption bottom={460} size={84} color={B.paper}>hold on to this</Caption> : null}
        </>
      ) : null}
      {/* the source film holds a Galileo quote card, then black, until about 14 s: entered at 14.7 s. Its black wedge at top left is cropped by the zoom and origin */}
      <Clip id="l08-clip-iss" seconds={60} from={upAt - 4} to={t.frames + 30} start={440} scale={1.2} origin="85% 90%" bright={0.95} box={{ x: 60, y: 150, w: 1300, h: 731 }} />
      <Pill x={80} y={170} size={28} opacity={space}>the real view from the Space Station</Pill>
      <Card x={80} y={240} big="2,000 °C or more" small="the upper atmosphere" size={72} color={B.tease} ink={B.paper} opacity={ease(frame, upAt + 6, 10) * (1 - ease(frame, lastAt, 10))} />
      <Pill x={80} y={410} size={30} opacity={ease(frame, issAt, 10) * (1 - ease(frame, lastAt, 10))}>the Station orbits in that layer</Pill>
      <Pill x={80} y={475} size={30} color={B.aqua} opacity={ease(frame, thinAt + 20, 10) * (1 - ease(frame, lastAt, 10))}>air so thin we call it outer space</Pill>
      {frame >= thinAt ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, thinAt, 10) }}>
          {[0, 1, 2, 3, 4, 5].map((i) => dot(1040, 540, i, 2.4, B.tease))}
        </svg>
      ) : null}
      <div style={{ opacity: ease(frame, lastAt, 8) }}>
        <Caption bottom={230} size={62} color={B.paper}>high temperature, hardly anything to carry it</Caption>
      </div>
    </RungShell>
  );
};
