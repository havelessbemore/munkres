import workerpool from "workerpool";

import { genMatrix, munkresAsync } from "../../dist/munkres.mjs";

// PARAMS
const M = 32;
const N = 32;
const WORKERS = 8;
const MIN_VAL = 1;
const MAX_VAL = Number.MAX_SAFE_INTEGER;
// END PARAMS

(async function main() {
  // Create pool
  const pool = workerpool.pool("./examples/workerpool/worker.js", {
    maxWorkers: WORKERS,
  });

  // Create matcher
  const matcher = {
    size: pool.maxWorkers,
    match: (matching) => pool.exec("match", [matching]),
  };

  // Find optimal matching
  try {
    const costs = genMatrix(M, N, genInt);
    const res = await munkresAsync(costs, matcher);
    console.log(res);
  } finally {
    await pool.terminate();
  }
})();

// Helpers
function genInt() {
  return randomInt(MIN_VAL, MAX_VAL);
}

function randomInt(min, max) {
  return Math.trunc(min + (max - min) * Math.random());
}
