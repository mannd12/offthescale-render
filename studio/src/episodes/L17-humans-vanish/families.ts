// L17 colour families (storyboard §1, BUILD.md §5). All OURS (F5: no indigo or violet night, no magenta, no birds).
// "Empty rooms and a ladder": a petrol-black night full of lit boxes, cold water light (rain, frost), oxide ochre and
// orange (rust, paint), bright stone and sun (noon), a maroon-black underground (deep), a petrol-black Moon with warm
// bone dust (void), and the teal studio cyc for the plates and the honesty board. Nothing grey: stars are tinted
// apricot and teal, the MODEL stamp is slate-teal #7C9BA6.
// USAGE
//   familyOf("night" | "deep" | "rain" | "frost" | "rust" | "noon" | "dusk" | "void" | "studio") → kit Family
//   pillFill(F)            → the pill background for family F (its shadow at 72 %, STYLE-V2 §11)
//   L17_COLORS.amber …     → fixed episode colours. Vermilion ONLY on Tick, the YEARS dial needle, the rung glow and the
//                            "?" tags (storyboard §1); rust #B04A18 and the ICE lever #FF9640 are NOT vermilion (F9)
//   isDarkFamily(name)     → true for night / deep / void (value < 0.3: the dark-frame budget, storyboard §1)
//   STAR_TINTS             → apricot and teal star colours (never grey-white)
//   WINDOW_TINTS           → the lit-window ambers the skyline uses
import { FAMILIES, Family, P, STUDIO_SET, mixHex } from "../../lib/illustrated";

/** Shared episode colours (storyboard §1, BUILD.md §5). */
export const L17_COLORS = {
  amber: "#FFB347", // window amber
  lantern: "#FFCF73",
  vermilion: P.vermilion, // "#E4572E": Tick, dial needle, rung glow, "?" only
  saffron: "#E0A93A", // OUR SUM / OUR REASONING outline, dial end-stops
  seen: "#2FBF71", // SEEN stamp (hexagon)
  model: "#7C9BA6", // MODEL stamp + the four tags (slate-teal, never neutral grey, never violet)
  rust: "#B04A18", // oxide (hue ~20 deg, far from vermilion's chroma: F9)
  lever: "#FF9640", // the ICE lever
  ice: "#D5F0F2",
  moonDust: "#E8D7B0", // warm bone dust (F6: it never blows)
  /** extras (same hues, lighter / deeper steps) */
  amberDeep: "#E3813F",
  saffronCore: "#FFE6A8",
  saffronDeep: "#9C6A16",
  seenDeep: "#1E8A50",
  modelDeep: "#4F6E7A",
  paper: "#FFF6E6",
  ink: "#14262E",
  petrol: "#06151D",
  teal: "#2FBFA8",
  tealDeep: "#1C6E78",
  water: "#3FA9C8",
  waterDeep: "#1D5F7A",
  steel: "#6E8C96",
  concrete: "#B9B09A",
  bone: "#F4EEDF",
} as const;
const C = L17_COLORS;

export const STAR_TINTS = ["#FFD9A8", "#7FE0D8", "#FFE6C0", "#9FE8E0"] as const;
export const WINDOW_TINTS = ["#FFB347", "#FFC870", "#FFA040", "#FFD27F"] as const;

const fam = (f: Omit<Family, "theme" | "accent">): Family => ({
  ...f,
  accent: P.vermilion,
  theme: { bg: f.sky[0], panel: mixHex(f.sky[0], f.text, 0.12), line: f.text, text: f.text, dim: f.dim, dark: f.dark },
});

/** The five L17 families (storyboard §1 hexes) + STYLE-V2's noon, dusk, void and the kit studio cyc. */
export const L17_FAMILIES = {
  /** the lit and emptied city, the rail, the haze, the collapse: THE dark family (window amber carries the chroma) */
  night: fam({
    name: "night",
    sky: ["#06151D", "#0D2B38", "#14414F"],
    far: "#26525F",
    mid: "#1B414C",
    near: "#06151D",
    haze: "#14414F",
    light: C.amber,
    shadow: "#020B10",
    bounce: "#E3813F",
    second: "#2FBFA8",
    text: "#FFF4E0",
    dim: "#A9CFCC",
    dark: true,
  }),
  /** the subway tunnel, bedrock, the buried stone: the other dark family (lantern gold carries it) */
  deep: fam({
    name: "deep",
    sky: ["#1A0A0C", "#2E1114", "#4A1C16"],
    far: "#5A2A1E",
    mid: "#3A1812",
    near: "#1A0A0C",
    haze: "#4A1C16",
    light: C.lantern,
    shadow: "#0C0405",
    bounce: "#FF7A30",
    second: "#E0A93A",
    text: "#FFF0DC",
    dim: "#E0B49A",
    dark: true,
  }),
  /** the street in rain, the first cold: mid */
  rain: fam({
    name: "rain",
    sky: ["#1D4A5C", "#2F6F80", "#5FA0A8"],
    far: "#3F7F8E",
    mid: "#235A69",
    near: "#0F3540",
    haze: "#5FA0A8",
    light: "#CFEFF2",
    shadow: "#082430",
    bounce: "#7FD0E8",
    second: C.lever,
    text: "#F0FAF8",
    dim: "#BFE0E2",
    dark: true,
  }),
  /** crack and ice close-ups: bright (dark ink type) */
  frost: fam({
    name: "frost",
    sky: ["#9FD8E6", "#D5F0F2", "#F4F8F0"],
    far: "#7FBFD0",
    mid: "#5FA0B4",
    near: "#2F6F80",
    haze: "#E4F4F2",
    light: "#FFF8E8",
    shadow: "#1D4F60",
    bounce: "#7FD0E8",
    second: C.lever,
    text: "#12323C",
    dim: "#3F6A76",
    dark: false,
  }),
  /** concrete cutaways, our fallen wall: mid (oxide; Tick and the lantern stay clear of it) */
  rust: fam({
    name: "rust",
    sky: ["#6A2210", "#B04A18", "#E3813F"],
    far: "#8F4420",
    mid: "#7A3418",
    near: "#3A1208",
    haze: "#C0602A",
    light: C.amber,
    shadow: "#240A04",
    bounce: "#FF7A30",
    second: "#5FB0B4",
    text: "#FFF0DC",
    dim: "#F2C8A4",
    dark: true,
  }),
  noon: FAMILIES.noon,
  dusk: FAMILIES.dusk,
  void: FAMILIES.void,
  /** the kit's teal cyclorama (STUDIO_SET): seesaw, density tank, lab, paper and the whole honesty board */
  studio: STUDIO_SET,
} as const satisfies Record<string, Family>;

export type L17FamilyName = keyof typeof L17_FAMILIES;
export const familyOf = (name: L17FamilyName): Family => L17_FAMILIES[name];
export const isDarkFamily = (name: L17FamilyName) => name === "night" || name === "deep" || name === "void";

/** Pills everywhere in this episode: the family shadow at 72 % (STYLE-V2 §11). */
export const pillFill = (F: Family) => {
  const v = [1, 3, 5].map((i) => parseInt(F.shadow.slice(i, i + 2), 16));
  return `rgba(${v[0]},${v[1]},${v[2]},0.72)`;
};
