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

| Dimensions | Ops / Sec    | Min (ms) | Max (ms) | Avg (ms) | Samples   |
| ---------- | ------------ | -------- | -------- | -------- | --------- |
| 2x2        | 5,507,647.45 | 0.0001   | 0.6428   | 0.0002   | 2,753,824 |
| 4x4        | 3,448,280.72 | 0.0002   | 0.2985   | 0.0003   | 1,724,141 |
| 8x8        | 949,361.46   | 0.0009   | 0.5360   | 0.0011   | 474,681   |
| 16x16      | 264,384.85   | 0.0035   | 0.6289   | 0.0038   | 132,193   |
| 32x32      | 46,748.28    | 0.0209   | 0.4965   | 0.0214   | 23,375    |
| 64x64      | 11,572.57    | 0.0840   | 1.0375   | 0.0864   | 5,787     |
| 128x128    | 2,166.70     | 0.4499   | 1.0629   | 0.4615   | 1,084     |
| 256x256    | 499.57       | 1.9756   | 2.5744   | 2.0017   | 250       |
| 512x512    | 87.3460      | 11.3525  | 12.0049  | 11.4487  | 44        |
| 1024x1024  | 14.6989      | 67.4858  | 69.2744  | 68.0323  | 10        |
| 2048x2048  | 3.5585       | 280.11   | 283.18   | 281.02   | 10        |
| 4096x4096  | 0.5941       | 1,680.09 | 1,685.36 | 1,683.08 | 10        |
| 8192x8192  | 0.1176       | 8,438.83 | 8,999.71 | 8,504.01 | 10        |

### `bigint[][]`

| Dimensions | Ops / Sec    | Min (ms) | Max (ms) | Avg (ms) | Samples   |
| ---------- | ------------ | -------- | -------- | -------- | --------- |
| 2x2        | 4,683,505.00 | 0.0001   | 0.4003   | 0.0002   | 2,341,753 |
| 4x4        | 1,470,075.02 | 0.0005   | 0.4033   | 0.0007   | 735,038   |
| 8x8        | 657,191.49   | 0.0014   | 0.3598   | 0.0015   | 328,596   |
| 16x16      | 150,823.96   | 0.0063   | 0.3742   | 0.0066   | 75,412    |
| 32x32      | 20,740.52    | 0.0457   | 0.7480   | 0.0482   | 10,371    |
| 64x64      | 3,796.62     | 0.2507   | 0.8147   | 0.2634   | 1,899     |
| 128x128    | 689.55       | 1.4093   | 1.9990   | 1.4502   | 345       |
| 256x256    | 137.62       | 7.0856   | 7.6464   | 7.2665   | 69        |
| 512x512    | 27.7445      | 35.2368  | 38.6667  | 36.0431  | 14        |
| 1024x1024  | 4.8136       | 206.57   | 209.54   | 207.74   | 10        |
| 2048x2048  | 0.8366       | 1,189.73 | 1,209.83 | 1,195.28 | 10        |

### Specs

Benchmarked with:

- Package version: v1.2.0
- OS: M2 Macbook Air, Mac OS v14.4.1
- Runtime: NodeJS v20.12.1
- Benchmarking Tool: Vitest v1.4.0

---

Made with ❤️ by [Michael Rojas](https://github.com/havelessbemore)
