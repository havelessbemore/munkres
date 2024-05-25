# Munkres

A lightweight and efficient implementation of the [Munkres (Hungarian) algorithm](https://en.wikipedia.org/wiki/Hungarian_algorithm) for optimal assignment.

[![Version](https://img.shields.io/npm/v/munkres.svg)](https://www.npmjs.com/package/munkres)
[![JSR](https://jsr.io/badges/@munkres/munkres)](https://jsr.io/@munkres/munkres)
[![Maintenance](https://img.shields.io/maintenance/yes/2024.svg)](https://github.com/havelessbemore/munkres/graphs/commit-activity)
[![License](https://img.shields.io/github/license/havelessbemore/munkres.svg)](https://github.com/havelessbemore/munkres/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/havelessbemore/munkres/graph/badge.svg?token=F362G7C9U0)](https://codecov.io/gh/havelessbemore/munkres)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/munkres)

## Features

1. Flexible

   - Use `number` or `bigint` matrices.
   - Use square (_NxN_) or rectangular (_MxN_) matrices.
   - Works with any [MatrixLike](src/types/matrixLike.d.ts) input. Use arrays, typed arrays, custom objects, etc.

1. Fast ([benchmarks](#results))

   - _O(M<sup>2</sup>N)_ when _M <= N_

   - _O(MN<sup>2</sup>)_ when _M > N_

1. Efficient

   - _O(M + N)_ memory

1. Robust
   - Supports `-Infinity` and `Infinity` values.
   - [Helper methods](#helpers) provided for creating and modifying matrices.

## Getting Started

### Install

NPM:

```bash
npm install munkres
```

Yarn:

```bash
yarn add munkres
```

JSR:

```bash
jsr add @munkres/munkres
```

## Usage

With a cost matrix:

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

With a profit matrix:

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

- `munkres(costMatrix)`

  Executes the Munkres algorithm on the given cost matrix and returns a set of optimal assignment pairs. Even if there are multiple optimal assignment sets, only one is returned.

### Types

- [`Matrix<T>`](src/types/matrix.d.ts): A generic 2D matrix (i.e. `T[][]`).

- [`MatrixLike<T>`](src/types/matrixLike.d.ts): A generic read-only 2D matrix.

  - Can be made from any `ArrayLike` objects (i.e. any indexable object with a numeric `length` property). This
    allows for more flexibility, such as matrices made with typed arrays or objects.

- [`Pair<A, B = A>`](src/types/pair.d.ts): A generic pair (i.e. `[A, B]`).

### Helpers

1. `copyMatrix(matrix)`: Creates a copy of the given matrix.

1. `createMatrix(workers, jobs, callbackFn)`: Generates a matrix based on the given workers, jobs, and callback function.

1. `genMatrix(numRows, numCols, callbackFn)`: Generates a matrix based on the given dimensions and a callback function.

1. `getMatrixMax(matrix)`: Finds the maximum value in a given matrix.

1. `getMatrixMin(matrix)`: Finds the minimum value in a given matrix.

1. `invertMatrix(matrix, bigVal?)`: Inverts the values in the given matrix. Useful for converting between minimizing and maximizing problems. If `bigVal` is not given, the matrix's max value is used instead.

1. `negateMatrix(matrix)`: Negates all values in the given matrix. Useful for converting between minimizing and maximizing problems.

## Community and Support

Contributions are welcome!

- **Questions / Dicussions**: Please contact us via [GitHub discussions](https://github.com/havelessbemore/munkres/discussions).

- **Bug Reports**: Please use the [GitHub issue tracker](https://github.com/havelessbemore/munkres/issues) to report any bugs. Include a detailed description and any relevant code snippets or logs.

- **Feature Requests**: Please submit feature requests as issues, clearly describing the feature and its potential benefits.

- **Pull Requests**: Please ensure your code adheres to the existing style of the project and include any necessary tests and documentation.

For more information, check out the [contributor's guide](https://github.com/havelessbemore/munkres/CONTRIBUTING.md).

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

This will output ECMAScript (`.mjs`) and CommonJS (`.js`) modules in the `dist/` directory.

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

[Run benchmarks in your browser](https://jsbm.dev/QHoz2G2XHQknL).

To run locally:

```bash
npm run bench
```

### CI / CD

Benchmarks are integrated into our CI/CD pipeline and automatically run with each commit to the `main` branch. This helps monitor the performance impacts of development, preventing regressions and verifying changes maintain performance standards.

[View historical results](https://havelessbemore.github.io/munkres/dev/bench/).

Specs:

- Package version: latest
- Runtime: NodeJS v20
- Benchmarking Tool: tinybench v2.6.0
- OS: [ubuntu-latest](https://github.com/actions/runner-images)

### Results

Below are the latest results from running locally.

Specs:

- Package version: v2.0.2
- Runtime: NodeJS v20.12.2
- Benchmarking Tool: tinybench v2.6.0
- Machine:
  - Model: MacBook Air
  - Chip: Apple M2
  - Memory: 8 GB
  - OS: MacOS Sonoma

#### `number[][]`

| Dimensions | Min (ms)    | Max (ms)    | Avg (ms)    | Samples   |
| ---------- | ----------- | ----------- | ----------- | --------- |
| 2x2        | 0           | 0.92475     | 0.00014     | 3,611,437 |
| 4x4        | 0.00013     | 0.38683     | 0.00041     | 1,227,622 |
| 8x8        | 0.00062     | 0.2005      | 0.00134     | 372,763   |
| 16x16      | 0.002       | 0.26346     | 0.00487     | 102,720   |
| 32x32      | 0.009       | 0.06462     | 0.01874     | 26,678    |
| 64x64      | 0.04483     | 0.28279     | 0.07837     | 6,381     |
| 128x128    | 0.228       | 0.52058     | 0.34338     | 1,457     |
| 256x256    | 1.07725     | 2.37567     | 1.59139     | 315       |
| 512x512    | 5.86442     | 9.18546     | 7.71347     | 65        |
| 1024x1024  | 31.82083    | 45.471      | 38.12961    | 50        |
| 2048x2048  | 165.45792   | 245.93154   | 205.5154    | 50        |
| 4096x4096  | 905.25592   | 1,384.78808 | 1,129.78629 | 50        |
| 8192x8192  | 5,062.63533 | 7,561.39129 | 6,152.11964 | 50        |

#### `bigint[][]`

| Dimensions | Min (ms)     | Max (ms)     | Avg (ms)     | Samples   |
| ---------- | ------------ | ------------ | ------------ | --------- |
| 2x2        | 0.00004      | 1.45567      | 0.00018      | 2,763,520 |
| 4x4        | 0.00029      | 0.61792      | 0.00058      | 860,516   |
| 8x8        | 0.00121      | 0.63829      | 0.00246      | 203,435   |
| 16x16      | 0.0045       | 0.639        | 0.00994      | 50,320    |
| 32x32      | 0.02021      | 0.66221      | 0.04299      | 11,633    |
| 64x64      | 0.11575      | 1.00283      | 0.19514      | 2,563     |
| 128x128    | 0.53988      | 1.92654      | 0.9169       | 546       |
| 256x256    | 3.32492      | 6.38088      | 4.51322      | 112       |
| 512x512    | 15.75375     | 46.94746     | 25.27091     | 50        |
| 1024x1024  | 107.30771    | 171.37271    | 129.81464    | 50        |
| 2048x2048  | 546.04767    | 850.22892    | 689.95893    | 50        |
| 4096x4096  | 2,835.29229  | 4,583.96688  | 3,697.85205  | 50        |
| 8192x8192  | 18,069.79829 | 24,171.88267 | 21,107.47192 | 10        |

---

Made with ❤️ by [Michael Rojas](https://github.com/havelessbemore)
