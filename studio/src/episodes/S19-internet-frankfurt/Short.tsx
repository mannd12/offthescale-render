import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, currentLine, lin, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S19 - the World Cup record (episodes/S19-internet-frankfurt). A cliffhanger for L04 (Every Level of the Internet),
 * answered by Level 4 (the exchange, 4:17). Vertical 1080x1920, all drawn (no photo of the exchange exists in the
 * manifest). Headline zone x 120-900 / y 240-560 (the date, then the record counter, then the questions); diagram zone
 * y 600-1,110 (a football, then a drawn switch with network cables dropping into its ports, then two routes: a chain of
 * hops vs straight across). Chip y ~1,170-1,216, captions y 1,290-1,590 (shortKit). Nothing past x = 930, nothing in
 * the bottom 300 px.
 * Lines: 0 8 July 2026, a World Cup match, Frankfurt, a record · 1 19.6 Tbit/s through one exchange (counter) · 2 1,000+
 * networks plug into its switches, hand traffic across · 3 without it: a longer path, every hop adds delay · 4 what is
 * in an exchange? why does your data go there? · 5 end card.
 * Sources: L04 #6 (DE-CIX Frankfurt, 19.6 Tbit/s, 8 July 2026, a World Cup round-of-16 match), #17/#18 (switches, a
 * port per network, > 1,000 networks), #19 (without an IXP data often takes a longer path through other networks;
 * each hop adds delay). The exchange is spread over 30+ data centres (#17/#18): never called "a room" here.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const RECORD = 19.6; // Tbit/s (#6)
const SWITCH = { x: 120, y: 800, w: 780, h: 110 };
const PORTS = 12;
const portX = (i: number) => SWITCH.x + 50 + i * ((SWITCH.w - 100) / (PORTS - 1));
const NET_COLORS = ["#19C3E6", "#FFC83D", "#FF5A4F", "#9C66A8", "#7FBF6A", "#FFFFFF"];
// line 3: a chain of hops through other people's networks (coral) vs straight across the exchange (yellow)
const A = { x: 150, y: 1010 };
const Bp = { x: 870, y: 1010 };
const HOPS = [
  { x: 220, y: 700 },
  { x: 360, y: 820 },
  { x: 500, y: 660 },
  { x: 640, y: 800 },
  { x: 780, y: 680 },
];

const Football: React.FC<{ x: number; y: number; r: number; spin: number; opacity: number }> = ({ x, y, r, spin, opacity }) => (
  <g transform={`translate(${x} ${y}) rotate(${spin})`} opacity={opacity}>
    <circle r={r} fill="#F4F6F8" stroke="#0B1B2B" strokeWidth={4} />
    <polygon points={Array.from({ length: 5 }, (_, i) => `${0.36 * r * Math.cos(((i * 72 - 90) * Math.PI) / 180)},${0.36 * r * Math.sin(((i * 72 - 90) * Math.PI) / 180)}`).join(" ")} fill="#0B1B2B" />
    {Array.from({ length: 5 }, (_, i) => {
      const a = ((i * 72 - 90) * Math.PI) / 180;
      return <line key={i} x1={0.36 * r * Math.cos(a)} y1={0.36 * r * Math.sin(a)} x2={r * Math.cos(a)} y2={r * Math.sin(a)} stroke="#0B1B2B" strokeWidth={4} />;
    })}
  </g>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const cupAt = cue(t, 0, "A World Cup match");
  const frankAt = cue(t, 0, "Frankfurt");
  const recordAt = cue(t, 0, "breaks a record");
  const numAt = cue(t, 1, "Nineteen point six");
  const oneAt = cue(t, 1, "a single internet exchange");
  const netsAt = cue(t, 2, "More than a thousand networks");
  const plugAt = cue(t, 2, "plug into its switches");
  const handAt = cue(t, 2, "hand traffic straight across");
  const longerAt = cue(t, 3, "a longer path");
  const hopAt = cue(t, 3, "every hop adds delay");
  const whatAt = cue(t, 4, "what is actually in");
  const whyAt = cue(t, 4, "why does your data go there");
  const levelAt = cue(t, 5, "Level four");
  const end = ease(frame, levelAt, 12);

  // line 1: the counter runs 0 -> 19.6 while the number is said and lands on it
  const k = smooth(frame, numAt, numAt + 40);
  const shown = (RECORD * k).toFixed(1);
  const numOn = span(frame, numAt - 4, L(3));
  // line 2: cables drop into the ports one after another
  const cableK = (i: number) => smooth(frame, plugAt + i * 4, plugAt + i * 4 + 14);
  const switchOn = span(frame, netsAt - 6, L(3));
  // "hand traffic straight across": a pulse jumps between two ports, back and forth
  const handOn = span(frame, handAt, L(3));
  const handU = ((frame - handAt) % 30) / 30;
  // line 3: the long way draws hop by hop; the direct line comes after
  const routesOn = span(frame, L(3) - 4, whatAt);
  const longK = lin(frame, longerAt, hopAt + 10);
  const hopsLit = Math.floor(longK * (HOPS.length + 1));
  const directOn = ease(frame, hopAt, 12);
  const longPts = [A, ...HOPS, Bp];

  const chip = cur <= 1 ? "drawn · DE-CIX Frankfurt record, 8 July 2026" : cur === 2 ? "drawn · simplified: one port per network" : "drawn · simplified routes, not to scale";

  return (
    <AbsoluteFill style={{ backgroundColor: "#060B12" }}>
      {/* a faint traffic texture: thin lines streaming left to right, faster once the record is set */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: 0.22 * (1 - end) }}>
        {Array.from({ length: 16 }, (_, i) => {
          const y = 230 + i * 58;
          const speed = 4 + 10 * ease(frame, numAt, 30);
          const x = ((i * 137 + frame * speed) % 1300) - 200;
          return <line key={i} x1={x} y1={y} x2={x + 160} y2={y} stroke={i % 3 === 0 ? B.gauge : B.aqua} strokeWidth={3} strokeLinecap="round" />;
        })}
      </svg>

      {/* line 0: the date, the match, the place */}
      <Card x={120} y={250} big={["8 JULY 2026"]} size={120} opacity={span(frame, 0, numAt)} />
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0 }}>
        <Football x={290} y={820} r={110} spin={frame * 2} opacity={span(frame, cupAt, numAt)} />
      </svg>
      <Note x={450} y={760} rows={["a World Cup match"]} opacity={span(frame, cupAt, numAt)} color={B.gauge} />
      <Note x={450} y={830} rows={["Frankfurt"]} opacity={span(frame, frankAt, numAt)} />
      <div style={{ position: "absolute", left: 540, top: 440, padding: "4px 22px", border: `7px solid ${B.tease}`, borderRadius: 14, color: B.tease, fontFamily: F.headline, fontSize: 96, lineHeight: 1.05, letterSpacing: 3, whiteSpace: "nowrap", transform: `rotate(-7deg) scale(${lerp(1.4, 1, ease(frame, recordAt, 8))})`, opacity: span(frame, recordAt, numAt) }}>RECORD</div>

      {/* line 1-2: the record counter */}
      <div style={{ position: "absolute", left: 120, top: 230, opacity: numOn * (1 - end), display: "flex", alignItems: "baseline", gap: 18 }}>
        <div style={{ fontFamily: F.headline, fontSize: 260, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap", textShadow: "0 6px 30px rgba(0,0,0,0.8)" }}>{shown}</div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 56, color: B.paper, whiteSpace: "nowrap" }}>Tbit/s</div>
      </div>
      <Note x={120} y={540} rows={["one internet exchange · peak"]} opacity={span(frame, oneAt, L(3))} />
      {/* the bar fills with the counter (line 1 only; the switch takes the space on line 2) */}
      <div style={{ position: "absolute", left: SWITCH.x, top: 640, width: SWITCH.w, height: 26, borderRadius: 13, background: "rgba(255,255,255,0.12)", opacity: span(frame, numAt, netsAt) }}>
        <div style={{ width: `${100 * k}%`, height: "100%", borderRadius: 13, background: B.gauge }} />
      </div>

      {/* line 2: the switch, a port per network */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: switchOn * (1 - end) }}>
        {Array.from({ length: PORTS }, (_, i) => {
          const x = portX(i);
          const c = NET_COLORS[i % NET_COLORS.length];
          const top = 620 + (i % 2) * 40;
          const y = lerp(top, SWITCH.y + 30, cableK(i));
          return (
            <g key={i}>
              <circle cx={x} cy={top - 18} r={12} fill={c} opacity={cableK(i)} />
              <line x1={x} y1={top - 6} x2={x} y2={y} stroke={c} strokeWidth={6} opacity={cableK(i)} />
            </g>
          );
        })}
        <rect x={SWITCH.x} y={SWITCH.y} width={SWITCH.w} height={SWITCH.h} rx={14} fill="#1A2330" stroke="#8CA0B3" strokeWidth={3} />
        {Array.from({ length: PORTS }, (_, i) => (
          <rect key={i} x={portX(i) - 16} y={SWITCH.y + 22} width={32} height={26} rx={4} fill={cableK(i) > 0.95 ? "#7FBF6A" : "#0B1018"} />
        ))}
        <text x={SWITCH.x + 24} y={SWITCH.y + 92} fontFamily={F.ui} fontWeight={800} fontSize={24} letterSpacing={2} fill={B.mute}>SWITCH</text>
        {/* traffic handed straight across, port 2 <-> port 9 */}
        <path d={`M ${portX(2)} ${SWITCH.y + 60} Q ${(portX(2) + portX(9)) / 2} ${SWITCH.y + 140} ${portX(9)} ${SWITCH.y + 60}`} fill="none" stroke={B.gauge} strokeWidth={4} strokeDasharray="10 8" opacity={handOn} />
        <circle cx={lerp(portX(2), portX(9), handU)} cy={SWITCH.y + 60 + 80 * 4 * handU * (1 - handU) * 0.5} r={10} fill={B.gauge} opacity={handOn} />
      </svg>
      <Note x={120} y={960} rows={["1,000+ networks"]} opacity={span(frame, netsAt, L(3))} color={B.gauge} size={34} />
      <Note x={120} y={1030} rows={["handed straight across"]} opacity={handOn} size={24} />

      {/* line 3: the long way round vs straight across */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: routesOn * (1 - end) }}>
        {longPts.slice(0, -1).map((p, i) => {
          const q = longPts[i + 1];
          const segOn = Math.min(1, Math.max(0, longK * (HOPS.length + 1) - i));
          return <line key={i} x1={p.x} y1={p.y} x2={lerp(p.x, q.x, segOn)} y2={lerp(p.y, q.y, segOn)} stroke={B.tease} strokeWidth={6} strokeLinecap="round" />;
        })}
        {HOPS.map((h, i) => (
          <g key={i} opacity={i < hopsLit ? 1 : 0.25}>
            <circle cx={h.x} cy={h.y} r={26} fill="#2A1416" stroke={B.tease} strokeWidth={4} />
            <text x={h.x} y={h.y - 40} textAnchor="middle" fontFamily={F.ui} fontWeight={800} fontSize={22} fill={B.tease}>+ delay</text>
          </g>
        ))}
        <line x1={A.x} y1={A.y} x2={lerp(A.x, Bp.x, directOn)} y2={Bp.y} stroke={B.gauge} strokeWidth={8} strokeLinecap="round" />
        <rect x={470} y={A.y - 34} width={80} height={68} rx={12} fill="#1A2330" stroke={B.gauge} strokeWidth={4} opacity={directOn} />
        {[A, Bp].map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={30} fill={B.ink} stroke={B.paper} strokeWidth={4} />
            <text x={p.x} y={p.y + 9} textAnchor="middle" fontFamily={F.ui} fontWeight={800} fontSize={26} fill={B.paper}>{i === 0 ? "A" : "B"}</text>
          </g>
        ))}
      </svg>
      <Note x={120} y={260} rows={["without an exchange"]} opacity={span(frame, L(3), hopAt)} size={30} />
      <Note x={120} y={330} rows={["a longer path · other networks"]} opacity={span(frame, longerAt, hopAt)} color={B.tease} size={30} />
      <Card x={120} y={250} big={["EVERY HOP", "ADDS DELAY"]} size={110} bg={B.tease} ink={B.paper} opacity={span(frame, hopAt, whatAt)} />
      <Note x={470} y={1060} rows={["through an exchange"]} opacity={directOn * routesOn} color={B.gauge} size={24} />

      {/* line 4: the questions */}
      <Card x={120} y={260} big={["WHAT'S IN", "AN EXCHANGE?"]} size={120} opacity={span(frame, whatAt, levelAt)} />
      <Card x={120} y={600} big={["WHY DOES YOUR", "DATA GO THERE?"]} size={84} bg={B.paper} ink={B.ink} opacity={span(frame, whyAt, levelAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind="illustration" source={chip} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF THE INTERNET" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 4 · the exchange"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF THE INTERNET" line="level 4: the exchange" />
    </AbsoluteFill>
  );
};

export const ShortS19: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
