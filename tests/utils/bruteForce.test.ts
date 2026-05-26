import { describe, expect, test } from "@jest/globals";
import { bruteForceMinCost } from "./bruteForce";

describe("bruteForceMinCost", () => {
  test("returns 0 for an empty matrix", () => {
    expect(bruteForceMinCost([])).toBe(0);
  });

  test("returns the only value for a 1x1 matrix", () => {
    expect(bruteForceMinCost([[5]])).toBe(5);
  });

  test("returns the optimal cost for a 3x3 textbook example", () => {
    // Cost matrix: optimal = 10 (assignment: row 0→col 2, row 1→col 1, row 2→col 0)
    const m = [
      [1, 2, 3],
      [2, 4, 6],
      [3, 6, 9],
    ];
    expect(bruteForceMinCost(m)).toBe(10);
  });

  test("returns the optimal cost for a 2x3 rectangular matrix", () => {
    // 2 workers, 3 jobs: pick the cheapest 2 columns
    const m = [
      [1, 100, 2],
      [100, 1, 100],
    ];
    expect(bruteForceMinCost(m)).toBe(2); // (0->0)+(1->1) = 1+1
  });

  test("handles Infinity by treating it as forbidden", () => {
    const m = [
      [1, Infinity],
      [Infinity, 2],
    ];
    expect(bruteForceMinCost(m)).toBe(3);
  });

  test("handles negative costs (prune-safety regression)", () => {
    // Optimal is (0→2, 1→1): -229 + -772 = -1001.
    // A naive `costSoFar > best` prune mistakenly skips this path.
    const m = [
      [0, 0, -229],
      [0, -772, 0],
    ];
    expect(bruteForceMinCost(m)).toBe(-1001);
  });

  test("handles all-negative matrix", () => {
    const m = [
      [-1, -2],
      [-3, -4],
    ];
    // (0→1, 1→0): -2 + -3 = -5
    expect(bruteForceMinCost(m)).toBe(-5);
  });
});
