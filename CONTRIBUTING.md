# Contributing

Thank you for contributing! We are grateful for any community participation.

## Code of Conduct

This project is governed by the [Code of Conduct](./CODE_OF_CONDUCT.md). By contributing, you agree to uphold this code.

## How Can I Contribute?

- Search through [issues](https://github.com/havelessbemore/munkres/issues) for bugs you can help fix.
- Look at [discussions/ideas](https://github.com/havelessbemore/munkres/discussions/categories/ideas) for an idea you'd like to explore.

## Developing

This project uses [pnpm](https://pnpm.io/). Clone and install:

```bash
git clone git@github.com:havelessbemore/munkres.git
cd munkres
pnpm install
```

Common tasks:

- `pnpm run test`: Run tests
- `pnpm run test:coverage`: Create a coverage report (output in `./coverage/index.html`)
- `pnpm run lint`: Check styleguide adherence
- `pnpm run format`: Automatically adjust your code to the styleguide
- `pnpm run build`: Build the source, emitting ESM (`.mjs`) and CommonJS (`.cjs`) modules to `dist/`

### Benchmarks

```bash
pnpm run bench      # full local suite (all matrix sizes)
pnpm run bench:ci   # the subset run in CI, written to benchmark_results/
```

Benchmarks run automatically on every commit to `main` (per-commit dashboard) and on every release tag (release-over-release dashboard). Both are published under [havelessbemore.github.io/munkres](https://havelessbemore.github.io/munkres/dev/bench/). The harness forces a GC between iterations (`--expose-gc`) and uses a seeded PRNG so results are comparable run-to-run; treat the dashboards as relative regression signals rather than absolute algorithm speed.

### Reporting Issues

#### Before Submitting

- Perform a [quick search](https://github.com/havelessbemore/munkres/issues) to see if the issue has already been reported. If it has and it's still open, add a comment instead of opening a new issue.

#### Writing a Submission

- Use a clear and descriptive title to identify the problem.
- Describe why this is an issue, such as its impact and scope.
- Provide exact steps to reproduce in as much detail as possible.
- Give expected vs actual results of following these steps.

### Suggesting Ideas

#### Before Suggesting

- Check the documentation to see if the feature is already included.
- Perform a [quick search](https://github.com/havelessbemore/munkres/discussions/categories/ideas) to see if the idea is already suggested.

### Pull Requests

#### Tests

- **Co-locate every test with the module it tests.** Name it `<module>.test.ts` (e.g. `utils/matrix.test.ts` beside `utils/matrix.ts`). When a module's tests grow large, split them by concern as `<module>.<concern>.test.ts` (e.g. `munkres.nan.test.ts`, `munkres.overflow.test.ts` beside `munkres.ts`). Shared test infrastructure (harness, fixtures, type-level tests) lives under `tests/`, and its own tests co-locate there too (e.g. `tests/utils/bruteForce.test.ts` beside `tests/utils/bruteForce.ts`).
- Include sufficient tests
- Add new tests when adding new features.
- Update existing tests to reflect code changes.
- When fixing a bug, add tests that highlight how the behavior was broken.
- Make sure all tests pass before submitting the pull request
- Please do not include changes to `dist/` in your pull request. This should only be updated when releasing a new version.

## Styleguides

### Git Commit Messages

Please follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

### Typescript Styleguide

Styling is enforced by [ESLint](https://eslint.org/), [Prettier](https://prettier.io/docs/en/integrating-with-linters.html) and [typescript-eslint](https://typescript-eslint.io/).

- Run `pnpm run lint` to test styleguide adherence.
- Run `pnpm run format` to automatically adjust your code to the styleguide.

---

Thanks again for contributing!
