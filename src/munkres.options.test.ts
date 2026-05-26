import { describe, expect, test } from "vitest";
import { munkres } from "./munkres";

describe("munkres options.finite", () => {
  const finiteMatrix = [
    [4, 1, 3],
    [2, 0, 5],
    [3, 2, 2],
  ];

  test("default (no options) matches v2.0 behavior for finite input", () => {
    const result = munkres(finiteMatrix);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
  });

  test("finite: true yields the same result as no options for finite input", () => {
    expect(munkres(finiteMatrix, { finite: true })).toEqual(
      munkres(finiteMatrix),
    );
  });

  test("default scan still catches NaN (throws)", () => {
    const m = [
      [1, 2],
      [NaN, 4],
    ];
    expect(() => munkres(m)).toThrow(TypeError);
    expect(() => munkres(m)).toThrow(/NaN/);
  });

  test("finite: true bypasses the NaN scan (does NOT throw from inspect layer)", () => {
    const m = [
      [1, 2],
      [NaN, 4],
    ];
    let threw = false;
    let errorMessage = "";
    try {
      munkres(m, { finite: true });
    } catch (e) {
      threw = true;
      errorMessage = (e as Error).message;
    }
    if (threw) {
      expect(errorMessage).not.toMatch(/cost matrix contains NaN at/);
    }
  });

  test("finite: true on Infinity input bypasses the inspect routing", () => {
    const m = [
      [1, 2],
      [Infinity, 4],
    ];
    expect(() => munkres(m, { finite: true })).not.toThrow(/NaN/);
  });

  test("default routes Infinity-bearing input correctly (no throw, valid matching)", () => {
    const m = [
      [1, Infinity],
      [Infinity, 2],
    ];
    const result = munkres(m);
    expect(result.length).toBe(2);
    // The only valid assignment: (0, 0) + (1, 1) = 1 + 2 = 3
    const m2 = m as number[][];
    const cost = result.reduce((s, [y, x]) => s + m2[y][x], 0);
    expect(cost).toBe(3);
  });

  test("undefined options behaves identically to no options", () => {
    expect(munkres(finiteMatrix, undefined)).toEqual(munkres(finiteMatrix));
  });

  test("empty options object behaves identically to no options", () => {
    expect(munkres(finiteMatrix, {})).toEqual(munkres(finiteMatrix));
  });

  test("bigint matrix accepts the option (no effect)", () => {
    const m: bigint[][] = [
      [1n, 2n],
      [3n, 4n],
    ];
    expect(munkres(m, { finite: true })).toEqual(munkres(m));
  });
});
