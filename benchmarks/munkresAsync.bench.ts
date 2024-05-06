import os from "os";

import { Bench } from "tinybench";
import workerpool from "workerpool";

import { munkresAsync } from "../src/munkres";
import { randomInt } from "../src/utils/number";
import { Runner } from "../src/types/runner";

import { Suite } from "./utils/suite";
import { TerminalReporter } from "./utils/terminalReporter";
import { MatrixLike } from "../src";

(async function main(): Promise<void> {
  // Create pool
  const pool = workerpool.pool("./examples/workerpool/worker.js", {
    maxWorkers: os.availableParallelism(),
  });

  // Create matcher
  const runner: Runner<unknown> = {
    size: pool.maxWorkers!,
    match: async (req) => await pool.exec("match", [req]),
  };

  let bench: Bench;
  const suite = new Suite({ warmup: false }).addReporter(
    new TerminalReporter(),
  );

  suite.add(`number`, (bench = new Bench({ iterations: 50 })));
  for (let i = 1; i <= 12; ++i) {
    const N = 1 << i;
    let mat: MatrixLike<number>;
    bench.add(`${N}x${N}`, async () => await munkresAsync(mat, runner), {
      beforeEach: () => {
        mat = [];
        mat = gen(N, N, getInt);
      },
    });
  }

  try {
    console.log(`THREADS: ${pool.maxWorkers}`);
    await suite.run();
  } finally {
    await pool.terminate();
  }
})();

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
