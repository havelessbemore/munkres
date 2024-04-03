import { describe, it, expect } from "vitest";

import { findMin, getMin } from "./array";

describe(`${findMin.name}()`, () => {
  it("returns undefined for an empty array", () => {
    const array: number[] = [];
    const result = findMin(array);
    expect(result).toBeUndefined();
  });

  it("handles an array with a single element", () => {
    const array = [42];
    const result = findMin(array);
    expect(result).toBe(0);
  });

  it("correctly identifies the minimum value when it is at the beginning of the array", () => {
    const array = [1, 2, 3, 4, 5];
    const result = findMin(array);
    expect(result).toBe(0);
  });

  it("correctly identifies the minimum value when it is at the end of the array", () => {
    const array = [2, 3, 4, 5, 1];
    const result = findMin(array);
    expect(result).toBe(4);
  });

  it("handles an array with all elements being the same value", () => {
    const array = [2, 2, 2, 2, 2];
    const result = findMin(array);
    expect(result).toBe(0);
  });

  it("handles an array with negative values", () => {
    const array = [-2, -3, -1, -5];
    const result = findMin(array);
    expect(result).toBe(3);
  });

  it("returns the minimum value from a non-empty array", () => {
    const array = [5, 1, 4, 2, 3];
    const result = findMin(array);
    expect(result).toBe(1);
  });

  it("finds the minimum value in an array of bigints", () => {
    expect(findMin([2n, 3n, 1n, 4n])).toBe(2);
  });

  it("finds the minimum value in an array of strings", () => {
    expect(findMin(["b", "c", "a"])).toBe(2);
  });

  it("handles number example", () => {
    const array = [3, 1, 2];
    const result = findMin(array);
    expect(result).toBe(1);
  });

  it("handles bigint example", () => {
    const array = [3n, 1n, 2n];
    const result = findMin(array);
    expect(result).toBe(1);
  });

  it("handles string example", () => {
    const array = ["d", "b", "c"];
    const result = findMin(array);
    expect(result).toBe(1);
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
