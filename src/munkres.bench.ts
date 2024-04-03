import { bench, describe } from "vitest";

import { Matrix } from "./types/matrix";

import { genMatrix } from "./utils/munkres.bench";

import { munkres } from "./munkres";

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
