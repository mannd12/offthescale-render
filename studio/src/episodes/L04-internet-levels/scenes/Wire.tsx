import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { CaptionPop, CreditChip, NumberCard, Tag, Tile, levelImage } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { Iceberg } from "../iceberg";
import { ICE_POS, LEVELS_REVEALED } from "../ladder";
import { NarrowCaption, RungShell } from "./shell";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lin = (frame: number, a: number, b: number) => clamp01((frame - a) / Math.max(1, b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const img = (image: string, ext?: "jpg" | "png") => levelImage({ id: image, name: "", reading: "", image, ext })!;
/** dark pill for text that sits on a photo or crosses a drawn line */
const pill = (size: number, color: string = B.paper): React.CSSProperties => ({ position: "absolute", padding: "8px 16px", borderRadius: 12, background: "rgba(5,14,24,0.82)", fontFamily: F.ui, fontWeight: 800, fontSize: size, letterSpacing: 1.5, textTransform: "uppercase", whiteSpace: "nowrap", color });
const cubic = (a: number, b: number, c: number, d: number, u: number) => (1 - u) ** 3 * a + 3 * (1 - u) ** 2 * u * b + 3 * (1 - u) * u ** 2 * c + u ** 3 * d;
/** a point a fraction u of the way along a polyline (by length) */
const along = (pts: [number, number][], u: number): [number, number] => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let d = clamp01(u) * seg.reduce((s, x) => s + x, 0);
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? Math.min(1, d / seg[i]) : 0;
      return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)];
    }
    d -= seg[i];
  }
  return pts[pts.length - 1];
};

/** 4 · The exchange. Lines 0-9. Sources #6 (DE-CIX record 19.6 / 29.5 Tbit/s), #17 (switches, one port per network,
 *  400 Gbit/s, >1,000 networks, 30+ data centres), #19 (hops add delay; LINX ≈ 900 members). Networks meet in a room. */
export const Exchange: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const buildingsAt = lineAt(t, 1);
  const roomAt = lineAt(t, 2);
  const cablesAt = within(t, 2, 0.22);
  const sameRoomAt = within(t, 2, 0.46);
  const connectAt = within(t, 2, 0.55);
  const switchAt = lineAt(t, 3);
  const portsAt = within(t, 3, 0.35);
  const portLabelAt = within(t, 3, 0.5);
  const gbitAt = within(t, 3, 0.8);
  const hopsAt = lineAt(t, 4);
  const peerAt = lineAt(t, 5);
  const europeAt = within(t, 6, 0.12);
  const recordAt = within(t, 6, 0.5);
  const nineteenAt = within(t, 6, 0.66);
  const worldAt = lineAt(t, 7);
  const netsAt = within(t, 8, 0.28);
  const dcAt = within(t, 8, 0.6);
  const londonAt = within(t, 8, 0.8);
  const teaseAt = lineAt(t, 9);
  // lines 0-1: the route your data takes, down a staircase of networks (somebody's computer is named first)
  const chain = ease(frame, 0, 12) * (1 - ease(frame, roomAt, 10));
  const NODES = [
    { x: 180, y: 300, at: within(t, 0, 0.55), label: ["your home network"] },
    { x: 400, y: 430, at: within(t, 0, 0.68), label: ["your internet provider"] },
    { x: 620, y: 560, at: within(t, 0, 0.9), label: ["other networks"] },
    { x: 880, y: 690, at: within(t, 0, 0.19), label: ["somebody's computer", "somewhere else"] },
  ];
  // the data packet: home (as "your data" is said) -> provider -> other networks -> on to the page in line 1
  const hop = (a: number, b: number, s: number, e: number) => {
    const k = ease(frame, s, Math.max(1, e - s));
    return [lerp(NODES[a].x, NODES[b].x, k), lerp(NODES[a].y, NODES[b].y, k)];
  };
  const pk =
    frame < within(t, 0, 0.8) ? hop(0, 1, within(t, 0, 0.58), within(t, 0, 0.7)) : frame < buildingsAt ? hop(1, 2, within(t, 0, 0.8), within(t, 0, 0.93)) : hop(2, 3, within(t, 1, 0.5), within(t, 1, 0.5) + 30);
  const hops = ease(frame, hopsAt, 12) * (1 - ease(frame, europeAt, 8));
  const card = ease(frame, europeAt, 12) * (1 - ease(frame, netsAt, 8));
  const nets = ease(frame, netsAt, 12) * (1 - ease(frame, teaseAt, 8));
  // hidden from the record card to the tease as one span: card and nets cross-fade, and the room must not show through the gap
  const room = ease(frame, roomAt, 14) * (1 - Math.max(hops, ease(frame, europeAt, 12) * (1 - ease(frame, teaseAt, 8)))); // back for "It's a room." (line 9)
  const sw = ease(frame, switchAt, 12);
  // the counter runs up as the record is described and only shows 19.6 once "nineteen point six" is said
  const tb = Math.min(19.6 * lin(frame, recordAt, nineteenAt + 12), frame < nineteenAt ? 19.4 : 19.6);
  const worldBar = 29.5 * ease(frame, within(t, 7, 0.4), 24);
  const colours = [B.gauge, B.aqua, "#7FE07F", "#F08A8A", "#B9A6FF", "#FFB36B"];
  // cables end at x 1300: the gauge's EXCHANGE chip starts at x 1366 (y 620-700)
  const cab = colours.map((_, i) => ({ y: 290 + i * 80, ym: 560 + (i - 2.5) * 30 }));
  const cablePt = (i: number, u: number): [number, number] => {
    const { y, ym } = cab[i];
    if (u < 0.5) {
      const v = u * 2;
      return [cubic(120, 400, 480, 800, v), cubic(y, y, ym, ym, v)];
    }
    const v = (u - 0.5) * 2;
    return [cubic(800, 1120, 1200, 1300, v), cubic(ym, ym, y, y, v)];
  };
  // line 4: one packet hops with a wait at every network; the other crosses in one step
  const TOP = [40, 340, 560, 780, 1100];
  const topK = Math.max(0, frame - within(t, 4, 0.2)) % 140;
  const topSeg = Math.min(3, Math.floor(topK / 30));
  const topX = topK >= 120 ? TOP[4] : lerp(TOP[topSeg], TOP[topSeg + 1], clamp01((topK - topSeg * 30) / 14));
  const botK = Math.max(0, frame - within(t, 4, 0.62)) % 50;
  const botX = lerp(40, 1100, clamp01(botK / 16));
  // line 8: more than 30 data centres around the city, each one wired to the exchange
  const RING = Array.from({ length: 30 }, (_, i) => [400 + 140 * Math.cos((i / 30) * 2 * Math.PI - Math.PI / 2), 620 + 140 * Math.sin((i / 30) * 2 * Math.PI - Math.PI / 2)]);
  const sub24: React.CSSProperties = { fontFamily: F.ui, fontWeight: 800, letterSpacing: 1.5 };
  return (
    <RungShell t={t} index={3} sceneId="l04" reading="EXCHANGE" sub="where networks meet" plate={null} credit={{ kind: "illustration" }}>
      {/* lines 0-1: the staircase of networks your data goes down; the crossing between networks is a building */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: chain }}>
        {NODES.slice(0, 3).map((n, i) => {
          const next = i < 2 ? NODES[i + 1] : NODES[3];
          const on = ease(frame, i < 2 ? next.at - 6 : within(t, 1, 0.45), 12);
          return <line key={i} x1={n.x} y1={n.y} x2={lerp(n.x, next.x, on)} y2={lerp(n.y, next.y, on)} stroke={B.tease} strokeWidth={5} strokeDasharray="12 12" strokeDashoffset={-frame * 1.5} opacity={ease(frame, n.at, 8)} />;
        })}
        {/* "That happens in specific buildings": a building drawn round the crossing into other networks */}
        <g opacity={ease(frame, buildingsAt, 10)}>
          <path d={`M555 610 L 555 515 L 620 470 L 685 515 L 685 610 Z`} fill="rgba(255,200,61,0.12)" stroke={B.gauge} strokeWidth={5} strokeLinejoin="round" />
        </g>
        {NODES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={26} fill={i === 3 ? B.paper : "#3A4A5C"} stroke={B.paper} strokeWidth={4} opacity={ease(frame, n.at, 8)} />
        ))}
        <circle cx={pk[0]} cy={pk[1]} r={14 + 2 * Math.sin(frame / 4)} fill={B.gauge} stroke={B.ink} strokeWidth={3} opacity={ease(frame, within(t, 0, 0.47), 8)} />
      </svg>
      {NODES.map((n, i) => (
        <div key={i} style={{ position: "absolute", left: n.x + (i === 2 ? 80 : 44), top: n.y - 20, opacity: chain * ease(frame, n.at, 8) }}>
          {n.label.map((l, j) => (
            <div key={l} style={{ ...sub24, fontSize: j ? 24 : 28, color: j ? B.mute : B.paper, textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>{l}</div>
          ))}
        </div>
      ))}
      {/* line 2: the room; the cables arrive as "bring their cables into the same room" is said */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: room }}>
        <rect x={560} y={380} width={480} height={360} rx={24} fill="rgba(255,255,255,0.08)" stroke={B.paper} strokeWidth={3} />
        {colours.map((c, i) => {
          const on = ease(frame, cablesAt + i * 6, 14);
          const { y, ym } = cab[i];
          return <path key={i} d={`M120 ${y} C 400 ${y}, 480 ${ym}, 800 ${ym} S 1200 ${y}, 1300 ${y}`} stroke={c} strokeWidth={8} fill="none" strokeDasharray="1500" strokeDashoffset={1500 * (1 - on)} />;
        })}
        {/* "connect to each other": one bus across all six, replaced by the switch in line 3 */}
        <line x1={800} y1={480} x2={800} y2={480 + 160 * ease(frame, connectAt, 12)} stroke={B.paper} strokeWidth={8} strokeLinecap="round" opacity={1 - sw} />
        {/* the switch: one port per network */}
        <rect x={640} y={536} width={320} height={48} rx={8} fill={B.ink} stroke={B.paper} strokeWidth={3} opacity={sw} />
        {colours.map((c, i) => (
          <rect key={i} x={662 + i * 50} y={548} width={24} height={24} rx={4} fill={c} opacity={sw * ease(frame, portsAt + i * 5, 8)} />
        ))}
        {/* traffic on every cable once the ports are lit */}
        {colours.map((c, i) => {
          const [x, y] = cablePt(i, ((frame - portsAt) / 70 + i * 0.17) % 1);
          return <circle key={i} cx={x} cy={y} r={9} fill={B.paper} stroke={c} strokeWidth={4} opacity={frame >= portsAt ? ease(frame, portsAt + 30, 10) : 0} />;
        })}
      </svg>
      <Tag x={580} y={760} opacity={room * ease(frame, sameRoomAt, 10)} color={B.paper} size={30}>one room · every network's cable</Tag>
      {/* above the cables at x 568-1090 (top cable is below y 300 there); the speed joins when "four hundred gigabits" is said */}
      <div style={{ ...pill(24, B.aqua), left: 568, top: 246, opacity: room * ease(frame, portLabelAt, 10) }}>
        one port per network<span style={{ opacity: ease(frame, gbitAt, 8) }}> · up to 400 gbit/s</span>
      </div>
      {/* line 4, why bother: the chain of hops vs the direct handover */}
      <div style={{ position: "absolute", left: 160, top: 300, width: 1180, opacity: hops }}>
        <Tag x={0} y={0} color={B.mute} size={26}>without an exchange</Tag>
        <Tag x={0} y={250} color={B.gauge} size={26} opacity={ease(frame, within(t, 4, 0.6), 10)}>at an exchange</Tag>
        <svg width={1180} height={420} style={{ position: "absolute", left: 0, top: 40 }}>
          {[[40, "you"], [340, "network 1"], [560, "network 2"], [780, "network 3"], [1100, "the page"]].map(([x, l], i) => (
            <g key={String(l)} opacity={ease(frame, hopsAt + 10 + i * 8, 8)}>
              {i < 4 ? <line x1={Number(x) + 26} y1={60} x2={TOP[i + 1] - 26} y2={60} stroke={B.tease} strokeWidth={4} strokeDasharray="10 12" /> : null}
              <circle cx={Number(x)} cy={60} r={26} fill={i === 0 || i === 4 ? B.paper : "#3A4A5C"} stroke={B.paper} strokeWidth={3} />
              <text x={Number(x)} y={122} textAnchor="middle" fontFamily={F.ui} fontWeight={800} fontSize={24} fill={B.mute} letterSpacing={1.5}>{String(l).toUpperCase()}</text>
            </g>
          ))}
          <circle cx={topX} cy={60} r={13} fill={B.gauge} stroke={B.ink} strokeWidth={3} opacity={ease(frame, within(t, 4, 0.2), 8)} />
          <g opacity={ease(frame, within(t, 4, 0.6), 10)}>
            <line x1={66} y1={310} x2={1074} y2={310} stroke={B.gauge} strokeWidth={8} />
            <circle cx={40} cy={310} r={26} fill={B.paper} stroke={B.paper} strokeWidth={3} />
            <circle cx={1100} cy={310} r={26} fill={B.paper} stroke={B.paper} strokeWidth={3} />
            <text x={40} y={372} textAnchor="middle" fontFamily={F.ui} fontWeight={800} fontSize={24} fill={B.mute} letterSpacing={1.5}>YOU</text>
            <text x={1100} y={372} textAnchor="middle" fontFamily={F.ui} fontWeight={800} fontSize={24} fill={B.mute} letterSpacing={1.5}>THE PAGE</text>
            <circle cx={botX} cy={310} r={13} fill={B.ink} stroke={B.paper} strokeWidth={4} opacity={ease(frame, within(t, 4, 0.62), 8)} />
          </g>
        </svg>
        <Tag x={660} y={0} color={B.tease} size={26} opacity={ease(frame, within(t, 4, 0.45), 10)}>every hop adds delay</Tag>
        <Tag x={660} y={250} color={B.gauge} size={26} opacity={ease(frame, within(t, 4, 0.9), 10)}>one step</Tag>
      </div>
      <div style={{ opacity: ease(frame, peerAt, 10) * (1 - ease(frame, europeAt, 8)) }}>
        <NarrowCaption opacity={1} bottom={150} size={76} color={B.paper}>
          the handshake is called <span style={{ color: B.gauge }}>peering</span>
        </NarrowCaption>
      </div>
      {/* lines 6-7: the record, and the same company worldwide, as two bars to one scale (40 px per Tbit/s) */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: card }}>
        {/* "The biggest in Europe is in Frankfurt" / "on the eighth of July, 2026, during a World Cup match", then the record card */}
        <Tag x={160} y={236} color={B.paper} size={40} opacity={1 - ease(frame, recordAt - 8, 8)}>the biggest in Europe: Frankfurt</Tag>
        <Tag x={160} y={296} color={B.gauge} size={34} opacity={ease(frame, within(t, 6, 0.3), 10) * (1 - ease(frame, recordAt - 8, 8))}>8 July 2026 · a World Cup match</Tag>
        <div style={{ opacity: ease(frame, recordAt, 10) }}>
          <NumberCard x={160} y={220} big={`${tb.toFixed(1)} Tbit/s`} small="FRANKFURT · 8 JULY 2026 · ONE WORLD CUP MATCH" size={110} />
        </div>
        <div style={{ position: "absolute", left: 160, top: 440, width: 40 * tb, height: 36, borderRadius: 8, background: B.gauge, opacity: ease(frame, recordAt, 10) }} />
        <Tag x={160 + 40 * tb + 20} y={442} color={B.gauge} size={28} opacity={ease(frame, nineteenAt + 10, 10)}>one exchange</Tag>
        <div style={{ position: "absolute", left: 160, top: 520, width: 40 * worldBar, height: 36, borderRadius: 8, background: B.paper, opacity: ease(frame, worldAt, 8) }} />
        <Tag x={160} y={570} color={B.paper} size={28} opacity={ease(frame, within(t, 7, 0.65), 10)}>29.5 Tbit/s · that company's exchanges worldwide</Tag>
      </div>
      {/* line 8: more than a thousand networks; the 30+ data centres it is reachable from; London's members */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: nets }}>
        <NumberCard x={160} y={220} big="> 1,000 networks" small="PLUGGED IN AT FRANKFURT" size={100} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {RING.map(([x, y], i) => {
            const on = ease(frame, dcAt + i * 2, 8);
            return (
              <g key={i} opacity={on}>
                <line x1={400} y1={620} x2={lerp(400, x, on)} y2={lerp(620, y, on)} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                <circle cx={x} cy={y} r={9} fill={B.aqua} />
              </g>
            );
          })}
          <rect x={382} y={602} width={36} height={36} rx={6} fill={B.gauge} opacity={ease(frame, dcAt, 8)} />
        </svg>
        <Tag x={600} y={560} color={B.aqua} size={28} opacity={ease(frame, dcAt + 10, 10)}>more than 30 data centres around the city</Tag>
        <div style={{ position: "absolute", left: 0, top: 0, opacity: ease(frame, londonAt, 10) }}>
          <NumberCard x={600} y={630} big="≈ 900 members" small="LONDON · LINX" size={68} color={B.paper} />
        </div>
      </div>
      <div style={{ opacity: ease(frame, within(t, 9, 0.8), 8) }}>
        <NarrowCaption opacity={1} bottom={150} size={88}>it's a room</NarrowCaption>
      </div>
    </RungShell>
  );
};

/** 5 · The data centre. Lines 0-6. Source #13 (Pleiades: 153 racks, 10,728 nodes, 232,416 cores, 903 TB, 2008 -> Dec 2025).
 *  Plates: Aitken shed (PD), Pleiades (CC BY 2.0). The Pleiades photo has a person in it (viewer review 1, f9368): no card
 *  or label is ever drawn over that photo - its numbers sit BESIDE it while it is shrunk to a framed panel. */
export const DataCentre: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const pleiadesAt = lineAt(t, 1);
  const panelAt = within(t, 1, 0.76);
  const numbersAt = lineAt(t, 2);
  const offAt = lineAt(t, 3);
  const backAt = within(t, 3, 0.37);
  const yoursAt = lineAt(t, 4);
  const teaseAt = lineAt(t, 5);
  const pl = ease(frame, pleiadesAt, 14) * (1 - ease(frame, yoursAt, 10));
  const kIn = ease(frame, panelAt, 24);
  const k = kIn * (1 - ease(frame, backAt, 24));
  // camera on the Pleiades photo: a push down the aisle on line 1, still while it is a panel, a second push on "look like this"
  const sP = frame < backAt ? lerp(1 + 0.14 * lin(frame, pleiadesAt, panelAt), 1.02, kIn) : 1.02 + 0.16 * lin(frame, backAt, yoursAt);
  // camera on the shed: a push in on line 0; on line 4 a second push; "into the water" tilts down
  const sS = frame < yoursAt ? 1 + 0.12 * lin(frame, 0, pleiadesAt) : 1.03 + 0.1 * lin(frame, yoursAt, teaseAt) + 0.05 * lin(frame, teaseAt, t.frames);
  const oyS = 45 + 40 * ease(frame, within(t, 5, 0.6), 40);
  const kept = [
    { at: within(t, 0, 0.55), text: "kept cold", x: 120 },
    { at: within(t, 0, 0.65), text: "kept powered", x: 440 },
    { at: within(t, 0, 0.76), text: "kept copied", x: 846 },
  ];
  const stored = [
    { at: within(t, 4, 0.02), text: "the video you're watching" },
    { at: within(t, 4, 0.37), text: "your email" },
    { at: within(t, 4, 0.46), text: "the “deep web” page" },
  ];
  const numbers = [
    { at: panelAt + 22, big: "153 racks" }, // once the panel has finished shrinking: never over the photo
    { at: numbersAt, big: "10,728 computers" },
    { at: within(t, 2, 0.46), big: "232,416 cores" },
    { at: within(t, 2, 0.8), big: "903 TB of memory" },
  ];
  const listOn = 1 - ease(frame, backAt, 10);
  return (
    <RungShell t={t} index={4} sceneId="l05" reading="DATA CENTRE" sub="where the pages live" plate={null} credit={pl > 0.5 ? { kind: "real", source: "Steve Jurvetson · CC BY 2.0 · NASA Pleiades" } : { kind: "real", source: "NASA Ames · modular supercomputer facility" }}>
      <Img src={img("aitken-shed")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sS})`, transformOrigin: `50% ${oyS}%`, filter: "brightness(0.68)" }} />
      {/* while the Pleiades photo is a panel, the frame round it is dark */}
      <AbsoluteFill style={{ background: "#050E18", opacity: pl * k }} />
      <div style={{ position: "absolute", left: lerp(0, 120, k), top: lerp(0, 150, k), width: lerp(1920, 640, k), height: lerp(1080, 360, k), overflow: "hidden", borderRadius: 16 * k, outline: `3px solid rgba(255,255,255,${0.6 * k})`, opacity: pl }}>
        <Img src={img("pleiades")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sP})`, transformOrigin: "50% 45%", filter: `brightness(${lerp(0.72, 0.95, k)})` }} />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(transparent 55%, rgba(5,14,24,0.72))", opacity: 1 - pl * k }} />
      {/* line 0: "kept cold, kept powered, kept copied" - one pill per word as it is said (x 120-1176, y 800-866) */}
      {kept.map((p) => (
        <div key={p.text} style={{ ...pill(40, p.text === "kept copied" ? B.gauge : B.paper), left: p.x, top: 800 + 20 * (1 - ease(frame, p.at, 10)), opacity: ease(frame, p.at, 10) * (1 - ease(frame, pleiadesAt, 8)) }}>{p.text}</div>
      ))}
      {/* lines 1-3: the numbers, each as it is said, in a column beside the panel (x 800-1290, y 150-570) */}
      {numbers.map((n, i) => (
        <div key={n.big} style={{ position: "absolute", left: 0, top: 0, opacity: listOn * ease(frame, n.at, 10) }}>
          <NumberCard x={800 + 30 * (1 - ease(frame, n.at, 12))} y={150 + i * 106} big={n.big} size={64} color={i === 0 ? B.gauge : B.paper} />
        </div>
      ))}
      <Tag x={120} y={526} opacity={pl * k * ease(frame, panelAt + 10, 10)} color={B.paper} size={26}>NASA Pleiades · Ames, California</Tag>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: listOn * ease(frame, offAt, 10) }}>
        <NumberCard x={120} y={600} big="2008 → Dec 2025" small="UNTIL IT WAS SWITCHED OFF" size={68} color={B.gauge} />
      </div>
      {/* line 4: what sits on a drive in one of them, named one at a time (x 120-840, y 170-400) */}
      {stored.map((s, i) => (
        <div key={s.text} style={{ ...pill(40, i === 2 ? B.gauge : B.paper), left: 120 - 40 * (1 - ease(frame, s.at, 12)), top: 170 + i * 84, opacity: ease(frame, s.at, 12) * (1 - ease(frame, teaseAt, 8)) }}>{s.text}</div>
      ))}
      <NarrowCaption opacity={ease(frame, within(t, 4, 0.74), 10) * (1 - ease(frame, teaseAt, 8))} bottom={150} size={72} color={B.paper}>
        a row of servers. <span style={{ color: B.gauge }}>a badge reader.</span>
      </NarrowCaption>
      <NarrowCaption opacity={ease(frame, within(t, 5, 0.2), 8)} bottom={150} size={80} color={B.paper}>
        next: where the internet goes <span style={{ color: B.gauge, opacity: ease(frame, within(t, 5, 0.76), 8) }}>into the water</span>
      </NarrowCaption>
    </RungShell>
  );
};

/** 6 · The landing station. Lines 0-7. Sources #7, #10, #21 (armour near shore, fishing and anchors, power-feeding
 *  equipment, a repeater every 60-80 km, dozens per crossing), #22 (25-year minimum design life). A drawn coastline
 *  cross-section with a camera: in on the shore while the burial and armour are explained, back out for the power,
 *  out over the deep for the repeaters. No photo in this scene (the cable-ship photo is shown in level 7, named as a ship). */
export const Landing: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cableAt = within(t, 0, 0.78);
  const stationAt = within(t, 1, 0.12);
  const quietAt = within(t, 1, 0.23);
  const buriedAt = within(t, 1, 0.42);
  const beachAt = within(t, 1, 0.9);
  const armourAt = within(t, 2, 0.15);
  const boatsAt = within(t, 2, 0.66);
  const anchorAt = within(t, 2, 0.9);
  const powerAt = lineAt(t, 3);
  const holdsAt = within(t, 3, 0.34);
  const feedAt = within(t, 3, 0.45);
  const flowAt = within(t, 3, 0.64);
  const wiredAt = within(t, 3, 0.8);
  const fadeAt = lineAt(t, 4);
  const repAt = lineAt(t, 5);
  const repeaterAt = within(t, 5, 0.33);
  const ampAt = within(t, 5, 0.46);
  const dozensAt = within(t, 5, 0.9);
  const lifeAt = lineAt(t, 6);
  const outAt = lineAt(t, 7);
  const land = ease(frame, within(t, 0, 0.18), 14);
  const sea = ease(frame, within(t, 0, 0.56), 16);
  const laid = ease(frame, buriedAt, 50);
  const power = ease(frame, flowAt, 12);
  const band = (from: number, to: number) => ease(frame, from, 10) * (1 - ease(frame, to, 8));
  // Geometry (world coordinates). Seabed: flat land to x 520, then down to x 1340. Sea surface flat at y 560 (the
  // shoreline is where the seabed crosses it, x 610; the beach is the dry slope above it). The cable runs 40 px under
  // the seabed to x 760 (buried near shore, #10), comes up by x 880 and from there lies on the seabed.
  const SEABED = "M160 520 L 520 520 L 700 600 L 900 700 L 1200 820 L 1340 843 L 1700 902";
  const CABLE: [number, number][] = [[290, 500], [290, 560], [520, 560], [760, 670], [880, 684], [900, 694], [1200, 814], [1340, 837], [1700, 896]];
  const CABLE_D = `M${CABLE.map((p) => p.join(" ")).join(" L ")}`;
  const REPEATERS: [number, number][] = [[960, 718], [1080, 766], [1200, 814], [1340, 837], [1480, 860], [1620, 883]]; // points on CABLE's deep leg
  const REP_U = [0.499, 0.584, 0.668, 0.761, 0.854, 0.947]; // their fractions along CABLE by length (checked against along())
  // camera: s and translation; SHORE frames the station, beach and buried stretch, DEEP the repeaters, OUT the far end
  const kShore = ease(frame, buriedAt, 45) * (1 - ease(frame, within(t, 3, 0.05), 40));
  const kDeep = ease(frame, within(t, 5, 0.18), 45) * (1 - ease(frame, lifeAt, 40));
  const kOut = ease(frame, outAt, 30);
  const s = 1 + 0.3 * kShore + 0.3 * kDeep + 0.2 * kOut;
  const tx = 16 * kShore - 670 * kDeep - 600 * kOut;
  const ty = -148 * kShore - 388 * kDeep - 356 * kOut;
  // the shore labels would be cut by the frame's left edge out over the deep: gone in the first third of each pan
  const shoreTags = 1 - Math.min(1, 3 * Math.max(kDeep, kOut));
  // line 4: one pulse of light leaves the station and fades as it goes; from "amplifies" (line 5) a pulse is
  // topped up at every repeater
  const fadeU = lin(frame, within(t, 4, 0.2), within(t, 4, 0.2) + 75);
  const fadeOn = ease(frame, within(t, 4, 0.2), 6) * (1 - ease(frame, repAt, 10));
  const repU = (((frame - ampAt) / 110) % 1 + 1) % 1;
  const lastRep = Math.max(0, ...REP_U.filter((u) => u <= repU));
  const repGlow = 1 - 0.85 * clamp01((repU - lastRep) / 0.11);
  const repOn = frame >= ampAt ? ease(frame, ampAt, 8) : 0;
  const [fx, fy] = along(CABLE, 0.02 + 0.6 * fadeU);
  const [rx, ry] = along(CABLE, repU);
  // the anchor falls from the boat to the seabed on "drop anchor"
  const anchorY = lerp(566, 606, ease(frame, anchorAt, 24));
  return (
    <RungShell t={t} index={5} sceneId="l06" reading="LANDING" sub="the beach, then out" plate={null} credit={{ kind: "illustration" }}>
      {/* the camera: clipped to the left of the gauge (x < 1340) and under the top bar (y > 110), soft right edge */}
      <div style={{ position: "absolute", left: 0, top: 110, width: 1340, height: 970, overflow: "hidden", WebkitMaskImage: "linear-gradient(to right, #000 88%, transparent)" }}>
        <div style={{ position: "absolute", left: 0, top: -110, width: 1920, height: 1080, transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0" }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {/* the sea arrives on "under an ocean", after the land ("another continent") */}
            <path d="M610 560 L 700 600 L 900 700 L 1200 820 L 1340 843 L 1700 902 L 1700 560 Z" fill="#0B3A5E" opacity={0.85 * sea} />
            <line x1={610} y1={560} x2={1700} y2={560} stroke="rgba(255,255,255,0.45)" strokeWidth={3} opacity={sea} />
            <path d={`${SEABED} L 1700 1000 L 160 1000 Z`} fill="#3A3226" opacity={land} />
            {/* the beach: the dry slope between the land and the water */}
            <path d="M440 520 L 520 520 L 610 560 L 600 568 L 516 530 L 440 530 Z" fill="#D8C089" opacity={land} />
            {/* the armoured shore end: a sheath round the buried stretch */}
            <path d="M290 534 L 290 560 L 520 560 L 760 670" stroke={B.paper} strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.5 * ease(frame, armourAt, 12)} />
            {/* the cable */}
            <path d={CABLE_D} stroke={B.gauge} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray="1600" strokeDashoffset={1600 * (1 - laid)} />
            {/* the power feed running down the cable */}
            <path d={CABLE_D} stroke="#FFE066" strokeWidth={4} fill="none" strokeDasharray="16 28" strokeDashoffset={-(frame - flowAt) * 3} opacity={power} />
            {/* the station drops onto the land as "landing stations" is said; it lights up on "the building holds" */}
            <g transform={`translate(0 ${-30 * (1 - ease(frame, stationAt, 14))})`} opacity={ease(frame, stationAt, 10)}>
              <rect x={200} y={460} width={180} height={60} rx={8} fill={B.paper} stroke={B.gauge} strokeWidth={6 * ease(frame, holdsAt, 10) * (0.6 + 0.4 * Math.sin(frame / 6))} />
              <path d="M296 468 L 276 498 L 290 498 L 282 516 L 306 484 L 292 484 Z" fill="#FFE066" stroke={B.ink} strokeWidth={2} opacity={ease(frame, feedAt, 8)} />
            </g>
            {/* where the fishing boats work and ships drop anchor */}
            <g opacity={ease(frame, boatsAt, 10) * (1 - ease(frame, powerAt, 10))}>
              <path d={`M650 ${548 + 2 * Math.sin(frame / 9)} l 110 0 l -15 18 l -80 0 Z`} fill={B.paper} />
              <rect x={680} y={530 + 2 * Math.sin(frame / 9)} width={34} height={18} fill={B.paper} />
              <line x1={738} y1={562} x2={738} y2={anchorY} stroke={B.paper} strokeWidth={3} opacity={ease(frame, anchorAt, 6)} />
              <path d={`M730 ${anchorY} l 8 10 l 8 -10 M 738 ${anchorY - 8} l 0 18`} stroke={B.paper} strokeWidth={4} fill="none" strokeLinecap="round" opacity={ease(frame, anchorAt, 6)} />
            </g>
            {/* repeaters along the deep segment, one by one from "sits a repeater" */}
            {REPEATERS.map(([x, y], i) => (
              <g key={i} opacity={ease(frame, repeaterAt + i * 8, 8)}>
                <circle cx={x} cy={y} r={15 + 5 * repOn * clamp01(1 - Math.abs(repU - REP_U[i]) / 0.02)} fill={B.paper} stroke={B.ink} strokeWidth={3} />
                <circle cx={x} cy={y} r={6} fill={B.gauge} />
              </g>
            ))}
            {/* light in the glass: a pulse that fades (line 4), then one that the repeaters top up (line 5 on) */}
            <circle cx={fx} cy={fy} r={26} fill={B.aqua} opacity={0.35 * fadeOn * (1 - 0.95 * fadeU)} />
            <circle cx={fx} cy={fy} r={14} fill="#DFF8FF" opacity={fadeOn * (1 - 0.95 * fadeU)} />
            <circle cx={rx} cy={ry} r={26} fill={B.aqua} opacity={0.35 * repOn * repGlow} />
            <circle cx={rx} cy={ry} r={14} fill="#DFF8FF" opacity={repOn * repGlow} />
          </svg>
          <Tag x={200} y={380} opacity={ease(frame, stationAt, 10) * shoreTags} color={B.paper} size={30}>landing station</Tag>
          <Tag x={200} y={420} opacity={ease(frame, quietAt, 10) * shoreTags} color={B.mute} size={24}>a quiet building near the beach</Tag>
          <Tag x={446} y={474} opacity={ease(frame, beachAt, 10) * shoreTags} color="#D8C089" size={24}>the beach</Tag>
          <Tag x={1000} y={576} opacity={sea} color={B.aqua} size={26}>the sea</Tag>
          {/* inside the ground, below the cable, clear of the armour sheath */}
          <Tag x={200} y={730} opacity={ease(frame, within(t, 1, 0.55), 10) * shoreTags} color={B.gauge} size={28}>buried under the seabed near shore</Tag>
          <Tag x={760} y={432} opacity={ease(frame, wiredAt, 10) * (1 - ease(frame, fadeAt, 8))} color="#FFE066" size={26}>not only glass · wired</Tag>
        </div>
      </div>
      <div style={{ opacity: ease(frame, cableAt, 10) * (1 - ease(frame, stationAt, 8)) }}>
        <NarrowCaption opacity={1} bottom={150} size={84} color={B.paper}>
          not by satellite. <span style={{ color: B.gauge }}>by cable.</span>
        </NarrowCaption>
      </div>
      {/* the fact band above the drawing (y 170-250: below the compact rail at y ≈ 140, above the zoomed station tag at y ≥ 330) */}
      <Tag x={500} y={170} opacity={band(armourAt, powerAt)} color={B.paper} size={28}>extra armour at the shore end</Tag>
      <Tag x={500} y={212} opacity={band(boatsAt, powerAt)} color={B.mute} size={26}>where fishing boats work and ships drop anchor</Tag>
      <Tag x={500} y={170} opacity={band(feedAt, fadeAt)} color="#FFE066" size={28}>power-feeding equipment</Tag>
      <Tag x={500} y={212} opacity={band(flowAt, fadeAt)} color={B.mute} size={26}>feeds electricity into the cable</Tag>
      <Tag x={500} y={170} opacity={band(within(t, 4, 0.45), repAt)} color={B.aqua} size={28}>light fades in glass</Tag>
      <Tag x={500} y={170} opacity={band(within(t, 5, 0.05), lifeAt)} color={B.gauge} size={28}>every 60–80 km along the sea floor</Tag>
      <Tag x={500} y={212} opacity={band(ampAt, dozensAt)} color={B.paper} size={26}>a repeater amplifies the signal</Tag>
      <Tag x={500} y={212} opacity={band(dozensAt, lifeAt)} color={B.paper} size={26}>dozens on a route across an ocean</Tag>
      {/* the number lands as "twenty-five years" is said; its label as "minimum design life" is said */}
      <div style={{ position: "absolute", left: 0, top: 0, opacity: band(within(t, 6, 0.5), outAt) }}>
        <NumberCard x={500} y={160} big="25 years" size={80} />
      </div>
      <Tag x={500} y={274} opacity={band(within(t, 6, 0.8), outAt)} color={B.paper} size={28}>minimum design life on the sea floor</Tag>
      <div style={{ opacity: ease(frame, outAt, 8) }}>
        <CaptionPop bottom={150} size={90} color={B.paper}>then they head out</CaptionPop>
      </div>
    </RungShell>
  );
};

/** 7 · The cable. Lines 0-12. Sources #8 (600+ cables, 1.5 M km, 131 km / 20,000 km), #10 (hose, hair, laid on the
 *  floor), #11/#11b (a third slower; a few hundredths of a second), #22 (zero fish-bite faults 2007-2014), #23 (150-200
 *  faults a year, 70-80 % fishing gear and anchors, 1 M -> 1.7 M km 2014-2025, Baltic Nov 2024, two weeks), #24 (repair
 *  by ship and hook). Plates: the NOAA sea-floor still (swimming sea cucumber, PD; the animal sits left of centre,
 *  around x 300-550, y 450-650 after this camera) and the cable-ship photo (CC BY 4.0), shown only as a ship. */
export const Cable: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const revealAt = Math.round(t.lines[0].at + 0.2 * t.lines[0].audioFrames);
  const lengthsAt = lineAt(t, 1);
  const hoseAt = lineAt(t, 2);
  const hairAt = within(t, 2, 0.6);
  const floorAt = lineAt(t, 3);
  const laidAt = within(t, 3, 0.55);
  const faultsAt = lineAt(t, 4);
  const breakAt = within(t, 4, 0.08);
  const sharkAt = lineAt(t, 5);
  const humanAt = lineAt(t, 6);
  const repairAt = lineAt(t, 7);
  const hookAt = within(t, 7, 0.44);
  const haulAt = within(t, 7, 0.76);
  const spliceAt = within(t, 8, 0.12);
  const balticAt = within(t, 8, 0.45);
  const growAt = lineAt(t, 9);
  const lightAt = lineAt(t, 10);
  const nyAt = within(t, 10, 0.52);
  const tapAt = lineAt(t, 11);
  const bottomAt = lineAt(t, 12);
  // lines 0-1: drawn; 2-12: the sea-floor photo, dimmed to 0.2 under every chart
  const count = ease(frame, within(t, 0, 0.1), 10) * (1 - ease(frame, lengthsAt, 8));
  const lengths = ease(frame, lengthsAt, 10) * (1 - ease(frame, hoseAt, 8));
  const scale = ease(frame, hoseAt, 12) * (1 - ease(frame, floorAt, 8));
  const floor = ease(frame, floorAt, 14);
  const dim = ease(frame, faultsAt, 12) * (1 - ease(frame, bottomAt, 20));
  const faults = ease(frame, faultsAt, 12) * (1 - ease(frame, repairAt, 8));
  const ship = ease(frame, repairAt, 12) * (1 - ease(frame, hookAt - 6, 10));
  const repair = ease(frame, hookAt - 6, 12) * (1 - ease(frame, growAt, 8));
  const grow = ease(frame, growAt, 12) * (1 - ease(frame, lightAt, 8));
  const map = ease(frame, lightAt, 12) * (1 - ease(frame, bottomAt, 8));
  const floorCable = ease(frame, laidAt, 10) * (1 - ease(frame, repairAt, 8)) + ease(frame, bottomAt, 15);
  // camera on the sea floor: it tilts down to the floor as "laid on the floor" is said, then pushes in for the last line
  const oyF = 20 + 70 * ease(frame, floorAt, 45);
  const sF = 1.15 + 0.05 * lin(frame, bottomAt, t.frames);
  // line 0: 600 marks for 600 cables; the km counter reaches its value only once "one and a half million" is said
  const marks = Math.round(600 * lin(frame, within(t, 0, 0.12), within(t, 0, 0.3)));
  const kmFinal = within(t, 0, 0.66);
  const km = Math.round(Math.min(1500000 * lin(frame, within(t, 0, 0.5), kmFinal), frame < kmFinal ? 1490000 : 1500000));
  // line 1: to one scale, 1160 px = 20,000 km
  const longBar = 1160 * ease(frame, within(t, 1, 0.76), 24);
  // the repair: the hook goes down, the cable comes up in a V to the deck, the bad piece is swapped for spare
  const hookDrop = ease(frame, hookAt, 30);
  const haul = ease(frame, haulAt, 45);
  const apexY = 820 - 420 * haul;
  const hookY = Math.min(400 + 420 * hookDrop, apexY);
  const legY = (u: number) => 820 - (820 - apexY) * u;
  const gap = 34 * ease(frame, breakAt, 8) * (frame < growAt ? 1 : 0); // mended by the time it is shown again (line 12)
  // the anchor dragged along the floor towards the break on "ships' anchors"
  const anchorX = lerp(140, 800, lin(frame, within(t, 6, 0.55), within(t, 6, 0.98)));
  // the light pulse under the Atlantic: loops on line 10; on line 11 one trip, out and back, timed to the words
  const tripOut = lin(frame, within(t, 11, 0.3), within(t, 11, 0.5));
  const tripBack = lin(frame, within(t, 11, 0.5), within(t, 11, 0.68));
  const loop = ((frame - nyAt) / 40) % 2;
  const p = frame < tapAt ? (loop < 1 ? loop : 2 - loop) : tripOut - tripBack;
  const arc = (u: number): [number, number] => [cubic(300, 500, 1040, 1240, u), cubic(560, 760, 760, 560, u)];
  const [px, py] = arc(clamp01(p));
  const credit =
    frame >= repairAt && ship > 0.5
      ? { kind: "real" as const, source: "Gordon Leggett · CC BY 4.0 · cable ship Cable Innovator" }
      : floor > 0.5
        ? { kind: "illustration" as const, source: floorCable > 0.3 || dim > 0.5 ? "drawn over a NOAA photo of the sea floor" : "over a NOAA photo of the sea floor" }
        : { kind: "illustration" as const };
  return (
    <RungShell t={t} index={6} sceneId="l07" reading="THE CABLE" sub="the sea floor" plate={null} credit={credit} revealAt={revealAt}>
      <Img src={img("swimming-cucumber", "png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${sF})`, transformOrigin: `50% ${oyF}%`, filter: `brightness(${0.75 - 0.55 * dim})`, opacity: floor }} />
      {/* line 7: the cable ship, with a slow push in, said to be a cable ship on the picture from its first frame */}
      <Img src={img("cable-ship")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.12 * lin(frame, repairAt, hookAt)})`, transformOrigin: "50% 55%", filter: "brightness(0.8)", opacity: ship }} />
      <div style={{ ...pill(28), left: 120, top: 176, opacity: ship }}>a cable ship · Cable Innovator</div>
      {/* line 0: one mark per cable, filling as "six hundred submarine cables" is said, then a light sweeping across them */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: count }}>
        {Array.from({ length: marks }, (_, i) => {
          const c = i % 30;
          const r = Math.floor(i / 30);
          const sweep = 0.55 + 0.45 * Math.max(0, Math.cos((c - ((frame - within(t, 0, 0.3)) / 3) % 40) / 3));
          return <rect key={i} x={160 + c * 38} y={392 + r * 15} width={26} height={5} rx={2.5} fill={B.aqua} opacity={frame > within(t, 0, 0.3) ? sweep : 0.8} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: count }}>
        <div style={{ opacity: ease(frame, within(t, 0, 0.2), 10) }}>
          <NumberCard x={160} y={226} big="> 600 cables" size={80} />
        </div>
        <Tag x={650} y={262} opacity={ease(frame, within(t, 0, 0.42), 10)} color={B.paper} size={28}>active or planned · 2026</Tag>
        <div style={{ opacity: ease(frame, within(t, 0, 0.5), 10) }}>
          <NumberCard x={160} y={720} big={`> ${km.toLocaleString("en-US")} km`} size={80} color={B.paper} />
        </div>
        <Tag x={720} y={756} opacity={ease(frame, within(t, 0, 0.88), 10)} color={B.paper} size={28}>of cable in service</Tag>
      </div>
      {/* line 1: the shortest and the longest, to one scale */}
      <div style={{ position: "absolute", left: 0, top: 0, opacity: lengths }}>
        <Tag x={160} y={300} color={B.mute} size={24} opacity={ease(frame, within(t, 1, 0.16), 10)}>drawn to one scale</Tag>
        <div style={{ position: "absolute", left: 160, top: 370, width: 8, height: 44, borderRadius: 3, background: B.gauge, opacity: ease(frame, within(t, 1, 0.16), 8) }} />
        <Tag x={190} y={374} color={B.gauge} size={34} opacity={ease(frame, within(t, 1, 0.42), 10)}>131 km</Tag>
        <Tag x={360} y={380} color={B.mute} size={26} opacity={ease(frame, within(t, 1, 0.58), 10)}>Ireland–Britain</Tag>
        <div style={{ position: "absolute", left: 160, top: 520, width: longBar, height: 44, borderRadius: 8, background: B.paper }} />
        <Tag x={160} y={580} color={B.paper} size={34} opacity={ease(frame, within(t, 1, 0.9), 10)}>20,000 km</Tag>
      </div>
      {/* line 2, scale strip: garden hose vs human hair (x 160-1320) */}
      <div style={{ position: "absolute", left: 160, top: 320, width: 1160, opacity: scale }}>
        {/* not to scale: hose ≈ hundreds of hairs wide, so a true-scale hair would be invisible */}
        <div style={{ ...pill(24), left: -12, top: -8 }}>for most of the crossing</div>
        <div style={{ position: "absolute", left: 0, top: 50, width: 1160 * ease(frame, within(t, 2, 0.4), 20), height: 34, borderRadius: 17, background: B.gauge }} />
        <Tag x={0} y={96} color={B.gauge} size={34} opacity={ease(frame, within(t, 2, 0.45), 10)}>as thick as a garden hose</Tag>
        <div style={{ position: "absolute", left: 0, top: 170, width: 1160, height: 2, background: "#BFEFFF", opacity: ease(frame, hairAt, 12) }} />
        {/* the light the fibres carry, running along the hair */}
        <div style={{ position: "absolute", left: 1160 * (((frame - hairAt) / 40) % 1) - 30, top: 163, width: 60, height: 16, borderRadius: 8, background: "radial-gradient(#FFFFFF, rgba(191,239,255,0))", opacity: frame > hairAt ? ease(frame, hairAt + 10, 8) : 0 }} />
        <Tag x={0} y={186} color="#BFEFFF" size={34} opacity={ease(frame, hairAt, 12)}>the fibres inside: the width of a human hair</Tag>
        <div style={{ ...pill(24, B.mute), left: -12, top: 240, opacity: ease(frame, hairAt + 20, 12) }}>hair not to scale: it would be invisible</div>
      </div>
      {/* lines 3-6: the cable drawn lying on the floor (y 820); it breaks on "Which means it breaks." */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: Math.min(1, floorCable) }}>
        <path d={`M120 820 L ${850 - gap / 2} 820`} stroke={B.gauge} strokeWidth={12} strokeLinecap="round" strokeDasharray="1300" strokeDashoffset={1300 * (1 - ease(frame, laidAt, 24))} />
        <path d={`M${850 + gap / 2} 820 L 1340 820`} stroke={B.gauge} strokeWidth={12} strokeLinecap="round" strokeDasharray="600" strokeDashoffset={600 * (1 - ease(frame, laidAt + 14, 20))} />
        <circle cx={850} cy={820} r={10 + 30 * lin(frame, breakAt, breakAt + 12)} fill="none" stroke={B.tease} strokeWidth={4} opacity={frame >= breakAt && frame < breakAt + 14 ? 1 - lin(frame, breakAt, breakAt + 14) : 0} />
        {/* line 12: light runs along the mended cable */}
        {[0, 1, 2].map((i) => {
          const x = 120 + 1220 * (((((frame - bottomAt) / 60 + i / 3) % 1) + 1) % 1);
          return <circle key={i} cx={x} cy={820} r={9} fill="#DFF8FF" opacity={frame >= bottomAt ? ease(frame, bottomAt + 10, 10) : 0} />;
        })}
        {/* the anchor, dragged across the floor */}
        <g opacity={ease(frame, within(t, 6, 0.55), 8) * (1 - ease(frame, repairAt, 8))}>
          <line x1={anchorX + 50} y1={700} x2={anchorX} y2={770} stroke={B.paper} strokeWidth={3} opacity={0.6} />
          <path d={`M${anchorX - 22} 780 q 22 26 44 0 M ${anchorX} 758 l 0 46`} stroke={B.paper} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      </svg>
      <Tag x={160} y={846} opacity={ease(frame, laidAt + 10, 10) * (1 - ease(frame, faultsAt, 8))} color={B.gauge} size={30}>laid on the floor</Tag>
      {/* lines 4-6: why it breaks. The question pill: SHARKS? when sharks come up, struck on "zero"; ANCHORS? lit on "anchors" */}
      <div style={{ position: "absolute", left: 160, top: 196, display: "flex", alignItems: "center", gap: 14, padding: "10px 20px", borderRadius: 14, background: "rgba(5,14,24,0.78)", outline: `3px solid ${B.tease}`, fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 1.5, color: B.paper, whiteSpace: "nowrap", opacity: faults * ease(frame, sharkAt, 8) }}>
        <span style={{ position: "relative" }}>
          SHARKS?
          <span style={{ position: "absolute", left: -4, right: -4, top: "48%", height: 5, background: B.tease, opacity: ease(frame, within(t, 5, 0.86), 6) }} />
        </span>
        {frame >= humanAt ? <span style={{ opacity: ease(frame, humanAt, 8) * 0.6 }}>·</span> : null}
        {frame < humanAt ? null : <span style={{ padding: "0 8px", borderRadius: 8, opacity: ease(frame, humanAt, 8), background: `rgba(255,200,61,${ease(frame, within(t, 6, 0.6), 10)})` /* B.gauge */, color: ease(frame, within(t, 6, 0.6), 10) > 0.5 ? B.ink : B.paper }}>ANCHORS?</span>}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: faults }}>
        <div style={{ opacity: ease(frame, within(t, 4, 0.42), 10) }}>
          <NumberCard x={160} y={270} big="150–200 faults a year" small="THE INDUSTRY'S OWN COUNT · ICPC" size={92} />
        </div>
        <Tag x={160} y={466} opacity={ease(frame, within(t, 5, 0.22), 10) * (1 - ease(frame, within(t, 5, 0.86), 8))} color={B.paper} size={28}>2007–2014 · fish bites of every kind, sharks included</Tag>
        <div style={{ opacity: ease(frame, within(t, 5, 0.86), 10) }}>
          <NumberCard x={160} y={450} big="0 faults from fish bites" small="SHARKS INCLUDED · 2007–2014" size={68} color={B.paper} />
        </div>
        <div style={{ opacity: ease(frame, within(t, 6, 0.04), 10) }}>
          <NumberCard x={160} y={596} big="70–80 % is us" size={68} />
        </div>
        <Tag x={620} y={620} opacity={ease(frame, within(t, 6, 0.4), 10)} color={B.paper} size={28}>fishing gear · ships' anchors</Tag>
        <Tag x={620} y={660} opacity={ease(frame, within(t, 6, 0.85), 10)} color={B.mute} size={26}>by accident</Tag>
      </div>
      {/* lines 7-8, the fix: a ship, a hook, the cable hauled to the deck, a spare piece spliced in (drawing ends at x 1320) */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: repair }}>
        <line x1={160} y1={400} x2={1320} y2={400} stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
        <rect x={800} y={330 + 3 * Math.sin(frame / 10)} width={100} height={40} rx={6} fill={B.paper} />
        <path d={`M700 ${370 + 3 * Math.sin(frame / 10)} l 30 40 l 240 0 l 30 -40 Z`} fill={B.paper} />
        <line x1={850} y1={410} x2={850} y2={hookY} stroke={B.paper} strokeWidth={4} opacity={ease(frame, hookAt, 8)} />
        <path d={`M 850 ${hookY} l 0 18 a 12 12 0 0 1 -22 -4`} stroke={B.paper} strokeWidth={5} fill="none" strokeLinecap="round" opacity={ease(frame, hookAt, 8)} />
        <path d={`M160 820 L 850 ${apexY} L 1320 820`} stroke={B.gauge} strokeWidth={12} fill="none" strokeLinejoin="round" />
        <path d={`M760 ${legY(0.87)} L 850 ${apexY} L 940 ${legY(0.81)}`} stroke={B.paper} strokeWidth={14} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={ease(frame, spliceAt, 10)} />
      </svg>
      <Tag x={160} y={170} opacity={repair} color={B.paper} size={28}>1 · a repair ship sails to the spot</Tag>
      <Tag x={160} y={212} opacity={repair * ease(frame, hookAt, 8)} color={B.paper} size={28}>2 · a hook snags the cable, hauls it to the deck</Tag>
      <Tag x={160} y={254} opacity={repair * ease(frame, spliceAt, 8)} color={B.gauge} size={28}>3 · the bad piece is cut out, spare cable spliced in</Tag>
      {/* below the hauled cable (its ends sit at y 820) */}
      <Tag x={160} y={846} opacity={repair * ease(frame, balticAt, 10)} color={B.paper} size={28}>Baltic Sea · Nov 2024 · two cables damaged</Tag>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: repair * ease(frame, within(t, 8, 0.9), 10) }}>
        <NumberCard x={160} y={892} big="both back within 2 weeks" size={64} />
      </div>
      {/* line 9, the strange part: two bars of cable (260 px per million km), two identical bands of faults */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: grow }}>
        <Tag x={200} y={200} opacity={ease(frame, within(t, 9, 0.13), 10)} color={B.paper} size={28}>kilometres of cable</Tag>
        {[
          { x: 240, h: 260, at: within(t, 9, 0.36), year: "2014", value: "≈ 1 M km" },
          { x: 460, h: 442, at: within(t, 9, 0.57), year: "2025", value: "≈ 1.7 M km" },
        ].map((b) => (
          <React.Fragment key={b.year}>
            <div style={{ position: "absolute", left: b.x, top: 760 - b.h * ease(frame, b.at, 20), width: 140, height: b.h * ease(frame, b.at, 20), borderRadius: "8px 8px 0 0", background: B.aqua }} />
            <Tag x={b.x} y={772} opacity={ease(frame, b.at, 10)} color={B.paper} size={30}>{b.year}</Tag>
            <Tag x={b.x} y={720 - b.h} opacity={ease(frame, b.at + 12, 10)} color={B.aqua} size={30}>{b.value}</Tag>
          </React.Fragment>
        ))}
        <Tag x={780} y={200} opacity={ease(frame, within(t, 9, 0.74), 10)} color={B.paper} size={28}>faults each year</Tag>
        {[800, 1020].map((x, i) => (
          <React.Fragment key={x}>
            {/* 0.9 px per fault: solid to 150, a lighter cap from 150 to 200 */}
            <div style={{ position: "absolute", left: x, top: 760 - 180 * ease(frame, within(t, 9, 0.74), 20), width: 140, height: 180 * ease(frame, within(t, 9, 0.74), 20), borderRadius: "8px 8px 0 0", background: `linear-gradient(rgba(255,90,79,0.45) 0 25%, ${B.tease} 25%)` }} />
            <Tag x={x} y={772} opacity={ease(frame, within(t, 9, 0.74), 10)} color={B.paper} size={30}>{i ? "2025" : "2014"}</Tag>
            <Tag x={x} y={530} opacity={ease(frame, within(t, 9, 0.8), 10)} color={B.tease} size={30}>150–200</Tag>
          </React.Fragment>
        ))}
        <div style={{ ...pill(40, B.paper), left: 820, top: 400, outline: `3px solid ${B.tease}`, transform: `rotate(-5deg) scale(${lerp(1.4, 1, ease(frame, within(t, 9, 0.92), 8))})`, opacity: ease(frame, within(t, 9, 0.92), 6) }}>hasn't moved</div>
      </div>
      {/* lines 10-11: the light pulse, New York to London and back, under the sea (the arc dips to y 710) */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: map }}>
        <line x1={300} y1={560} x2={1240} y2={560} stroke="rgba(255,255,255,0.25)" strokeWidth={3} strokeDasharray="8 10" opacity={ease(frame, within(t, 11, 0.47), 10)} />
        <path d="M300 560 C 500 760, 1040 760, 1240 560" stroke="rgba(255,255,255,0.4)" strokeWidth={5} fill="none" />
        <circle cx={300} cy={560} r={16} fill={B.paper} opacity={ease(frame, nyAt, 8)} />
        <circle cx={1240} cy={560} r={16} fill={B.paper} opacity={ease(frame, nyAt, 8)} />
        {/* the tap, on "When you tap a link" */}
        <circle cx={300} cy={560} r={16 + 50 * lin(frame, tapAt + 4, tapAt + 24)} fill="none" stroke={B.gauge} strokeWidth={5} opacity={frame >= tapAt + 4 ? 1 - lin(frame, tapAt + 4, tapAt + 24) : 0} />
        <circle cx={px} cy={py} r={14} fill={B.gauge} opacity={frame < tapAt ? ease(frame, nyAt + 6, 8) : ease(frame, within(t, 11, 0.3), 6)} />
      </svg>
      <Tag x={300} y={494} align="center" opacity={map * ease(frame, nyAt, 8)} color={B.paper} size={30}>New York</Tag>
      <Tag x={1240} y={494} align="center" opacity={map * ease(frame, nyAt + 10, 8)} color={B.paper} size={30}>London</Tag>
      <Tag x={770} y={600} align="center" opacity={map * ease(frame, within(t, 11, 0.47), 10)} color={B.aqua} size={26}>the Atlantic</Tag>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: map * ease(frame, within(t, 10, 0.1), 10) }}>
        <NumberCard x={160} y={210} big="≈ a third slower than in a vacuum" small="LIGHT IN GLASS" size={68} color={B.paper} />
      </div>
      <Tag x={300} y={736} opacity={map * ease(frame, within(t, 10, 0.83), 10) * (1 - ease(frame, tapAt, 8))} color={B.paper} size={28}>there and back: a few hundredths of a second</Tag>
      <NarrowCaption opacity={ease(frame, within(t, 11, 0.47), 10) * (1 - ease(frame, bottomAt, 8))} bottom={150} size={72} color={B.paper}>
        under the Atlantic and back <span style={{ color: B.gauge, opacity: ease(frame, within(t, 11, 0.71), 8) }}>before your finger has left the screen</span>
      </NarrowCaption>
      {/* line 12: "Not a secret website" struck out; then the cable on the floor, with light running along it */}
      <div style={{ ...pill(40, B.mute), left: 160, top: 220, opacity: ease(frame, within(t, 12, 0.28), 8) }}>
        <span style={{ position: "relative" }}>
          a secret website
          <span style={{ position: "absolute", left: -6, right: -6, top: "46%", height: 6, background: B.tease, transform: `scaleX(${ease(frame, within(t, 12, 0.36), 10)})`, transformOrigin: "0 50%" }} />
        </span>
      </div>
      <NarrowCaption opacity={ease(frame, within(t, 12, 0.48), 10)} bottom={150} size={72} color={B.paper}>
        a <span style={{ color: B.gauge }}>glass hair</span> on the sea floor
      </NarrowCaption>
    </RungShell>
  );
};

/** The closer's recap rows. Rung 6 shows a text glyph, not its title-bar photo (the cable ship is not a landing
 *  station); rung 7 likewise (its title-bar photo is a sea cucumber on the sea floor, not a cable). */
const RECAP = LEVELS_REVEALED.map((l) => (l.id === "l06" ? { ...l, image: null, glyph: "SHORE" } : l.id === "l07" ? { ...l, image: null, glyph: "CABLE" } : l));

/** Closer. Lines 0-2. The seven levels as a ladder going down, the gauge's dot walking down the berg as each is named:
 *  three websites, the myth line, four machines ("a room, a building, a beach, a cable"); line 1 says what each machine
 *  has; line 2 the last line and the end-screen card. */
export const Closer: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const websitesAt = within(t, 0, 0.06);
  const mythAt = within(t, 0, 0.19);
  const fourAt = within(t, 0, 0.37);
  const machineAt = [within(t, 0, 0.49), within(t, 0, 0.53), within(t, 0, 0.58), within(t, 0, 0.62)];
  const hiddenAt = lineAt(t, 1);
  const hasAt = [within(t, 1, 0.24), within(t, 1, 0.38), within(t, 1, 0.45), within(t, 1, 0.64)];
  const mendAt = within(t, 1, 0.93);
  const scaryAt = lineAt(t, 2);
  const betterAt = within(t, 2, 0.8);
  // rows: 0-2 above the myth line, 3-6 below it (x 120-900, y 200-754; captions start at y ≥ 778)
  const rowY = (i: number) => (i < 3 ? 200 + i * 76 : 460 + (i - 3) * 76);
  const lit = (i: number) => (i < 3 ? ease(frame, websitesAt + i * 4, 10) : ease(frame, machineAt[i - 3], 8));
  const spoken = ["a room", "a building", "a beach", "a cable"];
  const has = ["has a door", "has a badge reader", "is a beach", "a garden hose"];
  // the gauge's dot walks down the berg with the words
  const stops: [number, number, string, string][] = [
    [websitesAt, ICE_POS.l03, "WEBSITES", "three of seven"],
    [mythAt, ICE_POS.myth, "MYTH", "everything in between"],
    ...machineAt.map((a, i): [number, number, string, string] => [a, ICE_POS[["l04", "l05", "l06", "l07"][i]], spoken[i].toUpperCase(), "the machine"]),
    [hiddenAt, ICE_POS.l07, "SEA FLOOR", "where the internet crosses"],
  ];
  let pos = ICE_POS.l01 * ease(frame, 0, 20);
  let reading = "SEVEN LEVELS";
  let sub = "the whole iceberg";
  for (let i = 0; i < stops.length; i++) {
    const [at, p, r, s] = stops[i];
    if (frame >= at) {
      pos = lerp(i ? stops[i - 1][1] : ICE_POS.l01, p, ease(frame, at, 14));
      reading = r;
      sub = s;
    }
  }
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 40%, #12263A 0%, #0B1B2B 55%, #050E18 100%)" }} />
      <Iceberg pos={pos} reading={reading} sub={sub} x={1180} top={110} height={600} />
      <div style={{ position: "absolute", left: 120, top: 110, fontFamily: F.headline, fontSize: 64, lineHeight: 1.1, color: B.paper, letterSpacing: 2, opacity: ease(frame, 0, 12) }}>SEVEN LEVELS</div>
      {/* "Something better is.": the bottom row, the cable, lights up (drawn behind the rows) */}
      <div style={{ position: "absolute", left: 104, top: rowY(6) - 8, width: 560, height: 82, borderRadius: 14, background: B.gauge, opacity: ease(frame, betterAt, 10) * (0.3 + 0.12 * Math.sin(frame / 7)) }} />
      {RECAP.map((l, i) => {
        const on = ease(frame, i * 3, 8);
        const k = lit(i);
        const found = i >= 3 ? ease(frame, hasAt[i - 3], 8) : 0;
        const reading = i < 3 ? l.reading : found > 0.5 ? (i === 6 && frame >= mendAt ? "a hose a ship can mend" : has[i - 3]) : k > 0.5 ? spoken[i - 3] : l.reading;
        return (
          <div key={l.id} style={{ position: "absolute", left: 120 + 20 * (1 - on), top: rowY(i), display: "flex", alignItems: "center", gap: 22, opacity: on * (0.4 + 0.6 * k) }}>
            <div style={{ borderRadius: 8, outline: `4px solid rgba(255,200,61,${Math.max(i >= 3 ? k * (1 - found) : 0, found)})` }}>
              <Tile level={l} width={120} height={66} labelSize={0} />
            </div>
            <div style={{ fontFamily: F.ui, fontWeight: 800, textTransform: "uppercase", whiteSpace: "nowrap", letterSpacing: 1 }}>
              <div style={{ fontSize: 30, lineHeight: 1.1, color: B.paper }}>{l.name}</div>
              <div style={{ fontSize: 26, lineHeight: 1.2, color: i < 3 ? B.aqua : B.gauge }}>{reading}</div>
            </div>
          </div>
        );
      })}
      {/* "Three of them are websites" / "Everything drawn in between is a myth" */}
      <div style={{ position: "absolute", left: 600, top: 206, width: 6, height: 206, borderRadius: 3, background: B.aqua, opacity: ease(frame, websitesAt + 8, 10) * (1 - ease(frame, scaryAt - 10, 8)) }} />
      <Tag x={624} y={290} opacity={ease(frame, websitesAt + 8, 10) * (1 - ease(frame, scaryAt - 10, 8))} color={B.aqua} size={28}>websites</Tag>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, mythAt, 10) }}>
        <line x1={120} y1={440} x2={900 * ease(frame, mythAt, 20) + 120 * (1 - ease(frame, mythAt, 20))} y2={440} stroke={B.tease} strokeWidth={5} strokeDasharray="14 10" />
      </svg>
      <Tag x={690} y={410} opacity={ease(frame, mythAt + 8, 10)} color={B.tease} size={24}>the myth</Tag>
      <div style={{ position: "absolute", left: 680, top: 466, width: 6, height: 282, borderRadius: 3, background: B.gauge, opacity: ease(frame, fourAt, 10) * (1 - ease(frame, hasAt[0], 8)) }} />
      <Tag x={704} y={590} opacity={ease(frame, fourAt, 10) * (1 - ease(frame, hasAt[0], 8))} color={B.gauge} size={28}>the machine</Tag>
      <NarrowCaption opacity={ease(frame, hiddenAt, 10) * (1 - ease(frame, scaryAt, 8))} right={1540} bottom={150} size={72} color={B.paper}>
        none of it is <span style={{ color: B.gauge }}>hidden</span>
      </NarrowCaption>
      <NarrowCaption opacity={ease(frame, within(t, 2, 0.38), 10)} right={1540} bottom={150} size={68} color={B.paper}>
        the scary part at the bottom isn't there. <span style={{ color: B.gauge, opacity: ease(frame, betterAt, 8) }}>something better is.</span>
      </NarrowCaption>
      {/* End-screen card: right of the website rows (x 620-910, y 220-370), clear of the gauge labels (x ≥ 940); on from
          the START of the last line to the end (≈ 6.5 s, over YouTube's 5-s end-screen minimum). The lower right stays
          clear for YouTube's end-screen elements. */}
      <div style={{ position: "absolute", left: 620, top: 220, opacity: ease(frame, scaryAt, 12) }}>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: B.gauge }}>WATCH NEXT</div>
        <div style={{ fontFamily: F.headline, fontSize: 56, color: B.paper, lineHeight: 1.05, whiteSpace: "nowrap" }}>EVERY LEVEL</div>
        <div style={{ fontFamily: F.headline, fontSize: 56, color: B.paper, lineHeight: 1.05, whiteSpace: "nowrap" }}>OF THE OCEAN</div>
      </div>
      <CreditChip kind="illustration" />
    </AbsoluteFill>
  );
};
