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

// Force a synchronous GC between iterations. tinybench's `afterEach` runs
// after the iteration's timing window closes, so the GC pause does not
// count against the measurement. With per-iteration allocations on the
// order of 32-96 MB (the bigint matrix dominates), letting GC run on its
// own schedule across 50+ iterations introduces 2-3× per-iteration noise
// that swamps the algorithm's intrinsic cost. Forcing GC here pins each
// iteration to roughly the same heap state and gives the dashboard a
// stable signal. The optional-chain keeps the script working without
// `--expose-gc` (just with the prior noise level).
const sweep = () => {
  globalThis.gc?.();
};

// Create number[][] benchmark
(() => {
  const N = 4096; // 2**12
  let mat: Matrix<number>;
  bench = new Bench({ iterations: 50, warmup: true, retainSamples: true }).add(
    `number[${N}][${N}]`,
    () => munkres(mat),
    {
      afterEach: () => {
        mat = [];
        sweep();
      },
      beforeEach: () => {
        mat = gen(N, N, () => genNum(MIN_VAL, MAX_VAL));
      },
    },
  );
  suite.add("number[][]", bench);
})();

// Create bigint[][] benchmark
(() => {
  const N = 2048; // 2**11
  let mat: Matrix<bigint>;
  bench = new Bench({ iterations: 50, warmup: true, retainSamples: true }).add(
    `bigint[${N}][${N}]`,
    () => munkres(mat),
    {
      afterEach: () => {
        mat = [];
        sweep();
      },
      beforeEach: () => {
        mat = gen(N, N, () => genBig(MIN_VAL, MAX_VAL));
      },
    },
  );
  suite.add("bigint[][]", bench);
})();

// Run benchmarks and report results
await suite.run();
