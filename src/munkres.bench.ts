import { Bench } from "tinybench";

import { Matrix } from "./types/matrix";
import { gen } from "./utils/matrix";
import { Suite } from "../tests/suite";
import { munkres } from "./munkres";

const minV = 1;
const maxV = Number.MAX_SAFE_INTEGER;
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

const suite = new Suite({ warmup: false });
let bench: Bench;

suite.add(`number`, (bench = new Bench()));
for (let i = 1; i < 14; ++i) {
  const N = 1 << i;
  let mat: Matrix<number>;
  bench.add(`${N}x${N}`, () => munkres(mat), {
    beforeEach: () => {
      mat = genNum(N);
    },
    afterEach: () => {
      mat = [];
    },
  });
}

suite.add(`bigint`, (bench = new Bench()));
for (let i = 1; i < 14; ++i) {
  const N = 1 << i;
  let mat: Matrix<bigint>;
  bench.add(`${N}x${N}`, () => munkres(mat), {
    beforeEach: () => {
      mat = genBig(N);
    },
    afterEach: () => {
      mat = [];
    },
  });
}

await suite.run();
