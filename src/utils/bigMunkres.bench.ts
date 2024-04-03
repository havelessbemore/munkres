import { bench, describe } from "vitest";

import { Matrix } from "../types/matrix";

import { bigStep4 } from "./bigMunkres";

export function genBigMatrix(
  Y: number,
  X: number,
  minVal: number,
  maxVal: number
): Matrix<bigint> {
  const costs: Matrix<bigint> = new Array(Y);
  const spanV = maxVal - minVal;

  for (let y = 0; y < Y; ++y) {
    const row = new Array(X);
    for (let x = 0; x < X; ++x) {
      row[x] = BigInt(minVal + Math.trunc(spanV * Math.random()));
    }
    costs[y] = row;
  }
  return costs;
}

describe("munkres", () => {
  let mat: Matrix<bigint>;
  for (let i = 1; i < 10; ++i) {
    const N = 1 << i;
    bench(
      `${N}x${N}`,
      () => {
        bigStep4(mat);
      },
      {
        setup: () => {
          mat = genBigMatrix(N, N, -1e9, 1e9);
        },
      }
    );
  }
});
