import { describe, expect, test } from "vitest";

import { getMin, partitionByMin } from "./utils.ts";

describe(`${getMin.name}() [number]`, () => {
  test("returns undefined for an empty array", () => {
    expect(getMin([])).toBeUndefined();
  });

  test("handles an array with a single element", () => {
    expect(getMin([42])).toBe(42);
  });

  test("finds the minimum at the beginning of the array", () => {
    expect(getMin([1, 2, 3, 4, 5])).toBe(1);
  });

  test("finds the minimum at the end of the array", () => {
    expect(getMin([2, 3, 4, 5, 1])).toBe(1);
  });

  test("handles all elements being the same value", () => {
    expect(getMin([2, 2, 2, 2, 2])).toBe(2);
  });

  test("handles negative values", () => {
    expect(getMin([-2, -3, -1, -5])).toBe(-5);
  });

  test("returns the minimum from an unsorted array", () => {
    expect(getMin([5, 1, 4, 2, 3])).toBe(1);
  });
});

describe(`${partitionByMin.name}() [number]`, () => {
  test("does not change the array when min equals max", () => {
    const keys = [0, 1, 2, 3];
    const values = [10, 20, 30, 40];
    partitionByMin(keys, values, 2, 2);
    expect(keys).toEqual([0, 1, 2, 3]);
  });

  test("does not change the array when min is greater than max", () => {
    const keys = [0, 1, 2, 3];
    const values = [10, 20, 30, 40];
    partitionByMin(keys, values, 2, 1);
    expect(keys).toEqual([0, 1, 2, 3]);
  });

  test("handles the case where all elements are the same", () => {
    const keys = [0, 1, 2, 3];
    const values = [1, 1, 1, 1];
    const mid = partitionByMin(keys, values);
    expect(mid).toBe(4);
    expect(keys).toEqual([0, 1, 2, 3]);
  });

  test("returns initial index + 1 when values are ascending", () => {
    const keys = [0, 1, 2, 3];
    const values = [10, 20, 30, 40];
    const mid = partitionByMin(keys, values, 1);
    expect(mid).toBe(2);
    expect(keys).toEqual([0, 1, 2, 3]);
  });

  test("returns initial index + 1 when all values are greater", () => {
    const keys = [0, 1, 2, 3, 4];
    const values = [10, 20, 40, 30, 21];
    const mid = partitionByMin(keys, values, 1);
    expect(mid).toBe(2);
    expect(keys).toEqual([0, 1, 2, 3, 4]);
  });

  test("partitions correctly with a single minimum", () => {
    const keys = [0, 1, 2, 3, 4];
    const values = [5, 3, 2, 4, 1];
    const mid = partitionByMin(keys, values);
    expect(keys.slice(0, mid)).toEqual([4]);
  });

  test("partitions correctly with multiple minima", () => {
    const keys = [0, 1, 2, 3, 4, 5];
    const values = [5, 3, 1, 2, 4, 1];
    const mid = partitionByMin(keys, values);
    expect(keys.slice(0, mid)).toEqual([2, 5]);
  });

  test("partitions a subrange [min, max)", () => {
    const indices = [0, 5, 3, 2, 4, 1];
    const values = [10, 20, 80, 50, 30, 50];
    const mid = partitionByMin(indices, values, 1, 4);
    expect(indices.slice(1, mid)).toEqual([5, 3]);
  });
});
