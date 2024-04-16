import path from "path";

import { program } from "commander";
import { Bench } from "tinybench";

import { Matrix } from "../src/types/matrix";
import { gen } from "../src/utils/matrix";
import { Suite } from "./utils/suite";
import { munkres } from "../src/munkres";
import { CIReporter } from "./utils/ciReporter";

// Define and get parameters
program.option("-o, --output <filepath>", "output file path");
program.parse(process.argv);
const options = program.opts();

// Define helpers
const minV = 1;
const maxV = Number.MAX_SAFE_INTEGER;
const span = maxV - minV;

function genBig(N: number): Matrix<bigint>;
function genBig(Y: number, X: number): Matrix<bigint>;
function genBig(Y: number, X = Y): Matrix<bigint> {
  return gen(Y, X, () => BigInt(minV + Math.trunc(span * Math.random())));
}

function genNum(N: number): Matrix<number>;
function genNum(Y: number, X: number): Matrix<number>;
function genNum(Y: number, X = Y): Matrix<number> {
  return gen(Y, X, () => minV + Math.trunc(span * Math.random()));
}

// Create random matrix
const N = 4096;
let mat: Matrix<number>;
let bigMat: Matrix<bigint>;

// Create benchmark suite
let bench: Bench;
const suite = new Suite({ warmup: true });

// Add reporters
suite.addReporter(new CIReporter(path.resolve(options.output)));

// Create number[][] benchmark
bench = new Bench({ iterations: 50 }).add(
  `number[${N}][${N}]`,
  () => munkres(mat),
  {
    afterEach: () => {
      mat = [];
    },
    beforeEach: () => {
      mat = genNum(N);
    },
  }
);
suite.add("number[][]", bench);

// Create bigint[][] benchmark
bench = new Bench({ iterations: 15 }).add(
  `bigint[${N}][${N}]`,
  () => munkres(bigMat),
  {
    afterEach: () => {
      bigMat = [];
    },
    beforeEach: () => {
      bigMat = genBig(N);
    },
  }
);
suite.add("bigint[][]", bench);

// Run benchmarks and report results
await suite.run();
