# Munkres

A lightweight and efficient implementation of the [Munkres (Hungarian) algorithm](https://en.wikipedia.org/wiki/Hungarian_algorithm) for optimal assignment.

[![Version](https://img.shields.io/npm/v/munkres.svg)](https://www.npmjs.com/package/munkres)
[![JSR](https://jsr.io/badges/@munkres/munkres)](https://jsr.io/@munkres/munkres)
[![Maintenance](https://img.shields.io/maintenance/yes/2026.svg)](https://github.com/havelessbemore/munkres/graphs/commit-activity)
[![License](https://img.shields.io/github/license/havelessbemore/munkres.svg)](https://github.com/havelessbemore/munkres/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/havelessbemore/munkres/graph/badge.svg?token=F362G7C9U0)](https://codecov.io/gh/havelessbemore/munkres)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/munkres)

## Features

1. Flexible

   - Use `number` or `bigint` matrices.
   - Use square (_NxN_) or rectangular (_MxN_) matrices.
   - Works with any [MatrixLike](src/types/matrixLike.ts) input. Use arrays, typed arrays, custom objects, etc.

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

Skipping input validation on large guaranteed-finite matrices:

```javascript
import { munkres } from "munkres";

// When you know the matrix contains no Infinity or NaN, `{ finite: true }`
// skips the O(Y*X) validation scan and dispatches straight to the
// all-finite arithmetic path. Faster for large matrices.
const assignments = munkres(largeFiniteCostMatrix, { finite: true });
```

## API

- `munkres(costMatrix, options?)`

  Executes the Munkres algorithm on the given cost matrix and returns a set of optimal assignment pairs. Even if there are multiple optimal assignment sets, only one is returned.

  **Parameters**

  - `costMatrix`: a `MatrixLike<number>` or `MatrixLike<bigint>` where `costMatrix[y][x]` is the cost of assigning worker `y` to job `x`. Use `Infinity` / `-Infinity` to mark forbidden assignments. The matrix is treated as `costMatrix.length` × `costMatrix[0].length`; cells beyond row 0's width are ignored.
  - `options` (optional):
    - `finite: boolean` — when `true`, promises that the matrix contains no `NaN` or `Infinity` **and** that its range is in-bounds (`max(c) - min(c) <= Number.MAX_VALUE / 2`). Skips both the finiteness scan and the range check, dispatching straight to the fast all-finite path. If either promise is violated, the result is undefined (may produce a wrong assignment or `Infinity` / `NaN` cells; never throws `RangeError` / `TypeError` from this path).

  **Returns**

  An array of `[y, x]` pairs. The result length is `min(rows, cols)` and pairs are always `[y, x]` (row, column) regardless of shape. When `rows > cols`, the unmatched rows are simply absent from the result; when `cols > rows`, the unmatched columns are absent.

  **Throws**

  - `TypeError`: if a `number` cost matrix contains `NaN`. The error message includes the coordinates of the first NaN encountered. Use `Infinity` for forbidden assignments instead. Skipped under `{ finite: true }`.
  - `RangeError`: if a `number` cost matrix has `max(c) - min(c) > Number.MAX_VALUE / 2`. The algorithm's worst-case intermediate arithmetic magnitude is `2 * (max - min)`; this guard keeps all intermediates representable in IEEE-754 double precision. Scale your matrix down, or use a `bigint` matrix. Skipped under `{ finite: true }`. `bigint` matrices are exempt entirely. The check applies **only to all-finite matrices** — a `number` matrix containing `Infinity` / `-Infinity` routes to the Infinity-handling path before the range check and is never range-checked (forbidden cells are saturated, not summed, so they cannot overflow the same way).

  **Numeric precision**

  The `number` path uses IEEE 754 double-precision arithmetic. For matrices of *integer* costs where exact optima are required (especially when values approach or exceed `Number.MAX_SAFE_INTEGER`), pass a `bigint` cost matrix to use the arbitrary-precision path. Floating-point inputs are inherently approximate; the `number` path may return a valid but suboptimal assignment when precision is lost in slack comparisons.

### Types

- [`Matrix<T>`](src/types/matrix.ts): A generic 2D matrix (i.e. `T[][]`).

- [`MatrixLike<T>`](src/types/matrixLike.ts): A generic read-only 2D matrix.

  - Can be made from any `ArrayLike` objects (i.e. any indexable object with a numeric `length` property). This
    allows for more flexibility, such as matrices made with typed arrays or objects.

- [`Pair<A, B = A>`](src/types/pair.ts): A generic pair (i.e. `[A, B]`).

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

2. Install dependencies (this project uses [pnpm](https://pnpm.io/))

```bash
pnpm install
```

3. Build the project

```bash
pnpm run build
```

This will output ECMAScript (`.mjs`) and CommonJS (`.js`) modules in the `dist/` directory.

## Format

To run the code linter:

```bash
pnpm run lint
```

To automatically fix linting issues, run:

```bash
pnpm run format
```

## Test

To run tests:

```bash
pnpm test
```

To run tests with a coverage report:

```bash
pnpm run test:coverage
```

A coverage report is generated at `./coverage/index.html`.

## Benchmarks

[Run benchmarks in your browser](https://jsbm.dev/QHoz2G2XHQknL).

To run locally:

```bash
pnpm run bench
```

### CI / CD

Benchmarks are integrated into our CI/CD pipeline and automatically run with each commit to the `main` branch. This helps monitor the performance impacts of development, preventing regressions and verifying changes maintain performance standards.

[View historical results](https://havelessbemore.github.io/munkres/dev/bench/).

Specs:

- Package version: latest
- Runtime: NodeJS v24
- Benchmarking Tool: tinybench v6
- OS: [ubuntu-latest](https://github.com/actions/runner-images)

#### What the dashboard measures

Each datapoint is **per-iteration wall time**, averaged across 50 iterations after a warmup pass. Per-iteration cost is dominated by the bench harness itself for large inputs:

- The benchmark generates a fresh cost matrix on every iteration (`beforeEach`), runs `munkres()` (the timed window), then clears it (`afterEach`). Tinybench measures only the `munkres()` call, but the allocator/GC state at the start of each iteration is shaped by what happened across the surrounding 50 iterations.
- For `bigint[2048][2048]`, the input matrix alone is ~96 MB of boxed BigInts. The algorithm itself completes in ~800 ms (measurable via a one-shot timed call). The dashboard reports ~3 s under the same conditions — the additional ~2 s is per-iteration allocator/GC overhead that compounds across the run.
- For `number[4096][4096]`, the matrix is ~32 MB of doubles (smaller, denser, often SMI-optimized by V8), so the harness overhead is a smaller share.

To stabilize the per-iteration signal, the bench scripts force a synchronous GC between iterations (via `globalThis.gc()`, enabled by `--expose-gc`). This pins each iteration to a comparable heap state and reduces run-to-run variance on shared CI runners. The forced GC happens inside `afterEach`, after the timing window has already closed, so it does not bias the measurement.

**Use the dashboard for relative regression detection across commits, not as a measure of algorithm speed in isolation.**

### Results

Below are the latest results from running locally.

Specs:

- Package version: v2.1.0
- Runtime: NodeJS v24.16.0
- Benchmarking Tool: tinybench v6
- Machine:
  - Model: MacBook Air
  - Chip: Apple M2
  - Memory: 8 GB
  - OS: MacOS Sonoma

#### `number[][]`

| Dimensions | Min (ms)    | Max (ms)    | Avg (ms)    | Samples   |
| ---------- | ----------- | ----------- | ----------- | --------- |
| 2x2        | 0.00021     | 0.503       | 0.00039     | 2,573,155 |
| 4x4        | 0.00042     | 31.00483    | 0.0008      | 1,251,128 |
| 8x8        | 0.00117     | 0.28258     | 0.00202     | 494,056   |
| 16x16      | 0.00346     | 0.44662     | 0.00665     | 150,479   |
| 32x32      | 0.01438     | 0.72733     | 0.0249      | 40,160    |
| 64x64      | 0.06171     | 0.47958     | 0.09565     | 10,456    |
| 128x128    | 0.27154     | 0.91971     | 0.39716     | 2,518     |
| 256x256    | 1.32696     | 2.43667     | 1.82393     | 549       |
| 512x512    | 6.31804     | 10.00113    | 8.1618      | 123       |
| 1024x1024  | 32.75533    | 41.28104    | 37.98536    | 27        |
| 2048x2048  | 171.33817   | 230.52771   | 205.5992    | 10        |
| 4096x4096  | 945.21004   | 1,150.39442 | 1,024.3369  | 10        |
| 8192x8192  | 5,286.44342 | 5,782.38804 | 5,517.78106 | 10        |

#### `bigint[][]`

| Dimensions | Min (ms)     | Max (ms)     | Avg (ms)     | Samples   |
| ---------- | ------------ | ------------ | ------------ | --------- |
| 2x2        | 0.00017      | 1.26404      | 0.00034      | 2,944,075 |
| 4x4        | 0.0005       | 23.07121     | 0.00095      | 1,048,286 |
| 8x8        | 0.00183      | 0.70287      | 0.00367      | 272,834   |
| 16x16      | 0.00662      | 0.79025      | 0.01451      | 68,924    |
| 32x32      | 0.03004      | 0.932        | 0.06064      | 16,491    |
| 64x64      | 0.15421      | 1.08596      | 0.26307      | 3,802     |
| 128x128    | 0.79779      | 2.43008      | 1.19253      | 839       |
| 256x256    | 5.12621      | 17.79483     | 7.6404       | 131       |
| 512x512    | 37.69554     | 51.83492     | 43.68971     | 23        |
| 1024x1024  | 204.64667    | 254.14863    | 222.2071     | 10        |
| 2048x2048  | 1,000.31754  | 1,344.90021  | 1,107.35987  | 10        |
| 4096x4096  | 5,124.11313  | 6,414.79167  | 5,700.34545  | 10        |
| 8192x8192  | 28,033.31425 | 34,693.91021 | 31,153.56253 | 10        |

---

Made with ❤️ by [Michael Rojas](https://github.com/havelessbemore)
