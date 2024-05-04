import Piscina from "piscina";
import { Bench } from "tinybench";

import { munkresAsync } from "../src/munkres";
import { randomInt } from "../src/utils/number";
import { Runner } from "../src/types/runner";

import { Suite } from "./utils/suite";
import { TerminalReporter } from "./utils/terminalReporter";
import { MatrixLike } from "../src";

const MIN_VAL = 1;
const MAX_VAL = 1e9;

export function getInt(): number {
  return randomInt(MIN_VAL, MAX_VAL);
}

export function gen(
  Y: number,
  X: number,
  callbackfn: () => number,
): MatrixLike<number> {
  const matrix = new Array<Float64Array>(Y);
  const B = X * Float64Array.BYTES_PER_ELEMENT;
  for (let y = 0; y < Y; ++y) {
    const row = new Float64Array(new SharedArrayBuffer(B));
    for (let x = 0; x < X; ++x) {
      row[x] = callbackfn();
    }
    matrix[y] = row;
  }
  return matrix;
}

let bench: Bench;
const suite = new Suite({ warmup: false }).addReporter(new TerminalReporter());

const pool = new Piscina({
  filename: "./examples/piscina/worker.js",
  maxThreads: 4,
  recordTiming: false,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const runner: Runner<any> = {
  size: pool.maxThreads,
  match: (matching) => pool.run(matching, { name: "match" }),
};

suite.add(`number`, (bench = new Bench({ iterations: 50 })));
for (let i = 1; i <= 10; ++i) {
  const N = 1 << i;
  let mat: MatrixLike<number>;
  bench.add(`${N}x${N}`, async () => await munkresAsync(mat, runner), {
    beforeEach: () => {
      mat = [];
      mat = gen(N, N, getInt);
    },
  });
}

await suite.run();
