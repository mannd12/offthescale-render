// L15 · the ONE number table (BUILD.md §5, storyboard §5). Every figure a gauge, label, counter or card may show is here,
// with its sources.md row (#N). No scene file may hard-code a figure that is not in this file (F3/F4: nothing from a
// still-secondary row gets a numeric readout; the storyboard F4 list, the unverified Stratos speed, the FAI time and
// the helium volume and the mesosphere average are absent ON PURPOSE).
// USAGE
//   ATM, atmAt(altKm)        → US Standard Atmosphere 1976 (#11): { rho kg/m³, tC °C } (log-interp density, linear T)
//   soundSpeed(tC)           → m/s, √(1.4 · 287.05 · (tC + 273.15)) (#15); the SPEED dial's SOUND mark uses only this (F10)
//   MODEL, modelSpeedAt(km), pushAt(km), modelAltAt(s) → OUR MODEL (#20, class C): always with the "OUR MODEL" chip (F5)
//   JUMPS.baumgartner / .kittinger / .eustace (#4, #7, #8) · BOUNDARY (#1-3) · LAYERS (#10) · ORBIT (#16-19, 21, 22)
//   RATIOS (#12-14) with their spoken/shown labels · SOUND (#15, #23) · AIR_READ / TEMP_READ (#11 readouts)
//   isAllowed(v)             → true if v is a table value (the gauges throw on anything else)
//   mss(seconds)             → "4:20"-style label for a table time

// ---------------------------------------------------------------------------------------------------------------
// #11 US Standard Atmosphere 1976 (geometric altitude; EngineeringToolbox + an independent 1976 implementation)
// ---------------------------------------------------------------------------------------------------------------
export type AtmRow = { km: number; rho: number; tC: number };
export const ATM: AtmRow[] = [
  { km: 0, rho: 1.225, tC: 15 }, // #11
  { km: 10, rho: 0.4135, tC: -49.9 }, // #11
  { km: 20, rho: 0.08891, tC: -56.5 }, // #11
  { km: 30, rho: 0.01841, tC: -46.64 }, // #11
  { km: 40, rho: 0.003996, tC: -22.8 }, // #11
  { km: 50, rho: 0.001027, tC: -2.5 }, // #11
  { km: 60, rho: 0.0003097, tC: -26.13 }, // #11
  { km: 80, rho: 0.00001846, tC: -74.51 }, // #11
];
/** Above 80 km (drawing only, never a readout): density falls with a 5.6 km scale height (#20's assumption), T held. */
const SCALE_H = 5.6; // #20 (assumption)

/** Atmosphere at an altitude: density log-interpolated, temperature linear between the #11 rows. Drawing/driving only;
 *  a READOUT must use AIR_READ / TEMP_READ (the table points). */
export const atmAt = (altKm: number): { rho: number; tC: number } => {
  const a = Math.max(0, altKm);
  const last = ATM[ATM.length - 1];
  if (a >= last.km) return { rho: last.rho * Math.exp(-(a - last.km) / SCALE_H), tC: last.tC };
  for (let i = 1; i < ATM.length; i++) {
    const p = ATM[i - 1];
    const q = ATM[i];
    if (a <= q.km) {
      const u = (a - p.km) / (q.km - p.km);
      return { rho: Math.exp(Math.log(p.rho) + (Math.log(q.rho) - Math.log(p.rho)) * u), tC: p.tC + (q.tC - p.tC) * u };
    }
  }
  return { rho: last.rho, tC: last.tC };
};
export const RHO0 = 1.225; // #11 sea level, kg/m³

// ---------------------------------------------------------------------------------------------------------------
// #15 speed of sound (depends on temperature only)
// ---------------------------------------------------------------------------------------------------------------
export const GAMMA = 1.4; // #15
export const R_AIR = 287.05; // #15 J/(kg·K)
export const soundSpeed = (tC: number) => Math.sqrt(GAMMA * R_AIR * (tC + 273.15)); // #15, m/s
/** The on-screen sound-speed checkpoints (F10: 340 at 15 °C, 295 at −56.5 °C, 317 at 40 km). */
export const SOUND = {
  sea: 340, // #15 m/s at 15 °C
  at20: 295, // #15 m/s at −56.5 °C (20 km)
  at20kmh: 1062, // #15 km/h
  at30kmh: 1086, // #15 km/h (Baumgartner's Mach 1.25 at 1,357.6 km/h)
  at40: 317, // #15 #23 m/s at −22.8 °C (40 km)
} as const;

// ---------------------------------------------------------------------------------------------------------------
// #20 OUR MODEL (class C, F5): 100 kg, 0.6 m (0.283 m²), Cd 0.8, vertical fall from rest at 100 km, US-1976 air
// ---------------------------------------------------------------------------------------------------------------
export const MODEL = {
  massKg: 100, // #20
  diameterM: 0.6, // #20
  areaM2: 0.283, // #20 (drawing only)
  cd: 0.8, // #20 (drawing only)
  startKm: 100, // #20
  /** (km, m/s) from rest at 100 km (#20) */
  speeds: [
    [100, 0],
    [80, 618],
    [60, 874],
    [50, 972],
    [40, 1043],
    [35.6, 1054],
    [20, 701],
    [10, 170],
    [0, 85.7],
  ] as [number, number][],
  v80: 618, // #20 m/s
  v60: 874, // #20
  v50: 972, // #20
  v40: 1043, // #20 (t = 112 s)
  peak: 1054, // #20 m/s at 35.6 km (t = 117 s); shown as "≈ 1,050 m/s" (round with peakShown)
  peakShown: 1050, // #20 "peak ≈ 1,050 m/s at ≈ 36 km"
  peakKm: 35.6, // #20
  peakKmShown: 36, // #20
  v20: 701, // #20
  v10: 170, // #20
  ground: 86, // #20 85.7 m/s, shown as 86
  groundS: 251, // #20 s (4:11)
  t40: 112, // #20 s
  tPeak: 117, // #20 s
  pushPeak: 5.07, // #20 drag / weight at 20.1 km
  pushPeakShown: 5, // #20 "≈ 5× weight at 20 km"
  pushPeakKm: 20.1, // #20
  /** from rest at 400 km (#20): peak 2,511 m/s at 47.8 km; shown "2.5 km/s at ≈ 48 km" */
  from400Peak: 2511, // #20 m/s
  from400PeakKms: 2.5, // #20 km/s shown
  from400PeakKm: 48, // #20 (47.8)
  mach40: 3.3, // #23 1,043 / 317
} as const;

/** Model speed (m/s) at an altitude: linear between the #20 points. Drives needles; readouts use the MODEL fields. */
export const modelSpeedAt = (altKm: number) => {
  const s = MODEL.speeds;
  const a = Math.max(0, Math.min(100, altKm));
  for (let i = 1; i < s.length; i++) {
    const [h0, v0] = s[i - 1];
    const [h1, v1] = s[i];
    if (a >= h1) return v0 + ((v1 - v0) * (h0 - a)) / (h0 - h1);
  }
  return s[s.length - 1][1];
};

/** Push = drag / weight for the model at an altitude: ½ ρ v² Cd A / (m g), from #11 air and #20 speeds (peaks ≈ 5 near
 *  20 km, ≈ 1 at the speed peak, ≈ 0 above 60 km). Drives the PUSH beam; the only push readout is MODEL.pushPeakShown. */
export const pushAt = (altKm: number) => {
  const v = modelSpeedAt(altKm);
  const { rho } = atmAt(altKm);
  return (0.5 * rho * v * v * MODEL.cd * MODEL.areaM2) / (MODEL.massKg * 9.81);
};

/** Model altitude (km) at a time (s) after release, for replays. Vacuum-like arc to 40 km at t = 112 s (#20), the peak
 *  at 117 s, then the #20 speeds integrated (∫dz/v) and scaled so the ground falls at t = 251 s. Drawing only. */
const POST: [number, number][] = (() => {
  // segments below the peak: time over a segment with v linear in z = Δz / (v1 − v0) · ln(v1 / v0)
  const pts = MODEL.speeds.filter(([h]) => h <= MODEL.peakKm);
  const out: [number, number][] = [[MODEL.tPeak, MODEL.peakKm]];
  let t = 0;
  const raw: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    const dz = (pts[i - 1][0] - pts[i][0]) * 1000;
    const v0 = pts[i - 1][1];
    const v1 = pts[i][1];
    t += Math.abs(v1 - v0) < 1e-6 ? dz / v0 : (dz / (v1 - v0)) * Math.log(v1 / v0);
    raw.push(t);
  }
  const k = (MODEL.groundS - MODEL.tPeak) / t;
  for (let i = 1; i < pts.length; i++) out.push([MODEL.tPeak + raw[i] * k, pts[i][0]]);
  return out;
})();
export const modelAltAt = (tSec: number) => {
  const t = Math.max(0, tSec);
  if (t <= MODEL.t40) return 100 - 60 * (t / MODEL.t40) ** 2;
  if (t <= MODEL.tPeak) return 40 + ((MODEL.peakKm - 40) * (t - MODEL.t40)) / (MODEL.tPeak - MODEL.t40);
  for (let i = 1; i < POST.length; i++) {
    const [t0, h0] = POST[i - 1];
    const [t1, h1] = POST[i];
    if (t <= t1) return h0 + ((h1 - h0) * (t - t0)) / (t1 - t0);
  }
  return 0;
};

// ---------------------------------------------------------------------------------------------------------------
// #4 #7 #8 the three jumps (class A values only)
// ---------------------------------------------------------------------------------------------------------------
export const JUMPS = {
  baumgartner: {
    year: 2012, // #4
    exitM: 38969, // #4 38,969.4 m, shown as 38,969
    exitKm: 38.97, // #4
    topKmh: 1357.6, // #4
    mach: 1.25, // #4
    soundAtS: 34, // #4 s into the fall
    peakAtS: 50, // #4 s (max speed; no altitude shown, #5)
    freefallS: 260, // #4 4 min 20 s
    distanceM: 36402.6, // #4 free-fall distance
    climbH: 2.5, // #4 "~2.5 h"
    flatSpinS: 13, // #4 "about 13 s"
    chuteKm: 2.5, // #4 main chute "~2.5 km"
    gapS: 16, // arithmetic #4: 50 − 34
  },
  kittinger: {
    year: 1960, // #7
    exitM: 31333, // #7 (102,800 ft, metric conversion)
    freefallS: 277, // #7 4 min 37 s (USAF Museum)
    descentMin: 13, // #7 "13+ min" (USAF: "more than 13 minutes")
    chuteM: 2, // #7 "~2 m" stabiliser
  },
  eustace: {
    year: 2014, // #8
    exitM: 41419, // #8
    exitKm: 41.4, // #8
    topKmh: 1321, // #8
    mach: 1.23, // #8
    tubeM: 3.66, // #8 carbon-fibre tube
    groundMin: 15, // #8 "~15 min"
  },
} as const;

// ---------------------------------------------------------------------------------------------------------------
// #1-3 the boundary lines · #10 layers (NOAA)
// ---------------------------------------------------------------------------------------------------------------
export const BOUNDARY = {
  fai: 100, // #1 km (FAI)
  usafMiles: 50, // #1 miles
  usafKm: 80.5, // #3 50 × 1.609344
  mcdowell: 80, // #2 km (McDowell 2018)
  mcdowellYear: 2018, // #2
} as const;
export const LAYERS = {
  stratoTop: 50, // #10 km (NOAA)
  mesoTop: 85, // #10 km (NOAA)
} as const;

// ---------------------------------------------------------------------------------------------------------------
// #16-19, 21, 22 orbit
// ---------------------------------------------------------------------------------------------------------------
export const ORBIT = {
  issLowKm: 370, // #16
  issHighKm: 460, // #16
  issMph: 17500, // #16
  issMinutes: 90, // #16
  orbitsPerDay: 16, // #16
  gravityIss: 90, // #16 % ("about 90 %")
  drawKm: 400, // #18 the 400 km height used in the arithmetic
  v400: 7.67, // #18 km/s
  v100: 7.84, // #18 km/s
  fallTo100: 2.33, // #19 km/s from rest at 400 km to 100 km
  ratio: 3.3, // #19 7.669 / 2.334 ("more than three times")
  kmh: 28000, // #18 "≈ 28,000 km/h"
  timesBaumgartner: 21, // #18 ≈ 21×
  gravity100: 97, // #21 %
  modelPeakKmh: 3800, // #22 1,054 m/s ≈ 3,800 km/h (inherits #20)
} as const;

// ---------------------------------------------------------------------------------------------------------------
// #12-14 ratios (shown with the label strings below)
// ---------------------------------------------------------------------------------------------------------------
export const RATIOS = {
  sea40: 306.6, // #12 1.225 / 0.003996
  sea40Shown: 300, // #12 "~300×"
  sea80: 66360, // #12 1.225 / 0.00001846
  sea80Shown: 66000, // #12 "66,000×"
  d20over40: 22.25, // #12
  d20over40Shown: 22, // #12 "×22"
  terminal40: 17.5, // #14 √306.6
  dragSpeed: 2, // #13 ×2 speed
  dragForce: 4, // #13 → ×4 drag
} as const;

// ---------------------------------------------------------------------------------------------------------------
// #11 #12 readouts on the AIR and COLD gauges (always with the STANDARD ATMOSPHERE tag, F6)
// ---------------------------------------------------------------------------------------------------------------
export const AIR_READ = {
  sea: 1.225, // #11 kg/m³
  at10g: 413, // #11 g/m³ (0.4135 kg)
  at20g: 89, // #11 g/m³ (0.08891 kg)
  at40g: 4, // #12 "under 4 g" (3.996 g): show with the "<" prefix
} as const;
export const TEMP_READ = {
  sea: 15, // #11 °C
  at20: -56.5, // #11
  at30: -47, // #11 ≈ −46.64, shown "≈ −47"
  at50: -2.5, // #11
  at80: -74.5, // #11 (−74.51)
} as const;

// ---------------------------------------------------------------------------------------------------------------
// allow-list (the gauges, Stopwatch and counters check against it)
// ---------------------------------------------------------------------------------------------------------------
const collect = (o: object): number[] =>
  Object.values(o).flatMap((v) => (typeof v === "number" ? [v] : Array.isArray(v) ? [] : v && typeof v === "object" ? collect(v) : []));
const ALLOWED = new Set<number>([0, 1, ...collect(SOUND), ...collect(MODEL), ...collect(JUMPS), ...collect(BOUNDARY), ...collect(LAYERS), ...collect(ORBIT), ...collect(RATIOS), ...collect(AIR_READ), ...collect(TEMP_READ)]);
/** true if `v` is a figure from this table (0 and 1 are allowed as scale ends: "zero", "weight = 1"). */
export const isAllowed = (v: number) => ALLOWED.has(v);
export const assertAllowed = (v: number, who: string) => {
  if (!isAllowed(v)) throw new Error(`L15 ${who}: ${v} is not in jumpdata.ts (sources.md); add it there with its row first`);
};

/** "4:20" for 260 s. */
export const mss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
