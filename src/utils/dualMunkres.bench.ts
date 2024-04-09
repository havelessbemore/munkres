import { bench, describe } from "vitest";

import { munkres } from "./dualMunkres";
import { gen } from "./matrix";

const VAL_MIN = -1e9;
const VAL_MAX = 1e9;

describe(`munkres`, () => {
  for (let i = 1; i < 12; ++i) {
    const N = 1 << i;
    const mat = gen(N, N, () => {
      const span = VAL_MAX - VAL_MIN;
      return VAL_MIN + Math.trunc(span * Math.random());
    });

    bench(`${N}x${N}`, () => {
      munkres(mat);
    });
  }
});