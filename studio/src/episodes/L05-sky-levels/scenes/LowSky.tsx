import React from "react";
import { useCurrentFrame } from "remotion";
import { DiverSilhouette, Tag } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { Climb, Scale } from "../gauge";
import { Card, CaptionPop, PillTag, Photo, SkyShell, clamp01, lin, mix } from "./shell";

/** Rungs 1 to 6 share one true scale: 0 to 86 km, the top of the night-shining clouds (#25). */
export const SCALE_LOW: Scale[] = [{ at: 0, top: 86 }];

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Cold open. Lines 0-3. Sources #27, #45, #46.
 * NOAA cumulus plate (Cumulus6) tilting up · the guesses struck off one by one · the 1972 tease, no picture yet · a strip of
 * the rungs ahead, scrolling upward.
 */
export const ColdOpen: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const notClouds = within(t, 1, 0.03);
  const notBlue = within(t, 1, 0.09);
  const itself = within(t, 1, 0.16);
  const hundred = within(t, 1, 0.64);
  const round = within(t, 1, 0.85);
  const further = lineAt(t, 2);
  const y1972 = within(t, 2, 0.82);
  const going = lineAt(t, 3);
  const pictures = within(t, 3, 0.42);
  const rises = within(t, 3, 0.82);

  const dim = 1 - 0.75 * ease(frame, further, 20);
  const strip = ease(frame, pictures - 6, 14);
  // the tilt: the plate rises through the frame as if the head goes back
  const scale = 1.25 - 0.1 * lin(frame, 0, t.frames);
  const originY = mix(100, 0, lin(frame, 0, further));
  const scroll = lin(frame, pictures, t.frames) * 760;
  const PLATES = ["l05-balloon-topeka", "l05-everest-iss", "l05-dc8", "l05-sr71b", "l05-balloon-ice", "l05-meteor", "l05-x15", "l05-iss", "l05-goes"];
  const NAMES = ["the ground", "Everest", "a jet", "a spy plane", "a balloon", "a meteor", "the X-15", "the Station", "a weather satellite"];
  return (
    <SkyShell
      t={t}
      index={-1}
      climb={[{ at: 0, km: 0, reading: "0 KM" }]}
      scale={SCALE_LOW}
      chromeFrom={25}
      credit={strip > 0.5 ? { kind: "real", source: "NASA · NOAA" } : { kind: "real", source: "NOAA Photo Library" }}
    >
      <Photo id="l05-cumulus" scale={scale} origin={`50% ${originY}%`} brightness={0.95 * dim} />
      {frame >= notClouds && frame < further ? <PillTag x={420} y={250} size={40} opacity={ease(frame, notClouds, 8)}><span style={{ textDecoration: frame >= notClouds + 10 ? "line-through" : undefined }}>the clouds</span></PillTag> : null}
      {frame >= notBlue && frame < further ? <PillTag x={140} y={350} size={40} opacity={ease(frame, notBlue, 8)}><span style={{ textDecoration: frame >= notBlue + 10 ? "line-through" : undefined }}>the blue</span></PillTag> : null}
      {frame >= itself && frame < hundred ? <CaptionPop bottom={150}>the last piece of the atmosphere</CaptionPop> : null}
      {frame >= hundred && frame < further ? <Card x={300} y={560} size={120} big="100 KM?" small={frame >= round ? "PARTLY BECAUSE IT WAS ROUND" : "WHAT MOST PEOPLE SAY"} opacity={ease(frame, hundred, 10)} /> : null}
      {frame >= further && frame < going ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={`M700 860 V ${mix(860, 260, ease(frame, further + 6, 60))}`} stroke={B.gauge} strokeWidth={14} strokeLinecap="round" />
            <path d={`M650 ${mix(910, 310, ease(frame, further + 6, 60))} L700 ${mix(860, 260, ease(frame, further + 6, 60))} L750 ${mix(910, 310, ease(frame, further + 6, 60))}`} stroke={B.gauge} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Card x={470} y={480} size={84} big="MUCH FURTHER" opacity={ease(frame, further + 10, 12)} />
          {frame >= y1972 ? <Card x={790} y={620} size={84} big="A PHOTOGRAPH, 1972" color={B.paper} opacity={ease(frame, y1972, 10)} /> : null}
        </>
      ) : null}
      {frame >= going && frame < pictures ? <CaptionPop bottom={420} size={96}>ten levels, in order</CaptionPop> : null}
      {strip > 0 ? (
        <div style={{ position: "absolute", left: 300, top: 0, width: 880, height: 1080, overflow: "hidden", opacity: strip }}>
          {PLATES.map((p, i) => (
            <div key={p} style={{ position: "absolute", left: i % 2 ? 450 : 0, top: 760 - i * 190 + scroll, width: 430, height: 242, borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 28px rgba(0,0,0,0.6)" }}>
              <Photo id={p} brightness={1} />
              <div style={{ position: "absolute", left: 10, bottom: 8 }}>
                <span style={{ padding: "2px 10px 4px", borderRadius: 8, background: "rgba(5,14,24,0.9)", fontFamily: F.ui, fontWeight: 800, fontSize: 24, color: B.paper }}>{NAMES[i]}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {frame >= rises ? <PillTag x={1490} y={880} size={32} color={B.gauge} align="right" opacity={ease(frame, rises, 8)}>the gauge only rises</PillTag> : null}
    </SkyShell>
  );
};

// ---------------------------------------------------------------------------------------------------------------------

/** deterministic pseudo-random in 0-1 */
const rnd = (i: number, k: number) => {
  const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return v - Math.floor(v);
};
const AIR_H = 5.6 / Math.LN2; // exponential whose half-height is exactly 5.6 km (#4)

/**
 * 1 · The ground. Lines 0-3. Sources #2, #4.
 * Plate: NOAA Wea01144, a weather-balloon launch at Topeka, Kansas (man small and far, no readable face), named on the picture.
 * 0: push in on the balloon, then the drawn air column · 1: half the dots turn yellow under the 5.6 km line, the walker crosses
 * it · 2: the lowest layer lights up, drawn clouds in it · 3: the column runs upward and out.
 */
export const Ground: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const heaviest = within(t, 0, 0.45);
  const half = within(t, 1, 0.22);
  const line56 = within(t, 1, 0.56);
  const walk = within(t, 1, 0.78);
  const hour = within(t, 1, 0.9);
  const weather = lineAt(t, 2);
  const runs = lineAt(t, 3);

  const col = ease(frame, heaviest, 16);
  const yk = (km: number) => 930 - km * 24.6; // column scale: 30 km fills the frame
  const scroll = ease(frame, runs, 80) * 300; // line 3: the camera climbs the column
  const halfOn = ease(frame, line56, 14);
  const dots = Array.from({ length: 1100 }, (_, i) => {
    const km = -AIR_H * Math.log(1 - rnd(i, 1) * 0.999);
    return { x: 160 + rnd(i, 2) * 1160 + Math.sin(frame / 40 + i) * 4, km };
  });
  const walker = lin(frame, walk, weather - 4);
  const layer = ease(frame, weather, 14) * (1 - ease(frame, runs, 14));
  return (
    <SkyShell
      t={t}
      index={0}
      climb={[{ at: 0, km: 0, reading: "0 KM", sub: frame >= t.lines[0].at ? "THE GROUND" : undefined }]}
      scale={SCALE_LOW}
      marks={[{ km: 5.6, label: "half the air", at: line56 }]}
      credit={col > 0.5 ? { kind: "illustration", source: "the air as a column, drawn" } : { kind: "real", source: "NOAA Photo Library" }}
    >
      <Photo id="l05-balloon-topeka" scale={1.05 + 0.2 * lin(frame, 0, heaviest)} origin="8% 30%" brightness={mix(0.92, 0.14, col)} />
      {col < 0.5 ? <PillTag x={60} y={206} size={28}>A weather balloon launch, Topeka, Kansas</PillTag> : null}
      {col > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: col }}>
          <g transform={`translate(0 ${scroll})`}>
            {dots.map((d, i) => {
              const y = yk(d.km);
              if (y < -320) return null;
              const below = d.km <= 5.6;
              return <circle key={i} cx={d.x} cy={y} r={below ? 4 : 3.4} fill={below && halfOn > 0.5 ? B.gauge : "#9BD8F0"} opacity={0.9} />;
            })}
            <line x1={140} y1={930} x2={1340} y2={930} stroke="rgba(255,255,255,0.8)" strokeWidth={4} />
            {frame >= line56 ? <line x1={140} y1={yk(5.6)} x2={140 + 1200 * halfOn} y2={yk(5.6)} stroke={B.paper} strokeWidth={5} strokeDasharray="20 12" /> : null}
            {layer > 0 ? <rect x={140} y={yk(18)} width={1200} height={yk(0) - yk(18)} fill={B.aqua} opacity={0.14 * layer} /> : null}
            {layer > 0
              ? [0, 1, 2, 3].map((k) => {
                  const cx = 260 + ((frame * 1.2 + k * 300) % 1000);
                  const cy = yk(2.5 + (k % 3) * 2.2);
                  return (
                    <g key={k} opacity={layer} fill="#E8F3FA">
                      <circle cx={cx} cy={cy} r={24} />
                      <circle cx={cx + 30} cy={cy + 4} r={18} />
                      <circle cx={cx - 30} cy={cy + 6} r={16} />
                    </g>
                  );
                })
              : null}
          </g>
        </svg>
      ) : null}
      {col > 0 && frame < heaviest + 200 && frame < half ? <PillTag x={460} y={260} size={38} opacity={col}>heaviest at the bottom</PillTag> : null}
      {frame >= half && frame < weather ? <Card x={420} y={250} size={110} big="HALF THE AIR" small={frame >= line56 ? "BELOW 5.6 KM" : undefined} opacity={ease(frame, half, 10)} /> : null}
      {frame >= walk && frame < weather ? (
        <>
          <div style={{ position: "absolute", left: mix(150, 1260, walker), top: yk(5.6) - 72, transform: `rotate(${Math.sin(frame / 3) * 3}deg)` }}>
            <DiverSilhouette size={70} color={B.paper} />
          </div>
          {frame >= hour ? <PillTag x={420} y={480} size={34} opacity={ease(frame, hour, 8)}>about an hour's walk</PillTag> : null}
        </>
      ) : null}
      {layer > 0 ? <PillTag x={460} y={260} size={38} color={B.aqua} opacity={layer}>the lowest layer: almost all the weather</PillTag> : null}
      {frame >= runs + 30 ? <CaptionPop bottom={560}>the sky runs out fast</CaptionPop> : null}
    </SkyShell>
  );
};

// ---------------------------------------------------------------------------------------------------------------------

/**
 * 2 · Everest. Lines 0-2. Sources #4, #6.
 * Plate: NASA ISS photo 2023, Everest at the centre per its record. 0: push in · 1: the plate gives way to a to-scale mountain
 * profile, the 5.6 km line drawn across it, the gap measured · 2: someone on the summit, the half below fills, eight chevrons above.
 */
export const Everest: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const metres = within(t, 0, 0.22);
  const orbit = within(t, 0, 0.66);
  const lookAt = lineAt(t, 1);
  const below = within(t, 1, 0.22);
  const pokes = within(t, 1, 0.55);
  const stand = lineAt(t, 2);
  const boots = within(t, 2, 0.28);
  const eight = within(t, 2, 0.62);

  const dia = ease(frame, lookAt, 14);
  const Y0 = 900;
  const yk = (km: number) => Y0 - km * 72; // 8.85 km = 637 px
  const lineK = ease(frame, lookAt + 6, 24);
  const fill = ease(frame, boots, 24);
  const profile = `M100 ${Y0} L380 ${yk(3.6)} L500 ${yk(5.2)} L610 ${yk(6.3)} L680 ${yk(7.7)} L760 ${yk(8.85)} L840 ${yk(7.4)} L930 ${yk(6.1)} L1030 ${yk(5.0)} L1180 ${yk(2.6)} L1340 ${Y0} Z`;
  return (
    <SkyShell
      t={t}
      index={1}
      climb={[{ at: 0, km: 5.6, reading: "CLIMBING" }, { at: metres, km: 8.85, reading: "8,848 M", sub: "EVEREST" }]}
      scale={SCALE_LOW}
      marks={[{ km: 8.85, label: "Everest", at: metres }]}
      credit={dia > 0.5 ? { kind: "illustration", source: "heights to scale, the slopes are not" } : { kind: "real", source: "NASA, ISS 2023" }}
    >
      <Photo id="l05-everest-iss" scale={1 + 0.35 * ease(frame, 0, lookAt)} origin="50% 50%" brightness={mix(0.9, 0.14, dia)} />
      {dia < 0.5 ? <PillTag x={60} y={206} size={28}>Everest is at the centre of this picture</PillTag> : null}
      {frame >= orbit && dia < 0.5 ? <PillTag x={60} y={262} size={28} color={B.gauge} opacity={ease(frame, orbit, 8)}>taken from orbit</PillTag> : null}
      {dia > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: dia }}>
          <path d={profile} fill="#31404F" stroke={B.paper} strokeWidth={4} />
          <line x1={80} y1={Y0} x2={1360} y2={Y0} stroke="rgba(255,255,255,0.7)" strokeWidth={3} />
          {/* only up to the 5.6 km line: this tint is the half of the air, not everything below the summit */}
          {fill > 0 ? <rect x={80} y={yk(5.6)} width={1280} height={(Y0 - yk(5.6)) * fill} transform={`translate(0 ${(Y0 - yk(5.6)) * (1 - fill)})`} fill={B.gauge} opacity={0.2} /> : null}
          <line x1={80} y1={yk(5.6)} x2={80 + 1280 * lineK} y2={yk(5.6)} stroke={B.gauge} strokeWidth={6} strokeDasharray="22 12" />
          {frame >= below ? (
            <g opacity={ease(frame, below, 10)} stroke={B.tease} strokeWidth={6} fill="none">
              <path d={`M880 ${yk(8.85)} H 920 M900 ${yk(8.85)} V ${yk(5.6)} M880 ${yk(5.6)} H 920`} />
              <path d={`M766 ${yk(8.85)} H 880`} strokeDasharray="8 8" strokeWidth={3} />
            </g>
          ) : null}
        </svg>
      ) : null}
      {dia > 0.5 ? <Tag x={100} y={yk(5.6) - 46} color={B.gauge} size={32}>half the air is below this line</Tag> : null}
      {frame >= below && frame < stand ? <Card x={940} y={yk(8.85) + 40} size={64} big="ABOUT 3 KM" color={B.tease} ink={B.paper} opacity={ease(frame, below, 10)} /> : null}
      {frame >= pokes && frame < stand ? <CaptionPop bottom={88}>poking out above half the atmosphere</CaptionPop> : null}
      {frame >= stand ? (
        <div style={{ position: "absolute", left: 725, top: yk(8.85) - 66, opacity: ease(frame, stand, 10) }}>
          <DiverSilhouette size={70} color={B.gauge} />
        </div>
      ) : null}
      {frame >= boots ? <CaptionPop bottom={88}>half the sky is under your boots</CaptionPop> : null}
      {frame >= eight ? (
        <>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 1040, top: 222 + (7 - i) * 32 - lin(frame, eight, t.frames) * 12, opacity: ease(frame, eight + i * 4, 6) }}>
              <svg width={120} height={36}>
                <path d="M10 32 L60 6 L110 32" stroke={B.gauge} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
          <PillTag x={1180} y={320} size={30} color={B.gauge} opacity={ease(frame, eight + 30, 8)}>8 more levels</PillTag>
        </>
      ) : null}
    </SkyShell>
  );
};

// ---------------------------------------------------------------------------------------------------------------------

/** The sea-level mirror: L01's ocean below the line, this video's air above it. To scale, 30 px per km. */
const Mirror: React.FC<{ frame: number; downAt: number; upAt?: number; bird?: boolean; opacity: number }> = ({ frame, downAt, upAt, bird, opacity }) => {
  const SEA = 556;
  const PK = 30;
  const down = ease(frame, downAt, 30);
  const up = upAt !== undefined ? ease(frame, upAt, 30) : 0;
  const reach = bird ? 11.3 : 10.97;
  const planeY = SEA - reach * PK * (bird ? 1 : up);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity }}>
      <defs>
        <linearGradient id="l05sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E5E86" />
          <stop offset="1" stopColor="#020A18" />
        </linearGradient>
        <linearGradient id="l05air" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3A8FC4" />
          <stop offset="1" stopColor="#0D2A5A" />
        </linearGradient>
      </defs>
      <rect x={120} y={SEA - 11.5 * PK} width={1160} height={11.5 * PK} fill="url(#l05air)" />
      <rect x={120} y={SEA} width={1160} height={11.5 * PK} fill="url(#l05sea)" />
      <line x1={120} y1={SEA} x2={1280} y2={SEA} stroke={B.paper} strokeWidth={5} />
      {/* the deep: a bar downward */}
      <rect x={660} y={SEA} width={40} height={10.935 * PK * down} fill={B.aqua} />
      {/* up: the bar and, at its head, the plane or the bird */}
      {up > 0 || bird ? <rect x={660} y={planeY} width={40} height={SEA - planeY} fill={B.gauge} /> : null}
      {bird ? <line x1={560} y1={SEA - 10.935 * PK} x2={800} y2={SEA - 10.935 * PK} stroke={B.aqua} strokeWidth={4} strokeDasharray="12 8" /> : null}
      {!bird && up > 0 ? (
        <g transform={`translate(680 ${planeY - 6})`} fill={B.paper}>
          <path d="M-70 0 Q-60 -9 40 -7 L66 0 L40 7 Q-60 9 -70 0 Z" />
          <path d="M-14 -4 L-40 -40 L-20 -40 L16 -4 Z M-14 4 L-40 40 L-20 40 L16 4 Z M-60 -4 L-74 -24 L-62 -24 L-44 -4 Z" />
        </g>
      ) : null}
      {bird ? (
        <g transform={`translate(680 ${planeY - 10})`} stroke={B.paper} strokeWidth={8} fill="none" strokeLinecap="round">
          <path d="M-60 -6 Q-30 -30 0 0 Q30 -30 60 -6" />
        </g>
      ) : null}
    </svg>
  );
};

/**
 * 3 · Airliners and the vulture. Lines 0-5. Sources #7, #8, #9, #11.
 * 0: NASA DC-8, named as a former airliner from its first frame; the jet stream runs over it as drawn lines · 1-2: the mirror, to scale ·
 * 3: the vulture plate (CC BY 4.0), "not the 1973 bird" from the first frame · 4: the mirror again, bird against deep, 365 m apart ·
 * 5: the vulture pulls back, the DC-8 returns on "we built".
 */
export const Airliners: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cruise = within(t, 0, 0.12);
  const jet = within(t, 0, 0.5);
  const speed = within(t, 0, 0.82);
  const strange = lineAt(t, 1);
  const deep = within(t, 1, 0.55);
  const plane = lineAt(t, 2);
  const window = within(t, 2, 0.58);
  const vulture = lineAt(t, 3);
  const year = within(t, 3, 0.38);
  const metres = within(t, 3, 0.78);
  const safe = within(t, 3, 0.9);
  const higher = lineAt(t, 4);
  const highest = lineAt(t, 5);
  const built = within(t, 5, 0.5);

  const mirror = ease(frame, strange, 14) * (1 - ease(frame, vulture - 8, 8));
  const birdMirror = ease(frame, higher, 10) * (1 - ease(frame, highest - 6, 6));
  const dc8 = (1 - ease(frame, strange - 6, 10)) + ease(frame, built, 12);
  const vul = frame >= vulture - 4 && frame < built + 12 && birdMirror < 1;
  const jetK = ease(frame, jet, 14) * (1 - ease(frame, strange - 6, 8));
  const credit = mirror > 0.5 || birdMirror > 0.5 ? { kind: "illustration" as const, source: "heights and depths to scale" } : vul && frame < built ? { kind: "real" as const, source: "Christoph Moning, CC BY 4.0" } : { kind: "real" as const, source: "NASA, 2013" };
  const climb: Climb[] = [
    { at: 0, km: 8.85, reading: "8,848 M" },
    { at: cruise, km: 10.97, reading: "9 TO 12.5 KM", sub: "MOST AIRLINERS" },
    { at: metres, km: 11.3, reading: "11,300 M", sub: "THE VULTURE" },
  ];
  return (
    <SkyShell t={t} index={2} climb={climb} scale={SCALE_LOW} marks={[{ km: 11.3, label: "vulture", at: metres }]} credit={credit} drawn={jetK > 0.5 ? "jet stream, drawn" : null}>
      <Photo id="l05-dc8" opacity={clamp01(dc8)} scale={frame < strange ? 1.02 + 0.16 * lin(frame, 0, strange) : 1.15 - 0.1 * lin(frame, built, t.frames)} origin="50% 42%" brightness={mix(0.9, 0.42, jetK)} />
      {vul ? <Photo id="l05-vulture" opacity={ease(frame, vulture - 4, 8)} scale={frame < highest ? 1.02 + 0.16 * lin(frame, vulture, higher) : 1.18 - 0.14 * lin(frame, highest, built)} origin="48% 40%" brightness={0.92} /> : null}
      {clamp01(dc8) > 0.5 ? <PillTag x={60} y={206} size={28}>A former airliner, now a NASA lab</PillTag> : null}
      {jetK > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: jetK }}>
          {[0, 1, 2, 3, 4].map((k) => (
            <path key={k} d={`M0 ${300 + k * 90} C 350 ${240 + k * 90}, 800 ${380 + k * 90}, 1400 ${290 + k * 90}`} stroke={k % 2 ? B.aqua : B.paper} strokeWidth={8} fill="none" strokeDasharray="130 90" strokeDashoffset={-frame * 12 - k * 40} strokeLinecap="round" />
          ))}
        </svg>
      ) : null}
      {jetK > 0 ? <PillTag x={60} y={262} size={32} color={B.aqua} opacity={jetK}>the jet stream</PillTag> : null}
      {frame >= speed && frame < strange ? <Card x={480} y={720} size={84} big="CAN PASS 440 KM/H" opacity={ease(frame, speed, 8)} /> : null}

      {mirror > 0 ? <Mirror frame={frame} downAt={deep - 16} upAt={plane} opacity={mirror} /> : null}
      {mirror > 0.5 ? (
        <>
          <Tag x={140} y={490} size={30}>sea level</Tag>
          {frame >= deep - 8 ? <PillTag x={730} y={780} size={34} color={B.aqua} opacity={ease(frame, deep - 8, 8)}>Challenger Deep: just under 11 km down</PillTag> : null}
          {frame >= plane + 12 ? <PillTag x={780} y={300} size={34} color={B.gauge} opacity={ease(frame, plane + 12, 8)}>36,000 ft: as far up</PillTag> : null}
          {frame >= window ? <CaptionPop bottom={120} size={60}>your window seat, in the mirror</CaptionPop> : null}
        </>
      ) : null}

      {vul && birdMirror < 0.5 && frame < built ? (
        <>
          <PillTag x={300} y={700} size={32} color={B.gauge}>A Rüppell's vulture, not the 1973 bird</PillTag>
          {frame >= year && frame < highest ? <PillTag x={300} y={756} size={32} opacity={ease(frame, year, 8)}>1973, over Abidjan, West Africa</PillTag> : null}
          {frame >= metres && frame < highest ? <Card x={300} y={812} size={84} big="11,300 M" small={frame >= safe ? "THE PLANE LANDED SAFELY" : undefined} opacity={ease(frame, metres, 8)} /> : null}
          {frame >= highest && frame < built ? <Card x={300} y={824} size={64} big="THE HIGHEST BIRD ON RECORD" opacity={ease(frame, highest, 8)} /> : null}
        </>
      ) : null}
      {birdMirror > 0 ? <Mirror frame={frame} downAt={higher - 60} bird opacity={birdMirror} /> : null}
      {birdMirror > 0.5 ? (
        <>
          <PillTag x={830} y={208} size={34} color={B.gauge}>the vulture: 11,300 m up</PillTag>
          <PillTag x={830} y={290} size={30} color={B.aqua}>as far as the ocean goes: 10,935 m</PillTag>
          <Card x={210} y={232} size={64} big="365 M HIGHER" color={B.tease} ink={B.paper} />
        </>
      ) : null}
      {frame >= built ? <CaptionPop bottom={150}>from here up, we built it</CaptionPop> : null}
    </SkyShell>
  );
};
