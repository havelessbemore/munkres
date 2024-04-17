# Change Log

## [2.0.0](https://github.com/havelessbemore/munkres/compare/v1.2.4...v2.0.0) (2024-04-17)

### New

- `munkres` now accepts [MatrixLike](./src/types/matrixLike.d.ts) inputs
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

### Updates

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
