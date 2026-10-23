import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { SERIES } from "../L02-deep-sea-types/ladder";
import { Captions, Card, EndCard, Note, PlateFade, SeriesPill, ShortFrame, TypeRail, cue, currentLine, lin, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S11 - the worm that eats bone (episodes/S11-deep-boneeater). Video 2's fifth Short: the "???" tile opens as
 * TYPE 8 · THE BONE-EATER. Vertical 1080x1920; rail left, content x 160-930, chip y ~1,170-1,216, captions
 * y 1,290-1,590 (shortKit).
 * Lines: 0 real worms on bone (aquarium) · 1 whale skeleton, flesh: months -> skeleton · 2 roots into the bone (drawn) ·
 * 3 bacteria in the roots break down the fats (drawn) · 4 first found: Monterey Bay, 2,891 m · 5 32 species, five kinds
 * of bone · 6 these are females - and the males? · 7 end card.
 * Honesty (L02 #22): whale-fall is a skeleton in Monterey Bay NMS photographed in Oct 2019 - not the 2004 discovery
 * fall, no depth: it says so on the picture and the 2,891 m card sits on ink below it, never on it. It is CC BY 2.0:
 * the chip credits OET/NOAA. osedax-aquarium is Osedax japonicus in a tank at Enoshima Aquarium (2023, CC0) - tagged
 * "in an aquarium". Roots, bacteria and fat are drawn (chip ILLUSTRATION). The dwarf males (the answer) are not shown.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const WORM_BOX = { x: 160, y: 250, w: 760, h: 483 }; // L02 shows this photo 740 x 470, pushing in at 50 % 58 %
const BONE_TOP = 640;
const WORMS = [380, 540, 700];

/** one drawn Osedax female: a trunk standing out of the bone and a feathery red crown; `roots` 0..1 grows her roots */
const Worm: React.FC<{ x: number; frame: number; roots: number; i: number }> = ({ x, frame, roots, i }) => {
  const sway = 10 * Math.sin(frame / 14 + i * 1.7);
  const topX = x + sway;
  const topY = BONE_TOP - 150 - 10 * i;
  const branch = (d: string, k: number) => <path key={k} d={d} pathLength={1} fill="none" stroke="#8BD18F" strokeWidth={k === 0 ? 9 : 6} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - lin(roots, k * 0.12, k * 0.12 + 0.55)} />;
  return (
    <g>
      {[
        `M ${x} ${BONE_TOP} L ${x} ${BONE_TOP + 150}`,
        `M ${x} ${BONE_TOP + 40} Q ${x - 30} ${BONE_TOP + 70} ${x - 62} ${BONE_TOP + 118}`,
        `M ${x} ${BONE_TOP + 70} Q ${x + 34} ${BONE_TOP + 100} ${x + 56} ${BONE_TOP + 160}`,
        `M ${x - 62} ${BONE_TOP + 118} Q ${x - 70} ${BONE_TOP + 150} ${x - 88} ${BONE_TOP + 190}`,
        `M ${x + 56} ${BONE_TOP + 160} Q ${x + 70} ${BONE_TOP + 190} ${x + 64} ${BONE_TOP + 230}`,
      ].map(branch)}
      <path d={`M ${x} ${BONE_TOP} Q ${x + sway * 0.3} ${BONE_TOP - 80} ${topX} ${topY}`} fill="none" stroke="#E9B7A8" strokeWidth={16} strokeLinecap="round" />
      {Array.from({ length: 7 }, (_, k) => {
        const a = ((k - 3) * 16 + sway * 0.6) * (Math.PI / 180);
        return <line key={k} x1={topX} y1={topY} x2={topX + Math.sin(a) * 62} y2={topY - Math.cos(a) * 62} stroke="#E8322B" strokeWidth={7} strokeLinecap="round" />;
      })}
    </g>
  );
};

const BONE_ICONS = ["whales", "fish", "birds", "turtles", "land mammals"];

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const chewAt = cue(t, 0, "no way to chew");
  const fleshAt = cue(t, 1, "scavengers strip the flesh");
  const skelAt = cue(t, 1, "Then the skeleton");
  const osedaxAt = cue(t, 2, "Osedax");
  const femaleAt = cue(t, 2, "The female");
  const rootsAt = cue(t, 2, "branching roots");
  const bactAt = cue(t, 3, "live bacteria");
  const fatsAt = cue(t, 3, "break down the fats");
  const feedAt = cue(t, 3, "and feed the worm");
  const kmAt = cue(t, 4, "almost three kilometres");
  const bayAt = cue(t, 4, "in Monterey Bay");
  const speciesAt = cue(t, 5, "thirty-two species");
  const iconAt = BONE_ICONS.map((w) => cue(t, 5, w === "whales" ? "whales" : w === "land mammals" ? "land mammals" : `${w},`));
  const femAt = cue(t, 6, "all about the female");
  const malesAt = cue(t, 6, "The males");
  const endAt = L(7);
  const end = ease(frame, endAt, 12);

  // the aquarium worms (lines 0 and 6)
  const worms0 = 1 - ease(frame, L(1), 10);
  const worms6 = span(frame, L(6), endAt);
  const wormsOn = worms0 + worms6;
  const wormZoom = cur === 0 ? 1 + 0.12 * lin(frame, 0, L(1)) + 0.12 * smooth(frame, chewAt, chewAt + 24) : 1.05 + 0.08 * lin(frame, L(6), endAt);
  // the whale skeleton (line 1 full, line 4 as the top band)
  const whale1 = span(frame, L(1), L(2));
  const whale4 = span(frame, L(4), L(5));
  // the diagram (lines 2-3)
  const diag = span(frame, L(2), L(4));
  const roots = lin(frame, rootsAt, rootsAt + 50) + (cur === 3 ? 1 : 0);
  const z = 1 + 0.75 * smooth(frame, L(3), bactAt + 10);
  const fat = 1 - smooth(frame, fatsAt, fatsAt + 40);
  // line 5
  const count = Math.round(32 * smooth(frame, speciesAt, speciesAt + 20));
  // line 6: the magnifier slides across the worms
  const lens = smooth(frame, malesAt - 6, malesAt + 30);

  const chip =
    cur === 0 || cur === 6
      ? { kind: "real" as const, source: "Syced (CC0) · Osedax japonicus, Enoshima Aquarium" }
      : cur === 1 || cur === 4
        ? { kind: "real" as const, source: "OET/NOAA (CC BY 2.0) · whale skeleton, Monterey Bay" }
        : { kind: "illustration" as const, source: undefined };

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #10304A 0%, #0B1B2B 58%, #050E18 100%)" }}>
      {/* ---- line 1: the whale skeleton (2019), full plate */}
      {whale1 > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden", opacity: whale1 }}>
          <Img src={staticFile("assets/whale-fall.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "35% 45%", transform: `scale(${1.05 + 0.1 * lin(frame, L(1), L(2))})`, transformOrigin: `${lerp(60, 25, smooth(frame, skelAt, skelAt + 40))}% 45%`, filter: "brightness(0.85)" }} />
        </div>
      ) : null}
      {/* ---- line 4: the same photo as a band at the top; the depth card sits on ink below it */}
      {whale4 > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 720, overflow: "hidden", opacity: whale4 }}>
          <Img src={staticFile("assets/whale-fall.jpg")} style={{ width: 1080, height: 720, objectFit: "cover", objectPosition: "45% 45%", transform: `scale(${1.04 + 0.08 * lin(frame, L(4), L(5))})`, transformOrigin: "50% 50%", filter: "brightness(0.85)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 260, background: `linear-gradient(transparent, ${B.ink})` }} />
        </div>
      ) : null}
      {whale1 > 0 ? <PlateFade /> : null}
      <Note x={180} y={250} rows={["a whale skeleton in 2019", "not the discovery photo"]} opacity={whale1 + whale4} />

      {/* line 1: what happens to a whale fall - flesh in months, then the skeleton */}
      <div style={{ position: "absolute", left: 180, top: 900, width: 720, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.25)", opacity: whale1 }}>
        <div style={{ width: `${100 * (0.5 * smooth(frame, fleshAt, fleshAt + 30) + 0.5 * smooth(frame, skelAt, skelAt + 20))}%`, height: 8, borderRadius: 4, background: B.gauge }} />
      </div>
      <Note x={180} y={930} rows={["flesh: months"]} opacity={whale1 * ease(frame, fleshAt, 10)} color={B.gauge} size={30} />
      <Note x={560} y={930} rows={["then: skeleton"]} opacity={whale1 * ease(frame, skelAt, 10)} color={B.paper} size={30} />

      {/* ---- lines 2-3: the drawing - a bone in section, three females, roots, bacteria, fat */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: diag }}>
        <defs>
          <clipPath id="s11view">
            <rect x={160} y={240} width={770} height={900} rx={24} />
          </clipPath>
        </defs>
        <g clipPath="url(#s11view)">
          <g transform={`translate(540 760) scale(${z}) translate(-540 -760)`}>
            <rect x={170} y={BONE_TOP} width={740} height={460} rx={40} fill="#E8DCC4" stroke="#FFF4DD" strokeWidth={5} />
            {Array.from({ length: 34 }, (_, i) => {
              const px = 200 + ((i * 137) % 680);
              const py = BONE_TOP + 40 + ((i * 89) % 380);
              return <circle key={i} cx={px} cy={py} r={6 + (i % 4) * 3} fill="#CDBB98" />;
            })}
            {/* fat locked in the bone: shrinks as it is broken down */}
            {Array.from({ length: 12 }, (_, i) => {
              const px = 420 + ((i * 53) % 240);
              const py = BONE_TOP + 70 + ((i * 41) % 200);
              return <circle key={`f${i}`} cx={px} cy={py} r={(9 + (i % 3) * 3) * fat} fill="#FFD54A" stroke="#E0A800" strokeWidth={2} opacity={cur >= 3 ? 1 : 0.85} />;
            })}
            {WORMS.map((x, i) => (
              <Worm key={x} x={x} frame={frame} roots={roots} i={i} />
            ))}
            {/* bacteria inside the middle worm's roots */}
            {[
              [540, BONE_TOP + 30],
              [540, BONE_TOP + 90],
              [540, BONE_TOP + 130],
              [520, BONE_TOP + 70],
              [500, BONE_TOP + 98],
              [565, BONE_TOP + 88],
              [585, BONE_TOP + 120],
              [470, BONE_TOP + 150],
            ].map(([x, y], i) => (
              <rect key={`b${i}`} x={x - 5} y={y - 2.5} width={10} height={5} rx={2.5} fill="#1F6B3A" transform={`rotate(${(i * 47 + frame * 2) % 360} ${x} ${y})`} opacity={ease(frame, bactAt + i * 2, 8)} />
            ))}
            {/* feeding the worm: little arrows climbing the root */}
            {[0, 1, 2].map((k) => {
              const p = (((frame - feedAt) / 30 + k / 3) % 1 + 1) % 1;
              const y = BONE_TOP + 140 - 150 * p;
              return <path key={`a${k}`} d={`M ${532} ${y + 8} L 540 ${y} L 548 ${y + 8}`} fill="none" stroke="#FFD54A" strokeWidth={3} strokeLinecap="round" opacity={ease(frame, feedAt, 8) * Math.min(1, p * 4, (1 - p) * 4)} />;
            })}
          </g>
        </g>
      </svg>
      <Card x={180} y={262} big={["OSEDAX"]} opacity={span(frame, osedaxAt, L(3))} />
      <Note x={640} y={300} rows={["the female"]} opacity={span(frame, femaleAt, L(3))} color="#E9B7A8" size={30} />
      <Note x={180} y={1060} rows={["branching roots · into the bone"]} opacity={span(frame, rootsAt, L(3))} color="#8BD18F" />
      <Note x={180} y={262} rows={["bacteria inside the roots"]} opacity={span(frame, bactAt, L(4))} color="#8BD18F" size={30} />
      <Note x={180} y={330} rows={["break down the fats in the bone"]} opacity={span(frame, fatsAt, L(4))} color="#FFD54A" />
      <Note x={180} y={1060} rows={["and feed the worm"]} opacity={span(frame, feedAt, L(4))} color={B.gauge} size={30} />

      {/* ---- line 4: first found - the depth on ink, below the photo, never on it */}
      <Note x={180} y={740} rows={["first found on a whale skeleton"]} opacity={whale4} />
      <Card x={180} y={810} big={["2,891 m"]} small={["almost 3 km down"]} opacity={whale4 * ease(frame, kmAt, 10)} />
      <Note x={180} y={990} rows={["Monterey Bay"]} opacity={whale4 * ease(frame, bayAt, 10)} color={B.gauge} size={34} />

      {/* ---- line 5: 32 species, on five kinds of bone */}
      <div style={{ position: "absolute", left: 180, top: 300, opacity: span(frame, L(5), L(6)) }}>
        <div style={{ fontFamily: F.headline, fontSize: 200, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap" }}>{count}</div>
        <div style={{ fontFamily: F.headline, fontSize: 80, lineHeight: 1, color: B.paper, whiteSpace: "nowrap", opacity: ease(frame, speciesAt, 10) }}>SPECIES</div>
      </div>
      {BONE_ICONS.map((w, i) => {
        const on = span(frame, iconAt[i], L(6));
        const x = 180 + (i % 2) * 360;
        const y = 640 + Math.floor(i / 2) * 120;
        return (
          <div key={w} style={{ position: "absolute", left: x, top: y + 16 * (1 - ease(frame, iconAt[i], 8)), display: "flex", alignItems: "center", gap: 14, padding: "10px 22px", borderRadius: 999, background: "rgba(5,14,24,0.86)", outline: `3px solid ${B.gauge}`, opacity: on }}>
            <svg width={56} height={30} viewBox="0 0 56 30">
              <path d="M10 8 a6 6 0 1 1 6 -6 h24 a6 6 0 1 1 6 6 a6 6 0 1 1 -6 6 h-24 a6 6 0 1 1 -6 -6 Z" transform="translate(0 8)" fill="#E8DCC4" />
            </svg>
            <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 32, letterSpacing: 1.5, color: B.paper, whiteSpace: "nowrap", textTransform: "uppercase" }}>{w}</div>
          </div>
        );
      })}

      {/* ---- lines 0 and 6: the real worms on a bone, in an aquarium - said on the picture from its first frame */}
      {wormsOn > 0 ? (
        <div style={{ position: "absolute", left: WORM_BOX.x, top: WORM_BOX.y, width: WORM_BOX.w, height: WORM_BOX.h, borderRadius: 22, overflow: "hidden", outline: `4px solid ${B.paper}`, boxShadow: "0 12px 40px rgba(0,0,0,0.6)", background: B.ink, opacity: wormsOn }}>
          <Img src={staticFile("assets/osedax-aquarium.jpg")} style={{ display: "block", width: WORM_BOX.w, height: WORM_BOX.h, objectFit: "cover", transform: `scale(${wormZoom})`, transformOrigin: "50% 58%" }} />
        </div>
      ) : null}
      <Note x={176} y={WORM_BOX.y + WORM_BOX.h - 96} rows={["real bone-eating worms", "in an aquarium"]} opacity={wormsOn} />
      <div style={{ position: "absolute", left: 230, top: 800, padding: "8px 26px", border: `7px solid ${B.tease}`, borderRadius: 14, color: B.tease, fontFamily: F.headline, fontSize: 84, lineHeight: 1.05, letterSpacing: 3, whiteSpace: "nowrap", transform: `rotate(-6deg) scale(${lerp(1.4, 1, ease(frame, chewAt, 8))})`, opacity: worms0 * ease(frame, chewAt, 6) }}>NO WAY TO CHEW</div>
      <Note x={640} y={270} rows={["these: females"]} opacity={worms6 * ease(frame, femAt, 10)} color="#E9B7A8" size={30} />
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: worms6 * ease(frame, malesAt - 6, 8) }}>
        <g transform={`translate(${lerp(300, 700, lens)} ${500 + 20 * Math.sin(frame / 12)})`}>
          <circle r={96} fill="rgba(5,14,24,0.55)" stroke={B.paper} strokeWidth={9} />
          <line x1={68} y1={68} x2={140} y2={140} stroke={B.paper} strokeWidth={18} strokeLinecap="round" />
          <text x={0} y={34} textAnchor="middle" fontFamily="Anton, 'Arial Narrow', sans-serif" fontSize={100} fill={B.gauge}>?</text>
        </g>
      </svg>
      <Card x={180} y={800} big={["AND THE MALES?"]} opacity={worms6 * ease(frame, malesAt, 10)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text={SERIES} opacity={1 - end} />
      <EndCard opacity={end} series={SERIES} line="8 ways to live in the dark" />
      <TypeRail current={8} reveal8={ease(frame, 6, 10)} wave={lin(frame, endAt + 8, endAt + 50)} label={1 - end} />
    </AbsoluteFill>
  );
};

export const ShortS11: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
