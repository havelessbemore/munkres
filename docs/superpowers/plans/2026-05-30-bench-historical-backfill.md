# Benchmark historical backfill + commit-timestamped data : Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional `ref` input to the benchmark workflow so historical commits and release tags can be benched against the current harness, route results to the matching dashboard, and rewrite every appended entry's date to its commit timestamp. Pair with a one-shot workflow that migrates every existing dashboard entry's date to its commit timestamp so the chart's x-axis is coherent end-to-end.

**Architecture:** All logic that mutates `gh-pages` `data.js` files lives in two small Node ESM scripts under `scripts/bench/`, invoked from GitHub Actions workflows. The benchmark workflow gains a `workflow_dispatch.inputs.ref` that resolves to a SHA + committer date, overlays old `src/` onto current HEAD via `git checkout <sha> -- src/`, runs the bench against the current harness/Node/deps, then invokes `scripts/bench/process-entry.mjs` to rewrite the just-appended entry. A new `migrate-bench-dates.yml` workflow invokes `scripts/bench/migrate-dates.mjs` once to backfill historical entries' `date` field. Concurrency group `benchmark` is shared so workflows cannot race on gh-pages.

**Tech Stack:** GitHub Actions, Node 24 ESM, vitest, `gh` CLI (for the GitHub commits API).

**Deviation from spec:** The spec described inline Node in the workflow YAML, matching the existing `Label release datapoint by tag` step. This plan instead extracts the logic to `scripts/bench/*.mjs` so it can be vitest-tested. The YAML steps shrink to `node scripts/bench/...mjs <args>` invocations. Justification: the logic now includes commit-metadata rewriting, sort, and dedupe, which is enough complexity to warrant unit tests against fixture `data.js` files.

---

## Files Touched

**New files:**
- `scripts/bench/migrate-dates.mjs` : one-shot migration: rewrite every entry's `date` to `Date.parse(commit.timestamp)`, re-sort, idempotent
- `scripts/bench/process-entry.mjs` : post-process the action's just-appended entry: backfill mode rewrites commit metadata + date + tag and dedupes; tag-only mode (replaces today's inline labeler) sets tag; both re-sort
- `tests/scripts/bench-migrate-dates.test.ts` : vitest suite for migrate-dates
- `tests/scripts/bench-process-entry.test.ts` : vitest suite for process-entry
- `tests/fixtures/bench/data.js` : minimal 3-entry `window.BENCHMARK_DATA` fixture
- `tests/fixtures/bench/commit-api-response.json` : sample `gh api repos/.../commits/<sha>` payload
- `.github/workflows/migrate-bench-dates.yml` : one-shot manual workflow

**Modified files:**
- `.github/workflows/benchmark.yml` : add `inputs.ref`, ref-resolution step, source-overlay step, dashboard-routing env var, alert conditionals, replace inline labeler with `scripts/bench/process-entry.mjs` invocation

---

## Task 1: Migrate-dates script (TDD)

**Files:**
- Create: `tests/fixtures/bench/data.js`
- Create: `tests/scripts/bench-migrate-dates.test.ts`
- Create: `scripts/bench/migrate-dates.mjs`

The migration script reads a `data.js` file (the `window.BENCHMARK_DATA = {...};` format that `github-action-benchmark` writes), rewrites every entry's `date` field to `Date.parse(entry.commit.timestamp)`, re-sorts each chart's entries ascending by `date`, and writes back in the same format. Idempotent: entries whose existing `date` is within 1 second of the parsed timestamp are left alone.

- [ ] **Step 1: Write the fixture**

Create `tests/fixtures/bench/data.js`:

```javascript
window.BENCHMARK_DATA = {
  "lastUpdate": 1713631006123,
  "repoUrl": "https://github.com/havelessbemore/munkres",
  "entries": {
    "Munkres Benchmarks": [
      {
        "commit": {
          "author": { "name": "A", "email": "a@example.com", "username": "auser" },
          "committer": { "name": "A", "email": "a@example.com", "username": "auser" },
          "distinct": true,
          "id": "1111111111111111111111111111111111111111",
          "message": "first commit",
          "timestamp": "2024-04-20T12:32:24-04:00",
          "tree_id": "aaa",
          "url": "https://github.com/havelessbemore/munkres/commit/1111111111111111111111111111111111111111"
        },
        "date": 1713631006123,
        "tool": "customSmallerIsBetter",
        "benches": [{ "name": "number[2048][2048]", "value": 100, "unit": "ms" }]
      },
      {
        "commit": {
          "author": { "name": "B", "email": "b@example.com", "username": "buser" },
          "committer": { "name": "B", "email": "b@example.com", "username": "buser" },
          "distinct": true,
          "id": "2222222222222222222222222222222222222222",
          "message": "third commit (out of order to test sort)",
          "timestamp": "2025-06-01T10:00:00+00:00",
          "tree_id": "bbb",
          "url": "https://github.com/havelessbemore/munkres/commit/2222222222222222222222222222222222222222"
        },
        "date": 9999999999999,
        "tool": "customSmallerIsBetter",
        "benches": [{ "name": "number[2048][2048]", "value": 110, "unit": "ms" }]
      },
      {
        "commit": {
          "author": { "name": "C", "email": "c@example.com", "username": "cuser" },
          "committer": { "name": "C", "email": "c@example.com", "username": "cuser" },
          "distinct": true,
          "id": "3333333333333333333333333333333333333333",
          "message": "second commit (out of order to test sort)",
          "timestamp": "2024-12-15T08:00:00+00:00",
          "tree_id": "ccc",
          "url": "https://github.com/havelessbemore/munkres/commit/3333333333333333333333333333333333333333"
        },
        "date": 1734249600000,
        "tool": "customSmallerIsBetter",
        "benches": [{ "name": "number[2048][2048]", "value": 105, "unit": "ms" }]
      }
    ]
  }
};
```

Note the deliberate disorder: the second array entry has a 2025 timestamp, the third has a 2024 timestamp. After migration + sort, order should be `1111` (April 2024), `3333` (Dec 2024), `2222` (June 2025). Entry `3333`'s existing `date` (1734249600000) matches `Date.parse("2024-12-15T08:00:00+00:00")` exactly, so it tests the idempotency skip; entries `1111` and `2222` have wrong `date` and must be rewritten.

- [ ] **Step 2: Write the failing tests**

Create `tests/scripts/bench-migrate-dates.test.ts`:

```typescript
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const FIXTURE = path.resolve("tests/fixtures/bench/data.js");
const SCRIPT = path.resolve("scripts/bench/migrate-dates.mjs");

function loadData(file: string): {
  raw: string;
  data: { entries: Record<string, Array<{ commit: { id: string; timestamp: string }; date: number }>> };
} {
  const raw = readFileSync(file, "utf8");
  const json = raw.replace(/^[^=]*=\s*/, "").replace(/;\s*$/, "");
  return { raw, data: JSON.parse(json) };
}

describe("scripts/bench/migrate-dates.mjs", () => {
  let dir: string;
  let file: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "bench-migrate-"));
    file = path.join(dir, "data.js");
    cpSync(FIXTURE, file);
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("rewrites each entry's date to its commit timestamp", () => {
    execFileSync("node", [SCRIPT, "--data-file", file]);
    const { data } = loadData(file);
    const entries = data.entries["Munkres Benchmarks"];
    for (const e of entries) {
      expect(e.date).toBe(Date.parse(e.commit.timestamp));
    }
  });

  it("sorts entries ascending by date", () => {
    execFileSync("node", [SCRIPT, "--data-file", file]);
    const { data } = loadData(file);
    const entries = data.entries["Munkres Benchmarks"];
    const ids = entries.map((e) => e.commit.id);
    expect(ids).toEqual([
      "1111111111111111111111111111111111111111",
      "3333333333333333333333333333333333333333",
      "2222222222222222222222222222222222222222",
    ]);
  });

  it("is idempotent: a second run produces no changes", () => {
    execFileSync("node", [SCRIPT, "--data-file", file]);
    const after1 = readFileSync(file, "utf8");
    execFileSync("node", [SCRIPT, "--data-file", file]);
    const after2 = readFileSync(file, "utf8");
    expect(after2).toBe(after1);
  });

  it("preserves the exact output format (window.BENCHMARK_DATA = + pretty JSON, no trailing semicolon or newline)", () => {
    execFileSync("node", [SCRIPT, "--data-file", file]);
    const out = readFileSync(file, "utf8");
    expect(out.startsWith("window.BENCHMARK_DATA = ")).toBe(true);
    expect(out.endsWith("}")).toBe(true); // no trailing ; or \n
    // pretty-printed: contains indented entries
    expect(out).toContain('\n  "entries": {');
  });

  it("prints a summary to stdout", () => {
    const stdout = execFileSync("node", [SCRIPT, "--data-file", file]).toString();
    expect(stdout).toMatch(/updated:\s*\d+/i);
    expect(stdout).toMatch(/unchanged:\s*\d+/i);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `pnpm vitest run tests/scripts/bench-migrate-dates.test.ts`
Expected: FAIL with "Cannot find module" or "ENOENT" for `scripts/bench/migrate-dates.mjs`.

- [ ] **Step 4: Implement the script**

Create `scripts/bench/migrate-dates.mjs`:

```javascript
#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    "data-file": { type: "string" },
  },
});

const file = values["data-file"];
if (!file) {
  console.error("usage: migrate-dates.mjs --data-file <path>");
  process.exit(2);
}

const raw = readFileSync(file, "utf8");
const json = raw.replace(/^[^=]*=\s*/, "").replace(/;\s*$/, "");
const data = JSON.parse(json);

let updated = 0;
let unchanged = 0;

for (const chartEntries of Object.values(data.entries)) {
  for (const entry of chartEntries) {
    const target = Date.parse(entry.commit.timestamp);
    if (Number.isNaN(target)) {
      unchanged++;
      continue;
    }
    if (Math.abs(entry.date - target) <= 1000) {
      unchanged++;
      continue;
    }
    entry.date = target;
    updated++;
  }
  chartEntries.sort((a, b) => a.date - b.date);
}

writeFileSync(file, "window.BENCHMARK_DATA = " + JSON.stringify(data, null, 2));
console.log(`updated: ${updated}`);
console.log(`unchanged: ${unchanged}`);
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm vitest run tests/scripts/bench-migrate-dates.test.ts`
Expected: 5 passing.

- [ ] **Step 6: Commit**

```bash
git add scripts/bench/migrate-dates.mjs tests/scripts/bench-migrate-dates.test.ts tests/fixtures/bench/data.js
git commit -m "feat(bench): add migrate-dates script

One-shot rewriter that backfills every dashboard entry's date field with
its commit timestamp, then re-sorts each chart ascending by date. Pure
JSON transform of the gh-pages data.js files. Idempotent: entries whose
date already matches commit.timestamp (within 1s) are skipped.

Invoked by the upcoming migrate-bench-dates workflow.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Migration workflow

**Files:**
- Create: `.github/workflows/migrate-bench-dates.yml`

A `workflow_dispatch`-only workflow that clones `gh-pages`, runs `scripts/bench/migrate-dates.mjs` against both dashboard `data.js` files, commits, and pushes. Shares `concurrency: benchmark` with `benchmark.yml` so it cannot race with a bench push.

- [ ] **Step 1: Write the workflow**

Create `.github/workflows/migrate-bench-dates.yml`:

```yaml
name: Migrate Benchmark Dates
on:
  workflow_dispatch:
permissions:
  contents: write
# Share the benchmark concurrency group so this cannot race with a bench
# push to gh-pages.
concurrency:
  group: benchmark
  cancel-in-progress: false
jobs:
  migrate:
    name: Migrate entry dates
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 24.16.0
      - name: Clone gh-pages
        env:
          GH_TOKEN: ${{ secrets.BENCHMARK_TOKEN }}
        run: |
          set -euo pipefail
          git clone --branch gh-pages --depth 1 \
            "https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" gh-pages
      - name: Migrate dev/bench
        run: node scripts/bench/migrate-dates.mjs --data-file gh-pages/dev/bench/data.js
      - name: Migrate release/bench
        run: node scripts/bench/migrate-dates.mjs --data-file gh-pages/release/bench/data.js
      - name: Commit and push
        working-directory: gh-pages
        run: |
          set -euo pipefail
          if git diff --quiet; then
            echo "No changes (already migrated)."
            exit 0
          fi
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add dev/bench/data.js release/bench/data.js
          git commit -m "chore(bench): migrate entry dates to commit timestamps"
          git push origin gh-pages
```

- [ ] **Step 2: Validate the YAML parses**

Run: `actionlint .github/workflows/migrate-bench-dates.yml`
Expected: no output (exit 0). If `actionlint` is missing, install with `brew install actionlint`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/migrate-bench-dates.yml
git commit -m "ci(bench): add one-shot date migration workflow

Manual workflow that rewrites every existing gh-pages entry's date
field to its commit timestamp. Shares the benchmark concurrency group
so it cannot race with a bench push. Idempotent via the underlying
script, so a maintainer re-running it is safe.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Process-entry script (TDD)

**Files:**
- Create: `tests/fixtures/bench/commit-api-response.json`
- Create: `tests/scripts/bench-process-entry.test.ts`
- Create: `scripts/bench/process-entry.mjs`

The script post-processes the just-appended `data.js` entry that `github-action-benchmark` wrote. Two modes:

- `--backfill`: replace the entry's `commit` object with metadata derived from a `gh api repos/.../commits/<sha>` JSON payload, set `date` to the new commit's timestamp, set `tag` if provided, and dedupe (remove any prior entry with the same `commit.id`).
- `--tag-only`: leave commit metadata alone; only set `tag` on the entry whose `commit.id` matches `--match-sha`. This replaces today's inline labeler.

Both modes re-sort the chart's entries ascending by `date`.

- [ ] **Step 1: Write the commit-API fixture**

Create `tests/fixtures/bench/commit-api-response.json`:

```json
{
  "sha": "abcdef0000000000000000000000000000000000",
  "html_url": "https://github.com/havelessbemore/munkres/commit/abcdef0000000000000000000000000000000000",
  "commit": {
    "author": { "name": "Old Author", "email": "old@example.com", "date": "2023-08-10T12:00:00Z" },
    "committer": { "name": "Old Committer", "email": "old@example.com", "date": "2023-08-10T12:00:00Z" },
    "message": "feat: an older change\n\nbody text here",
    "tree": { "sha": "tree-sha-old" }
  },
  "author": { "login": "oldauthor" },
  "committer": { "login": "oldcommitter" }
}
```

- [ ] **Step 2: Write the failing tests**

Create `tests/scripts/bench-process-entry.test.ts`:

```typescript
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const FIXTURE_DATA = path.resolve("tests/fixtures/bench/data.js");
const FIXTURE_COMMIT = path.resolve("tests/fixtures/bench/commit-api-response.json");
const SCRIPT = path.resolve("scripts/bench/process-entry.mjs");

const HEAD_SHA = "headhead0000000000000000000000000000head";

function loadData(file: string) {
  const raw = readFileSync(file, "utf8");
  const json = raw.replace(/^[^=]*=\s*/, "").replace(/;\s*$/, "");
  return JSON.parse(json) as {
    entries: Record<string, Array<{ commit: any; date: number; tag?: string; benches: any[] }>>;
  };
}

function prepFixtureWithAppended(dir: string): string {
  // Copy fixture and append a "just-appended" entry attributed to HEAD_SHA
  // (mimicking what github-action-benchmark writes for a backfill run).
  const file = path.join(dir, "data.js");
  cpSync(FIXTURE_DATA, file);
  const data = loadData(file);
  data.entries["Munkres Benchmarks"].push({
    commit: {
      author: { name: "Head", email: "head@example.com", username: "headuser" },
      committer: { name: "Head", email: "head@example.com", username: "headuser" },
      distinct: true,
      id: HEAD_SHA,
      message: "head commit message",
      timestamp: "2026-05-30T10:00:00+00:00",
      tree_id: "head-tree",
      url: `https://github.com/havelessbemore/munkres/commit/${HEAD_SHA}`,
    },
    date: Date.now(),
    tool: "customSmallerIsBetter",
    benches: [{ name: "number[2048][2048]", value: 99, unit: "ms" }],
  });
  writeFileSync(file, "window.BENCHMARK_DATA = " + JSON.stringify(data, null, 2));
  return file;
}

describe("scripts/bench/process-entry.mjs --backfill", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "bench-process-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("rewrites the matched entry's commit metadata from the API payload", () => {
    const file = prepFixtureWithAppended(dir);
    execFileSync("node", [
      SCRIPT,
      "--data-file", file,
      "--match-sha", HEAD_SHA,
      "--backfill",
      "--commit-json", FIXTURE_COMMIT,
      "--tag", "",
    ]);
    const data = loadData(file);
    const entries = data.entries["Munkres Benchmarks"];
    const rewritten = entries.find((e) => e.commit.id === "abcdef0000000000000000000000000000000000")!;
    expect(rewritten).toBeDefined();
    expect(rewritten.commit.message).toBe("feat: an older change");
    expect(rewritten.commit.timestamp).toBe("2023-08-10T12:00:00Z");
    expect(rewritten.commit.author).toEqual({ name: "Old Author", email: "old@example.com", username: "oldauthor" });
    expect(rewritten.commit.committer).toEqual({ name: "Old Committer", email: "old@example.com", username: "oldcommitter" });
    expect(rewritten.commit.url).toBe("https://github.com/havelessbemore/munkres/commit/abcdef0000000000000000000000000000000000");
    expect(rewritten.commit.tree_id).toBe("tree-sha-old");
    expect(rewritten.commit.distinct).toBe(true);
    expect(rewritten.date).toBe(Date.parse("2023-08-10T12:00:00Z"));
    // No HEAD entry remains
    expect(entries.find((e) => e.commit.id === HEAD_SHA)).toBeUndefined();
  });

  it("sets the tag when --tag is non-empty", () => {
    const file = prepFixtureWithAppended(dir);
    execFileSync("node", [
      SCRIPT,
      "--data-file", file,
      "--match-sha", HEAD_SHA,
      "--backfill",
      "--commit-json", FIXTURE_COMMIT,
      "--tag", "v1.0.0",
    ]);
    const data = loadData(file);
    const entry = data.entries["Munkres Benchmarks"].find((e) => e.commit.id === "abcdef0000000000000000000000000000000000")!;
    expect(entry.tag).toBe("v1.0.0");
  });

  it("re-sorts entries ascending by date so the backfilled point lands chronologically", () => {
    const file = prepFixtureWithAppended(dir);
    execFileSync("node", [
      SCRIPT,
      "--data-file", file,
      "--match-sha", HEAD_SHA,
      "--backfill",
      "--commit-json", FIXTURE_COMMIT,
      "--tag", "",
    ]);
    const data = loadData(file);
    const ids = data.entries["Munkres Benchmarks"].map((e) => e.commit.id);
    // Original 2024-04 fixture entry has date 1713631006123 (wrong), now still wrong
    // since we don't migrate in process-entry; sort is by current date field.
    // Backfilled entry's date is Date.parse("2023-08-10T12:00:00Z") = 1691668800000
    // which is the earliest, so it should be first.
    expect(ids[0]).toBe("abcdef0000000000000000000000000000000000");
  });

  it("dedupes: removes a pre-existing entry with the same backfill SHA", () => {
    const file = prepFixtureWithAppended(dir);
    // Insert a stale prior entry for the backfill SHA before running.
    const data = loadData(file);
    data.entries["Munkres Benchmarks"].unshift({
      commit: { id: "abcdef0000000000000000000000000000000000", timestamp: "2023-08-10T12:00:00Z" } as any,
      date: 1691668800000,
      tool: "customSmallerIsBetter",
      benches: [{ name: "number[2048][2048]", value: 200, unit: "ms" }],
    });
    writeFileSync(file, "window.BENCHMARK_DATA = " + JSON.stringify(data, null, 2));

    execFileSync("node", [
      SCRIPT,
      "--data-file", file,
      "--match-sha", HEAD_SHA,
      "--backfill",
      "--commit-json", FIXTURE_COMMIT,
      "--tag", "",
    ]);
    const after = loadData(file);
    const backfilled = after.entries["Munkres Benchmarks"].filter(
      (e) => e.commit.id === "abcdef0000000000000000000000000000000000",
    );
    expect(backfilled).toHaveLength(1);
    // The kept one is the newly-rewritten entry (value 99 from prep), not the stale 200.
    expect(backfilled[0].benches[0].value).toBe(99);
  });
});

describe("scripts/bench/process-entry.mjs --tag-only", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "bench-process-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("sets the tag on the matched entry without touching commit metadata", () => {
    const file = prepFixtureWithAppended(dir);
    const beforeCommit = loadData(file).entries["Munkres Benchmarks"].find((e) => e.commit.id === HEAD_SHA)!.commit;
    execFileSync("node", [
      SCRIPT,
      "--data-file", file,
      "--match-sha", HEAD_SHA,
      "--tag-only",
      "--tag", "v2.1.1",
    ]);
    const after = loadData(file);
    const entry = after.entries["Munkres Benchmarks"].find((e) => e.commit.id === HEAD_SHA)!;
    expect(entry.tag).toBe("v2.1.1");
    expect(entry.commit).toEqual(beforeCommit);
  });

  it("is a no-op if the matched entry already has the same tag", () => {
    const file = prepFixtureWithAppended(dir);
    // Pre-tag the entry
    const data = loadData(file);
    const e = data.entries["Munkres Benchmarks"].find((x) => x.commit.id === HEAD_SHA)!;
    e.tag = "v2.1.1";
    writeFileSync(file, "window.BENCHMARK_DATA = " + JSON.stringify(data, null, 2));
    const before = readFileSync(file, "utf8");

    execFileSync("node", [
      SCRIPT,
      "--data-file", file,
      "--match-sha", HEAD_SHA,
      "--tag-only",
      "--tag", "v2.1.1",
    ]);
    const after = readFileSync(file, "utf8");
    expect(after).toBe(before);
  });
});

describe("scripts/bench/process-entry.mjs output format", () => {
  it("preserves the action's exact serialization (window.BENCHMARK_DATA = + pretty JSON, no trailing semicolon/newline)", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "bench-process-"));
    try {
      const file = prepFixtureWithAppended(dir);
      execFileSync("node", [
        SCRIPT,
        "--data-file", file,
        "--match-sha", HEAD_SHA,
        "--backfill",
        "--commit-json", FIXTURE_COMMIT,
        "--tag", "v1.0.0",
      ]);
      const out = readFileSync(file, "utf8");
      expect(out.startsWith("window.BENCHMARK_DATA = ")).toBe(true);
      expect(out.endsWith("}")).toBe(true);
      expect(out).toContain('\n  "entries": {');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `pnpm vitest run tests/scripts/bench-process-entry.test.ts`
Expected: FAIL with `ENOENT` for `scripts/bench/process-entry.mjs`.

- [ ] **Step 4: Implement the script**

Create `scripts/bench/process-entry.mjs`:

```javascript
#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    "data-file": { type: "string" },
    "match-sha": { type: "string" },
    "backfill": { type: "boolean", default: false },
    "tag-only": { type: "boolean", default: false },
    "commit-json": { type: "string" },
    "tag": { type: "string", default: "" },
  },
});

const file = values["data-file"];
const matchSha = values["match-sha"];
if (!file || !matchSha) {
  console.error("usage: process-entry.mjs --data-file <path> --match-sha <sha> [--backfill --commit-json <path>] [--tag-only] [--tag <name>]");
  process.exit(2);
}
if (Boolean(values.backfill) === Boolean(values["tag-only"])) {
  console.error("exactly one of --backfill or --tag-only must be set");
  process.exit(2);
}

const raw = readFileSync(file, "utf8");
const json = raw.replace(/^[^=]*=\s*/, "").replace(/;\s*$/, "");
const data = JSON.parse(json);

function mapCommit(api) {
  return {
    author: {
      name: api.commit.author.name,
      email: api.commit.author.email,
      username: api.author?.login ?? "",
    },
    committer: {
      name: api.commit.committer.name,
      email: api.commit.committer.email,
      username: api.committer?.login ?? "",
    },
    distinct: true,
    id: api.sha,
    message: api.commit.message.split("\n", 1)[0],
    timestamp: api.commit.committer.date,
    tree_id: api.commit.tree.sha,
    url: api.html_url,
  };
}

let changed = 0;
for (const chartEntries of Object.values(data.entries)) {
  const idx = chartEntries.findIndex((e) => e.commit.id === matchSha);
  if (idx < 0) continue;
  const entry = chartEntries[idx];

  if (values.backfill) {
    const commitJsonPath = values["commit-json"];
    if (!commitJsonPath) {
      console.error("--backfill requires --commit-json");
      process.exit(2);
    }
    const api = JSON.parse(readFileSync(commitJsonPath, "utf8"));
    entry.commit = mapCommit(api);
    entry.date = Date.parse(entry.commit.timestamp);
    if (values.tag) entry.tag = values.tag;

    // Dedupe: drop any other entry with the new SHA.
    for (let i = chartEntries.length - 1; i >= 0; --i) {
      if (i !== idx && chartEntries[i].commit.id === entry.commit.id) {
        chartEntries.splice(i, 1);
      }
    }
    changed++;
  } else {
    // --tag-only
    if (values.tag && entry.tag !== values.tag) {
      entry.tag = values.tag;
      changed++;
    }
  }

  chartEntries.sort((a, b) => a.date - b.date);
}

// If nothing changed AND the sort produced no reordering, skip the write so
// the caller's `git diff --quiet` short-circuits the commit.
if (changed === 0) {
  console.log("no changes");
  process.exit(0);
}

writeFileSync(file, "window.BENCHMARK_DATA = " + JSON.stringify(data, null, 2));
console.log(`processed ${changed} entry/entries`);
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm vitest run tests/scripts/bench-process-entry.test.ts`
Expected: 7 passing.

- [ ] **Step 6: Commit**

```bash
git add scripts/bench/process-entry.mjs tests/scripts/bench-process-entry.test.ts tests/fixtures/bench/commit-api-response.json
git commit -m "feat(bench): add process-entry script

Replaces today's inline 'Label release datapoint by tag' Node block
with a tested script that handles both tag-only labeling and full
backfill rewrites. Backfill mode reads a commit's metadata from a
'gh api' JSON payload, rewrites the just-appended entry's commit
object + date, and dedupes any prior entry with the same SHA so a
re-bench replaces (rather than duplicates) the historical point. Both
modes re-sort the chart's entries ascending by date.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: benchmark.yml : inputs.ref + ref-resolution

**Files:**
- Modify: `.github/workflows/benchmark.yml`

Add the `ref` input to `workflow_dispatch`, switch `actions/checkout@v4` to `fetch-depth: 0` so arbitrary refs can be resolved, and insert the ref-resolution step after checkout.

- [ ] **Step 1: Add `inputs.ref` to workflow_dispatch**

Replace the `workflow_dispatch:` line (currently `.github/workflows/benchmark.yml:11`) with:

```yaml
  workflow_dispatch:
    inputs:
      ref:
        description: "Optional historical ref (tag, full SHA, or short SHA) to backfill. Empty = run HEAD."
        type: string
        required: false
        default: ""
```

- [ ] **Step 2: Expand the checkout step**

Replace:

```yaml
      - name: Checkout code
        uses: actions/checkout@v4
```

with:

```yaml
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          # Full history + tags so historical refs (tag/SHA/short SHA) can
          # be resolved by the next step on backfill runs. The cost on
          # normal pushes is a few seconds of clone time against minutes
          # of bench work, so unconditional.
          fetch-depth: 0
          fetch-tags: true
```

- [ ] **Step 3: Insert the ref-resolution step**

Immediately after the Checkout step, insert:

```yaml
      - name: Resolve historical ref
        if: inputs.ref != ''
        env:
          REF: ${{ inputs.ref }}
        run: |
          set -euo pipefail
          # Ensure the ref is fetched (covers both short-SHA and branch-pointed
          # commits that the shallow-by-default checkout may have missed).
          git fetch --force --tags origin
          git fetch origin "$REF" || true
          SHA=$(git rev-parse --verify "$REF^{commit}")
          COMMITTED_AT=$(git show -s --format=%cI "$SHA")
          TAG=$(git describe --exact-match --tags "$SHA" 2>/dev/null || true)
          if [ -n "$TAG" ]; then IS_TAG=true; else IS_TAG=false; fi
          {
            echo "BACKFILL_SHA=$SHA"
            echo "BACKFILL_COMMITTED_AT=$COMMITTED_AT"
            echo "BACKFILL_TAG=$TAG"
            echo "BACKFILL_IS_TAG=$IS_TAG"
            echo "BACKFILL_ACTIVE=true"
          } >> "$GITHUB_ENV"
          echo "Resolved ref '$REF' to $SHA (committed $COMMITTED_AT)${TAG:+ as tag $TAG}"
```

- [ ] **Step 4: Validate the YAML parses**

Run: `actionlint .github/workflows/benchmark.yml`
Expected: no output (exit 0). If `actionlint` is missing, install with `brew install actionlint`.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/benchmark.yml
git commit -m "ci(bench): add inputs.ref + resolution for historical backfill

Manual trigger now accepts an optional tag/SHA/short-SHA ref. When
provided, a new step resolves it to a 40-char SHA, ISO committer date,
and (if applicable) exact tag, then exports BACKFILL_SHA,
BACKFILL_COMMITTED_AT, BACKFILL_TAG, BACKFILL_IS_TAG, BACKFILL_ACTIVE
for downstream steps to consume. Checkout switched to full history so
arbitrary refs resolve.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: benchmark.yml : source overlay + dashboard routing

**Files:**
- Modify: `.github/workflows/benchmark.yml`

Overlay historical `src/` onto current HEAD; compute the target dashboard once; route the action's `benchmark-data-dir-path` from that env var; disable alerts on backfills.

- [ ] **Step 1: Insert the source-overlay step**

After the `Clean install` step and before `Run benchmarks`, insert:

```yaml
      - name: Overlay historical src/
        if: env.BACKFILL_ACTIVE == 'true'
        run: |
          set -euo pipefail
          # Drop HEAD's src/ from the index so files removed/moved in the old
          # ref do not linger. This matters because src/core/ was reshuffled
          # by the core-type-subdirs refactor: a plain `git checkout <sha> --
          # src/` over the current tree would leave HEAD-only paths in place.
          git rm -rf --cached src/
          git checkout "$BACKFILL_SHA" -- src/
          echo "Overlaid src/ from $BACKFILL_SHA onto HEAD."
```

- [ ] **Step 2: Insert the dashboard-routing step**

Before the `Store results` step, insert:

```yaml
      - name: Compute target dashboard
        run: |
          set -euo pipefail
          if [ "${BACKFILL_ACTIVE:-false}" = "true" ]; then
            IS_RELEASE="$BACKFILL_IS_TAG"
          elif [[ "$GITHUB_REF" == refs/tags/* ]]; then
            IS_RELEASE=true
          else
            IS_RELEASE=false
          fi
          if [ "$IS_RELEASE" = "true" ]; then
            DASH=release/bench
          else
            DASH=dev/bench
          fi
          echo "BENCH_DASHBOARD=$DASH" >> "$GITHUB_ENV"
          echo "Writing to $DASH"
```

- [ ] **Step 3: Update the Store results step**

Replace the existing `Store results` step's `with:` block. The new block:

```yaml
      - name: Store results
        # Pinned to the v1.22.1 commit SHA. Floating `@v1` would let
        # behavior change underneath us between runs; the SHA is bumped
        # explicitly when we want the new behavior.
        uses: benchmark-action/github-action-benchmark@52576c92bccf6ac60c8223ec7eb2565637cae9ba
        with:
          name: Munkres Benchmarks
          tool: "customSmallerIsBetter"
          output-file-path: benchmark_results/ci.txt
          github-token: ${{ secrets.BENCHMARK_TOKEN }}
          auto-push: true
          # Routed by the prior `Compute target dashboard` step. Tag pushes
          # and tag-resolved backfills write to release/bench; everything
          # else writes to dev/bench. The two are independent data.js files
          # under gh-pages, rendered as separate pages:
          #   /dev/bench     : per-commit, regression detection
          #   /release/bench : release-over-release trend
          benchmark-data-dir-path: ${{ env.BENCH_DASHBOARD }}
          # Cap chart history; older datapoints stay in `data.js` but the
          # rendered chart shows only the most recent 100 entries.
          max-items-in-chart: 100
          # Alert on a >150% slowdown vs the previous datapoint. Disabled on
          # backfills because a backfilled point is reference data, not a
          # gate, and an older slower commit dropped between newer points
          # would otherwise fire a false regression.
          alert-threshold: "150%"
          comment-on-alert: ${{ env.BACKFILL_ACTIVE != 'true' }}
          fail-on-alert: ${{ env.BACKFILL_ACTIVE != 'true' }}
```

- [ ] **Step 4: Validate the YAML parses**

Run: `actionlint .github/workflows/benchmark.yml`
Expected: no output (exit 0). If `actionlint` is missing, install with `brew install actionlint`.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/benchmark.yml
git commit -m "ci(bench): overlay historical src/ + route dashboard per ref

On backfill runs, drop HEAD's src/ from the index and check out the
resolved ref's src/ so the algorithm under test is historical while the
harness (benchmarks/, pnpm-lock, Node 24.16.0, tinybench) stays at
HEAD. A new 'Compute target dashboard' step picks dev/bench vs
release/bench from BACKFILL_IS_TAG (backfill) or refs/tags/* (push), so
the action's data-dir is sourced from one place. Alert comments and
fail-on-alert are gated off on backfills.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: benchmark.yml : replace inline labeler with script

**Files:**
- Modify: `.github/workflows/benchmark.yml`

Replace the existing `Label release datapoint by tag` step (currently lines 79-124) with a step that invokes `scripts/bench/process-entry.mjs`. The new step runs whenever a backfill is active OR the push is a tag.

- [ ] **Step 1: Replace the post-process step**

Delete the existing `Label release datapoint by tag` step in its entirety and insert:

```yaml
      # The benchmark action records each datapoint by the SHA that
      # triggered the workflow, with no knowledge of the resolved tag or
      # any backfilled historical ref. This step rewrites the just-
      # appended entry:
      #   - Backfill runs: replace commit metadata with the resolved ref's
      #     metadata (fetched from the GitHub commits API), set date to the
      #     commit timestamp, set tag if applicable, dedupe.
      #   - Tag pushes (no backfill): set the tag field on the entry.
      # Both cases re-sort entries ascending by date.
      - name: Post-process appended entry
        if: env.BACKFILL_ACTIVE == 'true' || startsWith(github.ref, 'refs/tags/')
        env:
          GH_TOKEN: ${{ secrets.BENCHMARK_TOKEN }}
        run: |
          set -euo pipefail
          work="$(mktemp -d)"
          git clone --branch gh-pages --depth 1 \
            "https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" "$work"
          data_file="$work/$BENCH_DASHBOARD/data.js"

          if [ "${BACKFILL_ACTIVE:-false}" = "true" ]; then
            commit_json="$(mktemp)"
            gh api "repos/${GITHUB_REPOSITORY}/commits/${BACKFILL_SHA}" > "$commit_json"
            node scripts/bench/process-entry.mjs \
              --data-file "$data_file" \
              --match-sha "$GITHUB_SHA" \
              --backfill \
              --commit-json "$commit_json" \
              --tag "${BACKFILL_TAG:-}"
            commit_msg="Backfill ${BACKFILL_SHA} (${BACKFILL_TAG:-${BACKFILL_SHA:0:7}}) into $BENCH_DASHBOARD"
          else
            node scripts/bench/process-entry.mjs \
              --data-file "$data_file" \
              --match-sha "$GITHUB_SHA" \
              --tag-only \
              --tag "$GITHUB_REF_NAME"
            commit_msg="Label release datapoint ${GITHUB_SHA} as ${GITHUB_REF_NAME}"
          fi

          cd "$work"
          if git diff --quiet; then
            echo "No change (entry already as desired, or not yet present)."
            exit 0
          fi
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add "$BENCH_DASHBOARD/data.js"
          git commit -m "$commit_msg"
          git push origin gh-pages
```

- [ ] **Step 2: Validate the YAML parses**

Run: `actionlint .github/workflows/benchmark.yml`
Expected: no output (exit 0). If `actionlint` is missing, install with `brew install actionlint`.

- [ ] **Step 3: Run the full test suite as a regression check**

Run: `pnpm test`
Expected: all tests pass (this confirms the scripts/tests from Tasks 1 and 3 are still green).

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/benchmark.yml
git commit -m "ci(bench): replace inline labeler with process-entry script

The inline 'Label release datapoint by tag' Node block is replaced by
a step that shells out to scripts/bench/process-entry.mjs in either
--tag-only mode (existing tag-push behavior) or --backfill mode (new
historical-ref behavior). The step now fires when either trigger
condition holds. Commit message reflects the operation: 'Backfill ...'
for backfills, 'Label release datapoint ...' (unchanged) for tag
pushes.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**

| Spec section | Covered by |
|---|---|
| Trigger surface (`inputs.ref`) | Task 4 |
| Ref resolution (env vars `BACKFILL_*`) | Task 4 |
| Source overlay (`git rm -rf --cached src/` + `git checkout <sha> -- src/`) | Task 5 |
| Action invocation (routing, alert disable) | Task 5 |
| Post-process: rewrite the appended entry (backfill rewrite + dedupe + sort, tag-only label + sort) | Tasks 3 + 6 |
| One-shot migration of existing entries | Tasks 1 + 2 |
| File changes: `.github/workflows/benchmark.yml` + new `migrate-bench-dates.yml` | Tasks 2, 4, 5, 6 |
| Testing (round-trip format, throwaway-branch dry-run) | Vitest suites in Tasks 1 + 3 cover format + logic. The throwaway-branch dry-run remains a maintainer step described in the spec. |
| Rollout sequence (migration first, then bench changes) | Reflected in task order: Tasks 1-2 (migration) before Tasks 4-6 (bench wiring). Task 3 (process-entry script) lands between them but is harmless without Task 6 invoking it. |

**Placeholder scan:** None of TBD/TODO/"add error handling"/etc. present.

**Type/signature consistency:**
- `migrate-dates.mjs` invocation: `node scripts/bench/migrate-dates.mjs --data-file <path>` : same flag in workflow and tests.
- `process-entry.mjs` flags: `--data-file`, `--match-sha`, `--backfill`/`--tag-only`, `--commit-json`, `--tag` : consistent across script implementation, tests, and YAML invocation.
- Env var names (`BACKFILL_SHA`, `BACKFILL_COMMITTED_AT`, `BACKFILL_TAG`, `BACKFILL_IS_TAG`, `BACKFILL_ACTIVE`, `BENCH_DASHBOARD`) match between Tasks 4, 5, 6.
- The serialization format (`window.BENCHMARK_DATA = ` + `JSON.stringify(data, null, 2)`, no trailing semicolon/newline) is asserted in both test suites and produced by both scripts.

**Note on the dedupe behavior in process-entry:** Tasks 3's dedupe drops *all* other entries with the new SHA. For dev/bench this matches "re-bench replaces prior point." For release/bench, the only way a duplicate SHA arises is a maintainer backfilling the same release twice, where replacement is the desired outcome. No spec section contradicts this; flagging for maintainer awareness.
