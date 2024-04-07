import { bench, describe } from "vitest";

import { Matrix } from "./types/matrix";

import { munkres } from "./munkres";
import { gen } from "./utils/matrix";

const VAL_MIN = -1e9;
const VAL_MAX = 1e9;

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
          mat = gen(N, N, () => {
            const span = VAL_MAX - VAL_MIN;
            return VAL_MIN + Math.trunc(span * Math.random());
          });
        },
      }
    );
  }
});
