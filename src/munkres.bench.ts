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
  const mats: Matrix<number>[] = [];
  for (let i = 0; i <= 12; ++i) {
    const N = 1 << i;
    mats[i] = genMatrix(N, N);
  }

  bench("8x8", () => {
    munkres(mats[3]);
  });

  bench("16x16", () => {
    munkres(mats[4]);
  });

  bench("32x32", () => {
    munkres(mats[5]);
  });

  bench("64x64", () => {
    munkres(mats[6]);
  });

  bench("128x128", () => {
    munkres(mats[7]);
  });

  bench("256x256", () => {
    munkres(mats[8]);
  });

  bench("512x512", () => {
    munkres(mats[9]);
  });

  bench("1024x1024", () => {
    munkres(mats[10]);
  });

  bench("2048x2048", () => {
    munkres(mats[11]);
  });

  bench("4096x4096", () => {
    munkres(mats[12]);
  });
});
