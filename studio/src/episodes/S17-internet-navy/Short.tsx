import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt, within } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, currentLine, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S17 - the Navy's onion (episodes/S17-internet-navy). A cliffhanger for L04 (Every Level of the Internet), answered by
 * Level 3 (the dark web, 2:25). Vertical 1080x1920, all drawn (no plate): a cross-section onion (x 100-560, y 330-790)
 * with the year cards in a right column (x 600-930); on line 2 a relay route along y 980 (YOU -> 3 relays -> SITE) whose
 * packet loses one layer at each relay while the big onion peels with it. Chip y ~1,170-1,216, captions y 1,290-1,590
 * (shortKit). Nothing past x = 930, nothing in the bottom 300 px. No iceberg (S02 owns that picture).
 * Lines: 0 a U.S. Navy lab · 1 1995, three researchers, onion routing · 2 layers, at least three computers, nobody can
 * tell who is talking to whom · 3 2002, free network, Tor = The Onion Routing · 4 why a navy? who uses it? · 5 end card.
 * Sources: L04 #3 (NRL 1995, Goldschlag/Reed/Syverson, Tor = The Onion Routing, live Oct 2002 under a free licence),
 * #16 (at least three servers). Nothing about how to reach the dark web (factual, non-instructional).
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const ONION = { x: 330, y: 560 };
const RINGS = [230, 175, 120]; // the three layers, outer -> inner; the core (r 66) is "your data"
const ROUTE_Y = 980;
const NODES = [
  { x: 100, label: "YOU" },
  { x: 300, label: "1" },
  { x: 500, label: "2" },
  { x: 700, label: "3" },
  { x: 870, label: "SITE" },
];
const RING_FILL = ["#5B3A6E", "#7A4D8C", "#9C66A8"];

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const navyAt = cue(t, 0, "U.S. Navy lab");
  const ideaAt = cue(t, 0, "the idea");
  const yearAt = cue(t, 1, "Nineteen ninety-five");
  const threeAt = cue(t, 1, "Three researchers");
  const onionAt = cue(t, 1, "onion routing");
  const layersAt = cue(t, 2, "wrapped in layers");
  const passAt = cue(t, 2, "passed through");
  const watchAt = cue(t, 2, "nobody watching");
  const y02At = cue(t, 3, "In 2002");
  const freeAt = cue(t, 3, "free network");
  const torAt = cue(t, 3, "named Tor");
  const whyAt = cue(t, 4, "why would a navy");
  const whoAt = cue(t, 4, "who actually uses it");
  const answersAt = cue(t, 5, "Both answers");
  const end = ease(frame, answersAt, 12);

  // the onion draws in from frame 0 (a visible subject from the first frame), grows a little on "the idea"
  const draw = smooth(frame, 0, 24);
  const grow = 0.92 + 0.08 * ease(frame, ideaAt, 14);
  // the packet runs YOU -> SITE between "passed through" and "nobody watching"; it loses one layer at each relay
  const u = smooth(frame, passAt, watchAt); // 0..1 along the route
  const px = lerp(NODES[0].x, NODES[4].x, u);
  // ring i (outer first) peels as the packet passes relay i+1, over ~40 px of travel
  const peelOf = (i: number) => (frame >= y02At ? 0 : Math.min(1, Math.max(0, (px - NODES[i + 1].x) / 40)));
  const routeOn = span(frame, layersAt - 6, whyAt);
  const layersPulse = span(frame, layersAt, passAt) * (0.5 + 0.5 * Math.sin((frame - layersAt) / 3));
  const onionDim = 1 - 0.75 * ease(frame, whyAt, 12);

  const chip =
    cur <= 1
      ? "drawn · onion routing, U.S. Naval Research Lab, 1995"
      : cur === 2
        ? "drawn · simplified route: at least 3 relays"
        : "drawn · Tor, live October 2002";

  return (
    <AbsoluteFill style={{ backgroundColor: "#07060E" }}>
      {/* a faint grid of "network" dots behind everything */}
      <svg width={1080} height={1200} style={{ position: "absolute", left: 0, top: 0, opacity: 0.18 * (1 - end) }}>
        {Array.from({ length: 9 * 11 }, (_, i) => {
          const gx = 60 + (i % 9) * 105;
          const gy = 240 + Math.floor(i / 9) * 88;
          return <circle key={i} cx={gx} cy={gy} r={3} fill={B.mute} />;
        })}
      </svg>

      {/* the onion, in cross-section: three layers around the core */}
      <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, opacity: (1 - end) * onionDim }}>
        <g transform={`translate(${ONION.x} ${ONION.y}) scale(${draw * grow})`}>
          {/* the sprout on top */}
          <path d="M 0 -228 C -10 -280 -30 -300 -44 -318 M 0 -228 C 8 -282 24 -300 40 -322" stroke="#7FBF6A" strokeWidth={9} fill="none" strokeLinecap="round" />
          {RINGS.map((r, i) => (
            <circle key={r} r={r} fill={RING_FILL[i]} stroke="#E9D3F0" strokeWidth={3 + 4 * layersPulse} opacity={1 - 0.85 * peelOf(i)} transform={`scale(${1 + 0.08 * peelOf(i)})`} />
          ))}
          <circle r={66} fill={B.gauge} />
          <text y={-6} textAnchor="middle" fontFamily={F.ui} fontWeight={800} fontSize={22} fill={B.ink} letterSpacing={1}>YOUR</text>
          <text y={22} textAnchor="middle" fontFamily={F.ui} fontWeight={800} fontSize={22} fill={B.ink} letterSpacing={1}>DATA</text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: ONION.x, top: 812, transform: "translateX(-50%)", fontFamily: F.headline, fontSize: 56, lineHeight: 1, color: "#E9D3F0", whiteSpace: "nowrap", opacity: span(frame, onionAt, layersAt + 20) }}>ONION ROUTING</div>

      {/* right column: who, when */}
      <Note x={600} y={380} rows={["U.S. Navy lab"]} opacity={span(frame, navyAt, yearAt)} color={B.gauge} size={28} />
      <Card x={600} y={400} big={["1995"]} size={120} opacity={span(frame, yearAt, L(2))} />
      <Note x={600} y={580} rows={["U.S. Naval", "Research Lab"]} opacity={span(frame, yearAt + 8, L(2))} />
      <Note x={600} y={680} rows={["3 researchers"]} opacity={span(frame, threeAt, L(2))} color={B.gauge} />

      {/* line 2: the route - the packet loses a layer at each relay */}
      <svg width={1080} height={1160} style={{ position: "absolute", left: 0, top: 0, opacity: routeOn * (1 - end) }}>
        <line x1={NODES[0].x} y1={ROUTE_Y} x2={NODES[4].x} y2={ROUTE_Y} stroke="rgba(233,211,240,0.35)" strokeWidth={4} strokeDasharray="10 10" />
        {NODES.map((n, i) => {
          const isEnd = i === 0 || i === 4;
          const lit = !isEnd && px >= n.x;
          return (
            <g key={n.label}>
              <rect x={n.x - 30} y={ROUTE_Y - 30} width={60} height={60} rx={isEnd ? 30 : 10} fill={isEnd ? B.ink : lit ? "#9C66A8" : "#1A1530"} stroke={isEnd ? B.gauge : "#E9D3F0"} strokeWidth={3} />
              <text x={n.x} y={ROUTE_Y + 66} textAnchor="middle" fontFamily={F.ui} fontWeight={800} fontSize={24} fill={isEnd ? B.gauge : B.paper} letterSpacing={1}>{n.label}</text>
            </g>
          );
        })}
        {/* the packet, riding the route: core + the layers it still wears (one comes off at each relay) */}
        <g transform={`translate(${px} ${ROUTE_Y})`} opacity={ease(frame, passAt - 6, 8)}>
          {RINGS.map((_, i) => <circle key={i} r={32 - i * 7} fill={RING_FILL[i]} stroke="#E9D3F0" strokeWidth={2} opacity={1 - peelOf(i)} />)}
          <circle r={10} fill={B.gauge} />
        </g>
        {/* the watcher: sees traffic, cannot tell who is talking to whom */}
        <g transform="translate(140 1100)" opacity={ease(frame, watchAt, 10)}>
          <path d="M -44 0 Q 0 -34 44 0 Q 0 34 -44 0 Z" fill="none" stroke={B.paper} strokeWidth={4} />
          <circle r={12} fill={B.paper} />
        </g>
      </svg>
      <Note x={100} y={866} rows={["at least 3 other computers"]} opacity={span(frame, passAt, whyAt) * (1 - end)} color={B.gauge} />
      <Note x={210} y={1078} rows={["who's talking to whom? can't tell"]} opacity={span(frame, watchAt, whyAt) * (1 - end)} size={24} />

      {/* line 3: 2002, the name */}
      <Card x={600} y={400} big={["2002"]} small={["went live"]} size={120} opacity={span(frame, y02At, torAt)} />
      <Note x={600} y={620} rows={["free network"]} opacity={span(frame, freeAt, whyAt)} color={B.gauge} />
      <Card x={600} y={400} big={["TOR"]} size={150} opacity={span(frame, torAt, whyAt)} />
      <div style={{ position: "absolute", left: 600, top: 700, fontFamily: F.ui, fontWeight: 800, fontSize: 34, lineHeight: 1.25, letterSpacing: 1, color: B.paper, whiteSpace: "nowrap", opacity: span(frame, torAt + 6, whyAt) }}>
        {["The", "Onion", "Routing"].map((w) => (
          <div key={w}>
            <span style={{ color: B.gauge }}>{w[0]}</span>
            {w.slice(1)}
          </div>
        ))}
      </div>

      {/* line 4: the two questions, over the dimmed onion */}
      <Card x={120} y={380} big={["WHY A NAVY?"]} size={110} opacity={span(frame, whyAt, answersAt)} />
      <Card x={120} y={590} big={["WHO USES IT?"]} size={110} bg={B.tease} ink={B.paper} opacity={span(frame, whoAt, answersAt)} />
      <Note x={120} y={790} rows={["answered in level 3"]} opacity={span(frame, within(t, 4, 0.9), answersAt)} color={B.gauge} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind="illustration" source={chip} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF THE INTERNET" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 3 · the dark web"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF THE INTERNET" line="level 3: the dark web" />
    </AbsoluteFill>
  );
};

export const ShortS17: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
