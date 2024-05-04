import { Bench } from "tinybench";

import type { Matrix } from "../src/types/matrix";

import { munkres } from "../src/munkres";
import { gen } from "../src/utils/matrix";
import { randomInt } from "../src/utils/number";

import { Suite } from "./utils/suite";
import { TerminalReporter } from "./utils/terminalReporter";

const MIN_VAL = 1;
const MAX_VAL = Number.MAX_SAFE_INTEGER;

export function genBig(): bigint {
  return BigInt(genInt());
}

export function genInt(): number {
  return randomInt(MIN_VAL, MAX_VAL);
}

let bench: Bench;
const suite = new Suite({ warmup: true }).addReporter(new TerminalReporter());

suite.add(`number`, (bench = new Bench({ iterations: 50 })));
for (let i = 1; i <= 12; ++i) {
  const N = 1 << i;
  let mat: Matrix<number>;
  bench.add(`${N}x${N}`, () => munkres(mat), {
    beforeEach: () => {
      mat = [];
      mat = gen(N, N, genInt);
    },
  });
}

suite.add(`bigint`, (bench = new Bench({ iterations: 50 })));
for (let i = 1; i <= 11; ++i) {
  const N = 1 << i;
  let mat: Matrix<bigint>;
  bench.add(`${N}x${N}`, () => munkres(mat), {
    beforeEach: () => {
      mat = [];
      mat = gen(N, N, genBig);
    },
  });
}

await suite.run();
