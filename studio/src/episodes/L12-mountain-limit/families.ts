// L12 custom colour families (storyboard §1): two skies built from `Sky stops` in the dusk/ember range, OURS and not
// Kurzgesagt's (their Mars is a red disc on indigo; ours is ochre and terracotta on butterscotch haze; their Venus is
// a yellow ball; ours is a dim amber haze with drifting bands and no visible sun). Both are full `Family` objects so
// every kit piece (Stage theme, ChapterCard, Pill, Inset, Dial...) accepts them like the six built-in families.
// Vermilion rule unchanged: only the gauge, Tick, the summit dot and the lineup's Everest bar.
import { FAMILIES, Family, FamilyName, P, mixHex } from "../../lib/illustrated";

const fam = (f: Omit<Family, "theme" | "accent">): Family => ({
  ...f,
  accent: P.vermilion,
  theme: {
    bg: f.sky[0],
    panel: mixHex(f.sky[0], f.text, 0.12),
    line: f.text,
    text: f.text,
    dim: f.dim,
    dark: f.dark,
  },
});

/** Mars daylight (shots 7-07 … 7-11, key art III): terracotta zenith → ochre → butterscotch dust haze at the horizon;
 *  sun low left (light ≈ 160-170°), long dust-pink shadows, sage-grey rock as the second hue. */
export const MARS: Family = fam({
  name: "mars",
  sky: ["#7E3D1C", "#B86A2E", "#D9944A", "#EDC27C"],
  far: "#C98A4E",
  mid: "#A85E2C",
  near: "#5C2A12",
  haze: "#EBC17C",
  light: "#FFE4AE",
  shadow: "#3B160A",
  bounce: "#E8905A",
  second: "#8C8A6E",
  text: "#FFF4E2",
  dim: "#F0D4A8",
  dark: true,
});

/** Venus (shot 7-17, 7-18): dim amber haze, diffuse light from above through the cloud deck (no sun disc, light ≈ 270°),
 *  bands drifting, the ridge of Maxwell Montes as dark umber glints. Nothing "above sea level" here (flag F12). */
export const VENUS: Family = fam({
  name: "venus",
  sky: ["#5A2E0E", "#8E5218", "#B9782A", "#D29A42"],
  far: "#B07A3A",
  mid: "#875420",
  near: "#4A2A0E",
  haze: "#D6A65A",
  light: "#FFD688",
  shadow: "#2A1406",
  bounce: "#E0A04A",
  second: "#A0785A",
  text: "#FFF2D8",
  dim: "#E6C690",
  dark: true,
});

/** All families this episode uses, by the storyboard's names (the colour-script column). */
export const L12_FAMILIES = { ...FAMILIES, mars: MARS, venus: VENUS } as const;
export type L12FamilyName = FamilyName | "mars" | "venus";
export const familyOf = (name: L12FamilyName): Family => L12_FAMILIES[name];

/** Pills everywhere in this episode: the family shadow at 72 % (STYLE-V2 §11, "black pills were heavy"). */
export const pillFill = (F: Family) => {
  const v = [1, 3, 5].map((i) => parseInt(F.shadow.slice(i, i + 2), 16));
  return `rgba(${v[0]},${v[1]},${v[2]},0.72)`;
};

/** Shared episode colours (storyboard §1): the pressure dial's warning band is amber, never vermilion; water and ice
 *  are sea-glass. */
export const L12_COLORS = {
  amber: "#FF8A2A",
  seaGlass: "#7FAE9F",
  ice: "#CFEAE4",
  snow: "#FFFBF0",
  snowShade: "#DCE3E0",
  slate: "#56656F",
  slateDark: "#2F3A42",
  limestone: "#D8CBB0",
  granite: "#9A9A94",
} as const;
