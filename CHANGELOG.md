# Change Log

## [2.1.0](https://github.com/havelessbemore/munkres/compare/v2.0.5...v2.1.0) (2026-05-27)

### Added

- New `MunkresOptions { finite?: boolean }` accepted as an optional second argument to `munkres()`. Pass `{ finite: true }` to promise that the matrix contains only finite values and is in-range; the library will skip both its O(Y*X) NaN/Infinity scan and the range check (see _Fixed_ below), and dispatch directly to the faster all-finite arithmetic path. If either promise is violated, the result is undefined.
- New public type `MunkresOptions` exported from the package root for TypeScript consumers building thin wrappers (`import type { MunkresOptions } from "munkres";`).
- Documentation now states explicitly that the result has length `min(rows, cols)`, pairs are always `[y, x]` regardless of matrix shape, and the `number` path is IEEE 754 floating-point (use `bigint` for exact optima on integer costs).

### Changed

- Internal dispatcher now routes finite number matrices through a dedicated, type-monomorphic finite-number path (`src/core/numFiniteMunkres.ts`), bypassing the `|| 0` NaN-coercion overhead in `numMunkres.ts`'s hot loop. Infinity-bearing matrices continue to route to the existing `numMunkres` path with no change in behavior. The routing decision is based on a single-pass O(Y*X) scan (`src/utils/inspectNumeric.ts`).
- The NaN-input `TypeError` is now thrown from the dispatcher rather than from inside `numMunkres.exec`. Error message and coordinates are unchanged.

### Fixed

- `number` cost matrices with `max(c) - min(c) > Number.MAX_VALUE / 2` now throw `RangeError` instead of silently producing an `Infinity`-corrupted result. The library's worst-case intermediate arithmetic magnitude is `2 * (max - min)`; over-range inputs were previously overflowing internally and returning undefined output. The bound is on the input *range*, not the maximum absolute value; `scripts/overflow-smt-search.py` confirms tightness via Z3. Pass `{ finite: true }` to skip this check at the caller's risk. `bigint` matrices are unaffected.

### Performance

- The original v2.1.0 dispatch shape routed finite `number` matrices through the same `bigExec` function that bigint matrices used, so V8 saw both type domains at every hot site in `step1`/`match`/`step6`/`step5` and `getMin`/`partitionByMin`. Inline-cache pollution collapsed those sites to generic code and slowed the bigint hot path by ~1.5–2.3× across all sizes (e.g. 2048×2048 from ~1100 ms to ~2300 ms on Node 24). The shipped v2.1.0 dispatcher splits the two domains: bigint inputs go to `bigMunkres.ts` (monomorphic over bigint, restoring its v2.0.5 speed), and finite number inputs go to the new `numFiniteMunkres.ts` (monomorphic over number, retaining the v2.1.0 finite-path speedup). The cost is ~640 lines of intentional duplication across `bigMunkres.ts` ↔ `numFiniteMunkres.ts` and their `*B.ts` siblings; both pairs carry a "Keep in sync" comment as the maintenance contract.

## [2.0.5](https://github.com/havelessbemore/munkres/compare/v2.0.4...v2.0.5) (2026-05-26)

### Fixed

- `NaN` in a number cost matrix now throws `TypeError` instead of silently producing a wrong assignment. (Infinity continues to work as before.)
- Removed cross-variant `step5` import in `src/core/numMunkres.ts`. The number variant was importing from the bigint variant; no behavior change, decouples the two variants for future refactors.

### Internal

- Added property-based test suite (`src/munkres.property.test.ts`) using fast-check, with a brute-force oracle (`tests/utils/bruteForce.ts`) validating optimality on small matrices across 200+ random runs per property.
- Benchmarks now use a seeded PRNG (`mulberry32`, seed `0xc0ffee01`) for reproducible inputs — eliminates input noise in regression detection.

### Misc

- Add `fast-check@^3` as a dev dependency.

## [2.0.4](https://github.com/havelessbemore/munkres/compare/v2.0.3...v2.0.4) (2024-06-22)

### Misc

- Update the CommonJS build file's extension from `.js` to `.cjs`
  - Should mitigate issues importing the package in CommonJS environments.
- Update dev dependencies
- Refactor and add tests
- Add `examples/` directory

## [2.0.3](https://github.com/havelessbemore/munkres/compare/v2.0.2...v2.0.3) (2024-05-25)

### Updates

- Update documentation

### Misc

- Update dev dependencies
- Add support for [JSR](https://jsr.io/@munkres/munkres):
  ```
  jsr add @munkres/munkres
  ```

## [2.0.2](https://github.com/havelessbemore/munkres/compare/v2.0.1...v2.0.2) (2024-04-30)

### Updates

- Refactor internals

### Misc

- Support Node 22
- Migrate bundler
- Migrate tester
- Remove LaTeX in README which was breaking anchor links

## [2.0.1](https://github.com/havelessbemore/munkres/compare/v2.0.0...v2.0.1) (2024-04-20)

### Updates

- Cap memory complexity to $O(M + N)$

  - Tall MxN matrices (M > N) no longer need to be copied and rotated.

- Reduce memory usage by up to ~12%

## [2.0.0](https://github.com/havelessbemore/munkres/compare/v1.2.4...v2.0.0) (2024-04-17)

### New

- Add new type [MatrixLike](./src/types/matrixLike.d.ts).
- `munkres` now accepts `MatrixLike` inputs
- Helper functions `getMatrixMax` and `getMatrixMin` now accept `MatrixLike` inputs.
- Add new helper functions:
  - `copyMatrix`
  - `genMatrix`

### Updates

- Improve performance by ~10%.

### Breaking

- Rename type `Tuple` to `Pair`.

- Rename helper functions:
  - `createCostMatrix` -> `createMatrix`
  - `getMaxCost` -> `getMatrixMax`
  - `getMinCost` -> `getMatrixMin`
  - `invertCostMatrix` -> `invertMatrix`
  - `negateCostMatrix` -> `negateMatrix`

## [1.2.4](https://github.com/havelessbemore/munkres/compare/v1.2.3...v1.2.4) (2024-04-15)

### Updates

- Improve performance by ~24% when using `number[][]` cost matrices.
- Reduce memory by ~11%

### Other

- Implement continuous benchmarks ([link](https://havelessbemore.github.io/munkres/dev/bench/)).

## [1.2.3](https://github.com/havelessbemore/munkres/compare/v1.2.2...v1.2.3) (2024-04-13)

### Updates

- Minor performance improvement.

## [1.2.2](https://github.com/havelessbemore/munkres/compare/v1.2.1...v1.2.2) (2024-04-11)

### Fixes

- Fix benchmark formatting.

## [1.2.1](https://github.com/havelessbemore/munkres/compare/v1.2.0...v1.2.1) (2024-04-11)

### Updates

- Minor performance improvement.

## [1.2.0](https://github.com/havelessbemore/munkres/compare/v1.1.0...v1.2.0) (2024-04-10)

### Updates

- Improve performance by 100x when using `number[][]` cost matrices.

## [1.1.0](https://github.com/havelessbemore/munkres/compare/v1.0.2...v1.1.0) (2024-04-09)

### Fixes

- Update benchmarks; `Infinity` and zeros were unintentionally reflecting unrealistic runtimes

### Updates

- Add [CHANGELOG.md](./CHANGELOG.md)
- Add [Tuple](./src/types/tuple.d.ts) type
- Improve internal performance when [copying](src/utils/matrix.ts) a matrix
- Improve performance by 60-70x when using `bigint[][]` cost matrices.

## [1.0.2](https://github.com/havelessbemore/munkres/compare/v1.0.1...v1.0.2) (2024-03-31)

### Fixes

- Fix error messages in step4() and bigStep4() functions
  Previously said error is thrown when columns were greater than rows (N > M). It now correctly says error is thrown when rows are greater than columns (M > N)

### Updates

- Add benchmarking script:

  ```bash
  npm run bench
  ```

- Add "Benchmark" section in [README.md](./README.md).

## [1.0.1](https://github.com/havelessbemore/munkres/compare/v1.0.0...v1.0.1) (2024-03-31)

### Features

- Add default export to simplify usage
  Now you can import as:
  ```javascript
  import munkres from "munkres";
  // ...
  munkres(costMatrix);
  ```
  As well as:
  ```javascript
  import { munkres } from "munkres";
  // ...
  munkres(costMatrix);
  ```

## [1.0.0](https://github.com/havelessbemore/munkres/compare/v0.0.5...v1.0.0) (2024-03-31)

### Features

- Add support for `bigint` cost matrices (i.e. `Matrix<bigint>`, aka `bigint[][]`)

### Removals

- Remove `CostFn` type
- Remove `CostMatrix` type

## [0.0.5](https://github.com/havelessbemore/munkres/compare/v0.0.4...v0.0.5) (2024-03-28)

### Updates

- No longer create dummy rows / columns when cost matrix is not square
  Instead, an NxM matrix is used as is, or transposed if N > M. This update improves runtime and space efficiency.

## [0.0.4](https://github.com/havelessbemore/munkres/compare/v0.0.3...v0.0.4) (2024-03-27)

### Fixes

- Fix bug causing unexpected results. Bug was caused by prime zeros not being fully reset.

## [0.0.3](https://github.com/havelessbemore/munkres/compare/v0.0.2...v0.0.3) (2024-03-27)

### Features

- Add support for rectangular matrices

## [0.0.2](https://github.com/havelessbemore/munkres/compare/v0.0.1...v0.0.2) (2024-03-26)

### Features

- Add support for `-Infinity` and `Infinity` costs

### Updates

- Optimize Munkres algorithm
- Add [README.md](./README.md)

## [0.0.1] (2024-03-26)

Initial release

### Features

- Add Munkres algorithm implementation
- Add helper functions for creating and manipulating cost matrices
