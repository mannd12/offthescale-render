// L18 colour families (storyboard §1, BUILD.md §5). All OURS (F5: no indigo or violet night, no magenta, no birds).
// "A survey rail in space and a Moon filling the sky": a petrol-black night under a warm tan Moon with a gold rim (abyss),
// a dusk-blue to apricot sky bowl (bowl), the lit teal rail room (gauge), the oxide-orange survey paper (tangerine) and the
// sea-glass evidence board with lemon and sky-blue sheets (board). L17 measured 0.27 chroma because of cream paper,
// grey-teal stone and a muted dusk: NOTHING here is grey, cream or blue-grey; haze pushes toward #0F7A98 or a mid stop.
// USAGE
//   familyOf("abyss" | "bowl" | "gauge" | "tangerine" | "board") → kit Family
//   pillFill(F)            → the pill background for family F (its shadow at 72 %, STYLE-V2 §11)
//   L18_COLORS.moonLit …   → fixed episode colours (BUILD.md §5 list + a few extra steps). Vermilion ONLY on Tick, the "?"
//                            tags and the NOT POSSIBLE rim and X (storyboard §1); the lever #FF9640 and the tangerine paper
//                            are NOT vermilion (F9: chromaTable() prints the hue gap)
//   isDarkFamily(name)     → true for abyss only (value < 0.3: the dark-frame budget, storyboard §1)
//   STAR_TINTS             → apricot and aqua star colours (never grey-white)
//   chromaTable()          → per family: the chroma of every stop and the lit-frame mix (sky 42 % + planes 18 % + accents
//                            40 %, the storyboard's formula); the kit demo prints it, `npx tsx` can log it
import { Family, P, chromaOf, mixHex } from "../../lib/illustrated";

/** Shared episode colours (BUILD.md §5 `L18_COLORS`, storyboard §1). */
export const L18_COLORS = {
  moonLit: "#F6C15E",
  moonMid: "#E39A44",
  moonShade: "#C97A38",
  moonRim: "#FFD27A",
  earthLimb: "#1FB0E0",
  cloud: "#8FE3EE",
  amber: "#FFB347",
  lever: "#FF9640",
  vermilion: P.vermilion, // "#E4572E": Tick, "?" tags, NOT POSSIBLE rim and X only
  measured: "#FFD65A",
  model: "#3AA8E0",
  ink: "#0B2A33",
  lemon: "#FFD65A",
  sky: "#7FD3F0",
  starApricot: "#FFC27A",
  starAqua: "#7FE6F5",
  /** extras (same hues, deeper / lighter steps; all chroma ≥ 0.3) */
  saffron: "#E0A93A", // OUR SUM / OUR REASONING outline
  modelText: "#FFF6DC", // the MODEL placard's lettering (text, not a surface)
  moonCrater: "#B8662C", // crater floors (shaded side of the regolith)
  moonGlow: "#FFC65C",
  earthDeep: "#0B6FA3",
  earthCore: "#0F7A98",
  station: "#FFB347",
  gold: "#FFC65C",
  teal: "#17A8A0",
  tealDeep: "#07505C",
  petrol: "#01121B",
  oxide: "#C4501A",
  paperHi: "#FFC04E",
  lemonDeep: "#E0A92A",
  skyDeep: "#2F9FD0",
  pin: "#FF9640",
  giantBand1: "#E8913A",
  giantBand2: "#C2662A",
  giantBand3: "#FFC870",
  comet: "#BFF6FF",
} as const;
const C = L18_COLORS;

export const STAR_TINTS = [C.starApricot, C.starAqua, "#FFD9A0", "#9FEFF8"] as const;

const fam = (f: Omit<Family, "theme" | "accent">): Family => ({
  ...f,
  accent: P.vermilion,
  theme: { bg: f.sky[0], panel: mixHex(f.sky[0], f.text, 0.12), line: f.text, text: f.text, dim: f.dim, dark: f.dark },
});

/** The five L18 families (storyboard §1 hexes, used exactly). */
export const L18_FAMILIES = {
  /** the dark family: the cold open, orbits, the comet and the ring, the closer. Accents carry it (gold rim, amber, limb blue) */
  abyss: fam({
    name: "abyss",
    sky: ["#01121B", "#022B40", "#07608A"],
    far: "#0A6A8C",
    mid: "#064766",
    near: "#01121B",
    haze: "#0F7A98",
    light: "#FFD27A",
    shadow: "#000A10",
    bounce: "#FF8A3D",
    second: C.earthLimb,
    text: "#FFE2A8",
    dim: "#8FE3EE",
    dark: true,
  }),
  /** the sky under the huge Moon: mid */
  bowl: fam({
    name: "bowl",
    sky: ["#0B6FA3", "#1FA8C9", "#F59A3B", "#FFC65C"],
    far: "#0F5E7A",
    mid: "#0B4A63",
    near: "#06303F",
    haze: "#F08A4A",
    light: "#FFD27A",
    shadow: "#032536",
    bounce: "#F08A4A",
    second: C.moonLit,
    text: "#FFEBC2",
    dim: "#A8F0F5",
    dark: true,
  }),
  /** the lit rail room: bright-mid (amber ticks and lamps) */
  gauge: fam({
    name: "gauge",
    sky: ["#0E7C86", "#17A8A0", "#3CC8A8"],
    far: "#12948F",
    mid: "#0C6F78",
    near: "#07505C",
    haze: "#17A8A0",
    light: "#FFD27A",
    shadow: "#033A42",
    bounce: "#FFB347",
    second: C.amber,
    text: "#FFEFC8",
    dim: "#B5F5E2",
    dark: true,
  }),
  /** survey paper for the ball, arrows, rulers, the chip and the impact plates: bright (dark ink type) */
  tangerine: fam({
    name: "tangerine",
    sky: ["#C4501A", "#EE8A2C", "#FFC04E"],
    far: "#9A3C14",
    mid: "#C85A1E",
    near: "#5E2410",
    haze: "#EE8A2C",
    light: "#FFE08A",
    shadow: "#3A1406",
    bounce: "#FF7A30",
    second: "#17A8A0",
    text: "#2A0E04",
    dim: "#6A2A0C",
    dark: false,
  }),
  /** the honesty board: bright (replaces L17's cream studio). Sheets lemon and sky, ink text */
  board: fam({
    name: "board",
    sky: ["#0F9A9A", "#26B8A8", "#4FCDB6"],
    far: "#0B7C85",
    mid: "#087079",
    near: "#06505A",
    haze: "#26B8A8",
    light: "#FFE08A",
    shadow: "#043A40",
    bounce: "#FFB347",
    second: C.pin,
    text: "#0B2A33",
    dim: "#0F5A60",
    dark: false,
  }),
} as const satisfies Record<string, Family>;

export type L18FamilyName = keyof typeof L18_FAMILIES;
export const familyOf = (name: L18FamilyName): Family => L18_FAMILIES[name];
export const isDarkFamily = (name: L18FamilyName) => name === "abyss";

/** Pills everywhere in this episode: the family shadow at 72 % (STYLE-V2 §11). */
export const pillFill = (F: Family) => {
  const v = [1, 3, 5].map((i) => parseInt(F.shadow.slice(i, i + 2), 16));
  return `rgba(${v[0]},${v[1]},${v[2]},0.72)`;
};
/** Light lettering that reads on every pillFill. */
export const PILL_TEXT = "#FFEFC8";

/** The accents each family's frames carry (storyboard §1 "Light · bounce" column). */
export const FAMILY_ACCENTS: Record<L18FamilyName, string[]> = {
  abyss: ["#FFD27A", "#FF8A3D", C.earthLimb, C.cloud, C.moonLit],
  bowl: ["#FFD27A", "#F08A4A", C.moonLit, C.moonMid],
  gauge: ["#FFD27A", C.amber, C.lever, "#FFB347"],
  tangerine: ["#FFE08A", "#FF7A30", "#17A8A0", "#1FA8C9"],
  board: [C.lemon, C.sky, C.pin, C.amber],
};

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
/** Per family: stop chromas and the lit-frame mix (sky 42 % + planes 18 % + accents 40 %), plus the Moon fill and the F9 pair. */
export const chromaTable = () => {
  const rows = (Object.keys(L18_FAMILIES) as L18FamilyName[]).map((name) => {
    const F = L18_FAMILIES[name];
    const sky = F.sky.map((c) => chromaOf(c).chroma);
    const planes = [F.far, F.mid, F.near].map((c) => chromaOf(c).chroma);
    const acc = FAMILY_ACCENTS[name].map((c) => chromaOf(c).chroma);
    const mix = 0.42 * mean(sky) + 0.18 * mean(planes) + 0.4 * mean(acc);
    const value = 0.42 * mean(F.sky.map((c) => chromaOf(c).value)) + 0.18 * mean([F.far, F.mid, F.near].map((c) => chromaOf(c).value)) + 0.4 * mean(FAMILY_ACCENTS[name].map((c) => chromaOf(c).value));
    return { name, sky, planes, acc, mix, value };
  });
  const moon = [C.moonLit, C.moonMid, C.moonShade].map((c) => ({ c, ...chromaOf(c) }));
  return { rows, moon };
};
