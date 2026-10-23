import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt, within } from "../../lib/timeline";
import { ease } from "../../lib/ui";
import { Iceberg } from "../L04-internet-levels/iceberg";
import { MYTH_LINE } from "../L04-internet-levels/ladder";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S02 - the second Short: the internet iceberg, three real levels, the myth line, and a cliff
 * ("there is something under the dark web") that L04 answers (episodes/S02-internet-myth).
 * Vertical 1080x1920. The berg stands top-left, cards under it, captions in the band x 70-930,
 * y 1,200-1,580; nothing runs past x = 940 (the Shorts buttons) or into the bottom 300 px.
 * Lines: 0 the picture · 1 surface · 2 deep · 3 dark · 4 the invented names · 5 none exist · 6 the cliff · 7 end card.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

// berg geometry (see Iceberg: labels sit 360 px to the left of x)
const BX = 440;
const BTOP = 230;
const BH = 700;
const CX = BX + 300 * 0.62; // berg centre line, as Iceberg computes it

const LEVEL_CARDS: { n: string; name: string; sub: string }[] = [
  { n: "1", name: "THE SURFACE WEB", sub: "what a search engine can find" },
  { n: "2", name: "THE DEEP WEB", sub: "behind a login · your inbox, your bank" },
  { n: "3", name: "THE DARK WEB", sub: "≥ 3 relays · U.S. Naval Research Lab, 1995" },
];
/**
 * The invented names, stacked inside the berg under the myth line. The berg is only ~200 px wide there
 * (and narrowing), so the two long names are set on two lines - on one line at 28 px "MARIANAS WEB"
 * (~250 px) and "PRIMARCH SYSTEM" (~310 px) ran through the outline. `at` = how far through line 4
 * ("Below that, the picture says: Marianas Web. The Fog. The Primarch System.") each name is spoken -
 * estimated from the sentence (the lead-in is about a third of the line), NOT measured: check it
 * against the audio.
 */
const GHOSTS: { rows: string[]; dy: number; at: number }[] = [
  { rows: ["MARIANAS", "WEB"], dy: 16, at: 0.34 },
  { rows: ["THE FOG"], dy: 86, at: 0.58 },
  { rows: ["PRIMARCH", "SYSTEM"], dy: 129, at: 0.75 },
];
const POS = [0, 0.06, 0.2, 0.36, MYTH_LINE, MYTH_LINE, 0.78, 0.78];
const READ = ["THE TIP", "SURFACE", "DEEP", "DARK", "?", "?", "?", "?"];

// Safe band: x 70-930 (the Shorts buttons own the right edge from ~x 940), y 1,200-1,580 (the chip ends
// at 1,196; the bottom 300 px belong to the Shorts UI). The longest line (line 3, 162 characters) drops
// to 50 px: about 5 balanced lines = 280 px, and even 6 lines (336 px) stay inside the band.
const Caption: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => (
  <div style={{ position: "absolute", left: 70, right: 150, top: 1200, height: 380, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", opacity }}>
    <div style={{ fontFamily: F.caption, fontWeight: 600, fontSize: text.length > 140 ? 50 : text.length > 110 ? 56 : text.length > 80 ? 62 : 70, lineHeight: 1.12, textWrap: "balance", color: B.paper, textShadow: "0 3px 0 #0B1B2B, 0 0 18px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.8)" }}>{text}</div>
  </div>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const n = t.lines.length;
  let cur = 0;
  for (let i = 0; i < n; i++) if (frame >= lineAt(t, i)) cur = i;
  const noneAt = lineAt(t, 5);
  const strikeAt = within(t, 5, 0.3);
  const cliffAt = lineAt(t, 6);
  const seaAt = within(t, 6, 0.55);
  const endAt = lineAt(t, 7);

  // the dot glides to each line's stop
  let pos = 0;
  for (let i = 1; i < 8; i++) pos += (POS[i] - POS[i - 1]) * ease(frame, lineAt(t, i), 30);
  const reading = READ[cur];
  const end = ease(frame, endAt, 12);
  const cliff = ease(frame, cliffAt, 12) * (1 - end);
  const sea = ease(frame, seaAt, 20) * (1 - end);
  const meme = ease(frame, 6, 8) * (1 - ease(frame, lineAt(t, 1), 8)) + ease(frame, noneAt, 8) * (1 - ease(frame, cliffAt, 8));
  const yMyth = BTOP + BH * MYTH_LINE;
  const drawn = ease(frame, 0, 24);

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {/* line 6: the sea floor comes up behind the bottom of the berg */}
      <div style={{ position: "absolute", left: 0, top: 560, width: 1080, height: 620, opacity: sea, overflow: "hidden" }}>
        <Img src={staticFile("assets/swimming-cucumber.png")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${B.ink}, transparent 45%, transparent 75%, ${B.ink})` }} />
      </div>

      {/* series pill */}
      <div style={{ position: "absolute", top: 90, left: 40, padding: "12px 26px", borderRadius: 999, background: B.gauge, color: B.ink, fontFamily: F.ui, fontWeight: 800, fontSize: 32, letterSpacing: 1, opacity: 1 - end }}>EVERY LEVEL OF THE INTERNET</div>

      {/* the berg */}
      <div style={{ opacity: drawn * (1 - end) }}>
        <Iceberg pos={pos} reading={reading} sub={cur >= 4 && cur < 6 ? "the myth line" : cur >= 6 ? "keep going" : undefined} x={BX} top={BTOP} height={BH} labelSize={28} />
      </div>
      {/* MEME stamp across the berg */}
      <div style={{ position: "absolute", left: CX - 120, top: BTOP + BH * 0.2, transform: "rotate(-14deg)", padding: "6px 18px", border: `6px solid ${B.tease}`, borderRadius: 12, color: B.tease, fontFamily: F.headline, fontSize: 64, letterSpacing: 4, opacity: Math.min(1, meme) * (1 - end) }}>MEME</div>

      {/* lines 4-5: the invented names, each appearing as it is spoken, then struck through */}
      {GHOSTS.map((g, i) => {
        const on = ease(frame, within(t, 4, g.at), 8) * (1 - ease(frame, cliffAt, 8)) * (1 - end);
        const strike = ease(frame, strikeAt + i * 8, 8);
        return (
          <div key={g.rows.join(" ")} style={{ position: "absolute", left: CX - 110, top: yMyth + g.dy, width: 220, display: "flex", flexDirection: "column", alignItems: "center", opacity: on, fontFamily: F.ui, fontWeight: 800, fontSize: 26, lineHeight: 1.05, letterSpacing: 2, color: strike > 0.5 ? B.mute : B.tease, textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
            {g.rows.map((row) => (
              // each row is its own box, so the strike bar is sized to that word instead of a fixed 400 px
              <div key={row} style={{ position: "relative", whiteSpace: "nowrap", paddingLeft: 2 }}>
                {row}
                <div style={{ position: "absolute", left: "50%", top: "50%", height: 5, width: `${strike * 106}%`, transform: "translate(-50%, -50%)", background: B.tease, borderRadius: 3 }} />
              </div>
            ))}
          </div>
        );
      })}

      {/* level cards under the berg */}
      {LEVEL_CARDS.map((c, i) => {
        const on = ease(frame, lineAt(t, i + 1), 10) * (1 - ease(frame, lineAt(t, i + 2), 8));
        if (on <= 0) return null;
        return (
          <div key={c.n} style={{ position: "absolute", left: 40, top: 950, display: "flex", alignItems: "center", gap: 20, opacity: on }}>
            <div style={{ width: 96, height: 96, borderRadius: 48, background: B.gauge, color: B.ink, fontFamily: F.headline, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.n}</div>
            <div>
              <div style={{ fontFamily: F.headline, fontSize: 60, lineHeight: 1, color: B.paper, whiteSpace: "nowrap" }}>{c.name}</div>
              <div style={{ marginTop: 8, fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 1, color: B.gauge, whiteSpace: "nowrap" }}>{c.sub}</div>
            </div>
          </div>
        );
      })}
      {/* line 5: the verdict card */}
      <div style={{ position: "absolute", left: 40, top: 950, opacity: ease(frame, noneAt, 10) * (1 - ease(frame, cliffAt, 8)) }}>
        <div style={{ fontFamily: F.headline, fontSize: 84, lineHeight: 1, color: B.tease, whiteSpace: "nowrap" }}>NONE OF THESE EXIST</div>
        <div style={{ marginTop: 8, fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 1, color: B.paper, whiteSpace: "nowrap" }}>iceberg-chart memes · early 2010s · no verifiable layer</div>
      </div>
      {/* line 6: the cliff */}
      <div style={{ position: "absolute", left: 40, top: 950, opacity: cliff }}>
        <div style={{ fontFamily: F.headline, fontSize: 84, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap" }}>BUT THERE IS SOMETHING</div>
        <div style={{ marginTop: 8, fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 1, color: B.paper }}>real · photographed · all the way to the sea floor</div>
      </div>
      {/* one chip. The frame is the drawn berg throughout, so it stays ILLUSTRATION; once the sea-floor
          photo (the swimming sea cucumber, Puerto Rico 2015 - manifest "swimming-cucumber") shows behind
          it, the chip names that photo instead of claiming the frame is real footage. Ends near x 870. */}
      <div style={{ opacity: (1 - end) * drawn }}>
        <CreditChip kind="illustration" source={sea > 0.5 ? "over a NOAA photo of the sea floor (Puerto Rico, 2015)" : undefined} left={40} bottom={1920 - 1196} />
      </div>

      {/* burned-in caption */}
      {t.lines.map((l, i) => {
        const on = ease(frame, l.at, 8) * (i + 1 < n ? 1 - ease(frame, lineAt(t, i + 1), 6) : 1);
        return on > 0 ? <Caption key={i} text={l.text} opacity={on * (1 - end)} /> : null;
      })}

      {/* end card */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: end, background: B.ink }}>
        <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 0.95, color: B.paper, whiteSpace: "nowrap" }}>OFF THE</div>
        <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 0.95, color: B.gauge, whiteSpace: "nowrap" }}>SCALE</div>
        <div style={{ marginTop: 50, fontFamily: F.ui, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: B.gauge }}>EVERY LEVEL OF THE INTERNET</div>
        {/* the Short opens on the meme's "seven or eight levels", so the real count is spelled out: 3 + 4 = L04's seven */}
        <div style={{ marginTop: 16, fontFamily: F.caption, fontWeight: 600, fontSize: 56, lineHeight: 1.15, color: B.paper, textAlign: "center", whiteSpace: "nowrap" }}>
          <div>3 real web levels</div>
          <div>4 more under the myth line</div>
        </div>
        <div style={{ marginTop: 40, fontFamily: F.caption, fontWeight: 600, fontSize: 64, color: B.gauge }}>full video linked below</div>
        <svg width={120} height={140} viewBox="0 0 120 140" style={{ marginTop: 10 }}><path d="M60 10 V118 M18 78 L60 124 L102 78" stroke={B.gauge} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div style={{ marginTop: 60, fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: B.mute }}>@OFFTHESCALETV</div>
      </div>
    </AbsoluteFill>
  );
};

export const ShortS02: React.FC = () => (
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
