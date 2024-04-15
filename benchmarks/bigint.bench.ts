import { Bench } from "tinybench";

import { Matrix } from "../src/types/matrix";
import { gen } from "../src/utils/matrix";
import { CIReporter, Suite } from "./utils/suite";
import { munkres } from "../src/munkres";

const minV = 1;
const maxV = Number.MAX_SAFE_INTEGER;
const span = maxV - minV;

function genMat(N: number): Matrix<bigint>;
function genMat(Y: number, X: number): Matrix<bigint>;
function genMat(Y: number, X = Y): Matrix<bigint> {
  return gen(Y, X, () => BigInt(minV + Math.trunc(span * Math.random())));
}

let bench: Bench;
const suite = new Suite({ warmup: false }).addReporter(new CIReporter());

suite.add(`bigint`, (bench = new Bench()));
for (let i = 1; i <= 12; ++i) {
  const N = 1 << i;
  let mat: Matrix<bigint>;
  bench.add(`${N}x${N}`, () => munkres(mat), {
    beforeEach: () => {
      mat = genMat(N);
    },
    afterEach: () => {
      mat = [];
    },
  });
}

await suite.run();
