import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip, DiverSilhouette, Gauge, GaugeStop } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt, within } from "../../lib/timeline";
import { ease } from "../../lib/ui";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S05 - "two hours on one breath" (episodes/S05-ocean-whale). Cliffhanger for L01 level 7 (8:15):
 * Cuvier's beaked whale holds the longest (137.5 min) and the deepest (2,992 m) mammal dives - how
 * does it survive? (Not answered: the lungs only flash and get a "?".)
 * Vertical 1080x1920; everything important in x 70-930 and above y 1,600 (Shorts UI).
 * Lines: 0 137 minutes · 1 two records · 2 not the sperm whale · 3 Cuvier's, 2,992 m · 4 vs the 332 m
 * scuba record, 9x · 5 ~300x pressure · 6 its lungs? · 7 end card.
 * The only whale photo is `beaked-whale` (USGS, near the surface, from the air - not the tagged whale);
 * the sperm whale, the diver and the lungs are drawn. In the L01 plate frame the whale sits at about
 * (870,380)-(1095,825) of 1920x1080, which here (cover, 1080x1180) is roughly x 490-690, y 415-900:
 * cards on that plate stay above y 400 or below y 910 so no label sits on the animal unless it names it.
 * This gauge is LINEAR (0-3,000 m over 85 % of the track) so the 9x comparison on line 4 can be drawn
 * to the gauge's own scale.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const W = 1080;
const PLATE_H = 1180;
const G_TOP = 250;
const G_H = 860; // track ends at y 1,110, clear of a two-line credit chip
const posOf = (m: number) => (Math.min(3000, m) / 3000) * 0.85;
const yOf = (m: number) => G_TOP + posOf(m) * G_H;

const cue = (t: SceneTiming, i: number, word: string) => {
  const text = t.lines[i].text;
  const k = text.indexOf(word);
  if (k < 0) throw new Error(`S05 cue: "${word}" is not in line ${i}`);
  return within(t, i, k / text.length);
};

/**
 * Burned-in captions, at most 2 lines at 60 px: each line is cut into chunks of <= ~42 characters -
 * whole sentences where they fit, long sentences into balanced parts (no one-word orphans) - and each
 * chunk is timed by where its first character sits in the line.
 */
const chunks = (text: string, max = 42) => {
  const parts: string[] = [];
  let buf = "";
  const flush = () => {
    if (buf) parts.push(buf);
    buf = "";
  };
  for (const s of text.split(/(?<=[.?!])\s+/)) {
    if (s.length > max) {
      flush();
      const k = Math.ceil(s.length / max);
      const target = s.length / k;
      let cur = "";
      let made = 0;
      for (const w of s.replace(/ —/g, "\u00a0—").split(" ")) {
        const next = cur ? `${cur} ${w}` : w;
        if (cur && made < k - 1 && (next.length > max || Math.abs(cur.length - target) < Math.abs(next.length - target))) {
          parts.push(cur);
          cur = w;
          made++;
        } else cur = next;
      }
      buf = cur; // the tail may share a caption with a short next sentence
    } else if (buf && `${buf} ${s}`.length <= max) buf = `${buf} ${s}`;
    else {
      flush();
      buf = s;
    }
  }
  flush();
  let at = 0;
  return parts.map((p) => {
    const c = { text: p.replace(/\u00a0/g, " "), from: at / text.length };
    at += p.length + 1;
    return c;
  });
};

const Caption: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => (
  <div style={{ position: "absolute", left: 70, width: 860, top: 1250, height: 330, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", opacity }}>
    <div style={{ fontFamily: F.caption, fontWeight: 600, fontSize: 60, lineHeight: 1.12, textWrap: "balance", color: B.paper, textShadow: "0 3px 0 #0B1B2B, 0 0 18px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.8)" }}>{text}</div>
  </div>
);

const Chip: React.FC<{ source: string; kind: "real" | "illustration"; opacity: number }> = ({ source, kind, opacity }) => (
  <div style={{ position: "absolute", left: 70, width: 860, top: 0, height: 1216, opacity }}>
    <CreditChip source={source} kind={kind} left={0} bottom={0} />
  </div>
);

/** a drawn beaked whale, side view, beak to the left */
const BEAKED = "M10 70 C 20 52, 60 42, 92 44 L 112 40 C 200 32, 300 42, 350 62 L 392 40 L 380 70 L 392 100 L 350 78 C 300 100, 200 108, 112 100 C 60 96, 20 88, 10 70 Z";
const SPERM = "M10 40 L 150 30 C 180 28, 200 40, 212 56 C 260 70, 320 70, 360 64 L 394 40 L 384 70 L 394 102 L 356 82 C 300 98, 200 102, 140 98 L 22 92 C 8 82, 6 52, 10 40 Z";

const Card: React.FC<{ label: string; value: string; x: number; y: number; opacity: number; slide: number }> = ({ label, value, x, y, opacity, slide }) => (
  <div style={{ position: "absolute", left: x + 60 * (1 - slide), top: y, opacity, padding: "8px 22px 10px", borderRadius: 16, background: B.gauge, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.6)" }}>
    <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: 1.5, whiteSpace: "nowrap" }}>{label}</div>
    <div style={{ fontFamily: F.headline, fontSize: 60, lineHeight: 1, whiteSpace: "nowrap" }}>{value}</div>
  </div>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const n = t.lines.length;
  const L = (i: number) => lineAt(t, i);
  const win = (a: number, b: number, fin = 10, fout = 8) => ease(frame, a, fin) * (1 - ease(frame, b, fout));
  const endAt = L(7);
  const end = ease(frame, endAt, 12);

  const squidAt = cue(t, 2, "more than two kilometres");
  const trackAt = cue(t, 3, "tracked one to");
  const recordAt = cue(t, 3, "two thousand nine hundred");
  const scubaAt = cue(t, 4, "three hundred and thirty-two");
  const nineAt = cue(t, 4, "nine times deeper");
  const depth = 2130 * ease(frame, squidAt, 40) + (2992 - 2130) * ease(frame, trackAt, Math.max(20, recordAt - trackAt + 10));
  const stops: GaugeStop[] = [
    { at: 0, label: "0 m" },
    ...(frame >= scubaAt ? [{ at: posOf(332), label: "332 m" }] : []),
  ];

  const zoom = (from: number, to: number) => 1.02 + 0.07 * Math.min(1, Math.max(0, (frame - from) / Math.max(1, to - from)));
  const whalePlate = (a: number, b: number, max: number, key: string) => {
    const on = win(a, b, a === 0 ? 1 : 12, 12) * max;
    if (on <= 0) return null;
    return <Img key={key} src={staticFile("assets/beaked-whale.jpg")} style={{ position: "absolute", top: 0, left: 0, width: W, height: PLATE_H, objectFit: "cover", opacity: on, transform: `scale(${zoom(a, b)})`, filter: "brightness(1.25)" }} />;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {whalePlate(0, L(2), 1, "w0")}
      {whalePlate(L(3), L(4), 1, "w3")}
      {whalePlate(L(5), L(6), 0.2, "w5")}
      <div style={{ position: "absolute", top: PLATE_H - 300, left: 0, right: 0, height: 300, background: `linear-gradient(transparent, ${B.ink})` }} />
      <div style={{ position: "absolute", top: PLATE_H, left: 0, right: 0, bottom: 0, background: B.ink }} />

      {/* series pill */}
      <div style={{ position: "absolute", top: 90, left: 70, padding: "12px 26px", borderRadius: 999, background: B.gauge, color: B.ink, fontFamily: F.ui, fontWeight: 800, fontSize: 32, letterSpacing: 1, opacity: 1 - end }}>EVERY LEVEL OF THE OCEAN</div>

      {/* the gauge: at the surface while the breath is taken */}
      <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - end }}>
        <Gauge x={30} top={G_TOP} height={G_H} stops={stops} position={posOf(depth)} reading={`${Math.round(depth).toLocaleString("en-US")} m`} />
      </div>

      {/* line 0: the count to 137 minutes, and a running stopwatch (drawn) */}
      {(() => {
        const on = win(0, L(1), 1, 8);
        const minutesAt = cue(t, 0, "minutes");
        const count = Math.round(137 * ease(frame, 1, Math.max(12, minutesAt)));
        return (
          <div style={{ position: "absolute", left: 380, top: 180, opacity: on }}>
            <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 1, color: B.paper, whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>{count} min</div>
            <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 36, letterSpacing: 2, color: B.gauge, whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,0.9)", opacity: ease(frame, cue(t, 0, "On a single"), 8) }}>ON A SINGLE BREATH</div>
          </div>
        );
      })()}
      {(() => {
        const on = win(0, L(2), 1, 10);
        if (on <= 0) return null;
        const a = (frame / 30) * Math.PI; // one sweep every two seconds
        return (
          <svg width={220} height={240} viewBox="0 0 220 240" style={{ position: "absolute", left: 650, top: 920, opacity: on }}>
            <rect x={95} y={0} width={30} height={22} rx={6} fill={B.paper} />
            <circle cx={110} cy={130} r={100} fill="rgba(11,27,43,0.75)" stroke={B.paper} strokeWidth={10} />
            <line x1={110} y1={130} x2={110 + 78 * Math.sin(a)} y2={130 - 78 * Math.cos(a)} stroke={B.gauge} strokeWidth={8} strokeLinecap="round" />
            <circle cx={110} cy={130} r={10} fill={B.gauge} />
          </svg>
        );
      })()}

      {/* line 1: two records, one species - the depth is withheld for a line */}
      {(() => {
        const on = win(L(1), L(2), 10, 10);
        if (on <= 0) return null;
        const a = cue(t, 1, "longest");
        const b = cue(t, 1, "the deepest");
        return (
          <>
            <Card label="LONGEST MAMMAL DIVE" value="137.5 min" x={380} y={180} opacity={on * ease(frame, a, 8)} slide={ease(frame, a, 12)} />
            <Card label="DEEPEST MAMMAL DIVE" value="?" x={380} y={300} opacity={on * ease(frame, b, 8)} slide={ease(frame, b, 12)} />
          </>
        );
      })()}

      {/* line 2: the sperm whale (drawn) dives past 2 km - and is not the record */}
      {(() => {
        const on = win(L(2), L(3), 12, 10);
        if (on <= 0) return null;
        const y = 300 + (yOf(2130) - 190 - 300) * ease(frame, squidAt, 40);
        const loses = ease(frame, cue(t, 2, "still loses"), 8);
        return (
          <>
            <svg width={480} height={170} viewBox="0 0 400 140" style={{ position: "absolute", left: 400, top: y, opacity: on, transform: `rotate(${6 * (1 - ease(frame, squidAt + 40, 20))}deg)` }}>
              <path d={SPERM} fill="#6F8496" />
            </svg>
            <div style={{ position: "absolute", left: 440, top: y - 50, fontFamily: F.ui, fontWeight: 800, fontSize: 34, letterSpacing: 1.5, color: B.paper, whiteSpace: "nowrap", opacity: on }}>SPERM WHALE</div>
            <div style={{ position: "absolute", left: 340, top: yOf(2130) - 2, width: 570, height: 0, borderTop: `4px dashed ${B.paper}`, opacity: on * ease(frame, cue(t, 2, "giant squid"), 8) }} />
            <div style={{ position: "absolute", left: 400, top: yOf(2130) + 14, fontFamily: F.ui, fontWeight: 800, fontSize: 32, letterSpacing: 1.5, color: B.paper, whiteSpace: "nowrap", opacity: on * ease(frame, cue(t, 2, "giant squid"), 8) }}>&gt; 2 km · GIANT SQUID</div>
            <svg width={200} height={200} viewBox="0 0 100 100" style={{ position: "absolute", left: 540, top: y - 20, opacity: on * loses }}>
              <path d="M15 15 L85 85 M85 15 L15 85" stroke={B.tease} strokeWidth={14} strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", left: 400, top: 230, fontFamily: F.headline, fontSize: 84, color: B.tease, whiteSpace: "nowrap", opacity: on * loses }}>NOT THE RECORD</div>
          </>
        );
      })()}

      {/* line 3: the real whale (photo) and its record */}
      <div style={{ position: "absolute", left: 380, top: 180, opacity: win(L(3), L(4), 10, 10) }}>
        <div style={{ fontFamily: F.headline, fontSize: 96, lineHeight: 0.98, color: B.paper, whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.85)" }}>CUVIER'S</div>
        <div style={{ fontFamily: F.headline, fontSize: 96, lineHeight: 0.98, color: B.gauge, whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,0.85)" }}>BEAKED WHALE</div>
      </div>
      <div style={{ position: "absolute", left: 380, top: 925, opacity: win(recordAt, L(4), 8, 10) }}>
        <div style={{ display: "inline-block", padding: "8px 22px 12px", borderRadius: 16, background: B.gauge, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.6)" }}>
          <div style={{ fontFamily: F.headline, fontSize: 90, lineHeight: 1, whiteSpace: "nowrap" }}>2,992 m</div>
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: 1.5, whiteSpace: "nowrap", marginTop: 4 }}>DEEPEST MAMMAL DIVE</div><div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: 1.5, whiteSpace: "nowrap" }}>OFF CALIFORNIA</div>
        </div>
      </div>

      {/* line 4: the scuba record vs the whale, drawn to the gauge's own scale - nine 332 m blocks */}
      {(() => {
        const on = win(L(4), L(5), 12, 10);
        if (on <= 0) return null;
        const blockH = yOf(332) - yOf(0);
        const shown = Math.min(9, Math.floor(9 * ease(frame, nineAt, 30) + (frame >= nineAt ? 1 : 0)));
        return (
          <>
            <div style={{ position: "absolute", left: 340, top: G_TOP - 3, width: 560, height: 6, background: "rgba(255,255,255,0.5)", opacity: on }} />
            <div style={{ position: "absolute", left: 400, top: G_TOP, width: 90, height: blockH, borderRadius: 6, background: B.aqua, opacity: on * ease(frame, scubaAt, 10) }} />
            <DiverSilhouette size={80} color={B.paper} style={{ position: "absolute", left: 405, top: yOf(332) + 6, opacity: on * ease(frame, L(4), 10) }} />
            <div style={{ position: "absolute", left: 500, top: yOf(332) - 30, fontFamily: F.ui, fontWeight: 800, fontSize: 36, color: B.aqua, whiteSpace: "nowrap", opacity: on * ease(frame, scubaAt, 10) }}>332 m</div>
            <div style={{ position: "absolute", left: 760, top: G_TOP, width: 120, height: 9 * blockH, borderRadius: 6, background: "rgba(255,200,61,0.14)", opacity: on }} />
            {Array.from({ length: 9 }, (_, k) => (
              <div key={k} style={{ position: "absolute", left: 760, top: G_TOP + k * blockH + 2, width: 120, height: blockH - 4, borderRadius: 6, background: B.gauge, opacity: on * (k < shown ? 1 : 0) }} />
            ))}
            <svg width={200} height={70} viewBox="0 0 400 140" style={{ position: "absolute", left: 720, top: yOf(2992) + 8, opacity: on }}>
              <path d={BEAKED} fill={B.paper} />
            </svg>
            <div style={{ position: "absolute", left: 430, top: 560, opacity: on * ease(frame, nineAt, 10) }}>
              <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 130, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap" }}>9×</div>
              <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 44, letterSpacing: 2, color: B.paper, whiteSpace: "nowrap" }}>DEEPER</div>
            </div>
          </>
        );
      })()}

      {/* line 5: the pressure, and "you, now" at the surface for comparison */}
      {(() => {
        const on = win(L(5), L(6), 10, 10);
        if (on <= 0) return null;
        const big = ease(frame, cue(t, 5, "three hundred times"), 10);
        const you = ease(frame, cue(t, 5, "you're feeling"), 10);
        const squeeze = 1 + 0.025 * Math.sin(frame / 4);
        return (
          <>
            <DiverSilhouette size={70} color={B.paper} style={{ position: "absolute", left: 345, top: G_TOP - 35, opacity: on * you }} />
            <div style={{ position: "absolute", left: 425, top: G_TOP - 22, fontFamily: F.ui, fontWeight: 800, fontSize: 32, letterSpacing: 1.5, color: B.paper, whiteSpace: "nowrap", opacity: on * you }}>YOU, NOW: 1×</div>
            <div style={{ position: "absolute", left: 380, top: 420, opacity: on * big, transform: `scale(${squeeze})`, transformOrigin: "left center" }}>
              <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 120, lineHeight: 1, color: B.tease, whiteSpace: "nowrap" }}>≈ 300×</div>
              <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 44, letterSpacing: 2, color: B.paper, whiteSpace: "nowrap" }}>SURFACE PRESSURE</div>
            </div>
          </>
        );
      })()}

      {/* line 6: the lungs (drawn) - they flash, then a "?" (what happens is the long video's reveal) */}
      {(() => {
        const on = win(L(6), endAt, 12, 10);
        if (on <= 0) return null;
        const lungs = ease(frame, cue(t, 6, "its own lungs"), 8);
        const flash = lungs * (0.55 + 0.45 * Math.sin(frame / 3));
        const q = ease(frame, cue(t, 6, "catastrophe"), 8);
        const drift = Math.sin(frame / 18) * 10;
        return (
          <>
            <svg width={540} height={190} viewBox="0 0 400 140" style={{ position: "absolute", left: 375, top: 420 + drift, opacity: on }}>
              <path d={BEAKED} fill="rgba(140,160,179,0.18)" stroke={B.paper} strokeWidth={3} />
              {[130, 150, 170, 190, 210, 230].map((rx) => (
                <path key={rx} d={`M${rx} 44 Q ${rx + 10} 72 ${rx} 98`} stroke="rgba(255,255,255,0.45)" strokeWidth={3} fill="none" />
              ))}
              <ellipse cx={170} cy={64} rx={42} ry={15} fill={`rgba(255,90,79,${0.25 + 0.75 * flash})`} />
              <ellipse cx={176} cy={82} rx={40} ry={13} fill={`rgba(255,90,79,${0.25 + 0.75 * flash})`} />
            </svg>
            <div style={{ position: "absolute", left: 560, top: 640 + drift, fontFamily: F.ui, fontWeight: 800, fontSize: 36, letterSpacing: 2, color: B.tease, whiteSpace: "nowrap", opacity: on * lungs }}>LUNGS</div>
            <div style={{ position: "absolute", left: 560, top: 230 + drift, fontFamily: F.headline, fontSize: 200, lineHeight: 1, color: B.gauge, opacity: on * q }}>?</div>
            <div style={{ position: "absolute", left: 380, top: 760, fontFamily: F.headline, fontSize: 88, lineHeight: 1, color: B.paper, whiteSpace: "nowrap", opacity: on * ease(frame, L(6), 10) }}>HOW?</div>
          </>
        );
      })()}

      {/* credit chips: what each picture really is */}
      <Chip kind="real" source="USGS · a Cuvier's beaked whale near the surface, from the air" opacity={win(0, L(2), 1, 8)} />
      <Chip kind="illustration" source="drawn" opacity={win(L(2), L(3), 8, 8)} />
      <Chip kind="real" source="USGS · a Cuvier's beaked whale near the surface, from the air (not the tagged whale)" opacity={win(L(3), L(4), 8, 8)} />
      <Chip kind="illustration" source="drawn" opacity={win(L(4), L(5), 8, 8)} />
      <Chip kind="illustration" source="drawn over a faint USGS photo (a Cuvier's beaked whale near the surface)" opacity={win(L(5), L(6), 8, 8)} />
      <Chip kind="illustration" source="drawn" opacity={win(L(6), endAt, 8, 8)} />

      {/* burned-in captions, at most two lines at a time */}
      {t.lines.map((l, i) => {
        if (i === n - 1) return null;
        const next = lineAt(t, i + 1);
        return chunks(l.text).map((c, k, all) => {
          const from = within(t, i, c.from);
          const to = k + 1 < all.length ? within(t, i, all[k + 1].from) : next;
          const on = ease(frame, from, 6) * (1 - ease(frame, to, 5));
          return on > 0 ? <Caption key={`${i}-${k}`} text={c.text} opacity={on} /> : null;
        });
      })}

      {/* line 7: end card */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: end, background: B.ink }}>
        <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 0.95, color: B.paper, whiteSpace: "nowrap" }}>OFF THE</div>
        <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 0.95, color: B.gauge, whiteSpace: "nowrap" }}>SCALE</div>
        <div style={{ marginTop: 50, fontFamily: F.ui, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: B.gauge }}>EVERY LEVEL OF THE OCEAN</div>
        <div style={{ marginTop: 16, fontFamily: F.caption, fontWeight: 600, fontSize: 56, color: B.paper, textAlign: "center", whiteSpace: "nowrap" }}>the answer: level 7</div>
        <div style={{ marginTop: 4, fontFamily: F.caption, fontWeight: 600, fontSize: 56, color: B.paper, textAlign: "center", whiteSpace: "nowrap" }}>the deepest breath</div>
        <div style={{ marginTop: 40, fontFamily: F.caption, fontWeight: 600, fontSize: 64, color: B.gauge }}>full video on the channel</div>
        <svg width={120} height={140} viewBox="0 0 120 140" style={{ marginTop: 10 + 10 * Math.sin(frame / 6) }}>
          <path d="M60 10 V118 M18 78 L60 124 L102 78" stroke={B.gauge} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ marginTop: 50, fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: B.mute }}>@OFFTHESCALETV</div>
      </div>
    </AbsoluteFill>
  );
};

export const ShortS05: React.FC = () => (
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
