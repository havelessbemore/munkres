# Munkres

A lightweight and efficient implementation of the [Munkres (Hungarian) algorithm](https://en.wikipedia.org/wiki/Hungarian_algorithm) for optimal assignment.

[![Version](https://img.shields.io/npm/v/munkres.svg)](https://www.npmjs.com/package/munkres)
[![Maintenance](https://img.shields.io/maintenance/yes/2024.svg)](https://github.com/havelessbemore/munkres/graphs/commit-activity)
[![License](https://img.shields.io/github/license/havelessbemore/munkres.svg)](https://github.com/havelessbemore/munkres/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/havelessbemore/munkres/graph/badge.svg?token=F362G7C9U0)](https://codecov.io/gh/havelessbemore/munkres)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/munkres)

## Features

- Supports square (NxN) and rectangular (MxN) cost matrices.
- Supports `number[][]` and `bigint[][]` cost matrices.
- Supports `-Infinity` and `Infinity` in `number[][]` cost matrices.
- [Helpers](#helpers) included for creating and manipulating cost matrices.

## Getting Started

### Install

Using npm:

```bash
npm install munkres
```

Using yarn:

```bash
yarn add munkres
```

## Usage

Example 1: Using a cost matrix

```javascript
import munkres from "munkres";

// Create a cost matrix. Cell [y, x] is the cost
// of assigning the y-th worker to the x-th job.
const costMatrix = [
  [1, 2, 3],
  [2, 4, 6],
  [3, 6, 9],
];

// Find the optimal assignments. Returns an array of pairs
// of the form [y, x], indicating that worker y was assigned
// to job x.
const assignments = munkres(costMatrix);

console.log(assignments);
// Output: [[0, 2], [1, 1], [2, 0]]
```

Example 2: Creating a cost matrix

```javascript
import { munkres, createCostMatrix } from "munkres";

// Define your workers and jobs.
const workers = ["Alice", "Bob"];
const jobs = ["Job 1", "Job 2", "Job 3"];

// Define a cost function that takes a worker
// and a job and returns the cost of assigning
// the worker to the job.
//
// For this example, we'll use a precomputed map.
const costs = {
  "AliceJob 1": 2,
  "AliceJob 2": 25,
  "AliceJob 3": 18,
  "BobJob 1": 9,
  "BobJob 2": 4,
  "BobJob 3": 17,
};
const costFn = (worker, job) => {
  // Your cost calculation goes here.
  return costs[worker + job];
};

// Create the 2x3 cost matrix. Each cell [y, x] will be
// the cost of assigning the y-th worker to the x-th job.
const costMatrix = createCostMatrix(workers, jobs, costFn);

// Find the optimal assignments. Returns an array of pairs
// of the form [y, x], indicating that worker y was assigned
// to job x.
const assignments = munkres(costMatrix);

console.log(assignments);
// Output: [[0, 0], [1, 1]]
```

## API

- `munkres(costMatrix)`: Executes the Munkres algorithm on the given cost matrix and returns the optimal assignment of workers to jobs.

### Types

The package exports the following TypeScript types:

- `Matrix<T>`: A generic matrix type representing a two-dimensional matrix (i.e. `T[][]`).

### Helpers

A set of utility functions are provided to help create and manipulate cost matrices:

- `createCostMatrix(workers, jobs, costFn)`: Generates a cost matrix based on the given workers, jobs, and cost function.
- `getMaxCost(costMatrix)`: Finds the maximum cost in a given cost matrix.
- `getMinCost(costMatrix)`: Finds the minimum cost in a given cost matrix.
- `invertCostMatrix(costMatrix, bigVal?)`: Inverts the costs in the given matrix, useful for converting between minimizing and maximizing problems.
- `negateCostMatrix(costMatrix)`: Negates all costs in the given matrix, also useful for converting between minimizing and maximizing problems.

## Community and Support

We welcome contributions, feedback, and bug reports. Please feel free to [submit an issue](https://github.com/havelessbemore/munkres/issues) or a pull request.

For support, you can reach out via [GitHub discussions](https://github.com/havelessbemore/munkres/discussions).

## Build

1. Clone the project from github

```bash
git clone git@github.com:havelessbemore/munkres.git
cd munkres
```

2. Install dependencies

```bash
npm install
```

3. Build the project

```bash
npm run build
```

This will build ESM and CommonJS outputs in the dist/ folder.

## Format

To run the code linter:

```bash
npm run lint
```

To automatically fix linting issues, run:

```bash
npm run format
```

## Test

To run tests:

```bash
npm test
```

To run tests with a coverage report:

```bash
npm run test:coverage
```

A coverage report is generated at `./coverage/index.html`.

## Benchmark

To run benchmarks:

```bash
npm run bench
```

For example, the `munkres()` [benchmark](src/munkres.bench.ts) for `number` matrices:

| Dimensions | Ops / Sec  | Min (ms) | Max (ms) | Avg (ms) |
| ---------- | ---------- | -------- | -------- | -------- |
| 8x8        | 934,582.19 | 0.0010   | 0.1763   | 0.0011   |
| 16x16      | 63,499.71  | 0.0150   | 0.2197   | 0.0157   |
| 32x32      | 9,295.73   | 0.1030   | 1.6487   | 0.1076   |
| 64x64      | 1,933.60   | 0.4986   | 0.6842   | 0.5172   |
| 128x128    | 1,444.79   | 0.6705   | 0.8880   | 0.6921   |
| 256x256    | 428.40     | 2.3079   | 2.4936   | 2.3343   |
| 512x512    | 153.93     | 6.4032   | 6.6689   | 6.4964   |
| 1024x1024  | 51.0982    | 19.4089  | 19.7999  | 19.5702  |
| 2048x2048  | 10.6961    | 87.6427  | 96.5724  | 93.4923  |
| 4096x4096  | 2.0010     | 476.38   | 583.18   | 499.74   |

Testing with:

- Package version: v1.0.1
- OS: M2 Macbook Air, Mac OS v14.4.1
- Runtime: NodeJS v20.12.0
- Benchmarking Tool: Vitest v1.2.2

---

Made with ❤️ by [Michael Rojas](https://github.com/havelessbemore)
