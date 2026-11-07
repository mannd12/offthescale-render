// Style frame v2 / 6: a sunny city cross-section ("noon" family). Towers with lit windows, a crane turning, traffic
// in both directions, people walking, and under the street a metro running, pipes flowing and piles reaching bedrock.
// No numbers claimed beyond the depth ruler's ticks (generic city, no named place).
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bobber,
  Cumulus,
  FAMILIES,
  Flock,
  Form,
  Gauge,
  GroundShadow,
  Headline,
  Kicker,
  Layer,
  Motes,
  P,
  Sky,
  Stage,
  Sway,
  Tick,
  blobPts,
  cameraAt,
  crawl,
  hazed,
  lane,
  loadIllustratedFonts,
  mixHex,
  rnd,
  roundPoly,
  rrect,
  walkPhase,
  walkSpeed,
} from "../lib/illustrated";

loadIllustratedFonts();

const F = FAMILIES.noon;
const STREET = 640;
const PPM = 11.5; // px per metre in the cross-section (40 m from street to frame bottom)
const L = 225;

const TOWERS = [
  { x: 60, w: 150, h: 300, c: "#9FC9B8" },
  { x: 240, w: 110, h: 420, c: "#E0B46A" },
  { x: 380, w: 170, h: 250, c: "#F1EADB" },
  { x: 590, w: 120, h: 520, c: "#C9755A" },
  { x: 740, w: 200, h: 340, c: "#9FC9B8" },
  { x: 990, w: 130, h: 460, c: "#F1EADB" },
  { x: 1160, w: 160, h: 290, c: "#E0B46A" },
  { x: 1360, w: 110, h: 380, c: "#C9755A" },
];

export const CityScene: React.FC = () => {
  const f = useCurrentFrame();
  const cam = cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1 }, { f: 600, x: 940, y: 560, zoom: 1.05 }]);
  const cars = lane(f, 5, -100, 1700, 2.2, 3, 1);
  const cars2 = lane(f, 4, -100, 1700, 1.8, 5, -1);
  const train = ((f * 3.2) % 2300) - 500;
  const crane = Math.sin(f / 260) * 18;
  const hero = 300 + f * walkSpeed(26, 40);
  const ppl = lane(f, 7, -40, 1700, 0.5, 9, 1);
  return (
    <Stage theme={F.theme} vignette={0.08} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        {/* sun upper left */}
        <circle cx={300} cy={150} r={54} fill="#FFF3C9" />
        <circle cx={300} cy={150} r={120} fill="#FFF3C9" opacity={0.18} />
      </Layer>
      {/* clouds and far hills */}
      <Layer depth={0.15} haze={{ color: F.haze, amount: 0.3 }}>
        {[
          [200, 250, 1, 260, 60],
          [900, 190, 2, 200, 48],
          [1500, 280, 3, 320, 70],
        ].map(([x, y, s, w, h], i) => {
          const dx = f * (0.12 + s * 0.04);
          const cx = ((x + dx + 300) % 2500) - 300;
          return <Cumulus key={i} x={cx} y={y} w={w} h={h} fill="#FFFFFF" shade={mixHex(F.far, "#FFFFFF", 0.35)} lit="#FFFFFF" light={L} seed={s * 3} frame={f} />;
        })}
        <path d={roundPoly([[-300, STREET], [-300, 560], [200, 520], [600, 545], [1000, 505], [1400, 540], [1800, 515], [2300, 560], [2300, STREET]], 60)} fill={hazed(F, F.mid, 0.4)} />
      </Layer>
      {/* skyline */}
      <Layer depth={0.5} haze={{ color: F.haze, amount: 0.1 }}>
        {TOWERS.map((t, i) => (
          <g key={i}>
            <Form d={rrect(t.x, STREET - t.h, t.w, t.h + 10, 8)} fill={t.c} light={L} shadow={F.shadow} inset={Math.min(22, t.w * 0.16)} shadowOpacity={0.35} rim="#FFFFFF" rimWidth={2} rimOpacity={0.6}>
              {/* windows: a grid, some lit */}
              {Array.from({ length: Math.floor((t.h - 30) / 34) }, (_, r) =>
                Array.from({ length: Math.floor((t.w - 24) / 26) }, (_, c) => {
                  const on = rnd(i * 97 + r * 13 + c * 7 + Math.floor(f / 150)) > 0.78;
                  return <rect key={r + "-" + c} x={t.x + 14 + c * 26} y={STREET - t.h + 18 + r * 34} width={14} height={18} rx={2} fill={on ? "#FFE9A8" : mixHex(t.c, F.shadow, 0.35)} opacity={on ? 0.95 : 0.6} />;
                }),
              )}
            </Form>
            {/* roof details */}
            <rect x={t.x + t.w * 0.3} y={STREET - t.h - 14} width={10} height={14} fill={F.shadow} opacity={0.6} />
            {i % 3 === 0 ? <rect x={t.x + t.w * 0.6} y={STREET - t.h - 30} width={26} height={30} rx={3} fill={mixHex(t.c, F.shadow, 0.2)} /> : null}
          </g>
        ))}
        {/* crane */}
        <g transform={`translate(1340 ${STREET})`}>
          <rect x={-8} y={-560} width={16} height={560} fill="#C9755A" />
          <g transform={`rotate(${crane.toFixed(2)} 0 -560)`}>
            <rect x={-200} y={-568} width={440} height={10} rx={3} fill="#C9755A" />
            <path d="M-200 -568 L0 -640 L240 -568" fill="none" stroke="#C9755A" strokeWidth={5} />
            <rect x={-200} y={-560} width={70} height={30} fill={F.shadow} opacity={0.7} />
            <line x1={190} y1={-558} x2={190} y2={-420 + Math.sin(f / 90) * 30} stroke={F.shadow} strokeWidth={2} />
            <rect x={175} y={-420 + Math.sin(f / 90) * 30} width={30} height={24} rx={3} fill="#E0B46A" />
          </g>
        </g>
        <Flock frame={f} x={-100} y={300} vx={1.4} n={5} size={8} color={F.shadow} seed={5} />
        {/* trees along the street */}
        {[180, 470, 950, 1300, 1700].map((x, i) => (
          <Sway key={i} frame={f} x={x} y={STREET} amp={1.5} period={140} seed={i}>
            <rect x={x - 4} y={STREET - 46} width={8} height={46} fill={F.shadow} opacity={0.8} />
            <Form d={roundPoly(blobPts(x, STREET - 70, 34, 9, i + 2, 0.18), 16)} fill={F.near} light={L} shadow={F.shadow} inset={12} rim="#FFFFFF" rimWidth={2} rimOpacity={0.5} />
          </Sway>
        ))}
      </Layer>
      {/* street: traffic and people */}
      <Layer depth={1}>
        <rect x={-400} y={STREET - 6} width={2720} height={36} fill={mixHex(F.shadow, F.text, 0.15)} />
        <rect x={-400} y={STREET - 6} width={2720} height={4} fill={mixHex(F.text, "#fff", 0.6)} opacity={0.6} />
        <g stroke="#FFF3C9" strokeWidth={3} strokeDasharray="28 26" strokeDashoffset={crawl(f, 0)}>
          <line x1={-400} y1={STREET + 12} x2={2320} y2={STREET + 12} />
        </g>
        {cars.map((c, i) => {
          const col = ["#C9755A", "#3E7A86", "#E0B46A", "#F1EADB", "#5E8F86"][i % 5];
          return (
            <Bobber key={i} frame={f} x={c.x} y={STREET} amp={1} roll={0} period={14} seed={i}>
              <Form d={roundPoly([[c.x, STREET - 2], [c.x, STREET - 18], [c.x + 14, STREET - 20], [c.x + 22, STREET - 32], [c.x + 54, STREET - 32], [c.x + 64, STREET - 20], [c.x + 80, STREET - 18], [c.x + 80, STREET - 2]], 6)} fill={col} light={L} shadow={F.shadow} inset={6} rim="#fff" rimWidth={1.5} rimOpacity={0.6} />
              <rect x={c.x + 26} y={STREET - 30} width={24} height={10} rx={2} fill={mixHex(F.sky[0], "#fff", 0.4)} />
              <circle cx={c.x + 18} cy={STREET - 2} r={6} fill={F.shadow} />
              <circle cx={c.x + 62} cy={STREET - 2} r={6} fill={F.shadow} />
            </Bobber>
          );
        })}
        {cars2.map((c, i) => (
          <g key={"b" + i}>
            <Form d={roundPoly([[c.x, STREET + 26], [c.x, STREET + 2], [c.x + 110, STREET + 2], [c.x + 110, STREET + 26]], 6)} fill={i % 2 ? "#E0B46A" : "#9FC9B8"} light={L} shadow={F.shadow} inset={6} rim="#fff" rimWidth={1.5} rimOpacity={0.6} />
            {[0, 1, 2, 3].map((k) => (
              <rect key={k} x={c.x + 8 + k * 26} y={STREET + 7} width={18} height={10} rx={2} fill={mixHex(F.sky[0], "#fff", 0.4)} />
            ))}
            <circle cx={c.x + 20} cy={STREET + 28} r={6} fill={F.shadow} />
            <circle cx={c.x + 90} cy={STREET + 28} r={6} fill={F.shadow} />
          </g>
        ))}
        {/* people on the pavement: grey walkers, and our vermilion hero with the staff */}
        {ppl.map((p, i) => (
          <Tick key={i} x={p.x} y={STREET - 6} pxPerM={22} frame={f} walk={walkPhase(f, 44, i * 0.3)} color={["#5E6B7A", "#8E8A80", "#4A5A66"][i % 3]} visor="#E8E0D0" seed={i + 20} />
        ))}
        <GroundShadow x={hero} y={STREET - 4} rx={14} color={F.shadow} opacity={0.3} blur={4} />
        <Tick x={hero} y={STREET - 6} pxPerM={26} frame={f} walk={walkPhase(f, 40)} expression="determined" staff seed={1} />
      </Layer>
      {/* underground cross-section */}
      <Layer depth={1}>
        <rect x={-400} y={STREET + 30} width={2720} height={800} fill="#B9A27E" />
        <rect x={-400} y={STREET + 30} width={2720} height={60} fill="#A58B67" />
        {/* soil strata, stepped bands */}
        <rect x={-400} y={STREET + 90} width={2720} height={160} fill="#9C8465" />
        <rect x={-400} y={STREET + 250} width={2720} height={150} fill="#8A7458" />
        <rect x={-400} y={STREET + 400} width={2720} height={200} fill="#6C5A48" />
        {/* piles under the towers down to bedrock */}
        {TOWERS.map((t, i) => (
          <g key={i} opacity={0.9}>
            {[0.25, 0.75].map((k) => (
              <rect key={k} x={t.x + t.w * k - 7} y={STREET + 30} width={14} height={Math.min(380, 150 + t.h * 0.45)} rx={4} fill={mixHex(t.c, F.shadow, 0.55)} />
            ))}
            <rect x={t.x} y={STREET + 30} width={t.w} height={46} rx={6} fill={mixHex(t.c, F.shadow, 0.45)} />
          </g>
        ))}
        {/* pipes: water (teal) and gas (ochre) with a flow crawl */}
        <rect x={-400} y={STREET + 100} width={2720} height={14} rx={7} fill="#3E7A86" />
        <line x1={-400} y1={STREET + 107} x2={2320} y2={STREET + 107} stroke="#8ED0D8" strokeWidth={3} strokeDasharray="22 30" strokeDashoffset={crawl(f, 1.6)} />
        <rect x={-400} y={STREET + 130} width={2720} height={12} rx={6} fill="#E0B46A" />
        <line x1={-400} y1={STREET + 136} x2={2320} y2={STREET + 136} stroke="#FFE9A8" strokeWidth={2.5} strokeDasharray="14 24" strokeDashoffset={crawl(f, -1.1)} />
        {/* metro tunnel with a moving train */}
        <rect x={-400} y={STREET + 270} width={2720} height={110} rx={55} fill="#4B3F34" />
        <rect x={-400} y={STREET + 272} width={2720} height={106} rx={53} fill="none" stroke="#2E2620" strokeWidth={3} />
        <g>
          {[0, 1, 2].map((k) => (
            <g key={k}>
              <rect x={train + k * 250} y={STREET + 292} width={236} height={66} rx={14} fill={P.vermilion} />
              <rect x={train + k * 250} y={STREET + 292} width={236} height={22} rx={12} fill={mixHex(P.vermilion, "#fff", 0.2)} />
              {[0, 1, 2, 3, 4, 5].map((w) => (
                <rect key={w} x={train + k * 250 + 14 + w * 36} y={STREET + 312} width={26} height={22} rx={4} fill="#FFE9A8" />
              ))}
            </g>
          ))}
          <circle cx={train + 740} cy={STREET + 325} r={6} fill="#FFF3C9" />
        </g>
        <line x1={-400} y1={STREET + 362} x2={2320} y2={STREET + 362} stroke="#2E2620" strokeWidth={4} />
        {/* bedrock */}
        <path d={roundPoly([[-400, STREET + 600], [200, STREET + 580], [700, STREET + 610], [1200, STREET + 585], [1700, STREET + 605], [2320, STREET + 590], [2320, 1400], [-400, 1400]], 30)} fill="#55606A" />
        <Motes frame={f} n={16} x={0} y={STREET + 40} w={1900} h={540} color={F.light} seed={7} size={1.5} drift={4} glow={false} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={128} text="Chapter one" color={F.dim} size={20} />
        <Headline x={120} y={236} lines={["Start where", "you live"]} size={84} color={F.text} accent={P.vermilion} shadow="#FFFFFF" />
        <Gauge x={1800} y={STREET + 30} height={38 * PPM} value={32} max={40} unit="m" theme={F.theme} direction="down" title="DEPTH" side="left" plate={96} marker={false} readout={false} unitCap={false} format={(v) => `${v} m`} />
      </Layer>
    </Stage>
  );
};
