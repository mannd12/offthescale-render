import React from "react";
import { useCurrentFrame } from "remotion";
import { B, F } from "../../../brand/tokens";
import { SceneTiming } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { rulerX } from "../ladder";
import { Card, Pill, Plate, RungShell, Svg, at, lin, mix, rnd, rock, win } from "./shell";

/** Rung 9. #56-61, #51. No picture of the rock: a dashed outline. A real relief map that says it is the crater's trace. Eros, which says it is not the rock. */
export const Crater: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const ever = at(t, "Taller than");
  const none = at(t, "And there is no picture");
  const buried = at(t, "The crater itself");
  const wide = at(t, "at least a hundred");
  const trough = at(t, "From space");
  const species = at(t, "NASA's caption");
  const chem = at(t, "The chemistry");
  const see = at(t, "So to see");
  const eros = at(t, "This is Eros");
  const miles = at(t, "It's twenty-one");
  const near = at(t, "NEAR Shoemaker");
  const land = at(t, "and landed");
  const exc = at(t, "And here's the exception");
  const a = 1 - ease(f, buried - 8, 12);
  const map = win(f, buried - 6, eros, 12);
  const er = f >= eros;
  const y = (m: number) => 830 - m * 0.06; // 10 km = 600 px, one scale for bar and mountain
  const grow = ease(f, 10, 40);
  return (
    <RungShell t={t} index={8} m={er ? 34000 : 1e4} reading={er ? "21 MILES LONG" : "~10 km"} sub={er ? "Eros, not the Chicxulub rock" : "estimated from its crater"} craft={er ? (f >= land ? "LANDED" : f >= near ? "ORBITED" : undefined) : undefined} made={er ? (f >= exc ? "shattered, intact" : undefined) : "unknown"} flips={[near, land, exc]} chips={er ? [{ kind: "REAL PHOTO", source: "NASA/JHU/APL · Eros, a stand-in" }] : f >= buried - 6 ? [{ kind: "RELIEF MAP", source: "NASA/JPL-Caltech · height exaggerated" }] : [{ kind: "ILLUSTRATION", source: "no picture of this rock exists" }]}>
      <Svg o={a}>
        <line x1={120} y1={830} x2={1420} y2={830} stroke={B.paper} strokeWidth={4} />
        <rect x={980} y={mix(830, y(1e4), grow)} width={120} height={mix(0, 600, grow)} fill={f >= none ? "none" : B.gauge} stroke={B.gauge} strokeWidth={6} strokeDasharray={f >= none ? "18 14" : undefined} />
        <path d={`M240 830 L460 ${y(8850)} L520 ${y(8850) + 70} L620 ${y(8850) + 30} L860 830 Z`} fill="#5B7186" opacity={ease(f, ever, 14)} />
      </Svg>
      <Pill x={500} y={840} align="center" size={26} o={ease(f, ever, 12) * a}>EVEREST · 8,850 m, NASA'S FIGURE</Pill>
      <Pill x={1040} y={840} align="center" size={26} color={B.gauge} o={a}>~10 km ACROSS</Pill>
      <Card x={1040} y={420} align="center" big="NO PICTURE" size={64} color={B.paper} o={ease(f, none, 10) * a} />
      <Plate id="l09-chicxulub" from={buried - 6} to={eros} box={{ x: 120, y: 150, w: 620, h: 700 }} fit="contain" s0={1} s1={1.08} o0={[50, 85]} bright={1} />
      <Pill x={780} y={170} size={28} o={map} color={B.gauge}>THE CRATER'S TRACE, NOT THE ROCK</Pill>
      <Card x={780} y={240} big="180 km+" small="the crater, buried" size={70} o={ease(f, wide, 10) * map * (1 - ease(f, species, 10))} />
      <Card x={780} y={460} big="A FAINT TROUGH" small="~5 km wide · 3 to 5 m deep" size={60} color={B.paper} o={ease(f, trough, 10) * map * (1 - ease(f, species, 10))} />
      <Pill x={780} y={300} size={26} o={ease(f, species, 10) * map}>A NASA CAPTION LINKS IT TO A LOSS OF SPECIES</Pill>
      <Pill x={780} y={370} size={26} o={ease(f, chem, 10) * map}>A MATCH TO CARBON-RICH METEORITES</Pill>
      <Pill x={780} y={460} size={26} color={B.gauge} o={ease(f, see, 10) * map}>TO SEE THIS SCALE, LOOK AT SOMETHING ELSE</Pill>
      <Plate id="l09-eros" from={eros} to={t.frames + 20} s0={1.15} s1={1.45} o0={[30, 30]} o1={[75, 75]} bright={1} />
      <Pill x={960} y={170} align="center" size={40} color={B.gauge} o={ease(f, eros, 8)}>EROS · NOT THE CHICXULUB ROCK</Pill>
      <Card x={70} y={620} big="21 MILES" size={64} o={win(f, miles, near, 10)} />
      <Card x={70} y={620} big="ORBITED 2000" small={f >= land ? "landed on, 2001" : " "} size={60} color={B.paper} o={win(f, near, exc, 10)} />
      <Card x={70} y={620} big="THE EXCEPTION" small="more likely shattered but intact" size={60} o={ease(f, exc, 10)} />
    </RungShell>
  );
};

/** Rung 10. #62-64. The Dawn frame (1024 px: inset), then a drawn cut-away and a drawn crater width. */
export const World: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const nasa = at(t, "NASA calls");
  const dawn = at(t, "Dawn orbited");
  const crust = at(t, "with a crust");
  const mantle = at(t, "a mantle");
  const core = at(t, "and a core");
  const world = at(t, "It isn't a pile");
  const rhea = at(t, "It also carries");
  const pct = at(t, "That's about ninety-five");
  const cut = win(f, crust - 20, rhea, 12);
  const sweep = ease(f, rhea + 20, 60);
  const R = 300;
  return (
    <RungShell t={t} index={9} m={5.3e5} reading="~530 km" sub="Vesta" craft={f >= dawn ? "ORBITED" : undefined} made={f >= world ? "A WORLD" : undefined} flips={[dawn, world]} chips={f < crust - 20 ? [{ kind: "REAL PHOTO", source: "NASA, Dawn · via IAU, CC BY 4.0" }] : [{ kind: "ILLUSTRATION", source: "not to scale" }]}>
      <Plate id="l09-vesta" from={0} to={crust - 14} box={{ x: 330, y: 160, w: 680, h: 680 }} s0={1} s1={1.14} bright={1} />
      <Pill x={1050} y={250} size={28} color={B.gauge} o={ease(f, nasa, 10) * (1 - ease(f, crust - 20, 10))}>NASA: “THE LARGEST ASTEROID”</Pill>
      <Card x={1050} y={330} big="16 JULY 2011 →" small="to 5 Sept 2012, in orbit" size={46} color={B.paper} o={ease(f, dawn, 10) * (1 - ease(f, crust - 20, 10))} />
      <Svg o={cut}>
        <circle cx={670} cy={500} r={R} fill="#74685A" />
        <circle cx={670} cy={500} r={R * mix(1, 0.88, ease(f, mantle - 10, 20))} fill="#9B5D3D" opacity={ease(f, mantle, 14)} />
        <circle cx={670} cy={500} r={R * 0.42 * ease(f, core, 18)} fill="#E0B040" />
      </Svg>
      <Pill x={1000} y={260} size={36} o={ease(f, crust, 10) * cut}>CRUST</Pill>
      <Pill x={1000} y={420} size={36} o={ease(f, mantle, 10) * cut}>MANTLE</Pill>
      <Pill x={1000} y={580} size={36} o={ease(f, core, 10) * cut}>CORE</Pill>
      <Card x={70} y={220} big="A WORLD" size={84} o={ease(f, world, 10) * cut} />
      <Svg o={ease(f, rhea, 12)}>
        <circle cx={670} cy={500} r={R} fill="#6A6C70" />
        <ellipse cx={670} cy={660} rx={R * 0.95 * sweep * 0.82} ry={70 * sweep} fill="#3A3C42" />
        <line x1={670 - R * 0.95 * sweep * 0.82} y1={660} x2={670 + R * 0.95 * sweep * 0.82} y2={660} stroke={B.gauge} strokeWidth={6} />
      </Svg>
      <Card x={1040} y={230} big="RHEASILVIA" small="about 500 km wide" size={64} o={ease(f, rhea, 10)} />
      <Card x={1040} y={450} big={`~${Math.round(95 * lin(f, pct, pct + 40))} %`} small="of Vesta's width" size={84} color={B.paper} o={ease(f, pct, 10)} />
    </RungShell>
  );
};

/** Rung 11. #47, #65-69, #2, #68. A drawn disc against a drawn Earth, a tag sliding off, then Occator (real), pushing in. */
export const Top: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const rad = at(t, "with a radius");
  const quarter = at(t, "This one object");
  const moon = at(t, "And all the asteroids");
  const piazzi = at(t, "Piazzi found");
  const until = at(t, "It was called");
  const why = at(t, "That's why");
  const big = at(t, "The biggest thing");
  const dawn = at(t, "Dawn went");
  const ice = at(t, "Under the surface");
  const occ = at(t, "And in Occator");
  const salt = at(t, "They're salt");
  const young = at(t, "and some of it");
  const a = 1 - ease(f, quarter - 8, 12);
  const b = win(f, quarter - 4, piazzi, 12);
  const c = win(f, piazzi - 4, dawn, 12);
  const R = 70;
  const conv = ease(f, quarter, 50);
  const slide = ease(f, until + 40, 30);
  const year = Math.round(mix(1801, 2006, lin(f, until, until + 40)));
  const zoom = mix(1.5, 3, ease(f, occ, 90));
  return (
    <RungShell t={t} index={10} m={9.52e5} reading="~952 km" sub="Ceres · the end of the bar" craft={f >= dawn ? "ORBITED" : undefined} made={f >= ice ? "A WORLD" : undefined} flips={[dawn, ice]} chips={f < dawn ? [{ kind: "ILLUSTRATION", source: "not a picture of Ceres" }] : [{ kind: "REAL PHOTO", source: "NASA/JPL-Caltech/UCLA/MPS/DLR/IDA · Dawn" }]}>
      <Svg o={a}>
        <circle cx={1500} cy={500} r={R * 13} fill="#1E4A63" opacity={ease(f, rad, 20)} />
        <circle cx={300} cy={500} r={R * ease(f, 0, 24)} fill="#8A8F96" />
      </Svg>
      <Pill x={300} y={600} align="center" o={a}>CERES, DRAWN</Pill>
      <Pill x={900} y={200} o={ease(f, rad, 14) * a} size={30}>EARTH, DRAWN: 13 × THE RADIUS</Pill>
      <Svg o={b}>
        {Array.from({ length: 120 }, (_, i) => {
          const tgt = i < 30;
          const x0 = 100 + rnd(i + 3) * 1300;
          const y0 = 240 + rnd(i + 8) * 300;
          return <circle key={i} cx={tgt ? mix(x0, 400 + (i % 6) * 8, conv) : x0 + Math.sin(f / 30 + i) * 6} cy={tgt ? mix(y0, 400 + (i % 5) * 8, conv) : y0} r={5} fill={tgt ? B.gauge : "#6E7F8F"} />;
        })}
        <rect x={160} y={600} width={1200} height={50} rx={10} fill="rgba(255,255,255,0.18)" />
        <rect x={160} y={600} width={300 * conv} height={50} rx={10} fill={B.gauge} />
      </Svg>
      <Pill x={160} y={660} size={30} o={b} color={B.gauge}>25 % OF THE BELT'S MASS, IN ONE OBJECT</Pill>
      <Card x={760} y={730} align="center" big="ALL ASTEROIDS < OUR MOON" small="by total mass" size={46} color={B.paper} o={ease(f, moon, 10) * b} />
      <Svg o={c}>
        <circle cx={760} cy={500} r={210} fill="#8A8F96" />
      </Svg>
      <Card x={70} y={200} big={f >= until ? String(year) : "1801"} small={f >= until + 40 ? "the name changes" : "Piazzi · first known in the belt"} o={c} />
      <div style={{ position: "absolute", left: mix(760, 2200, slide), top: 450, opacity: c, transform: `translateX(-50%) rotate(${-6 + slide * 30}deg)`, padding: "6px 24px", background: B.tease, color: B.paper, fontFamily: F.headline, fontSize: 80, whiteSpace: "nowrap" }}>ASTEROID</div>
      <div style={{ position: "absolute", left: 760, top: 450, opacity: slide * c, transform: "translateX(-50%)", padding: "6px 24px", background: B.aqua, color: B.ink, fontFamily: F.headline, fontSize: 80, whiteSpace: "nowrap" }}>DWARF PLANET</div>
      <Pill x={1000} y={220} color={B.gauge} o={win(f, why, big, 10) * c}>SO VESTA GETS THE TITLE</Pill>
      <Card x={760} y={740} align="center" big="THE BIGGEST ISN'T AN ASTEROID" size={52} o={ease(f, big, 10) * c} />
      <Plate id="l09-occator" from={dawn - 4} to={t.frames + 20} s0={zoom} s1={zoom} o0={[56, 50]} bright={1} />
      <Card x={70} y={190} big="MARCH 2015" small="Dawn, in orbit" size={56} o={win(f, dawn, ice, 10)} />
      <Pill x={70} y={190} size={32} o={win(f, ice, occ, 10)}>THE MANTLE: PROBABLY WATER ICE</Pill>
      <Pill x={70} y={190} size={36} color={B.gauge} o={ease(f, occ, 10)}>OCCATOR · 92 km WIDE</Pill>
      <Card x={70} y={280} big="SALT" small="from a deep reservoir of brine" size={70} o={ease(f, salt, 10)} />
      <Pill x={70} y={470} size={30} o={ease(f, young, 10)}>SOME UNDER 2 MILLION YEARS OLD</Pill>
    </RungShell>
  );
};

/** Closer. #39, #45, #48, #46, #34. The two ends joined along the ruler; three zones; two spacecraft still going. */
export const Closer: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const oz = at(t, "About four ounces");
  const brines = at(t, "NASA's own release");
  const both = at(t, "So half a kilometre");
  const climb = at(t, "And that's the climb");
  const solid = at(t, "small can be solid");
  const pile = at(t, "the middle is a pile");
  const top = at(t, "and the top is a world");
  const much = at(t, "Much of that");
  const going = at(t, "We're still going");
  const dip = at(t, "where it will dip");
  const hera = at(t, "And a probe called");
  const pics = win(f, -20, climb, 12);
  const zones = win(f, climb - 4, going, 12);
  const trips = ease(f, going, 12);
  const bx = rulerX(500);
  const cx = rulerX(9.52e5);
  const arc = lin(f, both, both + 60);
  const tr = lin(f, going + 20, dip + 40);
  return (
    <RungShell t={t} index={10} m={9.52e5} reading={f >= going ? "STILL GOING" : "~952 km"} sub={f >= going ? "the ladder, by hand" : "the top of the bar"} chips={pics > 0.5 ? [{ kind: "REAL PHOTO", source: "NASA Johnson · NASA/JPL-Caltech/UCLA/MPS/DLR/IDA" }] : [{ kind: "ILLUSTRATION", source: "not to scale" }]}>
      <Plate id="l09-sample" from={0} to={climb} box={{ x: 80, y: 150, w: 640, h: 440 }} s0={1.2} s1={1.5} o0={[62, 62]} bright={1} />
      <Plate id="l09-occator" from={brines - 6} to={climb} box={{ x: 780, y: 150, w: 640, h: 440 }} s0={2.2} s1={2.7} o0={[56, 50]} bright={1} />
      <Pill x={400} y={600} align="center" size={28} o={ease(f, oz, 10) * pics} color={B.gauge}>BENNU · ~4 oz · 11 SALT MINERALS</Pill>
      <Pill x={1100} y={600} align="center" size={28} o={ease(f, brines, 10) * pics} color={B.gauge}>CERES · SIMILAR BRINES, NASA</Pill>
      <Svg o={pics * (f >= both ? 1 : 0)}>
        <path d={`M${bx} 985 Q ${(bx + mix(bx, cx, arc)) / 2} ${985 - 140 * arc} ${mix(bx, cx, arc)} 985`} stroke={B.aqua} strokeWidth={8} fill="none" strokeLinecap="round" />
      </Svg>
      <Card x={700} y={665} align="center" big="BOTH: SIGNS OF SALTY WATER" size={52} color={B.aqua} o={ease(f, both, 10) * pics} />
      <Svg o={zones}>
        <rect x={rulerX(1e-4)} y={640} width={(rulerX(200) - rulerX(1e-4)) * ease(f, solid, 20)} height={80} fill="#8796A4" opacity={0.8} />
        <rect x={rulerX(200)} y={640} width={(rulerX(1e4) - rulerX(200)) * ease(f, pile, 20)} height={80} fill={B.aqua} opacity={0.85} />
        <rect x={rulerX(1e4)} y={640} width={(rulerX(9.52e5) - rulerX(1e4)) * ease(f, top, 20)} height={80} fill={B.gauge} opacity={0.85} />
      </Svg>
      <Pill x={500} y={570} align="center" size={36} o={ease(f, solid, 10) * zones}>SMALL: CAN BE SOLID</Pill>
      <Pill x={1100} y={570} align="center" size={36} o={ease(f, pile, 10) * zones}>MIDDLE: A PILE</Pill>
      <Pill x={1610} y={570} align="center" size={36} o={ease(f, top, 10) * zones}>TOP: A WORLD</Pill>
      <Card x={760} y={220} align="center" big="ROUGHLY" size={110} color={B.paper} o={zones} />
      <Pill x={760} y={430} align="center" size={36} color={B.gauge} o={ease(f, much, 10) * zones}>MUCH OF THAT, LEARNED BY GOING THERE</Pill>
      <Svg o={trips}>
        <path d={rock(240, 480, 90, 86, 4)} fill="#7E8C99" />
        <path d={rock(1180, 480, 70, 50, 6)} fill="#7E8C99" />
        <path d="M330 480 Q 720 230 1110 480" stroke="rgba(255,255,255,0.3)" strokeWidth={4} strokeDasharray="10 14" fill="none" />
        <circle cx={mix(330, 1110, tr)} cy={480 - 4 * tr * (1 - tr) * 125} r={12} fill={B.gauge} />
        {f >= dip ? <circle cx={1180} cy={480} r={82 + 8 * Math.sin(f / 7)} stroke={B.gauge} strokeWidth={4} fill="none" /> : null}
      </Svg>
      <Pill x={240} y={590} align="center" size={30} o={trips}>BENNU</Pill>
      <Pill x={1180} y={590} align="center" size={30} o={trips}>APOPHIS</Pill>
      <Card x={700} y={190} align="center" big="OSIRIS-APEX" size={64} o={trips} />
      <Pill x={1180} y={650} align="center" size={26} color={B.gauge} o={ease(f, dip, 10)}>WITHIN 16 FEET · THEN THRUSTERS</Pill>
      <Card x={70} y={740} big="HERA · DUE AT DIDYMOS, NOV 2026" size={46} color={B.aqua} o={ease(f, hera, 10)} />
    </RungShell>
  );
};
