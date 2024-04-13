import { Bench } from "tinybench";

import { Suite } from "../../../tests/suite";

import { Matrix } from "../../types/matrix";

import { gen, map } from "../matrix";
import { exec as num } from "./numMunkres";
import { exec as bigint } from "./bigMunkres";

const minV = 1;
const maxV = Number.MAX_SAFE_INTEGER;
const span = maxV - minV;

function genNum(N: number): Matrix<number>;
function genNum(Y: number, X: number): Matrix<number>;
function genNum(Y: number, X = Y): Matrix<number> {
  return gen(Y, X, () => minV + Math.trunc(span * Math.random()));
}

const suite = new Suite({ warmup: false });
let bench: Bench;

for (let i = 1; i < 12; ++i) {
  const N = 1 << i;
  const mat = genNum(N);
  const bigMat = map(mat, v => BigInt(v));
  suite.add(`${N}x${N}`, (bench = new Bench()));
  bench.add("number", () => num(mat));
  bench.add("bigint", () => bigint(bigMat));
}

await suite.run();
