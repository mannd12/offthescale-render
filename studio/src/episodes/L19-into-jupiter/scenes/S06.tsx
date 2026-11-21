// L19 scene "l06" (storyboard §3 "6 · No floor", script lines 34-38). Package B.
// ShotDefs (all hard cuts): 6-01 · 6-02 · 6-03 · 6-04 · 6-05 · 6-06 · 6-07 · 6-08 · 6-09 · 6-10 · 6-11.
// Numbers drawn (data19 READ): ABOUT 1.3 TIMES WATER (#8 A, 1,326 kg/m3) on 6-02. Everything else is words (class B / row 10, 11
// wordings): NO FLOOR (#10), PRESSURE, TEMPERATURE (no numerals), LIKE A METAL, MAY HELP MAKE THE FIELD (#10), MOST MODELS,
// HELIUM RAIN (MODEL) (#11), NOT MEASURED (device). 6-09 carries NO tag (Q7 softened 2026-11-19: the gradient is the helium shot's tail).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Embers, Layer, Motes, Stage, Tick } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ } from "../data19";
import { Ledger, Reel, TapeTicket } from "../tape";
import { GhostProbe } from "../probe19";
import { Balance, GoldLayer } from "../interior";
import { WordPill } from "../tags19";
import { Rain19, Sparks, StarsTint, Sweep19 } from "../flows19";
import { Compass, WaterDrop } from "../icons19";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { BandField19, C, ChipRow, Console, DRIFT, DarkSky, FamSky, Floor, GlowBands, GlowRings, JunoArc, Label, Planet, Pop, Readout, cl, ez, fr, lin, mod, rnd, uid } from "./b-parts";

export const cuesL06 = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    s601: 0,
    s602: frac(0, 0.35),
    s603: frac(0, 0.68),
    s604: at(1),
    s605: at(2),
    s606: frac(2, 0.5),
    s607: at(3),
    s608: frac(3, 0.4),
    s609: frac(3, 0.8),
    s610: at(4),
    s611: frac(4, 0.5),
    end: t.frames,
  };
};
export type C06 = ReturnType<typeof cuesL06>;

const FU = familyOf("furnace");
const SC = familyOf("scope");
const LI = familyOf("limb");

/** The furnace field: dark crimson-brown, its tone bands sliding, glow bands rising (the models' world). */
const Furnace: React.FC<{ f: number; glow?: number; speed?: number }> = ({ f, glow = 0.26, speed = 22 }) => (
  <>
    <Layer depth={0.1}>
      <DarkSky name="furnace" />
      <BandField19 f={f} k="furnace" />
    </Layer>
    <Layer depth={0.5}>
      <GlowBands f={f} speed={speed} opacity={glow} />
    </Layer>
  </>
);
/** The station field: emerald sky, sliding tone bands. */
const Station: React.FC<{ f: number }> = ({ f }) => (
  <Layer depth={0.1}>
    <FamSky name="scope" />
    <BandField19 f={f} k="scope" />
  </Layer>
);

// ===============================================================================================================
// 6-01 · NO FLOOR: the ghost probe falls; a dotted floor line draws itself below (40 px/f) and then recedes away, again and again
// ===============================================================================================================
const Shot601: ShotFC<C06> = ({ f, len }) => {
  const P = 34;
  return (
    <Pop f={f}>
      <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(61)} vignette={0.24} grain={0.5}>
        <Furnace f={f} />
        <Layer depth={1}>
          <Bloom x={960} y={1240} r={900} color={C.glow} strength={0.45} />
          {[0, 1, 2, 3].map((k) => {
            const age = mod(f - k * P, 4 * P);
            const draw = cl(age / 24);
            const y = 640 + age * 9;
            const o = 1 - cl((age - 30) / (4 * P - 30));
            const x0 = 160;
            const L = 1600 * draw;
            return (
              <g key={k} opacity={o}>
                <line x1={x0} y1={y} x2={x0 + L} y2={y} stroke={C.goldHot} strokeWidth={10} strokeDasharray="4 26" strokeLinecap="round" />
                {draw < 1 ? <circle cx={x0 + L} cy={y} r={14} fill="#FFF0A0" /> : null}
              </g>
            );
          })}
          <GhostProbe x={900} y={300 + 90 * lin(f, 0, len)} r={115} f={f} />
          <Embers frame={f} x0={100} x1={1800} y={1100} n={36} color={C.goldHot} seed={61} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={1180} y={180} text="NO FLOOR" size={46} F={FU} appear={lin(f, 8, 20)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-02 · the balance: a water ball left, Jupiter's disc right; the beam tips toward Jupiter; ripples; the disc's bands slide.
//        Tick (≥ 40 % of the frame) behind the balance, hand out to the beam.
// ===============================================================================================================
const BX = 820;
const BY = 360;
const BS = 1.3;
const discAt = (f: number, tilt: number, wobble: number) => {
  const a = ((tilt + Math.sin(f * 0.18) * wobble) * Math.PI) / 180;
  const arm = 300 * BS;
  return {
    lx: BX - Math.cos(a) * arm,
    ly: BY - Math.sin(a) * arm + 80 * BS,
    rx: BX + Math.cos(a) * arm,
    ry: BY + Math.sin(a) * arm + 78 * BS,
  };
};
const Shot602: ShotFC<C06> = ({ f, len }) => {
  const tilt = -6 + 18 * ez(f, 6, 30);
  const wob = 2.2;
  const d = discAt(f, tilt, wob);
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(62)} vignette={0.14} grain={0.5}>
        <Station f={f} />
        <Layer depth={0.9}>
          <Floor y={980} />
          <Tick x={1460} y={984} pxPerM={262} frame={f} facing={-1} pose="point" expression="thinking" look={-0.4} headTilt={6 * Math.sin(f * 0.08)} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={BX} y={BY + 200} r={620} color="#FFE08A" strength={0.3} />
          <Balance f={f} x={BX} y={BY} tilt={tilt} wobble={wob} size={BS} />
          <GlowRings f={f} cx={d.lx} cy={d.ly} every={14} speed={2.2} r0={20} maxR={64} color="#FFF6DC" width={4} />
          <Planet cx={d.rx} cy={d.ry} r={64} f={f} shear={[18, -16, 20, -14]} />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#FFE7A0" seed={62} size={3} drift={20} />
        </Layer>
        <Layer depth={0}>
          <Readout x={70} y={60} value={READ.rho13.value! /* #8 A (1,326 kg/m3) */} dec k={lin(f, 4, 40)} pre="ABOUT" unit="TIMES WATER" size={84} w={760} plate={SC.shadow} appear={lin(f, 0, 10)} who="6-02 1.3" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-03 · "a bit heavier than a ball of water": a water ball and Jupiter's disc of the same size on one beam; a third-of-a-ball
//        block drops in (28 px/f) beside the water ball and the beam levels; ripples spread; bands slide. Tick leans and squints.
// ===============================================================================================================
const Shot603: ShotFC<C06> = ({ f, len }) => {
  const drop = ez(f, 10, 10 + 900 / 28);
  const level = ez(f, 10 + 900 / 28 - 4, 10 + 900 / 28 + 18);
  const tilt = 7 * (1 - level) + Math.sin(f * 0.2) * 1.2;
  const a = (tilt * Math.PI) / 180;
  const cx = 860;
  const cy = 700;
  const arm = 380;
  const lx = cx - Math.cos(a) * arm;
  const ly = cy - Math.sin(a) * arm;
  const rx = cx + Math.cos(a) * arm;
  const ry = cy + Math.sin(a) * arm;
  const R = 150;
  const by = -260 + (ly - 70 - -260) * drop;
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(63)} vignette={0.14} grain={0.5}>
        <Station f={f} />
        <Layer depth={0.9}>
          <Floor y={1000} />
          <Tick x={1560} y={1004} pxPerM={250} frame={f} facing={-1} pose="lean" expression="thinking" look={-0.5} tilt={-6} headTilt={10} />
        </Layer>
        <Layer depth={1}>
          <path d={`M${cx - 70} 1000 L${cx + 70} 1000 L${cx + 16} ${cy} L${cx - 16} ${cy} Z`} fill={C.goldRim} />
          <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.gold} strokeWidth={22} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={26} fill={C.goldHot} stroke={C.goldRim} strokeWidth={5} />
          {/* the water ball, sitting on the left end */}
          <circle cx={lx} cy={ly - R - 10} r={R} fill={C.belt} stroke="#7FE6F5" strokeWidth={6} />
          <ellipse cx={lx - R * 0.35} cy={ly - R * 1.4} rx={R * 0.3} ry={R * 0.18} fill="#9FEFF8" opacity={0.7} />
          <GlowRings f={f} cx={lx} cy={ly - R - 10} every={16} speed={6} r0={10} maxR={R - 8} color="#DFFBFF" width={5} />
          {/* the third-of-a-ball block that evens the beam */}
          <rect x={lx - R - 120} y={by} width={110} height={70} rx={14} fill={C.belt} stroke="#7FE6F5" strokeWidth={5} />
          <WaterDrop x={lx - R - 65} y={by + 35} size={44} color="#DFFBFF" />
          {/* Jupiter's disc, same size, on the right end */}
          <Planet cx={rx} cy={ry - R - 10} r={R} f={f} shear={[18, -16, 20, -14]} />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#FFE7A0" seed={63} size={3} drift={20} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-04 · squeezed into a liquid: amber gas dots fall and pack (22 px/f) into a molten orange pool whose front rises; PRESSURE and
//        TEMPERATURE arrows pulse upward (chevrons 20 px/f)
// ===============================================================================================================
const Shot604: ShotFC<C06> = ({ f, len }) => {
  const poolTop = 900 - 330 * ez(f, 0, len);
  const id = uid();
  return (
    <Pop f={f}>
      <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(64)} vignette={0.22} grain={0.5}>
        <Furnace f={f} />
        <Layer depth={1}>
          {/* gas dots falling and packing toward the pool */}
          {Array.from({ length: 90 }, (_, i) => {
            const x = 300 + rnd(i * 3 + 1) * 1320;
            const sp = 22 * (0.7 + rnd(i * 5) * 0.6);
            const span = poolTop + 40;
            const y = -40 + mod(rnd(i * 7) * span + f * sp, span);
            const near = cl((y - (poolTop - 260)) / 260);
            return <circle key={i} cx={x + Math.sin(f * 0.1 + i) * 6 * (1 - near)} cy={y} r={9 + 5 * rnd(i * 11) - 3 * near} fill={i % 3 ? C.gas : C.goldHot} opacity={0.9} />;
          })}
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FF9640" />
              <stop offset="0.3" stopColor={C.liquid} />
              <stop offset="1" stopColor="#B22A10" />
            </linearGradient>
          </defs>
          <path
            d={`M-300 1400 L-300 ${poolTop} ${Array.from({ length: 30 }, (_, k) => `L${-300 + k * 90} ${poolTop + Math.sin(k * 0.9 + f * 0.25) * 12}`).join(" ")} L2400 ${poolTop} L2400 1400 Z`}
            fill={`url(#${id})`}
          />
          <path d={`M-300 ${poolTop} ${Array.from({ length: 30 }, (_, k) => `L${-300 + k * 90} ${poolTop + Math.sin(k * 0.9 + f * 0.25) * 12}`).join(" ")}`} fill="none" stroke={C.goldHot} strokeWidth={8} opacity={0.9} />
          {/* the two arrows, chevrons marching up */}
          {[160, 1700].map((ax, j) => (
            <g key={ax}>
              <rect x={ax - 50} y={170} width={100} height={700} rx={50} fill="#4A0F06" opacity={0.7} stroke={C.lever} strokeWidth={4} />
              {Array.from({ length: 6 }, (_, i) => {
                const yy = 820 - mod(i * 120 + f * 20, 720);
                return <path key={i} d={`M${ax - 32} ${yy + 22} L${ax} ${yy - 10} L${ax + 32} ${yy + 22}`} stroke={C.goldHot} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.4 + 0.6 * cl((yy - 170) / 300)} />;
              })}
              <Label x={ax} y={140} text={j === 0 ? "PRESSURE" : "TEMPERATURE"} size={32} color={C.goldHot} align={j === 0 ? "start" : "end"} halo="#3A0A04" />
            </g>
          ))}
          <Sparks f={f} x={960} y={poolTop} w={400} h={900} n={18} speed={22} angle={-90} seed={64} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-05 · "like a metal": the liquid turns hot gold behind a sweeping front (30 px/f); zig-zag sparks run through it (36 px/f)
// ===============================================================================================================
const Shot605: ShotFC<C06> = ({ f, len }) => (
  <Pop f={f}>
    <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(65)} vignette={0.22} grain={0.5}>
      <Furnace f={f} />
      <Layer depth={1}>
        <Bloom x={960} y={640} r={900} color={C.gold} strength={0.3 * lin(f, 0, len)} />
        <GoldLayer f={f} x={100} y={330} w={1720} h={620} fill={lin(f, 2, 2 + 1720 / 30)} sparks currents={false} />
        <Sparks f={f + 30} x={100} y={400} w={1720} h={480} mode="zigzag" speed={36} seed={65} />
      </Layer>
      <Layer depth={0}>
        <TapeTicket x={290} y={170} word="MODEL" f={f} slam={lin(f, 4, 16)} size={0.95} />
        <WordPill x={560} y={170} text="LIKE A METAL" size={40} F={FU} appear={lin(f, 12, 24)} />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 6-06 · the station: a small screen shows the planet with field loops turning (5 deg/f); Tick holds a compass up and its needle
//        swings (10 deg/f); the screen's planet bands slide
// ===============================================================================================================
const Shot606: ShotFC<C06> = ({ f }) => {
  const sx = 230;
  const sy = 150;
  const sw = 980;
  const sh = 680;
  const pcx = sx + sw / 2;
  const pcy = sy + sh / 2;
  const id = uid();
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(66)} vignette={0.14} grain={0.5}>
        <Station f={f} />
        <Layer depth={1}>
          <rect x={sx - 30} y={sy - 30} width={sw + 60} height={sh + 60} rx={44} fill="#004A2E" stroke="#40D486" strokeWidth={5} />
          <defs>
            <clipPath id={id}>
              <rect x={sx} y={sy} width={sw} height={sh} rx={26} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id})`}>
            <rect x={sx} y={sy} width={sw} height={sh} fill="#2A0804" />
            <StarsTint f={f} x={sx} y={sy} w={sw} h={sh} n={40} speed={6} seed={66} />
            <g transform={`rotate(${(f * 5) % 360} ${pcx} ${pcy})`}>
              {[1, 1.5, 2.1].map((k, i) => (
                <g key={i}>
                  <ellipse cx={pcx + 150 * k} cy={pcy} rx={150 * k} ry={95 * k} fill="none" stroke={C.starAqua} strokeWidth={6} strokeDasharray="30 18" opacity={0.85 - i * 0.2} />
                  <ellipse cx={pcx - 150 * k} cy={pcy} rx={150 * k} ry={95 * k} fill="none" stroke={C.starAqua} strokeWidth={6} strokeDasharray="30 18" opacity={0.85 - i * 0.2} />
                </g>
              ))}
            </g>
            <Planet cx={pcx} cy={pcy} r={150} f={f} shear={[20, -18, 22, -16]} />
          </g>
          <Console x={140} y={880} w={1200} f={f} />
          <Floor y={1010} />
          <Tick x={1520} y={1014} pxPerM={230} frame={f} facing={-1} pose="hold" expression="thinking" look={-0.5} headTilt={5 * Math.sin(f * 0.1)} />
          <Compass x={1360} y={640} size={130} f={f} spin={10} />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#FFE7A0" seed={66} size={3} drift={20} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={1260} y={110} text="MAY HELP MAKE THE FIELD" size={30} F={SC} appear={lin(f, 8, 20)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-07 · MOST MODELS: a cross-section strip, orange liquid on top, a thick hot-gold layer below filling in (30 px/f), currents
//        circling, the glow flowing; the camera pans down onto the gold
// ===============================================================================================================
const Shot607: ShotFC<C06> = ({ f, len }) => {
  const camY = 500 + 120 * ez(f, 0, len);
  return (
    <Pop f={f}>
      <Stage theme={FU.theme} cam={{ x: 960 + 40 * Math.sin(f * 0.02), y: camY, zoom: 1.04 + 0.08 * lin(f, 0, len) }} vignette={0.22} grain={0.5}>
        <Furnace f={f} />
        <Layer depth={1}>
          <rect x={-200} y={120} width={2320} height={300} fill={C.liquid} />
          {Array.from({ length: 7 }, (_, i) => (
            <ellipse key={i} cx={-200 + mod(i * 360 + f * 22, 2520)} cy={260 + (i % 2) * 60} rx={130} ry={18} fill="#FF9640" opacity={0.5} />
          ))}
          <rect x={-200} y={410} width={2320} height={16} fill={C.goldHot} opacity={0.6} />
          <GoldLayer f={f} x={60} y={430} w={1800} h={760} fill={lin(f, 2, 2 + 1800 / 30)} currents />
        </Layer>
        <Layer depth={0}>
          <TapeTicket x={290} y={110} word="MODEL" f={f} slam={lin(f, 4, 16)} size={0.95} />
          <WordPill x={560} y={110} text="MOST MODELS" size={40} F={FU} appear={lin(f, 12, 24)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-08 · helium rain: pale droplets form at the top of the gold (4 f stagger) and fall through it (22 px/f); the gold glow flows
// ===============================================================================================================
const Shot608: ShotFC<C06> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(68)} vignette={0.22} grain={0.5}>
      <Furnace f={f} />
      <Layer depth={1}>
        <rect x={-200} y={60} width={2320} height={160} fill={C.liquid} />
        <GoldLayer f={f} x={80} y={200} w={1760} h={860} currents={false} />
        <g transform="translate(4 6)">
          <Rain19 f={f} x={140} y={230} w={1640} h={800} n={70} speed={22} color="#7A1A0C" seed={68} />
        </g>
        <Rain19 f={f} x={140} y={230} w={1640} h={800} n={70} speed={22} color="#FFF6DC" seed={68} />
        <Sparks f={f} x={80} y={300} w={1760} h={700} mode="zigzag" n={8} speed={30} seed={8} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={90} y={140} text="HELIUM RAIN (MODEL)" size={40} F={FU} appear={lin(f, 6, 18)} dash="10 8" />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 6-09 · the gradual change (no tag, Q7): the boundary between the liquid and the gold softens into a long gradient while a
//        gradient front sweeps across (28 px/f); drops keep falling (20 px/f)
// ===============================================================================================================
const Shot609: ShotFC<C06> = ({ f, len }) => {
  const id = uid();
  const soft = 0.02 + 0.4 * ez(f, 0, len * 0.8);
  return (
    <Pop f={f}>
      <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(69)} vignette={0.22} grain={0.5}>
        <Furnace f={f} />
        <Layer depth={1}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#B22A10" />
              <stop offset={0.45 - soft} stopColor={C.liquid} />
              <stop offset={0.45 + soft} stopColor={C.gold} />
              <stop offset="1" stopColor={C.goldHot} />
            </linearGradient>
          </defs>
          <rect x={60} y={80} width={1800} height={940} rx={28} fill={`url(#${id})`} stroke={C.goldRim} strokeWidth={6} />
          <g opacity={0.5}>
            <Sweep19 x={60} y={80} w={1800} h={940} p={fr(f / (1800 / 28))} color="rgba(255,240,160,0.0)" edge="#FFF0A0" />
          </g>
          <Rain19 f={f} x={120} y={120} w={1680} h={860} n={50} speed={20} color="#FFF6DC" seed={69} />
          <Embers frame={f} x0={100} x1={1800} y={1060} n={30} color={C.goldHot} seed={69} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-10 · NOT MEASURED: on the ledger the HEARD part ends and a dashed part marches on (28 px/f); six dark chips flicker "?" in
//        turn (8 f); the tape basket turns (8 deg/f); Tick shakes his head
// ===============================================================================================================
const Shot610: ShotFC<C06> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(70)} vignette={0.14} grain={0.5}>
      <Station f={f} />
      <Layer depth={1}>
        <Reel x={170} y={330} r={110} f={f} speed={8} />
        <Ledger f={f} x0={160} x1={2100} y={330} solidTo={0.18} drift={28} pins={[0.02, 0.18]} />
        <ChipRow x={300} y={560} f={f} q size={120} gap={40} />
        <Floor y={1000} />
        <Tick x={1520} y={1004} pxPerM={230} frame={f} facing={-1} pose="stand" expression="neutral" look={-0.5} headTilt={14 * Math.sin(f * 0.35)} />
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={14} w={1920} h={1080} color="#FFE7A0" seed={70} size={3} drift={20} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={300} y={800} text="NOT MEASURED" size={44} F={SC} appear={lin(f, 8, 20)} />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 6-11 · how Jupiter pulls: Juno swings along a bent arc past the planet (30 px/f, looping); field lines pulse outward
//        (20 px/f); the planet's bands slide (16-22 px/f)
// ===============================================================================================================
const Shot611: ShotFC<C06> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={LI.theme} shotFrame={f} drift={DRIFT(71)} vignette={0.24} grain={0.5}>
      <Layer depth={0.1}>
        <DarkSky name="limb" />
        <BandField19 f={f} k="limb" />
      </Layer>
      <Layer depth={0.3}>
        <StarsTint f={f} x={-200} y={-200} w={2320} h={1480} n={90} speed={10} seed={71} />
      </Layer>
      <Layer depth={1}>
        <GlowRings f={f} cx={700} cy={600} every={20} speed={20} r0={500} maxR={1200} color={C.starAqua} width={5} />
        <Planet cx={700} cy={600} r={500} f={f} shear={[20, -16, 22, -18]} />
        <JunoArc f={f} />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================

export const SceneL06: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL06(t);
  const shots: ShotDef<C06>[] = [
    { from: c.s601, S: Shot601, id: "6-01" },
    { from: c.s602, S: Shot602, id: "6-02" },
    { from: c.s603, S: Shot603, id: "6-03" },
    { from: c.s604, S: Shot604, id: "6-04" },
    { from: c.s605, S: Shot605, id: "6-05" },
    { from: c.s606, S: Shot606, id: "6-06" },
    { from: c.s607, S: Shot607, id: "6-07" },
    { from: c.s608, S: Shot608, id: "6-08" },
    { from: c.s609, S: Shot609, id: "6-09" },
    { from: c.s610, S: Shot610, id: "6-10" },
    { from: c.s611, S: Shot611, id: "6-11" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL06 = (t: SceneTiming): Cue[] => {
  const c = cuesL06(t);
  return [
    ...cutHit(0),
    { at: 2, file: SFX.swirl, vol: 0.16, dur: 60 },
    ...cutHit(c.s602),
    { at: c.s602 + 20, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.s603),
    { at: c.s603 + 42, file: SFX.pop, vol: 0.16, dur: 20 },
    ...cutHit(c.s604),
    { at: c.s604 + 2, file: SFX.swirl, vol: 0.16, dur: 60 },
    ...cutHit(c.s605),
    { at: c.s605 + 6, file: SFX.chime, vol: 0.16, dur: 90, fadeOut: 30 },
    ...cutHit(c.s606),
    { at: c.s606, file: SFX.rumble, vol: 0.12, dur: 100, fadeIn: 10, fadeOut: 30 },
    ...cutHit(c.s607),
    { at: c.s607 + 8, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.s608),
    { at: c.s608 + 2, file: SFX.swirl, vol: 0.14, dur: 60 },
    ...cutHit(c.s609),
    { at: c.s609 + 2, file: SFX.whoosh, vol: 0.14, dur: 50 },
    ...cutHit(c.s610),
    { at: c.s610, file: SFX.rumble, vol: 0.12, dur: 110, fadeIn: 10, fadeOut: 30 },
    ...cutHit(c.s611),
    { at: c.s611 + 2, file: SFX.whoosh, vol: 0.16, dur: 50 },
  ];
};
