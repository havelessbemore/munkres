# Change Log

## [1.0.3] (Pre-release)

### Updates

- Add [CHANGELOG.md](./CHANGELOG.md)
- Add [Tuple](./src/types/tuple.d.ts) type

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
