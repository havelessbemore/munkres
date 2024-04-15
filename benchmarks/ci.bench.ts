import path from "path";

import { program } from "commander";
import { Bench } from "tinybench";

import { Matrix } from "../src/types/matrix";
import { gen, map } from "../src/utils/matrix";
import { Suite } from "./utils/suite";
import { munkres } from "../src/munkres";
import { CIReporter } from "./utils/ciReporter";
import { TerminalReporter } from "./utils/terminalReporter";

// Define and get parameters
program.option("-o, --output <filepath>", "output file path");
program.parse(process.argv);
const options = program.opts();

// Define helpers
const minV = 1;
const maxV = Number.MAX_SAFE_INTEGER;
const span = maxV - minV;
function genNum(N: number): Matrix<number>;
function genNum(Y: number, X: number): Matrix<number>;
function genNum(Y: number, X = Y): Matrix<number> {
  return gen(Y, X, () => minV + Math.trunc(span * Math.random()));
}

// Create random matrix
const N = 4096;
const numMat = genNum(N);
const bigMat = map(numMat, v => BigInt(v));

// Create benchmarks
const bench = new Bench()
  .add(`number[${N}][${N}]`, () => munkres(numMat))
  .add(`bigint[${N}][${N}]`, () => munkres(bigMat));

// Run benchmarks and report results
await new Suite({ warmup: false })
  .addReporter(new TerminalReporter())
  .addReporter(new CIReporter(path.resolve(options.output)))
  .add("", bench)
  .run();
