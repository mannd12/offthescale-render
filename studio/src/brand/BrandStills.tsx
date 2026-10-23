import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { loadBrandFonts } from "./fonts";
import { CaptionPop, CreditChip, DiverSilhouette, Gauge, GaugeStop, Tile, TopBar, levelImage } from "./kit";
import { B, F, Level } from "./tokens";

loadBrandFonts();

// STYLE MOCK ONLY: real public-domain NOAA images, but tile names/readings are layout
// placeholders - Episode 1 gets a researched ladder with a verified depth for every tile.
const LEVELS: Level[] = [
  { id: "l1", name: "Sunlight zone", reading: "0–200 m", image: "whale-shark" },
  { id: "l2", name: "Twilight zone", reading: "200–1,000 m", image: "lancetfish" },
  { id: "l3", name: "Midnight zone", reading: "3,900 m", image: "comb-jelly", ext: "png" },
  { id: "l4", name: "Deep hunters", reading: "the abyss", image: "lizardfish" },
  { id: "l5", name: "Titanic", reading: "3,800 m", image: "titanic-bow" },
  { id: "l6", name: "Eyes without eyes", reading: "the abyss", image: "grideye-fish" },
  { id: "l7", name: "It swims?!", reading: "deep sea", image: "swimming-cucumber", ext: "png" },
  { id: "l8", name: "Undersea lake", reading: "brine pool", image: "brine-pool" },
  { id: "l9", name: "Life with no sun", reading: "vents", image: "vent-fauna" },
  { id: "l10", name: "Sixgill ray", reading: "deep sea", image: "sixgill-ray" },
  { id: "l11", name: "Robot explorer", reading: "to 6,000 m", image: "rov-coral" },
  { id: "l12", name: "The bottom", reading: "10,900 m", image: null },
];

const STOPS: GaugeStop[] = [
  { at: 0, label: "0 m" },
  { at: 0.2, label: "200 m" },
  { at: 0.4, label: "1,000 m" },
  { at: 0.6, label: "4,000 m" },
  { at: 0.8, label: "6,000 m" },
  { at: 1, label: "10,900 m" },
];

/** What a moment of the long video looks like: footage + title bar/strip + gauge + caption + credit. */
export const BrandFrame: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: B.ink }}>
    <Img src={levelImage(LEVELS[2])!} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(transparent 55%, rgba(5,14,24,0.7))" }} />
    <TopBar series="EVERY LEVEL OF THE OCEAN" levels={LEVELS} current={2} progress={0.55} />
    <Gauge x={1580} top={250} height={700} stops={STOPS} position={0.593} reading="3,900 m" sub="≈ 390× surface pressure" />
    <CaptionPop>no sunlight has ever reached here</CaptionPop>
    <CreditChip source="NOAA Ocean Exploration" />
  </AbsoluteFill>
);

/** The same moment while the next level is being teased. */
export const BrandFrameTease: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: B.ink }}>
    <Img src={levelImage(LEVELS[10])!} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55) blur(6px)" }} />
    <TopBar series="EVERY LEVEL OF THE OCEAN" levels={LEVELS} current={10} progress={1} teasing />
    <Gauge x={1580} top={250} height={700} stops={STOPS} position={0.8} reading="6,000 m" sub="≈ 600× surface pressure" />
    <CaptionPop color={B.paper} size={84} bottom={400}>
      but there are still 5 km to go…
    </CaptionPop>
  </AbsoluteFill>
);

/**
 * Ladder thumbnail. Rebuilt after the feed-size test (docs/THUMBNAILS.md): at 168 px the tile
 * labels are unreadable in every competitor using this layout, so meaning now comes from a
 * cyan->black depth ramp across the tiles, plus a scale cue, both of which survive any size.
 */
const ThumbBase: React.FC<{ card: string; ink: string; pillBg: string; pillInk: string }> = ({ card, ink, pillBg, pillInk }) => {
  const cols = 4;
  const gap = 12;
  const gridLeft = 118;
  const tileW = Math.floor((1280 - gridLeft - 28 - gap * (cols - 1)) / cols);
  const tileH = Math.floor(tileW * 0.62); // fills the card down to a ~36 px bottom margin
  return (
    <AbsoluteFill style={{ backgroundColor: card }}>
      <div style={{ position: "absolute", top: 14, left: 30, right: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: F.headline, fontSize: 97, lineHeight: 1, letterSpacing: 1, color: ink, whiteSpace: "nowrap" }}>EVERY LEVEL OF THE OCEAN</div>
        <div style={{ padding: "8px 18px 10px", borderRadius: 16, background: pillBg, color: pillInk, fontFamily: F.ui, fontWeight: 800, fontSize: 30, lineHeight: 1.05, textAlign: "center", transform: "rotate(-4deg)" }}>
          REAL
          <br />
          FOOTAGE
        </div>
      </div>
      {/* the gauge, as an arrow down the left edge, with a diver at the surface for scale */}
      <div style={{ position: "absolute", left: 30, top: 150, bottom: 30, width: 64 }}>
        <div style={{ position: "absolute", left: 22, top: 34, bottom: 46, width: 20, borderRadius: 10, background: "linear-gradient(#19C3E6, #0B3A5E 50%, #050E18)" }} />
        <div style={{ position: "absolute", left: 6, bottom: 8, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "44px solid #050E18" }} />
        <DiverSilhouette size={40} color={ink} style={{ position: "absolute", top: -4, left: 12 }} />
      </div>
      <div style={{ position: "absolute", left: gridLeft, top: 150, display: "grid", gridTemplateColumns: `repeat(${cols}, ${tileW}px)`, gap }}>
        {LEVELS.map((l, i) => {
          // depth ramp: row 0 still lit, row 2 nearly black - the progression reads at any size
          const depth = i / (LEVELS.length - 1);
          return (
            <div key={l.id} style={{ position: "relative" }}>
              <Tile level={l} width={tileW} height={tileH} labelSize={19} badge={i === 0 ? "YOU ARE HERE" : undefined} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: Math.round(tileH * 0.09),
                  pointerEvents: "none",
                  // fades out before the label strip, so the ramp tints the image, never the text
                  background: `linear-gradient(180deg, rgba(25,195,230,${0.18 * (1 - depth)}) 0%, rgba(5,14,24,${0.72 * depth}) 58%, rgba(5,14,24,0) 82%)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Ladder, white card - closest to the genre convention. */
export const BrandThumbA: React.FC = () => <ThumbBase card={B.paper} ink={B.ink} pillBg={B.tease} pillInk={B.paper} />;
/** Ladder, yellow card - our own colour in the feed. Video 1 ships with this one. */
export const BrandThumbB: React.FC = () => <ThumbBase card={B.gauge} ink={B.ink} pillBg={B.ink} pillInk={B.gauge} />;

/**
 * Hero thumbnail - the archetype the biggest videos in this niche use: one subject, huge text,
 * a scale cue, extreme contrast. Text ADDS to the title rather than repeating it.
 */
export const BrandThumbHero: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #2FD8F5 0%, #0E6E9B 16%, #0B3A5E 38%, #071B2E 62%, #03080F 100%)" }}>
    {/* surface light */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(180deg, rgba(255,255,255,0.55), transparent)" }} />
    {/* the diver, small, near the surface - the whole point is how little of the frame they occupy */}
    <DiverSilhouette size={86} color="#04121F" style={{ position: "absolute", top: 54, left: 128 }} />
    <div style={{ position: "absolute", top: 74, left: 224, fontFamily: F.ui, fontWeight: 800, fontSize: 26, color: "#04121F" }}>YOU · 40 m</div>

    <div style={{ position: "absolute", left: 96, top: 210, fontFamily: F.headline, fontSize: 168, lineHeight: 0.92, letterSpacing: 1, color: B.paper, textShadow: "0 10px 40px rgba(0,0,0,0.75)" }}>
      11 KM
      <br />
      STRAIGHT
      <br />
      DOWN
    </div>

    {/* depth scale down the right edge */}
    <div style={{ position: "absolute", right: 42, top: 40, bottom: 40, width: 260 }}>
      {[
        { at: 0.0, label: "0 m" },
        { at: 0.28, label: "1,000 m" },
        { at: 0.56, label: "4,000 m" },
        { at: 0.8, label: "8,000 m" },
      ].map((s) => (
        <div key={s.label} style={{ position: "absolute", right: 0, top: `${s.at * 100}%`, display: "flex", alignItems: "center", gap: 10, transform: "translateY(-50%)" }}>
          <span style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: "rgba(255,255,255,0.92)" }}>{s.label}</span>
          <span style={{ width: 30, height: 3, background: "rgba(255,255,255,0.92)" }} />
        </div>
      ))}
    </div>
    {/* the "???" rung, below 8,000 m: moved up-left (was x 1072-1196, y 576-680) out of the duration-badge
        zone; a longer coral leader keeps it tied to its tick on the scale */}
    <div style={{ position: "absolute", right: 42, top: 600, display: "flex", alignItems: "center", gap: 12, transform: "translateY(-50%)" }}>
      <span style={{ padding: "10px 22px 12px", borderRadius: 14, background: B.tease, color: B.paper, fontFamily: F.headline, fontSize: 54 }}>???</span>
      <span style={{ width: 222, height: 3, background: B.tease }} />
    </div>
  </AbsoluteFill>
);

/** Vertical Short: one rung, big caption, mini gauge. */
export const BrandShort: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: B.ink }}>
    <Img src={levelImage(LEVELS[7])!} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "62%", objectFit: "cover" }} />
    <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "14%", background: `linear-gradient(transparent, ${B.ink})` }} />
    <div style={{ position: "absolute", top: 70, left: 50, padding: "12px 26px", borderRadius: 999, background: B.gauge, color: B.ink, fontFamily: F.ui, fontWeight: 800, fontSize: 34, letterSpacing: 1 }}>EVERY LEVEL OF THE OCEAN</div>
    <div style={{ position: "absolute", left: 60, right: 60, top: "65%", textAlign: "center" }}>
      <div style={{ fontFamily: F.caption, fontWeight: 600, fontSize: 104, lineHeight: 1.08, color: B.paper }}>
        There is a <span style={{ color: B.gauge }}>lake</span> at the bottom of the sea
      </div>
      <div style={{ marginTop: 44, fontFamily: F.headline, fontSize: 64, letterSpacing: 1, color: B.gauge }}>DEEP IN THE GULF OF MEXICO</div>
    </div>
    <CreditChip source="NOAA Ocean Exploration" left={60} bottom={60} />
  </AbsoluteFill>
);
