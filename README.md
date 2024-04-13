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
| 2x2         | 0        | 0.907458 | 0.000150 | 3,323,994 |
| 4x4         | 0.000165 | 0.152207 | 0.000454 | 1,101,015 |
| 8x8         | 0.000624 | 0.212957 | 0.001614 | 309,686   |
| 16x16       | 0.002042 | 0.180959 | 0.006243 | 80,089    |
| 32x32       | 0.009250 | 0.221666 | 0.025506 | 19,603    |
| 64x64       | 0.045917 | 0.304584 | 0.110167 | 4,539     |
| 128x128     | 0.289541 | 0.737625 | 0.492651 | 1,015     |
| 256x256     | 1.510916 | 3.354582 | 2.323353 | 216       |
| 512x512     | 7.868666 | 14.95787 | 10.91907 | 46        |
| 1024x1024   | 48.32183 | 73.42408 | 58.65771 | 10        |
| 2048x2048   | 267.4709 | 366.1929 | 299.4160 | 10        |
| 4096x4096   | 1,350.91 | 1,927.61 | 1,553.53 | 10        |
| 8192x8192   | 7,489.41 | 9,359.24 | 8,424.96 | 10        |

### `bigint[][]`

| Dimensions | Min (ms) | Max (ms) | Avg (ms) | Samples   |
| ---------- | -------- | -------- | -------- | --------- |
| 2x2        | 0.000040 | 2.988375 | 0.000224 | 2,228,635 |
| 4x4        | 0.000291 | 0.626874 | 0.000660 | 756,992   |
| 8x8        | 0.001207 | 0.737041 | 0.002751 | 181,697   |
| 16x16      | 0.004458 | 0.687999 | 0.011378 | 43,943    |
| 32x32      | 0.018499 | 1.107416 | 0.049341 | 10,134    |
| 64x64      | 0.107415 | 1.123874 | 0.225071 | 2,222     |
| 128x128    | 0.620332 | 2.028749 | 1.031927 | 485       |
| 256x256    | 3.467166 | 7.942542 | 5.320550 | 95        |
| 512x512    | 22.59262 | 36.63983 | 28.54686 | 18        |
| 1024x1024  | 124.3850 | 162.6050 | 142.3497 | 10        |
| 2048x2048  | 553.9297 | 900.5810 | 698.5629 | 10        |
| 4096x4096  | 3,783.64 | 4,985.51 | 4,101.81 | 10        |

### Specs

Benchmarked with:

- Package version: v1.2.3
- OS: M2 Macbook Air, Mac OS v14.4.1
- Runtime: NodeJS v20.12.1
- Benchmarking Tool: tinybench v2.6.0

---

Made with ❤️ by [Michael Rojas](https://github.com/havelessbemore)
