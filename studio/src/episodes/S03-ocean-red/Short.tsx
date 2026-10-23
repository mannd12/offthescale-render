import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip, DiverSilhouette, Gauge, GaugeStop } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt, within } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S03 - "the red fish that turns black" (episodes/S03-ocean-red). Cliffhanger for L01 level 5 (5:22):
 * red light is gone by 100 m, so a red fish looks black - then why are so many deep animals red?
 * Vertical 1080x1920. Shorts safe area: everything important in x 70-930 and above y 1,600.
 * Lines: 0 hook (red fish turns black) · 1 water swallows red · 2 same fish, two depths · 3 sunlight
 * zone 0-200 m · 4 the deep animals are red · 5 why red? · 6 end card.
 * The hero is a CODE-DRAWN fish (chip: ILLUSTRATION); no plate is ever called red (nobody has checked
 * the colour of any plate's animal - episodes/S03-ocean-red/sources.md). Every cue is keyed to a word
 * in the line (cue()), so the real voice re-syncs it.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const W = 1080;
const PLATE_H = 1180;
const G_TOP = 250;
const G_H = 860; // track ends at y 1,110, clear of a two-line credit chip
const RED = "#D7262B";
const BLACK = "#141414";

/** this Short's own gauge: 0-200 m spread over 80 % of the track, then an unnumbered "deeper" */
const posOf = (m: number, beyond: number) => (Math.min(200, m) / 200) * 0.8 + 0.14 * beyond;

/** frame (scene-relative) at which `word` is spoken in line i - estimated from its place in the text */
const cue = (t: SceneTiming, i: number, word: string) => {
  const text = t.lines[i].text;
  const k = text.indexOf(word);
  if (k < 0) throw new Error(`S03 cue: "${word}" is not in line ${i}`);
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

/** the chip wraps inside x 70-930 and grows upward from y 1,216 */
const Chip: React.FC<{ source: string; kind: "real" | "illustration"; opacity: number }> = ({ source, kind, opacity }) => (
  <div style={{ position: "absolute", left: 70, width: 860, top: 0, height: 1216, opacity }}>
    <CreditChip source={source} kind={kind} left={0} bottom={0} />
  </div>
);

const mix = (a: string, b: string, k: number) => {
  const p = (c: string, i: number) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16);
  const ch = (i: number) => Math.round(lerp(p(a, i), p(b, i), Math.max(0, Math.min(1, k))));
  return `rgb(${ch(0)},${ch(1)},${ch(2)})`;
};

/** the drawn fish (faces left). `color` is its look; `outline` helps a black fish read on dark water */
const Fish: React.FC<{ color: string; outline?: string; x: number; y: number; w: number; frame: number; opacity?: number }> = ({ color, outline = "none", x, y, w, frame, opacity = 1 }) => {
  const tail = Math.sin(frame / 5) * 6;
  return (
    <svg width={w} height={w * 0.55} viewBox="0 0 200 110" style={{ position: "absolute", left: x, top: y, opacity, overflow: "visible" }}>
      <path d={`M152 55 L196 ${22 + tail} L186 55 L196 ${88 + tail} Z`} fill={color} stroke={outline} strokeWidth={2} />
      <path d="M70 24 Q 96 0 124 22 Z" fill={color} stroke={outline} strokeWidth={2} />
      <path d="M18 55 C 48 12, 128 8, 160 52 C 128 100, 48 100, 18 55 Z" fill={color} stroke={outline} strokeWidth={2} />
      <path d="M86 70 Q 100 92 116 72 Z" fill="rgba(0,0,0,0.25)" />
      <circle cx={44} cy={48} r={8} fill="#F4F4F4" />
      <circle cx={42} cy={48} r={4} fill="#0B0B0B" />
    </svg>
  );
};

const SPECTRUM = ["#E5332A", "#F28A1E", "#F5D332", "#3DBA5A", "#2F7FE0"];
/** five colour bands of sunlight; red is the one the water takes. `red` 1 = present, 0 = gone */
const Spectrum: React.FC<{ x: number; y: number; red: number; opacity: number }> = ({ x, y, red, opacity }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 6, opacity }}>
    {SPECTRUM.map((c, i) => (
      <div key={c} style={{ width: 98, height: 44, borderRadius: 10, background: i === 0 ? mix(c, "#2A3440", 1 - red) : c, outline: i === 0 && red < 0.05 ? "3px dashed rgba(255,255,255,0.6)" : "none", outlineOffset: -3 }} />
    ))}
  </div>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const n = t.lines.length;
  const L = (i: number) => lineAt(t, i);
  const win = (a: number, b: number, fin = 10, fout = 8) => ease(frame, a, fin) * (1 - ease(frame, b, fout));
  const endAt = L(6);
  const end = ease(frame, endAt, 12);

  // depth: falling from frame 1 (0 -> 60 m over line 0), then to 100 m by "by a hundred metres"
  const hundredAt = cue(t, 1, "by a hundred metres");
  const depth = 60 * ease(frame, 1, Math.max(20, L(1) - 1)) + 40 * ease(frame, L(1), Math.max(20, hundredAt - L(1)));
  const beyond = ease(frame, cue(t, 4, "Keep going down"), 45);
  const pos = posOf(depth, beyond);
  const pointerY = G_TOP + pos * G_H;
  const redLeft = 1 - Math.min(1, depth / 100); // share of red light still reaching the fish
  const twoHundredAt = cue(t, 3, "two hundred");
  const stops: GaugeStop[] = [
    { at: 0, label: "0 m" },
    { at: 0.4, label: "100 m" },
    ...(frame >= twoHundredAt ? [{ at: 0.8, label: "200 m" }] : []),
  ];

  // plates
  const sharkOn = win(0, L(2), 1, 12);
  const lancetOn = win(L(3), L(4), 12, 12);
  const zoom = (from: number, to: number) => 1.04 + 0.08 * Math.min(1, Math.max(0, (frame - from) / Math.max(1, to - from)));

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {/* the colour filter that takes the red out of the photo as the gauge falls (chip: ILLUSTRATION) */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="s03-redloss" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={`${0.15 + 0.85 * redLeft} 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0`} />
        </filter>
      </svg>

      {sharkOn > 0 ? (
        <Img src={staticFile("assets/whale-shark.jpg")} style={{ position: "absolute", top: 0, left: 0, width: W, height: PLATE_H, objectFit: "cover", opacity: sharkOn, transform: `scale(${zoom(0, L(2))})`, filter: `url(#s03-redloss) brightness(${1 - 0.35 * (1 - redLeft)})` }} />
      ) : null}
      {lancetOn > 0 ? (
        // no depth is known for this photo - it stays dim and nothing on screen points at the fish
        <Img src={staticFile("assets/lancetfish.jpg")} style={{ position: "absolute", top: 0, left: 0, width: W, height: PLATE_H, objectFit: "cover", opacity: lancetOn, transform: `scale(${zoom(L(3), L(4))})`, filter: "brightness(0.62)" }} />
      ) : null}
      <div style={{ position: "absolute", top: PLATE_H - 360, left: 0, right: 0, height: 360, background: `linear-gradient(transparent, ${B.ink})` }} />
      <div style={{ position: "absolute", top: PLATE_H, left: 0, right: 0, bottom: 0, background: B.ink }} />

      {/* drifting specks for motion on the dark lines 4-5 */}
      {Array.from({ length: 26 }, (_, k) => {
        const on = win(L(4), endAt, 15, 10) * 0.5;
        if (on <= 0) return null;
        const sx = 360 + ((k * 211) % 560);
        const sy = ((k * 337 + frame * (1.2 + (k % 4) * 0.4)) % 1000) + 180;
        return <div key={k} style={{ position: "absolute", left: sx, top: sy, width: 4 + (k % 3), height: 4 + (k % 3), borderRadius: 4, background: B.paper, opacity: on }} />;
      })}

      {/* series pill */}
      <div style={{ position: "absolute", top: 90, left: 70, padding: "12px 26px", borderRadius: 999, background: B.gauge, color: B.ink, fontFamily: F.ui, fontWeight: 800, fontSize: 32, letterSpacing: 1, opacity: 1 - end }}>EVERY LEVEL OF THE OCEAN</div>

      {/* the gauge (left; the Shorts buttons own the right edge) */}
      <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - end }}>
        {/* line 3: the sunlight zone, 0-200 m, as a band beside the track */}
        <div style={{ position: "absolute", left: 340, top: G_TOP, width: 20, height: 0.8 * G_H, borderRadius: 10, background: `linear-gradient(${B.gauge}, rgba(255,200,61,0.35))`, opacity: win(cue(t, 3, "sunlight zone"), L(4), 12, 12) }} />
        <Gauge x={30} top={G_TOP} height={G_H} stops={stops} position={pos} reading={beyond > 0.05 ? "DEEPER" : `${Math.round(depth)} m`} />
      </div>

      {/* line 3: "You're still in the sunlight zone" - a person at the pointer */}
      <DiverSilhouette size={96} color={B.paper} style={{ position: "absolute", left: 372, top: pointerY - 48, opacity: win(cue(t, 3, "You're"), L(4), 10, 10) }} />
      {/* line 3: the zone's floor at 200 m, pulsing on "That runs to two hundred" */}
      <div style={{ position: "absolute", left: 330, top: G_TOP + 0.8 * G_H - 3, width: 580, height: 6, borderRadius: 3, background: B.gauge, opacity: win(cue(t, 3, "That runs"), L(4), 8, 10) * (0.55 + 0.45 * Math.sin(frame / 4)) }} />

      {/* line 0: the hook card */}
      <div style={{ position: "absolute", left: 380, top: 200, opacity: win(0, L(1), 1, 8) }}>
        <div style={{ display: "inline-block", padding: "10px 24px 14px", borderRadius: 18, background: B.gauge, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.6)" }}>
          <div style={{ fontFamily: F.headline, fontSize: 96, lineHeight: 1 }}>100 m</div>
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 30, marginTop: 6, letterSpacing: 1, whiteSpace: "nowrap", opacity: ease(frame, cue(t, 0, "turns black"), 8) }}>RED TURNS BLACK</div>
        </div>
      </div>

      {/* lines 0-1: the drawn fish, sinking as its red goes */}
      <Fish color={mix(RED, BLACK, 1 - redLeft)} outline={redLeft < 0.4 ? "rgba(255,255,255,0.45)" : "none"} x={470} y={470 + depth * 1.1 + Math.sin(frame / 14) * 8} w={400} frame={frame} opacity={win(0, L(2), 1, 10)} />

      {/* line 1: the light, losing its red band first */}
      <div style={{ position: "absolute", left: 380, top: 848, fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 1.5, color: B.paper, textShadow: "0 2px 10px rgba(0,0,0,0.9)", whiteSpace: "nowrap", opacity: win(cue(t, 1, "Water swallows"), L(2)) }}>WATER SWALLOWS RED FIRST</div>
      <Spectrum x={380} y={900} red={frame >= hundredAt ? 0 : redLeft} opacity={win(L(1), L(2), 12, 8)} />
      <div style={{ position: "absolute", left: 380, top: 962, fontFamily: F.ui, fontWeight: 800, fontSize: 34, letterSpacing: 1.5, color: B.tease, textShadow: "0 2px 10px rgba(0,0,0,0.9)", whiteSpace: "nowrap", opacity: win(hundredAt, L(2), 6, 8) }}>RED: GONE BY 100 m</div>

      {/* line 2: the same drawn fish at two depths */}
      {(() => {
        const a = win(L(2), L(3), 10, 10);
        const b = win(cue(t, 2, "To anything"), L(3), 10, 10);
        if (a <= 0) return null;
        const panel = (top: number, bg: string, label: string, op: number, fish: React.ReactNode) => (
          <div style={{ position: "absolute", left: 380, top, width: 530, height: 290, borderRadius: 22, overflow: "hidden", background: bg, opacity: op, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            <div style={{ position: "absolute", left: 22, top: 16, fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 1.5, color: B.paper }}>{label}</div>
            {fish}
          </div>
        );
        return (
          <>
            {panel(200, "linear-gradient(#53B6E0, #2E7FB0)", "AT THE SURFACE", a, <Fish color={RED} x={120} y={80 + Math.sin(frame / 12) * 6} w={320} frame={frame} />)}
            {panel(530, "linear-gradient(#123E63, #071A2C)", "AT 100 m", b, <Fish color={BLACK} outline="rgba(255,255,255,0.5)" x={120} y={80 + Math.sin(frame / 12 + 1) * 6} w={320} frame={frame} />)}
            <div style={{ position: "absolute", left: 380, top: 850, fontFamily: F.headline, fontSize: 72, color: B.paper, whiteSpace: "nowrap", opacity: win(cue(t, 2, "simply black"), L(3), 8, 10) }}>SAME FISH</div>
          </>
        );
      })()}

      {/* line 3: the zone card, below the 200 m floor line (on the dark end of the plate, away from the fish) */}
      <div style={{ position: "absolute", left: 380, top: 990, opacity: win(cue(t, 3, "sunlight zone"), L(4), 10, 10) }}>
        <div style={{ fontFamily: F.headline, fontSize: 84, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap" }}>SUNLIGHT ZONE</div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 38, letterSpacing: 2, color: B.paper, marginTop: 6, whiteSpace: "nowrap", opacity: ease(frame, twoHundredAt, 8) }}>0–200 m</div>
      </div>
      <div style={{ position: "absolute", left: 380, top: 200, fontFamily: F.headline, fontSize: 64, color: B.paper, whiteSpace: "nowrap", textShadow: "0 3px 14px rgba(0,0,0,0.9)", opacity: win(L(3), L(4), 10, 10) }}>100 m ISN'T DEEP</div>

      {/* lines 4-5: deep animals, drawn - outlined on "the animals you meet", filled on "are red" */}
      {(() => {
        const on = win(cue(t, 4, "animals you meet"), endAt, 12, 10) * (frame >= L(5) ? 0.75 : 1);
        if (on <= 0) return null;
        const fill = ease(frame, cue(t, 4, "are red"), 10);
        const bob = (k: number) => Math.sin(frame / 15 + k) * 10;
        return (
          <>
            <svg width={250} height={138} viewBox="0 0 200 110" style={{ position: "absolute", left: 400, top: 400 + bob(0), opacity: on, overflow: "visible" }}>
              <path d="M152 55 L196 22 L186 55 L196 88 Z" fill={`rgba(215,38,43,${fill})`} stroke={RED} strokeWidth={4} />
              <path d="M18 55 C 48 12, 128 8, 160 52 C 128 100, 48 100, 18 55 Z" fill={`rgba(215,38,43,${fill})`} stroke={RED} strokeWidth={4} />
            </svg>
            {/* two more generic red fish (NOAA #6 names no kinds): a deep-bodied one and a long thin one */}
            <svg width={230} height={170} viewBox="0 0 200 150" style={{ position: "absolute", left: 660, top: 560 + bob(1), opacity: on, overflow: "visible" }}>
              <path d={`M150 75 L196 ${36 + Math.sin(frame / 6) * 5} L184 75 L196 ${114 + Math.sin(frame / 6) * 5} Z`} fill={`rgba(215,38,43,${fill})`} stroke={RED} strokeWidth={4} />
              <path d="M14 75 C 30 10, 130 6, 158 72 C 130 144, 30 140, 14 75 Z" fill={`rgba(215,38,43,${fill})`} stroke={RED} strokeWidth={4} />
              <circle cx={42} cy={64} r={7} fill={B.ink} />
            </svg>
            <svg width={300} height={90} viewBox="0 0 300 90" style={{ position: "absolute", left: 430, top: 820 + bob(2), opacity: on, overflow: "visible" }}>
              <path d={`M262 45 L298 ${22 + Math.sin(frame / 5) * 4} L290 45 L298 ${68 + Math.sin(frame / 5) * 4} Z`} fill={`rgba(215,38,43,${fill})`} stroke={RED} strokeWidth={4} />
              <path d="M8 45 C 40 22, 200 20, 266 42 C 200 70, 40 68, 8 45 Z" fill={`rgba(215,38,43,${fill})`} stroke={RED} strokeWidth={4} />
              <circle cx={30} cy={42} r={5} fill={B.ink} />
            </svg>
          </>
        );
      })()}

      {/* line 5: the question */}
      <div style={{ position: "absolute", left: 380, top: 180, opacity: 1 - end }}>
        <div style={{ fontFamily: F.headline, fontSize: 92, lineHeight: 1, color: B.paper, whiteSpace: "nowrap", opacity: ease(frame, cue(t, 5, "no red light"), 10) }}>NO RED LIGHT.</div>
        <div style={{ fontFamily: F.headline, fontSize: 92, lineHeight: 1, color: B.tease, whiteSpace: "nowrap", opacity: ease(frame, cue(t, 5, "why would"), 10), transform: `scale(${1 + 0.03 * Math.sin(frame / 6)})`, transformOrigin: "left center" }}>SO WHY RED?</div>
      </div>
      <Spectrum x={380} y={1080} red={0} opacity={win(L(5), endAt, 12, 10)} />

      {/* credit chips: what each picture really is */}
      <Chip kind="illustration" source="drawn fish + colour filter over a NOAA photo (whale shark, western Caribbean)" opacity={win(0, L(2), 1, 8)} />
      <Chip kind="illustration" source="drawn" opacity={win(L(2), L(3), 8, 8)} />
      <Chip kind="real" source="NOAA Ocean Exploration · a lancetfish in midwater, 2017" opacity={win(L(3), L(4), 8, 8)} />
      <Chip kind="illustration" source="drawn" opacity={win(L(4), endAt, 8, 8)} />

      {/* burned-in captions, at most two lines at a time */}
      {t.lines.map((l, i) => {
        if (i === n - 1) return null; // the end card carries the last line
        const next = lineAt(t, i + 1);
        return chunks(l.text).map((c, k, all) => {
          const from = within(t, i, c.from);
          const to = k + 1 < all.length ? within(t, i, all[k + 1].from) : next;
          const on = ease(frame, from, 6) * (1 - ease(frame, to, 5));
          return on > 0 ? <Caption key={`${i}-${k}`} text={c.text} opacity={on} /> : null;
        });
      })}

      {/* line 6: end card */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: end, background: B.ink }}>
        <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 0.95, color: B.paper, whiteSpace: "nowrap" }}>OFF THE</div>
        <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 0.95, color: B.gauge, whiteSpace: "nowrap" }}>SCALE</div>
        <div style={{ marginTop: 50, fontFamily: F.ui, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: B.gauge }}>EVERY LEVEL OF THE OCEAN</div>
        <div style={{ marginTop: 16, fontFamily: F.caption, fontWeight: 600, fontSize: 56, color: B.paper, textAlign: "center", whiteSpace: "nowrap" }}>the answer: level 5</div>
        <div style={{ marginTop: 4, fontFamily: F.caption, fontWeight: 600, fontSize: 56, color: B.paper, textAlign: "center", whiteSpace: "nowrap" }}>the midnight zone</div>
        <div style={{ marginTop: 40, fontFamily: F.caption, fontWeight: 600, fontSize: 64, color: B.gauge }}>full video on the channel</div>
        <svg width={120} height={140} viewBox="0 0 120 140" style={{ marginTop: 10 + 10 * Math.sin(frame / 6) }}>
          <path d="M60 10 V118 M18 78 L60 124 L102 78" stroke={B.gauge} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ marginTop: 50, fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: B.mute }}>@OFFTHESCALETV</div>
      </div>
    </AbsoluteFill>
  );
};

export const ShortS03: React.FC = () => (
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
