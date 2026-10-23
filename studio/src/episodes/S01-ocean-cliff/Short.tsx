import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip, DiverSilhouette, Gauge } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt, within } from "../../lib/timeline";
import { ease } from "../../lib/ui";
import { STOPS, depthPos, fmtDepth, pressureSub } from "../L01-ocean-levels/ladder";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S01 - the first Short: down the L01 ladder in five stops (40, 332, 1,000, 3,800, 6,000 m), stopping
 * at 6,000 m with almost five kilometres unanswered (episodes/S01-ocean-cliff). Vertical 1080x1920; the
 * gauge sits on the LEFT. Shorts UI safe area: nothing past x = 940 (right-edge buttons) and nothing in
 * the bottom 300 px (y >= 1,620) - the caption band is x 70-930, y 1,232-1,600.
 * Lines: 0 hook · 1 40 m · 2 332 m · 3 1,000 m · 4 3,800 m · 5 6,000 m · 6 "five kilometres left" · 7 end card.
 * Every depth is an L01 claim (episodes/S01-ocean-cliff/sources.md). Chip credits are the manifest's
 * (studio/assets/manifest.json); where a plate is not the thing the card names, the chip says so
 * (L01 sources #46: the reef diver is not the record dive, the ROV is on a seamount, not in a trench).
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const W = 1080;
const PLATE_H = 1180;

/** [plate image id, depth reached during the line, headline card, small card text] per line */
const STOPS_BY_LINE: { image: string | null; depth: number; big?: string; small?: string; tag?: string; credit: string }[] = [
  { image: "whale-shark", depth: 0, credit: "NOAA Photo Library" },
  { image: "diver-reef", depth: 40, big: "40 m", small: "RECREATIONAL SCUBA LIMIT", credit: "NOAA ONMS, Gray's Reef" },
  // same plate under the record card: the chip must not let it pass as the 2014 dive
  { image: "diver-reef", depth: 332, big: "332 m", small: "DEEPEST SCUBA DIVE · 2014", tag: "13 h 35 min to come back up", credit: "NOAA · a reef diver, not the record dive" },
  { image: "lizardfish", depth: 1000, big: "1,000 m", small: "THE LAST LIGHT · DARK BELOW", credit: "NOAA Okeanos Explorer · a deep-sea lizardfish" },
  { image: "titanic-bow", depth: 3800, big: "3,800 m", small: "TITANIC · ≈ AVERAGE DEPTH (3,682 m)", credit: "NOAA / IFE / URI" },
  // the plate is the ROV on Retriever Seamount (2014), not a 6,000 m trench - the chip says where it is
  { image: "rov-coral", depth: 6000, big: "6,000 m", small: "THE ORDINARY SEA FLOOR ENDS", tag: "deeper only in a trench", credit: "NOAA Ocean Exploration · Retriever Seamount, 2014" },
  { image: null, depth: 6000, credit: "" },
  { image: null, depth: 6000, credit: "" },
];

// Safe band: x 70-930 (the Shorts buttons own the right edge from ~x 940) and y 1,232-1,600 (the credit
// chip ends at 1,216; the bottom 300 px belong to the Shorts UI). The longest line (133 characters at
// 56 px) balances to 5 lines = 314 px; even 6 lines (376 px) would end at ~1,604.
const Caption: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => (
  <div style={{ position: "absolute", left: 70, right: 150, top: 1232, height: 368, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", opacity }}>
    <div style={{ fontFamily: F.caption, fontWeight: 600, fontSize: text.length > 110 ? 56 : text.length > 80 ? 62 : 70, lineHeight: 1.12, textWrap: "balance", color: B.paper, textShadow: "0 3px 0 #0B1B2B, 0 0 18px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.8)" }}>{text}</div>
  </div>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const n = t.lines.length;
  // which line is speaking now
  let cur = 0;
  for (let i = 0; i < n; i++) if (frame >= lineAt(t, i)) cur = i;
  const leftAt = lineAt(t, 6);
  const endAt = lineAt(t, 7);
  const goAt = 8; // the gauge is already falling in the first second (Shorts research: ~1 s hook)

  // depth glides to each line's stop over its first second
  let depth = 0;
  for (let i = 1; i < 6; i++) {
    const from = STOPS_BY_LINE[i - 1].depth;
    const to = STOPS_BY_LINE[i].depth;
    depth += (to - from) * ease(frame, lineAt(t, i), 30);
  }
  // A first nudge down on "go down": 0 -> 30 m, held. Both terms only ever rise, so the reading is
  // monotonic - line 1's glide (0 -> 40 m) simply takes over once it passes 30 m. (The old version
  // multiplied the nudge away in one frame at line 1, so the gauge fell back to ~4 m and re-climbed.)
  depth = Math.max(depth, 30 * ease(frame, goAt, 40));
  const pointerY = 250 + depthPos(depth) * 900; // gauge top + position * height, as passed to <Gauge>

  const plateOn = 1 - ease(frame, leftAt, 12);
  const left = ease(frame, leftAt, 12) * (1 - ease(frame, endAt, 10));
  const end = ease(frame, endAt, 12);
  const pulse = 0.6 + 0.4 * Math.sin(frame / 5);

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {/* plates: each line's still, cross-faded; darker the deeper we go */}
      {STOPS_BY_LINE.slice(0, 6).map((s, i) => {
        if (!s.image) return null;
        const on = ease(frame, lineAt(t, i), 12) * (i < 5 ? 1 - ease(frame, lineAt(t, i + 1), 12) : plateOn);
        if (on <= 0) return null;
        const bright = 1 - 0.09 * i;
        return <Img key={i} src={staticFile(`assets/${s.image}.jpg`)} style={{ position: "absolute", top: 0, left: 0, width: W, height: PLATE_H, objectFit: "cover", opacity: on, filter: `brightness(${bright})` }} />;
      })}
      <div style={{ position: "absolute", top: PLATE_H - 360, left: 0, right: 0, height: 360, background: `linear-gradient(transparent, ${B.ink})` }} />
      <div style={{ position: "absolute", top: PLATE_H, left: 0, right: 0, bottom: 0, background: B.ink }} />

      {/* series pill */}
      <div style={{ position: "absolute", top: 90, left: 40, padding: "12px 26px", borderRadius: 999, background: B.gauge, color: B.ink, fontFamily: F.ui, fontWeight: 800, fontSize: 32, letterSpacing: 1, opacity: 1 - end }}>EVERY LEVEL OF THE OCEAN</div>

      {/* the gauge, left edge (Shorts UI is on the right) */}
      <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - end }}>
        <Gauge x={30} top={250} height={900} stops={STOPS} position={depthPos(depth)} reading={left > 0.5 ? "?" : fmtDepth(depth)} sub={left > 0.5 ? "4,935 m left" : pressureSub(depth)} />
        {/* line 6: the unanswered band, 6,000 -> 10,935 m */}
        <div style={{ position: "absolute", left: 30 + 288 - 6, top: 250 + depthPos(6000) * 900, width: 24, height: (1 - depthPos(6000)) * 900, borderRadius: 12, background: B.tease, opacity: left * pulse, boxShadow: `0 0 30px ${B.tease}` }} />
      </div>

      {/* the numbers: one card per stop, right of the gauge, above the caption band */}
      {STOPS_BY_LINE.map((s, i) => {
        if (!s.big) return null;
        const on = ease(frame, lineAt(t, i), 10) * (1 - ease(frame, lineAt(t, i + 1), 8));
        if (on <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 380, top: 720, opacity: on }}>
            <div style={{ display: "inline-block", padding: "10px 24px 14px", borderRadius: 18, background: B.gauge, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.6)" }}>
              <div style={{ fontFamily: F.headline, fontSize: 96, lineHeight: 1 }}>{s.big}</div>
              {/* one line, never wrapped (no orphans); the long Titanic line drops to 22 px so the card ends near x 900 */}
              <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: s.small && s.small.length > 30 ? 22 : 24, marginTop: 6, letterSpacing: 1, whiteSpace: "nowrap" }}>{s.small}</div>
            </div>
            {s.tag ? <div style={{ marginTop: 14, fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 1.5, textTransform: "uppercase", color: B.paper, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>{s.tag}</div> : null}
          </div>
        );
      })}

      {/* line 0: a person at the gauge pointer (the surface), to say "you" - it rides the pointer down */}
      <DiverSilhouette size={96} color={B.paper} style={{ position: "absolute", left: 348, top: pointerY - 48, opacity: ease(frame, 0, 10) * (1 - ease(frame, lineAt(t, 1), 8)) }} />

      {/* line 6: the cliff - the number that is not answered */}
      <div style={{ position: "absolute", left: 380, top: 640, opacity: left }}>
        <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 0.95, color: B.tease, whiteSpace: "nowrap" }}>4,935 m</div>
        {/* two lines: on one line at 34 px it ran to x ~980, under the Shorts buttons */}
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 34, lineHeight: 1.2, letterSpacing: 2, color: B.paper, marginTop: 10, whiteSpace: "nowrap" }}>
          <div>STILL TO GO</div>
          <div>6,000 → 10,935 m</div>
        </div>
      </div>

      {/* credit chip: left edge, under the gauge (y ~1,169-1,216) - from x 380 the longer credits ran past x 940 */}
      <div style={{ opacity: plateOn }}>
        <CreditChip source={STOPS_BY_LINE[Math.min(cur, 5)].credit} left={40} bottom={1920 - 1216} />
      </div>

      {/* burned-in caption: the spoken line */}
      {t.lines.map((l, i) => {
        const on = ease(frame, l.at, 8) * (i + 1 < n ? 1 - ease(frame, lineAt(t, i + 1), 6) : 1);
        return on > 0 ? <Caption key={i} text={l.text} opacity={on * (1 - end)} /> : null;
      })}

      {/* line 7: end card */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: end, background: B.ink }}>
        <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 0.95, color: B.paper, whiteSpace: "nowrap" }}>OFF THE</div>
        <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 0.95, color: B.gauge, whiteSpace: "nowrap" }}>SCALE</div>
        <div style={{ marginTop: 50, fontFamily: F.ui, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: B.gauge }}>EVERY LEVEL OF THE OCEAN</div>
        <div style={{ marginTop: 16, fontFamily: F.caption, fontWeight: 600, fontSize: 52, color: B.paper, textAlign: "center", whiteSpace: "nowrap" }}>all 12 levels · to the very bottom</div>
        <div style={{ marginTop: 40, fontFamily: F.caption, fontWeight: 600, fontSize: 64, color: B.gauge }}>full video linked below</div>
        <svg width={120} height={140} viewBox="0 0 120 140" style={{ marginTop: 10 }}><path d="M60 10 V118 M18 78 L60 124 L102 78" stroke={B.gauge} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div style={{ marginTop: 60, fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: B.mute }}>@OFFTHESCALETV</div>
      </div>
    </AbsoluteFill>
  );
};

export const ShortS01: React.FC = () => (
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
