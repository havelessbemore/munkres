const path = require("path");
const Worker = require("web-worker");

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

(async function main() {
  const worker = new Worker(path.resolve(__dirname, "./worker.cjs"));
  try {
    let res = await run(worker, "add", 4, 6);
    console.log(`Add: ${res}`);
    res = await run(worker, "fibonacci", 24);
    console.log(`Fibonacci: ${res}`);
  } finally {
    worker.terminate();
  }
})();
