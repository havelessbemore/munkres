import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const FIXTURE_DATA = path.resolve("tests/fixtures/bench/data.js");
const FIXTURE_COMMIT = path.resolve(
  "tests/fixtures/bench/commit-api-response.json",
);
const SCRIPT = path.resolve("scripts/bench/process-entry.mjs");

const HEAD_SHA = "headhead0000000000000000000000000000head";

interface BenchCommit {
  id: string;
  message: string;
  timestamp: string;
  url: string;
  tree_id: string;
  distinct: boolean;
  author: { name: string; email: string; username: string };
  committer: { name: string; email: string; username: string };
}

interface BenchEntry {
  commit: BenchCommit;
  date: number;
  tag?: string;
  tool: string;
  benches: { name: string; value: number; unit: string }[];
}

function loadData(file: string) {
  const raw = readFileSync(file, "utf8");
  const json = raw.replace(/^[^=]*=\s*/, "").replace(/;\s*$/, "");
  return JSON.parse(json) as {
    entries: Record<string, BenchEntry[]>;
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
      committer: {
        name: "Head",
        email: "head@example.com",
        username: "headuser",
      },
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
  writeFileSync(
    file,
    "window.BENCHMARK_DATA = " + JSON.stringify(data, null, 2),
  );
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
      "--data-file",
      file,
      "--match-sha",
      HEAD_SHA,
      "--backfill",
      "--commit-json",
      FIXTURE_COMMIT,
      "--tag",
      "",
    ]);
    const data = loadData(file);
    const entries = data.entries["Munkres Benchmarks"];
    const rewritten = entries.find(
      (e) => e.commit.id === "abcdef0000000000000000000000000000000000",
    )!;
    expect(rewritten).toBeDefined();
    expect(rewritten.commit.message).toBe("feat: an older change");
    expect(rewritten.commit.timestamp).toBe("2023-08-10T12:00:00Z");
    expect(rewritten.commit.author).toEqual({
      name: "Old Author",
      email: "old@example.com",
      username: "oldauthor",
    });
    expect(rewritten.commit.committer).toEqual({
      name: "Old Committer",
      email: "old@example.com",
      username: "oldcommitter",
    });
    expect(rewritten.commit.url).toBe(
      "https://github.com/havelessbemore/munkres/commit/abcdef0000000000000000000000000000000000",
    );
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
      "--data-file",
      file,
      "--match-sha",
      HEAD_SHA,
      "--backfill",
      "--commit-json",
      FIXTURE_COMMIT,
      "--tag",
      "v1.0.0",
    ]);
    const data = loadData(file);
    const entry = data.entries["Munkres Benchmarks"].find(
      (e) => e.commit.id === "abcdef0000000000000000000000000000000000",
    )!;
    expect(entry.tag).toBe("v1.0.0");
  });

  it("re-sorts entries ascending by date so the backfilled point lands chronologically", () => {
    const file = prepFixtureWithAppended(dir);
    execFileSync("node", [
      SCRIPT,
      "--data-file",
      file,
      "--match-sha",
      HEAD_SHA,
      "--backfill",
      "--commit-json",
      FIXTURE_COMMIT,
      "--tag",
      "",
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
    // Partial commit shape: only id and timestamp are needed for the dedup fixture.
    const staleCommit: BenchCommit = {
      id: "abcdef0000000000000000000000000000000000",
      message: "",
      timestamp: "2023-08-10T12:00:00Z",
      url: "",
      tree_id: "",
      distinct: true,
      author: { name: "", email: "", username: "" },
      committer: { name: "", email: "", username: "" },
    };
    data.entries["Munkres Benchmarks"].unshift({
      commit: staleCommit,
      date: 1691668800000,
      tool: "customSmallerIsBetter",
      benches: [{ name: "number[2048][2048]", value: 200, unit: "ms" }],
    });
    writeFileSync(
      file,
      "window.BENCHMARK_DATA = " + JSON.stringify(data, null, 2),
    );

    execFileSync("node", [
      SCRIPT,
      "--data-file",
      file,
      "--match-sha",
      HEAD_SHA,
      "--backfill",
      "--commit-json",
      FIXTURE_COMMIT,
      "--tag",
      "",
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
    const beforeCommit = loadData(file).entries["Munkres Benchmarks"].find(
      (e) => e.commit.id === HEAD_SHA,
    )!.commit;
    execFileSync("node", [
      SCRIPT,
      "--data-file",
      file,
      "--match-sha",
      HEAD_SHA,
      "--tag-only",
      "--tag",
      "v2.1.1",
    ]);
    const after = loadData(file);
    const entry = after.entries["Munkres Benchmarks"].find(
      (e) => e.commit.id === HEAD_SHA,
    )!;
    expect(entry.tag).toBe("v2.1.1");
    expect(entry.commit).toEqual(beforeCommit);
  });

  it("is a no-op if the matched entry already has the same tag", () => {
    const file = prepFixtureWithAppended(dir);
    // Pre-tag the entry
    const data = loadData(file);
    const e = data.entries["Munkres Benchmarks"].find(
      (x) => x.commit.id === HEAD_SHA,
    )!;
    e.tag = "v2.1.1";
    writeFileSync(
      file,
      "window.BENCHMARK_DATA = " + JSON.stringify(data, null, 2),
    );
    const before = readFileSync(file, "utf8");

    execFileSync("node", [
      SCRIPT,
      "--data-file",
      file,
      "--match-sha",
      HEAD_SHA,
      "--tag-only",
      "--tag",
      "v2.1.1",
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
        "--data-file",
        file,
        "--match-sha",
        HEAD_SHA,
        "--backfill",
        "--commit-json",
        FIXTURE_COMMIT,
        "--tag",
        "v1.0.0",
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
