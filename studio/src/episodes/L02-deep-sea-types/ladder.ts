// The eight types of L02 - strategies, not species - and the gauge that reads TYPE 1 -> 8.
import { GaugeStop } from "../../brand/kit";
import { Level } from "../../brand/tokens";

export const SERIES = "EVERY TYPE OF DEEP-SEA CREATURE";

export const LEVELS: Level[] = [
  { id: "l01", name: "The Lure", reading: "anglerfish", image: "anglerfish-lophiodes" },
  { id: "l02", name: "The Red Torch", reading: "dragonfish", image: "loosejaw" },
  { id: "l03", name: "The Trap Mouth", reading: "pelican eel", image: "pelican-eel" },
  { id: "l04", name: "The Glass Body", reading: "see-through", image: "comb-jelly", ext: "png" },
  { id: "l05", name: "The Giant", reading: "giant isopod", image: "isopod-still" },
  // same photo as Type 5 (there is no free picture of "Number One"): the tile is cropped to the legs so the two differ
  { id: "l06", name: "The Faster", reading: "years without food", image: "isopod-still", tileCrop: { scale: 1.9, origin: "58% 62%" } },
  { id: "l07", name: "The Drifter", reading: "siphonophore", image: "siphonophore", ext: "png" },
  { id: "l08", name: "", reading: "", image: null },
];

/** after the reveal in scene 8, the mystery tile carries its name (it stays "???" in every earlier tease) */
export const LEVELS_REVEALED: Level[] = [...LEVELS.slice(0, 7), { id: "l08", name: "The Bone-Eater", reading: "whale falls", image: "whale-fall" }];

/** the gauge is a ladder of ideas: eight evenly spaced stops */
export const STOPS: GaugeStop[] = LEVELS.map((l, i) => ({ at: i / (LEVELS.length - 1), label: `TYPE ${i + 1}` }));
export const typePos = (n: number) => (n - 1) / (LEVELS.length - 1);

/** the three problems every type solves; each rung lights the one(s) it answers */
export const PROBLEMS = ["no light", "no food", "nowhere to hide"] as const;
export const SOLVES: Record<string, number[]> = {
  l01: [0, 1], l02: [0, 1], l03: [1], l04: [2], l05: [1], l06: [1], l07: [1, 2], l08: [1],
};
