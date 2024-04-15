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

| Dimensions | Min (ms)    | Max (ms)    | Avg (ms)    | Samples   |
| ---------- | ----------- | ----------- | ----------- | --------- |
| 2x2        | 0           | 0.389       | 0.00015     | 3,246,770 |
| 4x4        | 0.00017     | 0.11        | 0.00044     | 1,128,909 |
| 8x8        | 0.00062     | 0.17213     | 0.00146     | 343,260   |
| 16x16      | 0.00204     | 0.17567     | 0.00549     | 91,072    |
| 32x32      | 0.00917     | 0.18367     | 0.02226     | 22,463    |
| 64x64      | 0.04763     | 0.29942     | 0.09342     | 5,353     |
| 128x128    | 0.23521     | 0.57821     | 0.40318     | 1,241     |
| 256x256    | 1.34192     | 2.42842     | 1.85265     | 270       |
| 512x512    | 6.8625      | 12.01879    | 9.15225     | 55        |
| 1024x1024  | 35.03438    | 50.46496    | 45.14792    | 12        |
| 2048x2048  | 195.369     | 269.28162   | 238.75253   | 10        |
| 4096x4096  | 1,136.79017 | 1,456.63646 | 1,256.7295  | 10        |
| 8192x8192  | 6,373.22838 | 7,600.0455  | 6,920.27934 | 10        |

### `bigint[][]`

| Dimensions | Min (ms)     | Max (ms)     | Avg (ms)     | Samples   |
| ---------- | ------------ | ------------ | ------------ | --------- |
| 2x2        | 0.00008      | 1.59204      | 0.0002       | 2,551,810 |
| 4x4        | 0.00029      | 0.17362      | 0.00059      | 841,185   |
| 8x8        | 0.00125      | 0.18075      | 0.00254      | 196,772   |
| 16x16      | 0.00446      | 0.20708      | 0.01071      | 46,669    |
| 32x32      | 0.02108      | 0.67183      | 0.04641      | 10,774    |
| 64x64      | 0.111        | 0.46192      | 0.20924      | 2,390     |
| 128x128    | 0.61675      | 1.67129      | 0.99047      | 505       |
| 256x256    | 3.45625      | 6.7085       | 4.95576      | 101       |
| 512x512    | 24.02083     | 31.46667     | 27.30115     | 19        |
| 1024x1024  | 131.35329    | 166.47275    | 143.47399    | 10        |
| 2048x2048  | 553.782      | 813.82258    | 707.90787    | 10        |
| 4096x4096  | 3,690.12067  | 4,835.837    | 4,120.09768  | 10        |
| 8192x8192  | 21,379.72487 | 27,010.15529 | 24,359.46667 | 10        |

### Specs

Benchmarked with:

- Package version: v1.2.4
- OS: M2 Macbook Air, Mac OS v14.4.1
- Runtime: NodeJS v20.12.1
- Benchmarking Tool: tinybench v2.6.0

---

Made with ❤️ by [Michael Rojas](https://github.com/havelessbemore)
