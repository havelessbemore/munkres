import { describe, it, expect } from "vitest";

import { getMin } from "./array";

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
});
