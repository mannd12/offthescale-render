// Kit v2 motion test (8 s, 240 frames): ambient motion on the dusk world, Tick walking in, stopping with a landing
// squash and pointing, then a zoom-through into the ground that lands in the cavern. Registered as `v2-motion-test`.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PaperGrain, ZoomThrough, flash, impact, prog, walkPhase, walkSpeed } from "../lib/illustrated";
import { DuskScene } from "./Dusk";
import { CavernScene } from "./Cavern";

export const MOTION_TEST_FRAMES = 240;
const WALK_END = 118;
const ZOOM_AT = 150;
const ZOOM_DUR = 50;

export const MotionTest: React.FC = () => {
  const f = useCurrentFrame();
  const ppm = 92;
  const stride = 40;
  const speed = walkSpeed(ppm, stride);
  const walking = f < WALK_END;
  const x = 340 + Math.min(f, WALK_END) * speed;
  const sq = impact(f, WALK_END, 0.14, 12);
  const t = prog(f, ZOOM_AT, ZOOM_DUR);
  const dusk = (
    <DuskScene
      title={false}
      grain={0}
      camKeys={[
        { f: 0, x: 960, y: 540, zoom: 1 },
        { f: ZOOM_AT, x: 900, y: 600, zoom: 1.1 },
      ]}
      tick={{
        x,
        walk: walking ? walkPhase(f, stride) : undefined,
        pose: walking ? "stand" : "point",
        expression: walking ? "determined" : f < WALK_END + 20 ? "surprised" : "worried",
        look: walking ? 0.2 : 0.7,
        squash: sq,
        staff: true,
      }}
    />
  );
  const cavern = (
    <CavernScene
      f0={-ZOOM_AT}
      title={false}
      grain={0}
      camKeys={[
        { f: 0, x: 900, y: 520, zoom: 1.15 },
        { f: 90, x: 960, y: 560, zoom: 1 },
      ]}
      tick={{ pose: "stand", expression: f < ZOOM_AT + 75 ? "surprised" : "worried", look: Math.sin((f - ZOOM_AT) / 20) * 0.8 }}
    />
  );
  const fl = flash(f, ZOOM_AT + ZOOM_DUR * 0.55, 10, 0.35);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {f < ZOOM_AT ? dusk : f >= ZOOM_AT + ZOOM_DUR ? cavern : <ZoomThrough t={t} focal={{ x: 640, y: 905 }} from={dusk} to={cavern} maxScale={7} />}
      {fl > 0 ? <AbsoluteFill style={{ background: "#FFD28A", opacity: fl }} /> : null}
      {/* one screen-locked grain over everything, so the zoom-through does not magnify the paper */}
      <PaperGrain frame={f} dark amount={0.5} />
    </AbsoluteFill>
  );
};
