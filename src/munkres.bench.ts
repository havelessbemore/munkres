import { Bench } from "tinybench";

import { Matrix } from "./types/matrix";
import { gen } from "./utils/matrix";
import { Suite } from "./utils/suite";
import { munkres } from "./munkres";

const minV = 1;
const maxV = 2e9;
const span = maxV - minV;

function genNum(N: number): Matrix<number>;
function genNum(Y: number, X: number): Matrix<number>;
function genNum(Y: number, X = Y): Matrix<number> {
  return gen(Y, X, () => minV + Math.trunc(span * Math.random()));
}

function genBig(N: number): Matrix<bigint>;
function genBig(Y: number, X: number): Matrix<bigint>;
function genBig(Y: number, X = Y): Matrix<bigint> {
  return gen(Y, X, () => BigInt(minV + Math.trunc(span * Math.random())));
}

const suite = new Suite();
let bench: Bench;

suite.add(`number`, (bench = new Bench()));
for (let i = 1; i < 13; ++i) {
  const N = 1 << i;
  const mat = genNum(N);
  bench.add(`${N}x${N}`, () => munkres(mat));
}

suite.add(`bigint`, (bench = new Bench()));
for (let i = 1; i < 13; ++i) {
  const N = 1 << i;
  const mat = genBig(N);
  bench.add(`${N}x${N}`, () => munkres(mat));
}

await suite.run();
