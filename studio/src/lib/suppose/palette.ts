// Suppose Then kit (second channel; spec: Desktop\What If\docs\STYLE.md). Reuses Off the Scale's craft modules from
// ../illustrated (Sky, Bloom, Layer, Stage, ambient) but owns its palette, character, devices and type. Nothing in this
// folder is imported by Off the Scale, and nothing here edits ../illustrated.
import type { Family } from "../illustrated/palette2";
import { mixHex } from "../illustrated/palette";

/** Signal colour: Counter, Ladder, Lev's scarf, "you are here". Nothing else is lime. */
export const LIME = "#C6E03A";
export const LIME_DEEP = "#8FA61E";
/** The one secondary, for props. */
export const TERRA = "#C9643F";
export const CHALK = "#F3F5EA";
export const CHALK_SHADE = "#C7D2BE";
export const INK = "#13241D";
export const BRASS = "#D8B35A";
export const BRASS_DARK = "#8E6E2A";
export const OCEAN = "#3E8FB0";
export const AIR = "#9FD8E6";

const fam = (f: Omit<Family, "theme" | "accent">): Family => ({
  ...f,
  accent: LIME,
  theme: { bg: f.sky[0], panel: mixHex(f.sky[0], f.text, 0.12), line: f.text, text: f.text, dim: f.dim, dark: f.dark },
});

export const SUPPOSE = {
  moss: fam({
    name: "moss", sky: ["#0B1E19", "#16382E", "#2C5E4A"], far: "#3F7A63", mid: "#285744", near: "#10291F",
    haze: "#2C5E4A", light: "#EAF7C8", shadow: "#06120E", bounce: "#5FA77E", second: TERRA,
    text: "#EAF2DC", dim: "#9DB8A6", dark: true,
  }),
  sage: fam({
    name: "sage", sky: ["#A9CDB4", "#D3E4C8", "#EFEBD2"], far: "#B9D3A8", mid: "#8DB58A", near: "#4F7F5A",
    haze: "#E4EDD5", light: "#FFF6D6", shadow: "#3D5E46", bounce: "#C9E4B0", second: TERRA,
    text: "#1E3328", dim: "#557263", dark: false,
  }),
  clay: fam({
    name: "clay", sky: ["#5A2A1E", "#A4553A", "#E3A57E"], far: "#C47A57", mid: "#9B5139", near: "#4E2318",
    haze: "#E3A57E", light: "#FFD7A8", shadow: "#2E120B", bounce: "#E88A5E", second: TERRA,
    text: "#FFF1E0", dim: "#F0C4A4", dark: false,
  }),
  olive: fam({
    name: "olive", sky: ["#121509", "#232A14", "#3A4422"], far: "#4D5A2E", mid: "#36401F", near: "#121509",
    haze: "#3A4422", light: "#F6F0D0", shadow: "#070803", bounce: "#7E8F45", second: TERRA,
    text: "#F2EFD8", dim: "#A9AC86", dark: true,
  }),
  chalk: fam({
    name: "chalk", sky: ["#E4EBDD", "#CBD8C2"], far: "#BFCDB5", mid: "#A3B597", near: "#7E9474",
    haze: "#E4EBDD", light: "#FFFFF4", shadow: "#6B8061", bounce: "#D9E8C8", second: TERRA,
    text: "#1E3328", dim: "#5F7566", dark: false,
  }),
} as const;

export type SupposeFamily = keyof typeof SUPPOSE;

export const ST_FONT = "'Nunito', 'Helvetica Neue', Arial, sans-serif";
