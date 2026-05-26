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

// tinybench's defaults are designed for hot-loop microbenchmarks: it
// keeps running iterations until *both* an accumulated-time budget and
// an iteration-count floor are exceeded. The defaults `time: 1000` and
// `warmupTime: 250` cause a fast task at ~1us/iter to run millions of
// iterations (filling the time budget) — predictably blowing up wall
// time, especially with a forced GC after each iter.
//
// We want exactly `iterations` measured samples per task (and one
// warmup iter for JIT priming), so we zero out both time budgets and
// fix the warmup count to 1.
const BENCH_OPTS = {
  iterations: 50,
  time: 0,
  warmup: true,
  warmupIterations: 1,
  warmupTime: 0,
  retainSamples: true,
  setup: setMode,
  teardown: setMode,
} as const;

let bench: Bench;
const suite = new Suite().addReporter(new TerminalReporter());

suite.add(`number`, (bench = new Bench(BENCH_OPTS)));
for (let i = 1; i <= 12; ++i) {
  const N = 1 << i;
  let mat: Matrix<number>;
  bench.add(`${N}x${N}`, () => munkres(mat), {
    beforeEach: () => {
      mat = [];
      mat = gen(N, N, genInt);
    },
    afterEach: sweep,
  });
}

suite.add(`bigint`, (bench = new Bench(BENCH_OPTS)));
for (let i = 1; i <= 11; ++i) {
  const N = 1 << i;
  let mat: Matrix<bigint>;
  bench.add(`${N}x${N}`, () => munkres(mat), {
    beforeEach: () => {
      mat = [];
      mat = gen(N, N, genBig);
    },
    afterEach: sweep,
  });
}

await suite.run();
