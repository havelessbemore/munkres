# Munkres

Optimally pair up two sets (workers to jobs, drivers to riders, bids to items) to minimize total cost.

Given a cost matrix where `matrix[y][x]` is the cost of pairing item `y` with item `x`, `munkres` returns the one-to-one assignment with the lowest possible total cost. It's a fast, dependency-free implementation of the [Munkres (Hungarian) algorithm](https://en.wikipedia.org/wiki/Hungarian_algorithm).

Reach for it whenever you have a table of pairing costs (or profits) and need the *optimal* matching rather than a greedy guess.

[![Version](https://img.shields.io/npm/v/munkres.svg)](https://www.npmjs.com/package/munkres)
[![JSR](https://jsr.io/badges/@munkres/munkres)](https://jsr.io/@munkres/munkres)
[![License](https://img.shields.io/github/license/havelessbemore/munkres.svg)](https://github.com/havelessbemore/munkres/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/havelessbemore/munkres/graph/badge.svg?token=F362G7C9U0)](https://codecov.io/gh/havelessbemore/munkres)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/munkres)

## Features

- **Flexible:** `number` or `bigint` costs; square (_NxN_) or rectangular (_MxN_) matrices; any [`MatrixLike`](src/types/matrixLike.ts) input (arrays, typed arrays, custom indexables).
- **Fast:** _O(M²N)_ time when _M ≤ N_ (_O(MN²)_ otherwise) and only _O(M + N)_ extra memory. [Benchmarks below](#benchmarks).
- **Typed & dependency-free:** first-class TypeScript types, zero runtime dependencies, ships both ESM and CommonJS.
- **Robust:** force an assignment with `-Infinity` or avoid one with `Infinity`; built-in [helpers](#helpers) for building and transforming matrices.

## Install

```bash
npm install munkres

yarn add munkres

pnpm add munkres

jsr add @munkres/munkres
```

## Usage

```javascript
import { munkres } from "munkres";

// matrix[y][x] = cost of assigning worker y to job x
const costMatrix = [
  [1, 2, 3],
  [2, 4, 6],
  [3, 6, 9],
];

const assignments = munkres(costMatrix);
// → [[0, 2], [1, 1], [2, 0]]   (worker 0 → job 2, worker 1 → job 1, worker 2 → job 0)
```

Each result is a `[y, x]` pair (row, then column). The result has `min(rows, cols)` pairs; if there are more workers than jobs (or vice versa), the unmatched ones are simply absent.

**Maximizing instead of minimizing?** Convert your profit matrix to a cost matrix first:

```javascript
import { munkres, copyMatrix, invertMatrix } from "munkres";

const profitMatrix = [
  [9, 8, 7],
  [8, 6, 4],
  [7, 4, 1],
];

const costMatrix = copyMatrix(profitMatrix);
invertMatrix(costMatrix); // flip profits into costs
const assignments = munkres(costMatrix);
// → [[0, 2], [1, 1], [2, 0]]
```

## API

### `munkres(costMatrix, options?)`

Runs the algorithm and returns a set of optimal `[y, x]` assignment pairs. If several optimal assignments exist, one is returned.

- **`costMatrix`**: a `MatrixLike<number>` or `MatrixLike<bigint>` where `costMatrix[y][x]` is the cost of assigning worker `y` to job `x`. Costs are minimized, so use `-Infinity` to force an assignment (chosen whenever possible) and `Infinity` to avoid one (used only as a last resort, when no finite alternative exists).
- **`options.finite`** _(boolean, default `false`)_: promise the matrix is all-finite and in-range, skipping input validation for a small speedup on large matrices. If the promise is broken, the result is undefined (it won't throw). See [`MunkresOptions`](src/munkres.options.ts).

**Returns** `Pair<number>[]`, an array of `[y, x]` pairs, length `min(rows, cols)`.

**Throws**

- `TypeError`: a `number` matrix contains `NaN`. (Use `Infinity` to avoid an assignment instead.)
- `RangeError`: a `number` matrix's value range (`max - min`) exceeds `Number.MAX_VALUE / 2` and could overflow. Scale the matrix down, or use `bigint`.

> **Precision:** the `number` path uses 64-bit floats. For integer costs that need an exact optimum (especially near or beyond `Number.MAX_SAFE_INTEGER`), use a `bigint` matrix for arbitrary precision.

### Types

- [`Matrix<T>`](src/types/matrix.ts): a 2D matrix, `T[][]`.
- [`MatrixLike<T>`](src/types/matrixLike.ts): a read-only 2D matrix accepting any `ArrayLike` (arrays, typed arrays, custom indexables).
- [`Pair<A, B = A>`](src/types/pair.ts): a `[A, B]` tuple.
- [`MunkresOptions`](src/munkres.options.ts): the options object for `munkres()`.

### Helpers

Utilities for building and transforming cost matrices:

| Helper | Description |
| --- | --- |
| `copyMatrix(matrix)` | Copy a matrix. |
| `createMatrix(workers, jobs, callbackFn)` | Build a matrix from worker/job lists and a cost function. |
| `genMatrix(numRows, numCols, callbackFn)` | Build a matrix from dimensions and a callback. |
| `getMatrixMax(matrix)` / `getMatrixMin(matrix)` | Find the max / min value. |
| `invertMatrix(matrix, bigVal?)` | Invert values (max → min); converts between minimizing and maximizing. Uses the matrix max if `bigVal` is omitted. |
| `negateMatrix(matrix)` | Negate all values; another way to swap minimizing and maximizing. |

## Benchmarks

Performance is tracked automatically on every release and every commit to `main`:

- **[Release-over-release trend →](https://havelessbemore.github.io/munkres/release/bench/)**: how performance changes across published versions.
- **[Per-commit history →](https://havelessbemore.github.io/munkres/dev/bench/)**: fine-grained regression tracking.
- **[Run it in your browser →](https://jsbm.dev/QHoz2G2XHQknL)**: try it on your own inputs.
- **[Run locally →](CONTRIBUTING.md#benchmarks)**: See the contributing guide.

As a ballpark (Apple M2, v2.1.0):
| Matrix Size | `number` | `bigint` |
| --- | --- | --- |
| 64x64 | ~0.07ms | ~0.17ms |
| 256x256 | ~1.2ms | ~3.7ms |
| 1024x1024 | ~26ms | ~110ms |
| 4096x4096 | ~0.73s | ~3.8s |

## Contributing

Contributions are welcome. See the [contributing guide](CONTRIBUTING.md) for local setup, tests, and the style guide.

- **Questions / discussion:** [GitHub Discussions](https://github.com/havelessbemore/munkres/discussions)
- **Bugs:** [Issue tracker](https://github.com/havelessbemore/munkres/issues)
- **Feature requests:** open an issue describing the feature and its benefit.

## License

[MIT](LICENSE) © [Michael Rojas](https://github.com/havelessbemore)
