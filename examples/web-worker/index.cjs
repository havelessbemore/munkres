/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const Worker = require("web-worker");

const { genMatrix, munkresAsync } = require("../..");

// PARAMS
const M = 32;
const N = 32;
const MIN_VAL = 1;
const MAX_VAL = Number.MAX_SAFE_INTEGER;
// END PARAMS

(async function main() {
  // Create worker
  const worker = new Worker(path.resolve(__dirname, "./worker.cjs"));

  // Create matcher
  const matcher = {
    size: 1,
    match: (matching) => run(worker, "match", matching),
  };

  // Find optimal matching
  try {
    const costs = genMatrix(M, N, genInt);
    const res = await munkresAsync(costs, matcher);
    console.log(res);
  } finally {
    worker.terminate();
  }
})();

// Helpers
function genInt() {
  return randomInt(MIN_VAL, MAX_VAL);
}

function randomInt(min, max) {
  return Math.trunc(min + (max - min) * Math.random());
}

async function run(worker, name, ...args) {
  return new Promise((resolve, reject) => {
    function onMessage(e) {
      worker.removeEventListener("message", onMessage);
      const { err, res } = e.data;
      err == null ? resolve(res) : reject(err);
    }

    worker.addEventListener("message", onMessage);
    worker.postMessage({ name, args });
  });
}
