import { bench, describe } from "vitest";

import { munkres } from "./munkres";
import { gen } from "./utils/matrix";
import { Matrix } from "./types/matrix";

function genRandom(N: number): Matrix<number>;
function genRandom(Y: number, X: number): Matrix<number>;
function genRandom(Y: number, X = Y): Matrix<number> {
  const minV = -1e9;
  const maxV = 1e9;
  const span = maxV - minV;
  return gen(Y, X, () => minV + Math.trunc(span * Math.random()));
}

describe(`munkres | number`, () => {
  for (let i = 1; i < 13; ++i) {
    const N = 1 << i;
    const mat = genRandom(N);
    bench(`${N}x${N}`, () => {
      munkres(mat);
    });
  }
});

describe(`munkres | bigint`, () => {
  for (let i = 1; i < 12; ++i) {
    const N = 1 << i;
    const mat = genRandom(N);
    bench(`${N}x${N}`, () => {
      munkres(mat);
    });
  }
});
