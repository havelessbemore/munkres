import workerpool from "workerpool";

function add(a, b) {
  return a + b;
}

function fibonacci(n) {
  return n < 2 ? n : fibonacci(n - 2) + fibonacci(n - 1);
}

workerpool.worker({ add, fibonacci });
