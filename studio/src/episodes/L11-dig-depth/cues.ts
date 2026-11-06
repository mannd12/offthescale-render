// Cold-open cue sheet: every shot change and sound hit is keyed to a phrase in the narration, so the picture, the
// SFX and the music all re-sync when the voice is re-taken. Frames are scene-relative (the cold scene starts at 0).
// Phrase position is estimated from its character offset in the line (good to a few frames at an even pace).
import { SceneTiming } from "../../lib/timeline";

export const phraseAt = (t: SceneTiming, i: number, phrase: string, offset = 0) => {
  const l = t.lines[i];
  const k = l.text.indexOf(phrase);
  if (k < 0) throw new Error(`cue "${phrase}" not in cold line ${i}`);
  return l.at + Math.round((l.audioFrames * k) / l.text.length) + offset;
};

export type ColdCues = ReturnType<typeof coldCues>;

export const coldCues = (t: SceneTiming) => {
  const at = (i: number) => t.lines[i].at;
  const p = (i: number, s: string, o = 0) => phraseAt(t, i, s, o);
  return {
    // line 0: the cap
    kola: p(0, "Kola"),
    arctic: p(0, "Arctic"),
    cap: p(0, "there's a metal cap", -4), // shot: close-up of the cap
    bolted: p(0, "bolted"),
    width: p(0, "twenty-three"),
    plate: p(0, "You could cover"),
    plateLand: p(0, "dinner plate", 8),
    // line 1: the hole
    section: at(1) - 6, // shot: block section, camera already falling toward the hole
    dive: p(1, "a hole"), // shot: the dive down the borehole
    bottom: p(1, "two metres", -2), // shot: the gauge runs off the scale
    ocean: p(1, "the deepest"), // shot: the ocean dropped into the hole
    oceanLand: p(1, "into it"),
    spare: p(1, "more than"),
    // line 2: the crust, twenty years, the planet, the villain
    crust: at(2) - 8, // shot: zoom out to the crust
    third: p(2, "a third"),
    rig: p(2, "Engineers"), // shot: the rig, years passing
    stopped: p(2, "Then they stopped"),
    planet: p(2, "Not because"), // shot: zoom out to the whole planet
    fought: p(2, "Something"), // shot: the bottom of the hole fights back
    // line 3: the question
    title: at(3) - 2, // shot: title card over the landscape
    andIf: p(3, "And if"), // the camera starts to turn toward the sea
    anotherWay: p(3, "another way"),
    end: t.frames,
  };
};
