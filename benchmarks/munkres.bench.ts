import { Bench } from "tinybench";

import type { Matrix } from "../src/types/matrix.ts";
import { gen } from "../src/utils/matrix.ts";
import { munkres } from "../src/munkres.ts";

import { Suite } from "./utils/suite.ts";
import { TerminalReporter } from "./utils/terminalReporter.ts";
import { BENCHMARK_SEED, mulberry32 } from "./utils/seededRandom.ts";

const MIN_VAL = 1;
const MAX_VAL = Number.MAX_SAFE_INTEGER;

const rng = mulberry32(BENCHMARK_SEED);

function genInt(): number {
  return MIN_VAL + Math.trunc((MAX_VAL - MIN_VAL) * rng());
}

function genBig(): bigint {
  return BigInt(genInt());
}

// Force a synchronous GC between iterations during the measurement
// phase only. See benchmarks/ci.bench.ts for the full rationale.
let inMeasurement = false;
const sweep = () => {
  if (inMeasurement) globalThis.gc?.();
};
const setMode = (_: unknown, mode: "run" | "warmup") => {
  inMeasurement = mode === "run";
};

// Per-iteration GC is only worthwhile when the matrix allocation is
// large enough to push the V8 generational GC into noticeable churn.
// For small N, the allocation is in the KB range and built-in GC keeps
// up cheaply — but a forced `gc()` still costs ~1ms per call, which
// dominates the iteration time and (with tinybench's time-based sample
// floor) blocks the bench from collecting the dense sample counts
// that give fast tasks their statistical robustness. For square
// power-of-2 matrices, `cells >= 32768` excludes N=128 (16384 cells)
// and includes N=256 (65536 cells) and up — the point where matrices
// start landing in V8's old generation rather than nursery.
const HEAVY_CELLS = 1 << 15; // 32768 cells; N >= 256 for square matrices
const sweepIfHeavy = (cells: number) => (cells >= HEAVY_CELLS ? sweep : undefined);

// `time: 1000` (tinybench default) gives fast tasks the sample density
// they need; the 50-iter floor pins slow tasks. `warmupIterations: 1,
// warmupTime: 0` keeps warmup to a single priming iteration per task
// (V8 only needs one to enter the optimized tier, and warmup with a
// non-zero time budget plus per-iter GC was the original source of the
// observed "warmup hangs" — fast tasks would otherwise run millions of
// warmup iters to fill `warmupTime: 250`).
const BENCH_OPTS = {
  iterations: 50,
  warmup: true,
  warmupIterations: 1,
  warmupTime: 0,
  retainSamples: true,
  setup: setMode,
  teardown: setMode,
} as const;

let bench: Bench;
const suite = new Suite().addReporter(new TerminalReporter());

// Number suite: 2x2 through 8192x8192 (13 sizes). 8192 takes ~5min at 50
// samples; smaller sizes complete in well under a second each.
suite.add(`number`, (bench = new Bench(BENCH_OPTS)));
for (let i = 1; i <= 13; ++i) {
  const N = 1 << i;
  let mat: Matrix<number>;
  bench.add(`${N}x${N}`, () => munkres(mat), {
    beforeEach: () => {
      mat = [];
      mat = gen(N, N, genInt);
    },
    afterEach: sweepIfHeavy(N * N),
  });
}

// Bigint suite, regular sizes: 2x2 through 4096x4096 with the standard
// 50-sample floor.
suite.add(`bigint`, (bench = new Bench(BENCH_OPTS)));
for (let i = 1; i <= 12; ++i) {
  const N = 1 << i;
  let mat: Matrix<bigint>;
  bench.add(`${N}x${N}`, () => munkres(mat), {
    beforeEach: () => {
      mat = [];
      mat = gen(N, N, genBig);
    },
    afterEach: sweepIfHeavy(N * N),
  });
}

// Bigint 8192: ~21 seconds per iteration; 50 samples would be ~17min.
// Split it into a separate Bench with a 10-sample floor to keep total
// runtime in line with the historical README, which reports 10 samples
// for this size for the same reason.
suite.add(
  `bigint (huge)`,
  (bench = new Bench({ ...BENCH_OPTS, iterations: 10 })),
);
{
  const N = 8192;
  let mat: Matrix<bigint>;
  bench.add(`${N}x${N}`, () => munkres(mat), {
    beforeEach: () => {
      mat = [];
      mat = gen(N, N, genBig);
    },
    afterEach: sweepIfHeavy(N * N),
  });
}

await suite.run();
