import workerpool from "workerpool";

const pool = workerpool.pool("./examples/workerpool/worker.js");

try {
  let res = await pool.exec("add", [4, 6]);
  console.log(`Add: ${res}`);
  res = await pool.exec("fibonacci", [24]);
  console.log(`Fibonacci: ${res}`);
} finally {
  pool.terminate();
}
