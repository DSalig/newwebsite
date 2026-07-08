// Deterministic PRNG so the demo dataset is stable across builds and
// client/server renders (no hydration mismatches, no Date.now/Math.random).

export function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type Rng = {
  next(): number; // [0, 1)
  int(min: number, max: number): number; // inclusive
  pick<T>(arr: readonly T[]): T;
  gaussish(): number; // ~N(0,1) via sum of uniforms
};

export function makeRng(seed: string): Rng {
  let a = hashSeed(seed);
  const next = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    gaussish: () => next() + next() + next() - 1.5,
  };
}

/** A 12-point series that drifts with a trend and wobbles with noise. */
export function makeSeries(
  rng: Rng,
  points: number,
  base: number,
  trendPct: number,
  noise = 0.12
): number[] {
  const out: number[] = [];
  const step = trendPct / 100 / Math.max(1, points - 1);
  let level = base * (1 - trendPct / 200); // center the drift around base
  for (let i = 0; i < points; i++) {
    const wobble = 1 + rng.gaussish() * noise;
    out.push(Math.max(0, Math.round(level * wobble)));
    level *= 1 + step;
  }
  return out;
}
