import { Bench } from "tinybench";

import { Matrix } from "../src/types/matrix";
import { gen, map } from "../src/utils/matrix";
import { Suite } from "./utils/suite";
import { munkres } from "../src/munkres";
import { CIReporter } from "./utils/ciReporter";

const minV = 1;
const maxV = Number.MAX_SAFE_INTEGER;
const span = maxV - minV;

function genNum(N: number): Matrix<number>;
function genNum(Y: number, X: number): Matrix<number>;
function genNum(Y: number, X = Y): Matrix<number> {
  return gen(Y, X, () => minV + Math.trunc(span * Math.random()));
}

const N = 4096;
const numMat = genNum(N);
const bigMat = map(numMat, v => BigInt(v));

const bench = new Bench()
  .add(`number[${N}][${N}]`, () => munkres(numMat))
  .add(`bigint[${N}][${N}]`, () => munkres(bigMat));

await new Suite({ warmup: false })
  .addReporter(new CIReporter())
  .add("", bench)
  .run();
