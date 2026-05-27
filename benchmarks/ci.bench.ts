import { mkdirSync } from "node:fs";
import path from "node:path";

import { program } from "commander";
import { Bench } from "tinybench";

import type { Matrix } from "../src/types/matrix.ts";
import { gen } from "../src/utils/matrix.ts";
import { munkres } from "../src/munkres.ts";

import { Suite } from "./utils/suite.ts";
import { CIReporter } from "./utils/ciReporter.ts";
import { BENCHMARK_SEED, mulberry32 } from "./utils/seededRandom.ts";

// Define and get parameters. The default is set so the script runs without
// arguments — pnpm 10's `run` semantics forward `--` to the script command,
// which commander treats as end-of-options, dropping `--output X` to
// positional args. Defaulting the option here sidesteps that entirely.
program.option(
  "-o, --output <filepath>",
  "output file path",
  "benchmark_results/ci.txt",
);
program.parse(process.argv);
const options = program.opts();

// Define helpers
const MIN_VAL = 1;
const MAX_VAL = Number.MAX_SAFE_INTEGER;

const rng = mulberry32(BENCHMARK_SEED);

function genNum(min: number, max: number): number {
  return min + Math.trunc((max - min) * rng());
}

function genBig(min: number, max: number): bigint {
  return BigInt(genNum(min, max));
}

// Create benchmark suite
let bench: Bench;
const suite = new Suite();

// Add reporters
const outputPath = path.resolve(options.output);
mkdirSync(path.dirname(outputPath), { recursive: true });
suite.addReporter(new CIReporter(outputPath));

// Force a synchronous GC between iterations during the measurement phase
// only. tinybench's `afterEach` runs after the iteration's timing window
// closes, so the GC pause does not count against the measurement. With
// per-iteration allocations on the order of tens-to-hundreds of MB (the
// bigint matrix dominates), letting GC run on its own schedule across
// many iterations introduces 2-3× per-iteration noise that swamps the
// algorithm's intrinsic cost. Forcing GC here pins each iteration to
// roughly the same heap state and gives the dashboard a stable signal.
//
// Bench-level `setup`/`teardown` gives us the `mode` ('warmup' | 'run'),
// letting us flip a flag and only sweep during measurement. This is
// load-bearing: tinybench's warmup loop exits on accumulated *task
// time*, not wall time, so for a fast task at ~1us/iter, hitting
// `warmupTime: 250ms` requires ~250,000 iterations. A 1ms
// `globalThis.gc()` on every one would stretch warmup to ~250 seconds
// of wall time per task.
let inMeasurement = false;
const sweep = () => {
  if (inMeasurement) globalThis.gc?.();
};
const setMode = (_: unknown, mode: "run" | "warmup") => {
  inMeasurement = mode === "run";
};

// `time: 1000` (tinybench default) lets fast tasks accumulate dense
// sample counts; the 10-iter floor pins slow tasks (~5-12 sec/iter on a
// GitHub-hosted runner for the largest sizes). `warmupIterations: 1,
// warmupTime: 0` keeps warmup to a single priming iteration per task
// — V8 only needs one to enter the optimized tier, and a non-zero
// warmup time combined with per-iter GC was the original source of
// the observed "warmup hangs" (fast tasks would otherwise run millions
// of warmup iters to fill `warmupTime: 250`).
const BENCH_OPTS = {
  iterations: 10,
  warmup: true,
  warmupIterations: 1,
  warmupTime: 0,
  retainSamples: true,
  setup: setMode,
  teardown: setMode,
} as const;

// ---- Number benchmarks ----------------------------------------------------
//
// Each task gets its own dashboard chart (the `name` field is keyed
// per-chart by github-action-benchmark).

bench = new Bench(BENCH_OPTS);
for (const N of [2048, 4096] as const) {
  let mat: Matrix<number>;
  bench.add(`number[${N}][${N}]`, () => munkres(mat), {
    afterEach: () => {
      mat = [];
      sweep();
    },
    beforeEach: () => {
      mat = gen(N, N, () => genNum(MIN_VAL, MAX_VAL));
    },
  });
}
suite.add("number[][]", bench);

// ---- Bigint benchmarks ----------------------------------------------------

bench = new Bench(BENCH_OPTS);
for (const N of [2048, 4096] as const) {
  let mat: Matrix<bigint>;
  bench.add(`bigint[${N}][${N}]`, () => munkres(mat), {
    afterEach: () => {
      mat = [];
      sweep();
    },
    beforeEach: () => {
      mat = gen(N, N, () => genBig(MIN_VAL, MAX_VAL));
    },
  });
}
suite.add("bigint[][]", bench);

// Run benchmarks and report results
await suite.run();
