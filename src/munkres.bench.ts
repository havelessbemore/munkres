import { bench, describe } from "vitest";

import { munkres } from "./munkres";
import { Matrix } from "./types/matrix";

const MIN_V = -1e9;
const MAX_V = 1e9;
function genMatrix(Y: number, X: number): Matrix<number> {
  const costs: Matrix<number> = new Array(Y);
  const spanV = MAX_V - MIN_V;

  for (let y = 0; y < Y; ++y) {
    const row = new Array(X);
    for (let x = 0; x < X; ++x) {
      const r = Math.random();
      if (r < 0.08) {
        row[x] = -Infinity;
      } else if (r > 0.92) {
        row[x] = Infinity;
      } else if (r > 0.46 && r < 0.54) {
        row[x] = 0;
      } else {
        row[x] = MIN_V + Math.trunc(spanV * Math.random());
      }
    }
    costs[y] = row;
  }
  return costs;
}

describe("munkres", () => {
  let mat: Matrix<number>;
  for (let i = 3; i < 14; ++i) {
    const N = 1 << i;
    bench(
      `${N}x${N}`,
      () => {
        munkres(mat);
      },
      {
        setup: () => {
          mat = genMatrix(N, N);
        },
      }
    );
  }
});
