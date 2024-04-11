munkres / [Exports](modules.md)

# Munkres

A lightweight and efficient implementation of the [Munkres (Hungarian) algorithm](https://en.wikipedia.org/wiki/Hungarian_algorithm) for optimal assignment.

[![Version](https://img.shields.io/npm/v/munkres.svg)](https://www.npmjs.com/package/munkres)
[![Maintenance](https://img.shields.io/maintenance/yes/2024.svg)](https://github.com/havelessbemore/munkres/graphs/commit-activity)
[![License](https://img.shields.io/github/license/havelessbemore/munkres.svg)](https://github.com/havelessbemore/munkres/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/havelessbemore/munkres/graph/badge.svg?token=F362G7C9U0)](https://codecov.io/gh/havelessbemore/munkres)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/munkres)

## Features

- Supports square and rectangular cost matrices.
- Supports `number[][]` and `bigint[][]` cost matrices.
- Supports `-Infinity` and `Infinity`.
- [Helper methods](#helpers) for creating and manipulating cost matrices.
- Fast ([benchmarks](#benchmarks)).

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

- `munkres(costMatrix)`: Executes the Munkres algorithm on the given cost matrix and returns an optimal assignment set of workers to jobs. Even if there are multiple optimal assignment sets, only one is returned.

### Types

The package exports the following TypeScript types:

- `Matrix<T>`: A generic two-dimensional matrix type (i.e. `T[][]`).
- `Tuple<A, B = A>`: A generic tuple type (i.e. `[A, B]`).

### Helpers

A set of utility functions are provided to help create and manipulate cost matrices:

- `createCostMatrix(workers, jobs, costFn)`: Generates a cost matrix based on the given workers, jobs, and cost function.
- `getMaxCost(costMatrix)`: Finds the maximum cost in a given cost matrix.
- `getMinCost(costMatrix)`: Finds the minimum cost in a given cost matrix.
- `invertCostMatrix(costMatrix, bigVal?)`: Inverts the costs in the given matrix, useful for converting between minimizing and maximizing problems. If `bigVal` is not given, the matrix's max cost is used instead.
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

## Benchmarks

To run benchmarks:

```bash
npm run bench
```

### `number[][]`

| Dimensions  | Min (ms) | Max (ms) | Avg (ms) | Samples   |
| ----------- | -------- | -------- | -------- | --------- |
| 2x2         │ 0.000000 │ 1.305582 │ 0.000126 │ 3,948,993 │
| 4x4         │ 0.000082 │ 0.988499 │ 0.000209 │ 2,387,81  │
| 8x8         │ 0.000500 │ 0.780541 │ 0.000677 │ 737,917   │
| 16x16       │ 0.002999 │ 0.698416 │ 0.003194 │ 156,498   │
| 32x32       │ 0.012875 │ 2.100125 │ 0.013341 │ 37,478    │
| 64x64       │ 0.077666 │ 0.845582 │ 0.079824 │ 6,264     │
│ 128x128     │ 0.431832 │ 1.268166 │ 0.455312 │ 1,099     │
│ 256x256     │ 2.195625 │ 3.366333 │ 2.238483 │ 224       │
│ 512x512     │ 10.46308 │ 11.87020 │ 10.56795 │ 48        │
│ 1024x1024   │ 66.17216 │ 67.39049 │ 66.40138 │ 10        │
│ 2048x2048   │ 308.2319 │ 309.0394 │ 308.5929 │ 10        │
│ 4096x4096   │ 1,536.67 │ 1,553.09 │ 1,546.20 │ 10        │
| 8192x8192   │ 8,635.81 │ 8,690.48 │ 8,657.98 │ 10        │
| 16000x16000 │ 49,029.6 │ 49,277.8 │ 49,116.5 │ 10        |

### `bigint[][]`

| Dimensions | Min (ms) | Max (ms) | Avg (ms) | Samples   |
| ---------- | -------- | -------- | -------- | --------- |
| 2x2        │ 0.000040 │ 1.235874 │ 0.000151 │ 3,302,555 │
| 4x4        │ 0.000165 │ 1.192458 │ 0.000312 │ 1,600,720 │
| 8x8        │ 0.001208 │ 0.664959 │ 0.001441 │ 346,962   │
| 16x16      │ 0.005375 │ 0.844958 │ 0.005882 │ 84,991    │
| 32x32      │ 0.029791 │ 1.339124 │ 0.033540 │ 14,908    │
| 64x64      │ 0.152042 │ 1.111583 │ 0.164781 │ 3,035     │
| 128x128    │ 0.855249 │ 1.703957 │ 0.907986 │ 551       │
| 256x256    │ 5.352541 │ 6.170875 │ 5.633485 │ 89        │
| 512x512    │ 28.20641 │ 29.68487 │ 28.83959 │ 18        │
| 1024x1024  │ 146.5958 │ 149.2197 │ 147.7818 │ 10        │
| 2048x2048  │ 876.0753 │ 890.3902 │ 883.5379 │ 10        │
| 4096x4096  │ 4,911.10 │ 4,960.68 │ 4,932.06 │ 10        │
| 8000x8000  │ 22,897.8 │ 24,210.3 │ 23,367.5 │ 10        │

### Specs

Benchmarked with:

- Package version: v1.2.1
- OS: M2 Macbook Air, Mac OS v14.4.1
- Runtime: NodeJS v20.12.1
- Benchmarking Tool: tinybench v2.6.0

---

Made with ❤️ by [Michael Rojas](https://github.com/havelessbemore)
