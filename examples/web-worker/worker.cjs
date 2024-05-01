function add(a, b) {
  return a + b;
}

function fibonacci(n) {
  return n < 2 ? n : fibonacci(n - 2) + fibonacci(n - 1);
}

const fns = { add, fibonacci };
addEventListener("message", (e) => {
  const { name, args } = e.data;
  try {
    if (name == null) {
      throw new Error(`Function not specified`);
    }
    if (fns[name] == null) {
      throw new Error(`Unknown function '${name}'`);
    }
    const res = fns[name](...args);
    postMessage({ name, res });
  } catch (err) {
    postMessage({ name, err });
  }
});
