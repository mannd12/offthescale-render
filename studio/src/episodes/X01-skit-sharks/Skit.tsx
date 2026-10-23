import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt, within } from "../../lib/timeline";
import { ease } from "../../lib/ui";
import vo from "./vo.json";

loadBrandFonts();

/**
 * X01 - animated skit pilot (EXPERIMENT, owner 2026-10-23): two drawn characters act out one real situation and
 * the facts come out as dialogue. Mia thinks sharks broke the internet; Jo has the numbers. Every fact is an L04
 * claim (episodes/X01-skit-sharks/sources.md). Vertical 1080x1920. Shorts UI safe area: nothing past x 940 and
 * nothing below y 1,620. Layout: cutaway panel (the facts, drawn) y 150-760; the room with the two characters
 * y 760-1,330; caption band y 1,350-1,600.
 * Lines: 0 Mia: sharks · 1 Jo: somebody counted · 2 Mia: and? · 3 Jo: zero (2007-2014) · 4 Mia: who then? ·
 * 5 Jo: fishing gear + anchors, 70-80 % · 6 Mia: stays broken? · 7 Jo: ship, hook, deck, splice ·
 * 8 Mia: with a hook · 9 Jo: garden hose · 10 Mia: what's at the bottom? · 11 Jo: linked right here (end card).
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

type Who = "mia" | "jo";
const SPEAKER: Who[] = ["mia", "jo", "mia", "jo", "mia", "jo", "mia", "jo", "mia", "jo", "mia", "jo"];
const NAME: Record<Who, string> = { mia: "MIA", jo: "JO" };
const TONE: Record<Who, string> = { mia: "#FF8A7A", jo: B.aqua };

/** mood per line for each character: brows and mouth shape */
type Mood = "panic" | "calm" | "doubt" | "shock" | "smug" | "curious";
const MOOD: { mia: Mood; jo: Mood }[] = [
  { mia: "panic", jo: "calm" },
  { mia: "panic", jo: "smug" },
  { mia: "curious", jo: "smug" },
  { mia: "shock", jo: "calm" },
  { mia: "doubt", jo: "calm" },
  { mia: "shock", jo: "calm" },
  { mia: "doubt", jo: "calm" },
  { mia: "curious", jo: "calm" },
  { mia: "doubt", jo: "smug" },
  { mia: "shock", jo: "smug" },
  { mia: "curious", jo: "calm" },
  { mia: "curious", jo: "smug" },
];

const SKIN = "#F6D3B5";
const INK = "#1B2430";

/**
 * One character, drawn in the "two-line" cartoon style: round head, simple features, flat shirt. `talk` opens and
 * closes the mouth on a 5-frame beat while that character's line is playing; eyes blink every ~3.5 s.
 */
const Person: React.FC<{ who: Who; x: number; y: number; talking: boolean; mood: Mood; facing: 1 | -1; frame: number; scale?: number }> = ({ who, x, y, talking, mood, facing, frame, scale = 1 }) => {
  const blink = (frame + (who === "jo" ? 47 : 0)) % 105 < 4;
  const open = talking && Math.floor(frame / 5) % 2 === 0;
  const bob = talking ? Math.sin(frame / 4) * 4 : Math.sin(frame / 22) * 2;
  const shirt = who === "mia" ? "#F2B134" : "#3E7CB1";
  const hair = who === "mia" ? "#C2652F" : "#2B2B33";
  // brows: [left tilt, right tilt, lift] in degrees / px
  const brow = { panic: [-18, 18, -10], calm: [0, 0, 0], doubt: [12, -4, -2], shock: [0, 0, -16], smug: [-8, 8, 2], curious: [6, -6, -8] }[mood];
  const mouth = open
    ? mood === "shock" || mood === "panic"
      ? <ellipse cx={0} cy={58} rx={16} ry={20} fill={INK} />
      : <ellipse cx={0} cy={58} rx={18} ry={11} fill={INK} />
    : mood === "smug"
      ? <path d="M -18 56 Q 4 66 22 50" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      : mood === "panic" || mood === "shock"
        ? <ellipse cx={0} cy={58} rx={9} ry={11} fill={INK} />
        : mood === "doubt"
          ? <path d="M -16 60 L 16 56" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          : <path d="M -16 54 Q 0 66 16 54" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${facing * scale} ${scale})`}>
      {/* legs and shoes */}
      <path d="M -26 250 L -32 380 M 26 250 L 32 380" stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <path d="M -50 384 L -24 384 M 24 384 L 50 384" stroke={INK} strokeWidth={14} strokeLinecap="round" />
      {/* shirt */}
      <path d="M -70 250 Q -78 140 -40 118 L 40 118 Q 78 140 70 250 Z" fill={shirt} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {/* arms: Jo gestures while explaining, Mia's hands go up in a panic */}
      {who === "jo" && talking ? (
        <path d={`M 56 140 Q 110 ${170 + 14 * Math.sin(frame / 6)} 120 ${110 + 18 * Math.sin(frame / 6)}`} stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
      ) : (
        <path d="M 58 140 Q 84 200 76 250" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
      )}
      {who === "mia" && mood === "panic" ? (
        <path d={`M -56 140 Q -110 110 -98 ${40 + 6 * Math.sin(frame / 3)}`} stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
      ) : (
        <path d="M -58 140 Q -84 200 -76 250" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
      )}
      {/* neck and head */}
      <rect x={-14} y={96} width={28} height={30} fill={SKIN} stroke={INK} strokeWidth={4} />
      <circle cx={0} cy={20} r={84} fill={SKIN} stroke={INK} strokeWidth={5} />
      {/* hair: Mia a long bob, Jo short and spiky */}
      {who === "mia" ? (
        <path d="M -88 70 Q -104 -60 -20 -66 Q 70 -78 92 -10 Q 100 40 86 78 Q 72 10 40 -24 Q -10 -6 -54 -16 Q -78 20 -70 82 Z" fill={hair} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      ) : (
        <path d="M -84 -4 L -70 -60 L -40 -46 L -22 -82 L 4 -54 L 30 -84 L 44 -50 L 76 -64 L 84 -6 Q 40 -40 -84 -4 Z" fill={hair} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      )}
      {/* eyes */}
      {[-30, 30].map((ex, i) => (
        <g key={ex}>
          {blink ? (
            <path d={`M ${ex - 14} 14 L ${ex + 14} 14`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          ) : (
            <>
              <ellipse cx={ex} cy={14} rx={16} ry={mood === "shock" ? 22 : 18} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
              <circle cx={ex + 5} cy={mood === "doubt" ? 18 : 14} r={7} fill={INK} />
            </>
          )}
          <path d={`M ${ex - 18} ${-14 + brow[2]} L ${ex + 18} ${-14 + brow[2]}`} stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${i === 0 ? brow[0] : brow[1]} ${ex} ${-14 + brow[2]})`} />
        </g>
      ))}
      {mouth}
      {/* panic sweat drop */}
      {mood === "panic" ? <path d={`M 78 ${-20 + (frame % 30)} q 8 14 0 20 q -8 -6 0 -20 Z`} fill="#8FD3F4" stroke={INK} strokeWidth={3} /> : null}
    </g>
  );
};

/** The fact panel: a framed drawing above the room, a different picture for each line. */
const Panel: React.FC<{ line: number; t: SceneTiming; frame: number }> = ({ line, t, frame }) => {
  const at = lineAt(t, line);
  const k = ease(frame, at, 10);
  const big = (txt: string, small: string, color = B.gauge) => (
    <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center" }}>
      <div style={{ fontFamily: F.headline, fontSize: 210, lineHeight: 1, color, transform: `scale(${0.85 + 0.15 * k})` }}>{txt}</div>
      <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: B.paper, marginTop: 14 }}>{small}</div>
    </div>
  );
  // ocean cross-section shared by the cable pictures: water, sea floor, a cable along it
  const sea = (children: React.ReactNode, cableBroken = false) => (
    <svg width={860} height={560} viewBox="0 0 860 560" style={{ position: "absolute", left: 0, top: 0 }}>
      <rect x={0} y={0} width={860} height={560} fill="#0E3A5C" />
      <rect x={0} y={0} width={860} height={70} fill="#9ED8F0" />
      <path d="M 0 470 Q 200 440 430 462 T 860 452 L 860 560 L 0 560 Z" fill="#5A4A36" />
      {cableBroken ? (
        <>
          <path d="M 0 462 L 400 458" stroke={B.gauge} strokeWidth={12} strokeLinecap="round" />
          <path d="M 460 456 L 860 452" stroke={B.gauge} strokeWidth={12} strokeLinecap="round" />
          <path d={`M 412 452 l 14 -18 l 6 14 l 14 -20`} stroke="#FFF2A8" strokeWidth={5} fill="none" opacity={frame % 10 < 5 ? 1 : 0.3} />
        </>
      ) : (
        <path d="M 0 462 Q 430 452 860 452" stroke={B.gauge} strokeWidth={12} strokeLinecap="round" />
      )}
      {children}
    </svg>
  );
  const shark = (x: number, y: number, crossed: boolean) => (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -120 0 Q -40 -50 70 -10 L 120 -40 L 106 0 L 120 40 L 70 10 Q -40 50 -120 0 Z" fill="#8FA3B5" stroke={INK} strokeWidth={4} />
      <path d="M -10 -30 L 10 -78 L 30 -26 Z" fill="#8FA3B5" stroke={INK} strokeWidth={4} />
      <circle cx={-80} cy={-8} r={6} fill={INK} />
      <path d="M -112 10 L -70 14" stroke={INK} strokeWidth={4} />
      {crossed ? <path d="M -140 -80 L 140 80 M -140 80 L 140 -80" stroke={B.tease} strokeWidth={16} strokeLinecap="round" opacity={ease(frame, at + 12, 8)} /> : null}
    </g>
  );
  let body: React.ReactNode = null;
  if (line === 0) {
    // Mia's theory, drawn as her imagination: a shark chewing the cable (labelled as her idea)
    body = (
      <>
        {sea(shark(400 + 8 * Math.sin(frame / 5), 420, false))}
        <div style={{ position: "absolute", left: 24, top: 90, padding: "6px 16px", borderRadius: 12, background: "rgba(5,14,24,0.85)", fontFamily: F.ui, fontWeight: 800, fontSize: 28, letterSpacing: 1.5, color: "#FF8A7A" }}>MIA'S THEORY</div>
      </>
    );
  } else if (line === 1 || line === 2) {
    // "Somebody actually counted": a tally sheet filling up
    const ticks = Math.min(24, Math.floor((frame - lineAt(t, 1)) / 3));
    body = (
      <svg width={860} height={560} viewBox="0 0 860 560">
        <rect x={250} y={60} width={360} height={440} rx={18} fill="#FFFDF4" stroke={INK} strokeWidth={6} />
        <rect x={360} y={40} width={140} height={44} rx={10} fill="#B9C4CF" stroke={INK} strokeWidth={5} />
        <text x={430} y={150} textAnchor="middle" fontFamily={F.ui} fontWeight={800} fontSize={30} fill={INK} letterSpacing={2}>CABLE FAULTS</text>
        {Array.from({ length: ticks }, (_, i) => {
          const g = Math.floor(i / 5);
          const j = i % 5;
          const gx = 300 + (g % 3) * 95;
          const gy = 210 + Math.floor(g / 3) * 120;
          return j < 4 ? <line key={i} x1={gx + j * 16} y1={gy} x2={gx + j * 16} y2={gy + 70} stroke={INK} strokeWidth={6} strokeLinecap="round" /> : <line key={i} x1={gx - 10} y1={gy + 60} x2={gx + 62} y2={gy + 10} stroke={INK} strokeWidth={6} strokeLinecap="round" />;
        })}
      </svg>
    );
  } else if (line === 3 || line === 4) {
    // "zero cable faults", 2007-2014 (#22); the shark is crossed out
    body = (
      <>
        {big("0", "FAULTS FROM FISH BITES · 2007–2014")}
        <div style={{ position: "absolute", left: 0, right: 0, top: 396, display: "flex", justifyContent: "center" }}>
          <svg width={320} height={170} viewBox="-160 -90 320 180">{shark(0, 0, true)}</svg>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 2, color: B.mute }}>SHARKS INCLUDED</div>
      </>
    );
  } else if (line === 5 || line === 6) {
    // fishing gear and anchors, 70-80 % (#23): a trawl net and an anchor dragged across the cable, which breaks on line 6
    const drag = (frame - lineAt(t, 5)) * 3;
    body = (
      <>
        {sea(
          <>
            <path d={`M ${120 + drag * 0.5} 70 L ${300 + drag * 0.5} 440`} stroke="#C9D3DC" strokeWidth={3} />
            <path d={`M ${270 + drag * 0.5} 420 l 60 0 l -10 40 l -40 0 Z`} fill="none" stroke="#C9D3DC" strokeWidth={4} />
            <path d={`M ${560 - drag * 0.3} 70 L ${600 - drag * 0.3} 430`} stroke="#C9D3DC" strokeWidth={4} />
            <g transform={`translate(${600 - drag * 0.3} 440)`}>
              <path d="M 0 -30 L 0 20 M -26 4 Q 0 34 26 4 M -14 -18 L 14 -18" stroke="#E6EDF3" strokeWidth={7} fill="none" strokeLinecap="round" />
            </g>
          </>,
          line === 6,
        )}
        <div style={{ position: "absolute", left: 24, top: 90, padding: "6px 18px 10px", borderRadius: 14, background: B.gauge, fontFamily: F.headline, fontSize: 80, color: B.ink, lineHeight: 1 }}>
          70–80 %
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 22, letterSpacing: 1.5 }}>FISHING GEAR · SHIPS' ANCHORS</div>
        </div>
      </>
    );
  } else if (line === 7 || line === 8) {
    // the repair (#24): a ship, a hook down to the cable, the cable hauled up in a V to the deck, a new piece spliced in
    const r = lineAt(t, 7);
    const hook = ease(frame, r + 20, 30);
    const haul = ease(frame, within(t, 7, 0.45), 40);
    const apex = 452 - 372 * haul;
    const splice = ease(frame, within(t, 7, 0.78), 10);
    body = (
      <>
        <svg width={860} height={560} viewBox="0 0 860 560" style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={0} y={0} width={860} height={560} fill="#0E3A5C" />
          <rect x={0} y={0} width={860} height={70} fill="#9ED8F0" />
          <path d="M 0 470 Q 200 440 430 462 T 860 452 L 860 560 L 0 560 Z" fill="#5A4A36" />
          <path d="M 320 70 L 340 100 L 520 100 L 540 70 Z" fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <rect x={390} y={34} width={70} height={36} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <line x1={430} y1={100} x2={430} y2={Math.min(100 + 352 * hook, apex)} stroke="#E6EDF3" strokeWidth={4} />
          <path d={`M 0 462 L 430 ${apex} L 860 452`} stroke={B.gauge} strokeWidth={12} fill="none" strokeLinejoin="round" />
          <path d={`M 380 ${apex + (462 - apex) * 0.12} L 430 ${apex} L 480 ${apex + (452 - apex) * 0.12}`} stroke="#FFFFFF" strokeWidth={14} fill="none" opacity={splice} strokeLinejoin="round" />
        </svg>
        <div style={{ position: "absolute", left: 24, top: 96, display: "flex", flexDirection: "column", gap: 6 }}>
          {["1 · SAIL OUT", "2 · HOOK IT", "3 · HAUL IT UP", "4 · SPLICE IN A NEW PIECE"].map((s, i) => (
            <div key={s} style={{ padding: "4px 12px", borderRadius: 10, background: "rgba(5,14,24,0.85)", fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: 1, color: i === 3 ? B.gauge : B.paper, opacity: ease(frame, within(t, 7, [0.1, 0.3, 0.45, 0.78][i]), 8), width: "fit-content" }}>{s}</div>
          ))}
        </div>
      </>
    );
  } else if (line === 9) {
    // "about as thick as a garden hose" (#10)
    body = (
      <svg width={860} height={560} viewBox="0 0 860 560">
        <text x={430} y={110} textAnchor="middle" fontFamily={F.headline} fontSize={64} fill={B.paper}>≈ A GARDEN HOSE</text>
        <path d={`M 80 300 Q 300 ${250 + 20 * Math.sin(frame / 8)} 520 300 T 800 300`} stroke="#3FAE5A" strokeWidth={46} fill="none" strokeLinecap="round" />
        <path d="M 80 420 L 800 420" stroke={B.gauge} strokeWidth={46} strokeLinecap="round" />
        <text x={80} y={368} fontFamily={F.ui} fontWeight={800} fontSize={26} fill={B.mute} letterSpacing={2}>A GARDEN HOSE</text>
        <text x={80} y={488} fontFamily={F.ui} fontWeight={800} fontSize={26} fill={B.gauge} letterSpacing={2}>THE CABLE, IN DEEP WATER</text>
      </svg>
    );
  } else {
    // lines 10-11: the question, then the pointer to the long video
    body = line === 10 ? (
      <svg width={860} height={560} viewBox="0 0 860 560">
        <path d="M 360 60 L 500 60 L 600 220 L 560 440 L 430 540 L 300 440 L 260 220 Z" fill="#0B3A5E" stroke="#FFFFFF" strokeWidth={5} />
        <path d="M 360 60 L 500 60 L 540 124 L 320 124 Z" fill="#FFFFFF" />
        <text x={430} y={380} textAnchor="middle" fontFamily={F.headline} fontSize={140} fill={B.tease} opacity={0.6 + 0.4 * Math.sin(frame / 6)}>?</text>
      </svg>
    ) : (
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center" }}>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: B.gauge }}>WATCH NEXT</div>
        <div style={{ fontFamily: F.headline, fontSize: 96, lineHeight: 1.02, color: B.paper, marginTop: 10 }}>EVERY LEVEL<br />OF THE INTERNET</div>
        <div style={{ fontFamily: F.headline, fontSize: 120, color: B.gauge, marginTop: 18, transform: `translateY(${8 * Math.sin(frame / 6)}px)` }}>↓</div>
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", left: 70, top: 160, width: 860, height: 560, borderRadius: 28, overflow: "hidden", background: "#12263A", border: `6px solid ${INK}`, boxShadow: "0 12px 40px rgba(0,0,0,0.45)", opacity: ease(frame, 0, 8) }}>
      {body}
    </div>
  );
};

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  let cur = 0;
  for (let i = 0; i < t.lines.length; i++) if (frame >= lineAt(t, i)) cur = i;
  const l = t.lines[cur];
  const speaking = frame >= l.at && frame < l.at + l.audioFrames;
  const who = SPEAKER[cur];
  const mood = MOOD[cur];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#2B4058 0%, #2B4058 40%, #E8DCC8 40%, #E8DCC8 70%, #C9A97E 70%)" }}>
      {/* the room: wall, window, shelf with the router (its light red while "the internet's down"), sofa */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={760} width={1080} height={590} fill="#E8DCC8" />
        <rect x={0} y={1250} width={1080} height={100} fill="#C9A97E" />
        {/* window between the two, above the sofa */}
        <rect x={450} y={800} width={180} height={140} fill="#A9D6F0" stroke={INK} strokeWidth={6} />
        <line x1={540} y1={800} x2={540} y2={940} stroke={INK} strokeWidth={5} />
        {/* sofa, and the router on its arm: red light while "the internet's down" */}
        <path d="M 400 1170 Q 400 1100 450 1100 L 630 1100 Q 680 1100 680 1170 L 680 1250 L 400 1250 Z" fill="#7FA48C" stroke={INK} strokeWidth={5} />
        <rect x={410} y={1066} width={100} height={30} rx={6} fill="#3A3F48" stroke={INK} strokeWidth={4} />
        <circle cx={492} cy={1081} r={7} fill={frame % 20 < 10 ? B.tease : "#7A2A26"} />
        <path d="M 430 1066 L 420 1036 M 462 1066 L 470 1036" stroke={INK} strokeWidth={4} />
        <Person who="mia" x={215} y={905} scale={1.2} talking={speaking && who === "mia"} mood={mood.mia} facing={1} frame={frame} />
        <Person who="jo" x={865} y={905} scale={1.2} talking={speaking && who === "jo"} mood={mood.jo} facing={-1} frame={frame} />
      </svg>
      <Panel line={cur} t={t} frame={frame} />
      {/* caption band: x 70-930, y 1,370-1,600; the whole line at once (muted viewers read ahead), the speaker on a pill */}
      <div style={{ position: "absolute", left: 70, width: 860, top: 1370, height: 230, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center", opacity: ease(frame, l.at - 2, 4) }}>
        <div style={{ padding: "4px 18px", borderRadius: 999, background: TONE[who], fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: B.ink }}>{NAME[who]}</div>
        <div style={{ fontFamily: F.caption, fontWeight: 600, fontSize: l.text.length > 90 ? 52 : 60, lineHeight: 1.12, textWrap: "balance", color: B.paper, textShadow: "0 3px 0 #0B1B2B, 0 0 18px rgba(0,0,0,0.9)" }}>{l.text}</div>
      </div>
      <CreditChip kind="illustration" source="drawn · facts: ICPC, TeleGeography" left={70} bottom={1920 - 150} />
    </AbsoluteFill>
  );
};

export const SkitX01: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: B.ink }}>
    {timeline.scenes.map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={s.id}>
        <Body t={s} />
      </Sequence>
    ))}
    {timeline.scenes.flatMap((s) =>
      s.lines
        .filter((l) => !l.estimated)
        .map((l) => (
          <Sequence key={l.file} from={l.from} durationInFrames={l.audioFrames + 3} name={`vo ${s.id} ${l.index}`}>
            <Audio src={staticFile(l.file)} />
          </Sequence>
        )),
    )}
  </AbsoluteFill>
);
