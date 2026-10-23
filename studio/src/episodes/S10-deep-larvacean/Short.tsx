import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { SERIES } from "../L02-deep-sea-types/ladder";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, TypeRail, cue, currentLine, lin, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S10 - the animal that throws its house away (episodes/S10-deep-larvacean). Video 2's fourth Short: TYPE 7 · THE
 * DRIFTER. Vertical 1080x1920; rail left, drawing x 160-930, chip y ~1,170-1,216, captions y 1,290-1,590 (shortKit).
 * Lines: 0 5 cm in a 1 m house (to scale: 660 px = 1 m, so the animal is 33 px) · 1 built of mucus · 2 two filters,
 * particles caught on the inner one · 3 clogged: it moves out, builds a new one · 4 the old one sinks, up to 800 m in a
 * day · 5 "sinkers" carry carbon down (over a faint sea-floor photo) · 6 something else on the way down · 7 end card.
 * Honesty: there is no free photo of a giant larvacean (L02 assets.md row 7), so every line is drawn (chip ILLUSTRATION).
 * Line 5 lays the drawing over swimming-cucumber - a sea cucumber near the sea floor off Puerto Rico, 2015, NOT a
 * larvacean house - at ~30 %, and both the picture and the chip say what it is (S02's rule). The siphonophore half of
 * L02's type 7 is not used (hedged), and the "something else" is never named or labelled.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const C = { x: 545, y: 640 }; // the house's centre
const R = 330; // 1 m across = 660 px
const PX_PER_M = 2 * R;
const ANIMAL = 0.05 * PX_PER_M; // 5 cm = 33 px

/** the animal: a tadpole-shaped trunk and a beating tail, `len` px long, facing right */
const Animal: React.FC<{ x: number; y: number; len: number; frame: number; glow?: number }> = ({ x, y, len, frame, glow = 1 }) => {
  const k = len / 33;
  const w = 6 * Math.sin(frame / 2.2);
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <circle r={30} fill="#FFE9A8" opacity={0.12 * glow} />
      <path d={`M -4 0 C -12 ${-6 + w * 0.3}, -22 ${w}, -30 ${w * 1.4}`} fill="none" stroke="#F4D9A0" strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={4} cy={0} rx={8} ry={5.5} fill="#F4D9A0" />
    </g>
  );
};

/** fixed pseudo-random numbers for particles */
const rnd = (i: number, k: number) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const houseAt = cue(t, 0, "A house up to a metre wide");
  const mucusAt = cue(t, 1, "out of mucus");
  const innerAt = cue(t, 2, "the inner one");
  const fineAt = cue(t, 2, "fine enough");
  const outAt = cue(t, 3, "moves out");
  const newAt = cue(t, 3, "builds a new house");
  const slowAt = cue(t, 4, "And not slowly");
  const dayAt = cue(t, 4, "in a single day");
  const carbonAt = cue(t, 5, "They carry carbon");
  const elseAt = cue(t, 6, "something else");
  const endAt = L(7);
  const end = ease(frame, endAt, 12);

  // ---- the house: radius snaps out on line 0, sheets build on line 1, two nets on line 2, greys over on line 3
  const r = lerp(52, R, smooth(frame, houseAt, houseAt + 14));
  const sheets = lin(frame, L(1), L(1) + 60);
  const nets = ease(frame, L(2), 16);
  const clog = ease(frame, L(3), 24);
  // lines 3-4: the camera pulls back about the old house (scale 1 -> 0.55); line 4+: the old house falls
  const pull = smooth(frame, L(3), outAt + 10);
  const sc = lerp(1, 0.55, pull);
  const fall = smooth(frame, L(4), L(5) + 20);
  const oldX = lerp(C.x, 340, pull);
  const oldY = lerp(C.y, 640, pull) + lerp(0, 300, fall) + (cur >= 5 ? 60 * lin(frame, L(5), L(7)) : 0);
  // the animal: in the middle of the house, then out (line 3) to the upper right, where it starts a new house
  const out = smooth(frame, outAt, outAt + 24);
  const ax = cur < 3 ? C.x : lerp(oldX, 800, out);
  const ay = cur < 3 ? C.y : lerp(oldY, 470, out);
  const newR = lerp(0, 120, smooth(frame, newAt, newAt + 30));
  const newHouse = span(frame, newAt, L(5), 12, 12);
  const oldShown = 1 - ease(frame, endAt, 8);

  // line 2: particles drift in and stop on the inner filter (an ellipse 150 x 105 around the animal)
  const parts = Array.from({ length: 28 }, (_, i) => {
    const a = rnd(i, 1) * Math.PI * 2;
    const start = innerAt + rnd(i, 2) * 40;
    const p = smooth(frame, start, start + 36);
    const d0 = 340 + 60 * rnd(i, 3);
    const d1 = 1; // ends on the ellipse
    const ex = Math.cos(a) * 150 * d1;
    const ey = Math.sin(a) * 105 * d1;
    return { x: lerp(Math.cos(a) * d0, ex, p), y: lerp(Math.sin(a) * d0, ey, p), on: ease(frame, start, 8) };
  });

  // lines 5-6: what the falling house carries - carbon (round dots, labelled), then odd hard-edged specks (unlabelled)
  const carbon = ease(frame, carbonAt, 12);
  const odd = ease(frame, elseAt - 4, 10);

  // line 4: the depth counter
  const metres = Math.round(800 * smooth(frame, slowAt, dayAt + 10));
  const clock = lin(frame, slowAt, dayAt + 10);

  const seaFloor = span(frame, L(5), L(6), 14, 14);
  const surface = span(frame, L(5), L(6), 12, 10);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% ${30 + 30 * fall}%, #123A57 0%, #0B1B2B 55%, #050E18 100%)` }}>
      {/* line 5: the sea floor (a NOAA photo of a swimming sea cucumber, Puerto Rico 2015 - not a larvacean), faint, behind */}
      {seaFloor > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 640, width: 1080, height: 540, overflow: "hidden", opacity: 0.32 * seaFloor }}>
          <Img src={staticFile("assets/swimming-cucumber.png")} style={{ width: 1080, height: 540, objectFit: "cover", objectPosition: "50% 70%", transform: `scale(${1 + 0.05 * lin(frame, L(5), L(6))})` }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${B.ink}, transparent 40%, transparent 70%, ${B.ink})` }} />
        </div>
      ) : null}
      <Note x={180} y={1090} rows={["photo: the sea floor off Puerto Rico, 2015"]} opacity={seaFloor} size={24} />

      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <pattern id="s10coarse" width={36} height={36} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <line x1={0} y1={0} x2={0} y2={36} stroke="#BFEFFF" strokeWidth={2} />
            <line x1={0} y1={0} x2={36} y2={0} stroke="#BFEFFF" strokeWidth={2} />
          </pattern>
          <pattern id="s10fine" width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <line x1={0} y1={0} x2={0} y2={9} stroke="#E6FAFF" strokeWidth={1.2} />
            <line x1={0} y1={0} x2={9} y2={0} stroke="#E6FAFF" strokeWidth={1.2} />
          </pattern>
        </defs>

        {/* the old house, in its own frame: scaled about its centre, falling from line 4 */}
        <g opacity={oldShown} transform={`translate(${oldX} ${oldY}) scale(${sc}) rotate(${6 * fall * Math.sin(frame / 20)})`}>
          {/* a faint ring from frame 0, snapping out to 1 m on "a metre wide" */}
          <circle r={r} fill="rgba(191,239,255,0.05)" stroke="#BFEFFF" strokeWidth={4 / sc} strokeDasharray={cur === 0 && frame < houseAt ? "10 10" : undefined} opacity={0.75} />
          {/* line 1: mucus sheets, built outward from the animal */}
          {Array.from({ length: 6 }, (_, k) => {
            const rr = (R * (k + 1)) / 6;
            const on = lin(frame, L(1) + k * 8, L(1) + k * 8 + 16) * sheets;
            const wob = 6 * Math.sin(frame / 18 + k);
            return <ellipse key={k} rx={rr + wob} ry={rr * 0.86 - wob} fill="rgba(191,239,255,0.05)" stroke="rgba(191,239,255,0.35)" strokeWidth={3} opacity={on * (1 - 0.6 * nets)} />;
          })}
          {/* line 2: two nets - the outer coarse, the inner fine (greys over when it clogs) */}
          <circle r={R - 30} fill="url(#s10coarse)" opacity={0.45 * nets} />
          <ellipse rx={150} ry={105} fill="url(#s10fine)" stroke="#E6FAFF" strokeWidth={3} opacity={0.85 * nets} />
          <ellipse rx={150} ry={105} fill="#6E7781" opacity={0.75 * clog} />
          {parts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={4} fill="#FFE9A8" opacity={p.on * nets} />
          ))}
          {/* lines 5-6: what it carries down */}
          {Array.from({ length: 16 }, (_, i) => (
            <circle key={`c${i}`} cx={(rnd(i, 5) - 0.5) * 360} cy={(rnd(i, 6) - 0.5) * 260} r={9} fill="#4A4A4A" stroke="#9A9A9A" strokeWidth={2} opacity={carbon} />
          ))}
          {Array.from({ length: 7 }, (_, i) => {
            const x = (rnd(i, 8) - 0.5) * 420;
            const y = (rnd(i, 9) - 0.5) * 300;
            const glint = 0.5 + 0.5 * Math.sin(frame / 3 + i * 2.1);
            const col = ["#FF5AA0", "#4AE0FF", "#FFE14D", "#7CFF8A"][i % 4];
            return <rect key={`o${i}`} x={x - 9} y={y - 9} width={18} height={12} fill={col} transform={`rotate(${(frame * 3 + i * 40) % 360} ${x} ${y})`} opacity={odd * (0.55 + 0.45 * glint)} />;
          })}
        </g>

        {/* the animal (to scale on lines 0-2, then it leaves and builds again) */}
        <g opacity={cur <= 4 ? 1 - ease(frame, L(5), 10) : 0}>
          <Animal x={ax} y={ay} len={ANIMAL * (cur < 3 ? 1 : lerp(1, 0.55, pull) * lerp(1, 1.8, out))} frame={frame} />
        </g>
        {/* line 0: a marker ring around the animal so 33 px can be found on a phone */}
        <circle cx={C.x} cy={C.y} r={34 + 4 * Math.sin(frame / 6)} fill="none" stroke={B.gauge} strokeWidth={4} opacity={1 - ease(frame, L(1), 8)} />
        {/* line 3: the new house, around the animal at its new place */}
        <circle cx={800} cy={470} r={newR} fill="rgba(191,239,255,0.06)" stroke="#BFEFFF" strokeWidth={3} opacity={newHouse * 0.8} />
        {/* line 0: the scale bar under the house - 1 m */}
        <g opacity={span(frame, houseAt, L(2))}>
          <line x1={C.x - R} y1={1010} x2={C.x + R} y2={1010} stroke={B.gauge} strokeWidth={5} />
          <line x1={C.x - R} y1={995} x2={C.x - R} y2={1025} stroke={B.gauge} strokeWidth={5} />
          <line x1={C.x + R} y1={995} x2={C.x + R} y2={1025} stroke={B.gauge} strokeWidth={5} />
        </g>
        {/* line 4: a clock running once round while the counter climbs */}
        <g transform="translate(830 860)" opacity={span(frame, slowAt - 6, L(5))}>
          <circle r={52} fill="none" stroke={B.paper} strokeWidth={6} />
          <line x1={0} y1={0} x2={38 * Math.sin(clock * Math.PI * 2)} y2={-38 * Math.cos(clock * Math.PI * 2)} stroke={B.gauge} strokeWidth={6} strokeLinecap="round" />
          <circle r={6} fill={B.paper} />
        </g>
        {/* line 5: from the surface down into the deep sea */}
        <g opacity={surface}>
          <line x1={880} y1={290} x2={880} y2={1010 * lin(frame, L(5), carbonAt + 30) + 290 * (1 - lin(frame, L(5), carbonAt + 30))} stroke={B.paper} strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={-frame} />
          <path d="M 862 990 L 880 1020 L 898 990" fill="none" stroke={B.paper} strokeWidth={5} opacity={lin(frame, carbonAt + 20, carbonAt + 30)} />
        </g>
      </svg>

      {/* labels */}
      <Note x={C.x + 40} y={C.y - 80} rows={["≈ 5 cm"]} opacity={1 - ease(frame, L(1), 8)} color={B.gauge} size={34} />
      <Note x={C.x - 120} y={1032} rows={["up to 1 m"]} opacity={span(frame, houseAt, L(2))} color={B.gauge} size={34} />
      <Note x={180} y={262} rows={["a house of mucus"]} opacity={span(frame, mucusAt, L(2))} color="#BFEFFF" size={30} />
      <Note x={180} y={262} rows={["two filters", "one inside the other"]} opacity={span(frame, L(2), L(3))} color="#BFEFFF" size={30} />
      <Note x={180} y={1040} rows={["inner filter: fine enough", "to trap tiny particles"]} opacity={span(frame, fineAt, L(3))} color="#E6FAFF" />
      <Note x={180} y={262} rows={["the filters clog"]} opacity={span(frame, L(3), L(4))} color="#C9D0D6" size={30} />
      <Note x={640} y={600} rows={["a new house"]} opacity={span(frame, newAt, L(4))} color="#BFEFFF" />
      <Note x={180} y={262} rows={["the old one sinks"]} opacity={span(frame, L(4), L(5))} color="#BFEFFF" size={30} />
      <Card x={520} y={940} big={[frame >= dayAt + 10 ? "UP TO 800 m" : `${metres} m`]} small={["in a single day"]} size={66} opacity={span(frame, slowAt, L(5))} />
      <Note x={180} y={262} rows={["'sinkers'"]} opacity={span(frame, L(5), L(6))} color={B.gauge} size={34} />
      <Note x={740} y={250} rows={["surface"]} opacity={surface} size={24} />
      <Note x={720} y={1030} rows={["deep sea"]} opacity={surface * lin(frame, carbonAt + 20, carbonAt + 30)} size={24} />
      <Note x={180} y={740} rows={["carbon"]} opacity={span(frame, carbonAt, L(6))} color="#C9C9C9" size={30} />
      <Card x={180} y={262} big={["SOMETHING ELSE"]} bg={B.tease} ink={B.paper} size={80} opacity={span(frame, elseAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind="illustration" source={cur === 0 ? "to scale" : cur === 5 ? "over a NOAA photo of the sea floor (Puerto Rico, 2015)" : undefined} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text={SERIES} opacity={1 - end} />
      <EndCard opacity={end} series={SERIES} line="8 ways to live in the dark" />
      <TypeRail current={7} wave={lin(frame, endAt + 8, endAt + 50)} label={1 - end} />
    </AbsoluteFill>
  );
};

export const ShortS10: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
