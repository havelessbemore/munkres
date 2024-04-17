munkres / [Exports](modules.md)

# Munkres

A lightweight and efficient implementation of the [Munkres (Hungarian) algorithm](https://en.wikipedia.org/wiki/Hungarian_algorithm) for optimal assignment.

[![Version](https://img.shields.io/npm/v/munkres.svg)](https://www.npmjs.com/package/munkres)
[![Maintenance](https://img.shields.io/maintenance/yes/2024.svg)](https://github.com/havelessbemore/munkres/graphs/commit-activity)
[![License](https://img.shields.io/github/license/havelessbemore/munkres.svg)](https://github.com/havelessbemore/munkres/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/havelessbemore/munkres/graph/badge.svg?token=F362G7C9U0)](https://codecov.io/gh/havelessbemore/munkres)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/munkres)

## Features

1. Fast ([benchmarks](#results)).
1. Supports `number` and `bigint` matrices.
1. Supports square and rectangular matrices.
1. Supports `-Infinity` and `Infinity` values.
1. Accepts any [MatrixLike](#types) matrix (e.g. made of arrays, typed arrays, objects, etc).
1. [Helper methods](#helpers) for creating and modifying matrices.

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

// Find a set of optimal assignments pairs (y, x).
const assignments = munkres(costMatrix);

console.log(assignments);
// Output: [[0, 2], [1, 1], [2, 0]]
```

Example 2: Using a profit matrix

```javascript
import { munkres, copyMatrix, invertMatrix } from "munkres";

// Create a profit matrix. Cell [y, x] is the
// profit of assigning the y-th worker to the x-th job.
const profitMatrix = [
  [9, 8, 7],
  [8, 6, 4],
  [7, 4, 1],
];

// Covert the profit matrix into a cost matrix.
const costMatrix = copyMatrix(profitMatrix);
invertMatrix(costMatrix);

// Find a set of optimal assignments pairs (y, x).
const assignments = munkres(costMatrix);

console.log(assignments);
// Output: [[0, 2], [1, 1], [2, 0]]
```

## API

- `munkres(costMatrix)`: Executes the Munkres algorithm on the given cost matrix and returns a set of optimal assignment pairs. Even if there are multiple optimal assignment sets, only one is returned.

### Types

- `Matrix<T>`: A generic two-dimensional matrix type (i.e. `T[][]`).

- `MatrixLike<T>`: A generic read-only two-dimensional matrix type (i.e. `ArrayLike<ArrayLike<T>>`).

  - These matrices can be made from any `ArrayLike` objects (i.e. any indexable object with a numeric length property). This
    allows for more flexible matrices, such as those made with typed arrays or custom objects.

- `Pair<A, B = A>`: A generic pair type (i.e. `[A, B]`).

### Helpers

1. `copyMatrix(matrix)`: Creates a copy of the given matrix.

1. `createMatrix(workers, jobs, callbackFn)`: Generates a matrix based on the given workers, jobs, and callback function.

1. `genMatrix(numRows, numCols, callbackFn)`: Generates a matrix based on the given dimensions and a callback function.

1. `getMatrixMax(matrix)`: Finds the maximum value in a given matrix.

1. `getMatrixMin(matrix)`: Finds the minimum value in a given matrix.

1. `invertMatrix(matrix, bigVal?)`: Inverts the values in the given matrix. Useful for converting between minimizing and maximizing problems. If `bigVal` is not given, the matrix's max value is used instead.

1. `negateMatrix(matrix)`: Negates all values in the given matrix. Useful for converting between minimizing and maximizing problems.

## Community and Support

Any feedback, bug reports, feature requests, etc. are welcomed!

Feel free to [submit an issue](https://github.com/havelessbemore/munkres/issues), pull request, or reach out via [GitHub discussions](https://github.com/havelessbemore/munkres/discussions).

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

### CI / CD

[Click here](https://havelessbemore.github.io/munkres/dev/bench/) for historical results.

Benchmarks are integrated into our CI/CD pipeline and automatically run with each commit to the `main` branch. This helps monitor the performance impacts of development, preventing regressions and verifying changes maintain performance standards.

Specs:

- Package version: latest
- OS: [ubuntu-latest](https://github.com/actions/runner-images)
- Runtime: NodeJS v20.x.x
- Benchmarking Tool: tinybench v2.6.0

### Results

These are the latest benchmark results, run locally.

Specs:

- Package version: v2.0.0
- OS: M2 Macbook Air, Mac OS v14.4.1
- Runtime: NodeJS v20.12.1
- Benchmarking Tool: tinybench v2.6.0

#### `number[][]`

| Dimensions  | Min (ms)     | Max (ms)     | Avg (ms)     | Samples   |
| ----------- | ------------ | ------------ | ------------ | --------- |
| 2x2         | 0.00004      | 1.33775      | 0.00015      | 3,278,766 |
| 4x4         | 0.00017      | 0.13233      | 0.00043      | 1,164,723 |
| 8x8         | 0.00062      | 0.15721      | 0.0014       | 357,761   |
| 16x16       | 0.00212      | 0.14429      | 0.00508      | 98,427    |
| 32x32       | 0.00867      | 0.14792      | 0.02032      | 24,603    |
| 64x64       | 0.04625      | 0.25133      | 0.08442      | 5,923     |
| 128x128     | 0.21204      | 0.56425      | 0.37118      | 1,348     |
| 256x256     | 1.24296      | 2.36254      | 1.7532       | 286       |
| 512x512     | 6.75338      | 11.09775     | 8.61339      | 59        |
| 1024x1024   | 34.86392     | 49.97971     | 41.90432     | 50        |
| 2048x2048   | 171.89683    | 259.61888    | 222.12547    | 50        |
| 4096x4096   | 932.68375    | 1,461.66762  | 1,201.93912  | 50        |
| 8192x8192   | 5,280.11042  | 7,467.18662  | 6,364.06774  | 50        |
| 16384x16384 | 29,352.95512 | 39,033.75583 | 35,109.07895 | 10        |

#### `bigint[][]`

| Dimensions | Min (ms)     | Max (ms)     | Avg (ms)     | Samples   |
| ---------- | ------------ | ------------ | ------------ | --------- |
| 2x2        | 0.00004      | 3.38546      | 0.00019      | 2,607,053 |
| 4x4        | 0.00029      | 0.19804      | 0.00059      | 849,558   |
| 8x8        | 0.00117      | 0.16379      | 0.00249      | 200,470   |
| 16x16      | 0.0045       | 0.18046      | 0.01038      | 48,184    |
| 32x32      | 0.022        | 0.19354      | 0.04531      | 11,037    |
| 64x64      | 0.11708      | 0.42021      | 0.20553      | 2,433     |
| 128x128    | 0.65929      | 1.48925      | 0.95534      | 524       |
| 256x256    | 3.04058      | 6.13196      | 4.64887      | 108       |
| 512x512    | 17.61296     | 29.17404     | 24.33943     | 50        |
| 1024x1024  | 106.67346    | 162.21587    | 131.54723    | 50        |
| 2048x2048  | 546.41683    | 880.2815     | 701.56288    | 50        |
| 4096x4096  | 3,246.61062  | 4,691.93688  | 4,048.15453  | 50        |
| 8192x8192  | 18,582.48279 | 24,507.90367 | 22,092.35407 | 10        |

---

Made with ❤️ by [Michael Rojas](https://github.com/havelessbemore)
