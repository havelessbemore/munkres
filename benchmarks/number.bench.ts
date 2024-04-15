import { Bench } from "tinybench";

import { Matrix } from "../src/types/matrix";
import { gen } from "../src/utils/matrix";
import { CIReporter, Suite } from "./utils/suite";
import { munkres } from "../src/munkres";

const minV = 1;
const maxV = Number.MAX_SAFE_INTEGER;
const span = maxV - minV;

function genNum(N: number): Matrix<number>;
function genNum(Y: number, X: number): Matrix<number>;
function genNum(Y: number, X = Y): Matrix<number> {
  return gen(Y, X, () => minV + Math.trunc(span * Math.random()));
}

let bench: Bench;
const suite = new Suite({ warmup: false }).addReporter(new CIReporter());

suite.add(`number`, (bench = new Bench()));
for (let i = 1; i < 14; ++i) {
  const N = 1 << i;
  let mat: Matrix<number>;
  bench.add(`${N}x${N}`, () => munkres(mat), {
    beforeEach: () => {
      mat = genNum(N);
    },
    afterEach: () => {
      mat = [];
    },
  });
}

await suite.run();
