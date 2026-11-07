// Kit v2.1 shot-list lint (study item 2: "ambient floor enforced by a shot-list lint"). A storyboard declares each shot's
// camera, ambient systems, Tick's verb and transition; `lintShots` returns what is missing per shot so an animatic gate
// can fail before anything is rendered. Pure TypeScript: usable from scripts and from scene files alike.
export type AmbientKind = "particles" | "sway" | "light" | "camera" | "surface" | "crowd";

/** Known ambient systems in the kit, grouped by what they satisfy in the floor. */
export const AMBIENT_SYSTEMS: Record<string, AmbientKind> = {
  Stars: "particles",
  Motes: "particles",
  Embers: "particles",
  Bubbles: "particles",
  Risers: "particles",
  fall: "particles",
  specks: "particles",
  Flock: "sway",
  Sway: "sway",
  Bobber: "sway",
  Puffs: "sway",
  Conifer: "sway",
  flicker: "light",
  pulse: "light",
  Bloom: "light",
  drift: "camera",
  push: "camera",
  pan: "camera",
  "zoom-through": "camera",
  Ripples: "surface",
  seaSurface: "surface",
  lane: "crowd",
  walk: "crowd",
};

export type Shot = {
  id: string;
  /** seconds on screen */
  seconds: number;
  /** camera move name (drift | push | pan | zoom-through | static) */
  camera?: string;
  /** ambient systems by kit name (keys of AMBIENT_SYSTEMS) */
  ambient?: string[];
  /** Tick's verb in this shot, if Tick is in it ("measures", "flinches"); undefined = not in shot */
  tick?: string;
  /** transition INTO this shot */
  transition?: string;
  /** words of on-screen text outside chapter cards */
  words?: number;
  /** true for a chapter card / black beat (exempt from the ambient floor) */
  card?: boolean;
  /** does the subject itself change inside the shot (a reveal, a grow, a counter)? */
  subjectChange?: boolean;
};

export type ShotProblem = { id: string; problems: string[] };

/** The floor every non-card shot must meet (docs/STYLE-V2.md §4, ART-PROCESS §2). */
export const ambientFloor = (shot: Shot): string[] => {
  if (shot.card) return [];
  const kinds = new Set((shot.ambient ?? []).map((n) => AMBIENT_SYSTEMS[n]).filter(Boolean));
  if (shot.camera && shot.camera !== "static") kinds.add("camera");
  const missing: string[] = [];
  if (!kinds.has("particles")) missing.push("no particle system (Stars / Motes / Embers / fall ...)");
  if (!kinds.has("sway") && !kinds.has("surface") && !kinds.has("crowd")) missing.push("nothing sways, bobs, flows or walks");
  if (!kinds.has("light")) missing.push("no breathing light (flicker / pulse on a Bloom)");
  if (!kinds.has("camera")) missing.push("camera is static (every shot drifts unless it is a card)");
  return missing;
};

/** Lint a whole shot list: ambient floor, shot length, Tick budget, text budget, transition variety. */
export const lintShots = (shots: Shot[]): { perShot: ShotProblem[]; summary: string[] } => {
  const perShot: ShotProblem[] = [];
  let lastTransition = "";
  for (const s of shots) {
    const problems = ambientFloor(s);
    if (!s.card && s.seconds > 4 && !s.subjectChange && (!s.camera || s.camera === "static" || s.camera === "drift"))
      problems.push(`${s.seconds} s with no subject change and only a drift: add a reveal, a counter or a push`);
    if (s.tick !== undefined && s.tick.trim() === "") problems.push("Tick is in the shot without a verb");
    if ((s.words ?? 0) > 8 && !s.card) problems.push(`${s.words} words on screen (cap 8 outside cards)`);
    if (s.transition && s.transition === lastTransition && s.transition !== "cut") problems.push(`two ${s.transition} transitions in a row`);
    if (s.transition) lastTransition = s.transition;
    if (problems.length) perShot.push({ id: s.id, problems });
  }
  const total = shots.filter((s) => !s.card).length;
  const withTick = shots.filter((s) => !s.card && s.tick !== undefined).length;
  const share = total ? withTick / total : 0;
  const summary: string[] = [];
  if (total && (share < 0.2 || share > 0.4)) summary.push(`Tick is in ${Math.round(share * 100)} % of shots (target 20-40 %)`);
  const secs = shots.reduce((a, s) => a + s.seconds, 0);
  const cards = shots.filter((s) => s.card).length;
  if (secs > 120 && (cards < 2 || cards > 4)) summary.push(`${cards} chapter cards / black beats (target 2-4 per video)`);
  const perMin = shots.length / Math.max(1, secs / 60);
  if (perMin < 6 || perMin > 16) summary.push(`${perMin.toFixed(1)} shots per minute (3-8 cuts per 30 s is the target; pushes count as shots)`);
  return { perShot, summary };
};

/** Pretty print for a build log or a storyboard check. */
export const formatLint = (r: ReturnType<typeof lintShots>) =>
  [...r.perShot.map((p) => `${p.id}: ${p.problems.join("; ")}`), ...r.summary.map((s) => `shot list: ${s}`)].join("\n") || "shot list: clean";
