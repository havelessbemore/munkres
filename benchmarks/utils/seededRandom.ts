/**
 * mulberry32: a fast, simple, deterministic 32-bit PRNG.
 * Returns a function compatible with Math.random() (yields [0, 1)).
 * https://github.com/bryc/code/blob/master/jshash/PRNGs.md#mulberry32
 */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Committed benchmark seed. Change only with intent — affects regression baselines. */
export const BENCHMARK_SEED = 0xc0ffee01;
