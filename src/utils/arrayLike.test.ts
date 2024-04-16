import { describe, it, expect } from "vitest";

import { entries, getMin } from "./arrayLike";

describe(`${entries.name}()`, () => {
  it("should return an empty array for an empty input array", () => {
    expect(entries([])).toEqual([]);
  });

  it("should handle a single element array", () => {
    expect(entries(["foo"])).toEqual([[0, "foo"]]);
  });

  it("should correctly transform an array of strings to index-value pairs", () => {
    const input = ["a", "b", "c"];
    const expectedResult = [
      [0, "a"],
      [1, "b"],
      [2, "c"],
    ];
    expect(entries(input)).toEqual(expectedResult);
  });

  it("should correctly transform an array of numbers to index-value pairs", () => {
    const input = [10, 20, 30];
    const expectedResult = [
      [0, 10],
      [1, 20],
      [2, 30],
    ];
    expect(entries(input)).toEqual(expectedResult);
  });

  it("should handle arrays with mixed types", () => {
    const input = [1, "two", true];
    const expectedResult = [
      [0, 1],
      [1, "two"],
      [2, true],
    ];
    expect(entries(input)).toEqual(expectedResult);
  });
});

describe(`${getMin.name}()`, () => {
  it("returns undefined for an empty array", () => {
    const array: number[] = [];
    const result = getMin(array);
    expect(result).toBeUndefined();
  });

  it("handles an array with a single element", () => {
    const array = [42];
    const result = getMin(array);
    expect(result).toBe(42);
  });

  it("correctly identifies the minimum value when it is at the beginning of the array", () => {
    const array = [1, 2, 3, 4, 5];
    const result = getMin(array);
    expect(result).toBe(1);
  });

  it("correctly identifies the minimum value when it is at the end of the array", () => {
    const array = [2, 3, 4, 5, 1];
    const result = getMin(array);
    expect(result).toBe(1);
  });

  it("handles an array with all elements being the same value", () => {
    const array = [2, 2, 2, 2, 2];
    const result = getMin(array);
    expect(result).toBe(2);
  });

  it("handles an array with negative values", () => {
    const array = [-2, -3, -1, -5];
    const result = getMin(array);
    expect(result).toBe(-5);
  });

  it("returns the minimum value from a non-empty array", () => {
    const array = [5, 1, 4, 2, 3];
    const result = getMin(array);
    expect(result).toBe(1);
  });

  it("finds the minimum value in an array of bigints", () => {
    expect(getMin([2n, 3n, 1n, 4n])).toBe(1n);
  });

  it("finds the minimum value in an array of strings", () => {
    expect(getMin(["b", "c", "a"])).toBe("a");
  });

  it("handles number example", () => {
    const array = [3, 1, 2];
    const result = getMin(array);
    expect(result).toBe(1);
  });

  it("handles bigint example", () => {
    const array = [3n, 1n, 2n];
    const result = getMin(array);
    expect(result).toBe(1n);
  });

  it("handles string example", () => {
    const array = ["d", "b", "c"];
    const result = getMin(array);
    expect(result).toBe("b");
  });
});
