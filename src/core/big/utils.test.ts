import { describe, expect, test } from "vitest";

import { getMin, partitionByMin } from "./utils.ts";

describe(`${getMin.name}() [bigint]`, () => {
  test("returns undefined for an empty array", () => {
    expect(getMin([])).toBeUndefined();
  });

  test("handles an array with a single element", () => {
    expect(getMin([42n])).toBe(42n);
  });

  test("finds the minimum value", () => {
    expect(getMin([2n, 3n, 1n, 4n])).toBe(1n);
  });

  test("handles negative values", () => {
    expect(getMin([-2n, -3n, -1n, -5n])).toBe(-5n);
  });
});

describe(`${partitionByMin.name}() [bigint]`, () => {
  test("handles all elements being the same value", () => {
    const keys = [0, 1, 2, 3];
    const values = [1n, 1n, 1n, 1n];
    const mid = partitionByMin(keys, values);
    expect(mid).toBe(4);
    expect(keys).toEqual([0, 1, 2, 3]);
  });

  test("partitions correctly with a single minimum", () => {
    const keys = [0, 1, 2, 3, 4];
    const values = [5n, 3n, 2n, 4n, 1n];
    const mid = partitionByMin(keys, values);
    expect(keys.slice(0, mid)).toEqual([4]);
  });

  test("partitions correctly with multiple minima", () => {
    const keys = [0, 1, 2, 3, 4, 5];
    const values = [5n, 3n, 1n, 2n, 4n, 1n];
    const mid = partitionByMin(keys, values);
    expect(keys.slice(0, mid)).toEqual([2, 5]);
  });

  test("partitions a subrange [min, max)", () => {
    const indices = [0, 5, 3, 2, 4, 1];
    const values = [10n, 20n, 80n, 50n, 30n, 50n];
    const mid = partitionByMin(indices, values, 1, 4);
    expect(indices.slice(1, mid)).toEqual([5, 3]);
  });
});
