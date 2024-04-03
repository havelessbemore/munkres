import { bench, describe } from "vitest";

import { Matrix } from "./types/matrix";

import { munkres } from "./munkres";

function genMatrix(
  Y: number,
  X: number,
  minVal: number,
  maxVal: number
): Matrix<number> {
  const costs: Matrix<number> = new Array(Y);
  const spanV = maxVal - minVal;

  for (let y = 0; y < Y; ++y) {
    const row = new Array(X);
    for (let x = 0; x < X; ++x) {
      row[x] = minVal + Math.trunc(spanV * Math.random());
    }
    costs[y] = row;
  }
  return costs;
}

describe("munkres", () => {
  let mat: Matrix<number>;
  for (let i = 1; i < 10; ++i) {
    const N = 1 << i;
    bench(
      `${N}x${N}`,
      () => {
        munkres(mat);
      },
      {
        setup: () => {
          mat = genMatrix(N, N, -1e9, 1e9);
        },
      }
    );
  }
});
