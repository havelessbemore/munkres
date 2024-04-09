import { bench, describe } from "vitest";

import { munkres } from "./munkres";
import { gen, map } from "./utils/matrix";

const VAL_MIN = -1e9;
const VAL_MAX = 1e9;

describe(`munkres`, () => {
  for (let i = 1; i < 10; ++i) {
    const N = 1 << i;

    const mat = gen(N, N, () => {
      const span = VAL_MAX - VAL_MIN;
      return VAL_MIN + Math.trunc(span * Math.random());
    });

    bench(`${N}x${N} | number`, () => {
      munkres(mat);
    });

    const bigMat = map(mat, v => BigInt(v));
    bench(`${N}x${N} | bigint`, () => {
      munkres(bigMat);
    });
  }
});
