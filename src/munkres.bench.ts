import { Bench } from "tinybench";

import { munkres } from "./munkres";
import { gen, map } from "./utils/matrix";
import { Matrix } from "./types/matrix";
import { Suite } from "./utils/suite";

function genRandom(N: number): Matrix<number>;
function genRandom(Y: number, X: number): Matrix<number>;
function genRandom(Y: number, X = Y): Matrix<number> {
  const minV = 1;
  const maxV = 2e9;
  const span = maxV - minV;
  return gen(Y, X, () => minV + Math.trunc(span * Math.random()));
}

const suite = new Suite();
let bench: Bench;

suite.add(`number`, (bench = new Bench()));
for (let i = 1; i < 13; ++i) {
  const N = 1 << i;
  const mat = genRandom(N);
  bench.add(`${N}x${N}`, () => munkres(mat));
}

suite.add(`bigint`, (bench = new Bench()));
for (let i = 1; i < 13; ++i) {
  const N = 1 << i;
  const mat = map(genRandom(N), v => BigInt(v));
  bench.add(`${N}x${N}`, () => munkres(mat));
}

await suite.run();
