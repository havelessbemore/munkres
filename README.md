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

- `munkres(costMatrix)`: Executes the Munkres algorithm on the given cost matrix and returns an optimal assignment set of workers to jobs. Even if there are multiple optimal assignment sets, only one is returned.

### Types

The package exports the following TypeScript types:

- `Matrix<T>`: A generic two-dimensional matrix type (i.e. `T[][]`).

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

## Benchmark

To run benchmarks:

```bash
npm run bench
```

### `number[][]`

| Dimensions | Ops / Sec    | Min (ms) | Max (ms) | Avg (ms) | Samples |
| ---------- | ------------ | -------- | -------- | -------- | ------- |
| 2x2        | 3,840,675.29 | 0.0002   | 0.3239   | 0.0003   | 1920338 |
| 4x4        | 1,454,653.57 | 0.0006   | 0.8385   | 0.0007   | 727327  |
| 8x8        | 709,448.42   | 0.0012   | 0.1593   | 0.0014   | 354725  |
| 16x16      | 110,342.14   | 0.0088   | 0.2250   | 0.0091   | 55172   |
| 32x32      | 8,221.93     | 0.1184   | 0.3718   | 0.1216   | 4111    |
| 64x64      | 677.32       | 1.4423   | 2.2073   | 1.4764   | 339     |
| 128x128    | 54.2371      | 18.2013  | 19.2017  | 18.4376  | 28      |
| 256x256    | 4.9320       | 200.28   | 220.40   | 202.76   | 10      |
| 512x512    | 0.4446       | 2,241.98 | 2,253.62 | 2,249.12 | 10      |

### `bigint[][]`

| Dimensions | Ops / Sec    | Min (ms) | Max (ms) | Avg (ms) | Samples |
| ---------- | ------------ | -------- | -------- | -------- | ------- |
| 2x2        | 3,841,067.14 | 0.0001   | 0.2082   | 0.0003   | 1920534 |
| 4x4        | 1,427,798.31 | 0.0006   | 0.3597   | 0.0007   | 713900  |
| 8x8        | 539,047.43   | 0.0017   | 0.1963   | 0.0019   | 269524  |
| 16x16      | 129,521.55   | 0.0072   | 0.3496   | 0.0077   | 64761   |
| 32x32      | 23,426.43    | 0.0400   | 0.4012   | 0.0427   | 11717   |
| 64x64      | 3,471.64     | 0.2637   | 2.4613   | 0.2880   | 1736    |
| 128x128    | 616.65       | 1.5488   | 3.7335   | 1.6217   | 309     |
| 256x256    | 157.87       | 5.5027   | 24.2595  | 6.3344   | 79      |
| 512x512    | 23.9277      | 37.2710  | 66.4949  | 41.7925  | 12      |
| 1024x1024  | 4.8021       | 205.57   | 215.88   | 208.24   | 10      |
| 2048x2048  | 0.9679       | 1,020.79 | 1,066.19 | 1,033.13 | 10      |

### Specs

Benchmarked with:

- Package version: v1.1.0
- OS: M2 Macbook Air, Mac OS v14.4.1
- Runtime: NodeJS v20.12.0
- Benchmarking Tool: Vitest v1.2.2

---

Made with ❤️ by [Michael Rojas](https://github.com/havelessbemore)
