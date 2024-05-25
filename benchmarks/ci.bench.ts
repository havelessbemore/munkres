import path from "node:path";

import { program } from "commander";
import { Bench } from "tinybench";

import type { Matrix } from "../src/types/matrix.ts";
import { gen } from "../src/utils/matrix.ts";
import { munkres } from "../src/munkres.ts";

import { Suite } from "./utils/suite.ts";
import { CIReporter } from "./utils/ciReporter.ts";

// Define and get parameters
program.option("-o, --output <filepath>", "output file path");
program.parse(process.argv);
const options = program.opts();

// Define helpers
const MIN_VAL = 1;
const MAX_VAL = Number.MAX_SAFE_INTEGER;

function genBig(min: number, max: number): bigint {
  return BigInt(genNum(min, max));
}

function genNum(min: number, max: number): number {
  return min + Math.trunc((max - min) * Math.random());
}

// Create benchmark suite
let bench: Bench;
const suite = new Suite({ warmup: true });

// Add reporters
suite.addReporter(new CIReporter(path.resolve(options.output)));

// Create number[][] benchmark
(() => {
  const N = 4096; // 2**12
  let mat: Matrix<number>;
  bench = new Bench({ iterations: 50 }).add(
    `number[${N}][${N}]`,
    () => munkres(mat),
    {
      afterEach: () => {
        mat = [];
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
  bench = new Bench({ iterations: 50 }).add(
    `bigint[${N}][${N}]`,
    () => munkres(mat),
    {
      afterEach: () => {
        mat = [];
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
