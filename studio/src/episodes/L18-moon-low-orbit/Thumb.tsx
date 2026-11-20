// L18 thumbnails (package.md "Thumbnail concepts", with its grey Moon overridden to WARM TAN: storyboard F7, BUILD.md §2;
// PRODUCTION-PLAN 7b.7 grammar: 1-3 capital words + one central object, 40 px from every edge, 150 px type).
// A `L18MoonLowOrbit-thumb-a` "TOO CLOSE": a huge warm Moon fills the upper two thirds of a black-teal sky; under it a thin
//   blue Earth limb with a cloud band and a tiny generic station symbol for scale. Colour runs black-teal → tan → one line
//   of blue. No people (F1), no insignia (F12).
// B `L18MoonLowOrbit-thumb-b` "78 DEGREES": the same warm Moon drawn as the 78-degree wedge on the half-circle sky, a
//   coin-sized TODAY Moon in the top-right corner. 78 is READ.deg78 (row 12, class C; the OUR SUM pill lives in the video).
// Drawn in 1920×1080 units and scaled to 1280×720 (so 225 units = 150 px, 60 units = 40 px).
import React from "react";
import { AbsoluteFill } from "remotion";
import { IF, Sky, loadIllustratedFonts } from "../../lib/illustrated";
import { L18_COLORS as C, familyOf } from "./families";
import { READ, assertAllowed } from "./data18";
import { MoonFace, SkyBowl } from "./sky";
import { EarthLimb } from "./planets18";
import { StationToken } from "./planets18";
import { StarsTint18 } from "./movers18";
import { MoonToken } from "./gauge";

loadIllustratedFonts();

const W = 1920;
const H = 1080;
const TYPE = 225; // = 150 px at 1280
const EDGE = 60; // = 40 px at 1280

const Words: React.FC<{ words: [string, string]; second: string; x?: number; anchor?: "start" | "middle" }> = ({ words, second, x = EDGE, anchor = "start" }) => (
  <text
    x={x}
    y={H - EDGE - 6}
    textAnchor={anchor}
    style={{ fontFamily: IF.label, fontSize: TYPE, letterSpacing: 3, stroke: "#01121B", strokeWidth: 16, paintOrder: "stroke", strokeLinejoin: "round" }}
  >
    <tspan fill="#FFE2A8">{words[0]} </tspan>
    <tspan fill={second}>{words[1]}</tspan>
  </text>
);

const ArtA: React.FC = () => {
  const abyss = familyOf("abyss");
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <Sky family={abyss} x={0} y={0} w={W} h={H} />
      <StarsTint18 f={0} w={W} h={H} n={90} speed={0} seed={4} size={2.6} />
      <MoonFace f={0} x={960} y={-250} radius={910} grid terminator={0.62} rim={1.2} seed={3} />
      <EarthLimb f={0} y={975} R={4600} cx={960} cloudSpeed={0} />
      <StationToken x={1540} y={880} size={78} f={2} angle={-6} />
    </svg>
  );
};

const ArtB: React.FC = () => {
  const bowl = familyOf("bowl");
  const cx = 960;
  const hz = 780;
  const d = 455;
  const r = d * Math.sin((39 * Math.PI) / 180); // the disc subtends 78 deg from the observer (row 12)
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <Sky family={bowl} x={0} y={0} w={W} h={H} />
      <SkyBowl f={0} family={bowl} cx={cx} horizon={hz} R={720} wedge={[51, 129]} labels={false} />
      <MoonFace f={0} x={cx} y={hz - d} radius={r} grid terminator={0.55} seed={5} />
      <MoonToken x={1760} y={150} r={16} f={0} />
      <text x={1760} y={222} textAnchor="middle" style={{ fontFamily: IF.label, fontSize: 40, letterSpacing: 3, fill: "#FFEBC2", stroke: "#032536", strokeWidth: 8, paintOrder: "stroke" }}>
        TODAY
      </text>
    </svg>
  );
};

const deg = assertAllowed(READ.deg78.text, "thumb-b");

/** L18MoonLowOrbit-thumb-a: "TOO CLOSE" (recommended; the second word in the MEASURED saffron). */
export const ThumbL18A: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.petrol, overflow: "hidden" }}>
    <ArtA />
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <Words words={["TOO", "CLOSE"]} second={C.measured} />
    </svg>
  </AbsoluteFill>
);

/** L18MoonLowOrbit-thumb-b: "78 DEGREES" (Test & Compare). */
export const ThumbL18B: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.petrol, overflow: "hidden" }}>
    <ArtB />
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <Words words={[deg.split(" ")[0], deg.split(" ")[1]]} second={C.measured} x={W / 2} anchor="middle" />
    </svg>
  </AbsoluteFill>
);
