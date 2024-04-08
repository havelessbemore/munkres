import { bench, describe } from "vitest";

import { munkres as dualMunkres } from "./dualMunkres";
import { gen, map } from "./matrix";

const VAL_MIN = -1e9;
const VAL_MAX = 1e9;

describe(`munkres`, () => {
  for (let i = 1; i < 12; ++i) {
    const N = 1 << i;

    const mat = gen(N, N, () => {
      const span = VAL_MAX - VAL_MIN;
      return VAL_MIN + Math.trunc(span * Math.random());
    });

    const bigMat = map(mat, v => BigInt(v));

    bench(`${N}x${N}`, () => {
      dualMunkres(mat);
    });

    bench(`${N}x${N} (big)`, () => {
      dualMunkres(bigMat);
    });
  }
});
