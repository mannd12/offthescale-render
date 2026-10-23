import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { SERIES } from "../L02-deep-sea-types/ladder";
import { Captions, Card, EndCard, Note, PlateFade, SeriesPill, ShortFrame, TypeRail, cue, currentLine, lin, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S08 - a torch its prey can't see (episodes/S08-deep-redtorch). Video 2's second Short: TYPE 2 Â· THE RED TORCH.
 * Vertical 1080x1920; rail on the left, content x 160-930, chip y ~1,170-1,216, captions y 1,290-1,590 (shortKit).
 * Lines: 0 the beam (drawn) Â· 1 blue light (comb-jelly plate + spectrum) Â· 2 red unseen Â· 3 the loosejaw + its lamp Â·
 * 4 they can see it Â· 5 the beam again, wider Â· 6 a pigment...? Â· 7 end card.
 * Honesty: every beam and lamp is drawn (chip ILLUSTRATION whenever one is up - here, every line). The line-1/2 plate
 * is a comb jelly (Duobrachium sparksae, NOAA 2015) - said on the picture from its first frame. The loosejaw plate is
 * a Malacosteus niger TRAWLED from 1,500 m (2005), a 1956x504 strip with the head on the left: shown as a band, and
 * the lamp is drawn on a separate diagram head, never placed on the photo (its eye position is not measured).
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const RED = "#E8322B";
const FAR = "#FF5A4F";

/** the loosejaw band: x 160-1080 (the photo may run under the Shorts buttons; nothing important does), y 260-640 */
const BAND = { x: 160, y: 260, w: 920, h: 380 };

/** a dark prey fish, facing left (toward the hunter); lit = 0..1 how much of the red beam falls on it */
const Prey: React.FC<{ x: number; y: number; s: number; lit: number }> = ({ x, y, s, lit }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -60 0 C -40 -26, 20 -30, 50 -8 L 80 -26 L 76 0 L 80 26 L 50 8 C 20 30, -40 26, -60 0 Z" fill={`rgb(${Math.round(lerp(22, 200, lit))}, ${Math.round(lerp(30, 60, lit))}, ${Math.round(lerp(44, 54, lit))})`} opacity={0.25 + 0.75 * lit} />
    <circle cx={-38} cy={-4} r={4} fill={lit > 0.3 ? "#FFD9D4" : "#2B3648"} />
  </g>
);

/** the hunter's red beam: a cone from the lamp at `angle` (degrees, 0 = to the right), half-width `half` */
const Beam: React.FC<{ id: string; lx: number; ly: number; angle: number; half: number; len: number; on: number; prey: { x: number; y: number; s: number }[] }> = ({ id, lx, ly, angle, half, len, on, prey }) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const a1 = r(angle - half);
  const a2 = r(angle + half);
  const p1 = [lx + Math.cos(a1) * len, ly + Math.sin(a1) * len];
  const p2 = [lx + Math.cos(a2) * len, ly + Math.sin(a2) * len];
  return (
    <g opacity={on}>
      <defs>
        <radialGradient id={id} cx={lx} cy={ly} r={len} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={FAR} stopOpacity={0.75} />
          <stop offset="1" stopColor={RED} stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d={`M ${lx} ${ly} L ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} Z`} fill={`url(#${id})`} />
      {prey.map((p, i) => {
        const pa = (Math.atan2(p.y - ly, p.x - lx) * 180) / Math.PI;
        const lit = Math.max(0, 1 - Math.abs(pa - angle) / half);
        return <Prey key={i} {...p} lit={Math.min(1, lit * 1.6)} />;
      })}
      <circle cx={lx} cy={ly} r={16} fill="#FFB3AC" />
      <circle cx={lx} cy={ly} r={34} fill={FAR} opacity={0.35} />
    </g>
  );
};

/** a diagram dragonfish head, facing right, ~380 x 200 local units; the lamp sits under the eye */
const Head: React.FC<{ lamp: number; frame: number }> = ({ lamp, frame }) => (
  <g>
    <path d="M0 -62 C 80 -112, 220 -112, 300 -72 L 384 -40 L 250 -4 L 384 34 L 300 62 C 220 102, 80 102, 0 62 Z" fill="#1A2234" stroke="#41557A" strokeWidth={4} strokeLinejoin="round" />
    <g stroke="#C9D3E0" strokeWidth={3} strokeLinecap="round">
      {[0.25, 0.55, 0.85].map((u) => (
        <line key={u} x1={384 - 134 * u} y1={-40 + 36 * u} x2={384 - 134 * u + 3} y2={-40 + 36 * u + 14} />
      ))}
    </g>
    <circle cx={250} cy={-58} r={22} fill="#6F8598" />
    {lamp > 0 ? <ellipse cx={232} cy={-18} rx={44 + 6 * Math.sin(frame / 5)} ry={30} fill={FAR} opacity={0.35 * lamp} /> : null}
    <ellipse cx={232} cy={-18} rx={17} ry={10} fill={lamp > 0 ? "#FF8A80" : "#3A2E3A"} opacity={0.5 + 0.5 * lamp} />
  </g>
);

/** an eye: crossed out (cross = 1) or open */
const Eye: React.FC<{ x: number; y: number; cross: number; on: number; color?: string }> = ({ x, y, cross, on, color = B.paper }) => (
  <g transform={`translate(${x} ${y})`} opacity={on}>
    <path d="M -54 0 Q 0 -40 54 0 Q 0 40 -54 0 Z" fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round" />
    <circle r={14} fill={color} />
    <line x1={-56 * cross} y1={-40 * cross} x2={56 * cross} y2={40 * cross} stroke={RED} strokeWidth={9} strokeLinecap="round" opacity={cross > 0.02 ? 1 : 0} />
  </g>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const blueAt = cue(t, 1, "almost every light is blue");
  const travelsAt = cue(t, 1, "travels best");
  const redAt = cue(t, 2, "can't see red");
  const secondAt = cue(t, 3, "carry a second light");
  const farAt = cue(t, 3, "It shines far-red");
  const beyondAt = cue(t, 3, "beyond seven hundred");
  const unlikeAt = cue(t, 4, "unlike almost everything");
  const canSeeAt = cue(t, 4, "they can see it");
  const sweepAt = cue(t, 5, "a red beam sweeping");
  const noIdeaAt = cue(t, 5, "no idea");
  const pigmentAt = cue(t, 6, "with a pigment");
  const endAt = L(7);
  const end = ease(frame, endAt, 12);

  // lines 0 and 5 - the beam, on ink. It is already sweeping at frame 0.
  const beam0 = 1 - ease(frame, L(1), 8);
  const angle0 = 4 + 16 * Math.sin(frame / 22);
  const beam5 = span(frame, L(5), L(6));
  const angle5 = frame < sweepAt ? 0 : 24 * Math.sin((frame - sweepAt) / 24);

  // lines 1-2: the comb jelly plate + the spectrum
  const jelly = span(frame, L(1), L(3));
  const spec = span(frame, L(1), L(3));
  const wipe = lin(frame, L(1), L(1) + 24);
  const jellyDark = lerp(0.6, 0.32, ease(frame, L(2), 20));

  // lines 3, 4, 6: the loosejaw band + the drawn head
  const band = span(frame, L(3), L(5)) + span(frame, L(6), endAt);
  const head = span(frame, secondAt - 6, L(5)) + span(frame, L(6), endAt);
  const lamp = ease(frame, farAt, 12) + (cur === 6 ? 1 : 0);
  const bandZoom = cur === 6 ? 1 + 0.35 * smooth(frame, L(6), pigmentAt + 20) : 1 + 0.04 * lin(frame, L(3), L(5));
  const blur = ease(frame, pigmentAt, 14);

  const chip = cur === 1 || cur === 2 ? "drawn lights Â· NOAA photo: a comb jelly, 2015" : cur === 3 || cur === 4 || cur === 6 ? "drawn light Â· NOAA NEFSC photo: loosejaw, 1,500 m" : undefined;

  // blue sparks over the jelly plate (drawn bioluminescence)
  const sparks = Array.from({ length: 22 }, (_, i) => {
    const x = 200 + ((i * 263) % 700) + 20 * Math.sin(frame / 30 + i);
    const y = 280 + ((i * 157) % 520) + 16 * Math.cos(frame / 26 + i * 1.7);
    const on = ease(frame, blueAt + i * 2, 10) * (0.55 + 0.45 * Math.sin(frame / 7 + i * 1.3));
    return (
      <g key={i} opacity={on}>
        <circle cx={x} cy={y} r={14} fill="#39B6FF" opacity={0.28} />
        <circle cx={x} cy={y} r={4 + (i % 3)} fill={i % 4 === 0 ? "#BFEFFF" : "#39B6FF"} />
      </g>
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#03080F" }}>
      {/* ---- lines 1-2: the comb jelly, dim, with drawn blue lights over it */}
      {jelly > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, opacity: jelly }}>
          <Img src={staticFile("assets/comb-jelly.png")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "58% 44%", transform: `scale(${1 + 0.06 * lin(frame, L(1), L(3))})`, transformOrigin: "58% 44%", filter: `brightness(${jellyDark})` }} />
        </div>
      ) : null}
      {jelly > 0 ? <PlateFade /> : null}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: jelly * (1 - 0.6 * ease(frame, L(2), 16)) }}>{sparks}</svg>
      <Note x={180} y={230} rows={["shown: a comb jelly Â· NOAA, 2015"]} opacity={jelly} />

      {/* the spectrum (x 180-900, y 880-950): blue boxed on "is blue", the red end shaded on "can't see red" */}
      <div style={{ position: "absolute", left: 180, top: 880, width: 720, opacity: spec }}>
        <div style={{ position: "relative", height: 70, borderRadius: 35, overflow: "hidden", clipPath: wipe < 1 ? `inset(-4px ${(1 - wipe) * 100}% -4px -4px)` : undefined, outline: "3px solid rgba(255,255,255,0.5)", background: "linear-gradient(90deg, #6A5AE0 0%, #39B6FF 30%, #66D66E 50%, #FFE14D 62%, #FF9A2E 72%, #E8322B 84%, #6A0A0A 100%)" }}>
          <div style={{ position: "absolute", left: "78%", top: 0, bottom: 0, right: 0, background: "rgba(5,14,24,0.85)", opacity: ease(frame, redAt, 12) }} />
        </div>
        <div style={{ position: "absolute", left: "19%", width: "22%", top: -8, height: 86, boxSizing: "border-box", border: "5px solid #BFEFFF", borderRadius: 16, opacity: ease(frame, blueAt, 8) * (0.75 + 0.25 * Math.sin(frame / 6)) }} />
        <div style={{ position: "absolute", left: "78%", right: -8, top: -8, height: 86, boxSizing: "border-box", border: `5px solid ${FAR}`, borderRadius: 16, opacity: ease(frame, redAt, 8) }} />
      </div>
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: spec * ease(frame, redAt, 10) }}>
        <Eye x={822} y={810} cross={ease(frame, redAt + 6, 10)} on={1} />
      </svg>
      <Note x={180} y={980} rows={["blue: travels best through water"]} opacity={spec * ease(frame, travelsAt, 10)} color="#BFEFFF" />
      <Note x={180} y={1050} rows={["most can't see red"]} opacity={spec * ease(frame, redAt, 10)} color="#FF8A80" size={30} />

      {/* ---- lines 3, 4, 6: the real loosejaw (a trawled specimen) as a band; the lamp is on the drawn head below */}
      {band > 0 ? (
        <div style={{ position: "absolute", left: BAND.x, top: BAND.y, width: BAND.w, height: BAND.h, overflow: "hidden", borderRadius: "22px 0 0 22px", opacity: band, background: B.ink }}>
          <Img src={staticFile("assets/loosejaw.jpg")} style={{ display: "block", width: BAND.w, height: BAND.h, objectFit: "cover", objectPosition: "0% 55%", transform: `scale(${bandZoom})`, transformOrigin: "12% 50%", filter: "brightness(1.08)" }} />
        </div>
      ) : null}
      <Note x={176} y={576} rows={["loosejaw Â· trawled from 1,500 m, 2005"]} opacity={band} />
      <Card x={180} y={662} big={["3 KINDS"]} small={["loose-jawed dragonfish"]} opacity={span(frame, L(3), L(4))} />
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: head }}>
        <g transform={`translate(180 ${985 + 4 * Math.sin(frame / 13)})`}>
          <Head lamp={Math.min(1, lamp)} frame={frame} />
        </g>
        {/* line 4: everything around them can't see it (crossed eye) - they can (it opens) */}
        <Eye x={760} y={1010} cross={cur === 4 ? 1 - ease(frame, canSeeAt, 12) : 0} on={span(frame, unlikeAt, L(5))} color={cur === 4 && frame >= canSeeAt ? "#FF8A80" : B.paper} />
        {/* line 6: a pigment in its eye - an unlabelled, blurred ring over the drawn eye */}
        <g opacity={cur === 6 ? blur : 0} filter="url(#pigblur)">
          <defs>
            <filter id="pigblur">
              <feGaussianBlur stdDeviation={3} />
            </filter>
          </defs>
          {[0, 1, 2].map((k) => {
            const cx = 180 + 250 + (k - 1) * 46;
            const cy = 985 - 58 + (k === 1 ? -26 : 0) + 3 * Math.sin(frame / 9 + k);
            const pts = Array.from({ length: 6 }, (_, j) => `${cx + 26 * Math.cos((j * Math.PI) / 3)},${cy + 26 * Math.sin((j * Math.PI) / 3)}`).join(" ");
            return <polygon key={k} points={pts} fill="none" stroke="#7CFF8A" strokeWidth={5} />;
          })}
        </g>
      </svg>
      <Note x={600} y={850} rows={["a second light", "under each eye"]} opacity={span(frame, secondAt, farAt)} color="#FF8A80" size={28} />
      <Note x={600} y={850} rows={["far-red", "beyond 700 nm"]} opacity={span(frame, farAt, L(4)) * (1 - ease(frame, L(4), 8))} color="#FF8A80" size={30} />
      <Note x={600} y={880} rows={["they can see it"]} opacity={span(frame, canSeeAt, L(5))} color="#FF8A80" size={30} />
      <Card x={180} y={662} big={["A PIGMENT", "IN A FISH'S EYE?"]} size={70} opacity={ease(frame, pigmentAt, 10) * span(frame, L(6), endAt)} />

      {/* ---- lines 0 and 5: the beam on ink (drawn) */}
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: beam0 }}>
        <Beam id="b0" lx={420} ly={640} angle={angle0} half={9} len={820} on={1} prey={[{ x: 820, y: 668, s: 1.2 }]} />
        <g transform="translate(420 640) translate(-232 18)">
          <Head lamp={1} frame={frame} />
        </g>
      </svg>
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: beam5 }}>
        <Beam
          id="b5"
          lx={420}
          ly={640}
          angle={angle5}
          half={14}
          len={860}
          on={ease(frame, sweepAt - 10, 10)}
          prey={[
            { x: 760, y: 520, s: 1.1 },
            { x: 860, y: 820, s: 1.3 },
          ]}
        />
        <g transform="translate(420 640) translate(-232 18)">
          <Head lamp={1} frame={frame} />
        </g>
      </svg>
      <Note x={560} y={980} rows={["no idea they're lit"]} opacity={beam5 * ease(frame, noIdeaAt, 10)} color="#FF8A80" size={28} />

      {/* chip: every line carries something drawn */}
      <div style={{ opacity: 1 - end }}>
        <CreditChip kind="illustration" source={chip} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text={SERIES} opacity={1 - end} />
      <EndCard opacity={end} series={SERIES} line="8 ways to live in the dark" />
      <TypeRail current={2} wave={lin(frame, endAt + 8, endAt + 50)} label={1 - end} />
    </AbsoluteFill>
  );
};

export const ShortS08: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
