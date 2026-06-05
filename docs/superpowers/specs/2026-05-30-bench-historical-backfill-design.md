# Benchmark workflow: historical backfill + commit-timestamped data

## Background

The repo's `benchmark.yml` workflow runs on every push to `main` and every `v*`
tag, writing per-commit data to `dev/bench/data.js` and release data to
`release/bench/data.js` on the `gh-pages` branch via
[`github-action-benchmark`](https://github.com/benchmark-action/github-action-benchmark).
Each rendered chart point is sourced from one entry in those JSON files.

Two limitations motivate this change:

1. **No way to fill in historical points.** If a release was cut before the
   benchmark workflow existed, or before a new chart was added, that release is
   absent from the dashboard. There is currently no path to retroactively run
   the bench against an older commit and have it land on the chart.
2. **Entry timestamps reflect run time, not commit time.** Each entry's `date`
   field is set by `github-action-benchmark` to `Date.now()` at the moment of
   the workflow run. For normal pushes that approximation is fine (commit
   landed seconds before run), but for any historical backfill the run time
   is meaningless. The data we need is already on the entry as
   `commit.timestamp` (an ISO string written by the action from GitHub's
   commit API), so the fix is mechanical.

## Goals

- Add an optional `ref` input to the benchmark workflow's
  `workflow_dispatch` trigger that accepts a tag, full SHA, or short SHA.
- When `ref` is set, run the benchmarks with the algorithm source (`src/`)
  from that ref but the rest of the harness (Node version, pnpm-lock,
  `benchmarks/`, workflow YAML) from current `HEAD`, so the comparison
  isolates algorithm change from infra drift.
- Route backfill entries to the same dashboard the ref would have landed on
  via the normal trigger: `release/bench` if the ref resolves to a tag,
  `dev/bench` otherwise.
- After the action appends a backfill entry, rewrite its commit metadata,
  `date`, and `tag` to reflect the resolved ref, then re-sort the chart's
  `entries` array ascending by `date` so the chart renders chronologically.
- Migrate every existing entry's `date` to `Date.parse(commit.timestamp)` in
  a one-time operation so the chart's date axis is coherent end-to-end.
- All gh-pages mutations run via GitHub Actions, not local scripts.

## Non-goals

- Faithful historical replay (old Node version, old tinybench, old
  dependencies). The user is comparing algorithm changes, not infra
  changes; pinning Node 24.16.0 explicitly to prevent V8 drift would be
  defeated by an "as it ran historically" replay.
- Auto-detecting which dashboard to write to from anything other than
  "does the ref resolve to a tag." If a maintainer wants to backfill a
  specific dashboard regardless of ref kind, they pick a closer ref.
- Backfilling refs that predate the current bench harness. If old `src/`
  has imports the current harness can't satisfy, the job surfaces the
  import error and the maintainer picks a closer ref.
- Auto-running the existing-data migration from CI. It is a one-shot
  operation; a guard for "have we migrated yet?" is more code than it
  saves.

## Design

### Trigger surface

`workflow_dispatch` gains one optional input:

| Input | Type | Description |
|---|---|---|
| `ref` | string | Optional. A tag (`v2.1.0`), full SHA, short SHA, or anything `git rev-parse` accepts. Empty = run `HEAD` (current behavior). |

The existing automatic triggers (`push` to `main`, `push` to tags `v*`)
are unchanged. Backfill is manual-only.

### Ref resolution

A single early step runs only when `inputs.ref` is non-empty. It writes
all resolved values to `$GITHUB_ENV` for later steps:

```bash
git fetch --tags --depth=1 origin "<ref>" || true
SHA=$(git rev-parse --verify "<ref>^{commit}")
COMMITTED_AT=$(git show -s --format=%cI "$SHA")
TAG=$(git describe --exact-match --tags "$SHA" 2>/dev/null || true)
```

Outputs exposed via `$GITHUB_ENV`:

- `BACKFILL_SHA` (40-char SHA)
- `BACKFILL_COMMITTED_AT` (ISO 8601 with offset)
- `BACKFILL_TAG` (tag name if ref resolves to one, else empty)
- `BACKFILL_IS_TAG` (`"true"` / `"false"`, for `if:` conditions)
- `BACKFILL_ACTIVE` (`"true"` whenever `inputs.ref` is non-empty)

Rationale for committer date (`%cI`) over author date (`%aI`): a rebased
or cherry-picked commit keeps its original author date but gets a new
committer date when it lands on the line of history we care about. The
chart axis should reflect when work entered `main`, not when it was
originally written.

If `git rev-parse` fails, the job fails fast in this step before any
bench work runs.

### Source overlay

After `actions/checkout@v4` (HEAD), pnpm setup, and `pnpm install`, an
additional step runs when `BACKFILL_ACTIVE == 'true'`:

```bash
git fetch --depth=1 origin "$BACKFILL_SHA"
git rm -rf --cached src/
git checkout "$BACKFILL_SHA" -- src/
```

The `git rm -rf --cached src/` before the checkout ensures the working
tree exactly matches old `src/` with no leftover files from HEAD's
`src/` tree (necessary because `src/core/` was reshuffled by the
`refactor/core-type-subdirs` work).

Everything else (Node version, `benchmarks/`, `pnpm-lock.yaml`,
`tinybench`, the workflow itself) stays at HEAD.

### Action invocation

The `Store results` step (uses `github-action-benchmark`) is unchanged
on normal pushes. When `BACKFILL_ACTIVE == 'true'`:

- `benchmark-data-dir-path`: `release/bench` if `BACKFILL_IS_TAG == 'true'`, else `dev/bench`.
- `comment-on-alert`: `false`
- `fail-on-alert`: `false`

`alert-threshold: 150%` stays in place. With both comment and fail
disabled it becomes inert, and leaving it removes one conditional from
the YAML.

`auto-push: true`, `name`, `tool`, and `max-items-in-chart: 100` are
unchanged.

Known race window: between the action's push and the post-process push
(below), gh-pages briefly contains an entry attributed to HEAD's SHA and
message rather than the backfilled commit. The `concurrency: benchmark`
group serializes runs, so this window is ~10 seconds and only visible
to a dashboard viewer who refreshes during it. Accepted.

### Post-process: rewrite the appended entry

A single step replaces the current `Label release datapoint by tag`
step, absorbing its responsibility. It runs whenever
`BACKFILL_ACTIVE == 'true'` OR the trigger is a tag push (i.e. whenever
the appended entry needs correction).

The step clones `gh-pages` shallow and runs an inline Node script that:

1. Picks the right `data.js` (matching what the action wrote: `dev/bench` or `release/bench`).
2. Locates the just-appended entry by `commit.id == github.sha` (the action wrote HEAD's SHA, even on backfills; see Action invocation).
3. Rewrites the entry's fields **when `BACKFILL_ACTIVE == 'true'`**:
   - Fetches commit metadata once via `gh api repos/${GITHUB_REPOSITORY}/commits/$BACKFILL_SHA`, then maps fields:
     - `commit.id` ← resolved SHA
     - `commit.message` ← `.commit.message` from the API response (first line, to match `github-action-benchmark`'s format)
     - `commit.timestamp` ← `.commit.committer.date` (equivalent to `BACKFILL_COMMITTED_AT`)
     - `commit.author` ← `{ name, email, username }` from `.commit.author` + `.author.login`
     - `commit.committer` ← same mapping from `.commit.committer` + `.committer.login`
     - `commit.url` ← `.html_url`
     - `commit.tree_id` ← `.commit.tree.sha`
     - `commit.distinct` ← `true`
   - `date` ← `Date.parse(BACKFILL_COMMITTED_AT)`
   - `tag` ← `BACKFILL_TAG` if non-empty
4. **On a tag push without backfill (normal release):** only sets `tag` (existing behavior preserved).
5. Re-sorts `entries[chartName]` ascending by `date`. For an
   already-sorted array (normal pushes) this is a no-op.
6. Re-emits as `window.BENCHMARK_DATA = ` + pretty JSON, no trailing
   semicolon (matches the action's exact format).
7. Commits and pushes.

Commit message:
- Backfill: `Backfill <SHA> (<TAG-or-shortsha>) into <dev|release>/bench`
- Normal tag push: `Label release datapoint <SHA> as <TAG>` (unchanged)

### One-shot migration of existing entries

Separate workflow file: `.github/workflows/migrate-bench-dates.yml`.

- Trigger: `workflow_dispatch` only, no inputs.
- Concurrency: shares `group: benchmark` so it cannot race with a bench push.
- Steps:
  1. Clone `gh-pages` shallow.
  2. Inline Node script: for each chart in each of `dev/bench/data.js`
     and `release/bench/data.js`, set
     `entry.date = Date.parse(entry.commit.timestamp)`. Skip entries
     where the existing `date` is already within 1 second of the parsed
     timestamp (idempotent on re-run).
  3. Re-sort each chart's `entries` array ascending by `date`.
  4. Re-emit in the action's exact format.
  5. Print per-file summary: N updated, M unchanged.
  6. Commit as `chore(bench): migrate entry dates to commit timestamps`
     and push.

Maintainer flow: trigger from the Actions tab, inspect the resulting
gh-pages commit. Optionally delete the workflow file in a follow-up
commit (it's a one-shot; leaving it around invites accidental re-runs
even though it's idempotent). The Node logic is small enough to live
inline in the YAML rather than a separate `scripts/` file, keeping the
migration self-contained in one reviewable file.

## File changes

| File | Change |
|---|---|
| `.github/workflows/benchmark.yml` | Add `inputs.ref`; add ref-resolution and source-overlay steps; expand `Store results` conditionals; expand the post-process step to handle backfills. |
| `.github/workflows/migrate-bench-dates.yml` | New file. One-shot manual workflow. |

No changes to `src/`, `benchmarks/`, or `package.json`.

## Testing

### Pre-merge sanity

- Confirm `workflow_dispatch` inputs render in the GitHub UI.
- Round-trip the inline Node post-process snippet against a real
  `data.js`: parse → trivial mutation → re-emit → byte-compare against a
  same-trivial-mutation manual edit. Catches accidental formatting
  drift.

### Dry-run on a throwaway gh-pages branch

1. Create a `bench-test` orphan branch in `gh-pages` with a copy of the
   current `dev/bench/data.js` and `release/bench/data.js`.
2. Temporarily point the post-process step at that branch.
3. Trigger with `ref: efce33a` (a known-recent commit). Verify:
   appended entry's `date` is the commit's timestamp, `commit.id` is the
   resolved SHA, entry is positioned chronologically, no alert fires.
4. Trigger with `ref: v2.1.1`. Verify: entry lands in
   `release/bench` (or test-branch equivalent), `tag` field is set.
5. Trigger with `ref: not-a-real-thing`. Verify: job fails fast in the
   ref-resolution step.
6. Delete the throwaway branch.

### Migration verification

1. Run the migration workflow against the throwaway branch first.
2. Diff `data.js` before/after: spot-check 3-5 entries to confirm
   `date == Date.parse(commit.timestamp)`. Confirm `entries` arrays
   are sorted ascending.
3. Re-run; confirm idempotency (zero diff).
4. Run against real `gh-pages` only after the throwaway run looks
   clean.

### Post-deploy smoke

Visit `/dev/bench` and `/release/bench`. Existing charts should render
nearly unchanged (since `commit.timestamp` is within seconds of
historical run time for normal pushes). Any backfilled point should
appear at its chronological position on the x-axis.

## Rollout

1. Land the one-shot migration workflow file (no behavior change yet).
2. Run the migration via Actions; review the gh-pages commit.
3. Land the benchmark workflow changes (`inputs.ref`, source overlay,
   expanded post-process).
4. Dry-run the backfill flow against a throwaway gh-pages branch
   following the testing plan.
5. Run a real backfill against a known historical release tag and
   confirm the dashboard.

## Open questions

None at design time.
