import React from "react";
import { useCurrentFrame } from "remotion";
import { DiverSilhouette } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { Img } from "remotion";
import { levelImage } from "../../../brand/kit";
import { CaptionPop, NumberCard, PillTag, RungShell, Tag } from "./shell";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** linear 0-1 between two frames (constant speed: dashes, counters, slow camera creep) */
const lin = (frame: number, from: number, to: number) => clamp01((frame - from) / Math.max(1, to - from));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const HOT = "#FF7A45";

/**
 * A NumberCard whose small line grows span by span, each span rendered only from its cue (nothing readable before
 * it is said). `sizer` reserves the headline's final width while a counter runs, so the card does not jitter.
 */
const BuildCard: React.FC<{ x: number; y: number; big: string; sizer?: string; parts?: { at: number; text: string }[]; frame: number; size?: number; color?: string; ink?: string; opacity?: number }> = ({ x, y, big, sizer, parts = [], frame, size = 64, color = B.gauge, ink = B.ink, opacity = 1 }) => {
  if (opacity <= 0) return null;
  const shown = parts.filter((p) => frame >= p.at);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, padding: "10px 22px 12px", borderRadius: 16, background: color, color: ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
      <div style={{ position: "relative", fontFamily: F.headline, fontSize: size, lineHeight: 1, whiteSpace: "nowrap" }}>
        {sizer ? (
          <>
            <span style={{ visibility: "hidden" }}>{sizer}</span>
            <span style={{ position: "absolute", left: 0, top: 0 }}>{big}</span>
          </>
        ) : (
          big
        )}
      </div>
      {shown.length > 0 ? (
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: Math.round(size * 0.36), marginTop: 4, letterSpacing: 1, whiteSpace: "nowrap" }}>
          {shown.map((p) => (
            <span key={p.text}>{p.text}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

/**
 * 5 · The speed of sound, Mach 1. Lines 0-9. Sources #5, #6, #21.
 * Plate: NASA ARC-1948-A-13146-8 - images-api.nasa.gov (read 2026-10-07): "Schlieren photograph of the flow around
 * airplane models showing effect of Sweptback on Shock Waves - M = 1.2", NACA Ames, 28 July 1948.
 * 0-1 sound pulses, drawn (plate dimmed) · 2-3a the schlieren photo itself · 3b-5 the boom on the ground, drawn
 * (plate dimmed) · 6 the photo · 7-8 the X-1 lakebed photo (E-1914) · 9 tease.
 */
export const SpeedOfSound: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  // line 0: "...three hundred and forty-three metres a second (0.16-0.37) - roughly 1,235 km/h (0.42-0.70), at twenty degrees Celsius (0.71-0.83). ...Mach one (0.9)"
  const msAt = within(t, 0, 0.16);
  const metresAt = within(t, 0, 0.3);
  const kmAt = within(t, 0, 0.45);
  const degAt = within(t, 0, 0.72);
  const machAt = within(t, 0, 0.9);
  // line 1: "...depends on the temperature of the air (0.18), so high up, where it's cold (0.62), Mach one is slower (0.85)"
  const tempAt = within(t, 1, 0.18);
  const coldAt = within(t, 1, 0.62);
  const slowerAt = within(t, 1, 0.85);
  const boomAt = lineAt(t, 2);
  const pileAt = lineAt(t, 3);
  const shockAt = within(t, 3, 0.19); // "...into shock waves"
  const diaAt = within(t, 3, 0.27); // "and those shock waves spread out and reach the ground..."
  const crackAt = within(t, 3, 0.6); // "...a sonic boom"
  const dbAt = within(t, 3, 0.68); // "About a hundred and ten decibels"
  const thunderAt = within(t, 3, 0.86); // "...or a thunderclap"
  const onceAt = lineAt(t, 4);
  const notOnceAt = within(t, 4, 0.33); // "the boom isn't a one-off"
  const carpetAt = within(t, 5, 0.05); // "made continuously"
  const sweepAt = within(t, 5, 0.6); // "sweeps along the ground ... like a carpet"
  const wallAt = lineAt(t, 6);
  const yeagerAt = lineAt(t, 7);
  const dateAt = within(t, 7, 0.03);
  const pushAt = within(t, 7, 0.66); // "in a small rocket plane, the Bell X-1"
  const nasaAt = lineAt(t, 8);
  const teaseAt = lineAt(t, 9);
  const nextAt = within(t, 9, 0.42); // "Next: a plane built to live above this wall"

  const lanes = ease(frame, 0, 12) * (1 - ease(frame, boomAt - 10, 10));
  const photo1 = ease(frame, boomAt - 4, 14) * (1 - ease(frame, diaAt - 10, 12));
  const dia = ease(frame, diaAt, 14) * (1 - ease(frame, wallAt - 10, 10));
  const photo2 = ease(frame, wallAt - 2, 14);
  const photo = Math.max(photo1, photo2);
  // the X-1 lakebed photo (manifest: x1-lakebed, NASA Armstrong 1955, E-1914) is up from line 7 to the tease; the chip follows it
  const x1 = ease(frame, yeagerAt, 12) * (1 - ease(frame, teaseAt, 8));

  // Camera on the schlieren scan. Its crop (ladder.ts: x1.6 about 50% / 76.5%) shows the window x 18.75-81.25 %,
  // y 28.69-91.19 % of the scan; anything outside is scan margin or the data board. So the move is written as the
  // visible window's left/top (L, T, in %) and an extra scale m, and converted to the shell's scale + origin:
  // L >= 18.75, T >= 28.69, L + 62.5/m <= 81.25, T + 62.5/m <= 91.19 hold for every state below.
  const e2 = ease(frame, boomAt, 40); // line 2: push in on the swept-wing model
  const e3 = ease(frame, pileAt, 45); // line 3: travel along the flow
  const camA = { L: 18.75 + 5.75 * e3, T: 28.69 + 4.3 * e2, m: 1 + 0.11 * e2 + 0.04 * lin(frame, boomAt, diaAt) };
  const camB = { L: 21.5, T: 31, m: 1.15 - 0.07 * lin(frame, wallAt, yeagerAt) }; // line 6: slow pull-back
  const u = lin(frame, teaseAt, t.frames); // line 9: pull back to the full crop
  const camC = { L: 21.5 - 2.75 * u, T: 31 - 2.31 * u, m: 1.12 - 0.12 * u };
  const kB = ease(frame, diaAt + 20, 30); // both hand-overs happen while the plate is dimmed or covered
  const kC = frame >= teaseAt - 10 ? 1 : 0;
  const cam = kC ? camC : { L: mix(camA.L, camB.L, kB), T: mix(camA.T, camB.T, kB), m: mix(camA.m, camB.m, kB) };
  const camK = 1 - 1 / (1.6 * cam.m);
  const plateMove = { scale: cam.m, origin: `${cam.L / camK}% ${cam.T / camK}%` };

  // lines 0-1: one pulse crosses the 343-metre bar every second (30 frames); the cold lane's pulse is slower (no figure given)
  const ph = frame >= msAt ? ((frame - msAt) % 30) / 30 : 0;
  const LX0 = 160;
  const LW = 1180;
  const pulse = (x: number, y: number, color: string) => (
    <g>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${x - i * 16} ${y - 30} Q ${x - i * 16 + 16} ${y} ${x - i * 16} ${y + 30}`} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" opacity={1 - i * 0.3} />
      ))}
    </g>
  );

  // lines 3-5: the aircraft holds its place on screen and the ground runs under it; the cone's foot is where the boom is heard
  const FOOT = 580;
  const GY = 820;
  const py = 400 + Math.sin(frame / 17) * 6;
  const scroll = 5 * (frame - diaAt);
  // each listener reaches the foot of the cone at one of these frames: "a sonic boom" (line 3), twice in line 4, then every 2 s along the carpet
  const booms = [crackAt, within(t, 4, 0.42), within(t, 4, 0.8), ...[0, 1, 2, 3, 4, 5].map((k) => carpetAt + 8 + 60 * k)];
  const boomFlash = Math.max(0, ...booms.map((b) => (frame >= b && frame < b + 30 ? Math.min(1, (frame - b) / 3) * clamp01((b + 30 - frame) / 10) : 0)));
  const carpetLeft = Math.max(120, FOOT - 5 * (frame - carpetAt));

  const x1Scale = 1 + 0.05 * lin(frame, yeagerAt, pushAt) + 0.1 * ease(frame, pushAt, 40) - 0.07 * ease(frame, nasaAt, 40);
  const x1Ox = 50 - 50 * ease(frame, pushAt, 40) + 50 * ease(frame, nasaAt, 40);

  return (
    <RungShell
      t={t}
      index={4}
      kmh={1228 + 7 * ease(frame, kmAt, 30)}
      plate={{ image: "schlieren" }}
      plateMove={plateMove}
      brightness={0.18 + 0.52 * photo}
      credit={x1 > 0.5 ? { kind: "real", source: "NASA Armstrong, 1955 · E-1914" } : photo > 0.5 ? { kind: "real", source: "NACA Ames, 1948 · public domain" } : frame < boomAt ? { kind: "illustration", source: "sound in air, drawn" } : { kind: "illustration", source: "the sonic boom, drawn · not to scale" }}
      sub={frame >= machAt ? "Mach 1 · 343 m/s at 20 °C" : undefined}
    >
      {/* lines 0-1: sound pulses on a 343-metre bar, one crossing a second; a second, slower lane for cold air */}
      {lanes > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: lanes }}>
            {frame >= msAt ? (
              <g>
                <line x1={LX0} y1={520} x2={LX0 + LW} y2={520} stroke="rgba(255,255,255,0.35)" strokeWidth={4} />
                <line x1={LX0} y1={500} x2={LX0} y2={540} stroke={B.paper} strokeWidth={4} />
                <line x1={LX0 + LW} y1={500} x2={LX0 + LW} y2={540} stroke={B.paper} strokeWidth={4} />
                <line x1={LX0} y1={520} x2={LX0 + LW * ph} y2={520} stroke={B.gauge} strokeWidth={6} strokeLinecap="round" />
                {pulse(LX0 + LW * ph, 520, B.gauge)}
              </g>
            ) : null}
            {frame >= coldAt ? (
              <g opacity={ease(frame, coldAt, 10)}>
                <line x1={LX0} y1={720} x2={LX0 + LW} y2={720} stroke="rgba(255,255,255,0.35)" strokeWidth={4} />
                <line x1={LX0} y1={700} x2={LX0} y2={740} stroke={B.paper} strokeWidth={4} />
                <line x1={LX0} y1={720} x2={LX0 + LW * 0.86 * ph} y2={720} stroke={B.aqua} strokeWidth={6} strokeLinecap="round" />
                {pulse(LX0 + LW * 0.86 * ph, 720, B.aqua)}
              </g>
            ) : null}
          </svg>
          {/* card: "343 m/s" as it is said; "≈ 1,235 km/h" and "at 20 °C" join at their own words */}
          <BuildCard x={160} y={216} size={96} big="343 m/s" frame={frame} opacity={lanes * ease(frame, msAt, 12)} parts={[{ at: kmAt, text: "≈ 1,235 KM/H" }, { at: degAt, text: " · IN AIR AT 20 °C" }]} />
          {frame >= metresAt ? <Tag x={LX0} y={548} opacity={lanes * ease(frame, metresAt, 10)}>every second</Tag> : null}
          {frame >= metresAt ? <Tag x={LX0 + LW} y={548} align="right" color={B.gauge} opacity={lanes * ease(frame, metresAt, 10)}>343 metres</Tag> : null}
          {/* "at twenty degrees Celsius"; the label turns coral on "depends on the temperature of the air" */}
          {frame >= degAt ? <Tag x={LX0} y={462} color={frame >= tempAt ? B.tease : B.paper} opacity={lanes * ease(frame, degAt, 10)}>air at 20 °C</Tag> : null}
          {frame >= machAt ? <Tag x={LX0 + LW} y={462} align="right" color={B.gauge} opacity={lanes * ease(frame, machAt, 10)}>Mach 1</Tag> : null}
          {frame >= coldAt ? (
            <Tag x={LX0} y={662} color={B.aqua} opacity={lanes * ease(frame, coldAt, 10)}>
              high up, where it's cold
              {frame >= slowerAt ? <span> · Mach 1 is slower</span> : null}
            </Tag>
          ) : null}
        </>
      ) : null}

      {/* what the plate really is, on the picture whenever it is lit (lines 2-3, 6, 9) - under the X-1 photo in lines 7-8 */}
      <PillTag x={60} y={206} size={26} opacity={photo}>schlieren photograph · airplane models at Mach 1.2 · NACA, 1948</PillTag>
      {/* line 3: "...piles up ... into shock waves" - named on the photograph, until the drawing takes over */}
      {frame >= shockAt ? <PillTag x={520} y={300} color={B.gauge} opacity={photo1 * ease(frame, shockAt, 10)}>shock waves</PillTag> : null}

      {/* lines 3-5: the shock cone reaching the ground; the ground scrolls, so the cone's foot sweeps along it */}
      {dia > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: dia }}>
            <line x1={120} y1={GY} x2={1380} y2={GY} stroke="rgba(255,255,255,0.5)" strokeWidth={4} />
            {Array.from({ length: 11 }, (_, k) => {
              const x = 120 + ((((k * 120 - scroll) % 1260) + 1260) % 1260);
              return <line key={k} x1={x} y1={GY - 16} x2={x} y2={GY} stroke="rgba(255,255,255,0.5)" strokeWidth={3} />;
            })}
            {/* "made continuously": the carpet grows back from the cone's foot, its texture running with the ground */}
            {frame >= carpetAt ? <line x1={carpetLeft} y1={GY + 10} x2={FOOT} y2={GY + 10} stroke={B.tease} strokeWidth={16} strokeDasharray="44 16" strokeDashoffset={5 * (frame - carpetAt)} opacity={0.9} /> : null}
            <path d={`M940 ${py} L ${FOOT} ${GY} M940 ${py} L 760 ${py - 210}`} stroke={B.gauge} strokeWidth={6} strokeLinecap="round" />
            {[0, 1, 2].map((j) => {
              const k = (frame / 24 + j / 3) % 1;
              return <circle key={j} cx={940 + (FOOT - 940) * k} cy={py + (GY - py) * k} r={7} fill={B.gauge} opacity={1 - k * 0.5} />;
            })}
            <path d="M-40 -14 L 40 0 L -40 14 Z" fill={B.paper} transform={`translate(900 ${py})`} />
            {booms.map((b) => (frame >= b && frame < b + 26 ? <circle key={b} cx={FOOT} cy={GY} r={10 + (frame - b) * 5} stroke={B.tease} strokeWidth={6} fill="none" opacity={1 - (frame - b) / 26} /> : null))}
          </svg>
          {/* people on the ground: each hears the boom as the foot of the cone passes, and turns coral */}
          {booms.map((b) => {
            const x = FOOT + 5 * (b - frame);
            if (x < 112 || x > 1388) return null;
            return (
              <div key={b} style={{ position: "absolute", left: x - 32, top: GY - 60, opacity: dia * Math.min(1, (x - 112) / 40, (1388 - x) / 40) }}>
                <DiverSilhouette size={64} color={frame >= b ? B.tease : B.paper} />
              </div>
            );
          })}
          <Tag x={980} y={300} color={B.gauge} opacity={dia * (1 - ease(frame, onceAt, 8))}>shock waves</Tag>
          {boomFlash > 0 ? <PillTag x={610} y={846} color={B.tease} opacity={dia * boomFlash}>boom</PillTag> : null}
          {/* "About a hundred and ten decibels: like an explosion, or a thunderclap" (#6) */}
          <BuildCard x={160} y={258} size={72} big="≈ 110 dB" color={B.tease} ink={B.paper} frame={frame} opacity={dia * ease(frame, dbAt, 10) * (1 - ease(frame, onceAt, 8))} parts={[{ at: thunderAt, text: "LIKE A THUNDERCLAP" }]} />
          {frame >= notOnceAt ? <PillTag x={160} y={560} color={B.tease} opacity={dia * ease(frame, notOnceAt, 10) * (1 - ease(frame, sweepAt - 10, 8))}>the boom is not a one-off</PillTag> : null}
          {frame >= sweepAt ? <Tag x={140} y={896} color={B.tease} opacity={dia * ease(frame, sweepAt, 10)}>it sweeps the ground like a carpet</Tag> : null}
        </>
      ) : null}

      {/* lines 7-8: Yeager, 14 Oct 1947 - over the 1955 lakebed photo; each aircraft is named on the picture (#21 photo note: left to right X-1E, D-558-II, X-1B) */}
      {x1 > 0 ? (
        <>
          <div style={{ position: "absolute", inset: 0, opacity: x1, transform: `scale(${x1Scale})`, transformOrigin: `${x1Ox}% 40%` }}>
            <Img src={levelImage({ id: "x1", name: "", reading: "", image: "x1-lakebed" })!} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6)" }} />
            <PillTag x={110} y={560} size={26}>X-1E</PillTag>
            <PillTag x={930} y={800} size={26}>D-558-II</PillTag>
            <PillTag x={1120} y={440} size={26}>X-1B</PillTag>
          </div>
          <PillTag x={60} y={930} size={26} opacity={x1}>shown: later aircraft · 1955</PillTag>
          {/* the card grows with the line: the date, "Chuck Yeager" (0.37), "the Bell X-1" (0.8), "flew through it" (0.9) */}
          <BuildCard x={60} y={206} size={64} big="14 October 1947" color={B.paper} frame={frame} opacity={x1 * ease(frame, dateAt, 10)} parts={[{ at: within(t, 7, 0.37), text: "CHUCK YEAGER" }, { at: within(t, 7, 0.8), text: " · BELL X-1" }, { at: within(t, 7, 0.9), text: " · THE FIRST SUPERSONIC FLIGHT" }]} />
          {/* "dropped from the belly of a bomber" - a B-29 (#21); replaced by the NACA card on line 8 */}
          <NumberCard x={60} y={330} big="dropped from a B-29 bomber" size={44} color={B.paper} opacity={x1 * ease(frame, within(t, 7, 0.5), 10) * (1 - ease(frame, nasaAt, 6))} />
          <NumberCard x={60} y={330} big="instruments: the NACA · later, NASA" size={44} color={B.gauge} opacity={x1 * ease(frame, within(t, 8, 0.25), 10)} />
        </>
      ) : null}
      <div style={{ opacity: ease(frame, nextAt, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          next: a plane built to <span style={{ color: B.gauge }}>live</span> above this wall
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * 6 · Faster than Mach 3, the SR-71. Lines 0-5. Sources #8, #27. Plate: NASA EC97-44295-29, a 1997 take-off.
 * 0 intro · 1 "> Mach 3, up to 85,000 ft" · 2 engines that breathe · 3 LA → DC in 1:04:20 (drawn, plate dimmed)
 * · 4 avg 3,400 km/h, straight into the Smithsonian · 5 tease: stop breathing.
 */
export const Blackbird: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const flownAt = within(t, 0, 0.14); // "First flown in 1964"
  const fastAt = within(t, 0, 0.3); // "still the fastest crewed aircraft ever built"
  const airAt = within(t, 0, 0.57); // "with air-breathing engines"
  const gulpAt = within(t, 0, 0.72); // "the kind that need to gulp the atmosphere"
  const cruiseAt = lineAt(t, 1);
  const machAt = within(t, 1, 0.2); // "more than Mach three"
  const ftAt = within(t, 1, 0.58); // "up to eighty-five thousand feet"
  const breatheAt = within(t, 2, 0.38); // "with engines that still had to breathe..."
  const mapAt = lineAt(t, 3);
  const dateAt = within(t, 3, 0.17); // "In March 1990"
  const finalAt = within(t, 3, 0.24); // "on its final flight"
  const laAt = within(t, 3, 0.44); // "from Los Angeles"
  const dcAt = within(t, 3, 0.52); // "to Washington, D.C."
  const widthAt = within(t, 3, 0.62); // "the whole width of the United States"
  const dashAt = laAt + 6;
  const arriveAt = within(t, 3, 0.97); // the clock lands on 1 h 04 min 20 s as "twenty seconds" is said
  const avgAt = within(t, 4, 0.13); // "three thousand four hundred kilometres an hour"
  const museumAt = within(t, 4, 0.57); // "It landed, and went straight into the Smithsonian"
  const stopAt = lineAt(t, 5);
  const stopSayAt = within(t, 5, 0.64); // "To go faster, you stop breathing"
  // the needle goes to the SR-71's mark on "more than Mach three"; the figure itself (3,418 km/h, the sourced
  // final-flight average, #27) is only readable from "three thousand four hundred" on line 4
  const kmh = 1235 + (3418 - 1235) * ease(frame, machAt, 40);
  const map = ease(frame, mapAt, 12) * (1 - ease(frame, museumAt, 10));
  // the coast-to-coast dash at constant speed, with the elapsed time running beside it (1 h 4 min 20 s = 3,860 s)
  const dash = lin(frame, dashAt, arriveAt);
  const secs = Math.round(3860 * dash);
  const two = (n: number) => String(n).padStart(2, "0");
  const clock = `${Math.floor(secs / 3600)} h ${two(Math.floor((secs % 3600) / 60))} min ${two(secs % 60)} s`;
  const MX0 = 200;
  const MW = 1140;
  // camera: in on the aircraft (line 0) → its engines ("gulp") → wide and low for the cards (line 1) → the engines
  // again ("breathe") → wide under the map → a slow creep (line 4) → the engines once more (line 5)
  const eA = ease(frame, lineAt(t, 0), 40);
  const eG = ease(frame, gulpAt, 40);
  const e1 = ease(frame, cruiseAt, 40);
  const eB = ease(frame, breatheAt, 40);
  const eM = ease(frame, mapAt, 30);
  const eS = ease(frame, stopAt, 40);
  const plateMove = {
    scale: 1 + 0.08 * eA + 0.07 * eG - 0.09 * e1 + 0.09 * eB - 0.13 * eM + 0.03 * lin(frame, museumAt, stopAt) + 0.1 * eS,
    origin: `${40 + 2 * eG + 8 * e1 - 8 * eB + 8 * eM - 8 * eS}% ${58 - 4 * eG - 44 * e1 + 44 * eB - 4 * eM + 4 * eS}%`,
  };
  return (
    <RungShell
      t={t}
      index={5}
      kmh={kmh}
      reading={frame >= machAt && frame < avgAt ? "> Mach 3" : undefined}
      sub={frame < machAt ? undefined : frame < ftAt ? "cruise speed" : frame < avgAt ? "cruise · up to 85,000 ft" : "> Mach 3 · up to 85,000 ft"}
      plate={{ image: "sr71-takeoff" }}
      plateMove={plateMove}
      brightness={0.85 - 0.67 * map}
      credit={map > 0.5 ? { kind: "illustration", source: "the route, drawn · over a NASA photo" } : { kind: "real", source: "NASA Armstrong, 1997" }}
    >
      {/* the plate is NASA EC97-44295-29, an SR-71 take-off in 1997 - not 1964, and not the 1990 flight: said on the picture from its first frame */}
      <PillTag x={60} y={206} size={26} opacity={1 - map}>shown: a NASA SR-71 taking off · 1997</PillTag>
      {/* line 0: "First flown in 1964" (FS-030), then "the fastest crewed aircraft ... with air-breathing engines" */}
      <NumberCard x={160} y={258} big="first flown 1964" size={56} color={B.paper} opacity={ease(frame, flownAt, 10) * (1 - ease(frame, cruiseAt, 8))} />
      <BuildCard x={160} y={348} size={64} big="fastest crewed aircraft" frame={frame} opacity={ease(frame, fastAt, 10) * (1 - ease(frame, cruiseAt, 8))} parts={[{ at: airAt, text: "WITH AIR-BREATHING ENGINES" }]} />
      {/* line 1: "more than Mach three", then "up to eighty-five thousand feet" */}
      <BuildCard x={160} y={258} size={80} big="> Mach 3" frame={frame} opacity={ease(frame, machAt, 10) * (1 - ease(frame, breatheAt, 8))} parts={[{ at: machAt, text: "CRUISE SPEED" }]} />
      <NumberCard x={160} y={403} big="up to 85,000 ft" small="CRUISING ALTITUDE · NASA FS-030 · SMITHSONIAN" size={52} color={B.paper} opacity={ease(frame, ftAt, 10) * (1 - ease(frame, breatheAt, 8))} />
      <div style={{ opacity: ease(frame, breatheAt, 10) * (1 - ease(frame, mapAt, 8)) }}>
        <CaptionPop bottom={150} size={78} color={B.paper}>
          engines that still had to <span style={{ color: B.gauge }}>breathe</span>
        </CaptionPop>
      </div>
      {/* line 3: the width of the United States as a drawn line (plate dimmed to 0.18), and the dash across it */}
      {map > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: map }}>
            <line x1={MX0} y1={640} x2={MX0 + MW * ease(frame, mapAt, 30)} y2={640} stroke="rgba(255,255,255,0.5)" strokeWidth={4} />
            {frame >= laAt ? <circle cx={MX0} cy={640} r={12} fill={B.paper} opacity={ease(frame, laAt, 8)} /> : null}
            {frame >= dcAt ? <circle cx={MX0 + MW} cy={640} r={12} fill={B.paper} opacity={ease(frame, dcAt, 8)} /> : null}
            {frame >= dashAt ? (
              <g>
                <line x1={MX0} y1={640} x2={MX0 + MW * dash} y2={640} stroke={B.gauge} strokeWidth={8} strokeLinecap="round" />
                {dash < 1
                  ? [-18, 18].map((dy, i) => {
                      const len = 70 + 50 * Math.abs(Math.sin(frame / 3 + i * 2));
                      const x = Math.max(MX0, MX0 + MW * dash - 70 - len);
                      return <line key={dy} x1={x} y1={640 + dy} x2={Math.max(MX0, MX0 + MW * dash - 70)} y2={640 + dy} stroke={B.gauge} strokeWidth={4} strokeLinecap="round" opacity={0.55} />;
                    })
                  : null}
                <path d="M-56 -12 L 0 0 L -56 12 Z" fill={B.gauge} transform={`translate(${MX0 + MW * dash} 640)`} />
              </g>
            ) : null}
          </svg>
          {frame >= dateAt ? (
            <Tag x={MX0} y={520} color={B.paper} opacity={map * ease(frame, dateAt, 10)}>
              March 1990
              {frame >= finalAt ? <span> · the final flight</span> : null}
            </Tag>
          ) : null}
          {frame >= laAt ? <Tag x={MX0} y={664} color={B.paper} opacity={map * ease(frame, laAt, 8)}>Los Angeles</Tag> : null}
          {frame >= dcAt ? <Tag x={MX0 + MW} y={664} color={B.paper} align="right" opacity={map * ease(frame, dcAt, 8)}>Washington, D.C.</Tag> : null}
          {frame >= widthAt ? <Tag x={MX0 + MW / 2} y={584} color={B.paper} align="center" opacity={map * ease(frame, widthAt, 10)}>the whole width of the United States</Tag> : null}
          {/* the elapsed time runs with the dash and stops on the sourced figure (#27); the average joins on line 4 */}
          <BuildCard x={160} y={258} size={90} big={clock} sizer="1 h 04 min 20 s" frame={frame} opacity={map * ease(frame, dashAt, 10)} parts={[{ at: dcAt, text: "LOS ANGELES → WASHINGTON, D.C." }, { at: avgAt, text: " · AVERAGE 3,418 KM/H" }]} />
        </>
      ) : null}
      <div style={{ opacity: ease(frame, museumAt + 4, 8) * (1 - ease(frame, stopAt, 8)) }}>
        <CaptionPop bottom={150} size={78} color={B.paper}>
          then straight into the <span style={{ color: B.gauge }}>Smithsonian</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, stopSayAt, 8) }}>
        <CaptionPop bottom={150} size={80}>to go faster, you stop breathing</CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * 7 · The fastest aircraft ever, Mach 6.7. Lines 0-8. Sources #9, #20, #22.
 * Plates: x15-pylon (NASA GPN-2000-000141, the X-15 on the B-52's pylon) until "and dropped", then x15-flight
 * (Commons "X-15 in flight.jpg", NASA - the flight is not identified in our log, so the picture says so).
 * 3-5 the heat, drawn (plate dimmed) · 6-7 flights, Mach marks, the eight pilots · 8 tease.
 */
export const X15: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const rocketAt = within(t, 0, 0.12); // "A rocket with a cockpit"
  const wingAt = within(t, 0, 0.4); // "carried up under the wing of a bomber"
  const dropAt = within(t, 0, 0.9); // "and dropped"
  const dateAt = within(t, 1, 0.02);
  const knightAt = within(t, 1, 0.2); // "Air Force pilot Pete Knight"
  const mphAt = within(t, 1, 0.35); // "four thousand five hundred and twenty miles an hour"
  const recordAt = within(t, 1, 0.62); // "seven thousand two hundred and seventy-four kilometres an hour"
  const machAt = within(t, 1, 0.9); // "Mach six point seven"
  const fastestAt = within(t, 2, 0.1);
  const pilotAt = within(t, 2, 0.5); // "with a pilot inside"
  const heatAt = lineAt(t, 3);
  const heatSayAt = within(t, 3, 0.75); // "It's heat."
  const skinAt = within(t, 4, 0.03); // "The X-15's skin"
  const inconelAt = within(t, 4, 0.17); // "called Inconel X"
  const softAt = within(t, 4, 0.25); // "ordinary aircraft metal would have softened"
  const partsAt = within(t, 4, 0.44); // "parts of the skin"
  const edgesAt = within(t, 4, 0.5); // "and the leading edges"
  const degAt = within(t, 4, 0.63); // "twelve hundred degrees Fahrenheit"
  const degEnd = within(t, 4, 0.76);
  const celsiusAt = within(t, 4, 0.8); // "around six hundred and fifty Celsius"
  const frictionAt = within(t, 4, 0.92); // "from air friction alone"
  const cabinAt = lineAt(t, 5);
  const cabinTagAt = within(t, 5, 0.2);
  const flightsAt = lineAt(t, 6);
  const countAt = within(t, 6, 0.06); // "a hundred and ninety-nine times"
  const countEnd = within(t, 6, 0.2);
  const yearsAt = within(t, 6, 0.24); // "in nine years"
  const machs = [within(t, 6, 0.42), within(t, 6, 0.47), within(t, 6, 0.53)]; // "Mach four, Mach five and Mach six"
  const highAt = within(t, 6, 0.6); // "It also went so high"
  const milesAt = within(t, 6, 0.7); // "above fifty miles"
  const eightAt = within(t, 6, 0.79); // "eight of its pilots"
  const astroAt = within(t, 6, 0.93); // "qualified as astronauts"
  const wingsAt = lineAt(t, 7);
  const y2005At = within(t, 7, 0.7); // "until 2005"
  const teaseAt = lineAt(t, 8);
  const nextAt = within(t, 8, 0.16); // "the next one isn't a record anyone set on purpose"
  const homeAt = within(t, 8, 0.6); // "what happens to anything that comes home from space"
  // the needle climbs through the number as it is said and lands on 7,274 with "kilometres an hour"
  const kmh = 3418 + (7274 - 3418) * lin(frame, recordAt, within(t, 1, 0.86));
  const heat = ease(frame, heatAt, 14) * (1 - ease(frame, flightsAt - 10, 10));
  const onPylon = frame < dropAt;
  // camera, pylon photo: in on the cockpit ("a rocket with a cockpit"), then up to the bomber's wing
  const eW = ease(frame, wingAt, 40);
  const pylonMove = { scale: 1 + 0.2 * ease(frame, rocketAt, 30) + 0.05 * lin(frame, wingAt, dropAt), origin: `${49 - 12 * eW}% ${47 - 16 * eW}%` };
  // camera, flight photo (3000 px wide): push per phrase on line 1, travel tail → nose on the record, then to the
  // canopy; from line 6 a climb ("so high") that also lifts the aircraft clear of the pilots' card
  const sB = 1 + 0.04 * lin(frame, dropAt, lineAt(t, 1)) + 0.1 * ease(frame, knightAt, 40) + 0.1 * ease(frame, recordAt, 40) + 0.06 * lin(frame, recordAt, heatAt);
  const oxB = 30 + 30 * ease(frame, recordAt, 40) - 8 * ease(frame, pilotAt, 40);
  const tilt = ease(frame, highAt, 45);
  const back = ease(frame, teaseAt, 40);
  const sC = 1.05 + 0.03 * lin(frame, flightsAt, highAt) + 0.24 * tilt - 0.2 * back + 0.03 * lin(frame, teaseAt, t.frames);
  const kC = ease(frame, heatAt, 40); // the hand-over happens as the plate dims for the drawing
  const flightMove = { scale: mix(sB, sC, kC), origin: `${mix(oxB, 50, kC)}% ${mix(20, 35 - 35 * tilt + 45 * back, kC)}%` };
  const degrees = Math.round((1200 * lin(frame, degAt, degEnd)) / 10) * 10;
  const flights = Math.round(199 * lin(frame, countAt, countEnd));
  const out = 1 - ease(frame, teaseAt, 8);
  return (
    <RungShell
      t={t}
      index={6}
      kmh={kmh}
      plate={{ image: onPylon ? "x15-pylon" : "x15-flight" }}
      plateMove={onPylon ? pylonMove : flightMove}
      brightness={0.85 - 0.67 * heat}
      credit={heat > 0.5 ? { kind: "illustration", source: "the X-15, drawn · over a NASA photo" } : { kind: "real", source: "NASA" }}
      sub={frame >= machAt ? "Mach 6.7 · 3 Oct 1967" : undefined}
    >
      {/* line 0: the carrier is a B-52 (manifest: "X-15 Mounted to B-52 Mothership Pylon in Flight", GPN-2000-000141) */}
      {onPylon && frame >= wingAt ? <PillTag x={60} y={206} size={26} opacity={ease(frame, wingAt, 10)}>under the wing of a B-52</PillTag> : null}
      {/* the in-flight photo is not logged as the record flight: said on the picture from its first frame */}
      {!onPylon ? <PillTag x={60} y={206} size={26} opacity={1 - heat}>shown: an X-15 just after launch · NASA, 1959</PillTag> : null}
      {/* line 1: the date, the pilot, then the record - miles an hour first, as narrated, then km/h, then Mach */}
      <BuildCard x={160} y={258} size={56} big="3 October 1967" color={B.paper} frame={frame} opacity={ease(frame, dateAt, 10) * (1 - ease(frame, heatAt, 8))} parts={[{ at: knightAt, text: "PETE KNIGHT · U.S. AIR FORCE" }]} />
      <BuildCard x={160} y={370} size={72} big={frame < recordAt ? "4,520 mph" : "7,274 km/h"} frame={frame} opacity={ease(frame, mphAt, 10) * (1 - ease(frame, heatAt, 8))} parts={[{ at: recordAt, text: "4,520 MPH" }, { at: machAt, text: " · MACH 6.7" }]} />
      <div style={{ opacity: ease(frame, fastestAt, 10) * (1 - ease(frame, heatAt, 8)) }}>
        <CaptionPop bottom={150} size={78} color={B.paper}>
          still the fastest{frame >= pilotAt ? <span style={{ color: B.gauge }}> with a pilot inside</span> : null}
        </CaptionPop>
      </div>

      {/* lines 3-5: the heat, on a drawn X-15 (plate dimmed to 0.18): the air streams past, the engine burns, the edges glow */}
      {heat > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: heat }}>
            {Array.from({ length: 9 }, (_, i) => {
              const len = 90 + ((i * 29) % 60);
              const x = 1250 - ((i * 173 + frame * 26) % 1160);
              return <line key={i} x1={x} y1={470 + i * 37} x2={x + len} y2={470 + i * 37} stroke={frame >= frictionAt ? "#FF9A6B" : B.paper} strokeWidth={3} strokeLinecap="round" opacity={frame >= frictionAt ? 0.55 : 0.28} />;
            })}
            <g transform="translate(260 640)">
              <path d={`M0 -22 L ${-150 - 30 * Math.sin(frame / 2.3)} 0 L 0 22 Z`} fill="#FFD9A0" opacity={0.9} />
              <path d={`M0 -10 L ${-70 - 16 * Math.sin(frame / 1.7)} 0 L 0 10 Z`} fill={B.paper} />
              <path d="M20 -34 L 60 -170 L 200 -170 L 260 -34 Z" fill="#1E2F42" stroke={B.paper} strokeWidth={3} />
              <path d="M20 34 L 60 120 L 200 120 L 240 34 Z" fill="#1E2F42" stroke={B.paper} strokeWidth={3} />
              <path d="M0 -34 L 760 -34 Q 900 -30 1040 0 Q 900 30 760 34 L 0 34 Z" fill="#1E2F42" stroke={B.paper} strokeWidth={4 + 3 * ease(frame, skinAt, 12) * (1 - ease(frame, partsAt, 12))} />
              <path d="M700 -34 Q 760 -72 850 -30" fill="none" stroke={B.paper} strokeWidth={3} />
              <path d="M380 -4 L 560 2 L 560 10 L 380 16 Z" fill="#2A4057" stroke={B.paper} strokeWidth={2} />
              {/* "It's heat": the nose glows first; "parts of the skin", then "the leading edges" (#20) */}
              <path d="M760 -34 Q 900 -30 1040 0 Q 900 30 760 34" stroke={HOT} strokeWidth={10 + 4 * Math.sin(frame / 5)} fill="none" strokeLinecap="round" opacity={ease(frame, heatSayAt, 14)} />
              <path d="M560 -34 L 700 -34 M520 34 L 760 34" stroke={HOT} strokeWidth={10 + 3 * Math.sin(frame / 5 + 1)} fill="none" strokeLinecap="round" opacity={ease(frame, partsAt, 14)} />
              <path d="M200 -170 L 260 -34 M200 120 L 240 34 M560 2 L 560 10" stroke={HOT} strokeWidth={10 + 3 * Math.sin(frame / 5 + 2)} fill="none" strokeLinecap="round" opacity={ease(frame, edgesAt, 14)} />
              {/* line 5: the cabin, a cool capsule inside the hot skin */}
              <g opacity={ease(frame, cabinAt, 12)}>
                <rect x={690} y={-24} width={160} height={48} rx={22} fill={B.aqua} />
                <circle cx={790} cy={0} r={12} fill={B.ink} />
                <line x1={770} y1={24} x2={770} y2={88} stroke={B.aqua} strokeWidth={3} opacity={ease(frame, cabinTagAt, 10)} />
              </g>
            </g>
          </svg>
          {frame >= heatSayAt ? <PillTag x={640} y={470} color={HOT} opacity={heat * ease(frame, heatSayAt, 10) * (1 - ease(frame, partsAt - 12, 8))}>the problem: heat</PillTag> : null}
          {frame >= partsAt ? (
            <PillTag x={640} y={470} color={HOT} opacity={heat * ease(frame, partsAt, 10) * (1 - ease(frame, cabinAt, 8))}>
              parts of the skin
              {frame >= edgesAt ? <span> · leading edges</span> : null}
            </PillTag>
          ) : null}
          <BuildCard x={160} y={258} size={72} big="Inconel X" color={B.paper} frame={frame} opacity={heat * ease(frame, inconelAt, 10) * (1 - ease(frame, degAt - 6, 6))} parts={[{ at: inconelAt, text: "THE SKIN · A NICKEL-CHROME ALLOY" }]} />
          {frame >= softAt ? <PillTag x={160} y={394} opacity={heat * ease(frame, softAt, 10) * (1 - ease(frame, degAt - 6, 6))}>ordinary aircraft metal would have softened</PillTag> : null}
          {/* the figure counts up through its own words and stops on "> 1,200 °F" (#20: "expected to exceed 1,200 °F") */}
          <BuildCard x={160} y={258} size={80} big={frame < degEnd ? `${degrees.toLocaleString("en-US")} °F` : "> 1,200 °F"} sizer="> 1,200 °F" color={HOT} frame={frame} opacity={heat * ease(frame, degAt, 10)} parts={[{ at: celsiusAt, text: "≈ 650 °C" }, { at: frictionAt, text: " · FROM AIR FRICTION ALONE" }]} />
          {frame >= cabinTagAt ? <PillTag x={1380} y={730} size={28} align="right" color={B.aqua} opacity={heat * ease(frame, cabinTagAt, 10)}>aluminium cabin, insulated from the skin</PillTag> : null}
        </>
      ) : null}

      {/* line 6: the flight count runs up to 199 as it is said; Mach 4, 5, 6 land one by one; then "above fifty miles" */}
      <BuildCard x={160} y={258} size={72} big={`${flights} flights`} sizer="199 flights" color={B.paper} frame={frame} opacity={ease(frame, countAt - 4, 10) * out} parts={[{ at: yearsAt, text: "IN NINE YEARS · 1959–1968" }]} />
      {machs.map((at, i) => (frame >= at ? <PillTag key={at} x={160 + i * 170} y={394} color={B.gauge} opacity={ease(frame, at, 6) * out}>{`Mach ${4 + i}`}</PillTag> : null))}
      {frame >= milesAt ? <PillTag x={690} y={394} color={B.aqua} opacity={ease(frame, milesAt, 8) * out}>above 50 miles</PillTag> : null}
      {frame >= eightAt ? (
        <div style={{ position: "absolute", left: 160, top: 452, width: "max-content", padding: "14px 22px 16px", borderRadius: 18, background: "rgba(5,14,24,0.94)", boxShadow: "0 8px 28px rgba(0,0,0,0.5)", opacity: ease(frame, eightAt, 12) * out }}>
          <div style={{ display: "flex", gap: 10 }}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} style={{ opacity: ease(frame, eightAt + i * 4, 6) }}>
                <DiverSilhouette size={46} color={i >= 5 && frame >= wingsAt ? B.aqua : B.gauge} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontFamily: F.ui, fontWeight: 800, fontSize: 28, letterSpacing: 1.5, color: B.gauge, whiteSpace: "nowrap" }}>
            EIGHT PILOTS{frame >= astroAt ? <span> · ASTRONAUT WINGS</span> : null}
          </div>
          {/* line 7: "Three of them didn't get their wings until 2005" */}
          {frame >= wingsAt ? (
            <div style={{ marginTop: 4, fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: 1.5, color: B.aqua, whiteSpace: "nowrap", opacity: ease(frame, wingsAt, 10) }}>
              THREE OF THEM{frame >= y2005At ? <span> · WINGS AWARDED IN 2005</span> : null}
            </div>
          ) : null}
        </div>
      ) : null}
      <div style={{ opacity: ease(frame, nextAt, 8) * (1 - ease(frame, homeAt - 6, 6)) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          next: not a record anyone set
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, homeAt, 8) }}>
        <CaptionPop bottom={150} size={70} color={B.paper}>
          what happens when you <span style={{ color: B.gauge }}>come home</span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * 8 · Coming home from orbit, 27,000 km/h. Lines 0-7. Sources #10, #23.
 * Plate: NASA STS122-S-091, Atlantis on the runway after landing, 20 Feb 2008 - not a re-entry and not Apollo 10,
 * so it is lit only where the picture is labelled for what it is (lines 0, 4, 7) and dimmed under the drawings:
 * 1-3 re-entry heating, drawn · 5-6 the Shuttle and Apollo 10 as two dots at their relative speeds.
 */
export const Reentry: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const mphAt = within(t, 0, 0.46); // "more than seventeen thousand miles an hour"
  const kmAt = within(t, 0, 0.74); // "over twenty-seven thousand kilometres an hour"
  const heatAt = lineAt(t, 1);
  const compAt = within(t, 1, 0.31); // "It compressed"
  const hotAt = within(t, 1, 0.38); // "and it heated"
  const surfAt = within(t, 1, 0.5); // "the outside of the orbiter"
  const degAt = within(t, 1, 0.66); // "three thousand degrees Fahrenheit"
  const degEnd = within(t, 1, 0.84);
  const celAt = within(t, 1, 0.87); // "around sixteen hundred Celsius"
  const steelAt = lineAt(t, 2);
  const tilesAt = lineAt(t, 3);
  const tilesTagAt = within(t, 3, 0.1);
  const whereAt = within(t, 3, 0.4); // "This is the level where speed stops being about going somewhere"
  const surviveAt = within(t, 3, 0.77); // "and starts being about surviving the air"
  const fastestAt = lineAt(t, 4);
  const humansAt = within(t, 4, 0.1);
  const earthAt = within(t, 4, 0.5); // "relative to the Earth"
  const apolloAt = lineAt(t, 5);
  const a10At = within(t, 5, 0.2); // "the crew of Apollo 10"
  const a10Mph = within(t, 5, 0.47); // "twenty-four thousand seven hundred and ninety-one miles an hour"
  const a10End = within(t, 5, 0.77);
  const a10Km = within(t, 5, 0.82); // "nearly forty thousand kilometres an hour"
  const namesAt = lineAt(t, 6);
  const nobodyAt = within(t, 6, 0.72); // "nobody has gone faster"
  const teaseAt = lineAt(t, 7);
  const fallAt = within(t, 7, 0.62); // "a speed at which you fall, forever"
  // the needle climbs while the speed is being said and lands on 27,000 with "twenty-seven thousand"
  const kmh = 7274 + (27000 - 7274) * lin(frame, kmAt - 6, kmAt + 14);
  const heat = ease(frame, heatAt, 14) * (1 - ease(frame, fastestAt - 10, 10));
  const race = ease(frame, apolloAt, 14) * (1 - ease(frame, teaseAt - 8, 8));
  const hot = ease(frame, hotAt, 40);
  const comp = ease(frame, compAt, 20);
  const degrees = Math.round((3000 * lin(frame, degAt, degEnd)) / 50) * 50;
  // the bow shock ahead of the drawn orbiter: air dots run in from the left, slow and pile up against it
  const shockX = (y: number) => 560 + 0.0019 * (y - 620) * (y - 620);
  const shockPath = Array.from({ length: 18 }, (_, i) => 490 + i * 20)
    .map((y, i) => `${i === 0 ? "M" : "L"}${shockX(y)} ${y}`)
    .join(" ");
  // lines 5-6: two dots on equal tracks, restarting together every 80 frames. Apollo 10 crosses in 45 frames, the
  // Shuttle in 45 x 24,791 / 17,000 = 65.6 - the ratio of the two sourced speeds (#10, #23)
  const RX0 = 160;
  const RW = 1140;
  const cycle = (frame - apolloAt) % 80;
  const apolloStart = apolloAt + Math.ceil((a10Mph - apolloAt) / 80) * 80;
  const pShuttle = frame >= apolloAt + 14 ? Math.min(1, cycle / 65.6) : 0;
  const pApollo = frame >= apolloStart ? Math.min(1, cycle / 45) : 0;
  const a10Speed = frame < a10End ? Math.round((24791 * lin(frame, a10Mph, a10End)) / 100) * 100 : 24791;
  // camera: in on the orbiter (line 0); a travel to its nose on line 4; a slow pull-back under the tease.
  // The hand-overs happen while the plate is dimmed under a drawing.
  const s1 = 1 + 0.12 * ease(frame, lineAt(t, 0), 40) + 0.03 * lin(frame, lineAt(t, 0), heatAt);
  const e4 = ease(frame, within(t, 4, 0.3), 40);
  const s2 = 1.05 + 0.1 * e4;
  const s3 = 1.15 - 0.12 * lin(frame, teaseAt, t.frames);
  const k12 = ease(frame, heatAt + 10, 40);
  const k23 = ease(frame, apolloAt + 10, 40);
  const plateMove = {
    scale: mix(mix(s1, s2, k12), s3, k23),
    origin: `${mix(mix(52, 52 - 7 * e4, k12), 50, k23)}% ${mix(mix(75, 75 + 5 * e4, k12), 70, k23)}%`,
  };
  return (
    <RungShell
      t={t}
      index={7}
      kmh={kmh}
      // "over twenty-seven thousand": 17,000 mph is 27,359 km/h (#10), so the landed reading says "over"
      reading={frame >= kmAt + 14 ? "> 27,000 km/h" : undefined}
      plate={{ image: "shuttle-landing-still" }}
      plateMove={plateMove}
      brightness={0.8 - 0.62 * Math.max(heat, race)}
      credit={heat > 0.5 ? { kind: "illustration", source: "re-entry heating, drawn · not to scale" } : race > 0.5 ? { kind: "illustration", source: "two speeds, drawn" } : { kind: "real", source: "NASA · Atlantis after landing, STS-122, 2008" }}
      sub={frame >= mphAt + 10 ? "> 17,000 mph at the top of the air" : undefined}
    >
      {/* the plate is the orbiter parked after landing, not the re-entry being described: said on the picture from its first frame */}
      <PillTag x={60} y={206} size={26} opacity={1 - Math.max(heat, race)}>shown: Atlantis on the runway after landing · 2008</PillTag>
      {/* line 0: the speed as narrated (#10: "in excess of 17,000 mph"; 17,000 mph = 27,359 km/h) */}
      <BuildCard x={160} y={258} size={96} big="> 17,000 mph" frame={frame} opacity={ease(frame, mphAt, 12) * (1 - ease(frame, surfAt, 8))} parts={[{ at: mphAt, text: "AT THE TOP OF THE ATMOSPHERE" }, { at: kmAt, text: " · OVER 27,000 KM/H" }]} />

      {/* lines 1-3: the air that "couldn't move aside" - it runs into the orbiter, piles up, and glows (plate dimmed to 0.18) */}
      {heat > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: heat }}>
            {Array.from({ length: 26 }, (_, i) => {
              const y = 510 + ((i * 67) % 290);
              const k = (i * 0.173 + frame / 46) % 1;
              const x = 120 + (shockX(y) - 128) * (1 - (1 - k) * (1 - k));
              return <circle key={i} cx={x} cy={y} r={5} fill={k > 0.75 && hot > 0.5 ? "#FF9A6B" : "#CFE6FF"} opacity={Math.min(1, k * 8)} />;
            })}
            {/* "It compressed" thickens the front; "and it heated" turns it orange */}
            <path d={shockPath} stroke={hot > 0.5 ? HOT : "#CFE6FF"} strokeWidth={6 + 10 * comp + 3 * Math.sin(frame / 4)} fill="none" strokeLinecap="round" opacity={0.35 + 0.65 * comp} />
            <g transform="translate(820 630) rotate(30)">
              <path d="M110 -35 L 185 -105 L 185 -35 Z" fill="#1E2F42" stroke={B.paper} strokeWidth={3} />
              <rect x={-190} y={-35} width={380} height={70} rx={35} fill="#1E2F42" stroke={B.paper} strokeWidth={4} />
              <line x1={-150} y1={35} x2={150} y2={35} stroke={HOT} strokeWidth={12 + 3 * Math.sin(frame / 5)} strokeLinecap="round" opacity={hot} />
              {/* line 3: "The whole underside was covered in tiles" - laid one by one along the belly */}
              {Array.from({ length: 12 }, (_, i) => (
                <rect key={i} x={-156 + i * 26} y={27} width={22} height={16} fill="#0B0F14" stroke={HOT} strokeWidth={2} opacity={ease(frame, tilesAt + i * 3, 6)} />
              ))}
            </g>
          </svg>
          {frame >= compAt ? (
            <PillTag x={160} y={850} color="#FF9A6B" opacity={heat * ease(frame, compAt, 10) * (1 - ease(frame, whereAt, 8))}>
              the air compresses
              {frame >= hotAt ? <span> · and heats</span> : null}
            </PillTag>
          ) : null}
          {/* the temperature counts up through its own words and stops on the sourced 3,000 °F (#10) */}
          <BuildCard x={160} y={258} size={90} big={`${degrees.toLocaleString("en-US")} °F`} sizer="3,000 °F" color={HOT} frame={frame} opacity={heat * ease(frame, degAt - 4, 10) * (1 - ease(frame, whereAt, 8))} parts={[{ at: degAt, text: "THE ORBITER'S SURFACE" }, { at: celAt, text: " · ≈ 1,650 °C" }]} />
          <NumberCard x={160} y={416} big="above the melting point of steel" size={48} color={B.paper} opacity={heat * ease(frame, steelAt + 6, 8) * (1 - ease(frame, whereAt, 8))} />
          {frame >= tilesTagAt ? <PillTag x={690} y={756} opacity={heat * ease(frame, tilesTagAt, 10) * (1 - ease(frame, surviveAt - 14, 8))}>the underside: tiles built for this</PillTag> : null}
          <div style={{ opacity: heat * ease(frame, surviveAt, 8) }}>
            <CaptionPop bottom={150} size={78} color={B.paper}>
              now speed means <span style={{ color: B.gauge }}>surviving the air</span>
            </CaptionPop>
          </div>
        </>
      ) : null}

      {/* line 4: "the fastest any human beings have ever gone, relative to the Earth" - over the sky of the labelled photo */}
      <BuildCard x={160} y={258} size={64} big="the fastest humans ever" color={B.paper} frame={frame} opacity={ease(frame, humansAt, 10) * (1 - ease(frame, teaseAt - 8, 8))} parts={[{ at: earthAt, text: "RELATIVE TO THE EARTH" }]} />

      {/* lines 5-6: a Shuttle and Apollo 10 racing on equal tracks at their relative speeds (plate dimmed to 0.18) */}
      {race > 0 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: race }}>
            <line x1={RX0} y1={612} x2={RX0 + RW} y2={612} stroke="rgba(255,255,255,0.35)" strokeWidth={4} />
            <line x1={RX0 + RW} y1={592} x2={RX0 + RW} y2={632} stroke={B.paper} strokeWidth={4} />
            <line x1={RX0} y1={612} x2={RX0 + RW * pShuttle} y2={612} stroke={B.paper} strokeWidth={6} strokeLinecap="round" />
            <circle cx={RX0 + RW * pShuttle} cy={612} r={14} fill={B.paper} />
            {frame >= a10At ? (
              <g opacity={ease(frame, a10At, 10)}>
                <line x1={RX0} y1={750} x2={RX0 + RW} y2={750} stroke="rgba(255,255,255,0.35)" strokeWidth={4} />
                <line x1={RX0 + RW} y1={730} x2={RX0 + RW} y2={770} stroke={B.paper} strokeWidth={4} />
                <line x1={RX0} y1={750} x2={RX0 + RW * pApollo} y2={750} stroke={B.gauge} strokeWidth={6} strokeLinecap="round" />
                <circle cx={RX0 + RW * pApollo} cy={750} r={14} fill={B.gauge} />
              </g>
            ) : null}
          </svg>
          <Tag x={RX0} y={552} color={B.paper} opacity={race}>a Space Shuttle · &gt; 17,000 mph</Tag>
          {frame >= a10At ? <Tag x={RX0} y={690} color={B.gauge} opacity={race * ease(frame, a10At, 10)}>Apollo 10 · May 1969</Tag> : null}
          {/* the figure counts up through its own words and stops on the sourced 24,791 mph (#23) */}
          <BuildCard x={160} y={382} size={80} big={`${a10Speed.toLocaleString("en-US")} mph`} sizer="24,791 mph" frame={frame} opacity={race * ease(frame, a10Mph - 4, 10)} parts={[{ at: a10Km, text: "≈ 39,900 KM/H · THE TOP OF THE ATMOSPHERE" }]} />
          {/* line 6: the three names, each as it is said; then "nobody has gone faster" */}
          {frame >= namesAt ? (
            // the row sizes itself: max-content + nowrap
            <div style={{ position: "absolute", left: 160, top: 800, width: "max-content", display: "flex", gap: 24, alignItems: "center", padding: "16px 28px 18px", borderRadius: 18, background: "rgba(5,14,24,0.94)", boxShadow: "0 8px 28px rgba(0,0,0,0.5)", opacity: race * ease(frame, namesAt, 10) }}>
              {["Stafford", "Cernan", "Young"].map((n, i) => {
                const at = within(t, 6, [0.02, 0.17, 0.33][i]);
                return frame >= at ? (
                  <div key={n} style={{ textAlign: "center", opacity: ease(frame, at, 8) }}>
                    <DiverSilhouette size={70} color={B.paper} />
                    <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, color: B.paper, whiteSpace: "nowrap" }}>{n}</div>
                  </div>
                ) : null;
              })}
              {frame >= nobodyAt ? <div style={{ fontFamily: F.caption, fontWeight: 600, fontSize: 40, color: B.gauge, marginLeft: 12, whiteSpace: "nowrap", opacity: ease(frame, nobodyAt, 10) }}>nobody has gone faster since</div> : null}
            </div>
          ) : null}
        </>
      ) : null}
      <div style={{ opacity: ease(frame, fallAt, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          next: a speed at which
          <br />
          you <span style={{ color: B.gauge }}>fall forever</span>
        </CaptionPop>
      </div>
    </RungShell>
  );
};
