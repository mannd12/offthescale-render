// L19 colour families (storyboard §1, BUILD.md §5). All OURS (F5: no indigo or violet night, no magenta, no birds).
// "A descent through banded decks that shear sideways": the warm-black to crimson space around Jupiter's limb (limb), the
// bright gold-orange cloud tops (crest), the red-orange fall below them (deepdeck), the glowing crimson-and-gold furnace of
// the models (furnace) and Tick's phosphor-emerald listening station with lemon and apricot tickets (scope).
// NOTHING here is grey, cream, silver or blue-grey; haze pushes toward a family's own mid stop.
// USAGE
//   familyOf("limb" | "crest" | "deepdeck" | "furnace" | "scope") → kit Family
//   pillFill(F)          → the pill background for family F (its shadow at 72 %, STYLE-V2 §11)
//   L19_COLORS.belt …    → fixed episode colours (BUILD.md §5 list + extra steps). Vermilion ONLY on Tick and the "?" / "!"
//                          tags; the stripe orange #E8731C and the lever #FF9640 are NOT vermilion (F11: chromaTable().f11
//                          prints the hue gap)
//   isDarkFamily(name)   → true for limb and furnace (the dark-frame budget, storyboard §1)
//   STAR_TINTS           → apricot and aqua star colours (never grey-white)
//   chromaTable()        → per family: the chroma of every stop, the lit-frame mix (sky 42 % + planes 18 % + accents 40 %)
//                          and, for the dark families, the dark-frame mix (first two sky stops 62 %, planes 24 %, accents 14 %);
//                          plus the gold fill and the F11 hue check. The kit demo prints it.
import { Family, P, chromaOf, mixHex } from "../../lib/illustrated";

/** Shared episode colours (BUILD.md §5 `L19_COLORS`, storyboard §1). */
export const L19_COLORS = {
  stripeOrange: "#E8731C",
  stripeAmber: "#F2A31B",
  stripeRust: "#B8431A",
  belt: "#13A8A0",
  probe: "#FFB347",
  flare: "#FFD27A",
  gold: "#FFC93A",
  glow: "#F0601A",
  heard: "#FFD65A",
  model: "#3AA8E0",
  modelLabel: "#FFF6DC", // the MODEL ticket's lettering and the agency pills' fill: a label colour, never a field
  apricot: "#FFB070",
  ink: "#04261A",
  vermilion: P.vermilion, // "#E4572E": Tick, "?" and "!" only
  starApricot: "#FFC27A",
  starAqua: "#7FE6F5",
  /** extras (same hues, deeper / lighter steps; all chroma ≥ 0.3) */
  saffron: "#E0A93A", // OUR SUM outline
  lever: "#FF9640",
  lemonDeep: "#E0A92A",
  modelDeep: "#1F7FB8",
  goldHot: "#FFE066",
  goldRim: "#F28A1E",
  liquid: "#F0601A",
  gas: "#F2A31B",
  fog: "#FFB347",
  crimson: "#8E1A18",
  emerald: "#00A35A",
  emeraldDeep: "#004A2E",
  teal: "#10A89E",
  spot: "#D8381C", // the Great Red Spot oval
  spotArm: "#F26A1E",
  cactus: "#2FA84A",
  earth: "#1FA0E0", // the tiny Earth dot (no continents)
} as const;
const C = L19_COLORS;

export const STAR_TINTS = [C.starApricot, C.starAqua, "#FFD9A0", "#9FEFF8"] as const;

const fam = (f: Omit<Family, "theme" | "accent">): Family => ({
  ...f,
  accent: P.vermilion,
  theme: { bg: f.sky[0], panel: mixHex(f.sky[0], f.text, 0.12), line: f.text, text: f.text, dim: f.dim, dark: f.dark },
});

/** The five L19 families (storyboard §1 hexes, used exactly). */
export const L19_FAMILIES = {
  /** space around the limb: the cold open, the orbiters, the closer, the end card. Dark (warm-black to crimson, never black) */
  limb: fam({
    name: "limb",
    sky: ["#2A0804", "#5A1206", "#A8300C"],
    far: C.stripeOrange,
    mid: C.stripeAmber,
    near: C.stripeRust,
    haze: "#A8300C",
    light: "#FFD27A",
    shadow: "#1A0402",
    bounce: "#FF8A3D",
    second: C.belt,
    text: "#FFE2A8",
    dim: "#FFC27A",
    dark: true,
  }),
  /** the cloud tops: bright (dark ink type) */
  crest: fam({
    name: "crest",
    sky: ["#FF9A2E", "#FFC247", "#FFE066"],
    far: "#E2571F",
    mid: "#F28A1E",
    near: "#B8431A",
    haze: "#FFC247",
    light: "#FFF0A0",
    shadow: "#5A1A06",
    bounce: "#FF7A30",
    second: "#10A89E",
    text: "#2B0905",
    dim: "#7A2A0A",
    dark: false,
  }),
  /** the fall below the cloud tops: mid */
  deepdeck: fam({
    name: "deepdeck",
    sky: ["#F26A1E", "#D8381C", "#8E1A18"],
    far: "#C0301A",
    mid: "#A02418",
    near: "#701410",
    haze: "#D8381C",
    light: "#FFB347",
    shadow: "#3A0806",
    bounce: "#FF8A3D",
    second: "#10A89E",
    text: "#FFEBC2",
    dim: "#FFD27A",
    dark: false,
  }),
  /** the models: dark but glowing (glow bands, gold, the blue MODEL ticket carry it) */
  furnace: fam({
    name: "furnace",
    sky: ["#3A0A04", "#9A1E0C", "#F0601A"],
    far: "#B22A10",
    mid: "#7A1A0C",
    near: "#4A0F06",
    haze: "#9A1E0C",
    light: "#FFC93A",
    shadow: "#1E0503",
    bounce: "#FF9640",
    second: C.model,
    text: "#FFE8B0",
    dim: "#FFC93A",
    dark: true,
  }),
  /** Tick's listening station, the charts, the ledger: bright-mid phosphor emerald (not teal, not cerulean) */
  scope: fam({
    name: "scope",
    sky: ["#00A35A", "#10C070", "#40D486"],
    far: "#007A45",
    mid: "#00603A",
    near: "#004A2E",
    haze: "#10C070",
    light: "#FFE08A",
    shadow: "#002A1A",
    bounce: "#FFB347",
    second: C.heard,
    text: "#04261A",
    dim: "#00603A",
    dark: false,
  }),
} as const satisfies Record<string, Family>;

export type L19FamilyName = keyof typeof L19_FAMILIES;
export const familyOf = (name: L19FamilyName): Family => L19_FAMILIES[name];
export const isDarkFamily = (name: L19FamilyName) => name === "limb" || name === "furnace";

/** Pills everywhere in this episode: the family shadow at 72 % (STYLE-V2 §11). */
export const pillFill = (F: Family) => {
  const v = [1, 3, 5].map((i) => parseInt(F.shadow.slice(i, i + 2), 16));
  return `rgba(${v[0]},${v[1]},${v[2]},0.72)`;
};
/** Light lettering that reads on every pillFill. */
export const PILL_TEXT = "#FFEFC8";

/** The accents each family's frames carry (storyboard §1 "Light · bounce" column). */
export const FAMILY_ACCENTS: Record<L19FamilyName, string[]> = {
  limb: ["#FFD27A", "#FF8A3D", C.belt, C.probe, C.starApricot],
  crest: ["#FFF0A0", "#FF7A30", "#10A89E", C.heard, C.probe],
  deepdeck: ["#FFB347", "#FF8A3D", C.gold, C.goldHot, "#10A89E"],
  furnace: ["#FFC93A", "#FF9640", C.model, C.goldHot],
  scope: ["#FFE08A", "#FFB347", C.heard, C.lever, C.apricot],
};

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
const hue = (c: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const mx = Math.max(r, g, b);
  const d = mx - Math.min(r, g, b);
  if (d === 0) return 0;
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
};

/** Per family: stop chromas, the lit-frame mix, the dark-frame mix (dark families), the gold fill and the F11 hue check. */
export const chromaTable = () => {
  const rows = (Object.keys(L19_FAMILIES) as L19FamilyName[]).map((name) => {
    const F = L19_FAMILIES[name];
    const ch = (c: string) => chromaOf(c).chroma;
    const vl = (c: string) => chromaOf(c).value;
    const planes = [F.far, F.mid, F.near];
    const acc = FAMILY_ACCENTS[name];
    const mix = 0.42 * mean(F.sky.map(ch)) + 0.18 * mean(planes.map(ch)) + 0.4 * mean(acc.map(ch));
    const value = 0.42 * mean(F.sky.map(vl)) + 0.18 * mean(planes.map(vl)) + 0.4 * mean(acc.map(vl));
    const dark = isDarkFamily(name) ? 0.62 * mean(F.sky.slice(0, 2).map(ch)) + 0.24 * mean(planes.map(ch)) + 0.14 * mean(acc.map(ch)) : undefined;
    const darkV = isDarkFamily(name) ? 0.62 * mean(F.sky.slice(0, 2).map(vl)) + 0.24 * mean(planes.map(vl)) + 0.14 * mean(acc.map(vl)) : undefined;
    return { name, sky: F.sky.map(ch), mix, value, dark, darkV };
  });
  const gold = [C.gold, C.goldHot, C.goldRim].map((c) => ({ c, ...chromaOf(c) }));
  const f11 = [C.stripeOrange, C.lever, C.vermilion].map((c) => ({ c, hue: Math.round(hue(c)), chroma: chromaOf(c).chroma }));
  return { rows, gold, f11 };
};
