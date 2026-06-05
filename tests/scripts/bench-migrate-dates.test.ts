import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const FIXTURE = path.resolve("tests/fixtures/bench/data.js");
const SCRIPT = path.resolve("scripts/bench/migrate-dates.mjs");

function loadData(file: string): {
  data: {
    entries: Record<
      string,
      { commit: { id: string; timestamp: string }; date: number }[]
    >;
  };
} {
  const raw = readFileSync(file, "utf8");
  const json = raw.replace(/^[^=]*=\s*/, "").replace(/;\s*$/, "");
  return { data: JSON.parse(json) };
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
    const stdout = execFileSync("node", [
      SCRIPT,
      "--data-file",
      file,
    ]).toString();
    expect(stdout).toMatch(/updated:\s*2\b/);
    expect(stdout).toMatch(/unchanged:\s*1\b/);
  });
});
