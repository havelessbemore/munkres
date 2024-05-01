import Piscina from "piscina";

const pool = new Piscina({
  filename: new URL("./worker.js", import.meta.url).toString(),
});

try {
  let res = await pool.run([4, 6], { name: "add" });
  console.log(`Add: ${res}`);
  res = await pool.run(24, { name: "fibonacci" });
  console.log(`Fibonacci: ${res}`);
} finally {
  await pool.destroy();
}
