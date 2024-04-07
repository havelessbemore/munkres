import { bench, describe } from "vitest";

import { step4 } from "./munkres";
import { copy, gen } from "./matrix";

const VAL_MIN = -1e9;
const VAL_MAX = 1e9;

for (let i = 1; i < 9; ++i) {
  const N = 1 << i;
  const mat = gen(N, N, () => {
    const span = VAL_MAX - VAL_MIN;
    return VAL_MIN + Math.trunc(span * Math.random());
  });

  describe(`munkres - ${N}x${N}`, () => {
    bench(`munkres`, () => {
      step4(copy(mat));
    });

    bench(`dualMunkres`, () => {
      step4(mat);
    });
  });
}
