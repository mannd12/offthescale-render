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
 * S04 - "the animal that never eats" (episodes/S04-ocean-tubeworm). Cliffhanger for L01 level 6 (6:43):
 * the giant tube worm has no mouth and no gut and lives where sunlight never reaches - so what feeds it?
 * Vertical 1080x1920; everything important in x 70-930 and above y 1,600 (Shorts UI).
 * Lines: 0 "No mouth..." stamps · 1 two metres tall · 2 found 1977, 2.5 km, Galapagos, Alvin · 3 vent
 * water > 700 F · 4 no sunlight, never eats · 5 foot-long clams · 6 what feeds them? · 7 end card.
 * The hook comes first with no gauge: the depth is only shown once it is spoken (line 2).
 * None of the plates is from the 1977 dive; every chip says what the photo really is
 * (episodes/S04-ocean-tubeworm/sources.md). The worm at the 2 m bar and the clam are drawn.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const W = 1080;
const PLATE_H = 1180;
const G_TOP = 250;
const G_H = 860; // track ends at y 1,110, clear of a two-line credit chip
const PLUME = "#D9342B";

/** this Short's gauge: 0 -> 1,000 m (last light) -> 2,500 m (the vents) */
const posOf = (m: number) => (m <= 1000 ? (m / 1000) * 0.4 : 0.4 + ((Math.min(2500, m) - 1000) / 1500) * 0.4);

const cue = (t: SceneTiming, i: number, word: string) => {
  const text = t.lines[i].text;
  const k = text.indexOf(word);
  if (k < 0) throw new Error(`S04 cue: "${word}" is not in line ${i}`);
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

const Stamp: React.FC<{ text: string; x: number; y: number; at: number; until: number; tilt: number; frame: number }> = ({ text, x, y, at, until, tilt, frame }) => {
  const land = ease(frame, at, 7);
  const on = land * (1 - ease(frame, until, 8));
  if (on <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: on, transform: `rotate(${tilt}deg) scale(${1.5 - 0.5 * land})`, transformOrigin: "left center", padding: "6px 28px 10px", border: `8px solid ${B.tease}`, borderRadius: 16, background: "rgba(11,27,43,0.72)", fontFamily: F.headline, fontSize: 120, lineHeight: 1, color: B.paper, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

/** a drawn giant tube worm: white tube, red plume. `h` = height in px */
const DrawnWorm: React.FC<{ x: number; bottom: number; h: number; grow: number; frame: number; opacity: number }> = ({ x, bottom, h, grow, frame, opacity }) => {
  const hh = h * grow;
  const sway = Math.sin(frame / 12) * 4;
  return (
    <svg width={120} height={h + 40} viewBox={`0 0 120 ${h + 40}`} style={{ position: "absolute", left: x, top: bottom - h - 40, opacity, overflow: "visible" }}>
      <rect x={34} y={h + 40 - hh} width={52} height={hh} rx={18} fill="#ECE6D6" stroke="#B7AE98" strokeWidth={3} />
      <ellipse cx={60 + sway} cy={h + 40 - hh} rx={40} ry={34} fill={PLUME} />
    </svg>
  );
};

const Clam: React.FC<{ x: number; y: number; w: number; frame: number; opacity: number }> = ({ x, y, w, frame, opacity }) => {
  const gape = 2 + 2 * Math.sin(frame / 10);
  return (
    <svg width={w} height={w * 0.55} viewBox="0 0 200 110" style={{ position: "absolute", left: x, top: y, opacity, overflow: "visible" }}>
      <path d={`M10 70 Q 100 ${-10 - gape} 190 70 Z`} fill="#E9E1CF" stroke="#8E856F" strokeWidth={3} />
      <path d={`M10 ${72 + gape} Q 100 ${118 + gape} 190 ${72 + gape} Z`} fill="#D8CFBA" stroke="#8E856F" strokeWidth={3} />
      {[50, 80, 110, 140].map((rx) => (
        <path key={rx} d={`M100 66 L ${rx} ${rx === 50 || rx === 140 ? 34 : 18}`} stroke="#A49A82" strokeWidth={2} />
      ))}
    </svg>
  );
};

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const n = t.lines.length;
  const L = (i: number) => lineAt(t, i);
  const win = (a: number, b: number, fin = 10, fout = 8) => ease(frame, a, fin) * (1 - ease(frame, b, fout));
  const endAt = L(7);
  const end = ease(frame, endAt, 12);

  const alvinAt = cue(t, 2, "by the submersible");
  const deepAt = cue(t, 2, "two and a half");
  const lightAt = cue(t, 4, "reached this place");
  const depth = 2500 * ease(frame, deepAt, 40);
  const gaugeOn = ease(frame, deepAt, 10) * (1 - end);
  const stops: GaugeStop[] = [
    { at: 0, label: "0 m" },
    ...(frame >= lightAt ? [{ at: 0.4, label: "1,000 m" }] : []),
    ...(frame >= deepAt + 40 ? [{ at: 0.8, label: "2,500 m" }] : []),
  ];

  const zoom = (from: number, to: number) => 1.03 + 0.08 * Math.min(1, Math.max(0, (frame - from) / Math.max(1, to - from)));
  const plate = (id: string, a: number, b: number, bright: number, key: string) => {
    const on = win(a, b, a === 0 ? 1 : 10, 10);
    if (on <= 0) return null;
    return <Img key={key} src={staticFile(`assets/${id}.jpg`)} style={{ position: "absolute", top: 0, left: 0, width: W, height: PLATE_H, objectFit: "cover", opacity: on, transform: `scale(${zoom(a, b)})`, filter: `brightness(${bright})` }} />;
  };
  const darken = 1 - 0.6 * ease(frame, L(6), 20);

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {plate("riftia", 0, L(1), 0.95, "r0")}
      {plate("tubeworms-juan", L(1), L(2), 0.6, "juan")}
      {plate("riftia", L(2), alvinAt, 0.75, "r2")}
      {plate("alvin-deck", alvinAt, L(3), 0.85, "alvin")}
      {plate("vent-fauna", L(3), L(4), 0.75, "vent")}
      {plate("riftia", L(4), endAt + 12, 0.8 * darken, "r4")}
      <div style={{ position: "absolute", top: PLATE_H - 360, left: 0, right: 0, height: 360, background: `linear-gradient(transparent, ${B.ink})` }} />
      <div style={{ position: "absolute", top: PLATE_H, left: 0, right: 0, bottom: 0, background: B.ink }} />

      {/* series pill */}
      <div style={{ position: "absolute", top: 90, left: 70, padding: "12px 26px", borderRadius: 999, background: B.gauge, color: B.ink, fontFamily: F.ui, fontWeight: 800, fontSize: 32, letterSpacing: 1, opacity: 1 - end }}>EVERY LEVEL OF THE OCEAN</div>

      {/* line 0: one stamp per spoken phrase (on a photo of the animal they describe: adult Riftia) */}
      <Stamp text="NO MOUTH" x={110} y={330} at={cue(t, 0, "No mouth")} until={L(1)} tilt={-4} frame={frame} />
      <Stamp text="NO STOMACH" x={170} y={530} at={cue(t, 0, "No stomach")} until={L(1)} tilt={3} frame={frame} />
      <Stamp text="NO GUT" x={130} y={730} at={cue(t, 0, "No gut")} until={L(1)} tilt={-2} frame={frame} />

      {/* line 1: a drawn worm against a 2 m bar, and a person for scale (the photo's worms are not measured) */}
      {(() => {
        const on = win(L(1), L(2), 10, 10);
        if (on <= 0) return null;
        const grow = ease(frame, cue(t, 1, "stands up"), Math.max(12, cue(t, 1, "tall") - cue(t, 1, "stands up")));
        const top = 1000 - 600 * grow;
        return (
          <>
            <DiverSilhouette size={590} color="rgba(255,255,255,0.8)" style={{ position: "absolute", left: 280, top: 1000 - 590 * 0.93, opacity: on }} />
            <DrawnWorm x={740} bottom={1000} h={600} grow={grow} frame={frame} opacity={on} />
            <div style={{ position: "absolute", left: 876, top, width: 8, height: 1000 - top, background: B.gauge, opacity: on }} />
            <div style={{ position: "absolute", left: 862, top: top - 4, width: 36, height: 8, background: B.gauge, opacity: on }} />
            <div style={{ position: "absolute", left: 862, top: 996, width: 36, height: 8, background: B.gauge, opacity: on }} />
            <div style={{ position: "absolute", left: 700, top: 290, width: 200, textAlign: "right", fontFamily: F.ui, fontWeight: 800, fontSize: 52, color: B.gauge, textShadow: "0 2px 10px rgba(0,0,0,0.9)", whiteSpace: "nowrap", opacity: on * ease(frame, cue(t, 1, "two metres"), 8) }}>≈ 2 m</div>
          </>
        );
      })()}

      {/* the gauge: only from the moment the depth is spoken */}
      <div style={{ position: "absolute", left: 0, top: 0, opacity: gaugeOn }}>
        <Gauge x={30} top={G_TOP} height={G_H} stops={stops} position={posOf(depth)} reading={`${Math.round(depth).toLocaleString("en-US")} m`} />
      </div>

      {/* line 2: the discovery card, built word by word */}
      {(() => {
        const on = win(cue(t, 2, "1977"), L(3), 8, 10);
        if (on <= 0) return null;
        const row = (at: number, text: string, size: number, color: string = B.paper) => (
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: size, letterSpacing: 1.5, color, textShadow: "0 2px 10px rgba(0,0,0,0.9)", whiteSpace: "nowrap", opacity: ease(frame, at, 8), marginTop: 8 }}>{text}</div>
        );
        return (
          <div style={{ position: "absolute", left: 380, top: 220, opacity: on }}>
            <div style={{ display: "inline-block", padding: "8px 24px 12px", borderRadius: 18, background: B.gauge, color: B.ink, fontFamily: F.headline, fontSize: 110, lineHeight: 1, boxShadow: "0 8px 28px rgba(0,0,0,0.6)" }}>FEB 1977</div>
            {row(deepAt, "≈ 2,500 m DOWN", 44, B.gauge)}
            {row(cue(t, 2, "Galápagos"), "GALÁPAGOS RIFT", 44)}
            {row(alvinAt, "SUBMERSIBLE ALVIN", 44)}
          </div>
        );
      })()}
      <div style={{ position: "absolute", left: 380, top: 640, padding: "8px 18px", borderRadius: 10, background: B.tease, color: B.paper, fontFamily: F.ui, fontWeight: 800, fontSize: 34, letterSpacing: 1.5, whiteSpace: "nowrap", opacity: win(alvinAt, L(3), 6, 10) }}>THIS PHOTO: 1971</div>

      {/* line 3: the vent - a crack in the sea floor, water out of the rock at > 700 F */}
      <div style={{ position: "absolute", left: 380, top: 220, fontFamily: F.ui, fontWeight: 800, fontSize: 44, lineHeight: 1.15, letterSpacing: 1.5, color: B.paper, textShadow: "0 2px 10px rgba(0,0,0,0.9)", whiteSpace: "nowrap", opacity: win(L(3), L(4), 10, 10) }}><div>A CRACK IN</div><div>THE SEA FLOOR</div></div>
      {(() => {
        const on = win(cue(t, 3, "comes out"), L(4), 10, 10);
        if (on <= 0) return null;
        const rise = ease(frame, cue(t, 3, "comes out"), 50);
        return Array.from({ length: 4 }, (_, k) => {
          const x = 500 + k * 34 + Math.sin(frame / 6 + k) * 14;
          const top = 1180 - 640 * rise;
          return <div key={k} style={{ position: "absolute", left: x, top, width: 18, height: 1180 - top, borderRadius: 9, background: "linear-gradient(rgba(255,255,255,0), rgba(255,235,200,0.35))", opacity: on }} />;
        });
      })()}
      {(() => {
        const on = win(L(3), L(4), 10, 10);
        if (on <= 0) return null;
        const hotAt = cue(t, 3, "seven hundred");
        const fill = ease(frame, cue(t, 3, "comes out"), Math.max(12, hotAt - cue(t, 3, "comes out")));
        return (
          <>
            <div style={{ position: "absolute", left: 820, top: 320, width: 46, height: 560, borderRadius: 23, background: "rgba(255,255,255,0.18)", border: "4px solid rgba(255,255,255,0.8)", opacity: on }} />
            <div style={{ position: "absolute", left: 832, top: 880 - 540 * fill, width: 30, height: 540 * fill, borderRadius: 15, background: B.tease, opacity: on }} />
            <div style={{ position: "absolute", left: 806, top: 860, width: 74, height: 74, borderRadius: 37, background: B.tease, border: "4px solid rgba(255,255,255,0.8)", opacity: on }} />
            <div style={{ position: "absolute", left: 380, top: 380, opacity: on * ease(frame, hotAt, 8) }}>
              <div style={{ fontFamily: F.headline, fontSize: 120, lineHeight: 1, color: B.tease, whiteSpace: "nowrap", textShadow: "0 4px 18px rgba(0,0,0,0.8)" }}>&gt; 700 °F</div>
              <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 40, color: B.paper, marginTop: 6, whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>≈ 370 °C</div>
            </div>
          </>
        );
      })()}

      {/* line 4 (and 6 on "the Sun"): sunlight stops far above the vents */}
      {(() => {
        const on = Math.max(win(L(4), cue(t, 4, "And a grown"), 10, 12), win(cue(t, 6, "the Sun"), endAt, 10, 8));
        if (on <= 0) return null;
        const lineY = G_TOP + 0.4 * G_H;
        const drop = Math.max(ease(frame, L(4), Math.max(15, lightAt - L(4))), frame >= L(6) ? 1 : 0);
        return (
          <>
            <div style={{ position: "absolute", left: 800, top: 170, width: 24, height: (lineY - 200) * drop, background: `linear-gradient(rgba(255,200,61,0.2), ${B.gauge})`, opacity: on }} />
            <div style={{ position: "absolute", left: 784, top: 170 + (lineY - 200) * drop - 4, width: 0, height: 0, borderLeft: "28px solid transparent", borderRight: "28px solid transparent", borderTop: `34px solid ${B.gauge}`, opacity: on }} />
            <div style={{ position: "absolute", left: 340, top: lineY - 2, width: 590, height: 0, borderTop: `5px dashed ${B.gauge}`, opacity: on * ease(frame, lightAt, 8) }} />
            <div style={{ position: "absolute", left: 380, top: lineY + 16, fontFamily: F.ui, fontWeight: 800, fontSize: 32, letterSpacing: 1.5, color: B.gauge, textShadow: "0 2px 10px rgba(0,0,0,0.9)", whiteSpace: "nowrap", opacity: on * ease(frame, lightAt, 8) }}>LAST LIGHT ≈ 1,000 m</div>
          </>
        );
      })()}
      <div style={{ position: "absolute", left: 380, top: 690, opacity: win(cue(t, 4, "never eats"), L(5), 8, 10) }}>
        <div style={{ fontFamily: F.headline, fontSize: 88, lineHeight: 1, color: B.paper, whiteSpace: "nowrap", textShadow: "0 4px 18px rgba(0,0,0,0.85)" }}>A GROWN WORM</div>
        <div style={{ fontFamily: F.headline, fontSize: 88, lineHeight: 1, color: B.tease, whiteSpace: "nowrap", textShadow: "0 4px 18px rgba(0,0,0,0.85)" }}>NEVER EATS</div>
      </div>

      {/* line 5: the drawn foot-long clam slides in (the photo has none) */}
      <div style={{ position: "absolute", left: 380, top: 220, fontFamily: F.ui, fontWeight: 800, fontSize: 44, letterSpacing: 1.5, color: B.paper, textShadow: "0 2px 10px rgba(0,0,0,0.9)", whiteSpace: "nowrap", opacity: win(L(5), L(6), 10, 10) }}>IT WASN'T ALONE</div>
      {(() => {
        const on = win(cue(t, 5, "The same"), L(6), 10, 10);
        if (on <= 0) return null;
        const slide = ease(frame, cue(t, 5, "The same"), 24);
        const x = 470 + 420 * (1 - slide);
        const ruler = ease(frame, cue(t, 5, "a foot long"), 10);
        return (
          <>
            <Clam x={x} y={880} w={330} frame={frame} opacity={on} />
            <div style={{ position: "absolute", left: 470, top: 846, width: 330 * ruler, height: 6, background: B.gauge, opacity: on }} />
            <div style={{ position: "absolute", left: 467, top: 832, width: 6, height: 34, background: B.gauge, opacity: on * ruler }} />
            <div style={{ position: "absolute", left: 797, top: 832, width: 6, height: 34, background: B.gauge, opacity: on * ruler }} />
            <div style={{ position: "absolute", left: 470, top: 770, width: 330, textAlign: "center", fontFamily: F.ui, fontWeight: 800, fontSize: 40, color: B.gauge, textShadow: "0 2px 10px rgba(0,0,0,0.9)", whiteSpace: "nowrap", opacity: on * ruler }}>≈ 30 cm (1 ft)</div>
          </>
        );
      })()}

      {/* line 6: the question */}
      <div style={{ position: "absolute", left: 470, top: 300, fontFamily: F.headline, fontSize: 320, lineHeight: 1, color: B.gauge, opacity: win(L(6), endAt, 12, 10) * (0.6 + 0.4 * Math.sin(frame / 5)), textShadow: "0 0 40px rgba(255,200,61,0.5)" }}>?</div>
      <div style={{ position: "absolute", left: 380, top: 790, fontFamily: F.headline, fontSize: 100, lineHeight: 1, color: B.paper, whiteSpace: "nowrap", textShadow: "0 4px 18px rgba(0,0,0,0.85)", opacity: win(cue(t, 6, "what is feeding"), endAt, 8, 10) }}><div>WHAT FEEDS</div><div>THEM?</div></div>

      {/* credit chips: what each photo really is */}
      <Chip kind="real" source="NOAA Ocean Exploration · Riftia tube worms, Galápagos Rift, 2011" opacity={win(0, L(1), 1, 8)} />
      <Chip kind="illustration" source="drawn worm, person + scale bar over a NOAA photo (tube worms, Juan de Fuca Ridge)" opacity={win(L(1), L(2), 8, 8)} />
      <Chip kind="real" source="NOAA Ocean Exploration · Riftia, Galápagos Rift, 2011 (not the 1977 dive)" opacity={win(L(2), alvinAt, 8, 8)} />
      <Chip kind="real" source="NOAA Photo Library · Alvin aboard Lulu, 1971" opacity={win(alvinAt, L(3), 8, 8)} />
      <Chip kind="illustration" source="thermometer + shimmer over a NOAA vent photo (NOAA Photo Library)" opacity={win(L(3), L(4), 8, 8)} />
      <Chip kind="real" source="NOAA Ocean Exploration · Riftia, Galápagos Rift, 2011" opacity={win(L(4), L(5), 8, 8)} />
      <Chip kind="illustration" source="drawn clam over a NOAA photo (Riftia, Galápagos Rift, 2011)" opacity={win(L(5), L(6), 8, 8)} />
      <Chip kind="real" source="NOAA Ocean Exploration · Riftia, Galápagos Rift, 2011" opacity={win(L(6), endAt, 8, 8)} />

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
        <div style={{ marginTop: 16, fontFamily: F.caption, fontWeight: 600, fontSize: 56, color: B.paper, textAlign: "center", whiteSpace: "nowrap" }}>the answer: level 6</div>
        <div style={{ marginTop: 4, fontFamily: F.caption, fontWeight: 600, fontSize: 56, color: B.paper, textAlign: "center", whiteSpace: "nowrap" }}>life without the Sun</div>
        <div style={{ marginTop: 40, fontFamily: F.caption, fontWeight: 600, fontSize: 64, color: B.gauge }}>full video linked below</div>
        <svg width={120} height={140} viewBox="0 0 120 140" style={{ marginTop: 10 + 10 * Math.sin(frame / 6) }}>
          <path d="M60 10 V118 M18 78 L60 124 L102 78" stroke={B.gauge} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ marginTop: 50, fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: B.mute }}>@OFFTHESCALETV</div>
      </div>
    </AbsoluteFill>
  );
};

export const ShortS04: React.FC = () => (
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
