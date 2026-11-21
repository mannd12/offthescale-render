// `L19IntoJupiter-kit-demo`: the foundation check (BUILD.md §4.1, §5). Not part of the episode. 150 f, two sheets of eight
// 480×540 panels, each on its own family:
//   0-74    sheet 1: the limb (bands shearing in opposite directions, stars, Tick on the pad, the probe on its hook), the crest
//           descent (decks scrolling up + shear, ghost decks with a drawing head and the one real deck filling, wisps, the
//           capsule under its canopy), the BarDial (needle, lamps, two arcs with heads, the mission marker, the heat ring),
//           the wind (streaks, fast shear, the thermometer), the tape in its four modes + timer, the tickets (slam, swing,
//           MODEL draw) + reel, the entry (flare, sparks, shield, orbiters, Earth dot), the ghost probe in the furnace
//   75-149  sheet 2: the section (gas/liquid/metal, dilute core spreading, the 63 % ring), the to-scale rim hair on a
//           1,000-px radius, the gold layer (fill front, currents, zig-zag sparks, rain), the balance + flasks + thermo, the
//           flat map (bands, the GRS oval, equator, scan, hole), the dry patch (opening, water ring, the joke props), the
//           ledger + pills + error bar + check, the icons + the chroma table
// Check it with stills 15 frames apart (20, 35 · 95, 110): every mover must visibly move between them.
// Every number shown on a piece is a data19.ts READ value or a dial scale mark (the chroma table is a check readout).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Embers, IF2, Sky, Stage, Tick } from "../../lib/illustrated";
import { L19_COLORS as C, chromaTable, familyOf, type L19FamilyName } from "./families";
import { READ } from "./data19";
import { BarDial, Thermo } from "./dial";
import { Ledger, Reel, TapeTicket, TapeTrace } from "./tape";
import { DeckBands, DryPatch, FlatMap, WindStreaks, Wisps } from "./decks";
import { Canopy, Capsule, Flare, GhostProbe, Orbiter, ShieldPlate } from "./probe19";
import { Balance, GoldLayer, Section } from "./interior";
import { AgencyPill, Check, ErrorBar, OurSumPill, QuestionTag, WordPill } from "./tags19";
import { Sparks, StarsTint } from "./flows19";
import { Bolt, Compass, EarthDot, Flask, Headset, Magnifier, SunIcon, WaterDrop } from "./icons19";

export const L19_KIT_DEMO_FRAMES = 150;
const SHEET2 = 75;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const fr = (v: number) => v - Math.floor(v);
const PW = 480;
const PH = 540;

const Panel: React.FC<{ id: string; x: number; y: number; fam: L19FamilyName; label: string; children: React.ReactNode }> = ({ id, x, y, fam, label, children }) => (
  <g>
    <defs>
      <clipPath id={id}>
        <rect x={x} y={y} width={PW} height={PH} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>
      <Sky family={familyOf(fam)} x={x} y={y} w={PW} h={PH} />
      {children}
    </g>
    <rect x={x} y={y} width={PW} height={PH} fill="none" stroke="#1A0402" strokeWidth={3} />
    <rect x={x + 6} y={y + PH - 32} width={label.length * 8.6 + 16} height={26} rx={6} fill="rgba(26,4,2,0.7)" />
    <text x={x + 14} y={y + PH - 13} style={{ fontFamily: IF2.label, fontSize: 15, letterSpacing: 1.2, fill: "#FFEFC8" }}>
      {label}
    </text>
  </g>
);

const Sheet1: React.FC<{ f: number }> = ({ f }) => {
  const limb = familyOf("limb");
  return (
    <g>
      {/* 1 · limb: the limb (DeckBands clipped to a huge circle) shearing ±20 px/f, stars sliding 12 px/f, Tick on the pad */}
      <Panel id="k1" x={0} y={0} fam="limb" label="1 limb · limb shear ±20 · stars · Tick · probe hook">
        <StarsTint f={f} x={0} y={0} w={PW} h={PH} n={50} speed={12} />
        <defs>
          <clipPath id="k1limb">
            <circle cx={240} cy={1300} r={1000} />
          </clipPath>
        </defs>
        <g clipPath="url(#k1limb)">
          <DeckBands f={f} speed={0} shear={[20, -18, 24, -16]} x={0} y={290} w={PW} h={260} belt />
        </g>
        <circle cx={240} cy={1300} r={1000} fill="none" stroke={limb.light} strokeWidth={5} opacity={0.8} />
        <rect x={40} y={190} width={150} height={16} rx={8} fill={C.goldRim} transform={`translate(0 ${Math.sin(f * 0.15) * 6})`} />
        <Tick x={90} y={190 + Math.sin(f * 0.15) * 6} pxPerM={52} frame={f} pose="hold" expression="thinking" />
        <line x1={230} y1={120} x2={230 + Math.sin(f * 0.2) * 14} y2={185} stroke={C.goldRim} strokeWidth={3} />
        <Capsule x={230 + Math.sin(f * 0.2) * 14} y={205} r={22} f={f} chips={6} />
      </Panel>
      {/* 2 · crest: the descent; decks scroll up 22 px/f, shear ±18-24; ghost decks with a head; the real deck fills; wisps */}
      <Panel id="k2" x={PW} y={0} fam="crest" label="2 crest · decks up 22 · ghost HIGH/MID/LOW · wisps">
        <DeckBands f={f} speed={22} shear={[18, -22, 24, -16]} x={PW} y={0} w={PW} h={PH} ghost={["HIGH", "MIDDLE", "LOW"]} ghostDraw={cl(f / 50)} fill={cl((f - 20) / 40)} />
        <Wisps f={f} x={PW} y={0} w={PW} h={PH} n={8} speed={26} />
        <Canopy x={PW + 240} y={170} r={30} unfurl={cl(f / 25)} f={f} />
        <Capsule x={PW + 240} y={170} r={30} f={f} chips={6} />
      </Panel>
      {/* 3 · deepdeck: the BarDial; needle sweeping 0.5→30, lamps lighting, two arcs (Juno 0.7-30 dashed blue; probe to 23)
          drawing, the mission marker, the heat ring filling */}
      <Panel id="k3" x={PW * 2} y={0} fam="deepdeck" label="3 deepdeck · BarDial needle · lamps · arcs · heat">
        <BarDial
          f={f}
          cx={PW * 2 + 240}
          cy={250}
          r={165}
          needle={Math.exp(Math.log(0.5) + (Math.log(30) - Math.log(0.5)) * fr(f / 60))}
          lit={(f / 5) % 13}
          arcs={[
            { from: 0.7, to: 30, draw: cl(f / 50), color: C.model, dashed: true },
            { from: 4, to: 23, draw: cl((f - 10) / 40), color: C.heard, inset: 1.6, width: 0.06 },
          ]}
          marker={10}
          heat={cl(f / 60)}
        />
      </Panel>
      {/* 4 · deepdeck: wind; streaks tearing 30-40 px/f in opposite directions over fast-shearing decks; thermometer rising */}
      <Panel id="k4" x={PW * 3} y={0} fam="deepdeck" label="4 deepdeck · wind 34 · shear ±30 · Thermo 36 px/f">
        <DeckBands f={f} speed={18} shear={[30, -34, 28, -30]} x={PW * 3} y={0} w={PW} h={PH} colors={["#D8381C", "#F26A1E", "#A02418", "#C0301A", "#F28A1E"]} belt />
        <WindStreaks f={f} bands={[{ y: 60, h: 120, dir: 1 }, { y: 200, h: 120, dir: -1 }, { y: 340, h: 120, dir: 1 }]} speed={34} x={PW * 3} w={PW} />
        <Canopy x={PW * 3 + 150} y={170} r={28} unfurl={1} f={f} />
        <Capsule x={PW * 3 + 150} y={170} r={28} f={f} chips={6} />
        <Thermo x={PW * 3 + 380} y={460} h={360} level={fr(f / 40)} expected={0.45} f={f} />
      </Panel>
      {/* 5 · scope: the tape in its four modes scrolling 26 px/f under the head; the timer */}
      <Panel id="k5" x={0} y={PH} fam="scope" label="5 scope · TapeTrace wave/jagged/flat/dashed · timer">
        <TapeTrace f={f} x={20} y={PH + 70} w={330} h={60} mode="wave" timer={cl(f / 60)} />
        <TapeTrace f={f} x={20} y={PH + 180} w={330} h={60} mode="jagged" />
        <TapeTrace f={f} x={20} y={PH + 290} w={330} h={60} mode="flat" />
        <TapeTrace f={f} x={20} y={PH + 400} w={330} h={60} mode="dashed" />
      </Panel>
      {/* 6 · scope: HEARD slams and swings (6 deg/f), MODEL draws on and swings, the reel turns 8 deg/f, Tick listens */}
      <Panel id="k6" x={PW} y={PH} fam="scope" label="6 scope · tickets slam/swing/draw · Reel · Tick">
        <TapeTicket x={PW + 170} y={PH + 120} word="HEARD" f={f} slam={cl(fr(f / 40) * 1.6)} swing={18} size={0.8} />
        <TapeTicket x={PW + 170} y={PH + 290} word="MODEL" f={f} draw={cl(f / 45)} swing={18} size={0.8} />
        <Reel x={PW + 390} y={PH + 120} r={60} f={f} />
        <Tick x={PW + 380} y={PH + 470} pxPerM={90} frame={f} pose="listen" expression="surprised" />
        <Headset x={PW + 300} y={PH + 470} size={50} />
      </Panel>
      {/* 7 · limb: the entry; flare + sparks 30 px/f, the shield tumbling, Galileo sending data dots, Juno spinning with rings */}
      <Panel id="k7" x={PW * 2} y={PH} fam="limb" label="7 limb · Flare+Sparks · shield · orbiters · Earth">
        <StarsTint f={f} x={PW * 2} y={PH} w={PW} h={PH} n={40} speed={8} />
        <Flare x={PW * 2 + 140} y={PH + 140} r={36} f={f} angle={35} />
        <ShieldPlate x={PW * 2 + 330} y={PH + 120} r={40} f={f} glow={0.8} tumble={6} />
        <Orbiter x={PW * 2 + 120} y={PH + 360} kind="galileo" f={f} size={0.6} dish="data" aim={0} />
        <Orbiter x={PW * 2 + 360} y={PH + 360} kind="juno" f={f} size={0.5} dish="rings" />
        <Orbiter x={PW * 2 + 380} y={PH + 230} kind="voyager" f={f} size={0.4} />
        <EarthDot x={PW * 2 + 440} y={PH + 470} size={12} f={f} />
      </Panel>
      {/* 8 · furnace: the ghost probe sinking into the amber haze, embers rising, the MODEL ticket drawing over a dashed tape */}
      <Panel id="k8" x={PW * 3} y={PH} fam="furnace" label="8 furnace · GhostProbe · embers · MODEL over tape">
        <TapeTrace f={f} x={PW * 3 - 40} y={PH + 110} w={420} h={60} mode="dashed" />
        <TapeTicket x={PW * 3 + 250} y={PH + 110} word="MODEL" f={f} draw={cl(f / 40)} size={0.7} />
        <GhostProbe x={PW * 3 + 240} y={PH + 250 + fr(f / 74) * 160} r={46} f={f} />
        <Embers frame={f} x0={PW * 3} x1={PW * 4} y={PH * 2} n={36} color={C.goldHot} />
      </Panel>
    </g>
  );
};

const Sheet2: React.FC<{ f: number }> = ({ f }) => {
  const g = f - SHEET2;
  const tbl = chromaTable();
  return (
    <g>
      {/* 1 · furnace: the section; gas/liquid/metal, the dilute core spreading, the 63 % ring growing, layer texture turning */}
      <Panel id="m1" x={0} y={0} fam="furnace" label="1 furnace · Section dilute · spread · ring 0.63">
        <Section f={g} cx={240} cy={260} radius={210} layers={["gas", "liquid", "metal"]} core="dilute" spread={cl(g / 50)} ring={0.63 * cl(g / 40)} />
      </Panel>
      {/* 2 · furnace: a 1,000-px radius with the 156 km hair at the rim (to scale), the hard old core shown in the corner */}
      <Panel id="m2" x={PW} y={0} fam="furnace" label="2 furnace · toScale hair on R1000 · hard core">
        <Section f={g} cx={PW + 240} cy={1250} radius={1000} layers={["gas", "liquid", "metal"]} core="none" toScale />
        <Section f={g} cx={PW + 380} cy={120} radius={80} layers={["gas", "liquid", "metal"]} core="hard" />
      </Panel>
      {/* 3 · furnace: the gold layer; a fill front 28 px/f, currents circling, zig-zag sparks 36 px/f; below, helium rain */}
      <Panel id="m3" x={PW * 2} y={0} fam="furnace" label="3 furnace · GoldLayer fill · sparks · rain">
        <GoldLayer f={g} x={PW * 2 + 20} y={40} w={440} h={200} fill={cl(g / 16)} sparks />
        <GoldLayer f={g} x={PW * 2 + 20} y={270} w={440} h={200} rain currents={false} />
      </Panel>
      {/* 4 · scope: the balance tipping, two flasks (one filling to exactly half), the thermometer */}
      <Panel id="m4" x={PW * 3} y={0} fam="scope" label="4 scope · Balance · Flask · Thermo">
        <Balance f={g} x={PW * 3 + 240} y={110} tilt={-14 * cl(g / 40)} size={0.55} />
        <Flask x={PW * 3 + 90} y={410} size={150} level={0.5 * cl(g / 40)} f={g} />
        <Flask x={PW * 3 + 250} y={410} size={150} level={1} f={g} />
        <Thermo x={PW * 3 + 410} y={470} h={300} level={fr(g / 40)} f={g} />
      </Panel>
      {/* 5 · crest: the flat stripe map; bands sliding 18 px/f, the GRS oval turning, the equator lit, a scan band, a hole */}
      <Panel id="m5" x={0} y={PH} fam="crest" label="5 crest · FlatMap bands · GRS · equator · scan · hole">
        <FlatMap f={g} x={20} y={PH + 30} w={440} h={440} spot={{ x: 0.3, y: 0.68, r: 0.08 }} equator={1} scan={fr(g / 60)} hole={cl(g / 40)} />
      </Panel>
      {/* 6 · crest: the dry patch opening, the water ring expanding, the cactus + tumbleweed (F14) */}
      <Panel id="m6" x={PW} y={PH} fam="crest" label="6 crest · DryPatch open · water ring · props">
        <DeckBands f={g} speed={0} shear={[14, -16, 18]} x={PW} y={PH} w={PW} h={PH} />
        <DryPatch f={g} x={PW + 240} y={PH + 260} r={95} open={cl(g / 30)} ring={fr(g / 50)} props />
      </Panel>
      {/* 7 · scope: the ledger (solid to 0.3, dashed after, marker, pins popping, drifting), pills, the error bar, the check */}
      <Panel id="m7" x={PW * 2} y={PH} fam="scope" label="7 scope · Ledger · pills · ErrorBar · Check">
        <Ledger f={g} x0={PW * 2 + 20} x1={PW * 3 - 20} y={PH + 70} solidTo={0.3} marker={0.3} pins={[0.1, 0.3, 0.6, 0.9]} pinPop={cl(g / 40)} />
        <OurSumPill x={PW * 2 + 20} y={PH + 160} size={20} />
        <AgencyPill x={PW * 2 + 190} y={PH + 160} agency="NASA SAID (1996)" size={20} />
        <WordPill x={PW * 2 + 20} y={PH + 215} text="NO FLOOR" size={20} F={familyOf("scope")} />
        <WordPill x={PW * 2 + 190} y={PH + 215} text="NOT THE SAME LEVEL" size={18} F={familyOf("scope")} />
        <QuestionTag x={PW * 2 + 430} y={PH + 230} f={g} size={46} />
        <ErrorBar x={PW * 2 + 120} y={PH + 490} f={g} value={140} grow={cl(g / 25)} whisk={cl((g - 20) / 20)} up={124} down={88} label={READ.water27.text} />
        <Check x={PW * 2 + 340} y={PH + 380} size={110} draw={fr(g / 40)} />
      </Panel>
      {/* 8 · scope: the icon shelf and the chroma table (lit-frame mix per family, dark-frame mix, gold, F11 hues) */}
      <Panel id="m8" x={PW * 3} y={PH} fam="scope" label="8 scope · icons19 · chromaTable">
        <WaterDrop x={PW * 3 + 40} y={PH + 44} size={50} />
        <Bolt x={PW * 3 + 100} y={PH + 44} size={50} f={g} />
        <SunIcon x={PW * 3 + 165} y={PH + 44} size={56} f={g} />
        <Compass x={PW * 3 + 235} y={PH + 44} size={56} f={g} />
        <Magnifier x={PW * 3 + 300} y={PH + 40} size={52} rotate={Math.sin(g / 8) * 12} />
        <Sparks f={g} x={PW * 3 + 340} y={PH + 20} w={130} h={50} mode="zigzag" n={6} />
        {tbl.rows.map((r, i) => (
          <text key={r.name} x={PW * 3 + 14} y={PH + 120 + i * 34} style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: 21, fill: r.mix >= 0.4 ? C.ink : C.vermilion }}>
            {`${r.name.padEnd(9, " ")} mix ${r.mix.toFixed(2)} V ${r.value.toFixed(2)}${r.dark != null ? `  dark ${r.dark.toFixed(2)} V ${r.darkV!.toFixed(2)}` : ""}`}
          </text>
        ))}
        <text x={PW * 3 + 14} y={PH + 120 + 5 * 34} style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: 21, fill: C.ink }}>
          {`gold ${tbl.gold.map((m) => m.chroma.toFixed(2)).join(" / ")} (gate 0.55)`}
        </text>
        <text x={PW * 3 + 14} y={PH + 120 + 6 * 34} style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: 21, fill: C.ink }}>
          {`F11 hue ${tbl.f11.map((h) => h.hue).join(" / ")} (stripe, lever, verm)`}
        </text>
      </Panel>
    </g>
  );
};

export const L19KitDemo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage theme={familyOf("limb").theme} drift={false} grain={0} vignette={0}>
      {f < SHEET2 ? <Sheet1 f={f} /> : <Sheet2 f={f} />}
    </Stage>
  );
};
