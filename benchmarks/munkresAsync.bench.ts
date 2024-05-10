import os from "os";

import { Bench } from "tinybench";
import workerpool from "workerpool";

import type { Runner } from "../src/types/async";
import { munkres, munkresAsync } from "../src/munkres";
import { gen } from "../src/utils/matrix";
import { toTypedMatrix } from "../src/utils/matrixLike";
import { randomInt } from "../src/utils/number";

import { Suite } from "./utils/suite";
import { TerminalReporter } from "./utils/terminalReporter";

const MIN_VAL = 1;
const MAX_VAL = Number.MAX_SAFE_INTEGER;

export function genInt(): number {
  return randomInt(MIN_VAL, MAX_VAL);
}

(async function main(): Promise<void> {
  // Create pool
  const pool = workerpool.pool("./examples/workerpool/worker.js", {
    maxWorkers: os.availableParallelism(),
  });

  // Create runners
  const runners: Runner<unknown>[] = [];
  for (let n = 2; n < pool.maxWorkers!; n += n) {
    runners.push({
      size: n,
      match: async (req) => await pool.exec("match", [req]),
    });
  }
  runners.push({
    size: pool.maxWorkers!,
    match: async (req) => await pool.exec("match", [req]),
  });

  let bench: Bench;
  const suite = new Suite({ warmup: true }).addReporter(new TerminalReporter());

  for (let i = 1; i <= 12; ++i) {
    const N = 1 << i;
    const matSync = gen(N, N, genInt);
    const matAsync = toTypedMatrix(matSync);
    suite.add(`${N}x${N}`, (bench = new Bench({ iterations: 50 })));
    bench.add(`sync`, () => munkres(matSync));
    for (const runner of runners) {
      bench.add(`async (${runner.size})`, async () => {
        await munkresAsync(matAsync, runner);
      });
    }
  }

  try {
    await suite.run();
  } finally {
    await pool.terminate();
  }
})();
