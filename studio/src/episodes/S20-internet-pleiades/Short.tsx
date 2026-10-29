import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, lin, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S20 - the computer you're allowed to see (episodes/S20-internet-pleiades). A cliffhanger for L04 (Every Level of the
 * Internet), answered by Level 5 (the data centre, 5:28). Vertical 1080x1920. Plates in the band y 210-770 (under the series pill): the
 * Aitken shed (NASA Ames, public domain) on lines 0 and 5, the Pleiades photo (Steve Jurvetson, CC BY 2.0) on lines 1-4.
 * The Pleiades photo has a person in it (L04 viewer review 1): NOTHING is drawn over that photo - every number sits in
 * the spec sheet under it (x 120-900, y 800-1,140). Chip y ~1,170-1,216, captions y 1,290-1,590 (shortKit). Nothing
 * past x = 930, nothing in the bottom 300 px.
 * Lines: 0 pages live in buildings full of machines (shed) · 1 one you're allowed to see: NASA's Pleiades · 2 153
 * racks, 10,728 computers · 3 232,416 cores, 903 TB · 4 2008 -> December 2025, switched off · 5 where is this video,
 * who's allowed in? (shed again) · 6 end card.
 * Sources: L04 #13 (NASA NAS: 153 racks, 10,728 nodes, 232,416 cores, 903 TB, deployed 2008, decommissioned Dec 2025),
 * #12 (plate licences). "Computers" for nodes is L04's own wording (Level 5). Line 0's framing is L04 Level 5 narration.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const PLATE_TOP = 210; // below the series pill: no chrome ever sits on the Pleiades photo
const PLATE_H = 560; // y 210-770
const commas = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const SpecRow: React.FC<{ y: number; value: number; unit?: string; label: string; k: number; opacity: number }> = ({ y, value, unit, label, k, opacity }) => (
  <div style={{ position: "absolute", left: 120, top: y, width: 780, height: 72, display: "flex", alignItems: "center", borderBottom: "2px solid rgba(140,160,179,0.35)", opacity }}>
    <div style={{ width: 400, fontFamily: F.headline, fontSize: 70, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap" }}>
      {commas(value * k)}
      {unit ? <span style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 40, marginLeft: 10 }}>{unit}</span> : null}
    </div>
    <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: B.paper, whiteSpace: "nowrap", textTransform: "uppercase" }}>{label}</div>
  </div>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const buildingsAt = cue(t, 0, "buildings full of machines");
  const allowedAt = cue(t, 1, "you're allowed to see");
  const pleiadesAt = cue(t, 1, "NASA's Pleiades");
  const caAt = cue(t, 1, "in California");
  const racksAt = cue(t, 2, "A hundred and fifty-three racks");
  const compAt = cue(t, 2, "Ten thousand seven hundred");
  const asOneAt = cue(t, 2, "wired together as one");
  const coresAt = cue(t, 3, "Two hundred and thirty-two thousand");
  const memAt = cue(t, 3, "nine hundred terabytes");
  const ranAt = cue(t, 4, "It ran from 2008");
  const decAt = cue(t, 4, "December 2025");
  const offAt = cue(t, 4, "switched off");
  const whereAt = cue(t, 5, "So where is the video");
  const whoAt = cue(t, 5, "who's allowed in");
  const levelAt = cue(t, 6, "Level five");
  const end = ease(frame, levelAt, 12);

  // the plates: shed (line 0, and again from line 5), Pleiades in between; slow pushes on each
  const pl = ease(frame, pleiadesAt - 4, 14) * (1 - ease(frame, whereAt, 14));
  const shedScale = 1.04 + 0.08 * lin(frame, 0, pleiadesAt) + 0.06 * lin(frame, whereAt, levelAt);
  const plScale = 1.05 + 0.1 * lin(frame, pleiadesAt, offAt);
  // "switched off": the Pleiades photo dims (the photo itself is untouched; it was taken while the machine ran)
  const off = ease(frame, offAt, 16);

  // the spec sheet: each number counts up from 0 while it is said
  const cnt = (at: number) => smooth(frame, at, at + 30);
  const specOn = span(frame, racksAt - 4, ranAt);
  // the lifetime bar, 2008 -> Dec 2025 (Dec 2025 sits just before the end of 2025: 17.9 of 18 years drawn)
  const life = smooth(frame, ranAt, decAt + 10);
  const lifeOn = span(frame, ranAt - 4, whereAt);

  const chip = pl > 0.5 ? "Steve Jurvetson · CC BY 2.0 · NASA Pleiades" : "NASA Ames · modular supercomputer facility";

  return (
    <AbsoluteFill style={{ backgroundColor: "#070C12" }}>
      <div style={{ position: "absolute", left: 0, top: PLATE_TOP, width: 1080, height: PLATE_H, overflow: "hidden" }}>
        <Img src={staticFile("assets/aitken-shed.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: PLATE_H, objectFit: "cover", transform: `scale(${shedScale})`, transformOrigin: "50% 50%", filter: "brightness(0.75)" }} />
        <Img src={staticFile("assets/pleiades.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: PLATE_H, objectFit: "cover", transform: `scale(${plScale})`, transformOrigin: "50% 45%", filter: `brightness(${lerp(0.9, 0.3, off)}) saturate(${lerp(1, 0.2, off)})`, opacity: pl }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 140, background: "linear-gradient(transparent, #070C12)" }} />
      </div>

      {/* under the plate: what it is (never on the Pleiades photo itself) */}
      <Note x={120} y={790} rows={["a building full of machines"]} opacity={span(frame, buildingsAt, allowedAt)} color={B.gauge} size={30} />
      <Note x={120} y={790} rows={["one you're allowed to see"]} opacity={span(frame, allowedAt, pleiadesAt + 6)} color={B.gauge} size={30} />
      <Note x={120} y={790} rows={["NASA Pleiades · supercomputer"]} opacity={span(frame, pleiadesAt + 6, racksAt)} color={B.gauge} size={30} />
      <Note x={120} y={860} rows={["Ames Research Center, California"]} opacity={span(frame, caAt, racksAt)} size={26} />

      {/* lines 2-3: the spec sheet, a row per number as it is said */}
      <SpecRow y={800} value={153} label="racks" k={cnt(racksAt)} opacity={specOn * ease(frame, racksAt, 8)} />
      <SpecRow y={880} value={10728} label="computers" k={cnt(compAt)} opacity={specOn * ease(frame, compAt, 8)} />
      <SpecRow y={960} value={232416} label="processor cores" k={cnt(coresAt)} opacity={specOn * ease(frame, coresAt, 8)} />
      <SpecRow y={1040} value={903} unit="TB" label="of memory" k={cnt(memAt)} opacity={specOn * ease(frame, memAt, 8)} />
      <div style={{ position: "absolute", left: 760, top: 902, padding: "6px 14px", borderRadius: 10, background: B.gauge, color: B.ink, fontFamily: F.ui, fontWeight: 800, fontSize: 22, letterSpacing: 1, whiteSpace: "nowrap", opacity: specOn * ease(frame, asOneAt, 8) * (1 - ease(frame, coresAt, 8)) }}>AS ONE</div>

      {/* line 4: the lifetime bar, then OFF */}
      <div style={{ position: "absolute", left: 120, top: 820, width: 780, opacity: lifeOn * (1 - end) }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.headline, fontSize: 64, lineHeight: 1, color: B.paper, whiteSpace: "nowrap" }}>
          <span>2008</span>
          <span style={{ opacity: ease(frame, decAt, 8), color: B.gauge }}>DEC 2025</span>
        </div>
        <div style={{ marginTop: 18, height: 30, borderRadius: 15, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${100 * life * (17.9 / 18)}%`, height: "100%", background: B.gauge }} />
        </div>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
          {Array.from({ length: 18 }, (_, i) => (
            <div key={i} style={{ width: 3, height: i % 5 === 2 ? 22 : 12, background: B.mute, opacity: 0.7 }} />
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 1010, display: "flex", alignItems: "center", gap: 18, opacity: lifeOn * ease(frame, offAt, 8) }}>
        <svg width={70} height={70} viewBox="0 0 70 70">
          <path d="M 22 18 A 24 24 0 1 0 48 18" fill="none" stroke={B.tease} strokeWidth={7} strokeLinecap="round" />
          <line x1={35} y1={8} x2={35} y2={34} stroke={B.tease} strokeWidth={7} strokeLinecap="round" />
        </svg>
        <div style={{ fontFamily: F.headline, fontSize: 80, lineHeight: 1, color: B.tease, whiteSpace: "nowrap" }}>SWITCHED OFF</div>
      </div>

      {/* line 5: the questions, under the shed */}
      <Card x={120} y={800} big={["WHERE IS THIS", "VIDEO STORED?"]} size={96} opacity={span(frame, whereAt, levelAt)} />
      <Card x={120} y={1040} big={["WHO'S ALLOWED IN?"]} size={64} bg={B.tease} ink={B.paper} opacity={span(frame, whoAt, levelAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind="real" source={chip} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF THE INTERNET" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 5 · the data centre"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF THE INTERNET" line="level 5: the data centre" />
    </AbsoluteFill>
  );
};

export const ShortS20: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
