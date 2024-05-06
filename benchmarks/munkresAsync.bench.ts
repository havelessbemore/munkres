import os from "os";

import { Bench } from "tinybench";
import workerpool from "workerpool";

import type { Runner } from "../src/types/async";
import type { MatrixLike } from "../src/types/matrixLike";
import { munkresAsync } from "../src/munkres";
import { gen } from "../src/utils/matrix";
import { toTypedMatrix } from "../src/utils/matrixLike";
import { randomInt } from "../src/utils/number";

import { Suite } from "./utils/suite";
import { TerminalReporter } from "./utils/terminalReporter";

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
  const suite = new Suite({ warmup: true }).addReporter(new TerminalReporter());

  suite.add(`number`, (bench = new Bench({ iterations: 50 })));
  for (let i = 1; i <= 12; ++i) {
    const N = 1 << i;
    let mat: MatrixLike<number>;
    bench.add(`${N}x${N}`, async () => await munkresAsync(mat, runner), {
      beforeEach: () => {
        mat = [];
        mat = toTypedMatrix(gen(N, N, genInt));
      },
    });
  }

  suite.add(`bigint`, (bench = new Bench({ iterations: 50 })));
  for (let i = 1; i <= 11; ++i) {
    const N = 1 << i;
    let mat: MatrixLike<bigint>;
    bench.add(`${N}x${N}`, async () => await munkresAsync(mat, runner), {
      beforeEach: () => {
        mat = [];
        mat = toTypedMatrix(gen(N, N, genBig));
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
const MAX_VAL = Number.MAX_SAFE_INTEGER;

export function genBig(): bigint {
  return BigInt(genInt());
}

export function genInt(): number {
  return randomInt(MIN_VAL, MAX_VAL);
}
