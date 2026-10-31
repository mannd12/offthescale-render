import React from "react";
import { useCurrentFrame } from "remotion";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { Big, Caption, Clip, Inset, Photo, Pill, Tag, VolcanoShell, lin, mix } from "./shell";

const PANEL = { x: 130, y: 200, w: 1280, h: 720 };
const FILM = "USGS / D. Swanson, 1980, 16 mm";

/** s4 · VEI 3. Sources #2, #6, #7, #13, #21, #22. Twenty ticks; 19 km; areas to scale. */
export const Vei3: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const L3 = lineAt(t, 3);
  const L4 = lineAt(t, 4);
  const twenty = within(t, 0, 0.34);
  const dur = within(t, 0, 0.62);
  const ashAt = within(t, 2, 0.68);
  const lookBack = within(t, 3, 0.4);
  const ticks = Math.floor(20 * lin(f, twenty, dur));
  const col = lin(f, L1 + 4, L2 - 20);
  const sq = 300 * ease(f, ashAt, 20);
  // areas to scale: 20.6 and 145 million m³, sides proportional to the square root
  const a = 90;
  const b = a * Math.sqrt(145 / 20.6);
  return (
    <VolcanoShell t={t} index={3} prevLit={2} lit={3} credit={f < L2 ? { kind: "real", source: "R. G. McGimsey, USGS/AVO, 4 Apr 2009" } : f < L3 ? { kind: "real", source: "G. McGimsey, AVO, 31 Mar 2009" } : f < L4 ? { kind: "illustration", source: "areas to scale, two different measures" } : { kind: "real", source: "R. G. McGimsey, USGS/AVO, 4 Apr 2009" }}>
      {f < L2 ? <Photo id="l07-red-apr" a={0} b={L2} s0={1} s1={1.28} o0={[62, 32]} brightness={0.95} /> : null}
      {f < twenty ? <Big x={100} y={230} big="SEVERE" small="roughly once a year" opacity={ease(f, 8, 10)} size={110} /> : null}
      {f >= twenty && f < L1 ? <Pill x={100} y={206} size={32}>Redoubt, Alaska, between explosions, 4 April 2009</Pill> : null}
      {f >= twenty && f < L1 ? (
        <div style={{ position: "absolute", left: 100, top: 270, display: "flex", gap: 8 }}>
          {Array.from({ length: 20 }, (_, i) => <div key={i} style={{ width: 52, height: 76, borderRadius: 6, background: i < ticks ? B.tease : "rgba(5,14,24,0.7)" }} />)}
        </div>
      ) : null}
      {f >= twenty && f < L1 ? <Big x={100} y={370} big={`${ticks} EXPLOSIONS`} small={f >= dur ? "each from under a minute to about half an hour" : undefined} size={64} /> : null}
      {/* line 1: the height bar */}
      {f >= L1 && f < L2 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={200} y={880 - 600 * col} width={60} height={600 * col} fill={B.gauge} rx={6} />
        </svg>
      ) : null}
      {f >= L1 + 4 && f < L2 ? <Big x={290} y={290} big="UP TO 19 KM" small="the highest plumes" opacity={ease(f, L1 + 4, 10)} size={84} /> : null}
      {f >= L2 ? <Photo id="l07-red-mar" a={L2} b={L3} s0={1} s1={1.22} o0={[50, 30]} o1={[50, 70]} brightness={f >= L3 && f < L4 ? 0.12 : f >= L4 ? 0.3 : 0.9} /> : null}
      {f >= L2 && f < ashAt ? <Big x={100} y={230} big="MEASURED AFTERWARDS" small="from what fell" opacity={ease(f, L2 + 6, 10)} size={84} /> : null}
      {f >= ashAt && f < L3 ? (
        <>
          <div style={{ position: "absolute", left: 180, top: 300, width: sq, height: sq, border: `6px solid ${B.gauge}`, background: "rgba(255,200,61,0.25)" }} />
          <Big x={100} y={210} big="80,000+ km² OF ASHFALL" small="the area, drawn as a square" opacity={ease(f, ashAt, 10)} size={70} />
        </>
      ) : null}
      {/* line 3: Redoubt beside Mauna Loa */}
      {f >= L3 && f < L4 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={240} y={800 - a} width={a} height={a} fill={B.tease} />
            {f >= lookBack ? <rect x={620} y={800 - b * ease(f, lookBack, 24)} width={b} height={b * ease(f, lookBack, 24)} fill="#FFE9A8" /> : null}
          </svg>
          <Big x={100} y={210} big="ABOUT 20 MILLION m³" small="Redoubt, level 3, rock (dense-rock)" opacity={ease(f, L3 + 4, 10)} size={58} />
          <Tag x={240} y={812} size={30} color={B.tease}>Redoubt</Tag>
          {f >= lookBack ? <Tag x={620} y={812} size={30} color="#FFE9A8">Mauna Loa, level 0, lava and ash: about 7 times</Tag> : null}
        </>
      ) : null}
      {f >= L4 ? <Caption size={118} bottom={330} color={B.paper}>Violence, not size</Caption> : null}
    </VolcanoShell>
  );
};

/** s5 · VEI 4. Sources #6, #7, #24, #25. Plume, then 300 lights going out (a count, not a map). */
export const Vei4: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const L3 = lineAt(t, 3);
  const size = within(t, 1, 0.42);
  const routes = within(t, 1, 0.82);
  const flights = within(t, 2, 0.45);
  const pax = within(t, 2, 0.78);
  const decades = within(t, 3, 0);
  const par = within(t, 3, 0.2);
  const four = within(t, 3, 0.8);
  const dark = Math.floor(300 * lin(f, L2 + 6, flights));
  return (
    <VolcanoShell t={t} index={4} prevLit={3} lit={4} credit={f < routes ? { kind: "real", source: "Boaworm, CC BY 3.0, 17 Apr 2010" } : f < L2 ? { kind: "real", source: "NASA satellite, 19 Apr 2010" } : f < L3 ? { kind: "illustration", source: "a count, not a map" } : { kind: "real", source: "Boaworm, CC BY 3.0, 17 Apr 2010" }}>
      {f < routes || f >= L3 ? <Photo id="l07-eyja-plume" a={f < routes ? 0 : L3} b={f < routes ? routes : t.frames} s0={f < routes ? 1 : 1.22} s1={f < routes ? 1.25 : 1} o0={[65, 35]} brightness={f < routes ? 0.95 : 0.5} /> : null}
      {f < L1 ? <Big x={100} y={230} big="CATACLYSMIC" small="that is the official word" opacity={ease(f, 8, 10)} size={110} /> : null}
      {f >= L1 && f < routes ? <Pill x={100} y={206} size={34}>Eyjafjallajökull, Iceland, 2010</Pill> : null}
      {f >= size && f < routes ? <Big x={100} y={280} big="0.27 km³, “MODEST”" small="in plumes 3 to 10 km high" opacity={ease(f, size, 10)} size={80} /> : null}
      {f >= routes && f < L2 ? <div style={{ position: "absolute", inset: 0, background: B.ink }} /> : null}
      {f >= routes && f < L2 ? <Inset id="l07-eyja-sat" x={460} y={190} w={640} h={740} a={routes} b={L2} s0={1} s1={1.25} pos="50% 20%" origin="55% 20%" /> : null}
      {f >= routes && f < L2 ? <Pill x={780} y={204} size={28} align="center">the plume from orbit, 19 April</Pill> : null}
      {/* line 2: the count of airports closes one by one */}
      {f >= L2 && f < L3 ? <div style={{ position: "absolute", inset: 0, background: "#0A0F16" }} /> : null}
      {f >= L2 && f < L3 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 300 }, (_, i) => (
              <circle key={i} cx={130 + (i % 30) * 46} cy={400 + Math.floor(i / 30) * 46} r={15} fill={(i * 7) % 300 < dark ? "#26303A" : B.gauge} />
            ))}
          </svg>
          <Big x={120} y={205} big={`${dark >= 300 ? "300+" : dark} AIRPORTS CLOSED`} small="about two dozen countries, one week in April" size={72} />
          {f >= flights ? <Big x={120} y={870} big="100,000+ FLIGHTS" opacity={ease(f, flights, 10)} size={56} color={B.tease} ink={B.paper} /> : null}
          {f >= pax ? <Big x={760} y={870} big="7 MILLION PASSENGERS" opacity={ease(f, pax, 10)} size={56} color={B.tease} ink={B.paper} /> : null}
        </>
      ) : null}
      {f >= decades && f < par ? <Big x={100} y={230} big="EVERY FEW DECADES" opacity={ease(f, decades, 10)} size={96} /> : null}
      {f >= par && f < four ? <Big x={100} y={230} big="MODEST, AT LEVEL 4" small="Parícutin: at the end of the video" opacity={ease(f, par, 10)} size={84} /> : null}
      {f >= four ? <Caption size={108} bottom={280} color={B.gauge}>Four more levels</Caption> : null}
    </VolcanoShell>
  );
};

/** Section through a drawn mountain. Bulge grows and then slides; `up` raises a column. */
const Section: React.FC<{ bulge: number; slide: number; up: number }> = ({ bulge, slide, up }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <rect x={0} y={880} width={1560} height={200} fill="#231C18" />
    <path d={`M 160 880 L 640 ${380 + 50 * slide} L 720 ${380 + 50 * slide} L ${1160 - 120 * slide} 880 Z`} fill="#4A3D35" />
    {up > 0 ? <path d={`M 650 ${400} C 600 ${400 - 200 * up}, 560 ${400 - 280 * up}, 680 ${400 - 300 * up} C 800 ${400 - 280 * up}, 760 ${400 - 200 * up}, 710 400 Z`} fill="#8E8A86" /> : null}
    <path d={`M ${900 + 30 * bulge} 560 Q ${1020 + 150 * bulge} 640 ${1040 + 30 * bulge} 780 L 900 780 Z`} transform={`translate(${620 * slide} ${150 * slide})`} fill={slide > 0 ? B.tease : "#6A5548"} />
  </svg>
);

/** s6 · VEI 5. Sources #26-30. The real 16 mm film runs as a large panel through the rung; the mechanism is drawn between. */
export const Vei5: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const L3 = lineAt(t, 3);
  const L4 = lineAt(t, 4);
  const L5 = lineAt(t, 5);
  const L6 = lineAt(t, 6);
  const out140 = within(t, 1, 0.5);
  const slid = within(t, 1, 0.68);
  const fifteen = within(t, 2, 0.5);
  const hours = within(t, 4, 0);
  const world = within(t, 4, 0.2);
  const spokane = within(t, 4, 0.56);
  const land = within(t, 6, 0.42);
  const same = within(t, 6, 0.64);
  const grew = lin(f, L1, out140);
  const u = 3.0;
  const c1 = 110;
  const c2 = c1 * Math.cbrt(2.5);
  return (
    <VolcanoShell t={t} index={5} prevLit={4} lit={5} credit={f < L1 ? { kind: "real", source: FILM } : f < L2 ? { kind: "illustration", source: "the mountain, not to scale" } : f < L5 ? { kind: "real", source: FILM } : f < L6 ? { kind: "real", source: "L. Topinka, USGS, Sept 1980" } : { kind: "illustration", source: "cubes to scale" }}>
      {f < L1 ? <Clip id="l07-clip-column" seconds={16} box={PANEL} scale={1.24} /> : null}
      {f < L1 ? <Pill x={160} y={224} size={34}>Mount St. Helens, 18 May 1980</Pill> : null}
      {f < L1 ? <Big x={160} y={290} big="A FIVE" small="paroxysmal" opacity={ease(f, 40, 10)} size={96} /> : null}
      {/* line 1: the drawn bulge, the slide */}
      {f >= L1 && f < L2 ? <Section bulge={grew} slide={ease(f, slid, 30)} up={0} /> : null}
      {f >= L1 && f < slid ? <Big x={100} y={210} big={`${Math.round(140 * grew)} M OUTWARD`} small="about 2 metres a day, for weeks" size={76} /> : null}
      {f >= slid && f < L2 ? <Big x={100} y={210} big="LARGEST DEBRIS AVALANCHE" small="in recorded history" opacity={ease(f, slid, 10)} size={72} color={B.tease} ink={B.paper} /> : null}
      {/* line 2: the film, with its numbers */}
      {f >= L2 && f < L3 ? <Clip id="l07-clip-billow" seconds={16} box={PANEL} scale={1.24} /> : null}
      {f >= L2 + 6 && f < L3 ? <Big x={160} y={230} big={f < fifteen ? `${Math.round(24 * lin(f, L2 + 6, fifteen))} KM` : "24+ KM UP"} small={f >= fifteen ? "in under 15 minutes" : undefined} size={92} /> : null}
      {/* line 3: the wing in the shot proves the plane */}
      {f >= L3 && f < L4 ? <Clip id="l07-clip-wing" seconds={16} box={PANEL} scale={1.24} /> : null}
      {f >= L3 + 4 && f < L4 ? <Big x={160} y={230} big="THIS IS REAL FILM" small="16 mm, hand-wound, filmed by a USGS geologist" opacity={ease(f, L3 + 4, 10)} size={72} /> : null}
      {f >= L3 + 40 && f < L4 ? <Pill x={200} y={860} size={30} opacity={ease(f, L3 + 40, 10)}>That white shape is the plane's wing</Pill> : null}
      {/* line 4: nine hours, the world, Spokane */}
      {f >= L4 && f < L5 ? <Clip id="l07-clip-column" seconds={16} box={PANEL} scale={1.3} origin="60% 40%" /> : null}
      {f >= hours && f < world ? <Big x={160} y={230} big="9 HOURS OF ASH" opacity={ease(f, hours, 10)} size={84} /> : null}
      {f >= world && f < spokane ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <circle cx={1130} cy={560} r={210} fill="rgba(5,14,24,0.85)" stroke={B.aqua} strokeWidth={6} />
            <circle cx={1130} cy={560} r={240} fill="none" stroke={B.gauge} strokeWidth={14} strokeDasharray={`${2 * Math.PI * 240 * lin(f, world, spokane - 8)} 2000`} transform="rotate(-90 1130 560)" />
          </svg>
          <Big x={160} y={230} big="AROUND THE WORLD IN 15 DAYS" opacity={ease(f, world, 10)} size={60} />
        </>
      ) : null}
      {f >= spokane && f < L5 ? <div style={{ position: "absolute", left: PANEL.x + 4, top: PANEL.y + 4, width: PANEL.w, height: PANEL.h, background: "#000", opacity: 0.75 * ease(f, spokane, 40) }} /> : null}
      {f >= spokane && f < L5 ? <Big x={160} y={230} big="SPOKANE, 400 KM AWAY" small="complete darkness" opacity={ease(f, spokane, 10)} size={72} /> : null}
      {/* line 5: the land */}
      {f >= L5 && f < L6 ? <Photo id="l07-msh-blowdown" a={L5} b={L6} s0={1.05} s1={1.2} o0={[50, 30]} o1={[60, 30]} brightness={0.9} /> : null}
      {f >= L5 && f < L6 ? <Pill x={100} y={206} size={30}>Smith Creek valley, four months later</Pill> : null}
      {f >= L5 + 8 && f < L6 ? <Big x={100} y={270} big="ABOUT 600 km²" small="of devastated land" opacity={ease(f, L5 + 8, 10)} size={92} /> : null}
      {/* line 6: the two cubes, then the same mountain on two steps */}
      {f >= L6 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {[{ x: 300, c: c1, col: B.gauge, a: L6 }, { x: 800, c: c2, col: B.tease, a: land }].map(({ x, c, col, a }) => {
            const k = ease(f, a, 18);
            if (k <= 0) return null;
            const s = c * k * u * 0.6;
            return (
              <g key={x}>
                <rect x={x} y={760 - s} width={s} height={s} fill={col} />
                <path d={`M ${x} ${760 - s} l ${s * 0.35} ${-s * 0.35} h ${s} l ${-s * 0.35} ${s * 0.35} Z`} fill={col} opacity={0.75} />
                <path d={`M ${x + s} 760 l ${s * 0.35} ${-s * 0.35} v ${-s} l ${-s * 0.35} ${s * 0.35} Z`} fill={col} opacity={0.55} />
              </g>
            );
          })}
        </svg>
      ) : null}
      {f >= L6 ? <Tag x={300} y={780} size={34} color={B.gauge}>ash: about 1 km³</Tag> : null}
      {f >= land ? <Tag x={800} y={780} size={34} color={B.tease} opacity={ease(f, land, 10)}>landslide: 2.5 km³</Tag> : null}
      {f >= same ? <Big x={300} y={190} big={`SAME MOUNTAIN: LEVEL 2, LEVEL 5`} opacity={ease(f, same, 10)} size={Math.round(mix(58, 64, lin(f, same, t.frames)))} /> : null}
      {f >= same ? <div style={{ position: "absolute", left: 300, top: 860, fontFamily: F.caption, fontWeight: 600, fontSize: 48, color: B.paper, opacity: ease(f, same + 20, 10) }}>the difference: how it came out</div> : null}
    </VolcanoShell>
  );
};
