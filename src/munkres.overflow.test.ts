/**
 * Range-boundary regression tests.
 *
 * The algorithm's worst-case intermediate arithmetic magnitude is
 * `2 * (max - min)`, so it is safe (all intermediates finite) when the
 * input range `max(c) - min(c)` is at most `Number.MAX_VALUE / 2`.
 * The dispatcher enforces this with a `RangeError`; this file asserts:
 *
 *  - Representative at-boundary inputs succeed and produce finite duals.
 *  - Over-boundary inputs raise `RangeError`.
 *  - `finite: true` bypasses the range check (caller responsibility).
 *  - bigint matrices are unaffected.
 *
 * Uses `exec` directly (rather than `munkres`) where access to the
 * internal `Matching.dualX` / `dualY` is needed.
 */
import { describe, expect, test } from "vitest";

import { exec } from "./core/munkres";
import { munkres } from "./munkres";

const MAX = Number.MAX_VALUE;
const HALF = MAX / 2; // = MAX_VALUE / 2

function assertFinite(label: string, matrix: number[][]): void {
  const result = exec(matrix, { finite: true });
  for (let i = 0; i < result.dualX.length; ++i) {
    if (!Number.isFinite(result.dualX[i])) {
      throw new Error(
        `[${label}] dualX[${i}] = ${result.dualX[i]} (not finite)`,
      );
    }
  }
  for (let i = 0; i < result.dualY.length; ++i) {
    if (!Number.isFinite(result.dualY[i])) {
      throw new Error(
        `[${label}] dualY[${i}] = ${result.dualY[i]} (not finite)`,
      );
    }
  }
}

describe("munkres range-boundary regression", () => {
  test("symmetric signed at range = MAX_VALUE/2 stays finite (n=4)", () => {
    // [-MAX/4, MAX/4] → range = MAX/2, at the boundary.
    const m = HALF / 2; // = MAX_VALUE / 4
    assertFinite("sym-signed-n=4", [
      [-m, m, -m, m],
      [m, -m, m, -m],
      [-m, m, m, -m],
      [m, -m, -m, m],
    ]);
  });

  test("non-negative at range = MAX_VALUE/2 stays finite (n=4)", () => {
    // [0, MAX/2] → range = MAX/2, at the boundary, max well below MAX.
    assertFinite("non-neg-n=4", [
      [0, HALF, HALF / 2, HALF / 4],
      [HALF, 0, HALF / 4, HALF / 2],
      [HALF / 2, HALF / 4, 0, HALF],
      [HALF / 4, HALF / 2, HALF, 0],
    ]);
  });

  test("shifted non-negative with max > MAX/2 but range < MAX/2 stays finite", () => {
    // [1.0e308, 1.5e308] → max = 1.5e308 (> MAX/2 = 8.99e307) but
    // range = 0.5e308 < MAX/2. Confirms the rigorous bound is on the
    // RANGE, not the max. A refactor that incorrectly switches to a
    // max-based safe condition would either reject this input or
    // overflow on it.
    assertFinite("shifted-non-neg", [
      [1.0e308, 1.4e308, 1.2e308, 1.3e308],
      [1.5e308, 1.0e308, 1.4e308, 1.2e308],
      [1.2e308, 1.4e308, 1.0e308, 1.5e308],
      [1.3e308, 1.2e308, 1.5e308, 1.0e308],
    ]);
  });

  test("worst-case 2x2 pattern at the boundary stays finite", () => {
    // The SMT-confirmed maximizer: every row spans the full range.
    // At range = MAX/2, dualX[1] = MAX/2 exactly.
    const m = HALF / 2;
    assertFinite("worst-case-2x2", [
      [-m, m],
      [-m, m],
    ]);
  });

  test("bigint inputs are unaffected by the range bound", () => {
    // bigints have no float-range constraint; this just verifies the
    // documented bound is number-specific.
    const huge = BigInt(Number.MAX_SAFE_INTEGER);
    const result = exec(
      [
        [-huge, huge],
        [huge, -huge],
      ] as bigint[][],
      { finite: true },
    );
    expect(result.dualX.length).toBe(2);
    expect(result.dualY.length).toBe(2);
  });
});

describe("munkres range-bound enforcement", () => {
  test("throws RangeError when range > MAX_VALUE / 2 (symmetric signed)", () => {
    // [-MAX/2, MAX/2] → range = MAX_VALUE, which exceeds MAX/2.
    const m = MAX / 2;
    const matrix = [
      [-m, m],
      [m, -m],
    ];
    expect(() => munkres(matrix)).toThrow(RangeError);
    expect(() => munkres(matrix)).toThrow(/range \(max - min/);
    expect(() => munkres(matrix)).toThrow(/Number\.MAX_VALUE \/ 2/);
  });

  test("throws RangeError when range > MAX_VALUE / 2 (shifted non-negative)", () => {
    // [0, MAX_VALUE * 0.6]; range > MAX/2.
    const big = MAX * 0.6;
    const matrix = [
      [0, big],
      [big, 0],
    ];
    expect(() => munkres(matrix)).toThrow(RangeError);
  });

  test("does NOT throw when range is exactly at MAX_VALUE / 2 boundary", () => {
    // Strict inequality: at boundary is allowed (worst intermediate = MAX_VALUE,
    // still representable).
    const m = MAX / 4; // range = MAX/2 exactly
    expect(() =>
      munkres([
        [-m, m],
        [m, -m],
      ]),
    ).not.toThrow();
  });

  test("does NOT throw for typical inputs (well under the bound)", () => {
    expect(() =>
      munkres([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]),
    ).not.toThrow();
  });

  test("finite: true bypasses the range check (caller responsibility)", () => {
    // Over-bound input with finite: true is undefined behavior per the
    // option's contract, but the dispatcher does NOT raise RangeError.
    const m = MAX / 2;
    expect(() =>
      munkres(
        [
          [-m, m],
          [m, -m],
        ],
        { finite: true },
      ),
    ).not.toThrow(RangeError);
  });

  test("error message identifies the problematic range", () => {
    const m = MAX / 2;
    try {
      munkres([
        [-m, m],
        [m, -m],
      ]);
      throw new Error("expected RangeError");
    } catch (e) {
      expect(e).toBeInstanceOf(RangeError);
      expect((e as Error).message).toMatch(/range/i);
      expect((e as Error).message).toMatch(/MAX_VALUE/);
      expect((e as Error).message).toMatch(/scale|down/i);
    }
  });

  test("bigint matrix: range bound does not apply", () => {
    // Even very large bigints (which cannot be Infinity) bypass the check.
    const huge = BigInt(Number.MAX_SAFE_INTEGER) * 1000n;
    expect(() =>
      munkres([
        [-huge, huge],
        [huge, -huge],
      ]),
    ).not.toThrow();
  });
});
